// frontend/src/data/donusTemeller.js
// 🧱 TEMELLER — "Müslüman nasıl yaşar?" başlangıç kılavuzu
//
// Kırk günlük müfredat bir YOL'dur: gün gün ilerler. Bu bölüm ise bir
// BAŞVURU rafıdır: her an açılır, sırası yoktur. Uzun ara vermiş biri
// çoğu zaman "namaz kaç rekât", "abdest nasıl alınır", "Sübhaneke neydi"
// gibi şeyleri sormaya utanır. Bu raf o utancı ortadan kaldırmak için var.
//
// TON: öğretici, kısa, yargısız. "Bilmiyor olman normal" varsayımıyla yazıldı.
//
// USUL NOTU: Rekât sayıları ve sıralama Hanefî mezhebindeki yaygın
// uygulamaya göredir; diğer mezheplerde ayrıntılar farklılık gösterebilir.
// Ayet mealleri özgün ifadeyle, kaynaklı verilmiştir.

export const TEMELLER = [
  // ─────────────────────────── İMAN ───────────────────────────
  {
    id: 'iman', color: 'iman', icon: '🌟', minutes: 4,
    title: `İman Esasları`,
    lead: `Neye inandığımız — altı madde`,
    intro: `İslam'ın inanç tarafı altı başlıkta toplanır. Bunlar ezberlenecek bir liste değil, dünyaya bakışını belirleyen bir çerçevedir. Hepsini bir anda hazmetmen gerekmiyor; okudukça yerine oturur.`,
    items: [
      { title: `1 · Allah'a iman`,
        body: `Tek, eşi ve benzeri olmayan, her şeyi bilen ve her şeye gücü yeten bir yaratıcıya inanmak. İslam'ın merkezinde bu vardır: "De ki: O Allah birdir." (İhlâs 1)` },
      { title: `2 · Meleklere iman`,
        body: `Gözle görülmeyen, Allah'ın emriyle görev yapan nurdan varlıklar. İnsan gibi seçim yapmaz, isyan etmezler.` },
      { title: `3 · Kitaplara iman`,
        body: `Allah'ın peygamberlerine gönderdiği kitaplar: Tevrat, Zebur, İncil ve son kitap Kur'an. Kur'an, öncekileri tasdik eden ve korunmuş olandır.` },
      { title: `4 · Peygamberlere iman`,
        body: `Hz. Âdem'den Hz. Muhammed'e (s.a.v.) kadar gönderilen bütün elçilere inanmak. Hiçbirini ayırmayız; son peygamber Hz. Muhammed'dir.` },
      { title: `5 · Âhirete iman`,
        body: `Ölümün son olmadığına, hesabın ve devamlı bir hayatın olduğuna inanmak. Bu inanç, hayatı ciddiye almanın temelidir.` },
      { title: `6 · Kadere iman`,
        body: `Her şeyin Allah'ın bilgisi ve takdiri dâhilinde olduğuna inanmak. Bu, insanın iradesini ve sorumluluğunu ortadan kaldırmaz; ikisi birlikte durur.` },
    ],
    note: `Kaynak çerçevesi: Bakara 285 ve Cibrîl hadisi (Buhârî, Îmân 37; Müslim, Îmân 1).`,
  },

  // ────────────────────────── ŞARTLAR ──────────────────────────
  {
    id: 'sart', color: 'sart', icon: '🕋', minutes: 4,
    title: `İslam'ın Şartları`,
    lead: `Beş temel — yapılan taraf`,
    intro: `İman kalbin işiyse, bu beş madde hayatın işidir. Hepsini bugün yapamıyor olman seni dışarıda bırakmaz; İslam bir kapıdır, içeride yürünür.`,
    items: [
      { title: `1 · Kelime-i şehadet`,
        body: `"Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve resûlüh." — Allah'tan başka ilah olmadığına, Muhammed'in O'nun kulu ve elçisi olduğuna şahitlik ederim.`,
        ar: `أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ` },
      { title: `2 · Namaz`,
        body: `Günde beş vakit. İslam'ın direği sayılır çünkü günü baştan sona bağlar. Bir vakitle başlamak da başlamaktır.` },
      { title: `3 · Oruç`,
        body: `Ramazan ayında, imsaktan iftara kadar yemekten, içmekten ve eşiyle beraberlikten uzak durmak. Sağlık engeli olanın hükmü ayrıdır.` },
      { title: `4 · Zekât`,
        body: `Belirli bir ölçünün (nisap) üzerinde bir yıl elde kalan mal varlığından kırkta bir vermek. Zenginin fakire borcu olarak görülür, bir lütuf olarak değil.` },
      { title: `5 · Hac`,
        body: `Gücü yeten kişinin ömründe bir kez Kâbe'yi ziyaret etmesi. Şartı yoksa sorumluluğu da yoktur.` },
    ],
    note: `Cibrîl hadisi: Buhârî, Îmân 37; Müslim, Îmân 1.`,
  },

  // ────────────────────────── ABDEST ──────────────────────────
  {
    id: 'abdest', color: 'abdest', icon: '💧', minutes: 5,
    title: `Abdest Nasıl Alınır`,
    lead: `Adım adım — iki dakikalık iş`,
    intro: `Namazdan önce alınır. Sıra önemlidir ama telaş gerekmez; unutursan baştan alırsın, kimse seni ölçmüyor. Her uzuv birer kez yıkanır, üç kez yıkamak sünnettir.`,
    items: [
      { title: `1 · Niyet ve besmele`, body: `İçinden "abdest almaya niyet ettim" de ve "Bismillâhirrahmânirrahîm" diyerek başla.` },
      { title: `2 · Eller`, body: `Bilekleri de içine alacak şekilde iki eli yıka. Parmak aralarını ihmal etme.` },
      { title: `3 · Ağız`, body: `Sağ avuçla ağzına su alıp çalkala.` },
      { title: `4 · Burun`, body: `Sağ elle burnuna su çek, sol elle sümkür.` },
      { title: `5 · Yüz`, body: `Alından çene altına, iki kulak arasını kapsayacak şekilde yüzü yıka.` },
      { title: `6 · Kollar`, body: `Önce sağ, sonra sol kolu dirseklerle birlikte yıka.` },
      { title: `7 · Baş meshi`, body: `Islak elle başın en az dörtte birini meshet; ardından parmaklarla kulakları, elin dışıyla boynu meshet.` },
      { title: `8 · Ayaklar`, body: `Önce sağ, sonra sol ayağı topuklarla birlikte yıka. Parmak aralarına dikkat.` },
      { title: `Sonrasında`, body: `Kelime-i şehadeti okumak sünnettir. Abdest yalnız namaz için değil, gün içinde de alınabilir — kalbi toparlar.` },
    ],
    note: `Abdesti bozan başlıca şeyler: tuvalet ihtiyacı, yellenme, ağız dolusu kusmak, uyku ve bayılma gibi bilinç kaybı, kan akması. Kaynak: Mâide 6; Buhârî, Vudû bahsi.`,
  },

  // ─────────────────────────── NAMAZ ───────────────────────────
  {
    id: 'namaz', color: 'namaz', icon: '🕌', minutes: 7,
    title: `Namaz Nasıl Kılınır`,
    lead: `İki rekât — sırasıyla`,
    intro: `Aşağıda iki rekâtlık bir namazın akışı var. Sabah namazının farzı tam olarak budur; öğrenmek için de en iyi başlangıç. Duaları ezberlemediysen bildiğin kadarını oku, gerisini zamanla ekle.`,
    items: [
      { title: `1 · Niyet ve tekbir`,
        body: `Kıbleye dön, "niyet ettim" de, ellerini kulak hizasına kaldırıp "Allâhü ekber" diyerek bağlan. Bu andan sonra dünya dışarıda kalır.` },
      { title: `2 · Kıyam — Sübhâneke`,
        body: `Ayakta dururken önce Sübhâneke okunur.`,
        ar: `سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ`,
        tr: `Allahım! Seni tenzih eder, hamdinle anarım. Senin adın mübarektir, şanın yücedir; senden başka ilah yoktur.` },
      { title: `3 · Fâtiha`,
        body: `Eûzü besmele çekilir, ardından Fâtiha sûresi okunur. Fâtiha her rekâtta okunur — namazın omurgasıdır.` },
      { title: `4 · Zamm-ı sûre`,
        body: `Fâtiha'dan sonra kısa bir sûre eklenir; İhlâs en kolay başlangıçtır. (Yalnız ilk iki rekâtta okunur.)` },
      { title: `5 · Rükû`,
        body: `"Allâhü ekber" deyip belini büker, elleri dizlere koyarsın. Üç kez "Sübhâne rabbiye'l-azîm" dersin.`,
        ar: `سُبْحَانَ رَبِّيَ الْعَظِيمِ` },
      { title: `6 · Doğrulma`,
        body: `"Semiallâhü limen hamideh" diyerek doğrulur, "Rabbenâ leke'l-hamd" dersin.` },
      { title: `7 · Secde`,
        body: `"Allâhü ekber" deyip alnını, burnunu, iki elini, dizlerini ve ayak parmaklarını yere koyarsın. Üç kez "Sübhâne rabbiye'l-a'lâ" dersin. Doğrulup oturur, tekrar secde edersin.`,
        ar: `سُبْحَانَ رَبِّيَ الْأَعْلَى` },
      { title: `8 · İkinci rekât`,
        body: `Ayağa kalkar, Fâtiha ve kısa bir sûre okur, rükû ve iki secdeyi tekrarlarsın. Sübhâneke ve eûzü ikinci rekâtta okunmaz.` },
      { title: `9 · Oturuş — Ettehiyyâtü`,
        body: `İkinci secdeden sonra oturursun ve okursun.`,
        ar: `اَلتَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، اَلسَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`,
        tr: `Bütün tazimler, dualar ve güzellikler Allah'a mahsustur. Ey Peygamber! Selam, Allah'ın rahmeti ve bereketi senin üzerine olsun. Selam bizim ve Allah'ın sâlih kullarının üzerine olsun. Şahitlik ederim ki Allah'tan başka ilah yoktur ve Muhammed O'nun kulu ve elçisidir.` },
      { title: `10 · Salli–Bârik ve selam`,
        body: `Ettehiyyâtü'den sonra Allâhümme salli ve Allâhümme bârik okunur, ardından "Rabbenâ âtinâ" duası eklenir. Sonra başını önce sağa, sonra sola çevirerek "Esselâmü aleyküm ve rahmetullâh" der ve namazı bitirirsin.`,
        ar: `اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ` },
    ],
    note: `Vakitler ve rekâtlar (Hanefî usulünce yaygın uygulama): Sabah 2 sünnet + 2 farz · Öğle 4 sünnet + 4 farz + 2 sünnet · İkindi 4 sünnet + 4 farz · Akşam 3 farz + 2 sünnet · Yatsı 4 sünnet + 4 farz + 2 sünnet + 3 vitir. Başlarken yalnız farzlara odaklanmak da geçerli bir yoldur.`,
  },

  // ─────────────────────────── GUSÜL ───────────────────────────
  {
    id: 'gusul', color: 'gusul', icon: '🚿', minutes: 3,
    title: `Gusül (Boy Abdesti)`,
    lead: `Ne zaman ve nasıl`,
    intro: `Cünüplük hâlinde, kadınlar için âdet ve loğusalık bittiğinde alınır. Namaz ve Kur'an'a dokunmak için gereklidir. Anlatımı utandırıcı bulma — bunlar fıkhın sıradan konularıdır.`,
    items: [
      { title: `Üç farzı`, body: `1) Ağza su alıp çalkalamak, 2) burna su çekmek, 3) vücudun her yerini kuru yer kalmayacak şekilde yıkamak.` },
      { title: `Uygulanışı`, body: `Besmele çekilir, eller ve avret mahalli yıkanır, sonra namaz abdesti alınır. Ardından baştan başlayarak üç kez su dökülür ve bütün beden yıkanır.` },
      { title: `Dikkat edilecekler`, body: `Saç diplerine, göbek deliğine, küpe deliklerine su ulaşmalı. Suyu geçirmeyen oje, boya gibi tabakalar çıkarılmalıdır.` },
      { title: `Su yoksa`, body: `Su bulunamaz veya sağlık engeli varsa teyemmüm yapılır: temiz toprağa/toprak cinsi bir yüzeye eller sürülür, yüz ve kollar meshedilir.` },
    ],
    note: `Kaynak: Mâide 6; Nisâ 43.`,
  },

  // ──────────────────────── TEMEL DUALAR ────────────────────────
  {
    id: 'dua', color: 'dua', icon: '🤲', minutes: 5,
    title: `Ezberlenecek İlk Dualar`,
    lead: `Namaz için gereken en kısa set`,
    intro: `Aşağıdakiler namazın içinde geçer. Hepsini birden ezberlemeye çalışma; sırayla, günde bir tane. Ezberleyene kadar mealini okuyarak kılman namazını geçersiz kılmaz.`,
    items: [
      { title: `Fâtiha`,
        ar: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ اَلْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ`,
        tr: `Rahmân ve Rahîm olan Allah'ın adıyla. Hamd âlemlerin Rabbi Allah'a mahsustur. O Rahmân'dır, Rahîm'dir. Din gününün sahibidir. Yalnız sana kulluk eder, yalnız senden yardım dileriz. Bizi doğru yola ilet; nimet verdiklerinin yoluna, gazaba uğrayanların ve sapanların yoluna değil.`,
        body: `Namazın her rekâtında okunur. Ezberlenecek ilk metin budur.` },
      { title: `İhlâs`,
        ar: `قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اَللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ`,
        tr: `De ki: O Allah birdir. Allah her şeyin muhtaç olduğu, kendisi hiçbir şeye muhtaç olmayandır. Doğurmamış ve doğmamıştır. Hiçbir şey O'nun dengi değildir.`,
        body: `Dört âyet. Fâtiha'dan sonra okunacak en kolay sûre.` },
      { title: `Sübhâneke`,
        ar: `سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ`,
        tr: `Allahım! Seni tenzih eder, hamdinle anarım. Adın mübarektir, şanın yücedir; senden başka ilah yoktur.`,
        body: `Namaza başlarken, ilk rekâtta okunur.` },
      { title: `Ettehiyyâtü`,
        ar: `اَلتَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، اَلسَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`,
        tr: `Bütün tazimler, dualar ve güzellikler Allah'a mahsustur. Ey Peygamber! Selam, Allah'ın rahmeti ve bereketi senin üzerine olsun. Selam bizim ve Allah'ın sâlih kullarının üzerine olsun. Şahitlik ederim ki Allah'tan başka ilah yoktur ve Muhammed O'nun kulu ve elçisidir.`,
        body: `Her oturuşta okunur.` },
      { title: `Allâhümme salli · Allâhümme bârik`,
        ar: `اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ`,
        tr: `Allahım! İbrâhim'e ve ailesine rahmet ettiğin gibi Muhammed'e ve ailesine de rahmet et. Şüphesiz sen övülmeye lâyıksın, şanın yücedir.`,
        body: `Son oturuşta, Ettehiyyâtü'den sonra okunur. Bârik duası aynı kalıpta "bârik" ile tekrarlanır.` },
      { title: `Rabbenâ âtinâ`,
        ar: `رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ`,
        tr: `Rabbimiz! Bize dünyada da iyilik ver, âhirette de iyilik ver; bizi ateş azabından koru.`,
        body: `Selamdan hemen önce okunur. (Bakara 201)` },
    ],
    note: `Okunuşları uygulamanın Ezber bölümünden sesli olarak da çalışabilirsin.`,
  },

  // ────────────────────── HELAL VE HARAM ──────────────────────
  {
    id: 'helal', color: 'helal', icon: '⚖️', minutes: 4,
    title: `Helal ve Haram`,
    lead: `Sınırlar — korkutmak için değil, yön için`,
    intro: `İslam'da asıl olan serbestliktir; yasaklar sınırlıdır ve gerekçelidir. Aşağıdakiler en çok sorulan başlıklar. Bir şeyi bugün bırakamıyor olman, dinden çıktığın anlamına gelmez — yol bir günde yürünmez.`,
    items: [
      { title: `Yiyecek–içecek`, body: `Domuz eti, kan ve Allah adı anılmadan kesilen hayvan haramdır. Alkol ve sarhoş edici maddeler haramdır. Bunun dışındaki her şey helaldir; şüphelendiğinde araştırırsın, vesveseye kapılmazsın.` },
      { title: `Kazanç`, body: `Faiz, kumar, hile ve haksız kazanç haramdır. Bir işi bırakmak zorsa önce niyetini kur, sonra çıkış yolunu ara; ani karar çoğu zaman kalıcı olmuyor.` },
      { title: `İlişkiler`, body: `Nikâh dışı ilişki haramdır. Bakışta ve mahremiyette ölçülü olmak istenir. Bu ölçü kadın–erkek fark etmeden ikisine birden konulmuştur.` },
      { title: `Söz`, body: `Yalan, gıybet, iftira, alay ve haksız yere birinin sırrını açmak yasaktır. En çok ihlal edilen ve en az fark edilen alan burasıdır.` },
      { title: `Şüpheli olanlar`, body: `Peygamber Efendimiz helal ile haramın açık, arada kalanların ise şüpheli olduğunu söyler ve şüpheliden sakınanın dinini korumuş olacağını bildirir. (Buhârî, Îmân 39)` },
    ],
    note: `Ölçü âyeti: "Size ancak leş, kan, domuz eti ve Allah'tan başkası adına kesileni haram kıldı." (Bakara 173)`,
  },

  // ──────────────────────── GÜNLÜK ADAB ────────────────────────
  {
    id: 'adab', color: 'adab', icon: '🌿', minutes: 4,
    title: `Günlük Hayatın Âdâbı`,
    lead: `Küçük şeyler — dinin görünen yüzü`,
    intro: `İnsanlar dini çoğu zaman ibadetlerinden değil, bu küçük davranışlarından tanır. Hepsi kolay; hiçbiri hazırlık istemez.`,
    items: [
      { title: `Selam`, body: `"Esselâmü aleyküm" — üzerine selam ve esenlik olsun demektir. Tanıdığa da tanımadığa da verilir; alan kişi "ve aleykümü's-selâm" der.` },
      { title: `Besmele`, body: `Yemeğe, işe, yola başlarken "Bismillâh" demek. Bitince "Elhamdülillâh". İki kelime, günü baştan sona bağlar.` },
      { title: `Sağdan başlamak`, body: `Yemek yerken, giyinirken, mescide girerken sağdan başlamak sünnettir. Küçük bir düzen, farkındalık üretir.` },
      { title: `Temizlik`, body: `Beden, elbise ve bulunulan yerin temizliği ibadetin ön şartıdır. "Temizlik imanın yarısıdır." (Müslim, Tahâret 1)` },
      { title: `Söz ve emanet`, body: `Verdiği sözü tutmak, emaneti sahibine vermek, ölçüyü tam tartmak. Bunlar müslümanın ticarî ve insanî imzasıdır.` },
      { title: `Anne baba ve komşu`, body: `İbadet insanı yalnızlaştırmaz. En yakındaki iki kapı: ailen ve komşun. Onlarla ilişkin, namazının şahididir.` },
      { title: `Uyku ve uyanış`, body: `Yatarken "Bismike'llâhümme emûtü ve ahyâ", kalkınca "Elhamdülillâhi'llezî ahyânâ" demek sünnettir. Günü iki dua arasına almak, ona bir çerçeve verir.` },
    ],
    note: `Kaynaklar: Buhârî, Edeb ve İsti'zân bölümleri; Müslim, Selâm ve Tahâret bölümleri.`,
  },
];

// ─── Dil katmanı ───
// İçerik metinleri tt() sözlüğünden değil, overlay dosyasından gelir
// (makale/kıssa/returnPath ile aynı desen). Arapça dua metinleri dile
// bağlı değildir; her zaman Türkçe kayıttan gelir.
import EN from './donusTemeller.en';

const OVERLAYS = { en: EN };

function localize(base, lang) {
  if (!base || !lang || lang === 'tr') return base;
  const ov = (OVERLAYS[lang] || OVERLAYS.en || {})[base.id];
  if (!ov) return base;
  return {
    ...base,
    title: ov.title || base.title,
    lead: ov.lead || base.lead,
    intro: ov.intro || base.intro,
    note: ov.note || base.note,
    items: base.items.map((it, i) => {
      const o = (ov.items || [])[i];
      if (!o) return it;
      return { ...it, ...o, ar: it.ar }; // Arapça metin korunur
    }),
  };
}

/** Tek bir temel modülü, istenen dilde. */
export function getTemel(id, lang = 'tr') {
  const base = TEMELLER.find(t => t.id === id);
  return base ? localize(base, lang) : null;
}

/** Raf listesi (kart başlıkları) — istenen dilde. */
export function getTemelList(lang = 'tr') {
  return TEMELLER.map(t => localize(t, lang));
}

export default TEMELLER;
