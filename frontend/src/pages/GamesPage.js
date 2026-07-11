import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Flame, Star, Gem, Trophy, CheckCircle2, Gift, Crown, Medal, ChevronRight, Library, Award, Swords } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { awardXP, fetchStats, subscribeStats, getCachedStats, getUsername } from '../services/gamification';
import sfx, { sfxEnabled, setSfxEnabled } from '../services/sfx';
import ambient from '../services/ambient';
import { BANK_CATEGORIES, QUESTION_BANK } from '../data/questionBank';
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
import VerseComplete from './games/VerseComplete';
import StoryMode from './games/StoryMode';
import AdventureMode from './games/AdventureMode';
import GameLobby from './games/GameLobby';
import Confetti from './games/Confetti';
import { ADVENTURE } from '../data/adventureData';

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

// ─── Oyun modları (premium tek satırlık metinler) ───
const GAME_MODES = [
  { id: 'adventure', title: 'İslam Tarihi Macerası', desc: "Mekke'den Veda'ya tarihte yolculuk et.", emoji: '🌍', color: '#F59E0B', type: 'game_quiz', Comp: AdventureMode, cta: 'Yolculuğa Çık', xpHint: '80+', badge: 'Siyer Kâşifi', featured: true },
  { id: 'story', title: 'Hikâye Modu', desc: 'Kıssaların içinde yolculuğa çık.', emoji: '📜', color: '#D946EF', type: 'game_quiz', Comp: StoryMode, cta: 'Keşfet', xpHint: '55+', badge: 'Kıssa Alimi' },
  { id: 'rapid', title: 'Hızlı Bilgi (Blitz)', desc: '30 saniyede refleksini test et.', emoji: '⚡', color: '#EAB308', type: 'game_quiz', Comp: RapidQuiz, xpHint: '150+', badge: 'Blitz Ustası' },
  { id: 'survival', title: 'Sonsuz Mod', desc: 'Serini koru, sınırlarını zorla.', emoji: '♾️', color: '#3B82F6', type: 'game_quiz', Comp: SurvivalGame },
  { id: 'classic', title: 'Klasik Test', desc: 'Dilediğin konuda kendini dene.', emoji: '📖', color: '#10B981', type: 'game_quiz', Comp: ClassicTest },
  { id: 'duel', title: 'İlim Arenası', desc: 'Gerçek oyuncularla yarış.', emoji: '⚔️', color: '#F97316', route: '/multiplayer', cta: 'Düello Başlat' },
  { id: 'ai', title: 'AI Rakip', desc: 'Sana meydan okuyan rakiple mücadele et.', emoji: '🤖', color: '#8B5CF6', type: 'game_quiz', Comp: AIDuel },
  { id: 'boss', title: 'Patron Savaşı', desc: 'Bilginle cehaleti yen.', emoji: '👹', color: '#7C3AED', type: 'game_quiz', Comp: BossBattle, cta: 'Savaşa Katıl' },
  { id: 'memory', title: 'Hafıza Oyunu', desc: 'Eşleştir, hafızanı kanıtla.', emoji: '🧠', color: '#EC4899', type: 'game_match', Comp: MatchGame },
  { id: 'order', title: 'Doğru Sırala', desc: 'Olayları yerli yerine koy.', emoji: '🔢', color: '#06B6D4', type: 'game_match', Comp: OrderGame },
  { id: 'word', title: 'Kelime Bulmaca', desc: 'Kelimeyi bul, manayı keşfet.', emoji: '🔤', color: '#6366F1', type: 'game_word', Comp: WordGame },
  { id: 'wheel', title: 'Çarkıfelek', desc: 'Çevir — her tur farklı deneyim.', emoji: '🎡', color: '#14B8A6', type: 'game_wheel', Comp: WheelGame },
  { id: 'voice', title: 'Sesli Tahmin', desc: 'Tilaveti dinle, doğru sureyi bul.', emoji: '🎵', color: '#22C55E', type: 'game_quiz', Comp: VoiceGuess },
  { id: 'verse', title: 'Ayet Tamamlama', desc: 'Mealin devamını bul, sureyi tanı.', emoji: '🧩', color: '#0EA5E9', type: 'game_quiz', Comp: VerseComplete, badge: 'Meal Yolcusu' },
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

// Haftalık kişisel hedef (500 XP → +100 bonus)
const WEEK_GOAL = 500;
const WEEK_BONUS = 100;
function weekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}_w${week}`;
}
const loadWeek = () => load(`gc_week_${weekKey()}`, { xp: 0, claimed: false });

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

// ─── 📌 Günün Sorusu — herkese aynı, günde bir kez, kendi serisi var ───
function pickDailyQuestion(dateKey) {
  let h = 0;
  for (const ch of dateKey) h = (h * 31 + ch.charCodeAt(0)) % 1000003;
  let i = h % QUESTION_BANK.length;
  // tf soruları atla; şıklı (mc) soru bul
  for (let tries = 0; tries < QUESTION_BANK.length; tries++) {
    if (QUESTION_BANK[i].type === 'mc') return QUESTION_BANK[i];
    i = (i + 1) % QUESTION_BANK.length;
  }
  return QUESTION_BANK[0];
}

function DailyQuestion({ theme, onXP, onEvent }) {
  const dateKey = todayKey();
  const q = useMemo(() => pickDailyQuestion(dateKey), [dateKey]);
  const [answered, setAnswered] = useState(() => load(`dq_${dateKey}`, null));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('dq_streak') || 0));

  const answer = (choice) => {
    if (answered) return;
    const ok = choice === q.correct_index;
    const rec = { choice, ok };
    setAnswered(rec); save(`dq_${dateKey}`, rec);
    onEvent('answer', { correct: ok, category: q.category });
    // Günün sorusu serisi (her gün cevaplamak seriyi sürdürür)
    try {
      const last = localStorage.getItem('dq_last');
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const ns = last === yesterday ? Number(localStorage.getItem('dq_streak') || 0) + 1 : 1;
      localStorage.setItem('dq_streak', String(ns));
      localStorage.setItem('dq_last', dateKey);
      setStreak(ns);
    } catch { /* ignore */ }
    if (ok) onXP(30, 'game_quiz', 'Günün Sorusu');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
      className="mx-5 mb-3 rounded-2xl p-4 relative overflow-hidden"
      style={{ background: `linear-gradient(150deg, #10B98112, ${theme.surface})`, border: '1.5px solid #10B98140' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#10B981' }}>
          📌 Günün Sorusu · +30 XP
        </p>
        {streak > 0 && <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: '#F59E0B18', color: '#F59E0B' }}>🔁 {streak} gün</span>}
      </div>
      <p className="text-sm font-bold mb-3" style={{ color: theme.textPrimary }}>{q.question}</p>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt, i) => {
          const chosen = answered?.choice === i;
          const isRight = answered && i === q.correct_index;
          return (
            <button key={i} onClick={() => answer(i)} disabled={!!answered}
              className="p-2.5 rounded-xl text-[11px] font-semibold text-left transition-all active:scale-95"
              style={{
                background: isRight ? '#10B98122' : chosen ? '#EF444422' : `${theme.textSecondary}0d`,
                border: `1px solid ${isRight ? '#10B981' : chosen ? '#EF4444' : theme.cardBorder}`,
                color: theme.textPrimary,
              }}>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className="text-[10px] mt-2.5 leading-relaxed" style={{ color: answered.ok ? '#10B981' : theme.textSecondary }}>
          {answered.ok ? '✅ Doğru! Yarın yeni soru seni bekliyor.' : `❌ Doğrusu: ${q.options[q.correct_index]}.`} {q.explanation}
        </p>
      )}
    </motion.div>
  );
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
  const [stage, setStage] = useState('hub'); // hub | lobby | play
  const sessionXP = useRef(0);
  const [stats, setStats] = useState(() => getCachedStats() || { total_points: 0, level: 1, current_streak: 0 });
  const [daily, setDaily] = useState(loadDaily);
  const [totals, setTotals] = useState(loadTotals);
  const [week, setWeek] = useState(loadWeek);
  const [levelUp, setLevelUp] = useState(null); // yeni seviye numarası
  const [sfxOn, setSfxOn] = useState(sfxEnabled);
  const [amb, setAmb] = useState(() => ambient.getState());
  const prevLvl = useRef(null);
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

  // Ekran değişince en üste kaydır — oyuna girince soru/menü hep görünür olsun
  useEffect(() => {
    window.scrollTo(0, 0);
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0 });
  }, [stage, active]);

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

  // Atmosfer durumu aboneliği
  useEffect(() => ambient.subscribe(setAmb), []);

  // Seviye atlama kutlaması — XP artınca seviye değiştiyse tam ekran kutla
  const totalXPNow = stats.total_points || 0;
  useEffect(() => {
    const { lvl: cur } = levelInfo(totalXPNow);
    if (prevLvl.current === null) { prevLvl.current = cur; return; }
    if (cur > prevLvl.current) {
      setLevelUp(cur);
      sfx.levelUp();
      const t = setTimeout(() => setLevelUp(null), 3000);
      prevLvl.current = cur;
      return () => clearTimeout(t);
    }
    prevLvl.current = cur;
  }, [totalXPNow]);

  // Oyunlardan gelen olaylar → görev/sandık/başarı ilerlemesi + ses
  const handleEvent = useCallback((type, data = {}) => {
    if (type === 'answer') (data.correct ? sfx.correct() : sfx.wrong());
    if (type === 'win') sfx.victory();
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

  // Lobi akışı: karta bas → lobi → "Oyuna Başla" → oyun
  const lobbyFrom = useRef('hub'); // lobiden geri dönülecek ekran
  const openGame = useCallback((g) => {
    if (g.locked) return;
    if (g.route) { navigate(g.route); return; }
    lobbyFrom.current = stage === 'modes' ? 'modes' : 'hub';
    setActive(g.id);
    setStage('lobby');
    try { localStorage.setItem('gc_last_mode', g.id); } catch { /* ignore */ }
  }, [navigate, stage]);

  const startPlay = useCallback((gid) => {
    sessionXP.current = 0;
    setStage('play');
    setGameMeta(prev => {
      const m = prev[gid] || {};
      const meta = { ...prev, [gid]: { ...m, plays: (m.plays || 0) + 1, xp: m.xp || 0 } };
      save('game_meta', meta);
      return meta;
    });
  }, []);

  // Oyundan çıkarken oturum skorunu (son/en iyi) kaydet
  const endPlay = useCallback((gid) => {
    const score = sessionXP.current;
    setGameMeta(prev => {
      const m = prev[gid] || {};
      const meta = { ...prev, [gid]: { ...m, last: score, best: Math.max(m.best || 0, score) } };
      save('game_meta', meta);
      return meta;
    });
    setStage('lobby');
  }, []);

  const handleXP = useCallback(async (amount, type, label) => {
    const isDaily = active && dailyGameId === active;
    const finalAmount = isDaily ? amount * 2 : amount;
    sessionXP.current += finalAmount;
    pushFloat(finalAmount, isDaily);
    setStats(prev => ({ ...prev, total_points: (prev.total_points || 0) + finalAmount }));
    setDaily(prev => { const d = { ...prev, xp: prev.xp + finalAmount }; save(`gc_daily_${todayKey()}`, d); return d; });
    setWeek(prev => { const w = { ...prev, xp: prev.xp + finalAmount }; save(`gc_week_${weekKey()}`, w); return w; });
    if (active) {
      setGameMeta(prev => {
        const m = prev[active] || {};
        const meta = { ...prev, [active]: { ...m, plays: m.plays || 1, xp: (m.xp || 0) + finalAmount } };
        save('game_meta', meta);
        return meta;
      });
    }
    await awardXP(user, type, { points: finalAmount, details: isDaily ? `${label} (Günün Oyunu 2x)` : label });
  }, [user, active, dailyGameId, pushFloat]);

  // Haftalık hedef ödülü
  const claimWeek = useCallback(async () => {
    if (week.claimed || week.xp < WEEK_GOAL) return;
    setWeek(prev => { const w = { ...prev, claimed: true }; save(`gc_week_${weekKey()}`, w); return w; });
    sfx.claim();
    pushFloat(WEEK_BONUS, false);
    setStats(prev => ({ ...prev, total_points: (prev.total_points || 0) + WEEK_BONUS }));
    await awardXP(user, 'game_quiz', { points: WEEK_BONUS, details: 'Haftalık Hedef Ödülü' });
  }, [week, user, pushFloat]);

  // Görev / sandık ödül alma
  const claimReward = useCallback(async (kind, id, xpReward) => {
    sfx.claim();
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

  // ─── Seviye atlama kutlaması (her iki görünümde de gösterilir) ───
  const levelUpOverlay = (
    <AnimatePresence>
      {levelUp && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-6 pointer-events-none"
          style={{ background: 'rgba(4, 12, 8, 0.82)', backdropFilter: 'blur(5px)' }}>
          <motion.div initial={{ scale: 0.6, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="relative w-full max-w-sm rounded-3xl p-8 text-center overflow-hidden"
            style={{ background: `linear-gradient(170deg, ${theme.gold}20, ${theme.surface})`, border: `2px solid ${theme.gold}70`, boxShadow: `0 0 60px ${theme.gold}40` }}>
            <Confetti count={30} />
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15, type: 'spring', bounce: 0.6 }}
              className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl font-black"
              style={{ background: `${theme.gold}22`, border: `3px solid ${theme.gold}`, color: theme.gold }}>
              {levelUp}
            </motion.div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-1" style={{ color: theme.gold }}>Seviye Atladın!</p>
            <h2 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
              {LEVEL_TITLES[Math.min(levelUp - 1, LEVEL_TITLES.length - 1)]}
            </h2>
            <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>İlim yolculuğun yükseliyor 🌙</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ═══ LOBİ + OYUN İÇİ GÖRÜNÜM ═══
  if (activeGame && stage !== 'hub') {
    const inPlay = stage === 'play';
    return (
      <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
        {levelUpOverlay}
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
          <button onClick={() => (inPlay ? endPlay(active) : (setActive(null), setStage(lobbyFrom.current)))}
            className="p-2 -ml-2 rounded-xl active:scale-90" aria-label="Geri">
            <ArrowLeft size={20} style={{ color: theme.gold }} />
          </button>
          <h1 className="text-xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{activeGame.title}</h1>
          {dailyGameId === activeGame.id && (
            <span className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: '#F59E0B22', color: '#F59E0B', border: '1px solid #F59E0B55' }}>🔥 2x XP</span>
          )}
        </div>
        {inPlay
          ? <activeGame.Comp theme={theme} onXP={handleXP} onEvent={handleEvent} />
          : <GameLobby game={activeGame} meta={gameMeta[active]} leaderboard={leaderboard} theme={theme} onStart={() => startPlay(active)} />}
      </div>
    );
  }

  // ═══ OYUN MODLARI EKRANI (şık liste) ═══
  if (stage === 'modes') {
    const featured = GAME_MODES.find(g => g.featured) || GAME_MODES[0];
    const rest = GAME_MODES.filter(g => g.id !== featured.id);
    return (
      <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
        {levelUpOverlay}
        <div className="px-5 pt-6 pb-4 flex items-center gap-2">
          <button onClick={() => setStage('hub')} className="p-2 -ml-2 rounded-xl active:scale-90" aria-label="Geri">
            <ArrowLeft size={20} style={{ color: theme.gold }} />
          </button>
          <div>
            <h1 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Oyun Modları</h1>
            <p className="text-[10px] mt-0.5" style={{ color: theme.textSecondary }}>{GAME_MODES.length} mod · her biri farklı bir deneyim</p>
          </div>
        </div>

        {/* Öne çıkan: Macera (tam genişlik, sinematik) */}
        <motion.button initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => openGame(featured)} whileTap={{ scale: 0.98 }}
          className="mx-5 mb-4 w-[calc(100%-2.5rem)] rounded-3xl p-5 text-left relative overflow-hidden"
          style={{ background: `linear-gradient(150deg, ${featured.color}1e, ${theme.surface})`, border: `1.5px solid ${featured.color}55`, boxShadow: `0 8px 34px ${featured.color}20` }}>
          <div className="absolute -top-12 -right-8 w-44 h-44 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${featured.color}35, transparent 65%)` }} />
          <div className="flex items-center gap-4 relative">
            <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2.4, repeat: Infinity }}
              className="text-5xl" style={{ filter: `drop-shadow(0 6px 16px ${featured.color}80)` }}>{featured.emoji}</motion.span>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: featured.color }}>Öne Çıkan</p>
              <p className="text-lg font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{featured.title}</p>
              <p className="text-[11px]" style={{ color: theme.textSecondary }}>{featured.desc}</p>
            </div>
            <span className="text-[11px] font-black px-3.5 py-2 rounded-xl shrink-0" style={{ background: featured.color, color: '#fff' }}>{featured.cta || 'Oyna'}</span>
          </div>
        </motion.button>

        {/* Diğer modlar: 2 sütun zarif grid */}
        <div className="px-5 grid grid-cols-2 gap-3">
          {rest.map((g, i) => {
            const meta = gameMeta[g.id];
            const isDaily = dailyGameId === g.id;
            return (
              <motion.button key={g.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.035 }}
                onClick={() => openGame(g)} whileTap={{ scale: 0.97 }}
                className="rounded-2xl p-4 flex flex-col text-left relative overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${theme.surface}, ${g.color}0c)`,
                  border: `1.5px solid ${isDaily ? '#F59E0B66' : `${g.color}30`}`,
                }}>
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle, ${g.color}, transparent)` }} />
                <div className="flex items-start justify-between">
                  <span className="text-3xl mb-2 block" style={{ filter: `drop-shadow(0 2px 8px ${g.color}60)` }}>{g.emoji}</span>
                  {isDaily && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full" style={{ background: '#F59E0B22', color: '#F59E0B' }}>🔥 2x</span>}
                </div>
                <p className="text-sm font-black leading-tight" style={{ color: theme.textPrimary }}>{g.title}</p>
                <p className="text-[10px] mt-1 flex-1 leading-relaxed" style={{ color: theme.textSecondary }}>{g.desc}</p>
                <p className="text-[9px] font-bold mt-2" style={{ color: g.color }}>
                  {meta ? `${meta.plays} oyun · ${meta.xp} XP` : 'Hiç oynanmadı'}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══ OYUN MERKEZİ (HUB) ═══
  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      {levelUpOverlay}
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

      {/* ─── GÜNÜN SORUSU ─── */}
      <DailyQuestion theme={theme} onXP={handleXP} onEvent={handleEvent} />

      {/* ─── ATMOSFER SESİ + EFEKTLER ─── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
        className="mx-5 mb-3 rounded-2xl px-4 py-3 flex items-center gap-3" style={S.card}>
        <button onClick={() => ambient.toggle()}
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          style={{ background: amb.playing ? '#10B98122' : `${theme.gold}12`, border: `1.5px solid ${amb.playing ? '#10B981' : `${theme.gold}35`}` }}
          aria-label={amb.playing ? 'Atmosferi durdur' : 'Atmosferi başlat'}>
          <span className="text-lg">{amb.playing ? '⏸️' : '🎵'}</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-black shrink-0" style={{ color: theme.textPrimary }}>
              Atmosfer {amb.playing && <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ color: '#10B981' }}>·</motion.span>}
            </p>
            <div className="flex gap-1">
              {amb.tracks.map(t => (
                <button key={t.id} onClick={() => ambient.setTrack(t.id)}
                  className="text-[8px] font-black px-2 py-0.5 rounded-full transition-all"
                  style={{
                    background: amb.track === t.id ? `${theme.gold}20` : 'transparent',
                    border: `1px solid ${amb.track === t.id ? `${theme.gold}50` : theme.cardBorder}`,
                    color: amb.track === t.id ? theme.gold : theme.textSecondary,
                  }}>
                  {t.id === 'ney' ? '🎋 Ney' : t.id === 'serenity' ? '✨ Sükûnet' : t.name}
                </button>
              ))}
            </div>
          </div>
          <input type="range" min="0" max="1" step="0.05" value={amb.volume}
            onChange={e => ambient.setVolume(Number(e.target.value))}
            className="w-full h-1 mt-1.5 accent-current cursor-pointer"
            style={{ accentColor: theme.gold }} aria-label="Ses seviyesi" />
        </div>
        <button onClick={() => { const v = !sfxOn; setSfxOn(v); setSfxEnabled(v); if (v) sfx.correct(); }}
          className="shrink-0 flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl active:scale-95 transition-transform"
          style={{ background: sfxOn ? `${theme.gold}12` : `${theme.textSecondary}10`, border: `1px solid ${sfxOn ? `${theme.gold}35` : theme.cardBorder}` }}>
          <span className="text-sm">{sfxOn ? '🔔' : '🔕'}</span>
          <span className="text-[8px] font-bold" style={{ color: sfxOn ? theme.gold : theme.textSecondary }}>Efektler</span>
        </button>
      </motion.div>

      {/* ─── DEVAM ET (son oynanan mod) ─── */}
      {(() => {
        let lastId = null;
        try { lastId = localStorage.getItem('gc_last_mode'); } catch { /* ignore */ }
        const lastGame = GAME_MODES.find(g => g.id === lastId && g.Comp);
        if (!lastGame) return null;
        return (
          <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
            onClick={() => openGame(lastGame)} whileTap={{ scale: 0.98 }}
            className="mx-5 mb-3 w-[calc(100%-2.5rem)] rounded-2xl p-3.5 flex items-center gap-3 text-left"
            style={{ background: `linear-gradient(135deg, ${lastGame.color}12, ${theme.surface})`, border: `1.5px solid ${lastGame.color}40` }}>
            <span className="text-2xl">{lastGame.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{lastGame.title}</p>
              <p className="text-[9px]" style={{ color: theme.textSecondary }}>Son oynadığın mod</p>
            </div>
            <span className="text-[11px] font-black px-3.5 py-2 rounded-xl" style={{ background: lastGame.color, color: '#fff' }}>Devam Et</span>
          </motion.button>
        );
      })()}

      {/* ─── LİG PANELİ + SEZON ─── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="mx-5 mb-5 rounded-2xl p-4 flex items-center gap-4" style={S.card}>
        <LeagueEmblem color={league.cur.color} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-base font-black" style={{ color: league.cur.color }}>{league.cur.name}</p>
            {(() => {
              const now = new Date();
              const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
              const daysLeft = Math.max(1, Math.ceil((monthEnd - now) / 86400000));
              const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
              return (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: `${theme.gold}12`, color: theme.gold }}>
                  Sezon: {months[now.getMonth()]} · {daysLeft} gün
                </span>
              );
            })()}
          </div>
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

      {/* ─── OYUN MODLARI VİTRİNİ (özet görsel → mod listesi ekranı) ─── */}
      <motion.button initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        onClick={() => setStage('modes')} whileTap={{ scale: 0.98 }}
        className="mx-5 mb-6 w-[calc(100%-2.5rem)] rounded-3xl p-5 text-left relative overflow-hidden"
        style={{
          background: `linear-gradient(150deg, ${theme.gold}16, ${theme.surface} 55%, #10B98110)`,
          border: `1.5px solid ${theme.gold}45`,
          boxShadow: `0 10px 40px ${theme.gold}18`,
        }}>
        {/* Parıltı süpürmesi */}
        <motion.div className="absolute inset-0 pointer-events-none" animate={{ x: ['-100%', '160%'] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(105deg, transparent 42%, ${theme.gold}14 50%, transparent 58%)` }} />
        <div className="flex items-center justify-between relative mb-3.5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: theme.gold }}>Oyun Modları</p>
            <p className="text-lg font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
              {GAME_MODES.length} farklı deneyim
            </p>
            <p className="text-[10px]" style={{ color: theme.textSecondary }}>Blitz'ten Maceraya — hepsi seni bekliyor</p>
          </div>
          <span className="text-[11px] font-black px-4 py-2.5 rounded-xl shrink-0 flex items-center gap-1"
            style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight})`, color: theme.bg }}>
            Modlara Git <ChevronRight size={13} />
          </span>
        </div>
        {/* Emoji mozaiği — modların vitrini */}
        <div className="flex gap-1.5 relative">
          {GAME_MODES.slice(0, 8).map((g, i) => (
            <motion.span key={g.id}
              animate={{ y: [0, i % 2 === 0 ? -3 : 3, 0] }}
              transition={{ duration: 2 + (i % 3) * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: `${g.color}16`, border: `1px solid ${g.color}35`, filter: `drop-shadow(0 2px 6px ${g.color}40)` }}>
              {g.emoji}
            </motion.span>
          ))}
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0"
            style={{ background: `${theme.gold}12`, border: `1px dashed ${theme.gold}45`, color: theme.gold }}>
            +{GAME_MODES.length - 8}
          </span>
        </div>
      </motion.button>

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

      {/* ─── HAFTALIK HEDEF ─── */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl p-4" style={S.card}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-black" style={{ color: theme.textPrimary }}>🎯 Haftalık Hedef</h2>
            {week.claimed
              ? <span className="text-[10px] font-black" style={{ color: '#10B981' }}>Alındı ✓</span>
              : week.xp >= WEEK_GOAL
                ? <button onClick={claimWeek} className="text-[10px] font-black px-3 py-1.5 rounded-lg active:scale-95" style={{ background: '#10B981', color: '#fff' }}>+{WEEK_BONUS} Al</button>
                : <span className="text-[10px] font-bold tabular-nums" style={{ color: theme.textSecondary }}>{Math.min(week.xp, WEEK_GOAL)} / {WEEK_GOAL} XP</span>}
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}18` }}>
            <motion.div className="h-full rounded-full" animate={{ width: `${Math.min(100, (week.xp / WEEK_GOAL) * 100)}%` }}
              style={{ background: week.xp >= WEEK_GOAL ? '#10B981' : `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight})` }} />
          </div>
          <p className="text-[10px] mt-1.5" style={{ color: theme.textSecondary }}>
            Bu hafta {WEEK_GOAL} XP topla, +{WEEK_BONUS} bonus kazan! Hafta pazartesi sıfırlanır.
          </p>
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
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-black flex items-center gap-1.5" style={{ color: theme.textPrimary }}><Library size={14} style={{ color: theme.gold }} /> Kategoriler</h2>
            <span className="text-[9px] font-bold" style={{ color: theme.textSecondary }}>Dokun → o konuda test başlat</span>
          </div>
          {/* Kompakt yatay şerit — dokununca o kategoriyle Klasik Test açılır */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
            {BANK_CATEGORIES.map(c => (
              <button key={c.name}
                onClick={() => {
                  try { localStorage.setItem('gc_preset_category', c.name); } catch { /* ignore */ }
                  openGame(GAME_MODES.find(g => g.id === 'classic'));
                }}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-black active:scale-95 transition-transform"
                style={{ background: `${theme.gold}0c`, border: `1px solid ${theme.gold}25`, color: theme.textPrimary }}>
                <span className="text-sm">{CAT_ICONS[c.name] || '📚'}</span> {c.name}
              </button>
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

      {/* ─── KOLEKSİYON ALBÜMÜ ─── */}
      {(() => {
        let artifacts = []; let badges = [];
        try { artifacts = JSON.parse(localStorage.getItem('gc_artifacts')) || []; } catch { /* ignore */ }
        try { badges = JSON.parse(localStorage.getItem('gc_badges')) || []; } catch { /* ignore */ }
        return (
          <div className="px-5 mb-5">
            <div className="rounded-2xl p-4" style={S.card}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black" style={{ color: theme.textPrimary }}>🎒 Koleksiyon Albümü</h2>
                <span className="text-[10px] font-bold" style={{ color: theme.gold }}>{artifacts.length + badges.length} parça</span>
              </div>
              {/* Macera hatıraları */}
              <p className="text-[9px] font-black uppercase tracking-wide mb-2" style={{ color: theme.textSecondary }}>Macera Hatıraları</p>
              <div className="grid grid-cols-6 gap-1.5 mb-3">
                {ADVENTURE.map(c => {
                  const owned = artifacts.includes(c.id);
                  return (
                    <div key={c.id} className="aspect-square rounded-xl flex items-center justify-center text-lg"
                      title={c.artifactName}
                      style={{
                        background: owned ? `${theme.gold}14` : `${theme.textSecondary}08`,
                        border: `1px solid ${owned ? `${theme.gold}45` : theme.cardBorder}`,
                        filter: owned ? 'none' : 'grayscale(1)', opacity: owned ? 1 : 0.35,
                      }}>
                      {owned ? c.artifact : '❔'}
                    </div>
                  );
                })}
              </div>
              {/* Rozetler */}
              {badges.length > 0 && (
                <>
                  <p className="text-[9px] font-black uppercase tracking-wide mb-2" style={{ color: theme.textSecondary }}>Kazanılan Rozetler</p>
                  <div className="flex flex-wrap gap-1.5">
                    {badges.map(b => (
                      <span key={b} className="text-[9px] font-black px-2.5 py-1 rounded-full" style={{ background: `${theme.gold}12`, color: theme.gold, border: `1px solid ${theme.gold}35` }}>
                        🏅 {b}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {artifacts.length === 0 && badges.length === 0 && (
                <p className="text-[10px] text-center py-2" style={{ color: theme.textSecondary }}>Macera duraklarını bitir, hatıraları topla! 🌍</p>
              )}
            </div>
          </div>
        );
      })()}

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
