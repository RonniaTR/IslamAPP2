import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, BookOpen, Star, Clock, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../components/ui/Typography';
import { quranCategories } from '../data/quranContent';

export default function QuranList() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        if (data && data.data) {
          const mappedSurahs = data.data.map(s => ({
            number: s.number,
            name: s.englishName,
            turkish_name: s.englishNameTranslation,
            arabic_name: s.name,
            verses: s.numberOfAyahs,
            revelationType: s.revelationType === 'Meccan' ? 'Mekki' : 'Medeni'
          }));
          setSurahs(mappedSurahs);
          setLoading(false);
        }
      } catch (err) {
        console.error("AlQuran API failed", err);
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  let displaySurahs = surahs;
  if (activeTab === 'meccan') displaySurahs = surahs.filter(s => s.revelationType === 'Mekki');
  if (activeTab === 'medinan') displaySurahs = surahs.filter(s => s.revelationType === 'Medeni');
  if (activeTab === 'favorites') displaySurahs = surahs.filter(s => [1, 36, 112].includes(s.number)); // Mock favorites

  const filteredSurahs = displaySurahs.filter(s => {
    const searchStr = `${s.turkish_name} ${s.name} ${s.arabic_name} ${s.number}`.toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen pb-24" style={{ background: '#052A1E', position: 'relative' }} data-testid="quran-page">
      {/* Background Geometry */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '400px',
        background: 'linear-gradient(to bottom, #031c13 0%, #052A1E 100%)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")',
        opacity: 0.03, zIndex: 1, pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Typography variant="caption" style={{ color: '#CDA434', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
              Okuma Modülü
            </Typography>
            <Typography variant="h2" style={{ color: '#FFF', fontSize: '28px' }}>Kur'an-ı Kerim</Typography>
          </div>
          <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <Search size={20} color="#0F8F57" />
          </div>
          <input 
            type="text" 
            placeholder="Sure ara (Yasin, Bakara, 36...)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '16px 16px 16px 48px', 
              borderRadius: '20px', border: '1px solid rgba(15, 143, 87, 0.3)', 
              background: 'rgba(0,0,0,0.3)', color: '#FFF', 
              fontSize: '15px', fontWeight: 600, outline: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}
          />
        </div>

        {/* Quick Stats / Last Read Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(205, 164, 52, 0.15) 0%, rgba(140, 108, 46, 0.05) 100%)',
          border: '1px solid rgba(205, 164, 52, 0.3)',
          borderRadius: '24px', padding: '20px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer'
        }} onClick={() => navigate('/quran/36')}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(205, 164, 52, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} color="#CDA434" />
          </div>
          <div style={{ flex: 1 }}>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Son Okunan</Typography>
            <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 700, fontSize: '16px' }}>Yasin Suresi</Typography>
          </div>
          <ArrowRight size={20} color="#CDA434" />
        </div>

        {/* Categories (Tabs) */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none', msOverflowStyle: 'none', marginBottom: '8px' }}>
          {quranCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '100px',
                whiteSpace: 'nowrap',
                fontWeight: 700,
                fontSize: '13px',
                transition: 'all 0.3s',
                background: activeTab === cat.id ? '#CDA434' : 'rgba(255,255,255,0.05)',
                color: activeTab === cat.id ? '#000' : '#FFF',
                border: `1px solid ${activeTab === cat.id ? '#CDA434' : 'rgba(255,255,255,0.1)'}`
              }}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Surah List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Typography variant="bodySmall" style={{ color: '#CDA434' }}>Sureler Yükleniyor...</Typography>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredSurahs.map((surah) => (
              <div 
                key={surah.number}
                onClick={() => navigate(`/quran/${surah.number}`)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Number Box */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(15, 143, 87, 0.1)',
                  border: '1px solid rgba(15, 143, 87, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(45deg)', marginRight: '24px'
                }}>
                  <span style={{ transform: 'rotate(-45deg)', color: '#2ECC71', fontWeight: 800, fontSize: '14px' }}>
                    {surah.number}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 700, fontSize: '16px', marginBottom: '2px' }}>
                    {surah.name}
                  </Typography>
                  <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ color: '#CDA434' }}>{surah.revelationType}</span> • {surah.verses} Ayet
                  </Typography>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <Typography variant="h3" style={{ color: '#FFF', fontFamily: "'Amiri', serif", fontSize: '24px', opacity: 0.9 }}>
                    {surah.arabic_name}
                  </Typography>
                </div>
              </div>
            ))}
            {filteredSurahs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Typography variant="bodySmall" style={{ color: 'rgba(255,255,255,0.5)' }}>Sonuç bulunamadı</Typography>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
