import React from 'react';
import { KITAP, MECMUA, FONT, BOLUM_RENK } from './tema';

// 📊 İNFOGRAFİKLER — hepsi kodla çizilir (SVG), sayfa genişliği 340 birimdir.
// Kural: sayı ya da tarih içeren her çizimin altında kaynağı yazar; şematik olanlar "şematik" diye belirtilir.

const T = { fontFamily: FONT.arayuz };
const H = { fontFamily: FONT.baslik, fontWeight: 600 };

function Kaynak({ y, children, w = 340 }) {
  return <text x={w / 2} y={y} textAnchor="middle" fontSize="8.5" fill={KITAP.soluk} style={T}>{children}</text>;
}

/** 1) Hayat halkaları: kitabın sekiz bâbı, kalpten tabiata genişleyen halkalar. */
export function HayatHalkalari() {
  const halkalar = [
    ['guc', 'Güç'], ['tabiat', 'Tabiat'], ['ilim', 'İlim'], ['toplum', 'Toplum'], ['ev', 'Ev'], ['el', 'El'], ['dil', 'Dil'], ['kalp', 'Kalp'],
  ];
  const cx = 170, cy = 152;
  const r = (i) => 150 - i * 16.5;
  return (
    <svg viewBox="0 0 340 318" width="100%" role="img" aria-label="Hayat halkaları: kalpten güce sekiz bâb">
      {halkalar.map(([k], i) => (
        <circle key={k} cx={cx} cy={cy} r={r(i)} fill={BOLUM_RENK[k]} fillOpacity={i === halkalar.length - 1 ? 0.9 : 0.07 + i * 0.04} stroke={BOLUM_RENK[k]} strokeOpacity="0.6" strokeWidth="1.2" />
      ))}
      {halkalar.map(([k, ad], i) => {
        const son = i === halkalar.length - 1;
        return <text key={k} x={cx} y={son ? cy + 5 : cy - r(i) + 12} textAnchor="middle" fontSize={son ? 15 : 10} fill={son ? '#FFF8EC' : BOLUM_RENK[k]} style={{ ...T, fontWeight: 800 }}>{ad}</text>;
      })}
      <text x={cx} y={314} textAnchor="middle" fontSize="9.5" fill={KITAP.soluk} style={T}>İçeriden dışarıya: her halka bir öncekinin üzerine kurulur.</text>
    </svg>
  );
}

/** 2) Az ama devamlı: günde 5 dakika ne eder? (Basit çarpım; kaynak hadis Buhârî 6464.) */
export function AzAmaDevamli() {
  const veri = [
    { ad: '1 hafta', dk: 35 },
    { ad: '1 ay', dk: 150 },
    { ad: '1 yıl', dk: 1825 },
  ];
  const max = 1825, x0 = 70, w = 230;
  const yaz = (dk) => (dk < 60 ? `${dk} dk` : dk < 300 ? `${(dk / 60).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} saat` : `≈ ${Math.round(dk / 60)} saat`);
  return (
    <svg viewBox="0 0 340 170" width="100%" role="img" aria-label="Günde beş dakika: bir haftada 35 dakika, bir ayda 2,5 saat, bir yılda yaklaşık 30 saat">
      <text x="0" y="16" fontSize="12" fill={KITAP.murekkep} style={H}>Günde yalnız 5 dakika</text>
      {veri.map((v, i) => {
        const y = 34 + i * 40;
        const bw = Math.max(6, (v.dk / max) * w);
        return (
          <g key={v.ad}>
            <text x="0" y={y + 17} fontSize="11" fill={KITAP.soluk} style={T}>{v.ad}</text>
            <rect x={x0} y={y} width={w} height="26" rx="5" fill={KITAP.kagitKoyu} />
            <rect x={x0} y={y} width={bw} height="26" rx="5" fill={BOLUM_RENK.kalp} fillOpacity={0.35 + i * 0.25} />
            <text x={Math.min(x0 + bw + 6, 300)} y={y + 17} fontSize="11" fill={KITAP.murekkep} textAnchor={x0 + bw + 6 > 290 ? 'end' : 'start'} style={{ ...T, fontWeight: 700 }}>{yaz(v.dk)}</text>
          </g>
        );
      })}
      <Kaynak y={160}>5 dk × 7 = 35 dk · 5 dk × 30 = 150 dk · 5 dk × 365 = 1.825 dk</Kaynak>
    </svg>
  );
}

/** 3) Söz süzgeci: söylemeden önce üç soru, her birinin dayanağıyla. */
export function SozSuzgeci() {
  const s = [
    ['Doğru mu?', 'Haberi araştırın — Hucurât 49:6'],
    ['Hayır mı?', 'Ya hayır söylesin ya sussun — Buhârî 6018'],
    ['Güzel mi?', 'Sözün en güzelini söylesinler — İsrâ 17:53'],
  ];
  return (
    <svg viewBox="0 0 340 214" width="100%" role="img" aria-label="Söz süzgeci: doğru mu, hayır mı, güzel mi">
      {s.map(([soru, dayanak], i) => {
        const y = 8 + i * 58, inset = i * 22;
        return (
          <g key={soru}>
            <path d={`M${10 + inset} ${y} H${330 - inset} L${312 - inset} ${y + 46} H${28 + inset} Z`} fill={BOLUM_RENK.dil} fillOpacity={0.16 + i * 0.14} stroke={BOLUM_RENK.dil} strokeOpacity="0.5" />
            <text x="170" y={y + 20} textAnchor="middle" fontSize="13" fill={KITAP.murekkep} style={H}>{soru}</text>
            <text x="170" y={y + 36} textAnchor="middle" fontSize="9.5" fill={KITAP.soluk} style={T}>{dayanak}</text>
          </g>
        );
      })}
      <path d="M170 182 v14" stroke={BOLUM_RENK.dil} strokeWidth="2" markerEnd="url(#ok-dil)" />
      <defs><marker id="ok-dil" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 0 L5 10 z" fill={BOLUM_RENK.dil} /></marker></defs>
      <text x="170" y="211" textAnchor="middle" fontSize="11" fill={BOLUM_RENK.dil} style={{ ...T, fontWeight: 700 }}>Üçünden de geçen söz söylenir.</text>
    </svg>
  );
}

/** 4) Helal kazancın üç direği. */
export function UcDirek() {
  const d = [
    ['Emek', 'El emeği', 'Buhârî 2072'],
    ['Ölçü', 'Eksik tartmamak', 'Mutaffifîn 83:1-3'],
    ['Emanet', 'Hakkı sahibine', 'Nisâ 4:58'],
  ];
  return (
    <svg viewBox="0 0 340 200" width="100%" role="img" aria-label="Helal kazancın üç direği: emek, ölçü, emanet">
      <path d="M20 46 L170 8 L320 46 Z" fill={BOLUM_RENK.el} fillOpacity="0.25" stroke={BOLUM_RENK.el} />
      <text x="170" y="38" textAnchor="middle" fontSize="12" fill={KITAP.murekkep} style={H}>Helal kazanç</text>
      {d.map(([ad, alt, ref], i) => {
        const x = 40 + i * 100;
        return (
          <g key={ad}>
            <rect x={x} y="52" width="60" height="102" rx="4" fill={BOLUM_RENK.el} fillOpacity={0.14 + i * 0.06} stroke={BOLUM_RENK.el} strokeOpacity="0.6" />
            <text x={x + 30} y="96" textAnchor="middle" fontSize="12.5" fill={KITAP.murekkep} style={H}>{ad}</text>
            <text x={x + 30} y="172" textAnchor="middle" fontSize="9.5" fill={KITAP.murekkep} style={T}>{alt}</text>
            <text x={x + 30} y="186" textAnchor="middle" fontSize="8.5" fill={KITAP.soluk} style={T}>{ref}</text>
          </g>
        );
      })}
      <rect x="20" y="154" width="300" height="6" rx="2" fill={BOLUM_RENK.el} fillOpacity="0.5" />
    </svg>
  );
}

/** 5) Medine'de kardeşlik: Muhâcir ve Ensar eşleşmesi (şematik). */
export function KardeslikAgi() {
  const n = 6;
  return (
    <svg viewBox="0 0 340 198" width="100%" role="img" aria-label="Medine'de muhacir ve ensar kardeşliği, şematik">
      <text x="0" y="12" fontSize="10.5" fill={KITAP.soluk} style={T}>Mekke'den gelenler (Muhâcir)</text>
      <text x="0" y="160" fontSize="10.5" fill={KITAP.soluk} style={T}>Medineliler (Ensar)</text>
      {Array.from({ length: n }, (_, i) => {
        const x = 30 + i * 56;
        const ana = i === 2;
        return (
          <g key={i}>
            <path d={`M${x} 40 C${x} 76, ${x + (i % 2 ? -16 : 16)} 96, ${x} 128`} fill="none" stroke={BOLUM_RENK.toplum} strokeOpacity={ana ? 1 : 0.5} strokeWidth={ana ? 3 : 1.5} strokeDasharray={ana ? '0' : '3 3'} />
            <circle cx={x} cy="32" r={ana ? 12 : 10} fill={KITAP.kagit} stroke={BOLUM_RENK.toplum} strokeWidth={ana ? 2.6 : 1.6} />
            <circle cx={x} cy="136" r={ana ? 12 : 10} fill={BOLUM_RENK.toplum} fillOpacity={ana ? 1 : 0.7} />
          </g>
        );
      })}
      <rect x="0" y="168" width="340" height="28" rx="6" fill={BOLUM_RENK.toplum} fillOpacity="0.1" />
      <text x="170" y="180" textAnchor="middle" fontSize="9.5" fill={KITAP.murekkep} style={{ ...T, fontWeight: 700 }}>Kalın çizgi: Abdurrahman b. Avf – Sa'd b. Rebî (Buhârî 2049)</text>
      <text x="170" y="192" textAnchor="middle" fontSize="8.5" fill={KITAP.soluk} style={T}>Diğer eşleşmeler şematiktir.</text>
    </svg>
  );
}

/** 6) Bilgi ağacı: kökler, gövde, dallar. */
export function BilgiAgaci() {
  const dallar = [['Fıkıh', -70], ['Tıp', -40], ['Gökbilim', -12], ['Matematik', 16], ['Coğrafya', 44], ['Sanat', 72], ['Tarih', 100]];
  const cx = 170, gy = 160;
  return (
    <svg viewBox="0 0 340 290" width="100%" role="img" aria-label="Bilgi ağacı: kökler vahiy, gövde akıl ve tefekkür, dallar ilimler">
      {dallar.map(([ad, a], i) => {
        const rad = ((a - 90 - 15) * Math.PI) / 180;
        const x = cx + Math.cos(rad) * 118, y = gy + Math.sin(rad) * 118;
        return (
          <g key={ad}>
            <path d={`M${cx} ${gy - 20} Q${(cx + x) / 2} ${(gy + y) / 2 - 20} ${x} ${y}`} fill="none" stroke="#6B4F2A" strokeWidth={3 - i * 0.2} strokeLinecap="round" />
            <circle cx={x} cy={y} r="25" fill="#DCE6D2" stroke={BOLUM_RENK.tabiat} strokeOpacity="0.35" />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill={KITAP.murekkep} style={{ ...T, fontWeight: 700 }}>{ad}</text>
          </g>
        );
      })}
      <rect x={cx - 9} y={gy - 24} width="18" height="74" rx="6" fill="#6B4F2A" />
      <text x={cx + 16} y={gy + 22} fontSize="10" fill={KITAP.murekkep} style={{ ...T, fontWeight: 700 }}>Gövde: akıl ve tefekkür</text>
      <path d={`M${cx} ${gy + 48} q-40 18 -88 22 M${cx} ${gy + 48} q40 18 88 22 M${cx} ${gy + 48} v28`} fill="none" stroke="#8A6A3A" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="40" y={gy + 78} width="260" height="26" rx="6" fill={KITAP.zumrut} fillOpacity="0.12" />
      <text x={cx} y={gy + 95} textAnchor="middle" fontSize="11" fill={KITAP.zumrut} style={{ ...T, fontWeight: 700 }}>Kökler: Kur'an ve Sünnet</text>
      <text x={cx} y="286" textAnchor="middle" fontSize="8.5" fill={KITAP.soluk} style={T}>Şematik. Dallar örnektir; liste kapalı değildir.</text>
    </svg>
  );
}

/** 7) Tefekkür dörtlüsü — Ğâşiye 88:17-20: deve, gök, dağlar, yeryüzü. */
export function TefekkurDortlusu() {
  const k = [
    ['Deve', 'nasıl yaratıldı', (x, y) => (
      <g>
        <path d={`M${x - 28} ${y + 14} Q${x - 30} ${y} ${x - 18} ${y - 2} Q${x - 9} ${y - 20} ${x + 1} ${y - 4} Q${x + 6} ${y - 1} ${x + 10} ${y - 5} L${x + 17} ${y - 17} Q${x + 21} ${y - 23} ${x + 28} ${y - 19} L${x + 29} ${y - 15} L${x + 22} ${y - 13} L${x + 16} ${y + 3} Q${x + 14} ${y + 14} ${x + 6} ${y + 14} Z`} fill={KITAP.altin} fillOpacity="0.85" />
        {[-24, -16, 2, 9].map((dx) => <path key={dx} d={`M${x + dx} ${y + 13} v17`} stroke={KITAP.altin} strokeWidth="2.6" strokeLinecap="round" />)}
      </g>
    )],
    ['Gök', 'nasıl yükseltildi', (x, y) => <g><circle cx={x} cy={y + 8} r="14" fill="none" stroke={MECMUA.gok} strokeWidth="2.2" /><circle cx={x + 22} cy={y - 6} r="2" fill={MECMUA.gok} /><circle cx={x - 24} cy={y - 2} r="1.6" fill={MECMUA.gok} /><circle cx={x - 12} cy={y + 30} r="1.4" fill={MECMUA.gok} /></g>],
    ['Dağlar', 'nasıl dikildi', (x, y) => <path d={`M${x - 32} ${y + 30} L${x - 10} ${y - 6} L${x + 4} ${y + 12} L${x + 14} ${y} L${x + 32} ${y + 30} Z`} fill={KITAP.zumrutAcik} fillOpacity="0.25" stroke={KITAP.zumrutAcik} strokeWidth="2" strokeLinejoin="round" />],
    ['Yeryüzü', 'nasıl yayıldı', (x, y) => <g><path d={`M${x - 34} ${y + 22} q34-18 68 0`} fill="none" stroke={BOLUM_RENK.tabiat} strokeWidth="2.4" /><path d={`M${x - 34} ${y + 30} h68`} stroke={BOLUM_RENK.tabiat} strokeWidth="2" /></g>],
  ];
  return (
    <svg viewBox="0 0 340 214" width="100%" role="img" aria-label="Ğâşiye suresinde dört bakış: deve, gök, dağlar, yeryüzü">
      {k.map(([ad, alt, ciz], i) => {
        const x = (i % 2) * 172, y = Math.floor(i / 2) * 104;
        return (
          <g key={ad}>
            <rect x={x} y={y} width="168" height="98" rx="12" fill={KITAP.kagitKoyu} />
            {ciz(x + 84, y + 22)}
            <text x={x + 84} y={y + 76} textAnchor="middle" fontSize="13" fill={KITAP.murekkep} style={H}>{ad}</text>
            <text x={x + 84} y={y + 90} textAnchor="middle" fontSize="9" fill={KITAP.soluk} style={T}>{alt}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** 8) Bir günün halkası — şematik 24 saatlik kadran: öğle üstte, gece yarısı altta. */
export function GununHalkasi() {
  const cx = 170, cy = 128, r = 92;
  const aci = (saat) => ((saat - 12) * 15 + 360) % 360;   // 0° = tepe (öğle), saat yönünde
  const v = [['Sabah', 5.5], ['Öğle', 12.5], ['İkindi', 15.5], ['Akşam', 18], ['Yatsı', 19.5]];
  const pt = (a, rr) => [cx + Math.sin((a * Math.PI) / 180) * rr, cy - Math.cos((a * Math.PI) / 180) * rr];
  const yay = (s1, s2, renk, ad) => {
    const a1 = aci(s1), a2 = aci(s2);
    const fark = (a2 - a1 + 360) % 360;
    const [x1, y1] = pt(a1, r), [x2, y2] = pt(a2, r);
    const [tx, ty] = pt(a1 + fark / 2, r - 27);
    return (
      <g key={ad}>
        <path d={`M${x1} ${y1} A${r} ${r} 0 ${fark > 180 ? 1 : 0} 1 ${x2} ${y2}`} fill="none" stroke={renk} strokeWidth="14" strokeOpacity="0.5" />
        <text x={tx} y={ty + 3} textAnchor="middle" fontSize="9.5" fill={KITAP.murekkep} style={{ ...T, fontWeight: 700 }}>{ad}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 340 262" width="100%" role="img" aria-label="Bir günün halkası: vakitler günü taşır, şematik">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={KITAP.kenar} strokeWidth="14" strokeOpacity="0.5" />
      {yay(22, 5, '#7A8A9A', 'Uyku')}
      {yay(7.5, 12, BOLUM_RENK.el, 'Emek')}
      {yay(13, 15, BOLUM_RENK.ilim, 'İlim')}
      {yay(16, 17.5, BOLUM_RENK.toplum, 'Dost')}
      {yay(19, 21.5, BOLUM_RENK.ev, 'Aile')}
      {v.map(([ad, saat]) => {
        const a = aci(saat);
        const [x, y] = pt(a, r);
        const [lx, ly] = pt(a, r + 21);
        return (
          <g key={ad}>
            <circle cx={x} cy={y} r="7" fill={KITAP.zumrut} stroke={KITAP.kagit} strokeWidth="2" />
            <text x={lx} y={ly + 4} textAnchor="middle" fontSize="10" fill={KITAP.zumrut} style={{ ...T, fontWeight: 800 }}>{ad}</text>
          </g>
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="12" fill={KITAP.murekkep} style={H}>Vakitler</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="12" fill={KITAP.murekkep} style={H}>günü taşır</text>
      <Kaynak y={256}>Şematik 24 saatlik kadran: öğle üstte, gece yarısı altta. Vakitler mevsime göre kayar.</Kaynak>
    </svg>
  );
}

/** 9) Bîrûnî'nin Dünya'yı ölçme yöntemi: dağın yüksekliği + ufkun alçalma açısı. */
export function BiruniYontemi() {
  return (
    <svg viewBox="0 0 340 300" width="100%" role="img" aria-label="Bîrûnî'nin yöntemi: dağ tepesinden ufka bakış açısıyla Dünya yarıçapı">
      <circle cx="120" cy="250" r="150" fill={MECMUA.yer} fillOpacity="0.08" stroke={MECMUA.yer} strokeOpacity="0.6" />
      <circle cx="120" cy="250" r="3" fill={MECMUA.murekkep} />
      <text x="128" y="262" fontSize="10" fill={MECMUA.murekkep} style={T}>Merkez</text>
      <path d="M108 102 L120 70 L134 102 Z" fill={MECMUA.yer} fillOpacity="0.45" stroke={MECMUA.yer} />
      <text x="140" y="78" fontSize="10" fill={MECMUA.murekkep} style={{ ...T, fontWeight: 700 }}>Dağ tepesi</text>
      <line x1="120" y1="70" x2="120" y2="100" stroke={MECMUA.isik} strokeWidth="2" strokeDasharray="3 2" />
      <text x="98" y="92" fontSize="11" fill={MECMUA.isik} style={{ ...T, fontWeight: 700 }}>h</text>
      <line x1="120" y1="70" x2="318" y2="70" stroke={MECMUA.soluk} strokeWidth="1" strokeDasharray="4 3" />
      <text x="250" y="64" fontSize="9" fill={MECMUA.soluk} style={T}>yatay</text>
      <line x1="120" y1="70" x2="252" y2="128" stroke={MECMUA.gok} strokeWidth="2" />
      <circle cx="252" cy="128" r="4" fill={MECMUA.gok} />
      <text x="258" y="134" fontSize="10" fill={MECMUA.gok} style={{ ...T, fontWeight: 700 }}>ufuk</text>
      <path d="M170 70 A50 50 0 0 1 165.7 90" fill="none" stroke={MECMUA.isik} strokeWidth="2" />
      <text x="176" y="88" fontSize="12" fill={MECMUA.isik} style={{ ...T, fontWeight: 700 }}>α</text>
      <line x1="120" y1="250" x2="252" y2="128" stroke={MECMUA.yer} strokeWidth="1.2" />
      <text x="196" y="200" fontSize="11" fill={MECMUA.yer} style={{ ...T, fontWeight: 700 }}>R</text>
      <line x1="120" y1="250" x2="120" y2="100" stroke={MECMUA.yer} strokeWidth="1.2" />
      <text x="104" y="180" fontSize="11" fill={MECMUA.yer} style={{ ...T, fontWeight: 700 }}>R</text>
      <rect x="12" y="270" width="316" height="26" rx="6" fill={MECMUA.isik} fillOpacity="0.14" />
      <text x="170" y="287" textAnchor="middle" fontSize="12" fill={MECMUA.murekkep} style={H}>R = h · cos α ÷ (1 − cos α)</text>
    </svg>
  );
}

/** 10) Bîrûnî'nin sonucu ile bugünkü değer. */
export function DunyaYaricapi() {
  const veri = [['Bîrûnî (11. yy)', 6340, MECMUA.isik], ['Bugün (ortalama)', 6371, MECMUA.yer]];
  return (
    <svg viewBox="0 0 340 138" width="100%" role="img" aria-label="Bîrûnî yaklaşık 6.340 km, bugünkü ortalama 6.371 km">
      {veri.map(([ad, km, renk], i) => {
        const y = 10 + i * 44, w = (km / 6400) * 236;
        return (
          <g key={ad}>
            <text x="0" y={y + 12} fontSize="10.5" fill={MECMUA.soluk} style={T}>{ad}</text>
            <rect x="0" y={y + 18} width={w} height="18" rx="4" fill={renk} fillOpacity="0.75" />
            <text x={w + 6} y={y + 32} fontSize="12" fill={MECMUA.murekkep} style={{ ...T, fontWeight: 800 }}>{km.toLocaleString('tr-TR')} km</text>
          </g>
        );
      })}
      <text x="0" y="112" fontSize="11" fill={MECMUA.murekkep} style={{ ...T, fontWeight: 700 }}>Fark yaklaşık 31 km: binde 5'ten az.</text>
      <Kaynak y={132}>Bîrûnî'nin Nandana ölçümü; bugünkü ortalama yarıçap 6.371 km.</Kaynak>
    </svg>
  );
}

/** 11) Karanlık oda: ışık delikten geçer, görüntü ters düşer (İbnü'l-Heysem'in deneyi). */
export function KaranlikOda() {
  return (
    <svg viewBox="0 0 340 196" width="100%" role="img" aria-label="Karanlık oda: ışık küçük delikten geçer ve görüntü ters düşer">
      <rect x="150" y="20" width="180" height="150" fill="#1E2430" />
      <rect x="146" y="20" width="8" height="150" fill="#3A4252" />
      <rect x="146" y="90" width="8" height="10" fill={MECMUA.isik} />
      <text x="240" y="186" textAnchor="middle" fontSize="10" fill={MECMUA.soluk} style={T}>karanlık oda</text>
      <g>
        <path d="M40 40 l18 34 h-36 z" fill={MECMUA.yer} />
        <rect x="36" y="74" width="8" height="26" fill="#6B4F2A" />
        <text x="40" y="120" textAnchor="middle" fontSize="10" fill={MECMUA.soluk} style={T}>dışarıdaki ağaç</text>
      </g>
      <line x1="40" y1="40" x2="150" y2="95" stroke={MECMUA.isik} strokeWidth="1.6" />
      <line x1="150" y1="95" x2="322" y2="160" stroke={MECMUA.isik} strokeWidth="1.6" />
      <line x1="40" y1="100" x2="150" y2="95" stroke={MECMUA.isik} strokeWidth="1.6" />
      <line x1="150" y1="95" x2="322" y2="40" stroke={MECMUA.isik} strokeWidth="1.6" />
      <g transform="translate(322 100) scale(1 -1) translate(-322 -100)">
        <path d="M318 46 l9 22 h-18 z" fill={MECMUA.yer} opacity="0.9" />
        <rect x="316" y="68" width="4" height="14" fill="#8A6A3A" />
      </g>
      <text x="300" y="34" textAnchor="end" fontSize="9.5" fill={MECMUA.isik} style={{ ...T, fontWeight: 700 }}>görüntü ters</text>
      <text x="150" y="14" textAnchor="middle" fontSize="9.5" fill={MECMUA.murekkep} style={{ ...T, fontWeight: 700 }}>küçük delik</text>
    </svg>
  );
}

/** 12) Harezmî'nin örneği: x² + 10x = 39 — kareyi tamamlayarak. */
export function KareTamamla() {
  const s = 104, k = 26; // x kenarı (çizim ölçeği), 2,5'lik şeritler
  const x0 = 8, y0 = 36;
  return (
    <svg viewBox="0 0 340 260" width="100%" role="img" aria-label="Kareyi tamamlama: x kare artı on x eşittir otuz dokuz, x eşittir üç">
      <rect x={x0 + k} y={y0 + k} width={s} height={s} fill={MECMUA.sayi} fillOpacity="0.3" stroke={MECMUA.sayi} />
      <text x={x0 + k + s / 2} y={y0 + k + s / 2 + 5} textAnchor="middle" fontSize="15" fill={MECMUA.murekkep} style={H}>x²</text>
      {[[x0 + k, y0, s, k], [x0 + k, y0 + k + s, s, k], [x0, y0 + k, k, s], [x0 + k + s, y0 + k, k, s]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={MECMUA.sayi} fillOpacity="0.14" stroke={MECMUA.sayi} />
          <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="10" fill={MECMUA.murekkep} style={T}>2,5x</text>
        </g>
      ))}
      {[[x0, y0], [x0 + k + s, y0], [x0, y0 + k + s], [x0 + k + s, y0 + k + s]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={k} height={k} fill={MECMUA.isik} fillOpacity="0.45" stroke={MECMUA.isik} />
      ))}
      <g style={T} fontSize="11" fill={MECMUA.murekkep}>
        <text x="186" y="54" style={{ ...H }} fontSize="12">Adım adım</text>
        <text x="186" y="76">x² + 10x = 39</text>
        <text x="186" y="96">4 köşe: 4 × 6,25 = 25</text>
        <text x="186" y="116">39 + 25 = 64</text>
        <text x="186" y="136">büyük kare = 8 × 8</text>
        <text x="186" y="156">x + 5 = 8</text>
        <text x="186" y="180" fontWeight="800" fill={MECMUA.sayi}>x = 3</text>
      </g>
      <text x="170" y="236" textAnchor="middle" fontSize="10" fill={MECMUA.soluk} style={T}>Sarı köşeler eklenince şekil tam kareye döner.</text>
      <Kaynak y={252}>Örnek, Harezmî'nin cebir kitabındaki ünlü problemdir.</Kaynak>
    </svg>
  );
}

/** 13) Cezerî'nin kitabındaki 50 düzenek, altı bölüm. */
export function CezeriBolumleri() {
  const b = [['Saatler', 10], ['Meclis kapları ve figürler', 10], ['İbrik ve leğenler', 10], ['Fıskiyeler ve müzik', 10], ['Su yükselten makineler', 5], ['Çeşitli', 5]];
  let y = 8;
  return (
    <svg viewBox="0 0 340 182" width="100%" role="img" aria-label="Cezerî'nin 50 düzeneği altı bölümde">
      {b.map(([ad, n]) => {
        const yy = y; y += 26;
        return (
          <g key={ad}>
            <text x="0" y={yy + 14} fontSize="10.5" fill={MECMUA.murekkep} style={T}>{ad}</text>
            {Array.from({ length: n }, (_, i) => <rect key={i} x={170 + i * 16} y={yy + 3} width="12" height="14" rx="3" fill={MECMUA.makine} fillOpacity={0.5 + (i % 2) * 0.2} />)}
          </g>
        );
      })}
      <Kaynak y={176}>Toplam 50 düzenek · el-Câmi' beyne'l-ilm ve'l-amel (1206)</Kaynak>
    </svg>
  );
}

/** 14) Sekiz köşeli yıldız: iki kare, 45 derece. */
export function SekizKoseYildiz() {
  const kare = (cx, cy, r, aci, renk, op = 0.2) => {
    const pts = [0, 1, 2, 3].map((i) => {
      const a = ((aci + 45 + i * 90) * Math.PI) / 180;
      return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
    }).join(' ');
    return <polygon points={pts} fill={renk} fillOpacity={op} stroke={renk} strokeWidth="1.6" />;
  };
  return (
    <svg viewBox="0 0 340 170" width="100%" role="img" aria-label="Sekiz köşeli yıldız iki kareden doğar">
      {kare(52, 70, 40, 0, MECMUA.sanat)}
      <text x="52" y="140" textAnchor="middle" fontSize="10" fill={MECMUA.soluk} style={T}>1. kare</text>
      <text x="112" y="76" textAnchor="middle" fontSize="16" fill={MECMUA.soluk} style={T}>+</text>
      {kare(170, 70, 40, 45, MECMUA.sanat)}
      <text x="170" y="140" textAnchor="middle" fontSize="10" fill={MECMUA.soluk} style={T}>45° döndür</text>
      <text x="230" y="76" textAnchor="middle" fontSize="16" fill={MECMUA.soluk} style={T}>=</text>
      {kare(290, 70, 40, 0, MECMUA.sanat, 0.3)}
      {kare(290, 70, 40, 45, MECMUA.sanat, 0.3)}
      <circle cx="290" cy="70" r="12" fill={MECMUA.kagit} stroke={MECMUA.sanat} />
      <text x="290" y="140" textAnchor="middle" fontSize="10" fill={MECMUA.soluk} style={T}>sekiz köşeli yıldız</text>
      <text x="170" y="164" textAnchor="middle" fontSize="9.5" fill={MECMUA.murekkep} style={T}>Pergel ve cetvelle: önce daire, sonra kareler.</text>
    </svg>
  );
}

/** 15) Zaman şeridi: bu sayıdaki âlimler ve eserler. */
export function ZamanSeridi() {
  const olay = [
    [820, 'Harezmî · cebir kitabı', MECMUA.sayi, 'c. 820'],
    [859, 'Karaviyyîn · Fes', MECMUA.tarih, '859'],
    [1015, 'İbnü\'l-Heysem · Optik', MECMUA.isik, 'c. 1015'],
    [1030, 'Bîrûnî · Dünya ölçümü', MECMUA.yer, '11. yy'],
    [1206, 'Cezerî · makineler', MECMUA.makine, '1206'],
    [1437, 'Uluğ Bey · yıl ölçümü', MECMUA.gok, '1437'],
    [1513, 'Pîrî Reis · dünya haritası', MECMUA.yer, '1513'],
    [1575, 'Selimiye tamamlandı', MECMUA.sanat, '1575'],
  ];
  const x = (yil) => 18 + ((yil - 800) / 800) * 300;
  return (
    <svg viewBox="0 0 340 330" width="100%" role="img" aria-label="Zaman şeridi 800-1600">
      <line x1="18" y1="20" x2="318" y2="20" stroke={MECMUA.murekkep} strokeWidth="1.5" />
      {[800, 1000, 1200, 1400, 1600].map((y) => (
        <g key={y}><line x1={x(y)} y1="16" x2={x(y)} y2="24" stroke={MECMUA.murekkep} /><text x={x(y)} y="12" textAnchor="middle" fontSize="9" fill={MECMUA.soluk} style={T}>{y}</text></g>
      ))}
      {olay.map(([yil, ad, renk, etiket], i) => {
        const yy = 46 + i * 34;
        return (
          <g key={ad}>
            <line x1={x(yil)} y1="24" x2={x(yil)} y2={yy - 6} stroke={renk} strokeOpacity="0.35" />
            <circle cx={x(yil)} cy={yy - 4} r="4.5" fill={renk} />
            <text x={x(yil) > 200 ? x(yil) - 10 : x(yil) + 10} y={yy} textAnchor={x(yil) > 200 ? 'end' : 'start'} fontSize="10.5" fill={MECMUA.murekkep} style={{ ...T, fontWeight: 700 }}>{ad}</text>
            <text x={x(yil) > 200 ? x(yil) - 10 : x(yil) + 10} y={yy + 12} textAnchor={x(yil) > 200 ? 'end' : 'start'} fontSize="9" fill={MECMUA.soluk} style={T}>{etiket}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** 16) Uluğ Bey'in yıl ölçümü ile bugünkü değer. */
export function YildizYili() {
  return (
    <svg viewBox="0 0 340 150" width="100%" role="img" aria-label="Uluğ Bey 365 gün 6 saat 10 dakika 8 saniye; bugün 365 gün 6 saat 9 dakika 10 saniye; fark 58 saniye">
      <rect x="0" y="4" width="340" height="56" rx="10" fill={MECMUA.gok} fillOpacity="0.12" />
      <text x="14" y="24" fontSize="10" fill={MECMUA.soluk} style={T}>Semerkant, 1437</text>
      <text x="14" y="48" fontSize="17" fill={MECMUA.gok} style={H}>365 g 6 sa 10 dk 8 sn</text>
      <rect x="0" y="68" width="340" height="56" rx="10" fill={MECMUA.yer} fillOpacity="0.12" />
      <text x="14" y="88" fontSize="10" fill={MECMUA.soluk} style={T}>Bugünkü değer (yıldız yılı)</text>
      <text x="14" y="112" fontSize="17" fill={MECMUA.yer} style={H}>365 g 6 sa 9 dk 10 sn</text>
      <text x="326" y="100" textAnchor="end" fontSize="20" fill={MECMUA.murekkep} style={{ ...T, fontWeight: 800 }}>58 sn</text>
      <Kaynak y={144}>Fark bir yılda bir dakikadan az. Kaynak: Zîc-i Sultânî; MacTutor.</Kaynak>
    </svg>
  );
}

/** 17) Dinin üç katı: İslam (yapılanlar), İman (inanılanlar), İhsan (nasıl). Müslim 8. */
export function UcKat() {
  const katlar = [
    { ad: 'İhsan', alt: 'Nasıl? — Allah\'ı görüyormuş gibi', renk: KITAP.altin, w: 150 },
    { ad: 'İman', alt: 'Kalp — altı esas', renk: KITAP.kiremit, w: 230 },
    { ad: 'İslam', alt: 'Beden ve dil — beş esas', renk: KITAP.zumrut, w: 310 },
  ];
  return (
    <svg viewBox="0 0 340 238" width="100%" role="img" aria-label="Dinin üç katı: İslam, İman, İhsan">
      <defs>
        <linearGradient id="uk-isik" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={KITAP.altinAcik} stopOpacity="0.55" /><stop offset="1" stopColor={KITAP.altinAcik} stopOpacity="0" /></linearGradient>
      </defs>
      <path d="M170 4 L232 58 H108 Z" fill="url(#uk-isik)" />
      {katlar.map((k, i) => {
        const y = 20 + i * 62;
        const x = 170 - k.w / 2;
        return (
          <g key={k.ad}>
            <rect x={x} y={y} width={k.w} height="54" rx="10" fill={k.renk} fillOpacity={0.14 + i * 0.05} stroke={k.renk} strokeOpacity="0.55" />
            <text x="170" y={y + 23} textAnchor="middle" fontSize="16" fill={k.renk} style={{ ...H, fontWeight: 800 }}>{k.ad}</text>
            <text x="170" y={y + 41} textAnchor="middle" fontSize="10" fill={KITAP.murekkep} style={T}>{k.alt}</text>
          </g>
        );
      })}
      <text x="170" y="232" textAnchor="middle" fontSize="9" fill={KITAP.soluk} style={T}>Kaynak: Cibril hadisi, Müslim 8 · Buhârî 50</text>
    </svg>
  );
}

/** 18) Darüşşifa kubbesi: şadırvan su sesi, musiki sahnesi ve hasta odalarının akustik yerleşimi. */
export function DarussifaPlani() {
  const odalar = [-66, -33, 0, 33, 66];
  return (
    <svg viewBox="0 0 340 205" width="100%" role="img" aria-label="Darüşşifa planı: merkezde şadırvan, musiki sahnesi ve akustik kubbe">
      <rect x="8" y="8" width="324" height="172" rx="14" fill={MECMUA.yer} fillOpacity="0.08" stroke={MECMUA.yer} strokeOpacity="0.35" />
      <path d="M52 146 A118 98 0 0 1 288 146" fill={MECMUA.gok} fillOpacity="0.08" stroke={MECMUA.gok} strokeWidth="1.6" strokeDasharray="4 3" />
      <text x="170" y="34" textAnchor="middle" fontSize="11" fill={MECMUA.gok} style={{ ...T, fontWeight: 700 }}>Akustik Kubbe (sesi odalara eşit dağıtır)</text>
      {odalar.map((dx, i) => (
        <g key={dx}>
          <rect x={152 + dx * 1.65} y="48" width="36" height="24" rx="5" fill={MECMUA.kagit} stroke={MECMUA.yer} />
          <text x={170 + dx * 1.65} y="63" textAnchor="middle" fontSize="8.5" fill={MECMUA.murekkep} style={T}>Oda {i + 1}</text>
        </g>
      ))}
      <circle cx="170" cy="116" r="24" fill={MECMUA.gok} fillOpacity="0.18" stroke={MECMUA.gok} strokeWidth="1.6" />
      <circle cx="170" cy="116" r="13" fill={MECMUA.gok} fillOpacity="0.28" />
      <circle cx="170" cy="116" r="4" fill={MECMUA.gok} />
      <text x="170" y="152" textAnchor="middle" fontSize="10" fill={MECMUA.murekkep} style={{ ...T, fontWeight: 700 }}>Merkez Şadırvan (su sesi)</text>
      <rect x="24" y="102" width="76" height="28" rx="7" fill={MECMUA.sanat} fillOpacity="0.15" stroke={MECMUA.sanat} />
      <text x="62" y="119" textAnchor="middle" fontSize="9.5" fill={MECMUA.sanat} style={{ ...T, fontWeight: 700 }}>Musiki Heyeti</text>
      <rect x="240" y="102" width="76" height="28" rx="7" fill={MECMUA.isik} fillOpacity="0.18" stroke={MECMUA.isik} />
      <text x="278" y="119" textAnchor="middle" fontSize="9.5" fill={MECMUA.tarih} style={{ ...T, fontWeight: 700 }}>Güzel Koku &amp; Şerbet</text>
      <Kaynak y={196}>Kaynak: Edirne II. Bayezid Darüşşifası (1488) mimari düzeni; TDV İslâm Ansiklopedisi, &quot;Bîmâristan&quot;.</Kaynak>
    </svg>
  );
}

/** 19) Taş cephede kuş sarayı: rüzgâr kıran saçak, tünek ve iç yuva hücresi. */
export function KusEviMimarisi() {
  return (
    <svg viewBox="0 0 340 185" width="100%" role="img" aria-label="Osmanlı kuş evi mimarisi: taş cephede saçaklı yuva">
      <rect x="16" y="10" width="308" height="148" rx="12" fill={MECMUA.tarih} fillOpacity="0.10" stroke={MECMUA.tarih} strokeOpacity="0.3" />
      <path d="M110 72 L170 30 L230 72 Z" fill={MECMUA.makine} fillOpacity="0.22" stroke={MECMUA.makine} strokeWidth="1.6" />
      <rect x="122" y="72" width="96" height="68" rx="6" fill={MECMUA.kagit} stroke={MECMUA.tarih} strokeWidth="1.6" />
      {[-24, 0, 24].map((dx) => (
        <g key={dx}>
          <path d={`M${160 + dx} 116 V94 A10 10 0 0 1 ${180 + dx} 94 V116 Z`} fill={MECMUA.murekkep} fillOpacity="0.78" />
          <line x1={156 + dx} y1="120" x2={184 + dx} y2="120" stroke={MECMUA.makine} strokeWidth="2.4" strokeLinecap="round" />
        </g>
      ))}
      <text x="28" y="48" fontSize="10" fill={MECMUA.murekkep} style={{ ...T, fontWeight: 700 }}>Geniş taş saçak</text>
      <text x="28" y="61" fontSize="9" fill={MECMUA.soluk} style={T}>Yağmur ve rüzgârı keser</text>
      <text x="28" y="106" fontSize="10" fill={MECMUA.murekkep} style={{ ...T, fontWeight: 700 }}>Kemerli giriş &amp; tünek</text>
      <text x="28" y="119" fontSize="9" fill={MECMUA.soluk} style={T}>Yırtıcı kuş giremez</text>
      <text x="236" y="88" fontSize="10" fill={MECMUA.murekkep} style={{ ...T, fontWeight: 700 }}>Güney / Doğu cephe</text>
      <text x="236" y="101" fontSize="9" fill={MECMUA.soluk} style={T}>Sabah güneşini alır</text>
      <Kaynak y={175}>Kaynak: TDV İslâm Ansiklopedisi, &quot;Kuş Evleri&quot; maddesi.</Kaynak>
    </svg>
  );
}

export const INFOGRAFIK = {
  ucKat: UcKat,
  hayatHalkalari: HayatHalkalari,
  azAmaDevamli: AzAmaDevamli,
  sozSuzgeci: SozSuzgeci,
  ucDirek: UcDirek,
  kardeslik: KardeslikAgi,
  bilgiAgaci: BilgiAgaci,
  tefekkur: TefekkurDortlusu,
  gununHalkasi: GununHalkasi,
  biruni: BiruniYontemi,
  dunyaYaricapi: DunyaYaricapi,
  karanlikOda: KaranlikOda,
  kareTamamla: KareTamamla,
  cezeri: CezeriBolumleri,
  yildiz8: SekizKoseYildiz,
  zamanSeridi: ZamanSeridi,
  yildizYili: YildizYili,
  darussifaPlani: DarussifaPlani,
  kusEviMimarisi: KusEviMimarisi,
};
