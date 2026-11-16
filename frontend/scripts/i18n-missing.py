#!/usr/bin/env python3
"""tt('…') çağrılarındaki metinlerden en.js / ar.js sözlüğünde karşılığı olmayanları listeler.
Kullanım: python3 scripts/i18n-missing.py [en|ar] [--json]   (frontend klasöründen)"""
import json, re, sys
from pathlib import Path
SRC = Path(__file__).resolve().parent.parent / "src"
lang = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] in ("en", "ar") else "ar"
CALL = re.compile(r"""\btt\(\s*(['"])((?:\\.|(?!\1).)+)\1\s*\)""")
KEY = re.compile(r"""^\s*(['"])((?:\\.|(?!\1).)+)\1\s*:""", re.M)
unq = lambda s: s.replace("\\'", "'").replace('\\"', '"')
have = {unq(m.group(2)) for m in KEY.finditer((SRC / "i18n" / f"{lang}.js").read_text(encoding="utf-8"))}
used = {}
for f in list(SRC.rglob("*.js")) + list(SRC.rglob("*.jsx")):
    if "i18n" in f.parts:
        continue
    for m in CALL.finditer(f.read_text(encoding="utf-8", errors="ignore")):
        used.setdefault(unq(m.group(2)), str(f.relative_to(SRC)))
missing = sorted(k for k in used if k not in have)
if "--json" in sys.argv:
    print(json.dumps(missing, ensure_ascii=False))
else:
    for k in missing:
        print(f"{used[k]}\t{k}")
    print(f"\n{lang}: {len(missing)} eksik / {len(used)} kullanılan", file=sys.stderr)
