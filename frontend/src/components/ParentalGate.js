import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

export default function ParentalGate({ isOpen, onClose, onSuccess }) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNum1(Math.floor(Math.random() * 10) + 10);
      setNum2(Math.floor(Math.random() * 10) + 5);
      setAnswer('');
      setError(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(answer, 10) === num1 + num2) {
      onSuccess();
    } else {
      setError(true);
      setAnswer('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(31, 41, 55, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', zIndex: 100
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={{
            background: '#FFFFFF',
            borderRadius: RADIUS['3xl'],
            padding: '32px 24px',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: '#F3F4F6', border: 'none', width: '32px', height: '32px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="#4B5563" />
          </button>

          <div style={{
            width: '64px', height: '64px', borderRadius: '32px',
            background: '#D1FAE5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Lock size={32} color="#059669" />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: '0 0 8px 0' }}>
            Ebeveyn Onayı Gerekli
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: TYPOGRAPHY.fonts.kids, margin: '0 0 24px 0' }}>
            Devam etmek için aşağıdaki işlemi çözün.
          </p>

          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, letterSpacing: '2px' }}>
              {num1} + {num2} = ?
            </div>

            <div>
              <input
                type="number"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setError(false);
                }}
                placeholder="Cevap..."
                style={{
                  width: '100%', padding: '16px', borderRadius: RADIUS.xl,
                  border: `2px solid ${error ? '#EF4444' : '#E5E7EB'}`,
                  background: '#F9FAFB',
                  fontSize: '20px', fontWeight: 700, color: '#1F2937',
                  textAlign: 'center', fontFamily: TYPOGRAPHY.fonts.kids,
                  outline: 'none'
                }}
                autoFocus
              />
              {error && <p style={{ color: '#EF4444', fontSize: '13px', margin: '8px 0 0 0', fontWeight: 600 }}>Yanlış cevap, tekrar deneyin.</p>}
            </div>

            <button
              type="submit"
              style={{
                width: '100%', padding: '16px', borderRadius: RADIUS.xl,
                background: '#10B981', color: '#FFFFFF',
                border: 'none', fontSize: '16px', fontWeight: 800,
                fontFamily: TYPOGRAPHY.fonts.kids, cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
              }}
            >
              Doğrula
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
