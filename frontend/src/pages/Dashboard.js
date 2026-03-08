import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageCircle, Users, Award, Volume2, Moon, Compass, Scale } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import api from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, selectedCity } = useLang();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [randomVerse, setRandomVerse] = useState(null);
  const [randomHadith, setRandomHadith] = useState(null);
  const [iftarCountdown, setIftarCountdown] = useState(null);

  useEffect(() => {
    api.get(`/prayer-times/${selectedCity}`).then(r => setPrayerTimes(r.data)).catch(() => {});
    api.get('/quran/random').then(r => setRandomVerse(r.data)).catch(() => {});
    api.get('/hadith/random').then(r => setRandomHadith(r.data)).catch(() => {});
  }, [selectedCity]);

  // Iftar countdown
  useEffect(() => {
    if (!prayerTimes?.maghrib) return;
    const update = () => {
      const now = new Date();
      const [h, m] = prayerTimes.maghrib.split(':').map(Number);
      const iftar = new Date(now);
      iftar.setHours(h, m, 0, 0);
      if (iftar <= now) { setIftarCountdown(null); return; }
      const diff = iftar - now;
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setIftarCountdown(`${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const prayerKeys = [
    { key: 'fajr', label: t.prayer_fajr || 'İmsak' },
    { key: 'sunrise', label: t.prayer_sunrise || 'Güneş' },
    { key: 'dhuhr', label: t.prayer_dhuhr || 'Öğle' },
    { key: 'asr', label: t.prayer_asr || 'İkindi' },
    { key: 'maghrib', label: t.prayer_maghrib || 'Akşam' },
    { key: 'isha', label: t.prayer_isha || 'Yatsı' },
  ];

  const menuCards = [
    { icon: BookOpen, label: "Kur'an", desc: '114 Sure', path: '/quran', gradient: 'from-[#0F3D2E] to-[#164A38]' },
    { icon: Volume2, label: 'Hadis', desc: 'Sahih Hadisler', path: '/hadith', gradient: 'from-[#2D1B0E] to-[#3D2B1E]' },
    { icon: Compass, label: 'Namaz', desc: 'Namaz Vakitleri', path: '/settings', gradient: 'from-[#0F3D2E] to-[#1A5C40]' },
    { icon: MessageCircle, label: 'Dua', desc: 'Günlük Dualar', path: '/chat', gradient: 'from-[#1A2F4A] to-[#0F1F30]' },
    { icon: Users, label: 'Hocalara Sor', desc: 'AI Danışman', path: '/scholars', gradient: 'from-[#3D1B3D] to-[#2D0F2D]' },
    { icon: Award, label: 'Quiz', desc: 'İslam Bilgi', path: '/quiz', gradient: 'from-[#3D2D0F] to-[#2D1F00]' },
    { icon: Scale, label: 'Karşılaştırma', desc: 'Din Karşılaştırma', path: '/scholars', gradient: 'from-[#0F2D3D] to-[#001F2D]' },
    { icon: Moon, label: 'Ramazan', desc: 'İftar & Sahur', path: '/ramadan', gradient: 'from-[#3D3D0F] to-[#2D2D00]' },
  ];

  return (
    <div className="animate-fade-in" data-testid="dashboard">
      {/* Header */}
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(180deg, rgba(15,61,46,0.5) 0%, transparent 100%)' }}>
        <p className="text-[#D4AF37] text-xs tracking-widest uppercase">Bismillahirrahmanirrahim</p>
        <h1 className="text-2xl font-bold mt-1 text-[#F5F5DC]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Selam{user?.name ? `, ${user.name}` : ''}
        </h1>
      </div>

      {/* Iftar Countdown */}
      {iftarCountdown && (
        <div className="mx-4 mb-4 rounded-2xl p-4 text-center animate-pulse-gold" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.25)' }} data-testid="iftar-countdown">
          <p className="text-[#D4AF37] text-xs tracking-widest mb-1">İFTARA KALAN SÜRE</p>
          <p className="text-3xl font-bold text-[#E8C84A] tracking-wider" style={{ fontFamily: 'Inter, monospace' }}>{iftarCountdown}</p>
        </div>
      )}

      {/* Prayer Times */}
      {prayerTimes && (
        <div className="mx-4 mb-4 card-islamic rounded-2xl p-4" data-testid="prayer-times-card">
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

      {/* Daily Verse */}
      {randomVerse && (
        <div className="mx-4 mb-4 card-islamic rounded-2xl p-4" data-testid="daily-verse">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-[#D4AF37]" />
            <span className="text-sm font-semibold text-[#D4AF37]">Günün Ayeti</span>
            <span className="text-xs text-[#A8B5A0] ml-auto">{randomVerse.surah_name} - {randomVerse.verse_number}</span>
          </div>
          <p className="arabic-text text-lg text-[#F5F5DC]/90 mb-3 leading-loose">{randomVerse.arabic}</p>
          <p className="text-sm text-[#A8B5A0] leading-relaxed">{randomVerse.turkish}</p>
        </div>
      )}

      {/* Daily Hadith */}
      {randomHadith && (
        <div className="mx-4 mb-4 card-islamic rounded-2xl p-4" data-testid="daily-hadith">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 size={16} className="text-[#E8C84A]" />
            <span className="text-sm font-semibold text-[#E8C84A]">Günün Hadisi</span>
            <span className="text-xs text-[#A8B5A0] ml-auto">{randomHadith.source}</span>
          </div>
          <p className="arabic-text text-base text-[#F5F5DC]/90 mb-2">{randomHadith.arabic}</p>
          <p className="text-sm text-[#A8B5A0] leading-relaxed">{randomHadith.turkish}</p>
        </div>
      )}

      {/* Menu Grid */}
      <div className="px-4 mb-6">
        <h2 className="text-base font-semibold text-[#F5F5DC] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Keşfet</h2>
        <div className="grid grid-cols-2 gap-3">
          {menuCards.map(({ icon: Icon, label, desc, path, gradient }) => (
            <button key={label} onClick={() => navigate(path)} data-testid={`menu-${label.toLowerCase().replace(/[^a-z]/g,'')}`}
              aria-label={label}
              className={`card-islamic rounded-2xl p-4 text-left bg-gradient-to-br ${gradient}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(212,175,55,0.15)' }}>
                <Icon size={20} className="text-[#D4AF37]" />
              </div>
              <p className="text-sm font-semibold text-[#F5F5DC]">{label}</p>
              <p className="text-[11px] text-[#A8B5A0] mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
