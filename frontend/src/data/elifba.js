// frontend/src/data/elifba.js
// 📖 ELİF BA — Kur'an okumaya sıfırdan başlangıç.
// 28 harf + harekeler + tenvin + cezm + med + şedde.
// Sesler cihazın Arapça Web Speech sesiyle okunur (varsa); yoksa
// harfin Türkçe okunuşu gösterilir. Hiçbir dış dosya/telif yoktur.

// Her harf: ar (izole glif), name (Türkçe adı), tr (okunuş/ses),
//           mahrec (çıkış yeri kısa açıklama), grup
export const LETTERS = [
  { ar: 'ا', name: 'Elif', tr: 'a / hemze taşıyıcı', mahrec: 'Ağzın boşluğundan; genelde uzatma harfidir', grup: 'temel' },
  { ar: 'ب', name: 'Be', tr: 'b', mahrec: 'İki dudağın birleşmesiyle', grup: 'temel' },
  { ar: 'ت', name: 'Te', tr: 't', mahrec: 'Dil ucu üst ön dişlerin diplerine', grup: 'temel' },
  { ar: 'ث', name: 'Se', tr: 'peltek s (th)', mahrec: 'Dil ucu üst dişlerin ucuna değer', grup: 'peltek' },
  { ar: 'ج', name: 'Cim', tr: 'c', mahrec: 'Dil ortası üst damağa', grup: 'temel' },
  { ar: 'ح', name: 'Ha', tr: 'boğaz h\'si (hâ)', mahrec: 'Boğazın ortasından, nefesli', grup: 'boğaz' },
  { ar: 'خ', name: 'Hı', tr: 'hırıltılı h', mahrec: 'Boğazın üst kısmından, hırıltılı', grup: 'boğaz' },
  { ar: 'د', name: 'Dal', tr: 'd', mahrec: 'Dil ucu üst ön dişlerin diplerine', grup: 'temel' },
  { ar: 'ذ', name: 'Zel', tr: 'peltek z', mahrec: 'Dil ucu üst dişlerin ucuna (İngilizce "the")', grup: 'peltek' },
  { ar: 'ر', name: 'Ra', tr: 'r', mahrec: 'Dil ucu üst damağa hafif titreşerek', grup: 'temel' },
  { ar: 'ز', name: 'Ze', tr: 'z', mahrec: 'Dil ucu alt ön dişlere yakın', grup: 'temel' },
  { ar: 'س', name: 'Sin', tr: 's', mahrec: 'Dil ucu alt ön dişlere', grup: 'temel' },
  { ar: 'ش', name: 'Şın', tr: 'ş', mahrec: 'Dil ortası üst damağa yayılarak', grup: 'temel' },
  { ar: 'ص', name: 'Sad', tr: 'kalın s', mahrec: 'Sin gibi ama dil kalınlaşır (tefhim)', grup: 'kalın' },
  { ar: 'ض', name: 'Dad', tr: 'kalın d', mahrec: 'Dilin yan kenarı üst azı dişlere (Arapçaya özgü)', grup: 'kalın' },
  { ar: 'ط', name: 'Tı', tr: 'kalın t', mahrec: 'Te gibi ama kalın ve vurgulu', grup: 'kalın' },
  { ar: 'ظ', name: 'Zı', tr: 'kalın peltek z', mahrec: 'Zel gibi ama kalın (tefhim)', grup: 'kalın' },
  { ar: 'ع', name: 'Ayn', tr: 'boğaz ayını', mahrec: 'Boğazın ortasından, kısılarak', grup: 'boğaz' },
  { ar: 'غ', name: 'Ğayn', tr: 'gırtlak ğ\'si', mahrec: 'Boğazın üst kısmından (gargara gibi)', grup: 'boğaz' },
  { ar: 'ف', name: 'Fe', tr: 'f', mahrec: 'Alt dudak üst ön dişlere', grup: 'temel' },
  { ar: 'ق', name: 'Kaf', tr: 'kalın k', mahrec: 'Dilin en arkası üst damağın gerisine', grup: 'kalın' },
  { ar: 'ك', name: 'Kef', tr: 'ince k', mahrec: 'Dil kökü üst damağa (kaf\'ın önünde)', grup: 'temel' },
  { ar: 'ل', name: 'Lam', tr: 'l', mahrec: 'Dil ucu üst ön damağa', grup: 'temel' },
  { ar: 'م', name: 'Mim', tr: 'm', mahrec: 'İki dudağın birleşmesiyle (genizden)', grup: 'temel' },
  { ar: 'ن', name: 'Nun', tr: 'n', mahrec: 'Dil ucu üst ön damağa (genizden)', grup: 'temel' },
  { ar: 'ه', name: 'He', tr: 'nefesli h', mahrec: 'Boğazın en dibinden, ince nefesli', grup: 'boğaz' },
  { ar: 'و', name: 'Vav', tr: 'v / uzun u', mahrec: 'İki dudak yuvarlanarak', grup: 'temel' },
  { ar: 'ي', name: 'Ye', tr: 'y / uzun i', mahrec: 'Dil ortası üst damağa', grup: 'temel' },
];

// Harekeler (sesli işaretler) — birleştirici işaretler taşıyıcı harfe eklenir
export const HAREKELER = [
  { id: 'ustun', name: 'Üstün (Fetha)', mark: 'َ', sound: 'e / a', desc: 'Harfin üstüne konur, "e/a" sesi verir', ex: [
    { ar: 'بَ', read: 'be' }, { ar: 'تَ', read: 'te' }, { ar: 'دَ', read: 'de' }, { ar: 'رَ', read: 're' },
  ] },
  { id: 'esre', name: 'Esre (Kesra)', mark: 'ِ', sound: 'i', desc: 'Harfin altına konur, "i" sesi verir', ex: [
    { ar: 'بِ', read: 'bi' }, { ar: 'تِ', read: 'ti' }, { ar: 'دِ', read: 'di' }, { ar: 'رِ', read: 'ri' },
  ] },
  { id: 'otre', name: 'Ötre (Damma)', mark: 'ُ', sound: 'u / ü', desc: 'Harfin üstüne konur, "u/ü" sesi verir', ex: [
    { ar: 'بُ', read: 'bu' }, { ar: 'تُ', read: 'tu' }, { ar: 'دُ', read: 'du' }, { ar: 'رُ', read: 'ru' },
  ] },
];

// Tenvin (çift hareke) — sonuna "n" sesi ekler
export const TENVIN = [
  { id: 'fethateyn', name: 'İki Üstün (Fethateyn)', sound: 'en / an', ex: [{ ar: 'بًا', read: 'ben' }, { ar: 'تًا', read: 'ten' }] },
  { id: 'kesrateyn', name: 'İki Esre (Kesrateyn)', sound: 'in', ex: [{ ar: 'بٍ', read: 'bin' }, { ar: 'تٍ', read: 'tin' }] },
  { id: 'damteyn', name: 'İki Ötre (Dammeteyn)', sound: 'un / ün', ex: [{ ar: 'بٌ', read: 'bun' }, { ar: 'تٌ', read: 'tun' }] },
];

// İleri konular
export const ILERI = [
  { id: 'cezm', name: 'Cezm (Sükûn)', mark: 'ْ', desc: 'Harfin üstüne konan küçük dairedir; harf sessiz (harekesiz) okunur, önceki sesle birleşir.', ex: [{ ar: 'أَبْ', read: 'eb' }, { ar: 'مِنْ', read: 'min' }, { ar: 'قُلْ', read: 'kul' }] },
  { id: 'sedde', name: 'Şedde (Teşdid)', mark: 'ّ', desc: 'Harfin üstüne konur; harf iki kez okunuyormuş gibi vurgulanır (biri cezimli, biri harekeli).', ex: [{ ar: 'رَبَّ', read: 'rab-be' }, { ar: 'إِنَّ', read: 'in-ne' }] },
  { id: 'med', name: 'Med (Uzatma)', mark: 'ٓ', desc: 'Elif, vav ve ye harfleri kendinden önceki harekeyi uzatır: üstün+elif "aa", esre+ye "ii", ötre+vav "uu".', ex: [{ ar: 'قَا', read: 'kaa' }, { ar: 'رِي', read: 'rii' }, { ar: 'نُو', read: 'nuu' }] },
];

// Kutlanacak birleşik kelime örnekleri (öğrenilenlerin pekişmesi)
export const KELIMELER = [
  { ar: 'رَبّ', read: 'Rab', mean: 'Rab, terbiye eden' },
  { ar: 'نُور', read: 'Nûr', mean: 'Işık, nur' },
  { ar: 'صَبْر', read: 'Sabr', mean: 'Sabır' },
  { ar: 'قَلْب', read: 'Kalb', mean: 'Kalp' },
  { ar: 'كِتَاب', read: 'Kitâb', mean: 'Kitap' },
  { ar: 'سَلَام', read: 'Selâm', mean: 'Selam, esenlik' },
  { ar: 'رَحْمَة', read: 'Rahme(t)', mean: 'Rahmet, merhamet' },
  { ar: 'جَنَّة', read: 'Cenne(t)', mean: 'Cennet, bahçe' },
  { ar: 'دُعَاء', read: 'Duâ', mean: 'Dua, yakarış' },
  { ar: 'عِلْم', read: 'İlm', mean: 'İlim, bilgi' },
  { ar: 'اِيمَان', read: 'Îmân', mean: 'İman, inanç' },
  { ar: 'شُكْر', read: 'Şükr', mean: 'Şükür' },
];

// 🎵 TECVİDE GİRİŞ — Kur'an'ı güzel okumanın temel kuralları.
// Standart, üzerinde ittifak edilen tecvid bilgileridir; 'ileri' vitrin
// yapısıyla aynı formatta sunulur: { id, name, sound?, desc, ex[] }.
export const TECVID = [
  {
    id: 'kalkale', name: 'Kalkale', sound: 'ق ط ب ج د',
    desc: 'Bu beş harf (toplayıcısı: "kutbu ced") cezimli/sakin olduğunda, ses hafifçe geri sıçratılarak vurgulu okunur.',
    ex: [
      { ar: 'قَدْ', read: 'kad (sıçratmalı)' },
      { ar: 'اَحَدْ', read: 'ehad' },
      { ar: 'وَتَبْ', read: 'veteb' },
    ],
  },
  {
    id: 'tefhim', name: 'Kalın Okunan Harfler (Tefhîm)', sound: 'خ ص ض غ ط ق ظ',
    desc: 'Bu yedi harf her zaman kalın (dolgun) okunur; Arapça toplayıcısı: خُصَّ ضَغْطٍ قِظْ. Diğer harfler ince okunur (Ra ve Lâm bazı durumlarda değişir).',
    ex: [
      { ar: 'خَلَقَ', read: 'halaka' },
      { ar: 'صِرَاط', read: 'sırât' },
      { ar: 'عَظِيم', read: 'azîm' },
    ],
  },
  {
    id: 'nun-sakin', name: 'Nûn-i Sâkin ve Tenvin', sound: 'نْ / ً ٍ ٌ',
    desc: 'Cezimli nûn veya tenvinden SONRA gelen harfe göre dört okuyuş vardır: İZHÂR (boğaz harfleri ء ه ع ح غ خ → nun açıkça okunur), İDGAM (ي ر م ل و ن → nun sonrakine katılır), İKLÂB (ب → nun "m" sesine döner), İHFÂ (kalan 15 harf → nun genizden gizlenerek okunur).',
    ex: [
      { ar: 'مِنْ عِلْمٍ', read: 'izhâr: min ılmin' },
      { ar: 'مَنْ يَقُولُ', read: 'idgam: mey-yekûlü' },
      { ar: 'مِنْ بَعْدِ', read: "iklâb: mim-ba'di" },
      { ar: 'مِنْ قَبْلُ', read: 'ihfâ: min(n)-kablü' },
    ],
  },
  {
    id: 'mim-sakin', name: 'Mîm-i Sâkin', sound: 'مْ',
    desc: 'Cezimli mîmden sonra ب gelirse dudak ihfâsı (hafif gizleme), م gelirse idgam (katma), diğer harflerde izhâr (açık okuma) yapılır.',
    ex: [
      { ar: 'هُمْ فِيهَا', read: 'izhâr: hüm fîhâ' },
      { ar: 'لَهُمْ مَا', read: 'idgam: lehüm-mâ' },
    ],
  },
];

// Dersler (modül yapısı) — her ders bir kart, tamamlanınca XP
export const DERSLER = [
  { id: 'harfler', title: 'Harfler', emoji: '🔤', desc: '28 harfi tanı: şekli, adı, sesi', color: '#10B981', type: 'letters' },
  { id: 'harekeler', title: 'Harekeler', emoji: '◌َ', desc: 'Üstün, esre, ötre — sesli işaretler', color: '#3B82F6', type: 'harekeler' },
  { id: 'tenvin', title: 'Tenvin', emoji: 'ً', desc: 'Çift harekeler: en, in, un sesleri', color: '#8B5CF6', type: 'tenvin' },
  { id: 'ileri', title: 'Cezm · Şedde · Med', emoji: '◌ّ', desc: 'Sükûn, şedde ve uzatma kuralları', color: '#F59E0B', type: 'ileri' },
  { id: 'kelimeler', title: 'İlk Kelimeler', emoji: '✨', desc: 'Öğrendiklerinle ilk kelimeleri oku', color: '#EC4899', type: 'kelimeler' },
  { id: 'tecvid', title: 'Tecvide Giriş', emoji: '🎵', desc: 'Kalkale, kalın harfler, nûn-i sâkin kuralları', color: '#06B6D4', type: 'tecvid' },
  { id: 'sinav', title: 'Alıştırma', emoji: '🎯', desc: 'Harfi tanı, sesini eşleştir', color: '#EF4444', type: 'quiz' },
];

// ── İngilizce içerik katmanı ──
import { LETTER_EN, HAREKE_EN, TENVIN_EN, ILERI_EN, KELIME_EN, TECVID_EN, DERS_EN } from './elifba.en';
LETTERS.forEach((l) => { if (LETTER_EN[l.ar]) l.en = LETTER_EN[l.ar]; });
HAREKELER.forEach((h) => { if (HAREKE_EN[h.id]) h.en = HAREKE_EN[h.id]; });
TENVIN.forEach((t) => { if (TENVIN_EN[t.id]) t.en = TENVIN_EN[t.id]; });
ILERI.forEach((i) => { if (ILERI_EN[i.id]) i.en = ILERI_EN[i.id]; });
KELIMELER.forEach((k) => { if (KELIME_EN[k.ar]) k.en = { mean: KELIME_EN[k.ar] }; });
TECVID.forEach((t) => {
  const e = TECVID_EN[t.id];
  if (!e) return;
  t.en = { name: e.name, desc: e.desc, ex: (t.ex || []).map((x, i) => ({ ...x, read: (e.ex && e.ex[i]) || x.read })) };
});
DERSLER.forEach((d) => { if (DERS_EN[d.id]) d.en = DERS_EN[d.id]; });

export default LETTERS;
