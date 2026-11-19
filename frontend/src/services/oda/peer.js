// 🎬 ODA BAĞLANTISI (PeerJS) — Firebase ayarı GEREKMEZ.
//
// Neden PeerJS: önceki sürüm Firebase'de "Anonim giriş" ve oda kurallarının açılmasına bağlıydı; biri eksikse oda
// hiç kurulmuyordu. PeerJS kendi tanışma sunucusunu ve kendi TURN sunucularını getirir: telefon, tablet ve PC
// farklı ağlarda olsa da bağlanır. Görüntü/ses ikiniz arasında doğrudan akar; gerekirse TURN aktarır, kaydetmez.
//
// Roller: odayı kuran EV SAHİBİ (sabit kimlik: oda kodundan), bağlantıyla gelen MİSAFİR.
// Medya: bağlantı kurulurken üç yer tutucu iz gönderilir (görüntü, içerik sesi, mikrofon). Sonra yalnız
// replaceTrack yapılır; yeniden pazarlık yok, hiçbir tarayıcıda takılma yok. İzlerin hangisinin ne olduğu
// veri kanalıyla bildirilir (mid eşlemesi), tarayıcıların iz sırası farkı sorun olmaz.
import Peer from 'peerjs';

const PREFIX = 'dusbahcesi-v1-';
export const hostId = (code) => `${PREFIX}${code}`;

const ICE = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
  { urls: ['turn:eu-0.turn.peerjs.com:3478', 'turn:us-0.turn.peerjs.com:3478'], username: 'peerjs', credential: 'peerjsp' },
];
if (process.env.REACT_APP_TURN_URLS) ICE.push({ urls: process.env.REACT_APP_TURN_URLS.split(',').map((u) => u.trim()), username: process.env.REACT_APP_TURN_USER, credential: process.env.REACT_APP_TURN_PASS });

function peerOptions() {
  const o = { debug: 1, config: { iceServers: ICE } };
  // Kendi PeerJS sunucun olursa: REACT_APP_PEER_HOST (+ _PORT, _PATH)
  if (process.env.REACT_APP_PEER_HOST) Object.assign(o, { host: process.env.REACT_APP_PEER_HOST, port: Number(process.env.REACT_APP_PEER_PORT || 443), path: process.env.REACT_APP_PEER_PATH || '/', secure: process.env.REACT_APP_PEER_SECURE !== 'false' });
  return o;
}

export const canShareScreen = () => typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
export const canStreamFile = () => typeof HTMLMediaElement !== 'undefined' && !!(HTMLMediaElement.prototype.captureStream || HTMLMediaElement.prototype.mozCaptureStream);

export function newCode() {
  const a = new Uint8Array(10); crypto.getRandomValues(a);
  return Array.from(a, (b) => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
}

/** Sessiz/siyah yer tutucu izler. */
function placeholders() {
  const c = document.createElement('canvas'); c.width = 640; c.height = 360;
  const g = c.getContext('2d'); g.fillStyle = '#05040C'; g.fillRect(0, 0, 640, 360);
  const v = c.captureStream(2).getVideoTracks()[0];
  // Durağan tuval kare üretmez; karşı tarafta son yayın karesi donup kalmasın diye saniyede bir boyanır.
  const tick = setInterval(() => { g.fillStyle = '#05040C'; g.fillRect(0, 0, 640, 360); }, 1000);
  const AC = window.AudioContext || window.webkitAudioContext;
  const ac = new AC();
  const a1 = ac.createMediaStreamDestination().stream.getAudioTracks()[0];
  const a2 = ac.createMediaStreamDestination().stream.getAudioTracks()[0];
  return { v, a1, a2, ac, tick, stream: new MediaStream([v, a1, a2]) };
}

/**
 * @param {{ role:'host'|'guest', code:string, name:string, room?:object,
 *   onState:(s:string)=>void, onMessage:(m:object)=>void, onRemote:(r:{stage:MediaStream,mic:MediaStream})=>void }} o
 * Durumlar: hazirlaniyor · bekliyor (ev sahibi hazır, misafir yok) · evsahibiyok (misafir: ev sahibi çevrim dışı)
 *           baglaniyor · bagli · koptu · hata:<kod>
 */
export function startSession(o) {
  let peer = null; let conn = null; let call = null; let closed = false; let retry = null;
  let senders = {}; let mids = null; let remoteStream = null;
  const ph = placeholders();
  const state = (s) => { if (!closed) o.onState(s); };

  const send = (m) => { if (conn && conn.open) conn.send(m); };

  function mapRemote() {
    const pc = call && call.peerConnection;
    if (!pc || !remoteStream || !mids) return;
    const byMid = (mid) => { const t = pc.getTransceivers().find((x) => x.mid === mid); return t && t.receiver.track; };
    const video = remoteStream.getVideoTracks()[0];
    const content = byMid(mids.content); const mic = byMid(mids.mic);
    o.onRemote({ stage: new MediaStream([video, content].filter(Boolean)), mic: new MediaStream([mic].filter(Boolean)) });
  }

  const sendMids = () => {
    const pc = call && call.peerConnection;
    if (!pc || !senders.content) return;
    const mid = (sd) => { const t = pc.getTransceivers().find((x) => x.sender === sd); return t && t.mid; };
    send({ t: 'mids', content: mid(senders.content), mic: mid(senders.mic) });
  };

  function wireCall(c) {
    if (call && call !== c) { const old = call; call = null; try { old.close(); } catch { /* kapalı */ } }
    call = c; senders = {}; mids = null;
    c.on('stream', (s) => {
      remoteStream = s;
      const pc = c.peerConnection;
      pc.getSenders().forEach((sd) => { if (sd.track === ph.v) senders.video = sd; if (sd.track === ph.a1) senders.content = sd; if (sd.track === ph.a2) senders.mic = sd; });
      sendMids();
      mapRemote();
      state('bagli');
    });
    c.on('close', () => { if (c === call) state(o.role === 'host' ? 'bekliyor' : 'koptu'); });
    c.on('error', () => { if (c === call) state('koptu'); });
  }

  function wireConn(c) {
    if (conn && conn !== c) { try { conn.close(); } catch { /* kapalı */ } }
    conn = c;
    c.on('open', () => {
      send({ t: 'hello', name: o.name, room: o.role === 'host' ? o.room : undefined });
      if (o.role === 'guest') wireCall(peer.call(hostId(o.code), ph.stream));
    });
    c.on('data', (m) => {
      if (!m || typeof m !== 'object') return;
      if (m.t === 'mids') { mids = m; mapRemote(); return; }
      if (m.t === 'hello') sendMids();
      o.onMessage(m);
    });
    c.on('close', () => {
      if (c !== conn) return;
      state(o.role === 'host' ? 'bekliyor' : 'koptu');
      if (o.role === 'guest' && !closed) scheduleGuest(3000);
    });
  }

  function scheduleGuest(ms) {
    clearTimeout(retry);
    retry = setTimeout(() => { if (!closed && peer && !peer.destroyed && !(conn && conn.open)) wireConn(peer.connect(hostId(o.code), { reliable: true })); }, ms);
  }

  function open() {
    state('hazirlaniyor');
    peer = o.role === 'host' ? new Peer(hostId(o.code), peerOptions()) : new Peer(peerOptions());
    peer.on('open', () => {
      if (o.role === 'host') state('bekliyor');
      else { state('baglaniyor'); wireConn(peer.connect(hostId(o.code), { reliable: true })); }
    });
    peer.on('connection', (c) => { if (o.role === 'host') wireConn(c); });
    peer.on('call', (c) => { if (o.role === 'host') { c.answer(ph.stream); wireCall(c); } });
    peer.on('disconnected', () => { if (!closed && !peer.destroyed) setTimeout(() => { try { peer.reconnect(); } catch { /* yeniden */ } }, 1500); });
    peer.on('error', (e) => {
      const t = e && e.type;
      if (t === 'peer-unavailable') { state('evsahibiyok'); scheduleGuest(4000); return; }
      if (t === 'unavailable-id') { state('hata:acik'); clearTimeout(retry); retry = setTimeout(() => { if (!closed) { peer.destroy(); open(); } }, 5000); return; }
      if (t === 'browser-incompatible') { state('hata:tarayici'); return; }
      if (['network', 'server-error', 'socket-error', 'socket-closed'].includes(t)) { state('hata:ag'); clearTimeout(retry); retry = setTimeout(() => { if (!closed) { peer.destroy(); open(); } }, 4000); return; }
      state(`hata:${t || 'bilinmiyor'}`);
    });
  }
  open();

  // ── yayın kaynakları ──
  let screen = null; let micStream = null; let fileStream = null;
  const tune = async (sender, bps) => {
    try {
      const p = sender.getParameters(); p.encodings = p.encodings && p.encodings.length ? p.encodings : [{}];
      p.encodings[0].maxBitrate = bps; p.encodings[0].maxFramerate = 30; p.degradationPreference = 'maintain-framerate';
      await sender.setParameters(p);
    } catch { /* desteklenmiyor */ }
  };
  async function setContent(stream, bps = 3500000) {
    const v = stream ? stream.getVideoTracks()[0] : null; const a = stream ? stream.getAudioTracks()[0] : null;
    if (v) v.contentHint = 'motion';
    if (senders.video) { await senders.video.replaceTrack(v || ph.v); if (v) await tune(senders.video, bps); }
    if (senders.content) await senders.content.replaceTrack(a || ph.a1);
  }

  return {
    send,
    isConnected: () => !!(conn && conn.open && senders.video),
    async shareScreen() {
      screen = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: { ideal: 30, max: 30 } }, audio: true });
      await setContent(screen, 3000000);
      return screen;
    },
    async stopScreen() { if (screen) screen.getTracks().forEach((t) => t.stop()); screen = null; await setContent(null); },
    /** Bir <video> öğesini (yerel dosya) karşıya yayınlar. */
    async streamVideo(el) {
      fileStream = el.captureStream ? el.captureStream() : el.mozCaptureStream();
      const apply = () => setContent(fileStream, 4000000);
      fileStream.onaddtrack = apply;
      await apply();
    },
    async stopVideo() { fileStream = null; await setContent(null); },
    async setMic(on) {
      if (on && !micStream) micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      if (senders.mic) await senders.mic.replaceTrack(on && micStream ? micStream.getAudioTracks()[0] : ph.a2);
      return on;
    },
    close() {
      closed = true; clearTimeout(retry);
      [screen, micStream].forEach((m) => m && m.getTracks().forEach((t) => t.stop()));
      try { if (call) call.close(); } catch { /* kapalı */ }
      try { if (peer) peer.destroy(); } catch { /* kapalı */ }
      try { ph.ac.close(); } catch { /* kapalı */ }
      clearInterval(ph.tick);
    },
  };
}

// ── yerel oda kayıtları (ev sahibinin cihazında) ──
const KEY = 'dusbahcesi_odalar';
export const loadRooms = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
export function saveRoom(code, room) { const all = loadRooms(); all[code] = { ...all[code], ...room }; try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* kota */ } return all[code]; }
export const myName = () => { try { return localStorage.getItem('dusbahcesi_adim') || ''; } catch { return ''; } };
export const setMyName = (n) => { try { localStorage.setItem('dusbahcesi_adim', n); } catch { /* kota */ } };
