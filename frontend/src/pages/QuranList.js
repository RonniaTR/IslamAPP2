import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Download, Plus, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY } from '../styles/designTokens';
import api from '../api';
import { fetchWithCache } from '../services/cache';

export default function QuranList() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sureler');
  const [searchQuery, setSearchQuery] = useState('');
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        // Try to fetch from AlQuran Cloud for all 114 surahs
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        if (data && data.data) {
          const mappedSurahs = data.data.map(s => ({
            number: s.number,
            name: s.englishName,
            turkish_name: s.englishName, // Fallback for search
            arabic_name: s.name,
            verses: s.numberOfAyahs,
            revelationType: s.revelationType
          }));
          setSurahs(mappedSurahs);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("AlQuran API failed", err);
      }
      
      // Fallback to internal API
      fetchWithCache('surahs_list', () => api.get('/quran/surahs').then(r => r.data), { ttl: 24 * 60 * 60 * 1000 })
        .then(({ data }) => {
          if (Array.isArray(data)) setSurahs(data);
          else if (data && data.data) setSurahs(data.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchSurahs();
  }, []);

  const displaySurahs = surahs.length > 0 ? surahs : [];

  const filteredSurahs = displaySurahs.filter(s => {
    const searchStr = s.turkish_name || s.name || s.arabic_name;
    return searchStr && searchStr.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="quran-page">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <span className="font-extrabold text-2xl tracking-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
          Kur'an
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
      <div className="px-4 mb-4">
        <div className="flex p-1 rounded-2xl" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
          {[
            { id: 'sureler', label: 'Sureler' },
            { id: 'cuzler', label: 'Cüzler' },
            { id: 'sayfa', label: 'Sayfa' }
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

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
          <Search size={18} style={{ color: theme.textSecondary }} />
          <input 
            type="text" 
            placeholder="Sure ara..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-medium"
            style={{ color: theme.textPrimary }}
          />
        </div>
      </div>

      {/* Surah List */}
      <div className="px-4">
        {loading && surahs.length === 0 ? (
          <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.primary, borderTopColor: 'transparent' }} /></div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredSurahs.map((surah, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={surah.number || surah.id}
                onClick={() => navigate(`/quran/${surah.number || surah.id}`)}
                className="flex items-center justify-between p-4 rounded-[20px] transition-shadow hover:shadow-sm cursor-pointer"
                style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                       style={{ color: theme.primary, border: `1.5px solid ${theme.primary}40`, background: `${theme.primary}05` }}>
                    {surah.number || surah.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-0.5" style={{ color: theme.textPrimary }}>{surah.turkish_name || surah.name} Suresi</h3>
                    <p className="text-[11px] font-medium" style={{ color: theme.textSecondary }}>{surah.verses || surah.ayahs} ayet</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2" onClick={(e) => e.stopPropagation()}>
                    <Download size={18} style={{ color: theme.textSecondary }} />
                  </button>
                  <button className="p-2" onClick={(e) => e.stopPropagation()}>
                    <Plus size={18} style={{ color: theme.textSecondary }} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
