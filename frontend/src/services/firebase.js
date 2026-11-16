import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
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
// KÖTÜYE KULLANIM KORUMASI (App Check): anahtar verilmişse açılır. Firebase konsolunda reCAPTCHA v3 anahtarı
// alınıp REACT_APP_APPCHECK_KEY olarak tanımlanır; ardından konsolda Firestore için "zorunlu kıl" açılır.
// Anahtar yoksa uygulama eskisi gibi çalışır (koruma kapalı).
if (process.env.REACT_APP_APPCHECK_KEY && typeof window !== 'undefined') {
  try {
    initializeAppCheck(app, { provider: new ReCaptchaV3Provider(process.env.REACT_APP_APPCHECK_KEY), isTokenAutoRefreshEnabled: true });
  } catch (e) { /* App Check kurulamadı: korumasız devam */ }
}

// ÇEVRİMDIŞI: Firestore verisi cihazda saklanır; bağlantı yokken okunur, yazılanlar bağlanınca gönderilir.
let firestore;
try {
  firestore = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
} catch (e) {
  firestore = getFirestore(app);   // eski tarayıcı ya da gizli sekme: bellek içi önbellek
}
export const db = firestore;
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
