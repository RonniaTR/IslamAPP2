import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { UserService } from '../services/UserService';
import { signIn, signOutEverywhere, isCancel } from '../services/authNative';
import { deleteAccount as deleteAccountFlow, clearDeviceData } from '../services/accountService';

const AuthContext = createContext(null);
const GUEST_KEY = 'islamapp_guest';
const AUTH_CACHE_KEY = 'islamapp_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cachedAuth = JSON.parse(localStorage.getItem(AUTH_CACHE_KEY));
      if (cachedAuth && cachedAuth.id) return cachedAuth;
      const guest = JSON.parse(localStorage.getItem(GUEST_KEY));
      return guest && guest.isGuest ? guest : null;
    } catch { return null; }
  });
  const [firebaseUser, setFirebaseUser] = useState(null); // Sadece auth user
  // Cihazda kayıtlı oturum (giriş ya da misafir) varsa uygulama BEKLEMEDEN açılır; Firebase sonra doğrular.
  // Önceden Firestore kullanıcı kaydı gelene kadar ekran boş kalıyordu (yavaş/kopuk bağlantıda "beyaz ekran").
  const [loading, setLoading] = useState(() => !user);

  useEffect(() => {
    // Yönlendirmeli girişten dönüldüyse (açılır pencere engelli tarayıcı) sonucu al; hata sessiz geçer.
    getRedirectResult(auth).catch(() => {});
    // Firebase hiç cevap vermezse (çevrimdışı ilk açılış) en geç 4 sn sonra giriş ekranına geçilir.
    const emniyet = setTimeout(() => setLoading(false), 4000);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      clearTimeout(emniyet);
      setFirebaseUser(currentUser);
      // Anonim oturum uygulamada giriş sayılmaz.
      if (currentUser && !currentUser.isAnonymous) {
        const fallback = {
          id: currentUser.uid,
          uid: currentUser.uid,
          name: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'Yolcu'),
          email: currentUser.email || '',
          avatarUrl: currentUser.photoURL || '',
        };
        // Önce cihazdaki bilgiyle hemen aç; Firestore kaydı (users dokümanı + Sevap Points senkronu) arkadan gelir.
        let cached = null;
        try { cached = JSON.parse(localStorage.getItem(AUTH_CACHE_KEY)); } catch { cached = null; }
        const hizli = cached && cached.id === currentUser.uid ? cached : fallback;
        setUser(hizli);
        setLoading(false);
        try { localStorage.removeItem(GUEST_KEY); } catch { /* kota */ }
        try {
          const firestoreUser = await UserService.createOrUpdateUser(currentUser);
          const finalUser = firestoreUser || hizli;
          try { localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(finalUser)); } catch { /* kota */ }
          setUser(finalUser);
        } catch {
          try { localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(hizli)); } catch { /* kota */ }
        }
        return;
      } else {
        try { localStorage.removeItem(AUTH_CACHE_KEY); } catch { /* ignore */ }
        // Misafir kaydı cihazda tutulur; çıkış yapılınca silinir.
        let guest = null;
        try { guest = JSON.parse(localStorage.getItem(GUEST_KEY)); } catch { guest = null; }
        setUser(guest && guest.isGuest ? guest : null);
      }
      setLoading(false);
    });

    return () => { clearTimeout(emniyet); unsubscribe(); };
  }, []);

  const loginWith = useCallback(async (provider) => {
    try {
      // onAuthStateChanged tetiklenecek ve UserService.createOrUpdateUser çalışacak
      return await signIn(provider);
    } catch (error) {
      if (isCancel(error)) return null;
      console.error(`${provider} login failed`, error);
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(() => loginWith('google'), [loginWith]);
  const loginWithApple = useCallback(() => loginWith('apple'), [loginWith]);

  const loginAsGuest = async (name) => {
    const guest = { id: 'anonymous', name: (name && String(name).slice(0, 40)) || 'Misafir Kullanıcı', isGuest: true, xp: 0, level: 1 };
    try { localStorage.setItem(GUEST_KEY, JSON.stringify(guest)); } catch { /* kota */ }
    setUser(guest);
    return guest;
  };

  const logout = async () => {
    try {
      try {
        localStorage.removeItem(GUEST_KEY);
        localStorage.removeItem(AUTH_CACHE_KEY);
      } catch { /* ignore */ }
      await signOutEverywhere();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  /**
   * Hesabı ve sunucudaki bütün verisini kalıcı olarak siler (Apple 5.1.1(v), Google Play hesap silme).
   * Misafirde sunucuda veri yoktur: yalnız bu cihazdaki veriler silinir.
   */
  const deleteAccount = async (o = {}) => {
    if (!firebaseUser || firebaseUser.isAnonymous) {
      await clearDeviceData();
      setUser(null);
      return;
    }
    await deleteAccountFlow(firebaseUser, o);
    setFirebaseUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, loginWithGoogle, loginWithApple, loginAsGuest, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
