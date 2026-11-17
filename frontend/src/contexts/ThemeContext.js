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
    bg: '#040C07',
    surface: '#0B1A11',
    surfaceLight: '#122B1C',
    surfaceAlt: '#08140B',
    primary: '#0D5C2F',
    primaryLight: '#1A7A42',
    primaryDark: '#064420',
    primaryGradient: 'linear-gradient(135deg, #0D5C2F, #1A7A42)',
    gold: '#C8A55A',
    goldLight: '#E0C47A',
    accent: '#C8A55A',
    cream: '#EBE5D8',
    creamMuted: '#B8B0A0',
    textPrimary: '#FFFFFF',
    textSecondary: '#8E9B93',
    textMuted: '#5F6F65',
    navBg: 'rgba(4, 12, 7, 0.97)',
    cardBg: '#0B1A11',
    cardBorder: 'rgba(255, 255, 255, 0.05)',
    inputBg: 'rgba(255, 255, 255, 0.03)',
    inputBorder: 'rgba(255, 255, 255, 0.08)',
    glassBg: 'rgba(11, 26, 17, 0.55)',
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

// ─── YENİ TEMALAR (docs/YENI_OZELLIKLER.md Faz 1) ───
// Her tema, koyu ya da açık tabandan türetilir; yalnız fark eden renkler yazılır.
// Kutsal metin katmanı (Mushaf kâğıdı) temadan ETKİLENMEZ — bkz. 0.8 "Kâğıt, mürekkep, ışık".
function derive(baseId, o) {
  const b = THEMES[baseId];
  return {
    ...b, ...o,
    primaryGradient: `linear-gradient(135deg, ${o.primary || b.primary}, ${o.primaryLight || b.primaryLight})`,
    accent: o.gold || b.gold,
  };
}
THEMES.dark.name = 'Zümrüt Gece';
Object.assign(THEMES, {
  isilti: derive('light', {
    id: 'isilti', name: 'Işıltı', icon: '✨', mood: 'Aydınlık, ferah, sabah ışığı',
    bg: '#FFFBF0', surface: '#FFFFFF', surfaceLight: '#FFF3D6', surfaceAlt: '#FFF8E6',
    primary: '#B8860B', primaryLight: '#D9A520', primaryDark: '#8A6408', gold: '#C8911A', goldLight: '#E6B94D',
    textPrimary: '#2A2110', textSecondary: '#7A6A45', textMuted: '#A8996F',
    navBg: 'rgba(255, 251, 240, 0.97)', cardBg: '#FFFFFF', cardBorder: 'rgba(184, 134, 11, 0.14)',
    glassBg: 'rgba(255, 255, 255, 0.7)', isDark: false,
  }),
  husu: derive('dark', {
    id: 'husu', name: 'Huşu', icon: '🕯️', mood: 'Derin gece, tek kandil',
    bg: '#07090F', surface: '#0E121C', surfaceLight: '#161C2B', surfaceAlt: '#0A0D15',
    primary: '#2B3A67', primaryLight: '#3F5494', primaryDark: '#1B2545', gold: '#E0B354', goldLight: '#F2CF82',
    textPrimary: '#E8E6DF', textSecondary: '#8F96A8', textMuted: '#5E6577',
    navBg: 'rgba(7, 9, 15, 0.97)', cardBg: '#0E121C', cardBorder: 'rgba(224, 179, 84, 0.10)',
    glassBg: 'rgba(14, 18, 28, 0.6)', isDark: true,
  }),
  sevgi: derive('light', {
    id: 'sevgi', name: 'Sevgi', icon: '🌹', mood: 'Gül kurusu, sıcak ve yumuşak',
    bg: '#FFF5F5', surface: '#FFFFFF', surfaceLight: '#FCE4E6', surfaceAlt: '#FFF0F1',
    primary: '#A63D55', primaryLight: '#C95A73', primaryDark: '#7D2A3E', gold: '#B8863B', goldLight: '#D9AD6A',
    textPrimary: '#2E1A1F', textSecondary: '#8A5E68', textMuted: '#B79AA1',
    navBg: 'rgba(255, 245, 245, 0.97)', cardBg: '#FFFFFF', cardBorder: 'rgba(166, 61, 85, 0.12)',
    glassBg: 'rgba(255, 255, 255, 0.7)', isDark: false,
  }),
  sukun: derive('light', {
    id: 'sukun', name: 'Sükûn', icon: '🌊', mood: 'Su ve gök, sakin',
    bg: '#F2F7F8', surface: '#FFFFFF', surfaceLight: '#DCEBEE', surfaceAlt: '#EAF3F5',
    primary: '#1F6F7A', primaryLight: '#2F94A1', primaryDark: '#145058', gold: '#A8873A', goldLight: '#CDB06A',
    textPrimary: '#12272B', textSecondary: '#55747A', textMuted: '#8FA7AB',
    navBg: 'rgba(242, 247, 248, 0.97)', cardBg: '#FFFFFF', cardBorder: 'rgba(31, 111, 122, 0.12)',
    glassBg: 'rgba(255, 255, 255, 0.7)', isDark: false,
  }),
  // Ravza: açık ada çayı zemin, kâğıt kartlar, koyu çam yeşili düğme, altın ayrıntı. Yeni kullanıcının varsayılanı.
  revza: derive('light', {
    id: 'revza', name: 'Ravza', icon: '🌿', mood: 'Bahçe, sabah serinliği, kâğıt',
    bg: '#E7EEE6', surface: '#F8FAF4', surfaceLight: '#DCE6DA', surfaceAlt: '#EFF4EC',
    primary: '#1E5A44', primaryLight: '#2D7A5E', primaryDark: '#143F30', gold: '#B0893C', goldLight: '#D2AE62',
    textPrimary: '#17261F', textSecondary: '#5A6B62', textMuted: '#8C9A92',
    navBg: 'rgba(248, 250, 244, 0.86)', cardBg: '#F8FAF4', cardBorder: 'rgba(30, 90, 68, 0.10)',
    inputBg: 'rgba(30, 90, 68, 0.04)', inputBorder: 'rgba(30, 90, 68, 0.14)',
    glassBg: 'rgba(248, 250, 244, 0.7)', isDark: false,
  }),
  bereket: derive('dark', {
    id: 'bereket', name: 'Bereket', icon: '🌾', mood: 'Toprak, başak, ahşap',
    bg: '#17110A', surface: '#231A0F', surfaceLight: '#32261A', surfaceAlt: '#1C150C',
    primary: '#7A5A1F', primaryLight: '#A67C2E', primaryDark: '#573F14', gold: '#E0A84A', goldLight: '#F1C878',
    textPrimary: '#F3E9D2', textSecondary: '#B29E78', textMuted: '#7D6E52',
    navBg: 'rgba(23, 17, 10, 0.97)', cardBg: '#231A0F', cardBorder: 'rgba(224, 168, 74, 0.12)',
    glassBg: 'rgba(35, 26, 15, 0.6)', isDark: true,
  }),
});

// ─── YAZI STİLİ ─── Hepsi SIL Open Font License. Arapça metin bu ayardan etkilenmez.
export const FONT_STYLES = {
  // Zarif: başlıklar Fraunces (yumuşak, yüksek kontrastlı serif), metin Noto Sans. Yeni kullanıcının varsayılanı.
  zarif:   { id: 'zarif',   name: 'Zarif',   body: "'Noto Sans', sans-serif",           heading: "'Fraunces', 'Playfair Display', serif", gf: 'Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700' },
  sade:    { id: 'sade',    name: 'Sade',    body: "'Inter', 'Noto Sans', sans-serif",  heading: "'Playfair Display', serif", gf: null },
  kitap:   { id: 'kitap',   name: 'Kitap',   body: "'Lora', Georgia, serif",            heading: "'Lora', Georgia, serif",   gf: 'Lora:wght@400;500;600;700' },
  yumusak: { id: 'yumusak', name: 'Yumuşak', body: "'Nunito', 'Noto Sans', sans-serif", heading: "'Nunito', sans-serif",     gf: 'Nunito:wght@400;600;700;800' },
  klasik:  { id: 'klasik',  name: 'Klasik',  body: "'Noto Serif', Georgia, serif",      heading: "'Playfair Display', serif", gf: 'Noto+Serif:wght@400;500;700' },
};
export const TEXT_SCALES = { kucuk: 0.92, normal: 1, buyuk: 1.1, cokBuyuk: 1.22 };

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
  const [themeId, setThemeId] = useState(() => localStorage.getItem('app_theme') || 'revza');

  const theme = THEMES[themeId] || THEMES.dark;
  const [fontId, setFontId] = useState(() => localStorage.getItem('app_font') || 'zarif');
  const [textScale, setTextScaleId] = useState(() => localStorage.getItem('app_text_scale') || 'normal');

  useEffect(() => {
    const f = FONT_STYLES[fontId] || FONT_STYLES.sade;
    localStorage.setItem('app_font', f.id);
    localStorage.setItem('app_text_scale', textScale);
    if (f.gf && !document.getElementById(`gf-${f.id}`)) {
      const link = document.createElement('link');
      link.id = `gf-${f.id}`; link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${f.gf}&display=swap`;
      document.head.appendChild(link);
    }
    const root = document.documentElement;
    root.style.setProperty('--font-body', f.body);
    root.style.setProperty('--font-heading', f.heading);
    document.body.style.fontFamily = f.body;
    root.style.fontSize = `${Math.round(16 * (TEXT_SCALES[textScale] || 1))}px`;
  }, [fontId, textScale]);

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
    root.dataset.light = theme.isDark ? '' : '1'; // açık temalarda sabit beyaz yazıları düzeltmek için (index.css)
    document.body.style.background = theme.bg;
    document.body.style.color = theme.textPrimary;

    // Dinamik Status Bar Rengi
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = "theme-color";
      document.getElementsByTagName('head')[0].appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', theme.bg);

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
    <ThemeContext.Provider value={{ theme, themeId, setTheme, toggleTheme, themes: THEMES, kidsTheme: KIDS_THEME, fontId, setFont: (id) => FONT_STYLES[id] && setFontId(id), fonts: FONT_STYLES, textScale, setTextScale: (id) => TEXT_SCALES[id] && setTextScaleId(id) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
