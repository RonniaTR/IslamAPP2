// 🎙️ Okuyucu komutları — sesle ya da yazarak: "geç", "beş sayfa geç", "on sayfa geri", "yirmi üçüncü sayfaya git",
// "başa dön", "içindekiler", "oku", "dur". Sayılar rakamla da söylenebilir: "5 ileri", "sayfa 40".

const BIRLER = { bir: 1, iki: 2, üç: 3, uc: 3, dört: 4, dort: 4, beş: 5, bes: 5, altı: 6, alti: 6, yedi: 7, sekiz: 8, dokuz: 9 };
const ONLAR = { on: 10, yirmi: 20, otuz: 30, kırk: 40, kirk: 40, elli: 50, altmış: 60, altmis: 60, yetmiş: 70, yetmis: 70, seksen: 80, doksan: 90 };
const YUZ = { yüz: 100, yuz: 100 };

/** Sıra eklerini atar: "beşinci" → "beş", "onuncu" → "on", "üçüncü" → "üç". */
function kok(k) {
  return k
    .replace(/(ı|i|u|ü)?(n)?c[ıiuü]$/u, '')       // -(i)nci / -ncı / -uncu ...
    .replace(/['’]?(a|e|ya|ye|ı|i|u|ü|yı|yi|yu|yü|da|de|ta|te|dan|den|tan|ten)$/u, '');
}

function kelimeSayi(k) {
  if (/^\d+/.test(k)) return parseInt(k, 10);
  const adaylar = [k, kok(k)];
  for (const a of adaylar) {
    if (a in BIRLER) return BIRLER[a];
    if (a in ONLAR) return ONLAR[a];
    if (a in YUZ) return YUZ[a];
  }
  // "dördüncü" → "dörd" gibi ünsüz yumuşaması
  const yumusak = kok(k).replace(/d$/u, 't').replace(/ğ$/u, 'k');
  if (yumusak in BIRLER) return BIRLER[yumusak];
  if (yumusak === 'dört') return 4;
  return null;
}

/** Metindeki ilk sayı öbeğini bulur: "yirmi üç" → 23, "yüz on iki" → 112. */
export function sayiBul(metin) {
  const kelimeler = metin.toLocaleLowerCase('tr-TR').replace(/[.,!?]/g, ' ').split(/\s+/).filter(Boolean);
  let toplam = null;
  let basladi = false;
  for (const k of kelimeler) {
    const n = kelimeSayi(k);
    if (n === null) { if (basladi) break; continue; }
    basladi = true;
    if (n === 100) toplam = (toplam || 1) * 100;
    else toplam = (toplam || 0) + n;
    if (/^\d+/.test(k)) break;
  }
  return toplam;
}

/**
 * @returns {{tur:'ileri'|'geri'|'git'|'bas'|'son'|'icindekiler'|'oku'|'dur'|'ayrac', n?:number} | null}
 */
export function komutCoz(ham) {
  if (!ham) return null;
  const m = ham.toLocaleLowerCase('tr-TR').trim();
  const n = sayiBul(m);

  if (/(içindekiler|icindekiler|fihrist)/u.test(m)) return { tur: 'icindekiler' };
  if (/(ayraç|ayrac|işaretle|isaretle)/u.test(m)) return { tur: 'ayrac' };
  if (/\b(dur|sus|durdur|kes)\b/u.test(m)) return { tur: 'dur' };
  if (/\b(oku|dinle|sesli)\b/u.test(m) && !/sayfa/u.test(m)) return { tur: 'oku' };
  if (/(başa|basa|kapağa|kapaga|en baş|baştan|bastan)/u.test(m)) return { tur: 'bas' };
  if (/(sona|en son|son sayfa|bitir)/u.test(m)) return { tur: 'son' };

  const geri = /(geri|önceki|onceki|evvelki|dön|don)/u.test(m);
  const ileri = /(ileri|geç|gec|sonraki|çevir|cevir|atla|devam)/u.test(m);
  if (geri) return { tur: 'geri', n: n || 1 };
  if (ileri) return { tur: 'ileri', n: n || 1 };
  if (n && /(sayfa|git|aç|ac)/u.test(m)) return { tur: 'git', n };
  if (n && /^\d+$/.test(m)) return { tur: 'git', n };
  return null;
}

export function komutAciklama(k, toplam) {
  if (!k) return 'Anlaşılamadı. Örnek: "beş sayfa geç", "geri", "40. sayfa".';
  switch (k.tur) {
    case 'ileri': return k.n > 1 ? `${k.n} sayfa ileri` : 'Sonraki sayfa';
    case 'geri': return k.n > 1 ? `${k.n} sayfa geri` : 'Önceki sayfa';
    case 'git': return `${Math.min(k.n, toplam)}. sayfaya`;
    case 'bas': return 'Kapağa dönülüyor';
    case 'son': return 'Son sayfaya';
    case 'icindekiler': return 'İçindekiler';
    case 'oku': return 'Sesli okuma başlıyor';
    case 'dur': return 'Durduruldu';
    case 'ayrac': return 'Ayraç';
    default: return '';
  }
}
