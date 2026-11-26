import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, BookOpen, Volume2, VolumeX, Gauge } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLang } from '../../contexts/LangContext';
import { useTx } from '../../i18n';
import { donusPalette, PHASE_COLORS, alpha } from '../../donus/palette';
import { getReturnDay, markDayRead, LAST_DAY } from '../../services/returnEngine';
import { getPhase } from '../../data/returnPath';
import { getPerde } from '../../data/donusPerde';
import voice from '../../services/donusVoice';
import PerdeSahne from '../../components/donus/PerdeSahne';
import { Lamp, Hands } from '../../components/donus/IslamicSVG';

// 🎭 PERDE — anlatının okunduğu/dinlendiği ekran
//
// İKİ MOD, TEK EKRAN:
//   SESLİ   — perde-XX.mp3 varsa insan sesi çalar, satırlar sesle
//             birlikte vurgulanır (okunan satır aydınlanır, diğerleri söner)
//   OKUMA   — ses yoksa aynı akış sanal bir saatle sürer; kişi
//             kendi temposuyla ilerleyebilir veya otomatik akışı durdurur
//
// Ses hiçbir zaman şart değildir: seslendirme tek tek eklenebilir,
// eksik perdeler sessizce okuma modunda çalışmaya devam eder.

const AUTO_KEY = 'donus_perde_auto';

export default function DonusPerde() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const tt = useTx();
  const navigate = useNavigate();
  const { day: dayParam } = useParams();

  const maxOpen = Math.min(getReturnDay(), LAST_DAY);
  const req = dayParam ? parseInt(dayParam, 10) : maxOpen;
  const day = Math.min(Math.max(1, Number.isFinite(req) ? req : maxOpen), maxOpen);

  const perde = useMemo(() => getPerde(day, lang), [day, lang]);
  const phase = useMemo(() => getPhase(day), [day]);
  const p = donusPalette(theme, PHASE_COLORS[phase.id]);

  const [hasAudio, setHasAudio] = useState(null); // null = bakılıyor
  const [vState, setVState] = useState(() => voice.getState());
  const [t, setT] = useState(0);                  // okuma modu sanal saat
  const [auto, setAuto] = useState(() => {
    try { return localStorage.getItem(AUTO_KEY) !== '0'; } catch { return true; }
  });
  const [done, setDone] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const tick = useRef(null);
  const lineRefs = useRef([]);

  const ltr = lang === 'ar';
  const dirProps = ltr ? { dir: 'ltr' } : {};
  const dirStyle = ltr ? { textAlign: 'start' } : {};

  // Seslendirme var mı?
  useEffect(() => {
    let alive = true;
    setHasAudio(null);
    voice.hasVoice(day).then(ok => { if (alive) setHasAudio(ok); });
    return () => { alive = false; voice.stop(); };
  }, [day]);

  useEffect(() => voice.subscribe(setVState), []);

  // Okuma modu saati
  useEffect(() => {
    clearInterval(tick.current);
    if (hasAudio || !auto || done) return undefined;
    tick.current = setInterval(() => setT(x => x + 0.25), 250);
    return () => clearInterval(tick.current);
  }, [hasAudio, auto, done]);

  const time = hasAudio ? vState.time : t;
  const total = perde ? (perde.sure || 90) : 90;
  const idx = perde ? voice.activeLine(perde.lines, time) : 0;
  const scene = perde ? voice.activeScene(perde.sahne, time) : null;
  const finished = perde ? (time >= (perde.lines[perde.lines.length - 1]?.t || 0) + 6) : false;

  // Okunan satırı görünür tut ve WebSpeech ile seslendir (MP3 yoksa)
  useEffect(() => {
    const el = lineRefs.current[idx];
    if (el && (hasAudio ? vState.playing : auto)) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // MP3 yoksa, otomatik moddaysa ve sayfa seslendirmeyi destekliyorsa okyalım
    if (hasAudio === false && auto && !done && perde && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = perde.lines[idx]?.text;
      if (text) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'tr-TR';
        u.rate = 0.85; // Tasavvufi bir hava için biraz yavaş
        u.pitch = 0.9; // Biraz daha tok bir ses
        
        // Mümkünse en iyi Türkçe sesi seçmeye çalış
        const voices = window.speechSynthesis.getVoices();
        const trVoices = voices.filter(v => v.lang.startsWith('tr'));
        if (trVoices.length > 0) {
          // iOS'ta Yelda genelde çok iyidir, Windows'ta Tolga vardır
          u.voice = trVoices.find(v => v.name.includes('Yelda')) || trVoices[0];
        }
        
        window.speechSynthesis.speak(u);
      }
    }
  }, [idx, hasAudio, vState.playing, auto, done, perde]);

  // Sayfa kapanınca veya duraklatılınca sesi kes
  useEffect(() => {
    if (!auto || done) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [auto, done]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const restart = useCallback(() => {
    setDone(false);
    if (hasAudio) { voice.seek(0); voice.play(day); } else setT(0);
  }, [hasAudio, day]);

  const complete = useCallback(() => {
    markDayRead(day);
    setDone(true);
    voice.pause();
    clearInterval(tick.current);
  }, [day]);

  if (!perde) {
    return (
      <div className="px-5 pt-10 text-center">
        <span className="text-4xl block mb-4">🎭</span>
        <p className="text-sm font-black mb-2" style={{ color: p.text }}>{tt('Bu günün perdesi henüz yazılmadı')}</p>
        <p className="text-[11px] mb-6" style={{ color: p.dim }}>
          {tt('Anlatı katmanı gün gün ekleniyor. Şimdilik günün dersini okuyabilirsin.')}
        </p>
        <button onClick={() => navigate(`/donus/gun/${day}`)}
          className="py-3 px-6 rounded-2xl text-sm font-black"
          style={{ background: p.accent, color: p.onAccent }}>
          {tt('Dersi aç')}
        </button>
      </div>
    );
  }

  const playing = hasAudio ? vState.playing : (auto && !done);

  return (
    <div className="px-4 sm:px-5 pt-4 pb-24 relative">
      {/* ── Başlık & Perde Seçici ── */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate('/donus')}
          className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }} aria-label={tt('Geri')}>
          <ArrowLeft size={15} style={{ color: p.accent }} />
        </button>

        {/* Hızlı Perde Seçici */}
        <select
          value={day}
          onChange={(e) => navigate(`/donus/perde/${e.target.value}`)}
          className="text-[10px] font-black rounded-full px-3 py-1 outline-none cursor-pointer border transition-colors"
          style={{ background: alpha(p.accent, 0.16), color: p.accent, borderColor: alpha(p.accent, 0.3) }}
        >
          {Array.from({ length: maxOpen }, (_, k) => k + 1).map(d => (
            <option key={d} value={d} style={{ background: theme.surface, color: theme.textPrimary }}>
              {d}. {tt('Perde')}
            </option>
          ))}
        </select>

        <span className="text-[9.5px] font-bold ms-auto" style={{ color: p.dim }}>
          {hasAudio === null ? '' : hasAudio ? tt('Sesli') : tt('Okuma')}
        </span>
      </div>

      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="text-[26px] md:text-[32px] font-black leading-tight mb-2" {...dirProps}
        style={{ fontFamily: 'Playfair Display, serif', color: p.text, ...dirStyle }}>
        {perde.title}
      </motion.h1>

      {/* ── Sahne ── */}
      <PerdeSahne p={p} mod={scene?.mod} />

      {/* ── Satırlar ── */}
      <div className="space-y-5 mt-4 mb-8 max-w-3xl mx-auto">
        {perde.lines.map((l, i) => {
          const state = i === idx ? 'now' : i < idx ? 'past' : 'next';
          return (
            <motion.p key={i}
              ref={(el) => { lineRefs.current[i] = el; }}
              onClick={() => { if (hasAudio) voice.seek(l.t); else setT(l.t); }}
              className="text-[16px] md:text-[18px] lg:text-[19px] leading-[1.95] md:leading-[2.1] cursor-pointer transition-all duration-500"
              {...dirProps}
              animate={{
                opacity: state === 'now' ? 1 : state === 'past' ? 0.45 : 0.22,
                scale: state === 'now' ? 1 : 0.995,
              }}
              style={{
                color: state === 'now' ? p.text : p.dim,
                fontFamily: 'var(--font-okuma)',
                textShadow: state === 'now' ? `0 0 24px ${alpha(p.accentGlow, 0.25)}` : 'none',
                borderInlineStart: state === 'now' ? `3px solid ${p.accent}` : '3px solid transparent',
                paddingInlineStart: 14,
                ...dirStyle,
              }}>
              {l.text}
            </motion.p>
          );
        })}
      </div>

      {/* ── Perdenin Duası (Türkçe Okunuşu ve Meali İle) ── */}
      {perde.dua && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 md:p-6 mb-6 max-w-2xl mx-auto relative overflow-hidden"
          style={{ background: p.cardStrong, border: `1.5px solid ${p.borderSoft}`, boxShadow: p.shadow }}>
          {/* Dekoratif arka plan SVG */}
          <div className="absolute -bottom-2 -left-2 pointer-events-none opacity-20">
            <Hands size={90} color={p.accent} opacity={0.4} />
          </div>
          
          <div className="flex items-center gap-2 mb-3 relative">
            <span className="text-xl">🤲</span>
            <p className="text-[11px] font-black uppercase tracking-wider" style={{ color: p.accent }}>
              {perde.dua.title}
            </p>
          </div>

          {/* Arapça */}
          {perde.dua.arabic && (
            <p className="text-[22px] md:text-[24px] font-black leading-loose text-right mb-4 relative"
              style={{ fontFamily: "'Amiri', serif", color: p.text, textShadow: `0 0 16px ${alpha(p.accent, 0.2)}` }}>
              {perde.dua.arabic}
            </p>
          )}

          {/* Türkçe Okunuşu */}
          {perde.dua.okunus && (
            <div className="mb-3 p-3 rounded-2xl relative" style={{ background: alpha(p.accent, 0.08) }}>
              <p className="text-[9.5px] font-black uppercase tracking-wider mb-1" style={{ color: p.accent }}>
                {tt('Türkçe Okunuşu')}
              </p>
              <p className="text-[13.5px] font-medium italic leading-relaxed" style={{ color: p.text }}>
                "{perde.dua.okunus}"
              </p>
            </div>
          )}

          {/* Türkçe Meali */}
          {perde.dua.meal && (
            <div className="p-3 rounded-2xl" style={{ background: alpha(p.accent, 0.04) }}>
              <p className="text-[9.5px] font-black uppercase tracking-wider mb-1" style={{ color: p.dim }}>
                {tt('Anlamı / Meali')}
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: p.dim }}>
                {perde.dua.meal}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Kalan cümle ── */}
      <AnimatePresence>
        {(finished || done) && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 md:p-6 text-center mb-6 max-w-2xl mx-auto relative overflow-hidden"
            style={{ background: p.cardStrong, border: `1.5px solid ${p.border}`, boxShadow: p.shadow }}>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: p.accent }}>
              {tt('Perdeden kalan')}
            </p>
            <p className="text-[17px] md:text-[20px] font-black leading-snug" {...dirProps}
              style={{ fontFamily: 'Playfair Display, serif', color: p.text, textAlign: 'center' }}>
              {perde.kalan}
            </p>
            <p className="text-[9.5px] mt-4" style={{ color: p.dim }}>{perde.kaynak}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Kumanda ── */}
      <div className="sticky bottom-4 z-10 max-w-xl mx-auto">
        <div className="rounded-3xl p-3 flex items-center gap-2"
          style={{ background: p.card, border: `1px solid ${p.border}`, backdropFilter: 'blur(16px)', boxShadow: p.shadow }}>

          <button
            onClick={() => {
              if (hasAudio) voice.toggle(day);
              else { const n = !auto; setAuto(n); try { localStorage.setItem(AUTO_KEY, n ? '1' : '0'); } catch { /* quota */ } }
            }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 active:scale-90 transition-transform"
            style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accentGlow})`, color: p.onAccent }}
            aria-label={playing ? tt('Duraklat') : tt('Başlat')}>
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </button>

          <button onClick={restart}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 active:scale-90"
            style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }} aria-label={tt('Baştan')}>
            <RotateCcw size={14} style={{ color: p.dim }} />
          </button>

          {/* İlerleme */}
          <div className="flex-1 min-w-0">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: alpha(p.accent, 0.14) }}>
              <motion.div className="h-full rounded-full"
                animate={{ width: `${Math.min(100, (time / total) * 100)}%` }}
                transition={{ duration: 0.3 }}
                style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accentGlow})` }} />
            </div>
            <p className="text-[8.5px] mt-1 font-bold" style={{ color: p.dim }}>
              {idx + 1}/{perde.lines.length} · {hasAudio ? tt('insan sesi') : tt('okuma modu')}
            </p>
          </div>

          {/* Hız (yalnız sesli modda) */}
          {hasAudio && (
            <div className="relative shrink-0">
              <button onClick={() => setRateOpen(o => !o)}
                className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
                style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }} aria-label={tt('Okuma hızı')}>
                <Gauge size={14} style={{ color: p.dim }} />
              </button>
              <AnimatePresence>
                {rateOpen && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute bottom-11 right-0 rounded-2xl p-2 flex gap-1"
                    style={{ background: p.card, border: `1px solid ${p.border}`, boxShadow: p.shadow }}>
                    {[0.85, 1, 1.15, 1.3].map(r => (
                      <button key={r} onClick={() => { voice.setRate(r); setRateOpen(false); }}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-black"
                        style={{
                          background: vState.rate === r ? p.accent : 'transparent',
                          color: vState.rate === r ? p.onAccent : p.dim,
                        }}>
                        {r}×
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Sesi kapat/aç */}
          <button
            onClick={() => voice.setVoiceOn(!vState.enabled)}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 active:scale-90"
            style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }}
            aria-label={tt('Seslendirme')}>
            {vState.enabled ? <Volume2 size={14} style={{ color: p.accent }} />
              : <VolumeX size={14} style={{ color: p.dim }} />}
          </button>
        </div>
      </div>

      {/* ── Bitir ── */}
      <div className="mt-4 space-y-2">
        {!done ? (
          <button onClick={complete}
            className="w-full py-4 rounded-2xl text-sm font-black active:scale-97 transition-transform"
            style={{ background: p.cardStrong, border: `1.5px solid ${p.border}`, color: p.text }}>
            {tt('Perdeyi kapat ve günü tamamla')}
          </button>
        ) : (
          <div className="w-full py-4 rounded-2xl text-center"
            style={{ background: alpha(p.accent, 0.14), border: `1px solid ${p.border}` }}>
            <p className="text-[12.5px] font-black" style={{ color: p.accent }}>✓ {tt('Bu perde aralandı')}</p>
          </div>
        )}

        <button onClick={() => navigate(`/donus/gun/${day}`)}
          className="w-full py-3 rounded-2xl text-[11.5px] font-black flex items-center justify-center gap-1.5"
          style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}`, color: p.dim }}>
          <BookOpen size={13} /> {tt('Günün dersini de oku')}
        </button>
      </div>
    </div>
  );
}
