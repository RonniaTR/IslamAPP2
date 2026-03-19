import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Volume2, Moon, Compass, Heart, Share2, ChevronRight, Check, Users, Copy, Play, Pause, Loader, Trophy, Navigation, Headphones, X, ScrollText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS, shareOrCopy } from '../hooks/useShared';
import api from '../api';

// ─── Mood Section (horizontal scroll) ───
function MoodSection() {
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const tts = useTTS();

  const moods = [
    { id: 'huzur', label: 'Huzur', icon: '☮️', desc: 'İç huzur ve sükûnet' },
    { id: 'motivasyon', label: 'Motivasyon', icon: '🔥', desc: 'Güç ve azim' },
    { id: 'sabir', label: 'Sabır', icon: '🌿', desc: 'Dayanma gücü' },
    { id: 'sukur', label: 'Şükür', icon: '✨', desc: 'Nimete şükretmek' },
  ];

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
      <p className="text-sm text-[#D4AF37] mb-3 px-4" style={{ fontFamily: 'Playfair Display, serif' }}>
        Bugün kalbin neye ihtiyaç duyuyor?
      </p>
      {/* Horizontal scroll mood cards */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
        {moods.map(m => (
          <button key={m.id} onClick={() => handleMood(m.id)} data-testid={`mood-${m.id}`}
            className={`shrink-0 w-28 rounded-2xl py-3 px-2 text-center transition-all duration-300 ${selected === m.id ? 'scale-[1.03]' : ''}`}
            style={{ background: selected === m.id ? 'rgba(212,175,55,0.2)' : 'rgba(15,61,46,0.5)', border: `1px solid ${selected === m.id ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.08)'}` }}>
            <span className="text-2xl block mb-1">{m.icon}</span>
            <span className="text-xs font-semibold text-[#F5F5DC] block">{m.label}</span>
            <span className="text-[9px] text-[#A8B5A0] mt-0.5 block">{m.desc}</span>
          </button>
        ))}
      </div>
      {loading && <div className="text-center py-4"><div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" /></div>}
      {content && !loading && (
        <div className="mx-4 mt-3 card-islamic rounded-2xl p-4 animate-fade-in" data-testid="mood-content">
          <p className="arabic-text text-base text-[#F5F5DC]/90 mb-1">{content.ayet.arabic}</p>
          <p className="text-sm text-[#A8B5A0] mb-1">{content.ayet.turkish}</p>
          <p className="text-[10px] text-[#D4AF37] mb-3">— {content.ayet.sure}</p>
          <div className="border-t border-[#D4AF37]/10 pt-3 mb-3">
            <p className="text-sm text-[#F5F5DC]/80 italic">"{content.hadis.turkish}"</p>
            <p className="text-[10px] text-[#A8B5A0] mt-1">— {content.hadis.source}</p>
          </div>
          <div className="border-t border-[#D4AF37]/10 pt-3">
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider mb-1">Dua</p>
            <p className="text-sm text-[#F5F5DC]/80">{content.dua}</p>
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#D4AF37]/10">
            <button onClick={() => tts.speak(`${content.ayet.turkish}. ${content.hadis.turkish}. ${content.dua}`)} data-testid="mood-tts"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium text-[#D4AF37] transition-colors"
              style={{ background: 'rgba(212,175,55,0.1)' }}>
              {tts.loading ? <Loader size={12} className="animate-spin" /> : tts.playing ? <Pause size={12} /> : <Play size={12} />}
              {tts.loading ? 'Yükleniyor' : tts.playing ? 'Durdur' : 'Dinle'}
            </button>
            <button onClick={() => shareOrCopy(content.label, `${content.ayet.turkish}\n(${content.ayet.sure})\n\n"${content.hadis.turkish}" — ${content.hadis.source}\n\nDua: ${content.dua}`)} data-testid="mood-share"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium text-[#D4AF37] transition-colors"
              style={{ background: 'rgba(212,175,55,0.1)' }}>
              <Share2 size={12} /> Paylaş
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Daily Verse Card ───
function DailyVerse({ verse }) {
  const tts = useTTS();
  if (!verse) return null;
  return (
    <div className="mx-4 mb-4 card-islamic rounded-2xl p-4 animate-fade-in" data-testid="daily-verse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-[#D4AF37]" />
          <span className="text-sm font-semibold text-[#D4AF37]">Günün Ayeti</span>
        </div>
        <span className="text-xs text-[#A8B5A0]">{verse.surah_name} - {verse.verse_number}</span>
      </div>
      <p className="arabic-text text-lg text-[#F5F5DC]/90 mb-3 leading-loose">{verse.arabic}</p>
      <p className="text-sm text-[#A8B5A0] leading-relaxed mb-3">{verse.turkish}</p>
      <div className="flex gap-2 pt-2 border-t border-[#D4AF37]/10">
        <button onClick={() => tts.speak(verse.turkish)} data-testid="verse-listen-btn" aria-label="Ayeti dinle"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium text-[#D4AF37] transition-colors"
          style={{ background: 'rgba(212,175,55,0.1)' }}>
          {tts.loading ? <Loader size={12} className="animate-spin" /> : tts.playing ? <Pause size={12} /> : <Volume2 size={12} />}
          {tts.loading ? 'Yükleniyor...' : tts.playing ? 'Durdur' : 'Dinle'}
        </button>
        <button onClick={() => shareOrCopy('Günün Ayeti', `${verse.arabic}\n\n${verse.turkish}\n— ${verse.surah_name} ${verse.verse_number}`)} data-testid="verse-share-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium text-[#D4AF37] transition-colors"
          style={{ background: 'rgba(212,175,55,0.1)' }}>
          <Share2 size={12} /> Paylaş
        </button>
      </div>
    </div>
  );
}

// ─── Hadith Overlay Modal ───
function HadithModal({ hadith, onClose }) {
  const tts = useTTS();
  const navigate = useNavigate();
  if (!hadith) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-[520px] mx-auto animate-slide-up" onClick={e => e.stopPropagation()}
        style={{ background: 'linear-gradient(180deg, #0F3D2E 0%, #0A1F14 100%)', borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflow: 'auto' }}>
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <X size={16} className="text-[#A8B5A0]" />
        </button>
        <div className="px-6 pt-2 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <ScrollText size={18} className="text-[#E8C84A]" />
            <span className="text-sm font-semibold text-[#E8C84A]">Hadis-i Şerif</span>
          </div>
          {/* Arabic text */}
          <div className="p-4 rounded-2xl mb-4" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <p className="arabic-text text-lg text-[#F5F5DC]/90 leading-loose text-center">{hadith.arabic}</p>
          </div>
          {/* Turkish meaning */}
          <p className="text-sm text-[#F5F5DC]/90 leading-relaxed mb-2">{hadith.turkish}</p>
          <p className="text-[11px] text-[#D4AF37] mb-5">— {hadith.source}</p>
          {/* Actions */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => tts.speak(hadith.turkish)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-[#E8C84A]"
              style={{ background: 'rgba(232,200,74,0.1)', border: '1px solid rgba(232,200,74,0.2)' }}>
              {tts.loading ? <Loader size={14} className="animate-spin" /> : tts.playing ? <Pause size={14} /> : <Volume2 size={14} />}
              {tts.loading ? 'Yükleniyor...' : tts.playing ? 'Durdur' : 'Dinle'}
            </button>
            <button onClick={() => shareOrCopy('Hadis-i Şerif', `${hadith.arabic}\n\n${hadith.turkish}\n— ${hadith.source}`)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-[#E8C84A]"
              style={{ background: 'rgba(232,200,74,0.1)', border: '1px solid rgba(232,200,74,0.2)' }}>
              <Share2 size={14} /> Paylaş
            </button>
          </div>
          <button onClick={() => { onClose(); navigate('/hadith'); }}
            className="w-full py-3 rounded-xl text-sm font-semibold text-[#0A1F14] flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            <ScrollText size={16} /> Hadis Koleksiyonuna Git
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Daily Hadith Card (Compact - opens modal) ───
function DailyHadith({ hadith }) {
  const [showModal, setShowModal] = useState(false);
  if (!hadith) return null;
  // Truncate Turkish text for preview
  const preview = hadith.turkish?.length > 80 ? hadith.turkish.slice(0, 80) + '...' : hadith.turkish;
  return (
    <>
      <button onClick={() => setShowModal(true)} className="mx-4 mb-4 w-[calc(100%-2rem)] text-left card-islamic rounded-2xl p-4 animate-fade-in transition-all active:scale-[0.98]" data-testid="daily-hadith">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(232,200,74,0.15)' }}>
              <ScrollText size={14} className="text-[#E8C84A]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#E8C84A] block">Günün Hadisi</span>
              <span className="text-[10px] text-[#A8B5A0]">{hadith.source}</span>
            </div>
          </div>
          <div className="px-2 py-1 rounded-lg text-[10px] font-medium text-[#E8C84A]" style={{ background: 'rgba(232,200,74,0.1)' }}>
            Oku →
          </div>
        </div>
        <p className="text-sm text-[#F5F5DC]/80 leading-relaxed line-clamp-2">{preview}</p>
      </button>
      {showModal && <HadithModal hadith={hadith} onClose={() => setShowModal(false)} />}
    </>
  );
}

// ─── Knowledge Cards (Enhanced with categories) ───
function KnowledgeCards() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);

  useEffect(() => { api.get('/knowledge-cards').then(r => { if (Array.isArray(r.data)) setCards(r.data); }).catch(() => {}); }, []);
  if (!cards.length) return null;

  const totalItems = cards.reduce((s, c) => s + c.items.length, 0);

  return (
    <div className="mb-5 animate-fade-in" data-testid="knowledge-cards">
      <div className="flex items-center justify-between px-4 mb-3">
        <div>
          <h2 className="text-lg font-bold text-[#F5F5DC]" style={{ fontFamily: 'Playfair Display, serif' }}>İslam Bilgi Hazinesi</h2>
          <p className="text-[10px] text-[#A8B5A0] mt-0.5">{cards.length} kategori, {totalItems}+ konu</p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full text-[#D4AF37] font-semibold flex items-center gap-1" style={{ background: 'rgba(212,175,55,0.15)' }}>
          🏆 Puanlı
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-3">
        {cards.map(card => {
          const basicCount = card.items.filter(i => i.level === 'basic' || !i.level).length;
          const deepCount = card.items.filter(i => i.level === 'deep').length;
          return (
            <button key={card.id} onClick={() => navigate(`/knowledge/${card.id}`)} data-testid={`knowledge-${card.id}`}
              className="shrink-0 w-52 rounded-2xl p-4 text-left transition-all active:scale-[0.97] relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, rgba(15,61,46,0.8), rgba(10,31,20,0.95))`, border: `1px solid ${card.color || '#D4AF37'}25` }}>
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: card.color || '#D4AF37', transform: 'translate(30%, -30%)' }} />
              <span className="text-2xl block mb-2">{card.icon || '📖'}</span>
              <p className="text-sm font-bold text-[#F5F5DC] mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{card.title}</p>
              <p className="text-[10px] text-[#A8B5A0] mb-2">{card.items.length} konu</p>
              {deepCount > 0 && (
                <div className="flex gap-1 mb-2">
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full text-[#4ADE80]" style={{ background: 'rgba(74,222,128,0.12)' }}>Temel: {basicCount}</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full text-[#818CF8]" style={{ background: 'rgba(129,140,248,0.12)' }}>Derin: {deepCount}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-[11px] font-medium" style={{ color: card.color || '#D4AF37' }}>
                <span>İncele</span>
                <ChevronRight size={12} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Dhikr Counter Widget ───
function DhikrWidget() {
  const [dhikrList, setDhikrList] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => { api.get('/dhikr').then(r => { if (Array.isArray(r.data)) setDhikrList(r.data); }).catch(() => {}); }, []);
  const current = dhikrList[activeIdx];

  const handleCount = () => {
    setCount(c => c + 1);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  if (!dhikrList.length) return null;

  return (
    <div className="mx-4 mb-5 animate-fade-in" data-testid="dhikr-widget">
      {!open ? (
        <button onClick={() => setOpen(true)} data-testid="dhikr-start-btn"
          className="w-full card-islamic rounded-2xl p-4 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
            <span className="text-lg">📿</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F5F5DC]">Zikir Sayacı</p>
            <p className="text-[11px] text-[#A8B5A0]">Zikir başlat</p>
          </div>
          <ChevronRight size={16} className="text-[#D4AF37] ml-auto" />
        </button>
      ) : (
        <div className="card-islamic rounded-2xl p-5 text-center" data-testid="dhikr-counter">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-4 pb-1 justify-center flex-wrap">
            {dhikrList.map((d, i) => (
              <button key={d.id} onClick={() => { setActiveIdx(i); setCount(0); }}
                className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${i === activeIdx ? 'text-[#0A1F14] bg-[#D4AF37]' : 'text-[#A8B5A0]'}`}
                style={i !== activeIdx ? { background: 'rgba(255,255,255,0.05)' } : {}}>
                {d.turkish}
              </button>
            ))}
          </div>
          {current && (
            <>
              <p className="arabic-text text-xl text-[#F5F5DC] mb-1">{current.arabic}</p>
              <p className="text-xs text-[#A8B5A0] mb-4">{current.meaning}</p>
              <button onClick={handleCount} data-testid="dhikr-tap-btn"
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-[#E8C84A] transition-all active:scale-90 animate-pulse-gold"
                style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', border: '2px solid rgba(212,175,55,0.3)' }}>
                {count}
              </button>
              {current.recommended > 0 && <p className="text-[10px] text-[#A8B5A0] mt-2">Hedef: {current.recommended}</p>}
              <button onClick={() => { setOpen(false); setCount(0); }} className="text-xs text-[#D4AF37] mt-3 hover:underline">Kapat</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Worship Tracker ───
function WorshipTracker() {
  const [items, setItems] = useState({ namaz: false, kuran: false, sadaka: false, zikir: false });

  useEffect(() => { api.get('/worship/today').then(r => { if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) setItems(prev => ({ ...prev, ...r.data })); }).catch(() => {}); }, []);

  const toggle = async (key) => {
    const updated = { ...items, [key]: !items[key] };
    setItems(updated);
    api.post('/worship/track', { namaz: updated.namaz, kuran: updated.kuran, sadaka: updated.sadaka, zikir: updated.zikir }).catch(() => {});
  };

  const labels = [
    { key: 'namaz', label: 'Namaz kılındı', icon: '🕌' },
    { key: 'kuran', label: "Kur'an okundu", icon: '📖' },
    { key: 'sadaka', label: 'Sadaka verildi', icon: '💰' },
    { key: 'zikir', label: 'Zikir yapıldı', icon: '📿' },
  ];
  const done = Object.values(items).filter(Boolean).length;

  return (
    <div className="mx-4 mb-5 card-islamic rounded-2xl p-4 animate-fade-in" data-testid="worship-tracker">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-[#D4AF37]" style={{ fontFamily: 'Playfair Display, serif' }}>Günlük İbadet Takibi</p>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>{done}/4</span>
      </div>
      <div className="space-y-2">
        {labels.map(({ key, label, icon }) => (
          <button key={key} onClick={() => toggle(key)} data-testid={`worship-${key}`}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all"
            style={{ background: items[key] ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)' }}>
            <span className="text-base">{icon}</span>
            <span className={`text-sm flex-1 text-left ${items[key] ? 'text-[#D4AF37] line-through' : 'text-[#F5F5DC]'}`}>{label}</span>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${items[key] ? 'bg-[#D4AF37]' : ''}`}
              style={!items[key] ? { border: '1.5px solid rgba(212,175,55,0.3)' } : {}}>
              {items[key] && <Check size={12} className="text-[#0A1F14]" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Ramadan Mini Card ───
function RamadanMini({ prayerTimes }) {
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
    <button onClick={() => navigate('/ramadan')} data-testid="ramadan-mini"
      className="mx-4 mb-5 w-[calc(100%-2rem)] rounded-2xl p-4 text-left animate-fade-in transition-all active:scale-[0.98]"
      style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.25)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon size={18} className="text-[#D4AF37]" />
          <span className="text-sm font-semibold text-[#D4AF37]">Ramazan</span>
        </div>
        {countdown && <span className="text-lg font-bold text-[#E8C84A]" style={{ fontFamily: 'Inter, monospace' }}>{countdown}</span>}
        <ChevronRight size={16} className="text-[#D4AF37]" />
      </div>
      {countdown && <p className="text-[10px] text-[#A8B5A0] mt-1">İftara kalan süre</p>}
    </button>
  );
}

// ─── Quick Access Grid ───
function QuickAccess() {
  const navigate = useNavigate();
  const items = [
    { path: '/quiz', icon: Trophy, label: 'Quiz', desc: 'Bilgini test et', color: '#E8C84A' },
    { path: '/qibla', icon: Navigation, label: 'Kıble', desc: 'Kıble yönünü bul', color: '#4ADE80' },
    { path: '/meal-audio', icon: Headphones, label: 'Meal Dinle', desc: 'Türkçe meal seslendirme', color: '#60A5FA' },
    { path: '/scholars', icon: Users, label: 'Hocaya Sor', desc: '12 alimden görüş al', color: '#D4AF37' },
  ];
  return (
    <div className="mx-4 mb-5 animate-fade-in" data-testid="quick-access">
      <h2 className="text-sm font-semibold text-[#D4AF37] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Hızlı Erişim</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ path, icon: Icon, label, desc, color }) => (
          <button key={path} onClick={() => navigate(path)} data-testid={`quick-${path.slice(1)}`}
            className="rounded-2xl p-4 text-left transition-all active:scale-[0.97]"
            style={{ background: 'rgba(15,61,46,0.5)', border: `1px solid ${color}20` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-sm font-semibold text-[#F5F5DC]">{label}</p>
            <p className="text-[10px] text-[#A8B5A0] mt-0.5">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───
export default function Dashboard() {
  const { user } = useAuth();
  const { selectedCity } = useLang();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [randomVerse, setRandomVerse] = useState(null);
  const [randomHadith, setRandomHadith] = useState(null);

  useEffect(() => {
    api.get(`/prayer-times/${selectedCity}`).then(r => { if (r.data && typeof r.data === 'object') setPrayerTimes(r.data); }).catch(() => {});
    api.get('/quran/random').then(r => { if (r.data && typeof r.data === 'object') setRandomVerse(r.data); }).catch(() => {});
    api.get('/hadith/random').then(r => { if (r.data && typeof r.data === 'object') setRandomHadith(r.data); }).catch(() => {});
  }, [selectedCity]);

  const prayerKeys = [
    { key: 'fajr', label: 'İmsak' }, { key: 'sunrise', label: 'Güneş' },
    { key: 'dhuhr', label: 'Öğle' }, { key: 'asr', label: 'İkindi' },
    { key: 'maghrib', label: 'Akşam' }, { key: 'isha', label: 'Yatsı' },
  ];

  return (
    <div className="pb-4" data-testid="dashboard">
      {/* Header */}
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(180deg, rgba(15,61,46,0.5) 0%, transparent 100%)' }}>
        <p className="text-[#D4AF37] text-xs tracking-widest uppercase">Bismillahirrahmanirrahim</p>
        <h1 className="text-2xl font-bold mt-1 text-[#F5F5DC]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Selam{user?.name ? `, ${user.name}` : ''}
        </h1>
      </div>

      <MoodSection />
      <DailyVerse verse={randomVerse} />
      <DailyHadith hadith={randomHadith} />
      <KnowledgeCards />
      <DhikrWidget />
      <WorshipTracker />
      <RamadanMini prayerTimes={prayerTimes} />

      {/* Prayer Times */}
      {prayerTimes && (
        <div className="mx-4 mb-5 card-islamic rounded-2xl p-4 animate-fade-in" data-testid="prayer-times-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-[#D4AF37]" />
              <span className="text-sm font-semibold text-[#F5F5DC]">{prayerTimes.city_name}</span>
            </div>
            <span className="text-xs text-[#A8B5A0]">{prayerTimes.date}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {prayerKeys.map(({ key, label }) => (
              <div key={key} className="text-center py-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)' }}>
                <p className="text-[10px] text-[#D4AF37] uppercase tracking-wide">{label}</p>
                <p className="text-sm font-bold text-[#F5F5DC] mt-0.5">{prayerTimes[key]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <QuickAccess />
    </div>
  );
}
