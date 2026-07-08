import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase web config — these values are PUBLIC (safe to commit).
// Get them from: Firebase Console → Project Settings (⚙) → General →
// "Your apps" → SDK setup and configuration → Config.
// Paste the values below, or set REACT_APP_FIREBASE_* env vars at build time.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyDKUYQbivGq2P-Ve-zacpovDXzFHSuVx2g',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'islamapp-5942a.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'islamapp-5942a',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'islamapp-5942a.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID || '1026208289813',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:1026208289813:web:87f8257802d5ce721c6a1c',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-NVHDXQSRSE',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Opens the Google sign-in popup and returns a Firebase ID token to send to our backend.
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user.getIdToken();
}
