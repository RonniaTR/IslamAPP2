import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Download, ChevronRight, Play, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [downloadedSurahs, setDownloadedSurahs] = useState({});

  useEffect(() => {
    // Check local storage for downloaded
    const saved = localStorage.getItem('offline_surahs');
    if (saved) setDownloadedSurahs(JSON.parse(saved));

    const fetchSurahs = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        if (data && data.data) {
          const mappedSurahs = data.data.map(s => ({
            number: s.number,
            name: s.englishName,
            turkish_name: s.englishNameTranslation, // use translation if available
            arabic_name: s.name,
            verses: s.numberOfAyahs,
            revelationType: s.revelationType === 'Meccan' ? 'Mekke' : 'Medine'
          }));
          setSurahs(mappedSurahs);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("AlQuran API failed", err);
      }
      
      // Fallback
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
    const searchStr = `${s.turkish_name} ${s.name} ${s.arabic_name} ${s.number}`.toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  // Dummy data for Juz and Pages
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="quran-page">
      {/* ─── Hero / Search Section ─── */}
      <div 
        className="relative pt-12 pb-6 px-5 shadow-sm overflow-hidden" 
        style={{ background: 'linear-gradient(135deg, #0D5C2F 0%, #1A7A42 100%)', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1590076215667-87ebffeb36e6?auto=format&fit=crop&q=80&w=1000)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-extrabold text-2xl text-white tracking-tight" style={{ fontFamily: TYPOGRAPHY.fonts.heading }}>
              Kur'an-ı Kerim
            </h1>
            <button className="p-2.5 rounded-full bg-white/10 border border-white/20">
              <MoreVertical size={20} color="#FFF" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search size={20} color="#9CA3AF" />
            </div>
            <input 
              type="text" 
              placeholder="Sure adi, numarasi veya anlami ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 pl-12 pr-4 rounded-2xl outline-none font-medium text-[14px] shadow-lg transition-all focus:ring-4 focus:ring-white/20"
              style={{ background: '#FFF', color: '#1F2937' }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-6 mb-4">
        <div className="flex p-1 rounded-2xl shadow-sm" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
          {[
            { id: 'sureler', label: 'Sureler' },
            { id: 'cuzler', label: 'Cuzler' },
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

      {/* Content */}
      <div className="px-5 pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'sureler' && (
            <motion.div key="sureler" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              {loading ? (
                <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.primary, borderTopColor: 'transparent' }} /></div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredSurahs.map((surah) => (
                    <motion.div
                      key={surah.number}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/quran/${surah.number}`)}
                      className="flex items-center justify-between p-4 rounded-[20px] shadow-sm cursor-pointer transition-shadow hover:shadow-md bg-white"
                      style={{ border: `1px solid ${theme.cardBorder}` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          {/* Islami Yildiz Ikonu (SVG placeholder) */}
                          <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full opacity-10" style={{ fill: theme.primary }}>
                            <path d="M18 0L22.5 13.5L36 18L22.5 22.5L18 36L13.5 22.5L0 18L13.5 13.5L18 0Z" />
                          </svg>
                          <span className="font-bold text-[13px]" style={{ color: theme.primary }}>{surah.number}</span>
                        </div>
                        <div>
                          <p className="font-extrabold text-[15px] mb-0.5" style={{ color: theme.textPrimary }}>{surah.name}</p>
                          <p className="text-[11px] font-semibold" style={{ color: theme.textSecondary }}>{surah.revelationType} • {surah.verses} Ayet</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-lg" style={{ fontFamily: TYPOGRAPHY.fonts.arabic, color: theme.primary }}>{surah.arabic_name}</p>
                        <div className="p-2 rounded-full" style={{ background: '#F3F4F6' }}>
                          <ChevronRight size={16} color="#9CA3AF" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'cuzler' && (
            <motion.div key="cuzler" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-2 gap-3">
              {juzList.map(juz => (
                <div key={juz} className="p-4 rounded-[20px] bg-white border cursor-pointer flex flex-col items-center shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: theme.cardBorder }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: `${theme.primary}15`, color: theme.primary }}>
                    <BookOpen size={20} />
                  </div>
                  <span className="font-bold text-[15px]" style={{ color: theme.textPrimary }}>{juz}. Cuz</span>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'sayfa' && (
            <motion.div key="sayfa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="p-6 rounded-[24px] bg-white border text-center shadow-sm" style={{ borderColor: theme.cardBorder }}>
                <Search size={32} className="mx-auto mb-4" style={{ color: theme.primary }} />
                <h3 className="font-bold text-lg mb-2" style={{ color: theme.textPrimary }}>Sayfa Numarasina Git</h3>
                <p className="text-sm font-medium mb-4" style={{ color: theme.textSecondary }}>Hafiz Osman hatti 604 sayfalik Kuran-i Kerim'den istediginiz sayfaya gidin.</p>
                <div className="flex gap-2">
                  <input type="number" min="1" max="604" placeholder="Orn: 250" className="flex-1 px-4 py-3 rounded-xl border bg-gray-50 outline-none" />
                  <button className="px-6 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90" style={{ background: theme.primary }}>Git</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
