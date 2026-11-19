import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Heart, MessageCircle, Feather, Link2, Maximize2, Volume2, Tv, Film, MonitorUp, Play, Pause, RotateCcw, RotateCw, X, Send } from 'lucide-react';
import { startSession, loadRooms, saveRoom, myName, setMyName, canShareScreen, canStreamFile } from '../../services/oda/peer';
import { parseYouTube } from '../../services/oda/youtube';
import { Backdrop, Lanterns, Hearts } from './DusBahcesi';
import OdaKur, { field, goldBtn, ghostBtn, glass, serif } from './OdaKur';
import YTStage from './YTStage';

// 🎬 ODA — /oda (kur) · /oda/:kod (gir). Menülerde yoktur; yalnız bağlantıyla açılır. Firebase gerekmez.
// Üç kip: YouTube (ikiniz aynı videoyu izlersiniz, eşlenir) · Video (dosyanı ona yayınla ya da ikinizde de olanı eşle)
// · Ekran (bilgisayardan). Görüntü ve ses ikiniz arasında doğrudan akar, hiçbir yere kaydedilmez.
const initial = (s) => (s || '').trim().charAt(0).toLocaleUpperCase('tr') || '·';
const EMOJI = ['❤️', '🌙', '✨', '🌸', '🤍'];

function useWide() {
  const q = '(min-width: 1024px)';
  const [w, setW] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => { const m = window.matchMedia(q); const f = () => setW(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  return w;
}

function statusText(s, role, onun, benim) {
  if (s === 'bagli') return 'birliktesiniz';
  if (s === 'bekliyor') return onun ? `${onun} bekleniyor` : 'davet bekleniyor';
  if (s === 'evsahibiyok') return `${onun || 'Ev sahibi'} henüz odada değil`;
  if (s === 'baglaniyor' || s === 'hazirlaniyor') return 'bağlanıyor…';
  if (s === 'koptu') return 'bağlantı koptu, yeniden deneniyor';
  if (s === 'hata:acik') return 'oda başka bir sekmede açık';
  if (s === 'hata:ag') return 'sunucuya ulaşılamadı, yeniden deneniyor';
  if (s === 'hata:tarayici') return 'bu tarayıcı desteklemiyor';
  return 'bağlanıyor…';
}

// /oda → /oda/:kod geçişinde React aynı bileşeni yeniden kullanıyordu; oda bilgisi boş kalıp sayfa çöküyordu.
// Her oda kodu için bileşen sıfırdan kurulur.
export default function OdaPage() {
  const { id } = useParams();
  return <OdaInner key={id || 'kur'} code={id} />;
}

function OdaInner({ code }) {
  const navigate = useNavigate();
  const wide = useWide();
  const local = code ? loadRooms()[code] : null;
  const role = local ? 'host' : 'guest';
  const kimden = (() => { try { return (new URLSearchParams(window.location.search).get('k') || '').slice(0, 24); } catch { return ''; } })();

  const [entered, setEntered] = useState(false);
  const [name, setName] = useState(role === 'host' ? local.benim : myName());
  const [room, setRoom] = useState(local);
  const [peerName, setPeerName] = useState(role === 'host' ? (local && local.onun) || '' : '');
  const [st, setSt] = useState('hazirlaniyor');
  const [remote, setRemote] = useState(null);
  const [remoteLive, setRemoteLive] = useState(null);     // { kind:'ekran'|'video', ad }
  const [mode, setModeState] = useState('yt');
  const [vid, setVid] = useState(null);
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);                // { url, ad }
  const [kind, setKind] = useState(canStreamFile() ? 'yayin' : 'ayni');
  const [peerFile, setPeerFile] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [mic, setMic] = useState(false);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState('');
  const [panel, setPanel] = useState(null);
  const [hearts, setHearts] = useState([]);
  const [needTap, setNeedTap] = useState(false);
  const [toast, setToast] = useState('');
  const [newPoem, setNewPoem] = useState({ baslik: '', metin: '' });

  const s = useRef(null); const yt = useRef(null); const stage = useRef(null);
  const vStage = useRef(null); const aMic = useRef(null); const vLocal = useRef(null);
  const hid = useRef(0); const applying = useRef(0); const streaming = useRef(false);
  const handler = useRef(() => {});

  const say = (t) => { setToast(t); setTimeout(() => setToast((x) => (x === t ? '' : x)), 2600); };
  const heart = useCallback((e, mine) => { const k = ++hid.current; setHearts((h) => [...h, { id: k, e, mine, dx: (Math.random() - 0.5) * 90 }]); setTimeout(() => setHearts((h) => h.filter((x) => x.id !== k)), 2700); }, []);
  const send = (m) => s.current && s.current.send(m);
  const quiet = (ms = 700) => { applying.current = Date.now() + ms; };
  const isQuiet = () => Date.now() < applying.current;

  const setMode = (m, broadcast = true) => { setModeState(m); if (broadcast) send({ t: 'mode', mode: m }); };

  // gelen mesajlar (her çizimde güncel kalır)
  handler.current = (m) => {
    if (m.t === 'hello') { setPeerName(m.name || ''); if (role === 'guest' && m.room) setRoom(m.room); if (role === 'host') send({ t: 'mode', mode, vid }); }
    if (m.t === 'room' && role === 'guest') setRoom(m.room);
    if (m.t === 'chat') setChat((c) => [...c.slice(-100), { me: false, m: m.m, at: Date.now() + Math.random() }]);
    if (m.t === 'kalp') heart(m.e || '❤️', false);
    if (m.t === 'mode') { setModeState(m.mode); if (m.vid && m.vid !== vid) { setVid(m.vid); if (yt.current) yt.current.load(m.vid); } }
    if (m.t === 'yt' && yt.current) {
      if (m.a === 'load') { setVid(m.vid); setModeState('yt'); yt.current.load(m.vid); }
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
    if (m.t === 'saat' && v && kind === 'ayni' && !v.paused && Math.abs(v.currentTime - m.time) > 0.8) { quiet(); v.currentTime = m.time; }
  };

  // oturum
  useEffect(() => {
    if (!entered || !code) return undefined;
    const pub = room ? { ad: room.ad, benim: room.benim, onun: room.onun, cumle: room.cumle, siirler: room.siirler || [] } : undefined;
    const sess = startSession({ role, code, name, room: pub, onState: setSt, onMessage: (m) => handler.current(m), onRemote: setRemote });
    s.current = sess;
    return () => { sess.close(); s.current = null; };
  }, [entered, code]);

  useEffect(() => {
    if (!remote) return;
    if (vStage.current) { vStage.current.srcObject = remote.stage; vStage.current.play().catch(() => setNeedTap(true)); }
    if (aMic.current) { aMic.current.srcObject = remote.mic; aMic.current.play().catch(() => setNeedTap(true)); }
  }, [remote]);
  useEffect(() => { if (st !== 'bagli') { setRemoteLive(null); } }, [st]);

  // ev sahibi saat tutar (YouTube ve aynı dosya)
  useEffect(() => {
    if (role !== 'host') return undefined;
    const t = setInterval(() => {
      if (mode === 'yt' && yt.current && yt.current.playing()) send({ t: 'yt', a: 'saat', time: yt.current.time() });
      const v = vLocal.current;
      if (mode === 'video' && kind === 'ayni' && v && !v.paused) send({ t: 'saat', time: v.currentTime });
    }, 4000);
    return () => clearInterval(t);
  });

  const openYT = () => {
    const id = parseYouTube(link);
    if (!id) { say('Bu bir YouTube bağlantısına benzemiyor.'); return; }
    setVid(id); setMode('yt', false); if (yt.current) yt.current.load(id); send({ t: 'yt', a: 'load', vid: id }); setLink('');
  };
  const pickFile = async (f) => {
    if (!f) return;
    if (streaming.current && s.current) { await s.current.stopVideo(); streaming.current = false; send({ t: 'live', on: false }); }
    if (file) URL.revokeObjectURL(file.url);
    setFile({ url: URL.createObjectURL(f), ad: f.name });
    setMode('video');
  };
  const onLocalPlaying = async () => {
    if (kind !== 'yayin' || streaming.current || !s.current || !vLocal.current) return;
    try { await s.current.streamVideo(vLocal.current); streaming.current = true; send({ t: 'live', on: true, kind: 'video', ad: file && file.ad }); }
    catch { say('Bu tarayıcı videoyu yayınlayamıyor; “İkimizde de var”ı seç.'); }
  };
  const stopFile = async () => {
    if (streaming.current && s.current) { await s.current.stopVideo(); send({ t: 'live', on: false }); }
    streaming.current = false; if (file) URL.revokeObjectURL(file.url); setFile(null);
  };
  const toggleScreen = async () => {
    try {
      if (sharing) { await s.current.stopScreen(); setSharing(false); send({ t: 'live', on: false }); return; }
      const scr = await s.current.shareScreen(); setSharing(true); setMode('ekran'); send({ t: 'live', on: true, kind: 'ekran' });
      scr.getVideoTracks()[0].addEventListener('ended', async () => { await s.current.stopScreen(); setSharing(false); send({ t: 'live', on: false }); });
    } catch { /* vazgeçti */ }
  };
  const toggleMic = async () => { try { setMic(await s.current.setMic(!mic)); } catch { say('Mikrofon izni verilmedi.'); } };
  const sendChat = () => { const m = msg.trim(); if (!m) return; send({ t: 'chat', m }); setChat((c) => [...c.slice(-100), { me: true, m, at: Date.now() }]); setMsg(''); };
  const sendHeart = (e) => { send({ t: 'kalp', e }); heart(e, true); try { navigator.vibrate && navigator.vibrate(12); } catch { /* yok */ } };
  const invite = async () => {
    const url = `${window.location.origin}/oda/${code}${room && room.benim ? `?k=${encodeURIComponent(room.benim)}` : ''}`;
    const text = `${room && room.onun ? `${room.onun}, ` : ''}seni bahçemize çağırıyorum 🌙`;
    try { if (navigator.share) { await navigator.share({ title: room ? room.ad : 'Düş Bahçesi', text, url }); return; } await navigator.clipboard.writeText(url); say('Davet bağlantısı kopyalandı.'); }
    catch { /* vazgeçti */ }
  };
  const fullscreen = () => {
    const el = stage.current; if (!el) return;
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {}); else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else { const v = remoteLive ? vStage.current : vLocal.current; if (v && v.webkitEnterFullscreen) v.webkitEnterFullscreen(); }
  };
  const tapResume = () => { setNeedTap(false); [vStage.current, aMic.current].forEach((x) => x && x.play().catch(() => {})); if (yt.current) yt.current.resume(); };
  const addPoem = () => {
    if (!newPoem.metin.trim() || role !== 'host') return;
    const siirler = [...((room && room.siirler) || []), { baslik: newPoem.baslik.trim(), metin: newPoem.metin.trim() }];
    const r = saveRoom(code, { siirler }); setRoom(r); setNewPoem({ baslik: '', metin: '' });
    send({ t: 'room', room: { ad: r.ad, benim: r.benim, onun: r.onun, cumle: r.cumle, siirler } });
  };

  const bagli = st === 'bagli';
  const benimAd = role === 'host' ? (room && room.benim) || name : name;
  const onunAd = peerName || (role === 'host' ? (room && room.onun) : (room && room.benim)) || '';
  const ayni = file && peerFile && (file.ad === peerFile.ad);

  // ───────── KUR ─────────
  if (!code) {
    return (
      <div style={{ minHeight: '100vh', color: '#F6EFDD', fontFamily: "'Noto Sans', sans-serif", position: 'relative' }}>
        <Backdrop />
        <div style={{ position: 'relative', zIndex: 1, padding: '16px 16px 60px' }}><OdaKur onOpen={(c) => navigate(`/oda/${c}`)} /></div>
      </div>
    );
  }

  // ───────── GİRİŞ TÖRENİ ─────────
  if (!entered) {
    const a = role === 'host' ? (room && room.benim) : (name || '?');
    const b = role === 'host' ? (room && room.onun) : kimden;
    return (
      <div style={{ minHeight: '100vh', color: '#F6EFDD', fontFamily: "'Noto Sans', sans-serif", position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Backdrop />
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} style={{ ...glass, position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, textAlign: 'center', padding: '34px 24px' }}>
          <motion.p animate={{ textShadow: ['0 0 12px rgba(255,210,122,0.3)', '0 0 28px rgba(255,210,122,0.8)', '0 0 12px rgba(255,210,122,0.3)'] }} transition={{ duration: 3, repeat: Infinity }}
            style={{ ...serif, fontSize: 56, margin: 0, color: '#FFE3A3' }}>{initial(a)}<span style={{ color: '#F7A8B8', margin: '0 10px', fontSize: 40 }}>♥</span>{b ? initial(b) : '·'}</motion.p>
          <h1 style={{ ...serif, fontSize: 30, margin: '10px 0 6px', color: '#FFE9B8' }}>{role === 'host' ? (room && room.ad) : kimden ? `${kimden} seni bahçesine çağırıyor` : 'Bir bahçeye davet edildin'}</h1>
          {role === 'host' && room && room.cumle && <p style={{ margin: '0 0 6px', fontStyle: 'italic', color: '#E9E2FF' }}>“{room.cumle}”</p>}
          <p style={{ margin: '0 0 18px', color: '#BDB6D8', fontSize: 14 }}>Görüntü ve ses ikiniz arasında doğrudan akar; hiçbir yere kaydedilmez.</p>
          {role === 'guest' && <input value={name} onChange={(e) => setName(e.target.value.slice(0, 24))} placeholder="Adın" style={{ ...field, textAlign: 'center', marginBottom: 14 }} />}
          <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => { if (!name.trim()) { say('Adını yaz.'); return; } setMyName(name.trim()); setEntered(true); }} style={{ ...goldBtn, width: '100%' }}>Bahçeye gir</motion.button>
          {toast && <p role="alert" style={{ margin: '12px 0 0', color: '#F7A8B8' }}>{toast}</p>}
        </motion.div>
      </div>
    );
  }

  // ───────── ODA ─────────
  const showRemote = !!remoteLive;
  const tab = (id, label, Icon, disabled) => (
    <button key={id} type="button" disabled={disabled} onClick={() => setMode(id)} aria-pressed={mode === id}
      style={{ flex: 1, minHeight: 44, borderRadius: 22, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 700, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
        background: mode === id ? 'rgba(255,227,163,0.18)' : 'transparent', color: mode === id ? '#FFE3A3' : disabled ? '#5D5878' : '#BDB6D8', transition: 'all .25s' }}>
      <Icon size={17} /> {label}
    </button>
  );
  const ctl = (on) => ({ width: 52, height: 52, borderRadius: 26, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'linear-gradient(135deg, #FFE3A3, #F2B860)' : 'rgba(255,255,255,0.08)', color: on ? '#2A1E05' : '#F6EFDD', cursor: 'pointer', flex: 'none' });

  const controls = (
    <>
          <button type="button" onClick={toggleMic} disabled={!bagli} aria-label={mic ? 'Mikrofonu kapat' : 'Mikrofonu aç'} style={{ ...ctl(mic), opacity: bagli ? 1 : 0.45 }}>{mic ? <Mic size={21} /> : <MicOff size={21} />}</button>
          <button type="button" onClick={() => sendHeart('❤️')} disabled={!bagli} aria-label="Kalp gönder" style={{ ...ctl(false), opacity: bagli ? 1 : 0.45 }}><Heart size={21} color="#F7A8B8" fill="#F7A8B8" /></button>
          <button type="button" onClick={() => sendHeart(EMOJI[1 + Math.floor(Math.random() * (EMOJI.length - 1))])} disabled={!bagli} aria-label="Gökten bir şey gönder" style={{ ...ctl(false), opacity: bagli ? 1 : 0.45, fontSize: 21 }}>🌙</button>
          {!wide && <button type="button" onClick={() => setPanel(panel === 'sohbet' ? null : 'sohbet')} aria-label="Sohbet" style={ctl(panel === 'sohbet')}><MessageCircle size={21} /></button>}
          {!wide && <button type="button" onClick={() => setPanel(panel === 'siir' ? null : 'siir')} aria-label="Şiir köşesi" style={ctl(panel === 'siir')}><Feather size={21} /></button>}
    </>
  );

  const chatBox = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 140 }}>
        {chat.length === 0 && <p style={{ margin: 0, color: '#8F8AAE', fontSize: 14, lineHeight: 1.5 }}>Mesajlar yalnız ikinizin ekranında görünür ve odadan çıkınca silinir.</p>}
        {chat.map((c) => <motion.p key={c.at} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ margin: 0, alignSelf: c.me ? 'flex-end' : 'flex-start', maxWidth: '82%', padding: '9px 13px', borderRadius: 18, background: c.me ? 'rgba(255,227,163,0.18)' : 'rgba(200,182,255,0.15)', fontSize: 15, lineHeight: 1.4, wordBreak: 'break-word' }}>{c.m}</motion.p>)}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={msg} onChange={(e) => setMsg(e.target.value.slice(0, 500))} onKeyDown={(e) => e.key === 'Enter' && sendChat()} placeholder={bagli ? 'Yaz…' : 'Bağlantı bekleniyor'} disabled={!bagli} style={{ ...field, flex: 1, minHeight: 48 }} />
        <button type="button" onClick={sendChat} disabled={!bagli} aria-label="Gönder" style={{ ...goldBtn, minHeight: 48, width: 52, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={18} /></button>
      </div>
    </div>
  );
  const poemBox = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', height: '100%' }}>
      {((room && room.siirler) || []).length === 0 && <p style={{ margin: 0, color: '#8F8AAE', fontSize: 14 }}>Henüz şiir yok.</p>}
      {((room && room.siirler) || []).map((p, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ padding: 16, borderRadius: 20, background: '#FBF8F0', color: '#2A2440' }}>
          {p.baslik && <p style={{ ...serif, margin: '0 0 8px', fontSize: 21 }}>{p.baslik}</p>}
          <p style={{ margin: 0, whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: 16 }}>{p.metin}</p>
        </motion.div>
      ))}
      {role === 'host' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input value={newPoem.baslik} onChange={(e) => setNewPoem({ ...newPoem, baslik: e.target.value.slice(0, 60) })} placeholder="Yeni şiirin başlığı" style={{ ...field, minHeight: 44 }} />
          <textarea value={newPoem.metin} onChange={(e) => setNewPoem({ ...newPoem, metin: e.target.value.slice(0, 3000) })} rows={3} placeholder="Şiir…" style={{ ...field, resize: 'vertical', lineHeight: 1.6 }} />
          <button type="button" onClick={addPoem} style={ghostBtn}>+ Ekle ve ona gönder</button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', color: '#F6EFDD', fontFamily: "'Noto Sans', sans-serif", position: 'relative' }}>
      <style>{'.oda-yt iframe{width:100%;height:100%;border:0;display:block}'}</style>
      <Backdrop dim={showRemote || (mode === 'video' && !!file) || (mode === 'yt' && !!vid)} />
      <Hearts list={hearts} />
      <audio ref={aMic} autoPlay playsInline />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: wide ? 1320 : 760, margin: '0 auto', padding: wide ? '20px 28px 40px' : '14px 12px 120px', display: 'grid', gridTemplateColumns: wide ? 'minmax(0, 1fr) 360px' : '1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {/* başlık */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <p style={{ ...serif, margin: 0, fontSize: 26, color: '#FFE3A3', whiteSpace: 'nowrap' }}>{initial(benimAd)}<span style={{ color: '#F7A8B8', margin: '0 6px', fontSize: 20 }}>♥</span>{initial(onunAd)}</p>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ ...serif, margin: 0, fontSize: 20, color: '#FFE9B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(room && room.ad) || 'Düş Bahçesi'}</p>
              <p style={{ margin: 0, fontSize: 13, color: bagli ? '#9FE3C8' : '#BDB6D8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <motion.span animate={{ opacity: bagli ? 1 : [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: bagli ? 0 : Infinity }} style={{ width: 8, height: 8, borderRadius: 4, background: bagli ? '#7FD1B0' : '#FFD27A', display: 'inline-block' }} />
                {statusText(st, role, onunAd, benimAd)}
              </p>
            </div>
            {role === 'host' && <button type="button" onClick={invite} style={{ ...ghostBtn, display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px' }}><Link2 size={16} /> {wide ? 'Davet et' : ''}</button>}
          </div>
          <Lanterns benim={benimAd} onun={onunAd || '…'} onunVar={bagli} bagli={bagli} durum={bagli ? 'aynı gecedesiniz' : ''} />
          {room && room.cumle && <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#E9E2FF', margin: 0, ...serif, fontWeight: 400, fontSize: 18 }}>“{room.cumle}”</p>}

          {/* kipler */}
          <div style={{ ...glass, padding: 5, borderRadius: 28, display: 'flex', gap: 4 }}>
            {tab('yt', 'YouTube', Tv)}{tab('video', 'Video', Film)}{tab('ekran', 'Ekran', MonitorUp)}
          </div>

          {/* SAHNE */}
          <div ref={stage} style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: wide ? 30 : 24, overflow: 'hidden', background: '#04030A', boxShadow: '0 40px 80px -40px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,233,184,0.10)' }}>
            <video ref={vStage} autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000', opacity: showRemote ? 1 : 0, pointerEvents: showRemote ? 'auto' : 'none', transition: 'opacity .5s' }} />
            <div style={{ position: 'absolute', inset: 0, visibility: !showRemote && mode === 'yt' ? 'visible' : 'hidden' }}>
              <YTStage ref={yt} vid={vid} onLocal={(a, time) => send({ t: 'yt', a, time })} onBlocked={() => setNeedTap(true)} />
              {!vid && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'radial-gradient(ellipse at center, #1A1640 0%, #05040C 80%)', textAlign: 'center', padding: 20 }}>
                <Tv size={38} color="#FFE3A3" /><p style={{ margin: 0, color: '#BDB6D8', maxWidth: 380 }}>Aşağıya bir YouTube bağlantısı yapıştır; ikinizde aynı anda açılır, oynat ve durdur birlikte çalışır.</p></div>}
            </div>
            {!showRemote && mode === 'video' && file && (
              <video ref={vLocal} src={file.url} controls playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                onPlaying={onLocalPlaying}
                onLoadedMetadata={(e) => send({ t: 'dosya', ad: file.ad, sure: e.currentTarget.duration })}
                onPlay={(e) => { if (kind === 'ayni' && !isQuiet()) send({ t: 'izle', a: 'play', time: e.currentTarget.currentTime }); }}
                onPause={(e) => { if (kind === 'ayni' && !isQuiet()) send({ t: 'izle', a: 'pause', time: e.currentTarget.currentTime }); }}
                onSeeked={(e) => { if (kind === 'ayni' && !isQuiet()) send({ t: 'izle', a: e.currentTarget.paused ? 'pause' : 'play', time: e.currentTarget.currentTime }); }} />
            )}
            {!showRemote && ((mode === 'video' && !file) || mode === 'ekran') && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'radial-gradient(ellipse at center, #1A1640 0%, #05040C 80%)', textAlign: 'center', padding: 20 }}>
                <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} style={{ fontSize: 42 }}>🌙</motion.div>
                <p style={{ margin: 0, color: '#BDB6D8', maxWidth: 400, lineHeight: 1.5 }}>
                  {mode === 'ekran' ? (sharing ? 'Ekranını paylaşıyorsun; o şu an senin ekranını görüyor.' : canShareScreen() ? 'Ekranını paylaştığında burada onda görünür.' : 'Telefon ve tablet ekran paylaşamaz; o paylaşınca burada izlersin.') : 'Bir video seç. İstersen ona yayınlarsın, istersen ikinizde de olan dosyayı birlikte oynatırsınız.'}
                </p>
              </div>
            )}
            {showRemote && remoteLive.kind === 'video' && (
              <div style={{ position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)', display: 'flex', gap: 8, padding: 6, borderRadius: 999, background: 'rgba(10,8,24,0.7)', backdropFilter: 'blur(8px)' }}>
                {[['geri', RotateCcw, '10 sn geri'], ['play', Play, 'Oynat'], ['pause', Pause, 'Durdur'], ['ileri', RotateCw, '10 sn ileri']].map(([a, I, l]) => <button key={a} type="button" aria-label={l} onClick={() => send({ t: 'uzak', a })} style={{ ...ctl(false), width: 44, height: 44 }}><I size={18} /></button>)}
              </div>
            )}
            {showRemote && <p style={{ position: 'absolute', left: 14, top: 12, margin: 0, padding: '5px 12px', borderRadius: 14, background: 'rgba(10,8,24,0.65)', fontSize: 12, color: '#FFE3A3' }}>{remoteLive.kind === 'ekran' ? `${onunAd} ekranını paylaşıyor` : `${onunAd} yayınlıyor${remoteLive.ad ? ` · ${remoteLive.ad}` : ''}`}</p>}
            <button type="button" onClick={fullscreen} aria-label="Tam ekran" style={{ position: 'absolute', right: 12, top: 10, width: 40, height: 40, borderRadius: 20, border: 'none', background: 'rgba(10,8,24,0.55)', color: '#F6EFDD', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Maximize2 size={17} /></button>
            {needTap && <button type="button" onClick={tapResume} style={{ ...goldBtn, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 8 }}><Volume2 size={18} /> Dokun, katıl</button>}
          </div>

          {/* kip paneli */}
          {mode === 'yt' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={link} onChange={(e) => setLink(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && openYT()} placeholder="YouTube bağlantısı yapıştır" style={{ ...field, flex: 1 }} inputMode="url" />
              <button type="button" onClick={openYT} disabled={!link.trim()} style={{ ...goldBtn, opacity: link.trim() ? 1 : 0.5, padding: '0 20px' }}>Birlikte aç</button>
            </div>
          )}
          {mode === 'video' && !showRemote && (
            <div style={{ ...glass, display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {canStreamFile() && <button type="button" onClick={() => setKind('yayin')} aria-pressed={kind === 'yayin'} style={{ ...ghostBtn, flex: 1, background: kind === 'yayin' ? 'rgba(255,227,163,0.18)' : ghostBtn.background, color: kind === 'yayin' ? '#FFE3A3' : '#F6EFDD' }}>Ona yayınla</button>}
                <button type="button" onClick={() => setKind('ayni')} aria-pressed={kind === 'ayni'} style={{ ...ghostBtn, flex: 1, background: kind === 'ayni' ? 'rgba(255,227,163,0.18)' : ghostBtn.background, color: kind === 'ayni' ? '#FFE3A3' : '#F6EFDD' }}>İkimizde de var</button>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#BDB6D8', lineHeight: 1.5 }}>{kind === 'yayin' ? 'Dosya sende; görüntü ve ses ona akar. O, kendi ekranından durdurup sarabilir.' : 'Aynı dosyayı ikiniz de açın. Film internetten gitmez, en akıcı yol budur.'}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <label style={{ ...goldBtn, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Film size={18} /> {file ? 'Başka video seç' : 'Video seç'}<input type="file" accept="video/*" onChange={(e) => { pickFile(e.target.files && e.target.files[0]); e.target.value = ''; }} style={{ display: 'none' }} /></label>
                {file && <button type="button" onClick={stopFile} aria-label="Videoyu kapat" style={{ ...ghostBtn, width: 54, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>}
              </div>
              {kind === 'ayni' && file && peerFile && <p style={{ margin: 0, fontSize: 13, color: ayni ? '#9FE3C8' : '#F7A8B8' }}>{ayni ? '✓ İkiniz de aynı dosyayı açtınız.' : `Onda başka bir dosya açık: ${peerFile.ad}`}</p>}
            </div>
          )}
          {mode === 'ekran' && canShareScreen() && (
            <button type="button" onClick={toggleScreen} disabled={!bagli} style={{ ...goldBtn, opacity: bagli ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><MonitorUp size={18} /> {sharing ? 'Paylaşımı durdur' : 'Ekranını paylaş'}</button>
          )}
          {mode === 'ekran' && <p style={{ margin: 0, fontSize: 13, color: '#8F8AAE', lineHeight: 1.5 }}>Sekme sesini de göndermek için paylaşırken “Sekme sesini paylaş” kutusunu işaretle. Netflix gibi korumalı yayınlar paylaşımda siyah görünür.</p>}
        </div>

        {/* geniş ekran: yan panel */}
        {wide && (
          <div style={{ ...glass, display: 'flex', flexDirection: 'column', gap: 12, height: 'calc(100vh - 60px)', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingBottom: 4 }}>{controls}</div>
            <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 22, background: 'rgba(255,255,255,0.05)' }}>
              {[['sohbet', 'Sohbet'], ['siir', 'Şiir köşesi']].map(([k, l]) => <button key={k} type="button" onClick={() => setPanel(k)} style={{ flex: 1, minHeight: 40, borderRadius: 18, border: 'none', fontWeight: 700, background: (panel || 'sohbet') === k ? 'rgba(255,227,163,0.18)' : 'transparent', color: (panel || 'sohbet') === k ? '#FFE3A3' : '#BDB6D8', cursor: 'pointer' }}>{l}</button>)}
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>{(panel || 'sohbet') === 'sohbet' ? chatBox : poemBox}</div>
          </div>
        )}
      </div>

      {/* alt kontrol kapsülü (dar ekran) */}
      {!wide && (
        <div style={{ position: 'fixed', insetInline: 0, bottom: 'max(14px, env(safe-area-inset-bottom))', zIndex: 30, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ pointerEvents: 'auto', display: 'flex', gap: 8, padding: 7, borderRadius: 999, background: 'rgba(16,13,40,0.82)', border: '1px solid rgba(255,233,184,0.16)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)' }}>
            {controls}
          </motion.div>
        </div>
      )}

      {/* dar ekran: alt sayfa */}
      <AnimatePresence>
        {!wide && panel && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            style={{ ...glass, position: 'fixed', zIndex: 35, insetInline: 10, bottom: 'calc(max(14px, env(safe-area-inset-bottom)) + 76px)', maxWidth: 560, margin: '0 auto', height: '52vh', display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ ...serif, margin: 0, fontSize: 20, color: '#FFE9B8' }}>{panel === 'sohbet' ? 'Sohbet' : 'Şiir köşesi'}</p>
              <button type="button" onClick={() => setPanel(null)} aria-label="Kapat" style={{ ...ghostBtn, width: 40, minHeight: 40, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>{panel === 'sohbet' ? chatBox : poemBox}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && <motion.p role="status" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ ...glass, position: 'fixed', top: 14, insetInline: 0, width: 'fit-content', maxWidth: '90vw', zIndex: 60, padding: '10px 18px', margin: '0 auto', fontSize: 14, borderRadius: 20 }}>{toast}</motion.p>}</AnimatePresence>
    </div>
  );
}
