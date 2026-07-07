import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Type, Bell, Share2, Bookmark, Play, Pause, SkipBack, SkipForward, Maximize2, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';
import api from '../api';
import { fetchWithCache } from '../services/cache';

export default function SurahDetail() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSurahDetail = async () => {
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
          const verses = arData.data.ayahs.map((ayah, i) => ({
            number: ayah.numberInSurah,
            arabic: ayah.text,
            turkish: trData.data.ayahs[i].text,
            audio_url: audioData.data.ayahs[i].audio
          }));
          
          setSurah({
            name: arData.data.englishName,
            verses,
            reciter: { name: 'Mishary Rashid Alafasy' },
            full_audio_url: `https://server8.mp3quran.net/afs/${String(surahNumber).padStart(3, '0')}.mp3` // A common reliable full audio source
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("AlQuran API failed", err);
      }

      fetchWithCache(`surah_${surahNumber}`, () => api.get(`/quran/surah/${surahNumber}`).then(r => r.data), { ttl: 24 * 60 * 60 * 1000 })
        .then(({ data }) => {
          setSurah(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pb-40" style={{ background: theme.bg }} data-testid="surah-detail">
      {surah?.full_audio_url && (
        <audio 
          ref={audioRef} 
          src={surah.full_audio_url} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setPlaying(false)}
        />
      )}
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-20" style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
          <ChevronLeft size={24} style={{ color: theme.textPrimary }} />
          <span className="font-bold text-base" style={{ color: theme.textPrimary }}>{surah?.name || 'Yükleniyor...'}</span>
        </button>
        <div className="flex items-center gap-4">
          <button><Type size={20} style={{ color: theme.textPrimary }} /></button>
          <button className="relative">
            <Bell size={20} style={{ color: theme.textPrimary }} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.primary, borderTopColor: 'transparent' }} /></div>
      ) : (
        <div className="px-4 mt-4">
          {surah?.verses?.map((verse, idx) => (
            <div key={idx} className="mb-6">
              {/* Ayat header */}
              <div className="mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: theme.surface, color: theme.textSecondary, border: `1px solid ${theme.cardBorder}` }}>
                  {verse.number}. Ayet
                </span>
              </div>

              {/* Ayah Card */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                className="p-6 rounded-[24px] relative overflow-hidden"
                style={{ background: theme.surface, boxShadow: SHADOWS.sm, border: `1px solid ${theme.cardBorder}` }}
              >
                <p className="text-3xl mb-6 leading-[2.2] text-right" style={{ fontFamily: TYPOGRAPHY.fonts.arabic, color: theme.textPrimary, direction: 'rtl' }}>
                  {verse.arabic}
                </p>
                
                <p className="text-sm font-medium leading-relaxed mb-8" style={{ color: theme.textSecondary }}>
                  {verse.turkish}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                  {[
                    { icon: <Maximize2 size={18} />, label: 'Tefsir' },
                    { icon: <MoreHorizontal size={18} />, label: 'Açıklama' },
                    { icon: <Share2 size={18} />, label: 'Paylaş' },
                    { icon: <Bookmark size={18} />, label: 'Kaydet' },
                  ].map((action, i) => (
                    <button key={i} className="flex flex-col items-center gap-1.5 transition-colors hover:text-primary group" style={{ color: theme.textSecondary }}>
                      <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                        {action.icon}
                      </div>
                      <span className="text-[10px] font-semibold">{action.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Audio Player */}
      <div className="fixed bottom-[80px] left-4 right-4 z-30">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="rounded-[24px] p-4 flex flex-col gap-4 shadow-xl"
          style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                <img src="https://images.unsplash.com/photo-1592659762303-90081d34b277?auto=format&fit=crop&q=80&w=100" alt="Reciter" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: theme.textPrimary }}>{surah?.reciter?.name || 'Mishary Rashid Alafasy'}</p>
                <p className="text-[10px] font-semibold" style={{ color: theme.textSecondary }}>{surah?.name || 'Bakara'} Suresi</p>
              </div>
            </div>
            <button className="p-2"><MoreHorizontal size={18} style={{ color: theme.textSecondary }} /></button>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-medium" style={{ color: theme.textSecondary }}>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-6">
              <button className="p-1 transition-opacity hover:opacity-70"><SkipBack size={20} style={{ color: theme.textPrimary }} /></button>
              <button onClick={togglePlay} className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-md" style={{ background: theme.primary }}>
                {playing ? <Pause size={24} color="#FFF" fill="#FFF" /> : <Play size={24} color="#FFF" fill="#FFF" className="ml-1" />}
              </button>
              <button className="p-1 transition-opacity hover:opacity-70"><SkipForward size={20} style={{ color: theme.textPrimary }} /></button>
            </div>
            <span className="text-[10px] font-medium" style={{ color: theme.textSecondary }}>{formatTime(duration)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
