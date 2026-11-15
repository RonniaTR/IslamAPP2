import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 w-full z-[100] flex justify-center pt-2 pointer-events-none"
        >
          <div className="bg-red-500 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold pointer-events-auto">
            <WifiOff size={14} />
            İnternet bağlantısı yok, çevrimdışı moddasınız
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
