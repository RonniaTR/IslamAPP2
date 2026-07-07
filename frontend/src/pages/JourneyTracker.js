import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Star, Check, Lock, ArrowLeft, Home, BookOpen, Heart, Gamepad2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Typography } from '../components/ui/Typography';
import api from '../api';

export default function JourneyTracker() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [journeyData, setJourneyData] = useState({ streak: 6, xp: 1250 });

  const currentUserId = user?.user_id || user?.id || localStorage.getItem('islamapp_guest_id');

  useEffect(() => {
    // Try fetching from API, fallback to dummy data
    if (currentUserId) {
      api.get(`/gamification/v2/stats/${currentUserId}`).then(r => {
        const streak = r.data?.current_streak || 6;
        const xp = r.data?.total_xp || 1250;
        setJourneyData({ streak, xp });
      }).catch(() => {
        setJourneyData({ streak: 6, xp: 1250 });
      });
    } else {
      setJourneyData({ streak: 6, xp: 1250 });
    }
  }, [currentUserId]);

  const streak = journeyData.streak;
  const xp = journeyData.xp;

  // 14-Day Journey sample for visual display
  const days = Array.from({ length: 14 }, (_, i) => ({
    day: i + 1,
    status: i + 1 < streak ? 'completed' : i + 1 === streak ? 'active' : 'locked'
  }));

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: '120px', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 10, background: theme.bg }}>
        <button onClick={() => navigate(-1)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: theme.surface, border: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textPrimary }}>
          <ArrowLeft size={20} />
        </button>
        <Typography variant="h3" color="primary">İman Yolculuğu</Typography>
      </div>

      {/* Top Stats Bar */}
      <div style={{ padding: '0 20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', background: `${theme.gold}15`, border: `1px solid ${theme.gold}30` }}>
          <Flame size={16} color={theme.gold} /> 
          <Typography variant="bodySmall" weight={700} color="gold">{streak}. Gün</Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', background: `${theme.gold}15`, border: `1px solid ${theme.gold}30` }}>
          <Star size={16} color={theme.gold} /> 
          <Typography variant="bodySmall" weight={700} color="gold">{xp} XP</Typography>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
        {days.map((item, index) => (
          <div key={item.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            
            {/* The Node */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 2 }}>
              
              <div style={{ width: '60px', textAlign: 'right' }}>
                <Typography variant="bodySmall" weight={600} color={item.status === 'locked' ? 'muted' : 'primary'}>
                  {item.day}. Gün
                </Typography>
              </div>

              <motion.button
                whileHover={item.status === 'active' ? { scale: 1.1 } : {}}
                whileTap={item.status === 'active' ? { scale: 0.95 } : {}}
                disabled={item.status === 'locked'}
                style={{
                  width: item.status === 'active' ? '64px' : '48px',
                  height: item.status === 'active' ? '64px' : '48px',
                  borderRadius: item.status === 'active' ? '24px' : '50%',
                  background: item.status === 'completed' ? theme.gold : item.status === 'active' ? theme.surfaceLight : theme.bg,
                  border: `2px solid ${item.status === 'completed' ? theme.gold : item.status === 'active' ? theme.gold : theme.cardBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: item.status === 'active' ? `0 0 20px ${theme.gold}40` : 'none',
                  cursor: item.status === 'locked' ? 'default' : 'pointer'
                }}>
                {item.status === 'completed' && <Check size={20} color={theme.bg} strokeWidth={3} />}
                {item.status === 'active' && <Home size={28} color={theme.gold} />}
                {item.status === 'locked' && <Lock size={20} color={theme.textMuted} />}
              </motion.button>
              
              <div style={{ width: '60px' }} /> {/* Spacer for alignment */}
            </div>

            {/* Connecting Line */}
            {index !== days.length - 1 && (
              <div style={{ 
                width: '4px', 
                height: '50px', 
                background: item.status === 'completed' ? theme.gold : theme.cardBorder,
                margin: '4px 0',
                position: 'relative',
                zIndex: 1
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <div style={{ position: 'fixed', bottom: '80px', left: 0, right: 0, padding: '0 20px', zIndex: 20 }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '100px',
            background: theme.primaryGradient,
            color: '#FFF',
            border: 'none',
            fontSize: '16px',
            fontWeight: 700,
            boxShadow: '0 8px 32px rgba(13, 92, 47, 0.4)',
            cursor: 'pointer'
          }}
        >
          Günlük Görevleri Gör
        </button>
      </div>

    </div>
  );
}
