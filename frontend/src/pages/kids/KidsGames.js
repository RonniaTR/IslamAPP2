import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../styles/designTokens';
import HikmetCarki from '../games/HikmetCarki';
import MatchGame from '../games/MatchGame';
import WordGame from '../games/WordGame';
import OrderGame from '../games/OrderGame';
import sfx from '../../services/sfx';
import { addStars, getStars } from '../../services/kidsFamily';
import BilgiYarisi from './oyun/BilgiYarisi';
import YildizYolu, { yolOku, durakGec, DURAK_SAYISI } from './oyun/YildizYolu';
import RehberOklar, { rehberGorulduMu } from './oyun/RehberOklar';
import ModKartlari from './oyun/ModKartlari';

// 🌳 OYUN BAHÇESİ — çocuk bölümünün oyunları (14. tur: Yıldız Yolu).
// Üstte üç kemer kart (Yıldız Yolu · Ailece · Bilgi Yarışı), altında durak durak ilerlenen Yıldız Yolu.
// İlk açılışta altın oklar ekranı tanıtır. Bilgi Yarışı'nda üç joker var. Ailece mod aynı telefonda sırayla oynanır
// (çocuk bölümünde internet üzerinden yabancılarla eşleşme yok).
// Dört oyun, dördü de çalışır (önceden kartlar boştu). Süre yok, ceza yok, can yok; doğru cevap yıldız getirir.
// Yıldızlar yalnız bu cihazda tutulur (kids_stars). Sorular çocuk paketinden gelir (data/kidsQuestions.js).
const K = COLORS.kids;
const KIDS = {
  bg: '#F3FAF1', surface: '#FFFFFF', cardBg: '#FFFFFF', cardBorder: 'rgba(45,138,78,0.14)',
  textPrimary: K.text, textSecondary: K.textSecondary, textMuted: '#A0AEB0',
  primary: K.primary, primaryLight: K.primaryLight, gold: '#F2B33D', goldLight: '#FFD93D', accent: '#F2B33D',
  inputBg: '#F3F7F3', inputBorder: 'rgba(0,0,0,0.08)', isDark: false,
};

const GAMES = [
  { id: 'cark', title: 'Bilgi Çarkı', sub: 'Çevir, bil, yıldızları topla', color: '#2D8A4E', bg: '#DFF3E2', Comp: HikmetCarki, props: { kids: true } },
  { id: 'match', title: 'Eşini Bul', sub: 'Kartları eşleştir', color: '#FF9F43', bg: '#FFEFD9', Comp: MatchGame },
  { id: 'word', title: 'Kelime Avı', sub: 'Harfleri bul', color: '#4A90D9', bg: '#E1EEFB', Comp: WordGame },
  { id: 'order', title: 'Sıraya Koy', sub: 'Hangisi önce?', color: '#9B59B6', bg: '#F1E4F7', Comp: OrderGame },
];

// Yol durakları: dört oyun ve Bilgi Yarışı sırayla döner.
const DURAKLAR = [
  { oyun: 'cark', ad: 'Bilgi Çarkı', kisa: 'Çark', renk: '#2D8A4E', golge: '#1E6538' },
  { oyun: 'match', ad: 'Eşini Bul', kisa: 'Eşle', renk: '#FF9F43', golge: '#C9741E' },
  { oyun: 'yarisma', ad: 'Bilgi Yarışı', kisa: 'Yarış', renk: '#E08A1E', golge: '#A9650F' },
  { oyun: 'word', ad: 'Kelime Avı', kisa: 'Kelime', renk: '#4A90D9', golge: '#2F69A8' },
  { oyun: 'order', ad: 'Sıraya Koy', kisa: 'Sırala', renk: '#9B59B6', golge: '#6F3B85' },
];
const REHBER_ADIMLARI = [
  { hedef: 'modlar', metin: 'Üç yolun var: Yıldız Yolu, Ailece oyun ve jokerli Bilgi Yarışı. Birine dokun!', bosluk: 6 },
  { hedef: 'ok', metin: 'Altın ok sıradaki durağı gösterir. Her durak bir oyun; bitirince durak yıldıza döner.', bosluk: 14 },
  { hedef: 'mod-yarisma', metin: "Bilgi Yarışı'nda üç jokerin var: Yarısı, Fener ve İkinci Şans.", bosluk: 6, okYonu: 'sol', okX: 0.4 },
  { hedef: 'yildiz', metin: 'Her doğru cevap bir yıldız. Yıldızların burada birikir.', bosluk: 6 },
];
const REHBER_ANAHTAR = 'kids_oyun_rehber_v1';


/** Gündüz bahçesi: güneş, bulutlar, tepeler, küçük cami. */
function Garden() {
  return (
    <svg viewBox="0 0 360 170" width="100%" height="170" preserveAspectRatio="xMidYMax slice" aria-hidden style={{ display: 'block' }}>
      <defs><linearGradient id="kg-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FD3F4" /><stop offset="1" stopColor="#E6F7FF" /></linearGradient></defs>
      <rect width="360" height="170" fill="url(#kg-sky)" />
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '300px 40px' }}>
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x="298" y="6" width="4" height="12" rx="2" fill="#FFD93D" transform={`rotate(${i * 45} 300 40)`} />)}
      </motion.g>
      <circle cx="300" cy="40" r="18" fill="#FFD93D" />
      {[[60, 36, 0], [170, 24, 3]].map(([x, y, d], i) => (
        <motion.g key={i} animate={{ x: [0, 18, 0] }} transition={{ duration: 9 + d, repeat: Infinity, ease: 'easeInOut' }}>
          <ellipse cx={x} cy={y} rx="26" ry="11" fill="#fff" /><ellipse cx={x + 16} cy={y - 6} rx="16" ry="10" fill="#fff" />
        </motion.g>
      ))}
      <path d="M0 130 Q90 92 180 122 T360 112 V170 H0 Z" fill="#7CC67E" />
      <path d="M0 150 Q120 120 240 146 T360 140 V170 H0 Z" fill="#4CAF50" />
      <g transform="translate(206 92)" fill="#FFFFFF" stroke="#2D8A4E" strokeWidth="2">
        <path d="M0 38 V20 Q0 4 18 2 Q36 4 36 20 V38 Z" /><rect x="44" y="0" width="7" height="38" /><path d="M42 0 L47.5 -12 L53 0 Z" />
        <path d="M14 38 V28 A4 4 0 0 1 22 28 V38" fill="#FFD93D" />
      </g>
      {[[40, 140], [110, 150], [320, 146]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}><circle r="4" fill={['#FF6B8A', '#FFD93D', '#FF9F43'][i]} /><circle r="1.6" fill="#fff" /></g>
      ))}
    </svg>
  );
}

export default function KidsGames() {
  const navigate = useNavigate();
  const [ekran, setEkran] = useState('ana'); // ana | oyun | yarisma | aile-kur | aile
  const [active, setActive] = useState(null);
  const [durak, setDurak] = useState(null);      // yoldan girildiyse durak no
  const [stars, setStars] = useState(getStars);
  const [pop, setPop] = useState(0);
  const [yol, setYol] = useState(yolOku);
  const [kutlama, setKutlama] = useState(null);
  const [rehber, setRehber] = useState(() => !rehberGorulduMu(REHBER_ANAHTAR));
  const [aile, setAile] = useState(['Ben', 'Anne']);
  const [kazanc, setKazanc] = useState(0);   // bu oyunda kazanılan yıldız

  useEffect(() => { window.scrollTo(0, 0); }, [ekran]);

  const onXP = (amount) => {
    const add = Math.max(1, Math.round(amount / 5));
    setKazanc((k) => k + add);
    setStars(addStars(add));
    setPop((p) => p + 1);
  };
  const yildiz = (n) => { setKazanc((k) => k + n); setStars(addStars(n)); setPop((p) => p + 1); };

  const durakBitir = () => {
    const y = durakGec();
    setYol(y.son ? { yol: y.yol, adim: 0 } : y);
    setKutlama(y.son ? `${y.yol - 1}. yol tamam! Yeni yol başlıyor.` : `${durak + 1}. durak geçildi!`);
    setTimeout(() => setKutlama(null), 2200);
    sfx.levelUp?.();
    geri();
  };
  const geri = () => { setEkran('ana'); setActive(null); setDurak(null); setKazanc(0); };

  const durakAc = (dk, i) => {
    if (i !== yol.adim) { if (i < yol.adim) { sfx.tick?.(); } else return; }
    sfx.claim(); setKazanc(0);
    setDurak(i === yol.adim ? i : null);
    if (dk.oyun === 'yarisma') setEkran('yarisma');
    else { setActive(dk.oyun); setEkran('oyun'); }
  };
  const modSec = (id) => {
    sfx.claim();
    if (id === 'yol') { document.querySelector('[data-rehber="ok"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    if (id === 'aile') { setEkran('aile-kur'); return; }
    setKazanc(0); setDurak(null); setEkran('yarisma');
  };

  const game = GAMES.find((g) => g.id === active);
  const font = { fontFamily: "'Nunito', 'Noto Sans', sans-serif" };
  const baslik = ekran === 'oyun' && game ? game.title : ekran === 'yarisma' ? 'Bilgi Yarışı' : ekran.startsWith('aile') ? 'Ailece' : 'Oyun Bahçesi';

  return (
    <div style={{ background: KIDS.bg, minHeight: '100vh', paddingBottom: 130, color: KIDS.textPrimary, ...font }}>
      <div style={{ position: 'relative' }}>
        <Garden />
        <div style={{ position: 'absolute', insetInline: 16, top: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => (ekran !== 'ana' ? geri() : navigate('/kids'))} aria-label="Geri"
            style={{ width: 46, height: 46, borderRadius: 23, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <ChevronLeft size={26} color={K.text} />
          </button>
          <motion.div data-rehber="yildiz" key={pop} initial={{ scale: 1 }} animate={{ scale: pop ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 22, background: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: 18 }}>
            <Star size={20} fill="#FFD93D" color="#F2B33D" /> {stars}
          </motion.div>
        </div>
        <h1 style={{ position: 'absolute', insetInlineStart: 20, bottom: 54, margin: 0, fontSize: 30, fontWeight: 900, color: '#1B4D2E', textShadow: '0 2px 0 #fff' }}>{baslik}</h1>
      </div>

      <AnimatePresence mode="wait">
        {ekran === 'ana' && (
          <motion.div key="ana" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '0 16px', marginTop: -30, position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <ModKartlari onSec={modSec} />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px' }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#1B4D2E' }}>Yıldız Yolu</h2>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#2D8A4E' }}>{yol.yol}. yol · {yol.adim}/{DURAK_SAYISI} durak</span>
            </div>
            <YildizYolu duraklar={DURAKLAR} adim={yol.adim} yolNo={yol.yol} onDurak={durakAc} />
          </motion.div>
        )}

        {ekran === 'oyun' && game && (
          <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ paddingTop: 10 }}>
            <game.Comp theme={KIDS} onXP={onXP} onEvent={() => {}} {...(game.props || {})} />
          </motion.div>
        )}

        {ekran === 'yarisma' && (
          <motion.div key="yarisma" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ paddingTop: 6 }}>
            <BilgiYarisi oyuncular={['Ben']} soruSayisi={6} onYildiz={yildiz} onBitti={() => setKazanc((k) => Math.max(1, k))} />
          </motion.div>
        )}

        {ekran === 'aile-kur' && (
          <motion.div key="aile-kur" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0, fontWeight: 800, color: '#5B7065' }}>Telefonu ortaya koyun, sırayla cevaplayın. Herkesin kendi üç jokeri var.</p>
            {aile.map((ad, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ width: 36, height: 36, borderRadius: 18, background: ['#2D8A4E', '#4A90D9', '#FF9F43', '#9B59B6'][i], color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                <input value={ad} maxLength={12} aria-label={`${i + 1}. oyuncunun adı`} onChange={(e) => setAile((a) => a.map((x, j) => (j === i ? e.target.value : x)))}
                  style={{ flex: 1, minHeight: 50, borderRadius: 16, border: '3px solid #E1EEFB', padding: '0 14px', fontSize: 17, fontWeight: 800, color: '#1B4D2E', fontFamily: 'inherit' }} />
                {aile.length > 2 && <button type="button" aria-label="Çıkar" onClick={() => setAile((a) => a.filter((_, j) => j !== i))} style={{ width: 44, height: 44, borderRadius: 22, border: 'none', background: '#FDE5E0', color: '#C0503F', fontWeight: 900, fontSize: 18 }}>×</button>}
              </div>
            ))}
            {aile.length < 4 && <button type="button" onClick={() => setAile((a) => [...a, ['Baba', 'Kardeş', 'Dede'][a.length - 2] || 'Oyuncu'])} style={{ minHeight: 48, borderRadius: 16, border: '3px dashed #C3DBF5', background: 'transparent', color: '#4A90D9', fontWeight: 900, fontSize: 15 }}>+ Oyuncu ekle</button>}
            <button type="button" data-testid="aile-basla" disabled={aile.some((a) => !a.trim())} onClick={() => { sfx.claim(); setEkran('aile'); }}
              style={{ minHeight: 56, borderRadius: 28, border: 'none', background: '#4A90D9', color: '#fff', fontWeight: 900, fontSize: 18, boxShadow: '0 5px 0 #2F69A8', marginTop: 6 }}>Masaya oturduk, başla!</button>
          </motion.div>
        )}

        {ekran === 'aile' && (
          <motion.div key="aile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ paddingTop: 6 }}>
            <BilgiYarisi oyuncular={aile.map((a, i) => a.trim() || `Oyuncu ${i + 1}`)} soruSayisi={4} onYildiz={yildiz} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Yoldan girilen oyunda: durağı bitirme şeridi */}
      {durak != null && ekran !== 'ana' && (
        <div style={{ position: 'fixed', insetInline: 12, bottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)', zIndex: 60, display: 'flex', justifyContent: 'center' }}>
          <motion.button type="button" data-testid="durak-bitir" onClick={durakBitir} disabled={kazanc < 1}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: kazanc < 1 ? 0.6 : 1 }}
            style={{ minHeight: 52, padding: '0 22px', borderRadius: 26, border: '3px solid #fff', background: kazanc < 1 ? '#9CB7A4' : '#F2B33D', color: '#1B4D2E', fontWeight: 900, fontSize: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.18)' }}>
            {kazanc < 1 ? `${durak + 1}. durak · bir yıldız topla` : `⭐ ${durak + 1}. durağı tamamla`}
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {kutlama && (
          <motion.div key="kutlama" initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
            style={{ position: 'fixed', left: 0, right: 0, top: '38%', zIndex: 80, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ padding: '16px 24px', borderRadius: 28, background: '#FFFFFF', boxShadow: '0 10px 0 #F2B33D, 0 20px 40px rgba(0,0,0,0.2)', fontSize: 20, fontWeight: 900, color: '#1B4D2E', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star size={26} fill="#FFD93D" color="#F2B33D" /> {kutlama}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {rehber && ekran === 'ana' && <RehberOklar adimlar={REHBER_ADIMLARI} anahtar={REHBER_ANAHTAR} onBitti={() => setRehber(false)} />}
    </div>
  );
}
