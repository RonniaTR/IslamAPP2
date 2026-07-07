import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';
import api from '../api';
import { fetchWithCache } from '../services/cache';

export default function KnowledgeProfile() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [stories, setStories] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const fetchStories = fetchWithCache('stories_list', () => api.get('/knowledge/stories').then(r => r.data), { ttl: 24 * 60 * 60 * 1000 })
      .catch(() => [
        { id: 1, title: "Hz. Yusuf'un Sabrı ve Zindanı", image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=400", category: 'Peygamberler' },
        { id: 2, title: "Hz. Bilal'in İmtihanı", image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=400", category: 'Sahabiler' },
        { id: 3, title: "Hz. İbrahim ve Ateş", image: "https://images.unsplash.com/photo-1590076215667-87ebffeb36e6?auto=format&fit=crop&q=80&w=400", category: 'Peygamberler' },
        { id: 4, title: "Küçük Yaşta İlim Aşkı", image: "https://images.unsplash.com/photo-1577900236686-2a6285324ac3?auto=format&fit=crop&q=80&w=400", category: 'Çocuklar' },
      ]);
      
    const fetchHadiths = fetchWithCache('hadith_all', () => api.get('/hadith/all').then(r => r.data), { ttl: 24 * 60 * 60 * 1000 })
      .catch(() => [
        { id: "h1", turkish: "Ameller niyetlere göredir.", theme: "Niyet", bookTr: "Buhari" },
        { id: "h2", turkish: "İslam güzel ahlaktır.", theme: "Ahlak", bookTr: "Müslim" },
        { id: "h3", turkish: "Sizin en hayırlınız Kuran'ı öğrenen ve öğreteninizdir.", theme: "Kuran", bookTr: "Tirmizi" },
        { id: "h4", turkish: "İki nimet vardır ki insanların çoğu onun kıymetini bilmez: Sağlık ve boş vakit.", theme: "Şükür", bookTr: "Buhari" },
        { id: "h5", turkish: "Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.", theme: "Hoşgörü", bookTr: "Müslim" },
      ]);

    Promise.all([fetchStories, fetchHadiths]).then(([storiesData, hadithsData]) => {
      setStories(Array.isArray(storiesData.data) ? storiesData.data : (Array.isArray(storiesData) ? storiesData : []));
      setHadiths(Array.isArray(hadithsData.data) ? hadithsData.data : (Array.isArray(hadithsData) ? hadithsData : []));
      setLoading(false);
    });
  }, []);

  const tabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'prophets', label: 'Peygamberler' },
    { id: 'companions', label: 'Sahabiler' },
    { id: 'kids', label: 'Çocuklar' },
    { id: 'hadith', label: 'Hadisler' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setVisibleCount(20);
  };

  const getDisplayItems = () => {
    if (activeTab === 'hadith') {
      return hadiths.slice(0, visibleCount).map(h => ({
        id: `hadith_${h.id}`,
        title: h.theme || h.bookTr || 'Hadis-i Şerif',
        category: 'Hadis',
        image: "https://images.unsplash.com/photo-1590076215667-87ebffeb36e6?auto=format&fit=crop&q=80&w=400", // Elegant generic image
        isHadith: true
      }));
    }
    return stories.filter(s => activeTab === 'all' ? true : s.category?.toLowerCase().includes(activeTab.toLowerCase()));
  };

  const displayItems = getDisplayItems();
  const showLoadMore = activeTab === 'hadith' && visibleCount < hadiths.length;

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="knowledge-profile">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
          <ChevronLeft size={24} style={{ color: theme.textPrimary }} />
          <span className="font-extrabold text-xl tracking-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
            Hikayeler
          </span>
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-full transition-colors" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <Search size={20} style={{ color: theme.textPrimary }} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className="shrink-0 px-4 py-1.5 text-[12px] font-bold rounded-full transition-all"
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

      {/* Grid */}
      <div className="px-4">
        {loading ? (
          <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.primary, borderTopColor: 'transparent' }} /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {displayItems.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 20) * 0.05 }}
                  onClick={() => navigate(`/knowledge/${story.id}`)}
                  className="rounded-[20px] overflow-hidden cursor-pointer group flex flex-col"
                  style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}`, boxShadow: SHADOWS.sm }}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden shrink-0">
                    <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-3 flex flex-col justify-between flex-1">
                    <p className="font-bold text-[12px] leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2" style={{ color: theme.textPrimary }}>
                      {story.title}
                    </p>
                    <p className="text-[10px] font-medium mt-auto" style={{ color: theme.textSecondary }}>
                      {story.category || 'Hikaye'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {showLoadMore && (
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 20)}
                  className="px-6 py-3 rounded-full font-bold text-[13px] transition-transform hover:scale-105"
                  style={{ background: `${theme.primary}15`, color: theme.primary }}
                >
                  Daha Fazla Yükle
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}