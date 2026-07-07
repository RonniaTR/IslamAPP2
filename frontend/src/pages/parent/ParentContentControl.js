import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

export default function ParentContentControl() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({
    stories: true,
    games: true,
    quran: true,
  });

  const togglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
          İçerik Kontrolü
        </h1>
      </div>

      <div style={{ padding: '24px 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary, margin: '0 0 16px 0' }}>
          Erişim İzinleri
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: SHADOWS.sm }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.primary }}>
                Hikayeler
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, fontFamily: TYPOGRAPHY.fonts.primary }}>
                Tüm hikayelere erişim
              </p>
            </div>
            <div onClick={() => togglePermission('stories')} style={{ width: '50px', height: '28px', borderRadius: '14px', background: permissions.stories ? '#10B981' : '#E5E7EB', display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#FFFFFF', transform: permissions.stories ? 'translateX(22px)' : 'translateX(0)', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: SHADOWS.sm }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.primary }}>
                Oyunlar
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, fontFamily: TYPOGRAPHY.fonts.primary }}>
                Eğitici oyunlara erişim
              </p>
            </div>
            <div onClick={() => togglePermission('games')} style={{ width: '50px', height: '28px', borderRadius: '14px', background: permissions.games ? '#10B981' : '#E5E7EB', display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#FFFFFF', transform: permissions.games ? 'translateX(22px)' : 'translateX(0)', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: SHADOWS.sm }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.primary }}>
                Kuran & Dualar
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, fontFamily: TYPOGRAPHY.fonts.primary }}>
                Dini içeriklere erişim
              </p>
            </div>
            <div onClick={() => togglePermission('quran')} style={{ width: '50px', height: '28px', borderRadius: '14px', background: permissions.quran ? '#10B981' : '#E5E7EB', display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#FFFFFF', transform: permissions.quran ? 'translateX(22px)' : 'translateX(0)', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary, margin: '16px 0 8px 0' }}>
            Yaş Filtresi
          </h2>

          <div style={{ background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: SHADOWS.sm }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.primary }}>
                Yaş Sınırı
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, fontFamily: TYPOGRAPHY.fonts.primary }}>
                İçerikleri yaşa göre filtrele
              </p>
            </div>
            <select
              style={{
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                background: '#F9FAFB',
                fontSize: '14px',
                fontWeight: 700,
                color: '#1F2937',
                fontFamily: TYPOGRAPHY.fonts.primary,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="4-6">4-6 Yaş</option>
              <option value="7-9" selected>7-9 Yaş</option>
              <option value="10-12">10-12 Yaş</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
