import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

export default function KidsTasks() {
  const navigate = useNavigate();

  const tasks = [
    { id: 1, title: '1 sure oku', subtitle: 'Felak Suresi', progress: 0, total: 1, icon: '📖', color: '#10B981', bg: '#D1FAE5' },
    { id: 2, title: '5 salavat getir', subtitle: '', progress: 0, total: 5, icon: '⭐', color: '#F59E0B', bg: '#FEF3C7' },
    { id: 3, title: 'Bir dua ezberle', subtitle: '', progress: 0, total: 1, icon: '🤲', color: '#F43F5E', bg: '#FFE4E6' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F9FAFB',
      paddingBottom: '100px',
      fontFamily: TYPOGRAPHY.fonts.kids,
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: '#FFFFFF',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/kids')}
          style={{
            width: '40px', height: '40px', borderRadius: '20px',
            background: '#F3F4F6', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', margin: 0 }}>
            Günlük Görevlerin
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            Bugün {tasks.length} görevin var
          </p>
        </div>
      </div>

      {/* Task List */}
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: '#FFFFFF',
              borderRadius: RADIUS.xl,
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: SHADOWS.sm,
            }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '16px',
              background: task.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
            }}>
              {task.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#374151', margin: '0 0 4px 0' }}>
                {task.title}
              </h3>
              {task.subtitle && (
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{task.subtitle}</p>
              )}
            </div>

            <div style={{
              background: '#F3F4F6',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#6B7280',
            }}>
              {task.progress}/{task.total}
            </div>
          </motion.div>
        ))}

        {/* Tebrikler Kartı */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '24px',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            borderRadius: RADIUS['2xl'],
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 10px 25px rgba(245,158,11,0.2)',
          }}
        >
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#92400E', margin: '0 0 8px 0' }}>
              Tebrikler!
            </h3>
            <p style={{ fontSize: '13px', color: '#B45309', margin: 0, lineHeight: 1.4 }}>
              Tüm görevleri tamamla ve ödülünü kazan!
            </p>
          </div>
          <div style={{ fontSize: '64px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
            🎁
          </div>
        </motion.div>
      </div>
    </div>
  );
}
