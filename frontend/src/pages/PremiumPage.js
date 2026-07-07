import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY } from '../styles/designTokens';

export default function PremiumPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const features = [
    'Reklamsız kullanım',
    'Özel içeriklere erişim',
    'İndirme ve çevrimdışı kullanım',
    'Detaylı istatistikler'
  ];

  return (
    <div className="min-h-screen pb-12 flex flex-col" style={{ background: theme.primary }} data-testid="premium-page">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 transition-opacity hover:opacity-70">
          <ChevronLeft size={24} color="#FFF" />
        </button>
        <button className="p-2 transition-opacity hover:opacity-70">
          <MoreVertical size={24} color="#FFF" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 mt-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-[32px] flex items-center justify-center mb-6"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <span className="text-5xl">🕌</span>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-3xl font-extrabold text-white mb-2 text-center"
          style={{ fontFamily: TYPOGRAPHY.fonts.heading }}
        >
          Nur Premium
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-[13px] font-medium text-white/70 mb-12 text-center"
        >
          Daha fazlası için Premium'a geç!
        </motion.p>

        <div className="w-full flex flex-col gap-5 mb-16">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + (idx * 0.1) }}
              className="flex items-center gap-4"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: theme.gold }}>
                <Check size={16} color="#000" strokeWidth={3} />
              </div>
              <span className="text-[15px] font-semibold text-white/90">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="px-6 mt-auto">
        <button 
          className="w-full py-4 rounded-[20px] font-bold text-lg mb-4 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
          style={{ background: theme.gold, color: '#000' }}
        >
          ₺79,99 / Aylık
        </button>
        <button className="w-full py-2 text-[13px] font-semibold text-white/60 hover:text-white transition-colors underline underline-offset-4">
          Satın Alımları Geri Yükle
        </button>
      </motion.div>
    </div>
  );
}
