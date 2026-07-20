import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Star, Volume2, Pause, Loader, BookOpen, Check, Share2, ChevronRight, Type } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTTS, shareOrCopy } from '../hooks/useShared';
import { awardXPOnce } from '../services/gamification';
import { useReadingSettings } from '../services/readingSettings';
import ReadingSettingsSheet from '../components/ReadingSettingsSheet';
import { SHELVES, ARTICLES, readingTime } from '../data/articles';

// 📚 MAKALE KÜTÜPHANESİ — raflar halinde makaleler + kitap tadında okuma.
// Kapaklar tema uyumlu gradient + emoji (dış görsel yok).

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };

function Cover({ a, h = 130 }) {
  return (
    <div className="w-full rounded-t-2xl relative overflow-hidden flex items-center justify-center" style={{ height: h, background: `linear-gradient(140deg, ${a.grad[0]}, ${a.grad[1]})` }}>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #ffd36960, transparent 65%)' }} />
      <span className="text-5xl" style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))' }}>{a.emoji}</span>
      <span className="absolute bottom-2 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.35)', color: '#f7e6ae' }}>
        {readingTime(a)} dk
      </span>
    </div>
  );
}

export default function LibraryPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const tts = useTTS();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const [favs, setFavs] = useState(() => load('lib_favs', []));
  const [readIds, setReadIds] = useState(() => load('lib_read', []));
  const [progress, setProgress] = useState(0);
  // Okuma ayarları (tema + boyut) — Mushaf/Kıssa ile ortak
  const { settings: rs, theme: rrt } = useReadingSettings();
  const [showRS, setShowRS] = useState(false);
  const readerRef = useRef(null);

  const article = ARTICLES.find(a => a.id === openId);

  const toggleFav = useCallback((id) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      save('lib_favs', next);
      return next;
    });
  }, []);

  const markRead = useCallback((a) => {
    if (readIds.includes(a.id)) return;
    const next = [...readIds, a.id];
    setReadIds(next); save('lib_read', next);
    awardXPOnce(user, `article_${a.id}`, 'hadith_read', { points: 10, details: a.title });
  }, [readIds, user]);

  // Okuma ilerlemesi (scroll)
  useEffect(() => {
    if (!openId) return;
    const main = document.querySelector('main');
    const onScroll = () => {
      const el = readerRef.current;
      if (!el || !main) return;
      const total = el.scrollHeight - main.clientHeight;
      setProgress(total > 0 ? Math.min(1, main.scrollTop / total) : 1);
    };
    main?.addEventListener('scroll', onScroll);
    main?.scrollTo({ top: 0 });
    setProgress(0);
    return () => main?.removeEventListener('scroll', onScroll);
  }, [openId]);

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const ql = query.toLowerCase();
    return ARTICLES.filter(a => a.title.toLowerCase().includes(ql) || a.excerpt.toLowerCase().includes(ql));
  }, [query]);

  const openArticle = useCallback((id) => { tts.stop(); setOpenId(id); }, [tts]);
  const closeArticle = useCallback(() => { tts.stop(); setOpenId(null); }, [tts]);

  const speakArticle = useCallback(() => {
    if (!article) return;
    const text = [article.title, ...article.paragraphs.map(p => (typeof p === 'string' ? p : `${p.quote} — ${p.source}`))].join('. ').slice(0, 4000);
    tts.speak(text);
  }, [article, tts]);

  // ═══ OKUMA GÖRÜNÜMÜ ═══
  if (article) {
    const fav = favs.includes(article.id);
    const isRead = readIds.includes(article.id);
    return (
      <div ref={readerRef} className="min-h-screen pb-28" style={{ background: rrt.bg }}>
        {/* İlerleme çubuğu */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: `${rrt.secondary}15` }}>
          <div className="h-full transition-all duration-150" style={{ width: `${progress * 100}%`, background: rrt.accent }} />
        </div>

        {/* Kapak — sade şerit */}
        <div className="relative overflow-hidden flex items-center justify-center" style={{ height: 140, background: `linear-gradient(140deg, ${article.grad[0]}, ${article.grad[1]})` }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #ffd36960, transparent 65%)' }} />
          <span className="text-6xl" style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.4))' }}>{article.emoji}</span>
          <button onClick={closeArticle} className="absolute top-4 left-4 w-9 h-9 rounded-xl flex items-center justify-center active:scale-90" style={{ background: 'rgba(0,0,0,0.35)' }} aria-label="Geri">
            <ArrowLeft size={18} style={{ color: '#f7e6ae' }} />
          </button>
        </div>

        {/* Kitap tarzı başlık bloğu (ortalanmış) */}
        <div className="px-6 pt-6 pb-1 text-center max-w-[44rem] mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: rrt.accent }}>
            {SHELVES.find(s => s.id === article.shelf)?.title}
          </p>
          <h1 className="text-[1.7rem] leading-tight font-black mt-2" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: rrt.text }}>
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-px w-12" style={{ background: `${rrt.accent}50` }} />
            <span className="text-xs" style={{ color: rrt.accent }}>✦</span>
            <span className="h-px w-12" style={{ background: `${rrt.accent}50` }} />
          </div>
          <p className="text-[10px] mt-2" style={{ color: rrt.secondary }}>{readingTime(article)} dakikalık okuma</p>
        </div>

        {/* Araç çubuğu */}
        <div className="px-5 py-3 flex items-center gap-2 sticky top-0 z-40" style={{ background: `${rrt.bg}f2`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${rrt.border}` }}>
          <button onClick={() => (tts.playing ? tts.stop() : speakArticle())}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black active:scale-95"
            style={{ background: `${rrt.accent}14`, border: `1px solid ${rrt.accent}35`, color: rrt.accent }}>
            {tts.loading ? <Loader size={13} className="animate-spin" /> : tts.playing ? <Pause size={13} /> : <Volume2 size={13} />}
            {tts.playing ? 'Durdur' : 'Dinle'}
          </button>
          <button onClick={() => toggleFav(article.id)}
            className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
            style={{ background: fav ? `${rrt.accent}18` : `${rrt.secondary}10`, border: `1px solid ${fav ? `${rrt.accent}45` : rrt.border}` }}
            aria-label="Favorilere ekle">
            <Star size={15} fill={fav ? rrt.accent : 'transparent'} style={{ color: fav ? rrt.accent : rrt.secondary }} />
          </button>
          <button onClick={() => shareOrCopy(article.title, `${article.excerpt}\n\n(İslami Yaşam Asistanı — Kütüphane)`)}
            className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
            style={{ background: `${rrt.secondary}10`, border: `1px solid ${rrt.border}` }} aria-label="Paylaş">
            <Share2 size={15} style={{ color: rrt.secondary }} />
          </button>
          {/* Okuma ayarları: tema + boyut (Mushaf/Kıssa ile ortak) */}
          <button onClick={() => setShowRS(true)}
            className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black active:scale-95"
            style={{ background: `${rrt.accent}14`, border: `1px solid ${rrt.accent}35`, color: rrt.accent }} aria-label="Okuma ayarları">
            <Type size={13} /> Görünüm
          </button>
        </div>

        {/* Metin — kitap tipografisi */}
        <div className="px-6 pt-5 max-w-[44rem] mx-auto article-body"
          style={{ fontSize: rs.fontSize, color: `${rrt.text}ee`, '--gold': rrt.accent }}>
          {article.paragraphs.map((p, i) => typeof p === 'string' ? (
            <p key={i}>{p}</p>
          ) : (
            <blockquote key={i} className="article-quote my-6 mx-2 py-4 px-5 rounded-2xl relative"
              style={{ background: `${rrt.accent}0a`, border: `1px solid ${rrt.accent}25` }}>
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 text-sm" style={{ background: rrt.bg, color: rrt.accent }}>✦</span>
              <p className="italic leading-relaxed" style={{ fontSize: rs.fontSize - 0.5, color: rrt.text }}>“{p.quote}”</p>
              <p className="text-[11px] mt-2.5 font-bold not-italic" style={{ color: rrt.accent, fontFamily: 'Inter, sans-serif' }}>{p.source}</p>
            </blockquote>
          ))}

          {/* Kaynaklar */}
          <div className="rounded-2xl p-4 mt-2 mb-6" style={{ background: rrt.surface, border: `1px solid ${rrt.border}` }}>
            <p className="text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: rrt.accent }}>Kaynaklar</p>
            <p className="text-xs leading-relaxed" style={{ color: rrt.secondary }}>{article.refs.join(' · ')}</p>
          </div>

          {/* Okudum */}
          <button onClick={() => markRead(article)} disabled={isRead}
            className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all mb-4"
            style={{
              background: isRead ? '#10B98115' : 'linear-gradient(135deg, #10B981, #059669)',
              border: isRead ? '1px solid #10B98140' : 'none',
              color: isRead ? '#10B981' : '#fff',
            }}>
            <Check size={16} /> {isRead ? 'Okundu ✓' : 'Okudum (+10 XP)'}
          </button>

          {/* Sıradaki makale */}
          {(() => {
            const next = ARTICLES.find(a => a.shelf === article.shelf && !readIds.includes(a.id) && a.id !== article.id) || ARTICLES.find(a => a.id !== article.id);
            if (!next) return null;
            return (
              <button onClick={() => openArticle(next.id)} className="w-full flex items-center gap-3 p-3 rounded-2xl text-left active:scale-98 transition-transform"
                style={{ background: rrt.surface, border: `1px solid ${rrt.border}` }}>
                <span className="text-2xl">{next.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold uppercase" style={{ color: rrt.secondary }}>Sıradaki</p>
                  <p className="text-xs font-black truncate" style={{ color: rrt.text }}>{next.title}</p>
                </div>
                <ChevronRight size={15} style={{ color: rrt.accent }} />
              </button>
            );
          })()}
        </div>

        {/* Okuma ayarları sayfası */}
        <ReadingSettingsSheet open={showRS} onClose={() => setShowRS(false)} />
      </div>
    );
  }

  // ═══ RAFLAR GÖRÜNÜMÜ ═══
  const favList = ARTICLES.filter(a => favs.includes(a.id));
  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={22} style={{ color: theme.gold }} />
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Kütüphane</h1>
        </div>
        <p className="text-xs mb-3" style={{ color: theme.textSecondary }}>Okudukça derinleşen makaleler · {readIds.length}/{ARTICLES.length} okundu</p>
        {/* Arama */}
        <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <Search size={15} style={{ color: theme.textSecondary }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Makale ara..."
            className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.textPrimary }} />
        </div>
      </div>

      {/* Arama sonuçları */}
      {filtered ? (
        <div className="px-5 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.length === 0 && <p className="col-span-full text-center text-xs py-8" style={{ color: theme.textSecondary }}>Sonuç bulunamadı</p>}
          {filtered.map(a => (
            <button key={a.id} onClick={() => openArticle(a.id)} className="rounded-2xl overflow-hidden text-left active:scale-97 transition-transform" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
              <Cover a={a} h={100} />
              <div className="p-3">
                <p className="text-xs font-black leading-snug" style={{ color: theme.textPrimary }}>{a.title}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Favoriler rafı */}
          {favList.length > 0 && (
            <div className="mb-5">
              <p className="px-5 text-sm font-black mb-2.5" style={{ color: theme.textPrimary }}>⭐ Kaydettiklerin</p>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-1 md:grid md:grid-cols-4 md:overflow-visible">
                {favList.map(a => (
                  <button key={a.id} onClick={() => openArticle(a.id)} className="shrink-0 w-40 md:w-auto rounded-2xl overflow-hidden text-left active:scale-97 transition-transform" style={{ background: theme.surface, border: `1px solid ${theme.gold}30` }}>
                    <Cover a={a} h={92} />
                    <div className="p-2.5"><p className="text-[11px] font-black leading-snug line-clamp-2" style={{ color: theme.textPrimary }}>{a.title}</p></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Raflar */}
          {SHELVES.map((shelf, si) => {
            const items = ARTICLES.filter(a => a.shelf === shelf.id);
            return (
              <motion.div key={shelf.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.06 }} className="mb-6">
                <div className="flex items-center justify-between px-5 mb-2.5">
                  <p className="text-sm font-black" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{shelf.icon} {shelf.title}</p>
                  <span className="text-[10px] font-bold" style={{ color: theme.textSecondary }}>{items.filter(a => readIds.includes(a.id)).length}/{items.length}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-1 md:grid md:grid-cols-3 xl:grid-cols-4 md:overflow-visible">
                  {items.map(a => {
                    const isRead = readIds.includes(a.id);
                    return (
                      <button key={a.id} onClick={() => openArticle(a.id)}
                        className="shrink-0 w-48 md:w-auto rounded-2xl overflow-hidden text-left active:scale-97 transition-transform relative"
                        style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
                        <Cover a={a} />
                        {isRead && <span className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#10B981' }}><Check size={13} color="#fff" /></span>}
                        {favs.includes(a.id) && <Star size={13} fill={theme.gold} className="absolute top-2.5 right-2.5" style={{ color: theme.gold }} />}
                        <div className="p-3">
                          <p className="text-xs font-black leading-snug mb-1" style={{ color: theme.textPrimary }}>{a.title}</p>
                          <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: theme.textSecondary }}>{a.excerpt}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </>
      )}
      <AnimatePresence />
    </div>
  );
}
