import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Flame, Trophy, Star, CheckCircle2, Circle, Play, Bookmark, Award, ChevronRight, Target, Sparkles, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { HistoryService } from '../services/HistoryService';
import { BookmarkService } from '../services/BookmarkService';
import { DiscoverService } from '../services/DiscoverService';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Eğer giriş yapmamışsa misafir ID'sini kullan
  const currentUid = user?.uid || user?.id || 'anonymous';
  
  const { profile, worshipStats, learningJourney, loading } = useUserProfile(currentUid);

  const [recentAudio, setRecentAudio] = React.useState([]);
  const [savedItems, setSavedItems] = React.useState([]);
  const [aiRecs, setAiRecs] = React.useState([]);

  React.useEffect(() => {
    // Fetch external connected data
    const fetchConnectedData = async () => {
      const history = await HistoryService.getRecentHistory(currentUid, 3);
      setRecentAudio(history.filter(h => h.type === 'audio'));

      const bookmarks = await BookmarkService.getBookmarks(currentUid);
      setSavedItems(bookmarks);

      const feed = await DiscoverService.getDiscoverFeed(currentUid);
      setAiRecs(feed.forYou || []);
    };
    fetchConnectedData();
  }, [currentUid]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#0A1A12] flex items-center justify-center text-[#10b981]">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#0A1A12] text-white overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-[#0A1A12]/90 backdrop-blur-md border-b border-[#1A3826]">
        <h1 className="text-2xl font-bold font-serif text-white">Profil</h1>
        <button className="p-2 rounded-full hover:bg-[#1A3826] transition-colors">
          <Settings size={24} className="text-gray-400 hover:text-white" />
        </button>
      </header>

      <main className="px-4 py-6 space-y-8 max-w-4xl mx-auto">
        <ProfileHero profile={profile} />
        <DailyStatus navigate={navigate} />
        <UpcomingSpecialDays />
        <LearningJourney journey={learningJourney} navigate={navigate} />
        <WorshipStats stats={worshipStats} />
        <StreakCalendar streak={profile.streak} />
        <RecentAudio audios={recentAudio} navigate={navigate} />
        <SavedItems saved={savedItems} navigate={navigate} />
        <BadgeGallery total={profile.totalBadges} />
        <PersonalGoals />
        <AIAssistantCard recommendation={aiRecs[0]} navigate={navigate} />
        <KnowledgeMap />
        <UpcomingEvents />
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
          <img 
            src={profile.avatarUrl} 
            alt="Profile" 
            className="w-full h-full rounded-full border-4 border-[#0A1A12] object-cover bg-gray-800"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-[#f59e0b] text-black font-bold px-3 py-1 rounded-full text-sm border-2 border-[#0A1A12] shadow-lg shadow-amber-500/20">
          Seviye {profile.level}
        </div>
      </div>

      <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
          <h2 className="text-3xl font-bold">{profile.name}</h2>
          <CheckCircle2 size={24} className="text-[#10b981]" />
        </div>
        <p className="text-[#10b981] font-medium mb-4 flex items-center justify-center md:justify-start gap-1">
          <Sparkles size={16} /> {profile.title}
        </p>

        <div className="w-full max-w-md bg-[#132A1D] rounded-full h-3 mb-2 overflow-hidden border border-[#1A3826]">
          <div className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] h-full rounded-full" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="flex justify-between text-sm text-gray-400 max-w-md font-medium">
          <span className="text-[#fbbf24]">{profile.xp} <span className="text-gray-400">/ {nextLevelXP} XP</span></span>
          <span>Sonraki seviye için <span className="text-[#fbbf24]">{nextLevelXP - profile.xp} XP</span> kaldı</span>
        </div>
      </div>

      <div className="flex md:flex-col gap-4 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-start">
        <StatBadge icon={<Flame className="text-orange-500" />} value={profile.streak} label="Günlük Seri" />
        <StatBadge icon={<Trophy className="text-yellow-500" />} value={profile.totalBadges || 12} label="Rozet" />
        <StatBadge icon={<Star className="text-yellow-400" />} value={profile.xp} label="Toplam XP" />
      </div>
    </motion.div>
  );
}

function StatBadge({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3 bg-[#132A1D] px-4 py-3 rounded-2xl border border-[#1A3826] min-w-[140px]">
      <div className="p-2 bg-[#0A1A12] rounded-full">
        {icon}
      </div>
      <div>
        <div className="font-bold text-xl leading-none">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{label}</div>
      </div>
    </div>
  );
}

// 2. Bugünkü Durum
function DailyStatus() {
  // Canlı Tarih Hesaplama
  const today = new Date();
  const dateString = today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });

  return (
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
      {/* Decorative BG element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981] opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={20} className="text-[#10b981]" />
          <h3 className="text-lg font-bold">Bugünkü Durum</h3>
        </div>
        <div className="text-sm text-gray-400 mb-6 font-medium">{dateString}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DailyTaskItem title="Günün Ayeti" status="Okundu" completed={true} />
          <DailyTaskItem title="2 Dua" status="Okundu" completed={true} />
          <DailyTaskItem title="1 Hadis" status="Tamamlandı" completed={true} />
        </div>
      </div>

      <div className="flex items-center gap-6 bg-[#0A1A12] p-5 rounded-2xl border border-[#1A3826] z-10 w-full md:w-auto">
        <div>
          <div className="text-sm text-gray-400 mb-1">Günlük Hedef</div>
          <div className="text-3xl font-bold">%70</div>
          <button className="mt-4 w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2 px-6 rounded-xl transition-colors">
            Devam Et
          </button>
        </div>
        {/* Simple CSS Circle Progress */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="#1A3826" strokeWidth="8" fill="transparent" />
            <circle cx="48" cy="48" r="40" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset="75" className="transition-all duration-1000 ease-out" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function DailyTaskItem({ title, status, completed }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-full ${completed ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#1A3826] text-gray-500'}`}>
        <CheckCircle2 size={18} />
      </div>
      <div>
        <div className="font-bold text-sm text-white">{title}</div>
        <div className="text-xs text-[#10b981]">{status}</div>
      </div>
    </div>
  );
}

// Yaklaşan İslami Özel Günler Takvimi
function UpcomingSpecialDays() {
  const specialDays = [
    { name: "Ramazan Başlangıcı", date: "2026-02-18", icon: "🌙", color: "#10b981" },
    { name: "Kadir Gecesi", date: "2026-03-15", icon: "✨", color: "#f59e0b" },
    { name: "Ramazan Bayramı", date: "2026-03-20", icon: "🎉", color: "#3b82f6" },
    { name: "Kurban Bayramı", date: "2026-05-26", icon: "🐑", color: "#8b5cf6" },
    { name: "Mevlid Kandili", date: "2026-08-27", icon: "🕌", color: "#ec4899" },
    { name: "Ramazan Başlangıcı", date: "2027-02-08", icon: "🌙", color: "#10b981" },
  ];

  const today = new Date();
  today.setHours(0,0,0,0);
  
  const upcoming = specialDays.filter(d => new Date(d.date) >= today).sort((a,b) => new Date(a.date) - new Date(b.date));
  const nextDays = upcoming.slice(0, 2);

  if (nextDays.length === 0) return null;

  return (
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Calendar size={20} className="text-[#10b981]" /> Yaklaşan Özel Günler
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nextDays.map((day, idx) => {
          const diffTime = Math.abs(new Date(day.date) - today);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const dateStr = new Date(day.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
          return (
            <div key={idx} className="flex items-center justify-between bg-[#0A1A12] p-4 rounded-2xl border border-[#1A3826]">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{day.icon}</div>
                <div>
                  <div className="font-bold text-white">{day.name}</div>
                  <div className="text-xs text-gray-400">{dateStr}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black" style={{ color: day.color }}>{diffDays}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase">Gün Kaldı</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. Öğrenme Yolculuğum
function LearningJourney({ journey = [], navigate }) {
  // If no journey data, show default
  const defaultJourney = [
    { title: "İlmihal", percent: 100, color: "bg-[#10b981]" },
    { title: "Namaz Rehberi", percent: 80, color: "bg-[#f59e0b]" },
    { title: "40 Hadis", percent: 35, color: "bg-purple-500" },
    { title: "Siyer", percent: 12, color: "bg-orange-500" },
    { title: "Kur'an Yolculuğu", percent: 8, color: "bg-teal-500" }
  ];
  const data = journey.length > 0 ? journey : defaultJourney;

  return (
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Target size={20} className="text-[#10b981]" /> Öğrenme Yolculuğum
        </h3>
        <button onClick={() => navigate('/discover')} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">Tümünü Gör <ChevronRight size={16} /></button>
      </div>

      <div className="relative pt-8 pb-4 overflow-x-auto no-scrollbar">
        {/* Background Line */}
        <div className="absolute top-[3.25rem] left-8 right-8 h-1 bg-[#1A3826] z-0 rounded-full"></div>
        
        <div className="flex justify-between min-w-[600px] relative z-10 px-4">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 w-24">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-[#132A1D] shadow-lg shadow-black/50 ${item.percent === 100 ? item.color : 'bg-[#1A3826]'}`}>
                {item.percent === 100 ? <CheckCircle2 size={24} className="text-[#0A1A12]" /> : <BookOpen size={24} className={item.percent > 0 ? "text-white" : "text-gray-500"} />}
              </div>
              <div className="text-center">
                <div className="text-xs font-bold whitespace-nowrap">{item.title}</div>
                <div className={`text-xs ${item.percent === 100 ? 'text-[#10b981]' : 'text-gray-400'}`}>%{item.percent}</div>
              </div>
            </div>
          ))}
          
          <div className="flex flex-col items-center gap-3 w-24 opacity-50">
            <div className="w-14 h-14 rounded-full flex items-center justify-center border-4 border-[#132A1D] bg-[#1A3826]">
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
    { label: "Kur'an", percent: 62, color: "bg-[#10b981]" },
    { label: "Hadis", percent: 81, color: "bg-[#f59e0b]" },
    { label: "Dua", percent: 75, color: "bg-purple-500" },
    { label: "Namaz", percent: 54, color: "bg-orange-500" },
    { label: "Siyer", percent: 20, color: "bg-teal-500" }
  ];
  const data = stats.length > 0 ? stats : defaultStats;

  return (
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">İbadet İstatistikleri</h3>
        <select className="bg-[#0A1A12] border border-[#1A3826] text-sm rounded-lg px-2 py-1 text-gray-300 outline-none">
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
            <div className="flex-1 bg-[#0A1A12] h-2 rounded-full overflow-hidden">
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
function StreakCalendar({ streak = 0 }) {
  // Canlı tarih hesabı: Heatmap her zaman BUGÜN ile biter
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentDayOfWeek = today.getDay(); // 0: Sunday, 1: Monday vb.
  
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

  // Seri (Streak) miktarı kadar son günleri yeşil yap (Bugün dahil geriye doğru)
  const isDayInStreak = (dateStr) => {
    const d = new Date(dateStr);
    const diffTime = Math.abs(today - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= streak; // Seri sayısı kadar günü aktif yap
  };

  return (
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Flame size={20} className="text-orange-500" /> Günlük Seri
        </h3>
      </div>
      <p className="text-sm text-gray-400 mb-6">{currentYear} Yılı • {streak} Günlük Aktif Yolculuk</p>
      
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
                let bgClass = "bg-[#1A3826]"; // pasif gün
                if (isActive) bgClass = "bg-[#10b981] shadow-sm shadow-[#10b981]/40";
                if (isToday && !isActive) bgClass = "bg-[#f59e0b]"; // Bugün sisteme girmemişse turuncu
                if (isToday && isActive) bgClass = "bg-[#10b981] ring-2 ring-white ring-offset-1 ring-offset-[#132A1D]"; // Bugün sisteme girdiyse beyaz çerçeve
                
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
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Son Dinlediklerim</h3>
      </div>
      <div className="space-y-4">
        {audios.map((a, i) => (
          <div key={i} className="flex items-center gap-4 bg-[#0A1A12] p-3 rounded-2xl border border-[#1A3826] cursor-pointer hover:border-[#10b981] transition-colors"
               onClick={() => navigate(`/content/${a.type}/${a.slug}`)}>
            <button className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#10b981]/20">
              <Play size={20} className="ml-1" />
            </button>
            <div className="flex-1">
              <div className="font-bold">{a.title}</div>
              <div className="text-xs text-gray-400 capitalize">{a.type}</div>
              <div className="mt-2 bg-[#1A3826] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#10b981] h-full rounded-full" style={{ width: `${a.progress}%` }}></div>
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
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Bookmark size={20} className="text-[#10b981]" /> Kaydedilenler
        </h3>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {saved.map((s, i) => (
          <div key={i} onClick={() => navigate(`/content/${s.type}/${s.slug}`)} className="min-w-[160px] h-32 relative rounded-2xl overflow-hidden border border-[#1A3826] group cursor-pointer hover:border-[#f59e0b] transition-colors">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20 z-10"></div>
            <div className="absolute inset-0 bg-[#0A1A12]">
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

// 8. Rozet Galerisi
function BadgeGallery() {
  const badges = [
    { title: "Kur'an Ustası", icon: "📖", color: "from-yellow-400 to-amber-600" },
    { title: "Ramazan Kahramanı", icon: "🌙", color: "from-blue-400 to-indigo-600" },
    { title: "100 Dua", icon: "📿", color: "from-emerald-400 to-teal-600" },
    { title: "Hadis Alimi", icon: "📜", color: "from-purple-400 to-fuchsia-600" }
  ];

  return (
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#f59e0b] opacity-5 rounded-full blur-3xl"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Award size={20} className="text-[#f59e0b]" /> Rozet Galerisi
        </h3>
        <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">Tümünü Gör <ChevronRight size={16} /></button>
      </div>

      <div className="flex justify-between relative z-10 px-2">
        {badges.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-2xl rotate-45 flex items-center justify-center bg-gradient-to-br ${b.color} p-[2px] shadow-lg shadow-amber-500/10`}>
              <div className="w-full h-full bg-[#0A1A12] rounded-2xl flex items-center justify-center">
                <div className="-rotate-45 text-2xl">{b.icon}</div>
              </div>
            </div>
            <div className="text-[10px] font-bold mt-2 text-center w-16 leading-tight">{b.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 9. Kişisel Hedefler
function PersonalGoals() {
  return (
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Target size={20} className="text-[#10b981]" /> Kişisel Hedeflerim
        </h3>
        <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">Tümünü Gör <ChevronRight size={16} /></button>
      </div>
      <div className="space-y-3">
        <GoalItem text="5 Hadis ezberle" progress="3/5" done={false} />
        <GoalItem text="20 Dua oku" progress="20/20" done={true} />
        <GoalItem text="Rahman Suresi'ni tamamla" progress="1/1" done={true} />
        <GoalItem text="3 Makale oku" progress="1/3" done={false} />
      </div>
    </div>
  );
}

function GoalItem({ text, progress, done }) {
  return (
    <div className="flex items-center gap-3 bg-[#0A1A12] p-3 rounded-xl border border-[#1A3826]">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${done ? 'bg-[#10b981]' : 'border-2 border-[#1A3826]'}`}>
        {done && <CheckCircle2 size={16} className="text-white" />}
      </div>
      <div className={`flex-1 text-sm ${done ? 'text-gray-400 line-through' : 'text-white font-medium'}`}>{text}</div>
      <div className="text-xs text-gray-500 font-mono">{progress}</div>
    </div>
  );
}

// 10. AI Analizi
function AIAssistantCard() {
  return (
    <div className="relative bg-gradient-to-br from-[#0A2A1E] to-[#0A1A12] border border-[#10b981]/30 rounded-3xl p-6 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#10b981]/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#10b981]/20 text-[#10b981] px-3 py-1 rounded-full text-xs font-bold mb-4">
          <Sparkles size={14} /> AI Asistan Analizi
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          "Son 15 gündür <span className="text-white font-bold">dua</span> içeriklerine ilgi gösteriyorsun. 
          Sana <span className="text-[#f59e0b] font-bold">Esmâü'l Hüsna</span> serisini öneriyorum."
        </p>
        <button className="bg-[#10b981] hover:bg-[#059669] text-white text-sm font-bold py-2 px-5 rounded-xl transition-colors">
          Seriyi Keşfet
        </button>
      </div>

      <div className="absolute right-0 bottom-0 opacity-50 w-32 h-32 pointer-events-none">
        {/* Placeholder for Robot/AI visual. */}
        <div className="w-full h-full bg-gradient-to-br from-[#10b981] to-transparent rounded-tl-full blur-2xl"></div>
      </div>
    </div>
  );
}

// 11. İlim Haritası
function KnowledgeMap() {
  return (
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BookOpen size={20} className="text-[#10b981]" /> İlim Haritası
        </h3>
        <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">Tümünü Gör <ChevronRight size={16} /></button>
      </div>
      
      <div className="relative h-64 flex items-center justify-center">
        {/* Central Node */}
        <div className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] z-20 relative">
          <BookOpen size={30} className="text-white" />
        </div>

        {/* Connecting Lines (Simulated with absolute positioning) */}
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#1A3826" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#1A3826" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="#10b981" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#1A3826" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="#10b981" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="#1A3826" strokeWidth="2" />
        </svg>

        {/* Outer Nodes */}
        <MapNode top="20%" left="25%" label="Kur'an" icon={<BookOpen size={14}/>} completed={false} />
        <MapNode top="20%" left="75%" label="Siyer" icon={<Star size={14}/>} completed={false} />
        <MapNode top="80%" left="25%" label="Fıkıh" icon={<BookOpen size={14}/>} completed={true} />
        <MapNode top="80%" left="75%" label="Ahlak" icon={<BookOpen size={14}/>} completed={false} />
        <MapNode top="50%" left="15%" label="Dua & Zikir" icon={<BookOpen size={14}/>} completed={true} />
        <MapNode top="50%" left="85%" label="Tasavvuf" icon={<BookOpen size={14}/>} completed={false} />
      </div>
    </div>
  );
}

function MapNode({ top, left, label, icon, completed }) {
  return (
    <div className="absolute flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ top, left }}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed ? 'bg-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white' : 'bg-[#1A3826] border border-gray-600 text-gray-500'}`}>
        {completed ? icon : <div className="w-2 h-2 rounded-full bg-gray-500"></div>}
      </div>
      <div className="text-[10px] font-bold bg-[#0A1A12]/80 px-2 py-0.5 rounded backdrop-blur-sm whitespace-nowrap">{label}</div>
    </div>
  );
}

// 12. Yaklaşan Günler
function UpcomingEvents() {
  return (
    <div className="bg-[#132A1D] border border-[#1A3826] rounded-3xl p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Calendar size={20} className="text-[#10b981]" /> Yaklaşan Günler
        </h3>
        <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">Tümünü Gör <ChevronRight size={16} /></button>
      </div>
      <div className="space-y-3">
        <EventItem name="Kadir Gecesi" days="12 gün kaldı" date="27 Mar 2025" />
        <EventItem name="Ramazan Bayramı" days="83 gün kaldı" date="30 Mar 2025" />
        <EventItem name="Arefe Günü" days="96 gün kaldı" date="14 Haz 2025" />
      </div>
    </div>
  );
}

function EventItem({ name, days, date }) {
  return (
    <div className="flex justify-between items-center bg-[#0A1A12] p-4 rounded-xl border border-[#1A3826]">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#1A3826] rounded-lg text-[#10b981]">
          <Calendar size={18} />
        </div>
        <div>
          <div className="font-bold text-sm">{name}</div>
          <div className="text-xs text-[#10b981] mt-0.5">{days}</div>
        </div>
      </div>
      <div className="text-xs text-gray-500">{date}</div>
    </div>
  );
}