#!/usr/bin/env python3
"""
QuranEnc.com'dan mealleri indirir ve backend/data/translations/ altına yazar.

Kullanım (ağ erişimi olan bir makinede, backend/ klasöründen):
    python scripts/fetch_quranenc.py            # tr + en mealleri ve Türkçe tefsir
    python scripts/fetch_quranenc.py tr         # yalnız Türkçe meal
    python scripts/fetch_quranenc.py tafsir_tr  # yalnız Türkçe tefsir

Ne zaman çalıştırılır:
  · İlk kurulumda (dosyalar depoda yoksa sunucu mealsiz açılır).
  · QuranEnc yeni sürüm yayımladığında (şart: güncel sürüme güncellenir).

Metne DOKUNULMAZ: çeviri ve dipnotlar geldiği gibi yazılır.
"""

import json
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from quran_translations import ALL_KEYS, TRANSLATIONS_DIR  # noqa: E402

API = "https://quranenc.com/api/v1"
AYAH_COUNTS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]


def get(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "IslamAPP2-meal-sync/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def edition_info(lang: str, key: str) -> dict:
    raw = get(f"{API}/translations/list/{lang}")
    items = raw if isinstance(raw, list) else raw.get("translations", [])
    hit = next((t for t in items if t.get("key") == key), None) or {}
    return {
        "identifier": key,
        "language": lang,
        "name": hit.get("title", key),
        "description": hit.get("description", ""),
        "version": hit.get("version", "1.0.0"),
        "last_update": hit.get("last_update"),
        "source": "QuranEnc.com",
        "source_url": f"https://quranenc.com/{lang}/browse/{key}",
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "type": "translation",
    }


def fetch(name: str):
    lang, key = ALL_KEYS[name]
    edition = edition_info(lang, key)
    print(f"[{name}] {edition['name']} v{edition['version']}")
    surahs = []
    for n in range(1, 115):
        rows = get(f"{API}/translation/sura/{key}/{n}").get("result", [])
        if len(rows) != AYAH_COUNTS[n - 1]:
            raise SystemExit(f"Sure {n}: {len(rows)} ayet geldi, {AYAH_COUNTS[n - 1]} bekleniyordu. Dosya yazılmadı.")
        surahs.append({
            "number": n,
            "ayahs": [
                {"numberInSurah": int(r["aya"]), "text": r["translation"], "footnotes": r.get("footnotes") or ""}
                for r in rows
            ],
        })
        print(f"  sure {n}/114", end="\r")
        time.sleep(0.15)  # kaynağa yük bindirme
    TRANSLATIONS_DIR.mkdir(parents=True, exist_ok=True)
    out = TRANSLATIONS_DIR / f"{key}.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"data": {"edition": edition, "surahs": surahs}}, f, ensure_ascii=False)
    print(f"\n  yazıldı: {out}")


if __name__ == "__main__":
    names = sys.argv[1:] or list(ALL_KEYS)
    for name in names:
        if name not in ALL_KEYS:
            raise SystemExit(f"Bilinmeyen kaynak: {name} (seçenekler: {', '.join(ALL_KEYS)})")
        fetch(name)
