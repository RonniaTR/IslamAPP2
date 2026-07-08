import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api';

const AuthContext = createContext(null);

const AUTH_CACHE_KEY = 'islamapp_user_cache';
const AUTH_CACHE_TTL = 5 * 60 * 1000;
const AUTH_TIMEOUT = 5000; // 5s max for auth check (was 8s)

function getCachedUser() {
  try {
    const raw = localStorage.getItem(AUTH_CACHE_KEY);
    if (!raw) return null;
    const { user, ts } = JSON.parse(raw);
    if (Date.now() - ts > AUTH_CACHE_TTL) return null;
    return user;
  } catch { return null; }
}

function setCachedUser(user) {
  try {
    if (user) localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({ user, ts: Date.now() }));
    else localStorage.removeItem(AUTH_CACHE_KEY);
  } catch {}
}

export function AuthProvider({ children }) {
  const cached = getCachedUser();
  const [user, setUser] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const mounted = useRef(true);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  const checkAuth = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), AUTH_TIMEOUT);
      const { data } = await api.get('/auth/me', { signal: controller.signal });
      clearTimeout(timeout);
      if (mounted.current) {
        setUser(data);
        setCachedUser(data);
      }
    } catch {
      if (mounted.current) {
        // Only clear user if we had no cache (don't log out cached users on network blip)
        if (!getCachedUser()) {
          setUser(null);
          setCachedUser(null);
        }
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }
    checkAuth();
    // Safety: force loading=false after timeout even if checkAuth hangs
    const safetyTimer = setTimeout(() => {
      if (mounted.current) setLoading(false);
    }, AUTH_TIMEOUT + 2000);
    return () => clearTimeout(safetyTimer);
  }, [checkAuth]);

  const loginAsGuest = async (name) => {
    const savedGuestId = localStorage.getItem('islamapp_guest_id') || undefined;
    try {
      const { data } = await api.post('/auth/guest', { name, guest_id: savedGuestId }, { timeout: 8000 });
      if (data?.user_id) localStorage.setItem('islamapp_guest_id', data.user_id);
      setUser(data);
      setCachedUser(data);
      return data;
    } catch {
      // Offline fallback: keep the same guest identity + name locally
      const existingCache = getCachedUser();
      const guest = existingCache?.is_guest
        ? existingCache
        : { user_id: savedGuestId || 'guest_' + Date.now(), name: (name && name.trim()) || 'Misafir', is_guest: true };
      setUser(guest);
      setCachedUser(guest);
      return guest;
    }
  };

  const loginWithGoogle = async () => {
    // Firebase Google popup -> ID token -> our backend verifies + opens a session
    const { signInWithGoogle } = await import('../firebase');
    const idToken = await signInWithGoogle();
    const { data } = await api.post('/auth/firebase', { id_token: idToken });
    localStorage.removeItem('islamapp_guest_id');
    setUser(data);
    setCachedUser(data);
    return data;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } finally {
      setUser(null);
      setCachedUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: (u) => { setUser(u); setCachedUser(u); }, loading, loginAsGuest, loginWithGoogle, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
