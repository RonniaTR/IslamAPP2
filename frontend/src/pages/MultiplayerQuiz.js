import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Copy, Play, Trophy, Clock, ArrowLeft, Check, X, Loader, Zap, Crown, Share2, Wifi } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';
const WS_URL = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');

export default function MultiplayerQuiz() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [view, setView] = useState('lobby'); // lobby, waiting, game, result
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [question, setQuestion] = useState(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [timer, setTimer] = useState(15);
  const [scores, setScores] = useState({});
  const [results, setResults] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selCategory, setSelCategory] = useState('mixed');
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const timerRef = useRef(null);
  const uid = user?.user_id || user?.id || 'guest';

  useEffect(() => {
    api.get('/quiz/categories').then(r => setCategories(r.data || [])).catch(() => {});
    loadRooms();
  }, []);

  const loadRooms = () => {
    api.get('/quiz/rooms').then(r => setRooms(Array.isArray(r.data) ? r.data : [])).catch(() => setRooms([]));
  };

  // WebSocket bağlantısı
  const connectWS = useCallback((roomId) => {
    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket(`${WS_URL}/api/quiz/ws/${roomId}/${uid}`);
    wsRef.current = ws;

    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        switch (msg.type) {
          case 'player_joined':
          case 'player_left':
            setCurrentRoom(prev => prev ? { ...prev, players: msg.players || prev.players } : prev);
            break;
          case 'game_start':
            setView('game');
            setQuestionIdx(0);
            setTotalQuestions(msg.total_questions || 10);
            break;
          case 'question':
            setQuestion(msg.question);
            setQuestionIdx(msg.index || 0);
            setSelected(null);
            setCorrect(null);
            setTimer(15);
            break;
          case 'answer_result':
            setCorrect(msg.correct_answer);
            setScores(msg.scores || {});
            break;
          case 'game_end':
            setResults(msg);
            setView('result');
            break;
          default: break;
        }
      } catch {}
    };
  }, [uid]);

  useEffect(() => {
    return () => { if (wsRef.current) wsRef.current.close(); clearInterval(timerRef.current); };
  }, []);

  // Timer
  useEffect(() => {
    clearInterval(timerRef.current);
    if (view === 'game' && question && selected === null) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); handleAnswer(-1); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [question, view, selected]);

  const createRoom = async () => {
    if (!roomName.trim()) { setError('Oda adı girin'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/quiz/rooms/create', {
        name: roomName.trim(), category: selCategory, host_id: uid, host_name: user?.name || 'Anonim'
      });
      setCurrentRoom(data);
      connectWS(data.id || data.room_id);
      setView('waiting');
    } catch (e) { setError('Oda oluşturulamadı'); }
    setLoading(false);
  };

  const joinRoom = async (roomId) => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post(`/quiz/rooms/${roomId}/join`, { user_id: uid, user_name: user?.name || 'Anonim' });
      setCurrentRoom(data);
      connectWS(roomId);
      setView('waiting');
    } catch (e) { setError('Odaya katılınamadı'); }
    setLoading(false);
  };

  const startGame = async () => {
    if (!currentRoom) return;
    try {
      await api.post(`/quiz/rooms/${currentRoom.id || currentRoom.room_id}/start`);
    } catch (e) { setError('Oyun başlatılamadı'); }
  };

  const handleAnswer = async (optIdx) => {
    if (selected !== null || !currentRoom) return;
    setSelected(optIdx);
    clearInterval(timerRef.current);
    try {
      await api.post(`/quiz/rooms/${currentRoom.id || currentRoom.room_id}/answer`, {
        user_id: uid, answer_index: optIdx, time_taken: 15 - timer
      });
    } catch {}
  };

  const shareRoom = () => {
    const id = currentRoom?.id || currentRoom?.room_id;
    const text = `🕌 İslami Quiz'e katıl!\nOda: ${currentRoom?.name}\nKod: ${id}\n\nhttps://islamapp-5942a.web.app/multiplayer`;
    if (navigator.share) navigator.share({ title: 'Quiz Daveti', text }).catch(() => {});
    else navigator.clipboard.writeText(text).catch(() => {});
  };

  // ─── LOBBY ───
  if (view === 'lobby') return (
    <div className="min-h-screen pb-4" style={{ background: theme.bg }}>
      <div className="px-4 pt-6 pb-4" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/quiz')} className="p-2 rounded-xl" style={{ background: theme.inputBg }}><ArrowLeft size={18} style={{ color: theme.textPrimary }} /></button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>Multiplayer Quiz</h1>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Arkadaşlarınla yarış!</p>
          </div>
          <Users size={24} className="ml-auto" style={{ color: theme.gold }} />
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Oda Oluştur */}
        <div className="rounded-xl p-4 border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: theme.gold }}>
            <Plus size={16} /> Yeni Oda Oluştur
          </h3>
          <input value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Oda adı..."
            className="w-full rounded-lg px-3 py-2 text-sm mb-2 outline-none"
            style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary }} />
          <div className="flex gap-2 flex-wrap mb-3">
            <button onClick={() => setSelCategory('mixed')}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{ background: selCategory === 'mixed' ? theme.gold : theme.inputBg, color: selCategory === 'mixed' ? '#000' : theme.textSecondary }}>
              Karışık
            </button>
            {categories.slice(0, 5).map(c => (
              <button key={c.id} onClick={() => setSelCategory(c.id)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{ background: selCategory === c.id ? theme.gold : theme.inputBg, color: selCategory === c.id ? '#000' : theme.textSecondary }}>
                {c.name}
              </button>
            ))}
          </div>
          <button onClick={createRoom} disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{ background: theme.gold, color: '#000' }}>
            {loading ? <Loader size={16} className="animate-spin" /> : <Play size={16} />} Oda Oluştur
          </button>
        </div>

        {/* Odaya Katıl */}
        <div className="rounded-xl p-4 border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: theme.gold }}>
            <Users size={16} /> Odaya Katıl
          </h3>
          <div className="flex gap-2">
            <input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="Oda kodu..."
              className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary }} />
            <button onClick={() => joinCode && joinRoom(joinCode)} disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: theme.gold, color: '#000' }}>Katıl</button>
          </div>
        </div>

        {/* Açık Odalar */}
        {rooms.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: theme.textPrimary }}>
              <Wifi size={14} style={{ color: theme.gold }} /> Açık Odalar
            </h3>
            <div className="space-y-2">
              {rooms.filter(r => r.status === 'waiting').map(r => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl p-3 border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${theme.gold}20` }}>
                    <Users size={18} style={{ color: theme.gold }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: theme.textPrimary }}>{r.name}</div>
                    <div className="text-[11px]" style={{ color: theme.textSecondary }}>{(r.players || []).length} oyuncu</div>
                  </div>
                  <button onClick={() => joinRoom(r.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: theme.gold, color: '#000' }}>Katıl</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-xs text-center text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );

  // ─── WAITING ROOM ───
  if (view === 'waiting') {
    const roomId = currentRoom?.id || currentRoom?.room_id;
    const players = currentRoom?.players || [];
    const isHost = currentRoom?.host_id === uid;
    return (
      <div className="min-h-screen pb-4" style={{ background: theme.bg }}>
        <div className="px-4 pt-6 pb-6 text-center" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: `${theme.gold}20` }}>
            <Users size={28} style={{ color: theme.gold }} />
          </div>
          <h2 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{currentRoom?.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs px-3 py-1 rounded-full font-mono" style={{ background: theme.inputBg, color: theme.gold }}>{roomId}</span>
            <button onClick={() => { navigator.clipboard.writeText(roomId); }} className="p-1.5 rounded-lg" style={{ background: theme.inputBg }}>
              <Copy size={14} style={{ color: theme.textSecondary }} />
            </button>
            <button onClick={shareRoom} className="p-1.5 rounded-lg" style={{ background: theme.inputBg }}>
              <Share2 size={14} style={{ color: theme.textSecondary }} />
            </button>
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-[10px]" style={{ color: theme.textSecondary }}>{wsConnected ? 'Bağlı' : 'Bağlanıyor...'}</span>
          </div>
        </div>

        <div className="px-4 mt-4 space-y-3">
          <h3 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>Oyuncular ({players.length})</h3>
          {players.map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-3 border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: `${theme.gold}20` }}>
                {i === 0 ? '👑' : '🧑'}
              </div>
              <span className="text-sm font-medium flex-1" style={{ color: theme.textPrimary }}>{p.name || p.user_name || 'Oyuncu'}</span>
              {p.user_id === currentRoom?.host_id && <Crown size={14} style={{ color: theme.gold }} />}
            </div>
          ))}

          {isHost && (
            <button onClick={startGame} disabled={players.length < 1}
              className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-4 transition-all"
              style={{ background: theme.gold, color: '#000', opacity: players.length < 1 ? 0.5 : 1 }}>
              <Play size={18} /> Oyunu Başlat
            </button>
          )}
          {!isHost && <p className="text-center text-xs mt-4" style={{ color: theme.textSecondary }}>Oda sahibinin oyunu başlatması bekleniyor...</p>}
        </div>
      </div>
    );
  }

  // ─── GAME ───
  if (view === 'game' && question) {
    const options = question.options || [];
    return (
      <div className="min-h-screen pb-4" style={{ background: theme.bg }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3" style={{ background: theme.surface }}>
          <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>Soru {questionIdx + 1}/{totalQuestions}</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: timer <= 5 ? '#EF444420' : `${theme.gold}20` }}>
            <Clock size={14} style={{ color: timer <= 5 ? '#EF4444' : theme.gold }} />
            <span className="text-sm font-bold" style={{ color: timer <= 5 ? '#EF4444' : theme.gold }}>{timer}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={14} style={{ color: theme.gold }} />
            <span className="text-xs font-medium" style={{ color: theme.gold }}>{scores[uid] || 0}</span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full h-1" style={{ background: theme.inputBg }}>
          <div className="h-full transition-all duration-1000" style={{ width: `${(timer / 15) * 100}%`, background: timer <= 5 ? '#EF4444' : theme.gold }} />
        </div>

        {/* Question */}
        <div className="px-4 mt-6">
          <div className="rounded-xl p-4 mb-6 border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
            <p className="text-sm font-medium leading-relaxed" style={{ color: theme.textPrimary }}>{question.question || question.text}</p>
          </div>

          <div className="space-y-3">
            {options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = correct === i;
              const isWrong = isSelected && correct !== null && correct !== i;
              let bg = theme.cardBg, border = theme.cardBorder, textColor = theme.textPrimary;
              if (isCorrect) { bg = '#10B98120'; border = '#10B981'; textColor = '#10B981'; }
              else if (isWrong) { bg = '#EF444420'; border = '#EF4444'; textColor = '#EF4444'; }
              else if (isSelected) { bg = `${theme.gold}20`; border = theme.gold; }

              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                  className="w-full flex items-center gap-3 rounded-xl p-3.5 border text-left transition-all"
                  style={{ background: bg, borderColor: border }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: isCorrect ? '#10B981' : isWrong ? '#EF4444' : isSelected ? theme.gold : theme.inputBg,
                      color: (isCorrect || isWrong || isSelected) ? '#fff' : theme.textSecondary }}>
                    {isCorrect ? <Check size={14} /> : isWrong ? <X size={14} /> : String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm" style={{ color: textColor }}>{typeof opt === 'string' ? opt : opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live scores */}
        {correct !== null && Object.keys(scores).length > 0 && (
          <div className="px-4 mt-4">
            <div className="rounded-xl p-3 border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
              <h4 className="text-xs font-semibold mb-2" style={{ color: theme.textSecondary }}>Anlık Skor</h4>
              {Object.entries(scores).sort(([,a], [,b]) => b - a).map(([id, score], i) => (
                <div key={id} className="flex items-center justify-between py-1">
                  <span className="text-xs" style={{ color: id === uid ? theme.gold : theme.textPrimary }}>{id === uid ? 'Sen' : `Oyuncu ${i + 1}`}</span>
                  <span className="text-xs font-bold" style={{ color: theme.gold }}>{score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── RESULT ───
  if (view === 'result') {
    const finalScores = results?.scores || scores;
    const sorted = Object.entries(finalScores).sort(([,a], [,b]) => b - a);
    const myRank = sorted.findIndex(([id]) => id === uid) + 1;
    const myScore = finalScores[uid] || 0;
    const medals = ['🥇', '🥈', '🥉'];

    return (
      <div className="min-h-screen pb-4" style={{ background: theme.bg }}>
        <div className="px-4 pt-8 pb-6 text-center" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
          <div className="text-5xl mb-3">{myRank === 1 ? '🏆' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🎯'}</div>
          <h2 className="text-xl font-bold" style={{ color: theme.gold }}>{myRank === 1 ? 'Birinci oldun!' : `${myRank}. sırada tamamladın`}</h2>
          <p className="text-3xl font-bold mt-2" style={{ color: theme.textPrimary }}>{myScore} puan</p>
        </div>

        <div className="px-4 mt-4 space-y-2">
          <h3 className="text-sm font-semibold mb-2" style={{ color: theme.textPrimary }}>Sonuçlar</h3>
          {sorted.map(([id, score], i) => (
            <div key={id} className={`flex items-center gap-3 rounded-xl p-3 border ${id === uid ? 'ring-1' : ''}`}
              style={{ background: id === uid ? `${theme.gold}10` : theme.cardBg, borderColor: id === uid ? theme.gold : theme.cardBorder }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: `${theme.gold}20` }}>
                {i < 3 ? medals[i] : i + 1}
              </div>
              <span className="flex-1 text-sm font-medium" style={{ color: theme.textPrimary }}>{id === uid ? 'Sen' : `Oyuncu ${i + 1}`}</span>
              <span className="text-sm font-bold" style={{ color: theme.gold }}>{score}</span>
            </div>
          ))}
        </div>

        <div className="px-4 mt-6 flex gap-3">
          <button onClick={() => { setView('lobby'); setCurrentRoom(null); setResults(null); }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: theme.inputBg, color: theme.textPrimary }}>Lobiye Dön</button>
          <button onClick={() => navigate('/quiz')}
            className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: theme.gold, color: '#000' }}>Solo Quiz</button>
        </div>
      </div>
    );
  }

  // Loading fallback
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
      <Loader className="animate-spin" style={{ color: theme.gold }} />
    </div>
  );
}
