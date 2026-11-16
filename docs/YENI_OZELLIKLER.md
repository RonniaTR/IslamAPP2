# Yeni Özellikler — Yapım Dosyası

> Bu dosya, IslamAPP2'ye eklenecek yeni yapının **uygulanabilir şartnamesidir**.
> Kodu yazacak model veya geliştirici önce `AGENTS.md`'yi, sonra bunu okur.
> Görsel karşılıkların hepsi tasarım tuvalinde:
> https://claude.ai/artifact/AkMcjs1zbmmZj3o2G868Ay (pano adları aşağıda `[pano]` olarak geçer).
>
> Hazırlanış: 14 Kasım 2026. Kod tarandı, canlı site (islamapp-5942a.web.app) misafir olarak gezildi.

---

## 0. Çalışma kuralları

1. Fazlar sırayla yapılır; bir faz bitmeden sonrakine geçilmez. Her faz ayrı commit.
2. Deploy ve Firebase konsol işleri bu dosyanın kapsamı dışında; `AGENTS.md` §8'e göre ayrı yapılır.
3. Kur'an'ın Arapça metni **asla değiştirilmez** (harf, hareke, durak). Kaynak: Tanzil.
4. Peygamber ve sahabe **tasviri yok**: insan figürü çizilmez. Yalnız ışık, geometri, hat, motif.
5. Yeni dinî içerik (ipucu, açıklama, tefekkür cümlesi) **özgün yazılır**; kitaptan birebir alınmaz.
   Ayet ve hadis atıfları sure/ayet ya da kitap/numara ile verilir.
6. Yapay zekâ çıktısı gerçek bir âlimin ağzından yazılmaz; "yapay zekâ özeti" diye etiketlenir.
7. Namaz, zikir, dua ve Kur'an okuma **XP vermez, lige girmez, paylaşılmaz**. XP yalnızca ilim ve oyunda.
8. Kullanıcıyı suçlayan dil yok: "kaçırdın", "seri bozuldu" yazılmaz.
9. Bütün yazı tipleri SIL Open Font License (OFL) olmalı. Kapalı lisanslı font eklenmez.
10. `prefers-reduced-motion` ve uygulama içi "Hareket: Kapalı" ayarı her animasyonu durdurur.

---

## FAZ 0 — Güven ve telif (önce bu)  `[pano: L4 Telif denetimi, G2 Envanter]`

### 0.1 Telif düzeltmeleri

| # | Sorun | Yer | Yapılacak |
|---|---|---|---|
| 1 | Diyanet Türkçe meali | `alquran.cloud …/tr.diyanet` (frontend + mobile + backend, 5 yer) | Diyanet'ten yazılı izin yoksa kaldır. Yerine QuranEnc'teki bir Türkçe çeviri. |
| 2 | Saheeh International (İngilizce) uygulamaya gömülü | `backend/data/quran_english.json`, `en.sahih` | Dosyayı kaldır. QuranEnc'teki bir İngilizce çeviriyle değiştir. |
| 3 | Muhammad Asad | `'en.asad'` referansı | Kullanılıyorsa kaldır. |
| 4 | Âlim ağzından yapay zekâ tefsiri | `backend/phase3_tafsir.py` (`"Sen Elmalılı Hamdi Yazır'sın"` vb.) | Persona istemlerini kaldır. Çıktı başlığı: "Yapay zekâ açıklaması · kaynaklara dayanır". Âlim adı yalnız *kaynak* olarak, gerçek alıntıyla anılabilir. |
| 5 | Siyer metinleri | `frontend/src/data/siyerData.js` ("Keskioğlu … baz alınarak") | Birebir alıntı olan paragrafları özgün olarak yeniden yaz. Yayınevi adı tanıtım metinlerinden çıkar (`DiscoverPage.js`). |
| 6 | Mazlum Kiper meal sesleri | `MealAudioPage.js` (YouTube iframe) | Gömme kalabilir; indirme, çevrimdışı paket, ücretli pakete koyma yok. |
| 7 | Kıraat sesleri | `islamic.network`, `mp3quran.net` | Sağlayıcı şartlarını belgeye işle; ücretli pakete koymadan önce izin. |
| 8 | Hadis çevirileri | `backend/data/hadiths.json` | Türkçe çevirilerin kaynağını belirle; özgün değilse kaynak göster veya yeniden çevir. |

**QuranEnc yeniden yayın şartları** (quranenc.com çeviri sayfalarında yazılı):
içerik değiştirilmez/eklenmez/silinmez · yayıncı ve kaynak (QuranEnc.com) açıkça belirtilir ·
sürüm numarası belirtilir · dosyadaki künye bilgisi korunur · güncel sürüme güncellenir ·
meal gösterilirken uygunsuz reklam olmaz.
API: `GET https://quranenc.com/api/v1/translation/sura/{translation_key}/{sura_number}`.
Hangi Türkçe ve İngilizce `translation_key` kullanılacağına QuranEnc listesinden bakılarak karar verilir;
seçilen anahtar ve sürüm `src/data/sources.json` içine yazılır.

**Tanzil Kur'an metni**: CC BY 3.0 · değiştirilmeden kullanılır · Tanzil atfı + tanzil.net bağlantısı.

### 0.2 "Kaynaklar ve lisanslar" sayfası (yeni)
`Ayarlar › Hakkında › Kaynaklar ve lisanslar` — `src/pages/LicensesPage.js`, veri: `src/data/sources.json`
- Kur'an metni: Tanzil (sürüm, CC BY 3.0, bağlantı)
- Her meal: ad, çevirmen/yayıncı, kaynak, sürüm
- Sesler: sağlayıcı ve kâri
- Yazı tipleri: ad + "SIL Open Font License"
- Uygulama içi üretilen sesler: "cihazda üretilir, kayıt içermez"

### 0.3 Önceki turdan kalan güven işleri
- Oturum hatası düzeltmesi deploy edilir (`api.js`, `server.py` — kodda hazır).
- Yeni kullanıcıya sahte ilerleme gösterilmez: `Dashboard.js`, `DiscoverPage.js`, `ProfilePage.js` içindeki sabit "7 gün seri / 45 rozet / Seviye 15 / %70 / son 15 gündür…" değerleri gerçek veriye bağlanır veya boş durum gösterir.
- Tarih kaynağı tekleşir: `UpcomingEventsRow.js` ve `ProfilePage.js` aynı takvim servisini kullanır (2024/2025 sabit tarihler kalkar).
- `firestore.rules` → `quiz_rooms` için `signedIn()`.
- Tanıtımdaki "yapay zekâ müftü" ifadesi → "yapay zekâ rehber" (`OnboardingScreen.js`, `CompanionAI.jsx`).
- "Namaz kıl +20 XP" görevi kaldırılır (`Dashboard.js`, `gamification.js`).

**Kabul:** Lisanslar sayfası açılıyor; uygulamada `tr.diyanet`, `en.sahih`, `en.asad` geçmiyor (`grep` boş); yeni misafir hesapta bütün sayaçlar 0 veya boş durum.

### FAZ 0 DURUMU — 15 Kasım 2026 (Fable)

**Yapıldı (commit edilmedi, deploy edilmedi):**
- 0.1 Mealler QuranEnc'e geçti: `turkish_rwwad`, `english_rwwad`. Web `services/mealService.js`, mobil `quranService.js`,
  backend `quran_translations.py` + `scripts/fetch_quranenc.py`. Gömülü Diyanet, Saheeh ve (şartnamede olmayan)
  İspanyolca Asad dosyaları `backend/data/_to_delete/` altına taşındı. Kabul grep'i boş.
- 0.1 Âlim personaları üç dosyada kaldırıldı (`phase2.py`, `phase3_tafsir.py`, `server.py`); kimlikler artık tefsir
  yaklaşımı. Önbellek anahtarları değişti (eski persona çıktıları okunmaz).
- **Şartnamede olmayan bulgular, düzeltildi:** "Hocalara Sor" (yaşayan kişiler ve Diyanet adına yapay zekâ cevabı) →
  konu rehberleri · mobilde tek İngilizce tefsirin 6 âlim adına paketlenmesi → kaldırıldı · Keşfet'te ücretli ikon
  deposundan (iconscout premium) bağlanan iki görsel → kaldırıldı.
- 0.2 `LicensesPage.js` + `data/sources.json`; Ayarlar'dan açılıyor.
- 0.3 Ana ekran, Keşfet ve Profil gerçek veriye bağlandı; sahte bölümler kaldırıldı. Tek takvim servisi
  `services/islamicCalendar.js`. İbadet görevleri XP göstermiyor/vermiyor. "Müftü" → "rehber". `quiz_rooms` yazma kuralı.
- 0.4 `docs/kurul/` (6 dosya) + `REACT_APP_QURAN_PUBLIC` bayrağı + `QuranGate` + `?inceleme=1`.
- 0.5 Premium kaldırıldı; `PremiumPage` destekçi sayfası oldu. Yapay zekâ için herkese eşit günlük 20 soru sınırı kondu.
- 0.6 `docs/icerik-haritasi.md`: 37 alt başlıktan 17 var, 9 kısmen, 11 yok.

**Doğrulama:** Python dosyaları derleniyor. Değişen JS dosyalarında ESLint hatası yok
(`cd frontend && npx eslint --no-eslintrc -c eslint.check.json --quiet --ext .js,.jsx src`; kalan 4 hata eski,
`import/first`, dokunulmamış veri dosyalarında). **Üretim derlemesi (`npm run build`) ajan ortamında tamamlanamadı
ve uygulama tarayıcıda denenmedi** — deploy'dan önce yerelde `npm start` ile denenmeli.

**Açık kalanlar (insan ya da Antigravity):**
1. `python backend/scripts/fetch_quranenc.py` — ağ erişimi olan makinede çalıştır; çıkan iki dosyayı commit et.
   Çalıştırılmazsa sunucudaki meal alanları boş döner (web, meali doğrudan QuranEnc'ten aldığı için çalışır).
2. QuranEnc API'sinin tarayıcıdan (CORS) çağrılabildiği canlıda doğrulanmadı. Engel çıkarsa `mealService.js` backend
   üzerinden okuyacak şekilde değiştirilir.
3. `backend/data/_to_delete/` klasörünü sil, `git rm` yap.
4. `hadiths.json` (500 Buhârî hadisi): Türkçe çevirinin kimden alındığı bulunamadı; "explanation" alanı her hadiste
   aynı kalıp cümle, "category" alanı hatalı. Kaynak bulunana kadar bu veri güvenilir değil.
5. Siyer metinlerinin kitapla cümle cümle karşılaştırması yapılamadı (kitap yok).
6. Misafir kullanıcı Firebase'de oturum açmadığı için yeni kuralla çok oyunculu yarışmaya giremez
   (çözüm: Anonymous Auth).
7. Üretim derlemesinde bayrak tanımsız olduğu için **bir sonraki deploy'da canlı sitede Kur'an bölümleri kapanır.**
   Bu, 0.4'ün gereği; istenmiyorsa deploy'dan önce karar verilmeli.
8. Hifz (ezber) hâlâ XP veriyor; "Nur Yolu günü tamamlandı" ödülü ibadet adımlarını da içeriyor. Kural 7'ye göre karar gerek.

### 15 Kasım 2026 — ikinci tur (Fable)

**Eklendi:**
- **Tefsir (gerçek kaynak):** QuranEnc'teki *Muhtasar Kur'an-ı Kerim Tefsiri — Türkçe Tercüme* (`turkish_mokhtasar`).
  Sure okuma ekranında ve Mushaf ayet panelinde gösterilir. Yapay zekâ tefsiri artık birincil kaynak değil.
- **Tam sayfa Mushaf:** `pages/MushafPage.js`, yol `/mushaf/:sayfa` (604 sayfa). Sabit kâğıt zemini, tek renk metin,
  sağdan sola sayfa çevirme, ayete dokununca meal + tefsir paneli, kaldığı sayfayı hatırlar. Kur'an listesinde "Mushaf" düğmesi.
- **Sunucu yedeği:** `GET /api/quran/quranenc/{key}/{sure}` — tarayıcı QuranEnc'e erişemezse web buraya düşer.
- **Karekod:** `docs/kurul/inceleme-karekod.png` + `make_qr.py`.
- Açık kalan 8. madde kapandı: ezber artık XP vermiyor. Eski 4 lint hatası (`import/first`) düzeltildi; `src` genelinde 0 hata.

**Hâlâ denenmedi:** uygulama tarayıcıda çalıştırılmadı; QuranEnc ve alquran.cloud'a bu ortamdan erişim yok.

### 15 Kasım 2026 — üçüncü tur (Fable): Faz 1–9'dan kodlananlar

Kullanıcı kararıyla "fazlar sırayla" kuralı gevşetildi; en görünür ve bağımsız parçalar birlikte kodlandı.
**Commit ve deploy edilmedi; tarayıcıda denenmedi** (lint: `src` genelinde 0 hata, Python derleniyor).

| Faz | Kodlanan | Dosya | Kalan |
|---|---|---|---|
| 1 Tema | 5 yeni tema (Işıltı, Huşu, Sevgi, Sükûn, Bereket) + Zümrüt Gece; 4 yazı stili; 4 yazı boyutu | `contexts/ThemeContext.js`, `index.css` | Tema = ayrı JSON dosyası yapısı; sabit renk yazılmış eski sayfaların temaya bağlanması (çoğu sayfa `#0A1F14` gibi sabit renk kullanıyor, tema değişince onlar değişmez) |
| 2 Ayarlar | Ayarlar v2: tema stüdyosu, yazı, konum ("Konumumu bul" + il seçimi), vakit hatırlatması, dil, huzur sesi | `pages/SettingsPage.js`, `hooks/usePrayerTimes.js`, `data/cityCoords.js` | Yerel (Capacitor) zamanlanmış bildirim ve "Kıldım/Sonra" eylemleri; şu an hatırlatma yalnız uygulama açıkken çalışır |
| 3 Mushaf | Tam sayfa Mushaf + ayet paneli (önceki tur) | `pages/MushafPage.js` | Üç mod düğmesi (Mushaf · Meal · İkisi), satır dizgisi |
| 4 Dil | Ayarlar'dan TR/EN/AR seçimi | — | `tr.js` ayrımı, Arapça çeviri eksikleri, tam RTL düzen |
| 5 Oyun | Hangi Peygamber?, Hangi İsim? (ortak motor) | `pages/games/ClueGame.jsx`, `WhichProphet.jsx`, `WhichName.jsx` | Ayet Nerede? ve diğer 6 oyun |
| 7 Dönüş | Yeni Eşik: aralık ahşap kapı + kandil + evre rengi; ney sentezi ve 6 makam; "Geç" düğmesi; hareket azaltma desteği | `components/donus/GateAnimation.jsx`, `services/donusAudio.js` | Toz zerreleri, kısa/uzun sürüm, evre geçiş sahneleri, Firestore yedeği, sessiz davet, 40. gün sonrası |
| 8 Yeni fikirler | Vakitlerin makamı (Ayarlar'da dinlenir), Gözsüz tesbihat, Rahmet defteri | `pages/TesbihatPage.js`, `pages/RahmetPage.js` | Vakit sesinin bildirime bağlanması, Huşu perdesi, kaza planı, esnek hatim, kandil haritası, hayat ayetleri, mahreç koçu |
| 9 Yapay zekâ | Rehber: Sor (üç etiket + "Nereden biliyorum?"), Bugün bana ne söyler?, Doğrula, Kendi cümlenle anlat | `backend/rehber.py`, `pages/RehberPage.js` | Kelime koçu, aile sofrası, dinleyen yoldaş (uzman onayı şart), soru defteri, vektör araması, 100 soruluk deneme seti |
| — | Misafir oturumu sayfa yenilenince düşmüyor | `contexts/AuthContext.js` | — |

**Rehber'in bilinen sınırları (dürüst not):**
- Arama anlam vektörüyle değil kelime kökü örtüşmesiyle yapılıyor. Açık sorularda iyi (ör. "yolculukta namazı kısaltmak" → Nisâ 4:101),
  dolaylı ve duygusal cümlelerde zayıf. "Bugün bana ne söyler?" bu yüzden önce **elle seçilmiş** 12 konuluk ayet listesine bakar.
- "Kaynağım yok" eşiği (`MIN_SCORE`, `MIN_COVER`) tahminidir; deneme setiyle ayarlanmalı. İkinci güvence istemdeki kuraldır.
- Doğrula yalnız 500 Buhârî hadisinde arar ve o verinin Türkçe çevirisinin kaynağı belirsizdir (0.1 açık madde). "Tartışmalı" sonucu
  henüz yok: veride sıhhat derecesi ayrımı bulunmuyor.
- Fıkıh soruları (ör. zekât hesabı) çoğunlukla "kaynağım yok" dönecek; çünkü kaynak yalnız meal ve tefsir. Temel Bilgiler metinleri dizine eklenmeli.

### 15 Kasım 2026 — dördüncü tur (Fable): kalanlar ve geliştirme altyapısı

**Kodlandı** (commit/deploy yok; tarayıcıda denenmedi; `npm run check` 0 hata):
- **Geliştirme altyapısı:** `features/registry.js` (özellik kaydı + bayraklar), `pages/OzelliklerPage.js` (Tüm özellikler),
  `docs/GELISTIRME.md`, `npm run check` (ESLint + import/export doğrulaması). Yeni denetim 4 eski kırık import yakaladı; düzeltildi.
- **Tema bağlama:** 25 eski dosyada 108 sabit renk tema değişkenine çevrildi (koyu-yeşil aile). Açık temalar için beyaz yazı düzeltmesi.
- **Mushaf:** üç mod (Mushaf · Meal · İkisi).
- **Bildirim:** telefonda işletim sisteminin zamanlayıcısıyla (uygulama kapalıyken de); web'de sekme açıkken.
- **Huşu perdesi** (Ayarlar'dan açılır), **Kelime Koçu**, **Aile Sofrası**.

#### Beşinci tur (16.11.2026) — kalan listenin tamamı

| Konu | Yapılan | Dosya |
|---|---|---|
| Ana ekran v2 (tuval G1) | Vakit kartı (sıradaki vakit, geri sayım, konum, 5 vaktin puansız kişisel takibi) · vakte göre tek öneri · arama (özellik kaydında) + "Sor" (Rehber'e taşır) · Kaldığın yerler (yalnız gerçekten başlanmış olanlar) · 6 mod · günün ayeti (Kur'an bayrağına bağlı) ve hadisi kâğıt kartta · Bugün: ibadet (puansız) / ilim görevleri (XP) ayrı | `pages/Dashboard.js`, `components/home/PrayerCard.jsx` |
| Arapça / RTL | 186 fiziksel yön kullanımı mantıksal özelliğe çevrildi (75 dosya): `marginInlineStart`, `text-start`, `ms-/me-/ps-/pe-` · yön ve dil sunucu beklemeden uygulanır · yön simgeleri aynalanır, Arapçada harf aralığı ve büyük harf kapatılır · Noto Naskh Arabic · en/ar sözlüklerinde **0 eksik** (512 metin; +421 en, +475 ar) | `index.css`, `contexts/LangContext.js`, `i18n/en.js`, `i18n/ar.js`, `scripts/i18n-missing.py`, `scripts/i18n-add.py` |
| Oyunlar | Ayet Nerede? (önceki tur) + Hangi Harf? (mahreçten harfi tanı) | `pages/games/WhichLetter.jsx` |
| Dönüş Odası | Evre geçiş sahnesi (eski evre uğurlanır, yenisi tanıtılır, sonra eşik açılır) · **Yolda kal**: 40. günden sonra haftada tek ders, evreler sırayla; uzun arada "kaldığın yerden" · bulut yedeği ve sessiz davet (önceki tur) | `components/donus/PhaseScene.jsx`, `components/donus/YoldaKal.jsx`, `DonusShell.jsx`, `DonusHome.jsx` |
| Kandil ışık haritası | Mübarek gecede il il anonim sayaç; gecede cihaz başına 1; 10'dan az ışıkta sayı gizli; sıralama yok. Harita, il merkezlerinin enlem/boylam noktalarıdır (sınır verisi ve lisansı gerekmez) | `pages/KandilPage.js`, `services/islamicCalendar.js` (`getActiveNight`), `firestore.rules` (`kandil/{gece}/iller/{il}`: yalnız `n`, yalnız +1) |
| Mahreç koçu | 7 karışan harf grubu · çıkış yeri tarifi · kendi sesini kaydet/dinle (cihazdan çıkmaz) · kişi kendi kulağıyla değerlendirir. **Telaffuzu puanlamaz** (bilerek) | `pages/MahrecPage.js` |
| Rehber doğruluğu | Deneme seti 44 → **106 soru** + 12 ilgisiz soru. Sonuç: ilk 5'te isabet **100/106 (%94)**; ilgisiz soruda eşiği geçen **2/12**. Kapsama oranı artık kullanıcının bütün kelimeleriyle ölçülür (dizinde olmayan kelime oranı düşürür) | `backend/rehber.py`, `backend/tests/rehber_eval.json`, `backend/tests/run_rehber_eval.py` |

**Bilinen sınırlar (dürüst liste):**
- Bu turun kodu `npm run check` (0 hata) ve `py_compile` ile denetlendi; **tarayıcıda denenmedi**, üretim derlemesi alınmadı.
- Rehber'deki arama hâlâ **kelime kökü + kavram sözlüğü**dür; gerçek anlam (vektör) araması değildir. Kaçan 6 soru ve geçen
  2 ilgisiz soru bunun sınırıdır ("dizi", "işlem" gibi kökler). Vektör araması bir gömme modeli/servisi gerektirir; eklenirse yalnız `search()` değişir.
- Deneme setindeki beklenen ayetler bilinen açık ayetlerdir; bir ilahiyatçı gözden geçirmelidir.
- Arapça çeviriler makine yardımıyla yazıldı; ana dili Arapça olan biri okumalıdır. Veri dosyalarındaki uzun içerik (dersler, kıssalar) Arapçaya çevrilmedi; İngilizceye düşer.
- RTL: `left/right` ile konumlanan mutlak öğeler elle gözden geçirilmedi (ortalanmış öğeleri bozmamak için otomatik çevrilmedi).
- Kandil haritası: `firestore.rules` yayımlanmadan çalışmaz; kötüye kullanıma karşı App Check açılmalıdır.
- Dinleyen yoldaş bir uzman incelemesi olmadan açıktır (ürün sahibi kararı).

**Hâlâ yapılmadı:** `tr.js` ayrımı · vektör araması · Türkiye il sınırlı gerçek harita · ana ekran widget'ı · tema dışında kalan sabit renkler.

#### Altıncı tur (16.11.2026) — huşu ile açılan kapı, ses ve hareket dili

| Konu | Yapılan | Dosya |
|---|---|---|
| Huşu ile açış | Kapıya parmak konup **beklenir**; kapı basılı tutuldukça (2,8 sn) gıcırdayarak açılır, nefes halkası dolar, çeyreklerde hafif titreşim. Bırakılırsa kapı yine aralık kalır (ceza/sayaç yok). Kısa dokunuş ve Enter kapıyı kendiliğinden açar | `components/donus/GateAnimation.jsx` |
| Kapı sesi | Üretilmiş ahşap gıcırtısı (titrek testere dalga + iki dar süzgeç + sürtünme gürültüsü) ve kanatların yaslandığı tok vuruş. Kayıt yok | `services/donusAudio.js` (`creakVoice`, `playDoor`, `thud`, `startHold`) |
| Ney | Üst oktav sesi, "çarpma" süslemesi, uzun karar notası, alttan **dem**; notalar arası istenmeyen sürekli kayma hatası giderildi. Gecikme yankısı yerine üretilmiş **kubbe yankısı** | `services/donusAudio.js` (`playNey`, `wetBus`) |
| Kapı görseli | Işık hüzmeleri, toz zerreleri, ahşap damarı ve demir kuşaklar, kapı açıldıkça derinleşen gölge, zemine yayılan ışık | `GateAnimation.jsx` |
| Vakit sesi | Huşu perdesi açılırken vaktin makamı + "dinle" düğmesi; ana ekran vakit kartında makam düğmesi | `components/HusuPerdesi.jsx`, `components/home/PrayerCard.jsx` |
| Hareket dili | `.stagger` (sıralı giriş, ana ekranda), `.flame`, `.halo`, düğmelerde basma tepkisi; **hareket azaltma** tercihine genel uyum; `.paper` (kutsal metin) üzerinde hareket yok | `index.css` |

Denetim: `npm run check` 0 hata, en/ar sözlükte 0 eksik. **Ses ve kapı sahnesi gerçek cihazda dinlenmedi/denenmedi** — gıcırtı ve ney seviyesi kulakla ayarlanmalı.

**Bulunan eksikler (öncelik sırasıyla):**
1. Hiçbir tur gerçek cihazda denenmedi; otomatik arayüz testi yok. → Playwright ile 10 ana akışın duman testi.
2. `hadiths.json` çeviri kaynağı belirsiz; siyer metni kaynakla karşılaştırılmadı (telif + doğruluk riski).
3. Kandil haritası ve çok oyunculu yarışma App Check olmadan kötüye kullanıma açık.
4. Rehber'de 2/12 ilgisiz soru eşiği geçiyor; yapay zekâ kuralı canlıda ölçülmedi.
5. Açık temalarda eski sayfalarda sabit renkler; RTL'de mutlak konumlu öğeler.
6. Çevrimdışı: meal/tefsir cihaza inmiyor; ilk açılış paketi büyük (sayfa bazlı kod bölme yok).
7. Mobil (Expo) uygulama web'in çok gerisinde; iki ayrı kod tabanı.
8. Hata izleme ve gizliliğe saygılı kullanım ölçümü yok — neyin kullanıldığı bilinmiyor.

**Büyük yapı önerileri (sıradaki fazlar için):**
- **Ses motoru** (`services/sound/`): tek yerden ney, kapı, tını, tesbih tıkı; makam verisi ayrı dosyada; her sayfa `sound.play('vakit', …)` der. Kayıtlı gerçek ney için izinli bir neyzenle 6 makamda kısa kayıt → sentez yedek kalır.
- **Sahne motoru** (`components/scene/`): kapı, evre geçişi, kutlama, kandil gecesi aynı zaman çizelgesi biçimiyle (JSON adımlar: süre, ses, görsel). Yeni sahne = yeni veri dosyası.
- **İçerik hattı**: bütün içerik `content/*.json` + şema doğrulama + kaynak zorunluluğu (`sources.json`'da karşılığı olmayan içerik derlemeyi durdurur).
- **Çevrimdışı önce**: meal, tefsir ve Rehber dizini IndexedDB'ye; Rehber araması cihazda çalışır (sunucu yalnız özet için).
- **Anlam araması**: çok dilli küçük gömme modeli ile ayet vektörleri bir kez üretilir, cihaza iner; `search()` değişir, etiket kuralları aynı kalır.
- **Tek kod tabanı**: Capacitor'a tam geçiş; Expo uygulaması emekli edilir. Ana ekran widget'ı ve gerçek "Rahatsız Etmeyin" bağlantısı native eklentiyle.
- **Kalite kapısı**: `npm run check` + i18n eksik denetimi + Rehber deneme seti + duman testleri tek komutta (`npm run verify`), commit öncesi zorunlu.

#### Yedinci tur (16.11.2026) — çevrimdışı önce, sadeleştirme, yapılar

| Konu | Yapılan | Dosya |
|---|---|---|
| Çevrimdışı paketler | Türkçe meal, Türkçe tefsir, İngilizce meal uygulamayla birlikte yayımlanır (3,9 MB ham; sıkıştırılmış iner). İlk açılıştan sonra boşta cihaza (IndexedDB) alınır; meal/tefsir okuma artık **önce cihazdan** | `scripts/build-packs.py`, `public/packs/`, `services/offline.js`, `services/mealService.js` |
| Bütün sayfalar çevrimdışı | Servis çalışanı kurulumda bütün sayfa parçalarını ön belleğe alır; paketler ve yazı tipleri de ön bellekten | `public/sw.js` |
| Rehber cihazda | "Sor" ve "Bugün bana ne söyler?" bağlantı yokken (ya da sunucu cevap vermezken) cihazdaki meal+tefsirde arar; **özet yazmaz, yalnız kaynak gösterir**. Sunucudaki aramayla aynı sonuçları verdiği 5 soruda karşılaştırıldı | `services/localRehber.js`, `data/rehberData.json` (üretilmiş) |
| Rehber gürültü | Kapsam dışı kuralı: sorunun kelimelerinin yarısı kaynaklarda hiç geçmiyorsa sonuç gösterilmez. İlgisiz soru 2/12 → **1/12**, isabet aynı (100/106) | `backend/rehber.py` (`good_hits`) |
| Firestore | Cihazda kalıcı önbellek (çevrimdışı okuma/yazma kuyruğu) · App Check (anahtar tanımlanırsa) | `services/firebase.js` |
| Ses motoru | Bütün sesler tek kapıdan: `sound.play('vakit', …)`; ana sessiz anahtarı; `public/audio/ney/<makam>.mp3` konursa gerçek ney çalar | `services/sound/index.js` |
| Sahne motoru | Veriyle tanımlanan tam ekran sahneler; Kandil ışığı ve hatim tamamlanınca oynar | `components/scene/` |
| İçerik hattı | Her veri dosyası kaynağıyla kayıtlı olmak zorunda; Mushaf paketi onaysız üretilirse hata | `data/icerik.json`, `scripts/check-sources.py` |
| Tanılama | Hata ve sayfa sayıları **yalnız cihazda**; kullanıcı görür, kopyalar, siler | `services/diagnostics.js`, `pages/OfflinePacksPage.js` (yeniden yazıldı) |
| Kalite kapısı | `npm run verify` — 7 denetim tek komutta; `.githooks/pre-commit` | `scripts/verify.sh` |
| Sadeleştirme | Silindi: `mobile/` (Expo), kök `android/` (eski WebView), eski kopya klasörü (27 MB), `backup_v3`, `memory`, `.emergent`, 14 eski test betiği, kök `package.json`, `_to_delete`, 36 ölü kaynak dosyası (114 KB) | — |

**Çevrimdışı ÇALIŞMAYANLAR (dürüst liste):** Mushaf Arapça metni (paket Kurul onayına bağlı; o zamana kadar yalnız daha önce açılmış sayfalar),
ayet sesleri (kıraat akışı), yapay zekâ özetleri/Doğrula/Kendi cümlenle/Dinleyen yoldaş (sunucu gerekir), namaz vakti ilk indirme (son vakitler ön bellekte),
giriş/kayıt, çok oyunculu yarışma, kandil haritasındaki başkalarının ışıkları.

**Denenmedi:** servis çalışanının ön belleği ve IndexedDB akışı gerçek tarayıcıda; Firestore kalıcı önbelleği; ses motoru. Üretim derlemesi alınmadı.

**Kalan:** gerçek anlam (vektör) araması · Playwright duman testleri · açık temalarda sabit renkler · hadis/siyer kaynak denetimi (içerik hattında 26 uyarı) · native widget ve "Rahatsız Etmeyin".

### 0.7 Kur'an, meal, tefsir ve siyeri uygulamaya koymanın yolu

| İçerik | Kaynak | Şart | Durum |
|---|---|---|---|
| Kur'an metni | Tanzil (Uthmani) | CC BY 3.0; değiştirilmez; atıf | ✅ kullanılıyor |
| Mushaf sayfa bölümleri | alquran.cloud `/page/{n}` (Tanzil metni) | aynı | ✅ `MushafPage.js` |
| Mushaf satır dizgisi | Quranic Universal Library (qul.tarteel.ai) — 604 sayfa/15 satır düzen verileri, indirilip uygulamaya gömülür | Düzenin kullanım şartı indirme sayfasından teyit edilecek | ⏳ Kurul yazı tipi kararından sonra |
| Mushaf yazı tipi | Kurul karar verir. Adaylar: Amiri (OFL, şu an), KFGQPC Hafs (Kral Fahd Kompleksi; bazı paketlerinde "ticari kullanım yok" notu var → izin sorulmadan gömülmez) | — | ⏳ dilekçede soruluyor |
| Türkçe meal | QuranEnc `turkish_rwwad` | QuranEnc şartları | ✅ |
| Türkçe meal (2) | Diyanet meali | Diyanet'in yazılı izni | ⏳ dilekçede isteniyor |
| Türkçe meal (3) | Elmalılı M. Hamdi Yazır — orijinal meal (vefatı 1942 → kamu malı) | Yalnız **orijinal** metin; sadeleştirilmiş baskılar ayrı eser. Güvenilir bir dijital nüsha bulunup basılı aslıyla karşılaştırılmalı | ❌ nüsha aranacak |
| İngilizce meal | QuranEnc `english_rwwad` | QuranEnc şartları | ✅ |
| Tefsir (TR) | QuranEnc `turkish_mokhtasar` | QuranEnc şartları | ✅ |
| Tefsir (TR, 2) | QuranEnc'te Sa'dî Tefsiri'nin Türkçe çevirisi de listeleniyor | Anahtarı ve kapsamı listeden teyit edilecek | ⏳ |
| Kelime anlamları | QuranEnc "Arapça Kur'an-ı Kerim — Kelime Manaları" (Arapça) | QuranEnc şartları | ⏳ Faz 3 |
| Siyer | **Özgün yazım.** Olay örgüsü ortak tarihtir, telif konusu değildir; cümleler bize ait olmalı. Dayanak: Kur'an ayetleri + Kütüb-i Sitte rivayetleri (kaynak numarasıyla) | — | 🟡 mevcut metin denetlenmedi |
| Hadis | Arapça asıllar kamu malı. Türkçe: ya özgün çeviri ya da izinli bir çeviri | — | ❌ `hadiths.json` kaynağı belirsiz |

Kural: **gömülen her dış içerik önce `sources.json`'a yazılır**, sonra koda girer. Sunucu kopyası
`python backend/scripts/fetch_quranenc.py` ile üretilir (meal + tefsir).

### 0.8 Tasarım dili v2 — "Kâğıt, mürekkep, ışık"

Mevcut tuvaldeki dilin (koyu yeşil + altın) derinleştirilmiş kuralları. Faz 1 tema sistemi bunları değişken olarak taşır.

**Üç katman, karışmaz:**
1. **Kâğıt (kutsal metin katmanı):** Kur'an metni, meal ve tefsir. Sabit: kâğıt `#FBF8F0`, mürekkep `#1A1A1A`, çerçeve
   `#B8A77A`. Temadan **etkilenmez**, üzerinde gölge/parıltı/animasyon olmaz. Koyu mod isteyene tek seçenek: kâğıt `#14110B`,
   mürekkep `#EDE6D3` (Kurul'a ayrıca gösterilir).
2. **Mekân (uygulama katmanı):** kartlar, listeler, gezinme. Tema renkleri burada yaşar.
3. **Işık (duygu katmanı):** kandil, eşik, kutlama, vakit geçişleri. Yalnız geçiş anlarında görünür, içerik okunurken susar.

**Biçim sözlüğü (hepsi SVG, tasvirsiz):**
- *Rub'ul hizb* (sekiz köşeli yıldız) → başlangıç ve tamamlanma işareti.
- *Sivri kemer* → kapı/giriş: Dönüş Odası eşiği, bölüm kapakları.
- *Şemse* (madalyon) → bölüm ortası süsü, sure başlıkları.
- *Zencerek* (ince zincir bordür) → kâğıt katmanının çerçevesi.
- *Mukarnas basamağı* → ilerleme göstergeleri (çubuk yerine basamak).
Bir ekranda en çok **bir** motif öne çıkar.

**Yazı:** başlık Playfair Display · gövde Inter · Arapça Amiri (Mushaf'ta Kurul'un yazı tipi). Arapça boyutu Latin'in 1,35 katı,
satır aralığı 2,1. Arapça metin asla italik, asla harf aralıklı olmaz.

**Hareket:** tek eğri `cubic-bezier(.2,.8,.2,1)`; süreler 160 ms (dokunuş), 320 ms (geçiş), 900 ms (tören). Tören yalnız
eşik, evre geçişi ve hatimde. `prefers-reduced-motion` → hepsi 0 ms çözülme.

**Ses:** her dokunuşa ses yok. Ses yalnız üç yerde: eşik, tamamlanma, vakit. Hepsi cihazda üretilir (Faz 7.3, 8.1).

**Dil:** sen diye hitap; emir kipi yerine davet ("Kandilin yanıyor"); sayı yerine anlam ("yoldaydın"); asla "kaçırdın".

### 0.9 Bu turda düşünülen yeni eklentiler (Faz 8'e ek)

- **8.11 Sayfa yoldaşı:** Mushaf'ta her sayfanın altında tek satır: o sayfanın ana konusu (QuranEnc Muhtasar'daki
  "bu sayfadaki ayetlerden dersler" bölümünden, kaynaklı). Okuyan ne okuduğunu bilir.
- **8.12 Hatim izi:** Mushaf'ın 604 sayfası 30 cüzlük bir şerit olarak görünür; okunan sayfalar altınla dolar. Sayı yok, yalnız iz.
- **8.13 Ayet zinciri:** bir ayete dokununca aynı konudaki diğer ayetler (ör. sabır) sure:ayet listesi olarak açılır.
  Liste elle hazırlanır ve kaynaklıdır; yapay zekâ üretmez.
- **8.14 Kıraat eşlikçisi:** tilavet çalarken okunan ayet Mushaf sayfasında yalnız zemin tonuyla işaretlenir, sayfa
  kendiliğinden çevrilir.
- **8.15 Kaynak şeffaflığı:** her meal/tefsir/hadis satırında küçük "kaynak" simgesi; dokununca yayıncı, sürüm ve
  "hata bildir" (QuranEnc'in not API'sine `POST /translations/note` ile iletilir — şartların 5. maddesi).
- **8.16 Gece Mushaf'ı:** yatsıdan sonra Mushaf kendiliğinden koyu kâğıda geçmeyi önerir (zorlamaz).

---

### 0.4 Diyanet onayı: Mushafları İnceleme ve Kıraat Kurulu başvurusu (YAYINDAN ÖNCE)

**Neden:** 633 sayılı Kanun (7549 sayılı Kanunla değişik, RG 4 Haziran 2025): Kurulun onayı bulunmayan
"sesli, görüntülü ve elektronik ortamda hazırlanan Kur'an-ı Kerimler basılamaz ve yayımlanamaz".
Onaysız yayında erişim engeli ve toplatma mümkün. Telif sorunundan bağımsızdır: her meal için gerekir.

**Dikkat:** Kur'an-ı Kerim Basım ve Yayım Kriterleri Hakkında Yönetmelik (2 Kasım 2022) m.9/2-b dijital eserin
"yayımdan sonra" onaylanacağını söylüyor; 2025 Kanunu ise onaysız yayını yasaklıyor. Kanun üstündür →
**halka açık yayından önce başvur**, yönetmelikteki sırayı Kurul'a yazılı olarak sor.

**Nereye:**
| | |
|---|---|
| Kurum | Diyanet İşleri Başkanlığı — Mushafları İnceleme ve Kıraat Kurulu Başkanlığı |
| Adres | Üniversiteler Mah. Dumlupınar Bulv. No: 147/A, 06800 Çankaya/Ankara |
| E-posta | mushaflar@diyanet.gov.tr |
| Telefon | (0312) 295 78 40 |
| Site | mushaflariinceleme.diyanet.gov.tr |

İletişim bilgileri Kurul'un resmî yazılarından alınmıştır ama eski tarihlidir; **önce telefonla doğrula.**
Ankara'dasın: dosyayı elden teslim edip evrak kayıt numarası almak en sağlam yol.

**Usul (Yönetmelik m.7):** Başvuru, Başkanlıkça belirlenen **matbu formun** Kurul'a teslimiyle yapılır.
Başkanlık sitesinde bir bağlantı ilan ederse başvuru elektronik formla yapılır. Bugün böyle bir bağlantı
bulunamadı; telefonda iki soru sor:
1. "Mobil/web uygulama için dijital eser onay formu hangisi, elektronik başvuru bağlantısı var mı?"
2. "Uygulama henüz yayında değil; incelemeyi kapalı test bağlantısı üzerinden yapabilir misiniz?"

**Fable'ın hazırlayacağı başvuru dosyası → `docs/kurul/`** (Kurul'un formu gelince ona göre doldurulur):
1. `dilekce.md` — başvuru dilekçesi: başvuran (gerçek kişi), uygulama adı, platformlar, kısa tanım,
   "dijital eser onayı ve Diyanet meali kullanım izni talebi", ekler listesi, imza.
   **Diyanet meali kullanım iznini aynı dilekçede iste.**
2. `kunye.md` — uygulama künyesi: ad, sürüm, paket kimliği, geliştirici, iletişim, ücretsiz/reklamsız beyanı.
3. `icerik-envanteri.md` — Kur'an metninin kaynağı ve sürümü (ör. Tanzil Uthmani, sürüm/indirme tarihi,
   SHA-256), rasm ve yazı tipi, sayfa düzeni (604 sayfa, Medine tertibi mi?), meal kaynakları ve izin durumu,
   tilavet ses kaynakları ve lisansları, tecvid renklendirmesi var mı. Bu tablo `sources.json`'dan üretilir.
4. `ekran-goruntuleri/` — mushaf tam sayfa, mealli görünüm, ayet menüsü, tüm okuma temaları, Arapça arayüz,
   koyu tema. Her görüntünün altında hangi ekran olduğu yazılır.
5. `erisim.md` — inceleme için kapalı erişim:
   - Web: Firebase önizleme kanalı (Antigravity çalıştırır):
     `firebase hosting:channel:deploy kurul-inceleme --expires 30d`
   - Android: Google Play dahili test bağlantısı veya imzalı APK
   - iOS: TestFlight genel bağlantısı
   - Giriş gerekmez; bağlantı doğrudan Mushaf'ı açar (`?inceleme=1` → Mushaf'a yönlendir).
6. `kontrol-listesi.md` — yönetmelik kriterlerine göre öz denetim:
   - Kur'an metni üzerinde **mehabete uymayan, renk karmaşasına yol açan renklendirme yok.** Tema sistemi
     (Faz 1) Mushaf sayfasında yalnız zemin ve kenar rengini değiştirir; ayet metni tek renk kalır.
   - Metin üzerinde animasyon, efekt, parıltı veya bulanıklık yok.
   - Yazı tipi Kurul'un kararına bırakılır; önerilen tipler listelenir, son söz Kurul'un.
   - Ayet numaraları, secde işaretleri, cüz/hizb bölümleri doğru.

**Uygulamadaki karşılığı:**
- `REACT_APP_QURAN_PUBLIC` bayrağı. `false` iken (varsayılan) Mushaf, sure okuma, tilavet ve meal sayfaları
  halka açık derlemede gizlenir; yerine "Kur'an bölümü Diyanet onay sürecinde" kartı gösterilir.
  İnceleme kanalında `true` derlenir.
- İçinde ayet geçen dualar ve oyunlar (Hangi Sure?, kelime meali) kapsama girer mi → Kurul'a sor;
  cevap gelene kadar onlar da bayrağa bağlanır.
- Onay gelince: onayın tarih ve sayısı `LicensesPage`'e ve mağaza açıklamasına yazılır.
- **Kur'an metni, yazı tipi veya meal her değiştiğinde yeniden başvuru gerekir.** Kurul hata bildirirse
  ilgili içerik yayından kaldırılır, düzeltilir, yeniden sunulur (yönetmelik bunu açıkça öngörüyor).

**Yayından önce tanıtım (Kurul onayı beklenirken):** Kur'an içermeyen bir tanıtım sayfası (özellik listesi,
ekran görüntüleri — Kur'an sayfası görüntüsü OLMADAN — ve "haber ver" e-posta listesi) açılabilir.
Mağaza "erken erişim / ön kayıt" da Kur'an bölümleri kapalıyken yapılabilir.

### 0.5 Tamamen ücretsiz model

Karar: **her özellik herkese ücretsiz, reklam yok, giriş zorunlu değil.** Sebepleri: QuranEnc şartları
(uygunsuz reklam yasağı), Diyanet meal izninin ücretsiz uygulamaya verilme ihtimalinin yüksek olması, güven.
- `PremiumContext.js`: `canUseFeature` her zaman `true`; `/premium/status` çağrısı kaldırılır.
- `PremiumPage.js` → "Destekçi" sayfasına dönüşür: hiçbir şey kilitlemez. Bağış ileride eklenecekse
  mağaza kuralları (özellikle Apple) ayrıca araştırılır; şimdilik yalnız "paylaş, puan ver, hata bildir".
- `AdminPage.js` ve `DiscoverService.js`'teki `isPremium` / "PRO" etiketleri kaldırılır.
- Mağaza metni: "Ücretsiz · Reklamsız · Hesap gerekmez · Verileriniz cihazınızda".

### 0.6 "Dini her yönüyle" — içerik haritası ve boşluk denetimi

Uygulama ücretsiz ama kapsamlı olmalı. Fable önce mevcut içeriği (`articles.js`, `cmsContent.js`,
`siyerData.js`, `prophets.js`, `elifba.js`, `esmaData.js`, `dailyHadith.js`, `hadiths.json`, Dönüş müfredatı)
şu haritaya göre tablolar, boşlukları işaretler (`docs/icerik-haritasi.md`):

| Alan | Alt başlıklar |
|---|---|
| İman | Altı esas; Allah'ın sıfatları; Esmâ-i Hüsnâ |
| İbadet | Taharet (abdest, gusül, teyemmüm); namaz (vakitler, kılınış, kaza, cuma, bayram, cenaze); oruç; zekât ve fitre; hac ve umre; kurban |
| Kur'an | Okuma (Elif-Bâ, tecvid temelleri), meal, nüzul, sureler rehberi |
| Hadis ve sünnet | Kaynak gösterilmiş hadisler, sünnet kavramı |
| Siyer | Peygamber Efendimizin hayatı, peygamberler tarihi (tasvirsiz) |
| Ahlak | Güzel ahlak, kul hakkı, aile, komşu, çevre, dijital ahlak |
| Gündelik fıkıh | Helal-haram temelleri, yolculuk, hastalık, iş hayatı |
| Dua ve zikir | Günlük dualar, tesbihat, istiğfar |
| Mübarek günler | Kandiller, Ramazan, bayramlar, hicri takvim |
| İslam tarihi ve medeniyeti | Medeniyet, ilim, sanat (hat, tezhip, mimari) |

Kurallar:
- **Mezhep:** varsayılan Hanefî; ayarlarda Şâfiî seçeneği. Fark olan yerde (abdest, vitir, vakit) iki görüş
  de kısaca gösterilir.
- **Her metin kaynaklı:** ayet → sure:ayet; hadis → kaynak ve numara; fıkıh bilgisi → Diyanet ilmihali gibi
  bir kaynağa atıfla, **ama başka eserden metin kopyalanmaz**, özgün anlatım yazılır.
- **Fetva verilmez.** Kişisel dini sorular için AI rehber Diyanet'in fetva hattına (ALO 190) ve e-Diyanet'e
  yönlendirir.
- Her içerik kartında "Kaynak" satırı ve "Hata bildir" düğmesi olur.

---

## FAZ 1 — Tema sistemi ve yazı stili  `[pano: J1 Tema stüdyosu, J4 Tema sistemi]`

### 1.1 Tema = tek JSON dosyası
`frontend/src/themes/<id>.json` — `ThemeContext.js` bu klasörü okur (build sırasında `import.meta`/`require.context` ile).

```json
{
  "id": "sevgi",
  "name": { "tr": "Sevgi", "en": "Compassion", "ar": "المحبة" },
  "mode": "light",
  "colors": { "bg": "#FBF1EE", "surface": "#FFFFFF", "text": "#2E1C1C", "muted": "#7A5F5C", "accent": "#B4505A", "onAccent": "#FFFFFF" },
  "fonts": { "ui": "Inter", "reading": "Lora", "arabic": "Amiri" },
  "motion": "yumusak",
  "ambient": "su",
  "motif": "gul"
}
```

Kurallar: `text`/`bg` ve `accent`/`bg` kontrastı ≥ 4.5:1 (yüklemede kontrol, geçmezse tema listelenmez);
üç dilde ad zorunlu; `motion` ∈ {kapali, cok-yavas, yavas, yumusak, normal, canli}; `ambient` ∈ `ambient.js` TRACKS id'leri.

### 1.2 Başlangıç temaları
| id | Ad | bg | surface | text | muted | accent | hareket | ses |
|---|---|---|---|---|---|---|---|---|
| zumrut | Zümrüt (varsayılan) | #0A1F14 | #11291B | #F5F5DC | #9DB3A5 | #D4AF37 | normal | ney |
| isilti | Işıltı · Radiance · الإشراق | #FBF8F1 | #FFFFFF | #1E1A12 | #6B6355 | #B07A12 | canli (vurgu çizgisinde altın parıltı) | ney |
| husu | Huşu · Reverence · الخشوع | #0B1A1F | #122A30 | #E6EFEC | #8FA9A6 | #7FC4B8 | cok-yavas | gece |
| sevgi | Sevgi · Compassion · المحبة | #FBF1EE | #FFFFFF | #2E1C1C | #7A5F5C | #B4505A | yumusak | su |
| sukun | Sükûn · Serenity · السكينة | #EEF1F3 | #FFFFFF | #1C232A | #56626D | #4F6D86 | yavas | serenity |
| bereket | Bereket · Abundance · البركة | #F4F0E2 | #FFFDF6 | #26261A | #5F5E48 | #5C6A22 | normal | su |

Mevcut `light`, `dark`, `emerald`, `kids` temaları bu biçime taşınır; `kids` çocuk modunda kilitli kalır.

### 1.3 Yazı stili
`readingSettings.js` genişletilir: `arabicFont`, `readingFont`, `uiFont`.
- Arapça (OFL): Amiri (varsayılan; Kur'an için "Amiri Quran"), Scheherazade New, Noto Naskh Arabic, Reem Kufi (başlıklar).
- Okuma: Lora, Inter, Noto Serif. Arayüz Arapça: IBM Plex Sans Arabic.
- Fontlar `public/fonts/` altına konur (çevrimdışı için); Google Fonts yalnız geliştirmede.

**Kabul:** Tema stüdyosunda tema/font seçince bütün uygulama 300 ms içinde geçer; seçim kalıcı; yeni bir JSON eklemek kod değişikliği istemez.

---

## FAZ 2 — Ayarlar v2, konum ve bildirimler  `[pano: J2 Ayarlar, J3 Bildirimler]`

### 2.1 Ayarlar yapısı (`SettingsPage.js` yeniden yazılır)
Görünüm (tema, yazı stili, boyut) · Dil (arayüz dili, meal dili — ayrı) · Konum · Bildirimler (vakitler, takip) · Hareket ve ses · Gizlilik · Hakkında (lisanslar).

### 2.2 Konum (şu an uygulamada **hiç yok**; şehir elle seçiliyor)
- Yerel: `@capacitor/geolocation` (pakete eklenir). Web: `navigator.geolocation`.
- Koordinat → il/ilçe: **dış API kullanılmadan**, uygulama içindeki il/ilçe merkez koordinatları tablosuyla en yakın eşleşme (`src/data/locations.json`). Gizlilik: koordinat sunucuya gönderilmez.
- "Konumu güncelle" düğmesi + "otomatik konum" anahtarı; şehir değişince vakitler yenilenir.
- "Yolculuk algılama": kayıtlı şehirden ~90 km uzaklaşınca seferîlik bilgisini nazikçe hatırlatır (bilgi verir, hüküm vermez).
- İzin reddedilirse mevcut 81 il listesiyle elle seçim kalır.

### 2.3 Bildirimler
- Yerel: `@capacitor/local-notifications` (zaten bağımlılıkta). Web: Service Worker `showNotification`. Mevcut `schedulePrayerReminder` `setTimeout` kullanıyor — güvenilmez, değiştirilir.
- Önümüzdeki 7 günün vakitleri her açılışta yeniden planlanır.
- **Vakit bildirimi**: vakit bazında aç/kapa; zaman: vaktinde / 10 / 15 / 30 dk önce; ses: kısa ezan / çan (cihazda üretilen) / titreşim.
- **Namaz takibi**: vakit çıkmadan 30 dk önce, işaretlenmemişse; eylem düğmeleri **Kıldım** / **Sonra** (LocalNotifications action types). "Kıldım" uygulamayı açmadan kaydeder.
- **Dua takibi**: sabah ezkârı, akşam ezkârı, günün duası (saat seçilir), Cuma (Kehf), kandil ve Ramazan (imsak/iftar).
- Sınırlar: takip bildirimi günde en fazla 2; sessiz saatler (varsayılan 23:00–imsak); Huzur katmanı sessiz modu açıksa hiçbiri gelmez.
- Dil: soru sorar, emir vermez, suçlamaz. Metinler i18n anahtarı (TR/EN/AR).
- Veri: takip kayıtları cihazda; hesaba yedek yalnız kullanıcı açarsa.

**Kabul:** Telefon kapalı/uygulama kapalıyken bildirim saatinde geliyor; "Kıldım" eylemi kaydı oluşturuyor; sessiz saatte bildirim yok.

---

## FAZ 3 — Yeni Mushaf  `[pano: K1 Mushaf, K2 Ayet menüsü]`

- Veri: Tanzil Uthmani metni + Tanzil metaverisindeki **sayfa** bilgisi (Medine Mushafı, 604 sayfa), cüz ve hizb sınırları. Metin `public/quran/` altına gömülür (çevrimdışı).
- Görünüm modları (üstte üçlü seçici): **Mushaf** (tam sayfa, iki yana yaslı, sure başlık bandı, ayet sonu ﴿٥﴾), **Meal** (seçili meal dilinde tam sayfa akış), **İkisi** (her ayetin altında meali).
- Meal dili arayüz dilinden bağımsız (TR / EN). Arapça arayüzde bile Türkçe meal seçilebilir.
- Kaydırma ile sayfa çevirme; sayfa numarası Arap-Hint rakamıyla; çerçeve ve bant renkleri temadan.
- Ayete uzun basınca menü: Dinle · Kelime kelime · Açıklama · Not al · Yer imi · Ezbere ekle · Kart paylaş · Kopyala.
- Dinlerken okunan ayet vurgulanır, sayfa kendiliğinden döner (ayet bazlı ses URL'leri mevcut).
- Mevcut `MushafReader.jsx` içindeki ekran açık tutma (keep-awake) korunur.
- Kopyalama ve paylaşımda Arapça metin değiştirilmeden ve sure:ayet atfıyla verilir.

**Kabul:** 604 sayfanın tamamı çevrimdışı açılıyor; üç mod arasında geçişte okunan ayet korunuyor; Arapça metin Tanzil dosyasıyla bayt bayt aynı.

---

## FAZ 4 — Üç dil: TR · EN · AR  `[pano: K3 Arapça arayüz, K4 Çok dil mimarisi]`

Durum (koddan): `i18n/en.js` 1301 satır, `i18n/ar.js` 764 satır (~%59). Türkçe metinler `i18n/index.js` ve bileşenlerde dağınık.
- Türkçe `i18n/tr.js` olarak ayrılır; bileşenlerdeki sabit Türkçe metinler anahtara taşınır.
- Arapça eksikleri tamamlanır. Yedek zinciri: `ar → en → tr` (boş metin asla gösterilmez).
- `scripts/check-i18n.mjs` (mevcut) eksik anahtarlarda build uyarısı verir.
- Arapça seçilince kökte `dir="rtl"`, `lang="ar"`; Tailwind `rtl:` varyantları ve mantıksal özellikler (`ms-`, `me-`, `ps-`, `pe-`).
- Ok/geri ikonları aynalanır; saat, medya ve marka ikonları aynalanmaz.
- Arapçada Arap-Hint rakamları (`Intl.NumberFormat('ar-SA-u-nu-arab')`), hicri tarih (`Intl.DateTimeFormat(…, { calendar: 'islamic-umalqura' })`).
- İçerik dosyaları (hadis, dua, Esmâ, tema adları, bildirimler) `{ tr, en, ar }` alanları taşır; çevirisi olmayan içerikte küçük "çeviri yok" notu.
- İlk açılışta dil cihaz dilinden seçilir; Ayarlar › Dil'den değişir.

**Kabul:** Arapça seçilince tüm ekranlar sağdan sola ve kırılmadan; dil değişimi yeniden başlatmadan uygulanıyor.

---

## FAZ 5 — Hangi Sure? ailesinden oyunlar  `[pano: L1 Hangi Peygamber?, L2 Oyun fikirleri]`

Ortak kalıp (mevcut `pages/games/WhichSurah.jsx` şablon alınır): ipuçları birer birer açılır,
az ipucuyla bilmek çok XP (1 → 25, 2 → 15, 3 → 8, 4 → 5), 4 şık, her turun sonunda öğreten açıklama kartı.
İlk ipucu bilerek iki cevaba uyar (dedektif eleme hissi). Doğru: mühür animasyonu; yanlış: hafif sallanma + açıklama.

| Oyun | Veri | Not |
|---|---|---|
| Hangi Peygamber? | `data/prophets.js` + yeni ipucu alanı | Örnek turlar tuvalde (Yûnus, Eyyûb). |
| Hangi İsim? | `data/esmaData.js` (99 özgün tefekkür cümlesi) | Cümlede ismin kendisi gizlenir; cevap 99 İsim Defteri'ne eklenir. |
| Ayet Nerede? | Tanzil Arapça metin + sure metaverisi | Meal gerekmez → telifsiz. İpuçları: Mekkî/Medenî, cüz, ayet sayısı. |
| Mekke mi, Medine mi? | Tanzil sure metaverisi | 60 sn kaydırma, seri bonusu. |
| Siyer Dedektifi | `data/adventureData.js` | Macera haritası duraklarını açar. |
| Hangi Sahabe? | yeni `data/sahabe.js` (özgün kısa biyografiler) | İçerik yazımı gerekir. |
| Kökü Bul | `data/kelimeMeal.js` | Kelime defterini besler. |
| Harf Dedektifi | `data/elifba.js` | Çocuk modu; puan yerine yıldız. |
| Cuma Bulmacası | yukarıdakilerin karışımı | Haftalık, aile birlikte. |

Her oyunun içerik dosyasında `source` alanı (sure:ayet veya kitap:numara) zorunlu.

---

## FAZ 6 — Ekstra eklentiler  `[pano: L3 Eklentiler]`

Öncelik sırası (kolaydan zora):
1. Dua defteri ve dua takibi (gizli, web) · 2. Kaza namazı planlayıcı (web) · 3. Zekât/fitre hesaplayıcı (fitre tutarı yıllık veri dosyası) ·
4. Ramazan modu (imsakiye, sahur/iftar sayacı, oruç takibi; tema Bereket) · 5. Tilavet takipli okuma ·
6. Okuma halkası (Firestore) · 7. Hac/umre çevrimdışı rehber · 8. Ses tuşuyla tesbih (yerel eklenti) ·
9. Ana ekran widget'ı ve kilit ekranı geri sayımı (yerel kod: Android widget, iOS WidgetKit/Live Activity) ·
10. Cami hatırlatıcısı (konum, yalnız cihazda) · 11. Akıllı saat tesbihi.

---

## FAZ 7 — Dönüş Odası: derinleştirme ve yeni Eşik (kapı · kandil · ney)  `[pano: E3 Seri, E4 Hareket]`

### 7.1 Mevcut yapının analizi (kod okundu, 2026-11-14)

Dönüş Odası uygulamanın **en özgün parçası**; yeniden yazılmaz, derinleştirilir.

| Parça | Dosya | Ne yapıyor |
|---|---|---|
| Motor | `services/returnEngine.js` | `pathEngine`'i sarar. **Şefkat serisi:** 3 kredi; boş gün 1 kredi yer, dolu gün geri verir; kredi bitince seri sıfırlanır ama krediler yenilenir. **Kademeli yük:** 1–3. gün 1 görev → 4–9: 2 → 10–20: 3 → 21+: 4 |
| Müfredat | `data/returnPath.js` (+ `.en.js`) | 40 gün, 5 evre: Kapı (1–7) · Temel (8–16) · Bağ (17–26) · Ahlak (27–34) · Kökleşme (35–40). İlk ders "Kapı hep açıktı" |
| Mertebeler | `RETURN_STAGES` | Niyet → İlk Adım (3) → Dönüş (10) → Yerleşme (21) → Kökleşme (40). Ölçü "tam gün" değil "yolda geçen gün" |
| Emanet | `DonusMektup.jsx` | 1. gün kendine mektup; mühürlenir, 40. gün açılır, cihazdan çıkmaz |
| Kırkıncı Sır | `KirkinciSir.jsx`, `data/donusPerde.js` | Tek cümle, bölüm bölüm açılır; kapalı parçalar bulanık |
| Perde | `DonusPerde.jsx`, `PerdeSahne.jsx` | 40 anlatı sahnesi, tasvirsiz |
| Eşik | `GateAnimation.jsx` | Kıvılcım → alev → rub'ul hizb deseni → isimle selam → açılış (~4,7 sn) |
| Eşik sesi | `services/donusAudio.js` | Web Audio: nefes gürültüsü + Hicaz arpeji (D–Eb–F#–G) + iki tını. Kayıt yok, telifsiz |
| Seslendirme | `services/donusVoice.js` | `/audio/donus/perde-01.mp3`… çalar, satır/sahne senkronu var |

**Bu turda düzeltilen hatalar (Claude, 2026-11-14):**
1. `returnEngine.js` `saveProfile`'ı import etmiyordu → `enableReturnMode()` (DonusShell'deki "Dönüş yoluna gir")
   `ReferenceError` atıyordu. Import eklendi.
2. `todayKey()` UTC kullanıyordu → Türkiye'de 00:00–03:00 arası "dün" sayılıyordu; seri, dönüş günü ve
   şefkat kredisi kayıyordu. `pathEngine.js`'e yerel `localKey()` eklendi; `todayKey`, `getStreak` ve
   `reconcile` onu kullanıyor. **Kalan iş:** projede 7 yerde daha `toISOString().slice(0, 10)` var
   (`grep -rn "toISOString().slice(0, 10)" frontend/src`); gün anahtarı olarak kullanılanlar `localKey`'e çevrilir.

**Boşluklar (Fable yapacak):**
| # | Sorun | Çözüm |
|---|---|---|
| 1 | Seslendirme dosyalarının hiçbiri yok (`public/audio/donus/` yalnız README) → perdeler hiç sesli okunmuyor | Sen kendi sesinle okursan telif sorunu olmaz. Kayıt yokken düğme gizlenir (`hasVoice` zaten var); "Sesli okuma yakında" yazılmaz, hiç gösterilmez |
| 2 | Bütün durum `localStorage`'da: telefon değişince 40 günlük yol ve mektup kaybolur | Gün, krediler, okunan günler, rozetler → giriş yapmışsa Firestore `users/{uid}/donus`. **Mektup sunucuya gitmez** (söz verildi): "Bu cihazda saklı" uyarısı + isteğe bağlı, kullanıcının parolasıyla cihazda şifrelenmiş `.emanet` dosyası olarak dışa aktarma |
| 3 | Odaya giriş gizli: yalnız Nur Yolu değerlendirmesinde ilk soruya "dönüyorum" diyen giriyor | **Sessiz davet:** kullanıcı 14+ gün uygulamaya girmemişse açılışta tek kart: "Hoş geldin. Kaldığın yerden mi devam edelim, yeni bir başlangıç mı?" Suçlama, sayı, "kaçırdın" yok. Ana ekranda ve Keşfet'te kalıcı "Dönüş Odası" kapısı |
| 4 | Kredi bitince seri "0" görünüyor | Sayı yerine dil: "Yol yeniden başladı, geçmiş günlerin silinmedi." Toplam yolda geçen gün hiçbir zaman sıfırlanmaz ve öne çıkan sayı odur |
| 5 | 40. günden sonrası belirsiz (`graduateToNormal`) | Mezuniyet sahnesi + mektubun açılışı + Kırkıncı Sır'ın tamamı tek gecede. Ardından "Yolda kal" modu: haftada bir kısa ders. Kişi yeniden koparsa Oda onu **kaldığı evreden** karşılar, baştan değil |
| 6 | Namaz takibi (Faz 2) ile bağ yok | Dönüş modunda namaz hatırlatması **tek vakitle** başlar (10. gün dersi "Tek bir vakitle başla" ile aynı gün açılır); kişi "bir vakit daha ekle" demedikçe artmaz. Kaza konusunda "Endişeyi ertele" dersi bildirime de yansır: kaza sayacı dönüş modunda gizli |
| 7 | Test yok | `TZ=Europe/Istanbul` ile `reconcile`, `getReturnDay`, `getTaskCount` birim testleri; 01:30'da açılış senaryosu dahil |

### 7.2 İnsanı Odaya bağlayan yapı — bağımlılık değil, ahit

İlke: kişi uygulamaya değil, **kendi dönüşüne** bağlanmalı. Kara desen (FOMO, kayıp korkusu, utandırma)
kesinlikle yok.

- **Günlük ritim:** Oda her gün aynı kısa eşikle açılır (2,5 sn). Uzun eşik yalnız ilk girişte, evre
  geçişlerinde ve 40. gecede.
- **Evre geçiş sahneleri:** 7., 16., 26., 34. günlerin sonunda kısa bir "kapıdan geçiş" sahnesi ve bir sonraki
  evrenin rengi ile makamı tanıtılır (7.3).
- **Mühür sayacı:** "Emanetin 23 gündür mühürlü." Ana ekranda küçük, sessiz.
- **Kırkıncı Sır'ın açılan parçası** her evre sonunda.
- **Yol defteri:** her günün dersinden tek cümlelik kişisel not (isteğe bağlı); 40. gün mektupla birlikte
  bir kitapçık gibi okunur. Cihazda kalır.
- **Yoldaş (isteğe bağlı):** bir arkadaşa davet bağlantısı; ikisi yalnız birbirinin "bugün yoldaydı" bilgisini
  görür, içerik ve not görünmez.
- **Bildirim:** en çok günde 1, kullanıcı seçtiği saatte, açıkça izinle. Metinler davet dilinde:
  "Kandilin yanıyor." Asla "Serin kırılmak üzere!" değil.

### 7.3 Yeni Eşik: aralık kapı, kandil ve ney

**Kavram — "Kapı hep açıktı":** Mevcut koddaki not kapıyı engel olarak görüp kandili seçmiş. İkisi birleşir:
kapı **zaten aralıktır**, kandilin ışığı aralıktan sızar. Kişi dokununca kapıyı **o itmez**; kanatlar
kendiliğinden açılır. Bu, ilk dersin cümlesinin sahnesidir. Tasvir yok: yalnız kapı, kemer, ışık, desen, toz.

**Sahne akışı (uzun sürüm ~7 sn, kısa sürüm 2,5 sn, her an "Geç" düğmesi):**
| # | Zaman | Görüntü | Ses |
|---|---|---|---|
| 0 Eşikte | bekler | Karanlık; ahşap, çivili, sivri kemerli çift kanatlı kapı hafif aralık. Aralıktan ve eşiğin altından ince altın ışık çizgisi. Uzakta havada süzülen toz zerreleri. "Dokun" | Çok kısık şadırvan (`ambient.js`) |
| 1 Nefes | 0–1,2 sn | Işık çizgisi nefes gibi genişleyip daralır | **Ney üflemesi:** önce yalnız nefes gürültüsü, sonra perdeye oturan ses (ney'in "üfleyerek bulma" karakteri) |
| 2 Açılış | 1,2–3,2 sn | Kanatlar `rotateY` ile içe doğru, yavaş-hızlı-yavaş açılır (perspektif 1200px). Işık zemine yelpaze gibi yayılır, toz zerreleri ışıkta parlar. Mobilde kanat açılırken hafif titreşim (`@capacitor/haptics`, `light`) | Ney taksimi: evrenin makamında 4–6 nota, gecikmeli vibrato |
| 3 Kemer | 3,2–4,8 sn | Kemerin içinde rub'ul hizb deseni kendini çizer (mevcut `Pattern`); kandil kapının ortasında belirir | Desen kapanırken iki tını (mevcut `chime`) |
| 4 Selam | 4,8–6 sn | "Hoş geldin, {ad}" + "{evre} · {gün}. gün". Evrenin rengi ışığa karışır | Ney'in uzun son sesi, yavaşça sönümlenir |
| 5 Oda | 6–7 sn | Işık odaya dönüşür, Oda belirir | Şadırvan normal düzeyine çıkar |

**Evre renkleri ve makamlar:**
| Evre | Renk (ışık / zemin) | Makam | Neden |
|---|---|---|---|
| Kapı (1–7) | Amber `#F0B429` / `#1A1208` | Hicaz | Özlem, uzaktan dönüş |
| Temel (8–16) | Zümrüt `#34D399` / `#06140F` | Rast | Düzen, sağlam başlangıç |
| Bağ (17–26) | Lacivert-altın `#7DA2FF` / `#0A0F1F` | Uşşak | Yakınlık, sohbet |
| Ahlak (27–34) | Gül `#F7A8B8` / `#1A0D11` | Nihavend | Yumuşaklık, incelik |
| Kökleşme (35–40) | Toprak-altın `#D9A066` / `#140E08` | Rast (tam dönüş) | Eve varış |

**Ney sentezi (`donusAudio.js` v2, kayıt yok → telifsiz):**
- Kaynak: üçgen dalga + hafif testere karışımı → alçak geçiren süzgeç (~2,4 kHz) → ses.
- Nefes: beyaz gürültü → bant geçiren süzgeç (nota frekansının ~2 katı, Q≈1,5); her notanın başında %35,
  sonra %12'ye iner.
- Vibrato: nota başladıktan 0,3 sn sonra başlar, 5 Hz, derinlik 0'dan ~15 sent'e yavaşça açılır.
- Notalar arası 60–90 ms kayma (glissando); her notaya hafif crescendo.
- Uzam: mevcut gecikme + bir `ConvolverNode` için kodla üretilen kısa yankı tepkisi (dosya yok).
- Makam perdeleri (karar sesinden sent, 53 koma sisteminin **yaklaşık** karşılığı):
  - Rast: 0 · 204 · 384 · 498 · 702 · 906 · 1086 · 1200
  - Uşşak: 0 · 181 · 294 · 498 · 702 · 792 · 996 · 1200
  - Hicaz: 0 · 113 · 384 · 498 · 702 · 792 · 996 · 1200
  - Nihavend: 0 · 204 · 294 · 498 · 702 · 792 · 1088 · 1200
- Karar sesi D4 (293,66 Hz) civarı; motifler karardan çıkıp karara döner (seyir hissi).
- İsteğe bağlı gerçek ney kaydı: yalnız kendi kaydın veya açık lisanslı (CC0/CC BY) kayıt; `sources.json`'a yazılır.

**Teknik kurallar:**
- `prefers-reduced-motion` → kapı açılmaz, ışık yumuşak geçişle belirir; ses yine isteğe bağlı.
- Sessiz mod (`AtmosphereProvider`) açıksa ses hiç çalmaz; eşiğin kendi ses düğmesi kalır (`setGateSound`).
- Ses yalnız dokunuştan sonra başlar (tarayıcı kuralı; ayrıca girişi bilinçli kılar).
- Yalnız `transform` ve `opacity` canlandırılır; toz zerreleri tek `<canvas>`, en çok 40 parçacık.
- Kısa/uzun sürüm seçimi: `lastGateLong` tarihi + evre değişimi kontrolü.
- **Kur'an metni ve Arapça ayetler hiçbir efektin üstünde ya da içinde gösterilmez.**

---

## FAZ 8 — Başka uygulamada olmayan fikirler  `[pano: yok — Fable ihtiyaç duyarsa tuvale ekler]`

Sıra önerisi: 8.1 ve 8.4 önce (Türkiye'ye özgü, ucuz, telifsiz). 8.10 en son (teknik olarak en zor).
Genel kurallar burada da geçerli: ibadete XP yok, utandırma yok, bildirim izinle ve günde en çok 1 davet,
kişisel veri cihazda, Kur'an metni Kurul onayına bağlı (0.4).

### 8.0 Rakiplerden toplanan, tek uygulamada birleşecek özellikler
Tarteel (ezber + hata tespiti), FivePrayer (ezan anında kilit, ülkeye göre vakit yöntemi), Pillars (gizlilik,
alışkanlık), Mawaqit (cami senkronu), Quran+ (sesle eşzamanlı kelime, hatim halkası, kök bilgisi), Muslim Pro
(genişlik). IslamAPP2'de karşılıkları: `hifzEngine.js`, Faz 2 bildirimleri, cihazda veri, `kelimeMeal.js`,
ailece hatim (I-Plan), içerik haritası (0.6). Fark: **hepsi tek, Türkçe, ücretsiz, reklamsız uygulamada.**
Yapılacak: her biri için "bizde var / eksik / plan" tablosu `docs/rakip-karsilastirma.md`.

### 8.1 Vakitlerin makamı
- Gelenek: sabah **Saba**, öğle **Rast**, ikindi **Hicaz**, akşam **Segâh**, yatsı **Uşşak**.
- Vakit hatırlatma tonu (4–6 sn) ve o vakitteki atmosfer sesi, Faz 7.3'teki ney sentezi ile o makamda çalar.
- `donusAudio.js` v2'deki makam tablosuna eklenecek perdeler (karardan sent, yaklaşık):
  - Saba: 0 · 150 · 294 · 384 · 702 · 792 · 996 · 1200
  - Segâh: 0 · 113 · 317 · 498 · 589 · 815 · 1019 · 1200
- Bildirim sesi için her makamdan önceden üretilmiş kısa `.wav` dosyaları (build sırasında `scripts/render-makam.mjs`
  ile Web Audio `OfflineAudioContext`'ten) → Capacitor `LocalNotifications` `sound` alanı. Telifsiz, kayıt yok.
- Ayarlar: "Vakit sesleri: Makam (varsayılan) · Sade tını · Sessiz". Ezan kaydı **eklenmez** (telif + Kurul dışı
  ama hassas); isteyen cihazındaki sesi seçer.
- Her vakit kartında küçük not: "Öğle · Rast makamı" + dokununca 1 cümlelik açıklama.

### 8.2 Huşu perdesi
- FivePrayer'ın "ezan anında kilit"inin yumuşak, isteğe bağlı hali. Varsayılan KAPALI.
- Vakit girince seçilen süre (10/15/20 dk) boyunca: Android'de "Rahatsız Etmeyin" (izin:
  `ACCESS_NOTIFICATION_POLICY`, Capacitor eklentisi yazılır), iOS'ta Odak modu kısayolu önerilir (doğrudan açılamaz).
- Ekranda tam sayfa sakin görünüm: kandil, vakit adı, "Namaza" düğmesi ve "Perdeyi kaldır" (tek dokunuş, onay sorulmaz).
- Kişi perdeyi kaldırırsa hiçbir şey kaydedilmez, yorum yapılmaz.
- Ayarlar: hangi vakitlerde, ne kadar süre, telefon/arama istisnaları.

### 8.3 Gözsüz tesbihat
- Namaz sonrası tesbihat ekranı: ekranın her yerine dokunmak = 1 sayım. Bakmadan kullanılır.
- Titreşim (`@capacitor/haptics`): her sayım `light`, her 33'te `heavy` + kısa tını, bitişte iki tını.
- Sıra: Sübhânallah 33 → Elhamdülillah 33 → Allâhü ekber 33 → tevhid (1). Ekranda yalnız büyük yazı ve ince halka.
- Ses tuşuyla sayım (Faz 6'daki yerel eklenti) ve akıllı saat ile birleşir.
- Ekran karartma: 10 sn dokunulmazsa parlaklık düşer, sayım sürer (`@capacitor-community/keep-awake`).
- Sayılar kaydedilmez, istatistik yok, XP yok.

### 8.4 Rahmet defteri
- Vefat etmiş yakınların listesi: ad, yakınlık (isteğe bağlı), vefat tarihi (isteğe bağlı, hicri/miladi).
  **Yalnız cihazda**; Firestore'a gitmez.
- Hatırlatma (isteğe bağlı): perşembe akşamı / cuma gecesi ve kandil gecelerinde
  "Bu gece onlar için bir Fâtiha okumak ister misin?" Vefat yıldönümünde tek bir sessiz kart.
- "Okudum" düğmesi yalnız o gecenin kartını kapatır; sayı tutulmaz.
- Ailece hatim (I-Plan) ile bağ: hatim başlatırken "Kimin ruhuna?" alanı; aile üyeleri cüz alır.
- Dil: yas tutan birine uygun, sade. Çiçek, emoji, kutlama animasyonu yok.
- Dua metinleri kaynaklı (0.6); Yâsîn vb. Kur'an metni gösteriliyorsa Kurul onayı kapsamında (0.4).

### 8.5 Suçlamasız kaza planı
- Dönüş Odası'ndaki "Endişeyi ertele" dersinden SONRA ve kişi isterse açılır; Dönüş modunda varsayılan gizli.
- Kurulum: "Günde kaç kaza kılmak istersin?" (1 önerilir). Toplam borç **istenmez ve gösterilmez**.
- Yalnız kılınanlar görünür: "Bu ay 18 kaza kıldın." Kaçırılan gün yoktur, plan yalnız ileriye bakar.
- Bildirim: kişinin seçtiği tek vakitten sonra, isteğe bağlı.
- Hanefî/Şâfiî farkı (0.6) kılınış rehberinde gösterilir.

### 8.6 Esnek hatim
- Hedef: tarih (ör. Ramazan başı, kandil, kendi tarihi) veya süre (30/60/90 gün).
- Her gün "bugünkü pay" = kalan sayfa / kalan gün (604 sayfalık Mushaf düzeni, Faz 3). Kişi bir gün okumazsa
  pay ertesi günlere sessizce dağılır; "geride kaldın" yazısı yok.
- Pay günde 20 sayfayı aşacaksa nazik öneri: "Tarihi biraz uzatalım mı?"
- Ailece hatimle birleşebilir (cüz paylaşımı). Hatim bitince sade bir hatim duası sayfası.

### 8.7 Kandil ışık haritası
- Mübarek gecelerde (Kandil.jsx + hicri takvim) Türkiye haritası; il il o gece "okudum/dua ettim" diyenlerin
  **anonim toplam** sayısı ışık yoğunluğu olarak yanar.
- Gizlilik: kişi konumunu değil, kendi seçtiği ili gönderir (Faz 2 konumundan öneri, onayla). Gönderilen tek şey
  `{gece, il}`; kullanıcı kimliği yok. Firestore'da `kandil/{gece}/iller/{il}` sayacı, `increment()` ile;
  cihaz başına gecede 1 kez (yerel bayrak + App Check). İlde 10'dan az kişi varsa gösterilmez.
- Görsel: koyu harita, il sınırları ince çizgi, ışık noktaları; toplam sayı küçük. Sıralama/rekabet YOK.
- Harita verisi: açık lisanslı Türkiye il sınırları GeoJSON (lisansı `sources.json`'a).

### 8.8 Duygudan eyleme
- Mevcut `emotionMap.js` ve kullanılmayan `EmotionWidget.jsx` genişletilir: her duygu için
  **1 ayet (meal) + 1 dua + 1 somut, 2 dakikalık eylem** (abdest al, pencereyi aç, birine mesaj at, 10 nefes say,
  su iç, kısa yürüyüş).
- Eylem kartında "Yaptım" yok; yalnız "Teşekkürler" ve "Başka bir öneri".
- Ağır duygular (umutsuzluk, kendine zarar düşüncesi) için içerik yerine **önce yardım**: 112 ve güvenilen birine
  ulaşma kartı. Bu içerik bir uzmanla gözden geçirilir; AI burada yanıt üretmez.
- Ayetler Kurul onayı kapsamında (0.4).

### 8.9 Hayat ayetleri defteri
- Ayet menüsüne (K2) "Defterime ekle": ayet + tarih + kişinin tek cümlelik notu (isteğe bağlı) + o anki duygu (isteğe bağlı).
- Yalnız cihazda; isteğe bağlı şifreli dışa aktarma (Faz 7.1'deki `.emanet` yöntemi).
- Yıl sonu (veya hicri yılbaşı) "Bu yıl seninle kalan ayetler" sayfası: zaman çizelgesi, sade, paylaşım isteğe bağlı
  (paylaşım kartında not gösterilmez).

### 8.10 Harf mahreci koçu (en son)
- Elif-Bâ (`elifba.js`) içinde: harf sesi dinlenir, kişi söyler, uygulama basit geri bildirim verir.
- **Cihazda** çalışır, ses sunucuya gitmez. Yöntem önerisi: harf başına küçük bir ses sınıflandırıcı
  (TensorFlow.js / TFLite, MFCC özellikleri) — eğitim verisi yalnız izinli/kendi kayıtlarından.
- Geri bildirim dili: "Yaklaştın, dil ucunu biraz daha..." gibi; puan ve yüzde yok.
- İlk sürüm yalnız karışan harf çiftleri: س/ص, ت/ط, ذ/ز/ظ, ح/ه, ع/ء, ق/ك.
- Başarısızlık durumunda özellik gizlenir; yanlış "doğru" demek, hiç dememekten kötüdür.

---

## Ek: Daha önceki turlardan bu dosyaya bağlanan işler
- Huzur katmanı (`AtmosphereProvider`), sessiz mod, gün boyu ton, kandil ışığı ve kaza, kandil odası, macera haritası, Esmâ defteri,
  ezber bahçesi, kelimeye dokun, ailece hatim, ana ekran v2, mod sekmeleri, Oyun Merkezi (5 aile), AI rehber, destekçi sayfası,
  paylaşım kartları → tuvaldeki `I-Plan` panosunda fazlara ayrılmış durumda. Bu dosyadaki Faz 0 ve 1 o planın Faz 0 ve 1'inden önce gelir.

## Hukuki not
Bu dosyadaki telif değerlendirmeleri hukuki görüş değildir. Şüpheli her kaynak için hak sahibinden yazılı izin alınır.
Diyanet onayı (0.4) için Kurul'un kendi cevabı esastır; bu dosyadaki usul, yönetmelik ve kanun metninden çıkarılmıştır.
Gelir modeline geçilirse (şu an yok, bkz. 0.5) önce bir fikri mülkiyet avukatına danışılır.
