/**
 * PAYLAŞIM KARTI
 * ──────────────
 * Uygulama reklamla değil, insanların birbirine göstermesiyle yayılır.
 * Ama gösterilecek bir şey üretmiyordu — paylaş düğmesi metin kopyalıyordu
 * ve kimse metin paylaşmaz.
 *
 * Burası 1080×1350 (4:5, hikâye ve akış için en uygun oran) bir PNG üretir.
 * Canvas ile çizilir; dışarıdan hiçbir görsel, font veya kaynak çekilmez —
 * çevrimdışı da çalışır, telif riski yoktur.
 *
 * TASARIM İLKESİ: bu bir reklam değil, bir iz. Uygulama adı en altta,
 * küçük ve sessiz durur. Ekranın tamamı kişinin kendi gününe aittir.
 * Kimse reklam paylaşmaz; insanlar kendi izlerini paylaşır.
 */

const W = 1080, H = 1350;

function yuvarlakDikdortgen(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Metni verilen genişliğe sardırır ve çizilen satır sayısını döndürür. */
function sarKurYaz(ctx, metin, x, y, maxW, satirY) {
  const kelimeler = String(metin).split(' ');
  let satir = '';
  let n = 0;
  for (const k of kelimeler) {
    const dene = satir ? `${satir} ${k}` : k;
    if (ctx.measureText(dene).width > maxW && satir) {
      ctx.fillText(satir, x, y + n * satirY);
      satir = k; n += 1;
    } else {
      satir = dene;
    }
  }
  if (satir) { ctx.fillText(satir, x, y + n * satirY); n += 1; }
  return n;
}

/** Sekiz köşeli yıldız (rub'ul hizb) — kartın sessiz imzası. */
function yildiz(ctx, cx, cy, r, renk, kalinlik = 3) {
  ctx.save();
  ctx.strokeStyle = renk;
  ctx.lineWidth = kalinlik;
  ctx.lineJoin = 'round';
  [0, Math.PI / 4].forEach(a => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  });
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Kart üretir ve PNG blob döndürür.
 *
 * @param tur    'gun' | 'nabiz' | 'kirkgun' | 'ayet'
 * @param renk   { zemin, zeminUst, vurgu, vurguIsik, metin, soluk }
 * @param veri   türe göre değişen alanlar
 */
export async function kartUret({ tur = 'gun', renk, veri = {} }) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const R = renk;

  // ── Zemin ──
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, R.zeminUst);
  grad.addColorStop(1, R.zemin);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Üstten inen ışık
  const isik = ctx.createRadialGradient(W / 2, -120, 40, W / 2, -120, 780);
  isik.addColorStop(0, R.vurguIsik + '44');
  isik.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = isik;
  ctx.fillRect(0, 0, W, H);

  // Kenar çerçevesi
  ctx.strokeStyle = R.vurgu + '33';
  ctx.lineWidth = 2;
  yuvarlakDikdortgen(ctx, 46, 46, W - 92, H - 92, 40);
  ctx.stroke();

  ctx.textAlign = 'center';
  const SANS = '-apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
  const SERIF = 'Georgia, "Times New Roman", serif';

  // ── Üst etiket ──
  ctx.fillStyle = R.vurgu;
  ctx.font = `800 26px ${SANS}`;
  ctx.letterSpacing = '10px';
  ctx.fillText(String(veri.etiket || 'BUGÜN').toUpperCase(), W / 2, 150);
  ctx.letterSpacing = '0px';

  if (tur === 'gun' || tur === 'nabiz') {
    // ── Büyük sayı halkası ──
    const cx = W / 2, cy = 430, r = 150;
    ctx.strokeStyle = R.vurgu + '2A';
    ctx.lineWidth = 22;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

    const oran = Math.max(0, Math.min(1, (veri.puan ?? 0) / 100));
    ctx.strokeStyle = R.vurgu;
    ctx.lineCap = 'round';
    ctx.shadowColor = R.vurguIsik; ctx.shadowBlur = 34;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + oran * Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = R.metin;
    ctx.font = `800 126px ${SANS}`;
    ctx.fillText(String(veri.puan ?? 0), cx, cy + 44);

    ctx.fillStyle = R.soluk;
    ctx.font = `700 24px ${SANS}`;
    ctx.letterSpacing = '6px';
    ctx.fillText('NABIZ', cx, cy + 96);
    ctx.letterSpacing = '0px';

    // ── Cümle ──
    ctx.fillStyle = R.metin;
    ctx.font = `italic 44px ${SERIF}`;
    sarKurYaz(ctx, veri.cumle || '', W / 2, 700, W - 220, 62);

    // ── Dört eksen ──
    const eks = veri.eksen || [];
    if (eks.length) {
      const gen = 190, bos = 26;
      const toplam = eks.length * gen + (eks.length - 1) * bos;
      let x = (W - toplam) / 2;
      eks.forEach(e => {
        ctx.fillStyle = R.vurgu + '22';
        yuvarlakDikdortgen(ctx, x, 900, gen, 10, 5); ctx.fill();
        ctx.fillStyle = R.vurgu;
        yuvarlakDikdortgen(ctx, x, 900, gen * (e.oran / 100), 10, 5); ctx.fill();
        ctx.fillStyle = R.soluk;
        ctx.font = `700 24px ${SANS}`;
        ctx.fillText(e.ad, x + gen / 2, 952);
        x += gen + bos;
      });
    }
  }

  if (tur === 'kirkgun') {
    yildiz(ctx, W / 2, 400, 120, R.vurgu, 3);
    ctx.fillStyle = R.metin;
    ctx.font = `800 150px ${SANS}`;
    ctx.fillText(String(veri.gun || 40), W / 2, 452);

    ctx.fillStyle = R.metin;
    ctx.font = `800 62px ${SERIF}`;
    sarKurYaz(ctx, veri.baslik || 'Kırk gün', W / 2, 680, W - 200, 78);

    ctx.fillStyle = R.soluk;
    ctx.font = `italic 40px ${SERIF}`;
    sarKurYaz(ctx, veri.cumle || '', W / 2, 830, W - 220, 58);
  }

  if (tur === 'ayet') {
    yildiz(ctx, W / 2, 300, 70, R.vurgu + '66', 2);
    ctx.fillStyle = R.metin;
    ctx.font = `italic 52px ${SERIF}`;
    const n = sarKurYaz(ctx, veri.metin || '', W / 2, 520, W - 200, 76);
    ctx.fillStyle = R.vurgu;
    ctx.font = `700 32px ${SANS}`;
    ctx.fillText(veri.kaynak || '', W / 2, 520 + n * 76 + 60);
  }

  // ── Alt imza — küçük ve sessiz ──
  ctx.strokeStyle = R.vurgu + '28';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(200, H - 190); ctx.lineTo(W - 200, H - 190); ctx.stroke();

  yildiz(ctx, W / 2, H - 128, 20, R.vurgu + '99', 2);

  ctx.fillStyle = R.soluk;
  ctx.font = `700 24px ${SANS}`;
  ctx.letterSpacing = '5px';
  ctx.fillText('İSLAMİ YAŞAM ASİSTANI', W / 2, H - 72);
  ctx.letterSpacing = '0px';

  return new Promise(res => c.toBlob(b => res(b), 'image/png', 0.95));
}

/**
 * Kartı paylaşır. Cihaz destekliyorsa yerel paylaşım sayfası açılır;
 * desteklemiyorsa dosya indirilir. İkisi de olmuyorsa yeni sekmede açılır.
 */
export async function kartPaylas(blob, baslik = 'Bugün') {
  if (!blob) return false;
  const dosya = new File([blob], 'islamapp.png', { type: 'image/png' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [dosya] })) {
      await navigator.share({ files: [dosya], title: baslik });
      return true;
    }
  } catch { /* kullanıcı vazgeçti veya desteklemiyor */ }
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'islamapp.png';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch { return false; }
}

const paylasimKarti = { kartUret, kartPaylas };
export default paylasimKarti;
