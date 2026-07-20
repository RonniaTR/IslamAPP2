import React from 'react';
import { Play, Headphones, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ContinueLearningRow({ items = [] }) {
  const navigate = useNavigate();
  
  if (!items || items.length === 0) return null;

  return (
    <div className="pl-4 pb-2 flex gap-3 overflow-x-auto no-scrollbar snap-x font-sans">
      {items.map((item, idx) => {
        const Icon = item.type === 'audio' ? Headphones : (item.type === 'video' ? Video : Play);
        
        return (
          <div 
            key={item.id || idx} 
            onClick={() => navigate(`/content/${item.type}/${item.slug || item.id}`)}
            className="min-w-[260px] h-[88px] bg-gradient-to-r from-[#132A1D]/80 to-[#0A1A12]/80 backdrop-blur-md border border-[#1A3826] rounded-2xl p-3 flex items-center justify-between cursor-pointer snap-start shrink-0 shadow-lg"
          >
            {/* Text Content */}
            <div className="flex flex-col justify-center max-w-[130px] z-10">
              <span className="text-[11px] font-bold text-[#10b981] mb-1 tracking-wide uppercase">
                {item.typeLabel || 'Devam Et'}
              </span>
              <span className="text-sm font-bold text-white truncate w-full">
                {item.title}
              </span>
              <span className="text-xs text-gray-400 truncate w-full mt-0.5">
                {item.subtitle}
              </span>
            </div>
            
            {/* Media / Icon Side */}
            <div className="relative flex items-center justify-end h-full">
              {item.image ? (
                <>
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative shadow-md">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/40"></div>
                  </div>
                  {/* Floating Play Button */}
                  <div className="absolute -left-3 w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#f59e0b]/30 border-2 border-[#132A1D] z-20">
                    <Icon size={14} className="text-[#052A1E] ml-0.5" />
                  </div>
                </>
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#1A3826] border border-[#2D8A4E] flex items-center justify-center shadow-inner">
                  <Icon size={24} className="text-[#10b981]" />
                </div>
              )}
            </div>
          </div>
        );
      })}
      {/* Spacer for right padding */}
      <div className="min-w-[1px] shrink-0" />
    </div>
  );
}
