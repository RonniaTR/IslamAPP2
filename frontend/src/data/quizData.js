// frontend/src/data/quizData.js

export const quizQuestions = [
  // ========================================================
  // 🟢 KOLAY SEVİYE (10 PUAN) - Temel Dini Bilgiler
  // ========================================================
  { id: 1, type: 'mc', category: "Siyer", points: 10, question: "Peygamber Efendimiz (sav)'e ilk vahiy hangi dağda inmiştir?", options: ["Nur Dağı (Hira)", "Sevr Dağı", "Arafat", "Uhud"], correct_index: 0 },
  { id: 2, type: 'mc', category: "Kuran", points: 10, question: "Kur'an-ı Kerim'in kalbi olarak bilinen sure hangisidir?", options: ["Bakara", "Yasin", "Mülk", "Kehf"], correct_index: 1 },
  { id: 3, type: 'mc', category: "Tarih", points: 10, question: "Kudüs'ü fethederek Haçlı işgaline son veren büyük İslam komutanı kimdir?", options: ["Alparslan", "Fatih Sultan Mehmet", "Selahaddin Eyyubi", "Tarık bin Ziyad"], correct_index: 2 },
  { id: 4, type: 'mc', category: "Fıkıh", points: 10, question: "Aşağıdakilerden hangisi abdestin farzlarından biri değildir?", options: ["Yüzü yıkamak", "Kolları dirseklerle beraber yıkamak", "Ağza ve burna su vermek", "Ayakları topuklarla beraber yıkamak"], correct_index: 2 },
  { id: 5, type: 'tf', category: "Fıkıh", points: 10, question: "Sabah namazının farzı 4 rekattır.", correct_index: 1 }, // 1: Yanlış
  { id: 6, type: 'mc', category: "İtikat", points: 10, question: "İslam'ın şartları kaç tanedir?", options: ["4", "5", "6", "7"], correct_index: 1 },
  { id: 7, type: 'tf', category: "Kuran", points: 10, question: "Kur'an-ı Kerim toplam 30 cüzden oluşmaktadır.", correct_index: 0 }, // 0: Doğru
  { id: 8, type: 'mc', category: "Ahlak", points: 10, question: "Başkalarının kusurlarını araştırmak ve gizli hallerini ortaya çıkarmaya ne denir?", options: ["Gıybet", "Tecessüs", "Suizan", "İftira"], correct_index: 1 },
  { id: 9, type: 'mc', category: "Siyer", points: 10, question: "Peygamberimizin (sav) doğduğu şehir neresidir?", options: ["Medine", "Taif", "Mekke", "Kudüs"], correct_index: 2 },
  { id: 10, type: 'tf', category: "Ahlak", points: 10, question: "Yalan söylemek İslam'da büyük günahlardan sayılır.", correct_index: 0 },
  { id: 11, type: 'mc', category: "Tarih", points: 10, question: "Hz. Muhammed'e (sav) ilk inanan kadın sahabe kimdir?", options: ["Hz. Aişe", "Hz. Fatıma", "Hz. Hatice", "Hz. Sümeyye"], correct_index: 2 },
  { id: 12, type: 'tf', category: "Hadis", points: 10, question: "Peygamberimizin söz, fiil ve onaylarına 'Sünnet/Hadis' denir.", correct_index: 0 },
  { id: 13, type: 'mc', category: "Fıkıh", points: 10, question: "Ramazan orucunu tutmamayı mubah kılan hallerden biri hangisidir?", options: ["Zenginlik", "Gençlik", "Yolculuk (Seferi olmak)", "Bekarlık"], correct_index: 2 },
  { id: 14, type: 'tf', category: "Kuran", points: 10, question: "Kur'an-ı Kerim'in son suresi Nas Suresi'dir.", correct_index: 0 },
  { id: 15, type: 'mc', category: "İtikat", points: 10, question: "Allah'ın bir ve tek olmasına ne ad verilir?", options: ["Tevhit", "Şirk", "Nifak", "Kibir"], correct_index: 0 },
  { id: 16, type: 'tf', category: "Siyer", points: 10, question: "Hz. Muhammed (sav) Veda Haccı'nı hicretin 10. yılında yapmıştır.", correct_index: 0 },
  { id: 17, type: 'mc', category: "Kuran", points: 10, question: "Kur'an'ın indirildiği mübarek geceye ne ad verilir?", options: ["Miraç", "Berat", "Kadir", "Regaib"], correct_index: 2 },
  { id: 18, type: 'tf', category: "Fıkıh", points: 10, question: "Namazda Fatiha suresini okumak sünnettir.", correct_index: 1 }, // Yanlış (Farzdır/Vaciptir)
  { id: 19, type: 'mc', category: "Tarih", points: 10, question: "İlk İslam halifesi kimdir?", options: ["Hz. Ali", "Hz. Osman", "Hz. Ömer", "Hz. Ebubekir"], correct_index: 3 },
  { id: 20, type: 'tf', category: "Ahlak", points: 10, question: "Emanete hıyanet etmek münafıklık alametlerindendir.", correct_index: 0 },
  { id: 21, type: 'mc', category: "Siyer", points: 10, question: "Müslümanların müşriklerle yaptığı ve kesin zafer kazandığı ilk savaş hangisidir?", options: ["Uhud", "Bedir", "Hendek", "Mute"], correct_index: 1 },
  { id: 22, type: 'tf', category: "Kuran", points: 10, question: "Kevser Suresi, Kur'an'ın en kısa suresidir.", correct_index: 0 },
  { id: 23, type: 'mc', category: "İtikat", points: 10, question: "Ölümden sonra yeniden diriltilmeye ne ad verilir?", options: ["Haşr", "Ba's", "Mahşer", "Sırat"], correct_index: 1 },
  { id: 24, type: 'tf', category: "Fıkıh", points: 10, question: "Zekat, sadece Ramazan ayında verilmek zorundadır.", correct_index: 1 }, // Yanlış (Yılın her vakti verilebilir)
  { id: 25, type: 'mc', category: "Siyer", points: 10, question: "Peygamber Efendimizin (sav) süt annesinin adı nedir?", options: ["Amine", "Halime", "Hafsa", "Şeyma"], correct_index: 1 },
  { id: 26, type: 'tf', category: "İtikat", points: 10, question: "Meleklere iman etmek, İslam'ın 5 şartından biridir.", correct_index: 1 }, // Yanlış (İmanın şartıdır)
  { id: 27, type: 'mc', category: "Fıkıh", points: 10, question: "Aşağıdakilerden hangisi namazı bozmaz?", options: ["Konuşmak", "Gülmek", "Kıbleden dönmek", "Esnemek"], correct_index: 3 },
  { id: 28, type: 'tf', category: "Tarih", points: 10, question: "Hicri takvim, Hz. İsa'nın doğumu ile başlar.", correct_index: 1 }, // Yanlış (Hicret ile başlar)
  { id: 29, type: 'mc', category: "Kuran", points: 10, question: "İçinde besmele bulunmayan tek sure hangisidir?", options: ["Yasin", "Tevbe", "Kehf", "Rahman"], correct_index: 1 },
  { id: 30, type: 'tf', category: "Fıkıh", points: 10, question: "Yolculuğa çıkan bir kimse (seferi), 4 rekatlık farz namazları 2 rekat olarak kılar.", correct_index: 0 },
  { id: 31, type: 'mc', category: "İtikat", points: 10, question: "Dört büyük melekten vahiy getirmekle görevli olan hangisidir?", options: ["Mikail", "Azrail", "İsrafil", "Cebrail"], correct_index: 3 },
  { id: 32, type: 'tf', category: "Siyer", points: 10, question: "Müslümanların ilk hicret ettiği yer Medine'dir.", correct_index: 1 }, // Yanlış (Habeşistan'dır)
  { id: 33, type: 'mc', category: "Fıkıh", points: 10, question: "Günde 5 vakit namaz kılan biri toplam kaç rekat farz namaz kılmış olur?", options: ["15", "17", "20", "40"], correct_index: 1 }, // 2+4+4+3+4 = 17
  { id: 34, type: 'tf', category: "Ahlak", points: 10, question: "Riya, ibadetleri Allah rızası için değil, insanların beğenisi için yapmaktır.", correct_index: 0 },

  // ========================================================
  // 🟡 ORTA SEVİYE (20 PUAN) - Gelişmiş Dini Kavramlar
  // ========================================================
  { id: 35, type: 'mc', category: "Siyer", points: 20, question: "Peygamber Efendimiz (sav) Medine'ye hicret ettiğinde ilk olarak kimin evinde misafir olmuştur?", options: ["Hz. Ebubekir", "Ebu Eyyub el-Ensari", "Hz. Osman", "Mus'ab bin Umeyr"], correct_index: 1 },
  { id: 36, type: 'mc', category: "Kuran", points: 20, question: "Kur'an-ı Kerim hangi halife döneminde kitap (Mushaf) haline getirilmiştir?", options: ["Hz. Ebubekir", "Hz. Ömer", "Hz. Osman", "Hz. Ali"], correct_index: 0 },
  { id: 37, type: 'tf', category: "Fıkıh", points: 20, question: "Teyemmüm abdesti alırken niyet etmek farzdır.", correct_index: 0 },
  { id: 38, type: 'mc', category: "İtikat", points: 20, question: "Allah'ın ezelden ebede kadar olacak her şeyi önceden bilip takdir etmesine ne denir?", options: ["Kader", "Kaza", "Tevekkül", "İrade"], correct_index: 0 },
  { id: 39, type: 'mc', category: "Tarih", points: 20, question: "Emevi Devleti'ne son vererek İslam coğrafyasında hüküm süren devlet hangisidir?", options: ["Selçuklular", "Abbasiler", "Fatımiler", "Osmanlılar"], correct_index: 1 },
  { id: 40, type: 'tf', category: "Hadis", points: 20, question: "Hadisleri rivayet eden kişilerin isimlerinin yer aldığı zincire 'Senet' denir.", correct_index: 0 },
  { id: 41, type: 'mc', category: "Ahlak", points: 20, question: "İslam ahlakında 'kendi ihtiyacı olduğu halde başkasını kendine tercih etme' erdemine ne ad verilir?", options: ["İsar", "İnfak", "İhlas", "İhsan"], correct_index: 0 },
  { id: 42, type: 'tf', category: "Siyer", points: 20, question: "Hudeybiye Barış Antlaşması, Müslümanların Mekkeli müşriklerle yaptığı ilk yazılı antlaşmadır.", correct_index: 0 },
  { id: 43, type: 'mc', category: "Fıkıh", points: 20, question: "Hangisi haccın farzlarından biri değildir?", options: ["İhrama girmek", "Arafat'ta vakfe yapmak", "Şeytan taşlamak", "Kabe'yi tavaf etmek"], correct_index: 2 },
  { id: 44, type: 'tf', category: "Kuran", points: 20, question: "Kur'an-ı Kerim'de adı geçen Zülkarneyn, kesin olarak bir peygamberdir.", correct_index: 1 }, // Yanlış (Peygamber mi veli mi olduğu ihtilaflıdır)
  { id: 45, type: 'mc', category: "İtikat", points: 20, question: "Peygamberlerin günah işlemekten korunmuş olmaları sıfatına ne denir?", options: ["Sıdk", "Fetanet", "İsmet", "Tebliğ"], correct_index: 2 },
  { id: 46, type: 'mc', category: "Tarih", points: 20, question: "'Yermük Savaşı' hangi İslam halifesi döneminde Bizans'a karşı kazanılmıştır?", options: ["Hz. Ebubekir", "Hz. Ömer", "Hz. Osman", "Hz. Ali"], correct_index: 1 },
  { id: 47, type: 'tf', category: "Fıkıh", points: 20, question: "Sehiv secdesi, namazda yapılan bir farzın kasten terk edilmesi durumunda yapılır.", correct_index: 1 }, // Yanlış (Vacibin terki/gecikmesi durumunda yapılır)
  { id: 48, type: 'mc', category: "Hadis", points: 20, question: "Kütüb-i Sitte adı verilen en güvenilir 6 hadis kitabından birinin yazarı aşağıdakilerden hangisidir?", options: ["İmam Gazali", "İmam Azam", "İmam Tirmizi", "Mevlana"], correct_index: 2 },
  { id: 49, type: 'mc', category: "Ahlak", points: 20, question: "Allah'ın her an kendisini gördüğü bilinciyle ibadet etmeye ve yaşamaya ne ad verilir?", options: ["İhlas", "İhsan", "Takva", "Huşu"], correct_index: 1 },
  { id: 50, type: 'tf', category: "İtikat", points: 20, question: "Peygamberlere gönderilen ilahi kitaplardan İncil, Hz. Davud'a (a.s.) indirilmiştir.", correct_index: 1 }, // Yanlış (İsa a.s.)
  { id: 51, type: 'mc', category: "Fıkıh", points: 20, question: "Zengin bir Müslümanın, Kurban Bayramı'nda kestiği kurbana dini literatürde ne ad verilir?", options: ["Udhiyye", "Akika", "Adak", "Şükür"], correct_index: 0 },
  { id: 52, type: 'mc', category: "Siyer", points: 20, question: "Hendek Savaşı'nda şehrin etrafına hendek kazılması fikrini kim vermiştir?", options: ["Hz. Ömer", "Selman-ı Farisi", "Hz. Ali", "Halid bin Velid"], correct_index: 1 },
  { id: 53, type: 'tf', category: "Kuran", points: 20, question: "Kur'an-ı Kerim'de toplam 114 sure bulunmaktadır.", correct_index: 0 },
  { id: 54, type: 'mc', category: "Tarih", points: 20, question: "Endülüs Emevi Devleti'nin Avrupa'daki ilerleyişi hangi savaşla durdurulmuştur?", options: ["Puvatya", "Yermük", "Kadisiye", "Nihavend"], correct_index: 0 },
  { id: 55, type: 'tf', category: "Fıkıh", points: 20, question: "Gusül abdestinin farzları; ağza su vermek, burna su vermek ve bütün vücudu yıkamaktır.", correct_index: 0 },
  { id: 56, type: 'mc', category: "Ahlak", points: 20, question: "İyiliği emredip kötülükten alıkoyma prensibinin İslam'daki kavramsal karşılığı nedir?", options: ["Emr-i bi'l-ma'ruf", "Cihat", "İrşad", "Tebliğ"], correct_index: 0 },
  { id: 57, type: 'tf', category: "İtikat", points: 20, question: "'Sıdk', peygamberlerin her zaman doğruyu söylemeleri anlamına gelen bir sıfattır.", correct_index: 0 },
  { id: 58, type: 'mc', category: "Kuran", points: 20, question: "Kur'an'da sabrıyla sembol olmuş ve ağır hastalıklara göğüs germiş peygamber kimdir?", options: ["Hz. Eyyüb", "Hz. Yakub", "Hz. Yusuf", "Hz. Nuh"], correct_index: 0 },
  { id: 59, type: 'tf', category: "Siyer", points: 20, question: "Peygamber Efendimiz (sav)'in kabri (Ravza-i Mutahhara) Mekke şehrindedir.", correct_index: 1 }, // Yanlış (Medine)
  { id: 60, type: 'mc', category: "Hadis", points: 20, question: "En çok hadis rivayet eden sahabe (Müksirun) kimdir?", options: ["Hz. Ömer", "Ebu Hureyre", "Hz. Aişe", "Abdullah bin Ömer"], correct_index: 1 },
  { id: 61, type: 'tf', category: "Fıkıh", points: 20, question: "Vitir namazı yatsı namazından önce kılınır.", correct_index: 1 }, // Yanlış (Sonra kılınır)
  { id: 62, type: 'mc', category: "İtikat", points: 20, question: "Kıyamet gününde insanların diriltilip toplanacağı alana ne ad verilir?", options: ["Mizan", "Sırat", "Mahşer", "Araf"], correct_index: 2 },
  { id: 63, type: 'mc', category: "Kuran", points: 20, question: "Kur'an-ı Kerim'de ismi açıkça geçen tek kadın kimdir?", options: ["Hz. Hatice", "Hz. Meryem", "Hz. Fatıma", "Hz. Asiye"], correct_index: 1 },
  { id: 64, type: 'tf', category: "Siyer", points: 20, question: "Taif yolculuğunda Peygamber Efendimiz'e (sav) eşlik eden sahabe Zeyd bin Harise'dir (r.a).", correct_index: 0 },
  { id: 65, type: 'mc', category: "Tarih", points: 20, question: "Dört Halife dönemine İslam tarihinde ne ad verilir?", options: ["Tâbiîn", "Sahabe", "Hulefa-i Raşidin", "Ehl-i Beyt"], correct_index: 2 },
  { id: 66, type: 'tf', category: "Fıkıh", points: 20, question: "Zekat verirken malın 1/40'ının (kırkta birinin) verilmesi farzdır.", correct_index: 0 },
  { id: 67, type: 'mc', category: "Ahlak", points: 20, question: "Nefsin aşırı istek ve arzularını dizginleyip terbiye etmeye tasavvufta ne ad verilir?", options: ["Seyr u Süluk", "Riyazet", "İnziva", "Çile"], correct_index: 1 },

  // ========================================================
  // 🔴 ZOR SEVİYE (30 PUAN) - Akademik & İleri Düzey Bilgiler
  // ========================================================
  { id: 68, type: 'mc', category: "Fıkıh", points: 30, question: "İmam Şafii'ye göre abdestin farzları kaç tanedir?", options: ["4", "5", "6", "7"], correct_index: 2 }, // 6 (Niyet ve Tertip eklenir)
  { id: 69, type: 'tf', category: "Hadis", points: 30, question: "'Mütevatir hadis', yalan üzere birleşmeleri aklen imkansız olan kalabalık bir topluluğun rivayet ettiği kesin hadistir.", correct_index: 0 },
  { id: 70, type: 'mc', category: "Tarih", points: 30, question: "Muteber dört büyük fıkıh mezhebinden biri olan Maliki mezhebinin kurucusu kimdir?", options: ["İmam Azam", "İmam Şafii", "Malik bin Enes", "Ahmed bin Hanbel"], correct_index: 2 },
  { id: 71, type: 'mc', category: "Siyer", points: 30, question: "Mekke'nin Fethi hicretin kaçıncı yılında gerçekleşmiştir?", options: ["6", "8", "10", "11"], correct_index: 1 },
  { id: 72, type: 'tf', category: "İtikat", points: 30, question: "'Tekvin' sıfatı, Maturidi mezhebine göre Allah'ın subuti sıfatlarından biridir ve 'yaratma' anlamına gelir.", correct_index: 0 },
  { id: 73, type: 'mc', category: "Hadis", points: 30, question: "Kütüb-i Sitte yazarlarından 'Sünen' sahibi olmayan, kitabına doğrudan 'el-Câmiu's-Sahîh' adını veren muhaddis kimdir?", options: ["Ebu Davud", "İmam Tirmizi", "Nesai", "İbni Mace"], correct_index: 1 }, // Tirmizi (Buhari ve Müslim dışındakiler arasında Cami olan)
  { id: 74, type: 'mc', category: "Kuran", points: 30, question: "Kur'an-ı Kerim'de 'İki denizi salıverdi, birbirine kavuşuyorlar ama aralarında bir engel var, birbirine karışmıyorlar' ayeti hangi surede geçer?", options: ["Rahman", "Vakıa", "Kehf", "Neml"], correct_index: 0 },
  { id: 75, type: 'tf', category: "Fıkıh", points: 30, question: "Hanefi mezhebine göre, seferi olan kişinin 4 rekatlık farzları tam kılması (kısaltmaması) mekruhtur.", correct_index: 0 },
  { id: 76, type: 'mc', category: "Tarih", points: 30, question: "Abbasiler döneminde Bağdat'ta kurulan ve antik eserlerin Arapçaya tercüme edildiği dev bilim merkezi nedir?", options: ["Nizamiye Medresesi", "Beyt'ül Hikme", "Darü'n-Nedve", "Suffe"], correct_index: 1 },
  { id: 77, type: 'tf', category: "Siyer", points: 30, question: "Tebük Seferi, Peygamber Efendimiz'in (sav) bizzat katıldığı son gazvedir.", correct_index: 0 },
  { id: 78, type: 'mc', category: "Fıkıh", points: 30, question: "Vefat eden bir Müslümanın ardından geride bıraktığı malların (miras) İslam hukukuna göre paylaştırılması ilmine ne ad verilir?", options: ["Feraiz", "Kelam", "Akaid", "Tefsir"], correct_index: 0 },
  { id: 79, type: 'mc', category: "İtikat", points: 30, question: "Aşağıdakilerden hangisi meleklerin özelliklerinden biri değildir?", options: ["İradeleri yoktur", "Yeme-içme ihtiyaçları yoktur", "Nurdan yaratılmışlardır", "Gaybı (geleceği) bilirler"], correct_index: 3 },
  { id: 80, type: 'tf', category: "Kuran", points: 30, question: "Kur'an'da en uzun ayet olan 'Müdayene (Borçlanma)' ayeti, Bakara suresi 282. ayettir.", correct_index: 0 },
  { id: 81, type: 'mc', category: "Hadis", points: 30, question: "Ravilerinin hafıza durumundaki ufak eksiklikler nedeniyle 'Sahih' derecesine ulaşamayan ama amelle kabul edilebilir olan hadis türü nedir?", options: ["Mevzu", "Zayıf", "Hasen", "Mürsel"], correct_index: 2 },
  { id: 82, type: 'tf', category: "Tarih", points: 30, question: "Kadisiye Savaşı ile Bizans İmparatorluğu'na büyük bir darbe vurulmuştur.", correct_index: 1 }, // Yanlış (Sasanilere vuruldu)
  { id: 83, type: 'mc', category: "Fıkıh", points: 30, question: "Cuma namazının farz olmasının şartlarından 'İkamet' ne anlama gelir?", options: ["Özgür olmak", "Erkek olmak", "Yolcu olmamak (Mukim olmak)", "Sağlıklı olmak"], correct_index: 2 },
  { id: 84, type: 'mc', category: "Ahlak", points: 30, question: "İnsanlara karşı kibirlenip büyüklenmenin zıddı olan, alçakgönüllülük erdemine ne ad verilir?", options: ["Tevazu", "Şükür", "Kanaat", "Haya"], correct_index: 0 },
  { id: 85, type: 'tf', category: "İtikat", points: 30, question: "Kur'an'a göre şeytan (İblis) meleklerden biridir ancak isyan etmiştir.", correct_index: 1 }, // Yanlış (Cinlerdendir)
  { id: 86, type: 'mc', category: "İtikat", points: 30, question: "Kıyamet gününde amellerin tartılacağı ilahi adaletin tecelli edeceği teraziye ne ad verilir?", options: ["Arş", "Kürsi", "Mizan", "Araf"], correct_index: 2 },
  { id: 87, type: 'mc', category: "Kuran", points: 30, question: "Kur'an'ı tecvid kurallarına uyarak, manasını düşünerek ve harflerin hakkını vererek yavaş yavaş okumaya ne denir?", options: ["Hatim", "Mukabele", "Tertil", "Tilavet"], correct_index: 2 },
  { id: 88, type: 'tf', category: "Fıkıh", points: 30, question: "Hanefi mezhebine göre kan akması abdesti bozar, Şafii mezhebine göre bozmaz.", correct_index: 0 },
  { id: 89, type: 'mc', category: "Hadis", points: 30, question: "Bir hadisin hem senedi hem de metni uydurma ise (Peygambere ait değilse) bu tür hadislere ne ad verilir?", options: ["Mevzu", "Maktu", "Mürsel", "Şaz"], correct_index: 0 },
  { id: 90, type: 'mc', category: "Siyer", points: 30, question: "Uhud Savaşı'nda Peygamberimizin 'Bugün melekler onu yıkadı' dediği, yeni evliyken şehit olan sahabe kimdir?", options: ["Mus'ab bin Umeyr", "Hanzala bin Ebu Amir", "Hamza bin Abdülmuttalib", "Abdullah bin Cahş"], correct_index: 1 },
  { id: 91, type: 'tf', category: "Kuran", points: 30, question: "Kur'an-ı Kerim, Hz. Osman döneminde harekelenerek (sesli harf işaretleri konularak) okunması kolaylaştırılmıştır.", correct_index: 1 }, // Yanlış (Hz. Ali dönemi sonrası Ebu'l Esved veya Emeviler Haccac)
  { id: 92, type: 'mc', category: "Fıkıh", points: 30, question: "Cenaze namazında kaç defa tekbir alınır?", options: ["3", "4", "5", "6"], correct_index: 1 },
  { id: 93, type: 'mc', category: "İtikat", points: 30, question: "Peygamberlerin, Allah'tan aldıkları vahiyleri insanlara eksiksiz olarak bildirmelerine ne ad verilir?", options: ["Tebliğ", "Fetanet", "Emanet", "İsmet"], correct_index: 0 },
  { id: 94, type: 'tf', category: "Tarih", points: 30, question: "Kudüs, ilk olarak Hz. Ömer'in halifeliği döneminde fethedilmiştir.", correct_index: 0 },
  { id: 95, type: 'mc', category: "Siyer", points: 30, question: "Müslümanların ilk kıblesi neresidir?", options: ["Mescid-i Haram", "Mescid-i Nebevi", "Mescid-i Aksa", "Kuba Mescidi"], correct_index: 2 },
  { id: 96, type: 'tf', category: "Fıkıh", points: 30, question: "İslam dininde bir eylemin yapılmasının kesin ve bağlayıcı olarak yasaklanmasına 'Mekruh' denir.", correct_index: 1 }, // Yanlış (Haram denir)
  { id: 97, type: 'mc', category: "Hadis", points: 30, question: "Aşağıdaki kitaplardan hangisi Kütüb-i Sitte (Altı Güvenilir Kitap) içerisinde yer almaz?", options: ["Sahih-i Buhari", "Muvatta", "Sünen-i İbni Mace", "Sünen-i Ebu Davud"], correct_index: 1 }, // Muvatta (İmam Malik) genellikle 6 kitaptan ayrı sayılır veya 7. olarak kabul edilir.
  { id: 98, type: 'mc', category: "Kuran", points: 30, question: "Kur'an-ı Kerim'de kaç tane 'Secde Ayeti' bulunmaktadır?", options: ["10", "12", "14", "16"], correct_index: 2 }, // 14 Secde Ayeti
  { id: 99, type: 'tf', category: "Siyer", points: 30, question: "Peygamber Efendimiz (sav), vefatından önce kendi yerine Hz. Ali'yi halife olarak atadığını yazılı bir vasiyetle bildirmiştir.", correct_index: 1 }, // Yanlış (Böyle bir yazılı vasiyet yoktur)
  { id: 100, type: 'mc', category: "İtikat", points: 30, question: "Mezhepler tarihinde, aklı (kıyas ve mantığı) naklin (ayetin) önüne alan ve İslam düşünce tarihinde 'Akılcılar' olarak bilinen fırka hangisidir?", options: ["Hariciler", "Mutezile", "Eş'ariyye", "Mürcie"], correct_index: 1 }
];

// OYUN İÇİN RASTGELE SORU SEÇİCİ (Şimdi zorluk puanlarını da hesaplıyor)
export const getRandomQuestions = (count = 10) => {
  // Tüm havuzu karıştır
  const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// EĞER SADECE ZOR veya SADECE KOLAY SORULARI ÇEKMEK İSTERSEN KULLANABİLECEĞİN FONKSİYON
export const getQuestionsByDifficulty = (pointFilter, count = 10) => {
  const filtered = quizQuestions.filter(q => q.points === pointFilter);
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};