import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Typography } from '../ui/Typography';
import { getUpcomingDays } from '../../services/islamicCalendar';

// Tarihler tek takvim servisinden gelir (services/islamicCalendar.js); elle tarih yazılmaz.
const events = getUpcomingDays(3).map((d) => ({ id: d.id, title: d.name, date: d.dateLabel, daysLeft: d.daysLeft, color: d.color }));

export function UpcomingEventsRow({ items = events, title = "Yaklaşan Günler" }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', marginBottom: '16px' }}>
        <Typography variant="h3" style={{ color: '#FFF', fontSize: '18px' }}>{title}</Typography>
        <button style={{ background: 'none', border: 'none', color: '#0F8F57', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          Takvim <ArrowRight size={12} />
        </button>
      </div>

      <div style={{ overflowX: 'auto', display: 'flex', gap: '16px', padding: '0 24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map(item => (
          <div key={item.id} style={{
            minWidth: '200px',
            width: '200px',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${item.color}40`,
            borderRadius: '20px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: `${item.color}20`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${item.color}50`
            }}>
              <Calendar size={18} color={item.color} style={{ marginBottom: '2px' }} />
            </div>

            <div>
              <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                {item.title}
              </Typography>
              <Typography variant="caption" style={{ color: item.color, fontWeight: 700, fontSize: '11px' }}>
                {item.daysLeft === 0 ? 'Bugün' : `yaklaşık ${item.daysLeft} gün kaldı`}
              </Typography>
            </div>
          </div>
        ))}
        <div style={{ minWidth: '8px' }} />
      </div>
    </div>
  );
}
