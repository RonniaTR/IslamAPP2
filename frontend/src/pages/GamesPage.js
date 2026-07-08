import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Zap, Flame, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { awardXP, fetchStats, subscribeStats, getCachedStats } from '../services/gamification';
import WheelGame from './games/WheelGame';
import WordGame from './games/WordGame';
import RapidQuiz from './games/RapidQuiz';
import MatchGame from './games/MatchGame';

// ─── Oyun tanımları (SVG amblem + canlı renk) ───
const GAMES = [
  {
    id: 'wheel', title: 'Çarkıfelek', desc: 'Çarkı çevir, kategoriden soruyu bil', color: '#10B981',
    Comp: WheelGame,
    emblem: (c) => (
      <svg viewBox="0 0 48 48" width="34" height="34">
        <circle cx="24" cy="24" r="20" fill="none" stroke={c} strokeWidth="3" />
        {[0, 60, 120, 180, 240, 300].map((a, i) => {
          const rad = (a - 90) * Math.PI / 180;
          return <line key={i} x1="24" y1="24" x2={24 + 20 * Math.cos(rad)} y2={24 + 20 * Math.sin(rad)} stroke={c} strokeWidth="2" opacity="0.6" />;
        })}
        <circle cx="24" cy="24" r="5" fill={c} />
        <path d="M24 1 L20 8 L28 8 Z" fill={c} />
      </svg>
    ),
  },
  {
    id: 'word', title: 'Kelime Tamamlama', desc: 'İpucundan İslami terimi bul', color: '#8B5CF6',
    Comp: WordGame,
    emblem: (c) => (
      <svg viewBox="0 0 48 48" width="34" height="34">
        {[6, 20, 34].map((x, i) => <rect key={i} x={x} y="18" width="10" height="14" rx="2" fill="none" stroke={c} strokeWidth="2.5" />)}
        <text x="11" y="29" fontSize="10" fontWeight="900" fill={c}>E</text>
        <text x="39" y="29" fontSize="10" fontWeight="900" fill={c}>M</text>
      </svg>
    ),
  },
  {
    id: 'rapid', title: 'Hızlı Bilgi', desc: '60 saniyede en yüksek XP', color: '#F59E0B',
    Comp: RapidQuiz,
    emblem: (c) => (
      <svg viewBox="0 0 48 48" width="34" height="34">
        <circle cx="24" cy="26" r="16" fill="none" stroke={c} strokeWidth="2.5" />
        <path d="M24 26 L24 16 M24 26 L31 30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 6 L30 6" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M13 30 L9 26 M35 30 L39 26" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'match', title: 'Eşleştirme', desc: 'Terimi anlamıyla eşle', color: '#06B6D4',
    Comp: MatchGame,
    emblem: (c) => (
      <svg viewBox="0 0 48 48" width="34" height="34">
        <rect x="6" y="10" width="14" height="12" rx="3" fill="none" stroke={c} strokeWidth="2.5" />
        <rect x="28" y="26" width="14" height="12" rx="3" fill="none" stroke={c} strokeWidth="2.5" />
        <path d="M20 16 L28 32" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
      </svg>
    ),
  },
];

function levelProgress(points) {
  const thresholds = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000];
  let lvl = 1;
  for (let i = 0; i < thresholds.length; i++) if (points >= thresholds[i]) lvl = i + 1;
  const cur = thresholds[lvl - 1] ?? 0;
  const next = thresholds[lvl] ?? (cur + 1000);
  const pct = Math.min(100, Math.round(((points - cur) / (next - cur)) * 100));
  return { lvl, next, pct };
}

export default function GamesPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [active, setActive] = useState(null);
  const [stats, setStats] = useState(() => getCachedStats() || { total_points: 0, level: 1, current_streak: 0 });
  const [floats, setFloats] = useState([]);
  const floatId = useRef(0);

  useEffect(() => {
    fetchStats(user).then(s => { if (s) setStats(s); });
    const unsub = subscribeStats(s => { if (s) setStats(prev => ({ ...prev, ...s })); });
    return unsub;
  }, [user]);

  const handleXP = useCallback(async (amount, type, label) => {
    // Uçan +XP bildirimi
    const id = ++floatId.current;
    setFloats(f => [...f, { id, amount }]);
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1500);
    // Optimistik toplam
    setStats(prev => ({ ...prev, total_points: (prev.total_points || 0) + amount }));
    await awardXP(user, type, { points: amount, details: label });
  }, [user]);

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
              className="px-4 py-1.5 rounded-full font-black text-sm shadow-lg"
              style={{ background: theme.gold, color: theme.bg }}>
              +{f.amount} XP ⚡
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Başlık + canlı XP */}
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
        </div>
      </div>

      {/* Canlı XP kartı (yalnızca hub'da) */}
      {!active && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="mx-5 mb-5 rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.gold}10)`, border: `1px solid ${theme.gold}25` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${theme.gold}18` }}>
                <Star size={20} style={{ color: theme.gold }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: theme.textSecondary }}>Toplam XP</p>
                <p className="text-xl font-black tabular-nums" style={{ color: theme.gold }}>{totalXP.toLocaleString('tr-TR')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider" style={{ color: theme.textSecondary }}>Seviye</p>
              <p className="text-xl font-black" style={{ color: theme.textPrimary }}>{stats.level || lvl}</p>
            </div>
            {stats.current_streak > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: '#EF444418' }}>
                <Flame size={14} style={{ color: '#EF4444' }} />
                <span className="text-xs font-bold" style={{ color: '#EF4444' }}>{stats.current_streak}</span>
              </div>
            )}
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}20` }}>
            <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight})` }}
              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
          </div>
          <p className="text-[10px] mt-1.5 text-right" style={{ color: theme.textSecondary }}>Sonraki seviyeye {Math.max(0, next - totalXP)} XP</p>
        </motion.div>
      )}

      {/* İçerik */}
      {activeGame ? (
        <activeGame.Comp theme={theme} onXP={handleXP} />
      ) : (
        <div className="px-5 space-y-3">
          {GAMES.map((g, i) => (
            <motion.button key={g.id} onClick={() => setActive(g.id)}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left rounded-2xl p-4 flex items-center gap-4"
              style={{ background: theme.surface, border: `1px solid ${g.color}25` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${g.color}15` }}>
                {g.emblem(g.color)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold" style={{ color: theme.textPrimary }}>{g.title}</p>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>{g.desc}</p>
              </div>
              <ChevronRight size={18} style={{ color: g.color }} />
            </motion.button>
          ))}

          <div className="flex items-center justify-center gap-1.5 pt-3 text-[11px]" style={{ color: theme.textSecondary }}>
            <Zap size={13} style={{ color: theme.gold }} /> Kazandığın XP profiline ve liderlik tablosuna işlenir
          </div>
        </div>
      )}
    </div>
  );
}
