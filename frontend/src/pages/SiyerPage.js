import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, ChevronRight, Sparkles, Moon, Sun, Type, Bookmark, HelpCircle, CheckCircle2, XCircle, Trophy, RefreshCw, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { SIYER_UNITS } from '../data/siyerData';
import { SIYER_QUIZZES } from '../data/siyerQuizzes';
import { awardXP } from '../services/gamification';
import { useAuth } from '../contexts/AuthContext';
import Confetti from './games/Confetti';

export default function SiyerPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  // Reading preferences (Font Family, Size, Theme)
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('siyer_font_family') || 'Georgia');
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem('siyer_font_size')) || 16);
  const [readerTheme, setReaderTheme] = useState(() => localStorage.getItem('siyer_reader_theme') || 'dark');
  const [showSettings, setShowSettings] = useState(false);

  // Active Unit and Topic selection
  const [selectedUnit, setSelectedUnit] = useState(SIYER_UNITS[0]);
  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);
  const [bookmarkedTopics, setBookmarkedTopics] = useState(() => {
    try { return JSON.parse(localStorage.getItem('siyer_bookmarks')) || []; } catch { return []; }
  });

  // Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => { localStorage.setItem('siyer_font_family', fontFamily); }, [fontFamily]);
  useEffect(() => { localStorage.setItem('siyer_font_size', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('siyer_reader_theme', readerTheme); }, [readerTheme]);
  useEffect(() => { localStorage.setItem('siyer_bookmarks', JSON.stringify(bookmarkedTopics)); }, [bookmarkedTopics]);

  const toggleBookmark = (topicTitle) => {
    setBookmarkedTopics(prev => 
      prev.includes(topicTitle) ? prev.filter(t => t !== topicTitle) : [...prev, topicTitle]
    );
  };

  const currentTopic = selectedUnit.topics[selectedTopicIdx];
  const unitQuizzes = SIYER_QUIZZES[selectedUnit.id] || [];

  // Theme styles based on readerTheme
  const themeStyles = {
    dark: { bg: '#0A1A12', cardBg: '#0F3523', text: '#E2E8F0', border: '#1A3826', titleColor: '#F59E0B' },
    sepia: { bg: '#FBF0D9', cardBg: '#F3E5C8', text: '#4A3B32', border: '#E2E8F0', titleColor: '#9A3412' },
    light: { bg: '#F8FAFC', cardBg: '#FFFFFF', text: '#1E293B', border: '#E2E8F0', titleColor: '#059669' }
  }[readerTheme];

  const handleStartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
    setShowQuizModal(true);
  };

  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null) return; // Prevent multiple selection
    setSelectedAnswer(index);
    const isCorrect = index === unitQuizzes[currentQuizIndex].correct;
    if (isCorrect) setQuizScore(prev => prev + 1);
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex < unitQuizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
      if (quizScore + (selectedAnswer === unitQuizzes[currentQuizIndex].correct ? 1 : 0) >= 3) {
        setShowConfetti(true);
        awardXP(user, 'siyer_quiz', { points: 50 }).catch(console.error);
      }
    }
  };

  return (
    <div className="min-h-screen pb-28 relative transition-colors duration-300 font-sans" style={{ backgroundColor: themeStyles.bg, color: themeStyles.text }}>
      
      {showConfetti && <Confetti />}

      {/* Top Bar */}
      <div className="sticky top-0 z-30 backdrop-blur-md px-4 py-3 border-b flex items-center justify-between shadow-md"
        style={{ backgroundColor: `${themeStyles.bg}E6`, borderColor: themeStyles.border }}>
        <button 
          onClick={() => navigate('/discover')}
          className="flex items-center gap-2 text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={18} />
          <span>Keşfet'e Dön</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Unit Quiz Button */}
          <button
            onClick={handleStartQuiz}
            className="flex items-center gap-1.5 bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 text-[#f59e0b] px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-[#f59e0b]/30"
          >
            <HelpCircle size={14} />
            <span>Ünite Testi (+50 XP)</span>
          </button>

          {/* Reader Settings Toggle */}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full border flex items-center justify-center transition-all hover:scale-105"
            style={{ backgroundColor: `${themeStyles.cardBg}`, borderColor: themeStyles.border }}
            title="Yazı Tipi ve Tema Ayarları"
          >
            <Type size={18} className="text-[#10b981]" />
          </button>
        </div>
      </div>

      {/* Reader Settings Floating Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="sticky top-14 z-40 mx-4 my-2 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl"
            style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.border }}
          >
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block mb-2 opacity-70">Yazı Tipi (Font)</span>
                <div className="flex gap-2">
                  {[
                    { name: 'Georgia', val: 'Georgia, serif' },
                    { name: 'Sans', val: 'system-ui, sans-serif' },
                    { name: 'Serif', val: 'Times New Roman, serif' },
                    { name: 'Monospace', val: 'monospace' }
                  ].map(f => (
                    <button
                      key={f.name}
                      onClick={() => setFontFamily(f.val)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${fontFamily === f.val ? 'border-[#10b981] bg-[#10b981]/20 text-[#10b981]' : 'opacity-70 border-transparent'}`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">Yazı Boyutu</span>
                  <span className="text-xs font-bold">{fontSize}px</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs">A-</span>
                  <input 
                    type="range" min="13" max="24" value={fontSize} 
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="flex-1 accent-[#10b981]"
                  />
                  <span className="text-base font-bold">A+</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider block mb-2 opacity-70">Tema</span>
                <div className="flex gap-2">
                  {[
                    { id: 'dark', label: '🌙 Gece', bg: '#0A1A12', text: '#FFF' },
                    { id: 'sepia', label: '📜 Kitap (Sepya)', bg: '#FBF0D9', text: '#4A3B32' },
                    { id: 'light', label: '☀️ Gündüz', bg: '#FFFFFF', text: '#000' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setReaderTheme(t.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all ${readerTheme === t.id ? 'border-[#10b981] ring-2 ring-[#10b981]/30' : 'opacity-70'}`}
                      style={{ backgroundColor: t.bg, color: t.text }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 pt-6">

        {/* Hero Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[#10b981] text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles size={14} />
            <span>Özet anlatım · kaynaklar Ayarlar › Kaynaklar ve lisanslar</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: themeStyles.titleColor }}>
            Siyer-i Nebî
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Hazret-i Peygamber Efendimizin (s.a.v.) Doğumu, Hayatı, Mücadelesi ve Asr-ı Saadet Kronolojisi
          </p>
        </div>

        {/* Units Scroll Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {SIYER_UNITS.map((unit) => {
            const isSelected = selectedUnit.id === unit.id;
            return (
              <button
                key={unit.id}
                onClick={() => { setSelectedUnit(unit); setSelectedTopicIdx(0); }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap border shrink-0 transition-all flex items-center gap-2 shadow-sm ${isSelected ? 'bg-[#10b981] text-white border-[#10b981] shadow-lg shadow-[#10b981]/20 scale-105' : 'opacity-80 hover:opacity-100'}`}
                style={{ backgroundColor: isSelected ? '#10b981' : themeStyles.cardBg, borderColor: isSelected ? '#10b981' : themeStyles.border }}
              >
                <span>{unit.icon}</span>
                <span>{unit.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Unit Header */}
        <div className="p-5 rounded-3xl border mb-6 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.border }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#10b981]/20 text-[#10b981]">
                {selectedUnit.period}
              </span>
              <span className="text-xs font-semibold opacity-60">
                {selectedUnit.topics.length} Konu Başlığı
              </span>
            </div>
            <h2 className="text-xl font-bold mb-1" style={{ color: themeStyles.titleColor }}>{selectedUnit.title}</h2>
            <p className="text-xs leading-relaxed opacity-80 max-w-2xl">{selectedUnit.summary}</p>
          </div>

          <button
            onClick={handleStartQuiz}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#f59e0b] to-amber-600 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all shrink-0"
          >
            <Trophy size={16} />
            <span>Ünite Testini Çöz</span>
          </button>
        </div>

        {/* Topic Content & Reader Area */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Topics List */}
          <div className="md:col-span-1 flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 px-1 mb-1">Konu Başlıkları</h3>
            {selectedUnit.topics.map((topic, i) => {
              const isCurrent = selectedTopicIdx === i;
              const isBookmarked = bookmarkedTopics.includes(topic.title);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedTopicIdx(i)}
                  className={`w-full p-3.5 rounded-2xl text-start border transition-all flex items-center justify-between group ${isCurrent ? 'border-[#10b981] shadow-md scale-[1.02]' : 'opacity-80 hover:opacity-100'}`}
                  style={{ backgroundColor: isCurrent ? `${themeStyles.cardBg}` : 'transparent', borderColor: isCurrent ? '#10b981' : themeStyles.border }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pe-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-[#10b981] animate-ping' : 'bg-gray-500/40'}`} />
                    <span className={`text-xs font-bold truncate ${isCurrent ? 'text-[#10b981]' : ''}`}>
                      {topic.title}
                    </span>
                  </div>
                  {isBookmarked && <Bookmark size={14} className="text-[#f59e0b] fill-[#f59e0b] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Right Column: Reading Card with Font Customization */}
          <div className="md:col-span-2 p-6 rounded-3xl border shadow-2xl relative"
            style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.border }}>
            
            {/* Topic Header Actions */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b" style={{ borderColor: themeStyles.border }}>
              <span className="text-xs font-bold text-[#10b981] uppercase tracking-wider">
                {selectedUnit.title.split(':')[0]} · Paragraf {selectedTopicIdx + 1}
              </span>

              <button 
                onClick={() => toggleBookmark(currentTopic.title)}
                className={`p-2 rounded-full border transition-all flex items-center gap-1 text-xs font-bold ${bookmarkedTopics.includes(currentTopic.title) ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]' : 'opacity-60 hover:opacity-100'}`}
                style={{ borderColor: themeStyles.border }}
              >
                <Bookmark size={14} className={bookmarkedTopics.includes(currentTopic.title) ? 'fill-[#f59e0b]' : ''} />
                <span>{bookmarkedTopics.includes(currentTopic.title) ? 'Kaydedildi' : 'Kaydet'}</span>
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-6 leading-snug" style={{ color: themeStyles.titleColor, fontFamily }}>
              {currentTopic.title}
            </h2>

            {/* Text Body */}
            <div 
              className="leading-relaxed transition-all whitespace-pre-line"
              style={{ fontFamily, fontSize: `${fontSize}px`, color: themeStyles.text }}
            >
              {currentTopic.content}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-4 border-t gap-4" style={{ borderColor: themeStyles.border }}>
              <button
                disabled={selectedTopicIdx === 0}
                onClick={() => setSelectedTopicIdx(prev => Math.max(0, prev - 1))}
                className="px-4 py-2.5 rounded-xl border text-xs font-bold disabled:opacity-30 hover:border-[#10b981] transition-all flex items-center gap-1"
                style={{ borderColor: themeStyles.border }}
              >
                ← Önceki Konu
              </button>

              <button
                disabled={selectedTopicIdx === selectedUnit.topics.length - 1}
                onClick={() => setSelectedTopicIdx(prev => Math.min(selectedUnit.topics.length - 1, prev + 1))}
                className="px-4 py-2.5 rounded-xl bg-[#10b981] text-white text-xs font-bold disabled:opacity-30 hover:bg-[#059669] transition-all flex items-center gap-1 shadow-lg shadow-[#10b981]/20"
              >
                <span>Sonraki Konu</span>
                →
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuizModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-[#0F3523] to-[#0A1A12] border border-[color:var(--bg-surface-light)] rounded-[32px] max-w-lg w-full p-6 relative shadow-2xl text-white"
            >
              {!quizFinished ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-3 py-1 rounded-full">
                      {selectedUnit.title.split(':')[0]} · Soru {currentQuizIndex + 1} / {unitQuizzes.length}
                    </span>
                    <button onClick={() => setShowQuizModal(false)} className="text-gray-400 hover:text-white text-sm font-bold">Kapat</button>
                  </div>

                  <h3 className="text-lg font-bold mb-5 leading-snug">
                    {unitQuizzes[currentQuizIndex]?.q}
                  </h3>

                  <div className="space-y-2.5 mb-5">
                    {unitQuizzes[currentQuizIndex]?.choices.map((choice, i) => {
                      const isSelected = selectedAnswer === i;
                      const isCorrect = i === unitQuizzes[currentQuizIndex].correct;

                      let btnStyle = "border-white/10 bg-[#132A1D]/80 hover:bg-[var(--bg-surface-light)]";
                      if (selectedAnswer !== null) {
                        if (isCorrect) btnStyle = "border-green-500 bg-green-900/30 text-green-300 font-bold";
                        else if (isSelected) btnStyle = "border-red-500 bg-red-900/30 text-red-300";
                      }

                      return (
                        <button
                          key={i}
                          disabled={selectedAnswer !== null}
                          onClick={() => handleAnswerSelect(i)}
                          className={`w-full p-3.5 rounded-2xl text-start text-xs font-semibold border transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{choice}</span>
                          {selectedAnswer !== null && isCorrect && <CheckCircle2 size={16} className="text-green-400 shrink-0" />}
                          {selectedAnswer !== null && isSelected && !isCorrect && <XCircle size={16} className="text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation box */}
                  {selectedAnswer !== null && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-white/10 text-xs text-gray-300 mb-5">
                      <span className="font-bold text-[#10b981] block mb-1">Açıklama:</span>
                      {unitQuizzes[currentQuizIndex]?.explain}
                    </motion.div>
                  )}

                  {selectedAnswer !== null && (
                    <button
                      onClick={handleNextQuizQuestion}
                      className="w-full py-3 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs shadow-lg transition-all"
                    >
                      {currentQuizIndex < unitQuizzes.length - 1 ? 'Sonraki Soru →' : 'Sonucu Gör'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b] text-[#f59e0b] flex items-center justify-center text-3xl mx-auto mb-4">
                    🏆
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Test Tamamlandı!</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {unitQuizzes.length} sorudan <span className="text-[#10b981] font-bold">{quizScore} doğru</span> cevap verdiniz.
                  </p>

                  {quizScore >= 3 ? (
                    <div className="p-4 rounded-2xl bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-xs font-bold mb-6">
                      Tebrikler! +50 XP kazandınız 🌟
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-6">
                      Biraz daha oku ve tekrar dene!
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleStartQuiz}
                      className="flex-1 py-3 rounded-2xl border border-white/20 text-xs font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-1"
                    >
                      <RefreshCw size={14} /> Tekrar Dene
                    </button>
                    <button
                      onClick={() => setShowQuizModal(false)}
                      className="flex-1 py-3 rounded-2xl bg-[#10b981] text-white text-xs font-bold hover:bg-[#059669] transition-all"
                    >
                      Devam Et
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
