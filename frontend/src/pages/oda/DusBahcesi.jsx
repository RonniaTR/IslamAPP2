import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 🌸 ŞAKAYIK ÇİÇEĞİ (Paeonia) — Melike'nin en sevdiği çiçek.
// Katmerli taç yaprakları, altın polen kalbi ve yapraklarıyla saf SVG şakayık.
export function Sakayik({ size = 44, glow = true, pulse = false }) {
  const outer = [0, 45, 90, 135, 180, 225, 270, 315];
  const mid = [22, 82, 142, 202, 262, 322];
  const inner = [0, 72, 144, 216, 288];
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      animate={pulse ? { scale: [1, 1.07, 1], rotate: [-2, 2, -2] } : undefined}
      transition={pulse ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        filter: glow ? 'drop-shadow(0 4px 14px rgba(247,168,184,0.45))' : undefined,
      }}
    >
      <defs>
        <radialGradient id="peonyOuter" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFD6E2" />
          <stop offset="65%" stopColor="#F48FB1" />
          <stop offset="100%" stopColor="#C94A72" />
        </radialGradient>
        <radialGradient id="peonyMid" cx="50%" cy="45%" r="58%">
          <stop offset="0%" stopColor="#FFF0F5" />
          <stop offset="60%" stopColor="#F8A8BE" />
          <stop offset="100%" stopColor="#E0638B" />
        </radialGradient>
        <radialGradient id="peonyInner" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#FFF8FA" />
          <stop offset="70%" stopColor="#FFC4D4" />
          <stop offset="100%" stopColor="#F2849E" />
        </radialGradient>
      </defs>
      {/* Yapraklar */}
      <path d="M18 68 Q6 50 26 42 Q32 56 18 68 Z" fill="#1E4D3B" opacity="0.9" />
      <path d="M82 68 Q94 50 74 42 Q68 56 82 68 Z" fill="#1E4D3B" opacity="0.9" />
      <path d="M28 84 Q14 78 18 62 Q34 68 28 84 Z" fill="#28644C" opacity="0.85" />
      <path d="M72 84 Q86 78 82 62 Q66 68 72 84 Z" fill="#28644C" opacity="0.85" />
      {/* Dış katmerli taç yapraklar */}
      {outer.map((deg) => (
        <g key={`o-${deg}`} transform={`rotate(${deg} 50 50)`}>
          <path
            d="M50 50 C34 36, 32 14, 50 11 C68 14, 66 36, 50 50 Z"
            fill="url(#peonyOuter)"
            stroke="#FDE4EC"
            strokeWidth="0.6"
            strokeOpacity="0.45"
          />
        </g>
      ))}
      {/* Orta katmerli taç yapraklar */}
      {mid.map((deg) => (
        <g key={`m-${deg}`} transform={`rotate(${deg} 50 50)`}>
          <path
            d="M50 50 C37 39, 36 21, 50 18 C64 21, 63 39, 50 50 Z"
            fill="url(#peonyMid)"
            stroke="#FFF0F5"
            strokeWidth="0.7"
            strokeOpacity="0.6"
          />
        </g>
      ))}
      {/* İç kıvrımlı şakayık yaprakları */}
      {inner.map((deg) => (
        <g key={`i-${deg}`} transform={`rotate(${deg} 50 50)`}>
          <path
            d="M50 50 C41 42, 40 28, 50 26 C60 28, 59 42, 50 50 Z"
            fill="url(#peonyInner)"
          />
        </g>
      ))}
      {/* Altın şakayık kalbi */}
      <circle cx="50" cy="50" r="8.5" fill="#FFE3A3" />
      <circle cx="50" cy="50" r="5.5" fill="#F2B860" />
      {[0, 60, 120, 180, 240, 300].map((d) => {
        const rad = (d * Math.PI) / 180;
        return (
          <circle
            key={`s-${d}`}
            cx={50 + Math.cos(rad) * 7}
            cy={50 + Math.sin(rad) * 7}
            r="1.4"
            fill="#FFF8E1"
          />
        );
      })}
    </motion.svg>
  );
}

// 🌙 DÜŞ BAHÇESİ — gece bahçesi, ateş böcekleri, şakayık çiçekleri ve iki fener.
export function Backdrop({ dim = false }) {
  const flies = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        x: (i * 41) % 100,
        y: 26 + ((i * 29) % 68),
        d: 5 + (i % 6),
        dl: (i * 0.37) % 4,
      })),
    []
  );

  // Bahçedeki şakayık çiçekleri
  const peonies = [
    [48, 256, 0.95, 0],
    [82, 266, 0.75, 0.8],
    [136, 258, 0.85, 1.4],
    [265, 254, 1.0, 0.4],
    [308, 264, 0.8, 1.1],
    [348, 252, 0.92, 1.9],
  ];

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 70% 10%, #2B2462 0%, #120F2E 45%, #07060F 100%)',
        transition: 'opacity .8s',
        opacity: dim ? 0.55 : 1,
      }}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        {Array.from({ length: 40 }, (_, i) => (
          <motion.circle
            key={i}
            cx={(i * 53) % 400}
            cy={(i * 31) % 150}
            r={0.5 + (i % 3) * 0.4}
            fill="#FFF6E0"
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: i * 0.11 }}
          />
        ))}
        <circle cx="318" cy="48" r="18" fill="#FFF1C9" />
        <circle cx="326" cy="42" r="16" fill="#1A163F" />
        <path d="M0 250 Q60 228 120 240 T240 236 T400 232 V300 H0 Z" fill="#0C1A1A" />
        <path d="M0 270 Q100 250 200 266 T400 258 V300 H0 Z" fill="#081211" />
        {[[26, 238, 1.15], [102, 243, 0.85], [354, 232, 1.25], [384, 240, 0.8]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x="-2" y="-10" width="4" height="14" fill="#0E1F1C" />
            <circle cx="0" cy="-18" r="12" fill="#10251F" />
            <circle cx="-8" cy="-12" r="8" fill="#10251F" />
            <circle cx="8" cy="-12" r="8" fill="#10251F" />
          </g>
        ))}
        {/* Gece rüzgârında salınan şakayıklar */}
        {peonies.map(([x, y, sc, dl], i) => (
          <motion.g
            key={`p-${i}`}
            animate={{ rotate: [-3.5, 3.5, -3.5] }}
            transition={{ duration: 4.2 + (i % 3), repeat: Infinity, delay: dl, ease: 'easeInOut' }}
            style={{ transformOrigin: `${x}px ${y + 24}px` }}
          >
            <path d={`M${x} ${y + 24} Q${x + 2} ${y + 12} ${x} ${y}`} stroke="#1F4D3D" strokeWidth="1.6" fill="none" />
            <ellipse cx={x - 4} cy={y + 11} rx="4.5" ry="2.2" transform={`rotate(-28 ${x - 4} ${y + 11})`} fill="#245A47" />
            <ellipse cx={x + 4} cy={y + 13} rx="4.5" ry="2.2" transform={`rotate(28 ${x + 4} ${y + 13})`} fill="#245A47" />
            <g transform={`translate(${x} ${y}) scale(${sc})`}>
              <circle cx="0" cy="0" r="7.5" fill="#D85B84" opacity="0.92" />
              <circle cx="-3" cy="-2" r="5.2" fill="#F48FB1" />
              <circle cx="3" cy="-2" r="5.2" fill="#F48FB1" />
              <circle cx="0" cy="3" r="5.2" fill="#F7A8B8" />
              <circle cx="0" cy="-3" r="4.6" fill="#FFC1D3" />
              <circle cx="-2" cy="1" r="3.6" fill="#FFE4EC" />
              <circle cx="2" cy="1" r="3.6" fill="#FFE4EC" />
              <circle cx="0" cy="0" r="2.1" fill="#FFE3A3" />
            </g>
          </motion.g>
        ))}
      </svg>
      {flies.map((f, i) => (
        <motion.span
          key={i}
          animate={{ x: [0, 18, -10, 0], y: [0, -14, 8, 0], opacity: [0, 1, 0.6, 0] }}
          transition={{ duration: f.d, repeat: Infinity, delay: f.dl }}
          style={{
            position: 'absolute',
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: 5,
            height: 5,
            borderRadius: 3,
            background: '#FFE89A',
            boxShadow: '0 0 10px 3px rgba(255,232,154,0.7)',
          }}
        />
      ))}
    </div>
  );
}

function Lantern({ lit, name, side, micOn, level = 0 }) {
  const speaking = micOn && level > 0.06;
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        width: 'clamp(74px, 22vw, 108px)',
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {speaking && (
          <motion.span
            aria-hidden
            animate={{ scale: [1, 1.25 + level * 0.35, 1], opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{
              position: 'absolute',
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(247,168,184,0.55) 0%, rgba(255,210,122,0.25) 55%, transparent 75%)',
              border: '1.5px solid rgba(247,168,184,0.7)',
              pointerEvents: 'none',
            }}
          />
        )}
        <motion.svg
          width="42"
          height="58"
          viewBox="0 0 46 64"
          animate={lit ? { y: [0, -3, 0] } : { y: 0 }}
          transition={{ duration: 3, repeat: Infinity, delay: side === 'r' ? 1.2 : 0 }}
        >
          <path d="M23 2 v8" stroke="#8A7B5A" strokeWidth="2" />
          <rect x="9" y="10" width="28" height="6" rx="3" fill="#8A7B5A" />
          <path
            d="M11 16 Q6 34 11 52 H35 Q40 34 35 16 Z"
            fill={lit ? '#FFD27A' : '#2A2742'}
            stroke={speaking ? '#F7A8B8' : '#8A7B5A'}
            strokeWidth={speaking ? '2.5' : '2'}
            style={{ transition: 'fill .8s' }}
          />
          {lit && (
            <motion.ellipse
              cx="23"
              cy="36"
              rx="5"
              ry="8"
              fill="#FFF6D8"
              animate={{ scaleY: [1, 1.18, 0.92, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{ transformOrigin: '23px 44px', transformBox: 'view-box' }}
            />
          )}
          <rect x="9" y="52" width="28" height="6" rx="3" fill="#8A7B5A" />
        </motion.svg>
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: lit ? '#FFE9B8' : '#7C7896',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          transition: 'color .8s',
        }}
      >
        {name}
      </span>
      {micOn && (
        <span
          style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 99,
            background: speaking ? 'rgba(247,168,184,0.28)' : 'rgba(159,227,200,0.16)',
            color: speaking ? '#FFD6E2' : '#9FE3C8',
            border: `1px solid ${speaking ? 'rgba(247,168,184,0.5)' : 'rgba(159,227,200,0.3)'}`,
            whiteSpace: 'nowrap',
          }}
        >
          {speaking ? '🎤 Konuşuyor' : '🎤 Açık'}
        </span>
      )}
      {lit && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            width: 110,
            height: 110,
            borderRadius: 55,
            marginTop: -24,
            background: 'radial-gradient(circle, rgba(255,210,122,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

/** Üst şerit: iki fener, aralarındaki ışık ipi ve ortada açan şakayık. */
export function Lanterns({ benim, onun, onunVar, bagli, durum, myMic = false, peerMic = false, myLevel = 0, peerLevel = 0 }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 6,
        width: '100%',
      }}
    >
      <Lantern lit name={benim} side="l" micOn={myMic} level={myLevel} />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          position: 'relative',
          height: 68,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="100%"
          height="38"
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          aria-hidden
          style={{ position: 'absolute', inset: 0, top: 6 }}
        >
          <path d="M0 18 Q100 44 200 18" fill="none" stroke="#3A3658" strokeWidth="1.5" strokeDasharray="3 5" />
          <motion.path
            d="M0 18 Q100 44 200 18"
            fill="none"
            stroke="#FFD27A"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: bagli ? 1 : 0, opacity: bagli ? 1 : 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 4px #FFD27A)' }}
          />
        </svg>
        <div style={{ position: 'relative', zIndex: 2, marginTop: 4 }}>
          <Sakayik size={bagli ? 30 : 24} glow={bagli} pulse={bagli} />
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={durum}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: 11,
              color: bagli ? '#FFE9B8' : '#9C98B8',
              letterSpacing: 0.6,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
              marginTop: 2,
            }}
          >
            {durum}
          </motion.span>
        </AnimatePresence>
      </div>
      <Lantern lit={onunVar} name={onun} side="r" micOn={peerMic} level={peerLevel} />
    </div>
  );
}

/** Uçan kalpler ve şakayık çiçekleri (her iki taraftan). */
export function Hearts({ list }) {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 55, overflow: 'hidden' }}>
      <AnimatePresence>
        {list.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 0, scale: 0.5, rotate: -10 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -340,
              x: h.dx,
              scale: h.e === 'peony' ? [0.5, 1.25, 1.1] : [0.6, 1.2, 1],
              rotate: h.e === 'peony' ? [-12, 14, -8, 10] : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: h.e === 'peony' ? 3.4 : 2.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 100,
              [h.mine ? 'left' : 'right']: `${14 + (h.id % 6) * 5}%`,
              fontSize: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {h.e === 'peony' ? (
              <>
                <Sakayik size={52} glow pulse={false} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#FFD6E2',
                    background: 'rgba(26,18,48,0.75)',
                    padding: '2px 8px',
                    borderRadius: 99,
                    border: '1px solid rgba(247,168,184,0.35)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Şakayık 🌸
                </span>
              </>
            ) : (
              <span>{h.e}</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
