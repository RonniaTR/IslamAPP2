import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Pause, Loader, Sparkles, Check, ChevronRight, ChevronDown, Lightbulb, Moon, Gem, HeartHandshake, Type } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTTS } from '../hooks/useShared';
import { awardXPOnce } from '../services/gamification';
import { useReadingSettings } from '../services/readingSettings';
import ReadingSettingsSheet from '../components/ReadingSettingsSheet';
import { STORIES, STORY_CATEGORIES, STORY_GEMS, STORY_APPLY } from '../data/stories';
import Confetti from './games/Confetti';
import KissaListe, { KissaKapak } from './kissa/KissaListe';

// 🕯️ İBRETLİK HİKAYELER — kıssa → düşündürücü soru → hikmet.
// 🌌 Katmanlı kıssalar: paragraflar checkpoint duraklarıyla adım adım açılır;
//    okur soruya cevap vermeden devamı görünmez, cevaptan sonra "iç görü" açılır.
// 💎 Her tamamlanan kıssa bir Hikmet Cevheri kazandırır (gc_gems).
// 🤲 "Hayata Taşı": kıssanın bugün yapılabilir küçük amel önerisi (+8 XP).
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };

// ─── Checkpoint durağı: soru → iç görü → devam ───
function Checkpoint({ cp, idx, answered, picked, onPick, onContinue, theme }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 my-5 relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, #312E8114, ${theme.surface})`, border: `1.5px solid #818CF845` }}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5" style={{ color: '#818CF8' }}>
        <Sparkles size={12} /> Durak {idx + 1} · Birlikte düşünelim
      </p>
      <p className="text-[15px] font-bold mb-3" style={{ fontFamily: 'var(--font-okuma)', color: theme.textPrimary }}>{cp.q}</p>
      {!answered ? (
        <div className="space-y-2">
          {cp.choices.map((c, i) => (
            <button key={i} onClick={() => onPick(i)}
              className="w-full text-start p-3 rounded-xl text-sm font-semibold transition-all active:scale-98"
              style={{ background: `${theme.textSecondary}0c`, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }}>
              {c}
            </button>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="space-y-2 mb-3">
            {cp.choices.map((c, i) => {
              const isCorrect = i === cp.correct; const chosen = picked === i;
              return (
                <div key={i} className="w-full text-start p-3 rounded-xl text-sm font-semibold flex items-center justify-between gap-2"
                  style={{
                    background: isCorrect ? '#10B98115' : chosen ? '#EF444412' : 'transparent',
                    border: `1px solid ${isCorrect ? '#10B981' : chosen ? '#EF4444' : theme.cardBorder}`,
                    color: theme.textPrimary, opacity: isCorrect || chosen ? 1 : 0.5,
                  }}>
                  <span>{c}</span>
                  {isCorrect && <Check size={15} style={{ color: '#10B981', flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
          <div className="rounded-xl p-3.5 mb-3" style={{ background: '#818CF810', border: '1px solid #818CF830' }}>
            <p className="text-[10px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: '#818CF8' }}>
              <Lightbulb size={11} /> İç görü
            </p>
            <p className="text-[13.5px] leading-[1.7]" style={{ fontFamily: 'var(--font-okuma)', color: `${theme.textPrimary}ee` }}>{cp.insight}</p>
          </div>
          <button onClick={onContinue}
            className="w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-1.5 active:scale-98"
            style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: '#fff' }}>
            Kıssanın Devamı <ChevronDown size={15} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function StoriesPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tts = useTTS();
  const [openId, setOpenId] = useState(null);
  const [readIds, setReadIds] = useState(() => load('story_read', []));
  const [gems, setGems] = useState(() => load('gc_gems', {}));
  const [appliedIds, setAppliedIds] = useState(() => load('story_applied', []));
  // Okuma akışı: reading -> lesson (final soru metin altında)
  const [phase, setPhase] = useState('reading');
  const [picked, setPicked] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [gemPop, setGemPop] = useState(false);
  // Katmanlı kıssa durumu
  const [cpOpen, setCpOpen] = useState(0);            // tamamlanan durak sayısı
  const [cpPicked, setCpPicked] = useState({});        // durak -> seçilen şık
  // Okuma ayarları (tema + boyut) — Mushaf/Makale ile ortak
  const { settings: rs, theme: rrt } = useReadingSettings();
  const [showRS, setShowRS] = useState(false);
  const scrollRef = useRef(null);

  const story = STORIES.find(s => s.id === openId);
  const checkpoints = useMemo(() => (story?.checkpoints || []), [story]);
  const allCpDone = cpOpen >= checkpoints.length;
  // Görünen paragraf sınırı: sıradaki durağın 'after' indexine kadar
  const revealLimit = allCpDone ? (story?.paragraphs.length ?? 0) - 1 : checkpoints[cpOpen].after;

  const openStory = useCallback((id) => {
    tts.stop(); setOpenId(id); setPhase('reading'); setPicked(null);
    setCpOpen(0); setCpPicked({}); setGemPop(false);
    const main = document.querySelector('main'); if (main) main.scrollTo({ top: 0 });
  }, [tts]);

  const closeStory = useCallback(() => { tts.stop(); setOpenId(null); }, [tts]);

  const finishStory = useCallback(() => {
    setPhase('lesson');
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 1800);
    if (!story) return;
    if (!readIds.includes(story.id)) {
      const next = [...readIds, story.id];
      setReadIds(next); save('story_read', next);
      awardXPOnce(user, `story_${story.id}`, 'hadith_read', { points: story.deep ? 20 : 12, details: story.title });
    }
    if (STORY_GEMS[story.id] && !gems[story.id]) {
      const g = { ...gems, [story.id]: Date.now() };
      setGems(g); save('gc_gems', g);
      setTimeout(() => setGemPop(true), 500);
    }
  }, [story, readIds, gems, user]);

  const pickAnswer = useCallback((i) => {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(finishStory, 650);
  }, [picked, finishStory]);

  const pickCheckpoint = useCallback((cpIdx, i) => {
    setCpPicked(prev => (prev[cpIdx] !== undefined ? prev : { ...prev, [cpIdx]: i }));
  }, []);

  const applyTask = useCallback(() => {
    if (!story || appliedIds.includes(story.id)) return;
    const next = [...appliedIds, story.id];
    setAppliedIds(next); save('story_applied', next);
    awardXPOnce(user, `apply_${story.id}`, 'worship_task', { points: 8, details: `Hayata taşı: ${story.title}` });
  }, [story, appliedIds, user]);

  const listenAtNight = useCallback(() => {
    if (!story) return;
    tts.stop();
    save('night_preset', { type: 'story', id: story.id });
    navigate('/night');
  }, [story, tts, navigate]);

  const speak = useCallback(() => {
    if (!story) return;
    const text = [story.title, ...story.paragraphs.slice(0, revealLimit + 1)].join('. ');
    tts.speak(text);
  }, [story, tts, revealLimit]);

  useEffect(() => { if (openId) { const m = document.querySelector('main'); if (m) m.scrollTo({ top: 0 }); } }, [openId]);

  const gemCount = Object.keys(gems).length;

  // ═══ OKUMA GÖRÜNÜMÜ ═══
  if (story) {
    const gem = STORY_GEMS[story.id];
    const applyText = STORY_APPLY[story.id];
    const applied = appliedIds.includes(story.id);
    const isDeep = !!story.deep;
    const activeCp = !allCpDone ? checkpoints[cpOpen] : null;

    return (
      <div ref={scrollRef} className="min-h-screen pb-28" style={{ background: rrt.bg }}>
        {celebrate && <Confetti count={26} />}
        {/* Kapak: kıssaya özgü kemer kapak, kemer biçiminde açılır */}
        <motion.div initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="relative">
          <KissaKapak s={story} h={200} yuvarlak="0" />
          <button onClick={closeStory} className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center active:scale-90" style={{ background: 'rgba(0,0,0,0.35)' }} aria-label="Geri">
            <ArrowLeft size={18} style={{ color: '#f7e6ae' }} />
          </button>
          <button onClick={listenAtNight} className="absolute top-4 right-4 h-10 px-3 rounded-xl flex items-center gap-1.5 active:scale-90" style={{ background: 'rgba(0,0,0,0.35)' }} aria-label="Gece modunda dinle">
            <Moon size={14} style={{ color: '#f7e6ae' }} />
            <span className="text-[11px] font-black" style={{ color: '#f7e6ae' }}>Gece</span>
          </button>
        </motion.div>

        {/* Başlık */}
        <div className="px-6 pt-6 pb-2 text-center max-w-[42rem] mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: isDeep ? '#818CF8' : theme.gold }}>
            {STORY_CATEGORIES.find(c => c.id === story.cat)?.title}
          </p>
          <h1 className="text-[1.7rem] leading-tight font-black mt-2" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: rrt.text }}>{story.title}</h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-px w-10" style={{ background: `${rrt.accent}50` }} />
            <button onClick={() => (tts.playing ? tts.stop() : speak())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black active:scale-95"
              style={{ background: `${rrt.accent}14`, border: `1px solid ${rrt.accent}35`, color: rrt.accent }}>
              {tts.loading ? <Loader size={11} className="animate-spin" /> : tts.playing ? <Pause size={11} /> : <Volume2 size={11} />}
              {tts.playing ? 'Durdur' : 'Dinle'}
            </button>
            <button onClick={() => setShowRS(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black active:scale-95"
              style={{ background: `${rrt.accent}14`, border: `1px solid ${rrt.accent}35`, color: rrt.accent }} aria-label="Okuma ayarları">
              <Type size={11} /> Görünüm
            </button>
            <span className="h-px w-10" style={{ background: `${rrt.accent}50` }} />
          </div>
          {isDeep && !allCpDone && (
            <p className="text-[10px] mt-3 font-bold" style={{ color: '#818CF8' }}>
              🌌 Katmanlı kıssa · {cpOpen}/{checkpoints.length} durak geçildi — kıssa adım adım açılır
            </p>
          )}
        </div>

        {/* Metin — katmanlı kıssalarda sınıra kadar */}
        <div className="px-6 pt-4 max-w-[42rem] mx-auto article-body" style={{ fontSize: rs.fontSize, color: `${rrt.text}f0`, '--gold': rrt.accent }}>
          {story.paragraphs.slice(0, revealLimit + 1).map((p, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>{p}</motion.p>
          ))}
        </div>

        {/* Aktif checkpoint durağı */}
        {activeCp && (
          <div className="px-6 max-w-[42rem] mx-auto">
            <Checkpoint key={cpOpen} cp={activeCp} idx={cpOpen}
              answered={cpPicked[cpOpen] !== undefined} picked={cpPicked[cpOpen]}
              onPick={(i) => pickCheckpoint(cpOpen, i)}
              onContinue={() => setCpOpen(n => n + 1)}
              theme={theme} />
          </div>
        )}

        {/* Final soru + hikmet — duraklar bitince */}
        {allCpDone && (
        <div className="px-6 max-w-[42rem] mx-auto mt-2">
          <AnimatePresence mode="wait">
            {phase !== 'lesson' ? (
              <motion.div key="q" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-2xl p-5 mt-2" style={{ background: `${theme.gold}0a`, border: `1.5px solid ${theme.gold}30` }}>
                <p className="text-[10px] font-black uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: theme.gold }}>
                  <Sparkles size={12} /> Sen ne düşünürsün?
                </p>
                <p className="text-base font-bold mb-4" style={{ fontFamily: 'var(--font-okuma)', color: theme.textPrimary }}>{story.question}</p>
                <div className="space-y-2.5">
                  {story.choices.map((c, i) => {
                    const chosen = picked === i;
                    const isCorrect = picked !== null && i === story.correct;
                    return (
                      <button key={i} onClick={() => pickAnswer(i)} disabled={picked !== null}
                        className="w-full text-start p-3.5 rounded-xl text-sm font-semibold transition-all active:scale-98 flex items-center justify-between gap-2"
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
                <p className="text-[15px] leading-[1.8] relative" style={{ fontFamily: 'var(--font-okuma)', color: theme.textPrimary }}>{story.lesson}</p>
                {story.verse && (
                  <div className="mt-4 pt-3 relative" style={{ borderTop: `1px solid ${theme.gold}25` }}>
                    <p className="text-sm italic leading-relaxed" style={{ color: `${theme.textPrimary}dd` }}>{story.verse.text}</p>
                    <p className="text-[11px] mt-1.5 font-bold" style={{ color: theme.gold }}>— {story.verse.source}</p>
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-4 relative">
                  <Check size={14} style={{ color: '#10B981' }} />
                  <span className="text-xs font-bold" style={{ color: '#10B981' }}>Okundu · +{story.deep ? 20 : 12} XP</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 💎 Kazanılan cevher */}
          {phase === 'lesson' && gem && (
            <AnimatePresence>
              {gemPop && (
                <motion.div initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', bounce: 0.55 }}
                  className="rounded-2xl p-4 mt-4 flex items-center gap-3 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${gem.hue}14, ${theme.surface})`, border: `1.5px solid ${gem.hue}55` }}>
                  <motion.span className="text-4xl" animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.5 }}
                    style={{ filter: `drop-shadow(0 0 14px ${gem.hue}80)` }}>{gem.emoji}</motion.span>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: gem.hue }}>
                      <Gem size={11} /> Hikmet Cevheri kazandın
                    </p>
                    <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{gem.name}</p>
                    <p className="text-[10px]" style={{ color: theme.textSecondary }}>Koleksiyon: {gemCount}/{Object.keys(STORY_GEMS).length} cevher</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* 🤲 Hayata Taşı */}
          {phase === 'lesson' && applyText && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-4 mt-4" style={{ background: '#10B9810c', border: '1.5px solid #10B98135' }}>
              <p className="text-[10px] font-black uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#10B981' }}>
                <HeartHandshake size={12} /> Hayata Taşı · Bugünün küçük ameli
              </p>
              <p className="text-[13.5px] leading-[1.7] mb-3" style={{ fontFamily: 'var(--font-okuma)', color: theme.textPrimary }}>{applyText}</p>
              <button onClick={applyTask} disabled={applied}
                className="w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-98"
                style={applied
                  ? { background: '#10B98115', border: '1px solid #10B98140', color: '#10B981' }
                  : { background: 'linear-gradient(135deg, #059669, #10B981)', color: '#fff' }}>
                {applied ? (<><Check size={13} /> Hayata taşındı</>) : 'Uyguladım · +8 XP'}
              </button>
            </motion.div>
          )}

          {/* 🌙 Gece modunda dinle */}
          {phase === 'lesson' && (
            <button onClick={listenAtNight}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-start active:scale-98 transition-transform mt-4"
              style={{ background: 'linear-gradient(135deg, #1E1B4B, #312E81)', border: '1px solid #6366F150' }}>
              <span className="text-2xl">🌙</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black" style={{ color: '#E0E7FF' }}>Gece Modunda Dinle</p>
                <p className="text-[10px]" style={{ color: '#A5B4FC' }}>Ney eşliğinde sesli okuma + uyku zamanlayıcısı</p>
              </div>
              <ChevronRight size={15} style={{ color: '#A5B4FC' }} />
            </button>
          )}

          {/* Sıradaki hikaye */}
          {phase === 'lesson' && (() => {
            const next = STORIES.find(s => !readIds.includes(s.id) && s.id !== story.id) || STORIES.find(s => s.id !== story.id);
            if (!next) return null;
            return (
              <button onClick={() => openStory(next.id)} className="w-full flex items-center gap-3 p-3 rounded-2xl text-start active:scale-98 transition-transform mt-3"
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
        )}

        {/* Okuma ayarları sayfası */}
        <ReadingSettingsSheet open={showRS} onClose={() => setShowRS(false)} />
      </div>
    );
  }

  // ═══ HİKAYE LİSTESİ (16. tur: kemer kapaklar, kategori yolu) ═══
  return (
    <KissaListe STORIES={STORIES} STORY_CATEGORIES={STORY_CATEGORIES} STORY_GEMS={STORY_GEMS} readIds={readIds} gems={gems}
      openStory={openStory} onNight={() => { save('night_preset', null); navigate('/night'); }} />
  );
}
