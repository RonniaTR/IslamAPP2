import React from 'react';
import { motion } from 'framer-motion';

// 🎨 ÇOCUK SAHNELERİ — ayetleri ve hikâyeleri anlatan küçük, hareketli çizimler (320×200).
// Hepsi kodla çizilir: dosya yok, telif yok, internetsiz çalışır. İnsan, peygamber, melek çizilmez;
// yalnız doğa, gök, hayvanlar, nesneler ve yapılar. Hareket yumuşak ve yavaştır, korkutucu öğe yoktur.
const loop = (d, delay = 0) => ({ duration: d, repeat: Infinity, ease: 'easeInOut', delay });

const SKY = {
  gunduz: ['#8FD3F4', '#E8F7FF'], aksam: ['#F7B58A', '#FFE7C7'], gece: ['#1D2B5A', '#3B4F8A'], deniz: ['#7CC8F0', '#DFF3FF'], yagmur: ['#9DB4C8', '#E3ECF2'],
};

const Cloud = ({ x, y, s = 1, d = 10 }) => (
  <motion.g animate={{ x: [0, 16, 0] }} transition={loop(d)}>
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#FFFFFF">
      <ellipse cx="0" cy="0" rx="24" ry="10" /><ellipse cx="14" cy="-6" rx="14" ry="10" /><ellipse cx="-10" cy="-4" rx="11" ry="8" />
    </g>
  </motion.g>
);
const Sun = ({ x = 262, y = 46, r = 20 }) => (
  <g>
    <motion.g animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: `${x}px ${y}px` }}>
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={x - 2} y={y - r - 13} width="4" height="9" rx="2" fill="#FFD93D" transform={`rotate(${i * 36} ${x} ${y})`} />)}
    </motion.g>
    <circle cx={x} cy={y} r={r} fill="#FFD93D" />
  </g>
);
const Hills = ({ c1 = '#8FD18F', c2 = '#5DB760' }) => (
  <g><path d="M0 150 Q80 118 160 142 T320 132 V200 H0 Z" fill={c1} /><path d="M0 172 Q110 146 220 168 T320 162 V200 H0 Z" fill={c2} /></g>
);
const Bird = ({ x, y, d, delay }) => (
  <motion.g initial={{ x: -40 }} animate={{ x: 380, y: [0, -10, 0, -6, 0] }} transition={{ x: { duration: d, repeat: Infinity, ease: 'linear', delay }, y: loop(3, delay) }}>
    <motion.path d={`M${x} ${y} q8 -10 16 0 q8 -10 16 0`} fill="none" stroke="#3B4A5A" strokeWidth="3" strokeLinecap="round"
      animate={{ d: [`M${x} ${y} q8 -10 16 0 q8 -10 16 0`, `M${x} ${y} q8 6 16 0 q8 6 16 0`, `M${x} ${y} q8 -10 16 0 q8 -10 16 0`] }} transition={loop(0.7, delay)} />
  </motion.g>
);
const Tree = ({ x, y, s = 1, fruit }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-4" y="0" width="8" height="26" rx="3" fill="#9A6B3F" />
    <motion.g animate={{ rotate: [-2, 2, -2] }} transition={loop(4)} style={{ transformOrigin: '0px 0px' }}>
      <circle cx="0" cy="-10" r="22" fill="#4CAF50" /><circle cx="-14" cy="0" r="14" fill="#5DBB63" /><circle cx="14" cy="0" r="14" fill="#5DBB63" />
      {fruit && [[-10, -14], [8, -6], [-2, 4], [12, -20]].map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r="4.5" fill={fruit} />)}
    </motion.g>
  </g>
);
const Waves = ({ y = 150, c = '#3E9BD6' }) => (
  <g>
    {[0, 1].map((k) => (
      <motion.path key={k} d={`M-40 ${y + k * 14} q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V200 H-40 Z`} fill={k ? '#2F86C2' : c}
        animate={{ x: [0, k ? -40 : 40, 0] }} transition={loop(5 + k)} opacity={k ? 1 : 0.85} />
    ))}
  </g>
);
const Kaaba = ({ x = 160, y = 150, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-30" y="-52" width="60" height="52" rx="3" fill="#20242C" />
    <rect x="-30" y="-42" width="60" height="7" fill="#D9B44A" />
    <rect x="8" y="-26" width="12" height="26" rx="2" fill="#D9B44A" />
  </g>
);
const Mosque = ({ x = 160, y = 160 }) => (
  <g transform={`translate(${x} ${y})`} fill="#FFFFFF" stroke="#2D8A4E" strokeWidth="2.5">
    <path d="M-40 0 V-24 Q-40 -54 0 -58 Q40 -54 40 -24 V0 Z" /><rect x="48" y="-70" width="10" height="70" /><path d="M45 -70 L53 -88 L61 -70 Z" />
    <path d="M-8 0 V-18 A8 8 0 0 1 8 -18 V0" fill="#FFD93D" /><circle cx="0" cy="-64" r="4" fill="#FFD93D" />
  </g>
);

const SCENES = {
  kuslar: () => (<><Sun /><Cloud x={70} y={50} /><Cloud x={200} y={36} s={0.8} d={13} /><Bird x={0} y={90} d={9} delay={0} /><Bird x={0} y={70} d={11} delay={2} /><Bird x={0} y={110} d={10} delay={4.5} /><Hills /></>),
  gunesay: () => (
    <>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '160px 110px' }}>
        <ellipse cx="160" cy="110" rx="120" ry="70" fill="none" stroke="#FFFFFF" strokeOpacity="0.4" strokeDasharray="3 7" />
        <circle cx="280" cy="110" r="20" fill="#FFD93D" />
        <circle cx="40" cy="110" r="13" fill="#F4F1E1" /><circle cx="46" cy="106" r="11" fill="#3B4F8A" />
      </motion.g>
      {[[60, 40], [250, 30], [120, 170], [210, 176], [30, 150]].map(([x, y], i) => <motion.circle key={i} cx={x} cy={y} r="2" fill="#FFF8E6" animate={{ opacity: [0.2, 1, 0.2] }} transition={loop(2 + i * 0.4)} />)}
    </>
  ),
  yagmur: () => (
    <>
      <Cloud x={110} y={40} s={1.4} /><Cloud x={220} y={34} s={1.2} d={12} />
      {Array.from({ length: 16 }, (_, i) => (
        <motion.line key={i} x1={70 + (i * 13) % 190} x2={66 + (i * 13) % 190} y1="56" y2="66" stroke="#4A90D9" strokeWidth="3" strokeLinecap="round"
          animate={{ y: [0, 80], opacity: [1, 0] }} transition={{ duration: 1.1, repeat: Infinity, delay: (i % 6) * 0.18, ease: 'easeIn' }} />
      ))}
      <Hills />
      {[60, 110, 170, 230, 270].map((x, i) => (
        <motion.g key={x} initial={{ scaleY: 0.2 }} animate={{ scaleY: [0.3, 1, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, delay: i * 0.3 }} style={{ transformOrigin: `${x}px 170px` }}>
          <path d={`M${x} 170 V150`} stroke="#3E8E41" strokeWidth="3" /><ellipse cx={x - 6} cy="154" rx="7" ry="4" fill="#5DBB63" /><ellipse cx={x + 6} cy="150" rx="7" ry="4" fill="#5DBB63" />
        </motion.g>
      ))}
    </>
  ),
  yol: () => (
    <>
      <Sun x={270} y={42} r={16} /><Cloud x={80} y={40} />
      <path d="M40 200 C 40 150, 120 160, 130 120 S 210 80, 250 70" fill="none" stroke="#E8C88A" strokeWidth="16" strokeLinecap="round" />
      <path d="M0 160 L60 110 L110 160 Z" fill="#9AA8B8" /><path d="M90 170 L160 100 L220 170 Z" fill="#B3C0CE" />
      <Hills c1="#A6DBA0" c2="#7CC67E" />
      <motion.circle r="7" fill="#FF9F43" animate={{ cx: [40, 90, 130, 190, 250], cy: [196, 156, 120, 88, 70] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.g animate={{ scale: [0.8, 1.15, 0.8] }} transition={loop(2)} style={{ transformOrigin: '262px 62px' }}><path d="M262 50 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#FFD93D" /></motion.g>
    </>
  ),
  bahce: () => (<><Sun /><Cloud x={90} y={44} /><Hills /><Tree x={70} y={136} fruit="#FF6B6B" /><Tree x={160} y={128} s={1.2} fruit="#FF9F43" /><Tree x={250} y={138} fruit="#FFD93D" />
    <motion.g animate={{ x: [0, 60, 120, 60, 0], y: [0, -14, 0, -10, 0] }} transition={loop(8)}><g transform="translate(40 100)"><ellipse rx="5" ry="3.5" fill="#FF6B8A" /><motion.path d="M0 0 q-8 -10 -12 -2 M0 0 q8 -10 12 -2" stroke="#FF6B8A" strokeWidth="3" fill="none" animate={{ scaleY: [1, 0.4, 1] }} transition={loop(0.4)} /></g></motion.g></>),
  yildizlar: () => (<>{Array.from({ length: 40 }, (_, i) => <motion.circle key={i} cx={(i * 47) % 320} cy={(i * 31) % 160} r={1 + (i % 3)} fill="#FFF3C4" animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }} transition={loop(1.5 + (i % 5) * 0.5, i * 0.1)} />)}
    <circle cx="250" cy="50" r="18" fill="#F4F1E1" /><circle cx="258" cy="44" r="15" fill="#1D2B5A" /><Hills c1="#2E4A3A" c2="#203628" /></>),
  gunes: () => (<><motion.g animate={{ y: [30, 0, 30] }} transition={loop(8)}><Sun x={160} y={92} r={30} /></motion.g><Cloud x={60} y={60} /><Cloud x={260} y={70} s={0.9} d={12} /><Hills c1="#F2C27A" c2="#E6A55A" /></>),
  kalp: () => (<><motion.g animate={{ scale: [1, 1.12, 1] }} transition={loop(2.4)} style={{ transformOrigin: '160px 100px' }}>
    <circle cx="160" cy="100" r="70" fill="#FFF3C4" opacity="0.6" /><path d="M160 136 C 100 100, 112 52, 146 62 C 154 64, 158 70, 160 76 C 162 70, 166 64, 174 62 C 208 52, 220 100, 160 136 Z" fill="#FF8FA3" /></motion.g>
    {[0, 1, 2, 3, 4, 5].map((i) => <motion.circle key={i} cx={100 + i * 24} r="3" fill="#FFD93D" animate={{ cy: [170, 30], opacity: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.6 }} />)}</>),
  ev: () => (<><Sun x={268} y={44} r={16} /><Cloud x={80} y={44} /><Hills />
    <g transform="translate(160 160)"><rect x="-46" y="-50" width="92" height="50" fill="#FFF7E8" stroke="#C98B52" strokeWidth="3" /><path d="M-56 -48 L0 -88 L56 -48 Z" fill="#E86A5A" />
      <motion.rect x="-34" y="-38" width="20" height="18" rx="3" fill="#FFD93D" animate={{ opacity: [0.6, 1, 0.6] }} transition={loop(2)} /><motion.rect x="14" y="-38" width="20" height="18" rx="3" fill="#FFD93D" animate={{ opacity: [1, 0.6, 1] }} transition={loop(2)} />
      <rect x="-9" y="-24" width="18" height="24" rx="3" fill="#C98B52" /></g>
    <motion.path d="M160 70 C 150 56, 132 64, 160 84 C 188 64, 170 56, 160 70 Z" fill="#FF6B8A" animate={{ y: [0, -14, 0], opacity: [0.3, 1, 0.3] }} transition={loop(3)} /></>),
  // ── hikâye sahneleri ──
  gemi: () => (<><Cloud x={80} y={44} /><Cloud x={230} y={50} d={12} /><Waves y={150} />
    <motion.g animate={{ rotate: [-3, 3, -3], y: [0, -4, 0] }} transition={loop(3)} style={{ transformOrigin: '160px 140px' }}>
      <path d="M90 130 H230 L210 160 H110 Z" fill="#B7793F" /><rect x="120" y="108" width="80" height="22" rx="4" fill="#E2B072" /><rect x="157" y="64" width="6" height="46" fill="#7A4E26" /><path d="M163 66 L200 98 H163 Z" fill="#FFFFFF" />
      {[130, 146, 182].map((x) => <circle key={x} cx={x} cy="119" r="4" fill="#7A4E26" />)}
    </motion.g></>),
  yagmurlugemi: () => (<><Cloud x={90} y={34} s={1.3} /><Cloud x={220} y={30} s={1.2} d={12} />
    {Array.from({ length: 14 }, (_, i) => <motion.line key={i} x1={40 + i * 18} x2={36 + i * 18} y1="48" y2="58" stroke="#5B8BC2" strokeWidth="3" strokeLinecap="round" animate={{ y: [0, 70], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: (i % 5) * 0.2 }} />)}
    <Waves y={140} /><motion.g animate={{ rotate: [-4, 4, -4] }} transition={loop(2.6)} style={{ transformOrigin: '160px 130px' }}><path d="M100 124 H220 L204 150 H116 Z" fill="#B7793F" /><rect x="126" y="104" width="68" height="20" rx="4" fill="#E2B072" /></motion.g></>),
  cudi: () => (<><Sun x={70} y={46} r={18} />
    {['#FF6B6B', '#FF9F43', '#FFD93D', '#5DBB63', '#4A90D9', '#9B59B6'].map((c, i) => <motion.path key={c} d={`M${40 + i * 6} 170 A${120 - i * 6} ${110 - i * 6} 0 0 1 ${280 - i * 6} 170`} fill="none" stroke={c} strokeWidth="6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: i * 0.15 }} />)}
    <path d="M150 170 L220 80 L300 170 Z" fill="#8C9AA8" /><path d="M206 98 L220 80 L234 98 Z" fill="#FFFFFF" />
    <g transform="translate(222 92)"><path d="M-24 0 H24 L18 12 H-18 Z" fill="#B7793F" /></g><Hills c1="#A6DBA0" c2="#7CC67E" /></>),
  balik: () => (<><rect width="320" height="200" fill="#1F5F8B" /><Waves y={36} c="#2F86C2" />
    {Array.from({ length: 8 }, (_, i) => <motion.circle key={i} cx={60 + i * 30} r={3 + (i % 3)} fill="#BFE6FF" opacity="0.7" animate={{ cy: [190, 60], opacity: [0, 0.8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }} />)}
    <motion.g animate={{ x: [-10, 10, -10], y: [0, 6, 0] }} transition={loop(5)}><path d="M70 120 Q150 60 230 120 Q150 170 70 120 Z" fill="#5C7A99" /><path d="M230 120 L270 96 L262 120 L270 144 Z" fill="#5C7A99" /><circle cx="100" cy="112" r="5" fill="#1F2937" /></motion.g>
    {[0, 1, 2].map((i) => <motion.circle key={i} cx={64} cy={110 - i * 12} r={3 + i} fill="none" stroke="#BFE6FF" strokeWidth="1.5" animate={{ cy: [110, 50], opacity: [1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }} />)}</>),
  sahil: () => (<><Sun x={262} y={46} r={18} /><Waves y={150} c="#7CC8F0" /><path d="M0 160 Q160 120 240 150 Q290 168 320 160 V200 H0 Z" fill="#F2D9A0" />
    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 2.5 }} style={{ transformOrigin: '120px 150px' }}><path d="M120 150 C 120 120, 150 100, 170 96" stroke="#3E8E41" strokeWidth="4" fill="none" />
      {[[134, 118], [152, 104], [170, 96], [118, 132]].map(([x, y], i) => <motion.ellipse key={i} cx={x} cy={y} rx="16" ry="10" fill="#5DBB63" animate={{ rotate: [-6, 6, -6] }} transition={loop(3 + i)} style={{ transformOrigin: `${x}px ${y}px` }} />)}</motion.g></>),
  karinca: () => (<><Sun /><Cloud x={80} y={44} /><Hills c1="#C9E7A9" c2="#A6D47E" />
    <g transform="translate(250 172)"><path d="M-30 0 Q0 -40 30 0 Z" fill="#B7793F" /><ellipse cx="0" cy="-4" rx="8" ry="6" fill="#5A3A1E" /></g>
    {Array.from({ length: 6 }, (_, i) => (
      <motion.g key={i} initial={{ x: 0 }} animate={{ x: [0, 210] , opacity: [1, 1, 0] }} transition={{ duration: 6, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}>
        <g transform={`translate(30 ${176 - (i % 2) * 4})`}><circle cx="0" cy="0" r="3" fill="#2B1B10" /><circle cx="6" cy="-1" r="3.5" fill="#2B1B10" /><circle cx="12" cy="-2" r="2.6" fill="#2B1B10" /></g>
      </motion.g>
    ))}</>),
  kabe: () => (<><Sun x={262} y={44} r={18} /><path d="M0 170 H320 V200 H0 Z" fill="#E9D8B4" /><ellipse cx="160" cy="170" rx="120" ry="14" fill="#F4E6C6" /><Kaaba />
    {Array.from({ length: 5 }, (_, i) => <motion.rect key={i} x={86 + i * 14} width="12" height="8" rx="1" fill="#C9B48A" animate={{ y: [166, 120 - i * 2], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }} />)}</>),
  mekke: () => (<><Sun x={70} y={44} r={18} /><path d="M0 150 L40 110 L80 150 L130 96 L190 150 L240 104 L320 150 V200 H0 Z" fill="#C8A87A" /><path d="M0 172 H320 V200 H0 Z" fill="#E9D8B4" /><Kaaba x={200} y={172} s={0.7} />
    {[0, 1, 2].map((i) => <motion.circle key={i} cx={90 + i * 8} cy="168" r="3" fill="#8A6B4A" animate={{ cx: [90 + i * 8, 170 + i * 8] }} transition={loop(5, i)} />)}</>),
  cami: () => (<><Sun x={262} y={44} r={16} /><Cloud x={80} y={40} /><Hills /><Mosque /></>),
};

/** @param {{ id: string, height?: number, sky?: string }} props */
export default function KidsScene({ id, height = 200, sky }) {
  const draw = SCENES[id] || SCENES.cami;
  const night = ['gunesay', 'yildizlar'].includes(id);
  const sea = ['balik'].includes(id);
  const s = SKY[sky || (night ? 'gece' : id === 'gunes' ? 'aksam' : id === 'yagmurlugemi' ? 'yagmur' : sea ? 'deniz' : 'gunduz')];
  const gid = `ks-${id}`;
  return (
    <svg viewBox="0 0 320 200" width="100%" height={height} preserveAspectRatio="xMidYMid slice" aria-hidden style={{ display: 'block' }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s[0]} /><stop offset="1" stopColor={s[1]} /></linearGradient></defs>
      <rect width="320" height="200" fill={`url(#${gid})`} />
      {draw()}
    </svg>
  );
}
export const SCENE_IDS = Object.keys(SCENES);
