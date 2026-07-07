import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, Mic, RotateCcw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../../styles/designTokens';

const DAILY_DUAS = [
  { id: 1, title: 'İlmi Artırma Duası', arabic: 'رَبِّ زِدْنِي عِلْمًا', reading: 'Rabbi zidni ilme.', meaning: '"Rabbim! İlmimi artır."' },
  { id: 2, title: 'Yemekten Sonra', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا', reading: 'Elhamdülillâhillezî et’amenâ ve sekanâ.', meaning: '"Bizi yediren ve içiren Allah\'a hamdolsun."' },
  { id: 3, title: 'Uyku Duası', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', reading: 'Bismikellâhümme emûtü ve ahyâ.', meaning: '"Senin adınla Allah\'ım, ölür (uyur) ve dirilirim (uyanırım)."' },
  { id: 4, title: 'Anne Baba İçin', arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', reading: 'Rabbirhamhümâ kemâ rabbeyânî sağîrâ.', meaning: '"Rabbim! Küçüklüğümde onlar beni nasıl yetiştirmişlerse, şimdi sen de onlara (öyle) merhamet et!"' },
];

export default function KidsDuaList() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentDua = DAILY_DUAS[currentIndex];

  const nextDua = () => {
    if (currentIndex < DAILY_DUAS.length - 1) setCurrentIndex(prev => prev + 1);
  };
  
  const prevDua = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div style={{ background: '#F0F9FF', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 20px', position: 'sticky', top: 0, zIndex: 10
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <ChevronLeft size={24} color="#4B5563" />
        </button>
        <button style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', cursor: 'pointer', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 700, fontFamily: TYPOGRAPHY.fonts.kids }}>
          {currentIndex + 1} / {DAILY_DUAS.length}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#1F2937', fontFamily: TYPOGRAPHY.fonts.kids, margin: 0 }}>
          {currentDua.title}
        </h1>
      </div>

      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDua.id}
            initial={{ scale: 0.9, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.9, opacity: 0, x: -20 }}
            style={{
              background: '#FFFFFF',
              borderRadius: RADIUS['3xl'],
              padding: '40px 24px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px'
            }}
          >
            <div style={{ fontSize: '40px', fontWeight: 700, color: '#1F2937', lineHeight: 1.5, fontFamily: 'serif' }}>
              {currentDua.arabic}
            </div>

            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#374151', fontFamily: TYPOGRAPHY.fonts.kids, marginBottom: '24px' }}>
                {currentDua.reading}
              </div>
              
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0', fontFamily: TYPOGRAPHY.fonts.kids }}>
                  Anlamı:
                </p>
                <p style={{ fontSize: '15px', color: '#4B5563', margin: 0, fontFamily: TYPOGRAPHY.fonts.kids }}>
                  {currentDua.meaning}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Audio Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '40px' }}>
          <button style={{
            width: '56px', height: '56px', borderRadius: '28px',
            background: '#FFFFFF', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: SHADOWS.sm
          }}>
            <Play size={24} color="#EF4444" fill="#EF4444" style={{ marginLeft: '4px' }} />
          </button>

          <button style={{
            width: '72px', height: '72px', borderRadius: '36px',
            background: '#EF4444', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)'
          }}>
            <Mic size={32} color="#FFFFFF" />
          </button>

          <button style={{
            width: '56px', height: '56px', borderRadius: '28px',
            background: '#FFFFFF', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: SHADOWS.sm
          }}>
            <RotateCcw size={24} color="#6B7280" />
          </button>
        </div>
      </div>

      {/* Bottom Nav / Next Button */}
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={prevDua}
          disabled={currentIndex === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '14px 24px', borderRadius: '24px',
            background: '#FFFFFF', border: 'none', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            color: '#1F2937', fontSize: '15px', fontWeight: 800, fontFamily: TYPOGRAPHY.fonts.kids,
            boxShadow: SHADOWS.sm, opacity: currentIndex === 0 ? 0.5 : 1
          }}
        >
          <ChevronLeft size={20} /> Önceki
        </button>
        <button 
          onClick={nextDua}
          disabled={currentIndex === DAILY_DUAS.length - 1}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '14px 24px', borderRadius: '24px',
            background: '#FFFFFF', border: 'none', cursor: currentIndex === DAILY_DUAS.length - 1 ? 'not-allowed' : 'pointer',
            color: '#1F2937', fontSize: '15px', fontWeight: 800, fontFamily: TYPOGRAPHY.fonts.kids,
            boxShadow: SHADOWS.sm, opacity: currentIndex === DAILY_DUAS.length - 1 ? 0.5 : 1
          }}
        >
          Sonraki <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
