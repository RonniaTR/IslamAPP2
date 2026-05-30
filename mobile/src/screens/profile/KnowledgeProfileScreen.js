import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const categories = [
  { name: 'Kuran', icon: 'book', progress: 0.85, color: '#10b981' },
  { name: 'Siyer', icon: 'shoe-prints', progress: 0.70, color: '#f59e0b' },
  { name: 'Fıkıh', icon: 'mosque', progress: 0.58, color: '#ef4444' },
  { name: 'Hadis', icon: 'scroll', progress: 0.76, color: '#ec4899' },
  { name: 'Ahlak', icon: 'heart', progress: 0.92, color: '#a855f7' },
  { name: 'Tarih', icon: 'clock', progress: 0.54, color: '#3b82f6' },
];

const metricItems = [
  { icon: 'star', value: '1320', label: 'Toplam XP' },
  { icon: 'flame', value: '6', label: 'Gün Serisi' },
  { icon: 'checkmark-circle', value: '5', label: 'Tamamlanan' },
];

export default function KnowledgeProfileScreen() {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Stats Row */}
      <View style={styles.statsRowContainer}>
        {metricItems.map((item, index) => (
          <View key={item.label} style={[styles.statCard, index !== metricItems.length - 1 && { marginRight: 12 }]}>
            <View style={styles.statIconBox}>
              <Ionicons name={item.icon} size={18} color="#ffd369" />
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Category Breakdown Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Kategori Dökümü</Text>

        <View style={styles.categoryList}>
          {categories.map((cat, index) => (
            <View key={cat.name} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIconBox}>
                  <MaterialCommunityIcons name={cat.icon} size={20} color="#ffd369" />
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { width: `${cat.progress * 100}%`, backgroundColor: cat.color }
                  ]}
                />
              </View>

              {/* Percentage Label */}
              <Text style={styles.percentageLabel}>{Math.round(cat.progress * 100)}%</Text>
            </View>
          ))}
        </View>
      </View>

      {/* User Profile Card */}
      <BlurView style={styles.profileCard} intensity={110} tint="dark">
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Leyla</Text>
            <Text style={styles.userRole}>Müfessir Yolcusu</Text>
          </View>
        </View>
      </BlurView>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#032212',
    paddingTop: 12,
  },
  statsRowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statIconBox: {
    marginBottom: 8,
  },
  statValue: {
    color: '#f7e6ae',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#f7e6ae',
    fontSize: 10,
    opacity: 0.5,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#f7e6ae',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  categoryList: {
    gap: 16,
  },
  categoryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    color: '#f7e6ae',
    fontSize: 16,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageLabel: {
    color: '#ffd369',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#ffd369',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#f7e6ae',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  userRole: {
    color: '#f7e6ae',
    fontSize: 12,
    opacity: 0.5,
  },
});
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 221, 105, 0.14)',
    padding: 18,
  },
  avatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  userDetails: {
    marginLeft: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  userRole: {
    color: '#d5cca8',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 209, 105, 0.08)',
    marginHorizontal: 4,
  },
  metricLabel: {
    color: '#d8c896',
    fontSize: 12,
    marginBottom: 6,
  },
  metricValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
