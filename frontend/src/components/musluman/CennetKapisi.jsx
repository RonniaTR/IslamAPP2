import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { bahceBaslat, bahceSeviye, bahceAcikMi, bahceTercih, bahceDurdur, nurTinisi } from '../../services/bahceSesi';
import { playGate, stopGate } from '../../services/donusAudio';
import { FONT } from '../../pages/musluman/tema';

// 🌿 BAHÇE KAPISI — "Müslüman Olmak" sekmesinin açılışı.
// Şafak vakti; uzakta dağlar, yanlarda selviler, yerde lâleler. Sis katmanları ağır ağır süzülür, çiçek yaprakları düşer,
// nur zerreleri yükselir. Kişi duayı okur ve "Âmin" der: kafesli altın kapı üç boyutlu açılır, sis aralanır,
// kamera ışığın içinden geçer. Ses: dere, rüzgâr, kuşlar ve alçak bir dem; kapı açılırken ney ve çan.
// Oturum başına bir kez tam oynar; dokunarak geçilebilir. "Hareketi azalt" tercihinde kısa bir geçişle açılır.

const azHareket = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Basit, tekrarlanabilir rastgelelik (her açılışta aynı düzen)
const rnd = (i, t = 1) => { const x = Math.sin(i * 127.1 + t * 311.7) * 43758.5453; return x - Math.floor(x); };

const ALTIN = '#D8B76A';

/** Derinlik: imleç (masaüstü) ya da telefonun eğimi katmanları farklı hızlarda kaydırır. */
function useParalaks(kapali) {
  const hx = useMotionValue(0);
  const hy = useMotionValue(0);
  const x = useSpring(hx, { stiffness: 40, damping: 14 });
  const y = useSpring(hy, { stiffness: 40, damping: 14 });
  useEffect(() => {
    if (kapali) return undefined;
    const fare = (e) => { hx.set((e.clientX / window.innerWidth) * 2 - 1); hy.set((e.clientY / window.innerHeight) * 2 - 1); };
    const egim = (e) => {
      if (e.gamma == null) return;
      hx.set(Math.max(-1, Math.min(1, e.gamma / 25)));
      hy.set(Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 25)));
    };
    window.addEventListener('pointermove', fare);
    window.addEventListener('deviceorientation', egim);
    return () => { window.removeEventListener('pointermove', fare); window.removeEventListener('deviceorientation', egim); };
  }, [kapali, hx, hy]);
  return { x, y };
}

function Katman({ p, derinlik, children, style }) {
  const x = useTransform(p.x, (v) => v * -derinlik);
  const y = useTransform(p.y, (v) => v * -derinlik * 0.45);
  return <motion.div style={{ position: 'absolute', inset: 0, x, y, ...style }}>{children}</motion.div>;
}

function Gok() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1F2B4A 0%, #47507A 22%, #9A88A8 42%, #E9B99A 60%, #F7DDB6 72%, #F3E6CC 100%)' }}>
      {Array.from({ length: 26 }, (_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2.5 + rnd(i) * 3, repeat: Infinity, delay: rnd(i, 2) * 3 }}
          style={{ position: 'absolute', left: `${rnd(i, 3) * 100}%`, top: `${rnd(i, 4) * 26}%`, width: 2, height: 2, borderRadius: 2, background: '#fff' }}
        />
      ))}
    </div>
  );
}

function Isinlar({ acik }) {
  return (
    <motion.div
      aria-hidden
      animate={{ rotate: [0, 8, 0], opacity: acik ? 1 : 0.55 }}
      transition={{ rotate: { duration: 24, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 1.6 } }}
      style={{
        position: 'absolute', left: '50%', top: '52%', width: '220vmax', height: '220vmax', marginLeft: '-110vmax', marginTop: '-110vmax',
        background: 'repeating-conic-gradient(from 0deg, rgba(255,240,200,0.20) 0deg 4deg, rgba(255,240,200,0) 4deg 14deg)',
        WebkitMaskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,.6) 18%, transparent 46%)',
        maskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,.6) 18%, transparent 46%)',
      }}
    />
  );
}

function Manzara() {
  // Selvi: ince uzun bir yaprak biçimi
  const selvi = (x, y, h, renk) => <path key={`${x}-${y}`} d={`M${x} ${y} C${x - h * 0.14} ${y - h * 0.45}, ${x - h * 0.07} ${y - h * 0.85}, ${x} ${y - h} C${x + h * 0.07} ${y - h * 0.85}, ${x + h * 0.14} ${y - h * 0.45}, ${x} ${y} Z`} fill={renk} />;
  const lale = (x, y, s, renk, i) => (
    <g key={`l${i}`} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C-2 -18 2 -30 0 -44" stroke="#3F6B45" strokeWidth="2.4" fill="none" />
      <path d="M0 -14 C-10 -20 -16 -30 -14 -40 C-8 -30 -3 -24 0 -20" fill="#4E7F52" />
      <path d="M0 -44 C-9 -46 -11 -58 -8 -66 C-5 -60 -3 -58 0 -60 C3 -58 5 -60 8 -66 C11 -58 9 -46 0 -44 Z" fill={renk} />
    </g>
  );
  return (
    <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="ck-dag1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8E86A8" /><stop offset="1" stopColor="#C9B3B4" /></linearGradient>
        <linearGradient id="ck-dag2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7E9A8A" /><stop offset="1" stopColor="#A9BBA0" /></linearGradient>
        <linearGradient id="ck-cimen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6F9468" /><stop offset="1" stopColor="#3E6447" /></linearGradient>
        <linearGradient id="ck-yol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6E7C8" /><stop offset="1" stopColor="#D9C29A" /></linearGradient>
      </defs>
      <path d="M0 360 L90 300 L170 330 L260 270 L340 320 L430 280 L520 316 L600 262 L700 318 L790 276 L880 320 L1000 290 V600 H0 Z" fill="url(#ck-dag1)" opacity="0.85" />
      <path d="M0 410 C120 370 220 390 330 372 C430 356 520 380 610 366 C720 350 840 384 1000 360 V600 H0 Z" fill="url(#ck-dag2)" />
      {[60, 110, 160, 840, 890, 945].map((x, i) => selvi(x, 430 - (i % 3) * 6, 120 + (i % 3) * 22, '#2F5242'))}
      {[210, 250, 760, 800].map((x, i) => selvi(x, 440, 90 + i * 6, '#3A6250'))}
      <path d="M0 450 C200 430 380 440 500 438 C640 436 820 432 1000 452 V600 H0 Z" fill="url(#ck-cimen)" />
      <path d="M470 440 L530 440 L700 600 L300 600 Z" fill="url(#ck-yol)" opacity="0.95" />
      <path d="M498 440 L502 440 L520 600 L480 600 Z" fill="#fff" opacity="0.35" />
      {Array.from({ length: 16 }, (_, i) => {
        const sol = i < 8;
        const k = i % 8;
        const x = sol ? 40 + k * 32 + rnd(i) * 10 : 960 - k * 32 - rnd(i) * 10;
        const y = 560 + rnd(i, 2) * 40;
        const renk = ['#C9405A', '#E7B23C', '#F2F0EA', '#B23A6B'][i % 4];
        return lale(x, y, 0.9 + rnd(i, 5) * 0.6, renk, i);
      })}
    </svg>
  );
}

/** Kapının içinden görünen ışık bahçesi (kapı açılınca). */
function NurBahcesi() {
  return (
    <svg viewBox="28 30 204 320" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="ck-nur" cx="50%" cy="58%" r="70%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.35" stopColor="#FFF4D6" /><stop offset="1" stopColor="#F0C77A" /></radialGradient>
        <clipPath id="ck-acik"><path d="M28 350 V138 Q28 62 130 30 Q232 62 232 138 V350 Z" /></clipPath>
      </defs>
      <g clipPath="url(#ck-acik)">
        <rect x="28" y="30" width="204" height="320" fill="url(#ck-nur)" />
        {[50, 72, 190, 212].map((x, i) => <path key={x} d={`M${x} 300 C${x - 9} 260, ${x - 4} 220, ${x} 190 C${x + 4} 220, ${x + 9} 260, ${x} 300 Z`} fill="#E9D3A0" opacity={0.55 - i * 0.05} />)}
        <path d="M120 350 Q126 300 130 280 Q134 300 140 350 Z" fill="#FFFFFF" opacity="0.8" />
        <ellipse cx="130" cy="300" rx="80" ry="10" fill="#FFF" opacity="0.5" />
      </g>
    </svg>
  );
}

function Kanat({ taraf, acik, sure }) {
  const sol = taraf === 'sol';
  const yol = sol ? 'M28 350 V138 Q28 62 130 30 V350 Z' : 'M130 30 Q232 62 232 138 V350 H130 Z';
  const vb = sol ? '28 30 102 320' : '130 30 102 320';
  const id = `ck-kafes-${taraf}`;
  return (
    <motion.div
      initial={false}
      animate={{ rotateY: acik ? (sol ? -112 : 112) : 0 }}
      transition={{ duration: sure, ease: [0.45, 0.05, 0.2, 1] }}
      style={{ position: 'absolute', top: 0, bottom: 0, [sol ? 'left' : 'right']: 0, width: '50%', transformOrigin: sol ? 'left center' : 'right center', transformStyle: 'preserve-3d' }}
    >
      <svg viewBox={vb} preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(0 4px 10px rgba(60,40,10,.35))' }}>
        <defs>
          <linearGradient id={`${id}-z`} x1="0" y1="0" x2={sol ? 1 : 0} y2="1">
            <stop offset="0" stopColor="#FBF3DF" /><stop offset="1" stopColor="#E9D6AC" />
          </linearGradient>
          <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse" x={sol ? 28 : 130} y="30">
            <rect width="20" height="20" fill="none" />
            <polygon points="10,1 12.5,7.5 19,10 12.5,12.5 10,19 7.5,12.5 1,10 7.5,7.5" fill="none" stroke={ALTIN} strokeWidth="1" />
            <rect x="5.2" y="5.2" width="9.6" height="9.6" transform="rotate(45 10 10)" fill="none" stroke={ALTIN} strokeWidth="0.6" opacity="0.8" />
          </pattern>
        </defs>
        <path d={yol} fill={`url(#${id}-z)`} />
        <path d={yol} fill={`url(#${id})`} />
        <path d={yol} fill="none" stroke="#B8913F" strokeWidth="3" />
        <path d={sol ? 'M36 350 V142 Q36 74 122 42 V350' : 'M138 42 Q224 74 224 142 V350'} fill="none" stroke="#B8913F" strokeWidth="1.2" opacity="0.7" />
        <circle cx={sol ? 118 : 142} cy="220" r="6.5" fill="none" stroke="#9C7A2E" strokeWidth="2.4" />
        <circle cx={sol ? 118 : 142} cy="212" r="2.2" fill="#9C7A2E" />
      </svg>
    </motion.div>
  );
}

function Kapi({ acik, sure }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Kapı çerçevesi (sivri kemer) */}
      <svg viewBox="0 0 260 350" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="ck-cerceve" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F3DFA6" /><stop offset="0.5" stopColor="#C9A24E" /><stop offset="1" stopColor="#9C7A2E" />
          </linearGradient>
        </defs>
        <ellipse cx="130" cy="352" rx="150" ry="10" fill="rgba(60,40,10,.25)" />
        <path d="M0 350 V130 Q0 40 130 0 Q260 40 260 130 V350 H232 V138 Q232 62 130 30 Q28 62 28 138 V350 Z" fill="url(#ck-cerceve)" />
        <path d="M10 350 V134 Q10 52 130 12 Q250 52 250 134 V350" fill="none" stroke="#FFF3CF" strokeWidth="1" opacity="0.7" />
        <g transform="translate(130 15)"><polygon points="0,-9 2.6,-2.6 9,0 2.6,2.6 0,9 -2.6,2.6 -9,0 -2.6,-2.6" fill="#FFF3CF" /></g>
      </svg>
      {/* Açıklık: ışık + kanatlar */}
      <div style={{ position: 'absolute', left: `${(28 / 260) * 100}%`, right: `${(28 / 260) * 100}%`, top: `${(30 / 350) * 100}%`, bottom: 0, perspective: 700 }}>
        <NurBahcesi />
        <Kanat taraf="sol" acik={acik} sure={sure} />
        <Kanat taraf="sag" acik={acik} sure={sure} />
      </div>
    </div>
  );
}

function Sis({ acik }) {
  const katmanlar = [
    { top: '48%', h: '30vh', op: 0.55, d: 22, yon: -1 },
    { top: '58%', h: '26vh', op: 0.65, d: 30, yon: 1 },
    { top: '66%', h: '34vh', op: 0.5, d: 26, yon: -1 },
    { top: '40%', h: '24vh', op: 0.35, d: 36, yon: 1 },
  ];
  return katmanlar.map((k, i) => (
    <motion.div
      // eslint-disable-next-line react/no-array-index-key
      key={i}
      aria-hidden
      animate={acik ? { x: `${k.yon * 70}vw`, opacity: 0.15 } : { x: [`${-8 * k.yon}vw`, `${8 * k.yon}vw`], opacity: k.op }}
      transition={acik ? { duration: 2.6, ease: 'easeInOut' } : { x: { duration: k.d, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }, opacity: { duration: 1 } }}
      style={{ position: 'absolute', left: '-30vw', width: '160vw', top: k.top, height: k.h, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,252,244,0.45) 38%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }}
    />
  ));
}

function Yapraklar({ yogun }) {
  const n = yogun ? 26 : 16;
  return Array.from({ length: n }, (_, i) => {
    const renk = ['#F4C6CF', '#FBE3E7', '#FFFFFF', '#F7D3A8'][i % 4];
    const x0 = rnd(i, 7) * 100;
    const sure = 9 + rnd(i, 8) * 8;
    return (
      <motion.div
        // eslint-disable-next-line react/no-array-index-key
        key={i}
        aria-hidden
        initial={{ y: '-8vh', x: 0, rotate: 0 }}
        animate={{ y: '108vh', x: [0, 30 * (rnd(i) - 0.5), -20 * (rnd(i, 2) - 0.5), 24 * (rnd(i, 3) - 0.5)], rotate: 360 * (rnd(i, 4) > 0.5 ? 1 : -1) }}
        transition={{ duration: sure, repeat: Infinity, delay: rnd(i, 9) * sure, ease: 'linear' }}
        style={{ position: 'absolute', top: 0, left: `${x0}%`, width: 9 + rnd(i, 10) * 6, height: 6 + rnd(i, 11) * 4, borderRadius: '60% 40% 60% 40%', background: renk, opacity: 0.85, boxShadow: '0 1px 2px rgba(0,0,0,.08)', pointerEvents: 'none' }}
      />
    );
  });
}

function NurZerreleri() {
  return Array.from({ length: 18 }, (_, i) => (
    <motion.div
      // eslint-disable-next-line react/no-array-index-key
      key={i}
      aria-hidden
      animate={{ y: [0, -140 - rnd(i) * 160], opacity: [0, 1, 0] }}
      transition={{ duration: 5 + rnd(i, 2) * 4, repeat: Infinity, delay: rnd(i, 3) * 5, ease: 'easeOut' }}
      style={{ position: 'absolute', left: `${30 + rnd(i, 4) * 40}%`, top: `${58 + rnd(i, 5) * 22}%`, width: 4, height: 4, borderRadius: 4, background: '#FFF6D8', boxShadow: '0 0 8px 3px rgba(255,236,170,.8)', pointerEvents: 'none' }}
    />
  ));
}

export default function CennetKapisi({ onTamam }) {
  const [evre, setEvre] = useState('dua'); // dua → aciliyor → gecis
  const [ses, setSes] = useState(bahceAcikMi);
  const bitti = useRef(false);
  const az = useMemo(azHareket, []);
  const zamanlar = useRef([]);
  const p = useParalaks(az);

  const [ekran, setEkran] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const f = () => setEkran({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);

  useEffect(() => {
    bahceBaslat(1);
    const z = zamanlar.current;
    return () => { z.forEach(clearTimeout); };
  }, []);

  const bitir = () => {
    if (bitti.current) return;
    bitti.current = true;
    bahceSeviye(0.4);
    onTamam();
  };

  const amin = () => {
    if (evre !== 'dua') return;
    setEvre('aciliyor');
    if (bahceAcikMi()) { playGate('kapi', { door: true }); nurTinisi(); }
    const z = zamanlar.current;
    if (az) { z.push(setTimeout(bitir, 900)); return; }
    z.push(setTimeout(() => setEvre('gecis'), 2500));
    z.push(setTimeout(bitir, 4100));
  };

  const gec = () => { stopGate(); bitir(); };

  const sesDegis = () => {
    const yeni = !ses;
    setSes(yeni);
    bahceTercih(yeni);
    if (yeni) bahceBaslat(1); else { bahceDurdur(0.6); stopGate(); }
  };

  const gateW = Math.min(ekran.w * 0.6, ekran.h * 0.36, 300);
  const gateH = gateW * (350 / 260);
  // Manzara SVG'si (1000×600, xMidYMax slice) yolun ucunu y=440'a çizer; kapı tam oraya oturur.
  const olcekM = Math.max(ekran.w / 1000, ekran.h / 600);
  const zeminY = ekran.h - (600 - 441) * olcekM;
  const acik = evre !== 'dua';

  return createPortal(
    <motion.div
      role="dialog"
      aria-label="Müslüman Olmak — açılış"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      style={{ position: 'fixed', inset: 0, zIndex: 1900, overflow: 'clip', background: '#F3E6CC' }}
    >
      {/* Kamera: geçişte kapının içine doğru ilerler */}
      <motion.div
        animate={evre === 'gecis' ? { scale: az ? 1 : 3.4, y: (ekran.h * 0.5 - (zeminY - gateH * 0.45)) * 2.2 } : { scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.55, 0, 0.3, 1] }}
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', transformOrigin: `50% ${zeminY - gateH * 0.45}px` }}
      >
        <Gok />
        <div style={{ position: 'absolute', left: 0, right: 0, top: zeminY - gateH * 0.55, height: 0 }}>
          <Isinlar acik={acik} />
        </div>
        <Katman p={p} derinlik={10}><Manzara /></Katman>
        <motion.div
          aria-hidden
          animate={acik ? { opacity: 1, scale: 1.25 } : { opacity: [0.45, 0.7, 0.45], scale: [1, 1.06, 1] }}
          transition={acik ? { duration: 2.2 } : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: '50%', top: zeminY - gateH * 0.55, width: gateW * 3, height: gateW * 3, marginLeft: -gateW * 1.5, marginTop: -gateW * 1.5, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,246,214,.95) 0%, rgba(255,230,170,.45) 30%, rgba(255,230,170,0) 62%)', pointerEvents: 'none' }}
        />
        <Katman p={p} derinlik={16}>
          <div style={{ position: 'absolute', left: '50%', top: zeminY - gateH, width: gateW, height: gateH, marginLeft: -gateW / 2 }}>
            <Kapi acik={acik} sure={az ? 0.6 : 2.4} />
          </div>
        </Katman>
        <Katman p={p} derinlik={30} style={{ pointerEvents: 'none' }}><Sis acik={acik} /></Katman>
        <NurZerreleri />
        <Yapraklar yogun={acik} />
      </motion.div>

      {/* Geçişte nur perdesi */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: evre === 'gecis' ? 1 : 0 }}
        transition={{ duration: evre === 'gecis' ? 1.3 : 0.3, delay: evre === 'gecis' ? 0.3 : 0 }}
        style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #FFFFFF, #FBF4E2 60%, #F4EEE0)', pointerEvents: 'none' }}
      />

      {/* Üst düğmeler */}
      <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 12px)', left: 12, right: 12, display: 'flex', justifyContent: 'space-between', zIndex: 3 }}>
        <button type="button" onClick={sesDegis} aria-label={ses ? 'Bahçe sesini kapat' : 'Bahçe sesini aç'} style={{ width: 42, height: 42, borderRadius: 14, border: '1px solid rgba(255,255,255,.4)', background: 'rgba(255,255,255,.22)', color: '#2B2A3A', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          {ses ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>
        <button type="button" onClick={gec} style={{ height: 42, padding: '0 16px', borderRadius: 14, border: '1px solid rgba(255,255,255,.4)', background: 'rgba(255,255,255,.22)', color: '#2B2A3A', fontFamily: FONT.arayuz, fontWeight: 700, fontSize: 13, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          Geç
        </button>
      </div>

      {/* Dua kartı */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'calc(env(safe-area-inset-bottom, 0px) + 22px)', display: 'flex', justifyContent: 'center', zIndex: 3, pointerEvents: 'none' }}>
      <AnimatePresence>
        {evre === 'dua' && (
          <motion.div
            key="dua"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 1.1, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: 24, transition: { duration: 0.6 } }}
            style={{ pointerEvents: 'auto', width: 'min(92vw, 420px)', textAlign: 'center', padding: '18px 20px 18px', borderRadius: 26, background: 'rgba(255,251,242,.62)', border: '1px solid rgba(255,255,255,.7)', boxShadow: '0 20px 50px rgba(70,50,20,.22)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', color: '#2A2A2A' }}
          >
            <div aria-hidden style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ height: 1, width: 54, background: 'linear-gradient(90deg, transparent, #B8913F)' }} />
              <motion.svg width="18" height="18" viewBox="0 0 20 20" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
                <rect x="4" y="4" width="12" height="12" fill="none" stroke="#B8913F" strokeWidth="1.3" />
                <rect x="4" y="4" width="12" height="12" fill="none" stroke="#B8913F" strokeWidth="1.3" transform="rotate(45 10 10)" />
                <circle cx="10" cy="10" r="1.8" fill="#B8913F" />
              </motion.svg>
              <span style={{ height: 1, width: 54, background: 'linear-gradient(90deg, #B8913F, transparent)' }} />
            </div>
            <div style={{ fontFamily: FONT.arayuz, fontSize: 10.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#8A6A2A', fontWeight: 800 }}>Kapıyı dua ile aç</div>
            <div style={{ fontFamily: FONT.baslik, fontStyle: 'italic', fontWeight: 600, fontSize: 16, color: '#5E5A55', marginTop: 10 }}>Bismillâhirrahmânirrahîm</div>
            <div style={{ fontFamily: FONT.baslik, fontStyle: 'italic', fontWeight: 800, fontSize: 32, lineHeight: '38px', color: '#0F4A3A', marginTop: 6 }}>Rabbi zidnî ilmâ</div>
            <div style={{ fontFamily: FONT.govde, fontSize: 16, color: '#2A2A2A', marginTop: 4 }}>“Rabbim, ilmimi artır.”</div>
            <div style={{ fontFamily: FONT.arayuz, fontSize: 11, color: '#6B6660', marginTop: 4, fontWeight: 600 }}>Tâhâ sûresi, 114. âyetten</div>
            <motion.button
              type="button"
              onClick={amin}
              whileTap={{ scale: 0.96 }}
              animate={{ boxShadow: ['0 0 0 0 rgba(216,183,106,.55)', '0 0 0 14px rgba(216,183,106,0)'] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              style={{ position: 'relative', overflow: 'hidden', marginTop: 14, width: '100%', height: 52, borderRadius: 16, border: 0, cursor: 'pointer', background: 'linear-gradient(135deg, #E9CB86, #C9A24E 55%, #A9832F)', color: '#2A1E06', fontFamily: FONT.baslik, fontWeight: 800, fontSize: 19, letterSpacing: '0.04em' }}
            >
              <motion.span
                aria-hidden
                initial={{ x: '-140%' }}
                animate={{ x: '260%' }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.8, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '40%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent)', skewX: -18, pointerEvents: 'none' }}
              />
              <span style={{ position: 'relative' }}>Âmin</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>,
    document.body,
  );
}

export const KAPI_OTURUM = 'mo_kapi_oturum';
export function kapiGosterilsinMi() {
  try { return sessionStorage.getItem(KAPI_OTURUM) !== '1'; } catch { return true; }
}
export function kapiGosterildi() {
  try { sessionStorage.setItem(KAPI_OTURUM, '1'); } catch { /* */ }
}
