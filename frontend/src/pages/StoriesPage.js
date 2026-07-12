import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Pause, Loader, Sparkles, Check, Star, ChevronRight, Lightbulb } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTTS } from '../hooks/useShared';
import { awardXPOnce } from '../services/gamification';
import { STORIES, STORY_CATEGORIES } from '../data/stories';
import Confetti from './games/Confetti';

// 🕯️ İBRETLİK HİKAYELER — kıssa → düşündürücü soru → hikmet.
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };

function Cover({ s, h = 120 }) {
  return (
    <div className="w-full rounded-t-2xl relative overflow-hidden flex items-center justify-center" style={{ height: h, background: `linear-gradient(140deg, ${s.grad[0]}, ${s.grad[1]})` }}>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #ffd36960, transparent 65%)' }} />
      <span className="text-5xl" style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))' }}>{s.emoji}</span>
    </div>
  );
}

export default function StoriesPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const tts = useTTS();
  const [openId, setOpenId] = useState(null);
  const [readIds, setReadIds] = useState(() => load('story_read', []));
  // Okuma akışı: reading -> question -> lesson
  const [phase, setPhase] = useState('reading');
  const [picked, setPicked] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const scrollRef = useRef(null);

  const story = STORIES.find(s => s.id === openId);

  const openStory = useCallback((id) => {
    tts.stop(); setOpenId(id); setPhase('reading'); setPicked(null);
    const main = document.querySelector('main'); if (main) main.scrollTo({ top: 0 });
  }, [tts]);

  const closeStory = useCallback(() => { tts.stop(); setOpenId(null); }, [tts]);

  const pickAnswer = useCallback((i) => {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(() => {
      setPhase('lesson');
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1800);
      if (story && !readIds.includes(story.id)) {
        const next = [...readIds, story.id];
        setReadIds(next); save('story_read', next);
        awardXPOnce(user, `story_${story.id}`, 'hadith_read', { points: 12, details: story.title });
      }
    }, 650);
  }, [picked, story, readIds, user]);

  const speak = useCallback(() => {
    if (!story) return;
    const text = [story.title, ...story.paragraphs].join('. ');
    tts.speak(text);
  }, [story, tts]);

  useEffect(() => { if (openId) { const m = document.querySelector('main'); if (m) m.scrollTo({ top: 0 }); } }, [phase, openId]);

  // ═══ OKUMA GÖRÜNÜMÜ ═══
  if (story) {
    return (
      <div ref={scrollRef} className="min-h-screen pb-28" style={{ background: theme.bg }}>
        {celebrate && <Confetti count={26} />}
        {/* Kapak */}
        <div className="relative overflow-hidden flex items-center justify-center" style={{ height: 130, background: `linear-gradient(140deg, ${story.grad[0]}, ${story.grad[1]})` }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #ffd36960, transparent 65%)' }} />
          <span className="text-6xl" style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.4))' }}>{story.emoji}</span>
          <button onClick={closeStory} className="absolute top-4 left-4 w-9 h-9 rounded-xl flex items-center justify-center active:scale-90" style={{ background: 'rgba(0,0,0,0.35)' }} aria-label="Geri">
            <ArrowLeft size={18} style={{ color: '#f7e6ae' }} />
          </button>
        </div>

        {/* Başlık */}
        <div className="px-6 pt-6 pb-2 text-center max-w-[42rem] mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.gold }}>
            {STORY_CATEGORIES.find(c => c.id === story.cat)?.title}
          </p>
          <h1 className="text-[1.7rem] leading-tight font-black mt-2" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: theme.textPrimary }}>{story.title}</h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-px w-10" style={{ background: `${theme.gold}50` }} />
            <button onClick={() => (tts.playing ? tts.stop() : speak())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black active:scale-95"
              style={{ background: `${theme.gold}14`, border: `1px solid ${theme.gold}35`, color: theme.gold }}>
              {tts.loading ? <Loader size={11} className="animate-spin" /> : tts.playing ? <Pause size={11} /> : <Volume2 size={11} />}
              {tts.playing ? 'Durdur' : 'Dinle'}
            </button>
            <span className="h-px w-10" style={{ background: `${theme.gold}50` }} />
          </div>
        </div>

        {/* Metin */}
        <div className="px-6 pt-4 max-w-[42rem] mx-auto article-body" style={{ fontSize: 17.5, color: `${theme.textPrimary}f0`, '--gold': theme.gold }}>
          {story.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {/* Düşündürücü soru */}
        <div className="px-6 max-w-[42rem] mx-auto mt-2">
          <AnimatePresence mode="wait">
            {phase !== 'lesson' ? (
              <motion.div key="q" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-2xl p-5 mt-2" style={{ background: `${theme.gold}0a`, border: `1.5px solid ${theme.gold}30` }}>
                <p className="text-[10px] font-black uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: theme.gold }}>
                  <Sparkles size={12} /> Sen ne düşünürsün?
                </p>
                <p className="text-base font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: theme.textPrimary }}>{story.question}</p>
                <div className="space-y-2.5">
                  {story.choices.map((c, i) => {
                    const chosen = picked === i;
                    const isCorrect = picked !== null && i === story.correct;
                    return (
                      <button key={i} onClick={() => pickAnswer(i)} disabled={picked !== null}
                        className="w-full text-left p-3.5 rounded-xl text-sm font-semibold transition-all active:scale-98 flex items-center justify-between gap-2"
                        style={{
                          background: isCorrect ? '#10B98118' : chosen ? '#EF444418' : `${theme.textSecondary}0c`,
                          border: `1px solid ${isCorrect ? '#10B981' : chosen ? '#EF4444' : theme.cardBorder}`,
                          color: theme.textPrimary,
                        }}>
                        <span>{c}</span>
                        {isCorrect && <Check size={16} style={{ color: '#10B981', flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] mt-3 text-center" style={{ color: theme.textSecondary }}>Bir seçenek seç, hikmet açılsın</p>
              </motion.div>
            ) : (
              <motion.div key="l" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.35 }}
                className="rounded-2xl p-5 mt-2 relative overflow-hidden"
                style={{ background: `linear-gradient(160deg, ${theme.gold}14, ${theme.surface})`, border: `1.5px solid ${theme.gold}45` }}>
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${theme.gold}, transparent 65%)` }} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 flex items-center gap-1.5 relative" style={{ color: theme.gold }}>
                  <Lightbulb size={13} /> Hikmet
                </p>
                <p className="text-[15px] leading-[1.8] relative" style={{ fontFamily: 'Georgia, serif', color: theme.textPrimary }}>{story.lesson}</p>
                {story.verse && (
                  <div className="mt-4 pt-3 relative" style={{ borderTop: `1px solid ${theme.gold}25` }}>
                    <p className="text-sm italic leading-relaxed" style={{ color: `${theme.textPrimary}dd` }}>{story.verse.text}</p>
                    <p className="text-[11px] mt-1.5 font-bold" style={{ color: theme.gold }}>— {story.verse.source}</p>
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-4 relative">
                  <Check size={14} style={{ color: '#10B981' }} />
                  <span className="text-xs font-bold" style={{ color: '#10B981' }}>Okundu · +12 XP</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sıradaki hikaye */}
          {phase === 'lesson' && (() => {
            const next = STORIES.find(s => !readIds.includes(s.id) && s.id !== story.id) || STORIES.find(s => s.id !== story.id);
            if (!next) return null;
            return (
              <button onClick={() => openStory(next.id)} className="w-full flex items-center gap-3 p-3 rounded-2xl text-left active:scale-98 transition-transform mt-4"
                style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                <span className="text-2xl">{next.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold uppercase" style={{ color: theme.textSecondary }}>Sıradaki kıssa</p>
                  <p className="text-xs font-black truncate" style={{ color: theme.textPrimary }}>{next.title}</p>
                </div>
                <ChevronRight size={15} style={{ color: theme.gold }} />
              </button>
            );
          })()}
        </div>
      </div>
    );
  }

  // ═══ HİKAYE LİSTESİ ═══
  return (
    <div className="min-h-screen pb-24 max-w-4xl mx-auto" style={{ background: theme.bg }}>
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🕯️</span>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>İbretlik Hikayeler</h1>
        </div>
        <p className="text-xs" style={{ color: theme.textSecondary }}>Bir kıssa, bir soru, bir hikmet · {readIds.length}/{STORIES.length} okundu</p>
      </div>

      {STORY_CATEGORIES.map((cat, ci) => {
        const items = STORIES.filter(s => s.cat === cat.id);
        if (!items.length) return null;
        return (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.06 }} className="mb-6">
            <p className="px-5 text-sm font-black mb-2.5" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{cat.emoji} {cat.title}</p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-1 md:grid md:grid-cols-3 md:overflow-visible">
              {items.map(s => {
                const isRead = readIds.includes(s.id);
                return (
                  <button key={s.id} onClick={() => openStory(s.id)}
                    className="shrink-0 w-48 md:w-auto rounded-2xl overflow-hidden text-left active:scale-97 transition-transform relative"
                    style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
                    <Cover s={s} />
                    {isRead && <span className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#10B981' }}><Check size={13} color="#fff" /></span>}
                    <div className="p-3">
                      <p className="text-xs font-black leading-snug mb-1" style={{ color: theme.textPrimary }}>{s.title}</p>
                      <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                        <Star size={9} style={{ color: theme.gold }} /> {s.read} dk · düşündüren son
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
