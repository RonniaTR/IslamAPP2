import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Bell, Palette, Globe, Type, Volume2, Shield, Database, Info, ChevronRight, Baby } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAppMode } from '../contexts/AppModeContext';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';

export default function SettingsPage() {
  const { theme, themeId, toggleTheme } = useTheme();
  const { appMode, setAppMode, isChild } = useAppMode();
  const navigate = useNavigate();

  const settingsGroups = [
    {
      items: [
        { id: 'account', label: 'Hesap', icon: User, value: '', path: '/profile' },
        { id: 'notifications', label: 'Bildirimler', icon: Bell, value: '', path: '/settings/notifications' },
        { id: 'mode', label: isChild ? 'Yetişkin Moduna Geç' : 'Çocuk Moduna Geç', icon: Baby, value: isChild ? 'Çocuk' : 'Yetişkin', action: 'toggleMode' }
      ]
    },
    {
      items: [
        { id: 'appearance', label: 'Görünüm', icon: Palette, value: themeId === 'dark' ? 'Koyu Tema' : 'Açık Tema', action: 'toggleTheme' },
        { id: 'language', label: 'Dil', icon: Globe, value: 'Türkçe', action: 'noop' },
        { id: 'fontsize', label: 'Yazı Boyutu', icon: Type, value: 'Orta', action: 'noop' },
        { id: 'audio', label: 'Ses ve Okuyucu', icon: Volume2, value: 'Kabe İmamı', action: 'noop' },
      ]
    },
    {
      items: [
        { id: 'privacy', label: 'Gizlilik', icon: Shield, value: '', action: 'noop' },
        { id: 'backup', label: 'Yedekleme', icon: Database, value: '', action: 'noop' },
        { id: 'about', label: 'Hakkında', icon: Info, value: '', action: 'noop' },
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="settings-page">
      {/* Top Bar */}
      <div className="flex items-center px-4 pt-6 pb-6 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
          <ChevronLeft size={24} style={{ color: theme.textPrimary }} />
          <span className="font-extrabold text-xl tracking-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
            Ayarlar
          </span>
        </button>
      </div>

      <div className="px-4 flex flex-col gap-6">
        {settingsGroups.map((group, gIdx) => (
          <motion.div 
            key={gIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gIdx * 0.1 }}
            className="rounded-[24px] overflow-hidden" 
            style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}`, boxShadow: SHADOWS.sm }}
          >
            {group.items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action === 'toggleTheme') toggleTheme();
                  else if (item.action === 'toggleMode') {
                    const newMode = isChild ? 'adult' : 'child';
                    setAppMode(newMode);
                    navigate(newMode === 'child' ? '/kids' : '/');
                    // Force refresh to reload layouts cleanly if needed, though react should handle it
                    setTimeout(() => window.location.reload(), 100);
                  }
                  else if (item.path) navigate(item.path);
                  else alert('Bu özellik yakında eklenecek!');
                }}
                className="w-full flex items-center justify-between p-4 transition-colors hover:bg-black/5"
                style={{ borderBottom: idx !== group.items.length - 1 ? `1px solid ${theme.cardBorder}` : 'none' }}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} style={{ color: item.id === 'mode' ? '#2ECC71' : theme.textSecondary }} strokeWidth={2} />
                  <span className="text-[14px] font-semibold" style={{ color: theme.textPrimary }}>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && (
                    <span className="text-[12px] font-medium" style={{ color: theme.textSecondary }}>{item.value}</span>
                  )}
                  <ChevronRight size={18} style={{ color: theme.textSecondary }} />
                </div>
              </button>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
