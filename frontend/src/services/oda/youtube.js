// YouTube'u birlikte izleme: resmi IFrame API'si (video YouTube'dan oynar; biz yalnız oynat/durdur/sar'ı eşleriz).
let loading = null;
export function loadYT() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(window.YT); };
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; s.async = true;
    s.onerror = () => { loading = null; reject(new Error('YouTube yüklenemedi')); };
    document.head.appendChild(s);
  });
  return loading;
}
/** youtu.be/ID · youtube.com/watch?v=ID · /shorts/ID · /embed/ID · /live/ID ya da çıplak 11 karakter */
export function parseYouTube(text) {
  const t = String(text || '').trim();
  if (/^[\w-]{11}$/.test(t)) return t;
  const m = t.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}
