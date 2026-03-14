import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Sparkles, ChevronDown, ChevronUp, Loader, Globe, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
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

export default function ComparativePage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicData, setTopicData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [expandedReligion, setExpandedReligion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/comparative/topics').then(r => {
      setTopics(Array.isArray(r.data) ? r.data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const loadTopic = async (topicId) => {
    setSelectedTopic(topicId);
    setTopicData(null);
    setAiAnalysis('');
    setExpandedReligion(null);
    try {
      const { data } = await api.get(`/comparative/topic/${topicId}`);
      setTopicData(data);
    } catch {}
  };

  const getAiAnalysis = async () => {
    if (!selectedTopic || aiLoading) return;
    setAiLoading(true);
    try {
      const { data } = await api.post('/comparative/ai-compare', { topic_id: selectedTopic });
      setAiAnalysis(data.analysis || data.response || '');
    } catch { setAiAnalysis('AI analizi şu an kullanılamıyor.'); }
    setAiLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const { data } = await api.get(`/comparative/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(data);
    } catch { setSearchResults(null); }
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
            <p className="text-xs" style={{ color: theme.textSecondary }}>Kur'an, İncil ve Tevrat'ta ortak konular</p>
          </div>
          <Globe size={24} className="ml-auto" style={{ color: theme.gold }} />
        </div>

        {/* Search */}
        <div className="flex gap-2 mt-3">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Konu veya ayet ara..."
            className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary }} />
          <button onClick={handleSearch} className="p-2.5 rounded-xl" style={{ background: theme.gold }}>
            <Search size={18} color="#000" />
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="px-4 mt-3">
          <h3 className="text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>Arama Sonuçları</h3>
          {(searchResults.results || []).length === 0 ? (
            <p className="text-xs" style={{ color: theme.textSecondary }}>Sonuç bulunamadı</p>
          ) : (
            <div className="space-y-2">
              {(searchResults.results || []).map((r, i) => (
                <div key={i} className="rounded-xl p-3 border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
                  <div className="text-xs font-medium" style={{ color: theme.gold }}>{r.topic}</div>
                  <div className="text-xs mt-1" style={{ color: theme.textPrimary }}>{r.text?.substring(0, 150)}...</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Topics Grid */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: theme.textPrimary }}>Konular</h3>
        {loading ? (
          <div className="flex justify-center py-8"><Loader className="animate-spin" style={{ color: theme.gold }} /></div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {topics.map(topic => {
              const topicIcons = { 'creation': '🌍', 'monotheism': '☝️', 'prayer': '🤲', 'charity': '💝', 'fasting': '🌙', 'afterlife': '⭐', 'prophets': '📜', 'justice': '⚖️', 'mercy': '💚', 'patience': '🕊️' };
              return (
                <button key={topic.id} onClick={() => loadTopic(topic.id)}
                  className="rounded-xl p-4 border text-left transition-all hover:scale-[1.02]"
                  style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
                  <div className="text-2xl mb-2">{topicIcons[topic.id] || '📖'}</div>
                  <div className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{topic.name || topic.title}</div>
                  <div className="text-[11px] mt-1" style={{ color: theme.textSecondary }}>{topic.description || '3 din karşılaştırması'}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // ─── TOPIC DETAIL ───
  const religions = topicData?.religions || topicData?.sources || {};

  return (
    <div className="min-h-screen pb-4" style={{ background: theme.bg }}>
      <div className="px-4 pt-6 pb-4" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedTopic(null); setTopicData(null); setAiAnalysis(''); }} className="p-2 rounded-xl" style={{ background: theme.inputBg }}>
            <ArrowLeft size={18} style={{ color: theme.textPrimary }} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{topicData?.name || topicData?.title || 'Konu'}</h1>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Karşılaştırmalı inceleme</p>
          </div>
        </div>
      </div>

      {!topicData ? (
        <div className="flex justify-center py-12"><Loader className="animate-spin" style={{ color: theme.gold }} /></div>
      ) : (
        <div className="px-4 mt-4 space-y-3">
          {/* Religion Cards */}
          {Object.entries(religions).map(([key, data]) => {
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
                {isExpanded && (
                  <div className="p-4 space-y-3" style={{ background: theme.cardBg }}>
                    {/* Original text */}
                    {data.original && (
                      <div className="rounded-lg p-3" style={{ background: theme.inputBg }}>
                        <div className="text-[10px] font-medium mb-1" style={{ color }}>Orijinal Metin</div>
                        <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary, fontFamily: key === 'islam' ? 'Amiri, serif' : 'inherit', direction: (key === 'islam' || key === 'judaism') ? 'rtl' : 'ltr' }}>
                          {data.original}
                        </p>
                      </div>
                    )}
                    {/* Translation */}
                    {data.translation && (
                      <div>
                        <div className="text-[10px] font-medium mb-1" style={{ color: theme.textSecondary }}>Türkçe Çeviri</div>
                        <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{data.translation}</p>
                      </div>
                    )}
                    {/* Source reference */}
                    {data.reference && (
                      <div className="text-[11px] pt-2 border-t" style={{ color: theme.textSecondary, borderColor: theme.cardBorder }}>
                        📍 {data.reference}
                      </div>
                    )}
                    {/* Text content if simple structure */}
                    {typeof data === 'string' && (
                      <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{data}</p>
                    )}
                    {data.text && (
                      <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{data.text}</p>
                    )}
                  </div>
                )}
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
                {aiLoading ? <><Loader size={14} className="animate-spin" /> Analiz ediliyor...</> : <><Sparkles size={14} /> Bu konuyu AI ile analiz et</>}
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
