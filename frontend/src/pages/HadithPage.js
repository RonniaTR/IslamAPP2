import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookmarkPlus, CheckCircle2, Loader2, Search, Sparkles, Volume2, X, Link2, Share2,
  ChevronLeft, ChevronRight, Minus, Plus, RotateCw, Languages,
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import api from '../api';
import localHadiths from '../data/hadiths.json';
import { ayikla, ozet, okunus } from './hadis/hadisMetni';
import { alfa, karistir } from '../styles/renk';

// 📜 HADİS-İ ŞERİFLER — kartlı, tane tane okunan yapı.
//  • Her hadis bir KART: önce Efendimizin (s.a.v.) sözü (sade Türkçe, okuma harfiyle), altında kaynak ve sıhhat.
//    Uzun râvi zinciri ve tahrîc notları kartı boğmaz; okuma kâğıdında ayrı sekmelerde durur.
//  • OKUMA KÂĞIDI (kart dokununca alttan açılır, sağa-sola kaydırınca sonraki/önceki hadis):
//      Anlam · Arapça (metin; "tane tane" kelime kelime, kelimeye dokununca tahlil) · Okunuş (Arapça okumayanlar
//      ve yabancılar için Latin harfli, yaklaşık) · Sened (râvi zinciri).
//  • Günün hadisi: çevrilen kart (önü Türkçe, arkası Arapça + okunuş).
// Renkler aktif temadan gelir. Veri cihazdadır; sunucu varsa daha geniş seçki ondan gelir.

const SAYFA = 20;
const BOY_ANAHTAR = 'hadis_yazi_boyu';

function gununIndisi(n) {
  const d = new Date();
  const k = d.getFullYear() * 1000 + Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
  return k % n;
}

function SahihRozet({ h, theme, tt }) {
  if (!h.authenticity && !h.grade) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 22, padding: '0 8px', borderRadius: 11, fontSize: 10.5, fontWeight: 700, background: alfa('#10B981', 0.14), color: theme.isDark ? '#6EE7B7' : '#047857' }}>
      <CheckCircle2 size={11} /> {tt(h.authenticity || h.grade)}
    </span>
  );
}

function RaviZinciri({ chain, theme, tt }) {
  if (!chain || !chain.chain || !chain.chain.length) return null;
  const renk = (r) => (r === 'sika' ? '#10B981' : r === 'saduk' ? '#F59E0B' : '#EF4444');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 10 }}>
      {chain.chain.map((ravi, i) => (
        <React.Fragment key={i}>
          <span style={{ fontSize: 11.5, padding: '3px 9px', borderRadius: 12, background: alfa(renk(ravi.reliability), 0.14), color: renk(ravi.reliability), fontWeight: 600 }}>{ravi.name}</span>
          {i < chain.chain.length - 1 && <span style={{ color: theme.textSecondary }}>→</span>}
        </React.Fragment>
      ))}
      {chain.grade && <span style={{ width: '100%', fontSize: 11, color: theme.textSecondary }}>{tt('Hüküm')}: {chain.grade_label || chain.grade}</span>}
    </div>
  );
}

export default function HadithPage() {
  const { lang } = useLang() || {};
  const { user } = useAuth();
  const { theme } = useTheme();
  const tt = useTx();
  const [hadiths, setHadiths] = useState(localHadiths);
  const [secili, setSecili] = useState('all');
  const [sorgu, setSorgu] = useState('');
  const [gosterilen, setGosterilen] = useState(SAYFA);
  const [acik, setAcik] = useState(null);       // okuma kâğıdındaki hadisin filtrelenmiş listedeki sırası
  const [sekme, setSekme] = useState('anlam');
  const [yon, setYon] = useState(0);
  const [cevrik, setCevrik] = useState(false);  // günün hadisi kartı
  const [taneTane, setTaneTane] = useState(false);
  const [okuDil, setOkuDil] = useState(lang === 'en' ? 'en' : 'tr');
  const [boy, setBoy] = useState(() => { try { return Number(localStorage.getItem(BOY_ANAHTAR)) || 18; } catch { return 18; } });
  const [audioLoadingId, setAudioLoadingId] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [wordPopup, setWordPopup] = useState(null);
  const [wordLoading, setWordLoading] = useState(false);
  const [raviData, setRaviData] = useState({});
  const [raviLoading, setRaviLoading] = useState(null);
  const [aiExplain, setAiExplain] = useState({});
  const [explainLoading, setExplainLoading] = useState(null);
  const [detailLevel, setDetailLevel] = useState('ozet');
  const audioRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    api.get('/hadith/all').then((r) => { if (mounted && Array.isArray(r.data) && r.data.length > localHadiths.length) setHadiths(r.data); }).catch(() => {});
    return () => { mounted = false; if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, []);

  // Metinler bir kez bölümlenir (sened/metin, râvi/söz/tahrîc)
  const hazir = useMemo(() => hadiths.map((h) => ({ ...h, _: ayikla(h) })), [hadiths]);
  const kategoriler = useMemo(() => {
    const m = new Map();
    hazir.forEach((h) => { const id = h.categoryId || h.category; if (id) m.set(id, { id, ad: h.category || id, n: (m.get(id)?.n || 0) + 1 }); });
    return [...m.values()];
  }, [hazir]);
  const katRenk = useCallback((id) => {
    const i = Math.max(0, kategoriler.findIndex((k) => k.id === id));
    return karistir(theme.primary, theme.gold, (i % 5) / 4);
  }, [kategoriler, theme.primary, theme.gold]);

  const filtreli = useMemo(() => {
    const q = sorgu.trim().toLocaleLowerCase('tr');
    return hazir.filter((h) => {
      const kat = secili === 'all' || h.categoryId === secili || h.category === secili;
      if (!kat) return false;
      if (!q) return true;
      return [h._.soz, h.theme, h.bookTr, h.source, h.category].filter(Boolean).join(' ').toLocaleLowerCase('tr').includes(q);
    });
  }, [hazir, secili, sorgu]);
  useEffect(() => { setGosterilen(SAYFA); }, [secili, sorgu]);

  // Günün hadisi: kısa ve sözü net ayrılmış olanlardan
  const gunun = useMemo(() => {
    const aday = hazir.filter((h) => h._.soz && h._.soz.length > 40 && h._.soz.length < 260 && h._.metin.length < 320);
    return aday.length ? aday[gununIndisi(aday.length)] : hazir[0];
  }, [hazir]);

  const h = acik != null ? filtreli[acik] : null;

  const boyDegis = (d) => { const v = Math.max(14, Math.min(26, boy + d)); setBoy(v); try { localStorage.setItem(BOY_ANAHTAR, String(v)); } catch { /* kota */ } };
  const ac = (i) => { setYon(0); setSekme('anlam'); setTaneTane(false); setAcik(i); };
  const git = (d) => {
    if (acik == null) return;
    const n = acik + d;
    if (n < 0 || n >= filtreli.length) return;
    setYon(d); setTaneTane(false); setAcik(n);
    if (n >= gosterilen) setGosterilen(n + 1);
  };

  // ── Sunucu özellikleri (bağlantı yoksa düğmeler sessizce bir şey yapmaz) ──
  const stopAudio = () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } setPlayingId(null); setAudioLoadingId(null); };
  const handlePlay = async (x) => {
    if (playingId === x.id) { stopAudio(); return; }
    stopAudio(); setAudioLoadingId(x.id);
    try {
      const { data } = await api.post('/tts', { text: [x._.soz, `Kaynak: ${x.source}`].filter(Boolean).join('. ') });
      const audio = new Audio(`data:audio/${data.format || 'mp3'};base64,${data.audio}`);
      audioRef.current = audio; audio.onended = () => { audioRef.current = null; setPlayingId(null); };
      await audio.play(); setPlayingId(x.id);
    } catch { setPlayingId(null); } finally { setAudioLoadingId(null); }
  };
  const handleSave = async (x) => {
    if (!user) return;
    setSavingId(x.id);
    try {
      await api.post('/notes', { type: 'hadith', title: `${x.theme} • ${x.source}`, content: [x._.soz, x._.metin].filter(Boolean).join('\n\n'), scholar_name: x.source });
      setSavedId(x.id); setTimeout(() => setSavedId((c) => (c === x.id ? null : c)), 2200);
    } catch { /* bağlantı yok */ }
    setSavingId(null);
  };
  const paylas = (x) => {
    const metin = `“${x._.soz}”\n\n${x.source}${x.number ? `, ${x.number}` : ''}`;
    if (navigator.share) navigator.share({ title: tt('Hadis-i şerif'), text: metin }).catch(() => {});
    else navigator.clipboard?.writeText(metin).catch(() => {});
  };
  const handleWord = useCallback(async (word) => {
    if (wordLoading) return;
    setWordLoading(true);
    try { const { data } = await api.post('/hadith/v2/word-analysis', { word, language: lang === 'en' ? 'en' : 'tr' }); setWordPopup({ word, analysis: data.analysis }); }
    catch { setWordPopup({ word, analysis: null }); }
    finally { setWordLoading(false); }
  }, [wordLoading, lang]);
  const handleRavi = useCallback(async (id) => {
    if (raviData[id] || raviLoading) return;
    setRaviLoading(id);
    try { const { data } = await api.get(`/hadith/v2/ravi-chain/${id}`); setRaviData((p) => ({ ...p, [id]: data })); } catch { /* yok */ }
    finally { setRaviLoading(null); }
  }, [raviData, raviLoading]);
  const handleExplain = useCallback(async (x) => {
    if (aiExplain[x.id] || explainLoading) return;
    setExplainLoading(x.id);
    try {
      const { data } = await api.post('/hadith/v2/explain', { hadith_text: x._.soz || x.turkish, source: x.source, detail: detailLevel, language: lang === 'en' ? 'en' : 'tr' });
      setAiExplain((p) => ({ ...p, [x.id]: data.explanation }));
    } catch { /* yok */ }
    finally { setExplainLoading(null); }
  }, [aiExplain, explainLoading, detailLevel, lang]);

  const koyu = theme.isDark;
  const arRenk = koyu ? (theme.goldLight || theme.gold) : karistir(theme.gold, '#000000', 0.35);
  const kart = { background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 22 };
  const kucuk = { width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bg, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, cursor: 'pointer' };

  return (
    <div data-testid="hadith-page" style={{ minHeight: '100vh', background: theme.bg, color: theme.textPrimary, paddingBottom: 120 }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '18px 18px 0' }}>
        {/* Başlık */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: theme.gold }}>{hadiths.length} {tt('hadis')} · {tt('Sahîh-i Buhârî')}</span>
            <h1 style={{ margin: '2px 0 0', fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700 }}>{tt('Hadis-i Şerifler')}</h1>
          </div>
          <svg width="64" height="56" viewBox="0 0 64 56" aria-hidden>
            <line x1="32" y1="0" x2="32" y2="8" stroke={theme.gold} strokeWidth="1.2" />
            <circle cx="32" cy="20" r="12" fill={alfa(theme.gold, 0.18)} className="mod-pirilti" />
            <path d="M24 9 H40 L37 25 H27 Z" fill={alfa(theme.gold, 0.25)} stroke={theme.gold} strokeWidth="1.3" />
            <path className="mod-alev" d="M32 13 C29.5 16 29.5 18.5 32 20.5 C34.5 18.5 34.5 16 32 13 Z" fill={koyu ? '#FFF3C8' : theme.gold} style={{ transformOrigin: '32px 20px' }} />
            <path d="M32 54 C24 49 14 48 4 49 L4 33 C14 32 24 33 32 38 Z" fill={theme.surface} stroke={theme.gold} strokeWidth="1.3" />
            <path d="M32 54 C40 49 50 48 60 49 L60 33 C50 32 40 33 32 38 Z" fill={theme.surface} stroke={theme.gold} strokeWidth="1.3" />
          </svg>
        </div>

        {/* Günün hadisi — çevrilen kart */}
        {gunun && (
          <div style={{ perspective: 1200, marginTop: 14 }}>
            <motion.div data-testid="gunun-hadisi" animate={{ rotateY: cevrik ? 180 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              style={{ position: 'relative', transformStyle: 'preserve-3d', minHeight: 230 }}>
              {[false, true].map((arka) => (
                <div key={String(arka)} onClick={() => setCevrik(!cevrik)} role="button" tabIndex={0} aria-label={tt(arka ? 'Türkçesini göster' : 'Arapçasını göster')}
                  style={{ position: arka ? 'absolute' : 'relative', inset: 0, minHeight: 230, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: arka ? 'rotateY(180deg)' : 'none',
                    borderRadius: 26, padding: '18px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden',
                    background: koyu ? `linear-gradient(150deg, ${karistir(theme.surface, theme.gold, 0.12)}, ${theme.surface})` : `linear-gradient(150deg, ${karistir(theme.bg, theme.gold, 0.14)}, ${theme.surface})`,
                    border: `1px solid ${alfa(theme.gold, 0.35)}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: theme.gold }}>{tt('Günün hadisi')}</span>
                    <span style={{ marginInlineStart: 'auto', fontSize: 11, color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: 4 }}><RotateCw size={12} /> {tt(arka ? 'Türkçe' : 'Arapçası')}</span>
                  </div>
                  {!arka ? (
                    <p style={{ margin: 0, fontFamily: 'var(--font-okuma)', fontSize: 19, lineHeight: 1.6 }}>“{gunun._.soz}”</p>
                  ) : (
                    <>
                      <p dir="rtl" lang="ar" style={{ margin: 0, fontFamily: "'Amiri', serif", fontSize: 22, lineHeight: 1.9, color: arRenk, textAlign: 'right' }}>{gunun._.metin}</p>
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, fontStyle: 'italic', color: theme.textSecondary }}>{okunus(gunun._.metin, okuDil)}</p>
                    </>
                  )}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: theme.textSecondary }}>{gunun.source} · {gunun.number}</span>
                    <SahihRozet h={gunun} theme={theme} tt={tt} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Arama */}
        <label style={{ marginTop: 14, height: 48, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
          <Search size={17} color={theme.textSecondary} aria-hidden />
          <input value={sorgu} onChange={(e) => setSorgu(e.target.value)} placeholder={tt('Hadis, konu ya da kelime ara')} aria-label={tt('Ara')}
            style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: theme.textPrimary, fontSize: 14 }} />
          {sorgu && <button type="button" onClick={() => setSorgu('')} aria-label={tt('Temizle')} style={{ background: 'none', border: 'none', color: theme.textSecondary }}><X size={16} /></button>}
        </label>

        {/* Kategoriler */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '12px -18px 0', padding: '0 18px 4px' }}>
          {[{ id: 'all', ad: 'Tümü', n: hazir.length }, ...kategoriler].map((k) => {
            const sec = secili === k.id;
            const r = k.id === 'all' ? theme.gold : katRenk(k.id);
            return (
              <button key={k.id} type="button" onClick={() => setSecili(k.id)} style={{ flexShrink: 0, height: 38, padding: '0 14px', borderRadius: 19, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
                border: `1px solid ${sec ? r : theme.cardBorder}`, background: sec ? r : theme.surface, color: sec ? '#FFFFFF' : theme.textPrimary }}>
                {k.id !== 'all' && <span style={{ width: 8, height: 8, borderRadius: 4, background: sec ? '#FFFFFF' : r }} />}
                {tt(k.ad)} <span style={{ opacity: 0.65, fontWeight: 600 }}>{k.n}</span>
              </button>
            );
          })}
        </div>

        {/* Kartlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
          {filtreli.slice(0, gosterilen).map((x, i) => (
            <button key={x.id} type="button" onClick={() => ac(i)} className="gir-yukari mod-kart" data-testid={`hadith-${x.id}`}
              style={{ '--s': i % SAYFA, ...kart, padding: 0, textAlign: 'start', color: theme.textPrimary, cursor: 'pointer', display: 'flex', overflow: 'hidden' }}>
              <span style={{ width: 5, background: katRenk(x.categoryId || x.category) }} />
              <span style={{ flex: 1, padding: '14px 16px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: katRenk(x.categoryId || x.category) }}>{tt(x.category)}{x.theme && x.theme !== x.category ? ` · ${tt(x.theme)}` : ''}</span>
                  <span style={{ marginInlineStart: 'auto', fontSize: 11, color: theme.textSecondary }}>#{x.number}</span>
                </span>
                <span style={{ fontFamily: 'var(--font-okuma)', fontSize: 16, lineHeight: 1.6 }}>“{ozet(x._.soz, 200)}”</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11.5, color: theme.textSecondary }}>{tt('Buhârî')}, {tt(x.bookTr)}</span>
                  <SahihRozet h={x} theme={theme} tt={tt} />
                  <span style={{ marginInlineStart: 'auto', fontSize: 11.5, fontWeight: 700, color: theme.gold, display: 'flex', alignItems: 'center', gap: 2 }}>{tt('Oku')} <ChevronRight size={14} /></span>
                </span>
              </span>
            </button>
          ))}
          {!filtreli.length && <p style={{ textAlign: 'center', padding: 30, color: theme.textSecondary }}>{tt('Aramana uyan hadis bulunamadı.')}</p>}
          {gosterilen < filtreli.length && (
            <button type="button" onClick={() => setGosterilen(gosterilen + SAYFA)} style={{ height: 48, borderRadius: 24, border: `1px solid ${theme.gold}`, background: 'transparent', color: theme.gold, fontWeight: 700, fontSize: 14 }}>
              {tt('Daha fazla göster')} ({filtreli.length - gosterilen})
            </button>
          )}
        </div>
      </div>

      {/* ═══ OKUMA KÂĞIDI ═══ */}
      <AnimatePresence>
        {h && (
          <motion.div key="perde" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAcik(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div data-testid="hadis-kagidi" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 640, height: '94vh', background: theme.surface, borderRadius: '28px 28px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', willChange: 'transform' }}>
              {/* üst */}
              <div style={{ padding: '10px 18px 0' }}>
                <div style={{ width: 44, height: 5, borderRadius: 3, background: alfa(theme.textSecondary, 0.35), margin: '0 auto 10px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 5, background: katRenk(h.categoryId || h.category) }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: theme.textSecondary }}>{tt(h.category)} · {tt('Buhârî')} {h.number}</span>
                  <SahihRozet h={h} theme={theme} tt={tt} />
                  <span style={{ marginInlineStart: 'auto', display: 'flex', gap: 6 }}>
                    <button type="button" aria-label={tt('Yazıyı küçült')} onClick={() => boyDegis(-2)} style={kucuk}><Minus size={15} /></button>
                    <button type="button" aria-label={tt('Yazıyı büyüt')} onClick={() => boyDegis(2)} style={kucuk}><Plus size={15} /></button>
                    <button type="button" aria-label={tt('Kapat')} onClick={() => setAcik(null)} style={kucuk}><X size={16} /></button>
                  </span>
                </div>
                <div role="tablist" style={{ display: 'flex', gap: 4, marginTop: 12, padding: 4, borderRadius: 16, background: theme.bg, border: `1px solid ${theme.cardBorder}` }}>
                  {[['anlam', 'Anlam'], ['arapca', 'Arapça'], ['okunus', 'Okunuş'], ...(h._.sened ? [['sened', 'Sened']] : [])].map(([id, ad]) => (
                    <button key={id} role="tab" aria-selected={sekme === id} type="button" onClick={() => setSekme(id)}
                      style={{ flex: 1, height: 34, borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 700, background: sekme === id ? (koyu ? theme.gold : theme.primary) : 'transparent', color: sekme === id ? (koyu ? '#1A1406' : '#FFFFFF') : theme.textSecondary }}>
                      {tt(ad)}
                    </button>
                  ))}
                </div>
              </div>

              {/* gövde: sağa-sola kaydırınca hadis değişir */}
              <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
                <AnimatePresence mode="wait" custom={yon} initial={false}>
                  <motion.div key={`${h.id}-${sekme}`} custom={yon}
                    initial={{ opacity: 0, x: yon * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -yon * 40 }} transition={{ duration: 0.22 }}
                    drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25} dragDirectionLock
                    onDragEnd={(_, info) => { if (info.offset.x < -80) git(1); else if (info.offset.x > 80) git(-1); }}
                    style={{ padding: '16px 20px 24px', touchAction: 'pan-y' }}>
                    {sekme === 'anlam' && (
                      <>
                        {h._.ravi && <p style={{ margin: '0 0 10px', fontSize: 13, lineHeight: 1.55, fontStyle: 'italic', color: theme.textSecondary }}>{h._.ravi}:</p>}
                        <p style={{ margin: 0, fontFamily: 'var(--font-okuma)', fontSize: boy + 2, lineHeight: 1.7 }}>“{h._.soz}”</p>
                        {h._.tahric && (
                          <details style={{ marginTop: 14, fontSize: 12.5, color: theme.textSecondary }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 700 }}>{tt('Diğer rivayetler (tahrîc)')}</summary>
                            <p style={{ margin: '6px 0 0', lineHeight: 1.5 }}>{h._.tahric}</p>
                          </details>
                        )}
                        {/* Yapay zekâ açıklaması (isteğe bağlı) */}
                        <div style={{ marginTop: 16, padding: 14, borderRadius: 18, background: alfa(theme.gold, 0.08), border: `1px solid ${alfa(theme.gold, 0.2)}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <Sparkles size={14} color={theme.gold} />
                            <span style={{ fontSize: 12.5, fontWeight: 700 }}>{tt('Açıklama')}</span>
                            <span style={{ marginInlineStart: 'auto', display: 'flex', gap: 4 }}>
                              {[['ozet', 'Özet'], ['orta', 'Orta'], ['akademik', 'Akademik']].map(([id, ad]) => (
                                <button key={id} type="button" onClick={() => setDetailLevel(id)} style={{ height: 26, padding: '0 9px', borderRadius: 13, fontSize: 11, fontWeight: 700, border: 'none', background: detailLevel === id ? theme.gold : theme.bg, color: detailLevel === id ? '#1A1406' : theme.textSecondary }}>{tt(ad)}</button>
                              ))}
                            </span>
                          </div>
                          {aiExplain[h.id] ? (
                            <p style={{ margin: '8px 0 0', fontSize: 13.5, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{aiExplain[h.id]}</p>
                          ) : (
                            <button type="button" onClick={() => handleExplain(h)} disabled={explainLoading === h.id} style={{ marginTop: 10, height: 36, padding: '0 14px', borderRadius: 18, border: 'none', background: theme.gold, color: '#1A1406', fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                              {explainLoading === h.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} {tt('Bu hadisi açıkla')}
                            </button>
                          )}
                          <p style={{ margin: '8px 0 0', fontSize: 10.5, color: theme.textSecondary }}>{tt('Açıklama yapay zekâ ile hazırlanır; hadis metninin yerine geçmez.')}</p>
                        </div>
                      </>
                    )}

                    {sekme === 'arapca' && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <span style={{ fontSize: 12, color: theme.textSecondary }}>{tt('Efendimizin sözü (metin)')}</span>
                          <button type="button" onClick={() => setTaneTane(!taneTane)} style={{ marginInlineStart: 'auto', height: 30, padding: '0 12px', borderRadius: 15, fontSize: 12, fontWeight: 700, border: `1px solid ${theme.gold}`, background: taneTane ? theme.gold : 'transparent', color: taneTane ? '#1A1406' : theme.gold }}>
                            {tt('Tane tane')}
                          </button>
                        </div>
                        {taneTane ? (
                          <div dir="rtl" lang="ar" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {h._.metin.split(' ').filter(Boolean).map((w, i) => (
                              <button key={i} type="button" onClick={() => handleWord(w.replace(/[،,.:؛]/g, ''))} className="gir-yukari"
                                style={{ '--s': Math.min(i, 20), padding: '6px 12px', borderRadius: 14, background: theme.bg, border: `1px solid ${alfa(theme.gold, 0.3)}`, fontFamily: "'Amiri', serif", fontSize: boy + 8, lineHeight: 1.6, color: arRenk }}>
                                {w}
                              </button>
                            ))}
                            {wordLoading && <Loader2 size={16} className="animate-spin" color={theme.gold} />}
                          </div>
                        ) : (
                          <p dir="rtl" lang="ar" style={{ margin: 0, fontFamily: "'Amiri', serif", fontSize: boy + 10, lineHeight: 2.05, textAlign: 'right', color: arRenk }}>{h._.metin}</p>
                        )}
                        <p style={{ margin: '12px 0 0', fontSize: 11.5, color: theme.textSecondary }}>{tt('Tane tane kipinde bir kelimeye dokun: kökü ve anlamı açılır (bağlantı gerekir).')}</p>
                      </>
                    )}

                    {sekme === 'okunus' && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                          <Languages size={14} color={theme.gold} />
                          <span style={{ fontSize: 12, color: theme.textSecondary }}>{tt('Latin harfleriyle okunuş')}</span>
                          <span style={{ marginInlineStart: 'auto', display: 'flex', gap: 4 }}>
                            {[['tr', 'Türkçe'], ['en', 'International']].map(([id, ad]) => (
                              <button key={id} type="button" onClick={() => setOkuDil(id)} style={{ height: 28, padding: '0 10px', borderRadius: 14, fontSize: 11.5, fontWeight: 700, border: 'none', background: okuDil === id ? theme.gold : theme.bg, color: okuDil === id ? '#1A1406' : theme.textSecondary }}>{ad}</button>
                            ))}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: boy + 1, lineHeight: 1.75, fontStyle: 'italic' }}>{okunus(h._.metin, okuDil)}</p>
                        <p style={{ margin: '14px 0 0', fontSize: 11.5, color: theme.textSecondary, lineHeight: 1.5 }}>{tt('Okunuş harekeli metinden kendiliğinden çıkarılır; yaklaşıktır. Doğru telaffuz için Arapça metni bir bilene dinletin.')}</p>
                      </>
                    )}

                    {sekme === 'sened' && (
                      <>
                        <p style={{ margin: '0 0 8px', fontSize: 12.5, color: theme.textSecondary }}>{tt('Sened: hadisi Efendimizden (s.a.v.) bize ulaştıran râviler zinciri.')}</p>
                        <p dir="rtl" lang="ar" style={{ margin: 0, fontFamily: "'Amiri', serif", fontSize: boy + 4, lineHeight: 1.95, textAlign: 'right', color: theme.textSecondary }}>{h._.sened}</p>
                        {raviData[h.id] ? <RaviZinciri chain={raviData[h.id]} theme={theme} tt={tt} /> : (
                          <button type="button" onClick={() => handleRavi(h.id)} disabled={raviLoading === h.id} style={{ marginTop: 12, height: 36, padding: '0 14px', borderRadius: 18, border: `1px solid ${theme.gold}`, background: 'transparent', color: theme.gold, fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                            {raviLoading === h.id ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />} {tt('Râvileri çıkar')}
                          </button>
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* alt çubuk */}
              <div style={{ display: 'flex', gap: 8, padding: '10px 16px calc(14px + env(safe-area-inset-bottom))', borderTop: `1px solid ${theme.cardBorder}` }}>
                <button type="button" onClick={() => git(-1)} disabled={acik === 0} aria-label={tt('Önceki')} style={{ ...kucuk, width: 46, height: 46, borderRadius: 23, opacity: acik === 0 ? 0.4 : 1 }}><ChevronLeft size={19} /></button>
                <button type="button" onClick={() => handlePlay(h)} style={{ ...kucuk, width: 'auto', flex: 1, height: 46, borderRadius: 23, gap: 6, fontWeight: 700, fontSize: 13 }}>
                  {audioLoadingId === h.id ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />} {tt(playingId === h.id ? 'Durdur' : 'Dinle')}
                </button>
                <button type="button" onClick={() => handleSave(h)} style={{ ...kucuk, width: 'auto', flex: 1, height: 46, borderRadius: 23, gap: 6, fontWeight: 700, fontSize: 13 }}>
                  {savingId === h.id ? <Loader2 size={16} className="animate-spin" /> : savedId === h.id ? <CheckCircle2 size={16} /> : <BookmarkPlus size={16} />} {tt(savedId === h.id ? 'Kaydedildi' : 'Kaydet')}
                </button>
                <button type="button" onClick={() => paylas(h)} style={{ flex: 1, height: 46, borderRadius: 23, border: 'none', background: theme.gold, color: '#1A1406', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Share2 size={16} /> {tt('Paylaş')}</button>
                <button type="button" onClick={() => git(1)} disabled={acik >= filtreli.length - 1} aria-label={tt('Sonraki')} style={{ ...kucuk, width: 46, height: 46, borderRadius: 23, opacity: acik >= filtreli.length - 1 ? 0.4 : 1 }}><ChevronRight size={19} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kelime tahlili */}
      <AnimatePresence>
        {wordPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setWordPopup(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 160, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 320, borderRadius: 22, padding: 18, background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
              <p dir="rtl" lang="ar" style={{ margin: 0, textAlign: 'center', fontFamily: "'Amiri', serif", fontSize: 34, color: arRenk }}>{wordPopup.word}</p>
              <p style={{ margin: '2px 0 10px', textAlign: 'center', fontStyle: 'italic', color: theme.textSecondary }}>{okunus(wordPopup.word, okuDil)}</p>
              {wordPopup.analysis ? (
                [['root', 'Kök'], ['pattern', 'Kalıp (vezin)'], ['meaning', 'Anlam'], ['grammar', 'Gramer']].filter(([k]) => wordPopup.analysis[k]).map(([k, ad]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '6px 0', borderTop: `1px solid ${theme.cardBorder}`, fontSize: 13 }}>
                    <span style={{ color: theme.textSecondary }}>{tt(ad)}</span><span style={{ textAlign: 'right' }}>{wordPopup.analysis[k]}</span>
                  </div>
                ))
              ) : <p style={{ margin: 0, fontSize: 13, textAlign: 'center', color: theme.textSecondary }}>{tt('Kelime tahlili için bağlantı gerekiyor.')}</p>}
              <button type="button" onClick={() => setWordPopup(null)} style={{ marginTop: 12, width: '100%', height: 42, borderRadius: 21, border: 'none', background: theme.gold, color: '#1A1406', fontWeight: 700 }}>{tt('Tamam')}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
