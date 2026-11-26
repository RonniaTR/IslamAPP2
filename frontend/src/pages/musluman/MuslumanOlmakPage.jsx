import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, BookOpen, Newspaper, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { KITAP, MECMUA, FONT } from './tema';
import { YAYINLAR } from '../../data/muslumanOlmak';
import { OzelSayfa, Yildiz8 } from './ozelSayfalar';
import { HayatHalkalari } from './infografik';
import KitapOkuyucu from './KitapOkuyucu';
import CennetKapisi, { kapiGosterilsinMi, kapiGosterildi } from '../../components/musluman/CennetKapisi';
import { bahceBaslat, bahceDurdur, bahceSeviye, bahceCaliyor, bahceTercih, bahceAcikMi } from '../../services/bahceSesi';

// 📗 MÜSLÜMAN OLMAK — kütüphane: Kitap + Hikmet Mecmuası (Sayı 1 & Sayı 2) + Kavram Atlası.
const ARAYUZ = { fontFamily: FONT.arayuz };
const { kitap, mecmua, mecmua2 } = YAYINLAR;

function ilerlemeOku(id) {
  try {
    const s = JSON.parse(localStorage.getItem(`mo:${id}:sayfa`) || 'null');
    const t = JSON.parse(localStorage.getItem(`mo:${id}:toplam`) || 'null');
    return s === null ? null : { sayfa: s, toplam: t || 0 };
  } catch { return null; }
}

const gunNo = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);

/** Rafta duran üç boyutlu kitap: dokununca gecikmesiz açılır (ağır animasyon ve pointermove gecikmesi yok). */
function UcBoyutluKitap({ onAc }) {
  const W = 122; const Hh = 195; const D = 26;
  const yuz = { position: 'absolute', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' };
  return (
    <button type="button" onClick={onAc} aria-label={`${kitap.baslik} kitabını aç`} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', perspective: 1000, display: 'block', margin: '0 auto' }}>
      <div
        style={{ position: 'relative', width: W, height: Hh, transformStyle: 'preserve-3d', transform: 'rotateY(24deg) rotateX(-5deg)' }}
      >
        <div style={{ ...yuz, inset: 0, transform: `rotateY(180deg) translateZ(${D / 2}px)`, background: '#072219', borderRadius: '6px 2px 2px 6px' }} />
        <div style={{ ...yuz, top: 3, height: Hh - 6, left: (W - D) / 2, width: D, transform: `rotateY(90deg) translateZ(${W / 2 - 3}px)`, background: 'repeating-linear-gradient(90deg, #F8F2E4 0 1.6px, #DCCBA6 1.6px 3px)' }} />
        <div style={{ ...yuz, left: 0, width: W - 3, top: (Hh - D) / 2, height: D, transform: `rotateX(90deg) translateZ(${Hh / 2 - 3}px)`, background: 'repeating-linear-gradient(0deg, #F8F2E4 0 1.6px, #DCCBA6 1.6px 3px)' }} />
        <div style={{ ...yuz, top: 0, height: Hh, left: (W - D) / 2, width: D, transform: `rotateY(-90deg) translateZ(${W / 2}px)`, background: 'linear-gradient(90deg, #06231A, #0F4A3A 45%, #0A3328 80%, #06231A)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
          <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: FONT.baslik, fontWeight: 800, fontSize: 9.5, color: KITAP.altinAcik, letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>MÜSLÜMAN OLMAK</span>
        </div>
        <div style={{ ...yuz, top: 3, bottom: 3, left: 0, right: 3, transform: `translateZ(${D / 2 - 1}px)`, background: KITAP.kagit, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
          <Yildiz8 r={11} renk={KITAP.altin} />
          <span style={{ fontFamily: FONT.baslik, fontStyle: 'italic', fontWeight: 600, fontSize: 12, color: KITAP.zumrut }}>Rabbi zidnî ilmâ</span>
        </div>
        <div
          style={{ position: 'absolute', inset: 0, transform: `translateZ(${D / 2}px)`, transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
        >
          <div style={{ ...yuz, inset: 0, borderRadius: '2px 6px 6px 2px', overflow: 'hidden', boxShadow: '10px 16px 30px rgba(0,0,0,.32)' }}>
            <div style={{ width: 400, height: 640, transform: `scale(${W / 400})`, transformOrigin: '0 0', position: 'relative' }}>
              <OzelSayfa s={{ tip: 'kapak' }} kitap={kitap} />
            </div>
          </div>
          <div style={{ ...yuz, inset: 0, transform: 'rotateY(180deg)', background: `linear-gradient(90deg, ${KITAP.kagitKoyu}, ${KITAP.kagit})`, borderRadius: '6px 2px 2px 6px' }} />
        </div>
      </div>
    </button>
  );
}

function MecmuaKapagi({ dergi, egim = 3, onAc }) {
  const W = 120;
  return (
    <motion.button
      type="button"
      onClick={onAc}
      aria-label={`${dergi.baslik} ${dergi.sayi} aç`}
      whileHover={{ rotate: 0, y: -4 }}
      whileTap={{ scale: 0.97 }}
      initial={{ rotate: egim }}
      animate={{ rotate: egim }}
      style={{ display: 'block', margin: '0 auto', width: W, height: W * 1.6, padding: 0, border: 0, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', boxShadow: '6px 14px 28px rgba(0,0,0,.3)', background: '#fff' }}
    >
      <div style={{ width: 400, height: 640, transform: `scale(${W / 400})`, transformOrigin: '0 0', position: 'relative', pointerEvents: 'none' }}>
        <OzelSayfa s={{ tip: 'kapak' }} kitap={dergi} />
      </div>
    </motion.button>
  );
}

/** Etkileşimli Kavram Atlası: 9 Arapça köklü kavramın kelime ağacı. */
function KavramAtlasi({ kavramlar, onBabAc }) {
  const [seciliIdx, setSeciliIdx] = useState(0);
  const k = kavramlar[seciliIdx] || kavramlar[0];
  if (!k) return null;
  const harfler = k.kok.split('-');
  const dallar = k.aile || [];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {kavramlar.map((item, i) => {
          const aktif = i === seciliIdx;
          return (
            <button
              key={item.kelime}
              type="button"
              onClick={() => setSeciliIdx(i)}
              style={{
                borderRadius: 999,
                padding: '6px 12px',
                border: `1px solid ${aktif ? item.renk : `${item.renk}40`}`,
                background: aktif ? item.renk : `${item.renk}10`,
                color: aktif ? '#fff' : KITAP.murekkep,
                fontFamily: FONT.baslik,
                fontWeight: 700,
                fontSize: 13.5,
                cursor: 'pointer',
                transition: 'all .2s',
              }}
            >
              {item.kelime}
            </button>
          );
        })}
      </div>

      <motion.div
        key={k.kelime}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        style={{
          marginTop: 12,
          borderRadius: 18,
          padding: 16,
          background: `linear-gradient(135deg, ${k.renk}12, #FFFDF7 75%)`,
          border: `1px solid ${k.renk}38`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <div>
            <div style={{ ...ARAYUZ, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 800, color: k.renk }}>
              Kök Harfleri · {k.bolumBaslik} Bâbı
            </div>
            <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 28, color: KITAP.murekkep, marginTop: 2 }}>
              {k.kelime}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {harfler.map((h, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span
                key={i}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  background: k.renk,
                  color: '#fff',
                  fontFamily: FONT.baslik,
                  fontWeight: 800,
                  fontSize: 15,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textTransform: 'uppercase',
                  boxShadow: `0 4px 12px ${k.renk}44`,
                }}
              >
                {h === "'" ? 'ʾ' : h}
              </span>
            ))}
          </div>
        </div>

        {/* SVG Kök Ağacı Şeması */}
        <svg viewBox="0 0 340 116" width="100%" role="img" aria-label={`${k.kelime} kavramının aynı kökten türeyen kelime ailesi`} style={{ marginTop: 8 }}>
          <rect x="115" y="6" width="110" height="28" rx="14" fill={k.renk} />
          <text x="170" y="24" textAnchor="middle" fontSize="11.5" fill="#fff" style={{ fontFamily: FONT.baslik, fontWeight: 800 }}>
            KÖK: {k.kok.toUpperCase()}
          </text>
          {dallar.map((kelime, idx) => {
            const n = dallar.length;
            const cx = n === 1 ? 170 : 38 + (idx * 264) / (n - 1);
            const cy = idx % 2 === 0 ? 78 : 96;
            return (
              <g key={kelime}>
                <path d={`M170 34 Q170 54 ${cx} ${cy - 14}`} fill="none" stroke={k.renk} strokeWidth="1.4" strokeOpacity="0.45" />
                <rect x={cx - 38} y={cy - 13} width="76" height="22" rx="11" fill="#FFFDF7" stroke={k.renk} strokeWidth="1.2" />
                <text x={cx} y={cy + 2} textAnchor="middle" fontSize="9.5" fill={KITAP.murekkep} style={{ ...ARAYUZ, fontWeight: 700 }}>
                  {kelime}
                </text>
              </g>
            );
          })}
        </svg>

        <p style={{ margin: '6px 0 0', fontFamily: FONT.govde, fontSize: 14, lineHeight: '22px', color: KITAP.murekkep }}>
          {k.x}
        </p>

        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => onBabAc(k.bolumId)}
            style={{
              ...ARAYUZ,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              border: 0,
              borderRadius: 999,
              padding: '7px 14px',
              background: `${k.renk}18`,
              color: k.renk,
              fontWeight: 800,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            {k.bolumBaslik} bâbında oku <ChevronRight size={15} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const KAP = { gizli: {}, acik: {} };
const OGE = { gizli: { opacity: 1, y: 0 }, acik: { opacity: 1, y: 0 } };

function Kart({ children, style }) {
  return <div style={{ background: '#FFFDF7', borderRadius: 20, border: `1px solid ${KITAP.kenar}`, boxShadow: '0 6px 20px rgba(80,60,20,.06)', padding: 16, ...style }}>{children}</div>;
}

function Etiket({ children, renk = KITAP.altin }) {
  return <div style={{ ...ARAYUZ, fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 800, color: renk }}>{children}</div>;
}

export default function MuslumanOlmakPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  // Kütüphane gecikmesiz açılır; bahçe kapısı yalnız kullanıcı isterse ("Bahçe kapısını yeniden aç") açılır.
  const [kapi, setKapi] = useState(() => false && kapiGosterilsinMi() && !params.get('oku'));
  const [ses, setSes] = useState(false);
  const [aktifSayi, setAktifSayi] = useState('mecmua');
  const [, yenile] = useState(0);

  const okunan = params.get('oku');
  const yayin = okunan === 'mecmua2' ? mecmua2 : okunan === 'mecmua' ? mecmua : okunan === 'kitap' ? kitap : null;
  const baslangic = useMemo(() => (params.get('bolum') ? { bolum: params.get('bolum') } : null), [params]);

  useEffect(() => () => bahceDurdur(0.8), []);
  useEffect(() => { if (yayin) bahceSeviye(0.22); else if (!kapi) bahceSeviye(0.4); }, [yayin, kapi]);

  const ac = useCallback((tur, bolum) => {
    const q = new URLSearchParams({ oku: tur });
    if (bolum) q.set('bolum', bolum);
    navigate(`${location.pathname}?${q.toString()}`, { state: { mo: true } });
  }, [navigate, location.pathname]);

  const kapat = useCallback(() => {
    if (location.state && location.state.mo) navigate(-1);
    else setParams({}, { replace: true });
    yenile((x) => x + 1);
  }, [location.state, navigate, setParams]);

  const kapiBitti = useCallback(() => {
    kapiGosterildi();
    setKapi(false);
    setSes(bahceCaliyor());
  }, []);

  const sesDegis = () => {
    if (bahceCaliyor()) { bahceDurdur(0.6); bahceTercih(false); setSes(false); return; }
    bahceTercih(true);
    setSes(bahceBaslat(0.4));
  };

  const kitapIlerleme = ilerlemeOku(kitap.id);
  const mecmuaIlerleme = ilerlemeOku(mecmua.id);
  const mecmua2Ilerleme = ilerlemeOku(mecmua2.id);

  const hikmetler = useMemo(() => {
    const h = [];
    kitap.bolumler.forEach((b) => b.bloklar.forEach((x) => { if (x.t === 'hadis' && x.x.length < 170) h.push({ ...x, bolum: b }); }));
    return h;
  }, []);
  const hikmet = hikmetler[gunNo() % hikmetler.length];

  const kavramlar = useMemo(() => {
    const out = [];
    kitap.bolumler.forEach((b) => {
      b.bloklar.forEach((x) => {
        if (x.t === 'kavram') {
          out.push({ ...x, bolumId: b.id, bolumBaslik: b.baslik, renk: b.renk || KITAP.zumrut });
        }
      });
    });
    return out;
  }, []);

  const babler = kitap.bolumler.filter((b) => b.no);
  const gununBabi = babler[gunNo() % babler.length];
  const gununAmeli = gununBabi.bloklar.find((x) => x.t === 'amel');
  const gununAdimi = gununAmeli ? gununAmeli.x[gunNo() % gununAmeli.x.length] : null;

  const devam = (() => {
    const k = kitapIlerleme && kitapIlerleme.sayfa > 0 ? { tur: 'kitap', yayin: kitap, ...kitapIlerleme } : null;
    const m1 = mecmuaIlerleme && mecmuaIlerleme.sayfa > 0 ? { tur: 'mecmua', yayin: mecmua, ...mecmuaIlerleme } : null;
    const m2 = mecmua2Ilerleme && mecmua2Ilerleme.sayfa > 0 ? { tur: 'mecmua2', yayin: mecmua2, ...mecmua2Ilerleme } : null;
    return k || m2 || m1;
  })();

  const seciliDergi = aktifSayi === 'mecmua2' ? mecmua2 : mecmua;

  return (
    <div style={{ minHeight: '100vh', background: '#F4EEE0', color: KITAP.murekkep, paddingBottom: 120, position: 'relative', overflowX: 'hidden' }}>
      <AnimatePresence>{kapi && <CennetKapisi key="kapi" onTamam={kapiBitti} />}</AnimatePresence>
      {yayin && <KitapOkuyucu key={yayin.id} kitap={yayin} baslangic={baslangic} onKapat={kapat} baski={params.get('baski') === '1'} />}

      {/* Başlık */}
      <header style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, #0F4A3A 0%, #0B3A2D 55%, #082A21 100%)', color: '#F4EBD6', padding: 'calc(env(safe-area-inset-top, 0px) + 14px) 18px 30px', borderRadius: '0 0 30px 30px' }}>
        <motion.div aria-hidden animate={{ rotate: 360 }} transition={{ duration: 140, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', right: -60, top: -40, opacity: 0.14 }}><Yildiz8 r={130} renk={KITAP.altinAcik} kalinlik={2} /></motion.div>
        <div aria-hidden style={{ position: 'absolute', left: -40, bottom: -70, opacity: 0.08 }}><Yildiz8 r={90} renk={KITAP.altinAcik} kalinlik={2} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <button type="button" aria-label="Geri" onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: 13, border: 0, background: 'rgba(255,255,255,.1)', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={20} /></button>
          <button type="button" aria-label={ses ? 'Bahçe sesini kapat' : 'Bahçe sesini aç'} onClick={sesDegis} style={{ height: 40, borderRadius: 13, border: 0, background: 'rgba(255,255,255,.1)', color: 'inherit', display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', ...ARAYUZ, fontSize: 12, fontWeight: 700 }}>
            {ses ? <Volume2 size={17} /> : <VolumeX size={17} />} Bahçe sesi
          </button>
        </div>
        <div style={{ position: 'relative', marginTop: 18 }}>
          <Etiket renk={KITAP.altinAcik}>Kitap · Mecmua · Kavram Atlası</Etiket>
          <motion.h1
            animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            style={{ margin: '6px 0 0', fontFamily: FONT.baslik, fontWeight: 800, fontSize: 38, lineHeight: '44px', letterSpacing: '-0.01em', color: '#F3E3B5', backgroundImage: 'linear-gradient(90deg, #E9CF92 0%, #FFF3D2 25%, #E9CF92 50%, #FFF3D2 75%, #E9CF92 100%)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Müslüman Olmak
          </motion.h1>
          <p style={{ margin: '8px 0 0', fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 15.5, lineHeight: '23px', color: '#DCE7DF', maxWidth: 440 }}>
            Namaz ve abdestin ötesinde: kalpten tabiata bir ömrün kitabı ve ilmin dallarını anlatan iki sayı Hikmet Mecmuası.
          </p>
          <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(217,190,126,.3)' }}>
            <Sparkles size={14} color={KITAP.altinAcik} />
            <span style={{ fontFamily: FONT.baslik, fontStyle: 'italic', fontWeight: 600, fontSize: 14, color: '#F3E3B5' }}>Rabbi zidnî ilmâ</span>
            <span style={{ ...ARAYUZ, fontSize: 11.5, opacity: 0.8 }}>· Rabbim, ilmimi artır</span>
          </div>
        </div>
      </header>

      <motion.main variants={KAP} initial="gizli" animate={kapi ? 'gizli' : 'acik'} style={{ maxWidth: 760, margin: '0 auto', padding: '18px 16px 0', display: 'grid', gap: 16 }}>
        {/* Kaldığın yer */}
        {devam && (
          <Kart style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: devam.tur === 'kitap' ? KITAP.zumrut : MECMUA.gok, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 46px' }}>
              {devam.tur === 'kitap' ? <BookOpen size={22} /> : <Newspaper size={22} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Etiket renk={KITAP.soluk}>Kaldığın yer</Etiket>
              <div style={{ fontFamily: FONT.baslik, fontWeight: 600, fontSize: 16, marginTop: 2 }}>{devam.yayin.kisaAd || devam.yayin.baslik}</div>
              <div style={{ height: 5, borderRadius: 5, background: KITAP.kagitKoyu, marginTop: 7, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${devam.toplam ? Math.round(((devam.sayfa + 1) / devam.toplam) * 100) : 0}%`, background: devam.tur === 'kitap' ? KITAP.zumrut : MECMUA.gok }} />
              </div>
              <div style={{ ...ARAYUZ, fontSize: 11.5, color: KITAP.soluk, marginTop: 4 }}>Sayfa {devam.sayfa + 1}{devam.toplam ? ` / ${devam.toplam}` : ''}</div>
            </div>
            <button type="button" onClick={() => ac(devam.tur)} style={{ border: 0, borderRadius: 13, background: KITAP.zumrut, color: '#fff', padding: '11px 14px', ...ARAYUZ, fontWeight: 700, fontSize: 13 }}>Devam</button>
          </Kart>
        )}

        {/* Raf: Kitap + Mecmua Sayı 1 + Mecmua Sayı 2 */}
        <motion.section variants={OGE} style={{ position: 'relative', borderRadius: 24, padding: '24px 10px 0', background: 'linear-gradient(180deg, #EFE5CF 0%, #E6D8B8 100%)', border: `1px solid ${KITAP.kenar}`, overflow: 'hidden' }}>
          <motion.div aria-hidden animate={{ opacity: [0.55, 0.85, 0.55] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', left: '10%', right: '10%', top: -60, height: 220, background: 'radial-gradient(ellipse at center, rgba(255,244,214,.9), rgba(255,244,214,0) 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, alignItems: 'end', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center' }}>
              <UcBoyutluKitap onAc={() => ac('kitap')} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <MecmuaKapagi dergi={mecmua} egim={-2} onAc={() => ac('mecmua')} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <MecmuaKapagi dergi={mecmua2} egim={3.5} onAc={() => ac('mecmua2')} />
            </div>
          </div>
          {/* Raf tahtası */}
          <div aria-hidden style={{ height: 16, margin: '10px -10px 0', background: 'linear-gradient(180deg, #A77C46, #7D5A30)', boxShadow: '0 -6px 14px rgba(90,60,20,.25)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, background: '#FFFDF7', margin: '0 -10px', padding: '12px 12px 14px' }}>
            <button type="button" onClick={() => ac('kitap')} style={{ textAlign: 'left', background: 'none', border: 0, padding: 0, cursor: 'pointer' }}>
              <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 14.5, color: KITAP.zumrut }}>Kitap</div>
              <div style={{ ...ARAYUZ, fontSize: 11, color: KITAP.soluk, lineHeight: 1.35 }}>Dokuz bâb · âyet, sahih hadis</div>
            </button>
            <button type="button" onClick={() => ac('mecmua')} style={{ textAlign: 'left', background: 'none', border: 0, padding: 0, cursor: 'pointer' }}>
              <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 14.5, color: MECMUA.gok }}>Mecmua · Sayı 1</div>
              <div style={{ ...ARAYUZ, fontSize: 11, color: KITAP.soluk, lineHeight: 1.35 }}>{mecmua.konu}</div>
            </button>
            <button type="button" onClick={() => ac('mecmua2')} style={{ textAlign: 'left', background: 'none', border: 0, padding: 0, cursor: 'pointer' }}>
              <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 14.5, color: MECMUA.yer }}>Mecmua · Sayı 2</div>
              <div style={{ ...ARAYUZ, fontSize: 11, color: KITAP.soluk, lineHeight: 1.35 }}>{mecmua2.konu}</div>
            </button>
          </div>
        </motion.section>

        {/* Bugünün hikmeti */}
        {hikmet && (
          <Kart style={{ background: 'linear-gradient(140deg, #FBF3DE, #F3E6C6)', borderColor: KITAP.altinAcik }}>
            <Etiket>Bugünün hikmeti</Etiket>
            <p style={{ margin: '8px 0 0', fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 17, lineHeight: '26px' }}>“{hikmet.x}”</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ ...ARAYUZ, fontSize: 12, fontWeight: 700, color: KITAP.soluk }}>{hikmet.k}{hikmet.d ? ` · ${hikmet.d}` : ''}</span>
              <button type="button" onClick={() => ac('kitap', hikmet.bolum.id)} style={{ ...ARAYUZ, display: 'flex', alignItems: 'center', gap: 2, border: 0, background: 'none', color: hikmet.bolum.renk, fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}>
                {hikmet.bolum.baslik} bâbı <ChevronRight size={15} />
              </button>
            </div>
          </Kart>
        )}

        {/* Bugünün adımı */}
        {gununAdimi && (
          <Kart style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: `${gununBabi.renk}18`, color: gununBabi.renk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.baslik, fontWeight: 800, fontSize: 20, flex: '0 0 42px' }}>{gununBabi.no}</div>
            <div style={{ flex: 1 }}>
              <Etiket renk={gununBabi.renk}>Bugün sen · {gununBabi.baslik}</Etiket>
              <div style={{ fontFamily: FONT.govde, fontSize: 15, lineHeight: '22px', marginTop: 3 }}>{gununAdimi}</div>
            </div>
          </Kart>
        )}

        {/* Kavram Atlası */}
        {kavramlar.length > 0 && (
          <Kart>
            <Etiket renk={KITAP.altin}>Kavram Atlası · Kökten Anlama</Etiket>
            <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 22, marginTop: 4 }}>Bir kök, bir anlam ailesi</div>
            <p style={{ margin: '4px 0 0', ...ARAYUZ, fontSize: 12.5, color: KITAP.soluk }}>
              Bir kavrama dokun; üç harfli kökünü ve aynı kökten filizlenen kardeş kelimeleri incele.
            </p>
            <KavramAtlasi kavramlar={kavramlar} onBabAc={(bolumId) => ac('kitap', bolumId)} />
          </Kart>
        )}

        {/* Kitabın haritası */}
        <Kart>
          <Etiket renk={KITAP.zumrut}>Kitabın haritası</Etiket>
          <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 22, marginTop: 4 }}>Temelden tabiata dokuz bâb</div>
          <div style={{ maxWidth: 360, margin: '10px auto 4px' }}><HayatHalkalari /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginTop: 8 }}>
            {babler.map((b) => (
              <button key={b.id} type="button" onClick={() => ac('kitap', b.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 11px', borderRadius: 14, border: `1px solid ${b.renk}33`, background: `${b.renk}0D`, cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ width: 28, height: 28, borderRadius: 9, background: b.renk, color: '#fff', ...ARAYUZ, fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 28px' }}>{b.no}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: FONT.baslik, fontWeight: 600, fontSize: 15, color: KITAP.murekkep }}>{b.baslik}</span>
                  <span style={{ display: 'block', ...ARAYUZ, fontSize: 11, color: KITAP.soluk, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.kisa}</span>
                </span>
              </button>
            ))}
          </div>
        </Kart>

        {/* Mecmua: Sayı 1 & Sayı 2 seçici */}
        <Kart style={{ background: '#14233A', color: '#fff', border: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <Etiket renk="#FFD27A">Hikmet Mecmuası · {seciliDergi.sayi}</Etiket>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                ['mecmua', 'Sayı 1: Işık ve Ölçü'],
                ['mecmua2', 'Sayı 2: Şifa ve Merhamet'],
              ].map(([id, etiket]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAktifSayi(id)}
                  style={{
                    ...ARAYUZ,
                    fontSize: 11.5,
                    fontWeight: 700,
                    padding: '5px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,210,122,0.35)',
                    background: aktifSayi === id ? '#FFD27A' : 'rgba(255,255,255,0.08)',
                    color: aktifSayi === id ? '#14233A' : '#F4EBD6',
                    cursor: 'pointer',
                  }}
                >
                  {etiket}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 24, marginTop: 6 }}>{seciliDergi.konu}</div>
          <div style={{ display: 'grid', gap: 2, marginTop: 10 }}>
            {seciliDergi.bolumler.filter((b) => b.no).map((b) => (
              <button key={b.id} type="button" onClick={() => ac(aktifSayi, b.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 4px', border: 0, borderBottom: '1px solid rgba(255,255,255,.08)', background: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: b.renk, flex: '0 0 8px' }} />
                <span style={{ ...ARAYUZ, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800, color: 'rgba(255,255,255,.55)', width: 110, flex: '0 0 110px' }}>{b.kicker}</span>
                <span style={{ flex: 1, fontFamily: FONT.baslik, fontWeight: 600, fontSize: 15 }}>{b.baslik}</span>
                <ChevronRight size={16} style={{ opacity: 0.5 }} />
              </button>
            ))}
          </div>
        </Kart>

        {/* Kaynak ilkesi */}
        <Kart style={{ background: 'transparent', boxShadow: 'none' }}>
          <Etiket renk={KITAP.soluk}>Kaynak ilkemiz</Etiket>
          <ul style={{ margin: '8px 0 0', paddingLeft: 18, listStyle: 'disc', ...ARAYUZ, fontSize: 12.5, lineHeight: 1.6, color: KITAP.soluk }}>
            <li>Hadisler yalnız sahih ve hasen-sahih rivayetlerden, kitap ve numarasıyla.</li>
            <li>Âyet mealleri cihazdaki meal paketinden, tek kelimesi değiştirilmeden (Rowad Tercüme Merkezi, QuranEnc).</li>
            <li>Bilim tarihi bilgileri kaynaklarıyla; âyetlere "bilimsel mucize" yüklenmez.</li>
            <li>Metinler yayından önce Diyanet İşleri Başkanlığı'nın ilgili kurulunun incelemesine sunulacaktır.</li>
          </ul>
          <button type="button" onClick={() => { setKapi(true); if (bahceAcikMi()) bahceBaslat(1); }} style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, border: `1px solid ${KITAP.kenar}`, background: '#FFFDF7', borderRadius: 12, padding: '9px 13px', ...ARAYUZ, fontSize: 12.5, fontWeight: 700, color: KITAP.zumrut, cursor: 'pointer' }}>
            <RotateCcw size={15} /> Bahçe kapısını yeniden aç
          </button>
        </Kart>
      </motion.main>
    </div>
  );
}
