import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Play, SkipBack, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

export default function KidsStoryPlayer() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 20px', position: 'sticky', top: 0, zIndex: 10, background: '#F9FAFB'
      }}>
        <button onClick={() => navigate(-1)} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <button style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <Heart size={20} color="#4B5563" />
        </button>
      </div>

      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Title */}
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: '0 0 24px 0', textAlign: 'center' }}>
          Hz. Yunus'un Sabrı
        </h1>

        {/* Hero Illustration */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: '120px 120px 32px 32px',
            background: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '32px',
            boxShadow: '0 20px 40px rgba(186, 230, 253, 0.5)'
          }}
        >
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: '#38BDF8', borderRadius: '50% 50% 0 0', opacity: 0.3 }} />
          <div style={{ position: 'absolute', bottom: 0, left: '-10%', right: '-10%', height: '30%', background: '#0284C7', borderRadius: '50% 50% 0 0' }} />
          {/* Whale Emoji */}
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '100px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}>
            🐋
          </div>
          {/* Person Emoji */}
          <div style={{ position: 'absolute', bottom: '15%', right: '20%', fontSize: '40px' }}>
            🚣
          </div>
        </motion.div>

        {/* Story Text */}
        <p style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: '#4B5563',
          fontFamily: TYPOGRAPHY.fonts.kids,
          textAlign: 'center',
          marginBottom: 'auto',
          paddingBottom: '40px'
        }}>
          <strong style={{ color: '#1F2937' }}>Hz. Yunus</strong>, Allah'ın emrine uyması için bir kavme gönderilmişti. Fakat kavmi onu dinlemedi. Bunun üzerine o da gemiyle ayrıldı...
        </p>
      </div>

      {/* Play Controls */}
      <div style={{
        padding: '32px 24px',
        background: '#FFFFFF',
        borderRadius: '32px 32px 0 0',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px'
      }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <SkipBack size={28} color="#9CA3AF" />
        </button>
        <button style={{
          width: '72px', height: '72px', borderRadius: '36px',
          background: '#1F2937', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(31, 41, 55, 0.3)'
        }}>
          <Play size={32} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: '4px' }} />
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <SkipForward size={28} color="#9CA3AF" />
        </button>
      </div>
    </div>
  );
}
