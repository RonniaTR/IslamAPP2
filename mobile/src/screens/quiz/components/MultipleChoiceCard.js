import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

function ChoiceButton({ label, onPress }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.choiceWrapper, animatedStyle]}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.96, { stiffness: 200, damping: 16 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { stiffness: 220, damping: 16 });
        }}
        style={({ pressed }) => [
          styles.choiceButton,
          pressed && styles.choiceButtonPressed,
        ]}
      >
        <Text style={styles.choiceText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function MultipleChoiceCard({ question, onSelect }) {
  return (
    <BlurView intensity={120} tint="dark" style={styles.card}>
      <Text style={styles.typeLabel}>Çoktan Seçmeli</Text>
      <Text style={styles.questionText}>{question.text || question.question}</Text>
      <View style={styles.optionsContainer}>
        {question.options?.map((option, index) => (
          <ChoiceButton key={index} label={option} onPress={() => onSelect(index)} />
        ))}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 221, 105, 0.16)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 8,
  },
  typeLabel: {
    color: '#ffd87d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  questionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 20,
  },
  optionsContainer: {
    marginTop: -4,
  },
  choiceWrapper: {
    borderRadius: 20,
    marginBottom: 12,
  },
  choiceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  choiceButtonPressed: {
    backgroundColor: 'rgba(255, 221, 105, 0.16)',
  },
  choiceText: {
    color: '#f6e3a1',
    fontSize: 15,
    fontWeight: '700',
  },
});
