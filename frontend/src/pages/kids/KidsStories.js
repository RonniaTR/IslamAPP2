import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, SlidersHorizontal, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

const STORY_CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'prophets', label: 'Peygamberler' },
  { id: 'sahaba', label: 'Sahabeler' },
  { id: 'kids', label: 'Çocuklar' },
];

const STORIES = [
  { id: 1, category: 'prophets', title: "Hz. Nuh'un Büyük Gemisi", subtitle: 'Sabır ve Umut', color: '#3B82F6', image: '🚢', bg: '#DBEAFE', duration: '5 Dk' },
  { id: 2, category: 'prophets', title: "Hz. Yunus ve Balina", subtitle: 'Tövbe ve Kurtuluş', color: '#10B981', image: '🐋', bg: '#D1FAE5', duration: '4 Dk' },
  { id: 3, category: 'prophets', title: "Hz. İbrahim'in Misafirperverliği", subtitle: 'Cömertlik', color: '#F59E0B', image: '⛺', bg: '#FEF3C7', duration: '6 Dk' },
  { id: 4, category: 'prophets', title: "Hz. Süleyman ve Karınca", subtitle: 'Adalet ve Merhamet', color: '#8B5CF6', image: '🐜', bg: '#EDE9FE', duration: '5 Dk' },
  { id: 5, category: 'sahaba', title: "Hz. Ali'nin Cesareti", subtitle: 'Hz. Ali (r.a)', color: '#EF4444', image: '⚔️', bg: '#FEE2E2', duration: '7 Dk' },
  { id: 6, category: 'sahaba', title: "Bilal-i Habeşi'nin Ezani", subtitle: 'İnanç ve Azim', color: '#14B8A6', image: '🕌', bg: '#CCFBF1', duration: '4 Dk' },
  { id: 7, category: 'kids', title: "Küçük Ahmet'in İyiliği", subtitle: 'Yardımlaşma', color: '#EC4899', image: '🤝', bg: '#FCE7F3', duration: '3 Dk' },
  { id: 8, category: 'kids', title: "Yalan Söylemeyen Çocuk", subtitle: 'Dürüstlük', color: '#6366F1', image: '🌟', bg: '#E0E7FF', duration: '4 Dk' },
];

export default function KidsStories() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredStories = activeCategory === 'all' 
    ? STORIES 
    : STORIES.filter(s => s.category === activeCategory);

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 20px', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <button onClick={() => navigate('/kids')} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: 0 }}>
          Hikayeler
        </h1>
        <button style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <SlidersHorizontal size={20} color="#4B5563" />
        </button>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '8px', padding: '20px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {STORY_CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '8px 20px', borderRadius: '24px',
                background: isActive ? '#10B981' : '#F3F4F6',
                color: isActive ? '#FFFFFF' : '#6B7280',
                border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.kids,
                whiteSpace: 'nowrap', transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Stories List */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredStories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(`/kids/story/${story.id}`)}
            style={{
              background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '12px',
              display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: SHADOWS.sm, cursor: 'pointer'
            }}
          >
            {/* Thumbnail Placeholder */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '16px',
              background: story.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '40px', flexShrink: 0
            }}>
              {story.image}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.kids }}>
                {story.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, fontWeight: 600, fontFamily: TYPOGRAPHY.fonts.kids }}>
                {story.subtitle}
              </p>
            </div>

            {/* Play Button */}
            <div style={{
              width: '40px', height: '40px', borderRadius: '20px',
              background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Play size={20} color="#10B981" fill="#10B981" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
