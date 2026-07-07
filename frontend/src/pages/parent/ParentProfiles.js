import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

export default function ParentProfiles() {
  const navigate = useNavigate();

  const profiles = [
    { id: 1, name: 'Ali', age: 7, avatar: '👦', bg: '#DBEAFE', color: '#3B82F6' },
    { id: 2, name: 'Ayşe', age: 5, avatar: '👧', bg: '#FCE7F3', color: '#EC4899' },
  ];

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '24px 20px', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <button onClick={() => navigate('/settings')} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary, margin: 0 }}>
          Çocuk Profilleri
        </h1>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {profiles.map((profile, i) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '16px',
              display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: SHADOWS.sm, cursor: 'pointer', border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '28px', background: profile.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
              {profile.avatar}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.primary }}>
                {profile.name}
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, fontFamily: TYPOGRAPHY.fonts.primary }}>
                {profile.age} Yaş
              </p>
            </div>

            <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={24} color="#9CA3AF" />
            </div>
          </motion.div>
        ))}

        {/* Add Profile Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/parent/add-profile')}
          style={{
            background: '#F9FAFB', borderRadius: RADIUS.xl, padding: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            border: '2px dashed #D1D5DB', cursor: 'pointer', width: '100%',
            marginTop: '8px'
          }}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={20} color="#6B7280" />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#6B7280', fontFamily: TYPOGRAPHY.fonts.primary }}>
            Yeni Çocuk Ekle
          </span>
        </motion.button>
      </div>
    </div>
  );
}
