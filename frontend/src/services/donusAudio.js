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
 * Ses: gövde (üçgen + az testere) + üst oktav (ney üflenince oktav verir) + nefes gürültüsü.
 * Süsleme: tek sıradaki notalara kısa "çarpma" (üst komşu perdeden düşüş); son nota uzun tutulur.
 * @param {string} makam   MAKAMS anahtarı
 * @param {object} o       { dest, at, noteDur, gain, dem }  dem: karar perdesinde alttan tutulan ses
 * @returns {number} toplam süre (sn)
 */
export function playNey(makam = 'hicaz', o = {}) {
  const c = getCtx();
  if (!c) return 0;
  const scale = MAKAMS[makam] || MAKAMS.hicaz;
  const line = (SEYIR[makam] || SEYIR.hicaz).map((i) => cents(scale[i]));
  const nd = o.noteDur || 0.62;
  const durs = line.map((_, i) => nd * (i === line.length - 1 ? 1.9 : i % 3 === 2 ? 1.3 : 1));
  const span = durs.reduce((a, b) => a + b, 0);
  const t0 = o.at || c.currentTime + 0.05;
  const total = span + 1.4;
  const dest = o.dest || c.destination;
  const peak = o.gain || 0.16;

  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; lp.Q.value = 0.6;
  const body = c.createGain(); body.gain.value = 0.0001;
  const tri = c.createOscillator(); tri.type = 'triangle';
  const saw = c.createOscillator(); saw.type = 'sawtooth';
  const oct = c.createOscillator(); oct.type = 'sine';
  const sawG = c.createGain(); sawG.gain.value = 0.12;
  const octG = c.createGain(); octG.gain.value = 0.2;
  tri.connect(lp); saw.connect(sawG).connect(lp); oct.connect(octG).connect(lp); lp.connect(body).connect(dest);

  // vibrato: ~5 Hz, derinliği nota oturdukça açılır
  const lfo = c.createOscillator(); lfo.frequency.value = 5;
  const lfoG = c.createGain(); lfoG.gain.value = 0;
  const lfoG2 = c.createGain(); lfoG2.gain.value = 0;
  lfo.connect(lfoG); lfoG.connect(tri.frequency); lfoG.connect(saw.frequency);
  lfo.connect(lfoG2); lfoG2.connect(oct.frequency);

  // nefes
  const noise = c.createBufferSource(); noise.buffer = breathBuffer(c, total);
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.5;
  const nG = c.createGain(); nG.gain.value = 0.0001;
  noise.connect(bp).connect(nG).connect(dest);

  let t = t0;
  let prev = line[0] * 0.985;
  line.forEach((f, i) => {
    const d = durs[i];
    // her parametre nota başında sabitlenir; yoksa kayma bütün notaya yayılır
    [[tri.frequency, 1], [saw.frequency, 1], [oct.frequency, 2], [bp.frequency, 2]].forEach(([p, m]) => {
      p.setValueAtTime(prev * m, t);
      if (i % 2 === 1) {
        p.exponentialRampToValueAtTime(f * m * 1.059, t + 0.045);   // çarpma
        p.exponentialRampToValueAtTime(f * m, t + 0.11);
      } else {
        p.exponentialRampToValueAtTime(f * m, t + 0.075);
      }
    });
    body.gain.setValueAtTime(Math.max(0.0001, peak * 0.45), t);
    body.gain.linearRampToValueAtTime(peak, t + d * 0.55);
    body.gain.linearRampToValueAtTime(peak * 0.6, t + d * 0.97);
    nG.gain.setValueAtTime(peak * 1.6, t);
    nG.gain.exponentialRampToValueAtTime(peak * 0.5, t + d * 0.5);
    lfoG.gain.setValueAtTime(0, t);
    lfoG.gain.linearRampToValueAtTime(f * 0.0087, t + d * 0.8);
    lfoG2.gain.setValueAtTime(0, t);
    lfoG2.gain.linearRampToValueAtTime(f * 0.0174, t + d * 0.8);
    prev = f; t += d;
  });
  const end = t0 + span;
  body.gain.setValueAtTime(peak * 0.6, end);
  body.gain.exponentialRampToValueAtTime(0.0001, end + 1.3);
  nG.gain.setValueAtTime(peak * 0.5, end);
  nG.gain.exponentialRampToValueAtTime(0.0001, end + 1.0);

  const nodes = [tri, saw, oct, lfo, noise];
  if (o.dem) {
    // dem: karar perdesinin bir oktav altı, çok kısık; taksimin altında zemin
    const dem = c.createOscillator(); dem.type = 'triangle'; dem.frequency.value = KARAR / 2;
    const dLp = c.createBiquadFilter(); dLp.type = 'lowpass'; dLp.frequency.value = 700;
    const dG = c.createGain(); dG.gain.setValueAtTime(0.0001, t0);
    dG.gain.exponentialRampToValueAtTime(peak * 0.38, t0 + 1.2);
    dG.gain.setValueAtTime(peak * 0.38, end);
    dG.gain.exponentialRampToValueAtTime(0.0001, end + 1.35);
    dem.connect(dLp).connect(dG).connect(dest);
    nodes.push(dem);
  }
  nodes.forEach((n) => { n.start(t0); n.stop(end + 1.4); live.push(n); });
  return total;
}

// ── MEKÂN: kubbe yankısı. Dürtü yanıtı cihazda üretilir (sönen gürültü; tizler önce söner) — kayıt yok.
let _ir = null;
function domeIR(c, seconds = 3.2) {
  if (_ir && _ir.sampleRate === c.sampleRate) return _ir;
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let s = 0;
    for (let i = 0; i < len; i++) {
      const x = i / len;
      const w = (Math.random() * 2 - 1) * Math.pow(1 - x, 2.6);
      s += (w - s) * (0.55 - 0.4 * x);
      d[i] = s;
    }
  }
  _ir = buf;
  return buf;
}

function wetBus(c) {
  const master = c.createGain(); master.gain.value = 0.6;
  master.connect(c.destination);
  try {
    const pre = c.createDelay(0.2); pre.delayTime.value = 0.03;
    const conv = c.createConvolver(); conv.buffer = domeIR(c);
    const wet = c.createGain(); wet.gain.value = 0.55;
    master.connect(pre).connect(conv).connect(wet).connect(c.destination);
  } catch { /* yankı kurulamazsa kuru ses yeter */ }
  return master;
}

// ── KAPI SESİ. Ahşap kapının gıcırtısı sürtünme sesidir: düşük, titrek bir testere dalga iki dar
// süzgeçten geçer; perde sürekli oynar. Sonunda kanatların duvara yaslandığı tok bir vuruş gelir.
function creakVoice(c, dest) {
  const saw = c.createOscillator(); saw.type = 'sawtooth'; saw.frequency.value = 60;
  const f1 = c.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 620; f1.Q.value = 5;
  const f2 = c.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 1750; f2.Q.value = 7;
  const g = c.createGain(); g.gain.value = 0.0001;
  saw.connect(f1).connect(g); saw.connect(f2).connect(g);
  const noise = c.createBufferSource(); noise.buffer = breathBuffer(c, 3); noise.loop = true;
  const nf = c.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 2600; nf.Q.value = 2;
  const ng = c.createGain(); ng.gain.value = 0.3;
  noise.connect(nf).connect(ng).connect(g);
  g.connect(dest);
  saw.start(); noise.start(); live.push(saw, noise);
  return { saw, noise, g };
}

function thud(c, dest, at) {
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(86, at); o.frequency.exponentialRampToValueAtTime(36, at + 0.5);
  const g = c.createGain(); g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(0.4, at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.75);
  o.connect(g).connect(dest); o.start(at); o.stop(at + 0.8); live.push(o);
}

/** Kendiliğinden açılan kapı (dokunuşla giriş): ortada hızlanan gıcırtı + vuruş. */
function playDoor(c, dest, at, dur = 2.0) {
  const v = creakVoice(c, dest);
  const steps = Math.floor(dur / 0.05);
  v.g.gain.setValueAtTime(0.0001, at);
  for (let i = 0; i <= steps; i++) {
    const speed = Math.sin(Math.PI * (i / steps));
    const t = at + i * 0.05;
    v.saw.frequency.setValueAtTime((48 + 70 * speed) * (0.8 + Math.random() * 0.4), t);
    v.g.gain.linearRampToValueAtTime(0.0001 + 0.055 * speed * (0.5 + Math.random() * 0.5), t);
  }
  v.g.gain.linearRampToValueAtTime(0.0001, at + dur + 0.1);
  v.saw.stop(at + dur + 0.2); v.noise.stop(at + dur + 0.2);
  thud(c, dest, at + dur * 0.96);
}

/**
 * Eşik sahnesinin sesi: kapı gıcırtısı → evrenin makamında demli ney taksimi → iki tını.
 * @param {string} phaseId  Dönüş evresi (kapi · temel · bag · ahlak · kok)
 * @param {object} o        { door: false → kapı sesi çalınmaz (huşu ile açışta kapı zaten elle açıldı) }
 */
export function playGate(phaseId = 'kapi', o = {}) {
  if (!isGateSoundOn()) return;
  const c = getCtx();
  if (!c) return;
  const master = wetBus(c);
  const t = c.currentTime + 0.05;
  const door = o.door !== false;
  const lead = door ? 1.5 : 0.3;
  if (door) playDoor(c, master, t, 2.0);
  const makam = PHASE_MAKAM[phaseId] || 'hicaz';
  const dur = playNey(makam, { dest: master, at: t + lead, noteDur: 0.5, gain: 0.15, dem: true });
  chime(c, master, cents(702), t + lead + dur - 1.6, 3.4);
  chime(c, master, cents(1200), t + lead + dur - 1.38, 2.8);
}

/**
 * HUŞU İLE AÇIŞ — kişi kapıya parmağını koyup bekler; kapı onun sabrıyla açılır.
 * Basılıyken: alttan dem sesi yükselir, kapı hareket ettikçe gıcırdar. Bırakılırsa ses söner (kapı aralık kalır).
 * @returns {{progress:(p:number)=>void, cancel:()=>void, complete:()=>void}}
 */
export function startHold(phaseId = 'kapi') {
  const noop = { progress() {}, cancel() {}, complete() {} };
  if (!isGateSoundOn()) return noop;
  const c = getCtx();
  if (!c) return noop;
  const bus = wetBus(c);
  const v = creakVoice(c, bus);
  const dem = c.createOscillator(); dem.type = 'triangle'; dem.frequency.value = KARAR / 2;
  const dLp = c.createBiquadFilter(); dLp.type = 'lowpass'; dLp.frequency.value = 700;
  const dG = c.createGain(); dG.gain.value = 0.0001;
  dG.gain.setTargetAtTime(0.085, c.currentTime, 0.7);
  dem.connect(dLp).connect(dG).connect(bus); dem.start(); live.push(dem);
  let last = 0;
  let done = false;
  const jit = setInterval(() => {
    if (!done) v.saw.frequency.setTargetAtTime((50 + 60 * last) * (0.8 + Math.random() * 0.4), c.currentTime, 0.02);
  }, 55);
  const end = (fade) => {
    if (done) return;
    done = true; clearInterval(jit);
    const t = c.currentTime;
    v.g.gain.cancelScheduledValues(t); v.g.gain.setTargetAtTime(0.0001, t, 0.08);
    dG.gain.cancelScheduledValues(t); dG.gain.setTargetAtTime(0.0001, t, fade);
    [v.saw, v.noise, dem].forEach((n) => { try { n.stop(t + fade * 5 + 0.3); } catch { /* durmuş */ } });
  };
  return {
    progress(p) {
      if (done) return;
      const moving = Math.abs(p - last) > 0.0005;
      last = p;
      v.g.gain.setTargetAtTime(moving ? 0.03 + 0.04 * Math.sin(Math.PI * p) : 0.0001, c.currentTime, 0.05);
    },
    cancel() { end(0.25); },
    complete() { end(0.9); thud(c, bus, c.currentTime + 0.02); playGate(phaseId, { door: false }); },
  };
}

/** Vakit tınısı: o vaktin makamında kısa, demli ney cümlesi (8.1 Vakitlerin makamı). */
export function playVakit(prayerKey = 'Dhuhr') {
  const c = getCtx();
  if (!c) return null;
  const makam = VAKIT_MAKAM[prayerKey] || 'rast';
  playNey(makam, { dest: wetBus(c), noteDur: 0.55, gain: 0.15, dem: true });
  return makam;
}

/** Sahne yarıda kesilirse sesi sustur. */
export function stopGate() {
  live.forEach((n) => { try { n.stop(); } catch { /* zaten durmuş */ } });
  live.length = 0;
}

const donusAudio = { playGate, playNey, playVakit, startHold, stopGate, isGateSoundOn, setGateSound, MAKAMS, VAKIT_MAKAM, PHASE_MAKAM, MAKAM_NAMES };
export default donusAudio;
