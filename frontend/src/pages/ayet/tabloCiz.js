// 🖼️ AYET TABLOSU — tuvale çizim. Dört özgün stil: Çini, Gece, Bahar, Kemer.
// Meal metni DEĞİŞTİRİLMEZ, kısaltılmaz: uzun metinde yalnız yazı küçülür. Altta sure·âyet ve meal kaynağı yazılır.
// Hiçbir çizim başka bir hesaptan/uygulamadan alınmadı; hepsi buradaki geometriyle üretilir.

export const STILLER = [
  { id: 'cini', ad: 'Çini' },
  { id: 'gece', ad: 'Gece' },
  { id: 'bahar', ad: 'Bahar' },
  { id: 'kemer', ad: 'Kemer' },
];
export const BOYUTLAR = [
  { id: 'gonderi', ad: 'Gönderi 4:5', w: 1080, h: 1350 },
  { id: 'hikaye', ad: 'Hikâye 9:16', w: 1080, h: 1920 },
  { id: 'kare', ad: 'Kare', w: 1080, h: 1080 },
];

const BASLIK_FONT = '"Fraunces", "Playfair Display", Georgia, serif';
const GOVDE_FONT = '"Literata", Georgia, serif';

/** Basit tohumlu rastgele (her çizimde aynı yıldız ve leke düzeni). */
function tohum(s) { let x = s; return () => { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }

function sekizYildiz(ctx, x, y, r, dolgu, cizgi, kalinlik = 2) {
  for (const aci of [0, Math.PI / 4]) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(aci);
    ctx.beginPath(); ctx.rect(-r, -r, 2 * r, 2 * r);
    if (dolgu) { ctx.fillStyle = dolgu; ctx.fill(); }
    if (cizgi) { ctx.strokeStyle = cizgi; ctx.lineWidth = kalinlik; ctx.stroke(); }
    ctx.restore();
  }
}

function kemerYolu(ctx, x, y, w, h) {
  // Sivri kemer: alt köşelerden yukarı, tepede sivri birleşir.
  const omuz = y + w * 0.55;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, omuz);
  ctx.quadraticCurveTo(x, y + w * 0.12, x + w / 2, y);
  ctx.quadraticCurveTo(x + w, y + w * 0.12, x + w, omuz);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

/** Metni verilen genişliğe sar. */
function sar(ctx, metin, genislik) {
  const kelimeler = metin.split(/\s+/); const satirlar = []; let s = '';
  for (const k of kelimeler) {
    const deneme = s ? `${s} ${k}` : k;
    if (ctx.measureText(deneme).width > genislik && s) { satirlar.push(s); s = k; } else s = deneme;
  }
  if (s) satirlar.push(s);
  return satirlar;
}

/** Kutunun içine sığan en büyük punto ile paragrafları yerleştirir. */
function metinYerlestir(ctx, paragraflar, kutu, { font, renk, maks = 72, min = 28, hiza = 'center' }) {
  let boyut = maks; let duzen = null;
  for (; boyut >= min; boyut -= 2) {
    ctx.font = `500 ${boyut}px ${font}`;
    const satirAraligi = boyut * 1.38; const paragrafAraligi = boyut * 0.6;
    const bloklar = paragraflar.map((p) => sar(ctx, p, kutu.w));
    const yukseklik = bloklar.reduce((t, b) => t + b.length * satirAraligi, 0) + (bloklar.length - 1) * paragrafAraligi;
    duzen = { bloklar, satirAraligi, paragrafAraligi, yukseklik };
    if (yukseklik <= kutu.h) break;
  }
  ctx.font = `500 ${Math.max(boyut, min)}px ${font}`;
  ctx.fillStyle = renk; ctx.textAlign = hiza; ctx.textBaseline = 'alphabetic';
  let y = kutu.y + (kutu.h - duzen.yukseklik) / 2 + duzen.satirAraligi * 0.78;
  const x = hiza === 'center' ? kutu.x + kutu.w / 2 : kutu.x;
  duzen.bloklar.forEach((b, i) => {
    b.forEach((satir) => { ctx.fillText(satir, x, y); y += duzen.satirAraligi; });
    if (i < duzen.bloklar.length - 1) y += duzen.paragrafAraligi;
  });
  return { boyut, sigdi: duzen.yukseklik <= kutu.h };
}

function altBilgi(ctx, { w, h, ref, etiket, renk, ikincil, y, isimY }) {
  ctx.textAlign = 'center';
  ctx.fillStyle = renk; ctx.font = `700 38px ${BASLIK_FONT}`;
  ctx.fillText(ref, w / 2, y);
  ctx.fillStyle = ikincil; ctx.font = `400 22px ${GOVDE_FONT}`;
  ctx.fillText(etiket, w / 2, y + 40);
  ctx.font = `700 22px ${BASLIK_FONT}`; ctx.globalAlpha = 0.75;
  ctx.fillText('İslamiApp', w / 2, isimY || h - 46);
  ctx.globalAlpha = 1;
}

// ---------- Stiller ----------
function cini(ctx, w, h) {
  ctx.fillStyle = '#F6F0E2'; ctx.fillRect(0, 0, w, h);
  const bant = 84; const kare = 84;
  const KOBALT = '#1F4E9C'; const FIRUZE = '#2E9AA3';
  const cerceve = (x, y) => {
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x, y, kare, kare);
    sekizYildiz(ctx, x + kare / 2, y + kare / 2, kare * 0.27, KOBALT, null);
    ctx.beginPath(); ctx.arc(x + kare / 2, y + kare / 2, kare * 0.12, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + kare / 2, y + kare / 2, kare * 0.06, 0, Math.PI * 2); ctx.fillStyle = FIRUZE; ctx.fill();
    for (const [cx, cy] of [[x, y], [x + kare, y], [x, y + kare], [x + kare, y + kare]]) {
      ctx.beginPath(); ctx.arc(cx, cy, kare * 0.14, 0, Math.PI * 2); ctx.fillStyle = FIRUZE; ctx.fill();
    }
  };
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, bant); ctx.rect(0, h - bant, w, bant); ctx.rect(0, 0, bant, h); ctx.rect(w - bant, 0, bant, h); ctx.clip();
  for (let x = 0; x < w; x += kare) for (let y = 0; y < h; y += kare) cerceve(x, y);
  ctx.restore();
  ctx.strokeStyle = '#B8913F'; ctx.lineWidth = 4; ctx.strokeRect(bant + 14, bant + 14, w - 2 * bant - 28, h - 2 * bant - 28);
  ctx.lineWidth = 1.5; ctx.strokeRect(bant + 24, bant + 24, w - 2 * bant - 48, h - 2 * bant - 48);
  sekizYildiz(ctx, w / 2, bant + 110, 22, null, '#B8913F', 3);
  return { metin: '#1B2A4A', ref: KOBALT, ikincil: '#5B6478', kutu: { x: bant + 90, y: bant + 170, w: w - 2 * bant - 180, h: h - 2 * bant - 400 }, altY: h - bant - 170, isimY: h - bant - 52 };
}

function gece(ctx, w, h) {
  const g = ctx.createRadialGradient(w / 2, h * 0.2, 50, w / 2, h * 0.45, h);
  g.addColorStop(0, '#14523F'); g.addColorStop(0.5, '#08241B'); g.addColorStop(1, '#030E0A');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const r = tohum(7);
  for (let i = 0; i < 160; i++) {
    const x = r() * w; const y = r() * h * 0.75; const s = r() * 2.4 + 0.4;
    ctx.globalAlpha = 0.25 + r() * 0.6; ctx.fillStyle = '#FFF4CF'; ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // hilal
  // hilal: ayrı küçük tuvalde kesilip yapıştırılır (ana tuvalin zemini delinmesin)
  const ay = document.createElement('canvas'); ay.width = 100; ay.height = 100;
  const a = ay.getContext('2d');
  a.beginPath(); a.arc(50, 50, 46, 0, Math.PI * 2); a.fillStyle = '#E9C77E'; a.fill();
  a.globalCompositeOperation = 'destination-out'; a.beginPath(); a.arc(68, 40, 42, 0, Math.PI * 2); a.fill();
  ctx.drawImage(ay, w / 2 - 50, 140);
  sekizYildiz(ctx, w / 2 + 52, 170, 9, '#E9C77E', null);
  ctx.strokeStyle = 'rgba(216,183,106,0.75)'; ctx.lineWidth = 2.5; ctx.strokeRect(46, 46, w - 92, h - 92);
  ctx.lineWidth = 1; ctx.strokeRect(58, 58, w - 116, h - 116);
  // ufukta kubbe silueti
  ctx.fillStyle = '#020A07';
  ctx.beginPath(); ctx.moveTo(58, h - 58); ctx.lineTo(58, h - 150);
  ctx.lineTo(w / 2 - 210, h - 150); ctx.quadraticCurveTo(w / 2, h - 360, w / 2 + 210, h - 150);
  ctx.lineTo(w - 58, h - 150); ctx.lineTo(w - 58, h - 58); ctx.closePath(); ctx.fill();
  for (const mx of [w / 2 - 300, w / 2 + 300]) { ctx.fillRect(mx - 9, h - 330, 18, 180); ctx.beginPath(); ctx.moveTo(mx - 11, h - 330); ctx.lineTo(mx, h - 380); ctx.lineTo(mx + 11, h - 330); ctx.fill(); }
  return { metin: '#F4EFE3', ref: '#E9C77E', ikincil: 'rgba(244,239,227,0.7)', kutu: { x: 130, y: 300, w: w - 260, h: h - 830 }, altY: h - 470, isim: '#F4EFE3' };
}

function bahar(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#FBEFE9'); g.addColorStop(1, '#EEF3E6');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const r = tohum(21);
  for (let i = 0; i < 14; i++) {
    const x = r() * w; const y = r() * h; const rad = 120 + r() * 220;
    const rg = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const renk = i % 2 ? '232,160,170' : '160,196,150';
    rg.addColorStop(0, `rgba(${renk},0.22)`); rg.addColorStop(1, `rgba(${renk},0)`);
    ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
  }
  const dal = (x, y, yon, olcek) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(yon * olcek, olcek);
    ctx.strokeStyle = '#7A6A4F'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(80, -60, 160, -70, 260, -150); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(120, -60); ctx.quadraticCurveTo(150, -120, 140, -170); ctx.stroke();
    const cicek = (cx, cy, s, renk) => {
      for (let k = 0; k < 5; k++) {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate((k * 2 * Math.PI) / 5);
        ctx.beginPath(); ctx.ellipse(0, -s * 0.9, s * 0.55, s * 0.9, 0, 0, Math.PI * 2); ctx.fillStyle = renk; ctx.fill(); ctx.restore();
      }
      ctx.beginPath(); ctx.arc(cx, cy, s * 0.35, 0, Math.PI * 2); ctx.fillStyle = '#E3B04B'; ctx.fill();
    };
    [[60, -40, 18, '#F2A7B5'], [140, -170, 22, '#EE8FA2'], [200, -110, 16, '#F7C6CF'], [260, -150, 20, '#F2A7B5'], [100, -90, 12, '#FFFFFF']].forEach((c) => cicek(...c));
    ctx.fillStyle = '#8DB580';
    [[30, -12], [170, -78], [230, -125], [128, -128]].forEach(([lx, ly]) => { ctx.beginPath(); ctx.ellipse(lx, ly, 18, 7, -0.6, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
  };
  dal(40, 300, 1, 1.15); dal(w - 40, h - 200, -1, 1.25);
  ctx.strokeStyle = 'rgba(122,106,79,0.45)'; ctx.lineWidth = 2; ctx.strokeRect(50, 50, w - 100, h - 100);
  return { metin: '#3A2E2A', ref: '#B45A6B', ikincil: '#7A6A60', kutu: { x: 130, y: 360, w: w - 260, h: h - 900 }, altY: h - 470 };
}

function kemer(ctx, w, h) {
  ctx.fillStyle = '#EFE6D2'; ctx.fillRect(0, 0, w, h);
  const kx = 90; const kw = w - 180; const ky = 110; const kh = h - 220;
  kemerYolu(ctx, kx, ky, kw, kh); ctx.fillStyle = '#0F5C46'; ctx.fill();
  kemerYolu(ctx, kx + 34, ky + 44, kw - 68, kh - 68); ctx.fillStyle = '#FBF8F0'; ctx.fill();
  ctx.strokeStyle = '#B8913F'; ctx.lineWidth = 3; ctx.stroke();
  // kemer bandında yıldız dizisi
  for (let y = ky + kw * 0.55 + 30; y < ky + kh - 30; y += 56) {
    sekizYildiz(ctx, kx + 17, y, 7, '#D8B76A', null); sekizYildiz(ctx, kx + kw - 17, y, 7, '#D8B76A', null);
  }
  // asılı kandil
  const lx = w / 2; const ly = ky + kw * 0.2 + 70;
  ctx.strokeStyle = '#B8913F'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, ky + 60); ctx.lineTo(lx, ly - 26); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lx - 22, ly - 26); ctx.lineTo(lx + 22, ly - 26); ctx.lineTo(lx + 14, ly + 18); ctx.lineTo(lx - 14, ly + 18); ctx.closePath();
  ctx.fillStyle = '#E9C77E'; ctx.fill(); ctx.stroke();
  const parilti = ctx.createRadialGradient(lx, ly, 0, lx, ly, 120); parilti.addColorStop(0, 'rgba(255,226,150,0.45)'); parilti.addColorStop(1, 'rgba(255,226,150,0)');
  ctx.fillStyle = parilti; ctx.beginPath(); ctx.arc(lx, ly, 120, 0, Math.PI * 2); ctx.fill();
  return { metin: '#163A2E', ref: '#0F5C46', ikincil: '#6A6A5E', kutu: { x: kx + 90, y: ly + 110, w: kw - 180, h: kh - (ly - ky) - 400 }, altY: ky + kh - 190 };
}

const CIZICI = { cini, gece, bahar, kemer };

/** Tabloyu çizer. `paragraflar`: meal metinleri (değiştirilmeden), `ref`: "Ra'd Sûresi · 28", `etiket`: meal kaynağı. */
export function tabloCiz(canvas, { stil, boyut, paragraflar, ref, etiket }) {
  const { w, h } = boyut;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  const d = CIZICI[stil](ctx, w, h);
  const sonuc = metinYerlestir(ctx, paragraflar, d.kutu, { font: GOVDE_FONT, renk: d.metin, maks: h > 1500 ? 78 : 70, min: 26 });
  ctx.strokeStyle = d.ref; ctx.globalAlpha = 0.55; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(w / 2 - 70, d.altY - 62); ctx.lineTo(w / 2 + 70, d.altY - 62); ctx.stroke(); ctx.globalAlpha = 1;
  sekizYildiz(ctx, w / 2, d.altY - 62, 7, d.ref, null);
  altBilgi(ctx, { w, h, ref, etiket, renk: d.ref, ikincil: d.ikincil, y: d.altY, isimY: d.isimY });
  return sonuc;
}
