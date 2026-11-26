import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, WifiOff } from 'lucide-react';
import {
  GUNLUK_HEDEF, bugunAnahtari, benimKatkim, toplamKatkim, toplamiDinle, salavatEkle, gonder, bekleyenVar,
} from '../../services/salavat';

// 🤲 ORTAK SALAVAT — "Bugün hep birlikte".
// Ortada sekiz köşeli yıldızlı bir mühür; çevresindeki altın halka günün ortak hedefine doğru dolar.
// Alttaki geniş alana her dokunuş bir salavat. Sayılar yarış değildir: kimin ne kadar getirdiği görünmez, sıralama yok.

const ZEMIN = 'radial-gradient(120% 80% at 50% 0%, #14523F 0%, #08241B 55%, #04130E 100%)';
const ALTIN = '#D8B76A';
const KREM = '#F4EFE3';
const SAY = (n) => n.toLocaleString('tr-TR');

const SALAVATLAR = [
  {
    id: 'kisa',
    ad: 'Kısa Salavat',
    ar: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ',
    okunus: 'Allâhümme salli alâ seyyidinâ Muhammed',
    mana: "Allah'ım, efendimiz Muhammed'e salât eyle.",
  },
  {
    id: 'ummiyye',
    ad: 'Salât-ı Ümmiyye',
    ar: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ',
    okunus: "Allâhümme salli alâ seyyidinâ Muhammedini'n-nebiyyi'l-ümmiyyi ve alâ âlihî ve sahbihî ve sellim",
    mana: "Allah'ım! Ümmî peygamber efendimiz Muhammed'e, âline ve ashâbına salât ve selâm eyle.",
  },
  {
    id: 'salli',
    ad: 'Salât-ı İbrâhîmiyye',
    ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ',
    okunus: 'Allâhümme salli alâ Muhammedin ve alâ âli Muhammed, kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhîm',
    mana: "Allah'ım! İbrâhim'e ve İbrâhim'in âline salât ettiğin gibi Muhammed'e ve Muhammed'in âline de salât eyle.",
  },
];

function Muhur({ oran, toplam }) {
  const R = 118; const C = 2 * Math.PI * R;
  return (
    <div style={{ position: 'relative', width: 280, height: 280 }}>
      <svg width="280" height="280" viewBox="0 0 280 280" aria-hidden style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="sv-altin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F3DDA0" /><stop offset="1" stopColor="#B8913F" />
          </linearGradient>
        </defs>
        <circle cx="140" cy="140" r={R} fill="none" stroke="rgba(216,183,106,0.16)" strokeWidth="10" />
        <motion.circle cx="140" cy="140" r={R} fill="none" stroke="url(#sv-altin)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C} initial={false} animate={{ strokeDashoffset: C * (1 - Math.min(1, oran)) }}
          transition={{ type: 'spring', stiffness: 40, damping: 18 }} transform="rotate(-90 140 140)" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * 2 * Math.PI;
          return <circle key={i} cx={140 + Math.cos(a) * 100} cy={140 + Math.sin(a) * 100} r={i % 3 === 0 ? 1.8 : 1} fill={ALTIN} opacity={0.5} />;
        })}
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '140px 140px' }}>
          <rect x="80" y="80" width="120" height="120" fill="rgba(15,92,70,0.55)" stroke={ALTIN} strokeWidth="1.4" />
          <rect x="80" y="80" width="120" height="120" fill="rgba(15,92,70,0.55)" stroke={ALTIN} strokeWidth="1.4" transform="rotate(45 140 140)" />
        </motion.g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span style={{ fontSize: 11, letterSpacing: 2.2, color: ALTIN, fontWeight: 800 }}>BUGÜN</span>
        <motion.span key={Math.floor(toplam / 10)} initial={{ scale: 1.06 }} animate={{ scale: 1 }}
          style={{ fontFamily: '"Fraunces", serif', fontSize: 40, fontWeight: 800, color: KREM, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
          {SAY(toplam)}
        </motion.span>
        <span style={{ fontSize: 12.5, color: 'rgba(244,239,227,0.7)', fontVariantNumeric: 'tabular-nums' }}>hedef {SAY(GUNLUK_HEDEF)}</span>
      </div>
    </div>
  );
}

export default function OrtakSalavatPage() {
  const navigate = useNavigate();
  const gun = bugunAnahtari();
  const [uzak, setUzak] = useState(0);          // sunucudaki toplam
  const [yerelEk, setYerelEk] = useState(0);    // bu oturumda henüz sunucuya yansımamış katkı
  const [benim, setBenim] = useState(() => benimKatkim(gun));
  const [hata, setHata] = useState(false);
  const [kivilcim, setKivilcim] = useState([]);
  const [seciliSalavat, setSeciliSalavat] = useState(0);
  const sonUzak = useRef(0);
  const aktifSalavat = SALAVATLAR[seciliSalavat] || SALAVATLAR[0];

  useEffect(() => {
    gonder();
    const bitir = toplamiDinle(gun, (t) => {
      // Sunucu toplamı arttıkça yereldeki "yansımamış" kısmı düş.
      const fark = t - sonUzak.current; sonUzak.current = t;
      setUzak(t); setHata(false);
      if (fark > 0) setYerelEk((y) => Math.max(0, y - fark));
    }, () => setHata(true));
    const cevrim = () => gonder();
    window.addEventListener('online', cevrim);
    const ayril = () => gonder();
    window.addEventListener('pagehide', ayril);
    return () => { bitir(); window.removeEventListener('online', cevrim); window.removeEventListener('pagehide', ayril); gonder(); };
  }, [gun]);

  const toplam = uzak + yerelEk;
  const oran = toplam / GUNLUK_HEDEF;

  const dokun = (e) => {
    const n = salavatEkle(1);
    setBenim(n); setYerelEk((y) => y + 1);
    try { navigator.vibrate?.(12); } catch { /* yok */ }
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || r.left + r.width / 2) - r.left; const y = (e.clientY || r.top + r.height / 2) - r.top;
    const id = Date.now() + Math.random();
    setKivilcim((k) => [...k.slice(-8), { id, x, y }]);
    setTimeout(() => setKivilcim((k) => k.filter((s) => s.id !== id)), 900);
  };

  return (
    <div data-testid="ortak-salavat" style={{ minHeight: '100vh', background: ZEMIN, color: KREM, paddingBottom: 120, display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 16px 0' }}>
        <button type="button" onClick={() => navigate(-1)} aria-label="Geri"
          style={{ width: 44, height: 44, borderRadius: 22, border: '1px solid rgba(216,183,106,0.35)', background: 'rgba(255,255,255,0.05)', color: KREM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={22} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontFamily: '"Fraunces", serif', fontSize: 24, fontWeight: 800 }}>Ortak Salavat</h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(244,239,227,0.65)' }}>Bugün hep birlikte</p>
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}><Muhur oran={oran} toplam={toplam} /></div>

      <AnimatePresence>
        {oran >= 1 && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', margin: '0 20px 6px', color: ALTIN, fontWeight: 800 }}>
            Bugünün hedefi tamamlandı. Elhamdülillah; salavat sürüyor.
          </motion.p>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '6px 20px 0', flexWrap: 'wrap' }}>
        {SALAVATLAR.map((s, idx) => {
          const on = idx === seciliSalavat;
          return (
            <button key={s.id} type="button" onClick={() => setSeciliSalavat(idx)}
              style={{ padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: on ? ALTIN : 'rgba(255,255,255,0.06)', color: on ? '#1A1A1A' : KREM,
                border: `1px solid ${on ? ALTIN : 'rgba(216,183,106,0.25)'}` }}>
              {s.ad}
            </button>
          );
        })}
      </div>

      <div style={{ margin: '8px 20px 0', padding: '16px 18px', borderRadius: 22, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(216,183,106,0.25)', textAlign: 'center' }}>
        <p lang="ar" dir="rtl" style={{ margin: 0, fontFamily: '"Amiri", "Scheherazade New", "Noto Naskh Arabic", serif', fontSize: 25, lineHeight: 1.7, color: KREM }}>
          {aktifSalavat.ar}
        </p>
        <p style={{ margin: '4px 0 2px', fontFamily: '"Fraunces", serif', fontStyle: 'italic', fontSize: 15.5, color: ALTIN }}>{aktifSalavat.okunus}</p>
        <p style={{ margin: 0, fontSize: 12.5, color: 'rgba(244,239,227,0.7)' }}>{aktifSalavat.mana}</p>
      </div>

      <motion.button type="button" data-testid="salavat-dokun" onClick={dokun} whileTap={{ scale: 0.97 }} aria-label="Salavat getir"
        style={{ position: 'relative', overflow: 'hidden', margin: '16px 20px 0', minHeight: 150, borderRadius: '90px 90px 26px 26px', cursor: 'pointer',
          background: 'linear-gradient(180deg, rgba(216,183,106,0.22), rgba(216,183,106,0.08))', border: `1.5px solid ${ALTIN}`, color: KREM,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, WebkitTapHighlightColor: 'transparent' }}>
        <span style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 800 }}>Dokun, salavat getir</span>
        <span style={{ fontSize: 13, color: 'rgba(244,239,227,0.7)' }}>Her dokunuş bir salavat</span>
        <AnimatePresence>
          {kivilcim.map((s) => (
            <motion.span key={s.id} aria-hidden initial={{ opacity: 1, y: 0, scale: 0.8 }} animate={{ opacity: 0, y: -60, scale: 1.2 }} exit={{ opacity: 0 }} transition={{ duration: 0.85 }}
              style={{ position: 'absolute', left: s.x - 14, top: s.y - 14, color: ALTIN, fontWeight: 900, fontSize: 18, pointerEvents: 'none' }}>
              +1
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.button>

      <div style={{ display: 'flex', gap: 10, margin: '14px 20px 0' }}>
        {[['Bugün senin', benim], ['Bugüne kadar', toplamKatkim()]].map(([ad, n]) => (
          <div key={ad} style={{ flex: 1, padding: '10px 12px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'rgba(244,239,227,0.6)', letterSpacing: 1 }}>{ad.toUpperCase()}</div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{SAY(n)}</div>
          </div>
        ))}
      </div>

      {(hata || bekleyenVar()) && (
        <p style={{ margin: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: 12.5, color: 'rgba(244,239,227,0.7)' }}>
          <WifiOff size={14} aria-hidden /> Bağlantı yoksa katkın cihazında bekler, internet gelince eklenir.
        </p>
      )}

      <blockquote style={{ margin: '18px 24px 0', padding: '0 0 0 12px', borderInlineStart: `2px solid ${ALTIN}`, fontSize: 13.5, lineHeight: 1.55, color: 'rgba(244,239,227,0.82)' }}>
        "Kim bana bir salavat getirirse, Allah da ona on rahmet eder."
        <footer style={{ marginTop: 4, fontSize: 11.5, color: ALTIN }}>Müslim, Salât 70 (408)</footer>
      </blockquote>
      <p style={{ margin: '12px 24px 0', fontSize: 11.5, color: 'rgba(244,239,227,0.5)', lineHeight: 1.5 }}>
        Sayı bir yarış değildir: kimin ne kadar getirdiği kimseye görünmez, sıralama yoktur. Sunucuya yalnız sayı gider; kimlik ve konum gitmez.
      </p>
    </div>
  );
}
