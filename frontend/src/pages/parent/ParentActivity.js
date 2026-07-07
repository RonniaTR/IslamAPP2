import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

const TABS = [
  { id: 'daily', label: 'Günlük' },
  { id: 'weekly', label: 'Haftalık' },
  { id: 'monthly', label: 'Aylık' },
];

export default function ParentActivity() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('weekly');

  const weeklyData = [
    { day: 'Pzt', height: '40%' },
    { day: 'Sal', height: '60%' },
    { day: 'Çar', height: '50%' },
    { day: 'Per', height: '80%' },
    { day: 'Cum', height: '100%', active: true },
    { day: 'Cmt', height: '90%' },
    { day: 'Paz', height: '70%' },
  ];

  const mostUsed = [
    { id: 1, title: 'Hikayeler', time: '2s 15dk', icon: '📖', bg: '#D1FAE5', color: '#10B981' },
    { id: 2, title: 'Oyunlar', time: '1s 45dk', icon: '🎮', bg: '#E0F2FE', color: '#0EA5E9' },
    { id: 3, title: 'Kur\'an', time: '45dk', icon: '🕋', bg: '#FCE7F3', color: '#EC4899' },
  ];

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 20px', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <button onClick={() => navigate('/parent/profiles')} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary, margin: 0 }}>
          Etkinlik Raporu
        </h1>
        <button style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
          <Share2 size={20} color="#4B5563" />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', padding: '20px', overflowX: 'auto' }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '10px', borderRadius: '24px',
                background: isActive ? '#6366F1' : '#F3F4F6',
                color: isActive ? '#FFFFFF' : '#6B7280',
                border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.primary,
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '0 20px 24px 20px' }}>
        {/* Chart */}
        <div style={{ background: '#FFFFFF', borderRadius: RADIUS['2xl'], padding: '24px', boxShadow: SHADOWS.sm, marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary, margin: 0 }}>
              Bu Hafta
            </h2>
            <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 600, fontFamily: TYPOGRAPHY.fonts.primary }}>
              2 - 8 Mayıs
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '160px' }}>
            {weeklyData.map((data, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '32px' }}>
                <div style={{
                  width: '100%', height: '130px', background: '#F3F4F6', borderRadius: '8px',
                  position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end'
                }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: data.height }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    style={{
                      width: '100%', background: data.active ? '#6366F1' : '#C7D2FE',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: data.active ? '#1F2937' : '#9CA3AF', fontFamily: TYPOGRAPHY.fonts.primary }}>
                  {data.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Used */}
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.primary, margin: '0 0 16px 0' }}>
          En Çok Kullanılanlar
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mostUsed.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: '#FFFFFF', borderRadius: RADIUS.xl, padding: '16px',
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: SHADOWS.sm
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 4px 0', fontFamily: TYPOGRAPHY.fonts.primary }}>
                  {item.title}
                </h3>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#4B5563', fontFamily: TYPOGRAPHY.fonts.primary }}>
                {item.time}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
