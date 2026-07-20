import React from 'react';
import { Search, Mic, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function DiscoverHeader({ streak = 12, level = 12 }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="px-4 pt-6 pb-2 relative z-10 font-sans">
      
      {/* Top Row: Welcome + Stats */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-gray-300 text-sm mb-1">Esselamu Aleyküm</div>
          <div className="text-white text-3xl font-bold flex items-center gap-2 mb-1">
            {user?.name?.split(' ')[0] || 'Samet'} <span>👋</span>
          </div>
          <div className="text-[#f59e0b] text-sm">
            Bugün ne <span className="font-bold">öğrenmek</span> istersin?
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Streak Badge */}
          <div className="bg-[#132A1D]/80 backdrop-blur-md rounded-2xl px-3 py-1.5 border border-[#1A3826] flex items-center gap-2 shadow-lg shadow-black/20">
            <span className="text-orange-500 text-xl">🔥</span>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-none">{streak}</span>
              <span className="text-gray-400 text-[10px]">Günlük Seri</span>
            </div>
          </div>
          
          {/* Avatar & Level Badge */}
          <div className="relative flex flex-col items-center cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#10b981] to-[#f59e0b] p-0.5">
              <img 
                src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Samet&backgroundColor=2D8A4E"} 
                alt="Profile" 
                className="w-full h-full rounded-full border-2 border-[#052A1E] object-cover bg-[#2D8A4E]"
              />
            </div>
            <div className="absolute -bottom-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#052A1E] whitespace-nowrap shadow-md">
              Seviye {level}
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Bar & AI Button Row */}
      <div className="flex gap-3">
        <div className="flex-1 bg-[#132A1D]/80 backdrop-blur-md border border-[#1A3826] rounded-full flex items-center px-4 h-12 shadow-lg shadow-black/20">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Sure, dua, hadis veya makale ara..." 
            className="flex-1 bg-transparent border-none text-white outline-none text-sm placeholder-gray-500"
          />
          <Mic size={18} className="text-gray-400 ml-2 cursor-pointer hover:text-white transition-colors" />
        </div>
        
        <button 
          onClick={() => navigate('/chat')}
          className="bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/30 rounded-full flex items-center justify-center px-4 h-12 transition-all duration-300 gap-2 shadow-lg shadow-[#10b981]/5 text-[#10b981]"
        >
          <Sparkles size={18} className="text-[#10b981]" />
          <span className="font-bold text-sm whitespace-nowrap">AI Asistan</span>
        </button>
      </div>
      
    </div>
  );
}
