// 📍 KALDIĞIN YER — uygulamanın her yerinden "devam et" için tek kaynak.
// Kur'an (sure/âyet), Mushaf (sayfa), kütüphane kitapları (Müslüman Olmak, Hikmet Mecmuası Sayı 1 & 2)
// ve Dönüş Odası (Kırk Perde) okunurken kendi anahtarlarına yazar; burada en son dokunulan seçilir.
import { QURAN_PUBLIC } from '../config/quranAccess';

const oku = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };

const KITAPLAR = [
  { id: 'musluman-olmak', ad: 'Müslüman Olmak', tur: 'kitap', yol: '/musluman-olmak?oku=kitap' },
  { id: 'hikmet-mecmuasi-1', ad: 'Hikmet Mecmuası · Sayı 1', tur: 'mecmua', yol: '/musluman-olmak?oku=mecmua' },
  { id: 'hikmet-mecmuasi-2', ad: 'Hikmet Mecmuası · Sayı 2', tur: 'mecmua2', yol: '/musluman-olmak?oku=mecmua2' },
];

const KAPATILAN = 'devam_kapatilan';

/** Bütün adaylar, en yeniden eskiye. */
export function devamAdaylari() {
  const out = [];
  if (QURAN_PUBLIC) {
    const q = oku('quran_last');
    if (q && q.surah) {
      out.push({
        anahtar: `quran:${q.surah}:${q.ayah}`,
        etiket: "Kur'an",
        baslik: q.name || `${q.surah}. sure`,
        alt: q.ayah ? `${q.ayah}. âyetten devam` : 'Kaldığın sureden devam',
        oran: q.ayah && q.total ? q.ayah / q.total : null,
        yol: `/quran/${q.surah}`,
        ts: q.ts || 0,
      });
    }
    const p = Number(oku('mushaf_last_page')) || 0;
    if (p > 1) {
      out.push({
        anahtar: `mushaf:${p}`,
        etiket: 'Mushaf',
        baslik: `${p}. sayfa`,
        alt: `604 sayfanın ${p}.`,
        oran: p / 604,
        yol: `/mushaf/${p}`,
        ts: Number(oku('mushaf_last_ts')) || 0,
      });
    }
  }
  KITAPLAR.forEach((k) => {
    const s = oku(`mo:${k.id}:sayfa`);
    const t = oku(`mo:${k.id}:toplam`);
    if (s && s > 0) {
      out.push({
        anahtar: `${k.id}:${s}`,
        etiket: k.tur === 'kitap' ? 'Kitap' : 'Mecmua',
        baslik: k.ad,
        alt: `${s + 1}. sayfadan devam`,
        oran: t ? (s + 1) / t : null,
        yol: k.yol,
        ts: Number(oku(`mo:${k.id}:ts`)) || 0,
      });
    }
  });
  // Dönüş Odası (Kırk Perde) yolculuğu
  const prof = oku('islamic_path_profile_v1');
  if (prof && prof.mode === 'return' && prof.returnStartedAt) {
    const gun = Math.max(1, Math.min(40, (prof.returnTotalActiveDays || 0) + 1));
    const ts = prof.lastActiveDate ? new Date(prof.lastActiveDate).getTime() || 0 : 0;
    out.push({
      anahtar: `donus:${gun}`,
      etiket: 'Dönüş Odası',
      baslik: `Kırk Perde · ${gun}. Gün`,
      alt: '40 günlük yolculuğa devam',
      oran: gun / 40,
      yol: '/donus',
      ts,
    });
  }
  return out.sort((a, b) => b.ts - a.ts);
}

/** Gösterilecek tek kayıt: en yenisi; bu oturumda kapatılmışsa ya da şu an zaten oradaysan null. */
export function devamSec(konum) {
  let kapali = [];
  try { kapali = JSON.parse(sessionStorage.getItem(KAPATILAN) || '[]'); } catch { /* */ }
  const a = devamAdaylari().find((x) => !kapali.includes(x.anahtar));
  if (!a) return null;
  const hedefYol = a.yol.split('?')[0];
  if (konum.pathname.startsWith('/quran/') || konum.pathname.startsWith('/mushaf')) return null;
  if (['/chat', '/multiplayer', '/donus'].some((y) => konum.pathname.startsWith(y))) return null;
  if (hedefYol === konum.pathname) return null;
  return a;
}

export function devamKapat(anahtar) {
  try {
    const k = JSON.parse(sessionStorage.getItem(KAPATILAN) || '[]');
    if (!k.includes(anahtar)) k.push(anahtar);
    sessionStorage.setItem(KAPATILAN, JSON.stringify(k));
  } catch { /* */ }
}
