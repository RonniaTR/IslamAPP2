import React from 'react';
import { motion } from 'framer-motion';

// ✨ SEVAP POINTS AMBLEMİ — İslamiApp'in kendi işareti.
// Dışta dönen 32 ışın, ortada altın sekiz köşeli yıldız, yıldızın içinde zümrüt sekizgen ve onun içinde
// kemer biçimli bir "nur damlası". Üzerinden yavaş bir altın parıltı geçer. Hiçbir hazır logo kullanılmadı.

export function SevapIsaret({ boyut = 120, hareketli = true, id = 'sa' }) {
  const isinlar = Array.from({ length: 32 }, (_, i) => i);
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 200 200" aria-hidden style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${id}-altin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF1C2" /><stop offset="0.45" stopColor="#E9C77E" /><stop offset="1" stopColor="#9C7A2E" />
        </linearGradient>
        <linearGradient id={`${id}-zumrut`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C7A5C" /><stop offset="1" stopColor="#0A3326" />
        </linearGradient>
        <radialGradient id={`${id}-hale`} cx="50%" cy="50%" r="50%">
          <stop offset="0.35" stopColor="#FFE3A0" stopOpacity="0.45" /><stop offset="1" stopColor="#FFE3A0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-parilti`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.75" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-yildiz`}>
          <rect x="46" y="46" width="108" height="108" /><rect x="46" y="46" width="108" height="108" transform="rotate(45 100 100)" />
        </clipPath>
      </defs>
      <motion.circle cx="100" cy="100" r="98" fill={`url(#${id}-hale)`}
        animate={hareketli ? { opacity: [0.6, 1, 0.6] } : undefined} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.g animate={hareketli ? { rotate: 360 } : undefined} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '100px 100px' }}>
        {isinlar.map((i) => {
          const a = (i / 32) * 2 * Math.PI; const uzun = i % 2 === 0;
          return <line key={i} x1={100 + Math.cos(a) * 80} y1={100 + Math.sin(a) * 80} x2={100 + Math.cos(a) * (uzun ? 97 : 89)} y2={100 + Math.sin(a) * (uzun ? 97 : 89)}
            stroke="#E9C77E" strokeWidth={uzun ? 1.6 : 1} strokeLinecap="round" opacity={uzun ? 0.85 : 0.5} />;
        })}
        <circle cx="100" cy="100" r="76" fill="none" stroke="#E9C77E" strokeWidth="0.8" opacity="0.5" strokeDasharray="2 4" />
      </motion.g>
      {/* altın yıldız */}
      <rect x="46" y="46" width="108" height="108" fill={`url(#${id}-altin)`} />
      <rect x="46" y="46" width="108" height="108" fill={`url(#${id}-altin)`} transform="rotate(45 100 100)" />
      <rect x="52" y="52" width="96" height="96" fill="none" stroke="#7A5A1E" strokeWidth="0.8" opacity="0.6" />
      <rect x="52" y="52" width="96" height="96" fill="none" stroke="#7A5A1E" strokeWidth="0.8" opacity="0.6" transform="rotate(45 100 100)" />
      {/* zümrüt sekizgen */}
      <polygon points={Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * 2 * Math.PI + Math.PI / 8; return `${100 + Math.cos(a) * 40},${100 + Math.sin(a) * 40}`; }).join(' ')}
        fill={`url(#${id}-zumrut)`} stroke="#F3DDA0" strokeWidth="1.5" />
      {/* nur damlası: kemer + damla */}
      <path d="M100 72 C88 88 82 98 82 108 A18 18 0 0 0 118 108 C118 98 112 88 100 72 Z" fill="#FFF4D2" opacity="0.95" />
      <path d="M100 84 C94 93 91 99 91 106 A9 9 0 0 0 109 106 C109 99 106 93 100 84 Z" fill="#E9C77E" />
      <circle cx="100" cy="66" r="2.6" fill="#FFF4D2" />
      {/* parıltı geçişi */}
      {hareketli && (
        <g clipPath={`url(#${id}-yildiz)`}>
          <motion.rect y="0" width="60" height="200" fill={`url(#${id}-parilti)`} transform="skewX(-20)"
            initial={{ x: -80 }} animate={{ x: [-80, 260] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3.2, ease: 'easeInOut' }} />
        </g>
      )}
    </svg>
  );
}

export function SevapYazi({ boyut = 1 }) {
  return (
    <div style={{ textAlign: 'center', lineHeight: 1 }}>
      <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 800, fontSize: 30 * boyut, letterSpacing: '0.18em', backgroundImage: 'linear-gradient(180deg, #FFF1C2 0%, #E9C77E 55%, #A9873C 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
        SEVAP
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 * boyut, marginTop: 6 * boyut }}>
        <span style={{ width: 26 * boyut, height: 1, background: 'linear-gradient(90deg, transparent, #E9C77E)' }} />
        <span style={{ fontSize: 11 * boyut, fontWeight: 800, letterSpacing: '0.5em', color: '#E9C77E', paddingInlineStart: '0.5em' }}>POINTS</span>
        <span style={{ width: 26 * boyut, height: 1, background: 'linear-gradient(90deg, #E9C77E, transparent)' }} />
      </div>
    </div>
  );
}

/** Girih deseni: sayfanın arka planına çok hafif sekiz köşeli yıldız örgüsü. */
export function GirihZemin({ opaklik = 0.06 }) {
  return (
    <svg aria-hidden width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <pattern id="sp-girih" width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#E9C77E" strokeWidth="0.8">
            <rect x="16" y="16" width="24" height="24" /><rect x="16" y="16" width="24" height="24" transform="rotate(45 28 28)" />
            <path d="M0 28 H8 M48 28 H56 M28 0 V8 M28 48 V56" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sp-girih)" opacity={opaklik} />
    </svg>
  );
}

/** Altın köşe süslü çerçeve + süslü başlık. */
export function SusluCerceve({ baslik, alt, children, style }) {
  const kose = (dondur) => (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden style={{ position: 'absolute', ...dondur }}>
      <path d="M1 12 V1 H12" fill="none" stroke="#E9C77E" strokeWidth="1.6" /><path d="M5 8 V5 H8" fill="none" stroke="#E9C77E" strokeWidth="1" opacity="0.7" />
      <rect x="0" y="0" width="3" height="3" fill="#E9C77E" />
    </svg>
  );
  return (
    <section style={{ position: 'relative', margin: '18px 16px 0', padding: '18px 14px 16px', borderRadius: 22, background: 'linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))', border: '1px solid rgba(233,199,126,0.22)', ...style }}>
      {kose({ top: 6, left: 6 })}{kose({ top: 6, right: 6, transform: 'scaleX(-1)' })}
      {kose({ bottom: 6, left: 6, transform: 'scaleY(-1)' })}{kose({ bottom: 6, right: 6, transform: 'scale(-1,-1)' })}
      {baslik && (
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ flex: 1, maxWidth: 60, height: 1, background: 'linear-gradient(90deg, transparent, #E9C77E)' }} />
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><rect x="2" y="2" width="6" height="6" fill="#E9C77E" /><rect x="2" y="2" width="6" height="6" fill="#E9C77E" transform="rotate(45 5 5)" /></svg>
            <h2 style={{ margin: 0, fontFamily: '"Fraunces", serif', fontSize: 19, fontWeight: 800, color: '#F4EFE3' }}>{baslik}</h2>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><rect x="2" y="2" width="6" height="6" fill="#E9C77E" /><rect x="2" y="2" width="6" height="6" fill="#E9C77E" transform="rotate(45 5 5)" /></svg>
            <span style={{ flex: 1, maxWidth: 60, height: 1, background: 'linear-gradient(90deg, #E9C77E, transparent)' }} />
          </div>
          {alt && <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'rgba(244,239,227,0.6)' }}>{alt}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
