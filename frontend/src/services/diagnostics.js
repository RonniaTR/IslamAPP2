// 🩺 TANILAMA — hata ve kullanım kaydı, YALNIZ CİHAZDA.
//
// Hiçbir şey sunucuya gönderilmez, kimlik tutulmaz. Kullanıcı isterse Çevrimdışı ve Cihaz sayfasından
// raporu görür, kopyalar, siler. Amaç: "uygulama neden çöktü" ve "hangi sayfa kullanılıyor" sorularına
// kişinin kendi rızasıyla paylaşacağı bir cevap.
const ERR = 'diag_errors';
const USE = 'diag_usage';
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* kota */ } };

export function logError(msg, where = '') {
  const list = read(ERR, []);
  list.push({ t: new Date().toISOString(), msg: String(msg).slice(0, 300), where: String(where).slice(0, 120), route: typeof window !== 'undefined' ? window.location.pathname : '' });
  write(ERR, list.slice(-30));
}

/** Sayfa açılışını sayar. Yalnız yolun ilk parçası tutulur (/quran/2 → /quran): içerik izlenmez. */
export function countRoute(pathname) {
  const key = `/${String(pathname || '/').split('/')[1] || ''}`;
  const use = read(USE, {});
  use[key] = (use[key] || 0) + 1;
  write(USE, use);
}

export function getDiagnostics() {
  const usage = Object.entries(read(USE, {})).sort((a, b) => b[1] - a[1]);
  return { errors: read(ERR, []).reverse(), usage };
}

export function clearDiagnostics() {
  try { localStorage.removeItem(ERR); localStorage.removeItem(USE); } catch { /* yok */ }
}

let started = false;
export function initDiagnostics() {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.addEventListener('error', (e) => logError(e.message || 'hata', `${(e.filename || '').split('/').pop()}:${e.lineno || 0}`));
  window.addEventListener('unhandledrejection', (e) => logError((e.reason && (e.reason.message || e.reason)) || 'söz reddi', 'promise'));
}

const diagnostics = { initDiagnostics, logError, countRoute, getDiagnostics, clearDiagnostics };
export default diagnostics;
