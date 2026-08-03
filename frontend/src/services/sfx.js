/**
 * SFX — Web Audio ile üretilen ses efektleri.
 * Dosya yok, indirme yok, %100 telifsiz (sesleri anlık sentezliyoruz).
 * Doğru/yanlış/combo/zafer/seviye sesleri; localStorage ile aç/kapat.
 *
 * Zafer ve seviye ezgileri Hicaz makamı esintili pentatonik dizide,
 * yumuşak çan tınısıyla çalınır — "tatlı bir dini ses" hissi verir.
 */

let ctx = null;
const LS_KEY = 'sfx_enabled';

export function sfxEnabled() {
  try { return localStorage.getItem(LS_KEY) !== '0'; } catch { return true; }
}
export function setSfxEnabled(on) {
  try { localStorage.setItem(LS_KEY, on ? '1' : '0'); } catch { /* ignore */ }
}

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Tek nota: yumuşak zarflı osilatör (çan/ney hissi için sine + hafif üst armonik) */
function tone(freq, { start = 0, dur = 0.3, vol = 0.16, type = 'sine' } = {}) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
  // Çan tınısı için zayıf bir oktav üstü
  const o2 = c.createOscillator();
  const g2 = c.createGain();
  o2.type = 'sine';
  o2.frequency.value = freq * 2;
  g2.gain.setValueAtTime(0.0001, t0);
  g2.gain.exponentialRampToValueAtTime(vol * 0.25, t0 + 0.02);
  g2.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.7);
  o2.connect(g2).connect(c.destination);
  o2.start(t0);
  o2.stop(t0 + dur);
}

// Hicaz esintili dizi (D5 kökü): D, Eb, F#, G, A, D6
const HICAZ = [587.33, 622.25, 739.99, 783.99, 880.0, 1174.66];

export const sfx = {
  correct() {
    if (!sfxEnabled()) return;
    tone(659.25, { dur: 0.12, vol: 0.12 });          // E5
    tone(880.0, { start: 0.09, dur: 0.22, vol: 0.14 }); // A5
  },
  wrong() {
    if (!sfxEnabled()) return;
    tone(196, { dur: 0.22, vol: 0.1, type: 'triangle' });
    tone(155.56, { start: 0.12, dur: 0.28, vol: 0.09, type: 'triangle' });
  },
  combo(n = 2) {
    if (!sfxEnabled()) return;
    const steps = Math.min(4, n);
    for (let i = 0; i < steps; i++) tone(HICAZ[i % HICAZ.length], { start: i * 0.07, dur: 0.14, vol: 0.1 });
  },
  /** Oyun bitişi — tatlı, makam esintili kısa ezgi */
  victory() {
    if (!sfxEnabled()) return;
    const phrase = [0, 2, 3, 4, 3, 5]; // D F# G A G D6
    phrase.forEach((deg, i) => tone(HICAZ[deg], { start: i * 0.16, dur: i === phrase.length - 1 ? 0.7 : 0.24, vol: 0.13 }));
  },
  /** Seviye atlama — yükselen kutlama arpeji */
  levelUp() {
    if (!sfxEnabled()) return;
    [0, 1, 2, 3, 4, 5].forEach((deg, i) => tone(HICAZ[deg], { start: i * 0.09, dur: 0.3, vol: 0.13 }));
    tone(HICAZ[5], { start: 0.66, dur: 0.9, vol: 0.15 });
  },
  claim() {
    if (!sfxEnabled()) return;
    tone(783.99, { dur: 0.12, vol: 0.12 });
    tone(1174.66, { start: 0.1, dur: 0.3, vol: 0.13 });
  },
};

export default sfx;
