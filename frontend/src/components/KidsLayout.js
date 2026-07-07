import React, { memo, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Users, Settings } from 'lucide-react';
import { COLORS, TYPOGRAPHY, KIDS_NAV_TABS } from '../styles/designTokens';

const KidsNavTab = memo(function KidsNavTab({ icon: Icon, label, active, isCenter, onClick }) {
  if (isCenter) {
    return (
      <button
        onClick={onClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          flex: 1,
          height: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '32px',
          background: 'linear-gradient(180deg, #4A4A4A 0%, #2A2A2A 100%)', // Koyu renk buton arka planı
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          marginTop: '-30px',
          border: '4px solid #FFFFFF',
          transition: 'all 0.3s ease',
          transform: active ? 'scale(1.05)' : 'scale(1)',
          fontSize: '32px',
          filter: active ? 'drop-shadow(0 0 10px rgba(255,217,61,0.5))' : 'none',
        }}>
          📦
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: 800,
          color: active ? '#4A4A4A' : '#9CA3AF',
          fontFamily: TYPOGRAPHY.fonts.kids,
          marginTop: '2px',
        }}>
          {label}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        flex: 1,
        height: '100%',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{
        padding: '6px',
        borderRadius: '12px',
        background: active ? '#FFF3E0' : 'transparent',
        transition: 'all 0.3s ease',
      }}>
        <Icon
          size={24}
          color={active ? '#EA580C' : '#9CA3AF'} // Aktif renk turuncu
          strokeWidth={active ? 2.5 : 2}
        />
      </div>
      <span style={{
        fontSize: '11px',
        fontWeight: active ? 800 : 600,
        color: active ? '#EA580C' : '#9CA3AF',
        fontFamily: TYPOGRAPHY.fonts.kids,
      }}>
        {label}
      </span>
    </button>
  );
});

const iconMap = { Home, BookOpen: Map, Award: Map, Users, Settings }; // BookOpen/Award yerine harita ikonunu eşledik

export default memo(function KidsLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const tabs = useMemo(() => KIDS_NAV_TABS.map(tab => ({
    ...tab,
    icon: iconMap[tab.icon] || Home,
  })), []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        position: 'relative',
        background: COLORS.kids.bg,
      }}
    >
      {/* İçerik */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      {/* Alt Navigasyon (Kapsül Tasarım) */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none', // Sadece bar içi clickable olsun
          zIndex: 50,
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '30px 30px 0 0',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
          pointerEvents: 'auto',
          padding: '0 16px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: '76px',
            paddingBottom: '8px',
          }}>
            {tabs.map(({ id, path, icon, label, isCenter }) => {
              const active = path === '/kids'
                ? pathname === '/kids'
                : pathname.startsWith(path);
              return (
                <KidsNavTab
                  key={id}
                  icon={icon}
                  label={label}
                  active={active}
                  isCenter={isCenter}
                  onClick={() => navigate(path)}
                />
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
});
