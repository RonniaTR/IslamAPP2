#!/usr/bin/env bash
# scripts/build-release.sh
# ─────────────────────────────────────────────────────────────
# Play Store için imzalı AAB üretir.
#
#   ./scripts/build-release.sh            # AAB (Play'e yüklenecek)
#   ./scripts/build-release.sh apk        # APK (cihazda elle test için)
#
# Ön koşullar:
#   • Android SDK + JDK 17
#   • android/keystore.properties dolu (bkz. keystore.properties.example)
# ─────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND="$ROOT/frontend"
ASSETS="$ROOT/android/app/src/main/assets"
FORMAT="${1:-aab}"

step() { printf '\n\033[1;36m▶ %s\033[0m\n' "$1"; }

step "1/5 · Çeviri bütünlüğü denetimi"
( cd "$FRONTEND" && npm run check:i18n )

step "2/5 · Web derlemesi"
( cd "$FRONTEND" && env CI=false GENERATE_SOURCEMAP=false npm run build )

step "3/5 · Derleme çıktısı Android assets'e kopyalanıyor"
# error.html / offline.html Android'e ait; korunur
mkdir -p "$ASSETS"
find "$ASSETS" -mindepth 1 -maxdepth 1 \
  ! -name 'error.html' ! -name 'offline.html' -exec rm -rf {} +
cp -r "$FRONTEND/build/." "$ASSETS/"
test -f "$ASSETS/index.html" || { echo "HATA: assets/index.html yok"; exit 1; }
echo "   assets hazır ($(du -sh "$ASSETS" | cut -f1))"

step "4/5 · İmzalama yapılandırması kontrol ediliyor"
if [ ! -f "$ROOT/android/keystore.properties" ]; then
  cat <<'MSG'
   ⚠ android/keystore.properties bulunamadı — İMZASIZ derleme yapılacak.
     Play Store'a yükleyebilmek için:
       cp android/keystore.properties.example android/keystore.properties
     ve dosyayı doldurun (keystore oluşturma komutu örnekte yazılı).
MSG
else
  echo "   keystore.properties bulundu → yayın imzası kullanılacak"
fi

step "5/5 · Android paketi derleniyor ($FORMAT)"
cd "$ROOT/android"
if [ "$FORMAT" = "apk" ]; then
  ./gradlew --no-daemon assembleRelease
  OUT="$ROOT/android/app/build/outputs/apk/release"
else
  ./gradlew --no-daemon bundleRelease
  OUT="$ROOT/android/app/build/outputs/bundle/release"
fi

printf '\n\033[1;32m✅ Tamamlandı\033[0m\n'
ls -lh "$OUT" 2>/dev/null || true
cat <<'NEXT'

Sonraki adımlar:
  1. Play Console > Uygulama oluştur
  2. Üretim > Yeni sürüm > yukarıdaki .aab dosyasını yükle
  3. Mağaza kaydı metinleri: docs/play-store/ klasöründe (TR/EN/AR)
  4. Gizlilik politikası URL'si: PRIVACY.md'yi yayınlayıp adresini gir
  5. Veri güvenliği formu: docs/play-store/data-safety.md rehberine bak
NEXT
