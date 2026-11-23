// 📰 HİKMET MECMUASI — Sayı 2: Şifa, Su ve Merhamet
// Tıp tarihi, darüşşifalar, cerrahi aletler ve vakıf medeniyetinde merhamet mimarisi.
// Kural: tarih ve sayı veren her bilginin kaynağı en sondaki Kaynaklar bölümündedir;
// âyet mealleri doğrudan meal paketinden (QuranEnc) değiştirilmeden gelir.
import { MECMUA } from '../../pages/musluman/tema';

const mecmua2 = {
  id: 'hikmet-mecmuasi-2',
  tema: 'mecmua',
  baslik: 'Hikmet Mecmuası',
  kisaAd: 'Hikmet Mecmuası · Sayı 2',
  alt: 'Şifa, Su ve Merhamet',
  sayi: 'Sayı 2 · Kasım 2026',
  konu: 'Şifa, Su ve Merhamet',
  kapakSatirlari: [
    [MECMUA.yer, "İbn Sînâ ve el-Kânûn: Gözlem ve denge"],
    [MECMUA.makine, 'Zehrâvî: 200 cerrahi alet ve eriyen iplik'],
    [MECMUA.gok, 'Darüşşifalar: Su sesi ve makamlarla şifa'],
    [MECMUA.tarih, 'Taş cephede kuş sarayları ve vakıflar'],
  ],
  gelecek: {
    baslik: 'Söz, Kalem ve Kağıt',
    x: 'Semerkant kağıdı, kütüphaneler, hat ve tezhip sanatında altın oran, tercüme hareketleri. Bir sonraki sayıda.',
  },
  onSayfalar: ['kapak', 'icindekiler'],
  sonSayfalar: ['arka'],

  bolumler: [
    {
      id: 'editor2',
      no: null,
      kicker: 'Editörden',
      baslik: 'İnsanı yaşatan merhamet',
      alt: 'Beden bir emanettir; şifayı aramak, yarayı sarmak ve her canlıya şefkat göstermek bu emanetin hakkıdır.',
      kisa: 'Editörden',
      renk: MECMUA.yer,
      buyuk: { x: 'Sayı 2', alt: 'Şifa, Su ve Merhamet · beş makale, iki mimari kesit' },
      bloklar: [
        { t: 'ayet', s: 16, a: 69 },
        {
          t: 'p',
          ilk: true,
          x: 'İlk sayımızda gökyüzünü ve yeri ölçen âlimlerin izini sürmüştük. Bu ikinci sayıda bakışımızı *insana ve canlılara* çeviriyoruz: İslam medeniyetinde hekimlik, cerrahi, hastane mimarisi ve bir kuşun bile üşümemesini dert edinen vakıf ahlâkı.',
        },
        {
          t: 'hadis',
          r: 'Üsâme b. Şerîk (r.a.) anlatıyor',
          x: 'Ey Allah’ın kulları, tedavi olunuz! Çünkü Allah Teâlâ, ihtiyarlık dışında yarattığı her derdin şifasını da yaratmıştır.',
          k: 'Ebû Dâvûd, Tıbb 1 (3855) · Tirmizî, Tıbb 2 (2038)',
          d: 'Sahih',
        },
        {
          t: 'p',
          x: 'Bu nebevî çağrı, hastalığı çaresiz bir kader gibi görmeyi reddedip araştırma ve tedavi kapısını açtı. Şam, Bağdat, Kahire, Kayseri, Sivas, Divriği ve Edirne’de kurulan darüşşifalar; zengin-fakir, Müslüman-gayrimüslim ayrımı yapmadan her hastayı ücretsiz ağırlayan birer şefkat ocağına dönüştü.',
        },
      ],
    },

    {
      id: 'ibnsina',
      no: 1,
      kicker: 'Hekimlik',
      baslik: "İbn Sînâ ve el-Kânûn'un yöntemi",
      alt: 'Hastalığı yalnız belirtisiyle değil; su, hava, uyku, beslenme ve ruh hâliyle birlikte okumak.',
      kisa: 'İbn Sînâ',
      renk: MECMUA.yer,
      buyuk: { x: '5 Cilt', alt: "el-Kânûn fi't-Tıbb · 17. yüzyıla dek tıp medreselerinin temel başvuru eseri" },
      bloklar: [
        {
          t: 'p',
          ilk: true,
          x: "Ebû Alî el-Hüseyn b. Abdillâh İbn Sînâ (980–1037) Buhara yakınlarında doğdu. Genç yaşta felsefe, matematik ve tıp tahsil etti. En ünlü tıp eseri *el-Kânûn fi't-Tıbb*, kendisinden önceki Yunan, Hint ve İslam tıp birikimini kendi klinik gözlemleriyle birleştiren beş ciltlik düzenli bir ansiklopedidir.",
        },
        { t: 'h', x: 'Klinik gözlemde dört ilke' },
        {
          t: 'liste',
          x: [
            '*Koruyucu hekimlik:* Hastalık gelmeden önce temiz su, dengeli uyku, ölçülü hareket ve beslenmeyle sağlığı korumak.',
            '*Bulaşma gözlemi:* Bazı hastalıkların sudaki ve havadaki gözle görünmeyen çok küçük unsurlarla insandan insana geçebileceğini kaydetmesi.',
            '*Nabız ve muayene:* Nabzın hızını, düzenini, dolgunluğunu ve ritmini onlarca alt başlıkta sınıflandırarak teşhiste kullanması.',
            '*İlaç denemesi:* Yeni bir ilacın etkisini doğru anlamak için tek bir hastalık üzerinde, yan etkilerden arındırılmış koşullarda denenmesi gerektiğini şart koşması.',
          ],
        },
        {
          t: 'kutu',
          baslik: 'Sen de dene',
          x: 'Sağ işaret ve orta parmağını sol bileğinin iç kısmına koy. 15 saniye boyunca kalp atışını say ve 4 ile çarp. Sonra 1 dakika boyunca burnundan derin ve yavaş nefes alıp ver (4 saniye al, 6 saniye ver) ve nabzını yeniden ölç. Sakin nefesin kalp ritmini nasıl yatıştırdığını gözlemle.',
        },
      ],
    },

    {
      id: 'zehravi',
      no: 2,
      kicker: 'Cerrahi',
      baslik: 'Zehrâvî ve iyileştiren eller',
      alt: 'Kurtuba’da bir cerrah: 200’den fazla aletin çizimi ve vücutta kendiliğinden eriyen dikiş ipliği.',
      kisa: 'Zehrâvî',
      renk: MECMUA.makine,
      buyuk: { x: '200+ Alet', alt: 'et-Tasrîf kitabının 30. cildinde ölçüleriyle çizilmiş cerrahi aletler' },
      bloklar: [
        {
          t: 'p',
          ilk: true,
          x: "Ebü'l-Kâsım ez-Zehrâvî (ö. 1013 civarı), Endülüs’ün Kurtuba şehri yakınlarındaki Medînetüzzehrâ’da yaşadı. Otuz ciltlik tıp ansiklopedisi *et-Tasrîf*'in son cildini tamamen cerrahiye ayırdı. Bu cilt, tıp tarihinde cerrahi aletlerin ilk kez resimleriyle ve yapım malzemeleriyle anlatıldığı eserdir.",
        },
        {
          t: 'p',
          x: 'Zehrâvî aletleri yalnızca çizmekle kalmadı; ameliyat sırasında dokuyu incitmeyecek biçimde kendi elleriyle tasarladı. Kemiği koruyan ince testereler, boğaza kaçan yabancı cismi çıkaran kıskaçlar ve göz ameliyatı için ince uçlu iğneler geliştirdi.',
        },
        {
          t: 'p',
          x: 'İç yaraların dikilmesinde hayvan bağırsağından elde edilen doğal ipliğin (*katgüt*) vücut tarafından zamanla eritilip kabul edildiğini gözlemledi. Ayrıca cerrah adaylarına şu öğüdü bıraktı: *“Anatomi bilmeyen ve hastasına şefkat duymayan el, bıçağa uzanmamalıdır.”*',
        },
      ],
    },

    {
      id: 'darussifa',
      no: 3,
      kicker: 'Şifa mimarisi',
      baslik: 'Darüşşifalar: Su sesi ve makamlarla şifa',
      alt: 'Kayseri Gevher Nesibe (1206), Divriği (1228) ve Edirne II. Bayezid (1488) Darüşşifaları.',
      kisa: 'Darüşşifa',
      renk: MECMUA.gok,
      buyuk: { x: '1488', alt: 'Edirne II. Bayezid Darüşşifası · su sesi, musiki ve güzel kokuyla ücretsiz tedavi' },
      bloklar: [
        {
          t: 'p',
          ilk: true,
          x: 'İslam dünyasında hastaneler *bîmâristan*, *dârüşşifâ* (şifa evi) ya da *dârüssıhha* adıyla anıldı. Bu yapılar yalnız ilaç verilen yerler değil; hastanın gönlünü ferahlatacak biçimde tasarlanmış birer huzur mekânıydı.',
        },
        { t: 'info', id: 'darussifaPlani', baslik: 'Edirne Darüşşifası: Akustik Kubbe ve Şadırvan' },
        {
          t: 'p',
          x: 'Edirne’deki II. Bayezid Darüşşifası’nda hasta odaları merkezdeki büyük kubbeli avlunun çevresine dizilmişti. Avlunun tam ortasında şırıldayan şadırvanın su sesi, kubbenin akustiği sayesinde bütün odalara yumuşak bir dinginlikle yayılırdı.',
        },
        {
          t: 'p',
          x: 'Vakfiyeye göre haftanın belirli günlerinde hanende ve sazendeler gelir; hastaların hâline göre Rast, Hüseynî, Uşşak ve Nihavend makamlarında eserler icra ederdi. Odalara mevsim çiçekleri ve güzel kokular konur; taburcu olan fakir hastalara harçlık verilirdi.',
        },
      ],
    },

    {
      id: 'kusevleri',
      no: 4,
      kicker: 'Merhamet mimarisi',
      baslik: 'Taş cephede kuş sarayları ve vakıflar',
      alt: 'Cami duvarlarında serçeler için yapılan köşkler, sebiller ve göçmen kuşları koruyan vakıflar.',
      kisa: 'Kuş Evleri',
      renk: MECMUA.tarih,
      buyuk: { x: 'Merhamet', alt: '“Her canlıya yapılan iyilikte bir ecir (sevap) vardır.” (Buhârî, Müsâkât 9)' },
      bloklar: [
        {
          t: 'hadis',
          r: 'Ebû Hüreyre (r.a.) anlatıyor',
          x: 'Bir adam yolda yürürken çok susadı. Bir kuyu bulup indi ve su içti. Çıktığında susuzluktan nemli toprağı yalayan bir köpek gördü. “Bu hayvan da benim gibi susamış” diyerek kuyuya tekrar indi, mestini suyla doldurup köpeğe içirdi. Allah onun bu davranışından razı oldu ve kendisini bağışladı. Sahâbîler “Ey Allah’ın Resûlü, hayvanlara yaptığımız iyilikten dolayı da bize sevap var mı?” diye sorunca şöyle buyurdu: “Her canlıya yapılan iyilikte bir sevap vardır.”',
          k: 'Buhârî, Müsâkât 9 (2363) · Müslim, Selâm 153 (2244)',
          d: 'Sahih',
        },
        {
          t: 'p',
          ilk: true,
          x: 'Bu hadisin ruha işlediği şefkat, taş duvarlarda bile çiçek açtı. Selçuklu ve Osmanlı mimarları cami, medrese, han ve köprülerin rüzgâr almayan, sabah güneşini gören güney ve doğu cephelerine *kuş evleri* (kuş köşkleri) oydu.',
        },
        { t: 'info', id: 'kusEviMimarisi', baslik: 'Taş Cephede Kuş Sarayı Kesiti' },
        {
          t: 'p',
          x: 'Serçe, kırlangıç ve güvercinler hem kış soğuğundan korunsun hem de cami taşlarını yuvalarıyla aşındırmasın diye tasarlanan bu minyatür köşklerin önünde küçük tünekler, yağmur suyunu kesen geniş saçaklar ve su çanakları bulunurdu. Mezar taşlarının üstüne bile yağmur suyunun birikmesi için küçük *kuş sulukları* açılırdı.',
        },
        {
          t: 'kutu',
          baslik: 'Bugün senin penceren',
          x: 'Bugün pencerenin veya balkonunun güvenli bir köşesine kuşlar için temiz bir kap su koy. Sıcak veya soğuk günlerde sessiz bir canlının o sudan içmesi, asırlardır süren bu merhamet zincirinin senin evindeki halkasıdır.',
        },
      ],
    },

    {
      id: 'kaynaklar2',
      no: null,
      kicker: 'Kaynaklar',
      baslik: 'Bu sayının kaynakları',
      alt: 'Tarih, tıp ve mimari bilgileri için başvurulan temel eserler.',
      kisa: 'Kaynaklar',
      renk: MECMUA.soluk,
      bloklar: [
        {
          t: 'liste',
          baslik: 'Hadis ve temel kaynaklar',
          x: [
            '*Buhârî, el-Câmiu\'s-sahîh:* Müsâkât 9 (2363).',
            '*Müslim, el-Câmiu\'s-sahîh:* Selâm 153 (2244).',
            '*Ebû Dâvûd, es-Sünen:* Tıbb 1 (3855) · *Tirmizî, el-Câmi\':* Tıbb 2 (2038).',
            '*Âyet mealleri:* Rowad Tercüme Merkezi (QuranEnc `turkish_rwwad`), Nahl 16:69.',
          ],
        },
        {
          t: 'liste',
          baslik: 'Bilim ve medeniyet tarihi',
          x: [
            '*TDV İslâm Ansiklopedisi:* "İbn Sînâ", "el-Kânûn fi\'t-Tıbb", "Zehrâvî", "Bîmâristan", "Dârüşşifâ", "Kuş Evleri" ve "Vakıf" maddeleri (islamansiklopedisi.org.tr).',
            '*Edirne II. Bayezid Darüşşifası (1488):* Vakfiye kayıtları ve Trakya Üniversitesi Sultan II. Bayezid Külliyesi Sağlık Müzesi arşivi.',
            '*Cengiz Bektaş:* Kuş Evleri / Bird Houses, İstanbul.',
          ],
        },
      ],
    },
  ],
};

export default mecmua2;
