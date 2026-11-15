import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTx } from '../../i18n';
import { alpha } from '../../donus/palette';
import { playGate, stopGate, isGateSoundOn, setGateSound, PHASE_MAKAM, MAKAM_NAMES } from '../../services/donusAudio';
import { getReturnDay, getTodayPhase } from '../../services/returnEngine';

// 🪔 EŞİK — Dönüş Odası'na giriş sahnesi
//
// Kapı yerine KANDİL. Sebebi şu: kapı bir engeldir, açılması gerekir.
// Kandil ise bir davettir — karanlıkta zaten yanıyordur, sen ona doğru
// yürürsün. Geri dönen için doğru metafor bu.
//
// Sahne:
//   0 · EŞİKTE   karanlıkta titreyen bir kıvılcım; "dokun ve gir"
//   1 · ALEV     kıvılcım kandil alevine dönüşür, ışık yayılır
//   2 · DESEN    ışıkla İslami geometrik desen (rub'ul hizb) kendini çizer
//   3 · SELAM    desen döner, kişiye adıyla seslenilir
//   4 · AÇILIŞ   ışık patlar, oda görünür
//
// SES: services/donusAudio.js — Web Audio ile üretilir, kayıt yoktur
// (telifsiz). Tarayıcı dokunuşsuz ses çalmaya izin vermediği için sahne
// kullanıcının dokunuşuyla başlar; bu aynı zamanda girişi bilinçli kılar.

const GOLD = '#F0B429';
const GLOW = '#FFD76A';

// YENİ EŞİK (docs/YENI_OZELLIKLER.md 7.3) — "Kapı hep açıktı"
// Kapı bir engel değil: zaten ARALIKTIR, kandilin ışığı aralıktan sızar. Kişi dokununca kapıyı o
// itmez; kanatlar kendiliğinden açılır. Tasvir yok: yalnız kapı, kemer, ışık, desen.
// Her evrenin kendi ışık rengi ve makamı vardır.
const PHASE_LIGHT = {
  kapi:  { light: '#F0B429', floor: '#1A1208' },
  temel: { light: '#34D399', floor: '#06140F' },
  bag:   { light: '#7DA2FF', floor: '#0A0F1F' },
  ahlak: { light: '#F7A8B8', floor: '#1A0D11' },
  kok:   { light: '#D9A066', floor: '#140E08' },
};
const WOOD = '#3A2614';
const WOOD_DARK = '#24170B';

/** Tek kapı kanadı: ahşap, çivili, üstü sivri kemere uyar. */
function Leaf({ side, open, ajar, reduce }) {
  const sign = side === 'left' ? -1 : 1;
  const angle = open ? sign * 104 : ajar ? sign * 9 : 0;
  return (
    <motion.div
      initial={false}
      animate={reduce ? { opacity: open ? 0 : 1 } : { rotateY: angle }}
      transition={{ duration: reduce ? 0.4 : 2.0, ease: [0.2, 0.8, 0.2, 1] }}
      style={{
        position: 'absolute', top: 0, bottom: 0, width: '50%', [side]: 0,
        transformOrigin: side === 'left' ? 'left center' : 'right center',
        background: `linear-gradient(${side === 'left' ? 90 : 270}deg, ${WOOD_DARK}, ${WOOD} 55%, ${WOOD_DARK})`,
        borderRadius: side === 'left' ? '120px 0 0 0' : '0 120px 0 0',
        boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)', backfaceVisibility: 'hidden',
      }}>
      {/* tahta araları */}
      {[25, 50, 75].map((x) => (
        <span key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: 1, background: 'rgba(0,0,0,0.35)' }} />
      ))}
      {/* çiviler */}
      {[18, 38, 58, 78].map((y) => [22, 72].map((x) => (
        <span key={`${x}-${y}`} style={{ position: 'absolute', top: `${y}%`, left: `${x}%`, width: 7, height: 7, borderRadius: 4, background: '#8A6A2F', boxShadow: '0 1px 0 rgba(0,0,0,0.5)' }} />
      )))}
      {/* halka tokmak */}
      <span style={{ position: 'absolute', top: '52%', [side === 'left' ? 'right' : 'left']: 12, width: 18, height: 18, borderRadius: 9, border: '2px solid #B08A3A' }} />
    </motion.div>
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

export default function GateAnimation({ onDone }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const tt = useTx();
  const [phase, setPhase] = useState(0); // 0 eşikte · 1 alev · 2 desen · 3 selam · 4 açılış
  const [sound, setSound] = useState(() => isGateSoundOn());
  const started = useRef(false);
  const timers = useRef([]);

  const name = (user?.name || '').split(' ')[0];
  const day = getReturnDay();
  const evre = getTodayPhase(day) || { id: 'kapi', name: 'Kapı' };
  const L = PHASE_LIGHT[evre.id] || PHASE_LIGHT.kapi;
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sahne zamanlaması tek seferde kurulur. (Daha önce bu bir useEffect
  // içindeydi ve phase değişince kendi zamanlayıcılarını temizliyordu —
  // sahne ikinci perdede takılıp kalıyordu.)
  const enter = useCallback(() => {
    if (started.current) return;
    started.current = true;
    playGate(evre.id);
    setPhase(1);
    // 1 nefes+kapı açılır · 2 desen · 3 selam · 4 oda
    timers.current = [
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 3800),
      setTimeout(() => setPhase(4), 5600),
      setTimeout(() => onDone && onDone(), 6300),
    ];
  }, [onDone, evre.id]);

  const skip = (e) => { e.stopPropagation(); timers.current.forEach(clearTimeout); stopGate(); onDone && onDone(); };

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    stopGate();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[130] overflow-hidden flex flex-col items-center justify-center select-none"
      style={{ background: `radial-gradient(ellipse at 50% 55%, ${L.floor} 0%, #050403 75%)` }}
      exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      onClick={enter} data-testid="donus-gate">

      {/* Her an geçilebilir */}
      {phase > 0 && phase < 4 && (
        <button onClick={skip} className="absolute top-5 left-5 z-30 text-[11px] font-bold px-3 py-2 rounded-xl"
          style={{ color: theme.textSecondary, background: 'rgba(255,255,255,0.06)' }}>{tt('Geç')}</button>
      )}

      {/* KAPI — sivri kemer içinde çift kanat; phase 0'da aralık, 1'de açılır */}
      <AnimatePresence>
        {phase < 3 && (
          <motion.div className="absolute" exit={{ opacity: 0, scale: 1.25 }} transition={{ duration: 0.9 }}
            style={{ width: 236, height: 372, perspective: 1200, zIndex: 5 }} aria-hidden>
            {/* kemer çerçevesi */}
            <div style={{ position: 'absolute', inset: -10, borderRadius: '132px 132px 6px 6px', border: `2px solid ${alpha(L.light, 0.45)}`, boxShadow: `0 0 40px ${alpha(L.light, phase === 0 ? 0.12 : 0.4)}` }} />
            {/* kapının ardındaki ışık */}
            <motion.div style={{ position: 'absolute', inset: 0, borderRadius: '120px 120px 0 0', background: `radial-gradient(ellipse at 50% 60%, #FFF6D8 0%, ${L.light} 38%, ${alpha(L.light, 0.1)} 100%)` }}
              animate={{ opacity: phase === 0 ? [0.55, 0.85, 0.55] : 1 }}
              transition={phase === 0 ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 1.2 }} />
            <Leaf side="left" ajar={phase === 0} open={phase >= 1} reduce={reduce} />
            <Leaf side="right" ajar={phase === 0} open={phase >= 1} reduce={reduce} />
            {/* eşiğin altından sızan ışık */}
            <motion.div style={{ position: 'absolute', left: '-30%', right: '-30%', bottom: -70, height: 90, background: `radial-gradient(ellipse at 50% 0%, ${alpha(L.light, 0.55)} 0%, transparent 70%)` }}
              animate={{ opacity: phase === 0 ? [0.3, 0.6, 0.3] : 1, scaleX: phase >= 1 ? 1.8 : 1 }}
              transition={phase === 0 ? { duration: 3.2, repeat: Infinity } : { duration: 1.6 }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ses anahtarı — sahne başlamadan önce kapatılabilir */}
      {phase === 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); const v = !sound; setSound(v); setGateSound(v); }}
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

      {/* Geometrik desen */}
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
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: phase === 0 ? 0.55 : 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}>
            <div className="relative flex items-end justify-center" style={{ height: 92 }}>
              <Flame scale={phase === 0 ? 0.7 : 1.15} />
            </div>
            {/* Kandil gövdesi */}
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
            transition={{ delay: 0.5 }}
            className="absolute bottom-28 text-center px-10">
            <motion.p className="text-[15px] font-black tracking-wide"
              animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2.6, repeat: Infinity }}
              style={{ color: GOLD, fontFamily: 'Playfair Display, serif' }}>
              {tt('Dokun ve içeri gir')}
            </motion.p>
            <p className="text-[10.5px] mt-2" style={{ color: theme.textSecondary }}>
              {tt('Kapı hep açıktı')}
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
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: GOLD }}>
              {tt('Dönüş Odası')}
            </p>
            <h1 className="text-[30px] font-black leading-tight"
              style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
              {name ? `${tt('Hoş geldin')}, ${name}` : tt('Hoş geldin')}
            </h1>
            <motion.p className="text-[12px] mt-3 leading-relaxed"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
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
