import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Compass, HeartHandshake, Sunrise, Gamepad2, WifiOff, Bell, Check } from 'lucide-react';
import { useAppMode } from '../contexts/AppModeContext';
import { useLang } from '../contexts/LangContext';
import notifications from '../services/notifications';
import { GECE, Yildizlar } from './giris/giriSahne';

// ✨ İLK KARŞILAMA (yetişkin) — önceden 13 adımdı; şimdi 2 adım, istenirse tek dokunuşla atlanır.
//   1) Bu kapının ardında: uygulamada GERÇEKTEN olanlar (abartısız).
//   2) Son dokunuş: dil + vakit hatırlatması (izin gerçekten istenir ve Ayarlar'la aynı yere kaydedilir).
const NOTIF_KEY = 'notif_prefs_v2';

const OZELLIKLER = [
  { icon: BookOpen, t: "Kur'an ve meal", d: 'Oku, dinle, ezberle; meal ve tefsir internetsiz de açılır.' },
  { icon: Compass, t: 'Namaz ve kıble', d: 'Şehrine göre vakitler, kıble pusulası, hatırlatma.' },
  { icon: HeartHandshake, t: 'Dua ve zikir', d: 'Günlük dualar, tesbihat, sabah akşam zikirleri.' },
  { icon: Sunrise, t: 'Dönüş yolu', d: 'Kırk günlük, kendi hızında bir yol.' },
  { icon: Gamepad2, t: 'Bilgi oyunları', d: 'Hikmet Çarkı, 12 Basamak ve daha fazlası.' },
  { icon: WifiOff, t: 'Çevrimdışı', d: 'İnternet gitse de temel bölümler çalışır.' },
];

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [notifOn, setNotifOn] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');
  const { completeOnboarding } = useAppMode();
  const { lang, setLang, LANGUAGES } = useLang();

  const finish = () => { completeOnboarding(); onComplete(); };

  const toggleNotif = async () => {
    if (notifOn) { setNotifOn(false); saveNotif(false); setNotifMsg(''); return; }
    let ok = false;
    try { ok = await notifications.requestPermission(); } catch { ok = false; }
    setNotifOn(ok); saveNotif(ok);
    setNotifMsg(ok ? 'Vakitten 10 dakika önce hatırlatacağız.' : 'İzin verilmedi. Ayarlar\'dan sonra açabilirsin.');
  };
  const saveNotif = (enabled) => {
    try {
      const prev = JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}');
      localStorage.setItem(NOTIF_KEY, JSON.stringify({ minutes: 10, prayers: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'], ...prev, enabled }));
    } catch { /* kota */ }
  };

  const primary = { minHeight: 56, width: '100%', maxWidth: 380, borderRadius: 18, border: 'none', fontWeight: 800, fontSize: 16,
    background: `linear-gradient(135deg, ${GECE.gold}, #EBD394)`, color: '#11281F', cursor: 'pointer' };

  return (
    <div data-testid="onboarding" style={{ minHeight: '100vh', background: GECE.bg, color: GECE.ink, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Yildizlar count={30} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1].map((i) => <span key={i} style={{ width: i === step ? 26 : 8, height: 8, borderRadius: 4, background: i <= step ? GECE.gold : 'rgba(255,255,255,0.18)', transition: 'all .3s' }} />)}
        </div>
        <button type="button" onClick={finish} data-testid="onb-skip" style={{ color: GECE.soft, fontWeight: 700, fontSize: 14, minHeight: 40, padding: '0 10px' }}>Atla</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 20px 28px', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="s0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} style={{ width: '100%', maxWidth: 460 }}>
              <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-heading, "Fraunces", serif)', fontSize: 28, margin: '0 0 6px' }}>Bu kapının ardında</h2>
              <p style={{ textAlign: 'center', color: GECE.soft, margin: '0 0 20px', fontSize: 14 }}>Hepsi tek yerde, sade ve reklamsız.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10 }}>
                {OZELLIKLER.map(({ icon: Icon, t, d }, i) => (
                  <motion.div key={t} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.08 * i, type: 'spring', stiffness: 160, damping: 18 }}
                    style={{ padding: 14, borderRadius: 20, background: 'rgba(255,255,255,0.045)', border: `1px solid ${GECE.line}` }}>
                    <Icon size={22} color={GECE.gold} />
                    <div style={{ fontWeight: 800, fontSize: 15, margin: '8px 0 4px' }}>{t}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.45, color: GECE.soft }}>{d}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} style={{ width: '100%', maxWidth: 420 }}>
              <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-heading, "Fraunces", serif)', fontSize: 28, margin: '0 0 18px' }}>Son dokunuş</h2>
              <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: GECE.gold, margin: '0 0 8px' }}>DİL</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
                {LANGUAGES.map((l) => (
                  <button type="button" key={l.code} onClick={() => setLang(l.code)}
                    style={{ minHeight: 46, padding: '0 16px', borderRadius: 23, fontWeight: 700, fontSize: 14, display: 'flex', gap: 8, alignItems: 'center',
                      background: lang === l.code ? GECE.gold : 'rgba(255,255,255,0.05)', color: lang === l.code ? '#11281F' : GECE.ink,
                      border: `1px solid ${lang === l.code ? GECE.gold : GECE.line}` }}>
                    <span>{l.flag}</span>{l.name}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: GECE.gold, margin: '0 0 8px' }}>HATIRLATMA</p>
              <button type="button" onClick={toggleNotif} data-testid="onb-notif"
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, textAlign: 'start',
                  background: 'rgba(255,255,255,0.045)', border: `1px solid ${notifOn ? GECE.gold : GECE.line}`, color: GECE.ink }}>
                <Bell size={22} color={GECE.gold} />
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: 800 }}>Namaz vakti hatırlatması</span>
                  <span style={{ display: 'block', fontSize: 12, color: GECE.soft, marginTop: 2 }}>Kaçırılan vakit için uyarı gönderilmez; yalnız davet.</span>
                </span>
                <span style={{ width: 28, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: notifOn ? GECE.gold : 'transparent', border: `2px solid ${notifOn ? GECE.gold : GECE.line}` }}>
                  {notifOn && <Check size={16} color="#11281F" />}
                </span>
              </button>
              {notifMsg && <p style={{ fontSize: 12, color: GECE.soft, margin: '8px 4px 0' }}>{notifMsg}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ padding: '0 20px max(28px, env(safe-area-inset-bottom))', display: 'flex', justifyContent: 'center', zIndex: 2 }}>
        <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={step === 0 ? () => setStep(1) : finish} data-testid="onb-next" style={primary}>
          {step === 0 ? 'Devam' : 'Bismillah, başlayalım'}
        </motion.button>
      </div>
    </div>
  );
}
