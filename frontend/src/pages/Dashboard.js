import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Play, Bookmark, Share2, MapPin, ChevronRight, BookOpen, Heart, ScrollText, Gamepad2, CheckCircle2, Circle, Users, Route, Moon, Wind } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { ProgressBar } from '../components/ui/ProgressBar';
import { usePrayerTimes, TURKISH_CITIES } from '../hooks/usePrayerTimes';
import { BookmarkService } from '../services/BookmarkService';
import { getTodayPlan, isTaskDone, getStreak, getBadges, getHistory, TASK_POOL } from '../services/pathEngine';
import { getCachedStats, fetchStats, subscribeStats } from '../services/gamification';
import { useTx } from '../i18n';

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
      {/* İbadet görevleri XP vermez (docs/YENI_OZELLIKLER.md §0 kural 7); XP yalnız ilim ve oyunda gösterilir. */}
      {xp > 0 && <Typography variant="caption" color="gold" weight={700}>+{xp} XP</Typography>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { city, changeCity, nextPrayer, countdown } = usePrayerTimes();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const tt = useTx();

  // ─── Gerçek ilerleme verisi ───
  // Önceki sürüm burada sabit değerler gösteriyordu (3/5 görev, 1250 XP, 7 gün, 45 rozet,
  // "Yasin 45/83"); yeni kullanıcı da bunları kendi ilerlemesi sanıyordu. Artık her değer
  // gerçek kaynaktan gelir, kaynak boşsa boş durum gösterilir.
  const [stats, setStats] = React.useState(() => getCachedStats());
  React.useEffect(() => {
    const off = subscribeStats(setStats);
    fetchStats(user).then((st) => { if (st) setStats(st); });
    return off;
  }, [user]);
  const plan = getTodayPlan(); // Nur Yolu değerlendirmesi yapılmadıysa null
  // plan.tasks görev kimliklerinin listesidir; ayrıntı TASK_POOL'dan gelir.
  const planTasks = plan
    ? plan.tasks.map((id) => ({ id, ...(TASK_POOL[id] || { title: id, xp: 0 }), done: isTaskDone(plan, id) }))
    : [];
  const doneCount = planTasks.filter((t) => t.done).length;
  const streakDays = getStreak();
  const earnedBadges = getBadges().filter((b) => b.earned).length;
  const activeDays = Object.values(getHistory()).filter((h) => h.done > 0).length;
  const totalXp = stats?.total_points || 0;
  let lastRead = null;
  try { lastRead = JSON.parse(localStorage.getItem('quran_last')); } catch { lastRead = null; }

  const verseText = "Öyleyse yalnız beni anın ki ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin.";
  const verseRef = "Bakara Suresi - 152";

  React.useEffect(() => {
    // Check if bookmarked on mount
    const checkBookmark = async () => {
      const b = await BookmarkService.isBookmarked(user?.id, 'daily_verse');
      setIsBookmarked(b);
    };
    checkBookmark();
  }, [user]);

  const handlePlayVerse = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(verseText + " " + verseRef);
    utterance.lang = 'tr-TR';
    utterance.pitch = 0.8; // Deep voice
    utterance.rate = 0.85; // Slow, wise pace
    utterance.onend = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleShareVerse = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Günün Ayeti - İslamApp',
          text: `Günün Ayeti: "${verseText}"\n${verseRef}`,
        });
      } else {
        alert("Paylaşım özelliği tarayıcınızda desteklenmiyor.");
      }
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const handleSaveVerse = async () => {
    try {
      const newStatus = await BookmarkService.toggleBookmark(user?.id, {
        id: 'daily_verse',
        type: 'verse',
        title: verseRef,
        slug: '/quran/2', // Example slug for Bakara
        desc: verseText
      });
      setIsBookmarked(newStatus);
    } catch (e) {
      console.error("Kaydetme hatası", e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: '100px' }} data-testid="dashboard">
      
      {/* HEADER */}
      <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, background: theme.bg }}>
        <div>
          <Typography variant="h2" color="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Esselamu Aleyküm
          </Typography>
          <Typography variant="h2" color="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            {user?.name || 'Hoş geldin'} <span role="img" aria-label="wave">👋</span>
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
              <button onClick={handleShareVerse} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Share2 size={18} color="#8C6C2E" />
              </button>
              <button onClick={handleSaveVerse} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Bookmark size={18} color="#8C6C2E" fill={isBookmarked ? "#8C6C2E" : "none"} />
              </button>
            </div>
          </div>
          <Typography variant="h3" style={{ color: '#4A3B18', lineHeight: 1.8, textAlign: 'right', fontFamily: "'Amiri', serif", fontSize: '28px', marginBottom: '12px' }}>
            فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ
          </Typography>
          <Typography variant="bodySmall" style={{ color: '#5C4A21', marginBottom: '16px', lineHeight: 1.6 }}>
            "{verseText}"
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" weight={700} style={{ color: '#8C6C2E' }}>{verseRef}</Typography>
            <button onClick={handlePlayVerse} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#4A3B18', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              {isPlaying ? (
                <div style={{ width: '12px', height: '12px', background: '#FFF', borderRadius: '2px' }} />
              ) : (
                <Play size={16} color="#FFF" style={{ marginLeft: '2px' }} />
              )}
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
                <Typography variant="h3" color="primary">{nextPrayer ? nextPrayer.name : 'Hesaplanıyor'}</Typography>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={10} color={theme.textSecondary} />
                  <select 
                    value={city} 
                    onChange={(e) => changeCity(e.target.value)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      outline: 'none', 
                      fontSize: '11px', 
                      color: theme.textSecondary,
                      cursor: 'pointer',
                      WebkitAppearance: 'none',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    <option value="İstanbul">İstanbul</option>
                    {TURKISH_CITIES.filter(c => c !== 'İstanbul').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Typography variant="h1" color="gold" style={{ fontFamily: 'monospace', letterSpacing: '-1px' }}>{countdown}</Typography>
            <Typography variant="caption" color="secondary">Vakit: {nextPrayer ? nextPrayer.time : '--:--'}</Typography>
          </div>
        </Card>

        {/* QUICK LINKS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', overflowX: 'auto', gap: '8px', WebkitOverflowScrolling: 'touch' }}>
          <QuickLink icon={Route} label="Yol" color="#10B981" onClick={() => navigate('/yol')} />
          <QuickLink icon={BookOpen} label="Kur'an" color="#4A90D9" onClick={() => navigate('/quran')} />
          <QuickLink icon={Users} label="Ortak Hatim" color="#10B981" onClick={() => navigate('/hatim')} />
          <QuickLink icon={Wind} label="Halvet" color="#8b5cf6" onClick={() => navigate('/halvet')} />
          <QuickLink icon={Moon} label="Gece" color="#6366F1" onClick={() => navigate('/night')} />
          <QuickLink icon={Gamepad2} label="Oyna" color="#EC4899" onClick={() => navigate('/quiz')} />
        </div>

        {/* BUGÜNKÜ YOLUM — Nur Yolu planından gelir */}
        {plan ? (
          <Card onClick={() => navigate('/yol')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <Typography variant="h4" color="primary" style={{ marginBottom: '4px' }}>{tt('Bugünkü Yolum')}</Typography>
                <Typography variant="caption" color="secondary">{doneCount}/{planTasks.length} {tt('adım tamamlandı')}</Typography>
              </div>
            </div>
            <ProgressBar progress={planTasks.length ? Math.round((doneCount / planTasks.length) * 100) : 0} color={theme.gold} height="6px" style={{ marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {planTasks.map((t) => (
                <TaskItem key={t.id} title={`${t.icon || ''} ${tt(t.title)}`} xp={t.xp || 0} completed={t.done} theme={theme} />
              ))}
            </div>
          </Card>
        ) : (
          <Card onClick={() => navigate('/yol')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Typography variant="h4" color="primary" style={{ marginBottom: '4px' }}>{tt('Bugünkü Yolum')}</Typography>
              <Typography variant="caption" color="secondary">{tt('Sana uygun günlük planı birlikte kuralım.')}</Typography>
            </div>
            <ChevronRight size={18} color={theme.textMuted} />
          </Card>
        )}

        {/* İLERLEME — gerçek değerler; yeni kullanıcıda 0 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <Card padding="16px" style={{ textAlign: 'center' }}>
            <Typography variant="h3" color="gold">{totalXp}</Typography>
            <Typography variant="caption" color="secondary">{tt('İlim XP')}</Typography>
          </Card>
          <Card padding="16px" style={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary">{activeDays}</Typography>
            <Typography variant="caption" color="secondary">{streakDays > 1 ? `${tt('Yolda gün')} · ${streakDays} ${tt('art arda')}` : tt('Yolda gün')}</Typography>
          </Card>
          <Card padding="16px" style={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary">{earnedBadges}</Typography>
            <Typography variant="caption" color="secondary">{tt('Rozet')}</Typography>
          </Card>
        </div>

        {/* İLİM YOLCULUĞU */}
        <Card gradient={theme.primaryGradient} onClick={() => navigate('/journey')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
          <div>
            <Typography variant="h4" style={{ color: '#FFF', marginBottom: '4px' }}>{tt('İlim Yolculuğu')}</Typography>
            <Typography variant="bodySmall" style={{ color: 'rgba(255,255,255,0.8)' }}>{tt('Kaldığın yerden devam et')}</Typography>
          </div>
          <button style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#FFF', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {tt('Aç')} <ChevronRight size={14} />
          </button>
        </Card>

        {/* 🕯️ GERİ DÖNÜŞ ODASI — Kırk Perde giriş kartı */}
        <Card 
          onClick={() => navigate('/donus')} 
          gradient="linear-gradient(135deg, #0A0F0B 0%, #1A2A1E 40%, #0D1B12 100%)"
          border={false}
          style={{ 
            padding: '24px', 
            position: 'relative', 
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1px solid rgba(200, 165, 90, 0.15)',
          }}
        >
          {/* Kandil ışık efekti */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '20px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,165,90,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>🕯️</span>
                <Typography variant="h4" style={{ color: '#E8D5A8', letterSpacing: '0.5px' }}>
                  Geri Dönüş Odası
                </Typography>
              </div>
              <Typography variant="bodySmall" style={{ color: 'rgba(232, 213, 168, 0.6)', lineHeight: 1.5 }}>
                Kırk perde, kırk gün. Belki sen buraya gelmedin — belki çağrıldın.
              </Typography>
            </div>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '50%', 
              background: 'rgba(200, 165, 90, 0.12)', 
              border: '1px solid rgba(200, 165, 90, 0.25)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: '16px',
            }}>
              <ChevronRight size={20} color="#C8A55A" />
            </div>
          </div>
        </Card>

        {/* SON OKUNAN SURE — yalnız gerçekten okunmuş bir sure varsa */}
        {lastRead?.surah ? (
          <Card onClick={() => navigate(`/quran/${lastRead.surah}`)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `${theme.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} color={theme.primary} />
              </div>
              <div>
                <Typography variant="bodySmall" color="secondary" style={{ marginBottom: '2px' }}>{tt('Son Okunan Sure')}</Typography>
                <Typography variant="subtitle1" color="primary">{lastRead.name || `${lastRead.surah}. ${tt('sure')}`}</Typography>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {lastRead.ayah && lastRead.total ? (
                <Typography variant="caption" color="gold" weight={700}>{tt('Ayet')} {lastRead.ayah} / {lastRead.total}</Typography>
              ) : null}
              <Typography variant="caption" color="secondary" style={{ display: 'block', marginTop: '4px' }}>{tt('Devam Et')}</Typography>
            </div>
          </Card>
        ) : null}

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
