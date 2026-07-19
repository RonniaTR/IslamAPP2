import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Eye, EyeOff, Repeat, ChevronRight, Award, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { awardXPOnce } from '../services/gamification';
import { HIFZ_TRACKS, gradeCard, cardStatus, surahProgress, dueList, totals, logSession } from '../services/hifzEngine';
import { getWordMeal } from '../data/kelimeMeal';
import Confetti from './games/Confetti';
import api from '../api';

// 📿 EZBER ASİSTANI — aralıklı tekrarla sure ezberi.
// Akış: sure seç → ayet kartı: dinle (döngü) → gizle → içinden oku →
// göster → kendini notla (Tekrar/Zor/İyi/Kolay) → motor sonraki tekrarı
// planlar. "Bugünün Tekrarı" kuyruğu her gün vadesi gelen ayetleri getirir.

const STATUS_COLOR = { new: '#64748B', due: '#F59E0B', learning: '#3B82F6', solid: '#10B981' };
const STATUS_LABEL = { new: 'Yeni', due: 'Tekrar vakti', learning: 'Öğreniliyor', solid: 'Sağlam' };

export default function HifzPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trackNo, setTrackNo] = useState(null);          // açık sure
  const [verses, setVerses] = useState({});              // sure -> ayetler
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);          // { queue: [{surah, ayah}], idx, graded }
  const [hidden, setHidden] = useState(false);
  const [looping, setLooping] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [, force] = useState(0);                         // durum tazeleme
  const audioRef = useRef(null);

  const stats = totals();
  const due = useMemo(() => dueList(), [session, trackNo]); // eslint bilinçli

  const loadSurah = useCallback(async (no) => {
    if (verses[no]) return verses[no];
    setLoading(true);
    try {
      const { data } = await api.get(`/quran/surah/${no}?reciter=alafasy`);
      const list = Array.isArray(data?.verses) ? data.verses : [];
      setVerses(prev => ({ ...prev, [no]: list }));
      setLoading(false);
      return list;
    } catch { setLoading(false); return []; }
  }, [verses]);

  useEffect(() => { if (trackNo) loadSurah(trackNo); }, [trackNo, loadSurah]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.onended = null; audioRef.current.pause(); }
    setPlaying(false); setLooping(false);
  }, []);
  useEffect(() => () => stopAudio(), [stopAudio]);

  const getVerse = useCallback((s, a) => (verses[s] || []).find(v => v.number === a), [verses]);

  const playAyah = useCallback((s, a, loop) => {
    const v = getVerse(s, a);
    if (!v?.audio_url) return;
    if (audioRef.current) { audioRef.current.onended = null; audioRef.current.pause(); }
    const audio = new Audio(v.audio_url);
    audioRef.current = audio;
    audio.onended = () => { if (loop) { audio.currentTime = 0; audio.play().catch(() => {}); } else setPlaying(false); };
    audio.play().catch(() => {});
    setPlaying(true); setLooping(!!loop);
  }, [getVerse]);

  // ── Oturum başlat ──
  const startSession = useCallback(async (queue) => {
    if (!queue.length) return;
    // gerekli sureleri yükle
    const surahsNeeded = [...new Set(queue.map(q => q.surah))];
    for (const s of surahsNeeded) await loadSurah(s); // sıralı; kısa sureler hızlı
    setSession({ queue, idx: 0, graded: 0 });
    setHidden(false); stopAudio();
  }, [loadSurah, stopAudio]);

  const finishSession = useCallback((graded) => {
    stopAudio();
    if (graded > 0) {
      logSession(graded);
      const dk = new Date().toISOString().slice(0, 10);
      awardXPOnce(user, `hifz_${dk}`, 'quran_read', { points: 20, details: `Ezber: ${graded} ayet` });
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1800);
    }
    setSession(null);
  }, [stopAudio, user]);

  const grade = useCallback((g) => {
    if (!session) return;
    const cur = session.queue[session.idx];
    gradeCard(cur.surah, cur.ayah, g);
    const nextIdx = session.idx + 1;
    if (nextIdx >= session.queue.length) { finishSession(session.graded + 1); force(x => x + 1); return; }
    setSession({ ...session, idx: nextIdx, graded: session.graded + 1 });
    setHidden(false); stopAudio();
  }, [session, finishSession, stopAudio]);

  // ═══════════ PRATİK KARTI ═══════════
  if (session) {
    const cur = session.queue[session.idx];
    const track = HIFZ_TRACKS.find(t => t.no === cur.surah);
    const v = getVerse(cur.surah, cur.ayah);
    const wm = getWordMeal(cur.surah, cur.ayah);
    return (
      <div className="min-h-screen pb-24 max-w-2xl mx-auto" style={{ background: theme.bg }}>
        {celebrate && <Confetti count={26} />}
        <div className="px-5 pt-6 flex items-center gap-3">
          <button onClick={() => finishSession(session.graded)} className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90" style={{ background: `${theme.gold}10` }} aria-label="Bitir">
            <ArrowLeft size={17} style={{ color: theme.gold }} />
          </button>
          <div className="flex-1">
            <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{track?.name} · {cur.ayah}. ayet</p>
            <p className="text-[10px]" style={{ color: theme.textSecondary }}>{session.idx + 1}/{session.queue.length} kart</p>
          </div>
          <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: `${theme.gold}15` }}>
            <div className="h-full rounded-full" style={{ width: `${(session.idx / session.queue.length) * 100}%`, background: theme.gold }} />
          </div>
        </div>

        <div className="px-5 mt-6">
          {/* Ayet kartı */}
          <motion.div key={`${cur.surah}-${cur.ayah}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 text-center relative overflow-hidden"
            style={{ background: theme.surface, border: `1.5px solid ${theme.gold}30` }}>
            {!v ? (
              <div className="py-10 flex items-center justify-center gap-2" style={{ color: theme.textSecondary }}>
                <Loader2 size={16} className="animate-spin" /> <span className="text-xs">Ayet yükleniyor...</span>
              </div>
            ) : (
              <>
                <p dir="rtl" className="text-[1.9rem] leading-[2.1] transition-all duration-300 select-none"
                  style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: theme.textPrimary, filter: hidden ? 'blur(14px)' : 'none' }}>
                  {v.arabic}
                </p>
                {!hidden && v.turkish && (
                  <p className="text-xs mt-3 leading-relaxed" style={{ color: theme.textSecondary }}>{v.turkish}</p>
                )}
                {/* Kelime meal desteği */}
                {!hidden && wm && (
                  <div dir="rtl" className="flex flex-wrap gap-1.5 justify-center mt-4 pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                    {wm.map((seg, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg text-center" style={{ background: `${theme.gold}0a` }}>
                        <span className="block text-base" style={{ fontFamily: "'Amiri', serif", color: theme.gold }}>{seg.ar}</span>
                        <span dir="ltr" className="block text-[9px] font-bold" style={{ color: theme.textSecondary }}>{seg.tr}</span>
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Araçlar */}
          <div className="flex gap-2 mt-4">
            <button onClick={() => (playing ? stopAudio() : playAyah(cur.surah, cur.ayah, false))}
              className="flex-1 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-95"
              style={{ background: `${theme.gold}14`, border: `1px solid ${theme.gold}35`, color: theme.gold }}>
              {playing && !looping ? <Pause size={14} /> : <Play size={14} />} Dinle
            </button>
            <button onClick={() => (looping ? stopAudio() : playAyah(cur.surah, cur.ayah, true))}
              className="flex-1 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-95"
              style={looping
                ? { background: theme.gold, color: '#0A1F14' }
                : { background: `${theme.gold}14`, border: `1px solid ${theme.gold}35`, color: theme.gold }}>
              <Repeat size={14} /> {looping ? 'Döngü açık' : 'Döngüde dinle'}
            </button>
            <button onClick={() => setHidden(h => !h)}
              className="flex-1 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-95"
              style={hidden
                ? { background: '#6366F1', color: '#fff' }
                : { background: '#6366F114', border: '1px solid #6366F135', color: '#818CF8' }}>
              {hidden ? <Eye size={14} /> : <EyeOff size={14} />} {hidden ? 'Göster' : 'Gizle'}
            </button>
          </div>
          <p className="text-[10px] text-center mt-2" style={{ color: theme.textSecondary }}>
            Önce dinle → gizle → içinden/yüksek sesle oku → göster ve kendini notla
          </p>

          {/* Notlama */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { g: 'again', label: 'Tekrar', sub: 'bugün', color: '#EF4444' },
              { g: 'hard', label: 'Zor', sub: 'yarın', color: '#F59E0B' },
              { g: 'good', label: 'İyi', sub: 'aralık ↑', color: '#3B82F6' },
              { g: 'easy', label: 'Kolay', sub: 'aralık ↑↑', color: '#10B981' },
            ].map(b => (
              <button key={b.g} onClick={() => grade(b.g)}
                className="py-3 rounded-2xl text-xs font-black active:scale-95 transition-transform"
                style={{ background: `${b.color}14`, border: `1.5px solid ${b.color}45`, color: b.color }}>
                {b.label}
                <span className="block text-[8px] font-bold opacity-70">{b.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════ SURE GÖRÜNÜMÜ ═══════════
  if (trackNo) {
    const track = HIFZ_TRACKS.find(t => t.no === trackNo);
    const list = verses[trackNo] || [];
    const prog = surahProgress(track);
    return (
      <div className="min-h-screen pb-24 max-w-2xl mx-auto" style={{ background: theme.bg }}>
        {celebrate && <Confetti count={26} />}
        <div className="px-5 pt-6 flex items-center gap-3">
          <button onClick={() => setTrackNo(null)} className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90" style={{ background: `${theme.gold}10` }} aria-label="Geri">
            <ArrowLeft size={17} style={{ color: theme.gold }} />
          </button>
          <div className="flex-1">
            <p className="text-lg font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{track.name} Sûresi</p>
            <p className="text-[10px]" style={{ color: theme.textSecondary }}>{prog.solid}/{prog.total} ayet sağlam · {STATUS_LABEL.solid}: 7+ gün aralık</p>
          </div>
          <p className="text-2xl" dir="rtl" style={{ fontFamily: "'Amiri', serif", color: theme.gold }}>{track.ar}</p>
        </div>

        <div className="px-5 mt-4">
          <button onClick={() => startSession(Array.from({ length: track.verses }, (_, i) => ({ surah: track.no, ayah: i + 1, track })))}
            className="w-full py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-97"
            style={{ background: 'linear-gradient(135deg, #059669, #10B981)', color: '#fff' }}>
            <Play size={15} /> Baştan sona çalış ({track.verses} ayet)
          </button>
        </div>

        <div className="px-5 mt-4 space-y-2">
          {loading && !list.length ? (
            <div className="py-8 text-center" style={{ color: theme.textSecondary }}>
              <Loader2 size={18} className="animate-spin mx-auto mb-2" /> <span className="text-xs">Ayetler yükleniyor...</span>
            </div>
          ) : (
            Array.from({ length: track.verses }, (_, i) => i + 1).map(a => {
              const stt = cardStatus(track.no, a);
              const v = list.find(x => x.number === a);
              return (
                <button key={a} onClick={() => startSession([{ surah: track.no, ayah: a, track }])}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-left active:scale-98 transition-transform"
                  style={{ background: theme.surface, border: `1px solid ${stt === 'due' ? '#F59E0B50' : theme.cardBorder}` }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{ background: `${STATUS_COLOR[stt]}18`, color: STATUS_COLOR[stt], border: `1.5px solid ${STATUS_COLOR[stt]}50` }}>{a}</span>
                  <p dir="rtl" className="flex-1 truncate text-lg" style={{ fontFamily: "'Amiri', serif", color: `${theme.textPrimary}dd` }}>
                    {v?.arabic || '...'}
                  </p>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0" style={{ background: `${STATUS_COLOR[stt]}14`, color: STATUS_COLOR[stt] }}>
                    {STATUS_LABEL[stt]}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // ═══════════ ANA GÖRÜNÜM ═══════════
  return (
    <div className="min-h-screen pb-24 max-w-3xl mx-auto" style={{ background: theme.bg }}>
      {celebrate && <Confetti count={26} />}
      <div className="px-5 pt-6 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90" style={{ background: `${theme.gold}10` }} aria-label="Geri">
          <ArrowLeft size={17} style={{ color: theme.gold }} />
        </button>
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
            📿 Ezber Asistanı
          </h1>
          <p className="text-xs" style={{ color: theme.textSecondary }}>Aralıklı tekrarla kalıcı sure ezberi</p>
        </div>
      </div>

      {/* Özet */}
      <div className="px-5 grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Sağlam ayet', value: stats.solid, color: '#10B981' },
          { label: 'Öğreniliyor', value: stats.learning, color: '#3B82F6' },
          { label: 'Bugün tekrar', value: stats.due, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] font-bold" style={{ color: theme.textSecondary }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bugünün tekrarı */}
      {due.length > 0 && (
        <div className="px-5 mb-5">
          <button onClick={() => startSession(due)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-left active:scale-98 transition-transform"
            style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)', color: '#fff' }}>
            <Award size={22} />
            <div className="flex-1">
              <p className="text-sm font-black">Bugünün Tekrarı · {due.length} ayet</p>
              <p className="text-[10px] opacity-90">Vadesi gelen kartları bitir, ezber kalıcılaşsın (+20 XP)</p>
            </div>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Sure rotası */}
      {['Başlangıç', 'Orta', 'İleri'].map(tier => (
        <div key={tier} className="mb-5">
          <p className="px-5 text-sm font-black mb-2" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
            {tier === 'Başlangıç' ? '🌱' : tier === 'Orta' ? '🪴' : '🌳'} {tier} Rotası
          </p>
          <div className="px-5 grid grid-cols-2 md:grid-cols-3 gap-2">
            {HIFZ_TRACKS.filter(t => t.tier === tier).map(t => {
              const p = surahProgress(t);
              const pct = Math.round((p.solid / p.total) * 100);
              return (
                <button key={t.no} onClick={() => setTrackNo(t.no)}
                  className="rounded-2xl p-3.5 text-left active:scale-97 transition-transform"
                  style={{ background: theme.surface, border: `1px solid ${pct === 100 ? '#10B98150' : theme.cardBorder}` }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{t.name}</p>
                    <p dir="rtl" className="text-base" style={{ fontFamily: "'Amiri', serif", color: theme.gold }}>{t.ar}</p>
                  </div>
                  <p className="text-[9px] mb-2" style={{ color: theme.textSecondary }}>{t.verses} ayet · {p.solid} sağlam</p>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}15` }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct === 100 ? '#10B981' : theme.gold }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="px-5 text-[10px] text-center" style={{ color: theme.textSecondary }}>
        Yöntem: dinle → gizle → oku → notla. "İyi/Kolay" dedikçe tekrar aralığı açılır; 7+ güne ulaşan ayet sağlamdır.
      </p>
    </div>
  );
}
