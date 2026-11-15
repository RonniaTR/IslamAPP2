# AGENTS.md — IslamAPP2

Bu dosya, proje üzerinde çalışan tüm yapay zekâ ajanları (Claude, Antigravity/Gemini,
Copilot vb.) ve insan geliştiriciler için ortak referanstır. Yeni bir oturuma
başlarken **önce bunu oku**.

---

## 1. Proje nedir

İslami yaşam asistanı. Üç ayrı istemci + bir backend:

| Katman | Teknoloji | Konum |
|---|---|---|
| Web (PWA) | React 19 + CRA + TailwindCSS + Capacitor | `frontend/` |
| Mobil | React Native 0.83 + Expo 55 | `mobile/` |
| Backend | Python 3.12 + FastAPI + MongoDB (motor) | `backend/` |
| Serverless | Firebase Cloud Functions (Node 18) | `functions/` |

Firebase projesi: `islamapp-5942a` · Capacitor appId: `com.ronniatr.islamapp`

Tasarım dili: koyu yeşil `#0A1F14`, altın `#D4AF37`, krem `#F5F5DC`. Mobile-first, 430px.

---

## 2. Dizin haritası

```
backend/          FastAPI. server.py (~4150 satır) ana giriş.
                  phase2 / phase3_* / phase4_core = geliştirme sırası, mimari değil.
                  data/ → 12 MB statik içerik (hadis, Kuran, quiz).
frontend/src/
  pages/          50 sayfa (~13.6k satır). En büyükleri GamesPage, HazinePage, PathPage.
  components/     discover/, deen/, donus/, ui/ alt grupları.
  contexts/       Auth, Theme, Lang, AppMode, Premium.
  data/           Statik içerik JS modülleri (~42k satır toplam frontend).
  i18n/           tr / en / ar.
  services/       pathEngine vb.
  api.js          Merkezi axios örneği.
mobile/src/       screens/, services/, contexts/, navigation/.
functions/        index.js (120 satır).
memory/           PRD.md, ROADMAP.md, CHANGELOG.md — ESKİ, bkz. §7.
tests/            Pytest. Kökteki *_test.py dosyaları buraya taşınacak.
```

---

## 3. Komutlar

```bash
# Backend (lokal)
cd backend && uvicorn server:app --reload --port 8001

# Web
cd frontend && npm start          # :3000, proxy → localhost:8001
cd frontend && npm run build      # → frontend/build

# Mobil
cd mobile && npm start            # Expo

# Testler
pytest tests/

# Deploy — SADECE İNSAN veya yetkili ajan çalıştırır
firebase deploy --only hosting    # predeploy: frontend build alır
firebase deploy --only functions
# Backend Render üzerinden otomatik deploy olur (render.yaml).
```

---

## 4. Ortam değişkenleri

**Backend** (Render'da tanımlı, repoda yok):
`MONGO_URL`, `DB_NAME`, `COOKIE_SECURE`, `ALLOWED_ORIGINS`,
`RENDER_EXTERNAL_URL`, `GROQ_API_KEY`, `GEMINI_API_KEY`

**Frontend:** `REACT_APP_BACKEND_URL`

Firebase `apiKey` istemci kodunda açıktır, bu normaldir — gizli anahtar değildir.
Erişim kontrolü `firestore.rules` ile yapılır.

---

## 5. Dokunulmayacaklar

- `frontend/node_modules/`, `mobile/node_modules/`, `frontend/build/`, `.firebase/`
- `frontend/android/app/src/main/assets/public/` — Capacitor'ün ürettiği build çıktısı,
  elle düzenlenmez.
- `IslamAPP2-claude-app-understanding-ihz5me (1)/` — 27 MB'lık eski kopya.
  **Kaynak olarak kullanma, buraya yazma.** Temizlenmeyi bekliyor.
- `backup_v3/`, `test_result.md` — tarihsel kayıt.
- Gizli anahtar, `.env` içeriği veya kullanıcı verisi asla commit edilmez.

---

## 6. Bilinen tuzaklar

1. **`mobile/package.json` → `web:deploy` yanlış.** `firebase deploy --only hosting`
   çağırıyor ama `firebase.json`'daki hosting kaynağı `frontend/build`. Yani mobil
   export'u değil, web build'ini yayına alır. Kullanma.
2. ~~`api.js` varsayılan backend adresi hosting adresi.~~ **Düzeltildi (2026-11-12).**
   Artık üretimde `https://islamapp2.onrender.com`, geliştirmede boş (proxy devrede).
   `REACT_APP_BACKEND_URL` her ikisini de ezer. Depoda `.env` dosyası yok ve
   `.gitignore` `*.env*` kalıbını yoksaydığı için varsayılan bilerek koda gömüldü.
   **Backend adresi değişirse `frontend/src/api.js` güncellenmeli.**

7. **Oturum çerezi cross-site.** Web `*.web.app`, backend `onrender.com` üzerinde,
   yani ayrı sitelerdir. Çerez `SameSite=Lax` olursa tarayıcı onu API isteklerine
   eklemez ve giriş yapmış kullanıcı 401 alır. `COOKIE_SAMESITE` değişkeni eklendi
   (varsayılan: `COOKIE_SECURE` açıkken `none`). Render ortamında `COOKIE_SAMESITE=none`
   tanımlı olmalı. `SameSite=None` yalnızca `Secure` çerezle çalışır.
8. **Gün anahtarı yerel olmalı.** `toISOString().slice(0, 10)` UTC verir; Türkiye'de gece
   00:00–03:00 arası "dün" olur. Gün anahtarı için `pathEngine.js`'teki `localKey()` kullanılır
   (`todayKey` artık onu çağırıyor). Kalan kullanımlar `docs/YENI_OZELLIKLER.md` 7.1'de.
9. **Kur'an içeriği Diyanet onayına tabi** (7549 sayılı Kanun). Kur'an metni, yazı tipi veya meal
   değiştiren her iş `docs/YENI_OZELLIKLER.md` 0.4'e bakar; onay gelene kadar `REACT_APP_QURAN_PUBLIC=false`.
3. **Sürüm uyumsuzluğu.** Kök `package.json` react-router-dom 7, `frontend/` 6
   kullanıyor. `frontend/` expo 54, `mobile/` expo 55. Kök `package.json` muhtemelen
   gereksiz.
4. **`requirements.txt` sürüm sabitlemiyor** (`>=`). Build'ler tekrarlanabilir değil.
5. **`firestore.rules` → `quiz_rooms` herkese açık yazılabilir** (`if true`).
   Düzeltilmeyi bekliyor.
6. **Git durumu kirli.** Depoda silinmiş görünen ama diskte duran dosyalar var.
   Büyük bir değişiklikten önce `git status` kontrol et.

---

10. **Mealler QuranEnc'ten gelir**, metne dokunulmaz. Çeviri anahtarları üç yerde aynı olmalı:
    `frontend/src/data/sources.json`, `mobile/src/services/quranService.js`, `backend/quran_translations.py`.
    Sunucu önbelleği `python backend/scripts/fetch_quranenc.py` ile üretilir.
11. **Yapay zekâ hiçbir gerçek kişinin ağzından konuşmaz.** "Sen …'sın" biçiminde âlim/hoca personası yazılmaz.
12. **Lint:** `cd frontend && npx eslint --no-eslintrc -c eslint.check.json --quiet --ext .js,.jsx src`
    (depoda ESLint ayarı yok; `npx eslint src` sessizce hata verir ve hiçbir şeyi denetlemez).
13. **Uygulama tamamen ücretsiz.** `usePremium` yeni kodda kullanılmaz; hiçbir özellik ödemeye bağlanmaz.

---

## 7. Dokümantasyon durumu

`memory/PRD.md` ve `memory/ROADMAP.md` **güncel değil**. React 18, Claude Sonnet 4.5
ve "Emergent LLM Key" yazıyor; gerçekte React 19 ve Groq + Gemini kullanılıyor.
Mimari bilgisi için bu dosyaya (AGENTS.md) güven, PRD'ye değil.

---

## 8. Çoklu ajan çalışma kuralları

Bu depoda birden fazla ajan çalışıyor. İş bölümü:

- **Claude** → kod düzenleme, refactor, dosya taşıma, analiz.
- **Antigravity / Gemini** → Firebase deploy, Google Cloud ve Gemini API entegrasyonu,
  konsol işleri.

Kurallar:

1. **Aynı anda iki ajan çalıştırılmaz.** Sıra sıra.
2. **Ajan değiştirmeden önce commit edilir.** Her ajanın değişikliği ayrı commit'te
   olsun ki geri alınabilsin.
3. Bir ajan deploy yapmadan önce, önceki ajanın değişikliklerinin commit edildiğini
   doğrular.
4. Büyük bir refactor'a başlamadan önce `git status` temiz olmalı.
5. Bu dosya değişirse ikinci ajana haber verilir.

---

## 9. Kod stili

- Türkçe arayüz metinleri `i18n/` üzerinden geçer, bileşen içine gömülmez.
- Yeni backend endpoint'leri `server.py`'ye eklenmez; uygun modüle konur
  (`server.py` zaten çok büyük, bölünmeyi bekliyor).
- Frontend'de yeni sayfa `pages/`, paylaşılan parça `components/ui/`.
- Sabit içerik `data/` altına, kod içine değil.

---

## 10. Yeni özellikler

Tema sistemi, Ayarlar v2, konum, bildirimler, yeni Mushaf, üç dil (TR/EN/AR), yeni oyunlar ve telif düzeltmeleri
fazlara ayrılmış şartname olarak `docs/YENI_OZELLIKLER.md` içinde. Kod yazmaya başlamadan önce o dosyayı oku;
**Faz 0 (güven ve telif) her şeyden önce gelir.**
