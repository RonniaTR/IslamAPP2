# Giriş (Auth) Kurulumu

## Misafir girişi — otomatik çalışır
- Kullanıcı isim girer → isim veritabanına kaydedilir ve **her yerde (liderlik,
  profil) o isimle görünür**.
- İsim ve ilerleme (XP, notlar) session cookie'si (30 gün, her açılışta yenilenir)
  boyunca korunur.
- Tarayıcıda `islamapp_guest_id` saklanır; kullanıcı çıkış yapsa/cookie düşse bile
  aynı misafir kimliğiyle **kaldığı yerden devam eder** (verisi kaybolmaz).
- Ek kurulum gerekmez.

## Google ile giriş — Firebase Authentication
Frontend, Firebase SDK ile Google popup'ı açar; oluşan kimlik token'ını backend
`/api/auth/firebase` doğrular, kullanıcıyı oluşturur/günceller ve kendi oturumumuzu
açar. Etkinleştirmek için:

### 1. Firebase Console
1. https://console.firebase.google.com → **ISLAMAPP** projesi.
2. **Authentication → Sign-in method → Add new provider → Google → Enable**,
   destek e-postasını seç, **Save**.
3. **Authentication → Settings → Authorized domains**: `islamapp-5942a.web.app`
   ve `localhost` zaten olmalı (yoksa ekle). Kendi alan adın varsa onu da ekle.
4. **Project Settings (⚙) → General → Your apps → Web app → SDK setup and
   configuration → Config**. Şu değerleri kopyala:
   `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
   (Web app yoksa "Add app → Web" ile bir tane oluştur.)

### 2. Frontend config (değerleri gir)
`frontend/src/firebase.js` içindeki `firebaseConfig`'e yukarıdaki değerleri yaz
(bu değerler **gizli değildir**, herkese açık olabilir). Alternatif olarak
build sırasında `REACT_APP_FIREBASE_API_KEY`, `..._APP_ID`, `..._MSG_SENDER_ID`
env değişkenleriyle de verilebilir. Sonra frontend'i yeniden build + deploy et:
```
cd frontend && npm install && npm run build
firebase deploy --only hosting
```

### 3. Backend ortam değişkeni (Render)
| Değişken | Değer |
|---|---|
| `FIREBASE_PROJECT_ID` | `islamapp-5942a` (token doğrulaması için) |
| `COOKIE_SAMESITE` | `none` (frontend ve backend farklı domain) |
| `FRONTEND_URL` | `https://islamapp-5942a.web.app` |

`google-auth` kütüphanesi `requirements.txt`'e eklendi (token doğrulama için).

### Neden `COOKIE_SAMESITE=none`?
Frontend (firebase) ile backend (render) **farklı domain**. Oturum cookie'sinin
cross-origin isteklerde gönderilmesi için `SameSite=None; Secure` şart. Eski
`lax` ayarı bu mimaride cookie'yi göndermiyordu (gizli giriş hatası) — düzeltildi.
Yerel http geliştirmede `COOKIE_SAMESITE=lax` + `COOKIE_SECURE=false` kullan.

### Akış özeti
1. **Google ile Giriş Yap** → Firebase popup → Google hesabı seç.
2. Frontend, Firebase ID token'ını `/api/auth/firebase`'e gönderir.
3. Backend token'ı doğrular, kullanıcıyı MongoDB'de oluşturur/günceller, oturum
   cookie'si verir. Kullanıcı giriş yapmış olur.

> Not: Eski "Emergent" tabanlı `/auth/session` akışı yerinde duruyor ama artık
> Firebase kullanılıyor; Emergent'e bağımlılık yok.
