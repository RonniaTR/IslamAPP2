// frontend/src/services/readingSettings.js
// 📖 OKUMA AYARLARI — taşınabilir tema + yazı boyutu altyapısı.
//
// ▸ AMAÇ: Kur'an/mushaf, makale ve kıssa gibi tüm OKUMA yüzeylerinin
//   görünümünü tek yerden yönetmek: okuma teması (7 palet), metin boyutu
//   ve "Arapça için ayrı boyut" seçeneği.
// ▸ TAŞINABİLİRLİK: Bu dosya + ReadingSettingsSheet.jsx başka bir React
//   uygulamasına olduğu gibi kopyalanabilir. Tek bağımlılık React'tir;
//   durum localStorage'da tutulur, abonelik (subscribe) ile her bileşen
//   canlı güncellenir. Ana uygulamaya gömerken yalnızca temalardaki renk
//   paletini kendi kimliğinize göre düzenlemeniz yeterlidir.
// ▸ TELİF: Tema adları ve paletler özgündür; hiçbir uygulamadan
//   kopyalanmamıştır — alınan şey yalnızca "önizlemeli tema listesi +
//   boyut kaydırıcısı" yapısıdır.

import { useSyncExternalStore } from 'react';

// ─── Okuma temaları (özgün paletler) ───
// dark: durum çubuğu/ikon kontrastı için ipucu; surface: kart zemini
// Okuma temaları VAKİT KÂĞITLARI olarak adlandırılır: her biri günün bir vaktinin ışığıdır.
// "Vakte göre" (otomatik) açıkken tema saate göre kendiliğinden seçilir.
export const READING_THEMES = [
  { id: 'kehribar',  name: 'Seher',    saat: [3, 6],   gok: ['#1B1030', '#7A3E2A'], gunes: 0.08, bg: '#120D02', surface: '#1F1706', text: '#F5E7BC', secondary: '#CBB065', accent: '#F5B93C', border: '#33270C', dark: true },
  { id: 'yumusak',   name: 'Kuşluk',   saat: [6, 11],  gok: ['#9CC9E8', '#F6D9A8'], gunes: 0.3,  bg: '#F4F1EA', surface: '#FFFFFF', text: '#1C1812', secondary: '#5C5548', accent: '#8B6914', border: '#DDD6C7', dark: false },
  { id: 'beyaz',     name: 'Öğle',     saat: [11, 15], gok: ['#6FB3E6', '#CDE7F7'], gunes: 0.5,  bg: '#FFFFFF', surface: '#F7F7F7', text: '#141414', secondary: '#525252', accent: '#7A5E14', border: '#E4E4E4', dark: false },
  { id: 'sepya',     name: 'İkindi',   saat: [15, 18], gok: ['#E9B872', '#F7E3BC'], gunes: 0.7,  bg: '#FBF5E6', surface: '#FFFDF7', text: '#22190C', secondary: '#5E4E34', accent: '#8B6512', border: '#E3D5B5', dark: false },
  { id: 'gunbatimi', name: 'Akşam',    saat: [18, 20], gok: ['#5B2A4A', '#E0784A'], gunes: 0.92, bg: '#1F1210', surface: '#2E1B17', text: '#FDF0E6', secondary: '#D4B09E', accent: '#F59E0B', border: '#45281F', dark: true },
  { id: 'gece',      name: 'Yatsı',    saat: [20, 23], gok: ['#070D18', '#1E2C44'], gunes: -1,   bg: '#0B1320', surface: '#152238', text: '#F5EFE2', secondary: '#AAB6C8', accent: '#E0BA62', border: '#263854', dark: true },
  { id: 'yildiz',    name: 'Teheccüd', saat: [23, 3],  gok: ['#0E0C28', '#2A2660'], gunes: -1,   bg: '#0E0C28', surface: '#1B1843', text: '#EEF2FF', secondary: '#B4C2FC', accent: '#F5D77C', border: '#2A2660', dark: true },
];

/** Saate göre vakit kâğıdı. */
export function vaktinTemasi(d = new Date()) {
  const h = d.getHours();
  return READING_THEMES.find((t) => (t.saat[0] < t.saat[1] ? h >= t.saat[0] && h < t.saat[1] : h >= t.saat[0] || h < t.saat[1])) || READING_THEMES[3];
}


export const FONT_MIN = 14;
export const FONT_MAX = 24;
export const AR_MIN = 20;
export const AR_MAX = 44;

const LS_KEY = 'reading_settings_v2';
const DEFAULTS = { themeId: 'sepya', otomatik: false, fontSize: 18, arabicSeparate: false, arabicSize: 30 };

let state = (() => {
  try { return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(LS_KEY)) || {}) }; }
  catch { return { ...DEFAULTS }; }
})();

const listeners = new Set();

export function getReadingSettings() { return state; }

export function setReadingSettings(partial) {
  state = { ...state, ...partial };
  // sınırları koru
  state.fontSize = Math.max(FONT_MIN, Math.min(FONT_MAX, state.fontSize));
  state.arabicSize = Math.max(AR_MIN, Math.min(AR_MAX, state.arabicSize));
  if (!READING_THEMES.some(t => t.id === state.themeId)) state.themeId = DEFAULTS.themeId;
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* quota */ }
  listeners.forEach(fn => { try { fn(state); } catch { /* dinleyici hatası */ } });
}

export function subscribeReadingSettings(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getReadingTheme(id) {
  if (id === undefined && state.otomatik) return vaktinTemasi();
  return READING_THEMES.find(t => t.id === (id ?? state.themeId)) || READING_THEMES[5];
}

// Efektif Arapça boyutu: ayrı boyut kapalıysa metin boyutundan türetilir
export function effectiveArabicSize(s = state) {
  return s.arabicSeparate ? s.arabicSize : Math.round(s.fontSize * 1.75);
}

// ─── React kancası ───
// const { settings, theme, arabicSize, set } = useReadingSettings();
export function useReadingSettings() {
  const settings = useSyncExternalStore(
    subscribeReadingSettings,
    getReadingSettings,
    getReadingSettings
  );
  return {
    settings,
    theme: settings.otomatik ? vaktinTemasi() : getReadingTheme(settings.themeId),
    arabicSize: effectiveArabicSize(settings),
    set: setReadingSettings,
  };
}

const readingSettings = {
  READING_THEMES,
  get: getReadingSettings,
  set: setReadingSettings,
  subscribe: subscribeReadingSettings,
  theme: getReadingTheme,
  arabicSize: effectiveArabicSize,
};
export default readingSettings;
