# Security Improvements for IslamAPP2

## Yapılan değişiklikler

1. **Backend güvenlik başlıkları eklendi**
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Referrer-Policy: no-referrer-when-downgrade`
   - `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()`
   - `X-XSS-Protection: 1; mode=block`
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

2. **Firebase Hosting için ek güvenlik başlıkları eklendi**
   - Yönlendirme ve statik dosya üzerinde daha iyi tarayıcı koruması sağlandı.

3. **CORS ayarları sıkılaştırıldı**
   - `allow_methods` açık uçlu `*` yerine `GET, POST, PUT, PATCH, DELETE, OPTIONS` olarak sınırlandı.
   - `allow_headers` yalnızca güvenli ve gerekli başlıklarla sınırlandı.
   - Üretimde `ALLOWED_ORIGINS` ortam değişkeni ile izin verilen domain listesi tanımlanabilir.

4. **Kimlik doğrulama cookie güvenliği iyileştirildi**
   - `secure` özelliği `COOKIE_SECURE` ortam değişkeni ile kontrol edilebilir hale getirildi.
   - `SameSite` ayarı `none` yerine `lax` olarak değiştirildi.

5. **CSRF koruması için AJAX kaynağı doğrulaması eklendi**
   - Önemli auth endpoint’leri yalnızca `X-Requested-With: XMLHttpRequest` başlığı ile çağrılabilir.
   - Frontend tarafında bu başlık `frontend/src/api.js` içinde Axios yapılandırmasına eklendi.

6. **Rate limiting eklendi**
   - `POST /auth/guest` için dakika başına maksimum 6 istek.
   - `POST /auth/session` için dakika başına maksimum 10 istek.

## Nasıl çalışır

- Backend, her yanıt için güvenlik başlıkları ekleyerek tarayıcı düzeyinde ek koruma sağlar.
- CORS politikası yalnızca belirlenmiş kökenlere izin verir ve sadece gerekli yöntemleri/header’ları kabul eder.
- `SameSite=Lax` cookie ayarı, cross-site POST isteklerinin session cookie ile gelmesini büyük ölçüde engeller.
- `X-Requested-With` kontrolü, uygulamanın sadece beklenen AJAX çağrılarını kabul etmesine yardımcı olur.
- Rate limiter, aynı IP üzerinden brute force veya aşırı misafir oturumu açma denemelerini sınırlar.

## Ek tavsiyeler

- `ALLOWED_ORIGINS` ortam değişkenini production ortamında kesinlikle tanımlayın.
- `COOKIE_SECURE=false` sadece local geliştirme için kullanılmalı, üretimde `true` kalmalıdır.
- Backend ve frontend bağımlılıklarında düzenli güvenlik taraması (`npm audit`, `pip-audit`, `safety`) yapın.
- OAuth callback ve dış auth akışı için ek CSRF/nonce mekanizmaları düşünün.
