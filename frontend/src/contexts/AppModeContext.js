import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppModeContext = createContext(null);

const STORAGE_KEYS = {
  mode: 'nur_app_mode',
  onboarding: 'nur_onboarding_done',
  childProfile: 'nur_child_profile',
  childProfiles: 'nur_child_profiles',
};

// Çocuk profilleri yalnız bu cihazda tutulur ve çocuk karşılamasında (KidsWelcome) oluşturulur.
// Eski sürüm sahte hazır profillerle (Yusuf/Zeynep/Elif, uydurma seviye ve puan) açılıyordu; kaldırıldı.
const FAKE_IDS = ['child_1', 'child_2', 'child_3'];
const DEFAULT_CHILD_PROFILES = [];

export function AppModeProvider({ children }) {
  const [appMode, setAppModeState] = useState(() => {
    const m = localStorage.getItem(STORAGE_KEYS.mode);
    return m === 'adult' || m === 'child' ? m : null;
  });
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(
    () => localStorage.getItem(STORAGE_KEYS.onboarding) === 'true'
  );
  const [activeChildProfile, setActiveChildProfileState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.childProfile);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [childProfiles, setChildProfilesState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.childProfiles);
      const list = stored ? JSON.parse(stored) : DEFAULT_CHILD_PROFILES;
      return Array.isArray(list) ? list.filter((p) => p && !FAKE_IDS.includes(p.id)) : DEFAULT_CHILD_PROFILES;
    } catch { return DEFAULT_CHILD_PROFILES; }
  });

  const setAppMode = useCallback((mode) => {
    setAppModeState(mode || null);
    // null kaydedilirse "null" metni olarak saklanıp sonraki açılışta mod seçili sanılıyordu.
    try { if (mode) localStorage.setItem(STORAGE_KEYS.mode, mode); else localStorage.removeItem(STORAGE_KEYS.mode); } catch { /* kota */ }
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasCompletedOnboardingState(true);
    localStorage.setItem(STORAGE_KEYS.onboarding, 'true');
  }, []);

  const resetOnboarding = useCallback(() => {
    setHasCompletedOnboardingState(false);
    setAppModeState(null);
    localStorage.removeItem(STORAGE_KEYS.onboarding);
    localStorage.removeItem(STORAGE_KEYS.mode);
  }, []);

  const clearMode = useCallback(() => {
    setAppModeState(null);
    localStorage.removeItem(STORAGE_KEYS.mode);
  }, []);

  const setActiveChildProfile = useCallback((profile) => {
    setActiveChildProfileState(profile);
    if (profile) {
      localStorage.setItem(STORAGE_KEYS.childProfile, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEYS.childProfile);
    }
  }, []);

  const addChildProfile = useCallback((profile) => {
    const created = { level: 1, xp: 0, ...profile, id: `child_${Date.now()}` };
    setChildProfilesState(prev => {
      const updated = [...prev, created];
      try { localStorage.setItem(STORAGE_KEYS.childProfiles, JSON.stringify(updated)); } catch { /* kota */ }
      return updated;
    });
    return created;
  }, []);

  const isChild = appMode === 'child';
  const isAdult = appMode === 'adult';
  const needsOnboarding = !hasCompletedOnboarding;
  const needsModeSelection = hasCompletedOnboarding && !appMode;

  return (
    <AppModeContext.Provider value={{
      appMode,
      setAppMode,
      isChild,
      isAdult,
      hasCompletedOnboarding,
      completeOnboarding,
      resetOnboarding,
      clearMode,
      needsOnboarding,
      needsModeSelection,
      activeChildProfile,
      setActiveChildProfile,
      childProfiles,
      addChildProfile,
    }}>
      {children}
    </AppModeContext.Provider>
  );
}

export const useAppMode = () => useContext(AppModeContext);
