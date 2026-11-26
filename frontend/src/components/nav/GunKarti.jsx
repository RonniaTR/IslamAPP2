import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toHijri } from '../../services/islamicCalendar';
import { cetele } from '../../services/kazanim';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';

// 🌙 GÜN KARTI — uygulama her açıldığında ekranın tepesinden, kameranın hemen altından inen gün bilgisi.
// Önce küçük siyah bir kapsül belirir, sonra yumuşakça genişleyip karta dönüşür:
//   tarih · hicri tarih · sıradaki vakit · "seninle N. gün" ve seri.
// ~5 sn sonra kapsüle geri döner ve kaybolur. Dokununca hemen kapanır. Oturumda bir kez (sessionStorage).

const HICRI_AY = ['Muharrem', 'Safer', 'Rebîülevvel', 'Rebîülâhir', 'Cemâziyelevvel', 'Cemâziyelâhir', 'Receb', 'Şâban', 'Ramazan', 'Şevval', 'Zilkâde', 'Zilhicce'];
const ANAHTAR = 'gun_karti_gosterildi';
const ALTIN = '#D8B76A';

function gosterilsinMi() {
  try { if (sessionStorage.getItem(ANAHTAR)) return false; sessionStorage.setItem(ANAHTAR, '1'); return true; } catch { return false; }
}

export default function GunKarti() {
  const [evre, setEvre] = useState('yok'); // yok → kapsul → acik → kapaniyor → yok
  const { nextPrayer, countdown } = usePrayerTimes();
  const [bilgi] = useState(() => cetele());

  useEffect(() => {
    if (!gosterilsinMi()) return undefined;
    // Açılış animasyonu bittikten sonra (≈2,3 sn) iner.
    const t = [
      setTimeout(() => setEvre('kapsul'), 2300),
      setTimeout(() => setEvre('acik'), 2750),
      setTimeout(() => setEvre('kapaniyor'), 7600),
      setTimeout(() => setEvre('yok'), 8200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const simdi = new Date();
  const h = toHijri(simdi);
  const acik = evre === 'acik';
  const kalan = countdown && countdown !== '00:00:00' ? countdown.slice(0, 5).replace(':', ' sa ') + ' dk' : '';

  return (
    <AnimatePresence>
      {evre !== 'yok' && (
        <motion.div
          key="gun-karti"
          data-testid="gun-karti"
          role="status"
          aria-live="polite"
          onClick={() => setEvre('kapaniyor')}
          initial={{ y: -40, opacity: 0, width: 120, height: 34, borderRadius: 17 }}
          animate={evre === 'kapaniyor'
            ? { y: -60, opacity: 0, width: 120, height: 34, borderRadius: 17 }
            : acik
              ? { y: 0, opacity: 1, width: 'min(360px, calc(100vw - 20px))', height: 128, borderRadius: 30 }
              : { y: 0, opacity: 1, width: 120, height: 34, borderRadius: 17 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          style={{
            position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 8px)', left: 0, right: 0, margin: '0 auto', zIndex: 2600,
            background: '#050806', color: '#F4EFE3', overflow: 'hidden', cursor: 'pointer',
            boxShadow: '0 12px 34px rgba(0,0,0,0.35)', border: '1px solid rgba(216,183,106,0.18)',
          }}
        >
          <AnimatePresence>
            {acik && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.18 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}
                style={{ position: 'absolute', inset: 0, padding: '14px 18px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 14px', alignItems: 'center' }}>
                <div style={{ gridRow: '1 / span 2', textAlign: 'center', paddingInlineEnd: 14, borderInlineEnd: '1px solid rgba(216,183,106,0.25)' }}>
                  <div style={{ fontFamily: '"Fraunces", serif', fontSize: 40, fontWeight: 800, lineHeight: 1 }}>{simdi.getDate()}</div>
                  <div style={{ fontSize: 12, color: ALTIN, fontWeight: 700, letterSpacing: 1 }}>{simdi.toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase()}</div>
                  <div style={{ fontSize: 11, color: 'rgba(244,239,227,0.6)' }}>{simdi.toLocaleDateString('tr-TR', { weekday: 'long' })}</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: '"Fraunces", serif', fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {h.d} {HICRI_AY[(h.m || 1) - 1]} {h.y}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'rgba(244,239,227,0.72)', marginTop: 2 }}>
                    {nextPrayer ? <>Sıradaki: <b style={{ color: ALTIN }}>{nextPrayer.name}</b> {nextPrayer.time}{kalan ? ` · ${kalan}` : ''}</> : 'Vakitler yükleniyor'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 999, background: 'rgba(216,183,106,0.16)', color: ALTIN, fontWeight: 700 }}>Seninle {bilgi.kacinciGun}. gün</span>
                  {bilgi.seri > 1 && <span style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 999, background: 'rgba(47,163,122,0.18)', color: '#7FD6B0', fontWeight: 700 }}>{bilgi.seri} gün üst üste</span>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
