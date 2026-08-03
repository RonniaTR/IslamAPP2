import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Pause, Loader, Sparkles, Check, Star, ChevronRight, ChevronDown, Lightbulb, Moon, Gem, HeartHandshake, Type } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTTS } from '../hooks/useShared';
import { awardXPOnce } from '../services/gamification';
import { useReadingSettings } from '../services/readingSettings';
import ReadingSettingsSheet from '../components/ReadingSettingsSheet';
import { STORIES, STORY_CATEGORIES, STORY_GEMS, STORY_APPLY, STORY_GEMS_EN, STORY_APPLY_EN } from '../data/stories';
import { useField } from '../services/contentI18n';
import { useLang } from '../contexts/LangContext';
import { useTx } from '../i18n';
import Confetti from './games/Confetti';

// 🕯️ İBRETLİK HİKAYELER — kıssa → düşündürücü soru → hikmet.
// 🌌 Katmanlı kıssalar: paragraflar checkpoint duraklarıyla adım adım açılır;
//    okur soruya cevap vermeden devamı görünmez, cevaptan sonra "iç görü" açılır.
// 💎 Her tamamlanan kıssa bir Hikmet Cevheri kazandırır (gc_gems).
// 🤲 "Hayata Taşı": kıssanın bugün yapılabilir küçük amel önerisi (+8 XP).
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

// ─── Checkpoint durağı: soru → iç görü → devam ───
function Checkpoint({ cp, idx, answered, picked, onPick, onContinue, theme }) {
  const tt = useTx();
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 my-5 relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, #312E8114, ${theme.surface})`, border: `1.5px solid #818CF845` }}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5" style={{ color: '#818CF8' }}>
        <Sparkles size={12} /> {tt('Durak')} {idx + 1} · {tt('Birlikte düşünelim')}
      </p>
      <p className="text-[15px] font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: theme.textPrimary }}>{cp.q}</p>
      {!answered ? (
        <div className="space-y-2">
          {cp.choices.map((c, i) => (
            <button key={i} onClick={() => onPick(i)}
              className="w-full text-left p-3 rounded-xl text-sm font-semibold transition-all active:scale-98"
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
                <div key={i} className="w-full text-left p-3 rounded-xl text-sm font-semibold flex items-center justify-between gap-2"
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
              <Lightbulb size={11} /> {tt('İç görü')}
            </p>
            <p className="text-[13.5px] leading-[1.7]" style={{ fontFamily: 'Georgia, serif', color: `${theme.textPrimary}ee` }}>{cp.insight}</p>
          </div>
          <button onClick={onContinue}
            className="w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-1.5 active:scale-98"
            style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: '#fff' }}>
            {tt('Kıssanın Devamı')} <ChevronDown size={15} />
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
  const f = useField();
  const { lang } = useLang();
  const tt = useTx();
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
  const checkpoints = useMemo(() => {
    const tr = story?.checkpoints || [];
    const en = (story && lang !== 'tr' && story.en?.checkpoints) || null;
    return en ? tr.map((c, i) => ({ ...c, ...(en[i] || {}) })) : tr;
  }, [story, lang]);
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
    const text = [f(story, 'title'), ...f(story, 'paragraphs').slice(0, revealLimit + 1)].join('. ');
    tts.speak(text);
  }, [story, tts, revealLimit]);

  useEffect(() => { if (openId) { const m = document.querySelector('main'); if (m) m.scrollTo({ top: 0 }); } }, [openId]);

  const gemCount = Object.keys(gems).length;

  // ═══ OKUMA GÖRÜNÜMÜ ═══
  if (story) {
    const gem = STORY_GEMS[story.id];
    const applyText = (lang !== 'tr' && STORY_APPLY_EN[story.id]) || STORY_APPLY[story.id];
    const applied = appliedIds.includes(story.id);
    const isDeep = !!story.deep;
    const activeCp = !allCpDone ? checkpoints[cpOpen] : null;

    return (
      <div ref={scrollRef} className="min-h-screen pb-28" style={{ background: rrt.bg }}>
        {celebrate && <Confetti count={26} />}
        {/* Kapak */}
        <div className="relative overflow-hidden flex items-center justify-center" style={{ height: 130, background: `linear-gradient(140deg, ${story.grad[0]}, ${story.grad[1]})` }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #ffd36960, transparent 65%)' }} />
          <span className="text-6xl" style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.4))' }}>{story.emoji}</span>
          <button onClick={closeStory} className="absolute top-4 left-4 w-9 h-9 rounded-xl flex items-center justify-center active:scale-90" style={{ background: 'rgba(0,0,0,0.35)' }} aria-label="Geri">
            <ArrowLeft size={18} style={{ color: '#f7e6ae' }} />
          </button>
          <button onClick={listenAtNight} className="absolute top-4 right-4 h-9 px-3 rounded-xl flex items-center gap-1.5 active:scale-90" style={{ background: 'rgba(0,0,0,0.35)' }} aria-label="Gece modunda dinle">
            <Moon size={14} style={{ color: '#f7e6ae' }} />
            <span className="text-[10px] font-black" style={{ color: '#f7e6ae' }}>Gece</span>
          </button>
        </div>

        {/* Başlık */}
        <div className="px-6 pt-6 pb-2 text-center max-w-[42rem] mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: isDeep ? '#818CF8' : theme.gold }}>
            {f(STORY_CATEGORIES.find(c => c.id === story.cat), 'title')}
          </p>
          <h1 className="text-[1.7rem] leading-tight font-black mt-2" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: rrt.text }}>{f(story, 'title')}</h1>
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
              style={{ background: `${rrt.accent}14`, border: `1px solid ${rrt.accent}35`, color: rrt.accent }} aria-label={tt('Okuma ayarları')}>
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
          {f(story, 'paragraphs').slice(0, revealLimit + 1).map((p, i) => (
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
                  <Sparkles size={12} /> {tt('Sen ne düşünürsün?')}
                </p>
                <p className="text-base font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: theme.textPrimary }}>{f(story, 'question')}</p>
                <div className="space-y-2.5">
                  {f(story, 'choices').map((c, i) => {
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
                <p className="text-[10px] mt-3 text-center" style={{ color: theme.textSecondary }}>{tt('Bir seçenek seç, hikmet açılsın')}</p>
              </motion.div>
            ) : (
              <motion.div key="l" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.35 }}
                className="rounded-2xl p-5 mt-2 relative overflow-hidden"
                style={{ background: `linear-gradient(160deg, ${theme.gold}14, ${theme.surface})`, border: `1.5px solid ${theme.gold}45` }}>
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${theme.gold}, transparent 65%)` }} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 flex items-center gap-1.5 relative" style={{ color: theme.gold }}>
                  <Lightbulb size={13} /> {tt('Hikmet')}
                </p>
                <p className="text-[15px] leading-[1.8] relative" style={{ fontFamily: 'Georgia, serif', color: theme.textPrimary }}>{f(story, 'lesson')}</p>
                {story.verse && (
                  <div className="mt-4 pt-3 relative" style={{ borderTop: `1px solid ${theme.gold}25` }}>
                    <p className="text-sm italic leading-relaxed" style={{ color: `${theme.textPrimary}dd` }}>{(f(story, 'verse') || story.verse).text}</p>
                    <p className="text-[11px] mt-1.5 font-bold" style={{ color: theme.gold }}>— {story.verse.source}</p>
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-4 relative">
                  <Check size={14} style={{ color: '#10B981' }} />
                  <span className="text-xs font-bold" style={{ color: '#10B981' }}>{tt('Okundu')} · +{story.deep ? 20 : 12} XP</span>
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
                      <Gem size={11} /> {tt('Hikmet Cevheri kazandın')}
                    </p>
                    <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{(lang !== 'tr' && STORY_GEMS_EN[story.id]) || gem.name}</p>
                    <p className="text-[10px]" style={{ color: theme.textSecondary }}>{tt('Koleksiyon')}: {gemCount}/{Object.keys(STORY_GEMS).length}</p>
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
                <HeartHandshake size={12} /> {tt('Hayata Taşı · Bugünün küçük ameli')}
              </p>
              <p className="text-[13.5px] leading-[1.7] mb-3" style={{ fontFamily: 'Georgia, serif', color: theme.textPrimary }}>{applyText}</p>
              <button onClick={applyTask} disabled={applied}
                className="w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-98"
                style={applied
                  ? { background: '#10B98115', border: '1px solid #10B98140', color: '#10B981' }
                  : { background: 'linear-gradient(135deg, #059669, #10B981)', color: '#fff' }}>
                {applied ? (<><Check size={13} /> {tt('Hayata taşındı')}</>) : tt('Uyguladım · +8 XP')}
              </button>
            </motion.div>
          )}

          {/* 🌙 Gece modunda dinle */}
          {phase === 'lesson' && (
            <button onClick={listenAtNight}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left active:scale-98 transition-transform mt-4"
              style={{ background: 'linear-gradient(135deg, #1E1B4B, #312E81)', border: '1px solid #6366F150' }}>
              <span className="text-2xl">🌙</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black" style={{ color: '#E0E7FF' }}>{tt('Gece Modunda Dinle')}</p>
                <p className="text-[10px]" style={{ color: '#A5B4FC' }}>{tt('Ney eşliğinde sesli okuma + uyku zamanlayıcısı')}</p>
              </div>
              <ChevronRight size={15} style={{ color: '#A5B4FC' }} />
            </button>
          )}

          {/* Sıradaki hikaye */}
          {phase === 'lesson' && (() => {
            const next = STORIES.find(s => !readIds.includes(s.id) && s.id !== story.id) || STORIES.find(s => s.id !== story.id);
            if (!next) return null;
            return (
              <button onClick={() => openStory(next.id)} className="w-full flex items-center gap-3 p-3 rounded-2xl text-left active:scale-98 transition-transform mt-3"
                style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                <span className="text-2xl">{next.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold uppercase" style={{ color: theme.textSecondary }}>{tt('Sıradaki kıssa')}</p>
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

  // ═══ HİKAYE LİSTESİ ═══
  return (
    <div className="min-h-screen pb-24 max-w-4xl mx-auto" style={{ background: theme.bg }}>
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🕯️</span>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{tt('İbretlik Hikayeler')}</h1>
        </div>
        <p className="text-xs" style={{ color: theme.textSecondary }}>{tt('Bir kıssa, bir soru, bir hikmet')} · {readIds.length}/{STORIES.length}</p>
      </div>

      {/* 💎 Cevher rafı */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl p-4 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #312E8118, ${theme.surface})`, border: `1px solid ${theme.cardBorder}` }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-black flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
              <Gem size={13} style={{ color: '#818CF8' }} /> {tt('Hikmet Cevherlerin')}
            </p>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: '#818CF818', color: '#818CF8' }}>
              {gemCount}/{Object.keys(STORY_GEMS).length}
            </span>
          </div>
          {gemCount === 0 ? (
            <p className="text-[11px]" style={{ color: theme.textSecondary }}>{tt('Her tamamlanan kıssa bir cevher kazandırır. İlk cevherin seni bekliyor ✨')}</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(STORY_GEMS).map(([sid, g]) => {
                const owned = !!gems[sid];
                return (
                  <span key={sid} title={owned ? g.name : '???'} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{
                      background: owned ? `${g.hue}18` : `${theme.textSecondary}0a`,
                      border: `1px solid ${owned ? `${g.hue}55` : theme.cardBorder}`,
                      filter: owned ? 'none' : 'grayscale(1) opacity(0.35)',
                    }}>{g.emoji}</span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 🌙 Gece Modu girişi */}
      <div className="px-5 mb-6">
        <button onClick={() => { save('night_preset', null); navigate('/night'); }}
          className="w-full flex items-center gap-3 p-4 rounded-2xl text-left active:scale-98 transition-transform relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0F0D2E, #1E1B4B, #312E81)', border: '1px solid #6366F145' }}>
          <span className="absolute top-2 right-8 text-[8px]" style={{ color: '#C7D2FE' }}>✦</span>
          <span className="absolute top-5 right-16 text-[6px]" style={{ color: '#A5B4FC' }}>✦</span>
          <span className="absolute bottom-3 right-24 text-[7px]" style={{ color: '#818CF8' }}>✦</span>
          <span className="text-3xl">🌙</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black" style={{ color: '#E0E7FF' }}>{tt('Gece Modu')}</p>
            <p className="text-[11px]" style={{ color: '#A5B4FC' }}>{tt('Ney sesi · sesli kıssa okuma · uyku zamanlayıcısı')}</p>
          </div>
          <ChevronRight size={16} style={{ color: '#A5B4FC' }} />
        </button>
      </div>

      {STORY_CATEGORIES.map((cat, ci) => {
        const items = STORIES.filter(s => s.cat === cat.id);
        if (!items.length) return null;
        const isDeepCat = cat.id === 'derin';
        return (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.06 }} className="mb-6">
            <div className="px-5 flex items-center gap-2 mb-2.5">
              <p className="text-sm font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{cat.emoji} {f(cat, 'title')}</p>
              {isDeepCat && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider" style={{ background: '#818CF820', color: '#818CF8' }}>{tt('Duraklı okuma')}</span>}
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-1 md:grid md:grid-cols-3 md:overflow-visible">
              {items.map(s => {
                const isRead = readIds.includes(s.id);
                return (
                  <button key={s.id} onClick={() => openStory(s.id)}
                    className="shrink-0 w-48 md:w-auto rounded-2xl overflow-hidden text-left active:scale-97 transition-transform relative"
                    style={{ background: theme.surface, border: `1px solid ${s.deep ? '#6366F140' : theme.cardBorder}` }}>
                    <Cover s={s} />
                    {isRead && <span className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#10B981' }}><Check size={13} color="#fff" /></span>}
                    {gems[s.id] && STORY_GEMS[s.id] && (
                      <span className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: 'rgba(0,0,0,0.4)' }}>{STORY_GEMS[s.id].emoji}</span>
                    )}
                    <div className="p-3">
                      <p className="text-xs font-black leading-snug mb-1" style={{ color: theme.textPrimary }}>{f(s, 'title')}</p>
                      <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                        <Star size={9} style={{ color: theme.gold }} /> {s.read} {tt('dk')} · {s.deep ? `${(s.checkpoints || []).length} ${tt('durak')}` : tt('düşündüren son')}
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
