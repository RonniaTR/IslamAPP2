import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface PrayerTimes {
  city_name: string;
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  qibla_direction: number;
}

interface City {
  id: string;
  name: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('istanbul');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string, remaining: string} | null>(null);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [selectedCity]);

  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer();
    }
  }, [prayerTimes, currentTime]);

  const fetchData = async () => {
    try {
      const [citiesRes, prayerRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/cities`),
        axios.get(`${BACKEND_URL}/api/prayer-times/${selectedCity}`),
      ]);
      setCities(citiesRes.data);
      setPrayerTimes(prayerRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateNextPrayer = () => {
    if (!prayerTimes) return;
    
    const prayers = [
      { name: 'İmsak', time: prayerTimes.fajr },
      { name: 'Güneş', time: prayerTimes.sunrise },
      { name: 'Öğle', time: prayerTimes.dhuhr },
      { name: 'İkindi', time: prayerTimes.asr },
      { name: 'Akşam', time: prayerTimes.maghrib },
      { name: 'Yatsı', time: prayerTimes.isha },
    ];

    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    for (const prayer of prayers) {
      const [hours, mins] = prayer.time.split(':').map(Number);
      const prayerMins = hours * 60 + mins;
      
      if (prayerMins > now) {
        const diff = prayerMins - now;
        const remainHours = Math.floor(diff / 60);
        const remainMins = diff % 60;
        setNextPrayer({
          name: prayer.name,
          time: prayer.time,
          remaining: remainHours > 0 ? `${remainHours}sa ${remainMins}dk` : `${remainMins}dk`,
        });
        return;
      }
    }
    
    // If all prayers passed, next is tomorrow's Fajr
    setNextPrayer({
      name: 'İmsak',
      time: prayerTimes.fajr,
      remaining: 'Yarın',
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return currentTime.toLocaleDateString('tr-TR', options);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Selamün Aleyküm</Text>
            <Text style={styles.dateText}>{formatDate()}</Text>
          </View>
          <TouchableOpacity style={styles.cityButton} onPress={() => setShowCityPicker(!showCityPicker)}>
            <Ionicons name="location" size={18} color="#10b981" />
            <Text style={styles.cityText}>{prayerTimes?.city_name || 'Şehir Seç'}</Text>
            <Ionicons name="chevron-down" size={16} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* City Picker */}
        {showCityPicker && (
          <View style={styles.cityPicker}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city.id}
                  style={[
                    styles.cityChip,
                    selectedCity === city.id && styles.cityChipActive,
                  ]}
                  onPress={() => {
                    setSelectedCity(city.id);
                    setShowCityPicker(false);
                    setLoading(true);
                  }}
                >
                  <Text
                    style={[
                      styles.cityChipText,
                      selectedCity === city.id && styles.cityChipTextActive,
                    ]}
                  >
                    {city.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Next Prayer Card */}
        {nextPrayer && (
          <View style={styles.nextPrayerCard}>
            <View style={styles.nextPrayerGlow} />
            <View style={styles.nextPrayerContent}>
              <View>
                <Text style={styles.nextPrayerLabel}>Sonraki Namaz</Text>
                <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
              </View>
              <View style={styles.nextPrayerTimeContainer}>
                <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
                <Text style={styles.nextPrayerRemaining}>{nextPrayer.remaining} kaldı</Text>
              </View>
            </View>
          </View>
        )}

        {/* Prayer Times Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Namaz Vakitleri</Text>
          <View style={styles.prayerGrid}>
            {prayerTimes && (
              <>
                <PrayerTimeCard name="İmsak" time={prayerTimes.fajr} icon="moon" />
                <PrayerTimeCard name="Güneş" time={prayerTimes.sunrise} icon="sunny" />
                <PrayerTimeCard name="Öğle" time={prayerTimes.dhuhr} icon="partly-sunny" />
                <PrayerTimeCard name="İkindi" time={prayerTimes.asr} icon="cloudy" />
                <PrayerTimeCard name="Akşam" time={prayerTimes.maghrib} icon="cloudy-night" />
                <PrayerTimeCard name="Yatsı" time={prayerTimes.isha} icon="moon" />
              </>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/scholars')}>
              <View style={[styles.actionIcon, { backgroundColor: '#f59e0b20' }]}>
                <Ionicons name="people" size={28} color="#f59e0b" />
              </View>
              <Text style={styles.actionTitle}>Hocalar</Text>
              <Text style={styles.actionDesc}>Âlimlerin görüşleri</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/ai-chat')}>
              <View style={[styles.actionIcon, { backgroundColor: '#3b82f620' }]}>
                <Ionicons name="chatbubbles" size={28} color="#3b82f6" />
              </View>
              <Text style={styles.actionTitle}>AI Asistan</Text>
              <Text style={styles.actionDesc}>İslami sorular sor</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/pomodoro')}>
              <View style={[styles.actionIcon, { backgroundColor: '#10b98120' }]}>
                <Ionicons name="timer" size={28} color="#10b981" />
              </View>
              <Text style={styles.actionTitle}>İlim Pomodoro</Text>
              <Text style={styles.actionDesc}>Odaklanarak çalış</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/qibla')}>
              <View style={[styles.actionIcon, { backgroundColor: '#8b5cf620' }]}>
                <Ionicons name="compass" size={28} color="#8b5cf6" />
              </View>
              <Text style={styles.actionTitle}>Kıble Pusulası</Text>
              <Text style={styles.actionDesc}>{prayerTimes?.qibla_direction.toFixed(1)}°</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Verse */}
        <View style={styles.verseCard}>
          <View style={styles.verseHeader}>
            <Ionicons name="book-outline" size={20} color="#10b981" />
            <Text style={styles.verseLabel}>Günün Ayeti</Text>
          </View>
          <Text style={styles.verseText}>
            "Şüphesiz namaz, müminler üzerine vakitleri belirlenmiş bir farzdır."
          </Text>
          <Text style={styles.verseSource}>Nisa Suresi, 103. Ayet</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const PrayerTimeCard = ({ name, time, icon }: { name: string; time: string; icon: string }) => (
  <View style={styles.prayerCard}>
    <Ionicons name={icon as any} size={20} color="#64748b" />
    <Text style={styles.prayerName}>{name}</Text>
    <Text style={styles.prayerTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  cityText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '500',
  },
  cityPicker: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cityChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  cityChipActive: {
    backgroundColor: '#10b981',
  },
  cityChipText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  cityChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  nextPrayerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    position: 'relative',
  },
  nextPrayerGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#10b981',
    opacity: 0.15,
  },
  nextPrayerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  nextPrayerLabel: {
    color: '#64748b',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextPrayerName: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  nextPrayerTimeContainer: {
    alignItems: 'flex-end',
  },
  nextPrayerTime: {
    color: '#10b981',
    fontSize: 32,
    fontWeight: 'bold',
  },
  nextPrayerRemaining: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prayerCard: {
    width: (width - 48) / 3,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  prayerName: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 6,
  },
  prayerTime: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: cardWidth,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  actionDesc: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  verseCard: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  verseLabel: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  verseText: {
    color: '#f8fafc',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  verseSource: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'right',
  },
});
