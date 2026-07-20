import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LangContext = createContext(null);
const LANG_KEY = 'app_lang_v2';

const LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const TRANSLATIONS = {
  tr: {
    home: 'Ana Sayfa', quran: "Kur'an-ı Kerim", hadith: 'Hadisler', prayer: 'Namaz Vakitleri', profile: 'Profil',
    scholars: 'Hocalara Sor', notes: 'Notlarım', settings: 'Ayarlar', dhikr: 'Zikir & Tesbih', qibla: 'Kıble Pusulası',
    aiChat: 'İslami Danışman', greeting: 'Selamün Aleyküm', dailyVerse: 'Günün Ayeti', explore: 'Keşfet',
    dailyReminder: 'Günlük zikirlerini yapmayı unutma! ☝️', search: 'Ara...', loading: 'Yükleniyor...', error: 'Hata',
    retry: 'Tekrar Dene', save: 'Kaydet', delete: 'Sil', cancel: 'İptal', copy: 'Kopyala', share: 'Paylaş',
    copied: 'Kopyalandı', logout: 'Çıkış Yap', logoutConfirm: 'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
    guest: 'Misafir Kullanıcı', guestMode: 'Misafir Mod', guestLogin: 'Misafir olarak giriş yapıldı',
    googleSignIn: 'Google ile Giriş Yap', guestSignIn: 'Misafir Olarak Devam Et',
    pagesRead: 'Okunan Sayfa', dhikrCount: 'Zikir', streak: 'Gün Seri', quickAccess: 'Hızlı Erişim',
    language: 'Dil Ayarları', theme: 'Tema', notifications: 'Bildirimler', about: 'Hakkında',
    lightTheme: 'Aydınlık Tema', darkTheme: 'Koyu Tema', tafsir: 'Tefsir', reciter: 'Kari',
    surah: 'Sure', ayah: 'Ayet', bismillah: "Rahman ve Rahim olan Allah'ın adıyla",
    noNotes: 'Henüz kayıtlı notunuz yok', noNotesDesc: "Kur'an okurken favori ayetlerinizi kaydedin",
    goToQuran: "Kur'an'a Git", allNotes: 'Tümü', ayahNotes: 'Ayetler', storyNotes: 'Kıssalar',
    addNote: 'Not Ekle', noteTitle: 'Not Başlığı', noteContent: 'Not İçeriği',
    scholarSelection: '12 alimden birine soru sorun', askQuestion: 'Sorunuzu yazın...',
    thinking: 'Düşünüyor...', suggestedQuestions: 'Önerilen Sorular', savedSuccessfully: 'Başarıyla kaydedildi',
    version: 'İslam App v2.0', surahLoading: 'Sure yükleniyor...', surahError: 'Sure yüklenemedi',
    tafsirNotFound: 'Tefsir bulunamadı.', tafsirError: 'Tefsir yüklenirken hata oluştu.',
    saveNote: 'Notu Kaydet', tafsirMode: 'Tefsir Modu',
    tafsirModeDesc: 'Ayetlerin tefsirini okuyun ve notlar alın', backToHome: 'Ana Sayfaya Dön',
    stats: 'İstatistikler', worshipStats: 'İbadet İstatistikleri', totalDhikr: 'Toplam Zikir',
    hadithRead: 'Okunan Hadis', quranPages: 'Kur\'an Sayfası', dayStreak: 'Gün Serisi',
    selectScholar: 'Tefsir Alimi Seçin', tafsirScholars: 'Tefsir Alimleri',
    ibnKathir: 'İbn Kesir', taberi: 'Taberi', qurtubi: 'Kurtubi', jalalayn: 'Celaleyn',
    elmaliHamdi: 'Elmalılı Hamdi Yazır', fahrRazi: 'Fahreddin Razi',
    listenHadith: 'Hadisi Dinle', stopListening: 'Durdur', hadithCount: 'hadis',
    category: 'Kategori', narrator: 'Ravi', source: 'Kaynak', topic: 'Konu',
    searchHadith: 'Hadis ara...', searchSurah: 'Sure veya ayet ara...',
    searchVerse: 'Ayet Ara', noResults: 'Sonuç bulunamadı',
    prayerTimes: 'Namaz Vakitleri', nextPrayer: 'Sonraki Namaz', remaining: 'kaldı',
    allPrayerTimes: 'Günün Namaz Vakitleri', location: 'Konumunuz',
    locationPermission: 'Konum izni gerekli', compassNotAvailable: 'Pusula sensörü bulunamadı',
    qiblaDirection: 'Kıble Yönü', degrees: 'derece',
    counter: 'Sayaç', reset: 'Sıfırla', completed: 'Tamamlandı',
    totalCount: 'Toplam Zikir Sayısı', touchToCount: 'Dokunarak Say',
  },
  en: {
    home: 'Home', quran: 'Holy Quran', hadith: 'Hadiths', prayer: 'Prayer Times', profile: 'Profile',
    scholars: 'Ask Scholars', notes: 'My Notes', settings: 'Settings', dhikr: 'Dhikr & Tasbih', qibla: 'Qibla Compass',
    aiChat: 'Islamic Advisor', greeting: 'Assalamu Alaikum', dailyVerse: 'Verse of the Day', explore: 'Explore',
    dailyReminder: "Don't forget your daily dhikr! ☝️", search: 'Search...', loading: 'Loading...', error: 'Error',
    retry: 'Retry', save: 'Save', delete: 'Delete', cancel: 'Cancel', copy: 'Copy', share: 'Share',
    copied: 'Copied', logout: 'Sign Out', logoutConfirm: 'Are you sure you want to sign out?',
    guest: 'Guest User', guestMode: 'Guest Mode', guestLogin: 'Logged in as guest',
    googleSignIn: 'Sign in with Google', guestSignIn: 'Continue as Guest',
    pagesRead: 'Pages Read', dhikrCount: 'Dhikr', streak: 'Day Streak', quickAccess: 'Quick Access',
    language: 'Language', theme: 'Theme', notifications: 'Notifications', about: 'About',
    lightTheme: 'Light Theme', darkTheme: 'Dark Theme', tafsir: 'Tafsir', reciter: 'Reciter',
    surah: 'Surah', ayah: 'Ayah', bismillah: 'In the name of Allah, the Most Gracious, the Most Merciful',
    noNotes: 'No saved notes yet', noNotesDesc: 'Save your favorite verses while reading Quran',
    goToQuran: 'Go to Quran', allNotes: 'All', ayahNotes: 'Verses', storyNotes: 'Stories',
    addNote: 'Add Note', noteTitle: 'Note Title', noteContent: 'Note Content',
    scholarSelection: 'Ask one of 12 scholars', askQuestion: 'Type your question...',
    thinking: 'Thinking...', suggestedQuestions: 'Suggested Questions', savedSuccessfully: 'Saved successfully',
    version: 'Islam App v2.0', surahLoading: 'Loading surah...', surahError: 'Failed to load surah',
    tafsirNotFound: 'Tafsir not found.', tafsirError: 'Error loading tafsir.',
    saveNote: 'Save Note', tafsirMode: 'Tafsir Mode',
    tafsirModeDesc: 'Read tafsir of verses and take notes', backToHome: 'Back to Home',
    stats: 'Statistics', worshipStats: 'Worship Statistics', totalDhikr: 'Total Dhikr',
    hadithRead: 'Hadith Read', quranPages: 'Quran Pages', dayStreak: 'Day Streak',
    selectScholar: 'Select Tafsir Scholar', tafsirScholars: 'Tafsir Scholars',
    ibnKathir: 'Ibn Kathir', taberi: 'Taberi', qurtubi: 'Qurtubi', jalalayn: 'Jalalayn',
    elmaliHamdi: 'Elmalılı Hamdi Yazır', fahrRazi: 'Fakhr al-Din al-Razi',
    listenHadith: 'Listen', stopListening: 'Stop', hadithCount: 'hadith',
    category: 'Category', narrator: 'Narrator', source: 'Source', topic: 'Topic',
    searchHadith: 'Search hadith...', searchSurah: 'Search surah or verse...',
    searchVerse: 'Search Verse', noResults: 'No results found',
    prayerTimes: 'Prayer Times', nextPrayer: 'Next Prayer', remaining: 'remaining',
    allPrayerTimes: "Today's Prayer Times", location: 'Your Location',
    locationPermission: 'Location permission required', compassNotAvailable: 'Compass not available',
    qiblaDirection: 'Qibla Direction', degrees: 'degrees',
    counter: 'Counter', reset: 'Reset', completed: 'Completed',
    totalCount: 'Total Dhikr Count', touchToCount: 'Tap to Count',
  },
  ar: {
    home: 'الرئيسية', quran: 'القرآن الكريم', hadith: 'الأحاديث', prayer: 'أوقات الصلاة', profile: 'الملف الشخصي',
    scholars: 'اسأل العلماء', notes: 'ملاحظاتي', settings: 'الإعدادات', dhikr: 'الذكر والتسبيح', qibla: 'بوصلة القبلة',
    aiChat: 'المستشار الإسلامي', greeting: 'السلام عليكم', dailyVerse: 'آية اليوم', explore: 'استكشف',
    dailyReminder: 'لا تنسَ أذكارك اليومية! ☝️', search: 'بحث...', loading: 'جاري التحميل...', error: 'خطأ',
    retry: 'إعادة المحاولة', save: 'حفظ', delete: 'حذف', cancel: 'إلغاء', copy: 'نسخ', share: 'مشاركة',
    copied: 'تم النسخ', logout: 'تسجيل الخروج', logoutConfirm: 'هل أنت متأكد من تسجيل الخروج؟',
    guest: 'مستخدم زائر', guestMode: 'وضع الزائر', guestLogin: 'تم الدخول كزائر',
    googleSignIn: 'تسجيل الدخول بجوجل', guestSignIn: 'المتابعة كزائر',
    pagesRead: 'صفحات مقروءة', dhikrCount: 'ذكر', streak: 'سلسلة أيام', quickAccess: 'وصول سريع',
    language: 'اللغة', theme: 'المظهر', notifications: 'الإشعارات', about: 'حول',
    lightTheme: 'المظهر الفاتح', darkTheme: 'المظهر الداكن', tafsir: 'تفسير', reciter: 'القارئ',
    surah: 'سورة', ayah: 'آية', bismillah: 'بسم الله الرحمن الرحيم',
    noNotes: 'لا توجد ملاحظات', noNotesDesc: 'احفظ آياتك المفضلة أثناء قراءة القرآن',
    goToQuran: 'اذهب للقرآن', allNotes: 'الكل', ayahNotes: 'آيات', storyNotes: 'قصص',
    addNote: 'إضافة ملاحظة', noteTitle: 'عنوان الملاحظة', noteContent: 'محتوى الملاحظة',
    scholarSelection: 'اسأل أحد العلماء', askQuestion: 'اكتب سؤالك...',
    thinking: 'يفكر...', suggestedQuestions: 'أسئلة مقترحة', savedSuccessfully: 'تم الحفظ بنجاح',
    version: 'تطبيق الإسلام v2.0', surahLoading: 'جاري تحميل السورة...', surahError: 'فشل تحميل السورة',
    tafsirNotFound: 'التفسير غير موجود.', tafsirError: 'خطأ في تحميل التفسير.',
    saveNote: 'حفظ الملاحظة', tafsirMode: 'وضع التفسير',
    tafsirModeDesc: 'اقرأ تفسير الآيات ودوّن ملاحظات', backToHome: 'العودة للرئيسية',
    stats: 'الإحصائيات', worshipStats: 'إحصائيات العبادة', totalDhikr: 'إجمالي الذكر',
    hadithRead: 'أحاديث مقروءة', quranPages: 'صفحات القرآن', dayStreak: 'سلسلة الأيام',
    selectScholar: 'اختر عالم التفسير', tafsirScholars: 'علماء التفسير',
    ibnKathir: 'ابن كثير', taberi: 'الطبري', qurtubi: 'القرطبي', jalalayn: 'الجلالين',
    elmaliHamdi: 'الملالي حمدي يازر', fahrRazi: 'فخر الدين الرازي',
    listenHadith: 'استمع', stopListening: 'إيقاف', hadithCount: 'حديث',
    category: 'فئة', narrator: 'راوي', source: 'مصدر', topic: 'موضوع',
    searchHadith: 'ابحث عن حديث...', searchSurah: 'ابحث عن سورة أو آية...',
    searchVerse: 'بحث آية', noResults: 'لم يتم العثور على نتائج',
    prayerTimes: 'أوقات الصلاة', nextPrayer: 'الصلاة التالية', remaining: 'متبقية',
    allPrayerTimes: 'أوقات الصلاة اليوم', location: 'موقعك',
    locationPermission: 'إذن الموقع مطلوب', compassNotAvailable: 'البوصلة غير متوفرة',
    qiblaDirection: 'اتجاه القبلة', degrees: 'درجة',
    counter: 'عداد', reset: 'إعادة تعيين', completed: 'مكتمل',
    totalCount: 'إجمالي عدد الأذكار', touchToCount: 'المس للعد',
  },
};

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('tr');

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((val) => {
      if (val && TRANSLATIONS[val]) setLangState(val);
    });
  }, []);

  const setLang = useCallback(async (code) => {
    if (TRANSLATIONS[code]) {
      setLangState(code);
      await AsyncStorage.setItem(LANG_KEY, code);
    }
  }, []);

  const t = useCallback((key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.tr[key] || key;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used within LangProvider');
  return context;
}
