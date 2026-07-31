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

// Raf dört kategoriye ayrılır — 16 modül tek bir listede kaybolmasın.
export const TEMEL_GRUPLARI = [
  { id: 'ilk',     emoji: '🌱', name: 'Önce bunlar',   desc: 'En baştan başlayanın ilk beş durağı' },
  { id: 'ibadet',  emoji: '🕌', name: 'İbadetler',      desc: 'Namaz, oruç, zekât, Kur\'an' },
  { id: 'hayat',   emoji: '🌿', name: 'Hayat',          desc: 'Ahlak, aile, kazanç, tövbe' },
  { id: 'bilgi',   emoji: '📚', name: 'Bilmek iyi olur', desc: 'Siyer, ahiret ve merak edilenler' },
];

export const TEMELLER = [
  // ─────────────────────────── İMAN ───────────────────────────
  {
    id: 'iman', group: 'ilk', color: 'iman', icon: '🌟', minutes: 4,
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
    id: 'sart', group: 'ilk', color: 'sart', icon: '🕋', minutes: 4,
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
    id: 'abdest', group: 'ilk', color: 'abdest', icon: '💧', minutes: 5,
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
    id: 'namaz', group: 'ilk', color: 'namaz', icon: '🕌', minutes: 7,
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
    id: 'gusul', group: 'ibadet', color: 'gusul', icon: '🚿', minutes: 3,
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
    id: 'dua', group: 'ilk', color: 'dua', icon: '🤲', minutes: 5,
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
    id: 'helal', group: 'hayat', color: 'helal', icon: '⚖️', minutes: 4,
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
    id: 'adab', group: 'hayat', color: 'adab', icon: '🌿', minutes: 4,
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

  // ─────────────────────────── ORUÇ ───────────────────────────
  {
    id: 'oruc', group: 'ibadet', color: 'oruc', icon: '🌙', minutes: 5,
    title: `Oruç`,
    lead: `Ramazan — kimler tutar, kimler tutmaz`,
    intro: `Oruç, imsaktan iftara kadar yemeyi, içmeyi ve eşle beraberliği bırakmaktır. Ama yalnız mideyi değil, dili ve gözü de kapsar. Ramazan'a yetişemediysen veya bir gün tutamadıysan bunun karşılığı vardır — kapı kapanmaz.`,
    items: [
      { title: `Ne zaman`, body: `Ramazan ayı boyunca, her gün imsak vaktinden akşam ezanına kadar. Ayrıca pazartesi-perşembe gibi nafile oruçlar vardır; bunlar isteğe bağlıdır.` },
      { title: `Sahur ve iftar`, body: `Sahur, imsaktan önce yenen öğündür; bir hurma ile bile olsa yapılması sünnettir. İftar, akşam ezanıyla açılır ve geciktirilmemesi tavsiye edilir.` },
      { title: `Orucu bozanlar`, body: `Bilerek yemek, içmek, eşiyle beraber olmak. Unutarak yemek orucu bozmaz — hatırladığın anda devam edersin.` },
      { title: `Tutmayacak olanlar`, body: `Hasta, yolcu, hamile ve emziren kadın, âdet gören kadın, çok yaşlı kişi. Bir kısmı sonra kaza eder, kalıcı engeli olan fidye verir. Bu bir kaçamak değil, dinin kendi hükmüdür.`,
        ar: `فَمَنْ كَانَ مِنْكُمْ مَرِيضًا أَوْ عَلَى سَفَرٍ فَعِدَّةٌ مِنْ أَيَّامٍ أُخَرَ`,
        tr: `Sizden kim hasta veya yolcu olursa, tutamadığı günler sayısınca başka günlerde tutar.` },
      { title: `Sadece mide değil`, body: `Peygamber Efendimiz, yalan söylemeyi ve yalanla iş yapmayı bırakmayanın aç kalmasına Allah'ın ihtiyacı olmadığını bildirir. (Buhârî, Savm 8) Oruç bir perhiz değil, bir terbiye.` },
      { title: `İftar duası`, body: `İftarda okunan meşhur dua kısadır.`,
        ar: `اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ`,
        tr: `Allahım! Senin için oruç tuttum ve senin rızkınla orucumu açtım.` },
    ],
    note: `Kaynak: Bakara 183-185; Buhârî, Savm bölümü.`,
  },

  // ─────────────────────────── ZEKÂT ───────────────────────────
  {
    id: 'zekat', group: 'ibadet', color: 'zekat', icon: '🤝', minutes: 5,
    title: `Zekât ve Sadaka`,
    lead: `Malın temizlenmesi — kimden, kime`,
    intro: `Zekât bir bağış değil, bir borçtur: fakirin zenginin malındaki hakkı. Yükümlü değilsen sorumluluğun da yoktur; ama sadaka her bütçeye açıktır. İkisini birbirine karıştırmamak gerekir.`,
    items: [
      { title: `Kim verir`, body: `Temel ihtiyaçları ve borçları dışında, nisap denen ölçünün üzerinde mal varlığı bir yıl elinde kalan kişi. Nisap, yaklaşık 85 gram altının değeridir.` },
      { title: `Ne kadar`, body: `Nakit, altın, gümüş ve ticaret malında kırkta bir — yani %2,5. Toprak ürünlerinde ve hayvanlarda ayrı ölçüler vardır.` },
      { title: `Kime verilir`, body: `Kur'an sekiz sınıf sayar: fakirler, düşkünler, zekât memurları, kalpleri kazanılacaklar, esirler, borçlular, Allah yolundakiler ve yolda kalmışlar. (Tevbe 60)` },
      { title: `Kime verilmez`, body: `Kişinin anne babası, çocukları, eşi ve zengin olan yakınları. Ayrıca zekât, karşılık beklenerek veya başa kakılarak verilmez.` },
      { title: `Sadaka farkı`, body: `Zekât ölçülü ve zorunludur; sadaka sınırsız ve gönüllüdür. Bir kuruş da sadakadır, bir gülümseme de. (Tirmizî, Birr 36)` },
      { title: `Gizli vermek`, body: `Sağ elin verdiğini sol elin bilmemesi övülmüştür. Gösteriş, sevabı yok eder: "Sadakalarınızı başa kakarak ve incitcerek boşa çıkarmayın." (Bakara 264)` },
    ],
    note: `Kaynak: Tevbe 60; Bakara 261-274; Buhârî, Zekât bölümü.`,
  },

  // ─────────────────────── KUR'AN'LA İLİŞKİ ───────────────────────
  {
    id: 'kuran', group: 'ibadet', color: 'kuran', icon: '📖', minutes: 6,
    title: `Kur'an'la İlişki`,
    lead: `Nasıl okunur, nereden başlanır`,
    intro: `Kur'an 114 sûre, 6236 âyettir. Baştan sona okumak zorunda değilsin ve ilk okuyuşta her şeyi anlaman beklenmiyor. Bu bölüm "nereden tutayım" sorusunun cevabı.`,
    items: [
      { title: `Nereden başlamalı`, body: `Baştan değil, sondan. Son cüzdeki kısa sûreler hem kolaydır hem namazda işine yarar. Sonra Yâsîn, Rahmân, Mülk gibi sık okunan sûrelere geçebilirsin.` },
      { title: `Meal nedir`, body: `Meal, âyetin anlamının başka dile aktarılmış hâlidir; tam çeviri değildir çünkü Kur'an'ın anlam katmanları tek bir cümleye sığmaz. Bu yüzden meallerde farklılık normaldir.` },
      { title: `Tefsir nedir`, body: `Tefsir, âyetin iniş sebebini, bağlamını ve yorumunu açıklar. Bir âyet kafana takıldığında meal değil tefsir bakılır. Uygulamada her âyetin tefsiri var.` },
      { title: `Okuma âdâbı`, body: `Abdestli olmak, eûzü besmele ile başlamak, acele etmemek, sesli okuyabiliyorsan sesli okumak. Kur'an'a el sürmek için abdest gerekir; ekrandan okumak bu hükme girmez (yaygın görüş).` },
      { title: `Hatim`, body: `Kur'an'ı baştan sona bitirmeye hatim denir. Günde 20 sayfa okuyan bir ayda, 4 sayfa okuyan beş ayda bitirir. Yarışma değil; kendi hızını bul.` },
      { title: `Anlamadığın yer`, body: `Herkesin anlamadığı yer vardır — âlimlerin bile. Anlamadığın âyeti bırak, anladığınla amel et. Zamanla ikisi de artar.` },
    ],
    note: `Ölçü: "Kur'an'ı ağır ağır, tane tane oku." (Müzzemmil 4)`,
  },

  // ────────────────────── PEYGAMBERİMİZ ──────────────────────
  {
    id: 'siyer', group: 'bilgi', color: 'siyer', icon: '🌟', minutes: 7,
    title: `Peygamberimizin Hayatı`,
    lead: `On maddede siyer`,
    intro: `Bir insanı sevmeden ona benzemek zordur. Bu bölüm Peygamber Efendimizin (s.a.v.) hayatının ana hatlarını veriyor — ezberlemek için değil, tanımak için.`,
    items: [
      { title: `571 · Doğum`, body: `Mekke'de doğdu. Babası Abdullah o doğmadan, annesi Âmine altı yaşındayken vefat etti. Dedesi ve amcası Ebû Tâlib büyüttü. Yetim büyümesi tesadüf değil, bir eğitim.` },
      { title: `Gençlik · el-Emîn`, body: `Henüz peygamber olmadan Mekke onu "el-Emîn" (güvenilir) diye çağırıyordu. Kâbe hakemliğinde bütün kabileleri uzlaştırdı. İtibar, davetten önce geldi.` },
      { title: `595 · Hz. Hatice`, body: `Ticaret ortağı Hz. Hatice ile evlendi. O vefat edene kadar (25 yıl) başka kimseyle evlenmedi. İlk vahiyde ona ilk inanan da oydu.` },
      { title: `610 · İlk vahiy`, body: `Hira'da "Oku!" emriyle vahiy başladı. Korkuyla eve döndüğünde Hz. Hatice ona şöyle dedi: "Allah seni asla utandırmaz; sen akrabanı gözetir, işini görür, misafiri ağırlarsın."` },
      { title: `613 · Açık davet`, body: `Üç yıl gizli, sonra açık davet. Zayıflar ve köleler ilk inananlar oldu. Bilâl, Ammâr, Sümeyye işkence gördü; Sümeyye İslam'ın ilk şehidi oldu.` },
      { title: `619 · Hüzün yılı`, body: `Hz. Hatice ve Ebû Tâlib aynı yıl vefat etti. Tâif'e gitti, taşlandı. Bu, hayatının en ağır dönemidir — peygamber olmak zorluktan muaf olmak değildir.` },
      { title: `622 · Hicret`, body: `Mekke'den Medine'ye göç. Orada mescid yapıldı, muhacirlerle ensar kardeş ilan edildi ve farklı topluluklarla Medine Sözleşmesi imzalandı.` },
      { title: `624-627 · Savaşlar`, body: `Bedir, Uhud, Hendek. Uhud'da yenilgi de yaşandı. Kur'an bu yenilgiyi örtmez, sebebini açıkça anlatır — bu, kitabın dürüstlüğünün delilidir.` },
      { title: `630 · Mekke'nin fethi`, body: `Kendisini yurdundan çıkaranlara "Bugün size kınama yok, gidin serbestsiniz" dedi. Zaferin en güçlü anında af — siyerin en çok konuşulan sahnesi budur.` },
      { title: `632 · Veda`, body: `Veda Hutbesi'nde can, mal ve namusun dokunulmazlığını, faizin kaldırıldığını, kadın haklarını ve ırk üstünlüğünün olmadığını ilan etti. Kısa süre sonra vefat etti.` },
    ],
    note: `Kaynaklar: Buhârî ve Müslim'in siyer/megāzî bölümleri; İbn Hişâm, es-Sîre.`,
  },

  // ──────────────────────── TÖVBE ────────────────────────
  {
    id: 'tovbe', group: 'hayat', color: 'tovbe', icon: '🕊️', minutes: 4,
    title: `Tövbe ve Günah`,
    lead: `Düştükten sonra ne yapılır`,
    intro: `Günahsız insan yoktur; olsaydı tövbe diye bir kapı da olmazdı. Bu bölüm o kapının nasıl çalıştığını anlatır — korkutmak için değil, yolu göstermek için.`,
    items: [
      { title: `Şartları`, body: `Üçtür ve hepsi kalbe aittir: yaptığından pişman olmak, o işi bırakmak, bir daha dönmemeye niyet etmek. Uzun formül gerekmez.` },
      { title: `Kul hakkı varsa`, body: `Dördüncü şart devreye girer: hakkı sahibine iade etmek veya helallik istemek. Allah kendi hakkını affeder, kul hakkını kulun affetmesi gerekir.` },
      { title: `Tekrar düşersen`, body: `Aynı günaha yeniden dönmek tövbeyi geçersiz kılmaz. Yeniden tövbe edersin. Bir kul günah işleyip tövbe ettikçe Allah'ın onu bağışladığı bildirilmiştir. (Buhârî, Tevhid 35)` },
      { title: `Ümitsizlik`, body: `Şeytanın en etkili silahı günah değil, günahtan sonraki ümitsizliktir. "Allah'ın rahmetinden ümit kesmeyin" âyeti (Zümer 53) tam da bu yüzden indirilmiştir.` },
      { title: `Seyyidü'l-istiğfar`, body: `İstiğfarların en faziletlisi sayılır; sabah okuyup o gün ölen kişinin cennetlik olduğu bildirilmiştir.`,
        ar: `اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ`,
        tr: `Allahım! Sen benim Rabbimsin, senden başka ilah yoktur. Beni sen yarattın, ben senin kulunum. Gücüm yettiğince sana verdiğim söz üzereyim.` },
      { title: `Günahı anlatma`, body: `Allah'ın örttüğü bir günahı başkasına anlatmak ayrı bir hatadır. Örtülü kalanı örtülü bırakmak, tövbenin bir parçasıdır. (Buhârî, Edeb 60)` },
    ],
    note: `Kaynak: Zümer 53; Nisâ 110; Buhârî, Deavât ve Tevhid bölümleri.`,
  },

  // ──────────────────────── AİLE ────────────────────────
  {
    id: 'aile', group: 'hayat', color: 'aile', icon: '🏡', minutes: 5,
    title: `Aile ve Nikâh`,
    lead: `Eş, çocuk, ev içi`,
    intro: `Din yalnız seccadede değil, evin içinde de sınanır. Bu bölüm evliliğin temel çerçevesini ve ev içi sorumlulukları anlatır.`,
    items: [
      { title: `Nikâh`, body: `İki tarafın rızası, iki şahit ve mehir ile kurulur. Zorla evlendirme geçersizdir — Peygamber Efendimiz rızası alınmadan evlendirilen kadının nikâhını iptal etmiştir. (Buhârî, İkrâh 3)` },
      { title: `Eş seçimi`, body: `Dört ölçü sayılır: mal, soy, güzellik ve din. "Sen dindar olanı seç" tavsiyesi bunların hepsini reddetmez, hangisinin kalıcı olduğunu söyler. (Buhârî, Nikâh 15)` },
      { title: `Karşılıklı haklar`, body: `Kur'an eşler arasındaki ilişkiyi "sevgi ve merhamet" olarak tarif eder (Rûm 21). Nafaka erkeğin sorumluluğudur; ev içi iş bölümü ise karşılıklı yardımlaşmadır — Peygamber Efendimiz evde ailesine yardım ederdi. (Buhârî, Ezân 44)` },
      { title: `En hayırlı olan`, body: `"Sizin en hayırlınız, ailesine karşı en hayırlı olanınızdır." (Tirmizî, Menâkıb 63) Dışarıdaki itibar, evdeki davranışı örtmez.` },
      { title: `Çocuk`, body: `Çocuğa güzel isim vermek, eğitmek ve adaletli davranmak babanın sorumluluğudur. Çocuklar arasında ayrım yapmak açıkça yasaklanmıştır. (Buhârî, Hibe 12)` },
      { title: `Anlaşmazlık`, body: `İslam boşanmayı yasaklamaz ama "helallerin en sevimsizi" sayar. Önce iki taraftan birer hakem devreye girer (Nisâ 35); ayrılık son çaredir, ilk refleks değil.` },
    ],
    note: `Kaynak: Rûm 21; Nisâ 19, 35; Buhârî, Nikâh bölümü.`,
  },

  // ──────────────────── ÖLÜM VE AHİRET ────────────────────
  {
    id: 'ahiret', group: 'bilgi', color: 'ahiret', icon: '🌌', minutes: 5,
    title: `Ölüm ve Ahiret`,
    lead: `Sıralama — ne olacağı`,
    intro: `Ölüm konuşmak ürkütücü gelebilir; ama bilinmediğinde daha ürkütücüdür. Bu bölüm süreci sırasıyla anlatır ve bir müslümanın cenazede ne yapacağını gösterir.`,
    items: [
      { title: `Son nefes`, body: `Ölmek üzere olan kişiye kelime-i tevhid telkin edilir — zorlanmadan, yanında söylenerek. Yâsîn okunması yaygın bir uygulamadır.` },
      { title: `Cenaze`, body: `Yıkanır, kefenlenir, cenaze namazı kılınır ve defnedilir. Cenaze namazı farz-ı kifâyedir: bir grup kılarsa diğerlerinden düşer. Rükû ve secdesi yoktur, ayakta dört tekbirle kılınır.` },
      { title: `Taziye`, body: `Yakınlarına baş sağlığı dilemek sünnettir. Aşırı feryat, elbise yırtmak gibi davranışlar hoş görülmemiştir; sessiz gözyaşı ise Peygamber Efendimizde de görülmüştür.` },
      { title: `Kabir`, body: `Berzah denen ara dönem. Ölünün ardından yapılan dua, sadaka ve onun bıraktığı faydalı işler ona ulaşır. (Müslim, Vasiyyet 14)` },
      { title: `Kıyamet ve haşir`, body: `Sûra üfürülmesiyle her şey son bulur, sonra insanlar diriltilir ve toplanır. Herkes yaptığıyla karşılaşır: "Kim zerre kadar iyilik yaparsa onu görür." (Zilzâl 7-8)` },
      { title: `Hesap ve mizan`, body: `Ameller tartılır, kitaplar verilir. Ama son söz rahmetindir: kimse ameliyle cennete giremez, Allah'ın rahmetiyle girer — bu Peygamber Efendimizin kendisi için bile söylediği bir hükümdür. (Buhârî, Rikāk 18)` },
    ],
    note: `Kaynak: Zilzâl 7-8; Müslim, Cenâiz ve Vasiyyet bölümleri.`,
  },

  // ────────────────── SIK SORULAN SORULAR ──────────────────
  {
    id: 'sorular', group: 'bilgi', color: 'sorular', icon: '❓', minutes: 7,
    title: `Aklındaki Sorular`,
    lead: `Herkesin sorduğu ama sormaya çekindiği`,
    intro: `Geri dönenlerin önündeki asıl engel çoğu zaman ibadetin zorluğu değil, cevaplanmamış sorulardır. Aşağıdakiler en sık sorulanlar. Görüş farkı olan yerlerde bu açıkça belirtilmiştir; kesin konuşup seni yanıltmıyoruz.`,
    items: [
      { title: `Ailem karşı çıkarsa?`, body: `Anne babaya iyilik farzdır, ama günah emrettiklerinde itaat yoktur — buna rağmen onlara güzel davranmak emredilir (Lokmân 15). Yani ne ibadeti bırakırsın ne saygıyı. Çatışmayı büyütmeden, sessizce sürdürmek çoğu zaman en iyi yoldur.` },
      { title: `İş yerinde namaz kılamıyorum`, body: `Namazın vakti geniştir; öğleyi ikindiye kadar, ikindiyi akşama kadar kılabilirsin. Molalarda ya da mesai sonrası kılmak gecikmiş sayılmaz. Hiç kılamayacaksan bile o vakti kaza edersin — bırakmazsın.` },
      { title: `Müzik dinlemek`, body: `Bu konuda âlimler arasında görüş farkı vardır. Bir kısmı çalgılı müziği yasaklamış, bir kısmı içeriğe bakmıştır: kötülüğe çağıran söz haram, tarafsız olan mubah. Kendi ölçünü koyarken içeriğe bakman en güvenli yoldur.` },
      { title: `Başörtüsüne hazır değilim`, body: `Örtünmek Kur'an'da emredilmiştir (Nûr 31; Ahzâb 59). Ama hazır olmamak, diğer ibadetleri bırakma gerekçesi değildir. Namaz kılan ve henüz örtünmeyen biri, ikisini de bırakan birinden hayırlıdır. Sıra sende, süre senin.` },
      { title: `Eski arkadaş çevrem`, body: `Kimseyi kesip atman gerekmez. Ama "sabah akşam Rablerine dua edenlerle beraber ol" (Kehf 28) emri bir yön gösterir. Yeni bir çevre kurmak, eskisini yıkmaktan daha kolaydır.` },
      { title: `Dövme, kredi, sigorta gibi geçmiş işler`, body: `Geçmişte yapılmış ve geri dönüşü olmayan şeyler tövbeyle kapanır. Devam eden bir durum (faizli kredi gibi) varsa niyeti kurar, çıkış planı yaparsın. Ani kararlar çoğu zaman kalıcı olmuyor.` },
      { title: `Dua ediyorum kabul olmuyor`, body: `Peygamber Efendimiz duanın üç şekilde karşılık bulduğunu bildirir: ya istediği verilir, ya ondan bir kötülük savılır, ya da âhirete saklanır. (Tirmizî, Deavât 115) Cevapsız dua yoktur; aynı cevap yoktur.` },
      { title: `Bilmediğim şeyi yanlış yaparsam?`, body: `Bilmeden yapılanla bilerek yapılan bir değildir. "Rabbimiz! Unutur veya hata edersek bizi sorumlu tutma" duası (Bakara 286) tam olarak kabul edilmiştir. Öğrenmeye niyetli olmak yeter.` },
      { title: `Kime soracağım?`, body: `Güvenilir bir kaynağa. İnternette rastgele bir video değil; kaynağını gösteren, görüş farklarını söyleyen ve "bilmiyorum" diyebilen kişilere. Uygulamadaki Sohbet bölümü de bir başlangıç noktası olabilir — ama kesin fetva yerine yönlendirme olarak gör.` },
      { title: `Ya yine bırakırsam?`, body: `Bırakırsan geri dönersin. Bu yolun tamamı zaten bunun üzerine kurulu: seri sıfırlanmıyor, şefkat hakkın var, kapı kapanmıyor. Bir daha bırakmayacağına söz vermek zorunda değilsin — bugün buradasın, bu yeter.` },
    ],
    note: `Görüş farkı bulunan konularda tek bir mezhebin görüşü kesin hüküm gibi sunulmamıştır. Kişisel durumun için yerel bir müftülüğe veya güvendiğin bir hocaya danışman en doğrusudur.`,
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
