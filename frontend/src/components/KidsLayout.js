import React, { memo, useMemo, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Award, Heart, Settings } from 'lucide-react';
import KidsAcilis, { shouldShowAcilis } from './kids/KidsAcilis';
import { loadFamily, tickMinute, usedToday, gateQuestion, extendToday } from '../services/kidsFamily';
import { COLORS, TYPOGRAPHY, KIDS_NAV_TABS } from '../styles/designTokens';
import OfflineIndicator from './OfflineIndicator';

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
          ⭐
        </div>
        <span style={{
          fontSize: '12px',
          fontWeight: 800,
          color: active ? '#4A4A4A' : '#9CA3AF',
          fontFamily: TYPOGRAPHY.fonts.kids,
          marginTop: '2px',
          whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis',
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
        flex: '1 1 0',
        minWidth: 0,
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
        fontWeight: active ? 800 : 700,
        fontSize: '12px',
        color: active ? '#EA580C' : '#8A94A0',
        fontFamily: TYPOGRAPHY.fonts.kids,
        whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {label}
      </span>
    </button>
  );
});

const iconMap = { Home, Map, Award, Heart, Settings };

export default memo(function KidsLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Açılış: besmele + hayır duası + günün ayeti (oturum başına bir kez)
  const [acilis, setAcilis] = useState(shouldShowAcilis);
  // Ebeveynin koyduğu günlük süre: ekran açıkken dakika sayılır; dolunca nazik bir perde çıkar
  const [limitHit, setLimitHit] = useState(false);
  const [gate, setGate] = useState(null);
  useEffect(() => {
    const check = () => { const lim = loadFamily().limit; setLimitHit(lim > 0 && usedToday() >= lim); };
    check();
    const id = setInterval(() => { if (document.visibilityState === 'visible' && !acilis) tickMinute(); check(); }, 60000);
    return () => clearInterval(id);
  }, [acilis]);

  const tabs = useMemo(() => KIDS_NAV_TABS.map(tab => ({
    ...tab,
    icon: iconMap[tab.icon] || Home,
  })), []);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        position: 'relative',
        background: COLORS.kids.bg,
        overflow: 'hidden',
      }}
    >
      <OfflineIndicator />
      {acilis && <KidsAcilis onDone={() => setAcilis(false)} />}
      {limitHit && (
        <div role="dialog" aria-label="Bugünlük süre doldu" style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'linear-gradient(180deg, #1D2B5A 0%, #3B4F8A 100%)', color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center', fontFamily: TYPOGRAPHY.fonts.kids }}>
          <div style={{ fontSize: 80 }}>🌙</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, margin: '12px 0 6px' }}>Bugünlük bu kadar!</h2>
          <p style={{ fontSize: 18, fontWeight: 700, margin: 0, opacity: 0.9 }}>Harika çalıştın. Şimdi biraz dinlenme, oyun ve aile zamanı. Yarın yine buradayız!</p>
          {!gate ? (
            <button type="button" onClick={() => setGate({ ...gateQuestion(), v: '' })} style={{ marginTop: 26, minHeight: 46, padding: '0 18px', borderRadius: 23, background: 'rgba(255,255,255,0.14)', color: '#FFFFFF', fontWeight: 800 }}>Büyükler için: süre ekle</button>
          ) : (
            <div style={{ marginTop: 22, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 22, fontWeight: 900 }}>{gate.text}</span>
              <input inputMode="numeric" value={gate.v} onChange={(e) => setGate({ ...gate, v: e.target.value.replace(/\D/g, '') })} aria-label="Cevap" style={{ width: 80, minHeight: 46, borderRadius: 14, border: 'none', textAlign: 'center', fontSize: 20, fontWeight: 900 }} />
              <button type="button" onClick={() => { if (Number(gate.v) === gate.answer) { extendToday(15); setLimitHit(false); setGate(null); } else setGate(null); }} style={{ minHeight: 46, padding: '0 14px', borderRadius: 14, background: '#5DBB63', color: '#FFFFFF', fontWeight: 900 }}>+15 dk</button>
            </div>
          )}
        </div>
      )}
      {/* İçerik */}
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: '100px', position: 'relative', zIndex: 1, WebkitOverflowScrolling: 'touch' }}>
          {children || <Outlet />}
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
          padding: '0 6px env(safe-area-inset-bottom)',
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
