import { lazy } from 'react';

// 🔁 Sayfa parçası yüklenemezse (yeni sürüm yayımlandı, eski parça sunucuda yok ya da bağlantı koptu)
// önce bir kez yeniden dener; yine olmazsa sayfayı BİR KEZ yeniler. Böylece "beyaz ekran" ya da hata
// ekranı yerine güncel sürüm açılır. Yenileme döngüye girmesin diye işaret oturum boyunca tutulur.
const ANAHTAR = 'parca_yenilendi';

function bekle(ms) { return new Promise((r) => setTimeout(r, ms)); }

export function parcaHatasiMi(e) {
  const m = String((e && (e.message || e.name)) || e || '');
  return /Loading chunk|ChunkLoadError|Loading CSS chunk|Failed to fetch dynamically imported module|Importing a module script failed|Unexpected token '<'/i.test(m);
}

export function birKezYenile() {
  try {
    if (sessionStorage.getItem(ANAHTAR)) return false;
    sessionStorage.setItem(ANAHTAR, '1');
  } catch { return false; }
  if (typeof window !== 'undefined' && typeof window.__islamappHeal === 'function') {
    window.__islamappHeal();
    return true;
  }
  const p1 = ('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations)
    ? navigator.serviceWorker.getRegistrations().then((regs) => Promise.all(regs.map((r) => r.unregister()))).catch(() => {})
    : Promise.resolve();
  const p2 = (typeof window !== 'undefined' && window.caches && window.caches.keys)
    ? window.caches.keys().then((keys) => Promise.all(keys.map((k) => window.caches.delete(k)))).catch(() => {})
    : Promise.resolve();
  Promise.all([p1, p2]).finally(() => {
    window.location.replace(`${window.location.pathname}?v=${Date.now()}`);
  });
  return true;
}

export default function lazyR(yukle) {
  return lazy(async () => {
    try {
      const m = await yukle();
      try { sessionStorage.removeItem(ANAHTAR); } catch { /* yok */ }
      return m;
    } catch (e) {
      if (!parcaHatasiMi(e)) throw e;
      await bekle(600);
      try { return await yukle(); } catch (e2) {
        if (birKezYenile()) return new Promise(() => {}); // sayfa yenileniyor
        throw e2;
      }
    }
  });
}
