import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  BookmarkPlus,
  CheckCircle2,
  Loader2,
  Search,
  Sparkles,
  Star,
  Volume2,
  Waves,
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import localHadiths from '../data/hadiths.json';

// Derive categories from embedded data
const LOCAL_CATEGORIES = (() => {
  const map = {};
  localHadiths.forEach(h => {
    if (h.categoryId && !map[h.categoryId]) map[h.categoryId] = { id: h.categoryId, name: h.category || h.categoryId };
  });
  return Object.values(map);
})();

export default function HadithPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const [categories, setCategories] = useState(LOCAL_CATEGORIES);
  const [hadiths, setHadiths] = useState(localHadiths);
  const [selected, setSelected] = useState('all');
  const [expandedHadith, setExpandedHadith] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioLoadingId, setAudioLoadingId] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    // Try API; local data already loaded as default
    Promise.all([
      api.get('/hadith/categories'),
      api.get('/hadith/all'),
    ])
      .then(([categoryResponse, hadithResponse]) => {
        if (!mounted) return;
        if (Array.isArray(categoryResponse.data) && categoryResponse.data.length) setCategories(categoryResponse.data);
        if (Array.isArray(hadithResponse.data) && hadithResponse.data.length) setHadiths(hadithResponse.data);
      })
      .catch(() => {
        // Keep local data
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const filtered = useMemo(() => hadiths.filter((hadith) => {
    const categoryMatch = selected === 'all'
      ? true
      : hadith.categoryId === selected || hadith.category === selected;
    const haystack = [hadith.turkish, hadith.arabic, hadith.theme, hadith.bookTr, hadith.source]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const queryMatch = query.trim() ? haystack.includes(query.trim().toLowerCase()) : true;
    return categoryMatch && queryMatch;
  }), [hadiths, query, selected]);

  const featuredHadith = filtered[0] || hadiths[0] || null;

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(null);
    setAudioLoadingId(null);
  };

  const handlePlay = async (hadith) => {
    if (playingId === hadith.id) {
      stopAudio();
      return;
    }

    stopAudio();
    setAudioLoadingId(hadith.id);
    try {
      const text = [hadith.turkish, hadith.explanation, `Kaynak: ${hadith.source}`].filter(Boolean).join('. ');
      const { data } = await api.post('/tts', { text });
      const audio = new Audio(`data:audio/${data.format || 'mp3'};base64,${data.audio}`);
      audioRef.current = audio;
      audio.onended = () => {
        audioRef.current = null;
        setPlayingId(null);
      };
      await audio.play();
      setPlayingId(hadith.id);
    } catch {
      setPlayingId(null);
    } finally {
      setAudioLoadingId(null);
    }
  };

  const handleSave = async (hadith) => {
    if (!user) return;
    setSavingId(hadith.id);
    try {
      await api.post('/notes', {
        type: 'hadith',
        title: `${hadith.theme} • ${hadith.source}`,
        content: [hadith.turkish, hadith.arabic, hadith.explanation].filter(Boolean).join('\n\n'),
        scholar_name: hadith.source,
      });
      setSavedId(hadith.id);
      setTimeout(() => setSavedId((current) => (current === hadith.id ? null : current)), 2200);
    } catch {}
    setSavingId(null);
  };

  return (
    <div className="hadith-shell animate-fade-in" data-testid="hadith-page">
      <div className="hadith-hero px-5 pt-10 pb-5" style={{ backgroundImage: "url('/hadith-pattern.svg')" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#E8C84A]">
              <Sparkles size={12} /> 500 Hadis Seçkisi
            </div>
            <div className="flex items-center gap-3 mt-4 mb-2">
              <div className="hadith-orb">
                <BookOpen size={26} className="text-[#1F1204]" />
              </div>
              <h1 className="text-2xl font-bold text-[#F8F1D4]">{t.hadith}</h1>
            </div>
            <p className="max-w-xl text-sm text-[#D8DEC9]">Kartlı, tematik ve dinlenebilir hadis deneyimi. Hadisleri filtreleyebilir, sesli dinleyebilir ve tek dokunuşla notlarına kaydedebilirsin.</p>
          </div>
          <div className="hidden sm:grid grid-cols-2 gap-3 text-right">
            <div className="hadith-stat-card">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#AAB69D]">Toplam</p>
              <p className="text-2xl font-semibold text-[#F8F1D4]">{hadiths.length}</p>
            </div>
            <div className="hadith-stat-card">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#AAB69D]">Tema</p>
              <p className="text-2xl font-semibold text-[#F8F1D4]">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#93A58A]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Hadis, tema veya kaynak ara"
            className="w-full rounded-[24px] border border-white/10 bg-[#07130E]/70 py-3 pl-11 pr-4 text-sm text-[#F8F1D4] outline-none transition focus:border-[#D4AF37]/40"
          />
        </div>
      </div>
      <div className="px-4 mt-4 mb-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          <button onClick={() => setSelected('all')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selected === 'all' ? 'bg-[#D4AF37]/20 text-[#F0CC67] border border-[#D4AF37]/30' : 'bg-white/5 text-[#AAB69D] border border-white/10'}`}>
            {t.all}
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setSelected(c.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selected === c.id ? 'bg-[#D4AF37]/20 text-[#F0CC67] border border-[#D4AF37]/30' : 'bg-white/5 text-[#AAB69D] border border-white/10'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pb-8 space-y-4">
        {featuredHadith && !loading && (
          <div className="hadith-feature-card animate-slide-up">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#AAB69D]">Öne Çıkan Hadis</p>
                <h2 className="text-lg font-semibold text-[#F8F1D4]">{featuredHadith.theme}</h2>
              </div>
              <div className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-[11px] text-[#F0CC67]">
                {featuredHadith.bookTr}
              </div>
            </div>
            <p className="arabic-text text-[1.35rem] text-[#F6E8AF] mb-4">{featuredHadith.arabic}</p>
            <p className="text-sm leading-7 text-[#F8F1D4] mb-4">{featuredHadith.turkish}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#AAB69D]">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1"><Star size={12} className="text-[#D4AF37]" /> {featuredHadith.source}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1"><Waves size={12} className="text-emerald-300" /> {featuredHadith.authenticity}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-14 text-[#AAB69D]">
            <Loader2 size={26} className="mx-auto mb-3 animate-spin text-[#D4AF37]" />
            Hadisler hazırlanıyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="hadith-empty-state text-center py-14">
            <BookOpen size={34} className="mx-auto mb-3 text-[#D4AF37]" />
            <p className="text-sm text-[#F8F1D4]">Aramana uyan hadis bulunamadı.</p>
            <p className="mt-1 text-xs text-[#98A68C]">Farklı bir tema, kaynak veya kısa ifade dene.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((h, index) => (
              <article
                key={h.id}
                className="hadith-card animate-fade-in"
                style={{ animationDelay: `${index * 0.03}s` }}
                data-testid={`hadith-${h.id}`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#F0CC67]">
                    {h.theme}
                  </span>
                  <span className="text-[11px] text-[#9FB097]">#{h.number}</span>
                </div>

                <p className="arabic-text text-[1.1rem] text-[#F6E8AF] min-h-[110px]">{h.arabic}</p>
                <p className={`mt-3 text-sm leading-7 text-[#F8F1D4] ${expandedHadith === h.id ? '' : 'line-clamp-4'}`}>
                  {h.turkish}
                </p>

                <button
                  onClick={() => setExpandedHadith(expandedHadith === h.id ? null : h.id)}
                  className="mt-3 text-xs text-[#D4AF37] hover:text-[#F0CC67] transition-colors"
                >
                  {expandedHadith === h.id ? 'Detayı gizle' : 'Detayı aç'}
                </button>

                {expandedHadith === h.id && (
                  <div className="mt-4 rounded-2xl border border-white/8 bg-black/10 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#91A28A] mb-2">Kısa Not</p>
                    <p className="text-sm leading-6 text-[#DDE4D2]">{h.explanation}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs text-[#91A28A]">
                  <Star size={12} className="text-[#D4AF37]" />
                  <span>{h.source}</span>
                  <span>•</span>
                  <span>{h.bookTr}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePlay(h)}
                    className="hadith-action-btn"
                    disabled={audioLoadingId === h.id}
                  >
                    {audioLoadingId === h.id ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                    {playingId === h.id ? 'Sesi durdur' : 'Sesli oku'}
                  </button>
                  <button
                    onClick={() => handleSave(h)}
                    className="hadith-action-btn hadith-action-btn--accent"
                    disabled={savingId === h.id}
                  >
                    {savingId === h.id ? <Loader2 size={14} className="animate-spin" /> : savedId === h.id ? <CheckCircle2 size={14} /> : <BookmarkPlus size={14} />}
                    {savedId === h.id ? 'Notlara kaydedildi' : 'Not ekle'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
