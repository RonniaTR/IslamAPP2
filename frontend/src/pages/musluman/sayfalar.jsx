import React, { useState } from 'react';
import { KITAP, MECMUA, FONT, SAYFA } from './tema';
import { useAyet, MEAL_KISA } from './meal';
import { INFOGRAFIK } from './infografik';

// 📄 SAYFA BLOKLARI — kitabın ve mecmuanın yapı taşları.
// Önemli: Dizgi (sayfalara bölme) bu bileşenlerin GERÇEK yüksekliğini ölçerek yapılır. Bu yüzden her bloğun
// yüksekliği yalnız içeriğine bağlıdır; tıklama, işaretleme gibi etkileşimler yüksekliği DEĞİŞTİRMEZ.

export const GENISLIK = SAYFA.w - SAYFA.pad * 2;           // 340
export const BASLIK_Y = 26;                                 // üst bilgi şeridi
export const ALT_Y = 26;                                    // sayfa numarası şeridi
export const ICERIK_Y = SAYFA.h - SAYFA.pad * 2 - BASLIK_Y - ALT_Y; // 528
export const ARALIK = 12;                                   // bloklar arası boşluk

export const SURE_ADI = {
  2: 'Bakara', 3: 'Âl-i İmrân', 4: 'Nisâ', 7: "A'râf", 13: "Ra'd", 16: 'Nahl', 17: 'İsrâ', 20: 'Tâhâ',
  30: 'Rûm', 35: 'Fâtır', 39: 'Zümer', 49: 'Hucurât', 55: 'Rahmân', 83: 'Mutaffifîn', 88: 'Ğâşiye', 94: 'İnşirâh', 96: 'Alak',
};
export const ayetEtiketi = (s, a) => `${SURE_ADI[s] || `Sure ${s}`} ${s}:${Array.isArray(a) ? `${a[0]}-${a[1]}` : a}`;

const ARAYUZ = { fontFamily: FONT.arayuz };

/** Paragraf stili: hem ekranda hem ölçümde aynı nesne kullanılır (birim px, sabit satır yüksekliği). */
export function paragrafStili(tema) {
  const mecmua = tema === 'mecmua';
  return {
    fontFamily: FONT.govde,
    fontSize: mecmua ? '13.5px' : '14.5px',
    lineHeight: mecmua ? '21px' : '22px',
    color: mecmua ? MECMUA.murekkep : KITAP.murekkep,
    textAlign: 'justify',
    hyphens: 'auto',
    WebkitHyphens: 'auto',
    margin: '0',
    wordSpacing: '0.2px',
  };
}

/** "*vurgu*" işaretli metni kelime parçalarına ayırır: [{w, em}] */
export function parcala(metin) {
  const out = [];
  let em = false;
  metin.split(/\s+/).filter(Boolean).forEach((ham) => {
    let w = ham;
    let ac = false;
    let kapa = false;
    if (w.startsWith('*')) { ac = true; w = w.slice(1); }
    if (w.endsWith('*') || /\*[.,;:!?…)»"']*$/.test(w)) { kapa = true; w = w.replace(/\*(?=[.,;:!?…)»"']*$)/, ''); }
    if (ac) em = true;
    out.push({ w, em });
    if (kapa) em = false;
  });
  return out;
}

const kacis = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Ölçüm için HTML: React'in çizdiğiyle birebir aynı yapı. */
export function parcaHtml(tokens, renk) {
  let html = '';
  let i = 0;
  while (i < tokens.length) {
    const em = tokens[i].em;
    const grup = [];
    while (i < tokens.length && tokens[i].em === em) { grup.push(tokens[i].w); i += 1; }
    const metin = kacis(grup.join(' '));
    html += em ? `<em style="font-style:italic;color:${renk}">${metin}</em>` : metin;
    if (i < tokens.length) html += ' ';
  }
  return html;
}

function Parca({ tokens, renk }) {
  const out = [];
  let i = 0;
  while (i < tokens.length) {
    const em = tokens[i].em;
    const grup = [];
    while (i < tokens.length && tokens[i].em === em) { grup.push(tokens[i].w); i += 1; }
    const metin = grup.join(' ');
    out.push(em ? <em key={i} style={{ fontStyle: 'italic', color: renk }}>{metin}</em> : <React.Fragment key={i}>{metin}</React.Fragment>);
    if (i < tokens.length) out.push(' ');
  }
  return out;
}

/** Paragraf (bölünebilir): `dilim` verilirse yalnız o kelime aralığı çizilir. */
export function Paragraf({ b, tema, renk, dilim }) {
  const tokens = b._tokens || parcala(b.x);
  const parca = dilim ? tokens.slice(dilim[0], dilim[1]) : tokens;
  const devam = dilim && dilim[0] > 0;
  const yarim = dilim && dilim[1] < tokens.length;
  return (
    <p
      lang="tr"
      style={{
        ...paragrafStili(tema),
        textIndent: devam || b.ilk ? 0 : '1.1em',
        textAlignLast: yarim ? 'justify' : 'auto',
      }}
    >
      <Parca tokens={parca} renk={renk} />
    </p>
  );
}

function Baslik({ b, tema, renk }) {
  const mecmua = tema === 'mecmua';
  return (
    <h3 style={{ margin: 0, paddingTop: 4, fontFamily: FONT.baslik, fontWeight: mecmua ? 800 : 600, fontSize: mecmua ? 17 : 17.5, lineHeight: '23px', color: renk, letterSpacing: mecmua ? '-0.01em' : 0 }}>
      {b.x}
    </h3>
  );
}

function Ayet({ b, tema }) {
  const { satirlar, yok, surum, etiket } = useAyet(b.s, b.a);
  const renk = tema === 'mecmua' ? MECMUA.yer : KITAP.zumrut;
  return (
    <div style={{ background: 'linear-gradient(180deg, rgba(15,74,58,0.07), rgba(15,74,58,0.03))', borderLeft: `3px solid ${renk}`, borderRadius: '2px 10px 10px 2px', padding: '10px 12px 9px 13px' }}>
      <div style={{ ...ARAYUZ, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: renk, fontWeight: 700, marginBottom: 6 }}>
        <span>✦ Âyet meali</span>
        <span style={{ letterSpacing: '0.02em', textTransform: 'none', fontWeight: 700 }}>{ayetEtiketi(b.s, b.a)}</span>
      </div>
      {satirlar && satirlar.map((s) => (
        <p key={s.n} lang="tr" style={{ margin: '0 0 4px', fontFamily: FONT.govde, fontSize: 13.5, lineHeight: '21px', color: KITAP.murekkep }}>
          {satirlar.length > 1 && <sup style={{ ...ARAYUZ, fontSize: 9, color: renk, fontWeight: 700, marginRight: 3 }}>{s.n}</sup>}
          {s.text}
        </p>
      ))}
      {yok && (
        <p style={{ margin: '0 0 4px', ...ARAYUZ, fontSize: 12, lineHeight: '18px', color: KITAP.soluk }}>
          Bu âyetin meali, Türkçe meal paketi cihaza indirildiğinde burada görünür (Ayarlar › Çevrimdışı Paketler).
        </p>
      )}
      {!yok && (
        <div style={{ ...ARAYUZ, fontSize: 9, lineHeight: '12px', color: KITAP.soluk, marginTop: 2 }}>
          {etiket || MEAL_KISA}{surum ? ` · sürüm ${surum}` : ''} · metin değiştirilmeden
        </div>
      )}
    </div>
  );
}

function Hadis({ b, tema }) {
  const altin = tema === 'mecmua' ? MECMUA.tarih : KITAP.altin;
  return (
    <figure style={{ margin: 0, position: 'relative', background: '#F3E9D2', borderRadius: 10, padding: '12px 14px 10px 16px', boxShadow: `inset 0 0 0 1px ${altin}40` }}>
      <div aria-hidden style={{ position: 'absolute', top: -4, left: 8, fontFamily: FONT.baslik, fontSize: 40, lineHeight: '40px', color: `${altin}66` }}>“</div>
      <div style={{ ...ARAYUZ, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: altin, fontWeight: 700, marginBottom: 5, paddingLeft: 14 }}>
        Hadis-i şerif{b.r ? <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 600, color: KITAP.soluk }}> · {b.r}</span> : null}
      </div>
      <blockquote lang="tr" style={{ margin: 0, fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 14, lineHeight: '21px', color: KITAP.murekkep }}>{b.x}</blockquote>
      <figcaption style={{ ...ARAYUZ, marginTop: 6, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 10.5, color: KITAP.soluk }}>
        {b.d && <span style={{ background: `${KITAP.zumrut}18`, color: KITAP.zumrut, borderRadius: 999, padding: '1px 7px', fontWeight: 700, fontSize: 9.5 }}>{b.d}</span>}
        <span style={{ fontWeight: 700 }}>{b.k}</span>
      </figcaption>
    </figure>
  );
}

function Sahne({ b }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #FBF3DE, #F1E2C2)', borderRadius: 12, padding: '11px 14px 10px', border: `1px solid ${KITAP.altinAcik}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
        <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden><path d="M1 17V8a7 7 0 0114 0v9" fill="none" stroke={KITAP.altin} strokeWidth="1.6" /><path d="M8 4v3" stroke={KITAP.altin} strokeWidth="1.4" /></svg>
        <span style={{ ...ARAYUZ, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: KITAP.altin, fontWeight: 700 }}>Asr-ı Saadet'ten</span>
      </div>
      <div style={{ fontFamily: FONT.baslik, fontWeight: 600, fontSize: 15.5, lineHeight: '20px', color: KITAP.murekkep, marginBottom: 4 }}>{b.baslik}</div>
      <p lang="tr" style={{ margin: 0, fontFamily: FONT.govde, fontSize: 13.5, lineHeight: '21px', color: KITAP.murekkep, textAlign: 'justify', hyphens: 'auto' }}>{b.x}</p>
      <div style={{ ...ARAYUZ, textAlign: 'right', fontSize: 10.5, color: KITAP.soluk, fontWeight: 700, marginTop: 5 }}>{b.k}</div>
    </div>
  );
}

function Info({ b }) {
  const C = INFOGRAFIK[b.id];
  if (!C) return null;
  return (
    <figure style={{ margin: 0 }}>
      {b.baslik && <figcaption style={{ ...ARAYUZ, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: KITAP.soluk, fontWeight: 700, marginBottom: 6 }}>{b.baslik}</figcaption>}
      <C />
    </figure>
  );
}

function Liste({ b, renk, tema }) {
  return (
    <div>
      {b.baslik && <div style={{ ...ARAYUZ, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: renk, fontWeight: 700, marginBottom: 6 }}>{b.baslik}</div>}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {b.x.map((m) => (
          <li key={m} lang="tr" style={{ display: 'flex', gap: 9, marginBottom: 5, fontFamily: FONT.govde, fontSize: tema === 'mecmua' ? 13 : 13.5, lineHeight: '20px', color: KITAP.murekkep }}>
            <span aria-hidden style={{ flex: '0 0 7px', width: 7, height: 7, marginTop: 7, transform: 'rotate(45deg)', background: renk, borderRadius: 1 }} />
            <span><Parca tokens={parcala(m)} renk={renk} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const bugun = () => new Date().toISOString().slice(0, 10);

function Amel({ b, renk }) {
  const anahtar = `mo:amel:${b.id}:${bugun()}`;
  const [isaret, setIsaret] = useState(() => {
    try { return JSON.parse(localStorage.getItem(anahtar) || '[]'); } catch { return []; }
  });
  const degistir = (i) => {
    const yeni = isaret.includes(i) ? isaret.filter((x) => x !== i) : [...isaret, i];
    setIsaret(yeni);
    try { localStorage.setItem(anahtar, JSON.stringify(yeni)); } catch { /* kota */ }
  };
  return (
    <div style={{ borderRadius: 12, border: `1.5px solid ${renk}55`, background: `${renk}0D`, padding: '10px 12px 6px' }}>
      <div style={{ ...ARAYUZ, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: renk, fontWeight: 800, marginBottom: 7 }}>
        <span>Bugün sen</span>
        <span style={{ letterSpacing: 0, fontWeight: 700 }}>{isaret.length}/{b.x.length}</span>
      </div>
      {b.x.map((m, i) => {
        const on = isaret.includes(i);
        return (
          <button
            key={m}
            type="button"
            data-etkin
            onClick={() => degistir(i)}
            aria-pressed={on}
            style={{ display: 'flex', gap: 9, alignItems: 'flex-start', width: '100%', textAlign: 'left', background: 'none', border: 0, padding: '0 0 6px', cursor: 'pointer' }}
          >
            <span aria-hidden style={{ flex: '0 0 17px', height: 17, marginTop: 1, borderRadius: 5, border: `1.5px solid ${renk}`, background: on ? renk : 'transparent', color: '#fff', fontSize: 12, lineHeight: '15px', textAlign: 'center', fontWeight: 800, transition: 'background .2s' }}>{on ? '✓' : ''}</span>
            <span lang="tr" style={{ fontFamily: FONT.govde, fontSize: 13, lineHeight: '19px', color: on ? KITAP.soluk : KITAP.murekkep, textDecoration: on ? 'line-through' : 'none', textDecorationColor: `${renk}88` }}>{m}</span>
          </button>
        );
      })}
    </div>
  );
}

function Dusun({ b, renk }) {
  return (
    <div style={{ borderRadius: 12, border: `1.5px dashed ${renk}88`, padding: '10px 13px', display: 'flex', gap: 10 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden style={{ flex: '0 0 20px', marginTop: 1 }}><circle cx="12" cy="10" r="7" fill="none" stroke={renk} strokeWidth="1.6" /><path d="M9 21h6M10 18h4" stroke={renk} strokeWidth="1.6" strokeLinecap="round" /></svg>
      <div>
        <div style={{ ...ARAYUZ, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: renk, fontWeight: 800, marginBottom: 3 }}>Düşün</div>
        <p lang="tr" style={{ margin: 0, fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 13.5, lineHeight: '20px', color: KITAP.murekkep }}>{b.x}</p>
      </div>
    </div>
  );
}

function DuaMeal({ s, a }) {
  const { satirlar, yok, surum, etiket } = useAyet(s, a);
  if (yok) return <p style={{ margin: '6px 0 0', ...ARAYUZ, fontSize: 11.5, color: KITAP.soluk }}>Meal paketi indirildiğinde anlamı burada görünür.</p>;
  if (!satirlar) return null;
  return (
    <>
      <p lang="tr" style={{ margin: '8px 0 0', fontFamily: FONT.govde, fontSize: 13.5, lineHeight: '21px', color: KITAP.murekkep }}>{satirlar.map((x) => x.text).join(' ')}</p>
      <div style={{ ...ARAYUZ, fontSize: 9, color: KITAP.soluk, marginTop: 3 }}>{etiket || MEAL_KISA}{surum ? ` · sürüm ${surum}` : ''}</div>
    </>
  );
}

function Dua({ b }) {
  return (
    <div style={{ textAlign: 'center', padding: '12px 8px', borderTop: `1px solid ${KITAP.altinAcik}`, borderBottom: `1px solid ${KITAP.altinAcik}` }}>
      <div style={{ ...ARAYUZ, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: KITAP.altin, fontWeight: 700 }}>{b.baslik || 'Dua'}</div>
      <div lang="tr" style={{ marginTop: 6, fontFamily: FONT.baslik, fontStyle: 'italic', fontWeight: 600, fontSize: 17.5, lineHeight: '25px', color: KITAP.zumrut }}>{b.tr}</div>
      {b.x && <p lang="tr" style={{ margin: '6px 0 0', fontFamily: FONT.govde, fontSize: 13.5, lineHeight: '20px', color: KITAP.murekkep }}>{b.x}</p>}
      {b.s && <DuaMeal s={b.s} a={b.a} />}
      <div style={{ ...ARAYUZ, fontSize: 10.5, fontWeight: 700, color: KITAP.soluk, marginTop: 5 }}>{b.s ? ayetEtiketi(b.s, b.a) : b.k}</div>
    </div>
  );
}

function Not({ b }) {
  return (
    <div style={{ ...ARAYUZ, background: 'rgba(31,42,38,0.05)', borderRadius: 8, padding: '8px 11px', fontSize: 11.5, lineHeight: '17px', color: KITAP.soluk }}>
      {b.x}
    </div>
  );
}

function Yanlis({ b }) {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #E4C9BE' }}>
      <div style={{ background: '#FBEDE7', padding: '10px 13px 8px' }}>
        <div style={{ ...ARAYUZ, display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, color: KITAP.kiremit, marginBottom: 4 }}>
          <span>Hadis sanılan söz</span>
          <span style={{ letterSpacing: 0, background: KITAP.kiremit, color: '#fff', borderRadius: 999, padding: '1px 8px', fontSize: 9.5 }}>{b.hukum}</span>
        </div>
        <p lang="tr" style={{ margin: 0, fontFamily: FONT.govde, fontStyle: 'italic', fontSize: 14, lineHeight: '20px', color: KITAP.murekkep }}>“{b.soz}”</p>
        <p lang="tr" style={{ margin: '5px 0 0', ...ARAYUZ, fontSize: 11.5, lineHeight: '17px', color: KITAP.soluk }}>{b.aciklama}</p>
      </div>
      <div style={{ background: '#EAF3EE', padding: '8px 13px 9px' }}>
        <div style={{ ...ARAYUZ, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, color: KITAP.zumrut, marginBottom: 2 }}>Doğrusu</div>
        <p lang="tr" style={{ margin: 0, fontFamily: FONT.govde, fontSize: 13, lineHeight: '19px', color: KITAP.murekkep }}>{b.dogrusu}</p>
      </div>
    </div>
  );
}

function Kutu({ b, renk }) {
  return (
    <div style={{ borderRadius: 14, background: `${renk}14`, padding: '11px 13px 10px', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', right: -14, top: -14, width: 60, height: 60, borderRadius: '50%', background: `${renk}22` }} />
      <div style={{ ...ARAYUZ, display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, color: renk, marginBottom: 4 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><path d="M9 3h6M10 3v6L4.5 19A1.5 1.5 0 006 21h12a1.5 1.5 0 001.5-2L14 9V3" fill="none" stroke={renk} strokeWidth="2" strokeLinejoin="round" /></svg>
        {b.baslik || 'Sen de dene'}
      </div>
      <p lang="tr" style={{ margin: 0, fontFamily: FONT.govde, fontSize: 13, lineHeight: '20px', color: MECMUA.murekkep }}>{b.x}</p>
    </div>
  );
}

/** Kavram kartı: kelime, kök harfleri ve aynı kökten gelen kelimeler. */
function Kavram({ b, renk }) {
  const harfler = b.kok.split('-');
  return (
    <div style={{ position: 'relative', borderRadius: 14, padding: '12px 14px 11px 16px', background: `linear-gradient(135deg, ${renk}10, ${KITAP.kagit} 70%)`, boxShadow: `inset 0 0 0 1px ${renk}33` }}>
      <div aria-hidden style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 3, borderRadius: 3, background: renk }} />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ ...ARAYUZ, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 800, color: renk }}>Kavram</div>
          <div style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 25, lineHeight: '30px', color: KITAP.murekkep, letterSpacing: '-0.01em' }}>{b.kelime}</div>
        </div>
        <div aria-label={`Kök: ${b.kok}`} style={{ display: 'flex', gap: 4 }}>
          {harfler.map((h, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={i} style={{ width: 24, height: 24, borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: renk, color: '#fff', fontFamily: FONT.baslik, fontWeight: 800, fontSize: 13, textTransform: 'uppercase' }}>{h === "'" ? 'ʾ' : h}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, margin: '7px 0 7px' }}>
        {b.aile.map((a) => (
          <span key={a} style={{ ...ARAYUZ, fontSize: 11, lineHeight: '16px', fontWeight: 700, color: renk, background: `${renk}14`, borderRadius: 999, padding: '2px 9px' }}>{a}</span>
        ))}
      </div>
      <p lang="tr" style={{ margin: 0, fontFamily: FONT.govde, fontSize: 13.5, lineHeight: '20px', color: KITAP.murekkep }}>{b.x}</p>
    </div>
  );
}

function Buyuk({ b, renk }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, borderTop: `2px solid ${renk}`, paddingTop: 8 }}>
      <span style={{ fontFamily: FONT.baslik, fontWeight: 800, fontSize: 38, lineHeight: '42px', color: renk, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{b.x}</span>
      <span lang="tr" style={{ ...ARAYUZ, fontSize: 12, lineHeight: '17px', color: MECMUA.soluk }}>{b.alt}</span>
    </div>
  );
}

/** Bir bloğu tipine göre çizer. */
export function Blok({ b, tema, renk, dilim }) {
  switch (b.t) {
    case 'p': return <Paragraf b={b} tema={tema} renk={renk} dilim={dilim} />;
    case 'h': return <Baslik b={b} tema={tema} renk={renk} />;
    case 'ayet': return <Ayet b={b} tema={tema} />;
    case 'hadis': return <Hadis b={b} tema={tema} />;
    case 'sahne': return <Sahne b={b} />;
    case 'info': return <Info b={b} />;
    case 'liste': return <Liste b={b} renk={renk} tema={tema} />;
    case 'amel': return <Amel b={b} renk={renk} />;
    case 'dusun': return <Dusun b={b} renk={renk} />;
    case 'dua': return <Dua b={b} />;
    case 'not': return <Not b={b} />;
    case 'yanlis': return <Yanlis b={b} />;
    case 'kutu': return <Kutu b={b} renk={renk} />;
    case 'buyuk': return <Buyuk b={b} renk={renk} />;
    case 'kavram': return <Kavram b={b} renk={renk} />;
    default: return null;
  }
}

/** Sesli okuma için bloğun düz metni (âyet metni dışarıdan verilir). */
export function blokMetni(b, dilim, ayetMetni) {
  switch (b.t) {
    case 'p': {
      const t = (b._tokens || parcala(b.x));
      return (dilim ? t.slice(dilim[0], dilim[1]) : t).map((x) => x.w).join(' ');
    }
    case 'h': return `${b.x}.`;
    case 'ayet': return ayetMetni ? `${ayetEtiketi(b.s, b.a)}. ${ayetMetni}` : '';
    case 'hadis': return `Hadis-i şerif: ${b.x}`;
    case 'sahne': return `${b.baslik}. ${b.x}`;
    case 'liste': case 'amel': return b.x.map((m) => m.replace(/\*/g, '')).join('. ');
    case 'dusun': return `Düşün: ${b.x}`;
    case 'dua': return `${b.tr}. ${b.x || ''}`;
    case 'yanlis': return `Hadis sanılan söz: ${b.soz}. ${b.aciklama} Doğrusu: ${b.dogrusu}`;
    case 'kutu': return `${b.baslik || 'Sen de dene'}: ${b.x}`;
    case 'buyuk': return `${b.x}. ${b.alt}`;
    case 'kavram': return `Kavram: ${b.kelime}. ${b.x}`;
    default: return '';
  }
}
