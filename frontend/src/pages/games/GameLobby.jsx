import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Crown, Medal } from 'lucide-react';

/**
 * MOD SEÇİM EKRANI (lobi) — referans tasarım birebir:
 * parlayan amblem, açıklama, En İyi/Son/Oynama istatistikleri,
 * Kazanılacak Ödüller, mini liderlik, "Oyuna Başla".
 */
export default function GameLobby({ game, meta = {}, leaderboard = [], theme, onStart }) {
  const stats = [
    { label: 'En İyi Skorun', val: meta.best || 0 },
    { label: 'Son Skorun', val: meta.last || 0 },
    { label: 'Oynama Sayısı', val: meta.plays || 0 },
  ];
  const rewards = game.rewards || [
    { icon: '⚡', label: `${game.xpHint || '100+'} XP` },
    { icon: '💎', label: 'İlmi Puanı' },
    { icon: '🏅', label: game.badge || `${game.title} Ustası` },
  ];

  return (
    <div className="px-5 w-full max-w-md mx-auto">
      {/* Amblem + başlık */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 text-center relative overflow-hidden mb-4"
        style={{ background: `linear-gradient(170deg, ${game.color}18, ${theme.surface})`, border: `1.5px solid ${game.color}45` }}>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${game.color}30, transparent 65%)` }} />
        <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl block mb-3 relative" style={{ filter: `drop-shadow(0 6px 18px ${game.color}80)` }}>
          {game.emoji}
        </motion.span>
        <h2 className="text-2xl font-black relative" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{game.title}</h2>
        <p className="text-xs mt-1.5 relative max-w-[260px] mx-auto" style={{ color: theme.textSecondary }}>{game.desc}</p>

        {/* İstatistik şeridi */}
        <div className="grid grid-cols-3 gap-2 mt-5 relative">
          {stats.map((s, i) => (
            <div key={i} className="rounded-xl py-2.5 px-1" style={{ background: `${theme.bg}80`, border: `1px solid ${theme.cardBorder}` }}>
              <p className="text-lg font-black tabular-nums" style={{ color: theme.textPrimary }}>{s.val.toLocaleString('tr-TR')}</p>
              <p className="text-[8px] uppercase tracking-wide mt-0.5" style={{ color: theme.textSecondary }}>{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Kazanılacak Ödüller */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="rounded-2xl p-4 mb-4" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
        <p className="text-xs font-black mb-3" style={{ color: theme.textPrimary }}>Kazanılacak Ödüller</p>
        <div className="grid grid-cols-3 gap-2">
          {rewards.map((r, i) => (
            <div key={i} className="rounded-xl py-3 px-1 text-center" style={{ background: `${game.color}0c`, border: `1px solid ${game.color}30` }}>
              <span className="text-xl block mb-1">{r.icon}</span>
              <p className="text-[9px] font-bold" style={{ color: theme.textSecondary }}>{r.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Mini liderlik */}
      {leaderboard.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-4 mb-5" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <p className="text-xs font-black mb-2.5 flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
            <Trophy size={13} style={{ color: theme.gold }} /> Liderlik Tablosu
          </p>
          <div className="space-y-1.5">
            {leaderboard.slice(0, 3).map((e, i) => (
              <div key={e.user_id || i} className="flex items-center gap-2.5">
                {i === 0 ? <Crown size={14} style={{ color: theme.gold }} /> : <Medal size={14} style={{ color: i === 1 ? '#C0C0C0' : '#CD7F32' }} />}
                <span className="flex-1 text-xs font-bold truncate" style={{ color: theme.textPrimary }}>{e.username || 'Anonim'}</span>
                <span className="text-xs font-black tabular-nums" style={{ color: theme.gold }}>{(e.total_points ?? e.points ?? 0).toLocaleString('tr-TR')}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Oyuna Başla */}
      <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
        onClick={onStart} whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 mb-3"
        style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', boxShadow: '0 8px 30px #10B98140' }}>
        <Play size={18} fill="#fff" /> Oyuna Başla
      </motion.button>
    </div>
  );
}
