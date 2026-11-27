import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTx } from '../../i18n';
import { alfa, karistir, ustYazi } from '../../styles/renk';

// ✨ ÖNE ÇIKAN İLİM MODÜLLERİ — Keşfet vitrini.
// Eski düzenin ruhu korunur (renkli şerit kart, simge, rozet, ok) ama:
//   · Renkler AKTİF TEMADAN türetilir (her modül tema renkleri arasında kendi tonunu alır).
//   · Simge sivri KEMER PENCERE içinde durur; sağda yavaşça dönen sekiz köşeli yıldız ve girih çizgileri.
//   · İlk modül geniş "vitrin" kartıdır. Hareketler yalnız transform/opacity (CSS).

function KemerPencere({ Icon, renk, dolgu, boy = 64 }) {
  return (
    <span style={{ position: 'relative', width: boy, height: boy * 1.2, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={boy} height={boy * 1.2} viewBox="0 0 64 77" aria-hidden style={{ position: 'absolute', inset: 0 }}>
        <path d="M4 76 V34 C4 18 16 7 32 2 C48 7 60 18 60 34 V76 Z" fill={dolgu} stroke={renk} strokeWidth="1.4" />
        <path d="M11 76 V36 C11 24 20 15 32 10 C44 15 53 24 53 36 V76" fill="none" stroke={renk} strokeWidth="0.7" opacity="0.55" />
      </svg>
      <Icon size={boy * 0.42} color={renk} style={{ position: 'relative', marginTop: boy * 0.14 }} aria-hidden />
    </span>
  );
}

function SekizYildizSus({ renk, boy }) {
  return (
    <svg className="ilim-yildiz" width={boy} height={boy} viewBox="0 0 100 100" aria-hidden style={{ position: 'absolute', right: -boy * 0.28, top: '50%', marginTop: -boy / 2, pointerEvents: 'none' }}>
      <g fill="none" stroke={renk} strokeWidth="1.2">
        <rect x="22" y="22" width="56" height="56" /><rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="18" /><circle cx="50" cy="50" r="40" strokeDasharray="2 5" />
      </g>
    </svg>
  );
}

export default function IlimModulleri({ moduller }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const koyu = theme.isDark;
  const tonlar = [0.95, 0.7, 0.12, 0.38, 0.55, 0.25, 0.82];
  // Tek renkli temalarda (ör. Işıltı) kartlar birbirinden ayrılsın diye koyuluk da sırayla değişir
  const koyuluk = [0.08, 0.24, 0.16, 0.32, 0.12, 0.28, 0.2];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} data-testid="ilim-modulleri">
      {moduller.map((m, i) => {
        const vurgu = karistir(theme.primary, theme.gold, tonlar[i % tonlar.length]);
        const k = koyuluk[i % koyuluk.length];
        const zemin = koyu
          ? `linear-gradient(120deg, ${karistir(theme.surface, vurgu, 0.58 - k)} 0%, ${karistir(theme.surface, vurgu, 0.2 - k / 2)} 100%)`
          : `linear-gradient(120deg, ${karistir(vurgu, '#000000', k)} 0%, ${karistir(vurgu, '#000000', k + 0.3)} 100%)`;
        const yazi = koyu ? (theme.cream || '#F4EFE3') : ustYazi(karistir(vurgu, '#000000', k + 0.15));
        const vitrin = i === 0;
        return (
          <button key={m.path} type="button" onClick={() => navigate(m.path)} className="gir-yukari mod-kart" data-testid={`ilim-${m.path.slice(1)}`}
            style={{ '--s': i, position: 'relative', overflow: 'hidden', width: '100%', textAlign: 'start', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              padding: vitrin ? '20px 18px' : '14px 16px', minHeight: vitrin ? 150 : 104, borderRadius: vitrin ? 30 : 24, background: zemin, color: yazi,
              border: `1px solid ${alfa(koyu ? vurgu : '#FFFFFF', koyu ? 0.35 : 0.18)}`, boxShadow: koyu ? '0 16px 32px -22px rgba(0,0,0,0.9)' : `0 16px 30px -22px ${alfa(karistir(vurgu, '#000000', 0.5), 0.9)}` }}>
            <SekizYildizSus renk={alfa(yazi, 0.16)} boy={vitrin ? 190 : 140} />
            <KemerPencere Icon={m.icon} renk={yazi} dolgu={alfa(yazi, 0.12)} boy={vitrin ? 72 : 56} />
            <span style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5, paddingInlineEnd: 34 }}>
              <span style={{ alignSelf: 'flex-start', fontSize: 9.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 8, background: alfa(yazi, 0.16), border: `1px solid ${alfa(yazi, 0.3)}` }}>{tt(m.badge)}</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: vitrin ? 21 : 17, fontWeight: 700, lineHeight: 1.2 }}>{tt(m.title)}</span>
              <span style={{ fontSize: 12.5, lineHeight: 1.45, opacity: 0.82, display: '-webkit-box', WebkitLineClamp: vitrin ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tt(m.desc)}</span>
            </span>
            <span style={{ position: 'absolute', right: 14, bottom: 14, width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: alfa(yazi, 0.16), border: `1px solid ${alfa(yazi, 0.28)}` }}>
              <ArrowRight size={16} color={yazi} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
