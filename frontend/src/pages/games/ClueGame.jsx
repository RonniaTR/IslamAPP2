import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';
import { useTx } from '../../i18n';

// 🔎 İPUCU OYUNU — "Hangi Sure?" ailesinin ortak motoru (docs/YENI_OZELLIKLER.md Faz 5)
// Az ipucuyla bil → çok XP: 25 · 15 · 8 · 5. Bu bir BİLGİ oyunudur; XP ilim puanıdır.
// items: [{ answer, clues: [zor → kolay], note }]
const XP = [25, 15, 8, 5];
const ROUNDS = 8;

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}
function build(items) {
  return shuffle(items).slice(0, ROUNDS).map((it) => ({
    ...it,
    options: shuffle([it.answer, ...shuffle(items.filter((x) => x.answer !== it.answer)).slice(0, 3).map((x) => x.answer)]),
  }));
}

export default function ClueGame({ theme, onXP, items, accent = '#D4AF37', question, rtlAnswer = false }) {
  const tt = useTx();
  const [rounds, setRounds] = useState(() => build(items));
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(1);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState({ xp: 0, correct: 0 });
  const [done, setDone] = useState(false);

  const r = rounds[idx];
  const maxClues = Math.min(r.clues.length, XP.length);
  const gain = XP[open - 1] || 5;

  const pick = (opt) => {
    if (picked) return;
    setPicked(opt);
    if (opt === r.answer) setScore((s) => ({ xp: s.xp + gain, correct: s.correct + 1 }));
  };
  const next = () => {
    if (idx + 1 >= rounds.length) {
      setDone(true);
      if (score.xp > 0 && onXP) onXP(score.xp, 'game_quiz', question);
      return;
    }
    setIdx(idx + 1); setOpen(1); setPicked(null);
  };
  const restart = () => { setRounds(build(items)); setIdx(0); setOpen(1); setPicked(null); setScore({ xp: 0, correct: 0 }); setDone(false); };

  const card = { background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 20, padding: 16 };

  if (done) {
    return (
      <div className="px-4 py-10 text-center" data-testid="clue-game-done">
        <div style={{ fontSize: 48 }}>🏅</div>
        <h2 className="text-2xl font-extrabold mt-2" style={{ color: theme.textPrimary }}>{score.correct} / {rounds.length}</h2>
        <p className="mt-1" style={{ color: accent, fontWeight: 700 }}>+{score.xp} {tt('İlim XP')}</p>
        <button onClick={restart} className="mt-6 inline-flex items-center gap-2"
          style={{ minHeight: 44, padding: '0 20px', borderRadius: 22, background: accent, color: '#1A1A1A', fontWeight: 700 }}>
          <RotateCcw size={16} /> {tt('Yeniden oyna')}
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-3 max-w-xl mx-auto" data-testid="clue-game">
      <div className="flex justify-between text-[12px]" style={{ color: theme.textSecondary }}>
        <span>{idx + 1} / {rounds.length}</span><span style={{ color: accent, fontWeight: 700 }}>{score.xp} XP</span>
      </div>
      <h2 className="text-lg font-extrabold" style={{ color: theme.textPrimary }}>{tt(question)}</h2>

      {r.clues.slice(0, open).map((c, i) => (
        <div key={i} style={{ ...card, borderInlineStart: `3px solid ${accent}` }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: 0.4 }}>{tt('İPUCU')} {i + 1}</span>
          <p className="text-[14px] leading-relaxed mt-1" style={{ color: theme.textPrimary }}>{c}</p>
        </div>
      ))}

      {!picked && open < maxClues && (
        <button onClick={() => setOpen(open + 1)} className="flex items-center justify-center gap-2"
          style={{ minHeight: 40, borderRadius: 20, border: `1px dashed ${theme.cardBorder}`, color: theme.textSecondary, fontSize: 13 }}>
          <Lightbulb size={15} /> {tt('Bir ipucu daha')} ({XP[open] || 5} XP)
        </button>
      )}

      <div className="grid grid-cols-2 gap-2">
        {r.options.map((o) => {
          const isAns = o === r.answer; const isPick = o === picked;
          const bg = !picked ? theme.surface : isAns ? '#1F4D33' : isPick ? '#4A1F1F' : theme.surface;
          const fg = !picked ? theme.textPrimary : isAns ? '#8EE3B0' : isPick ? '#F2A6A6' : theme.textMuted;
          return (
            <button key={o} onClick={() => pick(o)} disabled={!!picked} dir={rtlAnswer ? 'auto' : undefined}
              style={{ minHeight: 56, borderRadius: 16, padding: '8px 10px', background: bg, color: fg, border: `1px solid ${theme.cardBorder}`, fontSize: 14, fontWeight: 600 }}>
              {o}
            </button>
          );
        })}
      </div>

      {picked && (
        <>
          <div style={card}>
            <p className="text-[13px] font-bold" style={{ color: picked === r.answer ? '#8EE3B0' : theme.textPrimary }}>
              {picked === r.answer ? `${tt('Doğru')} · +${gain} XP` : `${tt('Doğru cevap')}: ${r.answer}`}
            </p>
            {r.note && <p className="text-[13px] leading-relaxed mt-1" style={{ color: theme.textSecondary }}>{r.note}</p>}
          </div>
          <button onClick={next} style={{ minHeight: 48, borderRadius: 24, background: accent, color: '#1A1A1A', fontWeight: 700, fontSize: 15 }}>
            {idx + 1 >= rounds.length ? tt('Sonucu gör') : tt('Sonraki')}
          </button>
        </>
      )}
    </div>
  );
}
