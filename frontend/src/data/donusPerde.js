import EN from './donusPerde.en';
// frontend/src/data/donusPerde.js
// 🎭 KIRK PERDE — Dönüş Odası'nın anlatı katmanı
//
// ─────────────────────────────────────────────────────────────────
// BU NEDİR?
// Ders (returnPath.js) bilgi verir: "abdest şöyle alınır".
// PERDE ise bilgi vermez — bir şeyi GÖSTERİR. Her gün bir perde
// aralanır; kişinin kendi içinde zaten duran bir şey görünür olur.
//
// Tasavvufta "perde" (hicâb) örten şeydir. Kırk gün, kırk perde.
// Kandilin ışığı da aralanan perde sayısınca artar — Dönüş Odası'nın
// bütün görsel dili bu tek metafora bağlanır.
//
// ─────────────────────────────────────────────────────────────────
// SES VE ÜSLUP — EN ÖNEMLİ KISIM
//
// Bu metinleri bir HOCA okumuyor. İki arkadaş okuyor; ikisi de âlim
// değil, ikisi de yolda. Bu yüzden:
//
//   ✗ "Şunu yapmalısın", "haramdır", "farzdır"     → fetva dili YOK
//   ✗ "Sevgili kardeşim", "muhterem"               → vaaz dili YOK
//   ✓ "Biz de bilmiyoruz ama şunu fark ettik"      → yoldaş dili
//   ✓ Soru sorup cevabı kişiye bırakmak            → düşündürmek
//   ✓ Akaid ve tasavvuf çerçevesi                  → ne inanıyoruz,
//     kalpte ne oluyor — fıkhî hüküm dersin işidir, perdenin değil
//
// TON ÖLÇÜSÜ: "Bu cümleyi karşımdaki kişiye, o benden daha iyi bir
// müslüman olabilir ihtimalini akılda tutarak söyleyebilir miyim?"
//
// ─────────────────────────────────────────────────────────────────
// YAPISI
//   lines[]   — okunacak parçalar. t = sesin kaçıncı saniyesinde
//               başladığı (seslendirme eklendiğinde eşitlenir).
//               Ses yoksa okuma modunda kendi temposuyla akar.
//   sahne[]   — o anda ekranda ne olacağı (soyut ışık/geometri;
//               tasvir yok). at = saniye.
//   kalan     — perdeden geriye kalan tek cümle. Ekranda kalır.
//   sure      — tahmini seslendirme süresi (saniye)
//
// SESLENDİRME: public/audio/donus/perde-01.mp3 ... perde-40.mp3
// Dosya yoksa uygulama sessizce okuma moduna düşer (bkz. donusVoice.js).

export const PERDELER = [
  // ═══════════════════════ 1 ═══════════════════════
  {
    day: 1,
    title: `Sen mi geldin?`,
    kalan: `Belki sen buraya gelmedin. Belki çağrıldın.`,
    sure: 95,
    lines: [
      { t: 0,  text: `Bir şey soracağım. Cevabını bana verme.` },
      { t: 4,  text: `Bu uygulamayı bugün açtın. Peki dün de aklından geçmişti, değil mi? Belki bir hafta önce de. Belki aylardır.` },
      { t: 13, text: `Asıl soru şu: o düşünce nereden geliyordu?` },
      { t: 19, text: `Biz genelde şöyle kurarız cümleyi — ben karar verdim, ben geldim.` },
      { t: 26, text: `Ama işin ehli olanlar bunu tersinden okur. Derler ki: bir kapıyı çalmak istiyorsan, önce o kapının varlığından haberdar edilmen gerekir. Kimse görmediği kapıyı çalmaz.` },
      { t: 40, text: `Yani sende beliren o huzursuzluk — "böyle olmamalı" diyen o sessiz ses — senin icadın değildi.` },
      { t: 50, text: `Bunu bir iddia olarak söylemiyoruz. Biz de âlim değiliz, biz de yoldayız. Ama şu sözü biliyoruz:` },
      { t: 60, text: `"Kulum bana bir karış yaklaşırsa ben ona bir arşın yaklaşırım. Bana yürüyerek gelirse ben ona koşarak gelirim."` },
      { t: 71, text: `Dikkat et: hareket kulda başlıyor gibi görünüyor. Ama karşılık o kadar büyük, o kadar hızlı geliyor ki — insan sonradan anlıyor.` },
      { t: 82, text: `Bugün senden hiçbir şey istemiyoruz. Sadece bunu bir düşün.` },
      { t: 88, text: `Belki sen buraya gelmedin. Belki çağrıldın.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Tek bir nokta ışık, uzakta' },
      { at: 19, mod: 'yaklasan', not: 'Işık yavaşça büyür — sen değil o yaklaşıyor' },
      { at: 60, mod: 'nefes',    not: 'Işık nefes alır' },
      { at: 82, mod: 'sarmal',   not: 'Işık etrafını sarar' },
    ],
    kaynak: `Hadis-i kudsî: Buhârî, Tevhîd 50; Müslim, Zikir 1`,
  },

  // ═══════════════════════ 2 ═══════════════════════
  {
    day: 2,
    title: `Perdenin arkası`,
    kalan: `Uzaklaştıran O değildi. Perde bizim tarafımızdaydı.`,
    sure: 92,
    lines: [
      { t: 0,  text: `Uzak kaldığın yıllarda hiç şunu düşündün mü: acaba beni terk mi etti?` },
      { t: 7,  text: `Çoğumuz bunu düşünürüz ama söylemeyiz. Söylemek ayıp gelir.` },
      { t: 13, text: `Oysa cevabı düşündüğümüzden basit.` },
      { t: 17, text: `Güneşi düşün. Bir odada perdeyi kapatırsın, oda kararır. Güneş sana küsmemiştir. Güneş yerindedir, ışığı da yerinde.` },
      { t: 29, text: `Değişen tek şey aradaki perdedir.` },
      { t: 33, text: `Bizim geleneğimizde buna hicâb denir — örten şey. Ve şu söylenir: perde daima kulun tarafındadır.` },
      { t: 43, text: `Bu cümle ilk bakışta ağır gelebilir. "Demek benim suçum" dersin.` },
      { t: 49, text: `Ama tam tersini söylüyor aslında. Çünkü perde senin tarafındaysa, açılması da senin elinde demektir.` },
      { t: 58, text: `Uzaklaşan O olsaydı yapabileceğin hiçbir şey olmazdı. Ama öyle değil.` },
      { t: 65, text: `Kur'an'da geçen bir cümle var: "Biz ona şah damarından daha yakınız."` },
      { t: 73, text: `Şah damarı. Yani senin bile göremediğin, ama sensiz olmayan yer.` },
      { t: 80, text: `Bugün perdenin tamamını açman gerekmiyor. Bir parmak aralık yeter. Işık zaten dışarıda bekliyor.` },
    ],
    sahne: [
      { at: 0,  mod: 'perde',   not: 'Kapalı bir doku, arkasında ışık sezilir' },
      { at: 29, mod: 'aralik',  not: 'İnce bir yarık açılır' },
      { at: 65, mod: 'damar',   not: 'İçeriden dışa doğru ince ışık çizgileri' },
      { at: 80, mod: 'aralanma', not: 'Yarık genişler, ışık odaya dolar' },
    ],
    kaynak: `Kâf sûresi 16 · "Perde kulun tarafındadır" — tasavvuf klasiklerinde yaygın ifade`,
  },

  // ═══════════════════════ 3 ═══════════════════════
  {
    day: 3,
    title: `Kırık olan kabul edilir`,
    kalan: `Sağlam kalp değil, kırık kalp aranıyor.`,
    sure: 90,
    lines: [
      { t: 0,  text: `Bir şey itiraf edelim: buraya gelirken içinden "ben olmam" diye geçirdin, değil mi?` },
      { t: 7,  text: `Ben yeterince temiz değilim. Benim geçmişim var. Benim gibi biri...` },
      { t: 13, text: `Bu cümle çok yaygın. Ve çok yanlış bir yerden besleniyor.` },
      { t: 19, text: `Şöyle bir kabul var aramızda: önce düzeleceksin, sonra geleceksin. Önce temizleneceksin, sonra kapıyı çalacaksın.` },
      { t: 29, text: `Ama hiç düşündün mü — hastane, hasta olmayanlar için mi açıktır?` },
      { t: 35, text: `Kur'an'da Allah'ın kendini tanıttığı isimlerden biri şudur: el-Cebbâr. Bu ismi çoğu zaman "zorlayan, gücü her şeye yeten" diye çeviririz.` },
      { t: 47, text: `Oysa aynı kökten bir kelime daha var: cebîre. Kırık kemiğe sarılan atel.` },
      { t: 55, text: `El-Cebbâr, kırılanı saran demektir de.` },
      { t: 60, text: `Yani kırıklığın seni dışarıda bırakan şey değil; tam olarak seni oraya davet eden şey.` },
      { t: 68, text: `Bir söz vardır, çokça nakledilir: "Ben kırık kalplerin yanındayım."` },
      { t: 76, text: `Bunun senedini tartışırlar, biz burada hüküm vermiyoruz. Ama anlamı Kur'an'a aykırı değil — hatta tam ortasında duruyor.` },
      { t: 85, text: `Bugün kendini onarmış olarak gelmen istenmiyor. Kırık hâlinle gel.` },
    ],
    sahne: [
      { at: 0,  mod: 'catlak',  not: 'Çatlamış bir yüzey, karanlık' },
      { at: 47, mod: 'sizinti', not: 'Çatlaklardan ışık sızmaya başlar' },
      { at: 68, mod: 'altin',   not: 'Çatlaklar ışıkla dolar — kırık yer en parlak yer olur' },
      { at: 85, mod: 'butun',   not: 'Yüzey bütünleşir ama izler ışık olarak kalır' },
    ],
    kaynak: `el-Cebbâr ismi üzerine klasik lügat açıklaması · "Kırık kalpler" rivayeti: senedi tartışmalıdır, mana olarak nakledilir`,
  },

  // ═══════════════════════ 4 ═══════════════════════
  {
    day: 4,
    title: `Az olanın sırrı`,
    kalan: `Devamlı olan az, kesintili olan çoktan büyüktür.`,
    sure: 88,
    lines: [
      { t: 0,  text: `Bugün sana tek bir görev verildi. Muhtemelen "bu kadar mı?" diye düşündün.` },
      { t: 7,  text: `Bu bir kolaylık değil. Bu bir usul.` },
      { t: 11, text: `Şöyle bir hadis var: Allah'a amellerin en sevimlisi, az da olsa devamlı olanıdır.` },
      { t: 19, text: `Buradaki "sevimli" kelimesine dikkat et. "Yeterli" demiyor, "makbul" demiyor. Sevimli diyor.` },
      { t: 28, text: `Peki neden? Çünkü çok olan bir şey seni yorar, sonra bırakırsın. Bıraktığında da suçlu hissedersin. Suçluluk da seni büsbütün uzaklaştırır.` },
      { t: 41, text: `Az olan ise yormaz. Yormayan şey sürer. Süren şey kalpte bir yer açar.` },
      { t: 49, text: `Ve o yer, sen farkında olmadan genişler.` },
      { t: 54, text: `Su damlasının taşı delmesini düşün. Damlanın gücü yoktur; tekrarın gücü vardır.` },
      { t: 63, text: `Bizim gördüğümüz şu: insanlar dinden büyük hatalar yüzünden uzaklaşmıyor. Yorulunca uzaklaşıyor.` },
      { t: 72, text: `Bu yüzden burada seni yormayacağız. Bunu bir eksiklik sanma.` },
      { t: 79, text: `Bugünkü tek görevini yap. Yarını yarın konuşuruz.` },
    ],
    sahne: [
      { at: 0,  mod: 'damla',   not: 'Tek bir damla düşer' },
      { at: 41, mod: 'ritim',   not: 'Damlalar düzenli aralıkla' },
      { at: 54, mod: 'oyulma',  not: 'Yüzeyde iz derinleşir' },
      { at: 79, mod: 'kaynak',  not: 'İzden su fışkırır' },
    ],
    kaynak: `Buhârî, Rikāk 18; Müslim, Müsâfirîn 216`,
  },

  // ═══════════════════════ 5 ═══════════════════════
  {
    day: 5,
    title: `Görülmeyen taraf`,
    kalan: `Amelini insanlar tartar; niyetini yalnız O bilir.`,
    sure: 91,
    lines: [
      { t: 0,  text: `İki kişi aynı işi yapar. Biri sevap kazanır, diğeri kazanmaz. Fark nerededir?` },
      { t: 8,  text: `Cevabı biliyoruz: niyet. Ama bu kelimeyi o kadar çok duyduk ki artık bir şey söylemiyor.` },
      { t: 16, text: `Şöyle düşünelim. Amel görünen taraftır. Niyet görünmeyen taraf.` },
      { t: 23, text: `İnsanlar seni görünen tarafından tanır. Ne kadar kıldığını, ne kadar okuduğunu sayarlar. Sen de kendini öyle tartmaya alışırsın.` },
      { t: 34, text: `Ama bir düşün: senin en zor anında, kimsenin görmediği yerde, hiçbir karşılık beklemeden yaptığın o küçük şey vardı ya —` },
      { t: 45, text: `İşte o, terazide en ağır olandır.` },
      { t: 49, text: `Ve bunun tersi de doğru. Herkesin alkışladığı ama içinde başka bir şey aradığın amel, dışarıdan büyük görünür, terazide hafif kalır.` },
      { t: 61, text: `Bu, korkutmak için söylenmiş bir şey değil. Rahatlatmak için söylenmiş bir şey.` },
      { t: 68, text: `Çünkü şu an elinden az geliyor olabilir. Ama niyetin geniş.` },
      { t: 75, text: `Ve niyet, kendi başına yazılan bir ameldir. Bir iyiliği yapmaya karar verip yapamasan bile, o karar kayda geçer.` },
      { t: 85, text: `Bugün yapabildiğin kadarını yap. Gerisini niyetine bırak.` },
    ],
    sahne: [
      { at: 0,  mod: 'terazi',  not: 'İki kefe, biri görünür biri sisli' },
      { at: 34, mod: 'gizli',   not: 'Görünmeyen kefede bir ışık belirir' },
      { at: 45, mod: 'agirlik', not: 'Işıklı kefe ağır basar' },
      { at: 85, mod: 'sakin',   not: 'Terazi durulur' },
    ],
    kaynak: `Buhârî, Bedü'l-Vahy 1; Müslim, İmâre 155`,
  },

  // ═══════════════════════ 6 ═══════════════════════
  {
    day: 6,
    title: `Kimin sevinci`,
    kalan: `Dönüşüne senden çok sevinen biri var.`,
    sure: 93,
    lines: [
      { t: 0,  text: `Şimdi anlatacağımız şey, ilk duyulduğunda insana tuhaf gelir.` },
      { t: 6,  text: `Bir adam çölde yolculuk ediyor. Devesi kaçıyor — üzerinde bütün yiyeceği ve suyu var. Adam arıyor, bulamıyor.` },
      { t: 17, text: `Sonunda umudu kesip bir ağacın gölgesine uzanıyor. Öleceğini biliyor.` },
      { t: 24, text: `Gözünü açtığında deve karşısında duruyor.` },
      { t: 29, text: `O anki sevinci düşün. Öyle bir sevinç ki adam ne diyeceğini şaşırıyor.` },
      { t: 36, text: `Peygamberimiz bu tabloyu çizdikten sonra şunu söylüyor: Allah, kulunun tövbesine bundan daha çok sevinir.` },
      { t: 46, text: `Dur ve bir daha oku. Sevinen kim?` },
      { t: 51, text: `Biz dönüşü hep bir borç ödeme gibi düşünürüz. Suçlu adam mahkemeye çıkıyor gibi.` },
      { t: 59, text: `Oysa anlatılan tablo bu değil. Anlatılan tablo bir kavuşma.` },
      { t: 65, text: `Ve tuhaf olan şu: kavuşmanın sevinci sana değil, karşı tarafa yükleniyor.` },
      { t: 73, text: `Bunun ne demek olduğunu tam olarak biz de kavrayabilmiş değiliz. Ama şunu biliyoruz — utanarak gelinmesi gereken bir kapı değilmiş.` },
      { t: 84, text: `Bugün utançla değil, karşılanacağını bilerek gel.` },
    ],
    sahne: [
      { at: 0,  mod: 'col',      not: 'Boş, geniş, sıcak bir doku' },
      { at: 24, mod: 'donus',    not: 'Uzakta bir siluet — soyut, ışık lekesi' },
      { at: 46, mod: 'genisleme', not: 'Işık patlar gibi genişler' },
      { at: 84, mod: 'sarilma',  not: 'Işık kişiyi sarar' },
    ],
    kaynak: `Buhârî, Deavât 4; Müslim, Tevbe 7`,
  },

  // ═══════════════════════ 7 ═══════════════════════
  {
    day: 7,
    title: `İlk perde kapanıyor`,
    kalan: `Yedi gün önce yoktu. Şimdi var.`,
    sure: 86,
    lines: [
      { t: 0,  text: `Yedi gün oldu.` },
      { t: 3,  text: `Bu cümleyi geçiştirme. Yedi gün önce bunların hiçbiri yoktu.` },
      { t: 10, text: `Muhtemelen bu hafta bazı günleri atladın. Belki bir gün hiç açmadın. Belki bir günü yarım yaptın.` },
      { t: 19, text: `Şimdi kendini onlarla tartma isteği geliyor, biliyoruz. O ses hep gelir.` },
      { t: 26, text: `Ama bir düşün: hangi ölçüyle tartıyorsun?` },
      { t: 31, text: `Eğer ölçün "mükemmel yapmalıydım" ise, o ölçüyle hiç kimse geçemez. O ölçüyü kimse koymadı; biz kendimize koyduk.` },
      { t: 42, text: `Gerçek ölçü şu: bir hafta önce yoktu, şimdi var.` },
      { t: 48, text: `Yoktan var olan her şey korunmayı hak eder.` },
      { t: 53, text: `Bir de şunu söyleyelim. Bu yola çıkanların çoğu ilk haftada bırakır. Sen bırakmadın.` },
      { t: 62, text: `Bunu bir başarı olarak değil, bir işaret olarak al. Devam edebilen biri olduğunun işareti.` },
      { t: 71, text: `Yarın ikinci bölüm açılıyor. Orada namazı konuşacağız — ama korktuğun şekilde değil.` },
      { t: 80, text: `Bugünlük bu kadar. Sadece geriye bak ve şükret.` },
    ],
    sahne: [
      { at: 0,  mod: 'gerive',  not: 'Yedi küçük ışık noktası, geride' },
      { at: 42, mod: 'zincir',  not: 'Noktalar ince bir çizgiyle birleşir' },
      { at: 62, mod: 'yol',     not: 'Çizgi ileri doğru uzar' },
      { at: 80, mod: 'durak',   not: 'Sakin, dolu bir ışık' },
    ],
    kaynak: `İbrâhîm sûresi 7`,
  },

  // ═══════════════════════ 8 ═══════════════════════
  {
    day: 8,
    title: `Ağırlaşan adımlar`,
    kalan: `Zor gelen namaz değil; kafanda büyüttüğün yüktür.`,
    sure: 92,
    dua: {
      title: 'Sübhaneke Duası',
      arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلاَ إِلَهَ غَيْرُكَ',
      okunus: 'Sübhanakellahümme ve bi hamdike ve tebarekesmüke ve teala ceddüke ve la ilahe ğayrük.',
      meal: 'Allah\'ım! Seni her türlü noksanlıktan tenzih eder, hamdinle tesbih ederim. İsmin mübarektir, şanın yücedir ve senden başka ilah yoktur.',
    },
    lines: [
      { t: 0,  text: `Namaz kılmak istediğinde ayağına bağlı bir ağırlık hissedersin ya...` },
      { t: 6,  text: `Sanki beş dakikalık bir duruş değil de, aşılmaz bir dağ durur önünde.` },
      { t: 14, text: `Oysa beden yorulmaz. Yorulan zihindir.` },
      { t: 20, text: `Geçmişte kılmadığın yüzlerce vaktin ağırlığını şu anki abdestine yüklersin.` },
      { t: 29, text: `Oysa O senden geçmişin değil, yalnız bugünün iki rekatını istiyor.` },
      { t: 37, text: `Tek bir vakit. Şimdi.` },
      { t: 42, text: `Yolu adımlarla değil, o anki tek bir adımla yürürsün.` },
      { t: 50, text: `Başlarken okunan şu duaya bak: "Seni noksan sıfatlardan arındırırım..."` },
      { t: 60, text: `Daha istemeden, daha dile getirmeden önce O'nun yüceliğini kabul edersin.` },
      { t: 71, text: `Yükü omuzundan indir. Yalnızca bu vakit için seccadene bas.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Ağır zemin' },
      { at: 20, mod: 'aralik',  not: 'Tek bir dikey ışık huzmesi' },
      { at: 50, mod: 'nefes',   not: 'Yavaşça genişleyen aydınlık' },
    ],
    kaynak: `Buhârî, Ezan 89 · Namaza başlama duası (Sübhaneke)`,
  },

  // ═══════════════════════ 9 ═══════════════════════
  {
    day: 9,
    title: `Su ile yıkanan yalnız beden değil`,
    kalan: `Abdest sudan önce niyetle yıkar.`,
    sure: 89,
    dua: {
      title: 'Abdest Sonrası Şehadet Duası',
      arabic: 'أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      okunus: 'Eşhedü el lâ ilâhe illallâhü vahdehû lâ şerîke leh, ve eşhedü enne Muhammeden abdühû ve rasûlüh.',
      meal: 'Şehadet ederim ki Allah\'tan başka ilah yoktur; O tektir, ortağı yoktur. Yine şehadet ederim ki Hz. Muhammed O\'nun kulu ve elçisidir.',
    },
    lines: [
      { t: 0,  text: `Abdest alırken eline demin deydiğinde ne hissediyorsun?` },
      { t: 6,  text: `Sadece bir serinlik mi, yoksa bir siliniş mi?` },
      { t: 12, text: `Peygamberimiz der ki: "Bir Müslüman abdest aldığında, yüzünü yıkarken gözleriyle işlediği hatalar su damlalarıyla dökülür."` },
      { t: 26, text: `Ellerini yıkarken ellerinin duraksamaları, ayaklarını yıkarken yürüdüğün pürüzler dökülür.` },
      { t: 36, text: `Abdest bir temizlik ritüeli değil; bir ağırlık bırakma eylemidir.` },
      { t: 45, text: `Musluğu açtığında yalnız bedenini değil, günün yorgunluğunu da akıtmaya niyet et.` },
      { t: 56, text: `Suyun akışı gibi su gibi berrak olmaya niyet et.` },
      { t: 67, text: `Sonunda kelime-i şehadet getirdiğinde, göğsündeki o ferahlığı duyarsın.` },
    ],
    sahne: [
      { at: 0,  mod: 'damla',   not: 'Tekil damlalar süzülür' },
      { at: 26, mod: 'sizinti', not: 'Işıklı su arkları' },
      { at: 56, mod: 'kaynak',  not: 'Duru su birikintisi parlar' },
    ],
    kaynak: `Müslim, Tahâret 32 (Hadis no: 244)`,
  },

  // ═══════════════════════ 10 ═══════════════════════
  {
    day: 10,
    title: `Secdenin sırrı`,
    kalan: `En alçakta olduğun an, en yüksekte olduğun andır.`,
    sure: 94,
    dua: {
      title: 'Secde Zikri',
      arabic: 'سُبْحَانَ رَبِّيَ الأَعْلَى',
      okunus: 'Subhâne Rabbiyel-A\'lâ',
      meal: 'Yüceler yücesi olan Rabbimi her türlü noksanlıktan tenzih ederim.',
    },
    lines: [
      { t: 0,  text: `İnsan gururludur. Başını eğmek insan doğasına zor gelir.` },
      { t: 7,  text: `Ama seccadede alnını yere koyduğunda tuhaf bir hafifleme hissedersin.` },
      { t: 15, text: `Neden biliyor musun?` },
      { t: 18, text: `Çünkü insan topraktan yaratıldı. Alnın toprağa/yere değdiğinde aslına dönersin.` },
      { t: 28, text: `Ve şöyle denir: "Kulun Rabbine en yakın olduğu an, secde anıdır."` },
      { t: 37, text: `Fiziğe terstir bu: en aşağı inersin ama en yükseğe ulaşırsın.` },
      { t: 46, text: `O an fısıldadığın kelimeye bak: "Subhane Rabbiyel A'la" — Yüce olan Rabbim.` },
      { t: 57, text: `Sen alçaldıkça O'nun yüceliğini kabul edersin. Ve O senin kırık alnını kaldırır.` },
      { t: 68, text: `Secdede acele etme. Birkaç saniye daha kal. Yer dinler, gök duyar.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Derin karanlık zemin' },
      { at: 28, mod: 'sarmal',   not: 'Alın noktasından yayılan dairesel ışık' },
      { at: 57, mod: 'altin',    not: 'Altın renkli nur halesi' },
    ],
    kaynak: `Müslim, Salât 215; Abu Dâvûd, Salât 148`,
  },

  // ═══════════════════════ 11 ═══════════════════════
  {
    day: 11,
    title: `Fâtiha'nın ilk cümlesi`,
    kalan: `Hamd, kırık kalbin teşekkürüdür.`,
    sure: 90,
    dua: {
      title: 'Fâtiha Suresi (İlk Ayetler)',
      arabic: 'الْحَمْدُ للّهِ رَبِّ الْعَالَمِينَ ۞ الرَّحْمـنِ الرَّحِيمِ ۞ إِيَّاكَ نَعْبُدُ وإِيَّاكَ نَسْتَعِينُ',
      okunus: 'Elhamdü lillâhi rabbil \'âlemîn. Er-rahmânir-rahîm. İyyâke na\'büdü ve iyyâke neste\'în.',
      meal: 'Hamd, âlemlerin Rabbi, Rahmân ve Rahîm olan Allah\'a mahsustur. Yalnız sana kulluk eder, yalnız senden yardım dileriz.',
    },
    lines: [
      { t: 0,  text: `Namazda her rekatta okuduğun o sure var ya: Fâtiha — Açılış.` },
      { t: 7,  text: `İlk cümle: "Elhamdülillahi Rabbil âlemîn."` },
      { t: 13, text: `Hamd olsun. Yalnız nimet varken değil; darlıkta da, arayışta da.` },
      { t: 22, text: `Çünkü hamd "her şey mükemmel" demek değildir. "O'nun varlığı bana yeter" demektir.` },
      { t: 33, text: `Ardından gelir: "İyyâke na'büdü ve iyyâke neste'în" — Yalnız sana kulluk eder, yalnız senden yardım dileriz.` },
      { t: 46, text: `Dikkat et: önce söz veriyorsun, sonra yardım istiyorsun.` },
      { t: 54, text: `Kendi gücünle değil, O'nun yardımıyla ayakta durduğunu itiraf ediyorsun.` },
      { t: 65, text: `Fâtiha bir ezber metni değildir; insan ile Yaratıcı arasındaki en samimi diyalogdur.` },
    ],
    sahne: [
      { at: 0,  mod: 'aralanma', not: 'Genişleyen dikey ışık yarılığı' },
      { at: 33, mod: 'nefes',    not: 'Kalp atışı gibi ışık modülasyonu' },
    ],
    kaynak: `Fâtiha Sûresi 1-5`,
  },

  // ═══════════════════════ 12 ═══════════════════════
  {
    day: 12,
    title: `Gece inen huzur`,
    kalan: `Sessizlikte söylenen söz, arşa en hızlı ulaşandır.`,
    sure: 88,
    dua: {
      title: 'Gece ve Sığınma Duası',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ وَبِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ',
      okunus: 'Allahümme innî eûzü bi-ridâke min sehatike ve bi-muâfâtike min ukûbetik.',
      meal: 'Allah\'ım! Senin gazabından rızana, cezandan affına sığınırım.',
    },
    lines: [
      { t: 0,  text: `Herkes uyuduğunda şehir susar, zihin berraklaşır.` },
      { t: 7,  text: `Gece vakti kılınan iki rekatın tadı gündüzünkine benzemez.` },
      { t: 15, text: `Çünkü gece riya yoktur. Gösteriş yoktur. Yalnızca sen ve O varsınızdır.` },
      { t: 25, text: `Hadis-i şerifte denir ki: "Rabbimiz her gece gecenin son üçte birinde dünya semasına nüzul eder ve der ki: Yok mu bana dua eden, duasını kabul edeyim?"` },
      { t: 42, text: `Gecenin sükûnetinde açılan eller boş dönmez.` },
      { t: 51, text: `Gece kalkamıyorsan bile, yatağına girmeden önce fısıldadığın bir istiğfar bile arşa ulaşır.` },
      { t: 63, text: `Gecenin karanlığını kalbinin ışığı yap.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Koyu lacivert gece atmosferi' },
      { at: 25, mod: 'yaklasan', not: 'Gökten inen yumuşak altın zerreler' },
    ],
    kaynak: `Buhârî, Teheccüd 14; Müslim, Müsâfirîn 168`,
  },

  // ═══════════════════════ 13 ═══════════════════════
  {
    day: 13,
    title: `Bağışlanma isteği`,
    kalan: `İstiğfar günahın ağırlığını hafifleten nefestir.`,
    sure: 91,
    dua: {
      title: 'Seyyidül İstiğfar (İstiğfarın Efendisi)',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
      okunus: 'Allahümme ente Rabbî lâ ilâhe illâ ente halaktenî ve ene abdüke ve ene alâ ahdike ve va\'dike masta-ta\'tü.',
      meal: 'Allah\'ım! Sen benim Rabbimsin, senden başka ilah yoktur. Beni sen yarattın, ben senin kulunum. Gücüm yettiğince sana verdiğim söz üzereyim.',
    },
    lines: [
      { t: 0,  text: `Omuzlarında belirsiz bir sıkıntı hissettiğin olur mu?` },
      { t: 6,  text: `Sebebini bilmediğin bir daralma...` },
      { t: 12, text: `Peygamberimiz günde yüz defa istiğfar ederdi. O ki günahsızdı.` },
      { t: 21, text: `Neden biliyor musun? Çünkü istiğfar yalnız günah için değil, kalbin üzerindeki tozu almak içindir.` },
      { t: 32, text: `Aynayı silmek gibidir. Ayna kirli değilse bile zamanla buğulanır.` },
      { t: 42, text: `"Estağfirullah" derken nefesini derin al. "Rabbim beni bağışla, yükümü hafiflet" de.` },
      { t: 53, text: `Bağışlayan O'dur. Ve O bağışlamayı sever.` },
    ],
    sahne: [
      { at: 0,  mod: 'catlak',  not: 'Buğulu cam dokusu' },
      { at: 32, mod: 'sizinti', not: 'Buğunun çözülmesi ve açılan berraklık' },
    ],
    kaynak: `Buhârî, Deavât 2; Müslim, Zikir 41`,
  },

  // ═══════════════════════ 14 ═══════════════════════
  {
    day: 14,
    title: `Gönül darlığı ve İnşirah`,
    kalan: `Şüphesiz her zorlukla birlikte bir kolaylık vardır.`,
    sure: 89,
    dua: {
      title: 'İnşirah Suresi',
      arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۞ وَوَضَعْنَا عَنكَ وِزْرَكَ ۞ الَّذِي أَنقَضَ ظَهْرَكَ ۞ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
      okunus: 'Elem neşrah leke sadrak. Ve vedaknâ anke vizrak. Ellezî enkada zahrak. Fe-inne me\'al \'usri yusrâ.',
      meal: 'Biz senin göğsünü açıp genişletmedik mi? Belini büken yükünü üzerinden kaldırmadık mı? Şüphesiz her zorlukla beraber bir kolaylık vardır.',
    },
    lines: [
      { t: 0,  text: `Bazen dünya üzerine gelir. Göğsün daralır, nefes almak zorlaşır.` },
      { t: 8,  text: `İnşirah suresi tam da böyle anlarda inmiştir.` },
      { t: 15, text: `"Elem neşrah leke sadrak" — Biz senin göğsünü açıp genişletmedik mi?` },
      { t: 25, text: `"Ve vedaknâ anke vizrak" — Belini büken o ağır yükü kaldırmadık mı?` },
      { t: 35, text: `Ve o muazzam müjde: "Fe-inne me'al 'usri yusrâ" — Şüphesiz zorlukla beraber bir kolaylık vardır.` },
      { t: 48, text: `Zorluktan SONRA değil; zorlukla BERABER.` },
      { t: 56, text: `Zorluğun tohumunda kolaylık saklıdır. Yeter ki pes etme.` },
    ],
    sahne: [
      { at: 0,  mod: 'aralik',  not: 'Dar alan' },
      { at: 35, mod: 'genisleme', not: 'Göğüs açılır gibi genişleyen nur' },
    ],
    kaynak: `İnşirah Sûresi 1-6`,
  },

  // ═══════════════════════ 15 ═══════════════════════
  {
    day: 15,
    title: `İkinci perdenin sonu`,
    kalan: `Temeller atıldı. Yol artık daha görünür.`,
    sure: 87,
    dua: {
      title: 'Ayetel Kürsi',
      arabic: 'اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ',
      okunus: 'Allâhü lâ ilâhe illâ hüvel-hayyül-kayyûm. Lâ te\'hüzühû sinetün ve lâ nevm.',
      meal: 'Allah, O\'ndan başka ilah yoktur. O diridir, kayyûmdur (her şeyi ayakta tutandır). O\'nu ne bir uyuklama tutar ne de uyku.',
    },
    lines: [
      { t: 0,  text: `On beş gün geride kaldı.` },
      { t: 5,  text: `Temel bölümünü bitiriyorsun. Artık namazın, suyun, secdenin ve niyetin tadını biliyorsun.` },
      { t: 16, text: `Ayetel Kürsi okuduğunda O\'nun Hayy ve Kayyûm olduğunu hatırlarsın.` },
      { t: 26, text: `Seni uyumayan, uyuklamayan, hiç unutmayan biri gözetliyor.` },
      { t: 36, text: `Bu yalnızlık hissini bitiren en büyük müjdedir.` },
      { t: 46, text: `Şimdi üçüncü evreye — Bağ evresine geçiyoruz.` },
      { t: 56, text: `Adımlarını kutla ve yola güvenle devam et.` },
    ],
    sahne: [
      { at: 0,  mod: 'zincir',  not: 'İlerleme halkaları' },
      { at: 36, mod: 'durak',   not: 'Kuşatıcı altın küre' },
    ],
    kaynak: `Bakara Sûresi 255 (Ayetel Kürsi)`,
  },
  // ═══════════════════════ 16 ═══════════════════════
  {
    day: 16,
    title: `Sessiz bir direnç`,
    kalan: `Yolu yürüyen hisler değil, adımlardır.`,
    sure: 85,
    lines: [
      { t: 0,  text: `Bugün namaza durduğunda hiçbir şey hissetmemiş olabilirsin.` },
      { t: 6,  text: `Hatta içinden "Acaba ben bunu yapamıyor muyum?" diyen bir ses geçmiş olabilir.` },
      { t: 14, text: `Bu, manevi bir çöküş değil; bir imtihandır. Çünkü hisler değişkendir, kalıcı olan eylemdir.` },
      { t: 25, text: `Coşkuyla kılınan namaz tatlıdır. Ama içindeki isteksizliğe rağmen, sırf O istediği için kılınan namaz daha ağırdır.` },
      { t: 36, text: `Buna sabır diyoruz. Sadece bela karşısında değil, ibadetin sürmesinde gösterilen sabır.` },
      { t: 45, text: `Bugün coşku arama. Sadece seccadede dur.` },
      { t: 52, text: `Hissetmesen de O senin orada olduğunu biliyor.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Sabit, ağır zemin' },
      { at: 25, mod: 'ritim',    not: 'Yavaş, kararlı ışık atımı' },
    ],
    kaynak: `Müslim, Cenâiz 15`,
  },

  // ═══════════════════════ 17 ═══════════════════════
  {
    day: 17,
    title: `Tozlu kapağı açmak`,
    kalan: `Bu kitap âlimler için değil, senin için indi.`,
    sure: 88,
    dua: {
      title: 'Kur\'an Okuma Niyeti',
      arabic: 'اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي وَنُورَ صَدْرِي',
      okunus: 'Allahümmec\'alil-Kur\'âne rabîa kalbî ve nûra sadrî.',
      meal: 'Allah\'ım! Kur\'an\'ı kalbimin baharı ve göğsümün nuru kıl.',
    },
    lines: [
      { t: 0,  text: `Kur'an'a uzaktan bakarsan onu bir kurallar bütünü sanırsın.` },
      { t: 7,  text: `Onu ancak ilahiyatçıların anlayabileceği derin bir deniz gibi görürsün.` },
      { t: 15, text: `Oysa Kur'an kendi hakkında "biz onu öğüt alınsın diye kolaylaştırdık" der.` },
      { t: 25, text: `Kolaylaştırılan bir kitabı neden kendimize zorlaştırıyoruz?` },
      { t: 32, text: `Bugün üçüncü evreye, Bağ evresine geçiyoruz. Kur'an ile bir bağ kuracağız.` },
      { t: 42, text: `Çok okuman gerekmiyor. Bir sayfayı aç. Oradan geçen bir cümle, sadece senin için o gün orada olabilir.` },
      { t: 53, text: `Allah seninle konuşmak istiyor. Sadece dinlemeye başla.` },
    ],
    sahne: [
      { at: 0,  mod: 'perde',    not: 'Kapalı doku' },
      { at: 32, mod: 'aralanma', not: 'Sayfa açılır gibi yayılan ışık' },
      { at: 53, mod: 'altin',    not: 'Hafif parıltılar' },
    ],
    kaynak: `Kamer Sûresi 17`,
  },

  // ═══════════════════════ 18 ═══════════════════════
  {
    day: 18,
    title: `Kekelemenin onuru`,
    kalan: `Utancın, meleklerin gıptasıdır.`,
    sure: 85,
    lines: [
      { t: 0,  text: `Harfleri yeni öğreniyor olabilirsin. Veya yıllar içinde unutmuşsundur.` },
      { t: 8,  text: `Okurken takılırsın, yanlış okumaktan korkarsın, hecelersin.` },
      { t: 16, text: `İşte tam o an, utandığın o an, göklerde en çok alkışlanan andır.` },
      { t: 26, text: `Peygamber Efendimiz der ki: "Kur'an'ı zorlanarak, kekeleyerek okuyan kimseye iki kat ecir vardır."` },
      { t: 37, text: `Biri okumanın ecrî, diğeri o zorluğa katlanmanın, O'nun sözü için çabalamanın ecrî.` },
      { t: 47, text: `Zorluk bir eksiklik değil, senin sevgini ispatlayan bir nişandır.` },
      { t: 56, text: `Hecelerken durakla, ama vazgeçme.` },
    ],
    sahne: [
      { at: 0,  mod: 'catlak',   not: 'Kırıklı çizgiler' },
      { at: 26, mod: 'sizinti',  not: 'Kırıklardan sızan yoğun ışık' },
      { at: 47, mod: 'butun',    not: 'İzlerin altın orana dönüşmesi' },
    ],
    kaynak: `Buhârî, Tefsîr 80; Müslim, Müsâfirîn 244`,
  },

  // ═══════════════════════ 19 ═══════════════════════
  {
    day: 19,
    title: `Tekrarlanan Yedi`,
    kalan: `Fâtiha, kalbin pürüzlerini zımparalayan bir döngüdür.`,
    sure: 84,
    lines: [
      { t: 0,  text: `Neden her rekâtta Fâtiha'yı tekrar ediyoruz hiç düşündün mü?` },
      { t: 7,  text: `Bir günde en az kırk defa aynı cümleleri kuruyoruz.` },
      { t: 14, text: `Çünkü insan unutkandır. Yönünü çabuk kaybeder.` },
      { t: 21, text: `Fâtiha bir hatırlatmadır: Kimin huzurundayız, kimden yardım istiyoruz, nereye gitmek istiyoruz.` },
      { t: 32, text: `Günde kırk kez "Bizi doğru yola ilet" diyen bir pusula, gün içinde ne kadar sapabilir ki?` },
      { t: 42, text: `Bugün Fâtiha'yı okurken otomatiğe bağlama. Her cümlesinde bir an dur.` },
      { t: 51, text: `Bu, senin kişisel manifeston.` },
    ],
    sahne: [
      { at: 0,  mod: 'sarmal',   not: 'Tekrar eden döngüsel halkalar' },
      { at: 32, mod: 'yol',      not: 'Halkaların ortasından uzanan düz çizgi' },
    ],
    kaynak: `Hicr Sûresi 87`,
  },

  // ═══════════════════════ 20 ═══════════════════════
  {
    day: 20,
    title: `Kur'an'ın kalbi, Tevhidin özü`,
    kalan: `Tek olan, çokluğun karmaşasını bitirir.`,
    sure: 85,
    dua: {
      title: 'İhlâs Suresi',
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      okunus: 'Kul hüvellâhü ehad. Allâhüssamed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.',
      meal: 'De ki: O Allah birdir. Allah Samed\'dir (Her şey O\'na muhtaçtır, O hiçbir şeye muhtaç değildir). O doğurmamış ve doğmamıştır. Hiçbir şey O\'nun dengi değildir.',
    },
    lines: [
      { t: 0,  text: `Dört kısa cümle. Ezberlemesi en kolay, anlaması en derin sûre: İhlâs.` },
      { t: 9,  text: `Peygamber Efendimiz bu sûrenin Kur'an'ın üçte birine denk olduğunu söyler.` },
      { t: 18, text: `Çünkü içinde kural yoktur, tarih yoktur; sadece Allah vardır.` },
      { t: 26, text: `O birdir. O hiçbir şeye muhtaç değildir, her şey O'na muhtaçtır.` },
      { t: 35, text: `Dünyadaki dertlerin çoğu, muhtaç olan şeylerden medet umduğumuz için başlar.` },
      { t: 44, text: `Samed olanı andığında, diğer her şeyin acizliğini kabul etmiş olursun.` },
      { t: 53, text: `Zihin ne zaman karışsa, İhlâs ile temele dön.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Karanlıkta dört nokta' },
      { at: 26, mod: 'yaklasan', not: 'Tek bir devasa ışık merkezde belirir' },
      { at: 53, mod: 'durak',    not: 'Merkezdeki ışık sükunete erer' },
    ],
    kaynak: `Buhârî, Fedâilü'l-Kur'ân 13`,
  },

  // ═══════════════════════ 21 ═══════════════════════
  {
    day: 21,
    title: `Anlayarak durmak`,
    kalan: `Meal okumak, okuduğunu yaşamaya davettir.`,
    sure: 80,
    lines: [
      { t: 0,  text: `Kur'an'ı sadece Arapçasından okumak büyük bir sevaptır.` },
      { t: 7,  text: `Ama Rabbimiz kitabın indiliş amacını anlatırken "âyetleri üzerinde düşünsünler diye" buyurur.` },
      { t: 17, text: `Anlamadığın şey üzerine nasıl düşünebilirsin?` },
      { t: 23, text: `Bugün okuduğun sayfanın mealini de oku.` },
      { t: 28, text: `Belki orada "Rabbin seni terk etmedi" diyen bir ayetle karşılaşacaksın.` },
      { t: 36, text: `Belki "Sabredenlere müjdele" denilecek doğrudan sana.` },
      { t: 44, text: `O âyetlerin bin dört yüz yıl öncesinden gelip tam şu anki derdine değdiğini göreceksin.` },
      { t: 54, text: `Anlamak, mesafeleri sıfırlar.` },
    ],
    sahne: [
      { at: 0,  mod: 'damla',    not: 'Düşen tekil damlalar' },
      { at: 28, mod: 'kaynak',   not: 'Damlaların birleşip göllenmesi' },
    ],
    kaynak: `Sâd Sûresi 29`,
  },

  // ═══════════════════════ 22 ═══════════════════════
  {
    day: 22,
    title: `Zikrin hafifliği`,
    kalan: `Boş kalpler ağırlık yapar; anmak onu doldurur.`,
    sure: 88,
    dua: {
      title: 'Tevhid Zikri',
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      okunus: 'Lâ ilâhe illallâhü vahdehû lâ şerîke leh.',
      meal: 'Allah\'tan başka ilah yoktur; O tektir, ortağı yoktur.',
    },
    lines: [
      { t: 0,  text: `Abdest almak, kıbleye dönmek, örtünmek... Bunların hiçbiri zikir için şart değildir.` },
      { t: 9,  text: `Zikir, yani Allah'ı anmak, dinin en taşınabilir, en özgür eylemidir.` },
      { t: 18, text: `Yürürken, otobüs beklerken, hatta mutfakta iş yaparken dilin O'nu anabilir.` },
      { t: 27, text: `Kur'an çok net bir teşhis koyar: "Kalpler ancak Allah'ı anmakla huzur bulur."` },
      { t: 37, text: `İçinde taşıdığın o sebepsiz sıkıntı, bedenin değil, kalbin açlığıdır.` },
      { t: 46, text: `Bugün zihnini gereksiz şeylerle doldurmak yerine dilini zikirle meşgul et.` },
      { t: 56, text: `Göreceksin, kalbindeki o taş yerini ferahlığa bırakacak.` },
    ],
    sahne: [
      { at: 0,  mod: 'aralik',   not: 'İnce titreşimler' },
      { at: 27, mod: 'nefes',    not: 'Nefes alan geniş ışık haleleri' },
    ],
    kaynak: `Ra'd Sûresi 28`,
  },

  // ═══════════════════════ 23 ═══════════════════════
  {
    day: 23,
    title: `Ağır basan iki kelime`,
    kalan: `Dilde saniye, terazide asır sürer.`,
    sure: 82,
    dua: {
      title: 'Hafif ama Ağır Zikir',
      arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
      okunus: 'Sübhânallâhi ve bihamdihî, sübhânallâhi\'l-azîm.',
      meal: 'Allah\'ı hamdiyle tenzih ederim; yüce Allah\'ı tenzih ederim.',
    },
    lines: [
      { t: 0,  text: `Söylemesi üç saniye süren iki cümle.` },
      { t: 6,  text: `Peygamber Efendimiz onları şöyle tanımlıyor: "Dile hafif, mizanda ağır, Rahmân'a sevimli."` },
      { t: 16, text: `Bu cümleleri söylerken iki şey yaparsın.` },
      { t: 21, text: `Önce "Sübhanallah" diyerek O'nu tüm kusurlardan, zihnindeki yanlış algılardan tenzih edersin.` },
      { t: 31, text: `Sonra "ve bihamdihi" diyerek O'na teşekkür edersin.` },
      { t: 38, text: `Bu bir denge hâlidir. Kusursuz olanı bilmek ve ona sığınmak.` },
      { t: 47, text: `Bugün bu iki cümleyi dudaklarından eksik etme. Terazi bekliyor.` },
    ],
    sahne: [
      { at: 0,  mod: 'terazi',   not: 'İki hafif ışık topu' },
      { at: 16, mod: 'agirlik',  not: 'Terazinin ağır basması' },
      { at: 38, mod: 'sakin',    not: 'Dengede altın parlaklık' },
    ],
    kaynak: `Buhârî, Deavât 65`,
  },

  // ═══════════════════════ 24 ═══════════════════════
  {
    day: 24,
    title: `Düğümleri çözen nefes`,
    kalan: `İstiğfar, kapalı kapıların paslı kilidini açar.`,
    sure: 84,
    dua: {
      title: 'Kısa İstiğfar',
      arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
      okunus: 'Estağfirullâhe ve etûbü ileyh.',
      meal: 'Allah\'tan bağışlanma diler ve O\'na yönelirim.',
    },
    lines: [
      { t: 0,  text: `Hayatında işlerin ters gittiği, kapıların yüzüne kapandığı dönemler olur.` },
      { t: 8,  text: `Çözüm ararsın ama bulamazsın. Sanki görünmez bir düğüm vardır.` },
      { t: 16, text: `Alimler der ki: günahlar hayatta düğümler oluşturur; istiğfar ise o düğümleri çözer.` },
      { t: 26, text: `Nûh aleyhisselâm kavmine şöyle demiştir: "Rabbinizden bağışlanma dileyin ki size gökten bol yağmur göndersin, mallarınızı çoğaltsın."` },
      { t: 39, text: `Yani "Estağfirullah" demek, sadece ahiret için bir hazırlık değil, dünya sıkıntıları için de bir anahtardır.` },
      { t: 50, text: `Tıkanıklık hissettiğinde nefesini istiğfarla al. Göğsün genişleyecektir.` },
    ],
    sahne: [
      { at: 0,  mod: 'catlak',   not: 'Karışık ve düğümlü hatlar' },
      { at: 26, mod: 'sizinti',  not: 'Düğümlerin çözülmesi' },
      { at: 39, mod: 'aralanma', not: 'Temiz, genişleyen yol' },
    ],
    kaynak: `Nûh Sûresi 10-12`,
  },

  // ═══════════════════════ 25 ═══════════════════════
  {
    day: 25,
    title: `O'na salât etmek`,
    kalan: `Sevgi, andıkça büyüyen bir köktür.`,
    sure: 85,
    dua: {
      title: 'Kısa Salavât',
      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
      okunus: 'Allâhümme salli alâ Muhammedin ve alâ âli Muhammed.',
      meal: 'Allah\'ım! Muhammed\'e ve Muhammed\'in ailesine rahmet et.',
    },
    lines: [
      { t: 0,  text: `İbadetlerin içinde benzersiz olan bir tanesi vardır.` },
      { t: 6,  text: `Namaz kılarsın, Allah kılmaz. Oruç tutarsın, Allah tutmaz.` },
      { t: 14, text: `Ama salavât öyle değildir. Kur'an der ki: "Allah ve melekleri Peygamber'e salât eder. Siz de ona salât edin."` },
      { t: 26, text: `Bu, senin, meleklerin ve bizzat Yaratıcının aynı anda yaptığı tek eylemdir.` },
      { t: 35, text: `Peygamber Efendimiz "Bana bir kez salavât getirene Allah on rahmet eder" der.` },
      { t: 45, text: `Duanın kabul olmasını istiyorsan, duanı iki salavât arasına gizle.` },
      { t: 53, text: `Reddedilmeyen bir şeyin yanına konan dilek de reddedilmez.` },
    ],
    sahne: [
      { at: 0,  mod: 'yaklasan', not: 'Yukarıdan inen altın zerrecikler' },
      { at: 26, mod: 'sarilma',  not: 'Zerrelerin birbirine kenetlenmesi' },
      { at: 45, mod: 'altin',    not: 'Yoğun, sıcak altın parıltı' },
    ],
    kaynak: `Ahzâb Sûresi 56`,
  },

  // ═══════════════════════ 26 ═══════════════════════
  {
    day: 26,
    title: `Bağ Kuruldu`,
    kalan: `İbadet seccadede biter, ahlâk kapıdan çıkınca başlar.`,
    sure: 86,
    lines: [
      { t: 0,  text: `Yirmi altı gün. Temeli attın ve bağı kurdun.` },
      { t: 7,  text: `Şimdi namazın, Kur'an'ın, zikrin senin içinde bir yeri var.` },
      { t: 15, text: `Ama bu yolculuğun en çetin kısmı şimdi başlıyor.` },
      { t: 22, text: `Çünkü ibadetin gerçek sınavı yalnızken değil, insanların arasındayken verilir.` },
      { t: 30, text: `Dinin amacı seni sadece ibadet eden biri yapmak değil, güzel ahlaklı biri yapmaktır.` },
      { t: 39, text: `Peygamber Efendimiz "Sizin en hayırlınız ahlâkı en güzel olanınızdır" buyurur.` },
      { t: 49, text: `Yarın dördüncü evreye geçiyoruz: Ahlâk.` },
      { t: 55, text: `Kazandığın bu bağı dışarıya taşıma vakti.` },
    ],
    sahne: [
      { at: 0,  mod: 'zincir',   not: 'Uzun bir zincirin tamamlanması' },
      { at: 30, mod: 'genisleme',not: 'Zincirin etrafa yaydığı ışık dalgaları' },
      { at: 49, mod: 'durak',    not: 'Sonraki kapının aydınlanması' },
    ],
    kaynak: `Buhârî, Menâkıb 23`,
  },
  // ═══════════════════════ 27 ═══════════════════════
  {
    day: 27,
    title: `Dışarı Taşan Nur`,
    kalan: `Kılınan namaz, kapıdan çıktıktan sonra belli olur.`,
    sure: 85,
    dua: {
      title: 'Kalp Temizliği',
      arabic: 'اللَّهُمَّ طَهِّرْ قَلْبِي مِنَ النِّفَاقِ وَعَمَلِي مِنَ الرِّيَاءِ',
      okunus: 'Allâhümme tahhir kalbî minen-nifâk ve amelî miner-riyâ.',
      meal: 'Allah\'ım! Kalbimi nifaktan, amelimi riyadan temizle.',
    },
    lines: [
      { t: 0,  text: `Kur'an namazı bir kurallar bütünü olarak değil, bir sonuç olarak tarif eder.` },
      { t: 8,  text: `"Şüphesiz namaz, insanı hayâsızlıktan ve kötülükten alıkoyar" der.` },
      { t: 16, text: `Eğer kıldığın namaz, dilindeki yalanı, elindeki haksızlığı durdurmuyorsa ortada bir sorun vardır.` },
      { t: 26, text: `Klasik bir teşhis vardır: "Namazın seni kötülükten alıkoymuyorsa, namazına bak."` },
      { t: 34, text: `Bu bir suçlama değil, ince bir ayar davetidir.` },
      { t: 41, text: `İbadetin gerçek sağlaması seccadede değil, seccadeden kalktıktan sonra insanlarla aranda olandır.` },
      { t: 51, text: `Bugün kıldığın namazın yüzüne yansıyan o aydınlığını dışarı taşı.` },
    ],
    sahne: [
      { at: 0,  mod: 'aralik',   not: 'İçeriden dışarı sızan ince ışık' },
      { at: 26, mod: 'sizinti',  not: 'Işığın yüzeylere yayılması' },
      { at: 41, mod: 'sarilma',  not: 'Işığın dışarıyı tamamen sarması' },
    ],
    kaynak: `Ankebût Sûresi 45`,
  },

  // ═══════════════════════ 28 ═══════════════════════
  {
    day: 28,
    title: `Sözün Ağırlığı`,
    kalan: `En çok günahı en küçük organ işler.`,
    sure: 83,
    dua: {
      title: 'Dili Koruma',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ سَمْعِي وَمِنْ شَرِّ بَصَرِي وَمِنْ شَرِّ لِسَانِي',
      okunus: 'Allâhümme innî eûzü bike min şerri sem\'î ve min şerri basarî ve min şerri lisânî.',
      meal: 'Allah\'ım! Kulağımın, gözümün ve dilimin şerrinden sana sığınırım.',
    },
    lines: [
      { t: 0,  text: `İnsan kendi söylediği sözün ağırlığını çoğu zaman fark etmez.` },
      { t: 7,  text: `Bir şaka, küçük bir dedikodu, "ben olanı söylüyorum" diyerek atılan bir ok.` },
      { t: 15, text: `Peygamber Efendimiz kuralı çok net koymuştur: "Allah'a ve âhiret gününe iman eden ya hayır söylesin ya sussun."` },
      { t: 27, text: `Üçüncü bir seçenek yok. Orta yol yok.` },
      { t: 33, text: `Çünkü söz, çıktığı anda başkasının kalbinde kalıcı bir yara veya kalıcı bir ferahlık bırakır.` },
      { t: 43, text: `Namaz kılan birinin dili, kıldığı namazın en büyük şahididir.` },
      { t: 51, text: `Bugün sadece bir kez, söyleyeceğin o gereksiz lafı yut ve susmayı seç.` },
    ],
    sahne: [
      { at: 0,  mod: 'damla',    not: 'Keskin damlalar düşer' },
      { at: 15, mod: 'terazi',   not: 'Sözün ağırlığının ölçülmesi' },
      { at: 51, mod: 'sakin',    not: 'Terazinin dengeye gelmesi' },
    ],
    kaynak: `Buhârî, Rikāk 23`,
  },

  // ═══════════════════════ 29 ═══════════════════════
  {
    day: 29,
    title: `Kapıdaki Sınav`,
    kalan: `İbadetin en sessizi ve en ağırı anne babadır.`,
    sure: 85,
    dua: {
      title: 'Anne Baba İçin Dua',
      arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      okunus: 'Rabbirhamhümâ kemâ rabbeyânî sağıyrâ.',
      meal: 'Rabbim! Onlar beni küçükken nasıl yetiştirdilerse sen de onlara öyle merhamet et.',
    },
    lines: [
      { t: 0,  text: `Kur'an'da Allah'a kulluk emrinin hemen yanında, hiç sekmeden "anne babaya iyilik" emri gelir.` },
      { t: 10, text: `Bu tesadüf değildir. İnsanın O'na olan minneti, varlık sebebine olan minnetinden başlar.` },
      { t: 20, text: `Kur'an sınırı çok ince çizer: onlara "öf" bile deme.` },
      { t: 27, text: `Öfke demiyor, hakaret demiyor. Sadece küçük bir bıkkınlık belirtisi olan "öf" kelimesi.` },
      { t: 37, text: `Kıldığın namazların kabul olmasını istiyorsan, o kapıdan aldığın duaya bakacaksın.` },
      { t: 46, text: `Eğer hayattalarsa bugün onları bir kez ara. Değillerse bugün okuduğun sureleri onlara bağışla.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Karanlık ve sessizlik' },
      { at: 20, mod: 'aralik',   not: 'Küçük bir ışık kapısı' },
      { at: 46, mod: 'genisleme',not: 'Kapının tamamen açılması' },
    ],
    kaynak: `İsrâ Sûresi 23-24`,
  },

  // ═══════════════════════ 30 ═══════════════════════
  {
    day: 30,
    title: `Yanındaki Hakkı`,
    kalan: `Komşu, imanın en yakındaki sınavıdır.`,
    sure: 84,
    dua: {
      title: 'Hayırlı Son',
      arabic: 'اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الْأُمُورِ كُلِّهَا',
      okunus: 'Allâhümme ahsin âkıbetenâ fil-umûri küllihâ.',
      meal: 'Allah\'ım! Bütün işlerimizin sonunu hayırlı eyle.',
    },
    lines: [
      { t: 0,  text: `Peygamber Efendimiz "Cebrail bana komşu hakkını o kadar çok tavsiye etti ki" der,` },
      { t: 9,  text: `"neredeyse komşuyu komşuya mirasçı kılacak sandım."` },
      { t: 16, text: `Bugün apartmanlarda, koca binalarda kimsenin kimseyi tanımadığı bir çağda yaşıyoruz.` },
      { t: 25, text: `Ama dinin ölçüsü binanın büyüklüğüne göre değişmiyor.` },
      { t: 31, text: `Komşu hakkı önce zarar vermemekle başlar; sesinle, çöpünle, kayıtsızlığınla.` },
      { t: 40, text: `İbadet insanı toplumdan koparıp yalnızlaştırmaz, aksine yanındakiyle ilişkisini onarır.` },
      { t: 50, text: `Bugün karşılaştığın bir komşuna sadece samimi bir selam ver. Bu, kıldığın sünnet kadar kıymetlidir.` },
    ],
    sahne: [
      { at: 0,  mod: 'zincir',   not: 'Kopuk noktalar' },
      { at: 16, mod: 'yaklasan', not: 'Noktaların birbirine yaklaşması' },
      { at: 50, mod: 'butun',    not: 'Halkaların altın bağlarla örülmesi' },
    ],
    kaynak: `Buhârî, Edeb 28`,
  },

  // ═══════════════════════ 31 ═══════════════════════
  {
    day: 31,
    title: `Sessiz Engel`,
    kalan: `Haram lokma, kabul edilecek duanın önündeki görünmez duvardır.`,
    sure: 86,
    dua: {
      title: 'Helal Rızık Talebi',
      arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
      okunus: 'Allâhümmekfinî bi-halâlike an harâmik, ve ağninî bi-fadlike ammen sivâk.',
      meal: 'Allah\'ım! Helâlinle yetindirip haramına muhtaç etme; lütfunla senden başkasına muhtaç bırakma.',
    },
    lines: [
      { t: 0,  text: `Bir adam düşün. Uzun yoldan gelmiş, toza toprağa bulanmış.` },
      { t: 7,  text: `Ellerini göğe açıp "Yâ Rab, yâ Rab" diye yalvarıyor.` },
      { t: 14, text: `Peygamber Efendimiz bu adamı anlattıktan sonra şunu sorar: "Yediği haram, içtiği haram, giydiği haram iken duası nasıl kabul edilsin?"` },
      { t: 27, text: `Kazanç, ibadetin en sert testlerinden biridir.` },
      { t: 33, text: `Kul hakkı, faiz, adaletsiz kazanç, terazide hile... Bunlar seccadede affedilen günahlar değildir.` },
      { t: 44, text: `Eğer duanın göğe yükselmesini istiyorsan, midene inene dikkat et.` },
      { t: 52, text: `Bugün gelirini gözden geçir. Şüpheli gördüğün bir şey varsa, onu hayatından çıkarmaya niyet et.` },
    ],
    sahne: [
      { at: 0,  mod: 'catlak',   not: 'Karanlık yüzeyde tıkanıklık' },
      { at: 27, mod: 'sizinti',  not: 'Helal kazancı simgeleyen saf su damlası' },
      { at: 52, mod: 'kaynak',   not: 'Suyun berraklaşması' },
    ],
    kaynak: `Müslim, Zekât 65`,
  },

  // ═══════════════════════ 32 ═══════════════════════
  {
    day: 32,
    title: `Gerçek Pehlivanlık`,
    kalan: `Öfke, aklın kapıdan çıkıp gittiği andır.`,
    sure: 83,
    dua: {
      title: 'Öfkeden Sığınma',
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      okunus: 'Eûzü billâhi mineş-şeytânir-racîm.',
      meal: 'Kovulmuş şeytandan Allah\'a sığınırım.',
    },
    lines: [
      { t: 0,  text: `Bir adam Peygamber Efendimize gelip "Bana tavsiyede bulun" dedi.` },
      { t: 8,  text: `"Öfkelenme" cevabını aldı. Adam üç kez sordu, üçünde de aynı cevabı aldı.` },
      { t: 17, text: `Çünkü öfke tek bir duygu değildir, bir kapıdır. O kapı açıldığında dil kırar, el vurur, bağlar kopar.` },
      { t: 28, text: `Güçlü insan başkalarını deviren değil, öfke anında kendine hakim olan insandır.` },
      { t: 37, text: `İbadet insanı sakinleştirmelidir. Ateş topuna çevirmemelidir.` },
      { t: 45, text: `Bugün sinirlendiğin ilk anda tepki vermeden önce üç saniye bekle.` },
      { t: 53, text: `O üç saniye, seni sonradan edeceğin yüzlerce tövbeden kurtaracaktır.` },
    ],
    sahne: [
      { at: 0,  mod: 'ritim',    not: 'Hızlı, düzensiz kalp atışı' },
      { at: 28, mod: 'sakin',    not: 'Işığın ve atımın yavaşlaması' },
      { at: 53, mod: 'durak',    not: 'Sessiz ve serin bir denge' },
    ],
    kaynak: `Buhârî, Edeb 76`,
  },

  // ═══════════════════════ 33 ═══════════════════════
  {
    day: 33,
    title: `Yükü Bırakmak`,
    kalan: `Sana yapılanı bırakmak, sana yapılacak merhamet içindir.`,
    sure: 85,
    dua: {
      title: 'Affedilme İstediği',
      arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      okunus: 'Allâhümme inneke afüvvün tuhibbül-afve fa\'fü annî.',
      meal: 'Allah\'ım! Sen çok affedicisin, affetmeyi seversin; beni de affet.',
    },
    lines: [
      { t: 0,  text: `İçinde başkalarına karşı tuttuğun o kin, o geçmek bilmeyen kızgınlık...` },
      { t: 8,  text: `Biliyor musun, o sadece seni yoruyor.` },
      { t: 14, text: `Kur'an'da çok sarsıcı bir ayet vardır: "Bağışlasınlar, hoş görsünler. Allah'ın sizi bağışlamasını sevmez misiniz?"` },
      { t: 26, text: `Sen kendi hataların için sürekli "Rabbim beni affet" diyorsun.` },
      { t: 33, text: `Peki sen başkasını affetmezken, O'nun seni affetmesini nasıl bekliyorsun?` },
      { t: 41, text: `Affetmek o kişinin haklı olduğunu kabul etmek değildir; o hesabı Allah'a bırakıp kendi yükünü hafifletmektir.` },
      { t: 52, text: `Bugün içinde tuttuğun bir kırgınlığı serbest bırak. "Ona değil, Sana bıraktım" de.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Koyu, ağır bir sis' },
      { at: 26, mod: 'aralanma', not: 'Sisin dağılması' },
      { at: 52, mod: 'altin',    not: 'Altın renkli bir ferahlama hissi' },
    ],
    kaynak: `Nûr Sûresi 22`,
  },

  // ═══════════════════════ 34 ═══════════════════════
  {
    day: 34,
    title: `Sessiz İyilik`,
    kalan: `Gülümsemen bile teraziye konur.`,
    sure: 85,
    dua: {
      title: 'Verme Niyeti',
      arabic: 'اللَّهُمَّ اجْعَلْنِي مِنَ الْمُنْفِقِينَ فِي سَبِيلِكَ',
      okunus: 'Allâhümmec\'alnî minel-münfikıyne fî sebîlik.',
      meal: 'Allah\'ım! Beni yolunda infak edenlerden (verenlerden) eyle.',
    },
    lines: [
      { t: 0,  text: `Sadaka denince hepimizin aklına para gelir.` },
      { t: 6,  text: `Cebinde olmayan şeyin sadakasını veremeyeceğini düşünürsün.` },
      { t: 13, text: `Oysa Peygamber Efendimiz "Kardeşinin yüzüne gülümsemen senin için bir sadakadır" buyurur.` },
      { t: 24, text: `İyiliği emretmen, yoldan bir taşı kenara çekmen, susamış birine su vermen... Bunların hepsi sadakadır.` },
      { t: 35, text: `İslam sokağı, hayatı ve insanı güzelleştiren her küçük adımı ibadet sayar.` },
      { t: 43, text: `Dördüncü evre, yani ahlak evresi bugün bitiyor.` },
      { t: 49, text: `Şimdi inandığın bu dini insanlara güzel göster. En küçük, en sessiz iyiliğinle.` },
    ],
    sahne: [
      { at: 0,  mod: 'damla',    not: 'Küçük bir ışıltı düşer' },
      { at: 24, mod: 'genisleme',not: 'Işıltının halkalar halinde büyümesi' },
      { at: 49, mod: 'sarilma',  not: 'Tüm yüzeyin sıcak bir parıltıyla kaplanması' },
    ],
    kaynak: `Tirmizî, Birr 36`,
  },

  // ═══════════════════════ 35 ═══════════════════════
  {
    day: 35,
    title: `Yeniden Düşersen`,
    kalan: `Yolun kırılma noktası düşmek değil, kalkmamaktır.`,
    sure: 88,
    dua: {
      title: 'Yardım İsteme',
      arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
      okunus: 'Yâ Hayyü yâ Kayyûm! Bi-rahmetike esteğîs.',
      meal: 'Ey diri ve her şeyi ayakta tutan! Rahmetinle senden yardım diliyorum.',
    },
    lines: [
      { t: 0,  text: `Otuz beş gün oldu. Şimdi sana dürüstçe bir gerçeği söyleyeceğiz.` },
      { t: 8,  text: `Bir gün bu yolu yine aksatacaksın. Namazlar yine ağır gelecek, Kur'an'ın kapağı günlerce açılmayacak.` },
      { t: 19, text: `Bunu şimdi söylüyoruz ki, o gün geldiğinde her şey bitti sanıp tamamen bırakmayasın.` },
      { t: 28, text: `Peygamber Efendimiz "Her âdemoğlu hata eder; hata edenlerin en hayırlısı tövbe edenlerdir" der.` },
      { t: 39, text: `Hata senin doğanda var. İmtihan hiç düşmemekte değil, düştükten sonra nerede duracağında.` },
      { t: 49, text: `Düştüğünde tek bir şey yap: utanmadan, hesaplaşmadan kaldığın yerden seccadene geri dön.` },
      { t: 59, text: `Seni her defasında kabul edecek biri var.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Kapanan ışık' },
      { at: 28, mod: 'catlak',   not: 'Yüzeyde beliren kırık' },
      { at: 49, mod: 'butun',    not: 'Kırığın ışıkla onarılması' },
    ],
    kaynak: `Tirmizî, Kıyâme 49`,
  },

  // ═══════════════════════ 36 ═══════════════════════
  {
    day: 36,
    title: `Gecenin Sırrı`,
    kalan: `Sessizlikte açılan eller boş dönmez.`,
    sure: 87,
    dua: {
      title: 'Gece Nur Duası',
      arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
      okunus: 'Allâhümme lekel-hamd, ente nûrus-semâvâti vel-ard.',
      meal: 'Allah\'ım! Hamd sana mahsustur; sen göklerin ve yerin nurusun.',
    },
    lines: [
      { t: 0,  text: `Farz olan beş vakit namaz, dinin taşıyıcı sütunlarıdır.` },
      { t: 7,  text: `Ama bir de kimsenin görmediği, kimsenin bilmediği o iki rekat vardır: Gece namazı.` },
      { t: 16, text: `Şehir uyurken, ev sessizken, tamamen O'nunla baş başa kaldığın an.` },
      { t: 24, text: `Riya yoktur, gösteriş yoktur. İhlasın, samimiyetin en saf halidir.` },
      { t: 32, text: `Uykudan saatlerce çalman gerekmez. Yatağa girmeden önce, sessizlikte kılınan iki rekat bile buna dahildir.` },
      { t: 43, text: `Göreceksin, gündüz kıldığın hiçbir namazın tadı, o geceki ıssızlığın tadına benzemeyecek.` },
      { t: 53, text: `Gecenin karanlığını kalbinin ışığıyla del.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Koyu lacivert atmosfer' },
      { at: 24, mod: 'nefes',    not: 'Karanlıkta soluk alan tek bir ışık' },
      { at: 43, mod: 'yaklasan', not: 'Işığın büyüyüp etrafı aydınlatması' },
    ],
    kaynak: `İsrâ Sûresi 79`,
  },

  // ═══════════════════════ 37 ═══════════════════════
  {
    day: 37,
    title: `Haftanın Çapası`,
    kalan: `Cuma, dağılan altı günü toplayan bir düğümdür.`,
    sure: 85,
    dua: {
      title: 'Cuma Salavâtı',
      arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
      okunus: 'Allâhümme salli ve sellim alâ nebiyyinâ Muhammed.',
      meal: 'Allah\'ım! Peygamberimiz Muhammed\'e salât ve selam eyle.',
    },
    lines: [
      { t: 0,  text: `Hayatın telaşı içinde altı gün boyunca dünyayla savruluruz.` },
      { t: 7,  text: `Cuma günü ise bir duraktır. Kur'an, cuma ezanı okunduğunda her şeyin bırakılıp toplanılmasını emreder.` },
      { t: 18, text: `Bu sadece fiziki bir toplanma değildir; ruhen yeryüzündeki tüm müminlerle aynı safta hizalanmaktır.` },
      { t: 28, text: `O gün alınan abdest, giyilen temiz elbise, erkenden atılan adım.` },
      { t: 36, text: `Hepsi "Ben buradayım, yolumu unutmadım" demenin bedensel halidir.` },
      { t: 44, text: `Hafta boyunca adımların ne kadar tökezlemiş olursa olsun, cuma günü yeniden hizalanırsın.` },
      { t: 54, text: `O çapanın seni tutmasına izin ver.` },
    ],
    sahne: [
      { at: 0,  mod: 'zincir',   not: 'Halkaların bir araya gelmesi' },
      { at: 28, mod: 'sarmal',   not: 'Dairesel bir çekim merkezi' },
      { at: 44, mod: 'durak',    not: 'Merkezde toplanan güçlü nur' },
    ],
    kaynak: `Cum'a Sûresi 9`,
  },

  // ═══════════════════════ 38 ═══════════════════════
  {
    day: 38,
    title: `Tek Başına Yürünmez`,
    kalan: `Birlikte atılan adım, yalnızlıktaki savrulmayı engeller.`,
    sure: 85,
    dua: {
      title: 'Salihlerin Dostluğu',
      arabic: 'اللَّهُمَّ ارْزُقْنِي صُحْبَةَ الصَّالِحِينَ',
      okunus: 'Allâhümmerzükni suhbetes-sâlihîn.',
      meal: 'Allah\'ım! Bana sâlihlerin (iyi insanların) arkadaşlığını nasip et.',
    },
    lines: [
      { t: 0,  text: `Manevi yolda tek başına yürümek, rüzgarlı bir havada tek başına ateş yakmaya benzer.` },
      { t: 10, text: `Sürekli söner, sürekli yeniden yakmak zorunda kalırsın.` },
      { t: 16, text: `Kur'an, Peygamberimize bile "sabah akşam Rabbine dua edenlerle beraber sabret" der.` },
      { t: 27, text: `Geri dönenlerin en büyük hatası bu yolu yapayalnız, kimseye bahsetmeden yürümeye çalışmaktır.` },
      { t: 36, text: `Düşersen kimse fark etmez. Tökezlersen kimse elinden tutmaz.` },
      { t: 43, text: `Sana ne yaptığını soracak, sormasa da varlığıyla sana hedefi hatırlatacak en az bir yol arkadaşın olmalı.` },
      { t: 54, text: `Yol, yoldaşla yürünür.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Karanlıkta yalnız bir ışık' },
      { at: 27, mod: 'yaklasan', not: 'Yanına yaklaşan ikinci bir ışık' },
      { at: 43, mod: 'sarmal',   not: 'İki ışığın birbirini destekleyerek dönmesi' },
    ],
    kaynak: `Kehf Sûresi 28`,
  },

  // ═══════════════════════ 39 ═══════════════════════
  {
    day: 39,
    title: `Son Adıma Doğru`,
    kalan: `Karar verdiğinde artık güvenip yola çık.`,
    sure: 82,
    dua: {
      title: 'Kararlılık',
      arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ',
      okunus: 'Allâhümme innî estehıyruke bi-ilmik, ve estakdiruke bi-kudretik.',
      meal: 'Allah\'ım! Senin ilminle hayırlısını ister, kudretinle güç dilerim.',
    },
    lines: [
      { t: 0,  text: `Kırkıncı güne bir adım kaldı.` },
      { t: 4,  text: `Bu müfredatın sonuna geliyorsun.` },
      { t: 9,  text: `Geriye dönüp baktığında nelerin oturduğunu, nelerin hala zor geldiğini görüyorsun.` },
      { t: 17, text: `Artık sana dışarıdan birilerinin "şunu yap, bunu yapma" demesine ihtiyacın kalmadı.` },
      { t: 26, text: `Kendi dengeni bulmaya başladın.` },
      { t: 32, text: `Kur'an der ki: "İşinde kararlı olduğunda artık Allah'a güvenip dayan."` },
      { t: 41, text: `Bugün kendine bir söz ver. Hangi alışkanlığı bırakmayacaksın?` },
      { t: 48, text: `Bir tane olsun, ama senin olsun.` },
    ],
    sahne: [
      { at: 0,  mod: 'gerive',   not: 'Geçmiş günlerin küçük ışıkları' },
      { at: 17, mod: 'zincir',   not: 'Işıkların hizalanması' },
      { at: 32, mod: 'yol',      not: 'İleriye doğru uzanan düz ışık yolu' },
    ],
    kaynak: `Âl-i İmrân Sûresi 159`,
  },

  // ═══════════════════════ 40 ═══════════════════════
  {
    day: 40,
    title: `Yol Artık Senin`,
    kalan: `Sır çözüldü. Bu, bir son değil, gerçek başlangıçtır.`,
    sure: 90,
    dua: {
      title: 'Yolda Sabit Kalma',
      arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
      okunus: 'Yâ mükallibel-kulûb! Sebbit kalbî alâ dînike.',
      meal: 'Ey kalpleri evirip çeviren! Kalbimi dinin üzere sabit kıl.',
    },
    lines: [
      { t: 0,  text: `Kırk gün önce utançla, "acaba tekrar kabul edilir miyim" korkusuyla bir kapı çaldın.` },
      { t: 10, text: `Kırk gün boyunca sabrettin, düştün, kalktın, bir sayfa okudun, bir rekat kıldın.` },
      { t: 20, text: `Şimdi, Kırkıncı Sırrın tamamlanma vakti.` },
      { t: 26, text: `Sır şuydu: Sen bir adım attın, O sana koşarak geldi.` },
      { t: 34, text: `Aslında bu yolu yalnız yürüyen sen değildin. İçindeki o dönme isteği de, adımlarını sağlamlaştıran da O'ydu.` },
      { t: 46, text: `Geri Dönüş Odası'ndaki misafirliğin bitti.` },
      { t: 52, text: `Yol artık senin. Yarın uyandığında, içindeki o Nur ile kendi başına, ama asla yalnız olmadan yürüyeceksin.` },
      { t: 64, text: `Kapı kapandı sanma. Aksine, sen artık evin içindesin.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Karanlık' },
      { at: 20, mod: 'aralanma', not: 'Büyük ve görkemli bir ışık huzmesi' },
      { at: 34, mod: 'genisleme',not: 'Işığın tüm ekranı kaplaması' },
      { at: 52, mod: 'butun',    not: 'Kuşatıcı, sakin, altın bir nur' },
    ],
    kaynak: `Ankebût Sûresi 69`,
  },
];

// ─── Kırkıncı Sır ───
//
// Kırk perdenin sonunda tek bir cümle var. O cümle baştan gösterilmez;
// her bölüm bittiğinde bir parçası açılır. Kırkıncı günde tamamlanır.
//
// Bu bir oyun mekaniği değil — anlatının kendisi. Tasavvufta "sonuna
// varmadan söylenmeyen söz" vardır; burada aynı şey yapılıyor.
export const SIR_PARCALARI = [
  { faz: 'kapi',  gun: 7,  metin: `Sen bir adım attın;` },
  { faz: 'temel', gun: 16, metin: `O sana` },
  { faz: 'bag',   gun: 26, metin: `koşarak` },
  { faz: 'ahlak', gun: 34, metin: `geldi.` },
];

export const SIR_TAM = {
  metin: `Sen bir adım attın; O sana koşarak geldi.`,
  aciklama: `Bu cümle bize ait değil. Kudsî bir hadiste geçen şu ifadenin sadeleştirilmiş hâli: "Kulum bana bir karış yaklaşırsa ben ona bir arşın yaklaşırım; bana yürüyerek gelirse ben ona koşarak gelirim." Kırk gün boyunca anlattığımız her şey aslında bu tek cümlenin açıklamasıydı.`,
  kaynak: `Buhârî, Tevhîd 50; Müslim, Zikir 1`,
};

// ─── Yardımcılar ───


const OVERLAYS = { en: EN };

function localize(base, lang) {
  if (!base || !lang || lang === 'tr') return base;
  const ov = (OVERLAYS[lang] || OVERLAYS.en || {})[base.day];
  if (!ov) return base;
  return {
    ...base,
    title: ov.title || base.title,
    kalan: ov.kalan || base.kalan,
    kaynak: ov.kaynak || base.kaynak,
    lines: Array.isArray(ov.lines) && ov.lines.length === base.lines.length
      ? base.lines.map((l, i) => ({ ...l, text: ov.lines[i] }))
      : base.lines,
  };
}

/** Belirli bir günün perdesi. Henüz yazılmamışsa null döner. */
export function getPerde(day, lang = 'tr') {
  const base = PERDELER.find(p => p.day === day);
  return base ? localize(base, lang) : null;
}

/** Perdesi yazılmış günler. */
export function perdeliGunler() {
  return PERDELER.map(p => p.day);
}

/** Şu ana kadar açılmış sır parçaları (okunan ders sayısına göre). */
export function acikSirParcalari(gun) {
  return SIR_PARCALARI.filter(s => gun >= s.gun);
}

export default PERDELER;
