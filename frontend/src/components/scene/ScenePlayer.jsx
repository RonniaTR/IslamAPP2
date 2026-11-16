import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTx } from '../../i18n';
import sound from '../../services/sound';
import SCENES from './scenes';

// 🎬 SAHNE MOTORU — kısa, tam ekran geçiş sahneleri tek biçimde tanımlanır (scenes.js).
// Yeni sahne = scenes.js'e bir kayıt. Her sahne: zemin, ışık rengi, simge ve zamanlı adımlar
// (metin + isteğe bağlı ses). Her an "Geç" denebilir; hareket azaltma açıksa adımlar anında gelir.
// Tasvir yoktur: yalnız ışık, kandil, yıldız (rub'ul hizb) ve hilal.
//   <ScenePlayer id="kandil" onDone={…} vars={{ ad: 'Regaib' }} />
const ICONS = {
  kandil: (c) => (
    <svg className="flame" width="72" height="96" viewBox="0 0 56 72" aria-hidden>
      <path d="M28 8c8 12 14 20 14 30a14 14 0 0 1-28 0c0-10 6-18 14-30z" fill={c} />
      <path d="M28 26c4 6 6 10 6 14a6 6 0 0 1-12 0c0-4 2-8 6-14z" fill="#FFF3CF" />
    </svg>
  ),
  yildiz: (c) => (
    <motion.svg width="110" height="110" viewBox="0 0 100 100" aria-hidden animate={{ rotate: 45 }} transition={{ duration: 6, ease: 'easeInOut' }}>
      <rect x="22" y="22" width="56" height="56" fill="none" stroke={c} strokeWidth="2" />
      <rect x="22" y="22" width="56" height="56" fill="none" stroke={c} strokeWidth="2" transform="rotate(45 50 50)" />
      <circle cx="50" cy="50" r="10" fill={c} />
    </motion.svg>
  ),
  hilal: (c) => (
    <svg width="96" height="96" viewBox="0 0 100 100" aria-hidden>
      <path d="M62 12a40 40 0 1 0 0 76 32 32 0 1 1 0-76z" fill={c} />
    </svg>
  ),
};

export default function ScenePlayer({ id, onDone, vars = {} }) {
  const tt = useTx();
  const scene = SCENES[id];
  const [step, setStep] = useState(0);
  const timers = useRef([]);
  const done = useRef(false);
  const finish = () => { if (done.current) return; done.current = true; timers.current.forEach(clearTimeout); sound.stop(); if (onDone) onDone(); };

  useEffect(() => {
    if (!scene) { if (onDone) onDone(); return undefined; }
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let at = 0;
    scene.steps.forEach((s, i) => {
      timers.current.push(setTimeout(() => { setStep(i); if (s.sound) sound.play(...s.sound); }, at));
      at += reduce ? Math.min(s.ms, 1400) : s.ms;
    });
    timers.current.push(setTimeout(finish, at));
    return () => timers.current.forEach(clearTimeout);
  }, [id]);

  if (!scene) return null;
  const s = scene.steps[step];
  const fill = (t) => tt(t).replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
  return (
    <motion.div className="fixed inset-0 z-[135] flex flex-col items-center justify-center px-8 text-center" role="dialog" aria-live="polite"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: `radial-gradient(ellipse at 50% 40%, ${scene.floor} 0%, #050403 78%)`, color: '#F3E9D2' }} data-testid={`scene-${id}`}>
      <button onClick={finish} className="absolute top-5 left-5 text-[11px] font-bold px-3 py-2 rounded-xl" style={{ color: '#A89262', background: 'rgba(255,255,255,0.06)' }}>{tt('Geç')}</button>
      <span className="halo" aria-hidden style={{ position: 'absolute', width: 320, height: 320, borderRadius: 160, background: `radial-gradient(circle, ${scene.light}55 0%, transparent 70%)` }} />
      <div style={{ position: 'relative' }}>{(ICONS[scene.icon] || ICONS.kandil)(scene.light)}</div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} style={{ position: 'relative', marginTop: 28, maxWidth: 340 }}>
          {s.small && <p style={{ fontSize: 11, letterSpacing: 3, color: scene.light, fontWeight: 700 }}>{fill(s.small)}</p>}
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, lineHeight: 1.25, marginTop: 6 }}>{fill(s.text)}</h1>
          {s.sub && <p style={{ fontSize: 13, color: '#D9C9A3', marginTop: 10, lineHeight: 1.6 }}>{fill(s.sub)}</p>}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
