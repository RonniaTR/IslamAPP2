import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { localKey } from '../services/pathEngine';

// 🚪 SESSİZ DAVET (docs/YENI_OZELLIKLER.md 7.1 boşluk 3)
// Uygulamaya 14 gün ve daha uzun süre girmemiş kişiye açılışta TEK bir kart: suçlama, sayı, "kaçırdın" yok.
// Kart bir kez gösterilir; kapatılınca ya da bir seçenek seçilince o ara için bir daha çıkmaz.
const LAST = 'app_last_open';
const GAP_DAYS = 14;

export default function SessizDavet() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const today = localKey();
    let last = null;
    try { last = localStorage.getItem(LAST); localStorage.setItem(LAST, today); } catch { /* ignore */ }
    if (!last || last === today) return;
    const gap = Math.round((new Date(`${today}T12:00:00`) - new Date(`${last}T12:00:00`)) / 86400000);
    if (gap >= GAP_DAYS) setShow(true);
  }, []);

  if (!show) return null;
  const btn = { flex: 1, minHeight: 44, borderRadius: 22, fontSize: 13, fontWeight: 700 };
  return (
    <div role="region" aria-label={tt('Hoş geldin')} data-testid="sessiz-davet"
      style={{ background: theme.surface, border: `1px solid ${theme.gold}`, borderRadius: 22, padding: 18 }}>
      <p style={{ color: theme.textPrimary, fontSize: 17, fontWeight: 800 }}>{tt('Hoş geldin.')}</p>
      <p style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 1.5, marginTop: 4 }}>{tt('Kapı hep açıktı. Kaldığın yerden mi devam edelim, yeni bir başlangıç mı?')}</p>
      <div className="flex gap-2 mt-4">
        <button onClick={() => setShow(false)} style={{ ...btn, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }}>{tt('Kaldığım yerden')}</button>
        <button onClick={() => navigate('/donus')} style={{ ...btn, background: theme.gold, color: '#1A1A1A' }}>{tt('Yeni bir başlangıç')}</button>
      </div>
    </div>
  );
}
