import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, Pause, Share2, RefreshCw, Volume2, Check, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTx } from '../../i18n';
import { QURAN_PUBLIC } from '../../config/quranAccess';
import { SURAHS, verseAudioUrl } from '../../data/surahData';
import { fetchTafsir, mealCredit } from '../../services/mealService';
import { mealOnYukle } from '../../pages/mushaf/AyetKarti';
import { alfa, karistir } from '../../styles/renk';

// 📖 GÜNÜN AYETİ (Keşfet) — her gün bir ayet; "Farklı ayet" ile değişir.
//  • Arapça metin Mushaf ile aynı kaynaktan (Tanzil / alquran.cloud) alınır ve cihazda saklanır; ağ yoksa
//    kayıtlı kısa metin gösterilir (ayetin tamamı değilse sonuna "…" konur).
//  • Meal Rowad (QuranEnc) mealidir ve DEĞİŞTİRİLMEDEN gösterilir; künyesi altında yazar. Elle yazılmış meal yoktur.
//  • Uzun ayetlerde yazı boyu kendiliğinden küçülür: kart ekrana sığar, satırlar taşmaz.
//  • Kısa tefsir (Muhtasar) açılır-kapanır; arka plan kodla çizilen girih desenidir (dış resim yok).

const AYETLER = [
  { s: 94, a: 5, kisa: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', tam: true },
  { s: 13, a: 28, kisa: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', tam: true },
  { s: 3, a: 139, kisa: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ', tam: true },
  { s: 93, a: 7, kisa: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', tam: true },
  { s: 2, a: 152, kisa: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', tam: true },
  { s: 2, a: 286, kisa: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', tam: false },
  { s: 39, a: 53, kisa: 'لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا', tam: false },
  { s: 65, a: 3, kisa: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', tam: false },
  { s: 94, a: 6, kisa: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', tam: true },
  { s: 20, a: 114, kisa: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', tam: false },
];
const AR_ONBELLEK = 'ayet_metin_v1:';

function gununSirasi() {
  const d = new Date();
  return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5) % AYETLER.length;
}

/** Ayetin Mushaf metni: önce cihaz, sonra ağ; ikisi de yoksa kayıtlı kısa metin. */
function useAyetMetni(v) {
  const [metin, setMetin] = useState(() => { try { return localStorage.getItem(AR_ONBELLEK + v.s + ':' + v.a) || null; } catch { return null; } });
  useEffect(() => {
    const k = AR_ONBELLEK + v.s + ':' + v.a;
    let kayitli = null;
    try { kayitli = localStorage.getItem(k); } catch { /* yok */ }
    setMetin(kayitli);
    if (kayitli) return undefined;
    let canli = true;
    fetch(`https://api.alquran.cloud/v1/ayah/${v.s}:${v.a}/quran-uthmani`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const t = j && j.data && j.data.text;
        if (!t || !canli) return;
        try { localStorage.setItem(k, t); } catch { /* kota */ }
        setMetin(t);
      }).catch(() => {});
    return () => { canli = false; };
  }, [v.s, v.a]);
  return metin || (v.tam ? v.kisa : `${v.kisa} …`);
}

function GirihDesen({ renk }) {
  return (
    <svg aria-hidden width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <pattern id="vod-girih" width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={renk} strokeWidth="0.8">
            <rect x="16" y="16" width="24" height="24" /><rect x="16" y="16" width="24" height="24" transform="rotate(45 28 28)" />
            <path d="M0 28 H8 M48 28 H56 M28 0 V8 M28 48 V56" />
          </g>
        </pattern>
        <linearGradient id="vod-sol" x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity="1" /><stop offset="0.55" stopColor="#000" stopOpacity="0" /></linearGradient>
        <mask id="vod-maske"><rect width="100%" height="100%" fill="#fff" /><rect width="100%" height="100%" fill="url(#vod-sol)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#vod-girih)" mask="url(#vod-maske)" />
    </svg>
  );
}

export function VerseOfTheDayCard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [sira, setSira] = useState(gununSirasi);
  const [meal, setMeal] = useState(null);          // { text, credit } | 'yok'
  const [tefsir, setTefsir] = useState(null);
  const [tefsirAcik, setTefsirAcik] = useState(false);
  const [calan, setCalan] = useState('');          // 'ar' | 'tr' | ''
  const [kopyalandi, setKopyalandi] = useState(false);
  const ses = useRef(null);
  const v = AYETLER[sira];
  const arapca = useAyetMetni(v);
  const sureAd = SURAHS[v.s - 1]?.name || String(v.s);

  useEffect(() => {
    let canli = true;
    setMeal(null); setTefsir(null); setTefsirAcik(false); durdur();
    mealOnYukle(v.s).then((m) => {
      if (!canli) return;
      const r = m?.ayahs?.find((x) => x.aya === v.a);
      setMeal(r ? { text: r.text, credit: mealCredit(m.source, m.version) } : 'yok');
    });
    return () => { canli = false; };
  }, [sira]); // eslint bilinçli

  useEffect(() => () => durdur(), []); // eslint bilinçli

  function durdur() {
    if (ses.current) { ses.current.pause(); ses.current = null; }
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch { /* yok */ }
    setCalan('');
  }
  const arapcaDinle = () => {
    if (calan === 'ar') { durdur(); return; }
    durdur();
    const au = new Audio(verseAudioUrl(v.s, v.a));
    ses.current = au; au.onended = () => setCalan('');
    au.play().then(() => setCalan('ar')).catch(() => setCalan(''));
  };
  const mealDinle = () => {
    if (calan === 'tr') { durdur(); return; }
    durdur();
    if (!meal || meal === 'yok' || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(meal.text);
    u.lang = 'tr-TR'; u.rate = 0.92; u.onend = () => setCalan(''); u.onerror = () => setCalan('');
    setCalan('tr'); window.speechSynthesis.speak(u);
  };
  const tefsirAc = () => {
    setTefsirAcik(!tefsirAcik);
    if (!tefsir) fetchTafsir(v.s, 'tr').then((t) => { const r = t?.ayahs?.find((x) => x.aya === v.a); setTefsir(r ? { text: r.text, credit: mealCredit(t.source, t.version) } : 'yok'); }).catch(() => setTefsir('yok'));
  };
  const paylas = () => {
    const m = meal && meal !== 'yok' ? meal.text : '';
    const t = `${QURAN_PUBLIC ? `${arapca}\n\n` : ''}${m}\n\n(${sureAd} ${v.a})`;
    if (navigator.share) navigator.share({ title: tt('Günün ayeti'), text: t }).catch(() => {});
    else navigator.clipboard?.writeText(t).then(() => { setKopyalandi(true); setTimeout(() => setKopyalandi(false), 1600); }).catch(() => {});
  };

  // Arapça yazı boyu: metin uzadıkça küçülür (ekrana sığsın)
  const arBoy = useMemo(() => { const n = arapca.length; return n < 35 ? 34 : n < 70 ? 28 : n < 120 ? 24 : 21; }, [arapca]);
  const koyu = theme.isDark;
  const vurgu = koyu ? (theme.goldLight || theme.gold) : karistir(theme.gold, '#000000', 0.3);
  const dugme = { height: 40, padding: '0 14px', borderRadius: 20, border: `1px solid ${theme.cardBorder}`, background: theme.surface, color: theme.textPrimary, fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', whiteSpace: 'nowrap' };

  return (
    <section data-testid="gunun-ayeti" style={{ position: 'relative', overflow: 'hidden', borderRadius: 30, padding: '18px 18px 16px', color: theme.textPrimary,
      background: koyu ? `linear-gradient(150deg, ${karistir(theme.surface, theme.gold, 0.1)} 0%, ${theme.surface} 70%)` : `linear-gradient(150deg, ${karistir(theme.surface, theme.gold, 0.1)} 0%, ${theme.surface} 70%)`,
      border: `1px solid ${alfa(theme.gold, 0.3)}`, boxShadow: koyu ? '0 18px 40px -24px rgba(0,0,0,0.8)' : '0 18px 40px -28px rgba(60,45,10,0.45)' }}>
      <GirihDesen renk={alfa(theme.gold, koyu ? 0.18 : 0.22)} />

      <div style={{ position: 'relative' }}>
        {/* Başlık: etiket solda, künye sağda (taşarsa alt satıra iner) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px', borderRadius: 14, fontSize: 12, fontWeight: 800, background: alfa(theme.gold, 0.16), color: vurgu, border: `1px solid ${alfa(theme.gold, 0.35)}` }}>
            <BookOpen size={13} /> {tt('Günün ayeti')}
          </span>
          <span style={{ marginInlineStart: 'auto', fontSize: 12.5, fontWeight: 700, color: theme.textSecondary }}>{sureAd} · {v.a}</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={sira} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            {QURAN_PUBLIC && (
              <p dir="rtl" lang="ar" data-testid="gunun-ayeti-ar" style={{ margin: '16px 0 0', fontFamily: "'Amiri', 'Scheherazade New', serif", fontSize: arBoy, lineHeight: 1.85, textAlign: 'center', color: vurgu, overflowWrap: 'anywhere' }}>
                {arapca}
              </p>
            )}
            <div style={{ margin: '12px auto 0', maxWidth: 520, textAlign: 'center' }}>
              {meal === null && <div className="yuk-satir" style={{ alignItems: 'center' }}><span style={{ width: '90%' }} /><span style={{ width: '70%' }} /></div>}
              {meal === 'yok' && <p style={{ margin: 0, fontSize: 13, color: theme.textSecondary }}>{tt('Meal için internet bağlantısı gerekiyor.')}</p>}
              {meal && meal !== 'yok' && (
                <>
                  <p style={{ margin: 0, fontFamily: 'var(--font-okuma)', fontSize: meal.text.length > 220 ? 15 : 17, lineHeight: 1.6 }}>{meal.text}</p>
                  <p style={{ margin: '6px 0 0', fontSize: 10, color: theme.textSecondary }}>{tt('Meal')}: {meal.credit}</p>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Kısa tefsir */}
        <AnimatePresence initial={false}>
          {tefsirAcik && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 12, padding: '12px 14px', borderRadius: 16, background: alfa(theme.gold, 0.08), border: `1px solid ${alfa(theme.gold, 0.2)}`, fontSize: 13.5, lineHeight: 1.6 }}>
              {tefsir === null && <div className="yuk-satir"><span /><span style={{ width: '75%' }} /></div>}
              {tefsir === 'yok' && <span style={{ color: theme.textSecondary }}>{tt('Tefsir için internet bağlantısı gerekiyor.')}</span>}
              {tefsir && tefsir !== 'yok' && (<>{tefsir.text}<div style={{ marginTop: 6, fontSize: 10, color: theme.textSecondary }}>{tefsir.credit}</div></>)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* İşlemler: iki satırlı ızgara, dar ekranda taşmaz */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginTop: 14 }}>
          {QURAN_PUBLIC && (
            <button type="button" onClick={arapcaDinle} style={{ ...dugme, ...(calan === 'ar' ? { background: theme.gold, color: '#1A1406', borderColor: theme.gold } : {}) }}>
              {calan === 'ar' ? <Pause size={14} /> : <Play size={14} />} {tt(calan === 'ar' ? 'Durdur' : 'Dinle')}
            </button>
          )}
          <button type="button" onClick={mealDinle} style={{ ...dugme, ...(calan === 'tr' ? { background: theme.gold, color: '#1A1406', borderColor: theme.gold } : {}) }}>
            {calan === 'tr' ? <Pause size={14} /> : <Volume2 size={14} />} {tt(calan === 'tr' ? 'Durdur' : 'Meal')}
          </button>
          <button type="button" onClick={tefsirAc} style={dugme}><ChevronDown size={14} style={{ transform: tefsirAcik ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} /> {tt('Tefsir')}</button>
          <button type="button" onClick={paylas} style={dugme}>{kopyalandi ? <Check size={14} /> : <Share2 size={14} />} {tt(kopyalandi ? 'Kopyalandı' : 'Paylaş')}</button>
          <button type="button" onClick={() => navigate(`/ayet-tablosu?s=${v.s}&a=${v.a}`)} style={dugme}><ImageIcon size={14} /> {tt('Tablo')}</button>
          <button type="button" data-testid="farkli-ayet" onClick={() => setSira((sira + 1) % AYETLER.length)} style={{ ...dugme, background: koyu ? theme.gold : theme.primary, color: koyu ? '#1A1406' : '#FFFFFF', border: 'none' }}>
            <RefreshCw size={14} /> {tt('Farklı')}
          </button>
        </div>
        {QURAN_PUBLIC && (
          <button type="button" onClick={() => navigate(`/quran/${v.s}`)} style={{ marginTop: 10, width: '100%', background: 'none', border: 'none', color: vurgu, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
            {sureAd} {tt('suresini aç')} →
          </button>
        )}
      </div>
    </section>
  );
}
