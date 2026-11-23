import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, List, Bookmark, BookmarkCheck, Volume2, Square, Mic, MicOff, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, Moon, Sun, Share2, Download, Copy, BookMarked,
} from 'lucide-react';
import { KITAP, MECMUA, FONT, SAYFA } from './tema';
import {
  Blok, GENISLIK, ICERIK_Y, ARALIK, BASLIK_Y, ALT_Y, paragrafStili, parcaHtml, blokMetni, ayetEtiketi,
} from './sayfalar';
import { OzelSayfa, KAPAK_TIPLERI } from './ozelSayfalar';
import { diz, kitaptakiSureler } from './dizgi';
import { mealleriHazirla, ayetMetniHazir } from './meal';
import { komutCoz, komutAciklama } from './komut';
import { kagitHisirti } from '../../services/bahceSesi';

// 📖 KİTAP OKUYUCU — gerçek kitap gibi sayfa çevirir.
//   · Sayfalar sabit ölçüde dizilir (400×640) ve ekrana bütün olarak ölçeklenir: her cihazda aynı sayfa, aynı numara.
//   · Geniş ekranda iki sayfa yan yana (açık kitap), telefonda tek sayfa.
//   · Çevirme: kenara dokun, sürükle, ok tuşları, alttaki düğmeler, sesli ya da yazılı komut ("beş sayfa geç").
//   · Çok sayfa atlanınca sayfalar tek tek, hızla çevrilir (12'den fazlaysa 8 hızlı yaprakta).
//   · Kaldığın sayfa ve ayraçlar cihazda saklanır.

const UST = 56;
const ALT = 78;
const W = SAYFA.w;
const H = SAYFA.h;
const SUREK = { normal: 0.62, hizli: 0.24 };

const anahtar = (id, ne) => `mo:${id}:${ne}`;
const oku = (k, v) => { try { const x = localStorage.getItem(k); return x === null ? v : JSON.parse(x); } catch { return v; } };
const yaz = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* kota */ } };

async function fontlarHazir() {
  if (typeof document === 'undefined' || !document.fonts) return;
  const liste = ['400 14px Literata', 'italic 400 14px Literata', '600 14px Literata', '600 16px Fraunces', '800 16px Fraunces', '400 12px "Noto Sans"', '700 12px "Noto Sans"'];
  const bekle = Promise.all(liste.map((f) => document.fonts.load(f).catch(() => null))).then(() => document.fonts.ready);
  await Promise.race([bekle, new Promise((r) => setTimeout(r, 3500))]);
}

/* ——— Ölçüm: blokları görünmez biçimde çizip yüksekliklerini okur, sonra dizgiyi kurar ——— */
function Olcer({ kitap, onBitti }) {
  const kok = useRef(null);
  useLayoutEffect(() => {
    const el = kok.current;
    if (!el) return;
    const yuk = {};
    el.querySelectorAll('[data-k]').forEach((d) => { yuk[d.getAttribute('data-k')] = d.getBoundingClientRect().height; });
    const p = document.createElement('p');
    p.setAttribute('lang', 'tr');
    el.appendChild(p);
    const onbellek = new Map();
    const olc = {
      satir: parseFloat(paragrafStili(kitap.tema).lineHeight),
      blok: (bi, k) => yuk[`${bi}.${k}`] || 0,
      paragraf: (bi, k, ilk, son) => {
        const key = `${bi}.${k}.${ilk}.${son}`;
        if (onbellek.has(key)) return onbellek.get(key);
        const bol = kitap.bolumler[bi];
        const b = bol.bloklar[k];
        Object.assign(p.style, paragrafStili(kitap.tema));
        p.style.width = `${GENISLIK}px`;
        p.style.textIndent = ilk > 0 || b.ilk ? '0' : '1.1em';
        p.innerHTML = parcaHtml(b._tokens.slice(ilk, son), bol.renk);
        const h = p.getBoundingClientRect().height + ARALIK;
        onbellek.set(key, h);
        return h;
      },
    };
    const sonuc = diz(kitap, olc);
    p.remove();
    onBitti(sonuc);
  }, [kitap, onBitti]);

  return (
    <div ref={kok} aria-hidden style={{ position: 'fixed', left: -20000, top: 0, width: GENISLIK, visibility: 'hidden', pointerEvents: 'none' }}>
      {kitap.bolumler.map((bol, bi) => bol.bloklar.map((b, k) => (
        b.t === 'sayfa' ? null : (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${bi}.${k}`} data-k={`${bi}.${k}`} style={{ paddingBottom: ARALIK }}>
            <Blok b={b} tema={kitap.tema} renk={bol.renk} />
          </div>
        )
      )))}
    </div>
  );
}

/* ——— Tek sayfa ——— */
const Sayfa = React.memo(function Sayfa({ i, kitap, dizgi, taraf, isaretli, onGit }) {
  const s = dizgi.sayfalar[i];
  if (!s) return null;
  const mecmua = kitap.tema === 'mecmua';
  const kagit = mecmua ? MECMUA.kagit : KITAP.kagit;
  const baski = taraf === 'baski';
  const ozel = s.tip !== 'icerik' ? <OzelSayfa s={s} kitap={kitap} dizgi={dizgi} onGit={onGit} baski={baski} /> : null;
  const bol = s.bi !== undefined ? kitap.bolumler[s.bi] : null;
  const kapak = KAPAK_TIPLERI.has(s.tip);
  const sirt = taraf === 'sol' ? 'right' : 'left';

  return (
    <div data-sayfa={i} style={{ position: 'absolute', inset: 0, background: kagit, overflow: 'hidden', borderRadius: baski ? 0 : taraf === 'sol' ? '6px 1px 1px 6px' : '1px 6px 6px 1px' }}>
      {!kapak && !baski && <div aria-hidden style={{ position: 'absolute', inset: 0, background: mecmua ? 'none' : 'radial-gradient(140% 90% at 50% 40%, transparent 60%, rgba(150,110,50,0.10) 100%)' }} />}
      {ozel || (
        <div style={{ position: 'absolute', inset: 0, padding: SAYFA.pad }}>
          <div style={{ height: BASLIK_Y, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontFamily: FONT.arayuz, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: mecmua ? MECMUA.soluk : KITAP.soluk }}>
            <span style={{ fontWeight: 700 }}>{mecmua ? kitap.kisaAd : kitap.baslik}</span>
            <span style={{ fontWeight: 800, color: bol ? bol.renk : undefined, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bol ? (bol.kisa || bol.baslik) : ''}</span>
          </div>
          <div data-icerik style={{ height: ICERIK_Y, overflow: 'hidden' }}>
            {s.ogeler.map((o) => (
              <div key={`${o.k}.${o.dilim ? o.dilim[0] : 0}`} style={{ paddingBottom: ARALIK }}>
                <Blok b={bol.bloklar[o.k]} tema={kitap.tema} renk={bol.renk} dilim={o.dilim} />
              </div>
            ))}
          </div>
          <div style={{ height: ALT_Y, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: FONT.baslik, fontWeight: 600, fontSize: 12, color: mecmua ? MECMUA.soluk : KITAP.altin }}>
            <span style={{ letterSpacing: '0.1em' }}>— {i + 1} —</span>
          </div>
        </div>
      )}
      {!kapak && !baski && (
        <div aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, [sirt]: 0, width: 34, background: `linear-gradient(to ${sirt === 'left' ? 'right' : 'left'}, rgba(60,40,10,${taraf === 'tek' ? 0.10 : 0.16}), transparent)`, pointerEvents: 'none' }} />
      )}
      {isaretli && (
        <div aria-label="Ayraç" style={{ position: 'absolute', top: -2, right: 34, width: 16, height: 54, background: KITAP.kiremit, clipPath: 'polygon(0 0,100% 0,100% 100%,50% 80%,0 100%)', boxShadow: '0 2px 4px rgba(0,0,0,.2)' }} />
      )}
    </div>
  );
});

/* ——— Çevrilen yaprak (ön ve arka yüz) ——— */
function Yaprak({ x, aci, on, arka, render, tek }) {
  const onGolge = useTransform(aci, [0, -90, -180], [0, 0.38, 0.38]);
  const arkaGolge = useTransform(aci, [0, -90, -180], [0.38, 0.22, 0]);
  const parlak = useTransform(aci, [0, -45, -90, -135, -180], [0, 0.18, 0, 0.12, 0]);
  const opak = useTransform(aci, [-120, -180], tek ? [1, 0] : [1, 1]);
  return (
    <motion.div
      style={{ position: 'absolute', top: 0, left: x, width: W, height: H, transformStyle: 'preserve-3d', transformOrigin: 'left center', rotateY: aci, opacity: opak, zIndex: 5 }}
    >
      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', boxShadow: '0 0 18px rgba(0,0,0,.18)' }}>
        {on === null ? <div style={{ position: 'absolute', inset: 0, background: KITAP.kagit }} /> : render(on, tek ? 'tek' : 'sag')}
        <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(40,25,5,.55), rgba(40,25,5,.1) 70%)', opacity: onGolge, pointerEvents: 'none' }} />
        <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, transparent 40%, rgba(255,255,255,.9) 70%, transparent 90%)', opacity: parlak, pointerEvents: 'none' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
        {arka === null
          ? <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to left, ${KITAP.kagitKoyu}, ${KITAP.kagit})` }} />
          : render(arka, 'sol')}
        <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(40,25,5,.5), rgba(40,25,5,.08) 70%)', opacity: arkaGolge, pointerEvents: 'none' }} />
      </div>
    </motion.div>
  );
}

function Golge({ aci, x, yon }) {
  const op = useTransform(aci, [0, -90, -180], [0, 0.35, 0]);
  return (
    <motion.div
      aria-hidden
      style={{ position: 'absolute', top: 0, left: x, width: W, height: H, opacity: op, zIndex: 4, pointerEvents: 'none', background: `linear-gradient(to ${yon}, rgba(30,20,5,.6), transparent 55%)` }}
    />
  );
}

/* ——— Baskı görünümü: bütün sayfalar alt alta, her biri bir kâğıt (13,5 × 21,6 cm). PDF / matbaa için. ——— */
const BASKI_MM = { w: 135, h: 216 };
function BaskiGorunumu({ kitap, dizgi }) {
  const olcek = (BASKI_MM.w / 25.4) * 96 / W; // 135 mm genişliğe ölçek
  useEffect(() => { document.documentElement.setAttribute('data-mo-baski-hazir', '1'); return () => document.documentElement.removeAttribute('data-mo-baski-hazir'); }, []);
  return (
    <div id="mo-baski" style={{ background: '#777', minHeight: '100vh' }}>
      <style>{`
        @page { size: ${BASKI_MM.w}mm ${BASKI_MM.h}mm; margin: 0; }
        @media print {
          html, body { background: #fff !important; }
          body > *:not(#mo-baski-kok) { display: none !important; }
          #mo-baski { background: none !important; }
          .mo-kagit { margin: 0 !important; box-shadow: none !important; }
        }
      `}</style>
      {dizgi.sayfalar.map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="mo-kagit" style={{ width: `${BASKI_MM.w}mm`, height: `${BASKI_MM.h}mm`, margin: '0 auto 12px', position: 'relative', overflow: 'hidden', breakAfter: 'page', pageBreakAfter: 'always', background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,.4)' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${olcek})`, transformOrigin: '0 0' }}>
            <Sayfa i={i} kitap={kitap} dizgi={dizgi} taraf="baski" isaretli={false} onGit={() => {}} />
          </div>
        </div>
      ))}
    </div>
  );
}

function useEkran() {
  const [e, setE] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const f = () => setE({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', f);
    window.addEventListener('orientationchange', f);
    return () => { window.removeEventListener('resize', f); window.removeEventListener('orientationchange', f); };
  }, []);
  return e;
}

const TanimliTanima = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
const sesliOkumaVar = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined';

/* ——— OKUYUCU ——— */
export default function KitapOkuyucu({ kitap, baslangic, onKapat, baski = false }) {
  const [hazir, setHazir] = useState(false);
  const [dizgi, setDizgi] = useState(() => kitap._dizgi || null);
  const ekran = useEkran();
  const cift = ekran.w >= 820 && ekran.w > ekran.h * 1.05;
  const adim = cift ? 2 : 1;
  const N = dizgi ? dizgi.sayfalar.length : 0;
  const enSonGorunum = cift ? N : N - 1;
  const gorunum = useCallback((p) => {
    if (!cift) return Math.max(0, Math.min(N - 1, p));
    const v = p % 2 === 0 ? p : p + 1;
    return Math.max(0, Math.min(N, v));
  }, [cift, N]);

  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const [flip, setFlip] = useState(null); // { from, to, dir }
  const aci = useMotionValue(0);
  const [arayuz, setArayuz] = useState(true);
  const [cekmece, setCekmece] = useState(false);
  const [ayraclar, setAyraclar] = useState(() => oku(anahtar(kitap.id, 'ayrac'), []));
  const [bildirim, setBildirim] = useState(null);
  const [dinliyor, setDinliyor] = useState(false);
  const [okuyor, setOkuyor] = useState(false);
  const [komutMetni, setKomutMetni] = useState('');
  const [kandil, setKandil] = useState(() => oku('mo:kandil', false));
  const [paylasAcik, setPaylasAcik] = useState(false);

  const kandilDegis = useCallback(() => {
    setKandil((prev) => {
      const next = !prev;
      yaz('mo:kandil', next);
      return next;
    });
  }, []);

  const calisiyor = useRef(false);
  const hedefRef = useRef(null);
  const okuyorRef = useRef(false);
  const tanimaRef = useRef(null);
  const dinliyorRef = useRef(false);

  // 1) Yazı tipleri + mealler hazır olunca ölç
  useEffect(() => {
    let alive = true;
    if (dizgi) { setHazir(true); return undefined; }
    Promise.all([fontlarHazir(), mealleriHazirla(kitaptakiSureler(kitap))]).then(() => { if (alive) setHazir(true); });
    return () => { alive = false; };
  }, [kitap, dizgi]);

  const olcumBitti = useCallback((d) => { kitap._dizgi = d; setDizgi(d); }, [kitap]);

  // 2) Başlangıç sayfası
  const basladi = useRef(false);
  useEffect(() => {
    if (!dizgi || basladi.current) return;
    basladi.current = true;
    let p = oku(anahtar(kitap.id, 'sayfa'), 0);
    if (baslangic && baslangic.bolum && dizgi.bolumSayfa[baslangic.bolum] !== undefined) p = dizgi.bolumSayfa[baslangic.bolum];
    if (baslangic && Number.isInteger(baslangic.sayfa)) p = baslangic.sayfa;
    const v = gorunum(p);
    idxRef.current = v; setIdx(v);
  }, [dizgi, kitap.id, baslangic, gorunum]);

  // Ekran yönü değişince (tek ↔ çift) görünümü düzelt
  useEffect(() => {
    if (!dizgi || flip) return;
    const v = gorunum(idxRef.current);
    if (v !== idxRef.current) { idxRef.current = v; setIdx(v); }
  }, [cift, dizgi, flip, gorunum]);

  // Kaldığın yer
  useEffect(() => {
    if (!dizgi) return;
    const okunan = cift ? Math.max(0, Math.min(N - 1, idx === 0 ? 0 : idx - 1)) : idx;
    yaz(anahtar(kitap.id, 'sayfa'), okunan);
    yaz(anahtar(kitap.id, 'toplam'), N);
    yaz(anahtar(kitap.id, 'ts'), Date.now());
  }, [idx, dizgi, kitap.id, cift, N]);

  const bildir = useCallback((m) => {
    setBildirim({ m, t: Date.now() });
  }, []);
  useEffect(() => {
    if (!bildirim) return undefined;
    const t = setTimeout(() => setBildirim(null), 2200);
    return () => clearTimeout(t);
  }, [bildirim]);

  /* ——— Çevirme motoru ——— */
  const cevir = useCallback(async (from, to, hizli) => {
    const dir = Math.sign(to - from);
    setFlip({ from, to, dir });
    aci.set(dir > 0 ? 0 : -180);
    kagitHisirti(hizli);
    await animate(aci, dir > 0 ? -180 : 0, { duration: hizli ? SUREK.hizli : SUREK.normal, ease: hizli ? 'easeInOut' : [0.32, 0.08, 0.24, 1] });
    idxRef.current = to;
    setIdx(to);
    setFlip(null);
    aci.set(0);
  }, [aci]);

  const kos = useCallback(async () => {
    if (calisiyor.current) return;
    calisiyor.current = true;
    while (hedefRef.current !== null && hedefRef.current !== idxRef.current) {
      const c = idxRef.current;
      const t = hedefRef.current;
      const kalanAdim = Math.abs(t - c) / adim;
      const yon = Math.sign(t - c);
      const atla = kalanAdim > 12 ? Math.ceil(kalanAdim / 8) * adim : adim;
      const sonraki = c + yon * Math.min(atla, Math.abs(t - c));
      // eslint-disable-next-line no-await-in-loop
      await cevir(c, sonraki, kalanAdim > 1);
    }
    hedefRef.current = null;
    calisiyor.current = false;
  }, [adim, cevir]);

  const git = useCallback((sayfa) => {
    if (!dizgi) return;
    const v = gorunum(sayfa);
    hedefRef.current = v;
    kos();
  }, [dizgi, gorunum, kos]);

  const ilerle = useCallback((n) => {
    if (!dizgi) return;
    const temel = hedefRef.current !== null ? hedefRef.current : idxRef.current;
    const v = Math.max(0, Math.min(enSonGorunum, temel + n * adim));
    hedefRef.current = v;
    kos();
  }, [dizgi, adim, enSonGorunum, kos]);

  /* ——— Sürükleme ve dokunma ——— */
  const sahneRef = useRef(null);
  const surukle = useRef(null);
  const olcekRef = useRef(1);

  const onPointerDown = (e) => {
    if (e.target.closest('[data-etkin]')) return;
    surukle.current = { x: e.clientX, y: e.clientY, t: Date.now(), aktif: false, yon: 0, id: e.pointerId };
  };
  const onPointerMove = (e) => {
    const s = surukle.current;
    if (!s || (calisiyor.current && !s.aktif)) return;
    const dx = e.clientX - s.x;
    if (!s.aktif) {
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(e.clientY - s.y)) return;
      const yon = dx < 0 ? 1 : -1;
      const c = idxRef.current;
      const to = c + yon * adim;
      if (to < 0 || to > enSonGorunum) { surukle.current = null; return; }
      s.aktif = true; s.yon = yon; s.to = to;
      calisiyor.current = true;
      try { sahneRef.current.setPointerCapture(s.id); } catch { /* */ }
      setFlip({ from: c, to, dir: yon });
      kagitHisirti(false);
    }
    const genislik = W * olcekRef.current * (cift ? 1 : 1);
    const p = Math.max(0, Math.min(1, (s.yon > 0 ? -dx : dx) / genislik));
    s.p = p;
    aci.set(s.yon > 0 ? -180 * p : -180 * (1 - p));
  };
  const onPointerUp = async (e) => {
    const s = surukle.current;
    surukle.current = null;
    if (!s) return;
    if (!s.aktif) {
      if (Date.now() - s.t > 500 || calisiyor.current) return;
      const r = sahneRef.current.getBoundingClientRect();
      const oran = (e.clientX - r.left) / r.width;
      if (oran > 0.68) ilerle(1);
      else if (oran < 0.32) ilerle(-1);
      else setArayuz((v) => !v);
      return;
    }
    const tamamla = (s.p || 0) > 0.3;
    const hedefAci = s.yon > 0 ? (tamamla ? -180 : 0) : (tamamla ? 0 : -180);
    await animate(aci, hedefAci, { duration: 0.32, ease: 'easeOut' });
    if (tamamla) { idxRef.current = s.to; setIdx(s.to); }
    setFlip(null);
    aci.set(0);
    calisiyor.current = false;
    if (hedefRef.current !== null) kos();
  };

  /* ——— Klavye ——— */
  useEffect(() => {
    const f = (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); ilerle(1); }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); ilerle(-1); }
      else if (e.key === 'Home') git(0);
      else if (e.key === 'End') git(N - 1);
      else if (e.key === 'Escape') { if (cekmece) setCekmece(false); else onKapat(); }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [ilerle, git, N, cekmece, onKapat]);

  /* ——— Ayraç ——— */
  const asilSayfa = cift ? Math.min(idx, N - 1) : idx;
  const ayracVar = ayraclar.includes(asilSayfa) || (cift && ayraclar.includes(idx - 1));
  const ayracDegis = useCallback(() => {
    setAyraclar((a) => {
      const hedef = cift ? (idx < N ? idx : idx - 1) : idx;
      const yeni = a.includes(hedef) || (cift && a.includes(idx - 1)) ? a.filter((x) => x !== hedef && !(cift && x === idx - 1)) : [...a, hedef].sort((x, y) => x - y);
      yaz(anahtar(kitap.id, 'ayrac'), yeni);
      bildir(yeni.length > a.length ? 'Ayraç kondu' : 'Ayraç kaldırıldı');
      return yeni;
    });
  }, [cift, idx, N, kitap.id, bildir]);

  /* ——— Sesli okuma ——— */
  const sayfaMetni = useCallback((i) => {
    if (!dizgi) return '';
    const s = dizgi.sayfalar[i];
    if (!s) return '';
    if (s.tip === 'acilis') { const b = kitap.bolumler[s.bi]; return `${b.baslik}. ${b.alt || ''}`; }
    if (s.tip === 'dua') { const d = kitap.acilisDuasi; return `${d.besmele}. ${d.tr}. ${d.anlam}.`; }
    if (s.tip !== 'icerik') return '';
    const bol = kitap.bolumler[s.bi];
    return s.ogeler.map((o) => {
      const b = bol.bloklar[o.k];
      return blokMetni(b, o.dilim, b.t === 'ayet' ? ayetMetniHazir(b.s, b.a) : '');
    }).filter(Boolean).join(' ');
  }, [dizgi, kitap]);

  const sesiDurdur = useCallback(() => {
    okuyorRef.current = false;
    setOkuyor(false);
    if (sesliOkumaVar) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (!okuyor || flip || !sesliOkumaVar) return undefined;
    const sayfalar = cift ? [idx - 1, idx].filter((x) => x >= 0 && x < N) : [idx];
    const metin = sayfalar.map(sayfaMetni).join(' ');
    let zaman = null;
    const sonraki = () => {
      if (!okuyorRef.current) return;
      if (idxRef.current >= enSonGorunum) { sesiDurdur(); bildir('Kitabın sonu'); return; }
      ilerle(1);
    };
    window.speechSynthesis.cancel();
    if (!metin.trim()) { zaman = setTimeout(sonraki, 1200); return () => clearTimeout(zaman); }
    const u = new window.SpeechSynthesisUtterance(metin);
    u.lang = 'tr-TR';
    const ses = window.speechSynthesis.getVoices().find((v) => /^tr/i.test(v.lang));
    if (ses) u.voice = ses;
    u.rate = 0.95;
    u.onend = () => { zaman = setTimeout(sonraki, 500); };
    window.speechSynthesis.speak(u);
    return () => { clearTimeout(zaman); u.onend = null; };
  }, [okuyor, idx, flip, cift, N, sayfaMetni, enSonGorunum, ilerle, sesiDurdur, bildir]);

  useEffect(() => () => { if (sesliOkumaVar) window.speechSynthesis.cancel(); }, []);

  /* ——— Komutlar (ses + yazı) ——— */
  const uygula = useCallback((k, ham) => {
    bildir(ham ? `“${ham}” → ${komutAciklama(k, N)}` : komutAciklama(k, N));
    if (!k) return;
    switch (k.tur) {
      case 'ileri': ilerle(Math.min(k.n, 200)); break;
      case 'geri': ilerle(-Math.min(k.n, 200)); break;
      case 'git': git(Math.max(0, Math.min(N, k.n) - 1)); break;
      case 'bas': git(0); break;
      case 'son': git(N - 1); break;
      case 'icindekiler': setCekmece(true); break;
      case 'oku': if (sesliOkumaVar) { okuyorRef.current = true; setOkuyor(true); } break;
      case 'dur': sesiDurdur(); break;
      case 'ayrac': ayracDegis(); break;
      default:
    }
  }, [N, ilerle, git, sesiDurdur, ayracDegis, bildir]);

  const dinlemeyiKapat = useCallback(() => {
    dinliyorRef.current = false;
    setDinliyor(false);
    try { if (tanimaRef.current) tanimaRef.current.stop(); } catch { /* */ }
  }, []);

  const dinle = useCallback(() => {
    if (!TanimliTanima) return;
    if (dinliyorRef.current) { dinlemeyiKapat(); return; }
    const r = new TanimliTanima();
    r.lang = 'tr-TR';
    r.continuous = true;
    r.interimResults = false;
    r.onresult = (ev) => {
      const sonuc = ev.results[ev.results.length - 1];
      if (!sonuc || !sonuc.isFinal) return;
      const ham = sonuc[0].transcript.trim();
      uygula(komutCoz(ham), ham);
    };
    r.onend = () => { if (dinliyorRef.current) { try { r.start(); } catch { dinlemeyiKapat(); } } };
    r.onerror = (ev) => { if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') { bildir('Mikrofon izni verilmedi'); dinlemeyiKapat(); } };
    tanimaRef.current = r;
    dinliyorRef.current = true;
    setDinliyor(true);
    bildir('Dinliyorum: "beş sayfa geç", "geri", "içindekiler"…');
    try { r.start(); } catch { dinlemeyiKapat(); }
  }, [uygula, bildir, dinlemeyiKapat]);

  useEffect(() => () => { dinliyorRef.current = false; try { if (tanimaRef.current) tanimaRef.current.stop(); } catch { /* */ } }, []);

  /* ——— Ölçek ——— */
  const kitapW = cift ? W * 2 : W;
  const olcek = Math.max(0.3, Math.min((ekran.w - (cift ? 56 : 14)) / kitapW, (ekran.h - UST - ALT - 14) / H, cift ? 1.45 : 1.7));
  olcekRef.current = olcek;

  const render = useCallback((i, taraf) => (
    <Sayfa i={i} kitap={kitap} dizgi={dizgi} taraf={taraf} isaretli={ayraclar.includes(i)} onGit={git} />
  ), [kitap, dizgi, ayraclar, git]);

  const katmanlar = useMemo(() => {
    if (!dizgi) return null;
    const var_ = (i) => i >= 0 && i < N;
    const kutu = (i, x, taraf, z = 1) => (var_(i) ? (
      <div key={`${taraf}-${i}`} style={{ position: 'absolute', top: 0, left: x, width: W, height: H, zIndex: z, boxShadow: '0 10px 30px rgba(0,0,0,.35)' }}>
        {render(i, taraf)}
      </div>
    ) : null);

    if (!cift) {
      if (!flip) return [kutu(idx, 0, 'tek')];
      if (flip.dir > 0) return [kutu(flip.to, 0, 'tek'), <Golge key="g" aci={aci} x={0} yon="right" />, <Yaprak key="y" x={0} aci={aci} on={flip.from} arka={null} render={render} tek />];
      return [kutu(flip.from, 0, 'tek'), <Golge key="g" aci={aci} x={0} yon="right" />, <Yaprak key="y" x={0} aci={aci} on={flip.to} arka={null} render={render} tek />];
    }
    if (!flip) return [kutu(idx - 1, 0, 'sol'), kutu(idx, W, 'sag')];
    if (flip.dir > 0) {
      return [kutu(flip.from - 1, 0, 'sol'), kutu(flip.to, W, 'sag'), <Golge key="g" aci={aci} x={W} yon="right" />,
        <Yaprak key="y" x={W} aci={aci} on={var_(flip.from) ? flip.from : null} arka={var_(flip.to - 1) ? flip.to - 1 : null} render={render} />];
    }
    return [kutu(flip.to - 1, 0, 'sol'), kutu(flip.from, W, 'sag'), <Golge key="g" aci={aci} x={W} yon="right" />,
      <Yaprak key="y" x={W} aci={aci} on={var_(flip.to) ? flip.to : null} arka={var_(flip.from - 1) ? flip.from - 1 : null} render={render} />];
  }, [dizgi, cift, flip, idx, N, aci, render]);

  const mecmua = kitap.tema === 'mecmua';
  const gorunenNo = !dizgi ? '' : cift
    ? [idx - 1, idx].filter((x) => x >= 0 && x < N).map((x) => x + 1).join('–')
    : String(idx + 1);
  const ilerleme = N > 1 ? Math.min(1, (cift ? Math.min(idx, N - 1) : idx) / (N - 1)) : 0;
  const aktifBolum = useMemo(() => {
    if (!dizgi) return null;
    const p = cift ? Math.max(0, Math.min(N - 1, idx)) : idx;
    let son = null;
    kitap.bolumler.forEach((b) => { if (dizgi.bolumSayfa[b.id] <= p) son = b; });
    return son;
  }, [dizgi, idx, cift, N, kitap.bolumler]);

  // Aktif sayfadaki öne çıkan hikmet bloğu (Mühürlü Hikmet Kartı için)
  const sayfaHikmeti = useMemo(() => {
    if (!dizgi) return null;
    const sayfaNo = cift ? Math.max(0, Math.min(N - 1, idx)) : idx;
    const adaySayfalar = cift ? [idx - 1, idx].filter((x) => x >= 0 && x < N) : [sayfaNo];
    const bloklar = [];
    adaySayfalar.forEach((pNo) => {
      const s = dizgi.sayfalar[pNo];
      if (!s || s.tip !== 'icerik') return;
      const bol = kitap.bolumler[s.bi];
      if (!bol) return;
      s.ogeler.forEach((o) => {
        const b = bol.bloklar[o.k];
        if (b) bloklar.push({ b, bol, sayfa: pNo + 1, dilim: o.dilim });
      });
    });
    const sec =
      bloklar.find((x) => x.b.t === 'hadis') ||
      bloklar.find((x) => x.b.t === 'ayet') ||
      bloklar.find((x) => x.b.t === 'kavram') ||
      bloklar.find((x) => x.b.t === 'dusun') ||
      bloklar.find((x) => x.b.t === 'sahne') ||
      bloklar.find((x) => x.b.t === 'p');
    if (!sec) {
      return {
        tur: kitap.baslik,
        metin: aktifBolum ? `${aktifBolum.baslik} — ${aktifBolum.alt || kitap.alt}` : kitap.alt,
        kaynak: `${kitap.baslik} · s. ${sayfaNo + 1}`,
        surah: 0,
        ayah: sayfaNo + 1,
      };
    }
    const { b, bol, sayfa, dilim } = sec;
    if (b.t === 'hadis') {
      return { tur: 'Hadis-i Şerif', metin: b.x, kaynak: `${b.k}${b.d ? ` (${b.d})` : ''} · s. ${sayfa}`, surah: 0, ayah: sayfa };
    }
    if (b.t === 'ayet') {
      const meal = ayetMetniHazir(b.s, b.a) || '';
      return {
        tur: 'Âyet-i Kerîme Meali',
        metin: meal || ayetEtiketi(b.s, b.a),
        kaynak: `${ayetEtiketi(b.s, b.a)} · Rowad Meali`,
        surah: b.s,
        ayah: Array.isArray(b.a) ? b.a[0] : b.a,
      };
    }
    if (b.t === 'kavram') {
      return {
        tur: `Kavram · Kök: ${b.kok.toUpperCase()}`,
        metin: `${b.kelime}: ${b.x}`,
        kaynak: `${kitap.baslik} · ${bol.baslik} Bâbı (s. ${sayfa})`,
        surah: 0,
        ayah: sayfa,
      };
    }
    const duz = blokMetni(b, dilim, '').replace(/\*/g, '');
    return {
      tur: bol.baslik,
      metin: duz.slice(0, 320),
      kaynak: `${kitap.baslik} · ${bol.baslik} (s. ${sayfa})`,
      surah: 0,
      ayah: sayfa,
    };
  }, [dizgi, cift, idx, N, kitap, aktifBolum]);

  const deftereKaydet = useCallback(() => {
    if (!sayfaHikmeti) return;
    try {
      const mevcut = JSON.parse(localStorage.getItem('hayat_ayetleri_v1') || '[]');
      const yeni = {
        surah: sayfaHikmeti.surah || 999,
        ayah: sayfaHikmeti.ayah || Date.now() % 10000,
        ar: sayfaHikmeti.tur,
        meal: `“${sayfaHikmeti.metin}” — ${sayfaHikmeti.kaynak}`,
        note: `${kitap.baslik}`,
        at: Date.now(),
      };
      localStorage.setItem('hayat_ayetleri_v1', JSON.stringify([yeni, ...mevcut]));
      bildir('Hayat Defteri’ne kaydedildi 📓');
      setPaylasAcik(false);
    } catch {
      bildir('Deftere kaydedilemedi.');
    }
  }, [sayfaHikmeti, kitap.baslik, bildir]);

  const metniKopyala = useCallback(async () => {
    if (!sayfaHikmeti) return;
    const tam = `“${sayfaHikmeti.metin}”\n— ${sayfaHikmeti.kaynak} (${kitap.baslik})`;
    try {
      await navigator.clipboard.writeText(tam);
      bildir('Hikmet metni kopyalandı 📋');
      setPaylasAcik(false);
    } catch {
      bildir('Kopyalanamadı.');
    }
  }, [sayfaHikmeti, kitap.baslik, bildir]);

  const gorselKartIndir = useCallback(async () => {
    if (!sayfaHikmeti) return;
    const c = document.createElement('canvas');
    c.width = 1080;
    c.height = 1080;
    const g = c.getContext('2d');
    if (!g) return;
    // Zümrüt gece arka planı
    const bg = g.createLinearGradient(0, 0, 1080, 1080);
    bg.addColorStop(0, '#0F4A3A');
    bg.addColorStop(0.55, '#092B21');
    bg.addColorStop(1, '#051A13');
    g.fillStyle = bg;
    g.fillRect(0, 0, 1080, 1080);
    // Altın iç çerçeve
    g.strokeStyle = 'rgba(224,196,122,0.55)';
    g.lineWidth = 3;
    g.strokeRect(56, 56, 968, 968);
    g.strokeStyle = 'rgba(224,196,122,0.22)';
    g.lineWidth = 1.5;
    g.strokeRect(72, 72, 936, 936);
    // Üst etiket
    g.fillStyle = '#E0C47A';
    g.font = '700 26px "Noto Sans", sans-serif';
    g.textAlign = 'center';
    g.fillText(`✦  ${sayfaHikmeti.tur.toUpperCase()}  ✦`, 540, 155);
    // Metin satır bölme
    g.fillStyle = '#F8F2E4';
    g.font = 'italic 500 40px "Literata", Georgia, serif';
    const kelimeler = `“${sayfaHikmeti.metin}”`.split(/\s+/);
    const satirlar = [];
    let satir = '';
    kelimeler.forEach((w) => {
      const deneme = satir ? `${satir} ${w}` : w;
      if (g.measureText(deneme).width > 820 && satir) {
        satirlar.push(satir);
        satir = w;
      } else {
        satir = deneme;
      }
    });
    if (satir) satirlar.push(satir);
    const basY = Math.max(260, 520 - (satirlar.length * 58) / 2);
    satirlar.slice(0, 10).forEach((st, idx) => {
      g.fillText(st, 540, basY + idx * 58);
    });
    // Kaynak ve mühür
    g.fillStyle = '#E0C47A';
    g.font = '700 28px "Fraunces", Georgia, serif';
    g.fillText(sayfaHikmeti.kaynak, 540, 910);
    g.fillStyle = 'rgba(248,242,228,0.6)';
    g.font = '600 22px "Noto Sans", sans-serif';
    g.fillText(`${kitap.baslik} · İslamiApp`, 540, 958);

    c.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'hikmet-karti.png', { type: 'image/png' });
      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: kitap.baslik, text: sayfaHikmeti.kaynak, files: [file] });
          setPaylasAcik(false);
          return;
        }
      } catch {
        /* paylaşım iptal */
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hikmet-karti.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      bildir('Mühürlü Hikmet Kartı indirildi 🖼️');
      setPaylasAcik(false);
    }, 'image/png');
  }, [sayfaHikmeti, kitap.baslik, bildir]);

  const dugme = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 12, border: 0, background: 'rgba(255,255,255,0.08)', color: '#F4EBD6', cursor: 'pointer' };
  const kucukDugme = { ...dugme, width: 'auto', minWidth: 38, height: 34, padding: '0 9px', fontFamily: FONT.arayuz, fontSize: 12, fontWeight: 700, gap: 2 };

  const icerik = (
    <div
      role="dialog"
      aria-label={kitap.baslik}
      style={{ position: 'fixed', inset: 0, zIndex: 1800, background: mecmua ? 'radial-gradient(120% 90% at 50% 30%, #2B3442, #12161D)' : 'radial-gradient(120% 90% at 50% 30%, #3A2E22, #16110C)', color: '#F4EBD6', overflow: 'hidden', userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Üst çubuk */}
      <div style={{ position: 'absolute', top: 'env(safe-area-inset-top, 0px)', left: 0, right: 0, height: UST, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', zIndex: 20, opacity: arayuz ? 1 : 0, pointerEvents: arayuz ? 'auto' : 'none', transition: 'opacity .25s' }}>
        <button type="button" aria-label="Kitabı kapat" onClick={onKapat} style={dugme}><ArrowLeft size={20} /></button>
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.15 }}>
          <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{kitap.baslik}</div>
          <div style={{ fontFamily: FONT.arayuz, fontSize: 11, opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{aktifBolum ? aktifBolum.baslik : kitap.alt}</div>
        </div>
        <button type="button" aria-label="İçindekiler" onClick={() => setCekmece(true)} style={dugme}><List size={19} /></button>
        <button type="button" aria-label={ayracVar ? 'Ayracı kaldır' : 'Ayraç koy'} onClick={ayracDegis} style={{ ...dugme, color: ayracVar ? '#E7A487' : dugme.color }}>{ayracVar ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}</button>
        <button type="button" aria-label={kandil ? 'Kandil kipini kapat' : 'Kandil (gece) kipi'} onClick={kandilDegis} style={{ ...dugme, background: kandil ? 'rgba(217,190,126,.32)' : dugme.background, color: kandil ? '#FFE3A3' : dugme.color }}>
          {kandil ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button type="button" aria-label="Hikmet kartı paylaş veya deftere kaydet" onClick={() => setPaylasAcik(true)} style={dugme}><Share2 size={18} /></button>
        {sesliOkumaVar && (
          <button type="button" aria-label={okuyor ? 'Sesli okumayı durdur' : 'Sesli oku'} onClick={() => { if (okuyor) sesiDurdur(); else { okuyorRef.current = true; setOkuyor(true); } }} style={{ ...dugme, background: okuyor ? 'rgba(217,190,126,.3)' : dugme.background }}>
            {okuyor ? <Square size={16} /> : <Volume2 size={19} />}
          </button>
        )}
        {TanimliTanima && (
          <button type="button" aria-label={dinliyor ? 'Sesli komutu kapat' : 'Sesli komut'} onClick={dinle} style={{ ...dugme, background: dinliyor ? 'rgba(181,90,60,.55)' : dugme.background }}>
            {dinliyor ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        )}
      </div>

      {/* Sahne */}
      <div style={{ position: 'absolute', top: `calc(${UST}px + env(safe-area-inset-top, 0px))`, bottom: `calc(${ALT}px + env(safe-area-inset-bottom, 0px))`, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!dizgi && (
          <div style={{ textAlign: 'center', fontFamily: FONT.arayuz, fontSize: 13, opacity: 0.8 }}>
            <motion.div animate={{ rotateY: [0, -170, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} style={{ width: 34, height: 46, margin: '0 auto 14px', background: KITAP.kagit, borderRadius: 3, transformOrigin: 'left center' }} />
            Sayfalar diziliyor…
          </div>
        )}
        {dizgi && (
          <motion.div
            ref={sahneRef}
            initial={{ opacity: 0, scale: 0.93, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              position: 'relative',
              width: kitapW * olcek,
              height: H * olcek,
              touchAction: 'none',
              cursor: 'grab',
              filter: kandil ? 'sepia(0.24) brightness(0.86) contrast(0.98)' : 'none',
              boxShadow: kandil ? '0 0 80px rgba(242,184,96,0.22)' : 'none',
              transition: 'filter .35s, box-shadow .35s',
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, width: kitapW, height: H, transform: `scale(${olcek})`, transformOrigin: '0 0', perspective: 2600 }}>
              {!cift && idx < N - 1 && (
                <>
                  <div aria-hidden style={{ position: 'absolute', top: 4, left: 5, width: W, height: H - 8, background: KITAP.kagitKoyu, borderRadius: '1px 6px 6px 1px', boxShadow: '0 8px 24px rgba(0,0,0,.4)' }} />
                  <div aria-hidden style={{ position: 'absolute', top: 2, left: 2.5, width: W, height: H - 4, background: KITAP.kenar, borderRadius: '1px 6px 6px 1px' }} />
                </>
              )}
              {cift && idx > 0 && idx < N && <div aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: W - 1, width: 2, background: 'rgba(0,0,0,.25)', zIndex: 3 }} />}
              {katmanlar}
            </div>
          </motion.div>
        )}
      </div>

      {/* Alt çubuk */}
      {dizgi && (
        <div style={{ position: 'absolute', bottom: 'env(safe-area-inset-bottom, 0px)', left: 0, right: 0, height: ALT, zIndex: 20, opacity: arayuz ? 1 : 0.0, pointerEvents: arayuz ? 'auto' : 'none', transition: 'opacity .25s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 0' }}>
            <span style={{ fontFamily: FONT.arayuz, fontSize: 11.5, fontWeight: 700, minWidth: 64 }}>s. {gorunenNo} / {N}</span>
            <input
              type="range"
              aria-label="Sayfaya git"
              min={1}
              max={N}
              value={cift ? Math.max(1, Math.min(N, idx)) : idx + 1}
              onChange={(e) => git(Number(e.target.value) - 1)}
              style={{ flex: 1, accentColor: mecmua ? MECMUA.isik : KITAP.altinAcik }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '6px 10px 8px' }}>
            <button type="button" aria-label="10 sayfa geri" onClick={() => ilerle(-10)} style={kucukDugme}><ChevronsLeft size={15} />10</button>
            <button type="button" aria-label="5 sayfa geri" onClick={() => ilerle(-5)} style={kucukDugme}><ChevronsLeft size={15} />5</button>
            <button type="button" aria-label="Önceki sayfa" onClick={() => ilerle(-1)} style={{ ...kucukDugme, minWidth: 48 }}><ChevronLeft size={18} /></button>
            <button type="button" aria-label="Sonraki sayfa" onClick={() => ilerle(1)} style={{ ...kucukDugme, minWidth: 48, background: 'rgba(217,190,126,.22)' }}><ChevronRight size={18} /></button>
            <button type="button" aria-label="5 sayfa ileri" onClick={() => ilerle(5)} style={kucukDugme}>5<ChevronsRight size={15} /></button>
            <button type="button" aria-label="10 sayfa ileri" onClick={() => ilerle(10)} style={kucukDugme}>10<ChevronsRight size={15} /></button>
          </div>
        </div>
      )}
      {/* İnce ilerleme çizgisi (arayüz gizliyken de görünür) */}
      {dizgi && <div aria-hidden style={{ position: 'absolute', left: 0, bottom: 0, height: 3, width: `${ilerleme * 100}%`, background: mecmua ? MECMUA.isik : KITAP.altinAcik, zIndex: 21, transition: 'width .3s' }} />}

      {/* Bildirim */}
      <AnimatePresence>
        {bildirim && (
          <motion.div
            key={bildirim.t}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ position: 'absolute', left: '50%', bottom: ALT + 14, transform: 'translateX(-50%)', zIndex: 30, background: 'rgba(20,16,12,.88)', border: '1px solid rgba(217,190,126,.35)', borderRadius: 999, padding: '8px 16px', fontFamily: FONT.arayuz, fontSize: 12.5, whiteSpace: 'nowrap', maxWidth: '92vw', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {bildirim.m}
          </motion.div>
        )}
      </AnimatePresence>

      {/* İçindekiler çekmecesi */}
      <AnimatePresence>
        {cekmece && dizgi && (
          <>
            <motion.div key="perde" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCekmece(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 40 }} />
            <motion.aside
              key="cekmece"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 'min(360px, 88vw)', background: mecmua ? '#FBFAF6' : KITAP.kagit, color: KITAP.murekkep, zIndex: 41, display: 'flex', flexDirection: 'column', paddingTop: 'env(safe-area-inset-top)', boxShadow: '8px 0 30px rgba(0,0,0,.35)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '14px 14px 8px' }}>
                <div style={{ flex: 1, fontFamily: FONT.baslik, fontWeight: 800, fontSize: 20 }}>İçindekiler</div>
                <button type="button" aria-label="Kapat" onClick={() => setCekmece(false)} style={{ ...dugme, background: 'rgba(0,0,0,.06)', color: KITAP.murekkep }}><X size={18} /></button>
              </div>
              <div style={{ overflowY: 'auto', flex: 1, padding: '0 14px 18px' }}>
                {kitap.bolumler.map((b) => {
                  const s = dizgi.bolumSayfa[b.id];
                  const aktif = aktifBolum && aktifBolum.id === b.id;
                  return (
                    <button key={b.id} type="button" onClick={() => { setCekmece(false); git(s); }} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 10, padding: '10px 10px', margin: '2px 0', borderRadius: 10, border: 0, background: aktif ? `${b.renk}18` : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ width: 26, height: 26, flex: '0 0 26px', borderRadius: 8, background: b.renk, color: '#fff', fontFamily: FONT.arayuz, fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{b.no || '·'}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontFamily: FONT.baslik, fontWeight: 600, fontSize: 15 }}>{b.baslik}</span>
                        {b.kisa && <span style={{ display: 'block', fontFamily: FONT.arayuz, fontSize: 11.5, color: KITAP.soluk }}>{b.kisa}</span>}
                      </span>
                      <span style={{ fontFamily: FONT.arayuz, fontSize: 12, fontWeight: 700, color: KITAP.soluk }}>{s + 1}</span>
                    </button>
                  );
                })}

                {ayraclar.length > 0 && (
                  <>
                    <div style={{ fontFamily: FONT.arayuz, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800, color: KITAP.kiremit, margin: '16px 4px 6px' }}>Ayraçlar</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {ayraclar.map((a) => (
                        <button key={a} type="button" onClick={() => { setCekmece(false); git(a); }} style={{ border: `1px solid ${KITAP.kiremit}55`, background: '#FBEDE7', color: KITAP.kiremit, borderRadius: 999, padding: '5px 11px', fontFamily: FONT.arayuz, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>s. {a + 1}</button>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ fontFamily: FONT.arayuz, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800, color: KITAP.zumrut, margin: '18px 4px 6px' }}>Komut yaz</div>
                <form
                  onSubmit={(e) => { e.preventDefault(); const k = komutCoz(komutMetni); setCekmece(false); uygula(k, komutMetni); setKomutMetni(''); }}
                  style={{ display: 'flex', gap: 6 }}
                >
                  <input
                    value={komutMetni}
                    onChange={(e) => setKomutMetni(e.target.value)}
                    placeholder="ör. beş sayfa geç · 40. sayfa · geri"
                    aria-label="Okuyucu komutu"
                    style={{ flex: 1, minWidth: 0, border: `1px solid ${KITAP.kenar}`, borderRadius: 10, padding: '10px 12px', fontFamily: FONT.arayuz, fontSize: 14, background: '#fff', color: KITAP.murekkep }}
                  />
                  <button type="submit" style={{ border: 0, borderRadius: 10, background: KITAP.zumrut, color: '#fff', padding: '0 14px', fontFamily: FONT.arayuz, fontWeight: 700 }}>Git</button>
                </form>
                <p style={{ fontFamily: FONT.arayuz, fontSize: 11.5, lineHeight: 1.5, color: KITAP.soluk, margin: '8px 4px 0' }}>
                  {TanimliTanima ? 'Mikrofon düğmesine basıp aynı komutları sesle de söyleyebilirsin. ' : 'Bu cihazda sesli komut desteklenmiyor; komutu yazabilirsin. '}
                  Sayfanın sağ kenarına dokun: ileri · sol kenarına: geri · ortasına: menüyü gizle/göster · sürükle: sayfayı elinle çevir.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mühürlü Hikmet Kartı Paylaş & Deftere Kaydet */}
      <AnimatePresence>
        {paylasAcik && sayfaHikmeti && (
          <>
            <motion.div
              key="paylas-perde"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPaylasAcik(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 45 }}
            />
            <motion.div
              key="paylas-kutu"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              style={{
                position: 'absolute',
                left: 16,
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                maxWidth: 420,
                margin: '0 auto',
                zIndex: 46,
                background: 'linear-gradient(150deg, #0F4A3A 0%, #092B21 60%, #061D16 100%)',
                border: '1.5px solid rgba(224,196,122,0.45)',
                borderRadius: 24,
                padding: 20,
                color: '#F8F2E4',
                boxShadow: '0 24px 60px rgba(0,0,0,0.75)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: FONT.arayuz, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, color: '#E0C47A' }}>
                  ✦ Mühürlü Hikmet Kartı ✦
                </span>
                <button type="button" aria-label="Kapat" onClick={() => setPaylasAcik(false)} style={{ ...dugme, width: 32, height: 32 }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ background: 'rgba(255,253,247,0.06)', border: '1px solid rgba(224,196,122,0.25)', borderRadius: 16, padding: 16 }}>
                <div style={{ fontFamily: FONT.arayuz, fontSize: 11, fontWeight: 700, color: '#E0C47A', marginBottom: 6 }}>
                  {sayfaHikmeti.tur}
                </div>
                <p style={{ margin: 0, fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 15, lineHeight: '23px', color: '#F8F2E4' }}>
                  “{sayfaHikmeti.metin}”
                </p>
                <div style={{ marginTop: 10, fontFamily: FONT.baslik, fontSize: 12.5, fontWeight: 700, color: '#E0C47A', textAlign: 'right' }}>
                  {sayfaHikmeti.kaynak}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={gorselKartIndir}
                  style={{ border: 0, borderRadius: 14, padding: '11px 8px', background: 'linear-gradient(135deg, #E9CB86, #C9A24E)', color: '#2A1E06', fontFamily: FONT.arayuz, fontWeight: 800, fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                >
                  <Download size={17} />
                  <span>Görsel Kart</span>
                </button>
                <button
                  type="button"
                  onClick={deftereKaydet}
                  style={{ border: '1px solid rgba(224,196,122,0.35)', borderRadius: 14, padding: '11px 8px', background: 'rgba(255,255,255,0.08)', color: '#F8F2E4', fontFamily: FONT.arayuz, fontWeight: 700, fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                >
                  <BookMarked size={17} color="#E0C47A" />
                  <span>Deftere Ekle</span>
                </button>
                <button
                  type="button"
                  onClick={metniKopyala}
                  style={{ border: '1px solid rgba(224,196,122,0.35)', borderRadius: 14, padding: '11px 8px', background: 'rgba(255,255,255,0.08)', color: '#F8F2E4', fontFamily: FONT.arayuz, fontWeight: 700, fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                >
                  <Copy size={17} color="#E0C47A" />
                  <span>Kopyala</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {hazir && !dizgi && <Olcer kitap={kitap} onBitti={olcumBitti} />}
    </div>
  );

  if (baski) {
    return createPortal(
      <div id="mo-baski-kok" style={{ position: 'absolute', inset: 0, zIndex: 1800 }}>
        {dizgi ? <BaskiGorunumu kitap={kitap} dizgi={dizgi} /> : <div style={{ padding: 40, color: '#fff', background: '#333', minHeight: '100vh', fontFamily: FONT.arayuz }}>Sayfalar diziliyor…</div>}
        {hazir && !dizgi && <Olcer kitap={kitap} onBitti={olcumBitti} />}
      </div>,
      document.body,
    );
  }
  return createPortal(icerik, document.body);
}
