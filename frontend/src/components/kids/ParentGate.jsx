import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { gateQuestion } from '../../services/kidsFamily';

// 🔒 EBEVEYN KAPISI — çocuğun tek başına geçemeyeceği küçük bir soru (çarpım).
// Apple "Kids" ve Google "Families" kuralları: çocuk bölümünden çıkış, dış bağlantı ve ayar değişikliği
// bir yetişkin doğrulamasının arkasında olmalı. Çocuk ailem ekranı, mod değiştirme ve hesap işlemleri bunu kullanır.
const ink = '#24364A';
const card = { background: '#FFFFFF', borderRadius: 24, padding: 16, boxShadow: '0 6px 0 #E6EEE6' };

export default function ParentGate({ onOpen, onCancel, title = 'Ebeveyn bölümü', modal = false }) {
  const [q, setQ] = useState(gateQuestion);
  const [v, setV] = useState('');
  const [bad, setBad] = useState(false);
  const check = () => {
    if (Number(v) === q.answer) { onOpen(); return; }
    setBad(true); setV(''); setQ(gateQuestion());
  };
  const body = (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} data-testid="parent-gate"
      style={{ ...card, textAlign: 'center', color: ink, fontFamily: "'Nunito', 'Noto Sans', sans-serif", width: '100%', maxWidth: 360 }}>
      <Lock size={30} color="#4A90D9" />
      <h2 style={{ fontSize: 22, fontWeight: 900, margin: '8px 0 4px' }}>{title}</h2>
      <p style={{ fontSize: 15, color: '#5B6B73', margin: '0 0 12px' }}>Devam etmek için soruyu cevaplayın:</p>
      <p style={{ fontSize: 34, fontWeight: 900, margin: '0 0 10px' }}>{q.text}</p>
      <input inputMode="numeric" value={v} autoFocus onChange={(e) => { setV(e.target.value.replace(/\D/g, '')); setBad(false); }}
        onKeyDown={(e) => e.key === 'Enter' && check()} aria-label="Cevap" data-testid="parent-gate-input"
        style={{ width: 140, minHeight: 52, borderRadius: 16, border: `2px solid ${bad ? '#EF5350' : '#D6E0E6'}`, textAlign: 'center', fontSize: 24, fontWeight: 900, color: ink }} />
      {bad && <p style={{ color: '#EF5350', fontWeight: 700, margin: '6px 0 0' }}>Olmadı; yeni soruyu deneyin.</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14 }}>
        <button type="button" onClick={onCancel} style={{ minHeight: 48, padding: '0 18px', borderRadius: 24, background: '#EEF2F5', fontWeight: 800, color: ink }}>Vazgeç</button>
        <button type="button" onClick={check} data-testid="parent-gate-ok" style={{ minHeight: 48, padding: '0 22px', borderRadius: 24, background: '#4A90D9', color: '#fff', fontWeight: 900 }}>Aç</button>
      </div>
    </motion.div>
  );
  if (!modal) return body;
  // Sayfa içindeki katman sıralaması (alt menü) modalı örtmesin diye doğrudan <body>'ye çizilir.
  return createPortal(
    <div role="dialog" aria-modal="true" onClick={onCancel}
      style={{ position: 'fixed', inset: 0, zIndex: 1500, background: 'rgba(15,25,35,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{body}</div>
    </div>,
    document.body,
  );
}
