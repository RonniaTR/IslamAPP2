import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Loader2, Sparkles, MessageCircle, BookOpen, Moon, Star, Crown, Settings, ChevronDown, Lock, Zap, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import { usePremium } from '../contexts/PremiumContext';
import { trackFeature } from '../services/analytics';
import api from '../api';

const getQuickQuestions = (t) => [
  { q: t.ai_q_prayer || "Namaz nasıl kılınır?", icon: "🕌", cat: t.ai_q_prayer_cat || "İbadet" },
  { q: t.ai_q_fasting || "Oruç kimlere farzdır?", icon: "🌙", cat: t.ai_q_fasting_cat || "Ramazan" },
  { q: t.ai_q_zakat || "Zekat nasıl hesaplanır?", icon: "💰", cat: t.ai_q_zakat_cat || "Zekat" },
  { q: t.ai_q_ablution || "Abdest nasıl alınır?", icon: "💧", cat: t.ai_q_ablution_cat || "Temizlik" },
  { q: t.ai_q_tafsir || "Bakara suresi 255. ayet tefsiri", icon: "📖", cat: t.ai_q_tafsir_cat || "Tefsir" },
  { q: t.ai_q_hadith || "Ameller niyetlere göredir hadisi", icon: "📜", cat: t.ai_q_hadith_cat || "Hadis" },
  { q: t.ai_q_faith || "İslam'da kader inancı", icon: "🌟", cat: t.ai_q_faith_cat || "Akaid" },
  { q: t.ai_q_compare || "İslam ve Hristiyanlık'ta dua", icon: "🌍", cat: t.ai_q_compare_cat || "Mukayese" },
];

const getLevels = (t) => [
  { id: 'baslangic', label: t.ai_beginner || 'Başlangıç', icon: '🌱' },
  { id: 'orta', label: t.ai_intermediate || 'Orta', icon: '📘' },
  { id: 'ileri', label: t.ai_advanced || 'İleri', icon: '🎓' },
];

const getModes = (t) => [
  { id: 'auto', label: t.ai_auto || 'Otomatik', icon: '🤖', desc: t.ai_auto_desc || 'AI soruyu analiz eder, doğru uzmana yönlendirir' },
  { id: 'expert', label: t.ai_expert_select || 'Uzman Seç', icon: '🎯', desc: t.ai_expert_desc || 'Belirli bir uzmana doğrudan sorun' },
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

const ChatBubble = memo(function ChatBubble({ msg, theme, index, t, onRetry }) {
  const isUser = msg.role === 'user';
  const isError = !isUser && msg.isError;
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
          background: isError ? `${theme.cardBg}` : theme.cardBg,
          color: theme.textPrimary,
          borderBottomLeftRadius: '4px',
          border: `1px solid ${theme.cardBorder}`,
        }}>
        {/* Bot badges for multi-bot responses */}
        {!isUser && msg.bots_used && msg.bots_used.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mb-2">
            {msg.bots_used.map(bot => (
              <span key={bot.id} className="inline-flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded-full"
                style={{ background: `${bot.color}20`, color: bot.color }}>
                {bot.icon} {bot.name}
              </span>
            ))}
          </div>
        )}
        {!isUser && !msg.bots_used && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={10} style={{ color: theme.gold }} />
            <span className="text-[9px] font-medium" style={{ color: theme.gold }}>{t.ai_mufti || 'AI Müftü'}</span>
          </div>
        )}
        {!isUser ? (
          <div className="ai-response whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.content) }} />
        ) : (
          <div className="whitespace-pre-wrap">{msg.content}</div>
        )}
        {/* Confidence indicator */}
        {!isUser && msg.confidence && (
          <div className="flex items-center gap-1 mt-2 pt-1.5" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
            <Shield size={9} style={{ color: msg.confidence.confidence === 'high' ? '#10B981' : msg.confidence.confidence === 'medium' ? '#F59E0B' : '#EF4444' }} />
            <span className="text-[8px]" style={{ color: theme.textSecondary }}>
              {t.ai_confidence || 'Güven'}: {msg.confidence.confidence === 'high' ? (t.ai_confidence_high || 'Yüksek') : msg.confidence.confidence === 'medium' ? (t.ai_confidence_medium || 'Orta') : (t.ai_confidence_low || 'Düşük')}
              {msg.confidence.has_source_refs && ` · ${t.ai_source_available || 'Kaynak mevcut'}`}
            </span>
          </div>
        )}
        {msg.limit_reached && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-2 p-2 rounded-lg flex items-center gap-2" style={{ background: `${theme.gold}20` }}>
            <Crown size={12} style={{ color: theme.gold }} />
            <span className="text-[10px]" style={{ color: theme.gold }}>{t.ai_premium_upgrade || "Premium'a geçerek sınırsız soru sorun"}</span>
          </motion.div>
        )}
        {isError && onRetry && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={onRetry}
            className="mt-2 flex items-center gap-1.5 text-[10px] font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{ background: `${theme.gold}15`, color: theme.gold, border: `1px solid ${theme.gold}25` }}>
            <Zap size={10} /> {t.ai_retry || 'Tekrar Dene'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
});

export default function AiChat() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t, lang } = useLang();
  const { premium } = usePremium();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const [level, setLevel] = useState(() => localStorage.getItem('ai_level') || 'orta');
  const [mode, setMode] = useState('auto'); // auto | expert
  const [selectedBot, setSelectedBot] = useState(null);
  const [bots, setBots] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [usage, setUsage] = useState({ used: 0, limit: 10 });
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const QUICK_QUESTIONS = useMemo(() => getQuickQuestions(t), [t]);
  const LEVELS = useMemo(() => getLevels(t), [t]);
  const MODES = useMemo(() => getModes(t), [t]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Load available bots
  useEffect(() => {
    api.get('/ai/bots').then(r => setBots(r.data || [])).catch(() => {});
  }, []);

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
      api.post('/ai/context', { user_id: user.user_id, level, madhab: 'hanefi', language: lang }).catch(() => {});
    }
  }, [level, user, lang]);

  const sendMessage = useCallback(async (msg) => {
    const text = msg || input.trim();
    if (!text || loading) return;
    if (text.length > 2000) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    trackFeature('ai_chat', 'send');

    try {
      let data;
      if (mode === 'expert' && selectedBot) {
        const res = await api.post(`/ai/expert/${selectedBot}`, {
          session_id: sessionId, message: text,
          user_id: user?.user_id || 'anonymous', language: lang,
        });
        data = res.data;
        data.bots_used = [data.bot];
      } else {
        const res = await api.post('/ai/orchestrator', {
          session_id: sessionId, message: text,
          user_id: user?.user_id || 'anonymous', language: lang,
        });
        data = res.data;
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        bots_used: data.bots_used || [],
        confidence: data.confidence || null,
        limit_reached: data.limit_reached,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t.ai_connection_error || 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.',
        isError: true,
        _retryText: text,
      }]);
    } finally { setLoading(false); }
  }, [input, loading, mode, selectedBot, sessionId, user, lang, t]);

  const retryLastMessage = useCallback(() => {
    setMessages(prev => {
      const without = prev.filter((_, i) => i < prev.length - 1);
      const lastUser = [...without].reverse().find(m => m.role === 'user');
      if (lastUser) {
        // Remove the error message
        const cleaned = without;
        // resend
        setTimeout(() => sendMessage(lastUser.content), 50);
        return cleaned;
      }
      return prev;
    });
  }, [sendMessage]);

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
              <h1 className="text-base font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
                {mode === 'expert' && selectedBot ? bots.find(b => b.id === selectedBot)?.name || (t.ai_select_expert || 'AI Uzman') : (t.ai_mufti || 'AI Müftü')}
              </h1>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>
                {mode === 'auto' ? (t.ai_5experts || '5 uzman bot · Otomatik yönlendirme') : (t.ai_direct_expert || 'Doğrudan uzmana sorun')}
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
              <div className="pt-3 space-y-3">
                {/* Mode Selection */}
                <div>
                  <p className="text-[10px] font-medium mb-1.5" style={{ color: theme.textSecondary }}>{t.ai_mode || 'Mod'}</p>
                  <div className="flex gap-2">
                    {MODES.map(m => (
                      <button key={m.id} onClick={() => { setMode(m.id); if (m.id === 'auto') setSelectedBot(null); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                        style={mode === m.id ? { background: theme.gold, color: '#fff' } : { background: theme.inputBg, color: theme.textSecondary }}>
                        <span>{m.icon}</span> {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expert Bot Selection */}
                {mode === 'expert' && bots.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium mb-1.5" style={{ color: theme.textSecondary }}>{t.ai_select_expert || 'Uzman Seçin'}</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {bots.map(bot => (
                        <button key={bot.id} onClick={() => setSelectedBot(bot.id)}
                          className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg text-[9px] transition-all"
                          style={selectedBot === bot.id
                            ? { background: `${bot.color}20`, color: bot.color, border: `1px solid ${bot.color}40` }
                            : { background: theme.inputBg, color: theme.textSecondary, border: '1px solid transparent' }}>
                          <span className="text-sm">{bot.icon}</span>
                          <span className="font-medium leading-tight text-center">{bot.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level */}
                <div>
                  <p className="text-[10px] font-medium mb-1.5" style={{ color: theme.textSecondary }}>{t.ai_knowledge_level || 'Bilgi Seviyesi'}</p>
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
              {t.ai_welcome || 'Selam'}, {user?.name?.split(' ')[0] || (t.ai_welcome === 'السلام عليكم' ? '' : 'Kardeşim')}
            </h2>
            <p className="text-xs mb-2" style={{ color: theme.textSecondary }}>
              5 Uzman Bot: Fıkıh · Tefsir · Hadis · Akaid · Mukayese
            </p>

            {/* Bot showcase */}
            {bots.length > 0 && (
              <div className="flex justify-center gap-2 mb-4">
                {bots.map(bot => (
                  <motion.button key={bot.id} whileTap={{ scale: 0.9 }}
                    onClick={() => { setMode('expert'); setSelectedBot(bot.id); setShowSettings(false); }}
                    className="flex flex-col items-center gap-0.5 p-2 rounded-xl w-14"
                    style={{ background: `${bot.color}10` }}>
                    <span className="text-lg">{bot.icon}</span>
                    <span className="text-[7px] font-medium leading-tight text-center" style={{ color: bot.color }}>{bot.name.split(' ')[0]}</span>
                  </motion.button>
                ))}
              </div>
            )}

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
          <ChatBubble key={i} msg={msg} theme={theme} index={i} t={t}
            onRetry={msg.isError ? retryLastMessage : undefined} />
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" style={{ color: theme.gold }} />
                <span className="text-xs" style={{ color: theme.textSecondary }}>
                  {mode === 'auto' ? (t.ai_experts_analyzing || 'Uzmanlar analiz ediyor...') : (t.thinking || 'Düşünüyorum...')}
                </span>
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
            <span className="text-[11px] flex-1" style={{ color: theme.gold }}>{t.ai_premium_limit || 'Günlük limit doldu. Premium ile sınırsız sorun!'}</span>
            <Crown size={14} style={{ color: theme.gold }} />
          </motion.div>
        )}
        {/* Active bot indicator */}
        {mode === 'expert' && selectedBot && (
          <div className="flex items-center gap-1.5 mb-1.5 px-1">
            <span className="text-xs">{bots.find(b => b.id === selectedBot)?.icon}</span>
            <span className="text-[10px] font-medium" style={{ color: bots.find(b => b.id === selectedBot)?.color || theme.gold }}>
              {bots.find(b => b.id === selectedBot)?.name}
            </span>
            <button onClick={() => { setMode('auto'); setSelectedBot(null); }} className="text-[9px] ml-auto" style={{ color: theme.textSecondary }}>
              {t.ai_switch_auto || 'Otomatiğe geç'}
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
          style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}` }}>
          <input ref={inputRef} type="text" value={input}
            onChange={e => { if (e.target.value.length <= 2000) setInput(e.target.value); }}
            placeholder={limitReached ? (t.ai_premium_unlock || "Premium'a geçin...") : (t.ask_question || "Sorunuzu yazın...")}
            disabled={limitReached}
            data-testid="chat-input"
            className="flex-1 bg-transparent text-sm focus:outline-none disabled:opacity-50"
            style={{ color: theme.textPrimary }} />
          {input.length > 1500 && (
            <span className="text-[9px] shrink-0" style={{ color: input.length > 1900 ? '#ef4444' : theme.textSecondary }}>
              {input.length}/2000
            </span>
          )}
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
