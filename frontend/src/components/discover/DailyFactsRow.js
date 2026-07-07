import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function DailyFactsRow({ items = [], title = "Bugün Öğrenilecek 5 Bilgi" }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', marginBottom: '16px' }}>
        <Typography variant="h3" style={{ color: '#FFF', fontSize: '18px' }}>{title}</Typography>
      </div>

      <div style={{ overflowX: 'auto', display: 'flex', gap: '12px', padding: '0 24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map((item, index) => (
          <div key={item.id} style={{
            minWidth: '150px',
            width: '150px',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${item.color || '#FFF'}40`,
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '12px', right: '12px',
              fontSize: '24px', opacity: 0.2
            }}>
              {index + 1}
            </div>

            <div>
              <span style={{ fontSize: '20px', marginBottom: '8px', display: 'block' }}>{item.icon}</span>
              <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 700, fontSize: '13px', lineHeight: 1.2, marginBottom: '4px' }}>
                {item.title}
              </Typography>
            </div>
            
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', lineHeight: 1.4, marginTop: '8px' }}>
              {item.subtitle}
            </Typography>
          </div>
        ))}
        <div style={{ minWidth: '8px' }} />
      </div>
    </div>
  );
}
