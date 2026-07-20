// frontend/src/data/generatedQuestions.js
// ─────────────────────────────────────────────────────────────
// TABLODAN ÜRETİLEN SORULAR (deterministik):
//   • Esmaül Hüsna: isim→anlam (99) + anlam→isim (99)
//   • Sureler: ayet sayısı (114) + Kur'an sırası (114) + Mekki/Medeni (~102)
// Toplam ~528 üretilmiş soru. Şıklar sabit ofsetlerle seçilir; böylece
// her derlemede aynı sorular üretilir ve yakın anlamlı çakışma riski azdır.
// ─────────────────────────────────────────────────────────────
import { SURAHS, ESMAUL_HUSNA } from './surahData';

// Deterministik karıştırma: doğru şık her soruda farklı konumda olsun
function placeOptions(correct, distractors, seed) {
  const opts = [...distractors];
  const pos = seed % (distractors.length + 1);
  opts.splice(pos, 0, correct);
  return { options: opts, correct_index: pos };
}

const questions = [];
let seq = 0;
function push(category, difficulty, question, correct, distractors, explanation) {
  const points = difficulty === 'hard' ? 25 : difficulty === 'medium' ? 15 : 10;
  const { options, correct_index } = placeOptions(correct, distractors, seq);
  questions.push({
    id: `g_${seq++}`,
    type: 'mc', category, points, question, options, correct_index,
    explanation: explanation || '', difficulty,
  });
}

// ─── 1) ESMAÜL HÜSNA: isim → anlam ───
const EH = ESMAUL_HUSNA;
EH.forEach((e, i) => {
  const d = [EH[(i + 13) % EH.length].meaning, EH[(i + 37) % EH.length].meaning, EH[(i + 61) % EH.length].meaning];
  push('Esmaül Hüsna', i % 3 === 0 ? 'easy' : 'medium',
    `'${e.name}' isminin anlamı nedir?`, e.meaning, d,
    `${e.name}: ${e.meaning}.`);
});

// ─── 2) ESMAÜL HÜSNA: anlam → isim ───
EH.forEach((e, i) => {
  const d = [EH[(i + 17) % EH.length].name, EH[(i + 41) % EH.length].name, EH[(i + 71) % EH.length].name];
  push('Esmaül Hüsna', 'medium',
    `Hangi isim '${e.meaning}' anlamına gelir?`, e.name, d,
    `${e.name}: ${e.meaning}.`);
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
const KNOWN = new Set([1, 2, 18, 36, 55, 56, 67, 97, 103, 105, 108, 112, 113, 114]);
SURAHS.forEach((s) => {
  push('Kuran', KNOWN.has(s.n) ? 'easy' : 'hard',
    `${s.name} Suresi kaç ayettir?`, String(s.ayahs), nearbyCounts(s.ayahs).map(String),
    `${s.name} Suresi ${s.ayahs} ayettir.`);
});

// ─── 4) SURELER: Kur'an'daki sıra ───
SURAHS.forEach((s, i) => {
  const d = [SURAHS[(i + 5) % 114].name, SURAHS[(i + 29) % 114].name, SURAHS[(i + 57) % 114].name];
  push('Kuran', s.n <= 4 || s.n >= 110 || KNOWN.has(s.n) ? 'medium' : 'hard',
    `Kur'an-ı Kerim'in ${s.n}. suresi hangisidir?`, s.name, d,
    `${s.n}. sure ${s.name} Suresi'dir (${s.ayahs} ayet).`);
});

// ─── 5) SURELER: Mekki / Medeni (ihtilaflılar hariç) ───
SURAHS.filter(s => s.place).forEach((s) => {
  const isM = s.place === 'M';
  push('Kuran', 'medium',
    `${s.name} Suresi Mekki midir, Medeni midir?`,
    isM ? 'Mekki (Mekke döneminde inmiştir)' : 'Medeni (Medine döneminde inmiştir)',
    [isM ? 'Medeni (Medine döneminde inmiştir)' : 'Mekki (Mekke döneminde inmiştir)',
      'Yarısı Mekki, yarısı Medeni kabul edilir',
      'Taif döneminde inmiştir'],
    `${s.name} Suresi ${isM ? 'Mekki' : 'Medeni'}'dir.`);
});

export const GENERATED_QUESTIONS = questions;
export default GENERATED_QUESTIONS;
