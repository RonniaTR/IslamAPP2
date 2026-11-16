// 🔊 SES MOTORU — uygulamadaki bütün seslerin tek kapısı.
//
//   import sound from '../services/sound';
//   sound.play('vakit', 'Fajr')      sound.play('dogru')      const h = sound.hold('kapi')
//
// NEDEN: ney/kapı (donusAudio), oyun sesleri (sfx) ve ortam sesi (ambient) ayrı ayrı çağrılıyordu; her birinin
// ayrı sessize alma anahtarı vardı. Artık yeni bir ses = aşağıdaki tabloya BİR satır; sayfalar dosya adı bilmez.
// Ana anahtar (`sound.setMuted`) hepsini susturur; kimseye zorla ses dinletilmez.
//
// GERÇEK NEY KAYDI: public/audio/ney/<makam>.mp3 dosyası konursa (izinli kayıt; kaynağı data/sources.json'a
// yazılır) 'vakit' ve 'ney' sesleri onu çalar. Dosya yoksa cihazda üretilen ney çalar — bugünkü durum budur.
import { playGate, playVakit, playNey, startHold, stopGate, VAKIT_MAKAM } from '../donusAudio';
import sfx from '../sfx';
import * as ambient from '../ambient';

const KEY = 'sound_muted';
export const isMuted = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
export function setMuted(on) {
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* kota */ }
  if (on) { stopGate(); try { ambient.stop(); } catch { /* çalmıyordu */ } }
}

const recorded = new Map();      // makam → HTMLAudioElement | null (null: kayıt yok)
function tryRecorded(makam) {
  if (recorded.get(makam) === null || typeof Audio === 'undefined') return false;
  let el = recorded.get(makam);
  if (!el) {
    el = new Audio(`${process.env.PUBLIC_URL || ''}/audio/ney/${makam}.mp3`);
    el.addEventListener('error', () => recorded.set(makam, null));
    recorded.set(makam, el);
    return false;                // ilk çağrıda yüklenir; bu sefer sentez çalar
  }
  if (el.readyState < 3) return false;
  el.currentTime = 0;
  el.play().catch(() => {});
  return true;
}

const TABLE = {
  kapi: (phaseId) => playGate(phaseId),                                   // Dönüş Odası eşiği
  vakit: (key) => { if (!tryRecorded(VAKIT_MAKAM[key] || 'rast')) playVakit(key); },
  ney: (makam, opts) => { if (!tryRecorded(makam)) playNey(makam, { dem: true, ...(opts || {}) }); },
  dogru: () => sfx.correct(),
  yanlis: () => sfx.wrong(),
  seri: (n) => sfx.combo(n),
  bitis: () => sfx.victory(),
  seviye: () => sfx.levelUp(),
  odul: () => sfx.claim(),
};

/** Adıyla ses çalar. Bilinmeyen ad ya da sessiz mod sessizce geçilir; ses hatası uygulamayı durdurmaz. */
export function play(name, ...args) {
  if (isMuted() || !TABLE[name]) return;
  try { TABLE[name](...args); } catch { /* ses yok */ }
}

/** Basılı tutmalı sesler (huşu ile açış). Dönen nesne: { progress(p), cancel(), complete() } */
export function hold(name, ...args) {
  const noop = { progress() {}, cancel() {}, complete() {} };
  if (isMuted() || name !== 'kapi') return noop;
  try { return startHold(...args); } catch { return noop; }
}

export const stop = () => stopGate();
export const names = () => Object.keys(TABLE);

const sound = { play, hold, stop, names, isMuted, setMuted, ambient };
export default sound;
