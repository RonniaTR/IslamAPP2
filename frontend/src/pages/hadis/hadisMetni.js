// 📜 HADİS METNİ YARDIMCILARI
//  • ayikla(h): Arapça metni SENED (râvi zinciri) ve METİN (Efendimizin sözü) olarak ayırır; Türkçe metinden râvi
//    girişini, asıl sözü ve tahrîc notunu (Tekrar / Diğer Tahric) çıkarır. Kaynak verinin kendisi DEĞİŞMEZ;
//    yalnız okunurluk için bölümlenir.
//  • okunus(ar, dil): harekeli Arapçadan otomatik Latin harfli okunuş (yaklaşık; yabancılar ve Arapça okumayanlar için).

const RLM = /[‎‏‪-‮]/g;
const TIRNAK = /["“”«»]/;

function temizAr(s) {
  return (s || '').replace(RLM, '').replace(/\s+/g, ' ').replace(/ ([،,.:؛])/g, '$1').trim();
}

const SAV_RE = /\(?\s*(Sallallahu|Sallallâhu)\s+(Aleyhi|aleyhi)\s+(ve|Ve)\s+(Sellem|sellem)\s*\)?/g;

export function ayikla(h) {
  const ar = temizAr(h.arabic);
  let sened = '';
  let metin = ar;
  const i = ar.search(TIRNAK);
  if (i > 20) {
    sened = ar.slice(0, i).trim();
    metin = ar.slice(i).replace(/^["“«]\s*/, '');
    // son tırnaktan sonra kalan kısa ekler (‏.‏ vb.) silinir; uzun ek varsa (devam eden rivayet) korunur
    const son = metin.search(/["”»][^"”»]*$/);
    if (son > 0 && metin.length - son < 60) metin = metin.slice(0, son);
    metin = metin.replace(/["“”«»]/g, '').trim();
  } else {
    const isaret = ar.search(/(عَنِ النَّبِيِّ|رَسُولَ اللَّهِ|رَسُولُ اللَّهِ)\s*(صلى الله عليه وسلم|صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ)/);
    if (isaret > 20) {
      const kes = ar.indexOf(' ', ar.indexOf('وسلم', isaret) + 3);
      if (kes > 0) { sened = ar.slice(0, kes).trim(); metin = ar.slice(kes).trim(); }
    }
  }

  let tr = (h.turkish || '').replace(/\s+/g, ' ').trim();
  let tahric = '';
  const t1 = tr.search(/\s(Tekrar|Diğer Tahric|Diğer tahric)\s*:/);
  if (t1 > 0) { tahric = tr.slice(t1).trim(); tr = tr.slice(0, t1).trim(); }
  tr = tr.replace(SAV_RE, ' (s.a.v.)').replace(/\s+\(s\.a\.v\.\)/g, ' (s.a.v.)').replace(/\s+/g, ' ');
  let ravi = '';
  let soz = tr;
  const tq = tr.search(/["“]/);
  if (tq > 0 && tq < tr.length * 0.6 && /:\s*$/.test(tr.slice(0, tq))) {
    // Râvi girişi ve aktarım cümleleri ("…'den: … şöyle dediğini duydum:") ayrı satıra; asıl söz tırnağın içinden
    ravi = tr.slice(0, tq).replace(/:\s*$/, '').trim();
    soz = tr.slice(tq + 1).trim();
  } else {
    const iki = tr.indexOf(':');
    if (iki > 0 && iki < 160 && /('den|'dan|demiştir|nakledilmiştir|aktarmıştır|rivayet|dedi|şöyle)/i.test(tr.slice(0, iki + 1))) {
      ravi = tr.slice(0, iki).trim();
      soz = tr.slice(iki + 1).trim();
    }
  }
  soz = soz.replace(/^["“'‘]+/, '').replace(/["”'’]+\.?$/, '').trim();
  return { sened, metin, ravi, soz, tahric };
}

/** Kısa önizleme: sözün ilk cümleleri. */
export function ozet(soz, n = 180) {
  if (!soz || soz.length <= n) return soz;
  const kes = soz.lastIndexOf(' ', n);
  return `${soz.slice(0, kes > 60 ? kes : n)}…`;
}

// ─────────────── OKUNUŞ (transliterasyon) ───────────────
const FATHA = 'َ'; const KASRA = 'ِ'; const DAMMA = 'ُ';
const SUKUN = 'ْ'; const SHADDA = 'ّ';
const TAN_F = 'ً'; const TAN_D = 'ٌ'; const TAN_K = 'ٍ';
const DAGGER = 'ٰ';
const HAREKE = new Set([FATHA, KASRA, DAMMA, SUKUN, SHADDA, TAN_F, TAN_D, TAN_K, DAGGER, 'ٓ', 'ٔ', 'ٕ']);
const GUNES = new Set('تثدذرزسشصضطظلن'.split(''));

const HARF_TR = {
  'ب': 'b', 'ت': 't', 'ث': 's', 'ج': 'c', 'ح': 'h', 'خ': 'h', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'ş',
  'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': '‘', 'غ': 'ğ', 'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'v', 'ي': 'y', 'ء': '’', 'أ': '’', 'إ': '’', 'ؤ': '’', 'ئ': '’', 'ة': 't', 'ى': 'â', 'ا': 'a', 'آ': '’â', 'ٱ': '',
};
const HARF_EN = {
  ...HARF_TR, 'ث': 'th', 'ج': 'j', 'خ': 'kh', 'ذ': 'dh', 'ش': 'sh', 'غ': 'gh', 'ق': 'q', 'و': 'w', 'ى': 'ā', 'آ': '’ā',
};
const UZUN = { tr: { a: 'â', i: 'î', u: 'û' }, en: { a: 'ā', i: 'ī', u: 'ū' } };

const KALIN = new Set('حخصضطظعغقر'.split(''));
const ONEK = new Set(['و', 'ف', 'ب', 'ل', 'ك']);

function kelimeOku(k, dil, ilk) {
  const H = dil === 'en' ? HARF_EN : HARF_TR;
  const U = UZUN[dil === 'en' ? 'en' : 'tr'];
  const harf = []; // { h, hr: [harekeler] }
  for (const ch of k) {
    if (HAREKE.has(ch)) { if (harf.length) harf[harf.length - 1].hr.push(ch); }
    else harf.push({ h: ch, hr: [] });
  }
  const yalin = harf.map((x) => x.h).join('');
  // "Allah" lafzı (önekli hâlleriyle): Allâhu, billâhi, lillâhi, vallâhu
  const lafz = yalin.match(/^([وفبل])?ا?لله$/) || yalin.match(/^([وفبل])?ٱ?لله$/);
  if (lafz) {
    const son = harf[harf.length - 1].hr;
    const v = son.includes(DAMMA) ? 'u' : son.includes(KASRA) ? 'i' : son.includes(FATHA) ? 'a' : '';
    const onek = lafz[1] ? ({ 'و': dil === 'en' ? 'wa' : 've', 'ف': dil === 'en' ? 'fa' : 'fe', 'ب': 'bi', 'ل': 'li' })[lafz[1]] : '';
    if (onek) return `${onek}${onek.endsWith('i') ? '' : ''}llâh${v}`.replace('â', U.a);
    return `${ilk ? 'Allâh' : 'llâh'}${v}`.replace('â', U.a);
  }
  const fatha = (cons) => (dil === 'en' || KALIN.has(cons) ? 'a' : 'e');
  let out = '';
  for (let i = 0; i < harf.length; i += 1) {
    const { h, hr } = harf[i];
    const onceki = harf[i - 1];
    const sonraki = harf[i + 1];
    const sesli = hr.includes(FATHA) ? 'a' : hr.includes(KASRA) ? 'i' : hr.includes(DAMMA) ? 'u' : '';
    // Harf-i tarif (el-): kelime başında ya da bir önekten sonra
    const tarifYeri = i === 0 || (i === 1 && ONEK.has(harf[0].h));
    if ((h === 'ا' || h === 'ٱ') && tarifYeri && !sesli && sonraki && sonraki.h === 'ل' && harf.length > i + 2) {
      const ucuncu = harf[i + 2];
      const gunes = ucuncu && GUNES.has(ucuncu.h) && ucuncu.hr.includes(SHADDA);
      if (i === 0) out += gunes ? (dil === 'en' ? 'a' : 'e') : (dil === 'en' ? 'al-' : 'el-');
      else if (!gunes) out += 'l-';
      i += 1; continue;
    }
    // Tenvinli elif (…an) ve uzatmalar
    if (h === 'ا' && onceki && onceki.hr.includes(TAN_F)) continue;
    if (h === 'ا' && onceki) { out = out.replace(/[ae]$/, '') + U.a; continue; }
    if (h === 'ى' && onceki && !hr.length) { out = out.replace(/[ae]$/, '') + U.a; continue; }
    if (h === 'و' && onceki && !sesli && !hr.includes(SHADDA) && onceki.hr.includes(DAMMA)) { out = out.replace(/u$/, '') + U.u; continue; }
    if ((h === 'ي' || h === 'ى') && onceki && !sesli && !hr.includes(SHADDA) && onceki.hr.includes(KASRA)) { out = out.replace(/i$/, '') + U.i; continue; }
    if (h === 'ة') { out += sonraki ? 't' : (hr.length ? 't' : 'h'); }
    else {
      let c = (h === 'ى' ? H['ي'] : H[h]);
      if (c === undefined) continue; // tanınmayan işaret
      // Hemze: kelime başında ya da önekten hemen sonra yazılmaz (ve innemâ, fe’e değil)
      if (c === '’' && (out === '' || /-$/.test(out) || (i === 1 && ONEK.has(harf[0].h)))) c = '';
      if (hr.includes(SHADDA)) c = c + c;
      out += c;
    }
    if (hr.includes(DAGGER)) out += U.a;
    else if (hr.includes(TAN_F)) out += dil === 'en' ? 'an' : `${fatha(h)}n`;
    else if (hr.includes(TAN_D)) out += 'un';
    else if (hr.includes(TAN_K)) out += 'in';
    else if (sesli) out += sesli === 'a' ? fatha(h) : sesli;
  }
  return out.replace(/^’/, '');
}

/** Harekeli Arapça metni Latin harfli okunuşa çevirir (yaklaşık). */
export function okunus(ar, dil = 'tr') {
  if (!ar) return '';
  const temiz = temizAr(ar).replace(/صلى الله عليه وسلم/g, 'صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ');
  return temiz.split(' ').map((kelime, i) => {
    const nok = (kelime.match(/[،,.:؛؟!]+$/) || [''])[0];
    const govde = kelime.slice(0, kelime.length - nok.length);
    const o = kelimeOku(govde, dil, true);
    const n = nok.replace(/،/g, ',').replace(/؛/g, ';').replace(/؟/g, '?');
    return i === 0 ? o.charAt(0).toLocaleUpperCase('tr') + o.slice(1) + n : o + n;
  }).join(' ').replace(/\s+/g, ' ').trim();
}
