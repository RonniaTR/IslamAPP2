import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Globe, Moon, Sun, Monitor, Bell } from 'lucide-react';
import { ONBOARDING_PAGES, COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../styles/designTokens';
import { useAppMode } from '../contexts/AppModeContext';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';

// ─── Onboarding Sayfa Bileşeni ───
function OnboardingPage({ page, index, total }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '40px',
          background: `${page.color}12`,
          border: `2px solid ${page.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '56px',
          marginBottom: '32px',
          boxShadow: `0 8px 32px ${page.color}15`,
        }}
      >
        {page.icon}
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: '28px',
          fontWeight: 800,
          fontFamily: TYPOGRAPHY.fonts.heading,
          color: '#1A1A1A',
          marginBottom: '12px',
        }}
      >
        {page.title}
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: '15px',
          lineHeight: 1.7,
          color: '#6B7280',
          maxWidth: '320px',
          fontFamily: TYPOGRAPHY.fonts.body,
        }}
      >
        {page.desc}
      </p>
    </motion.div>
  );
}

// ─── Dil Seçimi ───
function LanguageStep({ onNext }) {
  const { lang, setLang, LANGUAGES } = useLang();
  const allLanguages = [
    ...LANGUAGES,
    { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩', dir: 'ltr' },
    { code: 'ms', name: 'Malay', flag: '🇲🇾', dir: 'ltr' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      style={{ padding: '40px 24px', minHeight: '60vh' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            width: '64px', height: '64px', borderRadius: '20px',
            background: '#0D5C2F12', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Globe size={32} color="#0D5C2F" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: TYPOGRAPHY.fonts.heading, color: '#1A1A1A' }}>
          Dil Seçimi
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>Uygulamayı hangi dilde kullanmak istersin?</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
        {allLanguages.map((l) => (
          <button
            key={l.code}
            onClick={() => { setLang(l.code); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px', borderRadius: RADIUS.lg,
              background: lang === l.code ? '#0D5C2F' : '#FFFFFF',
              border: `2px solid ${lang === l.code ? '#0D5C2F' : '#E5E7EB'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '24px' }}>{l.flag}</span>
            <span style={{
              fontSize: '14px', fontWeight: 600,
              color: lang === l.code ? '#FFFFFF' : '#1A1A1A',
              fontFamily: TYPOGRAPHY.fonts.body,
            }}>{l.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Tema Seçimi ───
function ThemeStep() {
  const { themeId, setTheme } = useTheme();
  const themeOptions = [
    { id: 'light', name: 'Aydınlık', icon: <Sun size={28} />, desc: 'Açık ve temiz', bg: '#FFFFFF', border: '#E5E7EB' },
    { id: 'dark', name: 'Koyu', icon: <Moon size={28} />, desc: 'Göze nazik', bg: '#111D30', border: '#1A2940' },
    { id: 'system', name: 'Sistem', icon: <Monitor size={28} />, desc: 'Otomatik', bg: 'linear-gradient(135deg, #FFFFFF 50%, #111D30 50%)', border: '#D1D5DB' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      style={{ padding: '40px 24px', minHeight: '60vh' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: TYPOGRAPHY.fonts.heading, color: '#1A1A1A' }}>
          Tema Seçimi
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>Görünümünü seç</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
        {themeOptions.map((t) => {
          const active = themeId === t.id || (t.id === 'system' && themeId === 'light');
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id === 'system' ? 'light' : t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px', borderRadius: RADIUS.xl,
                background: active ? '#0D5C2F08' : '#FFFFFF',
                border: `2px solid ${active ? '#0D5C2F' : '#E5E7EB'}`,
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: t.bg, border: `1px solid ${t.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: t.id === 'dark' ? '#C8A55A' : '#0D5C2F',
              }}>
                {t.icon}
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>{t.name}</p>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>{t.desc}</p>
              </div>
              {active && (
                <div style={{ marginLeft: 'auto', width: '24px', height: '24px', borderRadius: '12px', background: '#0D5C2F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Bildirim Ayarları ───
function NotificationStep() {
  const [prefs, setPrefs] = useState({ prayer: true, dua: true, reminder: true, tasks: false });

  const togglePref = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  const items = [
    { key: 'prayer', label: 'Namaz Vakitleri', desc: 'Her vakit öncesi hatırlatma', icon: '🕌' },
    { key: 'dua', label: 'Günlük Dua', desc: 'Sabah ve akşam duaları', icon: '🤲' },
    { key: 'reminder', label: 'Hatırlatıcılar', desc: 'Özel hatırlatmalar', icon: '🔔' },
    { key: 'tasks', label: 'Görevler', desc: 'Günlük görev bildirimleri', icon: '✅' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      style={{ padding: '40px 24px', minHeight: '60vh' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '20px',
          background: '#F59E0B12', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <Bell size={32} color="#F59E0B" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: TYPOGRAPHY.fonts.heading, color: '#1A1A1A' }}>
          Bildirimler
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>Hangi bildirimleri almak istersin?</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
        {items.map(({ key, label, desc, icon }) => (
          <button
            key={key}
            onClick={() => togglePref(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 20px', borderRadius: RADIUS.lg,
              background: '#FFFFFF', border: '1px solid #E5E7EB',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '24px' }}>{icon}</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>{label}</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{desc}</p>
            </div>
            {/* Toggle */}
            <div style={{
              width: '48px', height: '28px', borderRadius: '14px',
              background: prefs[key] ? '#0D5C2F' : '#D1D5DB',
              padding: '2px', transition: 'background 0.2s ease',
              display: 'flex', alignItems: prefs[key] ? 'center' : 'center',
              justifyContent: prefs[key] ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '12px',
                background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
              }} />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Ana Onboarding Bileşeni ───
export default function OnboardingScreen({ onComplete }) {
  const [currentPage, setCurrentPage] = useState(0);
  const { completeOnboarding } = useAppMode();

  // Toplam adımlar: 10 onboarding + dil + tema + bildirim = 13
  const totalSteps = ONBOARDING_PAGES.length + 3;
  const isOnboardingPage = currentPage < ONBOARDING_PAGES.length;
  const isLanguagePage = currentPage === ONBOARDING_PAGES.length;
  const isThemePage = currentPage === ONBOARDING_PAGES.length + 1;
  const isNotificationPage = currentPage === ONBOARDING_PAGES.length + 2;

  const handleNext = () => {
    if (currentPage < totalSteps - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      completeOnboarding();
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleSkip = () => {
    completeOnboarding();
    onComplete();
  };

  const isLastPage = currentPage === totalSteps - 1;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F5F5F0',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '520px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        {currentPage > 0 ? (
          <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px', color: '#6B7280', fontSize: '14px' }}>
            <ChevronLeft size={20} /> Geri
          </button>
        ) : <div />}
        <button onClick={handleSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0D5C2F', fontSize: '14px', fontWeight: 600, padding: '8px 12px' }}>
          Atla
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {isOnboardingPage && (
            <OnboardingPage
              key={`onboarding-${currentPage}`}
              page={ONBOARDING_PAGES[currentPage]}
              index={currentPage}
              total={ONBOARDING_PAGES.length}
            />
          )}
          {isLanguagePage && <LanguageStep key="language" onNext={handleNext} />}
          {isThemePage && <ThemeStep key="theme" />}
          {isNotificationPage && <NotificationStep key="notification" />}
        </AnimatePresence>
      </div>

      {/* Bottom — Dot indicators + Button */}
      <div style={{ padding: '24px 32px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentPage ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === currentPage ? '#0D5C2F' : i < currentPage ? '#0D5C2F60' : '#D1D5DB',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Next/Complete Button */}
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            maxWidth: '360px',
            padding: '18px',
            borderRadius: RADIUS.xl,
            background: isLastPage
              ? 'linear-gradient(135deg, #0D5C2F 0%, #1A7A42 100%)'
              : '#0D5C2F',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: TYPOGRAPHY.fonts.body,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isLastPage ? '0 8px 32px rgba(13,92,47,0.3)' : SHADOWS.md,
            transition: 'all 0.2s ease',
          }}
        >
          {isLastPage ? (
            <><span>Başlayalım</span> <span style={{ fontSize: '20px' }}>✨</span></>
          ) : (
            <><span>Devam Et</span> <ChevronRight size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
}
