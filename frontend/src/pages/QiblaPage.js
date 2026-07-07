import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Navigation, Map, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';
import { useLang } from '../contexts/LangContext';

export default function QiblaPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { selectedCity } = useLang();
  
  const [heading, setHeading] = useState(0);
  const qiblaAngle = 147; // Default for Istanbul roughly
  
  useEffect(() => {
    // Basic compass logic simulation
    const handleOrientation = (e) => {
      let alpha = e.alpha;
      if (e.webkitCompassHeading) {
        alpha = e.webkitCompassHeading;
      }
      if (alpha !== null) setHeading(alpha);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, []);

  const compassRotation = -heading;

  return (
    <div className="min-h-screen pb-24 flex flex-col" style={{ background: theme.bg }} data-testid="qibla-page">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
          <ChevronLeft size={24} style={{ color: theme.textPrimary }} />
          <span className="font-extrabold text-xl tracking-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
            Kıble Pusulası
          </span>
        </button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
          <span className="text-lg">🕋</span>
        </div>
      </div>

      {/* Compass Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 mt-8">
        <div className="relative w-[300px] h-[300px] flex items-center justify-center rounded-full" 
             style={{ background: theme.surface, boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: `1px solid ${theme.cardBorder}` }}>
          
          {/* Compass Marks */}
          <div className="absolute inset-4 rounded-full border-2" style={{ borderColor: `${theme.cardBorder}` }}></div>
          
          {/* N/S/E/W */}
          <div className="absolute top-2 text-[10px] font-bold" style={{ color: theme.primary }}>K</div>
          <div className="absolute bottom-2 text-[10px] font-bold" style={{ color: theme.textSecondary }}>G</div>
          <div className="absolute right-2 text-[10px] font-bold" style={{ color: theme.textSecondary }}>D</div>
          <div className="absolute left-2 text-[10px] font-bold" style={{ color: theme.textSecondary }}>B</div>

          {/* Needle Container */}
          <motion.div 
            className="w-full h-full relative flex items-center justify-center transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            {/* The Needle */}
            <div className="w-8 h-[220px] relative flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[110px]" style={{ borderBottomColor: theme.primary }} />
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[110px]" style={{ borderTopColor: '#E5E7EB' }} />
              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white" style={{ background: theme.primary }} />
            </div>
            
            {/* Qibla Indicator */}
            <div className="absolute top-0 w-2 h-2 rounded-full" style={{ background: theme.gold, transform: `rotate(${qiblaAngle}deg) translateY(-110px)` }} />
          </motion.div>
        </div>

        {/* Info */}
        <div className="mt-12 text-center">
          <p className="text-lg font-bold mb-1" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
            Kıble
          </p>
          <p className="text-3xl font-extrabold mb-2" style={{ color: theme.primary }}>
            {qiblaAngle}°
          </p>
          <p className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
            {selectedCity || 'İstanbul, Türkiye'}
          </p>
        </div>
      </div>

      {/* Sub Bottom Nav specific to Prayer/Qibla if desired (mocked for visual fidelity) */}
      <div className="mx-4 mt-auto mb-6 p-2 rounded-2xl flex items-center justify-between" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
        {[
          { icon: <Navigation size={20} />, label: 'Vakitler', active: false },
          { icon: <Compass size={20} />, label: 'Kıble', active: true },
          { icon: <Map size={20} />, label: 'Harita', active: false },
        ].map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 py-2">
            <div style={{ color: item.active ? theme.primary : theme.textSecondary }}>
              {item.icon}
            </div>
            <span className="text-[9px] font-bold" style={{ color: item.active ? theme.primary : theme.textSecondary }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
