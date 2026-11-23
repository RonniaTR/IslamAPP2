import React from 'react';
import { Search, Mic, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

export function DiscoverHeader({ streak = 0, level = 1 }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className="px-4 pt-6 pb-2 relative z-10 font-sans">
      
      {/* Top Row: Welcome + Stats */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-sm mb-1" style={{ color: theme.textSecondary }}>Esselamu Aleyküm</div>
          <div className="text-3xl font-bold flex items-center gap-2 mb-1" style={{ color: theme.textPrimary, fontFamily: 'var(--font-heading)' }}>
            {user?.name?.split(' ')[0] || 'Hoş geldin'} <span>👋</span>
          </div>
          <div className="text-sm" style={{ color: theme.gold }}>
            Bugün ne <span className="font-bold">öğrenmek</span> istersin?
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Streak Badge */}
          <div className="backdrop-blur-md rounded-2xl px-3 py-1.5 flex items-center gap-2 shadow-sm"
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <span className="text-orange-500 text-xl">🔥</span>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-none" style={{ color: theme.textPrimary }}>{streak}</span>
              <span className="text-[10px]" style={{ color: theme.textSecondary }}>Yolda gün</span>
            </div>
          </div>
          
          {/* Avatar & Level Badge */}
          <div className="relative flex flex-col items-center cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="w-12 h-12 rounded-full p-0.5"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.gold})` }}>
              <img 
                src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=misafir&backgroundColor=2D8A4E"} 
                alt="Profile" 
                className="w-full h-full rounded-full border-2 object-cover"
                style={{ borderColor: theme.bg, background: theme.primary }}
              />
            </div>
            <div className="absolute -bottom-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 whitespace-nowrap shadow-md"
              style={{ background: theme.primaryGradient || theme.primary, borderColor: theme.bg }}>
              Seviye {level}
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Bar & AI Button Row */}
      <div className="flex gap-3">
        <div className="flex-1 backdrop-blur-md rounded-full flex items-center px-4 h-12 shadow-sm"
          style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <Search size={18} className="me-2" style={{ color: theme.textSecondary }} />
          <input 
            type="text" 
            placeholder="Sure, dua, hadis veya makale ara..." 
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: theme.textPrimary }}
          />
          <Mic size={18} className="ms-2 cursor-pointer transition-colors" style={{ color: theme.textSecondary }} />
        </div>
        
        <button 
          onClick={() => navigate('/chat')}
          className="rounded-full flex items-center justify-center px-4 h-12 transition-all duration-300 gap-2 shadow-sm"
          style={{
            background: `${theme.primary}18`,
            border: `1px solid ${theme.primary}45`,
            color: theme.isDark ? theme.gold : theme.primary,
          }}
        >
          <Sparkles size={18} style={{ color: theme.isDark ? theme.gold : theme.primary }} />
          <span className="font-bold text-sm whitespace-nowrap">AI Asistan</span>
        </button>
      </div>
      
    </div>
  );
}
