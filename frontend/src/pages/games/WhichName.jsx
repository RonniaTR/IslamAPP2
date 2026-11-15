import React from 'react';
import ClueGame from './ClueGame';
import { ESMA } from '../../data/esmaData';

// ✨ HANGİ İSİM? — Esmâ-i Hüsnâ'dan bir ismi tefekkür cümlesi ve anlamından tanı.
// Kaynak: data/esmaData.js (Tirmizî, Deavât 82 sıralaması; tefekkür cümleleri özgün).
const ITEMS = ESMA.filter((e) => e.name && e.mean && e.tef).map((e) => ({
  answer: e.name,
  clues: [e.tef, e.mean, e.ar],
  note: `${e.ar} · ${e.mean}`,
}));

export default function WhichName(props) {
  return <ClueGame {...props} items={ITEMS} accent="#A78BFA" question="Hangi İsim?" />;
}
