import React, { useState, useEffect } from 'react';
import { Moon, Sun, BookOpen, Heart, Volume2, Star } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

const DAILY_DUAS = [
  'Allahım, orucumu senin rızan için tuttum, senin verdiğin rızıkla açtım.',
  'Rabbim! Bana ve ana-babama verdiğin nimete şükretmemi ve senin razı olacağın yararlı iş yapmamı bana ilham et.',
  'Allahım! Senden hidayet, takva, iffet ve gönül zenginliği isterim.',
  'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.',
  'Allahım! Kalbimi, gözümü, kulağımı ve bedenimi haramlardan koru.',
];

export default function RamadanPage() {
  const { selectedCity, t } = useLang();
  const { theme } = useTheme();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [randomVerse, setRandomVerse] = useState(null);
  const [randomHadith, setRandomHadith] = useState(null);
  const [iftarCountdown, setIftarCountdown] = useState(null);
  const [sahurCountdown, setSahurCountdown] = useState(null);

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todayDua = DAILY_DUAS[dayOfYear % DAILY_DUAS.length];

  useEffect(() => {
    api.get(`/prayer-times/${selectedCity}`).then(r => { if (r.data && typeof r.data === 'object') setPrayerTimes(r.data); }).catch(() => {});
    api.get('/quran/random').then(r => { if (r.data && typeof r.data === 'object') setRandomVerse(r.data); }).catch(() => {});
    api.get('/hadith/random').then(r => { if (r.data && typeof r.data === 'object') setRandomHadith(r.data); }).catch(() => {});
  }, [selectedCity]);

  useEffect(() => {
    if (!prayerTimes) return;
    const update = () => {
      const now = new Date();
      if (prayerTimes.maghrib) {
        const [h, m] = prayerTimes.maghrib.split(':').map(Number);
        const iftar = new Date(now); iftar.setHours(h, m, 0, 0);
        if (iftar > now) {
          const diff = iftar - now;
          setIftarCountdown({ h: Math.floor(diff/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
        } else { setIftarCountdown(null); }
      }
      if (prayerTimes.fajr) {
        const [h, m] = prayerTimes.fajr.split(':').map(Number);
        const sahur = new Date(now); sahur.setHours(h, m, 0, 0);
        if (sahur > now) {
          const diff = sahur - now;
          setSahurCountdown({ h: Math.floor(diff/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
        } else { setSahurCountdown(null); }
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const pad = n => String(n).padStart(2, '0');

  return (
    <div className="animate-fade-in" data-testid="ramadan-page">
      {/* Header */}
      <div className="px-5 pt-6 pb-4" style={{ background: 'linear-gradient(180deg, rgba(212,175,55,0.12) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Moon size={20} style={{ color: theme.gold }} />
          <p className="text-xs tracking-widest uppercase" style={{ color: theme.gold }}>{t.ramadan_mubarak || 'Ramazan Mübarek'}</p>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>{t.ramadan || 'Ramazan'}</h1>
      </div>

      {/* Iftar Countdown */}
      {iftarCountdown && (
        <div className="mx-4 mb-4 rounded-2xl p-5 text-center animate-pulse-gold" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.25)' }} data-testid="ramadan-iftar">
          <Moon size={24} style={{ color: theme.gold }} className="mx-auto mb-2" />
          <p className="text-xs tracking-widest mb-2" style={{ color: theme.gold }}>{(t.iftar_remaining || 'İftara Kalan Süre').toUpperCase()}</p>
          <div className="flex justify-center gap-3">
            {[{ v: iftarCountdown.h, l: t.hour_short || 'Saat' }, { v: iftarCountdown.m, l: t.min_short || 'Dk' }, { v: iftarCountdown.s, l: t.sec_short || 'Sn' }].map(({ v, l }) => (
              <div key={l} className="text-center">
                <p className="text-3xl font-bold" style={{ color: theme.gold, fontFamily: 'Inter, monospace' }}>{pad(v)}</p>
                <p className="text-[10px] mt-1" style={{ color: theme.textSecondary }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sahur Time */}
      <div className="mx-4 mb-4 card-islamic rounded-2xl p-4" data-testid="ramadan-sahur">
        <div className="flex items-center gap-2 mb-2">
          <Sun size={16} style={{ color: theme.gold }} />
          <span className="text-sm font-semibold" style={{ color: theme.gold }}>{t.sahur_time || 'Sahur Vakti'}</span>
        </div>
        <p className="text-xl font-bold" style={{ color: theme.textPrimary }}>{prayerTimes?.fajr || '--:--'}</p>
        {sahurCountdown && <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{t.remaining || 'Kalan'}: {pad(sahurCountdown.h)}:{pad(sahurCountdown.m)}:{pad(sahurCountdown.s)}</p>}
      </div>

      {/* Today's Dua */}
      <div className="mx-4 mb-4 card-islamic rounded-2xl p-4" data-testid="ramadan-dua">
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} style={{ color: theme.gold }} />
          <span className="text-sm font-semibold" style={{ color: theme.gold }}>{t.today_dua || 'Bugünün Duası'}</span>
        </div>
        <p className="text-sm leading-relaxed italic" style={{ color: theme.textPrimary }}>"{todayDua}"</p>
      </div>

      {/* Today's Verse */}
      {randomVerse && (
        <div className="mx-4 mb-4 card-islamic rounded-2xl p-4" data-testid="ramadan-verse">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} style={{ color: theme.gold }} />
            <span className="text-sm font-semibold" style={{ color: theme.gold }}>{t.today_verse || 'Bugünün Ayeti'}</span>
          </div>
          <p className="arabic-text text-base mb-2" style={{ color: theme.textPrimary, opacity: 0.9 }}>{randomVerse.arabic}</p>
          <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>{randomVerse.turkish}</p>
        </div>
      )}

      {/* Today's Hadith */}
      {randomHadith && (
        <div className="mx-4 mb-4 card-islamic rounded-2xl p-4" data-testid="ramadan-hadith">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 size={16} style={{ color: theme.gold }} />
            <span className="text-sm font-semibold" style={{ color: theme.gold }}>{t.today_hadith || 'Bugünün Hadisi'}</span>
          </div>
          <p className="arabic-text text-sm mb-2" style={{ color: theme.textPrimary, opacity: 0.9 }}>{randomHadith.arabic}</p>
          <p className="text-sm" style={{ color: theme.textSecondary }}>{randomHadith.turkish}</p>
        </div>
      )}

      {/* Sadaka Reminder */}
      <div className="mx-4 mb-4 rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(15,61,46,0.5))', border: '1px solid rgba(212,175,55,0.12)' }} data-testid="ramadan-sadaka">
        <div className="flex items-center gap-2 mb-2">
          <Heart size={16} style={{ color: theme.gold }} />
          <span className="text-sm font-semibold" style={{ color: theme.gold }}>{t.sadaka_reminder || 'Sadaka Hatırlatıcısı'}</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>{t.sadaka_hadith || '"Sadaka verin; çünkü sadaka kıyamet günü sahibine gölge olur." - Hz. Muhammed (s.a.v.)'}</p>
      </div>

      {/* Teravih Info */}
      <div className="mx-4 mb-6 card-islamic rounded-2xl p-4" data-testid="ramadan-teravih">
        <div className="flex items-center gap-2 mb-2">
          <Moon size={16} style={{ color: theme.gold }} />
          <span className="text-sm font-semibold" style={{ color: theme.gold }}>{t.teravih_prayer || 'Teravih Namazı'}</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>{t.teravih_desc || 'Teravih namazı yatsı namazından sonra kılınır. 20 veya 8 rekat olarak kılınabilir. Her 4 rekatta bir dinlenme (teravih) yapılır.'}</p>
        {prayerTimes?.isha && <p className="text-xs mt-2" style={{ color: theme.gold }}>{t.isha_prayer || 'Yatsı Namazı'}: {prayerTimes.isha}</p>}
      </div>
    </div>
  );
}
