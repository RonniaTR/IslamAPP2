import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudRain, Wind, UserRound, Flame, Undo2, Sun, RefreshCw, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTx } from '../../i18n';
import { localAyet } from '../../services/localRehber';

// 💬 KALBİNDEN GEÇEN — bir hâl seç, sana o hâle dair ayet gelsin.
// Ayetler elle seçilmiş tema listesinden (backend/rehber.py THEMES) gelir; cihazdaki meal paketinden okunur,
// İNTERNETSİZ çalışır. Yapay zekâ yok, persona yok, yorum yok: ayet kâğıt kartta, kaynağıyla, olduğu gibi.
const HALLER = [
  { id: 'daral', label: 'Daraldım', q: 'daraldım', Icon: CloudRain },
  { id: 'kaygi', label: 'Kaygılıyım', q: 'kaygı', Icon: Wind },
  { id: 'yalniz', label: 'Yalnızım', q: 'yalnız', Icon: UserRound },
  { id: 'ofke', label: 'Öfkeliyim', q: 'öfke', Icon: Flame },
  { id: 'pisman', label: 'Pişmanım', q: 'pişman', Icon: Undo2 },
  { id: 'sukur', label: 'Şükür doluyum', q: 'şükür', Icon: Sun },
];
const PAPER = { bg: '#FBF8F0', ink: '#1A1A1A', soft: '#5C4B2A', line: '#D9CDAE' };

export default function KalbindenGecen() {
  const { theme } = useTheme();
  const tt = useTx();
  const navigate = useNavigate();
  const [sel, setSel] = useState(null);
  const [res, setRes] = useState(null);
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);

  const pick = async (h) => {
    if (busy) return;
    setSel(h.id); setI(0); setBusy(true);
    const r = await localAyet(h.q).catch(() => null);
    setBusy(false);
    if (r && r.results && r.results.length) setRes(r);
    else navigate(`/rehber?q=${encodeURIComponent(tt(h.label))}`);   // paket henüz inmediyse Rehber'e
  };
  const ayah = res && res.results[i % res.results.length];

  return (
    <section aria-label={tt('Kalbinden ne geçiyor?')} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 600, letterSpacing: -0.3, margin: '6px 0 0' }}>{tt('Kalbinden ne geçiyor?')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
        {HALLER.map((h) => {
          const on = sel === h.id;
          return (
            <button key={h.id} type="button" onClick={() => pick(h)} aria-pressed={on}
              style={{ minHeight: 76, borderRadius: 20, padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
                background: on ? theme.primary : theme.surface, color: on ? '#FFFFFF' : theme.textPrimary, border: `1px solid ${on ? theme.primary : theme.cardBorder}` }}>
              <h.Icon size={20} strokeWidth={1.8} color={on ? '#FFFFFF' : theme.gold} aria-hidden />
              <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{tt(h.label)}</span>
            </button>
          );
        })}
      </div>
      {ayah && (
        <article className="paper" style={{ background: PAPER.bg, color: PAPER.ink, borderRadius: 22, padding: '18px 18px 14px', border: `1px solid ${PAPER.line}` }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, lineHeight: 1.6, margin: 0 }}>{ayah.meal}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <span style={{ flex: 1, fontSize: 12, color: PAPER.soft }}>{ayah.ref}</span>
            {res.results.length > 1 && (
              <button type="button" onClick={() => setI(i + 1)} aria-label={tt('Başka bir ayet')} style={{ width: 40, height: 40, borderRadius: 20, border: `1px solid ${PAPER.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
                <RefreshCw size={16} color={PAPER.soft} />
              </button>
            )}
            <button type="button" onClick={() => navigate(`/rehber?q=${encodeURIComponent(tt(HALLER.find((h) => h.id === sel).label))}`)} aria-label={tt("Rehber'de aç")} style={{ width: 40, height: 40, borderRadius: 20, border: `1px solid ${PAPER.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
              <ArrowUpRight size={16} color={PAPER.soft} />
            </button>
          </div>
          <p style={{ fontSize: 10, color: PAPER.soft, opacity: 0.8, margin: '8px 0 0' }}>{res.credits && res.credits.meal}</p>
        </article>
      )}
    </section>
  );
}
