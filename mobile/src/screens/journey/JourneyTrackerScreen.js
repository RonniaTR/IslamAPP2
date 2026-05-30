import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const dummyData = [
  { dayLabel: '1. Gün', title: 'Kuran', subtitle: 'Kuran-ı Kerim...', status: 'completed', xp: '+60', icon: 'book' },
  { dayLabel: '2. Gün', title: 'Siyer', subtitle: 'Peygamber Ef...', status: 'completed', xp: '+60', icon: 'shoe-prints' },
  { dayLabel: '3. Gün', title: 'Fıkıh', subtitle: 'İbadet ve hük...', status: 'completed', xp: '+60', icon: 'mosque' },
  { dayLabel: '4. Gün', title: 'Hadis', subtitle: 'Peygamberimiz...', status: 'active', xp: '+60', icon: 'comment-dots' },
  { dayLabel: '5. Gün', title: 'Ahlak', subtitle: 'Güzel ahlak...', status: 'locked', xp: '+60', icon: 'heart' },
];

function JourneyNode({ item, index, itemCount }) {
  const isCompleted = item.status === 'completed';
  const isActive = item.status === 'active';
  const isLocked = item.status === 'locked';

  return (
    <View style={styles.nodeRow}>
      <View style={styles.timelineColumn}>
        <View style={[styles.lineSegment, index === 0 && styles.hiddenSegment, isCompleted && styles.completedLine]} />
        <View
          style={[
            styles.nodeCircle,
            isCompleted && styles.completedNode,
            isActive && styles.activeNode,
          ]}
        >
          {isCompleted ? (
            <Ionicons name="checkmark" size={20} color="#032212" />
          ) : isActive ? (
            <View style={styles.activeInnerCircle} />
          ) : null}
        </View>
        <View style={[styles.lineSegment, index === itemCount - 1 && styles.hiddenSegment, (isCompleted || isActive) && styles.completedLine]} />
      </View>

      <View style={[styles.cardContainer, isActive && styles.activeCard]}>
        <View style={styles.iconBox}>
          <FontAwesome5 name={item.icon} size={20} color="#f7e6ae" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardDayText}>{item.dayLabel} • {item.title}</Text>
          <Text style={styles.cardSubtitleText}>{item.subtitle}</Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>{item.xp}</Text>
        </View>
      </View>
    </View>
  );
}

export default function JourneyTrackerScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.moonIconBox}>
            <Ionicons name="moon" size={32} color="#ffd369" />
          </View>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerPreTitle}>RAMAZAN YOLCULUĞU</Text>
            <View style={styles.dayProgressRow}>
              <Text style={styles.currentDayText}>6. Gün</Text>
              <Text style={styles.totalDaysText}> / 28</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color="#ffd369" />
            <View style={styles.statLabelBox}>
              <Text style={styles.statValue}>1320</Text>
              <Text style={styles.statLabel}>Toplam XP</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="flame" size={20} color="#ffd369" />
            <View style={styles.statLabelBox}>
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>Gün Serisi</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Yolculuk Adımları</Text>

        {/* Timeline List */}
        <View style={styles.timelineContainer}>
          {dummyData.map((item, index) => (
            <JourneyNode key={item.dayLabel} item={item} index={index} itemCount={dummyData.length} />
          ))}
        </View>
      </ScrollView>

      {/* Custom Bottom Tab Placeholder for visual accuracy */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="map" size={24} color="#ffd369" />
          <Text style={styles.navTextActive}>Yolculuk</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#f7e6ae" opacity={0.6} />
          <Text style={styles.navText}>Profil</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#032212',
  },
  listContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  moonIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 211, 105, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerPreTitle: {
    color: '#f7e6ae',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    opacity: 0.6,
  },
  dayProgressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentDayText: {
    color: '#f7e6ae',
    fontSize: 32,
    fontWeight: '800',
  },
  totalDaysText: {
    color: '#f7e6ae',
    fontSize: 20,
    fontWeight: '400',
    opacity: 0.4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statLabelBox: {
    marginLeft: 12,
  },
  statValue: {
    color: '#f7e6ae',
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: '#f7e6ae',
    fontSize: 10,
    opacity: 0.5,
  },
  sectionTitle: {
    color: '#f7e6ae',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  nodeRow: {
    flexDirection: 'row',
    marginBottom: 16,
    height: 80,
  },
  timelineColumn: {
    width: 40,
    alignItems: 'center',
  },
  lineSegment: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 211, 105, 0.2)',
  },
  completedLine: {
    backgroundColor: '#ffd369',
  },
  hiddenSegment: {
    backgroundColor: 'transparent',
  },
  nodeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 211, 105, 0.2)',
  },
  completedNode: {
    backgroundColor: '#ffd369',
    borderColor: '#ffd369',
  },
  activeNode: {
    backgroundColor: '#ffd369',
    borderColor: '#ffd369',
  },
  activeInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#032212',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 12,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeCard: {
    backgroundColor: 'rgba(255, 211, 105, 0.1)',
    borderColor: 'rgba(255, 211, 105, 0.3)',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardDayText: {
    color: '#f7e6ae',
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitleText: {
    color: '#f7e6ae',
    fontSize: 12,
    opacity: 0.4,
  },
  xpBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  xpText: {
    color: '#ffd369',
    fontSize: 12,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#032212',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#f7e6ae',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  navTextActive: {
    color: '#ffd369',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});

    borderRadius: 24,
    padding: 18,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 30,
    elevation: 4,
  },
  activeCard: {
    borderColor: '#ffd369',
    backgroundColor: 'rgba(255, 215, 117, 0.14)',
  },
  lockedCard: {
    backgroundColor: 'rgba(70, 92, 74, 0.18)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayLabel: {
    color: '#fbe8b4',
    fontSize: 13,
    fontWeight: '700',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitleText: {
    color: '#d6c9a1',
    fontSize: 14,
    lineHeight: 20,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  completedBadge: {
    backgroundColor: 'rgba(255, 211, 105, 0.18)',
  },
  activeBadge: {
    backgroundColor: 'rgba(255, 211, 105, 0.28)',
  },
  lockedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  statusText: {
    color: '#f8d886',
    fontSize: 11,
    fontWeight: '700',
  },
  lockedBadgeText: {
    color: '#9ca28c',
  },
  lockedText: {
    color: '#8f9b86',
  },
});
