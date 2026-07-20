import React from 'react';
import { ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AudioContentsRow({ items = [], title = "Sesli İçerikler", viewAll = true }) {
  const navigate = useNavigate();

  // Mock items exactly matching the UI if no items are passed
  const displayItems = items.length > 0 ? items : [
    { id: 1, title: 'Sabah Duaları', duration: '12:45', color: 'bg-[#153B2D]' },
    { id: 2, title: 'Yasin Suresi', duration: '22:18', color: 'bg-[#31224A]' },
    { id: 3, title: 'Mülk Suresi', duration: '10:32', color: 'bg-[#564219]' },
    { id: 4, title: 'Rahman Suresi', duration: '12:10', color: 'bg-[#1B3A42]' },
    { id: 5, title: 'Kehf Suresi', duration: '45:30', color: 'bg-[#1A4526]' },
  ];

  // Dummy waveform lines generator
  const renderWaveform = () => {
    const bars = [];
    for (let i = 0; i < 15; i++) {
      const height = Math.random() * 20 + 8; // Random height between 8px and 28px
      bars.push(
        <div 
          key={i} 
          className="w-1 bg-white/20 rounded-full" 
          style={{ height: `${height}px` }}
        />
      );
    }
    return <div className="flex items-center gap-[2px]">{bars}</div>;
  };

  return (
    <div className="flex flex-col font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-4 mb-4">
        <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
        {viewAll && (
          <button className="text-xs text-[#10b981] font-medium flex items-center gap-1 hover:text-[#059669] transition-colors">
            Tümünü Dinle <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Cards Scroll */}
      <div className="pl-4 pb-4 flex gap-3 overflow-x-auto no-scrollbar snap-x">
        {displayItems.map((item, idx) => (
          <div 
            key={item.id || idx}
            onClick={() => navigate(`/content/audio/${item.id}`)}
            className={`relative min-w-[140px] w-[140px] h-[140px] rounded-[24px] overflow-hidden snap-start shrink-0 cursor-pointer group shadow-lg ${item.color || 'bg-[#153B2D]'}`}
          >
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content Container */}
            <div className="p-4 flex flex-col h-full justify-between">
              {/* Top Text */}
              <div>
                <h3 className="text-white text-[13px] font-bold leading-tight">{item.title}</h3>
                <p className="text-white/60 text-[11px] mt-1 font-mono">{item.duration}</p>
              </div>

              {/* Bottom Row: Play Button & Waveform */}
              <div className="flex items-end justify-between w-full">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#10b981] transition-colors shadow-sm">
                  <Play size={14} className="text-white ml-0.5" />
                </div>
                {/* Waveform */}
                <div className="mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  {renderWaveform()}
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Spacer */}
        <div className="min-w-[1px] shrink-0" />
      </div>
    </div>
  );
}
