import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw, Trophy, Volume2, Loader, Music } from 'lucide-react';
import { SURAHS, FAMOUS_SURAHS, verseAudioUrl } from '../../data/surahData';
import Confetti from './Confetti';

const ROUNDS = 10;
const MODES = [
  { id: 'easy', label: 'Kolay', desc: 'Bilinen sureler · ilk ayetler', xp: 15, color: '#10B981' },
  { id: 'hard', label: 'Zor', desc: 'Tüm sureler · rastgele ayet', xp: 30, color: '#EF4444' },
];

function pickRound(mode, prevSurah) {
  const pool = mode === 'easy' ? FAMOUS_SURAHS : SURAHS.map(s => s.n);
  let surahNo;
  do { surahNo = pool[Math.floor(Math.random() * pool.length)]; } while (surahNo === prevSurah && pool.length > 1);
  const surah = SURAHS[surahNo - 1];
  // Kolay modda ilk ayetler (en tanıdık kısım); zorda rastgele
  const ayah = mode === 'easy' ? 1 + Math.floor(Math.random() * Math.min(3, surah.ayahs)) : 1 + Math.floor(Math.random() * surah.ayahs);
  // 3 çeldirici sure adı
  const options = [surah.name];
  while (options.length < 4) {
    const cand = SURAHS[pool[Math.floor(Math.random() * pool.length)] - 1].name;
    if (!options.includes(cand)) options.push(cand);
  }
  // Karıştır
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { surah, ayah, options, url: verseAudioUrl(surahNo, ayah) };
}

// Sesli Tahmin: kıraati dinle, hangi sure olduğunu bil.
// Ses kaynağı: uygulamanın Kur'an bölümüyle aynı CDN (cdn.islamic.network, Alafasy).
export default function VoiceGuess({ theme, onXP, onEvent = () => {} }) {
  const [phase, setPhase] = useState('idle'); // idle | playing | done
  const [mode, setMode] = useState(MODES[0]);
  const [round, setRound] = useState(null);
  const [roundNo, setRoundNo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [answered, setAnswered] = useState(null); // seçilen sure adı
  const [audioState, setAudioState] = useState('idle'); // idle | loading | playing | error
  const audioRef = useRef(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setAudioState('idle');
  }, []);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const playAudio = useCallback((url) => {
    stopAudio();
    setAudioState('loading');
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onplaying = () => setAudioState('playing');
    audio.onended = () => setAudioState('idle');
    audio.onerror = () => setAudioState('error');
    audio.play().catch(() => setAudioState('error'));
  }, [stopAudio]);

  const nextRound = useCallback((m, prevSurah) => {
    const r = pickRound(m.id, prevSurah);
    setRound(r);
    setAnswered(null);
    playAudio(r.url);
  }, [playAudio]);

  const start = useCallback((m) => {
    setMode(m);
    setRoundNo(1); setCorrect(0); setXp(0);
    setPhase('playing');
    nextRound(m, null);
  }, [nextRound]);

  const answer = useCallback((name) => {
    if (answered || !round) return;
    setAnswered(name);
    stopAudio();
    const ok = name === round.surah.name;
    onEvent('answer', { correct: ok, category: 'Kuran' });
    if (ok) { setCorrect(c => c + 1); setXp(x => x + mode.xp); }
    setTimeout(() => {
      if (roundNo >= ROUNDS) {
        const finalCorrect = correct + (ok ? 1 : 0);
        const finalXp = xp + (ok ? mode.xp : 0);
        setPhase('done');
        setCorrect(finalCorrect); setXp(finalXp);
        if (finalCorrect >= 5) onEvent('win');
        if (finalXp > 0) onXP(finalXp, 'game_quiz', `Sesli Tahmin (${mode.label})`);
      } else {
        setRoundNo(n => n + 1);
        nextRound(mode, round.surah.n);
      }
    }, 1100);
  }, [answered, round, roundNo, correct, xp, mode, stopAudio, nextRound, onXP, onEvent]);

  // ─── Mod seçimi ───
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ background: '#22C55E20' }}>
          <Music size={36} style={{ color: '#22C55E' }} />
        </div>
        <h2 className="text-xl font-black mb-1" style={{ color: theme.textPrimary }}>Sesli Tahmin</h2>
        <p className="text-sm mb-6 max-w-xs" style={{ color: theme.textSecondary }}>
          Kıraati dinle, surenin adını tahmin et! {ROUNDS} tur · Mishary Alafasy tilaveti. İnternet bağlantısı gerekir.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {MODES.map(m => (
            <button key={m.id} onClick={() => start(m)}
              className="flex items-center gap-3 p-4 rounded-2xl text-left active:scale-95 transition-all"
              style={{ background: `${m.color}12`, border: `1.5px solid ${m.color}40` }}>
              <Volume2 size={22} style={{ color: m.color }} />
              <div className="flex-1">
                <p className="text-sm font-black" style={{ color: m.color }}>{m.label}</p>
                <p className="text-[10px]" style={{ color: theme.textSecondary }}>{m.desc} · doğru başına +{m.xp} XP</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Sonuç ───
  if (phase === 'done') {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative flex flex-col items-center justify-center px-6 py-10 text-center overflow-hidden">
        {correct >= 5 && <Confetti count={30} />}
        <Trophy size={44} style={{ color: theme.gold }} className="mb-4" />
        <h2 className="text-3xl font-black mb-1" style={{ color: theme.gold }}>+{xp} XP</h2>
        <p className="text-sm mb-5" style={{ color: theme.textSecondary }}>{correct}/{ROUNDS} doğru tahmin · {mode.label} mod</p>
        <button onClick={() => setPhase('idle')} className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm" style={{ background: theme.gold, color: theme.bg }}>
          <RefreshCw size={16} /> Tekrar Oyna
        </button>
      </motion.div>
    );
  }

  // ─── Oyun ───
  const isCorrectName = (name) => answered && name === round.surah.name;
  const isWrongPick = (name) => answered === name && name !== round.surah.name;

  return (
    <div className="px-4 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: theme.surface, color: theme.textPrimary }}>{roundNo}/{ROUNDS}</span>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: `${mode.color}18`, color: mode.color }}>{mode.label}</span>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>{xp} XP</span>
      </div>

      {/* Ses oynatıcı */}
      <div className="rounded-2xl p-6 mb-5 text-center relative overflow-hidden" style={{ background: theme.cardBg, border: `1px solid #22C55E40` }}>
        {/* Dalga animasyonu */}
        <div className="flex items-end justify-center gap-1 h-12 mb-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.span key={i}
              animate={audioState === 'playing' ? { height: [6, 8 + ((i * 13) % 34), 6] } : { height: 6 }}
              transition={{ duration: 0.55 + (i % 5) * 0.09, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 rounded-full"
              style={{ background: audioState === 'playing' ? '#22C55E' : `${theme.textSecondary}40` }} />
          ))}
        </div>
        {audioState === 'error' ? (
          <div>
            <p className="text-xs mb-3" style={{ color: '#EF4444' }}>Ses yüklenemedi — bağlantını kontrol et</p>
            <button onClick={() => playAudio(round.url)} className="px-5 py-2 rounded-xl text-xs font-bold" style={{ background: '#22C55E', color: '#04150d' }}>Tekrar Dene</button>
          </div>
        ) : (
          <button onClick={() => (audioState === 'playing' ? stopAudio() : playAudio(round.url))}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black active:scale-95 transition-all"
            style={{ background: '#22C55E', color: '#04150d' }}>
            {audioState === 'loading' ? <Loader size={16} className="animate-spin" /> : audioState === 'playing' ? <Pause size={16} /> : <Play size={16} />}
            {audioState === 'loading' ? 'Yükleniyor...' : audioState === 'playing' ? 'Durdur' : 'Dinle'}
          </button>
        )}
        {answered && (
          <p className="text-xs mt-3 font-bold" style={{ color: theme.gold }}>
            {round.surah.name} Suresi · {round.ayah}. ayet
          </p>
        )}
      </div>

      {/* Sure seçenekleri */}
      <p className="text-xs font-bold mb-2 text-center" style={{ color: theme.textSecondary }}>Bu kıraat hangi sureden?</p>
      <div className="grid grid-cols-2 gap-2.5">
        {round.options.map(name => (
          <button key={name} onClick={() => answer(name)} disabled={!!answered}
            className="p-3.5 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{
              background: isCorrectName(name) ? '#10B98122' : isWrongPick(name) ? '#EF444422' : theme.surface,
              border: `1.5px solid ${isCorrectName(name) ? '#10B981' : isWrongPick(name) ? '#EF4444' : theme.cardBorder}`,
              color: isCorrectName(name) ? '#10B981' : isWrongPick(name) ? '#EF4444' : theme.textPrimary,
            }}>
            {name}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center text-xs font-black mt-4"
            style={{ color: answered === round.surah.name ? '#10B981' : '#EF4444' }}>
            {answered === round.surah.name ? `Doğru! +${mode.xp} XP 🎉` : `Yanlış — doğrusu: ${round.surah.name}`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
