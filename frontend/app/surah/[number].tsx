import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const API_BASE = process.env.EXPO_PUBLIC_BACKEND_URL || '';

interface Verse {
  number: number;
  arabic: string;
  turkish: string;
  page?: number;
  juz?: number;
}

interface SurahData {
  number: number;
  name: string;
  arabic_name: string;
  meaning: string;
  revelation: string;
  total_verses: number;
  verses: Verse[];
}

export default function SurahScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const surahNumber = parseInt(params.number as string) || 1;
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [surah, setSurah] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentVerse, setCurrentVerse] = useState<number | null>(null);
  const [speakingMode, setSpeakingMode] = useState<'arabic' | 'turkish'>('arabic');

  useEffect(() => {
    fetchSurah();
    
    return () => {
      Speech.stop();
    };
  }, [surahNumber]);

  const fetchSurah = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/quran/surah/${surahNumber}`);
      if (response.ok) {
        const data = await response.json();
        setSurah(data);
      }
    } catch (error) {
      console.error('Error fetching surah:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakVerse = async (verse: Verse, mode: 'arabic' | 'turkish') => {
    await Speech.stop();
    setIsSpeaking(true);
    setCurrentVerse(verse.number);
    setSpeakingMode(mode);

    const text = mode === 'arabic' ? verse.arabic : verse.turkish;
    const language = mode === 'arabic' ? 'ar' : 'tr-TR';
    
    Speech.speak(text, {
      language,
      rate: mode === 'arabic' ? 0.75 : 0.9,
      pitch: 1.0,
      onDone: () => {
        setIsSpeaking(false);
        setCurrentVerse(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setCurrentVerse(null);
      },
    });
  };

  const speakAllVerses = async (mode: 'arabic' | 'turkish') => {
    if (!surah) return;
    
    await Speech.stop();
    setIsSpeaking(true);
    setSpeakingMode(mode);

    const verses = surah.verses;
    let currentIndex = 0;

    const speakNext = () => {
      if (currentIndex >= verses.length) {
        setIsSpeaking(false);
        setCurrentVerse(null);
        return;
      }

      const verse = verses[currentIndex];
      setCurrentVerse(verse.number);
      
      const text = mode === 'arabic' ? verse.arabic : verse.turkish;
      const language = mode === 'arabic' ? 'ar' : 'tr-TR';
      
      Speech.speak(text, {
        language,
        rate: mode === 'arabic' ? 0.75 : 0.9,
        pitch: 1.0,
        onDone: () => {
          currentIndex++;
          setTimeout(speakNext, 500);
        },
        onError: () => {
          setIsSpeaking(false);
          setCurrentVerse(null);
        },
      });
    };

    speakNext();
  };

  const stopSpeaking = async () => {
    await Speech.stop();
    setIsSpeaking(false);
    setCurrentVerse(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!surah) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Sure bulunamadı</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.surahName, { color: colors.text }]}>{surah.name}</Text>
          <Text style={[styles.surahArabic, { color: colors.primary }]}>{surah.arabic_name}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.verseCount, { color: colors.textSecondary }]}>
            {surah.total_verses} {t('verse')}
          </Text>
        </View>
      </View>

      {/* Audio Controls */}
      <View style={[styles.audioControls, { backgroundColor: colors.surface }]}>
        <View style={styles.audioButtons}>
          {!isSpeaking ? (
            <>
              <TouchableOpacity
                style={[styles.playButton, { backgroundColor: colors.primary }]}
                onPress={() => speakAllVerses('arabic')}
              >
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.playButtonText}>Arapça Oku</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.playButton, { backgroundColor: colors.secondary }]}
                onPress={() => speakAllVerses('turkish')}
              >
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.playButtonText}>Türkçe Oku</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.stopButton, { backgroundColor: colors.error }]}
              onPress={stopSpeaking}
            >
              <Ionicons name="stop" size={20} color="#fff" />
              <Text style={styles.playButtonText}>{t('stopListening')}</Text>
            </TouchableOpacity>
          )}
        </View>
        {isSpeaking && (
          <Text style={[styles.nowPlaying, { color: colors.textSecondary }]}>
            ▶ Ayet {currentVerse} okunuyor... ({speakingMode === 'arabic' ? 'Arapça' : 'Türkçe'})
          </Text>
        )}
      </View>

      {/* Surah Info */}
      <View style={[styles.surahInfo, { backgroundColor: colors.surface }]}>
        <View style={styles.infoItem}>
          <Ionicons name="location" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {surah.revelation}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {surah.meaning}
          </Text>
        </View>
      </View>

      {/* Bismillah */}
      {surahNumber !== 9 && surahNumber !== 1 && (
        <View style={[styles.bismillah, { backgroundColor: colors.surface }]}>
          <Text style={[styles.bismillahText, { color: colors.primary }]}>
            بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
          </Text>
        </View>
      )}

      {/* Verses */}
      <ScrollView style={styles.versesContainer}>
        {surah.verses.map((verse) => (
          <View 
            key={verse.number} 
            style={[
              styles.verseCard, 
              { backgroundColor: colors.surface },
              currentVerse === verse.number && { borderColor: colors.primary, borderWidth: 2 }
            ]}
          >
            <View style={styles.verseHeader}>
              <View style={[styles.verseNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.verseNumberText}>{verse.number}</Text>
              </View>
              <View style={styles.verseActions}>
                <TouchableOpacity
                  style={[styles.speakButton, { backgroundColor: colors.surfaceLight }]}
                  onPress={() => speakVerse(verse, 'arabic')}
                >
                  <Ionicons 
                    name={isSpeaking && currentVerse === verse.number && speakingMode === 'arabic' ? 'stop' : 'volume-high'} 
                    size={16} 
                    color={colors.primary} 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.speakButton, { backgroundColor: colors.surfaceLight }]}
                  onPress={() => speakVerse(verse, 'turkish')}
                >
                  <Ionicons 
                    name={isSpeaking && currentVerse === verse.number && speakingMode === 'turkish' ? 'stop' : 'chatbubble'} 
                    size={16} 
                    color={colors.secondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={[styles.arabicText, { color: colors.text }]}>
              {verse.arabic}
            </Text>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <Text style={[styles.turkishText, { color: colors.textSecondary }]}>
              {verse.turkish}
            </Text>
          </View>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
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
  headerCenter: {
    alignItems: 'center',
  },
  surahName: {
    fontSize: 18,
    fontWeight: '700',
  },
  surahArabic: {
    fontSize: 14,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  verseCount: {
    fontSize: 12,
  },
  audioControls: {
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  audioButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 6,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  nowPlaying: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
  },
  surahInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
  },
  bismillah: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bismillahText: {
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'serif',
  },
  versesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  verseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  verseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  speakButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 42,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'serif',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  turkishText: {
    fontSize: 15,
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 40,
  },
});
