import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Flame, Star, Trophy, Target, ChevronRight, Activity, Calendar } from 'lucide-react';
import { Typography } from '../components/ui/Typography';
import { userStats } from '../data/cmsContent';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Simulated GitHub style contribution data (30 days)
  const activityData = Array.from({ length: 35 }, () => Math.floor(Math.random() * 4));

  const getColorForActivity = (level) => {
    switch(level) {
      case 0: return 'rgba(255,255,255,0.05)';
      case 1: return 'rgba(46, 204, 113, 0.3)';
      case 2: return 'rgba(46, 204, 113, 0.6)';
      case 3: return '#2ECC71';
      default: return 'rgba(255,255,255,0.05)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#052A1E', position: 'relative', paddingBottom: '120px' }}>
      {/* Background Geometry */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '350px', background: 'linear-gradient(to bottom, #031c13 0%, #052A1E 100%)', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")', opacity: 0.03, zIndex: 1, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Typography variant="h2" style={{ color: '#FFF', fontSize: '28px' }}>Profil</Typography>
          </div>
          <button onClick={() => navigate('/settings')} style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
            <Settings size={20} />
          </button>
        </div>

        {/* Profile Identity & Ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '16px' }}>
            {/* Circular Progress SVG */}
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="#CDA434" strokeWidth="6" strokeDasharray="339.292" strokeDashoffset={339.292 * (1 - (userStats.level / 20))} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#031c13', position: 'absolute', top: '10px', left: '10px', overflow: 'hidden', border: '2px solid rgba(205, 164, 52, 0.5)' }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Samet" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Level Badge */}
            <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', background: '#CDA434', color: '#000', padding: '4px 12px', borderRadius: '100px', fontWeight: 800, fontSize: '14px', border: '2px solid #052A1E' }}>
              Seviye {userStats.level}
            </div>
          </div>
          
          <Typography variant="h2" style={{ color: '#FFF', fontSize: '24px', marginBottom: '4px' }}>Samet Durak</Typography>
          <Typography variant="caption" style={{ color: '#CDA434', fontWeight: 600, fontSize: '14px' }}>İlim Yolcusu</Typography>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Flame size={24} color="#E74C3C" style={{ marginBottom: '8px' }} />
            <Typography variant="h3" style={{ color: '#FFF', fontSize: '20px' }}>{userStats.streak}</Typography>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Gün Seri</Typography>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Star size={24} color="#CDA434" style={{ marginBottom: '8px' }} />
            <Typography variant="h3" style={{ color: '#FFF', fontSize: '20px' }}>{userStats.xp}</Typography>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Toplam XP</Typography>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Trophy size={24} color="#3498DB" style={{ marginBottom: '8px' }} />
            <Typography variant="h3" style={{ color: '#FFF', fontSize: '20px' }}>12</Typography>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Rozet</Typography>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
          <button onClick={() => setActiveTab('overview')} style={{ background: 'none', border: 'none', color: activeTab === 'overview' ? '#CDA434' : 'rgba(255,255,255,0.5)', fontWeight: 700, paddingBottom: '12px', borderBottom: activeTab === 'overview' ? '2px solid #CDA434' : '2px solid transparent', transition: 'all 0.2s', fontSize: '15px' }}>
            Genel Bakış
          </button>
          <button onClick={() => setActiveTab('badges')} style={{ background: 'none', border: 'none', color: activeTab === 'badges' ? '#CDA434' : 'rgba(255,255,255,0.5)', fontWeight: 700, paddingBottom: '12px', borderBottom: activeTab === 'badges' ? '2px solid #CDA434' : '2px solid transparent', transition: 'all 0.2s', fontSize: '15px' }}>
            Rozetler
          </button>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Weekly Challenge */}
            <div style={{ background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.15) 0%, rgba(15, 143, 87, 0.05) 100%)', border: '1px solid rgba(46, 204, 113, 0.3)', borderRadius: '24px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Target size={24} color="#2ECC71" />
                <Typography variant="h3" style={{ color: '#FFF', fontSize: '18px' }}>Haftalık Hedef</Typography>
              </div>
              <Typography variant="bodySmall" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>{userStats.challenges.weekly.desc}</Typography>
              
              <div style={{ width: '100%', height: '10px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ height: '100%', background: '#2ECC71', width: `${(userStats.challenges.weekly.current / userStats.challenges.weekly.target) * 100}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" style={{ color: '#2ECC71', fontWeight: 700 }}>%{Math.round((userStats.challenges.weekly.current / userStats.challenges.weekly.target) * 100)} Tamamlandı</Typography>
                <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)' }}>{userStats.challenges.weekly.current} / {userStats.challenges.weekly.target}</Typography>
              </div>
            </div>

            {/* Activity Heatmap */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={20} color="#CDA434" />
                  <Typography variant="h3" style={{ color: '#FFF', fontSize: '16px' }}>Öğrenme Aktivitesi</Typography>
                </div>
                <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)' }}>Son 30 Gün</Typography>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {activityData.map((level, i) => (
                  <div key={i} style={{ aspectRatio: '1/1', borderRadius: '6px', background: getColorForActivity(level), transition: 'transform 0.2s', cursor: 'pointer' }} title={`Aktivite Seviyesi: ${level}`} />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab Content: Badges */}
        {activeTab === 'badges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {/* Mock Badges */}
            {[
              { id: 1, name: "Sabah Kuşu", desc: "10 gün üst üste sabah namazı sonrası zikir", icon: "🌅", color: "#F5A623", earned: true },
              { id: 2, name: "Kur'an Muhafızı", desc: "1 Cüz hatim edildi", icon: "📖", color: "#2ECC71", earned: true },
              { id: 3, name: "Hadis Talebesi", desc: "40 Hadis okundu", icon: "📜", color: "#3498DB", earned: true },
              { id: 4, name: "İlim Aşığı", desc: "Seviye 20'ye ulaş", icon: "👑", color: "#9CA3AF", earned: false },
              { id: 5, name: "Gece Nuru", desc: "7 gün teheccüd vakti okuma", icon: "🌙", color: "#9CA3AF", earned: false },
              { id: 6, name: "Hafızlığa Adım", desc: "Yasin suresi ezberlendi", icon: "🧠", color: "#9CA3AF", earned: false }
            ].map(badge => (
              <div key={badge.id} style={{
                background: badge.earned ? `linear-gradient(135deg, ${badge.color}20 0%, rgba(0,0,0,0) 100%)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${badge.earned ? `${badge.color}40` : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                filter: badge.earned ? 'none' : 'grayscale(100%)', opacity: badge.earned ? 1 : 0.5
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px', background: badge.earned ? `${badge.color}20` : 'rgba(255,255,255,0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {badge.icon}
                </div>
                <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 700, marginBottom: '4px' }}>{badge.name}</Typography>
                <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', lineHeight: 1.4 }}>{badge.desc}</Typography>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}