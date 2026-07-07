import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

export default function KidsProgress() {
  const navigate = useNavigate();

  const stats = [
    { id: 1, title: 'Okunan Sure', value: '12', icon: '📖', color: '#10B981', bg: '#D1FAE5' },
    { id: 2, title: 'Öğrenilen Dua', value: '8', icon: '🤲', color: '#F59E0B', bg: '#FEF3C7' },
    { id: 3, title: 'Toplanan Rozet', value: '15', icon: '🏅', color: '#8B5CF6', bg: '#EDE9FE' },
    { id: 4, title: 'Kazanılan Puan', value: '450', icon: '⭐', color: '#F43F5E', bg: '#FFE4E6' },
  ];

  const weeklyData = [
    { day: 'Pzt', height: '60%' },
    { day: 'Sal', height: '80%' },
    { day: 'Çar', height: '40%' },
    { day: 'Per', height: '90%' },
    { day: 'Cum', height: '100%', active: true },
    { day: 'Cmt', height: '50%' },
    { day: 'Paz', height: '70%' },
  ];

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '24px 20px', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: 0 }}>
          İlerlemem
        </h1>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Main Progress Circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '24px' }}>
            {/* SVG Circle Progress */}
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="10" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="10" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.kids }}>Seviye</span>
              <span style={{ fontSize: '48px', fontWeight: 800, color: '#1F2937', lineHeight: 1 }}>4</span>
            </div>
          </div>
          
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#10B981', fontFamily: TYPOGRAPHY.fonts.kids, margin: '0 0 8px 0', textAlign: 'center' }}>
            Harika gidiyorsun!
          </p>
          <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: TYPOGRAPHY.fonts.kids, margin: 0, textAlign: 'center' }}>
            Sonraki seviyeye 25 puan kaldı.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '16px',
                display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: SHADOWS.sm
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', margin: '0 0 2px 0' }}>{stat.value}</p>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', margin: 0, fontFamily: TYPOGRAPHY.fonts.kids }}>{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Activity */}
        <div style={{ background: '#FFFFFF', borderRadius: RADIUS['2xl'], padding: '24px', boxShadow: SHADOWS.sm }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: '0 0 24px 0' }}>
            Haftalık Aktivite
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px' }}>
            {weeklyData.map((data, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '32px' }}>
                <div style={{
                  width: '100%', height: '120px', background: '#F3F4F6', borderRadius: '16px',
                  position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end'
                }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: data.height }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    style={{
                      width: '100%', background: data.active ? '#10B981' : '#A7F3D0',
                      borderRadius: '16px'
                    }}
                  />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: data.active ? '#1F2937' : '#9CA3AF', fontFamily: TYPOGRAPHY.fonts.kids }}>
                  {data.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
