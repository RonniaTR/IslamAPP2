import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { WORD_MEAL } from '../data/kelimeMeal';
import { localKey } from '../services/pathEngine';

// 🔤 KELİME KOÇU (tuval M5) — Kur'an ibarelerini aralıklı tekrarla öğren.
// Kaynak: data/kelimeMeal.js (özgün kelime-meal karşılıkları; kısa sureler + Âyetü'l-Kürsî).
// Tekrar aralığı ezber motoruyla aynı: 1 · 2 · 4 · 7 · 15 gün. Puan/XP yok.
// Not: tuvaldeki "kök" kartları için kök verisi gerekir; o veri gelene kadar ibare bazlı çalışır.
const KEY = 'kelime_kocu_v1';
const STEPS = [1, 2, 4, 7, 15];
const SESSION = 8;
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* kota */ } };
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return localKey(d); };

const ALL = (() => {
  const seen = new Set(); const out = [];
  Object.entries(WORD_MEAL).forEach(([s, ayahs]) => Object.entries(ayahs).forEach(([a, words]) => (words || []).forEach((w) => {
    if (!w || !w.ar || !w.tr || seen.has(w.ar)) return;
    seen.add(w.ar); out.push({ id: w.ar, ar: w.ar, tr: w.tr, q: w.q || '', ref: `${s}:${a}` });
  })));
  return out;
})();

export default function KelimePage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [state, setState] = useState(load);
  const [flipped, setFlipped] = useState(false);
  const [i, setI] = useState(0);

  // Oturum kuyruğu açılışta bir kez kurulur: önce günü gelen tekrarlar, sonra yeni ibareler.
  const queue = useMemo(() => {
    const today = localKey(); const st = load();
    const due = ALL.filter((w) => st[w.id] && st[w.id].due <= today);
    const fresh = ALL.filter((w) => !st[w.id]);
    return [...due, ...fresh].slice(0, SESSION);
  }, []);
  const known = Object.values(state).filter((s) => s.step >= 1).length;
  const w = queue[i];

  const grade = (ok) => {
    const cur = state[w.id] || { step: -1 };
    const step = ok ? Math.min(STEPS.length - 1, cur.step + 1) : 0;
    const next = { ...state, [w.id]: { step, due: addDays(ok ? STEPS[step] : 1) } };
    setState(next); save(next); setFlipped(false); setI(i + 1);
  };
  const lit = Math.round((known / Math.max(1, ALL.length)) * 10);

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg }} data-testid="kelime-page">
      <div className="flex items-center gap-2 px-4 pt-6 pb-3">
        <button onClick={() => navigate(-1)} aria-label={tt('Geri')}><ChevronLeft size={24} style={{ color: theme.textPrimary }} /></button>
        <h1 className="text-xl font-extrabold" style={{ color: theme.textPrimary }}>{tt('Kelime Koçu')}</h1>
      </div>
      <div className="px-4 max-w-xl mx-auto flex flex-col gap-4">
        <div style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 20, padding: 16 }}>
          <div className="flex justify-between items-baseline">
            <span style={{ color: theme.textSecondary, fontSize: 13 }}>{tt('Tanıdığın ibareler')}</span>
            <span style={{ color: theme.gold, fontSize: 26, fontWeight: 800 }}>{known}<span style={{ color: theme.textSecondary, fontSize: 13 }}> / {ALL.length}</span></span>
          </div>
          <div className="flex gap-1 items-end mt-2" style={{ height: 26 }} aria-hidden>
            {Array.from({ length: 10 }, (_, k) => <span key={k} style={{ flex: 1, height: 8 + k * 2, borderRadius: '3px 3px 0 0', background: k < lit ? theme.gold : theme.surfaceLight }} />)}
          </div>
        </div>
        {w ? (
          <>
            <button onClick={() => setFlipped(!flipped)} aria-label={tt('Kartı çevir')}
              style={{ minHeight: 240, borderRadius: 22, background: '#FBF8F0', color: '#1A1A1A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 }}>
              <span dir="rtl" lang="ar" style={{ fontFamily: "'Amiri', serif", fontSize: 44, lineHeight: 1.5 }}>{w.ar}</span>
              {flipped ? (
                <>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>{w.tr}</span>
                  {w.q && <span style={{ fontSize: 12, color: '#8A7A55' }}>{w.q}</span>}
                  <span style={{ fontSize: 11, color: '#8A7A55' }}>{w.ref}</span>
                </>
              ) : <span style={{ fontSize: 12, color: '#8A7A55' }}>{tt('Dokun, anlamını gör')}</span>}
            </button>
            {flipped && (
              <div className="flex gap-2">
                <button onClick={() => grade(false)} style={{ flex: 1, minHeight: 46, borderRadius: 23, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, fontSize: 14, fontWeight: 600 }}>{tt('Tekrar göster')}</button>
                <button onClick={() => grade(true)} style={{ flex: 1, minHeight: 46, borderRadius: 23, background: theme.gold, color: '#1A1A1A', fontSize: 14, fontWeight: 700 }}>{tt('Biliyorum')}</button>
              </div>
            )}
            <p className="text-center" style={{ color: theme.textMuted, fontSize: 12 }}>{i + 1} / {queue.length}</p>
          </>
        ) : (
          <div className="text-center py-10">
            <div style={{ fontSize: 40 }}>🌿</div>
            <p style={{ color: theme.textPrimary, fontSize: 16, fontWeight: 700, marginTop: 8 }}>{queue.length ? tt('Bugünlük bu kadar.') : tt('Bugün tekrar edilecek ibare yok.')}</p>
            <p style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>{tt('Yarın yeni ibareler ve tekrarlar seni bekliyor.')}</p>
          </div>
        )}
        <p className="text-center" style={{ color: theme.textMuted, fontSize: 11 }}>{tt('Tekrar aralığı: 1 · 2 · 4 · 7 · 15 gün. Karşılıklar uygulamaya özgüdür.')}</p>
      </div>
    </div>
  );
}
