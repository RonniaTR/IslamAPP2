import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Users, Award, BookMarked, Timer, BookOpen, Sparkles, TrendingUp, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

const FEATURES = [
  {
    id: 'multiplayer', path: '/multiplayer', icon: Users, color: '#6366F1',
    title: 'Çok Oyunculu Quiz', desc: 'Arkadaşlarınla yarış!',
    tag: 'Popüler', gradient: 'linear-gradient(135deg, #6366F120, #818CF808)',
  },
  {
    id: 'profile', path: '/profile', icon: Award, color: '#F59E0B',
    title: 'Profil & Rozetler', desc: 'Seviyeni gör, rozet kazan',
    tag: 'Yeni', gradient: 'linear-gradient(135deg, #F59E0B20, #FBBF2408)',
  },
  {
    id: 'comparative', path: '/comparative', icon: BookOpen, color: '#10B981',
    title: 'Karşılaştırmalı Dinler', desc: "Kur'an, İncil ve Tevrat",
    tag: 'AI Destekli', gradient: 'linear-gradient(135deg, #10B98120, #34D39908)',
  },
  {
    id: 'pomodoro', path: '/pomodoro', icon: Timer, color: '#EC4899',
    title: 'İlim Saati', desc: 'Odaklan, çalış, öğren',
    tag: null, gradient: 'linear-gradient(135deg, #EC489920, #F472B608)',
  },
  {
    id: 'bookmarks', path: '/bookmarks', icon: BookMarked, color: '#8B5CF6',
    title: 'Yer İmleri & Cüz', desc: "Kur'an okumayı takip et",
    tag: null, gradient: 'linear-gradient(135deg, #8B5CF620, #A78BFA08)',
  },
];

export default function DiscoverPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [dailyTip, setDailyTip] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      api.get(`/gamification/stats/${user.uid}`).then(r => setStats(r.data)).catch(() => {});
    }
    // Daily tip from AI
    const cached = sessionStorage.getItem('dailyTip');
    if (cached) { setDailyTip(cached); return; }
    api.post('/ai/chat', { message: 'Bana kısa (1-2 cümle) motivasyonel bir İslami tavsiye ver. Sadece tavsiyeyi yaz, başka bir şey yazma.', history: [] })
      .then(r => { const tip = r.data?.response || r.data?.reply; if (tip) { setDailyTip(tip); sessionStorage.setItem('dailyTip', tip); } })
      .catch(() => {});
  }, [user]);

  return (
    <div className="animate-fade-in pb-4">
      {/* Header */}
      <div className="px-5 pt-10 pb-2" style={{ background: `linear-gradient(180deg, ${theme.surface}88 0%, transparent 100%)` }}>
        <div className="flex items-center gap-2 mb-1">
          <Compass size={20} style={{ color: theme.gold }} />
          <h1 className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>Keşfet</h1>
        </div>
        <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>Yeni özellikler ve ilim yolculuğun</p>
      </div>

      <div className="px-5 space-y-4">
        {/* Quick Stats Bar */}
        {stats && (
          <div className="flex gap-2">
            {[
              { label: 'Seviye', value: stats.level || 1, icon: TrendingUp },
              { label: 'XP', value: stats.xp || 0, icon: Zap },
              { label: 'Seri', value: `${stats.streak || 0} gün`, icon: Sparkles },
            ].map(s => (
              <button key={s.label} onClick={() => navigate('/profile')}
                className="flex-1 p-2.5 rounded-xl text-center transition-transform active:scale-95"
                style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                <s.icon size={14} className="mx-auto mb-1" style={{ color: theme.gold }} />
                <p className="text-sm font-bold" style={{ color: theme.textPrimary }}>{s.value}</p>
                <p className="text-[10px]" style={{ color: theme.textSecondary }}>{s.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Daily AI Tip */}
        {dailyTip && (
          <div className="p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${theme.gold}12, ${theme.gold}04)`, border: `1px solid ${theme.gold}20` }}>
            <div className="flex items-start gap-2">
              <Sparkles size={16} style={{ color: theme.gold }} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-semibold mb-1" style={{ color: theme.gold }}>Günün Tavsiyesi</p>
                <p className="text-xs leading-relaxed" style={{ color: theme.textPrimary }}>{dailyTip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="space-y-2.5">
          {FEATURES.map(f => (
            <button key={f.id} onClick={() => navigate(f.path)}
              className="w-full p-4 rounded-xl flex items-center gap-3.5 transition-transform active:scale-[0.98] text-left"
              style={{ background: f.gradient, border: `1px solid ${f.color}20` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${f.color}18` }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: theme.textPrimary }}>{f.title}</p>
                  {f.tag && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0"
                      style={{ background: `${f.color}20`, color: f.color }}>{f.tag}</span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>{f.desc}</p>
              </div>
              <ChevronRight size={16} style={{ color: theme.textSecondary }} />
            </button>
          ))}
        </div>

        {/* Quick Links */}
        <div className="pt-2">
          <p className="text-xs font-semibold mb-2" style={{ color: theme.textSecondary }}>Hızlı Erişim</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { path: '/scholars', label: 'Âlimler', emoji: '📚' },
              { path: '/qibla', label: 'Kıble', emoji: '🧭' },
              { path: '/meal-audio', label: 'Meal Dinle', emoji: '🎧' },
              { path: '/ramadan', label: 'Ramazan', emoji: '🌙' },
            ].map(q => (
              <button key={q.path} onClick={() => navigate(q.path)}
                className="p-3 rounded-xl text-center transition-transform active:scale-95"
                style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                <span className="text-lg">{q.emoji}</span>
                <p className="text-[10px] mt-1" style={{ color: theme.textSecondary }}>{q.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}