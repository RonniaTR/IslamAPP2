import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Lock, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLang } from '../../contexts/LangContext';
import { useTx } from '../../i18n';
import { donusPalette, PHASE_COLORS, alpha } from '../../donus/palette';
import { getReturnDay, getReadDays, RETURN_PHASES, LAST_DAY } from '../../services/returnEngine';
import { getDayContent } from '../../data/returnPath';

// 🚪 BÖLÜM — bir fazın günleri, başlıklarıyla birlikte.
// Açılmamış günlerin başlığı gizlidir: yolun önü merak, arkası hatıradır.

export default function DonusPhase() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const tt = useTx();
  const navigate = useNavigate();
  const { id } = useParams();

  const phase = RETURN_PHASES.find(x => x.id === id) || RETURN_PHASES[0];
  const p = donusPalette(theme, PHASE_COLORS[phase.id]);
  const maxOpen = Math.min(getReturnDay(), LAST_DAY);
  const read = getReadDays();
  const days = Array.from({ length: phase.to - phase.from + 1 }, (_, i) => phase.from + i);
  const doneN = days.filter(d => read.includes(d)).length;

  return (
    <div className="px-5 pt-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <button onClick={() => navigate('/donus')}
          className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-transform mb-4"
          style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }} aria-label={tt('Geri')}>
          <ArrowLeft size={15} style={{ color: p.accent }} />
        </button>

        <motion.span className="text-5xl block mb-3"
          animate={{ y: [0, -6, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 16px ${alpha(p.accentGlow, 0.6)})` }}>
          {phase.emoji}
        </motion.span>

        <h1 className="text-[26px] font-black leading-tight"
          style={{ fontFamily: 'Playfair Display, serif', color: p.text }}>
          {tt(phase.name)}
        </h1>
        <p className="text-[12px] mt-1.5" style={{ color: p.dim }}>{tt(phase.desc)}</p>

        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: alpha(p.accent, 0.14) }}>
            <motion.div className="h-full rounded-full" initial={{ width: 0 }}
              animate={{ width: `${(doneN / days.length) * 100}%` }} transition={{ duration: 0.9 }}
              style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accentGlow})` }} />
          </div>
          <span className="text-[10.5px] font-black tabular-nums" style={{ color: p.accent }}>
            {doneN}/{days.length}
          </span>
        </div>
      </motion.div>

      <div className="space-y-2">
        {days.map((d, i) => {
          const open = d <= maxOpen;
          const isRead = read.includes(d);
          const here = d === maxOpen;
          const lesson = open ? getDayContent(d, lang) : null;
          return (
            <motion.button key={d}
              initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.045, duration: 0.4 }}
              whileTap={open ? { scale: 0.98 } : undefined}
              onClick={() => open && navigate(`/donus/gun/${d}`)}
              disabled={!open}
              className="w-full rounded-2xl p-3.5 flex items-center gap-3 text-left disabled:cursor-default"
              style={{
                background: here ? p.cardStrong : p.card,
                border: `1.5px solid ${here ? p.border : p.borderSoft}`,
                opacity: open ? 1 : 0.5,
                boxShadow: here ? p.shadow : 'none',
              }}>
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-black shrink-0"
                style={{
                  background: isRead ? p.accent : alpha(p.accent, 0.12),
                  color: isRead ? p.onAccent : p.accent,
                  border: `1.5px solid ${alpha(p.accent, isRead ? 1 : 0.3)}`,
                }}>
                {isRead ? <Check size={14} strokeWidth={3} /> : open ? d : <Lock size={12} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-black truncate" dir={lang === 'ar' ? 'ltr' : undefined}
                  style={{ color: p.text, textAlign: lang === 'ar' ? 'left' : undefined }}>
                  {open ? lesson.title : tt('Yakında açılır')}
                </p>
                {open && (
                  <p className="text-[10px] mt-0.5 truncate" dir={lang === 'ar' ? 'ltr' : undefined}
                    style={{ color: p.dim, textAlign: lang === 'ar' ? 'left' : undefined }}>
                    {lesson.lead}
                  </p>
                )}
              </div>
              {open && <ChevronRight size={14} className="shrink-0" style={{ color: p.dim }} />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
