import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Star, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JourneyTracker() {
  const navigate = useNavigate();
  
  // 28 Günlük Dummy Veri Üretimi
  const days = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    status: i < 5 ? 'completed' : i === 5 ? 'active' : 'locked'
  }));

  return (
    <div className="min-h-screen bg-[#032212] text-[#f7e6ae] font-sans pb-20">
      {/* Üst Bilgi (Header) - Glassmorphism */}
      <div className="sticky top-0 z-50 bg-[#032212]/80 backdrop-blur-md border-b border-[#ffd369]/20 p-6 pt-10 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#ffd369]">İman Yolculuğu</h1>
        <div className="flex justify-between items-center text-[#ffd369] font-bold text-lg">
          <div className="flex items-center gap-2 bg-[#ffd369]/10 px-4 py-2 rounded-full">
            <Flame size={20} className="text-[#ffd369]" /> 
            <span>6. Gün</span>
          </div>
          <div className="flex items-center gap-2 bg-[#ffd369]/10 px-4 py-2 rounded-full">
            <Star size={20} className="text-[#ffd369]" /> 
            <span>1250 XP</span>
          </div>
        </div>
      </div>

      {/* Dikey Zaman Çizelgesi (Timeline) */}
      <div className="flex flex-col items-center pt-12">
        {days.map((item, index) => (
          <div key={item.day} className="flex flex-col items-center">
            <motion.button
              whileHover={item.status === 'active' ? { scale: 1.1 } : {}}
              whileTap={item.status === 'active' ? { scale: 0.95 } : {}}
              disabled={item.status === 'locked'}
              onClick={() => item.status === 'active' && navigate('/quiz')}
              className={`w-16 h-16 rounded-full flex items-center justify-center z-10 border-4 transition-all duration-300
                ${item.status === 'completed' ? 'bg-[#ffd369] border-[#ffd369] text-[#032212]' : ''}
                ${item.status === 'active' ? 'bg-[#032212] border-[#ffd369] shadow-[0_0_20px_rgba(255,211,105,0.6)] text-[#ffd369]' : ''}
                ${item.status === 'locked' ? 'bg-[#0a1710] border-[#1a3a2a] text-[#1a3a2a]' : ''}
              `}
            >
              {item.status === 'completed' && <Check size={28} strokeWidth={3} />}
              {item.status === 'active' && <span className="text-2xl font-black">{item.day}</span>}
              {item.status === 'locked' && <Lock size={24} />}
            </motion.button>
            
            {/* Çizgiler */}
            {index !== days.length - 1 && (
              <div className={`w-1.5 h-16 ${item.status === 'completed' ? 'bg-[#ffd369]' : 'bg-[#1a3a2a]'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
