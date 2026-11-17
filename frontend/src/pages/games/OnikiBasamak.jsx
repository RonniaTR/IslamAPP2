import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Timer, SkipForward, LogOut } from 'lucide-react';
import sfx from '../../services/sfx';
import { createPool } from './questionPool';
import QuestionCard from './QuestionCard';
import Confetti from './Confetti';

// 🎙️ 12 BASAMAK — sahnede tek kişilik bilgi yarışması.
//   · 12 soru, kolaydan zora. Her basamağın bir "nur" değeri var; 4. ve 8. basamak BARAJ'dır.
//   · Yanlışta son geçilen baraja düşersin. İstediğin an "Çekil" diyip kazandığını alırsın.
//   · Üç joker, her biri bir kez: Yarı yarıya · +15 saniye · Pas (soruyu değiştir).
//   · Şık seçilince sahne kararır, davul çalar, sonra cevap açılır.
const LADDER = [10, 20, 30, 50, 100, 150, 200, 300, 500, 700, 850, 1000];
const SAFE = [3, 7];                               // 0 tabanlı: 4. ve 8. basamak
const level = (i) => (i < 4 ? 'easy' : i < 8 ? 'medium' : 'hard');
const LIMIT = 30;

function Spotlights({ dim }) {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 28 }}>
      {[-1, 1].map((side) => (
        <motion.div key={side} animate={{ rotate: [side * 14, side * -6, side * 14], opacity: dim ? 0.15 : 0.55 }} transition={{ rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.4 } }}
          style={{ position: 'absolute', top: -40, [side < 0 ? 'left' : 'right']: '18%', width: 120, height: 420, transformOrigin: '50% 0%',
            background: 'linear-gradient(180deg, rgba(255,236,190,0.55) 0%, rgba(255,236,190,0) 85%)', clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)', filter: 'blur(2px)' }} />
      ))}
    </div>
  );
}

export default function OnikiBasamak({ theme, onXP = () => {}, onEvent = () => {} }) {
  const pool = useMemo(() => createPool(), []);
  const [step, setStep] = useState(0);
  const [q, setQ] = useState(() => pool.byLevel('easy'));
  const [qState, setQState] = useState('ask');
  const [picked, setPicked] = useState(null);
  const [hidden, setHidden] = useState([]);
  const [jokers, setJokers] = useState({ yari: true, sure: true, pas: true });
  const [time, setTime] = useState(LIMIT);
  const [end, setEnd] = useState(null);            // { score, won, walked }
  const timer = useRef(null);

  const banked = (i) => { let b = 0; SAFE.forEach((s) => { if (i > s) b = LADDER[s]; }); return b; };
  const current = step > 0 ? LADDER[step - 1] : 0;

  useEffect(() => {
    if (end || qState !== 'ask') return undefined;
    timer.current = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer.current);
  }, [q, qState, end]);
  useEffect(() => { if (time === 0 && qState === 'ask' && !end) lock(-1); }, [time]);

  const finish = (score, won, walked) => {
    clearInterval(timer.current);
    setEnd({ score, won, walked });
    if (won) { onEvent('win'); sfx.victory(); }
    const xp = Math.round(score / 10);
    if (xp > 0) onXP(xp, 'game_quiz', `12 Basamak: ${score} nur`);
  };

  const lock = (i) => {
    clearInterval(timer.current);
    setPicked(i); setQState('locked');
    sfx.suspense();
    setTimeout(() => {
      const ok = i === q.correct;
      setQState('reveal');
      onEvent('answer', { correct: ok, category: q.category });
      if (ok) {
        sfx.correct();
        if (SAFE.includes(step)) sfx.crown();
        if (step === LADDER.length - 1) setTimeout(() => finish(LADDER[step], true, false), 1400);
      } else {
        sfx.wrong();
        setTimeout(() => finish(banked(step), false, false), 1800);
      }
    }, 1400);
  };

  const next = () => {
    const n = step + 1;
    setStep(n); setQ(pool.byLevel(level(n))); setQState('ask'); setPicked(null); setHidden([]); setTime(LIMIT);
  };

  const applyJoker = (k) => {
    if (!jokers[k] || qState !== 'ask') return;
    setJokers((j) => ({ ...j, [k]: false }));
    sfx.claim();
    if (k === 'yari') {
      const wrong = q.options.map((_, i) => i).filter((i) => i !== q.correct);
      setHidden(pool.shuffle(wrong).slice(0, Math.max(0, q.options.length - 2)));
    }
    if (k === 'sure') setTime((t) => t + 15);
    if (k === 'pas') { setQ(pool.byLevel(level(step))); setHidden([]); setTime(LIMIT); }
  };

  const restart = () => { setStep(0); setQ(pool.byLevel('easy')); setQState('ask'); setPicked(null); setHidden([]); setJokers({ yari: true, sure: true, pas: true }); setTime(LIMIT); setEnd(null); };

  const stage = { position: 'relative', borderRadius: 28, padding: '18px 16px 20px', overflow: 'hidden', color: '#F6EFDD',
    background: 'radial-gradient(ellipse at 50% 0%, #3A2E5C 0%, #171A33 55%, #0B0D1C 100%)', boxShadow: '0 20px 40px -18px rgba(8,10,25,0.8)' };

  if (end) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 18px 40px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} style={{ ...stage, textAlign: 'center', padding: '36px 20px' }}>
          <Spotlights />
          {end.won && <Confetti count={60} />}
          <p style={{ position: 'relative', fontSize: 11, letterSpacing: 3, color: '#E2B85A', fontWeight: 800 }}>{end.won ? 'ZİRVE' : end.walked ? 'ÇEKİLDİN' : 'YARIŞMA BİTTİ'}</p>
          <motion.p initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} style={{ position: 'relative', fontFamily: 'var(--font-heading)', fontSize: 64, fontWeight: 600, margin: '8px 0 0', color: '#FFF1C2' }}>{end.score}</motion.p>
          <p style={{ position: 'relative', margin: '0 0 20px', color: '#CFC6E6' }}>nur · {Math.round(end.score / 10)} XP</p>
          <button type="button" onClick={restart} style={{ position: 'relative', minHeight: 54, padding: '0 32px', borderRadius: 27, background: '#E2B85A', color: '#2A1E05', fontWeight: 800, fontSize: 16 }}>Yeniden sahneye çık</button>
        </motion.div>
      </div>
    );
  }

  const J = [
    { k: 'yari', label: 'Yarı yarıya', Icon: Scissors },
    { k: 'sure', label: '+15 sn', Icon: Timer },
    { k: 'pas', label: 'Pas', Icon: SkipForward },
  ];

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 18px 40px' }}>
      <div style={stage}>
        <Spotlights dim={qState === 'locked'} />
        {/* BASAMAKLAR */}
        <div style={{ position: 'relative', display: 'flex', gap: 3, marginBottom: 14 }} aria-label={`${step + 1}. basamak`}>
          {LADDER.map((v, i) => (
            <motion.div key={v} animate={{ height: i === step ? 30 : 18, background: i < step ? '#E2B85A' : i === step ? '#FFF1C2' : SAFE.includes(i) ? 'rgba(226,184,90,0.35)' : 'rgba(255,255,255,0.12)' }}
              style={{ flex: 1, borderRadius: 5, alignSelf: 'flex-end', boxShadow: i === step ? '0 0 14px rgba(255,241,194,0.7)' : 'none' }} />
          ))}
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, letterSpacing: 2, color: '#CFC6E6', fontWeight: 700 }}>{step + 1}. BASAMAK{SAFE.includes(step) ? ' · BARAJ' : ''}</span>
          <AnimatePresence mode="wait">
            <motion.span key={step} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 600, color: '#FFF1C2' }}>{LADDER[step]}</motion.span>
          </AnimatePresence>
        </div>
        {/* SÜRE */}
        <div style={{ position: 'relative', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.12)', margin: '10px 0 4px', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${Math.min(100, (time / LIMIT) * 100)}%`, background: time <= 7 ? '#E07A5F' : '#E2B85A' }} transition={{ duration: 0.9, ease: 'linear' }} style={{ height: '100%' }} />
        </div>
        <p style={{ position: 'relative', textAlign: 'end', fontSize: 12, margin: 0, color: time <= 7 ? '#E07A5F' : '#CFC6E6', fontVariantNumeric: 'tabular-nums' }}>{time} sn</p>
      </div>

      {/* JOKERLER + ÇEKİL */}
      <div style={{ display: 'flex', gap: 8, margin: '14px 0' }}>
        {J.map(({ k, label, Icon }) => (
          <motion.button key={k} type="button" whileTap={{ scale: 0.94 }} onClick={() => applyJoker(k)} disabled={!jokers[k] || qState !== 'ask'} aria-label={label}
            style={{ flex: 1, minHeight: 48, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 11, fontWeight: 700,
              background: jokers[k] ? (theme.cardBg || '#fff') : 'transparent', color: jokers[k] ? (theme.textPrimary || '#17261F') : (theme.textMuted || '#999'),
              border: `1px solid ${theme.cardBorder || 'rgba(0,0,0,0.08)'}`, textDecoration: jokers[k] ? 'none' : 'line-through', opacity: jokers[k] ? 1 : 0.5 }}>
            <Icon size={16} aria-hidden /> {label}
          </motion.button>
        ))}
        <motion.button type="button" whileTap={{ scale: 0.94 }} onClick={() => finish(current, false, true)} disabled={qState !== 'ask' || step === 0}
          style={{ flex: 1, minHeight: 48, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 11, fontWeight: 700,
            background: 'transparent', color: '#C4553E', border: '1px solid #C4553E55', opacity: step === 0 ? 0.4 : 1 }}>
          <LogOut size={16} aria-hidden /> Çekil ({current})
        </motion.button>
      </div>

      <QuestionCard q={q} color="#6E5BB0" state={qState} picked={picked} hidden={hidden} onPick={lock} theme={theme} />

      {qState === 'locked' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: 18, marginTop: 14, color: theme.textSecondary }}>Son kararın…</motion.p>
      )}
      {qState === 'reveal' && picked === q.correct && step < LADDER.length - 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button type="button" onClick={next} style={{ minHeight: 52, padding: '0 28px', borderRadius: 26, background: '#1E5A44', color: '#fff', fontWeight: 800, fontSize: 15 }}>Sonraki basamak · {LADDER[step + 1]}</button>
        </motion.div>
      )}
    </div>
  );
}
