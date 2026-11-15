import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronDown, Info, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLang } from '../../contexts/LangContext';
import { useTx } from '../../i18n';
import { donusPalette, TEMEL_COLORS, alpha } from '../../donus/palette';
import { getTemel } from '../../data/donusTemeller';
import { getModuleSVG, OctaStar } from './../../components/donus/IslamicSVG';

// 🧱 TEMEL — yeniden tasarım
//
// Premium tasarım ilkeleri:
//   · Her modülün konusuna özel SVG arka plan motifi
//   · Basınca ripple + scale efekti
//   · Açılan kartın sol kenarında altın şerit
//   · Arapça metinler cam efektli kutuda
//   · Dairesel ilerleme halkası (SVG circle)
//   · Tamamlama konfeti animasyonu
//   · Tam responsive — mobil, tablet, masaüstü

const READ_KEY = 'donus_temel_read';

const load = () => { try { return JSON.parse(localStorage.getItem(READ_KEY)) || {}; } catch { return {}; } };
const save = (v) => { try { localStorage.setItem(READ_KEY, JSON.stringify(v)); } catch { /* quota */ } };

// Basınca ripple efekti
function Ripple({ color }) {
  return (
    <motion.span
      className="absolute inset-0 rounded-2xl pointer-events-none"
      initial={{ opacity: 0.35, scale: 0 }}
      animate={{ opacity: 0, scale: 2.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ background: `radial-gradient(circle, ${alpha(color, 0.3)} 0%, transparent 70%)` }}
    />
  );
}

// Dairesel ilerleme halkası (SVG)
function ProgressRing({ progress, size = 72, strokeWidth = 4, color, glowColor }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  return (
    <svg width={size} height={size} className="block" style={{ transform: 'rotate(-90deg)' }}>
      {/* Arka plan çemberi */}
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={alpha(color, 0.12)} strokeWidth={strokeWidth} />
      {/* İlerleme çemberi */}
      <motion.circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        strokeDasharray={circumference}
        style={{ filter: `drop-shadow(0 0 6px ${alpha(glowColor || color, 0.5)})` }} />
    </svg>
  );
}

// Konfeti patlaması
function Confetti({ color }) {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      angle: (i / 20) * Math.PI * 2,
      dist: 60 + Math.random() * 80,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 0.3,
    })), []);
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 2, delay: 0.8 }}>
      {particles.map((p, i) => (
        <motion.span key={i} className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: i % 3 === 0 ? color : alpha(color, 0.6) }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0, scale: 0.3,
          }}
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }} />
      ))}
    </motion.div>
  );
}

// WebSpeech seslendirme
function speakText(text, lang = 'tr-TR') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.85;
  u.pitch = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const filtered = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
  if (filtered.length > 0) u.voice = filtered[0];
  window.speechSynthesis.speak(u);
}

function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export default function DonusTemel() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const tt = useTx();
  const navigate = useNavigate();
  const { id } = useParams();

  const temel = useMemo(() => getTemel(id, lang), [id, lang]);
  const [openIdx, setOpenIdx] = useState(-1);
  const [seen, setSeen] = useState(() => (load()[id] || []));
  const [rippleIdx, setRippleIdx] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  useEffect(() => () => stopSpeech(), []);

  const mark = useCallback((i) => {
    if (seen.includes(i)) return;
    const next = [...seen, i];
    setSeen(next);
    const all = load();
    all[id] = next;
    save(all);
    // Tamamlandıysa konfeti göster
    if (temel && next.length === temel.items.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, [seen, id, temel]);

  const handleItemClick = useCallback((i) => {
    setRippleIdx(i);
    setTimeout(() => setRippleIdx(null), 600);
    const nxt = openIdx === i ? -1 : i;
    setOpenIdx(nxt);
    if (nxt !== -1) mark(i);
  }, [openIdx, mark]);

  const toggleSpeak = useCallback((text, isAr) => {
    if (speaking) { stopSpeech(); setSpeaking(false); return; }
    speakText(text, isAr ? 'ar-SA' : 'tr-TR');
    setSpeaking(true);
    // Konuşma bitince state güncelle
    if (window.speechSynthesis) {
      const check = setInterval(() => {
        if (!window.speechSynthesis.speaking) { setSpeaking(false); clearInterval(check); }
      }, 300);
    }
  }, [speaking]);

  if (!temel) {
    return (
      <div className="px-5 pt-10 text-center">
        <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{tt('Bulunamadı')}</p>
        <button onClick={() => navigate('/donus')} className="mt-4 text-[11px] font-black"
          style={{ color: theme.gold }}>{tt('Geri')}</button>
      </div>
    );
  }

  const p = donusPalette(theme, TEMEL_COLORS[temel.color]);
  const pct = temel.items.length ? seen.length / temel.items.length : 0;
  const allDone = seen.length === temel.items.length;
  const ltr = lang === 'ar';
  const dirProps = ltr ? { dir: 'ltr' } : {};
  const dirStyle = ltr ? { textAlign: 'left' } : {};

  // Modüle özel SVG bileşeni
  const ModuleSVG = getModuleSVG(temel.id || id);

  return (
    <div className="px-4 sm:px-5 pt-4 pb-20" ref={contentRef}>
      {/* ── Başlık Bölgesi ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-6">

        {/* Geri butonu */}
        <motion.button onClick={() => navigate('/donus')} whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-5"
          style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }} aria-label={tt('Geri')}>
          <ArrowLeft size={16} style={{ color: p.accent }} />
        </motion.button>

        {/* İkon + SVG arka plan + ilerleme halkası */}
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {/* Dekoratif SVG motifi — arka planda döner */}
            <div className="absolute -inset-3 flex items-center justify-center">
              <ModuleSVG size={100} color={p.accent} opacity={0.12} />
            </div>
            {/* İlerleme halkası */}
            <div className="relative">
              <ProgressRing progress={pct} size={72} strokeWidth={4}
                color={p.accent} glowColor={p.accentGlow} />
              {/* İkon — halkanın ortası */}
              <motion.span className="absolute inset-0 flex items-center justify-center text-3xl"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: `drop-shadow(0 0 14px ${alpha(p.accentGlow, 0.6)})` }}>
                {temel.icon}
              </motion.span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] sm:text-[25px] font-black leading-tight"
              style={{ fontFamily: 'Playfair Display, serif', color: p.text }}>
              {temel.title}
            </h1>
            <p className="text-[11px] sm:text-[12px] mt-1.5" style={{ color: p.accent }}>
              {temel.lead}
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[9px] font-black tabular-nums px-2 py-0.5 rounded-full"
                style={{ background: alpha(p.accent, 0.15), color: p.accent }}>
                {seen.length}/{temel.items.length} {tt('adım')}
              </span>
              <span className="text-[9px] font-bold" style={{ color: p.dim }}>
                {temel.minutes} {tt('dk')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Giriş Kartı ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-2xl p-4 sm:p-5 mb-5 relative overflow-hidden"
        style={{ background: p.cardStrong, border: `1.5px solid ${p.borderSoft}` }}>
        {/* Dekoratif SVG — sağ üst köşe */}
        <div className="absolute -top-4 -right-4 opacity-[0.06] pointer-events-none">
          <OctaStar size={120} color={p.accent} opacity={1} speed={120} />
        </div>
        <p className="text-[12.5px] sm:text-[13px] leading-relaxed relative" {...dirProps}
          style={{ color: p.text, opacity: 0.9, ...dirStyle }}>{temel.intro}</p>
      </motion.div>

      {/* ── Adım Kartları ── */}
      <div className="space-y-3">
        {temel.items.map((it, i) => {
          const open = openIdx === i;
          const isSeen = seen.includes(i);
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: open ? p.cardStrong : p.card,
                border: `1.5px solid ${open ? p.border : p.borderSoft}`,
                boxShadow: open ? `0 8px 32px ${alpha(p.accent, 0.12)}` : 'none',
              }}>

              {/* Sol kenar altın şerit */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 rounded-l-2xl"
                initial={{ width: 0 }}
                animate={{ width: open ? 4 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ background: `linear-gradient(180deg, ${p.accent}, ${p.accentGlow || p.accent})` }} />

              {/* Ripple efekti */}
              <AnimatePresence>
                {rippleIdx === i && <Ripple color={p.accent} />}
              </AnimatePresence>

              {/* Başlık butonu */}
              <motion.button
                whileTap={{ scale: 0.985 }}
                onClick={() => handleItemClick(i)}
                className="w-full p-4 sm:p-[18px] flex items-center gap-3 text-left relative">

                {/* Numara / Tik */}
                <motion.span
                  whileTap={{ scale: 0.85 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 transition-all duration-300"
                  style={{
                    background: isSeen
                      ? `linear-gradient(135deg, ${p.accent}, ${p.accentGlow || p.accent})`
                      : alpha(p.accent, 0.13),
                    color: isSeen ? p.onAccent : p.accent,
                    border: `1.5px solid ${alpha(p.accent, isSeen ? 0.8 : 0.28)}`,
                    boxShadow: isSeen ? `0 2px 12px ${alpha(p.accent, 0.3)}` : 'none',
                  }}>
                  {isSeen ? <Check size={14} strokeWidth={3} /> : i + 1}
                </motion.span>

                <p className="flex-1 text-[13px] sm:text-[13.5px] font-black leading-snug" {...dirProps}
                  style={{ color: p.text, ...dirStyle }}>{it.title}</p>

                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: open ? alpha(p.accent, 0.12) : 'transparent' }}>
                  <ChevronDown size={15} style={{ color: open ? p.accent : p.dim }} />
                </motion.span>
              </motion.button>

              {/* İçerik */}
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="px-4 sm:px-[18px] pb-4 sm:pb-5 pl-[52px] sm:pl-[60px] space-y-3">

                      {/* Arapça metin — cam efektli kutu */}
                      {it.ar && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.4 }}
                          className="rounded-xl p-4 relative overflow-hidden"
                          style={{
                            background: alpha(p.accent, p.isLight ? 0.06 : 0.1),
                            border: `1px solid ${alpha(p.accent, 0.2)}`,
                            backdropFilter: 'blur(8px)',
                          }}>
                          {/* Dekoratif motif */}
                          <div className="absolute -top-2 -right-2 pointer-events-none opacity-[0.06]">
                            <ModuleSVG size={60} color={p.accent} opacity={1} />
                          </div>
                          <p dir="rtl" lang="ar" className="text-[18px] sm:text-[20px] leading-[2.1] text-right relative"
                            style={{
                              fontFamily: "'Amiri', 'Scheherazade New', serif", color: p.accent,
                              textShadow: `0 0 18px ${alpha(p.accentGlow || p.accent, 0.25)}`,
                            }}>
                            {it.ar}
                          </p>
                          {/* Ses butonu */}
                          <motion.button whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); toggleSpeak(it.ar, true); }}
                            className="absolute bottom-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: alpha(p.accent, 0.15), color: p.accent }}>
                            {speaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                          </motion.button>
                        </motion.div>
                      )}

                      {/* Türkçe okunuş */}
                      {it.tr && (
                        <motion.p
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ delay: 0.15 }}
                          className="text-[12px] sm:text-[12.5px] italic leading-relaxed" {...dirProps}
                          style={{ fontFamily: 'Georgia, serif', color: p.text, opacity: 0.85, ...dirStyle }}>
                          "{it.tr}"
                        </motion.p>
                      )}

                      {/* Ana metin */}
                      {it.body && (
                        <motion.p
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-[12.5px] sm:text-[13px] leading-[1.85]" {...dirProps}
                          style={{ color: p.text, opacity: 0.82, ...dirStyle }}>
                          {it.body}
                        </motion.p>
                      )}

                      {/* Türkçe okunuş ses butonu */}
                      {it.tr && (
                        <motion.button whileTap={{ scale: 0.95 }}
                          onClick={(e) => { e.stopPropagation(); toggleSpeak(it.tr, false); }}
                          className="flex items-center gap-1.5 text-[10px] font-black py-1.5 px-3 rounded-lg"
                          style={{ background: alpha(p.accent, 0.1), color: p.accent }}>
                          <Volume2 size={11} /> {tt('Okunuşu dinle')}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ── Not ── */}
      {temel.note && (
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-4 mt-5 flex items-start gap-2.5 relative overflow-hidden"
          style={{ background: p.card, border: `1px solid ${p.borderSoft}` }}>
          <Info size={14} className="shrink-0 mt-0.5" style={{ color: p.accent }} />
          <p className="text-[11px] sm:text-[11.5px] leading-relaxed" {...dirProps}
            style={{ color: p.dim, ...dirStyle }}>{temel.note}</p>
        </motion.div>
      )}

      {/* ── Tamamlandı ── */}
      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-5 mt-5 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${alpha(p.accent, 0.14)}, ${alpha(p.accentGlow || p.accent, 0.08)})`,
            border: `1.5px solid ${p.border}`,
            boxShadow: `0 4px 24px ${alpha(p.accent, 0.15)}`,
          }}>
          {showConfetti && <Confetti color={p.accent} />}
          {/* Arka plan motifi */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <OctaStar size={160} color={p.accent} opacity={0.06} speed={90} />
          </div>
          <motion.span className="text-3xl block mb-2"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            ✨
          </motion.span>
          <p className="text-[13px] font-black relative" style={{ color: p.accent }}>
            ✓ {tt('Bu bölümü bitirdin — istediğin zaman geri dönebilirsin')}
          </p>
          <p className="text-[10.5px] mt-1.5 relative" style={{ color: p.dim }}>
            {temel.items.length} {tt('adım tamamlandı')}
          </p>
        </motion.div>
      )}
    </div>
  );
}
