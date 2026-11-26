import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Share2 } from 'lucide-react';
import { SURAHS } from '../../data/surahData';
import { useAyet } from '../musluman/meal';
import { STILLER, BOYUTLAR, tabloCiz } from './tabloCiz';
import '@fontsource/fraunces/latin-700.css';
import '@fontsource/fraunces/latin-ext-700.css';
import '@fontsource/literata/latin-500.css';
import '@fontsource/literata/latin-ext-500.css';

// 🖼️ AYET TABLOSU — bir âyet seç, stilini seç, görsel olarak indir ya da paylaş.
// Meal cihazdaki meal paketinden, DEĞİŞTİRİLMEDEN ve tam âyet olarak gelir (kısaltma yok); altında sure·âyet ve meal kaynağı yazar.
// Arapça metin Kurul onayına kadar eklenmez (config/quranAccess).

const SECKIN = [
  { s: 13, a: 28, ad: 'Kalpler huzur bulur' },
  { s: 94, a: [5, 6], ad: 'Zorlukla beraber kolaylık' },
  { s: 93, a: 5, ad: 'Rabbin sana verecek' },
  { s: 2, a: 186, ad: 'Ben yakınım' },
  { s: 39, a: 53, ad: 'Ümit kesmeyin' },
  { s: 65, a: 3, ad: 'Tevekkül' },
  { s: 2, a: 152, ad: 'Beni anın' },
  { s: 57, a: 4, ad: 'O sizinle beraberdir' },
  { s: 3, a: 139, ad: 'Gevşemeyin, üzülmeyin' },
  { s: 20, a: 114, ad: 'İlmimi artır' },
];
const ALTIN = '#D8B76A';

export default function AyetTablosuPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const qs = Math.min(114, Math.max(1, Number(params.get('s')) || 13));
  const qa = Math.min(SURAHS[qs - 1].ayahs, Math.max(1, Number(params.get('a')) || (params.get('s') ? 1 : 28)));
  const [sure, setSure] = useState(qs);
  const [ilk, setIlk] = useState(qa);
  const [son, setSon] = useState(qa);
  const [stil, setStil] = useState('cini');
  const [boyutId, setBoyutId] = useState('gonderi');
  const [hazir, setHazir] = useState(false);
  const [uyari, setUyari] = useState('');
  const [kaydedildi, setKaydedildi] = useState(false);
  const [defterOldu, setDefterOldu] = useState(false);
  const tuval = useRef(null);
  const sureBilgi = SURAHS[sure - 1];
  const boyut = BOYUTLAR.find((b) => b.id === boyutId);
  const meal = useAyet(sure, [ilk, son]);
  const ref = `${sureBilgi.name} Sûresi · ${ilk === son ? ilk : `${ilk}–${son}`}`;

  useEffect(() => {
    let iptal = false;
    Promise.all([document.fonts.load('700 40px Fraunces'), document.fonts.load('500 40px Literata')]).catch(() => null)
      .then(() => { if (!iptal) setHazir(true); });
    return () => { iptal = true; };
  }, []);

  const paragraflar = useMemo(() => (meal.satirlar ? meal.satirlar.map((s) => s.text) : null), [meal.satirlar]);

  useEffect(() => {
    if (!hazir || !tuval.current || !paragraflar) return;
    const r = tabloCiz(tuval.current, { stil, boyut, paragraflar, ref, etiket: meal.etiket });
    setUyari(r.sigdi ? '' : 'Bu âyet bu boyuta sığmıyor; daha uzun bir boyut (Hikâye) seç ya da daha kısa bir âyet seç.');
  }, [hazir, stil, boyut, paragraflar, ref, meal.etiket]);

  useEffect(() => { setKaydedildi(false); setDefterOldu(false); }, [sure, ilk]);
  const deftereEkle = () => {
    try {
      const mevcut = JSON.parse(localStorage.getItem('defter_v1') || '[]');
      const liste = Array.isArray(mevcut) ? mevcut : [];
      const yeni = {
        id: `d_${Date.now()}`,
        surah: sure,
        ayah: ilk,
        surahName: sureBilgi.name,
        meal: paragraflar ? paragraflar.join(' ') : '',
        note: '',
        feeling: 'huzur',
        date: new Date().toISOString().slice(0, 10),
      };
      localStorage.setItem('defter_v1', JSON.stringify([yeni, ...liste.filter((x) => !(x.surah === sure && x.ayah === ilk))]));
      setDefterOldu(true);
    } catch { /* kota */ }
  };
  const secSeckin = (x) => { const [a, b] = Array.isArray(x.a) ? x.a : [x.a, x.a]; setSure(x.s); setIlk(a); setSon(b); };
  const dosyaAdi = `ayet-${sureBilgi.name.replace(/[^\wçğıöşüâîû]+/gi, '')}-${ilk}${son !== ilk ? `-${son}` : ''}.png`;

  const blob = () => new Promise((res) => tuval.current.toBlob(res, 'image/png'));
  const indir = async () => {
    const b = await blob(); const url = URL.createObjectURL(b);
    const a = document.createElement('a'); a.href = url; a.download = dosyaAdi; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const paylas = async () => {
    const b = await blob(); const dosya = new File([b], dosyaAdi, { type: 'image/png' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [dosya] })) await navigator.share({ files: [dosya], text: ref });
      else await indir();
    } catch { /* vazgeçildi */ }
  };

  const secim = { minHeight: 44, borderRadius: 14, border: '1px solid rgba(216,183,106,0.35)', background: 'rgba(255,255,255,0.06)', color: '#F4EFE3', padding: '0 12px', fontSize: 15 };

  return (
    <div data-testid="ayet-tablosu" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0B2E23 0%, #061A13 100%)', color: '#F4EFE3', paddingBottom: 130 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 16px 6px' }}>
        <button type="button" onClick={() => navigate(-1)} aria-label="Geri"
          style={{ width: 44, height: 44, borderRadius: 22, border: '1px solid rgba(216,183,106,0.35)', background: 'rgba(255,255,255,0.05)', color: '#F4EFE3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={22} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontFamily: '"Fraunces", serif', fontSize: 24, fontWeight: 800 }}>Ayet Tablosu</h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(244,239,227,0.65)' }}>Bir âyet seç, stilini seç, paylaş</p>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 16px', scrollbarWidth: 'none' }}>
        {SECKIN.map((x) => {
          const on = x.s === sure && (Array.isArray(x.a) ? x.a[0] : x.a) === ilk;
          return (
            <button key={`${x.s}-${x.a}`} type="button" onClick={() => secSeckin(x)}
              style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                background: on ? ALTIN : 'rgba(255,255,255,0.06)', color: on ? '#1A1A1A' : '#F4EFE3', border: `1px solid ${on ? ALTIN : 'rgba(255,255,255,0.12)'}` }}>
              {x.ad}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 84px 84px', gap: 8, padding: '6px 16px' }}>
        <select aria-label="Sure" value={sure} onChange={(e) => { const s = Number(e.target.value); setSure(s); setIlk(1); setSon(1); }} style={secim}>
          {SURAHS.map((s) => <option key={s.n} value={s.n} style={{ color: '#000' }}>{s.n}. {s.name}</option>)}
        </select>
        <input aria-label="İlk âyet" type="number" min={1} max={sureBilgi.ayahs} value={ilk}
          onChange={(e) => { const v = Math.min(sureBilgi.ayahs, Math.max(1, Number(e.target.value) || 1)); setIlk(v); setSon(Math.max(v, Math.min(son, v + 2))); }} style={secim} />
        <input aria-label="Son âyet" type="number" min={ilk} max={Math.min(sureBilgi.ayahs, ilk + 2)} value={son}
          onChange={(e) => setSon(Math.min(sureBilgi.ayahs, ilk + 2, Math.max(ilk, Number(e.target.value) || ilk)))} style={secim} />
      </div>
      <p style={{ margin: '0 16px', fontSize: 11.5, color: 'rgba(244,239,227,0.5)' }}>En çok 3 âyet. Meal kısaltılmaz; uzun metinde yazı küçülür.</p>

      <div style={{ display: 'flex', gap: 8, padding: '12px 16px 4px' }}>
        {STILLER.map((s) => (
          <button key={s.id} type="button" data-testid={`stil-${s.id}`} onClick={() => setStil(s.id)}
            style={{ flex: 1, minHeight: 44, borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: 'pointer',
              background: stil === s.id ? ALTIN : 'rgba(255,255,255,0.06)', color: stil === s.id ? '#1A1A1A' : '#F4EFE3', border: `1px solid ${stil === s.id ? ALTIN : 'rgba(255,255,255,0.12)'}` }}>
            {s.ad}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '4px 16px 10px' }}>
        {BOYUTLAR.map((b) => (
          <button key={b.id} type="button" onClick={() => setBoyutId(b.id)}
            style={{ flex: 1, minHeight: 36, borderRadius: 12, fontSize: 12.5, cursor: 'pointer',
              background: 'transparent', color: boyutId === b.id ? ALTIN : 'rgba(244,239,227,0.6)', border: `1px solid ${boyutId === b.id ? ALTIN : 'rgba(255,255,255,0.12)'}` }}>
            {b.ad}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
        {meal.yok ? (
          <p style={{ padding: 24, textAlign: 'center', color: 'rgba(244,239,227,0.7)' }}>Meal paketi henüz cihaza inmedi. İnternet varken bir kez açman yeterli.</p>
        ) : (
          <motion.canvas key={`${stil}-${boyutId}`} ref={tuval} data-testid="tablo-tuval" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            aria-label={`${ref} âyet tablosu`}
            style={{ width: '100%', maxWidth: boyut.h > 1500 ? 300 : 380, height: 'auto', aspectRatio: `${boyut.w} / ${boyut.h}`, borderRadius: 10, boxShadow: '0 18px 40px rgba(0,0,0,0.45)' }} />
        )}
      </div>
      {uyari && <p style={{ margin: '10px 16px 0', fontSize: 12.5, color: '#F2B9A0', textAlign: 'center' }}>{uyari}</p>}

      <div style={{ display: 'flex', gap: 10, padding: '16px' }}>
        <button type="button" onClick={indir} disabled={!paragraflar || !!uyari} data-testid="tablo-indir"
          style={{ flex: 1, minHeight: 50, borderRadius: 25, border: `1px solid ${ALTIN}`, background: 'transparent', color: ALTIN, fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
          <Download size={18} /> İndir
        </button>
        <button type="button" onClick={paylas} disabled={!paragraflar || !!uyari}
          style={{ flex: 1, minHeight: 50, borderRadius: 25, border: 'none', background: ALTIN, color: '#1A1A1A', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
          <Share2 size={18} /> Paylaş
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button type="button" data-testid="profilime-koy" onClick={() => { try { localStorage.setItem('benim_ayetim', JSON.stringify({ s: sure, a: ilk })); setUyari(''); setKaydedildi(true); } catch { /* kota */ } }}
          style={{ minHeight: 38, padding: '0 16px', borderRadius: 20, border: 'none', background: 'transparent', color: kaydedildi ? '#7FD6B0' : 'rgba(244,239,227,0.78)', fontSize: 13.5, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer' }}>
          {kaydedildi ? 'Profilinde "Benim âyetim" oldu' : 'Bu âyeti profilime "Benim âyetim" olarak koy'}
        </button>
        <button type="button" data-testid="deftere-ekle" onClick={deftereEkle}
          style={{ minHeight: 36, padding: '0 16px', borderRadius: 20, border: 'none', background: 'transparent', color: defterOldu ? '#7FD6B0' : 'rgba(216,183,106,0.85)', fontSize: 13, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer' }}>
          {defterOldu ? '✓ Hayat Ayetleri Defterine eklendi' : '📓 Hayat Ayetleri Defterime de ekle'}
        </button>
      </div>
    </div>
  );
}
