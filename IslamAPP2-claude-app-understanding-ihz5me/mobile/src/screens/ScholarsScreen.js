import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';

const SCHOLARS = [
  'Diyanet',
  'Nihat Hatipoglu',
  'Hayrettin Karaman',
  'Mustafa Islamoglu',
  'Omer Nasuhi Bilmen',
  'Elmalili Hamdi Yazir',
  'Said Nursi',
  'Mehmet Okuyan',
  'Suleyman Ates',
  'Yasar Nuri Ozturk',
  'Cubbeli Ahmet',
  'Ali Erbas',
];

function scholarResponse(name, question) {
  return `${name} uslubunda ozet cevap:\n\nSorunuz: ${question}\n\nBu konuda Kur-an ayetleri, sahih hadisler ve fikhin genel ilkeleri birlikte degerlendirilmelidir. Uygulamadaki Kur-an ve Hadis modullerinden ilgili kaynaklari inceleyip, nihai amel icin yerel alimlerden teyit aliniz.`;
}

export default function ScholarsScreen() {
  const { theme } = useTheme();
  const { t } = useLang();
  const [selected, setSelected] = useState(SCHOLARS[0]);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);

  const suggestion = useMemo(
    () => ['Namazda huşu nasil artar?', 'Tefsir okurken hangi usul izlenmeli?', 'Gunluk zikir duzeni nasil olmali?'],
    []
  );

  const ask = () => {
    const q = question.trim();
    if (!q) return;
    setAnswers((prev) => [
      { id: `a-${Date.now()}`, scholar: selected, text: scholarResponse(selected, q) },
      ...prev,
    ]);
    setQuestion('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>{t('scholarSelection')}</Text>

      <FlatList
        horizontal
        data={SCHOLARS}
        keyExtractor={(item) => item}
        style={{ maxHeight: 48 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              {
                borderColor: selected === item ? theme.primary : theme.border,
                backgroundColor: selected === item ? theme.primarySurface : theme.card,
              },
            ]}
            onPress={() => setSelected(item)}
          >
            <Text style={{ color: theme.text, fontWeight: '700', fontSize: 12 }}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={[styles.askBox, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <TextInput
          value={question}
          onChangeText={setQuestion}
          style={[styles.input, { color: theme.text }]}
          placeholder={t('askQuestion')}
          placeholderTextColor={theme.placeholder}
          multiline
        />
        <TouchableOpacity style={[styles.askBtn, { backgroundColor: theme.primary }]} onPress={ask}>
          <Text style={{ color: '#fff', fontWeight: '800' }}>Sor</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('suggestedQuestions')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 10 }}>
        {suggestion.map((s) => (
          <TouchableOpacity key={s} style={[styles.suggestion, { borderColor: theme.border }]} onPress={() => setQuestion(s)}>
            <Text style={{ color: theme.text, fontSize: 12 }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={answers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.answerCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={{ color: theme.primary, fontWeight: '800', marginBottom: 6 }}>{item.scholar}</Text>
            <Text style={{ color: theme.text, lineHeight: 21 }}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  title: { fontSize: 16, fontWeight: '800', marginHorizontal: 16, marginBottom: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  askBox: {
    margin: 16,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: { flex: 1, minHeight: 40, maxHeight: 100 },
  askBtn: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  subtitle: { marginHorizontal: 16, fontWeight: '700', marginBottom: 8 },
  suggestion: { borderWidth: 1, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 10 },
  answerCard: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10 },
});
