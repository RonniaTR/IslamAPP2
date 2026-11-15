import React from 'react';
import ClueGame from './ClueGame';
import { WORD_MEAL } from '../../data/kelimeMeal';
import { SURAHS } from '../../data/surahData';

// 📍 AYET NEREDE? — ibarelerin Türkçe karşılığından sureyi bul.
// Veri: data/kelimeMeal.js (özgün kelime-meal karşılıkları). İpucu = bir ayetin anlamı; her ipucu bir sonraki ayet.
const nameOf = (n) => { const s = SURAHS.find((x) => x.n === Number(n)); return s ? s.name : `${n}. sure`; };
const ITEMS = Object.entries(WORD_MEAL).map(([s, ayahs]) => {
  const keys = Object.keys(ayahs).map(Number).sort((a, b) => a - b).filter((a) => !(a === 1 && Number(s) !== 1 && Object.keys(ayahs).length > 3));
  const clues = keys.slice(-4).reverse().map((a) => (ayahs[a] || []).map((w) => w.tr).join(' ')).filter(Boolean);
  return { answer: nameOf(s), clues, note: `${nameOf(s)} · ${s}. sure` };
}).filter((it) => it.clues.length >= 2);

export default function WhereAyah(props) {
  return <ClueGame {...props} items={ITEMS} accent="#34D399" question="Ayet Nerede?" />;
}
