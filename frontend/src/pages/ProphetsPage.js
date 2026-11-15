import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Sparkles, BookOpen, Heart, Shield, Star, X, ChevronRight } from 'lucide-react';
import { PROPHETS } from '../data/prophets';

export default function ProphetsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProphet, setSelectedProphet] = useState(null);

  const filteredProphets = PROPHETS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-28 bg-[var(--bg-primary)] text-white relative font-sans overflow-x-hidden">
      
      {/* Background Gradient & Pattern */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-[#0F3523] via-[#0D291C] to-[#0A1A12] z-0 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[450px] opacity-5 pointer-events-none z-[1]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-6">

        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/discover')}
            className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Keşfet'e Dön</span>
          </button>
          <div className="flex items-center gap-1.5 bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-full border border-[#10b981]/20 text-xs font-bold">
            <Sparkles size={14} />
            <span>Kur'an'da Geçen 25 Peygamber</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            Peygamberler Tarihi 🌟
          </h1>
          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
            Kur'an-ı Kerim'de isimleri ve kıssaları zikredilen peygamberlerin hayatları, mucizeleri ve insanlığa bıraktıkları ibretler.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 bg-[#132A1D]/90 border border-[color:var(--bg-surface-light)] rounded-full flex items-center px-4 h-12 shadow-xl backdrop-blur-md">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Peygamber ismi veya mucize ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white outline-none text-sm placeholder-gray-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 text-xs font-bold hover:text-white">
              Temizle
            </button>
          )}
        </div>

        {/* Prophets Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProphets.map((prophet, idx) => (
            <motion.div
              key={prophet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setSelectedProphet(prophet)}
              className="bg-gradient-to-b from-[#132A1D]/90 to-[#0A1A12]/90 border border-[color:var(--bg-surface-light)] hover:border-[#10b981]/50 rounded-[28px] p-5 cursor-pointer group transition-all duration-300 hover:scale-[1.02] shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform" />

              <div>
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-900/60 to-teal-800/40 border border-emerald-500/20 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {prophet.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2.5 py-1 rounded-full">
                    {prophet.period}
                  </span>
                </div>

                {/* Name & Title */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#10b981] transition-colors">
                  {prophet.name}
                </h3>
                <p className="text-xs font-semibold text-[#10b981] mb-3">
                  {prophet.title}
                </p>

                {/* Summary */}
                <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 mb-4">
                  {prophet.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span className="truncate pr-2">Ayet: {prophet.quranVerses}</span>
                <span className="text-[#10b981] font-bold flex items-center group-hover:translate-x-1 transition-transform">
                  Detay <ChevronRight size={14} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Prophet Detail Modal */}
      <AnimatePresence>
        {selectedProphet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gradient-to-br from-[#0F3523] to-[#0A1A12] border border-[color:var(--bg-surface-light)] rounded-[32px] max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl text-white"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProphet(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Content */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#10b981]/20 border border-[#10b981]/30 flex items-center justify-center text-4xl shadow-inner shrink-0">
                  {selectedProphet.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-0.5">{selectedProphet.name}</h2>
                  <p className="text-sm font-bold text-[#f59e0b]">{selectedProphet.title}</p>
                  <span className="text-[11px] text-gray-400 font-semibold">{selectedProphet.period}</span>
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-[#132A1D]/80 border border-[color:var(--bg-surface-light)] rounded-2xl p-4 mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#10b981] mb-2 flex items-center gap-1.5">
                  <BookOpen size={14} /> Hayatı ve Daveti
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed">{selectedProphet.summary}</p>
              </div>

              {/* Miracles Section */}
              <div className="bg-[#132A1D]/80 border border-[color:var(--bg-surface-light)] rounded-2xl p-4 mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f59e0b] mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} /> Öne Çıkan Mucizeleri
                </h4>
                <ul className="space-y-1.5">
                  {selectedProphet.miracles.map((m, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-[#f59e0b] font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Lessons Section */}
              <div className="bg-[#132A1D]/80 border border-[color:var(--bg-surface-light)] rounded-2xl p-4 mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                  <Heart size={14} /> Bizlere İbretlik Dersler
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">{selectedProphet.keyLessons}</p>
              </div>

              {/* Quran Verses */}
              <div className="text-xs text-gray-400 font-medium text-center pt-2">
                Kur'an-ı Kerim Geçtiği Ayetler: <span className="text-white font-bold">{selectedProphet.quranVerses}</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
