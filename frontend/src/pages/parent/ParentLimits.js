import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

export default function ParentLimits() {
  const navigate = useNavigate();
  const [dailyLimitEnabled, setDailyLimitEnabled] = useState(true);
  const [gameLimitEnabled, setGameLimitEnabled] = useState(true);
  const [storyLimitEnabled, setStoryLimitEnabled] = useState(true);

  return (
    <div style={{ padding: '0' }}>
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
          Ekran Süresi
        </h1>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Date Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <button style={{ background: '#F3F4F6', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft size={20} color="#4B5563" />
          </button>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary }}>
            Bugün, 12 Mayıs
          </span>
          <button style={{ background: '#F3F4F6', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronRight size={20} color="#4B5563" />
          </button>
        </div>

        {/* Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '24px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="16" />
              {/* 45 min out of 60 = 75% -> 0.75 * 251.2 = 188.4 */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#1F2937', lineHeight: 1 }}>45</span>
              <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 600, fontFamily: TYPOGRAPHY.fonts.primary }}>dk</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '6px', background: '#10B981' }} />
              <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: 600 }}>45 dk Kullanıldı</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '6px', background: '#F3F4F6' }} />
              <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: 600 }}>15 dk Kaldı</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Daily Limit */}
          <div style={{ background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: SHADOWS.sm }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.primary }}>
                Günlük Ekran Süresi
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, fontFamily: TYPOGRAPHY.fonts.primary }}>
                1 Saat
              </p>
            </div>
            {/* Toggle */}
            <div onClick={() => setDailyLimitEnabled(!dailyLimitEnabled)} style={{ width: '50px', height: '28px', borderRadius: '14px', background: dailyLimitEnabled ? '#10B981' : '#E5E7EB', display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#FFFFFF', transform: dailyLimitEnabled ? 'translateX(22px)' : 'translateX(0)', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary, margin: '16px 0 8px 0' }}>
            Uygulama İçi Sınırlar
          </h2>

          <div style={{ background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: SHADOWS.sm }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.primary }}>
                Oyun Süresi
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, fontFamily: TYPOGRAPHY.fonts.primary }}>
                30 dk
              </p>
            </div>
            <div onClick={() => setGameLimitEnabled(!gameLimitEnabled)} style={{ width: '50px', height: '28px', borderRadius: '14px', background: gameLimitEnabled ? '#10B981' : '#E5E7EB', display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#FFFFFF', transform: gameLimitEnabled ? 'translateX(22px)' : 'translateX(0)', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: SHADOWS.sm }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.primary }}>
                Hikaye Süresi
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, fontFamily: TYPOGRAPHY.fonts.primary }}>
                Sınırsız
              </p>
            </div>
            <div onClick={() => setStoryLimitEnabled(!storyLimitEnabled)} style={{ width: '50px', height: '28px', borderRadius: '14px', background: storyLimitEnabled ? '#10B981' : '#E5E7EB', display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#FFFFFF', transform: storyLimitEnabled ? 'translateX(22px)' : 'translateX(0)', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
