/**
 * DÖNÜŞ ODASI — GİRİŞ SESİ
 * ────────────────────────
 * Odaya girerken çalan kısa açılış tınısı. Web Audio ile ÜRETİLİR:
 * hiçbir kayıt, örnek (sample) veya eser kullanılmaz → %100 telifsiz.
 *
 * Sahne üç katmandan oluşur:
 *   1. NEFES     — filtrelenmiş pembe gürültü; kandilin üflenişi
 *   2. ARPEJ     — Hicaz makamında yükselen dört nota (yumuşak üçgen dalga
 *                  + hafif vibrato); desen kendini çizerken yükselir
 *   3. TINI      — sonda bir çan/kâse tınısı (iki uyumlu sinüs + uzun sönüm)
 *
 * Tarayıcılar dokunuşsuz ses çalmaya izin vermez; bu yüzden ses ancak
 * kullanıcı odaya girmek için dokunduğunda başlatılır. Sessize alınmışsa
 * (ambient tercihi kapalıysa) hiç çalınmaz — kimseye zorla ses dinletmeyiz.
 */

const PREF_KEY = 'donus_gate_sound';

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

/** Giriş sesi açık mı? (varsayılan: açık) */
export function isGateSoundOn() {
  try { return localStorage.getItem(PREF_KEY) !== '0'; } catch { return true; }
}

export function setGateSound(on) {
  try { localStorage.setItem(PREF_KEY, on ? '1' : '0'); } catch { /* quota */ }
}

/** Pembe gürültüye yakın bir tampon — nefes/üfleme dokusu. */
function breathBuffer(c, seconds) {
  const len = Math.floor(c.sampleRate * seconds);
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
  return buf;
}

/** Tek bir yumuşak nota — hafif vibrato ve nefesli saldırı. */
function note(c, dest, freq, at, dur, gain = 0.16) {
  const osc = c.createOscillator();
  const g = c.createGain();
  const lfo = c.createOscillator();
  const lfoG = c.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq * 0.985, at);
  osc.frequency.exponentialRampToValueAtTime(freq, at + 0.1); // hafif kayma

  lfo.frequency.value = 5.2;
  lfoG.gain.value = freq * 0.006;
  lfo.connect(lfoG).connect(osc.frequency);

  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.12);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  osc.connect(g).connect(dest);
  osc.start(at); osc.stop(at + dur + 0.05);
  lfo.start(at); lfo.stop(at + dur + 0.05);
  live.push(osc, lfo);
}

/** Kâse/çan tınısı — iki uyumlu sinüs, uzun sönüm. */
function chime(c, dest, freq, at, dur = 3.4) {
  [1, 2.76].forEach((ratio, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq * ratio;
    const peak = i === 0 ? 0.2 : 0.06;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(g).connect(dest);
    osc.start(at); osc.stop(at + dur + 0.05);
    live.push(osc);
  });
}

/**
 * Giriş sahnesinin sesi. Toplam ~4.5 sn.
 * Hicaz dizisi (Re üzerinde): D4 · Eb4 · F#4 · G4 → sonda A4 tınısı.
 */
export function playGate() {
  if (!isGateSoundOn()) return;
  const c = getCtx();
  if (!c) return;

  const master = c.createGain();
  master.gain.value = 0.5;

  // Uzam hissi için basit bir gecikme (reverb yerine, ucuz ve temiz)
  const delay = c.createDelay(1.2);
  delay.delayTime.value = 0.26;
  const fb = c.createGain();
  fb.gain.value = 0.32;
  const wet = c.createGain();
  wet.gain.value = 0.35;
  delay.connect(fb).connect(delay);
  delay.connect(wet).connect(c.destination);
  master.connect(delay);
  master.connect(c.destination);

  const t = c.currentTime + 0.05;

  // 1) Nefes — kandil üfleniyor
  const src = c.createBufferSource();
  src.buffer = breathBuffer(c, 2.6);
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(520, t);
  bp.frequency.exponentialRampToValueAtTime(1500, t + 1.6);
  bp.Q.value = 1.1;
  const bg = c.createGain();
  bg.gain.setValueAtTime(0.0001, t);
  bg.gain.exponentialRampToValueAtTime(0.5, t + 0.5);
  bg.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);
  src.connect(bp).connect(bg).connect(master);
  src.start(t); src.stop(t + 2.6);
  live.push(src);

  // 2) Arpej — desen kendini çizerken yükselir (Hicaz)
  const HICAZ = [293.66, 311.13, 369.99, 392.00]; // D4 Eb4 F#4 G4
  HICAZ.forEach((f, i) => note(c, master, f, t + 0.55 + i * 0.42, 1.5, 0.15));

  // 3) Tını — desen açılır, oda görünür
  chime(c, master, 440.00, t + 2.5, 3.6);   // A4
  chime(c, master, 587.33, t + 2.72, 3.0);  // D5
}

/** Sahne yarıda kesilirse sesi sustur. */
export function stopGate() {
  live.forEach(n => { try { n.stop(); } catch { /* zaten durmuş */ } });
  live.length = 0;
}

const donusAudio = { playGate, stopGate, isGateSoundOn, setGateSound };
export default donusAudio;
