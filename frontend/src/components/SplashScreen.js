import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 80),
      setTimeout(() => setPhase(2), 250),
      setTimeout(() => setPhase(3), 500),
      setTimeout(() => setPhase(4), 700),
      setTimeout(() => onComplete(), 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 60%, #111D30 0%, #070D18 70%)' }}
      data-testid="splash-screen">

      {/* Radial light behind crescent */}
      <div className="absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(200,165,90,0.12) 0%, transparent 70%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1s ease',
        }} />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: i < 5 ? '3px' : i < 12 ? '2px' : '1px',
              height: i < 5 ? '3px' : i < 12 ? '2px' : '1px',
              background: i < 5 ? '#C8A55A' : '#7E8A9E',
              top: `${5 + Math.random() * 85}%`,
              left: `${5 + Math.random() * 90}%`,
              opacity: phase >= 2 ? (i < 5 ? 0.8 : 0.4) : 0,
              transition: `opacity 0.8s ease ${i * 0.08}s`,
              animation: phase >= 2 ? `twinkle ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite` : 'none',
            }} />
        ))}
      </div>

      {/* Crescent Moon — larger & more elegant */}
      <div style={{
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-30deg)',
        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <svg width="100" height="100" viewBox="0 0 100 100" className="animate-crescent">
          <defs>
            <linearGradient id="splashMoon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0C47A" />
              <stop offset="50%" stopColor="#C8A55A" />
              <stop offset="100%" stopColor="#9E8530" />
            </linearGradient>
          </defs>
          <path d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C35 85 28 68 28 50 C28 32 35 15 50 5Z" fill="url(#splashMoon)" />
          <circle cx="60" cy="18" r="2" fill="#E0C47A" opacity="0.6" />
        </svg>
      </div>

      {/* App name */}
      <h1 className="mt-8 text-3xl font-black tracking-wide"
        style={{
          fontFamily: 'Playfair Display, serif',
          color: '#EBE5D8',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}>
        İslami Yaşam Asistanı
      </h1>

      {/* Decorative line */}
      <div className="mt-4 flex items-center gap-3"
        style={{
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
        <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, #C8A55A)' }} />
        <span style={{ color: '#C8A55A', fontSize: '10px' }}>✦</span>
        <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, #C8A55A)' }} />
      </div>

      {/* Slogan */}
      <p className="mt-3 text-sm tracking-[0.25em] uppercase"
        style={{
          color: '#7E8A9E',
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s ease',
        }}>
        Bilgi ile iman yolculuğu
      </p>
    </div>
  );
}
