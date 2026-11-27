import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTx } from '../../i18n';
import { alpha } from '../../donus/palette';
import { playGate, startHold, stopGate, isGateSoundOn, setGateSound, PHASE_MAKAM, MAKAM_NAMES } from '../../services/donusAudio';
import { getReturnDay, getTodayPhase } from '../../services/returnEngine';

// 🚪 EŞİK — Dönüş Odası'na giriş sahnesi: "Kapı hep açıktı"
//
// Kapı bir engel değildir: zaten ARALIKTIR, kandilin ışığı aralıktan sızar.
// İki giriş yolu vardır:
//   · HUŞU İLE AÇIŞ  parmağını kapıya koy ve bekle. Kapı senin sabrınla, gıcırdayarak açılır; alttan
//                    ney demi yükselir. Bırakırsan kapı yine aralık kalır — ceza, sayaç, uyarı yoktur.
//   · DOKUNUŞ        kısa bir dokunuş (ya da Enter) kapıyı kendiliğinden açar.
// Sahne: 0 eşikte · 1 kapı açık, kandil · 2 desen · 3 selam · 4 oda
// SES: services/donusAudio.js — hepsi cihazda üretilir, kayıt yoktur (telifsiz). Tasvir yok.

const GOLD = '#F0B429';
const GLOW = '#FFD76A';
const HOLD_MS = 2800;

// Her evrenin kendi ışık rengi ve makamı vardır.
export const PHASE_LIGHT = {
  kapi:  { light: '#F0B429', floor: '#1A1208' },
  temel: { light: '#34D399', floor: '#06140F' },
  bag:   { light: '#7DA2FF', floor: '#0A0F1F' },
  ahlak: { light: '#F7A8B8', floor: '#1A0D11' },
  kok:   { light: '#D9A066', floor: '#140E08' },
};
const WOOD = '#3A2614';
const WOOD_DARK = '#24170B';

/** Tek kapı kanadı: ahşap, çivili, üstü sivri kemere uyar. Açısı `door` (0 aralık → 1 açık) değerinden gelir. */
function Leaf({ side, door, reduce }) {
  const sign = side === 'left' ? -1 : 1;
  const rotateY = useTransform(door, (v) => sign * (9 + 95 * v));
  const opacity = useTransform(door, (v) => 1 - v);
  const shade = useTransform(door, (v) => `inset 0 0 0 2px rgba(0,0,0,0.35), inset ${-sign * 30 * v}px 0 40px rgba(0,0,0,${0.15 + 0.4 * v})`);
  return (
    <motion.div
      style={{
        ...(reduce ? { opacity } : { rotateY }),
        position: 'absolute', top: 0, bottom: 0, width: '50%', [side]: 0,
        transformOrigin: side === 'left' ? 'left center' : 'right center',
        background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0 1px, transparent 1px 7px), linear-gradient(${side === 'left' ? 90 : 270}deg, ${WOOD_DARK}, ${WOOD} 55%, ${WOOD_DARK})`,
        borderRadius: side === 'left' ? '120px 0 0 0' : '0 120px 0 0',
        boxShadow: shade, backfaceVisibility: 'hidden',
      }}>
      {[25, 50, 75].map((x) => (
        <span key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: 1, background: 'rgba(0,0,0,0.35)' }} />
      ))}
      {/* kuşaklar */}
      {[30, 68].map((y) => (
        <span key={y} style={{ position: 'absolute', left: 0, right: 0, top: `${y}%`, height: 9, background: 'linear-gradient(#6E5424, #4A3716)', boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }} />
      ))}
      {[18, 38, 58, 78].map((y) => [22, 72].map((x) => (
        <span key={`${x}-${y}`} style={{ position: 'absolute', top: `${y}%`, left: `${x}%`, width: 7, height: 7, borderRadius: 4, background: 'radial-gradient(circle at 35% 30%, #D8B45A, #6E5424)', boxShadow: '0 1px 0 rgba(0,0,0,0.5)' }} />
      )))}
      <span style={{ position: 'absolute', top: '50%', [side === 'left' ? 'right' : 'left']: 12, width: 18, height: 18, borderRadius: 9, border: '2px solid #B08A3A' }} />
    </motion.div>
  );
}

/** Işık hüzmesinde yükselen toz zerreleri. */
function Motes({ color }) {
  const seeds = useRef(Array.from({ length: 16 }, (_, i) => ({
    x: 8 + ((i * 53) % 84), s: 2 + (i % 3), d: 4 + (i % 5), delay: (i * 0.37) % 4, drift: ((i * 29) % 30) - 15,
  }))).current;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '120px 120px 0 0', pointerEvents: 'none' }} aria-hidden>
      {seeds.map((m, i) => (
        <motion.span key={i}
          initial={{ y: 380, x: 0, opacity: 0 }}
          animate={{ y: -20, x: m.drift, opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: m.d, delay: m.delay, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', left: `${m.x}%`, width: m.s, height: m.s, borderRadius: m.s, background: '#FFF6D8', boxShadow: `0 0 6px ${color}` }} />
      ))}
    </div>
  );
}

/** Nefes halkası: basılı tutma ilerlemesi. Sayı yok, yüzde yok; yalnız dolan bir halka. */
function HoldRing({ door, color }) {
  const R = 34;
  const C = 2 * Math.PI * R;
  const offset = useTransform(door, (v) => C * (1 - v));
  const glow = useTransform(door, (v) => 0.25 + 0.75 * v);
  return (
    <motion.svg width="84" height="84" viewBox="0 0 84 84" style={{ opacity: glow }} aria-hidden>
      <circle cx="42" cy="42" r={R} fill="none" stroke={alpha(color, 0.18)} strokeWidth="2" />
      <motion.circle cx="42" cy="42" r={R} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray={C} style={{ strokeDashoffset: offset, rotate: -90, transformOrigin: '42px 42px', filter: `drop-shadow(0 0 6px ${color})` }} />
      <circle cx="42" cy="42" r="5" fill={color} />
    </motion.svg>
  );
}

/** Rub'ul hizb — iki kare ve halkalar; ışıkla kendini çizer. */
function Pattern({ draw }) {
  const stroke = {
    fill: 'none', stroke: GOLD, strokeWidth: 1.4,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { filter: `drop-shadow(0 0 6px ${alpha(GLOW, 0.9)})` },
  };
  const anim = (delay, dur = 1.1) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: draw ? { pathLength: 1, opacity: 1 } : {},
    transition: { pathLength: { duration: dur, delay, ease: 'easeInOut' }, opacity: { duration: 0.2, delay } },
  });

  return (
    <svg viewBox="0 0 200 200" className="absolute" style={{ width: 300, height: 300 }} aria-hidden>
      {/* Dış halka */}
      <motion.circle cx="100" cy="100" r="88" {...stroke} {...anim(0)} />
      {/* İki kare — 45° kaydırılmış */}
      <motion.rect x="38" y="38" width="124" height="124" rx="4" {...stroke} {...anim(0.25)} />
      <motion.rect x="38" y="38" width="124" height="124" rx="4" {...stroke} {...anim(0.45)}
        style={{ ...stroke.style, transformOrigin: '100px 100px', transform: 'rotate(45deg)' }} />
      {/* Sekiz ışın */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <motion.line key={i}
            x1={100 + Math.cos(a) * 30} y1={100 + Math.sin(a) * 30}
            x2={100 + Math.cos(a) * 74} y2={100 + Math.sin(a) * 74}
            {...stroke} strokeWidth="1" {...anim(0.7 + i * 0.05, 0.5)} />
        );
      })}
      {/* İç halka */}
      <motion.circle cx="100" cy="100" r="30" {...stroke} {...anim(1.05)} />
    </svg>
  );
}

/** Kandil alevi — titreyen, canlı. */
function Flame({ scale = 1 }) {
  return (
    <motion.div className="absolute" style={{ width: 40 * scale, height: 56 * scale }}
      animate={{ scaleY: [1, 1.12, 0.96, 1.06, 1], scaleX: [1, 0.94, 1.05, 0.97, 1] }}
      transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}>
      <svg viewBox="0 0 40 56" className="w-full h-full">
        <defs>
          <radialGradient id="flameG" cx="50%" cy="68%" r="55%">
            <stop offset="0%" stopColor="#FFF6D8" />
            <stop offset="45%" stopColor={GLOW} />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <path d="M20 2 C28 16 36 24 36 36 C36 47 29 54 20 54 C11 54 4 47 4 36 C4 24 12 16 20 2 Z"
          fill="url(#flameG)" />
        <ellipse cx="20" cy="40" rx="5" ry="9" fill="#FFF9E6" opacity="0.85" />
      </svg>
    </motion.div>
  );
}

const buzz = (p) => { try { if (navigator.vibrate) navigator.vibrate(p); } catch { /* titreşim yok */ } };

export default function GateAnimation({ onDone }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const tt = useTx();
  const [phase, setPhase] = useState(0); // 0 eşikte · 1 kapı açık · 2 desen · 3 selam · 4 oda
  const [sound, setSound] = useState(() => isGateSoundOn());
  const [holding, setHolding] = useState(false);
  const door = useMotionValue(0);          // 0 aralık → 1 açık
  const started = useRef(false);
  const timers = useRef([]);
  const hold = useRef(null);
  const back = useRef(null);

  const name = (user?.name || '').split(' ')[0];
  const day = getReturnDay();
  const evre = getTodayPhase(day) || { id: 'kapi', name: 'Kapı' };
  const L = PHASE_LIGHT[evre.id] || PHASE_LIGHT.kapi;
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const floorScale = useTransform(door, [0, 1], [1, 1.9]);
  const floorOpacity = useTransform(door, [0, 1], [0.45, 1]);
  const rays = useTransform(door, [0, 1], [0, 0.9]);
  const frameGlow = useTransform(door, (v) => `0 0 ${40 + 50 * v}px ${alpha(L.light, 0.12 + 0.4 * v)}`);

  const begin = useCallback((fromHold) => {
    if (started.current) return;
    started.current = true;
    if (!fromHold) {
      playGate(evre.id);
      animate(door, 1, { duration: 2.0, ease: [0.2, 0.8, 0.2, 1] });
    }
    setPhase(1);
    const k = fromHold ? [900, 2500, 4300, 5000] : [2200, 3800, 5600, 6300];
    timers.current = [
      setTimeout(() => setPhase(2), k[0]),
      setTimeout(() => setPhase(3), k[1]),
      setTimeout(() => setPhase(4), k[2]),
      setTimeout(() => onDone && onDone(), k[3]),
    ];
  }, [onDone, evre.id, door]);

  const stopHold = () => {
    const h = hold.current;
    if (!h) return null;
    cancelAnimationFrame(h.raf);
    hold.current = null;
    setHolding(false);
    return h;
  };

  // HUŞU İLE AÇIŞ: basılı tutuldukça kapı açılır.
  const press = () => {
    if (started.current || hold.current) return;
    if (back.current) back.current.stop();
    const h = { audio: startHold(evre.id), t0: performance.now(), base: door.get(), tick: 0, raf: 0 };
    hold.current = h;
    setHolding(true);
    const step = (now) => {
      if (hold.current !== h) return;
      const p = Math.min(1, h.base + (now - h.t0) / HOLD_MS);
      door.set(p);
      h.audio.progress(p);
      const q = Math.floor(p * 4);
      if (q > h.tick) { h.tick = q; buzz(q === 4 ? [30, 40, 60] : 12); }
      if (p >= 1) { stopHold(); h.audio.complete(); begin(true); return; }
      h.raf = requestAnimationFrame(step);
    };
    h.raf = requestAnimationFrame(step);
  };

  const release = () => {
    const h = stopHold();
    if (!h) return;
    h.audio.cancel();
    // Parmak ne zaman kalkarsa kalksın kapı AÇILIR (eskiden 0,3 sn'den uzun basıp bırakınca kapı geri kapanıyor,
    // kullanıcı "giriş yapmıyor" sanıyordu). Basılı tutmak yalnız açılışı kişinin kendi nefesine bırakır.
    begin(false);
  };

  const skip = (e) => { e.stopPropagation(); timers.current.forEach(clearTimeout); stopGate(); onDone && onDone(); };
  const own = (e) => e.stopPropagation();

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    if (hold.current) { cancelAnimationFrame(hold.current.raf); hold.current.audio.cancel(); }
    stopGate();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[130] overflow-hidden flex flex-col items-center justify-center select-none"
      style={{ background: `radial-gradient(ellipse at 50% 55%, ${L.floor} 0%, #050403 75%)`, touchAction: 'none', WebkitTouchCallout: 'none' }}
      exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      role="button" tabIndex={0} aria-label={tt('Dönüş Odası kapısı. Basılı tut ya da Enter ile gir.')}
      onPointerDown={press} onPointerUp={release} onPointerCancel={release} onPointerLeave={release}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); begin(false); } }}
      data-testid="donus-gate">

      {phase === 0 && !holding && (
        <button type="button" data-testid="kapi-gir" onClick={(e) => { e.stopPropagation(); begin(false); }} onPointerDown={own}
          className="absolute left-1/2 -translate-x-1/2 z-30 text-sm font-bold px-6 rounded-full"
          style={{ bottom: 'calc(28px + env(safe-area-inset-bottom))', height: 46, color: '#1A1406', background: L.light }}>
          {tt('Kapıdan gir')}
        </button>
      )}
      {phase > 0 && phase < 4 && (
        <button onClick={skip} onPointerDown={own} className="absolute top-5 left-5 z-30 text-[11px] font-bold px-3 py-2 rounded-xl"
          style={{ color: theme.textSecondary, background: 'rgba(255,255,255,0.06)' }}>{tt('Geç')}</button>
      )}

      {/* KAPI — sivri kemer içinde çift kanat */}
      <AnimatePresence>
        {phase < 3 && (
          <motion.div className="absolute" exit={{ opacity: 0, scale: 1.25 }} transition={{ duration: 0.9 }}
            style={{ width: 236, height: 372, perspective: 1200, zIndex: 5 }} aria-hidden>
            {/* kapıdan taşan ışık hüzmeleri */}
            {!reduce && (
              <motion.div style={{ position: 'absolute', inset: -170, opacity: rays, pointerEvents: 'none',
                background: `repeating-conic-gradient(from 0deg at 50% 58%, ${alpha(L.light, 0.13)} 0deg 5deg, transparent 5deg 17deg)`,
                WebkitMaskImage: 'radial-gradient(circle at 50% 58%, #000 18%, transparent 68%)', maskImage: 'radial-gradient(circle at 50% 58%, #000 18%, transparent 68%)' }}
                animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }} />
            )}
            <motion.div style={{ position: 'absolute', inset: -10, borderRadius: '132px 132px 6px 6px', border: `2px solid ${alpha(L.light, 0.45)}`, boxShadow: frameGlow }} />
            <motion.div style={{ position: 'absolute', inset: 0, borderRadius: '120px 120px 0 0', background: `radial-gradient(ellipse at 50% 60%, #FFF6D8 0%, ${L.light} 38%, ${alpha(L.light, 0.1)} 100%)` }}
              animate={{ opacity: phase === 0 && !holding ? [0.55, 0.85, 0.55] : 1 }}
              transition={phase === 0 && !holding ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 1.2 }} />
            {!reduce && (holding || phase >= 1) && <Motes color={L.light} />}
            <Leaf side="left" door={door} reduce={reduce} />
            <Leaf side="right" door={door} reduce={reduce} />
            <motion.div style={{ position: 'absolute', left: '-30%', right: '-30%', bottom: -70, height: 90, scaleX: floorScale, opacity: floorOpacity,
              background: `radial-gradient(ellipse at 50% 0%, ${alpha(L.light, 0.55)} 0%, transparent 70%)` }} />
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); const v = !sound; setSound(v); setGateSound(v); }} onPointerDown={own}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center z-20"
          style={{ background: alpha(GOLD, 0.1), border: `1px solid ${alpha(GOLD, 0.25)}` }}
          aria-label={tt('Giriş sesi')}>
          {sound ? <Volume2 size={15} style={{ color: GOLD }} /> : <VolumeX size={15} style={{ color: theme.textSecondary }} />}
        </button>
      )}

      {/* Yayılan ışık */}
      <motion.div className="absolute rounded-full pointer-events-none"
        initial={{ width: 8, height: 8, opacity: 0.5 }}
        animate={
          phase === 0 ? { width: 90, height: 90, opacity: [0.25, 0.45, 0.25] }
            : phase === 1 ? { width: 300, height: 300, opacity: 0.75 }
              : phase < 4 ? { width: 620, height: 620, opacity: 0.6 }
                : { width: 2600, height: 2600, opacity: 1 }
        }
        transition={phase === 0
          ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
          : { duration: phase === 4 ? 0.7 : 1.1, ease: 'easeOut' }}
        style={{ background: `radial-gradient(circle, ${alpha(GLOW, 0.55)} 0%, ${alpha(GOLD, 0.18)} 42%, transparent 72%)` }} />

      <AnimatePresence>
        {phase >= 2 && phase < 4 && (
          <motion.div className="absolute flex items-center justify-center"
            initial={{ scale: 0.7, opacity: 0, rotate: -12 }}
            animate={{ scale: phase >= 3 ? 1.3 : 1, opacity: phase >= 3 ? 0.22 : 1, rotate: phase >= 3 ? 12 : 0 }}
            exit={{ scale: 1.7, opacity: 0 }}
            transition={{ duration: phase >= 3 ? 1.6 : 0.9, ease: 'easeOut' }}>
            <Pattern draw={phase >= 2} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kandil */}
      <AnimatePresence>
        {phase >= 1 && phase < 3 && (
          <motion.div className="relative flex flex-col items-center" style={{ zIndex: 6 }}
            initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}>
            <div className="relative flex items-end justify-center" style={{ height: 92 }}>
              <Flame scale={1.15} />
            </div>
            <svg viewBox="0 0 80 40" style={{ width: 76, marginTop: -4, opacity: 0.9 }} aria-hidden>
              <path d="M14 4 L66 4 L58 26 Q40 36 22 26 Z" fill="none" stroke={GOLD} strokeWidth="1.6" />
              <path d="M28 30 L52 30 L48 38 L32 38 Z" fill="none" stroke={GOLD} strokeWidth="1.4" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Eşik daveti */}
      <AnimatePresence>
        {phase === 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ delay: 0.4 }} className="absolute bottom-14 flex flex-col items-center text-center px-10" style={{ zIndex: 8 }}>
            <HoldRing door={door} color={L.light} />
            <motion.p className="text-[15px] font-black tracking-wide mt-3"
              animate={{ opacity: holding ? 1 : [0.55, 1, 0.55] }} transition={{ duration: 2.6, repeat: holding ? 0 : Infinity }}
              style={{ color: GOLD, fontFamily: 'Playfair Display, serif' }}>
              {holding ? tt('Nefes al… kapı açılıyor') : tt('Parmağını kapıya koy ve bekle')}
            </motion.p>
            <p className="text-[10.5px] mt-2" style={{ color: theme.textSecondary }}>
              {tt('Kapı hep açıktı')} · {tt('kısa dokunuş da açar')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selam */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div className="absolute text-center px-10 py-10 rounded-[40px]"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7 }}
            style={{ background: `radial-gradient(ellipse at center, ${alpha(theme.bg, 0.92)} 0%, ${alpha(theme.bg, 0.75)} 55%, transparent 78%)` }}>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: GOLD }}>{tt('Dönüş Odası')}</p>
            <h1 className="text-[30px] font-black leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
              {name ? `${tt('Hoş geldin')}, ${name}` : tt('Hoş geldin')}
            </h1>
            <motion.p className="text-[12px] mt-3 leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ color: theme.textSecondary }}>
              {tt('Burada kimse sana ne kadar geç kaldığını sormaz.')}
            </motion.p>
            <p className="text-[10.5px] mt-4 font-bold tracking-wide" style={{ color: L.light }}>
              {tt(evre.name)} · {day}. {tt('gün')} · {MAKAM_NAMES[PHASE_MAKAM[evre.id]] || ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
