import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Volume2, ChevronDown, Youtube, BookMarked, Loader2, Sparkles, Heart, Copy, Share2, Check, BookOpen, Shield, Languages, GitCompare } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

export default function SurahDetail() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reciter, setReciter] = useState('alafasy');
  const [reciters, setReciters] = useState([]);
  const [showReciters, setShowReciters] = useState(false);
  const [playingVerse, setPlayingVerse] = useState(null);
  const [playingFull, setPlayingFull] = useState(false);
  const [mealVideo, setMealVideo] = useState(null);
  const [showMealVideo, setShowMealVideo] = useState(false);
  const [tafsirVerse, setTafsirVerse] = useState(null);
  const [tafsirScholar, setTafsirScholar] = useState(null);
  const [tafsirData, setTafsirData] = useState([]);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirScholars, setTafsirScholars] = useState([]);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef(new Audio());
  const fullAudioRef = useRef(new Audio());
  const [kissaVerse, setKissaVerse] = useState(null);
  const [kissaData, setKissaData] = useState({});
  const [kissaLoading, setKissaLoading] = useState(null);
  const [savedNotes, setSavedNotes] = useState({});
  const [copiedVerse, setCopiedVerse] = useState(null);
  const [activeTab, setActiveTab] = useState({});
  // Phase 3: Enhanced tafsir states
  const [tafsirV2Scholars, setTafsirV2Scholars] = useState([]);
  const [tafsirDetailLevel, setTafsirDetailLevel] = useState('ozet');
  const [tafsirV2Data, setTafsirV2Data] = useState({}); // { `${verse}-${scholar}-${detail}`: data }
  const [tafsirV2Loading, setTafsirV2Loading] = useState(false);
  const [compareData, setCompareData] = useState({}); // { verse: data }
  const [compareLoading, setCompareLoading] = useState(null);
  const [linguisticData, setLinguisticData] = useState({}); // { verse: data }
  const [linguisticLoading, setLinguisticLoading] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState({}); // { verse: 'scholars'|'compare'|'linguistic' }

  useEffect(() => {
    api.get('/quran/reciters').then(r => { if (Array.isArray(r.data)) setReciters(r.data); }).catch(() => {});
    api.get('/tafsir/scholars').then(r => { if (Array.isArray(r.data)) setTafsirScholars(r.data); }).catch(() => {});
    // Phase 3: Load enhanced scholars
    api.get('/tafsir/v2/scholars').then(r => { if (Array.isArray(r.data)) setTafsirV2Scholars(r.data); }).catch(() => {});
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
      setTafsirData(Array.isArray(data) ? data : []);
    } catch { setTafsirData([]); }
    setTafsirLoading(false);
  };

  // Phase 3: Enhanced tafsir with scholars + detail levels
  const loadTafsirV2 = async (verseNum, scholarId, detail) => {
    const key = `${verseNum}-${scholarId}-${detail}`;
    if (tafsirV2Data[key]) return;
    setTafsirV2Loading(true);
    try {
      const { data } = await api.get(`/tafsir/v2/${surahNumber}/${verseNum}?scholar=${scholarId}&detail=${detail}&lang=${lang}`);
      setTafsirV2Data(prev => ({ ...prev, [key]: data }));
    } catch {}
    setTafsirV2Loading(false);
  };

  // Phase 3: Compare scholars
  const loadCompare = async (verseNum) => {
    if (compareData[verseNum]) return;
    setCompareLoading(verseNum);
    try {
      const { data } = await api.get(`/tafsir/v2/${surahNumber}/${verseNum}/compare?lang=${lang}`);
      setCompareData(prev => ({ ...prev, [verseNum]: data }));
    } catch {}
    setCompareLoading(null);
  };

  // Phase 3: Linguistic analysis
  const loadLinguistic = async (verseNum) => {
    if (linguisticData[verseNum]) return;
    setLinguisticLoading(verseNum);
    try {
      const { data } = await api.get(`/tafsir/v2/${surahNumber}/${verseNum}/linguistic?lang=${lang}`);
      setLinguisticData(prev => ({ ...prev, [verseNum]: data }));
    } catch {}
    setLinguisticLoading(null);
  };

  const generateKissa = async (verse) => {
    const key = `${surahNumber}-${verse.number}`;
    if (kissaData[key]) { setKissaVerse(key); return; }
    setKissaVerse(key);
    setKissaLoading(key);
    try {
      const { data } = await api.post('/tafsir/kissa', { surah_number: parseInt(surahNumber), verse_number: verse.number });
      setKissaData(prev => ({ ...prev, [key]: data }));
    } catch {
      setKissaData(prev => ({ ...prev, [key]: { kissa: 'Kıssa oluşturulamadı. AI aktif değil veya bir hata oluştu.', error: true } }));
    }
    setKissaLoading(null);
  };

  const saveToNotes = async (verse, kissa = null) => {
    const key = `${surahNumber}-${verse.number}`;
    try {
      await api.post('/notes', {
        type: kissa ? 'kissa' : 'ayah',
        surah_number: parseInt(surahNumber),
        verse_number: verse.number,
        title: `${surah?.name || ''} - Ayet ${verse.number}`,
        content: kissa ? kissa.kissa : (verse.turkish || verse.arabic),
        scholar_name: kissa?.scholar_name || '',
      });
      setSavedNotes(prev => ({ ...prev, [key]: true }));
    } catch {}
  };

  const copyVerse = (verse) => {
    const text = `${verse.arabic}\n\n${verse.turkish}\n\n— ${surah?.name || ''} ${verse.number}. Ayet`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedVerse(verse.number);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const shareVerse = (verse) => {
    const text = `${verse.arabic}\n\n${verse.turkish}\n\n— ${surah?.name || ''} ${verse.number}. Ayet\n\n— İslami Yaşam Asistanı`;
    if (navigator.share) navigator.share({ title: `${surah?.name} ${verse.number}`, text }).catch(() => {});
    else copyVerse(verse);
  };

  const getVerseTab = (verseNum) => activeTab[verseNum] || null;
  const setVerseTab = (verseNum, tab) => {
    setActiveTab(prev => ({ ...prev, [verseNum]: prev[verseNum] === tab ? null : tab }));
    if (tab === 'tafsir') loadTafsir(verseNum, tafsirScholar);
  };

  if (loading) return <div className="flex items-center justify-center h-screen" style={{ color: theme.textSecondary }}>{t.loading}</div>;
  if (!surah) return <div className="flex items-center justify-center h-screen" style={{ color: theme.textSecondary }}>Sure bulunamadı</div>;

  return (
    <div className="animate-fade-in pb-4" data-testid="surah-detail">
      <div className="px-4 pt-10 pb-4" style={{ background: `linear-gradient(180deg, ${theme.surface}90 0%, transparent 100%)` }}>
        <button onClick={() => navigate('/quran')} className="flex items-center gap-1 text-sm mb-3" style={{ color: theme.gold }} data-testid="back-to-quran">
          <ArrowLeft size={18} /> {t.surahs}
        </button>
        <div className="text-center">
          <p className="font-arabic text-3xl mb-1" style={{ color: `${theme.gold}cc` }}>{surah.arabic_name}</p>
          <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{surah.name}</h1>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{surah.meaning} · {surah.total_verses} {t.verses} · {surah.revelation}</p>
        </div>

        <div className="glass rounded-xl p-3 mt-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setShowReciters(!showReciters)} className="flex items-center gap-1 text-xs" style={{ color: theme.textSecondary }}>
              <Volume2 size={14} />
              <span>{reciters.find(r => r.id === reciter)?.name || reciter}</span>
              <ChevronDown size={12} />
            </button>
          </div>
          {showReciters && (
            <div className="mb-3 grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto scrollbar-hide">
              {reciters.map(r => (
                <button key={r.id} onClick={() => { setReciter(r.id); setShowReciters(false); }}
                  className="text-left text-xs p-2 rounded-lg transition-colors"
                  style={{ background: r.id === reciter ? `${theme.gold}20` : theme.inputBg, color: r.id === reciter ? theme.gold : theme.textSecondary }}>
                  {r.name}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <button onClick={playFullSurah} data-testid="play-full-surah"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{ background: playingFull ? theme.gold : `${theme.gold}30`, color: playingFull ? '#fff' : theme.gold }}>
              {playingFull ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
          </div>
          <p className="text-center text-[10px] mt-2" style={{ color: theme.textSecondary }}>{playingFull ? t.playing : t.full_surah_play}</p>
          {playingVerse && audioDuration > 0 && (
            <div className="mt-2 cursor-pointer" onClick={seekAudio}>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: theme.inputBg }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(audioProgress / audioDuration) * 100}%`, background: theme.gold }} />
              </div>
            </div>
          )}
        </div>

        {mealVideo && (
          <div className="mt-3 glass rounded-xl overflow-hidden" data-testid="meal-audio-section">
            <button onClick={() => setShowMealVideo(!showMealVideo)}
              className="w-full flex items-center gap-3 p-3 text-left transition-colors" data-testid="meal-video-toggle">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <Youtube size={20} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{t.listen_meal}</p>
                <p className="text-[11px]" style={{ color: theme.textSecondary }}>Mazlum Kiper · {mealVideo.juz}. {t.juz}</p>
              </div>
              <ChevronDown size={16} className={`transition-transform ${showMealVideo ? 'rotate-180' : ''}`} style={{ color: theme.textSecondary }} />
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

      {surah.number !== 1 && surah.number !== 9 && (
        <div className="text-center py-4">
          <p className="font-arabic text-xl" style={{ color: `${theme.gold}99` }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>
      )}

      <div className="px-4 space-y-4">
        {(Array.isArray(surah.verses) ? surah.verses : []).map(verse => {
          const kissaKey = `${surahNumber}-${verse.number}`;
          const currentTab = getVerseTab(verse.number);
          return (
          <div key={verse.number} data-testid={`verse-${verse.number}`}
            className="rounded-xl p-4 transition-all"
            style={{
              background: playingVerse === verse.number ? `${theme.gold}15` : theme.inputBg,
              border: `1px solid ${playingVerse === verse.number ? `${theme.gold}40` : theme.cardBorder}`,
            }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: `${theme.gold}15`, color: theme.gold }}>
                {verse.number}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => playVerse(verse)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: playingVerse === verse.number ? theme.gold : theme.inputBg, color: playingVerse === verse.number ? '#fff' : theme.textSecondary }}>
                  {playingVerse === verse.number ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                <button onClick={() => copyVerse(verse)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: theme.inputBg, color: copiedVerse === verse.number ? '#22c55e' : theme.textSecondary }}>
                  {copiedVerse === verse.number ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button onClick={() => shareVerse(verse)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: theme.inputBg, color: theme.textSecondary }}>
                  <Share2 size={14} />
                </button>
                <button onClick={() => saveToNotes(verse, kissaData[kissaKey])}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: theme.inputBg, color: savedNotes[kissaKey] ? '#ef4444' : theme.textSecondary }}>
                  <Heart size={14} fill={savedNotes[kissaKey] ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            <p className="arabic-text text-xl mb-4 leading-[2.5]" style={{ color: `${theme.textPrimary}ee` }}>{verse.arabic}</p>

            {verse.turkish && (
              <p className="text-sm leading-relaxed pt-3" style={{ color: theme.textSecondary, borderTop: `1px solid ${theme.cardBorder}` }}>
                <span className="font-medium" style={{ color: theme.gold }}>{verse.number}.</span> {verse.turkish}
              </p>
            )}

            <div className="flex gap-1 mt-3 pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
              {[
                { id: 'meal', label: 'Meal', icon: BookOpen, color: '#3b82f6' },
                { id: 'tafsir', label: 'Tefsir', icon: BookMarked, color: '#f59e0b' },
                { id: 'kissa', label: 'Kıssa', icon: Sparkles, color: theme.gold },
              ].map(tab => (
                <button key={tab.id}
                  onClick={() => { setVerseTab(verse.number, tab.id); if (tab.id === 'kissa') generateKissa(verse); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                  style={{
                    background: currentTab === tab.id ? `${tab.color}20` : theme.inputBg,
                    color: currentTab === tab.id ? tab.color : theme.textSecondary,
                    border: `1px solid ${currentTab === tab.id ? `${tab.color}40` : 'transparent'}`,
                  }}>
                  <tab.icon size={12} />
                  {tab.label}
                </button>
              ))}
            </div>

            {currentTab === 'meal' && (
              <div className="mt-3 animate-fade-in rounded-lg p-3" style={{ background: '#3b82f610' }}>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} style={{ color: '#3b82f6' }} />
                  <span className="text-xs font-semibold" style={{ color: '#3b82f6' }}>Türkçe Meal</span>
                  <button onClick={() => setVerseTab(verse.number, null)} className="ml-auto text-[10px]" style={{ color: theme.textSecondary }}>✕</button>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{verse.turkish || 'Meal verisi bulunamadı.'}</p>
                {verse.english && (
                  <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                    <p className="text-[10px] font-medium mb-1" style={{ color: '#3b82f6' }}>English</p>
                    <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>{verse.english}</p>
                  </div>
                )}
              </div>
            )}

            {currentTab === 'tafsir' && (
              <div className="mt-3 animate-fade-in rounded-lg p-3" style={{ background: '#f59e0b10' }}>
                <div className="flex items-center gap-2 mb-2">
                  <BookMarked size={14} style={{ color: '#f59e0b' }} />
                  <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>{t.tafsir}</span>
                  <button onClick={() => setVerseTab(verse.number, null)} className="ml-auto text-[10px]" style={{ color: theme.textSecondary }}>✕</button>
                </div>

                {/* Sub-tabs: Scholars | Compare | Linguistic */}
                <div className="flex gap-1 mb-3">
                  {[
                    { id: 'scholars', label: 'Alimler', icon: '📗' },
                    { id: 'compare', label: 'Karşılaştır', icon: '⚖️' },
                    { id: 'linguistic', label: 'Dilbilim', icon: '🔤' },
                  ].map(st => (
                    <button key={st.id}
                      onClick={() => {
                        setActiveSubTab(prev => ({ ...prev, [verse.number]: st.id }));
                        if (st.id === 'compare') loadCompare(verse.number);
                        if (st.id === 'linguistic') loadLinguistic(verse.number);
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] font-medium transition-all"
                      style={{
                        background: (activeSubTab[verse.number] || 'scholars') === st.id ? '#f59e0b20' : theme.inputBg,
                        color: (activeSubTab[verse.number] || 'scholars') === st.id ? '#f59e0b' : theme.textSecondary,
                      }}>
                      {st.icon} {st.label}
                    </button>
                  ))}
                </div>

                {/* Detail Level */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-[9px]" style={{ color: theme.textSecondary }}>Detay:</span>
                  {[{ id: 'ozet', label: 'Özet' }, { id: 'sadele', label: 'Sadeleştirilmiş' }, { id: 'akademik', label: 'Akademik' }].map(dl => (
                    <button key={dl.id} onClick={() => setTafsirDetailLevel(dl.id)}
                      className="px-1.5 py-0.5 rounded-full text-[8px] font-medium transition-all"
                      style={tafsirDetailLevel === dl.id ? { background: '#f59e0b', color: '#fff' } : { background: theme.inputBg, color: theme.textSecondary }}>
                      {dl.label}
                    </button>
                  ))}
                </div>

                {/* Scholars sub-tab */}
                {(activeSubTab[verse.number] || 'scholars') === 'scholars' && (
                  <>
                    <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide pb-1">
                      {(tafsirV2Scholars.length > 0 ? tafsirV2Scholars : tafsirScholars).map(s => (
                        <button key={s.id} onClick={() => {
                          if (tafsirV2Scholars.length > 0) {
                            loadTafsirV2(verse.number, s.id, tafsirDetailLevel);
                          } else {
                            loadTafsir(verse.number, s.id);
                          }
                          setTafsirScholar(s.id);
                        }}
                          className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors"
                          style={{
                            background: tafsirScholar === s.id ? '#f59e0b20' : theme.inputBg,
                            color: tafsirScholar === s.id ? '#f59e0b' : theme.textSecondary,
                            border: `1px solid ${tafsirScholar === s.id ? '#f59e0b40' : theme.cardBorder}`,
                          }}>
                          {s.icon || '📗'} {s.name}
                          {s.premium && <span className="ml-0.5 text-[7px]">★</span>}
                        </button>
                      ))}
                    </div>
                    {(tafsirLoading || tafsirV2Loading) ? (
                      <div className="flex items-center gap-2 py-4 justify-center">
                        <Loader2 size={16} className="animate-spin" style={{ color: '#f59e0b' }} />
                        <span className="text-xs" style={{ color: theme.textSecondary }}>{t.loading}</span>
                      </div>
                    ) : (() => {
                      const v2Key = `${verse.number}-${tafsirScholar}-${tafsirDetailLevel}`;
                      const v2 = tafsirV2Data[v2Key];
                      if (v2) return (
                        <div className="rounded-lg p-3" style={{ background: '#f59e0b08' }}>
                          <p className="text-[11px] font-semibold mb-1" style={{ color: '#f59e0b' }}>
                            {v2.scholar_name} <span className="text-[9px] font-normal">({v2.school || ''})</span>
                          </p>
                          <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: theme.textPrimary }}>{v2.tafsir}</p>
                          {v2.confidence && (
                            <div className="flex items-center gap-1 mt-2">
                              <Shield size={9} style={{ color: v2.confidence.level === 'high' ? '#10B981' : '#F59E0B' }} />
                              <span className="text-[8px]" style={{ color: theme.textSecondary }}>
                                Güven: {v2.confidence.level === 'high' ? 'Yüksek' : v2.confidence.level === 'medium' ? 'Orta' : 'Düşük'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                      if (tafsirData.length > 0) return (
                        <div className="space-y-3">
                          {tafsirData.map((td, i) => (
                            <div key={i} className="rounded-lg p-3" style={{ background: '#f59e0b08' }}>
                              <p className="text-[11px] font-semibold mb-1" style={{ color: '#f59e0b' }}>{td.scholar_display_name}</p>
                              <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: theme.textPrimary }}>{td.tafsir_text}</p>
                            </div>
                          ))}
                        </div>
                      );
                      return (
                        <p className="text-xs py-2" style={{ color: theme.textSecondary }}>
                          {tafsirScholars.length > 0 || tafsirV2Scholars.length > 0 ? 'Bir müfessir seçerek başlayın' : 'AI aktif değil.'}
                        </p>
                      );
                    })()}
                  </>
                )}

                {/* Compare sub-tab */}
                {activeSubTab[verse.number] === 'compare' && (
                  compareLoading === verse.number ? (
                    <div className="flex items-center gap-2 py-4 justify-center">
                      <Loader2 size={16} className="animate-spin" style={{ color: '#f59e0b' }} />
                      <span className="text-xs" style={{ color: theme.textSecondary }}>Karşılaştırma hazırlanıyor...</span>
                    </div>
                  ) : compareData[verse.number] ? (
                    <div className="space-y-2">
                      {(compareData[verse.number].comparisons || []).map((c, i) => (
                        <div key={i} className="rounded-lg p-2.5" style={{ background: '#f59e0b06', border: `1px solid ${theme.cardBorder}` }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-sm">{c.icon || '📗'}</span>
                            <span className="text-[10px] font-bold" style={{ color: '#f59e0b' }}>{c.scholar_name}</span>
                            <span className="text-[8px]" style={{ color: theme.textSecondary }}>{c.school}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed" style={{ color: theme.textPrimary }}>{c.summary}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs py-2" style={{ color: theme.textSecondary }}>Karşılaştırma verisi yüklenmedi.</p>
                  )
                )}

                {/* Linguistic sub-tab */}
                {activeSubTab[verse.number] === 'linguistic' && (
                  linguisticLoading === verse.number ? (
                    <div className="flex items-center gap-2 py-4 justify-center">
                      <Loader2 size={16} className="animate-spin" style={{ color: '#f59e0b' }} />
                      <span className="text-xs" style={{ color: theme.textSecondary }}>Dilbilim analizi...</span>
                    </div>
                  ) : linguisticData[verse.number] ? (
                    <div className="space-y-2">
                      {['nahiv', 'sarf', 'belagat', 'semantik'].map(section => (
                        linguisticData[verse.number].analysis?.[section] && (
                          <div key={section} className="rounded-lg p-2.5" style={{ background: '#f59e0b06' }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>
                              {section === 'nahiv' ? '🔤 Nahiv (Sentaks)' : section === 'sarf' ? '📝 Sarf (Morfoloji)' : section === 'belagat' ? '✨ Belagat (Retorik)' : '🎯 Semantik'}
                            </p>
                            <p className="text-[11px] leading-relaxed whitespace-pre-wrap" style={{ color: theme.textPrimary }}>
                              {linguisticData[verse.number].analysis[section]}
                            </p>
                          </div>
                        )
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs py-2" style={{ color: theme.textSecondary }}>Dilbilim analizi yüklenmedi.</p>
                  )
                )}
              </div>
            )}

            {currentTab === 'kissa' && (
              <div className="mt-3 animate-fade-in rounded-lg p-3" style={{ background: `${theme.gold}10` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} style={{ color: theme.gold }} />
                  <span className="text-xs font-semibold" style={{ color: theme.gold }}>Kıssa & Hikaye</span>
                  {kissaData[kissaKey]?.scholar_name && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${theme.gold}15`, color: theme.gold }}>{kissaData[kissaKey].scholar_name}</span>
                  )}
                  <button onClick={() => setVerseTab(verse.number, null)} className="ml-auto text-[10px]" style={{ color: theme.textSecondary }}>✕</button>
                </div>
                {kissaLoading === kissaKey ? (
                  <div className="flex items-center gap-2 py-4 justify-center">
                    <Loader2 size={16} className="animate-spin" style={{ color: theme.gold }} />
                    <span className="text-xs" style={{ color: theme.textSecondary }}>Kıssa oluşturuluyor...</span>
                  </div>
                ) : kissaData[kissaKey] ? (
                  <>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: theme.textPrimary }}>{kissaData[kissaKey].kissa}</p>
                    <div className="flex gap-2 mt-2 pt-2" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                      <button onClick={() => saveToNotes(verse, kissaData[kissaKey])}
                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-colors"
                        style={{ background: `${theme.gold}15`, color: theme.gold }}>
                        <Heart size={10} fill={savedNotes[kissaKey] ? 'currentColor' : 'none'} /> {savedNotes[kissaKey] ? 'Kaydedildi' : 'Kaydet'}
                      </button>
                      <button onClick={() => { navigator.clipboard.writeText(kissaData[kissaKey].kissa).catch(() => {}); }}
                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-colors"
                        style={{ background: `${theme.gold}15`, color: theme.gold }}>
                        <Copy size={10} /> Kopyala
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs py-2" style={{ color: theme.textSecondary }}>AI aktif değil. Kıssa için Gemini API key gereklidir.</p>
                )}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
