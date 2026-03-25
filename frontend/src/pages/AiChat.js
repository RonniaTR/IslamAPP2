import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Loader2, Sparkles, MessageCircle, BookOpen, Moon, Star, Crown, Settings, ChevronDown, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremium } from '../contexts/PremiumContext';
import { trackFeature } from '../services/analytics';
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

const LEVELS = [
  { id: 'baslangic', label: 'Başlangıç', icon: '🌱' },
  { id: 'orta', label: 'Orta', icon: '📘' },
  { id: 'ileri', label: 'İleri', icon: '🎓' },
];

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatAIResponse(text) {
  if (!text) return text;
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h3 class="text-sm font-bold mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-sm font-bold mt-3 mb-1">$1</h2>')
    .replace(/^- (.*$)/gm, '<li class="ml-3 text-sm">• $1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-3 text-sm">$1</li>');
}

const ChatBubble = memo(function ChatBubble({ msg, theme, index }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, delay: 0.05 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      data-testid={`chat-msg-${index}`}>
      <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={isUser ? {
          background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight})`,
          color: '#fff',
          borderBottomRightRadius: '4px',
        } : {
          background: theme.cardBg,
          color: theme.textPrimary,
          borderBottomLeftRadius: '4px',
          border: `1px solid ${theme.cardBorder}`,
        }}>
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={10} style={{ color: theme.gold }} />
            <span className="text-[9px] font-medium" style={{ color: theme.gold }}>AI Müftü</span>
          </div>
        )}
        {!isUser ? (
          <div className="ai-response whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.content) }} />
        ) : (
          <div className="whitespace-pre-wrap">{msg.content}</div>
        )}
        {msg.limit_reached && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-2 p-2 rounded-lg flex items-center gap-2" style={{ background: `${theme.gold}20` }}>
            <Crown size={12} style={{ color: theme.gold }} />
            <span className="text-[10px]" style={{ color: theme.gold }}>Premium'a geçerek sınırsız soru sorun</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export default function AiChat() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { premium } = usePremium();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const [level, setLevel] = useState(() => localStorage.getItem('ai_level') || 'orta');
  const [showSettings, setShowSettings] = useState(false);
  const [usage, setUsage] = useState({ used: 0, limit: 5 });
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Load AI usage
  useEffect(() => {
    if (user?.user_id) {
      api.get(`/ai/usage/${user.user_id}`).then(r => setUsage(r.data)).catch(() => {});
    }
  }, [user, messages.length]);

  // Set context when level changes
  useEffect(() => {
    localStorage.setItem('ai_level', level);
    if (user?.user_id) {
      api.post('/ai/context', { user_id: user.user_id, level, madhab: 'hanefi', language: 'tr' }).catch(() => {});
    }
  }, [level, user]);

  const sendMessage = async (msg) => {
    const text = msg || input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    trackFeature('ai_chat', 'send');
    try {
      const { data } = await api.post('/ai/mufti', {
        session_id: sessionId,
        message: text,
        user_id: user?.user_id || 'anonymous',
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        limit_reached: data.limit_reached,
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.' }]);
    } finally { setLoading(false); }
  };

  const clearChat = () => {
    api.delete(`/ai/history/${sessionId}`).catch(() => {});
    setMessages([]);
  };

  const limitReached = !premium && usage.limit > 0 && usage.used >= usage.limit;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]" data-testid="ai-chat">
      {/* Header */}
      <div className="px-5 pt-10 pb-3 shrink-0" style={{ background: `linear-gradient(180deg, ${theme.surface}80 0%, transparent 100%)` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${theme.gold}40, ${theme.gold}20)` }}>
              <Sparkles size={18} style={{ color: theme.gold }} />
            </motion.div>
            <div>
              <h1 className="text-base font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>AI Müftü</h1>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>
                Kur'an ve Sünnet rehberliğinde
                {!premium && usage.limit > 0 && <span> · {usage.used}/{usage.limit}</span>}
                {premium && <span className="ml-1" style={{ color: theme.gold }}>★ Premium</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg transition-colors" style={{ color: theme.textSecondary }}>
              <Settings size={16} />
            </button>
            {messages.length > 0 && (
              <button onClick={clearChat} data-testid="clear-chat-btn"
                className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" style={{ color: theme.textSecondary }}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <div className="pt-3 pb-1">
                <p className="text-[10px] font-medium mb-2" style={{ color: theme.textSecondary }}>Bilgi Seviyesi</p>
                <div className="flex gap-2">
                  {LEVELS.map(l => (
                    <button key={l.id} onClick={() => setLevel(l.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                      style={level === l.id ? { background: theme.gold, color: '#fff' } : { background: theme.inputBg, color: theme.textSecondary }}>
                      <span>{l.icon}</span> {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-4" data-testid="chat-empty">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: `${theme.gold}15` }}>
              <MessageCircle size={28} style={{ color: theme.gold }} />
            </motion.div>
            <h2 className="text-base font-bold mb-1" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
              Selam, {user?.name?.split(' ')[0] || 'Kardeşim'}
            </h2>
            <p className="text-xs mb-5" style={{ color: theme.textSecondary }}>Hanefi mezhebi · {LEVELS.find(l => l.id === level)?.label} seviye</p>

            <div className="grid grid-cols-2 gap-2">
              {QUICK_QUESTIONS.map((qq, i) => (
                <motion.button key={i} whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                  onClick={() => sendMessage(qq.q)} data-testid={`quick-q-${i}`}
                  className="text-left p-2.5 rounded-xl transition-all"
                  style={{ background: theme.inputBg, border: `1px solid ${theme.cardBorder}` }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{qq.icon}</span>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ background: `${theme.gold}15`, color: theme.gold }}>{qq.cat}</span>
                  </div>
                  <p className="text-[11px] leading-tight" style={{ color: theme.textPrimary }}>{qq.q}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} theme={theme} index={i} />
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" style={{ color: theme.gold }} />
                <span className="text-xs" style={{ color: theme.textSecondary }}>Düşünüyorum...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="px-4 pb-4 pt-2 shrink-0">
        {limitReached && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-2 p-2.5 rounded-xl" style={{ background: `${theme.gold}15`, border: `1px solid ${theme.gold}30` }}>
            <Lock size={14} style={{ color: theme.gold }} />
            <span className="text-[11px] flex-1" style={{ color: theme.gold }}>Günlük limit doldu. Premium ile sınırsız sorun!</span>
            <Crown size={14} style={{ color: theme.gold }} />
          </motion.div>
        )}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
          style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}` }}>
          <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder={limitReached ? "Premium'a geçin..." : "Sorunuzu yazın..."}
            disabled={limitReached}
            data-testid="chat-input"
            className="flex-1 bg-transparent text-sm focus:outline-none disabled:opacity-50"
            style={{ color: theme.textPrimary }} />
          <motion.button whileTap={{ scale: 0.9 }} type="submit" disabled={loading || !input.trim() || limitReached}
            data-testid="chat-send-btn"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-20"
            style={{ background: input.trim() && !limitReached ? theme.gold : theme.inputBg }}>
            <Send size={14} className="text-white" />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
