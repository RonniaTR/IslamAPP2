import React from 'react';
import { motion } from 'framer-motion';
import { alpha } from '../../donus/palette';

// 🪔 KANDİL — odanın kalbi
//
// Okunan her ders alevi biraz büyütür; kırk günde kandil tam ışığına
// kavuşur. Sayı da gösterilir ama asıl geri bildirim görseldir: kişi odaya
// girdiğinde önce KENDİ IŞIĞINI görür.
//
// Kırk gün boyunca büyüyen tek bir şey olması bilinçli — parçalı rozet
// yerine bütün bir görüntü, dönüşün kendisine benziyor.

export default function Kandil({ p, read = 0, total = 40, day = 1, size = 132 }) {
  const t = Math.min(1, read / total);          // 0..1 doluluk
  const flame = 0.42 + t * 0.58;                 // alev ölçeği
  const glow = 0.25 + t * 0.75;                  // hâle yoğunluğu
  const R = 52, C = 2 * Math.PI * R;

  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Hâle — ilerledikçe güçlenir ve nefes alır */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 1.35, height: size * 1.35,
          background: `radial-gradient(circle, ${alpha(p.accentGlow, 0.5 * glow)} 0%, transparent 68%)`,
        }}
        animate={{ scale: [1, 1.09, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} />

      {/* İlerleme halkası */}
      <svg width={size} height={size} viewBox="0 0 132 132" className="absolute -rotate-90">
        <circle cx="66" cy="66" r={R} fill="none" stroke={alpha(p.accent, 0.14)} strokeWidth="5" />
        <motion.circle cx="66" cy="66" r={R} fill="none" stroke={p.accent} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - t) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${alpha(p.accentGlow, 0.85)})` }} />
      </svg>

      {/* Kandil — alev, gövde ve sayaç dikey olarak istiflenir */}
      <div className="relative flex flex-col items-center justify-center" style={{ marginTop: -6 }}>
        {/* Alev */}
        <motion.svg viewBox="0 0 40 56" style={{ width: 26 * flame + 10, height: 36 * flame + 12 }}
          animate={{ scaleY: [1, 1.14, 0.95, 1.07, 1], scaleX: [1, 0.93, 1.06, 0.96, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <defs>
            <radialGradient id="kandilFlame" cx="50%" cy="68%" r="55%">
              <stop offset="0%" stopColor="#FFF8E2" />
              <stop offset="45%" stopColor={p.accentGlow} />
              <stop offset="100%" stopColor={p.accent} stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <path d="M20 2 C28 16 36 24 36 36 C36 47 29 54 20 54 C11 54 4 47 4 36 C4 24 12 16 20 2 Z"
            fill="url(#kandilFlame)" />
          <ellipse cx="20" cy="41" rx="4.5" ry="8" fill="#FFFCF0" opacity={0.5 + t * 0.45} />
        </motion.svg>

        {/* Gövde */}
        <svg viewBox="0 0 80 34" style={{ width: 48, marginTop: -2 }} aria-hidden>
          <path d="M16 3 L64 3 L56 22 Q40 31 24 22 Z" fill={alpha(p.accent, 0.13)}
            stroke={p.accent} strokeWidth="1.6" />
          <path d="M30 25 L50 25 L47 32 L33 32 Z" fill="none" stroke={p.accent} strokeWidth="1.3" />
        </svg>

        {/* Gün sayacı — kandilin altında, çakışmadan */}
        <div className="flex items-baseline gap-0.5 mt-1.5">
          <span className="text-[16px] font-black leading-none tabular-nums"
            style={{ color: p.text, textShadow: `0 0 10px ${alpha(p.accentGlow, 0.5)}` }}>{day}</span>
          <span className="text-[8.5px] font-black" style={{ color: p.dim }}>/{total}</span>
        </div>
      </div>
    </div>
  );
}
