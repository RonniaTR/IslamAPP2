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
// Her madde: art (SVG çizim türü) + detail (tıklayınca açılan derin katman).
export const TARIH_DONEMLERI = [
  {
    id: 'saadet', era: '610 – 661', title: 'Vahiy ve Saadet Asrı', emoji: '🕋', color: '#34D399',
    intro: 'Her şey "Oku!" emriyle başladı. Yarım asırda okuma yazma bilmeyen bir toplumdan, ilmi ibadet sayan bir medeniyet doğdu.',
    items: [
      { id: 'oku', year: '610', art: 'quran', title: 'İlk vahiy: "Oku!"',
        desc: "Alak Sûresi'nin ilk ayetleri indi; medeniyetin ilk emri okumak oldu.",
        detail: 'İlk inen beş ayetin ekseni kalem ve öğretimdir: "O, insana bilmediğini öğretti." (Alak 5). Bu yüzden İslam medeniyeti tarihçilerce "kitap medeniyeti" diye anılır: Cami ile mektep hep yan yana kuruldu, âlimin mürekkebi övüldü, ilim beşikten mezara farz sayıldı.' },
      { id: 'suffa', year: '622', art: 'mosque', title: 'Medine: Vesika ve Suffa',
        desc: 'İlk toplum sözleşmelerinden Medine Vesikası hazırlandı; Mescid-i Nebevî hem mabet hem okul oldu.',
        detail: "Mescidin gölgeliğinde kurulan Suffa, İslam'ın ilk yatılı okuluydu: barınma ve eğitim ücretsizdi, Ebû Hüreyre (r.a.) gibi büyük hadis râvileri burada yetişti. Medine Vesikası ise farklı inanç gruplarının hak ve sorumluluklarını yazılı güvenceye bağlayan çok erken bir örnektir." },
      { id: 'mushaf', year: '651', art: 'quran', title: "Kur'an'ın mushaflaşması",
        desc: "Hz. Osman döneminde Kur'an tek imlada çoğaltılıp merkezlere gönderildi.",
        detail: 'Hz. Ebû Bekir devrinde iki kapak arasına alınan metin, Hz. Osman devrinde çoğaltılarak Mekke, Kûfe, Basra ve Şam\'a gönderildi. Hafızlık geleneğiyle birleşen bu titizlik sayesinde Kur\'an, metni kesintisiz korunmuş kitap olma özelliğini taşır.' },
    ],
  },
  {
    id: 'altin', era: '750 – 1258', title: 'İlmin Altın Çağı', emoji: '📜', color: '#E8C56C',
    intro: 'Bağdat, Kurtuba, Kahire ve Semerkant; dünyanın ilim başkentleriydi. Avrupa dillerindeki "algebra, algorithm, chemistry, zenith" kelimeleri bu çağın mirasıdır.',
    items: [
      { id: 'cabir', year: '~800', art: 'chemistry', title: 'Câbir bin Hayyân — kimyanın babası',
        desc: 'Deneye dayalı kimyanın öncüsü; damıtma ve kristalleştirme yöntemlerini sistemleştirdi.',
        detail: '"Kimya" ve "alkali" gibi kelimeler Arapçadan dünya dillerine geçti. Câbir; laboratuvar düzeneklerini, damıtma (imbik), süblimleştirme ve kristalleştirme tekniklerini yazılı yönteme bağladı. Batı\'da "Geber" adıyla asırlarca okutuldu.' },
      { id: 'harizmi', year: '~820', art: 'algebra', title: 'Hârizmî — cebir ve algoritma',
        desc: '"El-Cebr" ile cebiri sistemleştirdi; Latinceleşen adı "algorithm" kelimesini doğurdu.',
        detail: 'Denklem çözmeyi ilk kez bağımsız bir bilim hâline getiren "El-Kitâbü\'l-Muhtasar fî Hisâbi\'l-Cebr ve\'l-Mukābele"yi yazdı. Hint rakamlarını ve sıfırı Batı\'ya taşıyan da onun aritmetik kitabıdır: bugün her yazılımın kalbindeki "algoritma" kelimesi, adının Latince okunuşudur.' },
      { id: 'hikme', year: '~830', art: 'university', title: "Beytü'l-Hikme (Bağdat)",
        desc: 'Dünyanın dört yanından eserlerin çevrilip geliştirildiği büyük ilim akademisi.',
        detail: 'Halife Me\'mûn döneminde zirveye ulaşan bu "Hikmet Evi"nde Yunanca, Farsça, Sanskritçe eserler Arapçaya çevrildi; ama iş çeviride kalmadı — üzerine yeni matematik, astronomi ve tıp inşa edildi. Tercüme bir esere altın ağırlığınca telif ödendiği rivayet edilir.' },
      { id: 'fihri', year: '859', art: 'university', title: 'Fatıma el-Fihrî — Karaviyyîn',
        desc: 'Bir hanımın vakfettiği Karaviyyîn, kesintisiz eğitim veren en eski yükseköğretim kurumlarından.',
        detail: 'Tüccar kızı Fatıma, mirasını Fas\'ta bir cami-medrese vakfına adadı. Karaviyyîn; UNESCO ve Guinness kayıtlarında dünyanın kesintisiz faaliyetteki en eski yükseköğretim kurumu olarak geçer. Vakıf medeniyetinin gücünü tek başına anlatan bir örnektir.' },
      { id: 'firnas', year: '875', art: 'flight', title: 'Abbas bin Firnâs — uçuş denemesi',
        desc: 'Kurtuba\'da kanat takıp planörvari süzülme denemesi yaptığı kaydedilir.',
        detail: 'Kaynaklar, kumaş ve tüylerden yaptığı kanatlarla tepeden süzülüp bir süre havada kaldığını, inişte sakatlandığını yazar. Ay\'daki bir kratere onun adı verilmiştir. Denemesi, uçuş fikrinin bilinen en erken ciddi girişimlerindendir.' },
      { id: 'battani', year: '~900', art: 'triangle', title: 'Battânî — gökyüzünün matematiği',
        desc: 'Güneş yılını dakika hassasiyetinde hesapladı; trigonometrik oranları astronomiye yerleştirdi.',
        detail: 'Güneş yılını bugünkü değere şaşırtıcı yakınlıkta ölçtü, sinüs-kosinüs kavrayışını gök hesaplarına sistemli uyguladı. Kopernik, "De Revolutionibus"ta ondan defalarca alıntı yapar — Latince adıyla "Albategnius".' },
      { id: 'zehravi', year: '~1000', art: 'surgery', title: 'Zehrâvî — cerrahinin atlası',
        desc: '200\'e yakın cerrahi aleti çizimleriyle anlattığı "Et-Tasrîf"i yazdı.',
        detail: 'Kurtubalı hekim; forsepsten neştere aletleri resimleyerek anlattı, ameliyat tekniklerini ve dikiş için katgütü (eriyen iplik) tarif etti. "Et-Tasrîf", Avrupa\'da yüzyıllarca cerrahi el kitabı olarak kullanıldı; "modern cerrahinin babası" diye anılır.' },
      { id: 'heysem', year: '~1021', art: 'optics', title: "İbnü'l-Heysem — optik ve deney",
        desc: '"Kitâbü\'l-Menâzır"ıyla görmeyi deneyle açıkladı; bilimsel yöntemin öncülerinden.',
        detail: 'Görmenin gözden ışık çıkmasıyla değil, ışığın göze gelmesiyle olduğunu deneylerle gösterdi; karanlık oda (camera obscura) düzeneğini inceledi. "Doğrulanmamış hiçbir iddiaya güvenme" ilkesiyle deneysel yöntemin ilk büyük uygulayıcılarından sayılır.' },
      { id: 'ibnsina', year: '1025', art: 'medicine', title: 'İbn Sînâ — Tıbbın Kanunu',
        desc: '"El-Kânûn fi\'t-Tıb" Avrupa üniversitelerinde yüzyıllarca temel tıp kitabı oldu.',
        detail: 'Bir milyon kelimelik Kanun; hastalıkları sistematik sınıflandırdı, bulaşıcılık ve karantina fikrini işledi, ilaç denemeleri için kurallar koydu. Latinceye "Canon" adıyla çevrildi ve 17. yüzyıla dek ders kitabı kaldı. Batı\'da "Avicenna" olarak bilinir.' },
      { id: 'biruni', year: '~1030', art: 'globe', title: 'Bîrûnî — Dünya\'yı ölçen adam',
        desc: 'Dağ tepesinden ufuk alçalmasını ölçerek Dünya\'nın yarıçapını hesapladı.',
        detail: 'Trigonometrik yöntemle bulduğu değer, bugünkü ölçümlere çok yakındır. Hindistan\'ı sahada inceleyip "Tahkîku mâ li\'l-Hind"i yazdı — karşılaştırmalı kültür araştırmalarının öncü metni sayılır. "Eleştirel yöntemin" ustası kabul edilir.' },
      { id: 'cezeri', year: '1206', art: 'gears', title: 'Cezerî — makinelerin babası',
        desc: 'Otomatlar kitabıyla mühendislik tarihinin başyapıtlarından birini yazdı.',
        detail: '"El-Câmi\' beyne\'l-ilm ve\'l-amel" adlı eserinde su saatleri, otomatik kapılar, müzik otomatları ve pompaların çizimli imalat tarifleri vardır. Krank-biyel mekanizmasını sistemli kullanışı, onu robotik ve mekatroniğin atası yapar. Diyarbakır Artuklu sarayında çalıştı.' },
      { id: 'nefis', year: '1242', art: 'heart', title: "İbnü'n-Nefîs — küçük kan dolaşımı",
        desc: 'Kanın kalpten akciğere gidip temizlenerek döndüğünü Avrupa\'dan asırlar önce yazdı.',
        detail: 'Galen\'in "kalp duvarında delik vardır" görüşünü reddedip pulmoner dolaşımı doğru tarif etti. Bu metin 20. yüzyılda yeniden keşfedilince tıp tarihi yeniden yazıldı: küçük kan dolaşımının ilk tarifçisi Kahireli bir müslüman hekimdi.' },
    ],
  },
  {
    id: 'cihan', era: '1300 – 1700', title: 'Cihan Devletleri Çağı', emoji: '🕌', color: '#38BDF8',
    intro: 'İlim ve sanat; mimaride, haritacılıkta ve astronomide zirve eserler verdi.',
    items: [
      { id: 'haldun', year: '1377', art: 'network', title: 'İbn Haldun — Mukaddime',
        desc: 'Toplum bilimlerinin kurucu metinlerinden Mukaddime\'yi yazdı.',
        detail: 'Tarihi rivayet yığını olmaktan çıkarıp "umran" (medeniyet) yasalarını arayan bir bilime dönüştürdü: asabiyet teorisi, devletlerin ömür evreleri, ekonomi-ahlak ilişkisi... Toynbee onun için "herhangi bir çağda, herhangi bir ülkede üretilmiş en büyük tarih felsefesi" der.' },
      { id: 'ulugbey', year: '1420', art: 'observatory', title: 'Uluğ Bey Rasathanesi',
        desc: 'Semerkant\'ta dev rasathane; yıldız katalogu asırlarca referans oldu.',
        detail: 'Hükümdar-astronom Uluğ Bey\'in 40 metrelik dev sekstantıyla hazırlanan "Zîc-i Uluğ Bey", 1018 yıldızın konumunu teleskopsuz çağın en yüksek hassasiyetiyle verdi; Oxford\'da 17. yüzyılda basılıp kullanıldı. Ali Kuşçu bu ekolden çıkıp İstanbul\'a ilim taşıdı.' },
      { id: 'sabuncuoglu', year: '1465', art: 'surgery', title: 'Sabuncuoğlu Şerefeddin — resimli cerrahi',
        desc: 'Amasyalı hekim, ameliyatları minyatürlerle resimleyen Türkçe cerrahi atlası yazdı.',
        detail: '"Cerrâhiyyetü\'l-Hâniyye"; ameliyat sahnelerini, aletleri ve hekim-hasta konumlarını tek tek resimleyen, üstelik dönemine göre istisnai biçimde Türkçe yazılmış bir başyapıttır. Kadın hastalara kadın cerrahların ("tabibe") müdahalesini de resmeder.' },
      { id: 'piri', year: '1513', art: 'map', title: 'Pîrî Reis haritası',
        desc: 'Dönemin en dikkat çekici dünya haritalarından birini çizdi.',
        detail: 'Ceylan derisi üzerine çizilen harita; Atlantik kıyılarını, Kolomb\'un kayıp haritasından da yararlanarak şaşırtıcı isabette gösterir. "Kitâb-ı Bahriye"si ise Akdeniz\'in liman liman rehberi — denizcilik coğrafyasının klasiğidir.' },
      { id: 'sinan', year: '1575', art: 'dome', title: 'Mimar Sinan — Selimiye',
        desc: '"Ustalık eserim" dediği Selimiye ile mimarlık tarihine damga vurdu.',
        detail: '31,25 metrelik kubbeyi sekiz fil ayağına oturtup mekânı tek hamlede kucaklattı; depreme dayanıklı temel teknikleri ve akustik küpleriyle 400 yıldır dimdik. Çıraklık (Şehzadebaşı), kalfalık (Süleymaniye), ustalık (Selimiye) üçlemesi UNESCO mirasıdır.' },
      { id: 'evliya', year: '1671', art: 'map', title: 'Evliya Çelebi — Seyahatnâme',
        desc: 'Elli yılda üç kıtayı gezip on ciltlik dev bir gözlem ansiklopedisi bıraktı.',
        detail: 'Şehirlerin mimarisinden esnaf loncalarına, dillerden yemeklere binlerce ayrıntıyı kaydetti. UNESCO 2011\'i "Evliya Çelebi Yılı" ilan etti; Seyahatnâme bugün sosyal tarihçilerin başucu kaynağıdır.' },
    ],
  },
  {
    id: 'bugun', era: '1900 – Bugün', title: 'Yeniden Uyanış', emoji: '🌍', color: '#F472B6',
    intro: 'Bugün yaklaşık 2 milyar müslüman; bilimden yardımlaşmaya her alanda küresel katkısını sürdürüyor.',
    items: [
      { id: 'salam', year: '1979', art: 'atom', title: 'Abdus Selam — Nobel Fizik',
        desc: 'Elektrozayıf kuram çalışmalarıyla Nobel alan ilk müslüman bilim insanlarından.',
        detail: 'Elektromanyetik kuvvetle zayıf kuvveti tek çatıda birleştiren kurama katkısıyla 1979 Nobel Fizik Ödülü\'nü paylaştı. Ödül konuşmasına Mülk Sûresi\'nden ayet okuyarak başladı; gelişen ülkelerde fizik okulları kurulmasına ömrünü adadı.' },
      { id: 'zewail', year: '1999', art: 'femto', title: 'Ahmed Zewail — femtokimya',
        desc: 'Kimyasal tepkimeleri saniyenin katrilyonda biri ölçeğinde görüntüledi.',
        detail: 'Lazer atımlarıyla atomların bağ kurma-koparma ânını "çekti"; kimyaya femtosaniye kamerası kazandırdı ve 1999 Nobel Kimya Ödülü\'nü aldı. Mısır\'da bilim üniversitesi kurulmasına öncülük etti.' },
      { id: 'sancar', year: '2015', art: 'dna', title: 'Aziz Sancar — DNA onarımı',
        desc: 'DNA onarım mekanizmalarını haritalayarak Nobel Kimya Ödülü\'nü kazandı.',
        detail: 'Savur doğumlu bilim insanı; hücrenin hasarlı DNA\'yı kesip onaran "nükleotid eksizyon onarımı" mekanizmasını aydınlattı — kanser tedavilerine yol açan bir keşif. Nobel madalyasını Anıtkabir\'e emanet etti; "başarının sırrı azim ve düzenli çalışmaktır" der.' },
      { id: 'hayir', year: 'Bugün', art: 'hands', title: 'Küresel hayır medeniyeti',
        desc: 'Zekât ve vakıf kültürü, dünyanın en büyük sivil yardım ağlarından birini yaşatıyor.',
        detail: 'Ramazan sofralarından kurban organizasyonlarına, su kuyularından afet köprülerine; zekât-sadaka-vakıf üçlüsü her yıl on milyarlarca dolarlık gönüllü yardımı kıtalar arası taşıyor. "İnsanların en hayırlısı, insanlara en faydalı olandır" ölçüsü bugün de işliyor.' },
    ],
  },
];
// Toplam madde sayısı (ilerleme rozetleri için)
export const TARIH_TOPLAM = TARIH_DONEMLERI.reduce((n, e) => n + e.items.length, 0);

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
    id: 'esma', route: '/hazine/esma', emoji: '🌟',
    title: 'Esmaül Hüsna', meta: '99 isim · hat + tefekkür + ezber sınavı',
    desc: 'En güzel 99 ismi hattıyla, anlamıyla ve hayata dokunan tefekkür cümleleriyle keşfet; Günün İsmi ve ezber sınavıyla derinleş.',
    grad: ['#3B2A16', '#8A5A12'], accent: '#E8C56C',
  },
  {
    id: 'mucizeler', route: '/hazine/mucizeler', emoji: '✨',
    title: "Kur'an'daki Mucizeler", meta: `${MUCIZELER.length} işaret · SVG infografikli`,
    desc: '14 asır önce inen ayetlerdeki işaretlerin modern bilgiyle örtüşmesi — ayet, meal ve infografikle.',
    grad: ['#4E1D0A', '#9A4B12'], accent: '#FDBA74',
  },
];

// ═══════════════ 🌍 İngilizce içerik iliştir (contentI18n) ═══════════════
import { DUALAR_EN, TESBIHAT_EN, MUCIZELER_EN, TARIH_ERA_EN, TARIH_ITEM_EN, BOLUM_EN } from './nurHazine.en';
HAZINE_BOLUMLERI.forEach((b) => { if (BOLUM_EN[b.id]) b.en = BOLUM_EN[b.id]; });
HIDAYET_DUALARI.forEach((d) => { if (DUALAR_EN[d.id]) d.en = DUALAR_EN[d.id]; });
TESBIHAT_SETS.forEach((s) => { if (TESBIHAT_EN[s.id]) s.en = TESBIHAT_EN[s.id]; });
MUCIZELER.forEach((m) => { if (MUCIZELER_EN[m.id]) m.en = MUCIZELER_EN[m.id]; });
TARIH_DONEMLERI.forEach((era) => {
  if (TARIH_ERA_EN[era.id]) era.en = TARIH_ERA_EN[era.id];
  era.items.forEach((it) => { if (TARIH_ITEM_EN[it.id]) it.en = TARIH_ITEM_EN[it.id]; });
});

export default { HIDAYET_DUALARI, TESBIHAT_SETS, TARIH_DONEMLERI, MUCIZELER, HAZINE_BOLUMLERI };
