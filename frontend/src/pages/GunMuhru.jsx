import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { useTx } from '../i18n';
import { getSadeTema, sa } from '../sade/themes';
import MuhurIsareti from '../components/sade/MuhurIsareti';
import { playSade } from '../services/sadeAudio';
import {
  HALLER, gununSorusu, bugunMuhurlu, getMuhur, muhurle,
  muhurSeridi, muhurSerisi, muhurSayisi,
} from '../services/gunMuhru';
import { gununCumlesi, nabizPuani, gununEksenleri } from '../services/nabiz';
import { kartUret, kartPaylas } from '../services/paylasimKarti';

// 🔏 GÜN MÜHRÜ — günün kapanış töreni
//
// Sade'nin güzel bir açılışı vardı, hiçbir çıkışı yoktu. Bu ekran o
// eksiği kapatır: yatsıdan sonra bir kez, yirmi saniye.
//
//   1. Gün özeti — nabız ve cümle, değiştirilemez
//   2. Tek soru + üç hâl işareti — yazmak zorunlu değil
//   3. MÜHÜR — balmumu düşer, mühür iner, iz kalır (ses eşlik eder)
//   4. Şerit — ayın mühürleri; otuz mühür otuz sayıdan çok şey anlatır
//
// Mühür geriye dönük basılamaz ve bozulamaz. Gün geçtiyse geçmiştir.

const ADIM = { OZET: 0, SORU: 1, TOREN: 2, BITTI: 3 };

/** Balmumu mührü — SVG, tasvir yok. */
function Muhur({ r, basiyor, basildi, boyut = 190 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: boyut, height: boyut }}>
      {/* Balmumu birikintisi */}
      <motion.div className="absolute rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={basiyor || basildi ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: boyut * 0.82, height: boyut * 0.82,
          background: `radial-gradient(circle at 38% 34%, ${r.vurguIsik}, ${r.vurgu} 58%, ${sa(r.vurgu, 0.65)} 100%)`,
          boxShadow: `0 10px 40px ${sa(r.vurgu, 0.45)}, inset 0 -6px 18px ${sa('#000000', 0.28)}`,
          filter: 'blur(0.4px)',
        }} />

      {/* İnen mühür ve iz */}
      <motion.svg viewBox="0 0 120 120" className="absolute"
        style={{ width: boyut * 0.62, height: boyut * 0.62 }}
        initial={{ scale: 2.4, opacity: 0, y: -70 }}
        animate={basiyor ? { scale: 1, opacity: 1, y: 0 } : basildi ? { scale: 1, opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.5, 0, 0.2, 1] }}>
        <g fill="none" stroke={sa('#3A2404', 0.55)} strokeWidth="2.4" strokeLinejoin="round">
          <rect x="26" y="26" width="68" height="68" rx="3" />
          <rect x="26" y="26" width="68" height="68" rx="3"
            style={{ transformOrigin: '60px 60px', transform: 'rotate(45deg)' }} />
          <circle cx="60" cy="60" r="17" />
          <circle cx="60" cy="60" r="48" strokeWidth="1.6" />
        </g>
      </motion.svg>

      {/* Sıçrayan damlalar */}
      <AnimatePresence>
        {basiyor && Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <motion.span key={i} className="absolute rounded-full"
              style={{ width: 7, height: 7, background: r.vurgu }}
              initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
              animate={{ x: Math.cos(a) * 105, y: Math.sin(a) * 105, opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.85, ease: 'easeOut' }} />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default function GunMuhru() {
  const tt = useTx();
  const navigate = useNavigate();
  const tema = getSadeTema();
  const r = tema.renk;

  const zatenMuhurlu = bugunMuhurlu();
  const [adim, setAdim] = useState(zatenMuhurlu ? ADIM.BITTI : ADIM.OZET);
  const [hal, setHal] = useState('sade');
  const [not, setNot] = useState('');
  const [basiyor, setBasiyor] = useState(false);
  const [kayit, setKayit] = useState(() => getMuhur());
  const [paylasiyor, setPaylasiyor] = useState(false);

  const soru = useMemo(() => gununSorusu(), []);
  const eksen = useMemo(() => gununEksenleri(), []);
  const puan = useMemo(() => (kayit ? kayit.puan : nabizPuani()), [kayit]);
  const cumle = useMemo(() => (kayit ? kayit.cumle : gununCumlesi().metin), [kayit]);
  const serit = muhurSeridi(30);
  const seri = muhurSerisi();
  const toplam = muhurSayisi();

  useEffect(() => { document.body.style.background = r.zemin; return () => { document.body.style.background = ''; }; }, [r.zemin]);

  const bas = useCallback(() => {
    setAdim(ADIM.TOREN);
    setBasiyor(true);
    playSade(tema.ses);
    setTimeout(() => {
      const k = muhurle({ hal, not });
      setKayit(k);
      setBasiyor(false);
      setAdim(ADIM.BITTI);
    }, 1500);
  }, [hal, not, tema.ses]);

  const paylas = useCallback(async () => {
    setPaylasiyor(true);
    try {
      const blob = await kartUret({
        tur: 'gun',
        renk: r,
        veri: {
          etiket: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }),
          puan,
          cumle,
          eksen: eksen.map(e => ({ ad: e.ad, oran: Math.round(e.oran * 100) })),
        },
      });
      await kartPaylas(blob, tt('Bugün'));
    } finally { setPaylasiyor(false); }
  }, [r, puan, cumle, eksen, tt]);

  const gir = (i) => ({
    initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 },
    transition: { delay: 0.05 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="min-h-screen px-5 pt-5 pb-16" style={{
      background: `linear-gradient(180deg, ${r.zeminUst} 0%, ${r.zemin} 60%)`,
      fontFamily: tema.yaziGovde,
    }} data-testid="gun-muhru">

      <div className="flex items-center gap-2 mb-6 max-w-md mx-auto">
        <button onClick={() => navigate('/sade')}
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: sa(r.vurgu, 0.1), border: `1px solid ${r.cizgi}` }} aria-label={tt('Geri')}>
          <ArrowLeft size={15} style={{ color: r.vurgu }} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: r.vurgu }}>
            {tt('Gün Mührü')}
          </p>
          <p className="text-[11.5px]" style={{ color: r.soluk }}>
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* ═══ 1 · ÖZET ═══ */}
        {adim === ADIM.OZET && (
          <>
            <motion.div {...gir(0)} className="text-center mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-5" style={{ color: r.soluk }}>
                {tt('Gün böyle geçti')}
              </p>
              <p className="text-[64px] font-black leading-none tabular-nums" style={{ color: r.metin }}>{puan}</p>
              <p className="text-[15px] leading-relaxed mt-5 px-2"
                style={{ fontFamily: tema.yaziBaslik, color: r.metin, opacity: 0.9 }}>{cumle}</p>
            </motion.div>

            <motion.div {...gir(1)} className="grid grid-cols-4 gap-2 mb-9">
              {eksen.map(e => (
                <div key={e.id} className="text-center">
                  <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: sa(r.vurgu, 0.14) }}>
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                      animate={{ width: `${e.oran * 100}%` }} transition={{ duration: 0.9 }}
                      style={{ background: r.vurgu }} />
                  </div>
                  <p className="text-[9.5px] font-black" style={{ color: r.metin }}>{tt(e.ad)}</p>
                  <p className="text-[8.5px] tabular-nums" style={{ color: r.soluk }}>{e.ham}</p>
                </div>
              ))}
            </motion.div>

            <motion.button {...gir(2)} onClick={() => setAdim(ADIM.SORU)}
              className="w-full py-4 rounded-2xl text-sm font-black active:scale-97 transition-transform"
              style={{ background: `linear-gradient(135deg, ${r.vurgu}, ${r.vurguIsik})`, color: r.uzeri }}>
              {tt('Günü kapat')}
            </motion.button>

            {/* Kuralı baştan söyleriz — mühür bir oyun puanı değildir. */}
            <motion.p {...gir(3)} className="text-[10.5px] leading-relaxed text-center mt-5 px-4"
              style={{ color: r.soluk }}>
              {tt('Mühür bir puan değil, bir kayıttır. Geriye dönük basılamaz, bozulmaz.')}
            </motion.p>
            {seri > 0 && (
              <motion.p {...gir(4)} className="text-[11px] font-black text-center mt-3"
                style={{ color: r.vurgu }}>
                {seri} {tt('gün kesintisiz')} · {toplam} {tt('mühür')}
              </motion.p>
            )}
          </>
        )}

        {/* ═══ 2 · SORU ═══ */}
        {adim === ADIM.SORU && (
          <>
            <motion.p {...gir(0)} className="text-[19px] leading-snug mb-6 text-center"
              style={{ fontFamily: tema.yaziBaslik, color: r.metin }}>{soru}</motion.p>

            <motion.textarea {...gir(1)} value={not} onChange={(e) => setNot(e.target.value)}
              rows={4} maxLength={280} placeholder={tt('İstersen yaz — zorunlu değil')}
              className="w-full rounded-2xl p-4 text-[13.5px] leading-relaxed outline-none resize-none mb-6"
              style={{
                background: sa(r.vurgu, 0.06), border: `1px solid ${r.cizgi}`,
                color: r.metin, fontFamily: 'Georgia, serif',
              }} />

            <motion.p {...gir(2)} className="text-[10px] font-black uppercase tracking-[0.26em] mb-3 text-center"
              style={{ color: r.soluk }}>{tt('Gün nasıl geçti')}</motion.p>
            <motion.div {...gir(3)} className="grid grid-cols-3 gap-2.5 mb-8">
              {HALLER.map(h => {
                const s = hal === h.id;
                return (
                  <button key={h.id} onClick={() => setHal(h.id)}
                    className="rounded-2xl py-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                    style={{
                      background: s ? sa(r.vurgu, 0.16) : sa(r.vurgu, 0.04),
                      border: `1.5px solid ${s ? r.vurgu : r.cizgi}`,
                    }}>
                    <span className="text-2xl">{h.simge}</span>
                    <span className="text-[10.5px] font-black" style={{ color: s ? r.vurgu : r.soluk }}>
                      {tt(h.ad)}
                    </span>
                  </button>
                );
              })}
            </motion.div>

            <motion.button {...gir(4)} onClick={bas}
              className="w-full py-4 rounded-2xl text-sm font-black active:scale-97 transition-transform"
              style={{ background: `linear-gradient(135deg, ${r.vurgu}, ${r.vurguIsik})`, color: r.uzeri }}>
              <span className="inline-flex items-center gap-2 justify-center">
                <MuhurIsareti renk={r.uzeri} boyut={17} kalinlik={1.7} /> {tt('Mührü bas')}
              </span>
            </motion.button>
          </>
        )}

        {/* ═══ 3 · TÖREN ═══ */}
        {adim === ADIM.TOREN && (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: 380 }}>
            <Muhur r={r} basiyor={basiyor} />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="text-[13px] mt-8" style={{ color: r.soluk }}>
              {tt('Gün mühürleniyor...')}
            </motion.p>
          </div>
        )}

        {/* ═══ 4 · BİTTİ ═══ */}
        {adim === ADIM.BITTI && (
          <>
            <motion.div {...gir(0)} className="flex flex-col items-center mb-7">
              <Muhur r={r} basildi boyut={150} />
              <p className="text-[19px] font-black mt-6"
                style={{ fontFamily: tema.yaziBaslik, color: r.metin }}>{tt('Gün mühürlendi')}</p>
              {kayit?.not && (
                <p className="text-[13px] italic mt-3 text-center px-4 leading-relaxed"
                  style={{ fontFamily: 'Georgia, serif', color: r.soluk }}>“{kayit.not}”</p>
              )}
            </motion.div>

            {/* Şerit — ayın mühürleri */}
            <motion.div {...gir(1)} className="rounded-2xl p-4 mb-4"
              style={{ background: sa(r.vurgu, 0.05), border: `1px solid ${r.cizgi}` }}>
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-[0.24em]" style={{ color: r.soluk }}>
                  {tt('Son 30 gün')}
                </p>
                <p className="text-[10px] font-black tabular-nums" style={{ color: r.vurgu }}>
                  {seri} {tt('gün seri')} · {toplam} {tt('mühür')}
                </p>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {serit.map(g => (
                  <div key={g.gun} title={g.gun}
                    className="aspect-square rounded-md flex items-center justify-center"
                    style={{
                      background: g.muhur ? r.vurgu : sa(r.vurgu, 0.07),
                      border: g.bugun ? `1.5px solid ${r.vurguIsik}` : 'none',
                    }}>
                    {g.muhur && <Check size={9} color={r.uzeri} strokeWidth={3.5} />}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.button {...gir(2)} onClick={paylas} disabled={paylasiyor}
              className="w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-97 transition-transform disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${r.vurgu}, ${r.vurguIsik})`, color: r.uzeri }}>
              <Share2 size={15} /> {paylasiyor ? tt('Hazırlanıyor...') : tt('Günü paylaş')}
            </motion.button>

            <motion.button {...gir(3)} onClick={() => navigate('/sade')}
              className="w-full mt-2.5 py-3 rounded-2xl text-[12px] font-black"
              style={{ background: sa(r.vurgu, 0.07), border: `1px solid ${r.cizgi}`, color: r.soluk }}>
              {tt('Kapat')}
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
