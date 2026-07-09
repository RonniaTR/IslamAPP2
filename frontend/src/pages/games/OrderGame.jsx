import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ListOrdered, RefreshCw, Trophy } from 'lucide-react';
import { ORDER_PUZZLES } from '../../data/gameData';
import Confetti from './Confetti';

function shuffled(items) {
  const a = items.map((text, i) => ({ text, correctIdx: i }));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Karışım tesadüfen doğru sıraysa ilk ikisini takasla
  if (a.every((x, i) => x.correctIdx === i) && a.length > 1) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

function newPuzzle(prevTitle) {
  let p;
  do { p = ORDER_PUZZLES[Math.floor(Math.random() * ORDER_PUZZLES.length)]; }
  while (ORDER_PUZZLES.length > 1 && p.title === prevTitle);
  return p;
}

// Doğru Sırala: karışık öğelere sırayla dokun; doğru öğe yerine oturur.
export default function OrderGame({ theme, onXP, onEvent = () => {} }) {
  const [puzzle, setPuzzle] = useState(() => newPuzzle(null));
  const [pool, setPool] = useState(() => shuffled(puzzle.items));
  const [placed, setPlaced] = useState(0); // kaç öğe doğru yerleşti
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(null);
  const [done, setDone] = useState(false);
  const [earned, setEarned] = useState(0);

  const restart = useCallback(() => {
    const p = newPuzzle(puzzle.title);
    setPuzzle(p);
    setPool(shuffled(p.items));
    setPlaced(0); setMistakes(0); setShake(null); setDone(false); setEarned(0);
  }, [puzzle]);

  const tap = useCallback((item, poolIdx) => {
    if (done) return;
    if (item.correctIdx === placed) {
      const newPlaced = placed + 1;
      setPlaced(newPlaced);
      setPool(prev => prev.filter((_, i) => i !== poolIdx));
      if (newPlaced === puzzle.items.length) {
        // Az hatayla bitir → çok XP (taban 20, hata başına -5, min 5)
        const pts = Math.max(5, 20 + (puzzle.items.length - 4) * 5 - mistakes * 5);
        setEarned(pts);
        setDone(true);
        onEvent('answer', { correct: true, category: 'Sıralama' });
        if (mistakes === 0) onEvent('win');
        onXP(pts, 'game_match', 'Doğru Sırala');
      }
    } else {
      setMistakes(m => m + 1);
      setShake(poolIdx);
      onEvent('answer', { correct: false, category: 'Sıralama' });
      setTimeout(() => setShake(null), 420);
    }
  }, [done, placed, puzzle, mistakes, onXP, onEvent]);

  return (
    <div className="px-4 w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <ListOrdered size={15} style={{ color: '#F59E0B' }} />
          <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{puzzle.title}</p>
        </div>
        <p className="text-[11px]" style={{ color: theme.textSecondary }}>Öğelere doğru sırayla dokun · {mistakes} hata</p>
      </div>

      {/* Yerleşen sıra */}
      <div className="flex flex-col gap-2 mb-5">
        {puzzle.items.map((text, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl min-h-[48px]"
            style={{
              background: i < placed ? '#10B98115' : `${theme.textSecondary}08`,
              border: `1.5px ${i < placed ? 'solid #10B981' : `dashed ${theme.cardBorder}`}`,
            }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
              style={{ background: i < placed ? '#10B981' : `${theme.textSecondary}20`, color: i < placed ? '#fff' : theme.textSecondary }}>
              {i + 1}
            </span>
            <span className="text-sm font-bold" style={{ color: i < placed ? '#10B981' : theme.textSecondary }}>
              {i < placed ? text : '· · ·'}
            </span>
          </div>
        ))}
      </div>

      {/* Sonuç */}
      {done ? (
        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="relative rounded-2xl p-5 text-center overflow-hidden" style={{ background: '#10B98118', border: '1px solid #10B98155' }}>
          <Confetti count={22} />
          <Trophy size={34} style={{ color: theme.gold }} className="mx-auto mb-2" />
          <p className="text-xl font-black mb-1" style={{ color: theme.gold }}>+{earned} XP</p>
          <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>{mistakes === 0 ? 'Hatasız! Mükemmel sıralama 🎯' : `${mistakes} hata ile tamamladın`}</p>
          <button onClick={restart} className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
            <RefreshCw size={15} /> Yeni Sıralama
          </button>
        </motion.div>
      ) : (
        /* Karışık havuz */
        <div className="flex flex-wrap gap-2 justify-center">
          {pool.map((item, i) => (
            <motion.button key={`${item.text}-${i}`} onClick={() => tap(item, i)}
              animate={shake === i ? { x: [-6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="px-4 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform"
              style={{
                background: shake === i ? '#EF444422' : theme.surface,
                border: `1.5px solid ${shake === i ? '#EF4444' : '#F59E0B40'}`,
                color: theme.textPrimary,
              }}>
              {item.text}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
