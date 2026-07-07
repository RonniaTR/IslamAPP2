import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

export default function ParentAddProfile() {
  const navigate = useNavigate();
  const [gender, setGender] = useState('erkek');

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '24px 20px', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary, margin: 0 }}>
          Yeni Çocuk Ekle
        </h1>
      </div>

      <div style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Avatar Upload Placeholder */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
            {gender === 'kiz' ? '👧' : '👦'}
          </div>
          <button style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '32px', height: '32px', borderRadius: '16px',
            background: '#10B981', border: '2px solid #FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: SHADOWS.sm
          }}>
            <Camera size={16} color="#FFFFFF" />
          </button>
        </div>

        {/* Form */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#4B5563', marginBottom: '8px', fontFamily: TYPOGRAPHY.fonts.primary }}>Çocuğun Adı</label>
            <input
              type="text"
              placeholder="Ali"
              style={{
                width: '100%', padding: '16px', borderRadius: RADIUS.xl,
                border: '1px solid #E5E7EB', background: '#FFFFFF',
                fontSize: '16px', fontFamily: TYPOGRAPHY.fonts.primary,
                outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#4B5563', marginBottom: '8px', fontFamily: TYPOGRAPHY.fonts.primary }}>Yaşı</label>
            <input
              type="number"
              placeholder="7"
              style={{
                width: '100%', padding: '16px', borderRadius: RADIUS.xl,
                border: '1px solid #E5E7EB', background: '#FFFFFF',
                fontSize: '16px', fontFamily: TYPOGRAPHY.fonts.primary,
                outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#4B5563', marginBottom: '8px', fontFamily: TYPOGRAPHY.fonts.primary }}>Cinsiyet</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => setGender('kiz')}
                style={{
                  flex: 1, padding: '16px', borderRadius: RADIUS.xl,
                  background: gender === 'kiz' ? '#FCE7F3' : '#F3F4F6',
                  border: `2px solid ${gender === 'kiz' ? '#EC4899' : 'transparent'}`,
                  color: gender === 'kiz' ? '#EC4899' : '#6B7280',
                  fontSize: '16px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.primary, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                Kız
              </button>
              <button
                onClick={() => setGender('erkek')}
                style={{
                  flex: 1, padding: '16px', borderRadius: RADIUS.xl,
                  background: gender === 'erkek' ? '#DBEAFE' : '#F3F4F6',
                  border: `2px solid ${gender === 'erkek' ? '#3B82F6' : 'transparent'}`,
                  color: gender === 'erkek' ? '#3B82F6' : '#6B7280',
                  fontSize: '16px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.primary, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                Erkek
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 20px', background: '#FFFFFF', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' }}>
        <button
          onClick={() => navigate('/parent/profiles')}
          style={{
            width: '100%', padding: '16px', borderRadius: RADIUS.xl,
            background: '#10B981', color: '#FFFFFF',
            border: 'none', fontSize: '16px', fontWeight: 800, fontFamily: TYPOGRAPHY.fonts.primary, cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
          }}
        >
          Kaydet
        </button>
      </div>
    </div>
  );
}
