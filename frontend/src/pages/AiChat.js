import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, Sparkles, MessageCircle, BookOpen, Moon, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

const QUICK_QUESTIONS = [
  { q: "Namaz nasıl kılınır?", icon: "🕌", cat: "İbadet" },
  { q: "Oruç kimlere farzdır?", icon: "🌙", cat: "Ramazan" },
  { q: "Zekat nasıl hesaplanır?", icon: "💰", cat: "Zekat" },
  { q: "Abdest nasıl alınır?", icon: "💧", cat: "Temizlik" },
  { q: "Hac ibadeti nedir?", icon: "🕋", cat: "Hac" },
  { q: "Dua etmenin adabı nedir?", icon: "🤲", cat: "Dua" },
  { q: "Kur'an okuma adabı nedir?", icon: "📖", cat: "Kur'an" },
  { q: "Peygamberimizin hayatı", icon: "⭐", cat: "Siyer" },
];

function formatAIResponse(text) {
  if (!text) return text;
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h3 class="text-sm font-bold mt-2 mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-sm font-bold mt-2 mb-1">$1</h2>')
    .replace(/^- (.*$)/gm, '<li class="ml-3 text-sm">• $1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-3 text-sm">$1</li>');
}

export default function AiChat() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (msg) => {
    const text = msg || input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { session_id: sessionId, message: text });
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.' }]);
    } finally { setLoading(false); }
  };

  const clearChat = () => {
    api.delete(`/ai/history/${sessionId}`).catch(() => {});
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]" data-testid="ai-chat">
      {/* Header */}
      <div className="px-5 pt-10 pb-3 shrink-0" style={{ background: `linear-gradient(180deg, ${theme.surface}80 0%, transparent 100%)` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.gold}40, ${theme.gold}20)` }}>
              <Sparkles size={18} style={{ color: theme.gold }} />
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>İslami Danışman</h1>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>Kur'an ve Sünnet rehberliğinde · Gemini AI</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} data-testid="clear-chat-btn"
              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" style={{ color: theme.textSecondary }}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-4" data-testid="chat-empty">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: `${theme.gold}15` }}>
              <MessageCircle size={28} style={{ color: theme.gold }} />
            </div>
            <h2 className="text-base font-bold mb-1" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
              Selam, {user?.name?.split(' ')[0] || 'Kardeşim'}
            </h2>
            <p className="text-xs mb-5" style={{ color: theme.textSecondary }}>İslami konularda soru sorabilirsiniz</p>

            <div className="grid grid-cols-2 gap-2">
              {QUICK_QUESTIONS.map((qq, i) => (
                <button key={i} onClick={() => sendMessage(qq.q)} data-testid={`quick-q-${i}`}
                  className="text-left p-2.5 rounded-xl transition-all hover:scale-[1.02]"
                  style={{ background: theme.inputBg, border: `1px solid ${theme.cardBorder}` }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{qq.icon}</span>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ background: `${theme.gold}15`, color: theme.gold }}>{qq.cat}</span>
                  </div>
                  <p className="text-[11px] leading-tight" style={{ color: theme.textPrimary }}>{qq.q}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`} data-testid={`chat-msg-${i}`}>
            <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={msg.role === 'user' ? {
                background: theme.gold,
                color: '#fff',
                borderBottomRightRadius: '4px',
              } : {
                background: theme.inputBg,
                color: theme.textPrimary,
                borderBottomLeftRadius: '4px',
                border: `1px solid ${theme.cardBorder}`,
              }}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={10} style={{ color: theme.gold }} />
                  <span className="text-[9px] font-medium" style={{ color: theme.gold }}>İslami Danışman</span>
                </div>
              )}
              {msg.role === 'assistant' ? (
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.content) }} />
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ background: theme.inputBg, border: `1px solid ${theme.cardBorder}` }}>
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" style={{ color: theme.gold }} />
                <span className="text-xs" style={{ color: theme.textSecondary }}>Düşünüyorum...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="px-4 pb-4 pt-2 shrink-0">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
          style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}` }}>
          <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Sorunuzu yazın..."
            data-testid="chat-input"
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: theme.textPrimary }} />
          <button type="submit" disabled={loading || !input.trim()} data-testid="chat-send-btn"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-20"
            style={{ background: input.trim() ? theme.gold : theme.inputBg }}>
            <Send size={14} className="text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}
