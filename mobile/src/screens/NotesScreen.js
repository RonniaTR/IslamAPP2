import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserNotes, removeUserNote, saveUserNote } from '../services/firebase';

export default function NotesScreen() {
  const { theme } = useTheme();
  const { t } = useLang();
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const load = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const data = await fetchUserNotes(user.uid);
      setNotes(data);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.uid]);

  const createNote = async () => {
    if (!title.trim() || !content.trim() || !user?.uid) return;
    try {
      await saveUserNote(user.uid, { title, content, type: 'general', source: 'manual' });
      setTitle('');
      setContent('');
      setModal(false);
      load();
    } catch {
      Alert.alert(t('error'), 'Not kaydedilemedi');
    }
  };

  const onDelete = (id) => {
    Alert.alert(t('delete'), 'Not silinsin mi?', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await removeUserNote(id);
            load();
          } catch {
            Alert.alert(t('error'), 'Not silinemedi');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
          ListEmptyComponent={<Text style={{ color: theme.textSecondary }}>{t('noNotes')}</Text>}
          renderItem={({ item }) => (
            <View style={[styles.noteCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.noteTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.noteContent, { color: theme.textSecondary }]} numberOfLines={5}>{item.content}</Text>
                <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 6 }}>{item.type || 'general'}</Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
                <Ionicons name="trash-outline" size={18} color={theme.error} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={() => setModal(true)}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}> 
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t('addNote')}</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text }]}
              placeholder={t('noteTitle')}
              placeholderTextColor={theme.placeholder}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea, { borderColor: theme.border, color: theme.text }]}
              placeholder={t('noteContent')}
              placeholderTextColor={theme.placeholder}
              value={content}
              onChangeText={setContent}
              multiline
            />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, { borderColor: theme.border }]} onPress={() => setModal(false)}>
                <Text style={{ color: theme.text }}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={createNote}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noteCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10,
  },
  noteTitle: { fontSize: 16, fontWeight: '800' },
  noteContent: { marginTop: 4, lineHeight: 20 },
  deleteBtn: { padding: 4 },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 16,
    minHeight: 300,
  },
  modalTitle: { fontWeight: '800', fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 10 },
  textArea: { minHeight: 110, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  btn: { borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
});
