// frontend/src/i18n/index.js
// 🌍 HAFİF ÇEVİRİ KATMANI (gettext tarzı)
//
// Türkçe, kodda ve veri dosyalarında KANONİK metindir; anahtar üretmeye
// gerek yoktur. `tt('Bugünün Yolu')` çağrısı dil TR ise metni aynen,
// EN ise en.js sözlüğünden karşılığını döndürür (bulunamazsa Türkçe'ye
// düşer — uygulama asla kırılmaz). Arapça şimdilik İngilizce'ye düşer;
// içerik çevirisi aşamasında ar.js eklenecek.
//
// Kullanım:
//   const tt = useTx();            →  tt('Kaydet')
//   ttFor(lang, 'Kaydet')          →  bileşen dışı (servis) kullanım
//
// Taşınabilirlik: Bu klasör + LangContext ile birlikte kopyalanabilir.

import { useLang } from '../contexts/LangContext';
import EN from './en';

const DICTS = { en: EN, ar: EN }; // ar: geçici olarak EN'e düşer

export function ttFor(lang, text) {
  if (!text || lang === 'tr') return text;
  const d = DICTS[lang];
  return (d && d[text]) || text;
}

export function useTx() {
  const { lang } = useLang();
  return (text) => ttFor(lang, text);
}

export default useTx;
