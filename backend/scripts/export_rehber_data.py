#!/usr/bin/env python3
"""Rehber'in arama sözlüklerini (durak kelimeler, kavram genişletme, temalar, eşikler) istemciye aktarır.
Tek kaynak backend/rehber.py'dir; cihazdaki çevrimdışı arama aynı veriyi kullanır.
Kullanım (depo kökünden): python3 backend/scripts/export_rehber_data.py"""
import json, sys, types
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
for name, attrs in (("fastapi", {"APIRouter": object, "HTTPException": Exception}), ("pydantic", {"BaseModel": object})):
    try:
        __import__(name)
    except ImportError:
        m = types.ModuleType(name)
        for k, v in attrs.items():
            setattr(m, k, v)
        sys.modules[name] = m
import rehber  # noqa: E402

out = ROOT.parent / "frontend" / "src" / "data" / "rehberData.json"
out.write_text(json.dumps({
    "_not": "ÜRETİLMİŞ DOSYA — elle düzenleme. Kaynak: backend/rehber.py · üret: python3 backend/scripts/export_rehber_data.py",
    "stop": sorted(rehber._STOP),
    "expand": rehber.EXPAND,
    "themes": [[list(k), [list(a) for a in v]] for k, v in rehber.THEMES],
    "minScore": rehber.MIN_SCORE, "minCover": rehber.MIN_COVER,
}, ensure_ascii=False, indent=1), encoding="utf-8")
print("yazıldı:", out)
