// frontend/src/data/kelimeMeal.js
// 🔤 KELİME KELİME AÇIKLAMALI MEAL
// İbare (kelime grubu) bazlı Türkçe karşılıklar; ezber ve anlama desteği için.
// Karşılıklar yaygın kelime-meal geleneğine göre özgün olarak yazılmıştır —
// hiçbir telifli meal/mushaf verisi kopyalanmamıştır.
// Kapsam: en çok okunan kısa sureler + Âyetel Kürsî (zamanla genişletilir).
// Yapı: WORD_MEAL[sureNo][ayetNo] = [{ ar, tr, q? }]
//   ar: Arapça ibare · tr: Türkçe karşılık · q: küçük açıklama/soru notu

export const WORD_MEAL = {
  // ─── 1 · FÂTİHA ───
  1: {
    1: [
      { ar: 'بِسْمِ اللّٰهِ', tr: "Allah'ın adıyla", q: '(Kimin adıyla?)' },
      { ar: 'الرَّحْمٰنِ', tr: 'Rahmân olan' },
      { ar: 'الرَّحِيمِ', tr: 'Rahîm olan' },
    ],
    2: [
      { ar: 'اَلْحَمْدُ', tr: 'Bütün hamdler' },
      { ar: 'لِلّٰهِ', tr: "Allah'a mahsustur", q: '(Kime?)' },
      { ar: 'رَبِّ الْعَالَمِينَ', tr: 'âlemlerin Rabbi olan' },
    ],
    3: [
      { ar: 'الرَّحْمٰنِ', tr: 'O Rahmân’dır', q: '(rahmeti her şeyi kuşatan)' },
      { ar: 'الرَّحِيمِ', tr: 'Rahîm’dir', q: '(müminlere çok merhametli)' },
    ],
    4: [
      { ar: 'مَالِكِ', tr: 'sahibidir' },
      { ar: 'يَوْمِ الدِّينِ', tr: 'hesap gününün', q: '(Neyin sahibi?)' },
    ],
    5: [
      { ar: 'اِيَّاكَ نَعْبُدُ', tr: 'yalnız Sana kulluk ederiz' },
      { ar: 'وَاِيَّاكَ نَسْتَعِينُ', tr: 've yalnız Senden yardım dileriz' },
    ],
    6: [
      { ar: 'اِهْدِنَا', tr: 'bizi ilet' },
      { ar: 'الصِّرَاطَ الْمُسْتَقِيمَ', tr: 'dosdoğru yola', q: '(Nereye?)' },
    ],
    7: [
      { ar: 'صِرَاطَ الَّذِينَ', tr: 'yoluna, o kimselerin ki' },
      { ar: 'اَنْعَمْتَ عَلَيْهِمْ', tr: 'kendilerine nimet verdin' },
      { ar: 'غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ', tr: 'gazaba uğrayanların yoluna değil' },
      { ar: 'وَلَا الضَّالِّينَ', tr: 've sapmışların da değil' },
    ],
  },

  // ─── 2 · BAKARA (Âyetel Kürsî) ───
  2: {
    255: [
      { ar: 'اَللّٰهُ لَا اِلٰهَ اِلَّا هُوَ', tr: "Allah — O'ndan başka hiçbir ilâh yoktur" },
      { ar: 'اَلْحَيُّ', tr: 'diridir', q: '(hayatı ezelî ve ebedî)' },
      { ar: 'الْقَيُّومُ', tr: 'her şeyi ayakta tutandır' },
      { ar: 'لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ', tr: "O'nu ne uyuklama tutar ne de uyku" },
      { ar: 'لَهُ مَا فِي السَّمٰوَاتِ وَمَا فِي الْاَرْضِ', tr: 'göklerde ve yerde ne varsa O’nundur' },
      { ar: 'مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ اِلَّا بِاِذْنِهِ', tr: 'izni olmadan katında kim şefaat edebilir?' },
      { ar: 'يَعْلَمُ مَا بَيْنَ اَيْدِيهِمْ وَمَا خَلْفَهُمْ', tr: 'onların önlerindekini de arkalarındakini de bilir' },
      { ar: 'وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ', tr: "O'nun ilminden hiçbir şeyi kavrayamazlar" },
      { ar: 'اِلَّا بِمَا شَاءَ', tr: 'O’nun dilediği müstesna' },
      { ar: 'وَسِعَ كُرْسِيُّهُ السَّمٰوَاتِ وَالْاَرْضَ', tr: 'Kürsüsü gökleri ve yeri kuşatmıştır' },
      { ar: 'وَلَا يَؤُدُهُ حِفْظُهُمَا', tr: 'o ikisini korumak O’na ağır gelmez' },
      { ar: 'وَهُوَ الْعَلِيُّ الْعَظِيمُ', tr: 'O yücedir, azamet sahibidir' },
    ],
  },

  // ─── 103 · ASR ───
  103: {
    1: [{ ar: 'وَالْعَصْرِ', tr: 'Asra (zamana) yemin olsun' }],
    2: [
      { ar: 'اِنَّ الْاِنْسَانَ', tr: 'şüphesiz insan' },
      { ar: 'لَفِي خُسْرٍ', tr: 'kesinlikle ziyandadır', q: '(Kim?)' },
    ],
    3: [
      { ar: 'اِلَّا الَّذِينَ اٰمَنُوا', tr: 'ancak iman edenler' },
      { ar: 'وَعَمِلُوا الصَّالِحَاتِ', tr: 've salih ameller işleyenler' },
      { ar: 'وَتَوَاصَوْا بِالْحَقِّ', tr: 've birbirine hakkı tavsiye edenler' },
      { ar: 'وَتَوَاصَوْا بِالصَّبْرِ', tr: 've birbirine sabrı tavsiye edenler', q: '(müstesna)' },
    ],
  },

  // ─── 105 · FÎL ───
  105: {
    1: [
      { ar: 'اَلَمْ تَرَ', tr: 'görmedin mi?' },
      { ar: 'كَيْفَ فَعَلَ رَبُّكَ', tr: 'Rabbin nasıl yaptı' },
      { ar: 'بِاَصْحَابِ الْفِيلِ', tr: 'fil sahiplerine', q: '(Kime?)' },
    ],
    2: [
      { ar: 'اَلَمْ يَجْعَلْ', tr: 'kılmadı mı?' },
      { ar: 'كَيْدَهُمْ', tr: 'onların tuzağını' },
      { ar: 'فِي تَضْلِيلٍ', tr: 'boşa çıkmış', q: '(Ne hâlde?)' },
    ],
    3: [
      { ar: 'وَاَرْسَلَ عَلَيْهِمْ', tr: 've üzerlerine gönderdi' },
      { ar: 'طَيْرًا اَبَابِيلَ', tr: 'sürü sürü kuşlar' },
    ],
    4: [
      { ar: 'تَرْمِيهِمْ', tr: 'onlara atıyorlardı' },
      { ar: 'بِحِجَارَةٍ', tr: 'taşlar', q: '(Ne ile?)' },
      { ar: 'مِنْ سِجِّيلٍ', tr: 'pişmiş çamurdan' },
    ],
    5: [
      { ar: 'فَجَعَلَهُمْ', tr: 'böylece onları çevirdi' },
      { ar: 'كَعَصْفٍ مَأْكُولٍ', tr: 'yenmiş ekin yaprağı gibi', q: '(Neye?)' },
    ],
  },

  // ─── 106 · KUREYŞ ───
  106: {
    1: [{ ar: 'لِاِيلَافِ قُرَيْشٍ', tr: "Kureyş'in (emniyete) alıştırılması için" }],
    2: [
      { ar: 'اِيلَافِهِمْ', tr: 'onların alıştırılması' },
      { ar: 'رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ', tr: 'kış ve yaz yolculuğuna' },
    ],
    3: [
      { ar: 'فَلْيَعْبُدُوا', tr: 'öyleyse kulluk etsinler' },
      { ar: 'رَبَّ هٰذَا الْبَيْتِ', tr: "bu Ev'in (Kâbe'nin) Rabbine", q: '(Kime?)' },
    ],
    4: [
      { ar: 'اَلَّذِي اَطْعَمَهُمْ', tr: 'O ki onları doyurdu' },
      { ar: 'مِنْ جُوعٍ', tr: 'açlıktan' },
      { ar: 'وَاٰمَنَهُمْ', tr: 've onları güvene kavuşturdu' },
      { ar: 'مِنْ خَوْفٍ', tr: 'korkudan' },
    ],
  },

  // ─── 107 · MÂÛN ───
  107: {
    1: [
      { ar: 'اَرَاَيْتَ', tr: 'gördün mü?' },
      { ar: 'الَّذِي يُكَذِّبُ', tr: 'o yalanlayanı' },
      { ar: 'بِالدِّينِ', tr: 'hesap gününü', q: '(Neyi?)' },
    ],
    2: [
      { ar: 'فَذٰلِكَ الَّذِي', tr: 'işte o kimse' },
      { ar: 'يَدُعُّ الْيَتِيمَ', tr: 'yetimi itip kakar' },
    ],
    3: [
      { ar: 'وَلَا يَحُضُّ', tr: 've teşvik etmez' },
      { ar: 'عَلٰى طَعَامِ الْمِسْكِينِ', tr: 'yoksulu doyurmaya', q: '(Neye?)' },
    ],
    4: [{ ar: 'فَوَيْلٌ لِلْمُصَلِّينَ', tr: 'vay hâline o namaz kılanların' }],
    5: [
      { ar: 'اَلَّذِينَ هُمْ', tr: 'ki onlar' },
      { ar: 'عَنْ صَلَاتِهِمْ سَاهُونَ', tr: 'namazlarından gafildirler' },
    ],
    6: [{ ar: 'اَلَّذِينَ هُمْ يُرَاؤُنَ', tr: 'onlar gösteriş yaparlar' }],
    7: [{ ar: 'وَيَمْنَعُونَ الْمَاعُونَ', tr: 've en küçük yardımı bile esirgerler' }],
  },

  // ─── 108 · KEVSER ───
  108: {
    1: [
      { ar: 'اِنَّا اَعْطَيْنَاكَ', tr: 'şüphesiz Biz sana verdik' },
      { ar: 'الْكَوْثَرَ', tr: "Kevser'i", q: '(Neyi?)' },
    ],
    2: [
      { ar: 'فَصَلِّ لِرَبِّكَ', tr: 'öyleyse Rabbin için namaz kıl' },
      { ar: 'وَانْحَرْ', tr: 've kurban kes' },
    ],
    3: [
      { ar: 'اِنَّ شَانِئَكَ', tr: 'doğrusu sana kin besleyen' },
      { ar: 'هُوَ الْاَبْتَرُ', tr: 'asıl soyu kesik olanın ta kendisidir' },
    ],
  },

  // ─── 109 · KÂFİRÛN ───
  109: {
    1: [
      { ar: 'قُلْ', tr: 'de ki' },
      { ar: 'يَا اَيُّهَا الْكَافِرُونَ', tr: 'ey kâfirler' },
    ],
    2: [
      { ar: 'لَا اَعْبُدُ', tr: 'ben ibadet etmem' },
      { ar: 'مَا تَعْبُدُونَ', tr: 'sizin taptıklarınıza', q: '(Neye?)' },
    ],
    3: [
      { ar: 'وَلَا اَنْتُمْ عَابِدُونَ', tr: 'siz de ibadet ediciler değilsiniz' },
      { ar: 'مَا اَعْبُدُ', tr: 'benim ibadet ettiğime' },
    ],
    4: [
      { ar: 'وَلَا اَنَا عَابِدٌ', tr: 'ben de ibadet edici değilim' },
      { ar: 'مَا عَبَدْتُمْ', tr: 'sizin taptıklarınıza' },
    ],
    5: [
      { ar: 'وَلَا اَنْتُمْ عَابِدُونَ', tr: 'siz de ibadet edecek değilsiniz' },
      { ar: 'مَا اَعْبُدُ', tr: 'benim ibadet ettiğime' },
    ],
    6: [
      { ar: 'لَكُمْ دِينُكُمْ', tr: 'sizin dininiz size' },
      { ar: 'وَلِيَ دِينِ', tr: 'benim dinim banadır' },
    ],
  },

  // ─── 110 · NASR ───
  110: {
    1: [
      { ar: 'اِذَا جَاءَ', tr: 'geldiği zaman' },
      { ar: 'نَصْرُ اللّٰهِ', tr: "Allah'ın yardımı" },
      { ar: 'وَالْفَتْحُ', tr: 've fetih' },
    ],
    2: [
      { ar: 'وَرَاَيْتَ النَّاسَ', tr: 've insanları gördüğünde' },
      { ar: 'يَدْخُلُونَ', tr: 'girerlerken' },
      { ar: 'فِي دِينِ اللّٰهِ', tr: "Allah'ın dinine", q: '(Nereye?)' },
      { ar: 'اَفْوَاجًا', tr: 'bölük bölük' },
    ],
    3: [
      { ar: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ', tr: 'Rabbini hamd ile tesbih et' },
      { ar: 'وَاسْتَغْفِرْهُ', tr: "ve O'ndan bağışlanma dile" },
      { ar: 'اِنَّهُ كَانَ تَوَّابًا', tr: 'şüphesiz O, tevbeleri çok kabul edendir' },
    ],
  },

  // ─── 111 · TEBBET ───
  111: {
    1: [
      { ar: 'تَبَّتْ يَدَا اَبِي لَهَبٍ', tr: "Ebû Leheb'in iki eli kurusun" },
      { ar: 'وَتَبَّ', tr: 'kurudu da' },
    ],
    2: [
      { ar: 'مَا اَغْنٰى عَنْهُ مَالُهُ', tr: 'malı ona fayda vermedi' },
      { ar: 'وَمَا كَسَبَ', tr: 'kazandıkları da' },
    ],
    3: [
      { ar: 'سَيَصْلٰى نَارًا', tr: 'yakında bir ateşe girecek' },
      { ar: 'ذَاتَ لَهَبٍ', tr: 'alev alev yanan', q: '(Nasıl bir ateş?)' },
    ],
    4: [
      { ar: 'وَامْرَاَتُهُ', tr: 'karısı da' },
      { ar: 'حَمَّالَةَ الْحَطَبِ', tr: 'odun taşıyıcısı olarak' },
    ],
    5: [
      { ar: 'فِي جِيدِهَا', tr: 'boynunda' },
      { ar: 'حَبْلٌ مِنْ مَسَدٍ', tr: 'bükülmüş liften bir ip olduğu hâlde' },
    ],
  },

  // ─── 112 · İHLÂS ───
  112: {
    1: [
      { ar: 'قُلْ', tr: 'de ki' },
      { ar: 'هُوَ اللّٰهُ', tr: 'O Allah' },
      { ar: 'اَحَدٌ', tr: 'birdir, tektir' },
    ],
    2: [
      { ar: 'اَللّٰهُ الصَّمَدُ', tr: "Allah Samed'dir", q: '(her şey O’na muhtaç, O hiçbir şeye muhtaç değil)' },
    ],
    3: [
      { ar: 'لَمْ يَلِدْ', tr: 'doğurmamıştır' },
      { ar: 'وَلَمْ يُولَدْ', tr: 've doğurulmamıştır' },
    ],
    4: [
      { ar: 'وَلَمْ يَكُنْ لَهُ', tr: "ve O'na olmamıştır" },
      { ar: 'كُفُوًا اَحَدٌ', tr: 'hiçbir denk', q: '(Kim denk olabilir? Hiç kimse)' },
    ],
  },

  // ─── 113 · FELÂK ───
  113: {
    1: [
      { ar: 'قُلْ اَعُوذُ', tr: 'de ki: sığınırım' },
      { ar: 'بِرَبِّ الْفَلَقِ', tr: 'sabahın Rabbine', q: '(Kime?)' },
    ],
    2: [
      { ar: 'مِنْ شَرِّ', tr: 'şerrinden' },
      { ar: 'مَا خَلَقَ', tr: 'yarattığı şeylerin', q: '(Neyin şerrinden?)' },
    ],
    3: [
      { ar: 'وَمِنْ شَرِّ غَاسِقٍ', tr: 've karanlığın şerrinden' },
      { ar: 'اِذَا وَقَبَ', tr: 'çöktüğü zaman' },
    ],
    4: [
      { ar: 'وَمِنْ شَرِّ النَّفَّاثَاتِ', tr: 've üfleyenlerin şerrinden' },
      { ar: 'فِي الْعُقَدِ', tr: 'düğümlere', q: '(Nereye üfleyen?)' },
    ],
    5: [
      { ar: 'وَمِنْ شَرِّ حَاسِدٍ', tr: 've hasetçinin şerrinden' },
      { ar: 'اِذَا حَسَدَ', tr: 'haset ettiği zaman' },
    ],
  },

  // ─── 114 · NÂS ───
  114: {
    1: [
      { ar: 'قُلْ اَعُوذُ', tr: 'de ki: sığınırım' },
      { ar: 'بِرَبِّ النَّاسِ', tr: 'insanların Rabbine' },
    ],
    2: [{ ar: 'مَلِكِ النَّاسِ', tr: 'insanların Melik’ine (hükümdarına)' }],
    3: [{ ar: 'اِلٰهِ النَّاسِ', tr: 'insanların İlâh’ına' }],
    4: [
      { ar: 'مِنْ شَرِّ الْوَسْوَاسِ', tr: 'vesvesecinin şerrinden' },
      { ar: 'الْخَنَّاسِ', tr: 'sinsice geri çekilen', q: '(Nasıl bir vesveseci?)' },
    ],
    5: [
      { ar: 'اَلَّذِي يُوَسْوِسُ', tr: 'o ki vesvese verir' },
      { ar: 'فِي صُدُورِ النَّاسِ', tr: 'insanların göğüslerine', q: '(Nereye?)' },
    ],
    6: [
      { ar: 'مِنَ الْجِنَّةِ', tr: 'cinlerden' },
      { ar: 'وَالنَّاسِ', tr: 've insanlardan', q: '(Kimlerden olan?)' },
    ],
  },
};

// Sure için kelime meal var mı?
export const hasWordMeal = (surahNo) => !!WORD_MEAL[Number(surahNo)];
// Ayet için ibare listesi (yoksa null)
export const getWordMeal = (surahNo, verseNo) => WORD_MEAL[Number(surahNo)]?.[Number(verseNo)] || null;

export default WORD_MEAL;
