// frontend/src/data/nurHazine.js
// 💛 NUR HAZİNESİ — Nur Yolu'nun içerik hazinesi.
// 4 bölüm: Hidayet Duaları · Tesbihat · Dünya Tarihinde Müslümanlar ·
// Kur'an'daki Mucizeler. Tüm metinler özgün kaleme alınmıştır; ayet
// mealleri kaynaklı ve ölçülü dille verilir, tarih bilgileri yaygın
// kabul gören ansiklopedik bilgilerdir (telifsiz).

// ═══════════════ 🤲 HİDAYET DUALARI ═══════════════
// Kur'an ve sahih sünnetten, "doğru yol" ekseninde seçilmiş dualar.
export const HIDAYET_DUALARI = [
  {
    id: 'sirat', when: 'Her namazda, her rekatta',
    ar: 'اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    read: "İhdinas-sırâtal-müstakîm",
    tr: 'Bizi dosdoğru yola ilet.',
    source: 'Fâtiha 6',
    note: 'Günde en az kırk kez tekrarladığımız, ümmetin ana duası: yol isteme duası.',
  },
  {
    id: 'kalp-kaymasin', when: 'Sabah ve akşam',
    ar: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً',
    read: 'Rabbenâ lâ tüziğ kulûbenâ ba\'de iz hedeytenâ ve heb lenâ min ledünke rahmeh',
    tr: 'Rabbimiz! Bizi hidayete erdirdikten sonra kalplerimizi kaydırma; bize katından rahmet bağışla.',
    source: 'Âl-i İmrân 8',
    note: 'Hidayet üzere KALMAK için âlimlerin en çok tavsiye ettiği ayet duası.',
  },
  {
    id: 'kalp-sabit', when: 'Kalp daraldığında',
    ar: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    read: 'Yâ mukallibel-kulûb, sebbit kalbî alâ dînik',
    tr: 'Ey kalpleri evirip çeviren! Kalbimi dinin üzere sabit kıl.',
    source: 'Tirmizî, Deavât 89',
    note: 'Peygamber Efendimizin (s.a.v.) en çok yaptığı dualardan olduğu rivayet edilir.',
  },
  {
    id: 'huda-tuka', when: 'Günün her vakti',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    read: "Allahümme innî es'elükel-hüdâ vet-tükâ vel-afâfe vel-ğınâ",
    tr: "Allah'ım! Senden hidayet, takva, iffet ve gönül zenginliği isterim.",
    source: 'Müslim, Zikir 72',
    note: 'Dört istekte bir hayat programı: yol, sakınma, temizlik, kanaat.',
  },
  {
    id: 'seyyidul-istigfar', when: 'Sabah ve akşam (bir kez)',
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    read: "Allahümme ente Rabbî lâ ilâhe illâ ente halaktenî ve ene abdüke ve ene alâ ahdike ve va'dike mesteta'tü...",
    tr: "Allah'ım! Sen benim Rabbimsin, Senden başka ilâh yoktur. Beni Sen yarattın, ben Senin kulunum; gücüm yettiğince Sana verdiğim söz üzereyim...",
    source: 'Buhârî, Deavât 2 (Seyyidü\'l-İstiğfar)',
    note: 'İstiğfarın efendisi: Efendimiz, inanarak okuyanın müjdesini bildirmiştir.',
  },
  {
    id: 'gogus-genisligi', when: 'Zor bir işe başlarken',
    ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
    read: 'Rabbişrah lî sadrî ve yessir lî emrî vahlül ukdeten min lisânî yefkahû kavlî',
    tr: 'Rabbim! Göğsüme genişlik ver, işimi kolaylaştır, dilimdeki düğümü çöz ki sözümü anlasınlar.',
    source: 'Tâhâ 25-28',
    note: "Hz. Musa'nın (a.s.) Firavun'a giderken yaptığı dua — her zor kapının anahtarı.",
  },
  {
    id: 'nesil', when: 'Ailen için',
    ar: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    read: 'Rabbenâ heb lenâ min ezvâcinâ ve zürriyyâtinâ kurrate a\'yünin vec\'alnâ lil-müttekîne imâmâ',
    tr: 'Rabbimiz! Bize eşlerimizden ve nesillerimizden göz aydınlığı olacak kimseler bağışla; bizi takva sahiplerine öncü yap.',
    source: 'Furkân 74',
    note: "Rahmân'ın has kullarının duası: aile ve nesil için yol duası.",
  },
  {
    id: 'namaz-nesli', when: 'Namaza devam niyetiyle',
    ar: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    read: "Rabbic'alnî mukîmes-salâti ve min zürriyyetî, Rabbenâ ve tekabbel duâ'",
    tr: 'Rabbim! Beni ve neslimi namazı dosdoğru kılanlardan eyle. Rabbimiz, duamı kabul et.',
    source: 'İbrâhîm 40',
    note: "Hz. İbrahim'in (a.s.) duası — namaz alışkanlığının dua ayağı.",
  },
  {
    id: 'kardeslik', when: 'Ümmet için',
    ar: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِلَّذِينَ آمَنُوا',
    read: 'Rabbenağfir lenâ ve li-ihvâninellezîne sebekûnâ bil-îmâni ve lâ tec\'al fî kulûbinâ ğıllen lillezîne âmenû',
    tr: 'Rabbimiz! Bizi ve bizden önce iman eden kardeşlerimizi bağışla; kalplerimizde iman edenlere karşı hiçbir kin bırakma.',
    source: 'Haşr 10',
    note: 'Kalbi kinden temizleyen ümmet duası.',
  },
  {
    id: 'dunya-ahiret', when: 'Her duanın sonunda',
    ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    read: 'Rabbenâ âtinâ fid-dünyâ haseneten ve fil-âhirati haseneten ve kınâ azâben-nâr',
    tr: 'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver; bizi ateş azabından koru.',
    source: 'Bakara 201',
    note: 'Efendimizin (s.a.v.) en çok yaptığı dua olduğu rivayet edilir (Buhârî, Deavât 55).',
  },
];

// ═══════════════ 📿 TESBİHAT ═══════════════
// Namaz sonrası tesbihat ve günlük zikir setleri (sayaçlı çalışır).
export const TESBIHAT_SETS = [
  {
    id: 'namaz', title: 'Namaz Tesbihatı', emoji: '🕌', color: '#34D399',
    desc: '33 Sübhanallah · 33 Elhamdülillah · 33 Allahu Ekber + tehlil',
    source: 'Müslim, Mesâcid 146',
    steps: [
      { ar: 'سُبْحَانَ اللّٰهِ', name: 'Sübhânallah', mean: "Allah'ı tüm eksikliklerden tenzih ederim", target: 33 },
      { ar: 'اَلْحَمْدُ لِلّٰهِ', name: 'Elhamdülillâh', mean: 'Hamd Allah\'a mahsustur', target: 33 },
      { ar: 'اَللّٰهُ أَكْبَرُ', name: 'Allâhu Ekber', mean: 'Allah en büyüktür', target: 33 },
      { ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', name: 'Tehlil', mean: 'Allah\'tan başka ilâh yoktur; O tektir, ortağı yoktur. Mülk O\'nundur, hamd O\'nadır ve O her şeye kadirdir', target: 1 },
    ],
  },
  {
    id: 'istigfar', title: 'Günlük İstiğfar', emoji: '🤲', color: '#38BDF8',
    desc: '100 kez "Estağfirullah" — kalbin cilası',
    source: 'Müslim, Zikir 41 (günde yüz kez istiğfar rivayeti)',
    steps: [
      { ar: 'أَسْتَغْفِرُ اللّٰهَ', name: 'Estağfirullâh', mean: "Allah'tan bağışlanma dilerim", target: 100 },
    ],
  },
  {
    id: 'salavat', title: 'Salavat', emoji: '🌹', color: '#F472B6',
    desc: 'Efendimize (s.a.v.) 100 salavat',
    source: 'Ahzâb 56; Müslim, Salât 70 (bir salavata on rahmet)',
    steps: [
      { ar: 'اَللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ', name: 'Salavât-ı Şerife', mean: "Allah'ım! Muhammed'e ve âline salât eyle", target: 100 },
    ],
  },
  {
    id: 'havkale', title: 'Hazine Zikri', emoji: '💎', color: '#E8C56C',
    desc: '33 kez "Lâ havle" — cennet hazinelerinden',
    source: 'Buhârî, Deavât 50 (cennet hazinelerinden bir hazine)',
    steps: [
      { ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ', name: 'Havkale', mean: 'Güç ve kuvvet ancak Allah\'tandır', target: 33 },
    ],
  },
];

// ═══════════════ 🏛️ DÜNYA TARİHİNDE MÜSLÜMANLAR ═══════════════
// Geçmişten bugüne müslümanların medeniyete katkıları — dönem dönem.
export const TARIH_DONEMLERI = [
  {
    id: 'saadet', era: '610 – 661', title: 'Vahiy ve Saadet Asrı', emoji: '🕋', color: '#34D399',
    intro: 'Her şey "Oku!" emriyle başladı. Yarım asırda okuma yazma bilmeyen bir toplumdan, ilmi ibadet sayan bir medeniyet doğdu.',
    items: [
      { year: '610', title: 'İlk vahiy: "Oku!"', desc: 'Alak Sûresi\'nin ilk ayetleri indi; medeniyetin ilk emri okumak oldu.' },
      { year: '622', title: 'Hicret ve Medine', desc: 'İlk anayasal toplum sözleşmelerinden Medine Vesikası hazırlandı; Mescid-i Nebevî hem mabet hem okul (Suffa) oldu.' },
      { year: '651', title: "Kur'an'ın mushaflaşması", desc: 'Hz. Osman döneminde Kur\'an tek imlada çoğaltılıp merkezlere gönderildi — metin bütünlüğü tarihte eşsiz şekilde korundu.' },
    ],
  },
  {
    id: 'altin', era: '750 – 1258', title: 'İlmin Altın Çağı', emoji: '📜', color: '#E8C56C',
    intro: 'Bağdat, Kurtuba, Kahire ve Semerkant; dünyanın ilim başkentleriydi. Avrupa dillerindeki "algebra, algorithm, chemistry, zenith" kelimeleri bu çağın mirasıdır.',
    items: [
      { year: '~830', title: "Beytü'l-Hikme (Bağdat)", desc: 'Dünyanın dört yanından eserlerin çevrilip geliştirildiği büyük ilim akademisi kuruldu.' },
      { year: '~820', title: 'Hârizmî — cebir ve algoritma', desc: '"El-Cebr" adlı eseriyle cebiri sistemleştirdi; Latinceye geçen adı "algorithm" kelimesini doğurdu.' },
      { year: '859', title: 'Fatıma el-Fihrî — Karaviyyîn', desc: 'Fas\'ta, bir hanımın vakfettiği Karaviyyîn; kesintisiz eğitim veren en eski yükseköğretim kurumlarından kabul edilir.' },
      { year: '~1021', title: "İbnü'l-Heysem — optik ve yöntem", desc: '"Kitâbü\'l-Menâzır"ıyla görmeyi deneyle açıkladı; bilimsel deney yönteminin öncülerinden sayılır.' },
      { year: '1025', title: 'İbn Sînâ — Tıbbın Kanunu', desc: '"El-Kânûn fi\'t-Tıb" Avrupa üniversitelerinde yüzyıllarca temel tıp kitabı olarak okutuldu.' },
      { year: '1206', title: 'Cezerî — makinelerin babası', desc: 'Otomatlar ve su makineleri kitabıyla mühendislik tarihinin başyapıtlarından birini yazdı; krank milini sistemli kullandı.' },
    ],
  },
  {
    id: 'cihan', era: '1300 – 1700', title: 'Cihan Devletleri Çağı', emoji: '🕌', color: '#38BDF8',
    intro: 'İlim ve sanat; mimaride, haritacılıkta ve astronomide zirve eserler verdi.',
    items: [
      { year: '1377', title: 'İbn Haldun — Mukaddime', desc: 'Toplum bilimlerinin kurucu metinlerinden Mukaddime\'yi yazdı; tarihe "umran" teorisiyle baktı.' },
      { year: '1420', title: 'Uluğ Bey Rasathanesi', desc: 'Semerkant\'ta dev rasathane kuruldu; yıldız katalogu asırlarca referans oldu (Ali Kuşçu bu ekolden yetişti).' },
      { year: '1513', title: 'Pîrî Reis haritası', desc: 'Dönemin en dikkat çekici dünya haritalarından birini çizdi; denizcilik kitabı "Kitâb-ı Bahriye"yi yazdı.' },
      { year: '1575', title: 'Mimar Sinan — Selimiye', desc: '"Ustalık eserim" dediği Selimiye ile mimarlık tarihine damga vurdu (UNESCO Dünya Mirası).' },
    ],
  },
  {
    id: 'bugun', era: '1900 – Bugün', title: 'Yeniden Uyanış', emoji: '🌍', color: '#F472B6',
    intro: 'Bugün yaklaşık 2 milyar müslüman; bilimden yardımlaşmaya her alanda küresel katkısını sürdürüyor.',
    items: [
      { year: '1979', title: 'Abdus Selam — Nobel Fizik', desc: 'Elektrozayıf kuram çalışmalarıyla Nobel alan ilk müslüman bilim insanlarından oldu.' },
      { year: '1999', title: 'Ahmed Zewail — Nobel Kimya', desc: '"Femtokimya"nın öncüsü; kimyasal tepkimeleri saniyenin katrilyonda biri ölçeğinde görüntüledi.' },
      { year: '2015', title: 'Aziz Sancar — Nobel Kimya', desc: 'DNA onarımı çalışmalarıyla Nobel Kimya Ödülü\'nü kazandı; "başarımı azim ve düzenli çalışmaya borçluyum" der.' },
      { year: 'Bugün', title: 'Küresel hayır medeniyeti', desc: 'Zekât ve vakıf kültürü; afetlerde ve açlıkla mücadelede dünyanın en büyük sivil yardım ağlarından birini yaşatıyor.' },
    ],
  },
];

// ═══════════════ ✨ KUR'AN'DAKİ MUCİZELER ═══════════════
// Sorumlu çerçeve: Kur'an bir fen kitabı değildir; ancak 14 asır önce
// inen ayetlerdeki işaretlerin bugünkü bilgiyle örtüşmesi, üzerinde
// düşünülmeye değer bir i'caz alanıdır. Her kartta ayet + meal + modern
// bilgi notu birlikte verilir. (art: sayfadaki SVG infografiğin türü)
export const MUCIZELER = [
  {
    id: 'su', emoji: '💧', art: 'water', color: '#38BDF8',
    title: 'Hayatın Sudan Yaratılışı',
    verse: '"...Canlı olan her şeyi sudan yarattık. Hâlâ inanmıyorlar mı?"',
    source: 'Enbiyâ 30',
    fact: 'Modern biyoloji, bilinen bütün canlılığın su temelli olduğunu söyler: hücrenin büyük bölümü sudur ve bilinen hiçbir yaşam formu susuz var olamaz.',
    detail: 'Çölde inen bir kitabın, hayatı "su" ortak paydasında toplaması; bugün canlılığın en temel biyokimyasal gerçeğiyle örtüşür.',
  },
  {
    id: 'evren', emoji: '🌌', art: 'expand', color: '#818CF8',
    title: 'Genişleyen Gökyüzü',
    verse: '"Göğü kudretimizle biz bina ettik ve şüphesiz biz onu genişleticiyiz."',
    source: 'Zâriyât 47',
    fact: "Evrenin genişlediği 1920'lerde (Hubble gözlemleriyle) anlaşıldı ve modern kozmolojinin temeli oldu.",
    detail: 'Ayetteki "genişleticiyiz" (lemûsiûn) ifadesi, müfessirlerce genişlik/güç olarak yorumlanmıştı; bugün okuyana evrenin genişlemesini de düşündürür.',
  },
  {
    id: 'demir', emoji: '🪨', art: 'iron', color: '#94A3B8',
    title: 'Demirin "İndirilmesi"',
    verse: '"...Bir de kendisinde büyük bir kuvvet ve insanlar için faydalar bulunan demiri indirdik..."',
    source: 'Hadîd 25',
    fact: 'Astrofiziğe göre demir, yıldız çekirdeklerinde sentezlenir ve gezegenlere süpernova patlamalarıyla "yukarıdan" ulaşır — Dünya koşullarında üretilemez.',
    detail: 'Kur\'an demir için "yarattık" değil "indirdik" (enzelnâ) ifadesini kullanır; bu incelik, demirin kozmik kökeniyle çarpıcı biçimde uyumludur.',
  },
  {
    id: 'embriyo', emoji: '🫧', art: 'embryo', color: '#F472B6',
    title: 'Anne Karnındaki Evreler',
    verse: '"...Sonra o damlayı asılıp tutunan bir yapı (alaka) yaptık, o yapıyı bir çiğnem et (mudga) hâline getirdik..."',
    source: "Mü'minûn 12-14",
    fact: 'Embriyoloji, embriyonun rahim duvarına tutunarak beslendiğini ve erken dönemde somitleriyle gerçekten "dişlenmiş bir çiğnem" görünümünde olduğunu gösterir.',
    detail: '"Alaka" kelimesi hem "asılıp tutunan" hem "sülük gibi" anlamları taşır — embriyonun tutunma evresini tek kelimeyle resmeder.',
  },
  {
    id: 'denizler', emoji: '🌊', art: 'seas', color: '#22D3EE',
    title: 'Birbirine Karışmayan İki Deniz',
    verse: '"İki denizi birbirine kavuşmak üzere salıvermiştir. Aralarında bir engel vardır, birbirine geçip karışmazlar."',
    source: 'Rahmân 19-20',
    fact: 'Oşinografi, farklı tuzluluk ve yoğunluktaki su kütlelerinin karşılaştığı yerlerde keskin geçiş bariyerlerinin (haloklin) oluştuğunu gösterir.',
    detail: 'Akdeniz-Atlantik buluşması gibi noktalarda iki su kütlesi, arada görünmez bir perde varmışçasına karakterlerini uzun süre korur.',
  },
  {
    id: 'daglar', emoji: '⛰️', art: 'mountain', color: '#A3E635',
    title: 'Kazık Gibi Dağlar',
    verse: '"Biz yeryüzünü bir döşek, dağları da birer kazık yapmadık mı?"',
    source: 'Nebe 6-7',
    fact: 'Jeoloji, dağların yüzeyde görünenden kat kat derin "kökleri" olduğunu (izostazi) ve yer kabuğunun dengelenmesinde rol oynadığını ortaya koydu.',
    detail: 'Kazık; küçük kısmı dışarıda, büyük kısmı toprakta olan yapıdır — dağların kök yapısı için şaşırtıcı isabetli bir benzetmedir.',
  },
  {
    id: 'tavan', emoji: '🛡️', art: 'shield', color: '#60A5FA',
    title: 'Korunmuş Tavan: Atmosfer',
    verse: '"Gökyüzünü korunmuş bir tavan yaptık. Onlar ise ayetlerinden yüz çevirmektedirler."',
    source: 'Enbiyâ 32',
    fact: 'Atmosfer; zararlı ışınları süzer, gök taşlarının çoğunu yakarak tüketir ve yaşam için gerekli ısıyı dengede tutar — gerçek bir koruyucu katman.',
    detail: 'Ozon tabakasından manyetosfere, gezegenimiz katman katman "korunmuş bir tavan" ile örtülüdür.',
  },
  {
    id: 'parmak', emoji: '🫆', art: 'finger', color: '#E8C56C',
    title: 'Parmak Uçlarının Sırrı',
    verse: '"Evet, bizim onun parmak uçlarını bile düzenlemeye gücümüz yeter."',
    source: 'Kıyâme 3-4',
    fact: "Parmak izinin kişiye özel olduğu 19. yüzyılın sonunda anlaşıldı ve kimliklendirmenin temeli oldu — ikizlerde bile aynı değildir.",
    detail: 'Yeniden diriltmenin delili olarak vücudun en ince ayrıntısına, "parmak uçlarına" işaret edilmesi manidardır.',
  },
  {
    id: 'karanlik-deniz', emoji: '🌑', art: 'deepsea', color: '#6366F1',
    title: 'Derin Denizlerin Karanlığı',
    verse: '"...Yahut (onların durumu) derin bir denizdeki karanlıklar gibidir; onu bir dalga örter, üstünde bir dalga daha, onun da üstünde bulutlar..."',
    source: 'Nûr 40',
    fact: 'Işık okyanusta derinlikle katman katman söner; ayrıca yüzey dalgalarının altında "iç dalgalar" bulunduğu modern oşinografiyle anlaşıldı.',
    detail: 'Dalga üstünde dalga (iç dalgalar) tasviri, denize dalmadan bilinemeyecek bir katmanlılığı resmeder.',
  },
  {
    id: 'bal', emoji: '🍯', art: 'honey', color: '#F59E0B',
    title: 'Arıdan Gelen Şifa',
    verse: '"...Onların karınlarından çeşitli renklerde bir içecek çıkar ki onda insanlar için şifa vardır..."',
    source: 'Nahl 68-69',
    fact: 'Balın antibakteriyel özelliği ve yara iyileşmesindeki desteği modern araştırmalarla belgelenmiştir; tıbbi bal ürünleri klinikte kullanılır.',
    detail: 'Ayet balı "kesin ilaç" değil "içinde şifa bulunan" olarak niteler — ölçülü ve isabetli bir ifade.',
  },
];

// ═══════════════ 🗂️ HAZİNE BÖLÜM KARTLARI ═══════════════
// Nur Yolu "Hazine" sekmesi ve /hazine merkezinde gösterilen büyük kartlar.
export const HAZINE_BOLUMLERI = [
  {
    id: 'dualar', route: '/hazine/dualar', emoji: '🤲',
    title: 'Hidayet Duaları', meta: `${HIDAYET_DUALARI.length} dua · ayet ve sünnetten`,
    desc: 'Doğru yolu istemenin, yolda kalmanın ve kalbi sabit tutmanın duaları — Arapça, okunuş, meal ve kaynakla.',
    grad: ['#0A3524', '#12704B'], accent: '#34D399',
  },
  {
    id: 'tesbihat', route: '/hazine/tesbihat', emoji: '📿',
    title: 'Tesbihat', meta: `${TESBIHAT_SETS.length} zikir seti · sayaçlı`,
    desc: 'Namaz tesbihatı, istiğfar, salavat ve hazine zikri — dokunmatik sayaç, titreşim ve otomatik akışla.',
    grad: ['#0A2E4E', '#155E90'], accent: '#38BDF8',
  },
  {
    id: 'kissalar', route: '/stories', emoji: '🕯️',
    title: 'İbretlik Kıssalar', meta: 'Katmanlı kıssalar · hikmet cevherleri',
    desc: 'Bir kıssa, bir soru, bir hikmet: duraklı okuma, cevher koleksiyonu ve "Hayata Taşı" görevleri.',
    grad: ['#3B2A16', '#8A5A12'], accent: '#E8C56C',
  },
  {
    id: 'tarih', route: '/hazine/tarih', emoji: '🏛️',
    title: 'Dünya Tarihinde Müslümanlar', meta: '4 dönem · vahiyden bugüne',
    desc: 'Cebirden optiğe, Mukaddime\'den Nobel\'e: müslümanların medeniyete kattıklarının zaman tüneli.',
    grad: ['#2E1065', '#5B21B6'], accent: '#A78BFA',
  },
  {
    id: 'mucizeler', route: '/hazine/mucizeler', emoji: '✨',
    title: "Kur'an'daki Mucizeler", meta: `${MUCIZELER.length} işaret · SVG infografikli`,
    desc: '14 asır önce inen ayetlerdeki işaretlerin modern bilgiyle örtüşmesi — ayet, meal ve infografikle.',
    grad: ['#4E1D0A', '#9A4B12'], accent: '#FDBA74',
  },
];

export default { HIDAYET_DUALARI, TESBIHAT_SETS, TARIH_DONEMLERI, MUCIZELER, HAZINE_BOLUMLERI };
