import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Zap, Target, Flame, Trophy } from 'lucide-react';
// 400+ soruluk birleşik bankadan çeker (quizData + büyük havuz)
import { drawQuestions as getRandomQuestions } from '../data/questionBank';
import { useTx } from '../i18n';

export default function QuizEngine() {
  const tt = useTx();
  const navigate = useNavigate();
  
  // OYUN DURUMLARI: 'lobby' | 'playing'
  const [gameState, setGameState] = useState('lobby');
  
  // OYUN İÇİ DEĞİŞKENLER
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [comboBonus, setComboBonus] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  // ÖRNEK İSTATİSTİKLER (Radar Grafik İçin)
  // Not: Bunu gerçek versiyonda backend'den alabilirsin
  const userStats = [
    { name: "Kuran", score: 85 }, { name: "Siyer", score: 70 },
    { name: "Fıkıh", score: 58 }, { name: "Hadis", score: 76 },
    { name: "Ahlak", score: 92 }, { name: "Tarih", score: 54 }
  ];

  // OYUNU BAŞLATMA FONKSİYONU
  const startGame = (count, mult) => {
    setMultiplier(mult);
    setQuestions(getRandomQuestions(count));
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setComboBonus(0);
    setGameState('playing');
  };

  // CEVAPLAMA FONKSİYONU
  const handleAnswer = (selectedIndex) => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedIndex === currentQ.correct_index;
    
    let currentScoreAdd = 0;
    
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Combo hesaplama (3 ve üzeri seride +15 bonus)
      const currentCombo = newStreak >= 3 ? 15 : 0;
      setComboBonus(prev => prev + currentCombo);
      
      currentScoreAdd = (currentQ.points * multiplier) + currentCombo;
      setScore(prev => prev + currentScoreAdd);
    } else {
      setStreak(0); // Yanlışta seri sıfırlanır
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Oyun Bitti -> Success Ekranına Gönder (Detaylı verilerle)
        const finalScore = score + currentScoreAdd;
        navigate('/success', { 
          state: { 
            totalScore: Math.round(finalScore),
            baseScore: Math.round(finalScore - comboBonus),
            comboScore: comboBonus,
            multiplier: multiplier,
            correctCount: isCorrect ? streak + 1 : streak // Basit doğru sayısı tahmini
          } 
        });
      }
    }, 500);
  };

  // ----------------------------------------------------
  // EKRAN 1: OYUN LOBİSİ (Radar Grafik + Mod Seçimi)
  // ----------------------------------------------------
  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen bg-[#032212] flex flex-col items-center pt-10 p-6 font-sans pb-24">
        
        {/* Radar Grafikli Mevcut Durum */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-[#1a3a2a]/30 p-6 rounded-[30px] border border-[#ffd369]/20 shadow-lg mb-8">
          <h2 className="text-xl font-extrabold mb-1 text-[#f7e6ae] text-center">{tt('İlim Radarı')}</h2>
          <p className="text-[10px] text-center text-[#A8B5A0] mb-6">{tt('Mevcut bilgi seviyeniz. XP kazandıkça grafik genişler.')}</p>
          
          <div className="relative w-full aspect-square max-w-[220px] mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {[0.25, 0.50, 0.75, 1.0].map((scale, sIdx) => {
                const points = userStats.map((_, i) => {
                  const angle = (i * 2 * Math.PI) / userStats.length;
                  const x = 100 + 80 * scale * Math.cos(angle);
                  const y = 100 + 80 * scale * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ');
                return <polygon key={sIdx} points={points} fill="none" stroke="#ffd369" strokeWidth="0.5" strokeOpacity={sIdx === 3 ? "0.4" : "0.15"} />;
              })}
              <polygon
                points={userStats.map((stat, i) => {
                  const angle = (i * 2 * Math.PI) / userStats.length;
                  const radius = 80 * (stat.score / 100);
                  const x = 100 + radius * Math.cos(angle);
                  const y = 100 + radius * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ')}
                fill="rgba(255, 211, 105, 0.3)" stroke="#ffd369" strokeWidth="2"
              />
            </svg>
            {/* Radar İsimleri */}
            {userStats.map((stat, i) => {
              const angle = (i * 2 * Math.PI) / userStats.length;
              const x = 50 + 44 * Math.cos(angle);
              const y = 50 + 44 * Math.sin(angle);
              return (
                <div key={i} className="absolute text-[9px] font-bold text-[#f7e6ae] bg-[#032212] border border-[#ffd369]/30 px-1.5 py-0.5 rounded shadow-sm" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
                  {stat.name}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Oyun Modları */}
        <div className="w-full max-w-md flex flex-col gap-4">
          <h2 className="text-[#ffd369] font-black text-lg mb-2">{tt('Oyun Modunu Seç')}</h2>
          
          <button onClick={() => startGame(5, 1.0)} className="w-full flex items-center justify-between bg-gradient-to-r from-[#1a3a2a] to-[#0a1710] border border-[#ffd369]/20 p-4 rounded-2xl active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500/20 p-3 rounded-full"><Zap className="text-emerald-400" size={24}/></div>
              <div className="text-left">
                <h3 className="text-[#f7e6ae] font-bold text-lg">{tt('Hızlı Oyun')}</h3>
                <p className="text-[#A8B5A0] text-xs">5 Soru • 1.0x XP</p>
              </div>
            </div>
            <Play className="text-[#ffd369]" size={20}/>
          </button>

          <button onClick={() => startGame(10, 1.2)} className="w-full flex items-center justify-between bg-gradient-to-r from-[#1a3a2a] to-[#0a1710] border border-[#ffd369]/40 p-4 rounded-2xl active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-[#ffd369]/20 p-3 rounded-full"><Target className="text-[#ffd369]" size={24}/></div>
              <div className="text-left">
                <h3 className="text-[#f7e6ae] font-bold text-lg">Klasik Test</h3>
                <p className="text-[#A8B5A0] text-xs">{tt('10 Soru • 1.2x XP Çarpanı')}</p>
              </div>
            </div>
            <Play className="text-[#ffd369]" size={20}/>
          </button>

          <button onClick={() => startGame(20, 1.5)} className="w-full flex items-center justify-between bg-gradient-to-r from-[#1a3a2a] to-[#0a1710] border border-[#ffd369]/20 p-4 rounded-2xl active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-red-500/20 p-3 rounded-full"><Flame className="text-red-400" size={24}/></div>
              <div className="text-left">
                <h3 className="text-[#f7e6ae] font-bold text-lg">Maraton</h3>
                <p className="text-[#A8B5A0] text-xs">20 Soru • 1.5x Dev XP Bonusu</p>
              </div>
            </div>
            <Play className="text-[#ffd369]" size={20}/>
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // EKRAN 2: AKTİF OYUN EKRANI
  // ----------------------------------------------------
  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const renderOptions = () => {
    if (currentQ.type === 'tf') {
      return (
        <div className="flex gap-4 w-full mt-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(0)} className="flex-1 bg-emerald-600/20 border-2 border-emerald-500/50 text-emerald-400 py-8 rounded-3xl text-2xl font-black shadow-lg">{tt('DOĞRU')}</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(1)} className="flex-1 bg-red-600/20 border-2 border-red-500/50 text-red-400 py-8 rounded-3xl text-2xl font-black shadow-lg">{tt('YANLIŞ')}</motion.button>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4 w-full">
        {currentQ.options.map((opt, idx) => (
          <motion.button key={idx} whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,211,105,0.15)', borderColor: '#ffd369' }} whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(idx)} className="bg-white/5 border border-[#ffd369]/20 text-white p-5 rounded-2xl text-lg font-semibold text-left pl-6 w-full shadow-md">
            <span className="text-[#ffd369] mr-3 font-bold">{['A', 'B', 'C', 'D'][idx]}.</span>{opt}
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#032212] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg">
        
        {/* Üst Bilgi Barı */}
        <div className="flex justify-between items-center text-[#ffd369] mb-4">
          <div className="bg-[#1a3a2a] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
             <Target size={16}/> Soru {currentIndex + 1}/{questions.length}
          </div>
          
          {/* Dinamik Seri (Streak) Göstergesi */}
          {streak >= 3 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-orange-500/20 text-orange-400 border border-orange-500/50 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 animate-pulse">
              <Flame size={16}/> {streak}x Seri (+15 XP)
            </motion.div>
          )}

          <div className="bg-[#1a3a2a] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
             <Trophy size={16}/> {Math.round(score)} XP
          </div>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="h-2 bg-[#1a3a2a] rounded-full overflow-hidden mb-8">
          <motion.div className="h-full bg-gradient-to-r from-[#ffd369] to-[#d4af37]" initial={{ width: `${((currentIndex) / questions.length) * 100}%` }} animate={{ width: `${progress}%` }} />
        </div>

        {/* Soru */}
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="w-full">
            <div className="bg-white/5 backdrop-blur-xl border border-[#ffd369]/30 p-8 rounded-[30px] shadow-2xl mb-8 min-h-[220px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#ffd369]/10 text-[#ffd369] px-4 py-1 rounded-bl-2xl font-bold text-xs">{currentQ.category}</div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#f7e6ae] text-center leading-relaxed z-10">{currentQ.question}</h2>
            </div>
            {renderOptions()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}