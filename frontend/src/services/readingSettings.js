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
export const READING_THEMES = [
  { id: 'yumusak',   name: 'Yumuşak Aydınlık',   bg: '#F2EFE9', surface: '#FFFFFF', text: '#26221A', secondary: '#6B655A', accent: '#8B6914', border: '#E0DACC', dark: false },
  { id: 'beyaz',     name: 'Tam Aydınlık',        bg: '#FFFFFF', surface: '#F7F7F7', text: '#151515', secondary: '#5C5C5C', accent: '#7A5E14', border: '#E8E8E8', dark: false },
  { id: 'sepya',     name: 'Eski Kâğıt',          bg: '#F7EFDA', surface: '#FDF6E6', text: '#3B2F1A', secondary: '#7A6B4A', accent: '#8B6914', border: '#E6D9B8', dark: false },
  { id: 'gece',      name: 'Gece',                bg: '#070D18', surface: '#111D30', text: '#EBE5D8', secondary: '#7E8A9E', accent: '#C8A55A', border: '#1E2C44', dark: true },
  { id: 'yildiz',    name: 'Derin Gece',          bg: '#0E0C28', surface: '#1B1843', text: '#E0E7FF', secondary: '#A5B4FC', accent: '#F5D77C', border: '#2A2660', dark: true },
  { id: 'gunbatimi', name: 'Gün Batımı',          bg: '#1F1210', surface: '#2E1B17', text: '#FBE9DD', secondary: '#C9A18E', accent: '#F59E0B', border: '#45281F', dark: true },
  { id: 'kehribar',  name: 'Kehribar Gece',       bg: '#120D02', surface: '#1F1706', text: '#F0DFAE', secondary: '#B79B4E', accent: '#F5B93C', border: '#33270C', dark: true },
];

export const FONT_MIN = 14;
export const FONT_MAX = 24;
export const AR_MIN = 20;
export const AR_MAX = 44;

const LS_KEY = 'reading_settings';
const DEFAULTS = { themeId: 'gece', fontSize: 17, arabicSeparate: false, arabicSize: 30 };

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
  return READING_THEMES.find(t => t.id === (id ?? state.themeId)) || READING_THEMES[3];
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
    theme: getReadingTheme(settings.themeId),
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
