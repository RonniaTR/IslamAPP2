import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, ChevronDown } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useTx } from '../i18n';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

// KONU REHBERLERİ — kişi değil konu.
// Önceki sürüm burada gerçek kişilerin adlarını listeliyor ve yapay zekâya onların ağzından cevap
// yazdırıyordu. Kaldırıldı (docs/YENI_OZELLIKLER.md 0.1). Kimlikler backend SCHOLARS ile aynıdır.
const SCHOLARS = [
  { id: "genel", name: "Genel rehber", title: "Yapay zekâ", color: "#10b981", specialty: "İslam'la ilgili genel sorular", avatar: "☪" },
  { id: "ibadet", name: "İbadet rehberi", title: "Yapay zekâ", color: "#f59e0b", specialty: "Abdest, namaz, oruç, zekât, hac", avatar: "🕌" },
  { id: "kuran", name: "Kur'an rehberi", title: "Yapay zekâ", color: "#3b82f6", specialty: "Ayetlerin anlamı, sureler, nüzul", avatar: "📖" },
  { id: "hadis", name: "Hadis ve sünnet rehberi", title: "Yapay zekâ", color: "#8b5cf6", specialty: "Hadisler ve sünnet", avatar: "📜" },
  { id: "siyer", name: "Siyer rehberi", title: "Yapay zekâ", color: "#06b6d4", specialty: "Peygamber Efendimizin hayatı", avatar: "🌙" },
  { id: "ahlak", name: "Ahlak ve gündelik hayat rehberi", title: "Yapay zekâ", color: "#ec4899", specialty: "Güzel ahlak, aile, kul hakkı", avatar: "🌿" },
];

export default function ScholarsPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const tt = useTx();
  const { theme } = useTheme();
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const askScholar = async () => {
    if (!question.trim() || loading || !selectedScholar) return;
    const q = question.trim();
    setQuestion('');
    setLoading(true);
    setAnswer('');
    setHistory(prev => [...prev, { role: 'user', content: q }]);

    try {
      const { data } = await api.post('/scholars/ask', {
        scholar_id: selectedScholar.id,
        question: q,
        session_id: `scholar_${selectedScholar.id}_${Date.now()}`
      });
      const resp = data.response || data.answer || 'Yanıt alınamadı.';
      setAnswer(resp);
      setHistory(prev => [...prev, { role: 'scholar', content: resp, scholar: selectedScholar.name }]);
    } catch {
      const fallback = 'Şu anda yanıt oluşturulamadı. Lütfen tekrar deneyin.';
      setAnswer(fallback);
      setHistory(prev => [...prev, { role: 'scholar', content: fallback, scholar: selectedScholar.name }]);
    }
    setLoading(false);
  };

  if (selectedScholar) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] animate-fade-in" data-testid="scholar-chat">
        {/* Header */}
        <div className="px-4 pt-10 pb-3 shrink-0" style={{ background: 'linear-gradient(180deg, rgba(15,61,46,0.5) 0%, transparent 100%)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedScholar(null); setHistory([]); setAnswer(''); }}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#F5F5DC]">
              <ArrowLeft size={14} />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: selectedScholar.color }}>
              {selectedScholar.avatar}
            </div>
            <div>
              <p className="text-sm font-bold text-[#F5F5DC]">{selectedScholar.name}</p>
              <p className="text-[10px] text-[#A8B5A0]">{selectedScholar.specialty}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
          {history.length === 0 && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-lg font-bold text-white" style={{ background: selectedScholar.color }}>
                {selectedScholar.avatar}
              </div>
              <p className="text-sm text-[#F5F5DC] font-medium">{selectedScholar.name}</p>
              <p className="text-xs text-[#A8B5A0] mt-1">{selectedScholar.title} · {selectedScholar.specialty}</p>
              <p className="text-xs text-[#A8B5A0]/60 mt-3 max-w-xs mx-auto">{tt('Cevaplar yapay zekâ tarafından üretilir; hata içerebilir. Bir âlimin sözü ya da fetva değildir. Kişisel dini sorularınız için Diyanet fetva hattı: ALO 190.')}</p>
            </div>
          )}
          {history.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-md'
                  : 'bg-white/[0.04] text-[#F5F5DC]/90 rounded-bl-md border border-white/5'
              }`}>
                {msg.role === 'scholar' && (
                  <p className="text-[9px] font-medium mb-1" style={{ color: selectedScholar.color }}>{msg.scholar}</p>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/[0.04] rounded-2xl rounded-bl-md px-4 py-3 border border-white/5 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" style={{ color: selectedScholar.color }} />
                <span className="text-xs text-[#A8B5A0]">{t.thinking || 'Yanıt hazırlanıyor...'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={e => { e.preventDefault(); askScholar(); }} className="px-4 pb-4 pt-2 shrink-0">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 focus-within:border-emerald-500/30">
            <input type="text" value={question} onChange={e => setQuestion(e.target.value)}
              placeholder={tt('Sorunuzu yazın…')}
              data-testid="scholar-input"
              className="flex-1 bg-transparent text-sm text-[#F5F5DC] placeholder:text-[#A8B5A0]/50 focus:outline-none" />
            <button type="submit" disabled={loading || !question.trim()} data-testid="scholar-send"
              className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-20"
              style={{ background: question.trim() ? selectedScholar.color : 'rgba(255,255,255,0.05)' }}>
              <Send size={14} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-24" data-testid="scholars-page">
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(180deg, rgba(15,61,46,0.5) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#F5F5DC]">
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#F5F5DC]" style={{ fontFamily: 'Playfair Display, serif' }}>{tt('Rehbere Sor')}</h1>
            <p className="text-xs text-[#A8B5A0]">{tt('Bir konu seçin · yapay zekâ rehber cevaplar')}</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-2">
        {SCHOLARS.map(s => (
          <button key={s.id} onClick={() => setSelectedScholar(s)}
            data-testid={`scholar-${s.id}`}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-left active:scale-[0.98]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: s.color }}>
              {s.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#F5F5DC]">{tt(s.name)}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-[#A8B5A0]">{s.title}</span>
                <span className="text-[10px] text-[#A8B5A0]/40">·</span>
                <span className="text-[10px]" style={{ color: s.color }}>{tt(s.specialty)}</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-[#A8B5A0] -rotate-90" />
          </button>
        ))}
      </div>
    </div>
  );
}
