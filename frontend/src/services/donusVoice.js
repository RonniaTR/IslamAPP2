/**
 * DÖNÜŞ ODASI — SESLENDİRME MOTORU
 * ─────────────────────────────────
 * Kırk perdenin insan sesiyle okunması içindir.
 *
 * TASARIM İLKESİ: ses ZORUNLU DEĞİLDİR.
 * Dosya yoksa, ağ yoksa, kullanıcı istemiyorsa perde yine çalışır —
 * okuma moduna düşer ve satırlar kendi temposuyla akar. Böylece
 * seslendirmeler tek tek eklenebilir; 40'ı birden hazır olmak zorunda
 * değildir. Bugün 7 perde sesli, 33 perde sessiz olabilir.
 *
 * DOSYA YERLEŞİMİ
 *   frontend/public/audio/donus/perde-01.mp3
 *   frontend/public/audio/donus/perde-02.mp3   ... perde-40.mp3
 *
 * Uygulama açılışta bu dosyaları YOKLAMAZ (40 istek atmaz). Bunun
 * yerine perde açıldığında tek bir HEAD isteğiyle bakar ve sonucu
 * hafızada tutar.
 *
 * ZAMANLAMA
 * Her satırın data'daki `t` değeri, seslendirmedeki başlangıç
 * saniyesidir. Kayıt yapıldıktan sonra bu değerler kayda göre
 * güncellenir; ses çalarken o anki satır vurgulanır, diğerleri söner.
 * Ölçüm için: perde ekranındaki "zaman damgası al" düğmesi (geliştirme
 * modunda) o anki saniyeyi panoya kopyalar.
 *
 * ARKA PLAN SESİ
 * Konuşma başlarken ambient müzik kısılır (duck), bitince eski
 * seviyesine döner. İki ses üst üste binmez.
 */

import ambient from './ambient';

const BASE = '/audio/donus';
const PREF_KEY = 'donus_voice_on';
const RATE_KEY = 'donus_voice_rate';

const available = new Map(); // day -> boolean
let audio = null;
let currentDay = null;
let duckedFrom = null;
const listeners = new Set();

const pad = (n) => String(n).padStart(2, '0');
export const perdeUrl = (day) => `${BASE}/perde-${pad(day)}.mp3`;

function emit() {
  const s = getState();
  listeners.forEach(fn => { try { fn(s); } catch { /* ignore */ } });
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function getState() {
  return {
    day: currentDay,
    playing: !!audio && !audio.paused && !audio.ended,
    time: audio ? audio.currentTime : 0,
    duration: audio && Number.isFinite(audio.duration) ? audio.duration : 0,
    rate: getRate(),
    enabled: isVoiceOn(),
  };
}

export function isVoiceOn() {
  try { return localStorage.getItem(PREF_KEY) !== '0'; } catch { return true; }
}
export function setVoiceOn(on) {
  try { localStorage.setItem(PREF_KEY, on ? '1' : '0'); } catch { /* quota */ }
  if (!on) stop();
  emit();
}

export function getRate() {
  try { return Number(localStorage.getItem(RATE_KEY)) || 1; } catch { return 1; }
}
export function setRate(r) {
  const v = Math.min(1.5, Math.max(0.75, Number(r) || 1));
  try { localStorage.setItem(RATE_KEY, String(v)); } catch { /* quota */ }
  if (audio) audio.playbackRate = v;
  emit();
}

/**
 * Bu perdenin seslendirmesi var mı?
 * Tek HEAD isteği; sonuç hafızada tutulur. Ağ yoksa false döner ve
 * uygulama okuma moduna geçer — hata gösterilmez.
 */
export async function hasVoice(day) {
  if (available.has(day)) return available.get(day);
  try {
    const res = await fetch(perdeUrl(day), { method: 'HEAD' });
    const ok = res.ok && !String(res.headers.get('content-type') || '').includes('text/html');
    available.set(day, ok);
    return ok;
  } catch {
    available.set(day, false);
    return false;
  }
}

/** Ambient müziği kıs (konuşma sırasında). */
function duck() {
  const st = ambient.getState();
  if (!st.playing) return;
  duckedFrom = st.volume;
  ambient.setVolume(Math.max(0.06, st.volume * 0.25));
}
function unduck() {
  if (duckedFrom == null) return;
  ambient.setVolume(duckedFrom);
  duckedFrom = null;
}

export function play(day) {
  if (!isVoiceOn()) return null;
  if (currentDay !== day) stop();
  if (!audio) {
    audio = new Audio(perdeUrl(day));
    audio.preload = 'auto';
    audio.playbackRate = getRate();
    audio.addEventListener('timeupdate', emit);
    audio.addEventListener('ended', () => { unduck(); emit(); });
    audio.addEventListener('loadedmetadata', emit);
    audio.addEventListener('error', () => { available.set(day, false); stop(); });
    currentDay = day;
  }
  duck();
  audio.play().catch(() => { /* dokunuş gerekiyor olabilir */ });
  emit();
  return audio;
}

export function pause() {
  if (audio) audio.pause();
  unduck();
  emit();
}

export function toggle(day) {
  const s = getState();
  if (s.playing && s.day === day) pause(); else play(day);
}

export function seek(sec) {
  if (audio && Number.isFinite(sec)) audio.currentTime = Math.max(0, sec);
  emit();
}

export function stop() {
  if (audio) {
    audio.pause();
    audio.removeEventListener('timeupdate', emit);
    audio.src = '';
    audio = null;
  }
  currentDay = null;
  unduck();
  emit();
}

/**
 * Verilen zamana göre aktif satırın indeksi.
 * Ses yoksa okuma modunda da aynı fonksiyon kullanılır (sanal saat).
 */
export function activeLine(lines, time) {
  if (!Array.isArray(lines) || !lines.length) return 0;
  let idx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (time + 0.15 >= (lines[i].t || 0)) idx = i; else break;
  }
  return idx;
}

/** Verilen zamana göre aktif sahne. */
export function activeScene(sahne, time) {
  if (!Array.isArray(sahne) || !sahne.length) return null;
  let cur = sahne[0];
  for (const s of sahne) if (time + 0.15 >= (s.at || 0)) cur = s;
  return cur;
}

const donusVoice = {
  perdeUrl, hasVoice, play, pause, toggle, seek, stop,
  getState, subscribe, isVoiceOn, setVoiceOn, getRate, setRate,
  activeLine, activeScene,
};
export default donusVoice;
