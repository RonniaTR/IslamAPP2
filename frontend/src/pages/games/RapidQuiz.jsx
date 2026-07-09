import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, RefreshCw, Trophy } from 'lucide-react';
import { drawQuestions, BANK_SIZE } from '../../data/questionBank';
import Confetti from './Confetti';

// Blitz: 30 saniye, 10 soru — hangisi önce biterse
const DURATION = 30;
const MAX_Q = 10;

const DIFFICULTIES = [
  { id: null, label: 'Karışık', color: '#C8A55A', mult: 1 },
  { id: 'easy', label: 'Kolay', color: '#10B981', mult: 1 },
  { id: 'medium', label: 'Orta', color: '#F59E0B', mult: 1.2 },
  { id: 'hard', label: 'Zor', color: '#EF4444', mult: 1.5 },
];

export default function RapidQuiz({ theme, onXP, onEvent = () => {} }) {
  const [phase, setPhase] = useState('idle'); // idle | playing | done
  const [diff, setDiff] = useState(DIFFICULTIES[0]);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('rapid_best') || 0));
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [flash, setFlash] = useState(null); // idx of chosen
  const timerRef = useRef(null);

  const start = useCallback(() => {
    setQuestions(drawQuestions(MAX_Q, { difficulty: diff.id }));
    setIdx(0); setCorrect(0); setXp(0); setTimeLeft(DURATION); setFlash(null);
    setPhase('playing');
  }, [diff]);

  const finish = useCallback((finalXp, finalCorrect) => {
    setPhase('done');
    if (timerRef.current) clearInterval(timerRef.current);
    if (finalXp > best) { setBest(finalXp); try { localStorage.setItem('rapid_best', String(finalXp)); } catch { /* ignore */ } }
    if ((finalCorrect ?? 0) >= 5) onEvent('win');
    if (finalXp > 0) onXP(finalXp, 'game_quiz', `Hızlı Bilgi (${diff.label})`);
  }, [onXP, onEvent, best, diff]);

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [phase]);

  // Süre bitince sonuç (xp'nin güncel değeriyle)
  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0) finish(xp, correct);
  }, [timeLeft, phase, xp, correct, finish]);

  const q = questions[idx];
  const options = q ? (q.type === 'tf' ? ['Doğru', 'Yanlış'] : q.options) : [];

  const answer = useCallback((choice) => {
    if (flash !== null || !q) return;
    setFlash(choice);
    const ok = choice === q.correct_index;
    onEvent('answer', { correct: ok, category: q.category });
    let gained = 0;
    if (ok) { gained = Math.round((q.points || 10) * diff.mult); setCorrect(c => c + 1); setXp(x => x + gained); }
    setTimeout(() => {
      setFlash(null);
      if (idx + 1 >= questions.length) { finish(xp + gained, correct + (ok ? 1 : 0)); }
      else setIdx(i => i + 1);
    }, 260);
  }, [flash, q, idx, questions.length, xp, correct, finish, diff, onEvent]);

  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ background: `${theme.gold}18` }}>
          <Zap size={36} style={{ color: theme.gold }} />
        </div>
        <h2 className="text-xl font-black mb-1" style={{ color: theme.textPrimary }}>Hızlı Bilgi (Blitz)</h2>
        <p className="text-sm mb-1 max-w-xs" style={{ color: theme.textSecondary }}>30 saniye, 10 soru! Hızını ve bilgini test et.</p>
        <p className="text-[11px] mb-5" style={{ color: theme.gold }}>{BANK_SIZE} soruluk bankadan · {best > 0 ? `Rekorun: ${best} XP` : 'İlk rekorunu kır!'}</p>

        {/* Zorluk seçimi */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {DIFFICULTIES.map(d => (
            <button key={d.label} onClick={() => setDiff(d)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
              style={{
                background: diff.label === d.label ? `${d.color}22` : theme.surface,
                border: `1.5px solid ${diff.label === d.label ? d.color : theme.cardBorder}`,
                color: diff.label === d.label ? d.color : theme.textSecondary,
              }}>
              {d.label}{d.mult > 1 && <span className="ml-1 opacity-80">×{d.mult}</span>}
            </button>
          ))}
        </div>

        <button onClick={start} className="px-10 py-3.5 rounded-2xl font-black text-base active:scale-95 transition-all"
          style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight})`, color: theme.bg }}>
          Başla
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const isRecord = xp > 0 && xp >= best;
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative flex flex-col items-center justify-center px-6 py-10 text-center overflow-hidden">
        {xp > 0 && <Confetti count={30} />}
        <Trophy size={44} style={{ color: theme.gold }} className="mb-4" />
        <h2 className="text-3xl font-black mb-1" style={{ color: theme.gold }}>+{xp} XP</h2>
        <p className="text-sm mb-1" style={{ color: theme.textSecondary }}>{correct} doğru cevap · {diff.label} mod</p>
        {isRecord && <p className="text-xs font-bold mb-4" style={{ color: '#10B981' }}>🏅 Yeni Rekor!</p>}
        <button onClick={() => setPhase('idle')} className="mt-3 inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
          <RefreshCw size={16} /> Tekrar Oyna
        </button>
      </motion.div>
    );
  }

  return (
    <div className="px-4 w-full max-w-md mx-auto">
      {/* Üst bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: timeLeft <= 10 ? '#EF444422' : theme.surface, color: timeLeft <= 10 ? '#EF4444' : theme.textPrimary }}>
          <Timer size={15} /> {timeLeft}s
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: `${diff.color}18`, color: diff.color }}>{diff.label}</span>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>
          <Zap size={15} /> {xp} XP
        </div>
      </div>
      {/* Süre çubuğu */}
      <div className="h-1.5 rounded-full overflow-hidden mb-6" style={{ background: `${theme.textSecondary}20` }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / DURATION) * 100}%`, background: timeLeft <= 10 ? '#EF4444' : theme.gold }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <div className="rounded-2xl p-5 mb-4 min-h-[120px] flex items-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${theme.gold}18`, color: theme.gold }}>{q?.category}</span>
              <h3 className="text-base font-bold mt-2" style={{ color: theme.textPrimary }}>{q?.question}</h3>
            </div>
          </div>
          <div className={q?.type === 'tf' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2.5'}>
            {options.map((opt, i) => {
              const chosen = flash === i;
              const isRight = flash !== null && i === q.correct_index;
              return (
                <button key={i} onClick={() => answer(i)} disabled={flash !== null}
                  className="p-3.5 rounded-xl text-sm font-semibold text-left transition-all active:scale-98"
                  style={{
                    background: isRight ? '#10B98122' : chosen ? '#EF444422' : `${theme.textSecondary}0f`,
                    border: `1px solid ${isRight ? '#10B981' : chosen ? '#EF4444' : theme.cardBorder}`,
                    color: theme.textPrimary,
                  }}>
                  {q?.type !== 'tf' && <span className="font-bold mr-2" style={{ color: theme.gold }}>{['A', 'B', 'C', 'D'][i]}.</span>}
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
