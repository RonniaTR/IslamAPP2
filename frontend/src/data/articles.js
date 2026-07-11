// frontend/src/data/articles.js
// 📚 MAKALE KÜTÜPHANESİ — raflar halinde özgün makaleler.
// Kapaklar dış görsel değil, tema uyumlu gradient + emoji (telif yok).
// Her makale kaynak referanslıdır; hadis kaynaklı ifadelerde ölçülü dil
// kullanılır. paragraphs: düz metin | { quote, source } alıntı kartı.

export const SHELVES = [
  { id: 'ahlak', title: 'İslam Ahlakı', icon: '🌿' },
  { id: 'ibadet', title: 'İbadet Hayatımız', icon: '🕌' },
  { id: 'siyer', title: "Siyer'den Sahneler", icon: '🕯️' },
  { id: 'kalp', title: 'Kalp ve Maneviyat', icon: '💛' },
];

export const ARTICLES = [
  // ─────────── İSLAM AHLAKI ───────────
  {
    id: 'ofke', shelf: 'ahlak', emoji: '🌊', grad: ['#0E3B2E', '#134E4A'],
    title: 'Öfkeyi Yenmek: Asıl Pehlivanlık',
    excerpt: 'Güreşte rakibini deviren mi güçlüdür, öfke anında kendini tutan mı?',
    refs: ['Buhârî, Edeb 76', 'Fussilet 34', "Âl-i İmrân 134"],
    paragraphs: [
      'Bir gün Peygamber Efendimiz (s.a.v.) yanındakilere "Siz kimi pehlivan sayarsınız?" diye sordu. "Kimsenin yenemediği kişiyi" dediler. Bunun üzerine asıl pehlivanın, öfke anında kendine hâkim olan kişi olduğunu bildirdi (Buhârî, Edeb 76). Bu ölçü, gücün tanımını kökten değiştirir: Kas gücü rakibi yener; irade gücü ise insanın kendi nefsini.',
      { quote: 'Onlar bollukta da darlıkta da infak ederler, öfkelerini yutarlar ve insanları affederler. Allah iyilik edenleri sever.', source: 'Âl-i İmrân 134 (meal)' },
      "Kur'an, öfkeyi yok saymaz — onu yönetmeyi öğretir. Öfke insanın doğasında vardır; imtihan, o geldiğinde ne yaptığımızdadır. Fussilet Suresi'nde kötülüğü en güzel şekilde savmamız emredilir; böyle yapıldığında aradaki düşmanlığın sıcak bir dostluğa dönüşebileceği müjdelenir (Fussilet 34).",
      "Peygamberimiz öfkelenen kişiye pratik adımlar da öğretmiştir: Ayaktaysan otur, şeytandan Allah'a sığın, mümkünse ortamı değiştir. Bunlar rivayetlerde yer alan, öfkenin fizyolojisini bugün bilimin de doğruladığı tekniklerdir: Araya mesafe ve zaman koymak, tepki ile dürtü arasındaki o kritik saniyeleri kazandırır.",
      "Öfkeyi yutmak zayıflık değildir; tam tersine iki zaferi birden içerir. Birincisi nefse karşı kazanılır, ikincisi ilişkiye dair: Öfkeyle söylenen tek cümlenin yıktığını, sabırla susulan tek anın koruduğunu hepimiz yaşayarak biliriz. Bugün deneyebileceğin küçük bir adım: Öfke yükseldiğinde içinden 'asıl pehlivanlık şimdi' de ve on saniye bekle.",
    ],
  },
  {
    id: 'giybet', shelf: 'ahlak', emoji: '🍂', grad: ['#3B2A16', '#713F12'],
    title: 'Gıybet: Dilin En Sinsi İmtihanı',
    excerpt: 'Söylediğimiz doğru bile olsa, arkadan konuşmak neden bu kadar ağır?',
    refs: ['Hucurât 12', 'Müslim, Birr 70'],
    paragraphs: [
      "Peygamberimiz (s.a.v.) bir gün ashabına 'Gıybet nedir bilir misiniz?' diye sordu ve şöyle tarif etti: 'Kardeşini, hoşlanmayacağı bir şeyle anmandır.' 'Ya söylediğim onda gerçekten varsa?' diye sorulunca cevap netti: 'Söylediğin onda varsa gıybet etmişsindir; yoksa iftira etmişsindir' (Müslim, Birr 70).",
      { quote: 'Birbirinizin gizli hallerini araştırmayın, kiminiz kiminizi arkasından çekiştirmesin. Biriniz ölü kardeşinin etini yemekten hoşlanır mı? İşte bundan tiksindiniz!', source: 'Hucurât 12 (meal)' },
      "Kur'an'ın bu benzetmesi sarsıcıdır çünkü gıybetin doğasını çıplak gösterir: Arkasından konuşulan kişi, kendini savunamayan biridir — tıpkı bir ölü gibi. Onun onurundan koparılan her parça, geri konulamayan bir lokmadır.",
      'Gıybetin en zor yanı sinsiliğidir: Çoğu zaman "dertleşme", "durum tespiti", hatta "dua edelim diye anlatıyorum" kılığında gelir. Ölçü şudur: O kişi yanımızda olsaydı bu cümleyi bu tonda kurar mıydık? Kurmayacaksak, kalbimiz cevabı zaten vermiştir.',
      "Korunmanın yolu iki yönlüdür. Kendi dilimiz için: Konu bir kişinin aleyhine dönmeye başladığında konuyu değiştirmek veya güzel bir yönünü anmak. Başkasının diline karşı: Orada bulunmayan kardeşimizi savunmak. Rivayetlerde, kardeşinin onurunu savunan kimseden Allah'ın da ateşi uzaklaştıracağı bildirilir. Dil küçük bir organdır; ama terazide en ağır gelenler, çoğu zaman onunla kazanılır ya da kaybedilir.",
    ],
  },
  {
    id: 'tevazu', shelf: 'ahlak', emoji: '🌾', grad: ['#1F2937', '#374151'],
    title: 'Tevazu: Başak Doldukça Eğilir',
    excerpt: 'Alçakgönüllülük kendini küçültmek değildir — kendini doğru yere koymaktır.',
    refs: ['Müslim, Birr 69', 'Lokmân 18-19', 'Furkân 63'],
    paragraphs: [
      "Peygamberimiz (s.a.v.), Allah için alçakgönüllü davranan kimseyi Allah'ın yükselteceğini bildirmiştir (Müslim, Birr 69). Bu, dünyanın işleyişine ters gibi görünen ilahi bir denklemdir: İnsanlar zirveye çıkmak için birbirini iterken, İslam'ın önerdiği yükseliş eğilmekten geçer — tıpkı dolu başağın eğilmesi gibi.",
      { quote: "Küçümseyerek insanlardan yüz çevirme ve yeryüzünde böbürlenerek yürüme. Zira Allah, kendini beğenip övünen hiç kimseyi sevmez. Yürüyüşünde tabii ol, sesini alçalt.", source: 'Lokmân 18-19 (meal)' },
      "Hz. Lokman'ın oğluna öğütleri, tevazunun günlük hayattaki halini çizer: Yüz ifadesi, yürüyüş, ses tonu. Kibir çoğu zaman büyük laflarda değil, küçük jestlerde saklanır — bir dudak bükmede, bir 'ben zaten biliyordum'da.",
      "Furkân Suresi 'Rahmân'ın kulları'nı tarif ederken ilk özelliği yürüyüşe bağlar: Yeryüzünde vakarla, alçakgönüllülükle yürürler; cahiller kendilerine sataştığında 'selâm' der geçerler (Furkân 63). Tevazu pasiflik değildir; gereksiz kavgaya tenezzül etmeyecek kadar dolu olmaktır.",
      "Tevazuyu yanlış anlamamak gerekir: Kendini değersiz görmek değil, değerin kaynağını doğru bilmektir. İlim, mal, güzellik — hepsi emanettir. Emanetle övünen, kendisine ait olmayanla poz vermiş olur. Peygamberimiz insanların en hayırlısıyken ayakkabısını tamir eder, evinin işine yardım eder, çocuklara selam verirdi. Zirvedeki bu eğiliş, tevazunun tanımıdır.",
    ],
  },
  // ─────────── İBADET HAYATIMIZ ───────────
  {
    id: 'namaz', shelf: 'ibadet', emoji: '🕌', grad: ['#0A2E4E', '#0E4E6E'],
    title: 'Namaz: Günde Beş Buluşma',
    excerpt: 'Namaz bir borç ödemesi mi, yoksa günde beş kez yenilenen bir davet mi?',
    refs: ['Ankebût 45', 'Tâhâ 14', 'Buhârî, Mevâkît 6'],
    paragraphs: [
      "Namazı yalnızca bir görev listesi maddesi olarak görenler, onun en büyük hediyesini kaçırır. Miraç gecesinde farz kılınan namaz, kelime anlamıyla da 'dua, yöneliş' demektir: Günde beş kez, hayatın koşuşturması ne olursa olsun, Rabbimizle baş başa kalmak için ayrılmış korunaklı zaman dilimleri.",
      { quote: 'Şüphesiz namaz, hayâsızlıktan ve kötülükten alıkoyar.', source: 'Ankebût 45 (meal)' },
      "Bu ayet namazın dönüştürücü gücünü anlatır. Günde beş kez 'Allah'ın huzurunda duracağım' bilinciyle yaşayan insanın gün içindeki seçimleri değişir: Öğle namazına abdestli girecek bir dil, sabahtan yalana bulaşmak istemez. Namaz, günün içine yerleştirilmiş beş ayar noktasıdır; pusula her sapmada yeniden kıbleye döner.",
      "Peygamberimiz (s.a.v.) namazı, kapısının önünden akan bir nehre benzetmiştir: Günde beş kez o nehirde yıkanan kimsede kir kalır mı? (Buhârî, Mevâkît 6). Benzetme yalnızca günahların dökülmesini değil, tazelenmeyi de anlatır — namaz yorgunluğun değil, dinlenmenin adıdır. Nitekim Efendimiz 'Beni namaz serinletir, gözümün nuru namazdadır' anlamında sözler söylemiştir.",
      "Huşuyu yakalamak için küçük adımlar: Namaza girmeden bir nefeslik dur; kimin huzuruna çıktığını hatırla. Okuduğun surelerin mealine bir kez göz at; ne dediğini bilen dil, kalbi de uyandırır. Ve acele etme — secde, kulun Rabbine en yakın olduğu andır; oradan çabuk kalkılmaz.",
    ],
  },
  {
    id: 'dua', shelf: 'ibadet', emoji: '🤲', grad: ['#3B1D4E', '#5B21B6'],
    title: 'Dua: Kulluğun Özü',
    excerpt: 'İstemek zayıflık mıdır? Duada güç ile acziyetin buluştuğu sır.',
    refs: ['Mü\'min 60', 'Bakara 186', 'Tirmizî, Deavât 1'],
    paragraphs: [
      "Peygamberimiz (s.a.v.) duayı 'ibadetin özü' olarak nitelemiştir (Tirmizî, Deavât 1). Çünkü dua, kulluğun en saf halidir: İnsan dua ederken hiçbir aracıya, hiçbir randevuya, hiçbir özel mekâna muhtaç değildir. İki elini kaldıran herkes, o an kâinatın Rabbiyle konuşuyordur.",
      { quote: 'Kullarım sana beni sorduğunda bilsinler ki ben çok yakınım. Bana dua ettiğinde dua edenin çağrısına karşılık veririm.', source: 'Bakara 186 (meal)' },
      "Bu ayetin inceliği çoğu zaman gözden kaçar: Kur'an'da başka sorulara 'De ki...' diye cevap verilirken, burada araya elçi bile konmaz — 'Ben çok yakınım' buyrulur. Dua eden ile Rabbi arasında perde yoktur.",
      "'Dua ediyorum ama olmuyor' diyenlere Efendimizin öğrettiği ufuk şudur: Hiçbir samimi dua boşa gitmez. Ya istenen verilir, ya bir kötülük savılır, ya da ahirete azık yapılır. Duanın kabulü bazen 'evet', bazen 'daha hayırlısı', bazen 'henüz değil'dir. Mü'min Suresi'ndeki çağrı ise kesindir: 'Bana dua edin, size karşılık vereyim' (Mü'min 60).",
      "Duanın adabı onu derinleştirir: Hamd ve salavatla başlamak, hem dünya hem ahiret için istemek, yalnız darda değil bollukta da el açmak. Ve en önemlisi: Dua ettiğin şey için üzerine düşeni yapmak. Çünkü dua, tembelliğin değil, gayretin duasıdır — çiftçi önce tohumu eker, sonra yağmuru ister.",
    ],
  },
  {
    id: 'oruc', shelf: 'ibadet', emoji: '🌙', grad: ['#1E293B', '#334155'],
    title: 'Oruç: Sadece Aç Kalmak mı?',
    excerpt: 'Mideye tutturulan orucu dile, göze ve kalbe de tutturabilmek.',
    refs: ['Bakara 183', 'Buhârî, Savm 8'],
    paragraphs: [
      "Oruç dendiğinde akla ilk gelen açlıktır; oysa Kur'an orucun hedefini bambaşka bir kelimeyle koyar: takva. 'Ey iman edenler! Oruç, sizden öncekilere farz kılındığı gibi size de farz kılındı; umulur ki takvaya erersiniz' (Bakara 183). Açlık araçtır; hedef, Allah bilinciyle yaşayan bir kalptir.",
      { quote: 'Kim yalan sözü ve onunla ameli bırakmazsa, Allah\'ın onun yemesini içmesini bırakmasına ihtiyacı yoktur.', source: 'Buhârî, Savm 8' },
      "Bu hadis orucun sınırlarını mideden bütün organlara genişletir. Dil yalandan, gıybetten oruçlu değilse; göz haramdan, el haksızlıktan kaçınmıyorsa — mide boş kalsa da orucun ruhu doymamıştır. Sahabe neslinin oruçta gösterdiği titizlik tam da buydu: Onlar açlığı değil, günahtan uzak kalmayı ibadet sayarlardı.",
      "Orucun öğrettiği ilk ders empatidir: Tok insan, açlığı ancak kitaptan bilir; oruçlu ise yaşayarak öğrenir. İkinci ders özgürlüktür: 'Canım istedi' cümlesinin esiri olmadığını, isteklerine 'hayır' diyebildiğini insan oruçta keşfeder. Üçüncüsü şükürdür: İftar sofrasındaki bir bardak suyun değeri, ancak akşama kadar susayan tarafından tam bilinir.",
      "Ramazan dışında da bu okulu açık tutmak mümkündür: Pazartesi-perşembe oruçları, eyyam-ı biyz (kamerî ayların 13-14-15'i) rivayetlerde teşvik edilmiştir. Ama belki en kalıcısı şudur: Oruç bitince de dilin orucunu bozmamak.",
    ],
  },
  // ─────────── SİYER'DEN SAHNELER ───────────
  {
    id: 'elemin', shelf: 'siyer', emoji: '🤝', grad: ['#4E3B0A', '#78530F'],
    title: "el-Emîn: Güvenin İnşası",
    excerpt: 'Peygamberlikten önce kazanılan unvan: Mekke\'nin en güvenilir insanı.',
    refs: ['İbn Hişâm, es-Sîre', 'Ahzâb 21'],
    paragraphs: [
      "Peygamberimize vahiy geldiğinde Mekkeliler ona yabancı değildi: Kırk yıldır aralarında yaşayan, ticaretini bildikleri, emanetlerini teslim ettikleri adamdı o. Öyle ki şehir ona kendi adından çok 'el-Emîn' — güvenilir — diye sesleniyordu. Bu unvan bir gecede kazanılmaz; kırk yıllık tutarlılığın mührüdür.",
      "Gençliğinde Kâbe tamir edilirken kabileler, Hacerü'l-Esved'i yerine koyma şerefi için neredeyse savaşacaktı. Çözüm için 'kapıdan ilk girene' hakem olması kararlaştırıldı — ve kapıdan Muhammedü'l-Emîn girince herkes rahatladı. Çözümü de unvanına yakışır oldu: Taşı bir örtüye koydu, her kabile reisine bir ucundan tutturdu, şerefi herkese paylaştırdı. Güvenilirlik, zekâyla birleşince kavgayı barışa çevirdi.",
      { quote: 'Andolsun, Allah\'ın Resûlünde sizin için güzel bir örnek vardır.', source: 'Ahzâb 21 (meal)' },
      "Hicret gecesi bu güvenin en çarpıcı fotoğrafı çekildi: Canına kastedilen Peygamber, şehirden ayrılırken bile yastığının altında Mekkelilerin emanetlerini saklıyordu — ona düşmanlık edenler dahi kıymetli eşyalarını hâlâ ona teslim ediyordu. Hz. Ali'yi geride bırakmasının bir sebebi de o emanetleri sahiplerine ulaştırmaktı. Düşmanının bile parasını emanet ettiği insan: İşte 'el-Emîn'in tanımı.",
      "Bugünkü ders açıktır: Tebliğin ilk cümlesi sözle değil, karakterle kurulur. İnsanlar ne dediğimizden önce, ne olduğumuza bakar. Sözünde durmak, işini sağlam yapmak, emanete titizlenmek — bunlar 'küçük' erdemler değil, kırk yıllık bir davetin ta kendisidir.",
    ],
  },
  {
    id: 'muahat', shelf: 'siyer', emoji: '🏠', grad: ['#0E3B2E', '#166534'],
    title: 'Kardeşlik Sözleşmesi: Muâhât',
    excerpt: 'Evini, işini, her şeyini geride bırakan muhacire Medineli ne dedi?',
    refs: ['Haşr 9', 'Buhârî, Menâkıbü\'l-Ensâr'],
    paragraphs: [
      "Hicret, bir göç hikayesinden fazlasıdır: Mekkeli Müslümanlar mallarını, evlerini, bağlarını geride bırakıp Medine'ye sığındılar. Peygamberimizin çözümü tarihte eşine az rastlanır türdendi: Her muhaciri bir Medineli (ensar) ile kardeş ilan etti. Kâğıt üzerinde değil — sofrada, işte, mirasta kardeşlik.",
      { quote: 'Onlardan önce o yurda yerleşen ve imana sarılanlar, kendilerine hicret edenleri severler. Kendileri ihtiyaç içinde olsalar bile onları öz canlarına tercih ederler.', source: 'Haşr 9 (meal)' },
      "Ensarın cömertliği rivayetlerde nefes kesen sahnelerle anlatılır: Kimisi malını ikiye bölüp 'yarısı senin' dedi; kimisi hurmalığını paylaşmayı teklif etti. Muhacirlerin cevabı da en az o kadar asildir: 'Malın bereketlensin, sen bana çarşının yolunu göster' diyen Abdurrahman bin Avf, ticaretle kendi ayakları üzerinde durmayı seçti. Bir taraf vermeyi, diğer taraf el açmamayı yarıştırdı.",
      "Muâhât, sosyal politikanın ötesinde bir kalp devrimiydi: Kabile asabiyetiyle yüzyıllarca savaşmış insanlar, 'iman kardeşliği' diye yeni bir akrabalık türü tanıdı. Evs ile Hazrec'in, Mekkeli ile Medinelinin, azatlı köle Bilal ile soylu tüccarın aynı safta eşitlendiği bir toplum doğdu.",
      "Bugün muâhâtı yeniden kurmak bizim elimizde: Şehrine yeni taşınana, işe yeni başlayana, aramıza yeni katılana 'kardeşim' diyebilmek. Yardımı 'sadaka verir gibi' değil, 'hakkını teslim eder gibi' yapmak. Ensar olmak için Medineli olmak gerekmiyor — kapımızı çalan bir muhacir her zaman var.",
    ],
  },
  {
    id: 'veda', shelf: 'siyer', emoji: '📜', grad: ['#4E1D0A', '#7C2D12'],
    title: "Veda Hutbesi: Evrensel Bildirge",
    excerpt: 'Yüz binin üzerinde insana okunan ve kıyamete kadar geçerli olan konuşma.',
    refs: ['Müslim, Hac 147', 'Mâide 3', 'Hucurât 13'],
    paragraphs: [
      "Hicretin onuncu yılı, Arafat. Peygamberimiz (s.a.v.) hayatının tek haccında, yüz binin üzerinde sahabiye seslendi. Konuşmasına 'Belki bu yıldan sonra sizinle burada bir daha buluşamam' diye başladı — ve bu 'veda', sözlerini bir vasiyet ağırlığına yükseltti.",
      { quote: 'Ey insanlar! Canlarınız, mallarınız, namuslarınız; bu gününüz, bu ayınız, bu beldeniz nasıl dokunulmazsa öyle dokunulmazdır.', source: 'Veda Hutbesi (Müslim, Hac 147)' },
      "Hutbenin ilkeleri, çağının çok ötesindeydi: Kan davaları kaldırıldı — 'Cahiliyeden kalma bütün kan davaları ayaklarımın altındadır.' Faiz kaldırıldı — ilk kaldırılan da Efendimizin kendi amcasının alacağıydı; ilke, en yakından başladı. Kadın hakları vurgulandı: 'Kadınlar hususunda Allah'tan korkun; sizin onlar üzerinde, onların da sizin üzerinizde hakları vardır.'",
      "Ve o cümle — insanlık eşitliğinin belki en erken, en net ilanı: 'Arap'ın Arap olmayana, Arap olmayanın Arap'a; beyazın siyaha, siyahın beyaza üstünlüğü yoktur. Üstünlük ancak takvadadır.' Hucurât 13'ün ete kemiğe bürünmüş hali: İnsanlık tek bir anne-babadan; tanışsınlar diye kavimlere ayrılmış.",
      "Hutbenin sonunda gökten mühür geldi: 'Bugün dininizi kemale erdirdim' (Mâide 3). Efendimiz kalabalığa sordu: 'Tebliğ ettim mi?' 'Evet!' sesleri Arafat'ı doldurunca üç kez tekrarladı: 'Şahit ol ya Rab!' Seksen küsur gün sonra vefat etti. Veda Hutbesi bu yüzden yalnız bir konuşma değil, mühürlenmiş bir emanettir — okuyana 'şahitlik sırası sende' diyen.",
    ],
  },
  // ─────────── KALP VE MANEVİYAT ───────────
  {
    id: 'tevekkul', shelf: 'kalp', emoji: '🐪', grad: ['#3B2A16', '#92600D'],
    title: 'Tevekkül: Deveni Bağla, Sonra Güven',
    excerpt: 'Tedbir ile teslimiyet arasındaki ince dengenin adı.',
    refs: ['Tirmizî, Kıyâmet 60', 'Talâk 3', 'Âl-i İmrân 159'],
    paragraphs: [
      "Bir adam Peygamberimize sordu: 'Devemi bağlayıp mı tevekkül edeyim, yoksa salıverip mi?' Cevap, tevekkülün asırlık tanımı oldu: 'Önce bağla, sonra tevekkül et' (Tirmizî, Kıyâmet 60). Tevekkül, tedbirin alternatifi değil; tedbirin bittiği yerde başlayan iç huzurudur.",
      { quote: 'Kim Allah\'a tevekkül ederse, O ona yeter.', source: 'Talâk 3 (meal)' },
      "Yanlış tevekkül iki uçta yaşanır. Birincisi tembelliğin kılıfı olur: Çalışmadan 'Allah verir' demek, deveyi salıvermektir. İkincisi ise kaygının esareti: Her tedbiri alıp yine de uyuyamamak, sonucu da kendi omuzlarında taşımaya çalışmaktır. Gerçek tevekkül ikisinin ortasında durur — elinden geleni yap, sonucu Sahibine bırak.",
      "Âl-i İmrân 159, sıralamayı netleştirir: 'İş konusunda onlarla istişare et; karar verdiğinde ise artık Allah'a tevekkül et.' Önce danışma, düşünme, planlama; sonra kararlılık; en sonunda teslimiyet. Peygamberimizin hayatı bu dengenin sergisidir: Uhud'a zırhını giyerek çıktı, hicrette mağarada iz kaybettirdi, Hendek'te şehri hendekle korudu — ve her adımda kalbi Rabbine yaslıydı.",
      "Tevekkülün meyvesi psikolojiktir de: 'Elimden geleni yaptım' diyebilen insan, sonuç ne olursa olsun pişmanlıkla kavrulmaz; 'demek ki hakkımda hayırlısı buymuş' diyebilir. Kaygı çağında tevekkül, müminin sığınağıdır: Kuş gibi — sabah aç çıkar, akşam tok döner; ama uçmayı hiç bırakmaz.",
    ],
  },
  {
    id: 'sukur', shelf: 'kalp', emoji: '🌸', grad: ['#4E0A2E', '#9D174D'],
    title: 'Şükür: Nimeti Çoğaltan Anahtar',
    excerpt: '"Elhamdülillah" demek ile şükreden bir hayat yaşamak arasındaki fark.',
    refs: ['İbrâhim 7', 'Sebe 13', 'Müslim, Zikir 73'],
    paragraphs: [
      "Kur'an'da Allah bir vaadini yemin kuvvetinde bildirir: 'Andolsun, şükrederseniz elbette size (nimetimi) artırırım' (İbrâhim 7). Şükür-nimet ilişkisi tek yönlü değildir: Nimet şükrü doğurur, şükür nimeti çoğaltır. Nankörlük ise musluğu kendi eliyle kısmaktır.",
      { quote: 'Ey Dâvûd ailesi! Şükür için çalışın. Kullarımdan gereğince şükreden azdır.', source: 'Sebe 13 (meal)' },
      "Bu ayetteki incelik fiildedir: 'Şükredin' değil, 'şükür için çalışın' buyrulur. Demek ki şükür yalnız bir söz değil, bir ameldir. Âlimler şükrü üç katmanda anlatır: Dilin şükrü — nimeti vereni anmak; kalbin şükrü — nimetin O'ndan geldiğini bilmek; bedenin şükrü — nimeti verenin razı olacağı yerde kullanmak. Gözün şükrü haramdan sakınmak, malın şükrü paylaşmak, ilmin şükrü öğretmektir.",
      "Peygamberimiz (s.a.v.) şükür konusunda bakış açımızı da eğitir: 'Sizden aşağıda olana bakın, üstünüzde olana değil; bu, Allah'ın nimetini küçük görmemeniz için daha uygundur' (Müslim, Zikir 73). Sosyal medya çağında bu hadis adeta reçetedir: Hep 'daha fazlasına' bakan göz, elindekini göremez olur.",
      "Şükrü hayata geçirmenin basit bir alıştırması: Her gece üç nimet say — ama hep aynılarını değil; bugüne özgü, küçük, gözden kaçmış üç şey bul. Bir bardak soğuk su, ağrımayan bir diş, vaktinde gelen bir dost mesajı. Nimet avcılığına çıkan kalp, bir süre sonra her yerde nimet görmeye başlar. İşte o kalp, zengindir.",
    ],
  },
  {
    id: 'tefekkur', shelf: 'kalp', emoji: '🌌', grad: ['#0A1F4E', '#1E3A8A'],
    title: 'Tefekkür: Kâinat Kitabını Okumak',
    excerpt: 'Gökyüzüne bakmak ile gökyüzünü görmek arasındaki fark: bir saatlik derin düşünce.',
    refs: ['Âl-i İmrân 190-191', 'Ğâşiye 17-20', 'Rûm 8'],
    paragraphs: [
      "Kur'an'ın ilk emri 'Oku' idi — ama ortada henüz yazılı bir kitap yoktu. Çünkü okunacak ilk kitap kâinattı. Ğâşiye Suresi bu okumanın başlıklarını verir: 'Deveye bakmazlar mı, nasıl yaratılmış? Göğe bakmazlar mı, nasıl yükseltilmiş? Dağlara bakmazlar mı, nasıl dikilmiş?' (Ğâşiye 17-19). Bakmak herkesin işi; görmek, tefekkür edenin.",
      { quote: 'Göklerin ve yerin yaratılışında, gece ile gündüzün birbiri ardınca gelişinde akıl sahipleri için deliller vardır. Onlar ayakta, otururken ve yanları üzerine yatarken Allah\'ı anarlar; göklerin ve yerin yaratılışını düşünürler.', source: 'Âl-i İmrân 190-191 (meal)' },
      "Bu ayetler indiğinde Peygamberimizin ağladığı ve 'Bu ayetleri okuyup da üzerinde düşünmeyene yazıklar olsun' buyurduğu rivayet edilir. Tefekkür, imanın laboratuvarıdır: Ezberden inanmak ile görerek inanmak arasındaki köprü orada kurulur. Selef âlimlerinden nakledilen 'Bir saat tefekkür, (nafile) ibadetten hayırlı olabilir' sözü, bu derinliği anlatır.",
      "Modern hayat tefekkürün doğal düşmanıdır: Her boşluğu dolduran ekranlar, düşüncenin filizlenmesine toprak bırakmaz. Sıkılmak — o eski, verimli sıkılmak — neredeyse imkânsızlaştı. Oysa derin düşünce tam da o boşlukta doğar.",
      "Tefekkür pratiği için mütevazı bir başlangıç: Günde on dakika, telefonsuz. Gökyüzüne bak — bulutun taşıdığı tonlarca suyu düşün. Eline bak — parmak izinin kimsede olmadığını. Nefesine bak — sen uyurken bile devam eden o sadık ritmi. Rûm Suresi'nin çağrısı tam budur: 'Kendi içlerinde hiç düşünmediler mi?' (Rûm 8). Kâinat kitabı her gün yeni baskı yapar; okuyanı bekler.",
    ],
  },
  {
    id: 'sabir', shelf: 'ahlak', emoji: '⏳', grad: ['#1E3A2E', '#0F5132'],
    title: 'Sabır: İlk Darbede Gösterilen Duruş',
    excerpt: 'Sabır beklemek midir, yoksa bekleyişi ibadete çevirmek mi?',
    refs: ['Bakara 153-156', 'Buhârî, Cenâiz 32', 'Zümer 10'],
    paragraphs: [
      "Peygamberimiz (s.a.v.) bir gün kabri başında ağlayan bir kadına sabır tavsiye etti. Kadın onu tanımadan 'Benim derdimi sen bilmezsin' diye çıkıştı; sonra kim olduğunu öğrenince özür dilemeye geldi. Efendimizin cevabı sabrın tanımını koydu: 'Sabır, ancak ilk sarsıntı anında gösterilendir' (Buhârî, Cenâiz 32). Herkes zamanla sakinleşir; fazilet, darbeyi ilk yediğin anda dik durabilmektir.",
      { quote: 'Ey iman edenler! Sabır ve namazla yardım isteyin. Şüphesiz Allah sabredenlerle beraberdir.', source: 'Bakara 153 (meal)' },
      "Âlimler sabrı üç dala ayırır: İbadete devam etmekte sabır — her sabah yeniden kalkabilmek; günahtan uzak durmakta sabır — 'bir kereden bir şey olmaz' fısıltısına direnmek; ve musibete karşı sabır — kaybettiğinde isyan etmemek. Üçü de aynı kökten beslenir: Allah'ın vaadine güven.",
      "Sabır pasiflik değildir; Kur'an'daki sabır kahramanları hep hareket halindedir. Hz. Yakub oğlunu beklerken 'sabr-ı cemîl' (güzel bir sabır) der ama oğullarını Mısır'a araştırmaya gönderir. Hz. Eyyub hastalığına sabreder ama şifa için dua da eder. Sabır, yapılabilecek her şeyi yaptıktan sonra sonucu Allah'a bırakırken yakınmamaktır.",
      "Karşılığı da diğer amellere benzemez: 'Sabredenlere mükâfatları hesapsız ödenir' (Zümer 10). Cennette çoğu nimet ölçüyle verilirken sabrın karşılığı ölçüsüzdür. Çünkü sabır, imtihanın tam kalbinde verilen sınavdır. Bugün başlayacak küçük bir alıştırma: Sıkıntı geldiğinde ilk cümlen şikâyet değil, 'İnnâ lillâh...' olsun — ilk an senin olsun.",
    ],
  },
  {
    id: 'dogruluk', shelf: 'ahlak', emoji: '🧭', grad: ['#0A3B4E', '#155E75'],
    title: 'Doğruluk: Kalbi Rahatlatan Yol',
    excerpt: 'Küçük bir yalanın bedeli ile doğruluğun huzuru arasında.',
    refs: ['Buhârî, Edeb 69', 'Tirmizî, Kıyâmet 60', 'Tevbe 119'],
    paragraphs: [
      "Peygamberimiz (s.a.v.) doğruluğun güzergâhını çizmiştir: Doğruluk iyiliğe, iyilik cennete götürür; kişi doğru söyleye söyleye Allah katında 'sıddîk' diye yazılır. Yalan ise kötülüğe, kötülük ateşe götürür; kişi yalan söyleye söyleye 'kezzâb' diye yazılır (Buhârî, Edeb 69). Tek tek cümlelerimiz, farkında olmadan bir kimlik inşa eder.",
      { quote: 'Ey iman edenler! Allah\'tan korkun ve doğrularla beraber olun.', source: 'Tevbe 119 (meal)' },
      "Doğruluğun günlük hayattaki turnusolü küçük anlardır: 'Yolda geldim' diyen mesaj, 'toplantıdayım' bahanesi, çocuğa 'sonra alırım' deyip unutmak. Peygamberimiz çocuğa 'gel sana bir şey vereceğim' deyip vermeyenin bile yalancı sayılacağını bildirmiştir. İslam'da 'küçük yalan' kategorisi yoktur; küçük görünen, alışkanlığın tohumudur.",
      "Doğruluğun ölçüsünü Efendimiz tek cümleyle vermiştir: 'Şüphelendiğini bırak, şüphelenmediğine geç; çünkü doğruluk gönül rahatlığı, yalan ise kuşkudur' (Tirmizî, Kıyâmet 60). Yalancı sürekli hesap tutmak zorundadır — kime ne dediğini unutmamalıdır. Doğru insanın böyle bir yükü yoktur; hafızası tektir, yüzü tektir.",
      "Ticarette doğruluk ayrı bir makam taşır: 'Doğru ve güvenilir tüccar, nebiler, sıddıklar ve şehitlerle beraberdir' rivayet edilir. Malının kusurunu söyleyen esnaf o gün belki bir satış kaybeder; ama kazandığı şey terazide çok daha ağırdır: bereket ve itibar. Doğruluk kısa vadede pahalı, ömür boyunca en kârlı yatırımdır.",
    ],
  },
  {
    id: 'sadaka', shelf: 'ibadet', emoji: '🌱', grad: ['#2E4E0A', '#3F6212'],
    title: 'Sadaka: Malı Çoğaltan Sır',
    excerpt: 'Vermek matematiğe aykırı görünür — ta ki bereketi tanıyana kadar.',
    refs: ['Bakara 261', 'Müslim, Birr 69', 'Buhârî, Ezân 36'],
    paragraphs: [
      "Kur'an, infakı bir tohum benzetmesiyle anlatır: Allah yolunda harcayanların örneği, yedi başak bitiren ve her başağında yüz tane bulunan bir tohum gibidir (Bakara 261). Matematik 'verirsen azalır' der; vahiy 'verirsen çoğalır' der. Peygamberimiz de bunu teyit eder: 'Sadaka maldan hiçbir şey eksiltmez' (Müslim, Birr 69).",
      { quote: 'Sevdiğiniz şeylerden infak etmedikçe iyiliğe asla eremezsiniz.', source: 'Âl-i İmrân 92 (meal)' },
      "Sadakanın makbul hali gizliliktir: Kıyamet gününde Arş'ın gölgesinde barınacak yedi sınıf insandan biri, 'sağ elinin verdiğini sol eli bilmeyecek kadar gizli sadaka veren'dir (Buhârî, Ezân 36). Gizlilik, ameli gösterişten korur ve alan kişinin onurunu gözetir — veren el, alanın yüzünü kızartmamalıdır.",
      "İslam sadakayı yalnız zenginlerin işi olmaktan da çıkarır: 'Kardeşine tebessümün sadakadır' buyrulur; yoldan eziyet veren şeyi kaldırmak, güzel söz, hatta kendi ailene yedirdiğin lokma bile sadaka sayılmıştır. Sadaka bir para transferi değil, bir hayat tarzıdır: 'Benden ne gider?' değil, 'benden ne geçer?' diye soran bir göz.",
      "Ve süreklilik: Efendimiz amellerin Allah'a en sevimlisinin 'az da olsa devamlı olanı' olduğunu bildirmiştir. Ayda bir büyük bağıştan çok, her gün akan küçük bir çeşme ol. Sadaka-i cariye — okuttuğun bir çocuk, diktiğin bir ağaç, paylaştığın faydalı bir bilgi — sen dünyadan göçtükten sonra bile defterine yazmaya devam eder.",
    ],
  },
  {
    id: 'zikir', shelf: 'ibadet', emoji: '📿', grad: ['#3B0A4E', '#6B21A8'],
    title: 'Zikir: Kalbin Nefes Alması',
    excerpt: 'Kalpler ancak O\'nu anmakla huzur bulur — peki anmak nasıl olur?',
    refs: ["Ra'd 28", 'Buhârî, Deavât 65', 'Ahzâb 41'],
    paragraphs: [
      "Modern insan huzuru dışarıda arar: tatilde, alışverişte, ekranda. Kur'an adresi içeride gösterir: 'Bilesiniz ki kalpler ancak Allah'ı anmakla huzur bulur' (Ra'd 28). Zikir, kalbin nefes almasıdır — bedene oksijen neyse, kalbe Allah'ın anılması odur.",
      { quote: 'Ey iman edenler! Allah\'ı çokça zikredin ve O\'nu sabah akşam tesbih edin.', source: 'Ahzâb 41-42 (meal)' },
      "Peygamberimiz (s.a.v.) zikri herkesin taşıyabileceği hafiflikte formüllere dökmüştür. En meşhuru şudur: 'İki kelime vardır ki dile hafif, terazide ağır, Rahmân'a sevimlidir: Sübhânallâhi ve bi-hamdihî, sübhânallâhi'l-azîm' (Buhârî, Deavât 65). On saniyelik bir cümle — terazide dağ gibi.",
      "Zikir yalnız dilin işi değildir. Âlimler üç katmanını anlatır: Dilin zikri — tesbih, tehlil, istiğfar; kalbin zikri — her nimette Vereni hatırlamak; bedenin zikri — organları O'nun razı olduğu işlerde kullanmak. Trafikte beklerken çekilen tesbih dilin zikridir; o trafikte kimseye haksızlık etmemek, bedenin zikridir.",
      "Pratik bir başlangıç için 'bağlantı anları' yöntemi: Zikri günün mevcut alışkanlıklarına iliştir. Arabaya binince üç istiğfar, çayı beklerken on salavat, yatağa uzanınca otuz üç tesbih. Namazlardan sonraki tesbihat zaten hazır bir ritimdir. Gün böyle örülünce, Ahzâb 41'deki 'çokça zikir' bir yük değil, hayatın fon müziği olur.",
    ],
  },
  {
    id: 'hira', shelf: 'siyer', emoji: '⛰️', grad: ['#4E2E0A', '#854D0E'],
    title: "Hira'dan Yükselen Güneş",
    excerpt: 'İnsanlık tarihinin dönüm gecesi: "Oku!" emrinin indiği an.',
    refs: ["Buhârî, Bed'ü'l-Vahy 3", 'Alak 1-5'],
    paragraphs: [
      "Ramazan ayının bir gecesi, Nur Dağı'ndaki küçük mağara. Kırk yaşındaki Muhammed (s.a.v.), yıllardır yaptığı gibi şehrin gürültüsünden uzakta tefekkürdeydi. O gece Cebrail geldi ve tek kelimelik bir emirle insanlık tarihini ikiye böldü: 'Oku!'",
      { quote: 'Yaratan Rabbinin adıyla oku! O, insanı bir alaktan yarattı. Oku! Rabbin en büyük kerem sahibidir; O, kalemle öğretendir.', source: 'Alak 1-4 (meal)' },
      "'Ben okuma bilmem' cevabına rağmen emir üç kez tekrarlandı — sanki şu mesaj veriliyordu: Bu okuma, harflerin değil hakikatin okumasıdır ve onu Öğreten bizzat Rabbindir. Dikkat çekicidir: Vahyin ilk kelimesi 'inan', 'savaş' ya da 'yönet' değil, 'oku'dur; ilk tanıtılan alet de kalemdir. İlim, bu dinin doğum belgesine yazılmıştır.",
      "Dağdan titreyerek inen Efendimiz, eşine sığındı: 'Beni örtün!' Hz. Hatice'nin cevabı, insan tanımanın şaheseridir: 'Asla! Allah seni hiçbir zaman utandırmaz. Çünkü sen akrabayı gözetir, doğru söyler, âcizin yükünü taşır, misafiri ağırlar, hak yolunda olanlara yardım edersin' (Buhârî, Bed'ü'l-Vahy 3). Hatice, peygamberliği mucizelerden değil, kırk yıllık karakterden okudu.",
      "Hira'nın bugüne fısıldadıkları: Büyük çağrılar gürültüde değil, sessizlikte duyulur — kendine tefekkür mağaraları aç. Ve etrafındakilere Hatice ol: Sarsıldıkları gün onlara erdemlerini hatırlat. Bazen bir insanı ayakta tutan şey, ona kim olduğunu söyleyen tek bir sestir.",
    ],
  },
  {
    id: 'taif', shelf: 'siyer', emoji: '🕊️', grad: ['#4E0A0A', '#7F1D1D'],
    title: 'Taif: En Zor Günün Merhameti',
    excerpt: 'Taşlanan bir peygamberin, taşlayanlar için ettiği dua.',
    refs: ["Buhârî, Bed'ü'l-Halk 7", 'Enbiyâ 107'],
    paragraphs: [
      "Peygamberlik yıllarının en ağır dönemiydi: Koruyucusu amcası Ebu Talib ile en büyük destekçisi Hz. Hatice aynı yıl vefat etmiş — hüzün yılı —, Mekke'nin baskısı dayanılmaz olmuştu. Efendimiz umutla Taif'e yürüdü; belki bu şehir dinlerdi. Dinlemediler. Şehrin ayak takımını kışkırtıp onu taşlattılar; mübarek ayakları kanlar içinde şehirden çıktı.",
      "Bir bağın gölgesine sığındığında dudaklarından dökülen dua, yenilginin değil teslimiyetin duasıydı: 'Allah'ım! Gücümün zayıflığını, çaremin azlığını, insanların gözünde küçük düşüşümü sana şikâyet ediyorum... Senin gazabına uğramadıktan sonra çektiklerime aldırmam.' Sitem bile Allah'a yapılıyordu — insanlara değil.",
      { quote: 'Biz seni ancak âlemlere rahmet olarak gönderdik.', source: 'Enbiyâ 107 (meal)' },
      "Sonra o an geldi: Cebrail, yanında dağların meleğiyle göründü. Teklif netti: 'İstersen şu iki dağı onların üzerine kapatayım.' Kan revan içindeki Peygamberin cevabı, 'âlemlere rahmet'in tanımı oldu: 'Hayır! Umarım ki Allah onların soyundan yalnız O'na kulluk eden nesiller çıkarır' (Buhârî, Bed'ü'l-Halk 7). Yıllar sonra Taif Müslüman oldu — o dua tuttu.",
      "Taif'in dersi zor ama nettir: Sana kapanan kapıya beddua etme; o kapının ardındaki gelecek nesli düşün. En haklı olduğun anda gösterdiğin merhamet, senin en güçlü anındır. Ve unutma: Bugün seni taşlayan, yarın safında olabilir — Taifli çocukların torunları gibi.",
    ],
  },
  {
    id: 'ihlas', shelf: 'kalp', emoji: '💎', grad: ['#0A2E4E', '#1E40AF'],
    title: 'İhlas: Amelin Görünmez Ruhu',
    excerpt: 'Aynı ameli iki insan yapar; biri yükselir, biri boşa düşer. Fark nerede?',
    refs: ['Buhârî, Bed\'ü\'l-Vahy 1', 'Kehf 110', 'Beyyine 5'],
    paragraphs: [
      "Buhârî, dev eserine bilinçli bir tercihle şu hadisle başlar: 'Ameller ancak niyetlere göredir; herkese niyet ettiği vardır' (Buhârî 1). İki insan aynı camide, aynı safta, aynı namazı kılar — biri Allah için, biri görülmek için. Dışarıdan fotoğrafları aynıdır; terazide ağırlıkları dünyalar kadar farklı.",
      { quote: 'Artık kim Rabbine kavuşmayı umuyorsa salih amel işlesin ve Rabbine ibadette hiç kimseyi ortak koşmasın.', source: 'Kehf 110 (meal)' },
      "İhlasın düşmanı riyadır — ameli insanlara sunma arzusu. Peygamberimiz onu 'gizli şirk' diye adlandırmıştır; çünkü riyakâr, amelin karşılığını Allah'tan değil kullardan bekler. Sosyal medya çağı bu imtihanı katladı: Her iyilik paylaşılabilir hale gelince, 'kim için yaptım?' sorusu her gün yeniden sorulmalı oldu. Paylaşmak her zaman riya değildir — teşvik niyeti de olabilir; ölçü, beğeni gelmeyince kalbin verdiği tepkidir.",
      "İhlası korumanın yolları: Gizli bir ibadet bölmesi tut — kimsenin bilmediği bir nafile, bir sadaka, bir dua; o bölme, kalbin Allah'la özel hattıdır. Ameline değil, Kabul Edene güven: 'Amelim büyük' diyen kibre, 'amelim var' diyen rehavete düşer. Ve niyeti gün içinde tazele — niyet bir kez kurulan saat değil, sürekli ayarlanan pusuladır.",
      "Beyyine Suresi hedefi özetler: 'Onlar ancak dini yalnız O'na halis kılarak Allah'a kulluk etmekle emrolundular' (Beyyine 5). Az ama halis, çok ama gösterişliden hayırlıdır. Çünkü Allah çokluk değil, halislik arar.",
    ],
  },
  {
    id: 'umit', shelf: 'kalp', emoji: '🌅', grad: ['#4E3B0A', '#B45309'],
    title: 'Rahmetten Ümit Kesmemek',
    excerpt: '"Benim günahım affedilmez" diyen herkese inen ayet.',
    refs: ['Zümer 53', 'Müslim, Tevbe 21', 'Buhârî, Deavât 4'],
    paragraphs: [
      "Kur'an'ın en çok ümit yüklü ayeti, günahta sınır tanımış insanlara seslenir: 'De ki: Ey kendi aleyhlerine haddi aşan kullarım! Allah'ın rahmetinden ümit kesmeyin. Şüphesiz Allah bütün günahları bağışlar' (Zümer 53). Ayetteki hitap inceliğine dikkat: Haddi aşanlara bile 'kullarım' denilir — kapı, en uzaktakine bile açıktır.",
      { quote: 'Allah\'ın yüz rahmeti vardır; bunlardan yalnız birini yeryüzüne indirmiştir — mahlukat birbirine onunla merhamet eder. Doksan dokuzunu ise kıyamet günü kullarına merhamet etmek için yanında tutmuştur.', source: 'Müslim, Tevbe 21' },
      "Bu hadis, merhamet hakkındaki bütün hesaplarımızı altüst eder: Bir annenin evladına şefkati, bütün insanlığın birbirine iyiliği — hepsi o tek rahmetin kırıntılarıdır. Doksan dokuzu henüz sahnede bile değildir. Ümitsizlik, bu hazineyi bilmemekten doğar.",
      "Tevbenin kapısı da sanıldığından geniştir: Peygamberimiz, Allah'ın, kulunun tevbesine, çölde devesini kaybedip bulan adamın sevincinden daha çok sevindiğini bildirir. Ve her gün istiğfarı olan bir Peygamber örnekliği: Günahsız olduğu halde günde yetmiş (bir rivayette yüz) kez istiğfar ederdi (Buhârî, Deavât 4). İstiğfar günahkârın utancı değil, kulun asli nefesidir.",
      "Ümit ile korku, kuşun iki kanadı gibidir: Yalnız korkuyla uçan ümitsizliğe, yalnız ümitle uçan gevşekliğe düşer. Denge şudur: Günaha bakarken adaleti hatırla ki cesaretlenme; tevbeye yönelirken rahmeti hatırla ki yıkılma. Ve bugün hangi noktadaysan, şunu bil: Dönüş yolu, düşülen kuyudan her zaman kısadır.",
    ],
  },
];

export function readingTime(article) {
  const words = article.paragraphs.map(p => (typeof p === 'string' ? p : p.quote)).join(' ').split(/\s+/).length;
  return Math.max(2, Math.round(words / 170));
}

export default ARTICLES;
