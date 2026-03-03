import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Hadith {
  id: string;
  arabic: string;
  turkish: string;
  source: string;
  narrator: string;
  category: string;
  explanation: string;
  authenticity: string;
}

const CATEGORY_ICONS: { [key: string]: string } = {
  iman: 'heart',
  namaz: 'hand-left',
  oruc: 'moon',
  zekat: 'wallet',
  hac: 'airplane',
  ahlak: 'flower',
  aile: 'people',
  ilim: 'school',
  dua: 'chatbubble-ellipses',
};

export default function HadithScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [filteredHadiths, setFilteredHadiths] = useState<Hadith[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    initUser();
    fetchData();
  }, []);

  useEffect(() => {
    filterHadiths();
  }, [selectedCategory, searchQuery, hadiths]);

  const initUser = async () => {
    let storedUserId = await AsyncStorage.getItem('user_id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('user_id', storedUserId);
    }
    setUserId(storedUserId);
  };

  const fetchData = async () => {
    try {
      const [catRes, hadithRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/hadith/categories`),
        axios.get(`${BACKEND_URL}/api/hadith/all`),
      ]);
      setCategories(catRes.data);
      setHadiths(hadithRes.data);
      setFilteredHadiths(hadithRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHadiths = () => {
    let filtered = hadiths;
    
    if (selectedCategory) {
      filtered = filtered.filter(h => h.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        h => h.turkish.toLowerCase().includes(query) || 
             h.explanation.toLowerCase().includes(query)
      );
    }
    
    setFilteredHadiths(filtered);
  };

  const openHadith = async (hadith: Hadith) => {
    setSelectedHadith(hadith);
    setShowModal(true);
    
    // Log activity for gamification
    try {
      await axios.post(`${BACKEND_URL}/api/gamification/activity`, {
        user_id: userId,
        activity_type: 'hadith_read',
        details: hadith.id,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHadith(null);
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat?.name || id;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Hadisler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hadis-i Şerifler</Text>
          <Text style={styles.headerSubtitle}>Peygamberimizin sözleri</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Hadis ara..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.categoryChip,
                !selectedCategory && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Ionicons name="apps" size={18} color={!selectedCategory ? '#ffffff' : '#64748b'} />
              <Text
                style={[
                  styles.categoryChipText,
                  !selectedCategory && styles.categoryChipTextActive,
                ]}
              >
                Tümü
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === cat.id ? null : cat.id
                )}
              >
                <Ionicons
                  name={(CATEGORY_ICONS[cat.id] || 'book') as any}
                  size={18}
                  color={selectedCategory === cat.id ? '#ffffff' : '#64748b'}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === cat.id && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredHadiths.length} hadis bulundu
          </Text>
        </View>

        {/* Hadiths List */}
        <View style={styles.section}>
          {filteredHadiths.map((hadith) => (
            <TouchableOpacity
              key={hadith.id}
              style={styles.hadithCard}
              onPress={() => openHadith(hadith)}
            >
              <View style={styles.hadithHeader}>
                <View style={styles.hadithCategory}>
                  <Ionicons
                    name={(CATEGORY_ICONS[hadith.category] || 'book') as any}
                    size={14}
                    color="#10b981"
                  />
                  <Text style={styles.hadithCategoryText}>
                    {getCategoryName(hadith.category)}
                  </Text>
                </View>
                <View style={[
                  styles.authenticityBadge,
                  hadith.authenticity === 'Sahih' && styles.authenticityBadgeSahih,
                ]}>
                  <Text style={styles.authenticityText}>{hadith.authenticity}</Text>
                </View>
              </View>
              
              <Text style={styles.hadithArabic} numberOfLines={2}>
                {hadith.arabic}
              </Text>
              
              <Text style={styles.hadithTurkish} numberOfLines={3}>
                {hadith.turkish}
              </Text>
              
              <View style={styles.hadithFooter}>
                <Text style={styles.hadithSource}>{hadith.source}</Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Hadith Detail Modal */}
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
            <Text style={styles.modalTitle}>Hadis Detayı</Text>
            <View style={{ width: 40 }} />
          </View>

          {selectedHadith && (
            <ScrollView style={styles.modalContent}>
              {/* Category & Authenticity */}
              <View style={styles.modalBadges}>
                <View style={styles.modalCategory}>
                  <Ionicons
                    name={(CATEGORY_ICONS[selectedHadith.category] || 'book') as any}
                    size={16}
                    color="#10b981"
                  />
                  <Text style={styles.modalCategoryText}>
                    {getCategoryName(selectedHadith.category)}
                  </Text>
                </View>
                <View style={[
                  styles.modalAuthenticity,
                  selectedHadith.authenticity === 'Sahih' && styles.authenticityBadgeSahih,
                ]}>
                  <Text style={styles.modalAuthenticityText}>
                    {selectedHadith.authenticity}
                  </Text>
                </View>
              </View>

              {/* Arabic Text */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Arapça Metin</Text>
                <Text style={styles.modalArabic}>{selectedHadith.arabic}</Text>
              </View>

              {/* Turkish Translation */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Türkçe Meal</Text>
                <Text style={styles.modalTurkish}>{selectedHadith.turkish}</Text>
              </View>

              {/* Explanation */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Açıklama</Text>
                <Text style={styles.modalExplanation}>{selectedHadith.explanation}</Text>
              </View>

              {/* Source Info */}
              <View style={styles.modalSourceContainer}>
                <View style={styles.modalSourceItem}>
                  <Ionicons name="book-outline" size={16} color="#64748b" />
                  <Text style={styles.modalSourceText}>Kaynak: {selectedHadith.source}</Text>
                </View>
                <View style={styles.modalSourceItem}>
                  <Ionicons name="person-outline" size={16} color="#64748b" />
                  <Text style={styles.modalSourceText}>Ravi: {selectedHadith.narrator}</Text>
                </View>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          )}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 16,
    paddingVertical: 14,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#10b981',
  },
  categoryChipText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  categoryChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  resultsText: {
    color: '#64748b',
    fontSize: 14,
  },
  hadithCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  hadithHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hadithCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hadithCategoryText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '500',
  },
  authenticityBadge: {
    backgroundColor: '#f59e0b20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  authenticityBadgeSahih: {
    backgroundColor: '#10b98120',
  },
  authenticityText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '600',
  },
  hadithArabic: {
    color: '#f8fafc',
    fontSize: 18,
    textAlign: 'right',
    lineHeight: 28,
    marginBottom: 12,
  },
  hadithTurkish: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  hadithFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hadithSource: {
    color: '#64748b',
    fontSize: 12,
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
  modalTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modalCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b98120',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  modalCategoryText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
  },
  modalAuthenticity: {
    backgroundColor: '#f59e0b20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  modalAuthenticityText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '500',
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  modalArabic: {
    color: '#f8fafc',
    fontSize: 24,
    textAlign: 'right',
    lineHeight: 40,
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
  },
  modalTurkish: {
    color: '#f8fafc',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
  },
  modalExplanation: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 24,
  },
  modalSourceContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  modalSourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalSourceText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});
