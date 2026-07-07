import React, { useState } from 'react';
import { ChevronLeft, User, Lock, Bell, Globe, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';
import { useAppMode } from '../../context/AppModeContext';

export default function ParentSettings() {
  const navigate = useNavigate();
  const { appMode, setAppMode } = useAppMode();

  return (
    <div style={{ padding: '0', background: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '24px 20px', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <button onClick={() => navigate('/parent/profiles')} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary, margin: 0 }}>
          Ayarlar
        </h1>
      </div>

      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* App Mode Toggle */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary, margin: '0 0 16px 0' }}>
            Uygulama Modu
          </h2>
          <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: RADIUS.xl, padding: '4px' }}>
            <button
              onClick={() => { setAppMode('adult'); navigate('/'); }}
              style={{
                flex: 1, padding: '12px', borderRadius: RADIUS.lg,
                background: appMode === 'adult' ? '#FFFFFF' : 'transparent',
                color: appMode === 'adult' ? '#1F2937' : '#6B7280',
                border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.primary,
                boxShadow: appMode === 'adult' ? SHADOWS.sm : 'none', transition: 'all 0.2s ease'
              }}
            >
              Yetişkin
            </button>
            <button
              onClick={() => setAppMode('kids')}
              style={{
                flex: 1, padding: '12px', borderRadius: RADIUS.lg,
                background: appMode === 'kids' ? '#10B981' : 'transparent',
                color: appMode === 'kids' ? '#FFFFFF' : '#6B7280',
                border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.primary,
                boxShadow: appMode === 'kids' ? '0 4px 10px rgba(16, 185, 129, 0.3)' : 'none', transition: 'all 0.2s ease'
              }}
            >
              Çocuk
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ background: '#FFFFFF', borderRadius: RADIUS.xl, overflow: 'hidden', boxShadow: SHADOWS.sm }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="#4B5563" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary }}>Profil Ayarları</span>
            </div>
            <ChevronRight size={20} color="#9CA3AF" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={20} color="#4B5563" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary }}>Ebeveyn PIN'i</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#10B981', fontFamily: TYPOGRAPHY.fonts.primary }}>Açık</span>
              <ChevronRight size={20} color="#9CA3AF" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={20} color="#4B5563" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary }}>Bildirimler</span>
            </div>
            <ChevronRight size={20} color="#9CA3AF" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={20} color="#4B5563" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary }}>Dil Seçenekleri</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', fontFamily: TYPOGRAPHY.fonts.primary }}>Türkçe</span>
              <ChevronRight size={20} color="#9CA3AF" />
            </div>
          </div>
        </div>

      </div>

      <div style={{ padding: '24px 20px', paddingBottom: '100px' }}>
        <button style={{
          width: '100%', padding: '16px', borderRadius: RADIUS.xl,
          background: '#FEE2E2', color: '#EF4444',
          border: 'none', fontSize: '16px', fontWeight: 800, fontFamily: TYPOGRAPHY.fonts.primary, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
        }}>
          <LogOut size={20} />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
