import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useTx } from '../../i18n';
import { sa } from '../../sade/themes';
import { playSade, stopSade, isSesOn, setSes } from '../../services/sadeAudio';

// 🚪 SADE — AÇILIŞ SAHNELERİ
//
// Her dünyanın kendi kapısı var. Aynı animasyonun rengi değişmiyor —
// SAHNE değişiyor:
//
//   perde (Sükûn)  iki ağır perde yanlara açılır, arkadan ay ışığı düşer
//   safak (Fecr)   ufuk çizgisinden güneş doğar, ışık yukarı yürür
//   kemer (Mihrap) bir kemer aşağıdan yukarı çizilir, içi aydınlanır
//
// Üçü de dokunuşla başlar (tarayıcı sessiz açılışa izin vermez) ve
// dokunuş sesi de tetikler. Ses kapatılabilir; tercih hatırlanır.

const D = { perde: 3400, safak: 3600, kemer: 3800 };

export default function SadeKapi({ tema, onDone }) {
  const tt = useTx();
  const r = tema.renk;
  const [faz, setFaz] = useState(0); // 0 bekliyor · 1 sahne · 2 selam · 3 açılış
  const [ses, setSesState] = useState(() => isSesOn());
  const basladi = useRef(false);
  const zaman = useRef([]);
  const hiz = tema.tempo;

  const gir = useCallback(() => {
    if (basladi.current) return;
    basladi.current = true;
    playSade(tema.ses);
    setFaz(1);
    const T = D[tema.kapi] || 3400;
    zaman.current = [
      setTimeout(() => setFaz(2), T * 0.58),
      setTimeout(() => setFaz(3), T * 0.88),
      setTimeout(() => onDone && onDone(), T + 500),
    ];
  }, [tema, onDone]);

  useEffect(() => () => { zaman.current.forEach(clearTimeout); stopSade(); }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[140] overflow-hidden flex items-center justify-center select-none"
      style={{ background: r.zemin }}
      exit={{ opacity: 0 }} transition={{ duration: 0.55 }}
      onClick={gir} data-testid="sade-kapi">

      {faz === 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); const v = !ses; setSesState(v); setSes(v); }}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center z-30"
          style={{ background: sa(r.vurgu, 0.1), border: `1px solid ${sa(r.vurgu, 0.28)}` }}
          aria-label={tt('Açılış sesi')}>
          {ses ? <Volume2 size={15} style={{ color: r.vurgu }} />
            : <VolumeX size={15} style={{ color: r.soluk }} />}
        </button>
      )}

      {/* ═══════════ SÜKÛN — PERDE ═══════════ */}
      {tema.kapi === 'perde' && (
        <>
          {/* Ay */}
          <motion.div className="absolute rounded-full"
            initial={{ width: 40, height: 40, opacity: 0.5, y: 30 }}
            animate={faz === 0
              ? { opacity: [0.35, 0.7, 0.35], y: 30 }
              : { width: 150, height: 150, opacity: 1, y: -30 }}
            transition={faz === 0
              ? { duration: 3.6 * hiz, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 1.6 * hiz, ease: 'easeOut' }}
            style={{
              background: `radial-gradient(circle at 38% 34%, ${r.vurguIsik}, ${sa(r.vurgu, 0.15)} 62%, transparent 74%)`,
              boxShadow: `0 0 90px ${sa(r.vurguIsik, 0.5)}`,
            }} />
          {/* İki perde */}
          {[-1, 1].map(yan => (
            <motion.div key={yan} className="absolute top-0 bottom-0"
              style={{
                width: '52%', [yan === -1 ? 'left' : 'right']: 0,
                background: `linear-gradient(${yan === -1 ? 100 : 260}deg, ${r.zeminUst}, ${r.zemin})`,
                boxShadow: `0 0 40px ${sa('#000000', 0.6)}`,
              }}
              initial={{ x: 0 }}
              animate={{ x: faz === 0 ? 0 : yan * (faz >= 3 ? 340 : 250) }}
              transition={{ duration: 2.1 * hiz, ease: [0.32, 0, 0.2, 1] }}>
              {/* Perde dokusu */}
              <div className="absolute inset-0" style={{
                background: `repeating-linear-gradient(${yan === -1 ? 92 : 268}deg, ${sa(r.vurgu, 0.05)} 0 5px, transparent 5px 15px)`,
              }} />
            </motion.div>
          ))}
        </>
      )}

      {/* ═══════════ FECR — ŞAFAK ═══════════ */}
      {tema.kapi === 'safak' && (
        <>
          <motion.div className="absolute inset-0"
            animate={{
              background: faz === 0
                ? `linear-gradient(180deg, #0A1420 0%, #1B2B3A 60%, #2E2418 100%)`
                : faz < 3
                  ? `linear-gradient(180deg, #4E6E8C 0%, #D9995C 62%, #F0C078 100%)`
                  : `linear-gradient(180deg, ${r.zeminUst} 0%, ${r.zemin} 100%)`,
            }}
            transition={{ duration: 2.2 * hiz, ease: 'easeInOut' }} />
          {/* Güneş */}
          <motion.div className="absolute rounded-full"
            initial={{ width: 90, height: 90, y: 210, opacity: 0 }}
            animate={faz === 0 ? { opacity: 0.35, y: 210 }
              : faz < 3 ? { opacity: 1, y: 20, width: 130, height: 130 }
                : { opacity: 1, y: -60, width: 900, height: 900 }}
            transition={{ duration: 2.4 * hiz, ease: 'easeOut' }}
            style={{ background: `radial-gradient(circle, #FFF3D2 0%, ${sa('#F0A93C', 0.85)} 34%, transparent 70%)` }} />
          {/* Ufuk */}
          <motion.div className="absolute left-0 right-0"
            animate={{ opacity: faz >= 3 ? 0 : 1, y: faz === 0 ? 190 : 170 }}
            transition={{ duration: 1.4 * hiz }}
            style={{ height: 1, background: `linear-gradient(90deg, transparent, ${sa('#FFE0A0', 0.9)}, transparent)` }} />
          {/* Yükselen ışık zerreleri */}
          {faz >= 1 && Array.from({ length: 12 }, (_, i) => (
            <motion.span key={i} className="absolute rounded-full"
              style={{ width: 3, height: 3, background: '#FFE9BC', left: `${8 + i * 7.5}%` }}
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: -240, opacity: [0, 0.9, 0] }}
              transition={{ duration: 2.6 * hiz, delay: i * 0.09, ease: 'easeOut' }} />
          ))}
        </>
      )}

      {/* ═══════════ MİHRAP — KEMER ═══════════ */}
      {tema.kapi === 'kemer' && (
        <>
          <motion.div className="absolute rounded-full"
            animate={{
              width: faz === 0 ? 120 : faz < 3 ? 420 : 1800,
              height: faz === 0 ? 120 : faz < 3 ? 420 : 1800,
              opacity: faz === 0 ? [0.2, 0.4, 0.2] : 0.75,
            }}
            transition={faz === 0
              ? { duration: 3.2 * hiz, repeat: Infinity }
              : { duration: 1.5 * hiz, ease: 'easeOut' }}
            style={{ background: `radial-gradient(circle, ${sa(r.vurguIsik, 0.5)}, transparent 70%)` }} />
          <svg viewBox="0 0 200 300" style={{ width: 260, height: 390 }} className="absolute" aria-hidden>
            {/* Kemer gövdesi — aşağıdan yukarı çizilir */}
            <motion.path
              d="M30 290 L30 130 Q30 40 100 40 Q170 40 170 130 L170 290"
              fill="none" stroke={r.vurgu} strokeWidth="2" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${sa(r.vurguIsik, 0.9)})` }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: faz >= 1 ? 1 : 0 }}
              transition={{ duration: 1.7 * hiz, ease: 'easeInOut' }} />
            {/* İç kemer */}
            <motion.path
              d="M52 290 L52 136 Q52 62 100 62 Q148 62 148 136 L148 290"
              fill="none" stroke={r.vurgu} strokeWidth="1" strokeLinecap="round" opacity="0.55"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: faz >= 1 ? 1 : 0 }}
              transition={{ duration: 1.7 * hiz, delay: 0.35, ease: 'easeInOut' }} />
            {/* Kilit taşı süsü */}
            <motion.g initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: faz >= 2 ? 1 : 0, scale: faz >= 2 ? 1 : 0.5 }}
              transition={{ duration: 0.9 * hiz }} style={{ transformOrigin: '100px 42px' }}>
              <path d="M100 24 L112 42 L100 60 L88 42 Z" fill="none" stroke={r.vurgu} strokeWidth="1.4" />
              <circle cx="100" cy="42" r="3" fill={r.vurgu} />
            </motion.g>
            {/* Zemin çizgisi */}
            <motion.line x1="18" y1="290" x2="182" y2="290" stroke={r.vurgu} strokeWidth="1.4"
              initial={{ pathLength: 0 }} animate={{ pathLength: faz >= 1 ? 1 : 0 }}
              transition={{ duration: 1.1 * hiz, delay: 0.15 }} />
          </svg>
        </>
      )}

      {/* ── Bekleme daveti ── */}
      <AnimatePresence>
        {faz === 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ delay: 0.45 }}
            className="absolute bottom-24 text-center px-10 z-20">
            <motion.p className="text-[15px] font-black tracking-wide"
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.6 * hiz, repeat: Infinity }}
              style={{ color: tema.kapi === 'safak' ? '#FFE9BC' : r.vurgu, fontFamily: tema.yaziBaslik }}>
              {tt('Dokun')}
            </motion.p>
            <p className="text-[10.5px] mt-2" style={{ color: tema.kapi === 'safak' ? sa('#FFE9BC', 0.7) : r.soluk }}>
              {tema.simge} {tema.ad}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Selam ── */}
      <AnimatePresence>
        {faz === 2 && (
          <motion.div className="absolute text-center px-10 z-20 py-8 rounded-[36px]"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.75 * hiz }}
            style={{
              background: tema.kapi === 'safak'
                ? 'transparent'
                : `radial-gradient(ellipse at center, ${sa(r.zemin, 0.9)} 0%, ${sa(r.zemin, 0.6)} 58%, transparent 78%)`,
            }}>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2"
              style={{ color: tema.kapi === 'safak' ? '#4A2E10' : r.vurgu }}>
              {tema.ad}
            </p>
            <h1 className="text-[27px] font-black leading-tight"
              style={{
                fontFamily: tema.yaziBaslik,
                color: tema.kapi === 'safak' ? '#2A1A08' : r.metin,
              }}>
              {tt('Selamün aleyküm')}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
