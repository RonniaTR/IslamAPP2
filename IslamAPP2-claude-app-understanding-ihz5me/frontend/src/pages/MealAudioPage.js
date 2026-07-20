import React, { useState, useEffect } from 'react';
import { ChevronDown, Youtube, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';
import api from '../api';

export default function MealAudioPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [juzList, setJuzList] = useState([]);
  const [activeJuz, setActiveJuz] = useState(null);

  useEffect(() => { api.get('/quran/meal-audio').then(r => { if (Array.isArray(r.data)) setJuzList(r.data); }).catch(() => {}); }, []);

  return (
    <div className="animate-fade-in" data-testid="meal-audio-page">
      <div className="bg-gradient-to-b from-red-900/30 to-transparent px-5 pt-12 pb-4">
        <button onClick={() => navigate('/quran')} className="flex items-center gap-1 text-red-400 text-sm mb-3">
          <ArrowLeft size={18} /> {t.quran}
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Youtube size={24} className="text-red-400" />
          <h1 className="text-xl font-bold text-white">{t.listen_meal}</h1>
        </div>
        <p className="text-sm text-gray-400">Mazlum Kiper · 30 {t.juz}</p>
      </div>
      <div className="px-4 space-y-2 pb-6">
        {juzList.map(juz => (
          <div key={juz.juz} className="glass rounded-xl overflow-hidden" data-testid={`meal-juz-${juz.juz}`}>
            <button onClick={() => setActiveJuz(activeJuz === juz.juz ? null : juz.juz)}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-red-400">{juz.juz}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{juz.juz}. {t.juz}</p>
                <p className="text-[11px] text-gray-500">{juz.narrator}</p>
              </div>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${activeJuz === juz.juz ? 'rotate-180' : ''}`} />
            </button>
            {activeJuz === juz.juz && (
              <div className="px-3 pb-3">
                <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe src={`${juz.embed_url}?rel=0`} title={juz.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
