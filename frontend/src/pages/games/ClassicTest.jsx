import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, RefreshCw, Trophy, Check, X } from 'lucide-react';
import { drawQuestions } from '../../data/questionBank';
import Confetti from './Confetti';

const COUNTS = [10, 20, 50, 100];

// Klasik Test: 10/20/50/100 soru seç, bitir, sonucu gör.
export default function ClassicTest({ theme, onXP, onEvent = () => {} }) {
  const [phase, setPhase] = useState('idle'); // idle | playing | done
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState(null);

  const start = useCallback((n) => {
    setCount(n);
    setQuestions(drawQuestions(n));
    setIdx(0); setCorrect(0); setXp(0); setFlash(null);
    setPhase('playing');
  }, []);

  const q = questions[idx];
  const options = q ? (q.type === 'tf' ? ['Doğru', 'Yanlış'] : q.options) : [];

  const answer = useCallback((choice) => {
    if (flash !== null || !q) return;
    setFlash(choice);
    const ok = choice === q.correct_index;
    onEvent('answer', { correct: ok, category: q.category });
    let gained = 0;
    if (ok) { gained = q.points || 10; setCorrect(c => c + 1); setXp(x => x + gained); }
    setTimeout(() => {
      setFlash(null);
      if (idx + 1 >= questions.length) {
        setPhase('done');
        const finalCorrect = correct + (ok ? 1 : 0);
        if (finalCorrect >= Math.ceil(questions.length / 2)) onEvent('win');
        const finalXp = xp + gained;
        if (finalXp > 0) onXP(finalXp, 'game_quiz', `Klasik Test (${questions.length} soru)`);
      } else setIdx(i => i + 1);
    }, 420);
  }, [flash, q, idx, questions.length, correct, xp, onXP, onEvent]);

  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ background: '#10B98120' }}>
          <BookOpen size={36} style={{ color: '#10B981' }} />
        </div>
        <h2 className="text-xl font-black mb-1" style={{ color: theme.textPrimary }}>Klasik Test</h2>
        <p className="text-sm mb-6 max-w-xs" style={{ color: theme.textSecondary }}>Soru sayısını seç ve başla. Her doğru cevap puanı kadar XP!</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {COUNTS.map(n => (
            <button key={n} onClick={() => start(n)}
              className="py-4 rounded-2xl font-black text-lg active:scale-95 transition-all"
              style={{ background: '#10B98115', border: '1.5px solid #10B98140', color: '#10B981' }}>
              {n} <span className="text-xs font-semibold opacity-80">Soru</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const pctRight = Math.round((correct / questions.length) * 100);
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative flex flex-col items-center justify-center px-6 py-10 text-center overflow-hidden">
        {pctRight >= 50 && <Confetti count={28} />}
        <Trophy size={44} style={{ color: theme.gold }} className="mb-4" />
        <h2 className="text-3xl font-black mb-1" style={{ color: theme.gold }}>+{xp} XP</h2>
        <p className="text-sm mb-2" style={{ color: theme.textSecondary }}>{correct}/{questions.length} doğru · %{pctRight} başarı</p>
        <div className="w-full max-w-xs h-2.5 rounded-full overflow-hidden mb-5" style={{ background: `${theme.textSecondary}20` }}>
          <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pctRight}%` }}
            style={{ background: pctRight >= 70 ? '#10B981' : pctRight >= 40 ? '#F59E0B' : '#EF4444' }} />
        </div>
        <button onClick={() => setPhase('idle')} className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
          <RefreshCw size={16} /> Yeni Test
        </button>
      </motion.div>
    );
  }

  const progress = (idx / questions.length) * 100;
  return (
    <div className="px-4 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: theme.surface, color: theme.textPrimary }}>
          {idx + 1}/{questions.length}
        </span>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5" style={{ background: '#10B98118', color: '#10B981' }}>
          <Check size={14} /> {correct}
        </span>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>
          {xp} XP
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: `${theme.textSecondary}20` }}>
        <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} style={{ background: '#10B981' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <div className="rounded-2xl p-5 mb-4 min-h-[120px] flex items-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#10B98118', color: '#10B981' }}>{q?.category}</span>
              <h3 className="text-base font-bold mt-2" style={{ color: theme.textPrimary }}>{q?.question}</h3>
            </div>
          </div>
          <div className={q?.type === 'tf' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2.5'}>
            {options.map((opt, i) => {
              const chosen = flash === i;
              const isRight = flash !== null && i === q.correct_index;
              const isWrong = chosen && !isRight;
              return (
                <button key={i} onClick={() => answer(i)} disabled={flash !== null}
                  className="p-3.5 rounded-xl text-sm font-semibold text-left transition-all active:scale-98 flex items-center justify-between"
                  style={{
                    background: isRight ? '#10B98122' : isWrong ? '#EF444422' : `${theme.textSecondary}0f`,
                    border: `1px solid ${isRight ? '#10B981' : isWrong ? '#EF4444' : theme.cardBorder}`,
                    color: theme.textPrimary,
                  }}>
                  <span>
                    {q?.type !== 'tf' && <span className="font-bold mr-2" style={{ color: '#10B981' }}>{['A', 'B', 'C', 'D'][i]}.</span>}
                    {opt}
                  </span>
                  {isRight && <Check size={15} style={{ color: '#10B981' }} />}
                  {isWrong && <X size={15} style={{ color: '#EF4444' }} />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
