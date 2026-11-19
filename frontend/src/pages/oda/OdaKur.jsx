import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ArrowRight } from 'lucide-react';
import { newCode, saveRoom, loadRooms, setMyName, myName } from '../../services/oda/peer';

// ODA KUR — hesap, Firebase ayarı ya da giriş gerekmez. Oda bilgileri yalnız bu cihazda tutulur;
// misafir bağlanınca ona gönderilir. Bağlantıda yalnız rastgele oda kodu vardır.
export const field = { width: '100%', minHeight: 52, borderRadius: 18, border: '1px solid rgba(255,233,184,0.22)', background: 'rgba(255,255,255,0.06)', color: '#F6EFDD', padding: '12px 16px', fontSize: 16, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' };
export const goldBtn = { minHeight: 54, padding: '0 26px', borderRadius: 27, background: 'linear-gradient(135deg, #FFE3A3, #F2B860)', color: '#2A1E05', fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px -10px rgba(242,184,96,0.8)' };
export const ghostBtn = { minHeight: 46, padding: '0 18px', borderRadius: 23, background: 'rgba(255,255,255,0.08)', color: '#F6EFDD', fontWeight: 700, fontSize: 15, border: '1px solid rgba(255,233,184,0.14)', cursor: 'pointer' };
export const glass = { background: 'rgba(20,16,48,0.62)', border: '1px solid rgba(255,233,184,0.14)', borderRadius: 28, padding: 20, backdropFilter: 'blur(16px) saturate(1.3)', WebkitBackdropFilter: 'blur(16px) saturate(1.3)' };
export const serif = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif", fontWeight: 600, letterSpacing: -0.5 };
const lbl = { fontSize: 13, color: '#BDB6D8', display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 };

export default function OdaKur({ onOpen }) {
  const [benim, setBenim] = useState(myName());
  const [onun, setOnun] = useState('');
  const [cumle, setCumle] = useState('');
  const [siirler, setSiirler] = useState([]);
  const [yeni, setYeni] = useState({ baslik: '', metin: '' });
  const [err, setErr] = useState('');
  const [rooms, setRooms] = useState(loadRooms);

  const addSiir = () => { if (!yeni.metin.trim()) return; setSiirler([...siirler, { baslik: yeni.baslik.trim(), metin: yeni.metin.trim() }]); setYeni({ baslik: '', metin: '' }); };
  const kur = () => {
    const b = benim.trim(); const o = onun.trim();
    if (!b) { setErr('Adını yaz.'); return; }
    const code = newCode();
    saveRoom(code, { benim: b, onun: o, ad: o ? `${b} & ${o}` : `${b}’in bahçesi`, cumle: cumle.trim(), siirler, kuruldu: Date.now() });
    setMyName(b);
    onOpen(code);
  };
  const sil = (code) => { const all = loadRooms(); delete all[code]; try { localStorage.setItem('dusbahcesi_odalar', JSON.stringify(all)); } catch { /* kota */ } setRooms(all); };
  const list = Object.entries(rooms).sort((a, b) => (b[1].kuruldu || 0) - (a[1].kuruldu || 0));

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', padding: '24px 0 4px' }}>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: 4, color: '#C8B6FF' }}>DÜŞ BAHÇESİ</p>
        <h1 style={{ ...serif, fontSize: 'clamp(34px, 7vw, 48px)', margin: '8px 0 6px', color: '#FFE9B8', lineHeight: 1.05 }}>Uzakta ama aynı gecede</h1>
        <p style={{ margin: 0, color: '#BDB6D8', fontSize: 15, lineHeight: 1.6 }}>İkiniz için bir oda. Birlikte YouTube, kendi videolarınız ya da ekranınız. Görüntü doğrudan ikinizin arasında akar, kaydedilmez.</p>
      </div>

      {list.length > 0 && (
        <div style={{ ...glass, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#FFE9B8' }}>Odaların</p>
          {list.map(([code, r]) => (
            <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button type="button" onClick={() => onOpen(code)} style={{ ...ghostBtn, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'start' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.ad}</span><ArrowRight size={18} />
              </button>
              <button type="button" onClick={() => sil(code)} aria-label="Odayı sil" style={{ ...ghostBtn, width: 46, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <div style={{ ...glass, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#FFE9B8' }}>Yeni oda</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <label style={lbl}>Senin adın<input value={benim} onChange={(e) => setBenim(e.target.value.slice(0, 24))} autoComplete="given-name" style={field} /></label>
          <label style={lbl}>Onun adı<input value={onun} onChange={(e) => setOnun(e.target.value.slice(0, 24))} style={field} /></label>
        </div>
        <label style={lbl}>Bizim cümlemiz (isteğe bağlı)<input value={cumle} onChange={(e) => setCumle(e.target.value.slice(0, 120))} placeholder="Odaya girince ikinizin de göreceği bir söz" style={field} /></label>
        <details style={{ color: '#BDB6D8' }}>
          <summary style={{ cursor: 'pointer', fontSize: 14, padding: '6px 0' }}>Şiir köşesi {siirler.length ? `(${siirler.length})` : '(isteğe bağlı)'}</summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {siirler.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.05)' }}>
                <span style={{ flex: 1, fontSize: 14, color: '#F6EFDD' }}>{s.baslik || s.metin.split('\n')[0].slice(0, 36)}</span>
                <button type="button" onClick={() => setSiirler(siirler.filter((_, k) => k !== i))} aria-label="Şiiri çıkar" style={{ color: '#F7A8B8', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
              </div>
            ))}
            <input value={yeni.baslik} onChange={(e) => setYeni({ ...yeni, baslik: e.target.value.slice(0, 60) })} placeholder="Başlık" style={field} />
            <textarea value={yeni.metin} onChange={(e) => setYeni({ ...yeni, metin: e.target.value.slice(0, 3000) })} rows={4} placeholder="Şiirin…" style={{ ...field, resize: 'vertical', lineHeight: 1.6 }} />
            <button type="button" onClick={addSiir} style={ghostBtn}>+ Şiiri ekle</button>
          </div>
        </details>
        {err && <p role="alert" style={{ margin: 0, color: '#F7A8B8' }}>{err}</p>}
        <button type="button" onClick={kur} style={goldBtn}>Odayı kur</button>
      </div>
    </motion.div>
  );
}
