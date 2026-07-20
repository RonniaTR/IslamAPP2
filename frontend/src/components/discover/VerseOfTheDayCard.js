import React from 'react';
import { BookOpen, Play, Share2, Quote } from 'lucide-react';

export function VerseOfTheDayCard({ verse }) {
  return (
    <div className="relative bg-gradient-to-br from-[#0F3523] to-[#0A1A12] rounded-[32px] p-6 overflow-hidden shadow-2xl border border-[#1A3826] font-sans">
      
      {/* Background Graphic (Mocking the Quran image) */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-30 mix-blend-luminosity pointer-events-none">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1609599006353-e629aaab31f5?q=80&w=600&auto=format&fit=crop')] bg-cover bg-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3523] to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-[#f59e0b]/10 text-[#f59e0b] px-3 py-1.5 rounded-full border border-[#f59e0b]/20">
            <Quote size={14} fill="currentColor" />
            <span className="text-xs font-bold">Günün Ayeti</span>
          </div>
          <span className="text-gray-400 text-xs font-medium tracking-wider">Bakara Suresi - 286</span>
        </div>

        {/* Content */}
        <div className="text-center py-4 mb-6">
          <div className="text-4xl md:text-5xl text-[#CDA434] font-arabic leading-relaxed mb-4" dir="rtl" style={{ textShadow: '0 4px 12px rgba(205,164,52,0.2)' }}>
            لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ
          </div>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed px-4">
            "Allah, hiç kimseye gücünün yettiğinden fazlasını yüklemez."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between md:justify-center md:gap-4 items-center pt-2">
          <button className="flex-1 max-w-[140px] bg-transparent border border-[#10b981]/40 hover:bg-[#10b981]/10 transition-colors rounded-full py-2.5 px-2 flex items-center justify-center gap-2">
            <BookOpen size={16} className="text-[#10b981]" />
            <span className="text-white text-xs font-medium">Ayetin Meali</span>
          </button>
          <button className="flex-1 max-w-[140px] bg-transparent border border-[#10b981]/40 hover:bg-[#10b981]/10 transition-colors rounded-full py-2.5 px-2 flex items-center justify-center gap-2">
            <Play size={16} className="text-[#10b981]" />
            <span className="text-white text-xs font-medium">Dinle</span>
          </button>
          <button className="flex-1 max-w-[140px] bg-transparent border border-[#10b981]/40 hover:bg-[#10b981]/10 transition-colors rounded-full py-2.5 px-2 flex items-center justify-center gap-2">
            <Share2 size={16} className="text-[#10b981]" />
            <span className="text-white text-xs font-medium">Paylaş</span>
          </button>
        </div>
      </div>
    </div>
  );
}
