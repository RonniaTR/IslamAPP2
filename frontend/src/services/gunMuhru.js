/**
 * GÜN MÜHRÜ
 * ─────────
 * Uygulamanın eksik yarısı buydu.
 *
 * Sade'nin güzel bir AÇILIŞI var: kandil, perde, şafak, kemer.
 * Ama hiçbir ÇIKIŞI yoktu. İnsan uygulamayı açıyor, bir şeyler yapıyor
 * ve öylece bırakıp gidiyor. Gün hiç bitmiyor.
 *
 * Gün Mührü bunu kapatır: yatsıdan sonra bir kez, yirmi saniyelik bir
 * tören. Tek soru, tek işaret, sonra mühür basılır. Gün kapanır.
 *
 * NEDEN ÖNEMLİ
 *   1. Alışkanlığın en güçlü çapası yatma saatidir — sabah değil.
 *   2. Dört eksenin en zayıfı "Kalp" (muhasebe). Mühür onu doğrudan
 *      besler; üç satır yazmak yerine tek cümle yeter.
 *   3. Mühürlenen gün paylaşılabilir bir şeye dönüşür (paylasimKarti.js).
 *   4. Ay sonunda otuz mühür, otuz XP'den daha çok şey anlatır.
 *
 * Mühür bir puan değildir — bir kayıttır. Bozulmaz, silinmez, geriye
 * dönük basılamaz. Gün geçtiyse geçmiştir; yarın yeni bir mühür var.
 */

import { gununCumlesi, nabizPuani, gununEksenleri } from './nabiz';

const KEY = 'gun_muhru';
const gunKey = (d = new Date()) => d.toISOString().slice(0, 10);
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* quota */ } };

/** Günün tek sorusu — her gün değişir, hiçbiri yargılamaz. */
export const SORULAR = [
  'Bugün seni en çok ne yordu?',
  'Bugün fark ettiğin küçük bir iyilik neydi?',
  'Bugün kime hakkını veremedin?',
  'Bugünü bir kelimeyle söylesen?',
  'Yarın bugünden bir şey taşıyacak olsan, ne olurdu?',
  'Bugün en çok neye şükrettin?',
  'Bugün seni durduran şey neydi?',
];

/** Gün sonu hâli — üç işaret, ölçmek için değil, adını koymak için. */
export const HALLER = [
  { id: 'agir',  simge: '🪨', ad: 'Ağır geçti' },
  { id: 'sade',  simge: '🌾', ad: 'Sade geçti' },
  { id: 'acik',  simge: '✨', ad: 'Açık geçti' },
];

export function gununSorusu(gun = gunKey()) {
  const n = gun.split('-').reduce((a, x) => a + Number(x), 0);
  return SORULAR[n % SORULAR.length];
}

export function muhurler() { return load(); }

export function bugunMuhurlu(gun = gunKey()) {
  return !!load()[gun];
}

export function getMuhur(gun = gunKey()) {
  return load()[gun] || null;
}

/**
 * Günü mühürler. Bir gün YALNIZCA BİR KEZ mühürlenir ve geriye dönük
 * mühür basılamaz — mühür bir puan değil, bir kayıttır.
 */
export function muhurle({ hal, not } = {}) {
  const g = gunKey();
  const all = load();
  if (all[g]) return all[g];
  all[g] = {
    gun: g,
    ts: Date.now(),
    hal: hal || 'sade',
    not: String(not || '').slice(0, 280),
    puan: nabizPuani(),
    eksen: gununEksenleri().map(e => ({ id: e.id, oran: Math.round(e.oran * 100) })),
    cumle: gununCumlesi().metin,
  };
  // 400 günden eskisini at
  const sinir = new Date(); sinir.setDate(sinir.getDate() - 400);
  const kes = gunKey(sinir);
  Object.keys(all).forEach(k => { if (k < kes) delete all[k]; });
  save(all);
  return all[g];
}

/** Son N günün mühür şeridi — takvim görünümü için. */
export function muhurSeridi(n = 30) {
  const all = load();
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = gunKey(d);
    out.push({ gun: k, gunNo: d.getDate(), muhur: all[k] || null, bugun: i === 0 });
  }
  return out;
}

/** Kesintisiz mühür serisi. */
export function muhurSerisi() {
  const all = load();
  let n = 0;
  const d = new Date();
  if (!all[gunKey(d)]) d.setDate(d.getDate() - 1);
  for (;;) {
    if (all[gunKey(d)]) { n += 1; d.setDate(d.getDate() - 1); } else break;
  }
  return n;
}

/** Toplam mühür sayısı. */
export function muhurSayisi() { return Object.keys(load()).length; }

/**
 * Mührün vakti geldi mi?
 * Yatsıdan sonra ya da saat 21'i geçtiyse. Erken sorulmaz — gün bitmeden
 * "günü kapat" demek, günü kısaltmaktır.
 */
export function muhurVaktiGeldi(yatsiSaat = '21:00') {
  if (bugunMuhurlu()) return false;
  const [h, m] = String(yatsiSaat).split(':').map(Number);
  const now = new Date();
  const dk = now.getHours() * 60 + now.getMinutes();
  return dk >= (h * 60 + m) || now.getHours() < 4;
}

const gunMuhru = {
  SORULAR, HALLER, gununSorusu, muhurler, bugunMuhurlu, getMuhur,
  muhurle, muhurSeridi, muhurSerisi, muhurSayisi, muhurVaktiGeldi,
};
export default gunMuhru;
