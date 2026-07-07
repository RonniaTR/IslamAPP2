export const cmsContent = [
  // ─── 1. SERİLER (SERIES) ───
  {
    id: "s1",
    title: "Hz. Muhammed'in (sav) Hayatı",
    subtitle: "Doğumundan Vefatına Siyer-i Nebi",
    category: "Siyer",
    image: "https://images.unsplash.com/photo-1590076215667-87ebcecc639d?auto=format&fit=crop&q=80&w=600",
    type: "series",
    difficulty: "Orta",
    duration: 63, // 63 chapter
    xp: 1500,
    isFeatured: true,
    isPopular: true,
    isDaily: false,
    progress: 10,
    tags: ["siyer", "peygamber", "tarih", "seri"]
  },
  {
    id: "s2",
    title: "40 Hadis Ezberi",
    subtitle: "İmam Nevevi'nin Kırk Hadisi",
    category: "Hadis",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=600",
    type: "series",
    difficulty: "Orta",
    duration: 40,
    xp: 1000,
    isFeatured: true,
    isPopular: true,
    isDaily: false,
    progress: 30,
    tags: ["hadis", "ezber", "nevevi", "sünnet", "seri"]
  },
  {
    id: "s3",
    title: "Esmaül Hüsna",
    subtitle: "Allah'ın 99 Güzel İsmi ve Anlamları",
    category: "Esmaül Hüsna",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaab31f7?auto=format&fit=crop&q=80&w=600",
    type: "series",
    difficulty: "Kolay",
    duration: 99,
    xp: 2000,
    isFeatured: false,
    isPopular: true,
    isDaily: false,
    progress: 5,
    tags: ["esma", "zikir", "allah", "isim", "seri"]
  },
  {
    id: "s4",
    title: "İman Yolculuğu",
    subtitle: "İslam'ın Temel İnanç Esasları",
    category: "Akaid",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=600",
    type: "series",
    difficulty: "Kolay",
    duration: 21,
    xp: 500,
    isFeatured: false,
    isPopular: false,
    isDaily: false,
    progress: 80,
    tags: ["iman", "akaid", "temel", "başlangıç", "seri"]
  },
  {
    id: "s5",
    title: "Kur'an'da Adı Geçen Peygamberler",
    subtitle: "Hz. Adem'den Hz. Muhammed'e (sav)",
    category: "Kıssalar",
    image: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&q=80&w=600",
    type: "series",
    difficulty: "Orta",
    duration: 25,
    xp: 750,
    isFeatured: true,
    isPopular: false,
    isDaily: false,
    progress: 0,
    tags: ["peygamber", "kıssa", "kuran", "tarih", "seri"]
  },
  {
    id: "s6",
    title: "Sahabe Hayatları",
    subtitle: "Gökteki Yıldızlar Gibi",
    category: "Tarih",
    image: "https://images.unsplash.com/photo-1566904676343-6c84666d6d4a?auto=format&fit=crop&q=80&w=600",
    type: "series",
    difficulty: "İleri",
    duration: 30,
    xp: 900,
    isFeatured: false,
    isPopular: true,
    isDaily: false,
    progress: 12,
    tags: ["sahabe", "tarih", "örnek", "seri"]
  },

  // ─── 2. MAKALELER & REHBERLER (ARTICLES) ───
  {
    id: "a1",
    title: "Sabah ve Akşam Zikirleri",
    subtitle: "Güne bereketle başla, huzurla bitir",
    category: "Dua",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=600",
    type: "article",
    badge: "ÖNERİLEN",
    badgeColor: "#2ECC71",
    difficulty: "Kolay",
    duration: 5,
    xp: 50,
    isFeatured: false,
    isPopular: true,
    isDaily: true,
    progress: 0,
    tags: ["sabah", "akşam", "zikir", "dua", "günlük"]
  },
  {
    id: "a2",
    title: "Adım Adım Namaz Rehberi",
    subtitle: "Namaz nasıl kılınır? Hangi dualar okunur?",
    category: "İlmihal",
    image: "https://images.unsplash.com/photo-1590076215667-87ebcecc639d?auto=format&fit=crop&q=80&w=600",
    type: "article",
    badge: "TEMEL",
    badgeColor: "#3498DB",
    difficulty: "Kolay",
    duration: 15,
    xp: 150,
    isFeatured: true,
    isPopular: true,
    isDaily: false,
    progress: 20,
    tags: ["namaz", "hazırlık", "abdest", "ilmihal"]
  },
  {
    id: "a3",
    title: "Tevekkül Psikolojisi",
    subtitle: "Zor zamanlarda kalbin Allah'a güvenmesi",
    category: "Tasavvuf",
    image: "https://images.unsplash.com/photo-1543832923-44667a44c804?auto=format&fit=crop&q=80&w=600",
    type: "article",
    badge: "SANA ÖZEL",
    badgeColor: "#8B5CF6",
    difficulty: "Orta",
    duration: 8,
    xp: 80,
    isFeatured: false,
    isPopular: false,
    isDaily: false,
    progress: 0,
    tags: ["tevekkül", "sabır", "psikoloji", "makale"]
  },
  {
    id: "a4",
    title: "Rızık Endişesi ve Çözümü",
    subtitle: "Rezzak olan Allah'a teslimiyet",
    category: "Ahlak",
    image: "https://images.unsplash.com/photo-1584285406084-275dcb0e768c?auto=format&fit=crop&q=80&w=600",
    type: "article",
    badge: "YENİ",
    badgeColor: "#F5A623",
    difficulty: "Orta",
    duration: 10,
    xp: 100,
    isFeatured: true,
    isPopular: false,
    isDaily: false,
    progress: 0,
    tags: ["rızık", "tevekkül", "iş", "para"]
  },
  {
    id: "a5",
    title: "Şükrün Hayatımıza Etkisi",
    subtitle: "Şükretmek beyni nasıl değiştiriyor?",
    category: "Kişisel Gelişim",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=600",
    type: "article",
    badge: "BİLİM",
    badgeColor: "#E74C3C",
    difficulty: "Kolay",
    duration: 6,
    xp: 60,
    isFeatured: false,
    isPopular: true,
    isDaily: false,
    progress: 0,
    tags: ["şükür", "psikoloji", "bilim", "mutluluk"]
  },

  // ─── 3. TESTLER & QUIZ (QUIZ) ───
  {
    id: "q1",
    title: "İlmihal Testi - Seviye 1",
    subtitle: "Temel dini bilgilerini test et",
    category: "Test",
    image: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&q=80&w=600",
    type: "quiz",
    badge: "TEST",
    badgeColor: "#CDA434",
    difficulty: "Kolay",
    duration: 5,
    xp: 150,
    isFeatured: true,
    isPopular: true,
    isDaily: false,
    progress: 0,
    tags: ["test", "quiz", "ilmihal", "temel"]
  },
  {
    id: "q2",
    title: "Siyer Bilgi Yarışması",
    subtitle: "Peygamberimizin hayatına ne kadar hakimsin?",
    category: "Test",
    image: "https://images.unsplash.com/photo-1566904676343-6c84666d6d4a?auto=format&fit=crop&q=80&w=600",
    type: "quiz",
    badge: "ZOR",
    badgeColor: "#E74C3C",
    difficulty: "İleri",
    duration: 10,
    xp: 300,
    isFeatured: false,
    isPopular: true,
    isDaily: false,
    progress: 0,
    tags: ["test", "quiz", "siyer", "peygamber"]
  },

  // ─── 4. SESLİ İÇERİKLER (AUDIO / PODCAST) ───
  {
    id: "au1",
    title: "Yasin Suresi",
    subtitle: "Mekke İmamı Mahir El-Muaykili",
    category: "Kur'an",
    type: "audio",
    durationStr: "15:24",
    color: "#2ECC71",
    isPopular: true,
    tags: ["kuran", "sure", "yasin", "sesli"]
  },
  {
    id: "au2",
    title: "Mülk (Tebareke) Suresi",
    subtitle: "Kabir azabından koruyan sure",
    category: "Kur'an",
    type: "audio",
    durationStr: "08:12",
    color: "#8B5CF6",
    isPopular: true,
    tags: ["kuran", "sure", "mülk", "sesli"]
  },
  {
    id: "au3",
    title: "Rahman Suresi",
    subtitle: "Kur'an'ın Gelini",
    category: "Kur'an",
    type: "audio",
    durationStr: "12:45",
    color: "#CDA434",
    isPopular: false,
    tags: ["kuran", "sure", "rahman", "sesli"]
  },
  {
    id: "au4",
    title: "Vakıa Suresi",
    subtitle: "Rızık ve bereket suresi",
    category: "Kur'an",
    type: "audio",
    durationStr: "09:30",
    color: "#3498DB",
    isPopular: true,
    tags: ["kuran", "sure", "vakıa", "sesli"]
  },
  {
    id: "au5",
    title: "Sabah Zikirleri (Sesli)",
    subtitle: "Güne başlarken dinle",
    category: "Dua",
    type: "audio",
    durationStr: "14:20",
    color: "#E74C3C",
    isPopular: false,
    tags: ["sesli", "dua", "sabah", "zikir"]
  },

  // ─── 5. YARIM BIRAKILANLAR (CONTINUE LEARNING - MOCK MAPPING) ───
  {
    id: "c1",
    type: "video",
    typeLabel: "Tefsir Dersi",
    title: "Fatiha Suresi Tefsiri",
    subtitle: "Bölüm 1",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600",
    progress: 45,
    isContinue: true,
    tags: ["kuran", "video", "tefsir"]
  },
  {
    id: "c2",
    type: "article",
    typeLabel: "Okumaya Devam Et",
    title: "Hz. Yusuf'un Sabrı",
    subtitle: "Kıssalar Serisi",
    image: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&q=80&w=600",
    progress: 75,
    isContinue: true,
    tags: ["kıssa", "peygamber", "sabır"]
  },
  {
    id: "c3",
    type: "audio",
    typeLabel: "Dinlemeye Devam Et",
    title: "Kehf Suresi",
    subtitle: "12:04 kaldı",
    image: null,
    color: "#0F8F57",
    progress: 30,
    isContinue: true,
    tags: ["sesli", "kuran", "cuma"]
  },

  // ─── 6. BUGÜN ÖĞRENİLECEK 5 BİLGİ (FACTS) ───
  {
    id: "f1",
    title: "Cuma Sünneti",
    subtitle: "Cuma günü Kehf Suresi okumak, iki cuma arasındaki günahları bağışlatır ve nurlandırır.",
    type: "fact",
    icon: "📖",
    color: "#CDA434",
    isDaily: true,
    tags: ["bilgi", "cuma", "kuran", "sünnet"]
  },
  {
    id: "f2",
    title: "Sadaka-i Cariye",
    subtitle: "İnsan ölünce ameli kesilir; ancak sadaka-i cariye, faydalı ilim ve salih evlat hariçtir.",
    type: "fact",
    icon: "🌱",
    color: "#2ECC71",
    isDaily: true,
    tags: ["bilgi", "sadaka", "hadis"]
  },
  {
    id: "f3",
    title: "Kadir Gecesi",
    subtitle: "Bin aydan daha hayırlıdır. Kur'an'ın indirilmeye başlandığı gecedir.",
    type: "fact",
    icon: "🌙",
    color: "#8B5CF6",
    isDaily: true,
    tags: ["bilgi", "ramazan", "kadir"]
  },
  {
    id: "f4",
    title: "Duanın Gücü",
    subtitle: "Dua, ibadetin özüdür. Kaderi ancak dua değiştirir ve ömrü ancak iyilik uzatır.",
    type: "fact",
    icon: "🤲",
    color: "#3498DB",
    isDaily: true,
    tags: ["bilgi", "dua", "hadis"]
  },
  {
    id: "f5",
    title: "Tebessüm Sadakadır",
    subtitle: "Din kardeşinin yüzüne gülümsemen sadakadır. Kötülükten sakındırman da sadakadır.",
    type: "fact",
    icon: "😊",
    color: "#F5A623",
    isDaily: true,
    tags: ["bilgi", "ahlak", "sadaka", "hadis"]
  },

  // ─── 7. DÜNYA MÜSLÜMANLARINDAN HİKAYELER (STORIES) ───
  {
    id: "st1",
    title: "Malcolm X'in Hac Yolculuğu",
    subtitle: "Mekke'de ırkçılığın bitişini görüşü",
    image: "https://images.unsplash.com/photo-1566904676343-6c84666d6d4a?auto=format&fit=crop&q=80&w=600",
    type: "story",
    tags: ["dünya", "hikaye", "tarih", "ihtida"]
  },
  {
    id: "st2",
    title: "Japonya'da İslam'ın Yükselişi",
    subtitle: "Tokyo Camii ve artan ihtidalar",
    image: "https://images.unsplash.com/photo-1542051812-ba32e15d6283?auto=format&fit=crop&q=80&w=600",
    type: "story",
    tags: ["dünya", "hikaye", "japonya"]
  },
  {
    id: "st3",
    title: "Afrika'da Bir Su Kuyusu",
    subtitle: "Suya kavuşan köyün mutluluğu",
    image: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=600",
    type: "story",
    tags: ["dünya", "yardım", "sadaka", "afrika"]
  },
  {
    id: "st4",
    title: "Endülüs'ün Mirası",
    subtitle: "Avrupa'da parlayan İslam medeniyeti",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=600",
    type: "story",
    tags: ["dünya", "tarih", "medeniyet", "avrupa"]
  },

  // ─── 8. PREMIUM İÇERİKLER (PREMIUM) ───
  {
    id: "pr1",
    title: "Kur'an Arapçası Eğitim Seti",
    subtitle: "Arapça bilmeyenler için meal okuma teknikleri",
    image: "https://images.unsplash.com/photo-1546410531-bea4edadb855?auto=format&fit=crop&q=80&w=600",
    type: "premium",
    badge: "YENİ",
    badgeColor: "#CDA434",
    isFeatured: true,
    tags: ["premium", "dil", "kuran", "eğitim"]
  },
  {
    id: "pr2",
    title: "Aile İçi İletişim Atölyesi",
    subtitle: "Sünnet ışığında huzurlu bir yuva",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600",
    type: "premium",
    badge: "CANLI DERS",
    badgeColor: "#E74C3C",
    isFeatured: true,
    tags: ["premium", "aile", "iletişim", "psikoloji"]
  },
  {
    id: "pr3",
    title: "Siyer Masterclass",
    subtitle: "Prof. Dr. İhsan Süreyya Sırma ile",
    image: "https://images.unsplash.com/photo-1590076215667-87ebcecc639d?auto=format&fit=crop&q=80&w=600",
    type: "premium",
    badge: "AKADEMİ",
    badgeColor: "#8B5CF6",
    isFeatured: false,
    tags: ["premium", "siyer", "tarih", "akademi"]
  }
];

export const userStats = {
  streak: 7,
  level: 15,
  xp: 4250,
  favoriteTags: ["siyer", "dua", "kuran", "hadis", "namaz"],
  challenges: {
    daily: [
      { id: "d1", title: "Sabah duasını oku", completed: true },
      { id: "d2", title: "1 Yeni Hadis öğren", completed: true },
      { id: "d3", title: "Kur'an'dan 1 Sayfa Oku", completed: true },
      { id: "d4", title: "İlmihal Testini Çöz", completed: false },
      { id: "d5", title: "Yatsı Namazını Kıl", completed: false }
    ],
    weekly: {
      title: "Haftanın Meydan Okuması",
      desc: "Bu hafta 40 Hadis serisini tamamla",
      reward: "1000 XP + Hadis Muhafızı Rozeti",
      current: 30,
      target: 40
    }
  },
  badge: {
    name: "İlim Yolcusu",
    current: 15,
    target: 20
  }
};
