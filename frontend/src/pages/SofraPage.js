import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shuffle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { STORIES, STORY_APPLY } from '../data/stories';

// 🍽️ AİLE SOFRASI (tuval M6) — akşam için 5 dakikalık sohbet kartı: Anlat · Sor · Yap.
// Kart uygulamadaki kıssalardan (data/stories.js) hazırlanır; yapay zekâ kullanılmaz, puan yoktur.
// Yaşa göre değişen şey sorulardır; hikâye aynıdır.
const AGES = [['kucuk', '4–6 yaş'], ['orta', '7–10 yaş'], ['buyuk', '11+ yaş']];
const dayIndex = () => Math.floor(Date.now() / 86400000) % STORIES.length;

export default function SofraPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [idx, setIdx] = useState(dayIndex);
  const [age, setAge] = useState('orta');
  const [open, setOpen] = useState(false);
  const s = STORIES[idx];

  const questions = {
    kucuk: ['Bu hikâyede en çok neyi sevdin?', 'Sen olsaydın ne yapardın?'],
    orta: [s.question, 'Bu hikâye sana kimi ya da neyi hatırlattı?'],
    buyuk: [s.question, 'Kendi hayatından buna benzer bir an anlat.'],
  }[age].filter(Boolean);
  const paragraphs = s.paragraphs || [];
  const shown = open ? paragraphs : paragraphs.slice(0, 2);
  const card = { background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 20, padding: 16 };
  const tag = { color: theme.gold, fontSize: 11, fontWeight: 700, letterSpacing: 0.4 };

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg }} data-testid="sofra-page">
      <div className="flex items-center justify-between px-4 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} aria-label={tt('Geri')}><ChevronLeft size={24} style={{ color: theme.textPrimary }} /></button>
          <div>
            <p style={tag}>{tt('BU AKŞAM SOFRADA · 5 DAKİKA')}</p>
            <h1 className="text-xl font-extrabold" style={{ color: theme.textPrimary }}>{s.emoji} {tt(s.title)}</h1>
          </div>
        </div>
        <button onClick={() => { setIdx((idx + 1) % STORIES.length); setOpen(false); }} aria-label={tt('Başka bir kart')} className="p-2"><Shuffle size={18} style={{ color: theme.textSecondary }} /></button>
      </div>
      <div className="px-4 max-w-xl mx-auto flex flex-col gap-3">
        <div className="flex gap-2">
          {AGES.map(([id, n]) => (
            <button key={id} onClick={() => setAge(id)} aria-pressed={age === id}
              style={{ flex: 1, minHeight: 38, borderRadius: 19, fontSize: 13, fontWeight: age === id ? 700 : 500, background: age === id ? theme.gold : 'transparent', color: age === id ? '#1A1A1A' : theme.textPrimary, border: `1px solid ${age === id ? theme.gold : theme.cardBorder}` }}>
              {tt(n)}
            </button>
          ))}
        </div>
        <section style={card}>
          <p style={tag}>1 · {tt('ANLAT')}</p>
          {shown.map((p, i) => <p key={i} style={{ color: theme.textPrimary, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>{p}</p>)}
          {paragraphs.length > 2 && (
            <button onClick={() => setOpen(!open)} style={{ color: theme.gold, fontSize: 13, fontWeight: 600, marginTop: 8 }}>{open ? tt('Kısalt') : tt('Devamını göster')}</button>
          )}
        </section>
        <section style={card}>
          <p style={tag}>2 · {tt('SOR')}</p>
          {questions.map((q) => <p key={q} style={{ color: theme.textPrimary, fontSize: 14, lineHeight: 1.5, marginTop: 8, paddingLeft: 12, borderLeft: `3px solid ${theme.gold}` }}>{tt(q)}</p>)}
        </section>
        {STORY_APPLY[s.id] && (
          <section style={{ ...card, background: theme.surfaceLight }}>
            <p style={tag}>3 · {tt('YAP')}</p>
            <p style={{ color: theme.textPrimary, fontSize: 14, lineHeight: 1.55, marginTop: 8 }}>{STORY_APPLY[s.id]}</p>
          </section>
        )}
        <p className="text-center" style={{ color: theme.textMuted, fontSize: 11 }}>{tt('Her gün yeni bir kart. Puan yok; amaç birlikte konuşmak.')}</p>
      </div>
    </div>
  );
}
