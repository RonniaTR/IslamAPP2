# Gizlilik Politikası — İslami Yaşam Asistanı

**Son güncelleme:** 26 Temmuz 2026
**Uygulama:** İslami Yaşam Asistanı (`com.islamapp`)

---

## Özet

Bu uygulama kişisel verilerinizi **satmaz, kiralamaz ve reklam amacıyla
paylaşmaz.** Okuma geçmişiniz, ezber ilerlemeniz ve amel defteriniz gibi
kişisel içerikler **yalnızca cihazınızda** saklanır.

---

## 1. Topladığımız veriler

### 1.1 Cihazda kalan veriler (sunucuya gönderilmez)

Aşağıdakiler tarayıcı/uygulama yerel depolamasında (`localStorage`,
`IndexedDB`) tutulur ve **cihazınızdan çıkmaz**:

| Veri | Amaç |
|---|---|
| Amel defteri kayıtlarınız | Günlük muhasebe — mahremiyet esastır |
| Okuma konumu ("kaldığınız yer") | Kaldığınız yerden devam |
| Ezber ilerlemesi ve tekrar planı | Aralıklı tekrar hesabı |
| Okuma ayarları (tema, yazı boyutu) | Görünüm tercihi |
| Dil tercihi | Arayüz dili |
| Oyun istatistikleri ve rozetler | İlerleme takibi |
| Çevrimdışı indirilen tefsir/sure | İnternetsiz kullanım |

Uygulamayı kaldırdığınızda bu veriler cihazınızdan silinir.

### 1.2 Hesap verileri

| Veri | Ne zaman | Amaç |
|---|---|---|
| Görünen ad | Misafir girişinde siz girerseniz | Liderlik tablosu |
| E-posta, ad, profil fotoğrafı | **Yalnızca** Google ile giriş yaparsanız | Hesap tanıma |
| Anonim misafir kimliği | Misafir girişinde otomatik | Cihazınızı hatırlamak |

Google ile giriş **isteğe bağlıdır**; uygulamayı misafir olarak tam
işlevsel kullanabilirsiniz.

### 1.3 Sunucuya gönderilen diğer veriler

- **Zikir ve ibadet sayaçları:** günlük seri ve istatistik için
- **Quiz/oyun puanları:** liderlik tablosu için
- **AI sorularınız:** yalnızca cevabı üretmek için işlenir
- **Şehir seçiminiz:** namaz vakitlerini hesaplamak için

---

## 2. İzinler ve neden istiyoruz

| İzin | Neden | Zorunlu mu? |
|---|---|---|
| **Konum** (`ACCESS_FINE/COARSE_LOCATION`) | Kıble yönünü ve namaz vakitlerini hesaplamak | Hayır — şehri elle de seçebilirsiniz |
| **Mikrofon** (`RECORD_AUDIO`) | Sesli komut özelliği (cihazın konuşma tanıma servisi) | Hayır — özelliği kullanmazsanız gerekmez |
| **İnternet** | İçerik, namaz vakitleri ve AI cevapları | Evet |

Konum bilgisi **cihazda işlenir**, konum geçmişiniz sunucularımızda
saklanmaz. Ses kaydı **saklanmaz**; cihazın konuşma tanıma servisi
tarafından anlık işlenir.

Uygulama **kamera, rehber, fotoğraf galerisi veya dosya erişimi
istemez.**

---

## 3. Üçüncü taraf servisler

| Servis | Rol | Gizlilik politikası |
|---|---|---|
| Google Firebase (Hosting/Auth) | Barındırma ve isteğe bağlı giriş | policies.google.com/privacy |
| Google Gemini / Groq | AI cevap üretimi | Sorunuz cevabı üretmek için işlenir |
| Aladhan API | Namaz vakitleri | Şehir bilgisi gönderilir |
| cdn.islamic.network | Kur'an ses kayıtları | Standart erişim kaydı |
| YouTube (gömülü) | Meal videoları | policies.google.com/privacy |

---

## 4. Çocukların gizliliği

Uygulama her yaş için uygundur. 13 yaşın altındaki kullanıcılardan
bilerek kişisel veri toplamayız. Çocuğunuzun veri girdiğini
düşünüyorsanız bize yazın, silelim.

---

## 5. Veri saklama ve silme

- **Cihaz verileri:** uygulamayı kaldırınca silinir.
- **Hesap verileri:** Ayarlar > Çıkış Yap ile oturumu kapatabilirsiniz.
- **Tam silme talebi:** aşağıdaki e-postaya yazın; hesabınızı ve
  sunucudaki tüm kayıtlarınızı **30 gün içinde** sileriz.

---

## 6. Güvenlik

Tüm ağ trafiği HTTPS ile şifrelenir. Oturum bilgisi güvenli çerezlerle
taşınır. Buna rağmen internet üzerinden hiçbir aktarım %100 güvenli
değildir; makul teknik ve idari tedbirleri alırız.

---

## 7. Değişiklikler

Bu politika güncellenirse "Son güncelleme" tarihi değişir ve önemli
değişikliklerde uygulama içinde bildirim gösterilir.

---

## 8. İletişim

Gizlilikle ilgili soru, talep veya silme isteği için:

**E-posta:** sdurak875@gmail.com

---

<a name="english"></a>

# Privacy Policy — Islamic Life Assistant (English)

**Last updated:** 26 July 2026 · **App:** Islamic Life Assistant (`com.islamapp`)

## Summary

This app **does not sell, rent, or share your personal data for
advertising.** Personal content such as your reading history,
memorization progress and deeds journal is stored **only on your device**.

## 1. Data we collect

**On-device only (never sent to a server):** deeds journal entries,
reading position, memorization progress, reading settings, language
preference, game statistics, offline downloads. Uninstalling the app
deletes all of it.

**Account data:** a display name (if you enter one as a guest); your
email, name and profile photo **only if** you choose Google Sign-In; an
anonymous guest identifier. Google Sign-In is **optional** — the app is
fully usable as a guest.

**Sent to our server:** dhikr and worship counters (for streaks), quiz
scores (for the leaderboard), your AI questions (processed solely to
generate an answer), and your selected city (to compute prayer times).

## 2. Permissions

| Permission | Why | Required? |
|---|---|---|
| Location | Qibla direction and prayer times | No — you may pick a city manually |
| Microphone | Voice command (device speech recognition) | No |
| Internet | Content, prayer times, AI answers | Yes |

Location is processed **on device**; we do not store your location
history. Audio is **not recorded or stored**. The app requests **no
camera, contacts, photo or file access.**

## 3. Third parties

Google Firebase (hosting and optional sign-in), Google Gemini / Groq (AI
answers), Aladhan API (prayer times), cdn.islamic.network (Qur'an
audio), YouTube (embedded translation videos).

## 4. Children

The app is suitable for all ages. We do not knowingly collect personal
data from children under 13.

## 5. Retention and deletion

Device data is removed on uninstall. You can sign out from Settings. For
full account deletion, email us — we delete your account and all server
records **within 30 days**.

## 6. Security

All network traffic uses HTTPS. Sessions use secure cookies. No internet
transmission is 100% secure, but we apply reasonable technical and
organisational safeguards.

## 7. Contact

**Email:** sdurak875@gmail.com
