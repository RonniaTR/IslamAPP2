import React from 'react';
import ProfilKisisel from '../components/profil/ProfilKisisel';
import { motion } from 'framer-motion';
import { Settings, Flame, Trophy, Star, CheckCircle2, Circle, Play, Bookmark, Award, ChevronRight, Target, Sparkles, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { HistoryService } from '../services/HistoryService';
import { BookmarkService } from '../services/BookmarkService';
import { useAuth } from '../contexts/AuthContext';
import { useAppMode } from '../contexts/AppModeContext';
import { LogOut } from 'lucide-react';
import { getUpcomingDays, CALENDAR_NOTE } from '../services/islamicCalendar';
import { getHistory, getBadges, localKey } from '../services/pathEngine';

export default function ProfilePage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { clearMode } = useAppMode();
  
  
  // Eğer giriş yapmamışsa misafir ID'sini kullan
  const currentUid = user?.uid || user?.id || 'anonymous';
  
  const { profile, worshipStats, learningJourney, loading } = useUserProfile(currentUid);

  const [recentAudio, setRecentAudio] = React.useState([]);
  const [savedItems, setSavedItems] = React.useState([]);

  React.useEffect(() => {
    // Fetch external connected data
    const fetchConnectedData = async () => {
      const history = await HistoryService.getRecentHistory(currentUid, 3);
      setRecentAudio(history.filter(h => h.type === 'audio'));

      const bookmarks = await BookmarkService.getBookmarks(currentUid);
      setSavedItems(bookmarks);

    };
    fetchConnectedData();
  }, [currentUid]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center text-emerald-500">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  const handleLogout = async () => {
    clearMode(); // Yetişkin/Çocuk modunu siler
    await logout(); // Firebase çıkış
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen pb-24  overflow-y-auto" style={{ background: theme.bg }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b"
        style={{ background: `${theme.navBg}E6`, borderBottomColor: theme.cardBorder }}>
        <h1 className="text-2xl font-bold font-serif" style={{ color: theme.textPrimary }}>Profil</h1>
        <div className="flex gap-3">
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors" title="Çıkış Yap">
            <LogOut size={20} />
            <span className="text-sm font-semibold hidden md:inline">Çıkış Yap</span>
          </button>
          <button onClick={() => navigate('/settings')} className="p-2 rounded-full transition-colors" style={{ hover: { background: theme.surfaceLight }}}>
            <Settings size={24} style={{ color: theme.textSecondary }} />
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8 max-w-4xl mx-auto">
        <ProfileHero profile={profile} />
        <ProfilKisisel />
        {/* Sabit/sahte veriyle çizilen bölümler kaldırıldı (Bugünkü Durum, Rozet Galerisi, Kişisel Hedefler,
            AI Analizi, Bilgi Haritası, 2025 tarihli Yaklaşan Günler). Gerçek veri kaynakları bağlandıkça
            geri eklenecek — bkz. docs/YENI_OZELLIKLER.md 0.3. */}
        <UpcomingSpecialDays />
        <LearningJourney journey={learningJourney} navigate={navigate} />
        <WorshipStats stats={worshipStats} />
        <RecentAudio audios={recentAudio} navigate={navigate} />
        <SavedItems saved={savedItems} navigate={navigate} />
      </main>
    </div>
  );
}

// 1. Hero Profil Alanı
function ProfileHero({ profile }) {
  const nextLevelXP = profile.level * 1000;
  const progressPercent = Math.min((profile.xp / nextLevelXP) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row gap-6 items-center md:items-start"
    >
      <div className="relative">
        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#10b981] to-[#f59e0b]">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full border-4 border-[color:var(--bg-primary)] object-cover bg-gray-800"
            />
          ) : (
            <div className="w-full h-full rounded-full border-4 border-[color:var(--bg-primary)] bg-gray-800 flex items-center justify-center text-4xl font-black" style={{ color: '#f59e0b' }} aria-hidden>
              {(profile.name || '?').trim().charAt(0).toLocaleUpperCase('tr')}
            </div>
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-[#f59e0b] text-black font-bold px-3 py-1 rounded-full text-sm border-2 border-[color:var(--bg-primary)] shadow-lg shadow-amber-500/20">
          Seviye {profile.level}
        </div>
      </div>

      <div className="flex-1 text-center md:text-start mt-2 md:mt-0">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
          <h2 className="text-3xl font-bold">{profile.name}</h2>
          <CheckCircle2 size={24} className="text-emerald-500" />
        </div>
        <p className="text-emerald-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-1">
          <Sparkles size={16} /> {profile.title}
        </p>

        <div className="w-full max-w-md bg-black/5 dark:bg-white/5 rounded-full h-3 mb-2 overflow-hidden border border-black/5 dark:border-white/10">
          <div className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] h-full rounded-full" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="flex justify-between text-sm text-gray-400 max-w-md font-medium">
          <span className="text-[#fbbf24]">{profile.xp} <span className="text-gray-400">/ {nextLevelXP} XP</span></span>
          <span>Sonraki seviye için <span className="text-[#fbbf24]">{nextLevelXP - profile.xp} XP</span> kaldı</span>
        </div>
      </div>

      <div className="flex md:flex-col gap-4 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-start">
        <StatBadge icon={<Flame className="text-orange-500" />} value={Object.values(getHistory()).filter(h => h.done > 0).length} label="Yolda gün" />
        <StatBadge icon={<Trophy className="text-yellow-500" />} value={getBadges().filter(b => b.earned).length} label="Rozet" />
        <StatBadge icon={<Star className="text-yellow-400" />} value={profile.xp} label="Toplam XP" />
      </div>
    </motion.div>
  );
}

function StatBadge({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-4 py-3 rounded-2xl border border-black/5 dark:border-white/10 min-w-[140px]">
      <div className="p-2 bg-transparent rounded-full">
        {icon}
      </div>
      <div>
        <div className="font-bold text-xl leading-none">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{label}</div>
      </div>
    </div>
  );
}


// Yaklaşan İslami Özel Günler Takvimi
function UpcomingSpecialDays() {
  // Tek takvim kaynağı: services/islamicCalendar.js
  const nextDays = getUpcomingDays(2);

  if (nextDays.length === 0) return null;

  return (
    <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Calendar size={20} className="text-emerald-500" /> Yaklaşan Özel Günler
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nextDays.map((day, idx) => {
          const diffDays = day.daysLeft;
          const dateStr = day.dateLabel;
          return (
            <div key={idx} className="flex items-center justify-between bg-transparent p-4 rounded-2xl border border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{day.icon}</div>
                <div>
                  <div className="font-bold ">{day.name}</div>
                  <div className="text-xs text-gray-400">{dateStr}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black" style={{ color: day.color }}>{diffDays}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">{diffDays === 0 ? 'Bugün' : 'Gün Kaldı'}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-gray-500 mt-3">{CALENDAR_NOTE}</p>
    </div>
  );
}

// 3. Öğrenme Yolculuğum
function LearningJourney({ journey = [], navigate }) {
  // Gerçek ilerleme verisi yoksa bölüm hiç gösterilmez (sahte yüzde yok).
  if (!journey.length) return null;
  const data = journey;

  return (
    <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Target size={20} className="text-emerald-500" /> Öğrenme Yolculuğum
        </h3>
        <button onClick={() => navigate('/discover')} className="text-sm text-gray-400 hover: flex items-center gap-1">Tümünü Gör <ChevronRight size={16} /></button>
      </div>

      <div className="relative pt-8 pb-4 overflow-x-auto no-scrollbar">
        {/* Background Line */}
        <div className="absolute top-[3.25rem] left-8 right-8 h-1 bg-[var(--bg-surface-light)] z-0 rounded-full"></div>
        
        <div className="flex justify-between min-w-[600px] relative z-10 px-4">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 w-24">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-[color:var(--bg-surface)] shadow-lg shadow-black/50 ${item.percent === 100 ? item.color : 'bg-[var(--bg-surface-light)]'}`}>
                {item.percent === 100 ? <CheckCircle2 size={24} className="text-[color:var(--bg-primary)]" /> : <BookOpen size={24} className={item.percent > 0 ? "" : "text-gray-500"} />}
              </div>
              <div className="text-center">
                <div className="text-xs font-bold whitespace-nowrap">{item.title}</div>
                <div className={`text-xs ${item.percent === 100 ? 'text-emerald-500' : 'text-gray-400'}`}>%{item.percent}</div>
              </div>
            </div>
          ))}
          
          <div className="flex flex-col items-center gap-3 w-24 opacity-50">
            <div className="w-14 h-14 rounded-full flex items-center justify-center border-4 border-[color:var(--bg-surface)] bg-[var(--bg-surface-light)]">
              <div className="w-4 h-4 rounded-full border-2 border-gray-500"></div>
            </div>
            <div className="text-xs text-gray-500">Kilitli</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. İbadet İstatistikleri
function WorshipStats({ stats = [] }) {
  // If no stats, show default
  const defaultStats = [
    { label: "Kur'an", percent: 62, color: "bg-emerald-500" },
    { label: "Hadis", percent: 81, color: "bg-[#f59e0b]" },
    { label: "Dua", percent: 75, color: "bg-purple-500" },
    { label: "Namaz", percent: 54, color: "bg-orange-500" },
    { label: "Siyer", percent: 20, color: "bg-teal-500" }
  ];
  const data = stats.length > 0 ? stats : defaultStats;

  return (
    <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">İbadet İstatistikleri</h3>
        <select className="bg-transparent border border-black/5 dark:border-white/10 text-sm rounded-lg px-2 py-1 text-gray-300 outline-none">
          <option>Bu Hafta</option>
          <option>Bu Ay</option>
        </select>
      </div>

      <div className="space-y-4">
        {data.map((stat, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}/20`}>
              <BookOpen size={16} className={`text-[${stat.color.replace('bg-', '')}]`} />
            </div>
            <div className="w-20 text-sm font-medium">{stat.label}</div>
            <div className="flex-1 bg-transparent h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${stat.percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${stat.color}`}
              ></motion.div>
            </div>
            <div className="w-10 text-right text-sm text-gray-400">%{stat.percent}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Günlük Seri (Heatmap Placeholder)
// Eski seri takvimi; yerini ProfilKisisel içindeki Gün çetelesi aldı (16. tur).
// eslint-disable-next-line no-unused-vars
function StreakCalendar() {
  const hist = getHistory(); // { 'YYYY-MM-DD': { done, total } } — cihazdaki gerçek kayıt
  const activeCount = Object.values(hist).filter(h => h.done > 0).length;
  // Canlı tarih hesabı: Heatmap her zaman BUGÜN ile biter
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // 20 sütun * 7 satır = 140 günlük bir tablo çizeceğiz.
  const columns = 20;
  const rows = 7;
  const totalDays = columns * rows;
  
  // Bugünden geriye doğru günleri hesapla
  const days = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  // Bir gün, o gün en az bir adım tamamlandıysa aktiftir.
  const isDayInStreak = (d) => (hist[localKey(d)]?.done || 0) > 0;

  return (
    <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Flame size={20} className="text-orange-500" /> Yolda Geçen Günler
        </h3>
      </div>
      <p className="text-sm text-gray-400 mb-6">{currentYear} • {activeCount} gün yoldaydın</p>
      
      {/* Dynamic Contribution Graph ending on TODAY */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-1.5 min-w-max pb-2">
          {[...Array(columns)].map((_, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1.5">
              {[...Array(rows)].map((_, rowIdx) => {
                const dayIndex = colIdx * rows + rowIdx;
                const currentDate = days[dayIndex];
                
                // Gelecek günleri boş bırak (eğer grid bugünü geçiyorsa, genelde geçmez ama güvenlik için)
                if (currentDate > today) {
                  return <div key={rowIdx} className="w-4 h-4 rounded-sm bg-transparent"></div>;
                }

                // Bu gün seri içinde mi?
                const isActive = isDayInStreak(currentDate);
                const isToday = currentDate.toDateString() === today.toDateString();

                // Stil belirleme
                let bgClass = "bg-[var(--bg-surface-light)]"; // pasif gün
                if (isActive) bgClass = "bg-emerald-500 shadow-sm shadow-[#10b981]/40";
                if (isToday && !isActive) bgClass = "bg-[var(--bg-surface-light)] ring-1 ring-white/40"; // bugün: yalnız ince çerçeve, uyarı rengi yok
                if (isToday && isActive) bgClass = "bg-emerald-500 ring-2 ring-white ring-offset-1 ring-offset-[#132A1D]"; // Bugün sisteme girdiyse beyaz çerçeve
                
                return (
                  <div 
                    key={rowIdx} 
                    title={`${currentDate.toLocaleDateString('tr-TR')} ${isActive ? '(Aktif)' : ''}`}
                    className={`w-4 h-4 rounded-sm transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer ${bgClass}`}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 6. Son Dinlediklerim
function RecentAudio({ audios = [], navigate }) {
  if (audios.length === 0) return null; // Hide if none

  return (
    <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Son Dinlediklerim</h3>
      </div>
      <div className="space-y-4">
        {audios.map((a, i) => (
          <div key={i} className="flex items-center gap-4 bg-transparent p-3 rounded-2xl border border-black/5 dark:border-white/10 cursor-pointer hover:border-[#10b981] transition-colors"
               onClick={() => navigate(`/content/${a.type}/${a.slug}`)}>
            <button className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center  shadow-lg shadow-[#10b981]/20">
              <Play size={20} className="ms-1" />
            </button>
            <div className="flex-1">
              <div className="font-bold">{a.title}</div>
              <div className="text-xs text-gray-400 capitalize">{a.type}</div>
              <div className="mt-2 bg-[var(--bg-surface-light)] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${a.progress}%` }}></div>
              </div>
            </div>
            <div className="text-xs text-gray-400 font-mono">%{(a.progress || 0).toFixed(0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Kaydedilenler
function SavedItems({ saved = [], navigate }) {
  if (saved.length === 0) return null;

  return (
    <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Bookmark size={20} className="text-emerald-500" /> Kaydedilenler
        </h3>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {saved.map((s, i) => (
          <div key={i} onClick={() => navigate(`/content/${s.type}/${s.slug}`)} className="min-w-[160px] h-32 relative rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 group cursor-pointer hover:border-[#f59e0b] transition-colors">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20 z-10"></div>
            <div className="absolute inset-0 bg-transparent">
              <div className="w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10b981] to-transparent"></div>
            </div>
            <div className="absolute top-2 right-2 z-20 text-[#f59e0b]">
              <Bookmark size={18} fill="#f59e0b" />
            </div>
            <div className="absolute bottom-3 left-3 right-3 z-20">
              <div className="font-bold text-sm leading-tight">{s.title}</div>
              <div className="text-xs text-gray-400 mt-1 capitalize">{s.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

