// frontend/src/services/returnEngine.js
// 🕯️ GERİ DÖNÜŞ MODU — uzun süre ara vermiş, dönmek isteyen kişi için.
//
// NEDEN AYRI BİR MOTOR?
// Normal Nur Yolu motoru (pathEngine) devamlılığı ödüllendirir ve kesintiyi
// cezalandırır: getStreak() bir gün atlanınca sıfırlanır, mertebeler "tam
// gün" ister. Geri dönen biri kaçınılmaz olarak gün atlar — ilk atladığında
// sıfırlanan seri onu uygulamadan tamamen koparır.
//
// Bu motor üç şeyi değiştirir:
//   1) ŞEFKAT SERİSİ  — seri sıfırlanmaz, duraklar. Kullanıcı 3 kredi ile
//      başlar; atlanan gün bir kredi harcar, tamamlanan gün geri kazandırır.
//      Krediler tükenmeden seri kırılmaz.
//   2) KADEMELİ YÜK   — 1. gün TEK görev. Kırk günde kademeli olarak 4'e çıkar.
//   3) DÖNÜŞ DİLİ     — mertebeler büyüme değil "eve varış" metaforu taşır.
//
// pathEngine'i SARAR, kopyalamaz: plan üretimi, görev havuzu ve tarihçe hâlâ
// oradan gelir; burada yalnız yük ve seri yorumu değişir.

import {
  todayKey, getProfile, getHistory, generatePlan, TASK_POOL,
  registerPlanFilter, registerTasks, logEvent,
} from './pathEngine';
import { getDayContent, getPhase, RETURN_PHASES, LAST_DAY } from '../data/returnPath';

export { RETURN_PHASES, LAST_DAY };

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } };

const STATE_KEY = 'donus_state';
export const MAX_MERCY = 3;
export const ARC_DAYS = 40; // kırk gün — yerleşik ve anlamlı bir eşik

/** Bu kullanıcı geri dönüş modunda mı? */
export function isReturnMode(profile = getProfile()) {
  return !!profile && profile.mode === 'donus';
}

/** Gün farkı (takvim günü, saat değil). */
function dayDiff(fromISO, toISO) {
  const a = new Date(fromISO + 'T00:00:00');
  const b = new Date(toISO + 'T00:00:00');
  return Math.round((b - a) / 86400000);
}

function freshState() {
  return {
    startedAt: todayKey(),
    lastSeen: todayKey(),
    mercy: MAX_MERCY,
    streak: 0,
    milestones: [],
  };
}

export function getReturnState() {
  let s = load(STATE_KEY, null);
  if (!s || !s.startedAt) { s = freshState(); save(STATE_KEY, s); }
  return s;
}

export function resetReturnState() {
  try { localStorage.removeItem(STATE_KEY); } catch { /* ignore */ }
}

/**
 * Yolculuğun kaçıncı günündeyiz (1'den başlar, takvim günü esaslı).
 * Ara verilen günler de sayılır — yolculuk devam ediyor, kullanıcı yok olmuyor.
 */
export function getReturnDay(state = getReturnState()) {
  return Math.max(1, dayDiff(state.startedAt, todayKey()) + 1);
}

/**
 * Bugünün görev sayısı — kademeli artış.
 * 1-3. gün: 1 görev · 4-9: 2 · 10-20: 3 · 21+: 4
 * Aşırı yükleme, geri dönenin en büyük düşmanı.
 */
export function getTaskCount(day = getReturnDay()) {
  if (day <= 3) return 1;
  if (day <= 9) return 2;
  if (day <= 20) return 3;
  return 4;
}

/**
 * ŞEFKAT SERİSİ — devamsızlığı geçmişe dönük uzlaştırır.
 *
 * Son görülen günden bugüne kadar geçen her BOŞ gün için bir kredi harcanır.
 * Krediler varken seri korunur; tükendiğinde seri sıfırlanır ve krediler
 * yenilenir (kullanıcı temiz bir sayfayla devam eder, kapı kapanmaz).
 *
 * Uygulama her açılışta çağrılmalıdır (idempotent — aynı gün ikinci çağrı
 * hiçbir şeyi değiştirmez).
 */
export function reconcile() {
  const s = getReturnState();
  const today = todayKey();
  if (s.lastSeen === today) return s;

  const hist = getHistory();
  const gap = Math.max(0, dayDiff(s.lastSeen, today));

  // lastSeen ile bugün ARASINDAKİ günler (bugün hariç): işlenmiş mi?
  for (let i = 1; i < gap; i++) {
    const d = new Date(s.lastSeen + 'T00:00:00');
    d.setDate(d.getDate() + i);
    const k = d.toISOString().slice(0, 10);
    const h = hist[k];
    if (h && h.done > 0) {
      s.streak += 1;
      s.mercy = Math.min(MAX_MERCY, s.mercy + 1);
    } else {
      s.mercy -= 1;
      if (s.mercy < 0) { s.streak = 0; s.mercy = MAX_MERCY; }
    }
  }

  s.lastSeen = today;
  save(STATE_KEY, s);
  return s;
}

/**
 * Bugün en az bir görev tamamlandığında çağrılır.
 * Seriyi bugün için bir kez artırır ve bir şefkat kredisi geri kazandırır.
 */
export function creditToday() {
  const s = getReturnState();
  const today = todayKey();
  if (s.creditedOn === today) return s;
  s.creditedOn = today;
  s.streak += 1;
  s.mercy = Math.min(MAX_MERCY, s.mercy + 1);
  s.lastSeen = today;
  save(STATE_KEY, s);
  return s;
}

/** Ekranda gösterilecek seri bilgisi. */
export function getMercyStreak() {
  const s = getReturnState();
  return { streak: s.streak, mercy: s.mercy, max: MAX_MERCY };
}

// ─── Dönüş mertebeleri ───
// Büyüme değil "eve varış" metaforu: mevcut Tohum→Çınar dili geri dönen
// kişiye "sen hiçbir şeydin" der; bu yanlış bir başlangıç noktasıdır.
export const RETURN_STAGES = [
  { id: 0, name: 'Niyet',     emoji: '🕯️', need: 0,  desc: 'Dönmeye karar verdin — en zor adım bu' },
  { id: 1, name: 'İlk Adım',  emoji: '👣', need: 3,  desc: '3 gün yolda' },
  { id: 2, name: 'Dönüş',     emoji: '🚪', need: 10, desc: '10 gün yolda' },
  { id: 3, name: 'Yerleşme',  emoji: '🏡', need: 21, desc: '21 gün yolda' },
  { id: 4, name: 'Kökleşme',  emoji: '🌳', need: ARC_DAYS, desc: 'Kırk gün — yol artık senin' },
];

/**
 * Mertebe, TAM GÜN değil YOLDA GEÇEN GÜN sayısına bakar.
 * Normal modda "tam gün" (planın tamamı) gerekir; burada bir görev bile
 * o günü "yolda" sayar. Ölçü mükemmellik değil, süreklilik.
 */
export function getReturnStage() {
  const { streak } = getMercyStreak();
  const hist = getHistory();
  const activeDays = Object.values(hist).filter(h => h.done > 0).length;
  const measure = Math.max(streak, activeDays);
  let cur = RETURN_STAGES[0];
  for (const s of RETURN_STAGES) if (measure >= s.need) cur = s;
  const next = RETURN_STAGES.find(s => s.need > measure) || null;
  return { current: cur, next, days: measure };
}

// ─── Kırk günlük müfredat ───

const READ_KEY = 'donus_read';

/** Bugünün ders içeriği (F2 müfredatı). Kırkıncı günden sonra son gün kalır. */
export function getTodayLesson(lang = 'tr', day = getReturnDay()) {
  return getDayContent(Math.min(day, LAST_DAY), lang);
}

/** Günün ait olduğu faz (Kapı · Temel · Bağ · Ahlak · Kökleşme). */
export function getTodayPhase(day = getReturnDay()) {
  return getPhase(Math.min(day, LAST_DAY));
}

/** Okunmuş ders günlerinin listesi. */
export function getReadDays() {
  const v = load(READ_KEY, []);
  return Array.isArray(v) ? v : [];
}

export function isDayRead(day = getReturnDay()) {
  return getReadDays().includes(Math.min(day, LAST_DAY));
}

/** Bir dersi okundu işaretler; faz tamamlandıysa günlüğe yazar. */
export function markDayRead(day = getReturnDay()) {
  const d = Math.min(day, LAST_DAY);
  const list = getReadDays();
  if (list.includes(d)) return list;
  list.push(d);
  save(READ_KEY, list);
  const phase = getPhase(d);
  if (phase && d === phase.to) {
    logEvent('phase', `${phase.emoji} "${phase.name}" bölümü tamamlandı`, phase.emoji);
  }
  return list;
}

/** Müfredat ilerlemesi: okunan ders sayısı / 40. */
export function getLessonProgress() {
  const read = getReadDays().length;
  return { read, total: LAST_DAY, pct: Math.min(1, read / LAST_DAY) };
}

/** Kırk gün doldu mu — bitiş ekranı için. */
export function isArcComplete(day = getReturnDay()) {
  return day > LAST_DAY || (day === LAST_DAY && isDayRead(LAST_DAY));
}

// ─── Dönüş rozetleri ───
// Normal rozetler "tam gün" ve uzun seri ister; dönüş modunda bunların çoğu
// haftalarca erişilemez ve rozet rafı boş bir vitrine dönüşür. Bu set
// müfredat ilerlemesine bağlıdır — yani gerçekten yapılan işe.
export const RETURN_BADGES = [
  { id: 'r-esik',   emoji: '🚪', name: 'Eşik',        desc: 'İlk dersi tamamla' },
  { id: 'r-kapi',   emoji: '🕯️', name: 'Kapı',        desc: 'İlk bölümü bitir (7 gün)' },
  { id: 'r-temel',  emoji: '🕌', name: 'Temel',       desc: 'Namaz bölümünü bitir (16 gün)' },
  { id: 'r-bag',    emoji: '📖', name: 'Bağ',         desc: "Kur'an ve zikir bölümünü bitir (26 gün)" },
  { id: 'r-ahlak',  emoji: '🌿', name: 'Ahlak',       desc: 'Ahlak bölümünü bitir (34 gün)' },
  { id: 'r-kirk',   emoji: '🌳', name: 'Kırk Gün',    desc: 'Kırk günün tamamını oku' },
  { id: 'r-sefkat', emoji: '🤲', name: 'Şefkat',      desc: 'Bir gün atladıktan sonra geri dön' },
  { id: 'r-sebat',  emoji: '💠', name: 'Sebat',       desc: 'Yolda 21 gün topla' },
];

/** Dönüş rozetlerini kazanılma durumuyla döndürür. */
export function getReturnBadges() {
  const read = getReadDays();
  const has = (upTo) => read.length > 0 && RETURN_PHASES
    .filter(p => p.to <= upTo)
    .every(p => Array.from({ length: p.to - p.from + 1 }, (_, i) => p.from + i).every(d => read.includes(d)));
  const s = getReturnState();
  const { days } = getReturnStage();
  const earned = {
    'r-esik': read.length >= 1,
    'r-kapi': has(7),
    'r-temel': has(16),
    'r-bag': has(26),
    'r-ahlak': has(34),
    'r-kirk': read.length >= LAST_DAY,
    'r-sefkat': s.mercy < MAX_MERCY && s.streak > 0,
    'r-sebat': days >= 21,
  };
  return RETURN_BADGES.map(b => ({ ...b, earned: !!earned[b.id] }));
}

/**
 * Kırk gün bitince normal Nur Yolu'na geçiş.
 * Profil modu değişir; şefkat serisi ve okunan dersler KORUNUR — kişi
 * isterse geri dönebilir ve geçmişi yerinde durur.
 */
export function graduateToNormal() {
  const p = getProfile();
  if (!p) return null;
  const next = { ...p, mode: 'normal', graduatedAt: Date.now() };
  save('nur_profile', next);
  logEvent('phase', '🌳 Kırk günlük yol tamamlandı — Nur Yolu\'na geçildi', '🌳');
  return next;
}

/**
 * Dönüş modunda bugünün planı — pathEngine'in ürettiği sıralamanın
 * ilk N görevini alır. İki görev her zaman ayrıcalıklıdır:
 *   ders     — kırk günlük müfredatın o günkü sayfası (yolun omurgası)
 *   muhasebe — dönüşün kalbi kendini gözlemlemektir
 */
export function buildReturnTasks(profile = getProfile(), day = getReturnDay()) {
  const count = getTaskCount(day);
  const picked = [];
  // 1) Günün dersi — müfredat sürdüğü sürece her gün plandadır
  if (day <= LAST_DAY) picked.push('ders');
  // 2) Muhasebe (planda üretildiyse)
  const full = generatePlan(profile);
  if (picked.length < count && full.includes('muhasebe')) picked.push('muhasebe');
  // 3) Kalanı normal plandan doldur
  for (const id of full) {
    if (picked.length >= count) break;
    if (!picked.includes(id) && TASK_POOL[id]) picked.push(id);
  }
  return picked.slice(0, Math.max(count, 1));
}

/** Kırk günlük yayda ilerleme oranı (0..1) — ilerleme çubuğu için. */
export function getArcProgress() {
  const { days } = getReturnStage();
  return Math.min(1, days / ARC_DAYS);
}

// ─── Motoru pathEngine'e tanıt ───
// Bu modül yüklendiği anda plan filtresi ve "günün dersi" görevi kurulur;
// dönüş modundaki kullanıcı için "Bugünün Yolu" otomatik olarak kademeli
// görev sayısına iner ve müfredat dersini içerir.
// (App.js bu modülü yan etki olarak import eder — bkz. App.js)
registerTasks({
  ders: {
    id: 'ders', icon: '🕯️', title: 'Günün dersi', minutes: 4, xp: 20, route: '/donus/gun',
    desc: 'Kırk günlük yolun bugünkü sayfası — okuma, ayet, dua ve tek adım',
    detect: () => isDayRead(),
  },
});

registerPlanFilter((tasks, profile) => {
  if (!isReturnMode(profile)) return tasks;
  return buildReturnTasks(profile);
});

const returnEngine = {
  isReturnMode, getReturnState, resetReturnState, getReturnDay, getTaskCount,
  reconcile, creditToday, getMercyStreak, getReturnStage, buildReturnTasks,
  getArcProgress, RETURN_STAGES, MAX_MERCY, ARC_DAYS,
  getTodayLesson, getTodayPhase, getReadDays, isDayRead, markDayRead,
  getLessonProgress, isArcComplete, RETURN_PHASES, LAST_DAY,
  RETURN_BADGES, getReturnBadges, graduateToNormal,
};
export default returnEngine;
