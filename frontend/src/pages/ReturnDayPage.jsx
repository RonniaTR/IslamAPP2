import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react';
import { useTx } from '../i18n';
import { useLang } from '../contexts/LangContext';
import {
  getReturnDay, getTodayLesson, getTodayPhase, isDayRead, markDayRead,
  isReturnMode, LAST_DAY,
} from '../services/returnEngine';
import { getDayContent, getPhase } from '../data/returnPath';

// 🕯️ GÜNÜN DERSİ — kırk günlük müfredatın tek sayfası.
//
// Rota: /yol/gun        → bugünün dersi
//       /yol/gun/:day   → geçmiş bir gün (yalnız açılmış günler)
//
// İleri günler kilitlidir: müfredat baştan okunacak bir kitap değil,
// gün gün yürünecek bir yoldur. Kilit bir ceza değil, bir tempo.

const NUR = {
  bg: 'linear-gradient(180deg, #03130B 0%, #06231A 40%, #0A3524 100%)',
  bgSolid: '#06231A',
  surface: 'rgba(13, 51, 36, 0.75)',
  gold: '#E8C56C',
  green: '#34D399',
  text: '#EAF5EE',
  dim: '#93B8A6',
  border: 'rgba(232, 197, 108, 0.2)',
  borderSoft: 'rgba(147, 184, 166, 0.15)',
};

export default function ReturnDayPage() {
  const navigate = useNavigate();
  const tt = useTx();
  const { lang } = useLang();
  const { day: dayParam } = useParams();
  const [, force] = useState(0);

  const today = getReturnDay();
  const maxOpen = Math.min(today, LAST_DAY);
  const requested = dayParam ? parseInt(dayParam, 10) : maxOpen;
  const locked = !Number.isFinite(requested) || requested > maxOpen;
  const day = locked ? maxOpen : Math.max(1, requested);

  const lesson = useMemo(
    () => (dayParam ? getDayContent(day, lang) : getTodayLesson(lang, day)),
    [day, lang, dayParam],
  );

  // Ders metni henüz Arapça'ya çevrilmedi; Arapça arayüzde İngilizce'ye düşer.
  // RTL sayfada LTR metin ters hizalanıp noktalama kayar — bu yüzden metin
  // bloklarını açıkça soldan sağa sabitliyoruz. (Arapça dua metni hariç.)
  const ltr = lang === 'ar';
  const textDir = ltr ? { dir: 'ltr', style: { textAlign: 'left' } } : {};
  const phase = useMemo(() => (dayParam ? getPhase(day) : getTodayPhase(day)), [day, dayParam]);
  const done = isDayRead(day);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = NUR.bgSolid;
    window.scrollTo(0, 0);
    return () => { document.body.style.background = prev; };
  }, [day]);

  const complete = useCallback(() => {
    markDayRead(day);
    force(x => x + 1);
  }, [day]);

  // Dönüş modunda olmayan biri buraya doğrudan gelirse yola geri gönder
  if (!isReturnMode()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center" style={{ background: NUR.bg }}>
        <span className="text-5xl mb-4">🕯️</span>
        <p className="text-sm font-black mb-2" style={{ color: NUR.text }}>
          {tt('Bu bölüm Geri Dönüş yoluna özeldir')}
        </p>
        <p className="text-[11px] mb-6" style={{ color: NUR.dim }}>
          {tt('Değerlendirmede "uzun süredir ara verdim" seçeneğini işaretlersen bu yol açılır.')}
        </p>
        <button onClick={() => navigate('/yol')} className="py-3 px-6 rounded-2xl text-sm font-black"
          style={{ background: NUR.gold, color: '#03130B' }}>
          {tt('Yola dön')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: NUR.bg }}>
      {/* ── Başlık ── */}
      <div className="px-5 pt-6 pb-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/yol')} className="p-2 -ml-2 rounded-xl active:scale-90" aria-label={tt('Geri')}>
            <ArrowLeft size={20} style={{ color: NUR.gold }} />
          </button>
          <span className="text-[9px] font-black uppercase tracking-[0.28em] px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(232,197,108,0.14)', color: NUR.gold }}>
            {phase.emoji} {tt(phase.name)}
          </span>
          <span className="text-[10px] font-black ml-auto tabular-nums" style={{ color: NUR.dim }}>
            {tt('Gün')} {day}/{LAST_DAY}
          </span>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <h1 className="text-2xl font-black leading-tight" dir={textDir.dir}
            style={{ fontFamily: 'Playfair Display, serif', color: NUR.text, ...(textDir.style || {}) }}>
            {lesson.title}
          </h1>
          <p className="text-[12px] mt-1.5 italic" dir={textDir.dir}
            style={{ color: NUR.gold, ...(textDir.style || {}) }}>{lesson.lead}</p>
        </motion.div>
      </div>

      <div className="px-5 max-w-2xl mx-auto space-y-4">
        {/* ── Okuma ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-2xl p-5 space-y-3.5" style={{ background: NUR.surface, border: `1px solid ${NUR.borderSoft}` }}>
          {lesson.reading.map((p, i) => (
            <p key={i} className="text-[13.5px] leading-[1.85]" dir={textDir.dir}
              style={{ color: `${NUR.text}e0`, ...(textDir.style || {}) }}>{p}</p>
          ))}
        </motion.div>

        {/* ── Ayet / hadis ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-5" style={{ background: 'linear-gradient(120deg, rgba(232,197,108,0.1), rgba(13,51,36,0.7))', border: `1.5px solid ${NUR.border}` }}>
          <p className="text-[9px] font-black uppercase tracking-[0.28em] mb-2.5" style={{ color: NUR.gold }}>
            {tt('Günün kaynağı')}
          </p>
          <p className="text-[14px] italic leading-[1.8]" dir={textDir.dir}
            style={{ fontFamily: 'Georgia, serif', color: NUR.text, ...(textDir.style || {}) }}>
            “{lesson.source.text}”
          </p>
          <p className="text-[10.5px] mt-2.5 font-bold" dir={textDir.dir}
            style={{ color: NUR.gold, ...(textDir.style || {}) }}>— {lesson.source.ref}</p>
        </motion.div>

        {/* ── Dua ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl p-5 text-center" style={{ background: NUR.surface, border: `1px solid ${NUR.border}` }}>
          <p className="text-[9px] font-black uppercase tracking-[0.28em] mb-3" style={{ color: NUR.gold }}>
            {tt('🤲 Günün Duası')}
          </p>
          <p dir="rtl" lang="ar" className="text-[21px] leading-[2.1]"
            style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", color: NUR.gold }}>
            {lesson.dua.ar}
          </p>
          <p className="text-[12.5px] italic mt-3 leading-relaxed" dir={textDir.dir}
            style={{ fontFamily: 'Georgia, serif', color: `${NUR.text}dd`, textAlign: 'center' }}>
            “{lesson.dua.tr}”
          </p>
          <p className="text-[9.5px] mt-2 font-bold" dir={textDir.dir}
            style={{ color: NUR.dim, textAlign: 'center' }}>— {lesson.dua.ref}</p>
        </motion.div>

        {/* ── Bugünün adımı ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-5" style={{ background: 'rgba(52,211,153,0.08)', border: `1.5px solid rgba(52,211,153,0.3)` }}>
          <p className="text-[9px] font-black uppercase tracking-[0.28em] mb-2" style={{ color: NUR.green }}>
            {tt('👣 Bugünün adımı')}
          </p>
          <p className="text-[15px] font-black" dir={textDir.dir}
            style={{ color: NUR.text, ...(textDir.style || {}) }}>{lesson.step.title}</p>
          <p className="text-[12.5px] mt-1.5 leading-relaxed" dir={textDir.dir}
            style={{ color: `${NUR.text}c0`, ...(textDir.style || {}) }}>{lesson.step.desc}</p>
        </motion.div>

        {/* ── Akşam sorusu ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl p-4 flex items-start gap-3" style={{ background: NUR.surface, border: `1px solid ${NUR.borderSoft}` }}>
          <span className="text-xl shrink-0">💭</span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: NUR.dim }}>
              {tt('Akşama bırak')}
            </p>
            <p className="text-[13px] font-bold mt-0.5 leading-snug" dir={textDir.dir}
              style={{ color: NUR.text, ...(textDir.style || {}) }}>{lesson.question}</p>
            <button onClick={() => navigate('/journal')} className="text-[10.5px] font-black mt-2 flex items-center gap-1"
              style={{ color: NUR.gold }}>
              {tt('Amel Defteri’ne yaz')} <ArrowRight size={11} />
            </button>
          </div>
        </motion.div>

        {/* ── Tamamla ── */}
        {done ? (
          <div className="rounded-2xl p-4 flex items-center justify-center gap-2"
            style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.35)' }}>
            <Check size={15} color={NUR.green} strokeWidth={3} />
            <span className="text-[12.5px] font-black" style={{ color: NUR.green }}>
              {tt('Bu ders tamamlandı')}
            </span>
          </div>
        ) : (
          <button onClick={complete}
            className="w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-97 transition-transform"
            style={{ background: `linear-gradient(135deg, ${NUR.gold}, #F3DDA6)`, color: '#03130B' }}>
            <Check size={16} strokeWidth={3} /> {tt('Dersi tamamladım')}
          </button>
        )}

        {/* ── Gün gezinmesi ── */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => navigate(`/yol/gun/${day - 1}`)}
            disabled={day <= 1}
            className="text-[11px] font-black flex items-center gap-1 py-2 px-3 rounded-xl disabled:opacity-30"
            style={{ color: NUR.dim }}>
            <ArrowLeft size={12} /> {tt('Önceki gün')}
          </button>
          {day < maxOpen ? (
            <button onClick={() => navigate(`/yol/gun/${day + 1}`)}
              className="text-[11px] font-black flex items-center gap-1 py-2 px-3 rounded-xl" style={{ color: NUR.gold }}>
              {tt('Sonraki gün')} <ArrowRight size={12} />
            </button>
          ) : (
            <span className="text-[10.5px] font-bold flex items-center gap-1 py-2 px-3" style={{ color: `${NUR.dim}90` }}>
              <Lock size={11} /> {day >= LAST_DAY ? tt('Yol tamamlandı') : tt('Yarın açılır')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
