import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchSurahs, searchQuran } from '../services/quranService';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';

export default function QuranListScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const [surahs, setSurahs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const data = await fetchSurahs();
        if (mounted) {
          setSurahs(data);
          setFiltered(data);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const onFilter = (text) => {
    setQuery(text);
    if (!text.trim()) {
      setFiltered(surahs);
      setResults([]);
      return;
    }
    const q = text.toLowerCase();
    setFiltered(
      surahs.filter(
        (s) =>
          s.number.toString() === q ||
          s.englishName.toLowerCase().includes(q) ||
          (s.englishNameTranslation || '').toLowerCase().includes(q) ||
          s.name.includes(text)
      )
    );
  };

  const onVerseSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const data = await searchQuran(query, 'tr.diyanet');
      setResults(data.matches || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}> 
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchRow, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <Ionicons name="search" size={18} color={theme.textMuted} />
        <TextInput
          value={query}
          onChangeText={onFilter}
          style={[styles.input, { color: theme.text }]}
          placeholder={t('searchSurah')}
          placeholderTextColor={theme.placeholder}
        />
        <TouchableOpacity style={[styles.searchBtn, { backgroundColor: theme.primary }]} onPress={onVerseSearch}>
          <Text style={styles.searchBtnText}>{t('searchVerse')}</Text>
        </TouchableOpacity>
      </View>

      {!!results.length && (
        <View style={[styles.resultBox, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.resultTitle, { color: theme.text }]}>Ayet Sonuclari ({results.length})</Text>
          {results.slice(0, 5).map((item) => (
            <TouchableOpacity
              key={`${item.surah.number}-${item.numberInSurah}`}
              onPress={() => navigation.navigate('SurahDetail', { surahNumber: item.surah.number, initialAyah: item.numberInSurah })}
              style={[styles.resultItem, { borderColor: theme.borderLight }]}
            >
              <Text style={{ color: theme.text, fontWeight: '700' }}>
                {item.surah.englishName} {item.numberInSurah}
              </Text>
              <Text style={{ color: theme.textSecondary }} numberOfLines={2}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {searching ? (
        <ActivityIndicator size="small" color={theme.primary} style={{ marginTop: 12 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.number)}
          contentContainerStyle={{ padding: 16, paddingTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.surahCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => navigation.navigate('SurahDetail', { surahNumber: item.number })}
            >
              <View style={[styles.numberBadge, { backgroundColor: theme.primarySurface }]}> 
                <Text style={[styles.numberText, { color: theme.primary }]}>{item.number}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.surahName, { color: theme.text }]}>{item.englishName}</Text>
                <Text style={[styles.surahMeta, { color: theme.textSecondary }]}>
                  {item.englishNameTranslation} • {item.numberOfAyahs} Ayet
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchRow: {
    margin: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  input: { flex: 1, fontSize: 14 },
  searchBtn: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  surahCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numberBadge: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontWeight: '800' },
  surahName: { fontSize: 16, fontWeight: '800' },
  surahMeta: { marginTop: 2, fontSize: 12 },
  resultBox: { marginHorizontal: 16, marginTop: 6, borderRadius: 14, borderWidth: 1, padding: 10 },
  resultTitle: { fontWeight: '800', marginBottom: 6 },
  resultItem: { borderTopWidth: 1, paddingTop: 8, marginTop: 8 },
});
