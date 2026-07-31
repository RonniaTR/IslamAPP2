// frontend/src/donus/palette.js
// 🎨 DÖNÜŞ ODASI PALETİ
//
// Bu bir TEMA DEĞİLDİR. Uygulamanın tema ayarı (Koyu / Aydınlık / Zümrüt)
// burada da geçerlidir; Dönüş Odası o temanın ÜZERİNE kendi renk katmanını
// koyar. Yani kullanıcı ana menüden temayı değiştirdiğinde bu mod da
// değişir — sadece karakteri korunur.
//
// Karakter: her bölümün kendi rengi var. Odaya girdiğinde nerede olduğunu
// renkten anlarsın; kırk gün tek renkte geçmez.

/** Hex → rgba (alfa ile). Geçersiz girdide hex'i olduğu gibi döndürür. */
export function alpha(hex, a) {
  if (typeof hex !== 'string' || hex[0] !== '#') return hex;
  const h = hex.length === 4
    ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
    : hex;
  const n = parseInt(h.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// ─── Bölüm renkleri ───
// Koyu ve aydınlık zeminde ayrı ton: aydınlıkta renkler koyulaşır ki
// metin kontrastı korunsun.
export const PHASE_COLORS = {
  kapi:  { dark: '#F0B429', light: '#B4780B', glow: '#FFD76A', emoji: '🚪' },
  temel: { dark: '#2DD4BF', light: '#0F766E', glow: '#5EEAD4', emoji: '🕌' },
  bag:   { dark: '#818CF8', light: '#4338CA', glow: '#A5B4FC', emoji: '📖' },
  ahlak: { dark: '#4ADE80', light: '#15803D', glow: '#86EFAC', emoji: '🌿' },
  kok:   { dark: '#FB7185', light: '#BE123C', glow: '#FDA4AF', emoji: '🌳' },
};

export const TEMEL_COLORS = {
  iman:    { dark: '#FBBF24', light: '#B45309' },
  sart:    { dark: '#34D399', light: '#047857' },
  abdest:  { dark: '#38BDF8', light: '#0369A1' },
  namaz:   { dark: '#A78BFA', light: '#6D28D9' },
  gusul:   { dark: '#22D3EE', light: '#0E7490' },
  dua:     { dark: '#F472B6', light: '#BE185D' },
  helal:   { dark: '#FB923C', light: '#C2410C' },
  adab:    { dark: '#A3E635', light: '#4D7C0F' },
};

/**
 * Tema nesnesinden Dönüş Odası paletini türetir.
 * @param theme  ThemeContext'ten gelen tema
 * @param accent Bölüm/kart rengi anahtarı ({dark, light, glow})
 */
export function donusPalette(theme, accent) {
  const isLight = theme.id === 'light';
  const c = accent || PHASE_COLORS.kapi;
  const tone = isLight ? (c.light || c.dark) : c.dark;
  const glow = c.glow || tone;

  return {
    isLight,
    // Zemin — tema arkaplanı + bölüm renginin çok hafif bir yıkaması
    bg: isLight
      ? `linear-gradient(180deg, ${theme.bg} 0%, ${alpha(tone, 0.07)} 55%, ${theme.bg} 100%)`
      : `linear-gradient(180deg, ${theme.bg} 0%, ${alpha(tone, 0.13)} 45%, ${theme.bg} 100%)`,
    bgSolid: theme.bg,
    accent: tone,
    accentGlow: glow,
    // Kart yüzeyleri
    card: isLight ? alpha('#FFFFFF', 0.92) : alpha(theme.surface, 0.72),
    cardTint: isLight ? alpha(tone, 0.08) : alpha(tone, 0.13),
    cardStrong: isLight
      ? `linear-gradient(135deg, ${alpha(tone, 0.16)}, ${alpha('#FFFFFF', 0.94)})`
      : `linear-gradient(135deg, ${alpha(tone, 0.22)}, ${alpha(theme.surface, 0.85)})`,
    border: alpha(tone, isLight ? 0.32 : 0.3),
    borderSoft: alpha(tone, isLight ? 0.16 : 0.15),
    // Metin — temadan gelir, mod bunu değiştirmez
    text: theme.textPrimary,
    dim: theme.textSecondary,
    onAccent: isLight ? '#FFFFFF' : '#0B1220',
    shadow: isLight
      ? `0 10px 34px ${alpha(tone, 0.22)}`
      : `0 10px 34px ${alpha(tone, 0.28)}`,
  };
}

export default donusPalette;
