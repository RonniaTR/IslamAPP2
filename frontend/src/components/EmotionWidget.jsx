import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BookOpen, Sparkles, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EMOTIONS } from '../data/emotionMap';
import { ARTICLES } from '../data/articles';
import { useField } from '../services/contentI18n';
import { useTx } from '../i18n';

/**
 * 💚 Duygu → İlim Bağlayıcısı
 * Ana sayfa widget'ı: "Bugün nasıl hissediyorsun?" → duyguya göre
 * ayet + dua + kütüphaneden makale önerisi. Var olan içerikleri
 * eşleştirir, retention odaklı bir mikro-etkileşim.
 */
export default function EmotionWidget({ theme }) {
  const navigate = useNavigate();
  const f = useField();
  const tt = useTx();
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(true);

  const pick = useCallback((emotion) => {
    setSelected(emotion);
    setOpen(true);
    try { localStorage.setItem('last_emotion', emotion.id); } catch { /* ignore */ }
  }, []);

  const article = selected ? ARTICLES.find(a => a.id === selected.articleId) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-5 rounded-2xl overflow-hidden"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      data-testid="emotion-widget">
      {/* Başlık */}
      <div className="p-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${theme.gold}12` }}>
            <Heart size={16} style={{ color: theme.gold }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
              {tt('Bugün nasıl hissediyorsun?')}
            </p>
            <p className="text-[10px]" style={{ color: theme.textSecondary }}>{tt('Kalbine bir ayet, bir dua, bir yol')}</p>
          </div>
        </div>
        {selected && (
          <button onClick={() => { setSelected(null); setOpen(true); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90"
            style={{ background: `${theme.textSecondary}12` }} aria-label={tt('Sıfırla')}>
            <X size={13} style={{ color: theme.textSecondary }} />
          </button>
        )}
      </div>

      {/* Duygu seçici */}
      {!selected && (
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {EMOTIONS.map((e, i) => (
              <motion.button key={e.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => pick(e)}
                className="shrink-0 flex flex-col items-center gap-1 py-2.5 px-3 rounded-2xl active:scale-95"
                style={{ background: `${e.color}0d`, border: `1px solid ${e.color}30`, minWidth: 72 }}>
                <span className="text-2xl">{e.emoji}</span>
                <span className="text-[9px] font-bold" style={{ color: theme.textPrimary }}>{f(e, 'label')}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Cevap kartları */}
      <AnimatePresence>
        {selected && open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3">
              {/* Seçilen duygu şeridi */}
              <div className="flex items-center gap-2 -mt-1">
                <span className="text-2xl">{selected.emoji}</span>
                <span className="text-xs font-bold" style={{ color: selected.color }}>{f(selected, 'label')}</span>
                <span className="text-[10px] ml-auto" style={{ color: theme.textSecondary }}>{tt('Sana özel 3 kart')}</span>
              </div>

              {/* Ayet kartı */}
              <div className="rounded-xl p-3.5 relative"
                style={{ background: `${selected.color}0a`, border: `1px solid ${selected.color}25`, borderLeft: `3px solid ${selected.color}` }}>
                <p className="text-[9px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1"
                  style={{ color: selected.color }}>
                  <BookOpen size={10} /> {tt('Bir Ayet')}
                </p>
                <p className="text-sm italic leading-relaxed" style={{ fontFamily: 'Georgia, serif', color: theme.textPrimary }}>
                  {(f(selected, 'verse') || selected.verse).text}
                </p>
                <p className="text-[10px] mt-1.5 font-bold" style={{ color: selected.color }}>{(f(selected, 'verse') || selected.verse).source}</p>
              </div>

              {/* Dua kartı */}
              <div className="rounded-xl p-3.5"
                style={{ background: `${theme.gold}0a`, border: `1px solid ${theme.gold}25`, borderLeft: `3px solid ${theme.gold}` }}>
                <p className="text-[9px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1"
                  style={{ color: theme.gold }}>
                  <Sparkles size={10} /> {tt('Bir Dua')}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>
                  {f(selected, 'dua')}
                </p>
                <p className="text-[10px] mt-1.5 font-bold" style={{ color: theme.gold }}>{f(selected, 'duaSrc')}</p>
              </div>

              {/* Makale önerisi */}
              {article && (
                <button onClick={() => navigate('/library')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left active:scale-98 transition-transform"
                  style={{ background: `linear-gradient(140deg, ${article.grad[0]}, ${article.grad[1]})`, border: `1px solid ${theme.cardBorder}` }}>
                  <span className="text-2xl">{article.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-wider" style={{ color: '#ffd369' }}>{tt('Sana Bir Yol')}</p>
                    <p className="text-xs font-bold truncate" style={{ color: '#f7e6ae' }}>{f(article, 'title')}</p>
                  </div>
                  <ChevronRight size={15} style={{ color: '#ffd369' }} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
