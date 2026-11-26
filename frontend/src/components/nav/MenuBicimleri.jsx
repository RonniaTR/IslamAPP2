import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutGrid } from 'lucide-react';

// 🧭 ALT MENÜ BİÇİMLERİ — hepsi İslamiApp'e özgü; Ayarlar > Menü biçimi'nden seçilir (services/menuBicimi.js).
//   yelpaze (varsayılan) · kandil · cini · revak · hilal · kapsul.  (tesbih: MuhurMenu.jsx içinde)
// Ortak sözleşme: ({ tabs, pathname, navigate, theme }) — tabs: [{ id, path, icon, label, isCenter }]

const ALTIN = '#D8B76A';
const KREM = '#F4EFE3';
const ZUMRUT = '#0F5C46';
export const etkinMi = (path, pathname) => (path === '/' ? pathname === '/' : pathname.startsWith(path));
const kabuk = (theme) => ({
  background: theme.navBg, backdropFilter: 'blur(20px) saturate(1.3)', WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
  border: `1px solid ${theme.cardBorder}`, boxShadow: theme.isDark ? '0 14px 34px -10px rgba(0,0,0,0.7)' : '0 14px 34px -14px rgba(20,40,30,0.35)',
});

function SekizYildiz({ boyut, renk, ic }) {
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 66 66" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <rect x="13" y="13" width="40" height="40" fill={renk} /><rect x="13" y="13" width="40" height="40" fill={renk} transform="rotate(45 33 33)" />
      <circle cx="33" cy="33" r="16" fill={ic} />
    </svg>
  );
}

// ───────────── E · AÇILAN MÜHÜR (yelpaze) ─────────────
// Tek bir sekiz köşeli mühür; içinde etkin sekmenin simgesi. Dokununca beş sekme üst yarım daire üzerinde yelpaze gibi açılır,
// arka plan kararır; seçince ya da boşluğa dokununca kapanır. İlk kullanımda bir kez kendiliğinden açılıp kapanır (tanıtım).
export function YelpazeMuhur({ tabs, pathname, navigate, theme, onAcik }) {
  const [acik, setAcik] = useState(false);
  useEffect(() => { if (onAcik) onAcik(acik); }, [acik, onAcik]);
  const etkin = tabs.find((t) => etkinMi(t.path, pathname));
  const R = 124; const n = tabs.length;
  useEffect(() => { setAcik(false); }, [pathname]);
  useEffect(() => {
    let k = null; try { k = localStorage.getItem('yelpaze_tanitim'); } catch { /* yok */ }
    if (k) return undefined;
    const t1 = setTimeout(() => setAcik(true), 3200); const t2 = setTimeout(() => { setAcik(false); try { localStorage.setItem('yelpaze_tanitim', '1'); } catch { /* kota */ } }, 5600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const EtkinIcon = etkin ? etkin.icon : null;
  return (
    <>
      <AnimatePresence>
        {acik && (
          <motion.div key="perde" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAcik(false)}
            style={{ position: 'fixed', inset: 0, pointerEvents: 'auto', background: theme.isDark ? 'rgba(2,8,6,0.68)' : 'rgba(8,28,20,0.58)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }} />
        )}
      </AnimatePresence>
      <div data-testid="yelpaze-menu" style={{ position: 'relative', width: 64, height: 64, pointerEvents: 'auto' }}>
        {/* yelpaze yayı */}
        <AnimatePresence>
          {acik && (
            <motion.svg key="yay" width={2 * R + 80} height={R + 50} viewBox={`0 0 ${2 * R + 80} ${R + 50}`} aria-hidden
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
              style={{ position: 'absolute', left: 32 - (R + 40), bottom: 32 - 10, transformOrigin: 'bottom center', pointerEvents: 'none' }}>
              <path d={`M${40} ${R + 40} A${R} ${R} 0 0 1 ${2 * R + 40} ${R + 40}`} fill="none" stroke={ALTIN} strokeWidth="1" strokeDasharray="2 6" opacity="0.7" />
            </motion.svg>
          )}
        </AnimatePresence>
        {tabs.map((t, i) => {
          const aci = Math.PI + (i / (n - 1)) * Math.PI; // 180° → 360° (üst yarım daire)
          const x = Math.cos(aci) * R; const y = Math.sin(aci) * R;
          const on = etkin && etkin.id === t.id; const Icon = t.icon;
          return (
            <motion.button key={t.id} type="button" data-testid={`yelpaze-${t.id}`} aria-label={t.label} aria-current={on ? 'page' : undefined}
              onClick={() => { setAcik(false); navigate(t.path); }} tabIndex={acik ? 0 : -1}
              initial={false}
              animate={acik ? { x, y, scale: 1, opacity: 1 } : { x: 0, y: 0, scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22, delay: acik ? 0.03 * i : 0 }}
              style={{ position: 'absolute', left: 32 - 27, top: 32 - 27, width: 54, height: 54, borderRadius: '50%', border: on ? `2px solid ${KREM}` : `1px solid ${ALTIN}`, cursor: 'pointer', pointerEvents: acik ? 'auto' : 'none',
                background: on ? ALTIN : KREM, color: on ? '#2A1E05' : ZUMRUT, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 22px -8px rgba(0,0,0,0.55)' }}>
              <Icon size={22} strokeWidth={2.1} aria-hidden />
              <span style={{ position: 'absolute', top: 58, left: -23, width: 100, textAlign: 'center', fontSize: 12, fontWeight: 800, color: KREM, textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>{t.label}</span>
            </motion.button>
          );
        })}
        {/* mühür */}
        <motion.button type="button" data-testid="yelpaze-muhur" aria-label={acik ? 'Menüyü kapat' : `Menüyü aç · ${etkin ? etkin.label : ''}`} aria-expanded={acik}
          onClick={() => setAcik(!acik)} whileTap={{ scale: 0.9 }}
          animate={{ rotate: acik ? 45 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          style={{ position: 'absolute', inset: -4, width: 72, height: 72, padding: 0, border: 'none', background: 'none', cursor: 'pointer', filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.45))' }}>
          <motion.span aria-hidden animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -8, display: 'block' }}>
            <svg width="88" height="88" viewBox="0 0 88 88"><rect x="16" y="16" width="56" height="56" fill="none" stroke={ALTIN} strokeWidth="0.7" opacity="0.6" /><rect x="16" y="16" width="56" height="56" fill="none" stroke={ALTIN} strokeWidth="0.7" opacity="0.6" transform="rotate(45 44 44)" /></svg>
          </motion.span>
          <SekizYildiz boyut={72} renk={ALTIN} ic={ZUMRUT} />
          <motion.span animate={{ rotate: acik ? -45 : 0 }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: KREM }}>
            {acik ? <X size={22} strokeWidth={2.4} /> : EtkinIcon ? <EtkinIcon size={22} strokeWidth={2.2} /> : <LayoutGrid size={20} strokeWidth={2.2} />}
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}

// ───────────── A · KANDİL RAFI ─────────────
export function KandilRafi({ tabs, pathname, navigate, theme }) {
  return (
    <motion.div data-testid="kandil-menu" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }}
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, margin: '0 auto', width: 340, maxWidth: 'calc(100% - 16px)', height: 92, borderRadius: 30, pointerEvents: 'auto', ...kabuk(theme) }}>
      <svg width="100%" height="20" viewBox="0 0 340 20" preserveAspectRatio="none" aria-hidden style={{ position: 'absolute', top: 6, left: 0 }}>
        <path d="M14 4 Q170 18 326 4" stroke={theme.isDark ? '#8C6A22' : '#B08A3E'} strokeWidth="1.2" fill="none" />
      </svg>
      <div style={{ position: 'absolute', inset: '8px 10px 4px', display: 'flex', justifyContent: 'space-around' }}>
        {tabs.map((t) => {
          const on = etkinMi(t.path, pathname); const Icon = t.icon;
          return (
            <button key={t.id} type="button" onClick={() => navigate(t.path)} aria-label={t.label} aria-current={on ? 'page' : undefined}
              style={{ width: 58, border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="40" height="52" viewBox="0 0 40 52" aria-hidden style={{ overflow: 'visible' }}>
                <line x1="20" y1="0" x2="20" y2="10" stroke={theme.isDark ? '#8C6A22' : '#B08A3E'} strokeWidth="1.2" />
                {on && <motion.circle cx="20" cy="28" r="22" fill="#FFD27A" animate={{ opacity: [0.12, 0.35, 0.12] }} transition={{ duration: 2.2, repeat: Infinity }} />}
                <path d="M8 12 H32 L27 40 H13 Z" fill={on ? '#E9C77E' : (theme.isDark ? '#1D4A3A' : '#DCD3BC')} stroke={theme.isDark ? '#8C6A22' : '#B08A3E'} />
                <path d="M13 40 H27 L23 48 H17 Z" fill={on ? '#C9A24E' : (theme.isDark ? '#163D30' : '#CFC4A8')} />
                {on && <motion.path d="M20 20 C16 25 16 29 20 32 C24 29 24 25 20 20 Z" fill="#FFF3C8" animate={{ scaleY: [1, 1.12, 1] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ transformOrigin: '20px 32px' }} />}
              </svg>
              <span style={{ marginTop: -26, color: on ? '#3A2508' : theme.textSecondary, opacity: on ? 0 : 1, display: 'flex' }}><Icon size={15} aria-hidden /></span>
              <span style={{ marginTop: 14, fontSize: 10.5, fontWeight: 800, color: on ? (theme.isDark ? '#E9C77E' : theme.primary) : 'transparent', whiteSpace: 'nowrap' }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ───────────── D · ÇİNİ KUŞAK ─────────────
function CiniDesen({ zemin, cizgi }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 60 64" preserveAspectRatio="none" aria-hidden style={{ position: 'absolute', inset: 0 }}>
      <rect width="60" height="64" fill={zemin} />
      <g transform="translate(30 32)" fill="none" stroke={cizgi} strokeWidth="1"><rect x="-14" y="-14" width="28" height="28" /><rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" /></g>
      {[[0, 0], [60, 0], [0, 64], [60, 64]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill={cizgi} />)}
    </svg>
  );
}
export function CiniKusak({ tabs, pathname, navigate, theme }) {
  return (
    <motion.div data-testid="cini-menu" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }}
      style={{ position: 'absolute', bottom: 4, left: 0, right: 0, margin: '0 auto', width: 344, maxWidth: 'calc(100% - 16px)', padding: 6, borderRadius: 20, display: 'flex', gap: 6, perspective: 500, pointerEvents: 'auto', ...kabuk(theme) }}>
      {tabs.map((t) => {
        const on = etkinMi(t.path, pathname); const Icon = t.icon;
        const yuz = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 };
        return (
          <motion.button key={t.id} type="button" onClick={() => navigate(t.path)} aria-label={t.label} aria-current={on ? 'page' : undefined}
            animate={{ rotateY: on ? 180 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            style={{ flex: 1, height: 62, position: 'relative', transformStyle: 'preserve-3d', border: 'none', padding: 0, background: 'none', cursor: 'pointer' }}>
            <span style={yuz}>
              <CiniDesen zemin={KREM} cizgi="#2E7FA3" />
              <span style={{ position: 'relative', width: 32, height: 32, borderRadius: 16, background: KREM, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F4E9C' }}><Icon size={18} aria-hidden /></span>
            </span>
            <span style={{ ...yuz, transform: 'rotateY(180deg)' }}>
              <CiniDesen zemin={ALTIN} cizgi="#8C6A22" />
              <span style={{ position: 'relative', color: '#2A1E05', display: 'flex' }}><Icon size={18} strokeWidth={2.2} aria-hidden /></span>
              <span style={{ position: 'relative', fontSize: 10, fontWeight: 800, color: '#2A1E05', background: '#E9C77E', padding: '0 5px', borderRadius: 4 }}>{t.label}</span>
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// ───────────── B · REVAK ─────────────
export function RevakMenu({ tabs, pathname, navigate, theme }) {
  return (
    <motion.div data-testid="revak-menu" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }}
      style={{ position: 'absolute', bottom: 4, left: 0, right: 0, margin: '0 auto', width: 344, maxWidth: 'calc(100% - 16px)', height: 70, padding: '0 8px', borderRadius: 18, display: 'flex', alignItems: 'flex-end', gap: 6, pointerEvents: 'auto', ...kabuk(theme) }}>
      {tabs.map((t) => {
        const on = etkinMi(t.path, pathname); const Icon = t.icon;
        return (
          <motion.button key={t.id} type="button" onClick={() => navigate(t.path)} aria-label={t.label} aria-current={on ? 'page' : undefined}
            animate={{ height: on ? 86 : 56, marginBottom: on ? 12 : 6 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            style={{ flex: 1, borderRadius: '40px 40px 6px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              background: on ? ALTIN : (theme.isDark ? '#0B2E23' : '#EFE8D6'), border: `1px solid ${on ? '#F3DDA0' : theme.cardBorder}`, color: on ? '#2A1E05' : theme.textSecondary }}>
            <Icon size={on ? 22 : 18} strokeWidth={on ? 2.3 : 1.9} aria-hidden />
            {on && <span style={{ fontSize: 10.5, fontWeight: 800 }}>{t.label}</span>}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// ───────────── C · HİLAL KIZAĞI ─────────────
export function HilalKizagi({ tabs, pathname, navigate, theme }) {
  const kutu = useRef(null); const [x, setX] = useState(0);
  const i = Math.max(0, tabs.findIndex((t) => etkinMi(t.path, pathname)));
  useEffect(() => { const el = kutu.current && kutu.current.children[i]; if (el) setX(el.offsetLeft + el.offsetWidth / 2 - 22); }, [i]);
  return (
    <motion.div data-testid="hilal-menu" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }}
      style={{ position: 'absolute', bottom: 6, left: 0, right: 0, margin: '0 auto', width: 340, maxWidth: 'calc(100% - 16px)', height: 62, borderRadius: 31, pointerEvents: 'auto', ...kabuk(theme) }}>
      <motion.svg width="44" height="44" viewBox="0 0 44 44" aria-hidden animate={{ x }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} style={{ position: 'absolute', top: -24, left: 0 }}>
        <defs><mask id="hilal-m"><rect width="44" height="44" fill="#fff" /><circle cx="29" cy="17" r="13" fill="#000" /></mask></defs>
        <circle cx="22" cy="22" r="16" fill={ALTIN} mask="url(#hilal-m)" />
        <rect x="25" y="20" width="6" height="6" fill={ALTIN} transform="rotate(45 28 23)" />
      </motion.svg>
      <div ref={kutu} style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {tabs.map((t) => {
          const on = etkinMi(t.path, pathname); const Icon = t.icon;
          return (
            <button key={t.id} type="button" onClick={() => navigate(t.path)} aria-label={t.label} aria-current={on ? 'page' : undefined}
              style={{ width: 56, height: 54, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: on ? (theme.isDark ? ALTIN : theme.primary) : theme.textSecondary }}>
              <Icon size={20} strokeWidth={on ? 2.3 : 1.9} aria-hidden />
              <span style={{ fontSize: 10, fontWeight: 800, opacity: on ? 1 : 0 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ───────────── SADE KAPSÜL ─────────────
export function Kapsul({ tabs, pathname, navigate, theme }) {
  return (
    <motion.div data-testid="kapsul-menu" initial={{ scaleX: 0.2, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} exit={{ scaleX: 0.2, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      style={{ position: 'absolute', bottom: 12, pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 4, padding: 7, borderRadius: 999, maxWidth: 'calc(100% - 24px)', ...kabuk(theme) }}>
      {tabs.map(({ id, path, icon: Icon, label }) => {
        const active = etkinMi(path, pathname);
        return (
          <button key={id} type="button" onClick={() => navigate(path)} aria-label={label} aria-current={active ? 'page' : undefined}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 48, minWidth: 48, padding: active ? '0 16px 0 13px' : 0, borderRadius: 999, border: 'none', cursor: 'pointer',
              background: active ? `${theme.primary}${theme.isDark ? '40' : '1F'}` : 'transparent', color: active ? (theme.isDark ? theme.goldLight || theme.gold : theme.primary) : theme.textSecondary, transition: 'all 0.28s cubic-bezier(0.2,0.8,0.2,1)' }}>
            <Icon size={20} strokeWidth={active ? 2.3 : 1.9} aria-hidden />
            {active && <span style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</span>}
          </button>
        );
      })}
    </motion.div>
  );
}

/** Ayarlar'daki önizleme kartları için küçük statik çizimler. */
export function BicimOnizleme({ id }) {
  const k = '#0B2E23';
  const ortak = { width: '100%', height: 64, display: 'block' };
  const svg = (ic) => <svg viewBox="0 0 120 64" preserveAspectRatio="xMidYMid slice" style={ortak}>{ic}</svg>;
  const c = {
    yelpaze: svg(<><rect width="120" height="64" fill={k} /><path d="M24 58 A36 36 0 0 1 96 58" fill="none" stroke={ALTIN} strokeDasharray="2 3" strokeWidth=".8" />{[0, 1, 2, 3, 4].map((i) => { const a = Math.PI + (i / 4) * Math.PI; return <circle key={i} cx={60 + Math.cos(a) * 36} cy={58 + Math.sin(a) * 36} r="7" fill={i === 2 ? ALTIN : KREM} />; })}<g transform="translate(60 56)"><rect x="-9" y="-9" width="18" height="18" fill={ALTIN} /><rect x="-9" y="-9" width="18" height="18" fill={ALTIN} transform="rotate(45)" /><circle r="7" fill={ZUMRUT} /></g></>),
    kandil: svg(<><rect width="120" height="64" fill={k} /><path d="M6 14 Q60 22 114 14" stroke="#8C6A22" fill="none" />{[16, 38, 60, 82, 104].map((x, i) => (<g key={x}><line x1={x} y1="16" x2={x} y2="24" stroke="#8C6A22" />{i === 1 && <circle cx={x} cy="34" r="12" fill="#FFD27A" opacity=".3" />}<path d={`M${x - 7} 24 H${x + 7} L${x + 4} 42 H${x - 4} Z`} fill={i === 1 ? '#E9C77E' : '#1D4A3A'} stroke="#8C6A22" /></g>))}</>),
    cini: svg(<><rect width="120" height="64" fill={k} />{[0, 1, 2, 3, 4].map((i) => (<g key={i} transform={`translate(${6 + i * 22.5} 18)`}><rect width="20" height="28" rx="3" fill={i === 3 ? ALTIN : KREM} /><g transform="translate(10 14)" fill="none" stroke={i === 3 ? '#8C6A22' : '#2E7FA3'} strokeWidth=".8"><rect x="-5" y="-5" width="10" height="10" /><rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" /></g></g>))}</>),
    revak: svg(<><rect width="120" height="64" fill={k} />{[0, 1, 2, 3, 4].map((i) => { const on = i === 0; const h = on ? 40 : 26; const x = 8 + i * 21.5; return <path key={i} d={`M${x} 56 V${56 - h + 9} Q${x} ${56 - h} ${x + 9} ${56 - h} Q${x + 18} ${56 - h} ${x + 18} ${56 - h + 9} V56 Z`} fill={on ? ALTIN : '#123E30'} stroke="#2A5A47" />; })}</>),
    hilal: svg(<><rect width="120" height="64" fill={k} /><rect x="8" y="34" width="104" height="22" rx="11" fill={KREM} /><circle cx="60" cy="30" r="8" fill={ALTIN} /><circle cx="64" cy="27" r="6.5" fill={k} />{[22, 41, 60, 79, 98].map((x) => <circle key={x} cx={x} cy="45" r="3" fill={x === 60 ? ZUMRUT : '#9A9A90'} />)}</>),
    tesbih: svg(<><rect width="120" height="64" fill={k} /><path d="M6 34 Q60 48 114 34" stroke="#C9862E" fill="none" />{[14, 37, 60, 83, 106].map((x, i) => i === 2 ? <ellipse key={x} cx={x} cy={41} rx="6" ry="9" fill="#C9862E" /> : <circle key={x} cx={x} cy={i === 0 || i === 4 ? 36 : 40} r={i === 0 ? 7 : 5.5} fill={i === 0 ? '#E9C77E' : '#C9862E'} />)}</>),
    kapsul: svg(<><rect width="120" height="64" fill={k} /><rect x="14" y="22" width="92" height="22" rx="11" fill="#1D4A3A" /><rect x="18" y="25" width="30" height="16" rx="8" fill="#2F7A5F" />{[60, 76, 92].map((x) => <circle key={x} cx={x} cy="33" r="3" fill="#9FC4B4" />)}</>),
  };
  return c[id] || null;
}
