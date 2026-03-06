import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, ChevronDown, Youtube, BookMarked, Loader2 } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import api from '../api';

export default function SurahDetail() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reciter, setReciter] = useState('alafasy');
  const [reciters, setReciters] = useState([]);
  const [showReciters, setShowReciters] = useState(false);
  const [playingVerse, setPlayingVerse] = useState(null);
  const [playingFull, setPlayingFull] = useState(false);
  const [mealVideo, setMealVideo] = useState(null);
  const [showMealVideo, setShowMealVideo] = useState(false);
  // Tafsir state
  const [tafsirVerse, setTafsirVerse] = useState(null);
  const [tafsirScholar, setTafsirScholar] = useState(null);
  const [tafsirData, setTafsirData] = useState([]);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirScholars, setTafsirScholars] = useState([]);
  // Audio progress
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef(new Audio());
  const fullAudioRef = useRef(new Audio());

  useEffect(() => {
    api.get('/quran/reciters').then(r => setReciters(r.data)).catch(() => {});
    api.get('/tafsir/scholars').then(r => setTafsirScholars(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/quran/surah/${surahNumber}?reciter=${reciter}`),
      api.get(`/quran/surah/${surahNumber}/meal-video`),
    ]).then(([surahRes, mealRes]) => {
      setSurah(surahRes.data); setMealVideo(mealRes.data); setLoading(false);
    }).catch(() => setLoading(false));
  }, [surahNumber, reciter]);

  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setAudioProgress(audio.currentTime);
    const onMeta = () => setAudioDuration(audio.duration);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.pause(); fullAudioRef.current.pause();
    };
  }, []);

  const playVerse = useCallback((verse) => {
    if (playingVerse === verse.number) { audioRef.current.pause(); setPlayingVerse(null); return; }
    audioRef.current.pause(); fullAudioRef.current.pause(); setPlayingFull(false);
    audioRef.current.src = verse.audio_url;
    audioRef.current.play().catch(() => {});
    setPlayingVerse(verse.number);
    audioRef.current.onended = () => setPlayingVerse(null);
  }, [playingVerse]);

  const playFullSurah = () => {
    if (playingFull) { fullAudioRef.current.pause(); setPlayingFull(false); return; }
    audioRef.current.pause(); setPlayingVerse(null);
    fullAudioRef.current.src = surah.full_audio_url;
    fullAudioRef.current.play().catch(() => {});
    setPlayingFull(true);
    fullAudioRef.current.onended = () => setPlayingFull(false);
  };

  const seekAudio = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * audioDuration;
  };

  const loadTafsir = async (verseNum, scholarId) => {
    setTafsirVerse(verseNum);
    setTafsirScholar(scholarId);
    setTafsirLoading(true);
    try {
      const params = scholarId ? `?scholar=${scholarId}&lang=${lang}` : `?lang=${lang}`;
      const { data } = await api.get(`/tafsir/${surahNumber}/${verseNum}${params}`);
      setTafsirData(data);
    } catch { setTafsirData([]); }
    setTafsirLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">{t.loading}</div>;
  if (!surah) return <div className="flex items-center justify-center h-screen text-gray-500">Sure bulunamadı</div>;

  return (
    <div className="animate-fade-in pb-4" data-testid="surah-detail">
      <div className="bg-gradient-to-b from-emerald-900/40 to-transparent px-4 pt-10 pb-4">
        <button onClick={() => navigate('/quran')} className="flex items-center gap-1 text-emerald-400 text-sm mb-3" data-testid="back-to-quran">
          <ArrowLeft size={18} /> {t.surahs}
        </button>
        <div className="text-center">
          <p className="font-arabic text-3xl text-emerald-300/90 mb-1">{surah.arabic_name}</p>
          <h1 className="text-lg font-bold text-white">{surah.name}</h1>
          <p className="text-xs text-gray-400 mt-1">{surah.meaning} · {surah.total_verses} {t.verses} · {surah.revelation}</p>
        </div>

        {/* Audio Controls */}
        <div className="mt-4 glass rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setShowReciters(!showReciters)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white">
              <Volume2 size={14} />
              <span>{reciters.find(r => r.id === reciter)?.name || reciter}</span>
              <ChevronDown size={12} />
            </button>
          </div>
          {showReciters && (
            <div className="mb-3 grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto scrollbar-hide">
              {reciters.map(r => (
                <button key={r.id} onClick={() => { setReciter(r.id); setShowReciters(false); }}
                  className={`text-left text-xs p-2 rounded-lg transition-colors ${r.id === reciter ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                  {r.name}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <button onClick={playFullSurah} data-testid="play-full-surah"
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${playingFull ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}>
              {playingFull ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-500 mt-2">{playingFull ? t.playing : t.full_surah_play}</p>
          {/* Progress bar for verse audio */}
          {playingVerse && audioDuration > 0 && (
            <div className="mt-2 cursor-pointer" onClick={seekAudio}>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(audioProgress / audioDuration) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Mazlum Kiper Turkish Meal */}
        {mealVideo && (
          <div className="mt-3 glass rounded-xl overflow-hidden" data-testid="meal-audio-section">
            <button onClick={() => setShowMealVideo(!showMealVideo)}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 transition-colors" data-testid="meal-video-toggle">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <Youtube size={20} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{t.listen_meal}</p>
                <p className="text-[11px] text-gray-400">Mazlum Kiper · {mealVideo.juz}. {t.juz}</p>
              </div>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${showMealVideo ? 'rotate-180' : ''}`} />
            </button>
            {showMealVideo && (
              <div className="px-3 pb-3">
                <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe src={`${mealVideo.embed_url}?rel=0`} title="Türkçe Meal"
                    className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bismillah */}
      {surah.number !== 1 && surah.number !== 9 && (
        <div className="text-center py-4">
          <p className="font-arabic text-xl text-emerald-300/70">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>
      )}

      {/* Verses */}
      <div className="px-4 space-y-4">
        {surah.verses.map(verse => (
          <div key={verse.number} data-testid={`verse-${verse.number}`}
            className={`rounded-xl p-4 transition-all ${playingVerse === verse.number ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-white/[0.02] border border-white/5'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">{verse.number}</div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => loadTafsir(verse.number, tafsirScholar)} data-testid={`tafsir-verse-${verse.number}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-amber-400 hover:bg-amber-500/10 transition-all">
                  <BookMarked size={14} />
                </button>
                <button onClick={() => playVerse(verse)} data-testid={`play-verse-${verse.number}`}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${playingVerse === verse.number ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                  {playingVerse === verse.number ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
              </div>
            </div>
            <p className="arabic-text text-xl text-white/90 mb-4 leading-[2.5]">{verse.arabic}</p>
            {verse.turkish && (
              <p className="text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                <span className="text-emerald-400 font-medium">{verse.number}.</span> {verse.turkish}
              </p>
            )}

            {/* Tafsir Panel */}
            {tafsirVerse === verse.number && (
              <div className="mt-3 pt-3 border-t border-amber-500/20" data-testid={`tafsir-panel-${verse.number}`}>
                <div className="flex items-center gap-2 mb-3">
                  <BookMarked size={14} className="text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400">{t.tafsir}</span>
                  <button onClick={() => setTafsirVerse(null)} className="ml-auto text-[10px] text-gray-500 hover:text-white">✕</button>
                </div>
                <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide">
                  {tafsirScholars.map(s => (
                    <button key={s.id} onClick={() => loadTafsir(verse.number, s.id)}
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                        tafsirScholar === s.id ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-500 border border-white/10'
                      }`}>
                      {s.name}
                    </button>
                  ))}
                </div>
                {tafsirLoading ? (
                  <div className="flex items-center gap-2 py-4 justify-center">
                    <Loader2 size={16} className="animate-spin text-amber-400" />
                    <span className="text-xs text-gray-500">{t.loading}</span>
                  </div>
                ) : tafsirData.length > 0 ? (
                  <div className="space-y-3">
                    {tafsirData.map((td, i) => (
                      <div key={i} className="bg-amber-500/5 rounded-lg p-3">
                        <p className="text-[11px] font-semibold text-amber-300 mb-1">{td.scholar_display_name}</p>
                        <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{td.tafsir_text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 py-2">{t.select_scholar}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
