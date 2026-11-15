#!/usr/bin/env python3
"""Rehber arama doğruluğu: beklenen ayet ilk 5 sonuçta mı?  Kullanım: python tests/run_rehber_eval.py [-v]"""
import json, sys, types
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
for name, attrs in (("fastapi", {"APIRouter": object, "HTTPException": Exception}), ("pydantic", {"BaseModel": object})):
    try:
        __import__(name)
    except ImportError:  # yalnız arama dizini denenecek; web çatısı gerekmez
        m = types.ModuleType(name)
        for k, v in attrs.items():
            setattr(m, k, v)
        sys.modules[name] = m
import rehber  # noqa: E402

rehber.INDEX.build()
items = json.load(open(ROOT / "tests" / "rehber_eval.json", encoding="utf-8"))["items"]
hit = 0
for it in items:
    got = [f"{d['surah']}:{d['ayah']}" for _, _, d in rehber.INDEX.search(it["q"], 5)]
    ok = any(a in got for a in it["a"])
    hit += ok
    if not ok or "-v" in sys.argv:
        print(("✓" if ok else "✗"), it["q"], "→", got[:5], "| beklenen", it["a"])
print(f"\nİlk 5'te isabet: {hit}/{len(items)} (%{round(100 * hit / len(items))})")
sys.exit(0 if hit / len(items) >= 0.8 else 1)
