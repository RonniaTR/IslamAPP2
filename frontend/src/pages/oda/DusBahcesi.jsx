import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 🌙 DÜŞ BAHÇESİ — odanın sahnesi. Gece bahçesi, ateş böcekleri, iki fener (ikiniz).
// Karşı taraf odaya girince onun feneri yanar; bağlantı kurulunca iki fener arasında ışıktan bir ip gerilir.
// Kişisel hiçbir şey burada yazılı değildir: adlar ve sözler odanın belgesinden gelir.

export function Backdrop({ dim = false }) {
  const flies = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ x: (i * 41) % 100, y: 30 + ((i * 29) % 65), d: 5 + (i % 6), dl: (i * 0.37) % 4 })), []);
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: 'radial-gradient(ellipse at 70% 10%, #2B2462 0%, #120F2E 45%, #07060F 100%)', transition: 'opacity .8s', opacity: dim ? 0.55 : 1 }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {Array.from({ length: 40 }, (_, i) => <motion.circle key={i} cx={(i * 53) % 400} cy={(i * 31) % 150} r={0.5 + (i % 3) * 0.4} fill="#FFF6E0" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: i * 0.11 }} />)}
        <circle cx="318" cy="48" r="18" fill="#FFF1C9" /><circle cx="326" cy="42" r="16" fill="#1A163F" />
        <path d="M0 250 Q60 228 120 240 T240 236 T400 232 V300 H0 Z" fill="#0C1A1A" />
        <path d="M0 270 Q100 250 200 266 T400 258 V300 H0 Z" fill="#081211" />
        {[[30, 236, 1.2], [90, 242, 0.9], [350, 230, 1.3], [380, 238, 0.8]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}><rect x="-2" y="-10" width="4" height="14" fill="#0E1F1C" /><circle cx="0" cy="-18" r="12" fill="#10251F" /><circle cx="-8" cy="-12" r="8" fill="#10251F" /><circle cx="8" cy="-12" r="8" fill="#10251F" /></g>
        ))}
        {[60, 150, 250, 330].map((x, i) => (
          <motion.g key={x} animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 4 + i, repeat: Infinity }} style={{ transformOrigin: `${x}px 268px` }}>
            <path d={`M${x} 268 q2 -12 0 -22`} stroke="#1F3B33" strokeWidth="1.5" fill="none" />
            <circle cx={x} cy={244} r="3.5" fill={['#F7A8B8', '#C8B6FF', '#FFD98A', '#9FE3C8'][i]} opacity="0.85" />
          </motion.g>
        ))}
      </svg>
      {flies.map((f, i) => (
        <motion.span key={i} animate={{ x: [0, 18, -10, 0], y: [0, -14, 8, 0], opacity: [0, 1, 0.6, 0] }} transition={{ duration: f.d, repeat: Infinity, delay: f.dl }}
          style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%`, width: 5, height: 5, borderRadius: 3, background: '#FFE89A', boxShadow: '0 0 10px 3px rgba(255,232,154,0.7)' }} />
      ))}
    </div>
  );
}

function Lantern({ lit, name, side }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 96 }}>
      <motion.svg width="46" height="64" viewBox="0 0 46 64" animate={lit ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: 3, repeat: Infinity, delay: side === 'r' ? 1.2 : 0 }}>
        <path d="M23 2 v8" stroke="#8A7B5A" strokeWidth="2" />
        <rect x="9" y="10" width="28" height="6" rx="3" fill="#8A7B5A" />
        <path d="M11 16 Q6 34 11 52 H35 Q40 34 35 16 Z" fill={lit ? '#FFD27A' : '#2A2742'} stroke="#8A7B5A" strokeWidth="2" style={{ transition: 'fill .8s' }} />
        {lit && <motion.ellipse cx="23" cy="36" rx="5" ry="8" fill="#FFF6D8" animate={{ scaleY: [1, 1.18, 0.92, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ transformOrigin: '23px 44px', transformBox: 'view-box' }} />}
        <rect x="9" y="52" width="28" height="6" rx="3" fill="#8A7B5A" />
      </motion.svg>
      <span style={{ fontSize: 14, fontWeight: 700, color: lit ? '#FFE9B8' : '#7C7896', maxWidth: 96, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color .8s' }}>{name}</span>
      {lit && <span aria-hidden style={{ position: 'absolute', width: 120, height: 120, borderRadius: 60, marginTop: -28, background: 'radial-gradient(circle, rgba(255,210,122,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />}
    </div>
  );
}

/** Üst şerit: iki fener ve aralarındaki ışık ipi. */
export function Lanterns({ benim, onun, onunVar, bagli, durum }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
      <Lantern lit name={benim} side="l" />
      <div style={{ flex: 1, position: 'relative', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden style={{ position: 'absolute', inset: 0, top: 8 }}>
          <path d="M0 20 Q100 46 200 20" fill="none" stroke="#3A3658" strokeWidth="1.5" strokeDasharray="3 5" />
          <motion.path d="M0 20 Q100 46 200 20" fill="none" stroke="#FFD27A" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: bagli ? 1 : 0, opacity: bagli ? 1 : 0 }} transition={{ duration: 1.6, ease: 'easeInOut' }} style={{ filter: 'drop-shadow(0 0 4px #FFD27A)' }} />
        </svg>
        <AnimatePresence mode="wait">
          <motion.span key={durum} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'relative', top: 22, fontSize: 12, color: bagli ? '#FFE9B8' : '#9C98B8', letterSpacing: 1 }}>{durum}</motion.span>
        </AnimatePresence>
      </div>
      <Lantern lit={onunVar} name={onun} side="r" />
    </div>
  );
}

/** Uçan kalpler (her iki taraftan). */
export function Hearts({ list }) {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 40 }}>
      <AnimatePresence>
        {list.map((h) => (
          <motion.span key={h.id} initial={{ opacity: 0, y: 0, scale: 0.6 }} animate={{ opacity: [0, 1, 1, 0], y: -320, x: h.dx, scale: [0.6, 1.2, 1] }} exit={{ opacity: 0 }} transition={{ duration: 2.6, ease: 'easeOut' }}
            style={{ position: 'absolute', bottom: 120, [h.mine ? 'left' : 'right']: `${18 + (h.id % 5) * 4}%`, fontSize: 30 }}>{h.e}</motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
