import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Play, Bookmark, Share2, MapPin, ChevronRight, BookOpen, Heart, ScrollText, Gamepad2, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { ProgressBar } from '../components/ui/ProgressBar';

// Mini Quick Link
function QuickLink({ icon: Icon, label, color, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '64px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
        <Icon size={20} color={color} />
      </div>
      <Typography variant="caption" color="secondary" style={{ fontSize: '10px' }}>{label}</Typography>
    </div>
  );
}

// Daily Task Item
function TaskItem({ title, xp, completed, theme }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: `1px solid ${theme.cardBorder}` }}>
      {completed ? <CheckCircle2 size={20} color={theme.success} /> : <Circle size={20} color={theme.textMuted} />}
      <div style={{ flex: 1 }}>
        <Typography variant="bodySmall" weight={completed ? 600 : 500} color={completed ? 'primary' : 'secondary'} style={{ textDecoration: completed ? 'line-through' : 'none' }}>
          {title}
        </Typography>
      </div>
      <Typography variant="caption" color="gold" weight={700}>+{xp} XP</Typography>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: '100px' }} data-testid="dashboard">
      
      {/* HEADER */}
      <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, background: theme.bg }}>
        <div>
          <Typography variant="h2" color="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Esselamu Aleyküm
          </Typography>
          <Typography variant="h2" color="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            {user?.name || 'Samet'} <span role="img" aria-label="wave">👋</span>
          </Typography>
          <Typography variant="bodySmall" color="secondary">Hayırlı sabahlar</Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: theme.surface, border: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Bell size={20} color={theme.textSecondary} />
            <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: theme.error, border: `2px solid ${theme.surface}` }} />
          </button>
          <div onClick={() => navigate('/profile')} style={{ width: '44px', height: '44px', borderRadius: '50%', background: theme.surfaceLight, border: `2px solid ${theme.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
             <span style={{ fontSize: '20px' }}>👨🏻</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* GÜNÜN AYETİ (Hero Card) - Gold/Beige styled */}
        <Card gradient="linear-gradient(135deg, #FDF7E3 0%, #EFE1B8 100%)" border={false} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Typography variant="caption" weight={700} style={{ color: '#8C6C2E', textTransform: 'uppercase', letterSpacing: '1px' }}>Günün Ayeti</Typography>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Share2 size={18} color="#8C6C2E" />
              <Bookmark size={18} color="#8C6C2E" />
            </div>
          </div>
          <Typography variant="h3" style={{ color: '#4A3B18', lineHeight: 1.8, textAlign: 'right', fontFamily: "'Amiri', serif", fontSize: '28px', marginBottom: '12px' }}>
            فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ
          </Typography>
          <Typography variant="bodySmall" style={{ color: '#5C4A21', marginBottom: '16px', lineHeight: 1.6 }}>
            "Öyleyse yalnız beni anın ki ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin."
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" weight={700} style={{ color: '#8C6C2E' }}>Bakara Suresi - 152</Typography>
            <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#4A3B18', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
              <Play size={16} color="#FFF" style={{ marginLeft: '2px' }} />
            </button>
          </div>
        </Card>

        {/* NAMAZA KALAN SÜRE */}
        <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="subtitle2" color="secondary" style={{ marginBottom: '4px' }}>Namaza Kalan Süre</Typography>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: `${theme.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px' }}>🕋</span>
              </div>
              <div>
                <Typography variant="h3" color="primary">Öğle</Typography>
                <Typography variant="caption" color="secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={10} /> İstanbul
                </Typography>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Typography variant="h1" color="gold" style={{ fontFamily: 'monospace', letterSpacing: '-1px' }}>02:45:58</Typography>
            <Typography variant="caption" color="secondary">Sonraki: İkindi</Typography>
          </div>
        </Card>

        {/* QUICK LINKS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
          <QuickLink icon={BookOpen} label="Kur'an" color="#4A90D9" onClick={() => navigate('/quran')} />
          <QuickLink icon={Heart} label="Dua & Zikir" color="#10B981" onClick={() => navigate('/dhikr')} />
          <QuickLink icon={ScrollText} label="İlim" color="#F59E0B" onClick={() => navigate('/knowledge')} />
          <QuickLink icon={BookOpen} label="Hikayeler" color="#8B5CF6" onClick={() => navigate('/knowledge')} />
          <QuickLink icon={Gamepad2} label="Oyna" color="#EC4899" onClick={() => navigate('/quiz')} />
        </div>

        {/* BUGÜNKÜ HEDEFLERİM */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <Typography variant="h4" color="primary" style={{ marginBottom: '4px' }}>Bugünkü Hedeflerim</Typography>
              <Typography variant="caption" color="secondary">3/5 görev tamamlandı</Typography>
            </div>
            <Typography variant="bodySmall" color="gold" weight={700}>80 XP</Typography>
          </div>
          <ProgressBar progress={60} color={theme.gold} height="6px" style={{ marginBottom: '16px' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TaskItem title="Namaz kıl" xp={20} completed={true} theme={theme} />
            <TaskItem title="Kur'an Oku (2 Sayfa)" xp={30} completed={true} theme={theme} />
            <TaskItem title="Dua Öğren" xp={10} completed={true} theme={theme} />
            <TaskItem title="Zikir Yap (100 Kere)" xp={10} completed={false} theme={theme} />
            <TaskItem title="Oyun Oyna" xp={10} completed={false} theme={theme} />
          </div>
        </Card>

        {/* BUGÜNKÜ İLERLEMEN (Stats) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <Card padding="16px" style={{ textAlign: 'center' }}>
            <Typography variant="h3" color="gold">1250</Typography>
            <Typography variant="caption" color="secondary">/ 3000 XP</Typography>
          </Card>
          <Card padding="16px" style={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary">7</Typography>
            <Typography variant="caption" color="secondary">Gün</Typography>
          </Card>
          <Card padding="16px" style={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary">45</Typography>
            <Typography variant="caption" color="secondary">Rozet</Typography>
          </Card>
        </div>

        {/* İLİM YOLCULUĞU */}
        <Card gradient={theme.primaryGradient} onClick={() => navigate('/journey')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
          <div>
            <Typography variant="h4" style={{ color: '#FFF', marginBottom: '4px' }}>İlim Yolculuğu</Typography>
            <Typography variant="bodySmall" style={{ color: 'rgba(255,255,255,0.8)' }}>6. Gün</Typography>
          </div>
          <button style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#FFF', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Devam Et <ChevronRight size={14} />
          </button>
        </Card>

        {/* SON OKUNAN SURE */}
        <Card onClick={() => navigate('/quran/36')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `${theme.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={24} color={theme.primary} />
            </div>
            <div>
              <Typography variant="bodySmall" color="secondary" style={{ marginBottom: '2px' }}>Son Okunan Sure</Typography>
              <Typography variant="subtitle1" color="primary">Yasin Suresi</Typography>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Typography variant="caption" color="gold" weight={700}>Ayet 45 / 83</Typography>
            <Typography variant="caption" color="secondary" style={{ display: 'block', marginTop: '4px' }}>Devam Et</Typography>
          </div>
        </Card>
        
        {/* GÜNLÜK DUA */}
        <Card onClick={() => navigate('/dhikr')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `${theme.gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={24} color={theme.gold} />
            </div>
            <div>
              <Typography variant="bodySmall" color="secondary" style={{ marginBottom: '2px' }}>Günlük Dua</Typography>
              <Typography variant="subtitle1" color="primary">Rızık Duası</Typography>
            </div>
          </div>
          <button style={{ padding: '8px 16px', borderRadius: '12px', background: `${theme.gold}20`, color: theme.gold, border: 'none', fontSize: '12px', fontWeight: 700 }}>
            Dinle
          </button>
        </Card>

      </div>
    </div>
  );
}
