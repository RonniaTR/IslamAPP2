import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createRoom } from '../../services/oda/rtc';

// Oda kurma: oda adı, iki ad, isteğe bağlı "bizim cümlemiz" ve şiirler. Hepsi yalnız bu odanın belgesinde durur.
export const field = { width: '100%', minHeight: 50, borderRadius: 16, border: '1px solid rgba(255,233,184,0.25)', background: 'rgba(255,255,255,0.06)', color: '#F6EFDD', padding: '12px 14px', fontSize: 16, fontFamily: 'inherit', boxSizing: 'border-box' };
export const goldBtn = { minHeight: 54, padding: '0 26px', borderRadius: 27, background: '#FFD27A', color: '#2A1E05', fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer' };
export const card = { background: 'rgba(18,15,46,0.72)', border: '1px solid rgba(255,233,184,0.16)', borderRadius: 26, padding: 20, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' };

export default function OdaKur({ onCreated }) {
  const [ad, setAd] = useState('Düş Bahçesi');
  const [benim, setBenim] = useState('');
  const [onun, setOnun] = useState('');
  const [cumle, setCumle] = useState('');
  const [siirler, setSiirler] = useState([]);
  const [yeni, setYeni] = useState({ baslik: '', metin: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const addSiir = () => { if (!yeni.metin.trim()) return; setSiirler([...siirler, { baslik: yeni.baslik.trim(), metin: yeni.metin.trim() }]); setYeni({ baslik: '', metin: '' }); };
  const kur = async () => {
    if (!benim.trim()) { setErr('Adını yaz.'); return; }
    setBusy(true); setErr('');
    try { onCreated(await createRoom({ ad: ad.trim(), benimAdim: benim.trim(), onunAdi: onun.trim(), cumle: cumle.trim(), siirler })); }
    catch (e) { setErr('Oda kurulamadı. İnternet bağlantını ve Firebase ayarını kontrol et.'); setBusy(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h1 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: 38, fontWeight: 600, margin: '10px 0 0', color: '#FFE9B8' }}>Bir oda kur</h1>
      <p style={{ margin: 0, color: '#BDB6D8', fontSize: 15, lineHeight: 1.5 }}>İki kişilik bir oda. Görüntü ve ses doğrudan ikiniz arasında akar; hiçbir yere kaydedilmez.</p>
      <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ fontSize: 13, color: '#BDB6D8' }}>Odanın adı<input value={ad} onChange={(e) => setAd(e.target.value.slice(0, 40))} style={{ ...field, marginTop: 6 }} /></label>
        <div style={{ display: 'flex', gap: 10 }}>
          <label style={{ flex: 1, fontSize: 13, color: '#BDB6D8' }}>Senin adın<input value={benim} onChange={(e) => setBenim(e.target.value.slice(0, 24))} style={{ ...field, marginTop: 6 }} /></label>
          <label style={{ flex: 1, fontSize: 13, color: '#BDB6D8' }}>Onun adı<input value={onun} onChange={(e) => setOnun(e.target.value.slice(0, 24))} style={{ ...field, marginTop: 6 }} /></label>
        </div>
        <label style={{ fontSize: 13, color: '#BDB6D8' }}>Bizim cümlemiz (isteğe bağlı)<input value={cumle} onChange={(e) => setCumle(e.target.value.slice(0, 120))} placeholder="Odaya girince ikinizin de göreceği bir söz" style={{ ...field, marginTop: 6 }} /></label>
      </div>
      <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#FFE9B8' }}>Şiir köşesi (isteğe bağlı)</p>
        {siirler.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.05)' }}>
            <span style={{ flex: 1, fontSize: 14 }}>{s.baslik || 'Başlıksız'} · {s.metin.split('\n')[0].slice(0, 40)}</span>
            <button type="button" onClick={() => setSiirler(siirler.filter((_, k) => k !== i))} aria-label="Sil" style={{ color: '#F7A8B8', background: 'none', border: 'none', fontSize: 18 }}>×</button>
          </div>
        ))}
        <input value={yeni.baslik} onChange={(e) => setYeni({ ...yeni, baslik: e.target.value.slice(0, 60) })} placeholder="Başlık" style={field} />
        <textarea value={yeni.metin} onChange={(e) => setYeni({ ...yeni, metin: e.target.value.slice(0, 2000) })} rows={4} placeholder="Şiirin…" style={{ ...field, resize: 'vertical' }} />
        <button type="button" onClick={addSiir} style={{ ...goldBtn, background: 'rgba(255,210,122,0.16)', color: '#FFE9B8', minHeight: 44 }}>+ Şiiri ekle</button>
      </div>
      {err && <p role="alert" style={{ margin: 0, color: '#F7A8B8' }}>{err}</p>}
      <button type="button" onClick={kur} disabled={busy} style={{ ...goldBtn, opacity: busy ? 0.6 : 1 }}>{busy ? 'Kuruluyor…' : 'Odayı kur'}</button>
    </motion.div>
  );
}

/** Davet bağlantısıyla gelen kişi: adını yazıp katılır. */
export function OdaKatil({ oda, onJoin, err }) {
  const [ad, setAd] = useState(oda.davetli || '');
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 30, textAlign: 'center' }}>
      <p style={{ margin: 0, fontSize: 13, letterSpacing: 2, color: '#C8B6FF' }}>BİR ODAYA DAVET EDİLDİN</p>
      <h1 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: 34, fontWeight: 600, margin: 0, color: '#FFE9B8' }}>{oda.ad}</h1>
      {oda.cumle && <p style={{ margin: 0, fontStyle: 'italic', color: '#E9E2FF' }}>“{oda.cumle}”</p>}
      <input value={ad} onChange={(e) => setAd(e.target.value.slice(0, 24))} placeholder="Adın" style={{ ...field, textAlign: 'center' }} />
      {err && <p role="alert" style={{ margin: 0, color: '#F7A8B8' }}>{err}</p>}
      <button type="button" onClick={() => onJoin(ad.trim())} style={goldBtn}>Odaya gir</button>
    </motion.div>
  );
}
