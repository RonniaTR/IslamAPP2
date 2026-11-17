import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star } from 'lucide-react';
import KidsScene from '../../components/kids/KidsScene';
import { DERSLER, NEDIR, YAPMAYIZ, HAZIRLIK, VAKITLER } from '../../data/kidsNamaz';
import { AbdestDersi, KilinisDersi, NamazSinavi, bigBtn } from './NamazDersleri';
import { addStars, loadKidsProgress, markKids } from '../../services/kidsFamily';
import sfx from '../../services/sfx';

// 🕌 NAMAZ YOLU — çocuklar için namaz ve abdest. Harita üzerinde 8 durak; her durak bir ders.
// İçerik: data/kidsNamaz.js (Diyanet ilmihali, Hanefî; temel bilgiler). İlerleme cihazda tutulur.
const ink = '#24364A';
const font = { fontFamily: "'Nunito', 'Noto Sans', sans-serif" };

function Kartlar({ list, onDone, cta = 'Öğrendim ⭐' }) {
  const [n, setN] = useState(1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {list.slice(0, n).map((c, k) => (
        <motion.div key={k} initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }}
          style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#FFFFFF', borderRadius: 24, padding: 16, boxShadow: '0 6px 0 #E8EEE9' }}>
          <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15, type: 'spring', bounce: 0.6 }} style={{ fontSize: 38, lineHeight: 1 }}>{c.icon}</motion.span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 19, lineHeight: 1.5, fontWeight: 700 }}>{c.text}</span>
            {c.src && <span style={{ display: 'block', fontSize: 12, color: '#8A7A55', marginTop: 6 }}>({c.src})</span>}
          </span>
        </motion.div>
      ))}
      {n < list.length
        ? <button type="button" onClick={() => { sfx.tick(); setN(n + 1); }} style={{ ...bigBtn('#4A90D9', '#2F6DB0'), alignSelf: 'center' }}>Devam →</button>
        : <button type="button" onClick={onDone} style={{ ...bigBtn('#2D8A4E', '#1B6B3A'), alignSelf: 'center' }}>{cta}</button>}
    </div>
  );
}

function Hazirlik({ onDone }) {
  const [on, setOn] = useState([]);
  const all = on.length === HAZIRLIK.length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 17, fontWeight: 700, margin: '0 0 4px', textAlign: 'center' }}>Namaza başlamadan önce bunlara dikkat ederiz. Her birine dokunup işaretle!</p>
      {HAZIRLIK.map((h, k) => {
        const ok = on.includes(k);
        return (
          <motion.button key={k} type="button" onClick={() => { if (!ok) { sfx.correct(); setOn([...on, k]); } }} whileTap={{ scale: 0.96 }}
            animate={ok ? { background: '#E3F5E6' } : { background: '#FFFFFF' }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 64, borderRadius: 22, padding: '10px 14px', border: `3px solid ${ok ? '#2D8A4E' : '#E3E8EE'}`, textAlign: 'start', color: ink }}>
            <span style={{ fontSize: 30 }}>{h.icon}</span>
            <span style={{ flex: 1, fontSize: 17, fontWeight: 800 }}>{h.text}</span>
            <motion.span animate={{ scale: ok ? [0, 1.3, 1] : 1 }} style={{ width: 32, height: 32, borderRadius: 16, background: ok ? '#2D8A4E' : '#EEF2F5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{ok ? '✓' : ''}</motion.span>
          </motion.button>
        );
      })}
      {all && <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} type="button" onClick={onDone} style={{ ...bigBtn('#2D8A4E', '#1B6B3A'), alignSelf: 'center', marginTop: 6 }}>Hazırım! ⭐</motion.button>}
    </div>
  );
}

function Vakitler({ onDone }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {VAKITLER.map((v, k) => {
        const dark = v.id === 'yatsi' || v.id === 'aksam';
        return (
          <motion.div key={v.id} initial={{ opacity: 0, x: k % 2 ? 40 : -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.12, type: 'spring' }}
            style={{ borderRadius: 26, padding: '16px 16px 14px', background: `linear-gradient(135deg, ${v.sky[0]}, ${v.sky[1]})`, color: dark ? '#FFFFFF' : ink }}>
            <p style={{ fontSize: 24, fontWeight: 900, margin: '0 0 10px' }}>{v.ad} namazı</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {v.parca.map(([ad, n]) => (
                <span key={ad} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 16, background: dark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.75)', fontWeight: 800, fontSize: 15 }}>
                  {ad} <b style={{ fontSize: 19 }}>{n}</b>
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
      <p style={{ fontSize: 14, color: '#7F8C8D', margin: 0, textAlign: 'center' }}>Rakamlar rekât sayısıdır. Farz rekâtlar Allah'ın emridir; sünnetler Peygamberimizin kıldığı rekâtlardır.</p>
      <button type="button" onClick={onDone} style={{ ...bigBtn('#2D8A4E', '#1B6B3A'), alignSelf: 'center' }}>Öğrendim ⭐</button>
    </div>
  );
}

function Yapmayiz({ onDone }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ fontSize: 21, fontWeight: 900, margin: 0 }}>Namaz kılarken…</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        {YAPMAYIZ.bozan.map((b, k) => (
          <motion.div key={k} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k * 0.1, type: 'spring' }}
            style={{ position: 'relative', background: '#FFFFFF', borderRadius: 22, padding: '16px 10px', textAlign: 'center', boxShadow: '0 6px 0 #F3E3E6' }}>
            <span style={{ fontSize: 36 }}>{b.icon}</span>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + k * 0.1 }} style={{ position: 'absolute', top: 8, insetInlineEnd: 10, width: 24, height: 24, borderRadius: 12, background: '#FF6B8A', color: '#fff', fontWeight: 900, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</motion.span>
            <p style={{ fontSize: 16, fontWeight: 800, margin: '8px 0 0' }}>{b.text}</p>
          </motion.div>
        ))}
      </div>
      <h3 style={{ fontSize: 21, fontWeight: 900, margin: '10px 0 0' }}>Namaz ne değildir?</h3>
      <Kartlar list={YAPMAYIZ.degil} onDone={onDone} />
    </div>
  );
}

export default function KidsNamaz() {
  const navigate = useNavigate();
  const [ders, setDers] = useState(null);
  const [prog, setProg] = useState(loadKidsProgress);
  const done = prog.namaz || [];
  const d = DERSLER.find((x) => x.id === ders);
  const finish = (id, extra = 0) => { sfx.levelUp(); if (!done.includes(id)) { addStars(5 + extra); setProg(markKids('namaz', id)); } setDers(null); };
  const open = (x) => { if (x.route) { navigate(x.route); return; } sfx.claim(); setDers(x.id); };

  return (
    <div style={{ minHeight: '100vh', background: '#F3FAF1', color: ink, paddingBottom: 110, ...font }}>
      <div style={{ position: 'relative' }}>
        <KidsScene id={d ? d.scene || 'cami' : 'cami'} height={180} />
        <button type="button" onClick={() => (d ? setDers(null) : navigate('/kids'))} aria-label="Geri" style={{ position: 'absolute', top: 16, insetInlineStart: 16, width: 46, height: 46, borderRadius: 23, background: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
          <ChevronLeft size={26} color={ink} />
        </button>
        <h1 style={{ position: 'absolute', insetInlineStart: 20, bottom: 14, margin: 0, fontSize: 30, fontWeight: 900, color: '#1B4D2E', textShadow: '0 2px 0 #FFFFFF, 0 0 12px #FFFFFF' }}>{d ? d.title : 'Namaz Yolu'}</h1>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '18px 16px 0' }}>
        <AnimatePresence mode="wait">
          {!d ? (
            <motion.div key="harita" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'relative' }}>
              <p style={{ fontSize: 17, fontWeight: 800, margin: '0 0 6px', color: '#5B6B73' }}>{done.length} / {DERSLER.length - 1} durak tamam</p>
              <svg viewBox="0 0 320 860" width="100%" style={{ position: 'absolute', top: 30, insetInlineStart: 0, zIndex: 0 }} aria-hidden>
                <path d="M80 40 C 260 80, 260 140, 240 160 S 60 220, 80 260 S 260 340, 240 380 S 60 440, 80 480 S 260 560, 240 600 S 60 660, 80 700 S 260 780, 240 820" fill="none" stroke="#D7E8D3" strokeWidth="18" strokeLinecap="round" />
                <path d="M80 40 C 260 80, 260 140, 240 160 S 60 220, 80 260 S 260 340, 240 380 S 60 440, 80 480 S 260 560, 240 600 S 60 660, 80 700 S 260 780, 240 820" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 10 }}>
                {DERSLER.map((x, k) => {
                  const ok = done.includes(x.id);
                  return (
                    <motion.button key={x.id} type="button" onClick={() => open(x)} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k * 0.08, type: 'spring', bounce: 0.5 }} whileTap={{ scale: 0.92 }}
                      style={{ alignSelf: k % 2 ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: k % 2 ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', maxWidth: '86%' }}>
                      <motion.span animate={!ok ? { y: [0, -5, 0] } : {}} transition={{ duration: 2, repeat: Infinity, delay: k * 0.2 }}
                        style={{ position: 'relative', width: 78, height: 78, flexShrink: 0, borderRadius: 39, background: x.color, boxShadow: `0 8px 0 ${x.color}99`, border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 30, fontWeight: 900 }}>
                        {k + 1}
                        {ok && <span style={{ position: 'absolute', top: -8, insetInlineEnd: -6 }}><Star size={28} fill="#FFD93D" color="#F2B33D" /></span>}
                      </motion.span>
                      <span style={{ background: '#FFFFFF', borderRadius: 18, padding: '10px 14px', fontSize: 17, fontWeight: 900, textAlign: k % 2 ? 'end' : 'start', boxShadow: '0 4px 0 #E3EBE2' }}>{x.title}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {d.id === 'nedir' && <Kartlar list={NEDIR} onDone={() => finish('nedir')} />}
              {d.id === 'yapmayiz' && <Yapmayiz onDone={() => finish('yapmayiz')} />}
              {d.id === 'hazirlik' && <Hazirlik onDone={() => finish('hazirlik')} />}
              {d.id === 'abdest' && <AbdestDersi onDone={() => finish('abdest', 5)} />}
              {d.id === 'kilinis' && <KilinisDersi onDone={() => finish('kilinis', 5)} />}
              {d.id === 'vakitler' && <Vakitler onDone={() => finish('vakitler')} />}
              {d.id === 'sinav' && <NamazSinavi onDone={(s) => finish('sinav', s)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
