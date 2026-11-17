import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KidsScene from './KidsScene';
import { KIDS_AYETLER, MEAL_CREDIT } from '../../data/kidsAyetler';
import sfx from '../../services/sfx';

// 🌅 ÇOCUK AÇILIŞI — çocuk modu her açıldığında (oturum başına bir kez):
//   1) Besmele ve kısa bir hayır duası, kelime kelime belirir → çocuk "Âmin" der.
//   2) Bir ayet: hareketli çizimi, meali (olduğu gibi, kaynağıyla) ve çocuk diliyle tek cümlelik açıklaması.
// Her seferinde farklı dua ve farklı ayet gelir (son gösterilenler hatırlanır). Korkutan hiçbir öğe yoktur.
const DUALAR = [
  "Allah'ım, bugün bana güzel şeyler öğret.",
  'Allah’ım, annemi, babamı ve bütün sevdiklerimi koru.',
  'Allah’ım, kalbimi iyilikle doldur.',
  'Allah’ım, bugün beni iyilik yapanlardan eyle.',
  'Allah’ım, bana ve aileme sağlık ve huzur ver.',
  'Allah’ım, bana doğruyu söylemeyi sevdir.',
  'Allah’ım, arkadaşlarıma karşı nazik olmayı bana kolaylaştır.',
  'Rabbim, ilmimi artır.',
  'Allah’ım, verdiğin güzel şeyler için sana teşekkür ederim.',
];
const KEY = 'kids_acilis_son';

function pickFresh(len, key) {
  let last = {};
  try { last = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { last = {}; }
  const recent = last[key] || [];
  const pool = Array.from({ length: len }, (_, i) => i).filter((i) => !recent.includes(i));
  const i = pool[Math.floor(Math.random() * pool.length)] ?? 0;
  last[key] = [i, ...recent].slice(0, Math.max(1, Math.floor(len / 2)));
  try { localStorage.setItem(KEY, JSON.stringify(last)); } catch { /* kota */ }
  return i;
}

export const shouldShowAcilis = () => { try { return !sessionStorage.getItem('kids_acilis_gosterildi'); } catch { return false; } };

export default function KidsAcilis({ onDone }) {
  const dua = useMemo(() => DUALAR[pickFresh(DUALAR.length, 'dua')], []);
  const ayet = useMemo(() => KIDS_AYETLER[pickFresh(KIDS_AYETLER.length, 'ayet')], []);
  const [step, setStep] = useState(0);
  const font = { fontFamily: "'Nunito', 'Noto Sans', sans-serif" };
  const finish = () => { try { sessionStorage.setItem('kids_acilis_gosterildi', '1'); } catch { /* yok */ } onDone(); };
  const words = dua.split(' ');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, overflowY: 'auto', background: 'linear-gradient(180deg, #CDEBFF 0%, #F3FAF1 70%)', color: '#24364A', ...font }}>
      <div style={{ maxWidth: 520, margin: '0 auto', minHeight: '100%', display: 'flex', flexDirection: 'column', padding: '28px 20px 32px' }}>
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="dua" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 22 }}>
              <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                style={{ width: 120, height: 120, borderRadius: 60, background: '#FFFFFF', boxShadow: '0 16px 40px -12px rgba(74,144,217,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="70" height="70" viewBox="0 0 70 70" aria-hidden>
                  <motion.circle cx="35" cy="35" r="30" fill="#FFF3C4" animate={{ r: [28, 32, 28] }} transition={{ duration: 3, repeat: Infinity }} />
                  <path d="M42 14 A22 22 0 1 0 42 56 A17 17 0 1 1 42 14 Z" fill="#F2B33D" />
                  <motion.path d="M52 22 l2.5 5 5.5 .6 -4 3.8 1.2 5.4 -5.2 -3 -5.2 3 1.2 -5.4 -4 -3.8 5.5 -.6z" fill="#F2B33D" animate={{ rotate: [0, 20, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ transformOrigin: '52px 30px' }} />
                </svg>
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ fontSize: 24, fontWeight: 900, color: '#2D8A4E', margin: 0 }}>Bismillâhirrahmânirrahîm</motion.p>
              <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.4, margin: 0, maxWidth: 360 }}>
                {words.map((w, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 1 + i * 0.22 }} style={{ display: 'inline-block', marginInlineEnd: 8 }}>{w}</motion.span>
                ))}
              </p>
              <motion.button type="button" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 + words.length * 0.22, type: 'spring' }}
                whileTap={{ scale: 0.92 }} onClick={() => { sfx.claim(); setStep(1); }}
                style={{ minHeight: 64, padding: '0 46px', borderRadius: 32, background: '#2D8A4E', color: '#fff', fontSize: 24, fontWeight: 900, boxShadow: '0 10px 0 #1B6B3A' }}>
                Âmin
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="ayet" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 140, damping: 18 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 800, color: '#4A90D9', margin: 0, letterSpacing: 1 }}>BUGÜNÜN AYETİ</p>
              <div style={{ borderRadius: 30, overflow: 'hidden', boxShadow: '0 14px 30px -14px rgba(36,54,74,0.5)', border: '4px solid #FFFFFF' }}>
                <KidsScene id={ayet.scene} height={210} />
              </div>
              <div className="paper" style={{ background: '#FFFDF6', borderRadius: 26, padding: '18px 18px 14px', border: '2px solid #F2E3B8' }}>
                <p style={{ fontSize: 18, lineHeight: 1.55, fontWeight: 700, margin: 0 }}>{ayet.meal}</p>
                <p style={{ fontSize: 13, color: '#8A7A55', margin: '10px 0 0', fontWeight: 700 }}>{ayet.ref}</p>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
                style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#E8F7EA', borderRadius: 24, padding: 16 }}>
                <span style={{ fontSize: 28 }} aria-hidden>💡</span>
                <p style={{ fontSize: 17, lineHeight: 1.5, margin: 0, fontWeight: 700, color: '#1B4D2E' }}>{ayet.cocuk}</p>
              </motion.div>
              <motion.button type="button" whileTap={{ scale: 0.94 }} onClick={() => { sfx.levelUp(); finish(); }}
                style={{ alignSelf: 'center', minHeight: 62, padding: '0 40px', borderRadius: 31, background: '#FF9F43', color: '#fff', fontSize: 21, fontWeight: 900, boxShadow: '0 9px 0 #D97A1C', marginTop: 6 }}>
                Hadi başlayalım!
              </motion.button>
              <p style={{ textAlign: 'center', fontSize: 10, color: '#9AA5B1', margin: 0 }}>Meal: {MEAL_CREDIT}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
