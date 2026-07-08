import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Lightbulb, RefreshCw, Trophy } from 'lucide-react';
import { WORD_PUZZLES, TR_ALPHABET } from '../../data/gameData';

const MAX_LIVES = 6;

function newPuzzle(prevWord) {
  let p;
  do { p = WORD_PUZZLES[Math.floor(Math.random() * WORD_PUZZLES.length)]; }
  while (WORD_PUZZLES.length > 1 && p.word === prevWord);
  return p;
}

export default function WordGame({ theme, onXP }) {
  const [puzzle, setPuzzle] = useState(() => newPuzzle(null));
  const [guessed, setGuessed] = useState(new Set());
  const [lives, setLives] = useState(MAX_LIVES);
  const [status, setStatus] = useState('playing'); // playing | won | lost
  const [sessionXP, setSessionXP] = useState(0);

  const letters = puzzle.word.split('');
  const revealed = letters.every(ch => ch === ' ' || guessed.has(ch));

  useEffect(() => {
    if (status !== 'playing') return;
    if (revealed) {
      const pts = 15 + lives * 5; // canlar kaldıkça daha çok XP
      setStatus('won');
      setSessionXP(x => x + pts);
      onXP(pts, 'game_word', 'Kelime Tamamlama');
    } else if (lives <= 0) {
      setStatus('lost');
    }
  }, [revealed, lives, status, onXP]);

  const guess = useCallback((letter) => {
    if (status !== 'playing' || guessed.has(letter)) return;
    setGuessed(prev => new Set(prev).add(letter));
    if (!puzzle.word.includes(letter)) setLives(l => l - 1);
  }, [status, guessed, puzzle]);

  const restart = useCallback(() => {
    setPuzzle(prev => newPuzzle(prev.word));
    setGuessed(new Set());
    setLives(MAX_LIVES);
    setStatus('playing');
  }, []);

  return (
    <div className="flex flex-col items-center px-4">
      {/* Üst bilgi */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Heart key={i} size={16} fill={i < lives ? '#EF4444' : 'transparent'} style={{ color: i < lives ? '#EF4444' : theme.textSecondary }} />
          ))}
        </div>
        <span className="text-sm font-bold" style={{ color: theme.gold }}>{sessionXP} XP</span>
      </div>

      {/* İpucu */}
      <div className="w-full max-w-md rounded-2xl p-4 mb-5 flex items-start gap-3" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
        <Lightbulb size={18} style={{ color: theme.gold }} className="mt-0.5 shrink-0" />
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${theme.gold}18`, color: theme.gold }}>{puzzle.cat}</span>
          <p className="text-sm mt-1.5" style={{ color: theme.textPrimary }}>{puzzle.hint}</p>
        </div>
      </div>

      {/* Kelime kutuları */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        {letters.map((ch, i) => (
          <div key={i} className="w-9 h-11 rounded-lg flex items-center justify-center text-lg font-black"
            style={{
              background: ch === ' ' ? 'transparent' : theme.surface,
              border: ch === ' ' ? 'none' : `1.5px solid ${guessed.has(ch) || status !== 'playing' ? theme.gold : theme.cardBorder}`,
              color: theme.gold,
            }}>
            {ch === ' ' ? '' : (guessed.has(ch) || status !== 'playing' ? ch : '')}
          </div>
        ))}
      </div>

      {/* Sonuç */}
      {status !== 'playing' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-2xl p-5 mb-4 text-center" style={{ background: status === 'won' ? '#10B98118' : '#EF444418', border: `1px solid ${status === 'won' ? '#10B981' : '#EF4444'}55` }}>
          {status === 'won'
            ? <div className="flex items-center justify-center gap-2 font-black" style={{ color: '#10B981' }}><Trophy size={20} /> Tebrikler! +{15 + lives * 5} XP</div>
            : <p className="font-bold" style={{ color: '#EF4444' }}>Kelime: <span style={{ color: theme.gold }}>{puzzle.word}</span></p>}
          <button onClick={restart} className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
            <RefreshCw size={16} /> Yeni Kelime
          </button>
        </motion.div>
      )}

      {/* Klavye */}
      {status === 'playing' && (
        <div className="w-full max-w-md grid grid-cols-7 gap-1.5">
          {TR_ALPHABET.map(letter => {
            const used = guessed.has(letter);
            const inWord = puzzle.word.includes(letter);
            return (
              <button key={letter} onClick={() => guess(letter)} disabled={used}
                className="aspect-square rounded-lg text-sm font-bold transition-all active:scale-90"
                style={{
                  background: used ? (inWord ? '#10B98130' : `${theme.textSecondary}12`) : theme.surface,
                  border: `1px solid ${used && inWord ? '#10B981' : theme.cardBorder}`,
                  color: used ? (inWord ? '#10B981' : theme.textSecondary) : theme.textPrimary,
                  opacity: used && !inWord ? 0.4 : 1,
                }}>
                {letter}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
