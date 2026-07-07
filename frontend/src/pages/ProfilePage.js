import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Clock, Bookmark, Download, BookOpen, ChevronRight, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { id: 'history', label: 'Okuma Geçmişi', icon: Clock, path: '/history' },
    { id: 'saved', label: 'Kaydedilenler', icon: Bookmark, path: '/bookmarks' },
    { id: 'downloads', label: 'İndirilenler', icon: Download, path: '/downloads' },
    { id: 'notes', label: 'Notlarım', icon: BookOpen, path: '/notes' },
    { id: 'settings', label: 'Ayarlar', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="profile-page">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <span className="font-extrabold text-2xl tracking-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
          Profil
        </span>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/settings')} className="p-2.5 rounded-full transition-colors" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <Settings size={20} style={{ color: theme.textPrimary }} />
          </button>
          <button className="p-2.5 rounded-full transition-colors" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <Menu size={20} style={{ color: theme.textPrimary }} />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4 mb-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-[3px] p-1" style={{ borderColor: theme.primary }}>
              <div className="w-full h-full rounded-full overflow-hidden" style={{ background: theme.surface }}>
                <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Samet"} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold border-2 border-white shadow-sm whitespace-nowrap"
                 style={{ background: theme.primary, color: '#FFF' }}>
              Seviye 12
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-1" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
            {user?.name || 'Samet Durak'}
          </h2>
          <p className="text-xs font-medium mb-5" style={{ color: theme.textSecondary }}>
            sametdurak@example.com
          </p>

          {/* XP Bar */}
          <div className="w-full max-w-[280px] mb-8">
            <div className="flex justify-between items-center text-[10px] font-bold mb-1.5 px-1" style={{ color: theme.primary }}>
              <span>Seviye 12</span>
              <span>2500 / 3300 XP</span>
            </div>
            <div className="h-2 rounded-full w-full overflow-hidden" style={{ background: theme.cardBorder }}>
              <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '75%', background: theme.primary }} />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '125', label: 'Gün' },
            { value: '82%', label: 'Başarı' },
            { value: '45', label: 'Rozet' },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center p-3 rounded-[20px]" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
              <span className="text-lg font-bold mb-0.5" style={{ color: theme.textPrimary }}>{stat.value}</span>
              <span className="text-[10px] font-semibold" style={{ color: theme.textSecondary }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Menu List */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-4">
        <div className="rounded-[24px] overflow-hidden" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}`, boxShadow: SHADOWS.sm }}>
          {menuItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between p-4 transition-colors hover:bg-black/5"
              style={{ borderBottom: idx !== menuItems.length - 1 ? `1px solid ${theme.cardBorder}` : 'none' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: theme.bg }}>
                  <item.icon size={16} style={{ color: theme.textPrimary }} />
                </div>
                <span className="text-[13px] font-bold" style={{ color: theme.textPrimary }}>{item.label}</span>
              </div>
              <ChevronRight size={16} style={{ color: theme.textSecondary }} />
            </button>
          ))}
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 p-4 rounded-[20px] flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
          style={{ background: '#FEE2E2', color: '#EF4444' }}
        >
          <LogOut size={18} />
          <span className="font-bold text-[13px]">Çıkış Yap</span>
        </button>
      </motion.div>
    </div>
  );
}