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
export const ASSESSMENT = [
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
  const p = { ...answers, createdAt: Date.now() };
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
};
export const TASK_POOL = TASKS;

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
  extras.push('oyun', 'zikir');
  if (profile.hedef === 'ezber' && !ids.includes('hifz')) extras.unshift('hifz');
  for (const e of extras) { if (ids.length >= count) break; if (!ids.includes(e)) ids.push(e); }
  return ids;
}

export function getTodayPlan() {
  const profile = getProfile();
  if (!profile) return null;
  const key = `nur_plan_${todayKey()}`;
  let plan = load(key, null);
  if (!plan) {
    plan = {
      date: todayKey(),
      tasks: generatePlan(profile),
      done: [],
      planTime: Date.now(),
      snap: {
        elifba: load('elifba_done', []).length,
        story: load('story_read', []).length,
        article: load('lib_read', []).length,
        gameXp: load(`gc_daily_${todayKey()}`, {}).xp || 0,
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
  ASSESSMENT, TASK_POOL, STAGES,
  getProfile, saveProfile, resetProfile,
  getTodayPlan, isTaskDone, toggleTask,
  getHistory, getStreak, getFullDays, getStage, syncHistory, todayKey,
};
export default pathEngine;
