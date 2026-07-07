import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';
import api from '../api';
import { fetchWithCache } from '../services/cache';

export default function GamificationPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithCache('badges_list', () => api.get('/gamification/badges').then(r => r.data), { ttl: 24 * 60 * 60 * 1000 })
      .then(({ data }) => {
        setBadges(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback mock data
        setBadges([
          { id: 1, name: 'İlk Adım', unlocked: true, icon: '🌟' },
          { id: 2, name: '7 Günlük Okuyucu', unlocked: true, icon: '📖' },
          { id: 3, name: 'Zikir Ustası', unlocked: true, icon: '📿' },
          { id: 4, name: 'Gece Kuşu', unlocked: true, icon: '🌙' },
          { id: 5, name: 'Bilgi Avcısı', unlocked: true, icon: '💡' },
          { id: 6, name: 'Sadaka Veren', unlocked: true, icon: '💰' },
          { id: 7, name: 'Kur\'an Hatmi', unlocked: false, icon: '🕌' },
          { id: 8, name: '100 Günlük Seri', unlocked: false, icon: '🔥' },
          { id: 9, name: 'İyilik Meleği', unlocked: false, icon: '🕊️' },
        ]);
        setLoading(false);
      });
  }, []);

  const tabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'earned', label: 'Kazanılan' },
    { id: 'locked', label: 'Kazanılacak' }
  ];

  const filteredBadges = badges.filter(b => {
    if (activeTab === 'earned') return b.unlocked;
    if (activeTab === 'locked') return !b.unlocked;
    return true;
  });

  const earnedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  const BadgeGrid = ({ items, lockedState = false }) => (
    <div className="grid grid-cols-3 gap-y-6 gap-x-2">
      {items.map((badge, idx) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="flex flex-col items-center text-center group"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center relative mb-2 transition-transform group-hover:scale-105"
               style={{ 
                 background: lockedState ? theme.bg : theme.surface, 
                 border: `2px solid ${lockedState ? theme.cardBorder : theme.gold}`,
                 boxShadow: lockedState ? 'none' : `0 8px 16px ${theme.gold}40`,
                 opacity: lockedState ? 0.6 : 1
               }}>
            
            {/* Inner Decoration */}
            <div className="absolute inset-1 rounded-full border-2 border-dashed" style={{ borderColor: lockedState ? theme.textSecondary : theme.gold, opacity: 0.3 }} />
            
            <span className="text-3xl relative z-10 filter" style={{ filter: lockedState ? 'grayscale(100%)' : 'none' }}>
              {badge.icon}
            </span>
          </div>
          <span className="text-[11px] font-bold leading-tight px-1" style={{ color: theme.textPrimary }}>
            {badge.name}
          </span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="gamification-page">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 sticky top-0 z-10 bg-white/50 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
          <ChevronLeft size={24} style={{ color: theme.textPrimary }} />
          <span className="font-extrabold text-xl tracking-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
            Rozetlerim
          </span>
        </button>
        <button className="p-2 transition-colors rounded-full" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
          <MoreVertical size={20} style={{ color: theme.textPrimary }} />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-8">
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

      {/* Badges Content */}
      <div className="px-4">
        {loading ? (
          <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.primary, borderTopColor: 'transparent' }} /></div>
        ) : (
          <>
            {activeTab === 'all' && (
              <>
                <BadgeGrid items={earnedBadges} />
                <div className="mt-10 mb-6 flex items-center gap-4">
                  <h2 className="text-sm font-bold whitespace-nowrap" style={{ color: theme.textPrimary }}>Yakında Kazanılacak</h2>
                  <div className="h-px w-full" style={{ background: theme.cardBorder }} />
                </div>
                <BadgeGrid items={lockedBadges} lockedState={true} />
              </>
            )}
            
            {activeTab === 'earned' && <BadgeGrid items={filteredBadges} />}
            {activeTab === 'locked' && <BadgeGrid items={filteredBadges} lockedState={true} />}
          </>
        )}
      </div>
    </div>
  );
}
