import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, Play, ChevronLeft, Star, Clock, Target, Gift } from 'lucide-react';
import { ADVENTURE, ADVENTURE_BADGE } from '../../data/adventureData';
import FeedbackOverlay from './FeedbackOverlay';
import Confetti from './Confetti';

// 🌍 İSLAM TARİHİ MACERASI — Mekke'den Veda Hutbesi'ne 12 durak.
// Harita → görev sayfası → karışık etkileşimler → RPG tadında zafer ekranı.
const PASS_RATE = 0.6;
const CHAPTER_XP = 40;

const loadProg = () => { try { return Number(localStorage.getItem('adv_progress') || 0); } catch { return 0; } };
const saveProg = (n) => { try { localStorage.setItem('adv_progress', String(n)); } catch { /* ignore */ } };
const loadArtifacts = () => { try { return JSON.parse(localStorage.getItem('gc_artifacts')) || []; } catch { return []; } };
const addArtifact = (id) => { try { const l = loadArtifacts(); if (!l.includes(id)) localStorage.setItem('gc_artifacts', JSON.stringify([...l, id])); } catch { /* ignore */ } };
const addBadge = (b) => { try { const l = JSON.parse(localStorage.getItem('gc_badges')) || []; if (!l.includes(b)) localStorage.setItem('gc_badges', JSON.stringify([...l, b])); } catch { /* ignore */ } };

// ─── Sıralama adımı (tek ekranlık mini oyun) ───
function OrderStep({ step, theme, color, onDone }) {
  const [pool, setPool] = useState(() => {
    const a = step.items.map((text, i) => ({ text, ci: i })).sort(() => Math.random() - 0.5);
    if (a.every((x, i) => x.ci === i) && a.length > 1) [a[0], a[1]] = [a[1], a[0]];
    return a;
  });
  const [placed, setPlaced] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(null);

  const tap = (item, pi) => {
    if (item.ci === placed) {
      const np = placed + 1;
      setPlaced(np);
      setPool(prev => prev.filter((_, i) => i !== pi));
      if (np === step.items.length) setTimeout(() => onDone(mistakes <= 1), 500);
    } else {
      setMistakes(m => m + 1);
      setShake(pi);
      setTimeout(() => setShake(null), 400);
    }
  };

  return (
    <div>
      <div className="rounded-2xl p-4 mb-4" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
        <p className="text-sm font-black mb-1" style={{ color: theme.textPrimary }}>🔢 {step.title}</p>
        <p className="text-[10px]" style={{ color: theme.textSecondary }}>Doğru sırayla dokun · {mistakes} hata (1 hata hakkın var)</p>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        {step.items.map((text, i) => (
          <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl min-h-[42px]"
            style={{ background: i < placed ? '#10B98115' : `${theme.textSecondary}08`, border: `1.5px ${i < placed ? 'solid #10B981' : `dashed ${theme.cardBorder}`}` }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
              style={{ background: i < placed ? '#10B981' : `${theme.textSecondary}20`, color: i < placed ? '#fff' : theme.textSecondary }}>{i + 1}</span>
            <span className="text-xs font-bold" style={{ color: i < placed ? '#10B981' : theme.textSecondary }}>{i < placed ? text : '···'}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {pool.map((item, i) => (
          <motion.button key={`${item.text}-${i}`} onClick={() => tap(item, i)}
            animate={shake === i ? { x: [-6, 6, -4, 0] } : {}}
            className="px-3.5 py-2 rounded-xl text-xs font-bold active:scale-95"
            style={{ background: shake === i ? '#EF444422' : theme.surface, border: `1.5px solid ${shake === i ? '#EF4444' : `${color}40`}`, color: theme.textPrimary }}>
            {item.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function AdventureMode({ theme, onXP, onEvent = () => {} }) {
  const [view, setView] = useState('map'); // map | mission | play | victory
  const [chIdx, setChIdx] = useState(0);
  const [progress, setProgress] = useState(loadProg);
  const [stepIdx, setStepIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [journeyDone, setJourneyDone] = useState(false);
  const [passed, setPassed] = useState(false);

  const ch = ADVENTURE[chIdx];
  const gold = '#F59E0B';

  const openMission = useCallback((ci) => { setChIdx(ci); setView('mission'); }, []);
  const begin = useCallback(() => {
    setStepIdx(0); setCorrect(0); setXp(0); setFlash(null); setOverlay(null);
    setJourneyDone(false); setPassed(false);
    setView('play');
  }, []);

  const finishChapter = useCallback((finalCorrect, finalXp) => {
    const total = ADVENTURE[chIdx].steps.length;
    const ok = finalCorrect / total >= PASS_RATE;
    setPassed(ok);
    let earned = finalXp;
    if (ok) {
      earned += CHAPTER_XP;
      onEvent('win');
      addArtifact(ADVENTURE[chIdx].id);
      if (chIdx === progress) {
        const np = progress + 1;
        setProgress(np); saveProg(np);
        if (np === ADVENTURE.length) { addBadge(ADVENTURE_BADGE); setJourneyDone(true); earned += 200; }
      }
    }
    setCorrect(finalCorrect); setXp(earned);
    if (earned > 0) onXP(earned, 'game_quiz', `Macera: ${ADVENTURE[chIdx].title}`);
    setView('victory');
  }, [chIdx, progress, onXP, onEvent]);

  const nextStep = useCallback((state) => {
    setOverlay(null); setFlash(null);
    if (stepIdx + 1 >= ch.steps.length) finishChapter(state.c, state.x);
    else setStepIdx(i => i + 1);
  }, [stepIdx, ch, finishChapter]);

  const answerMc = useCallback((choice) => {
    const step = ch.steps[stepIdx];
    if (flash !== null || overlay) return;
    const ok = choice === step.a;
    setFlash(choice);
    onEvent('answer', { correct: ok, category: 'Siyer' });
    if (ok) {
      setOverlay({ mode: 'correct', data: { xp: 10 }, next: { c: correct + 1, x: xp + 10 } });
      setCorrect(c => c + 1); setXp(x => x + 10);
    } else {
      setOverlay({ mode: 'wrong', data: { answer: step.o[step.a], explanation: step.exp, source: ch.title }, next: { c: correct, x: xp } });
    }
  }, [ch, stepIdx, flash, overlay, correct, xp, onEvent]);

  const orderDone = useCallback((ok) => {
    onEvent('answer', { correct: ok, category: 'Siyer' });
    if (ok) { setCorrect(c => c + 1); setXp(x => x + 10); }
    nextStep({ c: correct + (ok ? 1 : 0), x: xp + (ok ? 10 : 0) });
  }, [correct, xp, nextStep, onEvent]);

  // ─── HARİTA ───
  if (view === 'map') {
    return (
      <div className="px-5 w-full max-w-md mx-auto pb-6">
        <div className="text-center mb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: gold }}>Mekke → Veda Hutbesi</p>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>Tarihin içinde yolculuk et. Her durak yeni bir hatıra açar.</p>
          <p className="text-[10px] mt-1.5 font-bold" style={{ color: theme.gold }}>%{Math.round((progress / ADVENTURE.length) * 100)} tamamlandı · {progress}/{ADVENTURE.length} durak</p>
        </div>
        <div className="relative">
          {/* Parlayan yol */}
          <div className="absolute left-[38px] top-6 bottom-6 w-1 rounded-full" style={{ background: `linear-gradient(180deg, ${gold}60 ${Math.round((progress / ADVENTURE.length) * 100)}%, ${theme.textSecondary}20 ${Math.round((progress / ADVENTURE.length) * 100)}%)` }} />
          <div className="space-y-3">
            {ADVENTURE.map((c, ci) => {
              const state = ci < progress ? 'done' : ci === progress ? 'current' : 'locked';
              return (
                <motion.button key={c.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ci * 0.05 }}
                  onClick={() => state !== 'locked' && openMission(ci)} disabled={state === 'locked'}
                  className="w-full flex items-center gap-3 text-left relative"
                  style={{ marginLeft: ci % 2 === 1 ? 14 : 0 }}>
                  <motion.span animate={state === 'current' ? { scale: [1, 1.14, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 z-10 text-xl"
                    style={{
                      background: state === 'done' ? `${gold}25` : state === 'current' ? `${gold}30` : `${theme.textSecondary}12`,
                      border: `2px solid ${state === 'locked' ? `${theme.textSecondary}30` : gold}`,
                      boxShadow: state !== 'locked' ? `0 0 ${state === 'current' ? 22 : 10}px ${gold}50` : 'none',
                      filter: state === 'locked' ? 'grayscale(1) blur(0.4px)' : 'none',
                      opacity: state === 'locked' ? 0.55 : 1,
                    }}>
                    {state === 'locked' ? '🌫️' : c.emoji}
                  </motion.span>
                  <div className="flex-1 rounded-xl p-3 flex items-center justify-between" style={{
                    background: state === 'locked' ? `${theme.textSecondary}06` : theme.cardBg,
                    border: `1px solid ${state === 'current' ? `${gold}50` : theme.cardBorder}`,
                    opacity: state === 'locked' ? 0.5 : 1,
                  }}>
                    <div>
                      <p className="text-xs font-black" style={{ color: theme.textPrimary }}>{ci + 1}. {c.title}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: theme.textSecondary }}>
                        {state === 'done' ? `${c.artifact} ${c.artifactName} kazanıldı` : state === 'current' ? 'Sıradaki durak — hazır mısın?' : 'Kilidi açmak için önceki durağı bitir'}
                      </p>
                    </div>
                    {state === 'done' ? <Check size={15} style={{ color: '#10B981' }} /> : state === 'current' ? <Play size={15} style={{ color: gold }} /> : <Lock size={13} style={{ color: theme.textSecondary }} />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── GÖREV SAYFASI ───
  if (view === 'mission') {
    return (
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="px-5 w-full max-w-md mx-auto">
        <button onClick={() => setView('map')} className="flex items-center gap-1 text-xs font-bold mb-3" style={{ color: theme.gold }}>
          <ChevronLeft size={14} /> Harita
        </button>
        <div className="rounded-3xl p-6 text-center mb-4 relative overflow-hidden" style={{ background: `linear-gradient(170deg, ${gold}16, ${theme.surface})`, border: `1.5px solid ${gold}45` }}>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${gold}28, transparent 65%)` }} />
          <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2.2, repeat: Infinity }} className="text-6xl block mb-2 relative" style={{ filter: `drop-shadow(0 6px 18px ${gold}80)` }}>{ch.emoji}</motion.span>
          <p className="text-[10px] font-black uppercase tracking-wider relative" style={{ color: gold }}>Durak {chIdx + 1} / {ADVENTURE.length}</p>
          <h2 className="text-2xl font-black relative" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{ch.title}</h2>
          <div className="flex justify-center gap-0.5 mt-1 relative">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star key={i} size={13} fill={i < ch.difficulty ? gold : 'transparent'} style={{ color: i < ch.difficulty ? gold : `${theme.textSecondary}50` }} />
            ))}
          </div>
        </div>
        {/* Tarihi özet */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{ch.summary}</p>
        </div>
        {/* Hedefler + ödüller */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: <Target size={14} />, label: 'Hedef', val: '%60+ doğru' },
            { icon: <Clock size={14} />, label: 'Süre', val: '~2 dk' },
            { icon: <Gift size={14} />, label: 'Ödül', val: `${ch.artifact} + ${CHAPTER_XP + ch.steps.length * 10} XP` },
          ].map((x, i) => (
            <div key={i} className="rounded-xl py-2.5 px-1 text-center" style={{ background: `${gold}0c`, border: `1px solid ${gold}30` }}>
              <span className="flex justify-center mb-1" style={{ color: gold }}>{x.icon}</span>
              <p className="text-[10px] font-black" style={{ color: theme.textPrimary }}>{x.val}</p>
              <p className="text-[8px]" style={{ color: theme.textSecondary }}>{x.label}</p>
            </div>
          ))}
        </div>
        <button onClick={begin} className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
          style={{ background: `linear-gradient(135deg, ${gold}, #D97706)`, color: '#fff', boxShadow: `0 8px 30px ${gold}40` }}>
          <Play size={17} fill="#fff" /> Göreve Başla
        </button>
      </motion.div>
    );
  }

  // ─── ZAFER / SONUÇ ───
  if (view === 'victory') {
    return (
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative px-6 py-8 w-full max-w-md mx-auto text-center overflow-hidden">
        {passed && <Confetti count={34} />}
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.55, delay: 0.1 }}
          className="text-7xl block mb-3" style={{ filter: passed ? `drop-shadow(0 8px 26px ${gold}90)` : 'grayscale(0.6)' }}>
          {passed ? ch.artifact : '🌫️'}
        </motion.span>
        <h2 className="text-2xl font-black mb-1" style={{ color: passed ? theme.gold : theme.textPrimary }}>
          {journeyDone ? 'Yolculuk Tamamlandı! 👑' : passed ? `${ch.artifactName} Kazanıldı!` : 'Durak Geçilemedi'}
        </h2>
        {journeyDone && <p className="text-xs font-black mb-1" style={{ color: '#10B981' }}>🏅 "{ADVENTURE_BADGE}" rozeti + 200 bonus XP!</p>}
        <p className="text-sm mb-1" style={{ color: theme.textSecondary }}>{correct}/{ch.steps.length} doğru {passed && `· +${xp} XP`}</p>
        {!passed && <p className="text-[10px] mb-3" style={{ color: theme.textSecondary }}>Durağı geçmek için en az %60 gerekli — özeti tekrar oku!</p>}
        {passed && !journeyDone && chIdx + 1 < ADVENTURE.length && (
          <p className="text-[10px] mb-3 font-bold" style={{ color: gold }}>⭐ Yeni durak açıldı: {ADVENTURE[chIdx + 1].emoji} {ADVENTURE[chIdx + 1].title}</p>
        )}
        <div className="flex gap-2.5 mt-4">
          <button onClick={() => setView('map')} className="flex-1 py-3 rounded-2xl font-bold text-sm" style={{ background: `${theme.gold}16`, border: `1px solid ${theme.gold}40`, color: theme.gold }}>
            Haritaya Dön
          </button>
          <button onClick={passed && chIdx + 1 < ADVENTURE.length ? () => openMission(chIdx + 1) : begin}
            className="flex-1 py-3 rounded-2xl font-black text-sm" style={{ background: gold, color: '#fff' }}>
            {passed && chIdx + 1 < ADVENTURE.length ? 'Sonraki Durak →' : 'Tekrar Dene'}
          </button>
        </div>
      </motion.div>
    );
  }

  // ─── OYNANIŞ (karışık adımlar) ───
  const step = ch.steps[stepIdx];
  return (
    <div className="px-4 w-full max-w-md mx-auto">
      <FeedbackOverlay mode={overlay?.mode} data={overlay?.data || {}} theme={theme} onContinue={() => overlay && nextStep(overlay.next)} />
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: `${gold}18`, color: gold }}>{ch.emoji} {ch.title}</span>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: theme.surface, color: theme.textPrimary }}>{stepIdx + 1}/{ch.steps.length}</span>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>{xp} XP</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: `${theme.textSecondary}20` }}>
        <motion.div className="h-full rounded-full" animate={{ width: `${(stepIdx / ch.steps.length) * 100}%` }} style={{ background: gold }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={stepIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          {step.type === 'order' ? (
            <OrderStep step={step} theme={theme} color={gold} onDone={orderDone} />
          ) : (
            <>
              <div className="rounded-2xl p-5 mb-4 min-h-[110px]" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                <h3 className="text-base font-bold" style={{ color: theme.textPrimary }}>{step.q}</h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {step.o.map((opt, i) => {
                  const chosen = flash === i;
                  const isRight = flash !== null && i === step.a;
                  return (
                    <button key={i} onClick={() => answerMc(i)} disabled={flash !== null}
                      className="p-3.5 rounded-xl text-sm font-semibold text-left transition-all active:scale-98"
                      style={{
                        background: isRight ? '#10B98122' : chosen ? '#EF444422' : `${theme.textSecondary}0f`,
                        border: `1px solid ${isRight ? '#10B981' : chosen ? '#EF4444' : theme.cardBorder}`,
                        color: theme.textPrimary,
                      }}>
                      <span className="font-bold mr-2" style={{ color: gold }}>{['A', 'B', 'C', 'D'][i]}.</span>{opt}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
