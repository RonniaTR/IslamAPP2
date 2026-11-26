import React, { memo, useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Gamepad2, Calendar, User, BookOpen, Route } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, ADULT_NAV_TABS } from '../styles/designTokens';
import OfflineIndicator from './OfflineIndicator';
import MuhurMenu from './nav/MuhurMenu';
import GunKarti from './nav/GunKarti';
import { yolDegisti, gunuIsaretle } from '../services/kazanim';
import { bildirimleriKur } from '../services/bildirim';

const iconMap = { Home, Compass, Gamepad2, Calendar, User, BookOpen, Route };

const NavTab = memo(function NavTab({ icon: Icon, label, active, isCenter, theme, onClick, isDesktop }) {
  if (isDesktop) {
    return (
      <button onClick={onClick}
        aria-label={label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          padding: '12px 16px',
          borderRadius: '16px',
          background: active ? `${theme.primary || '#0D5C2F'}15` : 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: active ? (theme.primary || '#0D5C2F') : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: active ? `0 4px 12px ${theme.primary || '#0D5C2F'}40` : 'none',
        }}>
          <Icon size={20} color={active ? '#FFFFFF' : theme.textSecondary} strokeWidth={active ? 2.5 : 2} />
        </div>
        <span style={{
          fontSize: '15px',
          fontWeight: active ? 800 : 600,
          color: active ? (theme.primary || '#0D5C2F') : theme.textSecondary,
        }}>
          {label}
        </span>
      </button>
    );
  }

  // Mobile layout tab
  if (isCenter) {
    return (
      <button onClick={onClick}
        aria-label={label}
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
          width: '52px',
          height: '52px',
          borderRadius: '26px',
          background: active
            ? theme.primary || '#0D5C2F'
            : `${theme.primary || '#0D5C2F'}dd`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 16px ${theme.primary || '#0D5C2F'}40`,
          marginTop: '-16px',
          border: `3px solid ${theme.isDark ? theme.bg : '#FFFFFF'}`,
          transition: 'all 0.3s ease',
          transform: active ? 'scale(1.1)' : 'scale(1)',
        }}>
          <Icon size={24} color="#FFFFFF" strokeWidth={2.5} />
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: active ? 700 : 500,
          color: active ? (theme.primary || '#0D5C2F') : theme.textSecondary,
          fontFamily: TYPOGRAPHY.fonts.body,
          marginTop: '-2px',
        }}>
          {label}
        </span>
      </button>
    );
  }

  return (
    <button onClick={onClick}
      aria-label={label}
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
      {active && (
        <div style={{
          position: 'absolute',
          top: 0,
          width: '32px',
          height: '3px',
          borderRadius: '0 0 3px 3px',
          background: theme.primary || '#0D5C2F',
          boxShadow: `0 2px 8px ${theme.primary || '#0D5C2F'}60`,
          transition: 'all 0.3s ease',
        }} />
      )}
      <div style={{
        padding: active ? '6px' : '4px',
        borderRadius: '12px',
        background: active ? `${theme.primary || '#0D5C2F'}10` : 'transparent',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: active ? 'scale(1.1)' : 'scale(1)',
      }}>
        <Icon
          size={active ? 24 : 22}
          strokeWidth={active ? 2.5 : 1.8}
          color={active ? (theme.primary || '#0D5C2F') : theme.textSecondary}
        />
      </div>
      <span style={{
        fontSize: '10px',
        fontWeight: active ? 700 : 500,
        letterSpacing: '0.02em',
        color: active ? (theme.primary || '#0D5C2F') : theme.textSecondary,
        fontFamily: TYPOGRAPHY.fonts.body,
        transition: 'all 0.3s ease',
        opacity: active ? 1 : 0.7,
      }}>
        {label}
      </span>
    </button>
  );
});

export default memo(function Layout({ children }) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const hideNav = pathname.match(/\/quran\/\d+/) || pathname.startsWith('/mushaf');
  const isRtl = lang === 'ar';
  // Kaydırma sırasında alt menü kapanmaz; telefon ve tablette her zaman tek dokunuşla geçişe hazır kalır.
  const mainRef = useRef(null);
  const [compact, setCompact] = useState(false);
  // Kazanım kaydı (yalnız cihazda): hangi bölümde ne kadar kalındığı + gün çetelesi. Bkz. services/kazanim.js
  useEffect(() => { yolDegisti(`${pathname}${search || ''}`); }, [pathname, search]);
  useEffect(() => {
    gunuIsaretle();
    bildirimleriKur();
    const gorunurluk = () => yolDegisti(document.hidden ? null : `${window.location.pathname}${window.location.search}`);
    document.addEventListener('visibilitychange', gorunurluk);
    return () => document.removeEventListener('visibilitychange', gorunurluk);
  }, []);

  const safeT = t || {};
  const tabs = useMemo(() => ADULT_NAV_TABS.map(tab => ({
    ...tab,
    icon: iconMap[tab.icon] || Home,
    label: safeT[tab.id] || tab.label,
  })), [safeT]);

  return (
    <div
      className={`h-full flex-1 w-full flex overflow-hidden relative ${isRtl ? 'rtl' : 'ltr'}`}
      style={{ background: theme.bg }}
      data-testid="app-layout"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <OfflineIndicator />
      <GunKarti />
      
      {/* DESKTOP SIDEBAR */}
      {!hideNav && (
        <aside className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 w-[260px] z-50 p-6"
          style={{ background: theme.navBg, borderInlineEnd: `1px solid ${theme.cardBorder}` }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <svg width="32" height="32" viewBox="0 0 40 40">
              <path d="M20 2 C10 2 2 10 2 20 C2 30 10 38 20 38 C15 34 12 28 12 20 C12 12 15 6 20 2Z" fill={theme.primary || '#0D5C2F'} />
              <circle cx="20" cy="20" r="18" fill="none" stroke={theme.primary || '#0D5C2F'} strokeWidth="1.5" opacity="0.3" />
            </svg>
            <span style={{ fontSize: '20px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.02em' }}>
              İslami Yaşam
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tabs.map(({ id, path, icon, label }) => {
              const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
              return (
                <NavTab
                  key={id}
                  icon={icon}
                  label={label}
                  active={active}
                  isCenter={false}
                  theme={theme}
                  onClick={() => navigate(path)}
                  isDesktop={true}
                />
              );
            })}
          </div>
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <main ref={mainRef} className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-[var(--alt-bosluk,96px)] md:pb-0 ${!hideNav ? 'md:ml-[260px]' : ''}`}>
        <div className="w-full h-full max-w-[1400px] mx-auto relative">
          {children || <Outlet />}
        </div>
      </main>

      {/* MOBILE: Mühür menü — kapsül + Devam Kemeri; aşağı kaydırınca tek bir mühre dönüşür (components/nav/MuhurMenu) */}
      {!hideNav && (
        <MuhurMenu tabs={tabs} pathname={pathname} search={search} navigate={navigate} theme={theme} kapali={compact} setKapali={setCompact} />
      )}
    </div>
  );
});
