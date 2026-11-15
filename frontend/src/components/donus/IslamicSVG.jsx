// frontend/src/components/donus/IslamicSVG.jsx
// 🕌 İSLAMİ SVG MOTİF KÜTÜPHANESİ
//
// Dönüş Odası genelinde kullanılan dekoratif SVG bileşenleri.
// Tümü pure inline SVG — harici dosya yok, sıfır HTTP isteği.
// CSS animasyonlu, tema rengine duyarlı, 60fps performanslı.

import React from 'react';

// ─── PAYLAŞIMLI ANIMASYON STİLLERİ ───
const keyframes = `
@keyframes islamicSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes islamicPulse { 0%,100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.28; transform: scale(1.06); } }
@keyframes islamicFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes islamicFlicker { 0%,100% { opacity: 0.8; } 30% { opacity: 1; } 60% { opacity: 0.7; } }
@keyframes islamicWave { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes islamicBreath { 0%,100% { transform: scale(1); opacity: 0.12; } 50% { transform: scale(1.08); opacity: 0.22; } }
@keyframes islamicPageTurn { 0%,100% { transform: skewY(0deg); } 50% { transform: skewY(-3deg); } }
@keyframes islamicDrop { 0% { transform: translateY(-8px) scale(0.8); opacity:0; } 40% { transform: translateY(0) scale(1); opacity:1; } 100% { transform: translateY(4px) scale(0.95); opacity:0; } }
@keyframes islamicSwing { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
`;

// Stil etiketini bir kez enjekte et
let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
  injected = true;
}

// ─── 1. SEKIZGEN YILDIZ — Genel İslami motif ───
export function OctaStar({ size = 80, color = '#F0B429', opacity = 0.15, speed = 60, className = '' }) {
  injectStyles();
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}
      style={{ animation: `islamicSpin ${speed}s linear infinite`, opacity }}>
      <g fill="none" stroke={color} strokeWidth="1.2">
        {/* Ana sekizgen */}
        <polygon points="50,5 71,15 85,29 95,50 85,71 71,85 50,95 29,85 15,71 5,50 15,29 29,15" />
        {/* İç yıldız */}
        <polygon points="50,18 61,29 78,29 68,42 72,58 50,50 28,58 32,42 22,29 39,29" />
        {/* Merkez daire */}
        <circle cx="50" cy="50" r="12" />
        {/* Çapraz çizgiler */}
        <line x1="50" y1="5" x2="50" y2="95" strokeDasharray="4,4" />
        <line x1="5" y1="50" x2="95" y2="50" strokeDasharray="4,4" />
        <line x1="15" y1="15" x2="85" y2="85" strokeDasharray="4,4" />
        <line x1="85" y1="15" x2="15" y2="85" strokeDasharray="4,4" />
      </g>
    </svg>
  );
}

// ─── 2. SU DAMLASI — Abdest, Gusül ───
export function WaterDrop({ size = 64, color = '#38BDF8', opacity = 0.18, className = '' }) {
  injectStyles();
  return (
    <svg width={size} height={size} viewBox="0 0 80 100" className={className}
      style={{ animation: `islamicFloat 4s ease-in-out infinite`, opacity }}>
      <defs>
        <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Ana damla */}
      <path d="M40 8 C40 8, 10 48, 10 62 C10 80, 25 92, 40 92 C55 92, 70 80, 70 62 C70 48, 40 8, 40 8Z"
        fill="url(#dropGrad)" stroke={color} strokeWidth="1.5" />
      {/* Parlama */}
      <ellipse cx="30" cy="55" rx="8" ry="14" fill="white" opacity="0.3" transform="rotate(-15,30,55)" />
      {/* Dalgalanmalar */}
      <circle cx="40" cy="70" r="6" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4"
        style={{ animation: 'islamicBreath 3s ease-in-out infinite' }} />
      <circle cx="40" cy="70" r="12" fill="none" stroke={color} strokeWidth="0.5" opacity="0.25"
        style={{ animation: 'islamicBreath 3s ease-in-out 0.5s infinite' }} />
    </svg>
  );
}

// ─── 3. MİHRAP — Namaz ───
export function Mihrab({ size = 72, color = '#A78BFA', opacity = 0.16, className = '' }) {
  injectStyles();
  return (
    <svg width={size} height={size} viewBox="0 0 80 100" className={className}
      style={{ opacity }}>
      <g fill="none" stroke={color} strokeWidth="1.3">
        {/* Dış kemer */}
        <path d="M12 92 L12 30 Q12 8, 40 8 Q68 8, 68 30 L68 92" />
        {/* İç kemer */}
        <path d="M22 92 L22 38 Q22 18, 40 18 Q58 18, 58 38 L58 92" />
        {/* Basamaklar */}
        <line x1="22" y1="92" x2="58" y2="92" />
        <line x1="26" y1="84" x2="54" y2="84" />
        {/* Kandil */}
        <circle cx="40" cy="40" r="5" fill={color} opacity="0.4"
          style={{ animation: 'islamicFlicker 3s ease-in-out infinite' }} />
        <line x1="40" y1="18" x2="40" y2="35" strokeDasharray="2,3" />
        {/* Süsleme */}
        <circle cx="40" cy="12" r="3" />
        <path d="M30 72 Q40 62, 50 72" strokeWidth="0.8" />
        <path d="M34 80 Q40 72, 46 80" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

// ─── 4. HİLAL ve YILDIZ — Oruç ───
export function Crescent({ size = 64, color = '#C4B5FD', opacity = 0.18, className = '' }) {
  injectStyles();
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className}
      style={{ animation: `islamicBreath 5s ease-in-out infinite`, opacity }}>
      {/* Hilal */}
      <path d="M45 8 A32 32 0 1 0 45 72 A24 24 0 1 1 45 8Z"
        fill={color} opacity="0.5" />
      <path d="M45 8 A32 32 0 1 0 45 72 A24 24 0 1 1 45 8Z"
        fill="none" stroke={color} strokeWidth="1.2" />
      {/* Yıldız */}
      <polygon points="62,22 64,28 70,28 65,32 67,38 62,34 57,38 59,32 54,28 60,28"
        fill={color} opacity="0.7"
        style={{ animation: 'islamicFlicker 4s ease-in-out infinite' }} />
    </svg>
  );
}

// ─── 5. KANDİL — Dönüş Odası ───
export function Lamp({ size = 56, color = '#F0B429', opacity = 0.18, className = '' }) {
  injectStyles();
  return (
    <svg width={size} height={size} viewBox="0 0 60 90" className={className}
      style={{ animation: `islamicSwing 6s ease-in-out infinite`, transformOrigin: 'top center', opacity }}>
      {/* Zincir */}
      <line x1="30" y1="0" x2="30" y2="22" stroke={color} strokeWidth="1" strokeDasharray="3,2" />
      {/* Kapak */}
      <ellipse cx="30" cy="24" rx="10" ry="3" fill={color} opacity="0.5" />
      {/* Gövde */}
      <path d="M20 24 Q18 40, 22 55 L38 55 Q42 40, 40 24Z"
        fill="none" stroke={color} strokeWidth="1.3" />
      {/* Cam */}
      <ellipse cx="30" cy="40" rx="8" ry="14" fill={color} opacity="0.15" />
      {/* Alev */}
      <ellipse cx="30" cy="38" rx="3" ry="6" fill={color} opacity="0.6"
        style={{ animation: 'islamicFlicker 2s ease-in-out infinite' }} />
      {/* Işık hüzmesi */}
      <path d="M22 55 L10 80 M38 55 L50 80" stroke={color} strokeWidth="0.6" opacity="0.2" />
      {/* Alt süs */}
      <ellipse cx="30" cy="56" rx="9" ry="2.5" fill={color} opacity="0.4" />
      <circle cx="30" cy="60" r="2" fill={color} opacity="0.5" />
    </svg>
  );
}

// ─── 6. AÇIK KİTAP — Kuran, İlim ───
export function OpenBook({ size = 72, color = '#60A5FA', opacity = 0.15, className = '' }) {
  injectStyles();
  return (
    <svg width={size} height={size} viewBox="0 0 100 70" className={className}
      style={{ opacity }}>
      <g fill="none" stroke={color} strokeWidth="1.2">
        {/* Sol sayfa */}
        <path d="M50 15 L50 62 Q30 58, 8 62 L8 15 Q30 11, 50 15Z" fill={color} fillOpacity="0.08"
          style={{ animation: 'islamicPageTurn 8s ease-in-out infinite' }} />
        {/* Sağ sayfa */}
        <path d="M50 15 L50 62 Q70 58, 92 62 L92 15 Q70 11, 50 15Z" fill={color} fillOpacity="0.05" />
        {/* Satırlar — sol */}
        <line x1="18" y1="26" x2="44" y2="24" strokeWidth="0.6" opacity="0.3" />
        <line x1="18" y1="33" x2="44" y2="31" strokeWidth="0.6" opacity="0.3" />
        <line x1="18" y1="40" x2="44" y2="38" strokeWidth="0.6" opacity="0.3" />
        <line x1="18" y1="47" x2="44" y2="45" strokeWidth="0.6" opacity="0.3" />
        {/* Satırlar — sağ */}
        <line x1="56" y1="24" x2="82" y2="26" strokeWidth="0.6" opacity="0.3" />
        <line x1="56" y1="31" x2="82" y2="33" strokeWidth="0.6" opacity="0.3" />
        <line x1="56" y1="38" x2="82" y2="40" strokeWidth="0.6" opacity="0.3" />
        {/* Cilt */}
        <line x1="50" y1="10" x2="50" y2="65" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// ─── 7. KÂBE — Hac, İslam'ın Şartları ───
export function Kaaba({ size = 64, color = '#FBBF24', opacity = 0.16, className = '' }) {
  injectStyles();
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className}
      style={{ opacity }}>
      <g fill="none" stroke={color} strokeWidth="1.3">
        {/* Ana küp */}
        <rect x="18" y="22" width="44" height="48" rx="2" fill={color} fillOpacity="0.08" />
        {/* Kisve (örtü) */}
        <line x1="18" y1="38" x2="62" y2="38" />
        {/* Altın kuşak */}
        <rect x="18" y="36" width="44" height="6" fill={color} fillOpacity="0.15" />
        {/* Hacer-ül Esved */}
        <circle cx="60" cy="56" r="3" fill={color} opacity="0.5" />
        {/* Kapı */}
        <rect x="32" y="44" width="12" height="18" rx="6" fill={color} fillOpacity="0.12" stroke={color} />
        {/* Tavaf çizgileri */}
        <ellipse cx="40" cy="72" rx="32" ry="6" strokeDasharray="4,3" opacity="0.3"
          style={{ animation: 'islamicSpin 20s linear infinite' }} />
      </g>
    </svg>
  );
}

// ─── 8. DUA ELLERİ ───
export function Hands({ size = 64, color = '#F472B6', opacity = 0.15, className = '' }) {
  injectStyles();
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className}
      style={{ animation: `islamicFloat 5s ease-in-out infinite`, opacity }}>
      <g fill="none" stroke={color} strokeWidth="1.3">
        {/* Sol el */}
        <path d="M24 60 L24 30 Q24 20, 30 16 L30 24 M30 24 L30 14 Q32 10, 34 14 L34 22 M34 22 L34 12 Q36 8, 38 12 L38 24 M38 24 L38 16 Q40 12, 40 18" />
        {/* Sağ el */}
        <path d="M56 60 L56 30 Q56 20, 50 16 L50 24 M50 24 L50 14 Q48 10, 46 14 L46 22 M46 22 L46 12 Q44 8, 42 12 L42 24 M42 24 L42 16 Q40 12, 40 18" />
        {/* Avuçlar */}
        <path d="M24 60 Q24 68, 40 68 Q56 68, 56 60" />
        {/* Işık */}
        <circle cx="40" cy="38" r="8" fill={color} opacity="0.12"
          style={{ animation: 'islamicPulse 3s ease-in-out infinite' }} />
      </g>
    </svg>
  );
}

// ─── 9. PUSULA / KIBLE ───
export function Compass({ size = 64, color = '#34D399', opacity = 0.15, className = '' }) {
  injectStyles();
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className}
      style={{ opacity }}>
      <g fill="none" stroke={color} strokeWidth="1.2">
        {/* Dış çember */}
        <circle cx="40" cy="40" r="34" />
        <circle cx="40" cy="40" r="30" strokeDasharray="3,5" opacity="0.4" />
        {/* Yön çizgileri */}
        <line x1="40" y1="6" x2="40" y2="16" strokeWidth="1.5" />
        <line x1="40" y1="64" x2="40" y2="74" />
        <line x1="6" y1="40" x2="16" y2="40" />
        <line x1="64" y1="40" x2="74" y2="40" />
        {/* İğne */}
        <polygon points="40,14 36,40 40,44 44,40" fill={color} opacity="0.5"
          style={{ animation: 'islamicSwing 4s ease-in-out infinite', transformOrigin: '40px 40px' }} />
        <polygon points="40,66 36,40 40,36 44,40" fill={color} opacity="0.2" />
        {/* Merkez */}
        <circle cx="40" cy="40" r="3" fill={color} opacity="0.6" />
      </g>
    </svg>
  );
}

// ─── 10. TERAZİ — Zekât, Adalet ───
export function Scale({ size = 64, color = '#2DD4BF', opacity = 0.15, className = '' }) {
  injectStyles();
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className}
      style={{ opacity }}>
      <g fill="none" stroke={color} strokeWidth="1.3">
        {/* Direk */}
        <line x1="40" y1="12" x2="40" y2="70" />
        {/* Taban */}
        <line x1="25" y1="70" x2="55" y2="70" strokeWidth="2" />
        {/* Kol */}
        <line x1="10" y1="28" x2="70" y2="28"
          style={{ animation: 'islamicSwing 5s ease-in-out infinite', transformOrigin: '40px 28px' }} />
        {/* Sol kefe */}
        <path d="M10 28 L6 42 Q6 48, 18 48 L22 48 Q30 48, 30 42 L26 28" fill={color} fillOpacity="0.1"
          style={{ animation: 'islamicSwing 5s ease-in-out infinite', transformOrigin: '40px 28px' }} />
        {/* Sağ kefe */}
        <path d="M54 28 L50 42 Q50 48, 58 48 L66 48 Q74 48, 74 42 L70 28" fill={color} fillOpacity="0.1"
          style={{ animation: 'islamicSwing 5s ease-in-out infinite', transformOrigin: '40px 28px' }} />
        {/* Tepe süs */}
        <circle cx="40" cy="12" r="4" fill={color} opacity="0.3" />
      </g>
    </svg>
  );
}

// ─── MODÜL İKON EŞLEŞTİRMESİ ───
// Temel modül id'sine göre doğru SVG'yi döndürür
const SVG_MAP = {
  abdest: WaterDrop,
  gusul: WaterDrop,
  namaz: Mihrab,
  oruc: Crescent,
  iman: OctaStar,
  sart: Kaaba,
  dua: Hands,
  kuran: OpenBook,
  siyer: OpenBook,
  zekat: Scale,
  helal: Scale,
  adab: Compass,
  tovbe: Lamp,
  aile: Hands,
  ahiret: Crescent,
  sorular: OctaStar,
};

/** Modül id'sine göre uygun dekoratif SVG bileşenini döndürür. */
export function getModuleSVG(moduleId) {
  return SVG_MAP[moduleId] || OctaStar;
}

export default {
  OctaStar, WaterDrop, Mihrab, Crescent, Lamp,
  OpenBook, Kaaba, Hands, Compass, Scale,
  getModuleSVG,
};
