/**
 * HATIRA
 * ──────
 * Uygulamalar insanı hatırlamaz. Her açılışta sıfırdan başlarlar,
 * hep bugünü gösterirler ve dün hiç yaşanmamış gibi davranırlar.
 *
 * Oysa bir insanı bir yere bağlayan şey, orada bıraktığı izdir.
 * Hatıra o izi geri getirir: "Kırk gün önce bu ekranda şunu yazmıştın."
 *
 * KURAL 1 — Hatıra ÜRETİLMEZ, BULUNUR. Buradaki her cümle kişinin
 *           kendi cümlesidir. Uygulama hiçbir şey uydurmaz.
 * KURAL 2 — Hatıra kıyaslamaz. "O gün daha iyiydin" demez. Sadece
 *           gösterir; yorum kişinin kendisine aittir.
 * KURAL 3 — Günde en fazla bir hatıra. Sürekli geçmişe bakan biri
 *           bugünü yaşayamaz.
 *
 * Kaynak: gün mühürleri (gunMuhru.js) ve günlük (journal_entries).
 * Dışarıdan hiçbir veri istemez, hiçbir yere veri göndermez.
 */

import { muhurler, HALLER } from './gunMuhru';

const gunKey = (d = new Date()) => d.toISOString().slice(0, 10);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

/** Kaç gün önce — kişiye anlamlı gelen aralıklar, en uzağı en değerlisi. */
const ARALIKLAR = [
  { gun: 365, ad: 'Bir yıl önce bugün' },
  { gun: 180, ad: 'Altı ay önce' },
  { gun: 100, ad: 'Yüz gün önce' },
  { gun: 40,  ad: 'Kırk gün önce' },
  { gun: 30,  ad: 'Bir ay önce' },
  { gun: 7,   ad: 'Geçen hafta bugün' },
];

function tarihEkle(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return gunKey(d);
}

// Sabit cümleler — araya değişken sokulmaz, yoksa çevrilemez.
const HAL_GECMIS = {
  agir: 'O gün ağır geçmişti.',
  sade: 'O gün sade geçmişti.',
  acik: 'O gün açık geçmişti.',
};

function halSimge(id) {
  return (HALLER.find(h => h.id === id) || {}).simge || '·';
}

/**
 * Bugüne düşen hatıra. Yoksa null döner — ekran boş kalmaz, kart hiç
 * çizilmez. Uydurma hatıra göstermektense hiç göstermemek yeğdir.
 *
 * @returns {{ tur, baslik, gun, gecenGun, metin, simge, altMetin } | null}
 */
export function bugununHatirasi() {
  const all = muhurler();
  const gunluk = load('journal_entries', []) || [];

  // 1) Tam aralığa denk gelen, NOTU OLAN bir mühür — en güçlüsü
  for (const a of ARALIKLAR) {
    const k = tarihEkle(a.gun);
    const m = all[k];
    if (m && m.not && m.not.trim()) {
      return {
        tur: 'muhur-not', baslik: a.ad, gun: k, gecenGun: a.gun,
        metin: m.not.trim(), simge: halSimge(m.hal),
        altMetin: HAL_GECMIS[m.hal] || HAL_GECMIS.sade,
      };
    }
  }

  // 2) Aynı aralıkta günlük yazısı
  for (const a of ARALIKLAR) {
    const k = tarihEkle(a.gun);
    const g = gunluk.find(x => (x.date || '').slice(0, 10) === k && (x.text || '').trim());
    if (g) {
      return {
        tur: 'gunluk', baslik: a.ad, gun: k, gecenGun: a.gun,
        metin: String(g.text).trim().slice(0, 240), simge: '📖',
        altMetin: 'Günlüğüne yazmıştın.',
      };
    }
  }

  // 3) Notsuz da olsa mühürlü bir gün — "o gün de buradaydın"
  for (const a of ARALIKLAR) {
    const k = tarihEkle(a.gun);
    const m = all[k];
    if (m) {
      return {
        tur: 'muhur', baslik: a.ad, gun: k, gecenGun: a.gun,
        metin: m.cumle || '', simge: halSimge(m.hal),
        altMetin: 'O gün de günü mühürlemiştin.',
      };
    }
  }

  // 4) İlk mühür yıl dönümleri — 50, 100, 200, 365. gün
  const ilk = ilkGun();
  if (ilk) {
    const fark = gecenGunSayisi(ilk);
    if ([50, 100, 200, 365, 500, 1000].includes(fark)) {
      return {
        tur: 'donum', baslik: 'Bugün', gun: ilk, gecenGun: fark,
        metin: `${fark}. gün.`, simge: '🕯️',
        altMetin: 'İlk mührünü bastığın günden bu yana.',
      };
    }
  }

  return null;
}

/** İlk mühür günü (YYYY-MM-DD) ya da null. */
export function ilkGun() {
  const k = Object.keys(muhurler()).sort();
  return k.length ? k[0] : null;
}

export function gecenGunSayisi(gun) {
  if (!gun) return 0;
  const a = new Date(`${gun}T00:00:00`);
  const b = new Date(); b.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((b - a) / 86400000));
}

/**
 * Kişinin buradaki toplam izi — üst şeritte tek satırla gösterilir.
 * Sayı övünmek için değil, "bu benim yerim" hissi için.
 */
export function izOzeti() {
  const all = muhurler();
  const say = Object.keys(all).length;
  if (!say) return null;
  const ilk = ilkGun();
  return { muhur: say, ilk, gun: gecenGunSayisi(ilk) + 1 };
}

const hatira = { bugununHatirasi, ilkGun, gecenGunSayisi, izOzeti };
export default hatira;
