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

// ─── MEAL: QuranEnc.com ───
// Yeniden yayın şartları (frontend/src/data/sources.json → quranEncSartlari):
// metin değiştirilmez · yayıncı, kaynak ve sürüm gösterilir · uygunsuz reklam olmaz.
// Web ile aynı çeviri anahtarları kullanılır; değişirse iki yer birlikte güncellenir.
export const MEAL_SOURCES = {
  tr: { key: 'turkish_rwwad', name: 'Türkçe Tercüme — Rowad Tercüme Merkezi', source: 'QuranEnc.com', version: '1.0.4' },
  en: { key: 'english_rwwad', name: 'English Translation — Rowwad Translation Center', source: 'QuranEnc.com', version: '1.0.19' },
};

const quranEnc = axios.create({ baseURL: 'https://quranenc.com/api/v1', timeout: 15000 });

export function mealCredit(lang = 'tr') {
  const m = MEAL_SOURCES[lang] || MEAL_SOURCES.tr;
  return `${m.name} · ${m.source} · v${m.version}`;
}

export async function fetchSurah(surahNumber, lang = 'tr') {
  const src = MEAL_SOURCES[lang] || MEAL_SOURCES.tr;
  const [arabic, meal] = await Promise.all([
    quranApi.get(`/surah/${surahNumber}/quran-uthmani`),
    // Meal alınamazsa sure yine açılır; uydurma metin konmaz.
    quranEnc.get(`/translation/sura/${src.key}/${surahNumber}`).catch(() => null),
  ]);
  const rows = meal?.data?.result || [];
  const byAya = new Map(rows.map((r) => [Number(r.aya), r]));

  const ayahs = arabic.data.data.ayahs.map((ayah) => ({
    numberInSurah: ayah.numberInSurah,
    number: ayah.number,
    arabic: ayah.text,
    // Çeviri metni olduğu gibi gösterilir.
    translation: byAya.get(ayah.numberInSurah)?.translation || '',
    footnotes: byAya.get(ayah.numberInSurah)?.footnotes || '',
  }));

  return {
    meta: {
      number: arabic.data.data.number,
      name: arabic.data.data.name,
      englishName: arabic.data.data.englishName,
      englishNameTranslation: arabic.data.data.englishNameTranslation,
      revelationType: arabic.data.data.revelationType,
      numberOfAyahs: arabic.data.data.numberOfAyahs,
      mealCredit: mealCredit(lang),
    },
    ayahs,
  };
}

// Meal içinde arama: önceki sürüm izinsiz bir meal üzerinde arıyordu. QuranEnc çevirileri için
// arama uç noktası olmadığından şimdilik sonuç dönmez; Faz 3'te cihaz içi arama eklenecek.
export async function searchQuran() {
  return { matches: [], unavailable: true };
}

export function getAudioUrl(surahNumber, ayahNumber, reciter = 'ar.alafasy') {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayahNumber}.mp3`;
}

export function getSurahAudioUrl(surahNumber, reciter = 'ar.alafasy') {
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surahNumber}.mp3`;
}

// ─── ÇEVİRİ NOTLARI ───
// Önceki sürüm tek bir İngilizce tefsir çevirisini altı ayrı âlimin adıyla, "üslubundan ilhamla"
// yeniden paketliyordu. Bu hem telif hem güven sorunuydu ve kaldırıldı (docs/YENI_OZELLIKLER.md 0.1).
// Yerine yalnız meal sahibinin kendi dipnotları gösterilir.
export async function fetchTafsir() {
  return { text: '' };
}

export const TAFSIR_SCHOLARS = [
  { id: 'not', name: 'Çeviri notu', edition: null, desc: 'Mealin kendi dipnotu', color: '#1B5E20' },
];

export function buildScholarStyleTafsir({ ayahFootnotes }) {
  const note = (ayahFootnotes || '').trim();
  return note || 'Bu ayet için çeviri notu bulunmuyor.';
}

export const EDITIONS = {
  turkish: { id: MEAL_SOURCES.tr.key, name: MEAL_SOURCES.tr.name },
  english: { id: MEAL_SOURCES.en.key, name: MEAL_SOURCES.en.name },
  arabic: { id: 'quran-uthmani', name: 'Arapça (Osmani)' },
};

export const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'ar.maaboralsudaes', name: 'Abdurrahman As-Sudais' },
];
