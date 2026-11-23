// 📰 HİKMET MECMUASI — Sayı 1: Işık ve Ölçü
// Bilim dergisi tarzı: her makale bir âlim, bir yöntem, bir çizim ve "Sen de dene" kutusu.
// Kural: tarih ve sayı veren her cümlenin kaynağı en sondaki Kaynaklar sayfasındadır. "Bilimsel mucize" iddiası yoktur;
// âyetler tefekkür daveti olarak yer alır. Âyet mealleri meal paketinden gelir (bkz. kitap.js başındaki ilke).
import { MECMUA } from '../../pages/musluman/tema';

const mecmua = {
  id: 'hikmet-mecmuasi-1',
  tema: 'mecmua',
  baslik: 'Hikmet Mecmuası',
  kisaAd: 'Hikmet Mecmuası · Sayı 1',
  alt: 'Işık ve Ölçü',
  sayi: 'Sayı 1 · Kasım 2026',
  konu: 'Işık ve Ölçü',
  kapakSatirlari: [
    [MECMUA.yer, 'Bîrûnî: Bir dağdan Dünya\'yı ölçmek'],
    [MECMUA.isik, 'Karanlık odadaki ışık'],
    [MECMUA.sayi, 'Harezmî ve kayıp parça'],
    [MECMUA.sanat, 'Pergelle çizilen sonsuzluk'],
  ],
  gelecek: {
    baslik: 'Beden ve Şifa',
    x: 'İbn Sînâ\'nın el-Kânûn\'u, Zehrâvî\'nin cerrahi aletleri, darüşşifalar ve sağlıklı yaşamın ölçüleri. Bir sonraki sayıda.',
  },
  onSayfalar: ['kapak', 'icindekiler'],
  sonSayfalar: ['arka'],

  bolumler: [
    {
      id: 'editor',
      no: null,
      kicker: 'Editörden',
      baslik: 'Ölçünün medeniyeti',
      alt: 'Göğü yükselten ve ölçüyü koyan Rabbin kâinatında ölçmek, tartmak, gözlemlemek.',
      kisa: 'Editörden',
      renk: MECMUA.tarih,
      buyuk: { x: 'Sayı 1', alt: 'Işık ve Ölçü · dokuz makale, sekiz çizim' },
      bloklar: [
        { t: 'ayet', s: 55, a: [7, 9] },
        { t: 'p', ilk: true, x: 'Bu sayının adı *Işık ve Ölçü.* Çünkü medeniyetimizin âlimleri ölçmeyi, tartmayı ve gözlemlemeyi bir ibadet ciddiyetiyle yaptılar. Bir dağın tepesinden Dünya\'nın yarıçapını hesapladılar, karanlık bir odada ışığın yolunu izlediler, bir yılın uzunluğunu saniyelerle ölçtüler.' },
        { t: 'p', x: 'Bu sayfalarda onların hikâyelerini, yöntemlerini ve bugün senin de deneyebileceğin küçük deneyleri bulacaksın. Amacımız geçmişle övünmek değil; aynı merakı yeniden uyandırmak.' },
        { t: 'info', id: 'zamanSeridi', baslik: 'Bu sayının zaman şeridi' },
        { t: 'not', x: 'Âyetlere "bilimsel mucize" yüklemiyoruz. Kur\'an\'ın daveti tefekkürdür; bilim ise bu davete insanın verdiği cevaplardan biridir. Bilim değişir, gelişir; vahyi onun her yeni sonucuna göre yorumlamaya çalışmayız.' },
      ],
    },

    {
      id: 'biruni',
      no: 1,
      kicker: 'Yer bilimi',
      baslik: 'Bir dağdan Dünya\'yı ölçmek',
      alt: '11. yüzyılda bir âlim, bir dağ, bir usturlap ve trigonometri.',
      kisa: 'Bîrûnî',
      renk: MECMUA.yer,
      buyuk: { x: '≈ 6.340 km', alt: 'Bîrûnî\'nin bulduğu Dünya yarıçapı. Bugünkü ortalama: 6.371 km.' },
      bloklar: [
        { t: 'p', ilk: true, x: 'Ebû Reyhân el-Bîrûnî (973–1048) Harezm\'de doğdu. Matematik, gökbilim, coğrafya, eczacılık ve tarih alanlarında eserler verdi. Hindistan\'ı anlatan kitabı, bir kültürü kendi kaynaklarından tanımanın erken ve titiz bir örneği sayılır.' },
        { t: 'p', x: 'Dünya\'nın büyüklüğünü ölçmek için daha önce, Halife Me\'mûn döneminde, âlimler düz bir arazide bir derecelik yayı adım adım ölçmüştü. Bîrûnî daha pratik bir yol buldu: tek bir dağ yeterliydi.' },
        { t: 'h', x: 'Yöntem: üç adım' },
        {
          t: 'liste',
          x: [
            'Dağın yüksekliğini (h), ovadaki iki noktadan ölçtüğü açılarla hesapladı.',
            'Dağın tepesine çıkıp ufkun yatay çizginin ne kadar altında göründüğünü, yani alçalma açısını (α) ölçtü.',
            'Tepeden ufka uzanan bakış çizgisi Dünya\'ya teğettir. Bu dik üçgenden yarıçapı (R) hesapladı.',
          ],
        },
        { t: 'info', id: 'biruni' },
        { t: 'info', id: 'dunyaYaricapi' },
        { t: 'p', x: 'Bu açı gözle fark edilemeyecek kadar küçüktür: yüz metre yüksekten bakan biri için bir derecenin üçte biri kadar. Bîrûnî\'nin başarısı, hem doğru yöntemi bulmasında hem de bu küçük açıyı ölçebilecek titizlikte çalışmasındadır.' },
        { t: 'kutu', baslik: 'Sen de dene', x: 'Hesap makinesini aç: h = 0,5 km ve α = 0,718° için R = h × cos α ÷ (1 − cos α) formülünü hesapla. Yaklaşık 6.367 km bulacaksın. Açıyı 0,72° yap; sonucun ne kadar değiştiğine bak. Ölçümde titizliğin neden önemli olduğunu göreceksin.' },
      ],
    },

    {
      id: 'heysem',
      no: 2,
      kicker: 'Optik',
      baslik: 'Karanlık odadaki ışık',
      alt: 'Görmek nedir? Cevap bir deneyle geldi.',
      kisa: 'İbnü\'l-Heysem',
      renk: MECMUA.isik,
      buyuk: { x: 'Işık → göz', alt: 'İbnü\'l-Heysem: Işık nesneden göze gelir; gözden nesneye gitmez.' },
      bloklar: [
        { t: 'p', ilk: true, x: 'İbnü\'l-Heysem (965 civarı – 1040 civarı) Basra\'da doğdu; ömrünün önemli bir kısmını Kahire\'de geçirdi. Yazdığı *Kitâbü\'l-Menâzır,* ışığın ve görmenin bilimini yeniden kurdu.' },
        { t: 'p', x: 'Eski düşünürlerin bir kısmı, gözden çıkan ışınların nesnelere dokunduğu için gördüğümüzü düşünüyordu. İbnü\'l-Heysem tersini savundu: ışık nesnelerden yansıyarak göze gelir. Bunu yalnız akıl yürüterek değil, deneylerle göstermeye çalıştı.' },
        { t: 'info', id: 'karanlikOda', baslik: 'Karanlık oda' },
        { t: 'p', x: 'Karanlık bir odanın duvarındaki küçük bir delikten giren ışık, karşı duvarda dışarıdaki manzaranın ters bir görüntüsünü oluşturur. Bugünkü fotoğraf makinesinin İngilizce adı *camera,* Latincede "oda" anlamına gelen kelimeden gelir.' },
        { t: 'h', x: 'Yöntemin dersi' },
        { t: 'p', ilk: true, x: 'İbnü\'l-Heysem\'in en kalıcı mirası, bir iddiayı gözlem ve deneyle sınama ısrarıdır. Ona göre hakikati arayan kişi, okuduğu otoritelere bile körü körüne güvenmemeli; onları dikkatle incelemeli ve sınamalıdır.' },
        { t: 'kutu', baslik: 'Sen de dene', x: 'Bir ayakkabı kutusunun bir ucuna iğneyle küçük bir delik aç. Karşı ucu kesip yerine yağlı kâğıt ya da pişirme kâğıdı yapıştır. Başını bir örtüyle örtüp kutuyu aydınlık bir pencereye doğru tut: kâğıtta dışarının ters görüntüsünü göreceksin. Güneşe asla doğrudan bakma.' },
      ],
    },

    {
      id: 'harezmi',
      no: 3,
      kicker: 'Matematik',
      baslik: 'Kayıp parçayı yerine koymak',
      alt: '"Cebir" bir kitabın adından, "algoritma" bir âlimin adından gelir.',
      kisa: 'Harezmî',
      renk: MECMUA.sayi,
      buyuk: { x: 'x = 3', alt: 'Harezmî\'nin ünlü örneği: "bir kare ve on kökü otuz dokuza eşittir."' },
      bloklar: [
        { t: 'p', ilk: true, x: 'Muhammed b. Mûsâ el-Hârizmî, 9. yüzyılda Bağdat\'ta, Beytü\'l-Hikme çevresinde çalıştı. Halife Me\'mûn\'a ithaf ettiği cebir kitabı, denklemleri sistemli biçimde çözmeyi öğretti ve cebirin bağımsız bir ilim dalı olarak kurulmasında en etkili eserlerden biri oldu.' },
        { t: 'p', x: '*Cebr,* kırık bir şeyi yerine oturtmak demektir: denklemde eksik tarafı tamamlamak. Kitabın adından gelen "cebir" bugün matematiğin bir dalının adıdır. Harezmî\'nin adının Latince söylenişi *Algoritmi* ise "algoritma" kelimesine dönüştü.' },
        { t: 'p', x: 'Harezmî kitabı neden yazdığını da anlatır: insanların miras paylaşımında, vasiyette, davalarda ve ticarette; arazi ölçmede ve kanal kazmada sürekli ihtiyaç duyduğu hesapları kolaylaştırmak. Kitabında hiç sembol yoktur; her şey kelimelerle ve şekillerle anlatılır.' },
        { t: 'info', id: 'kareTamamla', baslik: 'Kareyi tamamlamak' },
        { t: 'kutu', baslik: 'Sen de dene', x: 'x² + 6x = 16 denklemini aynı yöntemle çöz. İpucu: 6x\'i dört şeride böl (her biri 1,5x) ve köşelere dört küçük kare ekle; her biri 1,5 × 1,5. Büyük karenin alanı kaç olur, kenarı kaç olur? (Cevap: x = 2)' },
      ],
    },

    {
      id: 'cezeri',
      no: 4,
      kicker: 'Mühendislik',
      baslik: 'Su ile çalışan akıl',
      alt: '1206\'da tamamlanan bir kitap: elli düzenek, her birinin çizimi ve yapılış tarifi.',
      kisa: 'Cezerî',
      renk: MECMUA.makine,
      buyuk: { x: '50', alt: 'Cezerî\'nin kitabında çizimleri ve yapılışıyla anlatılan düzenek sayısı' },
      bloklar: [
        { t: 'p', ilk: true, x: 'Bedîüzzamân el-Cezerî, Artuklu sarayında, bugünkü Diyarbakır\'da çalışan bir mühendisti. 1206\'da tamamladığı kitabında elli düzeneği ayrıntılı çizimleriyle anlattı.' },
        { t: 'p', x: 'Kitabın adı bile bir felsefe taşır: *İlim ile amelin birleştiği faydalı eser.* Cezerî yalnız fikir anlatmaz; parçaların ölçüsünü ve yapılış sırasını yazar ki okuyan kişi düzeneği kendisi yapabilsin.' },
        { t: 'info', id: 'cezeri', baslik: 'Elli düzenek, altı bölüm' },
        { t: 'p', x: 'Fil saati, su yükselten makineler, kendiliğinden su döken abdest ibrikleri… Bu düzeneklerde kullanılan krank, dişli ve şamandıralı denetim gibi çözümler, makine tarihinin önemli halkaları arasında anılır.' },
        { t: 'kutu', baslik: 'Etrafına bak', x: 'Evindeki klozet rezervuarının kapağını aç: su yükseldikçe yükselen bir şamandıra, belli bir seviyede suyu keser. Bu tür şamandıralı denetim düzenekleri Cezerî\'nin kitabında da yer alır. Bugün kullandığımız pek çok otomatik aletin atası, bu kadar basit bir fikirdir.' },
      ],
    },

    {
      id: 'ulugbey',
      no: 5,
      kicker: 'Gökbilim',
      baslik: 'Bir yılın uzunluğu',
      alt: 'Semerkant\'ta dev bir duvar kadranı ve saniyelerle ölçülen bir yıl.',
      kisa: 'Uluğ Bey',
      renk: MECMUA.gok,
      buyuk: { x: '58 sn', alt: 'Uluğ Bey\'in yıldız yılı ölçümü ile bugünkü değer arasındaki fark' },
      bloklar: [
        { t: 'p', ilk: true, x: 'Timur\'un torunu Uluğ Bey (1394–1449) hem hükümdar hem gökbilimciydi. Semerkant\'ta bir medrese, 1420\'lerde de büyük bir gözlemevi kurdu. Kadızâde-i Rûmî, Gıyâseddin Cemşîd el-Kâşî ve Ali Kuşçu gibi âlimlerle birlikte çalıştı.' },
        { t: 'p', x: 'Gözlemevinin kalbi, yerin altına doğru inen dev bir meridyen kadranıydı. Burada yapılan gözlemler *Zîc-i Sultânî* adlı eserde toplandı: bin civarında yıldızın konumu ve ayrıntılı gökbilim tabloları.' },
        { t: 'info', id: 'yildizYili' },
        { t: 'p', x: 'Ali Kuşçu daha sonra İstanbul\'a geldi ve Fatih döneminde Ayasofya medresesinde ders verdi. 1577\'de Takiyüddin, İstanbul\'da bir gözlemevi kurdu. Bilgi bir şehirden ötekine, bir hocadan talebesine böyle taşındı.' },
        { t: 'ayet', s: 3, a: 190 },
      ],
    },

    {
      id: 'harita',
      no: 6,
      kicker: 'Coğrafya',
      baslik: 'Haritadaki dünya',
      alt: 'Sicilya\'da çizilen bir dünya ve Gelibolulu bir denizcinin haritası.',
      kisa: 'İdrîsî ve Pîrî Reis',
      renk: MECMUA.tarih,
      buyuk: { x: '1513', alt: 'Pîrî Reis\'in dünya haritasının yılı' },
      bloklar: [
        { t: 'p', ilk: true, x: 'İdrîsî, 1154\'te Sicilya Kralı II. Roger için bir dünya haritası ve onu anlatan bir coğrafya kitabı hazırladı. Kitapta şehirler, yollar, ırmaklar ve aralarındaki mesafeler, gezginlerden toplanan bilgilerle anlatılır. Bu haritada güney yukarıdadır.' },
        { t: 'p', x: 'Pîrî Reis 1513\'te bir dünya haritası çizdi. Haritanın bugüne ulaşan parçası İstanbul\'da, Topkapı Sarayı Müzesi\'nde korunur; Atlas Okyanusu\'nu, Avrupa ve Afrika kıyılarını ve Amerika kıyılarını gösterir. Pîrî Reis, haritayı hazırlarken yararlandığı kaynakları da not etmiştir; bunların arasında Kolomb\'un bir haritası da vardır.' },
        { t: 'p', x: '1521\'de tamamladığı *Kitâb-ı Bahriye,* Akdeniz\'in limanlarını, kıyılarını, akıntılarını ve tehlikeli sığlıklarını anlatan bir denizcilik rehberidir. Bilgi, denizcinin hayatını kurtaran bir emanetti.' },
        { t: 'kutu', baslik: 'Haritaya bak', x: 'Yaşadığın şehrin enlem ve boylamını bul. Kâbe\'nin yönünü bulmak da aslında küre üzerinde bir geometri problemidir: düz bir haritada çizilen çizgi ile küre üzerindeki en kısa yol aynı değildir. Uygulamadaki Kıble sayfası bu hesabı senin için yapar.' },
        { t: 'ayet', s: 30, a: 22 },
      ],
    },

    {
      id: 'sanat',
      no: 7,
      kicker: 'Sanat ve mimari',
      baslik: 'Pergelle çizilen sonsuzluk',
      alt: 'İki kareden bir yıldız, bir yıldızdan bir kubbe.',
      kisa: 'Geometri ve Sinan',
      renk: MECMUA.sanat,
      buyuk: { x: '1568–1575', alt: 'Edirne\'deki Selimiye Camii\'nin yapım yılları' },
      bloklar: [
        { t: 'p', ilk: true, x: 'İslam sanatında geometrik desenler pergel ve cetvelle çizilir. Bir daire, içine yerleştirilen kareler ve çokgenler tekrar edilerek bir duvarı, bir kapıyı, bir tavanı kaplar. Desen kenarda bitmez; sanki çerçevenin dışına doğru sonsuza kadar sürer.' },
        { t: 'info', id: 'yildiz8', baslik: 'Sekiz köşeli yıldız' },
        { t: 'p', x: 'Mimar Sinan (1490 civarı – 1588) uzun ömründe yüzlerce yapı inşa etti. Hatıralarına göre Şehzade Camii onun çıraklık, Süleymaniye kalfalık, Edirne\'deki Selimiye ise ustalık eseridir. Selimiye 2011\'de UNESCO Dünya Mirası Listesi\'ne alındı.' },
        { t: 'p', x: 'Selimiye\'nin kubbesi sekiz büyük ayak üzerine oturur. Sekizli düzen, desenlerdeki sekiz köşeli yıldızla aynı geometrinin dilini konuşur: küçük bir süsten dev bir kubbeye kadar aynı ölçü.' },
        { t: 'kutu', baslik: 'Sen de dene', x: 'Pergelle bir daire çiz. Daireye içten değen bir kare çiz. Sonra aynı daireye, ilkine göre 45 derece döndürülmüş ikinci bir kare çiz. Sekiz köşeli yıldız kendiliğinden ortaya çıkacak. Ortasına küçük bir daire ekle ve deseni yan yana tekrar et.' },
      ],
    },

    {
      id: 'karaviyyin',
      no: 8,
      kicker: 'Tarih',
      baslik: 'Bir kadının kurduğu okul',
      alt: '859, Fes: mirasını ilme vakfeden Fâtıma el-Fihrî.',
      kisa: 'Karaviyyîn',
      renk: '#8A4F2A',
      buyuk: { x: '859', alt: 'Karaviyyîn\'in kuruluşu · Fes, Fas' },
      bloklar: [
        { t: 'p', ilk: true, x: 'Fâtıma el-Fihrî, ailesiyle birlikte Kayrevan\'dan Fes\'e göç etmiş varlıklı bir tüccarın kızıydı. Kendisine kalan mirasla 859 civarında Fes\'te bir mescit yaptırdı. Adını ailenin geldiği Kayrevan şehrinden alan Karaviyyîn, zamanla büyük bir ilim merkezine dönüştü.' },
        { t: 'p', x: 'UNESCO ve Guinness Dünya Rekorları, Karaviyyîn\'i günümüze kadar eğitime devam eden en eski kurum olarak anar. Modern bir üniversite olarak yeniden düzenlenmesi ise 1963\'te oldu.' },
        { t: 'p', x: 'Bu hikâye bir vakıf medeniyetinin hikâyesidir: mal, kalıcı bir hayra dönüştüğünde sahibinden yüzyıllarca sonra bile insanlara fayda vermeye devam eder.' },
        { t: 'hadis', x: 'İnsan ölünce ameli kesilir; ancak üç şey müstesna: sadaka-i câriye, kendisinden faydalanılan ilim ya da kendisine dua eden hayırlı evlat.', k: 'Müslim 1631', r: 'Ebû Hüreyre', d: 'Sahih' },
      ],
    },

    {
      id: 'tefekkur',
      no: 9,
      kicker: 'Tefekkür',
      baslik: 'Bakmak ve görmek',
      alt: 'Bir arının yolculuğu, renk renk dağlar ve âlimin huşûsu.',
      kisa: 'Tefekkür sayfası',
      renk: MECMUA.yer,
      bloklar: [
        { t: 'ayet', s: 16, a: [68, 69] },
        { t: 'p', ilk: true, x: 'Bir arı kovanı, binlerce canlının iş bölümüyle yaşayan bir şehir gibidir. Çiçekten çiçeğe uçan arı, hem bal yapar hem de bitkilerin tozlaşmasına yardım eder. Kur\'an bize bu küçük canlıya bakmamızı ve düşünmemizi söyler.' },
        { t: 'ayet', s: 35, a: 28 },
        { t: 'p', x: 'Bu âyet, renk renk dağlardan, insanlardan ve hayvanlardan söz ettikten sonra âlimleri anar. Bakmayı bilen göz, gördüğü çeşitlilikte Yaratıcının ölçüsünü fark eder ve huşû duyar. Belki de bilimin en güzel sonucu, insanı tevazua götürmesidir.' },
        { t: 'kutu', baslik: 'Bu hafta', x: 'Bir hafta boyunca her gün beş dakika aynı yere (bir ağaca, bir saksıya, gökyüzüne) bak ve gördüğün bir şeyi not et. Hafta sonunda notlarını oku. Bakmakla görmek arasındaki farkı kendin keşfedeceksin.' },
      ],
    },

    {
      id: 'kaynaklar',
      no: null,
      kicker: 'Kaynaklar',
      baslik: 'Bu sayının kaynakları',
      alt: 'Rakamları ve tarihleri nereden aldık?',
      kisa: 'Kaynaklar',
      renk: MECMUA.soluk,
      bloklar: [
        {
          t: 'liste',
          x: [
            'MacTutor Matematik Tarihi Arşivi, St Andrews Üniversitesi: Harezmî ve Uluğ Bey maddeleri.',
            'Bîrûnî\'nin Nandana\'da dağ tepesinden yaptığı Dünya yarıçapı ölçümü üzerine yayımlanmış çalışmalar (≈ 6.340 km).',
            'Zîc-i Sultânî ve Uluğ Bey Gözlemevi üzerine yayımlanmış çalışmalar (yıldız yılı: 365 g 6 sa 10 dk 8 sn).',
            'UNESCO ve Guinness Dünya Rekorları kayıtları: Karaviyyîn.',
            'UNESCO Dünya Mirası: Selimiye Camii ve Külliyesi (2011).',
            'Cezerî, el-Câmi\' beyne\'l-ilm ve\'l-amel en-nâfi\' fî sınâati\'l-hiyel (1206).',
            'Âyet mealleri: Türkçe Tercüme — Rowad Tercüme Merkezi, QuranEnc.com (değiştirilmeden).',
          ],
        },
        { t: 'not', x: 'Tarihler ve rakamlar yayından önce TDV İslâm Ansiklopedisi\'nin ilgili maddeleriyle yeniden karşılaştırılacaktır. Hata görürsen bize yaz; bir sonraki baskıda düzeltiriz.' },
      ],
    },
  ],
};

export default mecmua;
