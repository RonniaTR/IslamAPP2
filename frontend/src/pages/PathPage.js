import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, RefreshCw, Sparkles, Star, Medal, Share2, Map, ScrollText, Sun, Gem } from 'lucide-react';
import { HazineCards } from './HazinePage';
import { useAuth } from '../contexts/AuthContext';
import { useTx } from '../i18n';
import { useLang } from '../contexts/LangContext';
import { awardXPOnce, getCachedStats } from '../services/gamification';
import {
  ASSESSMENT, TASK_POOL, STAGES, WEEKLY_THEMES,
  getProfile, saveProfile, resetProfile,
  getTodayPlan, isTaskDone, toggleTask, getHistory, getStreak, getStage, syncHistory, todayKey,
  getWeekTheme, getDailyQuote, getDailyDua, getBadges, checkStageCelebration,
  getEvents, detectNewEvents,
} from '../services/pathEngine';
import {
  isReturnMode, reconcile, creditToday, getMercyStreak, getReturnStage,
  getReturnDay, getArcProgress, RETURN_STAGES, ARC_DAYS,
} from '../services/returnEngine';
import ReturnIntro from '../components/ReturnIntro';
import Confetti from './games/Confetti';

// Karşılama bir kez gösterilir; yeniden yükleme onu tekrar açmaz.
const INTRO_KEY = 'donus_intro_seen';

// 🛤️ NUR YOLU — uygulamanın omurgası, "Zümrüt Gece" temasıyla.
// Katmanlar: BUGÜN (kişisel plan + hedef ikonları + dua) · HARİTA
// (hafta hafta yılan-yol durakları, aylık ısı takvimi, mertebeler,
// rozet rafı) · GÜNLÜK (otomatik yolculuk günlüğü + paylaşım).

const NUR = {
  bg: 'linear-gradient(180deg, #03130B 0%, #06231A 40%, #0A3524 100%)',
  bgSolid: '#06231A',
  surface: 'rgba(13, 51, 36, 0.75)',
  gold: '#E8C56C',
  green: '#34D399',
  text: '#EAF5EE',
  dim: '#93B8A6',
  border: 'rgba(232, 197, 108, 0.2)',
  borderSoft: 'rgba(147, 184, 166, 0.15)',
};

function Skyline() {
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden>
      <svg viewBox="0 0 400 60" className="w-full" preserveAspectRatio="none" style={{ height: 54, opacity: 0.22 }}>
        <path d="M0,60 L0,48 L28,48 L28,20 L32,14 L36,20 L36,48 L70,48 L70,38
                 Q100,10 130,38 L130,48 L160,48 L160,26 L163,20 L166,26 L166,48
                 L200,48 L200,34 Q225,12 250,34 L250,48 L285,48 L285,16 L288,10 L291,16 L291,48
                 L330,48 L330,40 Q352,22 374,40 L374,48 L400,48 L400,60 Z"
          fill="#E8C56C" />
      </svg>
    </div>
  );
}

function Stars({ n = 20 }) {
  const stars = useMemo(() => Array.from({ length: n }, (_, i) => ({
    left: (i * 137.5) % 100, top: (i * 47.3) % 60, s: 1 + ((i * 7) % 3), d: (i % 8) * 0.7,
  })), [n]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {stars.map((s, i) => (
        <span key={i} className="absolute rounded-full" style={{
          left: `${s.left}%`, top: `${s.top}%`, width: s.s, height: s.s, background: '#E8C56C',
          animation: `nightTwinkle 4s ease-in-out ${s.d}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function PathPage() {
  const { user } = useAuth();
  const tt = useTx();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getProfile());
  const [answers, setAnswers] = useState({});
  const [qIdx, setQIdx] = useState(0);
  const [, force] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [stagePop, setStagePop] = useState(null);
  const [badgeToast, setBadgeToast] = useState(null);
  const [tab, setTab] = useState('bugun'); // bugun | harita | gunluk

  // 🕯️ Geri dönüş modu — mertebe dili, seri yorumu ve görev yükü değişir.
  const donus = isReturnMode(profile);
  const [showIntro, setShowIntro] = useState(false);

  const plan = profile ? getTodayPlan() : null;
  const doneCount = plan ? plan.tasks.filter(t => isTaskDone(plan, t)).length : 0;
  const allDone = plan && doneCount === plan.tasks.length;
  const streak = getStreak();
  const stage = donus ? getReturnStage() : getStage();
  const stageList = donus ? RETURN_STAGES : STAGES;
  const mercy = donus ? getMercyStreak() : null;
  const returnDay = donus ? getReturnDay() : 0;
  const arc = donus ? getArcProgress() : 0;
  const history = getHistory();
  const weekTheme = profile ? getWeekTheme(profile) : null;
  const quote = getDailyQuote();
  const dua = getDailyDua();
  const badges = useMemo(() => getBadges(), [doneCount, profile]); // eslint bilinçli
  const earnedCount = badges.filter(b => b.earned).length;
  const stats = getCachedStats();
  const events = useMemo(() => getEvents(), [doneCount, stagePop, badgeToast]); // eslint bilinçli

  // Sayfa arka planını Nur temasına eşitle
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = NUR.bgSolid;
    return () => { document.body.style.background = prev; };
  }, []);

  // Dönüş modu: her açılışta şefkat serisini geçmişe dönük uzlaştır ve
  // ilk girişte karşılamayı göster.
  useEffect(() => {
    if (!donus) return;
    reconcile();
    let seen = false;
    try { seen = localStorage.getItem(INTRO_KEY) === '1'; } catch { /* ignore */ }
    if (!seen) setShowIntro(true);
    force(x => x + 1);
  }, [donus]);

  // Bugün en az bir görev yapıldıysa seriyi ve şefkat kredisini işle.
  useEffect(() => {
    if (donus && doneCount > 0) creditToday();
  }, [donus, doneCount]);

  // Sekme değişince en üstten başla
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [tab]);

  // Gün XP'si + mertebe kutlaması + yeni rozet bildirimi + günlük kaydı
  useEffect(() => {
    if (plan) syncHistory(plan);
    if (allDone) {
      awardXPOnce(user, `nur_${todayKey()}`, 'worship_task', { points: 25, details: 'Nur Yolu günü tamamlandı' });
    }
    const popped = checkStageCelebration(stage, donus ? 'donus_stage_seen' : 'nur_stage_seen');
    if (popped) setStagePop(popped);
    const fresh = detectNewEvents();
    if (fresh.length) {
      setBadgeToast(fresh[0]);
      setTimeout(() => setBadgeToast(null), 4000);
    }
  }, [allDone, doneCount]); // eslint bilinçli

  const pickAnswer = useCallback((qid, oid) => {
    const next = { ...answers, [qid]: oid };
    setAnswers(next);
    if (qIdx < ASSESSMENT.length - 1) setTimeout(() => setQIdx(i => i + 1), 250);
    else {
      const p = saveProfile(next);
      setTimeout(() => { setProfile(p); setCelebrate(true); setTimeout(() => setCelebrate(false), 1800); }, 350);
    }
  }, [answers, qIdx]);

  const retake = useCallback(() => { resetProfile(); setProfile(null); setAnswers({}); setQIdx(0); }, []);

  const shareJourney = useCallback(() => {
    const text = donus
      ? `🕯️ Geri Dönüş yolculuğum:\n${stage.current.emoji} ${stage.current.name} · ☀️ ${stage.days} gün yolda · 🎖️ ${earnedCount} rozet\n\nİslami Yaşam Asistanı ile her gün küçük ama devamlı adımlar 🤲`
      : `🛤️ Nur Yolu'ndaki yolculuğum:\n${stage.current.emoji} Mertebe: ${stage.current.name} · ☀️ ${stage.days} tam gün · 🔥 ${streak} gün seri · 🎖️ ${earnedCount} rozet\n\nİslami Yaşam Asistanı ile her gün küçük ama devamlı adımlar 🤲`;
    if (navigator.share) navigator.share({ title: donus ? 'Geri Dönüş' : 'Nur Yolu', text }).catch(() => {});
    else { navigator.clipboard?.writeText(text).catch(() => {}); }
  }, [donus, stage, streak, earnedCount]);

  // ═══════════ DEĞERLENDİRME ═══════════
  if (!profile) {
    const q = ASSESSMENT[qIdx];
    return (
      <div className="min-h-screen pb-24 relative" style={{ background: NUR.bg }}>
        <Stars n={26} />
        <div className="px-6 pt-10 text-center relative max-w-xl mx-auto">
          <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl mb-3">🕌</motion.p>
          <h1 className="text-3xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: NUR.gold }}>{tt('Nur Yolu')}</h1>
          <p className="text-xs mt-2 leading-relaxed" style={{ color: NUR.dim }}>
            {tt('Birkaç soruyla seni tanıyalım; her sabah sana özel, 10-30 dakikalık bir yol çizelim.')}
          </p>
          <div className="flex justify-center gap-2 mt-5">
            {ASSESSMENT.map((_, i) => (
              <span key={i} className="w-2 h-2 rounded-full transition-all"
                style={{ background: i <= qIdx ? NUR.gold : 'rgba(147,184,166,0.3)', transform: i === qIdx ? 'scale(1.4)' : 'none' }} />
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="px-6 mt-8 relative max-w-xl mx-auto">
            <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: NUR.surface, border: `1.5px solid ${NUR.border}`, backdropFilter: 'blur(8px)' }}>
              <p className="text-3xl mb-2 text-center">{q.icon}</p>
              <p className="text-base font-black text-center mb-4" style={{ color: NUR.text }}>{tt(q.q)}</p>
              <div className="space-y-2">
                {q.options.map(o => (
                  <button key={o.id} onClick={() => pickAnswer(q.id, o.id)}
                    className="w-full p-3.5 rounded-2xl text-sm font-bold text-left active:scale-98 transition-all flex items-center justify-between"
                    style={{
                      background: answers[q.id] === o.id ? 'rgba(232,197,108,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${answers[q.id] === o.id ? NUR.gold : NUR.borderSoft}`,
                      color: NUR.text,
                    }}>
                    {tt(o.label)}
                    <ChevronRight size={15} style={{ color: NUR.gold }} />
                  </button>
                ))}
              </div>
            </div>
            {qIdx > 0 && (
              <button onClick={() => setQIdx(i => i - 1)} className="mt-3 text-[11px] font-bold mx-auto block" style={{ color: NUR.dim }}>
                {tt('← Önceki soru')}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ═══════════ GERİ DÖNÜŞ KARŞILAMASI ═══════════
  if (showIntro) {
    return (
      <ReturnIntro onDone={() => {
        try { localStorage.setItem(INTRO_KEY, '1'); } catch { /* ignore */ }
        setShowIntro(false);
      }} />
    );
  }

  // ═══════════ ANA GÖRÜNÜM ═══════════
  const pct = plan ? doneCount / plan.tasks.length : 0;
  const R = 30, CIRC = 2 * Math.PI * R;
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const k = d.toISOString().slice(0, 10);
    const h = history[k];
    return { k, day: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'][d.getDay()], full: h && h.total > 0 && h.done >= h.total, some: h && h.done > 0 };
  });
  // Aylık ısı takvimi (son 28 gün, 4 hafta)
  const heat = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (27 - i));
    const k = d.toISOString().slice(0, 10);
    const h = history[k];
    return { k, n: d.getDate(), full: h && h.total > 0 && h.done >= h.total, some: h && h.done > 0 };
  });
  // Yılan-yol harita verisi: her satır 1 hafta (7 durak), tam günlerle ilerler
  const currentStation = stage.days + 1;
  const weekCount = Math.min(12, Math.max(Math.ceil(currentStation / 7) + 1, 4));

  return (
    <div className="min-h-screen pb-24 relative" style={{ background: NUR.bg }}>
      {celebrate && <Confetti count={30} />}

      {/* ── HERO ── */}
      <div className="relative overflow-hidden pb-2" style={{ borderBottom: `1px solid ${NUR.borderSoft}` }}>
        <Stars n={22} />
        <span className="absolute top-5 right-7 text-2xl" style={{ filter: 'drop-shadow(0 0 12px rgba(232,197,108,0.6))' }}>🌙</span>
        <div className="px-5 pt-7 relative max-w-3xl mx-auto">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.35em]" style={{ color: NUR.gold }}>
                {donus ? `🕯️ ${tt('Geri Dönüş')}` : tt('Nur Yolu')}
              </p>
              <h1 className="text-2xl font-black mt-1" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>
                {tt('Selamün Aleyküm')}{user?.name ? `, ${user.name}` : ''} 👋
              </h1>
            </div>
            <button onClick={shareJourney} className="mt-1 w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 shrink-0"
              style={{ background: 'rgba(232,197,108,0.12)', border: `1px solid ${NUR.border}` }} aria-label={tt('Yolculuğu paylaş')}>
              <Share2 size={15} style={{ color: NUR.gold }} />
            </button>
          </div>
          <div className="mt-3 mb-4 pl-3" style={{ borderLeft: `2px solid ${NUR.gold}` }}>
            <p className="text-[12.5px] italic leading-relaxed" style={{ fontFamily: 'Georgia, serif', color: `${NUR.text}dd` }}>
              "{tt(quote.text)}"
            </p>
            <p className="text-[10px] mt-1 font-bold" style={{ color: NUR.gold }}>— {tt(quote.by)}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4 relative z-10">
            {[
              donus
                ? { icon: '🕯️', value: mercy.streak, label: tt('Gündür yoldasın') }
                : { icon: '🔥', value: streak, label: tt('Günlük seri') },
              donus
                ? { icon: '🤲', value: mercy.mercy, label: tt('Şefkat hakkın') }
                : { icon: '⭐', value: stats?.total_points ?? '—', label: tt('Puanım') },
              { icon: '🎖️', value: `${earnedCount}/${badges.length}`, label: tt('Rozet') },
            ].map(s => (
              <div key={s.label} className="rounded-2xl px-3 py-2.5 flex items-center gap-2" style={{ background: NUR.surface, border: `1px solid ${NUR.borderSoft}` }}>
                <span className="text-lg">{s.icon}</span>
                <div>
                  <p className="text-sm font-black leading-none" style={{ color: NUR.text }}>{s.value}</p>
                  <p className="text-[8.5px] mt-0.5 font-bold" style={{ color: NUR.dim }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Sekmeler */}
          <div className="flex gap-1.5 mb-4 relative z-10">
            {[
              { id: 'bugun', label: tt('Bugün'), icon: Sun },
              { id: 'hazine', label: tt('Hazine'), icon: Gem },
              { id: 'harita', label: tt('Harita'), icon: Map },
              { id: 'gunluk', label: tt('Günlük'), icon: ScrollText },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex-1 py-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                style={tab === t.id
                  ? { background: NUR.gold, color: '#03130B' }
                  : { background: NUR.surface, border: `1px solid ${NUR.borderSoft}`, color: NUR.dim }}>
                <t.icon size={13} /> {t.label}
              </button>
            ))}
          </div>
        </div>
        <Skyline />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* ════════ SEKME: BUGÜN ════════ */}
        {tab === 'bugun' && (
          <>
            {/* ── DÖNÜŞ YAYI: kırk günlük yolculuk + şefkat açıklaması ── */}
            {donus && (
              <div className="px-5 mt-4">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4" style={{ background: NUR.surface, border: `1.5px solid ${NUR.border}` }}>
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-black" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>
                      🕯️ {tt('Kırk Günlük Yol')}
                    </p>
                    <p className="text-[10px] font-black" style={{ color: NUR.gold }}>
                      {Math.min(returnDay, ARC_DAYS)}/{ARC_DAYS}
                    </p>
                  </div>
                  <div className="h-2 rounded-full mt-2.5 overflow-hidden" style={{ background: 'rgba(3,19,11,0.55)', border: `1px solid ${NUR.borderSoft}` }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(arc * 100, 4)}%` }} transition={{ duration: 0.8 }}
                      className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${NUR.green}, ${NUR.gold})` }} />
                  </div>
                  <p className="text-[10.5px] mt-2.5 leading-relaxed" style={{ color: NUR.dim }}>
                    {mercy.streak > 0
                      ? `${mercy.streak} ${tt('gündür yoldasın')} · ${mercy.mercy} ${tt('şefkat hakkın var')}`
                      : tt('Bugün ilk adımın. Tek görev yeter — devamlılık, çokluktan hayırlıdır.')}
                  </p>
                  <p className="text-[9.5px] mt-1.5 leading-relaxed" style={{ color: `${NUR.dim}b0` }}>
                    {tt('Bir gün gelemezsen serin sıfırlanmaz; bir şefkat hakkı harcanır. Gelen her gün onu geri kazandırır.')}
                  </p>
                </motion.div>
              </div>
            )}

            {weekTheme && (
              <div className="px-5 mt-4">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 relative overflow-hidden"
                  style={{ background: 'linear-gradient(120deg, rgba(232,197,108,0.14), rgba(13,51,36,0.6))', border: `1.5px solid ${NUR.border}` }}>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,197,108,0.15)', color: NUR.gold }}>
                    {weekTheme.weekNo}. {tt('Hafta Teması')}
                  </span>
                  <p className="text-base font-black mt-1.5" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>
                    {weekTheme.emoji} {tt(weekTheme.title)}
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: NUR.dim }}>{tt(weekTheme.desc)}</p>
                  <p className="text-[11.5px] italic mt-2 leading-relaxed" style={{ fontFamily: 'Georgia, serif', color: `${NUR.text}cc` }}>
                    {tt(weekTheme.verse)} <span className="not-italic font-bold" style={{ color: NUR.gold }}>· {tt(weekTheme.source)}</span>
                  </p>
                  {TASK_POOL[weekTheme.focus] && (
                    <p className="text-[10px] mt-2 font-bold" style={{ color: NUR.green }}>
                      ⭐ {tt('Haftanın yıldız görevi:')} {TASK_POOL[weekTheme.focus].icon} {tt(TASK_POOL[weekTheme.focus].title)}
                    </p>
                  )}
                </motion.div>
              </div>
            )}

            {/* Bugünün Yolu */}
            <div className="px-5 mt-4">
              <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: NUR.surface, border: `1.5px solid ${NUR.border}` }}>
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
                    <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90">
                      <circle cx="38" cy="38" r={R} fill="none" stroke="rgba(232,197,108,0.15)" strokeWidth="7" />
                      <circle cx="38" cy="38" r={R} fill="none" stroke={allDone ? NUR.green : NUR.gold} strokeWidth="7" strokeLinecap="round"
                        strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct)} style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-black" style={{ color: NUR.text }}>{doneCount}/{plan.tasks.length}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: NUR.gold }}>
                      {donus && plan.tasks.length === 1 ? tt('Bugünün Adımı') : tt('Bugünün Yolu')}
                    </p>
                    <p className="text-lg font-black mt-0.5" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>
                      {stage.current.emoji} {tt(stage.current.name)}
                    </p>
                    {stage.next ? (
                      <p className="text-[10px] mt-0.5" style={{ color: NUR.dim }}>
                        {stage.next.emoji} {tt(stage.next.name)} {tt('için')} {stage.days}/{stage.next.need}{' '}
                        {donus ? tt('gün yolda') : tt('tam gün')}
                      </p>
                    ) : (
                      <p className="text-[10px] mt-0.5" style={{ color: NUR.dim }}>
                        {donus
                          ? tt('Kırk günü tamamladın — yol artık senin')
                          : tt('Yolun zirvesindesin — devamlılık en büyük mertebedir')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hedef ikon dizisi */}
                <div className="flex justify-between mt-5 px-1">
                  {plan.tasks.map(tid => {
                    const t = TASK_POOL[tid];
                    if (!t) return null;
                    const done = isTaskDone(plan, tid);
                    return (
                      <button key={tid} onClick={() => navigate(t.route)} className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform" style={{ width: `${100 / plan.tasks.length}%` }}>
                        <span className="relative w-12 h-12 rounded-full flex items-center justify-center text-xl"
                          style={{
                            background: done ? 'rgba(52,211,153,0.15)' : 'rgba(232,197,108,0.08)',
                            border: `2px solid ${done ? NUR.green : NUR.borderSoft}`,
                          }}>
                          {t.icon}
                          {done && (
                            <span className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center" style={{ background: NUR.green, width: 17, height: 17 }}>
                              <Check size={11} color="#03130B" strokeWidth={3.5} />
                            </span>
                          )}
                        </span>
                        <span className="text-[8px] font-bold text-center leading-tight" style={{ color: done ? NUR.green : NUR.dim }}>
                          {tt(t.title).split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {allDone && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl p-2.5 text-center" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.35)' }}>
                    <p className="text-xs font-black" style={{ color: NUR.green }}>
                      <Sparkles size={12} className="inline mr-1" />{tt('Bugünün yolu tamamlandı · +25 XP — Allah kabul etsin 🤲')}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* 7 günlük dizilim */}
            <div className="px-5 mt-4 flex items-center justify-between">
              {last7.map((d, i) => (
                <div key={d.k} className="flex flex-col items-center gap-1">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
                    style={{
                      background: d.full ? NUR.gold : d.some ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.04)',
                      color: d.full ? '#03130B' : d.some ? NUR.green : NUR.dim,
                      border: `1.5px solid ${d.full ? NUR.gold : d.some ? 'rgba(52,211,153,0.4)' : NUR.borderSoft}`,
                    }}>
                    {d.full ? '✓' : d.some ? '·' : ''}
                  </span>
                  <span className="text-[8px] font-bold" style={{ color: i === 6 ? NUR.gold : NUR.dim }}>{d.day}</span>
                </div>
              ))}
            </div>

            {/* Görev kartları */}
            <div className="px-5 mt-5 space-y-2.5">
              {plan.tasks.map((tid, i) => {
                const t = TASK_POOL[tid];
                if (!t) return null;
                const done = isTaskDone(plan, tid);
                const isFocus = weekTheme && weekTheme.focus === tid;
                const isCuma = tid === 'cuma';
                return (
                  <motion.div key={tid} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="rounded-2xl p-3.5 flex items-center gap-3 relative overflow-hidden"
                    style={{
                      background: isCuma ? 'linear-gradient(120deg, rgba(232,197,108,0.1), rgba(13,51,36,0.75))' : NUR.surface,
                      border: `1.5px solid ${done ? 'rgba(52,211,153,0.4)' : (isFocus || isCuma) ? NUR.border : NUR.borderSoft}`,
                      opacity: done ? 0.85 : 1,
                    }}>
                    {(isFocus || isCuma) && !done && (
                      <span className="absolute top-0 right-0 text-[7px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider" style={{ background: 'rgba(232,197,108,0.2)', color: NUR.gold }}>
                        {isCuma ? `🕌 ${tt('Cuma bonusu')}` : `⭐ ${tt('Yıldız görev')}`}
                      </span>
                    )}
                    <button onClick={() => { toggleTask(tid); force(x => x + 1); }}
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                      style={{ background: done ? NUR.green : 'rgba(255,255,255,0.06)', border: done ? 'none' : `1.5px solid ${NUR.borderSoft}` }}
                      aria-label={done ? 'Geri al' : 'Tamamlandı işaretle'}>
                      {done && <Check size={15} color="#03130B" strokeWidth={3} />}
                    </button>
                    <button onClick={() => navigate(t.route)} className="flex-1 min-w-0 text-left active:opacity-70">
                      <p className="text-sm font-black flex items-center gap-1.5" style={{ color: NUR.text, textDecoration: done ? 'line-through' : 'none' }}>
                        <span>{t.icon}</span> {tt(t.title)}
                      </p>
                      <p className="text-[10px] mt-0.5 leading-snug" style={{ color: NUR.dim }}>{tt(t.desc)}</p>
                    </button>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-black flex items-center gap-0.5 justify-end" style={{ color: NUR.gold }}>
                        <Star size={9} fill={NUR.gold} /> +{t.xp}
                      </p>
                      <p className="text-[9px]" style={{ color: NUR.dim }}>{t.minutes} {tt('dk')}</p>
                    </div>
                    <ChevronRight size={14} className="shrink-0" style={{ color: NUR.dim }} />
                  </motion.div>
                );
              })}
            </div>

            {/* Günün duası */}
            <div className="px-5 mt-6">
              <div className="rounded-2xl p-4 text-center relative overflow-hidden" style={{ background: NUR.surface, border: `1.5px solid ${NUR.border}` }}>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: NUR.gold }}>{tt('🤲 Günün Duası')}</p>
                <p dir="rtl" className="text-xl leading-loose" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: NUR.gold }}>{dua.ar}</p>
                {lang !== 'ar' && (
                  <p className="text-[12px] italic mt-2 leading-relaxed" style={{ fontFamily: 'Georgia, serif', color: `${NUR.text}dd` }}>"{tt(dua.tr)}"</p>
                )}
                <p className="text-[9.5px] mt-1.5 font-bold" style={{ color: NUR.dim }}>— {tt(dua.source)}</p>
              </div>
            </div>

            <div className="px-5 mt-6">
              <button onClick={retake} className="flex items-center gap-1.5 text-[11px] font-bold mx-auto" style={{ color: NUR.dim }}>
                <RefreshCw size={12} /> {tt('Değerlendirmeyi yenile — yol seviyene göre yeniden çizilir')}
              </button>
            </div>
          </>
        )}

        {/* ════════ SEKME: HAZİNE ════════ */}
        {tab === 'hazine' && (
          <div className="px-5 mt-4">
            <p className="text-sm font-black mb-1" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>{tt('💛 Nur Hazinesi')}</p>
            <p className="text-[10px] mb-4" style={{ color: NUR.dim }}>
              {tt('Yolun azığı: dualar, tesbihat, kıssalar, tarih ve mucizeler — kartı seç, hazine açılsın.')}
            </p>
            <HazineCards navigate={navigate} compact />
          </div>
        )}

        {/* ════════ SEKME: HARİTA ════════ */}
        {tab === 'harita' && (
          <>
            {/* Yılan-yol durakları: her satır 1 hafta */}
            <div className="px-5 mt-4">
              <p className="text-sm font-black mb-1" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>{tt('🗺️ Yol Durakları')}</p>
              <p className="text-[10px] mb-3" style={{ color: NUR.dim }}>
                {donus ? tt('Yolda geçen her gün bir durak ilerletir. Şu an') : tt('Her tam gün bir durak ilerletir. Şu an')}{' '}
                <span style={{ color: NUR.gold }}>#{currentStation}</span> — {tt('her satır bir haftalık temadır')}.
              </p>
              <div className="space-y-3">
                {Array.from({ length: weekCount }, (_, w) => {
                  const theme = WEEKLY_THEMES[w % WEEKLY_THEMES.length];
                  const reverse = w % 2 === 1;
                  return (
                    <div key={w} className="rounded-2xl p-3" style={{ background: NUR.surface, border: `1px solid ${NUR.borderSoft}` }}>
                      <p className="text-[9px] font-black uppercase tracking-wider mb-2" style={{ color: NUR.gold }}>
                        {theme.emoji} {w + 1}. {tt('Hafta Teması').split(' ')[0]} · {tt(theme.title)}
                      </p>
                      <div className={`flex items-center justify-between ${reverse ? 'flex-row-reverse' : ''}`}>
                        {Array.from({ length: 7 }, (_, d) => {
                          const station = w * 7 + d + 1;
                          const done = station <= stage.days;
                          const current = station === currentStation;
                          return (
                            <motion.span key={station}
                              animate={current ? { scale: [1, 1.12, 1] } : {}}
                              transition={current ? { duration: 1.6, repeat: Infinity } : {}}
                              className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black relative"
                              style={{
                                background: done ? NUR.gold : current ? 'rgba(232,197,108,0.15)' : 'rgba(255,255,255,0.04)',
                                color: done ? '#03130B' : current ? NUR.gold : NUR.dim,
                                border: `2px solid ${done ? NUR.gold : current ? NUR.gold : NUR.borderSoft}`,
                                boxShadow: current ? '0 0 14px rgba(232,197,108,0.5)' : 'none',
                              }}>
                              {done ? '✓' : station}
                              {current && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[6.5px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap" style={{ background: NUR.gold, color: '#03130B' }}>
                                  {tt('SEN')}
                                </span>
                              )}
                            </motion.span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aylık ısı takvimi */}
            <div className="px-5 mt-6">
              <p className="text-sm font-black mb-2.5" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>{tt('📆 Son 4 Hafta')}</p>
              <div className="rounded-2xl p-3.5" style={{ background: NUR.surface, border: `1px solid ${NUR.borderSoft}` }}>
                <div className="grid grid-cols-7 gap-1.5">
                  {heat.map(d => (
                    <div key={d.k} title={d.k} className="aspect-square rounded-lg flex items-center justify-center text-[8px] font-bold"
                      style={{
                        background: d.full ? NUR.gold : d.some ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.04)',
                        color: d.full ? '#03130B' : d.some ? '#03130B' : NUR.dim,
                        border: `1px solid ${d.full ? NUR.gold : d.some ? 'rgba(52,211,153,0.4)' : NUR.borderSoft}`,
                      }}>
                      {d.n}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2.5 justify-end">
                  <span className="flex items-center gap-1 text-[8px] font-bold" style={{ color: NUR.dim }}>
                    <span className="w-2.5 h-2.5 rounded" style={{ background: NUR.gold }} /> {tt('Tam gün')}
                  </span>
                  <span className="flex items-center gap-1 text-[8px] font-bold" style={{ color: NUR.dim }}>
                    <span className="w-2.5 h-2.5 rounded" style={{ background: 'rgba(52,211,153,0.5)' }} /> {tt('Kısmi')}
                  </span>
                </div>
              </div>
            </div>

            {/* Mertebe yolu */}
            <div className="px-5 mt-6">
              <p className="text-sm font-black mb-3" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>{tt('🏔️ Mertebeler')}</p>
              <div className="relative">
                <div className="absolute left-0 right-0 h-0.5 top-[38px]" style={{ background: `linear-gradient(90deg, ${NUR.gold}, rgba(232,197,108,0.1))` }} />
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 relative">
                  {stageList.map(s => {
                    const reached = stage.days >= s.need;
                    const isCurrent = stage.current.id === s.id;
                    return (
                      <div key={s.id} className="shrink-0 w-[100px] rounded-2xl p-3 text-center relative"
                        style={{
                          background: isCurrent ? 'rgba(232,197,108,0.12)' : NUR.surface,
                          border: `1.5px solid ${isCurrent ? NUR.gold : reached ? 'rgba(52,211,153,0.4)' : NUR.borderSoft}`,
                          opacity: reached || isCurrent ? 1 : 0.55,
                        }}>
                        <p className="text-2xl" style={isCurrent ? { filter: 'drop-shadow(0 0 10px rgba(232,197,108,0.7))' } : undefined}>{s.emoji}</p>
                        <p className="text-[11px] font-black mt-1" style={{ color: NUR.text }}>{tt(s.name)}</p>
                        <p className="text-[8px]" style={{ color: NUR.dim }}>{tt(s.desc)}</p>
                        {reached && !isCurrent && <span className="absolute top-1.5 right-1.5 text-[9px]" style={{ color: NUR.green }}>✓</span>}
                        {isCurrent && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] font-black px-1.5 py-0.5 rounded-full" style={{ background: NUR.gold, color: '#03130B' }}>{tt('BURADASIN')}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Rozet rafı */}
            <div className="px-5 mt-6">
              <p className="text-sm font-black mb-3 flex items-center gap-1.5" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>
                <Medal size={15} style={{ color: NUR.gold }} /> {tt('Rozetlerin')} · {earnedCount}/{badges.length}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {badges.map(b => (
                  <div key={b.id} title={`${b.name} — ${b.desc}`} className="rounded-2xl py-2.5 px-1 text-center"
                    style={{
                      background: b.earned ? 'rgba(232,197,108,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${b.earned ? NUR.border : NUR.borderSoft}`,
                      filter: b.earned ? 'none' : 'grayscale(1) opacity(0.45)',
                    }}>
                    <p className="text-xl" style={b.earned ? { filter: 'drop-shadow(0 0 8px rgba(232,197,108,0.5))' } : undefined}>{b.emoji}</p>
                    <p className="text-[7.5px] font-black mt-1 leading-tight" style={{ color: b.earned ? NUR.gold : NUR.dim }}>{tt(b.name)}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ════════ SEKME: GÜNLÜK ════════ */}
        {tab === 'gunluk' && (
          <div className="px-5 mt-4">
            <p className="text-sm font-black mb-1" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>{tt('📜 Yolculuk Günlüğün')}</p>
            <p className="text-[10px] mb-4" style={{ color: NUR.dim }}>
              {tt('Mertebe atlamaların, rozetlerin ve tam günlerin buraya kendiliğinden yazılır.')}
            </p>
            {events.length === 0 ? (
              <div className="rounded-2xl p-6 text-center" style={{ background: NUR.surface, border: `1px solid ${NUR.borderSoft}` }}>
                <p className="text-3xl mb-2">🌰</p>
                <p className="text-xs font-bold" style={{ color: NUR.text }}>{tt('Günlük henüz boş')}</p>
                <p className="text-[10px] mt-1" style={{ color: NUR.dim }}>{tt('İlk görevini tamamla — ilk satır bugün yazılsın.')}</p>
              </div>
            ) : (
              <div className="relative pl-5">
                <div className="absolute left-[9px] top-2 bottom-2 w-0.5" style={{ background: 'linear-gradient(180deg, rgba(232,197,108,0.6), rgba(232,197,108,0.05))' }} />
                <div className="space-y-3">
                  {events.slice(0, 40).map((e, i) => (
                    <motion.div key={`${e.ts}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i, 10) * 0.04 }}
                      className="relative rounded-2xl p-3 flex items-center gap-3"
                      style={{ background: NUR.surface, border: `1px solid ${e.type === 'stage' ? NUR.border : NUR.borderSoft}` }}>
                      <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ background: e.type === 'stage' ? NUR.gold : e.type === 'badge' ? NUR.green : 'rgba(232,197,108,0.5)' }} />
                      <span className="text-xl shrink-0">{e.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black leading-snug" style={{ color: NUR.text }}>{e.title}</p>
                        <p className="text-[9px] mt-0.5" style={{ color: NUR.dim }}>
                          {new Date(e.ts).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={shareJourney}
              className="w-full mt-5 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-97"
              style={{ background: NUR.gold, color: '#03130B' }}>
              <Share2 size={15} /> {tt('Yolculuğumu Paylaş')}
            </button>
          </div>
        )}
      </div>

      {/* ── ROZET BİLDİRİMİ ── */}
      <AnimatePresence>
        {badgeToast && (
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[85] w-[calc(100%-48px)] max-w-sm">
            <div className="rounded-2xl p-3.5 flex items-center gap-3 shadow-2xl"
              style={{ background: 'linear-gradient(120deg, rgba(232,197,108,0.2), #0D3324)', border: `1.5px solid ${NUR.gold}` }}>
              <motion.span className="text-3xl" animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.6 }}
                style={{ filter: 'drop-shadow(0 0 10px rgba(232,197,108,0.7))' }}>{badgeToast.emoji}</motion.span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider" style={{ color: NUR.gold }}>{tt('Yeni Rozet')}</p>
                <p className="text-sm font-black" style={{ color: NUR.text }}>{tt(badgeToast.name)}</p>
                <p className="text-[9px]" style={{ color: NUR.dim }}>{tt(badgeToast.desc)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MERTEBE KUTLAMASI ── */}
      <AnimatePresence>
        {stagePop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center px-8"
            style={{ background: 'rgba(3, 19, 11, 0.92)', backdropFilter: 'blur(8px)' }}>
            <Confetti count={40} />
            <motion.div initial={{ scale: 0.7, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.45 }}
              className="rounded-3xl p-7 text-center max-w-sm w-full relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg, rgba(232,197,108,0.16), rgba(13,51,36,0.9))', border: `2px solid ${NUR.gold}` }}>
              <Stars n={14} />
              <motion.p className="text-6xl relative" animate={{ rotate: [0, -6, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
                style={{ filter: 'drop-shadow(0 0 20px rgba(232,197,108,0.8))' }}>{stagePop.emoji}</motion.p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4 relative" style={{ color: NUR.gold }}>{donus ? tt('Bir Durak Daha') : tt('Mertebe Atladın')}</p>
              <p className="text-3xl font-black mt-1 relative" style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>{tt(stagePop.name)}</p>
              <p className="text-[11px] mt-3 leading-relaxed relative" style={{ color: NUR.dim }}>
                {tt('Gayretin bereketlendi. "Az da olsa devamlı olan amel, Allah\'a en sevimli olandır." (Buhârî, Rikāk 18)')}
              </p>
              <button onClick={() => setStagePop(null)}
                className="mt-5 w-full py-3 rounded-2xl text-sm font-black active:scale-97 relative"
                style={{ background: NUR.gold, color: '#03130B' }}>
                {tt('Yola Devam 🤲')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
