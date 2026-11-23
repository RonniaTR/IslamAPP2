import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { getTodayPlan, isTaskDone, getBadges, TASK_POOL } from '../../services/pathEngine';
import { useTheme } from '../../contexts/ThemeContext';
import { useTx } from '../../i18n';

// BUGÜNKÜ YOL + SIRADAKİ ROZET
//
// Önceki sürüm sabit veri gösteriyordu ("3/5 Tamamlandı", "7/10 Görev", "%70", "+50 XP") ve iki görseli
// ücretli bir ikon deposundan (iconscout premium) doğrudan bağlıyordu. İkisi de kaldırıldı:
// veriler Nur Yolu motorundan gelir, süsleme emoji ile yapılır (docs/YENI_OZELLIKLER.md 0.1 ve 0.3).
export function ChallengeAndBadgeSection() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const tt = useTx();

  const plan = getTodayPlan(); // değerlendirme yapılmadıysa null
  const tasks = plan
    ? plan.tasks.map((id) => ({ id, ...(TASK_POOL[id] || { title: id }), done: isTaskDone(plan, id) }))
    : [];
  const doneCount = tasks.filter((t) => t.done).length;

  const badges = getBadges();
  const earned = badges.filter((b) => b.earned).length;
  const next = badges.find((b) => !b.earned);

  const cardStyle = {
    background: theme.isDark
      ? `linear-gradient(145deg, ${theme.surfaceLight} 0%, ${theme.surface} 100%)`
      : theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    color: theme.textPrimary,
  };

  return (
    <div className="px-4 flex flex-col md:flex-row gap-4 font-sans">
      {/* Bugünkü Yol */}
      <button onClick={() => navigate('/yol')}
        className="flex-1 text-start rounded-[24px] p-5 relative overflow-hidden shadow-lg transition-colors duration-300"
        style={cardStyle}>
        <h3 className="font-bold text-lg mb-1" style={{ color: theme.textPrimary }}>{tt('Bugünkü Yolum')}</h3>
        {plan ? (
          <>
            <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>{doneCount}/{tasks.length} {tt('adım tamamlandı')}</p>
            <div className="space-y-2.5 relative z-10">
              {tasks.map((t) => <ChallengeItem key={t.id} text={tt(t.title)} done={t.done} theme={theme} />)}
            </div>
          </>
        ) : (
          <p className="text-xs" style={{ color: theme.textSecondary }}>{tt('Sana uygun günlük planı birlikte kuralım.')}</p>
        )}
        <div className="absolute -bottom-3 -right-1 text-6xl opacity-20 select-none" aria-hidden>🧭</div>
      </button>

      {/* Sıradaki Rozet */}
      <div className="flex-1 rounded-[24px] p-5 relative flex flex-col justify-between shadow-lg transition-colors duration-300"
        style={cardStyle}>
        <div>
          <h3 className="font-bold text-lg mb-4" style={{ color: theme.textPrimary }}>{next ? tt('Sıradaki Rozet') : tt('Rozetler')}</h3>
          <div className="flex justify-between items-start mb-6">
            <div className="pe-16">
              <h4 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{next ? tt(next.name || next.title || '') : tt('Hepsi tamam')}</h4>
              {next?.desc ? <p className="text-[11px] mt-1" style={{ color: theme.textSecondary }}>{tt(next.desc)}</p> : null}
            </div>
            <div className="w-14 h-14 absolute top-4 right-4 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: theme.surfaceLight, border: `1px solid ${theme.cardBorder}` }} aria-hidden>
              {next?.emoji || next?.icon || '🏅'}
            </div>
          </div>
          <div className="flex items-center gap-3 w-full mb-6 mt-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: theme.surfaceLight }}>
              <div className="h-full rounded-full" style={{ background: theme.gold, width: `${badges.length ? Math.round((earned / badges.length) * 100) : 0}%` }} />
            </div>
            <span className="text-xs font-bold" style={{ color: theme.textSecondary }}>{earned}/{badges.length}</span>
          </div>
        </div>
        <button onClick={() => navigate('/yol')}
          className="w-full transition-colors rounded-full py-2.5 flex items-center justify-center gap-2"
          style={{ background: theme.surfaceLight, color: theme.textPrimary, border: `1px solid ${theme.cardBorder}` }}>
          <span className="text-xs font-bold">{tt('Rozetleri Gör')}</span>
          <ChevronRight size={14} style={{ color: theme.isDark ? theme.gold : theme.primary }} />
        </button>
      </div>
    </div>
  );
}

function ChallengeItem({ text, done, theme }) {
  return (
    <div className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 size={16} style={{ color: theme.primary }} className="shrink-0" />
      ) : (
        <Circle size={16} style={{ color: theme.textSecondary }} className="shrink-0" />
      )}
      <span className={`text-[11px] font-medium ${done ? 'line-through' : ''}`}
        style={{ color: done ? theme.textPrimary : theme.textSecondary }}>
        {text}
      </span>
    </div>
  );
}
