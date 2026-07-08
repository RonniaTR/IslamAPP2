import React, { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Check, X } from 'lucide-react';
import { WHEEL_CATEGORIES } from '../../data/gameData';
import { quizQuestions } from '../../data/quizData';

const SEG = 360 / WHEEL_CATEGORIES.length;

function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function slicePath(cx, cy, r, start, end) {
  const p1 = polar(cx, cy, r, start);
  const p2 = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M${cx},${cy} L${p1.x},${p1.y} A${r},${r} 0 ${large} 1 ${p2.x},${p2.y} Z`;
}

function pickQuestion(category) {
  const pool = quizQuestions.filter(q => q.category === category);
  const list = pool.length ? pool : quizQuestions;
  return list[Math.floor(Math.random() * list.length)];
}

export default function WheelGame({ theme, onXP }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [category, setCategory] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answered, setAnswered] = useState(null); // {correct, index}
  const [sessionXP, setSessionXP] = useState(0);

  const wheel = useMemo(() => WHEEL_CATEGORIES.map((c, i) => ({
    ...c,
    path: slicePath(100, 100, 96, i * SEG, (i + 1) * SEG),
    label: polar(100, 100, 62, i * SEG + SEG / 2),
  })), []);

  const spin = useCallback(() => {
    if (spinning) return;
    setQuestion(null); setAnswered(null); setCategory(null);
    const idx = Math.floor(Math.random() * WHEEL_CATEGORIES.length);
    const target = 360 * 5 - (idx * SEG + SEG / 2);
    // Mevcut turların üstüne ekleyerek her zaman ileri dön
    const base = Math.ceil(rotation / 360) * 360;
    setRotation(base + target);
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setCategory(WHEEL_CATEGORIES[idx]);
      setQuestion(pickQuestion(WHEEL_CATEGORIES[idx].name));
    }, 3600);
  }, [spinning, rotation]);

  const answer = useCallback((index) => {
    if (answered || !question) return;
    const correct = index === question.correct_index;
    setAnswered({ correct, index });
    if (correct) {
      const pts = question.points || 10;
      setSessionXP(x => x + pts);
      onXP(pts, 'game_wheel', 'Çarkıfelek');
    }
  }, [answered, question, onXP]);

  const isTF = question?.type === 'tf';
  const options = isTF ? ['Doğru', 'Yanlış'] : (question?.options || []);

  return (
    <div className="flex flex-col items-center px-4">
      <div className="text-center mb-3">
        <p className="text-xs" style={{ color: theme.textSecondary }}>Çarkı çevir, gelen kategoriden soruyu bil, XP kazan!</p>
        <p className="text-sm font-bold mt-1" style={{ color: theme.gold }}>Bu tur: {sessionXP} XP</p>
      </div>

      {/* Çark */}
      <div className="relative w-[280px] h-[300px] flex items-start justify-center">
        {/* Gösterge (üst ok) */}
        <div className="absolute top-0 z-20" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
          <svg width="28" height="24" viewBox="0 0 28 24"><path d="M14 24 L2 2 L26 2 Z" fill={theme.gold} /></svg>
        </div>
        <div className="mt-6">
          <motion.svg width="280" height="280" viewBox="0 0 200 200"
            animate={{ rotate: rotation }} transition={{ duration: 3.6, ease: [0.15, 0.6, 0.2, 1] }}
            style={{ filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.4))' }}>
            {wheel.map((s, i) => (
              <g key={i}>
                <path d={s.path} fill={s.color} stroke={theme.bg} strokeWidth="1.5" opacity="0.92" />
                <text x={s.label.x} y={s.label.y} fill="#fff" fontSize="9" fontWeight="700"
                  textAnchor="middle" dominantBaseline="middle"
                  transform={`rotate(${i * SEG + SEG / 2} ${s.label.x} ${s.label.y})`}>{s.name}</text>
              </g>
            ))}
            <circle cx="100" cy="100" r="16" fill={theme.bg} stroke={theme.gold} strokeWidth="2" />
          </motion.svg>
        </div>
      </div>

      <button onClick={spin} disabled={spinning}
        className="mt-2 flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-base active:scale-95 transition-all disabled:opacity-50"
        style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight})`, color: theme.bg }}>
        <RotateCw size={18} className={spinning ? 'animate-spin' : ''} />
        {spinning ? 'Dönüyor...' : 'Çevir'}
      </button>

      {/* Soru */}
      {question && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mt-6 rounded-2xl p-5" style={{ background: theme.cardBg, border: `1px solid ${category?.color || theme.gold}40` }}>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: `${category?.color}22`, color: category?.color }}>{category?.name}</span>
          <h3 className="text-base font-bold mt-3 mb-4" style={{ color: theme.textPrimary }}>{question.question}</h3>
          <div className="flex flex-col gap-2">
            {options.map((opt, idx) => {
              const chosen = answered?.index === idx;
              const isRight = answered && idx === question.correct_index;
              const isWrong = chosen && !answered.correct;
              return (
                <button key={idx} onClick={() => answer(idx)} disabled={!!answered}
                  className="flex items-center justify-between text-left p-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: isRight ? '#10B98122' : isWrong ? '#EF444422' : `${theme.textSecondary}0f`,
                    border: `1px solid ${isRight ? '#10B981' : isWrong ? '#EF4444' : theme.cardBorder}`,
                    color: theme.textPrimary,
                  }}>
                  <span>{opt}</span>
                  {isRight && <Check size={16} style={{ color: '#10B981' }} />}
                  {isWrong && <X size={16} style={{ color: '#EF4444' }} />}
                </button>
              );
            })}
          </div>
          {answered && (
            <button onClick={spin} className="w-full mt-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: `${theme.gold}18`, color: theme.gold }}>
              Tekrar Çevir →
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
