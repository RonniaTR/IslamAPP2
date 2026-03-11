import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';

export default function LoginScreen() {
  const { signInWithGoogle, signInAsGuest, googleRequest } = useAuth();
  const { theme } = useTheme();
  const { t } = useLang();

  return (
    <LinearGradient colors={[theme.primaryDark, theme.primary, '#102A1A']} style={styles.container}>
      <View style={styles.overlay}>
        <Ionicons name="moon" size={54} color={theme.accentLight} />
        <Text style={styles.title}>IslamAPP</Text>
        <Text style={styles.subtitle}>{t('greeting')}</Text>

        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: '#fff' }]}
          onPress={signInWithGoogle}
          disabled={!googleRequest}
        >
          <Ionicons name="logo-google" size={20} color="#EA4335" />
          <Text style={styles.mainButtonText}>{t('googleSignIn')}</Text>
          {!googleRequest && <ActivityIndicator size="small" color="#666" />}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.ghostButton, { borderColor: theme.accentLight }]} onPress={signInAsGuest}>
          <Text style={[styles.ghostText, { color: '#fff' }]}>{t('guestSignIn')}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginTop: 20,
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 40,
    fontSize: 16,
    color: '#f0f0f0',
  },
  mainButton: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  mainButtonText: {
    fontSize: 15,
    color: '#202020',
    fontWeight: '700',
  },
  ghostButton: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  ghostText: {
    fontWeight: '700',
    fontSize: 15,
  },
});
