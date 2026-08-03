import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTx } from '../i18n';

// Nur Yolu ile aynı "Zümrüt Gece" paleti — karşılamadan sayfaya geçiş kesintisiz olsun.
const NUR = {
  bg: 'linear-gradient(180deg, #03130B 0%, #06231A 40%, #0A3524 100%)',
  gold: '#E8C56C',
  goldLight: '#F3DDA6',
  text: '#EAF5EE',
  dim: '#93B8A6',
};

// 🕯️ GERİ DÖNÜŞ KARŞILAMASI
//
// Değerlendirmede "uzun süredir ara verdim" seçildiğinde gösterilir.
// TEK İŞİ: kullanıcıyı utandırmadan içeri almak.
//
// TON KURALI — bu dosyadaki her cümle şu ölçütten geçmelidir:
//   "Bu cümleyi 5 yıl namaz kılmamış birinin yüzüne söyleyebilir miyim?"
// "Geride kaldın", "kaçırdın", "telafi et", "yeniden kazan" gibi ifadeler
// bu bileşende ve dönüş modunun hiçbir yerinde KULLANILMAZ.

const SLIDES = [
  {
    emoji: '🕯️',
    title: 'Hoş geldin',
    body: 'Ne kadar ara verdiğin önemli değil. Kapı hep açıktı, sen bugün geldin — başlangıç bu.',
  },
  {
    emoji: '👣',
    title: 'Tek adımla başlıyoruz',
    body: 'İlk günler sana yalnızca bir görev vereceğiz. Az ama devamlı olan, çok ama kesintili olandan hayırlıdır.',
  },
  {
    emoji: '🤲',
    title: 'Atladığın gün kaybolmaz',
    body: 'Bir gün gelemezsen serin sıfırlanmaz. Üç şefkat hakkın var; yolun seni bekler.',
  },
];

export default function ReturnIntro({ onDone }) {
  const tt = useTx();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 max-w-md mx-auto"
      style={{ background: NUR.bg }} data-testid="return-intro">

      <AnimatePresence mode="wait">
        <motion.div key={i}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.32 }}
          className="text-center">
          <span className="text-6xl block mb-7">{slide.emoji}</span>
          <h1 className="text-2xl font-black mb-3"
            style={{ fontFamily: 'Playfair Display, serif', color: NUR.text }}>
            {tt(slide.title)}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: NUR.dim }}>
            {tt(slide.body)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* İlerleme noktaları */}
      <div className="flex gap-2 mt-10 mb-8" aria-hidden="true">
        {SLIDES.map((_, k) => (
          <span key={k} className="rounded-full transition-all"
            style={{
              width: k === i ? 22 : 7, height: 7,
              background: k === i ? NUR.gold : `${NUR.dim}40`,
            }} />
        ))}
      </div>

      <button
        onClick={() => (last ? onDone() : setI(i + 1))}
        className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
        style={{ background: `linear-gradient(135deg, ${NUR.gold}, ${NUR.goldLight})`, color: '#03130B' }}>
        {last ? tt('Yola çıkalım') : tt('Devam')} <ArrowRight size={16} />
      </button>

      {!last && (
        <button onClick={onDone} className="mt-3 text-xs py-2 px-4" style={{ color: NUR.dim }}>
          {tt('Geç')}
        </button>
      )}
    </div>
  );
}
