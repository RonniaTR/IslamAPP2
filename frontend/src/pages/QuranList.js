import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, BookOpen, Youtube, X, BookMarked, Star, Filter } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import PreReadingDua from '../components/PreReadingDua';
import api from '../api';

const quranI18n = {
  tr: { title: "Kur'an-ı Kerim", searchPlaceholder: 'Sure veya ayet ara...', listenMeal: 'Türkçe Meal Dinle', juz30: '30 Cüz', searching: 'Ayetlerde aranıyor...', foundVerses: (q, c) => `"${q}" için ${c} ayet bulundu`, noResults: (q) => `"${q}" için sonuç bulunamadı`, andMore: (n) => `ve ${n} sonuç daha...`, matchingSurahs: 'Eşleşen Sureler:', loading: 'Yükleniyor...', verses: 'ayet', meccan: 'Mekki', medinan: 'Medeni', all: 'Tümü', readDua: 'Dua ile Başla', revelation: 'İniş Yeri' },
  en: { title: "Holy Quran", searchPlaceholder: 'Search surah or verse...', listenMeal: 'Listen Translation', juz30: '30 Juz', searching: 'Searching verses...', foundVerses: (q, c) => `Found ${c} verses for "${q}"`, noResults: (q) => `No results for "${q}"`, andMore: (n) => `and ${n} more...`, matchingSurahs: 'Matching Surahs:', loading: 'Loading...', verses: 'verses', meccan: 'Meccan', medinan: 'Medinan', all: 'All', readDua: 'Begin with Dua', revelation: 'Revelation' },
  ar: { title: "القرآن الكريم", searchPlaceholder: 'ابحث عن سورة أو آية...', listenMeal: 'استمع للترجمة', juz30: '٣٠ جزء', searching: 'جاري البحث...', foundVerses: (q, c) => `وُجدت ${c} آية لـ "${q}"`, noResults: (q) => `لا نتائج لـ "${q}"`, andMore: (n) => `و ${n} نتيجة أخرى...`, matchingSurahs: 'السور المطابقة:', loading: 'جاري التحميل...', verses: 'آيات', meccan: 'مكية', medinan: 'مدنية', all: 'الكل', readDua: 'ابدأ بالدعاء', revelation: 'مكان النزول' },
};

// Islamic geometric pattern SVG for background
function GeometricBg({ color }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
      <svg className="absolute -top-20 -right-20 w-80 h-80 animate-geometric-spin" viewBox="0 0 200 200" fill="none">
        <polygon points="100,10 127,40 170,40 135,65 150,105 100,80 50,105 65,65 30,40 73,40" stroke={color} strokeWidth="0.5" />
        <circle cx="100" cy="100" r="85" stroke={color} strokeWidth="0.3" />
        <circle cx="100" cy="100" r="60" stroke={color} strokeWidth="0.3" />
        <polygon points="100,20 140,50 140,90 100,120 60,90 60,50" stroke={color} strokeWidth="0.4" />
      </svg>
      <svg className="absolute -bottom-16 -left-16 w-64 h-64 animate-geometric-spin" style={{ animationDirection: 'reverse', animationDuration: '80s' }} viewBox="0 0 200 200" fill="none">
        <rect x="50" y="50" width="100" height="100" stroke={color} strokeWidth="0.5" transform="rotate(45 100 100)" />
        <rect x="60" y="60" width="80" height="80" stroke={color} strokeWidth="0.3" transform="rotate(22.5 100 100)" />
        <circle cx="100" cy="100" r="70" stroke={color} strokeWidth="0.3" />
      </svg>
    </div>
  );
}

export default function QuranList() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const txt = quranI18n[lang] || quranI18n.tr;
  const isRTL = lang === 'ar';
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showDua, setShowDua] = useState(false);
  const [duaTarget, setDuaTarget] = useState(null);
  const [filterType, setFilterType] = useState('all'); // all, meccan, medinan

  useEffect(() => {
    api.get('/quran/surahs').then(r => { if (Array.isArray(r.data)) setSurahs(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (search.length < 2) { setSearchResults(null); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get(`/quran/search?query=${encodeURIComponent(search)}`);
        setSearchResults(data);
      } catch { setSearchResults(null); }
      setSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSurahClick = (surahNumber) => {
    const duaSeen = sessionStorage.getItem('quran_dua_seen');
    if (!duaSeen) {
      setDuaTarget(surahNumber);
      setShowDua(true);
    } else {
      navigate(`/quran/${surahNumber}`);
    }
  };

  const handleDuaClose = () => {
    setShowDua(false);
    sessionStorage.setItem('quran_dua_seen', '1');
    if (duaTarget) navigate(`/quran/${duaTarget}`);
  };

  const filtered = surahs.filter(s => {
    const matchesSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.arabic?.includes(search) || s.turkish_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.meaning?.toLowerCase().includes(search.toLowerCase()) || String(s.number).includes(search);
    const matchesFilter = filterType === 'all' ||
      (filterType === 'meccan' && (s.revelation === 'Mekki' || s.revelation === 'Meccan')) ||
      (filterType === 'medinan' && (s.revelation === 'Medeni' || s.revelation === 'Medinan'));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }} data-testid="quran-list">
      <PreReadingDua show={showDua} onClose={handleDuaClose} />

      {/* Hero Header */}
      <div className="quran-header-bg px-5 pt-10 pb-5">
        <GeometricBg color={theme.gold} />

        {/* Title Row */}
        <div className="relative flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center animate-float" style={{
            background: `linear-gradient(135deg, ${theme.gold}20, ${theme.gold}08)`,
            border: `1px solid ${theme.gold}20`,
          }}>
            <BookOpen size={20} style={{ color: theme.gold }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
              {txt.title}
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: theme.textSecondary }}>
              {surahs.length > 0 ? `${surahs.length} ${t.surahs || 'Sure'}` : ''}
            </p>
          </div>
          {/* Dua button */}
          <button
            onClick={() => { setDuaTarget(null); setShowDua(true); }}
            className="ml-auto px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all active:scale-95"
            style={{ background: `${theme.gold}12`, color: theme.gold, border: `1px solid ${theme.gold}15` }}
          >
            <BookMarked size={13} className="inline mr-1 -mt-0.5" />
            {txt.readDua}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textSecondary }} />
          <input
            type="text"
            placeholder={txt.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            data-testid="quran-search-input"
            className="w-full rounded-2xl pl-10 pr-10 py-3 text-sm focus:outline-none transition-all"
            style={{
              background: `${theme.surface}80`,
              border: `1px solid ${theme.gold}12`,
              color: theme.textPrimary,
              backdropFilter: 'blur(12px)',
            }}
          />
          {search && (
            <button onClick={() => { setSearch(''); setSearchResults(null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: theme.textSecondary }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-3">
          {[
            { id: 'all', label: txt.all },
            { id: 'meccan', label: txt.meccan },
            { id: 'medinan', label: txt.medinan },
          ].map(f => (
            <button key={f.id} onClick={() => setFilterType(f.id)}
              className="px-3.5 py-1.5 rounded-xl text-[11px] font-medium transition-all"
              style={{
                background: filterType === f.id ? `${theme.gold}20` : `${theme.surface}60`,
                color: filterType === f.id ? theme.gold : theme.textSecondary,
                border: `1px solid ${filterType === f.id ? `${theme.gold}30` : 'transparent'}`,
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Meal Audio Link */}
        <button onClick={() => navigate('/meal-audio')} data-testid="meal-audio-link"
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left active:scale-[0.98] transition-all"
          style={{
            background: 'rgba(220,50,50,0.06)',
            border: '1px solid rgba(220,50,50,0.1)',
            backdropFilter: 'blur(8px)',
          }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,50,50,0.1)' }}>
            <Youtube size={18} className="text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{txt.listenMeal}</p>
            <p className="text-[11px]" style={{ color: theme.textSecondary }}>Mazlum Kiper · {txt.juz30}</p>
          </div>
          <ChevronRight size={16} style={{ color: theme.textSecondary }} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-6 pt-2">
        {/* Searching indicator */}
        <AnimatePresence>
          {searching && (
            <motion.div className="text-center py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-5 h-5 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: theme.gold, borderTopColor: 'transparent' }} />
              <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>{txt.searching}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verse search results */}
        {searchResults && searchResults.count > 0 && (
          <motion.div className="mb-4" data-testid="verse-search-results"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p className="text-xs mb-3 flex items-center gap-1" style={{ color: theme.gold }}>
              <Search size={12} />
              {txt.foundVerses(searchResults.query, searchResults.count)}
            </p>
            <div className="space-y-2">
              {(Array.isArray(searchResults.results) ? searchResults.results : []).slice(0, 20).map((r, i) => (
                <motion.button key={i} onClick={() => handleSurahClick(r.surah_number)}
                  data-testid={`search-result-${i}`}
                  className="w-full text-left quran-surah-card animate-surah-card"
                  style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-lg font-medium"
                      style={{ background: `${theme.gold}12`, color: theme.gold }}>
                      {r.surah_name} {r.verse_number}
                    </span>
                  </div>
                  {r.arabic && <p className="arabic-text text-sm mb-1 line-clamp-2" style={{ color: `${theme.textPrimary}cc` }}>{r.arabic}</p>}
                  <p className="text-xs line-clamp-2" style={{ color: theme.textSecondary }}>{r.turkish}</p>
                </motion.button>
              ))}
              {searchResults.count > 20 && (
                <p className="text-center text-[10px]" style={{ color: theme.textSecondary }}>{txt.andMore(searchResults.count - 20)}</p>
              )}
            </div>
          </motion.div>
        )}

        {searchResults && searchResults.count === 0 && (
          <p className="text-center text-xs py-4" style={{ color: theme.textSecondary }}>{txt.noResults(searchResults.query)}</p>
        )}

        {/* Surah list */}
        {loading ? (
          <div className="text-center py-12" style={{ color: theme.textSecondary }}>
            <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto mb-2" style={{ borderColor: theme.gold, borderTopColor: 'transparent' }} />
            {txt.loading}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.length > 0 && search.length >= 2 && searchResults && searchResults.count > 0 && (
              <p className="text-xs mb-2" style={{ color: theme.textSecondary }}>{txt.matchingSurahs}</p>
            )}
            {filtered.map((surah, idx) => (
              <button key={surah.number} onClick={() => handleSurahClick(surah.number)}
                data-testid={`surah-item-${surah.number}`}
                className="w-full flex items-center gap-3 quran-surah-card animate-surah-card text-left"
                style={{ animationDelay: `${Math.min(idx, 15) * 30}ms` }}>

                {/* Diamond number badge */}
                <div className="quran-number-badge shrink-0">
                  <span className="relative z-10">{surah.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{surah.turkish_name || surah.name}</p>
                    <p className="arabic-text text-base" style={{ color: `${theme.gold}cc` }}>{surah.arabic}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px]" style={{ color: theme.textSecondary }}>{surah.meaning}</span>
                    <span className="text-[11px]" style={{ color: `${theme.textSecondary}60` }}>·</span>
                    <span className="text-[11px]" style={{ color: theme.textSecondary }}>{surah.total_verses || surah.verses} {txt.verses}</span>
                    <span className="text-[11px]" style={{ color: `${theme.textSecondary}60` }}>·</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{
                      background: (surah.revelation === 'Mekki' || surah.revelation === 'Meccan') ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.08)',
                      color: (surah.revelation === 'Mekki' || surah.revelation === 'Meccan') ? '#f59e0b' : '#3b82f6',
                    }}>{surah.revelation}</span>
                  </div>
                </div>
                <ChevronRight size={15} style={{ color: `${theme.textSecondary}60` }} className="shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
