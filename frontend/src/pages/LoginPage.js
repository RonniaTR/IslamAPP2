import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();
  const { t } = useLang();

  const handleGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleGuestLogin = async () => {
    const user = await loginAsGuest();
    if (user) navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #111D30 0%, #070D18 70%)' }}
      data-testid="login-page">

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,165,90,0.06) 0%, transparent 70%)' }} />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-twinkle"
            style={{
              width: i < 4 ? '2px' : '1px', height: i < 4 ? '2px' : '1px',
              background: i < 4 ? '#C8A55A' : '#7E8A9E',
              top: `${8 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
              animationDelay: `${i * 0.4}s`,
            }} />
        ))}
      </div>

      {/* Crescent Logo */}
      <div className="relative z-10 mb-10 animate-float">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="moonLogin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0C47A" />
              <stop offset="50%" stopColor="#C8A55A" />
              <stop offset="100%" stopColor="#9E8530" />
            </linearGradient>
          </defs>
          <path d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C35 85 28 68 28 50 C28 32 35 15 50 5Z" fill="url(#moonLogin)" />
          <circle cx="60" cy="18" r="2" fill="#E0C47A" opacity="0.5" />
        </svg>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-3xl font-black tracking-wide" style={{ fontFamily: 'Playfair Display, serif', color: '#EBE5D8' }}>
          İslami Yaşam Asistanı
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="w-10 h-px" style={{ background: 'linear-gradient(to right, transparent, #C8A55A)' }} />
          <span style={{ color: '#C8A55A', fontSize: '8px' }}>✦</span>
          <div className="w-10 h-px" style={{ background: 'linear-gradient(to left, transparent, #C8A55A)' }} />
        </div>
        <p className="text-sm mt-3 tracking-[0.2em] uppercase" style={{ color: '#7E8A9E' }}>
          {t.login_subtitle || 'Bilgi ile iman yolculuğu'}
        </p>
      </div>

      {/* Feature pills */}
      <div className="relative z-10 w-full max-w-sm space-y-2.5 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {[
          { icon: '📖', text: t.feature_quran || "Kur'an-ı Kerim & Tefsir" },
          { icon: '🕌', text: t.feature_prayer || 'Namaz Vakitleri & Kıble' },
          { icon: '✨', text: t.feature_ramadan || 'AI Asistan & Bilgi' },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl px-5 py-3.5 flex items-center gap-4"
            style={{
              background: 'rgba(17, 29, 48, 0.5)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(200, 165, 90, 0.06)',
            }}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium" style={{ color: '#EBE5D8' }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="relative z-10 w-full max-w-sm space-y-3 animate-fade-in" style={{ animationDelay: '0.35s' }}>
        <button onClick={handleGoogleLogin} data-testid="google-login-btn"
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all duration-300 active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, #C8A55A, #9E8530)',
            color: '#070D18',
            fontWeight: 700,
            fontSize: '15px',
            boxShadow: '0 8px 32px rgba(200,165,90,0.25)',
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#070D18" fillOpacity="0.6" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#070D18" fillOpacity="0.6" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84z" fill="#070D18" fillOpacity="0.6" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#070D18" fillOpacity="0.6" />
          </svg>
          {t.google_login || 'Google ile Giriş Yap'}
        </button>

        <button onClick={handleGuestLogin} data-testid="guest-login-btn"
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all duration-300 active:scale-[0.97]"
          style={{
            background: 'rgba(200, 165, 90, 0.08)',
            border: '1px solid rgba(200, 165, 90, 0.2)',
            color: '#C8A55A',
            fontWeight: 600,
            fontSize: '15px',
          }}>
          <User size={20} />
          {t.guest_login || 'Misafir Olarak Devam Et'}
        </button>
      </div>

      <p className="relative z-10 text-xs mt-8 text-center" style={{ color: '#7E8A9E' }}>
        {t.login_terms || 'Giriş yaparak kullanım şartlarını kabul etmiş olursunuz'}
      </p>
    </div>
  );
}
