# Play Console — Veri Güvenliği Formu Rehberi

Play Console > **Politika > Uygulama içeriği > Veri güvenliği** bölümünde
sorulan soruların, bu uygulamanın gerçek davranışına göre doğru cevapları.

> ⚠️ Bu form yanlış doldurulursa uygulama **askıya alınır**. Aşağıdaki
> cevaplar kodun fiilî davranışına göre çıkarılmıştır; özellik eklerseniz
> formu güncelleyin.

---

## Bölüm 1 — Veri toplama

**"Uygulamanız kullanıcı verisi topluyor veya paylaşıyor mu?"**
→ **Evet**

> Not: Yalnızca cihazda kalan veriler (amel defteri, okuma konumu, ezber
> ilerlemesi) Play tanımına göre "toplama" **değildir** — sunucuya
> gitmediği için formda beyan edilmez. Aşağıda yalnızca sunucuya giden
> veriler listelenmiştir.

---

## Bölüm 2 — Veri türleri

### ✅ Kişisel bilgiler → Ad

| Soru | Cevap |
|---|---|
| Toplanıyor mu? | **Evet** |
| Paylaşılıyor mu? | Hayır |
| İsteğe bağlı mı? | **İsteğe bağlı** (misafir girişinde ad girmek zorunlu değil) |
| Amaç | **Uygulama işlevselliği** (liderlik tablosunda görünen ad) |
| Şifreleniyor mu? | Evet (HTTPS) |
| Silme talep edilebilir mi? | **Evet** (e-posta ile) |

### ✅ Kişisel bilgiler → E-posta adresi

| Soru | Cevap |
|---|---|
| Toplanıyor mu? | **Evet** |
| Paylaşılıyor mu? | Hayır |
| İsteğe bağlı mı? | **İsteğe bağlı** (yalnızca Google ile giriş seçilirse) |
| Amaç | **Hesap yönetimi** |
| Şifreleniyor mu? | Evet |
| Silme talep edilebilir mi? | Evet |

### ✅ Konum → Yaklaşık konum

| Soru | Cevap |
|---|---|
| Toplanıyor mu? | **Hayır** — cihazda işlenir, sunucuya gönderilmez |
| Paylaşılıyor mu? | Hayır |

> Kıble açısı ve namaz vakti hesabı cihazda yapılır. Kullanıcı **şehir**
> seçerse yalnızca şehir adı vakit API'sine gider; bu konum verisi değil,
> kullanıcı tercihidir.

### ✅ Uygulama etkinliği → Uygulama içi arama geçmişi / diğer eylemler

| Soru | Cevap |
|---|---|
| Toplanıyor mu? | **Evet** (zikir sayacı, quiz puanı, ibadet işaretleri) |
| Paylaşılıyor mu? | Hayır |
| İsteğe bağlı mı? | Zorunlu (özelliğin kendisi) |
| Amaç | **Uygulama işlevselliği** (seri, istatistik, liderlik) |
| Şifreleniyor mu? | Evet |
| Silme talep edilebilir mi? | Evet |

### ✅ Mesajlar → Diğer uygulama içi mesajlar (AI soruları)

| Soru | Cevap |
|---|---|
| Toplanıyor mu? | **Evet** |
| Paylaşılıyor mu? | **Evet** — AI sağlayıcısına (Google Gemini / Groq) |
| İsteğe bağlı mı? | İsteğe bağlı (AI özelliğini kullanmazsanız gönderilmez) |
| Amaç | **Uygulama işlevselliği** (cevabı üretmek) |
| Şifreleniyor mu? | Evet |

### ❌ TOPLANMAYAN türler (hepsine "Hayır")

- Finansal bilgiler
- Sağlık ve fitness
- Fotoğraflar ve videolar
- Ses dosyaları *(sesli komut cihazda işlenir, kayıt saklanmaz)*
- Kişiler / rehber
- Takvim
- Dosyalar ve belgeler
- Cihaz veya diğer kimlikler (reklam kimliği kullanılmıyor)
- Web tarama geçmişi
- SMS / arama kayıtları

---

## Bölüm 3 — Güvenlik uygulamaları

| Soru | Cevap |
|---|---|
| Veriler aktarım sırasında şifreleniyor mu? | **Evet** (tüm trafik HTTPS) |
| Kullanıcı verisinin silinmesini talep edebiliyor mu? | **Evet** |
| Veri silme yöntemi | E-posta ile talep: sdurak875@gmail.com |
| Play Family Policy'ye bağlı mı? | Uygulama herkese uygun (3+) |
| Bağımsız güvenlik denetimi | Hayır |

---

## Bölüm 4 — Hassas izin gerekçeleri

Play, hassas izinler için gerekçe isteyebilir:

**`ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`**
> Konum, kullanıcının bulunduğu yere göre **kıble yönünü** hesaplamak ve
> **namaz vakitlerini** belirlemek için kullanılır. Konum cihazda işlenir,
> sunucuda saklanmaz ve üçüncü taraflarla paylaşılmaz. İzin isteğe
> bağlıdır; kullanıcı bunun yerine şehir seçebilir.

**`RECORD_AUDIO`**
> Mikrofon yalnızca isteğe bağlı **sesli komut** özelliği için kullanılır
> ve cihazın kendi konuşma tanıma servisine yönlendirilir. Ses kaydı
> alınmaz, saklanmaz veya iletilmez.

---

## Bölüm 5 — Uygulama içi satın alma beyanı

| Alan | Değer |
|---|---|
| Uygulama içi ürün var mı? | **Evet** — Premium abonelik |
| Fiyat aralığı | Aylık / yıllık abonelik |
| Reklam içeriyor mu? | **Hayır** |

> ⚠️ Premium akışı şu an demo olarak çalışıyor (`/premium/activate`).
> Play'e yüklemeden önce **Google Play Billing** entegrasyonu
> yapılmalıdır; aksi halde "harici ödeme" politikası ihlali sayılır.

---

## Yayın sonrası izlenecekler

- İçerik derecelendirme anketini eksiksiz doldurun (dinî içerik "Herkes").
- Hedef kitle: **13 yaş ve üzeri** seçilirse Family Policy yükümlülüğü azalır.
- İlk sürümde **kapalı test** (closed testing) ile 12+ test kullanıcısı
  şartını tamamlamak, yeni geliştirici hesapları için zorunludur.
