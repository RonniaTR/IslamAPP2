// 🎬 ODA — iki kişilik, uçtan uca (P2P) ekran paylaşımı ve birlikte izleme.
//
// Görüntü ve ses DOĞRUDAN iki tarayıcı arasında akar (WebRTC); sunucudan geçmez, kaydedilmez.
// Firebase yalnız "tanışma" için kullanılır: teklif/cevap ve ağ adayları (odalar/{id}).
// Sohbet ve kalpler veri kanalından gider, hiçbir yere yazılmaz.
//
// Kasmaması için:
//   · Ekran paylaşımında içerik ipucu "motion" (film), en çok 30 kare/sn ve 3 Mbps tavan; bağlantı zayıfsa
//     tarayıcı netliği düşürür, kareyi korur.
//   · "Birlikte izle" kipinde film hiç yayınlanmaz: ikiniz de aynı dosyayı kendi cihazında açar, yalnız
//     oynat/durdur/sar komutları gider (birkaç bayt). En akıcı yol budur.
// Taşıyıcılar (transceiver) baştan kurulur: ekran görüntüsü, ekran sesi, mikrofon. Sonradan yalnız
// replaceTrack yapılır; yeniden pazarlık (renegotiation) gerekmez.
import { auth, db } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const ICE = (() => {
  const list = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];
  // Bazı mobil ağlarda doğrudan bağlantı kurulamaz; o zaman bir TURN sunucusu gerekir (.env'de tanımlanır).
  const urls = process.env.REACT_APP_TURN_URLS;
  if (urls) list.push({ urls: urls.split(',').map((u) => u.trim()), username: process.env.REACT_APP_TURN_USER, credential: process.env.REACT_APP_TURN_PASS });
  return list;
})();

export const canShareScreen = () => typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);

export async function me() {
  if (auth.currentUser) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
}

const rid = () => {
  const a = new Uint8Array(15); crypto.getRandomValues(a);
  return Array.from(a, (b) => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
};

/** Yeni oda. Kişisel içerik (adlar, cümle, şiirler) KODDA değil, odanın kendi belgesinde durur. */
export async function createRoom({ ad, benimAdim, onunAdi, cumle, siirler = [] }) {
  const u = await me();
  const id = rid();
  await setDoc(doc(db, 'odalar', id), {
    ad: ad || 'Düş Bahçesi', sahip: u.uid, uyeler: [u.uid], isimler: { [u.uid]: benimAdim || 'Ben' }, davetli: onunAdi || '',
    cumle: cumle || '', siirler, n: 0, offer: null, answer: null, olusturma: serverTimestamp(),
  });
  return id;
}

export async function joinRoom(id, adim) {
  const u = await me();
  const ref = doc(db, 'odalar', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Oda bulunamadı');
  const d = snap.data();
  if (!d.uyeler.includes(u.uid)) {
    if (d.uyeler.length >= 2) throw new Error('Oda dolu');
    await updateDoc(ref, { uyeler: arrayUnion(u.uid), [`isimler.${u.uid}`]: adim || d.davetli || 'Misafir' });
  }
  return { uid: u.uid, oda: { id, ...d } };
}

/**
 * Bağlantıyı kurar ve yönetir. Odayı kuran "arayan"dır; ikinci kişi gelince teklifi o yazar.
 * Biri sayfayı yenilerse arayan yeni bir teklif (n+1) yazar, karşı taraf yeniden cevaplar.
 * @param {string} id
 * @param {{ onState, onRemote, onMessage, onRoom }} cb
 */
export function connect(id, uid, cb) {
  const ref = doc(db, 'odalar', id);
  let pc = null; let ch = null; let n = -1; let caller = false; let answered = -1;
  let first = true; let lastYenile = null;
  const queued = [];
  const remote = { screen: new MediaStream(), mic: new MediaStream() };
  const unsubs = [];

  const send = (msg) => { if (ch && ch.readyState === 'open') ch.send(JSON.stringify(msg)); };
  const wireChannel = (c) => {
    ch = c;
    c.onopen = () => cb.onState && cb.onState('bagli');
    c.onclose = () => cb.onState && cb.onState('koptu');
    c.onmessage = (e) => { try { cb.onMessage && cb.onMessage(JSON.parse(e.data)); } catch { /* bozuk mesaj */ } };
  };

  function freshPc(round) {
    if (pc) { try { pc.close(); } catch { /* kapalı */ } }
    remote.screen = new MediaStream(); remote.mic = new MediaStream();
    pc = new RTCPeerConnection({ iceServers: ICE, bundlePolicy: 'max-bundle' });
    n = round;
    pc.onicecandidate = (e) => { if (e.candidate) addDoc(collection(db, 'odalar', id, 'aday'), { from: uid, n: round, c: e.candidate.toJSON() }).catch(() => {}); };
    pc.onconnectionstatechange = () => cb.onState && cb.onState(pc.connectionState === 'connected' ? 'bagli' : pc.connectionState === 'failed' ? 'basarisiz' : pc.connectionState === 'disconnected' ? 'koptu' : 'baglaniyor');
    pc.ontrack = (e) => {
      const i = pc.getTransceivers().indexOf(e.transceiver);
      (i === 2 ? remote.mic : remote.screen).addTrack(e.track);
      cb.onRemote && cb.onRemote({ ...remote });
    };
    pc.ondatachannel = (e) => wireChannel(e.channel);
    return pc;
  }

  async function makeOffer(round) {
    const p = freshPc(round);
    p.addTransceiver('video', { direction: 'sendrecv' });
    p.addTransceiver('audio', { direction: 'sendrecv' });
    p.addTransceiver('audio', { direction: 'sendrecv' });
    wireChannel(p.createDataChannel('oda', { ordered: true }));
    const offer = await p.createOffer();
    await p.setLocalDescription(offer);
    await updateDoc(ref, { n: round, offer: { type: offer.type, sdp: offer.sdp }, answer: null });
  }

  async function makeAnswer(round, offer) {
    const p = freshPc(round);
    await p.setRemoteDescription(offer);
    p.getTransceivers().forEach((t) => { t.direction = 'sendrecv'; });
    const ans = await p.createAnswer();
    await p.setLocalDescription(ans);
    answered = round;
    await updateDoc(ref, { answer: { type: ans.type, sdp: ans.sdp, n: round } });
    queued.splice(0).forEach((c) => p.addIceCandidate(c).catch(() => {}));
  }

  unsubs.push(onSnapshot(ref, async (s) => {
    if (!s.exists()) return;
    const d = s.data();
    cb.onRoom && cb.onRoom({ id, ...d });
    caller = d.sahip === uid;
    try {
      if (first) {
        first = false;
        lastYenile = d.yenile || null;
        // Karşı taraf sayfayı yenilemiş: eski teklif zaten cevaplanmış. Arayandan yeni teklif iste.
        if (!caller && d.offer && d.answer && d.answer.n === d.n) { answered = d.n; await updateDoc(ref, { yenile: Date.now() }); return; }
      }
      if (caller && d.yenile && d.yenile !== lastYenile) { lastYenile = d.yenile; await makeOffer(Math.max(n, d.n || 0) + 1); return; }
      if (caller) {
        if (d.uyeler.length === 2 && (n < 0 || (pc && ['failed', 'closed'].includes(pc.connectionState)))) await makeOffer((d.n || 0) + 1);
        if (d.answer && d.answer.n === n && pc && !pc.currentRemoteDescription) {
          await pc.setRemoteDescription(d.answer);
          queued.splice(0).forEach((c) => pc.addIceCandidate(c).catch(() => {}));
        }
      } else if (d.offer && d.n > answered) {
        await makeAnswer(d.n, d.offer);
      }
    } catch (e) { cb.onState && cb.onState('basarisiz'); }
  }));

  unsubs.push(onSnapshot(collection(db, 'odalar', id, 'aday'), (s) => {
    s.docChanges().forEach((ch2) => {
      if (ch2.type !== 'added') return;
      const a = ch2.doc.data();
      if (a.from === uid || a.n !== n || !pc) return;
      const cand = new RTCIceCandidate(a.c);
      if (pc.remoteDescription) pc.addIceCandidate(cand).catch(() => {}); else queued.push(cand);
    });
  }));

  // ── yerel yayınlar ──
  const sender = (i) => pc && pc.getTransceivers()[i] && pc.getTransceivers()[i].sender;
  let screen = null; let mic = null;

  async function startScreen() {
    screen = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: { ideal: 30, max: 30 } }, audio: true });
    const [v] = screen.getVideoTracks(); const [a] = screen.getAudioTracks();
    if (v) { v.contentHint = 'motion'; v.onended = () => stopScreen(); }
    const vs = sender(0);
    if (vs) {
      await vs.replaceTrack(v || null);
      try {
        const prm = vs.getParameters(); prm.encodings = prm.encodings && prm.encodings.length ? prm.encodings : [{}];
        prm.encodings[0].maxBitrate = 3000000; prm.encodings[0].maxFramerate = 30; prm.degradationPreference = 'maintain-framerate';
        await vs.setParameters(prm);
      } catch { /* tarayıcı desteklemiyor */ }
    }
    if (sender(1)) await sender(1).replaceTrack(a || null);
    send({ t: 'durum', ekran: true, ses: !!a });
    return screen;
  }
  async function stopScreen() {
    if (screen) screen.getTracks().forEach((t) => t.stop());
    screen = null;
    if (sender(0)) await sender(0).replaceTrack(null);
    if (sender(1)) await sender(1).replaceTrack(null);
    send({ t: 'durum', ekran: false });
  }
  async function setMic(on) {
    if (on && !mic) mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    if (mic) mic.getAudioTracks().forEach((t) => { t.enabled = on; });
    if (sender(2)) await sender(2).replaceTrack(on && mic ? mic.getAudioTracks()[0] : null);
    return on;
  }

  return {
    send, startScreen, stopScreen, setMic,
    close() {
      unsubs.forEach((u) => u());
      [screen, mic].forEach((m) => m && m.getTracks().forEach((t) => t.stop()));
      try { if (pc) pc.close(); } catch { /* kapalı */ }
    },
  };
}

/** Oda sahibi: şiir/cümle düzenleme ve odayı boşaltma (ikinci kişiyi çıkarıp yeniden davet etmek için). */
export const saveRoomExtras = (id, patch) => updateDoc(doc(db, 'odalar', id), patch);
export async function resetRoom(id, uid) {
  const ref = doc(db, 'odalar', id); const s = await getDoc(ref);
  const isimler = { [uid]: (s.data().isimler || {})[uid] || 'Ben' };
  await updateDoc(ref, { uyeler: [uid], isimler, offer: null, answer: null });
}
