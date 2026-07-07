import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function OngoingSeriesRow({ items = [], title = "Devam Eden Seriler" }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', marginBottom: '16px' }}>
        <Typography variant="h3" style={{ color: '#FFF', fontSize: '18px' }}>{title}</Typography>
        <button style={{ background: 'none', border: 'none', color: '#0F8F57', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          Tümünü Gör <ArrowRight size={12} />
        </button>
      </div>

      <div style={{ overflowX: 'auto', display: 'flex', gap: '16px', padding: '0 24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map(item => (
          <div key={item.id} style={{
            minWidth: '140px',
            width: '140px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '100%',
              height: '180px',
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)'
              }} />
              <Typography variant="bodySmall" style={{ 
                position: 'absolute', 
                bottom: '12px', 
                left: '12px', 
                right: '12px', 
                color: '#FFF', 
                fontWeight: 700, 
                fontSize: '13px', 
                lineHeight: 1.2 
              }}>
                {item.title}
              </Typography>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
              <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${item.progress || 0}%`, height: '100%', background: '#CDA434', borderRadius: '2px' }} />
              </div>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 700 }}>
                %{item.progress || 0}
              </Typography>
            </div>
          </div>
        ))}
        <div style={{ minWidth: '8px' }} />
      </div>
    </div>
  );
}
