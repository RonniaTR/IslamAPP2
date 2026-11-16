# Geliştirme rehberi — yeni bir şey nasıl eklenir

Bu dosya, uygulamayı büyütürken her seferinde aynı yolu izlemek için. Önce `AGENTS.md`, sonra burası.

## 1. Yeni özellik = 4 adım

1. **Sayfayı yaz:** `frontend/src/pages/<Ad>Page.js`. Renkleri `useTheme()`'den al (`theme.bg`, `theme.surface`,
   `theme.textPrimary`, `theme.gold`…); koda sabit renk yazma. Metinleri `useTx()` ile sar: `tt('Türkçe metin')`.
2. **Rotayı ekle:** `frontend/src/App.js` — `lazy(() => import(...))` ve `<Route path="/…">`.
3. **Kayda ekle:** `frontend/src/features/registry.js` → `FEATURES` listesine **bir satır**. Böylece özellik
   "Tüm özellikler" sayfasında ve (`home: true` ise) ana ekran kısayollarında kendiliğinden görünür.
   Deneysel ise `flag` ver ve `FLAGS` içinde aç/kapat.
4. **Denetle:** `cd frontend && npm run check` — sözdizimi, kırık import yolu ve var olmayan export'u yakalar.
   0 hata olmadan commit etme.

## 2. Kurallar (kısa)

| Konu | Kural | Nerede |
|---|---|---|
| Kutsal metin | Kur'an, meal, tefsir her zaman **kâğıt kartta** (`#FBF8F0` zemin, `#1A1A1A` metin); temadan etkilenmez, üstünde efekt olmaz | `MushafPage.js`, `RehberPage.js` örnek |
| Yapay zekâ metni | Koyu kart + altın sol çizgi + "YAPAY ZEKÂ · KAYNAKLI" etiketi; kutsal metinle aynı kartta durmaz | `RehberPage.js` |
| Dış içerik | Önce `data/sources.json`'a yaz, sonra kullan; Lisanslar sayfası oradan beslenir | `LicensesPage.js` |
| Kur'an içeren sayfa | Rotayı `<QuranGate>` ile sar; kayıtta `quran: true` | `App.js` |
| İbadet | Namaz, zikir, dua, Kur'an okuma, ezber XP vermez | `pathEngine.js` |
| Gün anahtarı | `localKey()`; asla `toISOString().slice(0,10)` | `pathEngine.js` |
| Kişisel veri | Mektup, rahmet defteri, notlar cihazda kalır; sunucuya gitmez | — |
| Dil | "kaçırdın", "seri bozuldu" yok; davet dili | — |

## 3. Tema

- Temalar `contexts/ThemeContext.js` içinde. Yeni tema: `derive('dark' | 'light', {...})` ile 12 renk yazman yeter.
- Eski sayfalarda sabit kalan renkler var. Bir sayfayı temaya bağlarken: sabit `#0A1F14` → `theme.bg` ya da
  `var(--bg-primary)`; `#F5F5DC` → `theme.textPrimary`; kart zemini → `theme.surface`.
- Açık temalarda (Işıltı, Sevgi, Sükûn) eski sayfaların bir kısmında beyaz yazı kalmış olabilir; görürsen o sayfayı bağla.

## 4. Yapay zekâ (Rehber)

- Tek kapı: `backend/rehber.py`. Yeni bir yapay zekâ özelliği **oraya** uç olarak eklenir; istem kuralları ortaktır
  (yalnız parçadan cevap, parça numarası, kişi ağzından konuşma yok, fetva yok).
- Yeni kaynak eklemek (ör. Temel Bilgiler metinleri): `_Index.build()` içinde `self.docs`'a ekle; her parça künye taşımalı.
- Arama zayıfsa önce `THEMES` listesine konu ekle (elle seçilmiş ayetler), sonra eşikleri (`MIN_SCORE`, `MIN_COVER`) ayarla.
- Ağır duygusal içerik (dinleyen yoldaş) uzman onayı olmadan açılmaz: `FLAGS.dinleyenYoldas = false`.

## 5. Denetim araçları

| Komut | Ne yapar |
|---|---|
| `cd frontend && npm run check` | ESLint + import/export doğrulaması (derlemeden çok daha hızlı) |
| `cd frontend && npm run build` | Gerçek derleme; deploy'dan önce şart |
| `cd frontend && node scripts/check-i18n.mjs` | Çevirisi eksik metinler |
| `cd backend && python -m py_compile server.py rehber.py` | Python sözdizimi |
| `cd backend && python scripts/fetch_quranenc.py` | Meal ve tefsir önbelleğini günceller |

### Dil ve yön (RTL)
- Her görünen metin `tt('…')` içinden geçer. Eksikleri gör: `python3 scripts/i18n-missing.py ar` (ya da `en`).
  Ekle: `{"Türkçe": ["English", "العربية"]}` biçiminde bir JSON yazıp `python3 scripts/i18n-add.py dosya.json`.
- Yön için fiziksel özellik KULLANILMAZ: `marginLeft/Right`, `paddingLeft/Right`, `textAlign: 'left'`, `text-left`, `ml-/mr-/pl-/pr-`
  yerine `marginInlineStart/End`, `paddingInlineStart/End`, `'start'`, `text-start`, `ms-/me-/ps-/pe-`.
- Rehber araması değişince: `python backend/tests/run_rehber_eval.py` (isabet %80'in altına düşerse hata verir).

## 6. Yayın sırası

1. `npm run verify` → kalite kapısı geçer · 2. `npm run build` · 3. yerelde dene (`npm start`) · 4. commit · 5. deploy (Antigravity).
Kur'an bölümleri üretimde `REACT_APP_QURAN_PUBLIC=true` tanımlı değilse kapalıdır (Diyanet onayı; bkz. `docs/kurul/`).
