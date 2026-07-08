import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#FFD369', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899'];

/**
 * Hafif konfeti patlaması — dış kütüphane yok, framer-motion parçacıkları.
 * Kazanma ekranlarında bir kez patlar.
 */
export default function Confetti({ count = 26 }) {
  const parts = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 320,
    y: -(60 + Math.random() * 240),
    rot: (Math.random() - 0.5) * 540,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 0.15,
    size: 6 + Math.random() * 7,
    round: Math.random() > 0.5,
  })), [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-end justify-center" aria-hidden="true">
      {parts.map(p => (
        <motion.span key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot, scale: 0.6 }}
          transition={{ duration: 1.4 + Math.random() * 0.5, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute', bottom: '30%',
            width: p.size, height: p.size * (p.round ? 1 : 0.55),
            background: p.color, borderRadius: p.round ? '50%' : 2,
          }} />
      ))}
    </div>
  );
}
