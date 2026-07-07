import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

const GAMES = [
  { id: 'match', title: 'Eşleştir', subtitle: 'Ayet Kartları', bg: '#F0FDF4', color: '#10B981', iconBg: '#FFFFFF', icon: '📖' },
  { id: 'quiz', title: 'Doğruyu Bul', subtitle: 'Bilgi Yarışması', bg: '#EDE9FE', color: '#8B5CF6', iconBg: '#C4B5FD', icon: '🕋' },
  { id: 'words', title: 'Kelime Bul', subtitle: 'Arapça Kelimeler', bg: '#ECFCCB', color: '#84CC16', iconBg: '#D9F99D', icon: '🧩' },
  { id: 'memory', title: 'Hafıza Kartları', subtitle: 'Eşleştirme Oyunu', bg: '#FEF3C7', color: '#F59E0B', iconBg: '#FDE68A', icon: '🃏' },
];

export default function KidsGames() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 20px', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <button onClick={() => navigate('/kids')} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: 0 }}>
          Oyunlar
        </h1>
        <button style={{ background: '#FEF3C7', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <Medal size={20} color="#D97706" />
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '24px 20px' }}>
        {GAMES.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {}}
            style={{
              background: game.bg,
              borderRadius: RADIUS['2xl'],
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: SHADOWS.sm,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '72px', height: '72px', borderRadius: '24px',
              background: game.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px',
              boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.5)',
            }}>
              {game.icon}
            </div>
            
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.kids }}>
                {game.title}
              </h3>
              <p style={{ fontSize: '11px', color: game.color, fontWeight: 700, margin: 0, fontFamily: TYPOGRAPHY.fonts.kids }}>
                {game.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
