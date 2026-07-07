import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function WeeklyChallengeCard({ stats }) {
  if (!stats?.challenges?.weekly) return null;
  const { title, desc, reward, current, target } = stats.challenges.weekly;
  const progressPercent = Math.min(100, Math.round((current / target) * 100));

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(205, 164, 52, 0.15) 0%, rgba(140, 108, 46, 0.05) 100%)',
        border: '1px solid rgba(205, 164, 52, 0.3)',
        borderRadius: '24px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow effect */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(205,164,52,0.3) 0%, rgba(0,0,0,0) 70%)' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #CDA434 0%, #8C6C2E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 8px 16px rgba(205,164,52,0.3)'
          }}>
            <Target size={28} color="#FFF" />
          </div>

          <div style={{ flex: 1 }}>
            <Typography variant="bodySmall" style={{ color: '#CDA434', fontWeight: 800, fontSize: '13px', marginBottom: '4px', textTransform: 'uppercase' }}>
              {title}
            </Typography>
            <Typography variant="h3" style={{ color: '#FFF', fontSize: '18px', marginBottom: '4px' }}>
              {desc}
            </Typography>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              Ödül: <span style={{ color: '#CDA434', fontWeight: 700 }}>{reward}</span>
            </Typography>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>İlerleme: {current}/{target}</Typography>
            <Typography variant="caption" style={{ color: '#CDA434', fontWeight: 700, fontSize: '11px' }}>%{progressPercent}</Typography>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#CDA434', borderRadius: '3px' }} />
          </div>
        </div>

      </div>
    </div>
  );
}
