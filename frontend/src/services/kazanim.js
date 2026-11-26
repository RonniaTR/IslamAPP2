// ✨ KAZANIM KAYDI — Sevap Points, gün çetelesi ve kişisel bildirim önceliğinin ortak veri katmanı.
//
// Ne kaydedilir: hangi bölümde ne kadar vakit geçirildiği (dakika) ve birkaç açık olay (salavat, kitap sayfası, doğru cevap).
// Nerede durur: YALNIZ bu cihazda (localStorage). Sunucuya gitmez, kimseyle karşılaştırılmaz.
// Ne DEĞİLDİR: bir dindarlık, iman ya da sevap ölçüsü. Sevabı yalnız Allah bilir; bu sayı uygulamadaki çabanı gösterir.

export const ALANLAR = [
  { id: 'iman', ad: 'İman', renk: '#D8B76A' },
  { id: 'ibadet', ad: 'İbadet', renk: '#2FA37A' },
  { id: 'ahlak', ad: 'Ahlak', renk: '#E08A6B' },
  { id: 'ilim', ad: 'İlim', renk: '#5B8DD9' },
  { id: 'kuran', ad: "Kur'an", renk: '#1F9E8E' },
  { id: 'fen', ad: 'Fen', renk: '#8C6BD9' },
  { id: 'sabir', ad: 'Sabır', renk: '#C9A227' },
  { id: 'toplum', ad: 'Toplum', renk: '#D96B9B' },
];

// Yol → alan(lar). İlk eşleşen kural geçerlidir; birden çok alan varsa süre paylaştırılır.
const KURALLAR = [
  [/^\/(mushaf|quran|hifz|kelime|hatim-plani|defter|elifba|mahrec|ayet-tablosu)/, ['kuran']],
  [/^\/hatim/, ['kuran', 'toplum']],
  [/^\/salavat/, ['ibadet', 'toplum']],
  [/^\/(dhikr|tesbihat|qibla|kaza|ramadan|fiqh|prayer)/, ['ibadet']],
  [/^\/kandil/, ['ibadet', 'toplum']],
  [/^\/musluman-olmak.*mecmua/, ['fen', 'ilim']],
  [/^\/musluman-olmak/, ['ahlak', 'ilim']],
  [/^\/(hadith|library|siyer|rehber|chat|discover)/, ['ilim']],
  [/^\/(prophets|stories|esma)/, ['iman', 'ilim']],
  [/^\/(journal|rahmet)/, ['ahlak', 'sabir']],
  [/^\/sofra/, ['ahlak', 'toplum']],
  [/^\/(donus|yol)/, ['sabir', 'iman']],
  [/^\/(multiplayer|games)/, ['ilim', 'fen']],
];

const ANAHTAR = 'kazanim_v1';          // { alanlar: {id: puan}, gunler: {YYYY-MM-DD: {id: puan}}, ilk: 'YYYY-MM-DD' }
const DAKIKA_PUAN = 2;                  // 1 dk = 2 puan
const ZIYARET_TAVANI = 10 * 60 * 1000;  // tek ziyarette en çok 10 dk sayılır (açık unutulan ekran şişirmesin)

export function gunAnahtari(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function oku() {
  try { const v = JSON.parse(localStorage.getItem(ANAHTAR)); if (v && v.alanlar) return v; } catch { /* bozuk */ }
  return { alanlar: {}, gunler: {}, ilk: gunAnahtari() };
}
function yaz(v) { try { localStorage.setItem(ANAHTAR, JSON.stringify(v)); } catch { /* kota */ } }
const dinleyiciler = new Set();
function bildir() { dinleyiciler.forEach((f) => f()); }
export function kazanimDinle(f) { dinleyiciler.add(f); return () => dinleyiciler.delete(f); }

/** Bir alana puan ekler. */
export function puanEkle(alan, puan, d = new Date()) {
  if (!puan || puan <= 0) return;
  const v = oku(); const g = gunAnahtari(d);
  v.alanlar[alan] = (v.alanlar[alan] || 0) + puan;
  v.gunler[g] = v.gunler[g] || {};
  v.gunler[g][alan] = (v.gunler[g][alan] || 0) + puan;
  yaz(v); bildir();
}

/** Uygulama açıldığında: bugünü çeteleye işler (puansız giriş). */
export function gunuIsaretle() {
  const v = oku(); const g = gunAnahtari();
  if (!v.gunler[g]) { v.gunler[g] = {}; yaz(v); bildir(); }
}

// ---- Yol takibi (Layout her yol değişiminde çağırır) ----
let aktif = null; // { yol, basla }
export function yolDegisti(yol) {
  const simdi = Date.now();
  if (aktif) {
    const sure = Math.min(ZIYARET_TAVANI, simdi - aktif.basla);
    const kural = KURALLAR.find(([re]) => re.test(aktif.yol));
    if (kural && sure > 8000) {
      const puan = (sure / 60000) * DAKIKA_PUAN / kural[1].length;
      kural[1].forEach((a) => puanEkle(a, Math.round(puan * 10) / 10));
    }
  }
  aktif = yol ? { yol, basla: simdi } : null;
}

// ---- Okuma ----
export function alanPuanlari() {
  const v = oku();
  return ALANLAR.map((a) => ({ ...a, puan: Math.round(v.alanlar[a.id] || 0) }));
}
export function toplamPuan() { return alanPuanlari().reduce((t, a) => t + a.puan, 0); }
export function ilkGun() { return oku().ilk; }

/** Çetele: girilen günler kümesi ve seri. */
export function cetele() {
  const v = oku();
  const gunler = new Set(Object.keys(v.gunler));
  let seri = 0; const d = new Date();
  for (;;) { if (gunler.has(gunAnahtari(d))) { seri += 1; d.setDate(d.getDate() - 1); } else break; }
  const ilk = v.ilk; const bas = new Date(`${ilk}T00:00:00`);
  const kacinciGun = Math.max(1, Math.floor((Date.now() - bas.getTime()) / 864e5) + 1);
  return { gunler, seri, ilk, kacinciGun, toplamGun: gunler.size };
}

/** Son 7 günde en çok vakit geçirilen alanlar — bildirim önceliği için. */
export function oncelikler(gunSayisi = 7) {
  const v = oku(); const t = {};
  for (let i = 0; i < gunSayisi; i += 1) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const g = v.gunler[gunAnahtari(d)] || {};
    Object.entries(g).forEach(([a, p]) => { t[a] = (t[a] || 0) + p; });
  }
  return Object.entries(t).sort((a, b) => b[1] - a[1]).map(([a]) => a);
}

/** Son N günün toplam puanı (bugün dahil). */
export function donemPuani(gunSayisi = 1) {
  const v = oku(); let t = 0;
  for (let i = 0; i < gunSayisi; i += 1) {
    const d = new Date(); d.setDate(d.getDate() - i);
    Object.values(v.gunler[gunAnahtari(d)] || {}).forEach((p) => { t += p; });
  }
  return Math.round(t);
}
