import React, { memo, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Gamepad2, Calendar, User } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, ADULT_NAV_TABS } from '../styles/designTokens';

const iconMap = { Home, Compass, Gamepad2, Calendar, User };

const NavTab = memo(function NavTab({ icon: Icon, label, active, isCenter, theme, onClick }) {
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

export default memo(function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const hideNav = pathname.match(/\/quran\/\d+/);
  const isRtl = lang === 'ar';

  const safeT = t || {};
  const tabs = useMemo(() => ADULT_NAV_TABS.map(tab => ({
    ...tab,
    icon: iconMap[tab.icon] || Home,
    label: safeT[tab.id] || tab.label,
  })), [safeT]);

  return (
    <div
      className={`min-h-screen flex flex-col w-full max-w-[520px] md:max-w-[768px] lg:max-w-[520px] mx-auto relative ${isRtl ? 'rtl' : 'ltr'}`}
      style={{ background: theme.bg }}
      data-testid="app-layout"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        <Outlet />
      </main>
      {!hideNav && (
        <nav
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '520px',
            zIndex: 50,
            background: theme.navBg,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: `1px solid ${theme.cardBorder}`,
            boxShadow: theme.isDark ? '0 -10px 40px rgba(0,0,0,0.4)' : '0 -4px 20px rgba(0,0,0,0.06)',
          }}
          data-testid="bottom-nav"
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: '72px',
            padding: '0 8px 4px',
          }}>
            {tabs.map(({ id, path, icon, label, isCenter }) => {
              const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
              return (
                <NavTab
                  key={id}
                  icon={icon}
                  label={label}
                  active={active}
                  isCenter={isCenter}
                  theme={theme}
                  onClick={() => navigate(path)}
                />
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
});
