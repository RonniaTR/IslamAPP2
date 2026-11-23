/**
 * BAHÇE SESİ — "Müslüman Olmak" sekmesinin ses manzarası. Web Audio ile ÜRETİLİR; kayıt/örnek kullanılmaz (telifsiz).
 *
 *   · Dere     — iki bantta süzülmüş gürültü; köpükçükler için rastgele kıpırdayan ses seviyesi
 *   · Rüzgâr   — alçak geçirgen pembe gürültü, yavaş nefes alıp veren seviye
 *   · Kuşlar   — kısa, hızlı perde kaymalı cıvıltılar; sağdan soldan, rastgele aralıklarla
 *   · Dem      — sol-re beşlisinde çok alçak, huşu veren bir zemin
 *   · Kâğıt    — sayfa çevirirken kısa bir hışırtı
 *
 * Tarayıcı, kullanıcı dokunmadan ses başlatmaz; sekmeye dokunarak gelindiği için genelde izin vardır.
 * Kullanıcı "giriş sesleri"ni kapattıysa (donus_gate_sound = 0) bahçe sesi de varsayılan olarak kapalıdır.
 */
import { isGateSoundOn } from './donusAudio';

const PREF = 'mo_bahce_sesi';
let ctx = null;
let sahne = null; // { master, durdur }

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function bahceAcikMi() {
  try {
    const v = localStorage.getItem(PREF);
    if (v === null) return isGateSoundOn();
    return v === '1';
  } catch { return true; }
}

export function bahceTercih(on) {
  try { localStorage.setItem(PREF, on ? '1' : '0'); } catch { /* kota */ }
}

function gurultu(c, saniye, pembe = false) {
  const len = Math.floor(c.sampleRate * saniye);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch += 1) {
    const d = buf.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i += 1) {
      const w = Math.random() * 2 - 1;
      if (pembe) {
        b0 = 0.99765 * b0 + w * 0.099046;
        b1 = 0.963 * b1 + w * 0.2965164;
        b2 = 0.57 * b2 + w * 1.0526913;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11;
      } else d[i] = w * 0.5;
    }
  }
  return buf;
}

function dongu(c, buf) {
  const s = c.createBufferSource();
  s.buffer = buf; s.loop = true;
  return s;
}

/** Bir kuş: 2–6 hızlı cıvıltı. */
function kus(c, hedef, at) {
  const pan = c.createStereoPanner ? c.createStereoPanner() : null;
  const g = c.createGain();
  g.gain.value = 0;
  if (pan) { pan.pan.value = Math.random() * 1.6 - 0.8; g.connect(pan).connect(hedef); } else g.connect(hedef);
  const tur = Math.random();
  const taban = 2600 + Math.random() * 2200;
  const adet = 2 + Math.floor(Math.random() * 5);
  let t = at;
  for (let i = 0; i < adet; i += 1) {
    const o = c.createOscillator();
    const og = c.createGain();
    o.type = 'sine';
    const sure = 0.05 + Math.random() * 0.09;
    const f0 = taban * (tur < 0.5 ? 1 : 1.25);
    const f1 = taban * (tur < 0.5 ? 1.35 + Math.random() * 0.2 : 0.8);
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + sure);
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.05 + Math.random() * 0.03, t + 0.012);
    og.gain.exponentialRampToValueAtTime(0.0001, t + sure);
    o.connect(og).connect(g);
    o.start(t); o.stop(t + sure + 0.02);
    t += sure + 0.03 + Math.random() * 0.08;
  }
  g.gain.setValueAtTime(1, at);
}

/**
 * Ses manzarasını başlatır (zaten çalıyorsa seviyesini ayarlar).
 * @param {number} seviye 0..1
 */
export function bahceBaslat(seviye = 1) {
  if (!bahceAcikMi()) return false;
  const c = getCtx();
  if (!c) return false;
  if (sahne) { bahceSeviye(seviye); return true; }

  const master = c.createGain();
  master.gain.value = 0.0001;
  master.connect(c.destination);
  master.gain.setTargetAtTime(0.9 * seviye, c.currentTime, 1.4);
  const kaynaklar = [];

  // Dere
  const dereBuf = gurultu(c, 4);
  const dere = dongu(c, dereBuf);
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.7;
  const dereG = c.createGain(); dereG.gain.value = 0.05;
  dere.connect(bp).connect(dereG).connect(master);
  const kopuk = dongu(c, dereBuf);
  const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3800;
  const kopukG = c.createGain(); kopukG.gain.value = 0.012;
  kopuk.connect(hp).connect(kopukG).connect(master);
  dere.start(); kopuk.start(c.currentTime + 0.37);
  kaynaklar.push(dere, kopuk);
  const kipir = setInterval(() => {
    const t = c.currentTime;
    kopukG.gain.setTargetAtTime(0.006 + Math.random() * 0.02, t, 0.05);
    bp.frequency.setTargetAtTime(1100 + Math.random() * 900, t, 0.2);
  }, 140);

  // Rüzgâr
  const ruzgar = dongu(c, gurultu(c, 5, true));
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
  const ruzG = c.createGain(); ruzG.gain.value = 0.25;
  const lfo = c.createOscillator(); lfo.frequency.value = 0.07;
  const lfoG = c.createGain(); lfoG.gain.value = 0.16;
  lfo.connect(lfoG).connect(ruzG.gain);
  ruzgar.connect(lp).connect(ruzG).connect(master);
  ruzgar.start(); lfo.start();
  kaynaklar.push(ruzgar, lfo);

  // Dem (huşu zemini): Sol2 + Re3 + Sol3, çok alçak
  const demG = c.createGain(); demG.gain.value = 0.0001;
  demG.gain.setTargetAtTime(0.022, c.currentTime + 1, 3);
  const demLp = c.createBiquadFilter(); demLp.type = 'lowpass'; demLp.frequency.value = 900;
  demLp.connect(demG).connect(master);
  [98, 146.83, 196].forEach((f, i) => {
    const o = c.createOscillator(); o.type = i === 1 ? 'triangle' : 'sine'; o.frequency.value = f;
    const t = c.createOscillator(); t.frequency.value = 0.11 + i * 0.05;
    const tg = c.createGain(); tg.gain.value = f * 0.0025;
    t.connect(tg).connect(o.frequency);
    o.connect(demLp); o.start(); t.start();
    kaynaklar.push(o, t);
  });

  // Kuşlar
  const kusBus = c.createGain(); kusBus.gain.value = 0.9; kusBus.connect(master);
  let kusZaman = null;
  const kusPlanla = () => {
    kus(c, kusBus, c.currentTime + 0.05);
    if (Math.random() < 0.3) kus(c, kusBus, c.currentTime + 0.4 + Math.random() * 0.5); // cevap veren kuş
    kusZaman = setTimeout(kusPlanla, 1400 + Math.random() * 3800);
  };
  kusZaman = setTimeout(kusPlanla, 900);

  sahne = {
    master,
    durdur(yavas = 1.2) {
      clearInterval(kipir); clearTimeout(kusZaman);
      const t = c.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setTargetAtTime(0.0001, t, yavas / 3);
      kaynaklar.forEach((k) => { try { k.stop(t + yavas + 0.4); } catch { /* durmuş */ } });
      setTimeout(() => { try { master.disconnect(); } catch { /* */ } }, (yavas + 0.6) * 1000);
    },
  };
  return true;
}

export function bahceSeviye(seviye) {
  if (!sahne || !ctx) return;
  sahne.master.gain.setTargetAtTime(Math.max(0.0001, 0.9 * seviye), ctx.currentTime, 0.8);
}

export function bahceDurdur(yavas = 1.2) {
  if (!sahne) return;
  sahne.durdur(yavas);
  sahne = null;
}

export function bahceCaliyor() { return !!sahne; }

/** Sayfa çevirme hışırtısı. hizli=true → kısa ve hafif (çok sayfa çevrilirken). */
export function kagitHisirti(hizli = false) {
  if (!bahceAcikMi()) return;
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime + 0.01;
  const sure = hizli ? 0.16 : 0.42;
  const src = c.createBufferSource();
  src.buffer = gurultu(c, sure + 0.05);
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9;
  bp.frequency.setValueAtTime(hizli ? 3200 : 2200, t);
  bp.frequency.exponentialRampToValueAtTime(hizli ? 5200 : 4800, t + sure);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(hizli ? 0.05 : 0.09, t + sure * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t); src.stop(t + sure + 0.05);
}

/** Kapı açılırken: yumuşak bir çan ve yükselen ışık tınısı. */
export function nurTinisi() {
  if (!bahceAcikMi()) return;
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime + 0.05;
  const g = c.createGain(); g.gain.value = 0.0001; g.connect(c.destination);
  g.gain.exponentialRampToValueAtTime(0.11, t + 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 5.5);
  [392, 587.33, 783.99, 1174.66].forEach((f, i) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    const og = c.createGain(); og.gain.value = 0.0001;
    og.gain.setValueAtTime(0.0001, t + i * 0.35);
    og.gain.exponentialRampToValueAtTime(0.25 / (i + 1), t + i * 0.35 + 0.08);
    og.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.35 + 3.6);
    o.connect(og).connect(g); o.start(t + i * 0.35); o.stop(t + i * 0.35 + 3.8);
  });
}
