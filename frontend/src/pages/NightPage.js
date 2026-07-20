import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Square, Volume2, VolumeX, Moon, Timer, BookOpen, Music } from 'lucide-react';
import { useTTS } from '../hooks/useShared';
import { useTx } from '../i18n';
import ambient, { TRACKS } from '../services/ambient';
import { STORIES } from '../data/stories';
import { ARTICLES } from '../data/articles';

// 🌙 GECE MODU — uykuya hazırlık modülü.
// Ney (sentez atmosfer) + istenirse kıssa/makale sesli okuma + uyku
// zamanlayıcısı. Süre dolarken ses yavaşça kısılır (fade-out), her şey
// kapanır ve ekranda uyku duası ile bitirilir.
// Not: Tüm sesler cihazda üretilir/okunur; telifli hiçbir kayıt kullanılmaz.
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

const DURATIONS = [10, 20, 30, 45]; // dakika
const FADE_SECONDS = 25;            // son 25 saniyede ses kısılır

const NIGHT = {
  bg: 'linear-gradient(175deg, #050414 0%, #0F0D2E 45%, #1E1B4B 100%)',
  card: 'rgba(99, 102, 241, 0.08)',
  border: 'rgba(129, 140, 248, 0.25)',
  text: '#E0E7FF',
  dim: '#A5B4FC',
  accent: '#818CF8',
  gold: '#F5D77C',
};

// Uyku duası (sahih rivayet — Buhârî, Deavât 7)
const SLEEP_DUA = {
  ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
  read: "Bismike'llâhümme emûtü ve ahyâ",
  meal: "Allah'ım! Senin adınla ölür (uyur), senin adınla dirilirim (uyanırım).",
  source: 'Buhârî, Deavât 7',
};

function Stars() {
  // Sabit tohumlu yıldız serpintisi — her render'da aynı gökyüzü
  const stars = useMemo(() => Array.from({ length: 34 }, (_, i) => ({
    left: ((i * 137.5) % 100), top: ((i * 61.8) % 88) + 2,
    size: 1 + ((i * 7) % 3), delay: (i % 9) * 0.6,
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {stars.map((s, i) => (
        <span key={i} className="absolute rounded-full"
          style={{
            left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size,
            background: '#C7D2FE',
            animation: `nightTwinkle 3.5s ease-in-out ${s.delay}s infinite`,
          }} />
      ))}
      <style>{`@keyframes nightTwinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 0.85; } }`}</style>
    </div>
  );
}

export default function NightPage() {
  const navigate = useNavigate();
  const tts = useTTS();
  const tt = useTx();

  // Kurulum durumu
  const preset = useMemo(() => load('night_preset', null), []);
  const [contentType, setContentType] = useState(preset?.type || 'story'); // story | article | ambient
  const [contentId, setContentId] = useState(preset?.id || STORIES[0]?.id);
  const [trackId, setTrackId] = useState('gece');
  const [minutes, setMinutes] = useState(20);
  const [volume, setVolumeState] = useState(() => {
    const v = ambient.getState().volume; return typeof v === 'number' ? v : 0.5;
  });

  // Oturum durumu: setup | playing | done
  const [stage, setStage] = useState('setup');
  const [remaining, setRemaining] = useState(0); // saniye
  const baseVolRef = useRef(volume);   // fade öncesi ses — bitişte geri yüklenir
  const tickRef = useRef(null);

  const contentList = contentType === 'story' ? STORIES : contentType === 'article' ? ARTICLES : [];
  const selected = contentList.find(c => c.id === contentId) || contentList[0];

  const readText = useCallback((item, type) => {
    if (!item) return '';
    const parts = type === 'story'
      ? [item.title, ...item.paragraphs, item.lesson || '']
      : [item.title, ...(item.paragraphs || []).map(p => (typeof p === 'string' ? p : `${p.quote} — ${p.source}`))];
    let text = parts.filter(Boolean).join('. ');
    if (text.length > 3900) text = `${text.slice(0, 3900)}...`;
    return text;
  }, []);

  const cleanup = useCallback(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    tts.stop();
    ambient.stop();
    ambient.setVolume(baseVolRef.current); // fade'in kıstığı sesi geri yükle
  }, [tts]);

  const begin = useCallback(() => {
    baseVolRef.current = volume;
    ambient.setVolume(volume);
    ambient.setTrack(trackId);
    ambient.start();
    if (contentType !== 'ambient' && selected) {
      // Ney önce yerleşsin, okuma 2.5 sn sonra başlasın
      const text = readText(selected, contentType);
      setTimeout(() => { if (text) tts.speak(text); }, 2500);
    }
    setRemaining(minutes * 60);
    setStage('playing');
  }, [volume, trackId, contentType, selected, minutes, readText, tts]);

  const endSession = useCallback((finished) => {
    cleanup();
    setStage(finished ? 'done' : 'setup');
  }, [cleanup]);

  // Geri sayım + son saniyelerde fade-out
  useEffect(() => {
    if (stage !== 'playing') return undefined;
    tickRef.current = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        if (next <= FADE_SECONDS && next > 0) {
          ambient.setVolume(baseVolRef.current * (next / FADE_SECONDS));
        }
        if (next <= 0) {
          clearInterval(tickRef.current); tickRef.current = null;
          tts.stop(); ambient.stop(); ambient.setVolume(baseVolRef.current);
          setStage('done');
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
    // tts sabit referanslı hook nesnesi döndürmez; yalnızca stage değişince kurulmalı
  }, [stage]); // eslint bilinçli: yalnız stage

  // Sayfadan çıkarken her şeyi kapat
  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tts.stop(); ambient.stop(); ambient.setVolume(baseVolRef.current);
    try { localStorage.removeItem('night_preset'); } catch { /* ignore */ }
    // unmount temizliği — bağımlılık istemiyoruz
  }, []); // eslint bilinçli: unmount

  const changeVolume = useCallback((v) => {
    setVolumeState(v); baseVolRef.current = v; ambient.setVolume(v);
  }, []);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const progress = minutes > 0 ? remaining / (minutes * 60) : 0;
  const R = 88, CIRC = 2 * Math.PI * R;

  return (
    <div className="min-h-screen pb-28 relative" style={{ background: NIGHT.bg }}>
      <Stars />

      {/* Üst bar */}
      <div className="relative flex items-center gap-3 px-5 pt-6">
        <button onClick={() => { endSession(false); navigate(-1); }}
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
          style={{ background: NIGHT.card, border: `1px solid ${NIGHT.border}` }} aria-label="Geri">
          <ArrowLeft size={18} style={{ color: NIGHT.dim }} />
        </button>
        <div>
          <h1 className="text-xl font-black flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif', color: NIGHT.text }}>
            <Moon size={18} style={{ color: NIGHT.gold }} /> {tt('Gece Modu')}
          </h1>
          <p className="text-[10px]" style={{ color: NIGHT.dim }}>{tt('Ney · sesli okuma · uyku zamanlayıcısı')}</p>
        </div>
      </div>

      <div className="relative px-5 max-w-[36rem] mx-auto">
        <AnimatePresence mode="wait">
          {/* ═══ KURULUM ═══ */}
          {stage === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Ne dinlemek istersin */}
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-6 mb-2 flex items-center gap-1.5" style={{ color: NIGHT.accent }}>
                <BookOpen size={12} /> {tt('Ne dinlemek istersin?')}
              </p>
              <div className="flex gap-2">
                {[
                  { id: 'story', label: tt('🕯️ Kıssa') },
                  { id: 'article', label: tt('📚 Makale') },
                  { id: 'ambient', label: tt('🎵 Sadece Atmosfer') },
                ].map(t => (
                  <button key={t.id} onClick={() => { setContentType(t.id); if (t.id === 'story') setContentId(STORIES[0].id); if (t.id === 'article') setContentId(ARTICLES[0].id); }}
                    className="flex-1 py-2.5 rounded-xl text-[11px] font-black active:scale-95 transition-all"
                    style={contentType === t.id
                      ? { background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: '#fff' }
                      : { background: NIGHT.card, border: `1px solid ${NIGHT.border}`, color: NIGHT.dim }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* İçerik seçimi */}
              {contentType !== 'ambient' && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-1">
                  {contentList.map(c => (
                    <button key={c.id} onClick={() => setContentId(c.id)}
                      className="shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold active:scale-95 flex items-center gap-1.5"
                      style={selected?.id === c.id
                        ? { background: '#6366F125', border: `1.5px solid ${NIGHT.accent}`, color: NIGHT.text }
                        : { background: NIGHT.card, border: `1px solid ${NIGHT.border}`, color: NIGHT.dim }}>
                      <span>{c.emoji || '📄'}</span> {c.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Atmosfer */}
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-6 mb-2 flex items-center gap-1.5" style={{ color: NIGHT.accent }}>
                <Music size={12} /> {tt('Atmosfer')}
              </p>
              <div className="flex gap-2 flex-wrap">
                {TRACKS.map(t => (
                  <button key={t.id} onClick={() => setTrackId(t.id)}
                    className="px-3 py-2 rounded-xl text-[11px] font-bold active:scale-95"
                    style={trackId === t.id
                      ? { background: '#6366F125', border: `1.5px solid ${NIGHT.accent}`, color: NIGHT.text }
                      : { background: NIGHT.card, border: `1px solid ${NIGHT.border}`, color: NIGHT.dim }}>
                    {t.icon} {t.name}
                  </button>
                ))}
              </div>

              {/* Süre */}
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-6 mb-2 flex items-center gap-1.5" style={{ color: NIGHT.accent }}>
                <Timer size={12} /> {tt('Uyku zamanlayıcısı')}
              </p>
              <div className="flex gap-2">
                {DURATIONS.map(d => (
                  <button key={d} onClick={() => setMinutes(d)}
                    className="flex-1 py-3 rounded-xl text-sm font-black active:scale-95"
                    style={minutes === d
                      ? { background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: '#fff' }
                      : { background: NIGHT.card, border: `1px solid ${NIGHT.border}`, color: NIGHT.dim }}>
                    {d}<span className="text-[9px] font-bold"> dk</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] mt-2 text-center" style={{ color: NIGHT.dim }}>
                {tt('Süre dolarken ses yavaşça kısılır ve her şey kendiliğinden kapanır 😴')}
              </p>

              {/* Başlat */}
              <motion.button whileTap={{ scale: 0.97 }} onClick={begin}
                className="w-full mt-6 py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', color: '#fff', boxShadow: '0 8px 30px rgba(99,102,241,0.35)' }}>
                <Play size={18} /> {tt('Geceyi Başlat')}
              </motion.button>
              <p className="text-[10px] mt-3 text-center leading-relaxed" style={{ color: NIGHT.dim }}>
                {tt('Ney sesi cihazında üretilir, okuma Türkçe seslendirme ile yapılır.')}<br />{tt('Telefonunu şarja tak, ekranı kapatma — iyi geceler 🌙')}
              </p>
            </motion.div>
          )}

          {/* ═══ ÇALIYOR ═══ */}
          {stage === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center pt-8">
              {/* Geri sayım halkası */}
              <div className="relative" style={{ width: 220, height: 220 }}>
                <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
                  <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(129,140,248,0.15)" strokeWidth="10" />
                  <circle cx="110" cy="110" r={R} fill="none" stroke="url(#nightGrad)" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
                    style={{ transition: 'stroke-dashoffset 1s linear' }} />
                  <defs>
                    <linearGradient id="nightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#F5D77C" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span className="text-3xl mb-1" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity }}>🌙</motion.span>
                  <span className="text-4xl font-black tabular-nums" style={{ color: NIGHT.text }}>{mm}:{ss}</span>
                  <span className="text-[10px] mt-1" style={{ color: NIGHT.dim }}>
                    {remaining <= FADE_SECONDS ? tt('ses kısılıyor...') : tt('uykuya hazırlık')}
                  </span>
                </div>
              </div>

              {/* Ne çalıyor */}
              <div className="mt-6 text-center px-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: NIGHT.accent }}>
                  {TRACKS.find(t => t.id === trackId)?.icon} {TRACKS.find(t => t.id === trackId)?.name}
                </p>
                {contentType !== 'ambient' && selected && (
                  <p className="text-sm font-bold mt-1.5" style={{ fontFamily: 'Georgia, serif', color: NIGHT.text }}>
                    {selected.emoji} {selected.title}
                    {tts.loading && <span className="text-[10px] font-normal ml-1.5" style={{ color: NIGHT.dim }}>{tt('(ses hazırlanıyor...)')}</span>}
                  </p>
                )}
              </div>

              {/* Ses */}
              <div className="w-full max-w-xs mt-7 flex items-center gap-3">
                <VolumeX size={15} style={{ color: NIGHT.dim }} />
                <input type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={e => changeVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-indigo-400" aria-label="Ses seviyesi" />
                <Volume2 size={15} style={{ color: NIGHT.dim }} />
              </div>

              <button onClick={() => endSession(true)}
                className="mt-8 px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 active:scale-95"
                style={{ background: NIGHT.card, border: `1px solid ${NIGHT.border}`, color: NIGHT.text }}>
                <Square size={14} /> {tt('Bitir ve Duayı Gör')}
              </button>
            </motion.div>
          )}

          {/* ═══ BİTİŞ · UYKU DUASI ═══ */}
          {stage === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center pt-10 text-center">
              <motion.span className="text-5xl" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 5, repeat: Infinity }}>🌙</motion.span>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-5" style={{ color: NIGHT.accent }}>{tt('Uyku Duası')}</p>
              <p className="mt-5 text-2xl leading-loose" dir="rtl" style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: NIGHT.gold }}>
                {SLEEP_DUA.ar}
              </p>
              <p className="mt-3 text-sm italic" style={{ color: NIGHT.text }}>{SLEEP_DUA.read}</p>
              <div className="mt-5 rounded-2xl p-4 max-w-sm" style={{ background: NIGHT.card, border: `1px solid ${NIGHT.border}` }}>
                <p className="text-[13px] leading-relaxed" style={{ fontFamily: 'Georgia, serif', color: NIGHT.text }}>
                  "{SLEEP_DUA.meal}"
                </p>
                <p className="text-[10px] mt-2 font-bold" style={{ color: NIGHT.accent }}>— {SLEEP_DUA.source}</p>
              </div>
              <p className="text-xs mt-6" style={{ color: NIGHT.dim }}>{tt('Hayırlı geceler. Allah rahatlık versin 💫')}</p>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setStage('setup')}
                  className="px-5 py-3 rounded-2xl text-xs font-black active:scale-95"
                  style={{ background: NIGHT.card, border: `1px solid ${NIGHT.border}`, color: NIGHT.text }}>
                  {tt('Yeniden Kur')}
                </button>
                <button onClick={() => navigate('/')}
                  className="px-5 py-3 rounded-2xl text-xs font-black active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', color: '#fff' }}>
                  Ana Sayfa
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
