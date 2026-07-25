import React, { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Check, X, ChevronLeft, ChevronRight, RefreshCw, Trophy, Info, GraduationCap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { useField } from '../services/contentI18n';
import { useAuth } from '../contexts/AuthContext';
import { awardXPOnce } from '../services/gamification';
import { LETTERS, HAREKELER, TENVIN, ILERI, TECVID, KELIMELER, DERSLER } from '../data/elifba';
import Confetti from './games/Confetti';

// 📖 ELİF BA — interaktif Kur'an okuma başlangıç modülü.
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };

// ─── Arapça sesli okuma (cihazın Web Speech sesi; yoksa sessiz) ───
function useArabicSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speak = useCallback((text) => {
    if (!supported) return false;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA';
      const voices = window.speechSynthesis.getVoices();
      const ar = voices.find(v => /^ar/i.test(v.lang));
      if (ar) u.voice = ar;
      u.rate = 0.75;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(u);
      return true;
    } catch { setSpeaking(false); return false; }
  }, [supported]);
  return { speak, speaking, supported };
}

export default function ElifBaPage() {
  const { theme } = useTheme();
  const tt = useTx();
  const f = useField();
  const { user } = useAuth();
  const { speak } = useArabicSpeech();
  const [lesson, setLesson] = useState(null); // ders tipi
  const [done, setDone] = useState(() => load('elifba_done', []));
  const [detail, setDetail] = useState(null); // seçili harf detayı

  const markDone = useCallback((id, xp = 15) => {
    if (done.includes(id)) return;
    const next = [...done, id]; setDone(next); save('elifba_done', next);
    awardXPOnce(user, `elifba_${id}`, 'hadith_read', { points: xp, details: `Elif Ba: ${id}` });
  }, [done, user]);

  const S = { card: { background: theme.cardBg, border: `1px solid ${theme.cardBorder}` } };
  const glyphFont = { fontFamily: '"Amiri", "Noto Naskh Arabic", "Traditional Arabic", serif' };

  // ═══════════ ANA MENÜ ═══════════
  if (!lesson) {
    return (
      <div className="min-h-screen pb-24 max-w-3xl mx-auto" style={{ background: theme.bg }}>
        <div className="px-5 pt-6 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" style={glyphFont}>ا ب ت</span>
            <h1 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Elif Ba</h1>
          </div>
          <p className="text-xs" style={{ color: theme.textSecondary }}>{tt("Kur'an okumayı sıfırdan öğren")} · {done.length}/{DERSLER.length} {tt('ders')}</p>
        </div>

        {/* Tanıtım kartı */}
        <div className="mx-5 mb-5 rounded-2xl p-5 relative overflow-hidden text-center"
          style={{ background: `linear-gradient(150deg, ${theme.gold}16, ${theme.surface})`, border: `1px solid ${theme.gold}35` }}>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${theme.gold}, transparent 65%)` }} />
          <p className="text-5xl mb-2 relative" style={glyphFont}>بِسْمِ اللّٰه</p>
          <p className="text-xs relative" style={{ color: theme.textSecondary }}>{tt('Her yolculuk Besmele ile başlar. Harflerden kelimelere, adım adım.')}</p>
        </div>

        {/* Ders kartları */}
        <div className="px-5 grid grid-cols-2 gap-3">
          {DERSLER.map((d, i) => {
            const isDone = done.includes(d.id);
            const locked = i > 0 && !done.includes(DERSLER[i - 1].id) && d.type === 'quiz';
            return (
              <motion.button key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setLesson(d)} whileTap={{ scale: 0.97 }}
                className="rounded-2xl p-4 text-left relative overflow-hidden"
                style={{ background: `linear-gradient(150deg, ${theme.surface}, ${d.color}0d)`, border: `1.5px solid ${isDone ? '#10B98150' : `${d.color}30`}` }}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl" style={d.emoji.match(/[◌ًّ]/) ? glyphFont : {}}>{d.emoji}</span>
                  {isDone && <Check size={16} style={{ color: '#10B981' }} />}
                </div>
                <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{f(d, 'title')}</p>
                <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: theme.textSecondary }}>{f(d, 'desc')}</p>
              </motion.button>
            );
          })}
        </div>

        <p className="text-center text-[10px] mt-6 px-8" style={{ color: theme.textSecondary }}>
          {tt('💡 Sesler cihazının Arapça okuma özelliğiyle çalışır. Sesi duymuyorsan, harfin altındaki Türkçe okunuşu takip edebilirsin.')}
        </p>
      </div>
    );
  }

  // ═══════════ DERS İÇİ ÜST BAR ═══════════
  const Header = ({ title }) => (
    <div className="px-5 pt-6 pb-4 flex items-center gap-2 sticky top-0 z-30" style={{ background: `${theme.bg}f5`, backdropFilter: 'blur(10px)' }}>
      <button onClick={() => { setLesson(null); setDetail(null); }} className="p-2 -ml-2 rounded-xl active:scale-90" aria-label="Geri">
        <ArrowLeft size={20} style={{ color: theme.gold }} />
      </button>
      <h1 className="text-xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{title}</h1>
    </div>
  );

  // ═══════════ HARFLER ═══════════
  if (lesson.type === 'letters') {
    return (
      <div className="min-h-screen pb-24 max-w-3xl mx-auto" style={{ background: theme.bg }}>
        <Header title="Harfler" />
        <p className="px-5 text-xs mb-3" style={{ color: theme.textSecondary }}>{tt('Bir harfe dokun; şeklini, adını, sesini ve çıkış yerini gör.')}</p>
        <div className="px-5 grid grid-cols-4 sm:grid-cols-5 gap-2.5">
          {LETTERS.map((l, i) => (
            <motion.button key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.015 }}
              onClick={() => { setDetail(l); speak(l.ar); }}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center active:scale-90 transition-transform"
              style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
              <span className="text-3xl leading-none" style={{ ...glyphFont, color: theme.textPrimary }}>{l.ar}</span>
              <span className="text-[9px] mt-1 font-bold" style={{ color: theme.textSecondary }}>{l.name}</span>
            </motion.button>
          ))}
        </div>
        <div className="px-5 mt-6">
          <button onClick={() => markDone('harfler')} className="w-full py-3 rounded-2xl font-black text-sm" style={{ background: done.includes('harfler') ? `${theme.gold}16` : 'linear-gradient(135deg,#10B981,#059669)', color: done.includes('harfler') ? theme.gold : '#fff', border: done.includes('harfler') ? `1px solid ${theme.gold}45` : 'none' }}>
            {done.includes('harfler') ? tt('Tamamlandı ✓') : tt('Harfleri öğrendim (+15 XP)')}
          </button>
        </div>

        {/* Harf detay modalı */}
        <AnimatePresence>
          {detail && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDetail(null)}
              className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(4,12,8,0.75)', backdropFilter: 'blur(4px)' }}>
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm rounded-3xl p-6 text-center relative"
                style={{ background: `linear-gradient(160deg, ${theme.surface}, ${theme.gold}0a)`, border: `1.5px solid ${theme.gold}40` }}>
                <button onClick={() => setDetail(null)} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${theme.textSecondary}12` }}>
                  <X size={15} style={{ color: theme.textSecondary }} />
                </button>
                <p className="text-8xl mb-1" style={{ ...glyphFont, color: theme.gold }}>{detail.ar}</p>
                <p className="text-xl font-black" style={{ color: theme.textPrimary }}>{detail.name}</p>
                <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>{tt('Ses')}: <span style={{ color: theme.gold }}>{f(detail, 'tr')}</span></p>
                <div className="rounded-xl p-3 mb-4 text-left flex items-start gap-2" style={{ background: `${theme.gold}0c`, border: `1px solid ${theme.cardBorder}` }}>
                  <Info size={14} className="mt-0.5 shrink-0" style={{ color: theme.gold }} />
                  <div>
                    <p className="text-[10px] font-black uppercase" style={{ color: theme.gold }}>{tt('Çıkış Yeri (Mahrec)')}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: theme.textPrimary }}>{f(detail, 'mahrec')}</p>
                  </div>
                </div>
                <button onClick={() => speak(detail.ar)} className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2" style={{ background: theme.gold, color: theme.bg }}>
                  <Volume2 size={16} /> Sesi Dinle
                </button>
                {/* Gezinme */}
                <div className="flex justify-between mt-3">
                  <button onClick={() => { const idx = LETTERS.indexOf(detail); const p = LETTERS[(idx - 1 + LETTERS.length) % LETTERS.length]; setDetail(p); speak(p.ar); }} className="p-2 rounded-lg" style={{ background: `${theme.textSecondary}0f` }}><ChevronRight size={16} style={{ color: theme.textSecondary }} /></button>
                  <button onClick={() => { const idx = LETTERS.indexOf(detail); const n = LETTERS[(idx + 1) % LETTERS.length]; setDetail(n); speak(n.ar); }} className="p-2 rounded-lg" style={{ background: `${theme.textSecondary}0f` }}><ChevronLeft size={16} style={{ color: theme.textSecondary }} /></button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ═══════════ HAREKELER / TENVİN / İLERİ (ortak vitrin) ═══════════
  if (['harekeler', 'tenvin', 'ileri', 'tecvid'].includes(lesson.type)) {
    const groups = lesson.type === 'harekeler' ? HAREKELER : lesson.type === 'tenvin' ? TENVIN : lesson.type === 'tecvid' ? TECVID : ILERI;
    return (
      <div className="min-h-screen pb-24 max-w-3xl mx-auto" style={{ background: theme.bg }}>
        <Header title={f(lesson, 'title')} />
        <div className="px-5 space-y-4">
          {groups.map((g, gi) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.06 }}
              className="rounded-2xl p-4" style={S.card}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-black" style={{ color: theme.textPrimary }}>
                  {g.mark && <span className="text-2xl mr-2" style={{ ...glyphFont, color: theme.gold }}>◌{g.mark}</span>}
                  {f(g, 'name')}
                </p>
                {g.sound && <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${theme.gold}14`, color: theme.gold }}>{g.sound}</span>}
              </div>
              {g.desc && <p className="text-[11px] mb-3 leading-relaxed" style={{ color: theme.textSecondary }}>{f(g, 'desc')}</p>}
              <div className="flex gap-2 flex-wrap">
                {g.ex.map((e, ei) => (
                  <button key={ei} onClick={() => speak(e.ar)}
                    className="flex flex-col items-center gap-1 px-3.5 py-2.5 rounded-xl active:scale-90 transition-transform"
                    style={{ background: `${lesson.color}0d`, border: `1px solid ${lesson.color}30` }}>
                    <span className="text-2xl leading-none" style={{ ...glyphFont, color: theme.textPrimary }}>{e.ar}</span>
                    <span className="text-[10px] font-black" style={{ color: lesson.color }}>{e.read}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
          <button onClick={() => markDone(lesson.id)} className="w-full py-3 rounded-2xl font-black text-sm mt-2" style={{ background: done.includes(lesson.id) ? `${theme.gold}16` : 'linear-gradient(135deg,#10B981,#059669)', color: done.includes(lesson.id) ? theme.gold : '#fff', border: done.includes(lesson.id) ? `1px solid ${theme.gold}45` : 'none' }}>
            {done.includes(lesson.id) ? tt('Tamamlandı ✓') : `${f(lesson, 'title')} ${tt('tamam (+15 XP)')}`}
          </button>
          <p className="text-center text-[10px]" style={{ color: theme.textSecondary }}>{tt('Örneklere dokunarak sesini dinle')}</p>
        </div>
      </div>
    );
  }

  // ═══════════ KELİMELER ═══════════
  if (lesson.type === 'kelimeler') {
    return (
      <div className="min-h-screen pb-24 max-w-3xl mx-auto" style={{ background: theme.bg }}>
        <Header title={tt('İlk Kelimeler')} />
        <p className="px-5 text-xs mb-3" style={{ color: theme.textSecondary }}>{tt('Tebrikler! Artık harfleri birleştirip kelime okuyabilirsin. Dokun, dinle.')}</p>
        <div className="px-5 grid grid-cols-2 gap-3">
          {KELIMELER.map((k, i) => (
            <motion.button key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => speak(k.ar)} whileTap={{ scale: 0.96 }}
              className="rounded-2xl p-5 text-center active:scale-95" style={S.card}>
              <p className="text-4xl mb-2" style={{ ...glyphFont, color: theme.gold }}>{k.ar}</p>
              <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{k.read}</p>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>{f(k, 'mean')}</p>
            </motion.button>
          ))}
        </div>
        <div className="px-5 mt-6">
          <button onClick={() => markDone('kelimeler', 20)} className="w-full py-3 rounded-2xl font-black text-sm" style={{ background: done.includes('kelimeler') ? `${theme.gold}16` : 'linear-gradient(135deg,#10B981,#059669)', color: done.includes('kelimeler') ? theme.gold : '#fff', border: done.includes('kelimeler') ? `1px solid ${theme.gold}45` : 'none' }}>
            {done.includes('kelimeler') ? tt('Tamamlandı ✓') : tt('İlk kelimelerimi okudum (+20 XP)')}
          </button>
        </div>
      </div>
    );
  }

  // ═══════════ ALIŞTIRMA (QUIZ) ═══════════
  if (lesson.type === 'quiz') {
    return <ElifBaQuiz theme={theme} glyphFont={glyphFont} speak={speak} onFinish={() => markDone('sinav', 25)} onExit={() => setLesson(null)} />;
  }

  return null;
}

// ─── Harf tanıma alıştırması ───
function ElifBaQuiz({ theme, glyphFont, speak, onFinish, onExit }) {
  const ROUNDS = 10;
  const rounds = useMemo(() => {
    const shuffled = [...LETTERS].sort(() => Math.random() - 0.5).slice(0, ROUNDS);
    return shuffled.map(correct => {
      const distractors = LETTERS.filter(l => l.name !== correct.name).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
      return { correct, options };
    });
  }, []);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  const r = rounds[idx];
  const answer = (opt) => {
    if (flash) return;
    const ok = opt.name === r.correct.name;
    setFlash(opt.name);
    if (ok) setScore(s => s + 1);
    setTimeout(() => {
      setFlash(null);
      if (idx + 1 >= rounds.length) { setDone(true); if (!finished.current) { finished.current = true; onFinish(); } }
      else setIdx(i => i + 1);
    }, 700);
  };

  if (done) {
    return (
      <div className="min-h-screen pb-24 max-w-3xl mx-auto flex flex-col items-center justify-center px-6 text-center relative overflow-hidden" style={{ background: theme.bg }}>
        <Confetti count={30} />
        <Trophy size={48} style={{ color: theme.gold }} className="mb-4" />
        <h2 className="text-3xl font-black mb-1" style={{ color: theme.gold }}>{score}/{rounds.length}</h2>
        <p className="text-sm mb-6" style={{ color: theme.textSecondary }}>{tt('doğru tanıdın!')} {score >= 8 ? tt('Maşallah, harfleri öğrendin 🌟') : tt('Güzel gidiyorsun, tekrar dene!')}</p>
        <button onClick={onExit} className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
          <GraduationCap size={16} /> {tt('Derslere Dön')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto" style={{ background: theme.bg }}>
      <div className="px-5 pt-6 pb-4 flex items-center gap-2">
        <button onClick={onExit} className="p-2 -ml-2 rounded-xl active:scale-90"><ArrowLeft size={20} style={{ color: theme.gold }} /></button>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: theme.surface, color: theme.textPrimary }}>{idx + 1}/{rounds.length}</span>
        <span className="ml-auto px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: '#10B98118', color: '#10B981' }}>{score} ✓</span>
      </div>
      <div className="h-1.5 mx-5 rounded-full overflow-hidden mb-6" style={{ background: `${theme.textSecondary}20` }}>
        <motion.div className="h-full rounded-full" animate={{ width: `${(idx / rounds.length) * 100}%` }} style={{ background: theme.gold }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }} className="px-5">
          {/* Büyük harf */}
          <div className="rounded-3xl p-8 mb-6 flex flex-col items-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <p className="text-8xl leading-none" style={{ ...glyphFont, color: theme.textPrimary }}>{r.correct.ar}</p>
            <button onClick={() => speak(r.correct.ar)} className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold" style={{ background: `${theme.gold}14`, color: theme.gold, border: `1px solid ${theme.gold}30` }}>
              <Volume2 size={13} /> Dinle
            </button>
          </div>
          <p className="text-center text-xs font-bold mb-3" style={{ color: theme.textSecondary }}>{tt('Bu harfin adı nedir?')}</p>
          <div className="grid grid-cols-2 gap-3">
            {r.options.map((opt, i) => {
              const chosen = flash === opt.name;
              const isRight = flash && opt.name === r.correct.name;
              return (
                <button key={i} onClick={() => answer(opt)} disabled={!!flash}
                  className="p-4 rounded-2xl text-base font-black transition-all active:scale-95"
                  style={{
                    background: isRight ? '#10B98122' : chosen ? '#EF444422' : theme.surface,
                    border: `1.5px solid ${isRight ? '#10B981' : chosen ? '#EF4444' : theme.cardBorder}`,
                    color: theme.textPrimary,
                  }}>
                  {opt.name}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
