import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppModeContext = createContext(null);

const STORAGE_KEYS = {
  mode: 'nur_app_mode',
  onboarding: 'nur_onboarding_done',
  childProfile: 'nur_child_profile',
  childProfiles: 'nur_child_profiles',
};

// Varsayılan çocuk profilleri
const DEFAULT_CHILD_PROFILES = [
  { id: 'child_1', name: 'Yusuf', avatar: '👦', level: 7, xp: 1250, color: '#4A90D9' },
  { id: 'child_2', name: 'Zeynep', avatar: '👧', level: 5, xp: 890, color: '#FF6B8A' },
  { id: 'child_3', name: 'Elif', avatar: '👧', level: 3, xp: 450, color: '#9B59B6' },
];

export function AppModeProvider({ children }) {
  const [appMode, setAppModeState] = useState(() => localStorage.getItem(STORAGE_KEYS.mode) || null);
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
      return stored ? JSON.parse(stored) : DEFAULT_CHILD_PROFILES;
    } catch { return DEFAULT_CHILD_PROFILES; }
  });

  const setAppMode = useCallback((mode) => {
    setAppModeState(mode);
    localStorage.setItem(STORAGE_KEYS.mode, mode);
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

  const setActiveChildProfile = useCallback((profile) => {
    setActiveChildProfileState(profile);
    if (profile) {
      localStorage.setItem(STORAGE_KEYS.childProfile, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEYS.childProfile);
    }
  }, []);

  const addChildProfile = useCallback((profile) => {
    setChildProfilesState(prev => {
      const updated = [...prev, { ...profile, id: `child_${Date.now()}`, level: 1, xp: 0 }];
      localStorage.setItem(STORAGE_KEYS.childProfiles, JSON.stringify(updated));
      return updated;
    });
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
