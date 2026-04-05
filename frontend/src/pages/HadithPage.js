import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  ChevronDown,
  Shield,
  Link2,
  MessageCircle,
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';
import localHadiths from '../data/hadiths.json';

const LOCAL_CATEGORIES = (() => {
  const map = {};
  localHadiths.forEach(h => {
    if (h.categoryId && !map[h.categoryId]) map[h.categoryId] = { id: h.categoryId, name: h.category || h.categoryId };
  });
  return Object.values(map);
})();

const GRADE_COLORS = {
  sahih: '#10B981', hasen: '#F59E0B', zayif: '#EF4444', mevzu: '#6B7280',
};
const GRADE_ICONS = {
  sahih: '✅', hasen: '⚠️', zayif: '❌', mevzu: '🚫',
};

// Word popup for Arabic word analysis
function WordPopup({ word, analysis, onClose, theme, t }) {
  if (!analysis) return null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative max-w-xs w-full rounded-2xl p-4 shadow-2xl"
        style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-lg"
          style={{ color: theme.textSecondary }}><X size={14} /></button>
        <p className="arabic-text text-2xl text-center mb-3" style={{ color: theme.gold }}>{word}</p>
        <div className="space-y-2">
          {analysis.root && <InfoRow label={t.word_root || 'Kök'} value={analysis.root} theme={theme} />}
          {analysis.pattern && <InfoRow label={t.word_pattern || 'Kalıp (Vezin)'} value={analysis.pattern} theme={theme} />}
          {analysis.meaning && <InfoRow label={t.word_meaning || 'Anlam'} value={analysis.meaning} theme={theme} />}
          {analysis.grammar && <InfoRow label={t.word_grammar || 'Gramer'} value={analysis.grammar} theme={theme} />}
          {analysis.quran_frequency != null && (
            <InfoRow label={t.quran_usage || "Kur'an'daki Kullanım"} value={`${analysis.quran_frequency} ${t.verses || 'ayet'}`} theme={theme} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function InfoRow({ label, value, theme }) {
  return (
    <div className="flex justify-between items-start gap-2 py-1 text-xs"
      style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
      <span className="font-medium shrink-0" style={{ color: theme.textSecondary }}>{label}</span>
      <span className="text-right" style={{ color: theme.textPrimary }}>{value}</span>
    </div>
  );
}

// Ravi chain visualization
function RaviChain({ chain, theme, t }) {
  if (!chain || !chain.chain || chain.chain.length === 0) return null;
  return (
    <div className="mt-3 p-3 rounded-xl" style={{ background: `${theme.gold}08`, border: `1px solid ${theme.gold}20` }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: theme.gold }}>
        <Link2 size={10} className="inline mr-1" /> {t.isnad_chain || 'İsnad Zinciri'}
      </p>
      <div className="flex flex-wrap items-center gap-1">
        {chain.chain.map((ravi, i) => (
          <React.Fragment key={i}>
            <span className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background: ravi.reliability === 'sika' ? '#10B98120' : ravi.reliability === 'saduk' ? '#F59E0B20' : '#EF444420',
                color: ravi.reliability === 'sika' ? '#10B981' : ravi.reliability === 'saduk' ? '#F59E0B' : '#EF4444',
              }}>
              {ravi.name}
            </span>
            {i < chain.chain.length - 1 && <span style={{ color: theme.textSecondary }}>→</span>}
          </React.Fragment>
        ))}
      </div>
      {chain.grade && (
        <p className="text-[9px] mt-1.5" style={{ color: theme.textSecondary }}>
          {t.verdict || 'Hüküm'}: <span style={{ color: GRADE_COLORS[chain.grade] || theme.textPrimary }}>{chain.grade_label || chain.grade}</span>
        </p>
      )}
    </div>
  );
}

export default function HadithPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const { theme } = useTheme();
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
  // Phase 3 states
  const [wordPopup, setWordPopup] = useState(null); // { word, analysis }
  const [wordLoading, setWordLoading] = useState(false);
  const [raviData, setRaviData] = useState({}); // { hadithId: chain }
  const [raviLoading, setRaviLoading] = useState(null);
  const [aiExplain, setAiExplain] = useState({}); // { hadithId: explanation }
  const [explainLoading, setExplainLoading] = useState(null);
  const [detailLevel, setDetailLevel] = useState('ozet');

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/hadith/categories'),
      api.get('/hadith/all'),
    ]).then(([categoryResponse, hadithResponse]) => {
      if (!mounted) return;
      if (Array.isArray(categoryResponse.data) && categoryResponse.data.length) setCategories(categoryResponse.data);
      if (Array.isArray(hadithResponse.data) && hadithResponse.data.length) setHadiths(hadithResponse.data);
    }).catch(() => {}).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, []);

  const filtered = useMemo(() => hadiths.filter((hadith) => {
    const categoryMatch = selected === 'all' ? true : hadith.categoryId === selected || hadith.category === selected;
    const haystack = [hadith.turkish, hadith.arabic, hadith.theme, hadith.bookTr, hadith.source].filter(Boolean).join(' ').toLowerCase();
    const queryMatch = query.trim() ? haystack.includes(query.trim().toLowerCase()) : true;
    return categoryMatch && queryMatch;
  }), [hadiths, query, selected]);

  const featuredHadith = filtered[0] || hadiths[0] || null;

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlayingId(null); setAudioLoadingId(null);
  };

  const handlePlay = async (hadith) => {
    if (playingId === hadith.id) { stopAudio(); return; }
    stopAudio(); setAudioLoadingId(hadith.id);
    try {
      const text = [hadith.turkish, hadith.explanation, `Kaynak: ${hadith.source}`].filter(Boolean).join('. ');
      const { data } = await api.post('/tts', { text });
      const audio = new Audio(`data:audio/${data.format || 'mp3'};base64,${data.audio}`);
      audioRef.current = audio;
      audio.onended = () => { audioRef.current = null; setPlayingId(null); };
      await audio.play(); setPlayingId(hadith.id);
    } catch { setPlayingId(null); } finally { setAudioLoadingId(null); }
  };

  const handleSave = async (hadith) => {
    if (!user) return;
    setSavingId(hadith.id);
    try {
      await api.post('/notes', {
        type: 'hadith', title: `${hadith.theme} • ${hadith.source}`,
        content: [hadith.turkish, hadith.arabic, hadith.explanation].filter(Boolean).join('\n\n'),
        scholar_name: hadith.source,
      });
      setSavedId(hadith.id);
      setTimeout(() => setSavedId(c => (c === hadith.id ? null : c)), 2200);
    } catch {}
    setSavingId(null);
  };

  // Phase 3: Word analysis
  const handleWordClick = useCallback(async (word) => {
    if (wordLoading) return;
    setWordLoading(true);
    try {
      const { data } = await api.post('/hadith/v2/word-analysis', { word, language: 'tr' });
      setWordPopup({ word, analysis: data.analysis });
    } catch { setWordPopup({ word, analysis: { meaning: 'Analiz yüklenemedi' } }); }
    finally { setWordLoading(false); }
  }, [wordLoading]);

  // Phase 3: Ravi chain
  const handleRaviChain = useCallback(async (hadithId) => {
    if (raviData[hadithId] || raviLoading) return;
    setRaviLoading(hadithId);
    try {
      const { data } = await api.get(`/hadith/v2/ravi-chain/${hadithId}`);
      setRaviData(prev => ({ ...prev, [hadithId]: data }));
    } catch {}
    finally { setRaviLoading(null); }
  }, [raviData, raviLoading]);

  // Phase 3: AI explain
  const handleExplain = useCallback(async (hadith) => {
    if (aiExplain[hadith.id] || explainLoading) return;
    setExplainLoading(hadith.id);
    try {
      const { data } = await api.post('/hadith/v2/explain', {
        hadith_text: hadith.turkish || hadith.arabic, source: hadith.source,
        detail: detailLevel, language: 'tr',
      });
      setAiExplain(prev => ({ ...prev, [hadith.id]: data.explanation }));
    } catch {}
    finally { setExplainLoading(null); }
  }, [aiExplain, explainLoading, detailLevel]);

  // Render clickable Arabic words
  const renderArabicWords = (text) => {
    if (!text) return null;
    const words = text.split(/\s+/);
    return (
      <p className="arabic-text text-[1.1rem] leading-loose" style={{ color: theme.gold }}>
        {words.map((w, i) => (
          <React.Fragment key={i}>
            <span className="cursor-pointer hover:underline decoration-dotted transition-colors inline-block"
              style={{ color: `${theme.gold}` }}
              onClick={() => handleWordClick(w)}>
              {w}
            </span>
            {i < words.length - 1 && ' '}
          </React.Fragment>
        ))}
        {wordLoading && <Loader2 size={12} className="inline ml-1 animate-spin" style={{ color: theme.gold }} />}
      </p>
    );
  };

  return (
    <div className="animate-fade-in" data-testid="hadith-page" style={{ background: theme.bg }}>
      {/* Hero */}
      <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(180deg, ${theme.surface} 0%, transparent 100%)` }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em]"
              style={{ border: `1px solid ${theme.gold}25`, background: `${theme.gold}10`, color: theme.gold }}>
              <Sparkles size={12} /> {hadiths.length} {t.hadith_selection || 'Hadis Seçkisi'}
            </div>
            <div className="flex items-center gap-3 mt-4 mb-2">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${theme.gold}40, ${theme.gold}20)` }}>
                <BookOpen size={22} style={{ color: theme.gold }} />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>{t.hadith}</h1>
            </div>
            <p className="max-w-xl text-sm" style={{ color: theme.textSecondary }}>
              {t.hadith_features || 'Kelime analizi · Ravi zinciri · AI açıklama · Sıhhat derecesi'}
            </p>
          </div>
          <div className="hidden sm:grid grid-cols-2 gap-3 text-right">
            <div className="p-2 rounded-xl" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: theme.textSecondary }}>{t.total || 'Toplam'}</p>
              <p className="text-2xl font-semibold" style={{ color: theme.textPrimary }}>{hadiths.length}</p>
            </div>
            <div className="p-2 rounded-xl" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: theme.textSecondary }}>{t.theme_count || 'Tema'}</p>
              <p className="text-2xl font-semibold" style={{ color: theme.textPrimary }}>{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: theme.textSecondary }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder={t.search_hadith || 'Hadis, tema veya kaynak ara'}
            className="w-full rounded-[24px] py-3 pl-11 pr-4 text-sm outline-none transition"
            style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary }} />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-4 mb-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          <button onClick={() => setSelected('all')}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={selected === 'all'
              ? { background: `${theme.gold}20`, color: theme.gold, border: `1px solid ${theme.gold}30` }
              : { background: theme.inputBg, color: theme.textSecondary, border: `1px solid ${theme.inputBorder}` }}>
            {t.all}
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setSelected(c.id)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={selected === c.id
                ? { background: `${theme.gold}20`, color: theme.gold, border: `1px solid ${theme.gold}30` }
                : { background: theme.inputBg, color: theme.textSecondary, border: `1px solid ${theme.inputBorder}` }}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Detail level toggle */}
      <div className="px-4 mb-3 flex items-center gap-2">
        <span className="text-[10px]" style={{ color: theme.textSecondary }}>{t.ai_detail || 'AI Detay'}:</span>
        {[{ id: 'ozet', label: t.summary_level || 'Özet' }, { id: 'orta', label: t.medium_level || 'Orta' }, { id: 'akademik', label: t.academic_level || 'Akademik' }].map(dl => (
          <button key={dl.id} onClick={() => setDetailLevel(dl.id)}
            className="px-2 py-0.5 rounded-full text-[9px] font-medium transition-all"
            style={detailLevel === dl.id
              ? { background: theme.gold, color: '#fff' }
              : { background: theme.inputBg, color: theme.textSecondary }}>
            {dl.label}
          </button>
        ))}
      </div>

      {/* Hadiths */}
      <div className="px-4 pb-8 space-y-4">
        {featuredHadith && !loading && (
          <div className="rounded-2xl p-4" style={{ background: theme.cardBg, border: `1px solid ${theme.gold}30` }}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: theme.textSecondary }}>{t.featured_hadith || 'Öne Çıkan Hadis'}</p>
                <h2 className="text-lg font-semibold" style={{ color: theme.textPrimary }}>{featuredHadith.theme}</h2>
              </div>
              <div className="flex items-center gap-1.5">
                {featuredHadith.authenticity && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: `${GRADE_COLORS[featuredHadith.grade] || '#10B981'}20`, color: GRADE_COLORS[featuredHadith.grade] || '#10B981' }}>
                    {GRADE_ICONS[featuredHadith.grade] || '✅'} {featuredHadith.authenticity}
                  </span>
                )}
                <span className="rounded-full px-3 py-1 text-[11px]"
                  style={{ background: `${theme.gold}10`, color: theme.gold, border: `1px solid ${theme.gold}20` }}>
                  {featuredHadith.bookTr}
                </span>
              </div>
            </div>
            {renderArabicWords(featuredHadith.arabic)}
            <p className="mt-3 text-sm leading-7" style={{ color: theme.textPrimary }}>{featuredHadith.turkish}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs" style={{ color: theme.textSecondary }}>
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
                style={{ background: theme.inputBg }}>
                <Star size={12} style={{ color: theme.gold }} /> {featuredHadith.source}
              </span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-14" style={{ color: theme.textSecondary }}>
            <Loader2 size={26} className="mx-auto mb-3 animate-spin" style={{ color: theme.gold }} />
            {t.preparing_hadith || 'Hadisler hazırlanıyor...'}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14">
            <BookOpen size={34} className="mx-auto mb-3" style={{ color: theme.gold }} />
            <p className="text-sm" style={{ color: theme.textPrimary }}>{t.no_hadith_found || 'Aramana uyan hadis bulunamadı.'}</p>
            <p className="mt-1 text-xs" style={{ color: theme.textSecondary }}>{t.try_different || 'Farklı bir tema, kaynak veya kısa ifade dene.'}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((h, index) => (
              <motion.article key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-2xl p-4" data-testid={`hadith-${h.id}`}
                style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-widest"
                    style={{ background: `${theme.gold}10`, color: theme.gold, border: `1px solid ${theme.gold}20` }}>
                    {h.theme}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {h.authenticity && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ background: `${GRADE_COLORS[h.grade] || '#10B981'}20`, color: GRADE_COLORS[h.grade] || '#10B981' }}>
                        {GRADE_ICONS[h.grade] || '✅'}
                      </span>
                    )}
                    <span className="text-[11px]" style={{ color: theme.textSecondary }}>#{h.number}</span>
                  </div>
                </div>

                {/* Clickable Arabic words */}
                {renderArabicWords(h.arabic)}

                <p className={`mt-3 text-sm leading-7 ${expandedHadith === h.id ? '' : 'line-clamp-4'}`}
                  style={{ color: theme.textPrimary }}>{h.turkish}</p>

                <button onClick={() => setExpandedHadith(expandedHadith === h.id ? null : h.id)}
                  className="mt-3 text-xs transition-colors" style={{ color: theme.gold }}>
                  {expandedHadith === h.id ? (t.hide_detail || 'Detayı gizle ↑') : (t.show_detail || 'Detayı aç ↓')}
                </button>

                <AnimatePresence>
                  {expandedHadith === h.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      {h.explanation && (
                        <div className="mt-3 rounded-xl p-3" style={{ background: theme.inputBg }}>
                          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: theme.textSecondary }}>{t.short_note || 'Kısa Not'}</p>
                          <p className="text-sm leading-6" style={{ color: theme.textPrimary }}>{h.explanation}</p>
                        </div>
                      )}

                      {/* Ravi Chain */}
                      {raviData[h.id] ? (
                        <RaviChain chain={raviData[h.id]} theme={theme} t={t} />
                      ) : (
                        <button onClick={() => handleRaviChain(h.id)}
                          disabled={raviLoading === h.id}
                          className="mt-2 flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-colors"
                          style={{ background: theme.inputBg, color: theme.gold }}>
                          {raviLoading === h.id ? <Loader2 size={10} className="animate-spin" /> : <Link2 size={10} />}
                          {t.isnad_chain || 'İsnad Zinciri'}
                        </button>
                      )}

                      {/* AI Explanation */}
                      {aiExplain[h.id] ? (
                        <div className="mt-3 rounded-xl p-3" style={{ background: `${theme.gold}08`, border: `1px solid ${theme.gold}15` }}>
                          <div className="flex items-center gap-1 mb-1.5">
                            <MessageCircle size={10} style={{ color: theme.gold }} />
                            <span className="text-[10px] font-bold" style={{ color: theme.gold }}>{t.ai_explanation || 'AI Açıklama'}</span>
                          </div>
                          <p className="text-xs leading-6 whitespace-pre-wrap" style={{ color: theme.textPrimary }}>{aiExplain[h.id]}</p>
                        </div>
                      ) : (
                        <button onClick={() => handleExplain(h)}
                          disabled={explainLoading === h.id}
                          className="mt-2 flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-colors"
                          style={{ background: `${theme.gold}15`, color: theme.gold }}>
                          {explainLoading === h.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          {t.ai_explain || 'AI ile Açıkla'}
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: theme.textSecondary }}>
                  <Star size={12} style={{ color: theme.gold }} />
                  <span>{h.source}</span><span>•</span><span>{h.bookTr}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => handlePlay(h)} disabled={audioLoadingId === h.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors"
                    style={{ background: theme.inputBg, color: theme.textPrimary, border: `1px solid ${theme.inputBorder}` }}>
                    {audioLoadingId === h.id ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                    {playingId === h.id ? (t.stop || 'Durdur') : (t.listen || 'Dinle')}
                  </button>
                  <button onClick={() => handleSave(h)} disabled={savingId === h.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors"
                    style={{ background: `${theme.gold}15`, color: theme.gold, border: `1px solid ${theme.gold}30` }}>
                    {savingId === h.id ? <Loader2 size={14} className="animate-spin" /> : savedId === h.id ? <CheckCircle2 size={14} /> : <BookmarkPlus size={14} />}
                    {savedId === h.id ? (t.done || 'Kaydedildi') : (t.save || 'Kaydet')}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Word Analysis Popup */}
      <AnimatePresence>
        {wordPopup && <WordPopup word={wordPopup.word} analysis={wordPopup.analysis} onClose={() => setWordPopup(null)} theme={theme} t={t} />}
      </AnimatePresence>
    </div>
  );
}
