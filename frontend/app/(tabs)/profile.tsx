import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface UserStats {
  total_points: number;
  current_streak: number;
  longest_streak: number;
  quran_pages_read: number;
  hadith_read: number;
  pomodoro_minutes: number;
  level: number;
  badges: string[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const BADGE_ICONS: { [key: string]: string } = {
  first_step: 'footsteps',
  quran_starter: 'book',
  hadith_learner: 'school',
  streak_3: 'flame',
  streak_7: 'flame',
  streak_30: 'trophy',
  pomodoro_master: 'timer',
  scholar_seeker: 'people',
  level_5: 'star',
  level_10: 'star',
};

export default function ProfileScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initUser();
  }, []);

  const initUser = async () => {
    let storedUserId = await AsyncStorage.getItem('user_id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('user_id', storedUserId);
    }
    setUserId(storedUserId);
    fetchData(storedUserId);
  };

  const fetchData = async (uid: string) => {
    try {
      const [statsRes, badgesRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/gamification/stats/${uid}`),
        axios.get(`${BACKEND_URL}/api/gamification/badges`),
      ]);
      setStats(statsRes.data);
      setBadges(badgesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(userId);
  };

  const getProgressToNextLevel = () => {
    if (!stats) return 0;
    const levelThresholds = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000, 5000];
    const currentThreshold = levelThresholds[stats.level - 1] || 0;
    const nextThreshold = levelThresholds[stats.level] || 5000;
    const progress = (stats.total_points - currentThreshold) / (nextThreshold - currentThreshold);
    return Math.min(progress * 100, 100);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Profil yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color="#10b981" />
          </View>
          <Text style={styles.levelText}>Seviye {stats?.level || 1}</Text>
          <Text style={styles.pointsText}>{stats?.total_points || 0} Puan</Text>
          
          {/* Level Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${getProgressToNextLevel()}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Sonraki seviyeye: %{Math.round(100 - getProgressToNextLevel())}
            </Text>
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Ionicons name="flame" size={32} color="#f59e0b" />
          </View>
          <View style={styles.streakInfo}>
            <Text style={styles.streakValue}>{stats?.current_streak || 0} Gün</Text>
            <Text style={styles.streakLabel}>Mevcut Seri</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakInfo}>
            <Text style={styles.streakValue}>{stats?.longest_streak || 0} Gün</Text>
            <Text style={styles.streakLabel}>En Uzun Seri</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İstatistikler</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="book" size={24} color="#8b5cf6" />
              <Text style={styles.statValue}>{stats?.quran_pages_read || 0}</Text>
              <Text style={styles.statLabel}>Kur'an Sayfası</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="library" size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{stats?.hadith_read || 0}</Text>
              <Text style={styles.statLabel}>Hadis Okunan</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="timer" size={24} color="#10b981" />
              <Text style={styles.statValue}>{Math.round((stats?.pomodoro_minutes || 0) / 60)}sa</Text>
              <Text style={styles.statLabel}>Odaklanma</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rozetler</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => {
              const isEarned = stats?.badges?.includes(badge.id);
              return (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    !isEarned && styles.badgeCardLocked,
                  ]}
                >
                  <View style={[
                    styles.badgeIcon,
                    isEarned && styles.badgeIconEarned,
                  ]}>
                    <Ionicons
                      name={(BADGE_ICONS[badge.id] || 'medal') as any}
                      size={24}
                      color={isEarned ? '#10b981' : '#64748b'}
                    />
                  </View>
                  <Text style={[
                    styles.badgeName,
                    !isEarned && styles.badgeNameLocked,
                  ]}>
                    {badge.name}
                  </Text>
                  <Text style={styles.badgeDesc} numberOfLines={2}>
                    {badge.description}
                  </Text>
                  {!isEarned && (
                    <View style={styles.lockIcon}>
                      <Ionicons name="lock-closed" size={12} color="#64748b" />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/(tabs)/pomodoro')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#10b98120' }]}>
              <Ionicons name="timer" size={20} color="#10b981" />
            </View>
            <Text style={styles.actionText}>İlim Pomodoro</Text>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/(tabs)/qibla')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#3b82f620' }]}>
              <Ionicons name="compass" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.actionText}>Kıble Pusulası</Text>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/(tabs)/ai-chat')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#8b5cf620' }]}>
              <Ionicons name="chatbubbles" size={20} color="#8b5cf6" />
            </View>
            <Text style={styles.actionText}>AI Asistan</Text>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
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
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#10b98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  pointsText: {
    color: '#f8fafc',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
  },
  streakIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f59e0b20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakInfo: {
    flex: 1,
    alignItems: 'center',
  },
  streakValue: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 'bold',
  },
  streakLabel: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
    marginHorizontal: 16,
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
  statsGrid: {
    flexDirection: 'row',
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
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '31%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIconEarned: {
    backgroundColor: '#10b98120',
  },
  badgeName: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#64748b',
  },
  badgeDesc: {
    color: '#64748b',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  lockIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 16,
  },
});
