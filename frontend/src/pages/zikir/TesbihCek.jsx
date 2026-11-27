import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Volume2, VolumeX, Check } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { useTx } from '../../i18n';
import { zikirBul } from '../../data/zikirDua';
import { puanEkle } from '../../services/kazanim';
import { alfa, karistir } from '../../styles/renk';

// 📿 TESBİH ÇEK — gerçek tesbih gibi: taneleri parmakla AŞAĞI ÇEKERSİN ya da ekrana dokunursun.
// Her tanede hafif titreşim ve tık sesi; her 33'te ara tane (pul) geçerken güçlü titreşim.
// Çok bölümlü zikirlerde (namaz tesbihatı) bölüm bitince kendiliğinden sonrakine geçer.
// Sayım cihazda yalnız ekran açıkken tutulur; "Sevap Points" ibadet alanına küçük katkı yazılır.

const ARALIK = 52;      // taneler arası (px)
const GORUNEN = 6;      // ortadaki tanenin üstünde/altında kaç tane çizilir
const TUR_ANAHTAR = 'tesbih_turu';
const SES_ANAHTAR = 'tesbih_ses';

export const TESBIH_TURLERI = [
  { id: 'kehribar', ad: 'Kehribar', renk: ['#FCD58A', '#D98E2B', '#7A4310'], pul: '#F6E3B4' },
  { id: 'oltu', ad: 'Oltu', renk: ['#6B6B6B', '#1E1E1E', '#000000'], pul: '#C9A24E' },
  { id: 'sedef', ad: 'Sedef', renk: ['#FFFFFF', '#E9E4F2', '#A8A2B8'], pul: '#D4AF37' },
  { id: 'zumrut', ad: 'Zümrüt', renk: ['#7FE0B0', '#1D8A5B', '#0B3D27'], pul: '#E9C77E' },
  { id: 'kuka', ad: 'Kuka', renk: ['#B07A55', '#6B3E22', '#2E170A'], pul: '#E9C77E' },
];

async function titret(guclu) {
  try { await Haptics.impact({ style: guclu ? ImpactStyle.Heavy : ImpactStyle.Light }); return; } catch { /* web */ }
  try { if (navigator.vibrate) navigator.vibrate(guclu ? [40, 30, 40] : 10); } catch { /* yok */ }
}

let ses = null;
function tik(guclu) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ses = ses || new AC();
    const t = ses.currentTime;
    // Kısa "tık": filtrelenmiş gürültü patlaması (tane tanaya çarpma sesi)
    const uz = 0.045;
    const buf = ses.createBuffer(1, Math.floor(ses.sampleRate * uz), ses.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i += 1) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
    const kaynak = ses.createBufferSource(); kaynak.buffer = buf;
    const f = ses.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = guclu ? 1400 : 2600; f.Q.value = 2.2;
    const g = ses.createGain(); g.gain.value = guclu ? 0.5 : 0.28;
    kaynak.connect(f).connect(g).connect(ses.destination);
    kaynak.start(t);
  } catch { /* ses yok */ }
}

function Tane({ tur, y, boy, pul, imame, aktif }) {
  const [a, b, c] = tur.renk;
  if (imame) {
    return (
      <div style={{ position: 'absolute', left: '50%', top: y - 34, marginLeft: -15, width: 30, height: 68 }}>
        <div style={{ width: 30, height: 52, borderRadius: '15px / 26px', background: `radial-gradient(circle at 35% 30%, ${a}, ${b} 55%, ${c})`, boxShadow: '0 6px 14px -6px rgba(0,0,0,0.55)' }} />
        <div style={{ width: 2, height: 14, margin: '0 auto', background: tur.pul }} />
      </div>
    );
  }
  const r = pul ? boy * 0.62 : boy / 2;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: y - r, marginLeft: -r, width: r * 2, height: r * 2, borderRadius: '50%',
      background: pul ? `radial-gradient(circle at 35% 30%, #FFFFFF, ${tur.pul} 45%, ${karistir(tur.pul, '#000000', 0.45)})` : `radial-gradient(circle at 34% 30%, ${a}, ${b} 52%, ${c})`,
      boxShadow: aktif ? `0 0 0 3px ${alfa(tur.pul, 0.55)}, 0 8px 18px -8px rgba(0,0,0,0.6)` : '0 6px 14px -8px rgba(0,0,0,0.55)',
    }}>
      <span style={{ position: 'absolute', left: '22%', top: '16%', width: '30%', height: '22%', borderRadius: '50%', background: 'rgba(255,255,255,0.55)', filter: 'blur(1px)' }} />
    </div>
  );
}

export default function TesbihCek() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const tt = useTx();
  const zikir = useMemo(() => zikirBul(id) || zikirBul('serbest'), [id]);
  const serbest = zikir.id === 'serbest';

  // Sayım bir ref'te tutulur: hızlı dokunuşlarda eski kapanış (closure) değerleri sayıyı kaybettirmesin.
  const durum = useRef({ adim: 0, sayi: 0, toplam: 0, bitti: false });
  const [, yenile] = useState(0);
  const { adim, sayi, toplam, bitti } = durum.current;
  const [serbestHedef, setSerbestHedef] = useState(33);
  const hedefRef = useRef(33);
  const [turId, setTurId] = useState(() => { try { return localStorage.getItem(TUR_ANAHTAR) || 'kehribar'; } catch { return 'kehribar'; } });
  const [sesAcik, setSesAcik] = useState(() => { try { return localStorage.getItem(SES_ANAHTAR) !== '0'; } catch { return true; } });
  const [turSec, setTurSec] = useState(false);
  const tur = TESBIH_TURLERI.find((t) => t.id === turId) || TESBIH_TURLERI[0];

  const ofset = useMotionValue(0);
  const mesgul = useRef(null);
  const surukle = useRef(null);
  const birikim = useRef(0);

  const bolum = zikir.adim[adim];
  const hedef = serbest ? serbestHedef : bolum.hedef;

  // Sevap Points katkısını toplu yaz (her tanede yazmak yerine)
  const puanYaz = useCallback(() => {
    if (birikim.current > 0) { puanEkle('ibadet', +(birikim.current * 0.1).toFixed(2)); birikim.current = 0; }
  }, []);
  useEffect(() => () => puanYaz(), [puanYaz]);

  hedefRef.current = hedef;
  const say = useCallback(() => {
    const d = durum.current;
    if (d.bitti) return;
    const bolumHedef = serbest ? hedefRef.current : zikir.adim[d.adim].hedef;
    const yeni = d.sayi + 1;
    const pul = (d.toplam + 1) % 33 === 0;
    const bolumBitti = bolumHedef > 0 && yeni >= bolumHedef;
    titret(pul || bolumBitti);
    if (sesAcik) tik(pul || bolumBitti);
    birikim.current += 1;
    d.toplam += 1;
    if (bolumBitti) {
      if (!serbest && d.adim < zikir.adim.length - 1) { d.adim += 1; d.sayi = 0; }
      else { d.sayi = yeni; d.bitti = true; puanYaz(); }
    } else d.sayi = yeni;
    yenile((x) => x + 1);
  }, [sesAcik, serbest, zikir.adim, puanYaz]);

  // Bir tane geçir: ipi bir aralık aşağı kaydır, sonra sayıyı artırıp ipi yerine koy (görsel süreklilik)
  const tane = useCallback(() => {
    if (durum.current.bitti) return;
    if (mesgul.current) { mesgul.current.stop(); mesgul.current = null; ofset.set(0); say(); }
    const kontrol = animate(ofset, ARALIK, { type: 'spring', stiffness: 700, damping: 42, restDelta: 0.5 });
    mesgul.current = kontrol;
    kontrol.then(() => {
      if (mesgul.current !== kontrol) return;
      mesgul.current = null;
      ofset.set(0);
      say();
    });
  }, [ofset, say]);

  // Parmakla çekme
  const bas = (e) => {
    if (bitti || turSec) return;
    surukle.current = { y0: e.clientY, t0: performance.now(), oynadi: false };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* yok */ }
  };
  const oynat = (e) => {
    const s = surukle.current; if (!s) return;
    const dy = e.clientY - s.y0;
    if (Math.abs(dy) > 6) s.oynadi = true;
    if (mesgul.current) return;
    ofset.set(Math.max(0, Math.min(ARALIK * 1.15, dy)));
    if (dy > ARALIK * 0.92) { // çekiş bir taneyi geçti: say ve yeni çekiş başlat
      ofset.set(0); say(); s.y0 = e.clientY;
    }
  };
  const birak = () => {
    const s = surukle.current; surukle.current = null;
    if (!s) return;
    const v = ofset.get();
    if (!s.oynadi) { tane(); return; }                  // dokunuş
    if (v > ARALIK * 0.35) {                              // yarıdan fazla çekildiyse tamamla
      const k = animate(ofset, ARALIK, { type: 'spring', stiffness: 700, damping: 42 });
      mesgul.current = k;
      k.then(() => { if (mesgul.current === k) { mesgul.current = null; ofset.set(0); say(); } });
    } else animate(ofset, 0, { type: 'spring', stiffness: 500, damping: 36 });
  };

  useEffect(() => {
    const tus = (e) => { if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); tane(); } };
    window.addEventListener('keydown', tus);
    return () => window.removeEventListener('keydown', tus);
  }, [tane]);

  const sifirla = () => { if (mesgul.current) mesgul.current.stop(); mesgul.current = null; ofset.set(0); puanYaz(); durum.current = { adim: 0, sayi: 0, toplam: 0, bitti: false }; yenile((x) => x + 1); };
  const turDegis = (t) => { setTurId(t); try { localStorage.setItem(TUR_ANAHTAR, t); } catch { /* kota */ } setTurSec(false); };
  const sesDegis = () => { const v = !sesAcik; setSesAcik(v); try { localStorage.setItem(SES_ANAHTAR, v ? '1' : '0'); } catch { /* kota */ } };

  // Görünen taneler: j=0 parmağın altındaki tane. Kimlik = toplam - j (aşağı çektikçe yukarıdan yeni tane gelir).
  // Kimlik -1 imamedir (tesbihin başı, püsküllü); onun altında tane yoktur. Her 33. tane pul (ayırıcı) tanedir.
  const taneler = [];
  for (let j = -GORUNEN; j <= GORUNEN; j += 1) {
    const kimlik = toplam - j;
    if (kimlik < -1) continue;
    taneler.push({ j, kimlik, pul: kimlik >= 0 && (kimlik + 1) % 33 === 0, imame: kimlik === -1 });
  }

  const koyu = theme.isDark;
  const zemin = koyu
    ? `radial-gradient(120% 80% at 50% 70%, ${karistir(theme.surface, theme.primary, 0.35)} 0%, ${theme.bg} 70%)`
    : `radial-gradient(120% 80% at 50% 70%, ${karistir(theme.bg, theme.primary, 0.14)} 0%, ${theme.bg} 70%)`;
  const oran = hedef > 0 ? Math.min(1, sayi / hedef) : 0;
  const R = 26; const C = 2 * Math.PI * R;

  return (
    <div data-testid="tesbih-cek" className="fixed inset-0 z-[120] flex flex-col select-none" style={{ background: zemin, color: theme.textPrimary, touchAction: 'none' }}>
      {/* Üst çubuk */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 'max(14px, env(safe-area-inset-top)) 14px 6px' }}>
        <button type="button" onClick={() => navigate(-1)} aria-label={tt('Kapat')} style={ikonDugme(theme)}><X size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700 }}>{tt(zikir.ad)}</div>
          {zikir.adim.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 4 }} aria-label={`${adim + 1}/${zikir.adim.length}`}>
              {zikir.adim.map((_, i) => <span key={i} style={{ width: i === adim ? 18 : 7, height: 7, borderRadius: 4, background: i < adim || bitti ? theme.gold : i === adim ? alfa(theme.gold, 0.7) : alfa(theme.textSecondary, 0.3), transition: 'width .25s' }} />)}
            </div>
          )}
        </div>
        <button type="button" onClick={sesDegis} aria-label={tt(sesAcik ? 'Sesi kapat' : 'Sesi aç')} style={ikonDugme(theme)}>{sesAcik ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
        <button type="button" onClick={sifirla} aria-label={tt('Baştan başla')} style={ikonDugme(theme)}><RotateCcw size={18} /></button>
      </div>

      {/* Zikrin metni */}
      <AnimatePresence mode="wait">
        <motion.div key={`${zikir.id}-${adim}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
          style={{ padding: '6px 22px 0', textAlign: 'center' }}>
          {bolum.ar ? (
            <p dir="rtl" lang="ar" style={{ margin: 0, fontFamily: "'Amiri', serif", fontSize: bolum.ar.length > 60 ? 22 : 32, lineHeight: 1.7, color: koyu ? theme.goldLight || theme.gold : karistir(theme.gold, '#000000', 0.25) }}>{bolum.ar}</p>
          ) : null}
          {bolum.oku && <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 700 }}>{bolum.oku}</p>}
          <p style={{ margin: '4px auto 0', maxWidth: 420, fontSize: 13, lineHeight: 1.45, color: theme.textSecondary, fontFamily: 'var(--font-okuma)' }}>{tt(bolum.anlam)}</p>
        </motion.div>
      </AnimatePresence>

      {/* Tesbih alanı: her yeri dokunulabilir, taneler aşağı çekilir */}
      <div role="button" tabIndex={0} aria-label={tt('Tesbih: taneyi aşağı çek ya da dokun')}
        onPointerDown={bas} onPointerMove={oynat} onPointerUp={birak} onPointerCancel={birak}
        style={{ position: 'relative', flex: 1, minHeight: 260, overflow: 'hidden', cursor: 'grab', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)', maskImage: 'linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)' }}>
        {/* ip */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, marginLeft: -1, background: alfa(tur.pul, 0.6) }} />
        <motion.div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 0, y: ofset, willChange: 'transform' }}>
          {taneler.map((t) => <Tane key={t.kimlik} tur={tur} y={t.j * ARALIK} boy={40} pul={t.pul} imame={t.imame} aktif={t.j === 0} />)}
        </motion.div>
        {/* parmak işareti */}
        <div aria-hidden style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: 34, marginTop: -10, fontSize: 11, fontWeight: 700, color: theme.textSecondary, opacity: toplam === 0 ? 1 : 0, transition: 'opacity .4s' }}>
          ↓ {tt('çek')}
        </div>
      </div>

      {/* Sayaç */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '6px 18px calc(18px + env(safe-area-inset-bottom))' }}>
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          <svg width="64" height="64" aria-hidden>
            <circle cx="32" cy="32" r={R} fill="none" stroke={alfa(theme.textSecondary, 0.2)} strokeWidth="5" />
            <circle cx="32" cy="32" r={R} fill="none" stroke={theme.gold} strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - oran)} transform="rotate(-90 32 32)" style={{ transition: 'stroke-dashoffset .2s' }} />
          </svg>
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: theme.textSecondary }}>{hedef > 0 ? `×${hedef}` : '∞'}</span>
        </div>
        <div aria-live="polite" style={{ minWidth: 110, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 46, fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{sayi}</div>
          <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 4 }}>{tt('Toplam')} {toplam}</div>
        </div>
        <button type="button" onClick={() => setTurSec(true)} aria-label={tt('Tesbih türü')} style={{ ...ikonDugme(theme), width: 64, height: 64, borderRadius: 32, flexDirection: 'column', gap: 2 }}>
          <span style={{ width: 22, height: 22, borderRadius: 11, background: `radial-gradient(circle at 35% 30%, ${tur.renk[0]}, ${tur.renk[1]} 55%, ${tur.renk[2]})` }} />
          <span style={{ fontSize: 10, fontWeight: 700 }}>{tt(tur.ad)}</span>
        </button>
      </div>

      {serbest && !bitti && (
        <div style={{ position: 'absolute', top: 'calc(max(14px, env(safe-area-inset-top)) + 56px)', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[33, 99, 100, 0].map((h) => (
            <button key={h} type="button" onClick={() => { setSerbestHedef(h); }} style={{ height: 32, padding: '0 12px', borderRadius: 16, fontSize: 12, fontWeight: 700, border: `1px solid ${serbestHedef === h ? theme.gold : theme.cardBorder}`, background: serbestHedef === h ? theme.gold : theme.surface, color: serbestHedef === h ? '#1A1406' : theme.textPrimary }}>
              {h === 0 ? '∞' : `×${h}`}
            </button>
          ))}
        </div>
      )}

      {/* Tesbih türü seçici */}
      <AnimatePresence>
        {turSec && (
          <motion.div key="tur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setTurSec(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end' }}>
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', background: theme.surface, borderRadius: '24px 24px 0 0', padding: '18px 18px calc(22px + env(safe-area-inset-bottom))' }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>{tt('Tesbih türü')}</div>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
                {TESBIH_TURLERI.map((t) => (
                  <button key={t.id} type="button" onClick={() => turDegis(t.id)} style={{ flexShrink: 0, width: 76, padding: '10px 0', borderRadius: 16, border: `2px solid ${t.id === turId ? theme.gold : theme.cardBorder}`, background: theme.bg, color: theme.textPrimary, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ display: 'flex', gap: 2 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 16, height: 16, borderRadius: 8, background: `radial-gradient(circle at 35% 30%, ${t.renk[0]}, ${t.renk[1]} 55%, ${t.renk[2]})` }} />)}</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{tt(t.ad)}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bitiş */}
      <AnimatePresence>
        {bitti && (
          <motion.div key="bitti" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: alfa(theme.bg, 0.88), display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div initial={{ scale: 0.9, y: 12 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ width: '100%', maxWidth: 360, borderRadius: 26, padding: 24, textAlign: 'center', background: theme.surface, border: `1px solid ${alfa(theme.gold, 0.4)}` }}>
              <div style={{ width: 58, height: 58, borderRadius: 29, margin: '0 auto 12px', background: theme.gold, color: '#1A1406', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={30} strokeWidth={3} /></div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700 }}>{tt('Allah kabul etsin')}</div>
              <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6 }}>{toplam} {tt('tane')} · {tt(zikir.ad)}</div>
              {zikir.fazilet && <p style={{ fontSize: 13, lineHeight: 1.5, margin: '12px 0 0', fontFamily: 'var(--font-okuma)' }}>“{tt(zikir.fazilet)}”<br /><span style={{ fontSize: 11, color: theme.textSecondary }}>{zikir.kaynak}</span></p>}
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button type="button" onClick={sifirla} style={{ flex: 1, height: 46, borderRadius: 23, border: `1px solid ${theme.cardBorder}`, background: theme.bg, color: theme.textPrimary, fontWeight: 700 }}>{tt('Tekrar')}</button>
                <button type="button" onClick={() => navigate('/dhikr')} style={{ flex: 1, height: 46, borderRadius: 23, border: 'none', background: theme.gold, color: '#1A1406', fontWeight: 700 }}>{tt('Diğer zikirler')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ikonDugme(theme) {
  return { width: 42, height: 42, borderRadius: 21, display: 'flex', alignItems: 'center', justifyContent: 'center', background: alfa(theme.surface, 0.8), border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, cursor: 'pointer' };
}
