import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { StatusBar, Style } from '@capacitor/status-bar';

// 🕯️ HALVET (Dijital Arınma) MODU
// Telefon tamamen kararır, ekran kapanmaz, arkada ses ambiyansı çalar.
// Sadece bir Zikir/Odaklanma dairesi bulunur.

export default function HalvetMode() {
  const navigate = useNavigate();
  const [ambientEngine, setAmbientEngine] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let engine = null;
    let didInit = false;

    const setup = async () => {
      // Ekranın kapanmasını engelle
      if (typeof KeepAwake !== 'undefined') {
        try { await KeepAwake.keepAwake(); } catch (e) {}
      }
      
      // Status Bar'ı karart
      if (typeof StatusBar !== 'undefined') {
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#000000' });
        } catch (e) {}
      }
      
      // ambient.js'i dinamik yükleyelim
      const ambient = await import('../services/ambient');
      engine = ambient;
      setAmbientEngine(ambient);
      didInit = true;
      
      // "gece" neyi veya "serenity" başlat
      ambient.play('gece');
      setIsPlaying(true);
    };

    setup();

    return () => {
      if (didInit && engine) {
        engine.stop();
      }
      
      // Geri dönerken normal ayarlara çevir
      if (typeof KeepAwake !== 'undefined') {
        try { KeepAwake.allowSleep(); } catch (e) {}
      }
      if (typeof StatusBar !== 'undefined') {
        try {
          StatusBar.setStyle({ style: Style.Light });
          StatusBar.setBackgroundColor({ color: '#F5F5F0' });
        } catch (e) {}
      }
    };
  }, []);

  const handleTap = () => {
    setCount(c => c + 1);
    // Hafif haptic titreşim eklenebilir
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(15);
    }
  };

  const closeHalvet = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden touch-none"
         style={{ overscrollBehavior: 'none' }}>
         
      <button onClick={closeHalvet}
        className="absolute top-10 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 active:scale-90 transition-transform">
        <X size={24} color="#666" />
      </button>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
        className="text-center absolute top-24">
        <h1 className="text-2xl font-serif text-[#C8A55A] tracking-[0.2em] font-light">HALVET</h1>
        <p className="text-[#666] text-[11px] uppercase tracking-[0.3em] mt-2">Dijital Arınma</p>
      </motion.div>

      {/* Odak Çemberi */}
      <motion.div 
        className="relative w-64 h-64 flex items-center justify-center cursor-pointer"
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}>
        
        {/* Nefes alan aura */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-[#C8A55A]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <div className="w-48 h-48 rounded-full border-[0.5px] border-[#C8A55A]/30 flex items-center justify-center relative backdrop-blur-sm bg-black/50">
           <span className="text-4xl text-[#C8A55A] font-light font-serif">{count}</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1 }}
        className="absolute bottom-16 text-center w-full px-10">
        <p className="text-[#444] text-[13px] font-serif tracking-wide leading-relaxed">
          "Kalpler ancak Allah'ı anmakla mutmain olur."
        </p>
      </motion.div>
    </div>
  );
}
