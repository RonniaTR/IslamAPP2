// frontend/src/data/storyData.js
// HİKÂYE MODU — bölüm bölüm ilerlenen kıssalar.
// Her bölüm: anlatı + sorular. Sorular ya `questions` ile gömülü gelir
// (Hz. Yusuf — Yusuf Suresi'nden derlenmiş özel sorular) ya da `draw` ile
// soru bankasının ilgili kategorisinden çekilir.

export const STORIES = [
  {
    id: 'yusuf',
    title: 'Hz. Yusuf (a.s.)',
    subtitle: "Ahsenü'l-Kasas — Kıssaların En Güzeli",
    emoji: '🌙',
    color: '#3B82F6',
    badge: 'Yusuf Kıssası Alimi',
    chapters: [
      {
        title: 'Rüya',
        narrative: "Küçük Yusuf bir gece rüyasında on bir yıldızın, güneşin ve ayın kendisine secde ettiğini gördü. Babası Hz. Yakub bu rüyanın büyük bir işaret olduğunu anladı ve 'Rüyanı kardeşlerine anlatma' diye tembihledi (Yusuf 4-5).",
        questions: [
          { q: 'Hz. Yusuf rüyasında kaç yıldız gördü?', o: ['11', '7', '9', '12'], a: 0, exp: "'Babacığım! Ben rüyamda on bir yıldız, güneşi ve ayı gördüm...' (Yusuf 4)." },
          { q: 'Rüyada yıldızlarla birlikte neler secde ediyordu?', o: ['Güneş ve Ay', 'Bulutlar ve rüzgar', 'Dağlar ve denizler', 'Melekler'], a: 0, exp: 'Rüyada on bir yıldız ile güneş ve ay Yusuf\'a secde ediyordu (Yusuf 4).' },
          { q: 'Hz. Yusuf rüyasını ilk kime anlattı?', o: ['Babası Hz. Yakub\'a', 'Kardeşlerine', 'Annesine', 'Dedesine'], a: 0, exp: 'Yusuf rüyasını babası Hz. Yakub\'a anlattı (Yusuf 4).' },
          { q: 'Babası rüyayı kimlere anlatmamasını tembihledi?', o: ['Kardeşlerine', 'Komşularına', 'Mısırlılara', 'Kimseye'], a: 0, exp: "'Rüyanı kardeşlerine anlatma, sana tuzak kurarlar' (Yusuf 5)." },
          { q: "Hz. Yusuf'un babası hangi peygamberdir?", o: ['Hz. Yakub', 'Hz. İshak', 'Hz. İbrahim', 'Hz. Musa'], a: 0, exp: "Hz. Yusuf, Hz. Yakub'un oğludur; soyu Hz. İbrahim'e uzanır." },
        ],
      },
      {
        title: 'Kuyu',
        narrative: 'Kardeşleri, babalarının Yusuf\'a olan sevgisini kıskandılar. Onu gezmeye götürme bahanesiyle alıp bir kuyuya bıraktılar; gömleğine sahte kan sürüp babalarına "Onu kurt yedi" dediler (Yusuf 8-18).',
        questions: [
          { q: "Kardeşleri Hz. Yusuf'u neden kıskanıyordu?", o: ['Babalarının ona olan sevgisinden', 'Zenginliğinden', 'Gücünden', 'Boyundan'], a: 0, exp: "'Yusuf ve kardeşi babamıza bizden daha sevgili' dediler (Yusuf 8)." },
          { q: 'Kardeşleri Yusuf\'u nereye bıraktı?', o: ['Kuyuya', 'Ormana', 'Denize', 'Mağaraya'], a: 0, exp: 'Onu kuyunun dibine bırakmaya karar verdiler (Yusuf 15).' },
          { q: 'Babalarına Yusuf hakkında ne söylediler?', o: ['Onu kurt yedi', 'Kayboldu', 'Nehre düştü', 'Kervanla gitti'], a: 0, exp: "'Onu eşyamızın yanında bırakmıştık, kurt yemiş' dediler (Yusuf 17)." },
          { q: 'Yusuf\'un gömleğine ne sürdüler?', o: ['Sahte (yalancı) kan', 'Çamur', 'Bal', 'Boya'], a: 0, exp: 'Gömleğine sahte kan sürerek getirdiler (Yusuf 18).' },
          { q: 'Hz. Yusuf\'u kuyudan kim çıkardı?', o: ['Su almaya gelen kervancı', 'Babası', 'Kardeşleri', 'Bir çoban'], a: 0, exp: 'Bir kervanın sucusu kovasını sarkıtınca Yusuf\'u buldu (Yusuf 19).' },
        ],
      },
      {
        title: 'Saray',
        narrative: "Kervan Yusuf'u Mısır'da köle olarak sattı. Onu Mısır Azizi satın aldı. Yusuf büyüyüp güzelleşince Aziz'in hanımı ona iftira attı; ama gömleğinin arkadan yırtılmış olması suçsuzluğunu gösterdi. Yusuf haramdan korunmak için zindanı tercih etti (Yusuf 21-35).",
        questions: [
          { q: "Hz. Yusuf'u Mısır'da kim satın aldı?", o: ['Mısır Azizi', 'Firavun', 'Bir tüccar', 'Kralın veziri'], a: 0, exp: "Mısır Azizi onu satın alıp hanımına 'Ona iyi bak' dedi (Yusuf 21)." },
          { q: 'İftira karşısında Yusuf\'un suçsuzluğu nasıl anlaşıldı?', o: ['Gömleğinin arkadan yırtılmasıyla', 'Şahitlerin sözüyle', 'Rüya yorumuyla', 'Kralın kararıyla'], a: 0, exp: 'Gömlek arkadan yırtılmışsa kadın yalancıdır, denildi (Yusuf 26-28).' },
          { q: 'Hz. Yusuf iftira ve teklif karşısında neyi tercih etti?', o: ['Zindanı', 'Kaçmayı', 'Saray hayatını', 'Susmayı'], a: 0, exp: "'Rabbim! Zindan bana bunların davetinden daha sevimlidir' (Yusuf 33)." },
          { q: 'Bu kıssa hangi surede anlatılır?', o: ['Yusuf Suresi', 'Kehf Suresi', 'Meryem Suresi', 'Kasas Suresi'], a: 0, exp: 'Kıssa baştan sona Yusuf Suresi\'nde anlatılır (111 ayet).' },
          { q: "Yusuf kıssası Kur'an'da nasıl nitelenir?", o: ["Ahsenü'l-Kasas (kıssaların en güzeli)", 'En uzun kıssa', 'En kısa kıssa', 'İlk kıssa'], a: 0, exp: "'Sana kıssaların en güzelini anlatıyoruz' (Yusuf 3)." },
        ],
      },
      {
        title: 'Zindan',
        narrative: "Zindanda iki gencin rüyasını yorumlamadan önce onlara tevhidi anlattı. Yıllar sonra kralın 'yedi semiz ineği yedi zayıf ineğin yediği' rüyasını 'yedi bolluk, yedi kıtlık yılı' olarak yorumladı ve suçsuzluğu kanıtlanarak zindandan çıktı (Yusuf 36-54).",
        questions: [
          { q: 'Zindanda kaç gencin rüyasını yorumladı?', o: ['2', '3', '1', '4'], a: 0, exp: 'Onunla birlikte zindana iki genç girmişti (Yusuf 36).' },
          { q: 'Yusuf rüyaları yorumlamadan önce ne yaptı?', o: ["Tevhidi (Allah'ın birliğini) anlattı", 'Yemek istedi', 'Ücret istedi', 'Uyudu'], a: 0, exp: 'Önce tek Allah\'a iman etmeyi anlattı (Yusuf 37-40).' },
          { q: 'Kralın rüyasında neler vardı?', o: ['7 semiz ve 7 zayıf inek, 7 yeşil ve 7 kuru başak', '11 yıldız', 'İki deniz', 'Uçan kuşlar'], a: 0, exp: 'Kral: "Yedi semiz ineği yedi zayıf inek yiyor..." (Yusuf 43).' },
          { q: 'Yusuf kralın rüyasını nasıl yorumladı?', o: ['7 bolluk, ardından 7 kıtlık yılı', 'Savaş çıkacak', 'Kral ölecek', 'Yağmur yağacak'], a: 0, exp: 'Yedi yıl bolluk, ardından yedi zor yıl gelecek dedi (Yusuf 47-48).' },
          { q: 'Hz. Yusuf zindandan nasıl çıktı?', o: ['Suçsuzluğu herkesçe kanıtlanınca', 'Kaçarak', 'Fidye ödeyerek', 'Af dileyerek'], a: 0, exp: 'Kadınlar gerçeği itiraf etti, suçsuzluğu ilan edildi (Yusuf 51).' },
        ],
      },
      {
        title: 'Kavuşma',
        narrative: "Yusuf hazinenin yönetimini üstlendi. Kıtlık yıllarında erzak için Mısır'a gelen kardeşlerini tanıdı ama kendini hemen tanıtmadı. Sonunda gömleğini babasına gönderdi; Hz. Yakub'un gözleri açıldı. Ailesi Mısır'a gelince rüya gerçek oldu (Yusuf 55-100).",
        questions: [
          { q: 'Yusuf kraldan hangi görevi istedi?', o: ['Hazine (maliye) yönetimini', 'Ordu komutanlığını', 'Vezirliği', 'Elçiliği'], a: 0, exp: "'Beni ülkenin hazinelerine bakmakla görevlendir' (Yusuf 55)." },
          { q: "Kardeşleri Mısır'a neden geldi?", o: ['Kıtlıkta erzak almak için', 'Ticaret için', 'Hac için', 'Savaş için'], a: 0, exp: 'Kıtlık yıllarında erzak almak için Mısır\'a geldiler (Yusuf 58).' },
          { q: 'Yusuf kardeşlerini görünce ne oldu?', o: ['O tanıdı, onlar tanımadı', 'Kimse tanımadı', 'Hemen kucaklaştılar', 'Onlar tanıdı'], a: 0, exp: "'Yusuf onları tanıdı, onlar ise onu tanımıyorlardı' (Yusuf 58)." },
          { q: "Hz. Yakub'un gözleri nasıl açıldı?", o: ["Yusuf'un gömleği yüzüne sürülünce", 'Dua edince', 'Su içince', 'Rüya görünce'], a: 0, exp: 'Müjdeci gömleği yüzüne koyunca gözleri görür oldu (Yusuf 96).' },
          { q: 'Çocukluk rüyası nasıl gerçekleşti?', o: ['Ailesi ona saygıyla eğildi (secde etti)', 'Kral tacını verdi', 'Yıldızlar göründü', 'Hiç gerçekleşmedi'], a: 0, exp: "'İşte bu, önceden gördüğüm rüyanın gerçekleşmesidir' (Yusuf 100)." },
        ],
      },
    ],
  },
  {
    id: 'efendimiz',
    title: 'Efendimizin Yolu',
    subtitle: 'Siyer-i Nebi — doğumdan vedaya',
    emoji: '🕌',
    color: '#10B981',
    badge: 'Siyer Yolcusu',
    chapters: [
      { title: 'Doğum ve Gençlik', narrative: "571 yılında Mekke'de dünyaya geldi. Doğmadan babasını, küçük yaşta annesini kaybetti. Dürüstlüğüyle 'el-Emin' diye anıldı.", draw: { category: 'Siyer', count: 5 } },
      { title: 'İlk Vahiy', narrative: "40 yaşında Hira Mağarası'nda ilk vahiy geldi: 'Oku!' (Alak 1). Peygamberlik görevi başladı.", draw: { category: 'Peygamberler', count: 5 } },
      { title: 'Hicret', narrative: "622'de Mekke'den Medine'ye hicret etti. Bu olay İslam tarihinin dönüm noktası oldu ve hicri takvimin başlangıcı sayıldı.", draw: { category: 'Siyer', count: 5 } },
      { title: 'Medine Yılları', narrative: 'Medine\'de İslam toplumu kuruldu; Bedir, Uhud ve Hendek savaşları yaşandı.', draw: { category: 'Tarih', count: 5 } },
      { title: 'Veda', narrative: "Veda Haccı'nda yüz binlerce sahabeye son hutbesini verdi ve 632'de vefat etti.", draw: { category: 'Siyer', count: 5 } },
    ],
  },
  {
    id: 'halifeler',
    title: 'Dört Halife',
    subtitle: 'Hulefa-i Raşidin dönemi',
    emoji: '⭐',
    color: '#F59E0B',
    badge: 'Raşid Halifeler Bilgini',
    chapters: [
      { title: 'Hz. Ebubekir', narrative: "'Sıddık' lakaplı ilk halife. Kur'an'ı kitap haline getirtti, ridde savaşlarıyla birliği korudu.", draw: { category: 'Sahabe', count: 5 } },
      { title: 'Hz. Ömer', narrative: "'Faruk' lakaplı ikinci halife. Adaletiyle meşhur oldu; Kudüs onun döneminde fethedildi.", draw: { category: 'Sahabe', count: 5 } },
      { title: 'Hz. Osman', narrative: "'Zinnureyn' lakaplı üçüncü halife. Kur'an nüshalarını çoğaltıp merkezlere gönderdi.", draw: { category: 'Sahabe', count: 5 } },
      { title: 'Hz. Ali', narrative: "'İlim şehrinin kapısı' dördüncü halife. Peygamberimizin amcasının oğlu ve damadı.", draw: { category: 'Sahabe', count: 5 } },
    ],
  },
  {
    id: 'fetihler',
    title: 'Fetihler Çağı',
    subtitle: "Endülüs'ten İstanbul'a",
    emoji: '🏰',
    color: '#8B5CF6',
    badge: 'Fetih Tarihçisi',
    chapters: [
      { title: 'İlk Fetihler', narrative: 'İslam orduları kısa sürede Suriye, Mısır ve İran\'a ulaştı; medeniyet hızla yayıldı.', draw: { category: 'Tarih', count: 5 } },
      { title: 'Endülüs', narrative: "711'de Tarık bin Ziyad İspanya'ya geçti; Endülüs sekiz asır sürecek bir ilim medeniyetine dönüştü.", draw: { category: 'Medeniyet', count: 5 } },
      { title: 'Anadolu', narrative: "1071 Malazgirt Zaferi ile Anadolu'nun kapıları açıldı.", draw: { category: 'Tarih', count: 5 } },
      { title: 'İstanbul', narrative: "1453'te Fatih Sultan Mehmet İstanbul'u fethetti; 'ne güzel komutan' müjdesine nail oldu.", draw: { category: 'Tarih', count: 5 } },
    ],
  },
];

export default STORIES;
