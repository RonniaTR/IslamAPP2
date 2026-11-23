import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { APP_NAME } from '../../config/brand';

// Gizlilik ve hesap silme sayfalarının ortak çerçevesi: açık zemin, okunaklı satır uzunluğu.
// Giriş gerektirmez; mağaza formlarına yazılan web adresleri doğrudan bu sayfaları açar.
export const KAGIT = { bg: '#FBF8F1', card: '#FFFFFF', text: '#1F2A24', muted: '#55625B', border: '#E7DFCC', gold: '#9C7A2E', accent: '#0E3B2C' };

export default function LegalShell({ title, children, testid }) {
  const navigate = useNavigate();
  const back = () => { if (window.history.length > 1) navigate(-1); else navigate('/'); };
  return (
    <div data-testid={testid} style={{ minHeight: '100vh', background: KAGIT.bg, color: KAGIT.text }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 5, background: 'rgba(251,248,241,0.94)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${KAGIT.border}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button type="button" onClick={back} aria-label="Geri" style={{ width: 44, height: 44, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: KAGIT.text }}>
            <ChevronLeft size={24} />
          </button>
          <span style={{ fontWeight: 800, color: KAGIT.accent }}>{APP_NAME}</span>
        </div>
      </header>
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '20px 20px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading, "Fraunces", serif)', fontSize: 32, lineHeight: 1.2, margin: '6px 0 14px', color: KAGIT.accent }}>{title}</h1>
        {children}
      </main>
    </div>
  );
}

export function Bolum({ id, title, children }) {
  return (
    <section id={id} style={{ marginTop: 26 }}>
      <h2 style={{ fontSize: 19, margin: '0 0 8px', color: KAGIT.accent }}>{title}</h2>
      <div style={{ fontSize: 15.5, lineHeight: 1.7, color: KAGIT.text }}>{children}</div>
    </section>
  );
}
