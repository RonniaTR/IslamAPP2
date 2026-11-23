import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// 🌙 GİRİŞ SAHNESİ — açılış, kapı, giriş ve mod seçiminin ortak parçaları.
// Hepsi kodla çizilir (SVG): resim dosyası yok, telif yok, ağ isteği yok → açılış anında hazırdır.

export const GECE = {
  bg: 'radial-gradient(120% 90% at 50% 0%, #0E3B2C 0%, #08241B 45%, #04130E 100%)',
  ink: '#F4EFE3',
  soft: 'rgba(244,239,227,0.62)',
  gold: '#D8B76A',
  goldDeep: '#A9873C',
  glow: 'rgba(216,183,106,0.22)',
  line: 'rgba(216,183,106,0.22)',
  wood: '#3B2416',
  woodHi: '#5A3A22',
};

/** Her açılışta aynı yerde duran (rastgele olmayan) yıldızlar; birkaçı hafifçe parlar. */
export function Yildizlar({ count = 40, color = '#FFFFFF' }) {
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: (Math.sin(i * 12.9898) * 43758.5453) % 1,
    y: (Math.sin(i * 78.233) * 12345.6789) % 1,
    r: i % 9 === 0 ? 2 : i % 3 === 0 ? 1.4 : 1,
    d: 2 + (i % 5),
  })).map((s) => ({ ...s, x: Math.abs(s.x) * 100, y: Math.abs(s.y) * 72 })), [count]);
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <span key={i} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, borderRadius: '50%',
          background: i % 9 === 0 ? GECE.gold : color, opacity: i % 9 === 0 ? 0.9 : 0.45,
          animation: `twinkle ${s.d}s ease-in-out ${(i % 7) * 0.35}s infinite`,
        }} />
      ))}
    </div>
  );
}

/** Altın kemer amblemi: kemer çizgisi kendini çizer, içinde hilal ve yıldız belirir. */
export function NurKemer({ size = 120, draw = true, delay = 0 }) {
  const t = (d) => ({ duration: d, delay, ease: [0.16, 1, 0.3, 1] });
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 120 138" aria-hidden style={{ overflow: 'visible', filter: `drop-shadow(0 0 22px ${GECE.glow})` }}>
      <defs>
        <linearGradient id="nk-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1DCA0" /><stop offset="0.55" stopColor={GECE.gold} /><stop offset="1" stopColor={GECE.goldDeep} />
        </linearGradient>
        <radialGradient id="nk-in" cx="0.5" cy="0.62" r="0.6">
          <stop offset="0" stopColor="rgba(241,220,160,0.35)" /><stop offset="1" stopColor="rgba(241,220,160,0)" />
        </radialGradient>
      </defs>
      <path d="M14 136 V64 C14 34 36 14 60 4 C84 14 106 34 106 64 V136 Z" fill="url(#nk-in)" />
      <motion.path d="M14 136 V64 C14 34 36 14 60 4 C84 14 106 34 106 64 V136" fill="none" stroke="url(#nk-gold)" strokeWidth="3.2" strokeLinecap="round"
        initial={draw ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={t(1.1)} />
      <motion.path d="M26 136 V68 C26 44 42 28 60 19 C78 28 94 44 94 68 V136" fill="none" stroke={GECE.gold} strokeOpacity="0.45" strokeWidth="1.4"
        initial={draw ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={t(1.3)} />
      <motion.g initial={draw ? { opacity: 0, scale: 0.6 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ ...t(0.8), delay: delay + 0.45 }} style={{ transformOrigin: '60px 74px' }}>
        <mask id="nk-hilal"><rect x="0" y="0" width="120" height="138" fill="#fff" /><circle cx="68" cy="70" r="15.5" fill="#000" /></mask>
        <circle cx="60" cy="74" r="18" fill="url(#nk-gold)" mask="url(#nk-hilal)" />
        <path d="M77 60 l1.9 3.9 4.3.6 -3.1 3 .7 4.3 -3.8-2 -3.8 2 .7-4.3 -3.1-3 4.3-.6z" fill="#F1DCA0" />
      </motion.g>
    </svg>
  );
}

/** Tek kapı kanadı: ahşap zemin, altın çerçeve, sekiz köşeli yıldız geçmeli pano, halka tokmak. */
export function KapiKanadi({ side = 'left', tone = 'mihrap' }) {
  const kids = tone === 'bahce';
  const base = kids ? '#2F8F5B' : GECE.wood;
  const hi = kids ? '#46B377' : GECE.woodHi;
  const trim = kids ? '#FFD45E' : GECE.gold;
  const id = `kk-${side}-${tone}`;
  const flip = side === 'right';
  return (
    <svg viewBox="0 0 100 220" preserveAspectRatio="none" width="100%" height="100%" aria-hidden style={{ display: 'block', transform: flip ? 'scaleX(-1)' : undefined }}>
      <defs>
        <linearGradient id={`${id}-w`} x1="0" x2="1">
          <stop offset="0" stopColor={hi} /><stop offset="0.6" stopColor={base} /><stop offset="1" stopColor={base} />
        </linearGradient>
        <pattern id={`${id}-p`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9 Z" fill="none" stroke={trim} strokeOpacity={kids ? 0.7 : 0.55} strokeWidth="1" />
          <rect x="8.5" y="8.5" width="7" height="7" transform="rotate(45 12 12)" fill="none" stroke={trim} strokeOpacity="0.35" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100" height="220" fill={`url(#${id}-w)`} />
      <rect x="5" y="5" width="90" height="210" fill="none" stroke={trim} strokeOpacity="0.8" strokeWidth="2" />
      <rect x="14" y="16" width="72" height="88" rx="3" fill={`url(#${id}-p)`} stroke={trim} strokeOpacity="0.6" strokeWidth="1.2" />
      <rect x="14" y="116" width="72" height="88" rx="3" fill={`url(#${id}-p)`} stroke={trim} strokeOpacity="0.6" strokeWidth="1.2" />
      {kids && <g>
        <circle cx="30" cy="190" r="5" fill="#FF8FB1" /><circle cx="44" cy="196" r="4" fill="#FFD45E" /><circle cx="70" cy="192" r="5" fill="#8EC5FF" />
      </g>}
      <circle cx="90" cy="112" r="6" fill="none" stroke={trim} strokeWidth="2.2" />
      <circle cx="90" cy="104" r="2.4" fill={trim} />
    </svg>
  );
}

/**
 * Kemerli kapı: iki kanat + arkadaki ışık. `open` true olunca kanatlar içeri doğru açılır.
 * Boyut kapsayıcıdan gelir (genişlik/yükseklik verilmeli).
 */
export function KemerliKapi({ open = false, tone = 'mihrap', duration = 1.5, onOpened, light = true }) {
  const kids = tone === 'bahce';
  const trim = kids ? '#FFD45E' : GECE.gold;
  const leaf = (side) => ({
    position: 'absolute', top: 0, bottom: 0, width: '50%', [side]: 0,
    transformOrigin: side === 'left' ? 'left center' : 'right center',
  });
  const ease = [0.65, 0, 0.35, 1];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', perspective: 900 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50% 50% 6px 6px / 34% 34% 6px 6px', overflow: 'hidden',
        background: kids ? 'linear-gradient(180deg,#BDE6FF,#FFF6D8)' : 'radial-gradient(circle at 50% 60%, #FFF6DA 0%, #F1D58F 35%, #8A6A2A 100%)',
        boxShadow: `0 0 0 3px ${trim}, 0 0 40px ${kids ? 'rgba(255,212,94,0.35)' : GECE.glow}` }}>
        {light && (
          <motion.div aria-hidden initial={false} animate={{ opacity: open ? 1 : 0.25 }} transition={{ duration: duration * 0.8 }}
            style={{ position: 'absolute', inset: '-20%', background: kids
              ? 'radial-gradient(circle at 50% 70%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 60%)'
              : 'conic-gradient(from 180deg at 50% 100%, rgba(255,246,218,0) 0deg, rgba(255,246,218,0.75) 20deg, rgba(255,246,218,0) 40deg, rgba(255,246,218,0.6) 70deg, rgba(255,246,218,0) 95deg, rgba(255,246,218,0.7) 130deg, rgba(255,246,218,0) 160deg, rgba(255,246,218,0.65) 200deg, rgba(255,246,218,0) 230deg, rgba(255,246,218,0.7) 270deg, rgba(255,246,218,0) 300deg, rgba(255,246,218,0.6) 330deg, rgba(255,246,218,0) 360deg)' }} />
        )}
        {kids && <BahceManzarasi />}
        <motion.div style={leaf('left')} initial={false} animate={{ rotateY: open ? -108 : 0 }} transition={{ duration, ease }}
          onAnimationComplete={() => { if (open && onOpened) onOpened(); }}>
          <KapiKanadi side="left" tone={tone} />
        </motion.div>
        <motion.div style={leaf('right')} initial={false} animate={{ rotateY: open ? 108 : 0 }} transition={{ duration, ease }}>
          <KapiKanadi side="right" tone={tone} />
        </motion.div>
        {!open && (
          <motion.div aria-hidden animate={{ opacity: [0.35, 0.9, 0.35] }} transition={{ duration: 2.4, repeat: Infinity }}
            style={{ position: 'absolute', top: '6%', bottom: 0, left: '50%', width: 3, marginLeft: -1.5,
              background: `linear-gradient(180deg, transparent, ${kids ? '#FFFFFF' : '#FFF3C9'}, transparent)`, boxShadow: `0 0 18px ${kids ? '#FFFFFF' : '#FFE7A3'}` }} />
        )}
      </div>
    </div>
  );
}

/** Çocuk kapısının ardındaki bahçe: tepeler, güneş, çiçekler (kapı açılınca görünür). */
function BahceManzarasi() {
  return (
    <svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <circle cx="150" cy="70" r="26" fill="#FFD45E" />
      <path d="M0 190 C40 160 80 168 110 186 C140 204 170 176 200 170 V260 H0 Z" fill="#7BD389" />
      <path d="M0 214 C50 196 90 206 130 220 C160 230 180 222 200 216 V260 H0 Z" fill="#4CB46A" />
      {[[30, 222, '#FF8FB1'], [62, 232, '#FFFFFF'], [104, 228, '#FFD45E'], [140, 238, '#8EC5FF'], [172, 230, '#FF8FB1']].map(([x, y, c], i) => (
        <g key={i}><line x1={x} y1={y} x2={x} y2={y + 14} stroke="#2F8F5B" strokeWidth="2" /><circle cx={x} cy={y} r="5" fill={c} /><circle cx={x} cy={y} r="2" fill="#FFF3B0" /></g>
      ))}
    </svg>
  );
}

/** Işık zerreleri: kapı açıldığında içeriden süzülen nur. Yoğunluk düşüktür (eski telefonlar için). */
export function NurZerreleri({ active, count = 22, color = '#FFF1C4' }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: 50 + Math.sin(i * 2.3) * 22, d: 1.6 + (i % 5) * 0.35, delay: (i % 7) * 0.12, size: 2 + (i % 3) * 1.5, drift: Math.cos(i * 1.7) * 40,
  })), [count]);
  if (!active) return null;
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((m, i) => (
        <motion.span key={i} initial={{ opacity: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 0], x: m.drift, y: -220 - (i % 4) * 60 }}
          transition={{ duration: m.d, delay: m.delay, ease: 'easeOut' }}
          style={{ position: 'absolute', left: `${m.x}%`, bottom: '18%', width: m.size, height: m.size, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
      ))}
    </div>
  );
}

/** Kullanıcı "hareketi azalt" demişse uzun animasyonlar kısaltılır. */
export const reducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};
