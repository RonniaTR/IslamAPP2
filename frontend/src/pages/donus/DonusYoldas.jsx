import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useTx } from '../../i18n';
import api from '../../api';
import { localKey } from '../../services/pathEngine';

// 🕯️ DİNLEYEN YOLDAŞ (tuval M7) — Dönüş Odası'nda günde TEK soru.
// GÜVENLİK KATMANLARI:
//   1. Ağır bir ifade CİHAZDA da taranır (sunucuya ulaşılamasa bile güvenlik kartı çıkar).
//   2. Sunucu ayrıca tarar ve o durumda yapay zekâyı hiç çağırmaz.
//   3. Güvenlik kartı sabit metindir; yapay zekâ üretmez.
// Cevap cihazda saklanır, sunucuda tutulmaz. Terapi değildir.
const KEY = 'donus_yoldas_v1';
const CRISIS = ['intihar', 'ölmek ist', 'ölsem', 'kendime zarar', 'yaşamak istem', 'hayatıma son', 'anlamı yok', 'anlamı kalmadı', 'dayanamıyorum', 'yok olmak', 'umudum kalmadı', 'değersiz'];
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

export default function DonusYoldas() {
  const navigate = useNavigate();
  const tt = useTx();
  const today = localKey();
  const [log, setLog] = useState(load);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const entry = log[today];

  const store = (e) => { const next = { ...log, [today]: e }; setLog(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* kota */ } };

  const send = async () => {
    const t = text.trim();
    if (t.length < 2 || busy) return;
    const low = t.toLocaleLowerCase('tr');
    if (CRISIS.some((k) => low.includes(k))) { store({ text: t, care: true }); return; }
    setBusy(true);
    try {
      const { data } = await api.post('/rehber/yoldas', { text: t });
      store({ text: t, care: !!data.care, reply: data.reply || '' });
    } catch {
      store({ text: t, care: false, reply: tt('Yazdığını okudum. Şu an sana karşılık yazamıyorum ama bunu söyleyebilmen de bir adım. Yarın yine buradayım.') });
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 px-5 pt-6 pb-28" data-testid="donus-yoldas"
      style={{ background: 'radial-gradient(ellipse at 50% 18%, #2A1F0A 0%, #120D05 45%, #0A0805 100%)', color: '#F3E9D2' }}>
      <button onClick={() => navigate(-1)} aria-label={tt('Geri')} className="self-start"><ChevronLeft size={24} color="#A89262" /></button>
      <div className="text-center">
        <p style={{ fontSize: 11, color: '#A89262', letterSpacing: 0.6 }}>{tt('GÜNÜN TEK SORUSU')}</p>
        <h1 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.3, marginTop: 4 }}>{tt('Bugün seni en çok ne yordu?')}</h1>
      </div>

      {!entry ? (
        <>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder={tt('İstersen yaz. Cevap vermek zorunlu değil.')}
            style={{ borderRadius: 18, padding: 14, background: 'rgba(243,233,210,0.06)', border: '1px solid rgba(243,233,210,0.15)', color: '#F3E9D2', fontSize: 15, resize: 'none' }} />
          <button onClick={send} disabled={busy || text.trim().length < 2}
            style={{ minHeight: 48, borderRadius: 24, background: '#F0B429', color: '#120D05', fontWeight: 700, fontSize: 15, opacity: busy || text.trim().length < 2 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {busy && <Loader2 size={16} className="animate-spin" />} {tt('Paylaş')}
          </button>
        </>
      ) : (
        <>
          <div style={{ borderRadius: 18, padding: 14, background: 'rgba(243,233,210,0.06)', border: '1px solid rgba(243,233,210,0.12)', fontSize: 14, lineHeight: 1.55 }}>{entry.text}</div>
          {entry.care ? (
            <div style={{ borderRadius: 18, background: '#F3E9D2', color: '#2B2416', padding: 16 }} role="alert">
              <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>{tt('Bunu yazdığın için teşekkür ederim. Şu an yalnız kalmamanı istiyorum.')}</p>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, marginTop: 6 }}>{tt('Güvendiğin birine şimdi ulaşabilir misin? Kendini tehlikede hissediyorsan 112’yi ara.')}</p>
              <a href="tel:112" style={{ marginTop: 12, minHeight: 46, borderRadius: 23, background: '#2B2416', color: '#F3E9D2', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>{tt('112’yi ara')}</a>
            </div>
          ) : (
            <div style={{ borderRadius: 18, borderLeft: '3px solid #F0B429', background: 'rgba(240,180,41,0.08)', padding: 16 }}>
              <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{entry.reply}</p>
              <p style={{ fontSize: 10, color: '#A89262', marginTop: 8 }}>{tt('yapay zekâ · seni yargılamaz · terapi değildir')}</p>
            </div>
          )}
          <p style={{ fontSize: 12, color: '#A89262', textAlign: 'center' }}>{tt('Yarın yeni bir soruyla buradayım.')}</p>
        </>
      )}
      <div style={{ flexGrow: 1 }} />
      <p style={{ fontSize: 11, color: '#A89262', textAlign: 'center', lineHeight: 1.5 }}>{tt('Yazdıkların bu cihazda kalır. Bu bölüm bir uzman desteğinin yerini tutmaz.')}</p>
    </div>
  );
}
