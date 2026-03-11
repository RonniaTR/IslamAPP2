import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import { fetchUserProgress } from '../services/firebase';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const { t } = useLang();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!user?.uid) return;
      try {
        const data = await fetchUserProgress(user.uid);
        if (mounted) setProgress(data);
      } catch {
        if (mounted) setProgress(null);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const stats = [
    { label: t('totalDhikr'), value: progress?.totalDhikr || 0, icon: 'radio-button-on' },
    { label: t('quranPages'), value: progress?.quranPagesRead || 0, icon: 'book' },
    { label: t('hadithRead'), value: progress?.hadithRead || 0, icon: 'library' },
    { label: t('dayStreak'), value: progress?.streak || 0, icon: 'flame' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={[styles.header, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <View style={[styles.avatar, { backgroundColor: theme.primarySurface }]}>
          <Ionicons name="person" size={32} color={theme.primary} />
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{user?.displayName || t('guest')}</Text>
        <Text style={{ color: theme.textSecondary }}>{user?.email || t('guestMode')}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('worshipStats')}</Text>
      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Ionicons name={s.icon} size={20} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.text }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.shortcuts}>
        {[
          { key: 'notes', route: 'Notes', icon: 'document-text' },
          { key: 'scholars', route: 'Scholars', icon: 'people' },
          { key: 'settings', route: 'Settings', icon: 'settings' },
          { key: 'backToHome', route: 'HomeTab', icon: 'home' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.shortcut, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate(item.route)}
          >
            <Ionicons name={item.icon} size={20} color={theme.primary} />
            <Text style={{ color: theme.text, fontWeight: '600' }}>{t(item.key)}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.logout, { backgroundColor: theme.error }]} onPress={signOut}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    padding: 18,
  },
  avatar: { width: 70, height: 70, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  sectionTitle: { marginHorizontal: 16, marginTop: 8, marginBottom: 10, fontSize: 18, fontWeight: '800' },
  statsGrid: {
    marginHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: { width: '48%', borderRadius: 14, borderWidth: 1, padding: 12 },
  statValue: { fontSize: 22, fontWeight: '800', marginTop: 8 },
  statLabel: { marginTop: 2, fontSize: 12 },
  shortcuts: { marginHorizontal: 16, marginTop: 16, gap: 10 },
  shortcut: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logout: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: { color: '#fff', fontWeight: '800' },
});
