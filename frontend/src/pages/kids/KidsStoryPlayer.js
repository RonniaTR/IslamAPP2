import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, Square } from 'lucide-react';
import KidsScene from '../../components/kids/KidsScene';
import { KIDS_STORIES } from '../../data/kidsStories';
import { addStars, markKids, loadKidsProgress } from '../../services/kidsFamily';
import sfx from '../../services/sfx';
import Confetti from '../games/Confetti';

// 📖 HİKÂYE OKUYUCU — sayfa sayfa: hareketli sahne, büyük yazı, kaynak. İstenirse cihazın kendi sesiyle
// sesli okunur (internet gerekmez; sesi olmayan cihazda düğme görünmez). Sonda "ne öğrendik" ve tek soru.
const font = { fontFamily: "'Nunito', 'Noto Sans', sans-serif" };
const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

export default function KidsStoryPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const story = KIDS_STORIES.find((s) => s.id === id) || KIDS_STORIES[0];
  const [i, setI] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [pick, setPick] = useState(null);
  const total = story.sayfalar.length;
  const atEnd = i >= total;
  const q = useMemo(() => {
    const order = story.soru.o.map((_, k) => k).sort(() => Math.random() - 0.5);
    return { o: order.map((k) => story.soru.o[k]), a: order.indexOf(story.soru.a) };
  }, [story]);

  const stop = () => { if (canSpeak) window.speechSynthesis.cancel(); setSpeaking(false); };
  const speak = (text) => {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'tr-TR'; u.rate = 0.9; u.pitch = 1.1;
    u.onend = () => setSpeaking(false);
    setSpeaking(true); window.speechSynthesis.speak(u);
  };
  useEffect(() => () => { if (canSpeak) window.speechSynthesis.cancel(); }, []);
  useEffect(() => { if (speaking && !atEnd) speak(story.sayfalar[i].metin); }, [i]);

  const go = (n) => { sfx.tick(); setI(Math.max(0, Math.min(total, n))); };
  const answer = (k) => {
    if (pick !== null) return;
    setPick(k);
    if (k === q.a) sfx.correct(); else sfx.wrong();
    if (!(loadKidsProgress().hikaye || []).includes(story.id)) { addStars(k === q.a ? 8 : 5); markKids('hikaye', story.id); }
  };
  const p = story.sayfalar[Math.min(i, total - 1)];

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8EC', color: '#24364A', paddingBottom: 110, ...font }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button type="button" onClick={() => { stop(); navigate('/kids/stories'); }} aria-label="Haritaya dön" style={{ width: 46, height: 46, borderRadius: 23, background: '#FFFFFF', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={26} color="#24364A" /></button>
          <h1 style={{ flex: 1, fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>{story.title}</h1>
          {canSpeak && !atEnd && (
            <button type="button" onClick={() => (speaking ? stop() : speak(p.metin))} aria-label={speaking ? 'Sesi durdur' : 'Sesli oku'} style={{ width: 46, height: 46, borderRadius: 23, background: speaking ? story.color : '#FFFFFF', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {speaking ? <Square size={18} color="#fff" /> : <Volume2 size={22} color={story.color} />}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, margin: '14px 0' }}>
          {Array.from({ length: total + 1 }, (_, k) => <span key={k} style={{ flex: 1, height: 8, borderRadius: 4, background: k <= i ? story.color : '#EADFCB', transition: 'background .3s' }} />)}
        </div>

        <AnimatePresence mode="wait">
          {!atEnd ? (
            <motion.div key={i} initial={{ opacity: 0, x: 50, rotate: 1 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: 'spring', stiffness: 150, damping: 20 }}>
              <div style={{ borderRadius: 28, overflow: 'hidden', border: '5px solid #FFFFFF', boxShadow: '0 12px 26px -14px rgba(36,54,74,0.5)' }}>
                <KidsScene id={p.sahne} height={220} />
              </div>
              <p style={{ fontSize: 21, lineHeight: 1.6, fontWeight: 700, margin: '18px 4px 6px' }}>{p.metin}</p>
              <p style={{ fontSize: 13, color: '#9A8A65', fontWeight: 700, margin: '0 4px' }}>Kaynak: {p.kaynak}</p>
            </motion.div>
          ) : (
            <motion.div key="son" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {pick === q.a && <Confetti count={40} />}
              <div style={{ background: '#E8F7EA', borderRadius: 24, padding: 18 }}>
                <p style={{ fontSize: 14, fontWeight: 900, color: '#2D8A4E', margin: 0 }}>BU HİKÂYEDEN NE ÖĞRENDİK?</p>
                <p style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.5, margin: '6px 0 0' }}>{story.ders}</p>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: '6px 0 0' }}>{story.soru.q}</h2>
              {q.o.map((o, k) => {
                const right = pick !== null && k === q.a; const wrong = pick === k && k !== q.a;
                return (
                  <motion.button key={o} type="button" onClick={() => answer(k)} animate={wrong ? { x: [0, -8, 8, 0] } : right ? { scale: [1, 1.05, 1] } : {}}
                    style={{ minHeight: 60, borderRadius: 22, fontSize: 18, fontWeight: 800, padding: '0 16px', textAlign: 'start', border: '3px solid', borderColor: right ? '#2D8A4E' : wrong ? '#EF5350' : '#EADFCB', background: right ? '#E3F5E6' : '#FFFFFF', color: '#24364A' }}>
                    {right ? '✅ ' : ''}{o}
                  </motion.button>
                );
              })}
              {pick !== null && (
                <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate('/kids/stories')}
                  style={{ alignSelf: 'center', minHeight: 58, padding: '0 30px', borderRadius: 29, background: '#FF9F43', color: '#fff', fontSize: 19, fontWeight: 900, boxShadow: '0 7px 0 #D97A1C' }}>
                  ⭐ Haritaya dön
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!atEnd && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
            <button type="button" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Önceki sayfa" style={{ width: 60, height: 60, borderRadius: 30, background: '#FFFFFF', border: '3px solid #EADFCB', opacity: i === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={30} color="#24364A" /></button>
            <button type="button" onClick={() => go(i + 1)} style={{ minHeight: 60, padding: '0 26px', borderRadius: 30, background: story.color, color: '#fff', fontSize: 19, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 6px 0 rgba(0,0,0,0.15)' }}>
              {i === total - 1 ? 'Bitir' : 'Sonraki'} <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
