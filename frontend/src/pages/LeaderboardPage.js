import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Sparkles, ArrowLeft, Target, Loader2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Aktif kullanıcıyı bulma
  const currentUserId = user?.user_id || user?.id || localStorage.getItem('islamapp_guest_id');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Önce yeni endpoint'i dene, olmazsa eskisine düş
        const res = await api.get('/gamification/leaderboard?limit=20').catch(() => api.get('/quiz/leaderboard'));
        setList(res.data || []);
      } catch (e) {
        console.error("Liderlik tablosu çekilemedi:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#032212] flex flex-col items-center justify-center text-[#ffd369]">
        <Loader2 size={48} className="animate-spin mb-4" />
        <h2 className="text-xl font-black tracking-widest animate-pulse">LİG YÜKLENİYOR...</h2>
      </div>
    );
  }

  const top3 = list.slice(0, 3);
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ ...top3[1], podiumRank: 2 });
  if (top3[0]) podiumOrder.push({ ...top3[0], podiumRank: 1 });
  if (top3[2]) podiumOrder.push({ ...top3[2], podiumRank: 3 });

  const restOfList = list.slice(3, 20);

  return (
    <div className="min-h-screen bg-[#032212] font-sans pb-24 relative overflow-hidden">
      {/* Devasa Arka Plan Işıltısı */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#ffd369]/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Üst Bar */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="bg-white/5 p-3 rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#ffd369] tracking-widest uppercase flex items-center gap-2 justify-center">
            <Trophy size={24} /> Şeref Tablosu
          </h1>
          <p className="text-xs text-[#A8B5A0] font-bold tracking-widest mt-1">GLOBAL İLİM LİGİ</p>
        </div>
        <div className="w-12" /> {/* Dengeleyici */}
      </div>

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        
        {/* BOŞ DURUM */}
        {list.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl mt-10">
            <Sparkles size={64} className="mx-auto text-[#ffd369]/30 mb-6" />
            <h2 className="text-2xl font-black text-[#f7e6ae] mb-2">Lig Henüz Boş</h2>
            <p className="text-[#A8B5A0]">İlk quizi çöz ve zirveye adını altın harflerle yazdır!</p>
            <button onClick={() => navigate('/quiz')} className="mt-8 bg-[#ffd369] text-[#032212] px-8 py-4 rounded-2xl font-black shadow-lg">Hemen Başla</button>
          </div>
        ) : (
          <>
            {/* ─── PODYUM (İLK 3) ─── */}
            <div className="flex justify-center items-end gap-3 md:gap-6 h-64 mt-10 mb-10">
              {podiumOrder.map((entry, index) => {
                const isMe = entry.user_id === currentUserId;
                const isFirst = entry.podiumRank === 1;
                const isSecond = entry.podiumRank === 2;
                
                const height = isFirst ? 'h-48' : isSecond ? 'h-36' : 'h-28';
                const colors = isFirst ? 'from-[#ffd369] to-[#d4af37] border-[#ffd369]' : isSecond ? 'from-gray-300 to-gray-500 border-gray-300' : 'from-orange-400 to-orange-700 border-orange-400';
                const shadow = isFirst ? 'shadow-[0_0_50px_rgba(255,211,105,0.4)]' : '';

                return (
                  <motion.div key={entry.user_id} initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2, type: "spring", bounce: 0.5 }} className="flex flex-col items-center relative w-28 md:w-32">
                    {isFirst ? <Crown size={40} className="text-[#ffd369] mb-3 drop-shadow-[0_0_15px_rgba(255,211,105,0.8)] animate-bounce" /> : <Medal size={28} className={`mb-3 ${isSecond ? 'text-gray-300' : 'text-orange-400'}`} />}
                    
                    <div className="text-center w-full absolute -top-14">
                      <p className={`text-sm font-black truncate px-1 ${isMe ? 'text-white' : 'text-[#f7e6ae]'}`}>{entry.username || 'Anonim'}</p>
                      <p className="text-xs font-bold text-[#A8B5A0] bg-[#032212]/80 rounded-full px-2 py-0.5 inline-block mt-1 border border-white/10">{entry.total_points} XP</p>
                    </div>

                    <div className={`w-full ${height} bg-gradient-to-t ${colors} rounded-t-3xl border-t-4 border-l border-r opacity-95 relative flex justify-center pt-4 ${shadow}`}>
                      <span className="text-4xl font-black text-[#032212]/80">{entry.podiumRank}</span>
                      {isMe && <div className="absolute -bottom-3 bg-white text-[#032212] text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-xl">Sen</div>}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ─── LİG SIRALAMASI (4. VE SONRASI) ─── */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-4 md:p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 px-2">
                <TrendingUp size={24} className="text-[#ffd369]" />
                <h3 className="text-lg font-black text-[#f7e6ae] uppercase tracking-widest">Genel Sıralama</h3>
              </div>

              <div className="space-y-3">
                {restOfList.map((entry, i) => {
                  const actualRank = i + 4;
                  const isMe = entry.user_id === currentUserId;

                  return (
                    <motion.div key={entry.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i * 0.05) }}
                      className={`flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${isMe ? 'bg-gradient-to-r from-[#ffd369]/20 to-transparent border border-[#ffd369]/50 shadow-[0_0_20px_rgba(255,211,105,0.15)] scale-[1.02]' : 'bg-[#032212]/50 border border-white/5 hover:bg-white/5'}`}
                    >
                      <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg ${isMe ? 'bg-[#ffd369] text-[#032212]' : 'bg-white/5 text-[#A8B5A0] border border-white/10'}`}>
                        {actualRank}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-bold truncate ${isMe ? 'text-[#ffd369]' : 'text-[#f7e6ae]'}`}>
                          {entry.username || 'Anonim'} 
                        </p>
                      </div>

                      <div className="text-right shrink-0 bg-black/30 px-4 py-2 rounded-2xl border border-white/5">
                        <p className={`text-lg font-black ${isMe ? 'text-white' : 'text-[#ffd369]'}`}>{entry.total_points}</p>
                        <p className="text-[10px] text-[#A8B5A0] font-bold uppercase tracking-widest">XP</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}