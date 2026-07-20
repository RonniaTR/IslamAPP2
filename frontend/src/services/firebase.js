import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Update with your actual Firebase config
const firebaseConfig = {
  projectId: "islamapp-5942a",
  appId: "1:1026208289813:web:87f8257802d5ce721c6a1c",
  storageBucket: "islamapp-5942a.firebasestorage.app",
  apiKey: "AIzaSyDKUYQbivGq2P-Ve-zacpovDXzFHSuVx2g",
  authDomain: "islamapp-5942a.firebaseapp.com",
  messagingSenderId: "1026208289813",
  measurementId: "G-NVHDXQSRSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
