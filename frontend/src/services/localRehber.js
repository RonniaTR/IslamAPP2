// 🔎 CİHAZDA REHBER ARAMASI — bağlantı yokken (ya da sunucu uyurken) kaynak bulur.
//
// backend/rehber.py'deki aramanın birebir karşılığıdır: kelime kökü (ilk 5 harf) + TF-IDF + kavram
// genişletme + elle seçilmiş tema listesi. Sözlükler tek kaynaktan üretilir (data/rehberData.json).
// YAPAY ZEKÂ YOKTUR: yalnız meal ve tefsir metnini bulur ve olduğu gibi gösterir; özet/hüküm üretmez.

import data from '../data/rehberData.json';
import { SURAHS } from '../data/surahData';
import { getPack } from './offline';

const STOP = new Set(data.stop);
const norm = (t) => String(t || '').replace(/I/g, 'ı').replace(/İ/g, 'i').toLowerCase();
const tokens = (t) => (norm(t).match(/[a-zçğıöşüâîû]+/g) || []).filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.slice(0, 5));
const count = (list) => { const m = new Map(); list.forEach((t) => m.set(t, (m.get(t) || 0) + 1)); return m; };
const expand = (q) => {
  const low = norm(q);
  const extra = Object.keys(data.expand).filter((k) => low.includes(k)).map((k) => data.expand[k]);
  return extra.length ? `${q} ${extra.join(' ')}` : q;
};

let index = null;
let building = null;

async function build() {
  const [meal, tafsir] = await Promise.all([getPack('turkish_rwwad'), getPack('turkish_mokhtasar')]);
  if (!meal) return null;
  const docs = [];
  meal.s.forEach((rows, si) => rows.forEach((r, ai) => {
    const t = tafsir && tafsir.s[si] && tafsir.s[si][ai] ? tafsir.s[si][ai][0] : '';
    docs.push({ surah: si + 1, ayah: ai + 1, meal: r[0], tafsir: t });
  }));
  const df = new Map();
  const tfs = docs.map((d) => {
    const m = tokens(d.meal);
    const tf = count(m.concat(m, tokens(d.tafsir)));      // meal iki kat ağırlıklı
    tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1));
    return tf;
  });
  const n = docs.length;
  const idf = new Map();
  df.forEach((c, t) => idf.set(t, Math.log(1 + n / c)));
  const postings = new Map();
  const norms = tfs.map((tf, i) => {
    let s = 0;
    tf.forEach((c, t) => {
      const w = (1 + Math.log(c)) * idf.get(t);
      if (!postings.has(t)) postings.set(t, []);
      postings.get(t).push([i, w]);
      s += w * w;
    });
    return Math.sqrt(s) || 1;
  });
  const credit = (p) => (p && p.edition ? `${p.edition.name || ''} · ${p.edition.source || 'QuranEnc.com'} · v${p.edition.version || ''}` : '');
  return { docs, idf, postings, norms, credits: { meal: credit(meal), tafsir: credit(tafsir) } };
}

/** Dizini hazırlar (bir kez; ~1 sn). Paket yoksa null. */
export function ensureIndex() {
  if (index) return Promise.resolve(index);
  if (!building) building = build().then((ix) => { index = ix; building = null; return ix; }).catch(() => { building = null; return null; });
  return building;
}

function search(ix, query, k = 5) {
  const base = count(tokens(query));
  const q = count(tokens(expand(query)));
  if (!q.size) return [];
  const scores = new Map();
  const matched = new Map();
  let qn = 0;
  q.forEach((c, t) => {
    const idf = ix.idf.get(t);
    if (!idf) return;
    const qw = (1 + Math.log(c)) * idf;
    qn += qw * qw;
    ix.postings.get(t).forEach(([i, w]) => {
      scores.set(i, (scores.get(i) || 0) + qw * w);
      if (!matched.has(i)) matched.set(i, new Set());
      matched.get(i).add(t);
    });
  });
  qn = Math.sqrt(qn) || 1;
  const denom = Math.max(1, base.size || q.size);
  const out = [];
  scores.forEach((s, i) => {
    const cover = Math.min(1, matched.get(i).size / denom);
    out.push([(s / (ix.norms[i] * qn)) * (0.5 + cover), cover, i]);
  });
  out.sort((a, b) => b[0] - a[0]);
  return out.slice(0, k).map(([score, cover, i]) => ({ score, cover, doc: ix.docs[i] }));
}

const NAMES = Object.fromEntries(SURAHS.map((s) => [s.n, s.name]));
const src = (n, d) => ({ n, surah: d.surah, ayah: d.ayah, ref: `${NAMES[d.surah] || ''} ${d.surah}:${d.ayah}`.trim(), meal: d.meal, tafsir: d.tafsir });

/** "Sor"un çevrimdışı karşılığı: yalnız kaynak döner, özet yazmaz. */
export async function localAsk(question) {
  const ix = await ensureIndex();
  if (!ix) return null;
  // Kapsam dışı kuralı (backend good_hits ile aynı): anlamlı kelimelerin yarısı kaynaklarda hiç geçmiyorsa sonuç yok.
  const base = Array.from(new Set(tokens(question)));
  const outOfScope = base.length > 0 && base.filter((t) => !ix.idf.has(t)).length / base.length >= 0.5;
  const good = outOfScope ? [] : search(ix, question, 5).filter((h) => h.score >= data.minScore && h.cover >= data.minCover).slice(0, 4);
  if (!good.length) {
    return { offline: true, label: 'yok', sources: [], credits: ix.credits,
      answer: 'Bu soruyu karşılayan bir kaynağı uygulamadaki meal ve tefsirde bulamadım. Tahminle cevap vermek istemiyorum. Kişisel dini sorular için Diyanet fetva hattını (ALO 190) arayabilirsin.' };
  }
  return { offline: true, label: 'cevrimdisi', sources: good.map((h, i) => src(i + 1, h.doc)), credits: ix.credits,
    answer: 'Şu an bağlantı yok; özet yazmıyorum. Soruna en yakın ayetler ve tefsirleri aşağıda, olduğu gibi. Bunlardan hüküm çıkarmak için bir bilene danış.' };
}

/** "Bugün bana ne söyler?"in çevrimdışı karşılığı. */
export async function localAyet(text) {
  const ix = await ensureIndex();
  if (!ix) return null;
  const low = norm(text);
  const by = new Map(ix.docs.map((d) => [`${d.surah}:${d.ayah}`, d]));
  const docs = [];
  data.themes.forEach(([keys, ayahs]) => {
    if (keys.some((k) => low.includes(k))) ayahs.forEach(([s, a]) => { const d = by.get(`${s}:${a}`); if (d && !docs.includes(d)) docs.push(d); });
  });
  search(ix, text, 6).forEach((h) => { if (h.score >= 0.3 && h.cover >= 0.6 && !docs.includes(h.doc)) docs.push(h.doc); });
  return { offline: true, ready: true, results: docs.slice(0, 3).map((d, i) => src(i + 1, d)), credits: ix.credits };
}

const localRehber = { ensureIndex, localAsk, localAyet };
export default localRehber;
