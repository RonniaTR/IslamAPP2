import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchHadithPage, getHadithCategories, getHadithSources } from '../services/hadithService';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';

export default function HadithScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, lang } = useLang();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tümü');
  const [source, setSource] = useState('Tümü');
  const [categories] = useState(getHadithCategories());
  const [sources] = useState(getHadithSources());
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const nextPage = reset ? 1 : page;
      const res = await fetchHadithPage({ 
        query, 
        category, 
        source, 
        page: nextPage, 
        pageSize: 20 
      });
      setItems((prev) => (reset ? res.data : [...prev, ...res.data]));
      setTotal(res.total);
      setHasMore(res.hasMore);
      setPage(nextPage + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(true);
  }, [query, category, source]);

  // Get hadith text based on language
  const getHadithText = (hadith) => {
    if (lang === 'ar') return hadith.arabic;
    if (lang === 'en') return hadith.english;
    return hadith.turkish;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.hadithBg || theme.background }]}> 
      {/* Search Bar */}
      <View style={[styles.searchRow, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <Ionicons name="search" size={18} color={theme.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          style={[styles.input, { color: theme.text }]}
          placeholder={t('searchHadith')}
          placeholderTextColor={theme.placeholder}
        />
      </View>

      {/* Category Filter */}
      <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Kategori:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.chip,
              {
                borderColor: category === item ? theme.primary : theme.border,
                backgroundColor: category === item ? theme.primarySurface : theme.card,
              },
            ]}
            onPress={() => setCategory(item)}
          >
            <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12 }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Source Filter */}
      <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Kaynak:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 10 }}
      >
        {sources.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.chip,
              {
                borderColor: source === item ? theme.primary : theme.border,
                backgroundColor: source === item ? theme.primarySurface : theme.card,
              },
            ]}
            onPress={() => setSource(item)}
          >
            <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12 }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.count, { color: theme.textSecondary }]}>{total} {t('hadithCount')}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 30 }}
        onEndReached={() => hasMore && load(false)}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('HadithDetail', { hadithId: item.id })}
          >
            {/* Arabic text */}
            <Text style={[styles.arabicText, { color: theme.text }]} numberOfLines={2}>
              {item.arabic}
            </Text>
            
            {/* Translation */}
            <Text style={[styles.text, { color: theme.text }]} numberOfLines={3}>
              {getHadithText(item)}
            </Text>
            
            {/* Meta info */}
            <View style={styles.metaRow}>
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '600' }}>
                  {item.narrator}
                </Text>
                <Text style={{ color: theme.primary, fontSize: 10, fontWeight: '700' }}>
                  {item.source} • {item.number}
                </Text>
              </View>
              <View style={[styles.gradeBadge, { backgroundColor: item.grade === 'Sahih' ? '#4CAF50' : '#FF9800' }]}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{item.grade}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={loading ? <ActivityIndicator size="small" color={theme.primary} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: {
    margin: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  input: { flex: 1, fontSize: 14 },
  filterLabel: { marginLeft: 16, marginBottom: 6, fontSize: 12, fontWeight: '700' },
  chip: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  count: { marginHorizontal: 16, marginBottom: 4, fontSize: 12 },
  card: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10 },
  arabicText: { 
    fontSize: 16, 
    lineHeight: 28, 
    fontWeight: '600', 
    textAlign: 'right',
    marginBottom: 8 
  },
  text: { fontSize: 14, lineHeight: 21, fontWeight: '500', marginBottom: 8 },
  metaRow: { 
    marginTop: 4, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
