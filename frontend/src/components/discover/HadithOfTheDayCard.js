import React from 'react';
import { BookOpen, Share2 } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function HadithOfTheDayCard() {
  return (
    <div style={{ padding: '0 24px 24px' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)', // Dark theme for contrast
        boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Subtle patterned background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")',
          opacity: 0.1
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, padding: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Typography variant="caption" style={{ color: '#FFF', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase' }}>
                <span style={{ fontSize: '14px', marginRight: '4px' }}>🌟</span> Bugünün Hadisi
              </Typography>
            </div>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Müslim, Zikir 46</Typography>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Typography variant="h2" style={{ color: '#CDA434', fontFamily: "'Amiri', serif", fontSize: '26px', lineHeight: 1.6, marginBottom: '16px' }}>
              مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ
            </Typography>
            <Typography variant="bodySmall" style={{ color: '#FFF', lineHeight: 1.6, maxWidth: '90%', margin: '0 auto', fontSize: '15px' }}>
              "Kim bir hayra delalet ederse (öncülük ederse), ona o hayrı işleyenin sevabı kadar sevap verilir."
            </Typography>
          </div>

          <div style={{ 
            background: 'rgba(46, 204, 113, 0.1)', 
            borderLeft: '3px solid #2ECC71', 
            padding: '12px', 
            borderRadius: '0 8px 8px 0',
            marginBottom: '24px'
          }}>
            <Typography variant="caption" style={{ color: '#2ECC71', fontWeight: 700, marginBottom: '4px', display: 'block' }}>💡 Hayatımıza Uygulanışı</Typography>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>Bugün bir arkadaşına güzel bir dua öğretebilir veya onu faydalı bir içeriğe yönlendirebilirsin.</Typography>
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
              <BookOpen size={16} /> Tamamını Oku
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
