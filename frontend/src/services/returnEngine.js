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
  todayKey, getProfile, getHistory, generatePlan, TASK_POOL, registerPlanFilter,
} from './pathEngine';

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

/**
 * Dönüş modunda bugünün planı — pathEngine'in ürettiği sıralamanın
 * ilk N görevini alır. Muhasebe (amel defteri) her zaman içeride kalır:
 * dönüşün kalbi kendini gözlemlemektir.
 */
export function buildReturnTasks(profile = getProfile(), day = getReturnDay()) {
  const count = getTaskCount(day);
  const full = generatePlan(profile);
  const picked = [];
  // Muhasebe önceliklidir (varsa)
  if (full.includes('muhasebe')) picked.push('muhasebe');
  for (const id of full) {
    if (picked.length >= count) break;
    if (!picked.includes(id) && TASK_POOL[id]) picked.push(id);
  }
  return picked.slice(0, count);
}

/** Kırk günlük yayda ilerleme oranı (0..1) — ilerleme çubuğu için. */
export function getArcProgress() {
  const { days } = getReturnStage();
  return Math.min(1, days / ARC_DAYS);
}

// ─── Motoru pathEngine'e tanıt ───
// Bu modül yüklendiği anda plan filtresi kurulur; dönüş modundaki kullanıcı
// için "Bugünün Yolu" otomatik olarak kademeli görev sayısına iner.
// (App.js bu modülü yan etki olarak import eder — bkz. App.js)
registerPlanFilter((tasks, profile) => {
  if (!isReturnMode(profile)) return tasks;
  return buildReturnTasks(profile);
});

const returnEngine = {
  isReturnMode, getReturnState, resetReturnState, getReturnDay, getTaskCount,
  reconcile, creditToday, getMercyStreak, getReturnStage, buildReturnTasks,
  getArcProgress, RETURN_STAGES, MAX_MERCY, ARC_DAYS,
};
export default returnEngine;
