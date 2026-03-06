import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, XCircle, ArrowRight, RotateCw, Trophy } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function QuizPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const [categories, setCategories] = useState([]);
  const [session, setSession] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/quiz/categories').then(r => setCategories(r.data)).catch(() => {}); }, []);

  const startQuiz = async (category) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/quiz/solo/start?user_id=${user?.user_id || 'guest'}&category=${category}&question_count=10`);
      setSession(data); setCurrentQ(0); setScore(0); setCorrectCount(0); setFinished(false); setSelectedAnswer(null); setResult(null);
    } catch {} finally { setLoading(false); }
  };

  const submitAnswer = async (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    try {
      const { data } = await api.post(`/quiz/solo/${session.session_id}/answer?question_index=${currentQ}&answer=${idx}&time_taken=10`);
      setResult(data); setScore(prev => prev + data.points_earned); if (data.correct) setCorrectCount(prev => prev + 1);
    } catch {}
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= session.questions.length) { api.post(`/quiz/solo/${session.session_id}/finish`).catch(() => {}); setFinished(true); return; }
    setCurrentQ(prev => prev + 1); setSelectedAnswer(null); setResult(null);
  };

  if (finished) {
    const pct = Math.round((correctCount / session.questions.length) * 100);
    return (
      <div className="animate-fade-in px-5 pt-16 text-center" data-testid="quiz-result">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444'}
              strokeWidth="3" strokeDasharray={`${pct} ${100 - pct}`} className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{pct}%</span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">{t.quiz_complete}</h2>
        <p className="text-gray-400 text-sm mb-6">{correctCount}/{session.questions.length} {t.correct}</p>
        <div className="glass rounded-2xl p-5 mb-6 mx-auto max-w-xs">
          <p className="text-3xl font-bold text-emerald-400">{score}</p>
          <p className="text-xs text-gray-500">{t.total_score}</p>
        </div>
        <button onClick={() => { setSession(null); setFinished(false); }} data-testid="quiz-restart-btn"
          className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium flex items-center gap-2 mx-auto">
          <RotateCw size={16} /> {t.new_quiz}
        </button>
      </div>
    );
  }

  if (session) {
    const q = session.questions[currentQ];
    return (
      <div className="animate-fade-in px-4 pt-10" data-testid="quiz-game">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500">{currentQ + 1}/{session.questions.length}</span>
          <span className="text-sm font-bold text-emerald-400">{score}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${((currentQ + 1) / session.questions.length) * 100}%` }} />
        </div>
        <div className="glass rounded-xl p-4 mb-4"><p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p></div>
        <div className="space-y-2 mb-4">
          {q.options.map((opt, i) => {
            let cls = 'bg-white/5 border-white/10 text-gray-300';
            if (selectedAnswer !== null) {
              if (i === result?.correct_answer) cls = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
              else if (i === selectedAnswer && !result?.correct) cls = 'bg-red-500/20 border-red-500/50 text-red-300';
            }
            return (<button key={i} onClick={() => submitAnswer(i)} disabled={selectedAnswer !== null}
              data-testid={`quiz-option-${i}`} className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${cls}`}>
              <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
            </button>);
          })}
        </div>
        {result && (
          <div className={`rounded-xl p-3 mb-4 text-sm flex items-center gap-2 ${result.correct ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
            {result.correct ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span className="font-semibold">{result.correct ? t.correct : t.wrong}</span>
            {result.points_earned > 0 && <span className="ml-auto text-xs">+{result.points_earned}</span>}
          </div>
        )}
        {selectedAnswer !== null && (
          <button onClick={nextQuestion} data-testid="quiz-next-btn"
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium flex items-center justify-center gap-2">
            {currentQ + 1 >= session.questions.length ? t.see_results : t.next_question} <ArrowRight size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in" data-testid="quiz-categories">
      <div className="bg-gradient-to-b from-rose-900/30 to-transparent px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-2"><Award size={24} className="text-rose-400" /><h1 className="text-xl font-bold text-white">{t.quiz}</h1></div>
        <p className="text-sm text-gray-400">{t.quiz_desc}</p>
      </div>
      <div className="px-4 space-y-3 pb-6">
        {categories.map(c => (
          <button key={c.id} onClick={() => startQuiz(c.id)} disabled={loading} data-testid={`quiz-category-${c.id}`}
            className="w-full text-left glass rounded-xl p-4 transition-all hover:border-rose-500/20 active:scale-[0.98]">
            <p className="text-sm font-semibold text-white">{c.name}</p>
            <p className="text-xs text-gray-500 mt-1">{c.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
