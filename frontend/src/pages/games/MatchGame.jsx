import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Trophy, Link2 } from 'lucide-react';
import { MATCH_PAIRS } from '../../data/gameData';
import Confetti from './Confetti';

const ROUND = 6; // her turda 6 çift

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound() {
  const picked = shuffle(MATCH_PAIRS).slice(0, ROUND);
  return {
    left: picked.map((p, i) => ({ id: i, text: p.a })),
    right: shuffle(picked.map((p, i) => ({ id: i, text: p.b }))),
  };
}

export default function MatchGame({ theme, onXP }) {
  const [round, setRound] = useState(() => buildRound());
  const [selLeft, setSelLeft] = useState(null);
  const [selRight, setSelRight] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrong, setWrong] = useState(null); // {left,right}
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  const total = round.left.length;

  const reset = useCallback(() => {
    setRound(buildRound());
    setSelLeft(null); setSelRight(null); setMatched(new Set()); setWrong(null); setMoves(0); setDone(false);
  }, []);

  const tryMatch = useCallback((l, r) => {
    setMoves(m => m + 1);
    if (l === r) {
      setMatched(prev => new Set(prev).add(l));
      setSelLeft(null); setSelRight(null);
    } else {
      setWrong({ left: l, right: r });
      setTimeout(() => { setWrong(null); setSelLeft(null); setSelRight(null); }, 550);
    }
  }, []);

  useEffect(() => {
    if (selLeft !== null && selRight !== null) tryMatch(selLeft, selRight);
  }, [selLeft, selRight, tryMatch]);

  useEffect(() => {
    if (!done && matched.size === total && total > 0) {
      setDone(true);
      // Az hamleyle bitir → daha çok XP. Taban 10 + verimlilik bonusu.
      const perfect = total;
      const efficiency = Math.max(0, perfect - (moves - perfect)); // fazla hamle bonusu düşürür
      const pts = 10 + efficiency * 5;
      onXP(pts, 'game_match', 'Eşleştirme');
    }
  }, [matched, total, done, moves, onXP]);

  const cellStyle = (selected, isMatched, isWrong, color) => ({
    background: isMatched ? '#10B98118' : isWrong ? '#EF444422' : selected ? `${theme.gold}22` : theme.surface,
    border: `1.5px solid ${isMatched ? '#10B981' : isWrong ? '#EF4444' : selected ? theme.gold : theme.cardBorder}`,
    color: isMatched ? '#10B981' : theme.textPrimary,
    opacity: isMatched ? 0.7 : 1,
  });

  const earned = useMemo(() => {
    const efficiency = Math.max(0, total - (moves - total));
    return 10 + efficiency * 5;
  }, [total, moves]);

  return (
    <div className="px-4 w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <p className="text-xs" style={{ color: theme.textSecondary }}>Terimi doğru anlamıyla eşleştir. Ne kadar az hamle, o kadar çok XP!</p>
        <p className="text-sm font-bold mt-1" style={{ color: theme.gold }}>{matched.size}/{total} eşleşti · {moves} hamle</p>
      </div>

      {done ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="relative rounded-2xl p-6 text-center overflow-hidden" style={{ background: '#10B98118', border: '1px solid #10B98155' }}>
          <Confetti count={24} />
          <Trophy size={40} style={{ color: theme.gold }} className="mx-auto mb-3" />
          <p className="text-xl font-black mb-1" style={{ color: theme.gold }}>+{earned} XP</p>
          <p className="text-sm mb-5" style={{ color: theme.textSecondary }}>{moves} hamlede tamamladın</p>
          <button onClick={reset} className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
            <RefreshCw size={16} /> Yeni Tur
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {/* Sol sütun: terimler */}
          <div className="flex flex-col gap-2.5">
            {round.left.map(item => {
              const isMatched = matched.has(item.id);
              const isWrong = wrong?.left === item.id;
              return (
                <button key={item.id} disabled={isMatched} onClick={() => setSelLeft(item.id)}
                  className="p-3 rounded-xl text-sm font-bold transition-all active:scale-95 min-h-[52px] flex items-center justify-center text-center"
                  style={cellStyle(selLeft === item.id, isMatched, isWrong)}>
                  {item.text}
                </button>
              );
            })}
          </div>
          {/* Sağ sütun: anlamlar */}
          <div className="flex flex-col gap-2.5">
            {round.right.map(item => {
              const isMatched = matched.has(item.id);
              const isWrong = wrong?.right === item.id;
              return (
                <button key={item.id} disabled={isMatched} onClick={() => setSelRight(item.id)}
                  className="p-3 rounded-xl text-sm font-semibold transition-all active:scale-95 min-h-[52px] flex items-center justify-center text-center"
                  style={cellStyle(selRight === item.id, isMatched, isWrong)}>
                  {item.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!done && (
        <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px]" style={{ color: theme.textSecondary }}>
          <Link2 size={13} /> Soldan bir terim, sağdan anlamını seç
        </div>
      )}
    </div>
  );
}
