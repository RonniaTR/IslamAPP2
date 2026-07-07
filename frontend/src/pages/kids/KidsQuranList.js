import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';
import api from '../../api';
import { fetchWithCache } from '../../services/cache';

export default function KidsQuranList() {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        if (data && data.data) {
          const mappedSurahs = data.data.map(s => ({
            id: s.number,
            title: s.englishName,
            turkish_name: s.englishName,
            arabic_name: s.name,
          }));
          setSurahs(mappedSurahs);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("AlQuran API failed", err);
      }
      
      fetchWithCache('surahs_list', () => api.get('/quran/surahs').then(r => r.data), { ttl: 24 * 60 * 60 * 1000 })
        .then(({ data }) => {
          if (Array.isArray(data)) setSurahs(data.map(s => ({ id: s.number, title: s.turkish_name || s.name, ...s })));
          else if (data && data.data) setSurahs(data.data.map(s => ({ id: s.number, title: s.turkish_name || s.name, ...s })));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(s => {
    const searchStr = s.title || s.arabic_name;
    return searchStr && searchStr.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '24px 20px', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: 0 }}>
          Sureler
        </h1>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#FFFFFF', padding: '12px 16px', borderRadius: RADIUS.lg,
          boxShadow: SHADOWS.sm, border: '2px solid #F3F4F6'
        }}>
          <Search size={20} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Sure ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              width: '100%', fontSize: '14px', fontFamily: TYPOGRAPHY.fonts.kids, color: '#1F2937'
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
           <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Yükleniyor...</div>
        ) : filteredSurahs.map((surah, i) => (
          <motion.div
            key={surah.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/kids/surah/${surah.id}`)}
            style={{
              background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '16px',
              display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: SHADOWS.sm, cursor: 'pointer'
            }}
          >
            {/* Icon */}
            <div style={{
              width: '48px', height: '48px', borderRadius: '16px',
              background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: 0
            }}>
              🕋
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0, fontFamily: TYPOGRAPHY.fonts.kids }}>
                {surah.title}
              </h3>
            </div>

            <ChevronRight size={20} color="#9CA3AF" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
