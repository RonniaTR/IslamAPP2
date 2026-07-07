import React, { useState, useEffect } from 'react';
import { ChevronDown, Youtube, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import api from '../api';

export default function MealAudioPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { theme } = useTheme();
  const [juzList, setJuzList] = useState([]);
  const [activeJuz, setActiveJuz] = useState(null);

  useEffect(() => { api.get('/quran/meal-audio').then(r => { if (Array.isArray(r.data)) setJuzList(r.data); }).catch(() => {}); }, []);

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg }} data-testid="meal-audio-page">
      <div className="px-5 pt-8 pb-4" style={{ background: `linear-gradient(180deg, #EF444415, transparent)` }}>
        <button onClick={() => navigate('/quran')} className="flex items-center gap-1 text-sm mb-3" style={{ color: '#EF4444' }}>
          <ArrowLeft size={18} /> {t.quran || "Kur'an"}
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Youtube size={24} style={{ color: '#EF4444' }} />
          <h1 className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>{t.listen_meal || 'Meal Dinle'}</h1>
        </div>
        <p className="text-sm" style={{ color: theme.textSecondary }}>Mazlum Kiper · 30 {t.juz || 'Cüz'}</p>
      </div>
      <div className="px-4 space-y-2 pb-6">
        {juzList.map((juz, i) => (
          <motion.div key={juz.juz} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="rounded-2xl overflow-hidden" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }} data-testid={`meal-juz-${juz.juz}`}>
            <button onClick={() => setActiveJuz(activeJuz === juz.juz ? null : juz.juz)}
              className="w-full flex items-center gap-3 p-3.5 text-left transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EF444412' }}>
                <span className="text-sm font-bold" style={{ color: '#EF4444' }}>{juz.juz}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{juz.juz}. {t.juz || 'Cüz'}</p>
                <p className="text-[10px]" style={{ color: theme.textSecondary }}>{juz.narrator}</p>
              </div>
              <ChevronDown size={16} style={{ color: theme.textSecondary, transform: activeJuz === juz.juz ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {activeJuz === juz.juz && (
              <div className="px-3 pb-3">
                <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe src={`${juz.embed_url}?rel=0`} title={juz.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
