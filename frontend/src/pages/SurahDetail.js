import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Volume2, ChevronDown, Youtube, BookMarked, Loader2, Sparkles, Heart, Copy, Share2, Check, BookOpen, Shield, Languages, GitCompare, Star, Bookmark, Download, CheckCircle } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import PreReadingDua from '../components/PreReadingDua';
import api from '../api';
import { openDB } from 'idb';

const TAFSIR_DB_NAME = 'tafsir-offline';
const TAFSIR_STORE = 'tafsir-data';
async function getTafsirDB() {
  return openDB(TAFSIR_DB_NAME, 1, {
    upgrade(db) { if (!db.objectStoreNames.contains(TAFSIR_STORE)) db.createObjectStore(TAFSIR_STORE); },
  });
}
async function getCachedTafsir(key) {
  try { const db = await getTafsirDB(); return await db.get(TAFSIR_STORE, key); } catch { return null; }
}
async function setCachedTafsir(key, data) {
  try { const db = await getTafsirDB(); await db.put(TAFSIR_STORE, data, key); } catch {}
}
async function isSurahDownloaded(surah, scholar, detail, lang) {
  try {
    const db = await getTafsirDB();
    const key = `downloaded:${surah}:${scholar}:${detail}:${lang}`;
    return !!(await db.get(TAFSIR_STORE, key));
  } catch { return false; }
}

const surahI18n = {
  tr: { back: 'Sureler', verses: 'ayet', playing: 'Oynatılıyor...', fullPlay: 'Tüm sureyi dinle', listenMeal: 'Türkçe Meal Dinle', juz: 'Cüz', meal: 'Meal', tafsir: 'Tefsir', kissa: 'Kıssa', scholars: 'Alimler', compare: 'Karşılaştır', linguistic: 'Dilbilim', detail: 'Detay', summary: 'Özet', simplified: 'Sadeleştirilmiş', academic: 'Akademik', selectScholar: 'Bir müfessir seçerek başlayın', aiOff: 'AI aktif değil.', generating: 'Kıssa oluşturuluyor...', saved: 'Kaydedildi', save: 'Kaydet', copy: 'Kopyala', noData: 'Veri bulunamadı.', preparing: 'Hazırlanıyor...', noTafsir: 'Tefsir verisi bulunamadı.', loading: 'Yükleniyor...', surahNotFound: 'Sure bulunamadı', tMeal: 'Türkçe Meal', english: 'English', confidence: 'Güven', high: 'Yüksek', medium: 'Orta', low: 'Düşük', kissaTitle: 'Kıssa & Hikaye', kissaAiOff: 'AI aktif değil. Kıssa için Gemini API key gereklidir.', nahiv: 'Nahiv (Sentaks)', sarf: 'Sarf (Morfoloji)', belagat: 'Belagat (Retorik)', semantik: 'Semantik', lingLoading: 'Dilbilim analizi...', compLoading: 'Karşılaştırma hazırlanıyor...', noLing: 'Dilbilim analizi yüklenmedi.', noComp: 'Karşılaştırma verisi yüklenmedi.', bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', downloadOffline: 'Çevrimdışı İndir', downloading: 'İndiriliyor...', downloaded: 'İndirildi ✓', downloadFail: 'İndirme başarısız' },
  en: { back: 'Surahs', verses: 'verses', playing: 'Playing...', fullPlay: 'Listen full surah', listenMeal: 'Listen Translation', juz: 'Juz', meal: 'Translation', tafsir: 'Tafsir', kissa: 'Story', scholars: 'Scholars', compare: 'Compare', linguistic: 'Linguistic', detail: 'Detail', summary: 'Summary', simplified: 'Simplified', academic: 'Academic', selectScholar: 'Select a scholar to begin', aiOff: 'AI is not active.', generating: 'Generating story...', saved: 'Saved', save: 'Save', copy: 'Copy', noData: 'No data found.', preparing: 'Preparing...', noTafsir: 'No tafsir data found.', loading: 'Loading...', surahNotFound: 'Surah not found', tMeal: 'Translation', english: 'English', confidence: 'Confidence', high: 'High', medium: 'Medium', low: 'Low', kissaTitle: 'Story & Narrative', kissaAiOff: 'AI not active. Gemini API key required.', nahiv: 'Nahw (Syntax)', sarf: 'Sarf (Morphology)', belagat: 'Balagha (Rhetoric)', semantik: 'Semantics', lingLoading: 'Linguistic analysis...', compLoading: 'Preparing comparison...', noLing: 'Linguistic data not loaded.', noComp: 'Comparison data not loaded.', bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', downloadOffline: 'Download Offline', downloading: 'Downloading...', downloaded: 'Downloaded ✓', downloadFail: 'Download failed' },
  ar: { back: 'السور', verses: 'آيات', playing: 'قيد التشغيل...', fullPlay: 'استمع للسورة كاملة', listenMeal: 'استمع للترجمة', juz: 'جزء', meal: 'الترجمة', tafsir: 'التفسير', kissa: 'القصة', scholars: 'العلماء', compare: 'مقارنة', linguistic: 'لغوي', detail: 'التفصيل', summary: 'ملخص', simplified: 'مبسط', academic: 'أكاديمي', selectScholar: 'اختر مفسرًا للبدء', aiOff: 'الذكاء الاصطناعي غير نشط.', generating: 'جاري إنشاء القصة...', saved: 'تم الحفظ', save: 'حفظ', copy: 'نسخ', noData: 'لا توجد بيانات.', preparing: 'جاري التحضير...', noTafsir: 'لا توجد بيانات تفسير.', loading: 'جاري التحميل...', surahNotFound: 'لم يتم العثور على السورة', tMeal: 'الترجمة', english: 'English', confidence: 'الثقة', high: 'عالية', medium: 'متوسطة', low: 'منخفضة', kissaTitle: 'القصة والرواية', kissaAiOff: 'الذكاء الاصطناعي غير نشط.', nahiv: 'النحو', sarf: 'الصرف', belagat: 'البلاغة', semantik: 'الدلالة', lingLoading: 'تحليل لغوي...', compLoading: 'جاري تحضير المقارنة...', noLing: 'لم يتم تحميل التحليل اللغوي.', noComp: 'لم يتم تحميل بيانات المقارنة.', bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', downloadOffline: 'تحميل بلا إنترنت', downloading: 'جاري التحميل...', downloaded: 'تم التحميل ✓', downloadFail: 'فشل التحميل' },
};

export default function SurahDetail() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const txt = surahI18n[lang] || surahI18n.tr;
  const isRTL = lang === 'ar';
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
  const [tafsirV2Scholars, setTafsirV2Scholars] = useState([]);
  const [tafsirDetailLevel, setTafsirDetailLevel] = useState('simplified');
  const [tafsirV2Data, setTafsirV2Data] = useState({});
  const [tafsirV2Loading, setTafsirV2Loading] = useState(false);
  const [compareData, setCompareData] = useState({});
  const [compareLoading, setCompareLoading] = useState(null);
  const [linguisticData, setLinguisticData] = useState({});
  const [linguisticLoading, setLinguisticLoading] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState({});
  const [showDua, setShowDua] = useState(false);
  const [downloadingTafsir, setDownloadingTafsir] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [surahDownloaded, setSurahDownloaded] = useState({});
  const [aiTafsirData, setAiTafsirData] = useState({});
  const [aiTafsirLoading, setAiTafsirLoading] = useState(null);
  const [aiTafsirStyle, setAiTafsirStyle] = useState('simple');

  const AI_TAFSIR_STYLES = [
    { id: 'simple', name: 'Basit', icon: '📖', color: '#3b82f6' },
    { id: 'classical', name: 'Klasik', icon: '📜', color: '#f59e0b' },
    { id: 'deep', name: 'Derin Analiz', icon: '🔬', color: '#8b5cf6' },
    { id: 'modern', name: 'Modern', icon: '🌍', color: '#10b981' },
    { id: 'psychological', name: 'Psikolojik', icon: '🧠', color: '#ec4899' },
    { id: 'wisdom', name: 'Hikmet', icon: '💎', color: '#C8A55A' },
  ];

  const loadAiTafsir = async (verseNum, style) => {
    const key = `${verseNum}-${style}`;
    if (aiTafsirData[key]) return;
    setAiTafsirLoading(key);
    try {
      const { data } = await api.post('/tafsir/advanced', { surah: parseInt(surahNumber), verse: verseNum, style, language: lang }, { timeout: 30000 });
      setAiTafsirData(prev => ({ ...prev, [key]: data }));
    } catch {
      setAiTafsirData(prev => ({ ...prev, [key]: { error: true, tafsir: 'Tefsir oluşturulamadı. Lütfen tekrar deneyin.' } }));
    }
    setAiTafsirLoading(null);
  };

  useEffect(() => {
    api.get('/quran/reciters').then(r => { if (Array.isArray(r.data)) setReciters(r.data); }).catch(() => {});
    api.get('/tafsir/scholars').then(r => { if (Array.isArray(r.data)) setTafsirScholars(r.data); }).catch(() => {});
    api.get('/tafsir/v2/scholars').then(r => { if (Array.isArray(r.data)) setTafsirV2Scholars(r.data); }).catch(() => {});
    // Show dua on first visit per session
    if (!sessionStorage.getItem('quran_dua_seen')) {
      setShowDua(true);
    }
    // Check offline download status for all scholars
    (async () => {
      const scholars = ['elmalili', 'ibn_kesir', 'taberi', 'razi', 'kurtubi'];
      const details = ['summary', 'simplified', 'academic'];
      const dlStatus = {};
      for (const s of scholars) {
        for (const d of details) {
          const isDL = await isSurahDownloaded(surahNumber, s, d, lang);
          if (isDL) dlStatus[`${s}-${d}`] = true;
        }
      }
      setSurahDownloaded(dlStatus);
    })();
  }, [surahNumber, lang]);

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
    setTafsirVerse(verseNum); setTafsirScholar(scholarId); setTafsirLoading(true);
    try {
      const params = scholarId ? `?scholar=${scholarId}&lang=${lang}` : `?lang=${lang}`;
      const { data } = await api.get(`/tafsir/v1/${surahNumber}/${verseNum}${params}`);
      setTafsirData(Array.isArray(data) ? data : []);
    } catch { setTafsirData([]); }
    setTafsirLoading(false);
  };

  const loadTafsirV2 = async (verseNum, scholarId, detail) => {
    const key = `${verseNum}-${scholarId}-${detail}`;
    if (tafsirV2Data[key]) return;
    // Check IDB cache first
    const cacheKey = `tafsir:${surahNumber}:${verseNum}:${scholarId}:${detail}:${lang}`;
    const cached = await getCachedTafsir(cacheKey);
    if (cached) { setTafsirV2Data(prev => ({ ...prev, [key]: cached })); return; }
    setTafsirV2Loading(true);
    try {
      const { data } = await api.get(`/tafsir/v2/${surahNumber}/${verseNum}?scholar=${scholarId}&detail=${detail}&lang=${lang}`);
      if (data && data.tafsir_text) {
        setTafsirV2Data(prev => ({ ...prev, [key]: data }));
        await setCachedTafsir(cacheKey, data);
      } else if (data && data.premium_required) {
        setTafsirV2Data(prev => ({ ...prev, [key]: { error: true, message: data.message || 'Premium gerekli' } }));
      }
    } catch (err) {
      console.error('Tafsir V2 error:', err);
      // Fallback to v1 endpoint
      try {
        const { data } = await api.get(`/tafsir/v1/${surahNumber}/${verseNum}?scholar=${scholarId}&lang=${lang}`);
        if (Array.isArray(data) && data.length > 0) {
          const fallback = {
            scholar: { id: scholarId, name: data[0].scholar_display_name || scholarId },
            tafsir_text: data[0].tafsir_text,
            detail_level: detail,
          };
          setTafsirV2Data(prev => ({ ...prev, [key]: fallback }));
          await setCachedTafsir(cacheKey, fallback);
        } else {
          setTafsirV2Data(prev => ({ ...prev, [key]: { error: true, message: txt.noTafsir } }));
        }
      } catch {
        setTafsirV2Data(prev => ({ ...prev, [key]: { error: true, message: txt.aiOff } }));
      }
    }
    setTafsirV2Loading(false);
  };

  const downloadSurahTafsir = async (scholarId) => {
    if (!surah || downloadingTafsir) return;
    setDownloadingTafsir(true); setDownloadProgress(0);
    try {
      const totalVerses = surah.total_verses || surah.verses?.length || 7;
      const { data } = await api.get(`/tafsir/v2/${surahNumber}/download?scholar=${scholarId}&detail=${tafsirDetailLevel}&lang=${lang}&total_verses=${totalVerses}`);
      if (data.tafsirs) {
        for (let i = 0; i < data.tafsirs.length; i++) {
          const t = data.tafsirs[i];
          if (!t.error) {
            const cacheKey = `tafsir:${surahNumber}:${t.verse}:${scholarId}:${tafsirDetailLevel}:${lang}`;
            await setCachedTafsir(cacheKey, t);
            const stateKey = `${t.verse}-${scholarId}-${tafsirDetailLevel}`;
            setTafsirV2Data(prev => ({ ...prev, [stateKey]: t }));
          }
          setDownloadProgress(Math.round(((i + 1) / data.tafsirs.length) * 100));
        }
        const dlKey = `downloaded:${surahNumber}:${scholarId}:${tafsirDetailLevel}:${lang}`;
        const db = await getTafsirDB();
        await db.put(TAFSIR_STORE, true, dlKey);
        setSurahDownloaded(prev => ({ ...prev, [`${scholarId}-${tafsirDetailLevel}`]: true }));
      }
    } catch {}
    setDownloadingTafsir(false);
  };

  const loadCompare = async (verseNum) => {
    if (compareData[verseNum]) return;
    setCompareLoading(verseNum);
    try {
      const { data } = await api.get(`/tafsir/v2/${surahNumber}/${verseNum}/compare?lang=${lang}`);
      setCompareData(prev => ({ ...prev, [verseNum]: data }));
    } catch {
      setCompareData(prev => ({ ...prev, [verseNum]: { comparisons: [], error: true } }));
    }
    setCompareLoading(null);
  };

  const loadLinguistic = async (verseNum) => {
    if (linguisticData[verseNum]) return;
    setLinguisticLoading(verseNum);
    try {
      const { data } = await api.get(`/tafsir/v2/${surahNumber}/${verseNum}/linguistic?lang=${lang}`);
      setLinguisticData(prev => ({ ...prev, [verseNum]: data }));
    } catch {
      setLinguisticData(prev => ({ ...prev, [verseNum]: { analysis: null, error: true } }));
    }
    setLinguisticLoading(null);
  };

  const generateKissa = async (verse) => {
    const key = `${surahNumber}-${verse.number}`;
    if (kissaData[key]) { setKissaVerse(key); return; }
    setKissaVerse(key); setKissaLoading(key);
    try {
      const { data } = await api.post('/tafsir/kissa', { surah_number: parseInt(surahNumber), verse_number: verse.number });
      setKissaData(prev => ({ ...prev, [key]: data }));
    } catch {
      setKissaData(prev => ({ ...prev, [key]: { kissa: txt.kissaAiOff, error: true } }));
    }
    setKissaLoading(null);
  };

  const saveToNotes = async (verse, kissa = null) => {
    const key = `${surahNumber}-${verse.number}`;
    try {
      await api.post('/notes', {
        type: kissa ? 'kissa' : 'ayah', surah_number: parseInt(surahNumber), verse_number: verse.number,
        title: `${surah?.name || ''} - ${txt.verses} ${verse.number}`,
        content: kissa ? kissa.kissa : (verse.turkish || verse.arabic), scholar_name: kissa?.scholar_name || '',
      });
      setSavedNotes(prev => ({ ...prev, [key]: true }));
    } catch {}
  };

  const copyVerse = (verse) => {
    const text = `${verse.arabic}\n\n${verse.turkish || ''}\n\n— ${surah?.name || ''} ${verse.number}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedVerse(verse.number);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const shareVerse = (verse) => {
    const text = `${verse.arabic}\n\n${verse.turkish || ''}\n\n— ${surah?.name || ''} ${verse.number}`;
    if (navigator.share) navigator.share({ title: `${surah?.name} ${verse.number}`, text }).catch(() => {});
    else copyVerse(verse);
  };

  const getVerseTab = (verseNum) => activeTab[verseNum] || null;
  const setVerseTab = (verseNum, tab) => {
    setActiveTab(prev => ({ ...prev, [verseNum]: prev[verseNum] === tab ? null : tab }));
    if (tab === 'tafsir') loadTafsir(verseNum, tafsirScholar);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ color: theme.textSecondary }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: theme.gold, borderTopColor: 'transparent' }} />
        <p className="text-sm">{txt.loading}</p>
      </div>
    </div>
  );

  if (!surah) return (
    <div className="flex items-center justify-center h-screen" style={{ color: theme.textSecondary }}>
      <p>{txt.surahNotFound}</p>
    </div>
  );

  return (
    <div className="animate-fade-in pb-4" style={{ direction: isRTL ? 'rtl' : 'ltr' }} data-testid="surah-detail">
      <PreReadingDua show={showDua} onClose={() => { setShowDua(false); sessionStorage.setItem('quran_dua_seen', '1'); }} />

      {/* Premium Header */}
      <div className="quran-header-bg px-4 pt-5 pb-3">
        {/* Decorative geometric bg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.025]">
          <svg className="absolute top-0 right-0 w-48 h-48 animate-geometric-spin" viewBox="0 0 200 200" fill="none">
            <polygon points="100,15 130,45 165,45 140,70 150,105 100,82 50,105 60,70 35,45 70,45" stroke={theme.gold} strokeWidth="0.5"/>
            <circle cx="100" cy="100" r="75" stroke={theme.gold} strokeWidth="0.3"/>
          </svg>
        </div>

        <div className="relative">
          <button onClick={() => navigate('/quran')} className="flex items-center gap-1.5 text-sm mb-2 transition-all active:scale-95" style={{ color: theme.gold }} data-testid="back-to-quran">
            <ArrowLeft size={18} /> {txt.back}
          </button>

          {/* Surah Title Card */}
          <motion.div
            className="text-center mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-arabic text-4xl mb-2 animate-float" style={{ color: `${theme.gold}cc`, fontFamily: 'Amiri, serif', direction: 'rtl' }}>{surah.arabic_name}</p>
            <h1 className="text-xl font-bold mb-1" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>{surah.name}</h1>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: `${theme.gold}10`, color: theme.gold, border: `1px solid ${theme.gold}15` }}>
                {surah.meaning}
              </span>
              <span className="text-xs" style={{ color: theme.textSecondary }}>{surah.total_verses} {txt.verses}</span>
              <span className="text-[10px]" style={{ color: `${theme.textSecondary}60` }}>·</span>
              <span className="text-xs" style={{ color: theme.textSecondary }}>{surah.revelation}</span>
            </div>
          </motion.div>

          {/* Audio Player Card */}
          <motion.div
            className="rounded-2xl p-4 mb-3"
            style={{ background: `${theme.surface}90`, border: `1px solid ${theme.gold}10`, backdropFilter: 'blur(16px)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Reciter selector */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setShowReciters(!showReciters)} className="flex items-center gap-1.5 text-xs transition-all" style={{ color: theme.textSecondary }}>
                <Volume2 size={14} />
                <span>{reciters.find(r => r.id === reciter)?.name || reciter}</span>
                <ChevronDown size={12} className={`transition-transform ${showReciters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <AnimatePresence>
              {showReciters && (
                <motion.div
                  className="mb-3 grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto scrollbar-hide"
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {reciters.map(r => (
                    <button key={r.id} onClick={() => { setReciter(r.id); setShowReciters(false); }}
                      className="text-left text-xs p-2.5 rounded-xl transition-all"
                      style={{
                        background: r.id === reciter ? `${theme.gold}15` : theme.inputBg,
                        color: r.id === reciter ? theme.gold : theme.textSecondary,
                        border: r.id === reciter ? `1px solid ${theme.gold}25` : '1px solid transparent',
                      }}>
                      {r.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Play button */}
            <div className="flex items-center justify-center gap-4">
              <button onClick={playFullSurah} data-testid="play-full-surah"
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: playingFull ? `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight || theme.gold}dd)` : `${theme.gold}18`,
                  color: playingFull ? '#0A1F14' : theme.gold,
                  boxShadow: playingFull ? `0 4px 20px ${theme.gold}30` : 'none',
                }}>
                {playingFull ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
              </button>
            </div>
            <p className="text-center text-[10px] mt-2" style={{ color: theme.textSecondary }}>
              {playingFull ? txt.playing : txt.fullPlay}
            </p>

            {/* Progress bar */}
            {playingVerse && audioDuration > 0 && (
              <div className="mt-3 cursor-pointer" onClick={seekAudio}>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: theme.inputBg }}>
                  <motion.div className="h-full rounded-full"
                    style={{ width: `${(audioProgress / audioDuration) * 100}%`, background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight || theme.gold})` }}
                    transition={{ duration: 0.1 }} />
                </div>
              </div>
            )}
          </motion.div>

          {/* Meal Video */}
          {mealVideo && (
            <motion.div
              className="rounded-2xl overflow-hidden"
              style={{ background: `${theme.surface}80`, border: `1px solid ${theme.cardBorder}`, backdropFilter: 'blur(12px)' }}
              data-testid="meal-audio-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <button onClick={() => setShowMealVideo(!showMealVideo)}
                className="w-full flex items-center gap-3 p-3.5 text-left transition-all" data-testid="meal-video-toggle">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                  <Youtube size={18} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{txt.listenMeal}</p>
                  <p className="text-[11px]" style={{ color: theme.textSecondary }}>Mazlum Kiper · {mealVideo.juz}. {txt.juz}</p>
                </div>
                <ChevronDown size={16} className={`transition-transform ${showMealVideo ? 'rotate-180' : ''}`} style={{ color: theme.textSecondary }} />
              </button>
              <AnimatePresence>
                {showMealVideo && (
                  <motion.div className="px-3.5 pb-3.5"
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <iframe src={`${mealVideo.embed_url}?rel=0`} title="Meal"
                        className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bismillah */}
      {surah.number !== 1 && surah.number !== 9 && (
        <motion.div className="text-center py-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="inline-block px-6 py-2 rounded-2xl" style={{ background: `${theme.gold}06`, border: `1px solid ${theme.gold}10` }}>
            <p className="font-arabic text-2xl" style={{ color: `${theme.gold}88`, fontFamily: 'Amiri, serif', direction: 'rtl' }}>{txt.bismillah}</p>
          </div>
        </motion.div>
      )}

      {/* Verses */}
      <div className="px-4 space-y-4">
        {(Array.isArray(surah.verses) ? surah.verses : []).map((verse, vIdx) => {
          const kissaKey = `${surahNumber}-${verse.number}`;
          const currentTab = getVerseTab(verse.number);
          const isPlaying = playingVerse === verse.number;

          return (
            <motion.div
              key={verse.number}
              data-testid={`verse-${verse.number}`}
              className={`quran-verse-card ${isPlaying ? 'animate-verse-glow' : ''}`}
              style={{
                borderColor: isPlaying ? `${theme.gold}30` : undefined,
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(vIdx, 8) * 0.04 }}
            >
              {/* Verse Header */}
              <div className="flex items-start justify-between mb-4">
                {/* Diamond verse number */}
                <div className="quran-number-badge shrink-0" style={{ width: 36, height: 36 }}>
                  <span className="relative z-10 text-xs">{verse.number}</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  <button onClick={() => playVerse(verse)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{
                      background: isPlaying ? `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight || theme.gold}dd)` : `${theme.gold}08`,
                      color: isPlaying ? '#0A1F14' : theme.textSecondary,
                    }}>
                    {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                  </button>
                  <button onClick={() => copyVerse(verse)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{ background: `${theme.gold}08`, color: copiedVerse === verse.number ? '#22c55e' : theme.textSecondary }}>
                    {copiedVerse === verse.number ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                  <button onClick={() => shareVerse(verse)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{ background: `${theme.gold}08`, color: theme.textSecondary }}>
                    <Share2 size={13} />
                  </button>
                  <button onClick={() => saveToNotes(verse, kissaData[kissaKey])}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{ background: `${theme.gold}08`, color: savedNotes[kissaKey] ? '#ef4444' : theme.textSecondary }}>
                    <Heart size={13} fill={savedNotes[kissaKey] ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <p className="arabic-text text-[1.35rem] mb-4 leading-[2.5] px-1" style={{ color: `${theme.textPrimary}ee` }}>{verse.arabic}</p>

              {/* Translation */}
              {verse.turkish && (
                <p className="text-sm leading-relaxed pt-3 px-1" style={{ color: theme.textSecondary, borderTop: `1px solid ${theme.cardBorder}` }}>
                  <span className="font-semibold" style={{ color: theme.gold }}>{verse.number}.</span> {verse.turkish}
                </p>
              )}

              {/* Tab buttons */}
              <div className="flex gap-1.5 mt-4 pt-3 overflow-x-auto scrollbar-hide" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                {[
                  { id: 'meal', label: txt.meal, icon: BookOpen, color: '#3b82f6' },
                  { id: 'tafsir', label: txt.tafsir, icon: BookMarked, color: '#f59e0b' },
                  { id: 'ai-tafsir', label: 'AI Tefsir', icon: Sparkles, color: '#8b5cf6' },
                  { id: 'kissa', label: txt.kissa, icon: Sparkles, color: theme.gold },
                ].map(tab => (
                  <button key={tab.id}
                    onClick={() => { setVerseTab(verse.number, tab.id); if (tab.id === 'kissa') generateKissa(verse); if (tab.id === 'ai-tafsir') loadAiTafsir(verse.number, aiTafsirStyle); }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all active:scale-95 whitespace-nowrap"
                    style={{
                      background: currentTab === tab.id ? `${tab.color}15` : `${theme.gold}05`,
                      color: currentTab === tab.id ? tab.color : theme.textSecondary,
                      border: `1px solid ${currentTab === tab.id ? `${tab.color}30` : 'transparent'}`,
                    }}>
                    <tab.icon size={13} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Meal Tab */}
              <AnimatePresence>
                {currentTab === 'meal' && (
                  <motion.div className="mt-3 rounded-xl p-4" style={{ background: '#3b82f608', border: '1px solid #3b82f612' }}
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={14} style={{ color: '#3b82f6' }} />
                      <span className="text-xs font-semibold" style={{ color: '#3b82f6' }}>{txt.tMeal}</span>
                      <button onClick={() => setVerseTab(verse.number, null)} className="ml-auto text-[10px]" style={{ color: theme.textSecondary }}>✕</button>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{verse.turkish || txt.noData}</p>
                    {verse.english && (
                      <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                        <p className="text-[10px] font-semibold mb-1" style={{ color: '#3b82f6' }}>{txt.english}</p>
                        <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>{verse.english}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tafsir Tab */}
              <AnimatePresence>
                {currentTab === 'tafsir' && (
                  <motion.div className="mt-3 rounded-xl p-4" style={{ background: '#f59e0b08', border: '1px solid #f59e0b12' }}
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <BookMarked size={14} style={{ color: '#f59e0b' }} />
                      <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>{txt.tafsir}</span>
                      <button onClick={() => setVerseTab(verse.number, null)} className="ml-auto text-[10px]" style={{ color: theme.textSecondary }}>✕</button>
                    </div>

                    {/* Sub-tabs */}
                    <div className="flex gap-1.5 mb-3">
                      {[
                        { id: 'scholars', label: txt.scholars, icon: '📗' },
                        { id: 'compare', label: txt.compare, icon: '⚖️' },
                        { id: 'linguistic', label: txt.linguistic, icon: '🔤' },
                      ].map(st => (
                        <button key={st.id}
                          onClick={() => {
                            setActiveSubTab(prev => ({ ...prev, [verse.number]: st.id }));
                            if (st.id === 'compare') loadCompare(verse.number);
                            if (st.id === 'linguistic') loadLinguistic(verse.number);
                          }}
                          className="px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition-all"
                          style={{
                            background: (activeSubTab[verse.number] || 'scholars') === st.id ? '#f59e0b15' : `${theme.gold}05`,
                            color: (activeSubTab[verse.number] || 'scholars') === st.id ? '#f59e0b' : theme.textSecondary,
                            border: `1px solid ${(activeSubTab[verse.number] || 'scholars') === st.id ? '#f59e0b25' : 'transparent'}`,
                          }}>
                          {st.icon} {st.label}
                        </button>
                      ))}
                    </div>

                    {/* Detail Level */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-[9px]" style={{ color: theme.textSecondary }}>{txt.detail}:</span>
                      {[{ id: 'summary', label: txt.summary }, { id: 'simplified', label: txt.simplified }, { id: 'academic', label: txt.academic }].map(dl => (
                        <button key={dl.id} onClick={() => setTafsirDetailLevel(dl.id)}
                          className="px-2 py-0.5 rounded-full text-[9px] font-semibold transition-all"
                          style={tafsirDetailLevel === dl.id
                            ? { background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight || theme.gold}dd)`, color: '#0A1F14' }
                            : { background: `${theme.gold}08`, color: theme.textSecondary }}>
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
                              if (tafsirV2Scholars.length > 0) loadTafsirV2(verse.number, s.id, tafsirDetailLevel);
                              else loadTafsir(verse.number, s.id);
                              setTafsirScholar(s.id);
                            }}
                              className="quran-scholar-chip"
                              style={{
                                background: tafsirScholar === s.id ? `${theme.gold}15` : `${theme.gold}06`,
                                borderColor: tafsirScholar === s.id ? `${theme.gold}30` : `${theme.gold}10`,
                                color: tafsirScholar === s.id ? theme.gold : theme.textSecondary,
                              }}>
                              {s.icon || '📗'} {s.name}
                              {s.premium && <Star size={9} className="inline" />}
                            </button>
                          ))}
                        </div>

                        {/* Offline Download Button */}
                        {tafsirScholar && (
                          <div className="mb-3">
                            {surahDownloaded[`${tafsirScholar}-${tafsirDetailLevel}`] ? (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px]" style={{ background: '#10B98115', color: '#10B981', border: '1px solid #10B98125' }}>
                                <CheckCircle size={12} /> {txt.downloaded}
                              </div>
                            ) : downloadingTafsir ? (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px]" style={{ background: `${theme.gold}10`, color: theme.gold, border: `1px solid ${theme.gold}20` }}>
                                <Loader2 size={12} className="animate-spin" />
                                <span>{txt.downloading} %{downloadProgress}</span>
                                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: `${theme.gold}15` }}>
                                  <div className="h-full rounded-full transition-all" style={{ width: `${downloadProgress}%`, background: theme.gold }} />
                                </div>
                              </div>
                            ) : (
                              <button onClick={() => downloadSurahTafsir(tafsirScholar)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all active:scale-95"
                                style={{ background: `${theme.gold}10`, color: theme.gold, border: `1px solid ${theme.gold}20` }}>
                                <Download size={12} /> {txt.downloadOffline}
                              </button>
                            )}
                          </div>
                        )}
                        {(tafsirLoading || tafsirV2Loading) ? (
                          <div className="flex items-center gap-2 py-4 justify-center">
                            <Loader2 size={16} className="animate-spin" style={{ color: '#f59e0b' }} />
                            <span className="text-xs" style={{ color: theme.textSecondary }}>{txt.loading}</span>
                          </div>
                        ) : (() => {
                          const v2Key = `${verse.number}-${tafsirScholar}-${tafsirDetailLevel}`;
                          const v2 = tafsirV2Data[v2Key];
                          if (v2 && v2.error) return (
                            <div className="rounded-xl p-3.5" style={{ background: '#ef444406', border: '1px solid #ef44440a' }}>
                              <p className="text-xs text-center" style={{ color: '#ef4444' }}>{v2.message || txt.noData}</p>
                            </div>
                          );
                          if (v2 && v2.tafsir_text) return (
                            <div className="rounded-xl p-3.5" style={{ background: '#f59e0b06', border: '1px solid #f59e0b0a' }}>
                              <p className="text-[11px] font-bold mb-1.5" style={{ color: '#f59e0b' }}>
                                {v2.scholar?.name} <span className="text-[9px] font-normal" style={{ color: theme.textSecondary }}>({v2.scholar?.school || ''})</span>
                              </p>
                              <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: theme.textPrimary }}>{v2.tafsir_text}</p>
                              {v2.confidence && (
                                <div className="flex items-center gap-1.5 mt-2 pt-2" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                                  <Shield size={10} style={{ color: (v2.confidence.score || 0) >= 7 ? '#10B981' : '#F59E0B' }} />
                                  <span className="text-[9px]" style={{ color: theme.textSecondary }}>
                                    {txt.confidence}: {(v2.confidence.score || 0) >= 7 ? txt.high : (v2.confidence.score || 0) >= 4 ? txt.medium : txt.low} ({v2.confidence.score}/10)
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                          if (tafsirData.length > 0) return (
                            <div className="space-y-2.5">
                              {tafsirData.map((td, i) => (
                                <div key={i} className="rounded-xl p-3.5" style={{ background: '#f59e0b06', border: '1px solid #f59e0b0a' }}>
                                  <p className="text-[11px] font-bold mb-1.5" style={{ color: '#f59e0b' }}>{td.scholar_display_name}</p>
                                  <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: theme.textPrimary }}>{td.tafsir_text}</p>
                                </div>
                              ))}
                            </div>
                          );
                          return (
                            <p className="text-xs py-3 text-center" style={{ color: theme.textSecondary }}>
                              {tafsirScholars.length > 0 || tafsirV2Scholars.length > 0 ? txt.selectScholar : txt.aiOff}
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
                          <span className="text-xs" style={{ color: theme.textSecondary }}>{txt.compLoading}</span>
                        </div>
                      ) : compareData[verse.number] ? (
                        compareData[verse.number].error ? (
                          <p className="text-xs py-3 text-center" style={{ color: theme.textSecondary }}>{txt.aiOff}</p>
                        ) : (
                        <div className="space-y-2">
                          {(compareData[verse.number].comparisons || []).map((c, i) => (
                            <div key={i} className="rounded-xl p-3" style={{ background: '#f59e0b05', border: `1px solid ${theme.cardBorder}` }}>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-sm">{c.scholar?.icon || '📗'}</span>
                                <span className="text-[10px] font-bold" style={{ color: '#f59e0b' }}>{c.scholar?.name}</span>
                                <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: `${theme.gold}08`, color: theme.textSecondary }}>{c.scholar?.school || ''}</span>
                              </div>
                              {c.premium_required ? (
                                <p className="text-[11px] leading-relaxed italic" style={{ color: theme.textSecondary }}>Premium üyelik gerektirir</p>
                              ) : c.error ? (
                                <p className="text-[11px] leading-relaxed italic" style={{ color: theme.textSecondary }}>{txt.noData}</p>
                              ) : (
                                <p className="text-[11px] leading-relaxed whitespace-pre-wrap" style={{ color: theme.textPrimary }}>{c.tafsir_text}</p>
                              )}
                            </div>
                          ))}
                        </div>
                        )
                      ) : (
                        <p className="text-xs py-3 text-center" style={{ color: theme.textSecondary }}>{txt.noComp}</p>
                      )
                    )}

                    {/* Linguistic sub-tab */}
                    {activeSubTab[verse.number] === 'linguistic' && (
                      linguisticLoading === verse.number ? (
                        <div className="flex items-center gap-2 py-4 justify-center">
                          <Loader2 size={16} className="animate-spin" style={{ color: '#f59e0b' }} />
                          <span className="text-xs" style={{ color: theme.textSecondary }}>{txt.lingLoading}</span>
                        </div>
                      ) : linguisticData[verse.number] ? (
                        linguisticData[verse.number].error ? (
                          <p className="text-xs py-3 text-center" style={{ color: theme.textSecondary }}>{txt.aiOff}</p>
                        ) : (
                        <div className="space-y-2">
                          {[
                            { key: 'nahiv', label: `🔤 ${txt.nahiv}` },
                            { key: 'sarf', label: `📝 ${txt.sarf}` },
                            { key: 'belagat', label: `✨ ${txt.belagat}` },
                            { key: 'semantik', label: `🎯 ${txt.semantik}` },
                          ].map(section => (
                            linguisticData[verse.number].analysis?.[section.key] && (
                              <div key={section.key} className="rounded-xl p-3" style={{ background: '#f59e0b05' }}>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#f59e0b' }}>{section.label}</p>
                                <p className="text-[11px] leading-relaxed whitespace-pre-wrap" style={{ color: theme.textPrimary }}>
                                  {linguisticData[verse.number].analysis[section.key]}
                                </p>
                              </div>
                            )
                          ))}
                        </div>
                        )
                      ) : (
                        <p className="text-xs py-3 text-center" style={{ color: theme.textSecondary }}>{txt.noLing}</p>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Kissa Tab */}
              <AnimatePresence>
                {currentTab === 'kissa' && (
                  <motion.div className="mt-3 rounded-xl p-4" style={{ background: `${theme.gold}08`, border: `1px solid ${theme.gold}12` }}
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} style={{ color: theme.gold }} />
                      <span className="text-xs font-semibold" style={{ color: theme.gold }}>{txt.kissaTitle}</span>
                      {kissaData[kissaKey]?.scholar_name && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${theme.gold}10`, color: theme.gold }}>{kissaData[kissaKey].scholar_name}</span>
                      )}
                      <button onClick={() => setVerseTab(verse.number, null)} className="ml-auto text-[10px]" style={{ color: theme.textSecondary }}>✕</button>
                    </div>
                    {kissaLoading === kissaKey ? (
                      <div className="flex items-center gap-2 py-4 justify-center">
                        <Loader2 size={16} className="animate-spin" style={{ color: theme.gold }} />
                        <span className="text-xs" style={{ color: theme.textSecondary }}>{txt.generating}</span>
                      </div>
                    ) : kissaData[kissaKey] ? (
                      <>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: theme.textPrimary }}>{kissaData[kissaKey].kissa}</p>
                        <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                          <button onClick={() => saveToNotes(verse, kissaData[kissaKey])}
                            className="flex items-center gap-1 text-[10px] px-3 py-1.5 rounded-xl transition-all active:scale-95"
                            style={{ background: `${theme.gold}10`, color: theme.gold }}>
                            <Heart size={10} fill={savedNotes[kissaKey] ? 'currentColor' : 'none'} /> {savedNotes[kissaKey] ? txt.saved : txt.save}
                          </button>
                          <button onClick={() => { navigator.clipboard.writeText(kissaData[kissaKey].kissa).catch(() => {}); }}
                            className="flex items-center gap-1 text-[10px] px-3 py-1.5 rounded-xl transition-all active:scale-95"
                            style={{ background: `${theme.gold}10`, color: theme.gold }}>
                            <Copy size={10} /> {txt.copy}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs py-3 text-center" style={{ color: theme.textSecondary }}>{txt.kissaAiOff}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Tafsir Tab */}
              <AnimatePresence>
                {currentTab === 'ai-tafsir' && (
                  <motion.div className="mt-3 rounded-xl p-4" style={{ background: '#8b5cf608', border: '1px solid #8b5cf612' }}
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={14} style={{ color: '#8b5cf6' }} />
                      <span className="text-xs font-semibold" style={{ color: '#8b5cf6' }}>AI Tefsir</span>
                      <button onClick={() => setVerseTab(verse.number, null)} className="ml-auto text-[10px]" style={{ color: theme.textSecondary }}>✕</button>
                    </div>
                    {/* Style selector */}
                    <div className="flex gap-1 mb-3 overflow-x-auto scrollbar-hide pb-1">
                      {AI_TAFSIR_STYLES.map(s => (
                        <button key={s.id} onClick={() => { setAiTafsirStyle(s.id); loadAiTafsir(verse.number, s.id); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all active:scale-95 whitespace-nowrap"
                          style={{
                            background: aiTafsirStyle === s.id ? `${s.color}20` : `${theme.gold}05`,
                            color: aiTafsirStyle === s.id ? s.color : theme.textSecondary,
                            border: `1px solid ${aiTafsirStyle === s.id ? `${s.color}40` : 'transparent'}`,
                          }}>
                          <span>{s.icon}</span> {s.name}
                        </button>
                      ))}
                    </div>
                    {aiTafsirLoading ? (
                      <div className="flex items-center gap-2 py-6 justify-center">
                        <Loader2 size={16} className="animate-spin" style={{ color: '#8b5cf6' }} />
                        <span className="text-xs" style={{ color: theme.textSecondary }}>AI tefsir hazırlanıyor...</span>
                      </div>
                    ) : aiTafsirData[verse.number] ? (
                      aiTafsirData[verse.number].error ? (
                        <p className="text-xs py-3 text-center" style={{ color: theme.textSecondary }}>AI şu an kullanılamıyor</p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: theme.textPrimary }}>
                            {aiTafsirData[verse.number].tafsir}
                          </p>
                          <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                            <button onClick={() => { navigator.clipboard.writeText(aiTafsirData[verse.number].tafsir).catch(() => {}); }}
                              className="flex items-center gap-1 text-[10px] px-3 py-1.5 rounded-xl transition-all active:scale-95"
                              style={{ background: '#8b5cf610', color: '#8b5cf6' }}>
                              <Copy size={10} /> {txt.copy || 'Kopyala'}
                            </button>
                          </div>
                        </div>
                      )
                    ) : (
                      <p className="text-xs py-3 text-center" style={{ color: theme.textSecondary }}>Bir tefsir stili seçin</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
