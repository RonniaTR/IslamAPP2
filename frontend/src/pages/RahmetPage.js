import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { getUpcomingDays } from '../services/islamicCalendar';

// 🕊️ RAHMET DEFTERİ (docs/YENI_OZELLIKLER.md 8.4)
// Vefat etmiş yakınların listesi. YALNIZ CİHAZDA durur; sunucuya gönderilmez.
// Dil sade ve saygılıdır: kutlama, emoji yağmuru, sayaç yoktur.

const KEY = 'rahmet_defteri';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* kota */ } };
const FATIHA = [
  'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 'مَٰلِكِ يَوْمِ ٱلدِّينِ',
  'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
];

export default function RahmetPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [list, setList] = useState(load);
  const [name, setName] = useState('');
  const [rel, setRel] = useState('');
  const [reading, setReading] = useState(null);

  const add = () => {
    const n = name.trim();
    if (!n) return;
    const next = [...list, { id: Date.now(), name: n, rel: rel.trim() }];
    setList(next); save(next); setName(''); setRel('');
  };
  const remove = (id) => { const next = list.filter((x) => x.id !== id); setList(next); save(next); };

  // Bu gece özel bir gece mi? (perşembeyi cumaya bağlayan gece ya da kandil)
  const now = new Date();
  const kandil = getUpcomingDays(1).find((d) => d.daysLeft === 0 && /Kandil|Kadir/.test(d.name));
  const special = kandil ? kandil.name : now.getDay() === 4 ? 'Cuma gecesi' : null;

  const card = { background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 22, padding: 16 };
  const input = { minHeight: 44, borderRadius: 14, padding: '0 12px', background: theme.inputBg, color: theme.textPrimary, border: `1px solid ${theme.inputBorder}`, fontSize: 14, width: '100%' };

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg }} data-testid="rahmet-page">
      <div className="flex items-center gap-2 px-4 pt-6 pb-3">
        <button onClick={() => navigate(-1)} aria-label={tt('Geri')}><ChevronLeft size={24} style={{ color: theme.textPrimary }} /></button>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: theme.textPrimary }}>{tt('Rahmet Defteri')}</h1>
          <p className="text-[11px]" style={{ color: theme.textSecondary }}>{tt('Yalnız bu cihazda saklanır')}</p>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4 max-w-xl mx-auto">
        {special && list.length > 0 && (
          <div style={{ ...card, borderColor: theme.gold }}>
            <p style={{ color: theme.gold, fontSize: 12, fontWeight: 700 }}>{tt(special)}</p>
            <p style={{ color: theme.textPrimary, fontSize: 15, marginTop: 4 }}>{tt('Bu gece onlar için bir Fâtiha okumak ister misin?')}</p>
          </div>
        )}

        {list.length === 0 && (
          <p style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
            {tt('Vefat etmiş yakınlarının adını buraya yazabilirsin. Cuma gecelerinde ve kandillerde onları sana hatırlatırız.')}
          </p>
        )}

        {list.map((x) => (
          <div key={x.id} style={card} className="flex items-center justify-between gap-3">
            <button className="text-left flex-1" onClick={() => setReading(x)}>
              <div style={{ color: theme.textPrimary, fontSize: 16, fontWeight: 700 }}>{x.name}</div>
              <div style={{ color: theme.textSecondary, fontSize: 12 }}>{x.rel ? `${x.rel} · ` : ''}{tt('Fâtiha oku')} ›</div>
            </button>
            <button onClick={() => remove(x.id)} aria-label={`${x.name} — ${tt('listeden çıkar')}`} className="p-2"><Trash2 size={16} style={{ color: theme.textMuted }} /></button>
          </div>
        ))}

        <div style={card} className="flex flex-col gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={tt('Ad')} style={input} aria-label={tt('Ad')} />
          <input value={rel} onChange={(e) => setRel(e.target.value)} placeholder={tt('Yakınlık (isteğe bağlı): annem, dedem…')} style={input} aria-label={tt('Yakınlık')} />
          <button onClick={add} disabled={!name.trim()}
            style={{ minHeight: 44, borderRadius: 22, background: theme.gold, color: '#1A1A1A', fontWeight: 700, fontSize: 14, opacity: name.trim() ? 1 : 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Plus size={16} /> {tt('Deftere ekle')}
          </button>
        </div>
      </div>

      {reading && (
        <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setReading(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl p-6" style={{ background: '#FBF8F0', color: '#1A1A1A', border: '1px solid #B8A77A' }}>
            <p className="text-center text-[12px] mb-3" style={{ color: '#5B5137' }}>{reading.name} {tt('için')}</p>
            <div dir="rtl" lang="ar" style={{ fontFamily: "'Amiri', serif", fontSize: 22, lineHeight: 2.1, textAlign: 'center' }}>
              {FATIHA.map((a, i) => <span key={i}>{a} ﴿{'١٢٣٤٥٦٧'[i]}﴾ </span>)}
            </div>
            <button onClick={() => setReading(null)} className="mt-5 w-full" style={{ minHeight: 44, borderRadius: 22, background: '#1A1A1A', color: '#FBF8F0', fontWeight: 700, fontSize: 14 }}>
              {tt('Okudum')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
