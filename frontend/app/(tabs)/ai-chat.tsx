import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const SAMPLE_QUESTIONS = [
  'Namaz nasıl kılınır?',
  'Oruç kimlere farzdır?',
  'Zekat nedir?',
  'Abdest nasıl alınır?',
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    let storedSessionId = await AsyncStorage.getItem('chat_session_id');
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('chat_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
    loadChatHistory(storedSessionId);
  };

  const loadChatHistory = async (sid: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/ai/history/${sid}`);
      if (response.data && response.data.length > 0) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || loading) return;

    Keyboard.dismiss();
    setInputText('');
    
    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/ai/chat`, {
        session_id: sessionId,
        message: messageText,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const clearChat = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/ai/history/${sessionId}`);
      setMessages([]);
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('chat_session_id', newSessionId);
      setSessionId(newSessionId);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Ionicons name="sparkles" size={24} color="#10b981" />
            </View>
            <View>
              <Text style={styles.headerTitle}>İslami Bilgi Asistanı</Text>
              <Text style={styles.headerSubtitle}>Sorularınızı yanıtlamaya hazırım</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
            <Ionicons name="trash-outline" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="chatbubbles-outline" size={48} color="#64748b" />
              </View>
              <Text style={styles.emptyTitle}>Merhaba!</Text>
              <Text style={styles.emptyText}>
                Ben İslami konularda size yardımcı olabilecek bir AI asistanıyım. 
                Namaz, oruç, zekat, hac ve diğer dini konularda sorularınızı sorabilirsiniz.
              </Text>
              
              <Text style={styles.sampleTitle}>Örnek Sorular:</Text>
              <View style={styles.sampleQuestions}>
                {SAMPLE_QUESTIONS.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.sampleQuestion}
                    onPress={() => sendMessage(question)}
                  >
                    <Text style={styles.sampleQuestionText}>{question}</Text>
                    <Ionicons name="arrow-forward" size={16} color="#10b981" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {msg.role === 'assistant' && (
                  <View style={styles.assistantAvatar}>
                    <Ionicons name="sparkles" size={16} color="#10b981" />
                  </View>
                )}
                <View style={[
                  styles.messageContent,
                  msg.role === 'user' ? styles.userContent : styles.assistantContent,
                ]}>
                  <Text style={[
                    styles.messageText,
                    msg.role === 'user' ? styles.userText : styles.assistantText,
                  ]}>
                    {msg.content}
                  </Text>
                </View>
              </View>
            ))
          )}
          
          {loading && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <View style={styles.assistantAvatar}>
                <Ionicons name="sparkles" size={16} color="#10b981" />
              </View>
              <View style={[styles.messageContent, styles.assistantContent, styles.loadingContent]}>
                <ActivityIndicator size="small" color="#10b981" />
                <Text style={styles.loadingText}>Düşünüyorum...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Bir soru sorun..."
              placeholderTextColor="#64748b"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage()}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || loading) && styles.sendButtonDisabled,
              ]}
              onPress={() => sendMessage()}
              disabled={!inputText.trim() || loading}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() && !loading ? '#ffffff' : '#64748b'}
              />
            </TouchableOpacity>
          </View>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10b98120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  clearButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  sampleTitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  sampleQuestions: {
    width: '100%',
    gap: 8,
  },
  sampleQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sampleQuestionText: {
    color: '#f8fafc',
    fontSize: 14,
    flex: 1,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageContent: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '100%',
  },
  userContent: {
    backgroundColor: '#10b981',
    borderBottomRightRadius: 4,
  },
  assistantContent: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#ffffff',
  },
  assistantText: {
    color: '#f8fafc',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#0a1628',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1e293b',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#334155',
  },
});
