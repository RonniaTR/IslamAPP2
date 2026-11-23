// 🗑️ HESAP SİLME — Apple 5.1.1(v) ve Google Play hesap silme şartı.
//
// Silinenler (sunucuda, bu kullanıcıya ait olan her şey):
//   users/{uid}          profil, XP, seviye, Dönüş yolu yedeği (donusBackup)
//   Users/{uid}          eski sürüm profili
//   UserProgress/{uid}   eski sürüm ilerlemesi
//   recommendations/{uid}
//   history, bookmarks, goals  → userId == uid olan bütün belgeler
// Sonra Firebase Authentication kaydının kendisi silinir.
//
// Sunucuda kalanlar ve nedeni (gizlilik metninde de yazar):
//   kandil/…            il başına ANONİM sayaç; kimseyle eşleşmez.
//   ai_reports          bildirilen yapay zekâ cevapları; kimlik içermez.
// Kuralların bu silmelere izin vermesi gerekir → firestore.rules (sahibi silebilir).
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db } from './firebase';
import { reauthenticate, signOutEverywhere } from './authNative';

const OWN_DOCS = ['users', 'Users', 'UserProgress', 'recommendations'];
const OWNED_COLLECTIONS = ['history', 'bookmarks', 'goals'];

async function deleteWhereOwner(name, uid) {
  const snap = await getDocs(query(collection(db, name), where('userId', '==', uid)));
  let batch = writeBatch(db);
  let n = 0;
  for (const d of snap.docs) {
    batch.delete(d.ref);
    n += 1;
    if (n % 400 === 0) { await batch.commit(); batch = writeBatch(db); }
  }
  if (n % 400 !== 0) await batch.commit();
  return n;
}

/** Bu kullanıcının sunucudaki bütün verisini siler. Belge yoksa sessizce geçer. */
export async function deleteServerData(uid) {
  if (!uid) return;
  for (const name of OWNED_COLLECTIONS) {
    try { await deleteWhereOwner(name, uid); } catch (e) { if (!/permission|not-found/i.test(String(e.code))) throw e; }
  }
  for (const name of OWN_DOCS) {
    try { await deleteDoc(doc(db, name, uid)); } catch (e) { if (!/permission|not-found/i.test(String(e.code))) throw e; }
  }
}

/**
 * Bu cihazdaki uygulama verisini siler (tercihler, okuma geçmişi, çocuk ilerlemesi, notlar, mektup).
 * Odalar (Düş Bahçesi) ve indirilmiş meal paketleri dâhil her şey gider; uygulama ilk açılış gibi döner.
 */
export async function clearDeviceData() {
  try { localStorage.clear(); } catch { /* yok */ }
  try { sessionStorage.clear(); } catch { /* yok */ }
  try {
    if (window.indexedDB && indexedDB.databases) {
      const dbs = await indexedDB.databases();
      // Firebase oturum veritabanı çıkışla zaten temizlenir; kalan uygulama veritabanları silinir.
      await Promise.all(dbs.filter((d) => d.name).map((d) => new Promise((res) => {
        const r = indexedDB.deleteDatabase(d.name); r.onsuccess = r.onerror = r.onblocked = () => res();
      })));
    }
  } catch { /* desteklenmiyor */ }
  try {
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch { /* desteklenmiyor */ }
}

/**
 * Hesabı kalıcı olarak siler.
 * @param {import('firebase/auth').User} user  Firebase oturumundaki kullanıcı
 * @param {{ wipeDevice?: boolean, onStep?: (s:string)=>void }} o
 */
export async function deleteAccount(user, o = {}) {
  const step = o.onStep || (() => {});
  if (!user) throw new Error('no-user');
  // Firebase, uzun süre önce açılmış oturumda hesabı sildirmez; önce kimliği tazeleriz (kullanıcı hesabını bir kez daha seçer).
  const fresh = Date.now() - new Date(user.metadata.lastSignInTime || 0).getTime() < 4 * 60 * 1000;
  if (!fresh) { step('reauth'); await reauthenticate(user); }
  step('data');
  await deleteServerData(user.uid);
  step('auth');
  try {
    await deleteUser(user);
  } catch (e) {
    if (String(e.code).includes('requires-recent-login')) {
      step('reauth'); await reauthenticate(user); await deleteUser(user);
    } else throw e;
  }
  step('device');
  try { await signOutEverywhere(); } catch { /* hesap zaten yok */ }
  if (o.wipeDevice !== false) await clearDeviceData();
  step('done');
}

const accountService = { deleteAccount, deleteServerData, clearDeviceData };
export default accountService;
