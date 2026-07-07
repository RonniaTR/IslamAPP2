import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Zap, Target, Flame, Trophy, ChevronLeft, Award } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getRandomQuestions } from '../data/quizData'; 

export default function QuizEngine() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [gameState, setGameState] = useState('lobby');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [comboBonus, setComboBonus] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const startGame = (count, mult) => {
    setMultiplier(mult);
    setQuestions(getRandomQuestions(count));
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setComboBonus(0);
    setGameState('playing');
  };

  const handleAnswer = (selectedIndex) => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedIndex === currentQ.correct_index;
    
    let currentScoreAdd = 0;
    
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const currentCombo = newStreak >= 3 ? 15 : 0;
      setComboBonus(prev => prev + currentCombo);
      currentScoreAdd = (currentQ.points * multiplier) + currentCombo;
      setScore(prev => prev + currentScoreAdd);
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      setStreak(0);
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        const finalScore = score + currentScoreAdd;
        navigate('/success', { 
          state: { 
            totalScore: Math.round(finalScore),
            baseScore: Math.round(finalScore - comboBonus),
            comboScore: comboBonus,
            multiplier: multiplier,
            correctCount: isCorrect ? streak + 1 : streak
          } 
        });
      }
    }, 500);
  };

  // ─── LOBBY ───
  if (gameState === 'lobby') {
    const modes = [
      { count: 5, mult: 1.0, title: 'Hızlı Oyun', desc: '5 Soru • 1.0x Puan', icon: Zap, color: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
      { count: 10, mult: 1.2, title: 'Klasik Test', desc: '10 Soru • 1.2x Puan', icon: Target, color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
      { count: 20, mult: 1.5, title: 'Maraton', desc: '20 Soru • 1.5x Puan', icon: Flame, color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444, #DC2626)' },
    ];

    return (
      <div className="min-h-screen pb-24" style={{ background: theme.bg }} data-testid="quiz-lobby">
        {/* Header / Hero Section */}
        <div 
          className="relative pt-12 pb-12 px-5 rounded-b-[40px] shadow-sm mb-8 overflow-hidden" 
          style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)' }}
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800)', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10">
            {/* Top Bar with Back Button */}
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={() => navigate(-1)} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md transition-transform active:scale-95"
              >
                <ChevronLeft size={24} color="#FFF" />
              </button>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1">
                  <Trophy size={14} color="#FBBF24" />
                  <span className="text-white text-xs font-bold">1250 Puan</span>
                </div>
              </div>
            </div>

            {/* Intro Text */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-[20px] backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 shadow-lg">
                <Award size={32} color="#FBBF24" />
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Kendini Test Et</h1>
              <p className="text-white/80 text-sm font-medium px-4 leading-relaxed">
                İslami bilgini ölç, puanları topla ve liderlik tablosunda yüksel. Hangi modda yarışmak istersin?
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="px-5">
          <h2 className="text-[17px] font-extrabold mb-4" style={{ color: theme.textPrimary }}>Oyun Modunu Seç</h2>
          
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {modes.map((mode, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startGame(mode.count, mode.mult)}
                  className="w-full text-left p-4 rounded-[24px] shadow-sm flex items-center gap-4 relative overflow-hidden"
                  style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}
                >
                  <div className="w-16 h-16 rounded-[18px] flex items-center justify-center shrink-0 shadow-inner relative z-10" style={{ background: mode.gradient }}>
                    <mode.icon size={28} color="#FFF" />
                  </div>
                  <div className="flex-1 relative z-10 py-1">
                    <h3 className="text-[16px] font-extrabold mb-1" style={{ color: theme.textPrimary }}>{mode.title}</h3>
                    <p className="text-[12px] font-semibold" style={{ color: theme.textSecondary }}>{mode.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10" style={{ background: `${mode.color}15` }}>
                    <Play size={18} color={mode.color} className="ml-0.5" />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAYING STATE ───
  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col font-sans pb-10 pt-6 px-5" style={{ background: theme.bg }}>
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setGameState('lobby')} className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors" style={{ background: theme.surface, borderColor: theme.cardBorder }}>
          <ChevronLeft size={24} style={{ color: theme.textPrimary }} />
        </button>
        
        <div className="flex gap-3">
          {streak >= 3 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-200">
              <Flame size={14} className="text-orange-500" />
              <span className="text-xs font-bold text-orange-600">{streak}x Seri!</span>
            </motion.div>
          )}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full shadow-sm border" style={{ background: theme.surface, borderColor: theme.cardBorder }}>
            <Trophy size={14} style={{ color: theme.gold }} />
            <span className="text-xs font-bold" style={{ color: theme.textPrimary }}>{score}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold mb-2" style={{ color: theme.textSecondary }}>
          <span>Soru {currentIndex + 1}</span>
          <span>{questions.length} Soru</span>
        </div>
        <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: theme.cardBorder }}>
          <motion.div 
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} 
            className="h-full rounded-full" 
            style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.gold})` }} 
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full flex-1 flex flex-col"
      >
        <div className="flex-1 flex items-center justify-center mb-8 px-2">
          <h2 className="text-2xl font-bold text-center leading-snug" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
            {currentQ.question}
          </h2>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
          {currentQ.options.map((opt, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(i)}
              className="w-full text-left p-4 rounded-2xl border-2 transition-colors relative overflow-hidden"
              style={{ background: theme.surface, borderColor: theme.cardBorder, color: theme.textPrimary }}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold opacity-70" style={{ background: theme.bg }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-[15px] font-semibold">{opt}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

    </div>
  );
}