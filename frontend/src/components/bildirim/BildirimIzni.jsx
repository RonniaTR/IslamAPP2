import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Clock, HeartHandshake, Moon, BookOpen } from 'lucide-react';
import { izinSorulsunMu, izinIste, sonraSor, sirali, tercihOku, tercihYaz } from '../../services/bildirim';

// 🔔 Bildirim ön izni — telefonun kendi izin sorusundan ÖNCE, neden istediğimizi anlatan kibar bir alt kart.
// Türler en çok kullanılan bölüme göre sıralanır; kullanıcı istemediğini kapatabilir. "Şimdi değil" 7 gün sonra tekrar sorar.

const ALTIN = '#D8B76A';
const IKON = { namaz: Clock, ilim: BookOpen, salavat: HeartHandshake, aksam: Moon };

export function TurListesi({ tercih, setTercih, saatler = false, acik = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sirali().map((tur, i) => {
        const Ikon = IKON[tur.id];
        const on = tercih[tur.id];
        return (
          <motion.label key={tur.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: `1px solid ${on ? 'rgba(216,183,106,0.35)' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer' }}>
            <span style={{ width: 38, height: 38, borderRadius: 12, background: on ? 'rgba(216,183,106,0.18)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Ikon size={18} color={on ? ALTIN : 'rgba(244,239,227,0.5)'} aria-hidden />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 14.5, color: '#F4EFE3' }}>{tur.ad}{i === 0 && <span style={{ marginInlineStart: 8, fontSize: 10.5, color: ALTIN, letterSpacing: 1 }}>EN ÇOK KULLANDIĞIN</span>}</span>
              <span style={{ display: 'block', fontSize: 12, color: 'rgba(244,239,227,0.6)' }}>{tur.alt}</span>
            </span>
            {saatler && tur.saat && on && acik && (
              <input type="time" value={tercih[tur.saat]} aria-label={`${tur.ad} saati`} onClick={(e) => e.stopPropagation()}
                onChange={(e) => setTercih({ ...tercih, [tur.saat]: e.target.value })}
                style={{ background: 'transparent', color: ALTIN, border: '1px solid rgba(216,183,106,0.35)', borderRadius: 10, padding: '4px 6px', fontSize: 13 }} />
            )}
            <input type="checkbox" checked={on} onChange={(e) => setTercih({ ...tercih, [tur.id]: e.target.checked })} aria-label={tur.ad}
              style={{ width: 22, height: 22, accentColor: ALTIN }} />
          </motion.label>
        );
      })}
    </div>
  );
}

export default function BildirimIzni() {
  const [goster, setGoster] = useState(false);
  const [tercih, setTercih] = useState(tercihOku);
  useEffect(() => {
    if (!izinSorulsunMu()) return undefined;
    const t = setTimeout(() => setGoster(true), 9000); // açılış ve gün kartı bittikten sonra
    return () => clearTimeout(t);
  }, []);
  const ver = async () => { tercihYaz({ ...tercihOku(), ...tercih }); await izinIste(); setGoster(false); };
  const sonra = () => { sonraSor(); setGoster(false); };

  return (
    <AnimatePresence>
      {goster && (
        <motion.div key="perde" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 2400, background: 'rgba(3,10,7,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <motion.div data-testid="bildirim-izni" role="dialog" aria-modal="true" aria-label="Bildirim izni"
            initial={{ y: 420 }} animate={{ y: 0 }} exit={{ y: 420 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            style={{ width: '100%', maxWidth: 480, background: 'linear-gradient(180deg, #0E3B2C 0%, #08241B 100%)', color: '#F4EFE3', borderRadius: '30px 30px 0 0', padding: '22px 18px calc(env(safe-area-inset-bottom, 0px) + 18px)', borderTop: `1px solid ${ALTIN}` }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
              <motion.span animate={{ rotate: [0, -14, 12, -8, 0] }} transition={{ duration: 1.2, delay: 0.4 }}
                style={{ width: 62, height: 62, borderRadius: 31, background: 'rgba(216,183,106,0.16)', border: `1px solid ${ALTIN}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={28} color={ALTIN} aria-hidden />
              </motion.span>
            </div>
            <h2 style={{ margin: '4px 0 4px', textAlign: 'center', fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 800 }}>İslamiApp sana bildirim gönderebilir mi?</h2>
            <p style={{ margin: '0 0 14px', textAlign: 'center', fontSize: 13.5, color: 'rgba(244,239,227,0.7)', lineHeight: 1.5 }}>
              Az ve yerinde: istemediğini şimdi kapat. Sıra, en çok kullandığın bölümlere göre; bu bilgi yalnız telefonunda durur.
            </p>
            <TurListesi tercih={tercih} setTercih={setTercih} />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button type="button" onClick={sonra} style={{ flex: 1, minHeight: 50, borderRadius: 25, border: '1px solid rgba(244,239,227,0.25)', background: 'transparent', color: '#F4EFE3', fontWeight: 700, fontSize: 15 }}>Şimdi değil</button>
              <button type="button" data-testid="bildirim-izin-ver" onClick={ver} style={{ flex: 1.4, minHeight: 50, borderRadius: 25, border: 'none', background: ALTIN, color: '#1A1A1A', fontWeight: 800, fontSize: 15 }}>İzin ver</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
