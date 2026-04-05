import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Volume2, Moon, Compass, Heart, Share2, ChevronRight, Check, Users, Play, Pause, Loader, Trophy, Navigation, Headphones, X, ScrollText, Clock, WifiOff } from 'lucide-react';
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

// ─── Prayer Countdown Hero ───
const PrayerHero = memo(function PrayerHero({ prayerTimes, theme, t }) {
  const [next, setNext] = useState(null);
  const [countdown, setCountdown] = useState('');
  const navigate = useNavigate();

  const prayerNames = useMemo(() => ({
    fajr: t.prayer_fajr || 'İmsak', sunrise: t.prayer_sunrise || 'Güneş',
    dhuhr: t.prayer_dhuhr || 'Öğle', asr: t.prayer_asr || 'İkindi',
    maghrib: t.prayer_maghrib || 'Akşam', isha: t.prayer_isha || 'Yatsı',
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
        const pt = new Date(now); pt.setHours(h, m, 0, 0);
        if (pt > now) { nextPrayer = { key, time: pt, label: prayerNames[key] }; break; }
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

  const prayerKeys = useMemo(() => [
    { key: 'fajr', label: t.prayer_fajr || 'İmsak' },
    { key: 'dhuhr', label: t.prayer_dhuhr || 'Öğle' },
    { key: 'asr', label: t.prayer_asr || 'İkindi' },
    { key: 'maghrib', label: t.prayer_maghrib || 'Akşam' },
    { key: 'isha', label: t.prayer_isha || 'Yatsı' },
  ], [t]);

  if (!prayerTimes) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      className="mx-4 mb-5 rounded-3xl p-5 relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${theme.surface} 0%, rgba(200,165,90,0.06) 100%)`,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      }}>
      {/* Subtle radial glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.gold}40, transparent)` }} />

      {next && (
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: theme.textSecondary }}>
              {t.next_prayer || 'Sonraki Vakit'}
            </p>
            <p className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
              {next.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>{prayerTimes[next.key]}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums tracking-tight"
              style={{ color: theme.gold, fontFamily: 'Inter, monospace', letterSpacing: '-0.02em' }}>
              {countdown}
            </p>
          </div>
        </div>
      )}

      {/* Compact prayer times row */}
      <div className="flex justify-between">
        {prayerKeys.map(({ key, label }) => {
          const isNext = next?.key === key;
          return (
            <div key={key} className="text-center px-1.5 py-2 rounded-xl flex-1"
              style={isNext ? { background: `${theme.gold}12` } : {}}>
              <p className="text-[9px] uppercase tracking-wider mb-0.5"
                style={{ color: isNext ? theme.gold : theme.textSecondary }}>{label}</p>
              <p className="text-xs font-bold"
                style={{ color: isNext ? theme.gold : theme.textPrimary }}>{prayerTimes[key]}</p>
            </div>
          );
        })}
      </div>

      {/* City name */}
      <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
        <Compass size={12} style={{ color: theme.textSecondary }} />
        <span className="text-[10px]" style={{ color: theme.textSecondary }}>{prayerTimes.city_name} · {prayerTimes.date}</span>
      </div>
    </motion.div>
  );
});

// ─── Quick Actions Grid ───
const QuickActions = memo(function QuickActions({ theme, t, lastRead }) {
  const navigate = useNavigate();
  const items = useMemo(() => [
    { path: lastRead ? `/quran/${lastRead.surah}` : '/quran', icon: BookOpen, label: t.read_quran || "Kur'an", color: '#C8A55A' },
    { path: '/qibla', icon: Navigation, label: t.qibla_short || 'Kıble', color: '#4ADE80' },
    { path: '/quiz', icon: Trophy, label: t.quiz || 'Quiz', color: '#818CF8' },
    { path: '/scholars', icon: Users, label: t.ask_scholar_short || 'Hocaya Sor', color: '#F59E0B' },
    { path: '/meal-audio', icon: Headphones, label: t.listen_meal_short || 'Meal', color: '#60A5FA' },
    { path: '/notes', icon: ScrollText, label: t.my_notes || 'Notlar', color: '#F472B6' },
  ], [t, lastRead]);

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-3 gap-2.5">
        {items.map(({ path, icon: Icon, label, color }, i) => (
          <motion.button key={path} whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.04 }}
            onClick={() => navigate(path)}
            className="rounded-2xl py-4 px-3 flex flex-col items-center gap-2 transition-all"
            style={{ background: `${color}08`, border: `1px solid ${color}12` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <span className="text-[11px] font-semibold" style={{ color: theme.textPrimary }}>{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
});

// ─── Mood Section ───
const MoodSection = memo(function MoodSection({ theme, t }) {
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const tts = useTTS();

  const moods = useMemo(() => [
    { id: 'huzur', label: t.mood_peace || 'Huzur', icon: '☮️' },
    { id: 'motivasyon', label: t.mood_motivation || 'Motivasyon', icon: '🔥' },
    { id: 'sabir', label: t.mood_patience || 'Sabır', icon: '🌿' },
    { id: 'sukur', label: t.mood_gratitude || 'Şükür', icon: '✨' },
  ], [t]);

  const handleMood = async (id) => {
    setSelected(id); setLoading(true);
    try { const { data } = await api.get(`/mood/${id}`); setContent(data); } catch { setContent(null); }
    setLoading(false);
  };

  return (
    <div className="mb-6 animate-fade-in">
      <h2 className="text-base font-bold px-4 mb-3" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
        {t.mood_question || 'Kalbine ne iyi gelir?'}
      </h2>
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-4 pb-2">
        {moods.map(m => (
          <motion.button key={m.id} whileTap={{ scale: 0.95 }} onClick={() => handleMood(m.id)}
            className="shrink-0 rounded-2xl py-3 px-5 text-center transition-all"
            style={{
              background: selected === m.id ? `${theme.gold}18` : theme.cardBg,
              border: `1px solid ${selected === m.id ? `${theme.gold}40` : theme.cardBorder}`,
            }}>
            <span className="text-xl block mb-1">{m.icon}</span>
            <span className="text-xs font-semibold" style={{ color: selected === m.id ? theme.gold : theme.textPrimary }}>{m.label}</span>
          </motion.button>
        ))}
      </div>
      {loading && <div className="text-center py-4"><div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: theme.gold, borderTopColor: 'transparent' }} /></div>}
      {content && !loading && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-3 rounded-2xl p-5" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <p className="arabic-text text-base mb-2" style={{ color: `${theme.textPrimary}e0` }}>{content.ayet.arabic}</p>
          <p className="text-sm mb-1" style={{ color: theme.textSecondary }}>{content.ayet.turkish}</p>
          <p className="text-[10px] mb-4" style={{ color: theme.gold }}>— {content.ayet.sure}</p>
          <div className="pt-3 mb-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
            <p className="text-sm italic" style={{ color: `${theme.textPrimary}cc` }}>"{content.hadis.turkish}"</p>
            <p className="text-[10px] mt-1" style={{ color: theme.textSecondary }}>— {content.hadis.source}</p>
          </div>
          <div className="pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: theme.gold }}>DUA</p>
            <p className="text-sm" style={{ color: `${theme.textPrimary}cc` }}>{content.dua}</p>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => tts.speak(`${content.ayet.turkish}. ${content.hadis.turkish}. ${content.dua}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-medium"
              style={{ background: `${theme.gold}10`, color: theme.gold }}>
              {tts.loading ? <Loader size={12} className="animate-spin" /> : tts.playing ? <Pause size={12} /> : <Play size={12} />}
              {tts.playing ? (t.stop || 'Dur') : (t.listen || 'Dinle')}
            </button>
            <button onClick={() => shareOrCopy(content.label, `${content.ayet.turkish}\n(${content.ayet.sure})\n\n"${content.hadis.turkish}" — ${content.hadis.source}\n\nDua: ${content.dua}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-medium"
              style={{ background: `${theme.gold}10`, color: theme.gold }}>
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className="mx-4 mb-5 rounded-2xl p-5 relative overflow-hidden"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      data-testid="daily-verse">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 pointer-events-none"
        style={{ background: theme.gold, transform: 'translate(40%, -40%)' }} />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${theme.gold}12` }}>
            <BookOpen size={16} style={{ color: theme.gold }} />
          </div>
          <span className="text-sm font-bold" style={{ color: theme.gold }}>{t.verse_of_day || 'Günün Ayeti'}</span>
        </div>
        <span className="text-[10px]" style={{ color: theme.textSecondary }}>{verse.surah_name}</span>
      </div>
      <p className="arabic-text text-lg mb-3 leading-loose" style={{ color: `${theme.textPrimary}e0` }}>{verse.arabic}</p>
      <p className="text-sm leading-relaxed mb-3" style={{ color: theme.textSecondary }}>{verse.turkish}</p>
      <div className="flex gap-2 pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
        <button onClick={() => tts.speak(verse.turkish)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-medium"
          style={{ background: `${theme.gold}10`, color: theme.gold }}>
          {tts.loading ? <Loader size={12} className="animate-spin" /> : tts.playing ? <Pause size={12} /> : <Volume2 size={12} />}
          {tts.playing ? (t.stop || 'Dur') : (t.listen || 'Dinle')}
        </button>
        <button onClick={() => shareOrCopy(t.verse_of_day || 'Günün Ayeti',`${verse.arabic}\n\n${verse.turkish}\n— ${verse.surah_name} ${verse.verse_number}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-medium"
          style={{ background: `${theme.gold}10`, color: theme.gold }}>
          <Share2 size={12} /> {t.share || 'Paylaş'}
        </button>
      </div>
    </motion.div>
  );
});

// ─── Daily Hadith (compact tap-to-expand) ───
const DailyHadith = memo(function DailyHadith({ hadith, theme, t }) {
  const [expanded, setExpanded] = useState(false);
  const tts = useTTS();
  const navigate = useNavigate();
  if (!hadith) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="mx-4 mb-5 rounded-2xl overflow-hidden"
      style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
      data-testid="daily-hadith">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${theme.gold}12` }}>
              <ScrollText size={16} style={{ color: theme.gold }} />
            </div>
            <div>
              <span className="text-sm font-bold block" style={{ color: theme.gold }}>{t.hadith_of_day || 'Günün Hadisi'}</span>
              <span className="text-[10px] block" style={{ color: theme.textSecondary }}>{hadith.source}</span>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: theme.gold, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: `${theme.textPrimary}cc` }}>
          {hadith.turkish}
        </p>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5 overflow-hidden">
            <p className="arabic-text text-base mb-3" style={{ color: `${theme.textPrimary}e0` }}>{hadith.arabic}</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: `${theme.textPrimary}cc` }}>{hadith.turkish}</p>
            <div className="flex gap-2 pt-3" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
              <button onClick={(e) => { e.stopPropagation(); tts.speak(hadith.turkish); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-medium"
                style={{ background: `${theme.gold}10`, color: theme.gold }}>
                {tts.loading ? <Loader size={12} className="animate-spin" /> : tts.playing ? <Pause size={12} /> : <Volume2 size={12} />}
                {tts.playing ? (t.stop || 'Dur') : (t.listen || 'Dinle')}
              </button>
              <button onClick={(e) => { e.stopPropagation(); navigate('/hadith'); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-medium"
                style={{ background: `${theme.gold}10`, color: theme.gold }}>
                <ScrollText size={12} /> {t.hadith_collection_go || 'Koleksiyon'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// ─── Knowledge Cards (horizontal scroll) ───
const KnowledgeCards = memo(function KnowledgeCards({ theme, t }) {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchWithCache('knowledge_cards', () => api.get('/knowledge-cards').then(r => r.data), { ttl: 60 * 60 * 1000 })
      .then(({ data }) => { if (Array.isArray(data)) setCards(data); })
      .catch(() => {});
  }, []);
  if (!cards.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-base font-bold" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
          {t.knowledge_treasure || 'Bilgi Hazinesi'}
        </h2>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{ background: `${theme.gold}12`, color: theme.gold }}>
          🏆 {t.scored || 'Puanlı'}
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
        {cards.map((card, i) => (
          <motion.button key={card.id} whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            onClick={() => navigate(`/knowledge/${card.id}`)}
            className="shrink-0 w-48 rounded-2xl p-4 text-left relative overflow-hidden"
            style={{ background: theme.surface, border: `1px solid ${card.color || theme.gold}15` }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.06]"
              style={{ background: card.color || theme.gold, transform: 'translate(30%, -30%)' }} />
            <span className="text-2xl block mb-2">{card.icon || '📖'}</span>
            <p className="text-sm font-bold mb-0.5" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>{card.title}</p>
            <p className="text-[10px] mb-2" style={{ color: theme.textSecondary }}>{card.items.length} {t.topics || 'konu'}</p>
            <div className="flex items-center gap-1 text-[11px] font-medium" style={{ color: card.color || theme.gold }}>
              <span>{t.explore_it || 'İncele'}</span>
              <ChevronRight size={12} />
            </div>
          </motion.button>
        ))}
      </div>
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
    api.post('/worship/track', updated).catch(() => {});
  };

  const labels = useMemo(() => [
    { key: 'namaz', label: t.prayer_done || 'Namaz', icon: '🕌' },
    { key: 'kuran', label: t.quran_read || "Kur'an", icon: '📖' },
    { key: 'sadaka', label: t.charity_given || 'Sadaka', icon: '💰' },
    { key: 'zikir', label: t.dhikr_done || 'Zikir', icon: '📿' },
  ], [t]);
  const done = Object.values(items).filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="mx-4 mb-5 rounded-2xl p-5" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }} data-testid="worship-tracker">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
          {t.daily_worship || 'Günlük İbadet'}
        </h2>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{ background: `${theme.gold}15`, color: theme.gold }}>
          {done}/4
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {labels.map(({ key, label, icon }) => (
          <motion.button key={key} whileTap={{ scale: 0.92 }} onClick={() => toggle(key)}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all"
            style={{
              background: items[key] ? `${theme.gold}15` : `${theme.textSecondary}08`,
              border: `1px solid ${items[key] ? `${theme.gold}30` : 'transparent'}`,
            }}>
            <span className="text-lg">{icon}</span>
            <span className="text-[9px] font-medium" style={{ color: items[key] ? theme.gold : theme.textSecondary }}>{label}</span>
            {items[key] && <Check size={12} style={{ color: theme.gold }} />}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});

// ─── Dhikr Widget ───
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
    <div className="mx-4 mb-5" data-testid="dhikr-widget">
      {!open ? (
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => setOpen(true)}
          className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
          style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${theme.gold}12` }}>
            <span className="text-lg">📿</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{t.dhikr_counter || 'Zikir Sayacı'}</p>
            <p className="text-[10px]" style={{ color: theme.textSecondary }}>{t.start_dhikr || 'Başlamak için dokun'}</p>
          </div>
          <ChevronRight size={16} style={{ color: theme.gold }} />
        </motion.button>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-5 text-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-4 justify-center flex-wrap">
            {dhikrList.map((d, i) => (
              <button key={d.id} onClick={() => { setActiveIdx(i); setCount(0); }}
                className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all"
                style={i === activeIdx ? { background: theme.gold, color: '#070D18' } : { background: `${theme.textSecondary}12`, color: theme.textSecondary }}>
                {d.turkish}
              </button>
            ))}
          </div>
          {current && (
            <>
              <p className="arabic-text text-lg mb-1" style={{ color: theme.textPrimary }}>{current.arabic}</p>
              <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>{current.meaning}</p>
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleCount}
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold"
                style={{ color: theme.gold, background: `${theme.gold}10`, border: `2px solid ${theme.gold}30` }}>
                {count}
              </motion.button>
              {current.recommended > 0 && <p className="text-[10px] mt-2" style={{ color: theme.textSecondary }}>{t.target || 'Hedef'}: {current.recommended}</p>}
              <button onClick={() => { setOpen(false); setCount(0); }} className="text-xs mt-3" style={{ color: theme.gold }}>Kapat</button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
});

// ─── Ramadan Card ───
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
    <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate('/ramadan')}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="mx-4 mb-5 w-[calc(100%-2rem)] rounded-2xl p-4 text-left"
      style={{ background: `linear-gradient(135deg, ${theme.gold}15, ${theme.gold}06)`, border: `1px solid ${theme.gold}20` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon size={18} style={{ color: theme.gold }} />
          <span className="text-sm font-bold" style={{ color: theme.gold }}>{t.ramadan || 'Ramazan'}</span>
        </div>
        {countdown && <span className="text-base font-bold tabular-nums" style={{ color: theme.gold }}>{countdown}</span>}
        <ChevronRight size={16} style={{ color: theme.gold }} />
      </div>
      {countdown && <p className="text-[10px] mt-1" style={{ color: theme.textSecondary }}>{t.iftar_countdown || 'İftara kalan'}</p>}
    </motion.button>
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
    // Parallel fetch
    Promise.allSettled([
      fetchWithCache(`/prayer-times/${selectedCity}`, { ttl: 30 * 60 * 1000 }),
      fetchWithCache('/quran/random', { ttl: 10 * 60 * 1000 }),
      fetchWithCache('/hadith/random', { ttl: 10 * 60 * 1000 }),
    ]).then(([p, v, h]) => {
      if (p.status === 'fulfilled' && p.value && typeof p.value === 'object') setPrayerTimes(p.value);
      if (v.status === 'fulfilled' && v.value && typeof v.value === 'object') setRandomVerse(v.value);
      if (h.status === 'fulfilled' && h.value && typeof h.value === 'object') setRandomHadith(h.value);
    });
    logger.info('Dashboard loaded', { city: selectedCity });
  }, [selectedCity]);

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

  return (
    <div className="pb-4" style={{ background: theme.bg }} data-testid="dashboard">
      {/* Offline Banner */}
      <AnimatePresence>
        {!online && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium"
            style={{ background: `${theme.gold}15`, color: theme.gold }}>
            <WifiOff size={12} /> {t.offline_banner || 'Çevrimdışı mod'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-5 pt-7 pb-5">
        <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: theme.gold }}>
          Bismillahirrahmanirrahim
        </p>
        <h1 className="text-2xl font-black mt-2" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>
          {t.greeting_hello || 'Selam'}{user?.name ? `, ${user.name}` : ''}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-8 h-px" style={{ background: theme.gold }} />
          <span className="text-[8px]" style={{ color: theme.gold }}>✦</span>
        </div>
      </div>

      <PrayerHero prayerTimes={prayerTimes} theme={theme} t={t} />
      <QuickActions theme={theme} t={t} />
      <MoodSection theme={theme} t={t} />
      <DailyVerse verse={randomVerse} theme={theme} t={t} />
      <DailyHadith hadith={randomHadith} theme={theme} t={t} />
      <KnowledgeCards theme={theme} t={t} />
      <WorshipTracker theme={theme} t={t} />
      <DhikrWidget theme={theme} t={t} />
      <RamadanMini prayerTimes={prayerTimes} theme={theme} t={t} />
    </div>
  );
}
