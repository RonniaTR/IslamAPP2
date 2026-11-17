import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Ortak soru kartı: soru kâğıt gibi aşağıdan gelir, şıklar sırayla dizilir; seçilen şık önce "kilitlenir"
// (altın), sonra doğruysa yeşil nabız, yanlışsa sarsılır ve doğru şık yeşil yanar.
// state: 'ask' | 'locked' | 'reveal'
export default function QuestionCard({ q, color = '#B0893C', state, picked, hidden = [], onPick, kids = false, theme }) {
  const big = kids ? 1.12 : 1;
  const ink = theme?.textPrimary || '#17261F';
  return (
    <AnimatePresence mode="wait">
      <motion.div key={q.id} initial={{ opacity: 0, y: 36, rotateX: -12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -24, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }} style={{ display: 'flex', flexDirection: 'column', gap: 10, perspective: 800 }}>
        <div style={{ background: '#FBF8F0', color: '#1A1A1A', borderRadius: 24, padding: '20px 18px', border: `1px solid ${color}55`, boxShadow: `0 12px 30px -16px ${color}`, position: 'relative', overflow: 'hidden' }}>
          <span aria-hidden style={{ position: 'absolute', insetInlineStart: 0, top: 0, bottom: 0, width: 5, background: color }} />
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 19 * big, lineHeight: 1.45, fontWeight: 600, margin: 0 }}>{q.question}</p>
        </div>
        {q.options.map((o, i) => {
          if (hidden.includes(i)) return <div key={i} style={{ height: 54 }} aria-hidden />;
          const isPick = picked === i;
          const isRight = i === q.correct;
          let bg = theme?.cardBg || '#FFFFFF';
          let fg = ink;
          let border = theme?.cardBorder || 'rgba(0,0,0,0.08)';
          if (state === 'locked' && isPick) { bg = '#F3DFA6'; fg = '#3A2A08'; border = '#D2AE62'; }
          if (state === 'reveal' && isRight) { bg = '#2F8F6B'; fg = '#FFFFFF'; border = '#2F8F6B'; }
          if (state === 'reveal' && isPick && !isRight) { bg = '#C4553E'; fg = '#FFFFFF'; border = '#C4553E'; }
          return (
            <motion.button key={i} type="button" disabled={state !== 'ask'} onClick={() => onPick(i)}
              initial={{ opacity: 0, x: -18 }}
              animate={state === 'reveal' && isPick && !isRight ? { opacity: 1, x: [0, -10, 9, -6, 4, 0] } : state === 'reveal' && isRight ? { opacity: 1, x: 0, scale: [1, 1.04, 1] } : { opacity: 1, x: 0 }}
              transition={{ delay: state === 'ask' ? 0.08 + i * 0.07 : 0, duration: state === 'reveal' ? 0.45 : 0.3 }}
              whileTap={state === 'ask' ? { scale: 0.97 } : undefined}
              style={{ minHeight: 54 * big, borderRadius: 18, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'start', cursor: state === 'ask' ? 'pointer' : 'default',
                background: bg, color: fg, border: `1.5px solid ${border}`, fontSize: 15 * big, fontWeight: 600, transition: 'background 0.25s, color 0.25s' }}>
              <span style={{ width: 28, height: 28, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800,
                background: state === 'reveal' && (isRight || isPick) ? 'rgba(255,255,255,0.22)' : `${color}1F`, color: state === 'reveal' && (isRight || isPick) ? '#fff' : color }}>
                {'ABCD'[i]}
              </span>
              <span style={{ flex: 1 }}>{o}</span>
            </motion.button>
          );
        })}
        {state === 'reveal' && q.explanation && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ fontSize: 13, lineHeight: 1.5, color: theme?.textSecondary || '#5A6B62', margin: '2px 4px 0' }}>{q.explanation}</motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/** Rub'ul hizb nişanı (sekiz köşeli yıldız). */
export function Nisan({ color, on, size = 34, label }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 40 40" aria-label={label} role="img"
      initial={false} animate={on ? { scale: [0.6, 1.25, 1], rotate: [0, 45, 0] } : { scale: 1 }} transition={{ duration: 0.7 }}>
      <g transform="translate(20 20)">
        <rect x="-12" y="-12" width="24" height="24" rx="2" fill={on ? color : 'none'} stroke={on ? color : 'rgba(128,128,128,0.45)'} strokeWidth="2" />
        <rect x="-12" y="-12" width="24" height="24" rx="2" transform="rotate(45)" fill={on ? color : 'none'} stroke={on ? color : 'rgba(128,128,128,0.45)'} strokeWidth="2" />
        <circle r="5.5" fill={on ? '#FFF6D8' : 'none'} stroke={on ? 'none' : 'rgba(128,128,128,0.45)'} strokeWidth="1.5" />
      </g>
    </motion.svg>
  );
}
