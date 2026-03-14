import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, Compass, Settings, ScrollText, Trophy } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const hideNav = pathname.match(/\/quran\/\d+/);
  const isRtl = lang === 'ar';

  const tabs = [
    { path: '/', icon: Home, label: t.home || 'Ana Sayfa' },
    { path: '/quran', icon: BookOpen, label: t.quran || "Kur'an" },
    { path: '/hadith', icon: ScrollText, label: t.hadith || 'Hadis' },
    { path: '/quiz', icon: Trophy, label: t.quiz || 'Quiz' },
    { path: '/discover', icon: Compass, label: t.explore || 'Keşfet' },
    { path: '/chat', icon: MessageCircle, label: t.chat || 'Sohbet' },
    { path: '/settings', icon: Settings, label: t.settings || 'Ayarlar' },
  ];

  return (
    <div className={`min-h-screen flex flex-col w-full max-w-[520px] md:max-w-[768px] lg:max-w-[520px] mx-auto relative ${isRtl ? 'rtl' : 'ltr'}`}
      style={{ background: theme.bg }}
      data-testid="app-layout" dir={isRtl ? 'rtl' : 'ltr'}>
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <Outlet />
      </main>
      {!hideNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[520px] md:max-w-[768px] lg:max-w-[520px] z-50 safe-bottom"
          style={{ background: theme.navBg, backdropFilter: 'blur(16px)', borderTop: `1px solid ${theme.cardBorder}` }}
          data-testid="bottom-nav">
          <div className="flex justify-around items-center h-16 px-1">
            {tabs.map(({ path, icon: Icon, label }) => {
              const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
              return (
                <button key={path} onClick={() => navigate(path)}
                  data-testid={`nav-${path.slice(1) || 'home'}`}
                  aria-label={label}
                  className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200"
                  style={{ color: active ? theme.gold : theme.textSecondary }}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
