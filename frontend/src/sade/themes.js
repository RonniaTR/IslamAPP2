// frontend/src/sade/themes.js
// 🌗 SADE — ÜÇ DÜNYA
//
// Bunlar renk paleti değil, ÜÇ AYRI YAPI. Her dünyanın kendi düzeni,
// kendi ritmi, kendi açılış sahnesi ve kendi sesi var. Kullanıcı birini
// seçtiğinde uygulamanın rengi değil, DURUŞU değişir.
//
//   SÜKÛN  · gece · dikey · tek şey · yavaş · ney
//            Ekran boş; ortada tek bir şey durur. Sessizlik tasarımın kendisi.
//
//   FECR   · sabah · yatay · akış · canlı · su
//            Gün üstte bir şerit hâlinde akar. Aydınlık, hafif, hareketli.
//
//   MİHRAP · mimari · ızgara · yapı · ölçülü · tahta/çan
//            Kemerler, ince çizgiler, sıralı sütun. Camii mimarisinin sadeliği.
//
// Uygulamanın ana teması (Koyu/Aydınlık/Zümrüt) BURAYA KARIŞMAZ — Sade
// kendi dünyasını kurar. Ana temaya dönmek isteyen Derinlik'e geçer.

export const SADE_TEMALAR = [
  {
    id: 'sukun',
    ad: 'Sükûn',
    adEn: 'Stillness',
    ozet: 'Gece · tek şey · sessizlik',
    ozetEn: 'Night · one thing · silence',
    simge: '🌙',
    duzen: 'dikey',      // tek sütun, geniş boşluk, büyük tipografi
    kapi: 'perde',       // açılış: iki perde açılır, arkadan ay ışığı
    ses: 'ney',          // Hicaz'da tek uzun nefes
    tempo: 1.35,         // animasyon hız çarpanı (yavaş)
    yaziBaslik: "'Playfair Display', Georgia, serif",
    yaziGovde: "system-ui, -apple-system, sans-serif",
    renk: {
      zemin:    '#050B09',
      zeminUst: '#0B1712',
      kart:     'rgba(14, 28, 22, 0.72)',
      kartUst:  'rgba(20, 40, 31, 0.9)',
      cizgi:    'rgba(212, 180, 108, 0.14)',
      cizgiKoyu:'rgba(212, 180, 108, 0.3)',
      vurgu:    '#D9B871',
      vurguIsik:'#F2DDA8',
      metin:    '#EAF1EC',
      soluk:    '#7C9184',
      uzeri:    '#050B09',
    },
  },
  {
    id: 'fecr',
    ad: 'Fecr',
    adEn: 'Dawn',
    ozet: 'Sabah · akış · aydınlık',
    ozetEn: 'Morning · flow · light',
    simge: '🌤️',
    duzen: 'yatay',      // gün üstte şerit, içerik yatay kartlarda
    kapi: 'safak',       // açılış: ufuktan gün doğar, ışık yukarı yürür
    ses: 'su',           // damla + yükselen tını
    tempo: 0.85,         // hızlı, canlı
    yaziBaslik: "'Playfair Display', Georgia, serif",
    yaziGovde: "system-ui, -apple-system, sans-serif",
    renk: {
      zemin:    '#FBF7F0',
      zeminUst: '#FFFFFF',
      kart:     'rgba(255, 255, 255, 0.94)',
      kartUst:  'rgba(255, 248, 236, 0.98)',
      cizgi:    'rgba(190, 120, 30, 0.16)',
      cizgiKoyu:'rgba(190, 120, 30, 0.34)',
      vurgu:    '#C2761A',
      vurguIsik:'#F0A93C',
      metin:    '#1E1710',
      soluk:    '#7C6A55',
      uzeri:    '#FFFFFF',
    },
  },
  {
    id: 'mihrap',
    ad: 'Mihrap',
    adEn: 'Niche',
    ozet: 'Mimari · ızgara · ölçü',
    ozetEn: 'Architecture · grid · measure',
    simge: '🕌',
    duzen: 'kemer',      // kemer başlık, hatlı ızgara, numaralı sütun
    kapi: 'kemer',       // açılış: kemer aşağıdan yukarı çizilir
    ses: 'cam',          // derin kâse tınısı
    tempo: 1.1,
    yaziBaslik: "'Playfair Display', Georgia, serif",
    yaziGovde: "system-ui, -apple-system, sans-serif",
    renk: {
      zemin:    '#0A1620',
      zeminUst: '#0F2130',
      kart:     'rgba(16, 36, 50, 0.78)',
      kartUst:  'rgba(22, 50, 68, 0.92)',
      cizgi:    'rgba(120, 200, 210, 0.16)',
      cizgiKoyu:'rgba(120, 200, 210, 0.36)',
      vurgu:    '#5FC9CE',
      vurguIsik:'#9BE6E8',
      metin:    '#E3F1F3',
      soluk:    '#7595A0',
      uzeri:    '#08131B',
    },
  },
];

const KEY = 'sade_tema';

export function getSadeTema() {
  let id = null;
  try { id = localStorage.getItem(KEY); } catch { /* ignore */ }
  return SADE_TEMALAR.find(t => t.id === id) || SADE_TEMALAR[0];
}

export function setSadeTema(id) {
  try { localStorage.setItem(KEY, id); } catch { /* quota */ }
  return SADE_TEMALAR.find(t => t.id === id) || SADE_TEMALAR[0];
}

/** Hex/rgba → alfa uygulanmış renk. */
export function sa(color, a) {
  if (typeof color !== 'string') return color;
  if (color.startsWith('rgba')) return color.replace(/[\d.]+\)$/, `${a})`);
  if (color[0] !== '#') return color;
  const h = color.length === 4
    ? '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
    : color;
  const n = parseInt(h.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export default SADE_TEMALAR;
