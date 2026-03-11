import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import { fetchPrayerTimesByCity, fetchPrayerTimesByCoords, PRAYER_NAMES } from '../services/prayerService';

const keys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function PrayerTimesScreen() {
  const { theme } = useTheme();
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationText, setLocationText] = useState('Istanbul');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const prayer = await fetchPrayerTimesByCoords(pos.coords.latitude, pos.coords.longitude);
          const geocode = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          if (mounted) {
            setData(prayer.timings);
            const first = geocode[0];
            setLocationText(first?.city || first?.subregion || 'Unknown');
          }
        } else {
          const fallback = await fetchPrayerTimesByCity('Istanbul');
          if (mounted) setData(fallback.timings);
        }
      } catch {
        const fallback = await fetchPrayerTimesByCity('Istanbul');
        if (mounted) setData(fallback.timings);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const nextPrayer = useMemo(() => {
    if (!data) return null;
    const now = new Date();
    for (const key of keys) {
      const [h, m] = String(data[key]).split(':').map(Number);
      const dt = new Date();
      dt.setHours(h, m, 0, 0);
      if (dt > now) return { key, time: data[key] };
    }
    return { key: 'Fajr', time: data.Fajr };
  }, [data]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}> 
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ padding: 16 }}>
      <View style={[styles.hero, { backgroundColor: theme.primary }]}> 
        <Text style={styles.heroTitle}>{t('prayerTimes')}</Text>
        <View style={styles.locRow}>
          <Ionicons name="location" size={14} color="#fff" />
          <Text style={styles.heroSubtitle}>{locationText}</Text>
        </View>
        {nextPrayer && (
          <Text style={styles.heroNext}>{t('nextPrayer')}: {PRAYER_NAMES[nextPrayer.key] || nextPrayer.key} - {nextPrayer.time}</Text>
        )}
      </View>

      {(data ? keys : []).map((k) => (
        <View key={k} style={[styles.item, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.itemName, { color: theme.text }]}>{PRAYER_NAMES[k] || k}</Text>
          <Text style={[styles.itemTime, { color: theme.primary }]}>{String(data[k]).slice(0, 5)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { borderRadius: 18, padding: 16, marginBottom: 14 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  locRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroSubtitle: { color: '#f1f1f1' },
  heroNext: { color: '#fff', marginTop: 10, fontWeight: '700' },
  item: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: { fontSize: 16, fontWeight: '800' },
  itemTime: { fontSize: 18, fontWeight: '900' },
});
