import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { playGate } from '../../services/donusAudio';
import sfx from '../../services/sfx';
import { GECE, KemerliKapi, NurZerreleri, reducedMotion } from './giriSahne';

// 🔁 MOD GEÇİŞİ — Yetişkin ↔ Çocuk değişirken kısa bir kapı sahnesi (~1,4 sn).
// Çocuğa geçiş: güneşli gökyüzünde bahçe kapısı açılır. Yetişkine geçiş: gece, mihrap kapısı ve ney.
export default function ModGecisi({ to = 'child', onDone }) {
  const kids = to === 'child';
  const quick = reducedMotion();
  useEffect(() => {
    try { if (kids) sfx.levelUp(); else playGate('kapi'); } catch { /* ses yok */ }
    const t = setTimeout(onDone, quick ? 250 : 1500);
    return () => clearTimeout(t);
  }, [kids, onDone, quick]);

  return createPortal(
    <motion.div data-testid="mod-gecisi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: kids ? 'linear-gradient(180deg, #BDE6FF 0%, #F4FBEF 100%)' : GECE.bg }}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: quick ? 1 : 2.4 }} transition={{ duration: 1.3, delay: 0.35, ease: [0.55, 0, 0.3, 1] }}
        style={{ width: 'min(52vw, 230px)', aspectRatio: '0.72' }}>
        <KemerliKapi open tone={kids ? 'bahce' : 'mihrap'} duration={quick ? 0.15 : 1.0} />
      </motion.div>
      <NurZerreleri active={!quick} count={16} color={kids ? '#FFFFFF' : '#FFF1C4'} />
      <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, background: kids ? '#F4FBEF' : 'radial-gradient(circle, #FFF8E4 0%, #E6CB86 100%)' }} />
    </motion.div>,
    document.body,
  );
}
