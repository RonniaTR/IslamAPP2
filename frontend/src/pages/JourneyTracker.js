import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Star, Check, Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function JourneyTracker() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [journeyData, setJourneyData] = useState(null);

  const currentUserId = user?.user_id || user?.id || localStorage.getItem('islamapp_guest_id');

  useEffect(() => {
    // Try fetching from API, fallback to dummy data
    if (currentUserId) {
      api.get(`/gamification/v2/stats/${currentUserId}`).then(r => {
        const streak = r.data?.current_streak || 0;
        const xp = r.data?.total_xp || 0;
        setJourneyData({ streak, xp });
      }).catch(() => {
        setJourneyData({ streak: 6, xp: 1250 });
      });
    } else {
      setJourneyData({ streak: 6, xp: 1250 });
    }
  }, [currentUserId]);

  const streak = journeyData?.streak || 0;
  const xp = journeyData?.xp || 0;

  // 28-Day Journey based on actual streak
  const days = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    status: i < streak ? 'completed' : i === streak ? 'active' : 'locked'
  }));

  return (
    <div className="min-h-screen pb-28 font-sans" style={{ background: theme.bg, color: theme.textPrimary }}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md p-5 pt-8 shadow-lg"
        style={{ background: `${theme.bg}e0`, borderBottom: `1px solid ${theme.cardBorder}` }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl" style={{ background: `${theme.textSecondary}10`, color: theme.textPrimary }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: theme.gold }}>İman Yolculuğu</h1>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
            style={{ background: `${theme.gold}10`, color: theme.gold, border: `1px solid ${theme.gold}20` }}>
            <Flame size={16} /> <span>{streak}. Gün</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
            style={{ background: `${theme.gold}10`, color: theme.gold, border: `1px solid ${theme.gold}20` }}>
            <Star size={16} /> <span>{xp} XP</span>
          </div>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="flex flex-col items-center pt-8">
        {days.map((item, index) => (
          <div key={item.day} className="flex flex-col items-center">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={item.status === 'active' ? { scale: 1.1 } : {}}
              whileTap={item.status === 'active' ? { scale: 0.95 } : {}}
              disabled={item.status === 'locked'}
              onClick={() => item.status === 'active' && navigate('/quiz')}
              className="w-14 h-14 rounded-full flex items-center justify-center z-10 border-4 transition-all duration-300"
              style={{
                background: item.status === 'completed' ? theme.gold
                  : item.status === 'active' ? theme.bg : theme.surface,
                borderColor: item.status === 'completed' ? theme.gold
                  : item.status === 'active' ? theme.gold : theme.cardBorder,
                color: item.status === 'completed' ? theme.bg
                  : item.status === 'active' ? theme.gold : theme.cardBorder,
                boxShadow: item.status === 'active' ? `0 0 20px ${theme.gold}50` : 'none',
              }}>
              {item.status === 'completed' && <Check size={24} strokeWidth={3} />}
              {item.status === 'active' && <span className="text-xl font-black">{item.day}</span>}
              {item.status === 'locked' && <Lock size={20} />}
            </motion.button>
            
            {/* Connector line */}
            {index !== days.length - 1 && (
              <div className="w-1 h-12"
                style={{ background: item.status === 'completed' ? theme.gold : theme.cardBorder }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
