import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, Check } from 'lucide-react';

// 🔢 ODA KODU — İlim Arenası odalarının beş haneli kodu.
// Gösterim: her rakam kemer biçimli bir taşın içinde, taşlar arasında küçük altın yıldızlar; taşlar sırayla yerine oturur.
// Giriş: beş kutu; yazdıkça bir sonrakine geçer, yapıştırılan kodu dağıtır.

const ALTIN = '#D8B76A';

function Yildizcik() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden style={{ flexShrink: 0 }}>
      <rect x="2" y="2" width="6" height="6" fill={ALTIN} /><rect x="2" y="2" width="6" height="6" fill={ALTIN} transform="rotate(45 5 5)" />
    </svg>
  );
}

export default function OdaKodu({ kod, oda }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const metin = `İslamiApp İlim Arenası'na gel! ${oda ? `"${oda}" odası, ` : ''}oda kodu: ${kod}`;
  const kopyala = async () => { try { await navigator.clipboard.writeText(kod); setKopyalandi(true); setTimeout(() => setKopyalandi(false), 1600); } catch { /* izin yok */ } };
  const paylas = async () => { try { if (navigator.share) await navigator.share({ text: metin }); else await kopyala(); } catch { /* vazgeçildi */ } };

  return (
    <div data-testid="oda-kodu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2.4, color: ALTIN }}>ODA KODU</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} aria-label={`Oda kodu ${kod.split('').join(' ')}`}>
        {kod.split('').map((r, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Yildizcik />}
            <motion.span initial={{ y: -24, opacity: 0, rotate: -8 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ delay: 0.08 * i, type: 'spring', stiffness: 260, damping: 14 }}
              style={{ width: 46, height: 60, borderRadius: '23px 23px 10px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Fraunces", serif', fontSize: 30, fontWeight: 800, fontVariantNumeric: 'tabular-nums',
                color: '#F6EFDD', background: 'linear-gradient(180deg, #14523F 0%, #0B3326 100%)', border: `1.5px solid ${ALTIN}`, boxShadow: '0 6px 0 #06201A, inset 0 1px 0 rgba(255,255,255,0.12)' }}>
              {r}
            </motion.span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={kopyala} style={{ minHeight: 40, padding: '0 14px', borderRadius: 20, border: `1px solid ${ALTIN}`, background: 'transparent', color: ALTIN, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          {kopyalandi ? <Check size={15} /> : <Copy size={15} />} {kopyalandi ? 'Kopyalandı' : 'Kopyala'}
        </button>
        <button type="button" onClick={paylas} style={{ minHeight: 40, padding: '0 14px', borderRadius: 20, border: 'none', background: ALTIN, color: '#1A1A1A', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <Share2 size={15} /> Davet et
        </button>
      </div>
    </div>
  );
}

export function KodGirisi({ deger, onDegis, theme }) {
  const refs = useRef([]);
  const hane = Array.from({ length: 5 }, (_, i) => deger[i] || '');
  const yaz = (i, v) => {
    const sadece = v.replace(/\D/g, '');
    if (sadece.length > 1) { const yeni = (deger.slice(0, i) + sadece).slice(0, 5); onDegis(yeni); refs.current[Math.min(4, yeni.length)]?.focus(); return; }
    const dizi = hane.slice(); dizi[i] = sadece; const yeni = dizi.join('').slice(0, 5);
    onDegis(yeni);
    if (sadece && i < 4) refs.current[i + 1]?.focus();
  };
  const tus = (i, e) => { if (e.key === 'Backspace' && !hane[i] && i > 0) refs.current[i - 1]?.focus(); };
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }} role="group" aria-label="Beş haneli oda kodu">
      {hane.map((h, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} value={h} inputMode="numeric" autoComplete="one-time-code" maxLength={i === 0 ? 5 : 1}
          data-testid={`kod-${i}`} aria-label={`${i + 1}. hane`} onChange={(e) => yaz(i, e.target.value)} onKeyDown={(e) => tus(i, e)}
          style={{ width: 48, height: 58, borderRadius: '24px 24px 10px 10px', textAlign: 'center', fontSize: 26, fontWeight: 800, fontFamily: '"Fraunces", serif', outline: 'none',
            background: theme.inputBg, color: theme.textPrimary, border: `2px solid ${h ? theme.gold : theme.inputBorder}` }} />
      ))}
    </div>
  );
}
