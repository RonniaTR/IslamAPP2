import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Share2, RotateCcw, Star } from 'lucide-react';
import { shareOrCopy } from '../../hooks/useShared';
import Confetti from './Confetti';
import { useTx } from '../../i18n';

/**
 * OYNAMA SONUCU — premium bitiş ekranı (referans birebir):
 * yıldızlar, N/M doğru, +XP, +İlmi, istatistik kutuları,
 * Sonuçları Paylaş / Tekrar Oyna / Yanlışları Tekrar Çöz.
 */
// Sayı animasyonu: 0'dan hedefe yumuşak sayım (juice)
function useCountUp(target, dur = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return val;
}

export default function ResultScreen({
  title, correct, total, xp, stats = [], wrongCount = 0,
  onReplay, onReplayWrongs, theme,
}) {
  const tt = useTx();
  const pctRight = total > 0 ? correct / total : 0;
  const starCount = pctRight >= 0.9 ? 5 : pctRight >= 0.75 ? 4 : pctRight >= 0.55 ? 3 : pctRight >= 0.35 ? 2 : pctRight > 0 ? 1 : 0;
  const animCorrect = useCountUp(correct, 800);
  const animXp = useCountUp(xp, 1100);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
      className="relative px-5 w-full max-w-md mx-auto text-center overflow-hidden pb-6">
      {starCount >= 3 && <Confetti count={32} />}

      {/* Kupa + yıldızlar */}
      <motion.div initial={{ y: -16, scale: 0.7 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
        className="w-20 h-20 mx-auto mt-2 mb-3 rounded-3xl flex items-center justify-center"
        style={{ background: `${theme.gold}18`, border: `2px solid ${theme.gold}50`, boxShadow: `0 8px 40px ${theme.gold}30` }}>
        <Trophy size={38} style={{ color: theme.gold }} />
      </motion.div>
      <div className="flex justify-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.25 + i * 0.12, type: 'spring', bounce: 0.6 }}>
            <Star size={22} fill={i < starCount ? theme.gold : 'transparent'} style={{ color: i < starCount ? theme.gold : `${theme.textSecondary}50` }} />
          </motion.span>
        ))}
      </div>
      <h2 className="text-xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Tebrikler!</h2>
      <p className="text-[10px] mb-4" style={{ color: theme.textSecondary }}>{title} tamamlandı</p>

      {/* Skor paneli */}
      <div className="rounded-2xl p-5 mb-3" style={{ background: `linear-gradient(160deg, ${theme.gold}14, ${theme.surface})`, border: `1.5px solid ${theme.gold}35` }}>
        <p className="text-4xl font-black tabular-nums" style={{ color: theme.gold }}>
          {animCorrect} <span className="text-lg" style={{ color: theme.textSecondary }}>/ {total}</span>
        </p>
        <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: theme.textSecondary }}>{tt('Doğru Cevap')}</p>
        <div className="flex justify-center gap-2">
          <span className="text-xs font-black px-3 py-1.5 rounded-full tabular-nums" style={{ background: `${theme.gold}18`, color: theme.gold }}>⚡ +{animXp} XP</span>
          <span className="text-xs font-black px-3 py-1.5 rounded-full tabular-nums" style={{ background: '#10B98118', color: '#10B981' }}>💎 +{animCorrect} İlmi</span>
        </div>
      </div>

      {/* İstatistik kutuları */}
      {stats.length > 0 && (
        <div className={`grid grid-cols-${Math.min(stats.length, 3)} gap-2 mb-4`} style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)` }}>
          {stats.map((s, i) => (
            <div key={i} className="rounded-xl py-2.5 px-1" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <p className="text-base font-black tabular-nums" style={{ color: theme.textPrimary }}>{s.val}</p>
              <p className="text-[8px] uppercase tracking-wide mt-0.5" style={{ color: theme.textSecondary }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Aksiyonlar */}
      <div className="space-y-2.5">
        <button onClick={() => shareOrCopy('İslami Bilgi Yarışması', `${title}: ${correct}/${total} doğru, +${xp} XP kazandım! Sen de dene 🏆`)}
          className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{ background: '#10B981', color: '#fff' }}>
          <Share2 size={15} /> {tt('Sonuçları Paylaş')}
        </button>
        <div className="flex gap-2.5">
          <button onClick={onReplay}
            className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{ background: `${theme.gold}16`, border: `1px solid ${theme.gold}40`, color: theme.gold }}>
            <RefreshCw size={14} /> Tekrar Oyna
          </button>
          {wrongCount > 0 && onReplayWrongs && (
            <button onClick={onReplayWrongs}
              className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ background: '#EF444414', border: '1px solid #EF444440', color: '#F87171' }}>
              <RotateCcw size={14} /> Yanlışları Çöz ({wrongCount})
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
