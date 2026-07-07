import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

const COLORING_BOOKS = [
  { id: 'mosques', title: 'Camiler', bg: '#D1FAE5', color: '#059669', icon: '🕌' },
  { id: 'nature', title: 'Doğa', bg: '#E0F2FE', color: '#0284C7', icon: '🌅' },
];

export default function KidsColoring() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 20px', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: 0 }}>
          Boyama Zamanı
        </h1>
        <button style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <MoreHorizontal size={20} color="#4B5563" />
        </button>
      </div>

      {/* Grid */}
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {COLORING_BOOKS.map((book, i) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: '#FFFFFF',
              borderRadius: RADIUS['3xl'],
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: SHADOWS.sm,
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '100%', height: '180px', borderRadius: RADIUS['2xl'],
              background: book.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '80px', marginBottom: '20px'
            }}>
              {book.icon}
            </div>
            
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: 0 }}>
              {book.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
