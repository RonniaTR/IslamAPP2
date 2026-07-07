import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';

const featureCards = [
  { key: 'quran', icon: 'book', route: 'QuranTab' },
  { key: 'tafsir', icon: 'document-text', route: 'QuranTab' },
  { key: 'hadith', icon: 'library', route: 'HadithTab' },
  { key: 'dhikr', icon: 'radio-button-on', route: 'Dhikr' },
  { key: 'prayer', icon: 'time', route: 'PrayerTab' },
  { key: 'qibla', icon: 'navigate', route: 'Qibla' },
  { key: 'aiChat', icon: 'chatbubbles', route: 'AiChat' },
  { key: 'notes', icon: 'document', route: 'Notes' },
  { key: 'scholars', icon: 'people', route: 'Scholars' },
];

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 28 }}>
      <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }] }}>
        <View style={[styles.hero, { backgroundColor: theme.primary }]}> 
          <Text style={styles.heroGreeting}>{t('greeting')}</Text>
          <Text style={styles.heroTitle}>IslamAPP</Text>
          <Text style={styles.heroDesc}>{t('dailyReminder')}</Text>
          <TouchableOpacity style={[styles.settings, { backgroundColor: 'rgba(255,255,255,0.18)' }]} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('explore')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notes')}>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>{t('notes')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {featureCards.map((card) => (
            <TouchableOpacity
              key={card.key}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => navigation.navigate(card.route)}
            >
              <View style={[styles.iconWrap, { backgroundColor: theme.primarySurface }]}> 
                <Ionicons name={card.icon} size={22} color={theme.primary} />
              </View>
              <Text style={[styles.cardText, { color: theme.text }]}>{t(card.key)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    margin: 16,
    borderRadius: 20,
    padding: 18,
    minHeight: 170,
  },
  heroGreeting: { color: '#DCEAD9', fontSize: 15, fontWeight: '600' },
  heroTitle: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 8 },
  heroDesc: { color: '#F0F6EF', marginTop: 6, fontSize: 14, maxWidth: '80%' },
  settings: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHead: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  grid: {
    marginHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardText: { fontSize: 14, fontWeight: '700' },
});
