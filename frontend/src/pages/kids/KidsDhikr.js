import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

const DHIKRS = [
  { id: 'subhanallah', text: 'Subhanallah', target: 33, count: 0 },
  { id: 'elhamdulillah', text: 'Elhamdulillah', target: 33, count: 0 },
  { id: 'allahu_ekber', text: 'Allahu Ekber', target: 34, count: 0 },
  { id: 'kelime_tevhid', text: 'La ilahe illallah', target: 100, count: 0 },
  { id: 'estagfirullah', text: 'Estağfirullah', target: 33, count: 0 },
];

export default function KidsDhikr() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#F0F9FF', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 20px', position: 'relative', zIndex: 10
      }}>
        <button onClick={() => navigate(-1)} style={{ background: '#FFFFFF', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', boxShadow: SHADOWS.sm }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: 0 }}>
          Zikirler
        </h1>
        <button style={{ background: '#FFFFFF', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', boxShadow: SHADOWS.sm }}>
          <SlidersHorizontal size={20} color="#4B5563" />
        </button>
      </div>

      <div style={{ padding: '0 20px', flex: 1, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
        {DHIKRS.map((dhikr, i) => (
          <motion.div
            key={dhikr.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: SHADOWS.sm, cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                📿
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1F2937', margin: 0, fontFamily: TYPOGRAPHY.fonts.kids }}>
                {dhikr.text}
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#4B5563', fontFamily: TYPOGRAPHY.fonts.kids }}>
                {dhikr.target}
              </span>
              <span style={{ color: '#D1D5DB' }}>-</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sea and Ship Illustration */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '220px', zIndex: 1, pointerEvents: 'none'
      }}>
        {/* Waves Background */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(180deg, #38BDF8 0%, #0284C7 100%)', borderTopLeftRadius: '50% 20%', borderTopRightRadius: '50% 20%' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '-10%', right: '-10%', height: '140px', background: '#0EA5E9', borderTopLeftRadius: '50% 30%', borderTopRightRadius: '50% 30%', opacity: 0.6 }} />
        
        {/* Animated Ship */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            marginLeft: '-60px',
            width: '120px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
            filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))'
          }}
        >
          ⛵
        </motion.div>
      </div>
    </div>
  );
}
