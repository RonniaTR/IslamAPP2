import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchHadithById } from '../services/hadithService';
import { saveUserNote, upsertUserProgress } from '../services/firebase';

export default function HadithDetailScreen({ route }) {
  const { hadithId } = route.params;
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    loadHadith();
  }, [hadithId]);

  const loadHadith = async () => {
    try {
      const data = await fetchHadithById(hadithId);
      setHadith(data);
    } catch (error) {
      console.error('Failed to load hadith:', error);
      Alert.alert(t('error'), 'Hadis yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const getHadithText = () => {
    if (!hadith) return '';
    if (lang === 'ar') return hadith.arabic;
    if (lang === 'en') return hadith.english;
    return hadith.turkish;
  };

  const stop = async () => {
    await Speech.stop();
    setPlaying(false);
  };

  const speak = async () => {
    if (playing) {
      stop();
      return;
    }
    setPlaying(true);
    const text = getHadithText();
    const voices = await Speech.getAvailableVoicesAsync();
    const trVoice = voices.find((v) => String(v.language || '').startsWith('tr') && String(v.name || '').toLowerCase().includes('male'));
    const genericVoice = voices.find((v) => String(v.name || '').toLowerCase().includes('male'));

    Speech.speak(text, {
      language: lang === 'ar' ? 'ar' : lang === 'en' ? 'en-US' : 'tr-TR',
      rate: 0.86,
      pitch: 0.82,
      voice: trVoice?.identifier || genericVoice?.identifier,
      onDone: () => setPlaying(false),
      onError: () => setPlaying(false),
      onStopped: () => setPlaying(false),
    });
  };

  const copy = async () => {
    if (!hadith) return;
    const fullText = `${hadith.arabic}\n\n${hadith.turkish}\n\n${hadith.source} - ${hadith.book} (${hadith.number})`;
    await Clipboard.setStringAsync(fullText);
    Alert.alert(t('success'), 'Hadis kopyalandı');
  };

  const save = async () => {
    if (!user?.uid || !hadith) return;
    try {
      await saveUserNote(user.uid, {
        title: `Hadis - ${hadith.id}`,
        content: `${hadith.arabic}\n\n${hadith.turkish}\n\n${hadith.english}`,
        type: 'hadith',
        source: hadith.source,
        meta: { 
          narrator: hadith.narrator, 
          category: hadith.category,
          book: hadith.book,
          number: hadith.number,
          grade: hadith.grade
        },
      });
      await upsertUserProgress(user.uid, { hadithRead: Number((Date.now() / 1000).toFixed(0)) });
      Alert.alert(t('save'), t('savedSuccessfully'));
    } catch {
      Alert.alert(t('error'), 'Hadis notu kaydedilemedi.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!hadith) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Hadis bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ padding: 16 }}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        {/* Grade Badge */}
        <View style={[styles.gradeBadge, { backgroundColor: hadith.grade === 'Sahih' ? '#4CAF50' : '#FF9800' }]}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>{hadith.grade}</Text>
        </View>

        {/* Arabic Text */}
        <Text style={[styles.arabicText, { color: theme.text }]}>{hadith.arabic}</Text>

        {/* Turkish Translation */}
        <View style={[styles.translationBox, { backgroundColor: theme.primarySurface }]}>
          <Text style={{ color: theme.text, fontSize: 15, lineHeight: 24, fontWeight: '500' }}>
            {hadith.turkish}
          </Text>
        </View>

        {/* English Translation */}
        {lang === 'en' && (
          <View style={[styles.translationBox, { backgroundColor: theme.secondarySurface }]}>
            <Text style={{ color: theme.text, fontSize: 14, lineHeight: 22, fontWeight: '500' }}>
              {hadith.english}
            </Text>
          </View>
        )}

        {/* Meta Information */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Ionicons name="person-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              {t('narrator')}: {hadith.narrator}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="book-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              {hadith.source} - {hadith.bookTr} ({hadith.number})
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="folder-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              {t('category')}: {hadith.category}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="sparkles-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              {hadith.theme}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, { borderColor: theme.border, backgroundColor: playing ? theme.primarySurface : 'transparent' }]} onPress={speak}>
            <Ionicons name={playing ? 'stop-circle-outline' : 'volume-high-outline'} size={18} color={theme.primary} />
            <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>
              {playing ? t('stopListening') : t('listenHadith')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { borderColor: theme.border }]} onPress={copy}>
            <Ionicons name="copy-outline" size={18} color={theme.primary} />
            <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>{t('copy')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { borderColor: theme.border }]} onPress={save}>
            <Ionicons name="bookmark-outline" size={18} color={theme.primary} />
            <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>{t('saveNote')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  gradeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  arabicText: { 
    fontSize: 22, 
    lineHeight: 38, 
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 16
  },
  translationBox: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  metaSection: {
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meta: { 
    fontSize: 13, 
    fontWeight: '600',
    flex: 1,
  },
  row: { 
    marginTop: 8, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10 
  },
  btn: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
