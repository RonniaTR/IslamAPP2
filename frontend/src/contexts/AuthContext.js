import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

const AUTH_CACHE_KEY = 'islamapp_user_cache';
const AUTH_CACHE_TTL = 5 * 60 * 1000; // 5 min local cache

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
  const [loading, setLoading] = useState(!cached); // skip loading if cache hit

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      setCachedUser(data);
    } catch {
      setUser(null);
      setCachedUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If returning from OAuth callback, skip the /me check.
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }
    // If we have cached user, show UI immediately, revalidate in background
    if (cached) {
      checkAuth(); // silent revalidate
    } else {
      checkAuth();
    }
  }, [checkAuth, cached]);

  const loginAsGuest = async () => {
    try {
      const { data } = await api.post('/auth/guest');
      setUser(data);
      setCachedUser(data);
      return data;
    } catch (e) {
      // Fallback: create local guest session when API is unavailable
      const guest = { id: 'guest_' + Date.now(), name: 'Misafir', isGuest: true };
      setUser(guest);
      setCachedUser(guest);
      return guest;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      setCachedUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: (u) => { setUser(u); setCachedUser(u); }, loading, loginAsGuest, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
