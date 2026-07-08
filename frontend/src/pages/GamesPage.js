import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Zap, Flame, Trophy, Calendar, Library } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { awardXP, fetchStats, subscribeStats, getCachedStats } from '../services/gamification';
import { BANK_SIZE, BANK_CATEGORIES } from '../data/questionBank';
import { WORD_PUZZLES, MATCH_PAIRS } from '../data/gameData';
import WheelGame from './games/WheelGame';
import WordGame from './games/WordGame';
import RapidQuiz from './games/RapidQuiz';
import MatchGame from './games/MatchGame';

// ─── Oyun tanımları (SVG amblem + canlı renk) ───
const GAMES = [
  {
    id: 'wheel', title: 'Çarkıfelek', desc: '8 kategorili çark · açıklamalı sorular', color: '#10B981',
    type: 'game_wheel', Comp: WheelGame,
    emblem: (c) => (
      <svg viewBox="0 0 48 48" width="38" height="38">
        <circle cx="24" cy="24" r="20" fill="none" stroke={c} strokeWidth="3" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
          const rad = (a - 90) * Math.PI / 180;
          return <line key={i} x1="24" y1="24" x2={24 + 20 * Math.cos(rad)} y2={24 + 20 * Math.sin(rad)} stroke={c} strokeWidth="2" opacity="0.6" />;
        })}
        <circle cx="24" cy="24" r="5" fill={c} />
        <path d="M24 1 L20 8 L28 8 Z" fill={c} />
      </svg>
    ),
  },
  {
    id: 'word', title: 'Kelime Tamamlama', desc: `${WORD_PUZZLES.length} İslami terim · ipucuyla bul`, color: '#8B5CF6',
    type: 'game_word', Comp: WordGame,
    emblem: (c) => (
      <svg viewBox="0 0 48 48" width="38" height="38">
        {[6, 20, 34].map((x, i) => <rect key={i} x={x} y="18" width="10" height="14" rx="2" fill="none" stroke={c} strokeWidth="2.5" />)}
        <text x="11" y="29" fontSize="10" fontWeight="900" fill={c}>E</text>
        <text x="39" y="29" fontSize="10" fontWeight="900" fill={c}>M</text>
      </svg>
    ),
  },
  {
    id: 'rapid', title: 'Hızlı Bilgi', desc: `${BANK_SIZE} soruluk banka · zorluk seç, rekor kır`, color: '#F59E0B',
    type: 'game_quiz', Comp: RapidQuiz,
    emblem: (c) => (
      <svg viewBox="0 0 48 48" width="38" height="38">
        <circle cx="24" cy="26" r="16" fill="none" stroke={c} strokeWidth="2.5" />
        <path d="M24 26 L24 16 M24 26 L31 30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 6 L30 6" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M13 30 L9 26 M35 30 L39 26" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'match', title: 'Eşleştirme', desc: `${MATCH_PAIRS.length} terim-anlam çifti · hafızanı test et`, color: '#06B6D4',
    type: 'game_match', Comp: MatchGame,
    emblem: (c) => (
      <svg viewBox="0 0 48 48" width="38" height="38">
        <rect x="6" y="10" width="14" height="12" rx="3" fill="none" stroke={c} strokeWidth="2.5" />
        <rect x="28" y="26" width="14" height="12" rx="3" fill="none" stroke={c} strokeWidth="2.5" />
        <path d="M20 16 L28 32" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
      </svg>
    ),
  },
];

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000];
function levelProgress(points) {
  let lvl = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) if (points >= LEVEL_THRESHOLDS[i]) lvl = i + 1;
  const cur = LEVEL_THRESHOLDS[lvl - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[lvl] ?? (cur + 1000);
  const pct = Math.min(100, Math.round(((points - cur) / (next - cur)) * 100));
  return { lvl, next, pct };
}

// ─── localStorage yardımcıları (oyun başı istatistik + günlük XP) ───
const todayKey = () => new Date().toISOString().split('T')[0];
function loadGameMeta() {
  try { return JSON.parse(localStorage.getItem('game_meta')) || {}; } catch { return {}; }
}
function saveGameMeta(meta) {
  try { localStorage.setItem('game_meta', JSON.stringify(meta)); } catch { /* quota */ }
}
function loadDailyXP() {
  try { return Number(localStorage.getItem(`daily_xp_${todayKey()}`) || 0); } catch { return 0; }
}
function addDailyXP(amount) {
  const v = loadDailyXP() + amount;
  try { localStorage.setItem(`daily_xp_${todayKey()}`, String(v)); } catch { /* quota */ }
  return v;
}

// ─── Seviye halkası (SVG progress ring) ───
function LevelRing({ pct, level, theme }) {
  const R = 34; const C = 2 * Math.PI * R;
  return (
    <div className="relative w-[88px] h-[88px] shrink-0">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={R} fill="none" stroke={`${theme.textSecondary}25`} strokeWidth="7" />
        <motion.circle cx="44" cy="44" r={R} fill="none" stroke={theme.gold} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - pct / 100) }}
          transition={{ duration: 1, ease: 'easeOut' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] uppercase tracking-wider" style={{ color: theme.textSecondary }}>Sv</span>
        <span className="text-2xl font-black leading-none" style={{ color: theme.gold }}>{level}</span>
      </div>
    </div>
  );
}

export default function GamesPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [active, setActive] = useState(null);
  const [stats, setStats] = useState(() => getCachedStats() || { total_points: 0, level: 1, current_streak: 0 });
  const [gameMeta, setGameMeta] = useState(loadGameMeta);
  const [dailyXP, setDailyXP] = useState(loadDailyXP);
  const [floats, setFloats] = useState([]);
  const floatId = useRef(0);

  // Günün görevi: tarihe göre döner, o oyunda 2x XP
  const dailyGame = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return GAMES[dayOfYear % GAMES.length];
  }, []);

  useEffect(() => {
    fetchStats(user).then(s => { if (s) setStats(s); });
    const unsub = subscribeStats(s => { if (s) setStats(prev => ({ ...prev, ...s })); });
    return unsub;
  }, [user]);

  const openGame = useCallback((id) => {
    setActive(id);
    setGameMeta(prev => {
      const meta = { ...prev, [id]: { plays: (prev[id]?.plays || 0) + 1, xp: prev[id]?.xp || 0 } };
      saveGameMeta(meta);
      return meta;
    });
  }, []);

  const handleXP = useCallback(async (amount, type, label) => {
    // Günün görevi bonusu: 2x
    const isDaily = active && dailyGame.id === active;
    const finalAmount = isDaily ? amount * 2 : amount;
    // Uçan +XP bildirimi
    const id = ++floatId.current;
    setFloats(f => [...f, { id, amount: finalAmount, bonus: isDaily }]);
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1600);
    // Optimistik toplam + oyun içi sayaçlar
    setStats(prev => ({ ...prev, total_points: (prev.total_points || 0) + finalAmount }));
    setDailyXP(addDailyXP(finalAmount));
    if (active) {
      setGameMeta(prev => {
        const meta = { ...prev, [active]: { plays: prev[active]?.plays || 1, xp: (prev[active]?.xp || 0) + finalAmount } };
        saveGameMeta(meta);
        return meta;
      });
    }
    await awardXP(user, type, { points: finalAmount, details: isDaily ? `${label} (Günün Görevi 2x)` : label });
  }, [user, active, dailyGame]);

  const totalXP = stats.total_points || 0;
  const { lvl, next, pct } = levelProgress(totalXP);
  const activeGame = GAMES.find(g => g.id === active);

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      {/* Uçan XP bildirimleri */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
        <AnimatePresence>
          {floats.map(f => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -30, scale: 1 }} exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 1.2 }}
              className="px-4 py-1.5 rounded-full font-black text-sm shadow-lg whitespace-nowrap"
              style={{ background: f.bonus ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : theme.gold, color: f.bonus ? '#fff' : theme.bg }}>
              +{f.amount} XP {f.bonus ? '🔥 2x' : '⚡'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Başlık */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-2">
          {active && (
            <button onClick={() => setActive(null)} className="p-2 -ml-2 rounded-xl active:scale-90" aria-label="Geri">
              <ArrowLeft size={20} style={{ color: theme.gold }} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
              {activeGame ? activeGame.title : 'Oyun Modu'}
            </h1>
            {!active && <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>Oyna, öğren, XP kazan — profilinde birikir</p>}
          </div>
          {activeGame && dailyGame.id === activeGame.id && (
            <span className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-full"
              style={{ background: 'linear-gradient(135deg, #F59E0B22, #EF444422)', color: '#F59E0B', border: '1px solid #F59E0B55' }}>
              🔥 2x XP
            </span>
          )}
        </div>
      </div>

      {/* HERO: seviye halkası + canlı istatistikler (yalnızca hub'da) */}
      {!active && (
        <>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="mx-5 mb-4 rounded-3xl p-5 relative overflow-hidden"
            style={{ background: `linear-gradient(150deg, ${theme.surface} 30%, ${theme.gold}14 100%)`, border: `1px solid ${theme.gold}30` }}>
            {/* dekoratif parıltı */}
            <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full opacity-25 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${theme.gold}50, transparent)` }} />

            <div className="flex items-center gap-4">
              <LevelRing pct={pct} level={stats.level || lvl} theme={theme} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: theme.textSecondary }}>Toplam XP</p>
                <p className="text-3xl font-black tabular-nums leading-tight" style={{ color: theme.gold }}>{totalXP.toLocaleString('tr-TR')}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: theme.textSecondary }}>
                    <Zap size={12} style={{ color: theme.gold }} /> Bugün +{dailyXP}
                  </span>
                  {stats.current_streak > 0 && (
                    <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: '#EF4444' }}>
                      <Flame size={12} /> {stats.current_streak} gün seri
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[10px] mt-3 text-right" style={{ color: theme.textSecondary }}>Sonraki seviyeye {Math.max(0, next - totalXP)} XP</p>
          </motion.div>

          {/* GÜNÜN GÖREVİ */}
          <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            whileTap={{ scale: 0.98 }} onClick={() => openGame(dailyGame.id)}
            className="mx-5 mb-5 w-[calc(100%-2.5rem)] rounded-2xl p-4 flex items-center gap-3 text-left relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #F59E0B14, #EF444410)', border: '1.5px solid #F59E0B55' }}>
            <motion.div className="absolute inset-0 pointer-events-none" animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 2.4, repeat: Infinity }}
              style={{ background: 'linear-gradient(120deg, transparent 30%, #F59E0B22 50%, transparent 70%)' }} />
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F59E0B20' }}>
              <Calendar size={20} style={{ color: '#F59E0B' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#F59E0B' }}>🔥 Günün Görevi · 2x XP</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: theme.textPrimary }}>{dailyGame.title} oyna, çift XP kazan!</p>
            </div>
            <ChevronRight size={18} style={{ color: '#F59E0B' }} />
          </motion.button>
        </>
      )}

      {/* İçerik */}
      {activeGame ? (
        <activeGame.Comp theme={theme} onXP={handleXP} />
      ) : (
        <div className="px-5 space-y-3">
          {GAMES.map((g, i) => {
            const meta = gameMeta[g.id];
            const isDaily = dailyGame.id === g.id;
            return (
              <motion.button key={g.id} onClick={() => openGame(g.id)}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${theme.surface}, ${g.color}0a)`,
                  border: `1.5px solid ${isDaily ? '#F59E0B66' : `${g.color}30`}`,
                }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${g.color}15` }}>
                  {g.emblem(g.color)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-black" style={{ color: theme.textPrimary }}>{g.title}</p>
                    {isDaily && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: '#F59E0B22', color: '#F59E0B' }}>2x</span>}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>{g.desc}</p>
                  {meta && (
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: g.color }}>
                        <Trophy size={10} /> {meta.xp || 0} XP
                      </span>
                      <span className="text-[10px]" style={{ color: theme.textSecondary }}>{meta.plays || 0} oyun</span>
                    </div>
                  )}
                </div>
                <ChevronRight size={18} style={{ color: g.color }} />
              </motion.button>
            );
          })}

          {/* SORU BANKASI VİTRİNİ */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl p-4 mt-2" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Library size={15} style={{ color: theme.gold }} />
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: theme.gold }}>Soru Bankası · {BANK_SIZE} soru</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {BANK_CATEGORIES.map(c => (
                <span key={c.name} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${theme.gold}10`, color: theme.textPrimary, border: `1px solid ${theme.cardBorder}` }}>
                  {c.name} <span style={{ color: theme.gold }}>{c.count}</span>
                </span>
              ))}
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-1.5 pt-3 text-[11px]" style={{ color: theme.textSecondary }}>
            <Zap size={13} style={{ color: theme.gold }} /> Kazandığın XP profiline ve liderlik tablosuna işlenir
          </div>
        </div>
      )}
    </div>
  );
}
