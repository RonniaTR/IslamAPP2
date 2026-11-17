import React, { memo, useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Gamepad2, Calendar, User, BookOpen, Route } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, ADULT_NAV_TABS } from '../styles/designTokens';
import OfflineIndicator from './OfflineIndicator';

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
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const hideNav = pathname.match(/\/quran\/\d+/) || pathname.startsWith('/mushaf');
  const isRtl = lang === 'ar';
  // Kaydırma yönüne göre alt menüyü incelt
  const mainRef = useRef(null);
  const lastY = useRef(0);
  const [compact, setCompact] = useState(false);
  const onScroll = useCallback(() => {
    const y = mainRef.current ? mainRef.current.scrollTop : 0;
    if (Math.abs(y - lastY.current) < 12) return;
    setCompact(y > lastY.current && y > 80);
    lastY.current = y;
  }, []);
  useEffect(() => { setCompact(false); lastY.current = 0; }, [pathname]);

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
      <main ref={mainRef} onScroll={onScroll} className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-24 md:pb-0 ${!hideNav ? 'md:ml-[260px]' : ''}`}>
        <div className="w-full h-full max-w-[1400px] mx-auto relative">
          {children || <Outlet />}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV — yüzen kapsül. Etkin sekme adıyla, ötekiler yalnız simgeyle; aşağı kaydırınca
          kapsül incelir (etkin sekmenin adı da gizlenir), yukarı kaydırınca geri gelir. Etkin sekmenin üstünde
          küçük bir kandil ışığı yanar. */}
      {!hideNav && (
        <nav className="md:hidden" data-testid="bottom-nav" aria-label="Ana menü"
          style={{ position: 'fixed', insetInline: 0, bottom: 'max(10px, env(safe-area-inset-bottom))', zIndex: 50, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{
            pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: compact ? 2 : 4,
            padding: compact ? 5 : 7, borderRadius: 999, maxWidth: 'calc(100% - 24px)',
            background: theme.navBg, backdropFilter: 'blur(22px) saturate(1.4)', WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
            border: `1px solid ${theme.cardBorder}`,
            boxShadow: theme.isDark ? '0 14px 34px -10px rgba(0,0,0,0.7)' : '0 14px 34px -14px rgba(20,40,30,0.35)',
            transition: 'padding 0.28s cubic-bezier(0.2,0.8,0.2,1), gap 0.28s',
          }}>
            {tabs.map(({ id, path, icon: Icon, label }) => {
              const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
              const showLabel = active && !compact;
              return (
                <button key={id} type="button" onClick={() => navigate(path)} aria-label={label} aria-current={active ? 'page' : undefined}
                  style={{
                    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    height: compact ? 42 : 48, minWidth: compact ? 42 : 48, padding: showLabel ? '0 16px 0 13px' : 0,
                    borderRadius: 999, border: 'none', cursor: 'pointer',
                    background: active ? `${theme.primary}${theme.isDark ? '40' : '1F'}` : 'transparent',
                    color: active ? (theme.isDark ? theme.goldLight || theme.gold : theme.primary) : theme.textSecondary,
                    transition: 'all 0.28s cubic-bezier(0.2,0.8,0.2,1)',
                  }}>
                  {active && <span aria-hidden style={{ position: 'absolute', top: -3, insetInlineStart: '50%', width: 6, height: 6, marginInlineStart: -3, borderRadius: 3, background: theme.gold, boxShadow: `0 0 10px 2px ${theme.gold}` }} />}
                  <Icon size={20} strokeWidth={active ? 2.3 : 1.9} aria-hidden />
                  {showLabel && <span style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
});
