// frontend/src/pages/MahrecPage.js
// 🗣️ MAHREÇ KOÇU (docs/YENI_OZELLIKLER.md 8.10)
// DÜRÜST SINIR: Uygulama telaffuzu PUANLAMAZ; bunu güvenilir yapan bir model yok ve yanlış "doğru" demek zarar verir.
// Yaptığı: en çok karışan harfleri yan yana koyar, çıkış yerini tarif eder, kişinin kendi sesini kaydedip
// DİNLETİR ve kendi kulağıyla karşılaştırmasını ister. Kayıt cihazdan çıkmaz, saklanmaz.
// Doğru mahreç bir hocadan (fem-i muhsin) öğrenilir; bu sayfa yalnız alıştırmadır.
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mic, Square, Play, Volume2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { LETTERS } from '../data/elifba';

// Türkçe konuşanların en çok karıştırdığı gruplar
const GROUPS = [
  { id: 'sin', title: 'Sin · Sad · Se', letters: ['س', 'ص', 'ث'], tip: 'Sin ince ve keskin; Sad kalın, dil kökü yükselir; Se peltek, dil ucu dişlerin arasında.' },
  { id: 'ha', title: 'Ha · Hı · He', letters: ['ح', 'خ', 'ه'], tip: 'Ha boğazın ortasından, hırıltısız; Hı boğazın üstünden, hırıltılı; He en dipten, nefes gibi.' },
  { id: 'te', title: 'Te · Tı', letters: ['ت', 'ط'], tip: 'Te ince; Tı kalın ve dolgun, dil damağa yapışır.' },
  { id: 'dal', title: 'Dal · Dad', letters: ['د', 'ض'], tip: 'Dal ince; Dad dilin yan tarafı azı dişlerine dayanarak, kalın çıkar.' },
  { id: 'zel', title: 'Zel · Ze · Zı', letters: ['ذ', 'ز', 'ظ'], tip: 'Zel peltek ve ince; Ze bildiğimiz z; Zı peltek ve kalın.' },
  { id: 'kaf', title: 'Kaf · Kef', letters: ['ق', 'ك'], tip: 'Kaf dilin en arkasından, kalın; Kef biraz önünden, ince.' },
  { id: 'ayn', title: 'Ayn · Hemze', letters: ['ع', 'ء'], tip: 'Ayn boğazın ortası sıkılarak; hemze gırtlakta kısa bir kesinti.' },
];
const KEY = 'mahrec_v1';
const find = (ar) => LETTERS.find((l) => l.ar === ar) || { ar, name: ar === 'ء' ? 'Hemze' : ar, mahrec: ar === 'ء' ? 'Boğazın en dibinden, kısa bir kesinti' : '' };
const loadSt = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA'; u.rate = 0.6;
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  } catch { /* desteklenmiyor */ }
}

export default function MahrecPage() {
  const { theme } = useTheme();
  const tt = useTx();
  const navigate = useNavigate();
  const [gi, setGi] = useState(0);
  const [st, setSt] = useState(loadSt);
  const [rec, setRec] = useState(null); // aktif harf
  const [clips, setClips] = useState({}); // { harf: blobUrl } — yalnız bellekte
  const [err, setErr] = useState('');
  const mr = useRef(null);
  const g = GROUPS[gi];

  useEffect(() => () => { Object.values(clips).forEach((u) => URL.revokeObjectURL(u)); }, []);

  const start = async (ar) => {
    setErr('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { setErr('Bu cihazda ses kaydı desteklenmiyor.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      const m = new MediaRecorder(stream);
      m.ondataavailable = (e) => chunks.push(e.data);
      m.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const url = URL.createObjectURL(new Blob(chunks, { type: m.mimeType || 'audio/webm' }));
        setClips((c) => { if (c[ar]) URL.revokeObjectURL(c[ar]); return { ...c, [ar]: url }; });
        setRec(null);
      };
      mr.current = m; m.start(); setRec(ar);
      setTimeout(() => { if (m.state === 'recording') m.stop(); }, 4000); // en çok 4 sn
    } catch { setErr('Mikrofon izni verilmedi. Kayıt olmadan da çıkış yerlerini çalışabilirsin.'); }
  };
  const stop = () => { if (mr.current && mr.current.state === 'recording') mr.current.stop(); };
  const mark = (v) => { const next = { ...st, [g.id]: v }; setSt(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* kota */ } };

  const card = { background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 20 };
  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.textPrimary, paddingBottom: 110 }} data-testid="mahrec-page">
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 20px' }}>
        <button onClick={() => navigate(-1)} aria-label={tt('Geri')} style={{ width: 44, height: 44, borderRadius: 22, ...{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} color={theme.textPrimary} /></button>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, marginTop: 14 }}>{tt('Mahreç Koçu')}</h1>
        <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.5, marginTop: 4 }}>{tt('Karışan harfleri yan yana çalış: çıkış yerini oku, söyle, kendi sesini dinle.')}</p>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '16px -20px 0', padding: '0 20px 4px' }}>
          {GROUPS.map((x, i) => (
            <button key={x.id} onClick={() => setGi(i)} aria-pressed={i === gi} style={{ flexShrink: 0, minHeight: 44, padding: '0 14px', borderRadius: 22, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', background: i === gi ? theme.gold : theme.surface, color: i === gi ? '#1A1A1A' : theme.textPrimary, border: `1px solid ${i === gi ? theme.gold : theme.cardBorder}` }}>
              {st[x.id] === 'ok' ? '✓ ' : ''}{tt(x.title)}
            </button>
          ))}
        </div>

        <div style={{ ...card, padding: 16, marginTop: 14, borderInlineStart: `3px solid ${theme.gold}` }}>
          <p style={{ fontSize: 14, lineHeight: 1.55 }}>{tt(g.tip)}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {g.letters.map((ar) => {
            const l = find(ar);
            return (
              <div key={ar} style={{ ...card, padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span lang="ar" style={{ width: 64, height: 64, borderRadius: 16, background: '#FBF8F0', color: '#1A1A1A', fontFamily: "'Amiri', serif", fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{ar}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 16, fontWeight: 800 }}>{tt(l.name)}</p>
                  <p style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.45, marginTop: 2 }}>{tt(l.mahrec)}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    <button onClick={() => speak(`${ar}َ`)} aria-label={`${tt(l.name)} ${tt('dinle')}`} style={{ minHeight: 44, minWidth: 44, padding: '0 12px', borderRadius: 22, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}><Volume2 size={15} /> {tt('Örnek')}</button>
                    {rec === ar
                      ? <button onClick={stop} style={{ minHeight: 44, padding: '0 14px', borderRadius: 22, background: '#C0392B', color: '#FFF', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}><Square size={13} /> {tt('Bitir')}</button>
                      : <button onClick={() => start(ar)} disabled={!!rec} style={{ minHeight: 44, padding: '0 14px', borderRadius: 22, background: theme.gold, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, opacity: rec ? 0.5 : 1 }}><Mic size={15} /> {tt('Söyle')}</button>}
                    {clips[ar] && <button onClick={() => new Audio(clips[ar]).play()} style={{ minHeight: 44, padding: '0 12px', borderRadius: 22, border: `1px solid ${theme.gold}`, color: theme.gold, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}><Play size={14} /> {tt('Kendimi dinle')}</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {err && <p role="alert" style={{ fontSize: 13, color: theme.error || '#E57373', marginTop: 10 }}>{tt(err)}</p>}

        <div style={{ ...card, padding: 16, marginTop: 14 }}>
          <p style={{ fontSize: 14, fontWeight: 700 }}>{tt('Kendi kulağınla: fark duyuluyor mu?')}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={() => mark('ok')} style={{ flex: 1, minHeight: 44, borderRadius: 22, fontSize: 13, fontWeight: 700, background: st[g.id] === 'ok' ? theme.gold : 'transparent', color: st[g.id] === 'ok' ? '#1A1A1A' : theme.textPrimary, border: `1px solid ${theme.cardBorder}` }}>{tt('Evet, ayırabiliyorum')}</button>
            <button onClick={() => mark('again')} style={{ flex: 1, minHeight: 44, borderRadius: 22, fontSize: 13, fontWeight: 700, background: 'transparent', color: theme.textPrimary, border: `1px solid ${theme.cardBorder}` }}>{tt('Biraz daha çalışacağım')}</button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.5, marginTop: 14 }}>
          {tt('Bu sayfa telaffuzunu puanlamaz. Örnek ses cihazının sesidir, bir kârinin sesi değildir. Kaydın cihazdan çıkmaz ve saklanmaz. Doğru mahreç bir hocanın ağzından öğrenilir.')}
        </p>
      </div>
    </div>
  );
}
