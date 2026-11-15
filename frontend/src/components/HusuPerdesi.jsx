import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useTx } from '../i18n';
import { isEnabled } from '../features/registry';

// 🕯️ HUŞU PERDESİ (docs/YENI_OZELLIKLER.md 8.2)
// Vakit girdiğinde seçilen süre boyunca sakin bir tam ekran perde: kandil, vakit adı.
// Varsayılan KAPALI; Ayarlar › Bildirimler'den açılır. Tek dokunuşla kaldırılır, onay sorulmaz,
// hiçbir şey kaydedilmez. (Telefonda "Rahatsız Etmeyin" bağlantısı sonraki iştir.)
export const HUSU_KEY = 'husu_perdesi';
export const loadHusu = () => {
  try { return { enabled: false, minutes: 15, ...JSON.parse(localStorage.getItem(HUSU_KEY)) }; }
  catch { return { enabled: false, minutes: 15 }; }
};
const NAMES = { Fajr: 'İmsak', Dhuhr: 'Öğle', Asr: 'İkindi', Maghrib: 'Akşam', Isha: 'Yatsı' };

export default function HusuPerdesi() {
  const { timings } = usePrayerTimes();
  const { pathname } = useLocation();
  const tt = useTx();
  const [active, setActive] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 30000); return () => clearInterval(id); }, []);

  useEffect(() => {
    const pref = loadHusu();
    if (!isEnabled('husuPerdesi') || !pref.enabled || !timings) { setActive(null); return; }
    const now = new Date();
    let found = null;
    Object.keys(NAMES).forEach((key) => {
      const t = timings[key]; if (!t) return;
      const [h, m] = t.slice(0, 5).split(':').map(Number);
      const start = new Date(); start.setHours(h, m, 0, 0);
      const end = new Date(start.getTime() + pref.minutes * 60000);
      if (now >= start && now < end) found = { key, until: end.getTime(), id: `${start.toDateString()}-${key}` };
    });
    let dismissed = null;
    try { dismissed = sessionStorage.getItem('husu_kaldirildi'); } catch { dismissed = null; }
    setActive(found && dismissed !== found.id ? found : null);
  }, [timings, tick, pathname]);

  if (!active || pathname.startsWith('/login') || pathname.startsWith('/mushaf') || pathname.startsWith('/tesbihat')) return null;

  const lift = () => { try { sessionStorage.setItem('husu_kaldirildi', active.id); } catch { /* ignore */ } setActive(null); };
  const left = Math.max(1, Math.round((active.until - Date.now()) / 60000));

  return (
    <div className="fixed inset-0 z-[140] flex flex-col items-center justify-center px-8 text-center" role="dialog" aria-label={tt('Huşu perdesi')}
      style={{ background: 'radial-gradient(ellipse at 50% 35%, #1E1608 0%, #0A0805 70%)', color: '#F3E9D2' }} data-testid="husu-perdesi">
      <svg width="64" height="84" viewBox="0 0 56 72" aria-hidden>
        <path d="M28 8c8 12 14 20 14 30a14 14 0 0 1-28 0c0-10 6-18 14-30z" fill="#F0B429" />
        <path d="M28 26c4 6 6 10 6 14a6 6 0 0 1-12 0c0-4 2-8 6-14z" fill="#FFF3CF" />
      </svg>
      <p className="mt-6 text-[12px] tracking-widest" style={{ color: '#A89262' }}>{tt('VAKİT GİRDİ')}</p>
      <h1 className="text-4xl font-extrabold mt-1">{tt(NAMES[active.key])}</h1>
      <p className="mt-3 text-[14px]" style={{ color: '#D9C9A3' }}>{tt('Telefonu bırakabilirsin. Burası seni bekler.')}</p>
      <p className="mt-1 text-[12px]" style={{ color: '#A89262' }}>{left} {tt('dk sonra kendiliğinden kalkar')}</p>
      <button onClick={lift} className="mt-10" style={{ minHeight: 46, padding: '0 22px', borderRadius: 23, border: '1px solid rgba(243,233,210,0.3)', color: '#F3E9D2', fontSize: 14, fontWeight: 600 }}>
        {tt('Perdeyi kaldır')}
      </button>
    </div>
  );
}
