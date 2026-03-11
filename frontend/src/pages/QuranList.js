import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, BookOpen, Youtube, X } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import api from '../api';

export default function QuranList() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    api.get('/quran/surahs').then(r => { if (Array.isArray(r.data)) setSurahs(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  // Debounced verse search
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

  const filtered = surahs.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.arabic?.includes(search) ||
    s.turkish_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.meaning?.toLowerCase().includes(search.toLowerCase()) ||
    String(s.number).includes(search)
  );

  return (
    <div className="animate-fade-in" data-testid="quran-list">
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(180deg, rgba(15,61,46,0.5) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-[#D4AF37]" />
          <h1 className="text-xl font-bold text-[#F5F5DC]" style={{ fontFamily: 'Playfair Display, serif' }}>{t.quran || "Kur'an-ı Kerim"}</h1>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B5A0]" />
          <input type="text" placeholder="Sure veya ayet ara..." value={search} onChange={e => setSearch(e.target.value)}
            data-testid="quran-search-input"
            className="w-full bg-[#0F3D2E]/50 border border-[#D4AF37]/15 rounded-xl pl-9 pr-9 py-2.5 text-sm text-[#F5F5DC] placeholder:text-[#A8B5A0]/50 focus:outline-none focus:border-[#D4AF37]/30" />
          {search && (
            <button onClick={() => { setSearch(''); setSearchResults(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8B5A0]">
              <X size={16} />
            </button>
          )}
        </div>
        <button onClick={() => navigate('/meal-audio')} data-testid="meal-audio-link"
          className="mt-3 w-full flex items-center gap-3 p-3 rounded-xl text-left active:scale-[0.98] transition-transform"
          style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.15)' }}>
          <Youtube size={20} className="text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#F5F5DC]">{t.listen_meal || 'Türkçe Meal Dinle'}</p>
            <p className="text-[11px] text-[#A8B5A0]">Mazlum Kiper · 30 Cüz</p>
          </div>
          <ChevronRight size={16} className="text-[#A8B5A0]" />
        </button>
      </div>

      <div className="px-4 pb-6">
        {/* Verse search results */}
        {searching && (
          <div className="text-center py-4">
            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#A8B5A0] mt-2">Ayetlerde aranıyor...</p>
          </div>
        )}

        {searchResults && searchResults.count > 0 && (
          <div className="mb-4" data-testid="verse-search-results">
            <p className="text-xs text-[#D4AF37] mb-3 flex items-center gap-1">
              <Search size={12} />
              "{searchResults.query}" için {searchResults.count} ayet bulundu
            </p>
            <div className="space-y-2">
              {(Array.isArray(searchResults.results) ? searchResults.results : []).slice(0, 20).map((r, i) => (
                <button key={i} onClick={() => navigate(`/quran/${r.surah_number}`)}
                  data-testid={`search-result-${i}`}
                  className="w-full text-left card-islamic rounded-xl p-3 transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md text-[#D4AF37]" style={{ background: 'rgba(212,175,55,0.15)' }}>
                      {r.surah_name} {r.verse_number}
                    </span>
                  </div>
                  {r.arabic && <p className="arabic-text text-sm text-[#F5F5DC]/80 mb-1 line-clamp-2">{r.arabic}</p>}
                  <p className="text-xs text-[#A8B5A0] line-clamp-2">{r.turkish}</p>
                </button>
              ))}
              {searchResults.count > 20 && <p className="text-center text-[10px] text-[#A8B5A0]">ve {searchResults.count - 20} sonuç daha...</p>}
            </div>
          </div>
        )}

        {searchResults && searchResults.count === 0 && (
          <p className="text-center text-xs text-[#A8B5A0] py-4">"{searchResults.query}" için sonuç bulunamadı</p>
        )}

        {/* Surah list */}
        {loading ? (
          <div className="text-center py-12 text-[#A8B5A0]">Yükleniyor...</div>
        ) : (
          <div className="space-y-1.5">
            {filtered.length > 0 && search.length >= 2 && searchResults && searchResults.count > 0 && (
              <p className="text-xs text-[#A8B5A0] mb-2">Eşleşen Sureler:</p>
            )}
            {filtered.map(surah => (
              <button key={surah.number} onClick={() => navigate(`/quran/${surah.number}`)}
                data-testid={`surah-item-${surah.number}`}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#0F3D2E]/50 transition-colors text-left active:bg-[#0F3D2E]/80">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{surah.number}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#F5F5DC]">{surah.turkish_name || surah.name}</p>
                    <p className="arabic-text text-base text-[#D4AF37]/80">{surah.arabic}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[#A8B5A0]">{surah.meaning}</span>
                    <span className="text-[11px] text-[#A8B5A0]/50">·</span>
                    <span className="text-[11px] text-[#A8B5A0]">{surah.verses} ayet</span>
                    <span className="text-[11px] text-[#A8B5A0]/50">·</span>
                    <span className="text-[11px] text-[#A8B5A0]">{surah.revelation}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
