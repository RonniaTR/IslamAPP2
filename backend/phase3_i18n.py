"""
Phase 3: Deep i18n System + Offline Language Packs
- Complete TR/EN/AR translations for all UI
- AI responses in selected language
- Downloadable offline packs (Quran, Tafsir, Hadith, UI)
- Compressed pack format for storage efficiency
"""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime, timezone
import hashlib
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent

# ===================== DEEP i18n TRANSLATIONS =====================

TRANSLATIONS_V2 = {
    "tr": {
        # Navigation
        "home": "Ana Sayfa", "quran": "Kur'an", "hadith": "Hadis", "chat": "AI Sohbet",
        "settings": "Ayarlar", "profile": "Profil", "premium": "Premium", "achievements": "Başarımlar",
        "comparative": "Karşılaştırmalı", "notes": "Notlar", "bookmarks": "Yer İmleri",
        "discover": "Keşfet", "quiz": "Bilgi Yarışması",
        # Common
        "loading": "Yükleniyor...", "error": "Hata oluştu", "retry": "Tekrar dene",
        "save": "Kaydet", "cancel": "İptal", "delete": "Sil", "edit": "Düzenle",
        "share": "Paylaş", "copy": "Kopyala", "copied": "Kopyalandı", "search": "Ara",
        "all": "Tümü", "back": "Geri", "next": "İleri", "close": "Kapat",
        "yes": "Evet", "no": "Hayır", "ok": "Tamam", "done": "Tamamlandı",
        # Quran
        "surahs": "Sureler", "verses": "Ayet", "play": "Oynat", "pause": "Durdur",
        "full_surah_play": "Tüm sureyi dinle", "playing": "Oynatılıyor",
        "tafsir": "Tefsir", "meal": "Meal", "kissa": "Kıssa", "juz": "Cüz",
        "listen_meal": "Türkçe Meal Dinle", "reciter": "Kari", "revelation": "İniş",
        "surah_detail": "Sure Detayı",
        # Tafsir
        "tafsir_scholars": "Müfessirler", "tafsir_compare": "Karşılaştır",
        "tafsir_summary": "Kısa Özet", "tafsir_simplified": "Sadeleştirilmiş",
        "tafsir_academic": "Akademik", "tafsir_linguistic": "Dil Analizi",
        "confidence_score": "Güven Skoru",
        # Hadith
        "hadith_collections": "Hadis Koleksiyonları", "hadith_search": "Hadis Ara",
        "word_analysis": "Kelime Analizi", "ravi_chain": "Ravi Zinciri",
        "hadith_grade": "Sıhhat Derecesi", "hadith_explain": "Açıklama",
        "narrator": "Ravi", "source": "Kaynak", "book": "Kitap",
        "tap_word": "Kelimeye dokunarak analiz edin",
        # AI Chat
        "ai_mufti": "AI Müftü", "ai_experts": "Uzman Botlar",
        "fiqh_bot": "Fıkıh Uzmanı", "tafsir_bot": "Tefsir Uzmanı",
        "hadith_bot": "Hadis Uzmanı", "aqeedah_bot": "Akaid Uzmanı",
        "comparative_bot": "Karşılaştırmalı Dinler",
        "ask_question": "Sorunuzu yazın...", "thinking": "Düşünüyorum...",
        "daily_limit": "Günlük limit", "clear_chat": "Sohbeti temizle",
        "expert_mode": "Uzman Modu", "auto_mode": "Otomatik Yönlendirme",
        # Comparative
        "comparative_title": "Karşılaştırmalı İnançlar",
        "islam": "İslam", "christianity": "Hristiyanlık", "judaism": "Yahudilik",
        "common_points": "Ortak Noktalar", "differences": "Temel Farklar",
        "ai_analysis": "AI Derinlemesine Analiz",
        # Premium
        "premium_title": "Premium Üyelik", "free_plan": "Ücretsiz",
        "premium_plan": "Premium", "monthly": "Aylık", "yearly": "Yıllık",
        "upgrade": "Yükselt", "current_plan": "Mevcut Plan",
        # Gamification
        "level": "Seviye", "xp": "XP", "streak": "Seri", "badges": "Rozetler",
        "daily_quests": "Günlük Görevler", "weekly_xp": "Haftalık XP",
        "invite_friend": "Arkadaş Davet", "referral_code": "Davet Kodu",
        # Offline
        "offline_packs": "Çevrimdışı Paketler", "download": "İndir",
        "downloading": "İndiriliyor...", "downloaded": "İndirildi",
        "pack_quran": "Kur'an Paketi", "pack_hadith": "Hadis Paketi",
        "pack_tafsir": "Tefsir Paketi", "pack_ui": "Arayüz Çevirileri",
        "offline_ready": "Çevrimdışı kullanıma hazır",
        "storage_used": "Kullanılan Alan",
        # Settings
        "language": "Dil", "theme": "Tema", "dark": "Karanlık",
        "light": "Aydınlık", "emerald": "Zümrüt",
        "notifications": "Bildirimler", "city": "Şehir",
        # Dashboard
        "greeting_hello": "Selam", "bismillah_full": "Bismillahirrahmanirrahim",
        "next_prayer": "Sonraki Vakit", "remaining_time": "kalan süre",
        "verse_of_day": "Günün Ayeti", "hadith_of_day": "Günün Hadisi",
        "hadith_collection_go": "Hadis Koleksiyonuna Git",
        "mood_question": "Bugün kalbin neye ihtiyaç duyuyor?",
        "mood_peace": "Huzur", "mood_peace_desc": "İç huzur ve sükûnet",
        "mood_motivation": "Motivasyon", "mood_motivation_desc": "Güç ve azim",
        "mood_patience": "Sabır", "mood_patience_desc": "Dayanma gücü",
        "mood_gratitude": "Şükür", "mood_gratitude_desc": "Nimete şükretmek",
        "listen": "Dinle", "stop": "Durdur", "listen_loading": "Yükleniyor",
        "continue_reading": "Devam Et", "read_quran": "Kur'an Oku",
        "last_position": "Son kaldığın yer",
        "dhikr": "Zikir", "dhikr_desc": "Hızlı zikir sayacı",
        "qibla_short": "Kıble", "qibla_find": "Kıble yönünü bul",
        "my_notes": "Notlar", "saved_notes": "Kayıtlı notların",
        "knowledge_treasure": "İslam Bilgi Hazinesi",
        "topics": "konu", "explore_it": "İncele", "scored": "Puanlı",
        "basic": "Temel", "deep": "Derin",
        "dhikr_counter": "Zikir Sayacı", "start_dhikr": "Zikir başlat",
        "target": "Hedef",
        "daily_worship": "Günlük İbadet Takibi",
        "prayer_done": "Namaz kılındı", "quran_read": "Kur'an okundu",
        "charity_given": "Sadaka verildi", "dhikr_done": "Zikir yapıldı",
        "ramadan": "Ramazan", "iftar_countdown": "İftara kalan süre",
        "quick_access": "Hızlı Erişim",
        "test_knowledge": "Bilgini test et", "find_qibla": "Kıble yönünü bul",
        "listen_translation": "Türkçe meal seslendirme", "ask_scholar": "12 alimden görüş al",
        "listen_meal_short": "Meal Dinle", "ask_scholar_short": "Hocaya Sor",
        "offline_banner": "Çevrimdışı mod — veriler önbellekten yükleniyor",
        "dua": "Dua", "hadith_sherif": "Hadis-i Şerif", "read_btn": "Oku",
        # AI Chat
        "ai_welcome": "Selam", "ai_5experts": "5 uzman bot · Otomatik yönlendirme",
        "ai_direct_expert": "Doğrudan uzmana sorun",
        "ai_experts_analyzing": "Uzmanlar analiz ediyor...",
        "ai_connection_error": "Bağlantı hatası oluştu. Lütfen tekrar deneyin.",
        "ai_premium_upgrade": "Premium'a geçerek sınırsız soru sorun",
        "ai_premium_limit": "Günlük limit doldu. Premium ile sınırsız sorun!",
        "ai_premium_unlock": "Premium'a geçin...",
        "ai_switch_auto": "Otomatiğe geç",
        "ai_select_expert": "Uzman Seçin", "ai_mode": "Mod",
        "ai_knowledge_level": "Bilgi Seviyesi",
        "ai_beginner": "Başlangıç", "ai_intermediate": "Orta", "ai_advanced": "İleri",
        "ai_auto": "Otomatik", "ai_expert_select": "Uzman Seç",
        "ai_auto_desc": "AI soruyu analiz eder, doğru uzmana yönlendirir",
        "ai_expert_desc": "Belirli bir uzmana doğrudan sorun",
        "ai_confidence_high": "Yüksek", "ai_confidence_medium": "Orta", "ai_confidence_low": "Düşük",
        "ai_confidence": "Güven", "ai_source_available": "Kaynak mevcut",
        # AI Quick Questions
        "ai_q_prayer": "Namaz nasıl kılınır?", "ai_q_prayer_cat": "İbadet",
        "ai_q_fasting": "Oruç kimlere farzdır?", "ai_q_fasting_cat": "Ramazan",
        "ai_q_zakat": "Zekat nasıl hesaplanır?", "ai_q_zakat_cat": "Zekat",
        "ai_q_ablution": "Abdest nasıl alınır?", "ai_q_ablution_cat": "Temizlik",
        "ai_q_tafsir": "Bakara suresi 255. ayet tefsiri", "ai_q_tafsir_cat": "Tefsir",
        "ai_q_hadith": "Ameller niyetlere göredir hadisi", "ai_q_hadith_cat": "Hadis",
        "ai_q_faith": "İslam'da kader inancı", "ai_q_faith_cat": "Akaid",
        "ai_q_compare": "İslam ve Hristiyanlık'ta dua", "ai_q_compare_cat": "Mukayese",
        # Settings
        "daily_notifications": "Günlük Bildirimler",
        "notif_on": "Açık", "notif_off": "Kapalı",
        "select_city": "Seçiniz", "logout": "Çıkış Yap",
    },
    "en": {
        "home": "Home", "quran": "Quran", "hadith": "Hadith", "chat": "AI Chat",
        "settings": "Settings", "profile": "Profile", "premium": "Premium", "achievements": "Achievements",
        "comparative": "Comparative", "notes": "Notes", "bookmarks": "Bookmarks",
        "discover": "Discover", "quiz": "Quiz",
        "loading": "Loading...", "error": "An error occurred", "retry": "Retry",
        "save": "Save", "cancel": "Cancel", "delete": "Delete", "edit": "Edit",
        "share": "Share", "copy": "Copy", "copied": "Copied", "search": "Search",
        "all": "All", "back": "Back", "next": "Next", "close": "Close",
        "yes": "Yes", "no": "No", "ok": "OK", "done": "Done",
        "surahs": "Surahs", "verses": "Verses", "play": "Play", "pause": "Pause",
        "full_surah_play": "Play full surah", "playing": "Playing",
        "tafsir": "Tafsir", "meal": "Translation", "kissa": "Story", "juz": "Juz",
        "listen_meal": "Listen Translation", "reciter": "Reciter", "revelation": "Revelation",
        "surah_detail": "Surah Detail",
        "tafsir_scholars": "Scholars", "tafsir_compare": "Compare",
        "tafsir_summary": "Summary", "tafsir_simplified": "Simplified",
        "tafsir_academic": "Academic", "tafsir_linguistic": "Linguistic Analysis",
        "confidence_score": "Confidence Score",
        "hadith_collections": "Hadith Collections", "hadith_search": "Search Hadith",
        "word_analysis": "Word Analysis", "ravi_chain": "Chain of Narrators",
        "hadith_grade": "Authenticity Grade", "hadith_explain": "Explanation",
        "narrator": "Narrator", "source": "Source", "book": "Book",
        "tap_word": "Tap a word to analyze",
        "ai_mufti": "AI Scholar", "ai_experts": "Expert Bots",
        "fiqh_bot": "Fiqh Expert", "tafsir_bot": "Tafsir Expert",
        "hadith_bot": "Hadith Expert", "aqeedah_bot": "Aqeedah Expert",
        "comparative_bot": "Comparative Religion",
        "ask_question": "Type your question...", "thinking": "Thinking...",
        "daily_limit": "Daily limit", "clear_chat": "Clear chat",
        "expert_mode": "Expert Mode", "auto_mode": "Auto Routing",
        "comparative_title": "Comparative Beliefs",
        "islam": "Islam", "christianity": "Christianity", "judaism": "Judaism",
        "common_points": "Common Points", "differences": "Key Differences",
        "ai_analysis": "AI Deep Analysis",
        "premium_title": "Premium Membership", "free_plan": "Free",
        "premium_plan": "Premium", "monthly": "Monthly", "yearly": "Yearly",
        "upgrade": "Upgrade", "current_plan": "Current Plan",
        "level": "Level", "xp": "XP", "streak": "Streak", "badges": "Badges",
        "daily_quests": "Daily Quests", "weekly_xp": "Weekly XP",
        "invite_friend": "Invite Friend", "referral_code": "Referral Code",
        "offline_packs": "Offline Packs", "download": "Download",
        "downloading": "Downloading...", "downloaded": "Downloaded",
        "pack_quran": "Quran Pack", "pack_hadith": "Hadith Pack",
        "pack_tafsir": "Tafsir Pack", "pack_ui": "UI Translations",
        "offline_ready": "Ready for offline use",
        "storage_used": "Storage Used",
        "language": "Language", "theme": "Theme", "dark": "Dark",
        "light": "Light", "emerald": "Emerald",
        "notifications": "Notifications", "city": "City",
        # Dashboard
        "greeting_hello": "Peace", "bismillah_full": "In the name of God, the Most Gracious, the Most Merciful",
        "next_prayer": "Next Prayer", "remaining_time": "remaining",
        "verse_of_day": "Verse of the Day", "hadith_of_day": "Hadith of the Day",
        "hadith_collection_go": "Go to Hadith Collection",
        "mood_question": "What does your heart need today?",
        "mood_peace": "Peace", "mood_peace_desc": "Inner peace & serenity",
        "mood_motivation": "Motivation", "mood_motivation_desc": "Strength & determination",
        "mood_patience": "Patience", "mood_patience_desc": "Endurance & perseverance",
        "mood_gratitude": "Gratitude", "mood_gratitude_desc": "Being thankful for blessings",
        "listen": "Listen", "stop": "Stop", "listen_loading": "Loading",
        "continue_reading": "Continue", "read_quran": "Read Quran",
        "last_position": "Last position",
        "dhikr": "Dhikr", "dhikr_desc": "Quick dhikr counter",
        "qibla_short": "Qibla", "qibla_find": "Find Qibla direction",
        "my_notes": "Notes", "saved_notes": "Your saved notes",
        "knowledge_treasure": "Islamic Knowledge Treasury",
        "topics": "topics", "explore_it": "Explore", "scored": "Scored",
        "basic": "Basic", "deep": "Deep",
        "dhikr_counter": "Dhikr Counter", "start_dhikr": "Start dhikr",
        "target": "Target",
        "daily_worship": "Daily Worship Tracker",
        "prayer_done": "Prayer completed", "quran_read": "Quran read",
        "charity_given": "Charity given", "dhikr_done": "Dhikr completed",
        "ramadan": "Ramadan", "iftar_countdown": "Time until Iftar",
        "quick_access": "Quick Access",
        "test_knowledge": "Test your knowledge", "find_qibla": "Find Qibla direction",
        "listen_translation": "Listen to translation", "ask_scholar": "Get views from 12 scholars",
        "listen_meal_short": "Translation", "ask_scholar_short": "Ask Scholar",
        "offline_banner": "Offline mode — loading from cache",
        "dua": "Dua", "hadith_sherif": "Noble Hadith", "read_btn": "Read",
        # AI Chat
        "ai_welcome": "Peace", "ai_5experts": "5 expert bots · Auto routing",
        "ai_direct_expert": "Ask an expert directly",
        "ai_experts_analyzing": "Experts are analyzing...",
        "ai_connection_error": "Connection error. Please try again.",
        "ai_premium_upgrade": "Upgrade to Premium for unlimited questions",
        "ai_premium_limit": "Daily limit reached. Go Premium for unlimited!",
        "ai_premium_unlock": "Upgrade to Premium...",
        "ai_switch_auto": "Switch to auto",
        "ai_select_expert": "Select Expert", "ai_mode": "Mode",
        "ai_knowledge_level": "Knowledge Level",
        "ai_beginner": "Beginner", "ai_intermediate": "Intermediate", "ai_advanced": "Advanced",
        "ai_auto": "Auto", "ai_expert_select": "Expert",
        "ai_auto_desc": "AI analyzes question and routes to correct expert",
        "ai_expert_desc": "Ask a specific expert directly",
        "ai_confidence_high": "High", "ai_confidence_medium": "Medium", "ai_confidence_low": "Low",
        "ai_confidence": "Confidence", "ai_source_available": "Source available",
        # AI Quick Questions
        "ai_q_prayer": "How to perform prayer?", "ai_q_prayer_cat": "Worship",
        "ai_q_fasting": "Who must fast?", "ai_q_fasting_cat": "Ramadan",
        "ai_q_zakat": "How to calculate Zakat?", "ai_q_zakat_cat": "Zakat",
        "ai_q_ablution": "How to perform Wudu?", "ai_q_ablution_cat": "Purity",
        "ai_q_tafsir": "Tafsir of Ayat al-Kursi (2:255)", "ai_q_tafsir_cat": "Tafsir",
        "ai_q_hadith": "Hadith about intentions", "ai_q_hadith_cat": "Hadith",
        "ai_q_faith": "Belief in Divine Decree in Islam", "ai_q_faith_cat": "Aqeedah",
        "ai_q_compare": "Prayer in Islam and Christianity", "ai_q_compare_cat": "Comparative",
        # Settings
        "daily_notifications": "Daily Notifications",
        "notif_on": "On", "notif_off": "Off",
        "select_city": "Select", "logout": "Logout",
    },
    "ar": {
        "home": "الرئيسية", "quran": "القرآن", "hadith": "الحديث", "chat": "محادثة الذكاء",
        "settings": "الإعدادات", "profile": "الملف الشخصي", "premium": "مميز", "achievements": "الإنجازات",
        "comparative": "مقارنة", "notes": "ملاحظات", "bookmarks": "علامات",
        "discover": "اكتشف", "quiz": "اختبار",
        "loading": "جاري التحميل...", "error": "حدث خطأ", "retry": "إعادة المحاولة",
        "save": "حفظ", "cancel": "إلغاء", "delete": "حذف", "edit": "تعديل",
        "share": "مشاركة", "copy": "نسخ", "copied": "تم النسخ", "search": "بحث",
        "all": "الكل", "back": "رجوع", "next": "التالي", "close": "إغلاق",
        "yes": "نعم", "no": "لا", "ok": "حسناً", "done": "تم",
        "surahs": "السور", "verses": "آية", "play": "تشغيل", "pause": "إيقاف",
        "full_surah_play": "تشغيل السورة كاملة", "playing": "قيد التشغيل",
        "tafsir": "تفسير", "meal": "ترجمة", "kissa": "قصة", "juz": "جزء",
        "listen_meal": "استمع للترجمة", "reciter": "القارئ", "revelation": "النزول",
        "surah_detail": "تفاصيل السورة",
        "tafsir_scholars": "المفسرون", "tafsir_compare": "مقارنة",
        "tafsir_summary": "ملخص", "tafsir_simplified": "مبسط",
        "tafsir_academic": "أكاديمي", "tafsir_linguistic": "تحليل لغوي",
        "confidence_score": "درجة الثقة",
        "hadith_collections": "مجموعات الأحاديث", "hadith_search": "بحث في الأحاديث",
        "word_analysis": "تحليل الكلمة", "ravi_chain": "سلسلة الرواة",
        "hadith_grade": "درجة الصحة", "hadith_explain": "شرح",
        "narrator": "الراوي", "source": "المصدر", "book": "الكتاب",
        "tap_word": "اضغط على الكلمة للتحليل",
        "ai_mufti": "مفتي الذكاء", "ai_experts": "الخبراء",
        "fiqh_bot": "خبير الفقه", "tafsir_bot": "خبير التفسير",
        "hadith_bot": "خبير الحديث", "aqeedah_bot": "خبير العقيدة",
        "comparative_bot": "مقارنة الأديان",
        "ask_question": "اكتب سؤالك...", "thinking": "جاري التفكير...",
        "daily_limit": "الحد اليومي", "clear_chat": "مسح المحادثة",
        "expert_mode": "وضع الخبير", "auto_mode": "التوجيه التلقائي",
        "comparative_title": "مقارنة المعتقدات",
        "islam": "الإسلام", "christianity": "المسيحية", "judaism": "اليهودية",
        "common_points": "النقاط المشتركة", "differences": "الاختلافات الرئيسية",
        "ai_analysis": "تحليل عميق بالذكاء",
        "premium_title": "العضوية المميزة", "free_plan": "مجاني",
        "premium_plan": "مميز", "monthly": "شهري", "yearly": "سنوي",
        "upgrade": "ترقية", "current_plan": "الخطة الحالية",
        "level": "المستوى", "xp": "نقاط الخبرة", "streak": "التتابع", "badges": "الشارات",
        "daily_quests": "المهام اليومية", "weekly_xp": "نقاط الأسبوع",
        "invite_friend": "دعوة صديق", "referral_code": "رمز الدعوة",
        "offline_packs": "حزم بدون إنترنت", "download": "تحميل",
        "downloading": "جاري التحميل...", "downloaded": "تم التحميل",
        "pack_quran": "حزمة القرآن", "pack_hadith": "حزمة الأحاديث",
        "pack_tafsir": "حزمة التفسير", "pack_ui": "ترجمات الواجهة",
        "offline_ready": "جاهز للاستخدام بدون إنترنت",
        "storage_used": "المساحة المستخدمة",
        "language": "اللغة", "theme": "المظهر", "dark": "داكن",
        "light": "فاتح", "emerald": "زمردي",
        "notifications": "الإشعارات", "city": "المدينة",
        # Dashboard
        "greeting_hello": "السلام عليكم", "bismillah_full": "بسم الله الرحمن الرحيم",
        "next_prayer": "الصلاة التالية", "remaining_time": "المتبقي",
        "verse_of_day": "آية اليوم", "hadith_of_day": "حديث اليوم",
        "hadith_collection_go": "اذهب إلى مجموعة الأحاديث",
        "mood_question": "ماذا يحتاج قلبك اليوم؟",
        "mood_peace": "سكينة", "mood_peace_desc": "السلام الداخلي والطمأنينة",
        "mood_motivation": "تحفيز", "mood_motivation_desc": "القوة والعزيمة",
        "mood_patience": "صبر", "mood_patience_desc": "التحمل والمثابرة",
        "mood_gratitude": "شكر", "mood_gratitude_desc": "شكر النعم",
        "listen": "استمع", "stop": "إيقاف", "listen_loading": "جاري التحميل",
        "continue_reading": "متابعة", "read_quran": "اقرأ القرآن",
        "last_position": "آخر موضع",
        "dhikr": "ذكر", "dhikr_desc": "عداد ذكر سريع",
        "qibla_short": "القبلة", "qibla_find": "اعثر على اتجاه القبلة",
        "my_notes": "ملاحظات", "saved_notes": "ملاحظاتك المحفوظة",
        "knowledge_treasure": "كنز المعرفة الإسلامية",
        "topics": "موضوع", "explore_it": "استكشف", "scored": "بنقاط",
        "basic": "أساسي", "deep": "عميق",
        "dhikr_counter": "عداد الذكر", "start_dhikr": "ابدأ الذكر",
        "target": "الهدف",
        "daily_worship": "تتبع العبادة اليومية",
        "prayer_done": "تمت الصلاة", "quran_read": "تمت قراءة القرآن",
        "charity_given": "تم التصدق", "dhikr_done": "تم الذكر",
        "ramadan": "رمضان", "iftar_countdown": "الوقت المتبقي للإفطار",
        "quick_access": "وصول سريع",
        "test_knowledge": "اختبر معلوماتك", "find_qibla": "اعثر على القبلة",
        "listen_translation": "استمع للترجمة", "ask_scholar": "استشر ١٢ عالماً",
        "listen_meal_short": "الترجمة", "ask_scholar_short": "اسأل عالماً",
        "offline_banner": "وضع بدون إنترنت — التحميل من الذاكرة",
        "dua": "دعاء", "hadith_sherif": "الحديث الشريف", "read_btn": "اقرأ",
        # AI Chat
        "ai_welcome": "السلام عليكم", "ai_5experts": "٥ خبراء · توجيه تلقائي",
        "ai_direct_expert": "اسأل خبيراً مباشرة",
        "ai_experts_analyzing": "الخبراء يحللون...",
        "ai_connection_error": "خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
        "ai_premium_upgrade": "ترقّ للمميز لأسئلة غير محدودة",
        "ai_premium_limit": "انتهى الحد اليومي. اشترك مميز لأسئلة غير محدودة!",
        "ai_premium_unlock": "ترقّ للمميز...",
        "ai_switch_auto": "تبديل للتلقائي",
        "ai_select_expert": "اختر خبيراً", "ai_mode": "الوضع",
        "ai_knowledge_level": "مستوى المعرفة",
        "ai_beginner": "مبتدئ", "ai_intermediate": "متوسط", "ai_advanced": "متقدم",
        "ai_auto": "تلقائي", "ai_expert_select": "اختر خبيراً",
        "ai_auto_desc": "يحلل الذكاء الاصطناعي السؤال ويوجهه للخبير المناسب",
        "ai_expert_desc": "اسأل خبيراً محدداً مباشرة",
        "ai_confidence_high": "عالية", "ai_confidence_medium": "متوسطة", "ai_confidence_low": "منخفضة",
        "ai_confidence": "الثقة", "ai_source_available": "المصدر متاح",
        # AI Quick Questions
        "ai_q_prayer": "كيف تؤدى الصلاة؟", "ai_q_prayer_cat": "عبادة",
        "ai_q_fasting": "على من يجب الصوم؟", "ai_q_fasting_cat": "رمضان",
        "ai_q_zakat": "كيف تحسب الزكاة؟", "ai_q_zakat_cat": "زكاة",
        "ai_q_ablution": "كيف يؤدى الوضوء؟", "ai_q_ablution_cat": "طهارة",
        "ai_q_tafsir": "تفسير آية الكرسي (٢:٢٥٥)", "ai_q_tafsir_cat": "تفسير",
        "ai_q_hadith": "حديث إنما الأعمال بالنيات", "ai_q_hadith_cat": "حديث",
        "ai_q_faith": "الإيمان بالقدر في الإسلام", "ai_q_faith_cat": "عقيدة",
        "ai_q_compare": "الدعاء في الإسلام والمسيحية", "ai_q_compare_cat": "مقارنة",
        # Settings
        "daily_notifications": "الإشعارات اليومية",
        "notif_on": "مفعّل", "notif_off": "معطّل",
        "select_city": "اختر", "logout": "تسجيل الخروج",
    },
}

# ===================== OFFLINE PACKS =====================

OFFLINE_PACKS = {
    "quran_tr": {"id": "quran_tr", "name": "Kur'an (Türkçe)", "name_en": "Quran (Turkish)", "name_ar": "القرآن (تركي)",
                 "lang": "tr", "type": "quran", "file": "quran_turkish.json", "size_mb": 2.1, "icon": "📖"},
    "quran_en": {"id": "quran_en", "name": "Kur'an (İngilizce)", "name_en": "Quran (English)", "name_ar": "القرآن (إنجليزي)",
                 "lang": "en", "type": "quran", "file": "quran_english.json", "size_mb": 1.8, "icon": "📖"},
    "quran_ar": {"id": "quran_ar", "name": "Kur'an (Arapça)", "name_en": "Quran (Arabic)", "name_ar": "القرآن (عربي)",
                 "lang": "ar", "type": "quran", "file": "quran_arabic.json", "size_mb": 3.2, "icon": "📖"},
    "hadith_all": {"id": "hadith_all", "name": "Hadis Koleksiyonu", "name_en": "Hadith Collection", "name_ar": "مجموعة الأحاديث",
                   "lang": "all", "type": "hadith", "file": "hadiths.json", "size_mb": 4.5, "icon": "📜"},
    "ui_tr": {"id": "ui_tr", "name": "Arayüz (Türkçe)", "name_en": "UI (Turkish)", "name_ar": "الواجهة (تركي)",
              "lang": "tr", "type": "ui", "size_mb": 0.01, "icon": "🌐"},
    "ui_en": {"id": "ui_en", "name": "Arayüz (İngilizce)", "name_en": "UI (English)", "name_ar": "الواجهة (إنجليزي)",
              "lang": "en", "type": "ui", "size_mb": 0.01, "icon": "🌐"},
    "ui_ar": {"id": "ui_ar", "name": "Arayüz (Arapça)", "name_en": "UI (Arabic)", "name_ar": "الواجهة (عربي)",
              "lang": "ar", "type": "ui", "size_mb": 0.01, "icon": "🌐"},
}


def setup_phase3_i18n_routes(router: APIRouter, db, gemini_generate):
    """Register deep i18n and offline pack routes"""

    @router.get("/i18n/v2/{lang}")
    async def get_translations_v2(lang: str):
        """Get complete Phase 3 translations for a language"""
        translations = TRANSLATIONS_V2.get(lang, TRANSLATIONS_V2["tr"])
        return {
            "language": lang,
            "translations": translations,
            "direction": "rtl" if lang == "ar" else "ltr",
            "font_family": "Amiri, serif" if lang == "ar" else "Playfair Display, Inter, sans-serif",
        }

    @router.get("/offline/packs")
    async def get_offline_packs(lang: Optional[str] = None):
        """List available offline packs"""
        packs = list(OFFLINE_PACKS.values())
        if lang:
            packs = [p for p in packs if p["lang"] == lang or p["lang"] == "all"]
        return packs

    @router.get("/offline/pack/{pack_id}")
    async def download_offline_pack(pack_id: str):
        """Download an offline pack data"""
        pack = OFFLINE_PACKS.get(pack_id)
        if not pack:
            raise HTTPException(status_code=404, detail="Pack not found")

        if pack["type"] == "ui":
            lang = pack["lang"]
            return {
                "pack_id": pack_id,
                "type": "ui",
                "data": TRANSLATIONS_V2.get(lang, TRANSLATIONS_V2["tr"]),
                "version": "3.0",
            }

        if pack.get("file"):
            file_path = ROOT_DIR / "data" / pack["file"]
            if file_path.exists():
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    return {
                        "pack_id": pack_id,
                        "type": pack["type"],
                        "data": data,
                        "version": "3.0",
                    }
                except Exception as e:
                    logger.error(f"Pack load failed: {e}")
                    raise HTTPException(status_code=500, detail="Pack yüklenemedi")

        raise HTTPException(status_code=404, detail="Pack data not found")

    @router.get("/offline/manifest")
    async def get_offline_manifest():
        """Get manifest of all offline packs with versions for sync"""
        manifest = {}
        for pid, pack in OFFLINE_PACKS.items():
            manifest[pid] = {
                "id": pid,
                "version": "3.0",
                "size_mb": pack["size_mb"],
                "type": pack["type"],
                "lang": pack["lang"],
            }
        return {"manifest": manifest, "api_version": "3.0"}
