// 🔔 AKILLI BİLDİRİMLER — yerel bildirimler (sunucu yok; her şey telefonda planlanır).
//
// Türler: namaz vakti · ilim saati · salavat zinciri · akşam "Günün nasıl geçti?" (düğmeli).
// Akşam bildiriminde Yorgunum / Daraldım / Huzurluyum / Şükür doluyum düğmeleri var; birine basınca
// o hâle uygun bir âyet, meal paketinden DEĞİŞTİRİLMEDEN ve kaynağıyla, ikinci bir bildirim olarak gelir.
// İlim saatinin metni, son 7 günde en çok vakit geçirilen bölüme göre seçilir (services/kazanim — veri cihazda kalır).
// Android ve iOS uygulamasında tam çalışır; web'de yalnız sayfa açıkken ve tarayıcı izin verirse.
import { LocalNotifications } from '@capacitor/local-notifications';
import { oncelikler } from './kazanim';
import { packSurah } from './offline';
import sources from '../data/sources.json';
import { SURAHS } from '../data/surahData';

const ANAHTAR = 'bildirim_tercih_v1';
export const VARSAYILAN = {
  izin: 'sorulmadi',     // sorulmadi | verildi | reddedildi | sonra
  sonraTarih: 0,
  namaz: true, ilim: true, salavat: true, aksam: true,
  ilimSaat: '21:00', salavatSaat: '20:30', aksamSaat: '21:45',
};
export const TURLER = [
  { id: 'namaz', ad: 'Namaz vakitleri', alt: 'Her vakit girerken kısa bir hatırlatma', alan: 'ibadet' },
  { id: 'ilim', ad: 'İlim saati', alt: 'Günde bir kez, en çok sevdiğin bölümden', alan: 'ilim', saat: 'ilimSaat' },
  { id: 'salavat', ad: 'Salavat zinciri', alt: 'Akşam, ortak zincire bir halka', alan: 'toplum', saat: 'salavatSaat' },
  { id: 'aksam', ad: 'Günün nasıl geçti?', alt: 'Hâlini seç, sana bir âyet gelsin', alan: 'sabir', saat: 'aksamSaat' },
];

export function tercihOku() { try { return { ...VARSAYILAN, ...JSON.parse(localStorage.getItem(ANAHTAR)) }; } catch { return { ...VARSAYILAN }; } }
export function tercihYaz(t) { try { localStorage.setItem(ANAHTAR, JSON.stringify(t)); } catch { /* kota */ } return t; }

/** Ön izin ekranı gösterilsin mi? (hiç sorulmadıysa ya da "şimdi değil"den 7 gün geçtiyse) */
export function izinSorulsunMu() {
  const t = tercihOku();
  if (t.izin === 'sorulmadi') return true;
  return t.izin === 'sonra' && Date.now() - t.sonraTarih > 7 * 864e5;
}

/** Türleri kullanım önceliğine göre sıralar (en çok vakit geçirilen alan önde). */
export function sirali() {
  const o = oncelikler();
  const sira = (a) => { const i = o.indexOf(a); return i < 0 ? 99 : i; };
  return [...TURLER].sort((x, y) => sira(x.alan) - sira(y.alan));
}

export async function izinIste() {
  let verildi = false;
  try { const p = await LocalNotifications.requestPermissions(); verildi = p.display === 'granted'; } catch { verildi = false; }
  const t = tercihYaz({ ...tercihOku(), izin: verildi ? 'verildi' : 'reddedildi' });
  if (verildi) await bildirimleriKur(true);
  return t;
}
export function sonraSor() { return tercihYaz({ ...tercihOku(), izin: 'sonra', sonraTarih: Date.now() }); }

// ---------- Âyet seçimi (hâle göre) ----------
const HAL_AYET = {
  yorgun: [[2, 286], [94, 6], [29, 69]],
  daral: [[94, 5], [65, 3], [2, 155]],
  huzur: [[13, 28], [89, 27], [48, 4]],
  sukur: [[14, 7], [2, 152], [93, 11]],
};
export const HAL_DUGMELER = [
  { id: 'yorgun', title: 'Yorgunum' },
  { id: 'daral', title: 'Daraldım' },
  { id: 'huzur', title: 'Huzurluyum' },
  { id: 'sukur', title: 'Şükür doluyum' },
];
export async function halAyeti(hal) {
  const liste = HAL_AYET[hal] || HAL_AYET.huzur;
  const [s, a] = liste[Math.floor(Math.random() * liste.length)];
  let meal = '';
  try { const r = await packSurah(sources.translations.tr.key, s); meal = r && r.ayahs[a - 1] ? r.ayahs[a - 1].text : ''; } catch { meal = ''; }
  return { s, a, meal, ref: `${SURAHS[s - 1].name} Sûresi · ${a}` };
}

// ---------- Planlama ----------
const ILIM_METNI = {
  kuran: ['İlim saati', "Bugün Kur'an'dan birkaç âyet: kaldığın yerden devam et."],
  ilim: ['İlim saati', 'Müslüman Olmak kitabında seni bekleyen bir sayfa var.'],
  ahlak: ['İlim saati', 'Bir sayfa ahlak: Müslüman Olmak, kaldığın yer.'],
  fen: ['İlim saati', 'Hikmet Mecmuası: bilim tarihinden bir hikâye.'],
  ibadet: ['İlim saati', 'Bir dakikalık fıkıh: bugün bir ibadetin inceliği.'],
  iman: ['İlim saati', 'Peygamberler ve kıssalar: bugün bir hayat.'],
  sabir: ['İlim saati', 'Bugün yolundan bir adım: Nur Yolu seni bekliyor.'],
  toplum: ['İlim saati', 'Ailece bir soru: Aile Sofrası kartı hazır.'],
};
const ILIM_YOL = { kuran: '/mushaf', ilim: '/musluman-olmak', ahlak: '/musluman-olmak', fen: '/musluman-olmak?oku=mecmua', ibadet: '/fiqh', iman: '/prophets', sabir: '/yol', toplum: '/sofra' };
const VAKIT_AD = { Fajr: 'İmsak', Dhuhr: 'Öğle', Asr: 'İkindi', Maghrib: 'Akşam', Isha: 'Yatsı' };

const saatTarih = (gun, hhmm) => { const [h, m] = hhmm.split(':').map(Number); const d = new Date(gun); d.setHours(h, m, 0, 0); return d; };

async function vakitleriGetir(gun) {
  const sehir = (() => { try { return localStorage.getItem('islamapp_city') || 'İstanbul'; } catch { return 'İstanbul'; } })();
  const tarih = `${String(gun.getDate()).padStart(2, '0')}-${String(gun.getMonth() + 1).padStart(2, '0')}-${gun.getFullYear()}`;
  const r = await fetch(`https://api.aladhan.com/v1/timingsByCity/${tarih}?city=${encodeURIComponent(sehir)}&country=Turkey&method=13`);
  const j = await r.json();
  return j && j.data ? j.data.timings : null;
}

let kuruldu = false;
let dinleyici = null;

/** İzin verildiyse önümüzdeki 2 günün bildirimlerini yeniden planlar. Uygulama her açıldığında çağrılır. */
export async function bildirimleriKur(zorla = false) {
  const t = tercihOku();
  if (t.izin !== 'verildi') return;
  if (kuruldu && !zorla) return;
  kuruldu = true;
  try {
    const p = await LocalNotifications.checkPermissions();
    if (p.display !== 'granted') { tercihYaz({ ...t, izin: 'reddedildi' }); return; }
    await LocalNotifications.registerActionTypes({ types: [{ id: 'HAL', actions: HAL_DUGMELER }] }).catch(() => null);
    if (!dinleyici) {
      dinleyici = await LocalNotifications.addListener('localNotificationActionPerformed', async (e) => {
        const hal = HAL_DUGMELER.find((h) => h.id === e.actionId);
        if (hal) {
          const ay = await halAyeti(hal.id);
          if (ay.meal) {
            await LocalNotifications.schedule({ notifications: [{
              id: 9000 + Math.floor(Math.random() * 900), title: `Sana bir âyet · ${ay.ref}`, body: ay.meal,
              schedule: { at: new Date(Date.now() + 1500) }, extra: { yol: `/ayet-tablosu?s=${ay.s}&a=${ay.a}` },
            }] });
          }
          return;
        }
        const yol = e.notification && e.notification.extra && e.notification.extra.yol;
        if (yol) window.location.assign(yol);
      });
    }
    const bekleyen = await LocalNotifications.getPending();
    if (bekleyen.notifications.length) await LocalNotifications.cancel({ notifications: bekleyen.notifications.map((n) => ({ id: n.id })) });

    const liste = []; const simdi = Date.now();
    const oncelik = oncelikler()[0] || 'ilim';
    for (let g = 0; g < 2; g += 1) {
      const gun = new Date(); gun.setDate(gun.getDate() + g);
      const taban = 1000 + g * 100;
      if (t.namaz) {
        const v = await vakitleriGetir(gun).catch(() => null);
        if (v) Object.entries(VAKIT_AD).forEach(([k, ad], i) => {
          const at = saatTarih(gun, v[k].slice(0, 5));
          if (at.getTime() > simdi) liste.push({ id: taban + i, title: `${ad} vakti`, body: `${ad} vakti girdi (${v[k].slice(0, 5)}).`, schedule: { at }, extra: { yol: '/' } });
        });
      }
      const ekle = (id, saat, title, body, ek = {}) => { const at = saatTarih(gun, saat); if (at.getTime() > simdi) liste.push({ id: taban + id, title, body, schedule: { at }, ...ek }); };
      if (t.ilim) { const [b, m] = ILIM_METNI[oncelik] || ILIM_METNI.ilim; ekle(10, t.ilimSaat, b, m, { extra: { yol: ILIM_YOL[oncelik] || '/musluman-olmak' } }); }
      if (t.salavat) ekle(11, t.salavatSaat, 'Salavat zinciri', 'Bugün hep birlikte. Zincire bir halka da sen ekle.', { extra: { yol: '/salavat' } });
      if (t.aksam) ekle(12, t.aksamSaat, 'Günün nasıl geçti?', 'Hâlini seç; sana bir âyet gelsin.', { actionTypeId: 'HAL', extra: { yol: '/chat' } });
    }
    if (liste.length) await LocalNotifications.schedule({ notifications: liste });
  } catch { kuruldu = false; }
}

/** Ayarlardan "deneme" için: 3 sn sonra akşam bildiriminin bir örneği. */
export async function denemeGonder() {
  await LocalNotifications.registerActionTypes({ types: [{ id: 'HAL', actions: HAL_DUGMELER }] }).catch(() => null);
  await LocalNotifications.schedule({ notifications: [{ id: 8999, title: 'Günün nasıl geçti?', body: 'Hâlini seç; sana bir âyet gelsin.', actionTypeId: 'HAL', schedule: { at: new Date(Date.now() + 3000) } }] });
}
