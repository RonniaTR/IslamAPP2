import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, BookOpen, Compass, Moon, Library, PenTool, Gamepad2 } from 'lucide-react';

export function NewModulesRow() {
  const navigate = useNavigate();

  const newModules = [
    { path: '/yol', icon: Route, title: 'Nur Yolu', desc: 'Kişisel gelişim', color: '#10B981' },
    { path: '/hifz', icon: BookOpen, title: 'Ezber Asistanı', desc: 'Sure ezberi', color: '#3B82F6' },
    { path: '/hazine', icon: Compass, title: 'Nur Hazinesi', desc: 'Dualar ve sırlar', color: '#F59E0B' },
    { path: '/stories', icon: BookOpen, title: 'Kıssalar', desc: 'İbretlik hikayeler', color: '#8B5CF6' },
    { path: '/night', icon: Moon, title: 'Gece Modu', desc: 'Uyku öncesi', color: '#6366F1' },
    { path: '/library', icon: Library, title: 'Kütüphane', desc: 'Makaleler', color: '#EC4899' },
    { path: '/elifba', icon: PenTool, title: 'Elif Ba', desc: 'Kuran Öğren', color: '#14B8A6' },
    { path: '/journal', icon: BookOpen, title: 'Amel Defteri', desc: 'Günlük muhasebe', color: '#F97316' },
    { path: '/games', icon: Gamepad2, title: 'Oyun Merkezi', desc: '14 Farklı Oyun', color: '#84CC16' },
  ];

  return (
    <div className="flex flex-col font-sans px-4">
      <h2 className="text-xl font-bold text-white tracking-wide mb-4">Yeni Deneyimler</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {newModules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <button
              key={i}
              onClick={() => navigate(mod.path)}
              className="flex items-center gap-3 bg-[#0D2418] border border-white/5 p-3 rounded-2xl text-left hover:bg-[#123121] transition-all group"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${mod.color}20`, color: mod.color }}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{mod.title}</p>
                <p className="text-[11px] text-gray-400 truncate">{mod.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
