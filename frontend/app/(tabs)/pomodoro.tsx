import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Vibration,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const STUDY_TOPICS = [
  { id: 'quran', name: "Kur'an Okuma", icon: 'book', color: '#8b5cf6' },
  { id: 'hadis', name: 'Hadis Çalışması', icon: 'document-text', color: '#f59e0b' },
  { id: 'tefsir', name: 'Tefsir İnceleme', icon: 'library', color: '#3b82f6' },
  { id: 'fiqh', name: 'Fıkıh Okuma', icon: 'school', color: '#10b981' },
  { id: 'siyer', name: 'Siyer Okuma', icon: 'people', color: '#ec4899' },
  { id: 'diger', name: 'Diğer', icon: 'ellipsis-horizontal', color: '#64748b' },
];

const DURATION_OPTIONS = [15, 25, 45, 60];

interface Session {
  id: string;
  topic: string;
  duration_minutes: number;
  completed: boolean;
  created_at: string;
}

export default function Pomodoro() {
  const [selectedTopic, setSelectedTopic] = useState(STUDY_TOPICS[0]);
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [stats, setStats] = useState({ total_sessions: 0, completed_sessions: 0, total_minutes: 0 });
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initUser();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(duration * 60);
    }
  }, [duration]);

  const initUser = async () => {
    let storedUserId = await AsyncStorage.getItem('pomodoro_user_id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('pomodoro_user_id', storedUserId);
    }
    setUserId(storedUserId);
    loadStats(storedUserId);
    loadSessions(storedUserId);
  };

  const loadStats = async (uid: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/pomodoro/stats/${uid}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadSessions = async (uid: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/pomodoro/${uid}`);
      setRecentSessions(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const startTimer = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/pomodoro`, {
        user_id: userId,
        topic: selectedTopic.name,
        duration_minutes: duration,
      });
      setCurrentSessionId(response.data.id);
    } catch (error) {
      console.error('Error creating session:', error);
    }

    setIsRunning(true);
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    setCurrentSessionId(null);
  };

  const completeSession = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    Vibration.vibrate(Platform.OS === 'ios' ? [0, 500, 200, 500] : 1000);
    
    if (currentSessionId) {
      try {
        await axios.patch(`${BACKEND_URL}/api/pomodoro/${currentSessionId}`, {
          completed: true,
        });
      } catch (error) {
        console.error('Error completing session:', error);
      }
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    setCurrentSessionId(null);
    loadStats(userId);
    loadSessions(userId);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isRunning ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>İlim Pomodoro</Text>
          <Text style={styles.headerSubtitle}>Odaklanarak çalış, ilim öğren</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#f59e0b" />
            <Text style={styles.statValue}>{stats.completed_sessions}</Text>
            <Text style={styles.statLabel}>Tamamlanan</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#10b981" />
            <Text style={styles.statValue}>{Math.round(stats.total_minutes / 60)}sa</Text>
            <Text style={styles.statLabel}>Toplam Süre</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#8b5cf6" />
            <Text style={styles.statValue}>{stats.total_sessions}</Text>
            <Text style={styles.statLabel}>Oturum</Text>
          </View>
        </View>

        {/* Timer Card */}
        <View style={styles.timerCard}>
          {/* Topic Selector */}
          <TouchableOpacity
            style={styles.topicSelector}
            onPress={() => !isRunning && setShowTopicModal(true)}
            disabled={isRunning}
          >
            <View style={[styles.topicIcon, { backgroundColor: `${selectedTopic.color}20` }]}>
              <Ionicons name={selectedTopic.icon as any} size={20} color={selectedTopic.color} />
            </View>
            <Text style={styles.topicText}>{selectedTopic.name}</Text>
            {!isRunning && <Ionicons name="chevron-down" size={20} color="#64748b" />}
          </TouchableOpacity>

          {/* Timer Display */}
          <View style={styles.timerDisplay}>
            <View style={styles.timerCircle}>
              <View style={[styles.progressRing, { 
                borderColor: selectedTopic.color,
                opacity: isRunning ? 1 : 0.3
              }]} />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerLabel}>
                {isRunning ? (isPaused ? 'Duraklatıldı' : 'Çalışıyor') : 'Hazır'}
              </Text>
            </View>
          </View>

          {/* Duration Selector */}
          {!isRunning && (
            <View style={styles.durationSelector}>
              <Text style={styles.durationLabel}>Süre seçin:</Text>
              <View style={styles.durationButtons}>
                {DURATION_OPTIONS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.durationButton,
                      duration === d && styles.durationButtonActive,
                    ]}
                    onPress={() => setDuration(d)}
                  >
                    <Text
                      style={[
                        styles.durationButtonText,
                        duration === d && styles.durationButtonTextActive,
                      ]}
                    >
                      {d}dk
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Control Buttons */}
          <View style={styles.controls}>
            {!isRunning ? (
              <TouchableOpacity
                style={[styles.controlButton, styles.startButton]}
                onPress={startTimer}
              >
                <Ionicons name="play" size={28} color="#ffffff" />
                <Text style={styles.controlButtonText}>Başla</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.runningControls}>
                {isPaused ? (
                  <TouchableOpacity
                    style={[styles.controlButton, styles.resumeButton]}
                    onPress={resumeTimer}
                  >
                    <Ionicons name="play" size={24} color="#ffffff" />
                    <Text style={styles.controlButtonText}>Devam</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.controlButton, styles.pauseButton]}
                    onPress={pauseTimer}
                  >
                    <Ionicons name="pause" size={24} color="#ffffff" />
                    <Text style={styles.controlButtonText}>Duraklat</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.controlButton, styles.stopButton]}
                  onPress={stopTimer}
                >
                  <Ionicons name="stop" size={24} color="#ffffff" />
                  <Text style={styles.controlButtonText}>Durdur</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Son Oturumlar</Text>
            {recentSessions.map((session, index) => (
              <View key={session.id || index} style={styles.sessionItem}>
                <View style={styles.sessionLeft}>
                  <View style={[
                    styles.sessionDot,
                    { backgroundColor: session.completed ? '#10b981' : '#ef4444' }
                  ]} />
                  <View>
                    <Text style={styles.sessionTopic}>{session.topic}</Text>
                    <Text style={styles.sessionDate}>
                      {new Date(session.created_at).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                </View>
                <View style={styles.sessionRight}>
                  <Text style={styles.sessionDuration}>{session.duration_minutes}dk</Text>
                  <Ionicons
                    name={session.completed ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={session.completed ? '#10b981' : '#ef4444'}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Topic Modal */}
      <Modal
        visible={showTopicModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTopicModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Çalışma Konusu Seçin</Text>
              <TouchableOpacity onPress={() => setShowTopicModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            {STUDY_TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicOption,
                  selectedTopic.id === topic.id && styles.topicOptionActive,
                ]}
                onPress={() => {
                  setSelectedTopic(topic);
                  setShowTopicModal(false);
                }}
              >
                <View style={[styles.topicOptionIcon, { backgroundColor: `${topic.color}20` }]}>
                  <Ionicons name={topic.icon as any} size={24} color={topic.color} />
                </View>
                <Text style={styles.topicOptionText}>{topic.name}</Text>
                {selectedTopic.id === topic.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
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
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  timerCard: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
  },
  topicSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicText: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '500',
  },
  timerDisplay: {
    alignItems: 'center',
    marginVertical: 32,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
  },
  timerText: {
    color: '#f8fafc',
    fontSize: 48,
    fontWeight: 'bold',
  },
  timerLabel: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
  },
  durationSelector: {
    marginBottom: 24,
  },
  durationLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  durationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  durationButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#0f172a',
  },
  durationButtonActive: {
    backgroundColor: '#10b981',
  },
  durationButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  durationButtonTextActive: {
    color: '#ffffff',
  },
  controls: {
    alignItems: 'center',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#10b981',
    minWidth: 160,
  },
  pauseButton: {
    backgroundColor: '#f59e0b',
  },
  resumeButton: {
    backgroundColor: '#10b981',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  runningControls: {
    flexDirection: 'row',
    gap: 16,
  },
  recentSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  recentTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sessionTopic: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '500',
  },
  sessionDate: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  sessionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionDuration: {
    color: '#94a3b8',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '600',
  },
  topicOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#0f172a',
  },
  topicOptionActive: {
    borderWidth: 1,
    borderColor: '#10b981',
  },
  topicOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topicOptionText: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 16,
  },
});
