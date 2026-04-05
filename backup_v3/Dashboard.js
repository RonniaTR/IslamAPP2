import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Volume2, Moon, Compass, Heart, Share2, ChevronRight, Check, Users, Copy, Play, Pause, Loader, Trophy, Navigation, Headphones, X, ScrollText, Clock, Bell, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS, shareOrCopy } from '../hooks/useShared';
import { fetchWithCache } from '../services/cache';
import notifications from '../services/notifications';
import logger from '../services/logger';
import api from '../api';

// ─── Online Status Hook ───
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

// ─── Prayer Countdown Widget ───
const PrayerCountdown = memo(function PrayerCountdown({ prayerTimes, theme, t }) {
  const [next, setNext] = useState(null);
  const [countdown, setCountdown] = useState('');

  const prayerNames = useMemo(() => ({
    fajr: t.prayer_fajr || 'İmsak', sunrise: t.prayer_sunrise || 'Güneş', dhuhr: t.prayer_dhuhr || 'Öğle', asr: t.prayer_asr || 'İkindi', maghrib: t.prayer_maghrib || 'Akşam', isha: t.prayer_isha || 'Yatsı',
  }), [t]);

  useEffect(() => {
    if (!prayerTimes) return;
    const update = () => {
      const now = new Date();
      const keys = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
      let nextPrayer = null;
      for (const key of keys) {
        if (!prayerTimes[key]) continue;
        const [h, m] = prayerTimes[key].split(':').map(Number);
        const t = new Date(now); t.setHours(h, m, 0, 0);
        if (t > now) { nextPrayer = { key, time: t, label: prayerNames[key] }; break; }
      }
      if (!nextPrayer) { setNext(null); setCountdown(''); return; }
      setNext(nextPrayer);
      const diff = nextPrayer.time - now;
      const hh = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setCountdown(`${hh}:${mm}:${ss}`);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [prayerTimes, prayerNames]);

  if (!next || !prayerTimes) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="mx-4 mb-4 rounded-2xl p-4 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.bg})`, border: `1px solid ${theme.cardBorder}` }}>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10" style={{ background: theme.gold }} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${theme.gold}15` }}>
            <Clock size={20} style={{ color: theme.gold }} />
          </div>
          <div>
            <p className="text-[11px]" style={{ color: theme.textSecondary }}>{t.next_prayer || 'Sonraki Vakit'}</p>
            <p className="text-base font-bold" style={{ color: theme.textPrimary }}>{next.label}</p>
            <p className="text-[10px]" style={{ color: theme.textSecondary }}>{prayerTimes[next.key]}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums" style={{ color: theme.gold, fontFamily: 'Inter, monospace' }}>{countdown}</p>
          <p className="text-[9px]" style={{ color: theme.textSecondary }}>{t.remaining_time || 'kalan süre'}</p>
        </div>
      </div>
    </motion.div>
  );
});

// ─── Quick Widgets Panel ───
const QuickWidgets = memo(function QuickWidgets({ theme, prayerTimes, lastRead, t }) {
  const navigate = useNavigate();

  const widgets = useMemo(() => [
    { icon: '📖', label: lastRead ? (t.continue_reading || 'Devam Et') : (t.read_quran || "Kur'an Oku"), sub: lastRead ? `${t.surah || 'Sure'} ${lastRead.surah}` : (t.last_position || 'Son kaldığın yer'), path: lastRead ? `/quran/${lastRead.surah}` : '/quran' },
    { icon: '📿', label: t.dhikr || 'Zikir', sub: t.dhikr_desc || 'Hızlı zikir sayacı', path: '/#dhikr' },
    { icon: '🧭', label: t.qibla_short || 'Kıble', sub: t.qibla_find || 'Kıble yönünü bul', path: '/qibla' },
    { icon: '📝', label: t.my_notes || 'Notlar', sub: t.saved_notes || 'Kayıtlı notların', path: '/notes' },
  ], [lastRead, t]);

  return (
    <div className="px-4 mb-4">
      <div className="grid grid-cols-4 gap-2">
        {widgets.map((w, i) => (
          <motion.button key={w.path} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i }}
            onClick={() => navigate(w.path)}
            className="rounded-xl p-2.5 text-center transition-all active:scale-95"
            style={{ background: `${theme.gold}08`, border: `1px solid ${theme.cardBorder}` }}>
            <span className="text-xl block">{w.icon}</span>
            <p className="text-[10px] font-medium mt-1" style={{ color: theme.textPrimary }}>{w.label}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
});

// ─── Mood Section (horizontal scroll) ───
const MoodSection = memo(function MoodSection({ theme, t }) {
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const tts = useTTS();

  const moods = useMemo(() => [
    { id: 'huzur', label: t.mood_peace || 'Huzur', icon: '☮️', desc: t.mood_peace_desc || 'İç huzur ve sükûnet' },
    { id: 'motivasyon', label: t.mood_motivation || 'Motivasyon', icon: '🔥', desc: t.mood_motivation_desc || 'Güç ve azim' },
    { id: 'sabir', label: t.mood_patience || 'Sabır', icon: '🌿', desc: t.mood_patience_desc || 'Dayanma gücü' },
    { id: 'sukur', label: t.mood_gratitude || 'Şükür', icon: '✨', desc: t.mood_gratitude_desc || 'Nimete şükretmek' },
  ], [t]);

  const handleMood = async (id) => {
    setSelected(id);
    setLoading(true);
    try {
      const { data } = await api.get(`/mood/${id}`);
      setContent(data);
    } catch { setContent(null); }
    setLoading(false);
  };

  return (
    <div className="mb-5 animate-fade-in" data-testid="mood-section">
      <p className="text-sm mb-3 px-4" style={{ fontFamily: 'Playfair Display, serif', color: theme.gold }}>
        {t.mood_question || 'Bugün kalbin neye ihtiyaç duyuyor?'}
      </p>
      {/* Horizontal scroll mood cards */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
        {moods.map(m => (
          <motion.button key={m.id} whileTap={{ scale: 0.95 }} onClick={() => handleMood(m.id)} data-testid={`mood-${m.id}`}
            className={`shrink-0 w-28 rounded-2xl py-3 px-2 text-center transition-all duration-300 ${selected === m.id ? 'scale-[1.03]' : ''}`}
            style={{ background: selected === m.id ? `${theme.gold}30` : theme.cardBg, border: `1px solid ${selected === m.id ? `${theme.gold}60` : theme.cardBorder}` }}>
            <span className="text-2xl block mb-1">{m.icon}</span>
            <span className="text-xs font-semibold block" style={{ color: theme.textPrimary }}>{m.label}</span>
            <span className="text-[9px] mt-0.5 block" style={{ color: theme.textSecondary }}>{m.desc}</span>
          </motion.button>
        ))}
      </div>
      {loading && <div className="text-center py-4"><div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: theme.gold, borderTopColor: 'transparent' }} /></div>}
      {content && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-3 rounded-2xl p-4" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
          data-testid="mood-content">
          <p className="arabic-text text-base mb-1" style={{ color: `${theme.textPrimary}e6` }}>{content.ayet.arabic}</p>
          <p className="text-sm mb-1" style={{ color: theme.textSecondary }}>{content.ayet.turkish}</p>
          <p className="text-[10px] mb-3" style={{ color: theme.gold }}>— {content.ayet.sure}</p>
          <div className="pt-3 mb-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
            <p className="text-sm italic" style={{ color: `${theme.textPrimary}cc` }}>"{content.hadis.turkish}"</p>
            <p className="text-[10px] mt-1" style={{ color: theme.textSecondary }}>— {content.hadis.source}</p>
          </div>
          <div className="pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: theme.gold }}>{t.dua || 'Dua'}</p>
            <p className="text-sm" style={{ color: `${theme.textPrimary}cc` }}>{content.dua}</p>
          </div>
          <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
            <button onClick={() => tts.speak(`${content.ayet.turkish}. ${content.hadis.turkish}. ${content.dua}`)} data-testid="mood-tts"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
              style={{ background: `${theme.gold}15`, color: theme.gold }}>
              {tts.loading ? <Loader size={12} className="animate-spin" /> : tts.playing ? <Pause size={12} /> : <Play size={12} />}
              {tts.loading ? (t.listen_loading || 'Yükleniyor') : tts.playing ? (t.stop || 'Durdur') : (t.listen || 'Dinle')}
            </button>
            <button onClick={() => shareOrCopy(content.label, `${content.ayet.turkish}\n(${content.ayet.sure})\n\n"${content.hadis.turkish}" — ${content.hadis.source}\n\nDua: ${content.dua}`)} data-testid="mood-share"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
              style={{ background: `${theme.gold}15`, color: theme.gold }}>
              <Share2 size={12} /> {t.share || 'Paylaş'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
});

// ─── Daily Verse Card ───
const DailyVerse = memo(function DailyVerse({ verse, theme, t }) {
  const tts = useTTS();
  if (!verse) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className="mx-4 mb-4 rounded-2xl p-4" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      data-testid="daily-verse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={16} style={{ color: theme.gold }} />
          <span className="text-sm font-semibold" style={{ color: theme.gold }}>{t.verse_of_day || 'Günün Ayeti'}</span>
        </div>
        <span className="text-xs" style={{ color: theme.textSecondary }}>{verse.surah_name} - {verse.verse_number}</span>
      </div>
      <p className="arabic-text text-lg mb-3 leading-loose" style={{ color: `${theme.textPrimary}e6` }}>{verse.arabic}</p>
      <p className="text-sm leading-relaxed mb-3" style={{ color: theme.textSecondary }}>{verse.turkish}</p>
      <div className="flex gap-2 pt-2" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
        <button onClick={() => tts.speak(verse.turkish)} data-testid="verse-listen-btn" aria-label="Ayeti dinle"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
          style={{ background: `${theme.gold}15`, color: theme.gold }}>
          {tts.loading ? <Loader size={12} className="animate-spin" /> : tts.playing ? <Pause size={12} /> : <Volume2 size={12} />}
          {tts.loading ? (t.listen_loading || 'Yükleniyor...') : tts.playing ? (t.stop || 'Durdur') : (t.listen || 'Dinle')}
        </button>
        <button onClick={() => shareOrCopy(t.verse_of_day || 'Günün Ayeti', `${verse.arabic}\n\n${verse.turkish}\n— ${verse.surah_name} ${verse.verse_number}`)} data-testid="verse-share-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
          style={{ background: `${theme.gold}15`, color: theme.gold }}>
          <Share2 size={12} /> {t.share || 'Paylaş'}
        </button>
      </div>
    </motion.div>
  );
});

// ─── Hadith Overlay Modal ───
function HadithModal({ hadith, onClose, theme, t }) {
  const tts = useTTS();
  const navigate = useNavigate();
  if (!hadith) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={onClose}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-[520px] mx-auto" onClick={e => e.stopPropagation()}
        style={{ background: `linear-gradient(180deg, ${theme.surface}, ${theme.bg})`, borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflow: 'auto' }}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: `${theme.textSecondary}30` }} />
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full" style={{ background: `${theme.textSecondary}15` }}>
          <X size={16} style={{ color: theme.textSecondary }} />
        </button>
        <div className="px-6 pt-2 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <ScrollText size={18} style={{ color: theme.goldLight || theme.gold }} />
            <span className="text-sm font-semibold" style={{ color: theme.goldLight || theme.gold }}>{t.hadith_sherif || 'Hadis-i Şerif'}</span>
          </div>
          <div className="p-4 rounded-2xl mb-4" style={{ background: `${theme.gold}08`, border: `1px solid ${theme.gold}15` }}>
            <p className="arabic-text text-lg leading-loose text-center" style={{ color: `${theme.textPrimary}e6` }}>{hadith.arabic}</p>
          </div>
          <p className="text-sm leading-relaxed mb-2" style={{ color: `${theme.textPrimary}e6` }}>{hadith.turkish}</p>
          <p className="text-[11px] mb-5" style={{ color: theme.gold }}>— {hadith.source}</p>
          <div className="flex gap-2 mb-4">
            <button onClick={() => tts.speak(hadith.turkish)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium"
              style={{ background: `${theme.gold}12`, color: theme.gold, border: `1px solid ${theme.gold}25` }}>
              {tts.loading ? <Loader size={14} className="animate-spin" /> : tts.playing ? <Pause size={14} /> : <Volume2 size={14} />}
              {tts.loading ? (t.listen_loading || 'Yükleniyor...') : tts.playing ? (t.stop || 'Durdur') : (t.listen || 'Dinle')}
            </button>
            <button onClick={() => shareOrCopy(t.hadith_sherif || 'Hadis-i Şerif', `${hadith.arabic}\n\n${hadith.turkish}\n— ${hadith.source}`)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium"
              style={{ background: `${theme.gold}12`, color: theme.gold, border: `1px solid ${theme.gold}25` }}>
              <Share2 size={14} /> {t.share || 'Paylaş'}
            </button>
          </div>
          <button onClick={() => { onClose(); navigate('/hadith'); }}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight || theme.gold})`, color: theme.bg }}>
            <ScrollText size={16} /> {t.hadith_collection_go || 'Hadis Koleksiyonuna Git'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Daily Hadith Card (Compact - opens modal) ───
const DailyHadith = memo(function DailyHadith({ hadith, theme, t }) {
  const [showModal, setShowModal] = useState(false);
  if (!hadith) return null;
  const preview = hadith.turkish?.length > 80 ? hadith.turkish.slice(0, 80) + '...' : hadith.turkish;
  return (
    <>
      <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)}
        className="mx-4 mb-4 w-[calc(100%-2rem)] text-left rounded-2xl p-4 transition-all"
        style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
        data-testid="daily-hadith">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${theme.gold}18` }}>
              <ScrollText size={14} style={{ color: theme.goldLight || theme.gold }} />
            </div>
            <div>
              <span className="text-xs font-semibold block" style={{ color: theme.goldLight || theme.gold }}>{t.hadith_of_day || 'Günün Hadisi'}</span>
              <span className="text-[10px] block" style={{ color: theme.textSecondary }}>{hadith.source}</span>
            </div>
          </div>
          <div className="px-2 py-1 rounded-lg text-[10px] font-medium" style={{ background: `${theme.gold}12`, color: theme.goldLight || theme.gold }}>
            {t.read_btn || 'Oku'} →
          </div>
        </div>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: `${theme.textPrimary}cc` }}>{preview}</p>
      </motion.button>
      <AnimatePresence>
        {showModal && <HadithModal hadith={hadith} theme={theme} onClose={() => setShowModal(false)} t={t} />}
      </AnimatePresence>
    </>
  );
});

// ─── Knowledge Cards (Enhanced with categories) ───
const KnowledgeCards = memo(function KnowledgeCards({ theme, t }) {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchWithCache('knowledge_cards', () => api.get('/knowledge-cards').then(r => r.data), { ttl: 60 * 60 * 1000 })
      .then(({ data }) => { if (Array.isArray(data)) setCards(data); })
      .catch(() => {});
  }, []);
  if (!cards.length) return null;

  const totalItems = cards.reduce((s, c) => s + c.items.length, 0);

  return (
    <div className="mb-5 animate-fade-in" data-testid="knowledge-cards">
      <div className="flex items-center justify-between px-4 mb-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>{t.knowledge_treasure || 'İslam Bilgi Hazinesi'}</h2>
          <p className="text-[10px] mt-0.5" style={{ color: theme.textSecondary }}>{cards.length} {t.topics || 'kategori'}, {totalItems}+ {t.topics || 'konu'}</p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1" style={{ background: `${theme.gold}18`, color: theme.gold }}>
          🏆 {t.scored || 'Puanlı'}
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-3">
        {cards.map((card, i) => {
          const basicCount = card.items.filter(it => it.level === 'basic' || !it.level).length;
          const deepCount = card.items.filter(it => it.level === 'deep').length;
          return (
            <motion.button key={card.id} whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/knowledge/${card.id}`)} data-testid={`knowledge-${card.id}`}
              className="shrink-0 w-52 rounded-2xl p-4 text-left transition-all relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.bg})`, border: `1px solid ${card.color || theme.gold}25` }}>
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: card.color || theme.gold, transform: 'translate(30%, -30%)' }} />
              <span className="text-2xl block mb-2">{card.icon || '📖'}</span>
              <p className="text-sm font-bold mb-0.5" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>{card.title}</p>
              <p className="text-[10px] mb-2" style={{ color: theme.textSecondary }}>{card.items.length} {t.topics || 'konu'}</p>
              {deepCount > 0 && (
                <div className="flex gap-1 mb-2">
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ADE80' }}>{t.basic || 'Temel'}: {basicCount}</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(129,140,248,0.12)', color: '#818CF8' }}>{t.deep || 'Derin'}: {deepCount}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-[11px] font-medium" style={{ color: card.color || theme.gold }}>
                <span>{t.explore_it || 'İncele'}</span>
                <ChevronRight size={12} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

// ─── Dhikr Counter Widget ───
const DhikrWidget = memo(function DhikrWidget({ theme, t }) {
  const [dhikrList, setDhikrList] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchWithCache('dhikr_list', () => api.get('/dhikr').then(r => r.data), { ttl: 24 * 60 * 60 * 1000 })
      .then(({ data }) => { if (Array.isArray(data)) setDhikrList(data); })
      .catch(() => {});
  }, []);
  const current = dhikrList[activeIdx];

  const handleCount = () => {
    setCount(c => c + 1);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  if (!dhikrList.length) return null;

  return (
    <div className="mx-4 mb-5 animate-fade-in" data-testid="dhikr-widget">
      {!open ? (
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => setOpen(true)} data-testid="dhikr-start-btn"
          className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
          style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${theme.gold}18` }}>
            <span className="text-lg">📿</span>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{t.dhikr_counter || 'Zikir Sayacı'}</p>
            <p className="text-[11px]" style={{ color: theme.textSecondary }}>{t.start_dhikr || 'Zikir başlat'}</p>
          </div>
          <ChevronRight size={16} style={{ color: theme.gold }} className="ml-auto" />
        </motion.button>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl p-5 text-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }} data-testid="dhikr-counter">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-4 pb-1 justify-center flex-wrap">
            {dhikrList.map((d, i) => (
              <button key={d.id} onClick={() => { setActiveIdx(i); setCount(0); }}
                className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all"
                style={i === activeIdx ? { background: theme.gold, color: theme.bg } : { background: `${theme.textSecondary}15`, color: theme.textSecondary }}>
                {d.turkish}
              </button>
            ))}
          </div>
          {current && (
            <>
              <p className="arabic-text text-xl mb-1" style={{ color: theme.textPrimary }}>{current.arabic}</p>
              <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>{current.meaning}</p>
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleCount} data-testid="dhikr-tap-btn"
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold transition-all"
                style={{ color: theme.gold, background: `linear-gradient(135deg, ${theme.gold}33, ${theme.gold}0D)`, border: `2px solid ${theme.gold}4D` }}>
                {count}
              </motion.button>
              {current.recommended > 0 && <p className="text-[10px] mt-2" style={{ color: theme.textSecondary }}>{t.target || 'Hedef'}: {current.recommended}</p>}
              <button onClick={() => { setOpen(false); setCount(0); }} className="text-xs mt-3 hover:underline" style={{ color: theme.gold }}>Kapat</button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
});

// ─── Worship Tracker ───
const WorshipTracker = memo(function WorshipTracker({ theme, t }) {
  const [items, setItems] = useState({ namaz: false, kuran: false, sadaka: false, zikir: false });

  useEffect(() => { api.get('/worship/today').then(r => { if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) setItems(prev => ({ ...prev, ...r.data })); }).catch(() => {}); }, []);

  const toggle = async (key) => {
    const updated = { ...items, [key]: !items[key] };
    setItems(updated);
    api.post('/worship/track', { namaz: updated.namaz, kuran: updated.kuran, sadaka: updated.sadaka, zikir: updated.zikir }).catch(() => {});
  };

  const labels = useMemo(() => [
    { key: 'namaz', label: t.prayer_done || 'Namaz kılındı', icon: '🕌' },
    { key: 'kuran', label: t.quran_read || "Kur'an okundu", icon: '📖' },
    { key: 'sadaka', label: t.charity_given || 'Sadaka verildi', icon: '💰' },
    { key: 'zikir', label: t.dhikr_done || 'Zikir yapıldı', icon: '📿' },
  ], [t]);
  const done = Object.values(items).filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="mx-4 mb-5 rounded-2xl p-4" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }} data-testid="worship-tracker">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold" style={{ color: theme.gold, fontFamily: 'Playfair Display, serif' }}>{t.daily_worship || 'Günlük İbadet Takibi'}</p>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${theme.gold}26`, color: theme.gold }}>{done}/4</span>
      </div>
      <div className="space-y-2">
        {labels.map(({ key, label, icon }) => (
          <motion.button key={key} whileTap={{ scale: 0.98 }} onClick={() => toggle(key)} data-testid={`worship-${key}`}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all"
            style={{ background: items[key] ? `${theme.gold}1A` : `${theme.textSecondary}08` }}>
            <span className="text-base">{icon}</span>
            <span className={`text-sm flex-1 text-left ${items[key] ? 'line-through' : ''}`} style={{ color: items[key] ? theme.gold : theme.textPrimary }}>{label}</span>
            <div className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
              style={items[key] ? { background: theme.gold } : { border: `1.5px solid ${theme.gold}4D` }}>
              {items[key] && <Check size={12} style={{ color: theme.bg }} />}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});

// ─── Ramadan Mini Card ───
const RamadanMini = memo(function RamadanMini({ prayerTimes, theme, t }) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!prayerTimes?.maghrib) return;
    const update = () => {
      const now = new Date();
      const [h, m] = prayerTimes.maghrib.split(':').map(Number);
      const iftar = new Date(now); iftar.setHours(h, m, 0, 0);
      if (iftar <= now) { setCountdown(null); return; }
      const diff = iftar - now;
      setCountdown(`${String(Math.floor(diff/3600000)).padStart(2,'0')}:${String(Math.floor((diff%3600000)/60000)).padStart(2,'0')}:${String(Math.floor((diff%60000)/1000)).padStart(2,'0')}`);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [prayerTimes]);

  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate('/ramadan')} data-testid="ramadan-mini"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="mx-4 mb-5 w-[calc(100%-2rem)] rounded-2xl p-4 text-left transition-all"
      style={{ background: `linear-gradient(135deg, ${theme.gold}26, ${theme.gold}0D)`, border: `1px solid ${theme.gold}40` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon size={18} style={{ color: theme.gold }} />
          <span className="text-sm font-semibold" style={{ color: theme.gold }}>{t.ramadan || 'Ramazan'}</span>
        </div>
        {countdown && <span className="text-lg font-bold" style={{ color: theme.gold, fontFamily: 'Inter, monospace' }}>{countdown}</span>}
        <ChevronRight size={16} style={{ color: theme.gold }} />
      </div>
      {countdown && <p className="text-[10px] mt-1" style={{ color: theme.textSecondary }}>{t.iftar_countdown || 'İftara kalan süre'}</p>}
    </motion.button>
  );
});

// ─── Quick Access Grid ───
const QuickAccess = memo(function QuickAccess({ theme, t }) {
  const navigate = useNavigate();
  const items = useMemo(() => [
    { path: '/quiz', icon: Trophy, label: t.test_knowledge || 'Quiz', desc: t.test_knowledge || 'Bilgini test et', color: '#E8C84A' },
    { path: '/qibla', icon: Navigation, label: t.qibla_short || 'Kıble', desc: t.find_qibla || 'Kıble yönünü bul', color: '#4ADE80' },
    { path: '/meal-audio', icon: Headphones, label: t.listen_meal_short || 'Meal Dinle', desc: t.listen_translation || 'Türkçe meal seslendirme', color: '#60A5FA' },
    { path: '/scholars', icon: Users, label: t.ask_scholar_short || 'Hocaya Sor', desc: t.ask_scholar || '12 alimden görüş al', color: '#D4AF37' },
  ], [t]);
  return (
    <div className="mx-4 mb-5" data-testid="quick-access">
      <h2 className="text-sm font-semibold mb-3" style={{ color: theme.gold, fontFamily: 'Playfair Display, serif' }}>{t.quick_access || 'Hızlı Erişim'}</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ path, icon: Icon, label, desc, color }, i) => (
          <motion.button key={path} whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            onClick={() => navigate(path)} data-testid={`quick-${path.slice(1)}`}
            className="rounded-2xl p-4 text-left transition-all"
            style={{ background: theme.surface, border: `1px solid ${color}20` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: theme.textSecondary }}>{desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
});

// ─── Main Dashboard ───
export default function Dashboard() {
  const { user } = useAuth();
  const { t, selectedCity } = useLang();
  const { theme } = useTheme();
  const online = useOnlineStatus();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [randomVerse, setRandomVerse] = useState(null);
  const [randomHadith, setRandomHadith] = useState(null);

  useEffect(() => {
    fetchWithCache(`/prayer-times/${selectedCity}`, { ttl: 30 * 60 * 1000 }).then(d => { if (d && typeof d === 'object') setPrayerTimes(d); }).catch(() => {});
    fetchWithCache('/quran/random', { ttl: 10 * 60 * 1000 }).then(d => { if (d && typeof d === 'object') setRandomVerse(d); }).catch(() => {});
    fetchWithCache('/hadith/random', { ttl: 10 * 60 * 1000 }).then(d => { if (d && typeof d === 'object') setRandomHadith(d); }).catch(() => {});
    logger.info('Dashboard loaded', { city: selectedCity });
  }, [selectedCity]);

  // Schedule prayer notifications when times load
  useEffect(() => {
    if (prayerTimes) {
      const prefs = notifications.getPreferences();
      if (prefs.prayer) {
        ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(key => {
          if (prayerTimes[key]) notifications.schedulePrayerReminder(key, prayerTimes[key]);
        });
      }
    }
  }, [prayerTimes]);

  const prayerKeys = useMemo(() => [
    { key: 'fajr', label: t.prayer_fajr || 'İmsak' }, { key: 'sunrise', label: t.prayer_sunrise || 'Güneş' },
    { key: 'dhuhr', label: t.prayer_dhuhr || 'Öğle' }, { key: 'asr', label: t.prayer_asr || 'İkindi' },
    { key: 'maghrib', label: t.prayer_maghrib || 'Akşam' }, { key: 'isha', label: t.prayer_isha || 'Yatsı' },
  ], [t]);

  return (
    <div className="pb-4" style={{ background: theme.bg }} data-testid="dashboard">
      {/* Offline Banner */}
      <AnimatePresence>
        {!online && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium"
            style={{ background: `${theme.gold}26`, color: theme.gold }}>
            <WifiOff size={12} /> {t.offline_banner || 'Çevrimdışı mod — veriler önbellekten yükleniyor'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-5 pt-6 pb-4" style={{ background: `linear-gradient(180deg, ${theme.surface} 0%, transparent 100%)` }}>
        <p className="text-xs tracking-widest uppercase" style={{ color: theme.gold }}>Bismillahirrahmanirrahim</p>
        <h1 className="text-2xl font-bold mt-1" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
          {t.greeting_hello || 'Selam'}{user?.name ? `, ${user.name}` : ''}
        </h1>
      </div>

      <PrayerCountdown prayerTimes={prayerTimes} theme={theme} t={t} />
      <MoodSection theme={theme} t={t} />
      <DailyVerse verse={randomVerse} theme={theme} t={t} />
      <DailyHadith hadith={randomHadith} theme={theme} t={t} />
      <KnowledgeCards theme={theme} t={t} />
      <DhikrWidget theme={theme} t={t} />
      <WorshipTracker theme={theme} t={t} />
      <RamadanMini prayerTimes={prayerTimes} theme={theme} t={t} />

      {/* Prayer Times */}
      {prayerTimes && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mx-4 mb-5 rounded-2xl p-4" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }} data-testid="prayer-times-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Compass size={16} style={{ color: theme.gold }} />
              <span className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{prayerTimes.city_name}</span>
            </div>
            <span className="text-xs" style={{ color: theme.textSecondary }}>{prayerTimes.date}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {prayerKeys.map(({ key, label }) => (
              <div key={key} className="text-center py-2 rounded-xl" style={{ background: `${theme.gold}0F` }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: theme.gold }}>{label}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: theme.textPrimary }}>{prayerTimes[key]}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <QuickAccess theme={theme} t={t} />
    </div>
  );
}
