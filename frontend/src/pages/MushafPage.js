import React, { useEffect, useState, useCallback, useRef } from 'react';
import { packPage } from '../services/offline';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useTx } from '../i18n';
import { mealCredit } from '../services/mealService';
import AyetKarti, { mealOnYukle } from './mushaf/AyetKarti';

// 📖 MUSHAF — tam sayfa okuma (604 sayfa, Medine tertibi)
//
// İLKELER (Kurul kriterleri ve docs/YENI_OZELLIKLER.md 0.4):
//   · Ayet metni TEK RENK ve sabit zemin üzerindedir. Tema, efekt, animasyon, parıltı YOK.
//   · Metin kaynaktan geldiği gibi gösterilir; hiçbir dönüştürme yapılmaz.
//   · Besmele, sure başlarında ayrı satırdır; ayet sonları ۝ + numara ile işaretlenir.
//   · Yazı tipi şimdilik Amiri'dir; nihai yazı tipine Kurul karar verir (tek satır değişir: FONT).
//
// Bu görünüm sayfa BÖLÜMLERİNE sadıktır (her sayfada basılı Mushaf'taki ayetler bulunur), ancak
// satır satır hat dizgisi değildir. Satır düzeni Faz 3'te, Kurul'un onayladığı yazı tipiyle eklenecek.
//
// Kaynak: Tanzil metni, alquran.cloud sayfa ucu (/v1/page/{n}/quran-uthmani).

const TOTAL_PAGES = 604;
const FONT = "'Amiri', 'Scheherazade New', serif";
const PAPER = '#FBF8F0';   // sabit kâğıt rengi
const INK = '#1A1A1A';     // sabit mürekkep rengi
const RULE = '#B8A77A';    // çerçeve çizgisi
const CACHE = 'mushaf_page_v1:';
const LAST = 'mushaf_last_page';

const toArabicDigits = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

const read = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* kota */ } };

async function loadPage(n) {
  const cached = read(CACHE + n);
  if (cached?.ayahs?.length) return cached;
  const local = await packPage(n);          // çevrimdışı Mushaf paketi (Kurul onayından sonra yayımlanır)
  if (local) return local;
  const res = await fetch(`https://api.alquran.cloud/v1/page/${n}/quran-uthmani`);
  if (!res.ok) throw new Error(`sayfa ${res.status}`);
  const json = await res.json();
  const ayahs = (json.data?.ayahs || []).map((a) => ({
    text: a.text,                       // DOKUNULMAZ
    n: a.numberInSurah,
    surah: a.surah.number,
    surahName: a.surah.name,
    juz: a.juz,
    sajda: !!a.sajda,
  }));
  if (!ayahs.length) throw new Error('boş sayfa');
  const page = { page: n, ayahs };
  write(CACHE + n, page);
  return page;
}

// Sure başındaki besmele, kaynak metinde 1. ayetin başına bitişik gelir (Fâtiha ve Tevbe hariç).
// Gösterimde ayrı satıra alınır; ayet metninin kendisi değiştirilmez, yalnız nereden bölüneceği bulunur.
// Kaynakta üç yazımı var (بِسْمِ / بِّسْمِ / başında BOM), bu yüzden hareke atılarak tanınır.
const bare = (w) => w.replace(/[\u064B-\u065F\u0670\uFEFF]/g, '');
function splitBismillah(ayah) {
  if (ayah.n !== 1 || ayah.surah === 1 || ayah.surah === 9) return { bismillah: null, text: ayah.text };
  const words = ayah.text.split(' ');
  if (words.length > 4 && bare(words[0]) === 'بسم') {
    // Besmele kaynağın kendi yazımıyla gösterilir; yeniden yazılmaz.
    return { bismillah: words.slice(0, 4).join(' '), text: words.slice(4).join(' ') };
  }
  return { bismillah: null, text: ayah.text };
}

export default function MushafPage() {
  const { page: pageParam } = useParams();
  const navigate = useNavigate();
  const tt = useTx();
  const page = Math.min(TOTAL_PAGES, Math.max(1, Number(pageParam) || read(LAST) || 1));

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [secili, setSecili] = useState(null); // ayet kartında öne gelen ayetin sayfadaki sırası
  // Görünüm: mushaf (yalnız Arapça) · meal (yalnız meal) · ikisi (ayet + altında meal)
  const [mode, setModeState] = useState(() => read('mushaf_mode') || 'mushaf');
  const [meals, setMeals] = useState({}); // { 'sure:ayet': metin }
  const [mealNote, setMealNote] = useState('');
  const setMode = (m) => { setModeState(m); write('mushaf_mode', m); };
  const touchX = useRef(null);

  useEffect(() => {
    let alive = true;
    setData(null); setError(false); setSecili(null);
    loadPage(page).then((d) => { if (alive) setData(d); }).catch(() => { if (alive) setError(true); });
    write(LAST, page);
    write('mushaf_last_ts', Date.now());
    // komşu sayfaları sessizce önbelleğe al
    if (page < TOTAL_PAGES) loadPage(page + 1).catch(() => {});
    return () => { alive = false; };
  }, [page]);

  // Sayfadaki surelerin meali HER görünümde önceden yüklenir (QuranEnc/Rowad, önbellekli): ayete dokununca
  // meal beklemeden belirir. Meal ve İkisi görünümleri aynı veriyi kullanır.
  useEffect(() => {
    if (!data) return undefined;
    let alive = true;
    const surahs = [...new Set(data.ayahs.map((a) => a.surah))];
    Promise.all(surahs.map((n) => mealOnYukle(n))).then((list) => {
      if (!alive) return;
      const map = {};
      list.forEach((m, i) => { (m?.ayahs || []).forEach((a) => { map[`${surahs[i]}:${a.aya}`] = a.text; }); });
      setMeals(map);
      const ok = list.find(Boolean);
      setMealNote(ok ? mealCredit(ok.source, ok.version) : '');
    });
    return () => { alive = false; };
  }, [data]);

  const go = useCallback((n) => {
    if (n >= 1 && n <= TOTAL_PAGES) navigate(`/mushaf/${n}`, { replace: true });
  }, [navigate]);

  // Mushaf sağdan sola ilerler: sola kaydırmak ÖNCEKİ, sağa kaydırmak SONRAKİ sayfadır.
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 60) return;
    go(dx > 0 ? page + 1 : page - 1);
  };

  // Ayete dokununca ayet kartı açılır: ayet öne gelir, meali altında yazar.
  const openAyah = (a) => {
    if (!data) return;
    const i = data.ayahs.findIndex((x) => x.surah === a.surah && x.n === a.n);
    if (i >= 0) { setSecili(i); write('mushaf_ipucu_gordu', 1); }
  };
  const sel = secili != null && data ? data.ayahs[secili] : null;

  const first = data?.ayahs[0];
  const surahNames = data ? [...new Set(data.ayahs.map((a) => a.surahName))] : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#E9E3D3' }} data-testid="mushaf-page">
      {/* Üst şerit: sure adı · cüz */}
      <div className="flex items-center justify-between px-3 py-2" style={{ color: '#5B5137' }}>
        <button onClick={() => navigate('/quran')} aria-label={tt('Geri')} className="p-2"><X size={20} /></button>
        <div className="text-[12px] font-semibold" dir="rtl" style={{ fontFamily: FONT }}>{surahNames.join(' · ')}</div>
        <div className="text-[12px] font-semibold w-16 text-right">{first ? `${tt('Cüz')} ${first.juz}` : ''}</div>
      </div>

      {/* Görünüm seçimi */}
      <div className="mx-auto mb-2 flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(91,81,55,0.12)' }} role="tablist">
        {[['mushaf', 'Mushaf'], ['meal', 'Meal'], ['ikisi', 'İkisi']].map(([id, n]) => (
          <button key={id} role="tab" aria-selected={mode === id} onClick={() => setMode(id)}
            style={{ minHeight: 34, padding: '0 16px', borderRadius: 9, fontSize: 13, fontWeight: mode === id ? 700 : 500, background: mode === id ? INK : 'transparent', color: mode === id ? PAPER : '#5B5137' }}>
            {tt(n)}
          </button>
        ))}
      </div>

      {mode === 'mushaf' && !read('mushaf_ipucu_gordu') && data && (
        <p className="text-center mb-1" style={{ fontSize: 12, color: '#8A7A55' }} onClick={() => write('mushaf_ipucu_gordu', 1)}>{tt('Bir ayete dokun: ayet öne gelir, meali altında yazar.')}</p>
      )}

      {/* Sayfa */}
      <div className="flex-1 px-2 pb-2" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="mx-auto h-full max-w-[560px] rounded-md px-4 py-5"
          style={{ background: PAPER, border: `1px solid ${RULE}`, boxShadow: `inset 0 0 0 3px ${PAPER}, inset 0 0 0 4px ${RULE}` }}>
          {error && (
            <div className="text-center py-16 text-sm" style={{ color: '#5B5137' }}>
              {tt('Sayfa yüklenemedi. İnternet bağlantınızı kontrol edin.')}
              <div><button onClick={() => go(page)} className="mt-3 underline font-semibold">{tt('Yeniden dene')}</button></div>
            </div>
          )}
          {!data && !error && <div className="text-center py-16 text-sm" style={{ color: '#5B5137' }}>…</div>}
          {data && mode === 'mushaf' && (
            <div dir="rtl" lang="ar"
              style={{ fontFamily: FONT, color: INK, fontSize: 'clamp(19px, 5.4vw, 26px)', lineHeight: 2.15, textAlign: 'justify', textAlignLast: 'center' }}>
              {data.ayahs.map((a, i) => {
                const { bismillah, text } = splitBismillah(a);
                const newSurah = a.n === 1;
                const selected = sel && sel.surah === a.surah && sel.n === a.n;
                return (
                  <React.Fragment key={`${a.surah}:${a.n}`}>
                    {newSurah && (
                      <div className="my-2 py-1 text-center" style={{ border: `1px solid ${RULE}`, borderRadius: 6, fontSize: '0.85em', lineHeight: 1.8 }}>
                        {a.surahName}
                      </div>
                    )}
                    {bismillah && <div className="text-center" style={{ lineHeight: 2 }}>{bismillah}</div>}
                    <span role="button" tabIndex={0} onClick={() => openAyah(a)}
                      onKeyDown={(e) => { if (e.key === 'Enter') openAyah(a); }}
                      style={{ background: selected ? '#EFE6C8' : 'transparent', borderRadius: 4, cursor: 'pointer' }}>
                      {text}
                      {' '}
                      <span style={{ fontSize: '0.8em', whiteSpace: 'nowrap' }}>﴿{toArabicDigits(a.n)}﴾</span>
                      {a.sajda ? <span title={tt('Secde ayeti')} style={{ fontSize: '0.8em' }}> ۩</span> : null}
                      {i < data.ayahs.length - 1 ? ' ' : ''}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          )}
          {data && mode !== 'mushaf' && (
            <div className="flex flex-col" style={{ color: INK }}>
              {data.ayahs.map((a) => {
                const { bismillah, text } = splitBismillah(a);
                return (
                  <div key={`${a.surah}:${a.n}`} className="py-2" style={{ borderBottom: `1px solid #E8DFC6` }}>
                    {a.n === 1 && (
                      <div dir="rtl" lang="ar" className="mb-2 py-1 text-center" style={{ border: `1px solid ${RULE}`, borderRadius: 6, fontFamily: FONT, fontSize: 18 }}>{a.surahName}</div>
                    )}
                    {mode === 'ikisi' && (
                      <p dir="rtl" lang="ar" onClick={() => openAyah(a)} style={{ fontFamily: FONT, fontSize: 21, lineHeight: 1.9, textAlign: 'right', cursor: 'pointer' }}>
                        {bismillah ? `${bismillah} ` : ''}{text} <span style={{ fontSize: '0.8em' }}>﴿{toArabicDigits(a.n)}﴾</span>
                      </p>
                    )}
                    <p onClick={() => openAyah(a)} style={{ fontSize: mode === 'meal' ? 16 : 13.5, lineHeight: 1.6, color: mode === 'meal' ? INK : '#4A4332', cursor: 'pointer' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#8A7A55' }}>{a.n} </span>
                      {meals[`${a.surah}:${a.n}`] || '…'}
                    </p>
                  </div>
                );
              })}
              {mealNote && <p className="text-center mt-3" style={{ fontSize: 10, color: '#8A7A55' }}>{tt('Meal')}: {mealNote}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Alt şerit: sayfa gezinme (sağdan sola) */}
      <div className="flex items-center justify-between px-4 pb-4 pt-1" style={{ color: '#5B5137' }}>
        <button onClick={() => go(page + 1)} disabled={page >= TOTAL_PAGES} className="p-2 disabled:opacity-30" aria-label={tt('Sonraki sayfa')}>
          <ChevronLeft size={22} />
        </button>
        <label className="text-[13px] font-semibold flex items-center gap-2">
          {tt('Sayfa')}
          <input type="number" min={1} max={TOTAL_PAGES} value={page}
            onChange={(e) => go(Number(e.target.value))}
            className="w-16 text-center rounded-md py-1" style={{ background: PAPER, border: `1px solid ${RULE}`, color: INK }} />
          / {TOTAL_PAGES}
        </label>
        <button onClick={() => go(page - 1)} disabled={page <= 1} className="p-2 disabled:opacity-30" aria-label={tt('Önceki sayfa')}>
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Ayet kartı: dokunulan ayet öne gelir, altında meali (ayet metninin üstüne hiçbir şey binmez) */}
      <AnimatePresence>
        {sel && <AyetKarti key="ayet-karti" ayetler={data.ayahs} indis={secili} onIndis={setSecili} onKapat={() => setSecili(null)} />}
      </AnimatePresence>
    </div>
  );
}
