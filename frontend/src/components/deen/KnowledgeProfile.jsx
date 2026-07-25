import React, { useMemo } from 'react';
import '../styles/DeenConnect.css';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useTx } from '../../i18n';

const data = [
  { subject: 'Kuran', A: 85 },
  { subject: 'Siyer', A: 70 },
  { subject: 'Fıkıh', A: 58 },
  { subject: 'Hadis', A: 76 },
  { subject: 'Ahlak', A: 92 },
  { subject: 'Tarih', A: 54 },
];

export default function KnowledgeProfile() {
  const tt = useTx();
  return (
    <div className="min-h-screen p-6" style={{ background: '#032212' }}>
      <div className="card-deen-glass p-6 mb-6" style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: 120, height: 120, borderRadius: 999, border: '4px solid #ffd369', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <h2 style={{ color: '#f7e6ae', fontSize: 28, fontWeight: 900 }}>Leyla</h2>
          <div style={{ color: '#a8b5a0' }}>{tt('Seviye 12 - İlim Talebesi')}</div>
        </div>
      </div>

      <div className="card-deen-glass p-6" style={{ height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid strokeOpacity={0.06} />
            <PolarAngleAxis dataKey="subject" stroke="#f7e6ae" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="İlerleme" dataKey="A" stroke="#ffd369" fill="#ffd369" fillOpacity={0.28} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
