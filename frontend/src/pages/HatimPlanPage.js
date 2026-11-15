import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { localKey } from '../services/pathEngine';

// 🌙 ESNEK HATİM (docs/YENI_OZELLIKLER.md 8.6)
// Hedef tarih seçilir; günlük pay = kalan sayfa / kalan gün. Okunmayan gün sessizce ileriye dağılır.
// "Geride kaldın" yazısı yoktur. Okunan sayfa Mushaf'taki son sayfadan (mushaf_last_page) alınır.
const KEY = 'hatim_plan_v1';
const TOTAL = 604;
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* kota */ } };
const lastPage = () => { try { return Number(JSON.parse(localStorage.getItem('mushaf_last_page'))) || 1; } catch { return 1; } };
const plus = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return localKey(d); };

export default function HatimPlanPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [plan, setPlan] = useState(load);
  const [target, setTarget] = useState(plus(30));

  const start = (date) => { const p = { target: date, startPage: lastPage(), startedAt: localKey() }; setPlan(p); save(p); };
  const clear = () => { setPlan(null); try { localStorage.removeItem(KEY); } catch { /* ignore */ } };

  const page = lastPage();
  const remaining = Math.max(0, TOTAL - page + 1);
  const daysLeft = plan ? Math.max(1, Math.round((new Date(`${plan.target}T12:00:00`) - new Date(`${localKey()}T12:00:00`)) / 86400000) + 1) : 0;
  const perDay = plan ? Math.ceil(remaining / daysLeft) : 0;
  const pct = Math.round(((page - 1) / TOTAL) * 100);
  const done = page >= TOTAL;
  const card = { background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 22, padding: 18 };
  const btn = { minHeight: 46, borderRadius: 23, background: theme.gold, color: '#1A1A1A', fontWeight: 700, fontSize: 14, padding: '0 18px' };

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg }} data-testid="hatim-plan-page">
      <div className="flex items-center gap-2 px-4 pt-6 pb-3">
        <button onClick={() => navigate(-1)} aria-label={tt('Geri')}><ChevronLeft size={24} style={{ color: theme.textPrimary }} /></button>
        <h1 className="text-xl font-extrabold" style={{ color: theme.textPrimary }}>{tt('Esnek Hatim')}</h1>
      </div>
      <div className="px-4 max-w-xl mx-auto flex flex-col gap-4">
        {!plan ? (
          <div style={card} className="flex flex-col gap-3">
            <p style={{ color: theme.textPrimary, fontSize: 15, lineHeight: 1.5 }}>{tt('Hatmi ne zamana kadar tamamlamak istersin? Günlük payı biz hesaplarız; bir gün okuyamazsan pay kalan günlere dağılır.')}</p>
            <div className="flex flex-wrap gap-2">
              {[30, 60, 90].map((n) => (
                <button key={n} onClick={() => setTarget(plus(n))} style={{ minHeight: 38, padding: '0 14px', borderRadius: 19, fontSize: 13, border: `1px solid ${target === plus(n) ? theme.gold : theme.cardBorder}`, color: theme.textPrimary }}>{n} {tt('gün')}</button>
              ))}
            </div>
            <input type="date" value={target} min={plus(1)} onChange={(e) => setTarget(e.target.value)} aria-label={tt('Hedef tarih')}
              style={{ minHeight: 44, borderRadius: 14, padding: '0 12px', background: theme.inputBg, color: theme.textPrimary, border: `1px solid ${theme.inputBorder}`, fontSize: 14 }} />
            <button onClick={() => start(target)} style={btn}>{tt('Planı başlat')}</button>
          </div>
        ) : (
          <>
            <div style={card}>
              <p style={{ color: theme.textSecondary, fontSize: 12 }}>{done ? tt('Hatim tamamlandı') : tt('Bugünkü pay')}</p>
              <p style={{ color: theme.gold, fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>{done ? '🌙' : perDay}<span style={{ fontSize: 15, color: theme.textSecondary }}>{done ? '' : ` ${tt('sayfa')}`}</span></p>
              <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>
                {done ? tt('Allah kabul etsin.') : `${tt('Sayfa')} ${page} / ${TOTAL} · ${daysLeft} ${tt('gün kaldı')}`}
              </p>
              {/* 30 cüzlük iz: sayı değil, yol */}
              <div className="flex gap-[3px] mt-4" aria-hidden>
                {Array.from({ length: 30 }, (_, k) => <span key={k} style={{ flex: 1, height: 10, borderRadius: 3, background: k < Math.round((pct / 100) * 30) ? theme.gold : theme.surfaceLight }} />)}
              </div>
              {!done && perDay > 20 && <p style={{ color: theme.textSecondary, fontSize: 12, marginTop: 10 }}>{tt('Günlük pay yüksek görünüyor. İstersen tarihi biraz uzatabilirsin.')}</p>}
            </div>
            <button onClick={() => navigate(`/mushaf/${page}`)} style={btn}>{tt('Kaldığım yerden oku')}</button>
            <button onClick={clear} style={{ color: theme.textSecondary, fontSize: 13 }}>{tt('Planı değiştir')}</button>
          </>
        )}
      </div>
    </div>
  );
}
