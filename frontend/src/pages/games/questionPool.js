// 🎯 OYUN SORU HAVUZU — Hikmet Çarkı ve 12 Basamak'ın ortak kaynağı.
// Bankadaki 17 ayrı kategori, oyuncunun kafasında karşılığı olan 6 büyük alana toplanır.
// Çocuk sürümü yalnız kolay sorulardan ve 'Çocuk' kategorisinden çeker.
import { QUESTION_BANK } from '../../data/questionBank';
import { KIDS_QUESTIONS } from '../../data/kidsQuestions';

export const AREAS = [
  { id: 'kuran',     name: "Kur'an",        short: "Kur'an",    color: '#2F8F6B', src: ['Kuran'] },
  { id: 'peygamber', name: 'Peygamberler',  short: 'Peygamber', color: '#D9902F', src: ['Peygamberler'] },
  { id: 'siyer',     name: 'Siyer ve Tarih', short: 'Siyer',    color: '#C4553E', src: ['Siyer', 'Tarih', 'Sahabe', 'Medeniyet'] },
  { id: 'ibadet',    name: 'İbadet',        short: 'İbadet',    color: '#3B7BC4', src: ['İbadet', 'Fıkıh', 'İlmihal', 'Ramazan', 'Dualar'] },
  { id: 'iman',      name: 'İman ve Ahlak', short: 'Ahlak',     color: '#8A5BC4', src: ['İtikat', 'Ahlak', 'Hadis', 'Genel'] },
  { id: 'esma',      name: 'Esmâ-i Hüsnâ',  short: 'Esmâ',      color: '#B8902C', src: ['Esmaül Hüsna'] },
];

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// Şıklar her gösterimde karıştırılır (doğru cevap hep aynı harfte kalmasın); Doğru/Yanlış soruları karışmaz.
const norm = (q) => {
  const tf = q.type === 'tf' || !q.options;
  const opts = tf ? ['Doğru', 'Yanlış'] : q.options;
  const order = tf ? opts.map((_, i) => i) : shuffle(opts.map((_, i) => i));
  return {
    id: q.id,
    category: q.category,
    question: q.question,
    options: order.map((i) => opts[i]),
    correct: order.indexOf(q.correct_index),
    explanation: q.explanation || '',
    difficulty: q.difficulty || 'easy',
  };
};

const KIDS_BANK = KIDS_QUESTIONS.map((k, i) => ({ id: `k_${i}`, area: k.area, category: 'Çocuk', type: 'mc', question: k.q, options: k.o, correct_index: 0, explanation: k.exp, difficulty: 'easy' }));

/**
 * Tekrarsız soru çekici. Bir oyun boyunca aynı soru iki kez gelmez.
 * @param {{kids?: boolean}} o
 */
export function createPool({ kids = false } = {}) {
  const used = new Set();
  const usable = QUESTION_BANK.filter((q) => q.question && (q.type === 'tf' || (q.options && q.options.length >= 2)));
  const kidsExtra = usable.filter((q) => q.category === 'Çocuk');
  const pick = (list) => {
    const fresh = list.filter((q) => !used.has(q.id));
    const from = fresh.length ? fresh : list;
    const q = from[Math.floor(Math.random() * from.length)];
    if (!q) return null;
    used.add(q.id);
    return norm(q);
  };
  return {
    /** Alandan bir soru. level: 'easy' | 'medium' | 'hard' | undefined */
    fromArea(areaId, level) {
      const area = AREAS.find((a) => a.id === areaId) || AREAS[0];
      // Çocukta yalnız çocuk paketi (alanına göre) + genel 'Çocuk' soruları; büyüklerin bankasına girilmez
      let list = kids ? KIDS_BANK.filter((q) => q.area === area.id).concat(kidsExtra) : usable.filter((q) => area.src.includes(q.category));
      const leveled = level ? list.filter((q) => q.difficulty === level) : list;
      return pick(leveled.length >= 3 ? leveled : list);
    },
    /** Bütün bankadan, zorluğa göre (12 Basamak). Esmâ tablo soruları ağırlığı bozmasın diye seyreltilir. */
    byLevel(level) {
      const list = usable.filter((q) => q.difficulty === level && q.type !== 'tf' && (q.category !== 'Esmaül Hüsna' || Math.random() < 0.15));
      return pick(list.length ? list : usable);
    },
    shuffle,
  };
}
