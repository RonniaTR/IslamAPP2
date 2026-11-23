import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { APP_NAME, TAGLINE } from '../config/brand';
import { GECE, NurKemer, reducedMotion } from './giris/giriSahne';

// 🔰 MÜHÜR AÇILIŞI — İslamiApp'in kendi açılışı.
//
//  0. İlk kare: koyu zümrüt zemin ve ortada altın, sekiz köşeli yıldız. Bu kare telefonun kendi açılış ekranıyla
//     (resources/splash.png) ve sayfa yüklenirken görünen HTML ile (public/index.html) BİREBİR aynıdır;
//     bu yüzden üç aşama arasında hiçbir kesinti görünmez.
//  1. Yıldızın uçlarından ekranın kenarlarına geometrik ışık çizgileri (girih) uzanır.
//  2. Yıldız 45° döner ve küçülür; yerinde kemer amblemi kendini çizer, içinde hilal belirir.
//  3. "İslamiApp" harfleri tek tek yükselir, üzerinden altın bir ışık geçer.
//  4. Çıkış: ekranın ortasında sivri kemer biçiminde bir pencere açılır ve büyür; uygulama o kemerin içinden görünür.
//
// Günün ilk açılışında tam sürüm (~2 sn), aynı gün sonraki açılışlarda kısa sürüm (~0,9 sn). Dokunan hemen geçer.

const ZEMIN = '#08241B';
const ALTIN = GECE.gold;
const GUN_ANAHTARI = 'acilis_son_gun';
// Sivri kemer, merkez (0,0): genişlik 40, yükseklik 56
const KEMER = 'M-20 28 V-4 Q-20 -22 0 -28 Q20 -22 20 -4 V28 Z';

export function SekizYildiz({ boyut = 88, renk = ALTIN, kalinlik = 2 }) {
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 100 100" aria-hidden>
      <rect x="20" y="20" width="60" height="60" fill="none" stroke={renk} strokeWidth={kalinlik} />
      <rect x="20" y="20" width="60" height="60" fill="none" stroke={renk} strokeWidth={kalinlik} transform="rotate(45 50 50)" />
    </svg>
  );
}

// Karar modül düzeyinde bir kez verilir: akış yeniden kurulsa da (giriş durumu değişince) açılış aynı kalır.
let bugunKarari = null;
function bugunMu() {
  if (bugunKarari !== null) return bugunKarari;
  bugunKarari = ilkKontrol();
  return bugunKarari;
}
function ilkKontrol() {
  try {
    const bugun = new Date().toISOString().slice(0, 10);
    const son = localStorage.getItem(GUN_ANAHTARI);
    localStorage.setItem(GUN_ANAHTARI, bugun);
    return son === bugun;
  } catch { return false; }
}

export default function SplashScreen({ onComplete }) {
  const kisa = useMemo(() => bugunMu() || reducedMotion(), []);
  const k = kisa ? 0.45 : 1; // zaman ölçeği
  const [evre, setEvre] = useState('giris'); // giris → cikis
  const bitti = useRef(false);
  const ekran = useMemo(() => ({ w: window.innerWidth, h: window.innerHeight }), []);
  const kemerOlcek = (Math.max(ekran.w, ekran.h) / 20) * 1.9;

  const bitir = () => {
    if (bitti.current) return;
    bitti.current = true;
    onComplete();
  };

  useEffect(() => {
    if (reducedMotion()) { const t = setTimeout(bitir, 250); return () => clearTimeout(t); }
    const t1 = setTimeout(() => setEvre('cikis'), 1550 * k);
    const t2 = setTimeout(bitir, 1550 * k + 620);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const gec = () => { if (evre === 'giris') setEvre('cikis'); setTimeout(bitir, 560); };
  const cikis = evre === 'cikis';
  const harfler = Array.from(APP_NAME);

  return (
    <motion.div
      data-testid="splash-screen"
      onClick={gec}
      role="presentation"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      style={{ position: 'fixed', inset: 0, zIndex: 3000, overflow: 'hidden', cursor: 'pointer' }}
    >
      {/* Zemin: çıkışta ortasından kemer biçiminde delinir */}
      <svg aria-hidden width={ekran.w} height={ekran.h} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <mask id="ma-kemer" maskUnits="userSpaceOnUse" x="0" y="0" width={ekran.w} height={ekran.h}>
            <rect width={ekran.w} height={ekran.h} fill="#fff" />
            <g transform={`translate(${ekran.w / 2} ${ekran.h * 0.47})`}>
              <motion.path
                d={KEMER}
                fill="#000"
                initial={{ scale: 0 }}
                animate={{ scale: cikis ? kemerOlcek : 0 }}
                transition={{ duration: 0.62, ease: [0.7, 0, 0.25, 1] }}
                style={{ transformOrigin: '0px 0px' }}
              />
            </g>
          </mask>
          <radialGradient id="ma-isik" cx="50%" cy="45%" r="60%">
            <stop offset="0" stopColor="#14523F" /><stop offset="0.55" stopColor={ZEMIN} /><stop offset="1" stopColor="#04130E" />
          </radialGradient>
        </defs>
        <g mask="url(#ma-kemer)">
          <rect width={ekran.w} height={ekran.h} fill={ZEMIN} />
          <motion.rect width={ekran.w} height={ekran.h} fill="url(#ma-isik)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 * k }} />
          {/* Kemerin kenarında altın ışık çizgisi */}
          <g transform={`translate(${ekran.w / 2} ${ekran.h * 0.47})`}>
            <motion.path
              d={KEMER}
              fill="none"
              stroke={ALTIN}
              strokeWidth={0.12}
              initial={{ scale: 0, opacity: 0 }}
              animate={cikis ? { scale: kemerOlcek, opacity: [0, 1, 0] } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.62, ease: [0.7, 0, 0.25, 1] }}
              style={{ transformOrigin: '0px 0px' }}
            />
          </g>
        </g>
      </svg>

      {/* Girih: yıldızın uçlarından kenarlara uzanan ışık çizgileri */}
      <motion.svg
        aria-hidden
        width={ekran.w}
        height={ekran.h}
        style={{ position: 'absolute', inset: 0 }}
        animate={{ opacity: cikis ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <g transform={`translate(${ekran.w / 2} ${ekran.h * 0.47})`}>
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i * Math.PI) / 8;
            const r1 = i % 2 ? 70 : 52;
            const r2 = Math.max(ekran.w, ekran.h);
            return (
              <motion.line
                key={i}
                x1={Math.cos(a) * r1}
                y1={Math.sin(a) * r1}
                x2={Math.cos(a) * r2}
                y2={Math.sin(a) * r2}
                stroke={ALTIN}
                strokeWidth={i % 2 ? 0.6 : 1}
                strokeOpacity={i % 2 ? 0.18 : 0.32}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.75 * k, delay: 0.08 * k + (i % 4) * 0.03, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}
          {[120, 190].map((r, j) => (
            <motion.polygon
              key={r}
              points={Array.from({ length: 8 }, (_, i) => `${Math.cos((i * Math.PI) / 4 + Math.PI / 8) * r},${Math.sin((i * Math.PI) / 4 + Math.PI / 8) * r}`).join(' ')}
              fill="none"
              stroke={ALTIN}
              strokeOpacity={0.2 - j * 0.07}
              strokeWidth="0.8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9 * k, delay: 0.25 * k + j * 0.1 }}
            />
          ))}
        </g>
      </motion.svg>

      {/* Orta: yıldız → kemer amblemi, ad ve slogan */}
      <motion.div
        animate={cikis ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute', left: 0, right: 0, top: ekran.h * 0.47 - 44, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{ position: 'relative', width: 88, height: 88 }}>
          <motion.div
            initial={{ rotate: 0, scale: 1, opacity: 1 }}
            animate={{ rotate: 45, scale: 0.35, opacity: 0 }}
            transition={{ duration: 0.5 * k, delay: 0.32 * k, ease: [0.5, 0, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <SekizYildiz />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 * k, delay: 0.42 * k, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', left: 6, top: -12 }}
          >
            <NurKemer size={76} delay={0.4 * k} />
          </motion.div>
        </div>

        <div style={{ position: 'relative', marginTop: 22 }}>
          <h1 aria-label={APP_NAME} style={{ margin: 0, fontFamily: '"Fraunces", "Playfair Display", serif', fontWeight: 800, fontSize: 36, letterSpacing: '0.03em', color: GECE.ink, display: 'flex' }}>
            {harfler.map((h, i) => (
              <motion.span
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                aria-hidden
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 * k, delay: 0.72 * k + i * 0.035 * k, ease: [0.22, 1, 0.36, 1] }}
              >
                {h}
              </motion.span>
            ))}
          </h1>
          {/* Altın ışık geçişi */}
          <motion.div
            aria-hidden
            initial={{ backgroundPosition: '140% 0' }}
            animate={{ backgroundPosition: '-40% 0' }}
            transition={{ duration: 0.75 * k, delay: 1.0 * k, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0, fontFamily: '"Fraunces", "Playfair Display", serif', fontWeight: 800, fontSize: 36, letterSpacing: '0.03em', lineHeight: 'normal',
              color: 'transparent', backgroundImage: 'linear-gradient(100deg, transparent 35%, #FFF4CF 48%, #E9C77E 52%, transparent 65%)', backgroundSize: '250% 100%',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', whiteSpace: 'nowrap',
            }}
          >
            {APP_NAME}
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.24em' }}
          transition={{ duration: 0.6 * k, delay: 1.05 * k }}
          style={{ margin: '8px 0 0', fontSize: 12, textTransform: 'uppercase', color: ALTIN, fontWeight: 700 }}
        >
          {TAGLINE}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
