import React from 'react';
// Lottie optional - fallback to SVG if unavailable
import '../styles/DeenConnect.css';
import { useTx } from '../../i18n';

export default function SuccessAnimation() {
  const tt = useTx();
  const params = new URLSearchParams(window.location.search);
  const xp = params.get('xp') || '150';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#032212' }}>
      <div className="card-deen-glass p-6 mb-6 text-center">
        <div style={{ width: 260, height: 260, margin: '0 auto' }}>
          <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="#ffd369" strokeWidth="6" strokeOpacity="0.18" />
            <path d="M34 62 L50 78 L86 42" fill="none" stroke="#ffd369" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ color: '#f7e6ae', fontSize: 28, fontWeight: 900, marginTop: 12 }}>{tt('Elhamdülillah!')}</h2>
        <p style={{ color: '#a8b5a0' }}>{tt('Puanlarınız toplandı.')}</p>
        <div style={{ marginTop: 18, padding: 18, borderRadius: 16, border: '1px solid rgba(255,211,105,0.2)', background: 'rgba(255,211,105,0.06)' }}>
          <div style={{ color: '#ffd369', fontWeight: 900, fontSize: 22 }}>Points Earned: {xp} XP</div>
        </div>
        <button className="btn-deen-primary" style={{ marginTop: 18 }} onClick={() => window.location.href = '/journey'}>CONTINUE JOURNEY</button>
      </div>
    </div>
  );
}
