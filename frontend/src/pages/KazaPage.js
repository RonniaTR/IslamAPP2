import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { localKey } from '../services/pathEngine';

// 🕊️ SUÇLAMASIZ KAZA PLANI (docs/YENI_OZELLIKLER.md 8.5)
// Toplam borç SORULMAZ ve GÖSTERİLMEZ. Yalnız kılınanlar görünür; plan yalnız ileriye bakar.
// XP, seri, sıralama yok. Veri cihazda kalır.
const KEY = 'kaza_plani_v1';
const VAKITLER = ['Sabah', 'Öğle', 'İkindi', 'Akşam', 'Yatsı', 'Vitir'];
const load = () => { try { return { perDay: 1, log: {}, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return { perDay: 1, log: {} }; } };

export default function KazaPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [st, setSt] = useState(load);
  const today = localKey();
  const todayList = st.log[today] || [];
  const update = (next) => { setSt(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* kota */ } };
  const add = (v) => update({ ...st, log: { ...st.log, [today]: [...todayList, v] } });
  const undo = () => update({ ...st, log: { ...st.log, [today]: todayList.slice(0, -1) } });

  const month = today.slice(0, 7);
  const monthTotal = Object.entries(st.log).filter(([d]) => d.startsWith(month)).reduce((n, [, l]) => n + l.length, 0);
  const allTotal = Object.values(st.log).reduce((n, l) => n + l.length, 0);
  const card = { background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 22, padding: 18 };

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg }} data-testid="kaza-page">
      <div className="flex items-center gap-2 px-4 pt-6 pb-3">
        <button onClick={() => navigate(-1)} aria-label={tt('Geri')}><ChevronLeft size={24} style={{ color: theme.textPrimary }} /></button>
        <h1 className="text-xl font-extrabold" style={{ color: theme.textPrimary }}>{tt('Kaza Planı')}</h1>
      </div>
      <div className="px-4 max-w-xl mx-auto flex flex-col gap-4">
        <p style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 1.6 }}>{tt('Geçmişi saymıyoruz. Bugün bir kaza kılmak, yola çıkmaktır.')}</p>

        <div style={card}>
          <p style={{ color: theme.textSecondary, fontSize: 12, fontWeight: 700 }}>{tt('GÜNDE KAÇ KAZA?')}</p>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 5].map((n) => (
              <button key={n} onClick={() => update({ ...st, perDay: n })} aria-pressed={st.perDay === n}
                style={{ minHeight: 40, minWidth: 48, borderRadius: 20, fontWeight: 700, background: st.perDay === n ? theme.gold : 'transparent', color: st.perDay === n ? '#1A1A1A' : theme.textPrimary, border: `1px solid ${st.perDay === n ? theme.gold : theme.cardBorder}` }}>{n}</button>
            ))}
          </div>
        </div>

        <div style={card}>
          <p style={{ color: theme.textSecondary, fontSize: 12, fontWeight: 700 }}>{tt('BUGÜN')} · {todayList.length} / {st.perDay}</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {VAKITLER.map((v) => (
              <button key={v} onClick={() => add(v)} style={{ minHeight: 48, borderRadius: 16, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, fontSize: 14, fontWeight: 600 }}>{tt(v)}</button>
            ))}
          </div>
          {todayList.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-2" style={{ color: theme.textPrimary, fontSize: 13 }}><Check size={15} style={{ color: theme.gold }} /> {todayList.map((v) => tt(v)).join(' · ')}</span>
              <button onClick={undo} style={{ color: theme.textSecondary, fontSize: 12 }}>{tt('Geri al')}</button>
            </div>
          )}
          {todayList.length >= st.perDay && <p style={{ color: theme.gold, fontSize: 13, marginTop: 10 }}>{tt('Bugünkü niyetin tamam. Allah kabul etsin.')}</p>}
        </div>

        <div style={card} className="flex justify-around text-center">
          <div><div style={{ color: theme.gold, fontSize: 26, fontWeight: 800 }}>{monthTotal}</div><div style={{ color: theme.textSecondary, fontSize: 12 }}>{tt('bu ay kılınan')}</div></div>
          <div><div style={{ color: theme.gold, fontSize: 26, fontWeight: 800 }}>{allTotal}</div><div style={{ color: theme.textSecondary, fontSize: 12 }}>{tt('toplam kılınan')}</div></div>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 11, textAlign: 'center' }}>{tt('Kaza namazının kılınışı için İbadet Rehberi’ne bakabilirsin. Kişisel sorular: Alo 190.')}</p>
      </div>
    </div>
  );
}
