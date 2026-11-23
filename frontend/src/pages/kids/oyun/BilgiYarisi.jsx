import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { KIDS_QUESTIONS } from '../../../data/kidsQuestions';
import sfx from '../../../services/sfx';

// 🏮 BİLGİ YARIŞI — çocuklar için jokerli yarışma. Tek başına ya da aynı telefonda ailece (sırayla).
// Süre yok, can yok, ceza yok. Yanlışta doğrusu nazikçe gösterilir. Her doğru bir yıldız.
// Üç joker (her oyuncunun kendi jokerleri, oyun başına birer kez):
//   ½  Yarısı      → iki yanlış şıkkı kaldırır
//   🏮 Fener       → doğru şıkkın üzerinde bir an ışık yakar
//   ↺  İkinci Şans → bu soruda yanılırsan bir daha denersin
// Üstte "yol" şeridi: fener, her soruda bir durak ilerler.

const RENK = { yesil: '#2D8A4E', acik: '#DFF3E2', altin: '#F2B33D', murekkep: '#1B4D2E', yanlis: '#E26D5C' };
const OYUNCU_RENK = ['#2D8A4E', '#4A90D9', '#FF9F43', '#9B59B6'];

const karistir = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export const JOKERLER = [
  { id: 'yari', ad: 'Yarısı', isaret: '½' },
  { id: 'fener', ad: 'Fener', isaret: 'fener' },
  { id: 'sans', ad: 'İkinci Şans', isaret: '↺' },
];

function FenerIkon({ boyut = 22, yanik = true }) {
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 24 24" aria-hidden>
      <path d="M9 3 H15 M12 3 V5" stroke="#7A5A1E" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 7 Q12 4 17 7 V16 Q12 19 7 16 Z" fill={yanik ? '#FFD93D' : '#E8E1CC'} stroke="#7A5A1E" strokeWidth="1.4" />
      <path d="M7 11 H17 M12 7 V17" stroke="#7A5A1E" strokeWidth="0.8" opacity="0.6" />
      <path d="M9 19 H15" stroke="#7A5A1E" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function JokerRozet({ j, kullanildi, aktif, onClick, boyut = 52 }) {
  return (
    <motion.button type="button" data-testid={`joker-${j.id}`} disabled={kullanildi} onClick={onClick} whileTap={{ scale: 0.9 }}
      animate={aktif ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={aktif ? { duration: 0.9, repeat: Infinity } : {}}
      aria-label={`${j.ad} jokeri${kullanildi ? ' (kullanıldı)' : ''}`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: kullanildi ? 'default' : 'pointer', opacity: kullanildi ? 0.35 : 1, padding: 0 }}>
      <span style={{ position: 'relative', width: boyut, height: boyut, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* sekiz köşeli rozet */}
        <svg width={boyut} height={boyut} viewBox="0 0 100 100" aria-hidden style={{ position: 'absolute', inset: 0 }}>
          <rect x="17" y="17" width="66" height="66" rx="8" fill={aktif ? '#FFF3C4' : '#FFFFFF'} stroke={RENK.altin} strokeWidth="5" />
          <rect x="17" y="17" width="66" height="66" rx="8" fill={aktif ? '#FFF3C4' : '#FFFFFF'} stroke={RENK.altin} strokeWidth="5" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="30" fill={aktif ? '#FFF3C4' : '#FFFFFF'} />
        </svg>
        <span style={{ position: 'relative', fontSize: 20, fontWeight: 900, color: RENK.murekkep }}>
          {j.isaret === 'fener' ? <FenerIkon /> : j.isaret}
        </span>
        {kullanildi && <span aria-hidden style={{ position: 'absolute', width: boyut * 0.8, height: 3, background: RENK.yanlis, transform: 'rotate(-35deg)', borderRadius: 2 }} />}
      </span>
      <span style={{ fontSize: 11, fontWeight: 800, color: RENK.murekkep }}>{j.ad}</span>
    </motion.button>
  );
}

/** Soru şeridi: kıvrımlı küçük yol, fener bulunduğun soruda. */
function SoruYolu({ toplam, sira, sonuclar }) {
  const w = 340; const adim = (w - 24) / (toplam - 1);
  const nokta = (i) => ({ x: 12 + i * adim, y: 22 + Math.sin(i * 1.1) * 8 });
  const d = Array.from({ length: toplam }, (_, i) => nokta(i)).map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const f = nokta(sira);
  return (
    <svg viewBox={`0 0 ${w} 44`} width="100%" height="44" aria-label={`${toplam} sorudan ${sira + 1}.`}>
      <path d={d} fill="none" stroke="#CFE6D2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {Array.from({ length: toplam }, (_, i) => {
        const p = nokta(i); const s = sonuclar[i];
        return <circle key={i} cx={p.x} cy={p.y} r={5.5} fill={s === true ? RENK.altin : s === false ? '#F6C9C1' : '#FFFFFF'} stroke={s === true ? '#C98E1E' : '#9CCBA6'} strokeWidth="1.6" />;
      })}
      <motion.g initial={false} animate={{ x: f.x - 9, y: f.y - 22 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
        <foreignObject width="18" height="18"><FenerIkon boyut={18} /></foreignObject>
      </motion.g>
    </svg>
  );
}

export default function BilgiYarisi({ oyuncular = ['Ben'], soruSayisi = 8, onYildiz, onBitti }) {
  const kisiBasi = Math.max(1, Math.min(soruSayisi, Math.floor(KIDS_QUESTIONS.length / oyuncular.length)));
  const toplam = kisiBasi * oyuncular.length;   // herkes eşit sayıda soru alır
  const sorular = useMemo(() => karistir(KIDS_QUESTIONS).slice(0, toplam)
    .map((q) => ({ ...q, siklar: karistir(q.o), dogru: q.o[0] })), [toplam]);
  const [sira, setSira] = useState(0);
  const [puan, setPuan] = useState(() => oyuncular.map(() => 0));
  const [jok, setJok] = useState(() => oyuncular.map(() => ({ yari: false, fener: false, sans: false })));
  const [gizli, setGizli] = useState([]);
  const [fener, setFener] = useState(false);
  const [sansAktif, setSansAktif] = useState(false);
  const [denenen, setDenenen] = useState([]);
  const [secim, setSecim] = useState(null); // {sik, dogru}
  const [sonuclar, setSonuclar] = useState([]);
  const [bitti, setBitti] = useState(false);

  const kim = sira % oyuncular.length;
  const s = sorular[sira];
  const coklu = oyuncular.length > 1;

  const jokerKullan = (id) => {
    if (secim || jok[kim][id]) return;
    sfx.claim?.();
    setJok((j) => j.map((x, i) => (i === kim ? { ...x, [id]: true } : x)));
    if (id === 'yari') setGizli(karistir(s.siklar.filter((o) => o !== s.dogru)).slice(0, 2));
    if (id === 'fener') { setFener(true); setTimeout(() => setFener(false), 1100); }
    if (id === 'sans') setSansAktif(true);
  };

  const cevapla = (sik) => {
    if (secim || denenen.includes(sik) || gizli.includes(sik)) return;
    const dogru = sik === s.dogru;
    if (!dogru && sansAktif) { sfx.wrong?.(); setDenenen((d) => [...d, sik]); setSansAktif(false); return; }
    setSecim({ sik, dogru });
    if (dogru) { sfx.correct?.(); setPuan((p) => p.map((x, i) => (i === kim ? x + 1 : x))); onYildiz?.(1); } else sfx.wrong?.();
    setSonuclar((r) => { const n = [...r]; n[sira] = dogru; return n; });
  };

  const ileri = () => {
    if (sira + 1 >= toplam) { setBitti(true); sfx.levelUp?.(); onBitti?.({ puan, oyuncular }); return; }
    setSira(sira + 1); setSecim(null); setGizli([]); setDenenen([]); setSansAktif(false); setFener(false);
  };

  if (bitti) {
    const enIyi = Math.max(...puan);
    return (
      <motion.div data-testid="yarisma-sonu" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '10px 18px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: RENK.murekkep, margin: '6px 0 4px' }}>{coklu ? 'Aile yarışı bitti!' : 'Yarışma bitti!'}</h2>
        <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#5B7065' }}>{coklu ? 'Hep birlikte öğrendiniz; asıl kazanç bu.' : `${toplam} sorudan ${puan[0]} doğru.`}</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 10 }}>
          {oyuncular.map((o, i) => (
            <motion.div key={o} initial={{ height: 0 }} animate={{ height: 70 + (puan[i] / Math.max(1, enIyi)) * 70 }} transition={{ delay: 0.15 * i, type: 'spring' }}
              style={{ width: 78, borderRadius: '40px 40px 12px 12px', background: OYUNCU_RENK[i % 4], color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '0 4px 10px', overflow: 'hidden' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 900, fontSize: 18 }}><Star size={16} fill="#FFD93D" color="#FFD93D" />{puan[i]}</span>
              <span style={{ fontSize: 12, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{o}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div data-testid="bilgi-yarisi" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SoruYolu toplam={toplam} sira={sira} sonuclar={sonuclar} />

      {coklu && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {oyuncular.map((o, i) => (
            <span key={o} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 13, fontWeight: 800, color: i === kim ? '#fff' : RENK.murekkep, background: i === kim ? OYUNCU_RENK[i % 4] : '#fff', border: `2px solid ${OYUNCU_RENK[i % 4]}` }}>
              {i === kim ? '▶ ' : ''}{o} · {puan[i]}
            </span>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={sira} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          style={{ background: '#fff', borderRadius: '44px 44px 24px 24px', padding: '22px 18px 18px', boxShadow: '0 8px 0 #DFF3E2', border: '3px solid #DFF3E2' }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 800, letterSpacing: 1, color: RENK.yesil, textTransform: 'uppercase', textAlign: 'center' }}>
            {coklu ? `Sıra ${oyuncular[kim]}'de · ` : ''}{sira + 1}. soru
          </p>
          <h3 style={{ margin: '0 0 16px', fontSize: 20, lineHeight: 1.35, fontWeight: 900, color: RENK.murekkep, textAlign: 'center' }}>{s.q}</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {s.siklar.map((o, i) => {
              const yok = gizli.includes(o);
              const den = denenen.includes(o);
              const dogruBu = secim && o === s.dogru;
              const yanlisBu = (secim && secim.sik === o && !secim.dogru) || den;
              return (
                <motion.button key={o} type="button" data-testid={`sik-${i}`} onClick={() => cevapla(o)} disabled={yok || den || !!secim}
                  animate={{ opacity: yok ? 0.15 : 1, scale: fener && o === s.dogru ? [1, 1.04, 1] : 1, boxShadow: fener && o === s.dogru ? '0 0 0 4px #FFD93D, 0 0 28px 6px rgba(255,217,61,0.8)' : '0 4px 0 #E3EDE5' }}
                  whileTap={{ scale: 0.96 }}
                  style={{ minHeight: 54, borderRadius: 18, padding: '10px 16px', fontSize: 17, fontWeight: 800, textAlign: 'start', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                    background: dogruBu ? '#DFF3E2' : yanlisBu ? '#FDE5E0' : '#F8FBF8', color: RENK.murekkep, border: `3px solid ${dogruBu ? RENK.yesil : yanlisBu ? RENK.yanlis : '#E3EDE5'}` }}>
                  <span style={{ width: 28, height: 28, borderRadius: 14, background: dogruBu ? RENK.yesil : '#fff', color: dogruBu ? '#fff' : RENK.yesil, border: `2px solid ${RENK.yesil}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                    {dogruBu ? '✓' : 'ABCD'[i]}
                  </span>
                  {o}
                </motion.button>
              );
            })}
          </div>
          {sansAktif && !secim && <p style={{ margin: '12px 0 0', textAlign: 'center', fontWeight: 800, color: '#9B6A10' }}>↺ İkinci Şans hazır: yanılırsan bir daha deneyebilirsin.</p>}
          {denenen.length > 0 && !secim && <p style={{ margin: '12px 0 0', textAlign: 'center', fontWeight: 800, color: RENK.yanlis }}>Olmadı, bir daha dene!</p>}
          {secim && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 14, textAlign: 'center' }}>
              <p style={{ margin: '0 0 10px', fontWeight: 900, fontSize: 17, color: secim.dogru ? RENK.yesil : RENK.yanlis }}>
                {secim.dogru ? 'Harika! +1 yıldız' : `Doğrusu: ${s.dogru}`}
              </p>
              {s.exp && <p style={{ margin: '0 0 10px', fontSize: 14, color: '#5B7065', fontWeight: 700 }}>{s.exp}</p>}
              <button type="button" data-testid="yarisma-ileri" onClick={ileri}
                style={{ minHeight: 52, padding: '0 28px', borderRadius: 26, background: RENK.yesil, color: '#fff', border: 'none', fontSize: 17, fontWeight: 900, boxShadow: '0 5px 0 #1E6538', cursor: 'pointer' }}>
                {sira + 1 >= toplam ? 'Sonucu gör' : coklu ? `Sıra ${oyuncular[(sira + 1) % oyuncular.length]}'de →` : 'Sonraki durak →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 22, paddingTop: 4 }} aria-label="Jokerler">
        {JOKERLER.map((j) => (
          <JokerRozet key={j.id} j={j} kullanildi={jok[kim][j.id] && !(j.id === 'sans' && sansAktif)} aktif={j.id === 'sans' && sansAktif} onClick={() => jokerKullan(j.id)} />
        ))}
      </div>
    </div>
  );
}
