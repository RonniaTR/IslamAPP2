import React from 'react';
import { Play, Headphones, Video } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function ContinueLearningRow({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ padding: '0 0 24px 24px', overflowX: 'auto', display: 'flex', gap: '16px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {items.map(item => {
        const Icon = item.type === 'audio' ? Headphones : (item.type === 'video' ? Video : Play);
        return (
          <div key={item.id} style={{
            minWidth: '240px',
            height: '80px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}>
            <div style={{ flex: 1 }}>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase' }}>
                {item.typeLabel || 'Devam Et'}
              </Typography>
              <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 600, marginTop: '2px' }}>
                {item.title}
              </Typography>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                {item.subtitle}
              </Typography>
            </div>
            
            {item.image ? (
              <div style={{ position: 'relative', width: '64px', height: '56px', borderRadius: '12px', overflow: 'hidden' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#CDA434', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={12} color="#FFF" style={{ marginLeft: item.type !== 'audio' ? '2px' : '0' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${item.color || '#0F8F57'}20`, border: `1px solid ${item.color || '#0F8F57'}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color={item.color || '#0F8F57'} />
              </div>
            )}
          </div>
        );
      })}
      <div style={{ minWidth: '8px' }} /> {/* Right Padding Spacer */}
    </div>
  );
}
