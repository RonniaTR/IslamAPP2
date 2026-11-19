import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Heart,
  MessageCircle,
  Feather,
  Link2,
  Maximize2,
  Volume2,
  VolumeX,
  Tv,
  Film,
  MonitorUp,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  X,
  Send,
  Sliders,
} from 'lucide-react';
import {
  startSession,
  loadRooms,
  saveRoom,
  myName,
  setMyName,
  canShareScreen,
  canStreamFile,
  listAudioInputs,
  watchVoiceLevel,
} from '../../services/oda/peer';
import { parseYouTube } from '../../services/oda/youtube';
import { Backdrop, Lanterns, Hearts, Sakayik } from './DusBahcesi';
import OdaKur, { field, goldBtn, ghostBtn, glass, serif } from './OdaKur';
import YTStage from './YTStage';

// 🎬 ODA — /oda (kur) · /oda/:kod (gir). Menülerde yoktur; yalnız bağlantıyla açılır. Firebase gerekmez.
const initial = (s) => (s || '').trim().charAt(0).toLocaleUpperCase('tr') || '·';
const EMOJI = ['❤️', '🌙', '✨', '🌸', '🤍'];

function useViewport() {
  const [vp, setVp] = useState(() => {
    if (typeof window === 'undefined') return { wide: false, compact: false };
    return {
      wide: window.matchMedia('(min-width: 1024px)').matches,
      compact: window.matchMedia('(max-width: 520px)').matches,
    };
  });
  useEffect(() => {
    const mqWide = window.matchMedia('(min-width: 1024px)');
    const mqCompact = window.matchMedia('(max-width: 520px)');
    const update = () => setVp({ wide: mqWide.matches, compact: mqCompact.matches });
    mqWide.addEventListener('change', update);
    mqCompact.addEventListener('change', update);
    return () => {
      mqWide.removeEventListener('change', update);
      mqCompact.removeEventListener('change', update);
    };
  }, []);
  return vp;
}

function statusText(s, role, onun) {
  if (s === 'bagli') return 'birliktesiniz';
  if (s === 'bekliyor') return onun ? `${onun} bekleniyor` : 'davet bekleniyor';
  if (s === 'evsahibiyok') return `${onun || 'Ev sahibi'} henüz odada değil`;
  if (s === 'baglaniyor' || s === 'hazirlaniyor') return 'bağlanıyor…';
  if (s === 'koptu') return 'bağlantı koptu, yeniden deneniyor';
  if (s === 'hata:acik') return 'oda başka bir sekmede açık';
  if (s === 'hata:ag') return 'sunucuya bağlanılıyor, lütfen bekle…';
  if (s === 'hata:tarayici') return 'bu tarayıcı desteklemiyor';
  return 'bağlanıyor…';
}

export default function OdaPage() {
  const { id } = useParams();
  return <OdaInner key={id || 'kur'} code={id} />;
}

function OdaInner({ code }) {
  const navigate = useNavigate();
  const { wide, compact } = useViewport();
  const local = code ? loadRooms()[code] : null;
  const role = local ? 'host' : 'guest';
  const kimden = (() => {
    try {
      return (new URLSearchParams(window.location.search).get('k') || '').slice(0, 24);
    } catch {
      return '';
    }
  })();

  const [entered, setEntered] = useState(false);
  const [name, setName] = useState(role === 'host' ? local.benim : myName());
  const [room, setRoom] = useState(local);
  const [peerName, setPeerName] = useState(role === 'host' ? (local && local.onun) || '' : '');
  const [st, setSt] = useState('hazirlaniyor');
  const [remote, setRemote] = useState(null);
  const [remoteLive, setRemoteLive] = useState(null);
  const [mode, setModeState] = useState('yt');
  const [vid, setVid] = useState(null);
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);
  const [kind, setKind] = useState(canStreamFile() ? 'yayin' : 'ayni');
  const [peerFile, setPeerFile] = useState(null);
  const [sharing, setSharing] = useState(false);

  // Mikrofon ve ses durumu (Telefon, Tablet ve PC)
  const [mic, setMic] = useState(false);
  const [peerMic, setPeerMic] = useState(false);
  const [myLevel, setMyLevel] = useState(0);
  const [peerLevel, setPeerLevel] = useState(0);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [speakerVol, setSpeakerVol] = useState(1);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedMicId, setSelectedMicId] = useState('');
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState('');
  const [panel, setPanel] = useState('sohbet');
  const [hearts, setHearts] = useState([]);
  const [needTap, setNeedTap] = useState(false);
  const [toast, setToast] = useState('');
  const [newPoem, setNewPoem] = useState({ baslik: '', metin: '' });

  const s = useRef(null);
  const yt = useRef(null);
  const stage = useRef(null);
  const vStage = useRef(null);
  const aMic = useRef(null);
  const vLocal = useRef(null);
  const panelRef = useRef(null);
  const hid = useRef(0);
  const applying = useRef(0);
  const streaming = useRef(false);
  const stopLocalWatch = useRef(null);
  const handler = useRef(() => {});

  const say = (t) => {
    setToast(t);
    setTimeout(() => setToast((x) => (x === t ? '' : x)), 2800);
  };
  const heart = useCallback((e, mine) => {
    const k = ++hid.current;
    setHearts((h) => [...h, { id: k, e, mine, dx: (Math.random() - 0.5) * 90 }]);
    setTimeout(() => setHearts((h) => h.filter((x) => x.id !== k)), e === 'peony' ? 3500 : 2700);
  }, []);
  const send = (m) => s.current && s.current.send(m);
  const quiet = (ms = 700) => {
    applying.current = Date.now() + ms;
  };
  const isQuiet = () => Date.now() < applying.current;

  const setMode = (m, broadcast = true) => {
    setModeState(m);
    if (broadcast) send({ t: 'mode', mode: m });
  };

  // Gelen mesajlar
  handler.current = (m) => {
    if (m.t === 'hello') {
      setPeerName(m.name || '');
      if (role === 'guest' && m.room) setRoom(m.room);
      if (role === 'host') send({ t: 'mode', mode, vid });
      if (mic) send({ t: 'mic', on: true });
    }
    if (m.t === 'room' && role === 'guest') setRoom(m.room);
    if (m.t === 'chat') setChat((c) => [...c.slice(-100), { me: false, m: m.m, at: Date.now() + Math.random() }]);
    if (m.t === 'kalp') heart(m.e || '❤️', false);
    if (m.t === 'mic') {
      setPeerMic(!!m.on);
      if (!m.on) setPeerLevel(0);
      if (m.on && aMic.current) {
        aMic.current.play().catch(() => setNeedTap(true));
      }
    }
    if (m.t === 'mode') {
      setModeState(m.mode);
      if (m.vid && m.vid !== vid) {
        setVid(m.vid);
        if (yt.current) yt.current.load(m.vid);
      }
    }
    if (m.t === 'yt' && yt.current) {
      if (m.a === 'load') {
        setVid(m.vid);
        setModeState('yt');
        yt.current.load(m.vid);
      }
      if (m.a === 'play') yt.current.play(m.time);
      if (m.a === 'pause') yt.current.pause(m.time);
      if (m.a === 'saat') yt.current.drift(m.time);
    }
    if (m.t === 'live') setRemoteLive(m.on ? { kind: m.kind, ad: m.ad } : null);
    const v = vLocal.current;
    if (m.t === 'uzak' && v && streaming.current) {
      if (m.a === 'play') v.play().catch(() => {});
      if (m.a === 'pause') v.pause();
      if (m.a === 'geri') v.currentTime = Math.max(0, v.currentTime - 10);
      if (m.a === 'ileri') v.currentTime = Math.min(v.duration || 1e9, v.currentTime + 10);
    }
    if (m.t === 'dosya') setPeerFile({ ad: m.ad, sure: m.sure });
    if (m.t === 'izle' && v && kind === 'ayni') {
      quiet();
      if (typeof m.time === 'number' && Math.abs(v.currentTime - m.time) > 0.5) v.currentTime = m.time;
      if (m.a === 'play') v.play().catch(() => setNeedTap(true));
      if (m.a === 'pause') v.pause();
    }
    if (m.t === 'saat' && v && kind === 'ayni' && !v.paused && Math.abs(v.currentTime - m.time) > 0.8) {
      quiet();
      v.currentTime = m.time;
    }
  };

  // Oturum başlatma
  useEffect(() => {
    if (!entered || !code) return undefined;
    const pub = room
      ? { ad: room.ad, benim: room.benim, onun: room.onun, cumle: room.cumle, siirler: room.siirler || [] }
      : undefined;
    const sess = startSession({
      role,
      code,
      name,
      room: pub,
      onState: setSt,
      onMessage: (m) => handler.current(m),
      onRemote: setRemote,
    });
    s.current = sess;
    return () => {
      if (stopLocalWatch.current) {
        stopLocalWatch.current();
        stopLocalWatch.current = null;
      }
      sess.close();
      s.current = null;
    };
  }, [entered, code]);

  // Karşıdan gelen ses ve görüntü akışlarını bağla
  useEffect(() => {
    if (!remote) return undefined;
    if (vStage.current && remote.stage) {
      vStage.current.srcObject = remote.stage;
      vStage.current.play().catch(() => setNeedTap(true));
    }
    if (aMic.current && remote.mic) {
      aMic.current.srcObject = remote.mic;
      aMic.current.muted = speakerMuted;
      aMic.current.volume = speakerVol;
      aMic.current.play().catch(() => setNeedTap(true));
    }
    const stopWatch = remote.mic ? watchVoiceLevel(remote.mic, setPeerLevel) : () => {};
    return () => stopWatch();
  }, [remote]);

  useEffect(() => {
    if (aMic.current) {
      aMic.current.muted = speakerMuted;
      aMic.current.volume = speakerVol;
    }
  }, [speakerMuted, speakerVol]);

  useEffect(() => {
    if (st !== 'bagli') {
      setRemoteLive(null);
      setPeerMic(false);
      setPeerLevel(0);
    }
  }, [st]);

  // Ev sahibi saat senkronu
  useEffect(() => {
    if (role !== 'host') return undefined;
    const t = setInterval(() => {
      if (mode === 'yt' && yt.current && yt.current.playing()) {
        send({ t: 'yt', a: 'saat', time: yt.current.time() });
      }
      const v = vLocal.current;
      if (mode === 'video' && kind === 'ayni' && v && !v.paused) {
        send({ t: 'saat', time: v.currentTime });
      }
    }, 4000);
    return () => clearInterval(t);
  });

  const openYT = () => {
    const id = parseYouTube(link);
    if (!id) {
      say('Bu bir YouTube bağlantısına benzemiyor.');
      return;
    }
    setVid(id);
    setMode('yt', false);
    if (yt.current) yt.current.load(id);
    send({ t: 'yt', a: 'load', vid: id });
    setLink('');
  };

  const pickFile = async (f) => {
    if (!f) return;
    if (streaming.current && s.current) {
      await s.current.stopVideo();
      streaming.current = false;
      send({ t: 'live', on: false });
    }
    if (file) URL.revokeObjectURL(file.url);
    setFile({ url: URL.createObjectURL(f), ad: f.name });
    setMode('video');
  };

  const onLocalPlaying = async () => {
    if (kind !== 'yayin' || streaming.current || !s.current || !vLocal.current) return;
    try {
      await s.current.streamVideo(vLocal.current);
      streaming.current = true;
      send({ t: 'live', on: true, kind: 'video', ad: file && file.ad });
    } catch {
      say('Bu tarayıcı videoyu yayınlayamıyor; “İkimizde de var”ı seç.');
    }
  };

  const stopFile = async () => {
    if (streaming.current && s.current) {
      await s.current.stopVideo();
      send({ t: 'live', on: false });
    }
    streaming.current = false;
    if (file) URL.revokeObjectURL(file.url);
    setFile(null);
  };

  const toggleScreen = async () => {
    try {
      if (sharing) {
        await s.current.stopScreen();
        setSharing(false);
        send({ t: 'live', on: false });
        return;
      }
      const scr = await s.current.shareScreen();
      setSharing(true);
      setMode('ekran');
      send({ t: 'live', on: true, kind: 'ekran' });
      scr.getVideoTracks()[0].addEventListener('ended', async () => {
        if (s.current) await s.current.stopScreen();
        setSharing(false);
        send({ t: 'live', on: false });
      });
    } catch {
      /* vazgeçti */
    }
  };

  const toggleMic = async (forceDeviceId) => {
    if (!s.current) return;
    try {
      if (stopLocalWatch.current) {
        stopLocalWatch.current();
        stopLocalWatch.current = null;
      }
      const nextState = forceDeviceId ? true : !mic;
      const active = await s.current.setMic(nextState, forceDeviceId || selectedMicId || undefined);
      setMic(active);
      if (active) {
        const stream = s.current.getMicStream();
        stopLocalWatch.current = watchVoiceLevel(stream, setMyLevel);
        const inputs = await listAudioInputs();
        setAudioDevices(inputs);
        if (aMic.current) aMic.current.play().catch(() => {});
        say('Mikrofon açıldı, sesin karşıya gidiyor 🎤');
      } else {
        setMyLevel(0);
        say('Mikrofon kapatıldı.');
      }
    } catch {
      say('Mikrofon izni verilmedi veya mikrofon bulunamadı.');
    }
  };

  const changeMicDevice = async (devId) => {
    setSelectedMicId(devId);
    if (mic) {
      await toggleMic(devId);
    }
  };

  const sendChat = () => {
    const m = msg.trim();
    if (!m) return;
    send({ t: 'chat', m });
    setChat((c) => [...c.slice(-100), { me: true, m, at: Date.now() }]);
    setMsg('');
  };

  const sendHeart = (e) => {
    send({ t: 'kalp', e });
    heart(e, true);
    try {
      if (navigator.vibrate) navigator.vibrate(e === 'peony' ? [15, 40, 20] : 12);
    } catch {
      /* yok */
    }
  };

  const invite = async () => {
    const url = `${window.location.origin}/oda/${code}${
      room && room.benim ? `?k=${encodeURIComponent(room.benim)}` : ''
    }`;
    const text = `${room && room.onun ? `${room.onun}, ` : ''}seni şakayık bahçemize çağırıyorum 🌸🌙`;
    try {
      if (navigator.share) {
        await navigator.share({ title: room ? room.ad : 'Düş Bahçesi', text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      say('Davet bağlantısı kopyalandı 🌸');
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        say('Davet bağlantısı kopyalandı 🌸');
      } catch {
        /* vazgeçti */
      }
    }
  };

  const fullscreen = () => {
    const el = stage.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else {
      const v = remoteLive ? vStage.current : vLocal.current;
      if (v && v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    }
  };

  const tapResume = () => {
    setNeedTap(false);
    [vStage.current, aMic.current].forEach((x) => x && x.play().catch(() => {}));
    if (yt.current) yt.current.resume();
  };

  const addPoem = () => {
    if (!newPoem.metin.trim() || role !== 'host') return;
    const siirler = [...((room && room.siirler) || []), { baslik: newPoem.baslik.trim(), metin: newPoem.metin.trim() }];
    const r = saveRoom(code, { siirler });
    setRoom(r);
    setNewPoem({ baslik: '', metin: '' });
    send({ t: 'room', room: { ad: r.ad, benim: r.benim, onun: r.onun, cumle: r.cumle, siirler } });
  };

  const openMobileTab = (tabName) => {
    setPanel(tabName);
    if (!wide && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }
  };

  const bagli = st === 'bagli';
  const benimAd = role === 'host' ? (room && room.benim) || name : name;
  const onunAd = peerName || (role === 'host' ? room && room.onun : room && room.benim) || '';
  const ayni = file && peerFile && file.ad === peerFile.ad;

  // Ortak kaydırılabilir tam ekran kapsayıcı (body overflow:hidden olduğu için şart)
  const scrollShell = {
    height: '100dvh',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    color: '#F6EFDD',
    fontFamily: "'Noto Sans', sans-serif",
    position: 'relative',
  };

  // ───────── 1) ODA KUR (/oda) ─────────
  if (!code) {
    return (
      <div style={scrollShell}>
        <Backdrop />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: compact ? '12px 12px 36px' : '20px 18px 48px',
          }}
        >
          <OdaKur onOpen={(c) => navigate(`/oda/${c}`)} />
        </div>
      </div>
    );
  }

  // ───────── 2) GİRİŞ TÖRENİ (/oda/:id) ─────────
  if (!entered) {
    const a = role === 'host' ? room && room.benim : name || '?';
    const b = role === 'host' ? room && room.onun : kimden;
    return (
      <div style={scrollShell}>
        <Backdrop />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            minHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: compact ? 14 : 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            style={{
              ...glass,
              width: '100%',
              maxWidth: 440,
              textAlign: 'center',
              padding: compact ? '24px 18px' : '32px 24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
              <Sakayik size={50} glow pulse />
            </div>
            <motion.p
              animate={{
                textShadow: [
                  '0 0 12px rgba(255,210,122,0.3)',
                  '0 0 28px rgba(255,210,122,0.8)',
                  '0 0 12px rgba(255,210,122,0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ ...serif, fontSize: compact ? 42 : 50, margin: 0, color: '#FFE3A3' }}
            >
              {initial(a)}
              <span style={{ color: '#F7A8B8', margin: '0 10px', fontSize: compact ? 32 : 38 }}>♥</span>
              {b ? initial(b) : '·'}
            </motion.p>
            <h1 style={{ ...serif, fontSize: compact ? 24 : 28, margin: '8px 0 6px', color: '#FFE9B8' }}>
              {role === 'host'
                ? room && room.ad
                : kimden
                ? `${kimden} seni şakayık bahçesine çağırıyor`
                : 'Şakayık bahçesine davet edildin'}
            </h1>
            {role === 'host' && room && room.cumle && (
              <p style={{ margin: '0 0 8px', fontStyle: 'italic', color: '#E9E2FF', fontSize: 14.5 }}>
                “{room.cumle}”
              </p>
            )}
            <p style={{ margin: '0 0 16px', color: '#BDB6D8', fontSize: 13.5, lineHeight: 1.5 }}>
              Mikrofonla sesli konuşma, görüntü ve sohbet doğrudan ikiniz arasında akar; hiçbir yere kaydedilmez.
            </p>
            {role === 'guest' && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 24))}
                placeholder="Adın (örn. Melike)"
                style={{ ...field, textAlign: 'center', marginBottom: 12 }}
              />
            )}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (!name.trim()) {
                  say('Lütfen adını yaz.');
                  return;
                }
                setMyName(name.trim());
                setEntered(true);
              }}
              style={{
                ...goldBtn,
                width: '100%',
                minHeight: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Sakayik size={22} glow={false} /> Bahçeye Gir
            </motion.button>
            {toast && (
              <p role="alert" style={{ margin: '12px 0 0', color: '#F7A8B8', fontSize: 13.5 }}>
                {toast}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ───────── 3) BAHÇE / ODA İÇİ ─────────
  const showRemote = !!remoteLive;
  const tab = (id, label, Icon, disabled) => (
    <button
      key={id}
      type="button"
      disabled={disabled}
      onClick={() => setMode(id)}
      aria-pressed={mode === id}
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 42,
        borderRadius: 21,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontWeight: 700,
        fontSize: compact ? 13 : 14,
        padding: '0 8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: mode === id ? 'rgba(255,227,163,0.2)' : 'transparent',
        color: mode === id ? '#FFE3A3' : disabled ? '#5D5878' : '#BDB6D8',
        transition: 'all .25s',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={16} style={{ flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
    </button>
  );

  // Sesli Konuşma + Şakayık + Etkileşim Çubuğu (Telefon, Tablet ve PC'de karışmayan esnek yapı)
  const voiceAndActionBar = (
    <div
      style={{
        ...glass,
        padding: compact ? '10px 12px' : '12px 16px',
        borderRadius: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {/* Mikrofon Ana Düğmesi (Telefon/Tablet/PC) */}
        <button
          type="button"
          onClick={() => toggleMic()}
          style={{
            minHeight: 44,
            padding: '0 16px',
            borderRadius: 22,
            border: mic ? '1.5px solid #F7A8B8' : '1px solid rgba(255,233,184,0.2)',
            background: mic
              ? 'linear-gradient(135deg, rgba(247,168,184,0.32), rgba(255,227,163,0.25))'
              : 'rgba(255,255,255,0.08)',
            color: mic ? '#FFE9B8' : '#F6EFDD',
            fontWeight: 700,
            fontSize: 13.5,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            flex: '1 1 auto',
            justifyContent: 'center',
            boxShadow: mic ? '0 0 18px rgba(247,168,184,0.35)' : 'none',
          }}
        >
          {mic ? <Mic size={18} color="#F7A8B8" /> : <MicOff size={18} />}
          <span>{mic ? 'Mikrofon Açık' : 'Mikrofonla Konuş'}</span>
          {mic && (
            <span
              aria-hidden
              style={{
                width: 24,
                height: 6,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.18)',
                overflow: 'hidden',
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  width: `${Math.max(15, Math.round(myLevel * 100))}%`,
                  background: '#F7A8B8',
                  transition: 'width 90ms',
                }}
              />
            </span>
          )}
        </button>

        {/* Karşı Tarafın Sesi / Hoparlör */}
        <button
          type="button"
          onClick={() => {
            const next = !speakerMuted;
            setSpeakerMuted(next);
            if (!next && aMic.current) aMic.current.play().catch(() => {});
          }}
          aria-label={speakerMuted ? 'Hoparlörü aç' : 'Hoparlörü kıs'}
          style={{
            ...ghostBtn,
            minHeight: 44,
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: speakerMuted ? '#F7A8B8' : '#9FE3C8',
          }}
        >
          {speakerMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          <span style={{ fontSize: 12.5 }}>{speakerMuted ? 'Ses Kapalı' : 'Hoparlör'}</span>
        </button>

        {/* Ses Ayarları (Mikrofon seçimi ve ses seviyesi) */}
        <button
          type="button"
          onClick={async () => {
            if (!showAudioSettings) {
              const devs = await listAudioInputs();
              setAudioDevices(devs);
            }
            setShowAudioSettings(!showAudioSettings);
          }}
          aria-label="Ses ayarları"
          style={{
            ...ghostBtn,
            minHeight: 44,
            width: 44,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: showAudioSettings ? 'rgba(255,227,163,0.2)' : ghostBtn.background,
          }}
        >
          <Sliders size={16} />
        </button>
      </div>

      {/* Açılır Ses ve Mikrofon Ayarları (PC / Tablet / Telefon) */}
      {showAudioSettings && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 16,
            background: 'rgba(10,8,26,0.65)',
            border: '1px solid rgba(255,233,184,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontSize: 13,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ color: '#BDB6D8' }}>Karşı tarafın ses seviyesi:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={speakerMuted ? 0 : speakerVol}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSpeakerVol(v);
                if (v > 0 && speakerMuted) setSpeakerMuted(false);
              }}
              style={{ width: 130, accentColor: '#F7A8B8' }}
            />
          </div>
          {audioDevices.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#BDB6D8' }}>Mikrofon cihazı (Telefon / Kulaklık / PC):</span>
              <select
                value={selectedMicId}
                onChange={(e) => changeMicDevice(e.target.value)}
                style={{ ...field, minHeight: 38, padding: '6px 10px', fontSize: 13 }}
              >
                <option value="" style={{ background: '#141030', color: '#F6EFDD' }}>
                  Varsayılan Mikrofon
                </option>
                {audioDevices.map((d, idx) => (
                  <option key={d.deviceId || idx} value={d.deviceId} style={{ background: '#141030', color: '#F6EFDD' }}>
                    {d.label || `Mikrofon ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Şakayık Gönder & Kalp / Gece / Sekme Kısayolları */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => sendHeart('peony')}
          style={{
            minHeight: 42,
            padding: '0 14px',
            borderRadius: 21,
            border: '1px solid rgba(247,168,184,0.4)',
            background: 'linear-gradient(135deg, rgba(247,168,184,0.22), rgba(201,74,114,0.18))',
            color: '#FFD6E2',
            fontWeight: 700,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            flex: '1 1 auto',
            justifyContent: 'center',
          }}
        >
          <Sakayik size={22} glow={false} />
          <span>Şakayık Gönder</span>
        </button>

        <button
          type="button"
          onClick={() => sendHeart('❤️')}
          aria-label="Kalp gönder"
          style={{
            ...ghostBtn,
            minHeight: 42,
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Heart size={16} color="#F7A8B8" fill="#F7A8B8" />
          <span style={{ fontSize: 12.5 }}>Kalp</span>
        </button>

        <button
          type="button"
          onClick={() => sendHeart(EMOJI[1 + Math.floor(Math.random() * (EMOJI.length - 1))])}
          aria-label="Işık gönder"
          style={{
            ...ghostBtn,
            minHeight: 42,
            width: 42,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
          }}
        >
          🌙
        </button>

        {!wide && (
          <>
            <button
              type="button"
              onClick={() => openMobileTab('sohbet')}
              style={{
                ...ghostBtn,
                minHeight: 42,
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: panel === 'sohbet' ? 'rgba(255,227,163,0.2)' : ghostBtn.background,
                color: panel === 'sohbet' ? '#FFE3A3' : '#F6EFDD',
              }}
            >
              <MessageCircle size={15} />
              <span style={{ fontSize: 12.5 }}>Sohbet {chat.length > 0 ? `(${chat.length})` : ''}</span>
            </button>
            <button
              type="button"
              onClick={() => openMobileTab('siir')}
              style={{
                ...ghostBtn,
                minHeight: 42,
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: panel === 'siir' ? 'rgba(255,227,163,0.2)' : ghostBtn.background,
                color: panel === 'siir' ? '#FFE3A3' : '#F6EFDD',
              }}
            >
              <Feather size={15} />
              <span style={{ fontSize: 12.5 }}>Şiir</span>
            </button>
          </>
        )}
      </div>
    </div>
  );

  const chatBox = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minHeight: 0 }}>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          minHeight: 150,
          maxHeight: wide ? 'none' : 240,
          paddingRight: 4,
        }}
      >
        {chat.length === 0 && (
          <p style={{ margin: 0, color: '#8F8AAE', fontSize: 13.5, lineHeight: 1.5 }}>
            Mesajlar yalnız ikinizin ekranında görünür ve odadan çıkınca silinir.
          </p>
        )}
        {chat.map((c) => (
          <motion.p
            key={c.at}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              margin: 0,
              alignSelf: c.me ? 'flex-end' : 'flex-start',
              maxWidth: '84%',
              padding: '9px 13px',
              borderRadius: 18,
              background: c.me ? 'rgba(255,227,163,0.2)' : 'rgba(247,168,184,0.18)',
              fontSize: 14.5,
              lineHeight: 1.45,
              wordBreak: 'break-word',
            }}
          >
            {c.m}
          </motion.p>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value.slice(0, 500))}
          onKeyDown={(e) => e.key === 'Enter' && sendChat()}
          placeholder={bagli ? 'Bir mesaj yaz…' : 'Karşı taraf bağlanınca yazabilirsin…'}
          disabled={!bagli}
          style={{ ...field, flex: 1, minHeight: 44 }}
        />
        <button
          type="button"
          onClick={sendChat}
          disabled={!bagli}
          aria-label="Gönder"
          style={{
            ...goldBtn,
            minHeight: 44,
            width: 48,
            padding: 0,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );

  const poemBox = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          borderRadius: 16,
          background: 'rgba(247,168,184,0.12)',
          border: '1px solid rgba(247,168,184,0.25)',
        }}
      >
        <Sakayik size={28} glow={false} />
        <span style={{ fontSize: 13, color: '#FFD6E2', lineHeight: 1.4 }}>
          Şakayık Köşesi · İkiniz için seçilen dizeler ve notlar
        </span>
      </div>
      {((room && room.siirler) || []).length === 0 && (
        <p style={{ margin: 0, color: '#8F8AAE', fontSize: 13.5 }}>Henüz şiir eklenmedi.</p>
      )}
      {((room && room.siirler) || []).map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          style={{ padding: 14, borderRadius: 18, background: '#FBF8F0', color: '#2A2440' }}
        >
          {p.baslik && <p style={{ ...serif, margin: '0 0 6px', fontSize: 19 }}>{p.baslik}</p>}
          <p style={{ margin: 0, whiteSpace: 'pre-line', lineHeight: 1.65, fontSize: 15 }}>{p.metin}</p>
        </motion.div>
      ))}
      {role === 'host' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            value={newPoem.baslik}
            onChange={(e) => setNewPoem({ ...newPoem, baslik: e.target.value.slice(0, 60) })}
            placeholder="Yeni şiirin başlığı"
            style={{ ...field, minHeight: 42 }}
          />
          <textarea
            value={newPoem.metin}
            onChange={(e) => setNewPoem({ ...newPoem, metin: e.target.value.slice(0, 3000) })}
            rows={3}
            placeholder="Şiir veya bir not…"
            style={{ ...field, resize: 'vertical', lineHeight: 1.5 }}
          />
          <button type="button" onClick={addPoem} style={ghostBtn}>
            + Ekle ve ona gönder
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={scrollShell}>
      <style>{'.oda-yt iframe{width:100%;height:100%;border:0;display:block}'}</style>
      <Backdrop dim={showRemote || (mode === 'video' && !!file) || (mode === 'yt' && !!vid)} />
      <Hearts list={hearts} />
      <audio ref={aMic} autoPlay playsInline />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: wide ? 1320 : 720,
          margin: '0 auto',
          padding: wide ? '18px 28px 36px' : compact ? '12px 10px 40px' : '16px 16px 48px',
          display: 'grid',
          gridTemplateColumns: wide ? 'minmax(0, 1fr) 370px' : 'minmax(0, 1fr)',
          gap: wide ? 20 : 12,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          {/* ÜST BAŞLIK (Responsive: telefon, tablet ve PC'de taşmaz) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: '1 1 200px' }}>
              <Sakayik size={compact ? 32 : 36} glow />
              <p style={{ ...serif, margin: 0, fontSize: compact ? 22 : 25, color: '#FFE3A3', whiteSpace: 'nowrap' }}>
                {initial(benimAd)}
                <span style={{ color: '#F7A8B8', margin: '0 5px', fontSize: compact ? 17 : 20 }}>♥</span>
                {initial(onunAd)}
              </p>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    ...serif,
                    margin: 0,
                    fontSize: compact ? 17 : 20,
                    color: '#FFE9B8',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {(room && room.ad) || 'Düş Bahçesi'}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12.5,
                    color: bagli ? '#9FE3C8' : '#BDB6D8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <motion.span
                    animate={{ opacity: bagli ? 1 : [0.3, 1, 0.3] }}
                    transition={{ duration: 1.4, repeat: bagli ? 0 : Infinity }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      background: bagli ? '#7FD1B0' : '#FFD27A',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {statusText(st, role, onunAd)}
                  </span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {role === 'host' && (
                <button
                  type="button"
                  onClick={invite}
                  style={{
                    ...ghostBtn,
                    minHeight: 38,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '0 13px',
                    fontSize: 13,
                    borderColor: 'rgba(247,168,184,0.35)',
                  }}
                >
                  <Link2 size={15} />
                  <span>Davet et</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/oda')}
                style={{
                  ...ghostBtn,
                  minHeight: 38,
                  padding: '0 12px',
                  fontSize: 12.5,
                  color: '#BDB6D8',
                }}
              >
                Odalar
              </button>
            </div>
          </div>

          {/* İKİ FENER + ORTADA AÇAN ŞAKAYIK + CANLI MİKROFON GÖSTERGESİ */}
          <Lanterns
            benim={benimAd}
            onun={onunAd || 'Melike'}
            onunVar={bagli}
            bagli={bagli}
            durum={bagli ? 'aynı gecedesiniz 🌸' : 'bekleniyor…'}
            myMic={mic}
            peerMic={peerMic}
            myLevel={myLevel}
            peerLevel={peerLevel}
          />

          {room && room.cumle && (
            <p
              style={{
                textAlign: 'center',
                fontStyle: 'italic',
                color: '#E9E2FF',
                margin: 0,
                ...serif,
                fontWeight: 400,
                fontSize: compact ? 15.5 : 17.5,
              }}
            >
              “{room.cumle}”
            </p>
          )}

          {/* TELEFON & TABLET İÇİN SES / MİKROFON / ŞAKAYIK KONTROL KARTI (Menüler asla üst üste binmez) */}
          {!wide && voiceAndActionBar}

          {/* KİP SEÇİCİ SEKMELER */}
          <div style={{ ...glass, padding: 5, borderRadius: 26, display: 'flex', gap: 4 }}>
            {tab('yt', 'YouTube', Tv)}
            {tab('video', 'Video', Film)}
            {tab('ekran', 'Ekran', MonitorUp)}
          </div>

          {/* 16:9 VİDEO / YOUTUBE / EKRAN SAHNESİ */}
          <div
            ref={stage}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              maxHeight: wide ? '62vh' : '48vh',
              borderRadius: wide ? 28 : 20,
              overflow: 'hidden',
              background: '#04030A',
              boxShadow: '0 30px 60px -30px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,233,184,0.12)',
            }}
          >
            <video
              ref={vStage}
              autoPlay
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                background: '#000',
                opacity: showRemote ? 1 : 0,
                pointerEvents: showRemote ? 'auto' : 'none',
                transition: 'opacity .5s',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, visibility: !showRemote && mode === 'yt' ? 'visible' : 'hidden' }}>
              <YTStage
                ref={yt}
                vid={vid}
                onLocal={(a, time) => send({ t: 'yt', a, time })}
                onBlocked={() => setNeedTap(true)}
              />
              {!vid && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: 'radial-gradient(ellipse at center, #1A1640 0%, #05040C 80%)',
                    textAlign: 'center',
                    padding: 16,
                  }}
                >
                  <Tv size={34} color="#FFE3A3" />
                  <p style={{ margin: 0, color: '#BDB6D8', maxWidth: 360, fontSize: compact ? 13 : 14.5, lineHeight: 1.5 }}>
                    Aşağıya bir YouTube bağlantısı yapıştır; ikinizde aynı anda açılır, oynat ve durdur birlikte çalışır.
                  </p>
                </div>
              )}
            </div>

            {!showRemote && mode === 'video' && file && (
              <video
                ref={vLocal}
                src={file.url}
                controls
                playsInline
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                onPlaying={onLocalPlaying}
                onLoadedMetadata={(e) => send({ t: 'dosya', ad: file.ad, sure: e.currentTarget.duration })}
                onPlay={(e) => {
                  if (kind === 'ayni' && !isQuiet()) send({ t: 'izle', a: 'play', time: e.currentTarget.currentTime });
                }}
                onPause={(e) => {
                  if (kind === 'ayni' && !isQuiet()) send({ t: 'izle', a: 'pause', time: e.currentTarget.currentTime });
                }}
                onSeeked={(e) => {
                  if (kind === 'ayni' && !isQuiet()) {
                    send({ t: 'izle', a: e.currentTarget.paused ? 'pause' : 'play', time: e.currentTarget.currentTime });
                  }
                }}
              />
            )}

            {!showRemote && ((mode === 'video' && !file) || mode === 'ekran') && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  background: 'radial-gradient(ellipse at center, #1A1640 0%, #05040C 80%)',
                  textAlign: 'center',
                  padding: 16,
                }}
              >
                <Sakayik size={44} glow pulse />
                <p style={{ margin: 0, color: '#BDB6D8', maxWidth: 380, fontSize: compact ? 13 : 14.5, lineHeight: 1.5 }}>
                  {mode === 'ekran'
                    ? sharing
                      ? 'Ekranını paylaşıyorsun; şu an senin ekranını görüyor.'
                      : canShareScreen()
                      ? 'Ekranını paylaştığında burada onda görünür.'
                      : 'Telefon ve tablet ekran paylaşamaz; karşı taraf bilgisayardan paylaşınca burada izlersin.'
                    : 'Bir video seç. İstersen ona yayınlarsın, istersen ikinizde de olan dosyayı birlikte oynatırsınız.'}
                </p>
              </div>
            )}

            {showRemote && remoteLive.kind === 'video' && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 12,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 8,
                  padding: 6,
                  borderRadius: 999,
                  background: 'rgba(10,8,24,0.75)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {[
                  ['geri', RotateCcw, '10 sn geri'],
                  ['play', Play, 'Oynat'],
                  ['pause', Pause, 'Durdur'],
                  ['ileri', RotateCw, '10 sn ileri'],
                ].map(([a, I, l]) => (
                  <button
                    key={a}
                    type="button"
                    aria-label={l}
                    onClick={() => send({ t: 'uzak', a })}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      border: 'none',
                      background: 'rgba(255,255,255,0.1)',
                      color: '#F6EFDD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <I size={17} />
                  </button>
                ))}
              </div>
            )}

            {showRemote && (
              <p
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 10,
                  margin: 0,
                  padding: '4px 10px',
                  borderRadius: 12,
                  background: 'rgba(10,8,24,0.7)',
                  fontSize: 12,
                  color: '#FFE3A3',
                  maxWidth: 'calc(100% - 70px)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {remoteLive.kind === 'ekran'
                  ? `${onunAd} ekranını paylaşıyor`
                  : `${onunAd} yayınlıyor${remoteLive.ad ? ` · ${remoteLive.ad}` : ''}`}
              </p>
            )}

            <button
              type="button"
              onClick={fullscreen}
              aria-label="Tam ekran"
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
                width: 38,
                height: 38,
                borderRadius: 19,
                border: 'none',
                background: 'rgba(10,8,24,0.6)',
                color: '#F6EFDD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Maximize2 size={16} />
            </button>

            {needTap && (
              <button
                type="button"
                onClick={tapResume}
                style={{
                  ...goldBtn,
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%,-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Volume2 size={18} /> Sesi ve Görüntüyü Başlat
              </button>
            )}
          </div>

          {/* KİP GİRİŞ PANELİ (Responsive: dar ekranda alt alta kırılır, taşmaz) */}
          {mode === 'yt' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && openYT()}
                placeholder="YouTube bağlantısı yapıştır…"
                style={{ ...field, flex: '1 1 210px', minHeight: 46 }}
                inputMode="url"
              />
              <button
                type="button"
                onClick={openYT}
                disabled={!link.trim()}
                style={{
                  ...goldBtn,
                  opacity: link.trim() ? 1 : 0.5,
                  padding: '0 20px',
                  minHeight: 46,
                  flex: compact ? '1 1 100%' : '0 0 auto',
                }}
              >
                Birlikte Aç
              </button>
            </div>
          )}

          {mode === 'video' && !showRemote && (
            <div style={{ ...glass, display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {canStreamFile() && (
                  <button
                    type="button"
                    onClick={() => setKind('yayin')}
                    aria-pressed={kind === 'yayin'}
                    style={{
                      ...ghostBtn,
                      flex: '1 1 130px',
                      background: kind === 'yayin' ? 'rgba(255,227,163,0.2)' : ghostBtn.background,
                      color: kind === 'yayin' ? '#FFE3A3' : '#F6EFDD',
                    }}
                  >
                    Ona yayınla
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setKind('ayni')}
                  aria-pressed={kind === 'ayni'}
                  style={{
                    ...ghostBtn,
                    flex: '1 1 130px',
                    background: kind === 'ayni' ? 'rgba(255,227,163,0.2)' : ghostBtn.background,
                    color: kind === 'ayni' ? '#FFE3A3' : '#F6EFDD',
                  }}
                >
                  İkimizde de var
                </button>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: '#BDB6D8', lineHeight: 1.5 }}>
                {kind === 'yayin'
                  ? 'Dosya sende; görüntü ve ses ona akar. O, kendi ekranından durdurup sarabilir.'
                  : 'Aynı dosyayı ikiniz de açın. Film internetten gitmez, en akıcı yol budur.'}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <label
                  style={{
                    ...goldBtn,
                    flex: 1,
                    minHeight: 46,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Film size={17} /> {file ? 'Başka video seç' : 'Video seç'}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      pickFile(e.target.files && e.target.files[0]);
                      e.target.value = '';
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
                {file && (
                  <button
                    type="button"
                    onClick={stopFile}
                    aria-label="Videoyu kapat"
                    style={{
                      ...ghostBtn,
                      width: 46,
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
              {kind === 'ayni' && file && peerFile && (
                <p style={{ margin: 0, fontSize: 12.5, color: ayni ? '#9FE3C8' : '#F7A8B8' }}>
                  {ayni ? '✓ İkiniz de aynı dosyayı açtınız.' : `Onda başka bir dosya açık: ${peerFile.ad}`}
                </p>
              )}
            </div>
          )}

          {mode === 'ekran' && canShareScreen() && (
            <button
              type="button"
              onClick={toggleScreen}
              disabled={!bagli}
              style={{
                ...goldBtn,
                opacity: bagli ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <MonitorUp size={18} /> {sharing ? 'Paylaşımı durdur' : 'Ekranını paylaş'}
            </button>
          )}
          {mode === 'ekran' && (
            <p style={{ margin: 0, fontSize: 12.5, color: '#8F8AAE', lineHeight: 1.5 }}>
              Sekme sesini de göndermek için paylaşırken “Sekme sesini paylaş” kutusunu işaretle.
            </p>
          )}

          {/* TELEFON & TABLET: SOHBET VE ŞİİR KÖŞESİ (Sabit pop-up yerine akış içinde, menüler üst üste binmez) */}
          {!wide && (
            <div ref={panelRef} style={{ ...glass, display: 'flex', flexDirection: 'column', gap: 12, padding: 14 }}>
              <div style={{ display: 'flex', gap: 6, padding: 4, borderRadius: 20, background: 'rgba(255,255,255,0.05)' }}>
                {[
                  ['sohbet', `Sohbet ${chat.length ? `(${chat.length})` : ''}`],
                  ['siir', 'Şiir & Şakayık Köşesi'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setPanel(k)}
                    style={{
                      flex: 1,
                      minHeight: 38,
                      borderRadius: 16,
                      border: 'none',
                      fontWeight: 700,
                      fontSize: 13.5,
                      background: (panel || 'sohbet') === k ? 'rgba(255,227,163,0.2)' : 'transparent',
                      color: (panel || 'sohbet') === k ? '#FFE3A3' : '#BDB6D8',
                      cursor: 'pointer',
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div style={{ minHeight: 190 }}>{(panel || 'sohbet') === 'sohbet' ? chatBox : poemBox}</div>
            </div>
          )}
        </div>

        {/* PC (≥1024px): SAĞ PANEL */}
        {wide && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              height: 'calc(100dvh - 48px)',
              position: 'sticky',
              top: 18,
            }}
          >
            {voiceAndActionBar}
            <div style={{ ...glass, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 20, background: 'rgba(255,255,255,0.05)' }}>
                {[
                  ['sohbet', 'Sohbet'],
                  ['siir', 'Şiir & Şakayık Köşesi'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setPanel(k)}
                    style={{
                      flex: 1,
                      minHeight: 38,
                      borderRadius: 16,
                      border: 'none',
                      fontWeight: 700,
                      fontSize: 13.5,
                      background: (panel || 'sohbet') === k ? 'rgba(255,227,163,0.2)' : 'transparent',
                      color: (panel || 'sohbet') === k ? '#FFE3A3' : '#BDB6D8',
                      cursor: 'pointer',
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>{(panel || 'sohbet') === 'sohbet' ? chatBox : poemBox}</div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              ...glass,
              position: 'fixed',
              top: 14,
              insetInline: 0,
              width: 'fit-content',
              maxWidth: '92vw',
              zIndex: 70,
              padding: '10px 18px',
              margin: '0 auto',
              fontSize: 13.5,
              borderRadius: 20,
              color: '#FFE9B8',
              boxShadow: '0 14px 34px rgba(0,0,0,0.6)',
            }}
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
