import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { alpha } from '../../donus/palette';

// 🎞️ SAHNE — perde okunurken arkada akan görsel
//
// Kural: TASVİR YOK. İnsan, hayvan, peygamber tasviri hiçbir şekilde
// kullanılmaz. Yalnız ışık, geometri ve hareket — anlatının duygusunu
// taşıyacak kadar, dikkati dağıtmayacak kadar.
//
// Her sahne modu, metnin o anki beat'ine karşılık gelir. Modlar
// donusPerde.js'teki `sahne[].mod` değerleriyle eşleşir; tanınmayan
// bir mod gelirse sakin bir varsayılana düşülür (içerik önce gelir).

function Halka({ c, n = 3, dur = 6, from = 0.2, to = 1.6 }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <motion.span key={i} className="absolute rounded-full"
          style={{ border: `1px solid ${alpha(c, 0.5)}`, width: 160, height: 160 }}
          animate={{ scale: [from, to], opacity: [0.55, 0] }}
          transition={{ duration: dur, delay: (i * dur) / n, repeat: Infinity, ease: 'easeOut' }} />
      ))}
    </>
  );
}

function Zerre({ c, n = 14, up = true }) {
  const dots = useMemo(() => Array.from({ length: n }, (_, i) => ({
    x: ((i * 137.5) % 100) - 50,
    d: 6 + ((i * 3) % 7),
    delay: (i % 7) * 0.8,
    s: 2 + ((i * 5) % 3),
  })), [n]);
  return dots.map((p, i) => (
    <motion.span key={i} className="absolute rounded-full"
      style={{ width: p.s, height: p.s, background: c, boxShadow: `0 0 ${p.s * 4}px ${alpha(c, 0.9)}`, left: `calc(50% + ${p.x}px)` }}
      animate={{ y: up ? [90, -140] : [-140, 90], opacity: [0, 0.9, 0] }}
      transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: 'linear' }} />
  ));
}

export default function PerdeSahne({ p, mod }) {
  const c = p.accentGlow;

  const content = () => {
    switch (mod) {
      // ── Uzaktan yaklaşan ışık ──
      case 'karanlik':
        return <motion.span className="absolute rounded-full"
          style={{ width: 10, height: 10, background: c, boxShadow: `0 0 26px ${alpha(c, 0.9)}` }}
          animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 3.4, repeat: Infinity }} />;
      case 'yaklasan':
        return <motion.span className="absolute rounded-full"
          style={{ background: `radial-gradient(circle, ${alpha(c, 0.7)}, transparent 70%)` }}
          animate={{ width: [40, 260], height: [40, 260], opacity: [0.5, 0.85] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />;
      case 'nefes':
        return <motion.span className="absolute rounded-full"
          style={{ width: 200, height: 200, background: `radial-gradient(circle, ${alpha(c, 0.5)}, transparent 68%)` }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0.95, 0.6] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} />;
      case 'sarmal':
      case 'sarilma':
        return <><Halka c={c} n={4} dur={5} from={0.3} to={2.2} />
          <motion.span className="absolute rounded-full"
            style={{ width: 90, height: 90, background: `radial-gradient(circle, ${alpha(c, 0.75)}, transparent 70%)` }}
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} /></>;

      // ── Perde ──
      case 'perde':
        return <motion.div className="absolute inset-x-10 top-6 bottom-6 rounded-3xl"
          style={{ background: `repeating-linear-gradient(100deg, ${alpha(c, 0.1)} 0 8px, transparent 8px 18px)` }}
          animate={{ opacity: [0.5, 0.75, 0.5] }} transition={{ duration: 5, repeat: Infinity }} />;
      case 'aralik':
      case 'aralanma':
        return <motion.span className="absolute"
          style={{ background: `linear-gradient(90deg, transparent, ${alpha(c, 0.85)}, transparent)`, height: 260, filter: 'blur(2px)' }}
          animate={{ width: mod === 'aralik' ? [4, 22, 4] : [30, 200, 30], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: mod === 'aralik' ? 4 : 6, repeat: Infinity, ease: 'easeInOut' }} />;
      case 'damar':
        return Array.from({ length: 6 }, (_, i) => (
          <motion.span key={i} className="absolute"
            style={{
              width: 1.5, height: 120, background: `linear-gradient(180deg, transparent, ${c}, transparent)`,
              transformOrigin: 'center', transform: `rotate(${i * 30 - 75}deg)`,
            }}
            animate={{ opacity: [0, 0.85, 0], scaleY: [0.4, 1, 0.4] }}
            transition={{ duration: 3.2, delay: i * 0.28, repeat: Infinity }} />
        ));

      // ── Kırık / onarım ──
      case 'catlak':
      case 'sizinti':
      case 'altin':
      case 'butun': {
        const glow = mod === 'catlak' ? 0.12 : mod === 'sizinti' ? 0.45 : mod === 'altin' ? 0.95 : 0.7;
        return (
          <svg viewBox="0 0 200 200" style={{ width: 260, height: 260 }} aria-hidden>
            <motion.g animate={{ opacity: [glow * 0.7, glow, glow * 0.7] }} transition={{ duration: 3.4, repeat: Infinity }}>
              {[
                'M100 20 L88 70 L104 96 L84 140 L96 180',
                'M100 96 L150 78 L176 110',
                'M96 104 L48 122 L26 96',
                'M104 96 L128 148 L118 182',
              ].map((d, i) => (
                <motion.path key={i} d={d} fill="none" stroke={c} strokeWidth={mod === 'butun' ? 1 : 2}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 ${mod === 'altin' ? 8 : 4}px ${alpha(c, 0.9)})` }}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 2.2, delay: i * 0.25 }} />
              ))}
            </motion.g>
          </svg>
        );
      }

      // ── Damla / tekrar ──
      case 'damla':
      case 'ritim':
        return Array.from({ length: mod === 'damla' ? 1 : 4 }, (_, i) => (
          <motion.span key={i} className="absolute rounded-full"
            style={{ width: 7, height: 10, background: c, boxShadow: `0 0 12px ${alpha(c, 0.9)}` }}
            animate={{ y: [-110, 90], opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, delay: i * 0.9, repeat: Infinity, ease: 'easeIn' }} />
        ));
      case 'oyulma':
        return <><motion.span className="absolute rounded-full"
          style={{ border: `2px solid ${alpha(c, 0.6)}`, width: 70, height: 22 }}
          animate={{ scaleX: [0.6, 1.25, 0.6], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }} /><Zerre c={c} n={6} /></>;
      case 'kaynak':
        return <><Halka c={c} n={3} dur={4} /><Zerre c={c} n={16} /></>;

      // ── Terazi / niyet ──
      case 'terazi':
      case 'gizli':
      case 'agirlik':
      case 'sakin': {
        const tilt = mod === 'agirlik' ? -9 : mod === 'sakin' ? 0 : 5;
        return (
          <svg viewBox="0 0 200 140" style={{ width: 250 }} aria-hidden>
            <motion.g animate={{ rotate: tilt }} transition={{ duration: 1.6, ease: 'easeInOut' }}
              style={{ transformOrigin: '100px 40px' }}>
              <line x1="30" y1="40" x2="170" y2="40" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
              <path d="M30 40 L14 78 L46 78 Z" fill="none" stroke={c} strokeWidth="1.3" />
              <path d="M170 40 L154 78 L186 78 Z" fill="none" stroke={c} strokeWidth="1.3"
                opacity={mod === 'terazi' ? 0.35 : 1} />
              {(mod === 'gizli' || mod === 'agirlik' || mod === 'sakin') && (
                <motion.circle cx="170" cy="66" r="7" fill={c}
                  style={{ filter: `drop-shadow(0 0 10px ${alpha(c, 0.95)})` }}
                  animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.4, repeat: Infinity }} />
              )}
            </motion.g>
            <line x1="100" y1="14" x2="100" y2="40" stroke={c} strokeWidth="1.4" />
          </svg>
        );
      }

      // ── Çöl / kavuşma ──
      case 'col':
        return <motion.div className="absolute inset-x-6 h-24 rounded-full"
          style={{ background: `linear-gradient(180deg, ${alpha(c, 0.16)}, transparent)`, filter: 'blur(10px)' }}
          animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 6, repeat: Infinity }} />;
      case 'donus':
        return <motion.span className="absolute rounded-full"
          style={{ background: `radial-gradient(circle, ${alpha(c, 0.9)}, transparent 70%)` }}
          animate={{ width: [14, 90], height: [14, 90], opacity: [0.3, 0.9], y: [40, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeOut' }} />;
      case 'genisleme':
        return <Halka c={c} n={5} dur={3.6} from={0.15} to={3} />;

      // ── Yol / birikim ──
      case 'gerive':
      case 'zincir':
      case 'yol':
      case 'durak': {
        const n = 7;
        return (
          <div className="absolute flex items-center gap-3">
            {Array.from({ length: n }, (_, i) => (
              <motion.span key={i} className="rounded-full"
                style={{
                  width: 9, height: 9, background: c,
                  boxShadow: `0 0 ${mod === 'durak' ? 14 : 8}px ${alpha(c, 0.9)}`,
                }}
                animate={{
                  opacity: mod === 'gerive' ? [0.25, 0.9, 0.25] : [0.7, 1, 0.7],
                  scale: mod === 'durak' ? [1, 1.25, 1] : 1,
                }}
                transition={{ duration: 2.6, delay: i * 0.18, repeat: Infinity }} />
            ))}
            {(mod === 'zincir' || mod === 'yol' || mod === 'durak') && (
              <motion.span className="absolute h-px left-0 right-0"
                style={{ background: `linear-gradient(90deg, transparent, ${c}, ${mod === 'yol' ? 'transparent' : c})` }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6 }} />
            )}
          </div>
        );
      }

      default:
        return <motion.span className="absolute rounded-full"
          style={{ width: 170, height: 170, background: `radial-gradient(circle, ${alpha(c, 0.4)}, transparent 70%)` }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />;
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ height: 210 }} aria-hidden>
      <AnimatePresence mode="wait">
        <motion.div key={mod || 'default'}
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center">
          {content()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
