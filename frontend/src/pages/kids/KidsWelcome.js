import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus } from 'lucide-react';
import { useAppMode } from '../../contexts/AppModeContext';
import sfx from '../../services/sfx';
import { KemerliKapi, reducedMotion } from '../../components/giris/giriSahne';

// 🌼 ÇOCUK KARŞILAMA — bahçe kapısı.
//   1) Güneşli gökyüzü, çiçekli yeşil kapı. Çocuk dokunur → kapı açılır, ardında bahçe.
//   2) "Senin adın ne?" + bir simge seç (yüzsüz simgeler: yıldız, ay, çiçek, arı…) → profil oluşur.
//   Daha önce profil açılmışsa önce onlar gösterilir.
// Önceki sürüm sahte hazır profillerle (Yusuf, Zeynep, Elif — seviye 7, 1250 XP) açılıyordu; kaldırıldı.
// Profil yalnız bu cihazda saklanır; hiçbir yere gönderilmez.
const font = { fontFamily: "'Nunito', 'Noto Sans', sans-serif" };
const ink = '#24364A';
const SIMGELER = ['⭐', '🌙', '🌷', '🐝', '🦋', '🐢', '🌈', '🍀', '🐳', '🦁', '🌻', '🚀'];
const RENKLER = ['#4A90D9', '#FF6B8A', '#2D8A4E', '#9B59B6', '#F59E0B', '#14B8A6'];

export default function KidsWelcome({ onComplete }) {
  const { childProfiles, addChildProfile, setActiveChildProfile, setAppMode } = useAppMode();
  const real = useMemo(() => (childProfiles || []).filter((p) => p && p.name), [childProfiles]);
  const [step, setStep] = useState('kapi'); // kapi → (liste | yeni)
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [simge, setSimge] = useState(SIMGELER[0]);

  const openGate = () => {
    if (open) return;
    setOpen(true);
    try { sfx.levelUp(); } catch { /* ses yok */ }
    setTimeout(() => setStep(real.length ? 'liste' : 'yeni'), reducedMotion() ? 150 : 1300);
  };

  const pick = (p) => { try { sfx.claim(); } catch { /* yok */ } setActiveChildProfile(p); onComplete(); };

  const create = () => {
    const n = name.trim();
    if (!n) return;
    const profile = { name: n.slice(0, 20), avatar: simge, color: RENKLER[(real.length) % RENKLER.length] };
    const saved = addChildProfile(profile);
    pick(saved);
  };

  const big = { minHeight: 62, borderRadius: 31, fontSize: 21, fontWeight: 900, color: '#fff', border: 'none', cursor: 'pointer' };

  return (
    <div data-testid="kids-welcome" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #BDE6FF 0%, #E7F6FF 45%, #F4FBEF 100%)', color: ink, position: 'relative', overflow: 'hidden', ...font }}>
      {/* bulutlar */}
      {[0, 1, 2].map((i) => (
        <motion.div key={i} aria-hidden animate={{ x: [0, 18, 0] }} transition={{ duration: 7 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: `${8 + i * 9}%`, left: `${[8, 62, 30][i]}%`, width: 90 + i * 20, height: 34, borderRadius: 30, background: '#FFFFFF', opacity: 0.9,
            boxShadow: '24px -10px 0 6px #FFFFFF, 52px 2px 0 0 #FFFFFF' }} />
      ))}

      <button type="button" onClick={() => setAppMode(null)} aria-label="Geri"
        style={{ position: 'absolute', top: 16, left: 14, zIndex: 5, width: 46, height: 46, borderRadius: 23, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 0 #D6E4EE' }}>
        <ChevronLeft size={24} color={ink} />
      </button>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 480, margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '70px 20px 30px' }}>
        <AnimatePresence mode="wait">
          {step === 'kapi' && (
            <motion.div key="kapi" exit={{ opacity: 0, scale: 1.15 }} transition={{ duration: 0.35 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: '100%' }}>
              <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ margin: 0, fontSize: 32, fontWeight: 900, textAlign: 'center', color: '#2D8A4E' }}>
                Bahçeye hoş geldin!
              </motion.h1>
              <motion.button type="button" onClick={openGate} data-testid="bahce-kapi" aria-label="Bahçe kapısını aç"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, rotate: open ? 0 : [0, -1.2, 1.2, 0] }}
                transition={{ rotate: { duration: 1.6, repeat: open ? 0 : Infinity, repeatDelay: 1.4 } }}
                style={{ width: 'min(64vw, 250px)', aspectRatio: '0.72', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}>
                <KemerliKapi open={open} tone="bahce" duration={reducedMotion() ? 0.15 : 1.1} />
              </motion.button>
              <motion.p animate={{ scale: open ? 1 : [1, 1.06, 1] }} transition={{ duration: 1.4, repeat: open ? 0 : Infinity }}
                style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#FF8A3D' }}>
                {open ? 'Haydi içeri!' : 'Kapıya dokun'}
              </motion.p>
            </motion.div>
          )}

          {step === 'liste' && (
            <motion.div key="liste" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%', textAlign: 'center' }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 18px' }}>Kim geldi?</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14 }}>
                {real.map((p, i) => (
                  <motion.button type="button" key={p.id || i} onClick={() => pick(p)} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06, type: 'spring' }} whileTap={{ scale: 0.94 }}
                    style={{ padding: '18px 10px', borderRadius: 26, background: '#FFFFFF', border: 'none', boxShadow: `0 6px 0 ${p.color || '#D6E4EE'}55`, cursor: 'pointer' }}>
                    <div style={{ width: 70, height: 70, margin: '0 auto 8px', borderRadius: 35, background: `${p.color || '#4A90D9'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38 }}>{p.avatar || '⭐'}</div>
                    <div style={{ fontSize: 18, fontWeight: 900 }}>{p.name}</div>
                  </motion.button>
                ))}
                <motion.button type="button" onClick={() => setStep('yeni')} whileTap={{ scale: 0.94 }}
                  style={{ padding: '18px 10px', borderRadius: 26, background: 'rgba(255,255,255,0.6)', border: '3px dashed #9CC9E8', cursor: 'pointer' }}>
                  <div style={{ width: 70, height: 70, margin: '0 auto 8px', borderRadius: 35, background: '#E3F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={34} color="#4A90D9" /></div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#4A90D9' }}>Yeni</div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'yeni' && (
            <motion.div key="yeni" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <motion.div key={simge} initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.55 }}
                style={{ width: 110, height: 110, borderRadius: 55, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, boxShadow: '0 10px 0 #D6E4EE' }}>
                {simge}
              </motion.div>
              <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Senin adın ne?</h2>
              <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && create()} maxLength={20} autoFocus
                placeholder="Adını yaz" aria-label="Adın" data-testid="kids-name"
                style={{ width: '100%', maxWidth: 320, minHeight: 60, borderRadius: 30, border: '3px solid #CFE4F2', background: '#FFFFFF', textAlign: 'center', fontSize: 22, fontWeight: 900, color: ink, outline: 'none' }} />
              <p style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 800, color: '#5B6B73' }}>Bir simge seç</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, width: '100%', maxWidth: 360 }}>
                {SIMGELER.map((s) => (
                  <button type="button" key={s} onClick={() => { setSimge(s); try { sfx.tick(); } catch { /* yok */ } }} aria-pressed={simge === s}
                    style={{ aspectRatio: '1', borderRadius: 18, fontSize: 26, background: simge === s ? '#FFF3C4' : '#FFFFFF', border: `3px solid ${simge === s ? '#F2B33D' : 'transparent'}`, cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
              <motion.button type="button" onClick={create} disabled={!name.trim()} whileTap={{ scale: 0.95 }} data-testid="kids-start"
                style={{ ...big, marginTop: 6, padding: '0 44px', background: name.trim() ? '#2D8A4E' : '#A7C7B2', boxShadow: name.trim() ? '0 8px 0 #1B6B3A' : 'none' }}>
                Başlayalım!
              </motion.button>
              {real.length > 0 && (
                <button type="button" onClick={() => setStep('liste')} style={{ fontWeight: 800, color: '#4A90D9', minHeight: 44 }}>Profillere dön</button>
              )}
              <p style={{ fontSize: 12, color: '#7A8A93', margin: 0, textAlign: 'center' }}>Adın yalnız bu cihazda saklanır.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
