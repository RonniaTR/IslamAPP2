import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';

export default function AiChatScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const { user } = useAuth();
  const flatListRef = useRef(null);
  
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      role: 'assistant',
      content: 'Selamün aleyküm! Ben İslami konularda size yardımcı olan bir yapay zeka asistanıyım. Kuran, hadis ve İslami konular hakkında sorularınızı kaynak belirterek cevaplayabilirim. Size nasıl yardımcı olabilirim?',
      sources: []
    },
  ]);

  // Scroll to bottom when new message added
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const send = async () => {
    const prompt = text.trim();
    if (!prompt) return;

    // Check authentication
    if (!user?.uid) {
      Alert.alert(
        t('error'),
        'AI sohbet özelliğini kullanmak için giriş yapmalısınız.',
        [
          { text: 'Tamam', style: 'cancel' },
          { text: 'Giriş Yap', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    const userMessage = { 
      id: `u-${Date.now()}`, 
      role: 'user', 
      content: prompt 
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setText('');
    setLoading(true);

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call Firebase Cloud Function
      const functions = getFunctions();
      const aiChat = httpsCallable(functions, 'aiChat');
      
      const response = await aiChat({
        message: prompt,
        conversationHistory
      });

      const data = response.data;

      if (data.success) {
        const assistantMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          sources: data.sources || []
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Bir hata oluştu');
      }

    } catch (error) {
      console.error('AI Chat error:', error);
      
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      
      if (error.code === 'resource-exhausted') {
        errorMessage = 'Çok fazla istek gönderdiniz. Lütfen bir süre sonra tekrar deneyin.';
      } else if (error.code === 'unauthenticated') {
        errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
      } else if (error.code === 'invalid-argument') {
        errorMessage = error.message || 'Geçersiz mesaj.';
      }

      const errorMsg = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: `❌ ${errorMessage}`,
        sources: []
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderSource = (source) => {
    if (source.type === 'quran') {
      return (
        <TouchableOpacity
          key={`${source.type}-${source.surah}-${source.verse}`}
          style={[styles.sourceBadge, { backgroundColor: theme.primarySurface, borderColor: theme.primary }]}
          onPress={() => {
            // Navigate to Quran screen with surah
            Alert.alert('Kaynak', `${source.surah} ${source.verse}${source.detail ? ':' + source.detail : ''}`);
          }}
        >
          <Ionicons name="book-outline" size={12} color={theme.primary} />
          <Text style={{ color: theme.primary, fontSize: 11, fontWeight: '700' }}>
            {source.surah} {source.verse}{source.detail ? ':' + source.detail : ''}
          </Text>
        </TouchableOpacity>
      );
    } else if (source.type === 'hadith') {
      const secondaryColor = theme.secondary || theme.primary;
      const secondarySurface = theme.secondarySurface || theme.primarySurface;
      return (
        <TouchableOpacity
          key={`${source.type}-${source.source}-${source.number}`}
          style={[styles.sourceBadge, { backgroundColor: secondarySurface, borderColor: secondaryColor }]}
          onPress={() => {
            Alert.alert('Kaynak', `${source.source} - Hadis ${source.number}`);
          }}
        >
          <Ionicons name="document-text-outline" size={12} color={secondaryColor} />
          <Text style={{ color: secondaryColor, fontSize: 11, fontWeight: '700' }}>
            {source.source} #{source.number}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const clearChat = () => {
    Alert.alert(
      'Sohbeti Temizle',
      'Tüm mesajlarınız silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: () => {
            setMessages([
              {
                id: 'm-1',
                role: 'assistant',
                content: 'Selamün aleyküm! Size nasıl yardımcı olabilirim?',
                sources: []
              }
            ]);
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with clear button */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>AI İslami Danışman</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 11 }}>
            Kaynak destekli rehberlik
          </Text>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user'
                ? { backgroundColor: theme.primary, alignSelf: 'flex-end' }
                : { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1, alignSelf: 'flex-start' },
            ]}
          >
            <Text style={{ color: item.role === 'user' ? '#fff' : theme.text, lineHeight: 21 }}>
              {item.content}
            </Text>
            
            {/* Render sources if available */}
            {item.sources && item.sources.length > 0 && (
              <View style={styles.sourcesContainer}>
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>
                  Kaynaklar:
                </Text>
                <View style={styles.sourcesRow}>
                  {item.sources.map(source => renderSource(source))}
                </View>
              </View>
            )}
          </View>
        )}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={{ color: theme.textSecondary, fontSize: 12, marginLeft: 8 }}>
            Cevap hazırlanıyor...
          </Text>
        </View>
      )}

      <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.card }]}> 
        <TextInput
          value={text}
          onChangeText={setText}
          style={[styles.input, { color: theme.text }]}
          placeholder={t('askQuestion')}
          placeholderTextColor={theme.placeholder}
          multiline
          editable={!loading}
        />
        <TouchableOpacity 
          style={[
            styles.send, 
            { backgroundColor: loading ? theme.disabled : theme.primary }
          ]} 
          onPress={send}
          disabled={loading || !text.trim()}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Disclaimer */}
      <View style={[styles.disclaimer, { backgroundColor: theme.primarySurface }]}>
        <Ionicons name="information-circle-outline" size={14} color={theme.textSecondary} />
        <Text style={{ color: theme.textSecondary, fontSize: 10, flex: 1 }}>
          AI yanıtları bilgilendirme amaçlıdır. Önemli dini konularda yetkili alimlere danışın.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  clearBtn: {
    padding: 8,
  },
  bubble: {
    maxWidth: '88%',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  sourcesContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  sourcesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  inputRow: {
    margin: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: { flex: 1, maxHeight: 110 },
  send: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
});
