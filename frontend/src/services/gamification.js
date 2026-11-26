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
  const local = getCachedStats();
  try {
    const { data } = await api.get(`/gamification/stats/${uid}`);
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const mergedPoints = Math.max(local?.total_points || 0, data.total_points || 0);
      const merged = {
        ...local,
        ...data,
        total_points: mergedPoints,
        level: computeLevel(mergedPoints),
      };
      setCachedStats(merged);
      return merged;
    }
  } catch { /* çevrimdışı → cache */ }
  return local;
}

// ─── XP verme ───
const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000];
export function computeLevel(points = 0) {
  let lvl = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (points >= LEVEL_THRESHOLDS[i]) lvl = i + 1;
  }
  return lvl;
}

export async function awardXP(user, activityType, { points, details = '' } = {}) {
  const uid = getUserId(user);
  const username = getUsername(user);
  const addPts = typeof points === 'number' && points > 0 ? Math.round(points) : 10;
  const payload = { user_id: uid, activity_type: activityType, details, username, points: addPts };

  // Anında yerel önbelleği güncelle (çevrimdışı veya sunucu uyanırken de seviye/XP kesintisiz çalışsın)
  const prev = getCachedStats() || { total_points: 0, level: 1, current_streak: 0 };
  const optimisticPoints = (prev.total_points || 0) + addPts;
  const optimisticStats = {
    ...prev,
    total_points: optimisticPoints,
    level: computeLevel(optimisticPoints),
  };
  setCachedStats(optimisticStats);

  try {
    const { data } = await api.post('/gamification/activity', payload);
    if (data && typeof data.total_points === 'number') {
      const mergedPoints = Math.max(optimisticPoints, data.total_points);
      setCachedStats({
        ...optimisticStats,
        total_points: mergedPoints,
        level: computeLevel(mergedPoints),
        current_streak: data.current_streak ?? optimisticStats.current_streak,
      });
      return data;
    }
  } catch { /* çevrimdışı → yerel önbellek zaten güncellendi */ }
  return optimisticStats;
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
