import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { devamSec, devamKapat } from '../../services/devam';
import { FONT } from '../../pages/musluman/tema';

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

export default function MuhurMenu({ tabs, pathname, search, navigate, theme, kapali, setKapali }) {
  const [kayit, setKayit] = useState(null);
  useEffect(() => { setKayit(devamSec({ pathname, search })); }, [pathname, search]);
  // İçerik alanının alt boşluğu: devam kartı açıkken kart kadar fazla (Layout main bunu okur)
  useEffect(() => {
    const kart = kayit && !kapali;
    document.documentElement.style.setProperty('--alt-bosluk', kart ? '176px' : '96px');
  }, [kayit, kapali]);
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
      style={{ position: 'fixed', insetInline: 0, bottom: 'max(10px, env(safe-area-inset-bottom))', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, pointerEvents: 'none' }}
    >
      <AnimatePresence>
        {kayit && !kapali && <DevamKemeri kayit={kayit} theme={theme} onAc={() => navigate(kayit.yol)} onKapat={kapat} />}
      </AnimatePresence>
      <div style={{ position: 'relative', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <AnimatePresence initial={false}>
          {kapali ? (
            <Muhur key="muhur" etkin={etkin} kayit={kayit} theme={theme} onAc={() => setKapali(false)} />
          ) : (
            <motion.div
              key="kapsul"
              initial={{ scaleX: 0.2, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0.2, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              style={{
                position: 'absolute', pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                padding: 7, borderRadius: 999, maxWidth: 'calc(100% - 24px)',
                background: theme.navBg, backdropFilter: 'blur(22px) saturate(1.4)', WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: theme.isDark ? '0 14px 34px -10px rgba(0,0,0,0.7)' : '0 14px 34px -14px rgba(20,40,30,0.35)',
              }}
            >
              {tabs.map(({ id, path, icon: Icon, label }) => {
                const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => navigate(path)}
                    aria-label={label}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      height: 48, minWidth: 48, padding: active ? '0 16px 0 13px' : 0, borderRadius: 999, border: 'none', cursor: 'pointer',
                      background: active ? `${theme.primary}${theme.isDark ? '40' : '1F'}` : 'transparent',
                      color: active ? (theme.isDark ? theme.goldLight || theme.gold : theme.primary) : theme.textSecondary,
                      transition: 'all 0.28s cubic-bezier(0.2,0.8,0.2,1)',
                    }}
                  >
                    {active && (
                      <motion.span layoutId="muhur-isik" aria-hidden style={{ position: 'absolute', top: -5, insetInlineStart: '50%', marginInlineStart: -6 }}>
                        <Yildiz boyut={12} renk={theme.gold} dolgu={theme.gold} kalinlik={0.5} />
                      </motion.span>
                    )}
                    <Icon size={20} strokeWidth={active ? 2.3 : 1.9} aria-hidden />
                    {active && <span style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</span>}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
