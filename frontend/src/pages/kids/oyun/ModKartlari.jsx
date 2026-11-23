import React from 'react';
import { motion } from 'framer-motion';

// 🕌 KEMER KARTLAR — çocuk oyun modlarının giriş kartları.
// Üstü kemer biçiminde, kemerin içinde sekiz köşeli yıldızlardan bir çini şeridi, altında modun küçük çizimi.
// Kartlar sırayla "çiçek açar" gibi aşağıdan yükselir; dokununca hafifçe içeri basar.

function Cini({ id, renk, zemin }) {
  return (
    <svg width="100%" height="58" aria-hidden style={{ display: 'block' }}>
      <defs>
        <pattern id={`cini-${id}`} width="29" height="29" patternUnits="userSpaceOnUse">
          <rect width="29" height="29" fill={zemin} />
          <g transform="translate(14.5 14.5)">
            <rect x="-7" y="-7" width="14" height="14" fill={renk} opacity="0.85" />
            <rect x="-7" y="-7" width="14" height="14" fill={renk} opacity="0.85" transform="rotate(45)" />
            <circle r="3.2" fill="#FFFFFF" />
          </g>
          {[[0, 0], [29, 0], [0, 29], [29, 29]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill={renk} opacity="0.45" />)}
        </pattern>
      </defs>
      <rect width="100%" height="58" fill={`url(#cini-${id})`} />
    </svg>
  );
}

function Cizim({ id }) {
  if (id === 'yol') {
    return (
      <svg width="64" height="52" viewBox="0 0 64 52" aria-hidden>
        <path d="M6 46 C20 46 14 28 30 28 S44 10 58 8" fill="none" stroke="#F7EBD0" strokeWidth="9" strokeLinecap="round" />
        <path d="M6 46 C20 46 14 28 30 28 S44 10 58 8" fill="none" stroke="#F2B33D" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" />
        {[[6, 46], [30, 28], [58, 8]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill={i < 2 ? '#F2B33D' : '#fff'} stroke="#2D8A4E" strokeWidth="2" />)}
      </svg>
    );
  }
  if (id === 'aile') {
    return (
      <svg width="64" height="52" viewBox="0 0 64 52" aria-hidden>
        <rect x="4" y="30" width="56" height="8" rx="4" fill="#C98E5A" />
        <rect x="10" y="38" width="5" height="12" rx="2" fill="#A8703F" /><rect x="49" y="38" width="5" height="12" rx="2" fill="#A8703F" />
        {[[14, 16, '#4A90D9'], [32, 12, '#FF9F43'], [50, 16, '#2D8A4E']].map(([x, y, c]) => (
          <g key={x}><circle cx={x} cy={y} r="7" fill={c} /><path d={`M${x - 9} ${y + 16} Q${x} ${y + 4} ${x + 9} ${y + 16}`} fill={c} /></g>
        ))}
      </svg>
    );
  }
  return (
    <svg width="64" height="52" viewBox="0 0 64 52" aria-hidden>
      <path d="M32 4 V10" stroke="#7A5A1E" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 14 Q32 6 46 14 V38 Q32 46 18 38 Z" fill="#FFD93D" stroke="#7A5A1E" strokeWidth="2.5" />
      <path d="M18 26 H46 M32 14 V42" stroke="#7A5A1E" strokeWidth="1.4" opacity="0.5" />
      <path d="M24 48 H40" stroke="#7A5A1E" strokeWidth="3" strokeLinecap="round" />
      {[[6, 18], [58, 22], [10, 40]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.5" fill="#FFD93D" />)}
    </svg>
  );
}

export const MODLAR = [
  { id: 'yol', ad: 'Yıldız Yolu', alt: 'Durak durak ilerle', renk: '#2D8A4E', zemin: '#DFF3E2', golge: '#BFE3C3' },
  { id: 'aile', ad: 'Ailece', alt: 'Aynı telefonda sırayla', renk: '#4A90D9', zemin: '#E1EEFB', golge: '#C3DBF5' },
  { id: 'yarisma', ad: 'Bilgi Yarışı', alt: 'Üç joker seninle', renk: '#E08A1E', zemin: '#FFEFD9', golge: '#F8D7A8' },
];

export default function ModKartlari({ onSec }) {
  return (
    <div data-rehber="modlar" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
      {MODLAR.map((m, i) => (
        <motion.button key={m.id} type="button" data-testid={`mod-${m.id}`} data-rehber={`mod-${m.id}`} onClick={() => onSec(m.id)}
          initial={{ opacity: 0, y: 40, scaleY: 0.85 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 180, damping: 15 }}
          whileTap={{ scale: 0.94, y: 4 }}
          style={{ position: 'relative', padding: 0, border: `3px solid ${m.zemin}`, borderRadius: '999px 999px 22px 22px', overflow: 'hidden', background: '#FFFFFF', cursor: 'pointer', boxShadow: `0 7px 0 ${m.golge}`, transformOrigin: 'bottom', display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: 196 }}>
          <Cini id={m.id} renk={m.renk} zemin={m.zemin} />
          <span style={{ display: 'flex', justifyContent: 'center', marginTop: -20 }}>
            <span style={{ width: 74, height: 64, borderRadius: '37px 37px 14px 14px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 3px ${m.zemin}` }}>
              <Cizim id={m.id} />
            </span>
          </span>
          <span style={{ padding: '8px 6px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: m.renk, lineHeight: 1.1, textAlign: 'center' }}>{m.ad}</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#6E8577', lineHeight: 1.2, textAlign: 'center' }}>{m.alt}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}
