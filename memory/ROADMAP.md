# İslami Yaşam Asistanı - Roadmap

> Son güncelleme: 2026-07-08. Uygulama genel denetimi sonrası önceliklendirildi.
> Denetim özeti: Navigasyon/menü katmanı sağlam (her buton gerçek bir sayfaya gidiyor).
> Asıl eksik, bazı varış sayfalarının arkasında gerçek veri/işlev olmaması ve gerçek ödeme akışının bulunmaması.

## ✅ Bu turda yapıldı (2026-07-08)
- [x] **Yer imi (bookmark) sistemi onarıldı**
  - Backend: `POST /quran/bookmark` artık JSON body alıyor + aynı ayeti tekrar eklemiyor (idempotent)
  - Backend: eksik olan `DELETE /quran/bookmark/{id}` eklendi
  - Backend: `GET /quran/bookmarks` doğru `id` (uuid) döndürüyor
  - Frontend: `BookmarksPage` `user.uid` → `user_id` hatası düzeltildi (artık sonsuz "yükleniyor"da kalmıyor)
  - Frontend: `SurahDetail` ayet aksiyon satırına "yer imine ekle/çıkar" butonu eklendi
- [x] **Sahte veri gösteren 2 sayfa gerçek sisteme bağlandı**
  - `JourneyTracker` (/journey): 28 günlük yolculuk artık gerçek `current_streak`'e göre çiziliyor; XP/gün gerçek `/gamification/v2/stats`'tan
  - `KnowledgeProfile` (/profile/knowledge): yeni `GET /knowledge/profile/{user_id}` endpoint'i ile XP/seri/görev ve kategori dökümü gerçek `activity_logs`'tan hesaplanıyor
- [x] **Ölü kod temizliği**: `Leaderboard.js` (LeaderboardPage'in birebir kopyası) silindi

## P0 - Sıradaki kritik iş (gelir & güven)
- [~] **iyzico ödeme entegrasyonu — KOD HAZIR, anahtar bekliyor** (bkz. `backend/PAYMENTS_SETUP.md`)
  - Backend: `/premium/iyzico/init`, `/verify`, `/callback` eklendi; ödeme iyzico'dan doğrulanarak abonelik açılıyor
  - Güvenlik: eski `/premium/activate` açığı kapatıldı (canlıda 403; sadece `PAYMENTS_DEV_MODE=true` ile açık)
  - Frontend: `PremiumPage` gerçek ödeme sayfasına yönlendiriyor + dönüş sonucunu işliyor
  - **Kalan (kullanıcı):** iyzico hesabı + `IYZICO_*` / `FRONTEND_URL` env değişkenlerini Render'a gir, sandbox'ta test et, canlıya geç
- [x] **Misafir veri kalıcılığı çözüldü** — Girilen isim artık backend'de kaydediliyor ve her yerde görünüyor; `islamapp_guest_id` ile misafir çıkış/cookie kaybı sonrası aynı kimlikle devam ediyor (veri kaybolmuyor).
- [~] **Google ile giriş — KOD HAZIR, anahtar bekliyor** (bkz. `backend/AUTH_SETUP.md`)
  - Standart Google OAuth 2.0 (sunucu taraflı redirect) eklendi: `/auth/google/login` + `/auth/google/callback`
  - Emergent bağımlılığı yerine kendi OAuth'umuz; `loginWithGoogle` frontend'e eklendi
  - **Cross-origin cookie hatası düzeltildi**: `SameSite=None; Secure` (eski `lax` cross-origin'de çalışmıyordu)
  - **Kalan (kullanıcı):** Google Cloud'da OAuth Client oluştur, `GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI` env'lerini Render'a gir

## P1 - İçerik & tutarlılık
- [ ] **ScholarsPage gözden geçir** — 12 "hoca" listesi frontend'de hardcoded; backend `/scholars` kullanılmıyor. Ayrıca AI, isimli gerçek kişilerin ağzından cevap veriyor → itibar/yasal açıdan değerlendirilmeli (jenerik "Diyanet görüşü" personası daha güvenli olabilir).
- [ ] **RamadanPage'e Ramazan'a özel gerçek veri** — şu an genel namaz/ayet/hadis endpoint'lerini yeniden kullanıyor. Oruç takibi + Ramazan dua koleksiyonu için özel backend.
- [ ] **quizService fallback'i şeffaflaştır** — backend çökünce "sahte quiz" sessizce her cevabı yanlış sayıyor; kullanıcıya "çevrimdışı/örnek mod" olduğu belirtilmeli.

## P2 - Büyüme
- [ ] Push bildirimleri: gerçek streak/görev hatırlatıcıları (smart notifications backend'i hazır)
- [ ] Bookmark'lara not/etiket ekleme
- [ ] Kategori bazlı gerçek quiz istatistiği (quiz_results'a `category` alanı ekleyip mastery hesapla)
- [ ] Daha fazla hadis verisi (100+)

## P3 - Gelecek
- [ ] Email/şifre ile kayıt
- [ ] İspanyolca dil desteği
- [ ] server.py'yi modüllere ayır (refactor)
