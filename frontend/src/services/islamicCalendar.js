// frontend/src/services/islamicCalendar.js
// 🗓️ MÜBAREK GÜNLER — tek takvim kaynağı.
//
// Önceki durum: UpcomingEventsRow 2024, ProfilePage 2025 ve 2026 tarihlerini elle yazıyordu;
// aynı uygulamada birbirini tutmayan üç ayrı liste vardı. Artık bütün ekranlar buradan okur.
//
// Yöntem: tarayıcının Hicri takvimi (Intl, 'islamic-umalqura') ile Hicri gün → Miladi gün bulunur.
// SINIR: Ümmü'l-Kurâ hesabı Diyanet takviminden 1 gün farklı düşebilir. Bu yüzden her kayıt
// `approx: true` taşır ve ekranda "tahmini" notu gösterilir. Faz 2'de Diyanet'in yıllık dinî günler
// listesi resmî kaynaktan alınıp bu hesabın önüne konacak.

const HIJRI_FMT = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
  day: 'numeric', month: 'numeric', year: 'numeric',
});

/** Miladi tarihin Hicri karşılığı: { y, m, d } */
export function toHijri(date) {
  const parts = HIJRI_FMT.formatToParts(date);
  const get = (t) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get('year'), m: get('month'), d: get('day') };
}

const atNoon = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

/** Hicri (y, m, d) gününün Miladi karşılığı. Yaklaşık tahminden başlayıp günü gün arar. */
export function fromHijri(y, m, d) {
  // Hicri yıl ≈ 354,367 gün; 1 Muharrem 1 = 16 Temmuz 622 (Jülyen) civarı.
  const approxDays = Math.floor((y - 1) * 354.367 + (m - 1) * 29.53 + (d - 1));
  let g = atNoon(addDays(new Date(622, 6, 19), approxDays));
  for (let i = 0; i < 80; i++) {
    const h = toHijri(g);
    const diff = (y - h.y) * 354 + (m - h.m) * 29.5 + (d - h.d);
    if (h.y === y && h.m === m && h.d === d) return g;
    g = addDays(g, diff > 0 ? Math.max(1, Math.floor(diff)) : Math.min(-1, Math.ceil(diff)));
  }
  return null;
}

// kind: 'gece' → kandil/gece; Türkiye'de anılan tarih, Hicri günün BAŞLADIĞI akşamdır (bir gün önce).
const DAYS = [
  { id: 'hicri-yilbasi', name: 'Hicrî Yılbaşı', m: 1, d: 1, kind: 'gun', icon: '🌙', color: '#10b981' },
  { id: 'asure', name: 'Aşure Günü', m: 1, d: 10, kind: 'gun', icon: '🥣', color: '#f59e0b' },
  { id: 'mevlid', name: 'Mevlid Kandili', m: 3, d: 12, kind: 'gece', icon: '🕌', color: '#ec4899' },
  { id: 'regaib', name: 'Regaib Kandili', m: 7, d: 1, kind: 'regaib', icon: '✨', color: '#8b5cf6' },
  { id: 'mirac', name: 'Miraç Kandili', m: 7, d: 27, kind: 'gece', icon: '🌌', color: '#6366f1' },
  { id: 'berat', name: 'Berat Kandili', m: 8, d: 15, kind: 'gece', icon: '📜', color: '#14b8a6' },
  { id: 'ramazan', name: 'Ramazan Başlangıcı', m: 9, d: 1, kind: 'gun', icon: '🌙', color: '#10b981' },
  { id: 'kadir', name: 'Kadir Gecesi', m: 9, d: 27, kind: 'gece', icon: '✨', color: '#f59e0b' },
  { id: 'ramazan-bayrami', name: 'Ramazan Bayramı', m: 10, d: 1, kind: 'gun', icon: '🎉', color: '#3b82f6' },
  { id: 'arefe', name: 'Arefe Günü', m: 12, d: 9, kind: 'gun', icon: '🤲', color: '#06b6d4' },
  { id: 'kurban-bayrami', name: 'Kurban Bayramı', m: 12, d: 10, kind: 'gun', icon: '🐑', color: '#8b5cf6' },
];

function resolve(day, hijriYear) {
  let g = fromHijri(hijriYear, day.m, day.d);
  if (!g) return null;
  if (day.kind === 'gece') g = addDays(g, -1);
  if (day.kind === 'regaib') {
    // Recep ayının ilk cuma gecesi = ilk cumadan önceki perşembe akşamı.
    while (g.getDay() !== 5) g = addDays(g, 1);
    g = addDays(g, -1);
  }
  return g;
}

/**
 * Bugünden sonraki mübarek günler, tarihe göre sıralı.
 * @returns {Array<{id,name,icon,color,date:Date,daysLeft:number,dateLabel:string,approx:true}>}
 */
export function getUpcomingDays(limit = 3, from = new Date(), locale = 'tr-TR') {
  const today = atNoon(from);
  const hy = toHijri(today).y;
  const out = [];
  [hy, hy + 1].forEach((y) => {
    DAYS.forEach((day) => {
      const date = resolve(day, y);
      if (!date) return;
      const daysLeft = Math.round((atNoon(date) - today) / 86400000);
      if (daysLeft < 0) return;
      out.push({
        id: `${day.id}-${y}`, name: day.name, icon: day.icon, color: day.color,
        date, daysLeft, approx: true,
        dateLabel: date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
      });
    });
  });
  return out.sort((a, b) => a.date - b.date).slice(0, limit);
}

/**
 * Bu akşam (ya da dün akşam başlayıp bu sabaha süren) mübarek gece. Yoksa null.
 * Kandil ışık haritası yalnız bu aralıkta ışık kabul eder.
 */
export function getActiveNight(from = new Date()) {
  const today = atNoon(from);
  const hy = toHijri(today).y;
  for (const y of [hy - 1, hy, hy + 1]) {
    for (const day of DAYS) {
      if (day.kind !== 'gece' && day.kind !== 'regaib') continue;
      const date = resolve(day, y);
      if (!date) continue;
      const diff = Math.round((today - atNoon(date)) / 86400000);
      if (diff === 0 || diff === 1) return { id: `${day.id}-${y}`, name: day.name, icon: day.icon, date };
    }
  }
  return null;
}

export const CALENDAR_NOTE = 'Tarihler hesapla bulunur; Diyanet takvimine göre bir gün farklı olabilir.';

const islamicCalendar = { toHijri, fromHijri, getUpcomingDays, CALENDAR_NOTE };
export default islamicCalendar;
