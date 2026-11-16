#!/usr/bin/env bash
# KALİTE KAPISI — commit öncesi tek komut:  npm run verify   (frontend klasöründen)
# Sırayla: kod denetimi · çeviri eksikleri · içerik hattı · ölü dosya · özellik kaydı/rota · Rehber deneme seti.
# Biri başarısızsa durur. Otomatik çalıştırmak için bir kez:  git config core.hooksPath .githooks
set -e
cd "$(dirname "$0")/.."
step() { printf '\n▶ %s\n' "$1"; }
step "Kod denetimi (eslint + kırık import)";  npm run -s check
step "Çeviri eksikleri (en, ar)"
for l in en ar; do
  n=$(python3 scripts/i18n-missing.py $l --json | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
  echo "$l: $n eksik"; [ "$n" = "0" ] || { python3 scripts/i18n-missing.py $l; exit 1; }
done
step "İçerik hattı (kaynak kaydı)";            python3 scripts/check-sources.py
step "Ölü dosyalar";                            python3 scripts/find-dead.py | tail -1
step "Özellik kaydı ↔ rotalar";                 python3 scripts/check-routes.py
step "Çevrimdışı paketler";                     test -f public/packs/turkish_rwwad.json && test -f public/packs/turkish_mokhtasar.json && echo "tamam" || { echo "paket yok: python3 scripts/build-packs.py"; exit 1; }
step "Rehber deneme seti";                      python3 ../backend/tests/run_rehber_eval.py | tail -3
printf '\n✔ Kalite kapısı geçildi\n'
