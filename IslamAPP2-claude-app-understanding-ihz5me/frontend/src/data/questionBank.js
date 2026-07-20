// frontend/src/data/questionBank.js
// ─────────────────────────────────────────────────────────────
// DEVASA SORU BANKASI — iki havuzu tek formatta birleştirir:
//   1) quizData.js            → 100 soru (mc + doğru/yanlış)
//   2) quizQuestionsBig.json  → 300 soru (açıklamalı, zorluk seviyeli)
// Toplam ~400 soru; kategori ve zorluğa göre filtrelenebilir.
// ─────────────────────────────────────────────────────────────
import raw from './quizQuestionsBig.json';
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
  .map(q => ({
    id: `b_${q.id}`,
    type: 'mc',
    category: CAT_MAP[q.cat] || 'Genel',
    points: q.p || DIFF_POINTS[q.d] || 10,
    question: q.q,
    options: q.o,
    correct_index: q.a,
    explanation: q.exp || '',
    difficulty: q.d || 'easy',
  }));

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
  return shuffle(pool).slice(0, count);
}

export default QUESTION_BANK;
