import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

export default function KidsSurahPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        const [arRes, trRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${id}`),
          fetch(`https://api.alquran.cloud/v1/surah/${id}/tr.diyanet`)
        ]);
        
        const arData = await arRes.json();
        const trData = await trRes.json();

        if (arData.data && trData.data) {
          const verses = arData.data.ayahs.map((ayah, i) => ({
            id: ayah.numberInSurah,
            arabic: ayah.text,
            meaning: trData.data.ayahs[i].text,
          }));
          
          setSurah({
            name: arData.data.englishName,
            turkishName: arData.data.englishName,
            verses,
            audioUrl: `https://server8.mp3quran.net/afs/${String(id).padStart(3, '0')}.mp3`
          });
          setLoading(false);
        }
      } catch (err) {
        console.error("AlQuran API failed", err);
        setLoading(false);
      }
    };
    fetchSurah();
  }, [id]);

  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(e => console.log('Audio play error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing]);

  const togglePlay = () => setPlaying(!playing);

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {surah?.audioUrl && (
        <audio 
          ref={audioRef} 
          src={surah.audioUrl} 
          onEnded={() => setPlaying(false)}
        />
      )}

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
          {surah?.turkishName || 'Yükleniyor...'}
        </h1>
      </div>

      <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto', paddingBottom: '120px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Yükleniyor...</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#FFFFFF',
              borderRadius: RADIUS['2xl'],
              padding: '32px 24px',
              boxShadow: SHADOWS.sm,
              display: 'flex',
              flexDirection: 'column',
              gap: '32px'
            }}
          >
            {surah?.verses?.map((verse, i) => (
              <div key={verse.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                    {verse.id}
                  </div>
                  <div style={{ flex: 1, fontSize: '24px', fontWeight: 700, color: '#1F2937', textAlign: 'right', fontFamily: 'serif', lineHeight: 1.6 }}>
                    {verse.arabic}
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#4B5563', margin: '0 0 0 36px', fontFamily: TYPOGRAPHY.fonts.kids, lineHeight: 1.5 }}>
                  {verse.meaning}
                </p>
                {i !== surah.verses.length - 1 && <div style={{ height: '1px', background: '#F3F4F6', margin: '8px 0 8px 36px' }} />}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Floating Player Controls */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '24px', right: '24px',
        background: '#FFFFFF',
        borderRadius: '32px',
        padding: '16px 24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        zIndex: 20
      }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <RotateCcw size={24} color="#9CA3AF" />
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <SkipBack size={28} color="#4B5563" />
        </button>
        <button onClick={togglePlay} style={{
          width: '64px', height: '64px', borderRadius: '32px',
          background: '#1F2937', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(31, 41, 55, 0.3)'
        }}>
          {playing ? <Pause size={28} color="#FFFFFF" fill="#FFFFFF" /> : <Play size={28} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: '4px' }} />}
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <SkipForward size={28} color="#4B5563" />
        </button>
      </div>
    </div>
  );
}
