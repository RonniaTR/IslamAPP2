import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Crown, Medal, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { awardXP, fetchStats, subscribeStats, getCachedStats, getUsername } from '../services/gamification';
import sfx, { sfxEnabled, setSfxEnabled } from '../services/sfx';
import { QUESTION_BANK } from '../data/questionBank';
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
import WhichSurah from './games/WhichSurah';
import WhichProphet from './games/WhichProphet';
import WhichName from './games/WhichName';
import WhereAyah from './games/WhereAyah';
import WhichLetter from './games/WhichLetter';
import StoryMode from './games/StoryMode';
import AdventureMode from './games/AdventureMode';
import GameLobby from './games/GameLobby';
import Confetti from './games/Confetti';
import HikmetCarki from './games/HikmetCarki';
import OnikiBasamak from './games/OnikiBasamak';
import { MODULES, ModuleScene } from './games/arena';

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
  { id: 'cark', title: 'Hikmet Çarkı', desc: 'Çevir, bil, altı nişanı topla.', emoji: '🎡', color: '#E2B85A', type: 'game_quiz', Comp: HikmetCarki },
  { id: 'sahne', title: '12 Basamak', desc: 'Sahnede on iki soru, iki baraj, üç joker.', emoji: '🎙️', color: '#6E5BB0', type: 'game_quiz', Comp: OnikiBasamak },
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
  { id: 'whichsurah', title: 'Hangi Sure?', desc: 'İpuçlarından sureyi tanı, dedektif ol.', emoji: '🔎', color: '#0EA5E9', type: 'game_quiz', Comp: WhichSurah, badge: 'Sure Dedektifi' },
  { id: 'whichprophet', title: 'Hangi Peygamber?', desc: 'Dört ipucu, bir peygamber. Az ipucuyla bil, çok XP al.', emoji: '🌟', color: '#F59E0B', type: 'game_quiz', Comp: WhichProphet, badge: 'Kıssa Dedektifi' },
  { id: 'whereayah', title: 'Ayet Nerede?', desc: 'Anlamından sureyi bul.', emoji: '📍', color: '#34D399', type: 'game_quiz', Comp: WhereAyah, badge: 'Ayet İzcisi' },
  { id: 'whichname', title: 'Hangi İsim?', desc: 'Tefekkür cümlesinden Esmâ-i Hüsnâ’yı tanı.', emoji: '✨', color: '#A78BFA', type: 'game_quiz', Comp: WhichName, badge: 'Esmâ Yolcusu' },
  { id: 'whichletter', title: 'Hangi Harf?', desc: 'Çıkış yerinden harfi tanı.', emoji: '🔡', color: '#38BDF8', type: 'game_quiz', Comp: WhichLetter },
];



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

  const accentColor = theme.isDark ? theme.gold : theme.primary;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
      className="mb-3 rounded-2xl p-4 relative overflow-hidden transition-colors duration-300"
      style={{ background: `linear-gradient(150deg, ${theme.primary}14, ${theme.cardBg})`, border: `1.5px solid ${theme.cardBorder}` }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: accentColor }}>
          📌 Günün Sorusu · +30 XP
        </p>
        {streak > 0 && <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: `${theme.gold}22`, color: theme.gold }}>🔁 {streak} gün</span>}
      </div>
      <p className="text-sm font-bold mb-3" style={{ color: theme.textPrimary }}>{q.question}</p>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt, i) => {
          const chosen = answered?.choice === i;
          const isRight = answered && i === q.correct_index;
          return (
            <button key={i} onClick={() => answer(i)} disabled={!!answered}
              className="p-2.5 rounded-xl text-[11px] font-semibold text-start transition-all active:scale-95"
              style={{
                background: isRight ? '#10B98122' : chosen ? '#EF444422' : theme.surface,
                border: `1px solid ${isRight ? '#10B981' : chosen ? '#EF4444' : theme.cardBorder}`,
                color: theme.textPrimary,
              }}>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className="text-[10px] mt-2.5 leading-relaxed" style={{ color: answered.ok ? accentColor : theme.textSecondary }}>
          {answered.ok ? '✅ Doğru! Yarın yeni soru seni bekliyor.' : `❌ Doğrusu: ${q.options[q.correct_index]}.`} {q.explanation}
        </p>
      )}
    </motion.div>
  );
}

// ─── Cami gece silueti (dış görsel yok — saf SVG) ───

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
  const [stage, setStage] = useState('hub'); // hub | module | lobby | play
  const [mod, setMod] = useState(null);
  const sessionXP = useRef(0);
  const direct = useRef(false);   // modül kartındaki "Oyna" ile lobisiz başlatıldı mı
  const [stats, setStats] = useState(() => getCachedStats() || { total_points: 0, level: 1, current_streak: 0 });
  const [daily, setDaily] = useState(loadDaily);
  const [totals, setTotals] = useState(loadTotals);
  const [week, setWeek] = useState(loadWeek);
  const [levelUp, setLevelUp] = useState(null); // yeni seviye numarası
  const [sfxOn, setSfxOn] = useState(sfxEnabled);
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
    lobbyFrom.current = stage === 'module' ? 'module' : 'hub';
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
    if (direct.current) { direct.current = false; setActive(null); setStage(lobbyFrom.current); return; }
    setStage('lobby');
  }, []);

  // Modüller: kartın kendisi modülü açar, "Oyna" doğrudan oyunu başlatır (lobi atlanır)
  const openModule = useCallback((m) => { setMod(m.id); setStage('module'); }, []);
  const playModule = useCallback((m) => {
    const playable = m.rounds.filter((id) => GAME_MODES.some((g) => g.id === id && g.Comp));
    const id = m.primary === 'random' ? playable[Math.floor(Math.random() * playable.length)] : m.primary;
    const g = GAME_MODES.find((x) => x.id === id);
    if (!g) return;
    if (g.route) { navigate(g.route); return; }
    setMod(m.id);
    lobbyFrom.current = 'module';
    direct.current = true;
    setActive(g.id);
    sessionXP.current = 0;
    setStage('play');
    setGameMeta(prev => {
      const mm = prev[g.id] || {};
      const meta = { ...prev, [g.id]: { ...mm, plays: (mm.plays || 0) + 1, xp: mm.xp || 0 } };
      save('game_meta', meta);
      return meta;
    });
    try { localStorage.setItem('gc_last_mode', g.id); } catch { /* ignore */ }
  }, [navigate]);

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

  const streak = stats.current_streak || 0;


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
            className="p-2 -ms-2 rounded-xl active:scale-90" aria-label="Geri">
            <ArrowLeft size={20} style={{ color: theme.gold }} />
          </button>
          <h1 className="text-xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{activeGame.title}</h1>
          {dailyGameId === activeGame.id && (
            <span className="ms-auto text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: '#F59E0B22', color: '#F59E0B', border: '1px solid #F59E0B55' }}>🔥 2x XP</span>
          )}
        </div>
        {inPlay
          ? <activeGame.Comp theme={theme} onXP={handleXP} onEvent={handleEvent} />
          : <GameLobby game={activeGame} meta={gameMeta[active]} leaderboard={leaderboard} theme={theme} onStart={() => startPlay(active)} />}
      </div>
    );
  }

  // ═══ MODÜL EKRANI ═══
  const module = MODULES.find((m) => m.id === mod);
  const modeOf = (id) => GAME_MODES.find((g) => g.id === id);
  const xpBar = (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
      <AnimatePresence>
        {floats.map(f => (
          <motion.div key={f.id} initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -30, scale: 1 }} exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 1.2 }} className="px-4 py-1.5 rounded-full font-black text-sm shadow-lg whitespace-nowrap"
            style={{ background: f.bonus ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : theme.gold, color: f.bonus ? '#fff' : theme.bg }}>
            +{f.amount} XP {f.bonus ? '🔥 2x' : ''}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
  const serif = { fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: -0.4 };
  const goldBtn = { minHeight: 50, padding: '0 26px', borderRadius: 25, background: theme.gold, color: '#1A1A1A', fontWeight: 800, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer' };

  if (stage === 'module' && module) {
    const best = Math.max(0, ...module.rounds.map((id) => (gameMeta[id] && gameMeta[id].best) || 0));
    const plays = module.rounds.reduce((a, id) => a + ((gameMeta[id] && gameMeta[id].plays) || 0), 0);
    return (
      <div className="min-h-screen pb-28" style={{ background: theme.bg, color: theme.textPrimary }}>
        {levelUpOverlay}{xpBar}
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 18px 0' }}>
          <button onClick={() => { setStage('hub'); setMod(null); }} aria-label="Geri" style={{ width: 44, height: 44, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <ArrowLeft size={20} style={{ color: theme.textPrimary }} />
          </button>
          <motion.div layoutId={`mod-${module.id}`} style={{ marginTop: 14, borderRadius: 30, overflow: 'hidden', position: 'relative', boxShadow: '0 22px 44px -22px rgba(8,10,25,0.8)' }}>
            <ModuleScene id={module.id} height={250} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(5,6,14,0.85) 100%)' }} />
            <div style={{ position: 'absolute', insetInline: 20, bottom: 18, color: '#F6EFDD' }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: module.accent, textTransform: 'uppercase' }}>{module.tag}</span>
              <h1 style={{ ...serif, fontSize: 36, margin: '4px 0 0' }}>{module.title}</h1>
            </div>
          </motion.div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: theme.textSecondary, margin: '16px 2px' }}>{module.desc}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => playModule(module)} style={{ ...goldBtn, minHeight: 58, fontSize: 17, flex: 1, justifyContent: 'center' }}>▶ Oyna</motion.button>
            <div style={{ textAlign: 'end' }}>
              <p style={{ fontSize: 11, color: theme.textSecondary, margin: 0 }}>En iyi</p>
              <p style={{ ...serif, fontSize: 22, margin: 0, color: theme.gold }}>{best}</p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: theme.textMuted, margin: '8px 2px 0' }}>{plays ? `${plays} kez oynadın` : 'Henüz oynamadın'}</p>

          <h2 style={{ ...serif, fontSize: 22, margin: '28px 2px 12px' }}>Turlar</h2>
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {module.rounds.map((id) => {
              const g = modeOf(id);
              if (!g) return null;
              const m = gameMeta[id] || {};
              return (
                <button key={id} type="button" onClick={() => openGame(g)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 22, background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, textAlign: 'start', color: theme.textPrimary }}>
                  <span style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, background: `${g.color}1F`, flexShrink: 0 }}>{g.emoji}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 16, fontWeight: 700 }}>{g.title}{dailyGameId === id ? '  🔥 2x' : ''}</span>
                    <span style={{ display: 'block', fontSize: 13, color: theme.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.desc}</span>
                  </span>
                  {m.best ? <span style={{ fontSize: 12, color: theme.gold, fontWeight: 700 }}>{m.best}</span> : null}
                  <ChevronRight size={18} style={{ color: theme.textMuted }} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══ BİLGİ MEYDANI (merkez) ═══
  const dailyMod = MODULES.find((m) => m.rounds.includes(dailyGameId));
  const dailyGame = modeOf(dailyGameId);
  const initial = (username || '?').trim().charAt(0).toLocaleUpperCase('tr');
  const C = 2 * Math.PI * 27;
  const headerAccent = theme.isDark ? theme.gold : theme.primary;
  return (
    <div className="min-h-screen pb-28 transition-colors duration-300" style={{ background: theme.bg, color: theme.textPrimary }}>
      {levelUpOverlay}{xpBar}

      {/* TEMAYA DUYARLI BAŞLIK */}
      <header style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '0 0 34px 34px',
        color: theme.textPrimary,
        padding: '22px 20px 26px',
        background: theme.isDark
          ? `linear-gradient(180deg, ${theme.surfaceLight} 0%, ${theme.surface} 68%, ${theme.bg} 100%)`
          : `linear-gradient(165deg, ${theme.surfaceLight} 0%, ${theme.surface} 62%, ${theme.bg} 100%)`,
        borderBottom: `1px solid ${theme.cardBorder}`,
      }}>
        {theme.isDark && (
          <svg viewBox="0 0 360 160" preserveAspectRatio="xMidYMid slice" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {Array.from({ length: 30 }, (_, i) => (
              <motion.circle key={i} cx={(i * 53) % 360} cy={(i * 37) % 120} r={0.6 + (i % 3) * 0.5} fill={theme.goldLight || '#FFF8E6'} animate={{ opacity: [0.15, 0.85, 0.15] }} transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: i * 0.17 }} />
            ))}
          </svg>
        )}
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2.4, color: headerAccent }}>BİLGİ MEYDANI</span>
            <button type="button" onClick={() => { const v = !sfxOn; setSfxOn(v); setSfxEnabled(v); }} aria-label={sfxOn ? 'Sesi kapat' : 'Sesi aç'}
              style={{ minHeight: 34, padding: '0 12px', borderRadius: 17, background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{sfxOn ? '♪ Ses açık' : '♪ Ses kapalı'}</button>
          </div>
          <h1 style={{ ...serif, fontSize: 34, margin: '10px 0 16px', lineHeight: 1.1, color: theme.textPrimary }}>Bil, yüksel,<br />ışığını yak.</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                <circle cx="32" cy="32" r="27" fill="none" stroke={theme.cardBorder} strokeWidth="5" />
                <motion.circle cx="32" cy="32" r="27" fill="none" stroke={theme.gold} strokeWidth="5" strokeLinecap="round" strokeDasharray={C}
                  initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - pct / 100) }} transition={{ duration: 1.2, ease: 'easeOut' }} />
              </svg>
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...serif, fontSize: 24, color: theme.textPrimary }}>{initial}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.textPrimary }}>{levelTitle} · {lvl}. seviye</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: theme.textSecondary }}>{totalXP.toLocaleString('tr-TR')} / {next.toLocaleString('tr-TR')} XP</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <LeagueEmblem color={league.cur.color} size={40} />
              <span style={{ fontSize: 10, color: theme.textSecondary, marginTop: 2 }}>{league.cur.name}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {[[`🔥 ${streak}`, 'gün seri'], [`${totals.correct}`, 'doğru'], [`${Math.min(week.xp, WEEK_GOAL)}/${WEEK_GOAL}`, 'haftalık hedef']].map(([v, l]) => (
              <div key={l} style={{ flex: 1, borderRadius: 16, padding: '10px 8px', background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 15, fontVariantNumeric: 'tabular-nums', color: theme.textPrimary }}>{v}</p>
                <p style={{ margin: 0, fontSize: 10, color: theme.textSecondary }}>{l}</p>
              </div>
            ))}
          </div>
          {week.xp >= WEEK_GOAL && !week.claimed && (
            <button type="button" onClick={claimWeek} style={{ ...goldBtn, marginTop: 12, width: '100%', justifyContent: 'center' }}>Haftalık ödülü al · +{WEEK_BONUS} XP</button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '18px 18px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {dailyMod && dailyGame && (
          <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => openGame(dailyGame)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px 12px 12px', borderRadius: 999, background: theme.surface, border: `1px solid ${theme.gold}55`, textAlign: 'start', color: theme.textPrimary }}>
            <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }} style={{ width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${theme.gold}22`, fontSize: 20 }}>{dailyGame.emoji}</motion.span>
            <span style={{ flex: 1 }}><span style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: theme.gold }}>GÜNÜN OYUNU · 2x XP</span><span style={{ fontWeight: 700 }}>{dailyGame.title}</span><span style={{ color: theme.textSecondary }}> · {dailyMod.title}</span></span>
            <ChevronRight size={18} style={{ color: theme.textMuted }} />
          </motion.button>
        )}

        {/* MODÜLLER — temaya duyarlı kart yapısı */}
        {MODULES.map((m, i) => (
          <motion.article key={m.id} layoutId={`mod-${m.id}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i, type: 'spring', stiffness: 160, damping: 22 }}
            style={{
              position: 'relative',
              borderRadius: 28,
              overflow: 'hidden',
              background: theme.cardBg,
              border: `1.5px solid ${theme.cardBorder}`,
              boxShadow: theme.isDark ? '0 18px 36px -20px rgba(0,0,0,0.75)' : '0 10px 28px -14px rgba(0,0,0,0.12)',
            }}>
            <button type="button" onClick={() => openModule(m)} aria-label={m.title} style={{ display: 'block', width: '100%', padding: 0, border: 'none', background: 'none', cursor: 'pointer', position: 'relative' }}>
              <ModuleScene id={m.id} height={i === 0 ? 175 : 148} />
            </button>
            <div style={{ padding: '14px 18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: theme.cardBg }}>
              <div onClick={() => openModule(m)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.8, color: headerAccent, textTransform: 'uppercase' }}>{m.tag}</span>
                <h2 style={{ ...serif, fontSize: i === 0 ? 26 : 22, margin: '2px 0 4px', lineHeight: 1.15, color: theme.textPrimary }}>{m.title}</h2>
                <p style={{ margin: 0, fontSize: 12.5, color: theme.textSecondary, lineHeight: 1.4 }}>{m.desc}</p>
              </div>
              <motion.button type="button" whileTap={{ scale: 0.93 }} onClick={() => playModule(m)} style={{ ...goldBtn, minHeight: 46, padding: '0 20px', flexShrink: 0 }}>▶ Oyna</motion.button>
            </div>
          </motion.article>
        ))}

        <h2 style={{ ...serif, fontSize: 24, margin: '12px 2px 0' }}>Günün sorusu</h2>
        <DailyQuestion theme={theme} onXP={handleXP} onEvent={handleEvent} />

        {/* GÖREVLER + SANDIKLAR */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '12px 2px 0' }}>
          <h2 style={{ ...serif, fontSize: 24, margin: 0 }}>Bugünün görevleri</h2>
          <span style={{ fontSize: 12, color: theme.textSecondary, fontVariantNumeric: 'tabular-nums' }}>{midnight}</span>
        </div>
        <div style={{ borderRadius: 24, background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, padding: '6px 14px' }}>
          {TASKS.map((t, k) => {
            const done = t.cur >= t.max; const claimed = daily.claimedTasks.includes(t.id);
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: k < TASKS.length - 1 ? `1px solid ${theme.cardBorder}` : 'none' }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{t.label}</span>
                  <span style={{ display: 'block', height: 5, borderRadius: 3, background: `${theme.primary}22`, marginTop: 6, overflow: 'hidden' }}>
                    <motion.span initial={{ width: 0 }} animate={{ width: `${Math.min(100, (t.cur / t.max) * 100)}%` }} style={{ display: 'block', height: '100%', background: done ? '#2F8F6B' : theme.gold }} />
                  </span>
                </span>
                {claimed ? <CheckCircle2 size={20} color="#2F8F6B" />
                  : done ? <button type="button" onClick={() => claimReward('task', t.id, t.xp)} style={{ minHeight: 34, padding: '0 12px', borderRadius: 17, background: '#2F8F6B', color: '#fff', fontSize: 12, fontWeight: 800 }}>+{t.xp}</button>
                    : <span style={{ fontSize: 12, color: theme.textSecondary, fontVariantNumeric: 'tabular-nums' }}>{Math.min(t.cur, t.max)}/{t.max}</span>}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
          {CHESTS.map((c) => {
            const ready = daily.wins >= c.need; const claimed = daily.claimedChests.includes(c.id);
            return (
              <div key={c.id} style={{ borderRadius: 22, padding: '14px 8px', textAlign: 'center', background: theme.cardBg, border: `1px solid ${ready && !claimed ? c.color : theme.cardBorder}` }}>
                <motion.div animate={ready && !claimed ? { rotate: [-5, 5, -5], y: [0, -3, 0] } : {}} transition={{ duration: 0.9, repeat: Infinity }} style={{ fontSize: 28 }}>{claimed ? '📭' : '🎁'}</motion.div>
                <p style={{ fontSize: 12, fontWeight: 700, color: c.color, margin: '4px 0 2px' }}>{c.name}</p>
                {claimed ? <p style={{ fontSize: 11, color: '#2F8F6B', margin: 0 }}>Alındı</p>
                  : ready ? <button type="button" onClick={() => claimReward('chest', c.id, c.xp)} style={{ minHeight: 30, padding: '0 10px', borderRadius: 15, background: c.color, color: '#1A1205', fontSize: 11, fontWeight: 800 }}>+{c.xp} Aç</button>
                    : <p style={{ fontSize: 11, color: theme.textSecondary, margin: 0 }}>{Math.min(daily.wins, c.need)}/{c.need} galibiyet</p>}
              </div>
            );
          })}
        </div>

        {/* NİŞANLAR */}
        <h2 style={{ ...serif, fontSize: 24, margin: '12px 2px 0' }}>Nişanlar</h2>
        <div className="scrollbar-hide" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {ACHIEVEMENTS.map((a) => {
            const p = Math.min(100, Math.round((a.cur / a.max) * 100));
            return (
              <div key={a.name} style={{ flexShrink: 0, width: 150, borderRadius: 22, padding: 14, background: theme.cardBg, border: `1px solid ${p >= 100 ? theme.gold : theme.cardBorder}` }}>
                <div style={{ fontSize: 24, filter: p >= 100 ? 'none' : 'grayscale(0.7)', opacity: p >= 100 ? 1 : 0.75 }}>{a.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 700, margin: '6px 0 2px' }}>{a.name}</p>
                <p style={{ fontSize: 11, color: theme.textSecondary, margin: 0, minHeight: 28 }}>{a.desc}</p>
                <div style={{ height: 4, borderRadius: 2, background: `${theme.primary}22`, marginTop: 8 }}><div style={{ width: `${p}%`, height: '100%', borderRadius: 2, background: theme.gold }} /></div>
              </div>
            );
          })}
        </div>

        {/* SIRALAMA */}
        {leaderboard.length > 0 && (
          <>
            <h2 style={{ ...serif, fontSize: 24, margin: '12px 2px 0' }}>Sıralama</h2>
            <div style={{ borderRadius: 24, background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, padding: 8 }}>
              {leaderboard.map((e, k) => (
                <div key={e.user_id || k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 16, background: k === 0 ? `${theme.gold}12` : 'transparent' }}>
                  {k === 0 ? <Crown size={18} style={{ color: theme.gold }} /> : k < 3 ? <Medal size={18} style={{ color: k === 1 ? '#A8A8A8' : '#CD7F32' }} /> : <span style={{ width: 18, textAlign: 'center', fontSize: 12, color: theme.textMuted }}>{k + 1}</span>}
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.username || 'Anonim'}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: theme.gold, fontVariantNumeric: 'tabular-nums' }}>{(e.total_points ?? e.points ?? 0).toLocaleString('tr-TR')}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <button type="button" onClick={() => navigate('/leaderboard')} style={{ alignSelf: 'center', minHeight: 40, padding: '0 16px', color: theme.textSecondary, fontSize: 13 }}>Bütün sıralama ›</button>
      </div>
    </div>
  );
}
