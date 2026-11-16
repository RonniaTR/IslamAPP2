// frontend/src/components/donus/YoldaKal.jsx
// 🌳 YOLDA KAL — 40. günden SONRASI (docs/YENI_OZELLIKLER.md 7.1 boşluk 5)
// Kırk gün bitince oda kapanmaz, sıklığı düşer: haftada tek ders. Dersler kırk günün içinden,
// her hafta bir evreden sırayla gelir (yeni içerik uydurulmaz). Sayaç, seri, "kaçırdın" yok.
// Kişi uzun süre uğramazsa suçlama yerine kaldığı evreden karşılanır.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { useTx } from '../../i18n';
import { useLang } from '../../contexts/LangContext';
import { getTodayLesson, getTodayPhase, RETURN_PHASES, LAST_DAY } from '../../services/returnEngine';

const KEY = 'donus_yolda_v1';
const WEEK = 7 * 86400000;
const load = () => { try { return { start: Date.now(), read: {}, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return { start: Date.now(), read: {} }; } };
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* kota */ } };

/** n. haftanın dersi: evreler sırayla döner, her evrenin içinde gün gün ilerlenir. */
export function weeklyDay(week) {
  const ph = RETURN_PHASES[week % RETURN_PHASES.length];
  const turn = Math.floor(week / RETURN_PHASES.length);
  const span = ph.to - ph.from + 1;
  return Math.min(LAST_DAY, ph.from + (turn % span));
}

export default function YoldaKal({ p }) {
  const tt = useTx();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [st, setSt] = useState(() => { const s = load(); save(s); return s; });
  const week = Math.max(0, Math.floor((Date.now() - st.start) / WEEK));
  const day = weeklyDay(week);
  const lesson = getTodayLesson(lang, day);
  const phase = getTodayPhase(day);
  const done = !!st.read[week];
  const lastWeek = Math.max(-1, ...Object.keys(st.read).map(Number));
  const away = week - lastWeek > 4 && lastWeek >= 0; // bir aydan uzun ara
  const total = Object.keys(st.read).length;

  const open = () => {
    const next = { ...st, read: { ...st.read, [week]: Date.now() } };
    setSt(next); save(next);
    navigate(`/donus/gun/${day}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-5 mb-4"
      style={{ background: p.cardStrong, border: `1.5px solid ${p.border}`, boxShadow: p.shadow }} data-testid="yolda-kal">
      <p className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: p.accent }}>🌳 {tt('Yolda kal')}</p>
      <p className="text-lg font-black mt-1.5" style={{ fontFamily: 'Playfair Display, serif', color: p.text }}>
        {away ? tt('Hoş geldin. Kaldığın yerden.') : tt('Bu haftanın dersi')}
      </p>
      <p className="text-[11.5px] mt-1.5 leading-relaxed" style={{ color: p.dim }}>
        {away
          ? tt('Ara vermek yoldan çıkmak değildir. Bu hafta tek ders yeter.')
          : tt('Kırk gün bitti; oda kapanmadı. Haftada tek ders, acele yok.')}
      </p>
      <button onClick={open} className="w-full mt-4 rounded-2xl p-4 flex items-center gap-3 text-start active:scale-[0.985] transition-transform"
        style={{ background: p.card, border: `1px solid ${p.borderSoft}`, minHeight: 56 }}>
        <span className="text-2xl" aria-hidden>{phase.emoji}</span>
        <span className="flex-1 min-w-0">
          <span className="block text-[9.5px] font-black uppercase tracking-widest" style={{ color: p.accent }}>{tt(phase.name)} · {tt('Gün')} {day}</span>
          <span className="block text-[13.5px] font-black truncate" style={{ color: p.text }}>{lesson?.title || tt('Dersi aç')}</span>
        </span>
        {done ? <Check size={18} style={{ color: p.accent }} /> : <ChevronRight size={18} style={{ color: p.dim }} />}
      </button>
      {total > 0 && (
        <p className="text-[10.5px] mt-3" style={{ color: p.dim }}>{total} {tt('hafta uğradın. Sayı bir hatırlatma, ölçü değil.')}</p>
      )}
    </motion.div>
  );
}
