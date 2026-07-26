// frontend/src/data/emotionMap.js
// 💚 Duygu → İlim Bağlayıcısı
// Duyguya göre ayet meali + dua + kütüphaneden makale önerisi.
// Var olan içerikleri akıllıca eşleştirir; yeni içerik üretimi minimum.

export const EMOTIONS = [
  {
    id: 'uzgun', label: 'Üzgünüm', emoji: '😔', color: '#3B82F6',
    verse: {
      text: '"Sakın gevşemeyin, üzülmeyin. Eğer inanıyorsanız üstün gelecek olan sizsiniz."',
      source: 'Âl-i İmrân 139',
    },
    dua: 'Allahım! Kalbimin kederini gider, göğsümü ferahlat, işimi kolaylaştır. Ey darda kalmışların sığınağı, sen bana yetersin.',
    duaSrc: 'Enbiyâ 87 esinli',
    articleId: 'sabir',
    hint: 'Sabır: İlk darbede duruş',
  },
  {
    id: 'kaygili', label: 'Kaygılıyım', emoji: '😰', color: '#8B5CF6',
    verse: {
      text: '"...Bilesiniz ki kalpler ancak Allah\'ı anmakla huzur bulur."',
      source: "Ra'd 28",
    },
    dua: 'Hasbünallâhü ve ni\'mel vekîl — Allah bize yeter, O ne güzel vekildir. Allahım, senden başkasına muhtaç etme, senden başkasından korkutma.',
    duaSrc: 'Âl-i İmrân 173 esinli',
    articleId: 'tevekkul',
    hint: 'Tevekkül: Deveni bağla, sonra güven',
  },
  {
    id: 'ofkeli', label: 'Öfkeliyim', emoji: '😤', color: '#EF4444',
    verse: {
      text: '"Onlar bollukta da darlıkta da infak ederler, öfkelerini yutarlar ve insanları affederler."',
      source: 'Âl-i İmrân 134',
    },
    dua: 'Eûzü billâhi mineş-şeytânirracîm. Allahım, öfkemin şerrinden sana sığınırım; kalbimi soğuk suyla, karla, dolu ile arındır.',
    duaSrc: 'Buhârî esinli',
    articleId: 'ofke',
    hint: 'Öfkeyi Yenmek: Asıl pehlivanlık',
  },
  {
    id: 'mutlu', label: 'Mutluyum', emoji: '😊', color: '#F59E0B',
    verse: {
      text: '"Rabbinin nimetini durmaksızın anlat."',
      source: 'Duhâ 11',
    },
    dua: 'Elhamdülillâhi rabbil-âlemîn. Allahım, bu nimeti benden sonrakilere ulaştır, kalbimi şükürle doldur, gafletten koru.',
    duaSrc: 'Fâtiha 2 esinli',
    articleId: 'sukur',
    hint: 'Şükür: Nimeti çoğaltan anahtar',
  },
  {
    id: 'minnettar', label: 'Minnettarım', emoji: '🙏', color: '#10B981',
    verse: {
      text: '"Andolsun, şükrederseniz elbette size (nimetimi) artırırım; nankörlük ederseniz azabım pek şiddetlidir."',
      source: 'İbrâhim 7',
    },
    dua: 'Allahım! Sen bana ihsan ettin, ben ise pek nankör bir kulum. Şükrünü hakkıyla eda edemeyeceğimi biliyorum; kabul buyur.',
    duaSrc: 'Neml 40 esinli',
    articleId: 'sukur',
    hint: 'Şükür: Nimeti çoğaltan anahtar',
  },
  {
    id: 'yalniz', label: 'Yalnızım', emoji: '😞', color: '#6366F1',
    verse: {
      text: '"Kullarım sana beni sorduğunda bilsinler ki ben çok yakınım."',
      source: 'Bakara 186',
    },
    dua: 'Yâ Vedûd, yâ Karîb! Sen bana şah damarımdan daha yakınsın. Kalbimi seninle ünsiyete alıştır, yalnızlığımı sohbete çevir.',
    duaSrc: 'Kâf 16 esinli',
    articleId: 'dua',
    hint: 'Dua: Kulluğun özü',
  },
  {
    id: 'kararsiz', label: 'Kararsızım', emoji: '🤔', color: '#06B6D4',
    verse: {
      text: '"Kararını verdiğinde artık Allah\'a tevekkül et. Allah tevekkül edenleri sever."',
      source: 'Âl-i İmrân 159',
    },
    dua: 'Allahım! Senin ilminle istihare eder, kudretinle güç dilerim. Bu iş dinim ve dünyam için hayırlıysa nasip et; değilse benden uzaklaştır.',
    duaSrc: "İstihâre duası (Buhârî)",
    articleId: 'tevekkul',
    hint: 'Tevekkül: Deveni bağla, sonra güven',
  },
  {
    id: 'yorgun', label: 'Yorgunum', emoji: '💤', color: '#EAB308',
    verse: {
      text: '"Şüphesiz zorlukla beraber bir kolaylık vardır. Gerçekten zorlukla beraber bir kolaylık vardır."',
      source: 'İnşirâh 5-6',
    },
    dua: 'Allahım! Bedenime âfiyet, kalbime dinlenme, ruhuma huzur ver. Yükümü hafiflet, gücümü tazele.',
    duaSrc: 'Ebu Davud esinli',
    articleId: 'sabir',
    hint: 'Sabır: İlk darbede duruş',
  },
  {
    id: 'gunahkar', label: 'Pişmanım', emoji: '😞', color: '#DC2626',
    verse: {
      text: '"De ki: Ey kendi aleyhlerine haddi aşan kullarım! Allah\'ın rahmetinden ümit kesmeyin."',
      source: 'Zümer 53',
    },
    dua: 'Estağfirullâhe\'l-azîm ve etûbü ileyh. Allahım, günahımı itiraf ediyorum, beni bağışla — senden başka bağışlayan yok.',
    duaSrc: 'Seyyidü\'l-İstiğfar (Buhârî)',
    articleId: 'umit',
    hint: 'Rahmetten Ümit Kesmemek',
  },
];

import EMOTIONS_EN from './emotionMap.en';
import EMOTIONS_AR from './emotionMap.ar';
EMOTIONS.forEach((e) => {
  if (EMOTIONS_EN[e.id]) e.en = EMOTIONS_EN[e.id];
  if (EMOTIONS_AR[e.id]) e.ar = EMOTIONS_AR[e.id];
});

export default EMOTIONS;
