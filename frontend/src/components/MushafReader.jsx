import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize, Minimize, Play, Pause, X, Type, Sun, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useReadingSettings } from '../services/readingSettings';
import ReadingSettingsSheet from './ReadingSettingsSheet';
import api from '../api';

// 🕌 MUSHAF GÖRÜNÜMÜ — tam ekran, kesintisiz sağdan-sola Arapça okuma.
// Gerçek mushaf gibi SURE BİTİNCE DURMAZ: sayfanın sonuna yaklaşınca
// sonraki sure otomatik yüklenir ve akış Nâs sûresine kadar devam eder.
// Her ayetin sonunda Arap rakamlı madalyon (﴾١﴿); ayete dokununca altta
// meal kartı açılır. Tam ekran, yazı boyutu ve "ekranı açık tut" vardır.
// Not: Telifli mushaf hattı/görseli kullanılmaz — metin cihaz fontuyla
// (Amiri) dizilir; alınan şey yalnızca okuma DÜZENİ mantığıdır.

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toArabicDigits = (n) => String(n).replace(/\d/g, d => AR_DIGITS[d]);

const LS_AWAKE = 'mushaf_awake';

export default function MushafReader({ surah, initialVerse, onClose, onPosition }) {
  // Okuma ayarları: tema paleti + Arapça boyutu (ReadingSettingsSheet yönetir)
  const { settings, theme: rt, arabicSize } = useReadingSettings();
  const [showSettings, setShowSettings] = useState(false);

  // Yüklü sureler (akış sırasıyla) — ilk eleman girilen sure
  const [chapters, setChapters] = useState(() => [surah]);
  const [loadingNext, setLoadingNext] = useState(false);
  const [chrome, setChrome] = useState(true);            // üst/alt barlar görünür mü
  const [active, setActive] = useState(null);            // { chapter, verse } (meal kartı)
  const [isFull, setIsFull] = useState(false);
  const [keepAwake, setKeepAwake] = useState(() => localStorage.getItem(LS_AWAKE) === '1');
  const [progress, setProgress] = useState(0);
  const [playingKey, setPlayingKey] = useState(null);    // "sure-ayet"
  const [current, setCurrent] = useState({ no: surah.number, name: surah.name, ayah: initialVerse || 1 });

  const scrollRef = useRef(null);
  const audioRef = useRef(null);
  const wakeRef = useRef(null);
  const posRef = useRef({ no: surah.number, name: surah.name, ayah: initialVerse || 1 });
  const chaptersRef = useRef(chapters);
  const fetchingRef = useRef(false);
  const rafRef = useRef(false);
  useEffect(() => { chaptersRef.current = chapters; }, [chapters]);

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
    const el = document.getElementById(`mushaf-v-${surah.number}-${initialVerse}`);
    if (el) setTimeout(() => el.scrollIntoView({ block: 'center' }), 60);
    // yalnız ilk açılışta çalışır
  }, []); // eslint bilinçli: mount

  // ── Sonraki sureyi yükle (akış devam etsin) ──
  const fetchNext = useCallback(async () => {
    const list = chaptersRef.current;
    const lastNo = list[list.length - 1]?.number;
    if (!lastNo || lastNo >= 114 || fetchingRef.current) return;
    fetchingRef.current = true;
    setLoadingNext(true);
    try {
      const { data } = await api.get(`/quran/surah/${lastNo + 1}?reciter=alafasy`);
      if (data && Array.isArray(data.verses)) {
        setChapters(prev => (prev[prev.length - 1]?.number === lastNo ? [...prev, data] : prev));
      }
    } catch { /* ağ hatası — sonraki kaydırmada tekrar denenir */ }
    fetchingRef.current = false;
    setLoadingNext(false);
  }, []);

  // ── Kaydırma: ilerleme + görünen ayet + sona yaklaşınca sonraki sure ──
  const onScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = true;
    requestAnimationFrame(() => {
      rafRef.current = false;
      const el = scrollRef.current;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 1);
      if (el.scrollTop + el.clientHeight > el.scrollHeight - 1400) fetchNext();
      // Ekranın üst üçte birine en yakın ayeti "kaldığın yer" olarak izle
      const marker = el.getBoundingClientRect().top + el.clientHeight * 0.3;
      let best = null; let bestDist = Infinity;
      for (const ch of chaptersRef.current) {
        for (const v of ch.verses) {
          const s = document.getElementById(`mushaf-v-${ch.number}-${v.number}`);
          if (!s) continue;
          const d = Math.abs(s.getBoundingClientRect().top - marker);
          if (d < bestDist) { bestDist = d; best = { no: ch.number, name: ch.name, ayah: v.number }; }
        }
      }
      if (best) {
        posRef.current = best;
        setCurrent(prev => (prev.no !== best.no || prev.ayah !== best.ayah ? best : prev));
      }
    });
  }, [fetchNext]);

  // ── Kapanış: pozisyonu bildir, sesleri durdur, tam ekrandan çık ──
  const close = useCallback(() => {
    try { audioRef.current?.pause(); } catch { /* ignore */ }
    if (document.fullscreenElement) { try { document.exitFullscreen(); } catch { /* ignore */ } }
    const p = posRef.current;
    onPosition?.(p.no, p.name, p.ayah);
    onClose();
  }, [onClose, onPosition]);

  useEffect(() => () => {
    try { audioRef.current?.pause(); } catch { /* ignore */ }
    try { wakeRef.current?.release(); } catch { /* ignore */ }
  }, []);

  const playVerse = useCallback((ch, v) => {
    if (!v.audio_url) return;
    const key = `${ch.number}-${v.number}`;
    if (playingKey === key) { audioRef.current?.pause(); setPlayingKey(null); return; }
    try { audioRef.current?.pause(); } catch { /* ignore */ }
    const a = new Audio(v.audio_url);
    audioRef.current = a;
    a.onended = () => setPlayingKey(null);
    a.play().catch(() => {});
    setPlayingKey(key);
  }, [playingKey]);

  const tapVerse = useCallback((ch, v, e) => {
    e.stopPropagation();
    posRef.current = { no: ch.number, name: ch.name, ayah: v.number };
    onPosition?.(ch.number, ch.name, v.number);
    setActive(prev => (prev && prev.chapter.number === ch.number && prev.verse.number === v.number ? null : { chapter: ch, verse: v }));
  }, [onPosition]);

  const gotoSibling = useCallback((dir) => {
    if (!active) return;
    const { chapter, verse } = active;
    const target = chapter.verses.find(x => x.number === verse.number + dir);
    if (!target) return;
    setActive({ chapter, verse: target });
    document.getElementById(`mushaf-v-${chapter.number}-${target.number}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [active]);

  const fontSize = arabicSize;
  const lastChapter = chapters[chapters.length - 1];

  return (
    <div className="fixed inset-0 z-[80] flex flex-col" style={{ background: rt.bg }}>
      {/* İlerleme çizgisi */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-20" style={{ background: `${rt.accent}15` }}>
        <div className="h-full transition-all duration-200" style={{ width: `${progress * 100}%`, background: rt.accent }} />
      </div>

      {/* Üst bar */}
      <AnimatePresence>
        {chrome && (
          <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 z-10"
            style={{ background: `${rt.surface}f2`, borderBottom: `1px solid ${rt.border}`, backdropFilter: 'blur(14px)' }}>
            <button onClick={close} className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
              style={{ background: `${rt.accent}10` }} aria-label="Kapat">
              <ArrowLeft size={17} style={{ color: rt.accent }} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate" style={{ color: rt.text, fontFamily: 'Playfair Display, serif' }}>
                {current.no}. {current.name}
              </p>
              <p className="text-[10px]" style={{ color: rt.secondary }}>
                🕌 Mushaf Görünümü · {current.ayah}. ayet · akış sonraki sureye devam eder
              </p>
            </div>
            {/* Yazı boyutu */}
            <button onClick={() => setShowSettings(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
              style={{ background: `${rt.accent}10` }} aria-label="Okuma ayarları">
              <Type size={15} style={{ color: rt.accent }} />
            </button>
            {/* Ekranı açık tut */}
            <button onClick={() => setKeepAwake(k => { localStorage.setItem(LS_AWAKE, k ? '0' : '1'); return !k; })}
              className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
              style={{ background: keepAwake ? `${rt.accent}25` : `${rt.accent}10` }}
              aria-label="Ekranı açık tut" title="Ekranı açık tut">
              <Sun size={15} style={{ color: keepAwake ? rt.accent : rt.secondary }} />
            </button>
            {/* Tam ekran */}
            <button onClick={toggleFullscreen} className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
              style={{ background: `${rt.accent}10` }} aria-label="Tam ekran">
              {isFull ? <Minimize size={15} style={{ color: rt.accent }} /> : <Maximize size={15} style={{ color: rt.accent }} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Akan sayfa — tüm yüklü sureler */}
      <div ref={scrollRef} onScroll={onScroll} onClick={() => { setChrome(c => !c); setActive(null); }}
        className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-[46rem] mx-auto px-5 md:px-10 py-8">
          {chapters.map(ch => (
            <div key={ch.number}>
              {/* Sure başlığı süslemesi */}
              <div className="text-center mb-6 mt-2 select-none">
                <div className="inline-block px-8 py-3 rounded-2xl relative"
                  style={{ border: `1.5px solid ${rt.accent}35`, background: `${rt.accent}06` }}>
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px] px-2" style={{ background: rt.bg, color: rt.accent }}>✦</span>
                  <p className="text-3xl" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: rt.accent }}>
                    {ch.arabic_name}
                  </p>
                  <p className="text-[9px] mt-1 font-bold uppercase tracking-[0.3em]" style={{ color: rt.secondary }}>
                    {ch.number}. {ch.name} · {ch.total_verses || ch.verses.length} ayet
                  </p>
                </div>
                {ch.number !== 1 && ch.number !== 9 && (
                  <p className="mt-5 text-xl" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: `${rt.accent}99` }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                )}
              </div>

              {/* Akan mushaf metni */}
              <p dir="rtl" className="mushaf-text select-none"
                style={{ fontSize, lineHeight: 2.15, color: `${rt.text}f2`, '--gold': rt.accent }}>
                {ch.verses.map(v => (
                  <span key={v.number} id={`mushaf-v-${ch.number}-${v.number}`}
                    onClick={(e) => tapVerse(ch, v, e)}
                    className="mushaf-ayah"
                    style={(active && active.chapter.number === ch.number && active.verse.number === v.number) || playingKey === `${ch.number}-${v.number}`
                      ? { background: `${rt.accent}1c`, borderRadius: 8 }
                      : undefined}>
                    {v.arabic}
                    <span className="mushaf-medallion" style={{ borderColor: `${rt.accent}70`, color: rt.accent }}>
                      {toArabicDigits(v.number)}
                    </span>
                  </span>
                ))}
              </p>

              {/* Sure sonu ayracı */}
              <div className="text-center mt-7 mb-8 select-none">
                <span className="text-xs tracking-[0.5em]" style={{ color: `${rt.accent}70` }}>✦ ✦ ✦</span>
                <p className="text-[10px] mt-2" style={{ color: rt.secondary }}>
                  {ch.name} sûresi sona erdi{ch.number < 114 ? ' · akış devam ediyor' : ' · Sadakallahülazîm'}
                </p>
              </div>
            </div>
          ))}

          {/* Sonraki sure yükleniyor / hatim sonu */}
          {lastChapter?.number < 114 ? (
            <div className="flex items-center justify-center gap-2 pb-24 select-none">
              {loadingNext && <Loader2 size={14} className="animate-spin" style={{ color: rt.accent }} />}
              <span className="text-[11px] font-bold" style={{ color: rt.secondary }}>
                {loadingNext ? 'Sonraki sure yükleniyor...' : 'Kaydırmaya devam et — sonraki sure otomatik gelir'}
              </span>
            </div>
          ) : (
            <div className="text-center pb-24 select-none">
              <p className="text-2xl mb-2">🤲</p>
              <p className="text-sm font-black" style={{ color: rt.accent }}>Kur'an-ı Kerîm'in sonuna ulaştın</p>
              <p className="text-[11px] mt-1" style={{ color: rt.secondary }}>Allah kabul etsin, hatmin mübarek olsun</p>
            </div>
          )}
        </div>
      </div>

      {/* Alt bilgi barı */}
      <AnimatePresence>
        {chrome && !active && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            className="flex items-center justify-between px-5 py-2.5 z-10"
            style={{ background: `${rt.surface}f2`, borderTop: `1px solid ${rt.border}`, backdropFilter: 'blur(14px)' }}>
            <span className="text-[10px] font-bold" style={{ color: rt.secondary }}>
              Ayete dokun: meal · Boşluğa dokun: sade ekran
            </span>
            <span className="text-[10px] font-black" style={{ color: rt.accent }}>
              {current.name} · {current.ayah}. ayet
            </span>
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
              style={{ background: rt.surface, border: `1.5px solid ${rt.accent}35` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                  style={{ border: `1.5px solid ${rt.accent}70`, color: rt.accent }}>{active.verse.number}</span>
                <span className="text-[11px] font-bold truncate" style={{ color: rt.secondary }}>
                  {active.chapter.name} · {active.verse.number}. ayet
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  {active.verse.audio_url && (
                    <button onClick={() => playVerse(active.chapter, active.verse)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90"
                      style={{
                        background: playingKey === `${active.chapter.number}-${active.verse.number}` ? rt.accent : `${rt.accent}12`,
                        color: playingKey === `${active.chapter.number}-${active.verse.number}` ? (rt.dark ? '#111' : '#fff') : rt.accent,
                      }}>
                      {playingKey === `${active.chapter.number}-${active.verse.number}` ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                    </button>
                  )}
                  <button onClick={() => setActive(null)} className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90"
                    style={{ background: `${rt.secondary}10`, color: rt.secondary }}>
                    <X size={13} />
                  </button>
                </div>
              </div>
              <p className="leading-relaxed" style={{ color: rt.text, fontSize: Math.max(13, settings.fontSize - 3) }}>
                {active.verse.turkish || 'Bu ayet için meal verisi yüklenemedi.'}
              </p>
              <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: `1px solid ${rt.border}` }}>
                <button disabled={active.verse.number <= 1} onClick={() => gotoSibling(-1)}
                  className="flex items-center gap-1 text-[11px] font-bold active:scale-95 disabled:opacity-30" style={{ color: rt.accent }}>
                  <ChevronLeft size={13} /> Önceki
                </button>
                <button disabled={active.verse.number >= active.chapter.verses.length} onClick={() => gotoSibling(1)}
                  className="flex items-center gap-1 text-[11px] font-bold active:scale-95 disabled:opacity-30" style={{ color: rt.accent }}>
                  Sonraki <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Okuma ayarları sayfası */}
      <ReadingSettingsSheet open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
