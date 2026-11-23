// 🧮 DİZGİ — kitabı sabit ölçülü sayfalara böler.
// Her bloğun gerçek yüksekliği ölçülür (Olcer bileşeni). Paragraflar gerekirse kelime sınırından bölünür;
// kutular, âyet ve hadis kartları, çizimler bölünmez: sığmazsa bir sonraki sayfaya geçer.
// Başlık asla sayfanın dibinde yalnız kalmaz (kendisinden sonraki bloğun bir kısmı da sığmalı).
import { ICERIK_Y, ARALIK } from './sayfalar';

const PAY = 0.5; // yuvarlama payı (px)

/**
 * @param kitap     { onSayfalar:[tip], bolumler:[{id, bloklar}], sonSayfalar:[tip] }
 * @param olc       { blok(bi,k) → yükseklik (ARALIK dahil), paragraf(bi,k,ilk,son) → yükseklik (ARALIK dahil), satir: px }
 * @returns {{ sayfalar: object[], bolumSayfa: Object<string, number> }}
 */
export function diz(kitap, olc) {
  const sayfalar = [];
  const bolumSayfa = {};
  (kitap.onSayfalar || []).forEach((tip) => sayfalar.push({ tip }));

  kitap.bolumler.forEach((bol, bi) => {
    bolumSayfa[bol.id] = sayfalar.length;
    sayfalar.push({ tip: 'acilis', bi });
    let cur = null;
    let kalan = 0;
    const bekleyen = []; // sığmadığı için bir sonraki sayfanın başına "yüzdürülen" çizimler
    const yeni = () => {
      cur = { tip: 'icerik', bi, ogeler: [] };
      sayfalar.push(cur);
      kalan = ICERIK_Y;
      while (bekleyen.length) {
        const h = olc.blok(bi, bekleyen[0]);
        if (cur.ogeler.length && h > kalan + PAY) break;
        cur.ogeler.push({ k: bekleyen.shift() });
        kalan -= h;
      }
    };
    yeni();
    // Gerekli boşluk yoksa yeni sayfa aç; yeni sayfanın başına yüzen bir çizim yerleştiyse ve yine sığmıyorsa bir daha.
    const yerAc = (gerek) => {
      if (gerek > kalan + PAY && cur.ogeler.length) yeni();
      if (gerek > kalan + PAY && cur.ogeler.length) yeni();
    };

    bol.bloklar.forEach((b, k) => {
      // Yüzen çizimi yalnız düz metin geçebilir; başka bir blok gelince çizim önce yerine konur.
      if (bekleyen.length && b.t !== 'p') yeni();
      if (b.t === 'sayfa') { if (cur.ogeler.length) yeni(); return; }
      const h = olc.blok(bi, k);

      if (b.t === 'h') {
        const sonraki = bol.bloklar[k + 1];
        // Ardından paragraf geliyorsa en az üç satırı, bölünmeyen bir blok geliyorsa bloğun tamamı başlıkla aynı sayfaya sığmalı.
        const sonrakiTam = sonraki ? olc.blok(bi, k + 1) : 0;
        const sonrakiH = !sonraki ? 0 : sonraki.t === 'p' ? Math.min(sonrakiTam, olc.satir * 3 + ARALIK) : (sonrakiTam + h <= ICERIK_Y ? sonrakiTam : 0);
        yerAc(h + sonrakiH);
        cur.ogeler.push({ k }); kalan -= h;
        return;
      }

      if (b.t === 'p' && h > kalan + PAY) {
        const n = b._tokens.length;
        let bas = 0;
        while (bas < n) {
          // En az iki satır sığmıyorsa yeni sayfa
          if (kalan < olc.satir * 2 + ARALIK) yeni();
          let lo = bas + 1;
          let hi = n;
          let en = bas;
          while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (olc.paragraf(bi, k, bas, mid) <= kalan + PAY) { en = mid; lo = mid + 1; } else hi = mid - 1;
          }
          if (en === bas) {
            if (!cur.ogeler.length) { en = Math.min(n, bas + 1); } // tek kelime bile sığmıyorsa (olmaz) zorla ilerle
            else { yeni(); continue; }
          }
          // Dul satır: bölmenin son parçası tek kelimeyse bir kelime geri al
          if (en < n && n - en < 3 && en - bas > 6) en = n - 3;
          cur.ogeler.push({ k, dilim: en === n && bas === 0 ? undefined : [bas, en] });
          kalan -= olc.paragraf(bi, k, bas, en);
          bas = en;
          if (bas < n) yeni();
        }
        return;
      }

      if (h > kalan + PAY && cur.ogeler.length) {
        // Kitaplardaki gibi: çizim sığmıyorsa ve ardından metin geliyorsa, çizim bir sonraki sayfanın başına
        // yüzer; bu sayfanın kalan boşluğunu takip eden metin doldurur.
        const sonraki = bol.bloklar[k + 1];
        if (b.t === 'info' && sonraki && sonraki.t === 'p' && kalan > olc.satir * 4 + ARALIK) {
          bekleyen.push(k);
          return;
        }
        yerAc(h);
      }
      cur.ogeler.push({ k });
      kalan -= h;
    });
    if (bekleyen.length) yeni();
    if (!cur.ogeler.length) sayfalar.pop();
  });

  const son = kitap.sonSayfalar || [];
  // Çift sayfa görünümünde son yaprak eksik kalmasın: toplam çift olsun.
  if ((sayfalar.length + son.length) % 2 === 1) sayfalar.push({ tip: 'bos' });
  son.forEach((tip) => sayfalar.push({ tip }));
  return { sayfalar, bolumSayfa };
}

/** Kitapta geçen bütün sureler (meal önyüklemesi için). */
export function kitaptakiSureler(kitap) {
  const out = [];
  kitap.bolumler.forEach((bol) => bol.bloklar.forEach((b) => { if (b.s) out.push(b.s); }));
  return out;
}
