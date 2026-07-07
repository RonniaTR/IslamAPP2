import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronRight, BookOpen, Heart, ScrollText, FileText, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';

export default function DiscoverPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const categories = [
    { id: 'quran', label: "Kur'an", icon: BookOpen, color: '#C8A55A', path: '/quran' },
    { id: 'dhikr', label: 'Dua & Zikir', icon: Heart, color: '#10B981', path: '/dhikr' },
    { id: 'stories', label: 'Hikayeler', icon: ScrollText, color: '#F59E0B', path: '/knowledge' },
    { id: 'articles', label: 'Makaleler', icon: FileText, color: '#3B82F6', path: '/knowledge' },
  ];

  const popularContents = [
    {
      id: 1,
      title: 'Sabah Zikirleri',
      subtitle: '7 ayet',
      image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=200',
      type: 'zikir'
    },
    {
      id: 2,
      title: 'Peygamberimizin Hayatı',
      subtitle: 'Sesli Kitap',
      image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80&w=200',
      type: 'audio'
    },
    {
      id: 3,
      title: 'Cuma Hutbesi',
      subtitle: 'Dinle',
      image: 'https://images.unsplash.com/photo-1577732297834-8c8309ff01ac?auto=format&fit=crop&q=80&w=200',
      type: 'audio'
    }
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="discover-page">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <span className="font-extrabold text-2xl tracking-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
          Keşfet
        </span>
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-full transition-colors" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <Search size={20} style={{ color: theme.textPrimary }} />
          </button>
          <button className="p-2.5 rounded-full relative transition-colors" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <Bell size={20} style={{ color: theme.textPrimary }} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
          </button>
        </div>
      </div>

      {/* Kategoriler */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex justify-between items-center px-4 mb-4">
          <h2 className="text-base font-bold" style={{ color: theme.textPrimary }}>Kategoriler</h2>
          <button className="text-xs font-semibold flex items-center gap-0.5 hover:opacity-70 transition-opacity" style={{ color: theme.textSecondary }}>
            Tümünü Gör <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="px-4 grid grid-cols-2 gap-3">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(cat.path)}
              className="flex flex-col items-center justify-center p-4 rounded-[24px] border transition-shadow hover:shadow-md"
              style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2" style={{ background: `${cat.color}15` }}>
                <cat.icon size={24} style={{ color: cat.color }} />
              </div>
              <span className="text-xs font-bold" style={{ color: theme.textPrimary }}>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Popüler İçerikler */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-base font-bold px-4 mb-4" style={{ color: theme.textPrimary }}>Popüler İçerikler</h2>
        
        <div className="px-4 flex flex-col gap-3">
          {popularContents.map((content, idx) => (
            <motion.button
              key={content.id}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-3 rounded-[20px] transition-shadow hover:shadow-md w-full text-left group"
              style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}
            >
              <div className="w-16 h-16 rounded-[16px] overflow-hidden relative">
                <img src={content.image} alt={content.title} className="w-full h-full object-cover" />
                {content.type === 'audio' && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[2px]">
                    <Play size={16} color="#FFF" fill="#FFF" className="ml-0.5" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-[13px] mb-1 group-hover:text-primary transition-colors" style={{ color: theme.textPrimary }}>{content.title}</h3>
                <p className="text-[11px] font-medium" style={{ color: theme.textSecondary }}>{content.subtitle}</p>
              </div>
              
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: theme.bg }}>
                <ChevronRight size={16} style={{ color: theme.textSecondary }} />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}