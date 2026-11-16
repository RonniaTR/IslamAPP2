// frontend/src/pages/KandilPage.js
// 🕯️ KANDİL IŞIK HARİTASI (docs/YENI_OZELLIKLER.md 8.7)
// Mübarek gecede "ben de buradayım" diyenlerin il il ANONİM toplamı ışık olarak yanar.
// Gizlilik: gönderilen tek şey {gece, il} sayacına +1'dir; kimlik, konum, saat gönderilmez.
// Cihaz başına gecede bir kez (yerel bayrak). 10'dan az ışığı olan ilin sayısı gösterilmez. Sıralama/rekabet YOK.
// Harita bir sınır çizimi değildir: il merkezleri enlem/boylamlarına göre nokta olarak yerleştirilir (ek veri/lisans gerekmez).
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ScenePlayer from '../components/scene/ScenePlayer';
import { collection, doc, getDocs, increment, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { CITY_COORDS } from '../data/cityCoords';
import { getActiveNight, getUpcomingDays, CALENDAR_NOTE } from '../services/islamicCalendar';

const MIN_SHOW = 10;
const W = 700, H = 320, PAD = 24;
const LON = [25.5, 45], LAT = [35.6, 42.4];
const xy = ([lat, lon]) => [
  PAD + ((lon - LON[0]) / (LON[1] - LON[0])) * (W - 2 * PAD),
  PAD + ((LAT[1] - lat) / (LAT[1] - LAT[0])) * (H - 2 * PAD),
];
const flagKey = (id) => `kandil_isik_${id}`;

export default function KandilPage() {
  const { theme } = useTheme();
  const tt = useTx();
  const navigate = useNavigate();
  const night = useMemo(() => getActiveNight(), []);
  const next = useMemo(() => getUpcomingDays(8).find((d) => /Kandili|Kadir/.test(d.name)), []);
  const [counts, setCounts] = useState({});
  const [state, setState] = useState('idle'); // idle | loading | error
  const [city, setCity] = useState(() => { try { return localStorage.getItem('islamapp_city') || 'İstanbul'; } catch { return 'İstanbul'; } });
  const [mine, setMine] = useState(() => { try { return night ? localStorage.getItem(flagKey(night.id)) : null; } catch { return null; } });

  useEffect(() => {
    if (!night) return;
    setState('loading');
    getDocs(collection(db, 'kandil', night.id, 'iller'))
      .then((snap) => { const c = {}; snap.forEach((d) => { c[d.id] = d.data().n || 0; }); setCounts(c); setState('idle'); })
      .catch(() => setState('error'));
  }, [night]);

  const [scene, setScene] = useState(false);
  const light = async () => {
    if (!night || mine || !CITY_COORDS[city]) return;
    setMine(city); // iyimser: ışık hemen yanar
    setScene(true);
    try { localStorage.setItem(flagKey(night.id), city); } catch { /* kota */ }
    setCounts((c) => ({ ...c, [city]: (c[city] || 0) + 1 }));
    try {
      await setDoc(doc(db, 'kandil', night.id, 'iller', city), { n: increment(1) }, { merge: true });
    } catch { setState('error'); }
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const max = Math.max(1, ...Object.values(counts));
  const page = { minHeight: '100vh', background: '#05080F', color: '#EDE6D3', paddingBottom: 110 };

  return (
    <div style={page} data-testid="kandil-page">
      {scene && <ScenePlayer id="kandil" onDone={() => setScene(false)} />}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '16px 20px' }}>
        <button onClick={() => navigate(-1)} aria-label={tt('Geri')} style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} color="#EDE6D3" />
        </button>
        <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#E0B354', marginTop: 16 }}>{tt('Işık haritası')}</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, marginTop: 4 }}>
          {night ? `${night.icon} ${tt(night.name)}` : tt('Bu gece kandil değil')}
        </h1>
        <p style={{ fontSize: 14, opacity: 0.7, marginTop: 6, lineHeight: 1.5 }}>
          {night
            ? tt('Bu gece dua eden, okuyan herkes kendi ilinde bir ışık yakar. Kim olduğun bilinmez; yalnız ışığın görünür.')
            : next ? `${tt('Sıradaki')}: ${tt(next.name)} · ${next.dateLabel}. ${tt('Harita o gece açılır.')}` : tt('Harita mübarek gecelerde açılır.')}
        </p>

        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={tt('Türkiye il ışıkları')} style={{ width: '100%', marginTop: 18, borderRadius: 20, background: 'radial-gradient(ellipse at 50% 60%, #0D1424 0%, #05080F 75%)' }}>
          <defs><radialGradient id="isik"><stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.95" /><stop offset="45%" stopColor="#E0B354" stopOpacity="0.35" /><stop offset="100%" stopColor="#E0B354" stopOpacity="0" /></radialGradient></defs>
          {Object.entries(CITY_COORDS).map(([name, c]) => {
            const [x, y] = xy(c);
            const n = counts[name] || 0;
            const shown = n >= MIN_SHOW;
            const isMine = mine === name;
            const r = shown ? 8 + 22 * Math.sqrt(n / max) : isMine ? 9 : 0;
            return (
              <g key={name}>
                {r > 0 && <circle cx={x} cy={y} r={r} fill="url(#isik)"><title>{name}{shown ? ` · ${n}` : ''}</title></circle>}
                <circle cx={x} cy={y} r={shown || isMine ? 2.2 : 1.4} fill={shown || isMine ? '#FFE9A8' : '#3A4664'} />
              </g>
            );
          })}
        </svg>
        <p style={{ fontSize: 12, opacity: 0.55, marginTop: 8 }}>
          {night ? `${tt('Bu gece toplam')} ${total} ${tt('ışık')} · ` : ''}{tt('Bir ilde 10 ışıktan azsa sayı gösterilmez. Sıralama yoktur.')}
        </p>

        {night && (
          <div style={{ marginTop: 18, borderRadius: 20, border: '1px solid rgba(224,179,84,0.25)', padding: 16 }}>
            {mine ? (
              <p style={{ fontSize: 15, lineHeight: 1.5 }}>🕯️ {mine} {tt('için ışığın yandı. Allah kabul etsin.')}</p>
            ) : (<>
              <label style={{ fontSize: 12, opacity: 0.7, display: 'block', marginBottom: 6 }}>{tt('Işığın hangi ilde yansın?')}</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <select value={city} onChange={(e) => setCity(e.target.value)} style={{ flex: 1, minWidth: 150, minHeight: 48, borderRadius: 14, background: '#0D1424', color: '#EDE6D3', border: '1px solid #26324D', padding: '0 12px', fontSize: 15 }}>
                  {Object.keys(CITY_COORDS).sort((a, b) => a.localeCompare(b, 'tr')).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={light} style={{ minHeight: 48, padding: '0 22px', borderRadius: 24, background: '#E0B354', color: '#1A1A1A', fontSize: 15, fontWeight: 800 }}>{tt('Işığımı yak')}</button>
              </div>
              <p style={{ fontSize: 11, opacity: 0.55, marginTop: 8 }}>{tt('Gönderilen tek şey seçtiğin ilin sayacına +1. Adın, konumun, saatin gönderilmez.')}</p>
            </>)}
          </div>
        )}
        {state === 'error' && <p role="alert" style={{ fontSize: 13, color: '#F0A8A8', marginTop: 12 }}>{tt('Şu an haritaya ulaşılamadı. Işığın cihazında yandı; bağlantı gelince yeniden dene.')}</p>}
        <p style={{ fontSize: 11, opacity: 0.45, marginTop: 16 }}>{tt(CALENDAR_NOTE)}</p>
      </div>
    </div>
  );
}
