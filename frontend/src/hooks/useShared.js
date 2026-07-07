import { useState, useCallback, useRef } from 'react';
import api from '../api';

// ─── TTS Hook (paylaşılan) ───
export function useTTS() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const speak = useCallback(async (text) => {
    if (playing && audioRef.current) { audioRef.current.pause(); audioRef.current = null; setPlaying(false); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/tts', { text });
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      audioRef.current = audio;
      audio.onended = () => { setPlaying(false); audioRef.current = null; };
      audio.onerror = () => { setPlaying(false); audioRef.current = null; };
      await audio.play();
      setPlaying(true);
    } catch { setPlaying(false); }
    setLoading(false);
  }, [playing]);

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlaying(false);
  }, []);

  return { speak, stop, playing, loading };
}

// ─── Share / Copy Helper ───
export function shareOrCopy(title, text) {
  const full = `${title}\n\n${text}\n\n— İslami Yaşam Asistanı`;
  if (navigator.share) {
    navigator.share({ title, text: full }).catch(() => {});
  } else {
    navigator.clipboard.writeText(full).catch(() => {});
  }
}
