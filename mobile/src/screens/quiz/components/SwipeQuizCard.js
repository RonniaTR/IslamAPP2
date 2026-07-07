import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const windowWidth = Dimensions.get('window').width;
const SWIPE_THRESHOLD = windowWidth * 0.28;

export default function SwipeQuizCard({ question, onSwipe }) {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      rotate.value = interpolate(translateX.value, [-windowWidth / 2, 0, windowWidth / 2], [-16, 0, 16]);
    },
    onEnd: (event) => {
      const direction = event.translationX > SWIPE_THRESHOLD ? 'true' : event.translationX < -SWIPE_THRESHOLD ? 'false' : null;
      if (direction) {
        runOnJS(triggerHaptic)();
        translateX.value = withSpring(direction === 'true' ? windowWidth : -windowWidth, {
          stiffness: 160,
          damping: 14,
        });
        opacity.value = withSpring(0, { stiffness: 120, damping: 12 }, () => {
          runOnJS(onSwipe)(direction === 'true');
          translateX.value = 0;
          opacity.value = 1;
          rotate.value = 0;
        });
      } else {
        translateX.value = withSpring(0, { stiffness: 180, damping: 16 });
        rotate.value = withSpring(0, { stiffness: 180, damping: 16 });
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotate.value}deg` },
      {
        scale: interpolate(Math.abs(translateX.value), [0, SWIPE_THRESHOLD], [1, 0.96], 'clamp'),
      },
    ],
    opacity: opacity.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.cardWrapper, animatedCardStyle]}>
        <BlurView intensity={120} tint="dark" style={styles.card}>
          <Text style={styles.typeLabel}>Doğru / Yanlış</Text>
          <Text style={styles.questionText}>{question.text || question.question}</Text>
          <Text style={styles.hintText}>Sağa kaydır: Doğru · Sola kaydır: Yanlış</Text>
        </BlurView>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
  },
  card: {
    width: '100%',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 221, 105, 0.18)',
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
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  questionText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 18,
  },
  hintText: {
    color: '#d4c59c',
    fontSize: 13,
    lineHeight: 20,
  },
});
