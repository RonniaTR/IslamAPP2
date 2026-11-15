# Kurul başvuru dosyası

Diyanet İşleri Başkanlığı Mushafları İnceleme ve Kıraat Kurulu'na yapılacak **dijital eser onayı** başvurusunun
hazırlık dosyaları. Gerekçe ve usul: `docs/YENI_OZELLIKLER.md` 0.4.

| Dosya | Durum |
|---|---|
| `dilekce.md` | Taslak hazır. `[…]` ile işaretli kişisel bilgiler doldurulacak. |
| `kunye.md` | Hazır. Yayın adı ve iletişim bilgisi doldurulacak. |
| `icerik-envanteri.md` | Hazır (14 Kasım 2026 kod durumuna göre). |
| `erisim.md` | Hazır. İnceleme bağlantısı Antigravity kanalı açınca yazılacak. |
| `kontrol-listesi.md` | Hazır. İki madde "uygun değil" — başvurudan önce karar gerekir. |
| `inceleme-karekod.png` | Hazır (üretim adresi için). Önizleme kanalı açılırsa `python make_qr.py "<adres>/?inceleme=1"` ile yeniden üret. |
| `ekran-goruntuleri/` | **Boş.** İnceleme kanalı açıldıktan sonra alınacak (liste `erisim.md` sonunda). |

## Sıra
1. Kurul'u ara: (0312) 295 78 40 — form ve usulü sor (`dilekce.md` başındaki iki soru).
2. Antigravity: inceleme kanalını aç (`erisim.md`).
3. Ekran görüntülerini al, `ekran-goruntuleri/` içine koy.
4. Kurul'un verdiği matbu formu bu dosyalardaki bilgilerle doldur; dilekçeyi imzala.
5. Elden teslim et, evrak kayıt numarasını `kunye.md`'ye yaz.
6. Onay gelince: tarih ve sayıyı `frontend/src/data/sources.json` → `diyanetOnayi` alanına yaz,
   üretim derlemesinde `REACT_APP_QURAN_PUBLIC=true` yap.

## Karekod hakkında
Yönetmelikteki hüküm şudur: **içinde karekod bulunan eserler**, karekodun açtığı ses ve görüntü dosyalarıyla
birlikte başvuruda ibraz edilir. Yani karekod üretmek bir zorunluluk değil; eserde karekod varsa içeriğinin de
gösterilmesi isteniyor. Bizim uygulamada karekod yok. `inceleme-karekod.png` yalnız kolaylık içindir: dilekçenin
ekine basılır, Kurul üyesi telefonuyla okutup inceleme bağlantısını açar.

Bu dosyalar hukuki görüş değildir; usulde Kurul'un kendi cevabı esastır.
