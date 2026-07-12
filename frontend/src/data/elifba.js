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
];

// Dersler (modül yapısı) — her ders bir kart, tamamlanınca XP
export const DERSLER = [
  { id: 'harfler', title: 'Harfler', emoji: '🔤', desc: '28 harfi tanı: şekli, adı, sesi', color: '#10B981', type: 'letters' },
  { id: 'harekeler', title: 'Harekeler', emoji: '◌َ', desc: 'Üstün, esre, ötre — sesli işaretler', color: '#3B82F6', type: 'harekeler' },
  { id: 'tenvin', title: 'Tenvin', emoji: 'ً', desc: 'Çift harekeler: en, in, un sesleri', color: '#8B5CF6', type: 'tenvin' },
  { id: 'ileri', title: 'Cezm · Şedde · Med', emoji: '◌ّ', desc: 'Sükûn, şedde ve uzatma kuralları', color: '#F59E0B', type: 'ileri' },
  { id: 'kelimeler', title: 'İlk Kelimeler', emoji: '✨', desc: 'Öğrendiklerinle ilk kelimeleri oku', color: '#EC4899', type: 'kelimeler' },
  { id: 'sinav', title: 'Alıştırma', emoji: '🎯', desc: 'Harfi tanı, sesini eşleştir', color: '#EF4444', type: 'quiz' },
];

export default LETTERS;
