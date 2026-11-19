import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { loadYT } from '../../services/oda/youtube';

// YouTube sahnesi. Video YouTube'dan oynar (telif YouTube'un kendi oynatıcısında kalır); biz yalnız eşleriz.
// Dışarıya: load(id) · play(t) · pause(t) · time() · playing()
// onLocal(a, time): kullanıcı burada oynat/durdur yaptığında (karşıdan gelen komutlarda çağrılmaz).
const YTStage = forwardRef(function YTStage({ vid, onLocal, onBlocked }, ref) {
  const host = useRef(null); const player = useRef(null); const ready = useRef(false);
  const applying = useRef(0); const pending = useRef(null); const lastState = useRef(-1);
  const [err, setErr] = useState('');

  useEffect(() => {
    let off = false;
    loadYT().then((YT) => {
      if (off || !host.current) return;
      const div = document.createElement('div'); host.current.appendChild(div);
      player.current = new YT.Player(div, {
        width: '100%', height: '100%', videoId: vid || undefined,
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, controls: 1, iv_load_policy: 3 },
        events: {
          onReady: () => { ready.current = true; if (pending.current) { const p = pending.current; pending.current = null; p(); } },
          onStateChange: (e) => {
            const s = e.data; const prev = lastState.current; lastState.current = s;
            if (Date.now() < applying.current) return;
            const t = player.current.getCurrentTime();
            if (s === 1 && prev !== 1) onLocal && onLocal('play', t);
            if (s === 2) onLocal && onLocal('pause', t);
          },
          onError: () => setErr('Bu video yerleştirmeye kapalı ya da bulunamadı. Başka bir bağlantı dene.'),
        },
      });
    }).catch(() => setErr('YouTube yüklenemedi; internet bağlantını kontrol et.'));
    return () => { off = true; try { player.current && player.current.destroy(); } catch { /* yok */ } player.current = null; ready.current = false; };
  }, []);

  const whenReady = (fn) => { if (ready.current && player.current) fn(); else pending.current = fn; };
  const quiet = (ms = 900) => { applying.current = Date.now() + ms; };

  useImperativeHandle(ref, () => ({
    load(id) { setErr(''); whenReady(() => { quiet(1500); player.current.cueVideoById(id); }); },
    play(t) {
      whenReady(() => {
        quiet();
        if (typeof t === 'number' && Math.abs(player.current.getCurrentTime() - t) > 1) player.current.seekTo(t, true);
        player.current.playVideo();
        setTimeout(() => { if (player.current && player.current.getPlayerState() !== 1 && onBlocked) onBlocked(); }, 1600);
      });
    },
    pause(t) { whenReady(() => { quiet(); player.current.pauseVideo(); if (typeof t === 'number') player.current.seekTo(t, true); }); },
    drift(t) { whenReady(() => { if (player.current.getPlayerState() === 1 && Math.abs(player.current.getCurrentTime() - t) > 1.2) { quiet(); player.current.seekTo(t, true); } }); },
    time() { return player.current && ready.current ? player.current.getCurrentTime() : 0; },
    playing() { return !!(player.current && ready.current && player.current.getPlayerState() === 1); },
    resume() { whenReady(() => { quiet(); player.current.playVideo(); }); },
  }));

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={host} style={{ position: 'absolute', inset: 0 }} className="oda-yt" />
      {err && <p style={{ position: 'absolute', left: 16, right: 16, bottom: 16, margin: 0, padding: '10px 14px', borderRadius: 14, background: 'rgba(20,16,48,0.85)', color: '#F7A8B8', fontSize: 14 }}>{err}</p>}
    </div>
  );
});
export default YTStage;
