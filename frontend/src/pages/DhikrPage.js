import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Copy, Share2, ChevronRight, ChevronLeft, Minus, Plus, Compass, ListChecks, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { ZIKIRLER, DUALAR, DUA_KATEGORILERI } from '../data/zikirDua';
import { alfa, karistir } from '../styles/renk';

// 🤲 DUA VE ZİKİR — iki kanat:
//   ZİKİRLER: her zikir bir kart; dokununca gerçek tesbih ekranı açılır (/dhikr/:id) — taneler parmakla çekilir.
//   DUALAR:   sünnet duaları kategoriye göre; dokununca alttan okuma kâğıdı açılır: Arapça, okunuş, anlam, kaynak.
// Bütün renkler aktif temadan gelir. İçerik cihazdadır (bağlantı gerekmez).

const AR_BOY = 'dua_ar_boy';

function TesbihCizim({ renk, isik }) {
  const taneler = Array.from({ length: 21 }, (_, i) => {
    const a = (-0.1 + (i / 20) * 1.2) * Math.PI;
    return [70 + Math.cos(a) * 46, 52 + Math.sin(a) * 40];
  });
  return (
    <svg viewBox="0 0 150 110" width="100%" height="100%" aria-hidden>
      <circle cx="118" cy="26" r="15" fill={isik} />
      <circle cx="124" cy="21" r="13" fill="none" />
      <path d="M118 11 a15 15 0 1 0 10 26 a12 12 0 1 1 -10 -26 Z" fill={renk} opacity="0.9" />
      <path d={`M${taneler.map(([x, y]) => `${x} ${y}`).join(' L')}`} fill="none" stroke={renk} strokeWidth="0.8" opacity="0.6" />
      {taneler.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 10 ? 6 : 4.8} fill={i === 10 ? renk : isik} stroke={renk} strokeWidth="1.2" />)}
      <path d="M26 62 L20 86" stroke={renk} strokeWidth="1.4" />
      <ellipse cx="19" cy="92" rx="4" ry="7" fill={renk} />
      <g className="mod-salla" style={{ transformOrigin: '19px 99px' }}>{[-3, -1, 1, 3].map((d) => <line key={d} x1="19" y1="99" x2={19 + d} y2="109" stroke={renk} strokeWidth="1" />)}</g>
    </svg>
  );
}

export default function DhikrPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [sekme, setSekme] = useState('zikir');
  const [kat, setKat] = useState('hepsi');
  const [ara, setAra] = useState('');
  const [aramaAcik, setAramaAcik] = useState(false);
  const [okunan, setOkunan] = useState(null); // dua index
  const [arBoy, setArBoy] = useState(() => { try { return Number(localStorage.getItem(AR_BOY)) || 30; } catch { return 30; } });
  const [kopyalandi, setKopyalandi] = useState(false);

  const koyu = theme.isDark;
  const vurgu = karistir(theme.primary, theme.gold, 0.35);
  const arRenk = koyu ? (theme.goldLight || theme.gold) : karistir(theme.gold, '#000000', 0.3);
  const igne = ara.trim().toLocaleLowerCase('tr');
  const eslesir = (...p) => !igne || p.filter(Boolean).join(' ').toLocaleLowerCase('tr').includes(igne);

  const zikirler = useMemo(() => ZIKIRLER.filter((z) => eslesir(z.ad, z.kisa, z.fazilet, ...z.adim.map((a) => `${a.oku} ${a.anlam}`))), [igne]); // eslint bilinçli
  const dualar = useMemo(() => DUALAR.filter((d) => (kat === 'hepsi' || d.kat === kat) && eslesir(d.ad, d.ne, d.oku, d.anlam, d.kaynak)), [kat, igne]); // eslint bilinçli
  const [oneCikan, ...digerZikir] = zikirler;
  const dua = okunan != null ? dualar[okunan] : null;

  const boyDegis = (d) => { const v = Math.max(20, Math.min(46, arBoy + d)); setArBoy(v); try { localStorage.setItem(AR_BOY, String(v)); } catch { /* kota */ } };
  const metin = (d) => `${d.ad}\n\n${d.ar}\n\n${d.oku}\n\n${d.anlam}\n\n(${d.kaynak})`;
  const kopyala = async (d) => { try { await navigator.clipboard.writeText(metin(d)); setKopyalandi(true); setTimeout(() => setKopyalandi(false), 1600); } catch { /* izin yok */ } };
  const paylas = (d) => { if (navigator.share) navigator.share({ title: d.ad, text: metin(d) }).catch(() => {}); else kopyala(d); };

  const kart = { background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 20 };

  return (
    <div data-testid="dhikr-page" style={{ minHeight: '100vh', background: theme.bg, color: theme.textPrimary, paddingBottom: 120 }}>
      {/* ── Başlık ── */}
      <div style={{ padding: '18px 18px 0', maxWidth: 620, margin: '0 auto' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 26, minHeight: 150, display: 'flex',
          background: koyu ? `linear-gradient(140deg, ${karistir(theme.surface, vurgu, 0.4)}, ${theme.surface})` : `linear-gradient(140deg, ${karistir(theme.bg, vurgu, 0.2)}, ${karistir(theme.surface, vurgu, 0.05)})`,
          border: `1px solid ${alfa(theme.gold, 0.25)}` }}>
          <div style={{ flex: 1, padding: '18px 0 16px 18px', display: 'flex', flexDirection: 'column', gap: 6, zIndex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: koyu ? theme.gold : karistir(theme.gold, '#000', 0.25) }}>{tt('Her vakte')}</span>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700 }}>{tt('Dua ve Zikir')}</h1>
            <span style={{ fontSize: 12.5, color: theme.textSecondary, lineHeight: 1.4 }}>{ZIKIRLER.length} {tt('zikir')} · {DUALAR.length} {tt('sünnet duası')} · {tt('kaynaklı')}</span>
            <button type="button" onClick={() => navigate('/dhikr/serbest')} data-testid="serbest-tesbih"
              style={{ marginTop: 'auto', alignSelf: 'flex-start', height: 38, padding: '0 16px', borderRadius: 19, border: 'none', background: theme.gold, color: '#1A1406', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              📿 {tt('Tesbih çek')}
            </button>
          </div>
          <div style={{ width: '44%', minWidth: 140, padding: 8 }}><TesbihCizim renk={koyu ? theme.gold : karistir(vurgu, '#000', 0.2)} isik={koyu ? alfa(theme.gold, 0.18) : '#FFFFFF'} /></div>
        </div>

        {/* Kısa yollar */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto' }}>
          {[
            { ad: 'Kıble', ikon: Compass, yol: '/qibla' },
            { ad: 'Kaza takibi', ikon: ListChecks, yol: '/kaza' },
            { ad: 'Salavât Silsilesi', ikon: Sparkles, yol: '/salavat' },
            { ad: 'Hidayet duaları', ikon: Sparkles, yol: '/hazine/dualar' },
          ].map((k) => (
            <button key={k.yol} type="button" onClick={() => navigate(k.yol)} style={{ flexShrink: 0, height: 40, padding: '0 14px', borderRadius: 20, background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <k.ikon size={15} color={theme.gold} aria-hidden /> {tt(k.ad)}
            </button>
          ))}
        </div>

        {/* Sekmeler + arama */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
          <div role="tablist" style={{ flex: 1, display: 'flex', padding: 4, borderRadius: 18, background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
            {[{ id: 'zikir', ad: 'Zikirler' }, { id: 'dua', ad: 'Dualar' }].map((s) => (
              <button key={s.id} role="tab" aria-selected={sekme === s.id} type="button" onClick={() => setSekme(s.id)}
                style={{ flex: 1, height: 38, borderRadius: 14, border: 'none', fontSize: 14, fontWeight: 700, transition: 'background .2s, color .2s',
                  background: sekme === s.id ? (koyu ? theme.gold : theme.primary) : 'transparent', color: sekme === s.id ? (koyu ? '#1A1406' : '#FFFFFF') : theme.textSecondary }}>
                {tt(s.ad)}
              </button>
            ))}
          </div>
          <button type="button" aria-label={tt('Ara')} onClick={() => { setAramaAcik(!aramaAcik); if (aramaAcik) setAra(''); }}
            style={{ width: 46, height: 46, borderRadius: 23, background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {aramaAcik ? <X size={18} /> : <Search size={18} />}
          </button>
        </div>
        {aramaAcik && (
          <input autoFocus value={ara} onChange={(e) => setAra(e.target.value)} placeholder={tt('Zikir ya da dua ara')} aria-label={tt('Ara')}
            style={{ width: '100%', marginTop: 10, height: 46, borderRadius: 23, padding: '0 18px', background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, fontSize: 14, outline: 'none' }} />
        )}
      </div>

      <div style={{ padding: '14px 18px 0', maxWidth: 620, margin: '0 auto' }}>
        {sekme === 'zikir' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {oneCikan && (
              <button type="button" className="gir-yukari mod-kart" style={{ '--s': 0, ...kart, borderRadius: 24, padding: 18, textAlign: 'start', color: theme.textPrimary, cursor: 'pointer', border: `1px solid ${alfa(theme.gold, 0.35)}` }}
                onClick={() => navigate(`/dhikr/${oneCikan.id}`)} data-testid={`zikir-${oneCikan.id}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.gold }}>{tt(oneCikan.kisa)}</span>
                  <span style={{ marginInlineStart: 'auto', fontSize: 11, color: theme.textSecondary }}>{oneCikan.kaynak}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, margin: '4px 0 10px' }}>{tt(oneCikan.ad)}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {oneCikan.adim.map((a, i) => (
                    <span key={i} style={{ flex: '1 1 40%', minWidth: 120, padding: '10px 12px', borderRadius: 14, background: theme.bg, border: `1px solid ${theme.cardBorder}` }}>
                      <span dir="rtl" lang="ar" style={{ display: 'block', fontFamily: "'Amiri', serif", fontSize: a.ar.length > 40 ? 15 : 22, color: arRenk, lineHeight: 1.6, textAlign: 'right' }}>{a.ar}</span>
                      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginTop: 2 }}><span>{a.oku.split(',')[0]}</span><span style={{ color: theme.gold }}>×{a.hedef}</span></span>
                    </span>
                  ))}
                </div>
                <span style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, height: 38, padding: '0 16px', borderRadius: 19, background: theme.gold, color: '#1A1406', fontWeight: 700, fontSize: 13 }}>📿 {tt('Tesbihe başla')} <ChevronRight size={15} /></span>
              </button>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              {digerZikir.map((z, i) => {
                const a = z.adim[0];
                return (
                  <button key={z.id} type="button" onClick={() => navigate(`/dhikr/${z.id}`)} className="gir-yukari mod-kart" data-testid={`zikir-${z.id}`}
                    style={{ '--s': i + 1, ...kart, padding: 14, textAlign: 'start', color: theme.textPrimary, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 168 }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, color: theme.textSecondary, textTransform: 'uppercase' }}>{tt(z.kisa)}</span>
                      <span style={{ marginInlineStart: 'auto', fontSize: 11, fontWeight: 800, color: '#1A1406', background: theme.gold, borderRadius: 8, padding: '1px 7px' }}>×{a.hedef}</span>
                    </span>
                    <span dir="rtl" lang="ar" style={{ fontFamily: "'Amiri', serif", fontSize: a.ar.length > 50 ? 15 : a.ar.length > 25 ? 19 : 24, lineHeight: 1.65, color: arRenk, textAlign: 'right', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{a.ar}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{tt(z.ad)}</span>
                    <span style={{ fontSize: 11.5, color: theme.textSecondary, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tt(z.fazilet)}</span>
                  </button>
                );
              })}
            </div>
            {!zikirler.length && <Bos theme={theme} tt={tt} />}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -18px', padding: '0 18px 10px' }}>
              {[{ id: 'hepsi', ad: 'Tümü' }, ...DUA_KATEGORILERI].map((k) => {
                const n = k.id === 'hepsi' ? DUALAR.length : DUALAR.filter((d) => d.kat === k.id).length;
                const sec = kat === k.id;
                return (
                  <button key={k.id} type="button" onClick={() => setKat(k.id)} style={{ flexShrink: 0, height: 36, padding: '0 14px', borderRadius: 18, fontSize: 12.5, fontWeight: 700,
                    border: `1px solid ${sec ? theme.gold : theme.cardBorder}`, background: sec ? theme.gold : theme.surface, color: sec ? '#1A1406' : theme.textPrimary }}>
                    {tt(k.ad)} <span style={{ opacity: 0.6, fontWeight: 600 }}>{n}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dualar.map((d, i) => (
                <button key={d.id} type="button" onClick={() => setOkunan(i)} className="gir-yukari mod-kart" data-testid={`dua-${d.id}`}
                  style={{ '--s': Math.min(i, 10), ...kart, padding: '14px 14px 14px 16px', textAlign: 'start', color: theme.textPrimary, cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: alfa(theme.gold, 0.7) }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: theme.gold }}>{tt(d.ne)}</span>
                    <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700, margin: '2px 0 4px' }}>{tt(d.ad)}</span>
                    <span dir="rtl" lang="ar" style={{ display: 'block', fontFamily: "'Amiri', serif", fontSize: 18, color: arRenk, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.ar}</span>
                    <span style={{ display: 'block', fontSize: 12, color: theme.textSecondary, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tt(d.anlam)}</span>
                  </span>
                  <ChevronRight size={18} color={theme.textSecondary} />
                </button>
              ))}
              {!dualar.length && <Bos theme={theme} tt={tt} />}
            </div>
          </div>
        )}
      </div>

      {/* ── Dua okuma kâğıdı ── */}
      <AnimatePresence>
        {dua && (
          <motion.div key="perde" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOkunan(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div key={dua.id} data-testid="dua-kagidi" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }} onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 600) setOkunan(null); }}
              style={{ width: '100%', maxWidth: 620, maxHeight: '92vh', overflowY: 'auto', background: theme.surface, borderRadius: '28px 28px 0 0', padding: '10px 20px calc(24px + env(safe-area-inset-bottom))', willChange: 'transform' }}>
              <div style={{ width: 44, height: 5, borderRadius: 3, background: alfa(theme.textSecondary, 0.35), margin: '0 auto 12px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: theme.gold }}>{tt(dua.ne)}</span>
                <span style={{ marginInlineStart: 'auto', display: 'flex', gap: 6 }}>
                  <button type="button" aria-label={tt('Yazıyı küçült')} onClick={() => boyDegis(-3)} style={kucukDugme(theme)}><Minus size={15} /></button>
                  <button type="button" aria-label={tt('Yazıyı büyüt')} onClick={() => boyDegis(3)} style={kucukDugme(theme)}><Plus size={15} /></button>
                  <button type="button" aria-label={tt('Kapat')} onClick={() => setOkunan(null)} style={kucukDugme(theme)}><X size={16} /></button>
                </span>
              </div>
              <h2 style={{ margin: '6px 0 14px', fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700 }}>{tt(dua.ad)}</h2>
              <div style={{ borderRadius: 20, padding: '18px 16px', background: koyu ? karistir(theme.bg, theme.surface, 0.4) : karistir(theme.bg, '#FFFFFF', 0.5), border: `1px solid ${alfa(theme.gold, 0.25)}` }}>
                <p dir="rtl" lang="ar" style={{ margin: 0, fontFamily: "'Amiri', serif", fontSize: arBoy, lineHeight: 1.9, textAlign: 'right', color: arRenk }}>{dua.ar}</p>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={baslik(theme)}>{tt('Okunuşu')}</div>
                <p style={{ margin: '4px 0 0', fontSize: 16, lineHeight: 1.6, fontWeight: 600, fontStyle: 'italic' }}>{dua.oku}</p>
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={baslik(theme)}>{tt('Anlamı')}</div>
                <p style={{ margin: '4px 0 0', fontSize: 16.5, lineHeight: 1.65, fontFamily: 'var(--font-okuma)' }}>{tt(dua.anlam)}</p>
              </div>
              {dua.not && <p style={{ margin: '12px 0 0', fontSize: 13, lineHeight: 1.55, color: theme.textSecondary, padding: '10px 12px', borderRadius: 14, background: alfa(theme.gold, 0.08) }}>{tt(dua.not)}</p>}
              <div style={{ marginTop: 12, fontSize: 12, color: theme.textSecondary }}>{tt('Kaynak')}: <b style={{ color: theme.textPrimary }}>{dua.kaynak}</b></div>
              <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                <button type="button" disabled={okunan === 0} onClick={() => setOkunan(okunan - 1)} aria-label={tt('Önceki')} style={{ ...kucukDugme(theme), width: 46, height: 46, borderRadius: 23, opacity: okunan === 0 ? 0.4 : 1 }}><ChevronLeft size={18} /></button>
                <button type="button" onClick={() => kopyala(dua)} style={{ flex: 1, height: 46, borderRadius: 23, border: `1px solid ${theme.cardBorder}`, background: theme.bg, color: theme.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Copy size={16} /> {tt(kopyalandi ? 'Kopyalandı' : 'Kopyala')}</button>
                <button type="button" onClick={() => paylas(dua)} style={{ flex: 1, height: 46, borderRadius: 23, border: 'none', background: theme.gold, color: '#1A1406', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Share2 size={16} /> {tt('Paylaş')}</button>
                <button type="button" disabled={okunan >= dualar.length - 1} onClick={() => setOkunan(okunan + 1)} aria-label={tt('Sonraki')} style={{ ...kucukDugme(theme), width: 46, height: 46, borderRadius: 23, opacity: okunan >= dualar.length - 1 ? 0.4 : 1 }}><ChevronRight size={18} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Bos({ theme, tt }) {
  return <p style={{ textAlign: 'center', padding: 30, color: theme.textSecondary, fontSize: 14 }}>{tt('Aradığın bulunamadı.')}</p>;
}
function kucukDugme(theme) {
  return { width: 34, height: 34, borderRadius: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bg, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, cursor: 'pointer' };
}
function baslik(theme) {
  return { fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.textSecondary };
}
