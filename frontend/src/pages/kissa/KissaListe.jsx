import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gem, Moon, Clock, ChevronRight, BookOpen } from 'lucide-react';

// 🕯️ KISSALAR — yeni liste görünümü (16. tur).
// Emoji kapaklar yerine her kıssaya özgü, koddan üretilen KEMER KAPAK (gökyüzü, tepeler, kemer pencere, baş harf).
// Kategoriler soldaki dikey bir "yol" üzerinde duraklar; her durakta kemer kartlar yana kayar.
// Hareketler açılıştaki dille aynı (kemer açılışı, altın parıltı) ama kısa: 0,25–0,45 sn.

const ALTIN = '#D8B76A';
const KREM = '#F4EFE3';

function tohum(str) { let h = 2166136261; for (let i = 0; i < str.length; i += 1) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; }

/** Kıssaya özgü kapak: kemer pencere, yıldızlar, tepeler, baş harf. */
export function KissaKapak({ s, h = 140, yuvarlak = '70px 70px 0 0', harf = true }) {
  const r = useMemo(() => tohum(s.id), [s.id]);
  const yildizlar = useMemo(() => Array.from({ length: 18 }, () => [r() * 200, r() * 90, r() * 1.2 + 0.4]), [r]);
  const motif = Math.floor(r() * 3);
  const [a, b] = s.grad || ['#0E3B2C', '#14523F'];
  const id = `kk-${s.id}`;
  return (
    <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice" width="100%" height={h} aria-hidden style={{ display: 'block', borderRadius: yuvarlak }}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
        <radialGradient id={`${id}-p`} cx="50%" cy="45%" r="55%"><stop offset="0" stopColor="#FFE9A8" stopOpacity="0.55" /><stop offset="1" stopColor="#FFE9A8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="200" height="140" fill={`url(#${id}-g)`} />
      {yildizlar.map(([x, y, rr], i) => <circle key={i} cx={x} cy={y} r={rr} fill="#FFF4CF" opacity={0.35 + (i % 3) * 0.2} />)}
      <rect width="200" height="140" fill={`url(#${id}-p)`} />
      {/* kemer pencere */}
      <path d="M70 140 V70 Q70 40 100 28 Q130 40 130 70 V140 Z" fill="rgba(255,244,207,0.10)" stroke={ALTIN} strokeWidth="1.4" />
      {motif === 0 && <g transform="translate(100 62)"><rect x="-9" y="-9" width="18" height="18" fill="none" stroke={ALTIN} strokeWidth="1.2" /><rect x="-9" y="-9" width="18" height="18" fill="none" stroke={ALTIN} strokeWidth="1.2" transform="rotate(45)" /></g>}
      {motif === 1 && (
        <g transform="translate(100 60)">
          <mask id={`${id}-m`}><rect x="-12" y="-12" width="24" height="24" fill="#fff" /><circle cx="4" cy="-3" r="9" fill="#000" /></mask>
          <circle r="10" fill="#E9C77E" mask={`url(#${id}-m)`} />
        </g>
      )}
      {motif === 2 && <g transform="translate(100 50)"><path d="M0 -14 V-4" stroke={ALTIN} /><path d="M-7 -4 H7 L4 10 H-4 Z" fill="#E9C77E" /><circle cy="3" r="14" fill="#FFE9A8" opacity="0.25" /></g>}
      {harf && <text x="100" y="118" textAnchor="middle" style={{ fontFamily: '"Fraunces", serif', fontSize: 34, fontWeight: 800, fill: KREM, opacity: 0.9 }}>{s.title.charAt(0)}</text>}
      {/* tepeler */}
      <path d={`M0 ${118 + r() * 8} Q50 ${100 + r() * 10} 100 ${120} T200 ${112 + r() * 8} V140 H0 Z`} fill="rgba(0,0,0,0.28)" />
      <path d={`M0 ${130} Q60 ${118 + r() * 6} 120 ${132} T200 ${126} V140 H0 Z`} fill="rgba(0,0,0,0.38)" />
    </svg>
  );
}

function Halka({ oran }) {
  const R = 24; const C = 2 * Math.PI * R;
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden>
      <circle cx="30" cy="30" r={R} fill="none" stroke="rgba(216,183,106,0.2)" strokeWidth="5" />
      <motion.circle cx="30" cy="30" r={R} fill="none" stroke={ALTIN} strokeWidth="5" strokeLinecap="round" strokeDasharray={C}
        initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - oran) }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} transform="rotate(-90 30 30)" />
    </svg>
  );
}

export default function KissaListe({ STORIES, STORY_CATEGORIES, STORY_GEMS, readIds, gems, openStory, onNight }) {
  const gunun = useMemo(() => {
    const okunmamis = STORIES.filter((s) => !readIds.includes(s.id));
    const havuz = okunmamis.length ? okunmamis : STORIES;
    const gun = Math.floor(Date.now() / 864e5);
    return havuz[gun % havuz.length];
  }, [STORIES, readIds]);
  const gemSay = Object.keys(gems).length;
  const KATEGORI_ALT = { derin: 'Duraklarla, adım adım', ahlak: 'Karakteri inceleten', sabir: 'Bekleyişin içindeki hikmet', hikmet: 'Bakışı değiştiren' };

  return (
    <div data-testid="kissa-liste" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0B2E23 0%, #061A13 60%, #04110C 100%)', color: KREM, paddingBottom: 130 }}>
      {/* Başlık */}
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 20px 8px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontFamily: '"Fraunces", serif', fontSize: 30, fontWeight: 800, letterSpacing: -0.3 }}>Kıssalar</h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'rgba(244,239,227,0.65)' }}>Bir kıssa, bir durak, bir hikmet</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Halka oran={readIds.length / Math.max(1, STORIES.length)} />
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 800 }}>{readIds.length}/{STORIES.length}</span>
        </div>
      </motion.header>

      {/* Bugünün kıssası */}
      {gunun && (
        <button type="button" data-testid="gunun-kissasi" onClick={() => openStory(gunun.id)}
          style={{ display: 'block', width: 'calc(100% - 32px)', margin: '8px 16px 0', padding: 0, border: `1px solid ${ALTIN}`, borderRadius: '90px 90px 24px 24px', overflow: 'hidden', background: '#0B241B', textAlign: 'start', cursor: 'pointer', position: 'relative' }}>
          <KissaKapak s={gunun} h={190} yuvarlak="0" />
          <span style={{ display: 'block', padding: '14px 18px 16px' }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.8, color: ALTIN }}>BUGÜNÜN KISSASI</span>
            <span style={{ display: 'block', fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 800, color: KREM, marginTop: 2 }}>{gunun.title}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, fontSize: 12.5, color: 'rgba(244,239,227,0.65)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {gunun.read} dk</span>
              <span>{gunun.deep ? `${(gunun.checkpoints || []).length} durak` : 'düşündüren son'}</span>
              <span style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: ALTIN, fontWeight: 800 }}><BookOpen size={14} /> Oku</span>
            </span>
          </span>
        </button>
      )}

      {/* Cevher ve Gece */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '14px 16px 0' }}>
        <div style={{ padding: '12px 14px', borderRadius: 18, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(216,183,106,0.2)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: 1.2, color: ALTIN, fontWeight: 800 }}><Gem size={13} /> CEVHERLER</span>
          <span style={{ display: 'block', fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 800 }}>{gemSay}<span style={{ fontSize: 13, color: 'rgba(244,239,227,0.5)' }}> / {Object.keys(STORY_GEMS).length}</span></span>
        </div>
        <button type="button" onClick={onNight} style={{ padding: '12px 14px', borderRadius: 18, background: 'linear-gradient(135deg, #0F0D2E, #1E1B4B)', border: '1px solid rgba(165,180,252,0.3)', color: '#E0E7FF', textAlign: 'start', cursor: 'pointer' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: 1.2, color: '#A5B4FC', fontWeight: 800 }}><Moon size={13} /> GECE MODU</span>
          <span style={{ display: 'block', fontSize: 13, marginTop: 4 }}>Sesli kıssa, ney, uyku</span>
        </button>
      </div>

      {/* Kategori yolu */}
      <div style={{ position: 'relative', margin: '22px 0 0' }}>
        <motion.span aria-hidden initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ position: 'absolute', left: 27, top: 10, bottom: 10, width: 2, background: `linear-gradient(${ALTIN}, rgba(216,183,106,0.1))`, transformOrigin: 'top' }} />
        {STORY_CATEGORIES.map((cat, ci) => {
          const items = STORIES.filter((s) => s.cat === cat.id);
          if (!items.length) return null;
          const okunan = items.filter((s) => readIds.includes(s.id)).length;
          return (
            <motion.section key={cat.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.15 + ci * 0.07 }} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px 10px 18px' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                  <rect x="4" y="4" width="12" height="12" fill="#0B2E23" stroke={ALTIN} strokeWidth="1.5" />
                  <rect x="4" y="4" width="12" height="12" fill="#0B2E23" stroke={ALTIN} strokeWidth="1.5" transform="rotate(45 10 10)" />
                  <circle cx="10" cy="10" r="2.5" fill={okunan === items.length ? ALTIN : 'rgba(216,183,106,0.35)'} />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: '"Fraunces", serif', fontSize: 18, fontWeight: 800 }}>{cat.title.replace(' · Katmanlı', '')}</div>
                  <div style={{ fontSize: 12, color: 'rgba(244,239,227,0.55)' }}>{KATEGORI_ALT[cat.id] || ''} · {okunan}/{items.length}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px 4px 50px', scrollbarWidth: 'none' }}>
                {items.map((s, i) => {
                  const okundu = readIds.includes(s.id);
                  return (
                    <motion.button key={s.id} type="button" data-testid={`kissa-${s.id}`} onClick={() => openStory(s.id)}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.25 + ci * 0.07 + i * 0.04 }}
                      whileTap={{ scale: 0.96 }}
                      style={{ flexShrink: 0, width: 150, padding: 0, borderRadius: '75px 75px 18px 18px', overflow: 'hidden', border: `1px solid ${okundu ? ALTIN : 'rgba(255,255,255,0.12)'}`, background: 'rgba(255,255,255,0.04)', textAlign: 'start', cursor: 'pointer', position: 'relative' }}>
                      <KissaKapak s={s} h={150} yuvarlak="75px 75px 0 0" />
                      {okundu && (
                        <span aria-label="Okundu" style={{ position: 'absolute', top: 58, right: 8, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden><rect x="6" y="6" width="14" height="14" fill={ALTIN} /><rect x="6" y="6" width="14" height="14" fill={ALTIN} transform="rotate(45 13 13)" /><path d="M9 13 l3 3 l5 -6" stroke="#1A1A1A" strokeWidth="2" fill="none" /></svg>
                        </span>
                      )}
                      {gems[s.id] && STORY_GEMS[s.id] && <span style={{ position: 'absolute', top: 60, left: 10, fontSize: 14 }} aria-hidden>{STORY_GEMS[s.id].emoji}</span>}
                      <span style={{ display: 'block', padding: '10px 12px 12px' }}>
                        <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: KREM, lineHeight: 1.25 }}>{s.title}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'rgba(244,239,227,0.55)', marginTop: 4 }}>
                          <Clock size={11} /> {s.read} dk {s.deep && <span style={{ color: '#A5B4FC' }}>· {(s.checkpoints || []).length} durak</span>}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
                <span style={{ flexShrink: 0, width: 4 }} />
              </div>
            </motion.section>
          );
        })}
      </div>
      <p style={{ margin: '0 20px', fontSize: 11.5, color: 'rgba(244,239,227,0.45)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <ChevronRight size={12} /> Kartları yana kaydır
      </p>
    </div>
  );
}
