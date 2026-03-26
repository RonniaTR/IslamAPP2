import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Sparkles, ChevronDown, ChevronUp, Loader, Loader2, Globe, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import api from '../api';

const RELIGION_COLORS = {
  'islam': '#10B981',
  'christianity': '#3B82F6',
  'judaism': '#F59E0B',
  'hadith': '#8B5CF6',
};

const RELIGION_LABELS = {
  'islam': { name: 'İslam', icon: '☪️', source: "Kur'an-ı Kerim" },
  'christianity': { name: 'Hristiyanlık', icon: '✝️', source: 'İncil' },
  'judaism': { name: 'Yahudilik', icon: '✡️', source: 'Tevrat' },
  'hadith': { name: 'Hadis', icon: '📖', source: 'Hadis-i Şerif' },
};

const CATEGORY_LABELS = {
  inanc: { label: 'İnanç Esasları', icon: '🕌' },
  ibadet: { label: 'İbadet', icon: '🤲' },
  ahlak: { label: 'Ahlak & Değerler', icon: '💚' },
  toplum: { label: 'Toplum & Yaşam', icon: '🏛️' },
};

export default function ComparativePage() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicData, setTopicData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [expandedReligion, setExpandedReligion] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Phase 3 topics (50 topics) with categories fallback to Phase 1 topics
  useEffect(() => {
    Promise.all([
      api.get('/comparative/v2/topics').catch(() => ({ data: [] })),
      api.get('/comparative/v2/categories').catch(() => ({ data: [] })),
      api.get('/comparative/topics').catch(() => ({ data: [] })),
    ]).then(([v2Topics, v2Cats, v1Topics]) => {
      const t2 = Array.isArray(v2Topics.data) ? v2Topics.data : [];
      const t1 = Array.isArray(v1Topics.data) ? v1Topics.data : [];
      setTopics(t2.length > 0 ? t2 : t1);
      setCategories(Array.isArray(v2Cats.data) ? v2Cats.data : []);
      setLoading(false);
    });
  }, []);

  const filteredTopics = useMemo(() => {
    let filtered = topics;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(t =>
        (t.name || t.title || '').toLowerCase().includes(q) ||
        (t.name_en || '').toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [topics, selectedCategory, searchQuery]);

  const loadTopic = async (topicId) => {
    setSelectedTopic(topicId);
    setTopicData(null);
    setAiAnalysis('');
    setExpandedReligion(null);
    try {
      // Try Phase 3 endpoint first
      const { data } = await api.get(`/comparative/v2/topic/${topicId}?lang=${lang}`);
      setTopicData(data);
    } catch {
      try {
        const { data } = await api.get(`/comparative/topic/${topicId}`);
        setTopicData(data);
      } catch {}
    }
  };

  const getAiAnalysis = async () => {
    if (!selectedTopic || aiLoading) return;
    setAiLoading(true);
    try {
      // Try Phase 3 deep analysis first
      const { data } = await api.post(`/comparative/v2/ai-analyze?topic_id=${selectedTopic}&lang=${lang}`);
      setAiAnalysis(data.deep_analysis || data.analysis || data.response || '');
    } catch {
      try {
        const { data } = await api.post('/comparative/ai-compare', { topic_id: selectedTopic });
        setAiAnalysis(data.analysis || data.response || '');
      } catch { setAiAnalysis('AI analizi şu an kullanılamıyor.'); }
    }
    setAiLoading(false);
  };

  const formatText = (text) => {
    if (!text) return '';
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  // ─── TOPIC LIST ───
  if (!selectedTopic) return (
    <div className="min-h-screen pb-4" style={{ background: theme.bg }}>
      <div className="px-4 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl" style={{ background: theme.inputBg }}>
            <ArrowLeft size={18} style={{ color: theme.textPrimary }} />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>Karşılaştırmalı Dinler</h1>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              {topics.length} konu · Kur'an, İncil ve Tevrat'ta ortak konular
            </p>
          </div>
          <Globe size={24} className="ml-auto" style={{ color: theme.gold }} />
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textSecondary }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Konu ara..."
            className="w-full rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none"
            style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary }} />
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-4 mt-3 mb-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1">
          <button onClick={() => setSelectedCategory('all')}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={selectedCategory === 'all'
              ? { background: `${theme.gold}20`, color: theme.gold, border: `1px solid ${theme.gold}30` }
              : { background: theme.inputBg, color: theme.textSecondary, border: `1px solid ${theme.inputBorder}` }}>
            Tümü ({topics.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([id, cat]) => {
            const count = topics.filter(t => t.category === id).length;
            if (count === 0) return null;
            return (
              <button key={id} onClick={() => setSelectedCategory(id)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={selectedCategory === id
                  ? { background: `${theme.gold}20`, color: theme.gold, border: `1px solid ${theme.gold}30` }
                  : { background: theme.inputBg, color: theme.textSecondary, border: `1px solid ${theme.inputBorder}` }}>
                {cat.icon} {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="px-4">
        {loading ? (
          <div className="flex justify-center py-8"><Loader className="animate-spin" style={{ color: theme.gold }} /></div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: theme.textSecondary }}>Konu bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredTopics.map((topic, i) => (
              <motion.button key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => loadTopic(topic.id)}
                className="rounded-xl p-3 border text-left"
                style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
                <div className="text-xl mb-1.5">{topic.icon || '📖'}</div>
                <div className="text-sm font-semibold leading-tight" style={{ color: theme.textPrimary }}>
                  {topic.name || topic.title}
                </div>
                {topic.category && CATEGORY_LABELS[topic.category] && (
                  <div className="text-[9px] mt-1 px-1.5 py-0.5 rounded-full inline-block"
                    style={{ background: `${theme.gold}10`, color: theme.textSecondary }}>
                    {CATEGORY_LABELS[topic.category].label}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ─── TOPIC DETAIL ───
  const topicName = topicData?.topic?.name || topicData?.name || topicData?.title || 'Konu';
  const comparisonText = topicData?.comparison || topicData?.response || '';
  const religions = topicData?.sources || {};
  const hasStructuredData = Object.keys(religions).length > 0;

  return (
    <div className="min-h-screen pb-4" style={{ background: theme.bg }}>
      <div className="px-4 pt-6 pb-4" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedTopic(null); setTopicData(null); setAiAnalysis(''); }} className="p-2 rounded-xl" style={{ background: theme.inputBg }}>
            <ArrowLeft size={18} style={{ color: theme.textPrimary }} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{topicName}</h1>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Karşılaştırmalı inceleme</p>
          </div>
        </div>
      </div>

      {!topicData ? (
        <div className="flex justify-center py-12"><Loader className="animate-spin" style={{ color: theme.gold }} /></div>
      ) : (
        <div className="px-4 mt-4 space-y-3">
          {/* Comparison Text (from AI v2 response) */}
          {comparisonText && !hasStructuredData && (
            <div className="rounded-xl border p-4" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} style={{ color: theme.gold }} />
                <h3 className="text-sm font-semibold" style={{ color: theme.gold }}>Karşılaştırmalı Analiz</h3>
              </div>
              <div className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}
                dangerouslySetInnerHTML={{ __html: formatText(comparisonText) }} />
            </div>
          )}

          {/* Religion Cards (structured data from v1) */}
          {hasStructuredData && Object.entries(religions).map(([key, data]) => {
            const rel = RELIGION_LABELS[key] || { name: key, icon: '📖', source: key };
            const color = RELIGION_COLORS[key] || theme.gold;
            const isExpanded = expandedReligion === key;

            return (
              <div key={key} className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}40` }}>
                <button onClick={() => setExpandedReligion(isExpanded ? null : key)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                  style={{ background: `${color}10` }}>
                  <span className="text-xl">{rel.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{rel.name}</div>
                    <div className="text-[11px]" style={{ color: theme.textSecondary }}>{rel.source}</div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} style={{ color: theme.textSecondary }} /> : <ChevronDown size={16} style={{ color: theme.textSecondary }} />}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="p-4 space-y-3" style={{ background: theme.cardBg }}>
                        {data.original && (
                          <div className="rounded-lg p-3" style={{ background: theme.inputBg }}>
                            <div className="text-[10px] font-medium mb-1" style={{ color }}>Orijinal Metin</div>
                            <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary, fontFamily: key === 'islam' ? 'Amiri, serif' : 'inherit', direction: (key === 'islam' || key === 'judaism') ? 'rtl' : 'ltr' }}>
                              {data.original}
                            </p>
                          </div>
                        )}
                        {data.translation && (
                          <div>
                            <div className="text-[10px] font-medium mb-1" style={{ color: theme.textSecondary }}>Türkçe Çeviri</div>
                            <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{data.translation}</p>
                          </div>
                        )}
                        {data.reference && (
                          <div className="text-[11px] pt-2 border-t" style={{ color: theme.textSecondary, borderColor: theme.cardBorder }}>
                            📍 {data.reference}
                          </div>
                        )}
                        {typeof data === 'string' && (
                          <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{data}</p>
                        )}
                        {data.text && (
                          <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{data.text}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* AI Analysis Button */}
          <div className="rounded-xl border p-4" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} style={{ color: theme.gold }} />
              <h3 className="text-sm font-semibold" style={{ color: theme.gold }}>AI Derinlemesine Analiz</h3>
            </div>
            {!aiAnalysis ? (
              <button onClick={getAiAnalysis} disabled={aiLoading}
                className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                style={{ background: `${theme.gold}20`, color: theme.gold }}>
                {aiLoading ? <><Loader2 size={14} className="animate-spin" /> Analiz ediliyor...</> : <><Sparkles size={14} /> Bu konuyu AI ile analiz et</>}
              </button>
            ) : (
              <div className="text-sm leading-relaxed mt-2" style={{ color: theme.textPrimary }}
                dangerouslySetInnerHTML={{ __html: formatText(aiAnalysis) }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
