import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { drawQuestions, BANK_CATEGORIES } from '../../data/questionBank';
import FeedbackOverlay from './FeedbackOverlay';
import ResultScreen from './ResultScreen';

// 📖 KLASİK TEST — soru sayısı + kategori + zorluk seç,
// yanlışları sona bırak, premium sonuç ekranı.
const COUNTS = [10, 20, 50, 100];
const DIFFS = [
  { id: null, label: 'Karışık' },
  { id: 'easy', label: 'Kolay' },
  { id: 'medium', label: 'Orta' },
  { id: 'hard', label: 'Zor' },
];

export default function ClassicTest({ theme, onXP, onEvent = () => {} }) {
  const [phase, setPhase] = useState('setup'); // setup | playing | done
  const [count, setCount] = useState(10);
  // Hub'daki kategori çipinden gelen ön-seçim (varsa)
  const [category, setCategory] = useState(() => {
    try {
      const preset = localStorage.getItem('gc_preset_category');
      if (preset) { localStorage.removeItem('gc_preset_category'); return preset; }
    } catch { /* ignore */ }
    return null;
  });
  const [diff, setDiff] = useState(DIFFS[0]);
  const [retryWrongs, setRetryWrongs] = useState(true);
  const [catOpen, setCatOpen] = useState(false);

  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [wrongs, setWrongs] = useState([]);
  const [requeued, setRequeued] = useState(new Set());
  const [total, setTotal] = useState(0);

  const start = useCallback((pool) => {
    const qs = pool && pool.length ? [...pool] : drawQuestions(count, { category, difficulty: diff.id });
    setQueue(qs); setTotal(qs.length);
    setIdx(0); setCorrect(0); setXp(0); setFlash(null); setOverlay(null);
    setWrongs([]); setRequeued(new Set());
    setPhase('playing');
  }, [count, category, diff]);

  const q = queue[idx];
  const options = q ? (q.type === 'tf' ? ['Doğru', 'Yanlış'] : q.options) : [];

  const advance = useCallback((state) => {
    setOverlay(null); setFlash(null);
    if (idx + 1 >= queue.length) {
      setPhase('done');
      if (state.c >= Math.ceil(state.t / 2)) onEvent('win');
      if (state.x > 0) onXP(state.x, 'game_quiz', `Klasik Test (${state.t} soru)`);
    } else setIdx(i => i + 1);
  }, [idx, queue.length, onXP, onEvent]);

  const answer = useCallback((choice) => {
    if (flash !== null || overlay || !q) return;
    const ok = choice === q.correct_index;
    setFlash(choice);
    onEvent('answer', { correct: ok, category: q.category });
    if (ok) {
      const gained = q.points || 10;
      setCorrect(c => c + 1); setXp(x => x + gained);
      setOverlay({ mode: 'correct', data: { xp: gained }, next: { c: correct + 1, x: xp + gained, t: total } });
    } else {
      setWrongs(w => (w.some(p => p.id === q.id) ? w : [...w, q]));
      // Yanlışları sona bırak: soruyu kuyruğun sonuna bir kez daha ekle
      if (retryWrongs && !requeued.has(q.id)) {
        setRequeued(prev => new Set(prev).add(q.id));
        setQueue(prev => [...prev, q]);
      }
      setOverlay({
        mode: 'wrong',
        data: { answer: options[q.correct_index], explanation: q.explanation, source: q.category },
        next: { c: correct, x: xp, t: total },
      });
    }
  }, [flash, overlay, q, correct, xp, total, retryWrongs, requeued, options, onEvent]);

  // ─── AYARLAR EKRANI ───
  if (phase === 'setup') {
    return (
      <div className="px-5 w-full max-w-md mx-auto">
        <div className="rounded-2xl p-5 space-y-5" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          {/* Soru sayısı */}
          <div>
            <p className="text-xs font-black mb-2" style={{ color: theme.textPrimary }}>Soru Sayısı</p>
            <div className="grid grid-cols-4 gap-2">
              {COUNTS.map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className="py-2.5 rounded-xl text-sm font-black transition-all active:scale-95"
                  style={{
                    background: count === n ? '#10B981' : `${theme.textSecondary}0d`,
                    color: count === n ? '#fff' : theme.textSecondary,
                    border: `1px solid ${count === n ? '#10B981' : theme.cardBorder}`,
                  }}>{n}</button>
              ))}
            </div>
          </div>

          {/* Kategori */}
          <div>
            <p className="text-xs font-black mb-2" style={{ color: theme.textPrimary }}>Kategori</p>
            <button onClick={() => setCatOpen(o => !o)}
              className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold"
              style={{ background: `${theme.textSecondary}0d`, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }}>
              {category || 'Tümü (Karışık)'}
              <ChevronDown size={15} style={{ color: theme.gold, transform: catOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            <AnimatePresence>
              {catOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2 rounded-xl" style={{ border: `1px solid ${theme.cardBorder}` }}>
                  <div className="max-h-44 overflow-y-auto">
                    <button onClick={() => { setCategory(null); setCatOpen(false); }}
                      className="w-full text-left px-3 py-2.5 text-xs font-bold" style={{ color: !category ? theme.gold : theme.textPrimary, background: !category ? `${theme.gold}0d` : 'transparent' }}>
                      Tümü (Karışık)
                    </button>
                    {BANK_CATEGORIES.map(c => (
                      <button key={c.name} onClick={() => { setCategory(c.name); setCatOpen(false); }}
                        className="w-full text-left px-3 py-2.5 text-xs font-bold flex justify-between"
                        style={{ color: category === c.name ? theme.gold : theme.textPrimary, background: category === c.name ? `${theme.gold}0d` : 'transparent' }}>
                        {c.name} <span style={{ color: theme.textSecondary }}>{c.count}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Zorluk */}
          <div>
            <p className="text-xs font-black mb-2" style={{ color: theme.textPrimary }}>Zorluk Seviyesi</p>
            <div className="grid grid-cols-4 gap-2">
              {DIFFS.map(d => (
                <button key={d.label} onClick={() => setDiff(d)}
                  className="py-2.5 rounded-xl text-[11px] font-black transition-all active:scale-95"
                  style={{
                    background: diff.label === d.label ? '#10B981' : `${theme.textSecondary}0d`,
                    color: diff.label === d.label ? '#fff' : theme.textSecondary,
                    border: `1px solid ${diff.label === d.label ? '#10B981' : theme.cardBorder}`,
                  }}>{d.label}</button>
              ))}
            </div>
          </div>

          {/* Yanlışları sona bırak */}
          <button onClick={() => setRetryWrongs(r => !r)} className="w-full flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs font-black" style={{ color: theme.textPrimary }}>Yanlışları Sona Bırak</p>
              <p className="text-[9px]" style={{ color: theme.textSecondary }}>Yanlış cevapladığın sorular testin sonunda tekrar sorulur</p>
            </div>
            <span className="w-11 h-6 rounded-full p-0.5 transition-all shrink-0" style={{ background: retryWrongs ? '#10B981' : `${theme.textSecondary}30` }}>
              <span className="block w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: retryWrongs ? 'translateX(20px)' : 'none' }} />
            </span>
          </button>

          <button onClick={() => start()} className="w-full py-3.5 rounded-2xl font-black text-base active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}>
            Başla
          </button>
        </div>
      </div>
    );
  }

  // ─── SONUÇ ───
  if (phase === 'done') {
    return (
      <ResultScreen theme={theme} title={`Klasik Test (${total} soru)`} correct={correct} total={queue.length} xp={xp}
        stats={[
          { val: `%${Math.round((correct / Math.max(1, queue.length)) * 100)}`, label: 'Doğruluk' },
          { val: category || 'Karışık', label: 'Kategori' },
          { val: diff.label, label: 'Zorluk' },
        ]}
        wrongCount={wrongs.length}
        onReplay={() => setPhase('setup')}
        onReplayWrongs={() => start(wrongs)} />
    );
  }

  // ─── OYUN ───
  const isRetry = idx >= total;
  return (
    <div className="px-4 w-full max-w-md mx-auto">
      <FeedbackOverlay mode={overlay?.mode} data={overlay?.data || {}} theme={theme} onContinue={() => overlay && advance(overlay.next)} />

      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: theme.surface, color: theme.textPrimary }}>{idx + 1}/{queue.length}</span>
        {isRetry && <span className="text-[9px] font-black px-2 py-1 rounded-full" style={{ background: '#F59E0B18', color: '#F59E0B' }}>🔁 Yanlış Tekrarı</span>}
        <span className="px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5" style={{ background: '#10B98118', color: '#10B981' }}>
          <Check size={13} /> {correct}
        </span>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>{xp} XP</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: `${theme.textSecondary}20` }}>
        <motion.div className="h-full rounded-full" animate={{ width: `${(idx / Math.max(1, queue.length)) * 100}%` }} style={{ background: '#10B981' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <div className="rounded-2xl p-5 mb-4 min-h-[110px]" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#10B98118', color: '#10B981' }}>{q?.category}</span>
            <h3 className="text-base font-bold mt-2" style={{ color: theme.textPrimary }}>{q?.question}</h3>
          </div>
          <div className={q?.type === 'tf' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2.5'}>
            {options.map((opt, i) => {
              const chosen = flash === i;
              const isRight = flash !== null && i === q.correct_index;
              return (
                <button key={i} onClick={() => answer(i)} disabled={flash !== null}
                  className="p-3.5 rounded-xl text-sm font-semibold text-left transition-all active:scale-98"
                  style={{
                    background: isRight ? '#10B98122' : chosen ? '#EF444422' : `${theme.textSecondary}0f`,
                    border: `1px solid ${isRight ? '#10B981' : chosen ? '#EF4444' : theme.cardBorder}`,
                    color: theme.textPrimary,
                  }}>
                  {q?.type !== 'tf' && <span className="font-bold mr-2" style={{ color: '#10B981' }}>{['A', 'B', 'C', 'D'][i]}.</span>}
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
