import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, RotateCcw } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useTx } from '../i18n';

// 📿 GÖZSÜZ TESBİHAT (docs/YENI_OZELLIKLER.md 8.3)
// Ekranın her yeri tek bir düğmedir; bakmadan çekilir. Her sayımda hafif, her 33'te güçlü titreşim.
// Sayılar KAYDEDİLMEZ, istatistik ve XP yoktur.

const STEPS = [
  { ar: 'سُبْحَانَ ٱللَّٰهِ', tr: 'Sübhânallah', n: 33 },
  { ar: 'ٱلْحَمْدُ لِلَّٰهِ', tr: 'Elhamdülillah', n: 33 },
  { ar: 'ٱللَّٰهُ أَكْبَرُ', tr: 'Allâhü ekber', n: 33 },
  { ar: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', tr: 'Lâ ilâhe illallah', n: 1 },
];

async function buzz(strong) {
  try { await Haptics.impact({ style: strong ? ImpactStyle.Heavy : ImpactStyle.Light }); return; } catch { /* web */ }
  try { if (navigator.vibrate) navigator.vibrate(strong ? [60, 40, 60] : 12); } catch { /* desteklenmiyor */ }
}

let actx = null;
function tone() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = actx || new AC();
    const o = actx.createOscillator(); const g = actx.createGain();
    o.type = 'sine'; o.frequency.value = 660;
    g.gain.setValueAtTime(0.0001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.12, actx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.9);
    o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + 1);
  } catch { /* ses yok */ }
}

export default function TesbihatPage() {
  const navigate = useNavigate();
  const tt = useTx();
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const lock = useRef(0);

  const tap = useCallback(() => {
    if (done) return;
    const now = Date.now();
    if (now - lock.current < 90) return; // çift dokunuşu say­ma
    lock.current = now;
    const next = count + 1;
    if (next >= STEPS[step].n) {
      buzz(true); tone();
      if (step === STEPS.length - 1) { setDone(true); setCount(next); setTimeout(tone, 350); }
      else { setStep(step + 1); setCount(0); }
    } else { buzz(false); setCount(next); }
  }, [count, step, done]);

  const reset = (e) => { e.stopPropagation(); setStep(0); setCount(0); setDone(false); };
  const s = STEPS[step];
  const pct = Math.min(1, count / s.n);
  const R = 118; const C = 2 * Math.PI * R;

  return (
    <div role="button" tabIndex={0} aria-label={tt('Saymak için ekrana dokun')} onClick={tap}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tap(); } }}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center select-none"
      style={{ background: '#07090F', color: '#E8E6DF', touchAction: 'manipulation' }} data-testid="tesbihat-page">
      <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} aria-label={tt('Kapat')} className="absolute top-5 left-5 p-3"><X size={22} color="#8F96A8" /></button>
      <button onClick={reset} aria-label={tt('Baştan başla')} className="absolute top-5 right-5 p-3"><RotateCcw size={20} color="#8F96A8" /></button>

      <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
        <svg width="280" height="280" className="absolute" aria-hidden>
          <circle cx="140" cy="140" r={R} fill="none" stroke="#161C2B" strokeWidth="6" />
          <circle cx="140" cy="140" r={R} fill="none" stroke="#E0B354" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 140 140)" style={{ transition: 'stroke-dashoffset 160ms' }} />
        </svg>
        <div className="text-center">
          <div dir="rtl" lang="ar" style={{ fontFamily: "'Amiri', serif", fontSize: 34, lineHeight: 1.5 }}>{s.ar}</div>
          <div style={{ fontSize: 14, color: '#8F96A8', marginTop: 4 }}>{s.tr}</div>
          <div aria-live="polite" style={{ fontSize: 40, fontWeight: 800, marginTop: 10, color: '#E0B354' }}>{done ? '✓' : count}</div>
        </div>
      </div>

      <p className="mt-10 text-[13px] text-center px-10" style={{ color: '#8F96A8' }}>
        {done ? tt('Allah kabul etsin.') : tt('Ekranın her yerine dokunabilirsin. Bakmana gerek yok; 33’te titreşim değişir.')}
      </p>
      <div className="flex gap-2 mt-6" aria-hidden>
        {STEPS.map((_, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i < step || done ? '#E0B354' : i === step ? '#8F96A8' : '#161C2B' }} />)}
      </div>
    </div>
  );
}
