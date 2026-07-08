import { useState, useCallback, useRef } from 'react';
import api from '../api';

// ─── TTS Hook (paylaşılan) ───
// Önce backend Edge-TTS (doğal Türkçe ses) denenir; başarısız olursa
// tarayıcının yerleşik Web Speech API'sine (çevrimdışı/anlık) düşülür.
export function useTTS() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  }, []);

  const fallbackSpeak = useCallback((text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) { setPlaying(false); return false; }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'tr-TR';
      u.rate = 0.95;
      u.onend = () => setPlaying(false);
      u.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(u);
      setPlaying(true);
      return true;
    } catch { setPlaying(false); return false; }
  }, []);

  const speak = useCallback(async (text) => {
    if (playing) { stop(); return; }
    if (!text) return;
    setLoading(true);
    try {
      const { data } = await api.post('/tts', { text });
      if (data && data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audioRef.current = audio;
        audio.onended = () => { setPlaying(false); audioRef.current = null; };
        audio.onerror = () => { audioRef.current = null; fallbackSpeak(text); };
        await audio.play();
        setPlaying(true);
        setLoading(false);
        return;
      }
      throw new Error('empty audio');
    } catch {
      // Backend TTS erişilemedi → tarayıcı sesine düş
      setLoading(false);
      fallbackSpeak(text);
    }
  }, [playing, stop, fallbackSpeak]);

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
