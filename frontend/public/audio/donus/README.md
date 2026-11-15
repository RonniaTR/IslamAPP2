# Dönüş Odası — Seslendirme Klasörü

Kırk perdenin insan sesiyle okunması için ses dosyaları buraya konur.

## Dosya adları

```
perde-01.mp3   ← 1. gün · "Sen mi geldin?"
perde-02.mp3   ← 2. gün · "Perdenin arkası"
...
perde-40.mp3
```

İki haneli, sıfır dolgulu. `perde-1.mp3` DEĞİL, `perde-01.mp3`.

## Hepsini birden hazırlamak gerekmez

Uygulama açılışta bu klasörü taramaz. Bir perde açıldığında tek bir
istekle o dosyaya bakar:

- **Dosya varsa** → sesli mod. İnsan sesi çalar, okunan satır ekranda
  aydınlanır, diğerleri söner.
- **Dosya yoksa** → okuma modu. Aynı akış kendi temposuyla sürer.
  Hiçbir hata gösterilmez.

Yani bugün 3 perde sesli, 37 perde sessiz olabilir. Kaydettikçe eklenir.

## Kayıt önerileri

| | |
|---|---|
| Biçim | MP3, 96–128 kbps mono yeter |
| Ortam | Sessiz oda; halı/perde varsa daha iyi. Yankı en büyük düşman |
| Mesafe | Mikrofona 15–20 cm, hafif yandan (patlamalı harfler için) |
| Tempo | Acele etme. Cümle aralarında 1–1.5 sn boşluk bırak |
| Ton | Vaaz değil, sohbet. Karşındaki kişi senden daha iyi bir müslüman olabilir — o tonla oku |
| Süre | Metinlerin `sure` alanı hedef süredir (85–95 sn). ±15 sn sorun değil |

Nefes ve yutkunma seslerini temizlemek iyi olur ama şart değil; küçük
insani sesler bu anlatıda kusur değil.

## Zaman damgalarını eşitlemek

Her satırın `t` değeri (saniye) `src/data/donusPerde.js` içinde durur.
Şu an bunlar tahminî. Kaydı yaptıktan sonra:

1. Kaydı bir ses düzenleyicide aç (Audacity ücretsiz).
2. Her satırın başladığı saniyeyi not al.
3. `donusPerde.js` içindeki `lines[].t` değerlerini o saniyelerle değiştir.
4. `sahne[].at` değerlerini de aynı mantıkla ayarla (arka plandaki
   görselin ne zaman değişeceği).

Değerler yaklaşık olsa bile çalışır — satır vurgusu birkaç saniye
kayarsa akış bozulmaz.

## Telif

Bu klasöre yalnızca **kendi kaydınızı** koyun. Başka bir hocanın,
kanalın veya albümün kaydı — kısa bir bölümü bile olsa — Play Store'da
telif şikâyeti sebebidir. Uygulamadaki bütün mevcut sesler (ney taksimi,
giriş tınısı) Web Audio ile üretilmiştir; hiçbiri kayıt değildir.

## Arka plan müziği

Konuşma başladığında arka plandaki ney/ambient sesi otomatik olarak
kısılır, konuşma bitince eski seviyesine döner. Kayda müzik eklemenize
gerek yok — üst üste binerler.
