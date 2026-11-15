import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { UserService } from '../services/UserService';

const AuthContext = createContext(null);
const GUEST_KEY = 'islamapp_guest';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firestore'dan çekilen zenginletilmiş user
  const [firebaseUser, setFirebaseUser] = useState(null); // Sadece auth user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      
      if (currentUser) {
        // Kullanıcı giriş yaptıysa, Firestore'da users dokümanını yarat veya getir
        const firestoreUser = await UserService.createOrUpdateUser(currentUser);
        setUser(firestoreUser);
      } else {
        // Misafir oturumu sayfa yenilenince düşüyordu (kullanıcı her seferinde giriş ekranına dönüyordu).
        // Misafir kaydı cihazda tutulur; çıkış yapılınca silinir.
        let guest = null;
        try { guest = JSON.parse(localStorage.getItem(GUEST_KEY)); } catch { guest = null; }
        setUser(guest && guest.isGuest ? guest : null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged tetiklenecek ve UserService.createOrUpdateUser çalışacak
      return result.user;
    } catch (error) {
      console.error("Google login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async () => {
    const guest = { id: 'anonymous', name: 'Misafir Kullanıcı', isGuest: true, xp: 0, level: 1 };
    try { localStorage.setItem(GUEST_KEY, JSON.stringify(guest)); } catch { /* kota */ }
    setUser(guest);
    return guest;
  };

  const logout = async () => {
    try {
      try { localStorage.removeItem(GUEST_KEY); } catch { /* ignore */ }
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, loginWithGoogle, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
