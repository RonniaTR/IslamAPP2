import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const THEMES = {
  dark: {
    id: 'dark',
    name: 'Koyu',
    icon: '🌙',
    bg: '#070D18',
    surface: '#111D30',
    surfaceLight: '#1A2940',
    gold: '#C8A55A',
    goldLight: '#E0C47A',
    cream: '#EBE5D8',
    creamMuted: '#B8B0A0',
    textPrimary: '#EBE5D8',
    textSecondary: '#7E8A9E',
    navBg: 'rgba(7, 13, 24, 0.97)',
    cardBg: 'rgba(17, 29, 48, 0.55)',
    cardBorder: 'rgba(200, 165, 90, 0.07)',
    inputBg: 'rgba(255, 255, 255, 0.03)',
    inputBorder: 'rgba(255, 255, 255, 0.08)',
    glassBg: 'rgba(17, 29, 48, 0.55)',
  },
  light: {
    id: 'light',
    name: 'Aydınlık',
    icon: '☀️',
    bg: '#F5F0E8',
    surface: '#FFFFFF',
    surfaceLight: '#F0EBE3',
    gold: '#9E8530',
    goldLight: '#C8A55A',
    cream: '#1A1A1A',
    creamMuted: '#4A4A4A',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280',
    navBg: 'rgba(255, 255, 255, 0.97)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(158, 133, 48, 0.15)',
    inputBg: 'rgba(0, 0, 0, 0.03)',
    inputBorder: 'rgba(0, 0, 0, 0.1)',
    glassBg: 'rgba(255, 255, 255, 0.7)',
  },
  emerald: {
    id: 'emerald',
    name: 'Zümrüt',
    icon: '💎',
    bg: '#0A1F14',
    surface: '#0F3D2E',
    surfaceLight: '#164A38',
    gold: '#C8A55A',
    goldLight: '#E0C47A',
    cream: '#E0F2F1',
    creamMuted: '#B2DFDB',
    textPrimary: '#E0F2F1',
    textSecondary: '#80CBC4',
    navBg: 'rgba(10, 31, 20, 0.97)',
    cardBg: 'rgba(15, 61, 46, 0.5)',
    cardBorder: 'rgba(200, 165, 90, 0.1)',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    glassBg: 'rgba(15, 61, 46, 0.5)',
  },
};

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('app_theme') || 'dark');

  const theme = THEMES[themeId] || THEMES.dark;

  useEffect(() => {
    localStorage.setItem('app_theme', themeId);
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', theme.bg);
    root.style.setProperty('--bg-surface', theme.surface);
    root.style.setProperty('--bg-surface-light', theme.surfaceLight);
    root.style.setProperty('--gold', theme.gold);
    root.style.setProperty('--gold-light', theme.goldLight);
    root.style.setProperty('--cream', theme.cream);
    root.style.setProperty('--cream-muted', theme.creamMuted);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--nav-bg', theme.navBg);
    root.style.setProperty('--card-bg', theme.cardBg);
    root.style.setProperty('--card-border', theme.cardBorder);
    root.style.setProperty('--input-bg', theme.inputBg);
    root.style.setProperty('--input-border', theme.inputBorder);
    root.style.setProperty('--glass-bg', theme.glassBg);
    document.body.style.background = theme.bg;
    document.body.style.color = theme.textPrimary;
  }, [themeId, theme]);

  const setTheme = (id) => {
    if (THEMES[id]) setThemeId(id);
  };

  const toggleTheme = () => {
    const ids = Object.keys(THEMES);
    const idx = ids.indexOf(themeId);
    setThemeId(ids[(idx + 1) % ids.length]);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme, toggleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
