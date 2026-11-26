import React from 'react';
import { motion } from 'framer-motion';
import { READING_THEMES, vaktinTemasi } from '../../services/readingSettings';

// 📜 VAKİT KÂĞITLARI — okuma teması seçici (İslamiApp'e özgü).
// Her tema günün bir vaktinin ışığıdır: üstte o vaktin göğü ve güneşin/ayın yeri, altında o kâğıdın kendisi
// (satırlar, vurgu rengi, kıvrık köşe). Üstteki "Vakte göre" anahtarı açıkken kâğıt saate göre kendiliğinden değişir.

function Kagit({ t, secili, simdi, onClick }) {
  const gunduz = t.gunes >= 0;
  const gx = 12 + t.gunes * 76;
  const gy = 30 - Math.sin(Math.PI * Math.max(0, t.gunes)) * 20;
  return (
    <motion.button type="button" onClick={onClick} aria-pressed={secili} data-testid={`kagit-${t.id}`}
      whileTap={{ scale: 0.95 }} animate={{ y: secili ? -8 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ flexShrink: 0, width: 108, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 108, height: 158, borderRadius: '54px 54px 10px 10px', overflow: 'hidden',
        boxShadow: secili ? `0 0 0 2px ${t.accent}, 0 14px 26px -10px rgba(0,0,0,0.55)` : '0 6px 16px -8px rgba(0,0,0,0.45)', background: t.bg }}>
        <svg width="108" height="158" viewBox="0 0 108 158" aria-hidden style={{ display: 'block' }}>
          <defs>
            <linearGradient id={`vk-gok-${t.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.gok[0]} /><stop offset="1" stopColor={t.gok[1]} /></linearGradient>
            <linearGradient id={`vk-lif-${t.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={t.dark ? '#ffffff' : '#000000'} stopOpacity="0.04" /><stop offset="1" stopColor={t.dark ? '#ffffff' : '#000000'} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* gök */}
          <rect width="108" height="58" fill={`url(#vk-gok-${t.id})`} />
          {gunduz ? (
            <g><circle cx={gx} cy={gy} r="10" fill="#FFF2C4" opacity="0.35" /><circle cx={gx} cy={gy} r="5.5" fill="#FFF6D8" /></g>
          ) : (
            <g>
              {[[18, 14], [40, 26], [70, 12], [88, 30], [56, 36], [28, 40]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="0.9" fill="#FFF4CF" />)}
              <circle cx="78" cy="22" r="7" fill="#FFF1CC" /><circle cx="81" cy="20" r="6" fill={t.gok[0]} />
            </g>
          )}
          <path d="M0 58 Q27 50 54 56 T108 54 V60 H0 Z" fill={t.dark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.4)'} />
          {/* kâğıt */}
          <rect y="58" width="108" height="100" fill={t.bg} />
          <rect y="58" width="108" height="100" fill={`url(#vk-lif-${t.id})`} />
          {[72, 82, 92, 102, 112].map((y, i) => (
            <rect key={y} x="14" y={y} width={i === 2 ? 52 : i === 4 ? 40 : 80} height="3" rx="1.5" fill={t.text} opacity={0.55} />
          ))}
          <rect x="70" y="92" width="24" height="3" rx="1.5" fill={t.accent} />
          <path d="M92 158 L108 142 V158 Z" fill={t.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'} />
          <path d="M92 158 L108 142" stroke={t.border} strokeWidth="1" />
        </svg>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, fontFamily: '"Fraunces", Georgia, serif', fontWeight: 800, fontSize: 15, color: t.text }}>{t.name}</div>
        {simdi && <span style={{ position: 'absolute', top: 62, left: 8, fontSize: 9, fontWeight: 800, letterSpacing: 1, padding: '2px 6px', borderRadius: 6, background: t.accent, color: t.dark ? '#111' : '#fff' }}>ŞİMDİ</span>}
      </div>
      <div style={{ marginTop: 6, fontSize: 10.5, color: 'rgba(128,128,128,0.9)', fontVariantNumeric: 'tabular-nums' }}>
        {String(t.saat[0]).padStart(2, '0')}:00–{String(t.saat[1]).padStart(2, '0')}:00
      </div>
    </motion.button>
  );
}

export default function VakitKagitlari({ settings, set, rt }) {
  const simdiki = vaktinTemasi();
  const otomatik = !!settings.otomatik;
  return (
    <div data-testid="vakit-kagitlari" style={{ marginBottom: 20 }}>
      <button type="button" onClick={() => set({ otomatik: !otomatik })} aria-pressed={otomatik} data-testid="vakte-gore"
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 18, marginBottom: 12, cursor: 'pointer', textAlign: 'start',
          background: otomatik ? `${rt.accent}22` : 'transparent', border: `1px solid ${otomatik ? rt.accent : rt.border}`, color: rt.text }}>
        <svg width="40" height="26" viewBox="0 0 40 26" aria-hidden>
          <path d="M3 24 Q20 -6 37 24" fill="none" stroke={rt.accent} strokeWidth="1.5" strokeDasharray="2 3" />
          <motion.circle r="4" fill={rt.accent} animate={otomatik ? { cx: [6, 20, 34], cy: [20, 6, 20] } : { cx: 20, cy: 6 }}
            transition={otomatik ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}} />
        </svg>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontWeight: 800, fontSize: 14.5 }}>Vakte göre</span>
          <span style={{ display: 'block', fontSize: 12, color: rt.secondary }}>{otomatik ? `Şimdi ${simdiki.name} kâğıdı; saat geçtikçe kendiliğinden değişir` : 'Kâğıt, günün vaktine göre kendiliğinden değişsin'}</span>
        </span>
        <span style={{ width: 44, height: 26, borderRadius: 13, background: otomatik ? rt.accent : `${rt.secondary}40`, position: 'relative', flexShrink: 0 }}>
          <motion.span animate={{ x: otomatik ? 20 : 2 }} style={{ position: 'absolute', top: 3, width: 20, height: 20, borderRadius: 10, background: '#fff' }} />
        </span>
      </button>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '12px 2px 6px', scrollbarWidth: 'none', opacity: otomatik ? 0.55 : 1 }}>
        {READING_THEMES.map((t) => (
          <Kagit key={t.id} t={t} simdi={t.id === simdiki.id}
            secili={otomatik ? t.id === simdiki.id : settings.themeId === t.id}
            onClick={() => set({ themeId: t.id, otomatik: false })} />
        ))}
      </div>
    </div>
  );
}
