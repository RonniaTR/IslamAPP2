import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 50),
      setTimeout(() => setPhase(2), 150),
      setTimeout(() => setPhase(3), 300),
      setTimeout(() => setPhase(4), 450),
      setTimeout(() => onComplete(), 700),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] splash-bg flex flex-col items-center justify-center max-w-[430px] mx-auto" data-testid="splash-screen">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
            style={{
              top: `${10 + Math.random() * 50}%`,
              left: `${10 + Math.random() * 80}%`,
              opacity: phase >= 2 ? 1 : 0,
              transition: `opacity 0.8s ease ${i * 0.1}s`,
              animation: phase >= 2 ? `twinkle ${1.5 + Math.random()}s ease-in-out ${Math.random()}s infinite` : 'none',
            }}
          />
        ))}
      </div>

      {/* Mosque silhouette at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          opacity: phase >= 2 ? 0.15 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <svg viewBox="0 0 430 120" className="w-full h-full" fill="#D4AF37">
          <path d="M0,120 L0,90 L30,90 L30,60 L35,40 L40,60 L40,90 L70,90 L70,70 L80,50 L90,70 L90,90 L130,90 L130,50 L140,20 L150,50 L150,90 L190,90 L190,80 L200,60 L205,30 L210,60 L220,80 L220,90 L260,90 L260,55 L270,25 L275,10 L280,25 L290,55 L290,90 L330,90 L330,70 L340,50 L350,70 L350,90 L380,90 L380,60 L385,40 L390,60 L390,90 L430,90 L430,120 Z" opacity="0.6" />
          <rect x="138" y="10" width="4" height="80" opacity="0.4" />
          <circle cx="140" cy="8" r="3" opacity="0.5" />
          <rect x="273" y="5" width="4" height="85" opacity="0.4" />
          <circle cx="275" cy="3" r="3" opacity="0.5" />
        </svg>
      </div>

      {/* Crescent Moon */}
      <div
        className="relative mb-6"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg width="80" height="80" viewBox="0 0 100 100" className="animate-crescent">
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8C84A" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          <path d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C35 85 28 68 28 50 C28 32 35 15 50 5Z" fill="url(#moonGrad)" />
        </svg>
      </div>

      {/* App title */}
      <h1
        className="text-2xl font-bold text-[#F5F5DC] tracking-wide mb-2"
        style={{
          fontFamily: 'Playfair Display, serif',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}
      >
        İslami Yaşam Asistanı
      </h1>

      {/* Slogan */}
      <p
        className="text-sm tracking-widest"
        style={{
          color: '#D4AF37',
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.6s ease',
        }}
      >
        Bilgi ile iman yolculuğu
      </p>
    </div>
  );
}
