import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KidsScene from '../../components/kids/KidsScene';
import { KIDS_STORIES } from '../../data/kidsStories';
import { loadKidsProgress } from '../../services/kidsFamily';

// 🗺️ HİKÂYE HARİTASI — denizde adalar; her ada bir hikâye. Küçük gemi sıradaki okunmamış adanın yanında bekler.
const font = { fontFamily: "'Nunito', 'Noto Sans', sans-serif" };
const ROW = 190;

export default function KidsStories() {
  const navigate = useNavigate();
  const done = loadKidsProgress().hikaye || [];
  const nextIdx = Math.max(0, KIDS_STORIES.findIndex((s) => !done.includes(s.id)));
  const height = KIDS_STORIES.length * ROW + 60;
  const pts = useMemo(() => KIDS_STORIES.map((_, k) => ({ x: k % 2 ? 230 : 90, y: 70 + k * ROW })), []);
  const route = pts.map((p, k) => (k === 0 ? `M${p.x} ${p.y}` : `Q${k % 2 ? 300 : 20} ${p.y - ROW / 2} ${p.x} ${p.y}`)).join(' ');

  return (
    <div style={{ minHeight: '100vh', background: '#BFE6FF', paddingBottom: 110, color: '#24364A', ...font }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '22px 16px 6px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, color: '#1F4E79' }}>Hikâye Haritası</h1>
        <p style={{ fontSize: 16, fontWeight: 800, margin: '4px 0 0', color: '#3D6E99' }}>{done.length} / {KIDS_STORIES.length} ada keşfedildi</p>
      </div>
      <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto', height }}>
        <svg viewBox={`0 0 320 ${height}`} width="100%" height={height} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }} aria-hidden>
          {Array.from({ length: Math.ceil(height / 60) }, (_, i) => (
            <motion.path key={i} d={`M${(i * 70) % 300} ${30 + i * 60} q10 -6 20 0 t20 0`} fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round"
              animate={{ x: [0, 12, 0] }} transition={{ duration: 4 + (i % 3), repeat: Infinity }} />
          ))}
          <path d={route} fill="none" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="3 12" strokeLinecap="round" />
        </svg>
        {KIDS_STORIES.map((s, k) => {
          const p = pts[k]; const ok = done.includes(s.id);
          return (
            <motion.button key={s.id} type="button" onClick={() => navigate(`/kids/story/${s.id}`)}
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k * 0.12, type: 'spring', bounce: 0.45 }} whileTap={{ scale: 0.94 }}
              style={{ position: 'absolute', left: `calc(${(p.x / 320) * 100}% - 78px)`, top: p.y - 60, width: 156, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3 + k * 0.4, repeat: Infinity }}
                style={{ borderRadius: '50% 50% 46% 46% / 55% 55% 45% 45%', overflow: 'hidden', border: `5px solid ${ok ? '#FFD93D' : '#F6E3B4'}`, boxShadow: '0 10px 0 rgba(31,78,121,0.25)', width: 156, height: 116, position: 'relative' }}>
                <KidsScene id={s.kapak} height={116} />
                {ok && <span style={{ position: 'absolute', top: 6, insetInlineEnd: 10 }}><Star size={26} fill="#FFD93D" color="#F2B33D" /></span>}
              </motion.div>
              <span style={{ display: 'block', marginTop: 8, background: '#FFFFFF', borderRadius: 16, padding: '6px 10px', fontSize: 15, fontWeight: 900, lineHeight: 1.25, boxShadow: '0 3px 0 rgba(31,78,121,0.15)' }}>{s.title}</span>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 800, color: s.color, marginTop: 3 }}>{s.konu}</span>
            </motion.button>
          );
        })}
        {/* küçük gemi */}
        {pts[nextIdx] && done.length < KIDS_STORIES.length && (
          <motion.div aria-hidden animate={{ rotate: [-6, 6, -6], y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity }}
            style={{ position: 'absolute', left: `calc(${(pts[nextIdx].x / 320) * 100}% + ${nextIdx % 2 ? -110 : 70}px)`, top: pts[nextIdx].y + 20, fontSize: 34 }}>⛵</motion.div>
        )}
      </div>
    </div>
  );
}
