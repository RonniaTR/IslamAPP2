// frontend/src/data/adventureData.js
// 🌍 İSLAM TARİHİ MACERASI — Mekke'den Veda Hutbesi'ne 12 durak.
// Her durak: sinematik özet + karışık etkileşimler (soru, sıralama).
// Tüm bilgiler yaygın kabul gören siyer kaynaklarına dayanır.
// step türleri: { type:'mc', q, o, a, exp } | { type:'order', title, items }

export const ADVENTURE = [
  {
    id: 'mekke', title: 'Mekke', emoji: '🕋', artifact: '🕋', artifactName: 'Kâbe Nişanı', difficulty: 1,
    summary: "Her şey burada başladı. 571 yılında, Fil Vakası'nın yaşandığı yıl, Mekke'de bir çocuk dünyaya geldi: Muhammed (s.a.v.). Doğmadan babasını kaybetti; dürüstlüğüyle şehrin 'el-Emin'i oldu.",
    steps: [
      { type: 'mc', q: 'Peygamberimiz hangi yıl doğdu?', o: ['571', '610', '622', '632'], a: 0, exp: "571 yılında, Fil Vakası'nın yaşandığı yıl doğdu; bu yüzden 'Fil Yılı' denir." },
      { type: 'mc', q: 'Doğduğu yıl hangi büyük olayla anılır?', o: ['Fil Vakası', 'Hicret', 'Bedir Savaşı', 'Kâbe tamiri'], a: 0, exp: "Ebrehe'nin filli ordusunun Kâbe'ye saldırısı aynı yıl gerçekleşti (Fil Suresi)." },
      { type: 'mc', q: 'Peygamberimizi doğumundan sonra himaye eden dedesi kimdir?', o: ['Abdülmuttalib', 'Ebu Talib', 'Ebu Leheb', 'Haşim'], a: 0, exp: 'Önce dedesi Abdülmuttalib, onun vefatından sonra amcası Ebu Talib himaye etti.' },
      { type: 'mc', q: 'Gençliğinde dürüstlüğü sebebiyle aldığı lakap nedir?', o: ['el-Emin (güvenilir)', 'el-Fatih', 'es-Sıddık', 'el-Faruk'], a: 0, exp: "Mekkeliler ona 'güvenilir' anlamında 'Muhammedü'l-Emin' derdi." },
    ],
  },
  {
    id: 'hira', title: 'Hira Mağarası', emoji: '⛰️', artifact: '🕯️', artifactName: 'Tefekkür Kandili', difficulty: 1,
    summary: "Kırk yaşına yaklaşırken şehrin putperest düzeninden uzaklaşıp Nur Dağı'ndaki Hira Mağarası'na çekilmeye başladı. Orada yalnız kalır, kâinatın Yaratıcısı üzerine tefekkür ederdi.",
    steps: [
      { type: 'mc', q: 'Hira Mağarası hangi dağdadır?', o: ['Nur Dağı', 'Sevr Dağı', 'Uhud Dağı', 'Arafat'], a: 0, exp: "Hira, Mekke yakınındaki Nur Dağı'ndadır." },
      { type: 'mc', q: 'Peygamberimiz Hira\'da ne yapardı?', o: ['Tefekkür ve ibadetle yalnız kalırdı', 'Ticaret yapardı', 'Şiir yazardı', 'Ok atardı'], a: 0, exp: 'Ramazan aylarında inzivaya çekilir, Allah\'ı düşünerek ibadet ederdi.' },
      { type: 'mc', q: 'İlk vahiy geldiğinde kaç yaşındaydı?', o: ['40', '25', '35', '50'], a: 0, exp: 'İlk vahiy 610 yılında, 40 yaşındayken geldi.' },
      { type: 'mc', q: 'Neden şehirden uzaklaşıp mağaraya çekiliyordu?', o: ['Putperest düzenden uzaklaşıp Yaratıcı\'yı düşünmek için', 'Ticaret planlamak için', 'Av için', 'Serinlemek için'], a: 0, exp: 'Mekke\'deki şirk düzeni onu rahatsız ediyor, hakikati arıyordu.' },
    ],
  },
  {
    id: 'vahiy', title: 'İlk Vahiy', emoji: '📖', artifact: '📜', artifactName: 'İlk Ayet Levhası', difficulty: 1,
    summary: "610 yılı, Kadir Gecesi. Cebrail (a.s.) geldi ve 'Oku!' dedi. Alak Suresi'nin ilk beş ayetiyle vahiy başladı. Titreyerek eve dönen Peygamberimizi Hz. Hatice teselli etti: 'Allah seni asla utandırmaz.'",
    steps: [
      { type: 'mc', q: 'İlk vahiyde gelen ilk emir nedir?', o: ["'Oku!' (İkra)", "'Yürü!'", "'Anlat!'", "'Yaz!'"], a: 0, exp: "'Yaratan Rabbinin adıyla oku!' (Alak 1)." },
      { type: 'mc', q: 'Vahyi getiren melek kimdir?', o: ['Cebrail', 'Mikail', 'İsrafil', 'Azrail'], a: 0, exp: 'Vahiy meleği Cebrail (a.s.)\'dir.' },
      { type: 'mc', q: 'İlk inen ayetler hangi surenin başıdır?', o: ['Alak', 'Fatiha', 'Müddessir', 'Yasin'], a: 0, exp: "Alak Suresi'nin ilk 5 ayeti ilk vahiydir." },
      { type: 'mc', q: 'O gece Peygamberimizi ilk teselli eden ve ilk iman eden kimdir?', o: ['Hz. Hatice', 'Hz. Ebubekir', 'Hz. Ali', 'Hz. Ömer'], a: 0, exp: "Eşi Hz. Hatice hem ilk teselli eden hem ilk iman edendir." },
    ],
  },
  {
    id: 'hicret', title: 'Hicret', emoji: '🐪', artifact: '🧭', artifactName: 'Hicret Pusulası', difficulty: 2,
    summary: "Baskılar dayanılmaz olunca 622'de Medine'ye hicret emri geldi. Hz. Ali, Peygamberimizin yatağına yatarak canını ortaya koydu. Hz. Ebubekir ile Sevr Mağarası'nda üç gece gizlendiler. Bu yolculuk, hicri takvimin başlangıcı oldu.",
    steps: [
      { type: 'mc', q: 'Hicret hangi yıl gerçekleşti?', o: ['622', '610', '630', '571'], a: 0, exp: "622'de Mekke'den Medine'ye hicret edildi; hicri takvim buradan başlar." },
      { type: 'mc', q: 'Hicret yolculuğundaki yol arkadaşı kimdir?', o: ['Hz. Ebubekir', 'Hz. Ömer', 'Hz. Osman', 'Hz. Hamza'], a: 0, exp: "'Üzülme, Allah bizimledir' (Tevbe 40) ayeti bu yolculuğu anlatır." },
      { type: 'mc', q: 'Yolculukta hangi mağarada gizlendiler?', o: ['Sevr', 'Hira', 'Kehf', 'Nur'], a: 0, exp: "Üç gece Sevr Mağarası'nda kaldılar; örümcek ağı ve güvercin kıssası meşhurdur." },
      { type: 'mc', q: 'O gece Peygamberimizin yatağına yatarak canını riske atan kimdir?', o: ['Hz. Ali', 'Hz. Ebubekir', 'Hz. Zeyd', 'Hz. Hamza'], a: 0, exp: 'Hz. Ali yatağa yattı; müşrikler sabah onu görünce şaşırdı.' },
    ],
  },
  {
    id: 'medine', title: 'Medine', emoji: '🕌', artifact: '🏮', artifactName: 'Mescid Kandili', difficulty: 2,
    summary: "Yesrib, Peygamberimizin gelişiyle 'Medine' oldu. İlk iş Mescid-i Nebevi'nin inşasıydı. Muhacirlerle Ensar kardeş ilan edildi; şehirdeki topluluklarla Medine Sözleşmesi imzalandı. İslam toplumu doğuyordu.",
    steps: [
      { type: 'mc', q: "Medine'nin hicretten önceki adı nedir?", o: ['Yesrib', 'Taif', 'Hayber', 'Kuba'], a: 0, exp: "Şehir, hicretten sonra 'Medinetü'n-Nebi' (Peygamber Şehri) diye anıldı." },
      { type: 'mc', q: 'Medine\'de yapılan ilk büyük işlerden biri nedir?', o: ["Mescid-i Nebevi'nin inşası", 'Saray yapımı', 'Sur inşası', 'Pazar kurulması'], a: 0, exp: 'Mescid hem ibadet hem eğitim hem yönetim merkezi oldu.' },
      { type: 'mc', q: 'Muhacirler ile Ensar arasında ne ilan edildi?', o: ['Kardeşlik (muâhât)', 'Ticaret ortaklığı', 'Ateşkes', 'Vergi anlaşması'], a: 0, exp: 'Her muhacir bir ensar ile kardeş ilan edildi; mallarını paylaştılar.' },
      { type: 'order', title: 'Hicret sonrası olayları sıraya koy', items: ['Kuba Mescidi\'nin inşası', 'Mescid-i Nebevi\'nin inşası', 'Muhacir-Ensar kardeşliği', 'Bedir Savaşı'] },
    ],
  },
  {
    id: 'bedir', title: 'Bedir', emoji: '⚔️', artifact: '🚩', artifactName: 'Bedir Sancağı', difficulty: 2,
    summary: "624 yılı. Yaklaşık 313 Müslüman, kendilerinden üç kat büyük Mekke ordusuyla Bedir kuyuları başında karşılaştı. Zafer Müslümanlarındı. Kur'an bu günü 'Furkan Günü' — hak ile batılın ayrıldığı gün — diye andı.",
    steps: [
      { type: 'mc', q: 'Bedir Savaşı hangi yıl yapıldı?', o: ['624 (Hicri 2)', '622 (Hicri 1)', '625 (Hicri 3)', '630 (Hicri 8)'], a: 0, exp: 'Bedir, hicretin 2. yılında (miladi 624) yapıldı.' },
      { type: 'mc', q: 'Bedir\'de Müslümanların sayısı yaklaşık kaçtı?', o: ['313', '1000', '100', '3000'], a: 0, exp: 'Yaklaşık 313 Müslüman, ~1000 kişilik orduya karşı zafer kazandı.' },
      { type: 'mc', q: 'Bazı Bedir esirleri hangi şartla serbest bırakıldı?', o: ['On Müslümana okuma-yazma öğretme karşılığı', 'Altın karşılığı olmadan', 'Asla bırakılmadı', 'Savaşa katılma sözüyle'], a: 0, exp: 'Okur-yazar esirler, çocuklara okuma-yazma öğreterek özgürlük kazandı — ilme verilen değerin nişanesi.' },
      { type: 'mc', q: "Kur'an Bedir gününü nasıl anar?", o: ["Furkan Günü (hak ile batılın ayrıldığı gün)", 'Fetih Günü', 'Veda Günü', 'Kadir Gecesi'], a: 0, exp: "'...Furkan günü, iki ordunun karşılaştığı gün...' (Enfal 41)." },
    ],
  },
  {
    id: 'uhud', title: 'Uhud', emoji: '🏹', artifact: '🏹', artifactName: 'Okçu Yayı', difficulty: 2,
    summary: "625'te Mekkeliler Bedir'in intikamı için geldi. Peygamberimiz elli okçuyu Ayneyn Tepesi'ne yerleştirdi: 'Ne olursa olsun yerinizden ayrılmayın!' Zafer yaklaşırken okçuların tepeyi terk etmesi savaşın seyrini değiştirdi. Hz. Hamza şehit oldu. Uhud, itaatin dersiydi.",
    steps: [
      { type: 'mc', q: 'Uhud Savaşı hangi yıl yapıldı?', o: ['625 (Hicri 3)', '624 (Hicri 2)', '627 (Hicri 5)', '630 (Hicri 8)'], a: 0, exp: 'Uhud, hicretin 3. yılında (miladi 625) yapıldı.' },
      { type: 'mc', q: 'Savaşın seyrini değiştiren kritik hata neydi?', o: ['Okçuların tepeyi erken terk etmesi', 'Gece baskını', 'Erzak bitmesi', 'Yanlış yol seçimi'], a: 0, exp: 'Ganimet için tepeyi bırakınca Halid bin Velid komutasındaki süvariler arkadan dolandı.' },
      { type: 'mc', q: "Uhud'da şehit olan, Peygamberimizin amcası kimdir?", o: ['Hz. Hamza', 'Hz. Abbas', 'Ebu Talib', 'Hz. Cafer'], a: 0, exp: "'Şehitlerin efendisi' Hz. Hamza Uhud'da şehit oldu." },
      { type: 'order', title: 'Savaşları kronolojik sıraya koy', items: ['Bedir (624)', 'Uhud (625)', 'Hendek (627)', "Mekke'nin Fethi (630)"] },
    ],
  },
  {
    id: 'hendek', title: 'Hendek', emoji: '🛡️', artifact: '⛏️', artifactName: 'Hendek Küreği', difficulty: 2,
    summary: "627'de müttefik ordular Medine'yi kuşatmaya geldi. Selman-ı Farisi'nin önerisiyle şehrin etrafına hendek kazıldı — Araplar böyle bir savunmayı ilk kez görüyordu. Peygamberimiz de bizzat kazdı. Kuşatma başarısız oldu.",
    steps: [
      { type: 'mc', q: 'Şehri hendekle savunma fikri kimden geldi?', o: ['Selman-ı Farisi', 'Hz. Ömer', 'Hz. Ali', 'Hz. Ebubekir'], a: 0, exp: 'İranlı sahabi Selman-ı Farisi, memleketindeki savunma yöntemini önerdi.' },
      { type: 'mc', q: 'Hendek Savaşı hangi yıl yapıldı?', o: ['627 (Hicri 5)', '625 (Hicri 3)', '624 (Hicri 2)', '628 (Hicri 6)'], a: 0, exp: 'Hendek (Ahzab) Savaşı hicretin 5. yılında yapıldı.' },
      { type: 'mc', q: 'Hendek kazımında Peygamberimizin tavrı ne oldu?', o: ['Bizzat kazdı, taş taşıdı', 'Sadece izledi', 'Şehirden ayrıldı', 'Sadece dua etti'], a: 0, exp: 'Ashabıyla birlikte bizzat çalıştı; açlıktan karnına taş bağladığı rivayet edilir.' },
      { type: 'mc', q: 'Kuşatmanın sonucu ne oldu?', o: ['Düşman sonuç alamadan çekildi', 'Şehir düştü', 'Barış imzalandı', 'On yıl sürdü'], a: 0, exp: 'Fırtına ve umutsuzlukla müttefik ordular dağılıp geri döndü (Ahzab 25).' },
    ],
  },
  {
    id: 'hudeybiye', title: 'Hudeybiye', emoji: '🕊️', artifact: '🖋️', artifactName: 'Barış Mührü', difficulty: 3,
    summary: "628'de umre için yola çıkan Müslümanlar Hudeybiye'de durduruldu. Görünüşte aleyhte maddeler içeren bir barış antlaşması imzalandı. Ama Kur'an onu 'apaçık fetih' diye müjdeledi: barış ortamında İslam hızla yayıldı.",
    steps: [
      { type: 'mc', q: 'Hudeybiye Antlaşması hangi yıl imzalandı?', o: ['628 (Hicri 6)', '624', '630', '632'], a: 0, exp: 'Hicretin 6. yılında Mekkelilerle imzalandı.' },
      { type: 'mc', q: 'Müslümanlar o yıl hangi amaçla yola çıkmıştı?', o: ['Umre (Kâbe ziyareti)', 'Savaş', 'Ticaret', 'Hac'], a: 0, exp: 'Umre niyetiyle ihramlı ve silahsız yola çıkmışlardı.' },
      { type: 'mc', q: "Kur'an bu antlaşmayı nasıl niteledi?", o: ["'Apaçık bir fetih' (Fetih 1)", 'Bir yenilgi', 'Bir imtihan', 'Bir ceza'], a: 0, exp: "'Biz sana apaçık bir fetih verdik' (Fetih 1) — barış, fetihlerin kapısı oldu." },
      { type: 'mc', q: 'Antlaşma görünüşte nasıldı, sonuçta ne oldu?', o: ['Aleyhte görünüyordu; İslam barış döneminde hızla yayıldı', 'Lehte görünüyordu; bozuldu', 'Hiç uygulanmadı', 'Savaşı başlattı'], a: 0, exp: 'İki yıl içinde Müslümanların sayısı katlandı; 630\'da Mekke fethedildi.' },
    ],
  },
  {
    id: 'hayber', title: 'Hayber', emoji: '🏰', artifact: '🛡️', artifactName: 'Hayber Kalkanı', difficulty: 3,
    summary: "629'da Medine'ye kuzeyden yönelen tehdidin merkezi Hayber kalelerine sefer düzenlendi. En güçlü kalenin fethinde Hz. Ali destanlaştı. Bölge, antlaşmayla üretime devam etti.",
    steps: [
      { type: 'mc', q: 'Hayber Seferi hangi yıl yapıldı?', o: ['629 (Hicri 7)', '624', '622', '632'], a: 0, exp: 'Hicretin 7. yılında (miladi 629) gerçekleşti.' },
      { type: 'mc', q: 'Hayber neresidir?', o: ["Medine'nin kuzeyinde kaleler bölgesi", "Mekke'nin limanı", 'Şam yakınında bir şehir', 'Yemen\'de bir vadi'], a: 0, exp: 'Güçlü surlarla çevrili kalelerden oluşan bir tarım bölgesiydi.' },
      { type: 'mc', q: 'Hayber\'in fethinde sancağı taşıyıp öne çıkan sahabi kimdir?', o: ['Hz. Ali', 'Hz. Ömer', 'Hz. Halid', 'Hz. Zübeyr'], a: 0, exp: "'Yarın sancağı Allah'ı ve Resulünü seven birine vereceğim' buyruldu; sancak Hz. Ali'ye verildi." },
      { type: 'mc', q: 'Fetih sonrası bölge halkına nasıl davranıldı?', o: ['Antlaşmayla topraklarında üretime devam ettiler', 'Sürgün edildiler', 'Köle yapıldılar', 'Şehir yakıldı'], a: 0, exp: 'Mahsulün yarısı karşılığında topraklarını işlemeye devam ettiler.' },
    ],
  },
  {
    id: 'fetih', title: "Mekke'nin Fethi", emoji: '🗝️', artifact: '🗝️', artifactName: 'Fetih Anahtarı', difficulty: 3,
    summary: "630'da on bin kişilik ordu Mekke'ye girdi — neredeyse hiç kan dökülmeden. Peygamberimiz, yıllarca zulmeden Mekkelilere sordu: 'Size ne yapmamı beklersiniz?' Ve tarihi cevabı verdi: 'Gidiniz, hepiniz serbestsiniz.' Kâbe putlardan temizlendi.",
    steps: [
      { type: 'mc', q: "Mekke'nin Fethi hangi yıl gerçekleşti?", o: ['630 (Hicri 8)', '628', '624', '632'], a: 0, exp: 'Hicretin 8. yılında, Ramazan ayında gerçekleşti.' },
      { type: 'mc', q: 'Fetih nasıl gerçekleşti?', o: ['Neredeyse hiç kan dökülmeden', 'Uzun kuşatmayla', 'Büyük meydan savaşıyla', 'Gece baskınıyla'], a: 0, exp: 'Şehre dört koldan girildi; büyük çatışma yaşanmadı.' },
      { type: 'mc', q: 'Peygamberimiz Mekkelilere ne dedi?', o: ["'Gidiniz, hepiniz serbestsiniz' (genel af)", 'Hepsini sürgün etti', 'Fidye istedi', 'Hapsettirdi'], a: 0, exp: "Yusuf (a.s.)'ın kardeşlerine dediği gibi: 'Bugün size kınama yok' dedi ve affetti." },
      { type: 'mc', q: 'Fetihten sonra Kâbe\'de ne yapıldı?', o: ['Putlardan temizlendi', 'Yeniden inşa edildi', 'Kapatıldı', 'Saray yapıldı'], a: 0, exp: "'Hak geldi, batıl yok oldu' (İsra 81) okunarak 360 put kaldırıldı." },
    ],
  },
  {
    id: 'veda', title: 'Veda Hutbesi', emoji: '📜', artifact: '👑', artifactName: 'Veda Fermanı', difficulty: 3,
    summary: "632, Arafat. Yüz binin üzerinde hacıya seslendi: 'Canlarınız, mallarınız, namuslarınız dokunulmazdır... Arap'ın Arap olmayana üstünlüğü yoktur; üstünlük ancak takvadadır.' Ve o gün ayet indi: 'Bugün dininizi tamamladım.'",
    steps: [
      { type: 'mc', q: 'Veda Hutbesi nerede okundu?', o: ["Arafat'ta", "Kâbe'de", "Medine'de", "Mina'da"], a: 0, exp: 'Veda Haccı sırasında Arafat vadisinde okundu.' },
      { type: 'mc', q: 'Veda Hutbesi hangi yıl okundu?', o: ['632 (Hicri 10)', '630', '622', '610'], a: 0, exp: 'Hicretin 10. yılındaki Veda Haccı\'nda okundu; aynı yıl Peygamberimiz vefat etti.' },
      { type: 'mc', q: 'Hutbede üstünlük ölçüsü olarak ne gösterildi?', o: ['Takva (Allah bilinci)', 'Soy', 'Zenginlik', 'Kuvvet'], a: 0, exp: "'Üstünlük ancak takvadadır' — evrensel eşitlik ilanı." },
      { type: 'mc', q: 'O gün inen ve dinin tamamlandığını bildiren ayet hangisidir?', o: ["'Bugün dininizi tamamladım' (Maide 3)", "'Oku!' (Alak 1)", "'Biz sana fetih verdik' (Fetih 1)", "'Allah birdir' (İhlas 1)"], a: 0, exp: "'Bugün sizin için dininizi kemale erdirdim...' (Maide 3)." },
    ],
  },
];

export const ADVENTURE_BADGE = 'Siyer Kâşifi';
export default ADVENTURE;
