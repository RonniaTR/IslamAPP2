"""
Kur'an mealleri — QuranEnc.com kaynaklı yerel önbellek.

Neden: Depoya gömülü Diyanet ve Saheeh International meallerinin
kullanım izni yoktu (docs/YENI_OZELLIKLER.md 0.1). Onların yerine QuranEnc.com'un yeniden
yayına açık çevirileri kullanılır.

QuranEnc yeniden yayın şartları:
  1. İçerik değiştirilmez, eklenmez, silinmez.
  2. Yayıncı ve kaynak (QuranEnc.com) açıkça belirtilir.
  3. Sürüm numarası belirtilir.
  4. Künye bilgisi korunur.
  5. Güncel sürüme güncellenir.
  6. Meal gösterilirken uygunsuz reklam bulunmaz.

Dosyalar `scripts/fetch_quranenc.py` ile üretilir ve `data/translations/<key>.json` altında
durur. Biçim, sunucunun geri kalanının beklediği yapıyla aynıdır:
    {"data": {"edition": {...künye...}, "surahs": [{"number": 1, "ayahs": [{"numberInSurah": 1, "text": "...", "footnotes": "..."}]}]}}
"""

import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
TRANSLATIONS_DIR = ROOT_DIR / "data" / "translations"

# Dil → QuranEnc çeviri anahtarı. Web: frontend/src/data/sources.json ile aynı olmalı.
TRANSLATION_KEYS = {
    "tr": "turkish_rwwad",
    "en": "english_rwwad",
}

# Tefsir (QuranEnc'te çeviri olarak yayımlanır; aynı yeniden yayın şartları geçerlidir).
TAFSIR_KEYS = {
    "tr": "turkish_mokhtasar",
}

ALL_KEYS = {**{k: (k, v) for k, v in TRANSLATION_KEYS.items()},
            **{f"tafsir_{k}": (k, v) for k, v in TAFSIR_KEYS.items()}}


def load_by_key(key: str):
    """Anahtarla (ör. turkish_mokhtasar) önbellek dosyasını okur; yoksa (None, None)."""
    if key not in set(TRANSLATION_KEYS.values()) | set(TAFSIR_KEYS.values()):
        return None, None
    path = TRANSLATIONS_DIR / f"{key}.json"
    if not path.exists():
        return None, None
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)["data"]
        return data["surahs"], data.get("edition", {})
    except Exception as e:
        logger.error("Önbellek okunamadı (%s): %s", path.name, e)
        return None, None


def translation_path(lang: str) -> Path:
    return TRANSLATIONS_DIR / f"{TRANSLATION_KEYS[lang]}.json"


def load_translation(lang: str):
    """(surahs, edition) döndürür; dosya yoksa (None, None)."""
    path = translation_path(lang)
    if not path.exists():
        logger.warning(
            "Meal dosyası yok: %s — `python scripts/fetch_quranenc.py` çalıştırılmalı.", path.name
        )
        return None, None
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)["data"]
        return data["surahs"], data.get("edition", {})
    except Exception as e:  # bozuk dosya sunucuyu düşürmesin
        logger.error("Meal dosyası okunamadı (%s): %s", path.name, e)
        return None, None


def credit(edition: dict) -> str:
    """Yanıtlara eklenecek zorunlu künye satırı."""
    if not edition:
        return ""
    return f"{edition.get('name', '')} · QuranEnc.com · v{edition.get('version', '?')}"
