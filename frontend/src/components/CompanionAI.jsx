import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// 🤖 YOL ARKADAŞIM (Proaktif AI)
// Belirli şartlar sağlandığında kullanıcıyı motive etmek için kendiliğinden açılır.
// Tüm sayfaların üzerinde float eder (App.js'e eklenir).

export default function CompanionAI() {
  const [message, setMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Sadece ana sayfada veya dönüş yolunda çalışsın
    if (location.pathname !== '/' && !location.pathname.startsWith('/donus')) return;

    // Basit bir kural motoru
    const checkAI = () => {
      try {
        const lastSeenStr = localStorage.getItem('last_seen_date');
        const todayStr = new Date().toDateString();
        
        // Bugün ilk defa giriyorsa
        if (lastSeenStr !== todayStr) {
          localStorage.setItem('last_seen_date', todayStr);
          
          if (lastSeenStr) {
            const lastDate = new Date(lastSeenStr);
            const diffDays = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 2) {
              // 2 günden fazladır yok
              setMessage("Birkaç gündür buralarda değildin. Seni görmek ne güzel. Derin bir nefes al ve nerede kaldıysan oradan başla.");
              setIsVisible(true);
            } else if (Math.random() > 0.7) {
              // %30 ihtimalle rastgele motivasyon
              setMessage("Bugün kalbine neşe, ruhuna ferahlık dolsun. Yolculuğunda harika gidiyorsun.");
              setIsVisible(true);
            }
          }
        }
      } catch (e) {}
    };

    // Açılıştan 3 saniye sonra kontrol et
    const timer = setTimeout(checkAI, 3000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isVisible || !message) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-24 left-4 right-4 z-50 pointer-events-auto"
      >
        <div 
          className="relative overflow-hidden rounded-3xl p-5 shadow-2xl backdrop-blur-md"
          style={{ 
            background: 'rgba(20, 30, 25, 0.85)',
            border: '1px solid rgba(200, 165, 90, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(200,165,90,0.1)'
          }}
        >
          {/* Arka plan ışığı */}
          <motion.div 
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(200, 165, 90, 0.2)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 active:scale-90"
          >
            <X size={16} color="#EAF5EE" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1"
                 style={{ background: 'linear-gradient(135deg, #1A7A42, #0D5C2F)' }}>
              <Sparkles size={20} color="#C8A55A" />
            </div>
            <div className="pr-6">
              <h4 className="text-[12px] font-black tracking-wider uppercase mb-1" style={{ color: '#C8A55A' }}>
                Yol Arkadaşın
              </h4>
              <p className="text-[14px] leading-relaxed" style={{ color: '#EAF5EE', fontFamily: 'Georgia, serif' }}>
                {message}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
