import React from 'react';
import { motion } from 'framer-motion';
import '../styles/DeenConnect.css';

export default function JourneyTracker() {
  const days = Array.from({ length: 28 }).map((_, i) => {
    const idx = i + 1;
    const status = idx < 6 ? 'completed' : idx === 6 ? 'active' : 'locked';
    return { day: idx, status };
  });

  return (
    <div className="min-h-screen p-6" style={{ background: '#032212' }}>
      <div className="card-deen-glass p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black" style={{ color: '#f7e6ae' }}>Yolculuk</h2>
            <p style={{ color: '#a8b5a0' }}>Toplam XP: <strong style={{ color: '#ffd369' }}>1,320</strong> · Seri: <strong style={{ color: '#ffd369' }}>6</strong></p>
          </div>
        </div>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr' }}>
        {days.map(d => (
          <motion.div key={d.day} className={`quiz-category-card card-deen-glass p-4 flex items-center justify-between`} whileHover={{ y: -4 }}>
            <div className="flex items-center gap-3">
              <div style={{ width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: d.status === 'completed' ? '#ffd369' : d.status === 'active' ? '#032212' : '#0b3a2b', border: '1px solid rgba(255,211,105,0.18)' }}>
                <span style={{ color: d.status === 'completed' ? '#032212' : '#f7e6ae', fontWeight: 900 }}>{d.day}</span>
              </div>
              <div>
                <div style={{ color: '#f7e6ae', fontWeight: 800 }}>Gün {d.day}</div>
                <div style={{ color: '#a8b5a0', fontSize: 13 }}>Kısa görev açıklaması burada.</div>
              </div>
            </div>
            <div style={{ color: d.status === 'completed' ? '#032212' : '#ffd369', fontWeight: 800 }}>{d.status === 'completed' ? 'Tamamlandı' : d.status === 'active' ? 'Aktif' : 'Kilidi Açılmadı'}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
