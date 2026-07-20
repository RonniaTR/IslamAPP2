import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HistoryService } from '../../services/HistoryService';
import { UserService } from '../../services/UserService';

export function ForYouRow({ items = [], title = "Sana Özel", viewAll = true }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock items exactly matching the UI if no items are passed, for visual perfection
  const displayItems = items.length > 0 ? items : [
    { id: 1, title: 'Sabah Zikirleri', subtitle: 'Güne bereketle başla', badge: 'ÖNERİLEN', badgeColor: 'bg-[#10b981]', image: 'https://images.unsplash.com/photo-1584281722976-155e886d9a91?q=80&w=400&auto=format&fit=crop', progress: 40, type: 'article' },
    { id: 2, title: 'Namaza Hazırlık', subtitle: '5 adımda hazırlık', badge: 'YENİ', badgeColor: 'bg-[#f59e0b]', image: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=400&auto=format&fit=crop', progress: 15, type: 'article' },
    { id: 3, title: 'Tevekkül Nedir?', subtitle: 'Yeni makale', badge: 'SANA ÖZEL', badgeColor: 'bg-purple-500', image: 'https://images.unsplash.com/photo-1609599006353-e629aaab31f5?q=80&w=400&auto=format&fit=crop', progress: 0, type: 'article' },
    { id: 4, title: 'İman Testi', subtitle: 'Bilgini ölç', badge: 'TEST', badgeColor: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1574246604907-db69e30fd797?q=80&w=400&auto=format&fit=crop', progress: 20, type: 'quiz' },
  ];

  const handleItemClick = async (item) => {
    try {
      if (user) {
        const uid = user.user_id || user.id;
        await HistoryService.addToHistory(uid, {
          id: item.id,
          type: item.type || 'article',
          title: item.title,
          slug: item.slug || String(item.id),
          image: item.image || item.coverImage
        });
        await UserService.addXPToUser(uid, 5); // 5 XP for exploring content
      }
    } catch (e) {
      console.error(e);
    }
    navigate(`/content/foryou/${item.id}`);
  };

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
      <div className="pl-4 pb-4 flex gap-4 overflow-x-auto no-scrollbar snap-x">
        {displayItems.map((item, idx) => (
          <div 
            key={item.id || idx}
            onClick={() => handleItemClick(item)}
            className="relative min-w-[150px] w-[150px] h-[200px] rounded-[24px] overflow-hidden snap-start shrink-0 cursor-pointer group shadow-xl"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0A1A12]/95" />
            </div>

            {/* Badge */}
            {item.badge && (
              <div className={`absolute top-3 left-3 ${item.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider`}>
                {item.badge}
              </div>
            )}

            {/* Content Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-3">
              <div>
                <h3 className="text-white text-sm font-bold leading-tight drop-shadow-md">{item.title}</h3>
                <p className="text-gray-400 text-[10px] mt-0.5 drop-shadow-md">{item.subtitle}</p>
              </div>

              {/* Progress & Arrow */}
              <div className="flex items-center justify-between">
                <div className="flex-1 bg-gray-600/50 h-1.5 rounded-full overflow-hidden mr-3">
                  <div className="bg-[#10b981] h-full rounded-full" style={{ width: `${item.progress || 0}%` }} />
                </div>
                <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-[#10b981] transition-colors">
                  <ArrowRight size={12} className="text-white" />
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
