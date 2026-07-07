import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';

export default function SuccessScreen({ xp, onContinue }) {
  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <View style={styles.screen}>
      <LottieView
        source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_m8p6bxlt.json' }}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      <Text style={styles.title}>Elhamdülillah, Günlük Görev Tamamlandı!</Text>
      <Text style={styles.subtitle}>Bilgini taçlandırdın ve yolculuğuna XP kazandırdın.</Text>
      <View style={styles.rewardCard}>
        <Text style={styles.rewardLabel}>Kazanılan XP</Text>
        <Text style={styles.rewardValue}>{xp}</Text>
      </View>
      <Pressable onPress={onContinue} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>Devam Et</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#041c12',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  lottie: {
    width: 240,
    height: 240,
    marginBottom: 12,
  },
  title: {
    color: '#f7e6ae',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#d8d2b0',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
  },
  rewardCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 221, 105, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 221, 105, 0.28)',
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 24,
    alignItems: 'center',
  },
  rewardLabel: {
    color: '#d5cca8',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  rewardValue: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '900',
  },
  button: {
    width: '100%',
    backgroundColor: '#ffd369',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#ffd369',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#08220f',
    fontSize: 16,
    fontWeight: '800',
  },
});
