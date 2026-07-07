import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Typography } from '../ui/Typography';

export function DailyChallengeSection() {
  return (
    <div style={{ padding: '0 24px 24px', display: 'flex', gap: '16px' }}>
      
      {/* Günlük Challenge Kartı */}
      <div style={{
        flex: 1,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow effect for treasure */}
        <div style={{ position: 'absolute', bottom: -20, right: -20, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(205,164,52,0.4) 0%, rgba(0,0,0,0) 70%)' }} />
        
        <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>
          Günlük Challenge
        </Typography>
        <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '16px', display: 'block' }}>
          <span style={{ color: '#FFF', fontWeight: 700 }}>3/5</span> Tamamlandı
        </Typography>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#2ECC71" />
            <Typography variant="caption" style={{ color: '#2ECC71' }}>Sabah duasını oku</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#2ECC71" />
            <Typography variant="caption" style={{ color: '#2ECC71' }}>1 hadis öğren</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#2ECC71" />
            <Typography variant="caption" style={{ color: '#2ECC71' }}>5 dk Kur'an oku</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Circle size={16} color="rgba(255,255,255,0.3)" />
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)' }}>1 sayfa kitap oku</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Circle size={16} color="rgba(255,255,255,0.3)" />
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)' }}>Akşam zikrini yap</Typography>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '16px', right: '16px', textAlign: 'center', zIndex: 2 }}>
          <span style={{ fontSize: '40px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>🎁</span>
          <Typography variant="bodySmall" style={{ color: '#CDA434', fontWeight: 800, fontSize: '13px', display: 'block', marginTop: '-4px' }}>
            +50 XP
          </Typography>
        </div>
      </div>

      {/* Bir Sonraki Rozet Kartı */}
      <div style={{
        flex: 1,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 800, fontSize: '14px', marginBottom: '16px' }}>
            Bir Sonraki Rozet
          </Typography>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', height: '48px', 
              background: 'linear-gradient(135deg, #CDA434 0%, #8C6C2E 100%)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(205,164,52,0.3)'
            }}>
              <span style={{ fontSize: '24px' }}>📖</span>
            </div>
            <div>
              <Typography variant="bodySmall" style={{ color: '#FFF', fontWeight: 700 }}>İlim Yolcusu</Typography>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)' }}>7/10 Görev</Typography>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>%70</Typography>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ width: '70%', height: '100%', background: '#CDA434', borderRadius: '2px' }} />
          </div>
          
          <button style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(15,143,87,0.2)',
            border: '1px solid rgba(15,143,87,0.5)',
            borderRadius: '12px',
            color: '#2ECC71',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}>
            Rozetleri Gör <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
