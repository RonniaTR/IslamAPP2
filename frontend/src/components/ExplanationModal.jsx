import React from 'react';

export default function ExplanationModal({ open, explanation, correct, onClose }) {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, maxWidth: 720, width: '90%' }}>
        <h3 style={{ margin: 0 }}>{correct ? 'Doğru!' : 'Yanlış veya Süre Doldu'}</h3>
        <p style={{ color: '#333' }}>{explanation || 'Açıklama mevcut değil.'}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onClose}>Devam</button>
        </div>
      </div>
    </div>
  );
}
