// frontend/src/services/mealService.js
// 📖 MEAL SERVİSİ — Kur'an meallerinin tek kapısı.
//
// Kaynak: QuranEnc.com (yeniden yayın şartları: data/sources.json → quranEncSartlari).
// Şartların koddaki karşılığı:
//   · Metin DEĞİŞTİRİLMEZ: gelen çeviri olduğu gibi döner; kırpma, düzeltme, birleştirme yok.
//   · Dipnotlar ayrı alanda korunur (footnotes).
//   · Sürüm numarası her yanıtla birlikte döner ve ekranda gösterilir.
//   · Önbellek sürüme bağlıdır: QuranEnc yeni sürüm yayımlayınca eski kopya kullanılmaz.
//
// Hangi çevirinin kullanılacağı data/sources.json içinde tanımlıdır; kodda anahtar yazılmaz.

import sources from '../data/sources.json';
import { packSurah } from './offline';

const API = 'https://quranenc.com/api/v1';
const CACHE_PREFIX = 'meal_v1';
const VERSION_TTL_MS = 24 * 60 * 60 * 1000; // sürüm kontrolü günde bir

const read = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* kota dolu: önbelleksiz devam */ } };

/** Dil koduna göre kaynak tanımı. Tanımsız dilde Türkçe'ye düşer. */
export function getMealSource(lang = 'tr') {
  return sources.translations[lang] || sources.translations.tr;
}

/** Çevirinin güncel sürümünü QuranEnc listesinden okur (günde bir kez). */
async function getLiveVersion(src, lang) {
  const k = `${CACHE_PREFIX}:ver:${src.key}`;
  const cached = read(k);
  if (cached && Date.now() - cached.at < VERSION_TTL_MS) return cached.version;
  try {
    const iso = lang === 'en' ? 'en' : 'tr';
    const res = await fetch(`${API}/translations/list/${iso}`);
    const json = await res.json();
    const list = Array.isArray(json) ? json : (json.translations || json.result || []);
    const hit = list.find((t) => t.key === src.key);
    const version = hit?.version || cached?.version || src.surum;
    write(k, { version, at: Date.now() });
    return version;
  } catch {
    return cached?.version || src.surum;
  }
}

/**
 * Bir surenin mealini getirir.
 * @returns {Promise<{ayahs: Array<{aya:number,text:string,footnotes:string}>, source: object, version: string, fromCache: boolean}>}
 */
export async function fetchMeal(surahNumber, lang = 'tr') {
  const src = getMealSource(lang);
  const n = Number(surahNumber);
  if (!(n >= 1 && n <= 114)) throw new Error('Geçersiz sure numarası');

  // ÇEVRİMDIŞI ÖNCE: cihazdaki paket varsa ağ hiç kullanılmaz (sürüm paketin kendi sürümüdür).
  const local = await packSurah(src.key, n);
  if (local) return { ayahs: local.ayahs, source: src, version: local.version || src.surum, fromCache: true, offline: true };

  const version = await getLiveVersion(src, lang);
  const k = `${CACHE_PREFIX}:${src.key}:${version}:${n}`;
  const cached = read(k);
  if (cached?.length) return { ayahs: cached, source: src, version, fromCache: true };

  const rows = await fetchRows(src.key, n);
  // Metne DOKUNULMAZ; yalnız alan adları sadeleştirilir.
  const ayahs = rows.map((r) => ({
    aya: Number(r.aya),
    text: r.translation,
    footnotes: r.footnotes || '',
  }));
  if (!ayahs.length) throw new Error('QuranEnc boş yanıt');
  write(k, ayahs);
  return { ayahs, source: src, version, fromCache: false };
}

/**
 * QuranEnc'ten bir surenin satırlarını alır. Tarayıcı doğrudan erişemezse (ağ/CORS) kendi
 * sunucumuzdaki aynı içeriğin önbelleğine düşer (backend: /api/quran/quranenc/{key}/{sura}).
 */
async function fetchRows(key, n) {
  try {
    const res = await fetch(`${API}/translation/sura/${key}/${n}`);
    if (!res.ok) throw new Error(`QuranEnc ${res.status}`);
    const json = await res.json();
    if (json.result?.length) return json.result;
    throw new Error('boş');
  } catch (e) {
    const base = (process.env.REACT_APP_BACKEND_URL ?? (process.env.NODE_ENV === 'production' ? 'https://islamapp2.onrender.com' : '')).replace(/\/+$/, '');
    const res = await fetch(`${base}/api/quran/quranenc/${key}/${n}`);
    if (!res.ok) throw e;
    const json = await res.json();
    return json.result || [];
  }
}

/** Tefsir kaynağı (şimdilik yalnız Türkçe). */
export function getTafsirSource(lang = 'tr') {
  return (sources.tafsir && (sources.tafsir[lang] || sources.tafsir.tr)) || null;
}

/**
 * Bir surenin kısa tefsirini getirir (Muhtasar Tefsir — QuranEnc). Meal ile aynı şartlara tabidir:
 * metin değiştirilmez, kaynak ve sürüm gösterilir. Yapay zekâ üretimi DEĞİLDİR.
 */
export async function fetchTafsir(surahNumber, lang = 'tr') {
  const src = getTafsirSource(lang);
  if (!src) return null;
  const n = Number(surahNumber);
  const local = await packSurah(src.key, n);
  if (local) return { ayahs: local.ayahs, source: src, version: local.version || src.surum, fromCache: true, offline: true };
  const version = await getLiveVersion(src, 'tr');
  const k = `${CACHE_PREFIX}:${src.key}:${version}:${n}`;
  const cached = read(k);
  if (cached?.length) return { ayahs: cached, source: src, version, fromCache: true };
  const rows = await fetchRows(src.key, n);
  const ayahs = rows.map((r) => ({ aya: Number(r.aya), text: r.translation, footnotes: r.footnotes || '' }));
  if (!ayahs.length) throw new Error('QuranEnc boş yanıt');
  write(k, ayahs);
  return { ayahs, source: src, version, fromCache: false };
}

/** Ekranda gösterilecek zorunlu künye satırı. */
export function mealCredit(source, version) {
  return `${source.ad} · ${source.kaynak} · v${version}`;
}

const mealService = { fetchMeal, fetchTafsir, getMealSource, getTafsirSource, mealCredit };
export default mealService;
