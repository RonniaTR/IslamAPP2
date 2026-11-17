import React from 'react';
import { motion } from 'framer-motion';

// 🧎 NAMAZ DURUŞLARI — yüzü çizilmeyen, yumuşak hatlı bir çocuk silueti (yandan, kıble sağda).
// Eklem noktaları her duruş için tanımlıdır; duruş değişince uzuvlar yaylanarak yeni yerine geçer.
// Duruşlar: kiyam · tekbir · ruku · kavme · secde · oturus · selamSag · selamSol
const P = {
  kiyam:  { head: [110, 38], S: [110, 60], H: [110, 112], K: [110, 146], A: [110, 178], T: [124, 181], E: [117, 88], W: [124, 102] },
  tekbir: { head: [110, 38], S: [110, 60], H: [110, 112], K: [110, 146], A: [110, 178], T: [124, 181], E: [122, 66], W: [119, 44] },
  ruku:   { head: [170, 104], S: [150, 108], H: [108, 112], K: [110, 146], A: [110, 178], T: [124, 181], E: [134, 126], W: [114, 142] },
  kavme:  { head: [110, 38], S: [110, 60], H: [110, 112], K: [110, 146], A: [110, 178], T: [124, 181], E: [111, 88], W: [112, 114] },
  secde:  { head: [152, 168], S: [134, 156], H: [88, 140], K: [98, 180], A: [68, 172], T: [62, 181], E: [136, 172], W: [148, 181] },
  oturus: { head: [88, 88], S: [86, 110], H: [82, 160], K: [128, 178], A: [76, 179], T: [64, 181], E: [96, 138], W: [122, 160] },
};
P.selamSag = { ...P.oturus, head: [92, 88] };
P.selamSol = { ...P.oturus, head: [83, 88] };

const spring = { type: 'spring', stiffness: 90, damping: 16 };

function Limb({ a, b, w, color }) {
  return <motion.line initial={false} animate={{ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }} transition={spring} stroke={color} strokeWidth={w} strokeLinecap="round" />;
}

export default function PrayerFigure({ pose = 'kiyam', height = 220, cloth = '#4A90D9' }) {
  const p = P[pose] || P.kiyam;
  const skin = '#F2C9A0';
  const turn = pose === 'selamSag' ? 1 : pose === 'selamSol' ? -1 : 0;
  return (
    <svg viewBox="0 0 220 200" width="100%" height={height} aria-hidden style={{ display: 'block' }}>
      <defs><linearGradient id="pf-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF8E6" /><stop offset="1" stopColor="#FDEFD2" /></linearGradient></defs>
      <rect width="220" height="200" rx="24" fill="url(#pf-bg)" />
      {/* seccade */}
      <rect x="40" y="181" width="150" height="9" rx="4" fill="#2D8A4E" />
      <rect x="44" y="183" width="142" height="5" rx="2.5" fill="none" stroke="#F2B33D" strokeWidth="1" />
      <path d="M176 181 l7 -8 l7 8 z" fill="#2D8A4E" />
      {/* kıble işareti */}
      <g transform="translate(196 30)"><rect x="-9" y="-9" width="18" height="18" rx="2" fill="#20242C" /><rect x="-9" y="-5" width="18" height="3" fill="#D9B44A" /></g>
      <text x="196" y="54" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A7A55">kıble</text>
      {/* gövde ve uzuvlar: arkadaki kol, bacaklar, gövde, öndeki kol */}
      <Limb a={p.S} b={p.E} w={9} color="#3A78B8" />
      <Limb a={p.H} b={p.K} w={15} color="#2F4E7A" />
      <Limb a={p.K} b={p.A} w={13} color="#2F4E7A" />
      <Limb a={p.A} b={p.T} w={9} color={skin} />
      <Limb a={p.S} b={p.H} w={26} color={cloth} />
      <Limb a={p.S} b={p.E} w={10} color={cloth} />
      <Limb a={p.E} b={p.W} w={9} color={cloth} />
      <motion.circle initial={false} animate={{ cx: p.W[0], cy: p.W[1] }} transition={spring} r="5.5" fill={skin} />
      <motion.circle initial={false} animate={{ cx: p.head[0], cy: p.head[1] }} transition={spring} r="15" fill={skin} />
      <motion.path initial={false} animate={{ d: `M${p.head[0] - 15} ${p.head[1] - 2} A15 15 0 0 1 ${p.head[0] + 15} ${p.head[1] - 2} Z` }} transition={spring} fill="#FFFFFF" stroke="#E5E7EB" />
      {turn !== 0 && (
        <motion.g key={pose} initial={{ opacity: 0, x: 0 }} animate={{ opacity: [0, 1, 1, 0], x: turn * 18 }} transition={{ duration: 1.6, repeat: Infinity }}>
          <path d={`M${p.head[0] + turn * 20} ${p.head[1] - 22} l${turn * 10} 6 l${-turn * 10} 6`} fill="none" stroke="#F2B33D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      )}
    </svg>
  );
}
