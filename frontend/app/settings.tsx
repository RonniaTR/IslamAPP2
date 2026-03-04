import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useMusic } from '../contexts/MusicContext';
import Slider from '@react-native-community/slider';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isPlaying, isMuted, volume, toggleMusic, toggleMute, setVolume, currentTrack, setTrack } = useMusic();

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const musicTracks = [
    { id: 'ney', name: 'Ney Sesi', icon: 'musical-notes' },
    { id: 'peaceful', name: 'Huzur', icon: 'leaf' },
    { id: 'meditation', name: 'Meditasyon', icon: 'moon' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Language Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language" size={22} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</Text>
          </View>
          
          <View style={styles.languageGrid}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  { backgroundColor: colors.surfaceLight },
                  language === lang.code && { borderColor: colors.primary, borderWidth: 2 }
                ]}
                onPress={() => setLanguage(lang.code as 'tr' | 'en' | 'ar')}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[styles.languageName, { color: colors.text }]}>{lang.name}</Text>
                {language === lang.code && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette" size={22} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('theme')}</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name={isDark ? 'moon' : 'sunny'} 
                size={24} 
                color={isDark ? '#8b5cf6' : '#f59e0b'} 
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {isDark ? t('darkMode') : t('lightMode')}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Music Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="musical-notes" size={22} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('music')}</Text>
          </View>
          
          {/* Music Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name={isPlaying ? 'volume-high' : 'volume-mute'} 
                size={24} 
                color={isPlaying ? colors.primary : colors.textMuted} 
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {isPlaying ? t('musicOn') : t('musicOff')}
              </Text>
            </View>
            <Switch
              value={isPlaying}
              onValueChange={toggleMusic}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
              thumbColor={isPlaying ? colors.primary : '#f4f3f4'}
            />
          </View>

          {/* Volume Slider */}
          {isPlaying && (
            <View style={styles.volumeContainer}>
              <View style={styles.volumeRow}>
                <TouchableOpacity onPress={toggleMute}>
                  <Ionicons 
                    name={isMuted ? 'volume-off' : 'volume-low'} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={volume}
                    onValueChange={setVolume}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.surfaceLight}
                    thumbTintColor={colors.primary}
                    disabled={isMuted}
                  />
                </View>
                <Ionicons name="volume-high" size={20} color={colors.textSecondary} />
              </View>
              
              {/* Track Selection */}
              <Text style={[styles.trackLabel, { color: colors.textSecondary }]}>Müzik Türü</Text>
              <View style={styles.trackGrid}>
                {musicTracks.map((track) => (
                  <TouchableOpacity
                    key={track.id}
                    style={[
                      styles.trackButton,
                      { backgroundColor: colors.surfaceLight },
                      currentTrack === track.id && { borderColor: colors.primary, borderWidth: 2 }
                    ]}
                    onPress={() => setTrack(track.id)}
                  >
                    <Ionicons 
                      name={track.icon as any} 
                      size={20} 
                      color={currentTrack === track.id ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.trackName, 
                      { color: currentTrack === track.id ? colors.primary : colors.text }
                    ]}>
                      {track.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* About Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={22} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Hakkında</Text>
          </View>
          
          <View style={styles.aboutInfo}>
            <Text style={[styles.appName, { color: colors.text }]}>İslami Yaşam Asistanı</Text>
            <Text style={[styles.appVersion, { color: colors.textSecondary }]}>Versiyon 2.0</Text>
            <Text style={[styles.appDesc, { color: colors.textMuted }]}>
              Namaz vakitleri, Kıble bulucu, Kur'an, Hadis,{"\n"}
              AI Danışman ve Quiz özellikleri
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  languageGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  languageFlag: {
    fontSize: 28,
  },
  languageName: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  volumeContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderContainer: {
    flex: 1,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  trackLabel: {
    fontSize: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  trackGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  trackName: {
    fontSize: 11,
    fontWeight: '600',
  },
  aboutInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 8,
  },
  appDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
