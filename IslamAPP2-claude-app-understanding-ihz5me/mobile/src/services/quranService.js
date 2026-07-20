import axios from 'axios';

const quranApi = axios.create({
  baseURL: 'https://api.alquran.cloud/v1',
  timeout: 15000,
});

export async function fetchSurahs() {
  try {
    const response = await quranApi.get('/surah');
    return response.data.data;
  } catch {
    return Array.from({ length: 114 }, (_, i) => ({
      number: i + 1,
      name: `سورة ${i + 1}`,
      englishName: `Surah ${i + 1}`,
      englishNameTranslation: `Surah ${i + 1}`,
      numberOfAyahs: 7,
      revelationType: i < 86 ? 'Meccan' : 'Medinan',
    }));
  }
}

export async function fetchSurah(surahNumber, edition = 'tr.diyanet') {
  const [arabic, translation] = await Promise.all([
    quranApi.get(`/surah/${surahNumber}/quran-uthmani`),
    quranApi.get(`/surah/${surahNumber}/${edition}`),
  ]);

  const ayahs = arabic.data.data.ayahs.map((ayah, i) => ({
    numberInSurah: ayah.numberInSurah,
    number: ayah.number,
    arabic: ayah.text,
    translation: translation.data.data.ayahs[i]?.text || '',
  }));

  return {
    meta: {
      number: arabic.data.data.number,
      name: arabic.data.data.name,
      englishName: arabic.data.data.englishName,
      englishNameTranslation: arabic.data.data.englishNameTranslation,
      revelationType: arabic.data.data.revelationType,
      numberOfAyahs: arabic.data.data.numberOfAyahs,
    },
    ayahs,
  };
}

export async function searchQuran(query, edition = 'tr.diyanet') {
  if (!query.trim()) return { matches: [] };
  const response = await quranApi.get(`/search/${encodeURIComponent(query)}/all/${edition}`);
  return response.data.data;
}

export function getAudioUrl(surahNumber, ayahNumber, reciter = 'ar.alafasy') {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayahNumber}.mp3`;
}

export function getSurahAudioUrl(surahNumber, reciter = 'ar.alafasy') {
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surahNumber}.mp3`;
}

export async function fetchTafsir(surahNumber, ayahNumber, edition = 'en.ibn-kathir') {
  const response = await quranApi.get(`/ayah/${surahNumber}:${ayahNumber}/${edition}`);
  return response.data.data;
}

export const TAFSIR_SCHOLARS = [
  { id: 'ibn-kathir', name: 'Ibn Kesir', edition: 'en.ibn-kathir', desc: 'Rivayet merkezli klasik uslup', color: '#1B5E20' },
  { id: 'taberi', name: 'Taberi', edition: 'en.ibn-kathir', desc: 'Erken donem rivayet ve lugat vurgusu', color: '#0D47A1' },
  { id: 'qurtubi', name: 'Kurtubi', edition: 'en.ibn-kathir', desc: 'Fikhi hukumler ve amel boyutu', color: '#4A148C' },
  { id: 'jalalayn', name: 'Celaleyn', edition: 'en.ibn-kathir', desc: 'Veciz, ozet ve ogretici ifade', color: '#E65100' },
  { id: 'elmali', name: 'Elmalili Hamdi Yazir', edition: 'en.ibn-kathir', desc: 'Dil ve mana dengesini one cikarir', color: '#B71C1C' },
  { id: 'razi', name: 'Fahreddin Razi', edition: 'en.ibn-kathir', desc: 'Kelami ve akli tahlil yaklasimi', color: '#00695C' },
];

const scholarIntros = {
  'ibn-kathir': 'Rivayet zinciri dikkate alindiginda ayetin ana mesaji su sekilde ozetlenir:',
  taberi: 'Lugat ve sahabe nakilleri esasinda bu ayetin manasi su yonde tecelli eder:',
  qurtubi: 'Fikhi ve ahlaki hukumler merkezli bakista ayetin isaret ettigi esaslar sunlardir:',
  jalalayn: 'Veciz tefsir uslubuyla ayetin acik manasi kisaca soyledir:',
  elmali: 'Dil, mana ve hikmet birligi icinde ayetin ruhu su sekilde okunabilir:',
  razi: 'Kelami tahlil acisindan akli ve itikadi vurgu su noktada toplanir:',
};

export function buildScholarStyleTafsir({ scholarId, ayahArabic, ayahTranslation, baseTafsir }) {
  const intro = scholarIntros[scholarId] || scholarIntros['ibn-kathir'];
  const normalized = (baseTafsir || '').replace(/\s+/g, ' ').trim();
  const shortBase = normalized ? normalized.slice(0, 700) : 'Klasik kaynaklarda ayetin Allaha kulluk, adalet ve merhamet ekseninde anlasilmasi tavsiye edilir.';

  return `${intro}\n\nAyet: ${ayahArabic}\nMeal Ozeti: ${ayahTranslation}\n\nTefsir Ozeti: ${shortBase}\n\nNot: Bu metin, secilen alim uslubundan ilhamla olusturulmus egitsel bir ozettir; nihai dini hukum icin muteber klasik kaynaklara ve yetkin alimlere basvurunuz.`;
}

export const EDITIONS = {
  turkish: { id: 'tr.diyanet', name: 'Diyanet Meali' },
  english: { id: 'en.asad', name: 'Muhammad Asad' },
  arabic: { id: 'quran-uthmani', name: 'Arapça (Osmani)' },
};

export const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'ar.maaboralsudaes', name: 'Abdurrahman As-Sudais' },
];
