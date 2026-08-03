// frontend/src/services/pathEngine.js
// 🛤️ NUR YOLU — kişisel manevi yol motoru.
//
// Uygulamanın omurgası: kısa bir değerlendirmeden çıkan profile göre her
// gün kişiye özel, 10-30 dakikalık bir "Bugünün Yolu" planı üretir.
// Görevler uygulamanın MEVCUT modüllerine bağlanır (Elif Ba, kıssa,
// makale, oyun, ezber, muhasebe, mushaf...). Tamamlama çoğu görevde
// otomatik algılanır (modüllerin localStorage izlerinden), istenirse
// elle de işaretlenir. Seri (streak) ve mertebe sistemi yolculuğu görünür
// kılar. Tamamen istemci tarafında çalışır; taşınabilir yapıdadır.

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };

export const todayKey = () => new Date().toISOString().slice(0, 10);

// ─── Değerlendirme soruları ───
// İlk soru YOLU BELİRLER: 'donus' seçildiğinde returnEngine devreye girer
// (kademeli yük + şefkat serisi + dönüş mertebeleri).
export const ASSESSMENT = [
  {
    id: 'mode', q: 'Bu yolda neredesin?', icon: '🧭',
    options: [
      { id: 'normal', label: 'Yolumda devam ediyorum' },
      { id: 'yeni',   label: 'Yeni başlıyorum' },
      { id: 'donus',  label: 'Uzun süredir ara verdim, dönmek istiyorum' },
    ],
  },
  {
    id: 'namaz', q: 'Namaz düzenin nasıl?', icon: '🕌',
    options: [
      { id: 'yeni', label: 'Yeni başlıyorum' },
      { id: 'arasira', label: 'Ara sıra kılıyorum' },
      { id: 'duzenli', label: 'Düzenli kılıyorum' },
    ],
  },
  {
    id: 'quran', q: "Kur'an okuma seviyene en yakın olan?", icon: '📖',
    options: [
      { id: 'yok', label: 'Harfleri bilmiyorum' },
      { id: 'elifba', label: 'Elif Ba öğreniyorum' },
      { id: 'okuyor', label: 'Okuyabiliyorum' },
    ],
  },
  {
    id: 'sure', q: 'Günde ne kadar vakit ayırabilirsin?', icon: '⏱️',
    options: [
      { id: 'kisa', label: '10 dakika' },
      { id: 'orta', label: '20 dakika' },
      { id: 'uzun', label: '30+ dakika' },
    ],
  },
  {
    id: 'hedef', q: 'Şu an en büyük hedefin hangisi?', icon: '🎯',
    options: [
      { id: 'namaz', label: 'Namaz alışkanlığı' },
      { id: 'okuma', label: "Kur'an okumayı öğrenmek" },
      { id: 'ezber', label: 'Sure ezberlemek' },
      { id: 'ilim', label: 'İlim ve bilgi' },
    ],
  },
];

export function getProfile() { return load('nur_profile', null); }
export function saveProfile(answers) {
  // 'yeni' ve 'normal' aynı motoru kullanır; yalnız 'donus' ayrışır.
  const mode = answers.mode === 'donus' ? 'donus' : 'normal';
  const p = { ...answers, mode, createdAt: Date.now() };
  save('nur_profile', p);
  return p;
}
export function resetProfile() { try { localStorage.removeItem('nur_profile'); } catch { /* ignore */ } }

// ─── Görev havuzu ───
// detect: plan anlık görüntüsüne (snap) göre otomatik tamamlama kontrolü
const TASKS = {
  niyet: {
    id: 'niyet', icon: '🕌', title: 'Namaz niyeti', minutes: 1, xp: 5, route: '/fiqh',
    desc: 'Bugünkü vakitleri kılmaya niyet et; rehber gerekirse İbadet bölümü yanında',
    detect: null, // elle işaretlenir
  },
  elifba: {
    id: 'elifba', icon: '🔤', title: 'Elif Ba dersi', minutes: 5, xp: 15, route: '/elifba',
    desc: 'Kaldığın dersten devam et — harfler seni bekliyor',
    detect: (snap) => load('elifba_done', []).length > snap.elifba,
  },
  quran: {
    id: 'quran', icon: '📖', title: "Kur'an oku", minutes: 7, xp: 15, route: '/quran',
    desc: 'Kaldığın yerden birkaç ayet — mushaf akışı seni bekliyor',
    detect: (snap) => (load('quran_last', {}).ts || 0) > snap.planTime,
  },
  hifz: {
    id: 'hifz', icon: '📿', title: 'Ezber çalışması', minutes: 7, xp: 20, route: '/hifz',
    desc: 'Günün tekrar kuyruğunu bitir veya yeni ayet ezberle',
    detect: () => !!load(`hifz_log_${todayKey()}`, null),
  },
  kissa: {
    id: 'kissa', icon: '🕯️', title: 'Bir kıssa oku', minutes: 4, xp: 12, route: '/stories',
    desc: 'Bir kıssa, bir soru, bir hikmet — cevherini topla',
    detect: (snap) => load('story_read', []).length > snap.story,
  },
  makale: {
    id: 'makale', icon: '📚', title: 'Bir makale oku', minutes: 5, xp: 10, route: '/library',
    desc: 'Kütüphaneden kaynak referanslı bir yazı',
    detect: (snap) => load('lib_read', []).length > snap.article,
  },
  oyun: {
    id: 'oyun', icon: '🎮', title: 'Bilgi turu', minutes: 4, xp: 15, route: '/games',
    desc: 'Oyun Merkezi’nde bir tur — bilgini XP’ye çevir',
    detect: (snap) => (load(`gc_daily_${todayKey()}`, {}).xp || 0) > snap.gameXp,
  },
  muhasebe: {
    id: 'muhasebe', icon: '📔', title: 'Akşam muhasebesi', minutes: 3, xp: 15, route: '/journal',
    desc: 'Amel Defteri: 3 soru, 1 kalp — günü mühürle',
    detect: () => (load('journal_entries', []) || []).some(e => (e.date || '').slice(0, 10) === todayKey()),
  },
  zikir: {
    id: 'zikir', icon: '📿', title: 'Zikir vakti', minutes: 3, xp: 10, route: '/dhikr',
    desc: 'Tesbihatını çek — kalbe cila',
    detect: null,
  },
  tesbihat: {
    id: 'tesbihat', icon: '📿', title: 'Tesbihat çek', minutes: 4, xp: 15, route: '/hazine/tesbihat',
    desc: 'Sayaçlı tesbihattan bir seti tamamla (namaz tesbihatı, istiğfar, salavat...)',
    detect: () => Object.keys(load(`tesbihat_log_${todayKey()}`, {})).length > 0,
  },
  mucize: {
    id: 'mucize', icon: '✨', title: "Kur'an'dan bir işaret", minutes: 3, xp: 10, route: '/hazine/mucizeler',
    desc: 'Mucizeler bölümünden bir infografik kartı oku',
    detect: (snap) => load('mucize_read', []).length > (snap.mucize ?? 0),
  },
  dua: {
    id: 'dua', icon: '🤲', title: 'Bir hidayet duası öğren', minutes: 3, xp: 10, route: '/hazine/dualar',
    desc: 'Hidayet Duaları rafından bir duayı aç, oku, ezberlemeye niyet et',
    detect: (snap) => load('dua_read', []).length > (snap.dua ?? 0),
  },
  esma: {
    id: 'esma', icon: '🌟', title: 'Bir güzel isim keşfet', minutes: 3, xp: 10, route: '/hazine/esma',
    desc: 'Esmaül Hüsna rafından bir ismi aç; hattını, anlamını ve tefekkürünü oku',
    detect: (snap) => load('esma_read', []).length > (snap.esma ?? 0),
  },
  cuma: {
    id: 'cuma', icon: '🕌', title: 'Cuma Bereketi', minutes: 8, xp: 20, route: '/quran/18',
    desc: "Kehf Sûresi'nden bir bölüm oku, Efendimize (s.a.v.) çokça salavat getir",
    detect: (snap) => {
      const last = load('quran_last', {});
      return last.surah === 18 && (last.ts || 0) > snap.planTime;
    },
  },
};
export const TASK_POOL = TASKS;

// Alternatif modlar havuza kendi görevlerini ekleyebilir (ör. Geri Dönüş'ün
// "günün dersi" görevi). registerPlanFilter ile aynı gerekçe: pathEngine
// diğer modülleri import etmez, onlar kendilerini tanıtır.
export function registerTasks(extra) {
  if (extra && typeof extra === 'object') Object.assign(TASKS, extra);
}

// ─── Haftalık tema müfredatı ───
// Yol, haftalara bölünmüş temalarla ilerler; her temanın bir "yıldız
// görevi" vardır ve o hafta plana öncelikli girer. Ayet mealleri özgün
// ifadeyle, kaynaklı verilmiştir.
export const WEEKLY_THEMES = [
  { id: 'niyet',  emoji: '🌱', title: 'Niyet ve Başlangıç', focus: 'muhasebe',
    verse: '"Ameller ancak niyetlere göredir..."', source: "Buhârî, Bedü'l-Vahy 1",
    desc: 'Bu hafta kalbi ayarlıyoruz: her işin başı niyet.' },
  { id: 'namaz',  emoji: '🕌', title: 'Namazla Diriliş', focus: 'niyet',
    verse: '"Şüphesiz namaz, hayâsızlıktan ve kötülükten alıkoyar."', source: 'Ankebût 45',
    desc: 'Bu hafta vakitlerin etrafında bir hayat kuruyoruz.' },
  { id: 'quran',  emoji: '📖', title: "Kur'an'la Bağ", focus: 'quran',
    verse: '"Andolsun biz Kur\'an\'ı, düşünüp öğüt almak için kolaylaştırdık..."', source: 'Kamer 17',
    desc: 'Bu hafta her gün Kitab\'ımızla buluşuyoruz.' },
  { id: 'zikir',  emoji: '📿', title: 'Dilin Zikri', focus: 'zikir',
    verse: '"...Bilesiniz ki kalpler ancak Allah\'ı anmakla huzur bulur."', source: "Ra'd 28",
    desc: 'Bu hafta dili ve kalbi zikirle yumuşatıyoruz.' },
  { id: 'ahlak',  emoji: '🌿', title: 'Güzel Ahlak', focus: 'kissa',
    verse: '"Ve sen elbette yüce bir ahlâk üzeresin."', source: 'Kalem 4',
    desc: 'Bu hafta kıssalardan karaktere yol çiziyoruz.' },
  { id: 'sukur',  emoji: '🌸', title: 'Şükür ve Sabır', focus: 'makale',
    verse: '"...Andolsun, şükrederseniz elbette size (nimetimi) artırırım..."', source: 'İbrâhîm 7',
    desc: 'Bu hafta nimeti görmeyi ve zorlukta durmayı öğreniyoruz.' },
  { id: 'ilim',   emoji: '🕯️', title: 'İlim Yolu', focus: 'oyun',
    verse: '"...De ki: Rabbim, ilmimi artır."', source: 'Tâhâ 114',
    desc: 'Bu hafta bilgiyi tazeliyor, öğrendiğini sınıyorsun.' },
  { id: 'ezber',  emoji: '💎', title: 'Ezber ve Sebat', focus: 'hifz',
    verse: '"Andolsun biz Kur\'an\'ı, düşünüp öğüt almak için kolaylaştırdık. Öğüt alan yok mu?"', source: 'Kamer 22',
    desc: 'Bu hafta ayetleri kalbe nakşediyoruz — az ama devamlı.' },
];

export function getWeekTheme(profile = getProfile()) {
  if (!profile) return WEEKLY_THEMES[0];
  const day = Math.max(0, Math.floor((Date.now() - (profile.createdAt || Date.now())) / 86400000));
  const week = Math.floor(day / 7) % WEEKLY_THEMES.length;
  return { ...WEEKLY_THEMES[week], weekNo: Math.floor(day / 7) + 1 };
}

// ─── Günün sözü (âlim sözleri + hadisler, kaynaklı, dönüşümlü) ───
export const DAILY_QUOTES = [
  { text: 'İlim, amelle güzelleşir; amel, ihlasla değer kazanır.', by: 'İmam Şâfiî (nakledilir)' },
  { text: "Az da olsa devamlı olan amel, Allah'a en sevimli olandır.", by: 'Buhârî, Rikāk 18' },
  { text: 'Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.', by: 'Buhârî, İlim 11' },
  { text: 'İnsanların en hayırlısı, insanlara en faydalı olandır.', by: 'Hadis (Taberânî, rivayet)' },
  { text: 'Nerede olursan ol, Allah\'a karşı gelmekten sakın ve kötülüğün ardından bir iyilik yap ki onu silsin.', by: 'Tirmizî, Birr 55' },
  { text: 'Sabır, ilk sarsıntı anındadır.', by: 'Buhârî, Cenâiz 32' },
  { text: 'Temizlik imanın yarısıdır.', by: 'Müslim, Tahâret 1' },
  { text: 'Mümin, bir delikten iki kez sokulmaz.', by: 'Buhârî, Edeb 83' },
  { text: 'Kalpler de bedenler gibi yorulur; onları hikmet sözleriyle dinlendirin.', by: 'Hz. Ali (r.a.) — nakledilir' },
  { text: 'Dünya ahiretin tarlasıdır.', by: 'Meşhur hikmet sözü' },
];
export function getDailyQuote() {
  const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return DAILY_QUOTES[doy % DAILY_QUOTES.length];
}

// ─── Günün duası (Arapça + okunuş/meal + kaynak) ───
export const DAILY_DUAS = [
  { ar: 'رَبِّ زِدْنِي عِلْمًا', tr: 'Rabbim! İlmimi artır.', source: 'Tâhâ 114' },
  { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', tr: 'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver; bizi ateş azabından koru.', source: 'Bakara 201' },
  { ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', tr: 'Rabbim! Göğsüme genişlik ver, işimi kolaylaştır.', source: 'Tâhâ 25-26' },
  { ar: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', tr: 'Ey kalpleri evirip çeviren! Kalbimi dinin üzere sabit kıl.', source: 'Tirmizî, Deavât 89' },
  { ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا', tr: "Allah'ım! Senden faydalı ilim, temiz rızık ve kabul olunmuş amel isterim.", source: 'İbn Mâce, İkāmet 32' },
];
export function getDailyDua() {
  const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return DAILY_DUAS[doy % DAILY_DUAS.length];
}

// ─── Nur Yolu rozetleri (mevcut modül izlerinden hesaplanır) ───
export const NUR_BADGES = [
  { id: 'ilk-adim',  emoji: '👣', name: 'İlk Adım',      desc: 'İlk görevini tamamla',
    test: (ctx) => ctx.anyDone },
  { id: 'tam-gun',   emoji: '☀️', name: 'Tam Gün',       desc: 'Bir günün tüm görevlerini bitir',
    test: (ctx) => ctx.fullDays >= 1 },
  { id: 'seri-7',    emoji: '🔥', name: 'Yedi Kandil',   desc: '7 gün üst üste yolda kal',
    test: (ctx) => ctx.streak >= 7 },
  { id: 'fidan',     emoji: '🪴', name: 'Fidan',         desc: '7 tam gün doldur',
    test: (ctx) => ctx.fullDays >= 7 },
  { id: 'cinar',     emoji: '🌲', name: 'Çınar',         desc: '30 tam gün doldur',
    test: (ctx) => ctx.fullDays >= 30 },
  { id: 'ezber-1',   emoji: '📿', name: 'İlk Nakış',     desc: 'İlk ayetini sağlamlaştır',
    test: (ctx) => ctx.solidAyah >= 1 },
  { id: 'ezber-sure',emoji: '💎', name: 'Sure Tamam',    desc: 'Bir sureyi baştan sona sağlamlaştır',
    test: (ctx) => ctx.fullSurah },
  { id: 'cevher-5',  emoji: '🌌', name: 'Cevher Avcısı', desc: '5 hikmet cevheri topla',
    test: (ctx) => ctx.gems >= 5 },
  { id: 'okur',      emoji: '📚', name: 'Okur',          desc: '5 makale bitir',
    test: (ctx) => ctx.articles >= 5 },
  { id: 'muhasebeci',emoji: '📔', name: 'Muhasebeci',    desc: '7 gün amel defteri doldur',
    test: (ctx) => ctx.journal >= 7 },
];

export function getBadges() {
  const hist = getHistory();
  let fullSurah = false, solidAyah = 0;
  try {
    const hs = load('hifz_state', {});
    const bySurah = {};
    Object.entries(hs).forEach(([k, c]) => {
      if ((c.interval || 0) >= 7) {
        solidAyah += 1;
        const s = k.split(':')[0];
        bySurah[s] = (bySurah[s] || 0) + 1;
      }
    });
    const VERSES = { 1: 7, 103: 3, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3, 111: 5, 112: 4, 113: 5, 114: 6 };
    fullSurah = Object.entries(bySurah).some(([s, n]) => VERSES[s] && n >= VERSES[s]);
  } catch { /* ignore */ }
  const ctx = {
    anyDone: Object.values(hist).some(h => h.done > 0),
    fullDays: getFullDays(),
    streak: getStreak(),
    solidAyah, fullSurah,
    gems: Object.keys(load('gc_gems', {})).length,
    articles: (load('lib_read', []) || []).length,
    journal: (load('journal_entries', []) || []).length,
  };
  return NUR_BADGES.map(b => ({ ...b, earned: (() => { try { return !!b.test(ctx); } catch { return false; } })() }));
}

// ─── Yolculuk Günlüğü (olay kaydı) ───
// Mertebe atlamaları, rozet kazanımları ve tam günler otomatik yazılır.
export function logEvent(type, title, emoji) {
  const ev = load('nur_events', []);
  ev.unshift({ ts: Date.now(), type, title, emoji });
  save('nur_events', ev.slice(0, 200));
}
export function getEvents() { return load('nur_events', []); }

// Yeni kazanımları algıla: yeni rozetler döner (bildirim için), günlüğe yazar
// badgeList/seenKey: geri dönüş modu kendi rozet setini verir; iki setin
// "görüldü" kayıtları birbirine karışmaz.
export function detectNewEvents(badgeList, seenKey = 'nur_badges_seen') {
  const fresh = [];
  const list = Array.isArray(badgeList) && badgeList.length ? badgeList : getBadges();
  const earned = list.filter(b => b.earned).map(b => b.id);
  const seen = load(seenKey, []);
  const newOnes = earned.filter(id => !seen.includes(id));
  if (newOnes.length) {
    save(seenKey, earned);
    newOnes.forEach(id => {
      const b = list.find(x => x.id === id);
      if (b) { logEvent('badge', `"${b.name}" rozeti kazanıldı`, b.emoji); fresh.push(b); }
    });
  }
  // Tam gün kaydı
  const hist = getHistory();
  const t = todayKey();
  const logged = load('nur_fulldays_logged', []);
  if (hist[t] && hist[t].total > 0 && hist[t].done >= hist[t].total && !logged.includes(t)) {
    logged.push(t); save('nur_fulldays_logged', logged);
    logEvent('fullday', 'Günün tüm görevleri tamamlandı', '☀️');
  }
  return fresh;
}

// ─── Mertebe atlama kutlaması (bir kez gösterilir) ───
// stageArg/seenKey: geri dönüş modu kendi mertebe setini ve kendi "görüldü"
// anahtarını verir; iki modun kutlamaları birbirini bastırmaz.
export function checkStageCelebration(stageArg, seenKey = 'nur_stage_seen') {
  const stage = stageArg || getStage();
  const seen = load(seenKey, 0);
  if (stage.current.id > seen) {
    save(seenKey, stage.current.id);
    if (stage.current.id > 0) {
      logEvent('stage', `${stage.current.emoji} ${stage.current.name} mertebesine ulaşıldı`, '🏆');
      return stage.current;
    }
  }
  return null;
}

// ─── Günlük plan üretimi (deterministik) ───
export function generatePlan(profile) {
  const count = profile.sure === 'kisa' ? 3 : profile.sure === 'orta' ? 4 : 5;
  const day = Math.floor((Date.now() - (profile.createdAt || Date.now())) / 86400000);
  const ids = [];
  // 1) Kur'an ayağı: seviyeye göre
  if (profile.quran === 'yok' || profile.quran === 'elifba') ids.push('elifba');
  else if (profile.hedef === 'ezber') ids.push('hifz');
  else ids.push(day % 3 === 2 ? 'hifz' : 'quran');
  // 2) Bilgi ayağı: kıssa/makale dönüşümlü
  ids.push(day % 2 === 0 ? 'kissa' : 'makale');
  // 3) Muhasebe her gün
  ids.push('muhasebe');
  // 4-5) Kalan yuvalar: hedefe ve güne göre
  const extras = [];
  if (profile.namaz !== 'duzenli' || profile.hedef === 'namaz') extras.push('niyet');
  // Hazine görevleri günlere dağılır: tesbihat / dua / mucize / esma dönüşümlü
  extras.push(['tesbihat', 'dua', 'mucize', 'esma'][day % 4], 'oyun', 'zikir');
  if (profile.hedef === 'ezber' && !ids.includes('hifz')) extras.unshift('hifz');
  for (const e of extras) { if (ids.length >= count) break; if (!ids.includes(e)) ids.push(e); }
  // Haftanın yıldız görevi plana öncelikli girer (seviyeye uygunsa)
  const focus = getWeekTheme(profile).focus;
  const blocked = (profile.quran === 'yok' || profile.quran === 'elifba') && (focus === 'quran' || focus === 'hifz');
  if (TASKS[focus] && !ids.includes(focus) && !blocked) {
    if (ids.length < count) ids.push(focus);
    else if (ids[ids.length - 1] !== 'muhasebe') ids[ids.length - 1] = focus;
    else if (focus !== 'muhasebe') ids[1] = focus;
  }
  // Cuma günü: plana BONUS görev eklenir (yuva saymaz — bereket fazladan)
  if (new Date().getDay() === 5 && !ids.includes('cuma')) ids.push('cuma');
  return ids;
}

// Alternatif modlar (ör. Geri Dönüş) plan listesini daraltabilir.
// returnEngine bu kancaya kendini kaydeder — böylece pathEngine
// returnEngine'i import etmez ve döngüsel bağımlılık oluşmaz.
let planFilter = null;
export function registerPlanFilter(fn) { planFilter = typeof fn === 'function' ? fn : null; }

function buildTasks(profile) {
  const tasks = generatePlan(profile);
  if (!planFilter) return tasks;
  try {
    const filtered = planFilter(tasks, profile);
    return Array.isArray(filtered) && filtered.length ? filtered : tasks;
  } catch { return tasks; }
}

export function getTodayPlan() {
  const profile = getProfile();
  if (!profile) return null;
  const key = `nur_plan_${todayKey()}`;
  let plan = load(key, null);
  if (!plan) {
    plan = {
      date: todayKey(),
      tasks: buildTasks(profile),
      done: [],
      planTime: Date.now(),
      snap: {
        elifba: load('elifba_done', []).length,
        story: load('story_read', []).length,
        article: load('lib_read', []).length,
        gameXp: load(`gc_daily_${todayKey()}`, {}).xp || 0,
        mucize: load('mucize_read', []).length,
        dua: load('dua_read', []).length,
        esma: load('esma_read', []).length,
        planTime: Date.now(),
      },
    };
    save(key, plan);
  }
  return plan;
}

export function isTaskDone(plan, taskId) {
  if (plan.done.includes(taskId)) return true;
  const t = TASKS[taskId];
  if (t?.detect) { try { return !!t.detect(plan.snap); } catch { return false; } }
  return false;
}

export function toggleTask(taskId) {
  const key = `nur_plan_${todayKey()}`;
  const plan = getTodayPlan();
  if (!plan) return null;
  plan.done = plan.done.includes(taskId) ? plan.done.filter(x => x !== taskId) : [...plan.done, taskId];
  save(key, plan);
  syncHistory(plan);
  return plan;
}

// ─── Tarihçe + seri + mertebe ───
export function syncHistory(plan = getTodayPlan()) {
  if (!plan) return;
  const hist = load('nur_history', {});
  const doneCount = plan.tasks.filter(t => isTaskDone(plan, t)).length;
  hist[plan.date] = { done: doneCount, total: plan.tasks.length };
  save('nur_history', hist);
}

export function getHistory() { return load('nur_history', {}); }

export function getStreak() {
  const hist = getHistory();
  let streak = 0;
  const d = new Date();
  // bugün en az 1 görev yoksa dünden say
  const today = todayKey();
  if (!hist[today] || hist[today].done === 0) d.setDate(d.getDate() - 1);
  for (;;) {
    const k = d.toISOString().slice(0, 10);
    if (hist[k] && hist[k].done > 0) { streak += 1; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

export function getFullDays() {
  const hist = getHistory();
  return Object.values(hist).filter(h => h.total > 0 && h.done >= h.total).length;
}

// Mertebeler — yolculuk metaforu (bitki büyümesi)
export const STAGES = [
  { id: 0, name: 'Tohum', emoji: '🌰', need: 0, desc: 'Yol niyetle başlar' },
  { id: 1, name: 'Filiz', emoji: '🌱', need: 3, desc: '3 tam gün' },
  { id: 2, name: 'Fidan', emoji: '🪴', need: 7, desc: '7 tam gün' },
  { id: 3, name: 'Ağaç', emoji: '🌳', need: 15, desc: '15 tam gün' },
  { id: 4, name: 'Çınar', emoji: '🌲', need: 30, desc: '30 tam gün' },
  { id: 5, name: 'Gülistan', emoji: '🌷', need: 60, desc: '60 tam gün' },
];

export function getStage() {
  const days = getFullDays();
  let cur = STAGES[0];
  for (const s of STAGES) if (days >= s.need) cur = s;
  const next = STAGES.find(s => s.need > days) || null;
  return { current: cur, next, days };
}

const pathEngine = {
  ASSESSMENT, TASK_POOL, STAGES, WEEKLY_THEMES, DAILY_QUOTES, DAILY_DUAS, NUR_BADGES,
  getProfile, saveProfile, resetProfile,
  getTodayPlan, isTaskDone, toggleTask,
  getHistory, getStreak, getFullDays, getStage, syncHistory, todayKey,
  getWeekTheme, getDailyQuote, getDailyDua, getBadges, checkStageCelebration,
  logEvent, getEvents, detectNewEvents, registerPlanFilter, registerTasks,
};
export default pathEngine;
