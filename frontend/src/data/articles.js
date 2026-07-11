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
];

export function readingTime(article) {
  const words = article.paragraphs.map(p => (typeof p === 'string' ? p : p.quote)).join(' ').split(/\s+/).length;
  return Math.max(2, Math.round(words / 170));
}

export default ARTICLES;
