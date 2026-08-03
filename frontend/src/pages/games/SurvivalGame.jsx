import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Infinity as InfinityIcon, RefreshCw, Skull, Flame } from 'lucide-react';
import { drawQuestions } from '../../data/questionBank';
import Confetti from './Confetti';
import QuizCore from './QuizCore';
import { useTx } from '../../i18n';

// Sonsuz Mod: yanlış yapana kadar devam et. Seri arttıkça soru başı XP artar.
export default function SurvivalGame({ theme, onXP, onEvent = () => {} }) {
  const tt = useTx();
  const [phase, setPhase] = useState('playing'); // playing | dead (lobi GamesPage'de)
  const [queue, setQueue] = useState(() => drawQuestions(200));
  const [idx, setIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState(null);
  const [best, setBest] = useState(() => Number(localStorage.getItem('survival_best') || 0));

  const start = useCallback(() => {
    setQueue(drawQuestions(200));
    setIdx(0); setStreak(0); setXp(0); setFlash(null);
    setPhase('playing');
  }, []);

  const q = queue[idx];
  const options = q ? (q.type === 'tf' ? ['Doğru', 'Yanlış'] : q.options) : [];

  const answer = useCallback((choice) => {
    if (flash !== null || !q) return;
    setFlash(choice);
    const ok = choice === q.correct_index;
    onEvent('answer', { correct: ok, category: q.category });
    if (ok) {
      const newStreak = streak + 1;
      // Seri bonusu: her 5 doğruda soru başı +2 XP
      const gained = (q.points || 10) + Math.floor(newStreak / 5) * 2;
      setStreak(newStreak);
      setXp(x => x + gained);
      setTimeout(() => { setFlash(null); setIdx(i => (i + 1) % queue.length); }, 300);
    } else {
      setTimeout(() => {
        setPhase('dead');
        if (streak > best) { setBest(streak); try { localStorage.setItem('survival_best', String(streak)); } catch { /* ignore */ } }
        if (streak >= 10) onEvent('win');
        if (xp > 0) onXP(xp, 'game_quiz', `Sonsuz Mod (${streak} seri)`);
      }, 700);
    }
  }, [flash, q, streak, xp, best, queue.length, onXP, onEvent]);

  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ background: '#3B82F620' }}>
          <InfinityIcon size={38} style={{ color: '#3B82F6' }} />
        </div>
        <h2 className="text-xl font-black mb-1" style={{ color: theme.textPrimary }}>Sonsuz Mod</h2>
        <p className="text-sm mb-2 max-w-xs" style={{ color: theme.textSecondary }}>{tt('Yanlış yapana kadar mücadele et! Serin uzadıkça soru başına XP artar.')}</p>
        <p className="text-[11px] mb-6" style={{ color: '#3B82F6' }}>{best > 0 ? `En uzun serin: ${best} doğru` : 'İlk serini başlat!'}</p>
        <button onClick={start} className="px-10 py-3.5 rounded-2xl font-black text-base active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', color: '#fff' }}>
          {tt('Mücadeleye Başla')}
        </button>
      </div>
    );
  }

  if (phase === 'dead') {
    const isRecord = streak > 0 && streak >= best;
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative flex flex-col items-center justify-center px-6 py-10 text-center overflow-hidden">
        {streak >= 10 && <Confetti count={26} />}
        <Skull size={42} style={{ color: '#EF4444' }} className="mb-3" />
        <h2 className="text-2xl font-black mb-1" style={{ color: theme.gold }}>{streak} doğru üst üste!</h2>
        <p className="text-sm mb-1" style={{ color: theme.textSecondary }}>+{xp} XP kazandın</p>
        {isRecord && <p className="text-xs font-bold mb-3" style={{ color: '#10B981' }}>🏅 Yeni Rekor!</p>}
        <button onClick={start} className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
          <RefreshCw size={16} /> Tekrar Dene
        </button>
      </motion.div>
    );
  }

  return (
    <div className="px-4 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-black" style={{ background: '#3B82F618', color: '#3B82F6' }}>
          <Flame size={15} /> {streak} seri
        </div>
        <div className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>
          {xp} XP
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <QuizCore q={q} accent="#3B82F6" theme={theme} flash={flash} onPick={answer} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
