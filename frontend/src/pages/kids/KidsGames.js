import React, { useState } from 'react';
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

// 🌳 OYUN BAHÇESİ — çocuk bölümünün oyunları.
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
  const [active, setActive] = useState(null);
  const [stars, setStars] = useState(getStars);
  const [pop, setPop] = useState(0);

  const onXP = (amount) => {
    const add = Math.max(1, Math.round(amount / 5));
    setStars(addStars(add));
    setPop((p) => p + 1);
  };
  const game = GAMES.find((g) => g.id === active);
  const font = { fontFamily: "'Nunito', 'Noto Sans', sans-serif" };

  return (
    <div style={{ background: KIDS.bg, minHeight: '100vh', paddingBottom: 110, color: KIDS.textPrimary, ...font }}>
      <div style={{ position: 'relative' }}>
        <Garden />
        <div style={{ position: 'absolute', insetInline: 16, top: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => (active ? setActive(null) : navigate('/kids'))} aria-label="Geri"
            style={{ width: 46, height: 46, borderRadius: 23, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <ChevronLeft size={26} color={K.text} />
          </button>
          <motion.div key={pop} initial={{ scale: 1 }} animate={{ scale: pop ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 22, background: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: 18 }}>
            <Star size={20} fill="#FFD93D" color="#F2B33D" /> {stars}
          </motion.div>
        </div>
        <h1 style={{ position: 'absolute', insetInlineStart: 20, bottom: 54, margin: 0, fontSize: 30, fontWeight: 900, color: '#1B4D2E', textShadow: '0 2px 0 #fff' }}>
          {game ? game.title : 'Oyun Bahçesi'}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {!game ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, padding: '6px 16px 0', marginTop: -26, position: 'relative' }}>
            {GAMES.map((g, i) => (
              <motion.button key={g.id} type="button" onClick={() => { sfx.claim(); setActive(g.id); }}
                initial={{ opacity: 0, y: 30, rotate: i % 2 ? 3 : -3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: i * 0.09, type: 'spring', bounce: 0.45 }}
                whileTap={{ scale: 0.93 }}
                style={{ minHeight: 168, borderRadius: 30, padding: 16, background: '#FFFFFF', border: `3px solid ${g.bg}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: `0 10px 0 ${g.bg}`, cursor: 'pointer' }}>
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                  style={{ width: 76, height: 76, borderRadius: 38, background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
                    {g.id === 'cark' && [0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M22 22 L${22 + 20 * Math.cos((k * 60 - 90) * Math.PI / 180)} ${22 + 20 * Math.sin((k * 60 - 90) * Math.PI / 180)} A20 20 0 0 1 ${22 + 20 * Math.cos(((k + 1) * 60 - 90) * Math.PI / 180)} ${22 + 20 * Math.sin(((k + 1) * 60 - 90) * Math.PI / 180)}Z`} fill={['#2F8F6B', '#D9902F', '#C4553E', '#3B7BC4', '#8A5BC4', '#E2B85A'][k]} />)}
                    {g.id === 'match' && <><rect x="5" y="9" width="16" height="24" rx="4" fill={g.color} /><rect x="23" y="11" width="16" height="24" rx="4" fill="#FFD93D" transform="rotate(8 31 23)" /></>}
                    {g.id === 'word' && <><rect x="4" y="12" width="11" height="20" rx="3" fill={g.color} /><rect x="17" y="12" width="11" height="20" rx="3" fill="#FFD93D" /><rect x="30" y="12" width="11" height="20" rx="3" fill={g.color} /></>}
                    {g.id === 'order' && [0, 1, 2].map((k) => <rect key={k} x="8" y={6 + k * 12} width={28 - k * 7} height="9" rx="4.5" fill={k === 0 ? g.color : k === 1 ? '#FFD93D' : '#FF6B8A'} />)}
                  </svg>
                </motion.span>
                <span style={{ fontSize: 18, fontWeight: 900, color: g.color }}>{g.title}</span>
                <span style={{ fontSize: 13, color: K.textSecondary, fontWeight: 700 }}>{g.sub}</span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ paddingTop: 10 }}>
            <game.Comp theme={KIDS} onXP={onXP} onEvent={() => {}} {...(game.props || {})} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
