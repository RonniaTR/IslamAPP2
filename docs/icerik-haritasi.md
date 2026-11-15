# İçerik haritası ve boşluk denetimi

`docs/YENI_OZELLIKLER.md` 0.6 için. Durum tarihi: 14 Kasım 2026. Kaynak: `frontend/src/data/*`, `frontend/src/pages/*`
ve `backend/data/*` tarandı. Bu bir **envanter**dir; içeriklerin dinî doğruluğu tek tek denetlenmedi (bkz. en alttaki not).

İşaretler: ✅ var · 🟡 kısmen · ❌ yok

## 1. Harita

| Alan | Alt başlık | Durum | Nerede | Eksik |
|---|---|---|---|---|
| **İman** | Altı esas | 🟡 | `donusTemeller.js` → `iman` modülü | Yalnız Dönüş Odası'nda; ana uygulamada bağımsız bir "İman esasları" bölümü yok |
| | Allah'ın sıfatları | ❌ | — | Zâtî ve subûtî sıfatlar anlatımı |
| | Esmâ-i Hüsnâ | ✅ | `esmaData.js` (99 isim + tefekkür), Hazine › Esma | — |
| **İbadet** | Abdest | ✅ | `donusTemeller.js` → `abdest`, `FiqhPage.js` | Hanefî/Şâfiî farkı gösterimi |
| | Gusül | ✅ | `donusTemeller.js` → `gusul` | — |
| | Teyemmüm | ❌ | — | Ne zaman, nasıl |
| | Namaz: vakitler, kılınış | ✅ | `donusTemeller.js` → `namaz`, `FiqhPage.js`, vakitler `usePrayerTimes` | Adım adım görsel (tasvirsiz, şema) kılınış rehberi |
| | Kaza, cuma, bayram, cenaze namazı | 🟡 | Kaza: `returnPath.js` "Geçmiş vakitler"; Cuma: makale | Bayram ve cenaze namazı yok; cuma'nın kılınışı yok |
| | Oruç | ✅ | `donusTemeller.js` → `oruc`, `RamadanPage.js`, makale | Orucu bozan/bozmayan durumlar tablosu |
| | Zekât ve fitre | 🟡 | `donusTemeller.js` → `zekat` | Fitre; nisap hesabı (hesap aracı Faz 6'da) |
| | Hac ve umre | ❌ | — | Tamamı (çevrimdışı rehber Faz 6'da planlı) |
| | Kurban | ❌ | — | Tamamı |
| **Kur'an** | Elif-Bâ | ✅ | `elifba.js`, `ElifBaPage.js`, çocuk modu | — |
| | Tecvid temelleri | ❌ | yalnız quiz sorularında geçiyor | Temel kurallar dersi |
| | Mushaf (tam sayfa) | ✅ | `MushafPage.js` — 604 sayfa | Satır satır hat dizgisi (Kurul yazı tipi kararından sonra) |
| | Meal | ✅ | QuranEnc (TR/EN) — `mealService.js` | Diyanet meali izne bağlı |
| | Tefsir | ✅ | QuranEnc Muhtasar Tefsir (TR) — `mealService.fetchTafsir` | İkinci bir tefsir (bkz. YENI_OZELLIKLER 0.7) |
| | Kelime kelime meal | 🟡 | `kelimeMeal.js` (Fâtiha, Âyetü'l-Kürsî, 103, 105–114) | Diğer sureler |
| | Sureler rehberi, nüzul | 🟡 | `surahData.js`, `surahHints.js` (oyun ipuçları) | Her sure için kısa tanıtım ve nüzul bilgisi |
| **Hadis ve sünnet** | Kaynaklı hadisler | ✅ | `dailyHadith.js` (kaynak + bab numaralı), `hadiths.json` (500, yalnız Buhârî) | `hadiths.json` Türkçe çevirisinin kaynağı belirsiz; kategori alanı hatalı; diğer kitaplar yok |
| | Sünnet kavramı | ❌ | — | Sünnet nedir, hadis çeşitleri, sıhhat dereceleri |
| **Siyer** | Peygamber Efendimizin hayatı | ✅ | `siyerData.js`, `SiyerPage.js`, `siyerQuizzes.js`, makaleler | Cümle düzeyinde telif denetimi yapılmadı |
| | Peygamberler tarihi | ✅ | `prophets.js`, `ProphetsPage.js`, `stories.js` | — |
| **Ahlak** | Güzel ahlak | ✅ | `articles.js` (öfke, gıybet, tevazu, sabır, doğruluk, ihlas…) | — |
| | Kul hakkı | ❌ | — | Ayrı ve açık bir anlatım |
| | Aile, komşu | ✅ | `articles.js` (ana-baba, komşu), `donusTemeller.js` → `aile` | — |
| | Çevre, dijital ahlak | ❌ | — | İsraf, hayvan hakkı; sosyal medya, mahremiyet, yalan haber |
| **Gündelik fıkıh** | Helal-haram temelleri | ✅ | `donusTemeller.js` → `helal` | — |
| | Yolculuk (seferîlik) | ❌ | — | Namazı kısaltma, cem, oruç |
| | Hastalık | ❌ | — | Oturarak/îmâ ile namaz, oruç ruhsatı |
| | İş hayatı | ❌ | — | Ticaret ahlakı, faiz, vakitlerin ayarlanması |
| **Dua ve zikir** | Günlük dualar | ✅ | `nurHazine.js` → `HIDAYET_DUALARI`, çocuk duaları | Yemek, yolculuk, uyku gibi gündelik dualar listesi dağınık |
| | Tesbihat, istiğfar | ✅ | `nurHazine.js` → `TESBIHAT_SETS`, `DhikrPage.js` | — |
| **Mübarek günler** | Kandiller | 🟡 | `Kandil.jsx`, `islamicCalendar.js` (tarih) | Her kandilin anlamı ve o gece yapılabilecekler |
| | Ramazan | ✅ | `RamadanPage.js` | — |
| | Bayramlar | ❌ | — | Bayram âdâbı, bayram namazı |
| | Hicrî takvim | 🟡 | `islamicCalendar.js` (hesap) | Ayların anlamı; Diyanet resmî tarihleri |
| **İslam tarihi ve medeniyeti** | Tarih | 🟡 | `nurHazine.js` → `TARIH_DONEMLERI` | Dört halife, Endülüs, Osmanlı ilim hayatı derinliği |
| | İlim ve medeniyet | 🟡 | `MUCIZELER`, bazı makaleler | Müslüman bilginler, kurumlar (medrese, vakıf, bîmâristan) |
| | Sanat: hat, tezhip, mimari | ❌ | — | Tamamı |

## 2. Özet

- 37 alt başlıktan **17'si var, 9'u kısmen, 11'i yok.**
- En güçlü alanlar: Ahlak, Dua-zikir, Siyer, Esmâ, Elif-Bâ.
- İçeriğin önemli kısmı **yalnız Dönüş Odası'nın içinde** (`donusTemeller.js`: iman, abdest, namaz, oruç, zekât…).
  Dönüş modunda olmayan kullanıcı bunlara ulaşamıyor. İlk iş yeni içerik yazmak değil, bu modülleri ana uygulamada
  bir "Temel Bilgiler" bölümü olarak da açmak.

## 3. Önerilen yazım sırası
1. **Mevcut olanı görünür yap:** `donusTemeller.js` modüllerini ana uygulamaya "Temel Bilgiler" olarak bağla.
2. **İbadet boşlukları:** teyemmüm · cuma, bayram, cenaze namazı · fitre · kurban.
3. **Ruhsatlar:** yolculuk ve hastalıkta ibadet (en sık sorulan gündelik konular).
4. **İman:** Allah'ın sıfatları; sünnet kavramı ve hadis dereceleri.
5. **Kur'an:** tecvid temelleri; sure tanıtımları.
6. **Ahlak:** kul hakkı; dijital ahlak; çevre.
7. **Mübarek günler:** kandil ve bayram anlatımları (kandil odası tasarımıyla birlikte).
8. **Hac-umre** ve **İslam sanatları** (büyük, ayrı işler).

## 4. Her yeni içerik için kurallar (0.6'dan)
- Varsayılan Hanefî; farklı olan yerde Şâfiî görüşü kısaca belirtilir.
- Ayet → sure:ayet; hadis → kitap ve bab/numara; fıkıh bilgisi → kaynağa atıf. Başka eserden metin kopyalanmaz.
- Fetva verilmez; kişisel sorular ALO 190'a yönlendirilir.
- Her içerik kartında "Kaynak" satırı ve "Hata bildir" düğmesi.

## 5. Bu denetimin yapmadığı şey
Mevcut metinlerin **dinî doğruluğu** (hüküm, rivayet, tarih) tek tek kontrol edilmedi. Yayından önce ilahiyat
eğitimi almış bir kişinin en azından `donusTemeller.js`, `FiqhPage.js` ve `hadiths.json`'u okuması gerekir.
Kurul başvurusu sırasında Din İşleri Yüksek Kurulu'ndan görüş istemek de bir seçenektir.
