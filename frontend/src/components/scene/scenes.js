// 🎬 SAHNELER — ScenePlayer'ın okuduğu veri. Yeni sahne eklemek için buraya bir kayıt yaz.
//   floor: zemin rengi · light: ışık rengi · icon: kandil | yildiz | hilal
//   steps: [{ ms, small?, text, sub?, sound?: ['ad', ...argümanlar] }]   (ses adları: services/sound)
// Metinler Türkçe yazılır (i18n anahtarı); {ad} gibi yer tutucular `vars` ile doldurulur.
const SCENES = {
  // Kandil ışık haritasında "ışığımı yak" dendiğinde
  kandil: {
    floor: '#1A1208', light: '#F0B429', icon: 'kandil',
    steps: [
      { ms: 2600, small: 'MÜBAREK GECE', text: 'Işığın yandı', sound: ['ney', 'hicaz', { noteDur: 0.5 }] },
      { ms: 3000, text: 'Bu gece yalnız değilsin', sub: 'Aynı gökyüzünün altında, aynı geceyi uyanık geçirenler var.' },
    ],
  },
  // Hatim tamamlandığında
  hatim: {
    floor: '#06140F', light: '#34D399', icon: 'yildiz',
    steps: [
      { ms: 2600, small: 'HATİM', text: 'Son sayfayı çevirdin', sound: ['ney', 'rast', { noteDur: 0.5 }] },
      { ms: 3200, text: 'Allah kabul etsin', sub: 'Bitiren, yeniden başlayandır. Fâtiha seni bekliyor.' },
    ],
  },
  // Kaza planında bir borç türü sıfırlandığında
  kaza: {
    floor: '#0A0F1F', light: '#7DA2FF', icon: 'hilal',
    steps: [
      { ms: 2400, small: 'KAZA', text: 'Bir yük daha indi', sound: ['odul'] },
      { ms: 2800, text: 'Azar azar, ama hiç bırakmadan', sub: 'Amellerin en sevimlisi, az da olsa devamlı olanıdır. (Buhârî, Rikâk 18)' },
    ],
  },
};
export default SCENES;
