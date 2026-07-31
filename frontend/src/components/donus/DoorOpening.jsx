import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useTx } from '../../i18n';
import { alpha } from '../../donus/palette';

// 🚪 KAPI AÇILIŞI — Dönüş Odası'na girerken oynayan tek seferlik sahne.
//
// Üç perde:
//   1. Karanlıkta duran kapalı iki kanat
//   2. Kanatlar açılır, arkadan ışık taşar
//   3. Işık ekranı doldurur ve oda görünür
//
// Amaç dekor değil: kişi buraya "başka bir yere girdiğini" hissederek
// gelsin. Kapı metaforu müfredatın ilk bölümüyle aynı (Kapı · 1-7. gün).
// Oturum başına bir kez oynar; her açılışta tekrarlamaz.

export default function DoorOpening({ onDone }) {
  const { theme } = useTheme();
  const tt = useTx();
  const [phase, setPhase] = useState(0); // 0 kapalı · 1 açılıyor · 2 ışık
  const gold = '#F0B429';

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => onDone && onDone(), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden flex items-center justify-center"
      style={{ background: theme.bg }} data-testid="door-opening">

      {/* Kapının arkasındaki ışık */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        initial={{ width: 10, height: 10, opacity: 0 }}
        animate={phase >= 1
          ? { width: phase >= 2 ? 2400 : 420, height: phase >= 2 ? 2400 : 420, opacity: phase >= 2 ? 1 : 0.85 }
          : {}}
        transition={{ duration: phase >= 2 ? 0.9 : 1.2, ease: 'easeOut' }}
        style={{ background: `radial-gradient(circle, ${alpha(gold, 0.95)} 0%, ${alpha(gold, 0.35)} 35%, transparent 70%)` }}
      />

      {/* İki kanat */}
      {[-1, 1].map((side) => (
        <motion.div key={side}
          className="absolute top-0 bottom-0"
          style={{
            width: '50%',
            [side === -1 ? 'left' : 'right']: 0,
            transformOrigin: side === -1 ? 'left center' : 'right center',
            background: `linear-gradient(${side === -1 ? '95deg' : '265deg'}, ${theme.surface}, ${theme.bg})`,
            borderRight: side === -1 ? `2px solid ${alpha(gold, 0.5)}` : 'none',
            borderLeft: side === 1 ? `2px solid ${alpha(gold, 0.5)}` : 'none',
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: phase >= 1 ? side * -72 : 0, opacity: phase >= 2 ? 0 : 1 }}
          transition={{ duration: 1.25, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Kanat üzerindeki geometrik süsleme */}
          <svg viewBox="0 0 100 300" className="w-full h-full" preserveAspectRatio="none"
            style={{ opacity: 0.22 }} aria-hidden>
            <path d="M50 30 L72 60 L50 90 L28 60 Z M50 110 L72 140 L50 170 L28 140 Z M50 190 L72 220 L50 250 L28 220 Z"
              fill="none" stroke={gold} strokeWidth="1.6" />
            <circle cx="50" cy="60" r="4" fill={gold} />
            <circle cx="50" cy="140" r="4" fill={gold} />
            <circle cx="50" cy="220" r="4" fill={gold} />
          </svg>
        </motion.div>
      ))}

      {/* Karşılama cümlesi */}
      <AnimatePresence>
        {phase < 2 && (
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ delay: 0.25 }}
            className="absolute bottom-24 text-center px-10 text-[13px] font-black tracking-wide z-10"
            style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
            {tt('Kapı senin için açılıyor')}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
