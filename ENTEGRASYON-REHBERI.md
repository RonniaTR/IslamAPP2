# 📦 Entegrasyon Rehberi — Modülleri Kendi Uygulamana Taşıma

Bu rehber, bu oturumda geliştirdiğimiz tüm bölümleri **kendi React uygulamana**
nasıl taşıyacağını anlatır. Her modül için: **hangi dosyaları alacağın**,
**hangi paketlerin gerektiği**, **rota ve menü bağlantısı** ve **bağımlılıklar**
tek tek listelenmiştir.

Tüm kod `frontend/src/` altındadır. Yollar buna göre verilmiştir.

---

## 0) ÖN KOŞULLAR — Her modülün ihtiyaç duyduğu ortak zemin

### 0.1 NPM paketleri
```bash
npm install framer-motion@^12 lucide-react@^0.294 react-router-dom@^6 idb@^8 axios@^1 --legacy-peer-deps
```
> React 19 kullanıyoruz; `--legacy-peer-deps` peer uyarılarını geçmek içindir.
> Tailwind CSS sınıfları kullanılır — projende Tailwind kurulu olmalı.

### 0.2 Contexts (tema + kullanıcı) — ZORUNLU
Neredeyse tüm sayfalar iki context'e dayanır. Kendi uygulamanda bunlar varsa,
**aynı alan adlarını** sağlaman yeter; yoksa bizimkileri al.

- **`contexts/ThemeContext.js`** → `useTheme()` bir `theme` nesnesi döndürür.
  Kullanılan alanlar (kendi temanı kullanacaksan bu anahtarları karşıla):
  ```
  theme.bg, theme.surface, theme.surfaceLight, theme.gold, theme.goldLight,
  theme.textPrimary, theme.textSecondary, theme.cardBg, theme.cardBorder,
  theme.inputBg
  ```
- **`contexts/AuthContext.js`** → `useAuth()` bir `user` döndürür (`user.name`,
  `user.email`). XP kayıtları misafir için localStorage'da guest-id üretir,
  yani kullanıcı olmadan da çalışır.

### 0.3 Ortak servisler ve kancalar — ÇOĞU MODÜL İÇİN ZORUNLU
- **`services/gamification.js`** → `awardXPOnce(user, key, type, {points, details})`
  ve `getCachedStats()`, `subscribeStats()`. Puan/XP sistemi.
  Backend'e `/gamification/activity` ve `/gamification/leaderboard` çağırır;
  backend yoksa sessizce localStorage'a düşer (uygulama kırılmaz).
- **`hooks/useShared.js`** → `useTTS()` (sesli okuma — backend `/tts` veya
  tarayıcı Web Speech), `shareOrCopy(title, text)` (paylaş/kopyala).
- **`api.js`** → axios örneği. Kendi `baseURL`'ini ayarla (bizde varsayılan
  Render backend). Backend'in yoksa API çağrıları hataya düşer ama modüllerin
  çoğu (Nur Yolu, Hazine, kıssalar, esma) **tamamen istemci tarafıdır**, backend
  gerektirmez.

### 0.4 Çeviri katmanı (opsiyonel ama tavsiye edilir)
- **`i18n/index.js`** + **`i18n/en.js`** → `useTx()` kancası. `tt('Türkçe metin')`
  dil TR ise metni aynen, EN ise sözlükten döndürür.
- **Almazsan:** Sayfalardaki `const tt = useTx();` satırını sil ve `tt('X')`
  çağrılarını sadece `'X'` yap (ya da basit bir `const tt = (s) => s;` stub'ı koy).
- `i18n/index.js`, `contexts/LangContext.js`'e (dil durumu) dayanır. LangContext
  yoksa `useTx`'i `() => (s)=>s` olacak şekilde sadeleştir.

### 0.5 CSS — ZORUNLU (okuma/mushaf tipografisi)
`index.css` dosyasının **sonundaki** şu blokları kendi global CSS'ine ekle:
- `.article-body` ve drop-cap kuralları (kitap tipografisi — makale/kıssa)
- `.mushaf-text`, `.mushaf-ayah`, `.mushaf-medallion` (Mushaf görünümü)
- `@keyframes nightTwinkle` (yıldız parıltısı — Gece Modu + Nur Yolu)
Ara: `grep -n "article-body\|mushaf-text\|nightTwinkle" frontend/src/index.css`

### 0.6 Arapça font (tavsiye)
Arapça metinler `'Amiri'` / `'Scheherazade New'` serifiyle dizilir.
`index.html`'e Google Fonts ekle veya kendi Amiri fontunu tanımla.

---

## 1) 🛤️ NUR YOLU (omurga) — `/yol`

Uygulamanın kişisel günlük plan motoru. **Backend gerektirmez.**

**Al:**
- `services/pathEngine.js` — motor (profil, günlük plan, mertebe, rozet, günlük,
  haftalık tema, günün duası/sözü). **Kalp burasıdır.**
- `pages/PathPage.js` — Zümrüt Gece temalı arayüz (Bugün/Hazine/Harita/Günlük).
- `pages/games/Confetti.jsx` — kutlama konfetisi (küçük, bağımsız).

**Bağımlılıklar:** ThemeContext, AuthContext, gamification, i18n (opsiyonel),
Confetti. Hazine sekmesi için `HazineCards` (bkz. Modül 5) — istemezsen Hazine
sekmesini PathPage'den çıkar.

**Rota (App.js):**
```jsx
const PathPage = lazy(() => import('./pages/PathPage'));
<Route path="/yol" element={<PathPage />} />
```
**Menü:** Alt menüye `{ path: '/yol', icon: Route, label: 'Yol' }` ekle
(lucide `Route` ikonu).

---

## 2) 📿 EZBER ASİSTANI — `/hifz`

Aralıklı tekrar (spaced repetition) ile sure ezberi.

**Al:**
- `services/hifzEngine.js` — SR motoru + 12 surelik rota.
- `pages/HifzPage.js` — arayüz.
- `data/kelimeMeal.js` — kelime kelime meal (ezberde anlam desteği).

**Bağımlılıklar:** ThemeContext, AuthContext, gamification, Confetti, `api`
(ayet metnini `/quran/surah/:no`'dan çeker — **backend gerekir** ya da kendi
ayet kaynağını `loadSurah` içine bağla).

**Rota:** `/hifz` · **Keşfet kartı** veya menü bağlantısı.

---

## 3) 💛 NUR HAZİNESİ — `/hazine` ve `/hazine/:section`

Dualar · Tesbihat · Tarih (SVG'li) · Kur'an Mucizeleri (SVG'li) · Esmaül Hüsna.
**Tamamen istemci tarafı, backend gerektirmez.**

**Al:**
- `data/nurHazine.js` — dualar, tesbihat setleri, tarih dönemleri, mucizeler,
  hazine kart tanımları.
- `data/esmaData.js` — 99 Esmaül Hüsna (hat + anlam + tefekkür).
- `pages/HazinePage.js` — tüm bölümler + elle çizilmiş SVG infografikler +
  MiniQuiz (bitmeyen sınav motoru) + `HazineCards` (dışa aktarılan kart bileşeni).

**Bağımlılıklar:** ThemeContext, AuthContext, gamification, Confetti, i18n (ops.).

**Rota:**
```jsx
const HazinePage = lazy(() => import('./pages/HazinePage'));
<Route path="/hazine" element={<HazinePage />} />
<Route path="/hazine/:section" element={<HazinePage />} />
```

---

## 4) 🕯️ İBRETLİK KISSALAR — `/stories`

Katmanlı (duraklı) kıssalar + hikmet cevherleri + "Hayata Taşı" + Gece Modu girişi.

**Al:**
- `data/stories.js` — 19 kıssa + `STORY_CATEGORIES` + `STORY_GEMS` + `STORY_APPLY`.
- `pages/StoriesPage.js` — okuma akışı, checkpoint, cevher animasyonu.

**Bağımlılıklar:** ThemeContext, AuthContext, gamification, useTTS, i18n (ops.),
Confetti, ReadingSettings (Modül 8 — okuma teması). `night_preset` üzerinden
Gece Modu'na (Modül 6) bağlanır (opsiyonel).

**Rota:** `/stories`

---

## 5) 📖 KUR'AN OKUMA GELİŞTİRMELERİ — Mushaf + Kelime Meal + Kaldığın Yer

Mevcut sure detay sayfana eklenen katmanlar.

**Al:**
- `components/MushafReader.jsx` — tam ekran, kesintisiz akan Arapça mushaf
  görünümü (sure biterse sonrakine geçer, ayete dokununca meal, tam ekran,
  yazı boyutu, ekranı açık tut).
- `data/kelimeMeal.js` — kelime kelime açıklamalı meal.
- `pages/SurahDetail.js` içinden ilgili parçalar: Meal/Mushaf görünüm seçici,
  "Kelime Meal" sekmesi, `saveLastRead()` (kaldığın yer kaydı).
- `pages/QuranList.js` — "Kaldığınız yer / Devam et" kartı.

**Bağımlılıklar:** ThemeContext, ReadingSettings (Modül 8), `api` (ayet verisi —
**backend gerekir**), idb (tefsir önbelleği — SurahDetail'de).

> Not: SurahDetail ve QuranList senin mevcut sayfalarınla çakışabilir; bu ikisini
> **komple almak yerine** yalnız yeni parçaları (Mushaf düğmesi, Kelime Meal
> sekmesi, Devam Et kartı) kendi sayfalarına yamalaman daha temiz olur.

---

## 6) 🌙 GECE MODU — `/night`

Ney + sesli kıssa/makale okuma + uyku zamanlayıcısı + kapanış duası.

**Al:**
- `pages/NightPage.js` — arayüz + akış.
- `services/ambient.js` — Web Audio ile ney/atmosfer sentezi (telifsiz).

**Bağımlılıklar:** useTTS, ambient, `data/stories.js` + `data/articles.js`
(okunacak içerik), i18n (ops.). `@keyframes nightTwinkle` CSS'i gerekir.

**Rota:** `/night`

---

## 7) 📚 MAKALE KÜTÜPHANESİ — `/library`

Raf raf, kaynak referanslı makaleler + kitap tipografili okuyucu.

**Al:**
- `data/articles.js` — raflar + makaleler.
- `pages/LibraryPage.js` — raf görünümü + okuyucu.

**Bağımlılıklar:** ThemeContext, AuthContext, gamification, useTTS, shareOrCopy,
ReadingSettings (Modül 8), i18n (ops.). `.article-body` CSS'i gerekir.

**Rota:** `/library`

---

## 8) 🎨 OKUMA AYARLARI (paylaşılan altyapı) — Modül 4,5,6,7'nin ortak zemini

7 okuma teması + yazı boyutu + Arapça ayrı boyut. **Taşınabilir, bağımsız.**

**Al:**
- `services/readingSettings.js` — durum + `useReadingSettings()` kancası.
- `components/ReadingSettingsSheet.jsx` — alt sayfa (bottom-sheet) arayüzü.

**Bağımlılıklar:** yalnızca React + framer-motion + lucide + i18n (ops.).
Mushaf, Makale ve Kıssa okumaları bu ayarı paylaşır.

---

## 9) 🔤 ELİF BA — `/elifba`

Sıfırdan Kur'an okuma + harekeler + tecvide giriş.

**Al:**
- `data/elifba.js` — 28 harf, harekeler, tenvin, tecvid, kelimeler, dersler.
- `pages/ElifBaPage.js` — arayüz + alıştırma quizi.

**Bağımlılıklar:** ThemeContext, AuthContext, gamification. Arapça sesler için
tarayıcı Web Speech (`ar-SA`).

**Rota:** `/elifba`

---

## 10) 📔 AMEL DEFTERİ — `/journal`

Günün muhasebesi (3 soru, ruh hâli, haftalık grafik, otomatik özet).

**Al:** `pages/JournalPage.js`
**Bağımlılıklar:** ThemeContext, AuthContext, gamification, i18n (ops.).
**Rota:** `/journal`

---

## 11) 🎮 OYUN MERKEZİ — `/games` (en büyük modül)

14 oyun modu, lig, görevler, koleksiyon, macera haritası.

**Al:**
- `pages/GamesPage.js` — Oyun Merkezi hub'ı.
- `pages/games/` **klasörünün tamamı** — QuizCore (paylaşılan motor),
  GameLobby, ResultScreen, FeedbackOverlay, Confetti + tüm oyun modları
  (RapidQuiz, ClassicTest, SurvivalGame, AIDuel, BossBattle, OrderGame,
  WordGame, MatchGame, WheelGame, VoiceGuess, WhichSurah, StoryMode,
  AdventureMode).
- `data/` soru havuzu: `questionBank.js`, `quizQuestionsBig.json`,
  `questionBankExtra.js`, `generatedQuestions.js`, `gameData.js`,
  `surahData.js`, `surahHints.js`, `adventureData.js`, `storyData.js`.
- `services/sfx.js` — oyun ses efektleri (Web Audio, telifsiz).
- `services/ambient.js` — atmosfer sesi.

**Bağımlılıklar:** ThemeContext, AuthContext, gamification, useTTS, sfx,
ambient. Bazı modlar `api` ile ayet sesi/verisi çeker (**backend tavsiye**).

**Rota:** `/games` · **Menü:** `{ path: '/games', icon: Gamepad2, label: 'Oyun' }`

---

## 12) EK KEŞFET/ANA SAYFA BAĞLANTILARI

- `pages/DiscoverPage.js` — Keşfet: "Yolculuğun" bölümü (Nur Yolu, Ezber,
  Hazine kartları) + diğer modül kartları. Kendi Keşfet'ine bu kartları ekle.
- `pages/Dashboard.js` — Ana sayfaya `NurYoluCard` özet kartı (dosya içindeki
  bileşen). İstersen bu bileşeni kopyalayıp kendi ana sayfana koy.
- `components/Layout.js` — alt menü sekmeleri (`/yol` dahil). Kendi menüne
  bakarak sekme ekle.

---

## 🔑 localStorage ANAHTARLARI (çakışma kontrolü için)

Modüller şu anahtarları kullanır — kendi uygulamanda aynı adlar varsa dikkat:
```
Nur Yolu:  nur_profile, nur_plan_<tarih>, nur_history, nur_events,
           nur_stage_seen, nur_badges_seen, nur_fulldays_logged
Ezber:     hifz_state, hifz_log_<tarih>
Hazine:    dua_read, tesbihat_log_<tarih>, tarih_read, mucize_read, esma_read
Kıssa:     story_read, story_applied, gc_gems
Makale:    lib_read, lib_favs
Okuma:     reading_settings, mushaf_font, mushaf_awake
Kur'an:    quran_last
Oyun/XP:   game_meta, gc_daily_<tarih>, gc_totals, gc_badges, sfx_enabled,
           ambient_volume, ambient_track, voice_narration
Dil/Tema:  app_lang, app_theme
```

---

## 🌐 BACKEND NOTLARI

Aşağıdaki modüller **backend olmadan tam çalışır** (hepsi istemci tarafı veri):
Nur Yolu, Nur Hazinesi, Kıssalar, Esmaül Hüsna, Elif Ba, Okuma Ayarları,
Gece Modu (ney sentez), Makaleler.

**Backend gereken/öneren yerler:**
- Kur'an ayet metni/sesi: `/quran/surah/:no` (Ezber, Mushaf, bazı oyunlar).
  Kendi ayet API'ni bağlayabilirsin (ör. api.alquran.cloud) — `loadSurah`/
  `api.get` çağrılarını değiştir.
- Sesli okuma (doğal Türkçe): `/tts` (yoksa tarayıcı Web Speech'e düşer).
- XP kalıcılığı ve liderlik: `/gamification/*` (yoksa localStorage'da tutulur).

Backend kodu bu repoda `backend/server.py` (FastAPI). İstersen onu da al.

---

## ✅ HIZLI BAŞLANGIÇ — Minimum "Nur Yolu + Hazine" paketi

En hızlı değerli paket (backend'siz, tam çalışır):
1. Ortak zemin: ThemeContext, AuthContext, gamification.js, useShared.js,
   i18n/ (ops.), index.css blokları.
2. `services/pathEngine.js`, `pages/PathPage.js`
3. `data/nurHazine.js`, `data/esmaData.js`, `pages/HazinePage.js`
4. `pages/games/Confetti.jsx`
5. App.js'e `/yol`, `/hazine`, `/hazine/:section` rotaları; menüye "Yol".

Bu kadarı bile uygulamana kişisel yol motoru + dualar + tesbihat + 99 Esma +
tarih + mucizeler + bitmeyen sınavları kazandırır.

---

*Tüm dosyalar `claude/app-understanding-ihz5me` dalındadır. ZIP indirmek için:*
*GitHub → Code → Download ZIP (dalı seçtikten sonra) ya da*
*`git clone -b claude/app-understanding-ihz5me <repo-url>`*
