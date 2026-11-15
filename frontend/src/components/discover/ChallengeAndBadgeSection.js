import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { getTodayPlan, isTaskDone, getBadges, TASK_POOL } from '../../services/pathEngine';
import { useTx } from '../../i18n';

// BUGÜNKÜ YOL + SIRADAKİ ROZET
//
// Önceki sürüm sabit veri gösteriyordu ("3/5 Tamamlandı", "7/10 Görev", "%70", "+50 XP") ve iki görseli
// ücretli bir ikon deposundan (iconscout premium) doğrudan bağlıyordu. İkisi de kaldırıldı:
// veriler Nur Yolu motorundan gelir, süsleme emoji ile yapılır (docs/YENI_OZELLIKLER.md 0.1 ve 0.3).
export function ChallengeAndBadgeSection() {
  const navigate = useNavigate();
  const tt = useTx();

  const plan = getTodayPlan(); // değerlendirme yapılmadıysa null
  const tasks = plan
    ? plan.tasks.map((id) => ({ id, ...(TASK_POOL[id] || { title: id }), done: isTaskDone(plan, id) }))
    : [];
  const doneCount = tasks.filter((t) => t.done).length;

  const badges = getBadges();
  const earned = badges.filter((b) => b.earned).length;
  const next = badges.find((b) => !b.earned);

  return (
    <div className="px-4 flex flex-col md:flex-row gap-4 font-sans">
      {/* Bugünkü Yol */}
      <button onClick={() => navigate('/yol')}
        className="flex-1 text-left bg-gradient-to-br from-[#0F3523] to-[#0A1A12] rounded-[24px] p-5 relative overflow-hidden border border-[color:var(--bg-surface-light)] shadow-xl">
        <h3 className="text-white font-bold text-lg mb-1">{tt('Bugünkü Yolum')}</h3>
        {plan ? (
          <>
            <p className="text-gray-400 text-xs mb-4">{doneCount}/{tasks.length} {tt('adım tamamlandı')}</p>
            <div className="space-y-2.5 relative z-10">
              {tasks.map((t) => <ChallengeItem key={t.id} text={tt(t.title)} done={t.done} />)}
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-xs">{tt('Sana uygun günlük planı birlikte kuralım.')}</p>
        )}
        <div className="absolute -bottom-3 -right-1 text-6xl opacity-20 select-none" aria-hidden>🧭</div>
      </button>

      {/* Sıradaki Rozet */}
      <div className="flex-1 bg-gradient-to-br from-[#0F3523] to-[#0A1A12] rounded-[24px] p-5 relative flex flex-col justify-between border border-[color:var(--bg-surface-light)] shadow-xl">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">{next ? tt('Sıradaki Rozet') : tt('Rozetler')}</h3>
          <div className="flex justify-between items-start mb-6">
            <div className="pr-16">
              <h4 className="text-white text-lg font-bold">{next ? tt(next.name || next.title || '') : tt('Hepsi tamam')}</h4>
              {next?.desc ? <p className="text-gray-400 text-[11px] mt-1">{tt(next.desc)}</p> : null}
            </div>
            <div className="w-14 h-14 absolute top-4 right-4 rounded-2xl bg-[var(--bg-surface-light)] flex items-center justify-center text-3xl" aria-hidden>
              {next?.emoji || next?.icon || '🏅'}
            </div>
          </div>
          <div className="flex items-center gap-3 w-full mb-6 mt-2">
            <div className="flex-1 bg-[var(--bg-surface-light)] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: `${badges.length ? Math.round((earned / badges.length) * 100) : 0}%` }} />
            </div>
            <span className="text-xs font-bold text-gray-300">{earned}/{badges.length}</span>
          </div>
        </div>
        <button onClick={() => navigate('/yol')}
          className="w-full bg-[var(--bg-surface-light)] hover:bg-[#2D8A4E] transition-colors rounded-full py-2.5 flex items-center justify-center gap-2 text-white border border-[#2D8A4E]/30">
          <span className="text-xs font-bold">{tt('Rozetleri Gör')}</span>
          <ChevronRight size={14} className="text-[#10b981]" />
        </button>
      </div>
    </div>
  );
}

function ChallengeItem({ text, done }) {
  return (
    <div className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 size={16} className="text-[#10b981] shrink-0" />
      ) : (
        <Circle size={16} className="text-[#2D8A4E] shrink-0" />
      )}
      <span className={`text-[11px] font-medium ${done ? 'text-gray-300 line-through decoration-gray-500/50' : 'text-gray-400'}`}>
        {text}
      </span>
    </div>
  );
}
