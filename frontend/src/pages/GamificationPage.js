import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Star, Target, ChevronRight, Crown, Gift, Users, Zap, Share2, Copy, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremium } from '../contexts/PremiumContext';
import { trackFeature } from '../services/analytics';
import api from '../api';

function ProgressRing({ progress, size = 60, stroke = 4, theme }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - progress * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${theme.gold}20`} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={theme.gold} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
    </svg>
  );
}

export default function GamificationPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { premium } = usePremium();
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('overview');
  const [referralCode, setReferralCode] = useState('');
  const [referralUses, setReferralUses] = useState(0);
  const [copied, setCopied] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemMsg, setRedeemMsg] = useState('');

  useEffect(() => {
    if (!user?.user_id) return;
    trackFeature('gamification', 'view');
    api.get(`/gamification/v2/stats/${user.user_id}`).then(r => setStats(r.data)).catch(() => {});
    api.get(`/social/referral/${user.user_id}`).then(r => {
      setReferralCode(r.data.code || '');
      setReferralUses(r.data.uses || 0);
    }).catch(() => {});
  }, [user]);

  const createReferral = async () => {
    try {
      const { data } = await api.post('/social/referral/create', { referrer_id: user.user_id });
      setReferralCode(data.code);
    } catch {}
  };

  const copyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const redeemReferral = async () => {
    if (!redeemCode.trim()) return;
    try {
      const { data } = await api.post('/social/referral/redeem', { user_id: user.user_id, referral_code: redeemCode.trim() });
      setRedeemMsg(data.message);
      setRedeemCode('');
      api.get(`/gamification/v2/stats/${user.user_id}`).then(r => setStats(r.data)).catch(() => {});
    } catch (e) {
      setRedeemMsg(e.response?.data?.detail || 'Hata oluştu');
    }
  };

  const shareAchievement = async (type, id) => {
    try {
      await api.post('/social/share', { user_id: user.user_id, achievement_type: type, achievement_id: id });
      const text = type === 'streak' ? `${stats.current_streak} günlük seri!` : type === 'level' ? `Seviye ${stats.level}!` : `${id} rozetini kazandım!`;
      if (navigator.share) {
        await navigator.share({ title: 'İslam APP Başarım', text: `İslam APP'te ${text} 🏆`, url: 'https://islamapp-5942a.web.app' });
      }
    } catch {}
  };

  const questProgress = async (questId) => {
    try {
      const { data } = await api.post('/gamification/v2/quest-progress', { user_id: user.user_id, quest_id: questId });
      if (stats) setStats({ ...stats, daily_quests: data.quests });
    } catch {}
  };

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: theme.gold, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Genel', icon: Zap },
    { id: 'badges', label: 'Rozetler', icon: Trophy },
    { id: 'quests', label: 'Görevler', icon: Target },
    { id: 'social', label: 'Sosyal', icon: Users },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: theme.bg }} data-testid="gamification">
      {/* Header */}
      <div className="px-5 pt-10 pb-5" style={{ background: `linear-gradient(180deg, ${theme.surface}80 0%, transparent 100%)` }}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <ProgressRing progress={stats.level_progress} theme={theme} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: theme.gold }}>{stats.level}</span>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>{user?.name || 'Kullanıcı'}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs" style={{ color: theme.gold }}>
                <Star size={12} /> {stats.total_xp} XP
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: '#EF4444' }}>
                <Flame size={12} /> {stats.current_streak} gün
              </span>
              {premium && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${theme.gold}20`, color: theme.gold }}>Premium</span>}
            </div>
            <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: `${theme.gold}20` }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${stats.level_progress * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }} className="h-full rounded-full" style={{ background: theme.gold }} />
            </div>
            <p className="text-[9px] mt-0.5" style={{ color: theme.textSecondary }}>{stats.total_xp} / {stats.next_level_xp} XP</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-1 mb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-medium transition-all"
            style={tab === t.id ? { background: theme.gold, color: '#fff' } : { background: theme.inputBg, color: theme.textSecondary }}>
            <t.icon size={12} /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {tab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-4 space-y-3">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Toplam XP', value: stats.total_xp, icon: '⭐' },
                { label: 'Haftalık XP', value: stats.weekly_xp, icon: '📈' },
                { label: 'Günlük Seri', value: `${stats.current_streak} gün`, icon: '🔥' },
                { label: 'En Uzun Seri', value: `${stats.longest_streak} gün`, icon: '🏆' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="p-3 rounded-xl text-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                  <span className="text-xl">{s.icon}</span>
                  <p className="text-lg font-bold mt-1" style={{ color: theme.textPrimary }}>{s.value}</p>
                  <p className="text-[9px]" style={{ color: theme.textSecondary }}>{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Streak Share */}
            {stats.current_streak >= 3 && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => shareAchievement('streak', String(stats.current_streak))}
                className="w-full p-3 rounded-xl flex items-center gap-3" style={{ background: `${theme.gold}15`, border: `1px solid ${theme.gold}30` }}>
                <Flame size={20} style={{ color: theme.gold }} />
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold" style={{ color: theme.gold }}>{stats.current_streak} Günlük Seri!</p>
                  <p className="text-[9px]" style={{ color: theme.textSecondary }}>Başarını paylaş</p>
                </div>
                <Share2 size={14} style={{ color: theme.gold }} />
              </motion.button>
            )}
          </motion.div>
        )}

        {tab === 'badges' && (
          <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-4">
            <div className="grid grid-cols-3 gap-2">
              {(stats.badges || []).map((badge, i) => (
                <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-xl text-center relative" style={{
                    background: badge.earned ? theme.cardBg : `${theme.textSecondary}10`,
                    border: `1px solid ${badge.earned ? theme.gold + '30' : theme.cardBorder}`,
                    opacity: badge.earned ? 1 : 0.5,
                  }}>
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-[10px] font-semibold mt-1" style={{ color: badge.earned ? theme.textPrimary : theme.textSecondary }}>{badge.name}</p>
                  <p className="text-[8px]" style={{ color: theme.textSecondary }}>{badge.desc}</p>
                  {badge.earned && (
                    <button onClick={() => shareAchievement('badge', badge.id)} className="absolute top-1 right-1 p-0.5">
                      <Share2 size={8} style={{ color: theme.gold }} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'quests' && (
          <motion.div key="quests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-4 space-y-2">
            <p className="text-xs font-semibold mb-2" style={{ color: theme.gold, fontFamily: 'Playfair Display, serif' }}>Günlük Görevler</p>
            {(stats.daily_quests || []).map((q, i) => (
              <motion.div key={q.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl" style={{ background: q.completed ? `${theme.gold}15` : theme.cardBg, border: `1px solid ${q.completed ? theme.gold + '30' : theme.cardBorder}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: q.completed ? theme.gold : `${theme.gold}20` }}>
                  {q.completed ? <Check size={14} className="text-white" /> : <Target size={14} style={{ color: theme.gold }} />}
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${q.completed ? 'line-through' : ''}`} style={{ color: q.completed ? theme.gold : theme.textPrimary }}>{q.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1 rounded-full" style={{ background: `${theme.gold}20` }}>
                      <div className="h-full rounded-full transition-all" style={{ background: theme.gold, width: `${Math.min(100, (q.progress / q.target) * 100)}%` }} />
                    </div>
                    <span className="text-[9px]" style={{ color: theme.textSecondary }}>{q.progress}/{q.target}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold" style={{ color: theme.gold }}>+{q.xp} XP</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === 'social' && (
          <motion.div key="social" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-4 space-y-4">
            {/* Referral Code */}
            <div className="p-4 rounded-2xl" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <div className="flex items-center gap-2 mb-3">
                <Gift size={18} style={{ color: theme.gold }} />
                <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>Arkadaş Davet</p>
              </div>
              <p className="text-[11px] mb-3" style={{ color: theme.textSecondary }}>Arkadaşlarını davet et, birlikte 100 XP kazanın!</p>
              {referralCode ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 rounded-lg text-sm font-mono" style={{ background: theme.inputBg, color: theme.textPrimary }}>{referralCode}</div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={copyCode}
                    className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: theme.gold }}>
                    {copied ? <Check size={16} className="text-white" /> : <Copy size={16} className="text-white" />}
                  </motion.button>
                </div>
              ) : (
                <motion.button whileTap={{ scale: 0.97 }} onClick={createReferral}
                  className="w-full py-2.5 rounded-xl text-xs font-medium text-white" style={{ background: theme.gold }}>
                  Davet Kodu Oluştur
                </motion.button>
              )}
              {referralUses > 0 && <p className="text-[10px] mt-2" style={{ color: theme.gold }}>{referralUses} kişi kodunu kullandı</p>}
            </div>

            {/* Redeem Code */}
            <div className="p-4 rounded-2xl" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <p className="text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>Kod Kullan</p>
              <div className="flex gap-2">
                <input value={redeemCode} onChange={e => setRedeemCode(e.target.value.toUpperCase())} placeholder="ISLAM..."
                  className="flex-1 px-3 py-2 rounded-lg text-xs bg-transparent" style={{ background: theme.inputBg, color: theme.textPrimary, border: `1px solid ${theme.inputBorder}` }} />
                <motion.button whileTap={{ scale: 0.9 }} onClick={redeemReferral}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-white" style={{ background: theme.gold }}>
                  Kullan
                </motion.button>
              </div>
              {redeemMsg && <p className="text-[10px] mt-2" style={{ color: theme.gold }}>{redeemMsg}</p>}
            </div>

            {/* Share Level */}
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => shareAchievement('level', String(stats.level))}
              className="w-full p-3 rounded-xl flex items-center gap-3" style={{ background: `${theme.gold}10`, border: `1px solid ${theme.gold}20` }}>
              <Star size={18} style={{ color: theme.gold }} />
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold" style={{ color: theme.textPrimary }}>Seviye {stats.level} başarını paylaş</p>
                <p className="text-[9px]" style={{ color: theme.textSecondary }}>Arkadaşlarını motive et</p>
              </div>
              <Share2 size={14} style={{ color: theme.gold }} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
