// frontend/src/services/contentI18n.js
// 🌍 İÇERİK ÇEVİRİ KATMANI (veri nesneleri için)
//
// Arayüz metinleri i18n/ ile (tt) çevrilir; İÇERİK (kıssa, esma, dua,
// makale gibi veri nesneleri) ise bu katmanla çevrilir.
//
// Kural: Türkçe alan KANONİK'tir. Her veri nesnesine opsiyonel bir `en`
// nesnesi iliştirilir (ayrı *.en.js dosyalarından). `field(item, lang, key)`
// dil EN ise item.en[key]'i, yoksa item[key]'i döndürür. Arapça şimdilik
// İngilizce'ye, o da yoksa Türkçe'ye düşer — hiçbir alan asla boş kalmaz.
//
// Kullanım (bileşen içinde):
//   const f = useField();
//   f(story, 'title')           // dile göre başlık
//   f(story, 'paragraphs')      // dile göre paragraf dizisi
//
// Taşınabilirlik: i18n/ + LangContext ile birlikte kopyalanabilir.

import { useLang } from '../contexts/LangContext';

// Bir veri dizisine İngilizce haritasını iliştir (id/anahtar → {alanlar}).
// keyFn: item'dan harita anahtarını üretir (varsayılan: item.id).
export function attachEn(list, enMap, keyFn = (x) => x.id) {
  if (!Array.isArray(list) || !enMap) return list;
  for (const item of list) {
    const k = keyFn(item);
    if (enMap[k]) item.en = enMap[k];
  }
  return list;
}

// Dile göre alan seçer.
export function field(item, lang, key) {
  if (!item) return undefined;
  if (lang && lang !== 'tr' && item.en && item.en[key] != null) return item.en[key];
  return item[key];
}

// Bileşen kancası: f(item, key)
export function useField() {
  const { lang } = useLang();
  return (item, key) => field(item, lang, key);
}

const contentI18n = { attachEn, field, useField };
export default contentI18n;
