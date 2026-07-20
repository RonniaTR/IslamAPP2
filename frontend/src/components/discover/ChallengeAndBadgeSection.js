import React from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';

export function ChallengeAndBadgeSection() {
  return (
    <div className="px-4 flex flex-col md:flex-row gap-4 font-sans">
      
      {/* Günlük Challenge Card */}
      <div className="flex-1 bg-gradient-to-br from-[#0F3523] to-[#0A1A12] rounded-[24px] p-5 relative overflow-hidden border border-[#1A3826] shadow-xl">
        <h3 className="text-white font-bold text-lg mb-1">Günlük Challenge</h3>
        <p className="text-gray-400 text-xs mb-4">3/5 Tamamlandı</p>
        
        <div className="space-y-2.5 relative z-10">
          <ChallengeItem text="Sabah duasını oku" done={true} />
          <ChallengeItem text="1 hadis öğren" done={true} />
          <ChallengeItem text="5 dk Kur'an oku" done={true} />
          <ChallengeItem text="1 sayfa kitap oku" done={false} />
          <ChallengeItem text="Akşam zikrini yap" done={false} />
        </div>

        {/* Treasure Chest Decoration */}
        <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-90">
          {/* Treasure chest image (mock) */}
          <img 
            src="https://cdn3d.iconscout.com/3d/premium/thumb/treasure-box-4996160-4159585.png" 
            alt="Treasure" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          <div className="absolute bottom-6 right-8 text-center bg-black/40 backdrop-blur-md rounded-lg px-2 py-1 border border-white/10">
            <div className="text-white text-[9px]">Ödülün</div>
            <div className="text-[#f59e0b] font-bold text-xs">+50 XP</div>
          </div>
        </div>
      </div>

      {/* Bir Sonraki Rozet Card */}
      <div className="flex-1 bg-gradient-to-br from-[#0F3523] to-[#0A1A12] rounded-[24px] p-5 relative flex flex-col justify-between border border-[#1A3826] shadow-xl">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Bir Sonraki Rozet</h3>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-white text-lg font-bold">İlim Yolcusu</h4>
              <p className="text-gray-400 text-[10px] mt-1">7/10 Görev Tamamlandı</p>
            </div>
            
            {/* Hexagon Badge Decoration */}
            <div className="w-16 h-16 absolute top-4 right-4">
              <img 
                src="https://cdn3d.iconscout.com/3d/premium/thumb/badge-4996165-4159590.png" 
                alt="Badge" 
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{ filter: 'hue-rotate(60deg) saturate(150%)' }} // Tinting it to look like gold/emerald
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 w-full mb-6 mt-2">
            <div className="flex-1 bg-[#1A3826] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: '70%' }} />
            </div>
            <span className="text-xs font-bold text-gray-300">%70</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-[#1A3826] hover:bg-[#2D8A4E] transition-colors rounded-full py-2.5 flex items-center justify-center gap-2 text-white border border-[#2D8A4E]/30">
          <span className="text-xs font-bold">Rozetleri Gör</span>
          <ChevronRight size={14} className="text-[#10b981]" />
        </button>
      </div>

    </div>
  );
}

function ChallengeItem({ text, done }) {
  return (
    <div className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 size={16} className="text-[#10b981] shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      ) : (
        <Circle size={16} className="text-[#1A3826] shrink-0" />
      )}
      <span className={`text-[11px] font-medium ${done ? 'text-gray-300 line-through decoration-gray-500/50' : 'text-gray-400'}`}>
        {text}
      </span>
    </div>
  );
}
