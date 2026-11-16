#!/usr/bin/env python3
"""src/index.js'ten başlayarak hiçbir yerden içe aktarılmayan dosyaları listeler (ölü kod).
Kullanım: python3 scripts/find-dead.py   (frontend klasöründen). Çıkış kodu her zaman 0; liste bilgi içindir."""
import re
from pathlib import Path
SRC = Path(__file__).resolve().parent.parent / "src"
IMP = re.compile(r"""(?:from\s+|import\s*\(\s*|require\s*\(\s*|import\s+)(['"])(\.{1,2}/[^'"]+)\1""")
EXT = ["", ".js", ".jsx", ".json", ".css", "/index.js", "/index.jsx"]
def resolve(base, spec):
    for e in EXT:
        p = (base.parent / (spec + e)).resolve()
        if p.is_file():
            return p
    return None
seen, todo = set(), [SRC / "index.js"]
while todo:
    f = todo.pop()
    if f in seen:
        continue
    seen.add(f)
    if f.suffix not in (".js", ".jsx"):
        continue
    for m in IMP.finditer(f.read_text(encoding="utf-8", errors="ignore")):
        t = resolve(f, m.group(2))
        if t and t not in seen:
            todo.append(t)
dead = sorted(p for p in SRC.rglob("*") if p.is_file() and p.suffix in (".js", ".jsx", ".json", ".css") and p not in seen
              and ".test." not in p.name and p.name not in ("setupTests.js", "icerik.json"))
for p in dead:
    print(f"{p.stat().st_size // 1024:5d} KB  {p.relative_to(SRC)}")
print(f"\n{len(dead)} ölü dosya, {sum(p.stat().st_size for p in dead) // 1024} KB")
