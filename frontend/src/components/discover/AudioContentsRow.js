import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function AudioContentsRow({ items = [], title = "Sesli İçerikler" }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', marginBottom: '16px' }}>
        <Typography variant="h3" style={{ color: '#FFF', fontSize: '18px' }}>{title}</Typography>
        <button style={{ background: 'none', border: 'none', color: '#0F8F57', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          Tümünü Dinle <ArrowRight size={12} />
        </button>
      </div>

      <div style={{ overflowX: 'auto', display: 'flex', gap: '16px', padding: '0 24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map(item => (
          <div key={item.id} style={{
            minWidth: '160px',
            width: '160px',
            height: '140px',
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${item.color || '#0F8F57'} 0%, ${item.color || '#0F8F57'}80 100%)`,
            padding: '16px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Fake Soundwave */}
            <div style={{ position: 'absolute', bottom: '20px', right: '-10px', display: 'flex', gap: '4px', opacity: 0.3 }}>
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                  width: '4px',
                  height: `${Math.random() * 40 + 10}px`,
                  background: '#FFF',
                  borderRadius: '2px'
                }} />
              ))}
            </div>

            <div>
              <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                {item.title}
              </Typography>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {item.durationStr || `${item.duration} dk`}
              </Typography>
            </div>

            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <Play size={16} color={item.color || '#0F8F57'} style={{ marginLeft: '2px' }} />
            </div>
          </div>
        ))}
        <div style={{ minWidth: '8px' }} />
      </div>
    </div>
  );
}
