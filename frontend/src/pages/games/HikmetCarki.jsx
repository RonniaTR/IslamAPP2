import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, RotateCw } from 'lucide-react';
import sfx from '../../services/sfx';
import { AREAS, createPool } from './questionPool';
import QuestionCard, { Nisan } from './QuestionCard';
import Confetti from './Confetti';

// 🎡 HİKMET ÇARKI — çevir, gelen alandan soru cevapla, altı alanın nişanını topla.
//   · Çarkta 6 alan + 1 "Taç" dilimi. Üst üste 3 doğru (çocukta 2) taç hakkı verir.
//   · Taç hakkıyla nişanı olmayan bir alanı seçersin; o alanın zor sorusunu bilirsen nişan senin.
//   · 3 kandilin var; yanlış cevap bir kandili söndürür. Çocuk sürümünde kandil sönmez, süre yoktur.
//   · Altı nişanı toplayan kazanır.
const SLICES = [...AREAS, { id: 'tac', name: 'Taç', short: 'Taç', color: '#E2B85A' }];
const N = SLICES.length;
const SEG = 360 / N;
const R = 140;

function wedge(i) {
  const a0 = ((i * SEG) - 90) * Math.PI / 180;
  const a1 = (((i + 1) * SEG) - 90) * Math.PI / 180;
  return `M 0 0 L ${R * Math.cos(a0)} ${R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`;
}

function Wheel({ rotation, spinning }) {
  return (
    <div style={{ position: 'relative', width: 300, height: 300, margin: '0 auto' }}>
      <svg viewBox="0 0 30 22" width="34" height="26" style={{ position: 'absolute', top: -6, left: '50%', marginLeft: -17, zIndex: 3, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))' }} aria-hidden>
        <path d="M15 22 L2 2 Q15 -2 28 2 Z" fill="#FFF6D8" stroke="#B0893C" strokeWidth="1.5" />
      </svg>
      <motion.svg viewBox="-150 -150 300 300" width="300" height="300" animate={{ rotate: rotation }}
        transition={{ duration: spinning ? 4.2 : 0, ease: [0.12, 0.72, 0.16, 1] }} style={{ filter: 'drop-shadow(0 18px 30px rgba(10,14,30,0.45))' }} aria-hidden>
        <circle r="148" fill="#1B2230" />
        {SLICES.map((s, i) => {
          const mid = (i + 0.5) * SEG;
          return (
            <g key={s.id}>
              <path d={wedge(i)} fill={s.color} stroke="#1B2230" strokeWidth="2.5" />
              <g transform={`rotate(${mid}) translate(0 -${R * 0.64}) rotate(${mid > 90 && mid < 270 ? 180 : 0})`}>
                {s.id === 'tac'
                  ? <path d="M-11 6 L-13 -7 L-5 -1 L0 -10 L5 -1 L13 -7 L11 6 Z" fill="#3A2A08" />
                  : <text textAnchor="middle" dominantBaseline="middle" fontSize="12.5" fontWeight="800" fill="#FFFFFF" style={{ fontFamily: 'var(--font-body)' }}>{s.short}</text>}
              </g>
            </g>
          );
        })}
        {Array.from({ length: N * 2 }, (_, i) => {
          const a = (i * 180 / N - 90) * Math.PI / 180;
          return <circle key={i} cx={145 * Math.cos(a)} cy={145 * Math.sin(a)} r="2.6" fill="#FFF1C2" />;
        })}
        <circle r="30" fill="#FBF8F0" stroke="#B0893C" strokeWidth="3" />
        <g transform="scale(0.7)"><rect x="-12" y="-12" width="24" height="24" fill="none" stroke="#B0893C" strokeWidth="2.5" /><rect x="-12" y="-12" width="24" height="24" fill="none" stroke="#B0893C" strokeWidth="2.5" transform="rotate(45)" /></g>
      </motion.svg>
    </div>
  );
}

const PRAISE = ['Maşallah!', 'Aferin!', 'Harika!', 'Çok güzel!'];

export default function HikmetCarki({ theme, onXP = () => {}, onEvent = () => {}, kids = false }) {
  const pool = useMemo(() => createPool({ kids }), [kids]);
  const need = kids ? 2 : 3;
  const [phase, setPhase] = useState('spin');   // spin | spinning | question | crown | over | won
  const [rotation, setRotation] = useState(0);
  const [area, setArea] = useState(null);
  const [q, setQ] = useState(null);
  const [qState, setQState] = useState('ask');
  const [picked, setPicked] = useState(null);
  const [meter, setMeter] = useState(0);
  const [lives, setLives] = useState(3);
  const [owned, setOwned] = useState([]);
  const [crownQ, setCrownQ] = useState(false);
  const [time, setTime] = useState(20);
  const [burst, setBurst] = useState(0);
  const [msg, setMsg] = useState('');
  const timer = useRef(null);
  const ticks = useRef([]);

  useEffect(() => () => { clearInterval(timer.current); ticks.current.forEach(clearTimeout); }, []);
  // Süre bitti: cevapsız sayılır (yan etki güncelleyicinin dışında, bir kez)
  useEffect(() => {
    if (!kids && time === 0 && phase === 'question' && qState === 'ask') answer(-1);
  }, [time]);

  const spin = () => {
    if (phase !== 'spin') return;
    const i = Math.floor(Math.random() * N);
    const target = (360 - ((i + 0.5) * SEG)) % 360;
    const next = rotation + 360 * 5 + ((target - (rotation % 360)) + 360) % 360;
    setRotation(next);
    setPhase('spinning');
    // yavaşlayan tıkırtı
    ticks.current = Array.from({ length: 22 }, (_, k) => setTimeout(() => sfx.tick(), 4200 * (1 - Math.pow(1 - (k + 1) / 23, 0.45))));
    setTimeout(() => {
      try { if (navigator.vibrate) navigator.vibrate(18); } catch { /* yok */ }
      const s = SLICES[i];
      if (s.id === 'tac') { sfx.combo(3); setPhase('crown'); return; }
      ask(s.id, false);
    }, 4350);
  };

  const ask = (areaId, isCrown) => {
    const question = pool.fromArea(areaId, isCrown && !kids ? 'hard' : undefined) || pool.fromArea(areaId);
    setArea(AREAS.find((a) => a.id === areaId));
    setQ(question); setPicked(null); setQState('ask'); setCrownQ(isCrown); setMsg('');
    setPhase('question');
    if (!kids) {
      setTime(isCrown ? 25 : 20);
      clearInterval(timer.current);
      timer.current = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    }
  };

  const answer = (i, question = q, isCrown = crownQ, areaId = area && area.id) => {
    clearInterval(timer.current);
    setPicked(i); setQState('locked');
    setTimeout(() => {
      const ok = i === question.correct;
      setQState('reveal');
      onEvent('answer', { correct: ok, category: question.category });
      if (ok) {
        sfx.correct();
        if (isCrown) {
          const got = [...owned, areaId];
          setOwned(got); setBurst((b) => b + 1); sfx.crown();
          onXP(kids ? 10 : 30, 'game_quiz', `Hikmet Çarkı: ${AREAS.find((a) => a.id === areaId).name} nişanı`);
          setMsg(kids ? 'Nişanı kazandın!' : 'Nişan senin!');
          if (got.length === AREAS.length) {
            setTimeout(() => { setPhase('won'); onEvent('win'); onXP(kids ? 30 : 100, 'game_quiz', 'Hikmet Çarkı: altı nişan'); sfx.victory(); }, 1500);
            return;
          }
        } else {
          onXP(kids ? 5 : 10, 'game_quiz', 'Hikmet Çarkı');
          setMeter((m) => Math.min(need, m + 1));
          setMsg(kids ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : 'Doğru!');
        }
      } else {
        sfx.wrong();
        if (!kids) setLives((l) => l - 1);
        setMsg(kids ? 'Doğrusu yeşil olan. Bir sonrakine!' : i < 0 ? 'Süre doldu' : 'Kandilin söndü');
      }
    }, kids ? 500 : 900);
  };

  const next = () => {
    if (!kids && lives <= 0) { setPhase('over'); return; }
    if (meter >= need && !crownQ) { setMeter(0); setPhase('crown'); return; }
    setPhase('spin');
  };

  const restart = () => { setPhase('spin'); setOwned([]); setLives(3); setMeter(0); setQ(null); setMsg(''); };

  const ink = theme.textPrimary || theme.text || '#17261F';
  const sub = theme.textSecondary || '#5A6B62';
  const left = AREAS.filter((a) => !owned.includes(a.id));

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 18px 40px', color: ink, position: 'relative' }}>
      <AnimatePresence>{burst > 0 && <motion.div key={burst} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1.6, duration: 0.6 }} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 70 }}><Confetti count={36} /></motion.div>}</AnimatePresence>

      {/* NİŞANLAR · KANDİLLER · TAÇ ÇUBUĞU */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '6px 2px 14px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {AREAS.map((a) => <Nisan key={a.id} color={a.color} on={owned.includes(a.id)} size={30} label={a.name} />)}
        </div>
        {!kids && (
          <div style={{ display: 'flex', gap: 4 }} aria-label={`${lives} kandil`}>
            {[0, 1, 2].map((k) => (
              <motion.svg key={k} width="16" height="22" viewBox="0 0 56 72" animate={{ opacity: k < lives ? 1 : 0.2, scale: k < lives ? 1 : 0.8 }} aria-hidden>
                <path d="M28 8c8 12 14 20 14 30a14 14 0 0 1-28 0c0-10 6-18 14-30z" fill={k < lives ? '#F0B429' : '#888'} />
              </motion.svg>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Crown size={16} color="#E2B85A" aria-hidden />
        <div style={{ flex: 1, display: 'flex', gap: 5 }}>
          {Array.from({ length: need }, (_, k) => (
            <motion.span key={k} animate={{ background: k < meter ? '#E2B85A' : 'rgba(128,128,128,0.22)' }} style={{ flex: 1, height: 8, borderRadius: 4 }} />
          ))}
        </div>
        <span style={{ fontSize: 12, color: sub }}>{meter}/{need}</span>
      </div>

      {(phase === 'spin' || phase === 'spinning') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, paddingTop: 6 }}>
          <Wheel rotation={rotation} spinning={phase === 'spinning'} />
          <motion.button type="button" onClick={spin} disabled={phase === 'spinning'} whileTap={{ scale: 0.95 }}
            animate={phase === 'spin' ? { scale: [1, 1.04, 1] } : { scale: 1 }} transition={phase === 'spin' ? { repeat: Infinity, duration: 1.8 } : {}}
            style={{ minHeight: 58, padding: '0 34px', borderRadius: 29, background: '#1E5A44', color: '#FFFFFF', fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, opacity: phase === 'spinning' ? 0.5 : 1, boxShadow: '0 12px 24px -10px rgba(30,90,68,0.8)' }}>
            <RotateCw size={20} /> {phase === 'spinning' ? 'Dönüyor…' : 'Çevir'}
          </motion.button>
        </div>
      )}

      {phase === 'crown' && (
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
          <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ display: 'inline-flex', width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', background: '#E2B85A33' }}>
            <Crown size={40} color="#E2B85A" />
          </motion.div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 600, margin: '12px 0 4px' }}>Taç hakkı!</h2>
          <p style={{ color: sub, fontSize: 14, margin: '0 0 18px' }}>Hangi alanın nişanını istiyorsun?</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {left.map((a) => (
              <motion.button key={a.id} type="button" whileTap={{ scale: 0.96 }} onClick={() => ask(a.id, true)}
                style={{ minHeight: 64, borderRadius: 20, background: a.color, color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Nisan color="#FFF6D8" on={false} size={22} /> {a.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'question' && q && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ padding: '6px 12px', borderRadius: 14, background: area.color, color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: 0.5 }}>{crownQ ? `👑 ${area.name}` : area.name}</span>
            {!kids && (
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(128,128,128,0.2)', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${(time / (crownQ ? 25 : 20)) * 100}%`, background: time <= 5 ? '#C4553E' : area.color }} transition={{ duration: 0.9, ease: 'linear' }} style={{ height: '100%' }} />
              </div>
            )}
            {!kids && <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: time <= 5 ? '#C4553E' : sub }}>{time}</span>}
          </div>
          <QuestionCard q={q} color={area.color} state={qState} picked={picked} onPick={(i) => answer(i)} kids={kids} theme={theme} />
          {qState === 'reveal' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600 }}>{msg}</span>
              <button type="button" onClick={next} style={{ minHeight: 50, padding: '0 26px', borderRadius: 25, background: '#1E5A44', color: '#fff', fontWeight: 800, fontSize: 15 }}>Devam</button>
            </motion.div>
          )}
        </div>
      )}

      {(phase === 'over' || phase === 'won') && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
          {phase === 'won' && <Confetti count={50} />}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
            {AREAS.map((a) => <Nisan key={a.id} color={a.color} on={owned.includes(a.id)} size={40} label={a.name} />)}
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 600, margin: 0 }}>{phase === 'won' ? 'Altı nişan da senin!' : `${owned.length} nişan topladın`}</h2>
          <p style={{ color: sub, margin: '8px 0 22px' }}>{phase === 'won' ? 'İlim yolunda bir çarkı daha tamamladın.' : 'Kandiller söndü; ilim beklemez, yeniden dene.'}</p>
          <button type="button" onClick={restart} style={{ minHeight: 54, padding: '0 32px', borderRadius: 27, background: '#1E5A44', color: '#fff', fontWeight: 800, fontSize: 16 }}>Yeni çark</button>
        </motion.div>
      )}
    </div>
  );
}
