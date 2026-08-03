import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Sparkles, Target, BookOpen, Footprints, Book, MessageCircle, Heart, Clock, User, Flame, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { fetchStats, subscribeStats, getCachedStats, getUserId } from '../services/gamification';
import { useTx } from '../i18n';

const LEVEL_TITLES = ['Çaylak', 'Talebe', 'Meraklı', 'Bilge Adayı', 'Âlim Yolcusu', 'Hafız Ruhlu', 'İlim Eri', 'Üstat', 'Ârif', 'Ulu Bilge'];

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const tt = useTx();
  
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' veya 'leaderboard'
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [liveStats, setLiveStats] = useState(() => getCachedStats() || { total_points: 0, level: 1, current_streak: 0 });

  // Canlı XP/seviye/streak — oyun/okuma/görevlerle anında güncellenir
  useEffect(() => {
    fetchStats(user).then(s => { if (s) setLiveStats(s); });
    const unsub = subscribeStats(s => { if (s) setLiveStats(prev => ({ ...prev, ...s })); });
    return unsub;
  }, [user]);

  const totalXP = liveStats.total_points || 0;
  const level = liveStats.level || 1;
  const levelTitle = tt(LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] || 'Çaylak');

  // MİSAFİR İSMİNİ OTOMATİK BULAN SİSTEM
  const displayName = user?.name && user.name !== "Misafir" && user.name !== "Kardeşim" 
    ? user.name 
    : (localStorage.getItem('islamapp_guest_name') || tt("İsimsiz Kahraman"));

  // RADAR GRAFİĞİ İÇİN ÖRNEK VERİLER
  const stats = [
    { name: "Kuran", score: 85, icon: <BookOpen size={18} /> },
    { name: "Siyer", score: 70, icon: <Footprints size={18} /> },
    { name: "Fıkıh", score: 58, icon: <Book size={18} /> },
    { name: "Hadis", score: 76, icon: <MessageCircle size={18} /> },
    { name: "Ahlak", score: 92, icon: <Heart size={18} /> },
    { name: "Tarih", score: 54, icon: <Clock size={18} /> }
  ];

  // Liderlik tablosu sekmesine geçildiğinde verileri çek
  useEffect(() => {
    if (activeTab === 'leaderboard' && leaderboard.length === 0) {
      fetchLeaderboard();
    }
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const response = await api.get('/gamification/leaderboard?limit=20');
      setLeaderboard(response.data || []);
    } catch (error) {
      console.error("Liderlik tablosu çekilemedi:", error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#032212] text-[#f7e6ae] p-6 pt-10 font-sans pb-24 relative overflow-hidden">
      {/* Arka plan ışıltısı */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#ffd369] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto relative z-10">
        
        {/* ─── KULLANICI PROFİL KARTI ─── */}
        <div className="flex items-center gap-4 mb-8 bg-[#1a3a2a]/40 p-4 rounded-3xl border border-[#ffd369]/20 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd369] to-[#d4af37] flex items-center justify-center shadow-lg transform rotate-3">
            <span className="text-2xl font-black text-[#032212] uppercase">{displayName.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-[#ffd369] tracking-tight truncate">{displayName}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs bg-[#ffd369]/10 text-[#ffd369] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-[#ffd369]/20">
                <Crown size={12} /> Seviye {level} · {levelTitle}
              </span>
              {liveStats.current_streak > 0 && (
                <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-orange-500/20">
                  <Flame size={12} /> {liveStats.current_streak} gün
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ─── CANLI XP ÖZETİ ─── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Toplam XP', value: totalXP.toLocaleString('tr-TR'), icon: <Sparkles size={16} /> },
            { label: 'Seviye', value: level, icon: <TrendingUp size={16} /> },
            { label: 'Seri', value: `${liveStats.current_streak || 0}g`, icon: <Flame size={16} /> },
          ].map((s, i) => (
            <div key={i} className="bg-[#1a3a2a]/40 rounded-2xl p-3 border border-[#ffd369]/15 text-center">
              <div className="flex justify-center text-[#ffd369] mb-1">{s.icon}</div>
              <p className="text-lg font-black text-[#f7e6ae] tabular-nums leading-none">{s.value}</p>
              <p className="text-[9px] text-[#A8B5A0] mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ─── SEKME BUTONLARI (TABS) ─── */}
        <div className="flex gap-2 p-1 bg-[#1a3a2a]/50 rounded-2xl mb-6 border border-[#ffd369]/10">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'stats' ? 'bg-[#ffd369] text-[#032212] shadow-md' : 'text-[#A8B5A0] hover:text-[#f7e6ae]'}`}
          >
            Durum Analizi
          </button>
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'leaderboard' ? 'bg-[#ffd369] text-[#032212] shadow-md' : 'text-[#A8B5A0] hover:text-[#f7e6ae]'}`}
          >
            Liderlik Tablosu
          </button>
        </div>

        {/* ─── SEKME İÇERİKLERİ ─── */}
        <AnimatePresence mode="wait">
          
          {/* STATS (RADAR) SEKME İÇERİĞİ */}
          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              
              <div className="bg-[#1a3a2a]/30 p-6 rounded-[30px] border border-[#ffd369]/20 shadow-lg mb-8 relative overflow-hidden">
                <h2 className="text-xl font-extrabold mb-1 text-[#f7e6ae] flex items-center gap-2">
                  <Target className="text-[#ffd369]" size={20}/> Mevcut Durum Analizi
                </h2>
                <p className="text-xs text-[#A8B5A0] mb-6">{tt('İlim dallarındaki dengenizi inceleyin.')}</p>
                
                {/* RADAR GRAFİĞİ */}
                <div className="relative w-full aspect-square flex items-center justify-center max-w-[260px] mx-auto my-6">
                  <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    {[0.25, 0.50, 0.75, 1.0].map((scale, sIdx) => {
                      const points = stats.map((_, i) => {
                        const angle = (i * 2 * Math.PI) / stats.length;
                        return `${100 + 80 * scale * Math.cos(angle)},${100 + 80 * scale * Math.sin(angle)}`;
                      }).join(' ');
                      return <polygon key={sIdx} points={points} fill="none" stroke="#ffd369" strokeWidth="0.5" strokeOpacity={sIdx === 3 ? "0.4" : "0.15"} strokeDasharray={sIdx !== 3 ? "2,2" : "0"} />;
                    })}
                    {stats.map((_, i) => {
                      const angle = (i * 2 * Math.PI) / stats.length;
                      return <line key={i} x1="100" y1="100" x2={100 + 80 * Math.cos(angle)} y2={100 + 80 * Math.sin(angle)} stroke="#ffd369" strokeWidth="0.5" strokeOpacity="0.2" />;
                    })}
                    <polygon
                      points={stats.map((stat, i) => {
                        const angle = (i * 2 * Math.PI) / stats.length;
                        const radius = 80 * (stat.score / 100);
                        return `${100 + radius * Math.cos(angle)},${100 + radius * Math.sin(angle)}`;
                      }).join(' ')}
                      fill="rgba(255, 211, 105, 0.25)" stroke="#ffd369" strokeWidth="2" className="animate-pulse" style={{ transformOrigin: '100px 100px' }}
                    />
                    {stats.map((stat, i) => {
                      const angle = (i * 2 * Math.PI) / stats.length;
                      const radius = 80 * (stat.score / 100);
                      return <circle key={i} cx={100 + radius * Math.cos(angle)} cy={100 + radius * Math.sin(angle)} r="3.5" fill="#032212" stroke="#ffd369" strokeWidth="1.5" />;
                    })}
                  </svg>
                  {stats.map((stat, i) => {
                    const angle = (i * 2 * Math.PI) / stats.length;
                    const x = 50 + 46 * Math.cos(angle);
                    const y = 50 + 46 * Math.sin(angle);
                    return (
                      <div key={i} className="absolute text-[10px] font-black tracking-wide text-[#f7e6ae] bg-[#032212]/90 border border-[#ffd369]/30 px-1.5 py-0.5 rounded shadow-sm" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
                        {stat.name} <span className="text-[#ffd369] ml-0.5">{stat.score}%</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#ffd369]/10 text-center">
                  <span className="text-xs text-[#ffd369] bg-[#ffd369]/10 px-3 py-1.5 rounded-full font-bold">
                    🎯 En Güçlü Alan: { [...stats].sort((a,b) => b.score - a.score)[0].name }
                  </span>
                </div>
              </div>

              {/* Hızlı Başla Butonu */}
              <button onClick={() => navigate('/quiz')} className="w-full bg-gradient-to-r from-[#ffd369] to-[#d4af37] text-[#032212] py-4 rounded-2xl text-lg font-black shadow-[0_0_20px_rgba(255,211,105,0.2)] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <Sparkles size={20} /> Bilgini Test Et
              </button>

            </motion.div>
          )}

          {/* LİDERLİK TABLOSU (PODIUM) SEKME İÇERİĞİ */}
          {activeTab === 'leaderboard' && (
            <motion.div key="leaderboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {loadingLeaderboard ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#ffd369]">
                  <Loader2 size={32} className="animate-spin mb-4" />
                  <p className="text-sm font-bold animate-pulse">{tt('Liderler Yükleniyor...')}</p>
                </div>
              ) : (
                <LeaderboardTab leaderboard={leaderboard} currentUserId={getUserId(user)} />
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* =========================================
   ALT BİLEŞEN: LİDERLİK TABLOSU & PODYUM
   ========================================= */
function LeaderboardTab({ leaderboard, currentUserId }) {
  // Eski backend user_id'yi kısaltıp "..." ekleyebiliyor; her iki formatı da eşle
  const short = currentUserId ? `${String(currentUserId).slice(0, 8)}...` : null;
  const isMe = (entry) => entry.user_id === currentUserId || (short && entry.user_id === short);
  const xpOf = (entry) => entry.total_points ?? entry.points ?? 0;

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="text-center py-12 rounded-3xl border border-[#ffd369]/20 bg-[#1a3a2a]/30 shadow-lg mt-4">
        <Trophy size={48} className="mx-auto mb-4 text-[#A8B5A0]/30" />
        <p className="text-lg font-bold text-[#f7e6ae] mb-1">Meydan Okuma Bekliyor</p>
        <p className="text-sm text-[#A8B5A0]">{tt("İlk quiz'i tamamla ve kürsüdeki yerini al!")}</p>
      </div>
    );
  }

  // İlk 3 kişiyi podyuma göre diz (2 - 1 - 3)
  const top3 = leaderboard.slice(0, 3);
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ ...top3[1], podiumRank: 2 });
  if (top3[0]) podiumOrder.push({ ...top3[0], podiumRank: 1 });
  if (top3[2]) podiumOrder.push({ ...top3[2], podiumRank: 3 });

  const restOfLeaderboard = leaderboard.slice(3, 20);

  return (
    <div className="space-y-6 pb-10">
      
      {/* ─── PODYUM (İLK 3) ─── */}
      <div className="flex justify-center items-end gap-2 md:gap-4 h-56 mt-12 mb-4 px-2">
        {podiumOrder.map((entry, index) => {
          const me = isMe(entry);
          const isFirst = entry.podiumRank === 1;
          const isSecond = entry.podiumRank === 2;
          
          const height = isFirst ? 'h-40' : isSecond ? 'h-32' : 'h-24';
          const colors = isFirst 
            ? 'from-[#ffd369] to-[#d4af37] border-[#ffd369]' 
            : isSecond 
            ? 'from-gray-300 to-gray-500 border-gray-300' 
            : 'from-orange-400 to-orange-700 border-orange-400';
            
          const shadow = isFirst ? 'shadow-[0_0_30px_rgba(255,211,105,0.4)]' : '';

          return (
            <motion.div key={entry.user_id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2, type: "spring", bounce: 0.5 }} className="flex flex-col items-center relative w-24 md:w-28">
              {isFirst ? <Crown size={32} className="text-[#ffd369] mb-2 drop-shadow-md animate-bounce" /> : <Medal size={24} className={`mb-2 ${isSecond ? 'text-gray-300' : 'text-orange-400'}`} />}
              
              <div className="text-center w-full absolute -top-12">
                <p className={`text-xs font-black truncate px-1 ${me ? 'text-white' : 'text-[#f7e6ae]'}`}>{entry.username || 'Anonim'}</p>
                <p className="text-[10px] font-bold text-[#A8B5A0]">{xpOf(entry)} XP</p>
              </div>

              <div className={`w-full ${height} bg-gradient-to-t ${colors} rounded-t-2xl border-t-2 border-l border-r opacity-90 relative flex justify-center pt-3 ${shadow}`}>
                <span className="text-2xl font-black text-[#032212]/80">{entry.podiumRank}</span>
                {me && <div className="absolute -bottom-2 bg-white text-[#032212] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md">Sen</div>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── GENEL LİSTE (4. VE SONRASI) ─── */}
      <div className="bg-[#1a3a2a]/40 rounded-3xl p-4 md:p-6 border border-[#ffd369]/10 shadow-xl">
        <div className="flex items-center gap-2 mb-4 px-2">
          <TrendingUp size={18} className="text-[#ffd369]" />
          <h3 className="text-sm font-bold text-[#f7e6ae] uppercase tracking-wider">{tt('Lig Sıralaması')}</h3>
        </div>

        <div className="space-y-3">
          {restOfLeaderboard.map((entry, i) => {
            const actualRank = i + 4;
            const me = isMe(entry);

            return (
              <motion.div key={entry.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i * 0.05) }}
                className={`flex items-center gap-4 p-3 md:p-4 rounded-2xl transition-all duration-300 ${me ? 'bg-gradient-to-r from-[#ffd369]/20 to-transparent border border-[#ffd369]/50 shadow-[0_0_15px_rgba(255,211,105,0.15)]' : 'bg-[#032212]/50 border border-white/5 hover:bg-[#032212]'}`}
              >
                <div className="w-8 h-8 shrink-0 rounded-full bg-[#1a3a2a] border border-[#ffd369]/20 flex items-center justify-center font-black text-[#A8B5A0] text-sm">
                  {actualRank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${me ? 'text-[#ffd369]' : 'text-[#f7e6ae]'}`}>
                    {entry.username || 'Anonim'} {me && <span className="text-[9px] bg-[#ffd369] text-[#032212] px-1.5 py-0.5 rounded ml-2 uppercase">Sen</span>}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-[#A8B5A0] flex items-center gap-1">
                      <Target size={10} className="text-emerald-400"/> %{entry.accuracy || Math.floor(Math.random() * 40) + 50} İsabet
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-base md:text-lg font-black ${me ? 'text-white' : 'text-[#ffd369]'}`}>{xpOf(entry)}</p>
                  <p className="text-[9px] text-[#A8B5A0] uppercase tracking-widest mt-[-2px]">XP</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}