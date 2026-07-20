import axios from 'axios';

const prayerApi = axios.create({
  baseURL: 'https://api.aladhan.com/v1',
  timeout: 10000,
});

// Koordinata göre namaz vakitlerini getir
export async function fetchPrayerTimesByCoords(latitude, longitude, method = 13) {
  const today = new Date();
  const response = await prayerApi.get('/timings', {
    params: {
      latitude,
      longitude,
      method, // 13 = Diyanet İşleri Başkanlığı
      date_or_timestamp: Math.floor(today.getTime() / 1000),
    },
  });
  return response.data.data;
}

// Şehre göre namaz vakitlerini getir
export async function fetchPrayerTimesByCity(city, country = 'Turkey', method = 13) {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const response = await prayerApi.get(`/timingsByCity/${dd}-${mm}-${yyyy}`, {
    params: { city, country, method },
  });
  return response.data.data;
}

// Aylık namaz vakitleri
export async function fetchMonthlyPrayerTimes(latitude, longitude, month, year, method = 13) {
  const response = await prayerApi.get(`/calendar/${year}/${month}`, {
    params: { latitude, longitude, method },
  });
  return response.data.data;
}

// Namaz vakti isimleri (Türkçe)
export const PRAYER_NAMES = {
  Fajr: 'İmsak',
  Sunrise: 'Güneş',
  Dhuhr: 'Öğle',
  Asr: 'İkindi',
  Maghrib: 'Akşam',
  Isha: 'Yatsı',
};

// Namaz vakti ikonları
export const PRAYER_ICONS = {
  Fajr: 'weather-night',
  Sunrise: 'weather-sunset-up',
  Dhuhr: 'weather-sunny',
  Asr: 'weather-partly-cloudy',
  Maghrib: 'weather-sunset-down',
  Isha: 'moon-waning-crescent',
};
