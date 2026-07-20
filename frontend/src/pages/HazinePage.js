import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, ChevronDown, Copy, Check, RotateCcw, Sparkles, Share2, Search, Swords, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import { awardXPOnce } from '../services/gamification';
import { HIDAYET_DUALARI, TESBIHAT_SETS, TARIH_DONEMLERI, TARIH_TOPLAM, MUCIZELER, HAZINE_BOLUMLERI } from '../data/nurHazine';
import { ESMA } from '../data/esmaData';
import Confetti from './games/Confetti';

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const shareText = (text) => {
  if (navigator.share) navigator.share({ text }).catch(() => {});
  else navigator.clipboard?.writeText(text).catch(() => {});
};

// 💛 NUR HAZİNESİ — Nur Yolu'nun içerik hazinesi (/hazine/:section?).
// Büyük tanıtım kartlarından bölümlere girilir: Hidayet Duaları,
// sayaçlı Tesbihat, Dünya Tarihinde Müslümanlar (zaman tüneli) ve
// Kur'an'daki Mucizeler (elle çizilmiş SVG infografiklerle).

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };
const todayKey = () => new Date().toISOString().slice(0, 10);

// ─── ✨ SVG infografikler — her mucize için elle çizilmiş minik sahne ───
function MiracleArt({ type, color }) {
  const c = color; const dim = `${color}55`;
  const common = { fill: 'none', stroke: c, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg viewBox="0 0 120 80" className="w-full" style={{ height: 92 }} aria-hidden>
      {type === 'water' && (<g>
        <path {...common} d="M60 12 C48 30 42 38 42 48 a18 18 0 0 0 36 0 C78 38 72 30 60 12 Z" />
        <path {...common} stroke={dim} d="M52 50 a8 8 0 0 0 6 8" />
        <path {...common} d="M10 68 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0" opacity="0.5" />
        <circle cx="22" cy="26" r="7" {...common} stroke={dim} /><circle cx="22" cy="26" r="2.4" fill={dim} stroke="none" />
        <circle cx="99" cy="22" r="9" {...common} stroke={dim} /><circle cx="99" cy="22" r="3" fill={dim} stroke="none" />
      </g>)}
      {type === 'expand' && (<g>
        <circle cx="60" cy="42" r="9" {...common} />
        <path {...common} stroke={dim} d="M60 42 m-20 0 a20 20 0 1 1 40 0 a20 20 0 1 1 -40 0" opacity="0.7" />
        <path {...common} stroke={dim} d="M60 42 m-32 0 a32 32 0 1 1 64 0 a32 32 0 1 1 -64 0" opacity="0.4" />
        <path {...common} d="M60 6 l0 -0.1 M60 8 l4 4 M60 8 l-4 4 M60 8 l0 6" />
        <path {...common} d="M96 24 l5 -3 M101 21 l-1 5 M101 21 l-5 -1" />
        <path {...common} d="M24 60 l-5 3 M19 63 l1 -5 M19 63 l5 1" />
        <circle cx="88" cy="60" r="1.6" fill={c} stroke="none" /><circle cx="30" cy="20" r="1.6" fill={c} stroke="none" /><circle cx="102" cy="44" r="1.3" fill={dim} stroke="none" />
      </g>)}
      {type === 'iron' && (<g>
        <path {...common} d="M84 14 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" />
        <path {...common} stroke={dim} strokeDasharray="4 4" d="M80 30 C68 42 56 50 44 58" />
        <circle cx="34" cy="64" r="10" {...common} />
        <path {...common} stroke={dim} d="M28 62 a10 10 0 0 1 6 -5" />
        <text x="34" y="68" textAnchor="middle" fontSize="8.5" fontWeight="900" fill={c} stroke="none" fontFamily="sans-serif">Fe</text>
      </g>)}
      {type === 'embryo' && (<g>
        <path {...common} d="M72 22 C50 18 36 32 38 48 c2 12 14 18 24 14 8 -3 12 -12 8 -19 -3 -6 -11 -7 -15 -2" />
        <circle cx="66" cy="30" r="3" fill={c} stroke="none" />
        <path {...common} stroke={dim} d="M46 36 q3 -3 6 0 M52 32 q3 -3 6 0 M58 29 q3 -3 6 0" />
        <path {...common} stroke={dim} d="M62 62 q8 6 16 2" />
        <circle cx="60" cy="42" r="26" {...common} stroke={dim} opacity="0.5" />
      </g>)}
      {type === 'seas' && (<g>
        <path {...common} d="M8 34 q13 -8 26 0 t26 0" />
        <path {...common} stroke={dim} d="M60 34 q13 -8 26 0 t26 0" />
        <line x1="60" y1="22" x2="60" y2="66" stroke={c} strokeWidth="2" strokeDasharray="3 5" />
        <path {...common} d="M22 52 q5 4 10 0 M30 60 q5 4 10 0" opacity="0.7" />
        <path {...common} stroke={dim} d="M80 52 q5 4 10 0 M88 60 q5 4 10 0" opacity="0.7" />
        <text x="30" y="20" textAnchor="middle" fontSize="7" fontWeight="800" fill={c} stroke="none" fontFamily="sans-serif">TUZLU</text>
        <text x="92" y="20" textAnchor="middle" fontSize="7" fontWeight="800" fill={dim} stroke="none" fontFamily="sans-serif">TATLI</text>
      </g>)}
      {type === 'mountain' && (<g>
        <line x1="8" y1="40" x2="112" y2="40" stroke={dim} strokeWidth="2" />
        <path {...common} d="M36 40 L60 12 L84 40" />
        <path {...common} strokeDasharray="4 4" d="M40 40 L60 68 L80 40" />
        <path {...common} stroke={dim} d="M54 20 L60 26 L66 18" opacity="0.8" />
        <text x="97" y="34" fontSize="7" fontWeight="800" fill={c} stroke="none" fontFamily="sans-serif">DAĞ</text>
        <text x="94" y="56" fontSize="7" fontWeight="800" fill={dim} stroke="none" fontFamily="sans-serif">KÖK</text>
      </g>)}
      {type === 'shield' && (<g>
        <path {...common} d="M14 70 a52 52 0 0 1 92 0" />
        <path {...common} stroke={dim} d="M24 70 a40 40 0 0 1 72 0" opacity="0.7" />
        <path {...common} stroke={dim} d="M34 70 a28 28 0 0 1 52 0" opacity="0.45" />
        <path {...common} d="M86 10 L74 30" strokeDasharray="3 3" />
        <path {...common} d="M70 34 l-2 5 M74 33 l1 5 M67 30 l-5 2" />
        <circle cx="72" cy="31" r="3.4" fill={c} stroke="none" />
      </g>)}
      {type === 'finger' && (<g>
        <path {...common} d="M60 66 a20 26 0 1 1 0.1 0" transform="translate(0,-6)" />
        <path {...common} stroke={dim} d="M60 58 a13 18 0 1 1 0.1 0" transform="translate(0,-4)" />
        <path {...common} d="M60 50 a7 10 0 1 1 0.1 0" transform="translate(0,-2)" />
        <path {...common} stroke={dim} d="M52 70 q8 6 16 0" />
      </g>)}
      {type === 'deepsea' && (<g>
        <path {...common} d="M8 18 q13 -7 26 0 t26 0 t26 0 t26 0" />
        <path {...common} stroke={dim} d="M16 36 q12 -6 24 0 t24 0 t24 0" opacity="0.75" />
        <path {...common} stroke={dim} d="M24 52 q11 -5 22 0 t22 0" opacity="0.5" />
        <path {...common} stroke={dim} d="M34 66 q10 -4 20 0 t20 0" opacity="0.3" />
        <circle cx="20" cy="62" r="1.6" fill={dim} stroke="none" /><circle cx="98" cy="58" r="1.6" fill={dim} stroke="none" />
      </g>)}
      {type === 'honey' && (<g>
        {[[46, 22], [74, 22], [32, 42], [60, 42], [88, 42], [46, 62], [74, 62]].map(([x, y], i) => (
          <path key={i} {...common} stroke={i % 2 ? dim : c} d={`M${x} ${y - 12} l10 6 v12 l-10 6 l-10 -6 v-12 Z`} />
        ))}
        <path {...common} d="M60 42 c-3 5 -3 8 0 10 c3 -2 3 -5 0 -10 Z" fill={c} stroke="none" />
      </g>)}
    </svg>
  );
}

// ─── 🏛️ Buluş çizimleri — her tarih maddesi için "ne ile uğraştı?" sahnesi ───
function TarihArt({ type, color }) {
  const c = color; const dim = `${color}55`;
  const S = { fill: 'none', stroke: c, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const D = { ...S, stroke: dim };
  return (
    <svg viewBox="0 0 120 70" className="w-full" style={{ height: 84 }} aria-hidden>
      {type === 'quran' && (<g>
        <path {...S} d="M60 20 C50 14 38 14 30 18 v32 c8 -4 20 -4 30 2 c10 -6 22 -6 30 -2 V18 c-8 -4 -20 -4 -30 2 Z" />
        <line {...S} x1="60" y1="20" x2="60" y2="52" />
        <path {...D} d="M36 26 h16 M36 32 h16 M68 26 h16 M68 32 h16" />
        <path {...D} d="M60 8 l0 -4 M48 10 l-2 -4 M72 10 l2 -4" />
      </g>)}
      {type === 'mosque' && (<g>
        <path {...S} d="M40 50 v-14 a20 20 0 0 1 40 0 v14 Z" />
        <path {...S} d="M60 14 q-2 4 0 6 q2 -2 0 -6 Z M60 12 v-4" />
        <path {...D} d="M28 50 v-22 l3 -5 3 5 v22 M86 50 v-22 l3 -5 3 5 v22" />
        <line {...S} x1="20" y1="50" x2="100" y2="50" />
        <path {...S} d="M54 50 v-8 a6 6 0 0 1 12 0 v8" />
      </g>)}
      {type === 'chemistry' && (<g>
        <path {...S} d="M52 14 h16 M56 14 v14 L44 52 a4 4 0 0 0 4 6 h24 a4 4 0 0 0 4 -6 L64 28 V14" />
        <path {...D} d="M50 44 h20" />
        <circle cx="56" cy="50" r="2" fill={dim} stroke="none" /><circle cx="64" cy="47" r="1.6" fill={dim} stroke="none" />
        <path {...D} d="M84 22 a10 10 0 0 1 10 10 M90 14 a18 18 0 0 1 14 16" opacity="0.7" />
      </g>)}
      {type === 'algebra' && (<g>
        <text x="34" y="42" fontSize="26" fontWeight="800" fill={c} stroke="none" fontFamily="Georgia, serif" fontStyle="italic">x</text>
        <text x="50" y="30" fontSize="12" fontWeight="800" fill={dim} stroke="none" fontFamily="Georgia, serif">2</text>
        <path {...S} d="M62 34 h10 M62 40 h10" />
        <text x="78" y="44" fontSize="20" fontWeight="800" fill={dim} stroke="none" fontFamily="Georgia, serif">١٢</text>
        <path {...D} d="M24 54 h72" />
        <path {...D} d="M24 16 q4 6 0 12 M96 16 q-4 6 0 12" />
      </g>)}
      {type === 'university' && (<g>
        <path {...S} d="M24 52 v-22 h72 v22 M20 52 h80" />
        <path {...S} d="M24 30 L60 12 L96 30" />
        <path {...D} d="M36 52 v-14 M52 52 v-14 M68 52 v-14 M84 52 v-14" />
        <path {...S} d="M54 52 v-10 a6 6 0 0 1 12 0 v10" />
      </g>)}
      {type === 'flight' && (<g>
        <path {...S} d="M60 34 L28 22 q-6 -2 -2 4 l22 16 M60 34 L92 22 q6 -2 2 4 L72 42" />
        <circle cx="60" cy="34" r="4" {...S} />
        <path {...S} d="M60 38 v10 M60 42 l-6 8 M60 42 l6 8" />
        <path {...D} d="M16 60 q22 -8 44 0 q22 8 44 0" opacity="0.6" />
      </g>)}
      {type === 'triangle' && (<g>
        <path {...S} d="M30 52 L30 20 L90 52 Z" />
        <path {...D} d="M30 44 a8 8 0 0 0 8 8" />
        <path {...D} d="M38 52 v-6 h-8" opacity="0.8" />
        <circle cx="98" cy="18" r="5" {...D} /><path {...D} d="M94 14 l8 8 M102 14 l-8 8" opacity="0.5" />
        <circle cx="20" cy="12" r="1.6" fill={dim} stroke="none" /><circle cx="104" cy="40" r="1.6" fill={dim} stroke="none" />
      </g>)}
      {type === 'surgery' && (<g>
        <path {...S} d="M30 46 L62 18 q6 -4 8 0 q2 4 -4 8 L38 52 q-6 2 -8 -6 Z" />
        <path {...D} d="M70 46 q10 -10 20 -18 M78 52 q8 -10 18 -20" />
        <path {...D} d="M70 46 l-4 8 M96 28 l6 -8" />
        <circle cx="86" cy="40" r="2.4" {...D} />
      </g>)}
      {type === 'optics' && (<g>
        <path {...S} d="M40 36 q20 -16 40 0 q-20 16 -40 0 Z" />
        <circle cx="60" cy="36" r="5" {...S} /><circle cx="60" cy="36" r="1.8" fill={c} stroke="none" />
        <path {...D} d="M18 22 L38 32 M18 36 L36 36 M18 50 L38 40" />
        <path {...S} d="M14 18 q2 -6 4 0 q-2 3 -4 0 Z M16 14 v-2" />
      </g>)}
      {type === 'medicine' && (<g>
        <path {...S} d="M28 20 h48 a6 6 0 0 1 6 6 v24 a6 6 0 0 1 -6 6 h-48 Z M28 20 v36" />
        <path {...D} d="M34 26 v24" />
        <path {...S} d="M44 40 h8 l4 -10 6 16 4 -6 h14" />
      </g>)}
      {type === 'globe' && (<g>
        <circle cx="52" cy="36" r="22" {...S} />
        <path {...D} d="M30 36 h44 M52 14 v44 M38 20 q14 8 28 0 M38 52 q14 -8 28 0" />
        <path {...S} d="M86 18 L104 54" strokeDasharray="4 4" />
        <path {...S} d="M92 12 l4 8 8 2 -6 5" opacity="0.9" />
      </g>)}
      {type === 'gears' && (<g>
        <circle cx="46" cy="34" r="12" {...S} />
        <circle cx="46" cy="34" r="4" {...D} />
        {[0, 60, 120, 180, 240, 300].map(a => (
          <line key={a} {...S} x1={46 + 12 * Math.cos(a * Math.PI / 180)} y1={34 + 12 * Math.sin(a * Math.PI / 180)}
            x2={46 + 17 * Math.cos(a * Math.PI / 180)} y2={34 + 17 * Math.sin(a * Math.PI / 180)} />
        ))}
        <circle cx="78" cy="46" r="9" {...D} />
        {[30, 90, 150, 210, 270, 330].map(a => (
          <line key={a} {...D} x1={78 + 9 * Math.cos(a * Math.PI / 180)} y1={46 + 9 * Math.sin(a * Math.PI / 180)}
            x2={78 + 13 * Math.cos(a * Math.PI / 180)} y2={46 + 13 * Math.sin(a * Math.PI / 180)} />
        ))}
        <path {...D} d="M98 18 c-2 4 -2 6 0 8 c2 -2 2 -4 0 -8 Z" fill={dim} stroke="none" />
      </g>)}
      {type === 'heart' && (<g>
        <path {...S} d="M60 52 C40 38 36 26 46 20 c6 -4 12 0 14 4 c2 -4 8 -8 14 -4 c10 6 6 18 -14 32 Z" />
        <path {...D} d="M34 22 a14 14 0 0 0 -8 12 a14 14 0 0 0 10 13" />
        <path {...D} d="M86 22 a14 14 0 0 1 8 12 a14 14 0 0 1 -10 13" />
        <path {...D} d="M30 34 l4 -3 M30 34 l4 3 M90 34 l-4 -3 M90 34 l-4 3" />
      </g>)}
      {type === 'network' && (<g>
        {[[60, 16], [30, 34], [90, 34], [44, 54], [76, 54]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 6 : 4.5} {...(i === 0 ? S : D)} />
        ))}
        <path {...D} d="M56 20 L34 31 M64 20 L86 31 M33 38 L42 50 M87 38 L78 50 M48 53 L72 53 M36 32 L72 52 M84 32 L48 52" opacity="0.7" />
      </g>)}
      {type === 'observatory' && (<g>
        <path {...S} d="M36 52 a24 24 0 0 1 48 0 Z" />
        <path {...S} d="M56 30 L72 14" strokeWidth="3" />
        <path {...D} d="M30 52 h60" />
        <path {...D} d="M88 20 a30 30 0 0 1 6 18" strokeDasharray="3 3" />
        <circle cx="94" cy="12" r="1.8" fill={c} stroke="none" /><circle cx="24" cy="16" r="1.5" fill={dim} stroke="none" /><circle cx="104" cy="30" r="1.5" fill={dim} stroke="none" />
      </g>)}
      {type === 'map' && (<g>
        <path {...S} d="M22 18 q20 -8 34 2 q16 10 42 -2 M22 52 q20 8 34 -2 q16 -10 42 2 M22 18 v34 M98 18 v34" opacity="0.9" />
        <circle cx="60" cy="35" r="11" {...D} />
        <path {...S} d="M60 24 l3 8 -3 -2 -3 2 Z M60 46 l-3 -8 3 2 3 -2 Z" fill={c} stroke="none" />
        <path {...D} d="M49 35 h6 M65 35 h6" />
      </g>)}
      {type === 'dome' && (<g>
        <path {...S} d="M34 52 v-10 a26 22 0 0 1 52 0 v10 Z" />
        <path {...S} d="M60 18 v-6 M57 10 q3 -3 6 0" />
        <path {...D} d="M22 52 v-20 l3 -6 3 6 v20 M92 52 v-20 l3 -6 3 6 v20" />
        <line {...S} x1="16" y1="52" x2="104" y2="52" />
        <path {...D} d="M46 52 v-6 a5 5 0 0 1 10 0 v6 M64 52 v-6 a5 5 0 0 1 10 0 v6" />
      </g>)}
      {type === 'atom' && (<g>
        <circle cx="60" cy="35" r="4" fill={c} stroke="none" />
        <ellipse cx="60" cy="35" rx="30" ry="11" {...S} />
        <ellipse cx="60" cy="35" rx="30" ry="11" {...D} transform="rotate(60 60 35)" />
        <ellipse cx="60" cy="35" rx="30" ry="11" {...D} transform="rotate(-60 60 35)" />
        <circle cx="88" cy="28" r="2.2" fill={dim} stroke="none" /><circle cx="38" cy="50" r="2.2" fill={dim} stroke="none" />
      </g>)}
      {type === 'femto' && (<g>
        <circle cx="42" cy="36" r="16" {...S} />
        <path {...S} d="M42 26 v10 l7 5" />
        <circle cx="84" cy="28" r="6" {...D} /><circle cx="98" cy="40" r="5" {...D} />
        <line {...D} x1="88" y1="32" x2="94" y2="37" />
        <path {...S} d="M70 14 l-5 9 h7 l-5 9" opacity="0.9" />
      </g>)}
      {type === 'dna' && (<g>
        <path {...S} d="M44 12 q32 12 0 24 q-32 12 0 24" />
        <path {...D} d="M76 12 q-32 12 0 24 q32 12 0 24" />
        <path {...D} d="M48 18 h24 M44 26 h32 M48 34 h24 M44 44 h32 M48 52 h24" opacity="0.7" />
      </g>)}
      {type === 'hands' && (<g>
        <path {...S} d="M22 46 q10 -8 20 -2 l14 8 q4 3 0 5 l-16 -4" />
        <path {...D} d="M98 46 q-10 -8 -20 -2 l-14 8 q-4 3 0 5 l16 -4" />
        <path {...S} d="M60 14 c-6 -6 -16 0 -10 8 l10 8 l10 -8 c6 -8 -4 -14 -10 -8 Z" />
      </g>)}
    </svg>
  );
}

// ─── 🎯 MİNİ SINAV MOTORU — her açılışta YENİDEN üretilen sorular ───
// makeRounds() her oturumda farklı stil ve karışımda soru döndürür;
// böylece içerik bitse bile sınav farklı mantıkla dönmeye devam eder.
function MiniQuiz({ title, color, theme, user, makeRounds, xpKey, onExit }) {
  const tt = useTx();
  const [rounds, setRounds] = useState(() => makeRounds());
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const r = rounds[idx];

  const pick = (opt) => {
    if (picked !== null) return;
    setPicked(opt);
    if (opt === r.correct) { setScore(s => s + 1); try { navigator.vibrate?.(15); } catch { /* yok */ } }
    else { try { navigator.vibrate?.([40, 40, 40]); } catch { /* yok */ } }
  };
  const next = () => {
    if (idx + 1 >= rounds.length) {
      setFinished(true);
      const dk = new Date().toISOString().slice(0, 10);
      awardXPOnce(user, `${xpKey}_${dk}`, 'game_quiz', { points: 15, details: `${title}: ${score}/${rounds.length}` });
      return;
    }
    setIdx(i => i + 1); setPicked(null);
  };
  const restart = () => { setRounds(makeRounds()); setIdx(0); setPicked(null); setScore(0); setFinished(false); };

  if (finished) {
    const pct = Math.round((score / rounds.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-5">
        {pct >= 70 && <Confetti count={24} />}
        <div className="rounded-3xl p-6 text-center" style={{ background: `linear-gradient(160deg, ${color}14, ${theme.surface})`, border: `1.5px solid ${color}50` }}>
          <p className="text-5xl mb-2">{pct >= 90 ? '🏆' : pct >= 70 ? '🌟' : pct >= 40 ? '💪' : '🌱'}</p>
          <p className="text-2xl font-black" style={{ color: theme.textPrimary }}>{score}/{rounds.length}</p>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
            {pct >= 90 ? tt('Muhteşem! Bu bilgiler artık senin.') : pct >= 70 ? tt('Çok iyi! Az kaldı, zirve yakın.') : pct >= 40 ? tt('Güzel başlangıç — kartları okuyup tekrar dene.') : tt('Önce kartları keşfet, sonra tekrar gel.')}
          </p>
          <p className="text-[10px] mt-2 font-bold" style={{ color }}>{tt('Her açılışta sorular ve tarz değişir — dilediğin kadar dön ✨')}</p>
          <div className="flex gap-2 mt-5">
            <button onClick={restart} className="flex-1 py-3 rounded-2xl text-xs font-black active:scale-97" style={{ background: color, color: '#06231A' }}>
              {tt('🔄 Yeni Karışım')}
            </button>
            <button onClick={onExit} className="flex-1 py-3 rounded-2xl text-xs font-black active:scale-97" style={{ background: `${color}14`, border: `1px solid ${color}40`, color }}>
              {tt('Bölüme Dön')}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="px-5">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onExit} className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90" style={{ background: `${color}12` }} aria-label="Çık">
          <X size={14} style={{ color }} />
        </button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: `${color}18` }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(idx / rounds.length) * 100}%`, background: color }} />
        </div>
        <span className="text-[10px] font-black shrink-0" style={{ color: theme.textSecondary }}>{idx + 1}/{rounds.length} · ⭐{score}</span>
      </div>
      <motion.div key={idx} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
        className="rounded-3xl p-5" style={{ background: theme.surface, border: `1.5px solid ${color}35` }}>
        <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full" style={{ background: `${color}14`, color }}>{r.tag}</span>
        {r.qAr && <p dir="rtl" className="text-3xl mt-3 text-center" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color }}>{r.qAr}</p>}
        <p className="text-[15px] font-bold mt-2.5 leading-relaxed" style={{ color: theme.textPrimary }}>{r.q}</p>
        <div className="space-y-2 mt-4">
          {r.opts.map((opt, i) => {
            const isCorrect = picked !== null && opt === r.correct;
            const isWrongPick = picked === opt && opt !== r.correct;
            return (
              <button key={i} onClick={() => pick(opt)} disabled={picked !== null}
                className="w-full text-left p-3 rounded-xl text-[12.5px] font-semibold transition-all active:scale-98 flex items-center justify-between gap-2"
                style={{
                  background: isCorrect ? '#10B98118' : isWrongPick ? '#EF444418' : `${theme.textSecondary}0a`,
                  border: `1.5px solid ${isCorrect ? '#10B981' : isWrongPick ? '#EF4444' : theme.cardBorder}`,
                  color: theme.textPrimary, opacity: picked !== null && !isCorrect && !isWrongPick ? 0.55 : 1,
                }}>
                <span className="flex-1">{opt}</span>
                {isCorrect && <Check size={14} style={{ color: '#10B981' }} className="shrink-0" />}
                {isWrongPick && <X size={14} style={{ color: '#EF4444' }} className="shrink-0" />}
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {picked !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {r.info && (
                <p className="text-[10.5px] mt-3 leading-relaxed p-2.5 rounded-xl" style={{ background: `${color}0c`, color: theme.textSecondary }}>
                  💡 {r.info}
                </p>
              )}
              <button onClick={next} className="w-full mt-3 py-3 rounded-2xl text-sm font-black active:scale-97" style={{ background: color, color: '#06231A' }}>
                {idx + 1 >= rounds.length ? tt('Sonucu Gör') : tt('Sonraki Soru →')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Ortak başlık ───
function Head({ title, sub, onBack, theme }) {
  return (
    <div className="px-5 pt-6 pb-3 flex items-center gap-3">
      <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 shrink-0" style={{ background: `${theme.gold}10` }} aria-label="Geri">
        <ArrowLeft size={17} style={{ color: theme.gold }} />
      </button>
      <div className="min-w-0">
        <h1 className="text-xl font-black truncate" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{title}</h1>
        {sub && <p className="text-[10px]" style={{ color: theme.textSecondary }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─── 🤲 DUALAR ───
function DualarSection({ theme, onBack }) {
  const tt = useTx();
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(null);
  const openDua = (id) => {
    setOpen(o => (o === id ? null : id));
    const seen = load('dua_read', []);
    if (!seen.includes(id)) save('dua_read', [...seen, id]);
  };
  const copy = (d, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`${d.ar}\n\n"${d.tr}"\n— ${d.source}`).catch(() => {});
    setCopied(d.id); setTimeout(() => setCopied(null), 1500);
  };
  return (
    <div className="max-w-2xl mx-auto">
      <Head title={tt("🤲 Hidayet Duaları")} sub={tt("Doğru yolu istemenin ve yolda kalmanın duaları")} onBack={onBack} theme={theme} />
      <div className="px-5 space-y-2.5">
        {HIDAYET_DUALARI.map((d, i) => {
          const isOpen = open === d.id;
          return (
            <motion.button key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.04 }}
              onClick={() => openDua(d.id)}
              className="w-full text-left rounded-2xl p-4 transition-all"
              style={{ background: theme.surface, border: `1.5px solid ${isOpen ? `${theme.gold}55` : theme.cardBorder}` }}>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0" style={{ background: `${theme.gold}14`, color: theme.gold }}>{d.when}</span>
                <span className="text-[10px] font-bold ml-auto shrink-0" style={{ color: theme.textSecondary }}>{d.source}</span>
                <ChevronDown size={13} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: theme.textSecondary }} />
              </div>
              <p dir="rtl" className="mt-3 leading-loose" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", fontSize: isOpen ? 22 : 18, color: theme.gold }}>
                {d.ar}
              </p>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <p className="text-[11px] mt-2 italic" style={{ color: theme.textSecondary }}>{d.read}</p>
                    <p className="text-[13.5px] mt-2.5 leading-relaxed" style={{ fontFamily: 'Georgia, serif', color: theme.textPrimary }}>"{d.tr}"</p>
                    <p className="text-[11px] mt-2.5 leading-relaxed pl-2.5" style={{ borderLeft: `2px solid ${theme.gold}50`, color: theme.textSecondary }}>{d.note}</p>
                    <span onClick={(e) => copy(d, e)} role="button"
                      className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-xl text-[10px] font-black active:scale-95"
                      style={{ background: `${theme.gold}12`, color: copied === d.id ? '#10B981' : theme.gold, border: `1px solid ${theme.gold}30` }}>
                      {copied === d.id ? <Check size={11} /> : <Copy size={11} />} {copied === d.id ? tt('Kopyalandı') : tt('Kopyala')}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 📿 TESBİHAT (sayaçlı) ───
function TesbihatSection({ theme, user, onBack }) {
  const tt = useTx();
  const [setId, setSetId] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [doneSet, setDoneSet] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const active = TESBIHAT_SETS.find(s => s.id === setId);
  const step = active?.steps[stepIdx];

  const start = (id) => { setSetId(id); setStepIdx(0); setCount(0); setDoneSet(false); };

  const tap = useCallback(() => {
    if (!active || doneSet) return;
    try { navigator.vibrate?.(12); } catch { /* yok */ }
    const next = count + 1;
    if (next >= step.target) {
      if (stepIdx + 1 < active.steps.length) { setStepIdx(stepIdx + 1); setCount(0); }
      else {
        setDoneSet(true); setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1800);
        const log = load(`tesbihat_log_${todayKey()}`, {});
        log[active.id] = Date.now();
        save(`tesbihat_log_${todayKey()}`, log);
        awardXPOnce(user, `tesbihat_${active.id}_${todayKey()}`, 'worship_task', { points: 15, details: `Tesbihat: ${active.title}` });
      }
    } else setCount(next);
  }, [active, step, stepIdx, count, doneSet, user]);

  if (active) {
    const R = 74, CIRC = 2 * Math.PI * R;
    const pct = doneSet ? 1 : count / step.target;
    const todayLog = load(`tesbihat_log_${todayKey()}`, {});
    return (
      <div className="max-w-xl mx-auto">
        {celebrate && <Confetti count={26} />}
        <Head title={`${active.emoji} ${active.title}`} sub={active.source} onBack={() => setSetId(null)} theme={theme} />
        {/* Adım göstergesi */}
        {active.steps.length > 1 && (
          <div className="px-5 flex gap-1.5 mb-3">
            {active.steps.map((s, i) => (
              <span key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i < stepIdx || doneSet ? active.color : i === stepIdx ? `${active.color}70` : `${theme.textSecondary}20` }} />
            ))}
          </div>
        )}
        {!doneSet ? (
          <div className="px-5">
            <div className="rounded-3xl p-5 text-center" style={{ background: theme.surface, border: `1.5px solid ${active.color}35` }}>
              <p dir="rtl" className="text-2xl leading-loose" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: active.color }}>{step.ar}</p>
              <p className="text-sm font-black mt-1" style={{ color: theme.textPrimary }}>{step.name}</p>
              <p className="text-[10.5px] mt-1" style={{ color: theme.textSecondary }}>{step.mean}</p>
            </div>
            {/* Dev sayaç */}
            <button onClick={tap} className="mx-auto mt-6 block active:scale-95 transition-transform" aria-label="Say">
              <div className="relative" style={{ width: 180, height: 180 }}>
                <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
                  <circle cx="90" cy="90" r={R} fill="none" stroke={`${active.color}20`} strokeWidth="10" />
                  <circle cx="90" cy="90" r={R} fill="none" stroke={active.color} strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct)} style={{ transition: 'stroke-dashoffset 0.2s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full" style={{ background: `${active.color}0a` }}>
                  <span className="text-5xl font-black tabular-nums" style={{ color: theme.textPrimary }}>{count}</span>
                  <span className="text-xs font-bold" style={{ color: theme.textSecondary }}>/ {step.target}</span>
                </div>
              </div>
            </button>
            <p className="text-center text-[10px] mt-3" style={{ color: theme.textSecondary }}>{tt('Halkaya dokunarak say — her dokunuş hafif titreşir')}</p>
            <button onClick={() => { setStepIdx(0); setCount(0); }} className="mx-auto mt-4 flex items-center gap-1.5 text-[11px] font-bold" style={{ color: theme.textSecondary }}>
              <RotateCcw size={12} /> {tt('Baştan başla')}
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-5 text-center">
            <div className="rounded-3xl p-6" style={{ background: `linear-gradient(160deg, ${active.color}14, ${theme.surface})`, border: `1.5px solid ${active.color}50` }}>
              <p className="text-5xl mb-3">{active.emoji}</p>
              <p className="text-lg font-black" style={{ color: theme.textPrimary }}>{tt('Tesbihat tamamlandı')}</p>
              <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{tt('+15 XP · Allah kabul etsin 🤲')}</p>
              <div className="flex gap-2 mt-5">
                <button onClick={() => start(active.id)} className="flex-1 py-3 rounded-2xl text-xs font-black active:scale-97" style={{ background: `${active.color}14`, border: `1px solid ${active.color}40`, color: active.color }}>
                  {tt('Tekrar')}
                </button>
                <button onClick={() => setSetId(null)} className="flex-1 py-3 rounded-2xl text-xs font-black active:scale-97" style={{ background: active.color, color: '#06231A' }}>
                  {tt('Diğer Zikirler')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
        <p className="px-5 mt-4 text-center text-[9px]" style={{ color: theme.textSecondary }}>
          {tt('Bugün tamamlanan:')} {Object.keys(todayLog).length}/{TESBIHAT_SETS.length}
        </p>
      </div>
    );
  }

  const todayLog = load(`tesbihat_log_${todayKey()}`, {});
  return (
    <div className="max-w-2xl mx-auto">
      <Head title={tt("📿 Tesbihat")} sub={tt("Dokunmatik sayaç · titreşimli · kaynaklı")} onBack={onBack} theme={theme} />
      <div className="px-5 grid grid-cols-1 md:grid-cols-2 gap-3">
        {TESBIHAT_SETS.map((s, i) => (
          <motion.button key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            onClick={() => start(s.id)}
            className="text-left rounded-2xl p-4 active:scale-98 transition-transform relative overflow-hidden"
            style={{ background: theme.surface, border: `1.5px solid ${todayLog[s.id] ? `${s.color}60` : theme.cardBorder}` }}>
            {todayLog[s.id] && <span className="absolute top-2.5 right-2.5 text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: `${s.color}18`, color: s.color }}>{tt('Bugün ✓')}</span>}
            <span className="text-3xl">{s.emoji}</span>
            <p className="text-sm font-black mt-2" style={{ color: theme.textPrimary }}>{s.title}</p>
            <p className="text-[10.5px] mt-0.5" style={{ color: theme.textSecondary }}>{s.desc}</p>
            <p className="text-[9px] mt-2 font-bold" style={{ color: s.color }}>{s.source}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── 🎯 Zaman Yolcusu soru üretici — 5 farklı soru tarzı, her seferinde taze ───
function makeTarihRounds() {
  const flat = TARIH_DONEMLERI.flatMap(era => era.items.map(it => ({ ...it, eraTitle: era.title })));
  const pool = shuffle(flat);
  const offset = Math.floor(Math.random() * 5);
  const rounds = [];
  for (let i = 0; i < 10; i++) {
    const it = pool[i % pool.length];
    const others = shuffle(flat.filter(x => x.id !== it.id)).slice(0, 3);
    const info = it.detail.length > 150 ? `${it.detail.slice(0, 150)}...` : it.detail;
    const style = (i + offset) % 5;
    if (style === 0) {
      rounds.push({ tag: '🕵️ Kim / Ne?', q: `"${it.desc}" — Bu katkı hangisine aittir?`, opts: shuffle([it, ...others]).map(x => x.title), correct: it.title, info });
    } else if (style === 1) {
      rounds.push({ tag: '🔍 Ne yaptı?', q: `${it.title} — bu maddenin katkısı hangisidir?`, opts: shuffle([it, ...others]).map(x => x.desc), correct: it.desc, info });
    } else if (style === 2) {
      const years = [...new Set(flat.map(x => x.year))].filter(y => y !== it.year);
      rounds.push({ tag: '📅 Hangi tarih?', q: `${it.title} hangi tarihe kaydedilir?`, opts: shuffle([it.year, ...shuffle(years).slice(0, 3)]), correct: it.year, info });
    } else if (style === 3) {
      rounds.push({ tag: '🗺️ Hangi dönem?', q: `"${it.title}" hangi dönemin parçasıdır?`, opts: shuffle(TARIH_DONEMLERI.map(e => e.title)), correct: it.eraTitle, info });
    } else {
      const truth = Math.random() < 0.5;
      const desc = truth ? it.desc : others[0].desc;
      rounds.push({ tag: '⚖️ Doğru mu, yanlış mı?', q: `${it.title}: "${desc}"`, opts: ['Doğru', 'Yanlış'], correct: truth ? 'Doğru' : 'Yanlış', info });
    }
  }
  return shuffle(rounds);
}

// ─── 🏛️ TARİH — katmanlı: madde → SVG çizim + derin anlatım ───
function TarihSection({ theme, user, onBack }) {
  const tt = useTx();
  const [open, setOpen] = useState(null);
  const [quiz, setQuiz] = useState(false);
  const [readIds, setReadIds] = useState(() => load('tarih_read', []));

  const flat = useMemo(() => TARIH_DONEMLERI.flatMap(era => era.items.map(it => ({ ...it, color: era.color, eraTitle: era.title }))), []);
  const featured = useMemo(() => {
    const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return flat[doy % flat.length];
  }, [flat]);

  const openItem = (it) => {
    setOpen(o => (o === it.id ? null : it.id));
    if (!readIds.includes(it.id)) {
      const next = [...readIds, it.id];
      setReadIds(next); save('tarih_read', next);
      awardXPOnce(user, `tarih_${it.id}`, 'hadith_read', { points: 6, details: `Tarih: ${it.title}` });
    }
  };

  const ItemCard = ({ it, color }) => {
    const isOpen = open === it.id;
    const isRead = readIds.includes(it.id);
    return (
      <div className="relative">
        <span className="absolute -left-[15px] top-3 w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}80` }} />
        <button onClick={() => openItem(it)}
          className="w-full text-left rounded-xl p-2.5 -m-0.5 transition-all"
          style={{ background: isOpen ? `${color}0c` : 'transparent', border: `1px solid ${isOpen ? `${color}40` : 'transparent'}` }}>
          <p className="text-xs font-black flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0" style={{ background: `${color}16`, color }}>{it.year}</span>
            <span className="flex-1">{it.title}</span>
            {isRead && <Check size={11} style={{ color }} className="shrink-0" />}
            <ChevronDown size={12} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: theme.textSecondary }} />
          </p>
          <p className="text-[10.5px] mt-1 leading-relaxed" style={{ color: theme.textSecondary }}>{it.desc}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                {/* Ne ile uğraştı? — SVG sahnesi */}
                <div className="rounded-xl mt-2.5 pt-2 px-2" style={{ background: `linear-gradient(160deg, ${color}10, transparent)`, border: `1px dashed ${color}35` }}>
                  <TarihArt type={it.art} color={color} />
                  <p className="text-center text-[8px] font-black uppercase tracking-[0.2em] pb-2" style={{ color }}>{tt('Ne ile uğraştı?')}</p>
                </div>
                <p className="text-[11px] mt-2.5 leading-[1.75]" style={{ fontFamily: 'Georgia, serif', color: `${theme.textPrimary}ee` }}>{it.detail}</p>
                <span className="flex items-center gap-2 mt-2.5">
                  <span role="button" onClick={(e) => { e.stopPropagation(); shareText(`💡 Biliyor muydun?\n${it.year} — ${it.title}\n\n${it.desc}\n\n${it.detail}\n\n🏛️ Dünya Tarihinde Müslümanlar · İslami Yaşam Asistanı`); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black active:scale-95"
                    style={{ background: `${color}14`, color, border: `1px solid ${color}35` }}>
                    <Share2 size={10} /> Paylaş
                  </span>
                  {isRead && <span className="text-[9px] font-black" style={{ color }}>{tt('✓ Okundu · +6 XP')}</span>}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    );
  };

  if (quiz) {
    return (
      <div className="max-w-2xl mx-auto">
        <Head title={tt("🎯 Zaman Yolcusu")} sub={tt("Buluş bilgini sına — sorular her seferinde farklı tarzda gelir")} onBack={() => setQuiz(false)} theme={theme} />
        <MiniQuiz title="Zaman Yolcusu" color="#A78BFA" theme={theme} user={user}
          makeRounds={makeTarihRounds} xpKey="tarihquiz" onExit={() => setQuiz(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Head title={tt("🏛️ Dünya Tarihinde Müslümanlar")} sub={`${readIds.length}/${TARIH_TOPLAM} ${tt("buluş keşfedildi · maddeye dokun, çizimli katman açılsın")}`} onBack={onBack} theme={theme} />

      {/* 🎯 Zaman Yolcusu */}
      <div className="px-5 mb-3">
        <button onClick={() => setQuiz(true)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl text-left active:scale-98 transition-transform"
          style={{ background: 'linear-gradient(120deg, #2E1065, #5B21B6)', border: '1px solid #A78BFA50' }}>
          <Swords size={22} style={{ color: '#C4B5FD' }} />
          <div className="flex-1">
            <p className="text-sm font-black" style={{ color: '#EDE9FE' }}>{tt('Zaman Yolcusu · Bilgi Sınavı')}</p>
            <p className="text-[10px]" style={{ color: '#C4B5FD' }}>{tt('5 farklı soru tarzı, her açılışta yeni karışım — bitmek bilmez (+15 XP/gün)')}</p>
          </div>
          <ChevronRight size={16} style={{ color: '#C4B5FD' }} />
        </button>
      </div>

      {/* Günün Buluşu */}
      <div className="px-5 mb-4">
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => openItem(featured)}
          className="w-full text-left rounded-2xl p-4 relative overflow-hidden active:scale-[0.98] transition-transform"
          style={{ background: `linear-gradient(120deg, ${featured.color}18, ${theme.surface})`, border: `1.5px solid ${featured.color}45` }}>
          <span className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-25 pointer-events-none" style={{ background: `radial-gradient(circle, ${featured.color}, transparent 65%)` }} />
          <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: featured.color }}>{tt('💡 Günün Buluşu')}</p>
          <p className="text-sm font-black mt-1" style={{ color: theme.textPrimary }}>{featured.year} · {featured.title}</p>
          <p className="text-[10.5px] mt-1" style={{ color: theme.textSecondary }}>{featured.desc}</p>
          <p className="text-[9px] mt-1.5 font-bold" style={{ color: featured.color }}>{featured.eraTitle} · {tt('aşağıda açıldı ↓')}</p>
        </motion.button>
      </div>

      <div className="px-5 space-y-4">
        {TARIH_DONEMLERI.map((era, ei) => {
          const eraRead = era.items.filter(it => readIds.includes(it.id)).length;
          return (
            <motion.div key={era.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ei * 0.07 }}
              className="rounded-3xl p-4 relative overflow-hidden"
              style={{ background: theme.surface, border: `1.5px solid ${era.color}30` }}>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{era.emoji}</span>
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: era.color }}>{era.era}</p>
                  <p className="text-base font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{era.title}</p>
                </div>
                <span className="text-[9px] font-black px-2 py-1 rounded-full shrink-0" style={{ background: `${era.color}14`, color: era.color }}>
                  {eraRead}/{era.items.length}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed mb-3" style={{ color: theme.textSecondary }}>{era.intro}</p>
              <div className="relative pl-4 space-y-2">
                <span className="absolute left-[5px] top-1 bottom-1 w-0.5 rounded-full" style={{ background: `linear-gradient(180deg, ${era.color}, ${era.color}15)` }} />
                {era.items.map(it => <ItemCard key={it.id} it={it} color={era.color} />)}
              </div>
            </motion.div>
          );
        })}
        <p className="text-[9px] text-center pb-2" style={{ color: theme.textSecondary }}>
          {tt('Tarihler yaygın kabul gören ansiklopedik kayıtlara göre yaklaşık verilmiştir.')}
        </p>
      </div>
    </div>
  );
}

// ─── ✨ MUCİZELER ───
function MucizelerSection({ theme, user, onBack }) {
  const tt = useTx();
  const [open, setOpen] = useState(null);
  const [readIds, setReadIds] = useState(() => load('mucize_read', []));
  const markRead = (m) => {
    if (readIds.includes(m.id)) return;
    const next = [...readIds, m.id];
    setReadIds(next); save('mucize_read', next);
    awardXPOnce(user, `mucize_${m.id}`, 'hadith_read', { points: 8, details: `Mucize: ${m.title}` });
  };
  return (
    <div className="max-w-2xl mx-auto">
      <Head title={tt("✨ Kur'an'daki Mucizeler")} sub={`${readIds.length}/${MUCIZELER.length} ${tt("işaret okundu")}`} onBack={onBack} theme={theme} />
      {/* Sorumlu çerçeve */}
      <div className="px-5 mb-4">
        <div className="rounded-2xl p-3.5" style={{ background: `${theme.gold}0a`, border: `1px solid ${theme.gold}30` }}>
          <p className="text-[10.5px] leading-relaxed" style={{ color: theme.textSecondary }}>
            <span className="font-black" style={{ color: theme.gold }}>{tt('Ölçümüz:')}</span> Kur'an bir fen kitabı değil, hidayet kitabıdır.
            Ancak 14 asır önce inen ayetlerdeki işaretlerin bugünkü bilgiyle örtüşmesi, "Düşünmüyorlar mı?" çağrısının bir karşılığıdır.
            Her kartta ayet, meal ve modern bilgi birlikte sunulur.
          </p>
        </div>
      </div>
      <div className="px-5 grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
        {MUCIZELER.map((m, i) => {
          const isOpen = open === m.id;
          const isRead = readIds.includes(m.id);
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.05 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: theme.surface, border: `1.5px solid ${isOpen ? `${m.color}60` : isRead ? `${m.color}35` : theme.cardBorder}` }}>
              <button onClick={() => { setOpen(isOpen ? null : m.id); if (!isOpen) markRead(m); }} className="w-full text-left">
                {/* İnfografik */}
                <div className="pt-4 px-4" style={{ background: `linear-gradient(160deg, ${m.color}10, transparent)` }}>
                  <MiracleArt type={m.art} color={m.color} />
                </div>
                <div className="px-4 pb-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.emoji}</span>
                    <p className="text-sm font-black flex-1" style={{ color: theme.textPrimary }}>{m.title}</p>
                    {isRead && <Check size={13} style={{ color: m.color }} />}
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: theme.textSecondary }} />
                  </div>
                  <p className="text-[9.5px] font-black mt-1" style={{ color: m.color }}>{m.source}</p>
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div className="px-4 pb-4">
                      <p className="text-[12.5px] italic leading-relaxed pl-2.5" style={{ fontFamily: 'Georgia, serif', color: theme.textPrimary, borderLeft: `2px solid ${m.color}` }}>
                        {m.verse}
                      </p>
                      <div className="rounded-xl p-3 mt-3" style={{ background: `${m.color}0c`, border: `1px solid ${m.color}25` }}>
                        <p className="text-[9px] font-black uppercase tracking-wider mb-1" style={{ color: m.color }}>{tt('🔬 Modern bilgi')}</p>
                        <p className="text-[11.5px] leading-relaxed" style={{ color: theme.textPrimary }}>{m.fact}</p>
                      </div>
                      <p className="text-[10.5px] mt-2.5 leading-relaxed" style={{ color: theme.textSecondary }}>
                        <Sparkles size={10} className="inline mr-1" style={{ color: m.color }} />{m.detail}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 🌟 Esma sınavı — 4 farklı soru tarzı, her seferinde taze ───
function makeEsmaRounds() {
  const pool = shuffle(ESMA);
  const offset = Math.floor(Math.random() * 4);
  const rounds = [];
  for (let i = 0; i < 10; i++) {
    const e = pool[i % pool.length];
    const others = shuffle(ESMA.filter(x => x.n !== e.n)).slice(0, 3);
    const info = `${e.name}: ${e.mean}`;
    const style = (i + offset) % 4;
    if (style === 0) {
      rounds.push({ tag: '📖 Anlamı ne?', q: `"${e.name}" ne demektir?`, opts: shuffle([e, ...others]).map(x => x.mean), correct: e.mean, info });
    } else if (style === 1) {
      rounds.push({ tag: '🔎 Hangi isim?', q: `"${e.mean}" — bu hangi ismin anlamıdır?`, opts: shuffle([e, ...others]).map(x => x.name), correct: e.name, info });
    } else if (style === 2) {
      rounds.push({ tag: '✒️ Hattı tanı', qAr: e.ar, q: 'Bu hat hangi ismi yazıyor?', opts: shuffle([e, ...others]).map(x => x.name), correct: e.name, info });
    } else {
      rounds.push({ tag: '💭 Tefekkürden bul', q: `"${e.tef}" — bu tefekkür hangi ismi anlatıyor?`, opts: shuffle([e, ...others]).map(x => x.name), correct: e.name, info: e.mean });
    }
  }
  return shuffle(rounds);
}

// ─── 🌟 ESMAÜL HÜSNA — derin katman ───
function EsmaSection({ theme, user, onBack }) {
  const tt = useTx();
  const [openN, setOpenN] = useState(null);
  const [query, setQuery] = useState('');
  const [quiz, setQuiz] = useState(false);
  const [readNs, setReadNs] = useState(() => load('esma_read', []));

  const featured = useMemo(() => {
    const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return ESMA[doy % ESMA.length];
  }, []);

  const openEsma = useCallback((e) => {
    setOpenN(e.n);
    setReadNs(prev => {
      if (prev.includes(e.n)) return prev;
      const next = [...prev, e.n];
      save('esma_read', next);
      awardXPOnce(user, `esma_${e.n}`, 'hadith_read', { points: 2, details: `Esma: ${e.name}` });
      return next;
    });
  }, [user]);

  const active = ESMA.find(e => e.n === openN);
  const filtered = query.trim()
    ? ESMA.filter(e => e.name.toLowerCase().includes(query.toLowerCase()) || e.mean.toLowerCase().includes(query.toLowerCase()))
    : ESMA;

  if (quiz) {
    return (
      <div className="max-w-2xl mx-auto">
        <Head title={tt("🎯 Esma Ezberi")} sub={tt("4 farklı soru tarzı — hat, anlam ve tefekkürden")} onBack={() => setQuiz(false)} theme={theme} />
        <MiniQuiz title="Esma Ezberi" color="#E8C56C" theme={theme} user={user}
          makeRounds={makeEsmaRounds} xpKey="esmaquiz" onExit={() => setQuiz(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Head title={tt("🌟 Esmaül Hüsna")} sub={`${readNs.length}/99 ${tt("isim keşfedildi")} · ${tt("En güzel isimler Allah'ındır (A'râf 180)")}`} onBack={onBack} theme={theme} />

      {/* Günün İsmi */}
      <div className="px-5 mb-3">
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => openEsma(featured)}
          className="w-full text-left rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #3B2A16, #8A5A12)', border: '1.5px solid #E8C56C50' }}>
          <span className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #E8C56C, transparent 65%)' }} />
          <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: '#E8C56C' }}>{tt('🌟 Günün İsmi')} · {featured.n}/99</p>
          <p dir="rtl" className="text-4xl mt-2 text-center" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: '#F5E3B0', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.4))' }}>
            {featured.ar}
          </p>
          <p className="text-center text-base font-black mt-1.5" style={{ fontFamily: 'Playfair Display, serif', color: '#F5F0E4' }}>{featured.name}</p>
          <p className="text-center text-[11px] mt-0.5" style={{ color: 'rgba(245,240,228,0.85)' }}>{featured.mean}</p>
          <p className="text-center text-[9px] mt-2 font-bold" style={{ color: '#E8C56C' }}>{tt('dokun — tefekkürü açılsın')}</p>
        </motion.button>
      </div>

      {/* Esma Ezberi */}
      <div className="px-5 mb-3">
        <button onClick={() => setQuiz(true)}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left active:scale-98 transition-transform"
          style={{ background: `${theme.gold}10`, border: `1.5px solid ${theme.gold}35` }}>
          <Swords size={20} style={{ color: theme.gold }} />
          <div className="flex-1">
            <p className="text-xs font-black" style={{ color: theme.textPrimary }}>{tt('Esma Ezberi · Bilgi Sınavı')}</p>
            <p className="text-[10px]" style={{ color: theme.textSecondary }}>{tt('Hat, anlam ve tefekkürden 4 tarz soru — her açılışta yeni karışım (+15 XP/gün)')}</p>
          </div>
          <ChevronRight size={15} style={{ color: theme.gold }} />
        </button>
      </div>

      {/* Arama */}
      <div className="px-5 mb-3 relative">
        <Search size={14} className="absolute left-8 top-1/2 -translate-y-1/2" style={{ color: theme.textSecondary }} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder={tt("İsim veya anlam ara...")}
          className="w-full rounded-2xl pl-9 pr-4 py-2.5 text-xs focus:outline-none"
          style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }} />
      </div>

      {/* 99 raf */}
      <div className="px-5 grid grid-cols-2 md:grid-cols-3 gap-2 pb-4">
        {filtered.map(e => {
          const isRead = readNs.includes(e.n);
          return (
            <button key={e.n} onClick={() => openEsma(e)}
              className="rounded-2xl p-3 text-center active:scale-95 transition-transform relative"
              style={{ background: theme.surface, border: `1.5px solid ${isRead ? `${theme.gold}45` : theme.cardBorder}` }}>
              <span className="absolute top-1.5 left-2 text-[8px] font-black" style={{ color: theme.textSecondary }}>{e.n}</span>
              {isRead && <span className="absolute top-1.5 right-2 text-[9px]" style={{ color: theme.gold }}>✦</span>}
              <p dir="rtl" className="text-xl leading-snug" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: theme.gold }}>{e.ar}</p>
              <p className="text-[10.5px] font-black mt-1" style={{ color: theme.textPrimary }}>{e.name}</p>
              <p className="text-[8.5px] mt-0.5 leading-tight line-clamp-2" style={{ color: theme.textSecondary }}>{e.mean}</p>
            </button>
          );
        })}
      </div>

      {/* Detay modalı */}
      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center px-6"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }} onClick={() => setOpenN(null)}>
            <motion.div initial={{ scale: 0.85, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl p-6 text-center relative overflow-hidden"
              style={{ background: theme.surface, border: `2px solid ${theme.gold}55` }}>
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-15 pointer-events-none" style={{ background: `radial-gradient(circle, ${theme.gold}, transparent 65%)` }} />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] relative" style={{ color: theme.gold }}>{active.n}{tt('. isim')}</p>
              <p dir="rtl" className="text-5xl mt-3 relative" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: theme.gold, filter: `drop-shadow(0 0 16px ${theme.gold}50)` }}>
                {active.ar}
              </p>
              <p className="text-xl font-black mt-2 relative" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{active.name}</p>
              <p className="text-xs mt-1 relative" style={{ color: theme.textSecondary }}>{active.mean}</p>
              <div className="rounded-2xl p-3.5 mt-4 text-left relative" style={{ background: `${theme.gold}0c`, border: `1px solid ${theme.gold}30` }}>
                <p className="text-[9px] font-black uppercase tracking-wider mb-1.5" style={{ color: theme.gold }}>{tt('💭 Tefekkür')}</p>
                <p className="text-[12px] leading-[1.75]" style={{ fontFamily: 'Georgia, serif', color: theme.textPrimary }}>{active.tef}</p>
              </div>
              <div className="flex gap-2 mt-4 relative">
                <button onClick={() => { const i = ESMA.findIndex(x => x.n === active.n); openEsma(ESMA[(i - 1 + ESMA.length) % ESMA.length]); }}
                  className="w-10 py-2.5 rounded-xl text-xs font-black active:scale-95" style={{ background: `${theme.textSecondary}12`, color: theme.textSecondary }}>←</button>
                <button onClick={() => shareText(`🌟 Esmaül Hüsna · ${active.n}/99\n\n${active.ar}\n${active.name} — ${active.mean}\n\n💭 ${active.tef}\n\nİslami Yaşam Asistanı`)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-95"
                  style={{ background: `${theme.gold}14`, border: `1px solid ${theme.gold}40`, color: theme.gold }}>
                  <Share2 size={12} /> Paylaş
                </button>
                <button onClick={() => { const i = ESMA.findIndex(x => x.n === active.n); openEsma(ESMA[(i + 1) % ESMA.length]); }}
                  className="w-10 py-2.5 rounded-xl text-xs font-black active:scale-95" style={{ background: theme.gold, color: '#06231A' }}>→</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 🗂️ MERKEZ: büyük kartlar (canlı ilerleme rozetli) ───
export function HazineCards({ theme, navigate, compact = false }) {
  const tt = useTx();
  // Her bölümün gerçek ilerlemesi — kartın köşesinde canlı rozet
  const progress = {
    dualar: `${load('dua_read', []).length}/${HIDAYET_DUALARI.length} dua`,
    tesbihat: `bugün ${Object.keys(load(`tesbihat_log_${todayKey()}`, {})).length}/${TESBIHAT_SETS.length} set`,
    kissalar: `${load('story_read', []).length} kıssa okundu`,
    tarih: `${load('tarih_read', []).length}/${TARIH_TOPLAM} buluş`,
    mucizeler: `${load('mucize_read', []).length}/${MUCIZELER.length} işaret`,
    esma: `${load('esma_read', []).length}/99 isim`,
  };
  return (
    <div className={compact ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-3'}>
      {HAZINE_BOLUMLERI.map((b, i) => (
        <motion.button key={b.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
          onClick={() => navigate(b.route)}
          className="w-full text-left rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform"
          style={{ background: `linear-gradient(135deg, ${b.grad[0]}, ${b.grad[1]})`, border: `1.5px solid ${b.accent}40`, minHeight: 128 }}>
          {/* Süsleme */}
          <span className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-25 pointer-events-none" style={{ background: `radial-gradient(circle, ${b.accent}, transparent 65%)` }} />
          <span className="absolute top-3 right-5 text-[8px]" style={{ color: `${b.accent}90` }}>✦</span>
          <span className="absolute top-7 right-10 text-[6px]" style={{ color: `${b.accent}60` }}>✦</span>
          <div className="flex items-start gap-3.5 relative">
            <span className="text-4xl shrink-0" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))' }}>{b.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-base font-black leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#F5F0E4' }}>{b.title}</p>
              <p className="text-[9px] font-black uppercase tracking-wider mt-1" style={{ color: b.accent }}>{b.meta}</p>
              <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'rgba(245,240,228,0.82)' }}>{b.desc}</p>
              {progress[b.id] && (
                <span className="inline-block mt-2.5 text-[9px] font-black px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.3)', color: b.accent, border: `1px solid ${b.accent}40` }}>
                  📊 {progress[b.id]}
                </span>
              )}
            </div>
            <ChevronRight size={16} className="shrink-0 mt-1" style={{ color: b.accent }} />
          </div>
        </motion.button>
      ))}
    </div>
  );
}

export default function HazinePage() {
  const tt = useTx();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { section } = useParams();
  const back = useCallback(() => navigate('/hazine'), [navigate]);
  const valid = useMemo(() => ['dualar', 'tesbihat', 'tarih', 'mucizeler', 'esma'].includes(section), [section]);

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      {!valid ? (
        <div className="max-w-3xl mx-auto">
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/yol')} className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90" style={{ background: `${theme.gold}10` }} aria-label="Nur Yolu">
                <ArrowLeft size={17} style={{ color: theme.gold }} />
              </button>
              <div>
                <h1 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{tt('💛 Nur Hazinesi')}</h1>
                <p className="text-xs" style={{ color: theme.textSecondary }}>{tt('Dualar, tesbihat, kıssalar, tarih ve mucizeler — hepsi yolun azığı')}</p>
              </div>
            </div>
          </div>
          <div className="px-5">
            <HazineCards theme={theme} navigate={navigate} />
          </div>
        </div>
      ) : section === 'dualar' ? (
        <DualarSection theme={theme} onBack={back} />
      ) : section === 'tesbihat' ? (
        <TesbihatSection theme={theme} user={user} onBack={back} />
      ) : section === 'tarih' ? (
        <TarihSection theme={theme} user={user} onBack={back} />
      ) : section === 'esma' ? (
        <EsmaSection theme={theme} user={user} onBack={back} />
      ) : (
        <MucizelerSection theme={theme} user={user} onBack={back} />
      )}
    </div>
  );
}
