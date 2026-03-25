"""
Phase 3: Comparative Religions Module - 50 Topics
- AI-generated deep comparison (Islam, Christianity, Judaism)
- Cached per topic+language
- Each topic: 3 religions with source references
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timezone
import hashlib
import logging

logger = logging.getLogger(__name__)

# ===================== 50 TOPICS =====================

COMPARATIVE_TOPICS_50 = [
    {"id": "god_concept", "name": "Tanrı Anlayışı", "name_en": "Concept of God", "name_ar": "مفهوم الله", "icon": "☝️", "category": "inanc"},
    {"id": "prophethood", "name": "Peygamberlik", "name_en": "Prophethood", "name_ar": "النبوة", "icon": "📜", "category": "inanc"},
    {"id": "afterlife", "name": "Ahiret", "name_en": "Afterlife", "name_ar": "الآخرة", "icon": "✨", "category": "inanc"},
    {"id": "sin", "name": "Günah", "name_en": "Sin", "name_ar": "الذنب", "icon": "⚠️", "category": "ahlak"},
    {"id": "worship", "name": "İbadet", "name_en": "Worship", "name_ar": "العبادة", "icon": "🤲", "category": "ibadet"},
    {"id": "fasting", "name": "Oruç", "name_en": "Fasting", "name_ar": "الصوم", "icon": "🌙", "category": "ibadet"},
    {"id": "prayer_dua", "name": "Namaz / Dua", "name_en": "Prayer", "name_ar": "الصلاة", "icon": "🕌", "category": "ibadet"},
    {"id": "destiny", "name": "Kader", "name_en": "Divine Decree", "name_ar": "القدر", "icon": "🔮", "category": "inanc"},
    {"id": "heaven_hell", "name": "Cennet / Cehennem", "name_en": "Heaven / Hell", "name_ar": "الجنة والنار", "icon": "🌅", "category": "inanc"},
    {"id": "angels", "name": "Melekler", "name_en": "Angels", "name_ar": "الملائكة", "icon": "👼", "category": "inanc"},
    {"id": "holy_books", "name": "Kutsal Kitaplar", "name_en": "Holy Books", "name_ar": "الكتب المقدسة", "icon": "📖", "category": "inanc"},
    {"id": "morality", "name": "Ahlak Sistemi", "name_en": "Moral System", "name_ar": "النظام الأخلاقي", "icon": "⚖️", "category": "ahlak"},
    {"id": "social_order", "name": "Toplum Düzeni", "name_en": "Social Order", "name_ar": "النظام الاجتماعي", "icon": "🏛️", "category": "toplum"},
    {"id": "women_role", "name": "Kadın Rolü", "name_en": "Role of Women", "name_ar": "دور المرأة", "icon": "👩", "category": "toplum"},
    {"id": "halal_haram", "name": "Helal / Haram", "name_en": "Permissible / Forbidden", "name_ar": "الحلال والحرام", "icon": "🔒", "category": "ahlak"},
    {"id": "justice", "name": "Adalet", "name_en": "Justice", "name_ar": "العدالة", "icon": "⚖️", "category": "ahlak"},
    {"id": "forgiveness", "name": "Affetme", "name_en": "Forgiveness", "name_ar": "المغفرة", "icon": "💚", "category": "ahlak"},
    {"id": "life_after_death", "name": "Ölüm Sonrası Hayat", "name_en": "Life After Death", "name_ar": "الحياة بعد الموت", "icon": "🌌", "category": "inanc"},
    {"id": "soul", "name": "Ruh Kavramı", "name_en": "The Soul", "name_ar": "الروح", "icon": "💫", "category": "inanc"},
    {"id": "satan", "name": "Şeytan Anlayışı", "name_en": "Concept of Satan", "name_ar": "مفهوم الشيطان", "icon": "🔥", "category": "inanc"},
    {"id": "salvation", "name": "Kurtuluş", "name_en": "Salvation", "name_ar": "الخلاص", "icon": "🕊️", "category": "inanc"},
    {"id": "faith", "name": "İman", "name_en": "Faith", "name_ar": "الإيمان", "icon": "💎", "category": "inanc"},
    {"id": "zakat", "name": "Zekat", "name_en": "Obligatory Charity", "name_ar": "الزكاة", "icon": "💰", "category": "ibadet"},
    {"id": "charity", "name": "Sadaka", "name_en": "Voluntary Charity", "name_ar": "الصدقة", "icon": "🤝", "category": "ahlak"},
    {"id": "universal_ethics", "name": "Evrensel Etik", "name_en": "Universal Ethics", "name_ar": "الأخلاق العالمية", "icon": "🌍", "category": "ahlak"},
    {"id": "family", "name": "Aile Yapısı", "name_en": "Family Structure", "name_ar": "بنية الأسرة", "icon": "👨‍👩‍👧‍👦", "category": "toplum"},
    {"id": "marriage", "name": "Evlilik", "name_en": "Marriage", "name_ar": "الزواج", "icon": "💍", "category": "toplum"},
    {"id": "divorce", "name": "Boşanma", "name_en": "Divorce", "name_ar": "الطلاق", "icon": "💔", "category": "toplum"},
    {"id": "education", "name": "Eğitim", "name_en": "Education", "name_ar": "التعليم", "icon": "📚", "category": "toplum"},
    {"id": "science", "name": "Bilim İlişkisi", "name_en": "Religion & Science", "name_ar": "العلم والدين", "icon": "🔬", "category": "toplum"},
    {"id": "worldview", "name": "Dünya Görüşü", "name_en": "Worldview", "name_ar": "النظرة للعالم", "icon": "🌐", "category": "inanc"},
    {"id": "confession", "name": "Günah Çıkarma", "name_en": "Confession", "name_ar": "الاعتراف", "icon": "🙏", "category": "ibadet"},
    {"id": "purification", "name": "Arınma", "name_en": "Purification", "name_ar": "التطهير", "icon": "💧", "category": "ibadet"},
    {"id": "holy_days", "name": "Kutsal Günler", "name_en": "Holy Days", "name_ar": "الأيام المقدسة", "icon": "📅", "category": "ibadet"},
    {"id": "festivals", "name": "Bayramlar", "name_en": "Festivals", "name_ar": "الأعياد", "icon": "🎊", "category": "ibadet"},
    {"id": "worship_places", "name": "İbadet Yerleri", "name_en": "Places of Worship", "name_ar": "أماكن العبادة", "icon": "🕌", "category": "ibadet"},
    {"id": "leadership", "name": "Liderlik", "name_en": "Leadership", "name_ar": "القيادة", "icon": "👑", "category": "toplum"},
    {"id": "monasticism", "name": "Ruhbanlık", "name_en": "Monasticism", "name_ar": "الرهبانية", "icon": "⛪", "category": "toplum"},
    {"id": "social_responsibility", "name": "Toplumsal Sorumluluk", "name_en": "Social Responsibility", "name_ar": "المسؤولية الاجتماعية", "icon": "🤲", "category": "toplum"},
    {"id": "patience", "name": "Sabır", "name_en": "Patience", "name_ar": "الصبر", "icon": "🕊️", "category": "ahlak"},
    {"id": "gratitude", "name": "Şükür", "name_en": "Gratitude", "name_ar": "الشكر", "icon": "🙌", "category": "ahlak"},
    {"id": "tawakkul", "name": "Tevekkül", "name_en": "Trust in God", "name_ar": "التوكل", "icon": "🤲", "category": "inanc"},
    {"id": "trial", "name": "İmtihan", "name_en": "Divine Trial", "name_ar": "الابتلاء", "icon": "⚡", "category": "inanc"},
    {"id": "apocalypse", "name": "Kıyamet", "name_en": "Apocalypse", "name_ar": "القيامة", "icon": "🌋", "category": "inanc"},
    {"id": "resurrection", "name": "Diriliş", "name_en": "Resurrection", "name_ar": "البعث", "icon": "🌱", "category": "inanc"},
    {"id": "divine_justice", "name": "İlahi Adalet", "name_en": "Divine Justice", "name_ar": "العدالة الإلهية", "icon": "⚖️", "category": "inanc"},
    {"id": "reward", "name": "Sevap", "name_en": "Good Deeds Reward", "name_ar": "الثواب", "icon": "⭐", "category": "ahlak"},
    {"id": "intention", "name": "Niyet", "name_en": "Intention", "name_ar": "النية", "icon": "💭", "category": "ahlak"},
    {"id": "wisdom", "name": "Hikmet", "name_en": "Wisdom", "name_ar": "الحكمة", "icon": "🦉", "category": "ahlak"},
    {"id": "creation", "name": "Yaratılış", "name_en": "Creation", "name_ar": "الخلق", "icon": "🌍", "category": "inanc"},
]

TOPIC_CATEGORIES = [
    {"id": "inanc", "name": "İnanç Esasları", "name_en": "Beliefs", "name_ar": "العقائد", "icon": "💎"},
    {"id": "ibadet", "name": "İbadet", "name_en": "Worship", "name_ar": "العبادات", "icon": "🤲"},
    {"id": "ahlak", "name": "Ahlak & Değerler", "name_en": "Ethics & Values", "name_ar": "الأخلاق والقيم", "icon": "⚖️"},
    {"id": "toplum", "name": "Toplum & Yaşam", "name_en": "Society & Life", "name_ar": "المجتمع والحياة", "icon": "🏛️"},
]


def setup_phase3_comparative_routes(router: APIRouter, db, gemini_generate):
    """Register enhanced comparative religions routes with 50 topics"""

    @router.get("/comparative/v2/topics")
    async def get_topics_v2(category: Optional[str] = None):
        if category:
            return [t for t in COMPARATIVE_TOPICS_50 if t.get("category") == category]
        return COMPARATIVE_TOPICS_50

    @router.get("/comparative/v2/categories")
    async def get_topic_categories():
        return TOPIC_CATEGORIES

    @router.get("/comparative/v2/topic/{topic_id}")
    async def get_topic_comparison(topic_id: str, lang: str = "tr"):
        """Get detailed 3-religion comparison for a topic"""
        topic = next((t for t in COMPARATIVE_TOPICS_50 if t["id"] == topic_id), None)
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")

        cache_key = hashlib.md5(f"comp_v2:{topic_id}:{lang}".encode()).hexdigest()
        cached = await db.comparative_v2_cache.find_one({"key": cache_key})
        if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 30:
            return cached["data"]

        lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}
        lang_name = lang_map.get(lang, "Türkçe")

        topic_name = topic.get(f"name_{lang}", topic["name"]) if lang != "tr" else topic["name"]

        prompt = f""""{topic_name}" konusunu İslam, Hristiyanlık ve Yahudilik açısından karşılaştır.

Her din için şunları belirt:
1. **Temel Görüş**: Bu konudaki ana yaklaşım (3-5 cümle)
2. **Kaynak**: İlgili kutsal kitap referansı (ayet/pasaj numarası ile)
3. **Orijinal Metin**: Kutsal kitaptan kısa bir alıntı (orijinal dilde: Arapça/İbranice/Latince)
4. **Çeviri**: Alıntının {lang_name} çevirisi
5. **Detay**: Mezhepsel/meşrepsel farklılıklar (varsa)

Sonunda:
- **Ortak Noktalar**: 3 din arasındaki benzerlikler
- **Temel Farklar**: Önemli ayrılık noktaları

Tüm cevabı {lang_name} dilinde ver. Akademik ama anlaşılır bir dil kullan."""

        system = """Sen karşılaştırmalı dinler konusunda dünya çapında tanınan bir akademisyensin. 
İslam, Hristiyanlık ve Yahudilik'in kutsal metinlerine, teolojisine ve tarihine derinlemesine hakimsin.
Tüm dinlere saygılı ve objektif yaklaş. Kaynakları doğru referansla."""

        try:
            response = await gemini_generate(prompt, system)

            result = {
                "topic": topic,
                "comparison": response,
                "language": lang,
                "religions": ["islam", "christianity", "judaism"],
            }

            await db.comparative_v2_cache.update_one(
                {"key": cache_key},
                {"$set": {"key": cache_key, "data": result, "created_at": datetime.now(timezone.utc)}},
                upsert=True
            )
            return result
        except Exception as e:
            logger.error(f"Comparative topic failed: {e}")
            raise HTTPException(status_code=500, detail="Karşılaştırma oluşturulamadı")

    @router.post("/comparative/v2/ai-analyze")
    async def ai_deep_analysis(topic_id: str = Query(...), lang: str = "tr"):
        """AI deep analysis with sub-topics and scholarly references"""
        topic = next((t for t in COMPARATIVE_TOPICS_50 if t["id"] == topic_id), None)
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")

        cache_key = hashlib.md5(f"comp_deep:{topic_id}:{lang}".encode()).hexdigest()
        cached = await db.comparative_deep_cache.find_one({"key": cache_key})
        if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 14:
            return cached["data"]

        lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}

        prompt = f""""{topic['name']}" konusunu derinlemesine analiz et.

1. Tarihsel gelişim süreci (kronolojik)
2. Her dindeki mezhep/ekol farklılıkları
3. Modern dönemde bu konuya yaklaşımlar
4. Akademik literatürdeki güncel tartışmalar
5. Pratik hayata yansımaları

{lang_map.get(lang, 'Türkçe')} dilinde kapsamlı analiz ver."""

        try:
            response = await gemini_generate(prompt, "Sen bir karşılaştırmalı dinler profesörüsün. Akademik ve dengeli analiz yap.")
            result = {"topic": topic, "deep_analysis": response, "language": lang}

            await db.comparative_deep_cache.update_one(
                {"key": cache_key},
                {"$set": {"key": cache_key, "data": result, "created_at": datetime.now(timezone.utc)}},
                upsert=True
            )
            return result
        except Exception as e:
            logger.error(f"Deep analysis failed: {e}")
            raise HTTPException(status_code=500, detail="Analiz oluşturulamadı")

    @router.get("/comparative/v2/search")
    async def search_topics_v2(q: str = Query(..., min_length=2), lang: str = "tr"):
        """Search across all 50 topics"""
        query_lower = q.lower()
        results = []
        for topic in COMPARATIVE_TOPICS_50:
            searchable = f"{topic['name']} {topic['name_en']} {topic.get('name_ar', '')}".lower()
            if query_lower in searchable:
                results.append(topic)
        return {"results": results, "query": q}
