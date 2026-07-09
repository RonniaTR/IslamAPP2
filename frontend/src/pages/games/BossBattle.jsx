import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, RefreshCw, Heart, Shield } from 'lucide-react';
import { drawQuestions } from '../../data/questionBank';
import Confetti from './Confetti';

const BOSS_HP = 100;
const LIVES = 3;
const WIN_BONUS = 150;

// Patron Savaşı: doğru cevaplar patrona hasar verir, yanlışlar can götürür.
// Patronu 3 canın bitmeden devir!
export default function BossBattle({ theme, onXP, onEvent = () => {} }) {
  const [phase, setPhase] = useState('idle'); // idle | playing | won | lost
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [bossHp, setBossHp] = useState(BOSS_HP);
  const [lives, setLives] = useState(LIVES);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState(null);
  const [hit, setHit] = useState(null); // son vuruş miktarı

  const start = useCallback(() => {
    // Orta + zor ağırlıklı havuz
    const pool = [...drawQuestions(60, { difficulty: 'medium' }), ...drawQuestions(40, { difficulty: 'hard' })];
    setQueue(pool.sort(() => Math.random() - 0.5));
    setIdx(0); setBossHp(BOSS_HP); setLives(LIVES); setXp(0); setFlash(null); setHit(null);
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
      const dmg = Math.max(8, Math.round((q.points || 10) * 0.9)); // puana göre hasar
      setHit(dmg);
      const newHp = Math.max(0, bossHp - dmg);
      setBossHp(newHp);
      setXp(x => x + (q.points || 10));
      setTimeout(() => {
        setFlash(null); setHit(null);
        if (newHp <= 0) {
          setPhase('won');
          onEvent('win');
          const finalXp = xp + (q.points || 10) + WIN_BONUS;
          setXp(finalXp);
          onXP(finalXp, 'game_quiz', 'Patron Savaşı Zaferi');
        } else setIdx(i => (i + 1) % queue.length);
      }, 550);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => {
        setFlash(null);
        if (newLives <= 0) {
          setPhase('lost');
          if (xp > 0) onXP(Math.round(xp / 2), 'game_quiz', 'Patron Savaşı (yenilgi)');
        } else setIdx(i => (i + 1) % queue.length);
      }, 550);
    }
  }, [flash, q, bossHp, lives, xp, queue.length, onXP, onEvent]);

  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
        <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4 text-5xl"
          style={{ background: '#7C3AED20', border: '2px solid #7C3AED50' }}>
          👹
        </motion.div>
        <h2 className="text-xl font-black mb-1" style={{ color: theme.textPrimary }}>Patron Savaşı</h2>
        <p className="text-sm mb-2 max-w-xs" style={{ color: theme.textSecondary }}>
          Zorlu sorularla patronun {BOSS_HP} canını erit! Her doğru cevap hasar verir, her yanlış bir kalbini götürür.
        </p>
        <p className="text-[11px] mb-6 font-bold" style={{ color: '#7C3AED' }}>Zafer bonusu: +{WIN_BONUS} XP</p>
        <button onClick={start} className="inline-flex items-center gap-2 px-10 py-3.5 rounded-2xl font-black text-base active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: '#fff' }}>
          <Swords size={18} /> Savaşa Katıl
        </button>
      </div>
    );
  }

  if (phase === 'won' || phase === 'lost') {
    const won = phase === 'won';
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative flex flex-col items-center justify-center px-6 py-10 text-center overflow-hidden">
        {won && <Confetti count={34} />}
        <span className="text-6xl mb-3">{won ? '⚔️🏆' : '💀'}</span>
        <h2 className="text-2xl font-black mb-1" style={{ color: won ? theme.gold : '#EF4444' }}>
          {won ? 'Patron Devrildi!' : 'Patron Kazandı...'}
        </h2>
        <p className="text-sm mb-5" style={{ color: theme.textSecondary }}>
          {won ? `+${xp} XP (zafer bonusu +${WIN_BONUS} dahil)` : `Teselli: +${Math.round(xp / 2)} XP`}
        </p>
        <button onClick={start} className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
          <RefreshCw size={16} /> {won ? 'Tekrar Savaş' : 'İntikam Al'}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="px-4 w-full max-w-md mx-auto">
      {/* Boss paneli */}
      <div className="rounded-2xl p-4 mb-4 relative overflow-hidden" style={{ background: '#7C3AED12', border: '1.5px solid #7C3AED40' }}>
        <div className="flex items-center gap-3">
          <motion.span animate={hit ? { x: [-3, 3, -2, 0], rotate: [-4, 4, 0] } : {}} className="text-4xl">👹</motion.span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-black" style={{ color: '#A855F7' }}>Cehalet Patronu</p>
              <p className="text-xs font-bold tabular-nums" style={{ color: theme.textPrimary }}>{bossHp}/{BOSS_HP}</p>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}20` }}>
              <motion.div className="h-full rounded-full" animate={{ width: `${(bossHp / BOSS_HP) * 100}%` }}
                style={{ background: bossHp > 50 ? 'linear-gradient(90deg,#A855F7,#7C3AED)' : bossHp > 20 ? '#F59E0B' : '#EF4444' }} />
            </div>
          </div>
        </div>
        <AnimatePresence>
          {hit && (
            <motion.span initial={{ opacity: 0, y: 0, scale: 0.8 }} animate={{ opacity: 1, y: -18, scale: 1.1 }} exit={{ opacity: 0 }}
              className="absolute top-2 right-4 text-sm font-black" style={{ color: '#EF4444' }}>-{hit}</motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Canlar + XP */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: LIVES }).map((_, i) => (
            <Heart key={i} size={18} fill={i < lives ? '#EF4444' : 'transparent'} style={{ color: i < lives ? '#EF4444' : theme.textSecondary }} />
          ))}
        </div>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>{xp} XP</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <div className="rounded-2xl p-5 mb-4 min-h-[110px] flex items-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit" style={{ background: '#7C3AED18', color: '#A855F7' }}>
                <Shield size={10} /> {q?.category} · {q?.difficulty === 'hard' ? 'Zor' : 'Orta'}
              </span>
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
                  {q?.type !== 'tf' && <span className="font-bold mr-2" style={{ color: '#A855F7' }}>{['A', 'B', 'C', 'D'][i]}.</span>}
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
