// 🎨 Renk yardımcıları — tema renklerinden saydamlık ve karışım üretir.
// Girdi #RGB, #RRGGBB ya da rgb()/rgba() olabilir; tanınmayan değer olduğu gibi döner.

function ayristir(c) {
  if (typeof c !== 'string') return null;
  const s = c.trim();
  if (s[0] === '#') {
    let h = s.slice(1);
    if (h.length === 3) h = h.split('').map((x) => x + x).join('');
    if (h.length === 8) h = h.slice(0, 6);
    if (h.length !== 6) return null;
    const n = parseInt(h, 16);
    if (Number.isNaN(n)) return null;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const p = m[1].split(',').map((x) => parseFloat(x));
    if (p.length >= 3) return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  return null;
}

/** Rengi verilen saydamlıkla döndürür: alfa('#C8A55A', 0.2) → 'rgba(200,165,90,0.2)' */
export function alfa(c, a) {
  const r = ayristir(c);
  if (!r) return c;
  return `rgba(${r[0]},${r[1]},${r[2]},${a})`;
}

/** İki rengi t oranında karıştırır (0 → a, 1 → b). */
export function karistir(a, b, t) {
  const x = ayristir(a); const y = ayristir(b);
  if (!x || !y) return a;
  const k = (i) => Math.round(x[i] + (y[i] - x[i]) * t);
  return `rgb(${k(0)},${k(1)},${k(2)})`;
}

/** Rengin göreli parlaklığı (0 koyu … 1 açık). */
export function parlaklik(c) {
  const r = ayristir(c);
  if (!r) return 0.5;
  return (0.299 * r[0] + 0.587 * r[1] + 0.114 * r[2]) / 255;
}

/** Zemin üzerinde okunur yazı rengi. */
export function ustYazi(zemin) {
  return parlaklik(zemin) > 0.6 ? '#1A1406' : '#FFFFFF';
}
