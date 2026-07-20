"""
Phase 3: Enhanced Hadith Module
- Buhari, Müslim, Riyazüs Salihin collections
- Word-by-word Arabic analysis (clickable popup)
- Ravi chain visualization
- Authenticity grading
- AI-powered hadith explanation
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import hashlib
import logging
import json

logger = logging.getLogger(__name__)

# ===================== HADITH GRADING =====================

HADITH_GRADES = {
    "sahih": {"label": "Sahih", "label_en": "Authentic", "label_ar": "صحيح", "color": "#10B981", "icon": "✅", "level": 1},
    "hasen": {"label": "Hasen", "label_en": "Good", "label_ar": "حسن", "color": "#F59E0B", "icon": "🟡", "level": 2},
    "zayif": {"label": "Zayıf", "label_en": "Weak", "label_ar": "ضعيف", "color": "#EF4444", "icon": "🔴", "level": 3},
    "mevzu": {"label": "Mevzû (Uydurma)", "label_en": "Fabricated", "label_ar": "موضوع", "color": "#6B7280", "icon": "⛔", "level": 4},
}

HADITH_SOURCES = {
    "bukhari": {"name": "Sahih-i Buhârî", "name_en": "Sahih al-Bukhari", "name_ar": "صحيح البخاري", "compiler": "İmam Buhârî", "count": "7275", "icon": "📗"},
    "muslim": {"name": "Sahih-i Müslim", "name_en": "Sahih Muslim", "name_ar": "صحيح مسلم", "compiler": "İmam Müslim", "count": "7563", "icon": "📕"},
    "riyazus_salihin": {"name": "Riyâzü's-Sâlihîn", "name_en": "Riyadh as-Salihin", "name_ar": "رياض الصالحين", "compiler": "İmam Nevevî", "count": "1896", "icon": "📘"},
    "tirmizi": {"name": "Sünen-i Tirmizî", "name_en": "Jami at-Tirmidhi", "name_ar": "سنن الترمذي", "compiler": "İmam Tirmizî", "count": "3956", "icon": "📙"},
    "ebu_davud": {"name": "Sünen-i Ebû Dâvûd", "name_en": "Sunan Abu Dawud", "name_ar": "سنن أبي داود", "compiler": "İmam Ebû Dâvûd", "count": "5274", "icon": "📓"},
}


class WordAnalysisRequest(BaseModel):
    word: str
    hadith_id: Optional[str] = None
    language: str = "tr"

class HadithExplainRequest(BaseModel):
    hadith_id: str
    language: str = "tr"
    detail_level: str = "simplified"  # summary / simplified / academic


def setup_phase3_hadith_routes(router: APIRouter, db, gemini_generate):
    """Register enhanced hadith module routes"""

    @router.get("/hadith/v2/sources")
    async def get_hadith_sources():
        return [{"id": k, **v} for k, v in HADITH_SOURCES.items()]

    @router.get("/hadith/v2/grades")
    async def get_hadith_grades():
        return [{"id": k, **v} for k, v in HADITH_GRADES.items()]

    @router.post("/hadith/v2/word-analysis")
    async def word_analysis(req: WordAnalysisRequest):
        """Analyze an Arabic word: root, morphology, meaning, usage"""
        cache_key = hashlib.md5(f"word:{req.word}:{req.language}".encode()).hexdigest()
        cached = await db.word_analysis_cache.find_one({"key": cache_key})
        if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 90:
            return cached["data"]

        lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}
        prompt = f""""{req.word}" Arapça kelimesinin detaylı analizini yap.

Şu bilgileri JSON formatında döndür:
{{
  "word": "{req.word}",
  "transliteration": "Latin harflerle yazılışı",
  "root": "Kök harfleri (ör: ك-ت-ب)",
  "root_meaning": "Kök anlamı",
  "pattern": "Kalıbı (ör: فَعَلَ, مَفْعُول)",
  "type": "Kelime türü (isim/fiil/harf)",
  "meaning": "Temel anlamı",
  "meanings": ["anlam 1", "anlam 2"],
  "grammar": "Gramer bilgisi (i'rab durumu)",
  "related_words": ["ilgili kelime 1", "ilgili kelime 2"],
  "quran_usage": "Kur'an'da ne bağlamda kullanıldığı (kısa)",
  "frequency": "Kur'an'da kaç kez geçtiği (yaklaşık)"
}}

{lang_map.get(req.language, 'Türkçe')} dilinde cevap ver. Sadece JSON döndür."""

        try:
            raw = await gemini_generate(prompt, "Sen bir Arapça dil bilgini ve sarf-nahiv uzmanısın. Sadece JSON döndür.")
            import re
            json_match = re.search(r'\{[\s\S]*\}', raw)
            if json_match:
                data = json.loads(json_match.group())
            else:
                data = {"word": req.word, "meaning": raw, "error": False}

            await db.word_analysis_cache.update_one(
                {"key": cache_key},
                {"$set": {"key": cache_key, "data": data, "created_at": datetime.now(timezone.utc)}},
                upsert=True
            )
            return data
        except Exception as e:
            logger.error(f"Word analysis failed: {e}")
            return {"word": req.word, "meaning": "Analiz yapılamadı", "error": True}

    @router.post("/hadith/v2/explain")
    async def explain_hadith(req: HadithExplainRequest):
        """Get AI-powered hadith explanation with ravi chain analysis"""
        cache_key = hashlib.md5(f"hadith_explain:{req.hadith_id}:{req.language}:{req.detail_level}".encode()).hexdigest()
        cached = await db.hadith_explain_cache.find_one({"key": cache_key})
        if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 30:
            return cached["data"]

        # Find hadith from local DB/data
        hadith_doc = await db.hadiths_v2.find_one({"id": req.hadith_id})
        if not hadith_doc:
            # Try to find from the loaded HADITH_LIBRARY (local JSON)
            raise HTTPException(status_code=404, detail="Hadith not found")

        lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}
        detail_instructions = {
            "summary": "Kısa 3-4 cümle ile özetle.",
            "simplified": "Herkesin anlayacağı şekilde sadeleştirerek açıkla. 8-12 cümle.",
            "academic": "Akademik düzeyde, derinlemesine şerh yaz. Usul tartışmalarını, fıkhi hükümleri ve diğer rivayetlerle karşılaştırmayı dahil et.",
        }

        arabic_text = hadith_doc.get("arabic", "")
        turkish_text = hadith_doc.get("turkish", "")

        prompt = f"""Şu hadisi açıkla:

Arapça: {arabic_text}
Türkçe: {turkish_text}
Kaynak: {hadith_doc.get('source', '')} - No: {hadith_doc.get('number', '')}

Şunları dahil et:
1. **Hadisin Şerhi**: {detail_instructions.get(req.detail_level, detail_instructions['simplified'])}
2. **Ravi Zinciri Analizi**: Hadisin ravi zincirini (sened) açıkla, ravilerin güvenilirlik durumunu belirt
3. **Fıkhi Hükümler**: Bu hadisten çıkarılan pratik hükümleri listele
4. **İlgili Hadisler**: Benzer konudaki diğer sahih hadisleri zikrederek karşılaştır
5. **Sıhhat Değerlendirmesi**: Hadisin sıhhat derecesini ve nedenini açıkla

{lang_map.get(req.language, 'Türkçe')} dilinde cevap ver."""

        system = "Sen dünya çapında tanınan bir hadis şarihi ve muhaddissin. Kütüb-i Sitte'ye derinlemesine hakimsin."

        try:
            response = await gemini_generate(prompt, system)

            result = {
                "hadith_id": req.hadith_id,
                "explanation": response,
                "detail_level": req.detail_level,
                "language": req.language,
                "source": hadith_doc.get("source", ""),
            }

            await db.hadith_explain_cache.update_one(
                {"key": cache_key},
                {"$set": {"key": cache_key, "data": result, "created_at": datetime.now(timezone.utc)}},
                upsert=True
            )

            return result
        except Exception as e:
            logger.error(f"Hadith explanation failed: {e}")
            raise HTTPException(status_code=500, detail="Açıklama oluşturulamadı")

    @router.get("/hadith/v2/ravi-chain/{hadith_id}")
    async def get_ravi_chain(hadith_id: str, lang: str = "tr"):
        """Generate/retrieve ravi chain (isnad) visualization for a hadith"""
        cache_key = hashlib.md5(f"ravi:{hadith_id}:{lang}".encode()).hexdigest()
        cached = await db.ravi_chain_cache.find_one({"key": cache_key})
        if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 90:
            return cached["data"]

        hadith_doc = await db.hadiths_v2.find_one({"id": hadith_id})
        if not hadith_doc:
            raise HTTPException(status_code=404, detail="Hadith not found")

        lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}

        prompt = f"""Şu hadisin sened (ravi zinciri) analizini yap:

{hadith_doc.get('arabic', '')[:500]}
Kaynak: {hadith_doc.get('source', '')}

JSON formatında cevap ver:
{{
  "chain": [
    {{
      "name": "Ravi adı",
      "name_ar": "Arapça adı",
      "role": "Sahabi/Tabii/Tabei Tabiin/Muhaddis",
      "reliability": "Sika/Saduk/Zayıf",
      "death_year": "Vefat tarihi (tahmini)",
      "brief": "Kısa tanıtım"
    }}
  ],
  "grade": "sahih/hasen/zayif",
  "grade_reason": "Sıhhat sebebi kısa",
  "continuous": true
}}

{lang_map.get(lang, 'Türkçe')} dilinde cevap ver. Sadece JSON döndür."""

        try:
            raw = await gemini_generate(prompt, "Sen bir hadis ravi kritiği (cerh ve ta'dîl) uzmanısın. Sadece JSON döndür.")
            import re
            json_match = re.search(r'\{[\s\S]*\}', raw)
            if json_match:
                data = json.loads(json_match.group())
            else:
                data = {"chain": [], "grade": "unknown", "error": True}

            await db.ravi_chain_cache.update_one(
                {"key": cache_key},
                {"$set": {"key": cache_key, "data": data, "created_at": datetime.now(timezone.utc)}},
                upsert=True
            )
            return data
        except Exception as e:
            logger.error(f"Ravi chain failed: {e}")
            return {"chain": [], "grade": "unknown", "error": True}

    @router.get("/hadith/v2/search")
    async def search_hadith_v2(
        q: str = Query(..., min_length=2),
        source: Optional[str] = None,
        grade: Optional[str] = None,
        category: Optional[str] = None,
        lang: str = "tr",
        limit: int = 20,
    ):
        """Advanced hadith search with filters"""
        query_filter = {}
        search_text = q.lower()

        # Text search across multiple fields
        query_filter["$or"] = [
            {"turkish": {"$regex": search_text, "$options": "i"}},
            {"arabic": {"$regex": search_text, "$options": "i"}},
            {"english": {"$regex": search_text, "$options": "i"}},
            {"theme": {"$regex": search_text, "$options": "i"}},
            {"explanation": {"$regex": search_text, "$options": "i"}},
        ]

        if source:
            query_filter["source"] = {"$regex": source, "$options": "i"}
        if grade:
            query_filter["authenticity"] = {"$regex": grade, "$options": "i"}
        if category:
            query_filter["categoryId"] = category

        cursor = db.hadiths_v2.find(query_filter, {"_id": 0}).limit(limit)
        results = await cursor.to_list(length=limit)

        return {"results": results, "total": len(results), "query": q}
