import React from 'react';
import { BookOpen, Heart, Star, CloudRain, Book, Scale, Sun, Users, ArrowRight } from 'lucide-react';
import { Typography } from '../ui/Typography';

const categories = [
  { id: 'quran', name: "Kur'an", icon: BookOpen, color: '#CDA434' }, // Gold
  { id: 'dhikr', name: 'Dua & Zikir', icon: Heart, color: '#2ECC71' }, // Emerald
  { id: 'hadith', name: 'Hadisler', icon: Star, color: '#D4AF37' }, // Dark Gold
  { id: 'siyer', name: 'Siyer', icon: CloudRain, color: '#F5A623' }, // Orange
  { id: 'ilmihal', name: 'İlmihal', icon: Book, color: '#3498DB' }, // Blue
  { id: 'fiqh', name: 'Fıkıh', icon: Scale, color: '#9B59B6' }, // Purple
  { id: 'names', name: 'Esmaül Hüsna', icon: Sun, color: '#1ABC9C' }, // Teal
  { id: 'prophets', name: 'Peygamberler', icon: Users, color: '#E74C3C' } // Red
];

export function QuickCategories() {
  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', marginBottom: '16px' }}>
        <Typography variant="h3" style={{ color: '#FFF', fontSize: '18px' }}>Hızlı Kategoriler</Typography>
        <button style={{ background: 'none', border: 'none', color: '#0F8F57', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          Tümü <ArrowRight size={12} />
        </button>
      </div>

      <div style={{ overflowX: 'auto', padding: '0 24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(64px, 1fr))', gap: '16px', minWidth: 'max-content' }}>
          {categories.map(cat => (
            <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 16px ${cat.color}40`,
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <cat.icon size={28} color="#FFF" />
              </div>
              <Typography variant="caption" style={{ color: '#FFF', fontSize: '11px', fontWeight: 600, textAlign: 'center' }}>
                {cat.name}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
