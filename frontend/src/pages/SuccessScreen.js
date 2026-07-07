import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Loader2, Target, Flame, Zap, Star, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

export default function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();
  
  const stats = location.state || { totalScore: 0, baseScore: 0, comboScore: 0, multiplier: 1, correctCount: 0 };
  const [playerName] = useState(localStorage.getItem('islamapp_guest_name') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [revealStep, setRevealStep] = useState(0);

  const getFinalName = () => {
    if (user?.name && user.name !== "Misafir" && user.name !== "Kardeşim") return user.name;
    const localName = localStorage.getItem('islamapp_guest_name');
    if (localName && localName !== "Misafir") return localName;
    return "İlim Yolcusu";
  };

  const getFinalUserId = () => {
    if (user?.user_id) return user.user_id;
    if (user?.id) return user.id;
    return localStorage.getItem('islamapp_guest_id') || 'guest_' + Math.floor(Math.random() * 100000);
  };

  useEffect(() => {
    const timer1 = setTimeout(() => setRevealStep(1), 500);
    const timer2 = setTimeout(() => setRevealStep(2), 1000);
    const timer3 = setTimeout(() => setRevealStep(3), 1500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, []);

  const handleSubmitScore = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    const verifiedName = getFinalName();
    const verifiedUid = getFinalUserId();
    const scoreData = { user_id: verifiedUid, username: verifiedName, score: Math.round(stats.totalScore) || 0, correct: stats.correctCount || 0, total: 10 };

    try {
      try { await api.post('/quiz/submit', scoreData); }
      catch { await api.post('/gamification/leaderboard/submit', { user_id: verifiedUid, username: verifiedName, score: Math.round(stats.totalScore) || 0 }); }
      navigate('/profile'); 
    } catch (error) {
      console.error("Skor mühürleme hatası:", error);
      setErrorMsg("Sunucu bağlantısı sağlanamadı. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
  };

  const unlockedWisdom = "Allah, her zorluğun ardından bir kolaylık yaratacaktır. (Talâk, 7)";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden" style={{ background: theme.bg }}>
      
      {/* Background Effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-[150vw] h-[150vw] md:w-[60vw] md:h-[60vw] rounded-full"
          style={{ background: `conic-gradient(from 0deg, transparent 0 340deg, ${theme.gold}18 360deg)` }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[150px] opacity-20 animate-pulse" style={{ background: theme.gold }} />
      </div>

      <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.4 }}
        className="z-10 backdrop-blur-2xl p-6 md:p-10 rounded-[40px] text-center w-full max-w-lg relative"
        style={{ background: `linear-gradient(180deg, ${theme.surface}f0, ${theme.bg}f0)`, border: `1px solid ${theme.gold}25`, boxShadow: `0 0 80px ${theme.gold}12` }}>
        
        {/* Trophy */}
        <div className="relative mx-auto mb-6 w-24 h-24 md:w-28 md:h-28">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} transition={{ type: "spring", delay: 0.1 }}
            className="absolute inset-0 rounded-full flex items-center justify-center z-10"
            style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight || theme.gold})`, boxShadow: `0 0 40px ${theme.gold}50` }}>
            <Trophy size={48} strokeWidth={2.5} style={{ color: theme.bg }} />
          </motion.div>
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-2 border-dashed rounded-full z-0" style={{ borderColor: `${theme.gold}35` }} />
        </div>

        <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight" style={{ color: theme.gold }}>Harika Bir İş!</h1>
        <p className="text-sm mb-8" style={{ color: theme.textSecondary }}>Zihnini parlattın, XP'leri topladın.</p>

        <AnimatePresence>
          {revealStep >= 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-4 mb-6" style={{ background: `${theme.gold}10`, border: `1px solid ${theme.gold}25` }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: theme.gold }}>
                <Star size={16} fill="currentColor" /><span className="text-xs font-bold uppercase tracking-wider">Kilidi Açılan Hikmet</span>
              </div>
              <p className="text-sm text-left italic leading-relaxed" style={{ color: theme.textPrimary }}>"{unlockedWisdom}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {revealStep >= 2 && (
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl p-5 mb-8 text-left space-y-4"
              style={{ background: `${theme.bg}80`, border: `1px solid ${theme.cardBorder}` }}>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-2" style={{ color: theme.textSecondary }}><Target size={18} style={{ color: '#10B981' }} /> Doğru Cevaplar</span>
                <span className="font-bold text-lg" style={{ color: '#10B981' }}>{stats.correctCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-2" style={{ color: theme.textSecondary }}><Zap size={18} style={{ color: '#3B82F6' }} /> Zorluk Çarpanı</span>
                <span className="font-bold text-lg" style={{ color: '#3B82F6' }}>x{stats.multiplier}</span>
              </div>
              {stats.comboScore > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-2" style={{ color: theme.textSecondary }}><Flame size={18} style={{ color: '#F97316' }} /> Seri Ateşi</span>
                  <span className="font-bold text-lg" style={{ color: '#F97316' }}>+{stats.comboScore}</span>
                </div>
              )}
              <div className="pt-4 mt-2 flex justify-between items-end" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                <span className="font-bold text-sm uppercase tracking-wider" style={{ color: theme.textPrimary }}>Kazanılan XP</span>
                <span className="font-black text-4xl" style={{ color: theme.gold }}>+{Math.round(stats.totalScore)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {revealStep >= 3 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-xs font-bold p-3 rounded-xl flex items-center gap-2 text-left"
                  style={{ background: '#EF444410', border: '1px solid #EF444440', color: '#EF4444' }}>
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              <motion.button whileTap={{ scale: 0.98 }} onClick={handleSubmitScore} disabled={isSubmitting}
                className="w-full py-4 rounded-2xl text-lg font-black flex justify-center items-center gap-2 disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight || theme.gold})`, color: theme.bg, boxShadow: `0 0 20px ${theme.gold}25` }}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : (
                  <>Skoru {getFinalName()} Adına Mühürle <ChevronRight size={20} /></>
                )}
              </motion.button>
              
              <button onClick={() => navigate('/journey')} className="w-full py-2 text-sm font-semibold transition-colors" style={{ color: theme.textSecondary }}>
                Liderliği Es Geç ve Yolculuğa Dön
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}