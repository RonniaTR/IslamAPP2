import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  onAuthStateChanged,
  firebaseSignOut,
  signInWithCredential,
  saveUserToFirestore,
} from '../services/firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '1026208289813-tb7g1fbgia624t4sdt6i4rqmr5hhjnnb.apps.googleusercontent.com',
    iosClientId: undefined,
    androidClientId: undefined,
  });

  // Google sign-in response handler
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await saveUserToFirestore(firebaseUser);
        } catch {
          // Firestore save can fail silently
        }
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Misafir mod kontrolü
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.isGuest) {
            setUser(parsed);
          } else {
            setUser(null);
            await AsyncStorage.removeItem('user');
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await promptAsync();
  };

  const signInAsGuest = async () => {
    const guestUser = {
      uid: 'guest_' + Date.now(),
      displayName: 'Misafir',
      isGuest: true,
    };
    setUser(guestUser);
    await AsyncStorage.setItem('user', JSON.stringify(guestUser));
  };

  const signOut = async () => {
    try {
      if (user && !user.isGuest) {
        await firebaseSignOut(auth);
      }
    } catch {
      // Ignore sign out errors
    }
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAsGuest, signOut, googleRequest: request }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
