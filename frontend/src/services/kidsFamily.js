// 👨‍👩‍👧 ÇOCUK İLERLEMESİ ve AİLE AYARLARI — yalnız bu cihazda (localStorage). Hiçbir yere gönderilmez.
//   yıldızlar · tamamlanan dersler/hikâyeler · haftalık sayaçlar · ebeveyn ayarları (süre, bölümler, hedef, mesaj) · günlük kullanım
const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* kota */ } };
const day = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const week = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return day(x); };

// ── yıldız ve ilerleme ──
export const getStars = () => Number(read('kids_stars', 0)) || 0;
export function addStars(n) { const s = getStars() + n; write('kids_stars', s); bump('yildiz', n); return s; }
export const loadKidsProgress = () => read('kids_progress_v1', { namaz: [], hikaye: [] });
export function markKids(key, id) {
  const p = loadKidsProgress();
  const list = p[key] || [];
  if (!list.includes(id)) { p[key] = [...list, id]; write('kids_progress_v1', p); bump(key === 'namaz' ? 'namaz' : key === 'hikaye' ? 'hikaye' : key); }
  return p;
}

// ── haftalık sayaçlar (hedefler için) ──
export const weekCounts = () => read(`kids_week_${week()}`, {});
export function bump(type, n = 1) { const w = weekCounts(); w[type] = (w[type] || 0) + n; write(`kids_week_${week()}`, w); }

// ── aile ayarları ──
export const SECTIONS = [
  { id: 'quran', label: "Kur'an" }, { id: 'prayer', label: 'Namaz' }, { id: 'prophets', label: 'Hikâyeler' },
  { id: 'games', label: 'Oyunlar' }, { id: 'coloring', label: 'Boyama' }, { id: 'tasks', label: 'Görevler' },
];
export const GOALS = [
  { id: 'namaz2', label: "Namaz Yolu'nda 2 durak", type: 'namaz', need: 2, icon: '🕌' },
  { id: 'hikaye1', label: '1 hikâyeyi bitir', type: 'hikaye', need: 1, icon: '📖' },
  { id: 'hikaye3', label: '3 hikâyeyi bitir', type: 'hikaye', need: 3, icon: '📚' },
  { id: 'yildiz20', label: '20 yıldız topla', type: 'yildiz', need: 20, icon: '⭐' },
  { id: 'kible', label: 'Kıbleyi bul', type: 'kible', need: 1, icon: '🧭' },
];
const DEFAULT = { limit: 0, sections: {}, goals: ['namaz2', 'hikaye1'], message: null };
export const loadFamily = () => ({ ...DEFAULT, ...read('kids_family_v1', {}) });
export function saveFamily(f) { write('kids_family_v1', f); return f; }
export const sectionOn = (id) => loadFamily().sections[id] !== false;

// ── günlük kullanım (dakika) ──
export const usedToday = () => Number(read(`kids_usage_${day()}`, 0)) || 0;
export function tickMinute() { const m = usedToday() + 1; write(`kids_usage_${day()}`, m); return m; }
export function extendToday(min) { write(`kids_usage_${day()}`, Math.max(0, usedToday() - min)); }

/** Ebeveyn kapısı: rastgele çarpım sorusu (okuma bilen küçük çocuğun kolayca geçemeyeceği türden). */
export function gateQuestion() {
  const a = 6 + Math.floor(Math.random() * 4); const b = 6 + Math.floor(Math.random() * 4);
  return { text: `${a} × ${b} = ?`, answer: a * b };
}
