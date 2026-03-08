import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Zap, Star, ArrowRight, RotateCw, Crown, Timer, BookOpen, Users, Clock, Scroll, Moon, Sunrise, Scale, Building, ChevronRight, Award, Target, Flame, ArrowLeft, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const ICONS = { 'book-open': BookOpen, star: Star, users: Users, clock: Clock, scroll: Scroll, moon: Moon, sunrise: Sunrise, scale: Scale, building: Building, zap: Zap };

// Confetti component
function Confetti({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(30)].map((_, i) => (
        <div key={i} className="absolute animate-confetti" style={{
          left: `${Math.random() * 100}%`, top: '-10px',
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${1.5 + Math.random() * 2}s`,
          width: `${6 + Math.random() * 8}px`, height: `${6 + Math.random() * 8}px`,
          background: ['#D4AF37', '#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 6)],
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          transform: `rotate(${Math.random() * 360}deg)`
        }} />
      ))}
    </div>
  );
}

export default function QuizPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('home'); // home, game, result, leaderboard
  const [categories, setCategories] = useState([]);
  const [session, setSession] = useState(null);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(15);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [animateScore, setAnimateScore] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    api.get('/quiz/categories').then(r => setCategories(r.data)).catch(() => {});
    api.get('/quiz/leaderboard').then(r => setLeaderboard(r.data)).catch(() => {});
  }, []);

  // Timer countdown
  useEffect(() => {
    if (view !== 'game' || selected !== null) return;
    setTimer(15);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); submitAnswer(-1); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [view, qi, selected]);

  const startQuiz = async (categoryId) => {
    setLoading(true);
    try {
      const endpoint = categoryId === 'mixed'
        ? `/quiz/solo/start-mixed?user_id=${user?.user_id || 'guest'}&question_count=15`
        : `/quiz/solo/start?user_id=${user?.user_id || 'guest'}&category=${categoryId}&question_count=10`;
      const { data } = await api.post(endpoint);
      setSession(data); setQi(0); setScore(0); setCorrect(0); setStreak(0); setBestStreak(0);
      setSelected(null); setResult(null); setView('game');
    } catch {} finally { setLoading(false); }
  };

  const submitAnswer = useCallback(async (idx) => {
    if (selected !== null || !session) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    try {
      const timeTaken = 15 - timer;
      const { data } = await api.post(`/quiz/solo/${session.session_id}/answer?question_index=${qi}&answer=${idx}&time_taken=${timeTaken}`);
      setResult(data);
      const earned = data.points_earned || 0;
      setScore(prev => prev + earned);
      if (data.correct) {
        setCorrect(prev => prev + 1);
        setStreak(prev => { const ns = prev + 1; if (ns > bestStreak) setBestStreak(ns); return ns; });
        if (earned > 0) { setAnimateScore(true); setTimeout(() => setAnimateScore(false), 600); }
      } else {
        setStreak(0);
      }
    } catch {}
  }, [selected, session, qi, timer, bestStreak]);

  const nextQuestion = () => {
    if (qi + 1 >= session.questions.length) {
      api.post(`/quiz/solo/${session.session_id}/finish`).catch(() => {});
      setView('result');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      api.get('/quiz/leaderboard').then(r => setLeaderboard(r.data)).catch(() => {});
      return;
    }
    setQi(prev => prev + 1); setSelected(null); setResult(null);
  };

  // HOME VIEW
  if (view === 'home') {
    const topThree = leaderboard.slice(0, 3);
    return (
      <div className="animate-fade-in pb-24" data-testid="quiz-home">
        {/* Header */}
        <div className="relative px-5 pt-10 pb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />
          <div className="relative flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
              <Trophy size={24} className="text-[#0A1F14]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#F5F5DC]" style={{ fontFamily: 'Playfair Display, serif' }}>İslam Quiz</h1>
              <p className="text-xs text-[#A8B5A0]">300+ soru ile bilgini test et!</p>
            </div>
          </div>
        </div>

        {/* Quick Play */}
        <div className="px-4 mb-4">
          <button onClick={() => startQuiz('mixed')} disabled={loading} data-testid="quick-play-btn"
            className="w-full relative overflow-hidden rounded-2xl p-4 transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.1)%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-[#0A1F14]">Hızlı Oyun</p>
                <p className="text-xs text-[#0A1F14]/70">Karışık 15 soru ile yarış!</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Zap size={24} className="text-[#0A1F14]" />
              </div>
            </div>
          </button>
        </div>

        {/* Leaderboard Preview */}
        {topThree.length > 0 && (
          <div className="px-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Crown size={14} className="text-[#D4AF37]" />
                <span className="text-sm font-bold text-[#F5F5DC]">Sıralama</span>
              </div>
              <button onClick={() => setView('leaderboard')} data-testid="view-leaderboard"
                className="text-[10px] text-[#D4AF37] flex items-center gap-0.5">Tümünü Gör <ChevronRight size={12} /></button>
            </div>
            <div className="flex gap-2">
              {topThree.map((p, i) => (
                <div key={p.user_id} className={`flex-1 rounded-xl p-3 text-center border ${
                  i === 0 ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' : i === 1 ? 'bg-gray-400/10 border-gray-400/20' : 'bg-orange-700/10 border-orange-700/20'
                }`} data-testid={`leaderboard-${i}`}>
                  <div className={`text-lg font-black ${i === 0 ? 'text-[#D4AF37]' : i === 1 ? 'text-gray-400' : 'text-orange-400'}`}>
                    {i === 0 ? '1' : i === 1 ? '2' : '3'}
                  </div>
                  <p className="text-[10px] text-[#F5F5DC] truncate font-medium">{p.username}</p>
                  <p className="text-[10px] text-[#D4AF37]">{p.total_points} puan</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="px-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Target size={14} className="text-emerald-400" />
            <span className="text-sm font-bold text-[#F5F5DC]">Kategoriler</span>
            <span className="text-[10px] text-[#A8B5A0] ml-1">({categories.length} kategori)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(c => {
              const Icon = ICONS[c.icon] || BookOpen;
              return (
                <button key={c.id} onClick={() => startQuiz(c.id)} disabled={loading}
                  data-testid={`quiz-cat-${c.id}`}
                  className="relative overflow-hidden rounded-xl p-3 text-left border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all active:scale-[0.97]">
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10" style={{ background: c.color }} />
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${c.color}20` }}>
                    <Icon size={16} style={{ color: c.color }} />
                  </div>
                  <p className="text-xs font-bold text-[#F5F5DC] leading-tight">{c.name}</p>
                  <p className="text-[9px] text-[#A8B5A0] mt-0.5">{c.question_count} soru</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // LEADERBOARD VIEW
  if (view === 'leaderboard') {
    return (
      <div className="animate-fade-in pb-24" data-testid="quiz-leaderboard">
        <div className="px-5 pt-10 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setView('home')} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#F5F5DC]">
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#F5F5DC]">Sıralama Tablosu</h1>
              <p className="text-xs text-[#A8B5A0]">En iyi oyuncular</p>
            </div>
          </div>
        </div>
        <div className="px-4 space-y-2">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy size={40} className="text-[#A8B5A0]/30 mx-auto mb-3" />
              <p className="text-sm text-[#A8B5A0]">Henüz sıralama yok</p>
              <p className="text-xs text-[#A8B5A0]/60 mt-1">İlk quiz'i oynayarak sıralamaya gir!</p>
            </div>
          ) : leaderboard.map((p, i) => (
            <div key={p.user_id} data-testid={`lb-row-${i}`}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                i === 0 ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' : i === 1 ? 'bg-gray-400/5 border-gray-400/15' : i === 2 ? 'bg-orange-700/5 border-orange-700/15' : 'bg-white/[0.02] border-white/5'
              }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                i === 0 ? 'bg-[#D4AF37] text-[#0A1F14]' : i === 1 ? 'bg-gray-400 text-[#0A1F14]' : i === 2 ? 'bg-orange-500 text-white' : 'bg-white/10 text-[#A8B5A0]'
              }`}>
                {i < 3 ? <Crown size={14} /> : p.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#F5F5DC] truncate">{p.username}</p>
                <p className="text-[10px] text-[#A8B5A0]">{p.games_played} oyun · %{p.accuracy} doğru</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#D4AF37]">{p.total_points}</p>
                <p className="text-[9px] text-[#A8B5A0]">puan</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // RESULT VIEW
  if (view === 'result' && session) {
    const total = session.questions.length;
    const pct = Math.round((correct / total) * 100);
    const grade = pct >= 90 ? { label: 'Muhteşem!', emoji: 'A+', color: '#D4AF37' } :
                  pct >= 70 ? { label: 'Harika!', emoji: 'A', color: '#10b981' } :
                  pct >= 50 ? { label: 'İyi!', emoji: 'B', color: '#f59e0b' } :
                              { label: 'Tekrar Dene', emoji: 'C', color: '#ef4444' };
    return (
      <div className="animate-fade-in px-5 pt-12 pb-24 text-center" data-testid="quiz-result">
        <Confetti show={showConfetti} />

        {/* Grade Circle */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90 drop-shadow-lg">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2.5" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={grade.color}
              strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={`${pct} ${100 - pct}`}
              className="transition-all duration-[2s] ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black" style={{ color: grade.color }}>{grade.emoji}</span>
            <span className="text-[10px] text-[#A8B5A0]">{pct}%</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-[#F5F5DC] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{grade.label}</h2>
        <p className="text-sm text-[#A8B5A0] mb-6">{correct}/{total} doğru cevap</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="card-islamic rounded-xl p-3">
            <Trophy size={16} className="text-[#D4AF37] mx-auto mb-1" />
            <p className="text-lg font-black text-[#D4AF37]">{score}</p>
            <p className="text-[9px] text-[#A8B5A0]">Toplam Puan</p>
          </div>
          <div className="card-islamic rounded-xl p-3">
            <Flame size={16} className="text-orange-400 mx-auto mb-1" />
            <p className="text-lg font-black text-orange-400">{bestStreak}</p>
            <p className="text-[9px] text-[#A8B5A0]">En İyi Seri</p>
          </div>
          <div className="card-islamic rounded-xl p-3">
            <Timer size={16} className="text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-black text-emerald-400">{pct}%</p>
            <p className="text-[9px] text-[#A8B5A0]">Başarı</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => { setView('home'); setSession(null); }} data-testid="quiz-back-home"
            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F5F5DC] font-medium text-sm flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Ana Menü
          </button>
          <button onClick={() => startQuiz(session.category)} data-testid="quiz-restart"
            className="flex-1 py-3 rounded-xl text-[#0A1F14] font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
            <RotateCw size={16} /> Tekrar Oyna
          </button>
        </div>
      </div>
    );
  }

  // GAME VIEW
  if (view === 'game' && session) {
    const q = session.questions[qi];
    const total = session.questions.length;
    const timerPct = (timer / 15) * 100;
    const timerColor = timer > 8 ? '#10b981' : timer > 4 ? '#f59e0b' : '#ef4444';

    return (
      <div className="animate-fade-in px-4 pt-6 pb-24" data-testid="quiz-game">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => { setView('home'); setSession(null); clearInterval(timerRef.current); }}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#F5F5DC]">
            <ArrowLeft size={14} />
          </button>
          <div className="flex items-center gap-2">
            {streak >= 3 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 animate-pulse">
                <Flame size={12} className="text-orange-400" />
                <span className="text-[10px] font-bold text-orange-400">{streak}x</span>
              </div>
            )}
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4AF37]/15 ${animateScore ? 'animate-bounce' : ''}`}>
              <Star size={12} className="text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37]">{score}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-[#A8B5A0] font-bold">{qi + 1}/{total}</span>
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full transition-all duration-500"
              style={{ width: `${((qi + 1) / total) * 100}%` }} />
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 mb-4">
          <Timer size={14} style={{ color: timerColor }} />
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{
              width: `${timerPct}%`, background: timerColor,
              boxShadow: timer <= 4 ? `0 0 8px ${timerColor}` : 'none'
            }} />
          </div>
          <span className="text-xs font-bold w-6 text-right" style={{ color: timerColor }}>{timer}</span>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl p-5 mb-4 border border-[#D4AF37]/20 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, rgba(212,175,55,0.08) 0%, rgba(10,31,20,0.5) 100%)' }}>
          <div className="absolute top-2 right-2">
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
              q.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
              q.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {q.difficulty === 'easy' ? 'Kolay' : q.difficulty === 'hard' ? 'Zor' : 'Orta'} · {q.points}p
            </span>
          </div>
          <p className="text-base font-semibold text-[#F5F5DC] leading-relaxed pr-16" data-testid="quiz-question">{q.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {q.options.map((opt, i) => {
            const letters = ['A', 'B', 'C', 'D'];
            let cls = 'bg-white/[0.03] border-white/10 text-[#F5F5DC]';
            let iconCls = 'bg-white/10 text-[#A8B5A0]';
            if (selected !== null) {
              if (i === result?.correct_answer) {
                cls = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
                iconCls = 'bg-emerald-500/30 text-emerald-300';
              } else if (i === selected && !result?.correct) {
                cls = 'bg-red-500/15 border-red-500/40 text-red-300 animate-shake';
                iconCls = 'bg-red-500/30 text-red-300';
              } else {
                cls = 'bg-white/[0.01] border-white/5 text-[#A8B5A0]/50';
                iconCls = 'bg-white/5 text-[#A8B5A0]/30';
              }
            }
            return (
              <button key={i} onClick={() => submitAnswer(i)} disabled={selected !== null}
                data-testid={`quiz-opt-${i}`}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-center gap-3 ${cls} ${selected === null ? 'active:scale-[0.98] hover:border-[#D4AF37]/30' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all ${iconCls}`}>
                  {letters[i]}
                </div>
                <span className="text-sm font-medium">{opt}</span>
                {selected !== null && i === result?.correct_answer && (
                  <span className="ml-auto text-emerald-400 text-lg">✓</span>
                )}
                {selected !== null && i === selected && !result?.correct && (
                  <span className="ml-auto text-red-400 text-lg">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback */}
        {result && (
          <div className={`rounded-xl p-3 mb-3 text-sm border ${
            result.correct ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'
          } animate-fade-in`} data-testid="quiz-feedback">
            <div className="flex items-center gap-2 mb-1.5">
              {result.correct ? <Star size={14} className="text-emerald-400" /> : <Target size={14} className="text-red-400" />}
              <span className="font-bold">{result.correct ? `Doğru! +${result.points_earned}` : 'Yanlış!'}</span>
              {streak >= 3 && result.correct && <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full">{streak}x seri!</span>}
            </div>
            <p className="text-[11px] text-[#A8B5A0] leading-relaxed">{result.explanation}</p>
            {result.source && <p className="text-[9px] text-[#A8B5A0]/60 mt-1">Kaynak: {result.source}</p>}
          </div>
        )}

        {/* Next Button */}
        {selected !== null && (
          <button onClick={nextQuestion} data-testid="quiz-next"
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-[#0A1F14] animate-fade-in"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
            {qi + 1 >= total ? 'Sonuçları Gör' : 'Sonraki Soru'} <ArrowRight size={16} />
          </button>
        )}
      </div>
    );
  }

  return null;
}
