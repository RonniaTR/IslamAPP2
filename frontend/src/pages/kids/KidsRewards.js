import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, Award, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';
import { useAppMode } from '../../contexts/AppModeContext';

const BADGES = [
  { id: 1, name: 'İlk Adım', desc: 'İlk dersini tamamla', icon: '🌱', earned: true, color: '#4CAF50' },
  { id: 2, name: 'Sure Kahramanı', desc: '5 sure ezberle', icon: '📖', earned: true, color: '#4A90D9' },
  { id: 3, name: 'Dua Ustası', desc: '10 dua öğren', icon: '🤲', earned: true, color: '#9B59B6' },
  { id: 4, name: 'Oyun Şampiyonu', desc: '20 oyun kazan', icon: '🏆', earned: true, color: '#FFD93D' },
  { id: 5, name: 'Hikaye Avcısı', desc: '10 hikaye oku', icon: '📚', earned: false, color: '#FF9F43' },
  { id: 6, name: '7 Gün Seri', desc: '7 gün üst üste gir', icon: '🔥', earned: false, color: '#EF5350' },
  { id: 7, name: 'Güne Başla', desc: 'Sabah duasını 30 gün oku', icon: '🌅', earned: false, color: '#FF6B8A' },
  { id: 8, name: 'Zikir Mücahidi', desc: '1000 zikir çek', icon: '📿', earned: false, color: '#26A69A' },
];

const REWARDS = [
  { id: 1, name: 'Yeni Tema', cost: 1000, icon: '🎨', color: '#9B59B6' },
  { id: 2, name: 'Özel Avatar', cost: 1500, icon: '👑', color: '#FFD93D' },
  { id: 3, name: 'Bonus Rozet', cost: 2000, icon: '🏅', color: '#FF9F43' },
];

export default function KidsRewards() {
  const navigate = useNavigate();
  const { activeChildProfile } = useAppMode();
  const [activeTab, setActiveTab] = useState('badges');
  const profile = activeChildProfile || { name: 'Yusuf', xp: 1250, level: 7 };

  const tabs = [
    { id: 'badges', label: 'Rozetler' },
    { id: 'rewards', label: 'Ödüller' },
  ];

  return (
    <div style={{ background: COLORS.kids.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' }}>
        <button onClick={() => navigate('/kids')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <ChevronLeft size={24} color={COLORS.kids.text} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.kids.text, fontFamily: TYPOGRAPHY.fonts.kids }}>
          Ödüller
        </h1>
      </div>

      {/* Stat Kartı */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          margin: '0 20px 20px',
          padding: '20px',
          borderRadius: RADIUS.kidsCard,
          background: 'linear-gradient(135deg, #2D8A4E, #4CAF50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          boxShadow: '0 4px 20px rgba(45,138,78,0.3)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontFamily: TYPOGRAPHY.fonts.kids, fontWeight: 600 }}>Puanım</p>
          <p style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', fontFamily: TYPOGRAPHY.fonts.kids }}>{profile.xp}</p>
        </div>
        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontFamily: TYPOGRAPHY.fonts.kids, fontWeight: 600 }}>Seviye</p>
          <p style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', fontFamily: TYPOGRAPHY.fonts.kids }}>{profile.level}</p>
        </div>
        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontFamily: TYPOGRAPHY.fonts.kids, fontWeight: 600 }}>Rozet</p>
          <p style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', fontFamily: TYPOGRAPHY.fonts.kids }}>{BADGES.filter(b => b.earned).length}</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 20px', marginBottom: '16px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 24px', borderRadius: RADIUS.full,
              background: activeTab === tab.id ? COLORS.kids.primary : '#FFFFFF',
              color: activeTab === tab.id ? '#FFFFFF' : COLORS.kids.text,
              border: `1px solid ${activeTab === tab.id ? COLORS.kids.primary : '#E5E7EB'}`,
              cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.kids,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rozetler Grid */}
      {activeTab === 'badges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '0 20px' }}>
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '20px 16px',
                borderRadius: RADIUS.kidsCard,
                background: '#FFFFFF',
                border: `1px solid ${badge.earned ? `${badge.color}20` : '#E5E7EB'}`,
                boxShadow: SHADOWS.kidsCard,
                textAlign: 'center',
                opacity: badge.earned ? 1 : 0.5,
                position: 'relative',
              }}
            >
              {!badge.earned && (
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  width: '24px', height: '24px', borderRadius: '12px',
                  background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Lock size={12} color="#9CA3AF" />
                </div>
              )}
              <div style={{
                width: '52px', height: '52px', borderRadius: '18px',
                background: badge.earned ? `${badge.color}15` : '#F3F4F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', margin: '0 auto 10px',
                filter: badge.earned ? 'none' : 'grayscale(1)',
              }}>
                {badge.icon}
              </div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: COLORS.kids.text, fontFamily: TYPOGRAPHY.fonts.kids }}>
                {badge.name}
              </p>
              <p style={{ fontSize: '10px', color: COLORS.kids.textSecondary, fontFamily: TYPOGRAPHY.fonts.kids, marginTop: '4px' }}>
                {badge.desc}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ödüller */}
      {activeTab === 'rewards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px' }}>
          {REWARDS.map((reward, i) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px 20px', borderRadius: RADIUS.kidsCard,
                background: '#FFFFFF', border: `1px solid ${reward.color}15`,
                boxShadow: SHADOWS.kidsCard,
              }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '18px',
                background: `${reward.color}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px',
              }}>
                {reward.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: COLORS.kids.text, fontFamily: TYPOGRAPHY.fonts.kids }}>
                  {reward.name}
                </p>
                <p style={{ fontSize: '12px', color: COLORS.kids.textSecondary, fontFamily: TYPOGRAPHY.fonts.kids }}>
                  {reward.cost} puan
                </p>
              </div>
              <button style={{
                padding: '8px 16px', borderRadius: RADIUS.full,
                background: profile.xp >= reward.cost ? COLORS.kids.primary : '#E5E7EB',
                color: profile.xp >= reward.cost ? '#FFFFFF' : '#9CA3AF',
                border: 'none', cursor: profile.xp >= reward.cost ? 'pointer' : 'default',
                fontSize: '12px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.kids,
              }}>
                Al
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
