// 🔐 GİRİŞ KATMANI — web'de ve telefonda aynı çağrı, farklı yol.
//
// Neden: Google, uygulama içindeki web görünümünde açılan giriş sayfasını "disallowed_useragent" hatasıyla
// reddeder; bu yüzden telefonda `signInWithPopup` çalışmaz. Telefonda giriş penceresini işletim sistemi açar
// (@capacitor-firebase/authentication), dönen kimlik belgesiyle Firebase JS SDK'da oturum açılır
// (`signInWithCredential`). Böylece uygulamanın geri kalanı (Firestore, kurallar) hiç değişmez.
//
// Web: Google ve Apple için açılır pencere; pencere engellenirse yönlendirmeli giriş.
// Android: Google. (Apple ile Giriş Apple'ın kuralıdır, yalnız iPhone/iPad'de ve web'de gösterilir.)
// iOS: Google + Apple.
//
// Kurulum adımları (Firebase konsolu, SHA-1, Xcode yeteneği): docs/YENI_OZELLIKLER.md → On ikinci tur.
import { Capacitor } from '@capacitor/core';
import {
  GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect, signInWithCredential,
  reauthenticateWithCredential, reauthenticateWithPopup, signOut,
} from 'firebase/auth';
import { auth } from './firebase';

export const isNative = () => Capacitor.isNativePlatform();
export const platform = () => Capacitor.getPlatform(); // 'web' | 'ios' | 'android'

/** Apple ile Giriş düğmesi gösterilsin mi? iPhone/iPad ve web: evet; Android: hayır. */
export const canApple = () => platform() !== 'android';

// Eklenti yalnız telefonda yüklenir; web paketine yük olmaz.
let pluginPromise = null;
const plugin = () => {
  if (!pluginPromise) {
    pluginPromise = import('@capacitor-firebase/authentication').then((m) => m.FirebaseAuthentication);
  }
  return pluginPromise;
};

const googleProvider = () => {
  const p = new GoogleAuthProvider();
  p.setCustomParameters({ prompt: 'select_account' });
  return p;
};
const appleProvider = () => {
  const p = new OAuthProvider('apple.com');
  p.addScope('email');
  p.addScope('name');
  return p;
};

/** Kullanıcı pencereyi kendisi kapattıysa hata göstermeyiz. */
export const isCancel = (e) => {
  const code = String((e && (e.code || e.message)) || '');
  return /popup-closed|cancelled-popup|canceled|cancelled|user-cancel|12501|1001|SIGN_IN_CANCELLED/i.test(code);
};

async function nativeCredential(provider) {
  const FA = await plugin();
  if (provider === 'apple') {
    const r = await FA.signInWithApple({ skipNativeAuth: true });
    return new OAuthProvider('apple.com').credential({ idToken: r.credential?.idToken, rawNonce: r.credential?.nonce });
  }
  const r = await FA.signInWithGoogle({ skipNativeAuth: true });
  return GoogleAuthProvider.credential(r.credential?.idToken);
}

async function webSignIn(provider) {
  const p = provider === 'apple' ? appleProvider() : googleProvider();
  try {
    return (await signInWithPopup(auth, p)).user;
  } catch (e) {
    // Açılır pencere engellendiyse (bazı tarayıcılar, ana ekrana eklenmiş PWA) sayfa yönlendirmesiyle dene.
    if (/popup-blocked|operation-not-supported/i.test(String(e && e.code))) {
      await signInWithRedirect(auth, p);
      return null;
    }
    throw e;
  }
}

/**
 * Google ya da Apple ile giriş.
 * @param {'google'|'apple'} provider
 * @returns {Promise<import('firebase/auth').User|null>} yönlendirmeli girişte null (sayfa yeniden yüklenir)
 */
export async function signIn(provider = 'google') {
  if (isNative()) {
    const cred = await nativeCredential(provider);
    return (await signInWithCredential(auth, cred)).user;
  }
  return webSignIn(provider);
}

/** Hassas işlemden (hesap silme) önce kimliği tazeler: kullanıcı aynı hesabı bir kez daha seçer. */
export async function reauthenticate(user) {
  const providerId = (user.providerData[0] && user.providerData[0].providerId) || 'google.com';
  const provider = providerId === 'apple.com' ? 'apple' : 'google';
  if (isNative()) {
    const cred = await nativeCredential(provider);
    await reauthenticateWithCredential(user, cred);
    return;
  }
  await reauthenticateWithPopup(user, provider === 'apple' ? appleProvider() : googleProvider());
}

/** Hem web katmanından hem telefonun kendi oturumundan çıkış. */
export async function signOutEverywhere() {
  if (isNative()) {
    try { await (await plugin()).signOut(); } catch { /* telefonda oturum yoksa sorun değil */ }
  }
  await signOut(auth);
}

const authNative = { signIn, reauthenticate, signOutEverywhere, canApple, isNative, platform, isCancel };
export default authNative;
