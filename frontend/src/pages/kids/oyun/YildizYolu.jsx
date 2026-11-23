import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Lock } from 'lucide-react';

// ✨ YILDIZ YOLU — çocuk oyunlarının ilerleme yolu.
// Bahçeden kıvrılarak geçen bir patika; üzerinde 12 durak. Her durak bir oyun turudur.
// Geçilen durak altın yıldıza döner, sıradaki durağın üstünde zıplayan bir ok ve "Buradan devam!" balonu durur.
// Her 4. durak bir "hediye kapısı"dır (küçük kemer), 12. durak yolun sonu. Yol bitince 2. yol başlar.
// İlerleme yalnız bu cihazda (kids_yol_v1).

export const DURAK_SAYISI = 12;
const ANAHTAR = 'kids_yol_v1';
export const yolOku = () => { try { return { yol: 1, adim: 0, ...JSON.parse(localStorage.getItem(ANAHTAR)) }; } catch { return { yol: 1, adim: 0 }; } };
export const yolYaz = (v) => { try { localStorage.setItem(ANAHTAR, JSON.stringify(v)); } catch { /* kota */ } return v; };
export function durakGec() {
  const y = yolOku();
  const adim = y.adim + 1;
  return yolYaz(adim >= DURAK_SAYISI ? { yol: y.yol + 1, adim: 0, son: true } : { yol: y.yol, adim });
}

const W = 360; const ADIM_Y = 96; const UST = 60;
const nokta = (i) => ({ x: W / 2 + Math.sin(i * 0.95 + 0.4) * 118, y: UST + i * ADIM_Y });

/** Noktalardan geçen yumuşak eğri (Catmull-Rom → Bezier). */
function egri(pts) {
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]; const p1 = pts[i]; const p2 = pts[i + 1]; const p3 = pts[i + 2] || p2;
    d += ` C${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function YildizYolu({ duraklar, adim, yolNo, onDurak }) {
  const pts = useMemo(() => Array.from({ length: DURAK_SAYISI }, (_, i) => nokta(i)), []);
  const d = useMemo(() => egri(pts), [pts]);
  const H = UST + (DURAK_SAYISI - 1) * ADIM_Y + 70;
  const gecilenOran = adim / (DURAK_SAYISI - 1);

  return (
    <div data-rehber="yol" style={{ position: 'relative', width: '100%', maxWidth: 420, margin: '0 auto', aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" aria-hidden style={{ position: 'absolute', inset: 0 }}>
        {/* çimen kenarlı patika */}
        <path d={d} fill="none" stroke="#BFE3C3" strokeWidth="34" strokeLinecap="round" />
        <path d={d} fill="none" stroke="#F7EBD0" strokeWidth="24" strokeLinecap="round" />
        <path d={d} fill="none" stroke="#E5D3A8" strokeWidth="2" strokeDasharray="1 14" strokeLinecap="round" />
        {/* geçilen kısım: altın iz */}
        <motion.path d={d} fill="none" stroke="#F2B33D" strokeWidth="7" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: gecilenOran }} transition={{ duration: 1.1, ease: 'easeOut' }} />
        {/* kenar süsleri: çiçek ve fidan */}
        {pts.map((p, i) => {
          const x = p.x > W / 2 ? p.x - 92 : p.x + 92;
          return i % 2 === 0
            ? <g key={i} transform={`translate(${x} ${p.y + 40})`}><circle r="5" fill={['#FF6B8A', '#FFD93D', '#FF9F43', '#7EC8F2'][i % 4]} /><circle r="2" fill="#fff" /></g>
            : <g key={i} transform={`translate(${x} ${p.y + 34})`}><path d="M0 14 V2" stroke="#4CAF50" strokeWidth="2.4" /><ellipse cx="-5" cy="3" rx="6" ry="3.4" fill="#7CC67E" transform="rotate(-30 -5 3)" /><ellipse cx="5" cy="0" rx="6" ry="3.4" fill="#7CC67E" transform="rotate(30 5 0)" /></g>;
        })}
      </svg>

      {pts.map((p, i) => {
        const gecti = i < adim; const simdi = i === adim; const kilitli = i > adim;
        const dk = duraklar[i % duraklar.length];
        const kapi = (i + 1) % 4 === 0;
        return (
          <div key={i} style={{ position: 'absolute', left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {simdi && (
              <motion.div aria-hidden data-rehber="ok" animate={{ y: [0, -10, 0] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', bottom: '100%', marginBottom: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: 14, background: '#1B4D2E', color: '#fff', fontSize: 13, fontWeight: 900, boxShadow: '0 4px 0 #0F3320' }}>Buradan devam!</span>
                <svg width="26" height="20" viewBox="0 0 26 20"><path d="M13 19 L3 5 H9 V0 H17 V5 H23 Z" fill="#F2B33D" stroke="#B9821B" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              </motion.div>
            )}
            <motion.button type="button" data-testid={`durak-${i}`} disabled={kilitli} onClick={() => onDurak(dk, i)}
              whileTap={!kilitli ? { scale: 0.9 } : undefined}
              animate={simdi ? { boxShadow: ['0 0 0 0 rgba(242,179,61,0.65)', '0 0 0 14px rgba(242,179,61,0)'] } : {}}
              transition={simdi ? { duration: 1.4, repeat: Infinity } : {}}
              aria-label={`${i + 1}. durak: ${dk.ad}${gecti ? ' (geçildi)' : kilitli ? ' (kilitli)' : ''}`}
              style={{ width: simdi ? 70 : 58, height: simdi ? 70 : 58, borderRadius: kapi ? '30px 30px 12px 12px' : '50%', cursor: kilitli ? 'default' : 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: gecti ? 'radial-gradient(circle at 35% 30%, #FFE58A, #F2B33D)' : simdi ? dk.renk : '#FFFFFF',
                border: `4px solid ${gecti ? '#C98E1E' : simdi ? '#FFFFFF' : '#D7E6DA'}`,
                boxShadow: gecti ? '0 5px 0 #B9821B' : simdi ? `0 6px 0 ${dk.golge}` : '0 4px 0 #D7E6DA' }}>
              {gecti ? <Star size={26} fill="#FFFFFF" color="#FFFFFF" />
                : kilitli ? <Lock size={18} color="#A9BDB0" />
                  : <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1.05, textAlign: 'center', padding: 4 }}>{dk.kisa}</span>}
            </motion.button>
            <span style={{ marginTop: 6, fontSize: 12, fontWeight: 800, color: kilitli ? '#9AB1A1' : '#1B4D2E', background: 'rgba(255,255,255,0.85)', padding: '1px 8px', borderRadius: 8, whiteSpace: 'nowrap' }}>
              {i + 1}. {dk.ad}
            </span>
          </div>
        );
      })}

      {/* yolun sonu: bahçe kapısı */}
      <div style={{ position: 'absolute', left: `${(pts[DURAK_SAYISI - 1].x / W) * 100}%`, top: `${((pts[DURAK_SAYISI - 1].y + 62) / H) * 100}%`, transform: 'translateX(-50%)', fontSize: 12, fontWeight: 900, color: '#2D8A4E', whiteSpace: 'nowrap' }}>
        {yolNo}. yolun sonu · bahçe kapısı
      </div>
    </div>
  );
}
