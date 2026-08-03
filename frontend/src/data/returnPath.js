// frontend/src/data/returnPath.js
// 🕯️ GERİ DÖNÜŞ — KIRK GÜNLÜK MÜFREDAT
//
// Uzun süre ara vermiş, dönmek isteyen kişi için gün gün yazılmış yol.
// Her gün beş parçadan oluşur:
//   reading  — 2-3 paragraflık kısa okuma (özgün ifade, telifsiz)
//   source   — o günün ayeti veya hadisi + kaynağı
//   dua      — Arapça metin + meal + kaynak
//   step     — o gün yapılacak SOMUT tek adım
//   question — akşama bırakılan tefekkür sorusu
//
// TON KURALI (ReturnIntro.jsx ile aynı):
//   "Bu cümleyi 5 yıl namaz kılmamış birinin yüzüne söyleyebilir miyim?"
// "Geride kaldın", "kaçırdın", "telafi et", "kaybettiğin yıllar" gibi
// ifadeler bu dosyada KULLANILMAZ. Suçlama yok; kapı ve davet var.
//
// KAYNAK KURALI: Ayet mealleri özgün ifadeyle verilmiştir (hazır meal
// kopyalanmaz), sûre ve âyet numarası belirtilir. Hadisler kaynak
// külliyatı ve bâbıyla anılır. Duaların Arapçası ya Kur'an metnidir ya
// da meşhur me'sûr dualardır.

export const RETURN_PHASES = [
  { id: 'kapi',  emoji: '🚪', name: 'Kapı',     from: 1,  to: 7,
    desc: 'Dönüşün kendisi — niyet, ümit ve ilk adım' },
  { id: 'temel', emoji: '🕌', name: 'Temel',    from: 8,  to: 16,
    desc: 'Namaz yeniden — abdestten ilk vakte' },
  { id: 'bag',   emoji: '📖', name: 'Bağ',      from: 17, to: 26,
    desc: "Kur'an ve zikir — dilin ve kalbin bağı" },
  { id: 'ahlak', emoji: '🌿', name: 'Ahlak',    from: 27, to: 34,
    desc: 'Amelin insana dönüşmesi' },
  { id: 'kok',   emoji: '🌳', name: 'Kökleşme', from: 35, to: 40,
    desc: 'Kırk günden sonrası' },
];

export const RETURN_DAYS = [
  // ───────────────────────── FAZ 1 · KAPI (1-7) ─────────────────────────
  {
    day: 1, phase: 'kapi',
    title: `Kapı hep açıktı`,
    lead: `Bugün geldin. Başlangıç bu.`,
    reading: [
      `Bir kapı düşün: yıllardır açık duruyor, kimse onu kapatmadı. Sen uzaktaydın, kapı yerindeydi. Bugün eşikten içeri adım attın. Bu satırları okuyor olman, o adımın kendisi.`,
      `Geri dönenlerin çoğu ilk günü bir hesaplaşmayla geçirir: kaç yıl, ne kadar, neden. Bu yol öyle başlamıyor. Çünkü Allah kendi kitabında, kendine karşı en çok hata etmiş kullarına sesleniyor ve onlara "ümit kesmeyin" diyor. Bu çağrı bir istisna değil, kapının kendisi.`,
      `Bugün senden tek bir şey isteniyor: kalmak. Yarın gelmeyi düşünme, dünü hesaplama. Sadece bugün buradasın — bu yeter.`,
    ],
    source: {
      text: `De ki: Kendi aleyhine haddi aşmış olan kullarım! Allah'ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları bağışlar; O çok bağışlayan, çok merhamet edendir.`,
      ref: `Zümer sûresi, 53`,
    },
    dua: {
      ar: `رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ`,
      tr: `Rabbimiz! Biz kendimize yazık ettik. Eğer bizi bağışlamaz ve bize merhamet etmezsen elbette hüsrana uğrayanlardan oluruz.`,
      ref: `A'râf sûresi, 23 — Hz. Âdem'in duası`,
    },
    step: {
      title: `Bir cümle söyle`,
      desc: `Sesli ya da içinden, tek bir cümle kur: "Döndüm." Kimseye anlatmana gerek yok. Başlangıç ilan edilmez, yapılır.`,
    },
    question: `Bugün buraya gelmene ne sebep oldu?`,
  },
  {
    day: 2, phase: 'kapi',
    title: `Tövbe "dönmek" demektir`,
    lead: `Bir ceza değil, bir yön değişikliği.`,
    reading: [
      `Tövbe kelimesi Arapçada "dönmek" anlamına gelir. Bir suçun itirafından çok, bir yönün değişmesidir. Yolda ters istikamete gidiyordun, durdun ve döndün. Yapılan iş bu kadar sade.`,
      `Çoğu insan tövbeyi ağır bir tören sanır: uzun formüller, gözyaşı, uzun bir liste. Oysa şartları üçtür ve hepsi kalbe aittir — yaptığından pişman olmak, o işi bırakmak, bir daha dönmemeye niyet etmek. Kul hakkı varsa dördüncüsü eklenir: hakkı sahibine iade etmek.`,
      `Bugün bir liste yapma. Sadece yönünü değiştirdiğini kabul et. Liste, yolda ilerledikçe kendiliğinden kısalır.`,
    ],
    source: {
      text: `Şüphesiz Allah çokça tövbe edenleri sever, temizlenenleri de sever.`,
      ref: `Bakara sûresi, 222`,
    },
    dua: {
      ar: `أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ`,
      tr: `Kendisinden başka ilah olmayan, diri ve her şeyi ayakta tutan yüce Allah'tan bağışlanma diler ve O'na yönelirim.`,
      ref: `Ebû Dâvûd, Vitr 26`,
    },
    step: {
      title: `Üç kez istiğfar`,
      desc: `Yukarıdaki istiğfarı üç kez oku. Anlamını bilerek okumak, yüz kez düşünmeden okumaktan hayırlıdır.`,
    },
    question: `Tövbeyi bugüne kadar neden ağır bir şey sandın?`,
  },
  {
    day: 3, phase: 'kapi',
    title: `Sana taşıyamayacağın yük verilmedi`,
    lead: `Din kolaylık üzerine kuruludur.`,
    reading: [
      `Geri dönenlerin en büyük korkusu şudur: "Ben bunların hepsini yapamam." Haklı bir korku, ama yanlış bir varsayıma dayanıyor. Kimse senden bir günde her şeyi yapmanı beklemiyor.`,
      `Kur'an'ın bu konudaki cümlesi çok net: Allah hiç kimseye gücünün üstünde bir şey yüklemez. Bu bir teselli cümlesi değil, bir ölçü cümlesi. Yapabildiğin kadarı, senden istenen kadarıdır.`,
      `Peygamber Efendimiz de ashabına din öğretirken hep aynı şeyi söyledi: kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin. Bu, başkalarına olduğu kadar kendine karşı da geçerli bir emirdir.`,
    ],
    source: {
      text: `Allah hiçbir kimseye gücünün yeteceğinden fazlasını yüklemez.`,
      ref: `Bakara sûresi, 286`,
    },
    dua: {
      ar: `رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا`,
      tr: `Rabbimiz! Unutur veya hata edersek bizi sorumlu tutma.`,
      ref: `Bakara sûresi, 286`,
    },
    step: {
      title: `Bir şeyi eksilt`,
      desc: `Kafanda kurduğun "yapmam gereken şeyler" listesinden bir maddeyi bugünlük çıkar. Yükü hafifletmek de bir ibadet usulüdür.`,
    },
    question: `Kendinden hangi konuda gereğinden fazlasını istiyorsun?`,
  },
  {
    day: 4, phase: 'kapi',
    title: `Az ama devamlı`,
    lead: `Yolun tek kuralı bu.`,
    reading: [
      `Bu yolun tamamı tek bir hadise dayanıyor: Allah'a en sevimli amel, az da olsa devamlı olanıdır. Bir gün elli, sonra otuz gün sıfır değil; her gün bir.`,
      `Sebebi psikolojik değil, kalbe dair. Kesintili yoğunluk kişiyi yorar ve suçluluk üretir. Küçük ama düzenli amel ise kalpte bir yer açar; o yer zamanla kendiliğinden genişler.`,
      `Bu yüzden ilk günlerde sana tek görev veriliyor. Az bulman iyiye işaret — yapabileceğin kadarı, sürdürebileceğin kadarıdır.`,
    ],
    source: {
      text: `Allah'a amellerin en sevimlisi, az da olsa devamlı olanıdır.`,
      ref: `Buhârî, Rikāk 18; Müslim, Müsâfirîn 216`,
    },
    dua: {
      ar: `اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ`,
      tr: `Allahım! Seni anmak, sana şükretmek ve sana güzelce kulluk etmek konusunda bana yardım et.`,
      ref: `Ebû Dâvûd, Vitr 26`,
    },
    step: {
      title: `Bir vakit belirle`,
      desc: `Günün hangi diliminde bu uygulamayı açacağını seç — sabah kahvesi, öğle arası, yatmadan önce. Saat değil, çapa seçiyorsun.`,
    },
    question: `Hangi alışkanlığın yanına bunu iliştirebilirsin?`,
  },
  {
    day: 5, phase: 'kapi',
    title: `Niyet, amelin kendisidir`,
    lead: `Yapamadığın iyilik bile yazılır.`,
    reading: [
      `İslam'da bir amelin değerini belirleyen şey miktarı değil, niyetidir. Aynı işi iki kişi yapar; biri sevap kazanır, diğeri kazanmaz. Fark, kalpteki yöneliştedir.`,
      `Bu ölçü geri dönen için özellikle mühimdir. Çünkü henüz yapabildiğin şey azdır; ama niyetin geniştir. Ve niyet, kendi başına yazılan bir ameldir. Bir iyiliği yapmaya karar verip yapamasan bile, o karar boşa gitmez.`,
      `Bugün elinden geleni yap, geri kalanı niyetine emanet et. Niyet bir vaat değil, bir yöndür.`,
    ],
    source: {
      text: `Ameller ancak niyetlere göredir ve herkese niyet ettiği şey vardır.`,
      ref: `Buhârî, Bedü'l-Vahy 1; Müslim, İmâre 155`,
    },
    dua: {
      ar: `اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا`,
      tr: `Allahım! Senden faydalı ilim, temiz rızık ve kabul edilmiş amel isterim.`,
      ref: `İbn Mâce, İkāmet 32`,
    },
    step: {
      title: `Niyetini söyle`,
      desc: `"Bu kırk günü Allah rızası için yürüyeceğim" de. Niyet dille söylenince kalpte netleşir.`,
    },
    question: `Bu yola çıkarken asıl niyetin ne?`,
  },
  {
    day: 6, phase: 'kapi',
    title: `Devesini bulan adam`,
    lead: `Dönüşüne kimse senden çok sevinmiyor.`,
    reading: [
      `Peygamber Efendimiz bir kulun tövbesine Allah'ın ne kadar sevindiğini anlatırken bir tablo çizer: Issız bir çölde adamın devesi kaçar; üzerinde yiyeceği ve suyu vardır. Adam ölümü bekleyerek bir ağacın gölgesine uzanır. Gözünü açtığında deve karşısında durmaktadır.`,
      `Adamın o andaki sevincini tarif eder ve şöyle der: Allah, kulunun tövbesine bundan daha çok sevinir. Anlatının gücü, sevincin kime ait olduğunda.`,
      `Bu, geri dönen için en zor kabul edilen fikirdir: dönüşünle sen değil, öncelikle O seviniyor. Utanç değil, karşılanma var.`,
    ],
    source: {
      text: `Allah, kulunun tövbesine, çölde devesini kaybedip sonra onu bulan kimsenin sevincinden daha çok sevinir.`,
      ref: `Buhârî, Deavât 4; Müslim, Tevbe 7`,
    },
    dua: {
      ar: `اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ`,
      tr: `Allahım! Sen benim Rabbimsin, senden başka ilah yoktur. Beni sen yarattın, ben senin kulunum.`,
      ref: `Seyyidü'l-İstiğfar'dan — Buhârî, Deavât 2`,
    },
    step: {
      title: `Bugünü utançsız geçir`,
      desc: `Aklına geçmişten bir sahne geldiğinde onunla tartışma; "o kapı kapandı" de ve bugüne dön. Bu bir kaçış değil, bir sınır.`,
    },
    question: `Kendini affetmen neden başkasını affetmenden zor?`,
  },
  {
    day: 7, phase: 'kapi',
    title: `İlk hafta`,
    lead: `Geriye bak — hesap için değil, şükür için.`,
    reading: [
      `Yedi gün önce belki de bu satırların olacağını bilmiyordun. Şimdi bir haftalık bir yolun var. Bu hafta boyunca kaç günü tam yaptın, kaçını atladın — bugün önemli olan bu değil.`,
      `Önemli olan şu: bir hafta önce yoktu, şimdi var. Yoktan var olan her şey gibi, bu da korunmayı hak ediyor.`,
      `İkinci hafta namazla başlıyor. Korkma; oraya da tek adımla giriyoruz.`,
    ],
    source: {
      text: `Andolsun, şükrederseniz elbette size nimetimi artırırım.`,
      ref: `İbrâhîm sûresi, 7`,
    },
    dua: {
      ar: `الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ`,
      tr: `Nimetiyle iyiliklerin tamamlandığı Allah'a hamd olsun.`,
      ref: `İbn Mâce, Edeb 55`,
    },
    step: {
      title: `Bir hafta yaz`,
      desc: `Amel Defteri'ne tek bir cümle yaz: bu hafta senin için ne değişti. Uzun olmasın; bir cümle yeter.`,
    },
    question: `Bu hafta seni en çok ne şaşırttı?`,
  },

  // ──────────────────────── FAZ 2 · TEMEL (8-16) ────────────────────────
  {
    day: 8, phase: 'temel',
    title: `Abdest: bedenin niyeti`,
    lead: `Namazdan önce gelen sessiz hazırlık.`,
    reading: [
      `Abdest sadece bir temizlik değil, bir geçiştir. Ellerini, yüzünü, kollarını yıkarken günün tozunu değil, dağınıklığını bırakırsın. Namaza girmeden önce beden niyetini alır.`,
      `Sırası basittir: eller, ağız, burun, yüz, dirseklere kadar kollar, başın meshi, kulaklar, topuklara kadar ayaklar. Unutursan telaşlanma; öğrenmek de yolun parçası.`,
      `Abdestin ardından okunan kısa bir dua vardır. Onu ezberlemek, abdesti bir alışkanlıktan bir ana çevirir.`,
    ],
    source: {
      text: `Temizlik imanın yarısıdır.`,
      ref: `Müslim, Tahâret 1`,
    },
    dua: {
      ar: `أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`,
      tr: `Şahitlik ederim ki Allah'tan başka ilah yoktur, O tektir, ortağı yoktur; ve şahitlik ederim ki Muhammed O'nun kulu ve elçisidir.`,
      ref: `Abdest sonrası duası — Müslim, Tahâret 17`,
    },
    step: {
      title: `Bir kez abdest al`,
      desc: `Bugün bir kez, acele etmeden abdest al. Namaz kılmayacak olsan bile. Bedenin hafızası kalbinkinden güçlüdür.`,
    },
    question: `Abdest aldığında ne hissettin?`,
  },
  {
    day: 9, phase: 'temel',
    title: `Namaz nedir`,
    lead: `Bir borç değil, günde beş randevu.`,
    reading: [
      `Namazı çoğu zaman bir yükümlülük olarak öğreniriz: kılınması gereken, kılınmazsa borç yazılan bir şey. Oysa Kur'an onu bir sonuçla tarif eder — namaz insanı çirkinlikten ve kötülükten alıkoyar.`,
      `Yani namaz, ödenen bir borç değil; insanı koruyan bir çerçevedir. Günde beş kez durursun, yönünü hatırlarsın, sonra hayatına dönersin. Aradaki saatler o duraklarla biçimlenir.`,
      `Bu yüzden "kaç vakit kaçırdım" sorusu yerine "bugün hangi vakti tutabilirim" sorusu daha doğrudur. Namaz geçmişi kurtarmaya değil, bugünü ayakta tutmaya gelir.`,
    ],
    source: {
      text: `Şüphesiz namaz, hayâsızlıktan ve kötülükten alıkoyar.`,
      ref: `Ankebût sûresi, 45`,
    },
    dua: {
      ar: `رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي`,
      tr: `Rabbim! Beni ve soyumdan gelenleri namazı gereğince kılanlardan eyle.`,
      ref: `İbrâhîm sûresi, 40`,
    },
    step: {
      title: `Vakitleri öğren`,
      desc: `Bulunduğun yerin bugünkü beş vakit saatine bak. Kılmak zorunda değilsin; sadece gün içinde nerede durduklarını gör.`,
    },
    question: `Günün hangi vakti sana en müsait görünüyor?`,
  },
  {
    day: 10, phase: 'temel',
    title: `Tek bir vakitle başla`,
    lead: `Beşi birden değil. Biri.`,
    reading: [
      `Uzun ara vermiş biri "yarından itibaren beş vakit" diye başlarsa üçüncü günde durur. Bu bir irade meselesi değil, bir yükleme hatasıdır.`,
      `Bunun yerine tek bir vakit seç. En kolayını seç — genellikle akşam veya yatsı, çünkü günün telaşı bitmiştir. O vakti yerine getirdiğinde gün "yolda geçmiş" sayılır.`,
      `Bir vakit yerleştiğinde ikincisi kendiliğinden yanına gelir. Sırayı sen kurmazsın; alışkanlık kurar.`,
    ],
    source: {
      text: `Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.`,
      ref: `Buhârî, İlim 11; Müslim, Cihâd 6`,
    },
    dua: {
      ar: `رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي`,
      tr: `Rabbim! Göğsümü genişlet ve işimi kolaylaştır.`,
      ref: `Tâhâ sûresi, 25-26`,
    },
    step: {
      title: `Bir vakti kıl`,
      desc: `Seçtiğin tek vakti bugün kıl. Rekât sayısını ya da duaları tam bilmiyorsan İbadet bölümündeki rehbere bak — bilmemek bir engel değil.`,
    },
    question: `Hangi vakti seçtin ve neden?`,
  },
  {
    day: 11, phase: 'temel',
    title: `Geçmiş vakitler`,
    lead: `Endişeyi bırak, bugünü kur.`,
    reading: [
      `Uzun ara vermiş herkesin aklına aynı soru gelir: "Kılmadığım onca namaz ne olacak?" Bu soru samimidir, ama çoğu zaman yanlış zamanda sorulur — henüz bugünün namazı otururken.`,
      `Fıkıhta kaza namazı diye bir kapı vardır; kaçırılan farz namazlar sonradan kılınabilir. Yolun ilerleyen bölümünde bu konuya, aceleye getirmeden bakacağız.`,
      `Bugünün ölçüsü şudur: bugünün namazını kılabilen kişi, geçmişin namazını da zamanla toplar. Ama bugünü geçmişin ağırlığıyla ezersen ikisi de olmaz.`,
    ],
    source: {
      text: `Kim zerre kadar iyilik yaparsa onun karşılığını görür.`,
      ref: `Zilzâl sûresi, 7`,
    },
    dua: {
      ar: `رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً`,
      tr: `Rabbimiz! Bizi doğru yola ilettikten sonra kalplerimizi kaydırma ve katından bize rahmet bağışla.`,
      ref: `Âl-i İmrân sûresi, 8`,
    },
    step: {
      title: `Endişeyi ertele`,
      desc: `Geçmiş namazlar meselesini bugün düşünme. Bir kâğıda ya da not defterine "sonra" yaz ve kapat. Sıra ona da gelecek.`,
    },
    question: `Geçmişin ağırlığı bugünü ne kadar zorlaştırıyor?`,
  },
  {
    day: 12, phase: 'temel',
    title: `Fâtiha'yı anlamak`,
    lead: `Günde en az kırk kez söylediğin cümleler.`,
    reading: [
      `Fâtiha, namazın her rekâtında okunur. Beş vakit namazı kılan biri onu günde kırk defadan fazla söyler. Anlamını bilmeden söylenen kırk tekrar ile bilerek söylenen kırk tekrar aynı şey değildir.`,
      `Sûre bir övgüyle başlar, sonra bir itiraf gelir: "Yalnız sana kulluk eder, yalnız senden yardım isteriz." Bu cümle sûrenin tam ortasındadır ve kul ile Rab arasındaki sözleşmedir.`,
      `Ardından tek bir istek gelir: "Bizi doğru yola ilet." Fâtiha'da istenen tek şey budur. Sağlık, rızık, güvenlik değil — yön.`,
    ],
    source: {
      text: `Yalnız sana kulluk eder, yalnız senden yardım dileriz. Bizi doğru yola ilet.`,
      ref: `Fâtiha sûresi, 5-6`,
    },
    dua: {
      ar: `اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ`,
      tr: `Bizi doğru yola ilet.`,
      ref: `Fâtiha sûresi, 6`,
    },
    step: {
      title: `Mealiyle oku`,
      desc: `Fâtiha'yı bir kez Arapçasıyla, bir kez mealiyle oku. Kur'an bölümünden birinci sûreyi açman yeterli.`,
    },
    question: `Fâtiha'da hangi cümle sana en çok dokundu?`,
  },
  {
    day: 13, phase: 'temel',
    title: `Rükû ve secde`,
    lead: `Bedenin duası.`,
    reading: [
      `Namazda söylenenler kadar yapılanlar da anlam taşır. Rükûda bel bükülür — bu bir saygı duruşudur. Secdede alın yere değer — insanın en değerli yeri, en alçak yere.`,
      `Peygamber Efendimiz secdeyi tarif ederken kulun Rabbine en yakın olduğu anın secde anı olduğunu söyler ve orada çokça dua edilmesini ister. Yani secde bir bitiş değil, bir kapı.`,
      `Namazın zor geldiği günlerde bile secde ayrı durur. Bir şey söyleyemiyorsan bile alnını koy; o duruş kendi başına bir cümledir.`,
    ],
    source: {
      text: `Kulun Rabbine en yakın olduğu an secde hâlidir; öyleyse secdede çokça dua edin.`,
      ref: `Müslim, Salât 215`,
    },
    dua: {
      ar: `سُبْحَانَ رَبِّيَ الْأَعْلَى`,
      tr: `En yüce olan Rabbimi tenzih ederim.`,
      ref: `Secde tesbihi — Ebû Dâvûd, Salât 147`,
    },
    step: {
      title: `Secdede bir dua`,
      desc: `Bugün namazının bir secdesinde, Arapça bilmesen de kendi dilinle tek bir cümle dua et. Dua için izin istemene gerek yok.`,
    },
    question: `Secdede ne söylemek istedin?`,
  },
  {
    day: 14, phase: 'temel',
    title: `Aklın kaçması normaldir`,
    lead: `Huşû bir yetenek değil, bir yolculuk.`,
    reading: [
      `Namaza duruyorsun ve üç saniye sonra aklın alışveriş listesinde. Bu, imanının zayıflığı değil; insan zihninin çalışma şekli. Sahabe de aynı şeyi yaşadı ve Peygamber Efendimize sordu.`,
      `Verilen cevap şuydu: bu vesvese şeytandandır, ondan Allah'a sığınıp namaza devam et. Yani çözüm, namazı bırakmak değil; dağılınca geri dönmek.`,
      `Huşû bir günde kazanılan bir hâl değil, tekrar tekrar geri dönerek biriken bir hâl. Her geri dönüş huşûnun kendisidir.`,
    ],
    source: {
      text: `Şeytan namazda insanın aklını dağıtır; ondan Allah'a sığının.`,
      ref: `Müslim, Selâm 68 anlamınca`,
    },
    dua: {
      ar: `أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ`,
      tr: `Kovulmuş şeytandan Allah'a sığınırım.`,
      ref: `Nahl sûresi, 98`,
    },
    step: {
      title: `Bir rekâtta kal`,
      desc: `Bugün namazının sadece BİR rekâtında ne dediğine dikkat etmeyi dene. Tamamına değil, birine.`,
    },
    question: `Aklın en çok nereye kaçıyor?`,
  },
  {
    day: 15, phase: 'temel',
    title: `Ezan`,
    lead: `Günde beş kez gelen davet.`,
    reading: [
      `Ezan bir duyuru değil, bir davettir. "Haydi namaza, haydi kurtuluşa" der. Dikkat et: çağıran, gelmeni bekleyen biri var.`,
      `Uzun süre uzak kalmış biri için ezan bazen rahatsız edicidir; hatırlatır. Ama hatırlatma bir suçlama değil. Kapının açık olduğunu bilenlerin sesidir.`,
      `Ezanı duyduğunda müezzinin söylediğini tekrar etmek sünnettir. Kılamayacak olsan bile tekrar et — cevap vermek de bir bağdır.`,
    ],
    source: {
      text: `Ezanı işittiğinizde müezzinin söylediği gibi söyleyin.`,
      ref: `Buhârî, Ezân 7; Müslim, Salât 10`,
    },
    dua: {
      ar: `اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ`,
      tr: `Bu eksiksiz davetin ve kılınacak namazın Rabbi olan Allahım! Muhammed'e vesîleyi ve fazileti ver.`,
      ref: `Ezan duası — Buhârî, Ezân 8`,
    },
    step: {
      title: `Bir ezana cevap ver`,
      desc: `Bugün duyduğun bir ezanda müezzini takip et. Duymuyorsan uygulamadaki vakit bildirimini aç.`,
    },
    question: `Ezanı duyduğunda içinden ne geçiyor?`,
  },
  {
    day: 16, phase: 'temel',
    title: `İki hafta oldu`,
    lead: `Namaz artık bir yer tutuyor.`,
    reading: [
      `On altı gün önce namaz uzak bir kavramdı. Şimdi günün içinde en azından bir yeri var — belki her gün değil, ama bir yeri var.`,
      `Bu aşamada iki tuzak vardır. Birincisi hızlanmak: "artık beşe geçebilirim" deyip üç günde tükenmek. İkincisi yavaşlamak: bir gün atlayınca "demek olmuyor" deyip bırakmak.`,
      `İkisinin de panzehiri aynı: bugüne bak. Yarının kararını yarın verirsin.`,
    ],
    source: {
      text: `Sabır, ilk sarsıntı anındadır.`,
      ref: `Buhârî, Cenâiz 32; Müslim, Cenâiz 15`,
    },
    dua: {
      ar: `يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ`,
      tr: `Ey kalpleri evirip çeviren! Kalbimi dinin üzere sabit kıl.`,
      ref: `Tirmizî, Deavât 89`,
    },
    step: {
      title: `İkinci vakit`,
      desc: `Yerleşen vaktinin yanına ikinci bir vakit eklemeyi düşün. Hazır değilsen ekleme — bu bir teklif, emir değil.`,
    },
    question: `İkinci vakti eklemeye hazır mısın, yoksa birinciyi sağlamlaştırmak mı gerekiyor?`,
  },

  // ───────────────────────── FAZ 3 · BAĞ (17-26) ─────────────────────────
  {
    day: 17, phase: 'bag',
    title: `Kur'an'la yeniden tanışmak`,
    lead: `Onu okumak için âlim olmak gerekmiyor.`,
    reading: [
      `Kur'an'dan uzak kalanların çoğu onu bir uzmanlık alanı sanır: önce Arapça, sonra tefsir, sonra usul... Oysa Kur'an kendi hakkında şunu söyler — biz onu öğüt alınsın diye kolaylaştırdık.`,
      `Kolaylaştırılmış bir kitabı zorlaştıran biz oluruz. Bir sayfa aç, bir sayfa oku. Anlamadığın yer olacak; olsun. Anladığın bir cümle bile o günü değiştirebilir.`,
      `Bugünden itibaren Kur'an bu yolun sabit parçası. Ama yine aynı ölçüyle: az ama devamlı.`,
    ],
    source: {
      text: `Andolsun ki biz Kur'an'ı öğüt alınsın diye kolaylaştırdık. Öğüt alan yok mu?`,
      ref: `Kamer sûresi, 17`,
    },
    dua: {
      ar: `اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي وَنُورَ صَدْرِي`,
      tr: `Allahım! Kur'an'ı kalbimin baharı ve göğsümün nuru kıl.`,
      ref: `Ahmed b. Hanbel, Müsned I, 391`,
    },
    step: {
      title: `Bir sayfa aç`,
      desc: `Kur'an bölümünden herhangi bir sûreyi aç ve mealinden birkaç âyet oku. Baştan başlamak zorunda değilsin.`,
    },
    question: `Okuduğun âyetlerden hangisi aklında kaldı?`,
  },
  {
    day: 18, phase: 'bag',
    title: `Harfleri bilmiyorsan`,
    lead: `Zorlanarak okuyana iki kat karşılık var.`,
    reading: [
      `Bir kısım insan Kur'an'a hiç yaklaşmaz, çünkü harfleri bilmez ve utanır. Bu utanç, hadiste açıkça karşılanmıştır.`,
      `Peygamber Efendimiz, Kur'an'ı düzgün okuyanın kıymetli meleklerle beraber olduğunu söyler; sonra ekler: kekeleyerek, zorlanarak okuyan için ise iki kat karşılık vardır. Zorluk bir eksiklik değil, bir ecir sebebi.`,
      `Elif Ba öğrenmek yaşa bağlı değildir. Günde beş dakika, bir ayda harfleri tanıtır.`,
    ],
    source: {
      text: `Kur'an'ı zorlanarak, kekeleyerek okuyan kimseye iki kat ecir vardır.`,
      ref: `Buhârî, Tefsîr 80; Müslim, Müsâfirîn 244`,
    },
    dua: {
      ar: `رَبِّ زِدْنِي عِلْمًا`,
      tr: `Rabbim! İlmimi artır.`,
      ref: `Tâhâ sûresi, 114`,
    },
    step: {
      title: `Bir harf öğren`,
      desc: `Elif Ba bölümünü aç ve bir dersi bitir. Harfleri biliyorsan bir sayfa yüzünden okumayı dene.`,
    },
    question: `Öğrenmekten seni alıkoyan şey neydi?`,
  },
  {
    day: 19, phase: 'bag',
    title: `Yedi âyet`,
    lead: `Fâtiha, sana verilen tekrarlanan yedidir.`,
    reading: [
      `Kur'an, Fâtiha'yı "tekrarlanan yedi âyet" diye anar ve onu büyük Kur'an'ın yanında ayrıca zikreder. Yedi âyetlik bir sûrenin bu kadar öne çıkması tesadüf değil.`,
      `Çünkü Fâtiha bir özettir: hamd, rahmet, hesap günü, kulluk, yardım isteme ve yön talebi. İnsanın Rabbiyle kurabileceği ilişkinin tamamı yedi cümlede.`,
      `Ezberinde yoksa bugün ezberlemeye başla. Yedi âyet, bir haftaya sığar.`,
    ],
    source: {
      text: `Andolsun ki biz sana tekrarlanan yediyi ve büyük Kur'an'ı verdik.`,
      ref: `Hicr sûresi, 87`,
    },
    dua: {
      ar: `الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ`,
      tr: `Hamd, âlemlerin Rabbi olan Allah'a mahsustur.`,
      ref: `Fâtiha sûresi, 2`,
    },
    step: {
      title: `Fâtiha'yı tekrarla`,
      desc: `Ezber bölümünden Fâtiha'yı çalış. Biliyorsan bir kez mealine bakarak oku.`,
    },
    question: `Fâtiha'yı ezbere biliyor musun — emin misin?`,
  },
  {
    day: 20, phase: 'bag',
    title: `İhlâs sûresi`,
    lead: `Dört âyet, Kur'an'ın üçte biri.`,
    reading: [
      `İhlâs sûresi dört âyettir ve Allah'ın kim olduğunu anlatır: O tektir, hiçbir şeye muhtaç değildir, doğurmamış ve doğmamıştır, hiçbir şey O'nun dengi değildir.`,
      `Peygamber Efendimiz bu sûrenin Kur'an'ın üçte birine denk olduğunu söyler. Çünkü Kur'an'ın üç ana konusu vardır — tevhid, ahkâm ve kıssalar — ve bu sûre tevhidin tamamıdır.`,
      `Kısa olması onu kolay kılar; içeriği onu ağır kılar. Namazda Fâtiha'dan sonra okunabilecek en sağlam başlangıçtır.`,
    ],
    source: {
      text: `İhlâs sûresi Kur'an'ın üçte birine denktir.`,
      ref: `Buhârî, Fedâilü'l-Kur'ân 13; Müslim, Müsâfirîn 259`,
    },
    dua: {
      ar: `قُلْ هُوَ اللَّهُ أَحَدٌ`,
      tr: `De ki: O Allah birdir.`,
      ref: `İhlâs sûresi, 1`,
    },
    step: {
      title: `İhlâs'ı ezberle`,
      desc: `Ezber bölümünden İhlâs sûresini çalış. Dört âyet, bir oturuşta yerleşir.`,
    },
    question: `Namazda hangi sûreyi okuyabiliyorsun?`,
  },
  {
    day: 21, phase: 'bag',
    title: `Meal okumak da Kur'an'la olmaktır`,
    lead: `Anlamadan geçmek yerine anlayarak durmak.`,
    reading: [
      `Kur'an'ın Arapça metnini okumak başlı başına bir ibadettir. Ama Kur'an kendi hakkında bir sebep daha söyler: âyetleri üzerinde düşünsünler diye indirildi.`,
      `Düşünmek için anlamak gerekir. Bu yüzden meal okumak, Arapça okumanın rakibi değil; tamamlayıcısıdır. İkisini birlikte yapabilenler en çok yol alanlardır.`,
      `Bir sayfayı yüzünden oku, sonra aynı sayfanın mealini oku. Aynı metin iki kez, iki farklı kapıdan girer.`,
    ],
    source: {
      text: `Bu, âyetlerini iyice düşünsünler diye sana indirdiğimiz mübarek bir kitaptır.`,
      ref: `Sâd sûresi, 29`,
    },
    dua: {
      ar: `رَبِّ فَهِّمْنِي فِي الدِّينِ`,
      tr: `Rabbim! Beni dinde anlayış sahibi kıl.`,
      ref: `Buhârî, İlim 17 hadisinden esinle`,
    },
    step: {
      title: `Bir sayfa, iki kez`,
      desc: `Seçtiğin bir sayfayı önce yüzünden (ya da sadece mealinden) oku, sonra üzerinde bir dakika dur.`,
    },
    question: `Bugün okuduğun âyet sana neyi sordu?`,
  },
  {
    day: 22, phase: 'bag',
    title: `Zikir`,
    lead: `Dilin en ucuz, kalbin en pahalı işi.`,
    reading: [
      `Zikir, Allah'ı anmaktır. Abdest gerektirmez, vakit gerektirmez, yer gerektirmez. Yolda, işte, sırada beklerken yapılabilir.`,
      `Kur'an zikrin sonucunu açıkça söyler: kalpler ancak Allah'ı anmakla huzur bulur. Bu bir vaat değil, bir tarif. Huzursuzluğun kaynağı çoğu zaman kalbin boş kalmasıdır.`,
      `Geri dönen için zikir en erişilebilir ibadettir; çünkü ne bilgi ister ne hazırlık. Sadece dil ve niyet.`,
    ],
    source: {
      text: `Bilesiniz ki kalpler ancak Allah'ı anmakla huzur bulur.`,
      ref: `Ra'd sûresi, 28`,
    },
    dua: {
      ar: `لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ`,
      tr: `Allah'tan başka ilah yoktur; O tektir, ortağı yoktur.`,
      ref: `Buhârî, Deavât 65`,
    },
    step: {
      title: `Otuz üç kez`,
      desc: `Tesbihat bölümünü aç, herhangi bir zikri otuz üç kez çek. Yürürken de olur.`,
    },
    question: `Zikir çekerken zihnin nasıldı?`,
  },
  {
    day: 23, phase: 'bag',
    title: `Ağır basan iki kelime`,
    lead: `Sübhânallâhi ve bihamdihî.`,
    reading: [
      `Peygamber Efendimiz iki cümleden bahseder: dile hafif, mizanda ağır, Rahmân'a sevimli. Bunlar "Sübhânallâhi ve bihamdihî, sübhânallâhi'l-azîm" cümleleridir.`,
      `Anlamı şudur: Allah'ı hamdiyle birlikte tenzih ederim; yüce Allah'ı tenzih ederim. Yani O'nu eksikliklerden uzak tutar, aynı anda şükrederim.`,
      `Bu cümlenin gücü uzunluğunda değil, sürekliliğinde. Günde yüz kez söylenmesi tavsiye edilir — bu, toplam üç dakikadır.`,
    ],
    source: {
      text: `Dile hafif, mizanda ağır, Rahmân'a sevimli iki cümle: Sübhânallâhi ve bihamdihî, sübhânallâhi'l-azîm.`,
      ref: `Buhârî, Deavât 65; Müslim, Zikir 31`,
    },
    dua: {
      ar: `سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ`,
      tr: `Allah'ı hamdiyle tenzih ederim; yüce Allah'ı tenzih ederim.`,
      ref: `Buhârî, Deavât 65`,
    },
    step: {
      title: `Yüz kez`,
      desc: `Bu cümleyi gün içinde yüze tamamla. Tek seferde olmak zorunda değil.`,
    },
    question: `Gün içinde bunu nerelerde söyleyebildin?`,
  },
  {
    day: 24, phase: 'bag',
    title: `İstiğfar`,
    lead: `Kapalı görünen kapıları açan söz.`,
    reading: [
      `Nûh aleyhisselâm kavmini davet ederken onlara istiğfarı öğretir ve arkasından şaşırtıcı bir liste sayar: gökten bol yağmur, mal ve evlat, bahçeler ve ırmaklar.`,
      `Yani istiğfar sadece günahı silmez; sıkışmış hayatı da açar. Bu, birçok âlimin üzerinde durduğu bir bağdır.`,
      `Peygamber Efendimiz günde yetmiş defadan fazla istiğfar ettiğini söyler. Hatası olmayan biri bunu yapıyorsa, istiğfar bir ceza değil bir hâl demektir.`,
    ],
    source: {
      text: `Rabbinizden bağışlanma dileyin; O çok bağışlayandır. Size gökten bol yağmur göndersin, mallarınızı ve çocuklarınızı çoğaltsın, sizin için bahçeler ve ırmaklar var etsin.`,
      ref: `Nûh sûresi, 10-12`,
    },
    dua: {
      ar: `رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ`,
      tr: `Rabbim! Beni bağışla ve tövbemi kabul et. Şüphesiz sen tövbeleri çokça kabul eden, çok merhamet edensin.`,
      ref: `Ebû Dâvûd, Vitr 26`,
    },
    step: {
      title: `Yüz istiğfar`,
      desc: `Gün içinde yüz kez istiğfar et. Sayacı Tesbihat bölümünden kullanabilirsin.`,
    },
    question: `İstiğfar ederken aklına ilk ne geldi?`,
  },
  {
    day: 25, phase: 'bag',
    title: `Salavât`,
    lead: `Karşılığı peşin olan tek dua.`,
    reading: [
      `Kur'an'da ilginç bir âyet vardır: Allah ve melekleri Peygamber'e salât eder; ey iman edenler, siz de ona salât ve selam edin. Yani bu, kulun tek başına yaptığı bir iş değil.`,
      `Salavâtın karşılığı gecikmez. Peygamber Efendimiz, kendisine bir salavât getirene Allah'ın on rahmet ile karşılık verdiğini bildirir.`,
      `Söylemesi kısadır: "Allâhümme salli alâ Muhammed." Zor günlerde dilin en kolay tutunduğu cümledir.`,
    ],
    source: {
      text: `Şüphesiz Allah ve melekleri Peygamber'e salât eder. Ey iman edenler! Siz de ona salât edin ve tam bir teslimiyetle selam verin.`,
      ref: `Ahzâb sûresi, 56`,
    },
    dua: {
      ar: `اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ`,
      tr: `Allahım! Muhammed'e ve Muhammed'in ailesine rahmet et.`,
      ref: `Buhârî, Enbiyâ 10`,
    },
    step: {
      title: `Kırk salavât`,
      desc: `Gün içinde kırk kez salavât getir. Cuma günüyse sayıyı artır.`,
    },
    question: `Salavât getirirken ne hissediyorsun?`,
  },
  {
    day: 26, phase: 'bag',
    title: `Yirmi altı gün`,
    lead: `Bağ kuruldu — şimdi karakter.`,
    reading: [
      `Buraya kadar üç şey yaptın: kapıdan girdin, namazla bir temel kurdun, Kur'an ve zikirle bir bağ örmeye başladın.`,
      `Bundan sonraki bölüm daha zor, çünkü ölçüsü sen değilsin. İbadetin gerçek imtihanı seccadede değil, insanlar arasında görülür.`,
      `Namaz kötülükten alıkoyuyorsa, kılan kişinin dilinde ve elinde bir fark oluşmalı. Önümüzdeki sekiz gün bunu konuşacağız.`,
    ],
    source: {
      text: `Sizin en hayırlınız ahlâkı en güzel olanınızdır.`,
      ref: `Buhârî, Menâkıb 23; Müslim, Fedâil 68`,
    },
    dua: {
      ar: `اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَخْلَاقِ لَا يَهْدِي لِأَحْسَنِهَا إِلَّا أَنْتَ`,
      tr: `Allahım! Beni ahlâkın en güzeline ilet; ona senden başkası iletemez.`,
      ref: `Müslim, Müsâfirîn 201`,
    },
    step: {
      title: `Bir söz ver`,
      desc: `Önümüzdeki hafta için tek bir ahlâkî hedef belirle — dilini tutmak, birini aramak, bir borcu ödemek gibi.`,
    },
    question: `İbadetin senin davranışında ne değiştirdi?`,
  },

  // ──────────────────────── FAZ 4 · AHLAK (27-34) ────────────────────────
  {
    day: 27, phase: 'ahlak',
    title: `Namaz insanı değiştirir`,
    lead: `Değiştirmiyorsa soru sormak gerekir.`,
    reading: [
      `Kur'an namazı bir sonuçla tarif eder: hayâsızlıktan ve kötülükten alıkoyar. Bu, bir vaat değil bir ölçüdür. Kılınan namaz insanın dilinde, elinde ve öfkesinde bir iz bırakmalıdır.`,
      `Selef âlimleri bu âyeti şöyle okurdu: namazın seni kötülükten alıkoymuyorsa, namazına bak. Sert bir cümle ama suçlayıcı değil — bir teşhis daveti.`,
      `Bugünden itibaren ölçüyü kaç rekât kıldığında değil, kıldıktan sonra nasıl davrandığında ara.`,
    ],
    source: {
      text: `Kitaptan sana vahyedileni oku ve namazı kıl. Şüphesiz namaz, hayâsızlıktan ve kötülükten alıkoyar.`,
      ref: `Ankebût sûresi, 45`,
    },
    dua: {
      ar: `اللَّهُمَّ طَهِّرْ قَلْبِي مِنَ النِّفَاقِ وَعَمَلِي مِنَ الرِّيَاءِ`,
      tr: `Allahım! Kalbimi nifaktan, amelimi riyadan temizle.`,
      ref: `Beyhakî, Deavât 1/236`,
    },
    step: {
      title: `Bir davranışı seç`,
      desc: `Bugün bırakmak istediğin küçük bir davranış belirle — bir söz, bir alışkanlık. Bugünlük bırak; yarını yarın konuşuruz.`,
    },
    question: `Namaz seni bugün neyden alıkoydu?`,
  },
  {
    day: 28, phase: 'ahlak',
    title: `Dil`,
    lead: `En çok günahı en küçük organ işler.`,
    reading: [
      `Peygamber Efendimiz iman ile dil arasında doğrudan bir bağ kurar: Allah'a ve âhiret gününe iman eden ya hayır söylesin ya sussun. Üçüncü bir seçenek verilmemiş.`,
      `Gıybet, yalan, alay, kırıcı şaka — bunların hiçbiri "küçük" değildir; çünkü hepsi başkasında iz bırakır. Namaz kılan birinin dilinden çıkan söz, kıldığı namazın şahididir.`,
      `Susmak bir eksiklik değil, bir tercih. Bugün bir defa susmayı dene.`,
    ],
    source: {
      text: `Kim Allah'a ve âhiret gününe iman ediyorsa ya hayır söylesin ya sussun.`,
      ref: `Buhârî, Rikāk 23; Müslim, Îmân 74`,
    },
    dua: {
      ar: `اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ سَمْعِي وَمِنْ شَرِّ بَصَرِي وَمِنْ شَرِّ لِسَانِي`,
      tr: `Allahım! Kulağımın, gözümün ve dilimin şerrinden sana sığınırım.`,
      ref: `Ebû Dâvûd, Vitr 32`,
    },
    step: {
      title: `Bir gıybeti kes`,
      desc: `Bugün bir konuşma gıybete dönerse ya konuyu değiştir ya da sus. Kimseyi uyarmana gerek yok.`,
    },
    question: `Bugün söylemediğin şey neydi?`,
  },
  {
    day: 29, phase: 'ahlak',
    title: `Anne baba`,
    lead: `Kapının en yakın olduğu yer.`,
    reading: [
      `Kur'an, Allah'a kulluk emrinin hemen ardından anne babaya iyiliği getirir. İki emrin yan yana gelmesi tesadüf değildir.`,
      `Âyet çok ince bir sınır çizer: onlara "öf" bile deme. Öfke değil, bıkkınlık bile yasaklanmış. Ardından şu dua öğretilir: "Rabbim! Onlar beni küçükken nasıl büyüttülerse sen de onlara merhamet et."`,
      `Uzak kalan biri için anne babaya dönmek çoğu zaman Allah'a dönmenin en somut hâlidir. Hayattalarsa bir telefon, değillerse bir dua yeter.`,
    ],
    source: {
      text: `Rabbin, yalnız kendisine kulluk etmenizi ve anne babaya iyilik etmenizi emretti. Onlardan biri veya ikisi senin yanında yaşlanırsa onlara "öf" bile deme.`,
      ref: `İsrâ sûresi, 23`,
    },
    dua: {
      ar: `رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا`,
      tr: `Rabbim! Onlar beni küçükken nasıl yetiştirdilerse sen de onlara öyle merhamet et.`,
      ref: `İsrâ sûresi, 24`,
    },
    step: {
      title: `Ara ya da dua et`,
      desc: `Anne baban hayattaysa bugün birini ara. Değillerse yukarıdaki duayı onlar için oku.`,
    },
    question: `En son ne zaman sadece hâl hatır sormak için aradın?`,
  },
  {
    day: 30, phase: 'ahlak',
    title: `Komşu`,
    lead: `İmanın en yakındaki sınavı.`,
    reading: [
      `Peygamber Efendimiz, Cebrail'in komşu hakkını o kadar çok tavsiye ettiğini söyler ki, neredeyse komşuyu mirasçı kılacağını zannettiğini belirtir. Bu, komşuluğun İslam'daki yerini gösteren bir cümledir.`,
      `Komşu hakkı zarar vermemekle başlar, iyilik etmekle devam eder. Gürültü, dedikodu, kayıtsızlık — hepsi bu hakkın içinde.`,
      `İbadet insanı yalnızlaştırmaz; en yakınındaki kapıyla ilişkisini düzeltir.`,
    ],
    source: {
      text: `Cebrail bana komşu hakkında o kadar çok tavsiyede bulundu ki, neredeyse komşuyu komşuya mirasçı kılacak sandım.`,
      ref: `Buhârî, Edeb 28; Müslim, Birr 140`,
    },
    dua: {
      ar: `اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الْأُمُورِ كُلِّهَا`,
      tr: `Allahım! Bütün işlerimizin sonunu hayırlı eyle.`,
      ref: `Ahmed b. Hanbel, Müsned IV, 181`,
    },
    step: {
      title: `Bir selam`,
      desc: `Bugün bir komşuna selam ver ya da uzun süredir konuşmadığın birine kısa bir mesaj at.`,
    },
    question: `Komşularından kaçının adını biliyorsun?`,
  },
  {
    day: 31, phase: 'ahlak',
    title: `Helal lokma`,
    lead: `Duanın önündeki en sessiz engel.`,
    reading: [
      `Kur'an insanlara "yeryüzündeki helal ve temiz şeylerden yiyin" der. Emir sadece "yiyin" değil; "helal ve temiz olandan" kaydı var.`,
      `Peygamber Efendimiz, uzun yolculuktan gelmiş, saçı başı dağınık, ellerini göğe kaldırıp "Yâ Rab, yâ Rab" diye yalvaran bir adamı anlatır; sonra sorar: yediği haram, içtiği haram, giydiği haram iken duası nasıl kabul edilsin?`,
      `Bu, korkutmak için değil; duanın yolunu açmak için söylenmiş bir sözdür. Kazancına bakmak, ibadetin bir parçasıdır.`,
    ],
    source: {
      text: `Ey insanlar! Yeryüzündeki helal ve temiz şeylerden yiyin.`,
      ref: `Bakara sûresi, 168`,
    },
    dua: {
      ar: `اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ`,
      tr: `Allahım! Helâlinle yetindirip haramına muhtaç etme; lütfunla senden başkasına muhtaç bırakma.`,
      ref: `Tirmizî, Deavât 110`,
    },
    step: {
      title: `Bir kalemi gözden geçir`,
      desc: `Gelirinin ya da harcamanın bir kalemine bak; şüpheli bir yer varsa not al. Bugün değiştirmek zorunda değilsin, görmen yeter.`,
    },
    question: `Kazancında rahat olmadığın bir yer var mı?`,
  },
  {
    day: 32, phase: 'ahlak',
    title: `Öfke`,
    lead: `Bir adam üç kez sordu, cevap hep aynıydı.`,
    reading: [
      `Bir adam Peygamber Efendimize gelip "bana tavsiyede bulun" dedi. "Öfkelenme" buyurdu. Adam isteğini birkaç kez tekrarladı; her seferinde aynı cevabı aldı: "Öfkelenme."`,
      `Çünkü öfke tek bir kusur değil, bir kapıdır: dil oradan kayar, el oradan kalkar, bağ oradan kopar. Öfkeyi tutan çoğu şeyi tutmuş olur.`,
      `Peygamber Efendimiz pehlivanlığı da yeniden tanımlar: güçlü olan, güreşte yenen değil; öfke anında kendine hâkim olandır.`,
    ],
    source: {
      text: `Pehlivan, güreşte rakibini yenen değildir; asıl pehlivan öfke anında kendine hâkim olandır.`,
      ref: `Buhârî, Edeb 76; Müslim, Birr 107`,
    },
    dua: {
      ar: `أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ`,
      tr: `Kovulmuş şeytandan Allah'a sığınırım.`,
      ref: `Öfke anında okunması tavsiye edilmiştir — Buhârî, Edeb 76`,
    },
    step: {
      title: `Üç saniye`,
      desc: `Bugün öfkelendiğin ilk anda üç saniye bekle ve eûzü çek. Sonra istediğini söyle. Genellikle söyleyeceğin değişir.`,
    },
    question: `Öfken en çok kime zarar veriyor?`,
  },
  {
    day: 33, phase: 'ahlak',
    title: `Affetmek`,
    lead: `Sana yapılanı bırakmak, sana yapılacak için.`,
    reading: [
      `Kur'an'da, kendisine iftira atılan bir yakınına yardımı kesen sahâbî için inen âyet vardır. Âyet şöyle sorar: Allah'ın sizi bağışlamasını sevmez misiniz?`,
      `Bu soru bütün affetme meselesini tek cümlede toplar. Affetmek, karşındakine yapılan bir iyilik olmadan önce, kendi bağışlanma talebinin tutarlılığıdır.`,
      `Affetmek unutmak değildir; hesabı Allah'a bırakmaktır. Bu ikisi karıştırıldığı için affetmek imkânsız görünür.`,
    ],
    source: {
      text: `Bağışlasınlar, hoş görsünler. Allah'ın sizi bağışlamasını sevmez misiniz?`,
      ref: `Nûr sûresi, 22`,
    },
    dua: {
      ar: `اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي`,
      tr: `Allahım! Sen çok affedicisin, affetmeyi seversin; beni de affet.`,
      ref: `Tirmizî, Deavât 84`,
    },
    step: {
      title: `Bir hesabı kapat`,
      desc: `İçinde tuttuğun bir kırgınlığı bugün "bıraktım" diyerek kapat. Karşı tarafa haber vermene gerek yok.`,
    },
    question: `Kimi affetmek en zoru?`,
  },
  {
    day: 34, phase: 'ahlak',
    title: `Sadaka`,
    lead: `Gülümsemen bile sayılır.`,
    reading: [
      `Sadaka denince akla para gelir ve eli dar olan kendini dışarıda hisseder. Peygamber Efendimiz bu kapıyı genişletir: kardeşine gülümsemen sadakadır.`,
      `Aynı çerçevede iyiliği emretmek, yoldan bir engeli kaldırmak, birine su vermek de sadaka sayılmıştır. Yani sadaka bir servet işi değil, bir yöneliş işi.`,
      `Her gün bir sadaka, kalbi katılıktan korur. En küçük olanından başla.`,
    ],
    source: {
      text: `Kardeşine gülümsemen senin için bir sadakadır.`,
      ref: `Tirmizî, Birr 36`,
    },
    dua: {
      ar: `اللَّهُمَّ اجْعَلْنِي مِنَ الْمُنْفِقِينَ فِي سَبِيلِكَ`,
      tr: `Allahım! Beni yolunda infak edenlerden eyle.`,
      ref: `Bakara 262 anlamınca`,
    },
    step: {
      title: `Bir sadaka`,
      desc: `Bugün bir sadaka ver: para, yardım, bir iyi söz ya da yoldan bir engeli kaldırmak.`,
    },
    question: `Bugünkü sadakan ne oldu?`,
  },

  // ─────────────────────── FAZ 5 · KÖKLEŞME (35-40) ───────────────────────
  {
    day: 35, phase: 'kok',
    title: `Yeniden düşersen`,
    lead: `Bu ihtimali bugünden konuşuyoruz.`,
    reading: [
      `Bir gün bu yolu yine bırakacaksın. Bir hafta, bir ay. Bunu şimdi söylüyoruz ki o gün geldiğinde hazırlıksız yakalanmayasın.`,
      `Peygamber Efendimiz insanın tabiatını şöyle tarif eder: her âdemoğlu hata eder; hata edenlerin en hayırlısı tövbe edenlerdir. Yani hata bir istisna değil, bir sabit; belirleyici olan sonrasında ne yaptığın.`,
      `O gün geldiğinde tek bir şey yap: uygulamayı aç. Tek görev bile olsa yap. Yolun kırılma noktası düşmek değil, düştükten sonra kalkmamaktır.`,
    ],
    source: {
      text: `Her âdemoğlu hata eder; hata edenlerin en hayırlısı tövbe edenlerdir.`,
      ref: `Tirmizî, Kıyâme 49; İbn Mâce, Zühd 30`,
    },
    dua: {
      ar: `يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ`,
      tr: `Ey diri ve her şeyi ayakta tutan! Rahmetinle senden yardım diliyorum.`,
      ref: `Tirmizî, Deavât 91`,
    },
    step: {
      title: `Bir plan yaz`,
      desc: `"Bir hafta ara verirsem şunu yapacağım" diye tek cümlelik bir plan yaz. Amel Defteri iyi bir yer.`,
    },
    question: `Geçen sefer neden bırakmıştın?`,
  },
  {
    day: 36, phase: 'kok',
    title: `Gece`,
    lead: `Kimsenin görmediği iki rekât.`,
    reading: [
      `Gece namazı Kur'an'da Peygamber Efendimize ayrıca emredilir ve "senin için fazladan bir ibadettir" denir. Farz değildir, ama ayrı bir yeri vardır.`,
      `Gecenin kıymeti gizliliğinde. Kimse görmez, kimse bilmez; riya ihtimali en düşük ibadet budur. İhlâsın en kolay bulunduğu vakit.`,
      `İki rekât yeter. Uykudan bir saat çalmak gerekmez; yatmadan önce iki rekât kılmak da bir başlangıçtır.`,
    ],
    source: {
      text: `Gecenin bir kısmında da uyanıp sana mahsus fazladan bir ibadet olarak namaz kıl.`,
      ref: `İsrâ sûresi, 79`,
    },
    dua: {
      ar: `اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَاوَاتِ وَالْأَرْضِ`,
      tr: `Allahım! Hamd sana mahsustur; sen göklerin ve yerin nurusun.`,
      ref: `Teheccüd duasından — Buhârî, Teheccüd 1`,
    },
    step: {
      title: `İki rekât`,
      desc: `Bugün yatmadan önce iki rekât nafile kıl. Kısa sûrelerle, aceleye getirmeden.`,
    },
    question: `Kimsenin görmediği bir ibadet sana nasıl geldi?`,
  },
  {
    day: 37, phase: 'kok',
    title: `Cuma`,
    lead: `Haftanın çapası.`,
    reading: [
      `Cuma, haftalık bir duraktır. Kur'an cuma namazı çağrısı yapıldığında alışverişin bırakılıp Allah'ı anmaya koşulmasını emreder. Emrin kendisi kadar sırası da anlamlı: iş durur, zikir başlar.`,
      `Cuma günü için tavsiye edilen bir demet amel vardır: gusül, temiz elbise, erken gitmek, Kehf sûresini okumak, çokça salavât getirmek.`,
      `Haftada bir gün, yolun tazelendiği gündür. Diğer altı gün zayıf geçse bile cuma bir düğüm atar.`,
    ],
    source: {
      text: `Cuma günü namaza çağrıldığınızda Allah'ı anmaya koşun ve alışverişi bırakın.`,
      ref: `Cum'a sûresi, 9`,
    },
    dua: {
      ar: `اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ`,
      tr: `Allahım! Peygamberimiz Muhammed'e salât ve selam eyle.`,
      ref: `Cuma günü çokça salavât — Ebû Dâvûd, Salât 201`,
    },
    step: {
      title: `Cumayı işaretle`,
      desc: `Bu haftanın cumasında ne yapacağını şimdi belirle: cuma namazı, Kehf'ten bir bölüm ya da çokça salavât.`,
    },
    question: `Cuma senin için neyi ifade ediyor?`,
  },
  {
    day: 38, phase: 'kok',
    title: `Yol arkadaşı`,
    lead: `Tek başına yürünen yol uzun sürmez.`,
    reading: [
      `Kur'an, Peygamber Efendimize şunu söyler: sabah akşam Rablerine dua eden kimselerle beraber sabret, gözlerini onlardan ayırma. Yani çevre bir ayrıntı değil, bir emirdir.`,
      `Geri dönenlerin en büyük tehlikesi yalnızlıktır. Kimseye anlatmadan yürünen yol, ilk zorlukta sessizce biter; çünkü kimse fark etmez.`,
      `Bir kişi yeter. Ne yaptığını bilen, sormasa bile varlığıyla hatırlatan tek bir kişi.`,
    ],
    source: {
      text: `Sabah akşam Rablerinin rızasını dileyerek O'na dua edenlerle birlikte sabret.`,
      ref: `Kehf sûresi, 28`,
    },
    dua: {
      ar: `اللَّهُمَّ ارْزُقْنِي صُحْبَةَ الصَّالِحِينَ`,
      tr: `Allahım! Bana sâlihlerin arkadaşlığını nasip et.`,
      ref: `Kehf 28 anlamınca`,
    },
    step: {
      title: `Birine söyle`,
      desc: `Güvendiğin bir kişiye bu kırk günden bahset. Övünmek için değil; görülmek için.`,
    },
    question: `Bu yolda seni kim tutabilir?`,
  },
  {
    day: 39, phase: 'kok',
    title: `Kırk günden sonrası`,
    lead: `Yarın bu ekran bitiyor. Yol bitmiyor.`,
    reading: [
      `Yarın kırkıncı gün. Sonrasında bu müfredat biter ve karar sana kalır. Bu yüzden planı bugünden yapıyoruz — yarın duygusal bir gün olacak, plan için uygun değil.`,
      `Üç soruya cevap ver: Hangi ibadet bu kırk günde yerleşti? Hangisi hâlâ zorlanıyor? Önümüzdeki kırk günde hangi tek şeyi ekleyeceksin?`,
      `Cevapların uzun olmasın. Yerleşen şeyi koru, zorlananı zorlama, ekleyeceğin tek olsun.`,
    ],
    source: {
      text: `İşinde kararlı olduğunda artık Allah'a güvenip dayan.`,
      ref: `Âl-i İmrân sûresi, 159`,
    },
    dua: {
      ar: `اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ`,
      tr: `Allahım! Senin ilminle hayırlısını ister, kudretinle güç dilerim.`,
      ref: `İstihâre duasından — Buhârî, Deavât 48`,
    },
    step: {
      title: `Üç cevap yaz`,
      desc: `Yukarıdaki üç soruyu Amel Defteri'ne yaz. Kısa cümlelerle.`,
    },
    question: `Bu kırk günde neyi yerleştirdin?`,
  },
  {
    day: 40, phase: 'kok',
    title: `Yol artık senin`,
    lead: `Kırk gün önce bir kapı vardı. Şimdi bir yol var.`,
    reading: [
      `Kırk gün önce buraya ne kadar ara verdiğini düşünerek geldin. Bugün kırk günlük bir yolun var. Aradaki fark bir mucize değil; her gün geri gelmenin toplamı.`,
      `Bu ekranın söyleyeceği yeni bir şey kalmadı. Bundan sonra yol, senin uyandığın saatte, işe giderken durduğun vakitte, kimsenin bakmadığı secdede devam edecek.`,
      `Bir şeyi hatırla: kapı hâlâ açık. Yarın gelmezsen de, bir ay sonra gelirsen de aynı yerde duruyor. Nur Yolu seni bekliyor — bu sefer normal moda, kendi hızınla geçebilirsin.`,
    ],
    source: {
      text: `Bizim uğrumuzda gayret gösterenlere yollarımızı elbette gösteririz.`,
      ref: `Ankebût sûresi, 69`,
    },
    dua: {
      ar: `يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ`,
      tr: `Ey kalpleri evirip çeviren! Kalbimi dinin üzere sabit kıl.`,
      ref: `Tirmizî, Deavât 89`,
    },
    step: {
      title: `Kırkıncı günü mühürle`,
      desc: `Bugünü Amel Defteri'ne yaz. Bir gün geri dönüp okuyacaksın.`,
    },
    question: `Kırk gün önceki kendine ne söylerdin?`,
  },
];

// ─── Yardımcılar ───

import EN from './returnPath.en';

// Dil katmanları. Türkçe daima kanonik; eksik dil İngilizce'ye, o da yoksa
// Türkçe'ye düşer (uygulamanın genel içerik zinciriyle aynı davranış).
const OVERLAYS = { en: EN };

/**
 * Bir günün içeriğini istenen dilde döndürür.
 * Arapça dua metni (dua.ar) dile bağlı değildir; her zaman Türkçe kayıttan
 * gelir. Arapça arayüzde henüz overlay yok — İngilizce'ye düşer.
 */
function localize(base, lang) {
  if (!base || !lang || lang === 'tr') return base;
  const ov = (OVERLAYS[lang] || OVERLAYS.en || {})[base.day];
  if (!ov) return base;
  return {
    ...base,
    title: ov.title || base.title,
    lead: ov.lead || base.lead,
    reading: Array.isArray(ov.reading) && ov.reading.length ? ov.reading : base.reading,
    source: ov.source ? { ...base.source, ...ov.source } : base.source,
    // Arapça metin korunur, meal ve kaynak çevrilir
    dua: ov.dua ? { ...base.dua, ...ov.dua, ar: base.dua.ar } : base.dua,
    step: ov.step ? { ...base.step, ...ov.step } : base.step,
    question: ov.question || base.question,
  };
}

/** Belirli bir günün içeriği (1..40). Sınır dışı ise en yakın gün döner. */
export function getDayContent(day, lang = 'tr') {
  const n = Number.isFinite(day) ? day : 1;
  const idx = Math.min(RETURN_DAYS.length, Math.max(1, Math.round(n))) - 1;
  return localize(RETURN_DAYS[idx], lang);
}

/** Günün ait olduğu faz. */
export function getPhase(day) {
  const d = Math.max(1, Math.round(day || 1));
  return RETURN_PHASES.find(p => d >= p.from && d <= p.to) || RETURN_PHASES[RETURN_PHASES.length - 1];
}

/** Müfredatın son günü geçildi mi? */
export const LAST_DAY = RETURN_DAYS.length;

export default RETURN_DAYS;
