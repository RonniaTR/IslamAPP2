import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, Clock, BarChart2, Shield } from 'lucide-react';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';

export default function ParentLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const NAV_ITEMS = [
    { id: 'profiles', path: '/parent/profiles', icon: Users, label: 'Profiller' },
    { id: 'limits', path: '/parent/limits', icon: Clock, label: 'Süreler' },
    { id: 'activity', path: '/parent/activity', icon: BarChart2, label: 'Raporlar' },
    { id: 'content', path: '/parent/content', icon: Shield, label: 'İçerik' },
  ];

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingBottom: '80px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Content Area */}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#FFFFFF',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '12px 20px 24px 20px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        zIndex: 50,
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                color: isActive ? '#6366F1' : '#9CA3AF'
              }}
            >
              <div style={{
                padding: '8px', borderRadius: '16px',
                background: isActive ? '#EEF2FF' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                <Icon size={24} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: TYPOGRAPHY.fonts.primary }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
