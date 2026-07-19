// frontend/src/services/hifzEngine.js
// 📿 EZBER ASISTANI — aralıklı tekrar (spaced repetition) motoru.
//
// Her ayet bir "kart"tır. Ezber pratiğinden sonra verilen nota göre
// (Tekrar/Zor/İyi/Kolay) bir sonraki tekrar tarihi hesaplanır; aralıklar
// giderek açılır (1 → 2 → 4 → 7 → 15... gün). 7 gün ve üzeri aralığa
// ulaşan ayet "sağlam" sayılır. Tamamen istemci tarafında çalışır.
// Ses: mevcut ayet ses URL'leri (cdn.islamic.network) döngüyle dinletilir;
// anlam desteği: kelimeMeal verisi (varsa) karta eklenir.

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };

const LS = 'hifz_state';
const DAY = 86400000;

// Ezber rotası — kolaydan zora klasik sıra (namaz sureleri ağırlıklı)
export const HIFZ_TRACKS = [
  { no: 1,   name: 'Fâtiha',  ar: 'الفاتحة', verses: 7, tier: 'Başlangıç' },
  { no: 112, name: 'İhlâs',   ar: 'الإخلاص', verses: 4, tier: 'Başlangıç' },
  { no: 108, name: 'Kevser',  ar: 'الكوثر',  verses: 3, tier: 'Başlangıç' },
  { no: 103, name: 'Asr',     ar: 'العصر',   verses: 3, tier: 'Başlangıç' },
  { no: 110, name: 'Nasr',    ar: 'النصر',   verses: 3, tier: 'Orta' },
  { no: 114, name: 'Nâs',     ar: 'الناس',   verses: 6, tier: 'Orta' },
  { no: 113, name: 'Felâk',   ar: 'الفلق',   verses: 5, tier: 'Orta' },
  { no: 105, name: 'Fîl',     ar: 'الفيل',   verses: 5, tier: 'Orta' },
  { no: 106, name: 'Kureyş',  ar: 'قريش',    verses: 4, tier: 'Orta' },
  { no: 111, name: 'Tebbet',  ar: 'المسد',   verses: 5, tier: 'İleri' },
  { no: 107, name: 'Mâûn',    ar: 'الماعون', verses: 7, tier: 'İleri' },
  { no: 109, name: 'Kâfirûn', ar: 'الكافرون', verses: 6, tier: 'İleri' },
];

const key = (s, a) => `${s}:${a}`;
export function getState() { return load(LS, {}); }

export function getCard(s, a) { return getState()[key(s, a)] || null; }

// Nota göre yeni aralık (gün)
function nextInterval(card, grade) {
  const cur = card?.interval || 0;
  if (grade === 'again') return 0;                      // bugün tekrar
  if (grade === 'hard') return Math.max(1, Math.round(cur * 1.2));
  if (grade === 'good') return cur === 0 ? 1 : Math.round(cur * 1.8);
  return cur === 0 ? 2 : Math.round(cur * 2.5);         // easy
}

export function gradeCard(s, a, grade) {
  const st = getState();
  const k = key(s, a);
  const prev = st[k] || { reps: 0, interval: 0, due: Date.now() };
  const interval = nextInterval(prev, grade);
  st[k] = {
    reps: prev.reps + 1,
    interval,
    due: Date.now() + (interval === 0 ? 10 * 60 * 1000 : interval * DAY),
    last: Date.now(),
  };
  save(LS, st);
  return st[k];
}

// Durum: new | due | learning | solid
export function cardStatus(s, a) {
  const c = getCard(s, a);
  if (!c) return 'new';
  if (c.due <= Date.now()) return 'due';
  return c.interval >= 7 ? 'solid' : 'learning';
}

export function surahProgress(track) {
  let solid = 0, started = 0;
  for (let a = 1; a <= track.verses; a++) {
    const stt = cardStatus(track.no, a);
    if (stt !== 'new') started += 1;
    if (stt === 'solid') solid += 1;
  }
  return { solid, started, total: track.verses };
}

// Bugün tekrarı gelen kartlar (rota sırasıyla)
export function dueList() {
  const out = [];
  for (const t of HIFZ_TRACKS) {
    for (let a = 1; a <= t.verses; a++) {
      const c = getCard(t.no, a);
      if (c && c.due <= Date.now()) out.push({ surah: t.no, ayah: a, track: t });
    }
  }
  return out;
}

export function totals() {
  let solid = 0, learning = 0;
  for (const t of HIFZ_TRACKS) {
    const p = surahProgress(t);
    solid += p.solid; learning += p.started - p.solid;
  }
  return { solid, learning, due: dueList().length };
}

// Günlük çalışma kaydı (Nur Yolu algılaması bunu okur)
export function logSession(count) {
  const k = `hifz_log_${new Date().toISOString().slice(0, 10)}`;
  const cur = load(k, { count: 0 });
  save(k, { count: cur.count + count, ts: Date.now() });
}

const hifzEngine = { HIFZ_TRACKS, getCard, gradeCard, cardStatus, surahProgress, dueList, totals, logSession };
export default hifzEngine;
