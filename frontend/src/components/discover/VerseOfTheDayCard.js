import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Play, Pause, Share2, Quote, RefreshCw, Volume2, Check } from 'lucide-react';

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

  return (
    <div className="relative bg-gradient-to-br from-[#0F3523] via-[#0D2D1E] to-[#0A1A12] rounded-[32px] p-6 overflow-hidden shadow-2xl border border-[#1A3826] font-sans">
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Background Graphic Pattern */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-25 mix-blend-luminosity pointer-events-none">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1609599006353-e629aaab31f5?q=80&w=600&auto=format&fit=crop')] bg-cover bg-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3523] to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* Header Row */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 bg-[#f59e0b]/10 text-[#f59e0b] px-3 py-1.5 rounded-full border border-[#f59e0b]/20 shadow-sm">
            <Quote size={14} fill="currentColor" />
            <span className="text-xs font-bold">Günün Ayeti</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-xs font-semibold tracking-wide">
              {currentVerse.surahName} - {currentVerse.verseNumber}
            </span>

            {/* Rastgele Ayet Getir Button */}
            <button 
              onClick={handleNextVerse}
              className="flex items-center gap-1 bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] px-2.5 py-1 rounded-full text-xs font-bold transition-all border border-[#10b981]/30"
              title="Başka Ayet Getir"
            >
              <RefreshCw size={12} className="animate-spin-once" />
              <span>Farklı Ayet</span>
            </button>
          </div>
        </div>

        {/* Verse Content */}
        <div className="text-center py-3 mb-5">
          <div className="text-3xl md:text-4xl text-[#CDA434] font-arabic leading-relaxed mb-4" dir="rtl" style={{ textShadow: '0 4px 12px rgba(205,164,52,0.2)' }}>
            {currentVerse.arabic}
          </div>
          <p className="text-gray-200 text-sm md:text-base leading-relaxed px-4 font-medium italic">
            "{currentVerse.turkish}"
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          
          {/* Arapça Dinle */}
          <button 
            onClick={toggleArabicAudio}
            className={`py-2.5 px-3 rounded-full border transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${isPlayingArabic ? 'bg-[#10b981] text-white border-[#10b981] shadow-lg shadow-[#10b981]/30' : 'bg-[#132A1D]/80 text-white border-[#1A3826] hover:border-[#10b981]/40'}`}
          >
            {isPlayingArabic ? <Pause size={14} /> : <Play size={14} className="text-[#10b981]" />}
            <span>{isPlayingArabic ? 'Durdur' : 'Arapça Oku'}</span>
          </button>

          {/* Türkçe Meali Dinle */}
          <button 
            onClick={toggleTurkishAudio}
            className={`py-2.5 px-3 rounded-full border transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${isPlayingTurkish ? 'bg-[#f59e0b] text-stone-950 border-[#f59e0b] shadow-lg shadow-[#f59e0b]/30' : 'bg-[#132A1D]/80 text-white border-[#1A3826] hover:border-[#f59e0b]/40'}`}
          >
            {isPlayingTurkish ? <Pause size={14} /> : <Volume2 size={14} className="text-[#f59e0b]" />}
            <span>{isPlayingTurkish ? 'Durdur' : 'Meali Oku'}</span>
          </button>

          {/* Ayetin Meali Modal Toggle */}
          <button 
            onClick={() => setShowMealModal(!showMealModal)}
            className="py-2.5 px-3 rounded-full border bg-[#132A1D]/80 text-white border-[#1A3826] hover:border-[#10b981]/40 transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            <BookOpen size={14} className="text-[#10b981]" />
            <span>Ayet Detayı</span>
          </button>

          {/* Paylaş */}
          <button 
            onClick={handleShare}
            className="py-2.5 px-3 rounded-full border bg-[#132A1D]/80 text-white border-[#1A3826] hover:border-[#10b981]/40 transition-all flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Share2 size={14} className="text-[#10b981]" />}
            <span>{copied ? 'Kopyalandı' : 'Paylaş'}</span>
          </button>

        </div>

        {/* Meal Detail Inline Box */}
        {showMealModal && (
          <div className="mt-4 p-4 rounded-2xl bg-[#0D2418] border border-[#10b981]/30 text-xs text-gray-200 leading-relaxed animate-fadeIn">
            <div className="flex justify-between items-center mb-2 text-[#10b981] font-bold">
              <span>{currentVerse.surahName} ({currentVerse.verseNumber}. Ayet) Tefsir Notu</span>
              <button onClick={() => setShowMealModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <p>
              Bu mübarek ayet, kulun taşıyamayacağı yükle mükellef tutulmayacağını ve her halükarda Allah'ın merhametinin kuşatıcılığını müjdelemektedir. Tefsirlerde müminin her türlü darlık anında bu ilahi beyana sığınması tavsiye olunur.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
