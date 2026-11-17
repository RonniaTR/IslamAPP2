// 🕌 NAMAZ YOLU — çocuklar için namaz ve abdest dersleri (13 yaşa kadar).
// Dayanak: Diyanet İşleri Başkanlığı ilmihal bilgisi (Hanefî mezhebi; Türkiye'deki uygulama).
// Yalnız temel, tartışmasız bilgiler alındı; ayrıntılı fıkıh tartışmaları ve korkutucu anlatımlar BİLEREK yoktur.
// Özgün yazım. Yayından önce bir din eğitimcisi okumalıdır (data/icerik.json: denetlenmedi).

export const DERSLER = [
  { id: 'nedir', title: 'Namaz nedir?', color: '#4A90D9', scene: 'cami' },
  { id: 'yapmayiz', title: 'Namazda ne yapmayız?', color: '#FF6B8A', scene: 'kalp' },
  { id: 'hazirlik', title: 'Namaza hazırlık', color: '#26A69A', scene: 'gunes' },
  { id: 'abdest', title: 'Abdest nasıl alınır?', color: '#4AB3E8', scene: 'yagmur' },
  { id: 'kilinis', title: 'Namaz nasıl kılınır?', color: '#2D8A4E', scene: 'cami' },
  { id: 'vakitler', title: 'Beş vakit', color: '#9B59B6', scene: 'gunesay' },
  { id: 'kible', title: 'Kıbleyi bul', color: '#F2B33D', route: '/kids/kible' },
  { id: 'sinav', title: 'Namaz Kahramanı', color: '#FF9F43' },
];

export const NEDIR = [
  { icon: '🤲', text: "Namaz, Allah'a ibadet etmenin en güzel yollarından biridir. Namazda Allah'ı anarız, O'na teşekkür eder ve dua ederiz." },
  { icon: '🌅', text: 'Müslümanlar her gün beş vakit namaz kılar: sabah, öğle, ikindi, akşam ve yatsı.' },
  { icon: '🌟', text: 'Peygamber Efendimiz, insanın Rabbine en yakın olduğu anın secde anı olduğunu söylemiştir.', src: 'Müslim, Salât 215' },
  { icon: '🌱', text: 'Namaz, büyüyünce her Müslümana farz olur. Şimdi öğreniyor ve alışıyoruz. Her denemen çok değerli!' },
];

export const YAPMAYIZ = {
  bozan: [
    { icon: '🤫', text: 'Konuşmayız.' },
    { icon: '🍎', text: 'Yemek yemeyiz, bir şey içmeyiz.' },
    { icon: '🧭', text: 'Göğsümüzü kıbleden çevirmeyiz.' },
    { icon: '😄', text: 'Sesli gülmeyiz.' },
    { icon: '🤸', text: 'Gereksiz yere çok hareket etmeyiz.' },
  ],
  degil: [
    { icon: '🐢', text: 'Namaz bir yarış değildir. Acele etmeden, sakin sakin kılarız.' },
    { icon: '💛', text: "Namaz bir yük değildir. Allah'ı andığımız, kalbimizin huzur bulduğu güzel bir andır." },
  ],
};

// Namazın şartları (namazdan önce yapılanlar)
export const HAZIRLIK = [
  { icon: '💧', text: 'Abdestli oluruz.' },
  { icon: '🧼', text: 'Bedenimiz, elbisemiz ve namaz kılacağımız yer temiz olur.' },
  { icon: '👕', text: 'Örtülmesi gereken yerlerimizi örteriz.' },
  { icon: '🕋', text: 'Kıbleye, yani Kâbe’nin olduğu yöne döneriz.' },
  { icon: '⏰', text: 'Namazın vaktinin girmiş olmasına dikkat ederiz.' },
  { icon: '💭', text: 'Hangi namazı kılacağımıza kalbimizle niyet ederiz.' },
];

// Abdest — sünnete uygun sıra
export const ABDEST = [
  { icon: '💭', title: 'Niyet ve besmele', text: "Abdest almaya niyet eder, 'Bismillâhirrahmânirrahîm' deriz.", kez: 0 },
  { icon: '🙌', title: 'Ellerimiz', text: 'Ellerimizi bileklerimize kadar yıkarız.', kez: 3 },
  { icon: '👄', title: 'Ağzımız', text: 'Sağ elimizle ağzımıza su alıp çalkalarız.', kez: 3 },
  { icon: '👃', title: 'Burnumuz', text: 'Sağ elimizle burnumuza su çeker, sol elimizle temizleriz.', kez: 3 },
  { icon: '😊', title: 'Yüzümüz', text: 'Alnımızdan çenemizin altına, bir kulağımızdan öbür kulağımıza kadar yüzümüzü yıkarız.', kez: 3 },
  { icon: '💪', title: 'Kollarımız', text: 'Önce sağ, sonra sol kolumuzu dirseklerimizle birlikte yıkarız.', kez: 3 },
  { icon: '✋', title: 'Başımız', text: 'Islak elimizle başımızı meshederiz (sıvazlarız).', kez: 1 },
  { icon: '👂', title: 'Kulaklarımız ve ensemiz', text: 'Kulaklarımızın içini ve arkasını, sonra ensemizi meshederiz.', kez: 1 },
  { icon: '🦶', title: 'Ayaklarımız', text: 'Önce sağ, sonra sol ayağımızı topuklarımızla birlikte, parmak aralarını da unutmadan yıkarız.', kez: 3 },
];
export const ABDEST_FARZ = ['Yüzü yıkamak', 'Kolları dirseklerle birlikte yıkamak', 'Başın dörtte birini meshetmek', 'Ayakları topuklarla birlikte yıkamak'];
export const ABDEST_BOZAN = ['Tuvalete gitmek', 'Yel çıkması', 'Uyumak', 'Bayılmak', 'Vücuttan kan akması'];

// İki rekâtlık bir namaz, adım adım. pose: PrayerFigure duruşu
export const KILINIS = [
  { pose: 'kiyam', title: 'Kıbleye dön, niyet et', say: '', text: 'Kıbleye dönüp ayakta dururuz ve hangi namazı kılacağımıza niyet ederiz.' },
  { pose: 'tekbir', title: 'Başlangıç tekbiri', say: 'Allâhu ekber', text: 'Ellerimizi kaldırıp "Allâhu ekber" der, namaza başlarız. Erkekler ellerini kulak hizasına, kızlar omuz hizasına kaldırır.' },
  { pose: 'kiyam', title: 'Kıyam (ayakta durmak)', say: 'Sübhâneke · Fâtiha · bir sure', text: 'Ellerimizi bağlar, Sübhâneke duasını, Fâtiha suresini ve Kur’an’dan kısa bir sure okuruz.' },
  { pose: 'ruku', title: 'Rükû (eğilmek)', say: 'Sübhâne rabbiye’l-azîm (3 kez)', text: '"Allâhu ekber" deyip eğiliriz, ellerimizi dizlerimize koyarız. Sırtımız düz olur.' },
  { pose: 'kavme', title: 'Doğrulmak', say: 'Semiallâhü li men hamideh · Rabbenâ leke’l-hamd', text: 'Rükûdan doğrulur, bir an ayakta dururuz.' },
  { pose: 'secde', title: 'Secde', say: 'Sübhâne rabbiye’l-a’lâ (3 kez)', text: '"Allâhu ekber" deyip secdeye gideriz: alnımız, burnumuz, ellerimiz, dizlerimiz ve ayak parmaklarımız yere değer.' },
  { pose: 'oturus', title: 'İki secde arası', say: 'Allâhu ekber', text: 'Secdeden kalkıp kısa bir süre otururuz.' },
  { pose: 'secde', title: 'İkinci secde', say: 'Sübhâne rabbiye’l-a’lâ (3 kez)', text: 'Yeniden secdeye gideriz. Böylece birinci rekât tamamlanır.' },
  { pose: 'kiyam', title: 'İkinci rekât', say: 'Fâtiha · bir sure', text: 'Ayağa kalkarız. Bu sefer Sübhâneke okumadan Fâtiha’yı ve kısa bir sure okuruz; sonra rükû ve iki secdeyi yine yaparız.' },
  { pose: 'oturus', title: 'Son oturuş', say: 'Ettehiyyâtü · Salli · Bârik · Rabbenâ', text: 'İkinci secdeden sonra oturur, bu duaları okuruz.' },
  { pose: 'selamSag', title: 'Selam: sağa', say: 'Esselâmü aleyküm ve rahmetullah', text: 'Başımızı sağa çevirip selam veririz.' },
  { pose: 'selamSol', title: 'Selam: sola', say: 'Esselâmü aleyküm ve rahmetullah', text: 'Sonra sola çevirip selam veririz. Namazımız bitti, Allah kabul etsin!' },
];

export const VAKITLER = [
  { id: 'sabah', ad: 'Sabah', sky: ['#F7B58A', '#FFE7C7'], parca: [['Sünnet', 2], ['Farz', 2]] },
  { id: 'ogle', ad: 'Öğle', sky: ['#8FD3F4', '#E8F7FF'], parca: [['Sünnet', 4], ['Farz', 4], ['Son sünnet', 2]] },
  { id: 'ikindi', ad: 'İkindi', sky: ['#F2C27A', '#FFF0D6'], parca: [['Sünnet', 4], ['Farz', 4]] },
  { id: 'aksam', ad: 'Akşam', sky: ['#E3875A', '#7A3E5C'], parca: [['Farz', 3], ['Sünnet', 2]] },
  { id: 'yatsi', ad: 'Yatsı', sky: ['#1D2B5A', '#3B4F8A'], parca: [['Sünnet', 4], ['Farz', 4], ['Son sünnet', 2], ['Vitir', 3]] },
];

export const SINAV = [
  { q: 'Günde kaç vakit namaz kılarız?', o: ['5', '3', '7'], a: 0 },
  { q: 'Namazdan önce ne alırız?', o: ['Abdest', 'Oruç', 'Hediye'], a: 0 },
  { q: 'Namaz kılarken hangi yöne döneriz?', o: ['Kıbleye (Kâbe’ye)', 'Pencereye', 'Güneşe'], a: 0 },
  { q: 'Rükûda ne yaparız?', o: ['Eğilip ellerimizi dizlerimize koyarız', 'Otururuz', 'Zıplarız'], a: 0 },
  { q: 'Namazı nasıl bitiririz?', o: ['Önce sağa, sonra sola selam veririz', 'Alkışlarız', 'Hemen kalkarız'], a: 0 },
  { q: 'Abdestte ayaklarımızı nasıl yıkarız?', o: ['Topuklarımızla birlikte', 'Sadece parmaklarımızı', 'Hiç yıkamayız'], a: 0 },
  { q: 'Akşam namazının farzı kaç rekâttır?', o: ['3', '2', '4'], a: 0 },
];
