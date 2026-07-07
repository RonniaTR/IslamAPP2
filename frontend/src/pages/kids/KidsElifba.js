import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

export default function KidsElifba() {
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
          Arapça Harfler
        </h1>
        <button style={{ background: '#FFFFFF', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', boxShadow: SHADOWS.sm }}>
          <MoreHorizontal size={24} color="#4B5563" />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, paddingBottom: '100px' }}>
        {/* Letter Display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            width: '240px', height: '240px', borderRadius: '120px',
            background: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            position: 'relative'
          }}
        >
          {/* Bird/Character decoration */}
          <div style={{ position: 'absolute', top: '20px', right: '-10px', fontSize: '32px' }}>
            🦅
          </div>
          <div style={{ position: 'absolute', bottom: '20px', left: '-10px', fontSize: '32px' }}>
            🌿
          </div>

          <span style={{ fontSize: '100px', fontWeight: 'bold', color: '#1F2937' }}>
            ا
          </span>
        </motion.div>

        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, marginTop: '32px' }}>
          Elif
        </h2>
      </div>

      {/* Controls & Progress */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '200px',
        background: 'linear-gradient(180deg, rgba(52, 211, 153, 0) 0%, #34D399 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px',
        zIndex: 5
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <button style={{ width: '56px', height: '56px', borderRadius: '28px', background: '#FFFFFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOWS.md, cursor: 'pointer' }}>
            <ChevronLeft size={28} color="#10B981" />
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '0 24px' }}>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '3.5%', height: '100%', background: '#FFFFFF', borderRadius: '4px' }} />
            </div>
            <span style={{ color: '#FFFFFF', fontWeight: 700, marginTop: '8px', fontFamily: TYPOGRAPHY.fonts.kids }}>
              1 / 28
            </span>
          </div>

          <button style={{ width: '56px', height: '56px', borderRadius: '28px', background: '#FFFFFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOWS.md, cursor: 'pointer' }}>
            <ChevronRight size={28} color="#10B981" />
          </button>
        </div>
      </div>
    </div>
  );
}
