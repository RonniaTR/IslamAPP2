import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

const BADGE_CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'reading', label: 'Okuma' },
  { id: 'task', label: 'Görev' },
  { id: 'special', label: 'Özel' },
];

const BADGES = [
  { id: 1, title: 'İlk Adım', category: 'special', icon: '🌟', color: '#F59E0B', bg: '#FEF3C7', unlocked: true },
  { id: 2, title: 'Sure Kahramanı', category: 'reading', icon: '📖', color: '#EF4444', bg: '#FEE2E2', unlocked: true },
  { id: 3, title: 'Dua Ustası', category: 'reading', icon: '🤲', color: '#10B981', bg: '#D1FAE5', unlocked: true },
  { id: 4, title: 'Zikir Ustası', category: 'task', icon: '📿', color: '#3B82F6', bg: '#DBEAFE', unlocked: true },
  { id: 5, title: 'Hikaye Kaşifi', category: 'task', icon: '🧭', color: '#F97316', bg: '#FFEDD5', unlocked: true },
  { id: 6, title: 'Görev Şampiyonu', category: 'task', icon: '🏆', color: '#8B5CF6', bg: '#EDE9FE', unlocked: true },
  { id: 7, title: 'Sabah Kuşu', category: 'special', icon: '🌅', color: '#6B7280', bg: '#F3F4F6', unlocked: false },
  { id: 8, title: 'Gece Bekçisi', category: 'special', icon: '🌙', color: '#6B7280', bg: '#F3F4F6', unlocked: false },
];

export default function KidsBadges() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredBadges = activeCategory === 'all'
    ? BADGES
    : BADGES.filter(b => b.category === activeCategory);

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 20px', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: 0 }}>
          Rozetlerim
        </h1>
        <button style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <SlidersHorizontal size={20} color="#4B5563" />
        </button>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '8px', padding: '20px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {BADGE_CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '8px 20px', borderRadius: '24px',
                background: isActive ? '#10B981' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#6B7280',
                border: isActive ? 'none' : '1px solid #E5E7EB',
                cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.kids,
                whiteSpace: 'nowrap', transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '0 20px' }}>
        {filteredBadges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              opacity: badge.unlocked ? 1 : 0.6,
            }}
          >
            <div style={{
              width: '80px', height: '90px',
              background: badge.bg,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', // Hexagon shape
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px',
              border: `4px solid ${badge.color}`,
              boxShadow: badge.unlocked ? `0 10px 20px ${badge.color}30` : 'none',
              filter: badge.unlocked ? 'none' : 'grayscale(100%)',
            }}>
              {badge.icon}
            </div>
            <p style={{
              fontSize: '12px', fontWeight: 700, color: '#4B5563', fontFamily: TYPOGRAPHY.fonts.kids,
              textAlign: 'center', margin: 0, lineHeight: 1.2
            }}>
              {badge.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
