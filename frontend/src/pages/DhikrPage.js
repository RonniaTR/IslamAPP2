import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Sun, Moon, Shield, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';
import api from '../api';
import { fetchWithCache } from '../services/cache';

export default function DhikrPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('zikirler');
  const [dhikrs, setDhikrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithCache('dhikr_list', () => api.get('/dhikr').then(r => r.data), { ttl: 24 * 60 * 60 * 1000 })
      .then(({ data }) => {
        setDhikrs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mock data
        setDhikrs([
          { id: 1, title: 'Subhanallah', target: 33 },
          { id: 2, title: 'Alhamdulillah', target: 33 },
          { id: 3, title: 'Allahu Ekber', target: 34 },
          { id: 4, title: 'La ilahe illallah', target: 100 },
        ]);
        setLoading(false);
      });
  }, []);

  const categories = [
    { id: 'morning', label: 'Sabah', icon: Sun, color: '#F59E0B' },
    { id: 'evening', label: 'Akşam', icon: Moon, color: '#8B5CF6' },
    { id: 'prayer', label: 'Namaz', icon: Shield, color: '#3B82F6' },
    { id: 'protection', label: 'Korunma', icon: Shield, color: '#10B981' },
    { id: 'travel', label: 'Yolculuk', icon: MapPin, color: '#6366F1' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="dhikr-page">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <span className="font-extrabold text-2xl tracking-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
          Dua & Zikir
        </span>
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-full transition-colors" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <Search size={20} style={{ color: theme.textPrimary }} />
          </button>
          <button className="p-2.5 rounded-full transition-colors" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <MoreVertical size={20} style={{ color: theme.textPrimary }} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6">
        <div className="flex p-1 rounded-2xl" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
          {[
            { id: 'zikirler', label: 'Zikirler' },
            { id: 'dualar', label: 'Dualar' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 text-[13px] font-bold rounded-xl transition-all"
              style={{
                background: activeTab === tab.id ? theme.primary : 'transparent',
                color: activeTab === tab.id ? '#FFF' : theme.textSecondary,
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(13,92,47,0.2)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-base font-bold px-4 mb-4" style={{ color: theme.textPrimary }}>Kategoriler</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-2">
          {categories.map((cat, idx) => (
            <motion.button key={cat.id} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-shadow hover:shadow-md" 
                   style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: cat.color }}>
                <cat.icon size={24} />
              </div>
              <span className="text-[11px] font-bold" style={{ color: theme.textSecondary }}>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Öne Çıkan Zikirler */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-4">
        <h2 className="text-base font-bold mb-4" style={{ color: theme.textPrimary }}>Öne Çıkan Zikirler</h2>
        
        {loading ? (
           <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.primary, borderTopColor: 'transparent' }} /></div>
        ) : (
          <div className="flex flex-col gap-3">
            {dhikrs.map((dhikr, idx) => (
              <motion.button 
                key={dhikr.id || idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/dhikr/${dhikr.id}`)}
                className="flex items-center justify-between p-4 rounded-[20px] transition-shadow hover:shadow-sm w-full text-left"
                style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: `${theme.primary}15`, color: theme.primary }}>
                    <span className="text-[10px]">📿</span>
                  </div>
                  <span className="font-bold text-[13px]" style={{ color: theme.textPrimary }}>{dhikr.title || dhikr.turkish}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold" style={{ color: theme.textSecondary }}>{dhikr.target || dhikr.recommended || 33}</span>
                  <ChevronRight size={16} style={{ color: theme.textSecondary }} />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
