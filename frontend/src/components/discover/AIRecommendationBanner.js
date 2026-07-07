import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function AIRecommendationBanner({ stats }) {
  if (!stats) return null;

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 143, 87, 0.15) 0%, rgba(46, 204, 113, 0.05) 100%)',
        border: '1px solid rgba(46, 204, 113, 0.3)',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow effect */}
        <div style={{ position: 'absolute', top: -30, left: -30, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(46,204,113,0.3) 0%, rgba(0,0,0,0) 70%)' }} />

        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '16px',
          background: 'rgba(46, 204, 113, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '1px solid rgba(46, 204, 113, 0.5)'
        }}>
          <Sparkles size={24} color="#2ECC71" />
        </div>

        <div style={{ flex: 1 }}>
          <Typography variant="bodySmall" style={{ color: '#2ECC71', fontWeight: 800, fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase' }}>
            Yapay Zeka Sana Öneriyor
          </Typography>
          <Typography variant="caption" style={{ color: '#FFF', fontSize: '13px', lineHeight: 1.4 }}>
            Son günlerde <span style={{ color: '#CDA434', fontWeight: 700 }}>"{stats.favoriteTags[0] || 'dua'}"</span> konularını okuyorsun. Bugün tevekkül üzerine yeni makalemizi incelemek ister misin?
          </Typography>
        </div>

        <button style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#2ECC71',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0
        }}>
          <ArrowRight size={16} color="#FFF" />
        </button>
      </div>
    </div>
  );
}
