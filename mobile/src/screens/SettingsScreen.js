import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const { t, lang, setLang, LANGUAGES } = useLang();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{t('settings')}</Text>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('theme')}</Text>
        <View style={styles.row}> 
          <Text style={{ color: theme.textSecondary }}>{isDark ? t('darkTheme') : t('lightTheme')}</Text>
          <Switch value={isDark} onValueChange={toggleTheme} thumbColor={isDark ? theme.primary : '#f4f3f4'} />
        </View>
        <View style={styles.themeRow}>
          <TouchableOpacity
            style={[styles.themeCard, { borderColor: !isDark ? theme.primary : theme.border, backgroundColor: '#F8F8F0' }]}
            onPress={() => setTheme('light')}
          >
            <Text style={{ color: '#202020', fontWeight: '700' }}>{t('lightTheme')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeCard, { borderColor: isDark ? theme.primary : theme.border, backgroundColor: '#171717' }]}
            onPress={() => setTheme('dark')}
          >
            <Text style={{ color: '#EAEAEA', fontWeight: '700' }}>{t('darkTheme')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('language')}</Text>
        {LANGUAGES.map((item) => (
          <TouchableOpacity
            key={item.code}
            style={[styles.langItem, { borderColor: theme.border, backgroundColor: lang === item.code ? theme.primarySurface : 'transparent' }]}
            onPress={() => setLang(item.code)}
          >
            <Text style={{ fontSize: 18 }}>{item.flag}</Text>
            <Text style={[styles.langText, { color: theme.text }]}>{item.name}</Text>
            <View style={[styles.dot, { backgroundColor: lang === item.code ? theme.primary : theme.border }]} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  section: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  themeRow: { marginTop: 12, flexDirection: 'row', gap: 10 },
  themeCard: { flex: 1, borderWidth: 2, borderRadius: 12, padding: 12, alignItems: 'center' },
  langItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  langText: { flex: 1, fontSize: 15, fontWeight: '600' },
  dot: { width: 14, height: 14, borderRadius: 7 },
});
