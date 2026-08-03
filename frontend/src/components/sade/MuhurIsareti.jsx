import React from 'react';

// 🔏 MÜHÜR İŞARETİ
//
// Gün Mührü'nün tek simgesi: rub'ul hizb (sekiz köşeli yıldız) ve
// çevresindeki halka. Emoji kullanılmaz — emoji her cihazda başka
// çizilir ve temanın rengini almaz. Bu işaret her yerde aynı görünür
// ve bulunduğu temanın rengiyle boyanır.
//
// Aynı işaret üç yerde geçer: Sade'deki kart, tören ekranı ve
// paylaşım kartı (paylasimKarti.js içinde canvas ile yeniden çizilir).
// Tekrar eden bu iz, mührü bir düğme olmaktan çıkarıp mühür yapar.

export default function MuhurIsareti({ renk = 'currentColor', boyut = 16, kalinlik = 1.6, halka = true }) {
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 24 24" aria-hidden
      fill="none" stroke={renk} strokeWidth={kalinlik} strokeLinejoin="round">
      <rect x="6.2" y="6.2" width="11.6" height="11.6" rx="0.8" />
      <rect x="6.2" y="6.2" width="11.6" height="11.6" rx="0.8"
        style={{ transformOrigin: '12px 12px', transform: 'rotate(45deg)' }} />
      <circle cx="12" cy="12" r="2.9" />
      {halka && <circle cx="12" cy="12" r="10.6" strokeWidth={kalinlik * 0.7} opacity="0.75" />}
    </svg>
  );
}
