import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronDown, Lock } from 'lucide-react';
import { useAppMode } from '../contexts/AppModeContext';
import { useLang } from '../contexts/LangContext';
import { playGate } from '../services/donusAudio';
import sfx from '../services/sfx';
import { GECE, KemerliKapi, Yildizlar, reducedMotion } from './giris/giriSahne';

// 🚪🚪 MOD SEÇİMİ — iki kapı.
//   Mihrap kapısı (Yetişkin): ahşap, altın geçmeli; açılınca nur ve ney.
//   Bahçe kapısı (Çocuk): yeşil, çiçekli; açılınca güneşli bahçe ve neşeli bir tını.
// Seçilen kapı açılır, diğeri söner; kapı açıldığında mod kaydedilir.

function KapiKarti({ tone, title, desc, open, dim, onClick, testid }) {
  const kids = tone === 'bahce';
  return (
    <motion.button type="button" onClick={onClick} data-testid={testid}
      initial={{ opacity: 0, y: 28 }} animate={{ opacity: dim ? 0.25 : 1, y: 0, scale: open ? 1.04 : 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} whileTap={{ scale: 0.97 }}
      style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '18px 12px 16px', borderRadius: 26,
        background: kids ? 'linear-gradient(180deg, rgba(255,212,94,0.10), rgba(70,179,119,0.10))' : 'linear-gradient(180deg, rgba(216,183,106,0.10), rgba(14,59,44,0.25))',
        border: `1px solid ${open ? (kids ? '#FFD45E' : GECE.gold) : GECE.line}`, cursor: 'pointer', color: GECE.ink }}>
      <div style={{ width: '78%', aspectRatio: '0.72', maxWidth: 150 }}>
        <KemerliKapi open={open} tone={tone} duration={reducedMotion() ? 0.2 : 1.1} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800, fontFamily: kids ? "'Nunito', sans-serif" : 'var(--font-heading, "Fraunces", serif)', color: kids ? '#FFE08A' : GECE.gold }}>{title}</div>
        <div style={{ fontSize: 12, lineHeight: 1.45, color: GECE.soft, marginTop: 4 }}>{desc}</div>
      </div>
    </motion.button>
  );
}

export default function ModeSelector({ onComplete }) {
  const { setAppMode } = useAppMode();
  const { lang, setLang, LANGUAGES } = useLang();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [selected, setSelected] = useState(null);

  const choose = (mode) => {
    if (selected) return;
    setSelected(mode);
    try {
      if (mode === 'adult') playGate('kapi', { door: true });
      else sfx.levelUp();
    } catch { /* ses yok */ }
    setTimeout(() => { setAppMode(mode); onComplete(mode); }, reducedMotion() ? 250 : 1250);
  };

  return (
    <div data-testid="mode-selector" style={{ minHeight: '100vh', background: GECE.bg, color: GECE.ink, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 18px' }}>
      <Yildizlar count={40} />

      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 26, zIndex: 2 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading, "Fraunces", serif)', fontSize: 30, fontWeight: 800 }}>Hangi kapıdan girelim?</h1>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: GECE.soft }}>Dilediğin zaman Ayarlar'dan değiştirebilirsin.</p>
      </motion.div>

      <div style={{ display: 'flex', gap: 14, width: '100%', maxWidth: 460, zIndex: 2 }}>
        <KapiKarti tone="mihrap" title="Yetişkin" desc="Kur'an, namaz, dua, ilim ve kişisel yolun" testid="mode-adult"
          open={selected === 'adult'} dim={selected === 'child'} onClick={() => choose('adult')} />
        <KapiKarti tone="bahce" title="Çocuk" desc="Hikâyeler, oyunlar, namaz yolu; ebeveyn kontrolüyle" testid="mode-child"
          open={selected === 'child'} dim={selected === 'adult'} onClick={() => choose('child')} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 24, padding: 14, borderRadius: 18, maxWidth: 460, width: '100%', zIndex: 2,
          background: 'rgba(255,255,255,0.035)', border: `1px solid ${GECE.line}` }}>
        <Lock size={16} color={GECE.gold} style={{ flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: GECE.soft }}>
          Çocuk modunda reklam, sohbet ve yabancılarla iletişim yoktur; çocuğun ilerlemesi yalnız bu cihazda tutulur.
        </p>
      </motion.div>

      <div style={{ marginTop: 22, position: 'relative', zIndex: 3 }}>
        <button type="button" onClick={() => setShowLangDropdown(!showLangDropdown)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', minHeight: 40, borderRadius: 20, background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${GECE.line}`, color: GECE.soft, fontSize: 13 }}>
          <Globe size={14} />
          <span style={{ fontWeight: 700, color: GECE.ink }}>{LANGUAGES.find((l) => l.code === lang)?.name || 'Türkçe'}</span>
          <ChevronDown size={14} />
        </button>
        {showLangDropdown && (
          <div style={{ position: 'absolute', bottom: 46, left: '50%', transform: 'translateX(-50%)', background: '#0B1F18', border: `1px solid ${GECE.line}`,
            borderRadius: 16, padding: 6, minWidth: 170, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
            {LANGUAGES.map((l) => (
              <button type="button" key={l.code} onClick={() => { setLang(l.code); setShowLangDropdown(false); }}
                style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%', padding: '9px 12px', borderRadius: 10, color: GECE.ink, fontSize: 14,
                  background: lang === l.code ? 'rgba(216,183,106,0.14)' : 'transparent' }}>
                <span>{l.flag}</span><span>{l.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
