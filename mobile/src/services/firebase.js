import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

// Firebase yapılandırması - ISLAMAPP projesi
const firebaseConfig = {
  apiKey: 'AIzaSyDKUYQbivGq2P-Ve-zacpovDXzFHSuVx2g',
  authDomain: 'islamapp-5942a.firebaseapp.com',
  projectId: 'islamapp-5942a',
  storageBucket: 'islamapp-5942a.firebasestorage.app',
  messagingSenderId: '1026208289813',
  appId: '1:1026208289813:web:87f8257802d5ce721c6a1c',
  measurementId: 'G-NVHDXQSRSE',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore koleksiyon referansları
export const COLLECTIONS = {
  USERS: 'Users',
  QURAN_VERSES: 'QuranVerses',
  TAFSIR_NOTES: 'TafsirNotes',
  HADITH_COLLECTION: 'HadithCollection',
  USER_NOTES: 'UserNotes',
  DHIKR_LOGS: 'DhikrLogs',
  PRAYER_TIMES: 'PrayerTimes',
  USER_PROGRESS: 'UserProgress',
};

// Kullanıcı verisini Firestore'a kaydet
export async function saveUserToFirestore(user) {
  const userRef = doc(db, COLLECTIONS.USERS, user.uid);
  const userSnap = await getDoc(userRef);

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    lastLoginAt: serverTimestamp(),
  };

  if (!userSnap.exists()) {
    userData.createdAt = serverTimestamp();
    userData.preferences = {
      language: 'tr',
      notifications: true,
      darkMode: false,
      fontSize: 'medium',
    };
    userData.stats = {
      totalDhikr: 0,
      quranPagesRead: 0,
      hadithRead: 0,
      streak: 0,
    };
  }

  await setDoc(userRef, userData, { merge: true });
  return userData;
}

export async function saveUserNote(userId, note) {
  const payload = {
    userId,
    title: note.title || '',
    content: note.content || '',
    type: note.type || 'general',
    source: note.source || '',
    meta: note.meta || {},
    createdAt: serverTimestamp(),
  };
  return addDoc(collection(db, COLLECTIONS.USER_NOTES), payload);
}

export async function fetchUserNotes(userId) {
  const notesQuery = query(collection(db, COLLECTIONS.USER_NOTES), where('userId', '==', userId));
  const snap = await getDocs(notesQuery);
  const notes = [];
  snap.forEach((item) => notes.push({ id: item.id, ...item.data() }));
  return notes.sort((a, b) => {
    const aSec = a.createdAt?.seconds || 0;
    const bSec = b.createdAt?.seconds || 0;
    return bSec - aSec;
  });
}

export async function removeUserNote(noteId) {
  await deleteDoc(doc(db, COLLECTIONS.USER_NOTES, noteId));
}

export async function saveTafsirNote(userId, payload) {
  return addDoc(collection(db, COLLECTIONS.TAFSIR_NOTES), {
    userId,
    ...payload,
    createdAt: serverTimestamp(),
  });
}

export async function addDhikrLog(userId, value) {
  return addDoc(collection(db, COLLECTIONS.DHIKR_LOGS), {
    userId,
    value,
    createdAt: serverTimestamp(),
  });
}

export async function upsertUserProgress(userId, patch) {
  await setDoc(
    doc(db, COLLECTIONS.USER_PROGRESS, userId),
    {
      userId,
      ...patch,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function fetchUserProgress(userId) {
  const snap = await getDoc(doc(db, COLLECTIONS.USER_PROGRESS, userId));
  return snap.exists() ? snap.data() : null;
}

export { signInWithCredential, firebaseSignOut, onAuthStateChanged };
