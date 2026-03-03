import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Scholar {
  id: string;
  name: string;
  title: string;
  style: string;
  specialty: string;
  sources: string[];
}

const SCHOLAR_COLORS: { [key: string]: string } = {
  nihat_hatipoglu: '#f59e0b',
  hayrettin_karaman: '#3b82f6',
  mustafa_islamoglu: '#8b5cf6',
  diyanet: '#10b981',
  omer_nasuhi: '#ec4899',
  elmalili: '#06b6d4',
  said_nursi: '#f97316',
};

export default function ScholarsScreen() {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingScholars, setFetchingScholars] = useState(true);
  const [sessionId, setSessionId] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initSession();
    fetchScholars();
  }, []);

  const initSession = async () => {
    let storedSessionId = await AsyncStorage.getItem('scholar_session_id');
    if (!storedSessionId) {
      storedSessionId = `scholar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('scholar_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
  };

  const fetchScholars = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/scholars`);
      setScholars(res.data);
    } catch (error) {
      console.error('Error fetching scholars:', error);
    } finally {
      setFetchingScholars(false);
    }
  };

  const askScholar = async () => {
    if (!selectedScholar || !question.trim() || loading) return;

    Keyboard.dismiss();
    setLoading(true);
    setResponse('');

    try {
      const res = await axios.post(`${BACKEND_URL}/api/scholars/ask`, {
        session_id: sessionId,
        question: question.trim(),
        scholar_id: selectedScholar.id,
      });
      setResponse(res.data.response);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error asking scholar:', error);
      setResponse('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const clearResponse = () => {
    setResponse('');
    setQuestion('');
    setSelectedScholar(null);
  };

  if (fetchingScholars) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Hocalar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Hocaların Görüşü</Text>
            <Text style={styles.headerSubtitle}>
              Sorularınızı âlimlerin bakış açısından yanıtlayalım
            </Text>
          </View>

          {/* Scholar Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hoca Seçin</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {scholars.map((scholar) => (
                <TouchableOpacity
                  key={scholar.id}
                  style={[
                    styles.scholarCard,
                    selectedScholar?.id === scholar.id && styles.scholarCardActive,
                    selectedScholar?.id === scholar.id && {
                      borderColor: SCHOLAR_COLORS[scholar.id] || '#10b981',
                    },
                  ]}
                  onPress={() => setSelectedScholar(scholar)}
                >
                  <View
                    style={[
                      styles.scholarAvatar,
                      { backgroundColor: `${SCHOLAR_COLORS[scholar.id] || '#10b981'}20` },
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={24}
                      color={SCHOLAR_COLORS[scholar.id] || '#10b981'}
                    />
                  </View>
                  <Text style={styles.scholarName} numberOfLines={2}>
                    {scholar.name}
                  </Text>
                  <Text style={styles.scholarTitle} numberOfLines={1}>
                    {scholar.specialty}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Selected Scholar Info */}
          {selectedScholar && (
            <View style={styles.selectedInfo}>
              <View style={styles.selectedHeader}>
                <View
                  style={[
                    styles.selectedAvatar,
                    { backgroundColor: `${SCHOLAR_COLORS[selectedScholar.id] || '#10b981'}20` },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={32}
                    color={SCHOLAR_COLORS[selectedScholar.id] || '#10b981'}
                  />
                </View>
                <View style={styles.selectedText}>
                  <Text style={styles.selectedName}>{selectedScholar.name}</Text>
                  <Text style={styles.selectedTitle}>{selectedScholar.title}</Text>
                </View>
              </View>
              <View style={styles.selectedDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="chatbubble-outline" size={16} color="#64748b" />
                  <Text style={styles.detailText}>{selectedScholar.style}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="book-outline" size={16} color="#64748b" />
                  <Text style={styles.detailText}>{selectedScholar.sources.join(', ')}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Question Input */}
          {selectedScholar && (
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Sorunuzu Yazın</Text>
              <TextInput
                style={styles.questionInput}
                placeholder="Örn: Namaz kılmanın önemi nedir?"
                placeholderTextColor="#64748b"
                value={question}
                onChangeText={setQuestion}
                multiline
                numberOfLines={3}
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.askButton,
                  (!question.trim() || loading) && styles.askButtonDisabled,
                ]}
                onPress={askScholar}
                disabled={!question.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={20} color="#ffffff" />
                    <Text style={styles.askButtonText}>Görüşünü Al</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Response */}
          {response && (
            <View style={styles.responseSection}>
              <View style={styles.responseHeader}>
                <View style={styles.responseHeaderLeft}>
                  <Ionicons
                    name="chatbubbles"
                    size={20}
                    color={SCHOLAR_COLORS[selectedScholar?.id || ''] || '#10b981'}
                  />
                  <Text style={styles.responseTitle}>{selectedScholar?.name} Diyor ki:</Text>
                </View>
                <TouchableOpacity onPress={clearResponse}>
                  <Ionicons name="close-circle" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              <View style={styles.responseContent}>
                <Text style={styles.responseText}>{response}</Text>
              </View>
            </View>
          )}

          {/* Sample Questions */}
          {selectedScholar && !response && (
            <View style={styles.sampleSection}>
              <Text style={styles.sampleTitle}>Örnek Sorular</Text>
              {[
                'Namaz kılmanın fazileti nedir?',
                'Oruç tutmanın hikmetleri nelerdir?',
                'Kur\'an okumaya nasıl başlamalıyım?',
              ].map((q, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.sampleQuestion}
                  onPress={() => setQuestion(q)}
                >
                  <Text style={styles.sampleQuestionText}>{q}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#10b981" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
  scholarCard: {
    width: 120,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scholarCardActive: {
    backgroundColor: '#1e293b',
  },
  scholarAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scholarName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  scholarTitle: {
    color: '#64748b',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  selectedInfo: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedText: {
    flex: 1,
  },
  selectedName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  selectedTitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 2,
  },
  selectedDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    color: '#94a3b8',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  inputSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  questionInput: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    color: '#f8fafc',
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  askButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    gap: 8,
  },
  askButtonDisabled: {
    backgroundColor: '#334155',
  },
  askButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  responseSection: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  responseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  responseTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  responseContent: {
    padding: 16,
  },
  responseText: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 24,
  },
  sampleSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sampleTitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  sampleQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sampleQuestionText: {
    color: '#f8fafc',
    fontSize: 14,
    flex: 1,
  },
});
