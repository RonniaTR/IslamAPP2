import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { CITY_COORDS } from '../../data/cityCoords';
import { addStars, bump } from '../../services/kidsFamily';
import sfx from '../../services/sfx';
import Confetti from '../games/Confetti';

// 🧭 KIBLE AVCISI — çocuklar için kıble pusulası.
// Telefon çevrildikçe seccade döner. Seccadenin ucu üstteki YEŞİL BÖLGEYE girince seccade yeşile döner,
// tam ortaya oturur ve orada DURUR (küçük titremelerle kaçmaz; ancak telefon belirgin çevrilince çözülür).
// Konum: kayıtlı koordinat → seçili il → Ankara. Pusulası olmayan cihazda parmakla çevirerek oynanır.
const KAABA = { lat: 21.4225, lon: 39.8262 };
const LOCK_IN = 8;    // bu açının içine girince kilitlenir
const LOCK_OUT = 20;  // bu açının dışına çıkınca çözülür
const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;

function qiblaBearing({ lat, lon }) {
  const φ1 = rad(lat); const φ2 = rad(KAABA.lat); const Δλ = rad(KAABA.lon - lon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}
function myPlace() {
  try { const c = JSON.parse(localStorage.getItem('islamapp_coords')); if (c && c.lat) return { lat: c.lat, lon: c.lon, name: localStorage.getItem('islamapp_city') || 'Konumun' }; } catch { /* yok */ }
  try { const city = localStorage.getItem('islamapp_city') || localStorage.getItem('prayer_city'); const p = city && CITY_COORDS[city]; if (p) return { lat: p[0] ?? p.lat, lon: p[1] ?? p.lon, name: city }; } catch { /* yok */ }
  return { lat: 39.9334, lon: 32.8597, name: 'Ankara' };
}
const signed = (a) => ((a % 360) + 540) % 360 - 180;

function Seccade({ green }) {
  const c = green ? '#2D8A4E' : '#C0563F'; const c2 = green ? '#5DBB63' : '#E07A5F';
  return (
    <svg width="120" height="190" viewBox="0 0 120 190" aria-hidden>
      <rect x="6" y="6" width="108" height="178" rx="10" fill={c} />
      <rect x="14" y="14" width="92" height="162" rx="6" fill="none" stroke="#FFD93D" strokeWidth="3" strokeDasharray="6 4" />
      <path d="M26 70 V40 Q60 8 94 40 V70 Z" fill={c2} stroke="#FFD93D" strokeWidth="3" />
      <circle cx="60" cy="40" r="6" fill="#FFD93D" />
      {[0, 1, 2].map((k) => <rect key={k} x="30" y={100 + k * 22} width="60" height="10" rx="5" fill={c2} />)}
      {Array.from({ length: 9 }, (_, k) => <rect key={k} x={10 + k * 12} y="184" width="4" height="6" fill="#FFD93D" />)}
    </svg>
  );
}

export default function KidsKible() {
  const navigate = useNavigate();
  const [place] = useState(myPlace);
  const qibla = qiblaBearing(place);
  const [heading, setHeading] = useState(null);
  const [mode, setMode] = useState('bekliyor'); // bekliyor | sensor | parmak
  const [locked, setLocked] = useState(false);
  const [party, setParty] = useState(0);
  const smooth = useRef(null);
  const drag = useRef(null);
  const rewarded = useRef(false);

  const onOrient = useCallback((e) => {
    let h = null;
    if (typeof e.webkitCompassHeading === 'number') h = e.webkitCompassHeading;
    else if (e.absolute && typeof e.alpha === 'number') h = (360 - e.alpha) % 360;
    if (h == null) return;
    const angle = (window.screen && window.screen.orientation && window.screen.orientation.angle) || 0;
    h = (h + angle) % 360;
    // dairesel yumuşatma: titreşim azaltılır
    smooth.current = smooth.current == null ? h : (smooth.current + signed(h - smooth.current) * 0.18 + 360) % 360;
    setHeading(smooth.current);
    setMode('sensor');
  }, []);

  const start = async () => {
    try {
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        const r = await DOE.requestPermission();
        if (r !== 'granted') { setMode('parmak'); setHeading(0); return; }
      }
    } catch { /* izin sorulamadı */ }
    window.addEventListener('deviceorientationabsolute', onOrient, true);
    window.addEventListener('deviceorientation', onOrient, true);
    setTimeout(() => { if (smooth.current == null) { setMode('parmak'); setHeading(0); } }, 1800);
  };
  useEffect(() => () => {
    window.removeEventListener('deviceorientationabsolute', onOrient, true);
    window.removeEventListener('deviceorientation', onOrient, true);
  }, [onOrient]);

  const diff = heading == null ? 180 : signed(qibla - heading);
  useEffect(() => {
    if (heading == null) return;
    const a = Math.abs(diff);
    if (!locked && a < LOCK_IN) {
      setLocked(true); setParty((p) => p + 1); sfx.crown();
      try { navigator.vibrate && navigator.vibrate([40, 30, 90]); } catch { /* yok */ }
      if (!rewarded.current) { rewarded.current = true; addStars(3); bump('kible'); }
    } else if (locked && a > LOCK_OUT) setLocked(false);
  }, [diff, heading, locked]);

  // parmakla çevirme (pusulasız cihaz)
  const onDown = (e) => { if (mode !== 'parmak') return; drag.current = { x: e.clientX, h: heading || 0 }; };
  const onMove = (e) => { if (!drag.current) return; setHeading(((drag.current.h - (e.clientX - drag.current.x) * 0.6) % 360 + 360) % 360); };
  const onUp = () => { drag.current = null; };

  const rugAngle = locked ? 0 : diff;
  const font = { fontFamily: "'Nunito', 'Noto Sans', sans-serif" };
  const bg = locked ? 'linear-gradient(180deg, #C9F2D2 0%, #F3FAF1 70%)' : 'linear-gradient(180deg, #CDEBFF 0%, #F3FAF1 70%)';

  return (
    <div style={{ minHeight: '100vh', background: bg, color: '#24364A', paddingBottom: 110, transition: 'background .6s', ...font }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
      {party > 0 && locked && <Confetti key={party} count={40} />}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '16px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={() => navigate(-1)} aria-label="Geri" style={{ width: 46, height: 46, borderRadius: 23, background: '#FFFFFF', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={26} color="#24364A" /></button>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Kıble Avcısı</h1>
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#5B6B73', margin: '8px 2px 0' }}>{place.name} · Kâbe {Math.round(qibla)}° yönünde</p>

        {/* KADRAN */}
        <div style={{ position: 'relative', width: 300, height: 300, margin: '26px auto 10px' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 150, background: '#FFFFFF', boxShadow: '0 18px 36px -16px rgba(36,54,74,0.35)' }} />
          {/* yeşil bölge */}
          <svg width="300" height="300" viewBox="0 0 300 300" style={{ position: 'absolute', inset: 0 }} aria-hidden>
            <path d={`M150 150 L${150 + 140 * Math.sin(rad(-LOCK_IN * 1.6))} ${150 - 140 * Math.cos(rad(-LOCK_IN * 1.6))} A140 140 0 0 1 ${150 + 140 * Math.sin(rad(LOCK_IN * 1.6))} ${150 - 140 * Math.cos(rad(LOCK_IN * 1.6))} Z`} fill={locked ? '#5DBB63' : '#BDE7C3'} opacity={locked ? 0.9 : 0.7} />
            {Array.from({ length: 36 }, (_, k) => <rect key={k} x="148.5" y="12" width="3" height={k % 9 === 0 ? 14 : 7} rx="1.5" fill="#D6E0E6" transform={`rotate(${k * 10} 150 150)`} />)}
          </svg>
          {/* Kâbe: yeşil bölgenin tepesinde */}
          <motion.div animate={locked ? { scale: [1, 1.25, 1], y: [0, -4, 0] } : { scale: 1 }} transition={{ duration: 1.2, repeat: locked ? Infinity : 0 }}
            style={{ position: 'absolute', top: -22, left: '50%', marginLeft: -22, width: 44, height: 44, borderRadius: 10, background: '#20242C', boxShadow: locked ? '0 0 0 6px #5DBB63, 0 0 30px 8px rgba(93,187,99,0.8)' : '0 4px 10px rgba(0,0,0,0.25)' }}>
            <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 6, background: '#D9B44A' }} />
          </motion.div>
          {/* seccade */}
          <motion.div animate={{ rotate: rugAngle, scale: locked ? 1.06 : 1 }} transition={locked ? { type: 'spring', stiffness: 260, damping: 14 } : { type: 'spring', stiffness: 120, damping: 20 }}
            style={{ position: 'absolute', left: 90, top: 55, width: 120, height: 190, transformOrigin: '60px 95px' }}>
            <Seccade green={locked} />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'bekliyor' ? (
            <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 800 }}>Telefonunu düz tut ve pusulayı başlat. Seccadeyi yeşil bölgeye getirmeye çalış!</p>
              <button type="button" onClick={start} style={{ minHeight: 62, padding: '0 34px', borderRadius: 31, background: '#2D8A4E', color: '#fff', fontSize: 21, fontWeight: 900, boxShadow: '0 8px 0 #1B6B3A', border: 'none' }}>Pusulayı başlat</button>
            </motion.div>
          ) : (
            <motion.div key={locked ? 'ok' : 'ara'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
              {locked ? (
                <>
                  <p style={{ fontSize: 28, fontWeight: 900, color: '#2D8A4E', margin: '6px 0 4px' }}>Buldun! Kıble burası 🎉</p>
                  <p style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Namaz kılarken bu yöne döneriz.</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 22, fontWeight: 900, margin: '6px 0 4px' }}>{diff > 0 ? 'Biraz sağa dön ➡️' : '⬅️ Biraz sola dön'}</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#5B6B73', margin: 0 }}>{mode === 'parmak' ? 'Bu cihazda pusula yok; parmağınla sağa sola kaydırarak dene.' : 'Seccade yeşil bölgeye girince yeşile döner.'}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <p style={{ fontSize: 12, color: '#8A99A3', textAlign: 'center', marginTop: 20 }}>Telefonun pusulası mıknatıs ve metal eşyalardan etkilenebilir. Kesin yön için büyüklerine sor.</p>
      </div>
    </div>
  );
}
