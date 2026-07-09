import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Flame, Star, Gem, Trophy, CheckCircle2, Gift, Crown, Medal, ChevronRight, Library, Users, Award, Swords, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { awardXP, fetchStats, subscribeStats, getCachedStats, getUsername } from '../services/gamification';
import { BANK_SIZE, BANK_CATEGORIES } from '../data/questionBank';
import api from '../api';
import WheelGame from './games/WheelGame';
import WordGame from './games/WordGame';
import RapidQuiz from './games/RapidQuiz';
import MatchGame from './games/MatchGame';
import SurvivalGame from './games/SurvivalGame';
import ClassicTest from './games/ClassicTest';
import AIDuel from './games/AIDuel';
import BossBattle from './games/BossBattle';
import OrderGame from './games/OrderGame';
import VoiceGuess from './games/VoiceGuess';

// ════════════════════════════════════════════════════════════
// OYUN MERKEZİ — referans tasarım birebir (mobil düzene uyarlı)
// Başka uygulamaya taşınabilir: bu dosya + pages/games/* +
// data/questionBank* + data/gameData + services/gamification
// ════════════════════════════════════════════════════════════

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000];
const LEVEL_TITLES = ['Çaylak', 'Talebe', 'Meraklı', 'Bilge Adayı', 'İlim Yolcusu', 'Hafız Ruhlu', 'İlim Eri', 'Üstat', 'Ârif', 'Ulu Bilge'];

const LEAGUES = [
  { name: 'Bronz Lig', min: 0, color: '#CD7F32' },
  { name: 'Gümüş Lig', min: 500, color: '#C0C0C0' },
  { name: 'Altın Lig', min: 1500, color: '#FFD369' },
  { name: 'Zümrüt Lig', min: 3000, color: '#10B981' },
  { name: 'Elmas Lig', min: 6000, color: '#60A5FA' },
];

// ─── Oyun modları (referanstaki 11 kart) ───
const GAME_MODES = [
  { id: 'rapid', title: 'Hızlı Bilgi (Blitz)', desc: '30 saniye, 10 soru. Hızını ve bilgini test et!', emoji: '⚡', color: '#F59E0B', type: 'game_quiz', Comp: RapidQuiz },
  { id: 'survival', title: 'Sonsuz Mod', desc: 'Yanlış yapana kadar mücadele et!', emoji: '♾️', color: '#3B82F6', type: 'game_quiz', Comp: SurvivalGame },
  { id: 'classic', title: 'Klasik Test', desc: '10, 20, 50 veya 100 soru seç ve başla!', emoji: '📖', color: '#10B981', type: 'game_quiz', Comp: ClassicTest },
  { id: 'duel', title: 'Arkadaş Düellosu', desc: 'Arkadaşlarınla 1v1 düello yap, bilgini göster!', emoji: '⚔️', color: '#F97316', route: '/multiplayer', cta: 'Düello Başlat' },
  { id: 'ai', title: 'AI Rakip', desc: 'Yapay zekaya karşı yarış. Zorlaştıkça puanın artar!', emoji: '🤖', color: '#8B5CF6', type: 'game_quiz', Comp: AIDuel },
  { id: 'boss', title: 'Patron Savaşı', desc: 'Zorlu mücadele! Patronu yen, ödülleri kap!', emoji: '👹', color: '#7C3AED', type: 'game_quiz', Comp: BossBattle, cta: 'Savaşa Katıl' },
  { id: 'memory', title: 'Hafıza Oyunu', desc: 'Kartları eşleştir, bilgini tazele!', emoji: '🧠', color: '#EC4899', type: 'game_match', Comp: MatchGame },
  { id: 'order', title: 'Doğru Sırala', desc: 'Bilgileri doğru sıraya koy, ustalaş!', emoji: '🔢', color: '#EAB308', type: 'game_match', Comp: OrderGame },
  { id: 'word', title: 'Kelime Bulmaca', desc: 'Kelimeyi bul, manayı keşfet! Eğlenerek öğren.', emoji: '🔤', color: '#6366F1', type: 'game_word', Comp: WordGame },
  { id: 'wheel', title: 'Çarkıfelek', desc: 'Çarkı çevir, kategorinden soruyu bil!', emoji: '🎡', color: '#14B8A6', type: 'game_wheel', Comp: WheelGame },
  { id: 'voice', title: 'Sesli Tahmin', desc: 'Kıraati dinle, surenin adını tahmin et!', emoji: '🎵', color: '#22C55E', type: 'game_quiz', Comp: VoiceGuess },
];

const CAT_ICONS = {
  Kuran: '📖', Hadis: '📜', Siyer: '🕌', Peygamberler: '⭐', Sahabe: '👥',
  Tarih: '🏰', İbadet: '🕋', Fıkıh: '⚖️', Ramazan: '🌙', Medeniyet: '🏛️',
  Genel: '✨', İtikat: '💠', Ahlak: '❤️', 'Esmaül Hüsna': '💎', Dualar: '🤲',
  İlmihal: '📚', Çocuk: '🧒',
};

const WEEK_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'];

// ─── Yerel ilerleme (görevler / sandıklar / başarılar) ───
const todayKey = () => new Date().toISOString().split('T')[0];
const load = (k, def) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };
const emptyDaily = () => ({ answers: 0, correct: 0, hadis: 0, wins: 0, combo: 0, bestCombo: 0, claimedTasks: [], claimedChests: [], xp: 0 });
const loadDaily = () => load(`gc_daily_${todayKey()}`, emptyDaily());
const loadTotals = () => load('gc_totals', { answers: 0, correct: 0, wins: 0, byCat: {} });
const loadGameMeta = () => load('game_meta', {});

function levelInfo(points) {
  let lvl = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) if (points >= LEVEL_THRESHOLDS[i]) lvl = i + 1;
  const cur = LEVEL_THRESHOLDS[lvl - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[lvl] ?? (cur + 1000);
  return { lvl, cur, next, pct: Math.min(100, Math.round(((points - cur) / (next - cur)) * 100)) };
}
function leagueInfo(points) {
  let li = 0;
  for (let i = 0; i < LEAGUES.length; i++) if (points >= LEAGUES[i].min) li = i;
  const cur = LEAGUES[li];
  const next = LEAGUES[li + 1] || null;
  const pct = next ? Math.min(100, Math.round(((points - cur.min) / (next.min - cur.min)) * 100)) : 100;
  return { cur, next, pct };
}

// ─── Cami gece silueti (dış görsel yok — saf SVG) ───
function MosqueScene({ theme }) {
  return (
    <svg viewBox="0 0 400 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="gcSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#04150d" />
          <stop offset="100%" stopColor="#0a2a1a" />
        </linearGradient>
        <radialGradient id="gcGlow" cx="0.5" cy="1" r="0.9">
          <stop offset="0%" stopColor="#ffd36922" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="120" fill="url(#gcSky)" />
      <rect width="400" height="120" fill="url(#gcGlow)" />
      {[[30, 18], [70, 40], [120, 14], [340, 22], [370, 44], [300, 10], [255, 30]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill="#ffd369" opacity={0.7 - (i % 3) * 0.15} />
      ))}
      {/* Hilal */}
      <path d="M347 28 a13 13 0 1 0 12 20 a10.5 10.5 0 1 1 -12 -20 Z" fill="#ffd369" opacity="0.9" transform="translate(-22,-12)" />
      {/* Cami silueti */}
      <g fill="#06281a" stroke="#ffd36933" strokeWidth="0.8">
        <rect x="150" y="86" width="100" height="34" />
        <path d="M160 86 Q200 38 240 86 Z" />
        <circle cx="200" cy="58" r="4" fill="#ffd369" stroke="none" opacity="0.85" />
        <rect x="126" y="60" width="8" height="60" />
        <path d="M122 60 L130 42 L138 60 Z" />
        <rect x="266" y="60" width="8" height="60" />
        <path d="M262 60 L270 42 L278 60 Z" />
        <rect x="176" y="98" width="12" height="22" rx="6" fill="#ffd369" opacity="0.25" stroke="none" />
        <rect x="212" y="98" width="12" height="22" rx="6" fill="#ffd369" opacity="0.25" stroke="none" />
      </g>
    </svg>
  );
}

// ─── Lig arması (SVG kalkan) ───
function LeagueEmblem({ color, size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 3 L40 9 V24 C40 34 33 41 24 45 C15 41 8 34 8 24 V9 Z" fill={`${color}28`} stroke={color} strokeWidth="2.4" />
      <path d="M24 12 L27.5 19.5 L35 20.5 L29.5 26 L31 34 L24 30 L17 34 L18.5 26 L13 20.5 L20.5 19.5 Z" fill={color} />
    </svg>
  );
}

export default function GamesPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const [stats, setStats] = useState(() => getCachedStats() || { total_points: 0, level: 1, current_streak: 0 });
  const [daily, setDaily] = useState(loadDaily);
  const [totals, setTotals] = useState(loadTotals);
  const [gameMeta, setGameMeta] = useState(loadGameMeta);
  const [leaderboard, setLeaderboard] = useState([]);
  const [midnight, setMidnight] = useState('');
  const [floats, setFloats] = useState([]);
  const floatId = useRef(0);

  const username = getUsername(user);

  // Günün Oyunu (2x XP) — tarihe göre döner
  const dailyGameId = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const playable = GAME_MODES.filter(g => g.Comp);
    return playable[dayOfYear % playable.length].id;
  }, []);

  useEffect(() => {
    fetchStats(user).then(s => { if (s) setStats(s); });
    const unsub = subscribeStats(s => { if (s) setStats(prev => ({ ...prev, ...s })); });
    api.get('/gamification/leaderboard?limit=5').then(r => { if (Array.isArray(r.data)) setLeaderboard(r.data); }).catch(() => {});
    return unsub;
  }, [user]);

  // Gece yarısına geri sayım (günlük görevler)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const mid = new Date(now); mid.setHours(24, 0, 0, 0);
      const d = mid - now;
      setMidnight(`${String(Math.floor(d / 3600000)).padStart(2, '0')}:${String(Math.floor((d % 3600000) / 60000)).padStart(2, '0')}:${String(Math.floor((d % 60000) / 1000)).padStart(2, '0')}`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const pushFloat = useCallback((amount, bonus) => {
    const id = ++floatId.current;
    setFloats(f => [...f, { id, amount, bonus }]);
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1600);
  }, []);

  // Oyunlardan gelen olaylar → görev/sandık/başarı ilerlemesi
  const handleEvent = useCallback((type, data = {}) => {
    setDaily(prev => {
      const d = { ...prev };
      if (type === 'answer') {
        d.answers += 1;
        if (data.correct) {
          d.correct += 1;
          d.combo += 1;
          d.bestCombo = Math.max(d.bestCombo, d.combo);
          if (data.category === 'Hadis') d.hadis += 1;
        } else d.combo = 0;
      }
      if (type === 'win') d.wins += 1;
      save(`gc_daily_${todayKey()}`, d);
      return d;
    });
    setTotals(prev => {
      const t = { ...prev, byCat: { ...prev.byCat } };
      if (type === 'answer') {
        t.answers += 1;
        if (data.correct) {
          t.correct += 1;
          if (data.category) t.byCat[data.category] = (t.byCat[data.category] || 0) + 1;
        }
      }
      if (type === 'win') t.wins += 1;
      save('gc_totals', t);
      return t;
    });
  }, []);

  const openGame = useCallback((g) => {
    if (g.locked) return;
    if (g.route) { navigate(g.route); return; }
    setActive(g.id);
    setGameMeta(prev => {
      const meta = { ...prev, [g.id]: { plays: (prev[g.id]?.plays || 0) + 1, xp: prev[g.id]?.xp || 0 } };
      save('game_meta', meta);
      return meta;
    });
  }, [navigate]);

  const handleXP = useCallback(async (amount, type, label) => {
    const isDaily = active && dailyGameId === active;
    const finalAmount = isDaily ? amount * 2 : amount;
    pushFloat(finalAmount, isDaily);
    setStats(prev => ({ ...prev, total_points: (prev.total_points || 0) + finalAmount }));
    setDaily(prev => { const d = { ...prev, xp: prev.xp + finalAmount }; save(`gc_daily_${todayKey()}`, d); return d; });
    if (active) {
      setGameMeta(prev => {
        const meta = { ...prev, [active]: { plays: prev[active]?.plays || 1, xp: (prev[active]?.xp || 0) + finalAmount } };
        save('game_meta', meta);
        return meta;
      });
    }
    await awardXP(user, type, { points: finalAmount, details: isDaily ? `${label} (Günün Oyunu 2x)` : label });
  }, [user, active, dailyGameId, pushFloat]);

  // Görev / sandık ödül alma
  const claimReward = useCallback(async (kind, id, xpReward) => {
    setDaily(prev => {
      const key = kind === 'task' ? 'claimedTasks' : 'claimedChests';
      if (prev[key].includes(id)) return prev;
      const d = { ...prev, [key]: [...prev[key], id] };
      save(`gc_daily_${todayKey()}`, d);
      return d;
    });
    pushFloat(xpReward, false);
    setStats(prev => ({ ...prev, total_points: (prev.total_points || 0) + xpReward }));
    await awardXP(user, 'game_quiz', { points: xpReward, details: kind === 'task' ? 'Günlük Görev Ödülü' : 'Sandık Ödülü' });
  }, [user, pushFloat]);

  const totalXP = stats.total_points || 0;
  const { lvl, next, pct } = levelInfo(totalXP);
  const league = leagueInfo(totalXP);
  const levelTitle = LEVEL_TITLES[Math.min((stats.level || lvl) - 1, LEVEL_TITLES.length - 1)];
  const activeGame = GAME_MODES.find(g => g.id === active);

  const TASKS = [
    { id: 'hadis5', icon: '🏆', label: '5 hadis sorusu çöz', cur: daily.hadis, max: 5, xp: 20 },
    { id: 'cevap20', icon: '🎯', label: '20 soru cevapla', cur: daily.answers, max: 20, xp: 20 },
    { id: 'kazan1', icon: '🎮', label: '1 oyun kazan', cur: daily.wins, max: 1, xp: 20 },
    { id: 'seri3', icon: '⚡', label: '3 doğru üst üste yap', cur: daily.bestCombo, max: 3, xp: 20 },
  ];
  const CHESTS = [
    { id: 'bronz', name: 'Bronz Sandık', emoji: '🥉', need: 2, xp: 25, color: '#CD7F32' },
    { id: 'gumus', name: 'Gümüş Sandık', emoji: '🥈', need: 5, xp: 75, color: '#C0C0C0' },
    { id: 'altin', name: 'Altın Sandık', emoji: '🥇', need: 10, xp: 200, color: '#FFD369' },
  ];
  const cat = totals.byCat || {};
  const ACHIEVEMENTS = [
    { icon: '📖', name: "Kur'an Ustası", desc: "Kur'an kategorisinde 100 doğru", cur: cat['Kuran'] || 0, max: 100 },
    { icon: '📜', name: 'Hadis Âlimi', desc: 'Hadis kategorisinde 50 doğru', cur: cat['Hadis'] || 0, max: 50 },
    { icon: '🕌', name: 'Siyer Uzmanı', desc: 'Siyer & Peygamberler 50 doğru', cur: (cat['Siyer'] || 0) + (cat['Peygamberler'] || 0), max: 50 },
    { icon: '🔥', name: '30 Gün Seri', desc: '30 gün üst üste oyna', cur: stats.current_streak || 0, max: 30 },
    { icon: '⚡', name: 'Bilgi Deposu', desc: 'Toplam 500 doğru cevap', cur: totals.correct, max: 500 },
  ];

  const todayIdx = (new Date().getDay() + 6) % 7;
  const streak = stats.current_streak || 0;

  const S = { card: { background: theme.cardBg, border: `1px solid ${theme.cardBorder}` } };

  // ═══ OYUN İÇİ GÖRÜNÜM ═══
  if (activeGame) {
    return (
      <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
          <AnimatePresence>
            {floats.map(f => (
              <motion.div key={f.id} initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -30, scale: 1 }} exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 1.2 }} className="px-4 py-1.5 rounded-full font-black text-sm shadow-lg whitespace-nowrap"
                style={{ background: f.bonus ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : theme.gold, color: f.bonus ? '#fff' : theme.bg }}>
                +{f.amount} XP {f.bonus ? '🔥 2x' : '⚡'}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="px-5 pt-6 pb-4 flex items-center gap-2">
          <button onClick={() => setActive(null)} className="p-2 -ml-2 rounded-xl active:scale-90" aria-label="Geri">
            <ArrowLeft size={20} style={{ color: theme.gold }} />
          </button>
          <h1 className="text-xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{activeGame.title}</h1>
          {dailyGameId === activeGame.id && (
            <span className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: '#F59E0B22', color: '#F59E0B', border: '1px solid #F59E0B55' }}>🔥 2x XP</span>
          )}
        </div>
        <activeGame.Comp theme={theme} onXP={handleXP} onEvent={handleEvent} />
      </div>
    );
  }

  // ═══ OYUN MERKEZİ (HUB) ═══
  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      {/* Uçan XP */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
        <AnimatePresence>
          {floats.map(f => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -30, scale: 1 }} exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 1.2 }} className="px-4 py-1.5 rounded-full font-black text-sm shadow-lg whitespace-nowrap"
              style={{ background: f.bonus ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : theme.gold, color: f.bonus ? '#fff' : theme.bg }}>
              +{f.amount} XP {f.bonus ? '🔥 2x' : '⚡'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ─── BAŞLIK + ÇİPLER ─── */}
      <div className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Oyun Merkezi</h1>
        <p className="text-xs mt-0.5 mb-3" style={{ color: theme.textSecondary }}>Bilgiyle yarış, ilimle yüksel!</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { icon: <Flame size={13} style={{ color: '#EF4444' }} />, val: streak, label: 'Günlük Seri' },
            { icon: <Star size={13} style={{ color: theme.gold }} />, val: totalXP.toLocaleString('tr-TR'), label: 'XP Puanı' },
            { icon: <Gem size={13} style={{ color: '#10B981' }} />, val: totals.correct, label: 'İlmi' },
          ].map((c, i) => (
            <div key={i} className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl" style={S.card}>
              {c.icon}
              <div>
                <p className="text-sm font-black leading-none tabular-nums" style={{ color: theme.textPrimary }}>{c.val}</p>
                <p className="text-[8px] uppercase tracking-wide mt-0.5" style={{ color: theme.textSecondary }}>{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── HERO: profil + cami sahnesi ─── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="mx-5 mb-3 rounded-3xl relative overflow-hidden" style={{ border: `1px solid ${theme.gold}30`, minHeight: 150 }}>
        <MosqueScene theme={theme} />
        <div className="relative z-10 p-5">
          <div className="flex items-center gap-4">
            {/* Avatar + seviye halkası */}
            <div className="relative shrink-0">
              <svg width="74" height="74" viewBox="0 0 74 74" className="-rotate-90">
                <circle cx="37" cy="37" r="32" fill="none" stroke="#ffffff18" strokeWidth="4.5" />
                <motion.circle cx="37" cy="37" r="32" fill="none" stroke="#ffd369" strokeWidth="4.5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 32} initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - pct / 100) }} transition={{ duration: 1 }} />
              </svg>
              <div className="absolute inset-[9px] rounded-full flex items-center justify-center text-2xl" style={{ background: '#0a2a1a', border: '1px solid #ffd36940' }}>
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: '#ffd369', color: '#04150d' }}>{stats.level || lvl}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#ffd369' }}>{levelTitle}</p>
              <p className="text-xl font-black truncate" style={{ fontFamily: 'Playfair Display, serif', color: '#f7e6ae' }}>{username}</p>
              <div className="h-2 rounded-full overflow-hidden mt-2" style={{ background: '#ffffff15' }}>
                <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  style={{ background: 'linear-gradient(90deg, #ffd369, #d4af37)' }} />
              </div>
              <p className="text-[10px] mt-1" style={{ color: '#A8B5A0' }}>
                {totalXP.toLocaleString('tr-TR')} / {next.toLocaleString('tr-TR')} XP · Sonraki seviye: <span style={{ color: '#ffd369' }}>{Math.max(0, next - totalXP)} XP kaldı</span>
              </p>
            </div>
          </div>
          {/* İstatistik şeridi */}
          <div className="grid grid-cols-4 gap-1.5 mt-4">
            {[
              { icon: '🔥', val: streak, label: 'Günlük Seri' },
              { icon: '🏆', val: (stats.badges || []).length, label: 'Rozet' },
              { icon: '🎮', val: totals.wins, label: 'Oyun Kazanımı' },
              { icon: '✅', val: totals.correct.toLocaleString('tr-TR'), label: 'Doğru Cevap' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl px-1 py-2 text-center" style={{ background: '#ffffff0a', border: '1px solid #ffd36920' }}>
                <p className="text-sm font-black tabular-nums" style={{ color: '#f7e6ae' }}>{s.icon} {s.val}</p>
                <p className="text-[8px] mt-0.5" style={{ color: '#A8B5A0' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── LİG PANELİ ─── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="mx-5 mb-5 rounded-2xl p-4 flex items-center gap-4" style={S.card}>
        <LeagueEmblem color={league.cur.color} />
        <div className="flex-1 min-w-0">
          <p className="text-base font-black" style={{ color: league.cur.color }}>{league.cur.name}</p>
          <div className="h-2 rounded-full overflow-hidden mt-1.5" style={{ background: `${theme.textSecondary}20` }}>
            <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${league.pct}%` }} style={{ background: league.cur.color }} />
          </div>
          <p className="text-[10px] mt-1" style={{ color: theme.textSecondary }}>
            {league.next
              ? <>{totalXP.toLocaleString('tr-TR')} / {league.next.min.toLocaleString('tr-TR')} XP · Sonraki Lig: <span style={{ color: league.next.color }}>{league.next.name.replace(' Lig', '')}</span> 🛡️</>
              : 'En yüksek ligdesin! 👑'}
          </p>
        </div>
      </motion.div>

      {/* ─── OYUN MODLARI ─── */}
      <div className="px-5 mb-6">
        <h2 className="text-base font-black mb-3" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Oyun Modları</h2>
        <div className="grid grid-cols-2 gap-3">
          {GAME_MODES.map((g, i) => {
            const meta = gameMeta[g.id];
            const isDaily = dailyGameId === g.id;
            return (
              <motion.div key={g.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.04 }}
                className="rounded-2xl p-4 flex flex-col relative overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${theme.surface}, ${g.color}0c)`,
                  border: `1.5px solid ${isDaily ? '#F59E0B66' : `${g.color}30`}`,
                  opacity: g.locked ? 0.65 : 1,
                }}>
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle, ${g.color}, transparent)` }} />
                <div className="flex items-start justify-between">
                  <span className="text-3xl mb-2 block" style={{ filter: `drop-shadow(0 2px 8px ${g.color}60)` }}>{g.emoji}</span>
                  {isDaily && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full" style={{ background: '#F59E0B22', color: '#F59E0B' }}>🔥 2x</span>}
                  {g.locked && <Lock size={14} style={{ color: theme.textSecondary }} />}
                </div>
                <p className="text-sm font-black leading-tight" style={{ color: theme.textPrimary }}>{g.title}</p>
                <p className="text-[10px] mt-1 flex-1 leading-relaxed" style={{ color: theme.textSecondary }}>{g.desc}</p>
                <div className="flex items-center gap-1 mt-2 mb-2.5">
                  <Users size={10} style={{ color: g.color }} />
                  <span className="text-[9px] font-bold" style={{ color: theme.textSecondary }}>
                    {g.locked ? 'Yakında' : meta ? `${meta.plays} oyun · ${meta.xp} XP` : 'Hiç oynanmadı'}
                  </span>
                </div>
                <button onClick={() => openGame(g)} disabled={g.locked}
                  className="w-full py-2 rounded-xl text-xs font-black active:scale-95 transition-all disabled:opacity-50"
                  style={{ background: g.locked ? `${theme.textSecondary}15` : `${g.color}1c`, border: `1px solid ${g.color}50`, color: g.locked ? theme.textSecondary : g.color }}>
                  {g.locked ? 'Yakında' : g.cta || 'Oyna'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── GÜNLÜK GÖREVLER ─── */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl p-4" style={S.card}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black" style={{ color: theme.textPrimary }}>Günlük Görevler</h2>
            <span className="text-[10px] font-bold tabular-nums px-2 py-1 rounded-full" style={{ background: `${theme.gold}12`, color: theme.gold }}>⏳ {midnight}</span>
          </div>
          <div className="space-y-2.5">
            {TASKS.map(t => {
              const done = t.cur >= t.max;
              const claimed = daily.claimedTasks.includes(t.id);
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <span className="text-base w-6 text-center">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold" style={{ color: theme.textPrimary }}>{t.label}</p>
                      <span className="text-[10px] font-bold tabular-nums" style={{ color: done ? '#10B981' : theme.textSecondary }}>{Math.min(t.cur, t.max)} / {t.max}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}18` }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (t.cur / t.max) * 100)}%`, background: done ? '#10B981' : theme.gold }} />
                    </div>
                  </div>
                  {done && (claimed
                    ? <CheckCircle2 size={18} style={{ color: '#10B981' }} />
                    : <button onClick={() => claimReward('task', t.id, t.xp)} className="text-[10px] font-black px-2.5 py-1.5 rounded-lg active:scale-95" style={{ background: '#10B981', color: '#fff' }}>+{t.xp} Al</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── SANDIKLAR + ETKİNLİKLER ─── */}
      <div className="px-5 mb-5 grid grid-cols-1 gap-4">
        <div className="rounded-2xl p-4" style={S.card}>
          <h2 className="text-sm font-black mb-3" style={{ color: theme.textPrimary }}>Sandıklar</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {CHESTS.map(c => {
              const ready = daily.wins >= c.need;
              const claimed = daily.claimedChests.includes(c.id);
              return (
                <div key={c.id} className="rounded-xl p-3 text-center" style={{ background: `${c.color}0e`, border: `1px solid ${c.color}35` }}>
                  <motion.span animate={ready && !claimed ? { rotate: [-4, 4, -4], scale: [1, 1.08, 1] } : {}} transition={{ duration: 0.9, repeat: Infinity }}
                    className="text-2xl block mb-1">{claimed ? '📭' : '🎁'}</motion.span>
                  <p className="text-[10px] font-black" style={{ color: c.color }}>{c.name}</p>
                  <p className="text-[9px] mb-2 tabular-nums" style={{ color: theme.textSecondary }}>{Math.min(daily.wins, c.need)} / {c.need} Galibiyet</p>
                  {claimed
                    ? <span className="text-[9px] font-bold" style={{ color: '#10B981' }}>Alındı ✓</span>
                    : ready
                      ? <button onClick={() => claimReward('chest', c.id, c.xp)} className="text-[9px] font-black px-2.5 py-1 rounded-lg active:scale-95" style={{ background: c.color, color: '#04150d' }}>+{c.xp} Aç</button>
                      : <span className="text-[9px] font-bold flex items-center justify-center gap-0.5" style={{ color: theme.textSecondary }}><Gift size={9} /> +{c.xp} XP</span>}
                </div>
              );
            })}
          </div>
          {daily.wins < 10 && (
            <p className="text-[10px] text-center mt-3" style={{ color: theme.textSecondary }}>
              Sonraki sandık için <span style={{ color: theme.gold }}>{CHESTS.find(c => daily.wins < c.need)?.need - daily.wins} oyun kazan</span>!
            </p>
          )}
        </div>

        {/* Etkinlikler */}
        <div className="rounded-2xl p-4" style={S.card}>
          <h2 className="text-sm font-black mb-3" style={{ color: theme.textPrimary }}>Etkinlikler</h2>
          <div className="space-y-2">
            {[
              { icon: '⭐', name: 'Cuma Özel Meydan Okuması', when: 'Her Cuma', active: new Date().getDay() === 5 },
              { icon: '🎉', name: 'Haftasonu Çılgınlığı', when: 'Cmt-Paz', active: [0, 6].includes(new Date().getDay()) },
              { icon: '🌙', name: 'Ramazan Turnuvası', when: 'Ramazan ayında', active: false },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: e.active ? `${theme.gold}10` : `${theme.textSecondary}08`, border: `1px solid ${e.active ? `${theme.gold}35` : 'transparent'}` }}>
                <span className="text-lg">{e.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold" style={{ color: theme.textPrimary }}>{e.name}</p>
                  <p className="text-[9px]" style={{ color: theme.textSecondary }}>{e.when}</p>
                </div>
                {e.active && <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: '#10B98122', color: '#10B981' }}>Bugün!</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── LİDERLİK TABLOSU ─── */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl p-4" style={S.card}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black" style={{ color: theme.textPrimary }}>Liderlik Tablosu</h2>
            <button onClick={() => navigate('/profile')} className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: theme.gold }}>
              Tüm Sıralama <ChevronRight size={11} />
            </button>
          </div>
          {leaderboard.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: theme.textSecondary }}>İlk oyununu oyna, sıralamaya gir! 🏁</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((e, i) => (
                <div key={e.user_id || i} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: i === 0 ? `${theme.gold}0e` : 'transparent' }}>
                  {i === 0 ? <Crown size={16} style={{ color: theme.gold }} /> : i < 3 ? <Medal size={16} style={{ color: i === 1 ? '#C0C0C0' : '#CD7F32' }} /> : <span className="w-4 text-center text-xs font-black" style={{ color: theme.textSecondary }}>{i + 1}</span>}
                  <span className="flex-1 text-xs font-bold truncate" style={{ color: theme.textPrimary }}>{e.username || 'Anonim'}</span>
                  <span className="text-xs font-black tabular-nums" style={{ color: theme.gold }}>{(e.total_points ?? e.points ?? 0).toLocaleString('tr-TR')} XP</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── KATEGORİLER (Soru Havuzu) ─── */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl p-4" style={S.card}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black flex items-center gap-1.5" style={{ color: theme.textPrimary }}><Library size={14} style={{ color: theme.gold }} /> Kategoriler</h2>
            <span className="text-[10px] font-bold" style={{ color: theme.gold }}>{BANK_SIZE.toLocaleString('tr-TR')} Soru</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {BANK_CATEGORIES.map(c => (
              <div key={c.name} className="rounded-xl p-2 text-center" style={{ background: `${theme.gold}08`, border: `1px solid ${theme.cardBorder}` }}>
                <span className="text-lg block">{CAT_ICONS[c.name] || '📚'}</span>
                <p className="text-[9px] font-black mt-0.5 truncate" style={{ color: theme.textPrimary }}>{c.name}</p>
                <p className="text-[8px]" style={{ color: theme.textSecondary }}>{c.count} Soru</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BAŞARILARIM ─── */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl p-4" style={S.card}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black" style={{ color: theme.textPrimary }}>Başarılarım</h2>
            <button onClick={() => navigate('/achievements')} className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: theme.gold }}>
              Tüm Rozetler <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-3">
            {ACHIEVEMENTS.map((a, i) => {
              const done = a.cur >= a.max;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: `${theme.gold}12`, border: `1px solid ${theme.gold}25` }}>{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold" style={{ color: theme.textPrimary }}>{a.name}</p>
                      {done ? <CheckCircle2 size={14} style={{ color: '#10B981' }} /> : <span className="text-[9px] tabular-nums" style={{ color: theme.textSecondary }}>{Math.min(a.cur, a.max)} / {a.max}</span>}
                    </div>
                    <p className="text-[9px] mb-1" style={{ color: theme.textSecondary }}>{a.desc}</p>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}18` }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (a.cur / a.max) * 100)}%`, background: done ? '#10B981' : theme.gold }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── GÜNLÜK SERİ ─── */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl p-4" style={S.card}>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                <circle cx="32" cy="32" r="27" fill="none" stroke={`${theme.textSecondary}20`} strokeWidth="5" />
                <circle cx="32" cy="32" r="27" fill="none" stroke="#EF4444" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 27} strokeDashoffset={2 * Math.PI * 27 * (1 - Math.min(1, (streak % 30) / 30))} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-black" style={{ color: theme.textPrimary }}>{streak}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-black" style={{ color: theme.textPrimary }}>Günlük Seri</p>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>Serini koru, ödülleri kap!</p>
            </div>
          </div>
          {/* Hafta günleri */}
          <div className="flex justify-between mb-4">
            {WEEK_DAYS.map((d, i) => {
              const filled = i <= todayIdx && (todayIdx - i) < streak;
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <span className="text-[8px] font-bold" style={{ color: theme.textSecondary }}>{d}</span>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]"
                    style={{ background: filled ? '#10B981' : `${theme.textSecondary}15`, color: filled ? '#fff' : theme.textSecondary }}>
                    {filled ? '✓' : ''}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Seri ödülleri */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { emoji: '💚', days: 10, reward: '50 XP' },
              { emoji: '⚔️', days: 20, reward: '100 XP' },
              { emoji: '👑', days: 30, reward: 'Özel Rozet' },
            ].map((r, i) => (
              <div key={i} className="rounded-xl p-2.5 text-center" style={{ background: streak >= r.days ? '#10B98112' : `${theme.textSecondary}08`, border: `1px solid ${streak >= r.days ? '#10B98140' : theme.cardBorder}` }}>
                <span className="text-lg block">{r.emoji}</span>
                <p className="text-[9px] font-black mt-0.5" style={{ color: theme.textPrimary }}>{r.days} Gün</p>
                <p className="text-[8px]" style={{ color: streak >= r.days ? '#10B981' : theme.textSecondary }}>{r.reward}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── HIZLI ERİŞİM ─── */}
      <div className="px-5 flex gap-2">
        {[
          { icon: <Library size={14} />, label: 'Soru Havuzu', to: '/quiz' },
          { icon: <Award size={14} />, label: 'Rozetler', to: '/achievements' },
          { icon: <Swords size={14} />, label: 'Düello', to: '/multiplayer' },
          { icon: <Trophy size={14} />, label: 'Liderlik', to: '/profile' },
        ].map((l, i) => (
          <button key={i} onClick={() => navigate(l.to)}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl active:scale-95 transition-all"
            style={S.card}>
            <span style={{ color: theme.gold }}>{l.icon}</span>
            <span className="text-[9px] font-bold" style={{ color: theme.textSecondary }}>{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
