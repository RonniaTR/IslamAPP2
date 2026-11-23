import React, { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// 🧭 REHBER OKLAR — ilk açılışta ekranı tanıtan, el çizimi gibi kıvrılan altın oklar.
// Her adımda hedef öğe (data-rehber="...") aydınlık bir çerçeveye alınır, gerisi hafifçe kararır;
// konuşma balonundan hedefe kesik çizgili bir ok uzanır, ucunda küçük yıldız. "Tamam" ile sonraki adıma geçilir.
// Bir kez görülür (anahtar localStorage'da); "Atla" her zaman var.

export function rehberGorulduMu(anahtar) { try { return localStorage.getItem(anahtar) === '1'; } catch { return true; } }

export default function RehberOklar({ adimlar, anahtar, onBitti }) {
  const [i, setI] = useState(0);
  const [kutu, setKutu] = useState(null);
  const adim = adimlar[i];

  useEffect(() => {
    const el = adim && document.querySelector(`[data-rehber="${adim.hedef}"]`);
    if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, [adim]);

  useLayoutEffect(() => {
    if (!adim) return undefined;
    const olc = () => {
      const el = document.querySelector(`[data-rehber="${adim.hedef}"]`);
      if (!el) { setKutu(null); return; }
      const r = el.getBoundingClientRect();
      const pad = adim.bosluk ?? 8;
      setKutu({ x: r.left - pad, y: r.top - pad, w: r.width + 2 * pad, h: r.height + 2 * pad });
    };
    const t = setTimeout(olc, 60);
    window.addEventListener('resize', olc);
    window.addEventListener('scroll', olc, true);
    return () => { clearTimeout(t); window.removeEventListener('resize', olc); window.removeEventListener('scroll', olc, true); };
  }, [adim]);

  const bitir = () => { try { localStorage.setItem(anahtar, '1'); } catch { /* kota */ } onBitti?.(); };
  const sonraki = () => (i + 1 < adimlar.length ? setI(i + 1) : bitir());

  if (!adim) return null;
  const vh = window.innerHeight; const vw = window.innerWidth;
  // balon hedefin altında mı üstünde mi?
  const altta = kutu ? kutu.y + kutu.h / 2 < vh * 0.5 : true;
  const balonY = kutu ? (altta ? Math.min(vh - 190, kutu.y + kutu.h + 70) : Math.max(20, kutu.y - 190)) : vh * 0.4;
  // ok: balonun kenarından hedefin kenarına kıvrık çizgi
  const bx = vw / 2 + (adim.okYonu === 'sol' ? -60 : 60);
  const by = altta ? balonY : balonY + 120;
  const hx = kutu ? Math.min(Math.max(kutu.x + kutu.w * (adim.okX ?? 0.5), 20), vw - 20) : vw / 2;
  const hy = kutu ? (altta ? kutu.y + kutu.h + 6 : kutu.y - 6) : vh / 2;
  const cx = (bx + hx) / 2 + (adim.okYonu === 'sol' ? -70 : 70);
  const cy = (by + hy) / 2;

  return (
    <div data-testid="rehber-oklar" role="dialog" aria-modal="true" aria-label="Oyun bahçesi tanıtımı" style={{ position: 'fixed', inset: 0, zIndex: 2500 }}>
      {/* karartma + delik */}
      <svg width={vw} height={vh} style={{ position: 'absolute', inset: 0 }} aria-hidden>
        <defs>
          <mask id="rehber-delik">
            <rect width={vw} height={vh} fill="#fff" />
            {kutu && <motion.rect initial={false} animate={{ x: kutu.x, y: kutu.y, width: kutu.w, height: kutu.h }} rx="26" fill="#000" transition={{ type: 'spring', stiffness: 140, damping: 20 }} />}
          </mask>
        </defs>
        <rect width={vw} height={vh} fill="rgba(16,40,26,0.62)" mask="url(#rehber-delik)" />
        {kutu && (
          <motion.rect initial={false} animate={{ x: kutu.x, y: kutu.y, width: kutu.w, height: kutu.h }} rx="26" fill="none" stroke="#FFD93D" strokeWidth="3" strokeDasharray="10 8"
            transition={{ type: 'spring', stiffness: 140, damping: 20 }} />
        )}
        {kutu && (
          <g key={i}>
            <motion.path d={`M${bx} ${by} Q${cx} ${cy} ${hx} ${hy}`} fill="none" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 10"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.15 }} />
            <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.3, 1], opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }} style={{ transformOrigin: `${hx}px ${hy}px` }}>
              <rect x={hx - 7} y={hy - 7} width="14" height="14" fill="#FFD93D" />
              <rect x={hx - 7} y={hy - 7} width="14" height="14" fill="#FFD93D" transform={`rotate(45 ${hx} ${hy})`} />
            </motion.g>
          </g>
        )}
      </svg>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          style={{ position: 'absolute', left: 20, right: 20, top: balonY, margin: '0 auto', maxWidth: 360, background: '#FFFFFF', borderRadius: 26, padding: '16px 18px 14px', boxShadow: '0 10px 0 #DFF3E2, 0 18px 40px rgba(0,0,0,0.25)', fontFamily: "'Nunito', 'Noto Sans', sans-serif" }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 900, color: '#2D8A4E', letterSpacing: 1 }}>{i + 1} / {adimlar.length}</p>
          <p style={{ margin: '4px 0 12px', fontSize: 18, fontWeight: 900, color: '#1B4D2E', lineHeight: 1.3 }}>{adim.metin}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" onClick={bitir} style={{ background: 'none', border: 'none', color: '#6E8577', fontWeight: 800, fontSize: 14, cursor: 'pointer', minHeight: 44 }}>Atla</button>
            <button type="button" data-testid="rehber-tamam" onClick={sonraki}
              style={{ minHeight: 46, padding: '0 22px', borderRadius: 23, background: '#2D8A4E', color: '#fff', border: 'none', fontSize: 16, fontWeight: 900, boxShadow: '0 4px 0 #1E6538', cursor: 'pointer' }}>
              {i + 1 < adimlar.length ? 'Tamam' : 'Hadi başlayalım!'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
