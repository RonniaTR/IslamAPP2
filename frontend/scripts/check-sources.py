#!/usr/bin/env python3
"""İÇERİK HATTI — kaynağı yazılmamış içerik derlemeye giremez.
  1. src/data altındaki her dosya src/data/icerik.json'da kayıtlı olmalı.
  2. Kaydın 'kaynak' alanı sources.json'da bir anahtar, 'ozgun' ya da 'uretilmis' olmalı.
  3. public/packs/mushaf.json yalnız REACT_APP_QURAN_PUBLIC=true iken bulunabilir (Kurul onayı).
Bunlar HATA'dır (çıkış kodu 1). 'belirsiz' ve 'denetlenmedi' kayıtlar UYARI olarak listelenir;
--strict ile onlar da hata sayılır (yayın öncesi hedef).  Kullanım: python3 scripts/check-sources.py [--strict]"""
import json, os, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data"
man = json.loads((DATA / "icerik.json").read_text(encoding="utf-8"))["dosyalar"]
src = json.loads((DATA / "sources.json").read_text(encoding="utf-8"))
errors, warns = [], []
for f in sorted(p.name for p in DATA.iterdir() if p.is_file() and p.name != "icerik.json"):
    if f not in man:
        errors.append(f"{f}: icerik.json'da kayıtlı değil (kaynağı yazılmamış içerik)")
for f, e in man.items():
    if not (DATA / f).exists():
        errors.append(f"{f}: icerik.json'da var ama dosya yok")
    if e.get("kaynak") not in src and e.get("kaynak") not in ("ozgun", "uretilmis"):
        errors.append(f"{f}: kaynak '{e.get('kaynak')}' sources.json'da yok")
    if e.get("durum") != "tamam":
        warns.append(f"{f}: {e.get('durum')}" + (f" — {e['not']}" if e.get("not") else ""))
if (ROOT / "public" / "packs" / "mushaf.json").exists() and os.environ.get("REACT_APP_QURAN_PUBLIC") != "true":
    errors.append("public/packs/mushaf.json var ama REACT_APP_QURAN_PUBLIC=true değil (Kurul onayı olmadan yayımlanamaz)")
for w in warns:
    print("UYARI ", w)
for e in errors:
    print("HATA  ", e)
strict = "--strict" in sys.argv
print(f"\nİçerik hattı: {len(errors)} hata, {len(warns)} uyarı" + (" (strict: uyarılar da hata)" if strict else ""))
sys.exit(1 if errors or (strict and warns) else 0)
