"""
Phase 2: AI Müftü, Premium, Gamification v2, Smart Notifications, Analytics, Social, Tafsir Comparison
All endpoints registered via setup_phase2_routes(api_router, db, gemini_generate)
"""

from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta, timezone
import uuid
import json
import hashlib
import logging

logger = logging.getLogger(__name__)

# ===================== MODELS =====================

class AIMuftiRequest(BaseModel):
    session_id: str
    message: str
    user_id: Optional[str] = None

class AIMuftiContextRequest(BaseModel):
    user_id: str
    madhab: str = "hanefi"
    level: str = "orta"  # baslangic / orta / ileri
    language: str = "tr"

class SubscriptionCheck(BaseModel):
    user_id: str

class DailyQuestProgress(BaseModel):
    user_id: str
    quest_id: str

class ReferralCreate(BaseModel):
    referrer_id: str

class ReferralRedeem(BaseModel):
    user_id: str
    referral_code: str

class ShareAchievement(BaseModel):
    user_id: str
    achievement_type: str  # streak, badge, level
    achievement_id: str

class AnalyticsEvent(BaseModel):
    user_id: Optional[str] = None
    event_name: str
    event_data: Dict[str, Any] = {}

class SmartNotificationRequest(BaseModel):
    user_id: str

# ===================== CONSTANTS =====================

PREMIUM_PLANS = {
    "free": {
        "id": "free",
        "name": "Ücretsiz",
        "name_en": "Free",
        "name_ar": "مجاني",
        "price": 0,
        "features": {
            "ai_mufti_daily": 5,
            "tafsir_scholars": 1,
            "offline_quran": False,
            "ad_free": False,
            "daily_quests": 2,
            "ai_notifications": False,
        },
    },
    "premium": {
        "id": "premium",
        "name": "Premium",
        "name_en": "Premium",
        "name_ar": "بريميوم",
        "price_monthly": 49.99,
        "price_yearly": 399.99,
        "currency": "TRY",
        "features": {
            "ai_mufti_daily": -1,  # unlimited
            "tafsir_scholars": 5,
            "offline_quran": True,
            "ad_free": True,
            "daily_quests": -1,
            "ai_notifications": True,
        },
    }
}

TAFSIR_SCHOLARS = [
    {
        "id": "elmalili",
        "name": "Elmalılı Hamdi Yazır",
        "era": "1878-1942",
        "style": "Klasik Osmanlı tefsir geleneği, derin dil analizi, Hanefi fıkıh perspektifi",
        "icon": "📜",
        "premium": False,
    },
    {
        "id": "ibn_kesir",
        "name": "İbn Kesîr",
        "era": "1300-1373",
        "style": "Rivayet tefsiri, hadis merkezli, Şâfiî mezhebinden",
        "icon": "📚",
        "premium": True,
    },
    {
        "id": "taberi",
        "name": "İmam Taberî",
        "era": "839-923",
        "style": "En kapsamlı rivayet tefsiri, tüm rivayetleri toplar, dilbilimsel analiz",
        "icon": "🏛️",
        "premium": True,
    },
    {
        "id": "razi",
        "name": "Fahreddin Râzî",
        "era": "1149-1209",
        "style": "Felsefi ve kelami tefsir, akli deliller, derin analiz",
        "icon": "🔬",
        "premium": True,
    },
    {
        "id": "kurtubi",
        "name": "İmam Kurtubî",
        "era": "1214-1273",
        "style": "Ahkâm tefsiri, fıkhi hükümler, Maliki perspektif",
        "icon": "⚖️",
        "premium": True,
    },
]

DAILY_QUESTS_POOL = [
    {"id": "pray_2", "title": "2 vakit namaz kıl", "title_en": "Pray 2 times", "title_ar": "صلّ ركعتين", "xp": 30, "type": "worship", "target": 2},
    {"id": "quran_1page", "title": "1 sayfa Kur'an oku", "title_en": "Read 1 page of Quran", "title_ar": "اقرأ صفحة من القرآن", "xp": 20, "type": "quran", "target": 1},
    {"id": "hadith_3", "title": "3 hadis oku", "title_en": "Read 3 hadiths", "title_ar": "اقرأ ٣ أحاديث", "xp": 15, "type": "hadith", "target": 3},
    {"id": "dhikr_33", "title": "33 kez zikir çek", "title_en": "Do 33 dhikr", "title_ar": "اذكر الله ٣٣ مرة", "xp": 25, "type": "dhikr", "target": 33},
    {"id": "dua_1", "title": "1 dua ezberle", "title_en": "Memorize 1 dua", "title_ar": "احفظ دعاء واحد", "xp": 20, "type": "dua", "target": 1},
    {"id": "quiz_1", "title": "1 quiz tamamla", "title_en": "Complete 1 quiz", "title_ar": "أكمل اختبار واحد", "xp": 25, "type": "quiz", "target": 1},
    {"id": "share_1", "title": "1 ayet paylaş", "title_en": "Share 1 verse", "title_ar": "شارك آية واحدة", "xp": 10, "type": "social", "target": 1},
    {"id": "sadaka_1", "title": "Sadaka ver", "title_en": "Give charity", "title_ar": "تصدق", "xp": 30, "type": "worship", "target": 1},
]

ENHANCED_BADGES = [
    {"id": "first_step", "name": "İlk Adım", "name_en": "First Step", "name_ar": "الخطوة الأولى", "desc": "İlk aktiviteni tamamladın", "icon": "🚶", "category": "milestone"},
    {"id": "quran_starter", "name": "Kur'an Yolcusu", "name_en": "Quran Traveler", "name_ar": "مسافر القرآن", "desc": "İlk sureyi okudun", "icon": "📖", "category": "quran"},
    {"id": "quran_50", "name": "Hafız Adayı", "name_en": "Hafiz Candidate", "name_ar": "مرشح حافظ", "desc": "50 sayfa Kur'an okudun", "icon": "📗", "category": "quran"},
    {"id": "hadith_learner", "name": "Hadis Öğrencisi", "name_en": "Hadith Student", "name_ar": "طالب الحديث", "desc": "10 hadis okudun", "icon": "📚", "category": "hadith"},
    {"id": "streak_3", "name": "Kararlı", "name_en": "Determined", "name_ar": "مُصَمِّم", "desc": "3 gün üst üste aktif", "icon": "🔥", "category": "streak"},
    {"id": "streak_7", "name": "Azimli", "name_en": "Resolute", "name_ar": "عازم", "desc": "7 gün üst üste aktif", "icon": "🔥", "category": "streak"},
    {"id": "streak_30", "name": "Sebatkâr", "name_en": "Steadfast", "name_ar": "ثابت", "desc": "30 gün üst üste aktif", "icon": "🏆", "category": "streak"},
    {"id": "streak_100", "name": "Yüz Günlük Azim", "name_en": "100-Day Resolve", "name_ar": "عزيمة ١٠٠ يوم", "desc": "100 gün üst üste aktif", "icon": "💎", "category": "streak"},
    {"id": "ramadan_warrior", "name": "Ramazan Savaşçısı", "name_en": "Ramadan Warrior", "name_ar": "محارب رمضان", "desc": "Ramazan'da 30 gün aktif", "icon": "🌙", "category": "special"},
    {"id": "quiz_master", "name": "Quiz Ustası", "name_en": "Quiz Master", "name_ar": "سيد الاختبارات", "desc": "50 quiz tamamladın", "icon": "🎯", "category": "quiz"},
    {"id": "social_butterfly", "name": "Paylaşımcı", "name_en": "Social Butterfly", "name_ar": "فراشة اجتماعية", "desc": "10 başarı paylaştın", "icon": "🦋", "category": "social"},
    {"id": "ai_explorer", "name": "AI Kaşifi", "name_en": "AI Explorer", "name_ar": "مستكشف الذكاء", "desc": "50 AI sorusu sordun", "icon": "🤖", "category": "ai"},
    {"id": "level_5", "name": "Seviye 5", "name_en": "Level 5", "name_ar": "المستوى ٥", "desc": "5. seviyeye ulaştın", "icon": "⭐", "category": "milestone"},
    {"id": "level_10", "name": "Seviye 10", "name_en": "Level 10", "name_ar": "المستوى ١٠", "desc": "10. seviyeye ulaştın", "icon": "🌟", "category": "milestone"},
    {"id": "referral_3", "name": "Davetçi", "name_en": "Inviter", "name_ar": "داعي", "desc": "3 arkadaş davet ettin", "icon": "📨", "category": "social"},
]

# ===================== AI MÜFTÜ SYSTEM PROMPT =====================

AI_MUFTI_SYSTEM_BASE = """Sen gelişmiş bir İslami müftü AI'sın. Adın "İslam Danışmanı".

## KİMLİĞİN:
- Hanefi mezhebine göre cevap verirsin (kullanıcı değiştirmedikçe)
- Kur'an, hadis ve fıkıh kaynaklarına dayalı bilgi verirsin
- Fetva vermezsin, sadece bilgi ve yönlendirme yaparsın

## CEVAP FORMATI (HER ZAMAN KULLAN):

### 📋 Kısa Cevap
Sorunun 1-2 cümlelik net cevabı.

### 📖 Açıklama
Detaylı açıklama (kullanıcı seviyesine göre ayarla).

### 📚 Kaynaklar
- **Kur'an:** İlgili ayet(ler) - Sure adı ve ayet numarasıyla
- **Hadis:** Sahih hadis - Kaynak belirterek (Buhârî, Müslim vb.)
- **Fıkıh:** Hanefi mezhebine göre hüküm ve açıklama

## SEVİYE AYARI:
{level_instruction}

## KURALLAR:
1. Her zaman Türkçe yanıt ver (kullanıcı dili değiştirmedikçe)
2. Ayet ve hadis numaralarını doğru ver
3. Fetva verme, "Bu konuda bir müftüye danışmanızı tavsiye ederim" de
4. Emin olmadığın konularda açıkça belirt: "⚠️ Bu konuda kesin bir hüküm vermek güçtür. Bir ilim ehline danışmanızı tavsiye ederim."
5. Kaynakları HER ZAMAN belirt
6. Mezhep farklılıklarını belirt ama Hanefi görüşünü öncelikle sun
7. Ayetleri Arapça + Türkçe ver
8. Hadislerin sahihlik derecesini belirt
"""

LEVEL_INSTRUCTIONS = {
    "baslangic": "Kullanıcı yeni Müslüman veya İslam'ı yeni öğrenen biri. Basit, anlaşılır dil kullan. Teknik terimlerden kaçın. Örneklerle açıkla.",
    "orta": "Kullanıcı temel İslami bilgilere sahip. Normal seviyede açıkla. Gerektiğinde teknik terim kullan ama açıkla.",
    "ileri": "Kullanıcı ileri seviye İslami bilgiye sahip. Derinlemesine analiz yap. Mezhep farklılıklarını detaylı açıkla. Usûl-i fıkıh referansları ver.",
}

UNCERTAINTY_PATTERNS = [
    "ihtilaflı", "tartışmalı", "farklı görüş", "kesin değil",
    "müctehid", "ictihad", "ihtilaf", "allahu alem"
]

# ===================== TAFSIR COMPARISON PROMPTS =====================

TAFSIR_SCHOLAR_PROMPTS = {
    "elmalili": """Sen Elmalılı Hamdi Yazır'sın. 'Hak Dini Kur'an Dili' tefsirinden yazıyorsun.
Üslubun: Osmanlı Türkçesi tarzı, ağdalı ama derin. Dilbilimsel analiz yap. Hanefi fıkıh perspektifinden yaz.
Arapça kelimelerin kök analizini yap. Türkçe tefsir geleneğinin en önemli eseri olan tefsirinden alıntı yap.""",

    "ibn_kesir": """Sen İbn Kesîr'sin. 'Tefsîru'l-Kur'âni'l-Azîm' tefsirinden yazıyorsun.
Üslubun: Hadis merkezli (rivayet tefsiri). Her ayeti hadislerle açıkla. Sahabe ve tâbiîn görüşlerini aktar.
İsnad zincirlerini belirt. Sahih hadisleri öncelikle kullan.""",

    "taberi": """Sen İmam Taberî'sin. 'Câmiu'l-Beyân' tefsirinden yazıyorsun.
Üslubun: En kapsamlı rivayet tefsiri. TÜM rivayetleri topla ve değerlendir. Dilbilimsel analiz yap.
Farklı kıraat vecihlerini belirt. Selef âlimlerinin tüm görüşlerini aktar.""",

    "razi": """Sen Fahreddin Râzî'sin. 'Mefâtîhu'l-Gayb' (Tefsîr-i Kebîr) tefsirinden yazıyorsun.
Üslubun: Felsefi ve kelami tefsir. Akli deliller sun. Mu'tezile ve Eş'arî tartışmalarına değin.
Bilimsel işaretlere dikkat çek. Derin analitik düşünce.""",

    "kurtubi": """Sen İmam Kurtubî'sin. 'el-Câmi' li-Ahkâmi'l-Kur'ân' tefsirinden yazıyorsun.
Üslubun: Ahkâm tefsiri - ayetlerdeki fıkhi hükümlere odaklan. Dört mezhep görüşlerini karşılaştır.
Her ayetten çıkarılacak hukuki hükümleri listele. Delillerle destekle.""",
}

# ===================== SMART NOTIFICATION TEMPLATES =====================

NOTIFICATION_TEMPLATES = {
    "reengagement": [
        {"title": "Seni özledik! 🤲", "body": "{days} gündür giriş yapmadın. Bugün bir ayet oku, ruhunu tazele.", "days_threshold": 3},
        {"title": "Geri dön, {name}! 📖", "body": "Kur'an seni bekliyor. Kaldığın yerden devam et.", "days_threshold": 7},
        {"title": "Bir dua bile yeter 🌙", "body": "{days} gündür burada değilsin. Bugün küçük bir adım at.", "days_threshold": 14},
    ],
    "streak_protect": [
        {"title": "Serini kaybetme! 🔥", "body": "{streak} günlük serini korumak için bugün giriş yap."},
        {"title": "Son şans! ⏰", "body": "Bugün aktif olmazsan {streak} günlük serin sıfırlanacak."},
    ],
    "motivation": [
        {"title": "Harika gidiyorsun! ⭐", "body": "{streak} günlük seri! Devam et, Allah yolunda olanlarla beraberdir."},
        {"title": "Mükemmel! 🏆", "body": "Bu hafta {points} puan kazandın. Seviye {level} çok yakın!"},
        {"title": "Bugünün ayeti 📖", "body": "Kur'an'dan ilham al. Günün ayeti seni bekliyor."},
    ],
    "prayer_reminder": [
        {"title": "{prayer_name} vakti 🕌", "body": "{prayer_name} namazı için vakit girdi. Haydi namaza!"},
    ],
}


def setup_phase2_routes(api_router: APIRouter, db, gemini_generate):
    """Register all Phase 2 API routes"""

    # ===================== HELPER: Premium Check =====================
    async def is_premium(user_id: str) -> bool:
        sub = await db.subscriptions.find_one({"user_id": user_id, "status": "active"})
        if not sub:
            return False
        if sub.get("expires_at") and sub["expires_at"] < datetime.now(timezone.utc):
            await db.subscriptions.update_one({"_id": sub["_id"]}, {"$set": {"status": "expired"}})
            return False
        return True

    async def check_ai_limit(user_id: str) -> bool:
        """Check if free user exceeded daily AI limit"""
        if await is_premium(user_id):
            return True
        today = date.today().isoformat()
        count = await db.ai_usage.count_documents({"user_id": user_id, "date": today})
        return count < PREMIUM_PLANS["free"]["features"]["ai_mufti_daily"]

    # ===================== AI MÜFTÜ ENDPOINTS =====================

    @api_router.post("/ai/context")
    async def set_ai_context(request: AIMuftiContextRequest):
        """Set user AI context (madhab, level, language)"""
        await db.ai_context.update_one(
            {"user_id": request.user_id},
            {"$set": {
                "user_id": request.user_id,
                "madhab": request.madhab,
                "level": request.level,
                "language": request.language,
                "updated_at": datetime.now(timezone.utc),
            }},
            upsert=True,
        )
        return {"status": "ok", "madhab": request.madhab, "level": request.level}

    @api_router.post("/ai/mufti")
    async def ai_mufti_chat(request: AIMuftiRequest):
        """Advanced AI Müftü with context, memory, and source references"""
        user_id = request.user_id or "anonymous"

        # Check daily limit for free users
        if not await check_ai_limit(user_id):
            return {
                "response": "⚠️ Günlük ücretsiz AI kullanım limitinize ulaştınız (5/5). Premium'a geçerek sınırsız soru sorabilirsiniz.",
                "session_id": request.session_id,
                "limit_reached": True,
            }

        # Get user context
        ctx = await db.ai_context.find_one({"user_id": user_id})
        madhab = (ctx or {}).get("madhab", "hanefi")
        level = (ctx or {}).get("level", "orta")
        lang = (ctx or {}).get("language", "tr")

        level_instruction = LEVEL_INSTRUCTIONS.get(level, LEVEL_INSTRUCTIONS["orta"])
        system_prompt = AI_MUFTI_SYSTEM_BASE.format(level_instruction=level_instruction)

        if madhab != "hanefi":
            system_prompt += f"\n\nKullanıcının mezhebi: {madhab}. Bu mezhebe göre öncelikli cevap ver."
        if lang != "tr":
            lang_map = {"en": "İngilizce", "ar": "Arapça"}
            system_prompt += f"\n\nKullanıcının dili: {lang_map.get(lang, 'Türkçe')}. Bu dilde yanıt ver."

        # Save user message
        user_msg = {
            "id": str(uuid.uuid4()),
            "session_id": request.session_id,
            "role": "user",
            "content": request.message,
            "timestamp": datetime.now(timezone.utc),
        }
        await db.chat_messages.insert_one(user_msg)

        # Build conversation context (last 10 messages)
        history = await db.chat_messages.find(
            {"session_id": request.session_id}
        ).sort("timestamp", 1).to_list(20)

        context_parts = []
        for msg in history[-10:]:
            role = "Kullanıcı" if msg["role"] == "user" else "Danışman"
            context_parts.append(f"{role}: {msg['content']}")
        context = "\n".join(context_parts)

        full_system = system_prompt + f"\n\nSohbet geçmişi (son 10 mesaj):\n{context}"

        # Check AI cache first
        cache_key = hashlib.md5(f"{request.message}:{madhab}:{level}".encode()).hexdigest()
        cached = await db.ai_cache.find_one({"cache_key": cache_key})
        if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 7:
            response_text = cached["response"]
        else:
            try:
                import asyncio
                response_text = await asyncio.wait_for(
                    gemini_generate(request.message, system_message=full_system),
                    timeout=30,
                )

                # Uncertainty check
                lower_resp = response_text.lower()
                has_uncertainty = any(p in lower_resp for p in UNCERTAINTY_PATTERNS)
                if has_uncertainty and "bir ilim ehline" not in lower_resp:
                    response_text += "\n\n⚠️ **Not:** Bu konuda farklı görüşler mevcuttur. Kesin bir hüküm için yetkili bir müftüye veya ilim ehline danışmanızı tavsiye ederim."

                # Cache the response
                await db.ai_cache.update_one(
                    {"cache_key": cache_key},
                    {"$set": {"cache_key": cache_key, "response": response_text, "created_at": datetime.now(timezone.utc)}},
                    upsert=True,
                )
            except Exception as e:
                logger.error(f"AI Mufti error: {e}")
                response_text = "Üzgünüm, şu anda yanıt veremedim. Lütfen tekrar deneyin."

        # Save AI response
        ai_msg = {
            "id": str(uuid.uuid4()),
            "session_id": request.session_id,
            "role": "assistant",
            "content": response_text,
            "timestamp": datetime.now(timezone.utc),
        }
        await db.chat_messages.insert_one(ai_msg)

        # Log AI usage
        await db.ai_usage.insert_one({
            "user_id": user_id,
            "date": date.today().isoformat(),
            "timestamp": datetime.now(timezone.utc),
        })

        return {"response": response_text, "session_id": request.session_id, "limit_reached": False}

    @api_router.get("/ai/usage/{user_id}")
    async def get_ai_usage(user_id: str):
        """Get user's AI usage for today"""
        today = date.today().isoformat()
        count = await db.ai_usage.count_documents({"user_id": user_id, "date": today})
        premium = await is_premium(user_id)
        limit = -1 if premium else PREMIUM_PLANS["free"]["features"]["ai_mufti_daily"]
        return {"used": count, "limit": limit, "premium": premium}

    # ===================== TAFSIR COMPARISON ENGINE =====================

    @api_router.get("/tafsir-compare/scholars")
    async def get_tafsir_compare_scholars():
        """Get tafsir comparison scholars list"""
        return TAFSIR_SCHOLARS

    @api_router.get("/tafsir-compare/{surah}/{verse}")
    async def get_tafsir_comparison(surah: int, verse: int, scholar_ids: str = Query(default="elmalili"), user_id: str = Query(default="")):
        """Get tafsir comparison for a verse from multiple scholars"""
        requested_ids = [s.strip() for s in scholar_ids.split(",")]
        premium = await is_premium(user_id) if user_id else False

        results = []
        for scholar in TAFSIR_SCHOLARS:
            if scholar["id"] not in requested_ids:
                continue
            # Premium gate: free users get only non-premium scholars
            if scholar["premium"] and not premium:
                results.append({
                    "scholar_id": scholar["id"],
                    "scholar_name": scholar["name"],
                    "era": scholar["era"],
                    "icon": scholar["icon"],
                    "locked": True,
                    "content": "Bu alimin tefsirini görmek için Premium'a geçin.",
                })
                continue

            # Check cache
            cache_key = f"tafsir_{scholar['id']}_{surah}_{verse}"
            cached = await db.tafsir_cache.find_one({"cache_key": cache_key})
            if cached:
                results.append({
                    "scholar_id": scholar["id"],
                    "scholar_name": scholar["name"],
                    "era": scholar["era"],
                    "icon": scholar["icon"],
                    "locked": False,
                    "content": cached["content"],
                })
                continue

            # Generate tafsir
            scholar_prompt = TAFSIR_SCHOLAR_PROMPTS.get(scholar["id"], "")
            prompt = f"""Kur'an-ı Kerim {surah}. sure {verse}. ayet hakkında tefsir yaz.

Ayet hakkında derinlemesine bir tefsir yaz. 3-5 paragraf olsun.
Ayetin bağlamını, nüzul sebebini ve günümüze mesajını açıkla.
Türkçe yaz."""

            try:
                import asyncio
                content = await asyncio.wait_for(
                    gemini_generate(prompt, system_message=scholar_prompt),
                    timeout=30,
                )
                await db.tafsir_cache.insert_one({
                    "cache_key": cache_key,
                    "scholar_id": scholar["id"],
                    "surah": surah,
                    "verse": verse,
                    "content": content,
                    "created_at": datetime.now(timezone.utc),
                })
                results.append({
                    "scholar_id": scholar["id"],
                    "scholar_name": scholar["name"],
                    "era": scholar["era"],
                    "icon": scholar["icon"],
                    "locked": False,
                    "content": content,
                })
            except Exception as e:
                logger.error(f"Tafsir generation error for {scholar['id']}: {e}")
                results.append({
                    "scholar_id": scholar["id"],
                    "scholar_name": scholar["name"],
                    "era": scholar["era"],
                    "icon": scholar["icon"],
                    "locked": False,
                    "content": "Tefsir yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
                })

        return {"surah": surah, "verse": verse, "tafsirs": results}

    # ===================== PREMIUM / SUBSCRIPTION =====================

    @api_router.get("/premium/plans")
    async def get_premium_plans():
        """Get available subscription plans"""
        return PREMIUM_PLANS

    @api_router.get("/premium/status/{user_id}")
    async def get_premium_status(user_id: str):
        """Check user's premium status"""
        sub = await db.subscriptions.find_one({"user_id": user_id, "status": "active"})
        if sub and sub.get("expires_at") and sub["expires_at"] < datetime.now(timezone.utc):
            await db.subscriptions.update_one({"_id": sub["_id"]}, {"$set": {"status": "expired"}})
            sub = None

        if not sub:
            return {"premium": False, "plan": "free", "features": PREMIUM_PLANS["free"]["features"]}

        return {
            "premium": True,
            "plan": "premium",
            "features": PREMIUM_PLANS["premium"]["features"],
            "expires_at": sub.get("expires_at"),
            "started_at": sub.get("created_at"),
        }

    @api_router.post("/premium/activate")
    async def activate_premium(data: dict):
        """Activate premium subscription (after payment verification)"""
        user_id = data.get("user_id")
        plan_type = data.get("plan_type", "monthly")  # monthly / yearly
        payment_id = data.get("payment_id", "")

        if not user_id:
            raise HTTPException(status_code=400, detail="user_id required")

        months = 12 if plan_type == "yearly" else 1
        expires_at = datetime.now(timezone.utc) + timedelta(days=30 * months)

        await db.subscriptions.update_one(
            {"user_id": user_id},
            {"$set": {
                "user_id": user_id,
                "status": "active",
                "plan_type": plan_type,
                "payment_id": payment_id,
                "started_at": datetime.now(timezone.utc),
                "expires_at": expires_at,
                "updated_at": datetime.now(timezone.utc),
            }},
            upsert=True,
        )

        return {"status": "active", "expires_at": expires_at}

    # ===================== GAMIFICATION v2 =====================

    @api_router.get("/gamification/v2/stats/{user_id}")
    async def get_enhanced_stats(user_id: str):
        """Enhanced gamification stats with daily quests, XP, badges"""
        stats = await db.user_stats.find_one({"user_id": user_id})
        if not stats:
            stats = {"user_id": user_id, "total_points": 0, "current_streak": 0, "longest_streak": 0, "level": 1, "badges": [], "quran_pages_read": 0, "hadith_read": 0, "pomodoro_minutes": 0}
            await db.user_stats.insert_one(stats)

        # Compute badges
        earned = _compute_enhanced_badges(stats)

        # Daily quests
        today = date.today().isoformat()
        quests = await db.daily_quests.find_one({"user_id": user_id, "date": today})
        if not quests:
            import random
            premium = await is_premium(user_id)
            quest_count = len(DAILY_QUESTS_POOL) if premium else min(2, len(DAILY_QUESTS_POOL))
            selected = random.sample(DAILY_QUESTS_POOL, quest_count)
            quests = {"user_id": user_id, "date": today, "quests": [{"id": q["id"], "title": q["title"], "xp": q["xp"], "target": q["target"], "progress": 0, "completed": False} for q in selected]}
            await db.daily_quests.insert_one(quests)

        # Weekly XP
        week_ago = (date.today() - timedelta(days=7)).isoformat()
        weekly_logs = await db.activity_logs.find({"user_id": user_id, "created_at": {"$gte": datetime.fromisoformat(week_ago)}}).to_list(1000)
        weekly_xp = sum(log.get("points_earned", 0) for log in weekly_logs)

        # Level progress
        total_pts = stats.get("total_points", 0)
        level = _calculate_level_v2(total_pts)
        next_level_pts = _level_threshold(level + 1)
        current_level_pts = _level_threshold(level)
        progress = (total_pts - current_level_pts) / max(1, next_level_pts - current_level_pts)

        return {
            "user_id": user_id,
            "total_xp": total_pts,
            "level": level,
            "level_progress": round(progress, 2),
            "next_level_xp": next_level_pts,
            "current_streak": stats.get("current_streak", 0),
            "longest_streak": stats.get("longest_streak", 0),
            "weekly_xp": weekly_xp,
            "badges": earned,
            "daily_quests": quests.get("quests", []),
            "premium": await is_premium(user_id),
        }

    @api_router.post("/gamification/v2/quest-progress")
    async def update_quest_progress(data: DailyQuestProgress):
        """Update daily quest progress"""
        today = date.today().isoformat()
        quests_doc = await db.daily_quests.find_one({"user_id": data.user_id, "date": today})
        if not quests_doc:
            return {"error": "No quests found for today"}

        quests = quests_doc.get("quests", [])
        xp_earned = 0
        for q in quests:
            if q["id"] == data.quest_id and not q["completed"]:
                q["progress"] = q.get("progress", 0) + 1
                if q["progress"] >= q["target"]:
                    q["completed"] = True
                    xp_earned = q["xp"]

        await db.daily_quests.update_one(
            {"user_id": data.user_id, "date": today},
            {"$set": {"quests": quests}},
        )

        # Award XP
        if xp_earned > 0:
            await db.user_stats.update_one(
                {"user_id": data.user_id},
                {"$inc": {"total_points": xp_earned}},
            )

        return {"quest_id": data.quest_id, "xp_earned": xp_earned, "quests": quests}

    @api_router.get("/gamification/v2/badges")
    async def get_all_enhanced_badges():
        """Get all available badges with details"""
        return ENHANCED_BADGES

    # ===================== SMART NOTIFICATIONS =====================

    @api_router.post("/notifications/smart")
    async def get_smart_notifications(request: SmartNotificationRequest):
        """AI-driven smart notifications based on user behavior"""
        user_id = request.user_id
        stats = await db.user_stats.find_one({"user_id": user_id})
        user = await db.users.find_one({"user_id": user_id})
        name = (user or {}).get("name", "Kardeşim")

        if not stats:
            return {"notifications": []}

        notifications = []
        last_activity = stats.get("last_activity_date", "")
        streak = stats.get("current_streak", 0)
        points = stats.get("total_points", 0)
        level = _calculate_level_v2(points)

        # Days since last activity
        days_inactive = 0
        if last_activity:
            try:
                last_date = date.fromisoformat(last_activity)
                days_inactive = (date.today() - last_date).days
            except ValueError:
                pass

        # Reengagement notifications
        for tpl in NOTIFICATION_TEMPLATES["reengagement"]:
            if days_inactive >= tpl["days_threshold"]:
                notifications.append({
                    "type": "reengagement",
                    "title": tpl["title"].replace("{name}", name),
                    "body": tpl["body"].replace("{days}", str(days_inactive)).replace("{name}", name),
                    "priority": "high" if days_inactive >= 7 else "medium",
                })
                break

        # Streak protection
        if days_inactive == 0 and streak >= 3:
            tpl = NOTIFICATION_TEMPLATES["streak_protect"][0]
            notifications.append({
                "type": "streak_protect",
                "title": tpl["title"],
                "body": tpl["body"].replace("{streak}", str(streak)),
                "priority": "high",
            })

        # Motivation
        if days_inactive == 0 and streak > 0:
            tpl = NOTIFICATION_TEMPLATES["motivation"][0]
            notifications.append({
                "type": "motivation",
                "title": tpl["title"],
                "body": tpl["body"].replace("{streak}", str(streak)),
                "priority": "low",
            })

        return {"notifications": notifications}

    # ===================== SOCIAL / REFERRAL =====================

    @api_router.post("/social/referral/create")
    async def create_referral_code(data: ReferralCreate):
        """Create a referral code for user"""
        existing = await db.referrals.find_one({"referrer_id": data.referrer_id})
        if existing:
            return {"code": existing["code"], "uses": existing.get("uses", 0)}

        code = f"ISLAM{data.referrer_id[:6].upper()}{uuid.uuid4().hex[:4].upper()}"
        await db.referrals.insert_one({
            "referrer_id": data.referrer_id,
            "code": code,
            "uses": 0,
            "created_at": datetime.now(timezone.utc),
        })
        return {"code": code, "uses": 0}

    @api_router.post("/social/referral/redeem")
    async def redeem_referral(data: ReferralRedeem):
        """Redeem a referral code"""
        referral = await db.referrals.find_one({"code": data.referral_code})
        if not referral:
            raise HTTPException(status_code=404, detail="Geçersiz referans kodu")
        if referral["referrer_id"] == data.user_id:
            raise HTTPException(status_code=400, detail="Kendi kodunuzu kullanamazsınız")

        # Check if already redeemed
        already = await db.referral_uses.find_one({"user_id": data.user_id})
        if already:
            raise HTTPException(status_code=400, detail="Zaten bir referans kodu kullandınız")

        # Award both users
        bonus_xp = 100
        await db.user_stats.update_one({"user_id": data.user_id}, {"$inc": {"total_points": bonus_xp}}, upsert=True)
        await db.user_stats.update_one({"user_id": referral["referrer_id"]}, {"$inc": {"total_points": bonus_xp}}, upsert=True)
        await db.referrals.update_one({"code": data.referral_code}, {"$inc": {"uses": 1}})
        await db.referral_uses.insert_one({"user_id": data.user_id, "code": data.referral_code, "created_at": datetime.now(timezone.utc)})

        return {"bonus_xp": bonus_xp, "message": f"Hem siz hem davet eden kişi {bonus_xp} XP kazandı!"}

    @api_router.get("/social/referral/{user_id}")
    async def get_referral_info(user_id: str):
        """Get referral info for user"""
        referral = await db.referrals.find_one({"referrer_id": user_id})
        if not referral:
            return {"code": None, "uses": 0}
        return {"code": referral["code"], "uses": referral.get("uses", 0)}

    @api_router.post("/social/share")
    async def share_achievement(data: ShareAchievement):
        """Log achievement share"""
        await db.shares.insert_one({
            "user_id": data.user_id,
            "achievement_type": data.achievement_type,
            "achievement_id": data.achievement_id,
            "created_at": datetime.now(timezone.utc),
        })
        # Award share XP
        await db.user_stats.update_one({"user_id": data.user_id}, {"$inc": {"total_points": 5}}, upsert=True)
        return {"xp_earned": 5}

    # ===================== ANALYTICS =====================

    @api_router.post("/analytics/event")
    async def log_analytics_event(event: AnalyticsEvent):
        """Log a custom analytics event"""
        await db.analytics_events.insert_one({
            "user_id": event.user_id,
            "event_name": event.event_name,
            "event_data": event.event_data,
            "created_at": datetime.now(timezone.utc),
        })
        return {"status": "ok"}

    @api_router.get("/analytics/summary")
    async def get_analytics_summary():
        """Get analytics summary (admin)"""
        today = date.today().isoformat()
        week_ago = (date.today() - timedelta(days=7)).isoformat()

        dau = await db.analytics_events.distinct("user_id", {"created_at": {"$gte": datetime.fromisoformat(today)}})
        wau = await db.analytics_events.distinct("user_id", {"created_at": {"$gte": datetime.fromisoformat(week_ago)}})
        total_users = await db.users.count_documents({})
        premium_count = await db.subscriptions.count_documents({"status": "active"})

        # Top modules
        pipeline = [
            {"$match": {"created_at": {"$gte": datetime.fromisoformat(week_ago)}}},
            {"$group": {"_id": "$event_name", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10},
        ]
        top_events = await db.analytics_events.aggregate(pipeline).to_list(10)

        return {
            "dau": len(dau),
            "wau": len(wau),
            "total_users": total_users,
            "premium_users": premium_count,
            "top_events": [{"event": e["_id"], "count": e["count"]} for e in top_events],
        }

    # ===================== i18n EXTENDED =====================

    PHASE2_TRANSLATIONS = {
        "tr": {
            "premium": "Premium",
            "premium_desc": "Sınırsız AI, Tefsir Karşılaştırma, Reklamsız",
            "upgrade": "Premium'a Geç",
            "daily_quests": "Günlük Görevler",
            "achievements": "Başarılar",
            "badges": "Rozetler",
            "streak": "Seri",
            "level": "Seviye",
            "xp": "XP",
            "referral": "Arkadaş Davet",
            "referral_desc": "Arkadaşlarını davet et, birlikte XP kazan",
            "share": "Paylaş",
            "copy_code": "Kodu Kopyala",
            "weekly_progress": "Haftalık İlerleme",
            "locked": "Kilitli",
            "unlock_premium": "Premium ile Aç",
            "free_limit": "Günlük ücretsiz limit",
            "mufti_title": "AI Müftü",
            "mufti_desc": "Gelişmiş İslami danışman",
            "tafsir_compare": "Tefsir Karşılaştır",
            "tafsir_compare_desc": "5 alimin yorumunu karşılaştır",
            "notification_settings": "Bildirim Ayarları",
            "streak_protect_alert": "Serini kaybetme!",
        },
        "en": {
            "premium": "Premium",
            "premium_desc": "Unlimited AI, Tafsir Comparison, Ad-free",
            "upgrade": "Upgrade to Premium",
            "daily_quests": "Daily Quests",
            "achievements": "Achievements",
            "badges": "Badges",
            "streak": "Streak",
            "level": "Level",
            "xp": "XP",
            "referral": "Invite Friends",
            "referral_desc": "Invite friends, earn XP together",
            "share": "Share",
            "copy_code": "Copy Code",
            "weekly_progress": "Weekly Progress",
            "locked": "Locked",
            "unlock_premium": "Unlock with Premium",
            "free_limit": "Daily free limit",
            "mufti_title": "AI Mufti",
            "mufti_desc": "Advanced Islamic advisor",
            "tafsir_compare": "Tafsir Compare",
            "tafsir_compare_desc": "Compare 5 scholars' interpretations",
            "notification_settings": "Notification Settings",
            "streak_protect_alert": "Don't lose your streak!",
        },
        "ar": {
            "premium": "بريميوم",
            "premium_desc": "ذكاء اصطناعي بلا حدود، مقارنة التفسير، بدون إعلانات",
            "upgrade": "الترقية إلى بريميوم",
            "daily_quests": "المهام اليومية",
            "achievements": "الإنجازات",
            "badges": "الشارات",
            "streak": "السلسلة",
            "level": "المستوى",
            "xp": "نقاط الخبرة",
            "referral": "دعوة الأصدقاء",
            "referral_desc": "ادعُ أصدقاءك واكسبوا نقاطاً معاً",
            "share": "مشاركة",
            "copy_code": "نسخ الرمز",
            "weekly_progress": "التقدم الأسبوعي",
            "locked": "مقفل",
            "unlock_premium": "فتح مع بريميوم",
            "free_limit": "الحد المجاني اليومي",
            "mufti_title": "المفتي الذكي",
            "mufti_desc": "مستشار إسلامي متقدم",
            "tafsir_compare": "مقارنة التفسير",
            "tafsir_compare_desc": "قارن تفسيرات ٥ علماء",
            "notification_settings": "إعدادات الإشعارات",
            "streak_protect_alert": "لا تفقد سلسلتك!",
        },
    }

    @api_router.get("/i18n/v2/{lang}")
    async def get_phase2_translations(lang: str):
        """Get Phase 2 translations"""
        return PHASE2_TRANSLATIONS.get(lang, PHASE2_TRANSLATIONS["tr"])


# ===================== GAMIFICATION v2 HELPERS =====================

def _calculate_level_v2(points: int) -> int:
    """Calculate level based on XP (exponential curve)"""
    level = 1
    while _level_threshold(level + 1) <= points:
        level += 1
    return min(level, 50)

def _level_threshold(level: int) -> int:
    """XP required for a given level"""
    if level <= 1:
        return 0
    return int(50 * (level - 1) ** 1.8)

def _compute_enhanced_badges(stats: dict) -> List[dict]:
    """Compute which enhanced badges user has earned"""
    earned = []
    pts = stats.get("total_points", 0)
    streak = stats.get("current_streak", 0)
    longest = stats.get("longest_streak", 0)
    quran = stats.get("quran_pages_read", 0)
    hadith = stats.get("hadith_read", 0)

    badge_conditions = {
        "first_step": pts > 0,
        "quran_starter": quran >= 1,
        "quran_50": quran >= 50,
        "hadith_learner": hadith >= 10,
        "streak_3": max(streak, longest) >= 3,
        "streak_7": max(streak, longest) >= 7,
        "streak_30": max(streak, longest) >= 30,
        "streak_100": max(streak, longest) >= 100,
        "quiz_master": stats.get("quizzes_completed", 0) >= 50,
        "ai_explorer": stats.get("ai_questions", 0) >= 50,
        "level_5": _calculate_level_v2(pts) >= 5,
        "level_10": _calculate_level_v2(pts) >= 10,
    }

    for badge in ENHANCED_BADGES:
        b = dict(badge)
        b["earned"] = badge_conditions.get(badge["id"], False)
        earned.append(b)

    return earned
