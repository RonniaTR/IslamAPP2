import React from 'react';
import { Crown, ArrowRight } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function PremiumContentRow({ items = [], title = "Premium İçerikler" }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', marginBottom: '16px' }}>
        <Typography variant="h3" style={{ color: '#CDA434', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={20} color="#CDA434" /> {title}
        </Typography>
        <button style={{ background: 'none', border: 'none', color: '#CDA434', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          Tümünü Gör <ArrowRight size={12} />
        </button>
      </div>

      <div style={{ overflowX: 'auto', display: 'flex', gap: '16px', padding: '0 24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map(item => (
          <div key={item.id} style={{
            minWidth: '260px',
            width: '260px',
            height: '160px',
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            border: '1px solid rgba(205, 164, 52, 0.3)',
            boxShadow: '0 8px 24px rgba(205, 164, 52, 0.15)'
          }}>
            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%)'
            }} />

            {item.badge && (
              <div style={{
                position: 'absolute',
                top: '12px', right: '12px',
                background: item.badgeColor || '#E74C3C',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#FFF',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}>
                {item.badge}
              </div>
            )}

            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', maxWidth: '80%' }}>
              <Typography variant="bodySmall" style={{ color: '#CDA434', fontWeight: 800, fontSize: '16px', lineHeight: 1.2, marginBottom: '6px' }}>
                {item.title}
              </Typography>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', lineHeight: 1.4, display: 'block' }}>
                {item.subtitle}
              </Typography>
            </div>
          </div>
        ))}
        <div style={{ minWidth: '8px' }} />
      </div>
    </div>
  );
}
