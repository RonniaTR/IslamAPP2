import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, UserPlus, Shield } from 'lucide-react';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';
import { useAppMode } from '../../contexts/AppModeContext';

export default function KidsWelcome({ onComplete }) {
  const { childProfiles, setActiveChildProfile, setAppMode } = useAppMode();
  const [step, setStep] = useState(1); // 1: Welcome, 2: Profile Selection

  const handleProfileSelect = (profile) => {
    setActiveChildProfile(profile);
    onComplete();
  };

  const handleAddNew = () => {
    // In a real app, this would open a "Create Profile" modal.
    // For now, let's just create a mock new profile.
    const newProfile = {
      id: `child_${Date.now()}`,
      name: 'Yeni Çocuk',
      avatar: '🧒',
      level: 1,
      xp: 0,
      color: '#F59E0B'
    };
    handleProfileSelect(newProfile);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF', // Beyaz arka plan
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {/* Header / Kapat butonu */}
            <div style={{ padding: '24px 20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setAppMode(null)}
                style={{
                  width: '40px', height: '40px', borderRadius: '20px',
                  background: '#F3F4F6', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={20} color="#4B5563" />
              </button>
            </div>

            {/* Metin Alanı */}
            <div style={{ textAlign: 'center', padding: '0 24px', marginTop: '20px' }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#1F2937',
                fontFamily: TYPOGRAPHY.fonts.kids,
                lineHeight: 1.2,
                marginBottom: '12px'
              }}>
                Çocuk Moduna<br />Hoş Geldin!
              </h1>
              <p style={{
                fontSize: '15px',
                color: '#6B7280',
                fontFamily: TYPOGRAPHY.fonts.kids,
                lineHeight: 1.5,
              }}>
                Eğlenerek öğren, güzel alışkanlıklar kazan!
              </p>
            </div>

            {/* İllüstrasyon (Mockup için CSS tabanlı) */}
            <div style={{ flex: 1, position: 'relative', marginTop: '40px' }}>
              {/* Arka plan gökyüzü/camiler */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
                background: 'linear-gradient(180deg, rgba(236,253,245,0) 0%, #D1FAE5 100%)',
                zIndex: 0
              }} />
              {/* Tepeler */}
              <div style={{
                position: 'absolute', bottom: '0', left: '-10%', right: '-10%', height: '30%',
                background: '#34D399', borderRadius: '50% 50% 0 0', zIndex: 1
              }} />
              <div style={{
                position: 'absolute', bottom: '0', left: '-20%', width: '70%', height: '40%',
                background: '#10B981', borderRadius: '50% 50% 0 0', zIndex: 1
              }} />
              
              {/* Karakter */}
              <div style={{
                position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)',
                fontSize: '160px', zIndex: 2, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))'
              }}>
                👦
              </div>
            </div>

            {/* Buton */}
            <div style={{ padding: '24px', position: 'relative', zIndex: 10, background: '#10B981' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                style={{
                  width: '100%',
                  padding: '20px',
                  borderRadius: RADIUS.full,
                  background: '#FFFFFF',
                  border: 'none',
                  color: '#10B981',
                  fontSize: '18px',
                  fontWeight: 800,
                  fontFamily: TYPOGRAPHY.fonts.kids,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              >
                Hadi Başlayalım
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#1F2937',
                fontFamily: TYPOGRAPHY.fonts.kids,
              }}>
                Profilini Seç
              </h1>
              <button
                onClick={() => setAppMode(null)}
                style={{
                  width: '40px', height: '40px', borderRadius: '20px',
                  background: '#F3F4F6', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={20} color="#4B5563" />
              </button>
            </div>

            <p style={{
              fontSize: '15px',
              color: '#6B7280',
              fontFamily: TYPOGRAPHY.fonts.kids,
              marginBottom: '40px',
            }}>
              Kendi profilini seç veya yeni bir profil oluştur.
            </p>

            {/* Profiller Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px 16px',
            }}>
              {childProfiles.map((profile) => (
                <motion.button
                  key={profile.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleProfileSelect(profile)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: '90px', height: '90px', borderRadius: '45px',
                    background: `${profile.color}15`,
                    border: `3px solid ${profile.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '48px',
                    boxShadow: `0 8px 24px ${profile.color}30`,
                  }}>
                    {profile.avatar}
                  </div>
                  <span style={{
                    fontSize: '16px', fontWeight: 700, color: '#374151', fontFamily: TYPOGRAPHY.fonts.kids
                  }}>
                    {profile.name}
                  </span>
                </motion.button>
              ))}

              {/* Ekle Butonu */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddNew}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '90px', height: '90px', borderRadius: '45px',
                  background: '#F3F4F6',
                  border: '3px dashed #D1D5DB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <UserPlus size={32} color="#9CA3AF" />
                </div>
                <span style={{
                  fontSize: '16px', fontWeight: 700, color: '#6B7280', fontFamily: TYPOGRAPHY.fonts.kids
                }}>
                  Yeni Ekle
                </span>
              </motion.button>
            </div>

            {/* Ebeveyn Moduna Geç */}
            <div style={{ marginTop: 'auto', paddingTop: '40px', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setAppMode(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', borderRadius: RADIUS.full,
                  background: '#F3F4F6', border: 'none', cursor: 'pointer',
                  color: '#4B5563', fontSize: '14px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.kids,
                }}
              >
                <Shield size={18} />
                Ebeveyn Moduna Geç
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
