// frontend/src/services/donusSync.js
// ☁️ DÖNÜŞ ODASI BULUT YEDEĞİ (docs/YENI_OZELLIKLER.md 7.1 boşluk 2)
//
// Sorun: bütün durum cihazdaydı; telefon değişince 40 günlük yol kayboluyordu.
// Çözüm: giriş yapmış kullanıcıda gün, krediler, okunan günler ve tarihçe Firestore'a yedeklenir
// (users/{uid} belgesinde `donusBackup` alanı; kurallar yalnız sahibine izin verir).
//
// EMANET MEKTUBU YEDEKLENMEZ. "Mektup cihazdan çıkmaz" sözü verildi; LETTER anahtarları listede yoktur.
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const KEYS = ['donus_state', 'donus_read', 'nur_profile', 'nur_history', 'donus_stage_seen', 'donus_badges_seen'];
const STAMP = 'donus_backup_at';

const snapshot = () => {
  const out = {};
  KEYS.forEach((k) => { try { const v = localStorage.getItem(k); if (v != null) out[k] = v; } catch { /* ignore */ } });
  return out;
};

/**
 * Odaya girişte çağrılır. Yerelde yol yoksa ve bulutta varsa geri yükler; aksi halde günde bir kez yedekler.
 * @returns {Promise<'restored'|'saved'|'skipped'>}
 */
export async function syncDonus(uid) {
  if (!uid || uid === 'anonymous') return 'skipped';
  try {
    const ref = doc(db, 'users', uid);
    const hasLocal = !!localStorage.getItem('donus_state');
    if (!hasLocal) {
      const snap = await getDoc(ref);
      const backup = snap.exists() ? snap.data().donusBackup : null;
      if (backup && backup.data && backup.data.donus_state) {
        Object.entries(backup.data).forEach(([k, v]) => { if (KEYS.includes(k)) localStorage.setItem(k, v); });
        return 'restored';
      }
      return 'skipped';
    }
    const today = new Date().toDateString();
    if (localStorage.getItem(STAMP) === today) return 'skipped';
    await setDoc(ref, { donusBackup: { data: snapshot(), at: new Date().toISOString() } }, { merge: true });
    localStorage.setItem(STAMP, today);
    return 'saved';
  } catch {
    return 'skipped'; // çevrimdışı ya da izin yok: yerel veri olduğu gibi kalır
  }
}

const donusSync = { syncDonus };
export default donusSync;
