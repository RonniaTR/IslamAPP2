// frontend/src/services/contentI18n.js
// 🌍 İÇERİK ÇEVİRİ KATMANI (veri nesneleri için)
//
// Arayüz metinleri i18n/ ile (tt) çevrilir; İÇERİK (kıssa, esma, dua,
// makale gibi veri nesneleri) ise bu katmanla çevrilir.
//
// Kural: Türkçe alan KANONİK'tir. Her veri nesnesine dil kodlu opsiyonel
// nesneler iliştirilir (ayrı *.en.js / *.ar.js dosyalarından):
//   item.en = { title, ... }   item.ar = { title, ... }
//
// YEDEKLEME ZİNCİRİ (field):
//   tr  →  item[key]
//   en  →  item.en[key]                    →  item[key]
//   ar  →  item.ar[key]  →  item.en[key]   →  item[key]
//
// Böylece Arapça içerik kademeli eklenebilir; eksik alan Türkçe yerine
// İngilizce'ye düşer ve hiçbir alan asla boş kalmaz.
//
// Kullanım (bileşen içinde):
//   const f = useField();
//   f(story, 'title')           // dile göre başlık
//   f(story, 'paragraphs')      // dile göre paragraf dizisi
//
// Taşınabilirlik: i18n/ + LangContext ile birlikte kopyalanabilir.

import { useLang } from '../contexts/LangContext';

// Bir veri dizisine dil haritasını iliştir (id/anahtar → {alanlar}).
// keyFn: item'dan harita anahtarını üretir (varsayılan: item.id).
export function attachLang(list, map, lang = 'en', keyFn = (x) => x.id) {
  if (!Array.isArray(list) || !map) return list;
  for (const item of list) {
    const k = keyFn(item);
    if (map[k]) item[lang] = map[k];
  }
  return list;
}

// Geriye dönük uyumluluk: attachEn(list, enMap, keyFn)
export function attachEn(list, enMap, keyFn = (x) => x.id) {
  return attachLang(list, enMap, 'en', keyFn);
}

// Dile göre alan seçer (zincir: item[lang] → item.en → Türkçe).
export function field(item, lang, key) {
  if (!item) return undefined;
  if (!lang || lang === 'tr') return item[key];
  const own = item[lang];
  if (own && own[key] != null) return own[key];
  if (item.en && item.en[key] != null) return item.en[key];
  return item[key];
}

// Bileşen kancası: f(item, key)
export function useField() {
  const { lang } = useLang();
  return (item, key) => field(item, lang, key);
}

const contentI18n = { attachLang, attachEn, field, useField };
export default contentI18n;
