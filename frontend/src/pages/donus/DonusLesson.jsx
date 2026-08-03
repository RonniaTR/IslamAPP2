import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLang } from '../../contexts/LangContext';
import { useTx } from '../../i18n';
import { donusPalette, PHASE_COLORS, alpha } from '../../donus/palette';
import { getReturnDay, isDayRead, markDayRead, LAST_DAY } from '../../services/returnEngine';
import { getDayContent, getPhase } from '../../data/returnPath';

// 🕯️ GÜNÜN DERSİ — Dönüş Odası'nın okuma ekranı.
//
// Rota: /donus/gun · /donus/gun/:day
// İleri günler kilitli: müfredat okunacak bir kitap değil, yürünecek yol.
// Renk o günün BÖLÜMÜNDEN gelir; ders ilerledikçe oda rengi değişir.

const rise = (i) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.06 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
});

export default function DonusLesson() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const tt = useTx();
  const navigate = useNavigate();
  const { day: dayParam } = useParams();
  const [, force] = useState(0);
  const [burst, setBurst] = useState(false);

  const maxOpen = Math.min(getReturnDay(), LAST_DAY);
  const req = dayParam ? parseInt(dayParam, 10) : maxOpen;
  const day = Math.min(Math.max(1, Number.isFinite(req) ? req : maxOpen), maxOpen);

  const lesson = useMemo(() => getDayContent(day, lang), [day, lang]);
  const phase = useMemo(() => getPhase(day), [day]);
  const p = donusPalette(theme, PHASE_COLORS[phase.id]);
  const done = isDayRead(day);

  // Ders metni Arapça'ya çevrilmedi; Arapça arayüzde İngilizce'ye düşer.
  // RTL sayfada LTR metin ters hizalanır — blokları açıkça soldan sağa alıyoruz.
  const ltr = lang === 'ar';
  const dirProps = ltr ? { dir: 'ltr' } : {};
  const dirStyle = ltr ? { textAlign: 'left' } : {};

  useEffect(() => { window.scrollTo(0, 0); }, [day]);

  const complete = useCallback(() => {
    markDayRead(day);
    setBurst(true);
    setTimeout(() => setBurst(false), 1600);
    force(x => x + 1);
  }, [day]);

  return (
    <div className="px-5 pt-4">
      {/* ── Gün başlığı ── */}
      <motion.div {...rise(0)} className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => navigate('/donus')}
            className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }} aria-label={tt('Geri')}>
            <ArrowLeft size={15} style={{ color: p.accent }} />
          </button>
          <span className="text-[9px] font-black uppercase tracking-[0.24em] px-2.5 py-1 rounded-full"
            style={{ background: alpha(p.accent, 0.16), color: p.accent }}>
            {phase.emoji} {tt(phase.name)}
          </span>
          <span className="text-[10px] font-black ml-auto tabular-nums" style={{ color: p.dim }}>
            {day}/{LAST_DAY}
          </span>
        </div>

        <motion.span className="text-4xl block mb-3"
          animate={{ y: [0, -6, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 14px ${alpha(p.accentGlow, 0.6)})` }}>
          {phase.emoji}
        </motion.span>

        <h1 className="text-[26px] font-black leading-tight" {...dirProps}
          style={{ fontFamily: 'Playfair Display, serif', color: p.text, ...dirStyle }}>
          {lesson.title}
        </h1>
        <p className="text-[12.5px] mt-2 italic" {...dirProps} style={{ color: p.accent, ...dirStyle }}>
          {lesson.lead}
        </p>
      </motion.div>

      {/* ── Okuma ── */}
      <motion.div {...rise(1)} className="rounded-3xl p-5 space-y-4 mb-4"
        style={{ background: p.card, border: `1px solid ${p.borderSoft}`, backdropFilter: 'blur(8px)' }}>
        {lesson.reading.map((par, i) => (
          <p key={i} className="text-[14px] leading-[1.9]" {...dirProps}
            style={{ color: p.text, opacity: 0.92, ...dirStyle }}>{par}</p>
        ))}
      </motion.div>

      {/* ── Kaynak ── */}
      <motion.div {...rise(2)} className="rounded-3xl p-5 mb-4 relative overflow-hidden"
        style={{ background: p.cardStrong, border: `1.5px solid ${p.border}`, boxShadow: p.shadow }}>
        <span className="absolute -top-5 -right-3 text-6xl select-none pointer-events-none"
          style={{ color: p.accent, opacity: 0.14, fontFamily: 'Georgia, serif' }} aria-hidden>”</span>
        <p className="text-[9px] font-black uppercase tracking-[0.26em] mb-2.5" style={{ color: p.accent }}>
          {tt('Günün kaynağı')}
        </p>
        <p className="text-[14.5px] italic leading-[1.85] relative" {...dirProps}
          style={{ fontFamily: 'Georgia, serif', color: p.text, ...dirStyle }}>
          {lesson.source.text}
        </p>
        <p className="text-[10.5px] mt-3 font-black" {...dirProps} style={{ color: p.accent, ...dirStyle }}>
          — {lesson.source.ref}
        </p>
      </motion.div>

      {/* ── Dua ── */}
      <motion.div {...rise(3)} className="rounded-3xl p-5 text-center mb-4"
        style={{ background: p.card, border: `1px solid ${p.border}` }}>
        <p className="text-[9px] font-black uppercase tracking-[0.26em] mb-3" style={{ color: p.accent }}>
          {tt('🤲 Günün Duası')}
        </p>
        <motion.p dir="rtl" lang="ar" className="text-[22px] leading-[2.15]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.9 }}
          style={{
            fontFamily: "'Amiri', 'Scheherazade New', serif", color: p.accent,
            textShadow: `0 0 22px ${alpha(p.accentGlow, 0.35)}`,
          }}>
          {lesson.dua.ar}
        </motion.p>
        <p className="text-[12.5px] italic mt-3 leading-relaxed" {...dirProps}
          style={{ fontFamily: 'Georgia, serif', color: p.text, opacity: 0.88, textAlign: 'center' }}>
          {lesson.dua.tr}
        </p>
        <p className="text-[9.5px] mt-2 font-bold" {...dirProps} style={{ color: p.dim, textAlign: 'center' }}>
          — {lesson.dua.ref}
        </p>
      </motion.div>

      {/* ── Bugünün adımı ── */}
      <motion.div {...rise(4)} className="rounded-3xl p-5 mb-4 relative overflow-hidden"
        style={{ background: alpha(p.accent, p.isLight ? 0.1 : 0.14), border: `1.5px solid ${p.border}` }}>
        <div className="flex items-center gap-2 mb-2">
          <motion.span className="text-lg"
            animate={{ x: [0, 4, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>👣</motion.span>
          <p className="text-[9px] font-black uppercase tracking-[0.26em]" style={{ color: p.accent }}>
            {tt('Bugünün adımı')}
          </p>
        </div>
        <p className="text-[16px] font-black" {...dirProps} style={{ color: p.text, ...dirStyle }}>
          {lesson.step.title}
        </p>
        <p className="text-[12.5px] mt-1.5 leading-relaxed" {...dirProps}
          style={{ color: p.text, opacity: 0.8, ...dirStyle }}>{lesson.step.desc}</p>
      </motion.div>

      {/* ── Akşam sorusu ── */}
      <motion.div {...rise(5)} className="rounded-3xl p-4 flex items-start gap-3 mb-5"
        style={{ background: p.card, border: `1px solid ${p.borderSoft}` }}>
        <span className="text-xl shrink-0">💭</span>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: p.dim }}>
            {tt('Akşama bırak')}
          </p>
          <p className="text-[13px] font-bold mt-1 leading-snug" {...dirProps}
            style={{ color: p.text, ...dirStyle }}>{lesson.question}</p>
          <button onClick={() => navigate('/journal')}
            className="text-[10.5px] font-black mt-2 flex items-center gap-1" style={{ color: p.accent }}>
            {tt('Amel Defteri’ne yaz')} <ArrowRight size={11} />
          </button>
        </div>
      </motion.div>

      {/* ── Tamamla ── */}
      <div className="relative">
        <AnimatePresence>
          {burst && (
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: 14 }, (_, i) => (
                <motion.span key={i} className="absolute rounded-full"
                  style={{ width: 6, height: 6, background: p.accentGlow }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i / 14) * Math.PI * 2) * 110,
                    y: Math.sin((i / 14) * Math.PI * 2) * 70,
                    opacity: 0, scale: 0.4,
                  }}
                  transition={{ duration: 1.1, ease: 'easeOut' }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {done ? (
          <motion.div {...rise(6)} className="rounded-2xl p-4 flex items-center justify-center gap-2"
            style={{ background: alpha(p.accent, 0.14), border: `1px solid ${p.border}` }}>
            <Check size={15} style={{ color: p.accent }} strokeWidth={3} />
            <span className="text-[12.5px] font-black" style={{ color: p.accent }}>
              {tt('Bu ders tamamlandı')}
            </span>
          </motion.div>
        ) : (
          <motion.button {...rise(6)} whileTap={{ scale: 0.97 }} onClick={complete}
            className="w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${p.accent}, ${p.accentGlow})`,
              color: p.onAccent, boxShadow: p.shadow,
            }}>
            <Sparkles size={16} /> {tt('Dersi tamamladım')}
          </motion.button>
        )}
      </div>

      {/* ── Gün gezinmesi ── */}
      <div className="flex items-center justify-between mt-3">
        <button onClick={() => navigate(`/donus/gun/${day - 1}`)} disabled={day <= 1}
          className="text-[11px] font-black flex items-center gap-1 py-2 px-3 rounded-xl disabled:opacity-30"
          style={{ color: p.dim }}>
          <ArrowLeft size={12} /> {tt('Önceki gün')}
        </button>
        {day < maxOpen ? (
          <button onClick={() => navigate(`/donus/gun/${day + 1}`)}
            className="text-[11px] font-black flex items-center gap-1 py-2 px-3 rounded-xl" style={{ color: p.accent }}>
            {tt('Sonraki gün')} <ArrowRight size={12} />
          </button>
        ) : (
          <span className="text-[10.5px] font-bold flex items-center gap-1 py-2 px-3" style={{ color: alpha(p.dim, 0.7) }}>
            <Lock size={11} /> {day >= LAST_DAY ? tt('Yol tamamlandı') : tt('Yarın açılır')}
          </span>
        )}
      </div>
    </div>
  );
}
