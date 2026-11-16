#!/usr/bin/env python3
"""Çevrimdışı paketleri üretir: backend/data → frontend/public/packs/*.json

Paketler uygulamayla birlikte yayımlanır (aynı alan adı); servis çalışanı ve IndexedDB sayesinde bağlantı
olmadan da okunur. Metinlere DOKUNULMAZ; yalnız kap biçimi sadeleşir. Sürüm ve kaynak pakette taşınır.

Kullanım (depo kökünden):  python3 frontend/scripts/build-packs.py [--mushaf]
  --mushaf : Arapça Mushaf paketini de üretir. Kurul onayı gelmeden ÜRETME — paket herkese açık bir dosyadır.
"""
import json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "backend" / "data"
OUT = ROOT / "frontend" / "public" / "packs"
OUT.mkdir(parents=True, exist_ok=True)
index = {}

def dump(name, obj):
    p = OUT / f"{name}.json"
    p.write_text(json.dumps(obj, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    index[name] = {"bytes": p.stat().st_size, "version": (obj.get("edition") or {}).get("version", ""),
                   "name": (obj.get("edition") or {}).get("name", name)}
    print(f"{name}: {p.stat().st_size // 1024} KB")

for key in ("turkish_rwwad", "english_rwwad", "turkish_mokhtasar"):
    src = DATA / "translations" / f"{key}.json"
    if not src.exists():
        print(f"ATLANDI {key}: önce backend/scripts/fetch_quranenc.py çalıştır"); continue
    d = json.loads(src.read_text(encoding="utf-8"))["data"]
    # s[sure-1] = [[metin, dipnot], …]  — ayet sırası korunur
    dump(key, {"edition": d["edition"], "s": [[[a["text"], a.get("footnotes", "")] for a in s["ayahs"]] for s in d["surahs"]]})

if "--mushaf" in sys.argv:
    d = json.loads((DATA / "quran_arabic.json").read_text(encoding="utf-8"))["data"]
    pages, names = {}, {}
    for s in d["surahs"]:
        names[s["number"]] = s["name"]
        for a in s["ayahs"]:
            pages.setdefault(str(a["page"]), []).append([s["number"], a["numberInSurah"], a["juz"], 1 if a.get("sajda") else 0, a["text"]])
    dump("mushaf", {"edition": {**d["edition"], "version": "tanzil-uthmani"}, "names": names, "pages": pages})
else:
    old = OUT / "mushaf.json"
    if old.exists():
        print("UYARI: public/packs/mushaf.json duruyor; Kurul onayı yoksa sil.")

(OUT / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
