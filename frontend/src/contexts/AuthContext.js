import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { UserService } from '../services/UserService';

const AuthContext = createContext(null);

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
        setUser(null);
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
    setUser(guest);
    return guest;
  };

  const logout = async () => {
    try {
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
