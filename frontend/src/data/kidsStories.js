// 🗺️ HİKÂYE HARİTASI — çocuklar için kısa, sayfa sayfa hikâyeler.
// Kur'an kıssaları yalnız ayetlerde anlatılanla sınırlıdır (kaynak her sayfada); sonradan eklenmiş rivayetler ve
// korkutucu ayrıntılar BİLEREK alınmadı. Siyer hikâyesi, siyer kitaplarında yaygın olarak anlatılan olaydır.
// Özgün yazım; yayından önce bir din eğitimcisi okumalıdır (data/icerik.json: denetlenmedi).
// sahne: components/kids/KidsScene.jsx kimliği
export const KIDS_STORIES = [
  {
    id: 'nuh', title: "Hz. Nuh'un Gemisi", konu: 'Sabır', color: '#4A90D9', kapak: 'gemi',
    sayfalar: [
      { sahne: 'gunes', metin: "Çok eskiden Allah, Hz. Nuh'u kavmine peygamber olarak gönderdi. Hz. Nuh insanlara yalnız Allah'a ibadet etmelerini ve iyi insanlar olmalarını anlattı.", kaynak: 'Hûd 25-26' },
      { sahne: 'yol', metin: 'Hz. Nuh onlara çok uzun yıllar boyunca sabırla anlattı. Ama ona inananlar çok azdı.', kaynak: 'Ankebût 14 · Hûd 40' },
      { sahne: 'gemi', metin: "Allah, Hz. Nuh'a büyük bir gemi yapmasını emretti. Yanından geçenlerin bazıları onunla alay etti; o ise sabırla çalışmaya devam etti.", kaynak: 'Hûd 37-38' },
      { sahne: 'yagmurlugemi', metin: "Vakit gelince Hz. Nuh, Allah'ın emriyle inananları ve her hayvandan birer çifti gemiye bindirdi. Sonra büyük bir tufan başladı.", kaynak: 'Hûd 40' },
      { sahne: 'gemi', metin: "Gemi, Allah'ın izniyle dağ gibi dalgaların arasında yüzdü. İçindekiler güvendeydi.", kaynak: 'Hûd 41-42' },
      { sahne: 'cudi', metin: 'Sonunda sular çekildi ve gemi Cûdî dağının üzerine oturdu. Hz. Nuh ve yanındakiler esenlikle karaya indi.', kaynak: 'Hûd 44, 48' },
    ],
    ders: 'Doğru bildiğimiz şeyi, başkaları gülse bile sabırla yapmaya devam ederiz.',
    soru: { q: 'Gemi en sonunda nereye oturdu?', o: ['Cûdî dağına', 'Bir adaya', 'Bir şehrin ortasına'], a: 0 },
  },
  {
    id: 'yunus', title: 'Hz. Yunus ve Büyük Balık', konu: 'Dua ve tövbe', color: '#26A69A', kapak: 'balik',
    sayfalar: [
      { sahne: 'gunes', metin: "Hz. Yunus, Allah'ın gönderdiği peygamberlerden biriydi. Kavmini Allah'a inanmaya çağırdı.", kaynak: 'Sâffât 139' },
      { sahne: 'gemi', metin: 'Kavmi onu dinlemeyince Hz. Yunus onlara kızdı, şehirden ayrıldı ve dolu bir gemiye bindi.', kaynak: 'Enbiyâ 87 · Sâffât 140' },
      { sahne: 'balik', metin: "Hz. Yunus denize düştü ve onu büyük bir balık yuttu. Balığın karnı çok karanlıktı.", kaynak: 'Sâffât 141-142 · Enbiyâ 87' },
      { sahne: 'balik', metin: "Hz. Yunus orada, Allah'tan başka ilah olmadığını söyleyip hatasını kabul ederek dua etti: \"Lâ ilâhe illâ ente sübhâneke innî küntü mine'z-zâlimîn.\"", kaynak: 'Enbiyâ 87' },
      { sahne: 'sahil', metin: 'Allah onun duasını kabul etti. Balık onu kıyıya bıraktı. Allah onun yanında gölge yapan, kabak türünden bir bitki bitirdi.', kaynak: 'Enbiyâ 88 · Sâffât 145-146' },
      { sahne: 'cami', metin: 'Hz. Yunus kavmine geri döndü. Bu sefer yüz binden fazla insan ona inandı.', kaynak: 'Sâffât 147-148' },
    ],
    ders: "Hata yaptığımızda Allah'a dua eder, tövbe ederiz. Allah duaları işitir.",
    soru: { q: 'Hz. Yunus balığın karnında ne yaptı?', o: ["Allah'a dua etti", 'Uyudu', 'Şarkı söyledi'], a: 0 },
  },
  {
    id: 'karinca', title: 'Hz. Süleyman ve Karınca', konu: 'Merhamet ve şükür', color: '#9B59B6', kapak: 'karinca',
    sayfalar: [
      { sahne: 'gunes', metin: "Allah, Hz. Süleyman'a peygamberlik ve büyük bir mülk verdi. Ona kuşların dilini de öğretti.", kaynak: 'Neml 15-16' },
      { sahne: 'yol', metin: 'Bir gün Hz. Süleyman ordusuyla yolculuk ediyordu. Karıncaların yaşadığı bir vadiye geldiler.', kaynak: 'Neml 17-18' },
      { sahne: 'karinca', metin: "Bir karınca arkadaşlarına seslendi: \"Yuvalarınıza girin! Süleyman ve ordusu farkına varmadan sizi ezmesin.\"", kaynak: 'Neml 18' },
      { sahne: 'karinca', metin: 'Hz. Süleyman karıncanın sözünü duydu ve gülümsedi.', kaynak: 'Neml 19' },
      { sahne: 'yildizlar', metin: "Sonra Allah'a dua etti: Kendisine ve anne babasına verdiği nimetlere şükretmeyi ve iyi işler yapmayı ona nasip etmesini istedi.", kaynak: 'Neml 19' },
    ],
    ders: 'Küçük canlıları da düşünür, onlara zarar vermemeye çalışırız. Nimetler için Allah’a şükrederiz.',
    soru: { q: 'Karınca arkadaşlarına ne yapmalarını söyledi?', o: ['Yuvalarına girmelerini', 'Uçmalarını', 'Saklambaç oynamalarını'], a: 0 },
  },
  {
    id: 'kabe', title: 'Hz. İbrahim ve Kâbe', konu: 'Birlikte çalışmak', color: '#F2B33D', kapak: 'kabe',
    sayfalar: [
      { sahne: 'mekke', metin: 'Hz. İbrahim, Allah’ın sevdiği bir peygamberdi. Oğlu Hz. İsmail de bir peygamberdi.', kaynak: 'Meryem 41, 54' },
      { sahne: 'kabe', metin: "Allah, Hz. İbrahim'e Kâbe'nin yerini gösterdi. Hz. İbrahim ve oğlu İsmail, Kâbe'nin temellerini birlikte yükselttiler.", kaynak: 'Hac 26 · Bakara 127' },
      { sahne: 'kabe', metin: 'Çalışırken şöyle dua ediyorlardı: "Rabbimiz! Bizden bunu kabul et. Sen her şeyi işiten ve bilensin."', kaynak: 'Bakara 127' },
      { sahne: 'mekke', metin: "Allah, Hz. İbrahim'e insanları hacca çağırmasını emretti. O günden beri insanlar uzak yollardan Kâbe'ye gelir.", kaynak: 'Hac 27' },
      { sahne: 'cami', metin: "Bugün dünyanın her yerindeki Müslümanlar namaz kılarken Kâbe'ye, yani kıbleye döner.", kaynak: 'Bakara 144' },
    ],
    ders: "Güzel bir işi birlikte yapar ve \"Allah'ım, kabul et\" diye dua ederiz.",
    soru: { q: "Kâbe'nin temellerini kimler yükseltti?", o: ['Hz. İbrahim ve Hz. İsmail', 'Hz. Nuh ve oğlu', 'Hz. Musa ve Hz. Harun'], a: 0 },
  },
  {
    id: 'emin', title: 'Güvenilir Muhammed', konu: 'Güvenilir olmak', color: '#2D8A4E', kapak: 'mekke',
    sayfalar: [
      { sahne: 'mekke', metin: "Peygamber Efendimiz Mekke'de büyüdü. Herkes ona güvenirdi. Ona \"Muhammedü'l-Emîn\", yani \"güvenilir Muhammed\" derlerdi.", kaynak: 'İbn Hişâm, es-Sîre' },
      { sahne: 'kabe', metin: "Bir gün Mekkeliler Kâbe'yi yeniden yapıyordu. Sıra, Hacerülesved denilen taşı yerine koymaya geldi.", kaynak: 'İbn Hişâm, es-Sîre' },
      { sahne: 'yol', metin: 'Her kabile bu şerefli işi kendisi yapmak istedi ve aralarında anlaşmazlık çıktı.', kaynak: 'İbn Hişâm, es-Sîre' },
      { sahne: 'gunes', metin: "Sonunda \"Buraya ilk kim gelirse o karar versin\" dediler. İlk gelen Peygamber Efendimizdi. Herkes onu görünce sevindi.", kaynak: 'İbn Hişâm, es-Sîre' },
      { sahne: 'kabe', metin: 'Peygamber Efendimiz bir örtü serdi ve taşı ortasına koydu. Her kabileden biri örtünün bir ucundan tuttu, taşı birlikte taşıdılar. Taşı yerine de kendi elleriyle koydu.', kaynak: 'İbn Hişâm, es-Sîre' },
    ],
    ders: 'Güvenilir olan insan, anlaşmazlıkları bile barışa çevirebilir.',
    soru: { q: 'Mekkeliler Peygamber Efendimize ne derdi?', o: ['el-Emîn (güvenilir)', 'Kahraman', 'Zengin'], a: 0 },
  },
];
export default KIDS_STORIES;
