# İnceleme erişimi

## Web (önerilen)
Antigravity çalıştırır; komut üretim sitesine dokunmaz, 30 gün geçerli ayrı bir adres üretir:

```bash
cd frontend
REACT_APP_QURAN_PUBLIC=true npm run build
cd ..
firebase hosting:channel:deploy kurul-inceleme --expires 30d
```

Çıkan adresin sonuna `/?inceleme=1` eklenir ve Kurul'a o verilir:

    https://islamapp-5942a--kurul-inceleme-XXXXXXXX.web.app/?inceleme=1    ← [kanal açılınca yazılacak]

**İnceleyen kişi için adımlar**
1. Bağlantıyı açın.
2. Giriş ekranında **"Misafir olarak devam et"**e dokunun (hesap gerekmez).
3. Uygulama doğrudan Kur'an sure listesini açar.

> `firebase.json` içindeki hosting `predeploy` adımı derlemeyi yeniden alıyorsa bayrağın o derlemede de
> tanımlı olduğundan emin olun (`REACT_APP_QURAN_PUBLIC=true firebase hosting:channel:deploy …`).
> Üretim sitesine (`firebase deploy --only hosting`) bayrak **tanımsız** deploy edilir: Kur'an bölümleri kapalı kalır.

## Android
Google Play Console → Dahili test → bağlantı; ya da imzalı APK. Derleme `REACT_APP_QURAN_PUBLIC=true` ile alınır.

## iOS
TestFlight genel bağlantısı. (Apple geliştirici hesabı gerekir.)

## Doğrulama (bağlantıyı vermeden önce)
- [ ] `/quran` açılıyor, sure listesi geliyor
- [ ] Bir surede Arapça metin, meal ve altta meal künyesi (yayıncı · QuranEnc.com · sürüm) görünüyor
- [ ] Tilavet çalıyor
- [ ] Ayarlar › Kaynaklar ve lisanslar sayfası açılıyor
- [ ] Üretim sitesinde `/quran` "Diyanet onay sürecinde" kartını gösteriyor

## Karekod
`inceleme-karekod.png` üretim adresini (`https://islamapp-5942a.web.app/?inceleme=1`) açar. Üretim derlemesinde bayrak
kapalıysa bu adres Kur'an'ı göstermez; o durumda önizleme kanalının adresiyle yeniden üret:
`python make_qr.py "https://…kurul-inceleme….web.app/?inceleme=1"`

## Alınacak ekran görüntüleri (`ekran-goruntuleri/`)
`00-mushaf-sayfa-1.png` · `00-mushaf-sayfa-2.png` · `00-mushaf-ayet-paneli.png` · `01-sure-listesi.png` · `02-sure-okuma-acik-tema.png` · `03-sure-okuma-koyu-tema.png` · `04-meal-kunyesi.png` ·
`05-tilavet-oynatici.png` · `06-cocuk-sure.png` · `07-ezber.png` · `08-kaynaklar-ve-lisanslar.png`
Her görüntü 430 px genişlikte telefon görünümünde alınır.
