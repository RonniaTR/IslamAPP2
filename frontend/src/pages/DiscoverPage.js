import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscoverHeader } from '../components/discover/DiscoverHeader';
import { VerseOfTheDayCard } from '../components/discover/VerseOfTheDayCard';
import { QuickCategories } from '../components/discover/QuickCategories';
import { ChallengeAndBadgeSection } from '../components/discover/ChallengeAndBadgeSection';
import { useDiscoverContent } from '../hooks/useDiscoverContent';
import { getDailyHadith } from '../data/dailyHadith';
import { getHistory } from '../services/pathEngine';
import { getCachedStats } from '../services/gamification';
import { 
  Loader2, PenTool, BookOpen, Gamepad2, Moon, Library, 
  Compass, Route, ChevronRight, Sparkles, ArrowRight,
  Trophy, Star, Zap, Volume2, Pause, Share2, Check, Scroll
} from 'lucide-react';

/* ─── Stagger animation helper ─── */
function FadeIn({ children, delay = 0, className = '' }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`transition-all duration-700 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Featured Module Cards (Vitrin) ─── */
const FEATURED_MODULES = [
  {
    path: '/donus',
    icon: Sparkles,
    title: 'Geri Dönüş Odası (Kırk Perde)',
    desc: 'Kırk perde, kırk gün. Yargılamayan, tasavvufi ve içsel bir yolculuk. Belki çağrıldın.',
    color: '#D97706',
    gradient: 'from-amber-900 via-stone-900 to-emerald-950',
    badge: 'KIRK PERDE',
    badgeColor: '#F59E0B',
  },
  {
    path: '/siyer',
    icon: Moon,
    title: 'Siyer-i Nebî',
    desc: 'Efendimizin (s.a.v.) hayatı, gazveleri ve kronolojisi — özet anlatım.',
    color: '#F59E0B',
    gradient: 'from-amber-700 via-orange-800 to-emerald-950',
    badge: 'YENİ & ZENGİN',
    badgeColor: '#F59E0B',
  },
  {
    path: '/prophets',
    icon: Star,
    title: 'Peygamberler Tarihi',
    desc: 'Kur\'an-ı Kerim\'de adı geçen 25 Peygamberin hayatı, mucizeleri ve insanlığa bıraktığı ibretler.',
    color: '#10B981',
    gradient: 'from-emerald-700 to-teal-900',
    badge: '25 PEYGAMBER',
    badgeColor: '#10B981',
  },
  {
    path: '/elifba',
    icon: PenTool,
    title: 'Elif-Ba',
    desc: 'Kur\'an harflerini etkileşimli derslerle öğren. Sesli telaffuz, yazma pratiği ve ilerleme takibi.',
    color: '#14B8A6',
    gradient: 'from-teal-600 to-emerald-700',
    badge: 'POPÜLER',
    badgeColor: '#14B8A6',
  },
  {
    path: '/stories',
    icon: BookOpen,
    title: 'İbretlik Kıssalar',
    desc: 'Peygamber hikâyelerini interaktif duraklar ve hikmetli sorular eşliğinde keşfet.',
    color: '#8B5CF6',
    gradient: 'from-violet-600 to-purple-800',
    badge: 'HİKÂYE',
    badgeColor: '#8B5CF6',
  },
  {
    path: '/games',
    icon: Gamepad2,
    title: 'Oyun Merkezi',
    desc: '14 farklı oyun modu: Blitz, Hayatta Kal, Boss Savaşı, Hikâye Modu ve daha fazlası!',
    color: '#84CC16',
    gradient: 'from-lime-600 to-green-700',
    badge: '14 OYUN',
    badgeColor: '#84CC16',
  },
];

/* ─── Quick Access Grid ─── */
const QUICK_ACCESS = [
  { path: '/hazine', icon: Compass, title: 'Nur Hazinesi', desc: 'Dualar ve sırlar', color: '#F59E0B' },
  { path: '/yol', icon: Route, title: 'Nur Yolu', desc: 'Kişisel gelişim', color: '#10B981' },
  { path: '/night', icon: Moon, title: 'Gece Modu', desc: 'Uyku öncesi', color: '#6366F1' },
  { path: '/library', icon: Library, title: 'Kütüphane', desc: 'Makaleler', color: '#EC4899' },
  { path: '/hifz', icon: BookOpen, title: 'Ezber Asistanı', desc: 'Sure ezberi', color: '#3B82F6' },
  { path: '/journal', icon: BookOpen, title: 'Amel Defteri', desc: 'Günlük muhasebe', color: '#F97316' },
];

/* ─── Game Previews ─── */
const GAME_PREVIEWS = [
  { id: 'adventure', title: 'İslam Tarihi Macerası', emoji: '🌍', desc: "Mekke'den Veda Hutbesi'ne", color: '#F59E0B', xp: '80+' },
  { id: 'rapid', title: 'Blitz Modu', emoji: '⚡', desc: '30 saniyede bilgini test et', color: '#EAB308', xp: '150+' },
  { id: 'boss', title: 'Boss Savaşı', emoji: '🐉', desc: 'Bilgi canavarlarını yen', color: '#EF4444', xp: '200+' },
  { id: 'story', title: 'Hikâye Modu', emoji: '📜', desc: 'Kıssaların içinde yolculuk', color: '#D946EF', xp: '55+' },
];

export default function DiscoverPage() {
  useDiscoverContent();
  // Başlıktaki sayılar gerçek veridir: yolda geçen gün (cihaz) ve seviye (oyunlaştırma önbelleği).
  const activeDays = Object.values(getHistory()).filter((h) => h.done > 0).length;
  const liveStats = getCachedStats();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [isPlayingHadith, setIsPlayingHadith] = useState(false);
  const [copiedHadith, setCopiedHadith] = useState(false);

  const dailyHadith = getDailyHadith();

  useEffect(() => { setLoaded(true); }, []);

  const toggleHadithAudio = () => {
    if (isPlayingHadith) {
      window.speechSynthesis.cancel();
      setIsPlayingHadith(false);
    } else {
      if ('speechSynthesis' in window) {
        const text = `${dailyHadith.turkish}. Hadis-i Şerif Kaynağı: ${dailyHadith.source}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingHadith(false);
        utterance.onerror = () => setIsPlayingHadith(false);

        setIsPlayingHadith(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleCopyHadith = () => {
    const text = `"${dailyHadith.turkish}"\n- ${dailyHadith.narrator} (${dailyHadith.source})\n\nNur App ile öğreniyorum 🌟`;
    navigator.clipboard.writeText(text);
    setCopiedHadith(true);
    setTimeout(() => setCopiedHadith(false), 2000);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="w-10 h-10 text-[#10b981] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-[var(--bg-primary)] text-white relative font-sans overflow-x-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#072F21] via-[#0A1F15] to-[#0A1A12] z-0 pointer-events-none" />
      
      {/* Subtle pattern */}
      <div className="absolute top-0 left-0 right-0 h-[600px] opacity-[0.03] pointer-events-none z-[1]" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col max-w-4xl mx-auto">
        
        {/* ── Header ── */}
        <FadeIn delay={0}>
          <DiscoverHeader streak={activeDays} level={liveStats?.level || 1} />
        </FadeIn>

        {/* ── Günün Ayeti ── */}
        <FadeIn delay={100} className="px-4 mt-6">
          <VerseOfTheDayCard />
        </FadeIn>

        {/* ── Günün Hadis-i Şerifi (YENİ & SÜPER) ── */}
        <FadeIn delay={150} className="px-4 mt-6">
          <div className="bg-gradient-to-br from-[#132A1D] to-[#0D2418] border border-[color:var(--bg-surface-light)] rounded-[28px] p-5 relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20 px-3 py-1 rounded-full text-xs font-bold">
                <Scroll size={14} />
                <span>Günün Hadis-i Şerifi</span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-md">
                Ravi: {dailyHadith.narrator}
              </span>
            </div>

            {/* Arabic Text */}
            <div className="text-right text-2xl text-[color:var(--gold)] font-arabic leading-relaxed mb-3 dir-rtl" style={{ textShadow: '0 2px 8px rgba(205,164,52,0.15)' }}>
              {dailyHadith.arabic}
            </div>

            {/* Turkish Translation */}
            <p className="text-gray-200 text-xs md:text-sm leading-relaxed mb-3 italic font-medium">
              "{dailyHadith.turkish}"
            </p>

            {/* Source & Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <span className="text-[11px] text-[#d97706] font-semibold">{dailyHadith.source}</span>

              <div className="flex gap-2">
                <button
                  onClick={toggleHadithAudio}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1 ${isPlayingHadith ? 'bg-[#d97706] text-stone-950 border-[#d97706]' : 'bg-[var(--bg-primary)] text-gray-300 border-[color:var(--bg-surface-light)] hover:border-[#d97706]'}`}
                >
                  {isPlayingHadith ? <Pause size={12} /> : <Volume2 size={12} className="text-[#d97706]" />}
                  <span>{isPlayingHadith ? 'Durdur' : 'Sesli Oku'}</span>
                </button>

                <button
                  onClick={handleCopyHadith}
                  className="px-3 py-1.5 rounded-full border bg-[var(--bg-primary)] border-[color:var(--bg-surface-light)] text-gray-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                >
                  {copiedHadith ? <Check size={12} className="text-green-400" /> : <Share2 size={12} className="text-gray-400" />}
                  <span>{copiedHadith ? 'Kopyalandı' : 'Paylaş'}</span>
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Hızlı Kategoriler ── */}
        <FadeIn delay={200} className="mt-8">
          <QuickCategories />
        </FadeIn>

        {/* ── Vitrin: Öne Çıkan Modüller ── */}
        <FadeIn delay={300} className="mt-10 px-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#f59e0b]" />
              <h2 className="text-xl font-bold text-white tracking-wide">Öne Çıkan İlim Modülleri</h2>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {FEATURED_MODULES.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <FadeIn key={mod.path} delay={350 + i * 80}>
                  <button
                    onClick={() => navigate(mod.path)}
                    className={`w-full bg-gradient-to-r ${mod.gradient} rounded-[28px] p-5 text-start relative overflow-hidden group transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-2xl`}
                  >
                    {/* Decorative glow */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-all" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
                      <Icon size={96} />
                    </div>

                    <div className="relative z-10 flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                        <Icon size={28} className="text-white drop-shadow-md" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                          <span 
                            className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider text-white shadow-sm"
                            style={{ backgroundColor: mod.badgeColor + '40', borderColor: mod.badgeColor, borderWidth: 1 }}
                          >
                            {mod.badge}
                          </span>
                        </div>
                        <p className="text-white/70 text-[13px] leading-relaxed pe-8">{mod.desc}</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} className="text-white" />
                    </div>
                  </button>
                </FadeIn>
              );
            })}
          </div>
        </FadeIn>

        {/* ── Hızlı Erişim Grid ── */}
        <FadeIn delay={600} className="mt-10 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white tracking-wide">Hızlı Erişim</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACCESS.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <FadeIn key={mod.path} delay={650 + i * 60}>
                  <button
                    onClick={() => navigate(mod.path)}
                    className="flex items-center gap-3 bg-[#0D2418] border border-white/5 p-3.5 rounded-2xl text-start hover:bg-[#123121] hover:border-white/10 transition-all group w-full"
                  >
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3"
                      style={{ backgroundColor: `${mod.color}20`, color: mod.color }}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{mod.title}</p>
                      <p className="text-[11px] text-gray-400 truncate">{mod.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </FadeIn>
              );
            })}
          </div>
        </FadeIn>

        {/* ── Oyun Tanıtımları ── */}
        <FadeIn delay={850} className="mt-10">
          <div className="flex items-center justify-between px-4 mb-4">
            <div className="flex items-center gap-2">
              <Gamepad2 size={18} className="text-[#84CC16]" />
              <h2 className="text-xl font-bold text-white tracking-wide">Oyun Dünyası</h2>
            </div>
            <button 
              onClick={() => navigate('/games')} 
              className="text-xs text-[#10b981] font-medium flex items-center gap-1 hover:text-[#059669] transition-colors"
            >
              Tümü <ChevronRight size={14} />
            </button>
          </div>

          <div className="ps-4 pb-4 flex gap-3 overflow-x-auto no-scrollbar snap-x">
            {GAME_PREVIEWS.map((game, idx) => (
              <FadeIn key={game.id} delay={900 + idx * 60}>
                <button
                  onClick={() => navigate('/games')}
                  className="relative min-w-[150px] w-[150px] h-[190px] rounded-[24px] overflow-hidden snap-start shrink-0 cursor-pointer group shadow-xl text-start"
                  style={{ backgroundColor: game.color + '15' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A1A12]/90 pointer-events-none" />
                  
                  <div className="absolute top-4 right-3 text-5xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">
                    {game.emoji}
                  </div>
                  
                  <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                    <div>
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl mb-3 shadow-inner"
                        style={{ backgroundColor: game.color + '25' }}
                      >
                        {game.emoji}
                      </div>
                      <h3 className="text-white text-sm font-bold leading-tight">{game.title}</h3>
                      <p className="text-gray-400 text-[10px] mt-1">{game.desc}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Zap size={10} className="text-[#f59e0b]" />
                        <span className="text-[9px] font-bold text-[#f59e0b]">{game.xp} XP</span>
                      </div>
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: game.color + '30' }}
                      >
                        <ArrowRight size={12} style={{ color: game.color }} />
                      </div>
                    </div>
                  </div>
                </button>
              </FadeIn>
            ))}
            <div className="min-w-[1px] shrink-0" />
          </div>
        </FadeIn>

        {/* ── Günlük Challenge & Rozet ── */}
        <FadeIn delay={1100} className="mt-6">
          <ChallengeAndBadgeSection />
        </FadeIn>

        <div className="h-8" />
      </div>
    </div>
  );
}