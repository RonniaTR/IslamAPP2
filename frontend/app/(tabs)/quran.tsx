import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Surah {
  number: number;
  name: string;
  arabic: string;
  meaning: string;
  verses: number;
  revelation: string;
  juz: number;
}

interface Verse {
  verse: number;
  arabic: string;
  turkish: string;
  transliteration: string;
}

export default function QuranScreen() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    initUser();
    fetchSurahs();
  }, []);

  const initUser = async () => {
    let storedUserId = await AsyncStorage.getItem('user_id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('user_id', storedUserId);
    }
    setUserId(storedUserId);
    loadBookmarks(storedUserId);
  };

  const fetchSurahs = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/quran/surahs`);
      setSurahs(res.data);
    } catch (error) {
      console.error('Error fetching surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async (uid: string) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/quran/bookmarks/${uid}`);
      setBookmarks(res.data);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const openSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setShowModal(true);
    setLoadingVerses(true);
    
    try {
      const res = await axios.get(`${BACKEND_URL}/api/quran/verses/${surah.name.toLowerCase()}`);
      setVerses(res.data.verses);
    } catch (error) {
      console.error('Error fetching verses:', error);
      setVerses([]);
    } finally {
      setLoadingVerses(false);
    }
  };

  const addBookmark = async (surah: number, verse: number) => {
    try {
      await axios.post(`${BACKEND_URL}/api/quran/bookmark?user_id=${userId}&surah=${surah}&verse=${verse}`);
      loadBookmarks(userId);
      // Log activity for gamification
      await axios.post(`${BACKEND_URL}/api/gamification/activity`, {
        user_id: userId,
        activity_type: 'quran_read',
        details: `Surah ${surah}, Verse ${verse}`,
      });
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSurah(null);
    setVerses([]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Kur'an yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="book" size={32} color="#10b981" />
          </View>
          <Text style={styles.headerTitle}>Kur'an-ı Kerim</Text>
          <Text style={styles.headerSubtitle}>Okuyun, anlayın, yaşayın</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>114</Text>
            <Text style={styles.statLabel}>Sure</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>6236</Text>
            <Text style={styles.statLabel}>Ayet</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{bookmarks.length}</Text>
            <Text style={styles.statLabel}>Yer İmi</Text>
          </View>
        </View>

        {/* Popular Surahs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popüler Sureler</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {surahs.filter(s => [1, 36, 55, 67, 112, 113, 114].includes(s.number)).map((surah) => (
              <TouchableOpacity
                key={surah.number}
                style={styles.popularCard}
                onPress={() => openSurah(surah)}
              >
                <Text style={styles.popularArabic}>{surah.arabic}</Text>
                <Text style={styles.popularName}>{surah.name}</Text>
                <Text style={styles.popularMeaning}>{surah.meaning}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Surahs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tüm Sureler</Text>
          {surahs.map((surah) => (
            <TouchableOpacity
              key={surah.number}
              style={styles.surahItem}
              onPress={() => openSurah(surah)}
            >
              <View style={styles.surahNumber}>
                <Text style={styles.surahNumberText}>{surah.number}</Text>
              </View>
              <View style={styles.surahInfo}>
                <View style={styles.surahNameRow}>
                  <Text style={styles.surahName}>{surah.name}</Text>
                  <Text style={styles.surahArabic}>{surah.arabic}</Text>
                </View>
                <Text style={styles.surahDetails}>
                  {surah.meaning} • {surah.verses} Ayet • {surah.revelation}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Surah Detail Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
              <Ionicons name="close" size={24} color="#f8fafc" />
            </TouchableOpacity>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>{selectedSurah?.name}</Text>
              <Text style={styles.modalSubtitle}>{selectedSurah?.arabic}</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Verses */}
          <ScrollView style={styles.versesContainer}>
            {loadingVerses ? (
              <View style={styles.versesLoading}>
                <ActivityIndicator size="large" color="#10b981" />
                <Text style={styles.loadingText}>Ayetler yükleniyor...</Text>
              </View>
            ) : verses.length > 0 ? (
              verses.map((verse) => (
                <View key={verse.verse} style={styles.verseCard}>
                  <View style={styles.verseHeader}>
                    <View style={styles.verseNumber}>
                      <Text style={styles.verseNumberText}>{verse.verse}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => addBookmark(selectedSurah?.number || 0, verse.verse)}
                    >
                      <Ionicons name="bookmark-outline" size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.verseArabic}>{verse.arabic}</Text>
                  <Text style={styles.verseTransliteration}>{verse.transliteration}</Text>
                  <Text style={styles.verseTurkish}>{verse.turkish}</Text>
                </View>
              ))
            ) : (
              <View style={styles.noVerses}>
                <Ionicons name="book-outline" size={48} color="#64748b" />
                <Text style={styles.noVersesText}>
                  Bu sure için ayet verisi henüz mevcut değil.
                </Text>
              </View>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

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
    alignItems: 'center',
    paddingVertical: 24,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10b98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#10b981',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 12,
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
  popularCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
  },
  popularArabic: {
    fontSize: 24,
    color: '#10b981',
    marginBottom: 8,
  },
  popularName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  popularMeaning: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  surahNumberText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  surahInfo: {
    flex: 1,
  },
  surahNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surahName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '500',
  },
  surahArabic: {
    color: '#10b981',
    fontSize: 16,
  },
  surahDetails: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modalClose: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleContainer: {
    alignItems: 'center',
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  modalSubtitle: {
    color: '#10b981',
    fontSize: 20,
    marginTop: 4,
  },
  versesContainer: {
    flex: 1,
    padding: 16,
  },
  versesLoading: {
    alignItems: 'center',
    paddingTop: 40,
  },
  verseCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b98120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  verseArabic: {
    color: '#f8fafc',
    fontSize: 24,
    textAlign: 'right',
    lineHeight: 40,
    marginBottom: 16,
  },
  verseTransliteration: {
    color: '#10b981',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  verseTurkish: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 24,
  },
  noVerses: {
    alignItems: 'center',
    paddingTop: 60,
  },
  noVersesText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
});
