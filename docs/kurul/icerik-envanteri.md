# İçerik envanteri

Kaynak: `frontend/src/data/sources.json` (uygulamadaki "Kaynaklar ve lisanslar" sayfası da aynı dosyadan beslenir).
Durum tarihi: 14 Kasım 2026.

## 1. Kur'an-ı Kerim metni
| | |
|---|---|
| Metin | Osmanî resm-i hat (Uthmani), harekeli |
| Kaynak | Tanzil Project (tanzil.net), `quran-uthmani` baskısı — alquran.cloud üzerinden |
| Lisans | Creative Commons Attribution 3.0 |
| Kapsam | 114 sure, 6236 ayet; sayfa bilgisi 604 sayfalık Medine tertibine göre |
| Sunucudaki kopya | `backend/data/quran_arabic.json` |
| SHA-256 | `1f88c48a918994216641fc67a3596562791adcf95b234507ce1211e0ee78e0c8` |
| Değişiklik | Yok. Metin harf, hareke ve durak işaretleriyle olduğu gibi gösterilir. |
| Web istemcisi | Metni çalışma anında `api.alquran.cloud/v1/surah/{n}` adresinden alır. |

**Açık nokta:** Web istemcisi metni üçüncü taraf bir servisten canlı aldığı için Kurul'un incelediği metin ile
kullanıcıya gösterilen metnin aynı kalması o servise bağlıdır. Öneri (Faz 3): metin, SHA-256 değeri sabitlenmiş
olarak uygulamanın içinden sunulsun. Kurul farklı bir metin kaynağı isterse buna göre değiştirilir.

## 2. Yazı tipi
| | |
|---|---|
| Şu an kullanılan | Amiri (SIL Open Font License 1.1) |
| Sayfa düzeni | (1) Tam sayfa Mushaf: 604 sayfa, her sayfada basılı Mushaf'taki ayetler; satır satır hat dizgisi DEĞİL. (2) Ayet ayet liste görünümü. |
| Not | Yönetmeliğe göre yazı tipine Kurul karar verir. Kurul'un bildireceği yazı tipi kullanılacaktır. |

## 3. Mealler
| Dil | Meal | Yayıncı | Kaynak | İzin durumu |
|---|---|---|---|---|
| Türkçe | Türkçe Tercüme — Rowad Tercüme Merkezi (`turkish_rwwad`) | Rowad Tercüme Merkezi | QuranEnc.com | QuranEnc yeniden yayın şartlarıyla kullanılıyor |
| İngilizce | English Translation — Rowwad Translation Center (`english_rwwad`) | Rowwad Translation Center | QuranEnc.com | Aynı |
| Türkçe | Diyanet İşleri Başkanlığı Kur'an-ı Kerim Meali | Diyanet İşleri Başkanlığı | — | **Kullanılmıyor.** İzin bu başvuruda isteniyor; verilirse varsayılan Türkçe meal olacak. |

Meal metinlerine müdahale edilmez; her meal ekranında yayıncı, kaynak ve sürüm numarası gösterilir.

## 3b. Tefsir
| Dil | Tefsir | Yayıncı | Kaynak | İzin durumu |
|---|---|---|---|---|
| Türkçe | Muhtasar Kur'an-ı Kerim Tefsiri — Türkçe Tercüme (`turkish_mokhtasar`) | Kur'an Araştırmaları Tefsir Merkezi | QuranEnc.com | QuranEnc yeniden yayın şartlarıyla |

Tefsir metni değiştirilmez; her gösterimde kaynak ve sürüm yazılır. Bu tefsir yapay zekâ üretimi değildir.

## 4. Tilavet sesleri
| İçerik | Kâri | Sağlayıcı | Kullanım |
|---|---|---|---|
| Ayet ayet tilavet | Mishary Rashid Alafasy (varsayılan); sunucuda seçilebilir diğer kâriler tanımlı | Islamic Network CDN | Akış; uygulamaya gömülmez |
| Sure bütünü | Mishary Rashid Alafasy | mp3quran.net | Akış; uygulamaya gömülmez |
| Sesli meal | Mazlum Kiper | YouTube gömülü oynatıcı | Yalnız YouTube oynatıcısıyla |

**Açık nokta:** Ses sağlayıcılarının yeniden yayın şartları yazılı olarak teyit edilmedi. Kurul belirli kârileri ya da
kendi kayıtlarını şart koşarsa ona geçilecek.

## 5. Renklendirme ve efekt
- Tecvid renklendirmesi: **yok.**
- Ayet metni üzerinde animasyon, parıltı, bulanıklık: **yok.**
- Okuma temaları yalnız zemin ve arayüz rengini değiştirir. Ayrıntı: `kontrol-listesi.md`.

## 6. Yapay zekâ
Ayet açıklamalarında yapay zekâ kullanılan bölümler "Yapay zekâ açıklaması · bir âlimin sözü ya da fetva değildir"
etiketiyle gösterilir. Yapay zekâ Kur'an metni ya da meal üretmez; yalnız açıklama yazar.
**Kurul'a sorulacak:** Bu açıklamalar Kur'an bölümünün içinde gösterilebilir mi, ayrı bir bölüme mi alınmalı?
