/**
 * AMBIENT — dini atmosfer arka plan sesi.
 * ────────────────────────────────────────
 * Varsayılan parça 'Sükûnet' tamamen Web Audio ile ÜRETİLİR:
 * alçak perdeden yumuşak bir pad + ara ara Hicaz dizisinden nazik
 * çan sesleri. Dosya yok → %100 telifsiz.
 *
 * KENDİ İLAHİNİ EKLEMEK İÇİN (senin kayıtların = telif sorunu yok):
 *   1. mp3 dosyanı  frontend/public/audio/  klasörüne koy (örn: ilahi1.mp3)
 *   2. Aşağıdaki TRACKS listesine ekle:
 *      { id: 'ilahi1', name: 'Benim İlahim', type: 'file', url: '/audio/ilahi1.mp3' }
 *   3. Hepsi bu — oynatıcıda seçilebilir olur, döngüde çalar.
 *
 * Sayfalar arasında çalmaya devam eder (modül seviyesinde tekil durum).
 */

export const TRACKS = [
  { id: 'serenity', name: 'Sükûnet (üretilmiş)', type: 'gen' },
  // { id: 'ilahi1', name: 'Benim İlahim', type: 'file', url: '/audio/ilahi1.mp3' },
];

let ctx = null;
let master = null;
let padNodes = [];
let chimeTimer = null;
let fileEl = null;
let playing = false;
let currentTrack = TRACKS[0].id;
const listeners = new Set();

const LS_VOL = 'ambient_volume';
const LS_TRACK = 'ambient_track';

let volume = (() => { try { return Number(localStorage.getItem(LS_VOL) ?? 0.5); } catch { return 0.5; } })();
try { const t = localStorage.getItem(LS_TRACK); if (t && TRACKS.some(x => x.id === t)) currentTrack = t; } catch { /* ignore */ }

function notify() { listeners.forEach(fn => { try { fn(getState()); } catch { /* ignore */ } }); }

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// Hicaz dizisi — nazik çanlar için
const CHIME_NOTES = [587.33, 622.25, 739.99, 783.99, 880.0];

function playChime() {
  const c = getCtx();
  if (!c || !master) return;
  const f = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
  const t0 = c.currentTime;
  [f, f * 2].forEach((freq, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    const v = i === 0 ? 0.08 : 0.02;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.6);
    o.connect(g).connect(master);
    o.start(t0);
    o.stop(t0 + 2.8);
  });
}

function startGenerative() {
  const c = getCtx();
  if (!c) return false;
  master = c.createGain();
  master.gain.value = volume * 0.4;
  master.connect(c.destination);

  // Yumuşak pad: D3 + A3 + D4, alçak geçiren filtre, yavaş nefes LFO'su
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 650;
  filter.connect(master);

  const padGain = c.createGain();
  padGain.gain.value = 0.16;
  padGain.connect(filter);

  padNodes = [146.83, 220.0, 293.66].map((f, i) => {
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    o.detune.value = i * 3 - 3; // hafif genişlik
    const g = c.createGain();
    g.gain.value = 0.33;
    o.connect(g).connect(padGain);
    o.start();
    return o;
  });

  // Nefes hissi: pad seviyesini çok yavaş dalgalandır
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain).connect(padGain.gain);
  lfo.start();
  padNodes.push(lfo);

  // Ara ara nazik çan (8-16 sn arası)
  const scheduleChime = () => {
    chimeTimer = setTimeout(() => { playChime(); scheduleChime(); }, 8000 + Math.random() * 8000);
  };
  playChime();
  scheduleChime();
  return true;
}

function stopGenerative() {
  if (chimeTimer) { clearTimeout(chimeTimer); chimeTimer = null; }
  padNodes.forEach(n => { try { n.stop(); } catch { /* ignore */ } });
  padNodes = [];
  if (master) { try { master.disconnect(); } catch { /* ignore */ } master = null; }
}

export function getState() {
  return { playing, volume, track: currentTrack, tracks: TRACKS };
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function start() {
  if (playing) return;
  const track = TRACKS.find(t => t.id === currentTrack) || TRACKS[0];
  if (track.type === 'file') {
    fileEl = new Audio(track.url);
    fileEl.loop = true;
    fileEl.volume = volume;
    fileEl.play().catch(() => { playing = false; notify(); });
  } else if (!startGenerative()) return;
  playing = true;
  notify();
}

export function stop() {
  if (!playing) return;
  stopGenerative();
  if (fileEl) { fileEl.pause(); fileEl = null; }
  playing = false;
  notify();
}

export function toggle() { playing ? stop() : start(); }

export function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  try { localStorage.setItem(LS_VOL, String(volume)); } catch { /* ignore */ }
  if (master) master.gain.value = volume * 0.4;
  if (fileEl) fileEl.volume = volume;
  notify();
}

export function setTrack(id) {
  if (!TRACKS.some(t => t.id === id)) return;
  const wasPlaying = playing;
  stop();
  currentTrack = id;
  try { localStorage.setItem(LS_TRACK, id); } catch { /* ignore */ }
  if (wasPlaying) start();
  notify();
}

const ambient = { start, stop, toggle, setVolume, setTrack, getState, subscribe, TRACKS };
export default ambient;
