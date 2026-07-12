import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookHeart, Check, ChevronLeft, Flame, PenLine, Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { awardXPOnce } from '../services/gamification';
import Confetti from './games/Confetti';
import api from '../api';

// 📔 AMEL DEFTERİ — asırlık "muhasebe" geleneğinin dijitali.
// Akşam üç soru + kalp durumu + günün otomatik ibadet özeti.
// Kayıtlar YALNIZCA cihazda tutulur (mahremiyet esastır).

const QUESTIONS = [
  { key: 'iyilik', icon: '🤝', q: 'Bugün kimi sevindirdin, kime faydan dokundu?' },
  { key: 'sukur', icon: '🌸', q: 'Bugün en çok neye şükrettin?' },
  { key: 'niyet', icon: '🌱', q: 'Yarın neyi daha güzel yapmak istiyorsun?' },
];

const MOODS = [
  { v: 1, e: '😔', label: 'Zor bir gündü' },
  { v: 2, e: '😐', label: 'Dalgalıydı' },
  { v: 3, e: '🙂', label: 'İyiydi' },
  { v: 4, e: '😊', label: 'Güzeldi' },
  { v: 5, e: '🌟', label: 'Bereketliydi' },
];

const todayKey = () => new Date().toISOString().split('T')[0];
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };

const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export default function JournalPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [entries, setEntries] = useState(() => load('journal_entries', {}));
  const [view, setView] = useState('today'); // today | history
  const [answers, setAnswers] = useState(['', '', '']);
  const [mood, setMood] = useState(null);
  const [savedNow, setSavedNow] = useState(false);
  const [worship, setWorship] = useState(null);

  const tKey = todayKey();
  const todayEntry = entries[tKey];
  const streak = useMemo(() => {
    let s = 0;
    const d = new Date();
    for (;;) {
      const k = d.toISOString().split('T')[0];
      if (entries[k]) { s += 1; d.setDate(d.getDate() - 1); } else break;
    }
    return s;
  }, [entries]);

  useEffect(() => {
    if (todayEntry) { setAnswers(todayEntry.answers); setMood(todayEntry.mood); }
    api.get('/worship/today').then(r => { if (r.data && typeof r.data === 'object') setWorship(r.data); }).catch(() => {});
  }, []); // yalnızca ilk açılışta bugünün kaydını yükle

  // Günün otomatik özeti (uygulama içi izlerden)
  const autoSummary = useMemo(() => {
    const daily = load(`gc_daily_${tKey}`, {});
    const dq = load(`dq_${tKey}`, null);
    return [
      { icon: '⚡', label: 'Kazanılan XP', val: daily.xp || 0 },
      { icon: '✅', label: 'Doğru cevap', val: daily.correct || 0 },
      { icon: '📌', label: 'Günün sorusu', val: dq ? (dq.ok ? 'Doğru' : 'Cevaplandı') : '—' },
      ...(worship ? [
        { icon: '🕌', label: 'Namaz', val: worship.namaz ? '✓' : '—' },
        { icon: '📖', label: "Kur'an", val: worship.kuran ? '✓' : '—' },
        { icon: '📿', label: 'Zikir', val: worship.zikir ? '✓' : '—' },
      ] : []),
    ];
  }, [tKey, worship]);

  const canSave = mood !== null && answers.some(a => a.trim().length > 0);

  const saveEntry = useCallback(() => {
    if (!canSave) return;
    const entry = { answers, mood, ts: Date.now() };
    const next = { ...entries, [tKey]: entry };
    setEntries(next); save('journal_entries', next);
    setSavedNow(true);
    setTimeout(() => setSavedNow(false), 2200);
    awardXPOnce(user, `journal_${tKey}`, 'hadith_read', { points: 15, details: 'Amel Defteri' });
  }, [canSave, answers, mood, entries, tKey, user]);

  // Son 7 gün kalp grafiği
  const week = useMemo(() => {
    const days = [];
    const d = new Date();
    d.setDate(d.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      const k = d.toISOString().split('T')[0];
      days.push({ k, day: DAY_NAMES[d.getDay()], mood: entries[k]?.mood ?? null });
      d.setDate(d.getDate() + 1);
    }
    return days;
  }, [entries]);

  const historyList = useMemo(() =>
    Object.entries(entries).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 30), [entries]);

  const S = { card: { background: theme.cardBg, border: `1px solid ${theme.cardBorder}` } };

  // ═══ GEÇMİŞ ═══
  if (view === 'history') {
    return (
      <div className="min-h-screen pb-24 max-w-2xl mx-auto" style={{ background: theme.bg }}>
        <div className="px-5 pt-6 pb-4 flex items-center gap-2">
          <button onClick={() => setView('today')} className="p-2 -ml-2 rounded-xl active:scale-90" aria-label="Geri">
            <ChevronLeft size={20} style={{ color: theme.gold }} />
          </button>
          <h1 className="text-xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Defter Geçmişi</h1>
        </div>
        <div className="px-5 space-y-3">
          {historyList.length === 0 && <p className="text-center text-xs py-10" style={{ color: theme.textSecondary }}>Henüz kayıt yok — bu akşam ilk sayfanı yaz 🌙</p>}
          {historyList.map(([k, e]) => (
            <div key={k} className="rounded-2xl p-4" style={S.card}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-black" style={{ color: theme.gold }}>
                  {new Date(k + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
                </p>
                <span className="text-lg">{MOODS.find(m => m.v === e.mood)?.e}</span>
              </div>
              {QUESTIONS.map((q, i) => e.answers[i]?.trim() && (
                <p key={q.key} className="text-xs leading-relaxed mb-1.5" style={{ color: theme.textPrimary }}>
                  <span className="mr-1">{q.icon}</span>{e.answers[i]}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ BUGÜN ═══
  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto relative" style={{ background: theme.bg }}>
      {savedNow && <Confetti count={24} />}
      {/* Başlık */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookHeart size={22} style={{ color: theme.gold }} />
            <h1 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Amel Defteri</h1>
          </div>
          {streak > 0 && (
            <span className="flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full" style={{ background: '#EF444415', color: '#EF4444' }}>
              <Flame size={13} /> {streak} gün
            </span>
          )}
        </div>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
          Günün muhasebesi — {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Haftalık kalp grafiği */}
      <div className="mx-5 mb-4 rounded-2xl p-4" style={S.card}>
        <p className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: theme.gold }}>Haftanın Kalp Grafiği</p>
        <div className="flex items-end justify-between gap-1.5 h-16">
          {week.map(d => (
            <div key={d.k} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg transition-all"
                style={{
                  height: d.mood ? `${d.mood * 20}%` : '6%',
                  background: d.mood ? `linear-gradient(180deg, ${theme.gold}, ${theme.gold}70)` : `${theme.textSecondary}20`,
                  minHeight: 4,
                }} />
              <span className="text-[8px] font-bold" style={{ color: d.k === tKey ? theme.gold : theme.textSecondary }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Günün otomatik özeti */}
      <div className="mx-5 mb-4 rounded-2xl p-4" style={S.card}>
        <p className="text-[10px] font-black uppercase tracking-wider mb-2.5" style={{ color: theme.gold }}>Bugünün İzleri (otomatik)</p>
        <div className="flex flex-wrap gap-1.5">
          {autoSummary.map((s, i) => (
            <span key={i} className="text-[10px] font-bold px-2.5 py-1.5 rounded-full" style={{ background: `${theme.gold}0d`, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }}>
              {s.icon} {s.label}: <span style={{ color: theme.gold }}>{s.val}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Kalp durumu */}
      <div className="mx-5 mb-4 rounded-2xl p-4" style={S.card}>
        <p className="text-xs font-black mb-3" style={{ color: theme.textPrimary }}>Bugün kalbin nasıldı?</p>
        <div className="flex justify-between gap-1.5">
          {MOODS.map(m => (
            <button key={m.v} onClick={() => setMood(m.v)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all active:scale-95"
              style={{
                background: mood === m.v ? `${theme.gold}18` : `${theme.textSecondary}08`,
                border: `1.5px solid ${mood === m.v ? `${theme.gold}55` : 'transparent'}`,
              }}>
              <span className="text-xl">{m.e}</span>
              <span className="text-[8px] font-bold text-center leading-tight" style={{ color: mood === m.v ? theme.gold : theme.textSecondary }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Üç soru */}
      {QUESTIONS.map((q, i) => (
        <div key={q.key} className="mx-5 mb-4 rounded-2xl p-4" style={S.card}>
          <p className="text-xs font-black mb-2.5 flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
            <span className="text-base">{q.icon}</span> {q.q}
          </p>
          <textarea value={answers[i]} onChange={e => setAnswers(prev => prev.map((a, j) => (j === i ? e.target.value : a)))}
            rows={2} maxLength={500} placeholder="Birkaç kelime yeter..."
            className="w-full bg-transparent outline-none text-sm resize-none rounded-xl p-3"
            style={{ color: theme.textPrimary, background: `${theme.textSecondary}08`, border: `1px solid ${theme.cardBorder}`, fontFamily: 'Georgia, serif' }} />
        </div>
      ))}

      {/* Kaydet */}
      <div className="mx-5 space-y-2.5">
        <button onClick={saveEntry} disabled={!canSave}
          className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40"
          style={{ background: todayEntry ? `${theme.gold}16` : 'linear-gradient(135deg, #10B981, #059669)', border: todayEntry ? `1px solid ${theme.gold}45` : 'none', color: todayEntry ? theme.gold : '#fff' }}>
          <AnimatePresence mode="wait">
            {savedNow
              ? <motion.span key="ok" initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="flex items-center gap-2"><Check size={16} /> Deftere yazıldı ✓</motion.span>
              : <motion.span key="save" className="flex items-center gap-2"><PenLine size={15} /> {todayEntry ? 'Güncelle' : 'Deftere Yaz (+15 XP)'}</motion.span>}
          </AnimatePresence>
        </button>
        <button onClick={() => setView('history')} className="w-full py-3 rounded-2xl font-bold text-xs" style={{ background: `${theme.textSecondary}0d`, border: `1px solid ${theme.cardBorder}`, color: theme.textSecondary }}>
          Geçmiş sayfaları gör ({Object.keys(entries).length})
        </button>
        <p className="flex items-center justify-center gap-1 text-[10px] pt-1" style={{ color: theme.textSecondary }}>
          <Lock size={10} /> Defterin yalnızca bu cihazda saklanır — kimse okuyamaz.
        </p>
      </div>
    </div>
  );
}
