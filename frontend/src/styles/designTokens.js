// ─── NUR APP Design Tokens ───
// Merkezi tasarım sistemi - tüm ekranlar bu token'ları kullanır

export const COLORS = {
  // ─── Yetişkin Modu ───
  adult: {
    primary: '#0D5C2F',
    primaryLight: '#1A7A42',
    primaryDark: '#064420',
    primaryGradient: 'linear-gradient(135deg, #0D5C2F 0%, #1A7A42 100%)',
    accent: '#C8A55A',
    accentLight: '#E0C47A',
    accentDark: '#9E8530',
    bg: '#F5F5F0',
    bgDark: '#070D18',
    surface: '#FFFFFF',
    surfaceDark: '#111D30',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    cardBorder: 'rgba(0,0,0,0.06)',
    cardBorderDark: 'rgba(200,165,90,0.07)',
    navBg: 'rgba(255,255,255,0.97)',
    navBgDark: 'rgba(7,13,24,0.97)',
    // Stat renkler
    fire: '#F97316',
    star: '#EAB308',
    diamond: '#6366F1',
    trophy: '#F59E0B',
  },

  // ─── Çocuk Modu ───
  kids: {
    primary: '#2D8A4E',
    primaryLight: '#4CAF50',
    primaryDark: '#1B6B3A',
    primaryGradient: 'linear-gradient(180deg, #2D8A4E 0%, #4CAF50 100%)',
    blue: '#4A90D9',
    blueLight: '#64B5F6',
    orange: '#FF9F43',
    orangeLight: '#FFB74D',
    pink: '#FF6B8A',
    pinkLight: '#F48FB1',
    purple: '#9B59B6',
    purpleLight: '#CE93D8',
    yellow: '#FFD93D',
    yellowLight: '#FFF176',
    teal: '#26A69A',
    red: '#EF5350',
    bg: '#F0F8F0',
    bgAlt: '#E8F5E9',
    surface: '#FFFFFF',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    grass: '#4CAF50',
    sky: '#87CEEB',
    cloud: '#ECEFF1',
    cardBorder: 'rgba(0,0,0,0.05)',
    // Kategori renkleri (Görsel 4 referans)
    categoryColors: {
      quran: '#4A90D9',
      prayer: '#FF9F43',
      prophets: '#9B59B6',
      quiz: '#FFD93D',
      coloring: '#FF6B8A',
      songs: '#26A69A',
      tasks: '#F97316',
      games: '#6366F1',
    },
  },

  // ─── Mod Seçim Ekranı ───
  modeSelect: {
    bg: '#0A1628',
    bgGradient: 'linear-gradient(180deg, #0A1628 0%, #1B2838 50%, #0A1628 100%)',
    adultCard: '#1B2838',
    adultCardGradient: 'linear-gradient(135deg, #1B2838 0%, #0D1F33 100%)',
    childCard: '#2A1B3D',
    childCardGradient: 'linear-gradient(135deg, #2A1B3D 0%, #1F1338 100%)',
    starColor: 'rgba(255,255,255,0.4)',
    moonColor: '#E0C47A',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.6)',
  },

  // ─── Ortak ───
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    overlay: 'rgba(0,0,0,0.5)',
    overlayLight: 'rgba(0,0,0,0.3)',
  },
};

export const TYPOGRAPHY = {
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
    arabic: "'Amiri', serif",
    kids: "'Nunito', sans-serif",
  },
  sizes: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeights: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  letterSpacing: {
    tight: '-0.02em',
    base: '0',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.15em',
    caps: '0.2em',
  },
};

export const SPACING = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
};

export const RADIUS = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',
  full: '9999px',
  // Çocuk modu daha yuvarlak
  kids: '20px',
  kidsLg: '28px',
  kidsCard: '24px',
};

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 3px rgba(0,0,0,0.06)',
  md: '0 4px 12px rgba(0,0,0,0.08)',
  lg: '0 8px 24px rgba(0,0,0,0.12)',
  xl: '0 16px 48px rgba(0,0,0,0.16)',
  card: '0 2px 8px rgba(0,0,0,0.06)',
  cardHover: '0 8px 24px rgba(0,0,0,0.1)',
  nav: '0 -4px 20px rgba(0,0,0,0.08)',
  glow: (color) => `0 4px 20px ${color}40`,
  kidsCard: '0 4px 16px rgba(0,0,0,0.08)',
  kidsCardHover: '0 8px 32px rgba(0,0,0,0.12)',
};

export const ANIMATIONS = {
  durations: {
    fast: '150ms',
    base: '250ms',
    slow: '400ms',
    slower: '600ms',
    slowest: '1000ms',
  },
  easings: {
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

// ─── Yetişkin alt menü sekmeler ───
export const ADULT_NAV_TABS = [
  { id: 'home', path: '/', icon: 'Home', label: 'Ana Sayfa' },
  { id: 'discover', path: '/discover', icon: 'Compass', label: 'Keşfet' },
  { id: 'yol', path: '/yol', icon: 'Route', label: 'Yol', isCenter: true },
  { id: 'games', path: '/games', icon: 'Gamepad2', label: 'Oyun' },
  { id: 'profile', path: '/profile', icon: 'User', label: 'Profil' },
];

// ─── Çocuk alt menü sekmeler ───
export const KIDS_NAV_TABS = [
  { id: 'home', path: '/kids', icon: 'Home', label: 'Ana Sayfa' },
  { id: 'stories', path: '/kids/stories', icon: 'BookOpen', label: 'Hikaye Haritası' },
  { id: 'rewards', path: '/kids/rewards', icon: 'Award', label: 'Ödüller', isCenter: true },
  { id: 'friends', path: '/kids/friends', icon: 'Users', label: 'Arkadaşlar' },
  { id: 'settings', path: '/kids/settings', icon: 'Settings', label: 'Ayarlar' },
];

// ─── Çocuk kategori tanımları (Görsel 4 referans) ───
export const KIDS_CATEGORIES = [
  { id: 'quran', title: "Kur'an Macerası", icon: '📖', color: '#8BC34A', path: '/kids/quran' },
  { id: 'prayer', title: 'Namaz Kahramanı', icon: '🕌', color: '#4A90D9', path: '/kids/prayer' },
  { id: 'prophets', title: 'Peygamber Hikâyeleri', icon: '🌙', color: '#9B59B6', path: '/kids/prophets' },
  { id: 'quiz', title: 'Bil Bakalım Junior', icon: '🏆', color: '#FF9F43', path: '/kids/quiz' },
  { id: 'coloring', title: 'Boyama', icon: '🎨', color: '#FF6B8A', path: '/kids/coloring' },
  { id: 'songs', title: 'İlahi ve Ninni', icon: '🎵', color: '#26A69A', path: '/kids/songs' },
  { id: 'tasks', title: 'Günlük Görevler', icon: '📋', color: '#FACC15', path: '/kids/tasks' },
  { id: 'games', title: 'Oyunlar', icon: '🎮', color: '#8B5CF6', path: '/kids/games' },
];

// ─── Onboarding sayfa verileri ───
export const ONBOARDING_PAGES = [
  { icon: '📖', title: "Kur'an", desc: "Oku, dinle, ezberle. Kelime kelime meal ve tefsir ile derinleş.", color: '#0D5C2F' },
  { icon: '🤲', title: 'Dua & Zikir', desc: 'Günlük dualar, sabah-akşam zikirleri, sesli rehberlik.', color: '#1A7A42' },
  { icon: '🕌', title: 'Namaz', desc: 'Namaz vakitleri, kıble, cami bul, tesbihat.', color: '#0D5C2F' },
  { icon: '📚', title: 'İslami Hikayeler', desc: 'Peygamberler, sahabeler, kıssalar, sesli hikayeler.', color: '#2D8A4E' },
  { icon: '🧒', title: 'Çocuk Modu', desc: 'Güvenli, eğlenceli, yaşa uygun İslami öğrenme.', color: '#4A90D9' },
  { icon: '🤖', title: 'AI Destekli Öğrenme', desc: 'Yapay zeka müftü, ezber koçu, günlük motivasyon.', color: '#6366F1' },
  { icon: '👥', title: 'Topluluk', desc: 'Arkadaşlar, yarışmalar, liderlik tablosu.', color: '#F97316' },
  { icon: '🏆', title: 'Rozetler & XP', desc: 'Başarılar, seviyeler, ödüller ile motivasyonunu artır.', color: '#EAB308' },
  { icon: '🔔', title: 'Hatırlatıcılar', desc: 'Namaz, dua, görev hatırlatıcıları ile hiç kaçırma.', color: '#EF4444' },
  { icon: '✨', title: 'Hoş Geldin!', desc: "NUR ile hayatına nur kat. Hemen başla!", color: '#C8A55A' },
];

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  ANIMATIONS,
  BREAKPOINTS,
  ADULT_NAV_TABS,
  KIDS_NAV_TABS,
  KIDS_CATEGORIES,
  ONBOARDING_PAGES,
};
