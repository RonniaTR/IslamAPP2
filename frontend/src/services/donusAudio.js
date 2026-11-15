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

// ─────────────────────────────────────────────────────────────────────────
// NEY SENTEZİ ve MAKAMLAR (docs/YENI_OZELLIKLER.md 7.3 ve 8.1)
// Kayıt yok: tek sesli bir "ney" çizgisi cihazda üretilir → telifsiz.
//   · gövde  : üçgen + az testere dalga → alçak geçiren süzgeç
//   · nefes  : pembe gürültü → nota frekansının ~2 katında bant geçiren süzgeç
//   · vibrato: nota oturduktan sonra yavaşça açılır
//   · geçiş  : notalar arasında kısa kayma (glissando)
// Perdeler karar sesinden SENT olarak verilmiştir; 53 koma sisteminin YAKLAŞIK karşılığıdır.
export const MAKAMS = {
  rast:     [0, 204, 384, 498, 702, 906, 1086, 1200],
  ussak:    [0, 181, 294, 498, 702, 792, 996, 1200],
  hicaz:    [0, 113, 384, 498, 702, 792, 996, 1200],
  nihavend: [0, 204, 294, 498, 702, 792, 1088, 1200],
  saba:     [0, 150, 294, 384, 702, 792, 996, 1200],
  segah:    [0, 113, 317, 498, 589, 815, 1019, 1200],
};

// Seyir: dizi içindeki basamak numaraları (0 = karar). Hepsi karara döner.
const SEYIR = {
  rast:     [0, 2, 4, 3, 2, 1, 0],
  ussak:    [3, 2, 1, 2, 1, 0],
  hicaz:    [0, 1, 2, 3, 2, 1, 0],
  nihavend: [4, 3, 2, 3, 1, 0],
  saba:     [0, 1, 2, 3, 2, 1, 0],
  segah:    [2, 3, 4, 3, 2, 0],
};

// Dönüş Odası evreleri ve namaz vakitleri için makam eşlemesi.
export const PHASE_MAKAM = { kapi: 'hicaz', temel: 'rast', bag: 'ussak', ahlak: 'nihavend', kok: 'rast' };
export const VAKIT_MAKAM = { Fajr: 'saba', Dhuhr: 'rast', Asr: 'hicaz', Maghrib: 'segah', Isha: 'ussak' };
export const MAKAM_NAMES = { rast: 'Rast', ussak: 'Uşşak', hicaz: 'Hicaz', nihavend: 'Nihavend', saba: 'Saba', segah: 'Segâh' };

const KARAR = 293.66; // Re (D4)
const cents = (c) => KARAR * Math.pow(2, c / 1200);

/**
 * Bir makamda kısa ney taksimi çalar.
 * @param {string} makam   MAKAMS anahtarı
 * @param {object} o       { dest, at, noteDur, gain }
 * @returns {number} toplam süre (sn)
 */
export function playNey(makam = 'hicaz', o = {}) {
  const c = getCtx();
  if (!c) return 0;
  const scale = MAKAMS[makam] || MAKAMS.hicaz;
  const line = (SEYIR[makam] || SEYIR.hicaz).map((i) => cents(scale[i]));
  const noteDur = o.noteDur || 0.62;
  const t0 = o.at || c.currentTime + 0.05;
  const total = line.length * noteDur + 1.4;
  const dest = o.dest || c.destination;
  const peak = o.gain || 0.16;

  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; lp.Q.value = 0.6;
  const body = c.createGain(); body.gain.value = 0.0001;
  const tri = c.createOscillator(); tri.type = 'triangle';
  const saw = c.createOscillator(); saw.type = 'sawtooth';
  const sawG = c.createGain(); sawG.gain.value = 0.12;
  tri.connect(lp); saw.connect(sawG).connect(lp); lp.connect(body).connect(dest);

  // vibrato: ~5 Hz, derinliği zamanla açılır
  const lfo = c.createOscillator(); lfo.frequency.value = 5;
  const lfoG = c.createGain(); lfoG.gain.value = 0;
  lfo.connect(lfoG); lfoG.connect(tri.frequency); lfoG.connect(saw.frequency);

  // nefes
  const noise = c.createBufferSource(); noise.buffer = breathBuffer(c, total); 
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.5;
  const nG = c.createGain(); nG.gain.value = 0.0001;
  noise.connect(bp).connect(nG).connect(dest);

  line.forEach((f, i) => {
    const t = t0 + i * noteDur;
    const glide = 0.075;
    if (i === 0) {
      tri.frequency.setValueAtTime(f * 0.985, t); saw.frequency.setValueAtTime(f * 0.985, t);
      bp.frequency.setValueAtTime(f * 2, t);
    }
    tri.frequency.exponentialRampToValueAtTime(f, t + glide);
    saw.frequency.exponentialRampToValueAtTime(f, t + glide);
    bp.frequency.exponentialRampToValueAtTime(f * 2, t + glide);
    // her notada hafif crescendo ve nota sonunda küçük bir nefes boşluğu
    body.gain.setValueAtTime(Math.max(0.0001, peak * 0.45), t);
    body.gain.linearRampToValueAtTime(peak, t + noteDur * 0.55);
    body.gain.linearRampToValueAtTime(peak * 0.6, t + noteDur * 0.97);
    // nefes: nota başında belirgin, sonra geri çekilir
    nG.gain.setValueAtTime(peak * 1.6, t);
    nG.gain.exponentialRampToValueAtTime(peak * 0.5, t + noteDur * 0.5);
    // vibrato nota oturduktan sonra açılır (≈15 sent)
    lfoG.gain.setValueAtTime(0, t);
    lfoG.gain.linearRampToValueAtTime(f * 0.0087, t + noteDur * 0.8);
  });
  const end = t0 + line.length * noteDur;
  body.gain.setValueAtTime(peak * 0.6, end);
  body.gain.exponentialRampToValueAtTime(0.0001, end + 1.3);
  nG.gain.exponentialRampToValueAtTime(0.0001, end + 1.0);

  [tri, saw, lfo, noise].forEach((n) => { n.start(t0); n.stop(end + 1.4); live.push(n); });
  return total;
}

function wetBus(c) {
  const master = c.createGain(); master.gain.value = 0.55;
  const delay = c.createDelay(1.2); delay.delayTime.value = 0.26;
  const fb = c.createGain(); fb.gain.value = 0.32;
  const wet = c.createGain(); wet.gain.value = 0.35;
  delay.connect(fb).connect(delay);
  delay.connect(wet).connect(c.destination);
  master.connect(delay); master.connect(c.destination);
  return master;
}

/**
 * Eşik sahnesinin sesi (~6 sn): nefes → evrenin makamında ney taksimi → iki tını.
 * @param {string} phaseId  Dönüş evresi (kapi · temel · bag · ahlak · kok)
 */
export function playGate(phaseId = 'kapi') {
  if (!isGateSoundOn()) return;
  const c = getCtx();
  if (!c) return;
  const master = wetBus(c);
  const t = c.currentTime + 0.05;
  const makam = PHASE_MAKAM[phaseId] || 'hicaz';
  const dur = playNey(makam, { dest: master, at: t + 0.9, noteDur: 0.5, gain: 0.15 });
  chime(c, master, cents(702), t + 0.9 + dur - 1.6, 3.4);
  chime(c, master, cents(1200), t + 0.9 + dur - 1.38, 2.8);
}

/** Vakit tınısı: o vaktin makamında kısa ney cümlesi (8.1 Vakitlerin makamı). */
export function playVakit(prayerKey = 'Dhuhr') {
  const c = getCtx();
  if (!c) return null;
  const makam = VAKIT_MAKAM[prayerKey] || 'rast';
  playNey(makam, { dest: wetBus(c), noteDur: 0.55, gain: 0.15 });
  return makam;
}

/** Sahne yarıda kesilirse sesi sustur. */
export function stopGate() {
  live.forEach(n => { try { n.stop(); } catch { /* zaten durmuş */ } });
  live.length = 0;
}

const donusAudio = { playGate, playNey, playVakit, stopGate, isGateSoundOn, setGateSound, MAKAMS, VAKIT_MAKAM, PHASE_MAKAM, MAKAM_NAMES };
export default donusAudio;
