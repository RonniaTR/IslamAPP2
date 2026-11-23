import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTx } from '../../i18n';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { toHijri } from '../../services/islamicCalendar';

// 🌌 GÖK KUBBE — ana ekranın başı.
// Gökyüzü vakte göre değişir (seher · gündüz · ikindi · akşam · gece), ay GERÇEK evresiyle çizilir,
// büyük tarih HİCRİ'dir (Miladi altta küçük). Altında haftanın "vakit halkaları": her gün beş dilimli bir
// halka; dilim, o gün kişinin kendi işaretlediği vakittir (PrayerCard). Puan, seri, ceza yok.
// Tasvir yok: yalnız gök, ay, yıldız ve cami silueti.

const HICRI_AY = ['Muharrem', 'Safer', 'Rebîülevvel', 'Rebîülâhir', 'Cemâziyelevvel', 'Cemâziyelâhir', 'Receb', 'Şâban', 'Ramazan', 'Şevval', 'Zilkâde', 'Zilhicce'];
const GUN = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const VAKIT = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const LOG_KEY = 'namaz_takip_v1';

const SKY = {
  seher:  { top: '#2B2350', mid: '#6B4B7A', low: '#E8A86B', star: 0.5, label: 'Seher' },
  gunduz: { top: '#5E8FC2', mid: '#9EC3DE', low: '#F3E6C8', star: 0, label: 'Gündüz' },
  ikindi: { top: '#4E6C9A', mid: '#C9A06A', low: '#F2C98A', star: 0, label: 'İkindi' },
  aksam:  { top: '#241F45', mid: '#7A3E5C', low: '#E3875A', star: 0.35, label: 'Akşam' },
  gece:   { top: '#070B1C', mid: '#111A38', low: '#1C2A50', star: 1, label: 'Gece' },
};

const toMin = (t) => { if (!t) return null; const [h, m] = t.slice(0, 5).split(':').map(Number); return h * 60 + m; };
function period(timings, now = new Date()) {
  const m = now.getHours() * 60 + now.getMinutes();
  const T = timings ? { f: toMin(timings.Fajr), s: toMin(timings.Sunrise), a: toMin(timings.Asr), g: toMin(timings.Maghrib), i: toMin(timings.Isha) } : null;
  if (T && T.f != null) {
    if (m >= T.f && m < T.s + 30) return 'seher';
    if (m >= T.s + 30 && m < T.a) return 'gunduz';
    if (m >= T.a && m < T.g - 20) return 'ikindi';
    if (m >= T.g - 20 && m < T.i) return 'aksam';
    return 'gece';
  }
  const h = now.getHours();
  return h < 5 ? 'gece' : h < 7 ? 'seher' : h < 15 ? 'gunduz' : h < 18 ? 'ikindi' : h < 20 ? 'aksam' : 'gece';
}

const VAKIT_AD = { Fajr: 'Sabah', Sunrise: 'Güneş', Dhuhr: 'Öğle', Asr: 'İkindi', Maghrib: 'Akşam', Isha: 'Yatsı' };
const VAKIT_YONELME = { Sabah: "Sabah'a", Güneş: "Güneş'e", Öğle: "Öğle'ye", İkindi: "İkindi'ye", Akşam: "Akşam'a", Yatsı: "Yatsı'ya" };
const VARSAYILAN = { Fajr: '06:00', Sunrise: '07:30', Dhuhr: '12:45', Asr: '15:20', Maghrib: '17:45', Isha: '19:10' };

/** Sıradaki vakit ve kalan dakika (vakitler henüz gelmediyse null). */
function siradaki(timings, now) {
  if (!timings) return null;
  const m = now.getHours() * 60 + now.getMinutes();
  for (const k of ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
    const t = toMin(timings[k]);
    if (t != null && t > m) return { ad: VAKIT_AD[k], kalan: t - m };
  }
  const f = toMin(timings.Fajr);
  return f == null ? null : { ad: 'Sabah', kalan: 24 * 60 - m + f };
}
const sure = (dk) => (dk >= 60 ? `${Math.floor(dk / 60)} sa ${dk % 60} dk` : `${dk} dk`);

/** Gök yayı üzerindeki konum 0..1: gündüz güneş doğuştan batışa, gece ay batıştan sabaha yürür. */
function yayKonumu(timings, now) {
  const T = timings || VARSAYILAN;
  const m = now.getHours() * 60 + now.getMinutes();
  const dogus = toMin(T.Sunrise); const batis = toMin(T.Maghrib); const sabah = toMin(T.Fajr);
  if (m >= dogus && m < batis) return { gunduz: true, f: (m - dogus) / (batis - dogus) };
  const gece = 24 * 60 - batis + sabah;
  const gecen = m >= batis ? m - batis : 24 * 60 - batis + m;
  return { gunduz: false, f: Math.min(1, Math.max(0, gecen / gece)) };
}

/** Ayın evresi 0..1 (0 = yeni ay, 0.5 = dolunay). Bilinen yeni ay: 6 Ocak 2000 18:14 UTC; sinodik ay 29,530588 gün. */
function moonPhase(d = new Date()) {
  const days = (d.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000;
  return ((days % 29.530588) + 29.530588) % 29.530588 / 29.530588;
}

/** Ay: aydınlık kısmı iki yay ile çizilir (kuzey yarımküreden görünüş). */
function Moon({ phase, size = 46 }) {
  const r = size / 2;
  const waxing = phase < 0.5;
  const k = Math.cos(phase * 2 * Math.PI);           // 1 yeni ay → -1 dolunay
  const rx = Math.abs(k) * r;
  const outer = waxing ? 1 : 0;                       // aydınlık yarının yönü
  const inner = k > 0 ? (waxing ? 0 : 1) : (waxing ? 1 : 0);   // hilalde terminatör aydınlık tarafa, şişkinde karşıya bükülür
  const d = `M ${r} 0 A ${r} ${r} 0 0 ${outer} ${r} ${size} A ${rx} ${r} 0 0 ${inner} ${r} 0 Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden style={{ filter: 'drop-shadow(0 0 14px rgba(255,236,190,0.55))' }}>
      <circle cx={r} cy={r} r={r} fill="rgba(255,255,255,0.06)" />
      <path d={d} fill="#FFF1CC" />
    </svg>
  );
}

/** Cami silueti: kubbe, yarım kubbeler, iki minare. Gece pencereleri yanar. */
function Silhouette({ lit, tone }) {
  return (
    <svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMax meet" style={{ position: 'absolute', insetInline: 0, bottom: 0, width: '100%', height: 120 }} aria-hidden>
      <path d="M0 120 V96 Q90 84 180 92 T360 90 V120 Z" fill={tone} opacity="0.55" />
      <g fill={tone}>
        <rect x="96" y="30" width="7" height="72" /><path d="M93 30 L99.5 12 L106 30 Z" /><rect x="94" y="52" width="11" height="3" />
        <rect x="257" y="30" width="7" height="72" /><path d="M254 30 L260.5 12 L267 30 Z" /><rect x="255" y="52" width="11" height="3" />
        <path d="M130 102 V78 Q130 46 180 42 Q230 46 230 78 V102 Z" />
        <rect x="178.5" y="28" width="3" height="16" /><circle cx="180" cy="27" r="3" />
        <path d="M112 102 V86 Q112 70 132 68 V102 Z" /><path d="M248 102 V86 Q248 70 228 68 V102 Z" />
        <rect x="104" y="96" width="152" height="10" />
      </g>
      {lit && [148, 166, 184, 202].map((x) => (
        <rect key={x} x={x} y="84" width="7" height="11" rx="3.5" fill="#FFD27A" opacity="0.9" />
      ))}
    </svg>
  );
}

/** Beş dilimli halka: dolu dilim = işaretlenmiş vakit. */
function Ring({ marks, today, future }) {
  const R = 15; const C = 2 * Math.PI * R; const seg = C / 5; const gap = 3;
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden>
      {VAKIT.map((v, i) => (
        <circle key={v} cx="19" cy="19" r={R} fill="none"
          stroke={marks[v] ? '#F0C46A' : future ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.22)'}
          strokeWidth={today ? 3.4 : 2.6} strokeLinecap="round"
          strokeDasharray={`${seg - gap} ${C - seg + gap}`} strokeDashoffset={-i * seg + C / 4} />
      ))}
      {today && <circle cx="19" cy="19" r="4" fill="#F0C46A" />}
    </svg>
  );
}

const key = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export default function GokKubbe() {
  const tt = useTx();
  const { timings } = usePrayerTimes();
  const [now, setNow] = useState(() => new Date());
  const [secili, setSecili] = useState(null);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  const yay = yayKonumu(timings, now);
  const sira = siradaki(timings, now);
  const p = period(timings, now);
  const sky = SKY[p];
  const phase = useMemo(() => moonPhase(now), [now.getDate()]);
  const h = toHijri(now);
  const dark = sky.star > 0.3;

  const week = useMemo(() => {
    let log = {};
    try { log = JSON.parse(localStorage.getItem(LOG_KEY)) || {}; } catch { log = {}; }
    const monday = new Date(now); monday.setHours(12, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return GUN.map((g, i) => {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      const isToday = key(d) === key(now);
      return { g, n: d.getDate(), tarih: d, marks: log[key(d)] || {}, today: isToday, future: d > now && !isToday };
    });
  }, [now.getDate()]);

  const stars = useMemo(() => Array.from({ length: 26 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 53) % 62, s: 1 + (i % 3) * 0.6, d: 2 + (i % 5) })), []);

  return (
    <section aria-label={tt('Bugün')} style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', minHeight: 300, color: dark ? '#F6EFDD' : '#1E2A33',
      background: `linear-gradient(180deg, ${sky.top} 0%, ${sky.mid} 58%, ${sky.low} 100%)`, boxShadow: '0 18px 40px -18px rgba(10,14,30,0.55)' }}>
      {sky.star > 0 && stars.map((s, i) => (
        <motion.span key={i} aria-hidden animate={{ opacity: [0.2 * sky.star, 0.9 * sky.star, 0.2 * sky.star] }} transition={{ duration: s.d, repeat: Infinity, delay: i * 0.13 }}
          style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, borderRadius: 2, background: '#FFF8E6' }} />
      ))}
      {/* Gök yayı: güneş (gündüz) ya da ay (gece) vaktin ilerleyişine göre ufuktan ufka yürür, caminin ardından geçer */}
      <svg aria-hidden viewBox="0 0 360 150" preserveAspectRatio="none" style={{ position: 'absolute', insetInline: 0, bottom: 0, width: '100%', height: 150 }}>
        <path d="M14 140 Q180 -34 346 140" fill="none" stroke={dark ? 'rgba(255,241,204,0.22)' : 'rgba(255,255,255,0.55)'} strokeWidth="1" strokeDasharray="2 5" vectorEffect="non-scaling-stroke" />
      </svg>
      <motion.div
        aria-hidden
        initial={false}
        animate={{ left: `calc(${4 + yay.f * 92}% - 21px)`, bottom: 10 + Math.sin(Math.PI * yay.f) * 74 }}
        transition={{ type: 'spring', stiffness: 40, damping: 16 }}
        style={{ position: 'absolute', width: 42, height: 42 }}
      >
        {yay.gunduz
          ? <span style={{ display: 'block', width: 42, height: 42, borderRadius: 21, background: 'radial-gradient(circle, #FFF6D8 0%, #FFD98A 50%, rgba(255,217,138,0) 72%)' }} />
          : <Moon phase={phase} size={36} />}
      </motion.div>
      <Silhouette lit={dark} tone={dark ? '#0A0F22' : 'rgba(30,42,51,0.55)'} />
      {sira && (
        <span style={{ position: 'absolute', insetInlineEnd: 18, top: 20, padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
          background: dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.45)', border: `1px solid ${dark ? 'rgba(240,196,106,0.35)' : 'rgba(30,42,51,0.12)'}`, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          {tt(VAKIT_YONELME[sira.ad])} {sure(sira.kalan)}
        </span>
      )}

      <div style={{ position: 'relative', padding: '22px 22px 0' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', opacity: 0.8 }}>{tt(sky.label)}</span>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 6 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 72, fontWeight: 600, lineHeight: 0.9, letterSpacing: -2 }}>{h.d || ''}</span>
          <span style={{ display: 'flex', flexDirection: 'column', paddingBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>{tt(HICRI_AY[(h.m || 1) - 1])}</span>
            <span style={{ fontSize: 13, opacity: 0.78 }}>{h.y} · {now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}</span>
          </span>
        </div>
      </div>

      <div role="group" aria-label={tt('Bu haftanın vakitleri')} style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', margin: '22px 14px 132px', padding: '10px 6px', borderRadius: 20, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.28)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
        {week.map((d) => (
          <button type="button" key={d.g} onClick={() => setSecili(secili === d.g ? null : d.g)} aria-pressed={secili === d.g}
            aria-label={`${tt(d.g)} ${d.n}: ${Object.values(d.marks).filter(Boolean).length}/5`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: d.future ? 0.55 : 1, background: secili === d.g ? 'rgba(240,196,106,0.16)' : 'transparent', border: 'none', borderRadius: 14, padding: '4px 2px', color: 'inherit', cursor: 'pointer', font: 'inherit' }}>
            <span style={{ fontSize: 11, fontWeight: d.today ? 700 : 500, color: d.today ? '#F0C46A' : 'inherit' }}>{tt(d.g)}</span>
            <Ring marks={d.marks} today={d.today} future={d.future} />
            <span style={{ fontSize: 12, fontWeight: d.today ? 700 : 500, fontVariantNumeric: 'tabular-nums' }}>{d.n}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {secili && (() => {
          const d = week.find((w) => w.g === secili);
          const isaretli = VAKIT.filter((v) => d.marks[v]).map((v) => tt(VAKIT_AD[v]));
          return (
            <motion.p key={secili} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ position: 'relative', zIndex: 1, margin: '-124px 16px 96px', padding: '8px 12px', borderRadius: 14, fontSize: 12.5, lineHeight: 1.45, background: dark ? 'rgba(7,11,28,0.55)' : 'rgba(255,255,255,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
              <b>{d.tarih.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}</b>
              {' · '}
              {d.future ? tt('Henüz gelmedi.') : isaretli.length ? `${isaretli.join(', ')} ${tt('işaretli')}` : tt('İşaret yok; bu senin defterin, puan yok.')}
            </motion.p>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
