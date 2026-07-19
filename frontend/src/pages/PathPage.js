import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Flame, RefreshCw, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { awardXPOnce } from '../services/gamification';
import {
  ASSESSMENT, TASK_POOL, STAGES,
  getProfile, saveProfile, resetProfile,
  getTodayPlan, isTaskDone, toggleTask, getHistory, getStreak, getStage, syncHistory, todayKey,
} from '../services/pathEngine';
import Confetti from './games/Confetti';

// 🛤️ NUR YOLU — uygulamanın omurgası.
// İlk girişte kısa değerlendirme → her gün kişiye özel "Bugünün Yolu".
// Görevler mevcut modüllere gider; çoğu otomatik algılanır. Seri + mertebe.

export default function PathPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getProfile());
  const [answers, setAnswers] = useState({});
  const [qIdx, setQIdx] = useState(0);
  const [, force] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const plan = profile ? getTodayPlan() : null;
  const doneCount = plan ? plan.tasks.filter(t => isTaskDone(plan, t)).length : 0;
  const allDone = plan && doneCount === plan.tasks.length;
  const streak = getStreak();
  const stage = getStage();
  const history = getHistory();

  // Tüm görevler bitince günün XP'sini bir kez ver
  useMemo(() => {
    if (plan) syncHistory(plan);
    if (allDone) {
      awardXPOnce(user, `nur_${todayKey()}`, 'worship_task', { points: 25, details: 'Nur Yolu günü tamamlandı' });
    }
    return null;
  }, [allDone, doneCount]); // eslint bilinçli: gün içi güncelleme yeterli

  const pickAnswer = useCallback((qid, oid) => {
    const next = { ...answers, [qid]: oid };
    setAnswers(next);
    if (qIdx < ASSESSMENT.length - 1) setTimeout(() => setQIdx(i => i + 1), 250);
    else {
      const p = saveProfile(next);
      setTimeout(() => { setProfile(p); setCelebrate(true); setTimeout(() => setCelebrate(false), 1800); }, 350);
    }
  }, [answers, qIdx]);

  const retake = useCallback(() => {
    resetProfile(); setProfile(null); setAnswers({}); setQIdx(0);
  }, []);

  // ═══════════ DEĞERLENDİRME ═══════════
  if (!profile) {
    const q = ASSESSMENT[qIdx];
    return (
      <div className="min-h-screen pb-24 max-w-xl mx-auto" style={{ background: theme.bg }}>
        <div className="px-6 pt-10 text-center">
          <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl mb-3">🛤️</motion.p>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Nur Yolu</h1>
          <p className="text-xs mt-2 leading-relaxed" style={{ color: theme.textSecondary }}>
            Birkaç soruyla seni tanıyalım; her gün sana özel, 10-30 dakikalık bir yol çizelim.
          </p>
          {/* İlerleme noktaları */}
          <div className="flex justify-center gap-2 mt-5">
            {ASSESSMENT.map((_, i) => (
              <span key={i} className="w-2 h-2 rounded-full transition-all"
                style={{ background: i <= qIdx ? theme.gold : `${theme.textSecondary}30`, transform: i === qIdx ? 'scale(1.4)' : 'none' }} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="px-6 mt-8">
            <div className="rounded-3xl p-5" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
              <p className="text-3xl mb-2 text-center">{q.icon}</p>
              <p className="text-base font-black text-center mb-4" style={{ color: theme.textPrimary }}>{q.q}</p>
              <div className="space-y-2">
                {q.options.map(o => (
                  <button key={o.id} onClick={() => pickAnswer(q.id, o.id)}
                    className="w-full p-3.5 rounded-2xl text-sm font-bold text-left active:scale-98 transition-all flex items-center justify-between"
                    style={{
                      background: answers[q.id] === o.id ? `${theme.gold}18` : `${theme.textSecondary}08`,
                      border: `1.5px solid ${answers[q.id] === o.id ? theme.gold : theme.cardBorder}`,
                      color: theme.textPrimary,
                    }}>
                    {o.label}
                    <ChevronRight size={15} style={{ color: theme.gold }} />
                  </button>
                ))}
              </div>
            </div>
            {qIdx > 0 && (
              <button onClick={() => setQIdx(i => i - 1)} className="mt-3 text-[11px] font-bold mx-auto block" style={{ color: theme.textSecondary }}>
                ← Önceki soru
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ═══════════ BUGÜNÜN YOLU ═══════════
  const pct = plan ? doneCount / plan.tasks.length : 0;
  const R = 30, CIRC = 2 * Math.PI * R;
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const k = d.toISOString().slice(0, 10);
    const h = history[k];
    return { k, day: 'PSÇPCCP'[d.getDay() === 0 ? 6 : d.getDay() - 1] || '·', full: h && h.done >= h.total && h.total > 0, some: h && h.done > 0 };
  });

  return (
    <div className="min-h-screen pb-24 max-w-3xl mx-auto" style={{ background: theme.bg }}>
      {celebrate && <Confetti count={30} />}

      {/* Mertebe başlığı */}
      <div className="px-5 pt-6">
        <div className="rounded-3xl p-5 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${theme.gold}14, ${theme.surface})`, border: `1.5px solid ${theme.gold}30` }}>
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${theme.gold}, transparent 65%)` }} />
          <div className="flex items-center gap-4 relative">
            {/* Günlük halka */}
            <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
              <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90">
                <circle cx="38" cy="38" r={R} fill="none" stroke={`${theme.gold}20`} strokeWidth="7" />
                <circle cx="38" cy="38" r={R} fill="none" stroke={theme.gold} strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct)} style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black" style={{ color: theme.textPrimary }}>{doneCount}/{plan.tasks.length}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: theme.gold }}>Nur Yolu · Bugünün Yolu</p>
              <p className="text-xl font-black mt-0.5" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
                {stage.current.emoji} {stage.current.name}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] font-black flex items-center gap-1" style={{ color: '#F59E0B' }}>
                  <Flame size={12} /> {streak} gün seri
                </span>
                {stage.next && (
                  <span className="text-[10px]" style={{ color: theme.textSecondary }}>
                    {stage.next.emoji} {stage.next.name}: {stage.days}/{stage.next.need} tam gün
                  </span>
                )}
              </div>
            </div>
          </div>
          {allDone && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-xl p-2.5 text-center relative" style={{ background: '#10B98118', border: '1px solid #10B98140' }}>
              <p className="text-xs font-black" style={{ color: '#10B981' }}>
                <Sparkles size={12} className="inline mr-1" />Bugünün yolu tamamlandı · +25 XP — Allah kabul etsin 🤲
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Haftalık dizilim */}
      <div className="px-5 mt-4 flex items-center justify-between">
        {last7.map((d, i) => (
          <div key={d.k} className="flex flex-col items-center gap-1">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
              style={{
                background: d.full ? theme.gold : d.some ? '#10B98125' : `${theme.textSecondary}10`,
                color: d.full ? '#0A1F14' : d.some ? '#10B981' : theme.textSecondary,
                border: `1.5px solid ${d.full ? theme.gold : d.some ? '#10B98150' : theme.cardBorder}`,
              }}>
              {d.full ? '✓' : d.some ? '·' : ''}
            </span>
            <span className="text-[8px] font-bold" style={{ color: i === 6 ? theme.gold : theme.textSecondary }}>{d.day}</span>
          </div>
        ))}
      </div>

      {/* Görevler */}
      <div className="px-5 mt-5 space-y-2.5">
        {plan.tasks.map((tid, i) => {
          const t = TASK_POOL[tid];
          if (!t) return null;
          const done = isTaskDone(plan, tid);
          return (
            <motion.div key={tid} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-3.5 flex items-center gap-3"
              style={{ background: theme.surface, border: `1.5px solid ${done ? '#10B98145' : theme.cardBorder}`, opacity: done ? 0.85 : 1 }}>
              <button onClick={() => { toggleTask(tid); force(x => x + 1); }}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                style={{ background: done ? '#10B981' : `${theme.textSecondary}12`, border: done ? 'none' : `1.5px solid ${theme.cardBorder}` }}
                aria-label={done ? 'Geri al' : 'Tamamlandı işaretle'}>
                {done && <Check size={15} color="#fff" />}
              </button>
              <button onClick={() => navigate(t.route)} className="flex-1 min-w-0 text-left active:opacity-70">
                <p className="text-sm font-black flex items-center gap-1.5" style={{ color: theme.textPrimary, textDecoration: done ? 'line-through' : 'none' }}>
                  <span>{t.icon}</span> {t.title}
                </p>
                <p className="text-[10px] mt-0.5 leading-snug" style={{ color: theme.textSecondary }}>{t.desc}</p>
              </button>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-black" style={{ color: theme.gold }}>+{t.xp} XP</p>
                <p className="text-[9px]" style={{ color: theme.textSecondary }}>{t.minutes} dk</p>
              </div>
              <ChevronRight size={14} className="shrink-0" style={{ color: theme.textSecondary }} onClick={() => navigate(t.route)} />
            </motion.div>
          );
        })}
      </div>

      {/* Mertebe yolu */}
      <div className="px-5 mt-6">
        <p className="text-sm font-black mb-2.5" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>🗺️ Yol Haritan</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {STAGES.map((s, i) => {
            const reached = stage.days >= s.need;
            const isCurrent = stage.current.id === s.id;
            return (
              <div key={s.id} className="shrink-0 w-24 rounded-2xl p-3 text-center relative"
                style={{
                  background: isCurrent ? `${theme.gold}14` : theme.surface,
                  border: `1.5px solid ${isCurrent ? theme.gold : reached ? '#10B98145' : theme.cardBorder}`,
                  opacity: reached || isCurrent ? 1 : 0.55,
                }}>
                <p className="text-2xl">{s.emoji}</p>
                <p className="text-[11px] font-black mt-1" style={{ color: theme.textPrimary }}>{s.name}</p>
                <p className="text-[8px]" style={{ color: theme.textSecondary }}>{s.desc}</p>
                {reached && !isCurrent && <span className="absolute top-1.5 right-1.5 text-[9px]" style={{ color: '#10B981' }}>✓</span>}
              </div>
            );
          })}
        </div>
        <p className="text-[10px] mt-2" style={{ color: theme.textSecondary }}>
          Mertebe, günün TÜM görevlerini bitirdiğin "tam gün" sayısıyla büyür. Şu an: {stage.days} tam gün.
        </p>
      </div>

      {/* Yeniden ayarla */}
      <div className="px-5 mt-6">
        <button onClick={retake} className="flex items-center gap-1.5 text-[11px] font-bold mx-auto" style={{ color: theme.textSecondary }}>
          <RefreshCw size={12} /> Değerlendirmeyi yenile — yol seviyene göre yeniden çizilir
        </button>
      </div>
    </div>
  );
}
