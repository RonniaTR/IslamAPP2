// Siyer verisi — uygulamaya özgü özet anlatım.
// Konu sıralamasında Osman Keskioğlu'nun Siyer-i Nebî'sinden yararlanılmıştır (bkz. data/sources.json → siyer).
// TELİF DENETİMİ (docs/YENI_OZELLIKLER.md 0.1, madde 5): metinlerin kitapla cümle cümle karşılaştırması
// kitap elde olmadan YAPILAMADI. Kitapla birebir örtüşen cümle bulunursa özgün olarak yeniden yazılmalıdır.
export const SIYER_UNITS = [
  {
    id: 'mekke-oncesi',
    title: 'ÜNİTE I: İslamiyet\'ten Önce Arabistan',
    period: 'Cahiliye Dönemi & Mekke',
    icon: '🕋',
    summary: 'İslam gelmeden önce Arabistan\'ın durumu, Mekke ve Kâbe\'nin önemi, Kâbe\'deki görevler, Zemzem kuyusunun temizlenmesi ve Fil Vakası.',
    topics: [
      {
        title: 'a) Arapların Durumu',
        content: 'İslamiyet’ten önce Arabistan yarımadası karanlık bir cehalet devri yaşamaktaydı. Kabileler birbiriyle savaşır, putlara taparlardı. Kadın hakları yoktu, kız çocukları diri diri toprağa gömülürdü. İnsanlık bu durumdan kurtaracak bir peygamberin gelmesini bekliyordu.'
      },
      {
        title: 'b) Mekke ve Kâbe',
        content: 'Arabistan’ın en kutsal şehri Mekke’dir. Kâbe’yi Hz. İbrahim ile oğlu Hz. İsmail bina etmişlerdir. Kâbe ibadet evi olarak kullanılırken, sonraları Araplar buraya put doldurmuşlardı.'
      },
      {
        title: 'c) Kâbe’deki Vazifeler',
        content: 'Kâbe vazifeleri şunlardı: 1- Hicabet (Kâbe anahtarlarını saklamak), 2- Sikaye (Hacılara su temin etmek, Zemzem suyunun bakımı), 3- Rifade (Hacıları ağırlamak), 4- Nedve (Darun-Nedve’de toplanmak), 5- Liva (Sancaktarlık), 6- Kıyade (Komutanlık).'
      },
      {
        title: 'd) Zemzem Kuyusunun Temizlenmesi',
        content: 'Hz. Peygamber’in dedesi Abdülmuttalib, rüyasında aldığı ilhamla Cürhümlülerin kapattığı Zemzem kuyusunun yerini kazarak temizledi. İçinden altın geyikler ve zırhlar çıktı. Su tekrar gürül gürül akmaya başladı.'
      },
      {
        title: 'e) Ebrehe’nin Kâbe’ye Saldırması (Fil Vakası)',
        content: 'Yemen Valisi Ebrehe, San’a’da büyük bir tapınak yaptırıp Arapları oraya çekmek istedi. Başaramayınca fillere donatılmış dev ordusuyla Kâbe’yi yıkmak için Mekke’ye yürüdü. Abdülmuttalib: "Ben develerin sahibiyim. Kâbe’nin sahibi var, O korur" dedi. Yüce Allah Ebabil kuşlarını göndererek Ebrehe’nin ordusunu helak etti (Fil Suresi).'
      }
    ]
  },
  {
    id: 'cocukluk-genclik',
    title: 'ÜNİTE II: Doğumu, Çocukluğu ve Gençliği',
    period: '571 - 610 (Miladi)',
    icon: '✨',
    summary: 'Peygamber Efendimizin doğumu, sütannesi Halime’nin yanında yetişmesi, annesinin ve dedesinin vefatı, amcası Ebu Talib’in himayesi, Hz. Hatice ile evliliği ve Kâbe Hakemliği.',
    topics: [
      {
        title: 'a) Doğumu ve Soyu',
        content: '571 yılı 20 Nisan (12 Rebiülevvel) gecesi Mekke’de doğdu. Doğduğu gece Kisra’nın sarayının sütunları yıkıldı, Mecusilerin bin yıldır yanan ateşi söndü, Save gölü kurudu. Babası Abdullah o doğmadan vefat etmişti. Dedesi Abdülmuttalib ona "Gökte Hak, yerde halk övsün" diye "Muhammed" adını verdi.'
      },
      {
        title: 'b) Sütannesi Halime ve Çocukluğu',
        content: 'Mekke’nin havası ağır olduğu için bebekler çöle sütannelere verilirdi. Sa’d kabilesinden Halime onu emzirdi. Halime’nin evine bereket yağdı. 5 yaşına kadar çölde kaldı. 6 yaşında iken annesi Âmine ile Medine’deki babasının kabrini ziyarete gitti. Dönüşte Ebva köyünde annesi Âmine vefat etti. Ona sadık hizmetçi Ümmü Eymen baktı.'
      },
      {
        title: 'c) Ebu Talib’in Himayesi ve Şam Yolculuğu',
        content: '8 yaşında dedesi Abdülmuttalib de vefat edince amcası Ebu Talib’in himayesine girdi. Ebu Talib onu öz evladından çok sevdi. 12 yaşında iken amcasıyla Şam’a ticaret kervanıyla gitti. Busra kasabasında Rahip Bahira, onda Son Peygamber alametlerini sezdi ve Ebu Talib’e onu korumasını tembihledi.'
      },
      {
        title: 'd) Hz. Hatice İle Evlenmesi & Muhammedü’l-Emin',
        content: 'Doğruluğu ve güvenirliği nedeniyle Mekkeliler ona "Muhammedü’l-Emin" (Güvenilir Muhammed) derlerdi. Mekke’nin soylu ve iffetli kadını Hz. Hatice, kervanının başına onu getirdi. Ticaretteki bereketi ve ahlakına hayran kalarak evlenme teklif etti. O zaman Peygamberimiz 25, Hz. Hatice 40 yaşında idi.'
      },
      {
        title: 'e) Kâbe Hakemliği',
        content: '35 yaşında iken Kâbe selden zarar görüp yeniden inşa edildi. Hacer-i Esved’i yerine koyma konusunda kabileler birbirine girdi. "Safa kapısından ilk giren hakem olsun" dediler. Peygamberimizi görünce "İşte El-Emin geliyor!" diye sevindiler. Peygamberimiz hırkasını serip Hacer-i Esved’i üstüne koydu, her kabile reisine hırkanın ucundan tutturup taşı kaldırttı. Adaletli çözümü herkesi memnun etti.'
      }
    ]
  },
  {
    id: 'vahiy-mekke',
    title: 'ÜNİTE III: Vahyin Başlaması ve Mekke Dönemi',
    period: '610 - 622 (Miladi)',
    icon: '📖',
    summary: 'Hira Dağı’nda ilk vahiy, ilk Müslümanlar, açıktan davet, çileli yıllar, Taif yolculuğu ve İsra-Mi\'rac mucizesi.',
    topics: [
      {
        title: 'a) Hira’da İnziva ve İlk Vahiy',
        content: '40 yaşına geldiğinde Mekke yakınlarındaki Hira Dağı’ndaki mağarada ibadet ve tefekkür ederdi. 610 yılı Ramazan ayında Cebrail (a.s.) geldi ve "Oku!" buyurdu. Alak Suresi’nin ilk 5 ayeti nazil oldu: "Yaratan Rabbinin adıyla oku..."'
      },
      {
        title: 'b) İlk Müslümanlar',
        content: 'İlk iman edenler: Kadınlardan Hz. Hatice, çocuklardan Hz. Ali, azadlı kölelerden Hz. Zeyd b. Harise, yetişkin erkeklerden Hz. Ebu Bekir’dir. Hz. Ebu Bekir’in vesilesiyle Hz. Osman, Hz. Abdurrahman b. Avf, Hz. Talha ve Hz. Zübeyr Müslüman oldu.'
      },
      {
        title: 'c) Açıktan Davet ve İşkenceler',
        content: '3 yıl gizli davetten sonra "Sana emrolunanı açıktan açıkla..." (Hicr 94) ayeti gelince Safa tepesine çıkıp tüm Mekkelileri tevhide çağırdı. Amcası Ebu Leheb şiddetle karşı çıktı. Bilal-i Habeşi, Ammar b. Yasir, Habbab b. Eret gibi kimsesiz Müslümanlara ağır işkenceler yapıldı.'
      },
      {
        title: 'd) Habeşistan Hicreti ve Boykot Yılları',
        content: 'Baskılar artınca Peygamberimizin izniyle Müslümanlar adaletli hükümdar Necaşi’nin ülkesi Habeşistan’a hicret etti (615-617). Müşrikler Müşrikler Müslümanlara 3 yıl süren ağır bir iktisadi ve sosyal boykot uyguladı.'
      },
      {
        title: 'e) Hüzün Yılı & Mi\'rac Mucizesi',
        content: 'Boykotun kalkmasından kısa süre sonra amcası Ebu Talib ve eşi Hz. Hatice vefat etti. Bu yıla "Senetü’l-Hüzn" (Hüzün Yılı) dendi. Ardından Peygamberimiz Taif’e gitti fakat taşlandı. Cenab-ı Hak kulunu Teselli etmek için Mescid-i Haram’dan Mescid-i Aksa’ya (İsra) ve oradan göklere (Mi\'rac) yükseltti. 5 vakit namaz Mi\'rac’ta farz kılındı.'
      }
    ]
  },
  {
    id: 'hicret-medine',
    title: 'ÜNİTE IV: Medine’ye Hicret ve İslam Devleti',
    period: '622 - 632 (Miladi)',
    icon: '🌴',
    summary: 'Akabe Biatları, Sevr Mağarası, Medine’ye hicret, Mescid-i Nebevi, Kardeşlik (Muahat), Gazveler, Mekke’nin Fethi ve Veda Haccı.',
    topics: [
      {
        title: 'a) Akabe Biatları ve Medine’ye Hicret',
        content: 'Medineli Evs ve Hazreç kabileleri Akabe’de Peygamberimize biat ettiler. İslam Medine’de hızla yayıldı. 622’de Peygamberimiz Hz. Ebu Bekir ile Sevr mağarasına sığınarak Medine’ye hicret etti. Sevr’de örümcek ve güvercin mucizesi yaşandı.'
      },
      {
        title: 'b) Medine’de İlk Günler: Mescid-i Nebevi & Muahat',
        content: 'Kuba’da ilk mescid yapıldı ve ilk Cuma namazı kılındı. Medine’ye girince devesi Kasva’nın çöktüğü yere Mescid-i Nebevi inşa edildi. Mekke’den gelen Muhacirler ile Medineli Ensar arasında tarihte eşi olmayan bir Kardeşlik (Muahat) tesis edildi.'
      },
      {
        title: 'c) Büyük Savaşlar: Bedir, Uhud, Hendek',
        content: '624 Bedir Zaferi: 300 kişilik İslam ordusu 1000 kişilik müşrik ordusunu yendi. 625 Uhud Savaşı: Okçuların tepeden ayrılmasıyla çetin bir imtihan yaşandı, Hz. Hamza şehit oldu. 627 Hendek Savaşı: Selman-ı Farisi’nin teklifiyle Medine çevresine hendek kazıldı, fırtına ile müşrikler helak oldu.'
      },
      {
        title: 'd) Hudeybiye Barışı ve Mekke’nin Fethi (630)',
        content: '628 Hudeybiye Barış Antlaşması zaferin kapısını açtı. 630 yılında 10.000 kişilik orduyla Mekke tek damla kan dökülmeden fethedildi. Kâbe putlardan temizlendi. Peygamberimiz kendisini yıllarca sürgün eden Mekkelileri "Bugün size kınama yok, hepiniz serbestsiniz!" diyerek affetti.'
      },
      {
        title: 'e) Veda Haccı ve İrtihali (632)',
        content: '100.000 Müslümana Arafat’ta Veda Hutbesi’ni irad etti. Evrensel insan hakları prensiplerini ilan etti: "Arap’ın Arap olmayana üstünlüğü yoktur. Üstünlük ancak takvadadır." 8 Haziran 632 (12 Rebiülevvel) tarihinde Medine’de "Refik-i A\'la"ya (Yüce Dost\'a) ulaştı.'
      }
    ]
  }
];
