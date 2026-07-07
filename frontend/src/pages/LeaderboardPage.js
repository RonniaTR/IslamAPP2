import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Sparkles, ArrowLeft, Loader2, Flame, Zap } from 'lucide-react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const TIER_ICONS = { bronze: '🥉', silver: '🥈', gold: '🥇', diamond: '💎', legend: '👑' };

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leagueInfo, setLeagueInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'myStats'

  const currentUserId = user?.user_id || user?.id || localStorage.getItem('islamapp_guest_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lbRes, leagueRes] = await Promise.allSettled([
          api.get('/gamification/leaderboard?limit=20').catch(() => api.get('/quiz/leaderboard')),
          currentUserId ? api.get(`/league/overview/${currentUserId}`) : Promise.resolve(null),
        ]);
        if (lbRes.status === 'fulfilled') setList(lbRes.value?.data || []);
        if (leagueRes.status === 'fulfilled' && leagueRes.value?.data) setLeagueInfo(leagueRes.value.data);
      } catch (e) {
        console.error("Veri çekilemedi:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: theme.bg }}>
        <Loader2 size={48} className="animate-spin mb-4" style={{ color: theme.gold }} />
        <h2 className="text-xl font-black tracking-widest animate-pulse" style={{ color: theme.gold }}>LİG YÜKLENİYOR...</h2>
      </div>
    );
  }

  const top3 = list.slice(0, 3);
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ ...top3[1], podiumRank: 2 });
  if (top3[0]) podiumOrder.push({ ...top3[0], podiumRank: 1 });
  if (top3[2]) podiumOrder.push({ ...top3[2], podiumRank: 3 });
  const restOfList = list.slice(3, 20);

  const tier = leagueInfo?.tier;
  const nextTier = leagueInfo?.next_tier;

  return (
    <div className="min-h-screen font-sans pb-28 relative overflow-hidden" style={{ background: theme.bg }}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: `${theme.gold}15` }} />

      {/* Header */}
      <div className="relative z-10 p-5 pt-8">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-2xl transition-colors"
            style={{ background: `${theme.textSecondary}10`, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary }}>
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black tracking-widest uppercase flex items-center gap-2 justify-center" style={{ color: theme.gold }}>
              <Trophy size={22} /> Şeref Tablosu
            </h1>
            <p className="text-[10px] font-bold tracking-widest mt-0.5" style={{ color: theme.textSecondary }}>GLOBAL İLİM LİGİ</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Tier Badge Card */}
        {tier && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-4 mb-2 relative overflow-hidden"
            style={{ background: theme.cardBg, border: `1px solid ${tier.color}30`, boxShadow: `0 4px 20px ${tier.color}15` }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: tier.color, transform: 'translate(30%, -30%)', filter: 'blur(20px)' }} />
            <div className="flex items-center gap-4">
              <div className="text-4xl">{tier.icon}</div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: tier.color }}>{tier.name} Lig</p>
                <p className="text-lg font-black" style={{ color: theme.textPrimary }}>{leagueInfo.total_xp} XP</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px]" style={{ color: theme.gold }}>
                    <Flame size={10} /> {leagueInfo.streak} gün seri
                  </span>
                  <span className="flex items-center gap-1 text-[10px]" style={{ color: theme.textSecondary }}>
                    <Zap size={10} /> Haftalık {leagueInfo.weekly_xp} XP
                  </span>
                </div>
              </div>
            </div>
            {nextTier && (
              <div className="mt-3">
                <div className="flex justify-between text-[9px] mb-1">
                  <span style={{ color: theme.textSecondary }}>{tier.name}</span>
                  <span style={{ color: nextTier.color }}>{nextTier.icon} {nextTier.name} — {leagueInfo.xp_to_next} XP kaldı</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: `${theme.textSecondary}15` }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${leagueInfo.tier_progress * 100}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})` }} />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        {/* Empty State */}
        {list.length === 0 ? (
          <div className="text-center py-20 rounded-[32px] backdrop-blur-xl mt-6"
            style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <Sparkles size={64} className="mx-auto mb-6" style={{ color: `${theme.gold}30` }} />
            <h2 className="text-2xl font-black mb-2" style={{ color: theme.textPrimary }}>Lig Henüz Boş</h2>
            <p style={{ color: theme.textSecondary }}>İlk quizi çöz ve zirveye adını altın harflerle yazdır!</p>
            <button onClick={() => navigate('/quiz')} className="mt-8 px-8 py-4 rounded-2xl font-black shadow-lg"
              style={{ background: theme.gold, color: theme.bg }}>Hemen Başla</button>
          </div>
        ) : (
          <>
            {/* Podium */}
            <div className="flex justify-center items-end gap-3 md:gap-6 h-64 mt-6 mb-10">
              {podiumOrder.map((entry, index) => {
                const isMe = entry.user_id === currentUserId;
                const isFirst = entry.podiumRank === 1;
                const isSecond = entry.podiumRank === 2;

                const height = isFirst ? 'h-48' : isSecond ? 'h-36' : 'h-28';
                const gradientColors = isFirst
                  ? `${theme.gold}, #d4af37`
                  : isSecond ? '#C0C0C0, #808080' : '#CD7F32, #8B4513';
                const shadow = isFirst ? `0 0 40px ${theme.gold}50` : '';

                return (
                  <motion.div key={entry.user_id} initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, type: "spring", bounce: 0.5 }} className="flex flex-col items-center relative w-28 md:w-32">
                    {isFirst
                      ? <Crown size={40} className="mb-3 animate-bounce" style={{ color: theme.gold, filter: `drop-shadow(0 0 15px ${theme.gold}80)` }} />
                      : <Medal size={28} className="mb-3" style={{ color: isSecond ? '#C0C0C0' : '#CD7F32' }} />}

                    <div className="text-center w-full absolute -top-14">
                      <p className={`text-sm font-black truncate px-1`} style={{ color: isMe ? theme.textPrimary : theme.textPrimary }}>{entry.username || 'Anonim'}</p>
                      <p className="text-xs font-bold rounded-full px-2 py-0.5 inline-block mt-1"
                        style={{ background: `${theme.bg}90`, color: theme.textSecondary, border: `1px solid ${theme.cardBorder}` }}>{entry.total_points} XP</p>
                    </div>

                    <div className={`w-full ${height} rounded-t-3xl border-t-4 opacity-95 relative flex justify-center pt-4`}
                      style={{ background: `linear-gradient(to top, ${gradientColors})`, borderColor: gradientColors.split(',')[0], boxShadow: shadow }}>
                      <span className="text-4xl font-black" style={{ color: `${theme.bg}80` }}>{entry.podiumRank}</span>
                      {isMe && <div className="absolute -bottom-3 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-xl"
                        style={{ background: theme.textPrimary, color: theme.bg }}>Sen</div>}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Rest of Leaderboard */}
            <div className="rounded-[32px] p-4 md:p-6 shadow-2xl"
              style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, backdropFilter: 'blur(20px)' }}>
              <div className="flex items-center gap-3 mb-5 px-2">
                <TrendingUp size={20} style={{ color: theme.gold }} />
                <h3 className="text-base font-black uppercase tracking-widest" style={{ color: theme.textPrimary }}>Genel Sıralama</h3>
              </div>

              <div className="space-y-2.5">
                {restOfList.map((entry, i) => {
                  const actualRank = i + 4;
                  const isMe = entry.user_id === currentUserId;

                  return (
                    <motion.div key={entry.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i * 0.04) }}
                      className="flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300"
                      style={{
                        background: isMe ? `linear-gradient(135deg, ${theme.gold}15, transparent)` : `${theme.bg}50`,
                        border: `1px solid ${isMe ? `${theme.gold}40` : theme.cardBorder}`,
                        boxShadow: isMe ? `0 0 20px ${theme.gold}10` : 'none',
                        transform: isMe ? 'scale(1.02)' : 'none',
                      }}>
                      <div className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-black text-sm"
                        style={{ background: isMe ? theme.gold : `${theme.textSecondary}10`, color: isMe ? theme.bg : theme.textSecondary, border: `1px solid ${theme.cardBorder}` }}>
                        {actualRank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: isMe ? theme.gold : theme.textPrimary }}>
                          {entry.username || 'Anonim'}
                        </p>
                      </div>
                      <div className="text-right shrink-0 px-3 py-1.5 rounded-xl" style={{ background: `${theme.bg}50`, border: `1px solid ${theme.cardBorder}` }}>
                        <p className="text-base font-black" style={{ color: isMe ? theme.gold : theme.textPrimary }}>{entry.total_points}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.textSecondary }}>XP</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}