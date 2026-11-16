#!/usr/bin/env python3
"""Özellik kaydındaki (features/registry.js) her rotanın App.js'te karşılığı olduğunu denetler."""
import re, sys
from pathlib import Path
SRC = Path(__file__).resolve().parent.parent / "src"
routes = set(re.findall(r'path="(/[^":*]*)', (SRC / "App.js").read_text(encoding="utf-8")))
bad = [r for r in re.findall(r"route: '([^']+)'", (SRC / "features" / "registry.js").read_text(encoding="utf-8"))
       if r.split("?")[0] not in routes and not any(r.startswith(x.rstrip("/") + "/") for x in routes)]
for r in bad:
    print("HATA  kayıtta var, rota yok:", r)
print(f"{len(bad)} kırık rota")
sys.exit(1 if bad else 0)
