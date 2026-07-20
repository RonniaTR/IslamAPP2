/**
 * Gamification / XP servisi
 * ─────────────────────────
 * Tüm XP akışı backend `/gamification/*` uçları üzerinden kalıcıdır ve
 * kullanıcıya (user_id) sabitlenir. Böylece profilde canlı takip edilir ve
 * liderlik tablosunda kullanıcı kendini görebilir.
 *
 * - awardXP(user, type, {points, details})  → XP ekler (Kur'an, hadis, görev, oyun)
 * - awardXPOnce(user, key, type, opts)       → aynı öğe için gün içinde tek sefer
 * - fetchStats(user)                         → güncel istatistikleri getirir (+cache)
 * - subscribeStats(fn)                        → istatistik değişince UI'ı canlı günceller
 */
import api from '../api';

const LS_STATS = 'islamapp_stats_cache';
const LS_GUEST_ID = 'islamapp_guest_id';
const LS_GUEST_NAME = 'islamapp_guest_name';

const listeners = new Set();

// ─── Kimlik ───
export function getUserId(user) {
  if (user?.user_id) return user.user_id;
  if (user?.id) return user.id;
  let g = localStorage.getItem(LS_GUEST_ID);
  if (!g) {
    g = 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem(LS_GUEST_ID, g); } catch { /* ignore */ }
  }
  return g;
}

export function getUsername(user) {
  const generic = ['Misafir', 'Kardeşim', ''];
  if (user?.name && !generic.includes(user.name)) return user.name;
  return localStorage.getItem(LS_GUEST_NAME) || 'İsimsiz Kahraman';
}

// ─── Cache + abonelik ───
export function getCachedStats() {
  try { return JSON.parse(localStorage.getItem(LS_STATS)) || null; } catch { return null; }
}

function setCachedStats(stats) {
  try { localStorage.setItem(LS_STATS, JSON.stringify(stats)); } catch { /* quota */ }
  listeners.forEach(fn => { try { fn(stats); } catch { /* ignore */ } });
}

export function subscribeStats(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ─── Okuma ───
export async function fetchStats(user) {
  const uid = getUserId(user);
  try {
    const { data } = await api.get(`/gamification/stats/${uid}`);
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      setCachedStats(data);
      return data;
    }
  } catch { /* çevrimdışı → cache */ }
  return getCachedStats();
}

// ─── XP verme ───
export async function awardXP(user, activityType, { points, details = '' } = {}) {
  const uid = getUserId(user);
  const username = getUsername(user);
  const payload = { user_id: uid, activity_type: activityType, details, username };
  if (typeof points === 'number' && points > 0) payload.points = Math.round(points);

  try {
    const { data } = await api.post('/gamification/activity', payload);
    if (data && typeof data.total_points === 'number') {
      const prev = getCachedStats() || {};
      setCachedStats({
        ...prev,
        total_points: data.total_points,
        level: data.level ?? prev.level,
        current_streak: data.current_streak ?? prev.current_streak,
      });
      // Tam istatistikleri (sayaçlar/rozetler) arka planda tazele
      fetchStats(user);
      return data;
    }
  } catch { /* çevrimdışı → sessiz geç */ }
  return null;
}

/**
 * Aynı öğe için gün içinde yalnızca bir kez XP ver (örn. aynı sureyi/hadisi
 * tekrar okumak XP çiftlemesin). `key` öğeye özgü olmalı (örn. 'surah_2').
 */
export async function awardXPOnce(user, key, activityType, opts = {}) {
  const today = new Date().toISOString().split('T')[0];
  const lsKey = `xp_once_${key}_${today}`;
  try {
    if (localStorage.getItem(lsKey)) return null;
    localStorage.setItem(lsKey, '1');
  } catch { /* ignore */ }
  return awardXP(user, activityType, opts);
}

const gamification = { getUserId, getUsername, getCachedStats, subscribeStats, fetchStats, awardXP, awardXPOnce };
export default gamification;
