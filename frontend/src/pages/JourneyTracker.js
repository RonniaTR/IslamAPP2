import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Star, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const TOTAL_DAYS = 28;

export default function JourneyTracker() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const uid = user?.user_id || user?.id;
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    api.get(`/gamification/v2/stats/${uid}`)
      .then(r => {
        setStreak(r.data?.current_streak || 0);
        setXp(r.data?.total_xp || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [uid]);

  // Real streak → timeline. Completed = days already in streak,
  // active = the day the user is currently working toward.
  const activeDay = Math.min(streak + 1, TOTAL_DAYS);
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const day = i + 1;
    const status = day <= streak ? 'completed' : day === activeDay ? 'active' : 'locked';
    return { day, status };
  });

  return (
    <div className="min-h-screen bg-[#032212] text-[#f7e6ae] font-sans pb-20">
      {/* Üst Bilgi (Header) - Glassmorphism */}
      <div className="sticky top-0 z-50 bg-[#032212]/80 backdrop-blur-md border-b border-[#ffd369]/20 p-6 pt-10 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#ffd369]">İman Yolculuğu</h1>
        <div className="flex justify-between items-center text-[#ffd369] font-bold text-lg">
          <div className="flex items-center gap-2 bg-[#ffd369]/10 px-4 py-2 rounded-full">
            <Flame size={20} className="text-[#ffd369]" />
            <span>{loading ? '—' : `${activeDay}. Gün`}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#ffd369]/10 px-4 py-2 rounded-full">
            <Star size={20} className="text-[#ffd369]" />
            <span>{loading ? '—' : `${xp} XP`}</span>
          </div>
        </div>
        {!loading && streak === 0 && (
          <p className="text-xs text-[#f7e6ae]/60 mt-3">
            Bir aktivite tamamlayarak yolculuğuna başla — her gün serini büyütür.
          </p>
        )}
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
