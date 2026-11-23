import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_NAME } from '../../config/brand';
import { playGate, stopGate } from '../../services/donusAudio';
import { GECE, KemerliKapi, NurZerreleri, Yildizlar, reducedMotion } from './giriSahne';

// 🚪 GİRİŞ KAPISI — uygulamanın ilk açılışında bir kez oynar.
//   1) Gece; kemerli ahşap kapı, kanatların arasından ince bir nur sızar. Üstte besmele.
//   2) Kişi kapıya dokunur → kapı gıcırdayarak açılır, ney ve tını gelir, ışık taşar, zerreler süzülür,
//      kamera kapıdan içeri yürür.
//   3) Işığın içinde "Hoş geldin" ve uygulamanın adı; kendiliğinden ya da dokununca içeri geçilir.
// Ses yalnız dokunuştan sonra çalar (tarayıcı kuralı) ve Ayarlar'daki "giriş sesi" kapalıysa hiç çalmaz.
// "Geç" düğmesi her an görünür. Hareketi azalt açıksa sahne kısa bir geçişe iner.
export const KAPI_KEY = 'nur_kapi_acildi';
export const kapiGosterilsinMi = () => { try { return !localStorage.getItem(KAPI_KEY); } catch { return false; } };

export default function GirisKapisi({ onComplete }) {
  const [phase, setPhase] = useState('kapali'); // kapali → aciliyor → hosgeldin
  const done = useRef(false);
  const quick = reducedMotion();

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    try { localStorage.setItem(KAPI_KEY, new Date().toISOString()); } catch { /* kota */ }
    onComplete();
  }, [onComplete]);

  const open = () => {
    if (phase !== 'kapali') return;
    try { if (navigator.vibrate) navigator.vibrate(18); } catch { /* yok */ }
    try { playGate('kapi'); } catch { /* ses yok */ }
    setPhase('aciliyor');
    setTimeout(() => setPhase('hosgeldin'), quick ? 200 : 1900);
  };

  useEffect(() => {
    if (phase !== 'hosgeldin') return undefined;
    const t = setTimeout(finish, quick ? 600 : 2600);
    return () => clearTimeout(t);
  }, [phase, finish, quick]);

  useEffect(() => () => { try { stopGate(); } catch { /* yok */ } }, []);

  const opening = phase !== 'kapali';

  return (
    <div data-testid="giris-kapisi" style={{ position: 'fixed', inset: 0, zIndex: 110, background: GECE.bg, color: GECE.ink, overflow: 'hidden' }}
      onClick={phase === 'hosgeldin' ? finish : undefined} role="presentation">
      <Yildizlar count={44} />

      <button type="button" onClick={(e) => { e.stopPropagation(); finish(); }} data-testid="kapi-gec"
        style={{ position: 'absolute', top: 'max(16px, env(safe-area-inset-top))', right: 18, zIndex: 5, minHeight: 40, padding: '0 16px',
          borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: `1px solid ${GECE.line}`, color: GECE.soft, fontWeight: 700, fontSize: 13 }}>
        Geç
      </button>

      {/* Besmele */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: opening ? 0 : 1, y: 0 }} transition={{ duration: 0.8 }}
        style={{ position: 'absolute', top: '9vh', left: 0, right: 0, textAlign: 'center', zIndex: 3, padding: '0 20px' }}>
        <p lang="ar" dir="rtl" style={{ margin: 0, fontSize: 26, color: GECE.gold, fontFamily: '"Amiri", "Scheherazade New", "Noto Naskh Arabic", serif' }}>
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 13, letterSpacing: '0.08em', color: GECE.soft }}>Bismillâhirrahmânirrahîm</p>
      </motion.div>

      {/* Kapı: açılırken kamera içeri yürür */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={opening ? { opacity: 1, scale: quick ? 1 : 2.6, y: quick ? 0 : 60 } : { opacity: 1, scale: 1, y: 0 }}
        transition={opening ? { duration: quick ? 0.2 : 2.2, delay: quick ? 0 : 0.7, ease: [0.55, 0, 0.3, 1] } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        onClick={open} role="button" aria-label="Kapıyı aç" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
        data-testid="kapi"
        style={{ position: 'absolute', left: '50%', top: '50%', width: 'min(62vw, 300px)', height: 'min(86vw, 420px)', marginLeft: 'calc(min(62vw, 300px) / -2)',
          marginTop: 'calc(min(86vw, 420px) / -2 + 3vh)', cursor: opening ? 'default' : 'pointer', zIndex: 2, transformOrigin: '50% 62%' }}>
        <KemerliKapi open={opening} duration={quick ? 0.2 : 1.7} />
      </motion.div>

      {/* Eşik: kapının altındaki taş basamak */}
      <motion.div aria-hidden animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.6 }}
        style={{ position: 'absolute', left: '50%', top: 'calc(50% + min(86vw, 420px) / 2 + 3vh)', width: 'min(76vw, 360px)', height: 14, marginLeft: 'calc(min(76vw, 360px) / -2)',
          borderRadius: 8, background: 'linear-gradient(180deg, #2A3B33, #15221C)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1 }} />

      <NurZerreleri active={opening && !quick} count={26} />

      {/* İpucu */}
      {!opening && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.6, repeat: Infinity, delay: 1 }}
          style={{ position: 'absolute', bottom: 'max(10vh, 60px)', left: 0, right: 0, textAlign: 'center', margin: 0, fontSize: 15, fontWeight: 700, color: GECE.gold, letterSpacing: '0.04em', zIndex: 3 }}>
          Kapıya dokun
        </motion.p>
      )}

      {/* Işık taşması */}
      <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: phase === 'hosgeldin' ? 1 : 0 }} transition={{ duration: quick ? 0.2 : 0.9 }}
        style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 55%, #FFF8E4 0%, #F6E6B8 40%, #E6CB86 100%)' }} />

      {/* Hoş geldin */}
      <AnimatePresence>
        {phase === 'hosgeldin' && (
          <motion.div key="hg" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: quick ? 0 : 0.35, duration: 0.7 }}
            style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, color: '#2B2414' }}>
            <p style={{ margin: 0, fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8A6A2A', fontWeight: 800 }}>Hoş geldin</p>
            <h1 style={{ margin: '10px 0 8px', fontFamily: 'var(--font-heading, "Fraunces", serif)', fontWeight: 800, fontSize: 44, color: '#3A2C10' }}>{APP_NAME}</h1>
            <p style={{ margin: 0, maxWidth: 320, fontSize: 16, lineHeight: 1.55, color: '#5A4A26' }}>
              Kur'an, namaz, dua ve ilim. Bir kapı; her gün biraz daha içeri.
            </p>
            <p style={{ margin: '22px 0 0', fontSize: 12, color: '#8A6A2A' }}>Devam etmek için dokun</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
