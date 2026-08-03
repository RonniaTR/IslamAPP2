import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Footprints, Book, MessageCircle, Heart, Clock, User, Flame, Star, CheckCircle } from 'lucide-react';
import { useTx } from '../i18n';

export default function KnowledgeProfile() {
  const tt = useTx();
  const stats = [
    { name: "Kuran", score: 85, icon: <BookOpen size={18} /> },
    { name: "Siyer", score: 70, icon: <Footprints size={18} /> },
    { name: "Fıkıh", score: 58, icon: <Book size={18} /> },
    { name: "Hadis", score: 76, icon: <MessageCircle size={18} /> },
    { name: "Ahlak", score: 92, icon: <Heart size={18} /> },
    { name: "Tarih", score: 54, icon: <Clock size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-[#032212] text-[#f7e6ae] p-6 pt-10 font-sans pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
        
        {/* Üst İstatistikler */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a3a2a]/40 p-4 rounded-2xl border border-[#ffd369]/20 flex flex-col items-center justify-center">
            <Star size={24} className="text-[#ffd369] mb-2" />
            <div className="text-xl font-bold text-[#f7e6ae]">1320</div>
            <div className="text-[10px] opacity-70 mt-1">Toplam XP</div>
          </div>
          <div className="bg-[#1a3a2a]/40 p-4 rounded-2xl border border-[#ffd369]/20 flex flex-col items-center justify-center">
            <Flame size={24} className="text-[#ffd369] mb-2" />
            <div className="text-xl font-bold text-[#f7e6ae]">6</div>
            <div className="text-[10px] opacity-70 mt-1">{tt('Gün Serisi')}</div>
          </div>
          <div className="bg-[#1a3a2a]/40 p-4 rounded-2xl border border-[#ffd369]/20 flex flex-col items-center justify-center">
            <CheckCircle size={24} className="text-[#ffd369] mb-2" />
            <div className="text-xl font-bold text-[#f7e6ae]">5</div>
            <div className="text-[10px] opacity-70 mt-1">Tamamlanan</div>
          </div>
        </div>

        {/* Kategori Dökümü */}
        <div className="bg-[#1a3a2a]/30 p-6 rounded-[30px] border border-[#ffd369]/20 shadow-lg">
          <h2 className="text-xl font-extrabold mb-8 text-[#f7e6ae]">{tt('Kategori Dökümü')}</h2>
          <div className="flex flex-col gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3 w-[100px]">
                  <div className="text-[#ffd369] bg-[#ffd369]/10 p-2 rounded-lg">{stat.icon}</div>
                  <span className="font-semibold text-sm">{stat.name}</span>
                </div>
                <div className="flex-1 px-4">
                  <div className="h-2 bg-[#032212] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.score}%` }}
                      transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                      className="h-full bg-[#ffd369] rounded-full"
                    />
                  </div>
                </div>
                <div className="w-12 text-right font-black text-[#ffd369]">{stat.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}