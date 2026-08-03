/**
 * SADE — AÇILIŞ SESLERİ
 * ─────────────────────
 * Üç dünyanın üç ayrı açılış tınısı. Hepsi Web Audio ile ÜRETİLİR;
 * hiçbir kayıt, örnek veya eser kullanılmaz → %100 telifsiz.
 *
 *   ney → SÜKÛN   Hicaz'da tek uzun nefes; nefesli saldırı, ağır vibrato,
 *                 sonunda oktav altına inen bir iç çekiş.
 *   su  → FECR    Üç damla, ardından yükselen parlak bir arpej (Rast'a
 *                 yakın), sonunda hafif bir "aydınlanma" parıltısı.
 *   cam → MİHRAP  Derin kâse tınısı; iki uyumsuz kısmî ton üst üste,
 *                 uzun sönüm, taş mekân hissi için geniş gecikme.
 *
 * Tarayıcı dokunuşsuz ses çalmaz; bu yüzden açılış sahnesi kullanıcının
 * dokunuşuyla başlar.
 */

const PREF = 'sade_ses';

let ctx = null;
const live = [];

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function isSesOn() {
  try { return localStorage.getItem(PREF) !== '0'; } catch { return true; }
}
export function setSes(on) {
  try { localStorage.setItem(PREF, on ? '1' : '0'); } catch { /* quota */ }
}

/** Ortak çıkış: gecikmeli uzam + ana ses seviyesi. */
function bus(c, { feedback = 0.3, wet = 0.34, delay = 0.26, gain = 0.5 } = {}) {
  const master = c.createGain();
  master.gain.value = gain;
  const d = c.createDelay(1.5);
  d.delayTime.value = delay;
  const fb = c.createGain(); fb.gain.value = feedback;
  const w = c.createGain(); w.gain.value = wet;
  d.connect(fb).connect(d);
  d.connect(w).connect(c.destination);
  master.connect(d);
  master.connect(c.destination);
  return master;
}

function osc(c, dest, { type = 'sine', freq, at, dur, peak = 0.16, glide = 0, vib = 0 }) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  if (glide) {
    o.frequency.setValueAtTime(freq * (1 - glide), at);
    o.frequency.exponentialRampToValueAtTime(freq, at + 0.18);
  } else {
    o.frequency.setValueAtTime(freq, at);
  }
  if (vib) {
    const l = c.createOscillator(); const lg = c.createGain();
    l.frequency.value = 5.0; lg.gain.value = freq * vib;
    l.connect(lg).connect(o.frequency);
    l.start(at); l.stop(at + dur + 0.1); live.push(l);
  }
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + 0.1);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(dest);
  o.start(at); o.stop(at + dur + 0.1);
  live.push(o);
}

/** Nefes/su dokusu — filtrelenmiş gürültü. */
function noise(c, dest, { at, dur, from = 500, to = 1600, peak = 0.4, q = 1.1 }) {
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99765 * b0 + w * 0.0990460;
    b1 = 0.96300 * b1 + w * 0.2965164;
    b2 = 0.57000 * b2 + w * 1.0526913;
    d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.09;
  }
  const src = c.createBufferSource(); src.buffer = buf;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
  bp.frequency.setValueAtTime(from, at);
  bp.frequency.exponentialRampToValueAtTime(to, at + dur * 0.7);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + dur * 0.2);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(bp).connect(g).connect(dest);
  src.start(at); src.stop(at + dur);
  live.push(src);
}

/** Kâse/çan — kısmî tonlarla. */
function bowl(c, dest, { freq, at, dur = 4.2, peak = 0.22 }) {
  [[1, peak], [2.76, peak * 0.3], [5.4, peak * 0.12]].forEach(([r, pk]) => {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'sine'; o.frequency.value = freq * r;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(pk, at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(dest);
    o.start(at); o.stop(at + dur + 0.1);
    live.push(o);
  });
}

/**
 * Seçili dünyanın açılış sesini çalar.
 * @param tur 'ney' | 'su' | 'cam'
 */
export function playSade(tur = 'ney') {
  if (!isSesOn()) return;
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime + 0.05;

  if (tur === 'su') {
    // FECR — üç damla, yükselen arpej, parıltı
    const m = bus(c, { feedback: 0.22, wet: 0.28, delay: 0.17, gain: 0.5 });
    [0, 0.34, 0.66].forEach((d, i) => {
      noise(c, m, { at: t + d, dur: 0.24, from: 1400 + i * 500, to: 3600, peak: 0.5, q: 4 });
      osc(c, m, { type: 'sine', freq: 880 + i * 220, at: t + d, dur: 0.5, peak: 0.09 });
    });
    // Rast'a yakın yükseliş: G4 A4 B4 D5 E5
    [392.0, 440.0, 493.88, 587.33, 659.25].forEach((f, i) =>
      osc(c, m, { type: 'triangle', freq: f, at: t + 1.0 + i * 0.2, dur: 1.1, peak: 0.13, glide: 0.01 }));
    bowl(c, m, { freq: 880, at: t + 2.1, dur: 2.6, peak: 0.14 });
    return;
  }

  if (tur === 'cam') {
    // MİHRAP — taş mekânda derin kâse
    const m = bus(c, { feedback: 0.45, wet: 0.45, delay: 0.4, gain: 0.5 });
    noise(c, m, { at: t, dur: 1.4, from: 180, to: 700, peak: 0.3, q: 0.8 });
    bowl(c, m, { freq: 146.83, at: t + 0.25, dur: 5.4, peak: 0.26 });   // D3
    bowl(c, m, { freq: 220.0, at: t + 1.0, dur: 4.4, peak: 0.16 });     // A3
    osc(c, m, { type: 'sine', freq: 293.66, at: t + 2.0, dur: 3.0, peak: 0.1 }); // D4
    return;
  }

  // SÜKÛN — Hicaz'da tek uzun nefes
  const m = bus(c, { feedback: 0.34, wet: 0.38, delay: 0.3, gain: 0.48 });
  noise(c, m, { at: t, dur: 2.8, from: 460, to: 1300, peak: 0.46, q: 1.2 });
  osc(c, m, { type: 'triangle', freq: 293.66, at: t + 0.45, dur: 2.2, peak: 0.16, glide: 0.02, vib: 0.006 }); // D4
  osc(c, m, { type: 'triangle', freq: 311.13, at: t + 1.5, dur: 1.6, peak: 0.13, vib: 0.006 });               // Eb4
  osc(c, m, { type: 'triangle', freq: 369.99, at: t + 2.3, dur: 1.9, peak: 0.14, vib: 0.006 });               // F#4
  osc(c, m, { type: 'sine',     freq: 146.83, at: t + 3.1, dur: 3.4, peak: 0.12 });                            // D3 iç çekiş
  bowl(c, m, { freq: 440.0, at: t + 3.3, dur: 3.6, peak: 0.16 });
}

export function stopSade() {
  live.forEach(n => { try { n.stop(); } catch { /* zaten durmuş */ } });
  live.length = 0;
}

const sadeAudio = { playSade, stopSade, isSesOn, setSes };
export default sadeAudio;
