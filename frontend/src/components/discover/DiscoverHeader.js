import React from 'react';
import { Search, Mic, Sparkles } from 'lucide-react';
import { Typography } from '../ui/Typography';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export function DiscoverHeader({ streak = 12, level = 12 }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  return (
    <div style={{ position: 'relative', padding: '32px 24px 24px', zIndex: 10 }}>
      {/* Background Gradient & Glows are handled in parent page */}
      
      {/* Top Row: Welcome + Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <Typography variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
            Esselamu Aleyküm
          </Typography>
          <Typography variant="h1" style={{ color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user?.name || 'Samet'} <span role="img" aria-label="wave">👋</span>
          </Typography>
          <Typography variant="bodySmall" style={{ color: theme.gold, marginTop: '4px' }}>
            Bugün ne <span style={{ fontWeight: 800 }}>öğrenmek</span> istersin?
          </Typography>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: '16px', 
            padding: '8px 12px',
            border: `1px solid rgba(255,255,255,0.1)`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>🔥</span>
            <div>
              <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 800, lineHeight: 1 }}>{streak}</Typography>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px' }}>Günlük Seri</Typography>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ 
              width: '48px', height: '48px', 
              borderRadius: '50%', 
              background: '#2D8A4E', 
              border: `2px solid ${theme.success}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <span style={{ fontSize: '24px' }}>👨🏻</span>
            </div>
            <div style={{ 
              background: theme.success, 
              color: '#FFF', 
              fontSize: '10px', 
              fontWeight: 800, 
              padding: '2px 8px', 
              borderRadius: '10px',
              marginTop: '-12px',
              zIndex: 2,
              border: '2px solid #052A1E'
            }}>
              Seviye {level}
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Bar Row */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ 
          flex: 1, 
          background: 'rgba(255,255,255,0.05)', 
          backdropFilter: 'blur(16px)', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          height: '56px'
        }}>
          <Search size={20} color="rgba(255,255,255,0.5)" />
          <input 
            type="text" 
            placeholder="Sure, dua, hadis veya makale ara..." 
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              color: '#FFF', 
              padding: '0 12px',
              outline: 'none',
              fontSize: '14px'
            }} 
          />
          <Mic size={20} color="rgba(255,255,255,0.5)" style={{ cursor: 'pointer' }} />
        </div>
        
        <button style={{
          height: '56px',
          padding: '0 20px',
          borderRadius: '24px',
          background: 'rgba(15, 143, 87, 0.2)',
          border: '1px solid rgba(15, 143, 87, 0.5)',
          color: theme.success,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 700,
          cursor: 'pointer'
        }}>
          <Sparkles size={18} />
          AI Asistan
        </button>
      </div>
    </div>
  );
}
