#!/usr/bin/env python3
"""Çeviri ekler. Girdi: JSON {"Türkçe metin": ["English", "العربية"]}. Var olan anahtara dokunmaz.
Kullanım: python3 scripts/i18n-add.py ceviri.json   (frontend klasöründen)"""
import json, re, sys
from pathlib import Path
I18N = Path(__file__).resolve().parent.parent / "src" / "i18n"
data = json.load(open(sys.argv[1], encoding="utf-8"))
KEY = re.compile(r"""^\s*(['"])((?:\\.|(?!\1).)+)\1\s*:""", re.M)
unq = lambda s: s.replace("\\'", "'").replace('\\"', '"')
for idx, name in ((0, "en"), (1, "ar")):
    p = I18N / f"{name}.js"
    s = p.read_text(encoding="utf-8")
    have = {unq(m.group(2)) for m in KEY.finditer(s)}
    lines = [f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v[idx], ensure_ascii=False)}," for k, v in data.items() if k not in have and v[idx]]
    if not lines:
        continue
    cut = s.rindex("};")
    s = s[:cut].rstrip() + "\n" + "\n".join(lines) + "\n" + s[cut:]
    p.write_text(s, encoding="utf-8")
    print(name, "+", len(lines))
