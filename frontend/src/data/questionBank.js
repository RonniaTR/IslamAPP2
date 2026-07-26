// frontend/src/data/questionBank.js
// ─────────────────────────────────────────────────────────────
// DEVASA SORU BANKASI — iki havuzu tek formatta birleştirir:
//   1) quizData.js            → 100 soru (mc + doğru/yanlış)
//   2) quizQuestionsBig.json  → 300 soru (açıklamalı, zorluk seviyeli)
// Toplam ~400 soru; kategori ve zorluğa göre filtrelenebilir.
// ─────────────────────────────────────────────────────────────
import raw from './quizQuestionsBig.json';
import rawEn from './quizQuestionsBig.en.json';
import { quizQuestions } from './quizData';
import { EXTRA_QUESTIONS } from './questionBankExtra';
import { GENERATED_QUESTIONS } from './generatedQuestions';

// Backend kategori id'leri → görünen ad
const CAT_MAP = {
  kuran: 'Kuran',
  peygamberler: 'Peygamberler',
  sahabe: 'Sahabe',
  tarih: 'Tarih',
  hadis: 'Hadis',
  namaz: 'İbadet',
  ramazan: 'Ramazan',
  fikih: 'Fıkıh',
  medeniyet: 'Medeniyet',
  genel: 'Genel',
};

// Zorluk → puan (büyük havuz kendi p'sini taşır, yoksa zorluğa göre)
const DIFF_POINTS = { easy: 10, medium: 15, hard: 25 };

const fromBig = (raw.questions || [])
  .filter(q => Array.isArray(q.o) && q.o.length >= 2 && q.a >= 0 && q.a < q.o.length)
  .map(q => {
    const e = rawEn[q.id];
    return {
      id: `b_${q.id}`,
      type: 'mc',
      category: CAT_MAP[q.cat] || 'Genel',
      points: q.p || DIFF_POINTS[q.d] || 10,
      question: q.q,
      options: q.o,
      correct_index: q.a,
      explanation: q.exp || '',
      difficulty: q.d || 'easy',
      // 🇬🇧 İngilizce katman — şık sırası birebir aynı, correct_index geçerli kalır
      ...(e && Array.isArray(e.o) && e.o.length === q.o.length
        ? { en: { question: e.q, options: e.o, explanation: e.exp || '' } }
        : {}),
    };
  });

const fromLocal = quizQuestions.map(q => ({
  ...q,
  id: `l_${q.id}`,
  explanation: q.explanation || '',
  difficulty: q.points >= 20 ? 'hard' : q.points >= 15 ? 'medium' : 'easy',
}));

// Ek paket: yeni kategoriler (Esmaül Hüsna, Dualar, İlmihal, Çocuk...)
const fromExtra = EXTRA_QUESTIONS.map((q, i) => ({
  id: `x_${i}`,
  type: 'mc',
  category: q.cat,
  points: DIFF_POINTS[q.d] || 10,
  question: q.q,
  options: q.o,
  correct_index: q.a,
  explanation: q.exp || '',
  difficulty: q.d || 'easy',
}));

// Tablo-üretimli sorular: Esmaül Hüsna (198) + sure bilgileri (~330)
export const QUESTION_BANK = [...fromLocal, ...fromBig, ...fromExtra, ...GENERATED_QUESTIONS];
export const BANK_SIZE = QUESTION_BANK.length;

// Kategori listesi + soru sayıları (rozet/gösterge için)
export const BANK_CATEGORIES = Object.entries(
  QUESTION_BANK.reduce((acc, q) => { acc[q.category] = (acc[q.category] || 0) + 1; return acc; }, {})
).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

// ─────────────────────────────────────────────────────────────
// 🇬🇧 DİL KATMANI
// Sorular veri modülünde üretildiği için hook kullanılamaz; aktif dil
// LangContext tarafından setQuizLang() ile buraya bildirilir. Soru
// çekilirken `en` katmanı varsa otomatik uygulanır. Şık sırası aynı
// olduğundan correct_index her iki dilde de geçerli kalır.
// ─────────────────────────────────────────────────────────────
let QUIZ_LANG = (() => {
  try { return localStorage.getItem('app_lang') || 'tr'; } catch { return 'tr'; }
})();

export function setQuizLang(lang) {
  QUIZ_LANG = lang || 'tr';
}

/** Tek bir soruyu aktif dile göre döndürür (İngilizce yoksa Türkçe kalır). */
export function localizeQuestion(q, lang = QUIZ_LANG) {
  if (!q || lang === 'tr' || !q.en) return q;
  const e = q.en;
  return {
    ...q,
    question: e.question || q.question,
    options: Array.isArray(e.options) && e.options.length === q.options.length ? e.options : q.options,
    explanation: e.explanation || q.explanation,
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Bankadan rastgele soru çek.
 * @param {number} count
 * @param {{category?: string, difficulty?: 'easy'|'medium'|'hard', mcOnly?: boolean}} opts
 */
export function drawQuestions(count = 10, { category, difficulty, mcOnly = false } = {}) {
  let pool = QUESTION_BANK;
  if (category) pool = pool.filter(q => q.category === category);
  if (difficulty) pool = pool.filter(q => q.difficulty === difficulty);
  if (mcOnly) pool = pool.filter(q => q.type === 'mc');
  if (!pool.length) pool = QUESTION_BANK;
  return shuffle(pool).slice(0, count).map(q => localizeQuestion(q));
}

export default QUESTION_BANK;
