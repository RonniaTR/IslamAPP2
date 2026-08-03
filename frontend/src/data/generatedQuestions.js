// frontend/src/data/generatedQuestions.js
// ─────────────────────────────────────────────────────────────
// TABLODAN ÜRETİLEN SORULAR (deterministik):
//   • Esmaül Hüsna: isim→anlam (99) + anlam→isim (99)
//   • Sureler: ayet sayısı (114) + Kur'an sırası (114) + Mekki/Medeni (~102)
// Toplam ~528 üretilmiş soru. Şıklar sabit ofsetlerle seçilir; böylece
// her derlemede aynı sorular üretilir ve yakın anlamlı çakışma riski azdır.
//
// 🇬🇧 Her soru ayrıca `en` alanı taşır: { question, options, explanation }.
// İngilizce sürüm aynı şablonlardan, aynı ofsetlerle üretilir; böylece
// doğru şıkkın konumu (correct_index) iki dilde birebir aynı kalır.
// ─────────────────────────────────────────────────────────────
import { SURAHS, ESMAUL_HUSNA } from './surahData';
import ESMA_EN from './esma.en';
import SURAH_NAMES_EN from './surahNames.en';

// Deterministik karıştırma: doğru şık her soruda farklı konumda olsun
function placeOptions(correct, distractors, seed) {
  const opts = [...distractors];
  const pos = seed % (distractors.length + 1);
  opts.splice(pos, 0, correct);
  return { options: opts, correct_index: pos };
}

const questions = [];
let seq = 0;

/**
 * @param {object} tr  { question, correct, distractors[], explanation }
 * @param {object} en  aynı şekil — İngilizce karşılığı (opsiyonel)
 */
function push(category, difficulty, tr, en) {
  const points = difficulty === 'hard' ? 25 : difficulty === 'medium' ? 15 : 10;
  const seed = seq;
  const { options, correct_index } = placeOptions(tr.correct, tr.distractors, seed);
  const q = {
    id: `g_${seq++}`,
    type: 'mc', category, points,
    question: tr.question,
    options,
    correct_index,
    explanation: tr.explanation || '',
    difficulty,
  };
  if (en) {
    // Aynı seed → doğru şık aynı indekste yer alır
    const placedEn = placeOptions(en.correct, en.distractors, seed);
    q.en = {
      question: en.question,
      options: placedEn.options,
      explanation: en.explanation || '',
    };
  }
  questions.push(q);
}

// Esmaül Hüsna İngilizce karşılıkları (esma.en.js 1-tabanlı numaralarla)
const enName = (i) => (ESMA_EN[i + 1] && ESMA_EN[i + 1].name) || ESMAUL_HUSNA[i].name;
const enMean = (i) => (ESMA_EN[i + 1] && ESMA_EN[i + 1].mean) || ESMAUL_HUSNA[i].meaning;

// ─── 1) ESMAÜL HÜSNA: isim → anlam ───
const EH = ESMAUL_HUSNA;
EH.forEach((e, i) => {
  const di = [(i + 13) % EH.length, (i + 37) % EH.length, (i + 61) % EH.length];
  push('Esmaül Hüsna', i % 3 === 0 ? 'easy' : 'medium',
    {
      question: `'${e.name}' isminin anlamı nedir?`,
      correct: e.meaning,
      distractors: di.map(k => EH[k].meaning),
      explanation: `${e.name}: ${e.meaning}.`,
    },
    {
      question: `What is the meaning of the name '${enName(i)}'?`,
      correct: enMean(i),
      distractors: di.map(enMean),
      explanation: `${enName(i)}: ${enMean(i)}.`,
    });
});

// ─── 2) ESMAÜL HÜSNA: anlam → isim ───
EH.forEach((e, i) => {
  const di = [(i + 17) % EH.length, (i + 41) % EH.length, (i + 71) % EH.length];
  push('Esmaül Hüsna', 'medium',
    {
      question: `Hangi isim '${e.meaning}' anlamına gelir?`,
      correct: e.name,
      distractors: di.map(k => EH[k].name),
      explanation: `${e.name}: ${e.meaning}.`,
    },
    {
      question: `Which name means '${enMean(i)}'?`,
      correct: enName(i),
      distractors: di.map(enName),
      explanation: `${enName(i)}: ${enMean(i)}.`,
    });
});

// ─── 3) SURELER: ayet sayısı ───
// Sayısal çeldiriciler: gerçek değere yakın ama farklı
function nearbyCounts(real) {
  const deltas = real > 50 ? [7, -11, 19] : real > 10 ? [2, -3, 5] : [1, 2, -1];
  const set = new Set([real]);
  const out = [];
  for (const dl of deltas) {
    let v = Math.max(3, real + dl);
    while (set.has(v)) v += 1;
    set.add(v);
    out.push(v);
  }
  return out;
}
const enSurah = (n, fallback) => SURAH_NAMES_EN[n] || fallback;
const KNOWN = new Set([1, 2, 18, 36, 55, 56, 67, 97, 103, 105, 108, 112, 113, 114]);
SURAHS.forEach((s) => {
  const counts = nearbyCounts(s.ayahs).map(String);
  push('Kuran', KNOWN.has(s.n) ? 'easy' : 'hard',
    {
      question: `${s.name} Suresi kaç ayettir?`,
      correct: String(s.ayahs),
      distractors: counts,
      explanation: `${s.name} Suresi ${s.ayahs} ayettir.`,
    },
    {
      question: `How many verses does Surah ${enSurah(s.n, s.name)} have?`,
      correct: String(s.ayahs),
      distractors: counts,
      explanation: `Surah ${enSurah(s.n, s.name)} has ${s.ayahs} verses.`,
    });
});

// ─── 4) SURELER: Kur'an'daki sıra ───
SURAHS.forEach((s, i) => {
  const di = [(i + 5) % 114, (i + 29) % 114, (i + 57) % 114];
  push('Kuran', s.n <= 4 || s.n >= 110 || KNOWN.has(s.n) ? 'medium' : 'hard',
    {
      question: `Kur'an-ı Kerim'in ${s.n}. suresi hangisidir?`,
      correct: s.name,
      distractors: di.map(k => SURAHS[k].name),
      explanation: `${s.n}. sure ${s.name} Suresi'dir (${s.ayahs} ayet).`,
    },
    {
      question: `Which surah is number ${s.n} in the Noble Qur'an?`,
      correct: enSurah(s.n, s.name),
      distractors: di.map(k => enSurah(SURAHS[k].n, SURAHS[k].name)),
      explanation: `Surah number ${s.n} is ${enSurah(s.n, s.name)} (${s.ayahs} verses).`,
    });
});

// ─── 5) SURELER: Mekki / Medeni (ihtilaflılar hariç) ───
const TR_MECCAN = 'Mekki (Mekke döneminde inmiştir)';
const TR_MEDINAN = 'Medeni (Medine döneminde inmiştir)';
const EN_MECCAN = 'Meccan (revealed in the Meccan period)';
const EN_MEDINAN = 'Medinan (revealed in the Medinan period)';
SURAHS.filter(s => s.place).forEach((s) => {
  const isM = s.place === 'M';
  push('Kuran', 'medium',
    {
      question: `${s.name} Suresi Mekki midir, Medeni midir?`,
      correct: isM ? TR_MECCAN : TR_MEDINAN,
      distractors: [
        isM ? TR_MEDINAN : TR_MECCAN,
        'Yarısı Mekki, yarısı Medeni kabul edilir',
        'Taif döneminde inmiştir',
      ],
      explanation: `${s.name} Suresi ${isM ? 'Mekki' : 'Medeni'}'dir.`,
    },
    {
      question: `Is Surah ${enSurah(s.n, s.name)} Meccan or Medinan?`,
      correct: isM ? EN_MECCAN : EN_MEDINAN,
      distractors: [
        isM ? EN_MEDINAN : EN_MECCAN,
        'It is considered half Meccan and half Medinan',
        'It was revealed during the Taif period',
      ],
      explanation: `Surah ${enSurah(s.n, s.name)} is ${isM ? 'Meccan' : 'Medinan'}.`,
    });
});

export const GENERATED_QUESTIONS = questions;
export default GENERATED_QUESTIONS;
