import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { alpha } from '../../donus/palette';
import { SIR_PARCALARI, SIR_TAM } from '../../data/donusPerde';
import { useTx } from '../../i18n';

// 🔒 KIRKINCI SIR
//
// Kırk perdenin sonunda tek bir cümle var. Baştan gösterilmez.
// Her bölüm bittiğinde bir parçası açılır; kırkıncı günde tamamlanır.
//
// Bu bir oyun mekaniği değil, anlatının kendisi: tasavvufta "sonuna
// varmadan söylenmeyen söz" vardır. Kişi kırk gün boyunca eksik bir
// cümleyle yaşar; cümle tamamlandığında kırk günün ne anlattığını
// geriye dönük olarak anlar.
//
// Kapalı parçalar bulanık gösterilir — orada BİR ŞEY olduğu bellidir,
// ne olduğu belli değildir. Merak, zorlamadan çalışır.

export default function KirkinciSir({ p, day, compact = false }) {
  const tt = useTx();
  const acik = SIR_PARCALARI.filter(s => day >= s.gun);
  const tamam = day >= 40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-5 relative overflow-hidden"
      style={{
        background: tamam ? p.cardStrong : p.card,
        border: `1.5px solid ${tamam ? p.border : p.borderSoft}`,
        boxShadow: tamam ? p.shadow : 'none',
      }}>

      {/* Arka ışıma — açılan parça sayısınca güçlenir */}
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }}
        style={{
          background: `radial-gradient(ellipse at 50% 120%, ${alpha(p.accentGlow, 0.06 + acik.length * 0.05)}, transparent 70%)`,
        }} />

      <div className="flex items-center gap-2 mb-3 relative">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: p.accent }}>
          {tt('Kırkıncı Sır')}
        </span>
        <span className="text-[9px] font-black ml-auto tabular-nums" style={{ color: p.dim }}>
          {acik.length}/{SIR_PARCALARI.length + 1}
        </span>
      </div>

      {/* Cümle — parça parça açılır */}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 relative justify-center text-center">
        {SIR_PARCALARI.map((s, i) => {
          const open = day >= s.gun;
          return (
            <motion.span key={i}
              initial={false}
              animate={{ opacity: open ? 1 : 0.5 }}
              className="text-[17px] font-black"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: open ? p.text : p.dim,
                filter: open ? 'none' : 'blur(6px)',
                userSelect: open ? 'auto' : 'none',
                transition: 'filter 1.2s ease',
              }}>
              {s.metin}
            </motion.span>
          );
        })}
      </div>

      {!compact && (
        <p className="text-[10.5px] mt-4 text-center leading-relaxed relative" style={{ color: p.dim }}>
          {tamam
            ? SIR_TAM.aciklama
            : tt('Her bölüm bittiğinde bir parça açılır. Kırkıncı günde cümle tamamlanır.')}
        </p>
      )}

      {tamam ? (
        <p className="text-[9.5px] mt-3 text-center font-bold relative" style={{ color: p.accent }}>
          {SIR_TAM.kaynak}
        </p>
      ) : (
        <div className="flex items-center justify-center gap-1.5 mt-4 relative">
          <Lock size={11} style={{ color: p.dim }} />
          <span className="text-[10px] font-bold" style={{ color: p.dim }}>
            {tt('Sonraki parça')}: {tt('Gün')} {(SIR_PARCALARI.find(s => day < s.gun) || { gun: 40 }).gun}
          </span>
        </div>
      )}
    </motion.div>
  );
}
