import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function OngoingSeriesRow({ items = [], title = "Devam Eden Seriler", viewAll = true }) {
  const navigate = useNavigate();

  // Mock items exactly matching the UI if no items are passed, for visual perfection
  const displayItems = items.length > 0 ? items : [
    { id: 1, title: 'Ramazan Günlükleri', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=400&auto=format&fit=crop', progress: 60 },
    { id: 2, title: '40 Hadis', image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=400&auto=format&fit=crop', progress: 30 },
    { id: 3, title: 'İman Yolculuğu', image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=400&auto=format&fit=crop', progress: 80 },
    { id: 4, title: 'Peygamber Kıssaları', image: 'https://images.unsplash.com/photo-1542125387-c71274d94f0a?q=80&w=400&auto=format&fit=crop', progress: 45 },
    { id: 5, title: 'İslami Tarih', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=400&auto=format&fit=crop', progress: 25 },
    { id: 6, title: 'Çocuk Serileri', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=400&auto=format&fit=crop', progress: 70 },
  ];

  return (
    <div className="flex flex-col font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-4 mb-4">
        <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
        {viewAll && (
          <button className="text-xs text-[#10b981] font-medium flex items-center gap-1 hover:text-[#059669] transition-colors">
            Tümünü Gör <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Cards Scroll */}
      <div className="pl-4 pb-4 flex gap-3 overflow-x-auto no-scrollbar snap-x">
        {displayItems.map((item, idx) => (
          <div 
            key={item.id || idx}
            onClick={() => navigate(`/content/series/${item.id}`)}
            className="relative min-w-[140px] w-[140px] h-[180px] rounded-[20px] overflow-hidden snap-start shrink-0 cursor-pointer group shadow-xl"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A12] via-black/40 to-transparent" />
            </div>

            {/* Content Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2">
              <h3 className="text-white text-sm font-bold leading-tight drop-shadow-md">{item.title}</h3>

              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-600/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: `${item.progress || 0}%` }} />
                </div>
                <span className="text-[10px] font-bold text-gray-300">%{item.progress || 0}</span>
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
