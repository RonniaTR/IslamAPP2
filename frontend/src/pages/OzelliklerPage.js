import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { getFeatures, GROUPS } from '../features/registry';

// 🧭 TÜM ÖZELLİKLER — features/registry.js'teki her şey, gruplu ve aranabilir.
export default function OzelliklerPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase('tr');
    const list = getFeatures().filter((f) => !needle || `${tt(f.title)} ${tt(f.desc)}`.toLocaleLowerCase('tr').includes(needle));
    return Object.entries(GROUPS).map(([id, g]) => ({ id, ...g, items: list.filter((f) => f.group === id) })).filter((g) => g.items.length);
  }, [q, tt]);

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg }} data-testid="ozellikler-page">
      <div className="flex items-center gap-2 px-4 pt-6 pb-3">
        <button onClick={() => navigate(-1)} aria-label={tt('Geri')}><ChevronLeft size={24} style={{ color: theme.textPrimary }} /></button>
        <h1 className="text-xl font-extrabold" style={{ color: theme.textPrimary }}>{tt('Tüm özellikler')}</h1>
      </div>
      <div className="px-4 max-w-xl mx-auto flex flex-col gap-5">
        <label className="flex items-center gap-2 px-3" style={{ minHeight: 46, borderRadius: 23, background: theme.inputBg, border: `1px solid ${theme.inputBorder}` }}>
          <Search size={16} style={{ color: theme.textSecondary }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tt('Ara')} aria-label={tt('Ara')}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: theme.textPrimary, fontSize: 14 }} />
        </label>
        {groups.map((g) => (
          <section key={g.id}>
            <h2 style={{ color: theme.textSecondary, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>{g.emoji} {tt(g.title)}</h2>
            <div className="grid grid-cols-2 gap-3">
              {g.items.map((f) => (
                <button key={f.id} onClick={() => navigate(f.route)} className="text-start"
                  style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 18, padding: 14, minHeight: 96 }}>
                  <div style={{ fontSize: 22 }}>{f.emoji}</div>
                  <div style={{ color: theme.textPrimary, fontSize: 14, fontWeight: 700, marginTop: 4 }}>{tt(f.title)}</div>
                  <div style={{ color: theme.textSecondary, fontSize: 11, lineHeight: 1.35 }}>{f.pending ? tt('Diyanet onay sürecinde') : tt(f.desc)}</div>
                </button>
              ))}
            </div>
          </section>
        ))}
        {groups.length === 0 && <p style={{ color: theme.textSecondary, fontSize: 14 }}>{tt('Sonuç bulunamadı.')}</p>}
      </div>
    </div>
  );
}
