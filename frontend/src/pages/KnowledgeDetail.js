import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import api from '../api';

export default function KnowledgeDetail() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);

  useEffect(() => {
    api.get(`/knowledge-cards/${cardId}`).then(r => setCard(r.data)).catch(() => navigate('/'));
  }, [cardId, navigate]);

  if (!card) return (
    <div className="min-h-screen bg-[#0A1F14] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="animate-fade-in" data-testid="knowledge-detail">
      <div className="px-4 pt-10 pb-4" style={{ background: 'linear-gradient(180deg, rgba(15,61,46,0.5) 0%, transparent 100%)' }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#D4AF37] mb-3" aria-label="Geri">
          <ArrowLeft size={18} />
          <span className="text-sm">Geri</span>
        </button>
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-[#D4AF37]" />
          <h1 className="text-xl font-bold text-[#F5F5DC]" style={{ fontFamily: 'Playfair Display, serif' }}>{card.title}</h1>
        </div>
      </div>

      <div className="px-4 space-y-4 pb-6">
        {card.items.map((item, i) => (
          <div key={i} className="card-islamic rounded-2xl p-5 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <h3 className="text-base font-semibold text-[#D4AF37] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{item.title}</h3>
            <p className="text-sm text-[#F5F5DC]/85 leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
