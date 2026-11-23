// 🚩 YAPAY ZEKÂ CEVABINI BİLDİR — Google Play "Yapay zekâ ile üretilen içerik" politikası:
// kullanıcı, uygunsuz ya da hatalı bulduğu cevabı uygulamadan çıkmadan bildirebilmeli.
//
// Bildirim Firestore'da `ai_reports` koleksiyonuna yazılır. Kimlik İÇERMEZ (ne hesap kimliği ne e-posta);
// yalnız soru, cevap, sebep, zaman ve platform. Kurallar yalnız "oluştur"a izin verir, okuma/silme kapalıdır
// (firestore.rules). Bildirimler Firebase konsolundan okunur.
// Çevrimdışıyken yazılamazsa cihazda bekler; Firestore bağlanınca kendisi gönderir.
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { db } from './firebase';

export const REPORT_REASONS = [
  { id: 'yanlis', label: 'Yanlış bilgi' },
  { id: 'uygunsuz', label: 'Uygunsuz' },
  { id: 'kaynak', label: 'Kaynak yok' },
  { id: 'diger', label: 'Diğer' },
];

const SESSION_KEY = 'ai_device_session';

/** Hesaptan bağımsız, bu cihaza özgü rastgele anahtar (asistan sohbet bağlamı için). */
export function deviceSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `d_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
}

const clip = (t, n) => String(t || '').slice(0, n);

export async function reportAnswer({ question, answer, reason }) {
  try {
    await addDoc(collection(db, 'ai_reports'), {
      q: clip(question, 1000),
      a: clip(answer, 4000),
      reason: REPORT_REASONS.some((r) => r.id === reason) ? reason : 'diger',
      platform: Capacitor.getPlatform(),
      at: serverTimestamp(),
    });
    return true;
  } catch {
    return false; // izin/bağlantı yok: kullanıcıya yine teşekkür edilir, uygulama akışı bozulmaz
  }
}

const aiReports = { reportAnswer, deviceSessionId, REPORT_REASONS };
export default aiReports;
