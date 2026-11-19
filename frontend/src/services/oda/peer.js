// 🎬 ODA BAĞLANTISI (PeerJS) — Firebase ayarı GEREKMEZ.
//
// Telefon, tablet ve PC (iOS Safari, Android Chrome, Windows/Mac Chrome/Edge/Firefox) için çift katmanlı ses ve görüntü:
// 1) Ana medya çağrısı: sahne görüntüsü (video/ekran) + içerik sesi + mikrofon yedeği.
// 2) Özel ses çağrısı (metadata: { kind: 'mic' }): mobil tarayıcıların (özellikle iOS Safari ve Android) çoklu ses izi
//    kısıtlamasına takılmaması için mikrofon açıldığında doğrudan tek izli net ses akışı da bağlanır.
import Peer from 'peerjs';

const PREFIX = 'dusbahcesi-v1-';
export const hostId = (code) => `${PREFIX}${code}`;

const ICE = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
  { urls: ['turn:eu-0.turn.peerjs.com:3478', 'turn:us-0.turn.peerjs.com:3478'], username: 'peerjs', credential: 'peerjsp' },
];
if (process.env.REACT_APP_TURN_URLS) {
  ICE.push({
    urls: process.env.REACT_APP_TURN_URLS.split(',').map((u) => u.trim()),
    username: process.env.REACT_APP_TURN_USER,
    credential: process.env.REACT_APP_TURN_PASS,
  });
}

function peerOptions() {
  const o = { debug: 1, config: { iceServers: ICE } };
  if (process.env.REACT_APP_PEER_HOST) {
    Object.assign(o, {
      host: process.env.REACT_APP_PEER_HOST,
      port: Number(process.env.REACT_APP_PEER_PORT || 443),
      path: process.env.REACT_APP_PEER_PATH || '/',
      secure: process.env.REACT_APP_PEER_SECURE !== 'false',
    });
  }
  return o;
}

export const canShareScreen = () =>
  typeof navigator !== 'undefined' &&
  !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) &&
  !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export const canStreamFile = () =>
  typeof HTMLMediaElement !== 'undefined' &&
  !!(HTMLMediaElement.prototype.captureStream || HTMLMediaElement.prototype.mozCaptureStream);

export async function listAudioInputs() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return [];
    const devs = await navigator.mediaDevices.enumerateDevices();
    return devs.filter((d) => d.kind === 'audioinput');
  } catch {
    return [];
  }
}

export function newCode() {
  const a = new Uint8Array(10);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
}

/** Sessiz/siyah yer tutucu izler (tüm tarayıcılar için güvenli). */
function placeholders() {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 360;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = '#05040C';
    g.fillRect(0, 0, 640, 360);
  }
  const cap = c.captureStream ? c.captureStream(2) : c.mozCaptureStream ? c.mozCaptureStream(2) : null;
  const v = cap ? cap.getVideoTracks()[0] : null;
  const tick = setInterval(() => {
    if (g) {
      g.fillStyle = '#05040C';
      g.fillRect(0, 0, 640, 360);
    }
  }, 1000);

  let ac = null;
  let a1 = null;
  let a2 = null;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      ac = new AC();
      a1 = ac.createMediaStreamDestination().stream.getAudioTracks()[0];
      a2 = ac.createMediaStreamDestination().stream.getAudioTracks()[0];
    }
  } catch {
    /* AudioContext engellendiyse */
  }
  const tracks = [v, a1, a2].filter(Boolean);
  return { v, a1, a2, ac, tick, stream: new MediaStream(tracks) };
}

/** Ses seviyesi ölçer (konuşurken fener/mikrofon halkasını parlatmak için). */
export function watchVoiceLevel(stream, onLevel) {
  if (!stream || !stream.getAudioTracks || stream.getAudioTracks().length === 0) return () => {};
  let ac = null;
  let raf = null;
  let stopped = false;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return () => {};
    ac = new AC();
    if (ac.state === 'suspended') ac.resume().catch(() => {});
    const src = ac.createMediaStreamSource(stream);
    const analyser = ac.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let last = 0;
    const loop = () => {
      if (stopped) return;
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i += 1) sum += data[i];
      const avg = sum / data.length;
      const lvl = Math.min(1, avg / 42);
      if (Math.abs(lvl - last) > 0.04 || (lvl === 0 && last !== 0)) {
        last = lvl;
        onLevel(lvl);
      }
      raf = setTimeout(loop, 110);
    };
    loop();
  } catch {
    return () => {};
  }
  return () => {
    stopped = true;
    clearTimeout(raf);
    onLevel(0);
    try {
      if (ac) ac.close();
    } catch {
      /* kapalı */
    }
  };
}

export function startSession(o) {
  let peer = null;
  let conn = null;
  let call = null;
  let micCall = null;
  let remotePeerId = o.role === 'guest' ? hostId(o.code) : null;
  let closed = false;
  let retry = null;
  let senders = {};
  let mids = null;
  let remoteStream = null;
  let dedicatedMicStream = null;
  const ph = placeholders();
  const state = (s) => {
    if (!closed) o.onState(s);
  };

  const send = (m) => {
    if (conn && conn.open) conn.send(m);
  };

  function emitRemote() {
    const pc = call && call.peerConnection;
    const byMid = (mid) => {
      if (!pc || !mid) return null;
      const t = pc.getTransceivers().find((x) => x.mid === mid);
      return t && t.receiver && t.receiver.track;
    };
    const video = remoteStream ? remoteStream.getVideoTracks()[0] : null;
    const content = mids ? byMid(mids.content) : remoteStream ? remoteStream.getAudioTracks()[0] : null;
    const fallbackMic = mids ? byMid(mids.mic) : remoteStream ? remoteStream.getAudioTracks()[1] : null;
    const micTracks = dedicatedMicStream && dedicatedMicStream.getAudioTracks().length
      ? dedicatedMicStream.getAudioTracks()
      : [fallbackMic].filter(Boolean);

    o.onRemote({
      stage: new MediaStream([video, content].filter(Boolean)),
      mic: new MediaStream(micTracks),
    });
  }

  const sendMids = () => {
    const pc = call && call.peerConnection;
    if (!pc || !senders.content) return;
    const mid = (sd) => {
      const t = pc.getTransceivers().find((x) => x.sender === sd);
      return t && t.mid;
    };
    send({ t: 'mids', content: mid(senders.content), mic: mid(senders.mic) });
  };

  function wireMicCall(c) {
    if (micCall && micCall !== c) {
      try {
        micCall.close();
      } catch {
        /* kapalı */
      }
    }
    micCall = c;
    c.on('stream', (s) => {
      dedicatedMicStream = s;
      emitRemote();
    });
    c.on('close', () => {
      if (micCall === c) {
        dedicatedMicStream = null;
        emitRemote();
      }
    });
  }

  function wireCall(c) {
    if (c && c.metadata && c.metadata.kind === 'mic') {
      wireMicCall(c);
      return;
    }
    if (call && call !== c) {
      const old = call;
      call = null;
      try {
        old.close();
      } catch {
        /* kapalı */
      }
    }
    call = c;
    senders = {};
    mids = null;
    c.on('stream', (s) => {
      remoteStream = s;
      const pc = c.peerConnection;
      if (pc) {
        pc.getSenders().forEach((sd) => {
          if (ph.v && sd.track === ph.v) senders.video = sd;
          if (ph.a1 && sd.track === ph.a1) senders.content = sd;
          if (ph.a2 && sd.track === ph.a2) senders.mic = sd;
        });
      }
      sendMids();
      emitRemote();
      state('bagli');
    });
    c.on('close', () => {
      if (c === call) state(o.role === 'host' ? 'bekliyor' : 'koptu');
    });
    c.on('error', () => {
      if (c === call) state('koptu');
    });
  }

  let screen = null;
  let micStream = null;
  let fileStream = null;

  function wireConn(c) {
    if (conn && conn !== c) {
      try {
        conn.close();
      } catch {
        /* kapalı */
      }
    }
    conn = c;
    if (c.peer) remotePeerId = c.peer;
    c.on('open', () => {
      send({ t: 'hello', name: o.name, room: o.role === 'host' ? o.room : undefined });
      if (o.role === 'guest') {
        wireCall(peer.call(hostId(o.code), ph.stream, { metadata: { kind: 'stage' } }));
      }
      if (micStream && micStream.getAudioTracks().length && remotePeerId) {
        send({ t: 'mic', on: true });
        try {
          wireMicCall(peer.call(remotePeerId, micStream, { metadata: { kind: 'mic' } }));
        } catch {
          /* yedek */
        }
      }
    });
    c.on('data', (m) => {
      if (!m || typeof m !== 'object') return;
      if (m.t === 'mids') {
        mids = m;
        emitRemote();
        return;
      }
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
    retry = setTimeout(() => {
      if (!closed && peer && !peer.destroyed && !(conn && conn.open)) {
        wireConn(peer.connect(hostId(o.code), { reliable: true }));
      }
    }, ms);
  }

  function open() {
    state('hazirlaniyor');
    peer = o.role === 'host' ? new Peer(hostId(o.code), peerOptions()) : new Peer(peerOptions());
    peer.on('open', () => {
      if (o.role === 'host') state('bekliyor');
      else {
        state('baglaniyor');
        wireConn(peer.connect(hostId(o.code), { reliable: true }));
      }
    });
    peer.on('connection', (c) => {
      if (o.role === 'host') wireConn(c);
    });
    peer.on('call', (c) => {
      if (c.metadata && c.metadata.kind === 'mic') {
        c.answer(micStream || new MediaStream([ph.a2].filter(Boolean)));
        wireMicCall(c);
        return;
      }
      if (o.role === 'host') {
        c.answer(ph.stream);
        wireCall(c);
      }
    });
    peer.on('disconnected', () => {
      if (!closed && !peer.destroyed) {
        setTimeout(() => {
          try {
            peer.reconnect();
          } catch {
            /* yeniden */
          }
        }, 1500);
      }
    });
    peer.on('error', (e) => {
      const t = e && e.type;
      if (t === 'peer-unavailable') {
        state('evsahibiyok');
        scheduleGuest(3500);
        return;
      }
      if (t === 'unavailable-id') {
        state('hata:acik');
        clearTimeout(retry);
        retry = setTimeout(() => {
          if (!closed) {
            peer.destroy();
            open();
          }
        }, 4500);
        return;
      }
      if (t === 'browser-incompatible') {
        state('hata:tarayici');
        return;
      }
      if (['network', 'server-error', 'socket-error', 'socket-closed'].includes(t)) {
        state('hata:ag');
        clearTimeout(retry);
        retry = setTimeout(() => {
          if (!closed) {
            peer.destroy();
            open();
          }
        }, 3500);
        return;
      }
      state(`hata:${t || 'bilinmiyor'}`);
    });
  }
  open();

  const tune = async (sender, bps) => {
    try {
      const p = sender.getParameters();
      p.encodings = p.encodings && p.encodings.length ? p.encodings : [{}];
      p.encodings[0].maxBitrate = bps;
      p.encodings[0].maxFramerate = 30;
      p.degradationPreference = 'maintain-framerate';
      await sender.setParameters(p);
    } catch {
      /* desteklenmiyor */
    }
  };

  async function setContent(stream, bps = 3500000) {
    const v = stream ? stream.getVideoTracks()[0] : null;
    const a = stream ? stream.getAudioTracks()[0] : null;
    if (v) v.contentHint = 'motion';
    if (senders.video) {
      await senders.video.replaceTrack(v || ph.v);
      if (v) await tune(senders.video, bps);
    }
    if (senders.content) await senders.content.replaceTrack(a || ph.a1);
  }

  return {
    send,
    isConnected: () => !!(conn && conn.open),
    getMicStream: () => micStream,
    async shareScreen() {
      screen = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30, max: 30 } },
        audio: true,
      });
      await setContent(screen, 3000000);
      return screen;
    },
    async stopScreen() {
      if (screen) screen.getTracks().forEach((t) => t.stop());
      screen = null;
      await setContent(null);
    },
    async streamVideo(el) {
      fileStream = el.captureStream ? el.captureStream() : el.mozCaptureStream();
      const apply = () => setContent(fileStream, 4000000);
      fileStream.onaddtrack = apply;
      await apply();
    },
    async stopVideo() {
      fileStream = null;
      await setContent(null);
    },
    async setMic(on, deviceId) {
      if (ph.ac && ph.ac.state === 'suspended') ph.ac.resume().catch(() => {});
      if (on) {
        if (micStream && deviceId) {
          micStream.getTracks().forEach((t) => t.stop());
          micStream = null;
        }
        if (!micStream) {
          const audioConstraints = {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
          };
          micStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: false });
        }
        micStream.getAudioTracks().forEach((t) => {
          t.enabled = true;
        });
        if (senders.mic) {
          try {
            await senders.mic.replaceTrack(micStream.getAudioTracks()[0]);
          } catch {
            /* yedek çağrı aşağıda */
          }
        }
        if (peer && !peer.destroyed && remotePeerId) {
          try {
            wireMicCall(peer.call(remotePeerId, micStream, { metadata: { kind: 'mic' } }));
          } catch {
            /* ana iz devrede */
          }
        }
        send({ t: 'mic', on: true });
        return true;
      }
      if (micStream) {
        micStream.getAudioTracks().forEach((t) => {
          t.enabled = false;
          t.stop();
        });
        micStream = null;
      }
      if (senders.mic && ph.a2) {
        try {
          await senders.mic.replaceTrack(ph.a2);
        } catch {
          /* kapalı */
        }
      }
      if (micCall) {
        try {
          micCall.close();
        } catch {
          /* kapalı */
        }
        micCall = null;
      }
      send({ t: 'mic', on: false });
      return false;
    },
    close() {
      closed = true;
      clearTimeout(retry);
      [screen, micStream].forEach((m) => m && m.getTracks().forEach((t) => t.stop()));
      try {
        if (micCall) micCall.close();
      } catch {
        /* kapalı */
      }
      try {
        if (call) call.close();
      } catch {
        /* kapalı */
      }
      try {
        if (peer) peer.destroy();
      } catch {
        /* kapalı */
      }
      try {
        if (ph.ac) ph.ac.close();
      } catch {
        /* kapalı */
      }
      clearInterval(ph.tick);
    },
  };
}

// ── yerel oda kayıtları (ev sahibinin cihazında) ──
const KEY = 'dusbahcesi_odalar';
export const loadRooms = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};
export function saveRoom(code, room) {
  const all = loadRooms();
  all[code] = { ...all[code], ...room };
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* kota */
  }
  return all[code];
}
export const myName = () => {
  try {
    return localStorage.getItem('dusbahcesi_adim') || '';
  } catch {
    return '';
  }
};
export const setMyName = (n) => {
  try {
    localStorage.setItem('dusbahcesi_adim', n);
  } catch {
    /* kota */
  }
};
