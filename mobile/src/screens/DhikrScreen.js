import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';
import { addDhikrLog, upsertUserProgress } from '../services/firebase';

const presets = [33, 99, 100];

export default function DhikrScreen() {
  const { theme } = useTheme();
  const { t } = useLang();
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);

  const increment = async () => {
    const next = count + 1;
    setCount(next);
    if (next % 33 === 0 && user?.uid) {
      addDhikrLog(user.uid, next).catch(() => {});
      upsertUserProgress(user.uid, { totalDhikr: next }).catch(() => {});
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>{t('dhikr')}</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('touchToCount')}</Text>

      <TouchableOpacity style={[styles.counterCircle, { backgroundColor: theme.primary }]} onPress={increment}>
        <Text style={styles.counterText}>{count}</Text>
      </TouchableOpacity>

      <View style={styles.targets}>
        {presets.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.targetBtn, { borderColor: target === p ? theme.primary : theme.border, backgroundColor: theme.card }]}
            onPress={() => setTarget(p)}
          >
            <Text style={{ color: theme.text, fontWeight: '700' }}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ color: theme.textSecondary, marginTop: 12 }}>
        {t('completed')}: %{Math.min(100, Math.round((count / target) * 100))}
      </Text>

      <TouchableOpacity style={[styles.resetBtn, { borderColor: theme.border }]} onPress={() => setCount(0)}>
        <Ionicons name="refresh" size={16} color={theme.primary} />
        <Text style={{ color: theme.text, fontWeight: '700' }}>{t('reset')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { marginTop: 6, marginBottom: 18 },
  counterCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  counterText: { color: '#fff', fontSize: 58, fontWeight: '900' },
  targets: { marginTop: 16, flexDirection: 'row', gap: 10 },
  targetBtn: { borderWidth: 2, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  resetBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
