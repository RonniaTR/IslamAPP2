import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { ChevronLeft, Info, ArrowRight } from 'lucide-react';
import { ALANLAR, alanPuanlari, toplamPuan, cetele, kazanimDinle, gunAnahtari, donemPuani, bulutaSimdiYaz } from '../../services/kazanim';
import { SevapIsaret, SevapYazi, GirihZemin, SusluCerceve } from './SevapAmblem';
import { useAuth } from '../../contexts/AuthContext';

// ✨ SEVAP POINTS — uygulamadaki çabanın haritası.
// Üstte sekiz kollu YILDIZ HARİTASI (sekiz alan: İman, İbadet, Ahlak, İlim, Kur'an, Fen, Sabır, Toplum),
// altında büyüyen HAYAT AĞACI (kök: iman; dallar: diğer yedi alan; her yaprak bir kazanım),
// en altta gün çetelesi. Puanlar yalnız bu cihazda tutulur, kimseyle karşılaştırılmaz.
// Bu bir dindarlık ölçüsü DEĞİLDİR: sevabı yalnız Allah bilir (sayfanın altında açıkça yazar).

const ALTIN = '#D8B76A';
const KREM = '#F4EFE3';
const YOL = { iman: '/prophets', ibadet: '/dhikr', ahlak: '/musluman-olmak', ilim: '/hadith', kuran: '/quran', fen: '/musluman-olmak?oku=mecmua', sabir: '/yol', toplum: '/salavat' };
const SAY = (n) => Math.round(n).toLocaleString('tr-TR');

function SayacSayi({ deger }) {
  const [g, setG] = useState(0);
  useEffect(() => { const c = animate(0, deger, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: setG }); return () => c.stop(); }, [deger]);
  return <>{SAY(g)}</>;
}

// ---------------- Yıldız haritası ----------------
function YildizHaritasi({ alanlar, secili, setSecili }) {
  const C = 170; const R = 120;
  const enCok = Math.max(60, ...alanlar.map((a) => a.puan));
  const nokta = (i, oran) => { const aci = (i / 8) * 2 * Math.PI - Math.PI / 2; return [C + Math.cos(aci) * R * oran, C + Math.sin(aci) * R * oran]; };
  const oranlar = alanlar.map((a) => 0.12 + 0.88 * Math.min(1, a.puan / enCok));
  const merkez = alanlar.map(() => `${C},${C}`).join(' ');
  const hedef = oranlar.map((o, i) => nokta(i, o).map((v) => v.toFixed(1)).join(',')).join(' ');
  const halka = (o) => Array.from({ length: 8 }, (_, i) => nokta(i, o).join(',')).join(' ');

  return (
    <svg viewBox="0 0 340 340" width="100%" style={{ maxWidth: 360, display: 'block', margin: '0 auto', overflow: 'visible' }} role="img" aria-label="Sekiz alanlık yıldız haritası">
      <defs>
        <radialGradient id="sp-dolgu" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#F3DDA0" stopOpacity="0.55" /><stop offset="1" stopColor="#2FA37A" stopOpacity="0.35" />
        </radialGradient>
        <filter id="sp-isik" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      {/* dönen arka yıldız */}
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 160, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: `${C}px ${C}px` }}>
        <rect x={C - 128} y={C - 128} width="256" height="256" fill="none" stroke="rgba(216,183,106,0.10)" />
        <rect x={C - 128} y={C - 128} width="256" height="256" fill="none" stroke="rgba(216,183,106,0.10)" transform={`rotate(45 ${C} ${C})`} />
      </motion.g>
      {[0.33, 0.66, 1].map((o) => <polygon key={o} points={halka(o)} fill="none" stroke="rgba(244,239,227,0.12)" strokeWidth="1" />)}
      {alanlar.map((a, i) => { const [x, y] = nokta(i, 1); return <line key={a.id} x1={C} y1={C} x2={x} y2={y} stroke="rgba(244,239,227,0.10)" />; })}
      <motion.polygon initial={{ points: merkez }} animate={{ points: hedef }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        fill="url(#sp-dolgu)" stroke={ALTIN} strokeWidth="2" strokeLinejoin="round" />
      {alanlar.map((a, i) => {
        const [x, y] = nokta(i, oranlar[i]); const [lx, ly] = nokta(i, 1.2); const on = secili === a.id;
        return (
          <g key={a.id} onClick={() => setSecili(on ? null : a.id)} style={{ cursor: 'pointer' }} role="button" aria-label={`${a.ad}: ${a.puan} puan`}>
            <motion.circle initial={{ cx: C, cy: C, r: 0 }} animate={{ cx: x, cy: y, r: on ? 9 : 6 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              fill={a.renk} filter="url(#sp-isik)" opacity="0.8" />
            <motion.circle initial={{ cx: C, cy: C, r: 0 }} animate={{ cx: x, cy: y, r: on ? 6 : 4 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} fill={a.renk} stroke={KREM} strokeWidth="1.5" />
            <circle cx={lx} cy={ly} r="26" fill="transparent" />
            <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.05 }} x={lx} y={ly - 3} textAnchor="middle"
              style={{ fontSize: 12.5, fontWeight: on ? 800 : 700, fill: on ? a.renk : KREM }}>{a.ad}</motion.text>
            <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.05 }} x={lx} y={ly + 12} textAnchor="middle"
              style={{ fontSize: 11, fill: 'rgba(244,239,227,0.6)', fontVariantNumeric: 'tabular-nums' }}>{SAY(a.puan)}</motion.text>
          </g>
        );
      })}
      <circle cx={C} cy={C} r="5" fill={ALTIN} />
    </svg>
  );
}

// ---------------- Hayat ağacı ----------------
const qNokta = (p0, p1, p2, t) => [
  (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
  (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
];

function HayatAgaci({ alanlar }) {
  const W = 360; const ZEMIN = 300; const enCok = Math.max(60, ...alanlar.map((a) => a.puan));
  const iman = alanlar.find((a) => a.id === 'iman');
  const dallar = alanlar.filter((a) => a.id !== 'iman');
  const toplam = alanlar.reduce((t, a) => t + a.puan, 0);
  const govdeBoy = 150 + Math.min(80, toplam / 25);
  const tepe = ZEMIN - govdeBoy;
  const kalinlik = 8 + Math.min(10, toplam / 150);

  const dalVerisi = dallar.map((a, i) => {
    const n = Math.min(1, a.puan / enCok);
    const sol = i % 2 === 0;
    const y0 = ZEMIN - 55 - (i * (govdeBoy - 70)) / (dallar.length - 1 || 1);
    const boy = 40 + 95 * n;
    const derece = 72 - i * 5;                 // alttaki dallar yatay, üsttekiler dikleşir
    const aci = (sol ? -1 : 1) * derece * (Math.PI / 180);
    const p0 = [W / 2, y0];
    const p2 = [W / 2 + Math.sin(aci) * boy, y0 - Math.cos(aci) * boy - 18];
    const p1 = [W / 2 + Math.sin(aci) * boy * 0.45, y0 - 4];
    const yaprak = Math.min(12, Math.ceil(a.puan / 20));
    return { a, p0, p1, p2, yaprak, sol, i };
  });

  const kokBoy = 20 + 60 * Math.min(1, (iman?.puan || 0) / enCok);

  return (
    <svg viewBox={`0 0 ${W} 400`} width="100%" style={{ maxWidth: 380, display: 'block', margin: '0 auto' }} role="img" aria-label="Hayat ağacı">
      {/* zemin */}
      <ellipse cx={W / 2} cy={ZEMIN + 6} rx="150" ry="14" fill="rgba(47,163,122,0.18)" />
      {/* kökler = iman */}
      {[-60, -25, 0, 25, 60].map((dx, k) => (
        <motion.path key={dx} d={`M${W / 2} ${ZEMIN} Q${W / 2 + dx * 0.4} ${ZEMIN + kokBoy * 0.5} ${W / 2 + dx} ${ZEMIN + kokBoy * (k === 2 ? 1 : 0.8)}`}
          fill="none" stroke="#8C6A3F" strokeWidth={k === 2 ? 4 : 2.5} strokeLinecap="round" opacity="0.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.1 + k * 0.05 }} />
      ))}
      <text x={W / 2} y={ZEMIN + kokBoy + 18} textAnchor="middle" style={{ fontSize: 11.5, fill: ALTIN, fontWeight: 700 }}>Kök: İman · {SAY(iman?.puan || 0)}</text>
      {/* gövde */}
      <motion.path d={`M${W / 2} ${ZEMIN} C${W / 2 - 6} ${ZEMIN - govdeBoy * 0.4} ${W / 2 + 6} ${ZEMIN - govdeBoy * 0.7} ${W / 2} ${tepe}`}
        fill="none" stroke="#8C6A3F" strokeWidth={kalinlik} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }} />
      {/* dallar ve yapraklar */}
      {dalVerisi.map(({ a, p0, p1, p2, yaprak, sol, i }) => (
        <g key={a.id}>
          <motion.path d={`M${p0[0]} ${p0[1]} Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`} fill="none" stroke="#8C6A3F" strokeWidth={Math.max(2, kalinlik * 0.45)} strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 1.0 + i * 0.12 }} />
          {Array.from({ length: Math.max(1, yaprak) }, (_, k) => {
            const t = 0.3 + (0.7 * (k + 1)) / (Math.max(1, yaprak) + 0.4);
            const [x, y] = qNokta(p0, p1, p2, Math.min(1, t));
            const yan = k % 2 ? 1 : -1; // dalın iki yanına
            const bos = a.puan === 0;
            return (
              <motion.ellipse key={k} cx={x} cy={y + yan * 6} rx={bos ? 3 : 7} ry={bos ? 2 : 4} fill={bos ? 'rgba(244,239,227,0.25)' : a.renk}
                transform={`rotate(${(sol ? 1 : -1) * 25 + yan * 20} ${x} ${y + yan * 6})`}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: bos ? 0.6 : 0.92 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 1.5 + i * 0.12 + k * 0.05 }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
            );
          })}
          <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 + i * 0.1 }}
            x={p2[0] + (sol ? -10 : 10)} y={p2[1] + 4} textAnchor={sol ? 'end' : 'start'} style={{ fontSize: 11.5, fontWeight: 700, fill: a.renk }}>
            {a.ad}
          </motion.text>
        </g>
      ))}
      {/* tepe tomurcuğu: sekiz köşeli yıldız */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1, rotate: 45 }} transition={{ delay: 2.2, type: 'spring' }} style={{ transformOrigin: `${W / 2}px ${tepe - 6}px` }}>
        <rect x={W / 2 - 7} y={tepe - 13} width="14" height="14" fill={ALTIN} />
        <rect x={W / 2 - 7} y={tepe - 13} width="14" height="14" fill={ALTIN} transform={`rotate(45 ${W / 2} ${tepe - 6})`} />
      </motion.g>
    </svg>
  );
}

// ---------------- Gün çetelesi ----------------
export function GunCetelesi({ haftalar = 6, koyu = true }) {
  const c = useMemo(() => cetele(), []);
  const bugun = new Date(); bugun.setHours(12);
  const pazartesi = new Date(bugun); pazartesi.setDate(bugun.getDate() - ((bugun.getDay() + 6) % 7) - (haftalar - 1) * 7);
  const hucreler = Array.from({ length: haftalar * 7 }, (_, i) => { const d = new Date(pazartesi); d.setDate(pazartesi.getDate() + i); return d; });
  const ink = koyu ? KREM : '#1A1A1A';
  return (
    <div data-testid="gun-cetelesi">
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        {[['Seninle', `${c.kacinciGun}. gün`], ['Girdiğin gün', c.toplamGun], ['Üst üste', `${c.seri} gün`]].map(([e, d]) => (
          <div key={e} style={{ flex: 1, minWidth: 90, padding: '8px 10px', borderRadius: 14, background: koyu ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, letterSpacing: 1, color: koyu ? 'rgba(244,239,227,0.55)' : '#6B6B6B' }}>{e.toUpperCase()}</div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 18, fontWeight: 800, color: ink }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
        {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map((g) => <div key={g} style={{ fontSize: 10.5, textAlign: 'center', color: koyu ? 'rgba(244,239,227,0.5)' : '#8A8A8A' }}>{g}</div>)}
        {hucreler.map((d, i) => {
          const k = gunAnahtari(d); const var_ = c.gunler.has(k); const gelecek = d > bugun; const bu = k === gunAnahtari(bugun);
          return (
            <motion.div key={k} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: gelecek ? 0.25 : 1 }} transition={{ delay: 0.01 * i }}
              title={d.toLocaleDateString('tr-TR')} aria-label={`${d.toLocaleDateString('tr-TR')}${var_ ? ': girildi' : ''}`}
              style={{ aspectRatio: '1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                background: var_ ? ALTIN : (koyu ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'), color: var_ ? '#1A1A1A' : (koyu ? 'rgba(244,239,227,0.45)' : '#9A9A9A'),
                outline: bu ? `2px solid ${koyu ? KREM : '#0F5C46'}` : 'none', outlineOffset: 1 }}>
              {d.getDate()}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function SevapPointsPage() {
  const navigate = useNavigate();
  const { user, firebaseUser } = useAuth();
  const [, setSurum] = useState(0);   // kazanım değişince yeniden çiz
  useEffect(() => {
    bulutaSimdiYaz();
    return kazanimDinle(() => setSurum((s) => s + 1));
  }, []);
  const alanlar = alanPuanlari();
  const toplam = toplamPuan();
  const bugun = donemPuani(1);
  const hafta = donemPuani(7);
  const [secili, setSecili] = useState(null);
  const sec = ALANLAR.find((a) => a.id === secili);
  const secPuan = sec ? alanlar.find((a) => a.id === secili).puan : 0;
  const sirali = [...alanlar].sort((a, b) => b.puan - a.puan);

  return (
    <div data-testid="sevap-points" style={{ position: 'relative', minHeight: '100vh', background: 'radial-gradient(130% 60% at 50% 0%, #17604A 0%, #0A2E22 45%, #030E0A 100%)', color: KREM, paddingBottom: 130, overflow: 'hidden' }}>
      <GirihZemin />
      <header style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '16px 16px 0' }}>
        <button type="button" onClick={() => navigate(-1)} aria-label="Geri" style={{ width: 44, height: 44, borderRadius: 22, border: '1px solid rgba(216,183,106,0.35)', background: 'rgba(0,0,0,0.2)', color: KREM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={22} />
        </button>
      </header>

      {/* Amblem ve toplam */}
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -30 }}>
        <SevapIsaret boyut={150} id="sp-buyuk" />
        <div style={{ marginTop: 6 }}><SevapYazi /></div>
        <div style={{ marginTop: 14, fontFamily: '"Fraunces", serif', fontSize: 54, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: KREM, textShadow: '0 0 24px rgba(233,199,126,0.35)' }}>
          <SayacSayi deger={toplam} />
        </div>
        <div style={{ fontSize: 12.5, color: 'rgba(244,239,227,0.6)', marginTop: 4 }}>uygulamadaki çabanın toplamı</div>
        <div style={{ fontSize: 11.5, color: '#7FD6B0', marginTop: 4, fontWeight: 700 }}>
          {firebaseUser && !firebaseUser.isAnonymous
            ? `✓ Hesabına (${firebaseUser.email || user?.name || 'Gmail'}) otomatik kaydediliyor`
            : 'Cihazında kayıtlı · Gmail ile giriş yaparsan hesabına da yedeklenir'}
        </div>
      </motion.div>

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, margin: '18px 16px 0' }}>
        {[['Bugün', SAY(bugun)], ['Bu hafta', SAY(hafta)], ['En güçlü', sirali[0].puan ? sirali[0].ad : '—']].map(([e, d], i) => (
          <motion.div key={e} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.08 }}
            style={{ padding: '10px 6px', borderRadius: 16, textAlign: 'center', background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(233,199,126,0.25)' }}>
            <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: ALTIN, fontWeight: 800 }}>{e.toUpperCase()}</div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 19, fontWeight: 800, marginTop: 2, color: i === 2 && sirali[0].puan ? sirali[0].renk : KREM }}>{d}</div>
          </motion.div>
        ))}
      </div>

      <SusluCerceve baslik="Yıldız haritan" alt="Sekiz alan; bir köşeye dokun">
        <YildizHaritasi alanlar={alanlar} secili={secili} setSecili={setSecili} />
        <AnimatePresence>
          {sec && (
            <motion.div key={sec.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ margin: '4px 0 0', padding: '12px 14px', borderRadius: 18, background: 'rgba(0,0,0,0.25)', border: `1px solid ${sec.renk}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: sec.renk, boxShadow: `0 0 10px ${sec.renk}` }} />
              <span style={{ flex: 1 }}><b>{sec.ad}</b> · {SAY(secPuan)} puan</span>
              <button type="button" onClick={() => navigate(YOL[sec.id])} style={{ minHeight: 36, padding: '0 12px', borderRadius: 18, border: 'none', background: sec.renk, color: '#1A1A1A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                Devam et <ArrowRight size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <p style={{ margin: '10px 0 0', fontSize: 12.5, color: 'rgba(244,239,227,0.65)', textAlign: 'center' }}>
          {sirali[0].puan
            ? <>En çok çaba: <b style={{ color: sirali[0].renk }}>{sirali[0].ad}</b> · Biraz daha ilgi bekleyen: <b style={{ color: sirali[sirali.length - 1].renk }}>{sirali[sirali.length - 1].ad}</b></>
            : 'Haritan ilk adımınla çizilmeye başlar.'}
        </p>
      </SusluCerceve>

      <SusluCerceve baslik="Hayat ağacın" alt="Kökü iman; her dal bir alan, her yaprak bir kazanım">
        <HayatAgaci alanlar={alanlar} />
      </SusluCerceve>

      <SusluCerceve baslik="Gün çetelen">
        <GunCetelesi />
      </SusluCerceve>

      <section style={{ position: 'relative', margin: '18px 16px 0', padding: '14px 16px', borderRadius: 18, background: 'rgba(216,183,106,0.08)', border: '1px solid rgba(216,183,106,0.3)', display: 'flex', gap: 10 }}>
        <Info size={18} color={ALTIN} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
        <p data-testid="sevap-not" style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'rgba(244,239,227,0.85)' }}>
          <b>Bu puan bir dindarlık ölçüsü değildir.</b> Sevap Points yalnızca uygulamada geçirdiğin vakti ve yaptığın etkinlikleri gösterir;
          kimin ne kadar dindar olduğunu ölçmez, ölçemez. Sevabı yalnız Allah bilir. Puanın kimseyle karşılaştırılmaz, sıralama yoktur
          ve yalnızca bu telefonda tutulur.
        </p>
      </section>
    </div>
  );
}
