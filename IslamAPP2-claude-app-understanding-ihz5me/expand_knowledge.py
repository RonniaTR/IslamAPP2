#!/usr/bin/env python3
"""Expand knowledge_cards.json to 200+ items with level classification"""
import json, os

path = os.path.join(os.path.dirname(__file__), "backend", "data", "knowledge_cards.json")
with open(path, "r", encoding="utf-8") as f:
    cards = json.load(f)

# 1) Add level="basic" to all existing items that don't have one
for card in cards:
    for item in card["items"]:
        if "level" not in item:
            item["level"] = "basic"

# 2) Add deep-level items to existing categories
DEEP_ADDITIONS = {
    "tarihte_bugun": [
        {"title": "Kerbela Faciası (680)", "content": "Hz. Hüseyin, Yezid'in zulmüne karşı durarak Kerbela'da 72 kişilik ailesiyle birlikte şehit edildi. Bu olay İslam tarihinde en derin acılardan biridir. Hz. Hüseyin'in duruşu zulme karşı direnişin sembolü olmuştur. Rivayetlere göre gök kızıla boyandı ve toprak kan ağladı.", "level": "deep"},
        {"title": "Abbasîlerin Yükselişi (750)", "content": "Emevi hanedanının yıkılıp Abbasîlerin iktidara gelmesi İslam medeniyetinde altın çağı başlattı. Bağdat Beytu'l-Hikme (Hikmet Evi) ile bilimin merkezi oldu. Yunanca, Farsça ve Hintçe eserler Arapçaya tercüme edildi. İlim, felsefe ve tıpta devrim yaşandı.", "level": "deep"},
        {"title": "Malazgirt Meydan Muharebesi (1071)", "content": "Sultan Alparslan'ın Bizans İmparatoru Romanos Diogenes'i mağlup ettiği bu savaş, Anadolu'nun kapılarını Türklere açtı. Savaş öncesi Alparslan beyaz kefenini giyerek 'Bugün ben bir askerim' dedi. Bu zafer İslam-Türk tarihinin dönüm noktasıdır.", "level": "deep"},
        {"title": "Çanakkale Zaferi ve İslam Ruhu (1915)", "content": "Osmanlı askerlerinin imanla verdikleri mücadele, dünya tarihinin en destansı savunmalarından biridir. 'Allah Allah' nidalarıyla siperlerde dökülen kan, İslam'ın vatan savunmasını nasıl kutsadığını gösterir. Seyit Onbaşı'nın 275 kiloluk mermiyi tek başına kaldırması efsaneleşti.", "level": "deep"},
    ],
    "peygamber_hikmeti": [
        {"title": "Hz. İsa'nın Mucizeleri", "content": "Hz. İsa beşikte iken konuştu, ölüleri diriltti, körlerin gözlerini açtı ve çamurdan kuş yaparak can verdi. Tüm bunları Allah'ın izniyle yaptığını her fırsatta belirtti. İncil'de değil, Kur'an'da en detaylı şekilde anlatılan bu mucizeler, İslam'ın İsa'ya verdiği değeri gösterir.", "level": "deep"},
        {"title": "Hz. Âdem'in Yaratılışı ve Meleklerin Secdesi", "content": "Allah Hz. Âdem'i topraktan yaratarak ona ruhundan üfledi ve meleklere secde etmelerini emretti. İblis kibri yüzünden secde etmeyerek lanetlendi. Bu kıssa insanın şerefini, kibrin tehlikesini ve tövbenin önemini öğretir. Hz. Âdem hatasını fark edip tövbe etti ve affedildi.", "level": "deep"},
        {"title": "Hz. Hızır ve Hz. Musa Kıssası", "content": "Kehf Suresi'nde anlatılan bu kıssada Hz. Musa, ledün ilmine sahip Hz. Hızır ile yolculuk eder. Gemiyi delmesi, çocuğu öldürmesi ve duvarı düzeltmesi zahiren anlamsız görünse de her birinin derin hikmeti vardı. Bu kıssa bize Allah'ın kaderinde gizli hikmetler olduğunu öğretir.", "level": "deep"},
        {"title": "Hz. Lokman'ın Öğütleri", "content": "Kur'an'da bir sureye adı verilen Hz. Lokman, oğluna verdiği 7 büyük öğütle meşhurdur: Şirk koşma, namaz kıl, iyiliği emret, kötülükten men et, sabret, insanlara kibirlenme, yürürken mütevazı ol. Bu öğütler tüm zamanlar için evrensel bir ahlak rehberidir.", "level": "deep"},
    ],
    "bilgi_serisi": [
        {"title": "İslam'da Organ Bağışı Hükmü", "content": "Çağdaş İslam alimleri organ bağışını 'sadaka-i cariye' (sürekli sadaka) kapsamında değerlendirmektedir. Hayat kurtarmak Kur'an'da tüm insanlığı kurtarmaya denk tutulmuştur (Maide 32). Diyanet İşleri Başkanlığı ve İslam Fıkıh Akademisi bu konuda olumlu fetva vermiştir.", "level": "deep"},
        {"title": "Zekat Hesaplama Detayları", "content": "Zekat nisabı altın için 80.18 gram, gümüş için 561.2 gramdır. Kırkta bir (%2.5) oranında verilir. Altın, gümüş, nakit para, ticari mallar, tarım ürünleri zekata tabidir. Borçlar düşüldükten sonra nisaba ulaşan ve üzerinden bir kameri yıl geçen mala zekat farz olur.", "level": "deep"},
        {"title": "Namazın 12 Farzı", "content": "Namazın şartları (6 dış şart): Hadesten taharet, necasetten taharet, setr-i avret, istikbal-i kıble, vakit, niyet. Namazın rükünleri (6 iç şart): İftitah tekbiri, kıyam, kıraat, rükû, secde, ka'de-i ahîre. Bu 12 farz yerine gelmeden namaz sahih olmaz.", "level": "deep"},
        {"title": "İslam'da Rüya Tabiri İlmi", "content": "Hz. Yusuf'tan beri İslam geleneğinde rüya tabiri önemli bir ilimdir. İbn-i Sirin rüya tabiri ilminin babası kabul edilir. Peygamberimiz salih rüyayı nübüvvetin 46'da biri olarak nitelendirmiştir. Rüyalar sadık (gerçek), nefsani ve şeytani olmak üzere üçe ayrılır.", "level": "deep"},
        {"title": "İslam Hukuku'nun Temelleri", "content": "Fıkıh kaynakları: Kur'an (birincil kaynak), Sünnet (Peygamber uygulaması), İcma (alimlerin ittifakı) ve Kıyas (analoji). Dört büyük mezhep: Hanefi, Şafii, Maliki ve Hanbeli. Bu mezhepler aynı kaynakları yorumlama yöntemlerindeki farklılıklardan doğmuştur.", "level": "deep"},
    ],
    "sahabe_hayati": [
        {"title": "Zeyd bin Sabit: Kur'an'ın Koruyucusu", "content": "13 yaşında İbranice ve Süryanice öğrenen Zeyd, Peygamberimizin vahiy katibi oldu. Hz. Ebu Bekir döneminde Kur'an'ı mushaf haline getirme görevini üstlendi. Hz. Osman döneminde Kur'an'ın çoğaltılmasına başkanlık etti. İslam'ın en kritik ilmi mirasının koruyucusudur.", "level": "deep"},
        {"title": "Nusaybe bint Ka'b: Savaşçı Sahabe Kadın", "content": "Uhud Savaşı'nda Peygamberimizi bizzat kılıcıyla koruyan kadın sahabedir. 13 yara aldı, bir kolunu kaybetti ama geri çekilmedi. Peygamberimiz onun hakkında 'Sağıma soluma baktım hep Nusaybe'yi gördüm' buyurmuştur.", "level": "deep"},
        {"title": "Ebu Hüreyre: Hadis İlminin Yıldızı", "content": "5374 hadis rivayet ederek en çok hadis nakleden sahabe olmuştur. Peygamberimizin yanından ayrılmaz, her sözünü ezberlerdi. 'Hiçbir arkadaşım benden daha çok hadis bilmez, ancak Abdullah bin Amr yazar, ben yazmazdım' demiştir. Hadis ilminin temel sütunudur.", "level": "deep"},
    ],
    "ahlak_edep": [
        {"title": "Gıybet ve Dedikodudan Korunma Yolları", "content": "Kur'an gıybeti 'ölü kardeşinin etini yemek'e benzetmiştir (Hucurat 12). Korunma yolları: Dilini tutmak, başkalarının kusurlarını örtmek, iyilik düşünmek, meşguliyetini artırmak, gıybet edeni nazikçe uyarmak. Peygamberimiz 'Kim kardeşinin gıybetini engellerse Allah da onun yüzünü ateşten korur' buyurmuştur.", "level": "deep"},
        {"title": "Hüsnü Zan: Güzel Düşünce Sanatı", "content": "İslam'da başkalarının sözlerini ve davranışlarını en güzel şekilde yorumlamak esastır. Hz. Ömer 'Kardeşinin bir sözünü 70 türlü anlama çek, iyiye yor' demiştir. Kötü düşünce (suizan) kalbi hasta eder, hüsnüzan ise toplumsal barışın temelidir.", "level": "deep"},
        {"title": "İslam'da Çevre Ahlakı", "content": "Peygamberimiz savaşta bile ağaç kesilmesini yasaklamış, suyu israf etmeyi nehyetmiştir. Kur'an 'Yeryüzünde bozgunculuk çıkarmayın' (Araf 56) buyurur. İslam ekolojik dengeyi korumayı ibadet sayar. Hayvan haklarından su tasarrufuna kapsamlı bir çevre ahlakı sunar.", "level": "deep"},
    ],
    "kuran_mucizeleri": [
        {"title": "Kur'an'ın Matematiksel Şifresi: 19 Mucizesi", "content": "Besmele 19 harftir. Kur'an'ın ilk ayeti 19 harftir. Sure sayısı 114 = 19×6. 'Vahid' (tek) kelimesi 19 kez geçer. Müddessir 30. ayet 'Üzerinde 19 vardır' der. Bu matematiksel düzen, Kur'an'ın insan eseri olamayacağının ispatlarından biridir.", "level": "deep"},
        {"title": "Kur'an ve Karanlık Derin Denizler", "content": "Nur Suresi 40. ayet derin denizdeki karanlık tabakalarını tanımlar. Denizlerin diplerindeki mutlak karanlık ancak modern denizaltı teknolojisiyle keşfedilmiştir. 200 metreden sonra ışığın ulaşamadığı bölgeler, Kur'an'da 1400 yıl önce tarif edilmiştir.", "level": "deep"},
        {"title": "Kur'an'da Çift Yaratılış Prensibi", "content": "Zariyat 49 'Her şeyden çift çift yarattık' buyurur. Atomda proton-elektron, biyolojide erkek-dişi, fizikte madde-antimadde, elektrikte artı-eksi... Modern bilim her alanda çift yaratılışı doğrulamıştır. Bu ayet 7. yüzyılda bilimin henüz keşfedemediği evrensel bir prensibi bildirmiştir.", "level": "deep"},
    ],
    "islam_medeniyeti": [
        {"title": "İbn-i Haldun ve Sosyolojinin Doğuşu", "content": "14. yüzyılda yaşayan İbn-i Haldun, Mukaddime adlı eseriyle sosyoloji ilminin kurucusu kabul edilir. Devletlerin doğuş, yükseliş ve çöküş döngüsünü (asabiye teorisi) ilk kez bilimsel olarak açıklamıştır. Auguste Comte'dan 400 yıl önce toplum bilimini sistematik hale getirmiştir.", "level": "deep"},
        {"title": "Muslimi Cerrahiye: İlk Cerrahi Atlas", "content": "Şerefeddin Sabuncuoğlu'nun 1465'te yazdığı bu eser, tarihte ilk resimli cerrahi kitaptır. 400'den fazla hastalığın ameliyat tekniklerini minyatürlerle gösterir. Kadın cerrahlar, anestezi yöntemleri ve ameliyat sonrası bakım detaylıca anlatılmıştır.", "level": "deep"},
        {"title": "Kâğıt ve Matbaa Öncesi İslam Kütüphaneleri", "content": "Bağdat'taki Beytu'l-Hikme 400.000+ el yazması barındırıyordu. Kurtuba Kütüphanesi 500.000 cilt ile Avrupa'nın en büyüğüydü. İslam dünyasında kağıt üretimi 8. yüzyılda başladı — Avrupa'dan 500 yıl önce. Bu entellektüel miras Rönesans'ın temelini oluşturdu.", "level": "deep"},
    ],
    "tasavvuf_hikmeti": [
        {"title": "Nefs Mertebeleri: Ruhun 7 Makamı", "content": "Nefs-i emmare (kötüye teşvik), nefs-i levvame (pişmanlık), nefs-i mülhime (ilham alan), nefs-i mutmainne (huzurlu), nefs-i radıye (razı olan), nefs-i mardıyye (Allah'ın razı olduğu), nefs-i kamile (olgunlaşmış). Her makam bir arınma sürecidir ve insanın ruhani tekamülünü gösterir.", "level": "deep"},
        {"title": "Sema Ayini: Dönen Dervişlerin Sırrı", "content": "Mevlana'dan gelen sema ayini kozmik düzeni sembolize eder. Sağ el gökyüzüne (Allah'tan almak), sol el yeryüzüne (halka vermek) döner. Siyah hırka dünyevi benliği, beyaz tennure kefeni, sikke mezar taşını simgeler. Dervişin her dönüşü tevhidi (birliğe) yolculuğudur.", "level": "deep"},
        {"title": "Zikr-i Daimî: Sürekli Hatırlama Hali", "content": "Sufiler için zikir sadece dil ile değil, kalp ile yapılanıdır. İmam Gazali 'kalbin zikri dilin zikrindne üstündür' der. Nefes alıp verirken bile Allah'ı anmak, her anı ibadet kılmaktır. Bu hal 'ihsan' makamıdır: Allah'ı görmüyorsan bile O seni görüyordur.", "level": "deep"},
    ]
}

# 3) New categories to add
NEW_CATEGORIES = [
    {
        "id": "fikih_rehberi",
        "title": "Fıkıh Rehberi",
        "icon": "⚖️",
        "color": "#F97316",
        "items": [
            {"title": "Abdest Nasıl Alınır?", "content": "Abdestin farzları: Yüzü yıkamak, kolları dirseklere kadar yıkamak, başın dörtte birini meshetmek, ayakları topuklara kadar yıkamak. Sünnetleri: Besmele çekmek, misvak/fırça kullanmak, ağza ve burna su vermek, kulakları meshetmek.", "level": "basic"},
            {"title": "Gusül Abdesti", "content": "Gusül gerektiren haller: Cünüplük, hayız ve nifas. Guslün farzları: Ağza su vermek, burna su vermek, tüm vücudu yıkamak. Boy abdesti alırken niyet etmek ve tüm vücutta kuru yer bırakmamak önemlidir.", "level": "basic"},
            {"title": "Teyemmüm", "content": "Su bulunamadığında veya kullanılamadığında toprak ile yapılan temizlenme. Elleri temiz toprağa vurup yüzü meshetmek, tekrar vurup kolları meshetmek suretiyle yapılır. Seferde, hastalıkta ve su yokluğunda caizdir.", "level": "basic"},
            {"title": "Namaz Vakitleri ve Süreleri", "content": "Sabah namazı: İmsak ile güneşin doğuşu arası. Öğle: Güneşin tepe noktasından sonra. İkindi: Bir cismin gölgesi iki katına çıkınca. Akşam: Güneşin batışından sonra. Yatsı: Kırmızı şafağın kaybolmasından fecre kadar.", "level": "basic"},
            {"title": "Oruç Bozanlar ve Bozmayalar", "content": "Bozanlar: Yemek, içmek, cinsel ilişki. Bozmayalar: Unutarak yiyip içmek, gözüne ilaç damlatmak, kan almak/vermek, diş dolgusu, enjeksiyon (besleyici olmayan), kusmak (kasıtsız). İftarı geciktirmek mekruh, sahuru geciktirmek sünnettir.", "level": "basic"},
            {"title": "Hac ve Umre Farkları", "content": "Hac: Mali ve bedeni gücü yeten her Müslümana ömürde bir kez farzdır. Belirli günlerde (Zilhicce 8-13) yapılır. Umre: Sünnet-i müekkede olup yılın her zamanı yapılabilir. Hac'ta Arafat vakfesi, şeytan taşlama gibi fazladan rükünler vardır.", "level": "basic"},
            {"title": "Vitir Namazı", "content": "Hanefi mezhebine göre vacip, diğer mezheplere göre sünnettir. Yatsı namazından sonra kılınır. 3 rekat olup üçüncü rekatta kunut duaları okunur. Peygamberimiz vitri hiç terk etmemiştir.", "level": "basic"},
            {"title": "Secdei Sahv (Yanılma Secdesi)", "content": "Namazda bir vacibin terk edilmesi veya geciktirilmesi durumunda yapılır. Son oturuşta sağa selam verdikten sonra iki secde yapılır, ardından tahiyyat okunup tekrar selam verilir. Farz bir rükun eksikliğinde namaz yeniden kılınır.", "level": "deep"},
            {"title": "İstihare Namazı ve Duası", "content": "Bir konuda karar veremediğinde kılınan iki rekatlık nafile namazdır. İlk rekatta Kâfirun, ikinci rekatta İhlas okunur. Selamdan sonra istihare duası okunur. Kalbe doğan huzur ve genişlik olumlu, daralma ve huzursuzluk olumsuz işaret kabul edilir.", "level": "deep"},
            {"title": "Cenaze Namazı Kılınışı", "content": "Dört tekbirle kılınır. Rükû ve secde yoktur. 1. tekbirde Sübhaneke, 2. tekbirde Tahiyyat ve Salli-Barik, 3. tekbirde cenaze duası, 4. tekbirde selam. Cenaze yıkama, kefenleme, techiz ve defin sırası takip edilir.", "level": "deep"},
            {"title": "İslam Miras Hukuku", "content": "Kur'an miras paylarını açıkça belirler (Nisa 11-12). Erkek çocuk kız çocuğun iki katı alır ki nafaka yükümlülüğü ondadır. Eş, anne, baba, çocuklar, kardeşler için belirli paylar vardır. Vasiyet mirasın üçte birini geçemez.", "level": "deep"},
        ]
    },
    {
        "id": "dua_rehberi",
        "title": "Dua Rehberi",
        "icon": "🤲",
        "color": "#06B6D4",
        "items": [
            {"title": "Sabah Duası", "content": "Asbahna ve asbahal mülkü lillah ve'l-hamdü lillah. Lâ ilâhe illallahü vahdehü lâ şerîke leh. Sabahlara Allah'a hamd ile başlamak güne bereket katar. Peygamberimiz sabah-akşam zikirlerini hiç terk etmemiştir.", "level": "basic"},
            {"title": "Yemek Duası", "content": "Yemekten önce: Bismillahirrahmanirrahim. Yemekten sonra: Elhamdülillahillezî et'amenâ ve sekânâ ve cealenâ mine'l-müslimîn. Besmele unutulursa 'Bismillahi evvelehü ve ahirehü' denir.", "level": "basic"},
            {"title": "Yolculuk Duası", "content": "Sübhânellezî sahhara lenâ hâzâ ve mâ künnâ lehû mukrinîn ve innâ ilâ Rabbinâ lemünkalibûn. Araca binince okunur. Peygamberimiz her yolculukta bu duayı okurdu.", "level": "basic"},
            {"title": "Uyku Duası", "content": "Allahümme bismike emûtü ve ahyâ. Uyanınca: Elhamdülillahillezî ahyânâ ba'de mâ emâtenâ ve ileyhinnüşûr. Uyku küçük ölüm olarak kabul edilir, bu dua o bilinçle okunur.", "level": "basic"},
            {"title": "Sıkıntı Anında Okunan Dua", "content": "Lâ ilâhe illâ ente sübhâneke innî küntü mine'z-zâlimîn. Hz. Yunus'un balığın karnında ettiği bu dua, her türlü sıkıntıda okunur. Peygamberimiz 'Bu duayı eden Müslümanın duası kabul olunur' buyurmuştur.", "level": "basic"},
            {"title": "İmtihan/Sınav Duası", "content": "Rabbi yessir ve lâ tuassir, Rabbi temmim bi'l-hayr. Kolaylaştırma ve hayırla tamamlama duası. Sınav öncesi salavat-ı şerife okumak da sünnettir. İstiane (Allah'tan yardım isteme) her işte esastır.", "level": "basic"},
            {"title": "Evden Çıkış Duası", "content": "Bismillahi tevekkeltü alallah velâ havle velâ kuvvete illâ billah. Evden bu duayla çıkana melek 'Hüdiyet, küfiyet, vükîyet' der: Doğru yola iletildin, korunndun, müdafaa edildin.", "level": "basic"},
            {"title": "Hasta Ziyareti Duası", "content": "Es'elullâhe'l-azîme Rabbe'l-arşi'l-azîmi en yeşfiyeke. 7 kez okunur. Peygamberimiz hasta ziyaretini sadaka saymış ve 'Cennet bahçelerine uğrarsınız' buyurmuştur.", "level": "basic"},
            {"title": "Seyyidü'l-İstiğfar", "content": "Allahümme ente Rabbî lâ ilâhe illâ ente halaktenî ve ene abdüke ve ene alâ ahdike ve va'dike mesteta'tü. Eûzü bike min şerri mâ sana'tü. Ebûü leke bi ni'metike aleyye ve ebûü bi zenbî fağfirlî. Peygamberimiz buna 'istiğfarın efendisi' demiştir. Akşama çıkmadan ölürse cennetliktir.", "level": "deep"},
            {"title": "Kadir Gecesi Duası", "content": "Allahümme inneke afüvvün kerîmün tühibbü'l-afve fa'fü annî. Hz. Aişe'ye Peygamberimiz öğretmiştir. 'Af' Allah'ın günahı silip iz bile bırakmaması demektir. Bu dua Ramazan'ın son 10 gününde özellikle okunur.", "level": "deep"},
        ]
    },
    {
        "id": "islam_ve_bilim",
        "title": "İslam ve Modern Bilim",
        "icon": "🔬",
        "color": "#8B5CF6",
        "items": [
            {"title": "Kur'an ve Big Bang Teorisi", "content": "Enbiya 30: 'Göklerle yer bitişik iken biz onları ayırdık.' Bu ayet Big Bang'i 1400 yıl önce tarif etmiştir. Modern kozmoloji evrenin tek bir noktadan patlamayla başladığını, Kur'an aynı şeyi 'ratk' (bitişik) ve 'fatk' (ayırma) kelimeleriyle anlatır.", "level": "basic"},
            {"title": "Kur'an'da Embriyoloji", "content": "Mü'minun 12-14: İnsan sırasıyla nutfe (sperm), alaka (yapışan/asılan), mudga (çiğnenmiş et), kemik ve et aşamalarından geçer. Keith Moore bu ayetleri incelediğinde modern embriyolojiyle birebir örtüştüğünü itiraf etmiştir.", "level": "basic"},
            {"title": "Deniz Suyunun Karışmaması", "content": "Rahman 19-20: 'İki denizi birbirine kavuşmak üzere salıverdi. Aralarında bir engel vardır; birbirine karışmazlar.' Akdeniz-Atlas Okyanusu, Basra Körfezi-Umman Denizi arasındaki tuzluluk farkı bu engeli oluşturur. Oşeanografi bunu ancak 20. yüzyılda keşfetti.", "level": "basic"},
            {"title": "Demir'in Gökten İndirilmesi", "content": "Hadid 25: 'Demiri indirdik.' Astrofizik, demirin yıldız patlamalarıyla (süpernova) uzaydan geldiğini kanıtlamıştır. Kur'an 'erzelnâ' (indirdik) kelimesini kullanarak demirin dünya dışı kökenini bildirir. 'Hadid' suresinin numarası 57, demirin atom numarası 26 + izotopu 57'dir.", "level": "deep"},
            {"title": "Bal Arısının İletişimi", "content": "Nahl 68-69: 'Rabbin bal arısına vahyetti.' Karl von Frisch arıların dans diliyle iletişim kurduğunu keşfederek Nobel ödülü aldı. Kur'an arının dişil sığasıyla anılır — çünkü işçi arılar gerçekten dişidir. Bu detay 7. yüzyılda bilinmesi imkansız bir bilgidir.", "level": "deep"},
            {"title": "Kur'an ve Karadelikler", "content": "Vakıa 75-76: 'Yıldızların yerlerine yemin ederim ki bu büyük bir yemindir.' Tarık 1-3: 'Delici yıldız.' Bilim insanları bu ayetlerin karadelikler ve nötron yıldızlarına işaret ettiğini belirtmektedir. Karadeliklerin keşfi 20. yüzyılda olmuştur.", "level": "deep"},
            {"title": "Evrenin Genişlemesi", "content": "Zariyat 47: 'Göğü biz kudretimizle kurduk ve onu genişletmekteyiz.' Edwin Hubble 1929'da evrenin genişlediğini kanıtladı. 'Mûsiûn' kelimesi sürekli genişleme anlamı taşır. Bu bilimsel gerçek Kur'an'da asırlardır yazılıdır.", "level": "basic"},
            {"title": "Parmak İzlerinin Eşsizliği", "content": "Kıyame 3-4: 'İnsan kemiklerini toplayamayacağımızı mı sanıyor? Evet, parmak uçlarını bile yapmaya gücümüz yeter.' 1880'de Sir Francis Galton parmak izlerinin herkes için eşsiz olduğunu kanıtladı. Kur'an bu eşsizliğe 14 asır önce dikkat çekmiştir.", "level": "basic"},
        ]
    },
    {
        "id": "aile_ve_toplum",
        "title": "Aile ve Toplum Hayatı",
        "icon": "👨‍👩‍👧‍👦",
        "color": "#EC4899",
        "items": [
            {"title": "Hz. Muhammed'in Aile Hayatı", "content": "Peygamberimiz ev işlerinde ailesine yardım eder, kendi elbisesini yamar, evini süpürürdü. Hz. Aişe'ye karşı son derece nazik ve şakacıydı. 'Hayırlınız ailesine en hayırlı olanınızdır' buyurmuştur. O, ideal bir aile reisi modelidir.", "level": "basic"},
            {"title": "Çocuk Eğitiminde Peygamber Metodu", "content": "Peygamberimiz çocuklara ismiyle hitap eder, göz hizasına inerek konuşur, oyunlarına katılırdı. Torunları Hasan ve Hüseyin'i sırtında taşır, namazda secdede iken onları beklerdi. 'Çocuğunuzu 7 yaşında namaza alıştırın' buyurmuştur.", "level": "basic"},
            {"title": "İslam'da Evlilik Adabı", "content": "Evlilik İslam'da yarım dinin tamamlanmasıdır. Mehir kadının hakkıdır. Nikah şahitler huzurunda kıyılır. Karşılıklı rıza şarttır. Eşler birbirinin sırrını korur, güzel geçinir. Kur'an eşleri 'birbirinize elbise' diye tanımlar (Bakara 187).", "level": "basic"},
            {"title": "Anne Hakkı ve Cennet", "content": "Bir sahabe 'En çok kime iyilik yapayım?' diye sorduğunda Peygamberimiz üç kez 'Annene' dedi, dördüncüde 'Babana' buyurdu. 'Cennet annelerin ayakları altındadır' hadisi anneye verilen değeri gösterir. Anne hakkı Kur'an'da Allah'ın hakkından hemen sonra gelir.", "level": "basic"},
            {"title": "Komşu Hakları", "content": "Peygamberimiz 'Cebrail bana komşu hakkını o kadar tavsiye etti ki mirasçı yapacak sandım' buyurmuştur. 40 ev mesafedeki herkes komşudur. Yemeğinin kokusunu duyuran komşusuna ikram etmeli. Komşuya eziyet eden gerçek mümin değildir.", "level": "basic"},
            {"title": "Yaşlılara Saygı", "content": "'Küçüklerimize merhamet etmeyen, büyüklerimize saygı göstermeyen bizden değildir.' Peygamberimiz yaşlılara öncelik verir, onlara ayağa kalkar, namazda yaşlı cemaat varsa kısa tutardı. İslam medeniyetinde yaşlılar toplumun en saygın üyeleridir.", "level": "basic"},
            {"title": "İslam'da Boşanma Hukuku", "content": "Boşanma İslam'da helal olmakla birlikte 'en sevimsiz helal'dir. Üç talak hakkı vardır, ilk ikisinde rücu mümkündür. İddet süresi (3 hayız dönemi) beklenir. Emziren annenin nafakası babaya aittir. Sulh mekanizması (hakemler) önceliklidir.", "level": "deep"},
            {"title": "Yetim Hakları ve Himayesi", "content": "Kur'an'da yetimlerle ilgili 23 ayet vardır. 'Yetimin malını haksız yere yiyenler karınlarına ateş doldururlar' (Nisa 10). Peygamberimiz 'Ben ve yetimi koruyan cennette şöyleyiz' diyerek iki parmağını birleştirmiştir. İslam'ın ilk sosyal güvenlik sistemi burada başlar.", "level": "deep"},
        ]
    },
    {
        "id": "siyer_kronoloji",
        "title": "Siyer-i Nebi Kronolojisi",
        "icon": "🕋",
        "color": "#14B8A6",
        "items": [
            {"title": "Fil Vakası ve Doğum (570-571)", "content": "Ebrehe'nin Kabe'yi yıkmak için geldiği fil ordusuna Allah Ebabil kuşlarıyla taş yağdırdı. Bu olaydan kısa süre sonra Hz. Muhammed 12 Rebiülevvel'de dünyaya geldi. Doğumunda nurlar saçılmış, Kisra'nın sarayı çatlamıştır.", "level": "basic"},
            {"title": "Sütanne Dönemi ve Çocukluk", "content": "Hz. Halime, Peygamberimizi emzirmek için aldığında kuraklık yerini berekete bıraktı. 4-5 yaşında şakk-ı sadr (göğsün yarılması) mucizesi yaşandı. 6 yaşında annesini, 8 yaşında dedesini kaybetti. Amcası Ebu Talip onu himayesine aldı.", "level": "basic"},
            {"title": "Gençlik ve Hz. Hatice ile Evlilik", "content": "Muhammedü'l-Emin (güvenilir) lakabını kazandı. Hılfu'l-Fudul (Erdemliler İttifakı) üyesi oldu. 25 yaşında ticaret ortağı 40 yaşındaki Hz. Hatice ile evlendi. Hz. Hatice ilk iman eden ve en büyük destekçisiydi.", "level": "basic"},
            {"title": "İlk Vahiy ve Hira Mağarası", "content": "40 yaşında Hira Mağarası'nda Cebrail 'Oku!' dedi. İlk inen ayetler Alak 1-5'tir. Hz. Hatice 'Allah seni asla utandırmaz' diyerek teselli etti. Varaka bin Nevfel gelen vahyin Hz. Musa'ya gelenle aynı olduğunu söyledi.", "level": "basic"},
            {"title": "Gizli Davet Dönemi (610-613)", "content": "İlk 3 yıl İslam gizlice yayıldı. Hz. Ebu Bekir, Hz. Ali, Zeyd bin Harise ilk iman edenlerdendir. Erkam'ın evi ilk İslam okulu oldu. 40 kadar sahabe bu dönemde Müslüman oldu.", "level": "basic"},
            {"title": "Açık Davet ve Baskılar", "content": "Safa Tepesi'nde ilk açık davet yapıldı. Ebu Leheb lanet etti. Müşriklerin baskıları arttı: Bilal'e işkence, Yasir ailesinin şehadeti. İlk Habeşistan hicreti (615) bu baskılar sonucu gerçekleşti.", "level": "basic"},
            {"title": "Boykot Yılları ve Hüzün Yılı", "content": "Haşimoğulları 3 yıl Şi'b-i Ebi Talib'de mahsur kaldı. Ağaç kabuğu yediler. 619'da Hz. Hatice ve Ebu Talip aynı yıl vefat etti. Peygamberimiz bu yıla 'Hüzün Yılı' adını verdi.", "level": "basic"},
            {"title": "İsra ve Miraç Mucizesi", "content": "Burak ile Mescid-i Haram'dan Mescid-i Aksa'ya, oradan yedi kat göğe yükseltildi. Her katta bir peygamberle görüştü. Sidretü'l-Münteha'da Allah ile konuştu. Beş vakit namaz bu gecede farz kılındı. Dönüşte gecenin yarısı bile geçmemişti.", "level": "deep"},
            {"title": "Medine Dönemi: İslam Devletinin Kuruluşu", "content": "Hicret sonrası ilk iş Mescid-i Nebevi'nin inşasıydı. Ensar-Muhacir kardeşliği kuruldu (tarihte ilk sosyal dayanışma). Medine Vesikası ile ilk anayasa yazıldı. Yahudiler, Hristiyanlar ve Müslümanlar aynı devletin vatandaşı oldu.", "level": "deep"},
            {"title": "Veda Hutbesi ve Vefat (632)", "content": "124.000 sahabeye hitap eden Veda Hutbesi evrensel insan hakları beyannamesinin prototipidir: Can, mal, namus dokunulmazdır. Irk ayrımcılığı yoktur. Kadın hakları teminat altındadır. Peygamberimiz 63 yaşında Hz. Aişe'nin odasında vefat etti.", "level": "deep"},
        ]
    }
]

# Add deep items to existing categories
for card in cards:
    cid = card["id"]
    if cid in DEEP_ADDITIONS:
        card["items"].extend(DEEP_ADDITIONS[cid])

# Add new categories
cards.extend(NEW_CATEGORIES)

# Write back
with open(path, "w", encoding="utf-8") as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

total = sum(len(c["items"]) for c in cards)
print(f"Done! Categories: {len(cards)}, Total items: {total}")
for c in cards:
    basic = sum(1 for i in c["items"] if i.get("level") == "basic" or not i.get("level"))
    deep = sum(1 for i in c["items"] if i.get("level") == "deep")
    print(f"  {c['id']}: {len(c['items'])} items (basic: {basic}, deep: {deep})")
