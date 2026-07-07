import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Pause, MoreVertical, BookOpen, Share2, Info } from 'lucide-react';
import { Typography } from '../components/ui/Typography';
import { quranData } from '../data/quranContent';

export default function SurahDetail() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [activeAyah, setActiveAyah] = useState(null);
  const [showTafsir, setShowTafsir] = useState({});

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSurahDetail = async () => {
      // First check our premium local DB for Tafsir and rich text
      const localSurah = quranData.find(s => s.id === Number(surahNumber));

      try {
        const [arRes, trRes, audioRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/tr.diyanet`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`)
        ]);
        
        const arData = await arRes.json();
        const trData = await trRes.json();
        const audioData = await audioRes.json();

        if (arData.data && trData.data && audioData.data) {
          const verses = arData.data.ayahs.map((ayah, i) => {
            const localVerse = localSurah?.verses?.find(v => v.verseNumber === ayah.numberInSurah);
            return {
              number: ayah.numberInSurah,
              arabic: ayah.text,
              turkish: localVerse?.translation || trData.data.ayahs[i].text,
              tafsir: localVerse?.tafsir || "Bu ayet için tefsir bulunmuyor.",
              audio_url: audioData.data.ayahs[i].audio
            };
          });
          
          setSurah({
            number: Number(surahNumber),
            name: arData.data.englishName,
            arabicName: arData.data.name,
            translation: localSurah?.translation || arData.data.englishNameTranslation,
            revelationType: arData.data.revelationType === 'Meccan' ? 'Mekki' : 'Medeni',
            totalVerses: arData.data.numberOfAyahs,
            verses,
            reciter: 'Mishary Rashid Alafasy',
            full_audio_url: `https://server8.mp3quran.net/afs/${String(surahNumber).padStart(3, '0')}.mp3`
          });
          setLoading(false);
        }
      } catch (err) {
        console.error("AlQuran API failed", err);
        setLoading(false);
      }
    };

    fetchSurahDetail();
  }, [surahNumber]);

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

  const playAyah = (ayah) => {
    if (audioRef.current) {
      audioRef.current.src = ayah.audio_url;
      setActiveAyah(ayah.number);
      setPlaying(true);
      audioRef.current.play();
    }
  };

  const toggleTafsir = (ayahNum) => {
    setShowTafsir(prev => ({ ...prev, [ayahNum]: !prev[ayahNum] }));
  };

  if (loading || !surah) {
    return (
      <div style={{ minHeight: '100vh', background: '#052A1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="bodySmall" style={{ color: '#CDA434' }}>Sure Yükleniyor...</Typography>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#052A1E', position: 'relative', paddingBottom: '120px' }}>
      <audio 
        ref={audioRef} 
        src={surah.full_audio_url} 
        onEnded={() => setPlaying(false)}
      />

      {/* Header Bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(5, 42, 30, 0.9)', backdropFilter: 'blur(10px)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChevronLeft size={24} />
          <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 600 }}>Geri</Typography>
        </button>
        <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 700, fontSize: '18px' }}>
          {surah.name}
        </Typography>
        <button style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Surah Banner */}
      <div style={{ padding: '24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(205, 164, 52, 0.2) 0%, rgba(15, 143, 87, 0.1) 100%)',
          border: '1px solid rgba(205, 164, 52, 0.3)',
          borderRadius: '24px', padding: '32px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")', opacity: 0.05 }} />
          
          <Typography variant="h2" style={{ color: '#FFF', fontSize: '36px', fontFamily: "'Amiri', serif", marginBottom: '8px', position: 'relative', zIndex: 2 }}>
            {surah.arabicName}
          </Typography>
          <Typography variant="bodySmall" style={{ color: '#CDA434', fontWeight: 800, fontSize: '18px', letterSpacing: '1px', marginBottom: '8px', position: 'relative', zIndex: 2 }}>
            {surah.name.toUpperCase()}
          </Typography>
          <div style={{ width: '60%', height: '1px', background: 'rgba(255,255,255,0.2)', margin: '16px auto', position: 'relative', zIndex: 2 }} />
          <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative', zIndex: 2 }}>
            <span>{surah.revelationType}</span> • <span>{surah.totalVerses} Ayet</span>
          </Typography>

          <button 
            onClick={togglePlay}
            style={{
              marginTop: '24px', width: '64px', height: '64px', borderRadius: '50%',
              background: '#CDA434', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(205, 164, 52, 0.4)', cursor: 'pointer', position: 'relative', zIndex: 2
            }}
          >
            {playing && !activeAyah ? <Pause size={28} color="#000" /> : <Play size={28} color="#000" style={{ marginLeft: '4px' }} />}
          </button>
        </div>
      </div>

      {/* Bismillah */}
      {surah.number !== 1 && surah.number !== 9 && (
        <div style={{ textAlign: 'center', padding: '24px', marginBottom: '16px' }}>
          <Typography variant="h2" style={{ color: '#FFF', fontSize: '28px', fontFamily: "'Amiri', serif" }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Typography>
        </div>
      )}

      {/* Verses List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 24px' }}>
        {surah.verses.map((ayah) => (
          <div key={ayah.number} style={{
            background: activeAyah === ayah.number ? 'rgba(205, 164, 52, 0.05)' : 'transparent',
            border: activeAyah === ayah.number ? '1px solid rgba(205, 164, 52, 0.3)' : '1px solid transparent',
            borderRadius: '20px', padding: '20px', transition: 'all 0.3s'
          }}>
            {/* Top Bar for Ayah */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(15, 143, 87, 0.1)',
                border: '1px solid rgba(15, 143, 87, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#2ECC71', fontWeight: 800, fontSize: '13px'
              }}>
                {ayah.number}
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => toggleTafsir(ayah.number)} style={{ background: 'none', border: 'none', color: '#CDA434', cursor: 'pointer' }}>
                  <Info size={20} />
                </button>
                <button onClick={() => playAyah(ayah)} style={{ background: 'none', border: 'none', color: '#2ECC71', cursor: 'pointer' }}>
                  {activeAyah === ayah.number && playing ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Arabic Text */}
            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <Typography variant="h2" style={{ color: '#FFF', fontSize: '32px', fontFamily: "'Amiri', serif", lineHeight: 1.8 }}>
                {ayah.arabic}
              </Typography>
            </div>

            {/* Translation */}
            <div>
              <Typography variant="bodySmall" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', lineHeight: 1.6 }}>
                {ayah.turkish}
              </Typography>
            </div>

            {/* Tafsir Expandable */}
            {showTafsir[ayah.number] && (
              <div style={{
                marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
                borderLeft: '4px solid #CDA434'
              }}>
                <Typography variant="caption" style={{ color: '#CDA434', fontWeight: 700, marginBottom: '8px', display: 'block' }}>TEFSİR / AÇIKLAMA</Typography>
                <Typography variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6 }}>
                  {ayah.tafsir}
                </Typography>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
