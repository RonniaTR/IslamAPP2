import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppMode } from '../contexts/AppModeContext';
import { canApple, platform } from '../services/authNative';
import { APP_NAME, TAGLINE } from '../config/brand';
import { NurKemer, Yildizlar, GECE } from '../components/giris/giriSahne';

// 🔑 GİRİŞ — kapıdan geçen kişiyi karşılayan ilk oda.
// Google (her yerde), Apple (iPhone/iPad ve web; Apple'ın 4.8 kuralı), Misafir (hesapsız, veri yalnız cihazda).
// Gizlilik politikası her zaman bir dokunuş uzakta (mağaza şartı).

const isAppleDevice = () => platform() === 'ios' || /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '');

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAsGuest, loginWithGoogle, loginWithApple } = useAuth();
  const { resetOnboarding } = useAppMode();
  const apple = useMemo(canApple, []);

  const [showNameInput, setShowNameInput] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [busy, setBusy] = useState(null); // 'google' | 'apple' | 'guest'
  const [error, setError] = useState('');

  const run = async (kind, fn) => {
    setBusy(kind); setError('');
    try {
      const u = await fn();
      if (u) navigate('/', { replace: true });
    } catch (e) {
      const code = String((e && e.code) || '');
      setError(/network/i.test(code)
        ? 'İnternet bağlantısı yok gibi görünüyor. Misafir olarak devam edebilirsin.'
        : 'Giriş tamamlanamadı. Bir daha dener misin?');
    } finally {
      setBusy(null);
    }
  };

  const submitGuestName = () => run('guest', async () => {
    const u = await loginAsGuest(guestName.trim() || 'Misafir');
    resetOnboarding();
    return u;
  });

  const btn = {
    width: '100%', minHeight: 56, borderRadius: 18, fontWeight: 800, fontSize: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
  };

  return (
    <div data-testid="login-page" style={{ minHeight: '100vh', background: GECE.bg, color: GECE.ink, position: 'relative', overflowX: 'hidden', overflowY: 'auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 22px' }}>
      <Yildizlar count={36} />
      <div aria-hidden style={{ position: 'absolute', top: '-10%', left: '50%', width: 520, height: 520, transform: 'translateX(-50%)',
        background: `radial-gradient(circle, ${GECE.glow} 0%, transparent 62%)`, pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 26 }}>
          <NurKemer size={96} />
          <h1 style={{ fontFamily: 'var(--font-heading, "Fraunces", serif)', fontSize: 38, fontWeight: 800, margin: '14px 0 4px', color: GECE.gold, letterSpacing: 0.5 }}>{APP_NAME}</h1>
          <p style={{ margin: 0, color: GECE.soft, fontSize: 15 }}>{TAGLINE}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.045)', border: `1px solid ${GECE.line}`, borderRadius: 28, padding: 20, backdropFilter: 'blur(14px)',
          display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => run('google', loginWithGoogle)} disabled={!!busy}
            data-testid="login-google" style={{ ...btn, background: '#FFFFFF', color: '#1F2937', border: 'none' }}>
            {busy === 'google' ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google ile devam et
              </>
            )}
          </motion.button>

          {apple && (
            <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => run('apple', loginWithApple)} disabled={!!busy}
              data-testid="login-apple" style={{ ...btn, background: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.22)' }}>
              {busy === 'apple' ? <Loader2 className="animate-spin" size={20} /> : (
                <>{isAppleDevice() && <span aria-hidden style={{ fontSize: 20, lineHeight: 1, marginTop: -3 }}>{''}</span>}Apple ile devam et</>
              )}
            </motion.button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
            <span style={{ flex: 1, height: 1, background: GECE.line }} />
            <span style={{ fontSize: 12, color: GECE.soft }}>ya da</span>
            <span style={{ flex: 1, height: 1, background: GECE.line }} />
          </div>

          <AnimatePresence mode="wait">
            {showNameInput ? (
              <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                <input type="text" placeholder="Sana nasıl seslenelim?" value={guestName} maxLength={40} autoFocus
                  onChange={(e) => setGuestName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitGuestName()}
                  data-testid="guest-name"
                  style={{ minHeight: 54, borderRadius: 16, textAlign: 'center', fontWeight: 700, fontSize: 16, outline: 'none',
                    background: 'rgba(255,255,255,0.06)', border: `1px solid ${GECE.line}`, color: GECE.ink }} />
                <button type="button" onClick={submitGuestName} disabled={!!busy} data-testid="guest-go"
                  style={{ ...btn, background: `linear-gradient(135deg, ${GECE.gold}, #E9CF8C)`, color: '#11281F', border: 'none' }}>
                  {busy === 'guest' ? <Loader2 className="animate-spin" size={20} /> : <>Yola çık <LogIn size={19} /></>}
                </button>
              </motion.div>
            ) : (
              <motion.button key="guest" type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowNameInput(true)} disabled={!!busy} data-testid="login-guest"
                style={{ ...btn, background: 'transparent', color: GECE.gold, border: `1px solid ${GECE.gold}55` }}>
                <User size={19} /> Misafir olarak devam et
              </motion.button>
            )}
          </AnimatePresence>

          {error && <p role="alert" style={{ margin: 0, color: '#FCA5A5', fontSize: 13, textAlign: 'center' }}>{error}</p>}
        </div>

        <p style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, lineHeight: 1.5, color: GECE.soft, margin: '16px 6px 0' }}>
          <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1, color: GECE.gold }} />
          <span>
            Misafir girişinde hiçbir bilgin sunucuya gitmez. Hesapla girersen ilerlemen yedeklenir; dilediğin an silebilirsin.{' '}
            <button type="button" onClick={() => navigate('/gizlilik')} style={{ color: GECE.gold, textDecoration: 'underline', fontWeight: 700 }}>Gizlilik politikası</button>
          </span>
        </p>
      </motion.div>
    </div>
  );
}
