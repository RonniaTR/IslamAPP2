import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Globe, ChevronDown, Lock } from 'lucide-react';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../styles/designTokens';
import { useAppMode } from '../contexts/AppModeContext';
import { useLang } from '../contexts/LangContext';

export default function ModeSelector({ onComplete }) {
  const { setAppMode } = useAppMode();
  const { lang, setLang, LANGUAGES } = useLang();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setTimeout(() => {
      setAppMode(mode);
      onComplete(mode);
    }, 400);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B1120', // Koyu lacivert gece teması
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Yıldızlar ve Arka Plan Elementleri */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: i < 15 ? '2px' : '1px',
              height: i < 15 ? '2px' : '1px',
              borderRadius: '50%',
              background: i < 15 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + (i % 5)}s ease-in-out ${(i % 7) * 0.5}s infinite`,
            }}
          />
        ))}
        {/* Sol alt cami silüeti arka plan detayı */}
        <div style={{ position: 'absolute', bottom: -20, left: 0, right: 0, height: '200px', opacity: 0.1, background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23ffffff\' fill-opacity=\'1\' d=\'M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,202.7C672,213,768,235,864,245.3C960,256,1056,256,1152,240C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E") bottom/cover no-repeat' }} />
      </div>

      {/* Parlayan Ay sağ üst */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        style={{ position: 'absolute', top: '8%', right: '15%' }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M20 2 C10 2 2 10 2 20 C2 30 10 38 20 38 C15 34 12 28 12 20 C12 12 15 6 20 2Z" fill="#FDE047" opacity="0.8" filter="drop-shadow(0 0 10px rgba(253,224,71,0.5))" />
        </svg>
      </motion.div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', zIndex: 10 }}
      >
        <svg width="28" height="28" viewBox="0 0 40 40">
          <path d="M20 2 C10 2 2 10 2 20 C2 30 10 38 20 38 C15 34 12 28 12 20 C12 12 15 6 20 2Z" fill="#FDE047" />
          <circle cx="20" cy="20" r="18" fill="none" stroke="#FDE047" strokeWidth="1" opacity="0.3" />
        </svg>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', fontFamily: TYPOGRAPHY.fonts.body, letterSpacing: '0.02em' }}>
          IslamAPP
        </span>
      </motion.div>

      {/* Başlık */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ textAlign: 'center', marginBottom: '32px', zIndex: 10 }}
      >
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#FFFFFF',
          fontFamily: TYPOGRAPHY.fonts.body,
          marginBottom: '8px',
        }}>
          Hoş geldin!
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: TYPOGRAPHY.fonts.body,
        }}>
          Size en uygun deneyimi seçin
        </p>
      </motion.div>

      {/* Mod Kartları */}
      <div style={{ display: 'flex', gap: '16px', maxWidth: '440px', width: '100%', zIndex: 10 }}>
        {/* Yetişkin Modu */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeSelect('adult')}
          style={{
            flex: 1,
            padding: '24px 16px',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #112F2C 0%, #0B191B 100%)',
            border: selectedMode === 'adult' ? '2px solid #2DD4BF' : '1px solid rgba(255,255,255,0.05)',
            boxShadow: selectedMode === 'adult' ? '0 0 20px rgba(45,212,191,0.2)' : '0 8px 24px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            minHeight: '280px',
          }}
        >
          {/* İllüstrasyon Kutusu */}
          <div style={{
            width: '100%',
            aspectRatio: '1',
            background: 'linear-gradient(180deg, #1A4641 0%, #112F2C 100%)',
            borderRadius: '16px',
            borderRadius: '100px 100px 16px 16px', // Kemerli yapı
            border: '2px solid rgba(255,255,255,0.08)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Arka plan yıldızları */}
            <div style={{ position: 'absolute', top: '15%', right: '20%' }}>
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 1 C5 1 1 5 1 10 C1 15 5 19 10 19 C7 17 5 14 5 10 C5 6 7 3 10 1Z" fill="#FDE047" opacity="0.9"/></svg>
            </div>
            {/* Kabe İllüstrasyonu */}
            <div style={{
              width: '40%', height: '45%',
              background: '#1A1A1A',
              marginBottom: '10%',
              position: 'relative',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
            }}>
              <div style={{ position: 'absolute', top: '20%', width: '100%', height: '15%', background: '#C8A55A' }} />
              <div style={{ position: 'absolute', bottom: '0', width: '25%', height: '40%', right: '15%', border: '1px solid #C8A55A', borderBottom: 'none' }} />
            </div>
            {/* Sis/Glow */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%', background: 'linear-gradient(0deg, #112F2C 0%, transparent 100%)' }} />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px', fontFamily: TYPOGRAPHY.fonts.body }}>
            Yetişkin Modu
          </h3>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, marginBottom: '24px', padding: '0 4px', flex: 1 }}>
            İbadet takibi, öğrenme ve gelişim deneyimi
          </p>

          {/* Ok butonu */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '18px',
            background: '#1A4641', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 'auto',
          }}>
            <ChevronRight size={18} color="#2DD4BF" />
          </div>
        </motion.button>

        {/* Çocuk Modu */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleModeSelect('child')}
          style={{
            flex: 1,
            padding: '24px 16px',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #271439 0%, #150920 100%)',
            border: selectedMode === 'child' ? '2px solid #C084FC' : '1px solid rgba(255,255,255,0.05)',
            boxShadow: selectedMode === 'child' ? '0 0 20px rgba(192,132,252,0.2)' : '0 8px 24px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            minHeight: '280px',
          }}
        >
          {/* İllüstrasyon Kutusu */}
          <div style={{
            width: '100%',
            aspectRatio: '1',
            background: 'linear-gradient(180deg, #442461 0%, #271439 100%)',
            borderRadius: '100px 100px 16px 16px', // Kemerli yapı
            border: '2px solid rgba(255,255,255,0.08)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Yıldızlar */}
            <div style={{ position: 'absolute', top: '15%', left: '20%' }}>
              <svg width="14" height="14" viewBox="0 0 20 20"><path d="M10 0 L12 7 L20 7 L14 12 L16 20 L10 15 L4 20 L6 12 L0 7 L8 7 Z" fill="#FDE047" opacity="0.6"/></svg>
            </div>
            <div style={{ position: 'absolute', top: '30%', right: '25%' }}>
              <svg width="10" height="10" viewBox="0 0 20 20"><path d="M10 0 L12 7 L20 7 L14 12 L16 20 L10 15 L4 20 L6 12 L0 7 L8 7 Z" fill="#FDE047" opacity="0.8"/></svg>
            </div>
            {/* Çocuk Karakterler */}
            <div style={{ 
              fontSize: '48px', 
              display: 'flex', 
              gap: '0px', 
              marginBottom: '10%',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))'
            }}>
              <span style={{ transform: 'translateX(10px) rotate(-5deg)' }}>👦</span>
              <span style={{ transform: 'translateX(-10px) rotate(5deg) scale(0.9)', zIndex: 2 }}>👧</span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%', background: 'linear-gradient(0deg, #271439 0%, transparent 100%)' }} />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px', fontFamily: TYPOGRAPHY.fonts.body }}>
            Çocuk Modu
          </h3>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, marginBottom: '24px', padding: '0 4px', flex: 1 }}>
            Eğlenceli oyunlar, hikayeler ve öğrenme dünyası
          </p>

          {/* Ok butonu */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '18px',
            background: '#442461', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 'auto',
          }}>
            <ChevronRight size={18} color="#C084FC" />
          </div>
        </motion.button>
      </div>

      {/* Güvenlik notu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '32px',
          padding: '16px',
          borderRadius: RADIUS.lg,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          maxWidth: '440px',
          width: '100%',
          zIndex: 10,
        }}
      >
        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          <Lock size={16} color="rgba(255,255,255,0.4)" />
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
          Güvenli ve verilerin korunduğu bir ortam sağlıyoruz.<br />
          Dilediğin zaman mod değiştirebilirsin.
        </p>
      </motion.div>

      {/* Dil Seçici */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ marginTop: '32px', position: 'relative', zIndex: 10 }}
      >
        <button
          onClick={() => setShowLangDropdown(!showLangDropdown)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: RADIUS.full,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            fontSize: '12px',
          }}
        >
          <Globe size={14} />
          <span>Dil</span>
          <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginLeft: '4px' }}>
            {LANGUAGES.find(l => l.code === lang)?.name || 'Türkçe'}
          </span>
          <ChevronDown size={14} />
        </button>

        {showLangDropdown && (
          <div style={{
            position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
            background: '#111827', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: RADIUS.lg, padding: '8px', minWidth: '160px', zIndex: 20,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setShowLangDropdown(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: RADIUS.sm, width: '100%',
                  background: lang === l.code ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none', cursor: 'pointer', color: '#FFFFFF', fontSize: '13px',
                }}
              >
                <span>{l.flag}</span> <span>{l.name}</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
