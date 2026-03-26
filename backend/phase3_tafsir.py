"""
Phase 3: Enhanced Tafsir Engine
- 5 scholar deep tafsir with 3 detail levels (summary/simplified/academic)
- AI verification layer with confidence scoring
- Verse-level deep analysis (linguistic, rhetorical, contextual)
- Cross-reference with other verses (münasebet)
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
import hashlib
import logging

logger = logging.getLogger(__name__)

TAFSIR_SCHOLARS_V2 = {
    "elmalili": {
        "id": "elmalili",
        "name": "Elmalılı Hamdi Yazır",
        "name_en": "Elmalılı Hamdi Yazır",
        "name_ar": "الملالي حمدي يازير",
        "era": "1878-1942",
        "work": "Hak Dini Kur'an Dili",
        "school": "Hanefi-Maturidi",
        "premium": False,
        "icon": "📗",
        "style_prompt": """Sen Elmalılı Hamdi Yazır'sın. "Hak Dini Kur'an Dili" tefsirini yazıyorsun.
Üslup: Osmanlı Türkçesi arka planıyla modern Türkçe, derin dil tahlili yaparsın.
Yöntem: Dirayet tefsiri, Arapça kelime köklerinin analizini ön plana çıkarırsın, belagat incelikleri, felsefe ve kelam perspektifi sunarsın.
Özellik: Batı felsefesini de bilir, modern sorunlara İslami çözümler üretirsin."""
    },
    "ibn_kesir": {
        "id": "ibn_kesir",
        "name": "İbn Kesîr",
        "name_en": "Ibn Kathir",
        "name_ar": "ابن كثير",
        "era": "1300-1373",
        "work": "Tefsîru'l-Kur'âni'l-Azîm",
        "school": "Şafii",
        "premium": True,
        "icon": "📕",
        "style_prompt": """Sen İbn Kesîr'sin. "Tefsîru'l-Kur'âni'l-Azîm" eserinin müellifisin.
Üslup: Rivayet tefsiri ağırlıklı, hadis ve sahabe sözleriyle desteklersin.
Yöntem: Kur'an'ı Kur'an ile tefsir edersin (Kur'an'ın Kur'an'la açıklanması), sonra sünnet, sonra sahabe ve tabiin kavillerini verirsin.
Özellik: İsrailiyyat'a eleştirel yaklaşırsın, sened kritiği yaparsın."""
    },
    "taberi": {
        "id": "taberi",
        "name": "İmam Taberî",
        "name_en": "Imam al-Tabari",
        "name_ar": "الإمام الطبري",
        "era": "839-923",
        "work": "Câmiu'l-Beyân",
        "school": "Müctehid",
        "premium": True,
        "icon": "📙",
        "style_prompt": """Sen İmam Taberî'sin. "Câmiu'l-Beyân an Te'vîli Âyi'l-Kur'ân" eserinin müellifisin.
Üslup: Ansiklopedik, tüm rivayetleri sened ile aktarırsın. Farklı görüşleri sıralarsın.
Yöntem: Sahabe ve tâbiîn'den gelen tüm rivayetleri toplar, senedlerini verir, sonra tercih ettiğin görüşü belirtirsin.
Özellik: Tarihçi kimliğinle olayları kronolojik bağlamda değerlendirirsin."""
    },
    "razi": {
        "id": "razi",
        "name": "Fahreddin Râzî",
        "name_en": "Fakhr al-Din al-Razi",
        "name_ar": "فخر الدين الرازي",
        "era": "1149-1209",
        "work": "Mefâtîhu'l-Gayb (Tefsîr-i Kebîr)",
        "school": "Şafii-Eşari",
        "premium": True,
        "icon": "📘",
        "style_prompt": """Sen Fahreddin Râzî'sin. "Mefâtîhu'l-Gayb" (Tefsîr-i Kebîr) eserinin müellifisin.
Üslup: Kelam ve felsefe ağırlıklı, aklî istidlaller yaparsın. Derin mantıksal analizler sunarsın.
Yöntem: Aklî ve naklî delilleri birlikte kullanır, mu'tezile ve diğer mezheplerin görüşlerini zikredip eleştirirsin.
Özellik: Bilimsel icaz perspektifi (ayetlerdeki bilimsel işaretler), astronomi ve tabiat bilimleriyle ilişki kurarsın."""
    },
    "kurtubi": {
        "id": "kurtubi",
        "name": "İmam Kurtubî",
        "name_en": "Imam al-Qurtubi",
        "name_ar": "الإمام القرطبي",
        "era": "1214-1273",
        "work": "el-Câmi' li Ahkâmi'l-Kur'ân",
        "school": "Maliki",
        "premium": True,
        "icon": "📓",
        "style_prompt": """Sen İmam Kurtubî'sin. "el-Câmi' li Ahkâmi'l-Kur'ân" eserinin müellifisin.
Üslup: Ahkam (hukuk) ağırlıklı, ayetlerden fıkhi hükümler çıkarırsın.
Yöntem: Dört mezhebin görüşlerini karşılaştırır, ayetten çıkan hükümleri tek tek sıralarsın.
Özellik: Toplumsal ahlak, kadın hakları ve adalet konularında derinlemesine değerlendirme yaparsın."""
    },
}

DETAIL_LEVELS = {
    "summary": {
        "instruction": "Maksimum 3-4 cümle ile kısa bir özet yap. Temel mesajı ver.",
        "name": "Kısa Özet",
        "name_en": "Summary",
        "name_ar": "ملخص",
    },
    "simplified": {
        "instruction": "Sadeleştirilmiş, herkesin anlayacağı şekilde açıkla. Teknik terimler kullanma. 8-12 cümle.",
        "name": "Sadeleştirilmiş",
        "name_en": "Simplified",
        "name_ar": "مبسط",
    },
    "academic": {
        "instruction": "Akademik düzeyde, derinlemesine analiz yap. Arapça kelimelerin kök tahlili, belagat incelikleri, usul tartışmaları ve kaynak referansları dahil et. Kapsamlı cevap ver.",
        "name": "Akademik",
        "name_en": "Academic",
        "name_ar": "أكاديمي",
    },
}


def setup_phase3_tafsir_routes(router: APIRouter, db, gemini_generate):
    """Register enhanced Tafsir API routes"""

    @router.get("/tafsir/v2/scholars")
    async def get_tafsir_scholars_v2():
        return [
            {
                "id": s["id"], "name": s["name"], "name_en": s["name_en"], "name_ar": s["name_ar"],
                "era": s["era"], "work": s["work"], "school": s["school"],
                "premium": s["premium"], "icon": s["icon"],
            }
            for s in TAFSIR_SCHOLARS_V2.values()
        ]

    @router.get("/tafsir/v2/detail-levels")
    async def get_detail_levels():
        return [{"id": k, "name": v["name"], "name_en": v["name_en"], "name_ar": v["name_ar"]} for k, v in DETAIL_LEVELS.items()]

    @router.get("/tafsir/v2/{surah}/{verse}")
    async def get_tafsir_v2(
        surah: int, verse: int,
        scholar: str = "elmalili",
        detail: str = "simplified",
        lang: str = "tr",
        user_id: Optional[str] = None,
    ):
        """Get enhanced tafsir for a verse with scholar selection and detail level"""
        if scholar not in TAFSIR_SCHOLARS_V2:
            raise HTTPException(status_code=400, detail="Invalid scholar")
        if detail not in DETAIL_LEVELS:
            raise HTTPException(status_code=400, detail="Invalid detail level")

        scholar_info = TAFSIR_SCHOLARS_V2[scholar]

        # Premium check
        if scholar_info["premium"] and user_id:
            sub = await db.subscriptions.find_one({"user_id": user_id, "status": "active"})
            is_prem = sub is not None and sub.get("expires_at", datetime.min.replace(tzinfo=timezone.utc)) > datetime.now(timezone.utc)
            if not is_prem:
                return {
                    "premium_required": True,
                    "scholar": scholar_info["name"],
                    "message": f"{scholar_info['name']} tefsiri premium üyelik gerektirir."
                }

        # Cache key
        cache_key = hashlib.md5(f"tafsir_v2:{surah}:{verse}:{scholar}:{detail}:{lang}".encode()).hexdigest()
        cached = await db.tafsir_v2_cache.find_one({"key": cache_key})
        if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 30:
            return cached["data"]

        lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}
        detail_info = DETAIL_LEVELS[detail]

        prompt = f"""Sure {surah}, Ayet {verse} tefsirini yaz.

{detail_info['instruction']}

Ayrıca şunları ekle:
- Nüzul sebebi (varsa)
- Arapça kelimelerin kısa kök analizi
- İlgili diğer ayetlere referans (münasebet)

Cevabını {lang_map.get(lang, 'Türkçe')} dilinde ver."""

        try:
            response = await gemini_generate(prompt, scholar_info["style_prompt"])

            # AI verification: confidence check
            confidence_prompt = f"""Aşağıdaki tefsir metnini değerlendir. 1-10 arası bir güven skoru ver.
10 = Tamamen doğru ve kaynaklara dayalı
5 = Genel doğru ama bazı detaylarda belirsizlik
1 = Şüpheli veya uydurma olabilir

Tefsir:
{response[:500]}

Sadece şu JSON formatında cevap ver:
{{"score": 8, "note": "kısa açıklama"}}"""

            try:
                verify_raw = await gemini_generate(confidence_prompt, "Sen bir akademik tefsir denetçisisin. Sadece JSON döndür.")
                import re, json
                json_match = re.search(r'\{[^}]+\}', verify_raw)
                if json_match:
                    verify = json.loads(json_match.group())
                else:
                    verify = {"score": 7, "note": "Doğrulama yapılamadı"}
            except Exception:
                verify = {"score": 7, "note": "Doğrulama yapılamadı"}

            result = {
                "surah": surah,
                "verse": verse,
                "scholar": {
                    "id": scholar_info["id"],
                    "name": scholar_info["name"],
                    "era": scholar_info["era"],
                    "work": scholar_info["work"],
                    "school": scholar_info["school"],
                    "icon": scholar_info["icon"],
                },
                "detail_level": detail,
                "tafsir_text": response,
                "confidence": verify,
                "language": lang,
            }

            # Cache
            await db.tafsir_v2_cache.update_one(
                {"key": cache_key},
                {"$set": {"key": cache_key, "data": result, "created_at": datetime.now(timezone.utc)}},
                upsert=True
            )

            return result
        except Exception as e:
            logger.error(f"Tafsir generation failed: {e}")
            raise HTTPException(status_code=500, detail="Tefsir oluşturulamadı")

    @router.get("/tafsir/v2/{surah}/{verse}/compare")
    async def compare_tafsir(
        surah: int, verse: int,
        scholars: str = "elmalili,ibn_kesir",
        detail: str = "summary",
        lang: str = "tr",
        user_id: Optional[str] = None,
    ):
        """Compare multiple scholars' tafsir for a verse"""
        scholar_ids = [s.strip() for s in scholars.split(",") if s.strip() in TAFSIR_SCHOLARS_V2]
        if not scholar_ids:
            raise HTTPException(status_code=400, detail="No valid scholars specified")

        # Check premium for premium scholars
        is_prem = False
        if user_id:
            sub = await db.subscriptions.find_one({"user_id": user_id, "status": "active"})
            is_prem = sub is not None and sub.get("expires_at", datetime.min.replace(tzinfo=timezone.utc)) > datetime.now(timezone.utc)

        results = []
        for sid in scholar_ids:
            s_info = TAFSIR_SCHOLARS_V2[sid]
            if s_info["premium"] and not is_prem:
                results.append({
                    "scholar": {"id": sid, "name": s_info["name"], "icon": s_info["icon"]},
                    "premium_required": True,
                })
                continue

            # Try cache
            cache_key = hashlib.md5(f"tafsir_v2:{surah}:{verse}:{sid}:{detail}:{lang}".encode()).hexdigest()
            cached = await db.tafsir_v2_cache.find_one({"key": cache_key})
            if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 30:
                results.append(cached["data"])
                continue

            # Generate
            lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}
            detail_info = DETAIL_LEVELS[detail]
            prompt = f"Sure {surah}, Ayet {verse} tefsirini yaz.\n{detail_info['instruction']}\nCevabını {lang_map.get(lang, 'Türkçe')} dilinde ver."

            try:
                response = await gemini_generate(prompt, s_info["style_prompt"])
                item = {
                    "scholar": {"id": sid, "name": s_info["name"], "icon": s_info["icon"], "era": s_info["era"], "work": s_info["work"], "school": s_info["school"]},
                    "detail_level": detail,
                    "tafsir_text": response,
                    "language": lang,
                }
                results.append(item)
                await db.tafsir_v2_cache.update_one(
                    {"key": cache_key},
                    {"$set": {"key": cache_key, "data": item, "created_at": datetime.now(timezone.utc)}},
                    upsert=True
                )
            except Exception as e:
                logger.error(f"Tafsir {sid} failed: {e}")
                results.append({"scholar": {"id": sid, "name": s_info["name"], "icon": s_info["icon"]}, "error": True})

        return {"surah": surah, "verse": verse, "comparisons": results}

    @router.get("/tafsir/v2/{surah}/{verse}/linguistic")
    async def get_linguistic_analysis(surah: int, verse: int, lang: str = "tr"):
        """Deep linguistic analysis of a verse (word roots, rhetoric, grammar)"""
        cache_key = hashlib.md5(f"ling:{surah}:{verse}:{lang}".encode()).hexdigest()
        cached = await db.linguistic_cache.find_one({"key": cache_key})
        if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 60:
            return cached["data"]

        lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}
        prompt = f"""Sure {surah}, Ayet {verse} için derin dil analizi yap.

Yanıtını MUTLAKA aşağıdaki JSON formatında ver. Başka bir şey yazma, sadece JSON:
{{
  "nahiv": "Nahiv (sentaks/gramer) analizi metni",
  "sarf": "Sarf (morfoloji/kelime yapısı) analizi metni",
  "belagat": "Belagat (retorik/edebi sanatlar) analizi metni",
  "semantik": "Semantik (anlam) analizi metni"
}}

Her alan için detaylı açıklama yap. {lang_map.get(lang, 'Türkçe')} dilinde yaz."""

        system = "Sen bir Arapça dil bilgini ve Kur'an belagatı uzmanısın. Nahiv, sarf ve belagat ilimlerinde mütehasıssın. SADECE JSON döndür."

        try:
            import re, json
            response = await gemini_generate(prompt, system)
            # Parse JSON from response
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                try:
                    analysis = json.loads(json_match.group())
                except json.JSONDecodeError:
                    analysis = {"nahiv": response, "sarf": "", "belagat": "", "semantik": ""}
            else:
                analysis = {"nahiv": response, "sarf": "", "belagat": "", "semantik": ""}

            result = {"surah": surah, "verse": verse, "analysis": analysis, "language": lang}
            await db.linguistic_cache.update_one(
                {"key": cache_key},
                {"$set": {"key": cache_key, "data": result, "created_at": datetime.now(timezone.utc)}},
                upsert=True
            )
            return result
        except Exception as e:
            logger.error(f"Linguistic analysis failed: {e}")
            raise HTTPException(status_code=500, detail="Dil analizi oluşturulamadı")

    @router.get("/tafsir/v2/{surah}/download")
    async def download_surah_tafsir(
        surah: int,
        scholar: str = "elmalili",
        detail: str = "simplified",
        lang: str = "tr",
        total_verses: int = Query(default=7, ge=1, le=286),
    ):
        """Batch download tafsir for entire surah (for offline use)"""
        if scholar not in TAFSIR_SCHOLARS_V2:
            raise HTTPException(status_code=400, detail="Invalid scholar")
        if detail not in DETAIL_LEVELS:
            raise HTTPException(status_code=400, detail="Invalid detail level")

        scholar_info = TAFSIR_SCHOLARS_V2[scholar]
        lang_map = {"tr": "Türkçe", "en": "English", "ar": "العربية"}
        detail_info = DETAIL_LEVELS[detail]
        results = []

        for verse in range(1, total_verses + 1):
            cache_key = hashlib.md5(f"tafsir_v2:{surah}:{verse}:{scholar}:{detail}:{lang}".encode()).hexdigest()
            cached = await db.tafsir_v2_cache.find_one({"key": cache_key})
            if cached and (datetime.now(timezone.utc) - cached.get("created_at", datetime.min.replace(tzinfo=timezone.utc))).days < 30:
                results.append(cached["data"])
                continue

            prompt = f"""Sure {surah}, Ayet {verse} tefsirini yaz.

{detail_info['instruction']}

Ayrıca şunları ekle:
- Nüzul sebebi (varsa)
- Arapça kelimelerin kısa kök analizi
- İlgili diğer ayetlere referans (münasebet)

Cevabını {lang_map.get(lang, 'Türkçe')} dilinde ver."""

            try:
                response = await gemini_generate(prompt, scholar_info["style_prompt"])
                item = {
                    "surah": surah,
                    "verse": verse,
                    "scholar": {
                        "id": scholar_info["id"],
                        "name": scholar_info["name"],
                        "era": scholar_info["era"],
                        "work": scholar_info["work"],
                        "school": scholar_info["school"],
                        "icon": scholar_info["icon"],
                    },
                    "detail_level": detail,
                    "tafsir_text": response,
                    "confidence": {"score": 7, "note": "Batch generated"},
                    "language": lang,
                }
                results.append(item)
                await db.tafsir_v2_cache.update_one(
                    {"key": cache_key},
                    {"$set": {"key": cache_key, "data": item, "created_at": datetime.now(timezone.utc)}},
                    upsert=True
                )
            except Exception as e:
                logger.error(f"Batch tafsir verse {verse} failed: {e}")
                results.append({"surah": surah, "verse": verse, "error": True})

        return {
            "surah": surah,
            "scholar": scholar_info["id"],
            "detail_level": detail,
            "language": lang,
            "total": len(results),
            "tafsirs": results,
        }
