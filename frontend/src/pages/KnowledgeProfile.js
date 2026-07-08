import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MessageCircle, Target, Heart, Clock, MessageSquare, Flame, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const CATEGORY_ICONS = {
  quran: <BookOpen size={18} />,
  hadith: <MessageCircle size={18} />,
  quiz: <Target size={18} />,
  dhikr: <Heart size={18} />,
  pomodoro: <Clock size={18} />,
  chat: <MessageSquare size={18} />,
};

export default function KnowledgeProfile() {
  const { user } = useAuth();
  const uid = user?.user_id || user?.id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    api.get(`/knowledge/profile/${uid}`)
      .then(r => setProfile(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [uid]);

  const stats = profile?.categories || [];

  return (
    <div className="min-h-screen bg-[#032212] text-[#f7e6ae] p-6 pt-10 font-sans pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
        <h1 className="text-2xl font-extrabold mb-6 text-[#ffd369]">Bilgi Profilim</h1>

        {/* Üst İstatistikler */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a3a2a]/40 p-4 rounded-2xl border border-[#ffd369]/20 flex flex-col items-center justify-center">
            <Star size={24} className="text-[#ffd369] mb-2" />
            <div className="text-xl font-bold text-[#f7e6ae]">{loading ? '—' : (profile?.total_xp ?? 0)}</div>
            <div className="text-[10px] opacity-70 mt-1">Toplam XP</div>
          </div>
          <div className="bg-[#1a3a2a]/40 p-4 rounded-2xl border border-[#ffd369]/20 flex flex-col items-center justify-center">
            <Flame size={24} className="text-[#ffd369] mb-2" />
            <div className="text-xl font-bold text-[#f7e6ae]">{loading ? '—' : (profile?.current_streak ?? 0)}</div>
            <div className="text-[10px] opacity-70 mt-1">Gün Serisi</div>
          </div>
          <div className="bg-[#1a3a2a]/40 p-4 rounded-2xl border border-[#ffd369]/20 flex flex-col items-center justify-center">
            <CheckCircle size={24} className="text-[#ffd369] mb-2" />
            <div className="text-xl font-bold text-[#f7e6ae]">{loading ? '—' : (profile?.completed_quests ?? 0)}</div>
            <div className="text-[10px] opacity-70 mt-1">Bugünkü Görev</div>
          </div>
        </div>

        {/* Kategori Dökümü */}
        <div className="bg-[#1a3a2a]/30 p-6 rounded-[30px] border border-[#ffd369]/20 shadow-lg">
          <h2 className="text-xl font-extrabold mb-2 text-[#f7e6ae]">Öğrenme Dökümü</h2>
          <p className="text-[11px] opacity-60 mb-6">Gerçek aktivitene göre hesaplanır</p>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-[#ffd369] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {stats.map((stat, idx) => (
                <div key={stat.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 w-[110px]">
                    <div className="text-[#ffd369] bg-[#ffd369]/10 p-2 rounded-lg">{CATEGORY_ICONS[stat.key] || <BookOpen size={18} />}</div>
                    <span className="font-semibold text-sm">{stat.name}</span>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="h-2 bg-[#032212] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.score}%` }}
                        transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                        className="h-full bg-[#ffd369] rounded-full"
                      />
                    </div>
                  </div>
                  <div className="w-14 text-right font-black text-[#ffd369] text-sm">{stat.count}×</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
