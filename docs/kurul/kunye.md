# Uygulama künyesi

| | |
|---|---|
| Yayın adı | İslamiApp (Bir Kapı) |
| Tür | İslami yaşam uygulaması (Kur'an, namaz vakitleri, dua, ilim içerikleri) |
| Platformlar | Web (PWA), Android, iOS |
| Paket kimliği | `com.ronniatr.islamapp` |
| Sürüm | 1.0.0 |
| Web adresi | https://islamapp-5942a.web.app |
| Kurul inceleme adresi | https://islamapp-5942a--kurul-inceleme-s9d7a4aa.web.app/?inceleme=1 |
| Geliştirici | [Ad Soyad] — gerçek kişi |
| İletişim | [e-posta] · [telefon] |
| Ücret | Ücretsiz. Uygulama içi satın alma ve abonelik yoktur. |
| Reklam | Yoktur. |
| Hesap | Zorunlu değildir (misafir kullanım). |
| Kişisel veri | İlerleme kayıtları cihazda tutulur; giriş yapan kullanıcıda hesabına bağlanır. |
| Evrak kayıt no | [başvuru sonrası yazılacak] |
| Onay tarih ve sayısı | [onay sonrası yazılacak] |

## Kur'an-ı Kerim içeren bölümler
| Bölüm | Yol | İçerik |
|---|---|---|
| Sure listesi | `/quran` | 114 sure adı |
| Mushaf (tam sayfa) | `/mushaf/:sayfa` | 604 sayfa; sabit kâğıt zemini, tek renk metin; ayete dokununca meal ve tefsir |
| Sure okuma | `/quran/:sure` | Arapça metin, Türkçe/İngilizce meal, tefsir, ayet ayet tilavet |
| Sesli meal | `/meal-audio` | Gömülü video oynatıcı |
| Ezber | `/hifz` | Kısa surelerin ayetleri, tekrar takibi |
| Çocuk — sureler | `/kids/quran`, `/kids/surah/:id` | Kısa sureler, meal, tilavet |

Bu bölümlerin hepsi `REACT_APP_QURAN_PUBLIC` bayrağına bağlıdır ve onay gelene kadar halka açık derlemede kapalıdır.

**Kurul'a sorulacak:** İçinde ayet geçen şu bölümler onay kapsamında mı? Dualar (Kur'an kaynaklı dualar),
"Hangi Sure?" oyunu, kelime kelime meal, günün ayeti kartı, Dönüş Odası derslerindeki ayet alıntıları.
Cevap gelene kadar bunlar açık bırakıldı; kapsamdaysa aynı bayrağa bağlanacak.
