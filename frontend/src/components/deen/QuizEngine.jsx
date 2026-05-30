import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/DeenConnect.css';
import { startSoloQuizSession, submitSoloAnswer, finishSoloQuiz } from '../../services/quizService';

export default function QuizEngine() {
  const [session, setSession] = useState(null);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => { init(); }, []);

  async function init() {
    const s = await startSoloQuizSession('guest', 'kuran', 5);
    setSession(s);
  }

  if (!session) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#032212' }}><div style={{ color: '#f7e6ae' }}>Yükleniyor...</div></div>;

  const q = session.questions[idx];

  const handleNext = async (ans) => {
    try {
      const res = await submitSoloAnswer(session.session_id, idx, ans, 5);
      setFeedback(res.correct ? 'Doğru!' : 'Yanlış');
      const next = idx + 1;
      if (next >= session.questions.length) {
        await finishSoloQuiz(session.session_id);
        // navigate to success screen
        window.location.href = '/quiz/success?xp=150';
        return;
      }
      setTimeout(() => { setFeedback(null); setIdx(next); }, 900);
    } catch (e) { setFeedback('Bir hata oluştu'); }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: '#032212' }}>
      <div className="card-deen-glass p-5 mb-6">
        <div className="flex items-center justify-between">
          <div style={{ color: '#f7e6ae', fontWeight: 800 }}>Soru {idx + 1} / {session.questions.length}</div>
          <div style={{ color: '#a8b5a0' }}>{q.type === 'swipe' ? 'Doğru / Yanlış' : '4 Şıklı'}</div>
        </div>
      </div>

      <motion.div className="card-deen-glass p-6 mb-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120 }}>
        <h3 style={{ color: '#f7e6ae', fontWeight: 800, fontSize: 20 }}>{q.question}</h3>
        {q.type === 'swipe' ? (
          <div style={{ marginTop: 16 }}>
            <button className="btn-deen-primary" onClick={() => handleNext(1)} style={{ marginRight: 12 }}>Doğru</button>
            <button className="btn-deen-secondary" onClick={() => handleNext(0)}>Yanlış</button>
          </div>
        ) : (
          <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
            {q.options.map((o, i) => <button key={i} className="btn-deen-secondary" onClick={() => handleNext(i)}>{o}</button>)}
          </div>
        )}
        {feedback && <div style={{ marginTop: 14, color: '#ffd369', fontWeight: 800 }}>{feedback}</div>}
      </motion.div>
    </div>
  );
}
