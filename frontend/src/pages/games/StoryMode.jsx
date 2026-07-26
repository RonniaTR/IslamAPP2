import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, Play, ChevronLeft, BookOpen, Trophy } from 'lucide-react';
import { STORIES } from '../../data/storyData';
import { drawQuestions } from '../../data/questionBank';
import FeedbackOverlay from './FeedbackOverlay';
import Confetti from './Confetti';
import QuizCore from './QuizCore';
import { useTx } from '../../i18n';

// 📜 HİKÂYE MODU — kıssaları bölüm bölüm ilerle.
// Bölümü geçmek için en az %60 doğru gerekir; her bölüm XP,
// hikâye tamamlanınca rozet + büyük bonus kazandırır.
const PASS_RATE = 0.6;
const CHAPTER_BONUS = 30;
const STORY_BONUS = 100;

const loadProgress = () => { try { return JSON.parse(localStorage.getItem('story_progress')) || {}; } catch { return {}; } };
const saveProgress = (p) => { try { localStorage.setItem('story_progress', JSON.stringify(p)); } catch { /* ignore */ } };
const addBadge = (b) => { try { const l = JSON.parse(localStorage.getItem('gc_badges')) || []; if (!l.includes(b)) localStorage.setItem('gc_badges', JSON.stringify([...l, b])); } catch { /* ignore */ } };

function chapterQuestions(story, chapter) {
  if (chapter.questions) {
    return chapter.questions.map((q, i) => ({
      id: `s_${story.id}_${i}`, type: 'mc', category: story.title, points: 10,
      question: q.q, options: q.o, correct_index: q.a, explanation: q.exp || '',
    }));
  }
  return drawQuestions(chapter.draw.count, { category: chapter.draw.category, mcOnly: true });
}

export default function StoryMode({ theme, onXP, onEvent = () => {} }) {
  const tt = useTx();
  const [view, setView] = useState('list'); // list | map | intro | play | result
  const [story, setStory] = useState(null);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [progress, setProgress] = useState(loadProgress);
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [storyDone, setStoryDone] = useState(false);

  const openStory = useCallback((s) => { setStory(s); setView('map'); }, []);

  const startChapter = useCallback((ci) => {
    setChapterIdx(ci);
    setView('intro');
  }, []);

  const beginQuestions = useCallback(() => {
    setQueue(chapterQuestions(story, story.chapters[chapterIdx]));
    setIdx(0); setCorrect(0); setXp(0); setFlash(null); setOverlay(null); setStoryDone(false);
    setView('play');
  }, [story, chapterIdx]);

  const q = queue[idx];
  const options = q?.options || [];

  const advance = useCallback((state) => {
    setOverlay(null); setFlash(null);
    if (idx + 1 >= queue.length) {
      const passed = state.c / queue.length >= PASS_RATE;
      let finalXp = state.x;
      if (passed) {
        finalXp += CHAPTER_BONUS;
        onEvent('win');
        const done = progress[story.id] || 0;
        if (chapterIdx === done) {
          const newDone = done + 1;
          const np = { ...progress, [story.id]: newDone };
          setProgress(np); saveProgress(np);
          if (newDone === story.chapters.length) {
            finalXp += STORY_BONUS;
            addBadge(story.badge);
            setStoryDone(true);
          }
        }
      }
      setXp(finalXp); setCorrect(state.c);
      if (finalXp > 0) onXP(finalXp, 'game_quiz', `Hikâye: ${story.title} — ${story.chapters[chapterIdx].title}`);
      setView('result');
    } else setIdx(i => i + 1);
  }, [idx, queue.length, progress, story, chapterIdx, onXP, onEvent]);

  const answer = useCallback((choice) => {
    if (flash !== null || overlay || !q) return;
    const ok = choice === q.correct_index;
    setFlash(choice);
    onEvent('answer', { correct: ok, category: q.category });
    if (ok) {
      const gained = q.points || 10;
      setOverlay({ mode: 'correct', data: { xp: gained }, next: { c: correct + 1, x: xp + gained } });
      setCorrect(c => c + 1); setXp(x => x + gained);
    } else {
      setOverlay({ mode: 'wrong', data: { answer: options[q.correct_index], explanation: q.explanation, source: story.title }, next: { c: correct, x: xp } });
    }
  }, [flash, overlay, q, correct, xp, options, story, onEvent]);

  // ─── HİKÂYE LİSTESİ ───
  if (view === 'list') {
    return (
      <div className="px-5 w-full max-w-md mx-auto">
        <p className="text-xs text-center mb-4" style={{ color: theme.textSecondary }}>
          Bir kıssa seç, bölüm bölüm ilerle. Her bölüm +{CHAPTER_BONUS} XP bonus, hikâye bitince rozet!
        </p>
        <div className="space-y-3">
          {STORIES.map((s, i) => {
            const done = progress[s.id] || 0;
            const total = s.chapters.length;
            const finished = done >= total;
            return (
              <motion.button key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => openStory(s)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left active:scale-95 transition-all relative overflow-hidden"
                style={{ background: `linear-gradient(150deg, ${s.color}14, ${theme.surface})`, border: `1.5px solid ${s.color}45` }}>
                <span className="text-4xl" style={{ filter: `drop-shadow(0 4px 12px ${s.color}70)` }}>{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{s.title} {finished && '✓'}</p>
                  <p className="text-[10px] mb-1.5" style={{ color: theme.textSecondary }}>{s.subtitle}</p>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}18` }}>
                    <div className="h-full rounded-full" style={{ width: `${(done / total) * 100}%`, background: s.color }} />
                  </div>
                  <p className="text-[9px] mt-1 font-bold" style={{ color: s.color }}>{done}/{total} bölüm</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── BÖLÜM HARİTASI ───
  if (view === 'map') {
    const done = progress[story.id] || 0;
    return (
      <div className="px-5 w-full max-w-md mx-auto">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-xs font-bold mb-3" style={{ color: theme.gold }}>
          <ChevronLeft size={14} /> Hikâyeler
        </button>
        <div className="text-center mb-5">
          <span className="text-5xl block mb-2">{story.emoji}</span>
          <h2 className="text-xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{story.title}</h2>
          <p className="text-[10px]" style={{ color: theme.textSecondary }}>{story.subtitle}</p>
        </div>
        {/* Harita: dikey yol */}
        <div className="relative pl-6">
          <div className="absolute left-[35px] top-4 bottom-4 w-0.5" style={{ background: `${story.color}30` }} />
          <div className="space-y-3">
            {story.chapters.map((ch, ci) => {
              const state = ci < done ? 'done' : ci === done ? 'current' : 'locked';
              return (
                <motion.button key={ci} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ci * 0.07 }}
                  onClick={() => state !== 'locked' && startChapter(ci)} disabled={state === 'locked'}
                  className="w-full flex items-center gap-3 text-left relative">
                  <motion.span animate={state === 'current' ? { scale: [1, 1.12, 1] } : {}} transition={{ duration: 1.4, repeat: Infinity }}
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 text-sm font-black"
                    style={{
                      background: state === 'done' ? '#10B981' : state === 'current' ? story.color : `${theme.textSecondary}20`,
                      color: state === 'locked' ? theme.textSecondary : '#fff',
                      boxShadow: state === 'current' ? `0 0 18px ${story.color}80` : 'none',
                    }}>
                    {state === 'done' ? <Check size={16} /> : state === 'locked' ? <Lock size={13} /> : ci + 1}
                  </motion.span>
                  <div className="flex-1 rounded-xl p-3" style={{
                    background: state === 'locked' ? `${theme.textSecondary}08` : theme.cardBg,
                    border: `1px solid ${state === 'current' ? `${story.color}50` : theme.cardBorder}`,
                    opacity: state === 'locked' ? 0.55 : 1,
                  }}>
                    <p className="text-xs font-black" style={{ color: theme.textPrimary }}>Bölüm {ci + 1}: {ch.title}</p>
                    <p className="text-[9px] mt-0.5 line-clamp-1" style={{ color: theme.textSecondary }}>{ch.narrative}</p>
                  </div>
                  {state === 'current' && <Play size={15} style={{ color: story.color }} />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── BÖLÜM GİRİŞİ (anlatı) ───
  if (view === 'intro') {
    const ch = story.chapters[chapterIdx];
    return (
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="px-5 w-full max-w-md mx-auto">
        <button onClick={() => setView('map')} className="flex items-center gap-1 text-xs font-bold mb-3" style={{ color: theme.gold }}>
          <ChevronLeft size={14} /> Harita
        </button>
        <div className="rounded-3xl p-6 text-center mb-4" style={{ background: `linear-gradient(170deg, ${story.color}16, ${theme.surface})`, border: `1.5px solid ${story.color}45` }}>
          <span className="text-4xl block mb-2">{story.emoji}</span>
          <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: story.color }}>Bölüm {chapterIdx + 1}</p>
          <h2 className="text-xl font-black mb-3" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{ch.title}</h2>
          <div className="rounded-2xl p-4 text-left" style={{ background: `${theme.bg}90`, border: `1px solid ${theme.cardBorder}` }}>
            <BookOpen size={14} style={{ color: story.color }} className="mb-2" />
            <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{ch.narrative}</p>
          </div>
        </div>
        <button onClick={beginQuestions} className="w-full py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
          style={{ background: `linear-gradient(135deg, ${story.color}, ${story.color}cc)`, color: '#fff' }}>
          <Play size={16} fill="#fff" /> Soruları Cevapla ({chapterQuestions(story, ch).length} soru)
        </button>
      </motion.div>
    );
  }

  // ─── BÖLÜM SONUCU ───
  if (view === 'result') {
    const passed = correct / Math.max(1, queue.length) >= PASS_RATE;
    return (
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative px-6 py-8 w-full max-w-md mx-auto text-center overflow-hidden">
        {passed && <Confetti count={30} />}
        <span className="text-6xl block mb-3">{storyDone ? '🏆' : passed ? '⭐' : '💭'}</span>
        <h2 className="text-2xl font-black mb-1" style={{ color: passed ? theme.gold : theme.textPrimary }}>
          {storyDone ? 'Hikâye Tamamlandı!' : passed ? 'Bölüm Geçildi!' : 'Biraz Daha Çalış'}
        </h2>
        {storyDone && <p className="text-xs font-black mb-1" style={{ color: '#10B981' }}>🏅 "{story.badge}" rozeti kazanıldı! (+{STORY_BONUS} bonus)</p>}
        <p className="text-sm mb-1" style={{ color: theme.textSecondary }}>{correct}/{queue.length} doğru {passed && `· +${xp} XP`}</p>
        {!passed && <p className="text-[10px] mb-4" style={{ color: theme.textSecondary }}>{tt('Geçmek için en az %60 doğru gerekli')}</p>}
        <div className="flex gap-2.5 mt-5">
          <button onClick={() => setView('map')} className="flex-1 py-3 rounded-2xl font-bold text-sm" style={{ background: `${theme.gold}16`, border: `1px solid ${theme.gold}40`, color: theme.gold }}>
            {tt('Haritaya Dön')}
          </button>
          <button onClick={passed && chapterIdx + 1 < story.chapters.length ? () => startChapter(chapterIdx + 1) : beginQuestions}
            className="flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-1.5"
            style={{ background: story.color, color: '#fff' }}>
            {passed && chapterIdx + 1 < story.chapters.length ? <>{tt('Sonraki Bölüm →')}</> : <><Trophy size={14} /> Tekrar Dene</>}
          </button>
        </div>
      </motion.div>
    );
  }

  // ─── SORULAR ───
  return (
    <div className="px-4 w-full max-w-md mx-auto">
      <FeedbackOverlay mode={overlay?.mode} data={overlay?.data || {}} theme={theme} onContinue={() => overlay && advance(overlay.next)} />
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: `${story.color}18`, color: story.color }}>
          {story.emoji} {story.chapters[chapterIdx].title}
        </span>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: theme.surface, color: theme.textPrimary }}>{idx + 1}/{queue.length}</span>
        <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>{xp} XP</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: `${theme.textSecondary}20` }}>
        <motion.div className="h-full rounded-full" animate={{ width: `${(idx / Math.max(1, queue.length)) * 100}%` }} style={{ background: story.color }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
          <QuizCore q={q} accent={story.color} theme={theme} flash={flash} onPick={answer} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
