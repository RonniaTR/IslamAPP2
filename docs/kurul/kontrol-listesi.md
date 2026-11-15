# Öz denetim listesi

Kur'an-ı Kerim Basım ve Yayım Kriterleri Hakkında Yönetmelik'in dijital eserlere ilişkin, basında ve mevzuat
metninde görülebilen hükümlerine göre. Yönetmeliğin tam metni başvurudan önce bir kez daha okunmalıdır
(mevzuat.gov.tr, "Kur'an-ı Kerim Basım ve Yayım Kriterleri Hakkında Yönetmelik").

| # | Kriter | Durum | Açıklama |
|---|---|---|---|
| 1 | Kurul onayı olmadan yayım yok | ✅ | Kur'an bölümleri `REACT_APP_QURAN_PUBLIC` bayrağıyla kapalı |
| 2 | Kur'an metni değiştirilmez | ✅ | Metin kaynaktan geldiği gibi gösterilir; kodda metni dönüştüren işlem yok |
| 3 | Mehabete uymayan, renk karmaşasına yol açan renklendirme yok | ⚠️ | Aşağıya bakın (A) |
| 4 | Yazı tipine Kurul karar verir | ⏳ | Şu an Amiri; dilekçede Kurul'dan yazı tipi isteniyor |
| 5 | Metin üzerinde efekt/animasyon yok | ✅ | Ayet metninde animasyon yok; etkin ayet yalnız zemin rengiyle belirtilir |
| 6 | Meal metni değiştirilmez, kaynağı belirtilir | ✅ | QuranEnc metni olduğu gibi; künye her ekranda |
| 7 | Hata bildirilirse içerik kaldırılıp düzeltilir | ✅ | Bayrak kapatılarak bölüm tek derlemeyle kaldırılabilir |
| 8 | Onay sonrası değişiklikte yeniden başvuru | ✅ | `AGENTS.md` §6 madde 9'a kural olarak yazıldı |
| 9 | Ayet numarası, secde, cüz/hizb işaretleri doğru | 🟡 | Ayet no, secde, cüz var; hizb ve satır dizgisi yok — aşağıya bakın (B) |
| 10 | Sesli içerik: kâri ve kayıt uygunluğu | ⏳ | Kurul'un görüşü alınacak; sağlayıcı şartları yazılı teyit edilmedi |

## Başvurudan önce karar gerektiren iki madde

**A. Sure okuma ekranının renkleri.** `SurahDetail.js` ayet metnini koyu zemin üzerinde beyaz gösteriyor ve
okuma temaları (7 tema) zemin rengini değiştiriyor. Ayet metni tek renk; ama Kurul koyu zemin/beyaz metni uygun
bulmayabilir. Öneri: inceleme derlemesinde varsayılan görünüm açık zemin + siyah metin olsun, diğer temalar
Kurul'a ayrıca gösterilsin.

**B. Sayfa düzeni ve işaretler.** Tam sayfa Mushaf görünümü eklendi (15 Kasım 2026): sabit kâğıt zemini, tek renk
metin, sure başlıkları, ayrı satırda besmele, ayet sonu numaraları, secde işareti (۩) ve üstte cüz numarası var.
Eksik olan: basılı Mushaf'la **satır satır** aynı dizgi ve hizb/rub işaretleri. Bunun için sayfa-satır verisi
(ör. Quranic Universal Library'deki 604 sayfa/15 satır düzenleri) ve Kurul'un onaylayacağı bir Mushaf yazı tipi gerekir.
Seçenek: (1) şimdiki sayfa görünümüyle başvur ve yazı tipini Kurul'a sor; (2) satır dizgisini bekle.
Yazı tipine zaten Kurul karar verdiği için **(1) daha mantıklı**: önce yazı tipi cevabı gelsin, dizgi ona göre yapılsın.
