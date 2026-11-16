// frontend/src/components/home/PrayerCard.jsx
// 🕌 Ana ekran v2 — vakit kartı: sıradaki vakit, geri sayım, konum ve beş vaktin KİŞİSEL takibi.
// Takip yalnız cihazda durur (namaz_takip_v1), sunucuya gitmez, XP vermez (docs/YENI_OZELLIKLER.md §0 kural 7).
import React, { useState } from 'react';
import { MapPin, LocateFixed } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { usePrayerTimes, TURKISH_CITIES } from '../../hooks/usePrayerTimes';
import { useTx } from '../../i18n';
import { VAKIT_MAKAM, MAKAM_NAMES } from '../../services/donusAudio';
import sound from '../../services/sound';

const KEY = 'namaz_takip_v1';
const VAKITLER = [
  { id: 'Fajr', label: 'Sabah' }, { id: 'Dhuhr', label: 'Öğle' }, { id: 'Asr', label: 'İkindi' },
  { id: 'Maghrib', label: 'Akşam' }, { id: 'Isha', label: 'Yatsı' },
];
const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

export default function PrayerCard() {
  const { theme } = useTheme();
  const tt = useTx();
  const { timings, city, changeCity, locate, nextPrayer, countdown } = usePrayerTimes();
  const [log, setLog] = useState(load);
  const [locating, setLocating] = useState(false);
  const day = log[today()] || {};
  const done = VAKITLER.filter((v) => day[v.id]).length;

  const toggle = (id) => {
    const next = { ...log, [today()]: { ...day, [id]: !day[id] } };
    // yalnız son 40 gün tutulur
    const keys = Object.keys(next);
    if (keys.length > 40) delete next[keys[0]];
    setLog(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* kota */ }
    if (navigator.vibrate) navigator.vibrate(12);
  };
  const find = async () => { setLocating(true); await locate(); setLocating(false); };

  const nextName = (nextPrayer && nextPrayer.name) || '';
  const nextKey = ({ 'İmsak': 'Fajr', 'Öğle': 'Dhuhr', 'İkindi': 'Asr', 'Akşam': 'Maghrib', 'Yatsı': 'Isha' })[nextName.split(' ')[0]] || null;
  const [h, m] = (countdown || '').split(':');
  const left = h !== undefined && m !== undefined ? `${Number(h) ? `${Number(h)} ${tt('sa')} ` : ''}${Number(m)} ${tt('dk kaldı')}` : '';

  return (
    <section aria-label={tt('Namaz vakitleri')} style={{ borderRadius: 22, background: theme.surface, border: `1px solid ${theme.cardBorder}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 32, padding: '0 10px', borderRadius: 16, background: theme.bg, border: `1px solid ${theme.cardBorder}`, color: theme.textSecondary, fontSize: 12 }}>
          <MapPin size={13} aria-hidden="true" />
          <select value={city} onChange={(e) => changeCity(e.target.value)} aria-label={tt('Şehir')}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'inherit', fontSize: 12, fontFamily: 'inherit', maxWidth: 130 }}>
            {[city, ...TURKISH_CITIES.filter((c) => c !== city)].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <button type="button" onClick={find} disabled={locating}
          style={{ display: 'flex', alignItems: 'center', gap: 5, minHeight: 32, background: 'none', border: 'none', color: theme.textSecondary, fontSize: 11, cursor: 'pointer' }}>
          <LocateFixed size={13} aria-hidden="true" /> {locating ? tt('Bulunuyor…') : tt('Konumumu bul')}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, color: theme.textSecondary, textTransform: 'uppercase' }}>
            {tt('Sıradaki')} · {nextPrayer ? tt(nextPrayer.name) : '…'}
          </span>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 700, letterSpacing: -1, lineHeight: 1, color: theme.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
            {nextPrayer ? nextPrayer.time : '--:--'}
          </span>
        </div>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, paddingBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: theme.gold }}>{left}</span>
          {VAKIT_MAKAM[nextKey] && (
            <button type="button" onClick={() => sound.play('vakit', nextKey)} aria-label={tt('Vaktin makamını dinle')}
              style={{ minHeight: 30, padding: '0 10px', borderRadius: 15, background: 'transparent', border: `1px solid ${theme.cardBorder}`, color: theme.textSecondary, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              ♪ {MAKAM_NAMES[VAKIT_MAKAM[nextKey]]}
            </button>
          )}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 6 }}>
        {VAKITLER.map((v) => (
          <button key={v.id} type="button" onClick={() => toggle(v.id)} aria-pressed={!!day[v.id]}
            aria-label={`${tt(v.label)} ${day[v.id] ? tt('kılındı') : tt('işaretle')}`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', minHeight: 44 }}>
            <span style={{ width: 28, height: 28, borderRadius: 14, boxSizing: 'border-box', background: day[v.id] ? theme.gold : 'transparent', border: day[v.id] ? 'none' : `1.5px dashed ${theme.textMuted}`, transition: 'background .2s' }} />
            <span style={{ fontSize: 10, color: theme.textSecondary }}>{tt(v.label)}</span>
            <span style={{ fontSize: 10, color: theme.textMuted, fontVariantNumeric: 'tabular-nums' }}>{timings?.[v.id] || ''}</span>
          </button>
        ))}
      </div>
      <span style={{ fontSize: 11, color: theme.textSecondary, borderTop: `1px solid ${theme.cardBorder}`, paddingTop: 10 }}>
        {tt('Bugün')} {done}/5 · {tt('takip yalnızca sende, XP vermez')}
      </span>
    </section>
  );
}
