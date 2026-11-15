import React from 'react';
import ClueGame from './ClueGame';
import { PROPHETS } from '../../data/prophets';

// 🌟 HANGİ PEYGAMBER? — ipuçları uygulamanın kendi peygamberler verisinden (data/prophets.js) gelir.
// Tasvir yok: yalnız metin. İpuçları zordan kolaya sıralanır.
const ITEMS = PROPHETS.filter((p) => p.name && p.keyLessons && p.title).map((p) => ({
  answer: p.name,
  clues: [p.keyLessons, p.period, (p.miracles || [])[0], p.title].filter(Boolean),
  note: p.quranVerses ? `Kur'an'da: ${p.quranVerses}` : '',
}));

export default function WhichProphet(props) {
  return <ClueGame {...props} items={ITEMS} accent="#F59E0B" question="Hangi Peygamber?" />;
}
