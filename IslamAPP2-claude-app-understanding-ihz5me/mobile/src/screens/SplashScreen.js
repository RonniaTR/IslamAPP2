import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const crescentScale = useRef(new Animated.Value(0)).current;
  const crescentOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const mosqueOpacity = useRef(new Animated.Value(0)).current;
  const mosqueTranslateY = useRef(new Animated.Value(40)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Stars appear
      Animated.timing(starsOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      // Crescent moon scales up
      Animated.parallel([
        Animated.spring(crescentScale, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
        Animated.timing(crescentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      // Mosque silhouette rises
      Animated.parallel([
        Animated.timing(mosqueOpacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(mosqueTranslateY, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
      // Title appears
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(titleTranslateY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      // Subtitle
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      // Golden shimmer
      Animated.timing(shimmerAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      // Hold
      Animated.delay(500),
      // Fade out
      Animated.timing(fadeOut, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      onFinish?.();
    });
  }, []);

  const shimmerScale = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.05, 1],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      {/* Background decorative elements */}
      <Animated.View style={[styles.starsContainer, { opacity: starsOpacity }]}>
        {[...Array(12)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                top: 80 + Math.sin(i * 1.3) * (height * 0.3),
                left: 30 + (i * width * 0.08),
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                opacity: 0.3 + (i % 4) * 0.15,
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Mosque silhouette at bottom */}
      <Animated.View
        style={[
          styles.mosqueContainer,
          { opacity: mosqueOpacity, transform: [{ translateY: mosqueTranslateY }] },
        ]}
      >
        {/* Central dome */}
        <View style={styles.centralDome} />
        {/* Left minaret */}
        <View style={[styles.minaret, { left: width * 0.15 }]} />
        {/* Right minaret */}
        <View style={[styles.minaret, { right: width * 0.15 }]} />
        {/* Base */}
        <View style={styles.mosqueBase} />
        {/* Small domes */}
        <View style={[styles.smallDome, { left: width * 0.25 }]} />
        <View style={[styles.smallDome, { right: width * 0.25 }]} />
      </Animated.View>

      {/* Crescent and star */}
      <Animated.View
        style={[
          styles.crescentContainer,
          {
            opacity: crescentOpacity,
            transform: [{ scale: crescentScale }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: shimmerScale }] }}>
          <View style={styles.crescentOuter}>
            <View style={styles.crescentInner} />
          </View>
          <View style={styles.crescentStar}>
            <Text style={styles.starSymbol}>✦</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Title */}
      <Animated.View
        style={[
          styles.titleContainer,
          { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] },
        ]}
      >
        <Text style={styles.bismillahText}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        <Text style={styles.appTitle}>İslam App</Text>
      </Animated.View>

      <Animated.View style={{ opacity: subtitleOpacity }}>
        <Text style={styles.subtitle}>Dijital İslami Yaşam Rehberi</Text>
      </Animated.View>

      {/* Bottom ornamental line */}
      <Animated.View style={[styles.ornamentContainer, { opacity: subtitleOpacity }]}>
        <View style={styles.ornamentLine} />
        <Text style={styles.ornamentSymbol}>۩</Text>
        <View style={styles.ornamentLine} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D3B1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  mosqueContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 160,
    alignItems: 'center',
  },
  centralDome: {
    position: 'absolute',
    bottom: 60,
    width: 120,
    height: 70,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    backgroundColor: '#FFD700',
  },
  smallDome: {
    position: 'absolute',
    bottom: 50,
    width: 50,
    height: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#FFD700',
  },
  minaret: {
    position: 'absolute',
    bottom: 30,
    width: 14,
    height: 110,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  mosqueBase: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  crescentContainer: {
    marginBottom: 30,
  },
  crescentOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
  },
  crescentInner: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#0D3B1E',
    position: 'absolute',
    top: 5,
    right: -5,
  },
  crescentStar: {
    position: 'absolute',
    top: 25,
    right: -2,
  },
  starSymbol: {
    fontSize: 18,
    color: '#FFD700',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bismillahText: {
    fontSize: 20,
    color: '#FFD700',
    marginBottom: 16,
    opacity: 0.9,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 215, 0, 0.7)',
    letterSpacing: 1,
    marginTop: 6,
  },
  ornamentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  ornamentLine: {
    width: 50,
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  ornamentSymbol: {
    fontSize: 20,
    color: 'rgba(255, 215, 0, 0.5)',
  },
});
