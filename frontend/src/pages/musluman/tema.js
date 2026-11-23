// 🎨 MÜSLÜMAN OLMAK — kitap ve mecmuanın ortak renk ve yazı sistemi.
// Yazı tipleri uygulamayla birlikte paketlenir (@fontsource): internet olmadan da aynı görünür ve
// sayfa düzeni her cihazda birebir aynı kalır (sayfalar sabit ölçüde dizilir, ekrana ölçeklenir).
import '@fontsource/literata/latin-400.css';
import '@fontsource/literata/latin-ext-400.css';
import '@fontsource/literata/latin-400-italic.css';
import '@fontsource/literata/latin-ext-400-italic.css';
import '@fontsource/literata/latin-600.css';
import '@fontsource/literata/latin-ext-600.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/fraunces/latin-ext-600.css';
import '@fontsource/fraunces/latin-800.css';
import '@fontsource/fraunces/latin-ext-800.css';

/** Bir sayfanın mantıksal ölçüsü (px). Ekrana sığacak şekilde bütün olarak büyütülür/küçültülür. */
export const SAYFA = { w: 400, h: 640, pad: 30 };

export const FONT = {
  govde: "'Literata', Georgia, 'Times New Roman', serif",
  baslik: "'Fraunces', 'Literata', Georgia, serif",
  arayuz: "'Noto Sans', system-ui, sans-serif",
};

export const KITAP = {
  kagit: '#F8F2E4',
  kagitKoyu: '#EFE5CF',
  kenar: '#E2D5B8',
  murekkep: '#1F2A26',
  soluk: '#5E6862',
  zumrut: '#0F4A3A',
  zumrutAcik: '#1D6B55',
  altin: '#B08A3E',
  altinAcik: '#D9BE7E',
  lacivert: '#2F5E8C',
  kiremit: '#B35A3C',
  gul: '#C98B8B',
};

/** Mecmua (bilim dergisi) daha canlı: her makalenin kendi rengi var. */
export const MECMUA = {
  kagit: '#FBFAF6',
  murekkep: '#16202A',
  soluk: '#5A6470',
  isik: '#E3A62F',   // ışık / optik
  gok: '#2D5DA8',    // gökbilim
  yer: '#2E8B6A',    // coğrafya
  sayi: '#7A4FB5',   // matematik
  makine: '#C2552E', // mühendislik
  sanat: '#B23A6B',  // sanat
  tarih: '#8A6A2A',
};

export const BOLUM_RENK = {
  kalp: KITAP.kiremit,
  dil: KITAP.lacivert,
  el: KITAP.altin,
  ev: '#9A5B7A',
  toplum: KITAP.zumrutAcik,
  ilim: '#3A5A9A',
  tabiat: '#4F7F3A',
  guc: '#7A5230',
  diger: KITAP.zumrut,
};
