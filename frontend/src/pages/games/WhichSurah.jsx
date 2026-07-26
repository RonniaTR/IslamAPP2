import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lightbulb } from 'lucide-react';
import { SURAH_HINTS } from '../../data/surahHints';
import FeedbackOverlay from './FeedbackOverlay';
import ResultScreen from './ResultScreen';
import QuizCore from './QuizCore';
import { useTx } from '../../i18n';

// 🔎 HANGİ SURE? — ipuçlarından sureyi tanı.
// Az ipucuyla bil → çok XP: 1 ipucu 25, 2 ipucu 15, 3 ipucu 8 XP.
const ROUNDS = 10;
const ACCENT = '#0EA5E9';
const XP_BY_HINTS = [25, 15, 8];

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildRounds() {
  return shuffle(SURAH_HINTS).slice(0, ROUNDS).map(item => {
    const distractors = shuffle(SURAH_HINTS.filter(s => s.surah !== item.surah)).slice(0, 3).map(s => s.surah);
    return { ...item, options: shuffle([item.surah, ...distractors]) };
  });
}

export default function WhichSurah({ theme, onXP, onEvent = () => {} }) {
  const tt = useTx();
  const [phase, setPhase] = useState('playing'); // playing | done
  const [rounds, setRounds] = useState(buildRounds);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(1); // açık ipucu sayısı
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [oneHintCount, setOneHintCount] = useState(0); // tek ipucuyla bilinenler

  const restart = useCallback(() => {
    setRounds(buildRounds());
    setIdx(0); setRevealed(1); setCorrect(0); setXp(0);
    setFlash(null); setOverlay(null); setOneHintCount(0);
    setPhase('playing');
  }, []);

  const r = rounds[idx];

  // QuizCore'a soru objesi: açık ipuçları birleşik metin
  const q = r ? {
    id: `ws_${idx}_${revealed}`,
    type: 'mc',
    category: `🔎 İpucu ${revealed}/${r.hints.length} · +${XP_BY_HINTS[revealed - 1]} XP`,
    question: r.hints.slice(0, revealed).map((h, i) => `${i + 1}) ${h}`).join('  •  '),
    options: r.options,
    correct_index: r.options.indexOf(r.surah),
  } : null;

  const advance = useCallback((state) => {
    setOverlay(null); setFlash(null); setRevealed(1);
    if (idx + 1 >= rounds.length) {
      setPhase('done');
      if (state.c >= Math.ceil(rounds.length * 0.6)) onEvent('win');
      if (state.x > 0) onXP(state.x, 'game_quiz', 'Hangi Sure?');
    } else setIdx(i => i + 1);
  }, [idx, rounds.length, onXP, onEvent]);

  const answer = useCallback((choice) => {
    if (flash !== null || overlay || !r) return;
    const ok = r.options[choice] === r.surah;
    setFlash(choice);
    onEvent('answer', { correct: ok, category: 'Kuran' });
    const fullHints = r.hints.map((h, i) => `${i + 1}) ${h}`).join(' ');
    if (ok) {
      const gained = XP_BY_HINTS[revealed - 1];
      if (revealed === 1) setOneHintCount(n => n + 1);
      setCorrect(c => c + 1); setXp(x => x + gained);
      setOverlay({ mode: 'correct', data: { xp: gained }, next: { c: correct + 1, x: xp + gained } });
    } else {
      setOverlay({
        mode: 'wrong',
        data: { answer: `${r.surah} Suresi`, explanation: fullHints, source: 'Hangi Sure?' },
        next: { c: correct, x: xp },
      });
    }
  }, [flash, overlay, r, revealed, correct, xp, onEvent]);

  const moreHint = useCallback(() => {
    if (!r || revealed >= r.hints.length || flash !== null) return;
    setRevealed(n => n + 1);
  }, [r, revealed, flash]);

  if (phase === 'done') {
    return (
      <ResultScreen theme={theme} title="Hangi Sure?" correct={correct} total={rounds.length} xp={xp}
        stats={[
          { val: `%${Math.round((correct / Math.max(1, rounds.length)) * 100)}`, label: tt('Doğruluk') },
          { val: oneHintCount, label: tt('Tek İpucuyla') },
          { val: `+${correct}`, label: tt('İlmi') },
        ]}
        onReplay={restart} />
    );
  }

  return (
    <div className="px-4 w-full max-w-md mx-auto">
      <FeedbackOverlay mode={overlay?.mode} data={overlay?.data || {}} theme={theme} onContinue={() => overlay && advance(overlay.next)} />

      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: theme.surface, color: theme.textPrimary }}>{idx + 1}/{rounds.length}</span>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: `${ACCENT}18`, color: ACCENT }}>
          <Search size={11} /> Sure Dedektifi
        </span>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>{xp} XP</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: `${theme.textSecondary}20` }}>
        <motion.div className="h-full rounded-full" animate={{ width: `${(idx / rounds.length) * 100}%` }} style={{ background: ACCENT }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <QuizCore q={q} accent={ACCENT} theme={theme} flash={flash} onPick={answer} />
        </motion.div>
      </AnimatePresence>

      {/* Ekstra ipucu — açtıkça kazanılacak XP düşer */}
      {r && revealed < r.hints.length && flash === null && (
        <div className="flex justify-center mt-4">
          <button onClick={moreHint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black active:scale-95 transition-transform"
            style={{ background: `${theme.gold}12`, border: `1px solid ${theme.gold}35`, color: theme.gold }}>
            <Lightbulb size={13} /> Bir ipucu daha ({XP_BY_HINTS[revealed]} XP'ye düşer)
          </button>
        </div>
      )}
    </div>
  );
}
