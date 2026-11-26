import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { devamSec, devamKapat } from '../../services/devam';
import { FONT } from '../../pages/musluman/tema';
import { useMenuBicimi } from '../../services/menuBicimi';
import { YelpazeMuhur, KandilRafi, CiniKusak, RevakMenu, HilalKizagi, Kapsul } from './MenuBicimleri';

const BICIM_BILESEN = { kandil: KandilRafi, cini: CiniKusak, revak: RevakMenu, hilal: HilalKizagi, kapsul: Kapsul, tesbih: TesbihDizisi };

// 🔰 MÜHÜR MENÜ — İslamiApp'e özgü alt gezinme.
//
//   Açık hâl:   yüzen kapsül menü + üstünde "Devam Kemeri" (kaldığın yer). Kemerin sol ucunda, kilit taşı gibi
//               karttan taşan bir madalyon durur: sekiz köşeli yıldız ve çevresinde altın bir okuma halkası.
//   Kapalı hâl: aşağı kaydırınca kapsül ve kemer tek bir MÜHRE dönüşür: zümrüt bir daire, içinde etkin sekmenin
//               simgesi, kenarında dönen sekiz köşeli yıldız ve (varsa) okuma halkası. Mühre dokununca ya da
//               yukarı kaydırınca menü geri açılır.

const SEKIZ = 'M12 1.5l2.6 4.1 4.8-1.1-1.1 4.8 4.1 2.7-4.1 2.6 1.1 4.8-4.8-1.1L12 22.5l-2.6-4.2-4.8 1.1 1.1-4.8L1.5 12l4.2-2.7-1.1-4.8 4.8 1.1z';

function Yildiz({ boyut = 22, renk = '#E0C47A', dolgu = 'none', kalinlik = 1.4 }) {
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 24 24" aria-hidden>
      <path d={SEKIZ} fill={dolgu} stroke={renk} strokeWidth={kalinlik} strokeLinejoin="round" />
    </svg>
  );
}

/** Okuma halkası: conic-gradient ile altın yay. */
function Halka({ oran, boyut, kalinlik = 3, iz = 'rgba(224,196,122,0.22)', renk = '#E0C47A', children }) {
  const yuzde = Math.max(0, Math.min(1, oran || 0)) * 360;
  return (
    <div style={{ width: boyut, height: boyut, borderRadius: '50%', padding: kalinlik, background: oran == null ? renk : `conic-gradient(${renk} ${yuzde}deg, ${iz} ${yuzde}deg)`, flex: `0 0 ${boyut}px` }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function DevamKemeri({ kayit, theme, onAc, onKapat }) {
  const koyu = theme.isDark;
  return (
    <motion.div
      key={kayit.anahtar}
      initial={{ y: 26, opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.05, bottom: 0.6 }}
      onDragEnd={(_, i) => { if (i.offset.y > 38) onKapat(); }}
      style={{ pointerEvents: 'auto', position: 'relative', width: 'min(440px, calc(100vw - 24px))', paddingTop: 10, touchAction: 'pan-x' }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onAc}
        onKeyDown={(e) => { if (e.key === 'Enter') onAc(); }}
        aria-label={`${kayit.etiket}: ${kayit.baslik}, ${kayit.alt}`}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, padding: '8px 10px 8px 70px', cursor: 'pointer',
          borderRadius: '20px 20px 18px 18px',
          background: koyu ? 'linear-gradient(120deg, #0F2E22, #0B241B)' : 'linear-gradient(120deg, #FFFDF6, #F6EEDC)',
          border: `1px solid ${koyu ? 'rgba(224,196,122,0.28)' : 'rgba(176,138,62,0.32)'}`,
          boxShadow: koyu ? '0 14px 30px -12px rgba(0,0,0,0.7)' : '0 14px 30px -14px rgba(60,45,15,0.35)',
        }}
      >
        {/* Kilit taşı madalyon: kartın üst kenarından taşar */}
        <div aria-hidden style={{ position: 'absolute', left: 10, top: -12 }}>
          <svg width="54" height="20" viewBox="0 0 54 20" style={{ position: 'absolute', left: 0, top: -6 }}>
            <path d="M2 20 Q2 6 27 1 Q52 6 52 20" fill={koyu ? '#0F2E22' : '#FFFDF6'} stroke={koyu ? 'rgba(224,196,122,0.4)' : 'rgba(176,138,62,0.45)'} strokeWidth="1" />
          </svg>
          <Halka oran={kayit.oran} boyut={54} kalinlik={3}>
            <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 35% 30%, #1D6B55, #0B3A2D 75%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
                <Yildiz boyut={26} renk="#E9CF92" />
              </motion.div>
            </div>
          </Halka>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 800, color: koyu ? '#E0C47A' : '#9C7A2E' }}>
            Kaldığın yer · {kayit.etiket}
          </div>
          <div style={{ fontFamily: FONT.baslik, fontWeight: 600, fontSize: 16, lineHeight: '20px', color: theme.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {kayit.baslik}
            <span style={{ fontFamily: 'inherit', fontWeight: 400, fontSize: 13, color: theme.textSecondary }}> · {kayit.alt}</span>
          </div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, height: 34, padding: '0 10px 0 13px', borderRadius: 999, background: 'linear-gradient(135deg, #E9CB86, #C9A24E)', color: '#2A1E06', fontSize: 13, fontWeight: 800, flex: '0 0 auto' }}>
          Devam <ChevronRight size={16} />
        </span>
        <button
          type="button"
          aria-label="Kaldığın yer kartını kapat"
          onClick={(e) => { e.stopPropagation(); onKapat(); }}
          style={{ position: 'absolute', top: -8, right: -6, width: 22, height: 22, borderRadius: 11, border: `1px solid ${theme.cardBorder}`, background: theme.isDark ? '#16241C' : '#fff', color: theme.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: 'pointer' }}
        >
          <X size={12} />
        </button>
      </div>
    </motion.div>
  );
}

function Muhur({ etkin, kayit, theme, onAc }) {
  const Icon = etkin ? etkin.icon : null;
  return (
    <motion.button
      key="muhur"
      type="button"
      data-testid="muhur"
      onClick={onAc}
      aria-label={`Menüyü aç${kayit ? ` · kaldığın yer: ${kayit.baslik}` : ''}`}
      initial={{ scale: 0.3, rotate: -120, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0.3, rotate: 90, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      whileTap={{ scale: 0.92 }}
      style={{ pointerEvents: 'auto', position: 'relative', width: 64, height: 64, padding: 0, border: 0, background: 'none', cursor: 'pointer' }}
    >
      <motion.div aria-hidden animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -6 }}>
        <Yildiz boyut={76} renk={theme.isDark ? 'rgba(224,196,122,0.55)' : 'rgba(176,138,62,0.55)'} kalinlik={0.6} />
      </motion.div>
      <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', boxShadow: theme.isDark ? '0 10px 24px -6px rgba(0,0,0,0.8)' : '0 12px 26px -10px rgba(10,50,35,0.55)' }}>
        <Halka oran={kayit ? kayit.oran : null} boyut={56} kalinlik={kayit ? 3 : 2} renk={kayit ? '#E0C47A' : 'rgba(224,196,122,0.55)'}>
          <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 35% 30%, #1D6B55, #0B3A2D 75%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F3E3B5' }}>
            {Icon && <Icon size={22} strokeWidth={2.2} />}
          </div>
        </Halka>
      </div>
      {kayit && <span aria-hidden style={{ position: 'absolute', top: 2, right: 2, width: 12, height: 12, borderRadius: 6, background: '#E0C47A', border: `2px solid ${theme.isDark ? '#0B241B' : '#fff'}` }} />}
    </motion.button>
  );
}


// 📿 TESBİH DİZİSİ — alt menü bir tesbih gibi: ince bir ipe dizilmiş kehribar taneler, ortada püsküllü imame.
// Taneler ipin hafif sarkıntısını izler; aralarında küçük ara taneler var. Etkin tane büyür, altına döner,
// üstünden altın ışık geçer ve adı altında belirir. İmame (ortadaki uzun tane) Yol sekmesidir; püskülü hafifçe sallanır.
const KEHRIBAR = ['#F6C774', '#C9862E', '#7A4310'];
function Tane({ Icon, active, label, onClick, imame, x, y, theme }) {
  const w = imame ? 44 : active ? 54 : 44; const h = imame ? 62 : w;
  const renk = active ? ['#FFF1C2', theme.gold || '#D8B76A', '#8C6A22'] : KEHRIBAR;
  return (
    <motion.button type="button" onClick={onClick} aria-label={label} aria-current={active ? 'page' : undefined}
      data-testid={`tane-${label}`}
      animate={{ x: x - w / 2, y: y - h / 2, width: w, height: h, rotate: active ? 360 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      whileTap={{ scale: 0.88 }}
      style={{ position: 'absolute', left: 0, top: 0, padding: 0, border: 'none', cursor: 'pointer', borderRadius: imame ? '22px 22px 22px 22px / 30px 30px 30px 30px' : '50%',
        background: `radial-gradient(circle at 32% 28%, ${renk[0]} 0%, ${renk[1]} 48%, ${renk[2]} 100%)`,
        boxShadow: active ? `0 0 0 2px ${theme.isDark ? 'rgba(255,241,194,0.5)' : 'rgba(140,106,34,0.35)'}, 0 8px 20px -6px rgba(201,134,46,0.75)` : '0 6px 14px -6px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? '#3A2508' : '#FFF4DC' }}>
      <motion.span animate={{ rotate: active ? -360 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} style={{ display: 'flex' }}>
        <Icon size={active ? 22 : 19} strokeWidth={2.1} aria-hidden />
      </motion.span>
      {/* parlama */}
      <span aria-hidden style={{ position: 'absolute', top: '12%', left: '22%', width: '28%', height: '18%', borderRadius: '50%', background: 'rgba(255,255,255,0.55)', filter: 'blur(1px)' }} />
    </motion.button>
  );
}

function TesbihDizisi({ tabs, pathname, navigate, theme }) {
  const W = 340; const SARKI = 12; const UST = 40;
  const n = tabs.length; const aralik = (W - 60) / (n - 1);
  const yAt = (x) => UST + SARKI * (1 - Math.pow((x - W / 2) / (W / 2), 2));
  const merkezIdx = Math.max(0, tabs.findIndex((t) => t.isCenter));
  const etkinIdx = tabs.findIndex(({ path }) => (path === '/' ? pathname === '/' : pathname.startsWith(path)));
  const xs = tabs.map((_, i) => 30 + i * aralik);
  const ara = [];
  for (let i = 0; i < n - 1; i += 1) for (let k = 1; k <= 3; k += 1) { const x = xs[i] + (aralik * k) / 4; ara.push([x, yAt(x)]); }
  const etkin = tabs[etkinIdx];
  return (
    <motion.div key="tesbih" data-testid="tesbih-menu"
      initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{ position: 'absolute', left: 0, right: 0, margin: '0 auto', bottom: 0, pointerEvents: 'auto', width: W, maxWidth: 'calc(100% - 16px)', height: 92 }}>
      {/* buzlu zemin: tesbihin yattığı kadife */}
      <div aria-hidden style={{ position: 'absolute', inset: '6px 0 4px', borderRadius: 34, background: theme.navBg, backdropFilter: 'blur(20px) saturate(1.3)', WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
        border: `1px solid ${theme.cardBorder}`, boxShadow: theme.isDark ? '0 14px 34px -10px rgba(0,0,0,0.7)' : '0 14px 34px -14px rgba(20,40,30,0.35)' }} />
      <svg width={W} height="92" viewBox={`0 0 ${W} 92`} aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <path d={`M8 ${UST - 4} Q${W / 2} ${UST + 2 * SARKI + 4} ${W - 8} ${UST - 4}`} fill="none" stroke={theme.isDark ? 'rgba(224,196,122,0.55)' : 'rgba(122,67,16,0.45)'} strokeWidth="1.4" />
        {ara.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.2" fill={i % 3 === 1 ? '#C9862E' : '#9A5A1C'} opacity="0.9" />)}
        {/* imame püskülü */}
        <motion.g animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: `${xs[merkezIdx]}px ${yAt(xs[merkezIdx]) + 30}px` }}>
          {[-5, -2.5, 0, 2.5, 5].map((dx) => (
            <line key={dx} x1={xs[merkezIdx]} y1={yAt(xs[merkezIdx]) + 30} x2={xs[merkezIdx] + dx} y2={yAt(xs[merkezIdx]) + 46} stroke={theme.gold || '#D8B76A'} strokeWidth="1.4" strokeLinecap="round" />
          ))}
          <circle cx={xs[merkezIdx]} cy={yAt(xs[merkezIdx]) + 31} r="3" fill={theme.gold || '#D8B76A'} />
        </motion.g>
      </svg>
      {tabs.map(({ id, path, icon: Icon, label, isCenter }, i) => (
        <Tane key={id} Icon={Icon} label={label} active={i === etkinIdx} imame={!!isCenter} x={xs[i]} y={yAt(xs[i])} theme={theme} onClick={() => navigate(path)} />
      ))}
      <AnimatePresence mode="wait">
        {etkin && (
          <motion.span key={etkin.id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', top: yAt(xs[etkinIdx]) - (etkin.isCenter ? 50 : 42), left: xs[etkinIdx] - 60, width: 120, textAlign: 'center', fontSize: 11, fontWeight: 800, letterSpacing: 0.4, whiteSpace: 'nowrap', textShadow: theme.isDark ? '0 1px 6px rgba(0,0,0,0.6)' : '0 1px 6px rgba(255,255,255,0.9)',
              color: theme.isDark ? (theme.goldLight || theme.gold) : theme.primary, pointerEvents: 'none' }}>
            {etkin.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Secili({ bicim, ...p }) {
  const B = BICIM_BILESEN[bicim] || TesbihDizisi;
  return <B {...p} />;
}

export default function MuhurMenu({ tabs, pathname, search, navigate, theme, kapali, setKapali }) {
  const [kayit, setKayit] = useState(null);
  const bicim = useMenuBicimi();
  const [yelpazeAcik, setYelpazeAcik] = useState(false);
  const yelpaze = bicim === 'yelpaze';
  useEffect(() => { setKayit(devamSec({ pathname, search })); }, [pathname, search]);
  // İçerik alanının alt boşluğu: devam kartı açıkken kart kadar fazla (Layout main bunu okur)
  useEffect(() => {
    const kart = kayit && !kapali;
    const taban = yelpaze ? 100 : 126;
    document.documentElement.style.setProperty('--alt-bosluk', `${kart ? taban + 80 : taban}px`);
  }, [kayit, kapali, yelpaze]);
  useEffect(() => {
    const yenile = () => setKayit(devamSec({ pathname: window.location.pathname, search: window.location.search }));
    window.addEventListener('focus', yenile);
    window.addEventListener('storage', yenile);
    return () => { window.removeEventListener('focus', yenile); window.removeEventListener('storage', yenile); };
  }, []);

  const etkin = tabs.find((t) => (t.path === '/' ? pathname === '/' : pathname.startsWith(t.path)));
  const kapat = () => { if (kayit) devamKapat(kayit.anahtar); setKayit(null); };

  return (
    <nav
      className="md:hidden"
      data-testid="bottom-nav"
      aria-label="Ana menü"
      style={{ position: 'fixed', insetInline: 0, bottom: 'max(10px, env(safe-area-inset-bottom))', zIndex: yelpaze && yelpazeAcik ? 120 : 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, pointerEvents: 'none' }}
    >
      <AnimatePresence>
        {kayit && !kapali && <DevamKemeri kayit={kayit} theme={theme} onAc={() => navigate(kayit.yol)} onKapat={kapat} />}
      </AnimatePresence>
      <div style={{ position: 'relative', height: yelpaze ? 72 : (kapali ? 64 : 92), display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {yelpaze ? (
          <YelpazeMuhur tabs={tabs} pathname={pathname} navigate={navigate} theme={theme} onAcik={setYelpazeAcik} />
        ) : (
          <AnimatePresence initial={false}>
            {kapali ? (
              <Muhur key="muhur" etkin={etkin} kayit={kayit} theme={theme} onAc={() => setKapali(false)} />
            ) : (
              <Secili key={bicim} bicim={bicim} tabs={tabs} pathname={pathname} navigate={navigate} theme={theme} />
            )}
          </AnimatePresence>
        )}
      </div>
    </nav>
  );
}
