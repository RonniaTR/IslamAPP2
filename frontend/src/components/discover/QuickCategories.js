import React from 'react';
import { ChevronRight, BookOpen, Heart, Star, Moon, Book, Scale, Sun, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickCategories() {
  const navigate = useNavigate();

  const categories = [
    { id: 'quran', title: "Kur'an", icon: BookOpen, color: 'bg-[#10b981]' },
    { id: 'dua', title: "Dua & Zikir", icon: Heart, color: 'bg-[#0d9488]' },
    { id: 'hadith', title: "Hadisler", icon: Star, color: 'bg-[#d97706]' },
    { id: 'siyer', title: "Siyer", icon: Moon, color: 'bg-[#f59e0b]' },
    { id: 'ilmihal', title: "İlmihal", icon: Book, color: 'bg-[#3b82f6]' },
    { id: 'fikih', title: "Fıkıh", icon: Scale, color: 'bg-[#8b5cf6]' },
    { id: 'esma', title: "Esmaül Hüsna", icon: Sun, color: 'bg-[#0f766e]' },
    { id: 'prophets', title: "Peygamberler", icon: Users, color: 'bg-[#ea580c]' },
  ];

  return (
    <div className="flex flex-col font-sans">
      <div className="flex justify-between items-center px-4 mb-4">
        <h2 className="text-xl font-bold text-white tracking-wide">Hızlı Kategoriler</h2>
        <button className="text-xs text-[#10b981] font-medium flex items-center gap-1 hover:text-[#059669] transition-colors">
          Tümü <ChevronRight size={14} />
        </button>
      </div>

      <div className="pl-4 pb-2 flex gap-4 overflow-x-auto no-scrollbar snap-x">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div 
              key={idx} 
              onClick={() => navigate(`/category/${cat.id}`)}
              className="flex flex-col items-center gap-2 cursor-pointer snap-start shrink-0 group"
            >
              <div className={`w-[72px] h-[72px] ${cat.color} rounded-[20px] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                <Icon size={32} className="text-white drop-shadow-md z-10" />
              </div>
              <span className="text-[11px] font-bold text-gray-300 group-hover:text-white transition-colors text-center w-full truncate px-1">
                {cat.title}
              </span>
            </div>
          );
        })}
        <div className="min-w-[1px] shrink-0" />
      </div>
    </div>
  );
}
