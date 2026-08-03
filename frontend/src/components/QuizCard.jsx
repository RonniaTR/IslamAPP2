import React from 'react';
import { useTx } from '../i18n';

export default function QuizCard({ question, onAnswer, selectedIndex, disabled, showResult, wasCorrect }) {
  const tt = useTx();
  if (!question) return null;

  const renderOptions = () => {
    if (question.type === 'tf' || question.type === 'swipe') {
      return (
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-primary" onClick={() => onAnswer(1)} disabled={disabled}>{tt('Doğru')}</button>
          <button className="btn-secondary" onClick={() => onAnswer(0)} disabled={disabled}>{tt('Yanlış')}</button>
        </div>
      );
    }

    if (question.type === 'match' && question.options && Array.isArray(question.options)) {
      // Simple match rendering: show options as buttons (can be expanded)
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {question.options.map((opt, i) => (
            <button key={i} className={`btn-secondary ${selectedIndex===i? 'selected': ''}`} onClick={() => onAnswer(i)} disabled={disabled}>{opt}</button>
          ))}
        </div>
      );
    }

    // Default: MCQ
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        {question.options && question.options.map((o, i) => (
          <button key={i} className={`btn-secondary ${selectedIndex===i? 'selected': ''}`} onClick={() => onAnswer(i)} disabled={disabled}>{o}</button>
        ))}
      </div>
    );
  };

  const cardClass = `card p-6 mb-4 ${showResult ? (wasCorrect ? 'result-correct' : 'result-wrong') : ''}`;

  return (
    <div className={cardClass}>
      <h3 style={{ fontWeight: 800 }}>{question.question}</h3>
      <div style={{ marginTop: 16 }}>{renderOptions()}</div>
    </div>
  );
}
