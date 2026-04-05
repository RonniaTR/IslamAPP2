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
    <div className="min-h-screen splash-bg flex flex-col items-center justify-center max-w-[430px] mx-auto px-6 relative overflow-hidden" data-testid="login-page">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-[#D4AF37] rounded-full animate-twinkle"
            style={{ top: `${15 + Math.random() * 40}%`, left: `${10 + Math.random() * 80}%`, animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>

      {/* Mosque silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-28 opacity-10 pointer-events-none">
        <svg viewBox="0 0 430 100" className="w-full h-full" fill="#D4AF37">
          <path d="M0,100 L0,70 L50,70 L50,40 L60,15 L70,40 L70,70 L150,70 L150,35 L160,10 L170,35 L170,70 L260,70 L260,40 L270,12 L280,40 L280,70 L360,70 L360,45 L370,20 L380,45 L380,70 L430,70 L430,100 Z" />
        </svg>
      </div>

      {/* Crescent Logo */}
      <div className="relative z-10 mb-8 animate-fade-in animate-float">
        <svg width="72" height="72" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="moonLogin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8C84A" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          <path d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C35 85 28 68 28 50 C28 32 35 15 50 5Z" fill="url(#moonLogin)" />
        </svg>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mb-10 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <h1 className="text-3xl font-bold text-[#F5F5DC] tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
          İslami Yaşam Asistanı
        </h1>
        <p className="text-[#D4AF37] text-sm mt-3 tracking-widest">{t.login_subtitle || 'Bilgi ile iman yolculuğu'}</p>
      </div>

      {/* Feature pills */}
      <div className="relative z-10 w-full space-y-2.5 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {[
          { icon: '\uD83D\uDCD6', text: t.feature_quran || "Kur'an-ı Kerim & Tefsir" },
          { icon: '\uD83D\uDD4C', text: t.feature_prayer || 'Namaz Vakitleri & Kıble' },
          { icon: '\u2728', text: t.feature_ramadan || 'Ramazan & Dua' },
        ].map((item, i) => (
          <div key={i} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-lg">{item.icon}</span>
            <span className="text-[#F5F5DC] text-sm font-medium">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="relative z-10 w-full space-y-3 animate-fade-in" style={{ animationDelay: '0.45s' }}>
        <button onClick={handleGoogleLogin} data-testid="google-login-btn"
          className="w-full flex items-center justify-center gap-3 bg-[#F5F5DC] hover:bg-[#E8E8C8] text-[#0A1F14] font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg active:scale-[0.98]">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {t.google_login || 'Google ile Giriş Yap'}
        </button>

        <button onClick={handleGuestLogin} data-testid="guest-login-btn"
          className="w-full flex items-center justify-center gap-3 border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 text-[#D4AF37] font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 active:scale-[0.98]">
          <User size={20} />
          {t.guest_login || 'Misafir Olarak Devam Et'}
        </button>
      </div>

      <p className="relative z-10 text-[#A8B5A0] text-xs mt-6 text-center">
        {t.login_terms || 'Giriş yaparak kullanım şartlarını kabul etmiş olursunuz'}
      </p>
    </div>
  );
}
