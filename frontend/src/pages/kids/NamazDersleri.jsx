import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import PrayerFigure from '../../components/kids/PrayerFigure';
import { ABDEST, ABDEST_FARZ, ABDEST_BOZAN, KILINIS, SINAV } from '../../data/kidsNamaz';
import sfx from '../../services/sfx';
import Confetti from '../games/Confetti';

const ink = '#24364A';
export const bigBtn = (bg, shadow) => ({ minHeight: 58, padding: '0 28px', borderRadius: 29, background: bg, color: '#fff', fontSize: 19, fontWeight: 900, boxShadow: `0 7px 0 ${shadow}`, border: 'none', cursor: 'pointer' });

/** Su damlaları: dokunuşta sıçrar. */
function Splash({ n }) {
  return (
    <AnimatePresence>
      {Array.from({ length: 7 }, (_, i) => (
        <motion.span key={`${n}-${i}`} initial={{ opacity: 1, x: 0, y: 0, scale: 1 }} animate={{ opacity: 0, x: Math.cos(i) * 70, y: Math.sin(i) * 50 - 30, scale: 0.4 }} transition={{ duration: 0.8 }}
          style={{ position: 'absolute', left: '50%', top: '45%', width: 14, height: 18, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: '#4AB3E8' }} aria-hidden />
      ))}
    </AnimatePresence>
  );
}

// 💧 ABDEST — her adımda çocuk "yıka" düğmesine adım sayısı kadar dokunur; su sıçrar, sayaç dolar.
export function AbdestDersi({ onDone }) {
  const [i, setI] = useState(0);
  const [count, setCount] = useState(0);
  const [splash, setSplash] = useState(0);
  const end = i >= ABDEST.length;
  const s = ABDEST[i];
  const need = s ? s.kez : 0;
  const ready = !s || count >= Math.max(1, need);
  const tap = () => { if (ready) return; setCount((c) => c + 1); setSplash((n) => n + 1); sfx.tick(); try { navigator.vibrate && navigator.vibrate(10); } catch { /* yok */ } };
  const next = () => { sfx.correct(); setI(i + 1); setCount(0); };

  if (end) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Confetti count={30} />
        <h2 style={{ fontSize: 26, fontWeight: 900, textAlign: 'center', margin: 0, color: '#2D8A4E' }}>Abdestin tamam! 💧</h2>
        <div style={{ background: '#E1F3FB', borderRadius: 24, padding: 16 }}>
          <p style={{ fontWeight: 900, margin: '0 0 8px', color: '#1F5F8B' }}>Abdestin farzları (olmazsa olmazları) 4 tanedir:</p>
          {ABDEST_FARZ.map((f, k) => <p key={f} style={{ margin: '4px 0', fontWeight: 700 }}>{k + 1}. {f}</p>)}
        </div>
        <div style={{ background: '#FFF1E6', borderRadius: 24, padding: 16 }}>
          <p style={{ fontWeight: 900, margin: '0 0 8px', color: '#B4561B' }}>Abdestimizi bozan bazı durumlar:</p>
          {ABDEST_BOZAN.map((f) => <p key={f} style={{ margin: '4px 0', fontWeight: 700 }}>• {f}</p>)}
          <p style={{ margin: '8px 0 0', fontSize: 14, color: '#8A6A50' }}>Abdestimiz bozulunca yeniden alırız, hiç sorun değil.</p>
        </div>
        <button type="button" onClick={onDone} style={{ ...bigBtn('#2D8A4E', '#1B6B3A'), alignSelf: 'center' }}>Öğrendim ⭐</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: 5 }} aria-label={`${i + 1}. adım / ${ABDEST.length}`}>
        {ABDEST.map((_, k) => <span key={k} style={{ width: k === i ? 22 : 10, height: 10, borderRadius: 5, background: k < i ? '#2D8A4E' : k === i ? '#4AB3E8' : '#D6E4EC', transition: 'all .3s' }} />)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} style={{ width: '100%' }}>
          <p style={{ fontSize: 14, fontWeight: 900, color: '#4AB3E8', margin: 0 }}>{i + 1}. ADIM</p>
          <h2 style={{ fontSize: 27, fontWeight: 900, margin: '2px 0 12px', color: ink }}>{s.title}</h2>
          <motion.button type="button" onClick={tap} whileTap={{ scale: 0.9 }} aria-label="Yıka"
            style={{ position: 'relative', width: 170, height: 170, borderRadius: 85, background: 'radial-gradient(circle at 40% 35%, #FFFFFF, #CDEBFF)', border: '5px solid #FFFFFF', boxShadow: '0 16px 30px -12px rgba(74,179,232,0.8)', fontSize: 74, cursor: ready ? 'default' : 'pointer', margin: '0 auto', display: 'block' }}>
            <motion.span animate={ready ? { scale: [1, 1.1, 1] } : { rotate: [-4, 4, -4] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ display: 'inline-block' }}>{s.icon}</motion.span>
            <Splash n={splash} />
          </motion.button>
          <p style={{ fontSize: 19, lineHeight: 1.5, fontWeight: 700, margin: '16px 4px 10px' }}>{s.text}</p>
          {need > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
              {Array.from({ length: need }, (_, k) => (
                <motion.span key={k} animate={{ scale: k < count ? [1, 1.4, 1] : 1, background: k < count ? '#4AB3E8' : '#E3EEF4' }} style={{ width: 30, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>{k < count ? '✓' : ''}</motion.span>
              ))}
            </div>
          )}
          <p style={{ fontSize: 14, color: '#7F8C8D', margin: 0, minHeight: 20 }}>{ready ? '' : need > 1 ? `Yıkamak için ${need} kez dokun` : 'Dokun'}</p>
        </motion.div>
      </AnimatePresence>
      <button type="button" onClick={next} disabled={!ready} style={{ ...bigBtn(ready ? '#2D8A4E' : '#B9C7BE', ready ? '#1B6B3A' : '#9AAAA0'), opacity: ready ? 1 : 0.7 }}>Sonraki</button>
    </div>
  );
}

// 🧎 KILINIŞ — figür adım adım; "Oynat" ile kendiliğinden ilerler.
export function KilinisDersi({ onDone }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const s = KILINIS[i];
  const last = i === KILINIS.length - 1;
  useEffect(() => {
    if (!auto) return undefined;
    if (last) { setAuto(false); return undefined; }
    const t = setTimeout(() => setI((x) => x + 1), 4500);
    return () => clearTimeout(t);
  }, [auto, i, last]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ borderRadius: 28, overflow: 'hidden', border: '4px solid #FFFFFF', boxShadow: '0 12px 26px -14px rgba(36,54,74,0.5)' }}>
        <PrayerFigure pose={s.pose} height={230} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {KILINIS.map((_, k) => <button key={k} type="button" onClick={() => setI(k)} aria-label={`${k + 1}. adım`} style={{ flex: 1, height: 8, borderRadius: 4, border: 'none', background: k <= i ? '#2D8A4E' : '#D6E4D9', padding: 0 }} />)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: '#FFFFFF', borderRadius: 24, padding: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: '#2D8A4E', margin: 0 }}>{i + 1} / {KILINIS.length}</p>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: '2px 0 8px', color: ink }}>{s.title}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.5, fontWeight: 700, margin: 0 }}>{s.text}</p>
          {s.say && <p style={{ marginTop: 10, background: '#FFF6DA', borderRadius: 16, padding: '10px 12px', fontSize: 16, fontWeight: 800, color: '#7A5A10' }}>🗣️ {s.say}</p>}
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <button type="button" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} aria-label="Önceki" style={{ width: 58, height: 58, borderRadius: 29, background: '#FFFFFF', border: '2px solid #D6E4D9', opacity: i === 0 ? 0.4 : 1 }}><ChevronLeft size={28} color={ink} /></button>
        <button type="button" onClick={() => setAuto(!auto)} style={{ ...bigBtn('#4A90D9', '#2F6DB0'), display: 'flex', alignItems: 'center', gap: 8, padding: '0 22px' }}>{auto ? <Pause size={20} /> : <Play size={20} />} {auto ? 'Durdur' : 'Oynat'}</button>
        {last
          ? <button type="button" onClick={onDone} style={{ ...bigBtn('#2D8A4E', '#1B6B3A'), padding: '0 20px' }}>Bitti ⭐</button>
          : <button type="button" onClick={() => { setAuto(false); setI(i + 1); }} aria-label="Sonraki" style={{ width: 58, height: 58, borderRadius: 29, background: '#2D8A4E', border: 'none' }}><ChevronRight size={28} color="#fff" /></button>}
      </div>
      <p style={{ fontSize: 13, color: '#7F8C8D', textAlign: 'center', margin: 0 }}>Bu, iki rekâtlık bir namazın kılınışıdır. Dört rekâtlı namazlarda ikinci rekâttan sonra kısa bir oturuş yapılır ve namaza devam edilir.</p>
    </div>
  );
}

// 🏆 SINAV — 7 soru, şıklar karışık, yanlışta doğrusu gösterilir; ceza yok.
export function NamazSinavi({ onDone }) {
  const qs = useMemo(() => SINAV.map((q) => {
    const order = q.o.map((_, k) => k).sort(() => Math.random() - 0.5);
    return { q: q.q, o: order.map((k) => q.o[k]), a: order.indexOf(q.a) };
  }), []);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  if (i >= qs.length) {
    return (
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Confetti count={50} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ type: 'spring', bounce: 0.6 }} style={{ fontSize: 96 }}>🏅</motion.div>
        <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: '#FF9F43' }}>Namaz Kahramanı!</h2>
        <p style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>{qs.length} sorudan {score} tanesini bildin.</p>
        <button type="button" onClick={() => onDone(score)} style={bigBtn('#2D8A4E', '#1B6B3A')}>Rozetimi al</button>
      </div>
    );
  }
  const q = qs[i];
  const choose = (k) => {
    if (pick !== null) return;
    setPick(k);
    if (k === q.a) { setScore((s) => s + 1); sfx.correct(); } else sfx.wrong();
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ textAlign: 'center', fontWeight: 900, color: '#FF9F43', margin: 0 }}>{i + 1} / {qs.length}</p>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, textAlign: 'center', margin: '0 0 6px' }}>{q.q}</h2>
          {q.o.map((o, k) => {
            const right = pick !== null && k === q.a; const wrong = pick === k && k !== q.a;
            return (
              <motion.button key={o} type="button" onClick={() => choose(k)} animate={wrong ? { x: [0, -8, 8, -4, 0] } : right ? { scale: [1, 1.05, 1] } : {}}
                style={{ minHeight: 62, borderRadius: 22, fontSize: 18, fontWeight: 800, padding: '0 16px', textAlign: 'start', border: '3px solid', borderColor: right ? '#2D8A4E' : wrong ? '#EF5350' : '#E3E8EE', background: right ? '#E3F5E6' : wrong ? '#FDECEC' : '#FFFFFF', color: ink }}>
                {right ? '✅ ' : wrong ? '🔸 ' : ''}{o}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
      {pick !== null && (
        <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setI(i + 1); setPick(null); }} style={{ ...bigBtn('#4A90D9', '#2F6DB0'), alignSelf: 'center' }}>
          {pick === q.a ? 'Aferin! Devam' : 'Doğrusunu öğrendik, devam'}
        </motion.button>
      )}
    </div>
  );
}
