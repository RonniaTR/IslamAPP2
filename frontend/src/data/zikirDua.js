// frontend/src/data/zikirDua.js
// 📿 ZİKİRLER ve 🤲 SÜNNET DUALARI — Dua ve Zikir bölümünün içeriği.
//
// İlke: Burada YALNIZ hadis kaynaklı (sünnet) zikir ve dualar vardır; Kur'an ayeti olan dualar
// (Rabbenâ duaları vb.) Kur'an bölümü onay sürecinde olduğu için buraya alınmamıştır (bkz. config/quranAccess.js).
// Her maddede Arapça metin, Türkçe okunuş, anlam ve kaynak bulunur. Anlamlar özgün Türkçe ifadedir.
// Kaynak gösterimi: Kitap, Bab (bölüm) numarası — Diyanet hadis atıf düzenine uygun kısa biçim.
// ⚠️ Yayından önce Arapça metinler ve okunuşlar bir hoca/ilahiyatçı tarafından son kez gözden geçirilmelidir.

// ═══════════════ 📿 ZİKİRLER ═══════════════
// adim: tesbih çekerken sırayla geçilen bölümler. hedef: o bölümün tane sayısı.
export const ZIKIRLER = [
  {
    id: 'namaz-tesbihati', ad: 'Namaz Tesbihatı', kisa: 'Her farzdan sonra',
    kaynak: 'Müslim, Mesâcid 146',
    fazilet: 'Her namazdan sonra 33 sübhânallah, 33 elhamdülillâh, 33 Allâhu ekber deyip yüzü tehlil ile tamamlayanın hataları bağışlanır.',
    adim: [
      { ar: 'سُبْحَانَ اللّٰهِ', oku: 'Sübhânallâh', anlam: "Allah'ı her türlü eksiklikten tenzih ederim.", hedef: 33 },
      { ar: 'اَلْحَمْدُ لِلّٰهِ', oku: 'Elhamdülillâh', anlam: "Hamd yalnız Allah'adır.", hedef: 33 },
      { ar: 'اَللّٰهُ أَكْبَرُ', oku: 'Allâhu ekber', anlam: 'Allah en büyüktür.', hedef: 33 },
      { ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', oku: "Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehü'l-mülkü ve lehü'l-hamdü ve hüve alâ külli şey'in kadîr", anlam: "Allah'tan başka ilâh yoktur; O tektir, ortağı yoktur. Mülk O'nundur, hamd O'nadır ve O her şeye kadirdir.", hedef: 1 },
    ],
  },
  {
    id: 'tesbih-hamd', ad: 'Tesbih ve Hamd', kisa: 'Günde yüz kez',
    kaynak: 'Buhârî, Deavât 65; Müslim, Zikir 28',
    fazilet: 'Günde yüz kez söyleyenin hataları deniz köpüğü kadar olsa bile bağışlanır.',
    adim: [{ ar: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ', oku: 'Sübhânallâhi ve bihamdihî', anlam: "Allah'ı hamd ile tesbih ederim.", hedef: 100 }],
  },
  {
    id: 'iki-kelime', ad: 'Mizanda Ağır İki Söz', kisa: 'Dile hafif, mizanda ağır',
    kaynak: 'Buhârî, Deavât 65; Müslim, Zikir 31',
    fazilet: "Dile hafif, mizanda ağır, Rahmân'a sevimli iki söz.",
    adim: [{ ar: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ، سُبْحَانَ اللّٰهِ الْعَظِيمِ', oku: "Sübhânallâhi ve bihamdihî, sübhânallâhi'l-azîm", anlam: "Allah'ı hamd ile tesbih ederim; yüce Allah'ı tesbih ederim.", hedef: 33 }],
  },
  {
    id: 'istigfar', ad: 'İstiğfar', kisa: 'Kalbin cilası',
    kaynak: 'Müslim, Zikir 42',
    fazilet: 'Efendimiz (s.a.v.) günde yüz kez Allah’a tövbe ettiğini haber vermiştir.',
    adim: [{ ar: 'أَسْتَغْفِرُ اللّٰهَ', oku: 'Estağfirullâh', anlam: "Allah'tan bağışlanma dilerim.", hedef: 100 }],
  },
  {
    id: 'salavat', ad: 'Salavât-ı Şerîfe', kisa: 'Bir salavata on rahmet',
    kaynak: 'Müslim, Salât 70',
    fazilet: 'Bana bir salavat getirene Allah on rahmet eder.',
    adim: [{ ar: 'اَللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ', oku: 'Allâhümme salli alâ Muhammedin ve alâ âli Muhammed', anlam: "Allah'ım! Muhammed'e ve onun âline salât eyle.", hedef: 100 }],
  },
  {
    id: 'havkale', ad: 'Havkale', kisa: 'Cennet hazinesi',
    kaynak: 'Buhârî, Deavât 50; Müslim, Zikir 44',
    fazilet: 'Cennet hazinelerinden bir hazinedir.',
    adim: [{ ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ', oku: 'Lâ havle ve lâ kuvvete illâ billâh', anlam: "Güç ve kuvvet ancak Allah'tandır.", hedef: 33 }],
  },
  {
    id: 'tevhid', ad: 'Kelime-i Tevhid', kisa: 'Zikrin en faziletlisi',
    kaynak: 'Tirmizî, Deavât 9',
    fazilet: 'Zikrin en faziletlisi lâ ilâhe illallâhtır.',
    adim: [{ ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ', oku: 'Lâ ilâhe illallâh', anlam: "Allah'tan başka ilâh yoktur.", hedef: 100 }],
  },
  {
    id: 'dort-soz', ad: 'En Sevimli Dört Söz', kisa: 'Hangisiyle başlasan olur',
    kaynak: 'Müslim, Âdâb 12',
    fazilet: "Allah'a en sevimli sözler dörttür; hangisiyle başladığının bir zararı yoktur.",
    adim: [{ ar: 'سُبْحَانَ اللّٰهِ، وَالْحَمْدُ لِلّٰهِ، وَلَا إِلٰهَ إِلَّا اللّٰهُ، وَاللّٰهُ أَكْبَرُ', oku: 'Sübhânallâh, velhamdülillâh, ve lâ ilâhe illallâh, vallâhu ekber', anlam: "Allah eksiksizdir; hamd Allah'adır; Allah'tan başka ilâh yoktur; Allah en büyüktür.", hedef: 33 }],
  },
  {
    id: 'tehlil', ad: 'Tehlîl', kisa: 'Günde yüz kez',
    kaynak: 'Buhârî, Deavât 64; Müslim, Zikir 28',
    fazilet: 'Günde yüz kez söyleyene büyük sevap yazılır ve o gün akşama kadar şeytandan korunur.',
    adim: [{ ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', oku: "Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehü'l-mülkü ve lehü'l-hamdü ve hüve alâ külli şey'in kadîr", anlam: "Allah'tan başka ilâh yoktur; O tektir, ortağı yoktur. Mülk O'nundur, hamd O'nadır ve O her şeye kadirdir.", hedef: 100 }],
  },
  {
    id: 'ya-hayyu', ad: 'Yâ Hayyu Yâ Kayyûm', kisa: 'Sıkıntı anında',
    kaynak: 'Tirmizî, Deavât 91',
    fazilet: 'Efendimiz (s.a.v.) bir sıkıntıyla karşılaştığında bu sözle dua ederdi.',
    adim: [{ ar: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', oku: 'Yâ Hayyu yâ Kayyûm, bi rahmetike esteğîs', anlam: 'Ey diri olan, ey her şeyi ayakta tutan! Rahmetinle yardım dilerim.', hedef: 33 }],
  },
];

/** Serbest tesbih: hedefi kişi seçer (33 · 99 · 100 · sınırsız). */
export const SERBEST = {
  id: 'serbest', ad: 'Serbest Tesbih', kisa: 'Kendi zikrin', kaynak: '', fazilet: '',
  adim: [{ ar: '', oku: '', anlam: 'Dilediğin zikri çek; hedefi sen seç.', hedef: 33 }],
};

export function zikirBul(id) {
  if (id === 'serbest') return SERBEST;
  return ZIKIRLER.find((z) => z.id === id) || null;
}

// ═══════════════ 🤲 SÜNNET DUALARI ═══════════════
export const DUA_KATEGORILERI = [
  { id: 'sabah', ad: 'Sabah · Akşam' },
  { id: 'namaz', ad: 'Abdest · Namaz' },
  { id: 'ev', ad: 'Ev · Sofra' },
  { id: 'uyku', ad: 'Uyku' },
  { id: 'sifa', ad: 'Sıkıntı · Şifa' },
  { id: 'kalp', ad: 'İlim · Kalp' },
  { id: 'gun', ad: 'Gün içinde' },
];

export const DUALAR = [
  // Sabah · Akşam
  { id: 'sabah', kat: 'sabah', ad: 'Sabah duası', ne: 'Sabaha erişince',
    ar: 'اَللّٰهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    oku: "Allâhümme bike asbahnâ, ve bike emseynâ, ve bike nahyâ, ve bike nemûtü, ve ileyke'n-nüşûr",
    anlam: "Allah'ım! Senin (nimetin ve korumanla) sabaha erdik, seninle akşama erdik; seninle yaşar, seninle ölürüz. Dönüş sanadır.",
    kaynak: 'Tirmizî, Deavât 13; Ebû Dâvûd, Edeb 101' },
  { id: 'aksam', kat: 'sabah', ad: 'Akşam duası', ne: 'Akşama erişince',
    ar: 'اَللّٰهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    oku: "Allâhümme bike emseynâ, ve bike asbahnâ, ve bike nahyâ, ve bike nemûtü, ve ileyke'l-masîr",
    anlam: "Allah'ım! Seninle akşama erdik, seninle sabaha erdik; seninle yaşar, seninle ölürüz. Varış sanadır.",
    kaynak: 'Tirmizî, Deavât 13; Ebû Dâvûd, Edeb 101' },
  { id: 'seyyidul-istigfar', kat: 'sabah', ad: 'Seyyidü’l-İstiğfâr', ne: 'Sabah ve akşam',
    ar: 'اَللّٰهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    oku: "Allâhümme ente rabbî lâ ilâhe illâ ente, halaktenî ve ene abdük, ve ene alâ ahdike ve va'dike me'steta'tü, eûzü bike min şerri mâ sana'tü, ebûü leke bi ni'metike aleyye, ve ebûü bi zenbî, fağfir lî, fe innehû lâ yağfiru'z-zünûbe illâ ente",
    anlam: "Allah'ım! Sen benim Rabbimsin; senden başka ilâh yoktur. Beni sen yarattın, ben senin kulunum. Gücüm yettiğince sana verdiğim söz ve ahit üzereyim. Yaptıklarımın kötülüğünden sana sığınırım. Bana verdiğin nimeti ikrar eder, günahımı itiraf ederim. Beni bağışla; çünkü günahları ancak sen bağışlarsın.",
    kaynak: 'Buhârî, Deavât 2', not: 'İstiğfarın efendisi. Gündüz inanarak söyleyip akşama varmadan ölen cennetliktir; gece söyleyen için de böyledir.' },
  { id: 'afiyet', kat: 'sabah', ad: 'Afiyet duası', ne: 'Sabah ve akşam',
    ar: 'اَللّٰهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    oku: "Allâhümme innî es'elüke'l-afve ve'l-âfiyete fi'd-dünyâ ve'l-âhire",
    anlam: "Allah'ım! Senden dünyada ve ahirette af ve afiyet isterim.",
    kaynak: 'Ebû Dâvûd, Edeb 101; İbn Mâce, Dua 14' },

  // Abdest · Namaz
  { id: 'abdest-sonrasi', kat: 'namaz', ad: 'Abdestten sonra', ne: 'Abdest bitince',
    ar: 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    oku: 'Eşhedü en lâ ilâhe illallâhu vahdehû lâ şerîke leh, ve eşhedü enne Muhammeden abdühû ve rasûlüh',
    anlam: "Şahitlik ederim ki Allah'tan başka ilâh yoktur; O tektir, ortağı yoktur. Yine şahitlik ederim ki Muhammed O'nun kulu ve elçisidir.",
    kaynak: 'Müslim, Tahâret 17', not: 'Güzelce abdest alıp bunu söyleyene cennetin sekiz kapısı açılır.' },
  { id: 'selamdan-sonra', kat: 'namaz', ad: 'Selâmdan sonra', ne: 'Namazın selâmında',
    ar: 'اَللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    oku: "Allâhümme ente's-selâmü ve minke's-selâm, tebârekte yâ ze'l-celâli ve'l-ikrâm",
    anlam: "Allah'ım! Sen Selâm'sın; esenlik sendendir. Ey celâl ve ikram sahibi, sen ne yücesin!",
    kaynak: 'Müslim, Mesâcid 136' },
  { id: 'mescide-giris', kat: 'namaz', ad: 'Mescide girerken', ne: 'Camiye girerken',
    ar: 'اَللّٰهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    oku: "Allâhümme'ftah lî ebvâbe rahmetik",
    anlam: "Allah'ım! Bana rahmetinin kapılarını aç.",
    kaynak: 'Müslim, Müsâfirîn 68' },
  { id: 'mescitten-cikis', kat: 'namaz', ad: 'Mescitten çıkarken', ne: 'Camiden çıkarken',
    ar: 'اَللّٰهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    oku: "Allâhümme innî es'elüke min fadlik",
    anlam: "Allah'ım! Senin lütfundan isterim.",
    kaynak: 'Müslim, Müsâfirîn 68' },

  // Ev · Sofra
  { id: 'yemek-basi', kat: 'ev', ad: 'Yemeğe başlarken', ne: 'Sofraya oturunca',
    ar: 'بِسْمِ اللّٰهِ', oku: 'Bismillâh', anlam: "Allah'ın adıyla.",
    kaynak: 'Buhârî, Et’ime 2' },
  { id: 'besmele-unutunca', kat: 'ev', ad: 'Besmeleyi unutunca', ne: 'Yemeğin ortasında hatırlayınca',
    ar: 'بِسْمِ اللّٰهِ أَوَّلَهُ وَآخِرَهُ', oku: 'Bismillâhi evvelehû ve âhirah', anlam: "Başında da sonunda da Allah'ın adıyla.",
    kaynak: 'Ebû Dâvûd, Et’ime 16; Tirmizî, Et’ime 47' },
  { id: 'yemek-sonu', kat: 'ev', ad: 'Yemekten sonra', ne: 'Sofradan kalkarken',
    ar: 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنِي هٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    oku: "Elhamdü lillâhillezî et'amenî hâzâ ve rezakanîhi min ğayri havlin minnî ve lâ kuvveh",
    anlam: "Bana bu yemeği yediren ve benden hiçbir güç ve kuvvet olmaksızın onu bana rızık olarak veren Allah'a hamd olsun.",
    kaynak: 'Ebû Dâvûd, Libâs 1; Tirmizî, Deavât 56' },
  { id: 'evden-cikis', kat: 'ev', ad: 'Evden çıkarken', ne: 'Kapıdan çıkınca',
    ar: 'بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ',
    oku: "Bismillâhi tevekkeltü ala'llâh, lâ havle ve lâ kuvvete illâ billâh",
    anlam: "Allah'ın adıyla; Allah'a tevekkül ettim. Güç ve kuvvet ancak Allah'tandır.",
    kaynak: 'Ebû Dâvûd, Edeb 103; Tirmizî, Deavât 34' },
  { id: 'elbise', kat: 'ev', ad: 'Yeni elbise giyince', ne: 'Giyinirken',
    ar: 'اَلْحَمْدُ لِلّٰهِ الَّذِي كَسَانِي هٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    oku: "Elhamdü lillâhillezî kesânî hâzâ ve rezakanîhi min ğayri havlin minnî ve lâ kuvveh",
    anlam: "Bana bunu giydiren ve benden hiçbir güç ve kuvvet olmaksızın onu bana rızık olarak veren Allah'a hamd olsun.",
    kaynak: 'Ebû Dâvûd, Libâs 1' },
  { id: 'tuvalet', kat: 'ev', ad: 'Helâya girerken', ne: 'Girmeden önce',
    ar: 'اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    oku: "Allâhümme innî eûzü bike mine'l-hubusi ve'l-habâis",
    anlam: "Allah'ım! Her türlü pislikten ve kötülükten, erkek ve dişi şeytanlardan sana sığınırım.",
    kaynak: 'Buhârî, Vudû 9; Müslim, Hayz 122' },

  // Uyku
  { id: 'uyurken', kat: 'uyku', ad: 'Uyumadan önce', ne: 'Yatağa uzanınca',
    ar: 'بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا', oku: "Bismike'llâhümme emûtü ve ahyâ",
    anlam: "Allah'ım! Senin adınla ölür (uyur) ve dirilirim (uyanırım).",
    kaynak: 'Buhârî, Deavât 7' },
  { id: 'uyaninca', kat: 'uyku', ad: 'Uyanınca', ne: 'Gözünü açınca',
    ar: 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    oku: "Elhamdü lillâhillezî ahyânâ ba'de mâ emâtenâ ve ileyhi'n-nüşûr",
    anlam: "Bizi öldürdükten (uyuttuktan) sonra dirilten Allah'a hamd olsun; dönüş O'nadır.",
    kaynak: 'Buhârî, Deavât 7' },

  // Sıkıntı · Şifa
  { id: 'sikinti', kat: 'sifa', ad: 'Sıkıntı anında', ne: 'Daralınca',
    ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلٰهَ إِلَّا اللّٰهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلٰهَ إِلَّا اللّٰهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    oku: "Lâ ilâhe illallâhü'l-azîmü'l-halîm, lâ ilâhe illallâhu rabbü'l-arşi'l-azîm, lâ ilâhe illallâhu rabbü's-semâvâti ve rabbü'l-ardı ve rabbü'l-arşi'l-kerîm",
    anlam: "Azîm ve Halîm olan Allah'tan başka ilâh yoktur. Büyük Arş'ın Rabbi Allah'tan başka ilâh yoktur. Göklerin Rabbi, yerin Rabbi ve şerefli Arş'ın Rabbi Allah'tan başka ilâh yoktur.",
    kaynak: 'Buhârî, Deavât 27; Müslim, Zikir 83' },
  { id: 'huzun', kat: 'sifa', ad: 'Kaygı ve hüzünde', ne: 'İçin sıkıldığında',
    ar: 'اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    oku: "Allâhümme innî eûzü bike mine'l-hemmi ve'l-hazen, ve'l-aczi ve'l-kesel, ve'l-buhli ve'l-cübn, ve dala'i'd-deyni ve ğalebeti'r-ricâl",
    anlam: "Allah'ım! Kaygıdan ve üzüntüden, acizlikten ve tembellikten, cimrilikten ve korkaklıktan, borç yükünden ve insanların baskısından sana sığınırım.",
    kaynak: 'Buhârî, Deavât 36' },
  { id: 'sifa', kat: 'sifa', ad: 'Hastaya şifa duası', ne: 'Hasta ziyaretinde',
    ar: 'اَللّٰهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    oku: "Allâhümme rabbe'n-nâs, ezhibi'l-be's, işfi ente'ş-şâfî, lâ şifâe illâ şifâük, şifâen lâ yuğâdiru sekamâ",
    anlam: "Allah'ım! Ey insanların Rabbi! Sıkıntıyı gider, şifa ver; şifa veren sensin. Senin şifandan başka şifa yoktur. Hiçbir hastalık bırakmayan bir şifa ver.",
    kaynak: 'Buhârî, Merdâ 20; Müslim, Selâm 46' },

  // İlim · Kalp
  { id: 'kalp-sebat', kat: 'kalp', ad: 'Kalbin sebatı için', ne: 'Her zaman',
    ar: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    oku: 'Yâ mukallibe’l-kulûb, sebbit kalbî alâ dînik',
    anlam: 'Ey kalpleri evirip çeviren! Kalbimi dinin üzere sabit kıl.',
    kaynak: 'Tirmizî, Kader 7' },
  { id: 'ilim', kat: 'kalp', ad: 'Faydalı ilim için', ne: 'Derse başlarken',
    ar: 'اَللّٰهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا',
    oku: "Allâhümme'nfa'nî bimâ allemtenî, ve allimnî mâ yenfa'unî, ve zidnî ilmâ",
    anlam: "Allah'ım! Bana öğrettiklerinle beni faydalandır, bana fayda verecek olanı öğret ve ilmimi artır.",
    kaynak: 'Tirmizî, Deavât 128; İbn Mâce, Mukaddime 23' },
  { id: 'huda', kat: 'kalp', ad: 'Hidayet ve takva', ne: 'Günün her vakti',
    ar: 'اَللّٰهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    oku: "Allâhümme innî es'elüke'l-hüdâ ve't-tükâ ve'l-afâfe ve'l-ğınâ",
    anlam: "Allah'ım! Senden hidayet, takva, iffet ve gönül zenginliği isterim.",
    kaynak: 'Müslim, Zikir 72' },
  { id: 'af', kat: 'kalp', ad: 'Af dilemek', ne: 'Kadir gecesi ve her zaman',
    ar: 'اَللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    oku: "Allâhümme inneke afüvvün tuhibbü'l-afve fa'fu annî",
    anlam: "Allah'ım! Sen affedicisin, affetmeyi seversin; beni affet.",
    kaynak: 'Tirmizî, Deavât 84' },

  // Gün içinde
  { id: 'hapsirinca', kat: 'gun', ad: 'Hapşırınca', ne: 'Hapşırdığında',
    ar: 'اَلْحَمْدُ لِلّٰهِ', oku: 'Elhamdülillâh', anlam: "Hamd Allah'adır.",
    kaynak: 'Buhârî, Edeb 126',
    not: 'Duyan "Yerhamükellah" (Allah sana rahmet etsin) der; hapşıran da "Yehdîkümullâhu ve yuslihu bâleküm" (Allah sizi hidayete erdirsin ve hâlinizi düzeltsin) diye karşılık verir.' },
  { id: 'ofke', kat: 'gun', ad: 'Öfkelenince', ne: 'Sinir kabardığında',
    ar: 'أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', oku: "Eûzü billâhi mine'ş-şeytâni'r-racîm",
    anlam: "Kovulmuş şeytandan Allah'a sığınırım.",
    kaynak: 'Buhârî, Edeb 76; Müslim, Birr 109' },
  { id: 'yolcuya-veda', kat: 'gun', ad: 'Yolcuyu uğurlarken', ne: 'Veda ederken',
    ar: 'أَسْتَوْدِعُ اللّٰهَ دِينَكَ وَأَمَانَتَكَ وَخَوَاتِيمَ عَمَلِكَ',
    oku: "Esteûdiu'llâhe dîneke ve emânetek ve havâtîme amelik",
    anlam: "Dinini, emanetini ve amellerinin sonunu Allah'a emanet ediyorum.",
    kaynak: 'Ebû Dâvûd, Cihâd 80; Tirmizî, Deavât 44' },
  { id: 'yagmur', kat: 'gun', ad: 'Yağmur yağınca', ne: 'Yağmur başlayınca',
    ar: 'اَللّٰهُمَّ صَيِّبًا نَافِعًا', oku: "Allâhümme sayyiben nâfi'â",
    anlam: "Allah'ım! Faydalı bir yağmur eyle.",
    kaynak: 'Buhârî, İstiskâ 23' },
];
