import React from 'react';
import ClueGame from './ClueGame';
import { LETTERS } from '../../data/elifba';

// 🔡 HANGİ HARF? — çıkış yerinden (mahreç) ve sesinden harfi tanı. Kaynak: data/elifba.js.
const ITEMS = LETTERS.filter((l) => l.mahrec && l.name).map((l) => ({
  answer: l.name,
  clues: [l.mahrec, `Sesi: ${l.tr}`, l.ar],
  note: `${l.ar} · ${l.mahrec}`,
}));

export default function WhichLetter(props) {
  return <ClueGame {...props} items={ITEMS} accent="#38BDF8" question="Hangi Harf?" />;
}
