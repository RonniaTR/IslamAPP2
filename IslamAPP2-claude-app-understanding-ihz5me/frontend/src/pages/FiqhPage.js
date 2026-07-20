import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft, Search, MessageCircle, Droplets, Moon as MoonIcon, Clock, Sparkles, Send, Loader, X, ShowerHead, BookMarked } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

const CATEGORY_ICONS = { abdest: Droplets, namaz: BookOpen, oruc: MoonIcon, gunluk_ibadet: Clock, temizlik: ShowerHead };

export default function FiqhPage() {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [askMode, setAskMode] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    api.get('/fiqh/categories').then(r => {
      setCategories(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const loadCategory = useCallback(async (catId) => {
    try {
      const r = await api.get(`/fiqh/category/${catId}`);
      setSelectedCat(r.data);
    } catch { /* fallback to local */ }
  }, []);

  const askQuestion = useCallback(async () => {
    if (!question.trim() || asking) return;
    setAsking(true);
    setAnswer(null);
    try {
      const r = await api.post('/fiqh/ask', { question: question.trim(), category: selectedCat?.id }, { timeout: 30000 });
      setAnswer(r.data);
    } catch {
      setAnswer({ answer: 'Şu an cevap oluşturulamıyor. Lütfen daha sonra tekrar deneyin.', error: true });
    }
    setAsking(false);
  }, [question, asking, selectedCat]);

  // ── Topic Detail View ──
  if (selectedTopic) {
    return (
      <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
        <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3" style={{ background: theme.bg, borderBottom: `1px solid ${theme.cardBorder}` }}>
          <button onClick={() => setSelectedTopic(null)} className="p-2 rounded-xl" style={{ background: theme.surface }}>
            <ChevronLeft size={20} style={{ color: theme.gold }} />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{selectedTopic.title}</h1>
            <p className="text-xs" style={{ color: theme.textSecondary }}>{selectedCat?.title}</p>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-5">
          <div className="rounded-2xl p-5" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <div className="prose prose-invert max-w-none" style={{ color: theme.textPrimary }}>
              {selectedTopic.content.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <h3 key={i} className="text-base font-bold mt-4 mb-2" style={{ color: theme.gold }}>{line.replace(/\*\*/g, '')}</h3>;
                }
                if (line.match(/^\d+\./)) {
                  return <p key={i} className="ml-2 mb-1 text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                }
                if (line.startsWith('- ')) {
                  return <p key={i} className="ml-4 mb-1 text-sm" style={{ color: theme.textSecondary }}>{line}</p>;
                }
                if (line.startsWith('*') && line.endsWith('*')) {
                  return <p key={i} className="text-xs italic mt-1" style={{ color: theme.textSecondary }}>{line.replace(/\*/g, '')}</p>;
                }
                if (line.trim() === '') return <div key={i} className="h-2" />;
                return <p key={i} className="text-sm leading-relaxed mb-1" style={{ color: theme.textPrimary }}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Category Topics View ──
  if (selectedCat) {
    return (
      <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
        <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3" style={{ background: theme.bg, borderBottom: `1px solid ${theme.cardBorder}` }}>
          <button onClick={() => setSelectedCat(null)} className="p-2 rounded-xl" style={{ background: theme.surface }}>
            <ChevronLeft size={20} style={{ color: theme.gold }} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{selectedCat.icon} {selectedCat.title}</h1>
            <p className="text-xs" style={{ color: theme.textSecondary }}>{selectedCat.description}</p>
          </div>
        </div>

        <div className="px-4 py-4 space-y-3">
          {selectedCat.topics?.map((topic, i) => (
            <motion.button key={topic.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedTopic(topic)}
              className="w-full text-left rounded-2xl p-4 flex items-center gap-3"
              style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${theme.gold}15` }}>
                <BookMarked size={18} style={{ color: theme.gold }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: theme.textPrimary }}>{topic.title}</p>
              </div>
              <ChevronRight size={18} style={{ color: theme.textSecondary }} />
            </motion.button>
          ))}
        </div>

        {/* AI Mufti Button */}
        <div className="px-4 mt-4">
          <button onClick={() => setAskMode(true)}
            className="w-full rounded-2xl p-4 flex items-center gap-3"
            style={{ background: `linear-gradient(135deg, ${theme.gold}20, ${theme.gold}08)`, border: `1px solid ${theme.gold}30` }}>
            <MessageCircle size={20} style={{ color: theme.gold }} />
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm" style={{ color: theme.gold }}>Soru Sor (AI Müftü)</p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>Hanefi fıkhına göre cevap al</p>
            </div>
            <Sparkles size={16} style={{ color: theme.gold }} />
          </button>
        </div>

        {/* AI Ask Modal */}
        <AnimatePresence>
          {askMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                className="w-full max-w-[520px] rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
                style={{ background: theme.surface }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color: theme.gold }}>⚖️ AI Müftü</h3>
                  <button onClick={() => { setAskMode(false); setAnswer(null); }} className="p-2 rounded-xl" style={{ background: theme.bg }}>
                    <X size={18} style={{ color: theme.textSecondary }} />
                  </button>
                </div>
                <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>Hanefi mezhebine göre Kur'an ve Hadis kaynaklı cevaplar</p>

                <div className="flex gap-2 mb-4">
                  <input value={question} onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && askQuestion()}
                    placeholder="Sorunuzu yazın..."
                    className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: theme.bg, color: theme.textPrimary, border: `1px solid ${theme.cardBorder}` }}
                    maxLength={2000} />
                  <button onClick={askQuestion} disabled={asking || !question.trim()}
                    className="px-4 rounded-xl flex items-center justify-center"
                    style={{ background: theme.gold, opacity: asking || !question.trim() ? 0.5 : 1 }}>
                    {asking ? <Loader size={18} className="animate-spin" style={{ color: '#070D18' }} /> : <Send size={18} style={{ color: '#070D18' }} />}
                  </button>
                </div>

                {asking && (
                  <div className="text-center py-8">
                    <Loader size={24} className="animate-spin mx-auto mb-2" style={{ color: theme.gold }} />
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Cevap hazırlanıyor...</p>
                  </div>
                )}

                {answer && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-4 mt-2" style={{ background: theme.bg, border: `1px solid ${theme.cardBorder}` }}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: theme.textPrimary }}>
                      {answer.answer}
                    </p>
                    {answer.sources && (
                      <div className="mt-3 pt-3 flex flex-wrap gap-2" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                        {answer.sources.map((s, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 rounded-lg" style={{ background: `${theme.gold}15`, color: theme.gold }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Main Category List ──
  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>İslami Bilgi</h1>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>Hanefi fıkhına göre ibadet rehberi</p>
      </div>

      {/* Arabic Header */}
      <div className="mx-5 mb-5 rounded-2xl p-5 text-center" style={{ background: `linear-gradient(135deg, ${theme.surface}, rgba(200,165,90,0.08))`, border: `1px solid ${theme.cardBorder}` }}>
        <p className="text-2xl mb-2" style={{ fontFamily: 'Amiri, serif', color: theme.gold, direction: 'rtl' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        <p className="text-xs" style={{ color: theme.textSecondary }}>Rahman ve Rahim olan Allah'ın adıyla</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size={24} className="animate-spin" style={{ color: theme.gold }} />
        </div>
      ) : (
        <div className="px-5 space-y-3">
          {categories.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.id] || BookOpen;
            return (
              <motion.button key={cat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => loadCategory(cat.id)}
                className="w-full text-left rounded-2xl p-4 flex items-center gap-4"
                style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg" style={{ background: `${theme.gold}12` }}>
                  <span>{cat.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm" style={{ color: theme.textPrimary }}>{cat.title}</p>
                    <span className="text-sm" style={{ fontFamily: 'Amiri, serif', color: theme.gold }}>{cat.arabic}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>{cat.description}</p>
                  <p className="text-[10px] mt-1" style={{ color: theme.gold }}>{cat.topic_count} konu</p>
                </div>
                <ChevronRight size={18} style={{ color: theme.textSecondary }} />
              </motion.button>
            );
          })}

          {/* AI Mufti Card */}
          <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            onClick={() => { setAskMode(true); }}
            className="w-full text-left rounded-2xl p-5"
            style={{ background: `linear-gradient(135deg, ${theme.gold}18, ${theme.gold}05)`, border: `1px solid ${theme.gold}25` }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${theme.gold}20` }}>
                <Sparkles size={22} style={{ color: theme.gold }} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: theme.gold }}>AI Müftü'ye Sor</p>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>Kur'an ve Hadis kaynaklı, Hanefi görüşüne göre cevap</p>
              </div>
              <MessageCircle size={20} style={{ color: theme.gold }} />
            </div>
          </motion.button>
        </div>
      )}
    </div>
  );
}
