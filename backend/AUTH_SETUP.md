# Giriş (Auth) Kurulumu

## Misafir girişi — otomatik çalışır
- Kullanıcı isim girer → isim veritabanına kaydedilir ve **her yerde (liderlik,
  profil) o isimle görünür**.
- İsim ve ilerleme (XP, notlar) session cookie'si (30 gün, her açılışta yenilenir)
  boyunca korunur.
- Tarayıcıda `islamapp_guest_id` saklanır; kullanıcı çıkış yapsa/cookie düşse bile
  aynı misafir kimliğiyle **kaldığı yerden devam eder** (verisi kaybolmaz).
- Ek kurulum gerekmez.

## Google ile giriş — anahtar gerekiyor
Standart Google OAuth 2.0 (sunucu taraflı) kuruldu. Etkinleştirmek için:

### 1. Google Cloud Console
1. https://console.cloud.google.com → yeni proje (veya mevcut).
2. **APIs & Services → OAuth consent screen**: External, uygulama adı + destek e-postası.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorized redirect URIs**: `https://<backend-adresin>/api/auth/google/callback`
     (Render backend adresin, örn. `https://islamapp-backend.onrender.com/api/auth/google/callback`)
4. Oluşan **Client ID** ve **Client Secret**'i not al.

### 2. Render ortam değişkenleri
| Değişken | Değer |
|---|---|
| `GOOGLE_CLIENT_ID` | (Google'dan) |
| `GOOGLE_CLIENT_SECRET` | (Google'dan) |
| `GOOGLE_REDIRECT_URI` | `https://<backend-adresin>/api/auth/google/callback` (yukarıdakiyle **birebir aynı**) |
| `FRONTEND_URL` | `https://islamapp-5942a.web.app` |
| `COOKIE_SAMESITE` | `none` (frontend ve backend farklı domain olduğu için gerekli) |

### 3. Akış
1. Kullanıcı **Google ile Giriş Yap**'a basar → `/api/auth/google/login`
   Google onay ekranına yönlendirir.
2. Google, kullanıcıyı `/api/auth/google/callback`'e döndürür; backend kodu token'la
   değişir, kullanıcıyı oluşturur/günceller, oturum açar ve
   `FRONTEND_URL`'e geri yollar. Kullanıcı giriş yapmış olur.

### Neden `COOKIE_SAMESITE=none`?
Frontend (firebase) ile backend (render) **farklı domain**. Oturum cookie'sinin
cross-origin isteklerde gönderilmesi için `SameSite=None; Secure` şart. Eski
`lax` ayarı bu mimaride cookie'yi göndermiyordu (gizli giriş hatası) — düzeltildi.
Yerel http geliştirmede `COOKIE_SAMESITE=lax` + `COOKIE_SECURE=false` kullan.

> Not: Eski "Emergent" tabanlı Google akışı (`/auth/session`) yerinde duruyor ama
> artık standart OAuth akışı kullanılıyor; Emergent'e bağımlılık yok.
