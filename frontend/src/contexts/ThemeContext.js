import React, { createContext, useContext, useState, useEffect } from 'react';
import { COLORS } from '../styles/designTokens';

const ThemeContext = createContext(null);

const THEMES = {
  light: {
    id: 'light',
    name: 'Aydınlık',
    icon: '☀️',
    // Yetişkin Modu Light
    bg: '#F5F5F0',
    surface: '#FFFFFF',
    surfaceLight: '#F0EBE3',
    surfaceAlt: '#F8F7F4',
    primary: COLORS.adult.primary,
    primaryLight: COLORS.adult.primaryLight,
    primaryDark: COLORS.adult.primaryDark,
    primaryGradient: COLORS.adult.primaryGradient,
    gold: COLORS.adult.accent,
    goldLight: COLORS.adult.accentLight,
    accent: COLORS.adult.accent,
    cream: '#1A1A1A',
    creamMuted: '#4A4A4A',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    navBg: 'rgba(255, 255, 255, 0.97)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(0, 0, 0, 0.06)',
    inputBg: 'rgba(0, 0, 0, 0.03)',
    inputBorder: 'rgba(0, 0, 0, 0.1)',
    glassBg: 'rgba(255, 255, 255, 0.8)',
    success: COLORS.adult.success,
    warning: COLORS.adult.warning,
    error: COLORS.adult.error,
    info: COLORS.adult.info,
    fire: COLORS.adult.fire,
    star: COLORS.adult.star,
    diamond: COLORS.adult.diamond,
    trophy: COLORS.adult.trophy,
    isDark: false,
  },
  dark: {
    id: 'dark',
    name: 'Koyu',
    icon: '🌙',
    // Yetişkin Modu Dark
    bg: '#070D18',
    surface: '#111D30',
    surfaceLight: '#1A2940',
    surfaceAlt: '#0E1824',
    primary: COLORS.adult.primary,
    primaryLight: COLORS.adult.primaryLight,
    primaryDark: COLORS.adult.primaryDark,
    primaryGradient: COLORS.adult.primaryGradient,
    gold: '#C8A55A',
    goldLight: '#E0C47A',
    accent: '#C8A55A',
    cream: '#EBE5D8',
    creamMuted: '#B8B0A0',
    textPrimary: '#EBE5D8',
    textSecondary: '#7E8A9E',
    textMuted: '#5A6577',
    navBg: 'rgba(7, 13, 24, 0.97)',
    cardBg: 'rgba(17, 29, 48, 0.55)',
    cardBorder: 'rgba(200, 165, 90, 0.07)',
    inputBg: 'rgba(255, 255, 255, 0.03)',
    inputBorder: 'rgba(255, 255, 255, 0.08)',
    glassBg: 'rgba(17, 29, 48, 0.55)',
    success: COLORS.adult.success,
    warning: COLORS.adult.warning,
    error: COLORS.adult.error,
    info: COLORS.adult.info,
    fire: COLORS.adult.fire,
    star: COLORS.adult.star,
    diamond: COLORS.adult.diamond,
    trophy: COLORS.adult.trophy,
    isDark: true,
  },
  emerald: {
    id: 'emerald',
    name: 'Zümrüt',
    icon: '💎',
    bg: '#0A1F14',
    surface: '#0F3D2E',
    surfaceLight: '#164A38',
    surfaceAlt: '#0C2E20',
    primary: '#0D5C2F',
    primaryLight: '#1A7A42',
    primaryDark: '#064420',
    primaryGradient: 'linear-gradient(135deg, #0D5C2F, #1A7A42)',
    gold: '#C8A55A',
    goldLight: '#E0C47A',
    accent: '#C8A55A',
    cream: '#E0F2F1',
    creamMuted: '#B2DFDB',
    textPrimary: '#E0F2F1',
    textSecondary: '#80CBC4',
    textMuted: '#5A9E96',
    navBg: 'rgba(10, 31, 20, 0.97)',
    cardBg: 'rgba(15, 61, 46, 0.5)',
    cardBorder: 'rgba(200, 165, 90, 0.1)',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    glassBg: 'rgba(15, 61, 46, 0.5)',
    success: COLORS.adult.success,
    warning: COLORS.adult.warning,
    error: COLORS.adult.error,
    info: COLORS.adult.info,
    fire: COLORS.adult.fire,
    star: COLORS.adult.star,
    diamond: COLORS.adult.diamond,
    trophy: COLORS.adult.trophy,
    isDark: true,
  },
};

// Çocuk modu teması (sabit, tema seçiminden bağımsız)
export const KIDS_THEME = {
  id: 'kids',
  name: 'Çocuk',
  bg: COLORS.kids.bg,
  bgAlt: COLORS.kids.bgAlt,
  surface: COLORS.kids.surface,
  primary: COLORS.kids.primary,
  primaryLight: COLORS.kids.primaryLight,
  primaryGradient: COLORS.kids.primaryGradient,
  text: COLORS.kids.text,
  textSecondary: COLORS.kids.textSecondary,
  blue: COLORS.kids.blue,
  orange: COLORS.kids.orange,
  pink: COLORS.kids.pink,
  purple: COLORS.kids.purple,
  yellow: COLORS.kids.yellow,
  teal: COLORS.kids.teal,
  red: COLORS.kids.red,
  grass: COLORS.kids.grass,
  sky: COLORS.kids.sky,
  cloud: COLORS.kids.cloud,
  cardBorder: COLORS.kids.cardBorder,
  categoryColors: COLORS.kids.categoryColors,
  isDark: false,
};

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('app_theme') || 'light');

  const theme = THEMES[themeId] || THEMES.light;

  useEffect(() => {
    localStorage.setItem('app_theme', themeId);
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', theme.bg);
    root.style.setProperty('--bg-surface', theme.surface);
    root.style.setProperty('--bg-surface-light', theme.surfaceLight);
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-light', theme.primaryLight);
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
    <ThemeContext.Provider value={{ theme, themeId, setTheme, toggleTheme, themes: THEMES, kidsTheme: KIDS_THEME }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
