import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, RefreshCw, Trophy, User } from 'lucide-react';
import { drawQuestions } from '../../data/questionBank';
import Confetti from './Confetti';
import QuizCore from './QuizCore';
import { useTx } from '../../i18n';

const ROUNDS = 10;
// Rakipler: büyük âlimlerin ekollerinden ilham alan AI talebeler
// (âlimlerin kendisi değil — saygı gereği talebe/yoldaş olarak temsil edilir)
const BOTS = [
  { id: 'talebe', name: 'Medrese Talebesi', title: 'Yeni başlayan', acc: 0.4, color: '#10B981', emoji: '📗', bonus: 25 },
  { id: 'nevevi', name: 'Nevevî Talebesi', title: 'Hadis ekolü', acc: 0.55, color: '#3B82F6', emoji: '📿', bonus: 50 },
  { id: 'kesir', name: 'İbn Kesîr Talebesi', title: 'Tefsir ekolü', acc: 0.68, color: '#F59E0B', emoji: '📖', bonus: 75 },
  { id: 'gazali', name: 'Gazâlî Talebesi', title: 'Hikmet ekolü', acc: 0.8, color: '#8B5CF6', emoji: '🕌', bonus: 100 },
  { id: 'selahaddin', name: "Selahaddin'in Yoldaşı", title: 'Efsane rakip', acc: 0.88, color: '#EF4444', emoji: '⚔️', bonus: 150 },
];

// AI Rakip: 10 soruluk düello. Bot her soruda kendi isabet oranıyla cevaplar.
export default function AIDuel({ theme, onXP, onEvent = () => {} }) {
  const tt = useTx();
  const [phase, setPhase] = useState('idle'); // idle | playing | done
  const [bot, setBot] = useState(BOTS[0]);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState(null);
  const [botMark, setBotMark] = useState(null); // bot bu soruda bildi mi

  const start = useCallback((b) => {
    setBot(b);
    setQuestions(drawQuestions(ROUNDS, { mcOnly: true }));
    setIdx(0); setMyScore(0); setBotScore(0); setXp(0); setFlash(null); setBotMark(null);
    setPhase('playing');
  }, []);

  const q = questions[idx];

  const answer = useCallback((choice) => {
    if (flash !== null || !q) return;
    setFlash(choice);
    const ok = choice === q.correct_index;
    const botOk = Math.random() < bot.acc;
    setBotMark(botOk);
    onEvent('answer', { correct: ok, category: q.category });
    let gained = 0;
    if (ok) { gained = q.points || 10; setMyScore(s => s + 1); setXp(x => x + gained); }
    if (botOk) setBotScore(s => s + 1);
    setTimeout(() => {
      setFlash(null); setBotMark(null);
      if (idx + 1 >= questions.length) {
        const finalMy = myScore + (ok ? 1 : 0);
        const finalBot = botScore + (botOk ? 1 : 0);
        const won = finalMy > finalBot;
        setPhase('done');
        if (won) onEvent('win');
        const finalXp = xp + gained + (won ? bot.bonus : 0);
        if (finalXp > 0) onXP(finalXp, 'game_quiz', won ? `AI Düello Zaferi (${bot.name})` : `AI Düello (${bot.name})`);
        setXp(finalXp);
      } else setIdx(i => i + 1);
    }, 650);
  }, [flash, q, idx, questions.length, bot, myScore, botScore, xp, onXP, onEvent]);

  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ background: '#8B5CF620' }}>
          <Bot size={38} style={{ color: '#8B5CF6' }} />
        </div>
        <h2 className="text-xl font-black mb-1" style={{ color: theme.textPrimary }}>AI Rakip</h2>
        <p className="text-sm mb-6 max-w-xs" style={{ color: theme.textSecondary }}>{ROUNDS} soruluk düello! İlim ekollerinin talebelerini yen, bonus XP kazan.</p>
        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          {BOTS.map(b => (
            <button key={b.id} onClick={() => start(b)}
              className="flex items-center gap-3 p-3.5 rounded-2xl text-left active:scale-95 transition-all"
              style={{ background: `${b.color}12`, border: `1.5px solid ${b.color}40` }}>
              <span className="text-2xl">{b.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-black" style={{ color: b.color }}>{b.name}</p>
                <p className="text-[10px]" style={{ color: theme.textSecondary }}>{tt(b.title)} · {tt('isabet')} ~%{Math.round(b.acc * 100)} · {tt('zafer')} +{b.bonus} XP</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const won = myScore > botScore;
    const tie = myScore === botScore;
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative flex flex-col items-center justify-center px-6 py-10 text-center overflow-hidden">
        {won && <Confetti count={30} />}
        <span className="text-5xl mb-3">{won ? '🏆' : tie ? '🤝' : bot.emoji}</span>
        <h2 className="text-2xl font-black mb-1" style={{ color: won ? theme.gold : theme.textPrimary }}>
          {won ? 'Zafer Senin!' : tie ? 'Berabere!' : `${bot.name} kazandı`}
        </h2>
        <p className="text-lg font-black mb-1" style={{ color: theme.gold }}>{myScore} - {botScore}</p>
        <p className="text-sm mb-5" style={{ color: theme.textSecondary }}>+{xp} XP kazandın{won ? ` (zafer bonusu +${bot.bonus} dahil)` : ''}</p>
        <button onClick={() => setPhase('idle')} className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
          <RefreshCw size={16} /> {tt('Yeni Düello')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="px-4 w-full max-w-md mx-auto">
      {/* Skor tabelası */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: `${theme.gold}12`, border: `1px solid ${theme.gold}30` }}>
          <p className="text-[9px] font-bold uppercase flex items-center justify-center gap-1" style={{ color: theme.gold }}><User size={10} /> Sen</p>
          <p className="text-xl font-black" style={{ color: theme.gold }}>{myScore}</p>
        </div>
        <span className="text-xs font-black" style={{ color: theme.textSecondary }}>{idx + 1}/{ROUNDS}</span>
        <div className="flex-1 rounded-xl p-2.5 text-center relative" style={{ background: `${bot.color}12`, border: `1px solid ${bot.color}30` }}>
          <p className="text-[9px] font-bold uppercase" style={{ color: bot.color }}>{bot.emoji} {bot.name}</p>
          <p className="text-xl font-black" style={{ color: bot.color }}>{botScore}</p>
          <AnimatePresence>
            {botMark !== null && (
              <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute -top-2 right-2 text-sm">{botMark ? '✅' : '❌'}</motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Canlı yarış çubukları */}
      <div className="space-y-1.5 mb-4">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}18` }}>
          <motion.div className="h-full rounded-full" animate={{ width: `${(myScore / ROUNDS) * 100}%` }} style={{ background: theme.gold }} />
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}18` }}>
          <motion.div className="h-full rounded-full" animate={{ width: `${(botScore / ROUNDS) * 100}%` }} style={{ background: bot.color }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <QuizCore q={q} accent={bot.color} theme={theme} flash={flash} onPick={answer} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
