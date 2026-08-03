import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Loader2, Target, Flame, Zap, Sparkles, Star, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { useTx } from '../i18n';

export default function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const tt = useTx();
  
  // Gelen verileri emniyete alıyoruz
  const stats = location.state || { totalScore: 0, baseScore: 0, comboScore: 0, multiplier: 1, correctCount: 0 };
  // SuccessScreen.js içinde:
const [playerName, setPlayerName] = useState(localStorage.getItem('islamapp_guest_name') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [revealStep, setRevealStep] = useState(0);

  // GİRİŞTE YAZILAN İSMİ %100 BULMA GARANTİSİ
  const getFinalName = () => {
    if (user?.name && user.name !== "Misafir" && user.name !== "Kardeşim") return user.name;
    const localName = localStorage.getItem('islamapp_guest_name');
    if (localName && localName !== "Misafir") return localName;
    return tt("İlim Yolcusu");
  };

  // SUNUCU İÇİN GÜVENLİ ID
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

    // Veritabanına gidecek temiz paket
    const scoreData = {
      user_id: verifiedUid,
      username: verifiedName,
      score: Math.round(stats.totalScore) || 0,
      correct: stats.correctCount || 0,
      total: 10
    };

    try {
      // Backend'deki çalışan endpoints kombinasyonunu tetikliyoruz
      try {
        await api.post('/quiz/submit', scoreData);
      } catch (err) {
        // Alternatif rotayı dene
        await api.post('/gamification/leaderboard/submit', {
          user_id: verifiedUid,
          username: verifiedName,
          score: Math.round(stats.totalScore) || 0
        });
      }

      // BAŞARILI OLUNCA DİREKT PROFİL ANA MENÜSÜNE ATAR
      navigate('/profile'); 
    } catch (error) {
      console.error("Skor mühürleme hatası:", error);
      setErrorMsg(tt("Sunucu bağlantısı sağlanamadı. Lütfen tekrar deneyin."));
      setIsSubmitting(false);
    }
  };

  const unlockedWisdom = tt("Allah, her zorluğun ardından bir kolaylık yaratacaktır. (Talâk, 7)");

  return (
    <div className="min-h-screen bg-[#032212] flex flex-col items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden">
      
      {/* Efektler */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
         <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-[150vw] h-[150vw] md:w-[60vw] md:h-[60vw] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,211,105,0.1)_360deg)] rounded-full" />
         <div className="absolute w-[300px] h-[300px] bg-[#ffd369] rounded-full blur-[150px] opacity-20 animate-pulse" />
      </div>

      <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.4 }} className="z-10 bg-gradient-to-b from-[#0a1710]/95 to-[#032212]/95 border border-[#ffd369]/30 backdrop-blur-2xl p-6 md:p-10 rounded-[40px] text-center w-full max-w-lg shadow-[0_0_80px_rgba(255,211,105,0.15)] relative">
        
        <div className="relative mx-auto mb-6 w-24 h-24 md:w-28 md:h-28">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} transition={{ type: "spring", delay: 0.1 }} className="absolute inset-0 bg-gradient-to-br from-[#ffd369] to-[#d4af37] rounded-full shadow-[0_0_40px_rgba(255,211,105,0.5)] flex items-center justify-center z-10">
            <Trophy className="text-[#032212]" size={48} strokeWidth={2.5}/>
          </motion.div>
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 border-2 border-dashed border-[#ffd369]/40 rounded-full z-0" />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-[#ffd369] mb-2 tracking-tight">{tt('Harika Bir İş!')}</h1>
        <p className="text-sm text-[#A8B5A0] mb-8">{tt("Zihnini parlattın, XP'leri topladın.")}</p>

        <AnimatePresence>
          {revealStep >= 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#ffd369]/10 border border-[#ffd369]/30 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2 text-[#ffd369]"><Star size={16} fill="currentColor"/><span className="text-xs font-bold uppercase tracking-wider">{tt('Kilidi Açılan Hikmet')}</span></div>
              <p className="text-sm text-[#f7e6ae] text-left italic leading-relaxed">"{unlockedWisdom}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {revealStep >= 2 && (
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-black/40 border border-white/5 rounded-3xl p-5 mb-8 text-left space-y-4 shadow-inner">
              <div className="flex justify-between items-center"><span className="text-[#A8B5A0] text-sm flex items-center gap-2"><Target size={18} className="text-emerald-400"/> {tt('Doğru Cevaplar')}</span><span className="text-emerald-400 font-bold text-lg">{stats.correctCount}</span></div>
              <div className="flex justify-between items-center"><span className="text-[#A8B5A0] text-sm flex items-center gap-2"><Zap size={18} className="text-blue-400"/> {tt('Zorluk Çarpanı')}</span><span className="text-blue-400 font-bold text-lg">x{stats.multiplier}</span></div>
              {stats.comboScore > 0 && <div className="flex justify-between items-center"><span className="text-[#A8B5A0] text-sm flex items-center gap-2"><Flame size={18} className="text-orange-400"/> {tt('Seri Ateşi')}</span><span className="text-orange-400 font-bold text-lg">+{stats.comboScore}</span></div>}
              <div className="border-t border-white/10 pt-4 mt-2 flex justify-between items-end"><span className="text-[#f7e6ae] font-bold text-sm uppercase tracking-wider">{tt('Kazanılan XP')}</span><span className="text-[#ffd369] font-black text-4xl">+{Math.round(stats.totalScore)}</span></div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {revealStep >= 3 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold p-3 rounded-xl flex items-center gap-2 text-left">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {/* DİNAMİK VE DOĞRULANMIŞ İSİMLE ÇALIŞAN AKILLI BUTON */}
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                onClick={handleSubmitScore} 
                disabled={isSubmitting} 
                className="w-full bg-gradient-to-r from-[#ffd369] via-[#f7e6ae] to-[#d4af37] text-[#032212] py-4 rounded-2xl text-lg font-black shadow-[0_0_20px_rgba(255,211,105,0.3)] flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : (
                  <>Skoru {getFinalName()} Adına Mühürle <ChevronRight size={20} /></>
                )}
              </motion.button>
              
              <button onClick={() => navigate('/journey')} className="w-full text-[#A8B5A0] py-2 text-sm font-semibold hover:text-white transition-colors">
                {tt('Liderliği Es Geç ve Yolculuğa Dön')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
      </motion.div>
    </div>
  );
}