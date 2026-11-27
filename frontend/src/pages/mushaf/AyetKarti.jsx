import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Pause, Copy, Share2, BookmarkPlus, Check, Image as ImageIcon, BookOpen, ChevronDown, Minus, Plus } from 'lucide-react';
import { useTx } from '../../i18n';
import { fetchMeal, fetchTafsir, mealCredit } from '../../services/mealService';
import { SURAHS, verseAudioUrl } from '../../data/surahData';
import { addToDefter } from '../DefterPage';

// 🕋 AYET KARTI — Mushaf'ta bir ayete dokununca o ayet ÖNE GELİR: büyük, tek başına, altında meali.
//   · Ayet metni kaynaktan geldiği gibi, sabit kâğıt üzerinde ve tek renk yazılır (Kurul ilkesi; tema yok).
//   · Meal QuranEnc'ten (Rowad) DEĞİŞTİRİLMEDEN gelir; dipnotlar ve künye ayrıca gösterilir.
//   · Kısa tefsir (Muhtasar) açılır-kapanır; dinle, kopyala, paylaş, deftere ekle, Ayet Tablosu.
//   · Sağa-sola kaydırınca ya da oklarla sayfadaki önceki/sonraki ayete geçilir.
// Meal ve tefsir sure başına bir kez yüklenir ve bellekte tutulur (sonraki dokunuşlarda anında görünür).

const FONT = "'Amiri', 'Scheherazade New', serif";
const KAGIT = '#FBF8F0';
const MUREKKEP = '#1A1A1A';
const CIZGI = '#B8A77A';
const KART = '#FFFDF8';
const YAZI = '#2A2418';
const SOLUK = '#7A6C4C';
const ALTIN = '#8B6914';
const BOY = 'ayet_karti_boy';

const toArabicDigits = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

// Sure başına meal/tefsir önbelleği (oturum boyunca)
const mealOnbellek = new Map();
const tefsirOnbellek = new Map();
export function mealOnYukle(sure) {
  if (!mealOnbellek.has(sure)) mealOnbellek.set(sure, fetchMeal(sure, 'tr').catch(() => null));
  return mealOnbellek.get(sure);
}
function tefsirYukle(sure) {
  if (!tefsirOnbellek.has(sure)) tefsirOnbellek.set(sure, fetchTafsir(sure, 'tr').catch(() => null));
  return tefsirOnbellek.get(sure);
}

export default function AyetKarti({ ayetler, indis, onIndis, onKapat }) {
  const navigate = useNavigate();
  const tt = useTx();
  const a = ayetler[indis];
  const [meal, setMeal] = useState(null);        // { text, footnotes, credit } | 'yok'
  const [tefsir, setTefsir] = useState(null);
  const [tefsirAcik, setTefsirAcik] = useState(false);
  const [dipnotAcik, setDipnotAcik] = useState(false);
  const [caliyor, setCaliyor] = useState(false);
  const [durum, setDurum] = useState('');        // kopyalandi | eklendi | zaten
  const [yon, setYon] = useState(0);
  const [boy, setBoy] = useState(() => { try { return Number(localStorage.getItem(BOY)) || 30; } catch { return 30; } });
  const ses = useRef(null);

  const sure = SURAHS[a.surah - 1];
  const sureAd = sure ? sure.name : String(a.surah);

  useEffect(() => {
    let canli = true;
    setMeal(null); setTefsir(null); setDurum(''); setDipnotAcik(false);
    mealOnYukle(a.surah).then((m) => {
      if (!canli) return;
      const satir = m?.ayahs?.find((x) => x.aya === a.n);
      setMeal(satir ? { text: satir.text, footnotes: satir.footnotes || '', credit: mealCredit(m.source, m.version) } : 'yok');
    });
    tefsirYukle(a.surah).then((t) => {
      if (!canli) return;
      const satir = t?.ayahs?.find((x) => x.aya === a.n);
      setTefsir(satir ? { text: satir.text, credit: mealCredit(t.source, t.version) } : null);
    });
    return () => { canli = false; };
  }, [a.surah, a.n]);

  // Ses: ayet değişince durur
  useEffect(() => () => { if (ses.current) { ses.current.pause(); ses.current = null; } }, []);
  useEffect(() => { if (ses.current) { ses.current.pause(); ses.current = null; } setCaliyor(false); }, [indis]);

  const dinle = () => {
    if (caliyor && ses.current) { ses.current.pause(); setCaliyor(false); return; }
    try {
      const au = new Audio(verseAudioUrl(a.surah, a.n));
      ses.current = au;
      au.onended = () => setCaliyor(false);
      au.onerror = () => setCaliyor(false);
      au.play().then(() => setCaliyor(true)).catch(() => setCaliyor(false));
    } catch { setCaliyor(false); }
  };

  const git = (d) => { const n = indis + d; if (n >= 0 && n < ayetler.length) { setYon(d); onIndis(n); } };
  const metin = () => {
    const m = meal && meal !== 'yok' ? meal.text : '';
    return `${a.text}\n\n${m}\n\n(${sureAd} ${a.n})${meal && meal !== 'yok' ? `\n${tt('Meal')}: ${meal.credit}` : ''}`;
  };
  const kopyala = async () => { try { await navigator.clipboard.writeText(metin()); setDurum('kopyalandi'); setTimeout(() => setDurum(''), 1600); } catch { /* izin yok */ } };
  const paylas = () => { if (navigator.share) navigator.share({ title: `${sureAd} ${a.n}`, text: metin() }).catch(() => {}); else kopyala(); };
  const deftere = () => setDurum(addToDefter({ surah: a.surah, ayah: a.n, ar: a.text, meal: meal && meal !== 'yok' ? meal.text : '' }) ? 'eklendi' : 'zaten');
  const boyDegis = (d) => { const v = Math.max(22, Math.min(46, boy + d)); setBoy(v); try { localStorage.setItem(BOY, String(v)); } catch { /* kota */ } };

  const dugme = { height: 42, padding: '0 14px', borderRadius: 21, border: `1px solid #E6DCC2`, background: '#FFFFFF', color: YAZI, fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 };
  const kucuk = { width: 36, height: 36, borderRadius: 18, border: `1px solid #E6DCC2`, background: '#FFFFFF', color: YAZI, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

  return (
    <motion.div key="perde" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onKapat}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(30,24,12,0.5)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <motion.div data-testid="ayah-sheet" onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, scale: 0.94, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: KART, color: YAZI, borderRadius: '28px 28px 0 0', boxShadow: '0 -16px 40px rgba(0,0,0,0.25)', overflow: 'hidden', willChange: 'transform' }}>
        {/* Başlık */}
        <div style={{ padding: '10px 16px 8px' }}>
          <div style={{ width: 44, height: 5, borderRadius: 3, background: '#D9CDAE', margin: '0 auto 10px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700 }}>{sureAd} · {a.n}. {tt('ayet')}</span>
              <span style={{ fontSize: 11.5, color: SOLUK }}>{a.juz ? `${tt('Cüz')} ${a.juz} · ` : ''}{indis + 1} / {ayetler.length} {tt('bu sayfada')}</span>
            </span>
            <span style={{ marginInlineStart: 'auto', display: 'flex', gap: 6 }}>
              <button type="button" aria-label={tt('Yazıyı küçült')} onClick={() => boyDegis(-3)} style={kucuk}><Minus size={15} /></button>
              <button type="button" aria-label={tt('Yazıyı büyüt')} onClick={() => boyDegis(3)} style={kucuk}><Plus size={15} /></button>
              <button type="button" aria-label={tt('Kapat')} onClick={onKapat} style={kucuk}><X size={17} /></button>
            </span>
          </div>
        </div>

        {/* Gövde: ayet + meal (kaydırınca önceki/sonraki ayet) */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${a.surah}:${a.n}`}
              initial={{ opacity: 0, x: -yon * 36 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: yon * 36 }} transition={{ duration: 0.2 }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} dragDirectionLock
              onDragEnd={(_, info) => { if (info.offset.x > 80) git(1); else if (info.offset.x < -80) git(-1); }}
              style={{ padding: '4px 16px 18px', touchAction: 'pan-y' }}>
              {/* Ayet: sabit kâğıt, çift çizgili çerçeve */}
              <div data-testid="ayet-on" style={{ background: KAGIT, border: `1px solid ${CIZGI}`, boxShadow: `inset 0 0 0 3px ${KAGIT}, inset 0 0 0 4px ${CIZGI}`, borderRadius: 14, padding: '18px 16px 14px' }}>
                <p dir="rtl" lang="ar" style={{ margin: 0, fontFamily: FONT, color: MUREKKEP, fontSize: boy, lineHeight: 2, textAlign: 'center' }}>
                  {a.text}{' '}<span style={{ fontSize: '0.75em', whiteSpace: 'nowrap' }}>﴿{toArabicDigits(a.n)}﴾</span>
                  {a.sajda ? <span title={tt('Secde ayeti')} style={{ fontSize: '0.75em' }}> ۩</span> : null}
                </p>
              </div>

              {/* Meal */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: SOLUK }}>{tt('Meali')}</div>
                {meal === null && <div className="yuk-satir" style={{ marginTop: 8 }}><span /><span /><span style={{ width: '60%' }} /></div>}
                {meal === 'yok' && <p style={{ margin: '6px 0 0', fontSize: 14, color: SOLUK }}>{tt('Meal şu an alınamadı. İnternet bağlantını kontrol et; meal paketi indirildiyse bağlantısız da açılır.')}</p>}
                {meal && meal !== 'yok' && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-okuma)', fontSize: 18, lineHeight: 1.7, color: YAZI }}>{meal.text}</p>
                    {meal.footnotes && (
                      <button type="button" onClick={() => setDipnotAcik(!dipnotAcik)} style={{ marginTop: 8, background: 'none', border: 'none', padding: 0, color: ALTIN, fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                        {tt('Dipnot')} <ChevronDown size={14} style={{ transform: dipnotAcik ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                      </button>
                    )}
                    {dipnotAcik && <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.55, color: SOLUK, whiteSpace: 'pre-line' }}>{meal.footnotes}</p>}
                    <p style={{ margin: '8px 0 0', fontSize: 10.5, color: '#A2967A' }}>{tt('Meal')}: {meal.credit}</p>
                  </motion.div>
                )}
              </div>

              {/* Kısa tefsir */}
              {tefsir && (
                <div style={{ marginTop: 14, borderRadius: 16, background: '#F6F0E1', border: '1px solid #EADFC4' }}>
                  <button type="button" onClick={() => setTefsirAcik(!tefsirAcik)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'none', border: 'none', color: YAZI, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
                    <BookOpen size={15} color={ALTIN} /> {tt('Kısa tefsir')}
                    <ChevronDown size={16} style={{ marginInlineStart: 'auto', transform: tefsirAcik ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                  </button>
                  {tefsirAcik && (
                    <div style={{ padding: '0 14px 12px' }}>
                      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65 }}>{tefsir.text}</p>
                      <p style={{ margin: '6px 0 0', fontSize: 10.5, color: '#A2967A' }}>{tefsir.credit}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* İşlemler */}
        <div style={{ borderTop: '1px solid #EFE6CF', padding: '10px 12px calc(12px + env(safe-area-inset-bottom))' }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
            <button type="button" onClick={dinle} style={{ ...dugme, background: YAZI, color: KAGIT, border: 'none' }}>{caliyor ? <Pause size={15} /> : <Play size={15} />} {tt(caliyor ? 'Durdur' : 'Dinle')}</button>
            <button type="button" onClick={kopyala} style={dugme}>{durum === 'kopyalandi' ? <Check size={15} /> : <Copy size={15} />} {tt(durum === 'kopyalandi' ? 'Kopyalandı' : 'Kopyala')}</button>
            <button type="button" onClick={paylas} style={dugme}><Share2 size={15} /> {tt('Paylaş')}</button>
            <button type="button" onClick={deftere} style={dugme}>{durum === 'eklendi' || durum === 'zaten' ? <Check size={15} /> : <BookmarkPlus size={15} />} {tt(durum === 'eklendi' ? 'Deftere eklendi' : durum === 'zaten' ? 'Zaten defterinde' : 'Defterime ekle')}</button>
            <button type="button" onClick={() => navigate(`/ayet-tablosu?s=${a.surah}&a=${a.n}`)} style={dugme}><ImageIcon size={15} /> {tt('Ayet tablosu')}</button>
            <button type="button" onClick={() => navigate(`/quran/${a.surah}`)} style={dugme}><BookOpen size={15} /> {tt('Sureyi aç')}</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* Mushaf sağdan sola: "sonraki" sağ kenardaki oktur */}
            <button type="button" onClick={() => git(1)} disabled={indis >= ayetler.length - 1} style={{ ...dugme, flex: 1, justifyContent: 'center', opacity: indis >= ayetler.length - 1 ? 0.4 : 1 }}><ChevronLeft size={16} /> {tt('Sonraki ayet')}</button>
            <button type="button" onClick={() => git(-1)} disabled={indis <= 0} style={{ ...dugme, flex: 1, justifyContent: 'center', opacity: indis <= 0 ? 0.4 : 1 }}>{tt('Önceki ayet')} <ChevronRight size={16} /></button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
