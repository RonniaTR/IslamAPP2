import React, { useEffect, useMemo, useRef, useState } from 'react';
import { APP_NAME, TAGLINE } from '../config/brand';
import { GECE, NurKemer, reducedMotion } from './giris/giriSahne';

// 🔰 MÜHÜR AÇILIŞI — İslamiApp'in kendi açılışı (60 fps sürümü).
//
//  0. İlk kare: koyu zümrüt zemin ve ortada altın, sekiz köşeli yıldız. Bu kare telefonun açılış ekranıyla
//     (resources/splash.png) ve sayfa yüklenirken görünen HTML ile (public/index.html) BİREBİR aynıdır.
//  1. Yıldızın uçlarından ekranın kenarlarına geometrik ışık çizgileri (girih) yayılır.
//  2. Yıldız 45° döner ve küçülür; yerinde kemer amblemi belirir, içinde hilal.
//  3. "İslamiApp" harfleri tek tek yükselir, altında altın bir çizgi uzanır.
//  4. Çıkış: amblemin olduğu yerde sivri kemer biçiminde bir pencere açılır ve büyür; uygulama kemerin içinden görünür.
//
// AKICILIK: Bütün hareketler CSS animasyonudur ve YALNIZ transform/opacity değişir. Tarayıcı bunları ekran kartında
// (compositor) oynatır; arka planda sayfa parçaları indirilip işlenirken bile kare atlamaz. Zamanlama da CSS'tedir
// (JS zamanlayıcısına bağlı değildir); bitiş animationend olayıyla bildirilir.
//
// Günün ilk açılışında tam sürüm (~2,1 sn), aynı gün sonraki açılışlarda kısa sürüm (~1,1 sn). Dokunan hemen geçer.

const ZEMIN = '#08241B';
const ALTIN = GECE.gold;
const GUN_ANAHTARI = 'acilis_son_gun';
// Sivri kemer, merkez (0,0): genişlik 40, yükseklik 56
const KEMER = 'M-20 28 V-4 Q-20 -22 0 -28 Q20 -22 20 -4 V28 Z';
const KEMER_OLCU = 1.9; // amblem boyu (≈ 76 px genişlik)

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
  try {
    const bugun = new Date().toISOString().slice(0, 10);
    const son = localStorage.getItem(GUN_ANAHTARI);
    localStorage.setItem(GUN_ANAHTARI, bugun);
    bugunKarari = son === bugun;
  } catch { bugunKarari = false; }
  return bugunKarari;
}

export default function SplashScreen({ onComplete }) {
  const azHareket = useMemo(() => reducedMotion(), []);
  const kisa = useMemo(() => bugunMu() || azHareket, [azHareket]);
  const k = kisa ? 0.5 : 1;                  // zaman ölçeği
  const T = +(1.55 * k).toFixed(3);          // çıkışın başladığı an (sn)
  const [hemen, setHemen] = useState(false); // dokununca hemen çık
  const bitti = useRef(false);
  const ekran = useMemo(() => ({
    w: Math.max((typeof window !== 'undefined' && window.innerWidth) || 0, 390),
    h: Math.max((typeof window !== 'undefined' && window.innerHeight) || 0, 844),
  }), []);
  const cx = ekran.w / 2;
  const cy = ekran.h * 0.47;
  // iOS Safari GPU bellek sınırını (WebKit SVG maske dokusu) aşmamak için ölçek güvenli sınırda tutulur
  const olcek = Math.min(6, Math.max(3, Math.ceil((Math.max(ekran.w, ekran.h) * 0.6) / (28 * KEMER_OLCU))));

  const bitir = () => {
    if (bitti.current) return;
    bitti.current = true;
    onComplete();
  };

  useEffect(() => {
    // Emniyet: animationend herhangi bir sebeple (iOS Safari / WebView) gelmezse
    const sure = azHareket ? 180 : Math.min(1800, (T + 0.65) * 1000);
    const t = setTimeout(bitir, sure);
    return () => clearTimeout(t);
  }, []); // eslint bilinçli: tek sefer

  const hemenGec = () => {
    setHemen(true);
    setTimeout(bitir, 200);
  };

  if (azHareket) {
    return <div data-testid="splash-screen" className="acl acl-az" style={{ background: ZEMIN }} onClick={bitir} role="presentation" />;
  }

  const harfler = Array.from(APP_NAME);
  const kokStil = { '--k': k, '--T': `${T}s`, '--S': olcek, '--cx': `${cx}px`, '--cy': `${cy}px` };

  return (
    <div
      data-testid="splash-screen"
      className={`acl${hemen ? ' acl-hemen' : ''}`}
      style={kokStil}
      onClick={hemenGec}
      role="presentation"
    >
      {/* B · Delikli örtü: ortasında amblem büyüklüğünde kemer penceresi var; çıkışta büyür */}
      <div className="acl-k acl-ortu" onAnimationEnd={(e) => { if (e.animationName.startsWith('acl-ac')) bitir(); }}>
        <svg aria-hidden width={ekran.w} height={ekran.h} style={{ display: 'block' }}>
          <defs>
            <mask id="acl-maske" maskUnits="userSpaceOnUse" x="0" y="0" width={ekran.w} height={ekran.h}>
              <rect width={ekran.w} height={ekran.h} fill="#fff" />
              <path d={KEMER} fill="#000" transform={`translate(${cx} ${cy}) scale(${KEMER_OLCU})`} />
            </mask>
            <radialGradient id="acl-isik-b" cx="50%" cy="45%" r="60%">
              <stop offset="0" stopColor="#14523F" /><stop offset="0.55" stopColor={ZEMIN} /><stop offset="1" stopColor="#04130E" />
            </radialGradient>
          </defs>
          <g mask="url(#acl-maske)">
            <rect width={ekran.w} height={ekran.h} fill="url(#acl-isik-b)" />
          </g>
        </svg>
      </div>

      {/* Kemer penceresinin altın kenarı: örtüyle birlikte büyür, parlayıp söner */}
      <div className="acl-k acl-kenar" aria-hidden>
        <svg width={ekran.w} height={ekran.h} style={{ display: 'block' }}>
          <path d={KEMER} fill="none" stroke={ALTIN} strokeWidth={1.2 / KEMER_OLCU} transform={`translate(${cx} ${cy}) scale(${KEMER_OLCU})`} />
        </svg>
      </div>

      {/* A · Dolu örtü: giriş boyunca kemer penceresini kapatır; çıkışın ilk karesinde kaybolur */}
      <div className="acl-k acl-dolgu" aria-hidden>
        <div className="acl-k acl-isik" />
      </div>

      {/* Girih: yıldızın uçlarından kenarlara uzanan ışık çizgileri */}
      <div className="acl-k acl-girih" aria-hidden>
        <svg width={ekran.w} height={ekran.h} style={{ display: 'block' }}>
          <g transform={`translate(${cx} ${cy})`}>
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i * Math.PI) / 8;
              const r1 = i % 2 ? 70 : 52;
              const r2 = Math.max(ekran.w, ekran.h);
              return (
                <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
                  stroke={ALTIN} strokeWidth={i % 2 ? 0.6 : 1} strokeOpacity={i % 2 ? 0.18 : 0.32} />
              );
            })}
          </g>
        </svg>
      </div>
      <div className="acl-k acl-halka" aria-hidden>
        <svg width={ekran.w} height={ekran.h} style={{ display: 'block' }}>
          <g transform={`translate(${cx} ${cy})`}>
            {[120, 190].map((r, j) => (
              <polygon key={r}
                points={Array.from({ length: 8 }, (_, i) => `${Math.cos((i * Math.PI) / 4 + Math.PI / 8) * r},${Math.sin((i * Math.PI) / 4 + Math.PI / 8) * r}`).join(' ')}
                fill="none" stroke={ALTIN} strokeOpacity={0.2 - j * 0.07} strokeWidth="0.8" />
            ))}
          </g>
        </svg>
      </div>

      {/* Orta: yıldız → kemer amblemi, ad ve slogan */}
      <div className="acl-orta" style={{ top: cy - 44 }}>
        <div style={{ position: 'relative', width: 88, height: 88 }}>
          <div className="acl-yildiz"><SekizYildiz /></div>
          <div className="acl-amblem"><NurKemer size={76} draw={false} /></div>
        </div>
        <div style={{ position: 'relative', marginTop: 22 }}>
          <h1 aria-label={APP_NAME} className="acl-ad" style={{ color: GECE.ink }}>
            {harfler.map((h, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span key={i} aria-hidden className="acl-harf" style={{ '--i': i }}>{h}</span>
            ))}
          </h1>
          <span className="acl-cizgi" aria-hidden />
        </div>
        <p className="acl-slogan" style={{ color: ALTIN }}>{TAGLINE}</p>
      </div>
    </div>
  );
}
