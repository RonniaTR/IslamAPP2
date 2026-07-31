import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Music } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLang } from '../../contexts/LangContext';
import { useTx } from '../../i18n';
import ambient from '../../services/ambient';
import { donusPalette, PHASE_COLORS, alpha } from '../../donus/palette';
import { getReturnDay, getTodayPhase, isReturnMode, LAST_DAY } from '../../services/returnEngine';
import DoorOpening from './DoorOpening';

// 🕯️ DÖNÜŞ ODASI KABUĞU
//
// Uygulamanın içinde AYRI BİR MOD. Kendi kabuğu var: alt menü yok, kendi
// üst çubuğu, kendi arka planı, kendi sesi. Ama tema uygulamanın temasıdır
// — ana menüden Koyu/Aydınlık/Zümrüt değiştirildiğinde burası da değişir.
//
// Çıkış her ekranda tek dokunuş uzakta: kimse burada kilitli kalmaz.

const AMB_KEY = 'donus_ambient';
const DOOR_KEY = 'donus_door_seen';

/** Yükselen nur zerreleri — odanın "canlı" hissi. */
function Aura({ p }) {
  const dots = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    left: (i * 137.508) % 100,
    size: 2 + ((i * 7) % 4),
    dur: 9 + ((i * 3) % 8),
    delay: (i % 9) * 1.1,
    drift: ((i % 5) - 2) * 14,
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 0 }}>
      {/* Üstten inen yumuşak ışık huzmesi */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: 460, height: 460,
          background: `radial-gradient(circle, ${alpha(p.accentGlow, p.isLight ? 0.18 : 0.22)} 0%, transparent 68%)`,
          filter: 'blur(14px)',
        }} />
      {dots.map((d, i) => (
        <motion.span key={i} className="absolute rounded-full"
          style={{
            left: `${d.left}%`, bottom: -12, width: d.size, height: d.size,
            background: p.accentGlow,
            boxShadow: `0 0 ${d.size * 3}px ${alpha(p.accentGlow, 0.9)}`,
            opacity: p.isLight ? 0.5 : 0.75,
          }}
          animate={{ y: [-10, -640], x: [0, d.drift, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'linear' }} />
      ))}
    </div>
  );
}

/** Ses kumandası — uygulamanın mevcut ambient servisini birebir kullanır. */
function AmbientDock({ p }) {
  const tt = useTx();
  const [state, setState] = useState(() => ambient.getState());
  const [open, setOpen] = useState(false);

  useEffect(() => ambient.subscribe(setState), []);

  return (
    <div className="relative">
      <button
        onClick={() => { if (state.playing) setOpen(o => !o); else { ambient.start(); setOpen(true); } }}
        aria-label={tt('Arka plan sesi')}
        className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
        style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }}>
        {state.playing
          ? <Volume2 size={15} style={{ color: p.accent }} />
          : <VolumeX size={15} style={{ color: p.dim }} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="absolute right-0 top-11 w-56 rounded-2xl p-3 z-30"
            style={{ background: p.card, border: `1px solid ${p.border}`, boxShadow: p.shadow, backdropFilter: 'blur(14px)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black flex items-center gap-1" style={{ color: p.accent }}>
                <Music size={11} /> {tt('Arka plan sesi')}
              </span>
              <button onClick={() => { ambient.stop(); setOpen(false); }}
                className="text-[9.5px] font-bold" style={{ color: p.dim }}>
                {tt('Kapat')}
              </button>
            </div>
            <div className="space-y-1">
              {ambient.TRACKS.map(tr => (
                <button key={tr.id} onClick={() => ambient.setTrack(tr.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left"
                  style={{
                    background: state.track === tr.id ? p.cardTint : 'transparent',
                    border: `1px solid ${state.track === tr.id ? p.border : 'transparent'}`,
                  }}>
                  <span className="text-sm">{tr.icon}</span>
                  <span className="text-[10.5px] font-bold flex-1 truncate"
                    style={{ color: state.track === tr.id ? p.accent : p.text }}>{tr.name}</span>
                </button>
              ))}
            </div>
            <input type="range" min="0" max="1" step="0.05" value={state.volume}
              onChange={(e) => ambient.setVolume(Number(e.target.value))}
              aria-label={tt('Ses seviyesi')}
              className="w-full mt-2.5 accent-current" style={{ color: p.accent }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DonusShell() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const tt = useTx();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [door, setDoor] = useState(false);

  const day = Math.min(getReturnDay(), LAST_DAY);
  const phase = getTodayPhase(day);
  const p = donusPalette(theme, PHASE_COLORS[phase.id]);
  const isRtl = lang === 'ar';

  // Kapı açılışı: oturum başına bir kez
  useEffect(() => {
    let seen = true;
    try { seen = sessionStorage.getItem(DOOR_KEY) === '1'; } catch { /* ignore */ }
    if (!seen) setDoor(true);
  }, []);

  // Odaya girerken arka plan sesi — kullanıcı daha önce açtıysa hatırlanır.
  // Tarayıcılar dokunuşsuz ses başlatmaya izin vermez; ilk dokunuşta açılır.
  useEffect(() => {
    let want = false;
    try { want = localStorage.getItem(AMB_KEY) === '1'; } catch { /* ignore */ }
    if (!want) return;
    const kick = () => { ambient.start(); window.removeEventListener('pointerdown', kick); };
    window.addEventListener('pointerdown', kick, { once: true });
    return () => window.removeEventListener('pointerdown', kick);
  }, []);

  // Odadan çıkarken ses de sussun; tercih hatırlanır.
  useEffect(() => () => {
    try { localStorage.setItem(AMB_KEY, ambient.getState().playing ? '1' : '0'); } catch { /* ignore */ }
    ambient.stop();
  }, []);

  // Zemini temaya eşitle
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = theme.bg;
    return () => { document.body.style.background = prev; };
  }, [theme.bg]);

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  // Dönüş modunda olmayan biri doğrudan gelirse yola gönder
  if (!isReturnMode()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
        style={{ background: theme.bg }}>
        <span className="text-5xl mb-4">🕯️</span>
        <p className="text-sm font-black mb-2" style={{ color: theme.textPrimary }}>
          {tt('Bu bölüm Geri Dönüş yoluna özeldir')}
        </p>
        <p className="text-[11px] mb-6 max-w-xs" style={{ color: theme.textSecondary }}>
          {tt('Değerlendirmede "uzun süredir ara verdim" seçeneğini işaretlersen bu yol açılır.')}
        </p>
        <button onClick={() => navigate('/yol')} className="py-3 px-6 rounded-2xl text-sm font-black"
          style={{ background: theme.gold, color: theme.id === 'light' ? '#fff' : '#0B1220' }}>
          {tt('Yola dön')}
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full max-w-[520px] md:max-w-[760px] mx-auto relative ${isRtl ? 'rtl' : 'ltr'}`}
      dir={isRtl ? 'rtl' : 'ltr'} style={{ background: p.bg }} data-testid="donus-shell">

      <AnimatePresence>
        {door && (
          <DoorOpening onDone={() => {
            try { sessionStorage.setItem(DOOR_KEY, '1'); } catch { /* ignore */ }
            setDoor(false);
          }} />
        )}
      </AnimatePresence>

      <Aura p={p} />

      {/* ── Üst çubuk ── */}
      <div className="sticky top-0 z-20 px-4 py-3 flex items-center gap-2"
        style={{
          background: p.isLight ? alpha('#FFFFFF', 0.82) : alpha(theme.bg, 0.82),
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${p.borderSoft}`,
        }}>
        <button onClick={() => navigate('/yol')}
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }}
          aria-label={tt('Uygulamaya dön')}>
          <X size={16} style={{ color: p.dim }} />
        </button>

        <button onClick={() => navigate('/donus')} className="flex-1 min-w-0 text-left active:opacity-70">
          <p className="text-[8.5px] font-black uppercase tracking-[0.32em]" style={{ color: p.accent }}>
            {tt('Dönüş Odası')}
          </p>
          <p className="text-[11px] font-black truncate" style={{ color: p.text }}>
            {phase.emoji} {tt(phase.name)} · {tt('Gün')} {day}/{LAST_DAY}
          </p>
        </button>

        <AmbientDock p={p} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <Outlet />
      </div>

      {/* ── Çıkış ── */}
      <div className="px-5 pb-10 pt-4 relative" style={{ zIndex: 1 }}>
        <button onClick={() => navigate('/yol')}
          className="w-full py-3 rounded-2xl text-[11.5px] font-black active:scale-97 transition-transform"
          style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}`, color: p.dim }}>
          {tt('Uygulamaya dön')}
        </button>
      </div>
    </div>
  );
}
