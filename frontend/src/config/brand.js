// 🏷️ MARKA — uygulamanın adı ve iletişim bilgisi TEK yerden gelir.
// Mağaza adı kesinleşince yalnız burası değişir (açılış, giriş, mod seçimi, gizlilik sayfası buradan okur).
//
// İletişim e-postası gizlilik politikasında ve hesap silme sayfasında görünür; mağazalar bunu ister.
// Kod deposuna kişisel adres yazılmasın diye ortam değişkeninden okunur:
//   frontend/.env  →  REACT_APP_SUPPORT_EMAIL=destek@alanadin.com
// Tanımlı değilse sayfalar e-posta yerine uygulama içi yolu gösterir.

export const APP_NAME = 'İslamiApp';
export const TAGLINE = 'Hayatına nur kat';
export const SUPPORT_EMAIL = (process.env.REACT_APP_SUPPORT_EMAIL || '').trim();

// Gizlilik politikası ve hesap silme sayfasının kalıcı web adresleri (mağaza formlarına bunlar yazılır).
export const WEB_ORIGIN = (process.env.REACT_APP_WEB_ORIGIN || 'https://islamapp-5942a.web.app').replace(/\/+$/, '');
export const PRIVACY_URL = `${WEB_ORIGIN}/gizlilik`;
export const DELETE_URL = `${WEB_ORIGIN}/hesap-sil`;

// Gizlilik metninin yürürlük tarihi: metin değişince güncellenir.
export const PRIVACY_UPDATED = '23 Kasım 2026';

const brand = { APP_NAME, TAGLINE, SUPPORT_EMAIL, WEB_ORIGIN, PRIVACY_URL, DELETE_URL, PRIVACY_UPDATED };
export default brand;
