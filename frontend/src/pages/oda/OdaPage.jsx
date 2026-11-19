import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, MonitorUp, MonitorX, Film, Heart, MessageCircle, Feather, Link2, Volume2 } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { me, joinRoom, connect, canShareScreen, resetRoom } from '../../services/oda/rtc';
import { Backdrop, Lanterns, Hearts } from './DusBahcesi';
import OdaKur, { OdaKatil, card, goldBtn, field } from './OdaKur';

// 🎬 ODA — /oda (kur) · /oda/:id (gir). Uygulamanın menülerinde YOKTUR; yalnız bağlantıyla açılır.
// İki kip: "Ekran" (biri ekranını paylaşır) ve "Birlikte izle" (ikiniz aynı dosyayı açarsınız, komutlar eşlenir).
const DURUM = { baglaniyor: 'bağlanıyor…', bagli: 'birliktesiniz', koptu: 'bağlantı koptu', basarisiz: 'bağlanamadı', bekliyor: 'bekleniyor…' };
const EMOJI = ['❤️', '🌙', '✨', '🌸'];

export default function OdaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uid, setUid] = useState(null);
  const [oda, setOda] = useState(null);
  const [view, setView] = useState('yukleniyor'); // yukleniyor | kur | katil | oda | dolu | yok
  const [err, setErr] = useState('');
  const [durum, setDurum] = useState('bekliyor');
  const [remote, setRemote] = useState(null);
  const [karsiEkran, setKarsiEkran] = useState(false);
  const [benimEkran, setBenimEkran] = useState(false);
  const [mic, setMicOn] = useState(false);
  const [mode, setMode] = useState('ekran');
  const [film, setFilm] = useState(null);       // { url, ad, sure }
  const [karsiFilm, setKarsiFilm] = useState(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState('');
  const [panel, setPanel] = useState(null);     // sohbet | kose
  const [hearts, setHearts] = useState([]);
  const [needTap, setNeedTap] = useState(false);
  const conn = useRef(null);
  const vRemote = useRef(null); const aRemote = useRef(null); const vFilm = useRef(null);
  const applying = useRef(false); const hid = useRef(0);

  const heart = useCallback((e, mine) => { const k = ++hid.current; setHearts((h) => [...h, { id: k, e, mine, dx: (Math.random() - 0.5) * 80 }]); setTimeout(() => setHearts((h) => h.filter((x) => x.id !== k)), 2700); }, []);

  const applyRemote = useCallback((fn) => { applying.current = true; try { fn(); } finally { setTimeout(() => { applying.current = false; }, 350); } }, []);
  const onMessage = useCallback((m) => {
    if (m.t === 'chat') setChat((c) => [...c.slice(-80), { me: false, m: m.m, at: Date.now() }]);
    if (m.t === 'kalp') heart(m.e || '❤️', false);
    if (m.t === 'durum') setKarsiEkran(!!m.ekran);
    if (m.t === 'dosya') setKarsiFilm({ ad: m.ad, sure: m.sure });
    const v = vFilm.current;
    if (m.t === 'izle' && v) applyRemote(() => {
      if (typeof m.time === 'number' && Math.abs(v.currentTime - m.time) > 0.4) v.currentTime = m.time;
      if (m.a === 'play') v.play().catch(() => setNeedTap(true));
      if (m.a === 'pause') v.pause();
    });
    if (m.t === 'saat' && v && !v.paused && Math.abs(v.currentTime - m.time) > 0.7) applyRemote(() => { v.currentTime = m.time; });
  }, [applyRemote, heart]);

  // başlangıç: kimlik, oda durumu
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const u = await me(); if (off) return; setUid(u.uid);
        if (!id) { setView('kur'); return; }
        const s = await getDoc(doc(db, 'odalar', id));
        if (!s.exists()) { setView('yok'); return; }
        const d = { id, ...s.data() }; setOda(d);
        setView(d.uyeler.includes(u.uid) ? 'oda' : d.uyeler.length < 2 ? 'katil' : 'dolu');
      } catch (e) { setErr('Firebase’e bağlanılamadı (Anonim giriş açık mı?).'); setView('yok'); }
    })();
    return () => { off = true; };
  }, [id]);

  // odaya girildi: bağlan
  useEffect(() => {
    if (view !== 'oda' || !uid || !id) return undefined;
    const c = connect(id, uid, { onState: setDurum, onRemote: setRemote, onMessage, onRoom: setOda });
    conn.current = c;
    return () => { c.close(); conn.current = null; };
  }, [view, uid, id, onMessage]);

  useEffect(() => {
    if (!remote) return;
    if (vRemote.current) vRemote.current.srcObject = remote.screen;
    if (aRemote.current) { aRemote.current.srcObject = remote.mic; aRemote.current.play().catch(() => setNeedTap(true)); }
  }, [remote]);

  // birlikte izle: oda sahibi saat tutar
  useEffect(() => {
    if (mode !== 'izle' || !oda || oda.sahip !== uid) return undefined;
    const t = setInterval(() => { const v = vFilm.current; if (v && !v.paused && conn.current) conn.current.send({ t: 'saat', time: v.currentTime }); }, 4000);
    return () => clearInterval(t);
  }, [mode, oda, uid]);

  const join = async (ad) => {
    try { const r = await joinRoom(id, ad); setOda(r.oda); setView('oda'); } catch (e) { setErr(e.message === 'Oda dolu' ? 'Bu oda dolu.' : 'Odaya girilemedi.'); }
  };
  const toggleScreen = async () => {
    try { if (benimEkran) { await conn.current.stopScreen(); setBenimEkran(false); } else { const s = await conn.current.startScreen(); setBenimEkran(true); setMode('ekran'); s.getVideoTracks()[0].addEventListener('ended', () => setBenimEkran(false)); } }
    catch { /* kullanıcı vazgeçti */ }
  };
  const toggleMic = async () => { try { setMicOn(await conn.current.setMic(!mic)); } catch { setErr('Mikrofon izni verilmedi.'); } };
  const pickFilm = (f) => { if (!f) return; if (film) URL.revokeObjectURL(film.url); setFilm({ url: URL.createObjectURL(f), ad: f.name }); setMode('izle'); };
  const sendFilmCmd = (a) => { const v = vFilm.current; if (!v || applying.current || !conn.current) return; conn.current.send({ t: 'izle', a, time: v.currentTime }); };
  const sendChat = () => { const m = msg.trim(); if (!m || !conn.current) return; conn.current.send({ t: 'chat', m }); setChat((c) => [...c.slice(-80), { me: true, m, at: Date.now() }]); setMsg(''); };
  const sendHeart = (e) => { if (conn.current) conn.current.send({ t: 'kalp', e }); heart(e, true); };
  const link = id ? `${window.location.origin}/oda/${id}` : '';
  const share = async () => { try { if (navigator.share) await navigator.share({ title: oda?.ad || 'Oda', text: 'Odama gel', url: link }); else { await navigator.clipboard.writeText(link); setErr('Bağlantı kopyalandı.'); } } catch { /* vazgeçti */ } };

  const isimler = oda?.isimler || {};
  const benimAd = isimler[uid] || 'Ben';
  const onunUid = (oda?.uyeler || []).find((x) => x !== uid);
  const onunAd = onunUid ? isimler[onunUid] : (oda?.davetli || 'Bekleniyor');
  const bagli = durum === 'bagli';
  const ayniFilm = film && karsiFilm && (film.ad === karsiFilm.ad || (film.sure && Math.abs(film.sure - karsiFilm.sure) < 2));
  const ctl = (on) => ({ width: 56, height: 56, borderRadius: 28, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#FFD27A' : 'rgba(255,255,255,0.1)', color: on ? '#2A1E05' : '#F6EFDD', cursor: 'pointer', flex: 'none' });

  return (
    <div style={{ minHeight: '100vh', color: '#F6EFDD', fontFamily: "'Noto Sans', sans-serif", position: 'relative' }}>
      <Backdrop dim={karsiEkran || (mode === 'izle' && !!film)} />
      <Hearts list={hearts} />
      <audio ref={aRemote} autoPlay />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 980, margin: '0 auto', padding: '18px 16px 120px' }}>
        {view === 'yukleniyor' && <p style={{ textAlign: 'center', marginTop: 80, color: '#BDB6D8' }}>Bahçe hazırlanıyor…</p>}
        {view === 'kur' && <OdaKur onCreated={(rid) => navigate(`/oda/${rid}`, { replace: true })} />}
        {view === 'katil' && oda && <OdaKatil oda={oda} onJoin={join} err={err} />}
        {(view === 'dolu' || view === 'yok') && (
          <div style={{ ...card, marginTop: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 20, margin: 0 }}>{view === 'dolu' ? 'Bu oda dolu.' : (err || 'Böyle bir oda yok.')}</p>
            <button type="button" onClick={() => navigate('/oda')} style={{ ...goldBtn, marginTop: 14 }}>Yeni oda kur</button>
          </div>
        )}

        {view === 'oda' && oda && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: 26, fontWeight: 600, margin: 0, color: '#FFE9B8' }}>{oda.ad}</h1>
              <button type="button" onClick={share} style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 40, padding: '0 14px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', color: '#F6EFDD', border: 'none' }}><Link2 size={16} /> Davet et</button>
            </div>
            <Lanterns benim={benimAd} onun={onunAd} onunVar={!!onunUid} bagli={bagli} durum={onunUid ? DURUM[durum] : 'bağlantıyı gönder, ışığı yansın'} />
            {oda.cumle && <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#E9E2FF', margin: '10px 0 0' }}>“{oda.cumle}”</p>}

            {/* SAHNE */}
            <div style={{ marginTop: 16, borderRadius: 26, overflow: 'hidden', position: 'relative', background: '#05040C', aspectRatio: '16 / 9', boxShadow: '0 30px 60px -30px rgba(0,0,0,0.9)', border: '1px solid rgba(255,233,184,0.12)' }}>
              <video ref={vRemote} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'contain', display: mode === 'ekran' && karsiEkran ? 'block' : 'none' }} />
              {mode === 'izle' && film && (
                <video ref={vFilm} src={film.url} controls playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onLoadedMetadata={(e) => { const sure = e.currentTarget.duration; setFilm((f) => ({ ...f, sure })); if (conn.current) conn.current.send({ t: 'dosya', ad: film.ad, sure }); }}
                  onPlay={() => sendFilmCmd('play')} onPause={() => sendFilmCmd('pause')} onSeeked={() => sendFilmCmd('seek')} />
              )}
              {!(mode === 'ekran' && karsiEkran) && !(mode === 'izle' && film) && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20, textAlign: 'center' }}>
                  <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} style={{ fontSize: 40 }}>🌙</motion.div>
                  <p style={{ margin: 0, color: '#BDB6D8', fontSize: 15, maxWidth: 420 }}>
                    {benimEkran ? 'Ekranını paylaşıyorsun. Karşı taraf onu burada görüyor.' : mode === 'izle' ? 'Aynı filmi ikiniz de kendi cihazınızda seçin; oynat, durdur ve sar birlikte çalışır.' : 'Biriniz ekranını paylaşınca burada görünür.'}
                  </p>
                </div>
              )}
              {needTap && <button type="button" onClick={() => { setNeedTap(false); aRemote.current && aRemote.current.play(); vFilm.current && vFilm.current.play(); }} style={{ ...goldBtn, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 8 }}><Volume2 size={18} /> Sesi aç</button>}
            </div>
            {mode === 'izle' && film && karsiFilm && (
              <p style={{ margin: '8px 4px 0', fontSize: 13, color: ayniFilm ? '#9FE3C8' : '#F7A8B8' }}>{ayniFilm ? '✓ İkiniz de aynı filmi açtınız.' : `Karşı tarafta başka bir dosya açık: ${karsiFilm.ad}`}</p>
            )}
            {!canShareScreen() && <p style={{ margin: '8px 4px 0', fontSize: 13, color: '#BDB6D8' }}>Bu cihaz ekran paylaşamaz (telefon tarayıcıları izin vermez); paylaşılan ekranı izleyebilir ya da “Birlikte izle”yi kullanabilirsin.</p>}
          </>
        )}
      </div>

      {view === 'oda' && oda && (
        <>
          {/* KONTROLLER */}
          <div style={{ position: 'fixed', insetInline: 0, bottom: 'max(14px, env(safe-area-inset-bottom))', zIndex: 30, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto', display: 'flex', gap: 8, padding: 8, borderRadius: 999, background: 'rgba(18,15,46,0.85)', border: '1px solid rgba(255,233,184,0.16)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', overflowX: 'auto', maxWidth: 'calc(100% - 20px)' }}>
              <button type="button" onClick={toggleMic} aria-label={mic ? 'Mikrofonu kapat' : 'Mikrofonu aç'} style={ctl(mic)} disabled={!bagli}>{mic ? <Mic size={22} /> : <MicOff size={22} />}</button>
              {canShareScreen() && <button type="button" onClick={toggleScreen} aria-label={benimEkran ? 'Paylaşımı durdur' : 'Ekranını paylaş'} style={ctl(benimEkran)} disabled={!bagli}>{benimEkran ? <MonitorX size={22} /> : <MonitorUp size={22} />}</button>}
              <label aria-label="Birlikte izle: film seç" style={{ ...ctl(mode === 'izle'), cursor: 'pointer' }}><Film size={22} /><input type="file" accept="video/*" onChange={(e) => pickFilm(e.target.files && e.target.files[0])} style={{ display: 'none' }} /></label>
              {EMOJI.slice(0, 2).map((e) => <button key={e} type="button" onClick={() => sendHeart(e)} aria-label="Kalp gönder" style={{ ...ctl(false), fontSize: 22 }} disabled={!bagli}>{e === '❤️' ? <Heart size={22} color="#F7A8B8" fill="#F7A8B8" /> : e}</button>)}
              <button type="button" onClick={() => setPanel(panel === 'sohbet' ? null : 'sohbet')} aria-label="Sohbet" style={ctl(panel === 'sohbet')}><MessageCircle size={22} /></button>
              <button type="button" onClick={() => setPanel(panel === 'kose' ? null : 'kose')} aria-label="Şiir köşesi" style={ctl(panel === 'kose')}><Feather size={22} /></button>
            </div>
          </div>

          {/* PANELLER */}
          <AnimatePresence>
            {panel && (
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                style={{ ...card, position: 'fixed', zIndex: 35, insetInline: 12, bottom: 96, maxWidth: 520, margin: '0 auto', maxHeight: '55vh', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {panel === 'sohbet' ? (
                  <>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 120 }}>
                      {chat.length === 0 && <p style={{ margin: 0, color: '#9C98B8', fontSize: 14 }}>Mesajlar yalnız ikinizin cihazında görünür ve odadan çıkınca silinir.</p>}
                      {chat.map((c) => <p key={c.at + c.m} style={{ margin: 0, alignSelf: c.me ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: '8px 12px', borderRadius: 16, background: c.me ? 'rgba(255,210,122,0.2)' : 'rgba(200,182,255,0.16)', fontSize: 15 }}>{c.m}</p>)}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={msg} onChange={(e) => setMsg(e.target.value.slice(0, 500))} onKeyDown={(e) => e.key === 'Enter' && sendChat()} placeholder={bagli ? 'Yaz…' : 'Bağlantı bekleniyor'} disabled={!bagli} style={{ ...field, flex: 1 }} />
                      <button type="button" onClick={sendChat} disabled={!bagli} style={{ ...goldBtn, minHeight: 50, padding: '0 18px' }}>Gönder</button>
                    </div>
                  </>
                ) : (
                  <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#FFE9B8' }}>Şiir köşesi</p>
                    {(oda.siirler || []).length === 0 && <p style={{ margin: 0, color: '#9C98B8', fontSize: 14 }}>Henüz şiir yok. Odayı kuran, oda kurarken ekleyebilir.</p>}
                    {(oda.siirler || []).map((s, i) => (
                      <div key={i} style={{ padding: 14, borderRadius: 18, background: '#FBF8F0', color: '#2A2440' }}>
                        {s.baslik && <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-heading, Georgia, serif)', fontSize: 20, fontWeight: 600 }}>{s.baslik}</p>}
                        <p style={{ margin: 0, whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: 16 }}>{s.metin}</p>
                      </div>
                    ))}
                    {oda.sahip === uid && <button type="button" onClick={async () => { await resetRoom(id, uid); setErr('Oda boşaltıldı; yeni bağlantıyla tekrar davet edebilirsin.'); }} style={{ ...goldBtn, background: 'rgba(255,255,255,0.08)', color: '#F6EFDD', minHeight: 44 }}>Odayı boşalt (yeniden davet için)</button>}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {err && view === 'oda' && <p role="status" onClick={() => setErr('')} style={{ position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 50, ...card, padding: '10px 16px', margin: 0, fontSize: 14 }}>{err}</p>}
        </>
      )}
    </div>
  );
}
