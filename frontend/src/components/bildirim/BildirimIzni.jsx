import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BellOff, Clock, HeartHandshake, Moon, BookOpen, Sparkles, X, ArrowRight } from 'lucide-react';
import {
  izinSorulsunMu,
  izinIste,
  sonraSor,
  sirali,
  tercihOku,
  tercihYaz,
  bildirimleriTamamenKapat,
  canliBildirimDinle,
  gunlukBildirimKapatildiMi,
  gunlukBildirimKapat,
  HAL_DUGMELER,
  halAyeti,
} from '../../services/bildirim';

// 🔔 Akıllı Bildirim Sistemi:
// 1) İzin istendiğinde "İzin ver", "Şimdi değil" ve "Bildirimleri tamamen kapat" seçenekleri sunar.
// 2) Kapatılan bildirimler bir daha üst üste çıkmaz (localStorage günlük kilit + tamamenKapali anahtarı).
// 3) İzin verildiğinde (veya önizlemede) kullanıcının o anki düşüncesini/hâlini sorup ona uygun âyet çıkaran
//    ve namaz vaktini hatırlatan temalı animasyonlu bildirim kartını sunar.

const ALTIN = '#D8B76A';
const IKON = { namaz: Clock, ilim: BookOpen, salavat: HeartHandshake, aksam: Moon };

export function TurListesi({ tercih, setTercih, saatler = false, acik = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sirali().map((tur, i) => {
        const Ikon = IKON[tur.id];
        const on = !tercih.tamamenKapali && !!tercih[tur.id];
        return (
          <motion.label key={tur.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: `1px solid ${on ? 'rgba(216,183,106,0.45)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', opacity: tercih.tamamenKapali ? 0.5 : 1 }}>
            <span style={{ width: 38, height: 38, borderRadius: 12, background: on ? 'rgba(216,183,106,0.2)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Ikon size={18} color={on ? ALTIN : 'rgba(244,239,227,0.5)'} aria-hidden />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 14.5, color: '#F4EFE3' }}>{tur.ad}{i === 0 && <span style={{ marginInlineStart: 8, fontSize: 10.5, color: ALTIN, letterSpacing: 1 }}>ÖNERİLEN</span>}</span>
              <span style={{ display: 'block', fontSize: 12, color: 'rgba(244,239,227,0.68)' }}>{tur.alt}</span>
            </span>
            {saatler && tur.saat && on && acik && (
              <input type="time" value={tercih[tur.saat]} aria-label={`${tur.ad} saati`} onClick={(e) => e.stopPropagation()}
                onChange={(e) => setTercih({ ...tercih, tamamenKapali: false, [tur.saat]: e.target.value })}
                style={{ background: 'rgba(0,0,0,0.25)', color: ALTIN, border: '1px solid rgba(216,183,106,0.4)', borderRadius: 10, padding: '4px 6px', fontSize: 13 }} />
            )}
            <input type="checkbox" checked={on}
              onChange={(e) => setTercih({ ...tercih, tamamenKapali: false, [tur.id]: e.target.checked })}
              aria-label={tur.ad}
              style={{ width: 22, height: 22, accentColor: ALTIN }} />
          </motion.label>
        );
      })}
    </div>
  );
}

export default function BildirimIzni({ sadeceCanli = false }) {
  const navigate = useNavigate();
  const [goster, setGoster] = useState(false);
  const [tercih, setTercih] = useState(tercihOku);
  const [canli, setCanli] = useState(null); // { tip: 'hal' | 'namaz', vakitAd?: string }
  const [secilenHal, setSecilenHal] = useState(null);
  const [ayet, setAyet] = useState(null);

  useEffect(() => {
    const unsub = canliBildirimDinle((olay) => {
      setSecilenHal(null);
      setAyet(null);
      setCanli(olay);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (sadeceCanli) return undefined;
    const t = tercihOku();
    if (t.tamamenKapali) return undefined;
    if (izinSorulsunMu()) {
      const id = setTimeout(() => setGoster(true), 3500);
      return () => clearTimeout(id);
    }
    // İzin verilmişse ve bugün hâl/âyet bildirimi henüz kapatılmadıysa günde yalnızca 1 kez zarifçe göster
    if (t.izin === 'verildi' && t.aksam && !gunlukBildirimKapatildiMi('hal')) {
      const id = setTimeout(() => {
        setCanli({ tip: 'hal' });
      }, 4000);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [sadeceCanli]);

  const ver = async () => {
    tercihYaz({ ...tercihOku(), ...tercih, tamamenKapali: false });
    await izinIste();
    setGoster(false);
    // İzin verilir verilmez temalı hâl/âyet bildirimini göster
    setSecilenHal(null);
    setAyet(null);
    setCanli({ tip: 'hal' });
  };

  const sonra = () => {
    sonraSor();
    setGoster(false);
  };

  const tamamenKapat = async () => {
    const yeni = await bildirimleriTamamenKapat(true);
    setTercih(yeni);
    setGoster(false);
    setCanli(null);
  };

  const canliKapat = () => {
    if (canli?.tip) gunlukBildirimKapat(canli.tip);
    gunlukBildirimKapat('hal');
    setCanli(null);
    setSecilenHal(null);
    setAyet(null);
  };

  const halSec = async (h) => {
    setSecilenHal(h);
    const sonuc = await halAyeti(h.id);
    setAyet(sonuc);
    gunlukBildirimKapat('hal');
  };

  return (
    <>
      {/* 1) Tek seferlik izin kartı (tamamen kapatma düğmeli) */}
      <AnimatePresence>
        {goster && (
          <motion.div key="perde" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={sonra}
            style={{ position: 'fixed', inset: 0, zIndex: 2400, background: 'rgba(3,10,7,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div data-testid="bildirim-izni" role="dialog" aria-modal="true" aria-label="Bildirim izni"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 420 }} animate={{ y: 0 }} exit={{ y: 420 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              style={{ width: '100%', maxWidth: 480, background: 'linear-gradient(180deg, #0E3B2C 0%, #08241B 100%)', color: '#F4EFE3', borderRadius: '30px 30px 0 0', padding: '20px 18px calc(env(safe-area-inset-bottom, 0px) + 18px)', borderTop: `1.5px solid ${ALTIN}`, position: 'relative' }}>
              <button type="button" onClick={sonra} aria-label="Kapat"
                style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 17, border: '1px solid rgba(244,239,227,0.2)', background: 'rgba(255,255,255,0.06)', color: '#F4EFE3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <motion.span animate={{ rotate: [0, -14, 12, -8, 0] }} transition={{ duration: 1.1, delay: 0.2 }}
                  style={{ width: 58, height: 58, borderRadius: 29, background: 'rgba(216,183,106,0.18)', border: `1.5px solid ${ALTIN}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={26} color={ALTIN} aria-hidden />
                </motion.span>
              </div>
              <h2 style={{ margin: '4px 0 4px', textAlign: 'center', fontFamily: '"Fraunces", serif', fontSize: 21, fontWeight: 800, color: '#F4EFE3' }}>
                Hâline Göre Âyet ve Vakit Hatırlatması
              </h2>
              <p style={{ margin: '0 0 12px', textAlign: 'center', fontSize: 13, color: 'rgba(244,239,227,0.75)', lineHeight: 1.5 }}>
                Sana düşünceni sorup uygun Kur&apos;an âyeti çıkaran ve namaz vaktini hatırlatan temalı bildirimleri açmak ister misin?
              </p>
              <TurListesi tercih={tercih} setTercih={setTercih} />
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={sonra} style={{ flex: 1, minHeight: 48, borderRadius: 24, border: '1px solid rgba(244,239,227,0.25)', background: 'transparent', color: '#F4EFE3', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Şimdi değil
                </button>
                <button type="button" data-testid="bildirim-izin-ver" onClick={ver} style={{ flex: 1.4, minHeight: 48, borderRadius: 24, border: 'none', background: ALTIN, color: '#1A1A1A', fontWeight: 800, fontSize: 14.5, cursor: 'pointer' }}>
                  İzin ver ve aç
                </button>
              </div>
              <button type="button" data-testid="bildirim-tamamen-kapat" onClick={tamamenKapat}
                style={{ width: '100%', marginTop: 10, padding: '8px', borderRadius: 14, border: 'none', background: 'transparent', color: 'rgba(244,239,227,0.65)', fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
                <BellOff size={14} /> Bildirimleri tamamen kapat (bir daha sorma)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2) Temalı & Animasyonlu Canlı Bildirim Kartı (Hâl/Düşünce -> Âyet & Namaz Vakti) */}
      <AnimatePresence>
        {canli && (
          <motion.div
            key="canli-bildirim"
            data-testid="canli-bildirim-karti"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={canliKapat}
            style={{ position: 'fixed', inset: 0, zIndex: 2450, background: 'rgba(6, 18, 13, 0.58)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
            <motion.div
              initial={{ scale: 0.86, y: 28, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 420,
                borderRadius: 28,
                overflow: 'hidden',
                background: ayet
                  ? 'linear-gradient(165deg, #FFFDF7 0%, #FBF0D1 60%, #F2DEA8 100%)'
                  : 'linear-gradient(165deg, #0E3D2C 0%, #072218 100%)',
                color: ayet ? '#14261C' : '#F5EFE2',
                border: `2px solid ${ALTIN}`,
                boxShadow: '0 24px 60px rgba(0,0,0,0.48), 0 0 36px rgba(216,183,106,0.32)',
                position: 'relative',
                padding: '22px 20px 18px',
              }}>
              {/* Sağ üst kapatma düğmesi */}
              <button
                type="button"
                onClick={canliKapat}
                aria-label="Bildirimi kapat"
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  border: `1px solid ${ayet ? 'rgba(20,38,28,0.2)' : 'rgba(245,239,226,0.25)'}`,
                  background: ayet ? 'rgba(20,38,28,0.08)' : 'rgba(255,255,255,0.08)',
                  color: ayet ? '#14261C' : '#F5EFE2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                <X size={16} />
              </button>

              {canli.tip === 'namaz' ? (
                /* 🕌 Namaz Vakti Temalı Bildirim */
                <div style={{ textAlign: 'center' }}>
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: 64, height: 64, borderRadius: 32, margin: '0 auto 12px', background: 'rgba(216,183,106,0.18)', border: `1.5px solid ${ALTIN}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={28} color={ALTIN} />
                  </motion.div>
                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 2, color: ALTIN, textTransform: 'uppercase' }}>
                    VAKİT HATIRLATMASI
                  </span>
                  <h3 style={{ margin: '6px 0 8px', fontFamily: '"Fraunces", Georgia, serif', fontSize: 23, fontWeight: 800, color: '#F5EFE2' }}>
                    {canli.vakitAd || 'Namaz Vakti Yaklaşıyor'} 🕌
                  </h3>
                  <p style={{ margin: '0 0 18px', fontSize: 14, lineHeight: 1.6, color: 'rgba(245,239,226,0.85)' }}>
                    {canli.mesaj || 'Günün telaşına kısa bir nefes verip kalbini huzurla dinlendirme vakti.'}
                  </p>
                  <button
                    type="button"
                    onClick={canliKapat}
                    style={{ width: '100%', minHeight: 46, borderRadius: 23, border: 'none', background: ALTIN, color: '#14261C', fontWeight: 800, fontSize: 14.5, cursor: 'pointer' }}>
                    Huzurla Kapat
                  </button>
                </div>
              ) : !ayet ? (
                /* 🌙 1. Aşama: Düşüncesini / Hâlini Soran Animasyonlu Kart */
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <motion.span
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      style={{ width: 42, height: 42, borderRadius: 21, background: 'rgba(216,183,106,0.2)', border: `1.5px solid ${ALTIN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles size={20} color={ALTIN} />
                    </motion.span>
                    <div>
                      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6, color: ALTIN, textTransform: 'uppercase' }}>
                        KALBİNİN SESİ · HÂL BİLDİRİMİ
                      </span>
                      <h3 style={{ margin: '2px 0 0', fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, fontWeight: 800, color: '#F5EFE2' }}>
                        Şu an kalbinden ne geçiyor?
                      </h3>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 14px', fontSize: 13.5, color: 'rgba(245,239,226,0.8)', lineHeight: 1.5 }}>
                    Günün nasıl geçiyor? İçindeki hâli seç; sana özel bir Kur&apos;an âyeti ve teselli mesajı açılsın:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {HAL_DUGMELER.map((h, i) => (
                      <motion.button
                        key={h.id}
                        type="button"
                        data-testid={`hal-sec-${h.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => halSec(h)}
                        style={{
                          padding: '13px 12px',
                          borderRadius: 18,
                          border: '1.5px solid rgba(216,183,106,0.4)',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#F5EFE2',
                          fontWeight: 800,
                          fontSize: 14,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          cursor: 'pointer',
                          textAlign: 'start',
                        }}>
                        <span style={{ fontSize: 19 }}>{h.emoji}</span>
                        <span>{h.title}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                /* ✨ 2. Aşama: Seçilen Hâle Özel Açılan Işıltılı Âyet Kartı */
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(13, 92, 47, 0.12)', border: '1px solid rgba(13, 92, 47, 0.3)', color: '#0D5C2F', fontSize: 11, fontWeight: 800, marginBottom: 12 }}>
                    <span>{secilenHal?.emoji || '✨'}</span>
                    <span>{secilenHal?.title} diyen kalbine bir âyet</span>
                  </div>
                  <div style={{ padding: '16px 16px', borderRadius: 20, background: '#FFFDF9', border: '1.5px solid rgba(212, 175, 55, 0.55)', boxShadow: '0 8px 22px rgba(0,0,0,0.06)', marginBottom: 12 }}>
                    <p style={{ margin: 0, fontFamily: 'var(--font-okuma)', fontSize: 16.5, lineHeight: 1.75, fontWeight: 600, color: '#17261F' }}>
                      “{ayet.meal}”
                    </p>
                    <p style={{ margin: '10px 0 0', fontSize: 12.5, fontWeight: 800, color: '#8A6310' }}>
                      — {ayet.ref}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => {
                        const s = ayet.s;
                        const a = ayet.a;
                        canliKapat();
                        navigate(`/ayet-tablosu?s=${s}&a=${a}`);
                      }}
                      style={{ flex: 1, minHeight: 44, borderRadius: 22, border: '1.5px solid #0D5C2F', background: 'transparent', color: '#0D5C2F', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
                      Âyet Tablosu <ArrowRight size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={canliKapat}
                      style={{ flex: 1, minHeight: 44, borderRadius: 22, border: 'none', background: '#0D5C2F', color: '#FFFDF7', fontWeight: 800, fontSize: 13.5, cursor: 'pointer' }}>
                      Tamam
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Alt kısım: Bildirimleri tamamen kapatma seçeneği */}
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${ayet ? 'rgba(20,38,28,0.12)' : 'rgba(245,239,226,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={tamamenKapat}
                  style={{ border: 'none', background: 'transparent', color: ayet ? '#5C4A2F' : 'rgba(245,239,226,0.65)', fontSize: 11.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', padding: 0 }}>
                  <BellOff size={13} /> Bildirimleri tamamen kapat
                </button>
                <button
                  type="button"
                  onClick={() => { canliKapat(); navigate('/bildirimler'); }}
                  style={{ border: 'none', background: 'transparent', color: ayet ? '#0D5C2F' : ALTIN, fontSize: 11.5, fontWeight: 800, cursor: 'pointer', padding: 0 }}>
                  Ayarlar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
