// 📖 Kitaptaki âyetlerin meali — DAİMA cihazdaki meal paketinden, olduğu gibi gelir.
// Kitabın verisinde meal metni YAZILMAZ; yalnız sure ve âyet numarası durur. Böylece:
//   · meal birebir kaynaktaki gibidir (QuranEnc şartı: metin değiştirilmez, sürüm gösterilir),
//   · paket sürümü değişirse kitap da kendiliğinden güncellenir,
//   · internet olmadan da çalışır (paket cihazdadır).
import { useEffect, useState } from 'react';
import { packSurah } from '../../services/offline';
import sources from '../../data/sources.json';

const KEY = sources.translations.tr.key;
const bekleyen = new Map(); // sure → Promise
const hazir = new Map();    // sure → sonuç (null = paket yok)

export const MEAL_AD = sources.translations.tr.ad;
export const MEAL_KISA = 'Meal: Rowad Tercüme Merkezi (QuranEnc)';

export function sureMeali(sure) {
  if (!bekleyen.has(sure)) {
    bekleyen.set(sure, packSurah(KEY, sure).catch(() => null).then((r) => { hazir.set(sure, r); return r; }));
  }
  return bekleyen.get(sure);
}

/** Dizgiden önce: kitapta geçen bütün surelerin mealini belleğe alır. */
export function mealleriHazirla(sureler) {
  return Promise.all([...new Set(sureler)].map(sureMeali));
}

function oku(sure, ilk, son) {
  if (!hazir.has(sure)) return null;
  const r = hazir.get(sure);
  if (!r) return { satirlar: null, yok: true, surum: '', etiket: '' };
  // Bazı meallerde birlikte çevrilen ardışık âyetlerin metni her âyette tekrarlanır; tek satırda gösterilir (1–3).
  const satirlar = [];
  for (let n = ilk; n <= son; n += 1) {
    const a = r.ayahs[n - 1];
    if (!a) continue;
    const onceki = satirlar[satirlar.length - 1];
    if (onceki && onceki.text === a.text) { onceki.son = n; onceki.n = `${onceki.ilk}–${n}`; }
    else satirlar.push({ n, ilk: n, son: n, text: a.text });
  }
  return { satirlar, yok: satirlar.length === 0, surum: r.version || '', etiket: r.etiket ? `Meal: ${r.etiket}` : MEAL_KISA };
}

/** {satirlar:[{n,text}], yok, surum} — `ayet` tek sayı ya da [ilk, son] aralığı. */
export function useAyet(sure, ayet) {
  const [ilk, son] = Array.isArray(ayet) ? ayet : [ayet, ayet];
  const [state, setState] = useState(() => oku(sure, ilk, son) || { satirlar: null, yok: false, surum: '', etiket: MEAL_KISA });
  useEffect(() => {
    let alive = true;
    if (hazir.has(sure)) { setState(oku(sure, ilk, son)); return undefined; }
    sureMeali(sure).then(() => { if (alive) setState(oku(sure, ilk, son)); });
    return () => { alive = false; };
  }, [sure, ilk, son]);
  return state;
}

/** Sesli okuma için: âyet metni (yüklendiyse). */
export function ayetMetniHazir(sure, ayet) {
  const [ilk, son] = Array.isArray(ayet) ? ayet : [ayet, ayet];
  const r = oku(sure, ilk, son);
  return r && r.satirlar ? r.satirlar.map((s) => s.text).join(' ') : '';
}
