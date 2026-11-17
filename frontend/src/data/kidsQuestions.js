// 🧒 ÇOCUK SORU PAKETİ — Hikmet Çarkı'nın çocuk sürümü için, 6 alanın her birinde 6 temel soru.
// Özgün yazım. Doğru cevap her satırda İLK şıktır; oyun şıkları karıştırarak gösterir.
// Bir din eğitimcisinin gözden geçirmesi gerekir (data/icerik.json: denetlenmedi).
const Q = (area, q, o, exp = '') => ({ area, q, o, exp });

export const KIDS_QUESTIONS = [
  Q('kuran', "Kur'an-ı Kerim'in ilk suresi hangisidir?", ['Fâtiha', 'Bakara', 'İhlâs', 'Nâs']),
  Q('kuran', "Kur'an-ı Kerim kaç sureden oluşur?", ['114', '100', '30', '7']),
  Q('kuran', "Kur'an-ı Kerim hangi ayda indirilmeye başlandı?", ['Ramazan', 'Receb', 'Şevval', 'Muharrem']),
  Q('kuran', "Kur'an-ı Kerim'in son suresi hangisidir?", ['Nâs', 'Felak', 'Fâtiha', 'Kevser']),
  Q('kuran', 'Besmelenin anlamı nedir?', ["Rahmân ve Rahîm olan Allah'ın adıyla", 'Allah en büyüktür', "Allah'a hamd olsun", 'Allah dilerse']),
  Q('kuran', "Kur'an-ı Kerim'in en kısa suresi hangisidir?", ['Kevser', 'Bakara', 'Yâsîn', 'Mülk'], 'Kevser suresi üç ayettir.'),

  Q('peygamber', 'İlk insan ve ilk peygamber kimdir?', ['Hz. Âdem', 'Hz. Nuh', 'Hz. İbrahim', 'Hz. Musa']),
  Q('peygamber', 'Büyük gemiyi yapan peygamber kimdir?', ['Hz. Nuh', 'Hz. Yusuf', 'Hz. İsa', 'Hz. Davud']),
  Q('peygamber', 'Balığın karnında kalan peygamber kimdir?', ['Hz. Yunus', 'Hz. Musa', 'Hz. Eyyub', 'Hz. Salih']),
  Q('peygamber', "Kâbe'yi oğlu İsmail ile birlikte inşa eden peygamber kimdir?", ['Hz. İbrahim', 'Hz. Nuh', 'Hz. Lut', 'Hz. Yakup']),
  Q('peygamber', 'Son peygamber kimdir?', ['Hz. Muhammed', 'Hz. İsa', 'Hz. Musa', 'Hz. Süleyman']),
  Q('peygamber', "Kuyuya atılan, sonra Mısır'da yönetici olan peygamber kimdir?", ['Hz. Yusuf', 'Hz. Yakup', 'Hz. Harun', 'Hz. Zekeriya']),

  Q('siyer', 'Peygamber Efendimiz hangi şehirde doğdu?', ['Mekke', 'Medine', 'Kudüs', 'Taif']),
  Q('siyer', 'Peygamber Efendimizin annesinin adı nedir?', ['Âmine', 'Hatice', 'Fâtıma', 'Halime']),
  Q('siyer', 'Peygamber Efendimizin babasının adı nedir?', ['Abdullah', 'Ebû Tâlib', 'Abdülmuttalib', 'Hamza']),
  Q('siyer', "Peygamber Efendimizin Mekke'den Medine'ye göçüne ne denir?", ['Hicret', 'Hac', 'Umre', 'Miraç']),
  Q('siyer', 'Peygamber Efendimize ilk vahiy hangi mağarada geldi?', ['Hira', 'Sevr', 'Ashâb-ı Kehf', 'Uhud']),
  Q('siyer', "Hz. Fâtıma'nın eşi kimdir?", ['Hz. Ali', 'Hz. Ömer', 'Hz. Osman', 'Hz. Ebû Bekir']),

  Q('ibadet', 'Namazdan önce temizlenmek için ne alırız?', ['Abdest', 'Oruç', 'Zekât', 'Sadaka']),
  Q('ibadet', 'Ramazan ayında tuttuğumuz ibadet hangisidir?', ['Oruç', 'Hac', 'Kurban', 'Umre']),
  Q('ibadet', 'Namaz kılarken hangi yöne döneriz?', ['Kâbe', 'Kudüs', 'Medine', 'Doğu']),
  Q('ibadet', 'Hac ibadeti hangi şehirde yapılır?', ['Mekke', 'İstanbul', 'Kahire', 'Bağdat']),
  Q('ibadet', 'Namaza çağırmak için okunan güzel sese ne denir?', ['Ezan', 'İlahi', 'Tekbir', 'Salavat']),
  Q('ibadet', 'Kurban Bayramı hangi ibadetle birliktedir?', ['Hac', 'Oruç', 'Teravih', 'Itikâf']),

  Q('iman', 'Bir işe başlarken ne deriz?', ['Bismillah', 'Elhamdülillah', 'Maşallah', 'Âmin']),
  Q('iman', 'Yemekten sonra şükretmek için ne deriz?', ['Elhamdülillah', 'Bismillah', 'İnşallah', 'Estağfirullah']),
  Q('iman', 'Müslümanlar karşılaşınca nasıl selamlaşır?', ['Selâmün aleyküm', 'Hoşça kal', 'Afiyet olsun', 'Geçmiş olsun']),
  Q('iman', '"İnşallah" ne demektir?', ['Allah dilerse', 'Allah korusun', 'Allah razı olsun', 'Allah büyüktür']),
  Q('iman', 'Arkadaşımıza bir sözümüz varsa ne yapmalıyız?', ['Sözümüzü tutmalıyız', 'Unutmalıyız', 'Başkasına söylemeliyiz', 'Önemsememeliyiz']),
  Q('iman', 'Allah’ın bir olduğuna inanmaya ne denir?', ['Tevhid', 'Tövbe', 'Teravih', 'Tekbir']),

  Q('esma', "Allah'ın güzel isimlerine ne denir?", ['Esmâ-i Hüsnâ', 'Salavat', 'Besmele', 'Kelime-i Tevhid']),
  Q('esma', '"Er-Rahmân" ne demektir?', ['Çok merhametli', 'Her şeyi bilen', 'Çok güçlü', 'Her şeyi gören']),
  Q('esma', '"El-Alîm" ne demektir?', ['Her şeyi bilen', 'Rızık veren', 'Yaratan', 'Her şeyi işiten']),
  Q('esma', '"Er-Rezzâk" ne demektir?', ['Rızık veren', 'Her şeyi işiten', 'Bağışlayan', 'Barış veren']),
  Q('esma', '"El-Hâlık" ne demektir?', ['Yaratan', 'Koruyan', 'Yol gösteren', 'Adil olan']),
  Q('esma', '"Es-Semî" ne demektir?', ['Her şeyi işiten', 'Her şeyi gören', 'Hayat veren', 'Affeden']),
];

export default KIDS_QUESTIONS;
