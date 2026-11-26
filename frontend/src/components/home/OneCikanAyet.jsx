import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useAyet } from '../../pages/musluman/meal';
import { SURAHS } from '../../data/surahData';

// 📜 ÖNE ÇIKAN ÂYET — ana ekranda her açılışta (ve "Başka" ile) farklı bir âyet.
// Meal paketten değiştirilmeden gelir. "Tablo yap" aynı âyetle Ayet Tablosu'nu açar.

export const ONE_CIKAN = [
  [13, 28], [94, 5], [94, 6], [93, 5], [2, 186], [39, 53], [65, 3], [2, 152], [57, 4], [3, 139], [20, 114], [2, 286],
  [14, 7], [29, 69], [3, 159], [8, 46], [16, 128], [17, 80], [25, 63], [31, 18], [33, 41], [40, 60], [49, 10], [49, 13],
  [50, 16], [55, 60], [64, 11], [73, 8], [89, 27], [103, 3], [2, 45], [2, 153], [3, 8], [7, 56], [11, 88], [12, 87],
];
const SON = 'one_cikan_son';

function sec(haric) {
  let i;
  do { i = Math.floor(Math.random() * ONE_CIKAN.length); } while (i === haric && ONE_CIKAN.length > 1);
  try { sessionStorage.setItem(SON, String(i)); localStorage.setItem(SON, String(i)); } catch { /* yok */ }
  return i;
}
function ilk() {
  try { const s = sessionStorage.getItem(SON); if (s != null) return Number(s); return sec(Number(localStorage.getItem(SON))); } catch { return 0; }
}

export default function OneCikanAyet() {
  const navigate = useNavigate();
  const [i, setI] = useState(ilk);
  const [s, a] = ONE_CIKAN[i];
  const meal = useAyet(s, a);
  const metin = meal.satirlar && meal.satirlar[0] ? meal.satirlar[0].text : '';
  const ref = `${SURAHS[s - 1].name} Sûresi · ${a}`;
  if (meal.yok) return null;

  return (
    <section data-testid="one-cikan-ayet" aria-label="Öne çıkan âyet"
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 24, background: '#FBF8F0', color: '#1A1A1A', border: '1px solid #E5D9BC', padding: '18px 18px 14px' }}>
      <svg aria-hidden width="120" height="120" viewBox="0 0 100 100" style={{ position: 'absolute', insetInlineEnd: -30, top: -30, opacity: 0.18 }}>
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="#A9873C" strokeWidth="2" />
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="#A9873C" strokeWidth="2" transform="rotate(45 50 50)" />
      </svg>
      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6, color: '#A9873C' }}>ÖNE ÇIKAN ÂYET</span>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28 }}>
          <p style={{ margin: '8px 0 6px', fontFamily: 'var(--font-okuma)', fontSize: metin.length > 220 ? 15 : 17.5, lineHeight: 1.6, minHeight: 56 }}>
            {metin || '…'}
          </p>
          <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: '#0F5C46' }}>{ref}</p>
          <p style={{ margin: '2px 0 0', fontSize: 10.5, color: '#7A6A4F' }}>{meal.etiket}</p>
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="button" data-testid="tablo-yap" onClick={() => navigate(`/ayet-tablosu?s=${s}&a=${a}`)}
          style={{ flex: 1, minHeight: 44, borderRadius: 22, border: 'none', background: '#0F5C46', color: '#FBF8F0', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <ImageIcon size={16} aria-hidden /> Tablo yap
        </button>
        <button type="button" onClick={() => setI(sec(i))} aria-label="Başka âyet"
          style={{ minHeight: 44, padding: '0 16px', borderRadius: 22, border: '1px solid #D9CDAE', background: 'transparent', color: '#5C4B2A', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={15} aria-hidden /> Başka
        </button>
      </div>
    </section>
  );
}
