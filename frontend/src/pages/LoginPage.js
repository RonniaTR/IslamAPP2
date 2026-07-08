import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();

  const { loginAsGuest, loginWithGoogle } = useAuth();

  const [showNameInput, setShowNameInput] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Misafir Butonuna Tıklanınca
  const handleGuestClick = async () => {
    // Tarayıcı hafızasında kayıtlı bir mühür (ID) var mı bakıyoruz
    const savedGuestId = localStorage.getItem('islamapp_guest_id');
    
    if (savedGuestId) {
      // Eskiden giriş yapmış, direkt içeri alıyoruz
      setLoading(true);
      try {
        const user = await loginAsGuest(); // AuthContext içindeki fonksiyona gider
        if (user) navigate('/', { replace: true });
      } catch (error) {
        console.error("Misafir girişi başarısız:", error);
        setShowNameInput(true); // Hata olursa isim sorma ekranına düşsün
      } finally {
        setLoading(false);
      }
    } else {
      // İlk defa giriyor, şık bir animasyonla ismini soruyoruz
      setShowNameInput(true);
    }
  };

  // İsim Yazılıp "Maceraya Başla" Denince
  const submitGuestName = async () => {
    if (!guestName.trim()) {
        alert("Lütfen liderlik tablosu için bir isim giriniz.");
        return;
    }
    setLoading(true);
    try {
      const user = await loginAsGuest(guestName.trim());
      if (user) navigate('/', { replace: true });
    } catch (error) {
      console.error("İsimle giriş başarısız:", error);
      alert("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    if (!loginWithGoogle) {
      setAuthError('Google girişi şu an aktif değil.');
      return;
    }
    setGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) navigate('/', { replace: true });
    } catch (error) {
      const code = error?.code || '';
      // User simply closed the popup — don't show a scary error
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setAuthError(error?.response?.data?.detail || 'Google girişi tamamlanamadı. Lütfen tekrar deneyin.');
      }
      console.error('Google login hatası:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#032212] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <div className="w-[300px] h-[300px] bg-[#ffd369] rounded-full blur-[120px] opacity-10 animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="z-10 w-full max-w-md"
      >
        {/* Logo / Başlık */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-[#ffd369] to-[#d4af37] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,211,105,0.3)] mb-6 transform rotate-3"
          >
            <Sparkles className="text-[#032212]" size={40} />
          </motion.div>
          <h1 className="text-4xl font-black text-[#ffd369] mb-2 tracking-tight">İslamApp</h1>
          <p className="text-[#A8B5A0] text-sm">İlim ve İbadet Yolculuğunuz</p>
        </div>

        {/* Giriş Kartı */}
        <div className="bg-[#1a3a2a]/40 border border-[#ffd369]/20 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl">
          
          <div className="space-y-4">

            {authError && (
              <div className="p-3 rounded-2xl text-xs text-center" style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}>
                {authError}
              </div>
            )}

            {/* Google Girişi */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full bg-white text-gray-800 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-md disabled:opacity-70 transition-all"
            >
              {googleLoading ? <Loader2 className="animate-spin text-gray-600" size={20} /> : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google ile Giriş Yap
                </>
              )}
            </motion.button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#ffd369]/10"></div>
              <span className="flex-shrink-0 mx-4 text-[#A8B5A0] text-xs">veya</span>
              <div className="flex-grow border-t border-[#ffd369]/10"></div>
            </div>

            {/* Misafir Girişi Bölümü */}
            <AnimatePresence mode="wait">
              {showNameInput ? (
                <motion.div 
                  key="name-input"
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full space-y-3 overflow-hidden"
                >
                  <input 
                    type="text" 
                    placeholder="Liderlik tablosu için adınız?" 
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitGuestName()}
                    className="w-full bg-[#032212] border border-[#ffd369]/30 text-[#f7e6ae] font-bold rounded-2xl p-4 outline-none focus:border-[#ffd369] text-center transition-colors placeholder:font-normal placeholder:text-[#A8B5A0]/50"
                    autoFocus
                  />
                  <button 
                    onClick={submitGuestName} 
                    disabled={loading}
                    className="w-full py-4 rounded-2xl font-black text-[#032212] shadow-lg flex justify-center items-center gap-2 transition-all active:scale-95 disabled:opacity-70" 
                    style={{ background: 'linear-gradient(135deg, #ffd369 0%, #d4af37 100%)' }}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20}/> : (
                      <>Maceraya Başla <LogIn size={20} /></>
                    )}
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="guest-button"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleGuestClick}
                  disabled={loading || googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-60 border border-[#ffd369]/30 bg-[#ffd369]/5 text-[#ffd369] font-bold hover:bg-[#ffd369]/10"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <User size={20} />
                      Misafir Olarak Devam Et
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
