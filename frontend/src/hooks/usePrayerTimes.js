import { useState, useEffect } from 'react';

export const TURKISH_CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

export function usePrayerTimes() {
  const [timings, setTimings] = useState(null);
  const [city, setCityState] = useState(() => localStorage.getItem('islamapp_city') || 'İstanbul');
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('00:00:00');
  const [loading, setLoading] = useState(true);

  // Interval ID ref (simulated with a let variable for hooks)
  const [timerInterval, setTimerInterval] = useState(null);

  const fetchPrayerTimesByCity = async (cityName) => {
    setLoading(true);
    try {
      // Format city name for URL (e.g. İstanbul -> istanbul)
      const encodedCity = encodeURIComponent(cityName);
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodedCity}&country=Turkey&method=13`);
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

  useEffect(() => {
    fetchPrayerTimesByCity(city);
    // Cleanup interval on unmount
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, []);

  const changeCity = (newCity) => {
    setCityState(newCity);
    localStorage.setItem('islamapp_city', newCity);
    if (timerInterval) clearInterval(timerInterval);
    fetchPrayerTimesByCity(newCity);
  };

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
        fetchPrayerTimesByCity(city); // Refetch if time is up
        return;
      }
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setCountdown(`${h}:${m}:${s}`);
      diff -= 1000;
    };

    tick();
    const id = setInterval(tick, 1000);
    setTimerInterval(id);
  };

  return { timings, city, changeCity, nextPrayer, countdown, loading };
}
