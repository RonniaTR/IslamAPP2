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
