import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';

const ThemeContext = createContext(null);
const THEME_KEY = 'app_theme_v2';

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [ready, setReady] = useState(false);
  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val === 'dark') setIsDark(true);
      setReady(true);
    });
  }, []);

  const toggleTheme = useCallback(async () => {
    const newVal = !isDark;
    setIsDark(newVal);
    await AsyncStorage.setItem(THEME_KEY, newVal ? 'dark' : 'light');
  }, [isDark]);

  const setTheme = useCallback(async (mode) => {
    const dark = mode === 'dark';
    setIsDark(dark);
    await AsyncStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
