import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

// Floating particle component
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(25)].map((_, i) => {
        const size = i < 5 ? 3 : i < 12 ? 2 : 1;
        const isGold = i < 8;
        return (
          <div key={i} className="absolute rounded-full animate-twinkle"
            style={{
              width: size, height: size,
              background: isGold ? 'rgba(200,165,90,0.7)' : 'rgba(126,138,158,0.4)',
              top: `${5 + Math.random() * 88}%`,
              left: `${5 + Math.random() * 90}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
        );
      })}
    </div>
  );
}

// Animated crescent moon
function CrescentMoon() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative">
      {/* Radial glow behind moon */}
      <div className="absolute inset-0 -m-8"
        style={{
          background: 'radial-gradient(circle, rgba(200,165,90,0.15) 0%, transparent 65%)',
          filter: 'blur(8px)',
        }} />
      <svg width="100" height="100" viewBox="0 0 120 120" className="relative z-10 drop-shadow-lg">
        <defs>
          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0D87A" />
            <stop offset="40%" stopColor="#C8A55A" />
            <stop offset="100%" stopColor="#8C6D2A" />
          </linearGradient>
          <filter id="moonGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path d="M60 8 C30 8 8 30 8 60 C8 90 30 112 60 112 C42 100 32 82 32 60 C32 38 42 20 60 8Z"
          fill="url(#moonGrad)" filter="url(#moonGlow)" />
        <circle cx="72" cy="22" r="2.5" fill="#F0D87A" opacity="0.6" />
        <circle cx="82" cy="36" r="1.5" fill="#E0C47A" opacity="0.4" />
      </svg>
    </motion.div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();
  const { t } = useLang();
  const [guestLoading, setGuestLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) setGreeting(t.good_morning || 'Hayırlı Sabahlar');
    else if (h >= 12 && h < 17) setGreeting(t.good_afternoon || 'Hayırlı Günler');
    else if (h >= 17 && h < 21) setGreeting(t.good_evening || 'Hayırlı Akşamlar');
    else setGreeting(t.good_night || 'Hayırlı Geceler');
  }, [t]);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const redirectUrl = window.location.origin + '/';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      const user = await loginAsGuest();
      if (user) navigate('/', { replace: true });
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #0F1A2E 0%, #070D18 80%)' }}
      data-testid="login-page">

      <Particles />

      {/* Top section - visual */}
      <div className="flex-1 flex flex-col items-center justify-end pb-8 pt-16 relative z-10">
        <CrescentMoon />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mt-8">

          {/* Greeting */}
          <p className="text-xs tracking-[0.25em] uppercase mb-3"
            style={{ color: '#C8A55A' }}>
            {greeting}
          </p>

          {/* App Name */}
          <h1 className="text-3xl font-black tracking-wide mb-2"
            style={{ fontFamily: 'Playfair Display, serif', color: '#EBE5D8' }}>
            İslami Yaşam
          </h1>
          <h2 className="text-lg font-light tracking-[0.15em]"
            style={{ fontFamily: 'Playfair Display, serif', color: 'rgba(200,165,90,0.8)' }}>
            Asistanı
          </h2>

          {/* Decorative line */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(200,165,90,0.4))' }} />
            <span style={{ color: '#C8A55A', fontSize: '10px' }}>✦</span>
            <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(200,165,90,0.4))' }} />
          </div>
        </motion.div>
      </div>

      {/* Bottom section - actions */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 px-6 pb-10 pt-6">

        {/* Bismillah */}
        <p className="text-center text-xs tracking-wider mb-6"
          style={{ color: 'rgba(200,165,90,0.5)', fontFamily: 'Amiri, serif' }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>

        {/* Feature highlights - minimal */}
        <div className="flex justify-center gap-6 mb-8">
          {[
            { icon: '📖', label: t.feature_quran_short || "Kur'an" },
            { icon: '🕌', label: t.feature_prayer_short || 'Namaz' },
            { icon: '🤖', label: t.feature_ai_short || 'AI' },
            { icon: '📿', label: t.feature_dhikr_short || 'Zikir' },
          ].map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex flex-col items-center gap-1.5">
              <span className="text-xl">{f.icon}</span>
              <span className="text-[9px] tracking-wider uppercase font-medium"
                style={{ color: '#7E8A9E' }}>{f.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Login buttons */}
        <div className="max-w-sm mx-auto space-y-3">
          {/* Google Login */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading || guestLoading}
            data-testid="google-login-btn"
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #C8A55A 0%, #A08030 100%)',
              color: '#070D18',
              fontWeight: 700,
              fontSize: '15px',
              boxShadow: '0 6px 24px rgba(200,165,90,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}>
            {googleLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#070D18" fillOpacity="0.5" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#070D18" fillOpacity="0.5" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84z" fill="#070D18" fillOpacity="0.5" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#070D18" fillOpacity="0.5" />
              </svg>
            )}
            {googleLoading ? (t.redirecting || 'Yönlendiriliyor...') : (t.google_login || 'Google ile Giriş Yap')}
          </motion.button>

          {/* Guest Login */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGuestLogin}
            disabled={guestLoading || googleLoading}
            data-testid="guest-login-btn"
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-60"
            style={{
              background: 'rgba(200,165,90,0.06)',
              border: '1px solid rgba(200,165,90,0.15)',
              color: '#C8A55A',
              fontWeight: 600,
              fontSize: '15px',
            }}>
            {guestLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <User size={20} />
            )}
            {guestLoading ? (t.entering || 'Giriş yapılıyor...') : (t.guest_login || 'Misafir Olarak Devam Et')}
          </motion.button>
        </div>

        {/* Terms */}
        <p className="text-[10px] mt-6 text-center leading-relaxed" style={{ color: '#7E8A9E' }}>
          {t.login_terms || 'Giriş yaparak kullanım şartlarını kabul etmiş olursunuz'}
        </p>
      </motion.div>
    </div>
  );
}
