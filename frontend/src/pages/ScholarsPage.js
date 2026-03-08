import React, { useState, useEffect } from 'react';
import { Users, Send, Loader2, ArrowLeft, Share2, Volume2, MessageCircle } from 'lucide-react';
import api from '../api';

const SCHOLAR_COLORS = {
  nihat_hatipoglu: { bg: '#1a3a5c', accent: '#5b9bd5' },
  hayrettin_karaman: { bg: '#2d1b3d', accent: '#9b59b6' },
  mustafa_islamoglu: { bg: '#1a3d2e', accent: '#2ecc71' },
  diyanet: { bg: '#0f3d2e', accent: '#D4AF37' },
  omer_nasuhi: { bg: '#3d2d1a', accent: '#e67e22' },
  elmalili: { bg: '#1a2d3d', accent: '#3498db' },
  said_nursi: { bg: '#3d1a2d', accent: '#e74c3c' },
  mehmet_okuyan: { bg: '#2d3d1a', accent: '#27ae60' },
  suleyman_ates: { bg: '#3d3d1a', accent: '#f1c40f' },
  yasar_nuri: { bg: '#1a3d3d', accent: '#1abc9c' },
  'cübbeli_ahmet': { bg: '#2d1a3d', accent: '#8e44ad' },
  ali_erbas: { bg: '#1a2d2d', accent: '#16a085' },
};

function ScholarAvatar({ scholar, size = 48 }) {
  const colors = SCHOLAR_COLORS[scholar.id] || { bg: '#0f3d2e', accent: '#D4AF37' };
  const initials = scholar.name.split(' ').filter(w => w.length > 2).slice(-2).map(w => w[0]).join('');

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="w-full h-full rounded-2xl flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}dd)`, border: `2px solid ${colors.accent}40` }}>
        <span className="font-bold" style={{ color: colors.accent, fontSize: size * 0.35, fontFamily: 'Playfair Display, serif' }}>
          {initials}
        </span>
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
        style={{ background: colors.accent, border: '2px solid #0A1F14' }}>
        <MessageCircle size={7} className="text-[#0A1F14]" />
      </div>
    </div>
  );
}

export default function ScholarsPage() {
  const [scholars, setScholars] = useState([]);
  const [selected, setSelected] = useState(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `scholar_${Date.now()}`);

  useEffect(() => { api.get('/scholars').then(r => setScholars(r.data)).catch(() => {}); }, []);

  const askScholar = async (e) => {
    e.preventDefault();
    if (!question.trim() || !selected || loading) return;
    const q = question.trim();
    setMessages(prev => [...prev, { type: 'user', text: q }]);
    setQuestion('');
    setLoading(true);
    try {
      const { data } = await api.post('/scholars/ask', { session_id: sessionId, question: q, scholar_id: selected.id });
      setMessages(prev => [...prev, { type: 'scholar', text: data.response, name: data.scholar_name, sources: data.sources }]);
    } catch {
      setMessages(prev => [...prev, { type: 'scholar', text: 'Hata oluştu, tekrar deneyin.', name: selected.name }]);
    }
    setLoading(false);
  };

  const share = (text, name) => {
    const full = `${name}:\n\n${text}\n\n— İslami Yaşam Asistanı`;
    if (navigator.share) navigator.share({ title: name, text: full }).catch(() => {});
    else navigator.clipboard.writeText(full).catch(() => {});
  };

  if (selected) {
    const colors = SCHOLAR_COLORS[selected.id] || { bg: '#0f3d2e', accent: '#D4AF37' };
    return (
      <div className="animate-fade-in h-screen flex flex-col" data-testid="scholar-chat">
        <div className="px-4 pt-10 pb-3" style={{ background: `linear-gradient(180deg, ${colors.bg}80 0%, transparent 100%)` }}>
          <button onClick={() => { setSelected(null); setMessages([]); }} className="flex items-center gap-1 text-sm mb-3" style={{ color: colors.accent }}>
            <ArrowLeft size={18} /> Geri
          </button>
          <div className="flex items-center gap-3">
            <ScholarAvatar scholar={selected} size={44} />
            <div>
              <h1 className="text-base font-bold text-[#F5F5DC]">{selected.name}</h1>
              <p className="text-[11px] text-[#A8B5A0]">{selected.specialty}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <ScholarAvatar scholar={selected} size={64} />
              <p className="text-sm text-[#A8B5A0] mt-4">"{selected.name}" hocaya sorunuzu sorun</p>
              <p className="text-[11px] text-[#A8B5A0]/60 mt-1">Anlatım tarzı: {selected.style?.split(',')[0]}</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`animate-fade-in ${msg.type === 'user' ? 'flex justify-end' : ''}`}>
              {msg.type === 'user' ? (
                <div className="max-w-[80%] rounded-2xl rounded-tr-md px-4 py-2.5" style={{ background: `${colors.accent}25`, border: `1px solid ${colors.accent}30` }}>
                  <p className="text-sm text-[#F5F5DC]">{msg.text}</p>
                </div>
              ) : (
                <div className="card-islamic rounded-2xl rounded-tl-md p-4">
                  <p className="text-[10px] font-semibold mb-2" style={{ color: colors.accent }}>{msg.name}</p>
                  <p className="text-sm text-[#F5F5DC]/85 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex gap-2 mt-2 pt-2 border-t border-[#D4AF37]/10">
                    <button onClick={() => share(msg.text, msg.name)} className="flex items-center gap-1 text-[10px] text-[#D4AF37] px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)' }}>
                      <Share2 size={10} /> Paylaş
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 py-2">
              <Loader2 size={16} className="animate-spin" style={{ color: colors.accent }} />
              <span className="text-xs text-[#A8B5A0]">Yanıt hazırlanıyor...</span>
            </div>
          )}
        </div>

        <form onSubmit={askScholar} className="p-4 glass-dark">
          <div className="flex gap-2">
            <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Sorunuzu yazın..."
              data-testid="scholar-question-input"
              className="flex-1 bg-[#0F3D2E]/50 border border-[#D4AF37]/15 rounded-xl px-4 py-2.5 text-sm text-[#F5F5DC] placeholder:text-[#A8B5A0]/50 focus:outline-none focus:border-[#D4AF37]/30" />
            <button type="submit" disabled={loading || !question.trim()} data-testid="scholar-send-btn"
              className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 transition-colors"
              style={{ background: colors.accent }}>
              <Send size={16} className="text-[#0A1F14]" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" data-testid="scholars-page">
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(180deg, rgba(15,61,46,0.5) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Users size={20} className="text-[#D4AF37]" />
          <h1 className="text-xl font-bold text-[#F5F5DC]" style={{ fontFamily: 'Playfair Display, serif' }}>Hocalara Sor</h1>
        </div>
        <p className="text-xs text-[#A8B5A0]">12 farklı İslam aliminin bakış açısından cevap alın</p>
      </div>

      <div className="px-4 space-y-2.5 pb-6">
        {scholars.map((s, i) => {
          const colors = SCHOLAR_COLORS[s.id] || { bg: '#0f3d2e', accent: '#D4AF37' };
          return (
            <button key={s.id} onClick={() => setSelected(s)} data-testid={`scholar-${s.id}`}
              className="w-full text-left rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98] animate-fade-in"
              style={{ background: `linear-gradient(135deg, ${colors.bg}60, rgba(10,31,20,0.8))`, border: `1px solid ${colors.accent}20`, animationDelay: `${i * 0.05}s` }}>
              <ScholarAvatar scholar={s} size={48} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#F5F5DC]">{s.name}</p>
                <p className="text-[11px] mt-0.5" style={{ color: colors.accent }}>{s.title}</p>
                <p className="text-[10px] text-[#A8B5A0] mt-0.5 truncate">{s.specialty}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
