import React from 'react';
import { BookOpen, Play, Share2 } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function VerseOfTheDayCard() {
  return (
    <div style={{ padding: '0 24px 24px' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A3A22 0%, #052212 100%)',
        boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
        border: '1px solid rgba(205, 164, 52, 0.2)'
      }}>
        {/* Background Image with Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1609599006353-e629aaab31f7?auto=format&fit=crop&q=80&w=800")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, padding: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(205, 164, 52, 0.15)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(205, 164, 52, 0.3)' }}>
              <Typography variant="caption" style={{ color: '#CDA434', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase' }}>
                <span style={{ fontSize: '14px', marginRight: '4px' }}>🕌</span> Günün Ayeti
              </Typography>
            </div>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Bakara Suresi - 286</Typography>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Typography variant="h2" style={{ color: '#FFF', fontFamily: "'Amiri', serif", fontSize: '32px', lineHeight: 1.6, marginBottom: '16px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا
            </Typography>
            <Typography variant="bodySmall" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: '90%', margin: '0 auto' }}>
              Allah, hiç kimseye gücünün yettiğinden fazlasını yüklemez.
            </Typography>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              <BookOpen size={16} /> Ayetin Meali
            </button>
            <button style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              <Play size={16} /> Dinle
            </button>
            <button style={{
              width: '44px',
              borderRadius: '12px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <Share2 size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
