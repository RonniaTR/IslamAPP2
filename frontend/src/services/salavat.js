// 🤲 ORTAK SALAVAT — herkesin getirdiği salavat tek bir günlük sayaçta toplanır.
//
// Firestore yapısı: /salavat/{gün: YYYY-MM-DD}/parca/{p0..p9} → { n }
//  · Sayaç 10 parçaya bölünür; her cihaz rastgele bir parçaya yazar (aynı belgeye saniyede 1 yazma sınırı aşılmaz).
//  · Toplam = parçaların toplamı (canlı dinlenir).
//  · Dokunuşlar cihazda biriktirilir, en çok 2 sn'de bir ve en çok 100'lük artışlarla gönderilir.
//  · Kimlik, konum, saat GÖNDERİLMEZ; yalnız sayı. Kural: yalnız `n` alanı, yalnız 1–100 artış (firestore.rules).
//  · İnternet yoksa katkı cihazda bekler, bağlantı gelince gider (anahtar: salavat_bekleyen).
import { collection, doc, increment, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { puanEkle } from './kazanim';

export const PARCA = 10;
export const GUNLUK_HEDEF = 100000;
const ADIM = 100;
const BEKLEYEN = 'salavat_bekleyen';
const BENIM = 'salavat_benim'; // { [gün]: sayı }

export function bugunAnahtari(d = new Date()) {
  const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); const g = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${g}`;
}

const oku = (k, v) => { try { return JSON.parse(localStorage.getItem(k)) ?? v; } catch { return v; } };
const yaz = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* kota */ } };

export function benimKatkim(gun = bugunAnahtari()) { return oku(BENIM, {})[gun] || 0; }
export function toplamKatkim() { return Object.values(oku(BENIM, {})).reduce((a, b) => a + b, 0); }

/** Günün toplamını canlı dinler. Döndürdüğü fonksiyon dinlemeyi bırakır. */
export function toplamiDinle(gun, cb, hata) {
  return onSnapshot(
    collection(db, 'salavat', gun, 'parca'),
    (snap) => { let t = 0; snap.forEach((d) => { t += d.data().n || 0; }); cb(t); },
    (e) => hata && hata(e),
  );
}

let zamanlayici = null;
let gonderiliyor = false;

/** Bir salavatı kaydeder: yerelde hemen sayılır, sunucuya toplu gider. */
export function salavatEkle(adet = 1) {
  const gun = bugunAnahtari();
  const benim = oku(BENIM, {}); benim[gun] = (benim[gun] || 0) + adet; yaz(BENIM, benim);
  puanEkle('ibadet', 0.3 * adet); puanEkle('toplum', 0.2 * adet);
  const bek = oku(BEKLEYEN, {}); bek[gun] = (bek[gun] || 0) + adet; yaz(BEKLEYEN, bek);
  if (!zamanlayici) zamanlayici = setTimeout(() => { zamanlayici = null; gonder(); }, 2000);
  return benim[gun];
}

/** Bekleyen katkıları gönderir (sayfadan çıkarken, bağlantı gelince de çağrılır). */
export async function gonder() {
  if (gonderiliyor) return;
  gonderiliyor = true;
  try {
    const bek = oku(BEKLEYEN, {});
    for (const gun of Object.keys(bek)) {
      // Dünden kalan katkı kendi gününe gider; 3 günden eskisi bırakılır.
      if ((Date.now() - new Date(gun).getTime()) > 3 * 864e5) { delete bek[gun]; continue; }
      while (bek[gun] > 0) {
        const k = Math.min(ADIM, bek[gun]);
        const p = `p${Math.floor(Math.random() * PARCA)}`;
        // eslint-disable-next-line no-await-in-loop
        await setDoc(doc(db, 'salavat', gun, 'parca', p), { n: increment(k) }, { merge: true });
        bek[gun] -= k;
        yaz(BEKLEYEN, bek);
      }
      delete bek[gun];
    }
    yaz(BEKLEYEN, bek);
  } catch { /* çevrimdışı: bekleyen kalır */ } finally { gonderiliyor = false; }
}

export function bekleyenVar() { return Object.values(oku(BEKLEYEN, {})).some((n) => n > 0); }
