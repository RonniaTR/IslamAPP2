import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Star, Award, BookOpen, MessageCircle, Clock, Target, Zap, Crown, Medal, Shield, ChevronRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

const BADGE_ICONS = {
  'first_login': { icon: Star, label: 'İlk Adım', desc: 'İlk girişini yaptın' },
  'quran_reader': { icon: BookOpen, label: 'Kur\'an Okuyucu', desc: '10 sayfa Kur\'an oku' },
  'hadith_scholar': { icon: Award, label: 'Hadis Alimi', desc: '50 hadis oku' },
  'quiz_master': { icon: Trophy, label: 'Quiz Ustası', desc: '10 quiz tamamla' },
  'streak_7': { icon: Flame, label: '7 Gün Serisi', desc: '7 gün üst üste aktif ol' },
  'streak_30': { icon: Crown, label: '30 Gün Serisi', desc: '30 gün üst üste aktif ol' },
  'pomodoro_10': { icon: Clock, label: 'İlim Aşığı', desc: '10 pomodoro tamamla' },
  'chatter': { icon: MessageCircle, label: 'Sohbetçi', desc: '50 AI sohbet yap' },
  'prayer_tracker': { icon: Target, label: 'Namaz Takipçisi', desc: '7 gün namaz takip et' },
  'top_scorer': { icon: Medal, label: 'Birinci', desc: 'Sıralamada 1. ol' },
};

const LEVELS = [
  { min: 0, name: 'Mübtedi', icon: '🌱' },
  { min: 100, name: 'Talebe', icon: '📖' },
  { min: 300, name: 'Mürid', icon: '⭐' },
  { min: 600, name: 'Arif', icon: '🌟' },
  { min: 1000, name: 'Alim', icon: '🏆' },
  { min: 2000, name: 'Müçtehid', icon: '👑' },
  { min: 5000, name: 'Hafız', icon: '💎' },
];

function getLevel(points) {
  let lvl = LEVELS[0];
  for (const l of LEVELS) {
    if (points >= l.min) lvl = l;
  }
  const idx = LEVELS.indexOf(lvl);
  const next = LEVELS[idx + 1];
  const progress = next ? ((points - lvl.min) / (next.min - lvl.min)) * 100 : 100;
  return { ...lvl, level: idx + 1, next, progress: Math.min(progress, 100), pointsToNext: next ? next.min - points : 0 };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activities, setActivities] = useState([]);
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

  const lvl = getLevel(stats.total_points || 0);
  const tabs = [
    { id: 'overview', label: 'Genel', icon: Star },
    { id: 'badges', label: 'Rozetler', icon: Award },
    { id: 'leaderboard', label: 'Sıralama', icon: Trophy },
  ];

  return (
    <div className="min-h-screen pb-4" style={{ background: theme.bg }}>
      {/* Header - Profil Kartı */}
      <div className="relative overflow-hidden px-4 pt-6 pb-8" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: theme.gold, filter: 'blur(40px)' }} />
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2" style={{ borderColor: theme.gold, background: theme.cardBg }}>
            {user?.picture ? <img src={user.picture} alt="" className="w-full h-full rounded-full object-cover" /> : lvl.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{user?.name || 'Kullanıcı'}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-medium" style={{ color: theme.gold }}>{lvl.icon} {lvl.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${theme.gold}20`, color: theme.gold }}>Seviye {lvl.level}</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1" style={{ color: theme.textSecondary }}>
            <span>{stats.total_points || 0} XP</span>
            <span>{lvl.next ? `${lvl.next.min} XP'ye ${lvl.pointsToNext} kaldı` : 'Maksimum seviye!'}</span>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: theme.inputBg }}>
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${lvl.progress}%`, background: `linear-gradient(90deg, ${theme.gold}, ${theme.goldLight})` }} />
          </div>
        </div>

        {/* Streak + Stats Mini */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <StatMini icon={Flame} label="Seri" value={`${stats.current_streak || 0} gün`} color="#F97316" theme={theme} />
          <StatMini icon={BookOpen} label="Kur'an" value={`${stats.quran_pages_read || 0} sayfa`} color="#10B981" theme={theme} />
          <StatMini icon={Zap} label="Quiz" value={`${stats.quizzes_played || user?.quizzes_played || 0}`} color="#8B5CF6" theme={theme} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mx-4 mt-4 p-1 rounded-xl" style={{ background: theme.inputBg }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: tab === t.id ? theme.surface : 'transparent', color: tab === t.id ? theme.gold : theme.textSecondary }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-4">
        {tab === 'overview' && <OverviewTab stats={stats} theme={theme} user={user} />}
        {tab === 'badges' && <BadgesTab stats={stats} badges={badges} theme={theme} />}
        {tab === 'leaderboard' && <LeaderboardTab leaderboard={leaderboard} theme={theme} user={user} />}
      </div>
    </div>
  );
}

function StatMini({ icon: Icon, label, value, color, theme }) {
  return (
    <div className="rounded-xl p-2.5 text-center" style={{ background: `${color}15` }}>
      <Icon size={18} className="mx-auto mb-1" style={{ color }} />
      <div className="text-sm font-bold" style={{ color: theme.textPrimary }}>{value}</div>
      <div className="text-[10px]" style={{ color: theme.textSecondary }}>{label}</div>
    </div>
  );
}

function OverviewTab({ stats, theme, user }) {
  const statCards = [
    { icon: BookOpen, label: 'Okunan Kur\'an Sayfası', value: stats.quran_pages_read || 0, color: '#10B981' },
    { icon: Award, label: 'Okunan Hadis', value: stats.hadith_read || 0, color: '#3B82F6' },
    { icon: Clock, label: 'Pomodoro Dakikası', value: stats.pomodoro_minutes || 0, color: '#8B5CF6' },
    { icon: Flame, label: 'En Uzun Seri', value: `${stats.longest_streak || 0} gün`, color: '#F97316' },
    { icon: Target, label: 'Toplam Puan', value: stats.total_points || 0, color: '#D4AF37' },
    { icon: Trophy, label: 'Kazanılan Rozet', value: (stats.badges || []).length, color: '#EC4899' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: theme.textPrimary }}>
        <TrendingUp size={16} style={{ color: theme.gold }} /> İstatistikler
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((s, i) => (
          <div key={i} className="rounded-xl p-3 border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-lg font-bold" style={{ color: theme.textPrimary }}>{s.value}</div>
            <div className="text-[11px]" style={{ color: theme.textSecondary }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BadgesTab({ stats, badges, theme }) {
  const earnedBadges = stats.badges || [];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: theme.textPrimary }}>
        <Shield size={16} style={{ color: theme.gold }} /> Rozetler ({earnedBadges.length}/{Object.keys(BADGE_ICONS).length})
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(BADGE_ICONS).map(([key, badge]) => {
          const earned = earnedBadges.includes(key);
          const Icon = badge.icon;
          return (
            <div key={key} className={`rounded-xl p-3 border text-center transition-all ${earned ? '' : 'opacity-40 grayscale'}`}
              style={{ background: earned ? `${theme.gold}10` : theme.cardBg, borderColor: earned ? `${theme.gold}40` : theme.cardBorder }}>
              <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ background: earned ? `${theme.gold}20` : theme.inputBg }}>
                <Icon size={24} style={{ color: earned ? theme.gold : theme.textSecondary }} />
              </div>
              <div className="text-xs font-semibold" style={{ color: earned ? theme.gold : theme.textSecondary }}>{badge.label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: theme.textSecondary }}>{badge.desc}</div>
              {earned && <div className="text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: `${theme.gold}20`, color: theme.gold }}>✓ Kazanıldı</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderboardTab({ leaderboard, theme, user }) {
  const uid = user?.user_id || user?.id;
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: theme.textPrimary }}>
        <Crown size={16} style={{ color: theme.gold }} /> En İyiler
      </h3>
      {leaderboard.length === 0 ? (
        <div className="text-center py-8 rounded-xl border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
          <Trophy size={32} className="mx-auto mb-2" style={{ color: theme.textSecondary }} />
          <p className="text-sm" style={{ color: theme.textSecondary }}>Henüz sıralama oluşmadı</p>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>Aktivitelerinle puan kazan!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.slice(0, 20).map((entry, i) => {
            const isMe = entry.user_id === uid;
            const medals = ['🥇', '🥈', '🥉'];
            return (
              <div key={i} className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${isMe ? 'ring-1' : ''}`}
                style={{ background: isMe ? `${theme.gold}10` : theme.cardBg, borderColor: isMe ? theme.gold : theme.cardBorder, ringColor: theme.gold }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: i < 3 ? `${theme.gold}20` : theme.inputBg, color: i < 3 ? theme.gold : theme.textSecondary }}>
                  {i < 3 ? medals[i] : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: theme.textPrimary }}>{entry.name || 'Anonim'}{isMe ? ' (Sen)' : ''}</div>
                  <div className="text-[11px]" style={{ color: theme.textSecondary }}>Seviye {getLevel(entry.total_points || 0).level}</div>
                </div>
                <div className="text-sm font-bold" style={{ color: theme.gold }}>{entry.total_points || 0} XP</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
