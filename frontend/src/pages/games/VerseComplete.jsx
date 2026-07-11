import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildVerseQuestions } from '../../data/verseData';
import FeedbackOverlay from './FeedbackOverlay';
import ResultScreen from './ResultScreen';
import QuizCore from './QuizCore';

// 🧩 AYET TAMAMLAMA — kısa surelerin meallerinde "devamı hangisi?"
// QuizCore motoru üzerine kurulu: seslendirme, titreşim, animasyonlar hazır.
const ROUNDS = 10;
const ACCENT = '#0EA5E9';

export default function VerseComplete({ theme, onXP, onEvent = () => {} }) {
  const [phase, setPhase] = useState('playing'); // playing | done
  const [questions, setQuestions] = useState(() => buildVerseQuestions(ROUNDS));
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [wrongs, setWrongs] = useState([]);

  const restart = useCallback((pool) => {
    setQuestions(pool && pool.length ? pool : buildVerseQuestions(ROUNDS));
    setIdx(0); setCorrect(0); setXp(0); setFlash(null); setOverlay(null); setWrongs([]);
    setPhase('playing');
  }, []);

  const q = questions[idx];

  const advance = useCallback((state) => {
    setOverlay(null); setFlash(null);
    if (idx + 1 >= questions.length) {
      setPhase('done');
      if (state.c >= Math.ceil(questions.length * 0.6)) onEvent('win');
      if (state.x > 0) onXP(state.x, 'game_quiz', 'Ayet Tamamlama');
    } else setIdx(i => i + 1);
  }, [idx, questions.length, onXP, onEvent]);

  const answer = useCallback((choice) => {
    if (flash !== null || overlay || !q) return;
    const ok = choice === q.correct_index;
    setFlash(choice);
    onEvent('answer', { correct: ok, category: 'Kuran' });
    if (ok) {
      const gained = q.points;
      setCorrect(c => c + 1); setXp(x => x + gained);
      setOverlay({ mode: 'correct', data: { xp: gained }, next: { c: correct + 1, x: xp + gained } });
    } else {
      setWrongs(w => [...w, q]);
      setOverlay({ mode: 'wrong', data: { answer: q.options[q.correct_index], explanation: q.explanation, source: q.category }, next: { c: correct, x: xp } });
    }
  }, [flash, overlay, q, correct, xp, onXP, onEvent]);

  if (phase === 'done') {
    return (
      <ResultScreen theme={theme} title="Ayet Tamamlama" correct={correct} total={questions.length} xp={xp}
        stats={[
          { val: `%${Math.round((correct / Math.max(1, questions.length)) * 100)}`, label: 'Doğruluk' },
          { val: `${questions.length}`, label: 'Ayet' },
          { val: `+${correct}`, label: 'İlmi' },
        ]}
        wrongCount={wrongs.length}
        onReplay={() => restart()}
        onReplayWrongs={() => restart(wrongs)} />
    );
  }

  return (
    <div className="px-4 w-full max-w-md mx-auto">
      <FeedbackOverlay mode={overlay?.mode} data={overlay?.data || {}} theme={theme} onContinue={() => overlay && advance(overlay.next)} />

      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: theme.surface, color: theme.textPrimary }}>{idx + 1}/{questions.length}</span>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: `${ACCENT}18`, color: ACCENT }}>🧩 Meal Yolculuğu</span>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>{xp} XP</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: `${theme.textSecondary}20` }}>
        <motion.div className="h-full rounded-full" animate={{ width: `${(idx / questions.length) * 100}%` }} style={{ background: ACCENT }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <QuizCore q={q} accent={ACCENT} theme={theme} flash={flash} onPick={answer} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
