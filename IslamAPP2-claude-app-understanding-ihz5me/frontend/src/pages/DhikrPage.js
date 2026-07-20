import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Flame, Trophy, ChevronRight, Play, Pause, Volume2, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

const DHIKR_LIST = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', turkish: 'Sübhanallah', meaning: "Allah'ı tüm noksanlıklardan tenzih ederim", recommended: 33, color: '#10B981' },
  { id: 'elhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', turkish: 'Elhamdülillah', meaning: "Hamd Allah'a aittir", recommended: 33, color: '#3B82F6' },
  { id: 'allahuekber', arabic: 'اللَّهُ أَكْبَرُ', turkish: 'Allahu Ekber', meaning: 'Allah en büyüktür', recommended: 33, color: '#8B5CF6' },
  { id: 'lailaheillallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', turkish: 'Lâ ilâhe illallah', meaning: "Allah'tan başka ilah yoktur", recommended: 100, color: '#F59E0B' },
  { id: 'estagfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', turkish: 'Estağfirullah', meaning: "Allah'tan bağışlanma dilerim", recommended: 100, color: '#EF4444' },
  { id: 'salavat', arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ', turkish: 'Salavat-ı Şerife', meaning: "Peygamberimize salat ve selam", recommended: 100, color: '#C8A55A' },
  { id: 'hasbunallah', arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', turkish: 'Hasbünallah', meaning: 'Allah bize yeter, O ne güzel vekildir', recommended: 7, color: '#06B6D4' },
];

export default function DhikrPage() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(null);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [stats, setStats] = useState({ today_total: 0, streak: 0, weekly_total: 0 });
  const [completed, setCompleted] = useState(false);
  const startTime = useRef(null);
  const vibrate = useCallback(() => { try { navigator.vibrate?.(30); } catch {} }, []);

  useEffect(() => {
    api.get('/dhikr/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const selectDhikr = (d) => {
    setSelected(d);
    setCount(0);
    setTarget(d.recommended || 33);
    setCompleted(false);
    startTime.current = Date.now();
  };

  const increment = useCallback(() => {
    if (completed) return;
    vibrate();
    setCount(prev => {
      const next = prev + 1;
      if (next >= target) {
        setCompleted(true);
        // Log to backend
        const duration = Math.round((Date.now() - (startTime.current || Date.now())) / 1000);
        api.post('/dhikr/log', { dhikr_id: selected.id, count: next, duration_seconds: duration }).catch(() => {});
        setStats(s => ({ ...s, today_total: s.today_total + next }));
      }
      return next;
    });
  }, [completed, target, selected, vibrate]);

  const reset = () => {
    if (count > 0 && !completed) {
      const duration = Math.round((Date.now() - (startTime.current || Date.now())) / 1000);
      api.post('/dhikr/log', { dhikr_id: selected.id, count, duration_seconds: duration }).catch(() => {});
      setStats(s => ({ ...s, today_total: s.today_total + count }));
    }
    setCount(0);
    setCompleted(false);
    startTime.current = Date.now();
  };

  const progress = target > 0 ? Math.min(count / target, 1) : 0;
  const circumference = 2 * Math.PI * 120;

  // ── Counting View ──
  if (selected) {
    return (
      <div className="min-h-screen pb-24 flex flex-col" style={{ background: theme.bg }}>
        {/* Header */}
        <div className="px-4 pt-5 pb-2 flex items-center justify-between">
          <button onClick={() => { reset(); setSelected(null); }} className="text-sm px-3 py-1.5 rounded-xl"
            style={{ color: theme.textSecondary, background: theme.surface }}>← Geri</button>
          <div className="text-center">
            <p className="text-xs" style={{ color: theme.textSecondary }}>{selected.turkish}</p>
          </div>
          <button onClick={reset} className="p-2 rounded-xl" style={{ background: theme.surface }}>
            <RotateCcw size={18} style={{ color: theme.textSecondary }} />
          </button>
        </div>

        {/* Arabic */}
        <div className="text-center px-4 py-3">
          <p className="text-3xl" style={{ fontFamily: 'Amiri, serif', color: theme.gold, direction: 'rtl' }}>{selected.arabic}</p>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{selected.meaning}</p>
        </div>

        {/* Counter Circle */}
        <div className="flex-1 flex items-center justify-center px-4">
          <button onClick={increment} disabled={completed}
            className="relative w-[280px] h-[280px] rounded-full flex items-center justify-center select-none active:scale-95 transition-transform"
            style={{ background: 'transparent' }}>
            {/* SVG Ring */}
            <svg className="absolute inset-0" width="280" height="280" viewBox="0 0 280 280">
              <circle cx="140" cy="140" r="120" fill="none" stroke={`${theme.surface}`} strokeWidth="8" />
              <circle cx="140" cy="140" r="120" fill="none"
                stroke={completed ? '#10B981' : selected.color || theme.gold}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                transform="rotate(-90 140 140)"
                style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
            </svg>

            <div className="text-center z-10">
              {completed ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Check size={48} style={{ color: '#10B981' }} className="mx-auto mb-2" />
                  <p className="text-lg font-bold" style={{ color: '#10B981' }}>Tamamlandı!</p>
                </motion.div>
              ) : (
                <>
                  <p className="text-6xl font-bold tabular-nums" style={{ color: theme.textPrimary }}>{count}</p>
                  <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>/ {target}</p>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Actions */}
        <div className="px-6 pb-4 space-y-3">
          {completed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <p className="text-sm font-semibold" style={{ color: '#10B981' }}>Maşallah! {target} zikir tamamlandı 🤲</p>
              <button onClick={reset} className="mt-3 px-6 py-2 rounded-xl text-sm font-semibold"
                style={{ background: `${theme.gold}20`, color: theme.gold }}>Tekrar Başla</button>
            </motion.div>
          )}
          <p className="text-center text-xs" style={{ color: theme.textSecondary }}>Ekrana dokunarak zikir çek</p>
        </div>
      </div>
    );
  }

  // ── Main Dhikr List ──
  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      <div className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Zikir</h1>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>Günlük tesbih ve zikir takibi</p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 px-5 mb-5">
        {[
          { label: 'Bugün', value: stats.today_total, icon: '📿' },
          { label: 'Seri', value: `${stats.streak} gün`, icon: '🔥' },
          { label: 'Haftalık', value: stats.weekly_total, icon: '📊' },
        ].map((s, i) => (
          <div key={i} className="flex-1 rounded-2xl p-3 text-center" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <p className="text-lg mb-0.5">{s.icon}</p>
            <p className="text-lg font-bold tabular-nums" style={{ color: theme.textPrimary }}>{s.value}</p>
            <p className="text-[10px]" style={{ color: theme.textSecondary }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bismillah */}
      <div className="mx-5 mb-4 rounded-2xl p-4 text-center" style={{ background: `${theme.gold}08`, border: `1px solid ${theme.gold}15` }}>
        <p className="text-xl" style={{ fontFamily: 'Amiri, serif', color: theme.gold, direction: 'rtl' }}>أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</p>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>Kalpler ancak Allah'ı anmakla huzur bulur (Ra'd 28)</p>
      </div>

      {/* Dhikr List */}
      <div className="px-5 space-y-3">
        {DHIKR_LIST.map((d, i) => (
          <motion.button key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            onClick={() => selectDhikr(d)}
            className="w-full text-left rounded-2xl p-4 flex items-center gap-4"
            style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${d.color}15` }}>
              <span className="text-base" style={{ fontFamily: 'Amiri, serif', color: d.color }}>📿</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm" style={{ color: theme.textPrimary }}>{d.turkish}</p>
                <p className="text-sm" style={{ fontFamily: 'Amiri, serif', color: theme.gold, direction: 'rtl' }}>{d.arabic}</p>
              </div>
              <p className="text-xs truncate" style={{ color: theme.textSecondary }}>{d.meaning}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold" style={{ color: d.color }}>{d.recommended > 0 ? `${d.recommended}x` : '∞'}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
