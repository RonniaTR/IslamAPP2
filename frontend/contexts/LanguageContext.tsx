import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'tr' | 'en' | 'ar';

interface Translations {
  [key: string]: {
    tr: string;
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Common
  home: { tr: 'Ana Sayfa', en: 'Home', ar: 'الصفحة الرئيسية' },
  settings: { tr: 'Ayarlar', en: 'Settings', ar: 'الإعدادات' },
  profile: { tr: 'Profil', en: 'Profile', ar: 'الملف الشخصي' },
  back: { tr: 'Geri', en: 'Back', ar: 'رجوع' },
  save: { tr: 'Kaydet', en: 'Save', ar: 'حفظ' },
  cancel: { tr: 'İptal', en: 'Cancel', ar: 'إلغاء' },
  loading: { tr: 'Yükleniyor...', en: 'Loading...', ar: 'جاري التحميل...' },
  error: { tr: 'Hata', en: 'Error', ar: 'خطأ' },
  success: { tr: 'Başarılı', en: 'Success', ar: 'نجاح' },
  
  // Navigation
  scholars: { tr: 'Hocalar', en: 'Scholars', ar: 'العلماء' },
  quran: { tr: "Kur'an", en: 'Quran', ar: 'القرآن' },
  hadith: { tr: 'Hadis', en: 'Hadith', ar: 'الحديث' },
  quiz: { tr: 'Quiz', en: 'Quiz', ar: 'مسابقة' },
  
  // Dashboard
  greeting: { tr: 'Selamün Aleyküm', en: 'Assalamu Alaikum', ar: 'السلام عليكم' },
  nextPrayer: { tr: 'Sonraki Namaz', en: 'Next Prayer', ar: 'الصلاة القادمة' },
  prayerTimes: { tr: 'Namaz Vakitleri', en: 'Prayer Times', ar: 'أوقات الصلاة' },
  timeRemaining: { tr: 'kaldı', en: 'remaining', ar: 'متبقي' },
  
  // Prayer Names
  fajr: { tr: 'İmsak', en: 'Fajr', ar: 'الفجر' },
  sunrise: { tr: 'Güneş', en: 'Sunrise', ar: 'الشروق' },
  dhuhr: { tr: 'Öğle', en: 'Dhuhr', ar: 'الظهر' },
  asr: { tr: 'İkindi', en: 'Asr', ar: 'العصر' },
  maghrib: { tr: 'Akşam', en: 'Maghrib', ar: 'المغرب' },
  isha: { tr: 'Yatsı', en: 'Isha', ar: 'العشاء' },
  
  // Quick Actions
  aiAdvisor: { tr: 'AI Danışman', en: 'AI Advisor', ar: 'مستشار الذكاء الاصطناعي' },
  qiblaFinder: { tr: 'Kıble Bulucu', en: 'Qibla Finder', ar: 'اتجاه القبلة' },
  pomodoro: { tr: 'İlim Pomodoro', en: 'Study Timer', ar: 'مؤقت الدراسة' },
  dailyVerse: { tr: 'Günün Ayeti', en: 'Daily Verse', ar: 'آية اليوم' },
  
  // Quiz
  quizTitle: { tr: 'İslami Bilgi Yarışması', en: 'Islamic Knowledge Quiz', ar: 'مسابقة المعرفة الإسلامية' },
  multiplayer: { tr: 'Çok Oyunculu', en: 'Multiplayer', ar: 'متعدد اللاعبين' },
  singlePlayer: { tr: 'Tek Oyuncu', en: 'Single Player', ar: 'لاعب واحد' },
  leaderboard: { tr: 'Sıralama', en: 'Leaderboard', ar: 'لوحة الصدارة' },
  createRoom: { tr: 'Yeni Oda Oluştur', en: 'Create New Room', ar: 'إنشاء غرفة جديدة' },
  openRooms: { tr: 'Açık Odalar', en: 'Open Rooms', ar: 'الغرف المفتوحة' },
  noRooms: { tr: 'Henüz açık oda yok', en: 'No open rooms yet', ar: 'لا توجد غرف مفتوحة' },
  playSolo: { tr: 'Tek Başına Oyna', en: 'Play Solo', ar: 'العب منفرداً' },
  selectCategory: { tr: 'Kategori seç ve bilgini test et!', en: 'Select category and test your knowledge!', ar: 'اختر الفئة واختبر معرفتك!' },
  play: { tr: 'Oyna', en: 'Play', ar: 'العب' },
  
  // Quiz Categories
  ramazan: { tr: 'Ramazan', en: 'Ramadan', ar: 'رمضان' },
  namaz: { tr: 'Namaz', en: 'Prayer', ar: 'الصلاة' },
  hadis: { tr: 'Hadis', en: 'Hadith', ar: 'الحديث' },
  tefsir: { tr: 'Tefsir', en: 'Tafsir', ar: 'التفسير' },
  fikih: { tr: 'Fıkıh', en: 'Fiqh', ar: 'الفقه' },
  
  // Quiz Game
  question: { tr: 'Soru', en: 'Question', ar: 'سؤال' },
  correct: { tr: 'Doğru!', en: 'Correct!', ar: 'صحيح!' },
  wrong: { tr: 'Yanlış!', en: 'Wrong!', ar: 'خطأ!' },
  points: { tr: 'puan', en: 'points', ar: 'نقاط' },
  nextQuestion: { tr: 'Sonraki Soru', en: 'Next Question', ar: 'السؤال التالي' },
  seeResults: { tr: 'Sonuçları Gör', en: 'See Results', ar: 'عرض النتائج' },
  quizComplete: { tr: 'Quiz Tamamlandı!', en: 'Quiz Complete!', ar: 'اكتملت المسابقة!' },
  totalScore: { tr: 'Toplam Puan', en: 'Total Score', ar: 'مجموع النقاط' },
  correctAnswers: { tr: 'Doğru Cevap', en: 'Correct Answers', ar: 'الإجابات الصحيحة' },
  accuracy: { tr: 'Başarı Oranı', en: 'Accuracy', ar: 'نسبة النجاح' },
  playAgain: { tr: 'Tekrar Oyna', en: 'Play Again', ar: 'العب مرة أخرى' },
  backToLobby: { tr: 'Lobiye Dön', en: 'Back to Lobby', ar: 'العودة إلى اللوبي' },
  
  // Quran
  surah: { tr: 'Sure', en: 'Surah', ar: 'سورة' },
  verse: { tr: 'Ayet', en: 'Verse', ar: 'آية' },
  verses: { tr: 'Ayet', en: 'Verses', ar: 'آيات' },
  juz: { tr: 'Cüz', en: 'Juz', ar: 'جزء' },
  page: { tr: 'Sayfa', en: 'Page', ar: 'صفحة' },
  search: { tr: 'Ara', en: 'Search', ar: 'بحث' },
  bookmarks: { tr: 'Yer İmleri', en: 'Bookmarks', ar: 'الإشارات المرجعية' },
  listen: { tr: 'Dinle', en: 'Listen', ar: 'استمع' },
  stopListening: { tr: 'Durdur', en: 'Stop', ar: 'إيقاف' },
  
  // Settings
  language: { tr: 'Dil', en: 'Language', ar: 'اللغة' },
  theme: { tr: 'Tema', en: 'Theme', ar: 'المظهر' },
  darkMode: { tr: 'Karanlık Mod', en: 'Dark Mode', ar: 'الوضع الداكن' },
  lightMode: { tr: 'Aydınlık Mod', en: 'Light Mode', ar: 'الوضع الفاتح' },
  music: { tr: 'Fon Müziği', en: 'Background Music', ar: 'الموسيقى الخلفية' },
  musicOn: { tr: 'Müzik Açık', en: 'Music On', ar: 'الموسيقى مفعلة' },
  musicOff: { tr: 'Müzik Kapalı', en: 'Music Off', ar: 'الموسيقى معطلة' },
  
  // Misc
  username: { tr: 'Kullanıcı Adınız', en: 'Your Username', ar: 'اسم المستخدم' },
  source: { tr: 'Kaynak', en: 'Source', ar: 'المصدر' },
  explanation: { tr: 'Açıklama', en: 'Explanation', ar: 'التفسير' },
  difficulty: { tr: 'Zorluk', en: 'Difficulty', ar: 'الصعوبة' },
  easy: { tr: 'Kolay', en: 'Easy', ar: 'سهل' },
  medium: { tr: 'Orta', en: 'Medium', ar: 'متوسط' },
  hard: { tr: 'Zor', en: 'Hard', ar: 'صعب' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('app_language');
      if (savedLang && ['tr', 'en', 'ar'].includes(savedLang)) {
        setLanguageState(savedLang as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('app_language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (translation) {
      return translation[language] || translation['tr'] || key;
    }
    return key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
