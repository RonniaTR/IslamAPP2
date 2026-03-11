import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';

const KAABA = { lat: 21.4225, lng: 39.8262 };

function toRad(d) {
  return (d * Math.PI) / 180;
}

function toDeg(r) {
  return (r * 180) / Math.PI;
}

function bearingToKaaba(lat, lng) {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA.lat);
  const lam1 = toRad(lng);
  const lam2 = toRad(KAABA.lng);
  const y = Math.sin(lam2 - lam1) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(lam2 - lam1);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export default function QiblaScreen() {
  const { theme } = useTheme();
  const { t } = useLang();
  const [target, setTarget] = useState(null);
  const [heading, setHeading] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub;
    let mounted = true;

    const run = async () => {
      try {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (perm.status !== 'granted') {
          setLoading(false);
          return;
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const q = bearingToKaaba(pos.coords.latitude, pos.coords.longitude);
        if (mounted) setTarget(q);

        sub = Magnetometer.addListener((data) => {
          const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          const normalized = (angle + 360) % 360;
          setHeading(normalized);
        });
        Magnetometer.setUpdateInterval(300);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
      if (sub) sub.remove();
    };
  }, []);

  const offset = useMemo(() => {
    if (target == null) return null;
    return ((target - heading) + 360) % 360;
  }, [target, heading]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}> 
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>{t('qiblaDirection')}</Text>
      <View style={[styles.compass, { borderColor: theme.primary, backgroundColor: theme.card }]}> 
        <View style={[styles.needle, { transform: [{ rotate: `${offset || 0}deg` }], backgroundColor: theme.accent }]} />
        <Text style={[styles.deg, { color: theme.text }]}>{Math.round(offset || 0)} {t('degrees')}</Text>
      </View>
      <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 10, paddingHorizontal: 20 }}>
        Telefonu duz zeminde tutarak ibreyi sabitleyin.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  compass: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  needle: {
    position: 'absolute',
    width: 5,
    height: 120,
    borderRadius: 3,
    top: 20,
  },
  deg: { fontSize: 22, fontWeight: '900' },
});
