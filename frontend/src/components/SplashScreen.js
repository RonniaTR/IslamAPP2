import React, { useState, useEffect } from 'react';
import { COLORS, TYPOGRAPHY } from '../styles/designTokens';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 400),
      setTimeout(() => setPhase(3), 800),
      setTimeout(() => setPhase(4), 1200),
      setTimeout(() => setPhase(5), 1600),
      setTimeout(() => onComplete(), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #064420 0%, #0D5C2F 40%, #032212 100%)',
      }}
      data-testid="splash-screen"
    >
      {/* Radial glow behind moon */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,165,90,0.15) 0%, rgba(200,165,90,0.05) 40%, transparent 70%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      />

      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: i < 8 ? '3px' : i < 18 ? '2px' : '1px',
              height: i < 8 ? '3px' : i < 18 ? '2px' : '1px',
              borderRadius: '50%',
              background: i < 8 ? '#C8A55A' : 'rgba(255,255,255,0.5)',
              top: `${5 + Math.sin(i * 7.3) * 45 + 45}%`,
              left: `${5 + Math.cos(i * 5.1) * 45 + 45}%`,
              opacity: phase >= 2 ? (i < 8 ? 0.9 : 0.4) : 0,
              transition: `opacity 0.8s ease ${i * 0.06}s`,
              animation: phase >= 2 ? `twinkle ${2 + (i % 3)}s ease-in-out ${(i % 5) * 0.4}s infinite` : 'none',
            }}
          />
        ))}
      </div>

      {/* Decorative Islamic pattern circle */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          border: '1px solid rgba(200,165,90,0.08)',
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 1.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '1px solid rgba(200,165,90,0.05)',
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'scale(1) rotate(45deg)' : 'scale(0.5) rotate(0deg)',
          transition: 'all 1.8s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Crescent Moon */}
      <div
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-30deg)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
          filter: phase >= 3 ? 'drop-shadow(0 0 30px rgba(200,165,90,0.3))' : 'none',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="splashMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0C47A" />
              <stop offset="50%" stopColor="#C8A55A" />
              <stop offset="100%" stopColor="#9E8530" />
            </linearGradient>
          </defs>
          <path
            d="M60 6 C30 6 6 30 6 60 C6 90 30 114 60 114 C42 102 33 82 33 60 C33 38 42 18 60 6Z"
            fill="url(#splashMoonGrad)"
          />
          <circle cx="72" cy="20" r="2.5" fill="#E0C47A" opacity="0.7" />
          <circle cx="85" cy="35" r="1.5" fill="#E0C47A" opacity="0.5" />
        </svg>
      </div>

      {/* App Name - NUR */}
      <h1
        style={{
          marginTop: '32px',
          fontSize: '48px',
          fontWeight: 900,
          letterSpacing: '0.15em',
          fontFamily: TYPOGRAPHY.fonts.heading,
          color: '#EBE5D8',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
          textShadow: '0 2px 20px rgba(200,165,90,0.3)',
        }}
      >
        NUR
      </h1>

      {/* Decorative line */}
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <div style={{ width: '48px', height: '1px', background: 'linear-gradient(to right, transparent, #C8A55A)' }} />
        <span style={{ color: '#C8A55A', fontSize: '10px' }}>✦</span>
        <div style={{ width: '48px', height: '1px', background: 'linear-gradient(to left, transparent, #C8A55A)' }} />
      </div>

      {/* Subtitle */}
      <p
        style={{
          marginTop: '12px',
          fontSize: '13px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontFamily: TYPOGRAPHY.fonts.body,
          color: 'rgba(200,165,90,0.7)',
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s ease',
        }}
      >
        Hayatına Nur Kat
      </p>

      {/* Bottom tagline */}
      <p
        style={{
          position: 'absolute',
          bottom: '60px',
          fontSize: '11px',
          letterSpacing: '0.15em',
          fontFamily: TYPOGRAPHY.fonts.body,
          color: 'rgba(255,255,255,0.25)',
          opacity: phase >= 5 ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        Kur'an · Dua · İlim · Hikayeler
      </p>

      {/* Loading bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          width: '120px',
          height: '2px',
          borderRadius: '1px',
          background: 'rgba(200,165,90,0.1)',
          overflow: 'hidden',
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <div
          style={{
            width: phase >= 5 ? '100%' : '0%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #C8A55A)',
            borderRadius: '1px',
            transition: 'width 0.8s ease',
          }}
        />
      </div>
    </div>
  );
}
