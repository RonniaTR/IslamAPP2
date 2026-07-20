import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Copy, Play, Trophy, Clock, ArrowLeft, Check, X, Loader, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../services/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export default function MultiplayerQuiz() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [view, setView] = useState('lobby'); // lobby, waiting, game, result
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomData, setRoomData] = useState(null);
  
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(15);
  
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const uid = user?.uid || 'guest_' + Math.floor(Math.random()*1000);
  const userName = user?.displayName || user?.name || 'Oyuncu ' + Math.floor(Math.random()*100);

  const mockQuestions = [
    { question: "Kur'an-ı Kerim'in en uzun suresi hangisidir?", options: ["Yasin", "Bakara", "Ali İmran", "Nisa"], answer: 1 },
    { question: "Peygamber Efendimiz (sav) kaç yılında doğmuştur?", options: ["571", "622", "632", "610"], answer: 0 },
    { question: "Hangi melek vahiy getirmekle görevlidir?", options: ["Mikail", "İsrafil", "Cebrail", "Azrail"], answer: 2 },
    { question: "İslam'ın şartı kaçtır?", options: ["4", "5", "6", "7"], answer: 1 }
  ];

  useEffect(() => {
    // Load Active Rooms
    const q = query(collection(db, 'quiz_rooms'), where('state', '==', 'waiting'));
    const unsub = onSnapshot(q, (snap) => {
      const rm = [];
      snap.forEach(doc => rm.push({ id: doc.id, ...doc.data() }));
      setRooms(rm);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!currentRoom) return;
    const unsub = onSnapshot(doc(db, 'quiz_rooms', currentRoom), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomData(data);
        setView(data.state === 'playing' ? 'game' : data.state === 'finished' ? 'result' : 'waiting');
        setQuestionIdx(data.currentQuestionIndex);
        setTimer(data.timer);
      } else {
        setError('Oda kapatıldı.');
        setView('lobby');
        setCurrentRoom(null);
      }
    });
    return () => unsub();
  }, [currentRoom]);

  // Host Timer Management
  useEffect(() => {
    let interval;
    if (roomData && roomData.state === 'playing' && roomData.hostId === uid && roomData.timer > 0) {
      interval = setInterval(() => {
        updateDoc(doc(db, 'quiz_rooms', currentRoom), { timer: roomData.timer - 1 });
      }, 1000);
    } else if (roomData && roomData.state === 'playing' && roomData.hostId === uid && roomData.timer === 0) {
      // Time is up, move to next question or finish
      setTimeout(() => {
        if (roomData.currentQuestionIndex + 1 < roomData.questions.length) {
          updateDoc(doc(db, 'quiz_rooms', currentRoom), { 
            currentQuestionIndex: roomData.currentQuestionIndex + 1,
            timer: 15
          });
        } else {
          updateDoc(doc(db, 'quiz_rooms', currentRoom), { state: 'finished' });
        }
      }, 2000); // 2 sec delay between questions
    }
    return () => clearInterval(interval);
  }, [roomData, currentRoom, uid]);

  // Reset selection when question changes
  useEffect(() => {
    setSelected(null);
  }, [questionIdx]);

  const createRoom = async () => {
    if (!roomName.trim()) { setError('Oda adı girin'); return; }
    setLoading(true); setError('');
    const roomId = 'room_' + Math.floor(Math.random() * 90000 + 10000);
    try {
      await setDoc(doc(db, 'quiz_rooms', roomId), {
        name: roomName.trim(),
        hostId: uid,
        state: 'waiting', // waiting, playing, finished
        currentQuestionIndex: 0,
        timer: 15,
        players: { [uid]: { name: userName, score: 0 } },
        questions: mockQuestions.sort(() => 0.5 - Math.random()).slice(0, 4)
      });
      setCurrentRoom(roomId);
    } catch (e) { setError('Oda oluşturulamadı'); }
    setLoading(false);
  };

  const joinRoom = async (roomId) => {
    setLoading(true); setError('');
    try {
      const d = await getDoc(doc(db, 'quiz_rooms', roomId));
      if (d.exists() && d.data().state === 'waiting') {
        await updateDoc(doc(db, 'quiz_rooms', roomId), {
          [`players.${uid}`]: { name: userName, score: 0 }
        });
        setCurrentRoom(roomId);
      } else {
        setError('Oda dolu veya başlamış');
      }
    } catch (e) { setError('Odaya katılınamadı'); }
    setLoading(false);
  };

  const startGame = async () => {
    if (roomData?.hostId === uid) {
      await updateDoc(doc(db, 'quiz_rooms', currentRoom), { state: 'playing', timer: 15 });
    }
  };

  const handleAnswer = async (optIdx) => {
    if (selected !== null || !roomData) return;
    setSelected(optIdx);
    
    const currentQ = roomData.questions[roomData.currentQuestionIndex];
    if (optIdx === currentQ.answer) {
      // Correct! +10 points + bonus for time
      const scoreGain = 10 + Math.floor(roomData.timer / 2);
      await updateDoc(doc(db, 'quiz_rooms', currentRoom), {
        [`players.${uid}.score`]: roomData.players[uid].score + scoreGain
      });
    }
  };

  // --- RENDERS ---
  if (view === 'lobby') return (
    <div className="min-h-screen pb-4" style={{ background: theme.bg }}>
      <div className="px-4 pt-6 pb-4" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl" style={{ background: theme.inputBg }}><ArrowLeft size={18} style={{ color: theme.textPrimary }} /></button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>Multiplayer Quiz</h1>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Arkadaşlarınla canlı yarış!</p>
          </div>
          <Users size={24} className="ml-auto" style={{ color: theme.gold }} />
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {error && <div className="p-3 bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold">{error}</div>}
        
        <div className="rounded-xl p-4 border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: theme.gold }}>Yeni Oda Oluştur</h3>
          <input value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Oda adı..."
            className="w-full rounded-lg px-3 py-2 text-sm mb-3 outline-none"
            style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary }} />
          <button onClick={createRoom} disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{ background: theme.gold, color: '#000' }}>
            {loading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />} Oda Oluştur
          </button>
        </div>

        <h3 className="text-sm font-bold mt-6" style={{ color: theme.textSecondary }}>Açık Odalar</h3>
        {rooms.length === 0 ? (
          <p className="text-center text-sm py-8" style={{ color: theme.textSecondary }}>Henüz açık bir oda yok.</p>
        ) : rooms.map(r => (
          <div key={r.id} className="flex items-center justify-between p-4 rounded-xl border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
            <div>
              <p className="font-bold text-sm" style={{ color: theme.textPrimary }}>{r.name}</p>
              <p className="text-xs flex items-center gap-1" style={{ color: theme.textSecondary }}>
                <Users size={12}/> {Object.keys(r.players || {}).length} Oyuncu
              </p>
            </div>
            <button onClick={() => joinRoom(r.id)} disabled={loading}
              className="px-4 py-1.5 rounded-lg text-sm font-bold"
              style={{ background: 'rgba(46, 204, 113, 0.2)', color: '#2ECC71' }}>Katıl</button>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === 'waiting' && roomData) return (
    <div className="min-h-screen flex flex-col p-6 items-center justify-center text-center" style={{ background: theme.bg }}>
      <Trophy size={64} className="mb-6 animate-pulse" style={{ color: theme.gold }} />
      <h2 className="text-2xl font-bold mb-2" style={{ color: theme.textPrimary }}>{roomData.name}</h2>
      <p className="mb-8" style={{ color: theme.textSecondary }}>Oda Kodu: <span className="font-mono font-bold text-white">{currentRoom}</span></p>

      <div className="w-full max-w-sm bg-[#132A1D] rounded-2xl p-4 mb-8">
        <h3 className="font-bold text-sm mb-4" style={{ color: theme.gold }}>Katılan Oyuncular</h3>
        <div className="space-y-2">
          {Object.entries(roomData.players || {}).map(([id, p]) => (
            <div key={id} className="flex justify-between p-2 rounded-lg bg-[#0A1A12] border border-[#1A3826]">
              <span className="font-semibold text-sm" style={{ color: theme.textPrimary }}>{p.name} {id === roomData.hostId && '(Kurucu)'}</span>
              {id === uid && <span className="text-xs bg-[#10b981] px-2 py-0.5 rounded-full text-black font-bold">Sen</span>}
            </div>
          ))}
        </div>
      </div>

      {roomData.hostId === uid ? (
        <button onClick={startGame} className="w-full max-w-sm py-3 rounded-xl font-bold shadow-lg" style={{ background: theme.gold, color: '#000' }}>
          Oyunu Başlat
        </button>
      ) : (
        <p className="text-sm animate-pulse" style={{ color: theme.gold }}>Kurucunun oyunu başlatması bekleniyor...</p>
      )}
    </div>
  );

  const q = roomData?.questions[questionIdx];

  if (view === 'game' && q) return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bg }}>
      {/* Top Bar */}
      <div className="px-6 py-4 flex justify-between items-center bg-[#132A1D] border-b border-[#1A3826]">
        <div className="flex gap-2">
          {Object.values(roomData.players || {}).map((p, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400">{p.name}</span>
              <span className="text-xs font-bold text-[#CDA434]">{p.score}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 font-mono font-bold text-xl px-4 py-1 rounded-full border border-red-500/30"
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
          <Clock size={18} /> {timer}s
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col p-6 items-center justify-center max-w-lg mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-10 leading-tight" style={{ color: theme.textPrimary }}>{q.question}</h2>
        
        <div className="w-full space-y-3">
          {q.options.map((opt, idx) => {
            let bg = theme.inputBg;
            let border = theme.inputBorder;
            let color = theme.textPrimary;
            
            // Time up -> Show correct answer
            if (timer === 0) {
              if (idx === q.answer) {
                bg = 'rgba(46, 204, 113, 0.2)'; border = '#2ECC71'; color = '#2ECC71';
              } else if (selected === idx) {
                bg = 'rgba(231, 76, 60, 0.2)'; border = '#E74C3C'; color = '#E74C3C';
              }
            } else if (selected === idx) {
              bg = 'rgba(205, 164, 52, 0.2)'; border = '#CDA434'; color = '#CDA434';
            }

            return (
              <button key={idx} disabled={selected !== null || timer === 0} onClick={() => handleAnswer(idx)}
                className="w-full text-left p-4 rounded-xl border-2 font-semibold transition-all flex justify-between items-center"
                style={{ background: bg, borderColor: border, color }}>
                {opt}
                {timer === 0 && idx === q.answer && <Check size={20} />}
                {timer === 0 && selected === idx && idx !== q.answer && <X size={20} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (view === 'result' && roomData) {
    const sortedPlayers = Object.entries(roomData.players).sort((a, b) => b[1].score - a[1].score);
    return (
      <div className="min-h-screen flex flex-col p-6 items-center justify-center text-center" style={{ background: theme.bg }}>
        <Trophy size={80} className="mb-6" style={{ color: theme.gold }} />
        <h2 className="text-3xl font-bold mb-8" style={{ color: theme.textPrimary }}>Sonuçlar</h2>
        
        <div className="w-full max-w-sm space-y-4 mb-8">
          {sortedPlayers.map(([id, p], index) => (
            <div key={id} className={`flex justify-between items-center p-4 rounded-2xl border ${index === 0 ? 'bg-gradient-to-r from-[#CDA434]/20 to-[#10b981]/20 border-[#CDA434]' : 'bg-[#132A1D] border-[#1A3826]'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-[#CDA434] text-black' : 'bg-[#0A1A12] text-gray-400'}`}>
                  {index + 1}
                </div>
                <span className="font-bold text-lg text-white">{p.name} {id === uid && '(Sen)'}</span>
              </div>
              <span className="font-bold text-xl text-[#10b981]">{p.score} XP</span>
            </div>
          ))}
        </div>

        <button onClick={() => { setView('lobby'); setCurrentRoom(null); }} className="w-full max-w-sm py-3 rounded-xl font-bold shadow-lg" style={{ background: theme.gold, color: '#000' }}>
          Lobiye Dön
        </button>
      </div>
    );
  }

  return null;
}
