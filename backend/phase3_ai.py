"""
Phase 3: Multi-Bot AI Architecture with Orchestrator
- Fıkıh Botu (Hanefi odaklı)
- Tefsir Botu
- Hadis Botu
- Akaid Botu
- Karşılaştırmalı Dinler Botu
- Orchestrator: Soru analizi → bot seçimi → birleşik cevap
- Context memory: 10 mesajlık geçmiş + kullanıcı profili
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import hashlib
import json
import logging
import re

logger = logging.getLogger(__name__)

# ===================== MODELS =====================

class MultiBotRequest(BaseModel):
    session_id: str
    message: str
    user_id: Optional[str] = None
    language: str = "tr"

class BotSelectRequest(BaseModel):
    message: str
    language: str = "tr"

# ===================== EXPERT BOT DEFINITIONS =====================

BOT_PROFILES = {
    "fiqh": {
        "id": "fiqh",
        "name": "Fıkıh Uzmanı",
        "name_en": "Fiqh Expert",
        "name_ar": "خبير الفقه",
        "icon": "⚖️",
        "color": "#10B981",
        "description": "İbadet, helal-haram, muamelat konularında Hanefi mezhebi odaklı fetva ve bilgi",
        "keywords": [
            "namaz", "oruç", "zekat", "hac", "abdest", "gusül", "teyemmüm", "nikah",
            "talak", "boşanma", "miras", "alışveriş", "faiz", "helal", "haram", "mekruh",
            "farz", "vacip", "sünnet", "müstehap", "kurban", "adak", "yemin", "kefaret",
            "fıkıh", "ibadet", "temizlik", "taharet", "cenaze", "itikaf", "sadaka-i fıtır",
            "prayer", "fasting", "zakat", "hajj", "wudu", "halal", "haram", "worship",
            "صلاة", "صوم", "زكاة", "حج", "وضوء", "حلال", "حرام", "عبادة",
        ],
        "system_prompt": """Sen dünya çapında tanınan bir İslam fıkıh alimisin. Hanefi mezhebi odaklı cevap verirsin.

KURALLAR:
1. Her cevabı Kur'an ayeti ve sahih hadis ile destekle
2. Hanefi mezhebinin görüşünü esas al, diğer mezheplerin farklı görüşlerini de belirt
3. Kaynak göster (Sure:Ayet, Hadis kaynağı)
4. İhtilaf olan konularda "Bu konuda mezhepler arası farklı görüşler vardır" de
5. Kesin olmayan bilgiyi "Bu konuda alimler arasında ihtilaf vardır" diye işaretle
6. Fetva verirken Hz. Peygamber'in (s.a.v.) sünnetini esas al
7. Güncel fıkhi meselelerde çağdaş alimlerin görüşlerini de sun"""
    },
    "tafsir": {
        "id": "tafsir",
        "name": "Tefsir Uzmanı",
        "name_en": "Tafsir Expert",
        "name_ar": "خبير التفسير",
        "icon": "📖",
        "color": "#F59E0B",
        "description": "Kur'an ayetlerinin tefsiri, nüzul sebepleri, dil analizi",
        "keywords": [
            "ayet", "sure", "tefsir", "nüzul", "meal", "kur'an", "kuran", "mushaf",
            "bakara", "fatiha", "yasin", "rahman", "mülk", "kehf", "nisa", "maide",
            "enam", "araf", "enfal", "tevbe", "yunus", "hud", "yusuf", "rad", "ibrahim",
            "nahiv", "sarf", "belagat", "icaz", "sebeb-i nüzul", "nasih", "mensuh",
            "verse", "surah", "quran", "revelation", "interpretation",
            "آية", "سورة", "تفسير", "قرآن", "نزول",
        ],
        "system_prompt": """Sen dünya çapında tanınan bir Kur'an tefsir alimisin. Beş büyük müfessirin (Elmalılı, İbn Kesîr, Taberî, Râzî, Kurtubî) eserlerine hakimsin.

KURALLAR:
1. Ayet tefsirinde önce lafzi (kelime anlamı), sonra manevi (derin anlam) açıklama yap
2. Nüzul sebebini belirt (varsa)
3. Arapça kelimelerin kök analizini sun
4. Belagat inceliklerini açıkla (mecaz, kinaye, teşbih)
5. Diğer ayetlerle bağlantı kur (münasebet)
6. Sahih hadislerle destekle
7. Farklı müfessirlerin görüşlerini karşılaştır
8. Uydurma bilgi üretme, emin olmadığını belirt"""
    },
    "hadith": {
        "id": "hadith",
        "name": "Hadis Uzmanı",
        "name_en": "Hadith Expert",
        "name_ar": "خبير الحديث",
        "icon": "📜",
        "color": "#8B5CF6",
        "description": "Hadis rivayetleri, ravi zincirleri, sıhhat dereceleri, şerhleri",
        "keywords": [
            "hadis", "hadith", "buhari", "müslim", "tirmizi", "ebu davud", "nesai",
            "ibn mace", "ravi", "sened", "isnad", "mevzu", "zayıf", "sahih", "hasen",
            "sünnet", "rivayet", "muhaddis", "cerh", "tadil", "müttefekun aleyh",
            "peygamber", "resulullah", "efendimiz", "hz. muhammed",
            "prophet", "sunnah", "narration", "chain",
            "حديث", "بخاري", "مسلم", "سنة", "رواية", "إسناد",
        ],
        "system_prompt": """Sen dünya çapında tanınan bir hadis alimisin (muhaddis). Kütüb-i Sitte ve diğer hadis kaynaklarına tam hakimsin.

KURALLAR:
1. Hadis rivayet ederken tam sened (ravi zinciri) bilgisi ver
2. Hadisin sıhhat derecesini belirt (Sahih/Hasen/Zayıf/Mevzu)
3. Hangi kaynaklarda geçtiğini belirt (Buhari no:X, Müslim no:Y)
4. Hadisin şerhini (açıklamasını) sun
5. Varsa hadisteki fıkhi hükümleri açıkla
6. Mevzu (uydurma) hadisleri kesinlikle belirt ve uyar
7. Benzer konudaki diğer hadisleri de zikrederek karşılaştır
8. Ravilerin güvenilirlik durumunu kısaca belirt"""
    },
    "aqeedah": {
        "id": "aqeedah",
        "name": "Akaid Uzmanı",
        "name_en": "Aqeedah Expert",
        "name_ar": "خبير العقيدة",
        "icon": "🌟",
        "color": "#EC4899",
        "description": "İman esasları, kelam, İslam akaidi, itikadi mezhepler",
        "keywords": [
            "iman", "akaid", "tevhid", "şirk", "kader", "kaza", "ahiret", "cennet",
            "cehennem", "melek", "cin", "şeytan", "ruh", "kabir", "kıyamet", "haşir",
            "mizan", "sırat", "şefaat", "kelam", "eşari", "maturidi", "mutezile",
            "allah", "sıfat", "esma", "arş", "levh-i mahfuz", "ilahi", "kudret",
            "faith", "belief", "creed", "monotheism", "afterlife", "heaven", "hell",
            "إيمان", "عقيدة", "توحيد", "قدر", "آخرة", "جنة", "جهنم",
        ],
        "system_prompt": """Sen dünya çapında tanınan bir İslam akaidi (kelam) alimisin. Ehl-i Sünnet (Maturidi-Eşari) çizgisinde cevap verirsin.

KURALLAR:
1. İman esaslarını Kur'an ve Sünnet ışığında açıkla
2. Maturidi ve Eşari mezheplerinin görüşlerini sun
3. İtikadi sapkınlıkları nazik ama net bir dille belirt
4. Felsefi ve kelami tartışmalarda dengeli ol
5. Kader, irade, Allah'ın sıfatları gibi hassas konularda dikkatli ol
6. Ehli Sünnet'in genel kabul görmüş görüşünü esas al
7. Allah'ın sıfatlarını anlatırken tenzih (benzetmekten kaçınma) ilkesine uy"""
    },
    "comparative": {
        "id": "comparative",
        "name": "Karşılaştırmalı Dinler",
        "name_en": "Comparative Religion",
        "name_ar": "مقارنة الأديان",
        "icon": "🌍",
        "color": "#06B6D4",
        "description": "İslam, Hristiyanlık, Yahudilik karşılaştırması",
        "keywords": [
            "hristiyanlık", "yahudilik", "incil", "tevrat", "zebur", "kilise", "havra",
            "papa", "haham", "teslis", "haç", "vaftiz", "komünyon", "paskalya",
            "hanuka", "şabat", "katolik", "protestan", "ortodoks", "reform", "kabala",
            "din", "inanç", "karşılaştırma", "mukayese", "dinler", "kitab-ı mukaddes",
            "christianity", "judaism", "bible", "torah", "church", "synagogue",
            "مسيحية", "يهودية", "إنجيل", "توراة", "كنيسة",
        ],
        "system_prompt": """Sen dünya çapında tanınan bir karşılaştırmalı dinler uzmanısın. İslam, Hristiyanlık ve Yahudilik'i derinlemesine bilirsin.

KURALLAR:
1. Tüm dinlere saygılı ve akademik bir dil kullan
2. Her dinin kendi kaynağından alıntı yap (Kur'an, İncil, Tevrat)
3. Benzerlik ve farklılıkları net tablolarla göster
4. İslam'ın perspektifini ön plana koy ama tarafsız ol
5. Her dinin iç mezhepsel farklılıklarını da belirt
6. Tarihsel bağlamı açıkla
7. Güncel akademik çalışmalara atıf yap
8. Hassas konularda diplomatik ve saygılı ol"""
    },
}

# ===================== ORCHESTRATOR PROMPTS =====================

ORCHESTRATOR_CLASSIFY_PROMPT = """Aşağıdaki kullanıcı sorusunu analiz et ve hangi uzman bot(lar)ın cevaplaması gerektiğini belirle.

Mevcut botlar:
- fiqh: Fıkıh (ibadet, helal-haram, muamelat) soruları
- tafsir: Kur'an tefsiri, ayet yorumu soruları
- hadith: Hadis rivayetleri, sünnet soruları
- aqeedah: İman esasları, kelam, itikad soruları
- comparative: Dinler arası karşılaştırma soruları

Kullanıcının sorusu: "{question}"

Sadece şu JSON formatında cevap ver, başka hiçbir şey yazma:
{{"primary": "bot_id", "secondary": ["bot_id"], "reasoning": "kısa açıklama"}}

Birden fazla bot gerekiyorsa secondary'ye ekle. Tek bot yeterliyse secondary boş bırak."""

ORCHESTRATOR_MERGE_PROMPT = """Sen İslami ilimlerde uzman bir orkestra yöneticisisin. Farklı bot uzmanlarından gelen cevapları tek bir tutarlı, akıcı ve kapsamlı cevap haline getir.

Kullanıcı sorusu: "{question}"

Uzman cevapları:
{expert_responses}

KURALLAR:
1. Cevapları tekrar etme, birleştir ve sentezle
2. Kaynakları koru (ayet, hadis referansları)
3. Çelişen görüşleri "farklı bakış açıları" olarak sun
4. Akıcı ve doğal bir dil kulllan
5. En önemli bilgiyi başa koy
6. {language} dilinde cevap ver
7. Güven skoru belirt: kesinlik derecesi 1-10 arası

Birleşik cevabını ver:"""

# ===================== AI CACHE HELPER =====================

def _cache_key(prefix: str, *args) -> str:
    raw = f"{prefix}:" + ":".join(str(a) for a in args)
    return hashlib.md5(raw.encode()).hexdigest()

# ===================== SETUP =====================

def setup_phase3_ai_routes(router: APIRouter, db, gemini_generate):
    """Register all Phase 3 AI multi-bot routes"""

    async def _get_context_history(session_id: str, limit: int = 10) -> list:
        """Get recent chat history for context"""
        cursor = db.chat_messages.find(
            {"session_id": session_id},
            {"_id": 0, "role": 1, "content": 1}
        ).sort("created_at", -1).limit(limit)
        messages = await cursor.to_list(length=limit)
        return list(reversed(messages))

    async def _classify_question(question: str, lang: str) -> dict:
        """Use AI to classify which expert bot(s) should handle the question"""
        # Keyword-based pre-classification for speed
        question_lower = question.lower()
        scores = {}
        for bot_id, bot in BOT_PROFILES.items():
            score = sum(1 for kw in bot["keywords"] if kw in question_lower)
            if score > 0:
                scores[bot_id] = score

        # If clear keyword match, skip AI classification
        if scores:
            sorted_bots = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            primary = sorted_bots[0][0]
            secondary = [b[0] for b in sorted_bots[1:3] if b[1] >= 2]
            return {"primary": primary, "secondary": secondary, "method": "keyword"}

        # Fall back to AI classification
        try:
            prompt = ORCHESTRATOR_CLASSIFY_PROMPT.format(question=question)
            raw = await gemini_generate(prompt, "Sen bir soru sınıflandırma sistemisin. Sadece JSON döndür.")
            # Extract JSON from response
            json_match = re.search(r'\{[^}]+\}', raw)
            if json_match:
                result = json.loads(json_match.group())
                return {
                    "primary": result.get("primary", "fiqh"),
                    "secondary": result.get("secondary", []),
                    "method": "ai"
                }
        except Exception as e:
            logger.warning(f"AI classification failed: {e}")

        return {"primary": "fiqh", "secondary": [], "method": "fallback"}

    async def _generate_expert_response(bot_id: str, question: str, context: list, lang: str, level: str = "orta") -> dict:
        """Generate response from a specific expert bot"""
        bot = BOT_PROFILES.get(bot_id)
        if not bot:
            return {"bot_id": bot_id, "response": "", "error": "Bot not found"}

        # Check cache first
        cache_key = _cache_key("expert", bot_id, question, lang, level)
        cached = await db.ai_expert_cache.find_one({"key": cache_key})
        if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 7:
            return {"bot_id": bot_id, "response": cached["response"], "cached": True}

        # Build context string
        context_str = ""
        if context:
            recent = context[-6:]
            context_str = "\n\nÖnceki konuşma:\n" + "\n".join(
                f"{'Kullanıcı' if m.get('role') == 'user' else 'Asistan'}: {m.get('content', '')[:200]}"
                for m in recent
            )

        level_instructions = {
            "baslangic": "Basit ve anlaşılır bir dille açıkla. Teknik terimlerden kaçın. Örneklerle anlamlandır.",
            "orta": "Orta düzeyde detaylandır. Temel kavramları açıkla ama ileri düzey tartışmalara girme.",
            "ileri": "Akademik düzeyde, derinlemesine cevap ver. Kaynak analizleri, usul tartışmaları ve kelami incelikleri dahil et.",
        }

        lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}
        lang_full = lang_map.get(lang, "Türkçe")

        full_prompt = f"""{question}{context_str}

{level_instructions.get(level, level_instructions['orta'])}
Cevabını {lang_full} dilinde ver."""

        try:
            response = await gemini_generate(full_prompt, bot["system_prompt"])

            # Cache the response
            await db.ai_expert_cache.update_one(
                {"key": cache_key},
                {"$set": {
                    "key": cache_key,
                    "bot_id": bot_id,
                    "question": question,
                    "response": response,
                    "lang": lang,
                    "level": level,
                    "created_at": datetime.now(timezone.utc),
                }},
                upsert=True
            )

            return {"bot_id": bot_id, "response": response, "cached": False}
        except Exception as e:
            logger.error(f"Expert bot {bot_id} failed: {e}")
            return {"bot_id": bot_id, "response": "", "error": str(e)}

    async def _merge_expert_responses(question: str, responses: list, lang: str) -> dict:
        """Merge multiple expert responses into one cohesive answer"""
        valid_responses = [r for r in responses if r.get("response") and not r.get("error")]

        if not valid_responses:
            error_msg = {
                "tr": "Üzgünüm, AI servisleri şu an meşgul. Lütfen birkaç saniye sonra tekrar deneyin.",
                "en": "Sorry, AI services are currently busy. Please try again in a few seconds.",
                "ar": "عذراً، خدمات الذكاء الاصطناعي مشغولة حالياً. يرجى المحاولة مرة أخرى بعد قليل.",
            }
            return {"merged": error_msg.get(lang, error_msg["tr"]), "confidence": 0, "bots_used": []}

        if len(valid_responses) == 1:
            resp = valid_responses[0]
            bot = BOT_PROFILES.get(resp["bot_id"], {})
            header = f"**{bot.get('icon', '📖')} {bot.get('name', 'Uzman')}** olarak cevaplıyorum:\n\n"
            return {"merged": header + resp["response"], "confidence": 8, "bots_used": [resp["bot_id"]]}

        # Multiple experts — merge with AI
        expert_texts = "\n\n---\n\n".join(
            f"**{BOT_PROFILES.get(r['bot_id'], {}).get('name', r['bot_id'])}:**\n{r['response']}"
            for r in valid_responses
        )

        lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}
        merge_prompt = ORCHESTRATOR_MERGE_PROMPT.format(
            question=question,
            expert_responses=expert_texts,
            language=lang_map.get(lang, "Türkçe")
        )

        try:
            merged = await gemini_generate(merge_prompt, "Sen uzman cevaplarını sentezleyen bir orkestra yöneticisisin.")
            return {
                "merged": merged,
                "confidence": 8,
                "bots_used": [r["bot_id"] for r in valid_responses],
            }
        except Exception as e:
            logger.error(f"Merge failed: {e}")
            # Fallback: concatenate responses
            parts = []
            for r in valid_responses:
                bot = BOT_PROFILES.get(r["bot_id"], {})
                parts.append(f"**{bot.get('icon', '📖')} {bot.get('name', 'Uzman')}:**\n\n{r['response']}")
            return {
                "merged": "\n\n---\n\n".join(parts),
                "confidence": 6,
                "bots_used": [r["bot_id"] for r in valid_responses],
            }

    # ─── UNCERTAINTY / HALLUCINATION CHECK ───

    UNCERTAINTY_PATTERNS = [
        "emin değilim", "kesin olarak söyleyemem", "bu konuda ihtilaflı",
        "bazı alimler", "tartışmalı", "farklı görüşler", "muhtemelen",
        "rivayet edildiğine göre", "zayıf rivayete göre",
        "i'm not sure", "there are different views", "controversial",
    ]

    def _check_confidence(response_text: str) -> dict:
        """Detect uncertainty markers in AI response"""
        lower = response_text.lower()
        uncertainty_count = sum(1 for p in UNCERTAINTY_PATTERNS if p in lower)
        has_source = bool(re.search(r'(?:sure|ayet|hadis|buhari|müslim|tirmizi|ebu davud)\s*[\d:]+', lower, re.IGNORECASE))
        if uncertainty_count >= 3:
            confidence = "low"
            warning = "⚠️ Bu konuda farklı görüşler bulunmaktadır. Detaylı bilgi için bir ilim ehline danışmanız önerilir."
        elif uncertainty_count >= 1 or not has_source:
            confidence = "medium"
            warning = "ℹ️ Cevap genel bilgi içermektedir. Kritik dini konularda bir alime danışmanızı tavsiye ederiz."
        else:
            confidence = "high"
            warning = None
        return {"confidence": confidence, "warning": warning, "has_source_refs": has_source}

    # ─── ROUTES ───

    @router.get("/ai/bots")
    async def get_available_bots():
        """List all available expert bots"""
        return [
            {
                "id": b["id"],
                "name": b["name"],
                "name_en": b["name_en"],
                "name_ar": b["name_ar"],
                "icon": b["icon"],
                "color": b["color"],
                "description": b["description"],
            }
            for b in BOT_PROFILES.values()
        ]

    @router.get("/ai/usage/{user_id}")
    async def get_ai_usage(user_id: str):
        """Get AI usage stats for a user"""
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        usage = await db.ai_usage.find_one({"user_id": user_id, "date": today})
        sub = await db.subscriptions.find_one({"user_id": user_id, "status": "active"})
        is_premium = sub is not None and sub.get("expires_at", datetime.min.replace(tzinfo=timezone.utc)) > datetime.now(timezone.utc)
        return {
            "used": usage.get("count", 0) if usage else 0,
            "limit": 0 if is_premium else 10,
            "premium": is_premium,
            "date": today,
        }

    class AIContextRequest(BaseModel):
        user_id: str
        level: str = "orta"
        madhab: str = "hanefi"
        language: str = "tr"

    @router.post("/ai/context")
    async def set_ai_context(req: AIContextRequest):
        """Save user AI preferences"""
        await db.ai_context.update_one(
            {"user_id": req.user_id},
            {"$set": {
                "level": req.level,
                "madhab": req.madhab,
                "language": req.language,
                "updated_at": datetime.now(timezone.utc),
            }},
            upsert=True,
        )
        return {"status": "ok"}

    @router.post("/ai/classify")
    async def classify_question(req: BotSelectRequest):
        """Classify a question to determine which bot(s) should answer"""
        result = await _classify_question(req.message, req.language)
        bots = []
        for bid in [result["primary"]] + result.get("secondary", []):
            bot = BOT_PROFILES.get(bid, {})
            bots.append({"id": bid, "name": bot.get("name", bid), "icon": bot.get("icon", "📖")})
        return {"classification": result, "bots": bots}

    @router.post("/ai/expert/{bot_id}")
    async def ask_expert_bot(bot_id: str, req: MultiBotRequest):
        """Ask a specific expert bot directly"""
        if bot_id not in BOT_PROFILES:
            raise HTTPException(status_code=404, detail="Bot not found")
        if not req.message or not req.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        if len(req.message) > 2000:
            raise HTTPException(status_code=400, detail="Message too long (max 2000 chars)")

        context = await _get_context_history(req.session_id)

        # Get user preferences
        user_ctx = None
        if req.user_id:
            user_ctx = await db.ai_context.find_one({"user_id": req.user_id})

        level = user_ctx.get("level", "orta") if user_ctx else "orta"
        lang = req.language or (user_ctx.get("language", "tr") if user_ctx else "tr")

        result = await _generate_expert_response(bot_id, req.message, context, lang, level)
        confidence = _check_confidence(result.get("response", ""))

        # Save to chat history
        now = datetime.now(timezone.utc)
        await db.chat_messages.insert_many([
            {"session_id": req.session_id, "role": "user", "content": req.message, "created_at": now},
            {"session_id": req.session_id, "role": "assistant", "content": result.get("response", ""),
             "bot_id": bot_id, "created_at": now},
        ])

        bot = BOT_PROFILES[bot_id]
        return {
            "response": result.get("response", ""),
            "bot": {"id": bot_id, "name": bot["name"], "icon": bot["icon"], "color": bot["color"]},
            "confidence": confidence,
            "cached": result.get("cached", False),
        }

    @router.post("/ai/orchestrator")
    async def orchestrator_query(req: MultiBotRequest):
        """Main orchestrator: classify → route to experts → merge responses"""
        # Input validation
        if not req.message or not req.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        if len(req.message) > 2000:
            raise HTTPException(status_code=400, detail="Message too long (max 2000 chars)")

        # Check AI usage limits
        if req.user_id:
            today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            usage = await db.ai_usage.find_one({"user_id": req.user_id, "date": today})
            sub = await db.subscriptions.find_one({"user_id": req.user_id, "status": "active"})
            is_premium = sub is not None and sub.get("expires_at", datetime.min.replace(tzinfo=timezone.utc)) > datetime.now(timezone.utc)
            daily_limit = 0 if is_premium else 10
            if daily_limit > 0 and usage and usage.get("count", 0) >= daily_limit:
                return {
                    "response": "Günlük AI kullanım limitinize ulaştınız. Premium'a geçerek sınırsız soru sorabilirsiniz.",
                    "limit_reached": True, "bots_used": [], "confidence": {}
                }

        context = await _get_context_history(req.session_id)

        # Get user preferences
        user_ctx = None
        if req.user_id:
            user_ctx = await db.ai_context.find_one({"user_id": req.user_id})
        level = user_ctx.get("level", "orta") if user_ctx else "orta"
        lang = req.language or (user_ctx.get("language", "tr") if user_ctx else "tr")

        # Step 1: Classify the question
        classification = await _classify_question(req.message, lang)
        primary_bot = classification["primary"]
        secondary_bots = classification.get("secondary", [])

        # Step 2: Generate expert responses (primary always, secondary in parallel)
        import asyncio
        tasks = [_generate_expert_response(primary_bot, req.message, context, lang, level)]
        for sb in secondary_bots[:2]:
            tasks.append(_generate_expert_response(sb, req.message, context, lang, level))

        responses = await asyncio.gather(*tasks, return_exceptions=True)
        valid = [r for r in responses if isinstance(r, dict) and not r.get("error")]

        # Step 3: Merge if multiple, otherwise return single
        if len(valid) > 1:
            merged = await _merge_expert_responses(req.message, valid, lang)
            final_response = merged["merged"]
            bots_used = merged["bots_used"]
        elif valid:
            bot = BOT_PROFILES.get(valid[0]["bot_id"], {})
            final_response = valid[0]["response"]
            bots_used = [valid[0]["bot_id"]]
        else:
            final_response = "Üzgünüm, şu an cevap üretilemedi. Lütfen tekrar deneyin."
            bots_used = []

        confidence = _check_confidence(final_response)

        # Append warning if needed
        if confidence.get("warning"):
            final_response += f"\n\n{confidence['warning']}"

        # Save to chat history
        now = datetime.now(timezone.utc)
        await db.chat_messages.insert_many([
            {"session_id": req.session_id, "role": "user", "content": req.message, "created_at": now},
            {"session_id": req.session_id, "role": "assistant", "content": final_response,
             "bots_used": bots_used, "created_at": now},
        ])

        # Update usage counter
        if req.user_id:
            today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            await db.ai_usage.update_one(
                {"user_id": req.user_id, "date": today},
                {"$inc": {"count": 1}, "$set": {"updated_at": now}},
                upsert=True
            )

        return {
            "response": final_response,
            "bots_used": [
                {"id": bid, "name": BOT_PROFILES.get(bid, {}).get("name", bid), "icon": BOT_PROFILES.get(bid, {}).get("icon", "📖"), "color": BOT_PROFILES.get(bid, {}).get("color", "#D4AF37")}
                for bid in bots_used
            ],
            "classification": classification,
            "confidence": confidence,
            "limit_reached": False,
        }
