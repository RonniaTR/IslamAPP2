// frontend/src/i18n/index.js
// 🌍 HAFİF ÇEVİRİ KATMANI (gettext tarzı)
//
// Türkçe, kodda ve veri dosyalarında KANONİK metindir; anahtar üretmeye
// gerek yoktur. `tt('Bugünün Yolu')` çağrısı dil TR ise metni aynen,
// EN ise en.js sözlüğünden karşılığını döndürür.
//
// YEDEKLEME ZİNCİRİ:
//   tr  →  metnin kendisi
//   en  →  en.js  →  (yoksa) Türkçe metin
//   ar  →  ar.js  →  (yoksa) en.js  →  (yoksa) Türkçe metin
//
// Arapça sözlük kademeli büyütülür; eksik bir anahtar Türkçe yerine
// İngilizce'ye düşer, böylece Arapça kullanıcı hiç anlamadığı bir dille
// karşılaşmaz. Uygulama hiçbir durumda kırılmaz.
//
// Kullanım:
//   const tt = useTx();            →  tt('Kaydet')
//   ttFor(lang, 'Kaydet')          →  bileşen dışı (servis) kullanım
//
// Taşınabilirlik: Bu klasör + LangContext ile birlikte kopyalanabilir.

import { useLang } from '../contexts/LangContext';
import EN from './en';
import AR from './ar';

// Her dil için sırayla denenecek sözlükler (ilk bulunan kazanır)
const CHAIN = {
  en: [EN],
  ar: [AR, EN],
};

export function ttFor(lang, text) {
  if (!text || lang === 'tr') return text;
  const chain = CHAIN[lang];
  if (!chain) return text;
  for (const dict of chain) {
    const hit = dict && dict[text];
    if (hit) return hit;
  }
  return text;
}

export function useTx() {
  const { lang } = useLang();
  return (text) => ttFor(lang, text);
}

export default useTx;
