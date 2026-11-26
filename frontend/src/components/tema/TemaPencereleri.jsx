import React from 'react';
import { motion } from 'framer-motion';

// 🪟 KEMER PENCERELER — uygulama teması seçici (İslamiApp'e özgü).
// Her tema, içinde kendi ruhunu taşıyan küçük bir manzara görünen sivri kemerli bir penceredir:
// Işıltı'da sabah güneşi ve tepeler, Huşu'da karanlıkta tek kandil, Sevgi'de gül dalı, Sükûn'da su ve ay,
// Bereket'te başak tarlası, Gece'de yıldızlar ve kubbe… Seçilince pencerenin iki kanadı dışa açılır ve içeriden ışık vurur.
// Renkler temanın kendi paletinden gelir; emoji ve renk noktası yok.

const KEMER = 'M6 150 V62 Q6 26 50 8 Q94 26 94 62 V150 Z';

function Manzara({ id, t }) {
  const g = t.gold; const p = t.primary; const bg = t.bg; const s = t.surface;
  switch (id) {
    case 'revza': return (<g>
      <rect width="100" height="150" fill="#E7EEE6" />
      <circle cx="50" cy="48" r="22" fill="#FFF4D0" opacity="0.7" />
      <circle cx="50" cy="48" r="10" fill={g} opacity="0.85" />
      <path d="M0 112 Q34 98 62 108 T100 102 V150 H0 Z" fill={p} opacity="0.35" />
      <path d="M22 146 C22 102 26 84 26 78 C26 84 30 102 30 146 Z" fill={p} opacity="0.85" />
      <path d="M70 146 C70 106 74 88 74 82 C74 88 78 106 78 146 Z" fill={p} opacity="0.85" />
      <path d="M0 128 Q50 118 100 128 V150 H0 Z" fill={p} opacity="0.75" />
    </g>);
    case 'isilti': return (<g>
      <rect width="100" height="150" fill="#FFF4DC" /><circle cx="50" cy="70" r="30" fill="#FFE3A0" opacity="0.6" /><circle cx="50" cy="70" r="14" fill="#FFCB6B" />
      <path d="M0 108 Q30 92 56 104 T100 98 V150 H0 Z" fill={p} opacity="0.55" /><path d="M0 124 Q40 112 70 122 T100 118 V150 H0 Z" fill={p} opacity="0.85" />
    </g>);
    case 'husu': return (<g>
      <rect width="100" height="150" fill="#0B0A18" /><circle cx="50" cy="78" r="34" fill={g} opacity="0.16" />
      <line x1="50" y1="20" x2="50" y2="62" stroke={g} strokeWidth="1" /><path d="M42 62 H58 L54 82 H46 Z" fill={g} /><circle cx="50" cy="72" r="4" fill="#FFF3C8" />
      <rect x="0" y="130" width="100" height="20" fill="#06050F" />
    </g>);
    case 'sevgi': return (<g>
      <rect width="100" height="150" fill="#F8E6E1" />
      <path d="M14 140 C30 110 46 96 70 60" stroke="#7A5A4A" strokeWidth="2.4" fill="none" />
      {[[70, 58, 10], [52, 84, 8], [36, 108, 7]].map(([x, y, r]) => (<g key={x}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={x} cy={y - r * 0.6} rx={r * 0.55} ry={r * 0.8} fill={p} opacity="0.85" transform={`rotate(${a} ${x} ${y})`} />)}<circle cx={x} cy={y} r={r * 0.3} fill={g} /></g>))}
      {[[60, 100], [28, 124]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx="8" ry="3.4" fill="#8DB580" transform={`rotate(-30 ${x} ${y})`} />)}
    </g>);
    case 'sukun': return (<g>
      <rect width="100" height="150" fill="#DDEBF3" /><circle cx="64" cy="48" r="9" fill="#FFFFFF" />
      {[96, 110, 124, 138].map((y, i) => <path key={y} d={`M0 ${y} Q25 ${y - 6} 50 ${y} T100 ${y} V150 H0 Z`} fill={p} opacity={0.3 + i * 0.18} />)}
    </g>);
    case 'bereket': return (<g>
      <rect width="100" height="150" fill="#F6E9CC" /><circle cx="74" cy="44" r="10" fill="#F2C36B" />
      <rect y="110" width="100" height="40" fill="#C99A55" />
      {[14, 28, 42, 56, 70, 84].map((x, i) => (<g key={x}><line x1={x} y1="128" x2={x + (i % 2 ? 3 : -3)} y2="88" stroke="#9C6B2E" strokeWidth="1.4" />{[0, 1, 2, 3].map((k) => <ellipse key={k} cx={x + (i % 2 ? 3 : -3) * (1 - k / 4)} cy={90 + k * 6} rx="2.4" ry="4" fill={g} />)}</g>))}
    </g>);
    case 'light': return (<g>
      <rect width="100" height="150" fill={bg} /><circle cx="50" cy="56" r="12" fill={g} opacity="0.85" />
      <path d="M22 150 V112 Q22 92 50 88 Q78 92 78 112 V150 Z" fill={p} opacity="0.7" /><rect x="14" y="96" width="5" height="54" fill={p} opacity="0.7" /><rect x="81" y="96" width="5" height="54" fill={p} opacity="0.7" />
    </g>);
    case 'emerald': return (<g>
      <rect width="100" height="150" fill="#0B3A2C" />
      {[[50, 60, 22], [50, 60, 12]].map(([x, y, r], i) => (<g key={r}><rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill="none" stroke={g} strokeWidth={i ? 1 : 1.4} /><rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill="none" stroke={g} strokeWidth={i ? 1 : 1.4} transform={`rotate(45 ${x} ${y})`} /></g>))}
      <path d="M0 130 Q50 118 100 130 V150 H0 Z" fill="#06241B" />
    </g>);
    default: return (<g>
      <rect width="100" height="150" fill="#0A0F22" />
      {[[16, 24], [34, 46], [72, 20], [84, 52], [58, 34], [24, 70], [80, 80]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#FFF4CF" />)}
      <circle cx="70" cy="40" r="8" fill="#FFF1CC" /><circle cx="74" cy="37" r="7" fill="#0A0F22" />
      <path d="M24 150 V118 Q24 98 50 94 Q76 98 76 118 V150 Z" fill={s} /><rect x="14" y="100" width="5" height="50" fill={s} /><rect x="81" y="100" width="5" height="50" fill={s} />
      {[40, 48, 56].map((x) => <rect key={x} x={x} y="126" width="4" height="7" rx="2" fill={g} />)}
    </g>);
  }
}

function Pencere({ id, t, secili, onClick, ad, tt }) {
  return (
    <motion.button type="button" onClick={onClick} aria-pressed={secili} data-testid={`pencere-${id}`} whileTap={{ scale: 0.96 }}
      style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <motion.svg viewBox="0 0 100 150" width="100%" style={{ maxWidth: 120, display: 'block', overflow: 'visible' }} animate={{ y: secili ? -4 : 0 }}>
        <defs><clipPath id={`tp-${id}`}><path d={KEMER} /></clipPath></defs>
        <g clipPath={`url(#tp-${id})`}>
          <Manzara id={id} t={t} />
          {/* kapı kanatları: seçiliyken dışa açılır */}
          <motion.path d="M6 150 V62 Q6 26 50 8 V150 Z" fill={t.surface} stroke={t.gold} strokeWidth="0.8"
            initial={false} animate={{ x: secili ? -44 : 0, opacity: secili ? 0 : 0.42 }} transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }} />
          <motion.path d="M50 8 Q94 26 94 62 V150 H50 Z" fill={t.surface} stroke={t.gold} strokeWidth="0.8"
            initial={false} animate={{ x: secili ? 44 : 0, opacity: secili ? 0 : 0.42 }} transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }} />
          {!secili && <g opacity="0.9">
            {[40, 60, 80, 100, 120].map((y) => <line key={y} x1="8" y1={y} x2="92" y2={y} stroke={t.gold} strokeWidth="0.5" opacity="0.45" />)}
            <line x1="50" y1="8" x2="50" y2="150" stroke={t.gold} strokeWidth="1" />
            <path d="M14 140 V70 Q14 40 46 24" fill="none" stroke={t.gold} strokeWidth="0.8" />
            <path d="M86 140 V70 Q86 40 54 24" fill="none" stroke={t.gold} strokeWidth="0.8" />
            <circle cx="44" cy="96" r="2" fill={t.gold} /><circle cx="56" cy="96" r="2" fill={t.gold} />
          </g>}
          {secili && <motion.rect width="100" height="150" fill="#FFF4CF" initial={{ opacity: 0.6 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }} />}
        </g>
        <path d={KEMER} fill="none" stroke={secili ? t.gold : 'rgba(128,128,128,0.45)'} strokeWidth={secili ? 3 : 1.4} />
        {secili && (
          <g transform="translate(50 8)">
            <rect x="-7" y="-7" width="14" height="14" fill={t.gold} /><rect x="-7" y="-7" width="14" height="14" fill={t.gold} transform="rotate(45)" />
            <path d="M-4 0 l3 3 l5 -6" stroke="#1A1A1A" strokeWidth="1.8" fill="none" />
          </g>
        )}
      </motion.svg>
      <span style={{ fontFamily: '"Fraunces", serif', fontWeight: 800, fontSize: 14.5 }}>{tt(ad)}</span>
      {t.mood && <span style={{ fontSize: 11, opacity: 0.65, marginTop: -6, textAlign: 'center', lineHeight: 1.3 }}>{tt(t.mood)}</span>}
    </motion.button>
  );
}

export default function TemaPencereleri({ themes, themeList, themeId, setTheme, tt }) {
  return (
    <div data-testid="tema-pencereleri" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px 10px', paddingTop: 6 }}>
      {themeList.map((id) => (
        <Pencere key={id} id={id} t={themes[id]} ad={themes[id].name} secili={id === themeId} onClick={() => setTheme(id)} tt={tt} />
      ))}
    </div>
  );
}
