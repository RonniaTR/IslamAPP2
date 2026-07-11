import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, RefreshCw, Heart, Shield } from 'lucide-react';
import { drawQuestions } from '../../data/questionBank';
import Confetti from './Confetti';
import QuizCore from './QuizCore';

// 👹 PATRON SAVAŞI — cehalet ordusuna karşı ilim meydanları.
// Doğru cevap patrona hasar verir, yanlış senden can götürür.
const LIVES = 3;
const ARENAS = [
  { id: 'bedir', name: 'Bedir Meydanı', boss: 'Cehalet Patronu', emoji: '👹', hp: 80, bonus: 100, color: '#F59E0B', badge: 'Bedir Fatihi' },
  { id: 'uhud', name: 'Uhud Meydanı', boss: 'Gaflet Patronu', emoji: '🐍', hp: 110, bonus: 150, color: '#7C3AED', badge: 'Uhud Kahramanı' },
  { id: 'hendek', name: 'Hendek Meydanı', boss: 'Nisyan Patronu', emoji: '🐉', hp: 140, bonus: 220, color: '#EF4444', badge: 'Hendek Efsanesi' },
];

const loadBadges = () => { try { return JSON.parse(localStorage.getItem('gc_badges')) || []; } catch { return []; } };
const addBadge = (b) => { try { const list = loadBadges(); if (!list.includes(b)) localStorage.setItem('gc_badges', JSON.stringify([...list, b])); } catch { /* ignore */ } };

export default function BossBattle({ theme, onXP, onEvent = () => {} }) {
  const [phase, setPhase] = useState('pick'); // pick | playing | won | lost
  const [arena, setArena] = useState(ARENAS[0]);
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [lives, setLives] = useState(LIVES);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState(null);
  const [hit, setHit] = useState(null);
  const [hidden, setHidden] = useState([]);
  const [jokers, setJokers] = useState({ shield: true, hint: true });
  const [shieldOn, setShieldOn] = useState(false);
  const badges = loadBadges();

  const start = useCallback((a) => {
    setArena(a);
    const pool = [...drawQuestions(60, { difficulty: 'medium' }), ...drawQuestions(40, { difficulty: 'hard' })];
    setQueue(pool.sort(() => Math.random() - 0.5));
    setIdx(0); setBossHp(a.hp); setLives(LIVES); setXp(0); setFlash(null); setHit(null);
    setHidden([]); setJokers({ shield: true, hint: true }); setShieldOn(false);
    setPhase('playing');
  }, []);

  const q = queue[idx];
  const options = q ? (q.type === 'tf' ? ['Doğru', 'Yanlış'] : q.options) : [];

  const answer = useCallback((choice) => {
    if (flash !== null || !q) return;
    const ok = choice === q.correct_index;
    onEvent('answer', { correct: ok, category: q.category });
    if (ok) {
      setFlash(choice);
      const dmg = Math.max(8, Math.round((q.points || 10) * 0.9));
      setHit(dmg);
      const newHp = Math.max(0, bossHp - dmg);
      setBossHp(newHp);
      setXp(x => x + (q.points || 10));
      setTimeout(() => {
        setFlash(null); setHit(null); setHidden([]);
        if (newHp <= 0) {
          setPhase('won');
          onEvent('win');
          addBadge(arena.badge);
          const finalXp = xp + (q.points || 10) + arena.bonus;
          setXp(finalXp);
          onXP(finalXp, 'game_quiz', `${arena.name} Zaferi`);
        } else setIdx(i => (i + 1) % queue.length);
      }, 550);
    } else if (shieldOn) {
      // Kalkan: bu yanlış affedilir, şık kilitlenir
      setShieldOn(false);
      setHidden(h => [...h, choice]);
    } else {
      setFlash(choice);
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => {
        setFlash(null); setHidden([]);
        if (newLives <= 0) {
          setPhase('lost');
          if (xp > 0) onXP(Math.round(xp / 2), 'game_quiz', `${arena.name} (yenilgi)`);
        } else setIdx(i => (i + 1) % queue.length);
      }, 550);
    }
  }, [flash, q, bossHp, lives, xp, arena, shieldOn, queue.length, onXP, onEvent]);

  const useShield = useCallback(() => {
    if (!jokers.shield || shieldOn) return;
    setJokers(j => ({ ...j, shield: false }));
    setShieldOn(true);
  }, [jokers, shieldOn]);
  const useHint = useCallback(() => {
    if (!jokers.hint || !q || q.type === 'tf') return;
    setJokers(j => ({ ...j, hint: false }));
    const wrongIdxs = options.map((_, i) => i).filter(i => i !== q.correct_index);
    setHidden(wrongIdxs.sort(() => Math.random() - 0.5).slice(0, 2));
  }, [jokers, q, options]);

  // ─── MEYDAN SEÇİMİ ───
  if (phase === 'pick') {
    return (
      <div className="px-5 w-full max-w-md mx-auto">
        <p className="text-xs text-center mb-4" style={{ color: theme.textSecondary }}>
          Meydanını seç! Her doğru cevap patrona hasar verir, her yanlış bir kalbini götürür.
        </p>
        <div className="space-y-3">
          {ARENAS.map(a => {
            const earned = badges.includes(a.badge);
            return (
              <button key={a.id} onClick={() => start(a)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left active:scale-95 transition-all relative overflow-hidden"
                style={{ background: `linear-gradient(150deg, ${a.color}14, ${theme.surface})`, border: `1.5px solid ${a.color}45` }}>
                <motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl" style={{ filter: `drop-shadow(0 4px 12px ${a.color}70)` }}>{a.emoji}</motion.span>
                <div className="flex-1">
                  <p className="text-sm font-black" style={{ color: a.color }}>{a.name}</p>
                  <p className="text-[10px]" style={{ color: theme.textSecondary }}>{a.boss} · {a.hp} HP · zafer +{a.bonus} XP</p>
                  <p className="text-[9px] mt-0.5 font-bold" style={{ color: earned ? '#10B981' : theme.textSecondary }}>
                    🏅 {a.badge} {earned ? '✓ Kazanıldı' : ''}
                  </p>
                </div>
                <Swords size={18} style={{ color: a.color }} />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── SONUÇ ───
  if (phase === 'won' || phase === 'lost') {
    const won = phase === 'won';
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative flex flex-col items-center justify-center px-6 py-10 text-center overflow-hidden">
        {won && <Confetti count={34} />}
        <span className="text-6xl mb-3">{won ? '⚔️🏆' : '💀'}</span>
        <h2 className="text-2xl font-black mb-1" style={{ color: won ? theme.gold : '#EF4444' }}>
          {won ? `${arena.boss} Devrildi!` : `${arena.boss} Kazandı...`}
        </h2>
        {won && <p className="text-xs font-black mb-1" style={{ color: '#10B981' }}>🏅 "{arena.badge}" rozeti kazanıldı!</p>}
        <p className="text-sm mb-5" style={{ color: theme.textSecondary }}>
          {won ? `+${xp} XP (zafer bonusu +${arena.bonus} dahil)` : `Teselli: +${Math.round(xp / 2)} XP`}
        </p>
        <button onClick={() => setPhase('pick')} className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
          <RefreshCw size={16} /> {won ? 'Yeni Meydan' : 'İntikam Al'}
        </button>
      </motion.div>
    );
  }

  // ─── SAVAŞ ───
  return (
    <div className="px-4 w-full max-w-md mx-auto">
      {/* Boss paneli */}
      <div className="rounded-2xl p-4 mb-4 relative overflow-hidden" style={{ background: `${arena.color}12`, border: `1.5px solid ${arena.color}40` }}>
        <div className="flex items-center gap-3">
          <motion.span animate={hit ? { x: [-3, 3, -2, 0], rotate: [-4, 4, 0] } : {}} className="text-4xl">{arena.emoji}</motion.span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-black" style={{ color: arena.color }}>{arena.boss} · {arena.name}</p>
              <p className="text-xs font-bold tabular-nums" style={{ color: theme.textPrimary }}>{bossHp}/{arena.hp}</p>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}20` }}>
              <motion.div className="h-full rounded-full" animate={{ width: `${(bossHp / arena.hp) * 100}%` }}
                style={{ background: bossHp > arena.hp / 2 ? `linear-gradient(90deg, ${arena.color}, ${arena.color}cc)` : bossHp > arena.hp / 5 ? '#F59E0B' : '#EF4444' }} />
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

      {/* Canlar + XP + jokerler */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: LIVES }).map((_, i) => (
            <Heart key={i} size={18} fill={i < lives ? '#EF4444' : 'transparent'} style={{ color: i < lives ? '#EF4444' : theme.textSecondary }} />
          ))}
          {shieldOn && <Shield size={16} className="ml-1" style={{ color: '#10B981' }} />}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={useShield} disabled={!jokers.shield || shieldOn}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-black disabled:opacity-35 active:scale-95"
            style={{ background: '#10B98115', border: '1px solid #10B98140', color: '#10B981' }}>
            🛡️ Kalkan
          </button>
          <button onClick={useHint} disabled={!jokers.hint || q?.type === 'tf'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-black disabled:opacity-35 active:scale-95"
            style={{ background: `${theme.gold}15`, border: `1px solid ${theme.gold}40`, color: theme.gold }}>
            💡 İpucu
          </button>
          <span className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>{xp} XP</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <QuizCore
            q={q ? { ...q, category: `🛡️ ${q.category} · ${q.difficulty === 'hard' ? 'Zor' : 'Orta'}` } : q}
            accent={arena.color} theme={theme} flash={flash} hidden={hidden} onPick={answer} minHeight={100} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
