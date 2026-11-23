import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { UserService } from '../services/UserService';
import { signIn, signOutEverywhere, isCancel } from '../services/authNative';
import { deleteAccount as deleteAccountFlow, clearDeviceData } from '../services/accountService';

const AuthContext = createContext(null);
const GUEST_KEY = 'islamapp_guest';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firestore'dan çekilen zenginletilmiş user
  const [firebaseUser, setFirebaseUser] = useState(null); // Sadece auth user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Yönlendirmeli girişten dönüldüyse (açılır pencere engelli tarayıcı) sonucu al; hata sessiz geçer.
    getRedirectResult(auth).catch(() => {});
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      // Anonim oturum uygulamada giriş sayılmaz.
      if (currentUser && !currentUser.isAnonymous) {
        // Kullanıcı giriş yaptıysa, Firestore'da users dokümanını yarat veya getir
        const firestoreUser = await UserService.createOrUpdateUser(currentUser);
        // Firestore'a ulaşılamasa da (çevrimdışı) kullanıcı içeri alınır.
        setUser(firestoreUser || { id: currentUser.uid, name: currentUser.displayName || 'Yolcu', email: currentUser.email });
      } else {
        // Misafir kaydı cihazda tutulur; çıkış yapılınca silinir.
        let guest = null;
        try { guest = JSON.parse(localStorage.getItem(GUEST_KEY)); } catch { guest = null; }
        setUser(guest && guest.isGuest ? guest : null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
      try { localStorage.removeItem(GUEST_KEY); } catch { /* ignore */ }
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
