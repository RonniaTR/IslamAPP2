// 📦 ÇEVRİMDIŞI PAKETLER — meal, tefsir (ve onaydan sonra Mushaf) bağlantı olmadan okunur.
//
// Paketler uygulamayla aynı alan adından gelir (/packs/*.json; üret: scripts/build-packs.py).
// Okuma sırası: bellek → IndexedDB → /packs (servis çalışanı bunu da önbelleğe alır).
// Bir paket bir kez okununca IndexedDB'ye yazılır; sonrası ağ gerektirmez.
// Metinlere dokunulmaz; sürüm ve kaynak paketin içindeki `edition` alanında taşınır.

const DB = 'islamapp_offline';
const STORE = 'packs';
const mem = new Map();
const pending = new Map();

export const PACKS = [
  { id: 'turkish_rwwad', title: 'Türkçe meal', desc: 'Rowad Tercüme Merkezi · QuranEnc' },
  { id: 'turkish_mokhtasar', title: 'Türkçe kısa tefsir', desc: 'Muhtasar Tefsir · QuranEnc' },
  { id: 'english_rwwad', title: 'İngilizce meal', desc: 'Rowad Translation Center · QuranEnc' },
  { id: 'mushaf', title: 'Mushaf (Arapça metin)', desc: 'Tanzil · Osmanî hat', gated: true },
];

function open() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('IndexedDB yok')); return; }
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idb(mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req && req.result);
    tx.onerror = () => reject(tx.error);
  });
}
const idbGet = (k) => idb('readonly', (s) => s.get(k)).catch(() => undefined);
const idbSet = (k, v) => idb('readwrite', (s) => s.put(v, k)).catch(() => undefined);
const idbDel = (k) => idb('readwrite', (s) => s.delete(k)).catch(() => undefined);
const idbKeys = () => idb('readonly', (s) => s.getAllKeys()).catch(() => []);

/** Paketi getirir; yoksa null. Ağdan ilk okumada cihaza kaydeder. */
export async function getPack(id) {
  if (mem.has(id)) return mem.get(id);
  if (pending.has(id)) return pending.get(id);
  const job = (async () => {
    let pack = await idbGet(id);
    if (!pack) {
      try {
        const res = await fetch(`${process.env.PUBLIC_URL || ''}/packs/${id}.json`);
        const type = res.headers.get('content-type') || '';
        if (res.ok && type.includes('json')) { pack = await res.json(); idbSet(id, pack); }
      } catch { pack = null; }
    }
    if (pack) mem.set(id, pack);
    pending.delete(id);
    return pack || null;
  })();
  pending.set(id, job);
  return job;
}

/** Cihazda kayıtlı paket kimlikleri. */
export async function installedPacks() { return (await idbKeys()) || []; }

/** Paketi şimdi indirip kaydeder. @returns {Promise<boolean>} */
export async function installPack(id) { return !!(await getPack(id)); }

export async function removePack(id) { mem.delete(id); await idbDel(id); }

/** Bir surenin satırları: [{aya, text, footnotes}] ya da null. */
export async function packSurah(key, n) {
  const pack = await getPack(key);
  const rows = pack && pack.s && pack.s[n - 1];
  if (!rows) return null;
  return { ayahs: rows.map((r, i) => ({ aya: i + 1, text: r[0], footnotes: r[1] || '' })), version: (pack.edition && pack.edition.version) || '' };
}

/** Mushaf sayfası (paket varsa): { page, ayahs:[{text,n,surah,surahName,juz,sajda}] } ya da null. */
export async function packPage(n) {
  const pack = await getPack('mushaf');
  const rows = pack && pack.pages && pack.pages[String(n)];
  if (!rows) return null;
  return { page: n, ayahs: rows.map((r) => ({ surah: r[0], n: r[1], juz: r[2], sajda: !!r[3], text: r[4], surahName: pack.names[r[0]] })) };
}

/** İlk açılıştan sonra, boşta, Türkçe meal ve tefsiri sessizce cihaza alır (≈2,8 MB; bir kez). */
export function warmOffline() {
  const run = () => { getPack('turkish_rwwad').then(() => getPack('turkish_mokhtasar')).catch(() => {}); };
  const conn = typeof navigator !== 'undefined' && navigator.connection;
  if (conn && conn.saveData) return;          // veri tasarrufu açıksa kullanıcı Çevrimdışı Paketler'den kendisi indirir
  if (typeof window !== 'undefined' && window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 15000 });
  else setTimeout(run, 8000);
}

const offline = { PACKS, getPack, installPack, installedPacks, removePack, packSurah, packPage, warmOffline };
export default offline;
