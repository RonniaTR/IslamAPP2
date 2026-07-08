import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase web config — these values are PUBLIC (safe to commit).
// Get them from: Firebase Console → Project Settings (⚙) → General →
// "Your apps" → SDK setup and configuration → Config.
// Paste the values below, or set REACT_APP_FIREBASE_* env vars at build time.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'PASTE_YOUR_API_KEY',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'islamapp-5942a.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'islamapp-5942a',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'islamapp-5942a.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID || 'PASTE_SENDER_ID',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'PASTE_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Opens the Google sign-in popup and returns a Firebase ID token to send to our backend.
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user.getIdToken();
}
