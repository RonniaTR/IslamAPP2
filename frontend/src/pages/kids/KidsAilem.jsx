import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, Check } from 'lucide-react';
import { loadFamily, saveFamily, GOALS, SECTIONS, weekCounts, getStars, loadKidsProgress, usedToday, extendToday, gateQuestion } from '../../services/kidsFamily';
import sfx from '../../services/sfx';

// 👨‍👩‍👧 AİLEM — "Arkadaşlar" sekmesinin yerine.
// ÇOCUK görür: ailesinin mesajı, bu haftanın hedefleri (kendiliğinden dolar), yıldızları.
// EBEVEYN (kilitli; çarpım sorusuyla açılır): günlük süre, açık bölümler, haftalık hedefler, mesaj, rapor.
// Hiçbir veri cihazdan çıkmaz. Yabancılarla iletişim, sohbet, arkadaş ekleme YOKTUR (bilinçli karar).
const ink = '#24364A';
const font = { fontFamily: "'Nunito', 'Noto Sans', sans-serif" };
const card = { background: '#FFFFFF', borderRadius: 24, padding: 16, boxShadow: '0 6px 0 #E6EEE6' };
const LIMITS = [[0, 'Sınırsız'], [15, '15 dk'], [30, '30 dk'], [45, '45 dk'], [60, '1 saat']];
const STICKERS = ['🌟', '💚', '🏅', '🌈', '🤲', '🌙'];

function Gate({ onOpen, onCancel }) {
  const [q] = useState(gateQuestion);
  const [v, setV] = useState('');
  const [bad, setBad] = useState(false);
  const check = () => { if (Number(v) === q.answer) onOpen(); else { setBad(true); setV(''); } };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...card, textAlign: 'center' }}>
      <Lock size={30} color="#4A90D9" />
      <h2 style={{ fontSize: 22, fontWeight: 900, margin: '8px 0 4px' }}>Ebeveyn bölümü</h2>
      <p style={{ fontSize: 15, color: '#5B6B73', margin: '0 0 12px' }}>Devam etmek için soruyu cevaplayın:</p>
      <p style={{ fontSize: 34, fontWeight: 900, margin: '0 0 10px' }}>{q.text}</p>
      <input inputMode="numeric" value={v} onChange={(e) => { setV(e.target.value.replace(/\D/g, '')); setBad(false); }} onKeyDown={(e) => e.key === 'Enter' && check()} aria-label="Cevap"
        style={{ width: 140, minHeight: 52, borderRadius: 16, border: `2px solid ${bad ? '#EF5350' : '#D6E0E6'}`, textAlign: 'center', fontSize: 24, fontWeight: 900 }} />
      {bad && <p style={{ color: '#EF5350', fontWeight: 700, margin: '6px 0 0' }}>Yanlış, yeni bir soru için geri dönün.</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14 }}>
        <button type="button" onClick={onCancel} style={{ minHeight: 48, padding: '0 18px', borderRadius: 24, background: '#EEF2F5', fontWeight: 800 }}>Vazgeç</button>
        <button type="button" onClick={check} style={{ minHeight: 48, padding: '0 22px', borderRadius: 24, background: '#4A90D9', color: '#fff', fontWeight: 900 }}>Aç</button>
      </div>
    </motion.div>
  );
}

function Panel({ fam, setFam, onClose }) {
  const [msg, setMsg] = useState(fam.message ? fam.message.text : '');
  const [sticker, setSticker] = useState(fam.message ? fam.message.sticker : '🌟');
  const p = loadKidsProgress();
  const w = weekCounts();
  const upd = (patch) => setFam(saveFamily({ ...fam, ...patch }));
  const chip = (on) => ({ minHeight: 42, padding: '0 14px', borderRadius: 21, fontWeight: 800, fontSize: 14, border: `2px solid ${on ? '#2D8A4E' : '#E3E8EE'}`, background: on ? '#E3F5E6' : '#FFFFFF', color: ink });
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={card}>
        <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 900 }}>📊 Rapor</h3>
        <p style={{ margin: '4px 0', fontWeight: 700 }}>Bugün kullanım: <b>{usedToday()} dk</b></p>
        <p style={{ margin: '4px 0', fontWeight: 700 }}>Toplam yıldız: <b>{getStars()}</b> · bu hafta <b>{w.yildiz || 0}</b></p>
        <p style={{ margin: '4px 0', fontWeight: 700 }}>Namaz Yolu: <b>{(p.namaz || []).length}/7 durak</b> · Hikâye: <b>{(p.hikaye || []).length}</b></p>
      </div>
      <div style={card}>
        <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 900 }}>⏱️ Günlük süre</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {LIMITS.map(([m, l]) => <button key={m} type="button" onClick={() => upd({ limit: m })} style={chip(fam.limit === m)}>{l}</button>)}
        </div>
        <button type="button" onClick={() => { extendToday(15); sfx.claim(); }} style={{ ...chip(false), marginTop: 10 }}>Bugüne +15 dk ver</button>
      </div>
      <div style={card}>
        <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 900 }}>🧩 Açık bölümler</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SECTIONS.map((s) => { const on = fam.sections[s.id] !== false; return <button key={s.id} type="button" onClick={() => upd({ sections: { ...fam.sections, [s.id]: !on } })} style={chip(on)}>{on ? '✓ ' : ''}{s.label}</button>; })}
        </div>
      </div>
      <div style={card}>
        <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 900 }}>🎯 Bu haftanın hedefleri</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {GOALS.map((g) => { const on = fam.goals.includes(g.id); return <button key={g.id} type="button" onClick={() => upd({ goals: on ? fam.goals.filter((x) => x !== g.id) : [...fam.goals, g.id] })} style={chip(on)}>{g.icon} {g.label}</button>; })}
        </div>
      </div>
      <div style={card}>
        <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 900 }}>💌 Çocuğuma mesaj</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>{STICKERS.map((s) => <button key={s} type="button" onClick={() => setSticker(s)} style={{ width: 44, height: 44, borderRadius: 22, fontSize: 24, border: `2px solid ${sticker === s ? '#2D8A4E' : 'transparent'}`, background: '#F3F7F3' }}>{s}</button>)}</div>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value.slice(0, 140))} rows={3} placeholder="Örn. Bugün abdest dersini bitirdin, seninle gurur duyuyorum!" style={{ width: '100%', borderRadius: 16, border: '2px solid #E3E8EE', padding: 12, fontSize: 16, fontFamily: 'inherit', resize: 'none' }} />
        <button type="button" onClick={() => { upd({ message: msg.trim() ? { text: msg.trim(), sticker, at: Date.now() } : null }); sfx.claim(); }} style={{ minHeight: 46, padding: '0 20px', borderRadius: 23, background: '#2D8A4E', color: '#fff', fontWeight: 900, marginTop: 8 }}>Gönder</button>
      </div>
      <button type="button" onClick={onClose} style={{ alignSelf: 'center', minHeight: 50, padding: '0 26px', borderRadius: 25, background: '#24364A', color: '#fff', fontWeight: 900 }}>Kilitle ve çık</button>
    </motion.div>
  );
}

export default function KidsAilem() {
  const [fam, setFam] = useState(loadFamily);
  const [view, setView] = useState('cocuk'); // cocuk | kapi | panel
  const w = weekCounts();
  const goals = GOALS.filter((g) => fam.goals.includes(g.id));
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #FFE9D6 0%, #F3FAF1 45%)', color: ink, paddingBottom: 110, ...font }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '22px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>Ailem</h1>
          {view === 'cocuk' && <button type="button" onClick={() => setView('kapi')} aria-label="Ebeveyn bölümü" style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 42, padding: '0 14px', borderRadius: 21, background: '#FFFFFF', fontWeight: 800, fontSize: 13, color: '#5B6B73', boxShadow: '0 3px 0 #EADBCB' }}><Lock size={15} /> Büyükler</button>}
        </div>
        <AnimatePresence mode="wait">
          {view === 'kapi' && <Gate key="g" onOpen={() => setView('panel')} onCancel={() => setView('cocuk')} />}
          {view === 'panel' && <Panel key="p" fam={fam} setFam={setFam} onClose={() => setView('cocuk')} />}
          {view === 'cocuk' && (
            <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* ev sahnesi + mesaj */}
              <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, background: '#FFF8EC' }}>
                <motion.span animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.4, repeat: Infinity }} style={{ fontSize: 46 }}>{fam.message ? fam.message.sticker : '🏡'}</motion.span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 900, color: '#D97A1C', margin: 0 }}>AİLEMDEN MESAJ</p>
                  <p style={{ fontSize: 19, fontWeight: 800, margin: '2px 0 0', lineHeight: 1.4 }}>{fam.message ? fam.message.text : 'Henüz mesaj yok. Büyüklerin sana bir aferin kartı bırakabilir!'}</p>
                </div>
              </div>
              <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 18, fontWeight: 900 }}>Yıldızlarım</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 26, fontWeight: 900 }}><Star size={28} fill="#FFD93D" color="#F2B33D" /> {getStars()}</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: '6px 2px 0' }}>Bu haftanın hedefleri</h2>
              {goals.length === 0 && <p style={{ ...card, margin: 0, fontWeight: 700 }}>Büyüklerin henüz hedef seçmedi.</p>}
              {goals.map((g, k) => {
                const cur = Math.min(g.need, w[g.type] || 0); const ok = cur >= g.need;
                return (
                  <motion.div key={g.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.1 }} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, border: ok ? '3px solid #5DBB63' : '3px solid transparent' }}>
                    <span style={{ fontSize: 36 }}>{g.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>{g.label}</p>
                      <div style={{ height: 12, borderRadius: 6, background: '#EEF2F5', marginTop: 8, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(cur / g.need) * 100}%` }} transition={{ duration: 0.9 }} style={{ height: '100%', background: ok ? '#5DBB63' : '#FFB74D', borderRadius: 6 }} />
                      </div>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: 16 }}>{ok ? <Check size={26} color="#2D8A4E" /> : `${cur}/${g.need}`}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
