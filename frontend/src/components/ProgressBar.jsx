import React from 'react';

export default function ProgressBar({ value = 0, max = 100 }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ width: '100%', background: '#e6e6e6', height: 8, borderRadius: 8 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: '#ffd369', borderRadius: 8 }} />
    </div>
  );
}
