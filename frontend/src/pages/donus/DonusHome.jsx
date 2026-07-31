import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Check, Lock, Mail, Feather } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLang } from '../../contexts/LangContext';
import { useTx } from '../../i18n';
import { donusPalette, PHASE_COLORS, TEMEL_COLORS, alpha } from '../../donus/palette';
import {
  getReturnDay, getTodayLesson, getTodayPhase, getReadDays, isDayRead,
  getMercyStreak, getLessonProgress, getReturnBadges, RETURN_PHASES, LAST_DAY,
  getLetter, canOpenLetter,
} from '../../services/returnEngine';
import { getTemelList, TEMEL_GRUPLARI } from '../../data/donusTemeller';
import Kandil from '../../components/donus/Kandil';

// 🕯️ DÖNÜŞ ODASI — giriş ekranı ("oda")
//
// Buraya giren kişi listeye değil, bir MEKÂNA girmelidir. Bu yüzden:
//   · her bölümün kendi rengi var, kırk gün tek renkte geçmiyor
//   · kartlar sırayla süzülerek geliyor (kademeli giriş)
//   · kırk günlük yay bir halka olarak nefes alıyor
//   · Temeller rafı renkli kartlarla ayrı bir dünya gibi duruyor
//
// Renkler temadan türer (bkz. donus/palette.js) — ana menüden tema
// değiştirildiğinde burası da değişir.

const stagger = (i) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.05 + i * 0.055, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
});

export default function DonusHome() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const tt = useTx();
  const navigate = useNavigate();

  const day = Math.min(getReturnDay(), LAST_DAY);
  const beyond = getReturnDay() > LAST_DAY;
  const phase = getTodayPhase(day);
  const p = donusPalette(theme, PHASE_COLORS[phase.id]);
  const lesson = getTodayLesson(lang, day);
  const read = getReadDays();
  const prog = getLessonProgress();
  const mercy = getMercyStreak();
  const badges = useMemo(() => getReturnBadges(), []);
  const earned = badges.filter(b => b.earned);
  const todayRead = isDayRead(day);
  const temeller = useMemo(() => getTemelList(lang), [lang]);
  const letter = getLetter();
  const letterReady = canOpenLetter();

  return (
    <div className="px-5 pt-5">
      {/* ── Karşılama + yay ── */}
      <motion.div {...stagger(0)} className="flex items-center gap-4 mb-6">
        <Kandil p={p} read={prog.read} total={LAST_DAY} day={day} />
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: p.accent }}>
            {phase.emoji} {tt(phase.name)}
          </p>
          <h1 className="text-[21px] font-black leading-tight mt-1"
            style={{ fontFamily: 'Playfair Display, serif', color: p.text }}>
            {beyond ? tt('Yol artık senin') : tt('Bugün buradasın')}
          </h1>
          <p className="text-[10.5px] mt-1.5 leading-snug" style={{ color: p.dim }}>
            {mercy.streak > 0
              ? `${mercy.streak} ${tt('gündür yoldasın')} · ${mercy.mercy} ${tt('şefkat hakkın var')}`
              : tt('İlk adım bugün. Tek ders yeter.')}
          </p>
        </div>
      </motion.div>

      {/* ── BUGÜNÜN DERSİ ── */}
      {!beyond && (
        <motion.button {...stagger(1)} whileTap={{ scale: 0.985 }}
          onClick={() => navigate('/donus/gun')}
          className="w-full text-left rounded-3xl p-5 relative overflow-hidden mb-4"
          style={{ background: p.cardStrong, border: `1.5px solid ${p.border}`, boxShadow: p.shadow }}>
          {/* Kart içi ışık hareketi */}
          <motion.div className="absolute inset-0 pointer-events-none"
            animate={{ x: ['-120%', '160%'] }}
            transition={{ duration: 4.2, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }}
            style={{ background: `linear-gradient(105deg, transparent 40%, ${alpha(p.accentGlow, 0.16)} 50%, transparent 60%)` }} />

          <div className="flex items-center gap-2 mb-2 relative">
            <span className="text-[9px] font-black uppercase tracking-[0.22em] px-2.5 py-1 rounded-full"
              style={{ background: alpha(p.accent, 0.18), color: p.accent }}>
              {day}. {tt('Gün')}
            </span>
            {todayRead && (
              <span className="flex items-center gap-1 text-[9px] font-black" style={{ color: p.accent }}>
                <Check size={11} strokeWidth={3} /> {tt('Okundu')}
              </span>
            )}
          </div>

          <motion.p className="text-3xl mb-2 relative"
            animate={{ y: [0, -5, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: `drop-shadow(0 0 12px ${alpha(p.accentGlow, 0.6)})` }}>
            {phase.emoji}
          </motion.p>

          <p className="text-[19px] font-black leading-tight relative"
            dir={lang === 'ar' ? 'ltr' : undefined}
            style={{ fontFamily: 'Playfair Display, serif', color: p.text, textAlign: lang === 'ar' ? 'left' : undefined }}>
            {lesson.title}
          </p>
          <p className="text-[12px] mt-1.5 italic relative" dir={lang === 'ar' ? 'ltr' : undefined}
            style={{ color: p.accent, textAlign: lang === 'ar' ? 'left' : undefined }}>
            {lesson.lead}
          </p>
          <p className="text-[11.5px] font-black mt-4 flex items-center gap-1 relative" style={{ color: p.accent }}>
            {tt('Dersi aç')} <ChevronRight size={13} />
          </p>
        </motion.button>
      )}

      {beyond && (
        <motion.div {...stagger(1)} className="rounded-3xl p-6 text-center mb-4"
          style={{ background: p.cardStrong, border: `1.5px solid ${p.border}`, boxShadow: p.shadow }}>
          <motion.span className="text-5xl block mb-3"
            animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 4, repeat: Infinity }}>🌳</motion.span>
          <p className="text-lg font-black" style={{ fontFamily: 'Playfair Display, serif', color: p.text }}>
            {tt('Kırk gün tamamlandı')}
          </p>
          <p className="text-[11.5px] mt-2 leading-relaxed" style={{ color: p.dim }}>
            {tt('Bu oda hep açık kalacak. İstediğin günü tekrar okuyabilirsin.')}
          </p>
        </motion.div>
      )}

      {/* ── EMANET — kendine mektup ── */}
      <motion.button {...stagger(2)} whileTap={{ scale: 0.985 }}
        onClick={() => navigate('/donus/emanet')}
        className="w-full text-left rounded-2xl p-4 flex items-center gap-3.5 relative overflow-hidden mb-1"
        style={{
          background: letterReady ? p.cardStrong : p.card,
          border: `1.5px solid ${letterReady ? p.border : p.borderSoft}`,
          boxShadow: letterReady ? p.shadow : 'none',
        }}>
        <motion.span className="text-2xl shrink-0"
          animate={letterReady ? { rotate: [0, -8, 8, 0], scale: [1, 1.12, 1] } : { rotate: [0, -3, 3, 0] }}
          transition={{ duration: letterReady ? 2.2 : 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 10px ${alpha(p.accentGlow, letterReady ? 0.75 : 0.35)})` }}>
          ✉️
        </motion.span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-black" style={{ color: p.text }}>{tt('Emanet')}</p>
          <p className="text-[10px] mt-0.5 leading-snug" style={{ color: p.dim }}>
            {!letter?.text
              ? tt('Kendine bir mektup bırak — kırkıncı gün açılsın')
              : letter.openedAt
                ? tt('Mektubunu okudun')
                : letterReady
                  ? tt('Mektubun açılmaya hazır')
                  : tt('Mektubun mühürlü bekliyor')}
          </p>
        </div>
        <span className="shrink-0" style={{ color: p.accent }}>
          {!letter?.text ? <Feather size={15} /> : letterReady ? <Mail size={15} /> : <Lock size={14} />}
        </span>
      </motion.button>

      {/* ── BEŞ BÖLÜM ── */}
      <motion.p {...stagger(2)} className="text-[10px] font-black uppercase tracking-[0.24em] mb-2.5 mt-7"
        style={{ color: p.dim }}>
        {tt('Yolun bölümleri')}
      </motion.p>
      <div className="grid grid-cols-1 gap-2.5">
        {RETURN_PHASES.map((ph, i) => {
          const pp = donusPalette(theme, PHASE_COLORS[ph.id]);
          const days = ph.to - ph.from + 1;
          const doneN = read.filter(d => d >= ph.from && d <= ph.to).length;
          const open = day >= ph.from;
          const here = day >= ph.from && day <= ph.to;
          return (
            <motion.button key={ph.id} {...stagger(3 + i)} whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/donus/bolum/${ph.id}`)}
              className="w-full rounded-2xl p-3.5 flex items-center gap-3 text-left relative overflow-hidden"
              style={{
                background: here ? pp.cardStrong : pp.card,
                border: `1.5px solid ${here ? pp.border : pp.borderSoft}`,
                opacity: open ? 1 : 0.55,
                boxShadow: here ? pp.shadow : 'none',
              }}>
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: alpha(pp.accent, 0.16),
                  border: `1.5px solid ${alpha(pp.accent, 0.35)}`,
                  filter: here ? `drop-shadow(0 0 10px ${alpha(pp.accentGlow, 0.6)})` : 'none',
                }}>
                {open ? ph.emoji : <Lock size={15} style={{ color: pp.dim }} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-black" style={{ color: pp.text }}>{tt(ph.name)}</p>
                <p className="text-[10px] mt-0.5 truncate" style={{ color: pp.dim }}>{tt(ph.desc)}</p>
                <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: alpha(pp.accent, 0.14) }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${(doneN / days) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.06 }}
                    style={{ background: pp.accent }} />
                </div>
              </div>
              <span className="text-[10px] font-black tabular-nums shrink-0" style={{ color: pp.accent }}>
                {doneN}/{days}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ── TEMELLER ── */}
      <motion.div {...stagger(9)} className="mt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] mb-1" style={{ color: p.dim }}>
          {tt('Temeller')}
        </p>
        <p className="text-[11px] mb-3 leading-snug" style={{ color: p.dim }}>
          {temeller.length} {tt('modül · sırası yok, her an açılır: namaz, abdest, oruç, zekât, siyer ve merak ettiklerin.')}
        </p>
        {TEMEL_GRUPLARI.map((grp, gi) => {
          const list = temeller.filter(t => t.group === grp.id);
          if (!list.length) return null;
          return (
            <div key={grp.id} className={gi ? 'mt-5' : ''}>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-[11px] font-black" style={{ color: p.text }}>
                  {grp.emoji} {tt(grp.name)}
                </p>
                <p className="text-[9.5px] truncate" style={{ color: p.dim }}>{tt(grp.desc)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {list.map((t, i) => {
                  const tp = donusPalette(theme, TEMEL_COLORS[t.color]);
                  return (
                    <motion.button key={t.id}
                      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ delay: i * 0.05, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/donus/temeller/${t.id}`)}
                      className="rounded-2xl p-3.5 text-left relative overflow-hidden"
                      style={{ background: tp.cardStrong, border: `1.5px solid ${tp.borderSoft}` }}>
                      <motion.span className="text-2xl block mb-1.5"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 3 + (i % 4) * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ filter: `drop-shadow(0 0 8px ${alpha(tp.accentGlow, 0.5)})` }}>
                        {t.icon}
                      </motion.span>
                      <p className="text-[12px] font-black leading-tight" style={{ color: tp.text }}>{t.title}</p>
                      <p className="text-[9.5px] mt-1 leading-snug" style={{ color: tp.dim }}>{t.lead}</p>
                      <p className="text-[9px] font-black mt-2" style={{ color: tp.accent }}>
                        {t.minutes} {tt('dk')} · {t.items.length} {tt('adım')}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ── ROZETLER ── */}
      <motion.div {...stagger(19)} className="mt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] mb-2.5" style={{ color: p.dim }}>
          {tt('Rozetlerin')} · {earned.length}/{badges.length}
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {badges.map((b, i) => (
            <motion.div key={b.id} {...stagger(20 + i)}
              title={`${tt(b.name)} — ${tt(b.desc)}`}
              className="shrink-0 w-[76px] rounded-2xl py-3 px-1.5 text-center"
              style={{
                background: b.earned ? alpha(p.accent, 0.13) : p.card,
                border: `1px solid ${b.earned ? p.border : p.borderSoft}`,
                filter: b.earned ? 'none' : 'grayscale(1) opacity(0.45)',
              }}>
              <span className="text-xl block"
                style={b.earned ? { filter: `drop-shadow(0 0 8px ${alpha(p.accentGlow, 0.6)})` } : undefined}>
                {b.emoji}
              </span>
              <p className="text-[8px] font-black mt-1 leading-tight"
                style={{ color: b.earned ? p.accent : p.dim }}>{tt(b.name)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
