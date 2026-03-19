import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Share2, Volume2, Play, Pause, Loader, RefreshCw, Brain, Trophy, Check, X, ChevronDown, ChevronUp, Sparkles, Star } from 'lucide-react';
import { useTTS, shareOrCopy } from '../hooks/useShared';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

/* ─── AI Quiz Modal ─── */
function QuizModal({ quiz, onAnswer, onClose, theme, answered, selectedIdx, earnedPoints }) {
  if (!quiz) return null;
  const isCorrect = answered && selectedIdx === quiz.correct;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg mx-4 mb-4 sm:mb-0 rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: theme.bg, border: `1px solid ${theme.cardBorder}` }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
          <div className="flex items-center gap-2">
            <Brain size={20} style={{ color: theme.gold }} />
            <span className="font-bold text-base" style={{ color: theme.textPrimary }}>Bilgi Testi</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full" style={{ background: `${theme.gold}15` }}>
            <X size={16} style={{ color: theme.gold }} />
          </button>
        </div>

        {/* Question */}
        <div className="px-5 py-4">
          <p className="text-sm font-medium leading-relaxed mb-4" style={{ color: theme.textPrimary }}>{quiz.question}</p>

          <div className="space-y-2.5">
            {quiz.options.map((opt, i) => {
              const letter = ['A', 'B', 'C', 'D'][i];
              let bg = `${theme.gold}08`;
              let border = theme.cardBorder;
              let textColor = theme.textPrimary;

              if (answered) {
                if (i === quiz.correct) { bg = 'rgba(34,197,94,0.15)'; border = 'rgba(34,197,94,0.5)'; textColor = '#22c55e'; }
                else if (i === selectedIdx) { bg = 'rgba(239,68,68,0.15)'; border = 'rgba(239,68,68,0.5)'; textColor = '#ef4444'; }
              }

              return (
                <button key={i} disabled={answered}
                  onClick={() => onAnswer(i)}
                  className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${theme.gold}20`, color: textColor }}>{letter}</span>
                  <span className="text-sm" style={{ color: textColor }}>{opt}</span>
                  {answered && i === quiz.correct && <Check size={16} className="ml-auto text-green-500" />}
                  {answered && i === selectedIdx && i !== quiz.correct && <X size={16} className="ml-auto text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* Result */}
          {answered && (
            <div className="mt-4 p-3.5 rounded-xl animate-fade-in" style={{ background: isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                {isCorrect ? <Trophy size={16} className="text-yellow-500" /> : <X size={16} className="text-red-400" />}
                <span className="text-sm font-bold" style={{ color: isCorrect ? '#22c55e' : '#ef4444' }}>
                  {isCorrect ? `Doğru! +${earnedPoints} Puan 🎉` : 'Yanlış Cevap'}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>{quiz.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {answered && (
          <div className="px-5 pb-5">
            <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: `${theme.gold}20`, color: theme.gold }}>
              Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Expandable Knowledge Card ─── */
function KnowledgeCard({ item, index, theme, tts, onQuiz }) {
  const [expanded, setExpanded] = useState(false);
  const isDeep = item.level === 'deep';

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}>

      {/* Card Header - Always visible */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: isDeep ? 'rgba(139,92,246,0.15)' : `${theme.gold}15`, color: isDeep ? '#a78bfa' : theme.gold }}>
              {isDeep ? '🔬 Derin' : '📗 Temel'}
            </span>
          </div>
          <h3 className="text-[15px] font-semibold leading-snug" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
            {item.title}
          </h3>
        </div>
        <div className="flex-shrink-0 mt-1" style={{ color: theme.textSecondary }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-4 animate-fade-in">
          <div className="rounded-xl p-4 mb-3" style={{ background: `${theme.gold}08`, border: `1px solid ${theme.cardBorder}` }}>
            <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary, opacity: 0.9 }}>{item.content}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => tts.speak(item.content)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
              style={{ background: `${theme.gold}12`, color: theme.gold }}>
              {tts.loading ? <Loader size={12} className="animate-spin" /> : tts.playing ? <Pause size={12} /> : <Volume2 size={12} />}
              Dinle
            </button>
            <button onClick={() => shareOrCopy(item.title, item.content)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
              style={{ background: `${theme.gold}12`, color: theme.gold }}>
              <Share2 size={12} /> Paylaş
            </button>
            <button onClick={() => onQuiz(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ml-auto"
              style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>
              <Brain size={12} /> Kendini Test Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export default function KnowledgeDetail() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [card, setCard] = useState(null);
  const [items, setItems] = useState([]);
  const [levelFilter, setLevelFilter] = useState('all'); // all | basic | deep
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [totalQuizPoints, setTotalQuizPoints] = useState(0);
  const tts = useTTS();

  useEffect(() => {
    api.get(`/knowledge-cards/${cardId}`).then(r => {
      if (!r.data || !Array.isArray(r.data.items)) return;
      setCard(r.data);
      setItems(shuffleArray(r.data.items));
    }).catch(() => navigate('/'));
  }, [cardId, navigate]);

  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const reshuffle = () => { if (card) setItems(shuffleArray(card.items)); };

  const filtered = levelFilter === 'all' ? items : items.filter(i => i.level === levelFilter);
  const basicCount = card ? card.items.filter(i => i.level !== 'deep').length : 0;
  const deepCount = card ? card.items.filter(i => i.level === 'deep').length : 0;

  /* ─── Quiz Logic ─── */
  const startQuiz = useCallback(async (item) => {
    setQuizLoading(true);
    setAnswered(false);
    setSelectedIdx(null);
    setEarnedPoints(0);
    try {
      const { data } = await api.post('/ai/knowledge-quiz', {
        topic_title: item.title,
        topic_content: item.content
      });
      setQuiz(data);
    } catch {
      setQuiz({ question: 'Soru yüklenirken hata oluştu. Lütfen tekrar deneyin.', options: [], correct: -1, explanation: '' });
    } finally {
      setQuizLoading(false);
    }
  }, []);

  const handleAnswer = useCallback(async (idx) => {
    if (answered || !quiz) return;
    setSelectedIdx(idx);
    setAnswered(true);

    if (idx === quiz.correct && user && user.id) {
      try {
        const { data } = await api.post('/gamification/activity', {
          user_id: user.id,
          activity_type: 'knowledge_quiz',
          details: { topic: quiz.question }
        });
        setEarnedPoints(data.points_earned || 50);
        setTotalQuizPoints(prev => prev + (data.points_earned || 50));
      } catch { setEarnedPoints(50); setTotalQuizPoints(prev => prev + 50); }
    }
  }, [answered, quiz, user]);

  if (!card) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.gold, borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="animate-fade-in min-h-screen" style={{ background: theme.bg }} data-testid="knowledge-detail">

      {/* ─── Header ─── */}
      <div className="px-4 pt-10 pb-4 relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${theme.surface} 0%, transparent 100%)` }}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{ background: theme.gold }} />
        <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full opacity-5" style={{ background: theme.gold }} />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 transition-colors" style={{ color: theme.gold }} aria-label="Geri">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Geri</span>
          </button>
          <div className="flex items-center gap-2">
            {totalQuizPoints > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>
                <Star size={12} /> +{totalQuizPoints}
              </span>
            )}
            <button onClick={reshuffle} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: `${theme.gold}12`, color: theme.gold }} data-testid="shuffle-btn">
              <RefreshCw size={14} /> Karıştır
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${theme.gold}15` }}>
            {card.icon || '📖'}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>{card.title}</h1>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {card.items.length} konu · {basicCount} temel · {deepCount} derin
            </p>
          </div>
        </div>
      </div>

      {/* ─── Level Filter Tabs ─── */}
      <div className="px-4 py-3 flex gap-2">
        {[
          { key: 'all', label: 'Tümü', count: card.items.length },
          { key: 'basic', label: '📗 Temel', count: basicCount },
          { key: 'deep', label: '🔬 Derin', count: deepCount },
        ].map(tab => (
          <button key={tab.key} onClick={() => setLevelFilter(tab.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: levelFilter === tab.key ? `${theme.gold}25` : `${theme.gold}08`,
              color: levelFilter === tab.key ? theme.gold : theme.textSecondary,
              border: `1px solid ${levelFilter === tab.key ? `${theme.gold}40` : 'transparent'}`
            }}>
            {tab.label} <span className="opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* ─── AI Quiz Banner ─── */}
      <div className="px-4 mb-3">
        <div className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
          <Sparkles size={20} className="text-purple-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium" style={{ color: theme.textPrimary }}>Yapay Zeka Bilgi Testi</p>
            <p className="text-[10px] mt-0.5" style={{ color: theme.textSecondary }}>Her konuda "Kendini Test Et" ile soru çöz, doğru cevap = +50 puan!</p>
          </div>
          <Trophy size={18} className="text-yellow-500 flex-shrink-0" />
        </div>
      </div>

      {/* ─── Cards ─── */}
      <div className="px-4 space-y-3 pb-6">
        {filtered.length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: theme.textSecondary }}>Bu kategoride henüz konu yok.</p>
        ) : (
          filtered.map((item, i) => (
            <KnowledgeCard key={`${item.title}-${i}`} item={item} index={i} theme={theme} tts={tts} onQuiz={startQuiz} />
          ))
        )}
      </div>

      {/* ─── Quiz Loading Overlay ─── */}
      {quizLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl" style={{ background: theme.bg }}>
            <Loader size={28} className="animate-spin" style={{ color: theme.gold }} />
            <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>Soru hazırlanıyor...</p>
          </div>
        </div>
      )}

      {/* ─── Quiz Modal ─── */}
      {quiz && !quizLoading && (
        <QuizModal quiz={quiz} theme={theme} answered={answered} selectedIdx={selectedIdx} earnedPoints={earnedPoints}
          onAnswer={handleAnswer}
          onClose={() => { setQuiz(null); setAnswered(false); setSelectedIdx(null); }} />
      )}
    </div>
  );
}
