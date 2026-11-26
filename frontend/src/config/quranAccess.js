// frontend/src/config/quranAccess.js
// 🔒 KUR'AN BÖLÜMÜ YAYIN BAYRAĞI
//
// 633 sayılı Kanun (7549 ile değişik, RG 4 Haziran 2025): Mushafları İnceleme ve Kıraat Kurulu
// onayı olmayan elektronik Kur'an yayımlanamaz. Onay gelene kadar halka açık derlemede Kur'an
// bölümleri kapalıdır (docs/YENI_OZELLIKLER.md 0.4, docs/kurul/).
//
//   REACT_APP_QURAN_PUBLIC=true   → Kur'an bölümleri açık (yalnız Kurul inceleme kanalı ve
//                                    onay sonrası üretim derlemesi)
//   tanımsız / false              → kapalı; yerine "onay sürecinde" kartı
//
// Geliştirme ortamında (npm start) bayrak tanımsızsa bölümler AÇIKTIR; aksi halde geliştirme yapılamaz.
const raw = process.env.REACT_APP_QURAN_PUBLIC;

// Kurul incelemesi ve genel erişim için Mushaf ve Kur'an bölümleri serbest bırakıldı (yalnız açıkça 'false' verilirse kapanır).
export const QURAN_PUBLIC = raw !== 'false';

// Kurul'a verilen bağlantı: …/?inceleme=1 → doğrudan Kur'an listesine gider.
export const REVIEW_PARAM = 'inceleme';
export const REVIEW_TARGET = '/quran';
