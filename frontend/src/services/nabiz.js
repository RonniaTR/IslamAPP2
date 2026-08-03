/**
 * NABIZ — GÜNÜN ÖLÇÜSÜ
 * ────────────────────
 * Kişinin gününü dört eksende okur ve BİR CÜMLEYLE yorumlar.
 *
 * İLKE: sayı motive etmez, cümle motive eder. Ekranda "420 XP" değil,
 * "bugün dilin çok çalıştı, kalbin az" yazar.
 *
 * İKİNCİ İLKE: kullanıcıdan fazladan hiçbir giriş istenmez. Dört eksenin
 * tamamı, uygulamada zaten bırakılan izlerden hesaplanır.
 *
 * ÜÇÜNCÜ İLKE — TON: azarlamaz. "4 vakit kaçırdın" yazmaz;
 * "ikindiden sonra durakladın, akşam seni toparlar" yazar. Dönüş
 * Odası'nın ton kuralı burada da geçerlidir.
 */

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };
const gunKey = (d = new Date()) => d.toISOString().slice(0, 10);

const NAMAZ_KEY = 'nabiz_namaz';   // { '2026-08-03': ['fajr','dhuhr'] }
const ACILIS_KEY = 'nabiz_acilis'; // { '2026-08-03': [8, 13, 22] } — açılış saatleri

export const VAKITLER = [
  { id: 'fajr', ad: 'İmsak' }, { id: 'dhuhr', ad: 'Öğle' }, { id: 'asr', ad: 'İkindi' },
  { id: 'maghrib', ad: 'Akşam' }, { id: 'isha', ad: 'Yatsı' },
];

// ─── Namaz işaretleme ───
export function kilinanlar(gun = gunKey()) {
  const all = load(NAMAZ_KEY, {});
  return Array.isArray(all[gun]) ? all[gun] : [];
}

export function namazIsaretle(vakitId, gun = gunKey()) {
  const all = load(NAMAZ_KEY, {});
  const list = Array.isArray(all[gun]) ? all[gun] : [];
  all[gun] = list.includes(vakitId) ? list.filter(v => v !== vakitId) : [...list, vakitId];
  // 60 günden eskisini at
  const sinir = new Date(); sinir.setDate(sinir.getDate() - 60);
  const kes = sinir.toISOString().slice(0, 10);
  Object.keys(all).forEach(k => { if (k < kes) delete all[k]; });
  save(NAMAZ_KEY, all);
  return all[gun];
}

/** Uygulamanın açıldığı saati kaydeder — ritim öğrenmek için. */
export function acilisKaydet() {
  const all = load(ACILIS_KEY, {});
  const g = gunKey();
  const saat = new Date().getHours();
  const list = Array.isArray(all[g]) ? all[g] : [];
  if (!list.includes(saat)) list.push(saat);
  all[g] = list;
  const sinir = new Date(); sinir.setDate(sinir.getDate() - 30);
  const kes = sinir.toISOString().slice(0, 10);
  Object.keys(all).forEach(k => { if (k < kes) delete all[k]; });
  save(ACILIS_KEY, all);
}

/**
 * Kişinin ALIŞKANLIK SAATİ — son 14 günde en sık açtığı saat.
 * Plan ve bildirim buna göre kurulur: hep 22:30'da açana 07:00'de
 * bildirim gitmez.
 */
export function alisillanSaat() {
  const all = load(ACILIS_KEY, {});
  const sayac = {};
  Object.values(all).forEach(list => (list || []).forEach(h => { sayac[h] = (sayac[h] || 0) + 1; }));
  const gir = Object.entries(sayac).sort((a, b) => b[1] - a[1])[0];
  return gir ? Number(gir[0]) : null;
}

// ─── Dört eksen ───
function bugunKuranDk() {
  const last = load('quran_last', {});
  const bugun = new Date(); bugun.setHours(0, 0, 0, 0);
  if (!last.ts || last.ts < bugun.getTime()) return 0;
  return Math.min(30, Math.max(1, Math.round((last.minutes || 0) || 4)));
}
function bugunZikir() {
  const t = load(`tesbihat_log_${gunKey()}`, {});
  return Object.values(t).reduce((a, b) => a + (Number(b) || 0), 0);
}
function bugunKalp() {
  const e = load('journal_entries', []) || [];
  return e.some(x => (x.date || '').slice(0, 10) === gunKey());
}

/**
 * Günün dört ekseni. Her biri 0..1 oranı ve ham değeriyle döner.
 */
export function gununEksenleri(gun = gunKey()) {
  const namaz = kilinanlar(gun).length;
  const kuran = bugunKuranDk();
  const zikir = bugunZikir();
  const kalp = bugunKalp();
  return [
    { id: 'namaz', ad: 'Namaz', ham: `${namaz} / 5`, oran: namaz / 5, sayi: namaz },
    { id: 'kuran', ad: "Kur'an", ham: `${kuran} dk`, oran: Math.min(1, kuran / 10), sayi: kuran },
    { id: 'zikir', ad: 'Zikir', ham: String(zikir), oran: Math.min(1, zikir / 100), sayi: zikir },
    { id: 'kalp', ad: 'Kalp', ham: kalp ? 'yazıldı' : 'yazılmadı', oran: kalp ? 1 : 0.06, sayi: kalp ? 1 : 0 },
  ];
}

/** Günün genel nabzı: 0-100. Namaz iki kat ağırlıklı. */
export function nabizPuani(gun = gunKey()) {
  const e = gununEksenleri(gun);
  const agirlik = { namaz: 2, kuran: 1, zikir: 1, kalp: 1 };
  const toplam = e.reduce((a, x) => a + x.oran * agirlik[x.id], 0);
  const bol = Object.values(agirlik).reduce((a, b) => a + b, 0);
  return Math.round((toplam / bol) * 100);
}

/**
 * GÜNÜN CÜMLESİ — yorum. Hesaplanmaz, seçilir.
 * Hiçbir cümle azarlamaz; hepsi bir sonraki adımı gösterir.
 */
export function gununCumlesi() {
  const e = gununEksenleri();
  const [namaz, kuran, zikir, kalp] = e;
  const saat = new Date().getHours();
  const puan = nabizPuani();

  // Gün henüz başındaysa yorum yapmayız — yargı için erken
  if (saat < 10 && puan < 30) {
    return { metin: 'Gün yeni başlıyor. İlk adımı seç, gerisi kendiliğinden gelir.', renk: 'sakin' };
  }
  if (puan >= 85) {
    return { metin: 'Bugün dört tarafın da açık. Bu hâli yarına taşımak, bugün kurmaktan zordur.', renk: 'iyi' };
  }
  if (namaz.sayi >= 3 && kalp.sayi === 0 && saat >= 20) {
    return { metin: 'Bedenin bugün çalıştı. Geriye bir tek kalbin kaldı — üç satır yeter.', renk: 'yon' };
  }
  if (zikir.oran > 0.6 && kuran.oran < 0.3) {
    return { metin: 'Bugün dilin çok çalıştı, gözün az. Beş âyet dengeyi kurar.', renk: 'yon' };
  }
  if (kuran.oran > 0.5 && namaz.sayi <= 1 && saat >= 14) {
    return { metin: 'Okumak yerini buldu. Şimdi okuduğunu ayağa kaldırma vakti.', renk: 'yon' };
  }
  if (namaz.sayi === 0 && saat >= 15) {
    return { metin: 'Vakitler geçti ama gün bitmedi. Bir tanesini tut, bugün yolda sayılır.', renk: 'yon' };
  }
  if (puan < 25 && saat >= 18) {
    return { metin: 'Bugün ağır geçti. Tek bir şey yap ve günü kapat — az olan, hiç olmayandan çoktur.', renk: 'sakin' };
  }
  if (namaz.sayi >= 4) {
    return { metin: 'Vakitler yerli yerinde. Günün omurgası sağlam.', renk: 'iyi' };
  }
  return { metin: 'Yol açık. Bir adım at, nabız kendini toparlar.', renk: 'sakin' };
}

/**
 * HAFTALIK OKUMA — kişinin ritmini söyler.
 * "Sabahların güçlü, akşamların zayıf" gibi. Veri yetersizse null.
 */
export function haftaninOkumasi() {
  const namaz = load(NAMAZ_KEY, {});
  const gunler = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    gunler.push(namaz[gunKey(d)] || []);
  }
  const dolu = gunler.filter(g => g.length > 0).length;
  if (dolu < 3) return null;

  const sabah = gunler.reduce((a, g) => a + (g.includes('fajr') ? 1 : 0) + (g.includes('dhuhr') ? 1 : 0), 0);
  const aksam = gunler.reduce((a, g) => a + (g.includes('maghrib') ? 1 : 0) + (g.includes('isha') ? 1 : 0), 0);
  const saat = alisillanSaat();

  if (sabah > aksam + 3) {
    return { metin: 'Bu hafta sabahların güçlü, akşamların zayıf. Bir hafta yatsıyı erkene almayı dene.', ek: saat };
  }
  if (aksam > sabah + 3) {
    return { metin: 'Akşamların sağlam, sabahların dağınık. Sabahı kurtaran şey akşam yatma saatidir.', ek: saat };
  }
  return { metin: 'Bu hafta dengeli gidiyorsun. Denge, zirveden daha zor korunur.', ek: saat };
}

/** Son 7 günün nabız eğrisi — grafik için. */
export function haftalikEgri() {
  const namaz = load(NAMAZ_KEY, {});
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = gunKey(d);
    const n = (namaz[k] || []).length;
    out.push({
      gun: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'][d.getDay()],
      oran: n / 5,
      bugun: i === 0,
    });
  }
  return out;
}

const nabiz = {
  VAKITLER, kilinanlar, namazIsaretle, acilisKaydet, alisillanSaat,
  gununEksenleri, nabizPuani, gununCumlesi, haftaninOkumasi, haftalikEgri,
};
export default nabiz;
