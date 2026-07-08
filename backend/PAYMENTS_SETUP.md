# İyzico Ödeme Kurulumu

Premium abonelik artık gerçek iyzico ödemesiyle aktifleşir. Kod hazır; sadece
aşağıdaki hesap ve ortam değişkenlerini eklemen gerekiyor.

## 1. iyzico hesabı
1. https://merchant.iyzico.com üzerinden mağaza (merchant) hesabı aç.
2. **Ayarlar → API Anahtarları**'ndan `API Key` ve `Secret Key` al.
   - Önce **Sandbox** anahtarlarıyla test et, sonra canlı anahtarlara geç.

## 2. Ortam değişkenleri (Render Dashboard → Environment)
| Değişken | Örnek / Değer |
|---|---|
| `IYZICO_API_KEY` | (iyzico panelinden) |
| `IYZICO_SECRET_KEY` | (iyzico panelinden) |
| `IYZICO_BASE_URL` | Test: `https://sandbox-api.iyzipay.com` · Canlı: `https://api.iyzipay.com` |
| `IYZICO_CALLBACK_URL` | `https://<backend-adresin>/api/premium/iyzico/callback` |
| `FRONTEND_URL` | `https://islamapp-5942a.web.app` |
| `PAYMENTS_DEV_MODE` | Canlıda **ekleme** (boş bırak). Sadece yerel testte `true` |

> `IYZICO_CALLBACK_URL` iyzico panelinde de kayıtlı domain listesine eklenmeli.

## 3. Akış (nasıl çalışır)
1. Kullanıcı **Premium'a Geç**'e basar → `POST /api/premium/iyzico/init`
   backend iyzico'da ödeme formu başlatır, `paymentPageUrl` döner.
2. Kullanıcı iyzico'nun güvenli ödeme sayfasına yönlenir, kart bilgisini girer.
3. iyzico ödemeyi `IYZICO_CALLBACK_URL`'e POST eder →
   `POST /api/premium/iyzico/callback` ödemeyi **iyzico'dan tekrar sorgulayıp
   doğrular**, başarılıysa aboneliği açar ve kullanıcıyı
   `FRONTEND_URL/premium?payment=success` adresine geri yollar.
4. `PremiumPage` bu parametreyi görüp premium durumunu tazeler.

`POST /api/premium/iyzico/verify` (token ile) istemci tarafından da
çağrılabilir — aynı doğrulama + aktivasyonu yapar (yedek yol).

## 4. Güvenlik notu
- Eski `POST /api/premium/activate` artık **canlıda kapalı** (403 döner).
  Yalnızca `PAYMENTS_DEV_MODE=true` iken çalışır. Böylece "tek tıkla bedava
  premium" açığı kapandı; premium sadece doğrulanmış ödemeyle verilir.
- Abonelik/ödeme kayıtları `subscriptions` ve `payments` koleksiyonlarında tutulur.

## 5. Test kartları (sandbox)
iyzico test kartları: https://dev.iyzipay.com/tr/test-kartlari
(ör. `5528790000000008`, son kullanma ileri bir tarih, CVC `123`).
