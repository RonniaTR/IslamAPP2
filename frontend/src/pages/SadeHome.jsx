import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Layers, Palette, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import { useTx } from '../i18n';
import { fetchWithCache } from '../services/cache';
import api from '../api';
import { SADE_TEMALAR, getSadeTema, setSadeTema, sa } from '../sade/themes';
import SadeKapi from '../components/sade/SadeKapi';
import nabiz, {
  VAKITLER, kilinanlar, namazIsaretle, acilisKaydet,
  gununEksenleri, nabizPuani, gununCumlesi, haftaninOkumasi,
} from '../services/nabiz';
import { getTodayPlan, isTaskDone, toggleTask, TASK_POOL, getProfile } from '../services/pathEngine';

// 🌗 SADE — uygulamanın ön yüzü
//
// Tek soruya cevap verir: ŞU AN NE YAPMALIYIM?
// Üstte canlı vakit kartı, altında en fazla üç adım, sonra nabız.
// Bugünkü 49 rotanın tamamı "Derinlik" düğmesinin arkasında durur.
//
// ÜÇ DÜNYA, ÜÇ YAPI (bkz. sade/themes.js):
//   dikey (Sükûn)  tek sütun, geniş boşluk, büyük tipografi, tek şey
//   yatay (Fecr)   gün üstte şerit, adımlar yatay kaydırmalı kartlarda
//   kemer (Mihrap) kemer başlık, hatlı ızgara, numaralı sütun
//
// Renk değişmiyor — DURUŞ değişiyor.

const KAPI_KEY = 'sade_kapi_gorundu';

// Sunucuya ulaşılamadığında kullanılan makul vakitler (İstanbul ortalaması).
// Amaç doğru vakti vermek değil, ekranın çalışır kalmasıdır.
const VARSAYILAN_VAKIT = { fajr: '05:12', dhuhr: '13:18', asr: '17:04', maghrib: '19:47', isha: '21:12' };

/* ══════════════ Ortak parçalar ══════════════ */

function VakitDurumu(times) {
  const now = new Date();
  const dk = now.getHours() * 60 + now.getMinutes();
  const list = VAKITLER.map(v => {
    const s = times?.[v.id];
    if (!s) return null;
    const [h, m] = String(s).split(':').map(Number);
    return { ...v, dk: h * 60 + m, saat: s };
  }).filter(Boolean);
  if (!list.length) return null;

  const gecmis = list.filter(v => v.dk <= dk);
  const suan = gecmis.length ? gecmis[gecmis.length - 1] : list[list.length - 1];
  const sonraki = list.find(v => v.dk > dk) || null;
  const kalan = sonraki ? sonraki.dk - dk : null;
  return { suan, sonraki, kalan, list };
}

function kalanMetin(dk) {
  if (dk == null) return '';
  const s = Math.floor(dk / 60), m = dk % 60;
  return s ? `${s} sa ${m} dk` : `${m} dk`;
}

/* ══════════════ Ana ekran ══════════════ */

export default function SadeHome() {
  const { user } = useAuth();
  const { selectedCity } = useLang();
  const tt = useTx();
  const navigate = useNavigate();

  const [tema, setTema] = useState(() => getSadeTema());
  const [kapi, setKapi] = useState(false);
  const [times, setTimes] = useState(null);
  const [, force] = useState(0);
  const [temaAcik, setTemaAcik] = useState(false);

  const r = tema.renk;
  const ad = (user?.name || '').split(' ')[0];

  useEffect(() => {
    acilisKaydet();
    let g = true;
    try { g = sessionStorage.getItem(KAPI_KEY) === '1'; } catch { /* ignore */ }
    if (!g) setKapi(true);
  }, []);

  // Namaz vakitleri. Sunucuya ulaşılamazsa makul bir varsayılanla devam
  // ederiz — kart boş kalmaz, kullanıcı yine de vakit işaretleyebilir.
  useEffect(() => {
    let alive = true;
    fetchWithCache(`prayer_${selectedCity}`, () => api.get(`/prayer-times/${selectedCity}`).then(x => x.data),
      { ttl: 30 * 60 * 1000 })
      .then(d => { if (alive) setTimes(d?.times || d || VARSAYILAN_VAKIT); })
      .catch(() => { if (alive) setTimes(VARSAYILAN_VAKIT); });
    return () => { alive = false; };
  }, [selectedCity]);

  useEffect(() => {
    document.body.style.background = r.zemin;
    return () => { document.body.style.background = ''; };
  }, [r.zemin]);

  const durum = useMemo(() => VakitDurumu(times), [times]);
  const kilinan = kilinanlar();
  const eksenler = gununEksenleri();
  const puan = nabizPuani();
  const cumle = gununCumlesi();
  const hafta = haftaninOkumasi();

  const plan = getProfile() ? getTodayPlan() : null;
  const adimlar = useMemo(() => {
    if (!plan) return [];
    return plan.tasks.slice(0, 3).map(id => TASK_POOL[id]).filter(Boolean)
      .map(t => ({ ...t, bitti: isTaskDone(plan, t.id) }));
  }, [plan]);

  const isaretle = useCallback((v) => { namazIsaretle(v); force(x => x + 1); }, []);
  const temaSec = useCallback((id) => {
    setTema(setSadeTema(id));
    setTemaAcik(false);
    try { sessionStorage.removeItem(KAPI_KEY); } catch { /* ignore */ }
    setKapi(true);   // yeni dünyanın kapısı açılır
  }, []);

  const hiz = tema.tempo;
  const gir = (i) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.06 + i * 0.07 * hiz, duration: 0.5 * hiz, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="min-h-screen relative" style={{
      background: `linear-gradient(180deg, ${r.zeminUst} 0%, ${r.zemin} 55%)`,
      fontFamily: tema.yaziGovde,
    }} data-testid="sade-home">

      <AnimatePresence>
        {kapi && (
          <SadeKapi tema={tema} onDone={() => {
            try { sessionStorage.setItem(KAPI_KEY, '1'); } catch { /* ignore */ }
            setKapi(false);
          }} />
        )}
      </AnimatePresence>

      {/* ── Üst çubuk ── */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-1 relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: r.vurgu }}>
            {tema.simge} {tema.ad}
          </p>
          <p className="text-[13px] font-black truncate" style={{ color: r.metin }}>
            {tt('Selamün Aleyküm')}{ad ? `, ${ad}` : ''}
          </p>
        </div>
        <button onClick={() => setTemaAcik(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: sa(r.vurgu, 0.1), border: `1px solid ${r.cizgi}` }}
          aria-label={tt('Dünya seç')}>
          <Palette size={15} style={{ color: r.vurgu }} />
        </button>
      </div>

      {/* ═══════════════ YAPI 1 · DİKEY (Sükûn) ═══════════════ */}
      {tema.duzen === 'dikey' && (
        <div className="px-6 pt-6 pb-44 max-w-md mx-auto">
          <motion.div {...gir(0)} className="text-center mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: r.vurgu }}>
              {durum ? (durum.sonraki ? tt('Sonraki vakit') : tt('Vakit')) : tt('Bugün')}
            </p>
            <h1 className="text-[42px] font-black leading-none mb-3"
              style={{ fontFamily: tema.yaziBaslik, color: r.metin }}>
              {durum ? tt(durum.sonraki ? durum.sonraki.ad : durum.suan.ad) : tt('Bugün')}
            </h1>
            {durum && (
              <p className="text-[13px] tabular-nums" style={{ color: r.soluk }}>
                {durum.sonraki
                  ? `${kalanMetin(durum.kalan)} · ${durum.sonraki.saat}`
                  : durum.suan.saat}
              </p>
            )}
          </motion.div>

          {/* Beş vakit — tek satır, sade */}
          {durum && (
            <motion.div {...gir(1)} className="flex justify-between mb-12">
              {durum.list.map(v => {
                const k = kilinan.includes(v.id);
                const gecti = v.dk <= (new Date().getHours() * 60 + new Date().getMinutes());
                return (
                  <button key={v.id} onClick={() => isaretle(v.id)}
                    className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                    <span className="w-11 h-11 rounded-full flex items-center justify-center"
                      style={{
                        background: k ? r.vurgu : 'transparent',
                        border: `1.5px solid ${k ? r.vurgu : gecti ? r.cizgiKoyu : r.cizgi}`,
                        opacity: gecti || k ? 1 : 0.45,
                      }}>
                      {k && <Check size={16} color={r.uzeri} strokeWidth={3} />}
                    </span>
                    <span className="text-[9px] font-bold" style={{ color: k ? r.vurgu : r.soluk }}>
                      {tt(v.ad)}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* Üç adım — tek sütun, geniş */}
          <motion.p {...gir(2)} className="text-[10px] font-black uppercase tracking-[0.3em] mb-5 text-center"
            style={{ color: r.soluk }}>
            {tt('Bugünün üç adımı')}
          </motion.p>
          <div className="space-y-3">
            {adimlar.map((a, i) => (
              <motion.button key={a.id} {...gir(3 + i)}
                onClick={() => navigate(a.route)}
                className="w-full flex items-center gap-4 py-5 px-1 text-left"
                style={{ borderBottom: `1px solid ${r.cizgi}` }}>
                <span onClick={(e) => { e.stopPropagation(); toggleTask(a.id); force(x => x + 1); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: a.bitti ? r.vurgu : 'transparent', border: `1.5px solid ${a.bitti ? r.vurgu : r.cizgiKoyu}` }}>
                  {a.bitti && <Check size={13} color={r.uzeri} strokeWidth={3} />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[17px] font-black leading-snug"
                    style={{ fontFamily: tema.yaziBaslik, color: r.metin, opacity: a.bitti ? 0.45 : 1 }}>
                    {a.icon} {tt(a.title)}
                  </span>
                  <span className="block text-[11px] mt-1" style={{ color: r.soluk }}>{a.minutes} {tt('dk')}</span>
                </span>
              </motion.button>
            ))}
          </div>

          {/* Nabız — tek halka, tek cümle */}
          <motion.div {...gir(7)} className="mt-14 text-center">
            <NabizHalka r={r} puan={puan} boyut={128} />
            <p className="text-[14px] leading-relaxed mt-6 px-2"
              style={{ fontFamily: tema.yaziBaslik, color: r.metin, opacity: 0.9 }}>
              {cumle.metin}
            </p>
          </motion.div>
        </div>
      )}

      {/* ═══════════════ YAPI 2 · YATAY (Fecr) ═══════════════ */}
      {tema.duzen === 'yatay' && (
        <div className="pt-4 pb-44">
          {/* Gün şeridi — vakitler yatay akar */}
          {durum && (
            <motion.div {...gir(0)} className="px-5">
              <div className="rounded-3xl p-4" style={{ background: r.kartUst, border: `1px solid ${r.cizgi}` }}>
                <div className="flex items-baseline justify-between mb-3">
                  <p className="text-[11px] font-black" style={{ color: r.vurgu }}>
                    {durum.sonraki ? `${tt(durum.sonraki.ad)} · ${kalanMetin(durum.kalan)}` : tt(durum.suan.ad)}
                  </p>
                  <p className="text-[10px] tabular-nums" style={{ color: r.soluk }}>
                    {kilinan.length}/5
                  </p>
                </div>
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-3 right-3 h-0.5 rounded-full" style={{ background: r.cizgi }} />
                  {durum.list.map(v => {
                    const k = kilinan.includes(v.id);
                    const su = durum.suan.id === v.id;
                    return (
                      <button key={v.id} onClick={() => isaretle(v.id)}
                        className="relative flex flex-col items-center gap-1.5 active:scale-90 transition-transform">
                        <span className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{
                            background: k ? r.vurgu : r.kart,
                            border: `2px solid ${k || su ? r.vurgu : r.cizgi}`,
                            boxShadow: su ? `0 0 0 4px ${sa(r.vurgu, 0.14)}` : 'none',
                          }}>
                          {k ? <Check size={14} color={r.uzeri} strokeWidth={3} />
                            : <span className="text-[9px] font-black tabular-nums" style={{ color: r.soluk }}>{v.saat.slice(0, 2)}</span>}
                        </span>
                        <span className="text-[8.5px] font-bold" style={{ color: k ? r.vurgu : r.soluk }}>{tt(v.ad)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Adımlar — yatay kaydırmalı büyük kartlar */}
          <motion.p {...gir(1)} className="text-[10px] font-black uppercase tracking-[0.26em] px-5 mt-7 mb-3"
            style={{ color: r.soluk }}>
            {tt('Bugünün üç adımı')}
          </motion.p>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-2">
            {adimlar.map((a, i) => (
              <motion.button key={a.id} {...gir(2 + i)}
                onClick={() => navigate(a.route)}
                className="shrink-0 w-[190px] rounded-3xl p-4 text-left relative overflow-hidden"
                style={{
                  background: a.bitti ? r.kart : r.kartUst,
                  border: `1.5px solid ${a.bitti ? r.cizgi : r.cizgiKoyu}`,
                  opacity: a.bitti ? 0.6 : 1,
                }}>
                <motion.span className="text-3xl block mb-3"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}>
                  {a.icon}
                </motion.span>
                <p className="text-[14px] font-black leading-tight"
                  style={{ fontFamily: tema.yaziBaslik, color: r.metin }}>{tt(a.title)}</p>
                <p className="text-[10px] mt-1.5 leading-snug" style={{ color: r.soluk }}>{tt(a.desc)}</p>
                <p className="text-[10px] font-black mt-3" style={{ color: r.vurgu }}>
                  {a.bitti ? `✓ ${tt('Bitti')}` : `${a.minutes} ${tt('dk')} →`}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Nabız — yatay bar dizisi */}
          <motion.div {...gir(6)} className="px-5 mt-7">
            <div className="rounded-3xl p-4" style={{ background: r.kart, border: `1px solid ${r.cizgi}` }}>
              <div className="flex items-center gap-4 mb-4">
                <NabizHalka r={r} puan={puan} boyut={62} ince />
                <p className="text-[12.5px] leading-relaxed flex-1"
                  style={{ fontFamily: tema.yaziBaslik, color: r.metin }}>{cumle.metin}</p>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {eksenler.map(e => (
                  <div key={e.id}>
                    <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: sa(r.vurgu, 0.13) }}>
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                        animate={{ width: `${e.oran * 100}%` }} transition={{ duration: 0.9 }}
                        style={{ background: r.vurgu }} />
                    </div>
                    <p className="text-[9px] font-black" style={{ color: r.metin }}>{tt(e.ad)}</p>
                    <p className="text-[8.5px] tabular-nums" style={{ color: r.soluk }}>{e.ham}</p>
                  </div>
                ))}
              </div>
              {hafta && (
                <p className="text-[10.5px] mt-4 pt-3 leading-relaxed"
                  style={{ borderTop: `1px solid ${r.cizgi}`, color: r.soluk }}>{hafta.metin}</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════ YAPI 3 · KEMER (Mihrap) ═══════════════ */}
      {tema.duzen === 'kemer' && (
        <div className="px-5 pt-3 pb-44 max-w-md mx-auto">
          {/* Kemer içinde vakit */}
          <motion.div {...gir(0)} className="relative">
            <svg viewBox="0 0 320 168" className="w-full" style={{ display: 'block' }} aria-hidden>
              <path d="M14 168 L14 78 Q14 14 160 14 Q306 14 306 78 L306 168 Z"
                fill={r.kartUst} stroke={r.cizgiKoyu} strokeWidth="1.5" />
              <path d="M34 168 L34 84 Q34 34 160 34 Q286 34 286 84 L286 168"
                fill="none" stroke={r.cizgi} strokeWidth="1" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
              <p className="text-[9px] font-black uppercase tracking-[0.32em]" style={{ color: r.vurgu }}>
                {durum?.sonraki ? tt('Sonraki vakit') : tt('Vakit')}
              </p>
              <p className="text-[30px] font-black leading-none mt-1.5"
                style={{ fontFamily: tema.yaziBaslik, color: r.metin }}>
                {durum ? tt(durum.sonraki ? durum.sonraki.ad : durum.suan.ad) : tt('Bugün')}
              </p>
              <p className="text-[11.5px] mt-1 tabular-nums" style={{ color: r.soluk }}>
                {durum?.sonraki ? `${kalanMetin(durum.kalan)} · ${durum.sonraki.saat}` : durum?.suan.saat || ''}
              </p>
            </div>
          </motion.div>

          {/* Vakit ızgarası — beş sütun, hatlı */}
          {durum && (
            <motion.div {...gir(1)} className="grid grid-cols-5 mt-3"
              style={{ border: `1px solid ${r.cizgi}`, borderRadius: 14, overflow: 'hidden' }}>
              {durum.list.map((v, i) => {
                const k = kilinan.includes(v.id);
                return (
                  <button key={v.id} onClick={() => isaretle(v.id)}
                    className="py-3 flex flex-col items-center gap-1 active:opacity-70"
                    style={{
                      borderLeft: i ? `1px solid ${r.cizgi}` : 'none',
                      background: k ? sa(r.vurgu, 0.14) : 'transparent',
                    }}>
                    <span className="text-[8.5px] font-black uppercase tracking-wider"
                      style={{ color: k ? r.vurgu : r.soluk }}>{tt(v.ad)}</span>
                    <span className="text-[10px] font-black tabular-nums" style={{ color: k ? r.vurgu : r.metin }}>
                      {k ? '✓' : v.saat}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* Adımlar — numaralı sütun, hatlı */}
          <motion.p {...gir(2)} className="text-[9px] font-black uppercase tracking-[0.3em] mt-7 mb-2"
            style={{ color: r.soluk }}>
            {tt('Bugünün üç adımı')}
          </motion.p>
          <div style={{ border: `1px solid ${r.cizgi}`, borderRadius: 14, overflow: 'hidden' }}>
            {adimlar.map((a, i) => (
              <motion.button key={a.id} {...gir(3 + i)}
                onClick={() => navigate(a.route)}
                className="w-full flex items-center gap-3 p-3.5 text-left"
                style={{
                  borderTop: i ? `1px solid ${r.cizgi}` : 'none',
                  background: a.bitti ? sa(r.vurgu, 0.07) : 'transparent',
                }}>
                <span className="w-7 h-7 flex items-center justify-center text-[11px] font-black shrink-0"
                  style={{
                    border: `1px solid ${a.bitti ? r.vurgu : r.cizgiKoyu}`, borderRadius: 6,
                    color: a.bitti ? r.uzeri : r.vurgu, background: a.bitti ? r.vurgu : 'transparent',
                  }}>
                  {a.bitti ? <Check size={12} strokeWidth={3} /> : i + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13.5px] font-black" style={{ color: r.metin }}>
                    {a.icon} {tt(a.title)}
                  </span>
                  <span className="block text-[10px] mt-0.5 truncate" style={{ color: r.soluk }}>{tt(a.desc)}</span>
                </span>
                <span className="text-[10px] font-black tabular-nums shrink-0" style={{ color: r.vurgu }}>
                  {a.minutes}dk
                </span>
              </motion.button>
            ))}
          </div>

          {/* Nabız — dört sütunlu ızgara */}
          <motion.div {...gir(7)} className="mt-6"
            style={{ border: `1px solid ${r.cizgi}`, borderRadius: 14, overflow: 'hidden' }}>
            <div className="p-4 flex items-center gap-3.5" style={{ background: sa(r.vurgu, 0.05) }}>
              <NabizHalka r={r} puan={puan} boyut={56} ince />
              <p className="text-[12px] leading-relaxed flex-1"
                style={{ fontFamily: tema.yaziBaslik, color: r.metin }}>{cumle.metin}</p>
            </div>
            <div className="grid grid-cols-4" style={{ borderTop: `1px solid ${r.cizgi}` }}>
              {eksenler.map((e, i) => (
                <div key={e.id} className="p-3 text-center"
                  style={{ borderLeft: i ? `1px solid ${r.cizgi}` : 'none' }}>
                  <p className="text-[15px] font-black tabular-nums leading-none" style={{ color: r.vurgu }}>
                    {e.id === 'kalp' ? (e.sayi ? '✓' : '—') : e.sayi}
                  </p>
                  <p className="text-[8.5px] font-bold mt-1.5 uppercase tracking-wider" style={{ color: r.soluk }}>
                    {tt(e.ad)}
                  </p>
                </div>
              ))}
            </div>
            {hafta && (
              <p className="text-[10.5px] p-3.5 leading-relaxed"
                style={{ borderTop: `1px solid ${r.cizgi}`, color: r.soluk }}>{hafta.metin}</p>
            )}
          </motion.div>
        </div>
      )}

      {/* ── Derinlik ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-6 pt-8 z-20"
        style={{ background: `linear-gradient(180deg, transparent, ${r.zemin} 45%)` }}>
        <button onClick={() => navigate('/derinlik')}
          className="w-full py-3.5 rounded-2xl text-[12px] font-black flex items-center justify-center gap-2 active:scale-97 transition-transform"
          style={{ background: sa(r.vurgu, 0.1), border: `1px solid ${r.cizgi}`, color: r.soluk }}>
          <Layers size={14} /> {tt('Derinlik')}
          <span style={{ opacity: 0.6 }}>· {tt("Kur'an, Hazine, Oyun, Kütüphane")}</span>
        </button>
      </div>

      {/* ── Dünya seçici ── */}
      <AnimatePresence>
        {temaAcik && (
          <motion.div className="fixed inset-0 z-[120] flex items-end justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: sa('#000000', 0.6), backdropFilter: 'blur(6px)' }}
            onClick={() => setTemaAcik(false)}>
            <motion.div className="w-full max-w-md rounded-t-3xl p-5 pb-8"
              initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              transition={{ type: 'spring', damping: 26 }}
              style={{ background: r.zeminUst, border: `1px solid ${r.cizgi}` }}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center mb-4">
                <p className="text-[13px] font-black flex-1" style={{ color: r.metin }}>{tt('Dünya seç')}</p>
                <button onClick={() => setTemaAcik(false)} className="p-1.5" aria-label={tt('Kapat')}>
                  <X size={16} style={{ color: r.soluk }} />
                </button>
              </div>
              <p className="text-[11px] mb-4 leading-relaxed" style={{ color: r.soluk }}>
                {tt('Bunlar renk değil, üç ayrı düzen. Seçtiğinde ekranın duruşu da değişir.')}
              </p>
              <div className="space-y-2.5">
                {SADE_TEMALAR.map(t => {
                  const secili = t.id === tema.id;
                  return (
                    <button key={t.id} onClick={() => temaSec(t.id)}
                      className="w-full rounded-2xl p-3.5 flex items-center gap-3 text-left active:scale-98 transition-transform"
                      style={{
                        background: secili ? sa(t.renk.vurgu, 0.14) : t.renk.zemin,
                        border: `1.5px solid ${secili ? t.renk.vurgu : t.renk.cizgi}`,
                      }}>
                      <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ background: sa(t.renk.vurgu, 0.16), border: `1px solid ${sa(t.renk.vurgu, 0.35)}` }}>
                        {t.simge}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14px] font-black" style={{ color: t.renk.metin }}>{t.ad}</span>
                        <span className="block text-[10.5px] mt-0.5" style={{ color: t.renk.soluk }}>{t.ozet}</span>
                      </span>
                      {secili && <Check size={16} style={{ color: t.renk.vurgu }} strokeWidth={3} />}
                      {!secili && <ChevronRight size={15} style={{ color: t.renk.soluk }} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════ Nabız halkası ══════════════ */
function NabizHalka({ r, puan, boyut = 120, ince = false }) {
  const R = ince ? 24 : 46;
  const C = 2 * Math.PI * R;
  const vb = ince ? 56 : 112;
  return (
    <div className="relative shrink-0 mx-auto" style={{ width: boyut, height: boyut }}>
      <motion.div className="absolute inset-0 rounded-full"
        animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: `radial-gradient(circle, ${sa(r.vurguIsik, 0.4)}, transparent 68%)` }} />
      <svg width={boyut} height={boyut} viewBox={`0 0 ${vb} ${vb}`} className="-rotate-90 relative">
        <circle cx={vb / 2} cy={vb / 2} r={R} fill="none" stroke={sa(r.vurgu, 0.15)} strokeWidth={ince ? 4 : 7} />
        <motion.circle cx={vb / 2} cy={vb / 2} r={R} fill="none" stroke={r.vurgu}
          strokeWidth={ince ? 4 : 7} strokeLinecap="round" strokeDasharray={C}
          initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - puan / 100) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${sa(r.vurguIsik, 0.8)})` }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-black tabular-nums leading-none"
          style={{ fontSize: ince ? 15 : 30, color: r.metin }}>{puan}</span>
      </div>
    </div>
  );
}
