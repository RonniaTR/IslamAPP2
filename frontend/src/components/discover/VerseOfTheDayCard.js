import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Play, Pause, Share2, Quote, RefreshCw, Volume2, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// Kur'an-ı Kerim'den seçme etkileyici ayetler listesi
const FEATURED_VERSES = [
  {
    surahName: 'Bakara Suresi',
    verseNumber: 286,
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ',
    turkish: 'Allah, hiç kimseye gücünün yettiğinden fazlasını yüklemez.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/293.mp3',
    surahId: 2
  },
  {
    surahName: 'İnşirah Suresi',
    verseNumber: 5,
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۙ',
    turkish: 'Şüphesiz her zorlukla beraber bir kolaylık vardır.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6115.mp3',
    surahId: 94
  },
  {
    surahName: 'Zümer Suresi',
    verseNumber: 53,
    arabic: 'لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
    turkish: 'Allah’ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4111.mp3',
    surahId: 39
  },
  {
    surahName: 'Rad Suresi',
    verseNumber: 28,
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    turkish: 'Bilesiniz ki kalpler ancak Allah’ı anmakla huzur bulur.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3',
    surahId: 13
  },
  {
    surahName: 'Âl-i İmrân Suresi',
    verseNumber: 139,
    arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنْتُمُ الْأَعْلَوْنَ إِنْ كُنْتُمْ مُؤْمِنِينَ',
    turkish: 'Gevşemeyin, üzülmeyin! Eğer gerçekten inanıyorsanız üstün olan sizsiniz.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/432.mp3',
    surahId: 3
  },
  {
    surahName: 'Duha Suresi',
    verseNumber: 7,
    arabic: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ',
    turkish: 'Seni yolunu kaybetmiş bulup da doğru yola iletmedi mi?',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6082.mp3',
    surahId: 93
  }
];

export function VerseOfTheDayCard() {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingArabic, setIsPlayingArabic] = useState(false);
  const [isPlayingTurkish, setIsPlayingTurkish] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef(null);
  const currentVerse = FEATURED_VERSES[currentIndex];

  // Stop audios when verse changes
  useEffect(() => {
    stopAllAudio();
  }, [currentIndex]);

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingArabic(false);
    setIsPlayingTurkish(false);
  };

  // 1. Arapça Ses Çalma (Alafasy Audio)
  const toggleArabicAudio = () => {
    if (isPlayingTurkish) {
      window.speechSynthesis.cancel();
      setIsPlayingTurkish(false);
    }

    if (isPlayingArabic) {
      audioRef.current?.pause();
      setIsPlayingArabic(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentVerse.audioUrl);
      } else {
        audioRef.current.src = currentVerse.audioUrl;
      }

      audioRef.current.play()
        .then(() => setIsPlayingArabic(true))
        .catch(err => console.error("Audio playback error", err));

      audioRef.current.onended = () => setIsPlayingArabic(false);
    }
  };

  // 2. Türkçe Meali Okuma (SpeechSynthesis API)
  const toggleTurkishAudio = () => {
    if (isPlayingArabic) {
      audioRef.current?.pause();
      setIsPlayingArabic(false);
    }

    if (isPlayingTurkish) {
      window.speechSynthesis.cancel();
      setIsPlayingTurkish(false);
    } else {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentVerse.turkish);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.9;
        
        utterance.onend = () => setIsPlayingTurkish(false);
        utterance.onerror = () => setIsPlayingTurkish(false);

        setIsPlayingTurkish(true);
        window.speechSynthesis.speak(utterance);
      } else {
        alert("Tarayıcınız Türkçe seslendirmeyi desteklemiyor.");
      }
    }
  };

  // 3. Başka Ayet Getir
  const handleNextVerse = () => {
    setCurrentIndex(prev => (prev + 1) % FEATURED_VERSES.length);
  };

  // 4. Ayeti Paylaş / Kopyala
  const handleShare = () => {
    const shareText = `"${currentVerse.turkish}" (${currentVerse.surahName} - ${currentVerse.verseNumber})\n\nNur App ile öğreniyorum 🌟`;
    if (navigator.share) {
      navigator.share({
        title: 'Günün Ayeti',
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const btnIdle = {
    background: theme.surface,
    color: theme.textPrimary,
    borderColor: theme.cardBorder,
  };
  const accentColor = theme.isDark ? '#10b981' : theme.primary;

  return (
    <div
      className="relative rounded-[32px] p-6 overflow-hidden shadow-xl font-sans transition-colors duration-300"
      style={{
        background: theme.isDark
          ? `linear-gradient(135deg, ${theme.surfaceLight} 0%, ${theme.surface} 60%, ${theme.bg} 100%)`
          : `linear-gradient(135deg, ${theme.surface} 0%, ${theme.surfaceLight} 100%)`,
        border: `1px solid ${theme.cardBorder}`,
        color: theme.textPrimary,
      }}
    >
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Background Graphic Pattern */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none" style={{ opacity: theme.isDark ? 0.22 : 0.1 }}>
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1609599006353-e629aaab31f5?q=80&w=600&auto=format&fit=crop')] bg-cover bg-right" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${theme.surface} 0%, transparent 100%)` }} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* Header Row */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm"
            style={{ background: `${theme.gold}18`, color: theme.gold, border: `1px solid ${theme.gold}35` }}>
            <Quote size={14} fill="currentColor" />
            <span className="text-xs font-bold">Günün Ayeti</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wide" style={{ color: theme.textSecondary }}>
              {currentVerse.surahName} - {currentVerse.verseNumber}
            </span>

            {/* Rastgele Ayet Getir Button */}
            <button 
              onClick={handleNextVerse}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all"
              style={{ background: `${theme.primary}20`, color: accentColor, border: `1px solid ${theme.primary}40` }}
              title="Başka Ayet Getir"
            >
              <RefreshCw size={12} className="animate-spin-once" />
              <span>Farklı Ayet</span>
            </button>
          </div>
        </div>

        {/* Verse Content */}
        <div className="text-center py-3 mb-5">
          <div className="text-3xl md:text-4xl font-arabic leading-relaxed mb-4" dir="rtl"
            style={{ color: theme.gold, textShadow: `0 4px 12px ${theme.gold}28` }}>
            {currentVerse.arabic}
          </div>
          <p className="text-sm md:text-base leading-relaxed px-4 font-medium italic" style={{ color: theme.textPrimary }}>
            "{currentVerse.turkish}"
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          
          {/* Arapça Dinle */}
          <button 
            onClick={toggleArabicAudio}
            className="py-2.5 px-3 rounded-full border transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
            style={isPlayingArabic ? { background: theme.primary, color: '#FFFFFF', borderColor: theme.primary } : btnIdle}
          >
            {isPlayingArabic ? <Pause size={14} /> : <Play size={14} style={{ color: accentColor }} />}
            <span>{isPlayingArabic ? 'Durdur' : 'Arapça Oku'}</span>
          </button>

          {/* Türkçe Meali Dinle */}
          <button 
            onClick={toggleTurkishAudio}
            className="py-2.5 px-3 rounded-full border transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
            style={isPlayingTurkish ? { background: theme.gold, color: '#1A1A1A', borderColor: theme.gold } : btnIdle}
          >
            {isPlayingTurkish ? <Pause size={14} /> : <Volume2 size={14} style={{ color: theme.gold }} />}
            <span>{isPlayingTurkish ? 'Durdur' : 'Meali Oku'}</span>
          </button>

          {/* Ayetin Meali Modal Toggle */}
          <button 
            onClick={() => setShowMealModal(!showMealModal)}
            className="py-2.5 px-3 rounded-full border transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
            style={btnIdle}
          >
            <BookOpen size={14} style={{ color: accentColor }} />
            <span>Ayet Detayı</span>
          </button>

          {/* Paylaş */}
          <button 
            onClick={handleShare}
            className="py-2.5 px-3 rounded-full border transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
            style={btnIdle}
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} style={{ color: accentColor }} />}
            <span>{copied ? 'Kopyalandı' : 'Paylaş'}</span>
          </button>

        </div>

        {/* Meal Detail Inline Box */}
        {showMealModal && (
          <div className="mt-4 p-4 rounded-2xl text-xs leading-relaxed animate-fadeIn"
            style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }}>
            <div className="flex justify-between items-center mb-2 font-bold" style={{ color: accentColor }}>
              <span>{currentVerse.surahName} ({currentVerse.verseNumber}. Ayet) Tefsir Notu</span>
              <button onClick={() => setShowMealModal(false)} style={{ color: theme.textSecondary }}>✕</button>
            </div>
            <p style={{ color: theme.textSecondary }}>
              Bu mübarek ayet, kulun taşıyamayacağı yükle mükellef tutulmayacağını ve her halükarda Allah'ın merhametinin kuşatıcılığını müjdelemektedir. Tefsirlerde müminin her türlü darlık anında bu ilahi beyana sığınması tavsiye olunur.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
