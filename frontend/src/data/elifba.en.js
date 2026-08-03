// frontend/src/data/elifba.en.js
// 📖 ELIF BA — English overlay for elifba.js.
// Letter names (Elif, Be, ...) stay as transliterations; `tr` (sound) and
// `mahrec` (articulation point) get English equivalents. Keyed by Arabic glyph
// for letters and by `id` for the other groups.

export const LETTER_EN = {
  'ا': { tr: 'a / hamza carrier', mahrec: 'From the cavity of the mouth; usually a lengthening letter' },
  'ب': { tr: 'b', mahrec: 'By closing the two lips' },
  'ت': { tr: 't', mahrec: 'Tip of the tongue to the roots of the upper front teeth' },
  'ث': { tr: 'th (soft)', mahrec: 'Tip of the tongue touches the edge of the upper teeth' },
  'ج': { tr: 'j', mahrec: 'Middle of the tongue to the upper palate' },
  'ح': { tr: 'throat h (ḥā)', mahrec: 'From the middle of the throat, with breath' },
  'خ': { tr: 'raspy kh', mahrec: 'From the upper part of the throat, raspy' },
  'د': { tr: 'd', mahrec: 'Tip of the tongue to the roots of the upper front teeth' },
  'ذ': { tr: 'soft dh', mahrec: 'Tip of the tongue to the edge of the upper teeth (English "the")' },
  'ر': { tr: 'r', mahrec: 'Tip of the tongue to the upper palate with a slight trill' },
  'ز': { tr: 'z', mahrec: 'Tip of the tongue near the lower front teeth' },
  'س': { tr: 's', mahrec: 'Tip of the tongue to the lower front teeth' },
  'ش': { tr: 'sh', mahrec: 'Middle of the tongue spreading to the upper palate' },
  'ص': { tr: 'heavy s', mahrec: 'Like sīn but the tongue thickens (tafkhīm)' },
  'ض': { tr: 'heavy d', mahrec: 'Side edge of the tongue to the upper molars (unique to Arabic)' },
  'ط': { tr: 'heavy t', mahrec: 'Like tā but heavy and emphatic' },
  'ظ': { tr: 'heavy dh', mahrec: 'Like dhāl but heavy (tafkhīm)' },
  'ع': { tr: 'throat ʿayn', mahrec: 'From the middle of the throat, constricted' },
  'غ': { tr: 'guttural gh', mahrec: 'From the upper part of the throat (like gargling)' },
  'ف': { tr: 'f', mahrec: 'Lower lip to the upper front teeth' },
  'ق': { tr: 'heavy q', mahrec: 'Rearmost part of the tongue to the back of the palate' },
  'ك': { tr: 'light k', mahrec: 'Base of the tongue to the palate (just before qāf)' },
  'ل': { tr: 'l', mahrec: 'Tip of the tongue to the front upper palate' },
  'م': { tr: 'm', mahrec: 'By closing the two lips (nasal)' },
  'ن': { tr: 'n', mahrec: 'Tip of the tongue to the front upper palate (nasal)' },
  'ه': { tr: 'breathy h', mahrec: 'From the deepest part of the throat, light and breathy' },
  'و': { tr: 'w / long ū', mahrec: 'By rounding the two lips' },
  'ي': { tr: 'y / long ī', mahrec: 'Middle of the tongue to the palate' },
};

export const HAREKE_EN = {
  ustun: { name: 'Fatḥa (Ustun)', sound: 'e / a', desc: 'Placed above the letter, gives an "e/a" sound' },
  esre: { name: 'Kasra (Esre)', sound: 'i', desc: 'Placed below the letter, gives an "i" sound' },
  otre: { name: 'Ḍamma (Otre)', sound: 'u / ū', desc: 'Placed above the letter, gives a "u" sound' },
};

export const TENVIN_EN = {
  fethateyn: { name: 'Double Fatḥa (Fatḥatayn)', sound: 'an' },
  kesrateyn: { name: 'Double Kasra (Kasratayn)', sound: 'in' },
  damteyn: { name: 'Double Ḍamma (Ḍammatayn)', sound: 'un' },
};

export const ILERI_EN = {
  cezm: { name: 'Sukūn (Jazm)', desc: 'A small circle placed above the letter; the letter is read without a vowel and joins the preceding sound.' },
  sedde: { name: 'Shadda (Tashdīd)', desc: 'Placed above the letter; the letter is emphasized as if read twice (one silent, one voweled).' },
  med: { name: 'Madd (Lengthening)', desc: 'The letters alif, wāw and yāʾ lengthen the preceding vowel: fatḥa+alif "ā", kasra+yāʾ "ī", ḍamma+wāw "ū".' },
};

export const KELIME_EN = {
  'رَبّ': 'Lord, the One who nurtures',
  'نُور': 'Light, radiance',
  'صَبْر': 'Patience',
  'قَلْب': 'Heart',
  'كِتَاب': 'Book',
  'سَلَام': 'Peace, well-being',
  'رَحْمَة': 'Mercy, compassion',
  'جَنَّة': 'Paradise, garden',
  'دُعَاء': 'Supplication, calling upon',
  'عِلْم': 'Knowledge',
  'اِيمَان': 'Faith, belief',
  'شُكْر': 'Gratitude',
};

export const TECVID_EN = {
  kalkale: {
    name: 'Qalqala',
    desc: 'When these five letters (mnemonic: "quṭb jad") carry a sukūn, the sound is read with a slight emphatic bounce.',
    ex: ['qad (with a bounce)', 'aḥad', 'watab'],
  },
  tefhim: {
    name: 'Heavy Letters (Tafkhīm)',
    desc: 'These seven letters are always read heavy (full-bodied); the Arabic mnemonic is خُصَّ ضَغْطٍ قِظْ. The rest are read light (rāʾ and lām change in some cases).',
    ex: ['khalaqa', 'ṣirāṭ', 'ʿaẓīm'],
  },
  'nun-sakin': {
    name: 'Silent Nūn and Tanwīn',
    desc: 'There are four readings depending on the letter that FOLLOWS a silent nūn or tanwīn: IẒHĀR (throat letters ء ه ع ح غ خ → the nūn is pronounced clearly), IDGHĀM (ي ر م ل و ن → the nūn merges into the next), IQLĀB (ب → the nūn turns into an "m" sound), IKHFĀʾ (the remaining 15 letters → the nūn is hidden nasally).',
    ex: ['iẓhār: min ʿilmin', 'idghām: may-yaqūlu', "iqlāb: mim-baʿdi", 'ikhfāʾ: min(n)-qablu'],
  },
  'mim-sakin': {
    name: 'Silent Mīm',
    desc: 'If ب follows a silent mīm, labial ikhfāʾ (light hiding) applies; if م follows, idghām (merging); with other letters, iẓhār (clear pronunciation).',
    ex: ['iẓhār: hum fīhā', 'idghām: lahum-mā'],
  },
};

export const DERS_EN = {
  harfler: { title: 'Letters', desc: 'Learn all 28 letters: shape, name, sound' },
  harekeler: { title: 'Vowel Marks', desc: 'Fatḥa, kasra, ḍamma — the vowel signs' },
  tenvin: { title: 'Tanwīn', desc: 'Double vowels: an, in, un sounds' },
  ileri: { title: 'Sukūn · Shadda · Madd', desc: 'Rules of sukūn, shadda and lengthening' },
  kelimeler: { title: 'First Words', desc: 'Read your first words with what you learned' },
  tecvid: { title: 'Intro to Tajwīd', desc: 'Qalqala, heavy letters, silent nūn rules' },
  sinav: { title: 'Practice', desc: 'Recognize the letter, match the sound' },
};

export default LETTER_EN;
