import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Zap, Target, Flame, Trophy } from 'lucide-react';
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

  const userStats = [
    { name: "Kuran", score: 85 }, { name: "Siyer", score: 70 },
    { name: "Fıkıh", score: 58 }, { name: "Hadis", score: 76 },
    { name: "Ahlak", score: 92 }, { name: "Tarih", score: 54 }
  ];

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

  // LOBBY
  if (gameState === 'lobby') {
    const modes = [
      { count: 5, mult: 1.0, title: 'Hızlı Oyun', desc: '5 Soru • 1.0x XP', icon: Zap, color: '#10B981' },
      { count: 10, mult: 1.2, title: 'Klasik Test', desc: '10 Soru • 1.2x XP Çarpanı', icon: Target, color: theme.gold },
      { count: 20, mult: 1.5, title: 'Maraton', desc: '20 Soru • 1.5x Dev XP Bonusu', icon: Flame, color: '#EF4444' },
    ];

    return (
      <div className="min-h-screen flex flex-col items-center pt-8 p-5 font-sans pb-28" style={{ background: theme.bg }}>
        
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-5 rounded-3xl mb-6"
          style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <h2 className="text-lg font-bold mb-0.5 text-center" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>İlim Radarı</h2>
          <p className="text-[10px] text-center mb-4" style={{ color: theme.textSecondary }}>Mevcut bilgi seviyeniz</p>
          
          <div className="relative w-full aspect-square max-w-[200px] mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {[0.25, 0.50, 0.75, 1.0].map((scale, sIdx) => {
                const points = userStats.map((_, i) => {
                  const angle = (i * 2 * Math.PI) / userStats.length;
                  return `${100 + 80 * scale * Math.cos(angle)},${100 + 80 * scale * Math.sin(angle)}`;
                }).join(' ');
                return <polygon key={sIdx} points={points} fill="none" stroke={theme.gold} strokeWidth="0.5" strokeOpacity={sIdx === 3 ? "0.4" : "0.15"} />;
              })}
              <polygon
                points={userStats.map((stat, i) => {
                  const angle = (i * 2 * Math.PI) / userStats.length;
                  const radius = 80 * (stat.score / 100);
                  return `${100 + radius * Math.cos(angle)},${100 + radius * Math.sin(angle)}`;
                }).join(' ')}
                fill={`${theme.gold}30`} stroke={theme.gold} strokeWidth="2"
              />
            </svg>
            {userStats.map((stat, i) => {
              const angle = (i * 2 * Math.PI) / userStats.length;
              const x = 50 + 44 * Math.cos(angle);
              const y = 50 + 44 * Math.sin(angle);
              return (
                <div key={i} className="absolute text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm"
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', background: `${theme.bg}95`, color: theme.textPrimary, border: `1px solid ${theme.cardBorder}` }}>
                  {stat.name}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Game Modes */}
        <div className="w-full max-w-md flex flex-col gap-3">
          <h2 className="font-black text-base mb-1" style={{ color: theme.gold }}>Oyun Modunu Seç</h2>
          
          {modes.map((mode, i) => (
            <motion.button key={i} whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => startGame(mode.count, mode.mult)}
              className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
              style={{ background: theme.surface, border: `1px solid ${mode.color}20` }}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl" style={{ background: `${mode.color}15` }}>
                  <mode.icon size={22} style={{ color: mode.color }} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base" style={{ color: theme.textPrimary }}>{mode.title}</h3>
                  <p className="text-[11px]" style={{ color: theme.textSecondary }}>{mode.desc}</p>
                </div>
              </div>
              <Play size={18} style={{ color: theme.gold }} />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // PLAYING
  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const renderOptions = () => {
    if (currentQ.type === 'tf') {
      return (
        <div className="flex gap-3 w-full mt-4">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(0)}
            className="flex-1 py-7 rounded-2xl text-xl font-black"
            style={{ background: '#10B98115', border: '2px solid #10B98140', color: '#10B981' }}>DOĞRU</motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(1)}
            className="flex-1 py-7 rounded-2xl text-xl font-black"
            style={{ background: '#EF444415', border: '2px solid #EF444440', color: '#EF4444' }}>YANLIŞ</motion.button>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3 w-full">
        {currentQ.options.map((opt, idx) => (
          <motion.button key={idx} whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(idx)}
            className="p-4 rounded-2xl text-base font-semibold text-left pl-5 w-full transition-all"
            style={{ background: `${theme.textSecondary}08`, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }}>
            <span className="font-bold mr-2" style={{ color: theme.gold }}>{['A', 'B', 'C', 'D'][idx]}.</span>{opt}
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 font-sans" style={{ background: theme.bg }}>
      <div className="w-full max-w-lg">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
            style={{ background: theme.surface, color: theme.gold }}>
            <Target size={14} /> Soru {currentIndex + 1}/{questions.length}
          </div>
          
          {streak >= 3 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse"
              style={{ background: '#F9731915', color: '#F97316', border: '1px solid #F9731630' }}>
              <Flame size={14} /> {streak}x Seri (+15 XP)
            </motion.div>
          )}

          <div className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
            style={{ background: theme.surface, color: theme.gold }}>
            <Trophy size={14} /> {Math.round(score)} XP
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 rounded-full overflow-hidden mb-6" style={{ background: `${theme.textSecondary}15` }}>
          <motion.div className="h-full rounded-full" initial={{ width: `${((currentIndex) / questions.length) * 100}%` }} animate={{ width: `${progress}%` }}
            style={{ background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight || theme.gold})` }} />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="w-full">
            <div className="backdrop-blur-xl p-7 rounded-3xl shadow-2xl mb-6 min-h-[200px] flex items-center justify-center relative overflow-hidden"
              style={{ background: theme.cardBg, border: `1px solid ${theme.gold}25` }}>
              <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-2xl font-bold text-[10px]"
                style={{ background: `${theme.gold}10`, color: theme.gold }}>{currentQ.category}</div>
              <h2 className="text-xl md:text-2xl font-extrabold text-center leading-relaxed z-10" style={{ color: theme.textPrimary }}>{currentQ.question}</h2>
            </div>
            {renderOptions()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}