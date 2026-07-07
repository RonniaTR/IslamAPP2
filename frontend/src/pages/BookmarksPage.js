import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MoreVertical, MoreHorizontal, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';
import api from '../api';
import { fetchWithCache } from '../services/cache';

export default function BookmarksPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch default/mock bookmarks
    const mockBookmarks = [
      { id: 'b1', title: 'Bakara Suresi 286. Ayet', type: 'Ayet', icon: '📖' },
      { id: 'b2', title: 'Rabbim! İlmimi artır.', type: 'Dua', icon: '🤲' },
      { id: 'b3', title: 'Tevekkül Nedir? Nasıl Gerçekleşir?', type: 'Makale', icon: '📄' },
      { id: 'b4', title: "Hz. Yusuf'un Sabır Örneği", type: 'Hikaye', icon: '🕌' },
    ];

    // 2. Fetch saved surahs from localStorage
    let localSaved = [];
    try {
      const saved = localStorage.getItem('saved_surahs');
      if (saved) {
        const parsed = JSON.parse(saved);
        localSaved = parsed.map(s => ({
          id: `surah_${s.number}`,
          title: `${s.name} Suresi`,
          subtitle: s.arabicName,
          type: 'Kuran',
          path: `/quran/${s.number}`,
          icon: '✨'
        }));
      }
    } catch (e) {
      console.log('Error reading saved surahs', e);
    }

    setBookmarks([...localSaved, ...mockBookmarks]);
    setLoading(false);
  }, []);

  const tabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'kuran', label: 'Kuran' },
    { id: 'ayet', label: 'Ayet' },
    { id: 'dua', label: 'Dua' },
    { id: 'makale', label: 'Makale' },
    { id: 'hikaye', label: 'Hikaye' },
  ];

  const filteredBookmarks = bookmarks.filter(b => {
    if (activeTab === 'all') return true;
    return b.type.toLowerCase() === activeTab;
  });

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="bookmarks-page">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 sticky top-0 z-10 bg-white/50 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
          <ChevronLeft size={24} style={{ color: theme.textPrimary }} />
          <span className="font-extrabold text-xl tracking-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
            Kaydedilenler
          </span>
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 transition-colors rounded-full" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <Search size={20} style={{ color: theme.textPrimary }} />
          </button>
          <button className="p-2 transition-colors rounded-full" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <MoreVertical size={20} style={{ color: theme.textPrimary }} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 py-1 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-1.5 text-[12px] font-bold rounded-full transition-all shrink-0"
              style={{
                background: activeTab === tab.id ? theme.primary : theme.surface,
                color: activeTab === tab.id ? '#FFF' : theme.textSecondary,
                border: activeTab === tab.id ? `1px solid ${theme.primary}` : `1px solid ${theme.cardBorder}`,
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(13,92,47,0.2)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.primary, borderTopColor: 'transparent' }} /></div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: `${theme.primary}15`, color: theme.primary }}>
              <BookOpen size={32} />
            </div>
            <p className="text-[15px] font-bold mb-2" style={{ color: theme.textPrimary }}>Henüz kayıt yok.</p>
            <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>Kaydettiğiniz sureler, dualar ve yazılar burada listelenir.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredBookmarks.map((item, idx) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (item.path) navigate(item.path);
                }}
                className={`flex items-center justify-between p-4 rounded-[20px] transition-shadow hover:shadow-md ${item.path ? 'cursor-pointer' : ''}`}
                style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] flex items-center justify-center text-xl shadow-inner" style={{ background: `${theme.primary}15` }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold mb-0.5 line-clamp-1" style={{ color: theme.textPrimary }}>{item.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase" style={{ background: `${theme.primary}20`, color: theme.primary }}>
                        {item.type}
                      </span>
                      {item.subtitle && (
                        <span className="text-[11px] font-bold" style={{ color: theme.textSecondary, fontFamily: TYPOGRAPHY.fonts.arabic }}>{item.subtitle}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="p-2 transition-colors hover:bg-gray-100 rounded-full">
                  <MoreHorizontal size={18} style={{ color: theme.textSecondary }} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}