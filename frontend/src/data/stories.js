// frontend/src/data/stories.js
// 🕯️ İBRETLİK HİKAYELER — kısa kıssa + düşündürücü soru → hikmet.
// Evrensel hikmet öykülerini İslami değer çerçevesiyle sunar.
// Ayet alıntıları GERÇEK meallerdir; Peygambere uydurma söz atfedilmez.
//
// Yapı: anlatı → "Sen ne düşünürsün?" sorusu (opsiyonel şıklar) →
//       kullanıcı seçince "Hikmet" açılır (ders + varsa ayet).

export const STORY_CATEGORIES = [
  { id: 'ahlak', title: 'Ahlak & Karakter', emoji: '🌿' },
  { id: 'sabir', title: 'Sabır & Şükür', emoji: '⏳' },
  { id: 'hikmet', title: 'Hikmet & Basiret', emoji: '💎' },
];

export const STORIES = [
  {
    id: 'kor-cocuk', cat: 'hikmet', emoji: '🪧', grad: ['#0A2E4E', '#155E75'],
    title: 'İki Tabela',
    read: 3,
    paragraphs: [
      'Kör bir çocuk, işlek bir caddenin köşesinde oturuyordu. Önünde bir şapka, yanında elle yazılmış bir tabela vardı: "Körüm, lütfen yardım edin." Şapkada birkaç bozuk para birikmişti; o kadar.',
      'Yoldan geçen bir adam durdu. Cebinden para çıkarıp şapkaya bıraktı. Sonra tabelayı eline aldı, ters çevirdi ve arkasına birkaç kelime yazdı. Tabelayı, geçen herkesin okuyabileceği şekilde yerine koydu ve uzaklaştı.',
      'O öğleden sonra şapka dolup taşmaya başladı. Çok daha fazla insan çocuğa para veriyordu. Akşamüstü, tabelayı değiştiren adam durumu görmeye geldi. Çocuk ayak seslerinden onu tanıdı: "Bu sabah tabelamı değiştiren siz miydiniz? Ne yazdınız?"',
      'Adam gülümsedi: "Sadece gerçeği yazdım. Senin söylediğini farklı bir şekilde söyledim." Yazdığı şey şuydu: "Bugün çok güzel bir gün ve ben onu göremiyorum."',
    ],
    question: 'İki tabela da aynı gerçeği söylüyordu. Peki neden ikincisi kalpleri harekete geçirdi?',
    choices: [
      'Çünkü insanları sahip olduklarına şükretmeye davet etti',
      'Çünkü daha çok acındırdı',
      'Çünkü daha büyük harflerle yazılmıştı',
    ],
    correct: 0,
    lesson: 'İlk tabela bir eksikliği haber veriyordu; ikincisi ise okuyanın sahip olduğu nimeti hatırlatıyordu. Aynı söz, doğru pencereden söylendiğinde kalbe dokunur. Şükür, çoğu zaman "elimizde olmayanı" değil, "gözden kaçırdığımız nimeti" fark etmekle başlar. Görebilen gözlerimiz, yürüyen ayaklarımız, aldığımız her nefes — hepsi o "güzel gün"ün parçası.',
    verse: { text: '"Andolsun, şükrederseniz elbette size (nimetimi) artırırım."', source: 'İbrâhim 7' },
  },
  {
    id: 'marangoz', cat: 'ahlak', emoji: '🔨', grad: ['#3B2A16', '#78350F'],
    title: 'Marangozun Son Evi',
    read: 3,
    paragraphs: [
      'Yaşlı ve usta bir marangoz, uzun yıllar hizmet ettiği patronuna emekli olmak istediğini söyledi. Artık dinlenmek, torunlarıyla vakit geçirmek istiyordu. İşi bırakınca gelirini kaybedecekti ama kararını vermişti.',
      'Patronu üzüldü; bu değerli ustayı kaybetmek istemiyordu. "Son bir ricam olacak," dedi. "Bana bir ev daha yap; sonra istediğin gibi git." Marangoz kabul etti ama gönlü işte değildi.',
      'İsteksizce çalıştı. Kötü malzeme seçti, işçiliğini savsakladı, ölçüleri özensiz aldı. Yılların ustası, hayatının en baştan savma işini çıkardı ortaya. Ev bitti; hiç de eskileri gibi olmamıştı.',
      'Patron geldi, evi gezdi, sonra kapının anahtarını marangozun avucuna bıraktı: "Bu ev senin. Yılların emeğine küçük bir hediyem." Marangoz donup kaldı. Kendi oturacağı evi böyle yapacağını bilseydi, her çiviyi nasıl da özenle çakardı!',
    ],
    question: 'Marangoz aslında kimin evini inşa ediyordu?',
    choices: [
      'Kendi geleceğini — her amelimiz kendi evimizin tuğlasıdır',
      'Sadece patronunun evini',
      'Boşa giden bir işi',
    ],
    correct: 0,
    lesson: 'Hepimiz her gün bir ev inşa ediyoruz: Yaptığımız işler, verdiğimiz kararlar, kurduğumuz ilişkiler o evin tuğlaları. Çoğu zaman "nasıl olsa başkası için" diye savsaklarız; oysa inşa ettiğimiz, kendi ahiretimizdir. Bir işi "sadece görev olsun diye" değil, "kendim için yapıyorum" bilinciyle yapmak — ihlas budur. Bugün attığın her çivi, yarın içinde oturacağın evin.',
    verse: { text: '"İnsan için ancak çalıştığının karşılığı vardır."', source: 'Necm 39' },
  },
  {
    id: 'tohum', cat: 'ahlak', emoji: '🌱', grad: ['#1E3A2E', '#166534'],
    title: 'İmparator ve Tohum',
    read: 4,
    paragraphs: [
      'Yaşlanan bir hükümdarın çocuğu yoktu. Tahtı bırakacağı birini seçmesi gerekiyordu. Sıradan bir yarışma yapmadı: Ülkenin dört bir yanından gençleri saraya çağırdı ve her birine birer tohum verdi.',
      '"Bu tohumu ekin, büyütün," dedi. "Altı ay sonra saksınızla geri gelin. En güzel bitkiyi yetiştiren, benden sonra tahta oturacak."',
      'Gençlerden biri, adı Emin olan bir çocuk, tohumunu özenle ekti. Her gün su verdi, güneşe çıkardı, sabırla bekledi. Ama haftalar geçti, aylar geçti — saksıdan hiçbir şey çıkmadı. Utandı, üzüldü; komşularının saksıları rengârenk çiçeklerle dolarken onunki bomboştu.',
      'Altı ay dolduğunda bütün gençler görkemli bitkilerle saraya geldi. Emin ise boş saksısıyla, en arkada, başı önünde duruyordu. Hükümdar salonu gezdi, çiçeklere şöyle bir baktı — sonra Emin\'in boş saksısının önünde durdu ve yüksek sesle ilan etti: "İşte müstakbel hükümdarınız."',
      'Herkes şaşkındı. Hükümdar açıkladı: "Size verdiğim bütün tohumları kavurmuştum; hiçbiri filiz veremezdi. Bu boş saksıyı getirecek dürüstlükte tek kişi vardı — o da tahta layık olandır."',
    ],
    question: 'Diğer gençlerin rengârenk saksıları neyi gösteriyordu?',
    choices: [
      'Doğruluğu kaybetme pahasına başarılı görünme telaşını',
      'Gerçekten daha yetenekli olduklarını',
      'Daha çok çalıştıklarını',
    ],
    correct: 0,
    lesson: 'Herkes "başarılı görünmek" için tohumu değiştirdi; yalnız biri boş saksısıyla dürüstlüğü seçti. Dünya çoğu zaman "sonucu" alkışlar, "dürüstlüğü" değil. Oysa emanetin sahibi, dolu saksıya değil, temiz kalbe bakar. Doğru olmak bazen seni en arkaya, en yalnız köşeye iter — ta ki hakikat ilan edilene kadar. Görünüşü kurtarmak için ödediğimiz bedel, çoğu zaman kaybettiğimiz özümüzdür.',
    verse: { text: '"Ey iman edenler! Allah\'tan korkun ve doğrularla beraber olun."', source: 'Tevbe 119' },
  },
  {
    id: 'iki-deniz', cat: 'hikmet', emoji: '🌊', grad: ['#0A2E4E', '#1E40AF'],
    title: 'Aynı Sudan İki Deniz',
    read: 3,
    paragraphs: [
      'Bir coğrafyada iki büyük göl vardır ve ikisini de aynı nehir besler. Aynı kaynaktan, aynı tatlı su akar her ikisine de. Ama bu iki göl birbirinden bambaşkadır.',
      'Birincisinin çevresi yemyeşildir. Kıyısında ağaçlar, balıklar, kuş sürüleri, çocuk sesleri vardır. Su onun içine girer, oradan geçer ve bir başka koldan çıkıp yoluna devam eder. Aldığını verir; bu yüzden diridir.',
      'İkincisi ise ölü gibidir. Kıyısında ne balık yaşar, ne yeşillik biter, ne kuş uğrar. Suyu o kadar tuzludur ki hiçbir canlı barınamaz. Bu göl aldığı suyu hiç dışarı vermez — her damlayı içinde tutar. Sadece alır, hiç vermez.',
      'İnsanlar birincisine "hayat denizi", ikincisine "ölü deniz" derler. İkisinin arasındaki tek fark: Biri paylaşır, diğeri biriktirir.',
    ],
    question: 'İki gölü birbirinden ayıran şey neydi?',
    choices: [
      'Aldıklarını verip vermemeleri',
      'Suyun kaynağının farklı olması',
      'Birinin daha büyük olması',
    ],
    correct: 0,
    lesson: 'İnsan da bu iki göl gibidir. Kimi, sahip olduğu ilmi, malı, sevgiyi çevresine akıtır — ve bereketlenir, canlanır, etrafını yeşertir. Kimi ise her şeyi kendine saklar, tutar, biriktirir — ve içten içe kurur. Vermek, malı eksiltmez; aksine ruhu diriltir. İnfak eden el, hayat denizidir. Cömertlik bir kayıp değil, akıştır.',
    verse: { text: '"Sevdiğiniz şeylerden infak etmedikçe iyiliğe asla eremezsiniz."', source: 'Âl-i İmrân 92' },
  },
  {
    id: 'civi', cat: 'ahlak', emoji: '🪵', grad: ['#4E1D0A', '#7C2D12'],
    title: 'Çitteki Çiviler',
    read: 3,
    paragraphs: [
      'Öfkeli bir çocuğu vardı babanın. En küçük şeyde parlıyor, sevdiklerine kırıcı sözler söylüyordu. Baba bir gün eline bir torba çivi tutuşturdu: "Ne zaman öfkelenip birine kırıcı bir şey söylersen, bahçedeki tahta çite bir çivi çak."',
      'İlk gün çocuk otuz yedi çivi çaktı. Ama günler geçtikçe öfkesini tutmanın, çite çivi çakmaktan daha kolay olduğunu fark etti. Çakılan çivi sayısı her gün azaldı. Bir gün geldi, hiç çivi çakmadı.',
      'Bunu babasına söyleyince baba yeni bir görev verdi: "Şimdi de öfkeni tuttuğun her gün için çitten bir çivi sök." Zaman geçti; çocuk bir gün bütün çivileri söktüğünü müjdeledi.',
      'Baba onu çitin başına götürdü: "Aferin evladım. Ama şu tahtaya bak." Çivilerin söküldüğü yerlerde derin delikler kalmıştı. "Çit artık eskisi gibi değil. Öfkeyle söylediğin her söz de böyle bir iz bırakır. Çiviyi söksen bile, deliği kalır."',
    ],
    question: 'Baba çocuğa asıl neyi göstermek istiyordu?',
    choices: [
      'Özür dilesek de kırıcı sözlerin iz bıraktığını',
      'Çivi çakmanın zor olduğunu',
      'Çitin tamir edilemeyeceğini',
    ],
    correct: 0,
    lesson: 'Öfke anında söylenen söz, atılan bir oktur — geri çağıramazsın. "Özür dilerim" demek güzeldir, delikleri onarmaya çalışır; ama bazı yaralar iz bırakır. Bu yüzden asıl mesele, çiviyi sökmek değil, hiç çakmamaktır. Peygamberimiz öfkelenene "sus, otur, sığın" diye öğretti — çünkü söylenmemiş söz, geri alınması gereken sözden her zaman hayırlıdır. Diline sahip çıkmak, çite çivi çakmamaktır.',
    verse: { text: '"...Öfkelerini yutarlar ve insanları affederler. Allah iyilik edenleri sever."', source: 'Âl-i İmrân 134' },
  },
  {
    id: 'kelebek', cat: 'sabir', emoji: '🦋', grad: ['#3B0A4E', '#6B21A8'],
    title: 'Kelebeğin Kozası',
    read: 3,
    paragraphs: [
      'Bir adam, bir kozanın ucunda küçük bir delik açıldığını gördü. Merakla durup izlemeye başladı. Saatlerce, içindeki kelebek o minik delikten çıkmak için çırpındı, zorlandı, uğraştı.',
      'Bir an geldi, kelebek sanki takılıp kaldı. Artık ilerleyemiyor gibiydi; o küçük delikten geçemeyecekmiş gibi görünüyordu. Adam dayanamadı. İyilik olsun diye bir makas aldı, kozanın kalan kısmını kesip deliği genişletti. Kelebek kolayca dışarı çıktı.',
      'Ama bir tuhaflık vardı: Bedeni şişkin, kanatları buruşuk ve cılızdı. Adam kelebeğin birazdan kanatlarını açıp uçmasını bekledi. O an hiç gelmedi. Kelebek ömrü boyunca o şiş bedeniyle sürünerek yaşadı; hiç uçamadı.',
      'Adamın bilmediği şey şuydu: Kelebeğin o dar delikten güçlükle geçmesi, bir işkence değil, bir zorunluluktu. O çırpınma sırasında bedenindeki sıvı kanatlara pompalanır; kelebek ancak bu mücadeleyle uçacak gücü kazanır. Zorluğu ortadan kaldıran el, aslında uçma yeteneğini de almıştı.',
    ],
    question: 'Adamın "iyilik" sandığı müdahale neye mal oldu?',
    choices: [
      'Kelebeğin gelişmesi için gereken mücadeleyi elinden aldı',
      'Kelebeğe zaman kazandırdı',
      'Hiçbir şeye — sadece yardım etti',
    ],
    correct: 0,
    lesson: 'Bazı zorluklar, üstesinden gelmemiz için değil, bizi güçlendirmek için vardır. Her sıkıntıyı hemen kaldırmak, her acıyı anında dindirmek — çoğu zaman merhamet değil, gelişimin önünü kesmektir. Allah kuluna verdiği imtihanı boşuna vermez; o dar delikten geçerken kazandığımız güç, sonraki uçuşumuzun sırrıdır. Kolaylık için ettiğimiz dua kabul olurken, bazen "zorluğa dayanma gücü" en büyük lütuftur.',
    verse: { text: '"Şüphesiz zorlukla beraber bir kolaylık vardır."', source: 'İnşirâh 6' },
  },
  {
    id: 'balikci', cat: 'sabir', emoji: '🎣', grad: ['#0E3B2E', '#134E4A'],
    title: 'Balıkçı ile İş Adamı',
    read: 4,
    paragraphs: [
      'Zengin bir iş adamı, tatilde küçük bir sahil kasabasına gitti. Öğle vakti iskelede, güneşin altında sırtüstü uzanmış huzurla dinlenen bir balıkçı gördü. Teknesinde birkaç taze balık vardı.',
      '"Ne güzel balıklar," dedi iş adamı. "Bunları tutmak ne kadar sürdü?" Balıkçı gülümsedi: "Çok sürmedi, birkaç saat." — "Peki neden daha fazla kalıp daha çok tutmadın?" Balıkçı omuz silkti: "Bu kadarı ailemin ihtiyacına yeter."',
      '"Ama fazla vaktinle ne yapıyorsun?" diye üsteledi iş adamı. Balıkçı anlattı: "Sabah geç kalkarım, biraz balık tutarım, çocuklarımla oynarım, öğleden sonra eşimle dinlenirim, akşam köye iner, dostlarımla sohbet eder, gülerim. Günüm dolu dolu geçer."',
      'İş adamı ciddileşti: "Bak, ben sana yardım edeyim. Daha çok balık tut, parayı biriktir, ikinci bir tekne al. Sonra bir filo. Fabrikaya balık sat, şehre taşın, büyük bir şirket kur." — "Peki sonra?" dedi balıkçı. "Sonra," dedi iş adamı gözleri parlayarak, "şirketini satar, milyonlarla emekli olur, küçük bir sahil kasabasına yerleşir; sabah geç kalkar, biraz balık tutar, çocuklarınla oynar, akşam dostlarınla sohbet edersin!"',
      'Balıkçı bir süre sessiz kaldı. Sonra gülümsedi: "Ama ben bunu şu an zaten yapıyorum."',
    ],
    question: 'İş adamının onca yıllık planının varış noktası neresiydi?',
    choices: [
      'Balıkçının hâlihazırda sahip olduğu huzur',
      'Gerçek zenginlik ve mutluluk',
      'Balıkçıdan çok daha iyi bir hayat',
    ],
    correct: 0,
    lesson: 'Çoğu zaman "bir gün huzura kavuşmak için" bugünün huzurunu feda ederiz. Yıllarca koşarız — sonunda vardığımız yer, aslında en baştan elimizde olan şeydir: yeterlilik, aile, dostluk, şükür. İslam buna "kanaat" der: Aza yetinip çoğunun peşinde ruhunu tüketmemek. "Daha fazla" hep bir sonraki tepenin ardındadır; oysa yetinmeyi bilen, zaten zirvededir. Zenginlik malın çokluğu değil, gönlün tokluğudur.',
    verse: { text: '"Kim Allah\'a tevekkül ederse, O ona yeter."', source: 'Talâk 3' },
  },
  {
    id: 'bin-deve', cat: 'hikmet', emoji: '🐪', grad: ['#3B2A16', '#92600D'],
    title: 'Bin Deve',
    read: 3,
    paragraphs: [
      'Zengin bir tüccarın bin devesi vardı. Kervanı çölde ilerlerken bir bilge ile karşılaştı. Tüccar övünerek servetinden bahsetti: "Bin devem var, saymakla bitiremezsin."',
      'Bilge sordu: "Bu develer sana huzur mu veriyor, kaygı mı?" Tüccar bir an durakladı: "Doğrusu geceleri uyuyamıyorum. Ya bir hastalık çıkarsa, ya çalınırsa, ya yolda telef olursa... Bir tanesini bile kaybetsem içim yanıyor."',
      'Bilge gülümsedi: "Demek develer senin değil, sen develerin oldun. Onlar seni taşımıyor; sen onların yükünü taşıyorsun. Malın, seni kendine hizmetçi yapmışsa — sahibi sen misin, yoksa o mu?"',
      'Tüccar o gece uzun uzun düşündü. Ertesi sabah develerinin bir kısmını yoksullara dağıttı, bir kısmıyla kuyular açtırdı, gerisini helal yollarda işletti. İlk kez, bir devenin telef olması onu geceleri ağlatmadı. Çünkü artık develere değil, onları verene bağlıydı.',
    ],
    question: 'Tüccarın huzuru neyi değiştirince geldi?',
    choices: [
      'Mala sahip olurken malın kölesi olmamayı öğrenince',
      'Bütün develerini satınca',
      'Daha çok deve alınca',
    ],
    correct: 0,
    lesson: 'Mal, elimizde olduğunda nimet; kalbimize girdiğinde yüktür. İslam zenginliği yasaklamaz — Hz. Osman, Hz. Abdurrahman bin Avf çok zengindi. Yasakladığı, malın kalbe hükmetmesidir. Elinin malı ol, kalbinin değil. Verebiliyorsan sahipsindir; veremiyorsan sahip olunmuşsundur. Gerçek özgürlük, "kaybetsem ne olur?" diyebilmektir; çünkü asıl bağlılığın, verene olmalıdır.',
    verse: { text: '"Mallarınız ve çocuklarınız ancak bir imtihandır. Büyük mükâfat ise Allah katındadır."', source: 'Teğâbün 15' },
  },
  {
    id: 'kartal', cat: 'hikmet', emoji: '🦅', grad: ['#1F2937', '#374151'],
    title: 'Tavuklar Arasındaki Kartal',
    read: 3,
    paragraphs: [
      'Bir çiftçi, dağda bulduğu bir kartal yavrusunu kümesteki tavukların arasına koydu. Yavru kartal, tavuklarla birlikte büyüdü. Onlar gibi yerden yem topladı, onlar gibi gıdakladı, onlar gibi kısa kısa kanat çırpıp bir metre havalanıp yere kondu. Kendini bir tavuk sanıyordu.',
      'Yıllar geçti. Bir gün gökyüzünde muhteşem bir kuş süzüldü. Kanatlarını hiç kırpmadan, rüzgârın üstünde asılı gibi duruyordu. İhtişamla döndü, yükseldi, kayboldu. Yaşlı kartal başını kaldırıp hayranlıkla baktı: "Bu ne muhteşem kuş! Keşke ben de öyle uçabilseydim."',
      'Yanındaki tavuk umursamazca yem gagaladı: "Boşver, o kartaldır, göklerin kralı. Biz tavuğuz, yerin. Sen de bizdensin." Kartal içini çekti, başını önüne eğdi ve yem toplamaya devam etti.',
      'Ve o kartal, göklerin kralı olarak yaratıldığı halde, ömrü boyunca bir tavuk gibi yaşadı ve öyle öldü. Çünkü kim olduğunu ona kimse söylememişti — o da hiç sormamıştı.',
    ],
    question: 'Kartalı yerde tutan şey neydi?',
    choices: [
      'Kanatları değil, kendini tanımaması',
      'Gerçekten uçamaması',
      'Çiftçinin onu bağlaması',
    ],
    correct: 0,
    lesson: 'İnsan, yeryüzünde "en şerefli" yaratılmışken (İsrâ 70), çoğu zaman etrafındaki "tavukların" ona biçtiği sınırlarla yaşar: "Sen yapamazsın, sen bunu hak etmezsin, sen böylesin." Oysa her insanda göklere yükselecek bir kanat gizlidir — iman, akıl, irade. Seni yerde tutan şey yeteneksizliğin değil, kim olduğunu unutmandır. Yaratıcın seni kartal yaratmışken, tavuk olduğuna inandıran her sese kulağını kapat. Uçmak için önce "ben uçabilirim" demek gerekir.',
    verse: { text: '"Andolsun, biz insanoğlunu şerefli kıldık."', source: 'İsrâ 70' },
  },
  {
    id: 'iki-tohum', cat: 'sabir', emoji: '🌾', grad: ['#2E4E0A', '#3F6212'],
    title: 'Toprakta İki Tohum',
    read: 3,
    paragraphs: [
      'Verimli bir toprağın altında yan yana iki tohum uzanıyordu. Bahar geldi, toprak ısındı. İlk tohum heyecanla kımıldadı: "Büyümek istiyorum! Köklerimi derinlere salmak, filizimi yukarı, güneşe uzatmak istiyorum. Toprağı yarıp çıkmak, çiçek açmak istiyorum!" Ve öyle yaptı. Zorlandı, çabaladı, toprağı deldi, ışığa ulaştı.',
      'İkinci tohum ise korkuyordu: "Köklerimi salsam aşağıda neye çarparım, bilmiyorum. Filizimi yukarı uzatsam narin gövdem incinebilir. Toprağı yarsam yavrularımı, çiçeklerimi tehlikeye atarım. Salyangozlar yiyebilir, çocuklar koparabilir. En iyisi güvende olana kadar bekleyeyim."',
      'Ve bekledi. Karanlıkta, güvenli toprağın altında, kımıldamadan bekledi.',
      'Birkaç hafta sonra, toprağı eşeleyen bir tavuk, hiç kıpırdamadan bekleyen o ikinci tohumu buldu ve gagasıyla yutuverdi. Oysa yukarıda, ilk tohum artık güneşe uzanan bir çiçekti.',
    ],
    question: 'İkinci tohumu "güvende" sandığı yer neye dönüştü?',
    choices: [
      'Büyümekten korkanın, olduğu yerde yok olduğuna',
      'Sabrın her zaman kazandırdığına',
      'Toprağın tehlikeli olduğuna',
    ],
    correct: 0,
    lesson: 'Bazen en büyük risk, hiç risk almamaktır. "Güvende kalayım" diye kımıldamadan beklemek, çoğu zaman bizi büyümekten alıkoyar. İman da böyledir; tohum gibi yarılıp filizlenmeyi, hatayı, düşmeyi, yeniden kalkmayı göze almayı ister. Allah gayret edeni sever: "İnsan için ancak çalıştığı vardır." Konfor alanının karanlığında beklemek güvenli görünür — ama orada ne çiçek açılır, ne güneş görülür. Tevekkül, hareketsiz beklemek değil; ekip sonucu Allah\'a bırakmaktır.',
    verse: { text: '"...Bir toplum kendini değiştirmedikçe Allah onların durumunu değiştirmez."', source: "Ra'd 11" },
  },
  {
    id: 'fil', cat: 'hikmet', emoji: '🐘', grad: ['#4E3B0A', '#854D0E'],
    title: 'İpe Bağlı Fil',
    read: 3,
    paragraphs: [
      'Bir gezgin, panayırda kocaman fillerin küçük bir iple, incecik bir kazığa bağlandığını gördü. Ne zincir vardı, ne kafes. O devasa hayvanlar, isteseler bir hamlede ipi koparıp özgür kalabilirlerdi. Ama kımıldamıyorlardı bile.',
      'Şaşkınlıkla fil bakıcısına sordu: "Bu kadar güçlü hayvanlar, nasıl oluyor da bu ince iple duruyorlar?" Bakıcı gülümsedi: "Onlar daha yavruyken, çok küçük ve güçsüzken aynı iple bağlarız. O zaman ne kadar uğraşsalar ipi koparamazlar. Zamanla \'ben bu ipi koparamam\' diye inanırlar."',
      '"Fil büyür, kocaman olur, gücü kat kat artar. Ama o inanç aklında kalır. Artık ipi koparabileceğini hiç denemez bile. Çünkü zihninde hâlâ o güçsüz yavrudur."',
      'Gezgin uzun uzun o filleri seyretti. Onları bağlayan ip değildi; onları bağlayan, yıllar önce kabullendikleri bir "yapamam" inancıydı.',
    ],
    question: 'Fili yerinde tutan gerçek bağ neydi?',
    choices: [
      'Geçmişte oluşmuş "yapamam" inancı',
      'İpin gerçekten güçlü olması',
      'Bakıcıdan korkması',
    ],
    correct: 0,
    lesson: 'Çoğumuz, yıllar önce yaşadığımız bir başarısızlığın ipiyle bağlı yaşarız: "Ben zaten beceremem, ben değişemem, benden adam olmaz." O ip belki bir zamanlar gerçekti — ama sen büyüdün, güçlendin, değiştin; inancın ise küçük kaldı. Allah tevbe kapısını hep açık tutar; "geçmişte böyleydim" demek, "hep böyle kalacağım" demek değildir. Seni bağlayan ipi bir kez sınamaya değer — çoğu zaman koparması sandığından kolaydır. Rahmetten ümit kesmemek, o ipi koparmakla başlar.',
    verse: { text: '"...Allah\'ın rahmetinden ümit kesmeyin. Şüphesiz Allah bütün günahları bağışlar."', source: 'Zümer 53' },
  },
];

export default STORIES;
