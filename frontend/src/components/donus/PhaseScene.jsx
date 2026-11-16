// frontend/src/components/donus/PhaseScene.jsx
// 🎭 EVRE GEÇİŞ SAHNESİ — bir evre biter, diğeri başlarken tek ekranlık durak.
// Geride kalan evre teşekkürle uğurlanır, yenisi adıyla ve tek cümleyle tanıtılır; ardından eşik (kapı) açılır.
// Kutlama gürültüsü, konfeti, puan yoktur. Hareket azaltma tercihine uyar.
import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTx } from '../../i18n';
import { RETURN_PHASES } from '../../services/returnEngine';
import { PHASE_LIGHT } from './GateAnimation';

// Her evrenin kapanış cümlesi (özgün metin; ayet/hadis değildir).
const FAREWELL = {
  kapi: 'Kapıdan geçtin. En zor adım buydu.',
  temel: 'Temel atıldı. Üstüne ne konsa taşır.',
  bag: 'Bağ kuruldu. Dil alıştı, kalp tanıdı.',
  ahlak: 'Amel insana döndü. Bunu en çok yanındakiler görür.',
  kok: 'Kök tuttu.',
};

export default function PhaseScene({ fromId, toId, onDone }) {
  const tt = useTx();
  const reduce = useReducedMotion();
  const from = RETURN_PHASES.find((x) => x.id === fromId);
  const to = RETURN_PHASES.find((x) => x.id === toId);
  const light = PHASE_LIGHT[toId]?.light || '#D4AF37';
  useEffect(() => { const t = setTimeout(onDone, reduce ? 3500 : 7000); return () => clearTimeout(t); }, [onDone, reduce]);
  if (!to) return null;
  const step = (i) => (reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 + i * 1.1, duration: 0.9 } });

  return (
    <motion.div role="dialog" aria-label={tt('Evre geçişi')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center text-center px-8"
      style={{ zIndex: 60, background: `radial-gradient(circle at 50% 38%, ${light}26 0%, #05080A 62%)`, color: '#F2EBD9' }}>
      {from && (
        <motion.div {...step(0)}>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.6 }}>{from.emoji} {tt(from.name)} · {from.from}–{from.to}. {tt('gün')}</p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, marginTop: 10, lineHeight: 1.4 }}>{tt(FAREWELL[from.id] || '')}</p>
        </motion.div>
      )}
      <motion.div {...step(1)} aria-hidden style={{ width: 1, height: 56, background: `linear-gradient(${light}00, ${light}, ${light}00)`, margin: '26px 0' }} />
      <motion.div {...step(2)}>
        <p style={{ fontSize: 44 }} aria-hidden>{to.emoji}</p>
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: light, marginTop: 8 }}>{tt('Şimdi')}</p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 900, marginTop: 4 }}>{tt(to.name)}</p>
        <p style={{ fontSize: 14, opacity: 0.75, marginTop: 8, lineHeight: 1.5 }}>{tt(to.desc)}</p>
      </motion.div>
      <button onClick={onDone} style={{ position: 'absolute', bottom: 'max(28px, env(safe-area-inset-bottom))', minHeight: 44, padding: '0 22px', borderRadius: 22, border: `1px solid ${light}66`, color: '#F2EBD9', background: 'transparent', fontSize: 13, fontWeight: 700 }}>
        {tt('Devam')}
      </button>
    </motion.div>
  );
}
