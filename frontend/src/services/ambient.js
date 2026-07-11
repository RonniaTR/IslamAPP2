/**
 * AMBIENT — dini atmosfer arka plan sesi.
 * ────────────────────────────────────────
 * Varsayılan parça 'Ney Taksimi': Web Audio ile ÜRETİLEN gerçekçi ney sesi —
 * nefes (üflenen hava) dokusu + yumuşak vibrato + notalar arası kayma
 * (portamento) ile Hicaz makamında ağır, tefekkürlü bir taksim çalar.
 * Cümleler arasında nefes payı bırakır; mekanik döngü hissi yoktur.
 * Not: Bu, herhangi bir filmin/eserin kaydı DEĞİLDİR; o üslubu andıran
 * özgün bir sentezdir → %100 telifsiz.
 *
 * KENDİ İLAHİNİ EKLEMEK İÇİN (senin kayıtların = telif sorunu yok):
 *   1. mp3 dosyanı  frontend/public/audio/  klasörüne koy (örn: ilahi1.mp3)
 *   2. TRACKS listesine ekle:
 *      { id: 'ilahi1', name: 'Benim İlahim', type: 'file', url: '/audio/ilahi1.mp3' }
 *   3. Hepsi bu — oynatıcıda seçilebilir olur, döngüde çalar.
 */

export const TRACKS = [
  { id: 'ney', name: 'Ney Taksimi · Hicaz', icon: '🎋', type: 'gen' },
  { id: 'gece', name: 'Gece Neyi · Nihavend', icon: '🌙', type: 'gen' },
  { id: 'su', name: 'Şadırvan · Su Sesi', icon: '⛲', type: 'gen' },
  { id: 'serenity', name: 'Sükûnet · Pad', icon: '✨', type: 'gen' },
  // { id: 'ilahi1', name: 'Benim İlahim', icon: '🎙️', type: 'file', url: '/audio/ilahi1.mp3' },
];

let ctx = null;
let master = null;
let liveNodes = [];   // durdurulacak osilatör/kaynaklar
let timers = [];      // durdurulacak zamanlayıcılar
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

function makeMaster(c) {
  master = c.createGain();
  master.gain.value = volume * 0.5;
  master.connect(c.destination);
}

// ══════════════════════════════════════════════════════════════
//  NEY TAKSİMİ — sentezlenmiş kamış flüt (makam parametrik)
// ══════════════════════════════════════════════════════════════
const MAKAMS = {
  // D4 kök Hicaz: D, Eb, F#, G, A, Bb, C, D5...
  hicaz: {
    root: 293.66,
    steps: [0, 1, 4, 5, 7, 8, 10, 12, 13, 16],
    phrases: [
      [{ n: 4, d: 2.2 }, { n: 5, d: 0.9 }, { n: 4, d: 1.1 }, { n: 3, d: 1.0 }, { n: 2, d: 2.6 }],
      [{ n: 2, d: 1.2 }, { n: 3, d: 0.8 }, { n: 4, d: 1.8 }, { n: 3, d: 0.7 }, { n: 2, d: 0.9 }, { n: 1, d: 1.1 }, { n: 0, d: 3.0 }],
      [{ n: 0, d: 1.6 }, { n: 2, d: 1.0 }, { n: 3, d: 0.8 }, { n: 4, d: 2.4 }, { n: 6, d: 0.9 }, { n: 5, d: 1.0 }, { n: 4, d: 2.2 }],
      [{ n: 7, d: 1.8 }, { n: 6, d: 0.8 }, { n: 5, d: 1.0 }, { n: 4, d: 1.4 }, { n: 5, d: 0.9 }, { n: 4, d: 1.1 }, { n: 2, d: 2.8 }],
      [{ n: 4, d: 1.5 }, { n: 5, d: 0.7 }, { n: 6, d: 0.7 }, { n: 7, d: 2.0 }, { n: 8, d: 1.2 }, { n: 7, d: 2.6 }],
      [{ n: 3, d: 1.3 }, { n: 2, d: 0.9 }, { n: 1, d: 1.6 }, { n: 2, d: 0.8 }, { n: 0, d: 3.4 }],
    ],
  },
  // C4 kök Nihavend (yumuşak minör): gece havası, daha alçak ve durgun
  nihavend: {
    root: 261.63,
    steps: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15],
    phrases: [
      [{ n: 4, d: 2.6 }, { n: 3, d: 1.2 }, { n: 2, d: 1.4 }, { n: 0, d: 3.2 }],
      [{ n: 0, d: 1.8 }, { n: 1, d: 1.0 }, { n: 2, d: 1.6 }, { n: 3, d: 0.9 }, { n: 2, d: 2.8 }],
      [{ n: 5, d: 2.0 }, { n: 4, d: 1.0 }, { n: 3, d: 1.2 }, { n: 4, d: 0.9 }, { n: 2, d: 3.0 }],
      [{ n: 2, d: 1.4 }, { n: 3, d: 1.0 }, { n: 5, d: 2.2 }, { n: 4, d: 1.2 }, { n: 3, d: 2.6 }],
      [{ n: 7, d: 2.4 }, { n: 6, d: 1.0 }, { n: 5, d: 1.3 }, { n: 4, d: 2.9 }],
    ],
  },
};

/** Beyaz gürültü tamponu (nefes dokusu için) */
function noiseBuffer(c) {
  const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Tek ney notası: gövde + nefes + vibrato + önceki notadan kayma */
function neyNote(c, out, freq, t0, dur, prevFreq) {
  // Gövde: sine + zayıf 2. ve 3. armonik → kamış sıcaklığı
  [[1, 0.30], [2, 0.10], [3, 0.035]].forEach(([mult, amp]) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    // Portamento: önceki notadan yumuşak kayma
    o.frequency.setValueAtTime((prevFreq || freq) * mult, t0);
    o.frequency.exponentialRampToValueAtTime(freq * mult, t0 + 0.09);
    // Vibrato: notanın içinde yavaşça belirir (ney üslubu)
    const lfo = c.createOscillator();
    const lfoG = c.createGain();
    lfo.frequency.value = 4.6 + Math.random() * 0.8;
    lfoG.gain.setValueAtTime(0, t0);
    lfoG.gain.linearRampToValueAtTime(freq * mult * 0.007, t0 + Math.min(0.5, dur * 0.4));
    lfo.connect(lfoG).connect(o.frequency);
    // Zarf: yumuşak üfleme girişi, nefesli bırakış
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(amp, t0 + 0.14);
    g.gain.setValueAtTime(amp, t0 + Math.max(0.14, dur - 0.35));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(out);
    o.start(t0); o.stop(t0 + dur + 0.1);
    lfo.start(t0); lfo.stop(t0 + dur + 0.1);
    liveNodes.push(o, lfo);
  });
  // Nefes: nota boyunca bant geçirenden hışırtı
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c);
  noise.loop = true;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = freq * 2.2;
  bp.Q.value = 1.6;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.0001, t0);
  ng.gain.exponentialRampToValueAtTime(0.035, t0 + 0.1);
  ng.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  noise.connect(bp).connect(ng).connect(out);
  noise.start(t0); noise.stop(t0 + dur + 0.1);
  liveNodes.push(noise);
}

function startNey(c, makam = MAKAMS.hicaz) {
  const freqOf = (deg) => makam.root * Math.pow(2, makam.steps[deg] / 12);
  const PHRASES = makam.phrases;
  makeMaster(c);
  // Hafif yankı hissi: gecikme + geri besleme (mağara/mescit havası)
  const delay = c.createDelay(1.0);
  delay.delayTime.value = 0.34;
  const fb = c.createGain(); fb.gain.value = 0.28;
  const wet = c.createGain(); wet.gain.value = 0.35;
  delay.connect(fb).connect(delay);
  delay.connect(wet).connect(master);
  const voice = c.createGain();
  voice.gain.value = 1;
  voice.connect(master);
  voice.connect(delay);

  let lastPhrase = -1;
  const playPhrase = () => {
    if (!playing) return;
    let pi;
    do { pi = Math.floor(Math.random() * PHRASES.length); } while (pi === lastPhrase && PHRASES.length > 1);
    lastPhrase = pi;
    const phrase = PHRASES[pi];
    let t = c.currentTime + 0.15;
    let prev = null;
    const tempo = 0.95 + Math.random() * 0.25; // her cümlede küçük tempo nüansı
    phrase.forEach(({ n, d }) => {
      const f = freqOf(n);
      const dur = d * tempo;
      neyNote(c, voice, f, t, dur, prev);
      prev = f;
      t += dur + 0.06;
    });
    // Cümle bitince nefes payı, sonra yeni cümle
    const wait = (t - c.currentTime) * 1000 + 2200 + Math.random() * 2600;
    timers.push(setTimeout(playPhrase, wait));
  };
  playPhrase();
}

// ══════════════════════════════════════════════════════════════
//  SÜKÛNET — yumuşak pad + nazik çanlar (eski parça, seçenek olarak durur)
// ══════════════════════════════════════════════════════════════
function startSerenity(c) {
  makeMaster(c);
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = 650;
  filter.connect(master);
  const padGain = c.createGain(); padGain.gain.value = 0.14; padGain.connect(filter);
  [146.83, 220.0, 293.66].forEach((f, i) => {
    const o = c.createOscillator();
    o.type = 'triangle'; o.frequency.value = f; o.detune.value = i * 3 - 3;
    const g = c.createGain(); g.gain.value = 0.33;
    o.connect(g).connect(padGain); o.start();
    liveNodes.push(o);
  });
  const chime = () => {
    if (!playing) return;
    const notes = [587.33, 622.25, 739.99, 783.99, 880.0];
    const f = notes[Math.floor(Math.random() * notes.length)];
    const t0 = c.currentTime;
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.07, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.6);
    o.connect(g).connect(master); o.start(t0); o.stop(t0 + 2.8);
    liveNodes.push(o);
    timers.push(setTimeout(chime, 8000 + Math.random() * 8000));
  };
  chime();
}

// ══════════════════════════════════════════════════════════════
//  ŞADIRVAN — akan su + ara ara damlalar (tamamen sentez)
// ══════════════════════════════════════════════════════════════
function startWater(c) {
  makeMaster(c);
  // Akış: alçak geçirilmiş gürültü, yavaş dalgalanan iki katman
  [[420, 0.16, 0.13], [950, 0.07, 0.21]].forEach(([cutoff, amp, lfoRate]) => {
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c);
    src.loop = true;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = cutoff; lp.Q.value = 0.6;
    const g = c.createGain(); g.gain.value = amp;
    const lfo = c.createOscillator(); lfo.frequency.value = lfoRate;
    const lfoG = c.createGain(); lfoG.gain.value = amp * 0.35;
    lfo.connect(lfoG).connect(g.gain);
    src.connect(lp).connect(g).connect(master);
    src.start(); lfo.start();
    liveNodes.push(src, lfo);
  });
  // Damlalar: kısa, perdesi düşen çınlamalar (şadırvan taşına düşen su)
  const drop = () => {
    if (!playing) return;
    const t0 = c.currentTime;
    const f = 900 + Math.random() * 900;
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, t0);
    o.frequency.exponentialRampToValueAtTime(f * 0.55, t0 + 0.12);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
    o.connect(g).connect(master);
    o.start(t0); o.stop(t0 + 0.4);
    liveNodes.push(o);
    timers.push(setTimeout(drop, 700 + Math.random() * 2600));
  };
  drop();
}

function stopGenerated() {
  timers.forEach(t => clearTimeout(t)); timers = [];
  liveNodes.forEach(n => { try { n.stop(); } catch { /* zaten durdu */ } });
  liveNodes = [];
  if (master) { try { master.disconnect(); } catch { /* ignore */ } master = null; }
}

// ══════════════════════════════════════════════════════════════
//  Genel API
// ══════════════════════════════════════════════════════════════
export function getState() { return { playing, volume, track: currentTrack, tracks: TRACKS }; }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function start() {
  if (playing) return;
  const track = TRACKS.find(t => t.id === currentTrack) || TRACKS[0];
  if (track.type === 'file') {
    fileEl = new Audio(track.url);
    fileEl.loop = true;
    fileEl.volume = volume;
    playing = true;
    fileEl.play().catch(() => { playing = false; notify(); });
  } else {
    const c = getCtx();
    if (!c) return;
    playing = true;
    if (track.id === 'serenity') startSerenity(c);
    else if (track.id === 'su') startWater(c);
    else if (track.id === 'gece') startNey(c, MAKAMS.nihavend);
    else startNey(c, MAKAMS.hicaz);
  }
  notify();
}

export function stop() {
  if (!playing) return;
  playing = false;
  stopGenerated();
  if (fileEl) { fileEl.pause(); fileEl = null; }
  notify();
}

export function toggle() { playing ? stop() : start(); }

export function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  try { localStorage.setItem(LS_VOL, String(volume)); } catch { /* ignore */ }
  if (master) master.gain.value = volume * 0.5;
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
