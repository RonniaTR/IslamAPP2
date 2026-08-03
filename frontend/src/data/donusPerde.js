// frontend/src/data/donusPerde.js
// 🎭 KIRK PERDE — Dönüş Odası'nın anlatı katmanı
//
// ─────────────────────────────────────────────────────────────────
// BU NEDİR?
// Ders (returnPath.js) bilgi verir: "abdest şöyle alınır".
// PERDE ise bilgi vermez — bir şeyi GÖSTERİR. Her gün bir perde
// aralanır; kişinin kendi içinde zaten duran bir şey görünür olur.
//
// Tasavvufta "perde" (hicâb) örten şeydir. Kırk gün, kırk perde.
// Kandilin ışığı da aralanan perde sayısınca artar — Dönüş Odası'nın
// bütün görsel dili bu tek metafora bağlanır.
//
// ─────────────────────────────────────────────────────────────────
// SES VE ÜSLUP — EN ÖNEMLİ KISIM
//
// Bu metinleri bir HOCA okumuyor. İki arkadaş okuyor; ikisi de âlim
// değil, ikisi de yolda. Bu yüzden:
//
//   ✗ "Şunu yapmalısın", "haramdır", "farzdır"     → fetva dili YOK
//   ✗ "Sevgili kardeşim", "muhterem"               → vaaz dili YOK
//   ✓ "Biz de bilmiyoruz ama şunu fark ettik"      → yoldaş dili
//   ✓ Soru sorup cevabı kişiye bırakmak            → düşündürmek
//   ✓ Akaid ve tasavvuf çerçevesi                  → ne inanıyoruz,
//     kalpte ne oluyor — fıkhî hüküm dersin işidir, perdenin değil
//
// TON ÖLÇÜSÜ: "Bu cümleyi karşımdaki kişiye, o benden daha iyi bir
// müslüman olabilir ihtimalini akılda tutarak söyleyebilir miyim?"
//
// ─────────────────────────────────────────────────────────────────
// YAPISI
//   lines[]   — okunacak parçalar. t = sesin kaçıncı saniyesinde
//               başladığı (seslendirme eklendiğinde eşitlenir).
//               Ses yoksa okuma modunda kendi temposuyla akar.
//   sahne[]   — o anda ekranda ne olacağı (soyut ışık/geometri;
//               tasvir yok). at = saniye.
//   kalan     — perdeden geriye kalan tek cümle. Ekranda kalır.
//   sure      — tahmini seslendirme süresi (saniye)
//
// SESLENDİRME: public/audio/donus/perde-01.mp3 ... perde-40.mp3
// Dosya yoksa uygulama sessizce okuma moduna düşer (bkz. donusVoice.js).

export const PERDELER = [
  // ═══════════════════════ 1 ═══════════════════════
  {
    day: 1,
    title: `Sen mi geldin?`,
    kalan: `Belki sen buraya gelmedin. Belki çağrıldın.`,
    sure: 95,
    lines: [
      { t: 0,  text: `Bir şey soracağım. Cevabını bana verme.` },
      { t: 4,  text: `Bu uygulamayı bugün açtın. Peki dün de aklından geçmişti, değil mi? Belki bir hafta önce de. Belki aylardır.` },
      { t: 13, text: `Asıl soru şu: o düşünce nereden geliyordu?` },
      { t: 19, text: `Biz genelde şöyle kurarız cümleyi — ben karar verdim, ben geldim.` },
      { t: 26, text: `Ama işin ehli olanlar bunu tersinden okur. Derler ki: bir kapıyı çalmak istiyorsan, önce o kapının varlığından haberdar edilmen gerekir. Kimse görmediği kapıyı çalmaz.` },
      { t: 40, text: `Yani sende beliren o huzursuzluk — "böyle olmamalı" diyen o sessiz ses — senin icadın değildi.` },
      { t: 50, text: `Bunu bir iddia olarak söylemiyoruz. Biz de âlim değiliz, biz de yoldayız. Ama şu sözü biliyoruz:` },
      { t: 60, text: `"Kulum bana bir karış yaklaşırsa ben ona bir arşın yaklaşırım. Bana yürüyerek gelirse ben ona koşarak gelirim."` },
      { t: 71, text: `Dikkat et: hareket kulda başlıyor gibi görünüyor. Ama karşılık o kadar büyük, o kadar hızlı geliyor ki — insan sonradan anlıyor.` },
      { t: 82, text: `Bugün senden hiçbir şey istemiyoruz. Sadece bunu bir düşün.` },
      { t: 88, text: `Belki sen buraya gelmedin. Belki çağrıldın.` },
    ],
    sahne: [
      { at: 0,  mod: 'karanlik', not: 'Tek bir nokta ışık, uzakta' },
      { at: 19, mod: 'yaklasan', not: 'Işık yavaşça büyür — sen değil o yaklaşıyor' },
      { at: 60, mod: 'nefes',    not: 'Işık nefes alır' },
      { at: 82, mod: 'sarmal',   not: 'Işık etrafını sarar' },
    ],
    kaynak: `Hadis-i kudsî: Buhârî, Tevhîd 50; Müslim, Zikir 1`,
  },

  // ═══════════════════════ 2 ═══════════════════════
  {
    day: 2,
    title: `Perdenin arkası`,
    kalan: `Uzaklaştıran O değildi. Perde bizim tarafımızdaydı.`,
    sure: 92,
    lines: [
      { t: 0,  text: `Uzak kaldığın yıllarda hiç şunu düşündün mü: acaba beni terk mi etti?` },
      { t: 7,  text: `Çoğumuz bunu düşünürüz ama söylemeyiz. Söylemek ayıp gelir.` },
      { t: 13, text: `Oysa cevabı düşündüğümüzden basit.` },
      { t: 17, text: `Güneşi düşün. Bir odada perdeyi kapatırsın, oda kararır. Güneş sana küsmemiştir. Güneş yerindedir, ışığı da yerinde.` },
      { t: 29, text: `Değişen tek şey aradaki perdedir.` },
      { t: 33, text: `Bizim geleneğimizde buna hicâb denir — örten şey. Ve şu söylenir: perde daima kulun tarafındadır.` },
      { t: 43, text: `Bu cümle ilk bakışta ağır gelebilir. "Demek benim suçum" dersin.` },
      { t: 49, text: `Ama tam tersini söylüyor aslında. Çünkü perde senin tarafındaysa, açılması da senin elinde demektir.` },
      { t: 58, text: `Uzaklaşan O olsaydı yapabileceğin hiçbir şey olmazdı. Ama öyle değil.` },
      { t: 65, text: `Kur'an'da geçen bir cümle var: "Biz ona şah damarından daha yakınız."` },
      { t: 73, text: `Şah damarı. Yani senin bile göremediğin, ama sensiz olmayan yer.` },
      { t: 80, text: `Bugün perdenin tamamını açman gerekmiyor. Bir parmak aralık yeter. Işık zaten dışarıda bekliyor.` },
    ],
    sahne: [
      { at: 0,  mod: 'perde',   not: 'Kapalı bir doku, arkasında ışık sezilir' },
      { at: 29, mod: 'aralik',  not: 'İnce bir yarık açılır' },
      { at: 65, mod: 'damar',   not: 'İçeriden dışa doğru ince ışık çizgileri' },
      { at: 80, mod: 'aralanma', not: 'Yarık genişler, ışık odaya dolar' },
    ],
    kaynak: `Kâf sûresi 16 · "Perde kulun tarafındadır" — tasavvuf klasiklerinde yaygın ifade`,
  },

  // ═══════════════════════ 3 ═══════════════════════
  {
    day: 3,
    title: `Kırık olan kabul edilir`,
    kalan: `Sağlam kalp değil, kırık kalp aranıyor.`,
    sure: 90,
    lines: [
      { t: 0,  text: `Bir şey itiraf edelim: buraya gelirken içinden "ben olmam" diye geçirdin, değil mi?` },
      { t: 7,  text: `Ben yeterince temiz değilim. Benim geçmişim var. Benim gibi biri...` },
      { t: 13, text: `Bu cümle çok yaygın. Ve çok yanlış bir yerden besleniyor.` },
      { t: 19, text: `Şöyle bir kabul var aramızda: önce düzeleceksin, sonra geleceksin. Önce temizleneceksin, sonra kapıyı çalacaksın.` },
      { t: 29, text: `Ama hiç düşündün mü — hastane, hasta olmayanlar için mi açıktır?` },
      { t: 35, text: `Kur'an'da Allah'ın kendini tanıttığı isimlerden biri şudur: el-Cebbâr. Bu ismi çoğu zaman "zorlayan, gücü her şeye yeten" diye çeviririz.` },
      { t: 47, text: `Oysa aynı kökten bir kelime daha var: cebîre. Kırık kemiğe sarılan atel.` },
      { t: 55, text: `El-Cebbâr, kırılanı saran demektir de.` },
      { t: 60, text: `Yani kırıklığın seni dışarıda bırakan şey değil; tam olarak seni oraya davet eden şey.` },
      { t: 68, text: `Bir söz vardır, çokça nakledilir: "Ben kırık kalplerin yanındayım."` },
      { t: 76, text: `Bunun senedini tartışırlar, biz burada hüküm vermiyoruz. Ama anlamı Kur'an'a aykırı değil — hatta tam ortasında duruyor.` },
      { t: 85, text: `Bugün kendini onarmış olarak gelmen istenmiyor. Kırık hâlinle gel.` },
    ],
    sahne: [
      { at: 0,  mod: 'catlak',  not: 'Çatlamış bir yüzey, karanlık' },
      { at: 47, mod: 'sizinti', not: 'Çatlaklardan ışık sızmaya başlar' },
      { at: 68, mod: 'altin',   not: 'Çatlaklar ışıkla dolar — kırık yer en parlak yer olur' },
      { at: 85, mod: 'butun',   not: 'Yüzey bütünleşir ama izler ışık olarak kalır' },
    ],
    kaynak: `el-Cebbâr ismi üzerine klasik lügat açıklaması · "Kırık kalpler" rivayeti: senedi tartışmalıdır, mana olarak nakledilir`,
  },

  // ═══════════════════════ 4 ═══════════════════════
  {
    day: 4,
    title: `Az olanın sırrı`,
    kalan: `Devamlı olan az, kesintili olan çoktan büyüktür.`,
    sure: 88,
    lines: [
      { t: 0,  text: `Bugün sana tek bir görev verildi. Muhtemelen "bu kadar mı?" diye düşündün.` },
      { t: 7,  text: `Bu bir kolaylık değil. Bu bir usul.` },
      { t: 11, text: `Şöyle bir hadis var: Allah'a amellerin en sevimlisi, az da olsa devamlı olanıdır.` },
      { t: 19, text: `Buradaki "sevimli" kelimesine dikkat et. "Yeterli" demiyor, "makbul" demiyor. Sevimli diyor.` },
      { t: 28, text: `Peki neden? Çünkü çok olan bir şey seni yorar, sonra bırakırsın. Bıraktığında da suçlu hissedersin. Suçluluk da seni büsbütün uzaklaştırır.` },
      { t: 41, text: `Az olan ise yormaz. Yormayan şey sürer. Süren şey kalpte bir yer açar.` },
      { t: 49, text: `Ve o yer, sen farkında olmadan genişler.` },
      { t: 54, text: `Su damlasının taşı delmesini düşün. Damlanın gücü yoktur; tekrarın gücü vardır.` },
      { t: 63, text: `Bizim gördüğümüz şu: insanlar dinden büyük hatalar yüzünden uzaklaşmıyor. Yorulunca uzaklaşıyor.` },
      { t: 72, text: `Bu yüzden burada seni yormayacağız. Bunu bir eksiklik sanma.` },
      { t: 79, text: `Bugünkü tek görevini yap. Yarını yarın konuşuruz.` },
    ],
    sahne: [
      { at: 0,  mod: 'damla',   not: 'Tek bir damla düşer' },
      { at: 41, mod: 'ritim',   not: 'Damlalar düzenli aralıkla' },
      { at: 54, mod: 'oyulma',  not: 'Yüzeyde iz derinleşir' },
      { at: 79, mod: 'kaynak',  not: 'İzden su fışkırır' },
    ],
    kaynak: `Buhârî, Rikāk 18; Müslim, Müsâfirîn 216`,
  },

  // ═══════════════════════ 5 ═══════════════════════
  {
    day: 5,
    title: `Görülmeyen taraf`,
    kalan: `Amelini insanlar tartar; niyetini yalnız O bilir.`,
    sure: 91,
    lines: [
      { t: 0,  text: `İki kişi aynı işi yapar. Biri sevap kazanır, diğeri kazanmaz. Fark nerededir?` },
      { t: 8,  text: `Cevabı biliyoruz: niyet. Ama bu kelimeyi o kadar çok duyduk ki artık bir şey söylemiyor.` },
      { t: 16, text: `Şöyle düşünelim. Amel görünen taraftır. Niyet görünmeyen taraf.` },
      { t: 23, text: `İnsanlar seni görünen tarafından tanır. Ne kadar kıldığını, ne kadar okuduğunu sayarlar. Sen de kendini öyle tartmaya alışırsın.` },
      { t: 34, text: `Ama bir düşün: senin en zor anında, kimsenin görmediği yerde, hiçbir karşılık beklemeden yaptığın o küçük şey vardı ya —` },
      { t: 45, text: `İşte o, terazide en ağır olandır.` },
      { t: 49, text: `Ve bunun tersi de doğru. Herkesin alkışladığı ama içinde başka bir şey aradığın amel, dışarıdan büyük görünür, terazide hafif kalır.` },
      { t: 61, text: `Bu, korkutmak için söylenmiş bir şey değil. Rahatlatmak için söylenmiş bir şey.` },
      { t: 68, text: `Çünkü şu an elinden az geliyor olabilir. Ama niyetin geniş.` },
      { t: 75, text: `Ve niyet, kendi başına yazılan bir ameldir. Bir iyiliği yapmaya karar verip yapamasan bile, o karar kayda geçer.` },
      { t: 85, text: `Bugün yapabildiğin kadarını yap. Gerisini niyetine bırak.` },
    ],
    sahne: [
      { at: 0,  mod: 'terazi',  not: 'İki kefe, biri görünür biri sisli' },
      { at: 34, mod: 'gizli',   not: 'Görünmeyen kefede bir ışık belirir' },
      { at: 45, mod: 'agirlik', not: 'Işıklı kefe ağır basar' },
      { at: 85, mod: 'sakin',   not: 'Terazi durulur' },
    ],
    kaynak: `Buhârî, Bedü'l-Vahy 1; Müslim, İmâre 155`,
  },

  // ═══════════════════════ 6 ═══════════════════════
  {
    day: 6,
    title: `Kimin sevinci`,
    kalan: `Dönüşüne senden çok sevinen biri var.`,
    sure: 93,
    lines: [
      { t: 0,  text: `Şimdi anlatacağımız şey, ilk duyulduğunda insana tuhaf gelir.` },
      { t: 6,  text: `Bir adam çölde yolculuk ediyor. Devesi kaçıyor — üzerinde bütün yiyeceği ve suyu var. Adam arıyor, bulamıyor.` },
      { t: 17, text: `Sonunda umudu kesip bir ağacın gölgesine uzanıyor. Öleceğini biliyor.` },
      { t: 24, text: `Gözünü açtığında deve karşısında duruyor.` },
      { t: 29, text: `O anki sevinci düşün. Öyle bir sevinç ki adam ne diyeceğini şaşırıyor.` },
      { t: 36, text: `Peygamberimiz bu tabloyu çizdikten sonra şunu söylüyor: Allah, kulunun tövbesine bundan daha çok sevinir.` },
      { t: 46, text: `Dur ve bir daha oku. Sevinen kim?` },
      { t: 51, text: `Biz dönüşü hep bir borç ödeme gibi düşünürüz. Suçlu adam mahkemeye çıkıyor gibi.` },
      { t: 59, text: `Oysa anlatılan tablo bu değil. Anlatılan tablo bir kavuşma.` },
      { t: 65, text: `Ve tuhaf olan şu: kavuşmanın sevinci sana değil, karşı tarafa yükleniyor.` },
      { t: 73, text: `Bunun ne demek olduğunu tam olarak biz de kavrayabilmiş değiliz. Ama şunu biliyoruz — utanarak gelinmesi gereken bir kapı değilmiş.` },
      { t: 84, text: `Bugün utançla değil, karşılanacağını bilerek gel.` },
    ],
    sahne: [
      { at: 0,  mod: 'col',      not: 'Boş, geniş, sıcak bir doku' },
      { at: 24, mod: 'donus',    not: 'Uzakta bir siluet — soyut, ışık lekesi' },
      { at: 46, mod: 'genisleme', not: 'Işık patlar gibi genişler' },
      { at: 84, mod: 'sarilma',  not: 'Işık kişiyi sarar' },
    ],
    kaynak: `Buhârî, Deavât 4; Müslim, Tevbe 7`,
  },

  // ═══════════════════════ 7 ═══════════════════════
  {
    day: 7,
    title: `İlk perde kapanıyor`,
    kalan: `Yedi gün önce yoktu. Şimdi var.`,
    sure: 86,
    lines: [
      { t: 0,  text: `Yedi gün oldu.` },
      { t: 3,  text: `Bu cümleyi geçiştirme. Yedi gün önce bunların hiçbiri yoktu.` },
      { t: 10, text: `Muhtemelen bu hafta bazı günleri atladın. Belki bir gün hiç açmadın. Belki bir günü yarım yaptın.` },
      { t: 19, text: `Şimdi kendini onlarla tartma isteği geliyor, biliyoruz. O ses hep gelir.` },
      { t: 26, text: `Ama bir düşün: hangi ölçüyle tartıyorsun?` },
      { t: 31, text: `Eğer ölçün "mükemmel yapmalıydım" ise, o ölçüyle hiç kimse geçemez. O ölçüyü kimse koymadı; biz kendimize koyduk.` },
      { t: 42, text: `Gerçek ölçü şu: bir hafta önce yoktu, şimdi var.` },
      { t: 48, text: `Yoktan var olan her şey korunmayı hak eder.` },
      { t: 53, text: `Bir de şunu söyleyelim. Bu yola çıkanların çoğu ilk haftada bırakır. Sen bırakmadın.` },
      { t: 62, text: `Bunu bir başarı olarak değil, bir işaret olarak al. Devam edebilen biri olduğunun işareti.` },
      { t: 71, text: `Yarın ikinci bölüm açılıyor. Orada namazı konuşacağız — ama korktuğun şekilde değil.` },
      { t: 80, text: `Bugünlük bu kadar. Sadece geriye bak ve şükret.` },
    ],
    sahne: [
      { at: 0,  mod: 'gerive',  not: 'Yedi küçük ışık noktası, geride' },
      { at: 42, mod: 'zincir',  not: 'Noktalar ince bir çizgiyle birleşir' },
      { at: 62, mod: 'yol',     not: 'Çizgi ileri doğru uzar' },
      { at: 80, mod: 'durak',   not: 'Sakin, dolu bir ışık' },
    ],
    kaynak: `İbrâhîm sûresi 7`,
  },
];

// ─── Kırkıncı Sır ───
//
// Kırk perdenin sonunda tek bir cümle var. O cümle baştan gösterilmez;
// her bölüm bittiğinde bir parçası açılır. Kırkıncı günde tamamlanır.
//
// Bu bir oyun mekaniği değil — anlatının kendisi. Tasavvufta "sonuna
// varmadan söylenmeyen söz" vardır; burada aynı şey yapılıyor.
export const SIR_PARCALARI = [
  { faz: 'kapi',  gun: 7,  metin: `Sen bir adım attın;` },
  { faz: 'temel', gun: 16, metin: `O sana` },
  { faz: 'bag',   gun: 26, metin: `koşarak` },
  { faz: 'ahlak', gun: 34, metin: `geldi.` },
];

export const SIR_TAM = {
  metin: `Sen bir adım attın; O sana koşarak geldi.`,
  aciklama: `Bu cümle bize ait değil. Kudsî bir hadiste geçen şu ifadenin sadeleştirilmiş hâli: "Kulum bana bir karış yaklaşırsa ben ona bir arşın yaklaşırım; bana yürüyerek gelirse ben ona koşarak gelirim." Kırk gün boyunca anlattığımız her şey aslında bu tek cümlenin açıklamasıydı.`,
  kaynak: `Buhârî, Tevhîd 50; Müslim, Zikir 1`,
};

// ─── Yardımcılar ───

import EN from './donusPerde.en';

const OVERLAYS = { en: EN };

function localize(base, lang) {
  if (!base || !lang || lang === 'tr') return base;
  const ov = (OVERLAYS[lang] || OVERLAYS.en || {})[base.day];
  if (!ov) return base;
  return {
    ...base,
    title: ov.title || base.title,
    kalan: ov.kalan || base.kalan,
    kaynak: ov.kaynak || base.kaynak,
    lines: Array.isArray(ov.lines) && ov.lines.length === base.lines.length
      ? base.lines.map((l, i) => ({ ...l, text: ov.lines[i] }))
      : base.lines,
  };
}

/** Belirli bir günün perdesi. Henüz yazılmamışsa null döner. */
export function getPerde(day, lang = 'tr') {
  const base = PERDELER.find(p => p.day === day);
  return base ? localize(base, lang) : null;
}

/** Perdesi yazılmış günler. */
export function perdeliGunler() {
  return PERDELER.map(p => p.day);
}

/** Şu ana kadar açılmış sır parçaları (okunan ders sayısına göre). */
export function acikSirParcalari(gun) {
  return SIR_PARCALARI.filter(s => gun >= s.gun);
}

export default PERDELER;
