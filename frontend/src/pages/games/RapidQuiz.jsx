import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart, Flame } from 'lucide-react';
import { drawQuestions } from '../../data/questionBank';
import FeedbackOverlay from './FeedbackOverlay';
import ResultScreen from './ResultScreen';

// ⚡ BLITZ — 30 saniye, 10 soru, 3 kalp, combo sistemi, jokerler.
const DURATION = 30;
const MAX_Q = 10;
const LIVES = 3;

// "%X oyuncu doğru cevapladı" — zorluktan türetilen deterministik tahmin
function estPercent(q) {
  const base = q.difficulty === 'hard' ? 47 : q.difficulty === 'medium' ? 64 : 82;
  let h = 0;
  for (const ch of String(q.id)) h = (h * 31 + ch.charCodeAt(0)) % 97;
  return Math.max(28, Math.min(94, base + (h % 17) - 8));
}

export default function RapidQuiz({ theme, onXP, onEvent = () => {} }) {
  const [phase, setPhase] = useState('playing'); // playing | done
  const [questions, setQuestions] = useState(() => drawQuestions(MAX_Q));
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [overlay, setOverlay] = useState(null); // {mode, data}
  const [flash, setFlash] = useState(null);
  const [shake, setShake] = useState(false);
  const [hidden, setHidden] = useState([]); // 50:50 ile gizlenen şıklar
  const [jokers, setJokers] = useState({ fifty: true, time: true, second: true });
  const [secondChance, setSecondChance] = useState(false);
  const [wrongs, setWrongs] = useState([]);
  const [times, setTimes] = useState([]);
  const qStart = useRef(Date.now());
  const finished = useRef(false);

  const restart = useCallback((pool) => {
    finished.current = false;
    setQuestions(pool && pool.length ? pool.slice(0, MAX_Q) : drawQuestions(MAX_Q));
    setIdx(0); setCorrect(0); setXp(0); setCombo(0); setBestCombo(0);
    setLives(LIVES); setTimeLeft(DURATION); setOverlay(null); setFlash(null);
    setHidden([]); setJokers({ fifty: true, time: true, second: true });
    setSecondChance(false); setWrongs([]); setTimes([]);
    qStart.current = Date.now();
    setPhase('playing');
  }, []);

  const finish = useCallback((fXp, fCorrect) => {
    if (finished.current) return;
    finished.current = true;
    setPhase('done');
    if ((fCorrect ?? 0) >= 5) onEvent('win');
    if (fXp > 0) onXP(fXp, 'game_quiz', 'Blitz');
    const best = Number(localStorage.getItem('rapid_best') || 0);
    if (fXp > best) { try { localStorage.setItem('rapid_best', String(fXp)); } catch { /* ignore */ } }
  }, [onXP, onEvent]);

  // Zamanlayıcı — overlay açıkken durur
  useEffect(() => {
    if (phase !== 'playing' || overlay) return;
    const iv = setInterval(() => setTimeLeft(t => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(iv);
  }, [phase, overlay]);

  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0 && !overlay) finish(xp, correct);
  }, [timeLeft, phase, overlay, xp, correct, finish]);

  const q = questions[idx];
  const options = q ? (q.type === 'tf' ? ['Doğru', 'Yanlış'] : q.options) : [];

  const advance = useCallback((nextCorrect, nextXp) => {
    setOverlay(null); setFlash(null); setHidden([]); setSecondChance(false);
    qStart.current = Date.now();
    if (idx + 1 >= questions.length || lives <= 0) finish(nextXp, nextCorrect);
    else setIdx(i => i + 1);
  }, [idx, questions.length, lives, finish]);

  const answer = useCallback((choice) => {
    if (flash !== null || overlay || !q) return;
    const ok = choice === q.correct_index;
    setTimes(ts => [...ts, (Date.now() - qStart.current) / 1000]);
    if (!ok && secondChance) {
      // Çift Cevap jokeri: bu yanlış sayılmaz, şık kilitlenir
      setSecondChance(false);
      setHidden(h => [...h, choice]);
      return;
    }
    setFlash(choice);
    onEvent('answer', { correct: ok, category: q.category });
    if (ok) {
      const newCombo = combo + 1;
      const gained = (q.points || 10) + newCombo * 2;
      setCombo(newCombo); setBestCombo(b => Math.max(b, newCombo));
      setCorrect(c => c + 1); setXp(x => x + gained);
      setOverlay({ mode: 'correct', data: { xp: gained, combo: newCombo }, next: { c: correct + 1, x: xp + gained } });
    } else {
      setCombo(0);
      setLives(l => l - 1);
      setShake(true); setTimeout(() => setShake(false), 500);
      setWrongs(w => [...w, q]);
      setOverlay({
        mode: 'wrong',
        data: { answer: options[q.correct_index], explanation: q.explanation, source: q.category },
        next: { c: correct, x: xp },
      });
    }
  }, [flash, overlay, q, combo, correct, xp, secondChance, options, onEvent]);

  // ─── Jokerler ───
  const useFifty = useCallback(() => {
    if (!jokers.fifty || !q || q.type === 'tf' || overlay) return;
    setJokers(j => ({ ...j, fifty: false }));
    const wrongIdxs = options.map((_, i) => i).filter(i => i !== q.correct_index);
    setHidden(wrongIdxs.sort(() => Math.random() - 0.5).slice(0, 2));
  }, [jokers, q, options, overlay]);
  const useTime = useCallback(() => {
    if (!jokers.time || overlay) return;
    setJokers(j => ({ ...j, time: false }));
    setTimeLeft(t => t + 15);
  }, [jokers, overlay]);
  const useSecond = useCallback(() => {
    if (!jokers.second || overlay) return;
    setJokers(j => ({ ...j, second: false }));
    setSecondChance(true);
  }, [jokers, overlay]);

  if (phase === 'done') {
    const avg = times.length ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1) : '—';
    const fastest = times.length ? Math.min(...times).toFixed(1) : '—';
    return (
      <ResultScreen theme={theme} title="Blitz Modu" correct={correct} total={questions.length} xp={xp}
        stats={[
          { val: `x${bestCombo}`, label: 'En Yüksek Combo' },
          { val: `${avg}sn`, label: 'Ortalama Süre' },
          { val: `${fastest}sn`, label: 'En Hızlı Cevap' },
        ]}
        wrongCount={wrongs.length}
        onReplay={() => restart()}
        onReplayWrongs={() => restart(wrongs)} />
    );
  }

  return (
    <motion.div animate={shake ? { x: [-8, 8, -6, 6, -3, 0] } : {}} transition={{ duration: 0.45 }}
      className="px-4 w-full max-w-md mx-auto">
      <FeedbackOverlay mode={overlay?.mode} data={overlay?.data || {}} theme={theme}
        onContinue={() => overlay && advance(overlay.next.c, overlay.next.x)} />

      {/* Üst bar: combo + kalpler + süre */}
      <div className="flex items-center justify-between mb-3">
        <AnimatePresence mode="wait">
          <motion.div key={combo} initial={{ scale: 0.7 }} animate={{ scale: 1 }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-black"
            style={{ background: combo >= 2 ? '#F59E0B22' : theme.surface, color: combo >= 2 ? '#F59E0B' : theme.textSecondary }}>
            <Flame size={14} /> {combo >= 2 ? `COMBO x${combo}` : 'Combo'}
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: LIVES }).map((_, i) => (
            <Heart key={i} size={17} fill={i < lives ? '#EF4444' : 'transparent'} style={{ color: i < lives ? '#EF4444' : `${theme.textSecondary}60` }} />
          ))}
        </div>
        {/* Süre halkası */}
        <div className="relative w-11 h-11">
          <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke={`${theme.textSecondary}25`} strokeWidth="4" />
            <circle cx="22" cy="22" r="18" fill="none" stroke={timeLeft <= 8 ? '#EF4444' : '#10B981'} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 18} strokeDashoffset={2 * Math.PI * 18 * (1 - Math.min(1, timeLeft / DURATION))}
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-black tabular-nums"
            style={{ color: timeLeft <= 8 ? '#EF4444' : theme.textPrimary }}>{timeLeft}</span>
        </div>
      </div>

      {/* İlerleme */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-black tabular-nums" style={{ color: theme.textSecondary }}>{idx + 1} / {questions.length}</span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}20` }}>
          <motion.div className="h-full rounded-full" animate={{ width: `${((idx + 1) / questions.length) * 100}%` }} style={{ background: '#10B981' }} />
        </div>
        <span className="text-[10px] font-black flex items-center gap-0.5" style={{ color: theme.gold }}><Zap size={10} /> {xp}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -34 }} transition={{ duration: 0.18 }}>
          {/* Soru kartı */}
          <div className="rounded-2xl p-5 mb-4 min-h-[110px]" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${theme.gold}18`, color: theme.gold }}>{q?.category}</span>
            <h3 className="text-base font-bold mt-2" style={{ color: theme.textPrimary }}>{q?.question}</h3>
          </div>

          {/* Şıklar */}
          <div className={q?.type === 'tf' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2.5'}>
            {options.map((opt, i) => {
              if (hidden.includes(i)) {
                return <div key={i} className="p-3.5 rounded-xl text-sm" style={{ background: `${theme.textSecondary}06`, border: `1px dashed ${theme.cardBorder}`, color: `${theme.textSecondary}60` }}>—</div>;
              }
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
                  {q?.type !== 'tf' && <span className="font-bold mr-2" style={{ color: theme.gold }}>{['A', 'B', 'C', 'D'][i]}.</span>}
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Sosyal ipucu */}
          <p className="text-center text-[10px] mt-3" style={{ color: theme.textSecondary }}>≈ %{estPercent(q || { id: '0' })} oyuncu bunu doğru cevapladı</p>
        </motion.div>
      </AnimatePresence>

      {/* Joker çubuğu */}
      <div className="flex justify-center gap-2.5 mt-4">
        {[
          { key: 'fifty', label: '50:50', icon: '➗', fn: useFifty, on: jokers.fifty && q?.type !== 'tf' },
          { key: 'time', label: '+15sn', icon: '⏱️', fn: useTime, on: jokers.time },
          { key: 'second', label: 'Çift Cevap', icon: '🎯', fn: useSecond, on: jokers.second && !secondChance },
        ].map(j => (
          <button key={j.key} onClick={j.fn} disabled={!j.on}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black transition-all active:scale-95 disabled:opacity-35"
            style={{ background: `${theme.gold}12`, border: `1px solid ${theme.gold}35`, color: theme.gold }}>
            <span className="text-sm">{j.icon}</span> {j.label}
          </button>
        ))}
        {secondChance && <span className="text-[9px] font-bold self-center" style={{ color: '#10B981' }}>Çift cevap aktif ✓</span>}
      </div>
    </motion.div>
  );
}
