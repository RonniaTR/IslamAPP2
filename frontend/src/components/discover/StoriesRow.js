import React from 'react';
import { Typography } from '../ui/Typography';

export function StoriesRow({ items = [], title = "Dünya Müslümanlarından Hikayeler" }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', marginBottom: '16px' }}>
        <Typography variant="h3" style={{ color: '#FFF', fontSize: '18px' }}>{title}</Typography>
      </div>

      <div style={{ overflowX: 'auto', display: 'flex', gap: '16px', padding: '0 24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map(item => (
          <div key={item.id} style={{
            minWidth: '200px',
            width: '200px',
            height: '280px',
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
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.9) 100%)'
            }} />

            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
              <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 800, fontSize: '14px', lineHeight: 1.3, marginBottom: '6px' }}>
                {item.title}
              </Typography>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', lineHeight: 1.4, display: 'block' }}>
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
