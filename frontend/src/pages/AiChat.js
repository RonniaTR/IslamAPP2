import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, ChevronLeft, Bot, Mic, MicOff, Volume2, Square, Flag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../components/ui/Typography';
import { aiResponses, getAiResponse } from '../data/aiResponses';
import { reportAnswer, deviceSessionId, REPORT_REASONS } from '../services/aiReports';
import HalPusulasi from '../components/ai/HalPusulasi';

export default function AiChat() {
  const navigate = useNavigate();
  // Asistana hesap kimliği gönderilmez; yalnız bu cihaza ait rastgele bir oturum anahtarı (gizlilik metni 2. bölüm).
  const userId = deviceSessionId();
  const [reporting, setReporting] = useState(null);   // bildirilen mesajın id'si
  const [reported, setReported] = useState({});        // id → true

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Selamun Aleyküm! Ben senin kişisel İslami asistanınım. Bugün sana nasıl yardımcı olabilirim?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Init Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'tr-TR';

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInputValue(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setInputValue("");
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Tarayıcınız sesli girişi desteklemiyor.");
      }
    }
  };

  const playTTS = (msgId, text) => {
    if (playingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setPlayingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*/g, ''));
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95;
    
    utterance.onend = () => {
      setPlayingMessageId(null);
    };
    
    setPlayingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 1 || isTyping) scrollToBottom();   // açılışta en üstte kal: hoş geldin + Hâl Pusulası görünsün
  }, [messages, isTyping]);

  const handleSend = async (hazirMetin, hal) => {
    const metin = typeof hazirMetin === 'string' ? hazirMetin : inputValue;
    if (!metin.trim()) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg = { id: Date.now(), sender: 'user', text: metin, hal: hal ? hal.ad : undefined };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const responseText = await getAiResponse(userMsg.text, userId);
    
    const aiMsgId = Date.now();
    setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: responseText, question: userMsg.text }]);
    setIsTyping(false);

    // Optional: auto-play the response
    // playTTS(aiMsgId, responseText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handlePromptClick = (promptText) => {
    setInputValue(promptText);
  };

  return (
    // Sohbet her temada koyu zeminde durur: mesaj yazıları beyaz olduğu için açık temada okunmuyordu.
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #072A20 0%, #04170F 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', background: 'rgba(5, 42, 30, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(46, 204, 113, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(46, 204, 113, 0.5)' }}>
          <Sparkles size={20} color="#2ECC71" />
        </div>
        <div>
          <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 700, fontSize: '16px', marginBottom: '2px' }}>AI Asistan</Typography>
          <Typography variant="caption" style={{ color: '#2ECC71', fontSize: '12px', fontWeight: 600 }}>Çevrimiçi</Typography>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 120px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <p data-testid="ai-disclaimer" style={{ margin: 0, padding: '10px 14px', borderRadius: 14, background: 'rgba(205,164,52,0.1)', border: '1px solid rgba(205,164,52,0.25)', color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.5 }}>
          Cevaplar yapay zekâ ile üretilir ve yanlış olabilir; fetva yerine geçmez. Önemli dinî konularda Diyanet'e (Alo 190) ya da bir hocaya danış. Kişisel bilgilerini yazma.
        </p>
        
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={msg.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexDirection: isAi ? 'row' : 'row-reverse' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: isAi ? 'rgba(46, 204, 113, 0.2)' : 'rgba(205, 164, 52, 0.2)',
                border: `1px solid ${isAi ? 'rgba(46, 204, 113, 0.5)' : 'rgba(205, 164, 52, 0.5)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {isAi ? <Bot size={16} color="#2ECC71" /> : <User size={16} color="#CDA434" />}
              </div>
              <div style={{
                background: isAi ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, rgba(205, 164, 52, 0.2) 0%, rgba(140, 108, 46, 0.1) 100%)',
                border: `1px solid ${isAi ? 'rgba(255,255,255,0.1)' : 'rgba(205, 164, 52, 0.3)'}`,
                borderRadius: isAi ? '0 20px 20px 20px' : '20px 0 20px 20px',
                padding: '16px', maxWidth: '80%', position: 'relative'
              }}>
                {msg.hal && <span style={{ display: 'inline-block', marginBottom: 6, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#D8B76A' }}>✦ {msg.hal}</span>}
                <Typography variant="bodySmall" style={{ color: '#FFF', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {msg.text.split('**').map((part, i) => i % 2 !== 0 ? <strong key={i} style={{ color: '#CDA434' }}>{part}</strong> : part)}
                </Typography>
                
                {isAi && msg.question && (
                  <div style={{ marginTop: 10 }}>
                    {reported[msg.id] ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#2ECC71', fontWeight: 600 }}>
                        <Check size={14} /> Bildirildi, teşekkürler.
                      </span>
                    ) : reporting === msg.id ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }} data-testid="ai-report-reasons">
                        {REPORT_REASONS.map((r) => (
                          <button key={r.id} type="button"
                            onClick={async () => { await reportAnswer({ question: msg.question, answer: msg.text, reason: r.id }); setReported((m) => ({ ...m, [msg.id]: true })); setReporting(null); }}
                            style={{ minHeight: 34, padding: '0 12px', borderRadius: 17, fontSize: 12, fontWeight: 600, color: '#FFF', background: 'rgba(231,76,60,0.18)', border: '1px solid rgba(231,76,60,0.45)', cursor: 'pointer' }}>
                            {r.label}
                          </button>
                        ))}
                        <button type="button" onClick={() => setReporting(null)} style={{ minHeight: 34, padding: '0 10px', fontSize: 12, color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>Vazgeç</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setReporting(msg.id)} data-testid="ai-report"
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: 0 }}>
                        <Flag size={13} /> Bu cevabı bildir
                      </button>
                    )}
                  </div>
                )}

                {isAi && (
                  <button 
                    onClick={() => playTTS(msg.id, msg.text)}
                    style={{
                      background: 'none', border: 'none', color: playingMessageId === msg.id ? '#CDA434' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600
                    }}
                  >
                    {playingMessageId === msg.id ? <Square size={14} /> : <Volume2 size={14} />}
                    {playingMessageId === msg.id ? "Durdur" : "Sesli Dinle"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {messages.length === 1 && <HalPusulasi onSor={(q, hal) => handleSend(q, hal)} />}

        {messages.length === 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {aiResponses.prompts.map((prompt, index) => (
              <button 
                key={index}
                onClick={() => handlePromptClick(prompt)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '100px', padding: '8px 16px', color: '#FFF', fontSize: '12px',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'start'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: 'rgba(46, 204, 113, 0.2)', border: '1px solid rgba(46, 204, 113, 0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Bot size={16} color="#2ECC71" />
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0 20px 20px 20px', padding: '16px', display: 'flex', gap: '4px'
            }}>
              <div style={{ width: '6px', height: '6px', background: '#2ECC71', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
              <div style={{ width: '6px', height: '6px', background: '#2ECC71', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
              <div style={{ width: '6px', height: '6px', background: '#2ECC71', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="md:left-[260px]" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20, padding: '16px 20px calc(104px + env(safe-area-inset-bottom))', background: '#05261B', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          <button 
            onClick={toggleListen}
            style={{ 
              background: isListening ? 'rgba(231, 76, 60, 0.2)' : 'none', 
              border: isListening ? '1px solid #E74C3C' : 'none', 
              color: isListening ? '#E74C3C' : 'rgba(255,255,255,0.5)', 
              borderRadius: '50%', cursor: 'pointer', padding: '8px',
              transition: 'all 0.2s',
              animation: isListening ? 'pulse 1.5s infinite' : 'none'
            }}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <input 
            type="text" 
            placeholder={isListening ? "Sizi dinliyorum..." : "İslami asistanına bir şey sor..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1, padding: '16px 20px', borderRadius: '24px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#FFF', fontSize: '15px', outline: 'none'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: inputValue.trim() && !isTyping ? '#CDA434' : 'rgba(255,255,255,0.1)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            <Send size={20} color={inputValue.trim() && !isTyping ? '#000' : 'rgba(255,255,255,0.3)'} style={{ marginInlineStart: '4px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
