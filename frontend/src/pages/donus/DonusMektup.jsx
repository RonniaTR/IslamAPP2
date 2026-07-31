import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Feather, Mail } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTx } from '../../i18n';
import { donusPalette, PHASE_COLORS, alpha } from '../../donus/palette';
import {
  getLetter, saveLetter, canOpenLetter, openLetter, letterAgeDays,
  getReturnDay, LAST_DAY,
} from '../../services/returnEngine';

// ✉️ EMANET — kendine mektup
//
// Birinci gün yazılır, kırkıncı gün açılır. Aradaki günlerde mühürlü durur;
// metin gösterilmez, yalnız kaç gün beklediği yazar.
//
// NEDEN: geri dönenin en zayıf anı, dönüşünün sebebini unuttuğu andır.
// O sebebi kendi cümleleriyle saklamak, kırk gün sonra karşısına çıkacak
// en güçlü hatırlatıcıdır. Mektup cihazdan çıkmaz; kimse okumaz.

const PROMPTS = [
  'Bugün neden buradasın?',
  'Kırk gün sonraki kendine ne söylemek istersin?',
  'Bir gün bırakmak istersen sana neyi hatırlatmalı?',
];

export default function DonusMektup() {
  const { theme } = useTheme();
  const tt = useTx();
  const navigate = useNavigate();
  const p = donusPalette(theme, PHASE_COLORS.kapi);

  const [letter, setLetter] = useState(() => getLetter());
  const [text, setText] = useState(() => getLetter()?.text || '');
  const [opening, setOpening] = useState(false);

  const day = getReturnDay();
  const canOpen = canOpenLetter();
  const sealed = !!letter?.text?.trim() && !letter.openedAt;
  const opened = !!letter?.openedAt;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const seal = useCallback(() => {
    if (!text.trim()) return;
    setLetter(saveLetter(text));
  }, [text]);

  const breakSeal = useCallback(() => {
    setOpening(true);
    setTimeout(() => { setLetter(openLetter()); setOpening(false); }, 1400);
  }, []);

  return (
    <div className="px-5 pt-4">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <button onClick={() => navigate('/donus')}
          className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-transform mb-4"
          style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }} aria-label={tt('Geri')}>
          <ArrowLeft size={15} style={{ color: p.accent }} />
        </button>

        <motion.span className="text-5xl block mb-3"
          animate={{ rotate: [0, -4, 4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 16px ${alpha(p.accentGlow, 0.55)})` }}>✉️</motion.span>

        <h1 className="text-[26px] font-black leading-tight"
          style={{ fontFamily: 'Playfair Display, serif', color: p.text }}>
          {tt('Emanet')}
        </h1>
        <p className="text-[12px] mt-1.5" style={{ color: p.accent }}>
          {tt('Kendine bir mektup bırak — kırkıncı gün açılsın')}
        </p>
      </motion.div>

      {/* ── YAZMA ── */}
      {!letter?.text?.trim() && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="rounded-3xl p-5" style={{ background: p.card, border: `1px solid ${p.borderSoft}` }}>
          <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: p.text, opacity: 0.88 }}>
            {tt('Bugün dönmeye karar verdin. Bir gün bu kararın sebebini hatırlamak isteyeceksin. Şimdi yaz, kırk gün sonra oku. Bu metin cihazından çıkmaz; kimse okumaz.')}
          </p>

          <div className="space-y-1.5 mb-4">
            {PROMPTS.map((q, i) => (
              <p key={i} className="text-[11px] flex items-start gap-2" style={{ color: p.dim }}>
                <span style={{ color: p.accent }}>·</span> {tt(q)}
              </p>
            ))}
          </div>

          <textarea
            value={text} onChange={(e) => setText(e.target.value)}
            rows={9} maxLength={2000}
            placeholder={tt('Buraya yaz...')}
            className="w-full rounded-2xl p-4 text-[13px] leading-relaxed outline-none resize-none"
            style={{
              background: p.isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${p.borderSoft}`, color: p.text,
              fontFamily: 'Georgia, serif',
            }} />

          <div className="flex items-center justify-between mt-2">
            <span className="text-[9.5px]" style={{ color: p.dim }}>{text.length}/2000</span>
            <button onClick={seal} disabled={!text.trim()}
              className="py-3 px-6 rounded-2xl text-[12.5px] font-black flex items-center gap-2 active:scale-97 disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accentGlow})`, color: p.onAccent }}>
              <Feather size={14} /> {tt('Mühürle')}
            </button>
          </div>
        </motion.div>
      )}

      {/* ── MÜHÜRLÜ ── */}
      {sealed && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 text-center relative overflow-hidden"
          style={{ background: p.cardStrong, border: `1.5px solid ${p.border}`, boxShadow: p.shadow }}>

          <AnimatePresence>
            {opening && (
              <motion.div className="absolute inset-0 z-10 flex items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ background: alpha(p.accentGlow, 0.25), backdropFilter: 'blur(2px)' }}>
                <motion.span className="text-5xl"
                  animate={{ scale: [1, 1.5, 0], rotate: [0, 15, -10] }} transition={{ duration: 1.3 }}>🕯️</motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.span className="text-5xl block mb-3"
            animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3.2, repeat: Infinity }}>🕯️</motion.span>

          <p className="text-[15px] font-black" style={{ fontFamily: 'Playfair Display, serif', color: p.text }}>
            {tt('Mektubun mühürlü')}
          </p>
          <p className="text-[11.5px] mt-2 leading-relaxed" style={{ color: p.dim }}>
            {letterAgeDays()} {tt('gündür bekliyor')} · {tt('Gün')} {Math.min(day, LAST_DAY)}/{LAST_DAY}
          </p>

          <div className="h-2 rounded-full mt-4 overflow-hidden" style={{ background: alpha(p.accent, 0.14) }}>
            <motion.div className="h-full rounded-full" initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (day / LAST_DAY) * 100)}%` }} transition={{ duration: 0.9 }}
              style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accentGlow})` }} />
          </div>

          {canOpen ? (
            <button onClick={breakSeal}
              className="w-full mt-5 py-4 rounded-2xl text-[13px] font-black flex items-center justify-center gap-2 active:scale-97"
              style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accentGlow})`, color: p.onAccent }}>
              <Mail size={15} /> {tt('Mührü aç')}
            </button>
          ) : (
            <div className="w-full mt-5 py-3.5 rounded-2xl flex items-center justify-center gap-2"
              style={{ background: alpha(p.accent, 0.08), border: `1px dashed ${p.border}` }}>
              <Lock size={13} style={{ color: p.dim }} />
              <span className="text-[11.5px] font-bold" style={{ color: p.dim }}>
                {tt('Kırkıncı günde açılacak')}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* ── AÇILMIŞ ── */}
      {opened && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6" style={{ background: p.card, border: `1.5px solid ${p.border}` }}>
          <p className="text-[9px] font-black uppercase tracking-[0.28em] mb-1" style={{ color: p.accent }}>
            {tt('Kırk gün önce yazdın')}
          </p>
          <p className="text-[10px] mb-4" style={{ color: p.dim }}>
            {new Date(letter.writtenAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-[14px] leading-[1.95] whitespace-pre-wrap"
            style={{ fontFamily: 'Georgia, serif', color: p.text }}>
            {letter.text}
          </p>
          <div className="mt-6 pt-4 text-center" style={{ borderTop: `1px solid ${p.borderSoft}` }}>
            <p className="text-[11.5px] italic" style={{ color: p.accent }}>
              {tt('O gün yazan sen, bugün okuyan sen. Aradaki kırk gün senin.')}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
