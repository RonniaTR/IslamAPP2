import React from 'react';
import { KITAP, MECMUA, FONT, SAYFA } from './tema';
import { APP_NAME } from '../../config/brand';
import { useAyet } from './meal';

// 📕 ÖZEL SAYFALAR — kapak, dua, içindekiler, bâb açılışı, arka kapak. Hepsi tek sayfaya sığacak şekilde tasarlandı.

const ARAYUZ = { fontFamily: FONT.arayuz };
const SIRA = ['BİRİNCİ', 'İKİNCİ', 'ÜÇÜNCÜ', 'DÖRDÜNCÜ', 'BEŞİNCİ', 'ALTINCI', 'YEDİNCİ', 'SEKİZİNCİ', 'DOKUZUNCU', 'ONUNCU'];

/** Sekiz köşeli yıldız (iki kare) — kitabın imzası. */
export function Yildiz8({ r = 40, renk = KITAP.altin, dolgu = 'none', kalinlik = 1.4, ic = true }) {
  const kare = (aci) => [0, 1, 2, 3].map((i) => {
    const a = ((aci + 45 + i * 90) * Math.PI) / 180;
    return `${r + Math.cos(a) * r},${r + Math.sin(a) * r}`;
  }).join(' ');
  return (
    <svg width={r * 2} height={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`} aria-hidden>
      <polygon points={kare(0)} fill={dolgu} stroke={renk} strokeWidth={kalinlik} />
      <polygon points={kare(45)} fill={dolgu} stroke={renk} strokeWidth={kalinlik} />
      {ic && <circle cx={r} cy={r} r={r * 0.34} fill="none" stroke={renk} strokeWidth={kalinlik * 0.8} />}
      {ic && <circle cx={r} cy={r} r={r * 0.12} fill={renk} />}
    </svg>
  );
}

const tam = { position: 'absolute', inset: 0 };

function Deri({ children, renk = KITAP.zumrut }) {
  return (
    <div style={{ ...tam, background: `radial-gradient(120% 80% at 30% 20%, ${renk} 0%, #0A3328 60%, #072219 100%)`, overflow: 'hidden' }}>
      <div aria-hidden style={{ ...tam, opacity: 0.18, backgroundImage: 'radial-gradient(rgba(255,255,255,.35) 0.6px, transparent 0.8px)', backgroundSize: '5px 5px' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 18, border: `1.5px solid ${KITAP.altinAcik}AA`, borderRadius: 4 }} />
      <div aria-hidden style={{ position: 'absolute', inset: 24, border: `0.8px solid ${KITAP.altinAcik}66`, borderRadius: 3 }} />
      {children}
    </div>
  );
}

function KitapKapak({ kitap }) {
  return (
    <Deri>
      <div style={{ ...tam, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 48, color: KITAP.altinAcik }}>
        <div style={{ ...ARAYUZ, fontSize: 11, letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.85 }}>{APP_NAME} Kitaplığı</div>
        <div style={{ margin: '34px 0 26px', filter: 'drop-shadow(0 0 18px rgba(217,190,126,.35))' }}><Yildiz8 r={58} renk={KITAP.altinAcik} kalinlik={1.6} /></div>
        <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 44, lineHeight: '48px', letterSpacing: '-0.01em', color: '#E9D29C' }}>{kitap.baslik}</div>
        <div style={{ width: 90, height: 1, background: `${KITAP.altinAcik}99`, margin: '18px 0 14px' }} />
        <div style={{ fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 16, lineHeight: '22px', color: '#E8DDBF' }}>{kitap.alt}</div>
        <div style={{ ...ARAYUZ, position: 'absolute', bottom: 46, left: 0, right: 0, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', opacity: 0.7 }}>Âyet · Hadis · Asr-ı Saadet</div>
      </div>
    </Deri>
  );
}

function KitapArka({ kitap }) {
  return (
    <Deri>
      <div style={{ ...tam, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 56, color: '#E8DDBF' }}>
        <Yildiz8 r={22} renk={KITAP.altinAcik} />
        <p style={{ margin: '22px 0 0', fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 16, lineHeight: '25px' }}>{kitap.arkaSoz}</p>
        <div style={{ ...ARAYUZ, marginTop: 28, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: KITAP.altinAcik, opacity: 0.8 }}>{APP_NAME}</div>
      </div>
    </Deri>
  );
}

function DuaSayfasi({ kitap }) {
  const d = kitap.acilisDuasi;
  return (
    <div style={{ ...tam, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 44px' }}>
      <Yildiz8 r={20} renk={KITAP.altin} />
      <div style={{ ...ARAYUZ, marginTop: 18, fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: KITAP.altin, fontWeight: 700 }}>Okumaya başlarken</div>
      <div style={{ marginTop: 26, fontFamily: FONT.baslik, fontStyle: 'italic', fontWeight: 600, fontSize: 19, lineHeight: '26px', color: KITAP.soluk }}>{d.besmele}</div>
      <div style={{ marginTop: 22, fontFamily: FONT.baslik, fontStyle: 'italic', fontWeight: 800, fontSize: 34, lineHeight: '40px', color: KITAP.zumrut }}>{d.tr}</div>
      <div style={{ marginTop: 10, fontFamily: FONT.govde, fontSize: 17, lineHeight: '24px', color: KITAP.murekkep }}>“{d.anlam}”</div>
      <div style={{ ...ARAYUZ, marginTop: 8, fontSize: 11, fontWeight: 700, color: KITAP.soluk }}>{d.kaynak}</div>
      <div style={{ width: 70, height: 1, background: KITAP.altinAcik, margin: '28px 0 22px' }} />
      <p style={{ margin: 0, fontFamily: FONT.govde, fontSize: 14, lineHeight: '22px', color: KITAP.soluk }}>{d.not}</p>
    </div>
  );
}

function Icindekiler({ kitap, dizgi, onGit, mecmua }) {
  const renk = mecmua ? MECMUA.murekkep : KITAP.zumrut;
  return (
    <div style={{ ...tam, padding: `${SAYFA.pad + 14}px ${SAYFA.pad}px` }}>
      <div style={{ ...ARAYUZ, fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: mecmua ? MECMUA.isik : KITAP.altin, fontWeight: 800 }}>{mecmua ? 'Bu sayıda' : 'İçindekiler'}</div>
      <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 28, lineHeight: '34px', color: renk, margin: '6px 0 18px' }}>{mecmua ? kitap.alt : 'Sekiz bâb'}</div>
      {kitap.bolumler.map((b) => {
        const s = dizgi.bolumSayfa[b.id];
        return (
          <button
            key={b.id}
            type="button"
            data-etkin
            onClick={() => onGit(s)}
            style={{ display: 'flex', alignItems: 'baseline', width: '100%', gap: 8, background: 'none', border: 0, padding: '0 0 9px', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ ...ARAYUZ, flex: '0 0 24px', fontSize: 10.5, fontWeight: 800, color: b.renk }}>{b.no || '·'}</span>
            <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontFamily: FONT.baslik, fontWeight: 600, fontSize: 15, lineHeight: '19px', color: KITAP.murekkep }}>{b.baslik}</span>
              {b.kisa && <span style={{ ...ARAYUZ, fontSize: 10.5, lineHeight: '14px', color: KITAP.soluk }}>{b.kisa}</span>}
            </span>
            <span aria-hidden style={{ flex: 1, borderBottom: `1px dotted ${KITAP.kenar}`, transform: 'translateY(-4px)' }} />
            <span style={{ ...ARAYUZ, fontSize: 12, fontWeight: 700, color: KITAP.soluk }}>{s + 1}</span>
          </button>
        );
      })}
    </div>
  );
}

function BabAcilis({ kitap, bol, bi }) {
  const sira = bol.no ? SIRA[bol.no - 1] : null;
  return (
    <div style={{ ...tam, padding: `${SAYFA.pad + 40}px ${SAYFA.pad + 6}px ${SAYFA.pad + 10}px`, display: 'flex', flexDirection: 'column' }}>
      <div aria-hidden style={{ position: 'absolute', right: -60, top: 70, opacity: 0.09 }}><Yildiz8 r={150} renk={bol.renk} kalinlik={3} /></div>
      <div style={{ ...ARAYUZ, fontSize: 11, letterSpacing: '0.3em', fontWeight: 800, color: bol.renk }}>{sira ? `${sira} BÂB` : (bol.etiket || 'BAŞLARKEN')}</div>
      {bol.no && <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 110, lineHeight: '104px', color: `${bol.renk}`, opacity: 0.9, marginTop: 10 }}>{bol.no}</div>}
      <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 38, lineHeight: '42px', color: KITAP.murekkep, marginTop: bol.no ? 6 : 40, letterSpacing: '-0.01em' }}>{bol.baslik}</div>
      {bol.alt && <div style={{ fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 17, lineHeight: '24px', color: KITAP.soluk, marginTop: 8 }}>{bol.alt}</div>}
      <div style={{ flex: 1 }} />
      {bol.epigraf && (
        <div style={{ borderTop: `1px solid ${bol.renk}55`, paddingTop: 14 }}>
          <p style={{ margin: 0, fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 15, lineHeight: '23px', color: KITAP.murekkep }}>“{bol.epigraf.x}”</p>
          <div style={{ ...ARAYUZ, marginTop: 6, fontSize: 11, fontWeight: 700, color: bol.renk }}>{bol.epigraf.k}</div>
        </div>
      )}
      <div aria-hidden style={{ ...ARAYUZ, position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center', fontSize: 9.5, letterSpacing: '0.2em', color: KITAP.soluk, opacity: bi >= 0 ? 0.6 : 0 }}>❖</div>
    </div>
  );
}

/* ——— MECMUA ——— */

function MecmuaKapak({ kitap }) {
  return (
    <div style={{ ...tam, background: '#F6F1E6', overflow: 'hidden' }}>
      <svg aria-hidden viewBox="0 0 400 640" width="400" height="640" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="mk-gunes" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#FFE3A0" /><stop offset="1" stopColor="#E3A62F" /></radialGradient>
        </defs>
        <rect x="0" y="300" width="400" height="340" fill="#14233A" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI;
          return <line key={i} x1="200" y1="330" x2={200 + Math.cos(a + Math.PI) * 420} y2={330 + Math.sin(a + Math.PI) * 420} stroke="#E3A62F" strokeOpacity={i % 2 ? 0.18 : 0.32} strokeWidth={i % 2 ? 1 : 2} />;
        })}
        <circle cx="200" cy="330" r="92" fill="url(#mk-gunes)" />
        <circle cx="200" cy="330" r="128" fill="none" stroke="#E3A62F" strokeOpacity="0.55" strokeDasharray="2 5" />
        <circle cx="200" cy="330" r="168" fill="none" stroke="#2D5DA8" strokeOpacity="0.45" />
        <path d="M60 330 A140 140 0 0 1 340 330" fill="none" stroke="#14233A" strokeWidth="2" />
        <line x1="200" y1="238" x2="292" y2="306" stroke="#14233A" strokeWidth="2" />
        <text x="236" y="282" fontSize="14" fontFamily="Fraunces, serif" fontWeight="800" fill="#14233A">α</text>
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 97) % 400} cy={440 + ((i * 53) % 190)} r={(i % 3) * 0.5 + 0.6} fill="#fff" opacity={0.5 + (i % 4) * 0.1} />)}
      </svg>
      <div style={{ position: 'absolute', top: 26, left: 24, right: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...ARAYUZ, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: MECMUA.murekkep, fontWeight: 800 }}>
          <span>{kitap.sayi}</span><span>{APP_NAME}</span>
        </div>
        <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 76, lineHeight: '70px', letterSpacing: '-0.04em', color: MECMUA.murekkep, marginTop: 8 }}>Hikmet</div>
        <div style={{ ...ARAYUZ, fontSize: 13, letterSpacing: '0.62em', textTransform: 'uppercase', color: MECMUA.isik, fontWeight: 800, marginTop: 2 }}>Mecmuası</div>
      </div>
      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 26, color: '#fff' }}>
        <div style={{ ...ARAYUZ, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFD27A', fontWeight: 800 }}>Bu sayının konusu</div>
        <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 36, lineHeight: '38px', marginTop: 4 }}>{kitap.konu}</div>
        <div style={{ marginTop: 12, display: 'grid', gap: 5 }}>
          {kitap.kapakSatirlari.map(([renk, s]) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, ...ARAYUZ, fontSize: 12.5, lineHeight: '16px', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: renk, flex: '0 0 8px' }} />{s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MakaleAcilis({ bol }) {
  return (
    <div style={{ ...tam, background: MECMUA.kagit, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 330, background: `linear-gradient(160deg, ${bol.renk}, ${bol.renk}CC 60%, ${bol.renk}99)` }}>
        <div aria-hidden style={{ position: 'absolute', right: -70, top: -50, opacity: 0.22 }}><Yildiz8 r={170} renk="#fff" kalinlik={2.2} /></div>
        {bol.buyuk && (
          <div style={{ position: 'absolute', left: 28, bottom: 26, color: '#fff' }}>
            <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: bol.buyuk.x.length > 6 ? 50 : 66, lineHeight: bol.buyuk.x.length > 6 ? '54px' : '64px', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>{bol.buyuk.x}</div>
            <div style={{ ...ARAYUZ, fontSize: 12, fontWeight: 600, opacity: 0.9, marginTop: 4, maxWidth: 300 }}>{bol.buyuk.alt}</div>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 28, right: 28, top: 352 }}>
        <div style={{ ...ARAYUZ, fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 800, color: bol.renk }}>{bol.kicker}</div>
        <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 33, lineHeight: '37px', letterSpacing: '-0.015em', color: MECMUA.murekkep, marginTop: 6 }}>{bol.baslik}</div>
        {bol.alt && <div style={{ fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 15.5, lineHeight: '23px', color: MECMUA.soluk, marginTop: 10 }}>{bol.alt}</div>}
      </div>
    </div>
  );
}

function MecmuaArka({ kitap }) {
  return (
    <div style={{ ...tam, background: '#14233A', color: '#fff', padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ ...ARAYUZ, fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#FFD27A', fontWeight: 800 }}>Gelecek sayı</div>
      <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 40, lineHeight: '44px', marginTop: 8 }}>{kitap.gelecek.baslik}</div>
      <p style={{ fontFamily: FONT.govde, fontSize: 15, lineHeight: '24px', opacity: 0.9, margin: '14px 0 0' }}>{kitap.gelecek.x}</p>
      <div style={{ marginTop: 30, opacity: 0.5 }}><Yildiz8 r={18} renk="#FFD27A" /></div>
    </div>
  );
}

/** Basılı nüshada boş sayfanın yerine: künye. */
function Kunye({ kitap }) {
  const { etiket, surum } = useAyet(20, 114);
  const tarih = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const satir = { margin: '0 0 9px', fontFamily: FONT.arayuz, fontSize: 10.5, lineHeight: '16px', color: KITAP.soluk };
  return (
    <div style={{ ...tam, padding: '0 44px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 16, color: KITAP.murekkep, marginBottom: 4 }}>{kitap.baslik}</div>
      <p style={satir}>{kitap.alt}{kitap.sayi ? ` · ${kitap.sayi}` : ''}</p>
      <p style={satir}><b>Baskı provası</b> · {tarih}</p>
      <p style={satir}>Âyet mealleri: {(etiket || '').replace(/^Meal: /, '')}{surum ? ` (sürüm ${surum})` : ''}. Metin değiştirilmeden alınmıştır.</p>
      <p style={satir}>Hadis numaraları sunnah.com sistemine göredir.</p>
      <p style={satir}>Bu nüsha inceleme içindir. Diyanet İşleri Başkanlığı'nın ilgili kurulunun incelemesinden önce çoğaltılıp dağıtılmaz.</p>
      <p style={{ ...satir, marginTop: 8 }}>© {new Date().getFullYear()} {APP_NAME}</p>
    </div>
  );
}

function Bos() {
  return <div style={{ ...tam, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.25 }}><Yildiz8 r={16} renk={KITAP.altin} /></div>;
}

/** Tipine göre özel sayfa. null dönerse sayfa içerik sayfasıdır. */
export function OzelSayfa({ s, kitap, dizgi, onGit, baski }) {
  const mecmua = kitap.tema === 'mecmua';
  switch (s.tip) {
    case 'kapak': return mecmua ? <MecmuaKapak kitap={kitap} /> : <KitapKapak kitap={kitap} />;
    case 'arka': return mecmua ? <MecmuaArka kitap={kitap} /> : <KitapArka kitap={kitap} />;
    case 'dua': return <DuaSayfasi kitap={kitap} />;
    case 'icindekiler': return <Icindekiler kitap={kitap} dizgi={dizgi} onGit={onGit} mecmua={mecmua} />;
    case 'acilis': return mecmua ? <MakaleAcilis bol={kitap.bolumler[s.bi]} /> : <BabAcilis kitap={kitap} bol={kitap.bolumler[s.bi]} bi={s.bi} />;
    case 'bos': return baski ? <Kunye kitap={kitap} /> : <Bos />;
    default: return null;
  }
}

export const KAPAK_TIPLERI = new Set(['kapak', 'arka']);
