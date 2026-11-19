import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { newCode, saveRoom, loadRooms, setMyName, myName } from '../../services/oda/peer';
import { Sakayik } from './DusBahcesi';

// ODA KUR — hesap, Firebase ayarı ya da giriş gerekmez. Oda bilgileri yalnız bu cihazda tutulur;
// misafir bağlanınca ona gönderilir.
export const field = {
  width: '100%',
  minHeight: 46,
  borderRadius: 16,
  border: '1px solid rgba(255,233,184,0.22)',
  background: 'rgba(255,255,255,0.07)',
  color: '#F6EFDD',
  padding: '10px 14px',
  fontSize: 15,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  outline: 'none',
};
export const goldBtn = {
  minHeight: 48,
  padding: '0 22px',
  borderRadius: 24,
  background: 'linear-gradient(135deg, #FFE3A3, #F2B860)',
  color: '#2A1E05',
  fontWeight: 800,
  fontSize: 15,
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 10px 28px -10px rgba(242,184,96,0.8)',
};
export const ghostBtn = {
  minHeight: 42,
  padding: '0 16px',
  borderRadius: 21,
  background: 'rgba(255,255,255,0.08)',
  color: '#F6EFDD',
  fontWeight: 700,
  fontSize: 14,
  border: '1px solid rgba(255,233,184,0.16)',
  cursor: 'pointer',
};
export const glass = {
  background: 'rgba(20,16,48,0.68)',
  border: '1px solid rgba(255,233,184,0.16)',
  borderRadius: 24,
  padding: 18,
  backdropFilter: 'blur(16px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
};
export const serif = {
  fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
  fontWeight: 600,
  letterSpacing: -0.5,
};
const lbl = {
  fontSize: 13,
  color: '#D5CFE8',
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  flex: 1,
  minWidth: 0,
};

export default function OdaKur({ onOpen }) {
  const [benim, setBenim] = useState(myName());
  const [onun, setOnun] = useState(() => {
    try {
      return localStorage.getItem('dusbahcesi_onun') || 'Melike';
    } catch {
      return 'Melike';
    }
  });
  const [cumle, setCumle] = useState('');
  const [siirler, setSiirler] = useState([]);
  const [yeni, setYeni] = useState({ baslik: '', metin: '' });
  const [err, setErr] = useState('');
  const [rooms, setRooms] = useState(loadRooms);

  const addSiir = () => {
    if (!yeni.metin.trim()) return;
    setSiirler([...siirler, { baslik: yeni.baslik.trim(), metin: yeni.metin.trim() }]);
    setYeni({ baslik: '', metin: '' });
  };

  const kur = () => {
    const b = benim.trim();
    const o = onun.trim();
    if (!b) {
      setErr('Lütfen kendi adını yaz.');
      return;
    }
    try {
      if (o) localStorage.setItem('dusbahcesi_onun', o);
    } catch {
      /* kota */
    }
    const code = newCode();
    saveRoom(code, {
      benim: b,
      onun: o,
      ad: o ? `${b} & ${o}` : `${b}’in bahçesi`,
      cumle: cumle.trim(),
      siirler,
      kuruldu: Date.now(),
    });
    setMyName(b);
    onOpen(code);
  };

  const sil = (code) => {
    const all = loadRooms();
    delete all[code];
    try {
      localStorage.setItem('dusbahcesi_odalar', JSON.stringify(all));
    } catch {
      /* kota */
    }
    setRooms(all);
  };

  const list = Object.entries(rooms).sort((a, b) => (b[1].kuruldu || 0) - (a[1].kuruldu || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        maxWidth: 540,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', padding: '8px 4px 2px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Sakayik size={38} glow pulse />
          <span style={{ fontSize: 11, letterSpacing: 3.5, color: '#F7A8B8', fontWeight: 700 }}>DÜŞ BAHÇESİ · ŞAKAYIK</span>
        </div>
        <h1
          style={{
            ...serif,
            fontSize: 'clamp(26px, 5.5vw, 40px)',
            margin: '2px 0 6px',
            color: '#FFE9B8',
            lineHeight: 1.12,
          }}
        >
          Uzakta ama aynı gecede
        </h1>
        <p style={{ margin: 0, color: '#BDB6D8', fontSize: 14, lineHeight: 1.5, maxWidth: 460 }}>
          Mikrofonla sesli sohbet, birlikte YouTube, kendi videolarınız ya da ekran paylaşımı. Görüntü ve ses doğrudan ikinizin arasında akar.
        </p>
      </div>

      <div style={{ ...glass, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#FFE9B8', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="#F7A8B8" /> Yeni Oda Kur
          </p>
          <span style={{ fontSize: 12, color: '#F7A8B8' }}>Şakayık Bahçesi 🌸</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 10,
          }}
        >
          <label style={lbl}>
            Senin adın
            <input
              value={benim}
              onChange={(e) => {
                setBenim(e.target.value.slice(0, 24));
                if (err) setErr('');
              }}
              placeholder="Adın"
              autoComplete="given-name"
              style={field}
            />
          </label>
          <label style={lbl}>
            Onun adı
            <input
              value={onun}
              onChange={(e) => setOnun(e.target.value.slice(0, 24))}
              placeholder="Melike"
              style={field}
            />
          </label>
        </div>

        <label style={lbl}>
          Bizim cümlemiz (isteğe bağlı)
          <input
            value={cumle}
            onChange={(e) => setCumle(e.target.value.slice(0, 120))}
            placeholder="Şakayıklar açarken aynı gökyüzünün altındayız…"
            style={field}
          />
        </label>

        <details style={{ color: '#BDB6D8', borderRadius: 14, background: 'rgba(255,255,255,0.03)', padding: '6px 12px' }}>
          <summary style={{ cursor: 'pointer', fontSize: 13.5, padding: '4px 0', color: '#E9E2FF', fontWeight: 600 }}>
            Şiir köşesi {siirler.length ? `(${siirler.length})` : '(isteğe bağlı)'}
          </summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, paddingBottom: 4 }}>
            {siirler.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                <span style={{ flex: 1, fontSize: 13.5, color: '#F6EFDD' }}>
                  {s.baslik || s.metin.split('\n')[0].slice(0, 36)}
                </span>
                <button
                  type="button"
                  onClick={() => setSiirler(siirler.filter((_, k) => k !== i))}
                  aria-label="Şiiri çıkar"
                  style={{ color: '#F7A8B8', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
            ))}
            <input
              value={yeni.baslik}
              onChange={(e) => setYeni({ ...yeni, baslik: e.target.value.slice(0, 60) })}
              placeholder="Şiir başlığı"
              style={field}
            />
            <textarea
              value={yeni.metin}
              onChange={(e) => setYeni({ ...yeni, metin: e.target.value.slice(0, 3000) })}
              rows={3}
              placeholder="Şiirin…"
              style={{ ...field, resize: 'vertical', lineHeight: 1.5 }}
            />
            <button type="button" onClick={addSiir} style={ghostBtn}>
              + Şiiri ekle
            </button>
          </div>
        </details>

        {err && (
          <p role="alert" style={{ margin: 0, color: '#F7A8B8', fontSize: 14, fontWeight: 600 }}>
            {err}
          </p>
        )}

        <button
          type="button"
          onClick={kur}
          style={{
            ...goldBtn,
            width: '100%',
            minHeight: 52,
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Sakayik size={24} glow={false} /> Odayı Kur ve Bahçeye Geç
        </button>
      </div>

      {list.length > 0 && (
        <div style={{ ...glass, display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#FFE9B8', fontSize: 14 }}>Önceki Odaların</p>
          {list.map(([code, r]) => (
            <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={() => onOpen(code)}
                style={{
                  ...ghostBtn,
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'start',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.ad}</span>
                <ArrowRight size={17} style={{ flexShrink: 0 }} />
              </button>
              <button
                type="button"
                onClick={() => sil(code)}
                aria-label="Odayı sil"
                style={{
                  ...ghostBtn,
                  width: 42,
                  padding: 0,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
