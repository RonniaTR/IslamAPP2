import { useState, useEffect } from 'react';

export function usePrayerTimes() {
  const [timings, setTimings] = useState(null);
  const [city, setCity] = useState('İstanbul');
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('00:00:00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async (lat, lon) => {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=13`);
        const data = await res.json();
        if (data && data.data) {
          setTimings(data.data.timings);
          calculateNextPrayer(data.data.timings);
        }
      } catch (err) {
        console.error("Ezan vakitleri alınamadı", err);
      } finally {
        setLoading(false);
      }
    };

    // Attempt geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCity('Konumunuz'); // Geocoding could be added here
          fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Fallback to Istanbul
          fetchPrayerTimes(41.0082, 28.9784);
        }
      );
    } else {
      fetchPrayerTimes(41.0082, 28.9784);
    }
  }, []);

  const calculateNextPrayer = (times) => {
    if (!times) return;
    const now = new Date();
    const currentMs = now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000;
    
    const prayers = [
      { name: 'İmsak', time: times.Fajr },
      { name: 'Güneş', time: times.Sunrise },
      { name: 'Öğle', time: times.Dhuhr },
      { name: 'İkindi', time: times.Asr },
      { name: 'Akşam', time: times.Maghrib },
      { name: 'Yatsı', time: times.Isha }
    ];

    let next = null;
    let nextMs = 0;

    for (let p of prayers) {
      const [h, m] = p.time.split(':');
      const pMs = parseInt(h) * 3600000 + parseInt(m) * 60000;
      if (pMs > currentMs) {
        next = p;
        nextMs = pMs;
        break;
      }
    }

    // If no next prayer today, it's Fajr tomorrow
    if (!next) {
      const [h, m] = prayers[0].time.split(':');
      next = { name: 'İmsak (Yarın)', time: prayers[0].time };
      nextMs = (parseInt(h) + 24) * 3600000 + parseInt(m) * 60000;
    }

    setNextPrayer(next);
    startCountdown(currentMs, nextMs);
  };

  const startCountdown = (currentMs, nextMs) => {
    let diff = nextMs - currentMs;

    const tick = () => {
      if (diff <= 0) {
        // Refresh when time is up
        window.location.reload();
        return;
      }
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setCountdown(`${h}:${m}:${s}`);
      diff -= 1000;
    };

    tick();
    setInterval(tick, 1000);
  };

  return { timings, city, nextPrayer, countdown, loading };
}
