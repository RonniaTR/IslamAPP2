import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, MapPin, Loader2, RotateCcw, Info, Smartphone, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

/* ── Constants ── */
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const ALIGN_THRESHOLD = 6;
const NEAR_THRESHOLD = 25;
const STABLE_SAMPLES = 8;        // must hold alignment this many ticks
const SMOOTHING_FACTOR = 0.15;   // low-pass filter coefficient
const RENDER_HZ = 30;            // UI update frequency (not 60fps to save battery)
const MIN_COMPASS_READINGS = 5;  // must receive this many before trusting compass

function toRad(d) { return (d * Math.PI) / 180; }

function calculateQibla(lat, lng) {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const dLambda = toRad(KAABA_LNG - lng);
  const y = Math.sin(dLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLambda);
  let q = (Math.atan2(y, x) * 180) / Math.PI;
  return (q + 360) % 360;
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Shortest signed angular difference in degrees [-180, 180] */
function angleDiff(a, b) {
  return ((a - b + 540) % 360) - 180;
}

/** Low-pass filter for circular angle */
function smoothAngle(prev, raw, alpha) {
  const diff = angleDiff(raw, prev);
  return (prev + diff * alpha + 360) % 360;
}

/* ── SVG Components ── */

function PrayerMatSVG({ aligned, nearAligned, theme }) {
  const matColor = aligned ? '#1B6B3A' : nearAligned ? '#1A5C33' : theme.surface;
  const bc = aligned ? '#4ADE80' : nearAligned ? '#D4AF37' : 'rgba(212,175,55,0.18)';
  const fc = aligned ? '#4ADE80' : '#D4AF37';

  return (
    <svg viewBox="0 0 200 320" className="w-full h-full" style={{ filter: aligned ? 'drop-shadow(0 0 25px rgba(74,222,128,0.35))' : nearAligned ? 'drop-shadow(0 0 15px rgba(212,175,55,0.18))' : 'none', transition: 'filter 0.6s ease' }}>
      <defs>
        <linearGradient id="mG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={matColor} stopOpacity="0.96" />
          <stop offset="100%" stopColor={matColor} stopOpacity="0.88" />
        </linearGradient>
        <linearGradient id="miG" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={aligned ? '#4ADE80' : '#D4AF37'} stopOpacity="0.45" />
          <stop offset="100%" stopColor={aligned ? '#4ADE80' : '#D4AF37'} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect x="10" y="20" width="180" height="280" rx="8" fill="url(#mG)" stroke={bc} strokeWidth={aligned ? 2.5 : 1.2} />
      <rect x="18" y="28" width="164" height="264" rx="5" fill="none" stroke={bc} strokeWidth="0.6" opacity="0.5" />
      <path d="M55,28 Q55,68 100,84 Q145,68 145,28" fill="url(#miG)" stroke={bc} strokeWidth="0.8" opacity="0.8" />
      <path d="M68,28 Q68,60 100,72 Q132,60 132,28" fill="none" stroke={bc} strokeWidth="0.4" opacity="0.4" />
      <text x="100" y="56" textAnchor="middle" fontSize="24" opacity={aligned ? 1 : 0.55} style={{ transition: 'opacity 0.4s' }}>🕋</text>
      {/* Center medallion */}
      <circle cx="100" cy="175" r="32" fill="none" stroke={bc} strokeWidth="0.5" opacity="0.25" />
      <circle cx="100" cy="175" r="20" fill="none" stroke={bc} strokeWidth="0.4" opacity="0.2" />
      {[0,45,90,135].map(a=>(
        <line key={a} x1={100+22*Math.cos(a*Math.PI/180)} y1={175+22*Math.sin(a*Math.PI/180)} x2={100-22*Math.cos(a*Math.PI/180)} y2={175-22*Math.sin(a*Math.PI/180)} stroke={bc} strokeWidth="0.35" opacity="0.2"/>
      ))}
      {/* Corner ornaments */}
      {[[28,38],[172,38],[28,282],[172,282]].map(([cx,cy],i)=>(
        <g key={i} opacity="0.25"><circle cx={cx} cy={cy} r="7" fill="none" stroke={bc} strokeWidth="0.5"/><circle cx={cx} cy={cy} r="3.5" fill="none" stroke={bc} strokeWidth="0.35"/></g>
      ))}
      {/* Fringes */}
      {Array.from({length:17},(_,i)=>(<line key={`t${i}`} x1={18+i*10} y1="20" x2={18+i*10} y2="11" stroke={fc} strokeWidth="1.3" strokeLinecap="round" opacity={aligned?0.85:0.3}/>))}
      {Array.from({length:17},(_,i)=>(<line key={`b${i}`} x1={18+i*10} y1="300" x2={18+i*10} y2="309" stroke={fc} strokeWidth="1.3" strokeLinecap="round" opacity={aligned?0.85:0.3}/>))}
      {(aligned||nearAligned)&&<rect x="10" y="20" width="180" height="280" rx="8" fill={aligned?'rgba(74,222,128,0.06)':'rgba(212,175,55,0.04)'}/>}
    </svg>
  );
}

function QiblaArrow({ aligned }) {
  return (
    <svg viewBox="0 0 40 50" className="w-10 h-12">
      <defs>
        <linearGradient id="aG" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={aligned ? '#4ADE80' : '#D4AF37'} />
          <stop offset="100%" stopColor={aligned ? '#16A34A' : '#92710C'} />
        </linearGradient>
      </defs>
      <path d="M20,0 L30,20 L23,16 L23,46 L17,46 L17,16 L10,20 Z" fill="url(#aG)" />
    </svg>
  );
}

function AlignParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 2.5,
      dur: 2.5 + Math.random() * 2,
      size: 2 + Math.random() * 3,
    })), []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full" style={{ width: p.size, height: p.size, left: `${p.x}%`, bottom: '-4%', background: 'radial-gradient(circle, #4ADE80, transparent)' }}
          animate={{ y: [0, -350 - Math.random() * 200], opacity: [0, 0.8, 0], scale: [0.4, 1, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeOut' }} />
      ))}
    </div>
  );
}

function CompassRingSVG({ heading, qiblaAngle, aligned, near, theme, compassReady }) {
  const size = 300;
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  const dirs = [
    { l: 'K', a: 0, c: '#ef4444' }, { l: 'KD', a: 45 }, { l: 'D', a: 90 }, { l: 'GD', a: 135 },
    { l: 'G', a: 180 }, { l: 'GB', a: 225 }, { l: 'B', a: 270 }, { l: 'KB', a: 315 },
  ];

  const qDiff = qiblaAngle !== null ? angleDiff(qiblaAngle, heading) : null;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      <defs>
        <linearGradient id="qGlow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={aligned ? '#4ADE80' : '#D4AF37'} stopOpacity="0.9" />
          <stop offset="100%" stopColor={aligned ? '#16A34A' : '#92710C'} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={aligned ? 'rgba(74,222,128,0.25)' : 'rgba(212,175,55,0.1)'} strokeWidth="2" style={{ transition: 'stroke 0.5s' }} />
      <circle cx={cx} cy={cy} r={r-12} fill="none" stroke={aligned ? 'rgba(74,222,128,0.1)' : 'rgba(212,175,55,0.05)'} strokeWidth="0.5" />

      {/* Ticks + directions — rotate with compass */}
      <g transform={`rotate(${-heading} ${cx} ${cy})`} style={{ transition: 'transform 0.12s linear' }}>
        {Array.from({ length: 72 }, (_, i) => {
          const a = i * 5;
          const major = a % 30 === 0;
          const medium = a % 15 === 0;
          const len = major ? 12 : medium ? 7 : 4;
          const rad = (a * Math.PI) / 180;
          const x1 = cx + (r - 2) * Math.sin(rad), y1 = cy - (r - 2) * Math.cos(rad);
          const x2 = cx + (r - 2 - len) * Math.sin(rad), y2 = cy - (r - 2 - len) * Math.cos(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={major ? (aligned ? '#4ADE80' : theme.gold) : 'rgba(212,175,55,0.18)'} strokeWidth={major ? 1.5 : 0.7} />;
        })}
        {dirs.map(d => {
          const rad = (d.a * Math.PI) / 180;
          const dist = r - 28;
          const x = cx + dist * Math.sin(rad), y = cy - dist * Math.cos(rad);
          return (
            <text key={d.l} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={d.l.length === 1 ? 12 : 8} fontWeight="bold" fill={d.c || theme.textSecondary}
              transform={`rotate(${heading} ${x} ${y})`}>{d.l}</text>
          );
        })}
      </g>

      {/* Qibla marker on ring — only if compass data received */}
      {compassReady && qDiff !== null && (
        <g transform={`rotate(${qDiff} ${cx} ${cy})`} style={{ transition: 'transform 0.12s linear' }}>
          {/* Arc glow */}
          <circle cx={cx} cy={cy} r={r - 1} fill="none" stroke="url(#qGlow)" strokeWidth="3"
            strokeDasharray={`${(NEAR_THRESHOLD / 180) * Math.PI * r} ${2 * Math.PI * r}`}
            strokeDashoffset={`${(NEAR_THRESHOLD / 360) * Math.PI * r}`}
            opacity={near ? 0.5 : 0.15} style={{ transition: 'opacity 0.4s' }} />
          {/* Arrow indicator */}
          <polygon points={`${cx},${cy - r + 2} ${cx - 8},${cy - r + 18} ${cx + 8},${cy - r + 18}`} fill="url(#qGlow)" />
          <text x={cx} y={cy - r + 34} textAnchor="middle" fontSize="14" opacity={aligned ? 1 : 0.6} style={{ transition: 'opacity 0.4s' }}>🕋</text>
        </g>
      )}

      {/* Top marker (device heading indicator) */}
      <polygon points={`${cx},4 ${cx - 5},14 ${cx + 5},14`} fill={aligned ? '#4ADE80' : theme.gold} opacity="0.8" />
    </svg>
  );
}

/* Accuracy arc — shows how close to alignment */
function AccuracyArc({ diff, aligned, near }) {
  const pct = Math.max(0, 100 - (Math.abs(diff) / 180) * 100);
  const color = aligned ? '#4ADE80' : pct > 85 ? '#D4AF37' : pct > 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className="w-full max-w-[220px] mx-auto mt-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-[#A8B5A0]">Hizalama Doğruluğu</span>
        <span className="text-[10px] font-bold" style={{ color }}>{Math.round(pct)}%</span>
      </div>
      <div className="h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div className="h-full rounded-full" style={{ background: color }} animate={{ width: `${pct}%` }} transition={{ duration: 0.25 }} />
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function QiblaPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Core state
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Compass state
  const [displayHeading, setDisplayHeading] = useState(null); // null = no compass data yet
  const [compassReady, setCompassReady] = useState(false);
  const [compassAccuracy, setCompassAccuracy] = useState(null);
  const [needsCalibration, setNeedsCalibration] = useState(false);
  const [needsIOSPerm, setNeedsIOSPerm] = useState(false);

  // Alignment state
  const [stableAligned, setStableAligned] = useState(false);
  const [lockedCount, setLockedCount] = useState(0);

  // UI state
  const [showInfo, setShowInfo] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Refs for animation loop
  const rawHeadingRef = useRef(null);
  const smoothedRef = useRef(null);
  const readingCountRef = useRef(0);
  const alignedTicksRef = useRef(0);
  const notAlignedTicksRef = useRef(0);
  const animFrameRef = useRef(null);
  const hasVibratedRef = useRef(false);
  const lastRenderRef = useRef(0);

  /* ── Geolocation ── */
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Konum servisi bu cihazda desteklenmiyor');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude, accuracy: pos.coords.accuracy });
        setQiblaAngle(calculateQibla(latitude, longitude));
        setLoading(false);
      },
      (err) => {
        setError(err.code === 1 ? 'Konum izni reddedildi' : err.code === 2 ? 'Konum alınamıyor' : 'Konum zaman aşımı');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  /* ── Compass / Device Orientation ── */
  useEffect(() => {
    let mounted = true;

    const handleOrientation = (e) => {
      if (!mounted) return;
      let h = null;

      // iOS
      if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
        h = e.webkitCompassHeading;
        if (e.webkitCompassAccuracy != null) setCompassAccuracy(e.webkitCompassAccuracy);
      }
      // Android / absolute orientation
      else if (e.absolute && e.alpha !== null) {
        h = (360 - e.alpha) % 360;
      }
      // Non-absolute (fallback, less reliable)
      else if (e.alpha !== null) {
        h = (360 - e.alpha) % 360;
        if (mounted && readingCountRef.current < 3) setNeedsCalibration(true);
      }

      if (h !== null && isFinite(h)) {
        rawHeadingRef.current = h;
        readingCountRef.current++;
      }
    };

    // Check for iOS permission requirement
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsIOSPerm(true);
    } else {
      // Android / desktop — just listen
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      mounted = false;
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  /* ── iOS permission request ── */
  const requestIOSPermission = useCallback(async () => {
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result === 'granted') {
        setNeedsIOSPerm(false);
        const handler = (e) => {
          let h = e.webkitCompassHeading;
          if (h !== undefined && h !== null && isFinite(h)) {
            rawHeadingRef.current = h;
            readingCountRef.current++;
          }
        };
        window.addEventListener('deviceorientation', handler, true);
      }
    } catch {}
  }, []);

  /* ── Animation loop: smooth heading + alignment detection ── */
  useEffect(() => {
    const tick = (ts) => {
      animFrameRef.current = requestAnimationFrame(tick);

      // Throttle UI updates
      if (ts - lastRenderRef.current < (1000 / RENDER_HZ)) return;
      lastRenderRef.current = ts;

      const raw = rawHeadingRef.current;
      if (raw === null) return; // no compass data at all

      // First reading? Initialize smoothed
      if (smoothedRef.current === null) {
        smoothedRef.current = raw;
      } else {
        smoothedRef.current = smoothAngle(smoothedRef.current, raw, SMOOTHING_FACTOR);
      }

      const heading = smoothedRef.current;
      const readyNow = readingCountRef.current >= MIN_COMPASS_READINGS;

      // Batch state updates
      setDisplayHeading(heading);
      if (readyNow && !compassReady) setCompassReady(true);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [compassReady]);

  /* ── Stable alignment detection ── */
  useEffect(() => {
    if (displayHeading === null || qiblaAngle === null || !compassReady) {
      alignedTicksRef.current = 0;
      notAlignedTicksRef.current = 0;
      return;
    }

    const diff = Math.abs(angleDiff(qiblaAngle, displayHeading));
    const instantAligned = diff <= ALIGN_THRESHOLD;

    if (instantAligned) {
      alignedTicksRef.current++;
      notAlignedTicksRef.current = 0;
      if (alignedTicksRef.current >= STABLE_SAMPLES && !stableAligned) {
        setStableAligned(true);
        setLockedCount(prev => prev + 1);
        if (!hasVibratedRef.current && navigator.vibrate) {
          navigator.vibrate([60, 40, 60, 40, 80]);
          hasVibratedRef.current = true;
        }
      }
    } else {
      notAlignedTicksRef.current++;
      alignedTicksRef.current = 0;
      if (notAlignedTicksRef.current >= STABLE_SAMPLES && stableAligned) {
        setStableAligned(false);
        hasVibratedRef.current = false;
      }
    }
  }, [displayHeading, qiblaAngle, compassReady, stableAligned]);

  // Derived
  const heading = displayHeading ?? 0;
  const diff = qiblaAngle !== null && displayHeading !== null ? angleDiff(qiblaAngle, displayHeading) : 180;
  const isNear = Math.abs(diff) <= NEAR_THRESHOLD;
  const distanceKm = location ? getDistanceKm(location.lat, location.lng, KAABA_LAT, KAABA_LNG) : null;

  // Calibration message
  const calibMsg = useMemo(() => {
    if (compassAccuracy !== null && compassAccuracy > 30) return 'Pusula hassasiyeti düşük — telefonunuzu 8 çizin';
    if (needsCalibration) return 'Pusula kalibrasyonu gerekebilir — 8 hareketi yapın';
    return null;
  }, [compassAccuracy, needsCalibration]);

  // Direction name
  const dirName = useMemo(() => {
    if (qiblaAngle === null) return '';
    const dirs = ['Kuzey', 'Kuzeydoğu', 'Doğu', 'Güneydoğu', 'Güney', 'Güneybatı', 'Batı', 'Kuzeybatı'];
    return dirs[Math.round(qiblaAngle / 45) % 8];
  }, [qiblaAngle]);

  // Share function
  const handleShare = useCallback(async () => {
    if (!location || !qiblaAngle) return;
    const text = `Kıble Yönü: ${Math.round(qiblaAngle)}° (${dirName}) — Konum: ${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E — Kabe'ye ${distanceKm ? Math.round(distanceKm).toLocaleString('tr-TR') + ' km' : ''}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Kıble Yönü', text }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(text); setShowShareToast(true); setTimeout(() => setShowShareToast(false), 2000); } catch {}
    }
  }, [location, qiblaAngle, dirName, distanceKm]);

  /* ── Status text & color ── */
  const statusColor = stableAligned ? '#4ADE80' : isNear ? theme.gold : theme.textSecondary;
  const statusText = !compassReady
    ? (displayHeading !== null ? 'Pusula hazırlanıyor...' : 'Pusula verisi bekleniyor...')
    : stableAligned
      ? '✓ Kıble Bulundu!'
      : isNear
        ? 'Yaklaşıyorsunuz...'
        : 'Kıbleyi arayın';

  return (
    <div className="animate-fade-in min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }} data-testid="qibla-page">

      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full -top-[180px] left-1/2 -translate-x-1/2"
          style={{ background: stableAligned ? 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)' : isNear ? 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(212,175,55,0.02) 0%, transparent 70%)', transition: 'background 0.8s' }} />
      </div>

      {/* Aligned particles */}
      <AnimatePresence>{stableAligned && <AlignParticles />}</AnimatePresence>

      {/* Share toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-medium"
            style={{ background: theme.gold, color: theme.bg }}>
            Kopyalandı!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-20 px-5 pt-10 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <ArrowLeft size={16} style={{ color: theme.cream }} />
            </button>
            <div>
              <h1 className="text-lg font-bold" style={{ color: theme.cream, fontFamily: 'Playfair Display, serif' }}>Kıble Pusulası</h1>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>
                {distanceKm ? `Kâbe'ye ${Math.round(distanceKm).toLocaleString('tr-TR')} km • ${dirName}` : 'Mekke yönünü bulun'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={handleShare} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <Share2 size={13} style={{ color: theme.textSecondary }} />
            </button>
            <button onClick={() => setShowInfo(v=>!v)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <Info size={14} style={{ color: theme.textSecondary }} />
            </button>
          </div>
        </div>
      </div>

      {/* Calibration banner */}
      <AnimatePresence>
        {calibMsg && compassReady && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mx-5 mb-2 px-3 py-2 rounded-lg flex items-center gap-2"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <RotateCcw size={12} className="text-amber-400 shrink-0" />
            <p className="text-[10px] text-amber-400">{calibMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mx-5 mb-2 rounded-xl overflow-hidden" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div className="p-4 space-y-2.5 text-xs" style={{ color: theme.textSecondary }}>
              <p className="font-semibold" style={{ color: theme.cream }}>Nasıl Kullanılır?</p>
              <p>📱 Telefonunuzu düz, yere paralel tutun</p>
              <p>🧭 Pusula üzerindeki ok + seccade Kâbe yönünü gösterir</p>
              <p>🟢 Yeşil yanınca kıbleye hizalandınız (titreşim verir)</p>
              <p>🔄 Pusula yanlışsa telefonunuzu havada 8 şeklinde çevirin</p>
              <p>📐 Manyetik sapma otomatik olarak hesaplanır</p>
              <p className="text-[10px] opacity-60 pt-1">Doğruluk: ±{ALIGN_THRESHOLD}° | Hesaplama: Büyük Daire formülü</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {loading ? (
          <div className="text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Loader2 size={36} style={{ color: theme.gold }} />
            </motion.div>
            <p className="text-sm mt-3" style={{ color: theme.textSecondary }}>Konum alınıyor...</p>
            <p className="text-[10px] mt-1" style={{ color: `${theme.textSecondary}80` }}>Yüksek doğruluklu GPS kullanılıyor</p>
          </div>
        ) : error ? (
          <div className="text-center px-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <MapPin size={28} className="text-red-400" />
            </div>
            <p className="text-sm font-semibold text-red-400 mb-2">{error}</p>
            <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>
              Tarayıcı ayarlarından konum iznini açın
            </p>
            <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ color: theme.bg, background: `linear-gradient(135deg, ${theme.gold}, #B8860B)` }}>
              Tekrar Dene
            </button>
          </div>
        ) : needsIOSPerm ? (
          /* iOS permission step */
          <div className="text-center px-6">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)' }}>
              <Smartphone size={36} style={{ color: theme.gold }} />
            </div>
            <h2 className="text-base font-bold mb-2" style={{ color: theme.cream }}>Pusula İzni Gerekli</h2>
            <p className="text-xs mb-5 max-w-xs mx-auto" style={{ color: theme.textSecondary }}>
              Kıble yönünü bulmak için cihazınızın pusula sensörüne erişmemiz gerekiyor.
            </p>
            <motion.button onClick={requestIOSPermission} whileTap={{ scale: 0.96 }}
              className="px-8 py-3.5 rounded-xl text-sm font-bold" style={{ color: theme.bg, background: `linear-gradient(135deg, ${theme.gold}, #B8860B)` }}>
              🧭 Pusula İznini Aç
            </motion.button>
          </div>
        ) : (
          <>
            {/* Status indicator */}
            <motion.div className="mb-3 px-4 py-2 rounded-full flex items-center gap-2"
              style={{ background: stableAligned ? 'rgba(74,222,128,0.12)' : isNear ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${stableAligned ? 'rgba(74,222,128,0.35)' : isNear ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.5s' }}>
              <motion.div className="w-2 h-2 rounded-full" style={{ background: statusColor, boxShadow: stableAligned ? '0 0 10px rgba(74,222,128,0.5)' : 'none', transition: 'all 0.4s' }}
                animate={stableAligned ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 1, repeat: Infinity }} />
              <span className="text-xs font-semibold" style={{ color: statusColor, transition: 'color 0.4s' }}>{statusText}</span>
            </motion.div>

            {/* Compass Container */}
            <div className="relative" style={{ width: '300px', height: '300px' }}>
              <CompassRingSVG heading={heading} qiblaAngle={qiblaAngle} aligned={stableAligned} near={isNear} theme={theme} compassReady={compassReady} />

              {/* Prayer Mat overlay in center */}
              <div className="absolute" style={{ top: '55px', left: '55px', right: '55px', bottom: '55px' }}>
                <div className="w-full h-full flex items-center justify-center" style={{ perspective: '500px' }}>
                  <motion.div style={{ width: '120px', height: '180px', transformStyle: 'preserve-3d' }}
                    animate={{ rotateX: stableAligned ? [1, -1, 1] : 4, scale: stableAligned ? [1, 1.015, 1] : 1 }}
                    transition={{ duration: stableAligned ? 4 : 0.5, repeat: stableAligned ? Infinity : 0, ease: 'easeInOut' }}>
                    <PrayerMatSVG aligned={stableAligned} nearAligned={isNear} theme={theme} />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Accuracy */}
            {compassReady && <AccuracyArc diff={diff} aligned={stableAligned} near={isNear} />}

            {/* Degrees info */}
            <div className="mt-3 text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div>
                  <p className="text-[9px] uppercase tracking-wider" style={{ color: theme.textSecondary }}>Kıble</p>
                  <p className="text-lg font-bold tabular-nums" style={{ color: theme.gold }}>{qiblaAngle !== null ? `${Math.round(qiblaAngle)}°` : '—'}</p>
                </div>
                <div className="w-px h-7" style={{ background: theme.cardBorder }} />
                <div>
                  <p className="text-[9px] uppercase tracking-wider" style={{ color: theme.textSecondary }}>Pusula</p>
                  <p className="text-lg font-bold tabular-nums" style={{ color: compassReady ? theme.cream : theme.textSecondary }}>
                    {compassReady ? `${Math.round(heading)}°` : '—'}
                  </p>
                </div>
                <div className="w-px h-7" style={{ background: theme.cardBorder }} />
                <div>
                  <p className="text-[9px] uppercase tracking-wider" style={{ color: theme.textSecondary }}>Sapma</p>
                  <p className="text-lg font-bold tabular-nums" style={{ color: stableAligned ? '#4ADE80' : isNear ? theme.gold : '#EF4444' }}>
                    {compassReady ? `${Math.abs(Math.round(diff))}°` : '—'}
                  </p>
                </div>
              </div>
              {location && (
                <p className="text-[10px]" style={{ color: `${theme.textSecondary}80` }}>
                  {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
                  {location.accuracy ? ` (±${Math.round(location.accuracy)}m)` : ''}
                </p>
              )}
            </div>

            {/* Lock count */}
            {lockedCount > 0 && (
              <div className="mt-2.5 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <span className="text-[10px]">☪️</span>
                <span className="text-[10px] font-medium" style={{ color: '#4ADE80' }}>
                  {lockedCount}× kıbleye hizalandınız
                </span>
              </div>
            )}

            {/* No compass fallback */}
            {!compassReady && displayHeading === null && !needsIOSPerm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
                className="mt-4 mx-4 p-4 rounded-xl text-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                <Smartphone size={20} className="mx-auto mb-2" style={{ color: theme.gold }} />
                <p className="text-xs font-medium mb-1" style={{ color: theme.cream }}>Pusula sensörü algılanamadı</p>
                <p className="text-[10px]" style={{ color: theme.textSecondary }}>
                  Bu cihazda pusula desteği olmayabilir. Kıble açınız: <strong style={{ color: theme.gold }}>{qiblaAngle !== null ? `${Math.round(qiblaAngle)}° ${dirName}` : '—'}</strong>
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Bottom hint */}
      {!loading && !error && !needsIOSPerm && (
        <div className="relative z-10 pb-24 pt-3 text-center">
          <motion.p className="text-[10px]" style={{ color: `${theme.textSecondary}60` }} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }}>
            {compassReady ? 'Telefonu düz tutun • Seccade kıbleyi gösterir' : 'Pusula sensörü aranıyor...'}
          </motion.p>
        </div>
      )}
    </div>
  );
}
