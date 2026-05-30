import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const totalScore = location.state?.totalScore || 0;

  return (
    <div className="min-h-screen bg-[#032212] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <div className="w-[300px] h-[300px] bg-[#ffd369] rounded-full blur-[120px] opacity-20 animate-pulse" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="z-10 bg-[#0a1710]/90 border-2 border-[#ffd369]/40 backdrop-blur-lg p-10 rounded-[40px] text-center w-full max-w-md shadow-[0_0_50px_rgba(255,211,105,0.2)]"
      >
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mx-auto mb-6 bg-[#ffd369]/20 p-5 rounded-full w-24 h-24 flex items-center justify-center"
        >
          <Trophy className="text-[#ffd369]" size="{48}"/>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black text-[#ffd369] mb-3 drop-shadow-md">Elhamdülillah!</h1>
        <p className="text-xl text-[#f7e6ae] mb-10 opacity-90">Günlük görevini başarıyla tamamladın.</p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.4 }}
          className="w-36 h-36 mx-auto rounded-full bg-[#ffd369]/10 border-4 border-[#ffd369] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,211,105,0.4)] mb-12"
        >
          <span className="text-5xl font-black text-white drop-shadow-lg">+{totalScore}</span>
          <span className="text-xl font-bold text-[#ffd369] mt-1">XP</span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255,211,105,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/journey')}
          className="w-full bg-gradient-to-r from-[#ffd369] to-[#d4af37] text-[#032212] py-4 rounded-2xl text-xl font-extrabold shadow-lg transition-all"
        >
          Yolculuğa Dön
        </motion.button>
      </motion.div>
    </div>
  );
}