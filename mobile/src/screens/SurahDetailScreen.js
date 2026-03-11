import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { fetchSurah, fetchTafsir, TAFSIR_SCHOLARS, buildScholarStyleTafsir } from '../services/quranService';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';
import { saveTafsirNote, saveUserNote, upsertUserProgress } from '../services/firebase';

export default function SurahDetailScreen({ route }) {
  const { surahNumber } = route.params;
  const { theme } = useTheme();
  const { t } = useLang();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tafsirMap, setTafsirMap] = useState({});
  const [loadingTafsir, setLoadingTafsir] = useState(null);
  const [scholar, setScholar] = useState(TAFSIR_SCHOLARS[0]);
  const [tafsirMode, setTafsirMode] = useState(true);
  const loadedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const res = await fetchSurah(surahNumber, 'tr.diyanet');
        if (mounted) setData(res);
      } catch {
        if (mounted) Alert.alert(t('error'), t('surahError'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [surahNumber, t]);

  useEffect(() => {
    if (!data || loadedRef.current) return;
    loadedRef.current = true;
    upsertUserProgress(user?.uid || 'guest', { quranPagesRead: (data.meta?.number || 0) }).catch(() => {});
  }, [data, user?.uid]);

  const loadTafsir = async (ayah) => {
    const key = `${scholar.id}-${ayah.numberInSurah}`;
    if (tafsirMap[key]) return;
    setLoadingTafsir(ayah.numberInSurah);
    try {
      const raw = await fetchTafsir(surahNumber, ayah.numberInSurah, scholar.edition);
      const built = buildScholarStyleTafsir({
        scholarId: scholar.id,
        ayahArabic: ayah.arabic,
        ayahTranslation: ayah.translation,
        baseTafsir: raw?.text || '',
      });
      setTafsirMap((prev) => ({ ...prev, [key]: built }));
    } catch {
      const fallback = buildScholarStyleTafsir({
        scholarId: scholar.id,
        ayahArabic: ayah.arabic,
        ayahTranslation: ayah.translation,
        baseTafsir: '',
      });
      setTafsirMap((prev) => ({ ...prev, [key]: fallback }));
    } finally {
      setLoadingTafsir(null);
    }
  };

  const saveAyahNote = async (ayah) => {
    try {
      if (!user?.uid) return;
      await saveUserNote(user.uid, {
        title: `Sure ${surahNumber} / Ayet ${ayah.numberInSurah}`,
        content: `${ayah.arabic}\n\n${ayah.translation}`,
        type: 'ayah',
        source: 'quran',
        meta: { surahNumber, ayahNumber: ayah.numberInSurah },
      });
      Alert.alert(t('save'), t('savedSuccessfully'));
    } catch {
      Alert.alert(t('error'), 'Kayit sirasinda bir hata olustu.');
    }
  };

  const saveTafsirAsNote = async (ayah, text) => {
    try {
      if (!user?.uid) return;
      await saveTafsirNote(user.uid, {
        scholarId: scholar.id,
        scholarName: scholar.name,
        surahNumber,
        ayahNumber: ayah.numberInSurah,
        ayah: ayah.arabic,
        translation: ayah.translation,
        tafsir: text,
      });
      await saveUserNote(user.uid, {
        title: `${scholar.name} - ${surahNumber}:${ayah.numberInSurah}`,
        content: text,
        type: 'tafsir',
        source: 'tafsir',
        meta: { surahNumber, ayahNumber: ayah.numberInSurah, scholarId: scholar.id },
      });
      Alert.alert(t('save'), t('savedSuccessfully'));
    } catch {
      Alert.alert(t('error'), 'Tefsir notu kaydedilemedi.');
    }
  };

  const header = useMemo(() => {
    if (!data?.meta) return null;
    return (
      <View style={[styles.metaCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <Text style={[styles.surahTitle, { color: theme.text }]}>{data.meta.englishName}</Text>
        <Text style={[styles.surahSub, { color: theme.textSecondary }]}>
          {data.meta.name} • {data.meta.numberOfAyahs} Ayet • {data.meta.revelationType}
        </Text>

        <View style={styles.scholarRow}>
          {TAFSIR_SCHOLARS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.scholarChip,
                {
                  borderColor: scholar.id === item.id ? item.color : theme.border,
                  backgroundColor: scholar.id === item.id ? item.color : 'transparent',
                },
              ]}
              onPress={() => setScholar(item)}
            >
              <Text style={{ color: scholar.id === item.id ? '#fff' : theme.text, fontSize: 12, fontWeight: '700' }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.modeBtn, { borderColor: theme.border }]} onPress={() => setTafsirMode((p) => !p)}>
          <Ionicons name={tafsirMode ? 'eye' : 'eye-off'} size={16} color={theme.primary} />
          <Text style={{ color: theme.text, fontWeight: '700' }}>{t('tafsirMode')}</Text>
        </TouchableOpacity>
      </View>
    );
  }, [data?.meta, theme, scholar.id, t, tafsirMode]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      data={data?.ayahs || []}
      keyExtractor={(i) => String(i.numberInSurah)}
      ListHeaderComponent={header}
      contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 40 }}
      renderItem={({ item }) => {
        const key = `${scholar.id}-${item.numberInSurah}`;
        const tafsirText = tafsirMap[key];
        return (
          <View style={[styles.ayahCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.arabic, { color: theme.text }]}>{item.arabic}</Text>
            <Text style={[styles.translation, { color: theme.textSecondary }]}>{item.numberInSurah}. {item.translation}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: theme.border }]}
                onPress={() => Clipboard.setStringAsync(`${item.arabic}\n${item.translation}`)}
              >
                <Ionicons name="copy-outline" size={15} color={theme.primary} />
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12 }}>{t('copy')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.border }]} onPress={() => saveAyahNote(item)}>
                <Ionicons name="bookmark-outline" size={15} color={theme.primary} />
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12 }}>{t('saveNote')}</Text>
              </TouchableOpacity>
              {tafsirMode && (
                <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.border }]} onPress={() => loadTafsir(item)}>
                  <Ionicons name="sparkles-outline" size={15} color={theme.primary} />
                  <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12 }}>{t('tafsir')}</Text>
                </TouchableOpacity>
              )}
            </View>

            {tafsirMode && loadingTafsir === item.numberInSurah && <ActivityIndicator size="small" color={theme.primary} />}

            {tafsirMode && !!tafsirText && (
              <View style={[styles.tafsirBox, { backgroundColor: theme.tafsirBg, borderColor: theme.border }]}> 
                <Text style={[styles.tafsirTitle, { color: theme.text }]}>{scholar.name}</Text>
                <Text style={{ color: theme.textSecondary, lineHeight: 22 }}>{tafsirText}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { borderColor: theme.border }]}
                    onPress={() => Clipboard.setStringAsync(tafsirText)}
                  >
                    <Ionicons name="copy-outline" size={15} color={theme.primary} />
                    <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12 }}>{t('copy')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { borderColor: theme.border }]}
                    onPress={() => saveTafsirAsNote(item, tafsirText)}
                  >
                    <Ionicons name="bookmark-outline" size={15} color={theme.primary} />
                    <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12 }}>{t('saveNote')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  metaCard: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10 },
  surahTitle: { fontSize: 20, fontWeight: '800' },
  surahSub: { marginTop: 4 },
  scholarRow: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  scholarChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 },
  modeBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ayahCard: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10 },
  arabic: { fontSize: 27, lineHeight: 46, textAlign: 'right', fontFamily: 'serif' },
  translation: { marginTop: 8, lineHeight: 22 },
  actionRow: { marginTop: 10, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tafsirBox: { marginTop: 10, borderWidth: 1, borderRadius: 12, padding: 10 },
  tafsirTitle: { fontWeight: '800', marginBottom: 5 },
});
