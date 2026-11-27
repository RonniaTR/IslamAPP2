import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTx } from '../../i18n';
import { alfa, karistir, ustYazi } from '../../styles/renk';

// 🚪 MODLAR — ana ekrandaki altı kapı. Her mod, konusunu anlatan kendi çizimiyle (SVG, kodla çizilmiş; telif yok)
// tanıtılır. Bütün renkler AKTİF TEMADAN türetilir: tema değişince kartlar, çizimler ve yazılar birlikte değişir.
// Hareketler yalnız transform/opacity (CSS) — kaydırırken takılmaz.

export const MODLAR = [
  { id: 'kuran', n: '01', title: "Kur'an-ı Kerim", desc: 'Mushaf · sure sure meal · hatim · hıfz', bilgi: '114 sure · 604 sayfa', route: '/quran', ton: 0 },
  { id: 'hadis', n: '02', title: 'Hadis ve İlim', desc: 'Hadis · fıkıh · siyer · kütüphane', bilgi: '500 hadis', route: '/hadith', ton: 0.25 },
  { id: 'yol', n: '03', title: 'Yolculuk', desc: 'Nur Yolu · Kırk Perde · gece', bilgi: 'Sana özel plan', route: '/yol', ton: 0.45 },
  { id: 'oyun', n: '04', title: 'Oyun', desc: 'Oyunlar · lig · görevler', bilgi: 'Bilgi yarışları', route: '/games', ton: 0.65 },
  { id: 'gunluk', n: '05', title: 'Dua ve Zikir', desc: 'Tesbih · dualar · kıble · kaza', bilgi: 'Her vakte', route: '/dhikr', ton: 0.8 },
  { id: 'rehber', n: '06', title: 'Rehber', desc: 'Kaynaklı sor · doğrula · anlat', bilgi: 'Kaynak gösterir', route: '/rehber', ton: 1 },
];

function palet(theme, ton) {
  const vurgu = karistir(theme.primary, theme.gold, ton * 0.55);
  if (theme.isDark) {
    return {
      zemin: `linear-gradient(150deg, ${karistir(theme.surface, vurgu, 0.38)} 0%, ${karistir(theme.surface, theme.bg, 0.35)} 100%)`,
      cizgi: theme.gold, dolgu: alfa(theme.gold, 0.16), isik: alfa(theme.goldLight || theme.gold, 0.55), krem: theme.cream || '#F4EFE3',
      kenar: alfa(theme.gold, 0.22),
    };
  }
  return {
    zemin: `linear-gradient(150deg, ${karistir(theme.bg, vurgu, 0.16)} 0%, ${karistir(theme.surface, vurgu, 0.06)} 100%)`,
    cizgi: karistir(vurgu, '#000000', 0.15), dolgu: alfa(vurgu, 0.12), isik: alfa(theme.gold, 0.45), krem: '#FFFFFF',
    kenar: alfa(vurgu, 0.18),
  };
}

// ───────────── Çizimler (viewBox 160×100) ─────────────
function CizimKuran({ p }) {
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" aria-hidden preserveAspectRatio="xMidYMid meet">
      <g className="mod-isin" style={{ transformOrigin: '80px 46px' }}>
        {Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i / 8) * Math.PI; return <line key={i} x1={80 + Math.cos(a) * 26} y1={46 + Math.sin(a) * 26} x2={80 + Math.cos(a) * 44} y2={46 + Math.sin(a) * 44} stroke={p.isik} strokeWidth="1.4" strokeLinecap="round" />; })}
      </g>
      {/* rahle */}
      <path d="M46 88 L80 62 L114 88" fill="none" stroke={p.cizgi} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M52 88 L80 70 L108 88" fill="none" stroke={p.cizgi} strokeWidth="1" opacity="0.5" />
      {/* açık mushaf */}
      <path d="M80 64 C70 56 58 54 46 56 L46 36 C58 34 70 36 80 44 Z" fill={p.krem} stroke={p.cizgi} strokeWidth="1.6" />
      <path d="M80 64 C90 56 102 54 114 56 L114 36 C102 34 90 36 80 44 Z" fill={p.krem} stroke={p.cizgi} strokeWidth="1.6" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${52 + i * 0} ${41 + i * 5} q12 -2 22 3`} stroke={p.cizgi} strokeWidth="0.9" fill="none" opacity="0.55" />)}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M108 ${41 + i * 5} q-12 -2 -22 3`} stroke={p.cizgi} strokeWidth="0.9" fill="none" opacity="0.55" />)}
      {/* sekiz köşeli yıldız */}
      <g transform="translate(80 18)" className="mod-pirilti">
        <rect x="-6" y="-6" width="12" height="12" fill="none" stroke={p.cizgi} strokeWidth="1.3" />
        <rect x="-6" y="-6" width="12" height="12" fill="none" stroke={p.cizgi} strokeWidth="1.3" transform="rotate(45)" />
      </g>
    </svg>
  );
}
function CizimHadis({ p }) {
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" aria-hidden>
      {/* kandil */}
      <line x1="80" y1="0" x2="80" y2="14" stroke={p.cizgi} strokeWidth="1.2" />
      <circle cx="80" cy="34" r="20" fill={p.isik} opacity="0.35" className="mod-pirilti" />
      <path d="M68 16 H92 L87 40 H73 Z" fill={p.dolgu} stroke={p.cizgi} strokeWidth="1.6" />
      <path d="M73 40 H87 L83 47 H77 Z" fill={p.cizgi} opacity="0.7" />
      <path className="mod-alev" d="M80 22 C76 27 76 31 80 34 C84 31 84 27 80 22 Z" fill={p.krem} style={{ transformOrigin: '80px 34px' }} />
      {/* açık kitap */}
      <path d="M80 92 C66 84 50 82 34 84 L34 58 C50 56 66 58 80 66 Z" fill={p.krem} stroke={p.cizgi} strokeWidth="1.6" />
      <path d="M80 92 C94 84 110 82 126 84 L126 58 C110 56 94 58 80 66 Z" fill={p.krem} stroke={p.cizgi} strokeWidth="1.6" />
      {[0, 1, 2].map((i) => <line key={i} x1="42" y1={66 + i * 6} x2="70" y2={70 + i * 6} stroke={p.cizgi} strokeWidth="0.9" opacity="0.5" />)}
      {[0, 1, 2].map((i) => <line key={i} x1="118" y1={66 + i * 6} x2="90" y2={70 + i * 6} stroke={p.cizgi} strokeWidth="0.9" opacity="0.5" />)}
      {/* kalem */}
      <path d="M128 50 L142 30" stroke={p.cizgi} strokeWidth="2" strokeLinecap="round" />
      <path d="M142 30 L146 24 L144 32 Z" fill={p.cizgi} />
    </svg>
  );
}
function CizimYol({ p }) {
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" aria-hidden>
      {/* uzaktaki kemer ve hilal */}
      <path d="M112 64 V40 Q112 24 124 18 Q136 24 136 40 V64" fill={p.dolgu} stroke={p.cizgi} strokeWidth="1.6" />
      <circle cx="124" cy="40" r="7" fill={p.krem} />
      <path d="M124 33 a7 7 0 1 0 5 12 a5.5 5.5 0 1 1 -5 -12 Z" fill={p.cizgi} />
      {/* kıvrılan yol */}
      <path d="M14 96 C40 86 30 70 60 66 C88 62 86 74 112 64" fill="none" stroke={p.cizgi} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 7" />
      <path d="M8 98 C38 88 26 70 58 64 C86 58 90 70 112 60" fill="none" stroke={p.cizgi} strokeWidth="0.8" opacity="0.4" />
      {/* duraklar */}
      {[[28, 84], [60, 66], [92, 68]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" fill={i === 1 ? p.cizgi : p.krem} stroke={p.cizgi} strokeWidth="1.2" />)}
      {/* yıldızlar */}
      {[[30, 18], [54, 30], [78, 14], [148, 16]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.4" fill={p.cizgi} className="mod-pirilti" style={{ animationDelay: `${i * 0.4}s` }} />)}
    </svg>
  );
}
function CizimOyun({ p }) {
  const parca = (x, y, r = 0, ac = false) => (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x="-13" y="-13" width="26" height="26" rx="4" fill={ac ? p.cizgi : p.krem} stroke={p.cizgi} strokeWidth="1.4" />
      <g fill="none" stroke={ac ? p.krem : p.cizgi} strokeWidth="1"><rect x="-6" y="-6" width="12" height="12" /><rect x="-6" y="-6" width="12" height="12" transform="rotate(45)" /></g>
    </g>
  );
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" aria-hidden>
      {parca(50, 70)}{parca(80, 70)}{parca(110, 70)}
      {parca(65, 42)}
      <g className="mod-yuzer" style={{ transformOrigin: '98px 32px' }}>{parca(98, 32, 12, true)}</g>
      <path d="M128 18 l2 4 4 .6 -3 3 .8 4 -3.8-2 -3.8 2 .8-4 -3-3 4-.6z" fill={p.cizgi} className="mod-pirilti" />
      <path d="M28 30 l1.4 2.8 3 .4 -2.2 2.1 .5 3 -2.7-1.4 -2.7 1.4 .5-3 -2.2-2.1 3-.4z" fill={p.cizgi} opacity="0.6" />
    </svg>
  );
}
function CizimZikir({ p }) {
  const taneler = Array.from({ length: 15 }, (_, i) => {
    const a = (-0.15 + (i / 14) * 1.3) * Math.PI;
    return [70 + Math.cos(a) * 34, 46 + Math.sin(a) * 30];
  });
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" aria-hidden>
      <path d={`M${taneler.map(([x, y]) => `${x} ${y}`).join(' L')}`} fill="none" stroke={p.cizgi} strokeWidth="0.8" opacity="0.6" />
      {taneler.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 7 ? 5 : 4.2} fill={i === 7 ? p.cizgi : p.krem} stroke={p.cizgi} strokeWidth="1.2" />)}
      {/* imame ve püskül */}
      <path d="M36 54 L30 74" stroke={p.cizgi} strokeWidth="1.4" />
      <ellipse cx="29" cy="80" rx="3.6" ry="6" fill={p.cizgi} />
      <g className="mod-salla" style={{ transformOrigin: '29px 86px' }}>{[-3, -1, 1, 3].map((d) => <line key={d} x1="29" y1="86" x2={29 + d} y2="96" stroke={p.cizgi} strokeWidth="1" />)}</g>
      {/* küçük kıble pusulası */}
      <g transform="translate(128 34)">
        <circle r="16" fill={p.krem} stroke={p.cizgi} strokeWidth="1.4" />
        <circle r="11" fill="none" stroke={p.cizgi} strokeWidth="0.6" opacity="0.5" />
        <g className="mod-ibre"><path d="M0 -12 L3 0 L0 3 L-3 0 Z" fill={p.cizgi} /><path d="M0 12 L3 0 L-3 0 Z" fill={p.cizgi} opacity="0.35" /></g>
        <rect x="-2.5" y="-20" width="5" height="5" fill={p.cizgi} />
      </g>
    </svg>
  );
}
function CizimRehber({ p }) {
  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" aria-hidden>
      {/* soru balonu */}
      <path d="M22 22 H82 Q90 22 90 30 V52 Q90 60 82 60 H48 L36 70 L38 60 H22 Q14 60 14 52 V30 Q14 22 22 22 Z" fill={p.krem} stroke={p.cizgi} strokeWidth="1.5" />
      <text x="52" y="49" textAnchor="middle" fontSize="24" fontWeight="800" fill={p.cizgi} fontFamily="Georgia, serif">?</text>
      {/* kaynak kitap yığını */}
      <rect x="98" y="72" width="50" height="9" rx="2" fill={p.dolgu} stroke={p.cizgi} strokeWidth="1.3" />
      <rect x="102" y="62" width="44" height="9" rx="2" fill={p.krem} stroke={p.cizgi} strokeWidth="1.3" />
      <rect x="96" y="82" width="54" height="9" rx="2" fill={p.krem} stroke={p.cizgi} strokeWidth="1.3" />
      {/* onay mührü */}
      <g transform="translate(122 34)" className="mod-pirilti">
        <circle r="13" fill="none" stroke={p.cizgi} strokeWidth="1.4" strokeDasharray="2 3" />
        <path d="M-6 0 L-1.5 5 L7 -5" fill="none" stroke={p.cizgi} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
const CIZIM = { kuran: CizimKuran, hadis: CizimHadis, yol: CizimYol, oyun: CizimOyun, gunluk: CizimZikir, rehber: CizimRehber };

export default function ModKartlari() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [ilk, ...diger] = MODLAR;
  const pIlk = palet(theme, ilk.ton);
  const vurguIlk = karistir(theme.primary, theme.gold, 0.08);
  const ilkYazi = ustYazi(theme.isDark ? theme.surface : vurguIlk);

  return (
    <section aria-label={tt('Modlar')} data-testid="mod-kartlari" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: 4 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 700, color: theme.textPrimary }}>{tt('Modlar')}</span>
        <span style={{ fontSize: 12, color: theme.textSecondary }}>{tt('Uygulamanın altı kapısı')}</span>
      </div>

      {/* Kur'an: geniş kart */}
      <button type="button" data-testid="mod-kuran" className="gir-yukari mod-kart" style={{ '--s': 0, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'stretch', minHeight: 150, padding: 0, textAlign: 'start', cursor: 'pointer', borderRadius: 24,
        border: `1px solid ${pIlk.kenar}`, background: theme.isDark ? pIlk.zemin : `linear-gradient(140deg, ${vurguIlk} 0%, ${karistir(vurguIlk, '#000000', 0.25)} 100%)`, color: ilkYazi }}
        onClick={() => navigate(ilk.route)}>
        <span style={{ flex: 1, padding: '18px 0 16px 18px', display: 'flex', flexDirection: 'column', gap: 6, zIndex: 1 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, color: theme.isDark ? theme.gold : alfa(ilkYazi, 0.8) }}>{ilk.n}</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>{tt(ilk.title)}</span>
          <span style={{ fontSize: 12.5, opacity: 0.82, lineHeight: 1.4 }}>{tt(ilk.desc)}</span>
          <span style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', height: 30, padding: '0 12px', borderRadius: 15, fontSize: 12, fontWeight: 700,
            background: theme.isDark ? theme.gold : alfa(ilkYazi, 0.16), color: theme.isDark ? '#1A1406' : ilkYazi }}>
            {tt(ilk.bilgi)} <ChevronRight size={14} aria-hidden />
          </span>
        </span>
        <span style={{ width: '46%', minWidth: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 6px 6px 0' }}>
          <CizimKuran p={theme.isDark ? pIlk : { cizgi: ilkYazi, krem: ilkYazi === '#FFFFFF' ? alfa('#FFFFFF', 0.16) : '#FFFFFF', dolgu: alfa(ilkYazi, 0.14), isik: alfa(theme.goldLight || theme.gold, 0.85), kenar: 'transparent' }} />
        </span>
      </button>

      {/* Diğer beş mod */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        {diger.map((m, i) => {
          const p = palet(theme, m.ton);
          const Cizim = CIZIM[m.id];
          const genis = i === diger.length - 1 && diger.length % 2 === 1;
          return (
            <button key={m.id} type="button" data-testid={`mod-${m.id}`} onClick={() => navigate(m.route)} className="gir-yukari mod-kart"
              style={{ '--s': i + 1, gridColumn: genis ? '1 / -1' : undefined, display: 'flex', flexDirection: genis ? 'row' : 'column', padding: 0, overflow: 'hidden', textAlign: 'start', cursor: 'pointer',
                borderRadius: 20, background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }}>
              <span style={{ display: 'block', height: genis ? 'auto' : 92, width: genis ? '44%' : '100%', minHeight: genis ? 104 : undefined, background: p.zemin, borderBottom: genis ? 'none' : `1px solid ${p.kenar}`, padding: '6px 8px' }}>
                <Cizim p={p} />
              </span>
              <span style={{ flex: 1, padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, color: theme.gold }}>{m.n}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: theme.textSecondary, marginInlineStart: 'auto' }}>{tt(m.bilgi)}</span>
                </span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{tt(m.title)}</span>
                <span style={{ fontSize: 11.5, lineHeight: 1.35, color: theme.textSecondary }}>{tt(m.desc)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
