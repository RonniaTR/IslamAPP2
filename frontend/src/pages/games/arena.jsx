import React from 'react';
import { motion } from 'framer-motion';

// 🏟️ BİLGİ MEYDANI — 21 ayrı oyun yerine BEŞ MODÜL. Her modülün tek büyük "Oyna"sı var;
// eski oyunlar silinmedi, modülün içinde "tur" olarak yaşar (oyun kimlikleri, skorlar, Günün Oyunu korunur).
//   primary: 'random' → modülün turlarından biri rastgele seçilir (her girişte başka bir iz/bulmaca)
export const MODULES = [
  { id: 'cark', title: 'Hikmet Çarkı', tag: 'Çevir · bil · nişan topla',
    desc: 'Altı alan, altı nişan. Çarkı çevir, gelen alandan soruyu bil; üç doğruda taç hakkı kazan.',
    primary: 'cark', rounds: ['cark', 'classic'], sky: ['#16243F', '#2B4566'], accent: '#E2B85A' },
  { id: 'sahne', title: 'Sahne', tag: '12 basamak · 2 baraj · 3 joker',
    desc: 'Işıklar sende. Kolaydan zora on iki soru; istersen çekil, istersen zirveye yürü.',
    primary: 'sahne', rounds: ['sahne', 'rapid', 'survival'], sky: ['#2A1F4A', '#12142A'], accent: '#FFF1C2' },
  { id: 'duello', title: 'Düello', tag: 'Gerçek rakip · yapay rakip',
    desc: 'Aynı sorular, iki kalem. Bir arkadaşınla ya da rakiple yarış.',
    primary: 'duel', rounds: ['duel', 'ai', 'boss'], sky: ['#3A1F1B', '#170F0D'], accent: '#E8A16B' },
  { id: 'iz', title: 'İz Sürücü', tag: 'İpucundan bul',
    desc: 'Dört ipucu, tek cevap: sure, peygamber, Esmâ, ayet, harf. Her girişte başka bir iz.',
    primary: 'random', rounds: ['whichsurah', 'whichprophet', 'whichname', 'whereayah', 'whichletter', 'voice'], sky: ['#10302A', '#0A1A16'], accent: '#7FD1B0' },
  { id: 'atolye', title: 'Atölye', tag: 'Eşleştir · sırala · kelime · serüven',
    desc: 'Yavaş düşün, keyifle çöz. Bulmacalar ve kıssaların içinde serüven.',
    primary: 'random', rounds: ['memory', 'order', 'word', 'wheel', 'adventure', 'story'], sky: ['#3A2A14', '#1A1209'], accent: '#F0C97A' },
];

const Stars = ({ n = 14, seed = 1 }) => Array.from({ length: n }, (_, i) => (
  <motion.circle key={i} cx={(i * 47 * seed) % 360} cy={(i * 29 + seed * 7) % 110} r={0.8 + (i % 3) * 0.5} fill="#FFF8E6"
    animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.2 }} />
));

const SLICE = ['#2F8F6B', '#D9902F', '#C4553E', '#3B7BC4', '#8A5BC4', '#B8902C', '#E2B85A'];

/** Modül kapak çizimi (360×200). Tasvir yok: nesne, ışık, gök. Dosya yok → çevrimdışı. */
export function ModuleScene({ id, height = 200 }) {
  const m = MODULES.find((x) => x.id === id) || MODULES[0];
  return (
    <svg viewBox="0 0 360 200" width="100%" height={height} preserveAspectRatio="xMidYMid slice" aria-hidden style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={m.sky[1]} /><stop offset="1" stopColor={m.sky[0]} /></linearGradient>
        <radialGradient id={`glow-${id}`} cx="0.72" cy="0.5" r="0.5"><stop offset="0" stopColor={m.accent} stopOpacity="0.45" /><stop offset="1" stopColor={m.accent} stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="360" height="200" fill={`url(#sky-${id})`} />
      <Stars seed={id.length} />
      <rect width="360" height="200" fill={`url(#glow-${id})`} />

      {id === 'cark' && (
        <g transform="translate(262 112)">
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
            {SLICE.map((c, i) => {
              const a0 = (i * 360 / 7 - 90) * Math.PI / 180; const a1 = ((i + 1) * 360 / 7 - 90) * Math.PI / 180;
              return <path key={i} d={`M0 0 L${78 * Math.cos(a0)} ${78 * Math.sin(a0)} A78 78 0 0 1 ${78 * Math.cos(a1)} ${78 * Math.sin(a1)}Z`} fill={c} stroke="#16243F" strokeWidth="2" />;
            })}
            <circle r="16" fill="#FBF8F0" stroke="#B0893C" strokeWidth="2" />
          </motion.g>
          <path d="M0 -92 L-9 -76 L9 -76 Z" fill="#FFF6D8" />
        </g>
      )}

      {id === 'sahne' && (
        <g>
          {[-1, 1].map((s) => (
            <motion.path key={s} d={`M${180 + s * 70} 0 L${180 + s * 30} 0 L${180 + s * -20} 170 L${180 + s * 110} 170 Z`} fill="#FFF1C2"
              animate={{ opacity: [0.08, 0.22, 0.08] }} transition={{ duration: 4, repeat: Infinity, delay: s > 0 ? 2 : 0 }} />
          ))}
          <path d="M60 200 V70 Q180 10 300 70 V200" fill="none" stroke="#E2B85A" strokeWidth="3" opacity="0.7" />
          <path d="M60 70 Q90 120 70 200 H60 Z M300 70 Q270 120 290 200 H300 Z" fill="#7A2E3E" />
          <rect x="140" y="140" width="80" height="34" rx="6" fill="#2A2246" stroke="#E2B85A" strokeWidth="2" />
          <rect x="174" y="118" width="12" height="24" rx="3" fill="#E2B85A" />
          <ellipse cx="180" cy="182" rx="120" ry="12" fill="#FFF1C2" opacity="0.18" />
        </g>
      )}

      {id === 'duello' && (
        <g>
          <motion.circle cx="180" cy="96" r="54" fill="#E8A16B" opacity="0.12" animate={{ r: [50, 58, 50] }} transition={{ duration: 3, repeat: Infinity }} />
          {[-1, 1].map((s) => (
            <g key={s} transform={`translate(180 100) rotate(${s * 38})`}>
              <rect x="-5" y="-78" width="10" height="132" rx="3" fill="#D8B27A" stroke="#7A5428" strokeWidth="1.5" />
              <path d="M-5 54 L0 74 L5 54 Z" fill="#2A1A10" />
              <rect x="-5" y="-60" width="10" height="5" fill="#7A5428" />
            </g>
          ))}
          {[[130, 170], [232, 160], [150, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3 + i} fill="#2A1A10" opacity="0.6" />)}
          <rect x="0" y="176" width="360" height="24" fill="#170F0D" opacity="0.7" />
        </g>
      )}

      {id === 'iz' && (
        <g>
          <path d="M40 150 C 90 110, 140 170, 190 130 S 280 90, 320 120" fill="none" stroke="#7FD1B0" strokeWidth="2.5" strokeDasharray="2 9" strokeLinecap="round" opacity="0.8" />
          <rect x="70" y="60" width="150" height="104" rx="8" fill="#F2E6C6" opacity="0.92" transform="rotate(-6 145 112)" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x="90" y={82 + i * 16} width={110 - i * 14} height="4" rx="2" fill="#B49A63" transform="rotate(-6 145 112)" />)}
          <motion.g animate={{ x: [0, 14, 0], y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <circle cx="232" cy="96" r="34" fill="#BFE9DA" fillOpacity="0.25" stroke="#E8D7A8" strokeWidth="6" />
            <rect x="254" y="118" width="12" height="46" rx="5" fill="#7A5428" transform="rotate(-42 260 141)" />
          </motion.g>
          <path d="M320 112 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#E2B85A" />
        </g>
      )}

      {id === 'atolye' && (
        <g>
          <path d="M60 150 Q120 128 180 150 Q240 128 300 150 V170 Q240 150 180 172 Q120 150 60 170 Z" fill="#F2E6C6" />
          <path d="M180 150 V172" stroke="#B49A63" strokeWidth="2" />
          {[[150, 70, '#2F8F6B'], [196, 58, '#D9902F'], [176, 104, '#3B7BC4']].map(([x, y, c], i) => (
            <motion.path key={i} d={`M${x} ${y} h18 a6 6 0 0 1 12 0 h18 v18 a6 6 0 0 0 0 12 v18 h-48 z`} fill={c}
              animate={{ y: [0, -6, 0], rotate: [0, i % 2 ? 4 : -4, 0] }} transition={{ duration: 3 + i, repeat: Infinity }} />
          ))}
          <g transform="translate(286 104)">
            <path d="M0 -26c6 9 10 15 10 22a10 10 0 0 1-20 0c0-7 4-13 10-22z" fill="#F0B429" />
            <path d="M-14 10 h28 l-4 12 h-20 z" fill="#B0893C" />
          </g>
        </g>
      )}
    </svg>
  );
}
