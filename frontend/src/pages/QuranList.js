import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ChevronRight, Headphones, Target, Brain, CalendarCheck, Type } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { SURAHS } from '../data/surahData';
import { alfa, karistir } from '../styles/renk';

// 🕋 KUR'AN-I KERİM — Kur'an modunun kapısı (hub).
// Önce ne yapmak istediğini seçersin: Mushaf'ta sayfa sayfa oku · kaldığın yerden devam · sureler listesi ·
// hatim · hıfz · meal dinle. Mushaf artık doğrudan açılmaz; buradan açılır ve kapatınca buraya dönülür.
// Liste cihazdaki sure tablosundan gelir (bağlantı gerekmez); bütün renkler aktif temadandır.

// Sure adları (Arapça) — yalnız isimler; Kur'an metni değildir.
const AD_AR = ['الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر', 'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس', 'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس'];
const SIK = [36, 67, 18, 55, 56, 48, 78, 1, 2, 112, 113, 114];
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const sade = (s) => s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`-]/g, '');

function Yildiz8({ n, renk, zemin, yazi }) {
  return (
    <span style={{ position: 'relative', width: 44, height: 44, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden style={{ position: 'absolute', inset: 0 }}>
        <rect x="9" y="9" width="26" height="26" fill={zemin} stroke={renk} strokeWidth="1.2" />
        <rect x="9" y="9" width="26" height="26" fill={zemin} stroke={renk} strokeWidth="1.2" transform="rotate(45 22 22)" />
      </svg>
      <span style={{ position: 'relative', fontSize: n > 99 ? 11 : 12.5, fontWeight: 800, color: yazi, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
    </span>
  );
}

export default function QuranList() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [filtre, setFiltre] = useState('hepsi');
  const [ara, setAra] = useState('');

  const koyu = theme.isDark;
  const altin = koyu ? theme.gold : karistir(theme.gold, '#000000', 0.25);
  const arRenk = koyu ? (theme.goldLight || theme.gold) : karistir(theme.gold, '#000000', 0.35);
  const sonSure = read('quran_last');
  const sonSayfa = Number(read('mushaf_last_page')) || 0;

  const liste = useMemo(() => {
    let l = SURAHS;
    if (filtre === 'mekki') l = l.filter((s) => s.place === 'M');
    if (filtre === 'medeni') l = l.filter((s) => s.place === 'D');
    if (filtre === 'kisa') l = l.filter((s) => s.n >= 78);
    if (filtre === 'sik') l = SIK.map((n) => SURAHS[n - 1]);
    const q = sade(ara.trim());
    if (q) l = l.filter((s) => sade(`${s.name} ${s.n}`).includes(q) || AD_AR[s.n - 1].includes(ara.trim()));
    return l;
  }, [filtre, ara]);

  const islemler = [
    { ad: 'Hatim planı', ikon: CalendarCheck, yol: '/hatim-plani' },
    { ad: 'Hıfz', ikon: Brain, yol: '/hifz' },
    { ad: 'Meal dinle', ikon: Headphones, yol: '/meal-audio' },
    { ad: 'Kelime', ikon: Type, yol: '/kelime' },
    { ad: 'Hatim', ikon: Target, yol: '/hatim' },
  ];
  const kart = { background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 20 };

  return (
    <div data-testid="quran-page" style={{ minHeight: '100vh', background: theme.bg, color: theme.textPrimary, paddingBottom: 120 }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '18px 18px 0' }}>
        {/* Başlık */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: altin }}>114 {tt('sure')} · 604 {tt('sayfa')}</span>
            <h1 style={{ margin: '2px 0 0', fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700 }}>{tt("Kur'an-ı Kerim")}</h1>
          </div>
        </div>

        {/* Mushaf ve kaldığın yer */}
        <div style={{ display: 'grid', gridTemplateColumns: sonSure?.surah ? '1fr 1fr' : '1fr', gap: 10, marginTop: 14 }}>
          <button type="button" data-testid="mushaf-ac" onClick={() => navigate(sonSayfa > 1 ? `/mushaf/${sonSayfa}` : '/mushaf')} className="gir-yukari mod-kart"
            style={{ '--s': 0, position: 'relative', overflow: 'hidden', borderRadius: 22, padding: 16, minHeight: 132, textAlign: 'start', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4,
              border: `1px solid ${alfa(theme.gold, 0.35)}`, color: koyu ? theme.textPrimary : '#FFFFFF',
              background: koyu ? `linear-gradient(150deg, ${karistir(theme.surface, theme.gold, 0.16)}, ${theme.surface})` : `linear-gradient(150deg, ${theme.primary}, ${karistir(theme.primary, '#000000', 0.3)})` }}>
            <BookOpen size={22} color={koyu ? theme.gold : '#FFFFFF'} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 700, marginTop: 4 }}>{tt('Mushaf')}</span>
            <span style={{ fontSize: 12, opacity: 0.85 }}>{sonSayfa > 1 ? `${tt('Sayfa')} ${sonSayfa} · ${tt('kaldığın yerden')}` : tt('Sayfa sayfa, hatim düzeninde')}</span>
            <ChevronRight size={18} style={{ position: 'absolute', right: 14, top: 16, opacity: 0.8 }} />
          </button>
          {sonSure?.surah && (
            <button type="button" onClick={() => navigate(`/quran/${sonSure.surah}`)} className="gir-yukari mod-kart"
              style={{ '--s': 1, ...kart, borderRadius: 22, padding: 16, minHeight: 132, textAlign: 'start', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4, color: theme.textPrimary }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: altin }}>{tt('Son okunan')}</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 700 }}>{SURAHS[sonSure.surah - 1]?.name || sonSure.name}</span>
              <span style={{ fontSize: 12, color: theme.textSecondary }}>{sonSure.ayah && sonSure.total ? `${sonSure.ayah} / ${sonSure.total} ${tt('ayet')}` : tt('Devam et')}</span>
              {sonSure.ayah && sonSure.total && (
                <span style={{ marginTop: 'auto', height: 4, borderRadius: 2, background: alfa(theme.textSecondary, 0.15), overflow: 'hidden' }}>
                  <span style={{ display: 'block', height: 4, width: `${Math.min(100, (sonSure.ayah / sonSure.total) * 100)}%`, background: theme.gold }} />
                </span>
              )}
            </button>
          )}
        </div>

        {/* Diğer işlemler */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto', margin: '10px -18px 0', padding: '0 18px 2px' }}>
          {islemler.map((k) => (
            <button key={k.yol} type="button" onClick={() => navigate(k.yol)} style={{ flexShrink: 0, height: 40, padding: '0 14px', borderRadius: 20, background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <k.ikon size={15} color={altin} aria-hidden /> {tt(k.ad)}
            </button>
          ))}
        </div>

        {/* Arama */}
        <label style={{ marginTop: 14, height: 48, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
          <Search size={17} color={theme.textSecondary} aria-hidden />
          <input value={ara} onChange={(e) => setAra(e.target.value)} placeholder={tt('Sure ara (Yâsin, Mülk, 36…)')} aria-label={tt('Sure ara')}
            style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: theme.textPrimary, fontSize: 14 }} />
          {ara && <button type="button" onClick={() => setAra('')} aria-label={tt('Temizle')} style={{ background: 'none', border: 'none', color: theme.textSecondary }}><X size={16} /></button>}
        </label>

        {/* Süzgeçler */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '12px -18px 0', padding: '0 18px 4px' }}>
          {[['hepsi', 'Tümü', 114], ['sik', 'Sık okunan', SIK.length], ['kisa', 'Kısa sureler', 37], ['mekki', 'Mekkî', SURAHS.filter((s) => s.place === 'M').length], ['medeni', 'Medenî', SURAHS.filter((s) => s.place === 'D').length]].map(([id, ad, n]) => {
            const sec = filtre === id;
            return (
              <button key={id} type="button" onClick={() => setFiltre(id)} style={{ flexShrink: 0, height: 36, padding: '0 14px', borderRadius: 18, fontSize: 12.5, fontWeight: 700,
                border: `1px solid ${sec ? theme.gold : theme.cardBorder}`, background: sec ? theme.gold : theme.surface, color: sec ? '#1A1406' : theme.textPrimary }}>
                {tt(ad)} <span style={{ opacity: 0.6, fontWeight: 600 }}>{n}</span>
              </button>
            );
          })}
        </div>

        {/* Sureler */}
        <div style={{ ...kart, marginTop: 12, padding: '4px 0', overflow: 'hidden' }}>
          {liste.map((s, i) => (
            <button key={s.n} type="button" onClick={() => navigate(`/quran/${s.n}`)} data-testid={`sure-${s.n}`}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'transparent', border: 'none', borderTop: i ? `1px solid ${theme.cardBorder}` : 'none', color: theme.textPrimary, textAlign: 'start', cursor: 'pointer' }}>
              <Yildiz8 n={s.n} renk={altin} zemin={alfa(theme.gold, koyu ? 0.12 : 0.1)} yazi={theme.textPrimary} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700 }}>{s.name}</span>
                <span style={{ display: 'block', fontSize: 12, color: theme.textSecondary }}>{s.place === 'M' ? tt('Mekkî') : s.place === 'D' ? tt('Medenî') : tt('Mekkî/Medenî')} · {s.ayahs} {tt('ayet')}</span>
              </span>
              <span lang="ar" dir="rtl" style={{ fontFamily: "'Amiri', serif", fontSize: 21, color: arRenk }}>{AD_AR[s.n - 1]}</span>
            </button>
          ))}
          {!liste.length && <p style={{ textAlign: 'center', padding: 24, color: theme.textSecondary }}>{tt('Sonuç bulunamadı')}</p>}
        </div>
      </div>
    </div>
  );
}
