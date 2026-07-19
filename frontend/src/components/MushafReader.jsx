import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize, Minimize, Play, Pause, X, Type, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// 🕌 MUSHAF GÖRÜNÜMÜ — tam ekran, kesintisiz sağdan-sola Arapça okuma.
// Kur'an metni akan bir bütün olarak dizilir; her ayetin sonunda
// Arap rakamlı bir madalyon (﴾١﴿) bulunur. Ayete dokununca altta meal
// kartı açılır. Tam ekran, yazı boyutu ve "ekranı açık tut" desteklenir.
// Not: Telifli mushaf hattı/görseli kullanılmaz — metin cihaz fontuyla
// (Amiri) dizilir; alınan şey yalnızca okuma DÜZENİ mantığıdır.

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toArabicDigits = (n) => String(n).replace(/\d/g, d => AR_DIGITS[d]);

const FONT_SIZES = [22, 26, 30, 34, 40];
const LS_FONT = 'mushaf_font';
const LS_AWAKE = 'mushaf_awake';

export default function MushafReader({ surah, initialVerse, onClose, onPosition }) {
  const { theme } = useTheme();
  const verses = useMemo(() => (Array.isArray(surah?.verses) ? surah.verses : []), [surah]);

  const [fontIdx, setFontIdx] = useState(() => {
    const v = parseInt(localStorage.getItem(LS_FONT), 10);
    return Number.isInteger(v) && v >= 0 && v < FONT_SIZES.length ? v : 2;
  });
  const [chrome, setChrome] = useState(true);          // üst/alt barlar görünür mü
  const [activeVerse, setActiveVerse] = useState(null); // dokunulan ayet (meal kartı)
  const [isFull, setIsFull] = useState(false);
  const [keepAwake, setKeepAwake] = useState(() => localStorage.getItem(LS_AWAKE) === '1');
  const [progress, setProgress] = useState(0);
  const [playingNo, setPlayingNo] = useState(null);

  const scrollRef = useRef(null);
  const audioRef = useRef(null);
  const wakeRef = useRef(null);
  const posRef = useRef(initialVerse || 1);

  // ── Tam ekran ──
  const toggleFullscreen = useCallback(() => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen?.();
    } catch { /* desteklenmiyor */ }
  }, []);
  useEffect(() => {
    const onFs = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // ── Ekranı açık tut (Wake Lock) ──
  useEffect(() => {
    let cancelled = false;
    const request = async () => {
      try {
        if (keepAwake && navigator.wakeLock && !cancelled) {
          wakeRef.current = await navigator.wakeLock.request('screen');
        }
      } catch { /* izin yok */ }
    };
    if (keepAwake) {
      request();
      const onVis = () => { if (document.visibilityState === 'visible') request(); };
      document.addEventListener('visibilitychange', onVis);
      return () => {
        cancelled = true;
        document.removeEventListener('visibilitychange', onVis);
        try { wakeRef.current?.release(); } catch { /* ignore */ }
        wakeRef.current = null;
      };
    }
    try { wakeRef.current?.release(); } catch { /* ignore */ }
    wakeRef.current = null;
    return undefined;
  }, [keepAwake]);

  // ── Açılışta hedef ayete git ──
  useEffect(() => {
    if (!initialVerse || initialVerse <= 1) return;
    const el = document.getElementById(`mushaf-v-${initialVerse}`);
    if (el) setTimeout(() => el.scrollIntoView({ block: 'center' }), 60);
  }, [initialVerse]);

  // ── Kaydırma: ilerleme + görünen ayeti izle ──
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 1);
    // Ekranın üst üçte birine en yakın ayeti "kaldığın yer" olarak izle
    const marker = el.getBoundingClientRect().top + el.clientHeight * 0.3;
    let best = posRef.current;
    let bestDist = Infinity;
    for (const v of verses) {
      const s = document.getElementById(`mushaf-v-${v.number}`);
      if (!s) continue;
      const d = Math.abs(s.getBoundingClientRect().top - marker);
      if (d < bestDist) { bestDist = d; best = v.number; }
    }
    posRef.current = best;
  }, [verses]);

  // ── Kapanış: pozisyonu bildir, sesleri durdur, tam ekrandan çık ──
  const close = useCallback(() => {
    try { audioRef.current?.pause(); } catch { /* ignore */ }
    if (document.fullscreenElement) { try { document.exitFullscreen(); } catch { /* ignore */ } }
    onPosition?.(posRef.current);
    onClose();
  }, [onClose, onPosition]);

  useEffect(() => () => {
    try { audioRef.current?.pause(); } catch { /* ignore */ }
    try { wakeRef.current?.release(); } catch { /* ignore */ }
  }, []);

  const playVerse = useCallback((v) => {
    if (!v.audio_url) return;
    if (playingNo === v.number) { audioRef.current?.pause(); setPlayingNo(null); return; }
    try { audioRef.current?.pause(); } catch { /* ignore */ }
    const a = new Audio(v.audio_url);
    audioRef.current = a;
    a.onended = () => setPlayingNo(null);
    a.play().catch(() => {});
    setPlayingNo(v.number);
  }, [playingNo]);

  const tapVerse = useCallback((v, e) => {
    e.stopPropagation();
    posRef.current = v.number;
    onPosition?.(v.number);
    setActiveVerse(prev => (prev?.number === v.number ? null : v));
  }, [onPosition]);

  const fontSize = FONT_SIZES[fontIdx];
  const active = activeVerse;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col" style={{ background: theme.bg }}>
      {/* İlerleme çizgisi */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-20" style={{ background: `${theme.gold}15` }}>
        <div className="h-full transition-all duration-200" style={{ width: `${progress * 100}%`, background: theme.gold }} />
      </div>

      {/* Üst bar */}
      <AnimatePresence>
        {chrome && (
          <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 z-10"
            style={{ background: `${theme.surface}f2`, borderBottom: `1px solid ${theme.cardBorder}`, backdropFilter: 'blur(14px)' }}>
            <button onClick={close} className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
              style={{ background: `${theme.gold}10` }} aria-label="Kapat">
              <ArrowLeft size={17} style={{ color: theme.gold }} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
                {surah.number}. {surah.name}
              </p>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>
                🕌 Mushaf Görünümü · {surah.total_verses || verses.length} ayet · {surah.revelation}
              </p>
            </div>
            {/* Yazı boyutu */}
            <button onClick={() => setFontIdx(i => { const n = (i + 1) % FONT_SIZES.length; localStorage.setItem(LS_FONT, String(n)); return n; })}
              className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
              style={{ background: `${theme.gold}10` }} aria-label="Yazı boyutu">
              <Type size={15} style={{ color: theme.gold }} />
            </button>
            {/* Ekranı açık tut */}
            <button onClick={() => setKeepAwake(k => { localStorage.setItem(LS_AWAKE, k ? '0' : '1'); return !k; })}
              className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
              style={{ background: keepAwake ? `${theme.gold}25` : `${theme.gold}10` }}
              aria-label="Ekranı açık tut" title="Ekranı açık tut">
              <Sun size={15} style={{ color: keepAwake ? theme.gold : theme.textSecondary }} />
            </button>
            {/* Tam ekran */}
            <button onClick={toggleFullscreen} className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
              style={{ background: `${theme.gold}10` }} aria-label="Tam ekran">
              {isFull ? <Minimize size={15} style={{ color: theme.gold }} /> : <Maximize size={15} style={{ color: theme.gold }} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sayfa */}
      <div ref={scrollRef} onScroll={onScroll} onClick={() => { setChrome(c => !c); setActiveVerse(null); }}
        className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-[46rem] mx-auto px-5 md:px-10 py-8">
          {/* Sure başlığı süslemesi */}
          <div className="text-center mb-6 select-none">
            <div className="inline-block px-8 py-3 rounded-2xl relative"
              style={{ border: `1.5px solid ${theme.gold}35`, background: `${theme.gold}06` }}>
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px] px-2" style={{ background: theme.bg, color: theme.gold }}>✦</span>
              <p className="text-3xl" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: theme.gold }}>
                {surah.arabic_name}
              </p>
            </div>
            {surah.number !== 1 && surah.number !== 9 && (
              <p className="mt-5 text-xl" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: `${theme.gold}99` }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            )}
          </div>

          {/* Akan mushaf metni */}
          <p dir="rtl" className="mushaf-text select-none"
            style={{ fontSize, lineHeight: 2.15, color: `${theme.textPrimary}f2`, '--gold': theme.gold }}>
            {verses.map(v => (
              <span key={v.number} id={`mushaf-v-${v.number}`}
                onClick={(e) => tapVerse(v, e)}
                className="mushaf-ayah"
                style={active?.number === v.number || playingNo === v.number
                  ? { background: `${theme.gold}1c`, borderRadius: 8 }
                  : undefined}>
                {v.arabic}
                <span className="mushaf-medallion" style={{ borderColor: `${theme.gold}70`, color: theme.gold }}>
                  {toArabicDigits(v.number)}
                </span>
              </span>
            ))}
          </p>

          {/* Sure sonu */}
          <div className="text-center mt-8 mb-24 select-none">
            <span className="text-xs tracking-[0.5em]" style={{ color: `${theme.gold}70` }}>✦ ✦ ✦</span>
            <p className="text-[10px] mt-2" style={{ color: theme.textSecondary }}>
              {surah.name} sûresi sona erdi · Sadakallahülazîm
            </p>
          </div>
        </div>
      </div>

      {/* Alt bilgi barı */}
      <AnimatePresence>
        {chrome && !active && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            className="flex items-center justify-between px-5 py-2.5 z-10"
            style={{ background: `${theme.surface}f2`, borderTop: `1px solid ${theme.cardBorder}`, backdropFilter: 'blur(14px)' }}>
            <span className="text-[10px] font-bold" style={{ color: theme.textSecondary }}>
              Ayete dokun: meal · Boşluğa dokun: tam ekran his
            </span>
            <span className="text-[10px] font-black" style={{ color: theme.gold }}>%{Math.round(progress * 100)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ayet meal kartı */}
      <AnimatePresence>
        {active && (
          <motion.div initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4" onClick={e => e.stopPropagation()}>
            <div className="max-w-[42rem] mx-auto rounded-2xl p-4 shadow-2xl"
              style={{ background: theme.surface, border: `1.5px solid ${theme.gold}35` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black"
                  style={{ border: `1.5px solid ${theme.gold}70`, color: theme.gold }}>{active.number}</span>
                <span className="text-[11px] font-bold" style={{ color: theme.textSecondary }}>{surah.name} · {active.number}. ayet</span>
                <div className="ml-auto flex items-center gap-1.5">
                  {active.audio_url && (
                    <button onClick={() => playVerse(active)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90"
                      style={{ background: playingNo === active.number ? theme.gold : `${theme.gold}12`, color: playingNo === active.number ? '#0A1F14' : theme.gold }}>
                      {playingNo === active.number ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                    </button>
                  )}
                  <button onClick={() => setActiveVerse(null)} className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90"
                    style={{ background: `${theme.textSecondary}10`, color: theme.textSecondary }}>
                    <X size={13} />
                  </button>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>
                {active.turkish || 'Bu ayet için meal verisi yüklenemedi.'}
              </p>
              <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                <button disabled={active.number <= 1}
                  onClick={() => { const p = verses.find(x => x.number === active.number - 1); if (p) { setActiveVerse(p); document.getElementById(`mushaf-v-${p.number}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }}
                  className="flex items-center gap-1 text-[11px] font-bold active:scale-95 disabled:opacity-30" style={{ color: theme.gold }}>
                  <ChevronLeft size={13} /> Önceki
                </button>
                <button disabled={active.number >= verses.length}
                  onClick={() => { const n = verses.find(x => x.number === active.number + 1); if (n) { setActiveVerse(n); document.getElementById(`mushaf-v-${n.number}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }}
                  className="flex items-center gap-1 text-[11px] font-bold active:scale-95 disabled:opacity-30" style={{ color: theme.gold }}>
                  Sonraki <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
