/**
 * RİTİM
 * ─────
 * Uygulama herkese aynı saatte aynı şeyi söylüyordu. Oysa sabah beşte
 * açan biriyle gece yarısı açan biri aynı insan değildir.
 *
 * Ritim iki şeyi bilir:
 *   1. ŞU AN günün neresi (seher, sabah, gündüz, ikindi, akşam, gece)
 *   2. Kişi GENELDE ne zaman açıyor (nabiz.alisillanSaat)
 *
 * ve ekranın açılış cümlesini buna göre seçer. Cümleler kutlamaz,
 * azarlamaz, hedef koymaz — sadece kişiyi bulunduğu ana yerleştirir.
 *
 * Tasarım kararı: burada rastgelelik YOKTUR. Aynı saatte aynı cümle
 * gelir. Bir yer, her açtığında başka bir şey söylüyorsa, orası ev
 * olmaz.
 */

import { alisillanSaat } from './nabiz';

/** Günün altı anı. Sınırlar namaz vakitlerine değil, insan hâline göre. */
export const ANLAR = [
  { id: 'seher',  ad: 'Seher',   bas: 3,  bit: 6,  simge: '✧' },
  { id: 'sabah',  ad: 'Sabah',   bas: 6,  bit: 11, simge: '☀' },
  { id: 'gunduz', ad: 'Gündüz',  bas: 11, bit: 16, simge: '◎' },
  { id: 'ikindi', ad: 'İkindi',  bas: 16, bit: 19, simge: '◐' },
  { id: 'aksam',  ad: 'Akşam',   bas: 19, bit: 22, simge: '☾' },
  { id: 'gece',   ad: 'Gece',    bas: 22, bit: 3,  simge: '✦' },
];

export function suankiAn(saat = new Date().getHours()) {
  for (const a of ANLAR) {
    if (a.bas < a.bit) { if (saat >= a.bas && saat < a.bit) return a; }
    else if (saat >= a.bas || saat < a.bit) return a;
  }
  return ANLAR[2];
}

/**
 * Ana göre açılış cümlesi. İki sürüm: kişi HER ZAMANKİ saatinde
 * geldiyse "tanıyan" bir cümle, alışılmadık bir saatte geldiyse
 * "fark eden" bir cümle. İkisi de yorum yapmaz.
 */
const CUMLELER = {
  seher:  { her: 'Seher vakti. Bu saatte açık olan az kapı var.',
            yeni: 'Herkes uyurken buradasın. Sessizlik senin.' },
  sabah:  { her: 'Sabah. Gün henüz kimseye ait değil.',
            yeni: 'Bugün erken kalkmışsın. Gün uzun.' },
  gunduz: { her: 'Gündüz. Arada bir durmak da yolun parçası.',
            yeni: 'Günün ortasındasın. Kısa bir mola yeter.' },
  ikindi: { her: 'İkindi. Günün ağırlaştığı saat.',
            yeni: 'İkindi geçiyor. Günün hâlâ toparlanır.' },
  aksam:  { her: 'Akşam. Gün toplanmaya başladı.',
            yeni: 'Akşam oldu. Bugünden kalan bir şey var mı?' },
  gece:   { her: 'Gece. Gün kapanmadan bir uğradın.',
            yeni: 'Geç oldu. Bu saatte az şey yeter.' },
};

/**
 * @returns {{ an, cumle, tanidik, alisik }}
 *   an       — ANLAR öğesi
 *   cumle    — üst şeritte gösterilecek tek cümle
 *   tanidik  — kişi her zamanki saatinde mi geldi
 *   alisik   — öğrenilen saat (yoksa null)
 */
export function gununAni(saat = new Date().getHours()) {
  const an = suankiAn(saat);
  const alisik = alisillanSaat();
  // ±2 saat toleransla "her zamanki vaktin" (gün dönümünü de sayar)
  const fark = alisik == null ? null : Math.abs(saat - alisik);
  const tanidik = fark != null && Math.min(fark, 24 - fark) <= 2;
  const c = CUMLELER[an.id] || CUMLELER.gunduz;
  return { an, cumle: tanidik ? c.her : c.yeni, tanidik, alisik };
}

/**
 * Bu saatte hangi eksen öne çıkmalı? Ekran üç adımı sıralarken
 * kullanır — sabah okuma, gece muhasebe daha kolay oturur.
 */
export function anaGoreOncelik(saat = new Date().getHours()) {
  const id = suankiAn(saat).id;
  if (id === 'seher' || id === 'sabah') return ['kuran', 'namaz', 'zikir', 'kalp'];
  if (id === 'gunduz' || id === 'ikindi') return ['namaz', 'zikir', 'kuran', 'kalp'];
  return ['kalp', 'zikir', 'namaz', 'kuran'];
}

/** Kişinin öğrenilmiş saatini insanca yazar. */
export function alisikMetin() {
  const s = alisillanSaat();
  if (s == null) return null;
  return `Genelde ${String(s).padStart(2, '0')}:00 civarında buradasın.`;
}

const ritim = { ANLAR, suankiAn, gununAni, anaGoreOncelik, alisikMetin };
export default ritim;
