import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, MapPin, Loader2, RotateCcw, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const ALIGN_THRESHOLD = 5;   // degrees — "locked on" zone
const NEAR_THRESHOLD = 20;   // degrees — "getting close" zone

function calculateQibla(lat, lng) {
  const phi1 = (lat * Math.PI) / 180;
  const phi2 = (KAABA_LAT * Math.PI) / 180;
  const dLambda = ((KAABA_LNG - lng) * Math.PI) / 180;
  const y = Math.sin(dLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLambda);
  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  return (qibla + 360) % 360;
}

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* Smooth angle interpolation */
function lerpAngle(from, to, t) {
  let diff = ((to - from + 540) % 360) - 180;
  return from + diff * t;
}

/* Prayer mat SVG */
function PrayerMatSVG({ aligned, nearAligned, theme }) {
  const matColor = aligned ? '#1B6B3A' : nearAligned ? '#1A5C33' : theme.surface;
  const borderColor = aligned ? '#4ADE80' : nearAligned ? '#D4AF37' : 'rgba(212,175,55,0.15)';
  const fringeColor = aligned ? '#4ADE80' : '#D4AF37';

  return (
    <svg viewBox="0 0 200 320" className="w-full h-full" style={{ filter: aligned ? 'drop-shadow(0 0 30px rgba(74,222,128,0.4))' : nearAligned ? 'drop-shadow(0 0 20px rgba(212,175,55,0.2))' : 'none' }}>
      <defs>
        <linearGradient id="matGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={matColor} stopOpacity="0.95" />
          <stop offset="50%" stopColor={matColor} />
          <stop offset="100%" stopColor={matColor} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="mihrabGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={aligned ? '#4ADE80' : '#D4AF37'} stopOpacity="0.5" />
          <stop offset="100%" stopColor={aligned ? '#4ADE80' : '#D4AF37'} stopOpacity="0.05" />
        </linearGradient>
        <filter id="innerShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset dx="0" dy="2" result="offsetBlur" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
          <feFlood floodColor="#000" floodOpacity="0.3" result="color" />
          <feComposite in2="innerShadow" operator="in" />
          <feComposite in2="SourceGraphic" operator="over" />
        </filter>
      </defs>

      {/* Mat body */}
      <rect x="10" y="20" width="180" height="280" rx="8" fill="url(#matGrad)" stroke={borderColor} strokeWidth={aligned ? 2.5 : 1.5} filter="url(#innerShadow)" />

      {/* Inner border - ornamental frame */}
      <rect x="20" y="30" width="160" height="260" rx="5" fill="none" stroke={borderColor} strokeWidth="0.8" strokeDasharray={aligned ? "none" : "3,3"} opacity="0.6" />

      {/* Mihrab (prayer niche) arch at TOP of mat */}
      <path d="M60,30 Q60,65 100,80 Q140,65 140,30" fill="url(#mihrabGrad)" stroke={borderColor} strokeWidth="1" opacity="0.8" />
      
      {/* Inner mihrab arch */}
      <path d="M70,30 Q70,58 100,70 Q130,58 130,30" fill="none" stroke={borderColor} strokeWidth="0.5" opacity="0.5" />

      {/* Kaaba icon area in mihrab */}
      <text x="100" y="55" textAnchor="middle" fontSize="22" opacity={aligned ? 1 : 0.6}>🕋</text>

      {/* Geometric pattern - center medallion */}
      <circle cx="100" cy="170" r="35" fill="none" stroke={borderColor} strokeWidth="0.6" opacity="0.3" />
      <circle cx="100" cy="170" r="25" fill="none" stroke={borderColor} strokeWidth="0.4" opacity="0.25" />
      <circle cx="100" cy="170" r="15" fill="none" stroke={borderColor} strokeWidth="0.4" opacity="0.2" />
      
      {/* 8-pointed star in center */}
      {[0, 45, 90, 135].map(angle => (
        <line key={angle} x1={100 + 25 * Math.cos(angle * Math.PI / 180)} y1={170 + 25 * Math.sin(angle * Math.PI / 180)} x2={100 - 25 * Math.cos(angle * Math.PI / 180)} y2={170 - 25 * Math.sin(angle * Math.PI / 180)} stroke={borderColor} strokeWidth="0.4" opacity="0.25" />
      ))}

      {/* Corner ornaments */}
      {[[30, 40], [170, 40], [30, 280], [170, 280]].map(([cx, cy], i) => (
        <g key={i} opacity="0.3">
          <circle cx={cx} cy={cy} r="8" fill="none" stroke={borderColor} strokeWidth="0.5" />
          <circle cx={cx} cy={cy} r="4" fill="none" stroke={borderColor} strokeWidth="0.4" />
        </g>
      ))}

      {/* Side ornamental lines */}
      <line x1="25" y1="100" x2="25" y2="220" stroke={borderColor} strokeWidth="0.4" opacity="0.2" />
      <line x1="175" y1="100" x2="175" y2="220" stroke={borderColor} strokeWidth="0.4" opacity="0.2" />

      {/* Top fringe */}
      {Array.from({ length: 18 }, (_, i) => (
        <line key={`tf${i}`} x1={15 + i * 10} y1="20" x2={15 + i * 10} y2="12" stroke={fringeColor} strokeWidth="1.5" strokeLinecap="round" opacity={aligned ? 0.9 : 0.35} />
      ))}
      {/* Bottom fringe */}
      {Array.from({ length: 18 }, (_, i) => (
        <line key={`bf${i}`} x1={15 + i * 10} y1="300" x2={15 + i * 10} y2="308" stroke={fringeColor} strokeWidth="1.5" strokeLinecap="round" opacity={aligned ? 0.9 : 0.35} />
      ))}

      {/* Alignment glow overlay */}
      {(aligned || nearAligned) && (
        <rect x="10" y="20" width="180" height="280" rx="8" fill={aligned ? 'rgba(74,222,128,0.08)' : 'rgba(212,175,55,0.05)'} />
      )}
    </svg>
  );
}

/* Qibla direction arrow */
function QiblaArrow({ aligned }) {
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <defs>
        <linearGradient id="arrowGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={aligned ? '#4ADE80' : '#D4AF37'} />
          <stop offset="100%" stopColor={aligned ? '#22C55E' : '#B8860B'} />
        </linearGradient>
      </defs>
      <path d="M20,2 L28,18 L22,15 L22,38 L18,38 L18,15 L12,18 Z" fill="url(#arrowGrad)" opacity={aligned ? 1 : 0.9} />
    </svg>
  );
}

/* Particles effect when aligned */
function AlignParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 2 + Math.random() * 4,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: '-5%',
            background: 'radial-gradient(circle, #4ADE80, transparent)',
          }}
          animate={{
            y: [0, -400 - Math.random() * 200],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

/* Compass ring */
function CompassRing({ heading, aligned, theme }) {
  const directions = [
    { label: 'K', angle: 0, color: '#ef4444' },
    { label: 'KD', angle: 45, color: theme.textSecondary },
    { label: 'D', angle: 90, color: theme.textSecondary },
    { label: 'GD', angle: 135, color: theme.textSecondary },
    { label: 'G', angle: 180, color: theme.textSecondary },
    { label: 'GB', angle: 225, color: theme.textSecondary },
    { label: 'B', angle: 270, color: theme.textSecondary },
    { label: 'KB', angle: 315, color: theme.textSecondary },
  ];

  return (
    <div className="absolute inset-0 rounded-full" style={{ transform: `rotate(${-heading}deg)`, transition: 'transform 0.15s linear' }}>
      {/* Degree ticks */}
      {Array.from({ length: 72 }, (_, i) => {
        const angle = i * 5;
        const isMajor = angle % 30 === 0;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-0"
            style={{
              width: '1px',
              height: isMajor ? '10px' : '5px',
              background: isMajor ? (aligned ? '#4ADE80' : theme.gold) : 'rgba(212,175,55,0.2)',
              transform: `translateX(-50%) rotate(${angle}deg)`,
              transformOrigin: '50% 150px',
            }}
          />
        );
      })}
      {/* Cardinal direction labels */}
      {directions.map(d => (
        <div
          key={d.label}
          className="absolute font-bold"
          style={{
            fontSize: d.label.length === 1 ? '11px' : '8px',
            color: d.color,
            left: '50%',
            top: '14px',
            transform: `translateX(-50%) rotate(${d.angle}deg)`,
            transformOrigin: '50% 136px',
          }}
        >
          <span style={{ display: 'inline-block', transform: `rotate(${-d.angle + heading}deg)` }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* Accuracy meter bar */
function AccuracyMeter({ angleDiff, aligned }) {
  const accuracy = Math.max(0, 100 - (Math.abs(angleDiff) / 180) * 100);
  const color = aligned ? '#4ADE80' : accuracy > 80 ? '#D4AF37' : accuracy > 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="w-full max-w-[200px] mx-auto mt-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-[#A8B5A0]">Hizalama</span>
        <span className="text-[10px] font-bold" style={{ color }}>{Math.round(accuracy)}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${accuracy}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function QiblaPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [permGranted, setPermGranted] = useState(false);
  const [calibrationNeeded, setCalibrationNeeded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [hasVibrated, setHasVibrated] = useState(false);
  const [lockedCount, setLockedCount] = useState(0);
  const [smoothHeading, setSmoothHeading] = useState(0);
  const animRef = useRef(null);
  const headingRef = useRef(0);
  const smoothRef = useRef(0);

  // Smooth heading animation loop
  useEffect(() => {
    const animate = () => {
      smoothRef.current = lerpAngle(smoothRef.current, headingRef.current, 0.12);
      setSmoothHeading(smoothRef.current % 360);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Konum servisi desteklenmiyor');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setQiblaAngle(calculateQibla(latitude, longitude));
        setLoading(false);
      },
      () => {
        setError('Konum izni gerekli');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Device orientation (compass)
  useEffect(() => {
    let mounted = true;

    const handleOrientation = (e) => {
      if (!mounted) return;
      let h = null;

      if (e.webkitCompassHeading !== undefined) {
        h = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        h = (360 - e.alpha) % 360;
      }

      if (h !== null && !isNaN(h)) {
        headingRef.current = h;
        if (!permGranted) setPermGranted(true);
      }

      if (e.absolute === false || (e.alpha === null && !e.webkitCompassHeading)) {
        setCalibrationNeeded(true);
      } else {
        setCalibrationNeeded(false);
      }
    };

    const startListening = () => {
      window.addEventListener('deviceorientation', handleOrientation, true);
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      setTimeout(() => { if (mounted) setPermGranted(true); }, 1500);
    };

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires user gesture — permission button handles this
    } else {
      startListening();
    }

    return () => {
      mounted = false;
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    };
  }, [permGranted]);

  const requestIOSPermission = useCallback(async () => {
    try {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm === 'granted') {
        window.addEventListener('deviceorientation', (e) => {
          let h = e.webkitCompassHeading;
          if (h !== undefined && h !== null) {
            headingRef.current = h;
            setPermGranted(true);
          }
        }, true);
      }
    } catch {}
  }, []);

  // Calculate rotation & alignment
  const angleDiff = qiblaAngle !== null ? ((qiblaAngle - smoothHeading + 540) % 360) - 180 : 180;
  const isAligned = Math.abs(angleDiff) <= ALIGN_THRESHOLD;
  const isNear = Math.abs(angleDiff) <= NEAR_THRESHOLD;

  // Haptic feedback when aligned
  useEffect(() => {
    if (isAligned && !hasVibrated) {
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      setHasVibrated(true);
      setLockedCount(prev => prev + 1);
    } else if (!isAligned) {
      setHasVibrated(false);
    }
  }, [isAligned, hasVibrated]);

  // Distance to Kaaba
  const distanceKm = location ? getDistance(location.lat, location.lng, KAABA_LAT, KAABA_LNG) : null;

  const needsIOSPermission = typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function' && !permGranted;

  return (
    <div className="animate-fade-in min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }} data-testid="qibla-page">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full -top-[200px] left-1/2 -translate-x-1/2"
          animate={{
            background: isAligned
              ? 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)'
              : isNear
                ? 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)',
          }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Aligned particles */}
      <AnimatePresence>
        {isAligned && <AlignParticles />}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-20 px-5 pt-10 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <ArrowLeft size={16} style={{ color: theme.cream }} />
            </button>
            <div>
              <h1 className="text-lg font-bold" style={{ color: theme.cream, fontFamily: 'Playfair Display, serif' }}>Kıble Yönü</h1>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>
                {distanceKm ? `Kabe'ye ${Math.round(distanceKm).toLocaleString('tr-TR')} km` : 'Mekke yönünü bulun'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {calibrationNeeded && (
              <motion.button
                onClick={() => setCalibrationNeeded(false)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium"
                style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <RotateCcw size={10} /> Kalibre Et
              </motion.button>
            )}
            <button onClick={() => setShowInfo(!showInfo)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <Info size={14} style={{ color: theme.textSecondary }} />
            </button>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-5 mb-3 rounded-xl overflow-hidden"
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
          >
            <div className="p-4 space-y-2 text-xs" style={{ color: theme.textSecondary }}>
              <p>📱 Telefonunuzu düz ve yere paralel tutun</p>
              <p>🧭 Seccade üzerindeki Kâbe simgesi kıble yönünü gösterir</p>
              <p>🟢 Yeşil = kıbleye hizalandınız, titreşim ile bildirilir</p>
              <p>🔄 Pusula doğru çalışmıyorsa telefonunuzu 8 şeklinde çevirin</p>
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
          </div>
        ) : error ? (
          <div className="text-center px-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <MapPin size={28} className="text-red-400" />
            </div>
            <p className="text-sm font-medium text-red-400 mb-2">{error}</p>
            <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>Konum iznini açıp sayfayı yenileyin</p>
            <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ color: theme.bg, background: `linear-gradient(135deg, ${theme.gold}, #B8860B)` }}>
              Tekrar Dene
            </button>
          </div>
        ) : (
          <>
            {/* Status indicator */}
            <motion.div
              className="mb-4 px-4 py-2 rounded-full flex items-center gap-2"
              animate={{
                background: isAligned ? 'rgba(74,222,128,0.15)' : isNear ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
                borderColor: isAligned ? 'rgba(74,222,128,0.4)' : isNear ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)',
              }}
              style={{ border: '1px solid' }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                animate={{
                  background: isAligned ? '#4ADE80' : isNear ? '#D4AF37' : '#6B7280',
                  scale: isAligned ? [1, 1.4, 1] : 1,
                  boxShadow: isAligned ? '0 0 12px rgba(74,222,128,0.6)' : 'none',
                }}
                transition={{ duration: isAligned ? 0.8 : 0.3, repeat: isAligned ? Infinity : 0 }}
              />
              <span className="text-xs font-semibold" style={{ color: isAligned ? '#4ADE80' : isNear ? theme.gold : theme.textSecondary }}>
                {isAligned ? 'Kıble Bulundu!' : isNear ? 'Yaklaşıyorsunuz...' : 'Kıbleyi Arayın'}
              </span>
              {isAligned && <span className="text-base">☪️</span>}
            </motion.div>

            {/* Compass Container */}
            <div className="relative" style={{ width: '300px', height: '300px' }}>
              {/* Outer compass ring */}
              <div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${isAligned ? 'rgba(74,222,128,0.3)' : 'rgba(212,175,55,0.12)'}` }}>
                <CompassRing heading={smoothHeading} aligned={isAligned} theme={theme} />
              </div>

              {/* Qibla direction indicator on compass ring */}
              {qiblaAngle !== null && (
                <div
                  className="absolute left-1/2 top-0 z-20"
                  style={{
                    transform: `translateX(-50%) rotate(${qiblaAngle - smoothHeading}deg)`,
                    transformOrigin: '50% 150px',
                    transition: 'transform 0.15s linear',
                  }}
                >
                  <motion.div
                    animate={{ scale: isAligned ? [1, 1.15, 1] : 1 }}
                    transition={{ duration: 1, repeat: isAligned ? Infinity : 0 }}
                  >
                    <QiblaArrow aligned={isAligned} />
                  </motion.div>
                </div>
              )}

              {/* Prayer Mat in center */}
              <div className="absolute inset-[50px]">
                <div className="w-full h-full flex items-center justify-center" style={{ perspective: '600px' }}>
                  <motion.div
                    className="relative"
                    style={{ width: '140px', height: '200px', transformStyle: 'preserve-3d' }}
                    animate={{
                      rotateX: isAligned ? [2, -2, 2] : 5,
                      scale: isAligned ? [1, 1.02, 1] : 1,
                    }}
                    transition={{
                      duration: isAligned ? 3 : 0.3,
                      repeat: isAligned ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                  >
                    <PrayerMatSVG aligned={isAligned} nearAligned={isNear} theme={theme} />
                  </motion.div>
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <motion.div
                  className="w-3 h-3 rounded-full"
                  animate={{
                    background: isAligned ? '#4ADE80' : theme.gold,
                    boxShadow: isAligned ? '0 0 16px rgba(74,222,128,0.6)' : '0 0 8px rgba(212,175,55,0.3)',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Accuracy Meter */}
            <AccuracyMeter angleDiff={angleDiff} aligned={isAligned} />

            {/* Degree info */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="text-center">
                  <p className="text-[10px]" style={{ color: theme.textSecondary }}>Kıble Açısı</p>
                  <p className="text-lg font-bold" style={{ color: theme.gold }}>{qiblaAngle !== null ? `${Math.round(qiblaAngle)}°` : '—'}</p>
                </div>
                <div className="w-px h-8" style={{ background: theme.cardBorder }} />
                <div className="text-center">
                  <p className="text-[10px]" style={{ color: theme.textSecondary }}>Pusula</p>
                  <p className="text-lg font-bold" style={{ color: theme.cream }}>{Math.round(smoothHeading)}°</p>
                </div>
                <div className="w-px h-8" style={{ background: theme.cardBorder }} />
                <div className="text-center">
                  <p className="text-[10px]" style={{ color: theme.textSecondary }}>Fark</p>
                  <p className="text-lg font-bold" style={{ color: isAligned ? '#4ADE80' : isNear ? theme.gold : '#EF4444' }}>
                    {Math.abs(Math.round(angleDiff))}°
                  </p>
                </div>
              </div>

              {location && (
                <p className="text-[10px]" style={{ color: `${theme.textSecondary}99` }}>
                  {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
                </p>
              )}
            </div>

            {/* Lock count badge */}
            {lockedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}
              >
                <span className="text-[10px]">✅</span>
                <span className="text-[10px] font-medium" style={{ color: '#4ADE80' }}>
                  {lockedCount} kez kıbleye hizalandınız
                </span>
              </motion.div>
            )}

            {/* iOS permission button */}
            {needsIOSPermission && (
              <motion.button
                onClick={requestIOSPermission}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2"
                style={{ color: theme.bg, background: `linear-gradient(135deg, ${theme.gold}, #B8860B)` }}
              >
                <span>🧭</span> Pusula İznini Aç
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* Bottom hint */}
      {!loading && !error && (
        <div className="relative z-10 pb-24 pt-4 text-center">
          <motion.p
            className="text-[10px]"
            style={{ color: `${theme.textSecondary}80` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Telefonunuzu yere paralel tutun • Seccade kıbleyi takip eder
          </motion.p>
        </div>
      )}
    </div>
  );
}
