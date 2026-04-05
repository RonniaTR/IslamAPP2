import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Star, Award, BookOpen, MessageCircle, Clock, Target, Zap, Crown, Medal, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import api from '../api';

function getBadgeIcons(t) {
  return {
    'first_login': { icon: Star, label: t.badge_first_login || 'İlk Adım', desc: t.badge_first_login_desc || 'İlk girişini yaptın' },
    'quran_reader': { icon: BookOpen, label: t.badge_quran_reader || "Kur'an Okuyucu", desc: t.badge_quran_reader_desc || "10 sayfa Kur'an oku" },
    'hadith_scholar': { icon: Award, label: t.badge_hadith_scholar || 'Hadis Alimi', desc: t.badge_hadith_scholar_desc || '50 hadis oku' },
    'quiz_master': { icon: Trophy, label: t.badge_quiz_master || 'Quiz Ustası', desc: t.badge_quiz_master_desc || '10 quiz tamamla' },
    'streak_7': { icon: Flame, label: t.badge_streak_7 || '7 Gün Serisi', desc: t.badge_streak_7_desc || '7 gün üst üste aktif ol' },
    'streak_30': { icon: Crown, label: t.badge_streak_30 || '30 Gün Serisi', desc: t.badge_streak_30_desc || '30 gün üst üste aktif ol' },
    'pomodoro_10': { icon: Clock, label: t.badge_pomodoro || 'İlim Aşığı', desc: t.badge_pomodoro_desc || '10 pomodoro tamamla' },
    'chatter': { icon: MessageCircle, label: t.badge_chatter || 'Sohbetçi', desc: t.badge_chatter_desc || '50 AI sohbet yap' },
    'prayer_tracker': { icon: Target, label: t.badge_prayer || 'Namaz Takipçisi', desc: t.badge_prayer_desc || '7 gün namaz takip et' },
    'top_scorer': { icon: Medal, label: t.badge_top_scorer || 'Birinci', desc: t.badge_top_scorer_desc || 'Sıralamada 1. ol' },
  };
}

function getLevels(t) {
  return [
    { min: 0, name: t.level_1 || 'Mübtedi', icon: '🌱' },
    { min: 100, name: t.level_2 || 'Talebe', icon: '📖' },
    { min: 300, name: t.level_3 || 'Mürid', icon: '⭐' },
    { min: 600, name: t.level_4 || 'Arif', icon: '🌟' },
    { min: 1000, name: t.level_5 || 'Alim', icon: '🏆' },
    { min: 2000, name: t.level_6 || 'Müçtehid', icon: '👑' },
    { min: 5000, name: t.level_7 || 'Hafız', icon: '💎' },
  ];
}

function getLevel(points, t) {
  const LEVELS = getLevels(t);
  let lvl = LEVELS[0];
  for (const l of LEVELS) {
    if (points >= l.min) lvl = l;
  }
  const idx = LEVELS.indexOf(lvl);
  const next = LEVELS[idx + 1];
  const progress = next ? ((points - lvl.min) / (next.min - lvl.min)) * 100 : 100;
  return { ...lvl, level: idx + 1, next, progress: Math.min(progress, 100), pointsToNext: next ? next.min - points : 0 };
}

/* ─── Islamic Geometric Background ─── */
function IslamicPatternBg({ theme }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" viewBox="0 0 400 200">
      <defs>
        <pattern id="profilePattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <polygon points="30,0 60,15 60,45 30,60 0,45 0,15" fill="none" stroke={theme.gold} strokeWidth="0.5" />
          <circle cx="30" cy="30" r="8" fill="none" stroke={theme.gold} strokeWidth="0.3" />
          <circle cx="30" cy="30" r="3" fill={theme.gold} opacity="0.3" />
        </pattern>
      </defs>
      <rect width="400" height="200" fill="url(#profilePattern)" />
    </svg>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLang();
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!user) return;
    const uid = user.user_id || user.id || 'guest';
    Promise.all([
      api.get(`/gamification/stats/${uid}`).catch(() => ({ data: { total_points: 0, current_streak: 0, longest_streak: 0, quran_pages_read: 0, hadith_read: 0, pomodoro_minutes: 0, badges: [], level: 1 } })),
      api.get('/gamification/badges').catch(() => ({ data: [] })),
      api.get('/gamification/leaderboard').catch(() => ({ data: [] })),
    ]).then(([s, b, l]) => {
      setStats(s.data);
      setBadges(b.data);
      setLeaderboard(Array.isArray(l.data) ? l.data : []);
    });
  }, [user]);

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: theme.gold, borderTopColor: 'transparent' }} />
    </div>
  );

  const lvl = getLevel(stats.total_points || 0, t);
  const tabs = [
    { id: 'overview', label: t.overview || 'Genel', icon: Star },
    { id: 'badges', label: t.badges || 'Rozetler', icon: Award },
    { id: 'leaderboard', label: t.leaderboard || 'Sıralama', icon: Trophy },
  ];

  return (
    <div className="min-h-screen pb-4 animate-fade-in" style={{ background: theme.bg }}>
      {/* Header - Enhanced Profile Card */}
      <div className="relative overflow-hidden px-4 pt-6 pb-8" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
        <IslamicPatternBg theme={theme} />
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15" style={{ background: `radial-gradient(circle, ${theme.gold}60, transparent)`, filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${theme.gold}40, transparent)`, filter: 'blur(30px)' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-4 relative z-10">
          <div className="relative">
            <div className="w-18 h-18 rounded-full flex items-center justify-center text-3xl border-2 shadow-lg"
              style={{ borderColor: theme.gold, background: `linear-gradient(135deg, ${theme.cardBg}, ${theme.surface})`, width: '4.5rem', height: '4.5rem' }}>
              {user?.picture ? <img src={user.picture} alt="" className="w-full h-full rounded-full object-cover" /> : lvl.icon}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: theme.gold, color: '#0A1F14' }}>
              {lvl.level}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
              {user?.name || t.user || 'Kullanıcı'}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-medium" style={{ color: theme.gold }}>{lvl.icon} {lvl.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${theme.gold}20`, color: theme.gold }}>
                {t.level || 'Seviye'} {lvl.level}
              </span>
            </div>
          </div>
        </motion.div>

        {/* XP Bar - Enhanced */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-2 relative z-10">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: theme.textSecondary }}>
            <span className="font-medium">{stats.total_points || 0} {t.xp || 'XP'}</span>
            <span>{lvl.next ? `${lvl.next.min} XP · ${lvl.pointsToNext} ${t.remaining || 'kaldı'}` : t.max_level || 'Maksimum seviye!'}</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: theme.inputBg }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${lvl.progress}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full relative"
              style={{ background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight || theme.gold}cc)` }}>
              <div className="absolute inset-0 rounded-full animate-pulse-gold opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${theme.gold}80, transparent)` }} />
            </motion.div>
          </div>
        </motion.div>

        {/* Streak + Stats Mini */}
        <div className="grid grid-cols-3 gap-3 mt-5 relative z-10">
          {[
            { icon: Flame, label: t.streak || 'Seri', value: `${stats.current_streak || 0} ${t.day_suffix || 'gün'}`, color: '#F97316', delay: 0.3 },
            { icon: BookOpen, label: t.quran || "Kur'an", value: `${stats.quran_pages_read || 0} ${t.quran_pages || 'sayfa'}`, color: '#10B981', delay: 0.4 },
            { icon: Zap, label: t.quiz || 'Quiz', value: `${stats.quizzes_played || user?.quizzes_played || 0}`, color: '#8B5CF6', delay: 0.5 },
          ].map(({ icon: Icon, label, value, color, delay }) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
              className="rounded-xl p-2.5 text-center backdrop-blur-sm"
              style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
              <Icon size={18} className="mx-auto mb-1" style={{ color }} />
              <div className="text-sm font-bold" style={{ color: theme.textPrimary }}>{value}</div>
              <div className="text-[10px]" style={{ color: theme.textSecondary }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mx-4 mt-4 p-1 rounded-xl" style={{ background: theme.inputBg }}>
        {tabs.map(tabItem => (
          <button key={tabItem.id} onClick={() => setTab(tabItem.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all relative"
            style={{ background: tab === tabItem.id ? theme.surface : 'transparent', color: tab === tabItem.id ? theme.gold : theme.textSecondary }}>
            <tabItem.icon size={14} /> {tabItem.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }} className="px-4 mt-4">
          {tab === 'overview' && <OverviewTab stats={stats} theme={theme} t={t} user={user} />}
          {tab === 'badges' && <BadgesTab stats={stats} badges={badges} theme={theme} t={t} />}
          {tab === 'leaderboard' && <LeaderboardTab leaderboard={leaderboard} theme={theme} user={user} t={t} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OverviewTab({ stats, theme, t, user }) {
  const statCards = [
    { icon: BookOpen, label: t.quran_pages_read || "Okunan Kur'an Sayfası", value: stats.quran_pages_read || 0, color: '#10B981' },
    { icon: Award, label: t.hadith_read_count || 'Okunan Hadis', value: stats.hadith_read || 0, color: '#3B82F6' },
    { icon: Clock, label: t.pomodoro_minutes || 'Pomodoro Dakikası', value: stats.pomodoro_minutes || 0, color: '#8B5CF6' },
    { icon: Flame, label: t.longest_streak || 'En Uzun Seri', value: `${stats.longest_streak || 0} ${t.day_suffix || 'gün'}`, color: '#F97316' },
    { icon: Target, label: t.total_points || 'Toplam Puan', value: stats.total_points || 0, color: '#D4AF37' },
    { icon: Trophy, label: t.earned_badges || 'Kazanılan Rozet', value: (stats.badges || []).length, color: '#EC4899' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: theme.textPrimary }}>
        <TrendingUp size={16} style={{ color: theme.gold }} /> {t.statistics || 'İstatistikler'}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-xl p-3 border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-lg font-bold" style={{ color: theme.textPrimary }}>{s.value}</div>
            <div className="text-[11px]" style={{ color: theme.textSecondary }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BadgesTab({ stats, badges, theme, t }) {
  const earnedBadges = stats.badges || [];
  const BADGE_ICONS = getBadgeIcons(t);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: theme.textPrimary }}>
        <Shield size={16} style={{ color: theme.gold }} /> {t.badges || 'Rozetler'} ({earnedBadges.length}/{Object.keys(BADGE_ICONS).length})
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(BADGE_ICONS).map(([key, badge], i) => {
          const earned = earnedBadges.includes(key);
          const Icon = badge.icon;
          return (
            <motion.div key={key} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className={`rounded-xl p-3 border text-center transition-all ${earned ? '' : 'opacity-40 grayscale'}`}
              style={{ background: earned ? `${theme.gold}10` : theme.cardBg, borderColor: earned ? `${theme.gold}40` : theme.cardBorder }}>
              <div className="relative w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ background: earned ? `${theme.gold}20` : theme.inputBg }}>
                <Icon size={24} style={{ color: earned ? theme.gold : theme.textSecondary }} />
                {earned && <div className="absolute inset-0 rounded-full animate-pulse-gold opacity-20" style={{ background: theme.gold }} />}
              </div>
              <div className="text-xs font-semibold" style={{ color: earned ? theme.gold : theme.textSecondary }}>{badge.label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: theme.textSecondary }}>{badge.desc}</div>
              {earned && <div className="text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: `${theme.gold}20`, color: theme.gold }}>✓ {t.earned || 'Kazanıldı'}</div>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderboardTab({ leaderboard, theme, user, t }) {
  const uid = user?.user_id || user?.id;
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: theme.textPrimary }}>
        <Crown size={16} style={{ color: theme.gold }} /> {t.best_players || 'En İyiler'}
      </h3>
      {leaderboard.length === 0 ? (
        <div className="text-center py-8 rounded-xl border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
          <Trophy size={32} className="mx-auto mb-2" style={{ color: theme.textSecondary }} />
          <p className="text-sm" style={{ color: theme.textSecondary }}>{t.no_leaderboard || 'Henüz sıralama oluşmadı'}</p>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{t.earn_points || 'Aktivitelerinle puan kazan!'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.slice(0, 20).map((entry, i) => {
            const isMe = entry.user_id === uid;
            const medals = ['🥇', '🥈', '🥉'];
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${isMe ? 'ring-1' : ''}`}
                style={{ background: isMe ? `${theme.gold}10` : theme.cardBg, borderColor: isMe ? theme.gold : theme.cardBorder, ringColor: theme.gold }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: i < 3 ? `${theme.gold}20` : theme.inputBg, color: i < 3 ? theme.gold : theme.textSecondary }}>
                  {i < 3 ? medals[i] : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: theme.textPrimary }}>
                    {entry.name || t.anonymous || 'Anonim'}{isMe ? ` (${t.you || 'Sen'})` : ''}
                  </div>
                  <div className="text-[11px]" style={{ color: theme.textSecondary }}>
                    {t.level || 'Seviye'} {getLevel(entry.total_points || 0, t).level}
                  </div>
                </div>
                <div className="text-sm font-bold" style={{ color: theme.gold }}>{entry.total_points || 0} {t.xp || 'XP'}</div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
