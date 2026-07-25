import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Play, Pause, RotateCcw, BookOpen, Trophy, Target, Coffee, Volume2, VolumeX, ChevronDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import { useTx } from '../i18n';
import api from '../api';

const PRESETS = [
  { label: '25 dk', labelEn: '25 min', minutes: 25, break: 5, icon: '📖', desc: 'Klasik Pomodoro', descEn: 'Classic Pomodoro' },
  { label: '45 dk', labelEn: '45 min', minutes: 45, break: 10, icon: '📚', desc: 'Derin Çalışma', descEn: 'Deep Study' },
  { label: '15 dk', labelEn: '15 min', minutes: 15, break: 3, icon: '⚡', desc: 'Hızlı Tekrar', descEn: 'Quick Review' },
  { label: '60 dk', labelEn: '60 min', minutes: 60, break: 15, icon: '🎓', desc: 'Maraton', descEn: 'Marathon' },
];

const TOPICS = [
  { id: 'quran', label: "Kur'an Okuma", labelEn: "Qur'an Reading", icon: '📖' },
  { id: 'hadith', label: 'Hadis Çalışma', labelEn: 'Hadith Study', icon: '📜' },
  { id: 'tafsir', label: 'Tefsir', labelEn: 'Tafsir', icon: '🔍' },
  { id: 'fiqh', label: 'Fıkıh', labelEn: 'Fiqh', icon: '⚖️' },
  { id: 'arabic', label: 'Arapça', labelEn: 'Arabic', icon: '🗣️' },
  { id: 'seerah', label: 'Siyer', labelEn: 'Sīra', icon: '🕌' },
  { id: 'general', label: 'Genel İlim', labelEn: 'General Knowledge', icon: '💡' },
];

const ISLAMIC_QUOTES = [
  { text: "İlim öğrenmek her Müslümana farzdır.", textEn: 'Seeking knowledge is an obligation upon every Muslim.', source: "İbn Mace", sourceEn: 'Ibn Māja' },
  { text: "Beşikten mezara kadar ilim öğreniniz.", textEn: 'Seek knowledge from the cradle to the grave.', source: "Hz. Muhammed (s.a.v)", sourceEn: 'The Prophet Muhammad (pbuh)' },
  { text: "Bir saat tefekkür, bir sene nafile ibadetten hayırlıdır.", textEn: 'An hour of contemplation is better than a year of voluntary worship.', source: "Hadis-i Şerif", sourceEn: 'Noble Hadith' },
  { text: "İlim Çin'de de olsa gidip alınız.", textEn: 'Seek knowledge even if it be in China.', source: "Hz. Muhammed (s.a.v)", sourceEn: 'The Prophet Muhammad (pbuh)' },
  { text: "Ya öğreten ol, ya öğrenen, ya dinleyen, ya da ilmi seven. Beşincisi olma helak olursun.", textEn: 'Be a teacher, a learner, a listener, or one who loves knowledge. Do not be a fifth, lest you perish.', source: "Hz. Muhammed (s.a.v)", sourceEn: 'The Prophet Muhammad (pbuh)' },
  { text: "Allah, ilim öğrenmek için yola çıkan kimseye cennetin yolunu kolaylaştırır.", textEn: 'Allah makes the path to Paradise easy for whoever sets out to seek knowledge.', source: "Müslim", sourceEn: 'Muslim' },
];

export default function PomodoroPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { lang } = useLang();
  const tt = useTx();
  const L = (o, k = 'label') => (lang === 'tr' ? o[k] : (o[k + 'En'] || o[k]));
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup'); // setup, focus, break, done
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('quran');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [quote] = useState(() => ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const uid = user?.user_id || user?.id || 'guest';

  useEffect(() => {
    api.get(`/pomodoro/${uid}`).then(r => {
      const data = Array.isArray(r.data) ? r.data : [];
      setSessions(data);
      const today = new Date().toISOString().split('T')[0];
      const todaySessions = data.filter(s => s.created_at?.startsWith(today) && s.completed);
      setCompletedToday(todaySessions.length);
      setTotalMinutes(data.filter(s => s.completed).reduce((sum, s) => sum + (s.duration_minutes || 0), 0));
    }).catch(() => {});
  }, [uid]);

  const startTimer = useCallback(() => {
    const preset = PRESETS[selectedPreset];
    const seconds = preset.minutes * 60;
    setTimeLeft(seconds);
    setTotalTime(seconds);
    setPhase('focus');
    setIsRunning(true);
    // Record session start
    api.post('/pomodoro', { user_id: uid, topic: selectedTopic, duration_minutes: preset.minutes }).catch(() => {});
  }, [selectedPreset, selectedTopic, uid]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => { setTimeLeft(prev => prev - 1); }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      if (soundEnabled) {
        try { audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ=='); audioRef.current.play().catch(() => {}); } catch {}
      }
      if (phase === 'focus') {
        setCompletedToday(prev => prev + 1);
        setTotalMinutes(prev => prev + PRESETS[selectedPreset].minutes);
        // Record completion
        api.post('/gamification/activity', { user_id: uid, activity_type: 'pomodoro', details: selectedTopic }).catch(() => {});
        // Start break
        const breakTime = PRESETS[selectedPreset].break * 60;
        setTimeLeft(breakTime);
        setTotalTime(breakTime);
        setPhase('break');
        setIsRunning(true);
      } else {
        setPhase('done');
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, phase, selectedPreset, soundEnabled, selectedTopic, uid]);

  const togglePause = () => {
    setIsRunning(prev => !prev);
    if (isRunning) clearInterval(timerRef.current);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setPhase('setup');
    setTimeLeft(PRESETS[selectedPreset].minutes * 60);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 120;

  // ─── SETUP ───
  if (phase === 'setup') return (
    <div className="min-h-screen pb-4" style={{ background: theme.bg }}>
      <div className="px-4 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl" style={{ background: theme.inputBg }}>
            <ArrowLeft size={18} style={{ color: theme.textPrimary }} />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{tt('İlim Saati')}</h1>
            <p className="text-xs" style={{ color: theme.textSecondary }}>{tt('Odaklanarak öğren')}</p>
          </div>
          <Clock size={24} className="ml-auto" style={{ color: theme.gold }} />
        </div>
        {/* Quote */}
        <div className="mt-3 rounded-xl p-3" style={{ background: `${theme.gold}10` }}>
          <p className="text-xs italic" style={{ color: theme.gold }}>"{L(quote, 'text')}"</p>
          <p className="text-[10px] mt-1 text-right" style={{ color: theme.textSecondary }}>— {L(quote, 'source')}</p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Stats Mini */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3 text-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <Target size={18} className="mx-auto mb-1" style={{ color: '#10B981' }} />
            <div className="text-lg font-bold" style={{ color: theme.textPrimary }}>{completedToday}</div>
            <div className="text-[10px]" style={{ color: theme.textSecondary }}>{tt('Bugün')}</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <Clock size={18} className="mx-auto mb-1" style={{ color: theme.gold }} />
            <div className="text-lg font-bold" style={{ color: theme.textPrimary }}>{totalMinutes}</div>
            <div className="text-[10px]" style={{ color: theme.textSecondary }}>Toplam dk</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <Trophy size={18} className="mx-auto mb-1" style={{ color: '#F59E0B' }} />
            <div className="text-lg font-bold" style={{ color: theme.textPrimary }}>{sessions.filter(s => s.completed).length}</div>
            <div className="text-[10px]" style={{ color: theme.textSecondary }}>Toplam</div>
          </div>
        </div>

        {/* Süre Seçimi */}
        <div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>{tt('Süre')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => setSelectedPreset(i)}
                className="rounded-xl p-3 border text-left transition-all"
                style={{ background: selectedPreset === i ? `${theme.gold}15` : theme.cardBg, borderColor: selectedPreset === i ? theme.gold : theme.cardBorder }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: selectedPreset === i ? theme.gold : theme.textPrimary }}>{L(p)}</div>
                    <div className="text-[10px]" style={{ color: theme.textSecondary }}>{L(p, 'desc')} • {p.break} {tt('dk mola')}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Konu Seçimi */}
        <div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>Konu</h3>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(t => (
              <button key={t.id} onClick={() => setSelectedTopic(t.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1"
                style={{ background: selectedTopic === t.id ? theme.gold : theme.inputBg, color: selectedTopic === t.id ? '#000' : theme.textSecondary }}>
                {t.icon} {L(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button onClick={startTimer}
          className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          style={{ background: theme.gold, color: '#000' }}>
          <Play size={18} /> {tt('Başla')} — {L(PRESETS[selectedPreset])}
        </button>
      </div>
    </div>
  );

  // ─── TIMER (focus & break) ───
  if (phase === 'focus' || phase === 'break') return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: theme.bg }}>
      {/* Phase indicator */}
      <div className="mb-6 text-center">
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: phase === 'focus' ? `${theme.gold}20` : '#10B98120', color: phase === 'focus' ? theme.gold : '#10B981' }}>
          {phase === 'focus' ? '🎯 Odaklanma' : '☕ Mola'}
        </span>
        <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
          {phase === 'focus' ? (() => { const tp = TOPICS.find(t => t.id === selectedTopic); return tp ? L(tp) : ''; })() : tt('Dinlen, su iç, dua et')}
        </p>
      </div>

      {/* Circular Timer */}
      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
          <circle cx="130" cy="130" r="120" fill="none" stroke={theme.inputBg} strokeWidth="8" />
          <circle cx="130" cy="130" r="120" fill="none"
            stroke={phase === 'focus' ? theme.gold : '#10B981'}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold font-mono" style={{ color: theme.textPrimary }}>{formatTime(timeLeft)}</div>
          <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>{Math.ceil(timeLeft / 60)} dakika kaldı</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button onClick={reset} className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: theme.inputBg }}>
          <RotateCcw size={20} style={{ color: theme.textSecondary }} />
        </button>
        <button onClick={togglePause}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
          style={{ background: phase === 'focus' ? theme.gold : '#10B981' }}>
          {isRunning ? <Pause size={24} color="#000" /> : <Play size={24} color="#000" />}
        </button>
        <button onClick={() => setSoundEnabled(p => !p)} className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: theme.inputBg }}>
          {soundEnabled ? <Volume2 size={20} style={{ color: theme.textSecondary }} /> : <VolumeX size={20} style={{ color: theme.textSecondary }} />}
        </button>
      </div>

      {/* Motivational quote during focus */}
      {phase === 'focus' && (
        <div className="mt-8 px-6 text-center rounded-xl p-3" style={{ background: `${theme.gold}08` }}>
          <p className="text-xs italic" style={{ color: theme.textSecondary }}>"{L(quote, 'text')}"</p>
        </div>
      )}
    </div>
  );

  // ─── DONE ───
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: theme.bg }}>
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-xl font-bold" style={{ color: theme.gold }}>Tebrikler!</h2>
      <p className="text-sm mt-2" style={{ color: theme.textPrimary }}>{PRESETS[selectedPreset].minutes} dakikalık çalışmanı tamamladın</p>
      <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>Bugün {completedToday} oturum tamamlandı</p>

      <div className="flex gap-3 mt-8 w-full max-w-xs">
        <button onClick={() => { setPhase('setup'); }} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: theme.inputBg, color: theme.textPrimary }}>
          Tekrar
        </button>
        <button onClick={() => navigate('/')} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: theme.gold, color: '#000' }}>
          Ana Sayfa
        </button>
      </div>
    </div>
  );
}
