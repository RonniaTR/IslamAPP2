import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function ForYouRow({ items = [], title = "Sana Özel", viewAll = true }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', marginBottom: '16px' }}>
        <Typography variant="h3" style={{ color: '#FFF', fontSize: '18px' }}>{title}</Typography>
        {viewAll && (
          <button style={{ background: 'none', border: 'none', color: '#0F8F57', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            Tümünü Gör <ArrowRight size={12} />
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto', display: 'flex', gap: '16px', padding: '0 24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map(item => (
          <div key={item.id} style={{
            minWidth: '160px',
            width: '160px',
            height: '200px',
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(5,42,30,0.9) 100%)'
            }} />

            {item.badge && (
              <div style={{
                position: 'absolute',
                top: '12px', left: '12px',
                background: item.badgeColor || '#0F8F57',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#FFF',
                letterSpacing: '0.5px'
              }}>
                {item.badge}
              </div>
            )}

            <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
              <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 700, fontSize: '13px', lineHeight: 1.2, marginBottom: '4px' }}>
                {item.title}
              </Typography>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginBottom: '12px', display: 'block' }}>
                {item.subtitle}
              </Typography>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.progress || 0}%`, height: '100%', background: '#2ECC71', borderRadius: '2px' }} />
                </div>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={10} color="#FFF" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ minWidth: '8px' }} />
      </div>
    </div>
  );
}
