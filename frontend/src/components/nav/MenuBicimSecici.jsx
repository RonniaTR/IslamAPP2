import React from 'react';
import { Check } from 'lucide-react';
import { MENU_BICIMLERI, menuBicimiSec, useMenuBicimi } from '../../services/menuBicimi';
import { BicimOnizleme } from './MenuBicimleri';

// Ayarlar > Menü biçimi: her biçim küçük bir çizimle; dokununca alt menü hemen değişir.
export default function MenuBicimSecici({ theme, tt = (x) => x }) {
  const secili = useMenuBicimi();
  return (
    <div data-testid="menu-bicim-secici" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10 }}>
      {MENU_BICIMLERI.map((b) => {
        const on = b.id === secili;
        return (
          <button key={b.id} type="button" data-testid={`menu-bicim-${b.id}`} aria-pressed={on} onClick={() => menuBicimiSec(b.id)}
            style={{ textAlign: 'left', padding: 0, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', background: theme.cardBg || theme.card,
              border: on ? `2px solid ${theme.gold || '#D8B76A'}` : `1px solid ${theme.cardBorder}`, position: 'relative' }}>
            <BicimOnizleme id={b.id} />
            <div style={{ padding: '8px 10px 10px' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: theme.textPrimary }}>{tt(b.ad)}{b.id === 'yelpaze' && <span style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted }}> · {tt('varsayılan')}</span>}</div>
              <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2, lineHeight: 1.35 }}>{tt(b.alt)}</div>
            </div>
            {on && <span style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, background: theme.gold || '#D8B76A', color: '#2A1E05', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={14} strokeWidth={3} /></span>}
          </button>
        );
      })}
    </div>
  );
}
