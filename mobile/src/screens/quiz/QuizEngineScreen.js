import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import SwipeQuizCard from './components/SwipeQuizCard';
import MultipleChoiceCard from './components/MultipleChoiceCard';
import SuccessScreen from './SuccessScreen';
import { startSoloQuizSession, submitSoloAnswer, finishSoloQuiz } from '../../services/quizService';

export default function QuizEngineScreen() {
  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [totalXp, setTotalXp] = useState(0);

  const questionStartTime = useRef(Date.now());

  useEffect(() => {
    initializeQuiz();
  }, []);

  const initializeQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setCompleted(false);
    setFeedback(null);
    setTotalXp(0);
    setCurrentIndex(0);

    try {
      const response = await startSoloQuizSession('guest_user', 'kuran', 5);
      setSession(response);
      questionStartTime.current = Date.now();
    } catch (err) {
      // Fallback to dummy data for development
      console.warn('API Error:', err.message);
      const dummySession = {
        session_id: 'dummy_' + Date.now(),
        category: 'kuran',
        question_count: 5,
        questions: [
          {
            id: '1',
            text: "Kur'an-ı Kerim kaç sûreden oluşur?",
            type: 'multiple',
            options: ['114', '120', '130', '150'],
            correct_answer: 0,
            points: 10,
          },
          {
            id: '2',
            text: "Peygamber Muhammed'in (s.a.v.) doğumu hangi yılda olmuştur?",
            type: 'swipe',
            text: 'Peygamber Muhammed (s.a.v.) 571 yılında doğdu. (Doğru/Yanlış)',
            correct_answer: 1,
            points: 10,
          },
          {
            id: '3',
            text: 'En-Nas Suresi kaç âyetten oluşur?',
            type: 'multiple',
            options: ['4', '5', '6', '7'],
            correct_answer: 2,
            points: 10,
          },
          {
            id: '4',
            text: 'El-Fâtiha Suresi Müslümanların her namazda okuduğu surenin adı mıdır?',
            type: 'swipe',
            text: 'El-Fâtiha Suresi, her namazda farz olarak okunur. (Doğru/Yanlış)',
            correct_answer: 1,
            points: 10,
          },
          {
            id: '5',
            text: 'Kuran-ı Kerim toplam kaç kelimeden oluşur?',
            type: 'multiple',
            options: ['77,000', '80,000', '85,000', '90,000'],
            correct_answer: 1,
            points: 10,
          },
        ]
      };
      setSession(dummySession);
      questionStartTime.current = Date.now();
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = session?.questions?.[currentIndex];
  const totalQuestions = session?.question_count || 0;

  const handleAnswer = async (selectedIndex) => {
    if (!session || currentQuestion === undefined) {
      return;
    }

    setFeedback('Cevabın değerlendiriliyor...');
    const timeTaken = Math.max(0, (Date.now() - questionStartTime.current) / 1000);

    try {
      // Try to submit to API, but fallback to local validation
      let result;
      try {
        result = await submitSoloAnswer(session.session_id, currentIndex, selectedIndex, timeTaken);
      } catch (apiErr) {
        // Fallback: local validation for development
        const isCorrect = selectedIndex === currentQuestion.correct_answer;
        result = {
          correct: isCorrect,
          points_earned: isCorrect ? currentQuestion.points || 10 : 0,
          correct_answer: currentQuestion.correct_answer,
        };
      }
      
      const scoredXP = result.points_earned || 0;
      setTotalXp((prev) => prev + scoredXP);
      setFeedback(
        result.correct
          ? `Doğru! +${scoredXP} XP`
          : `Yanlış. Doğru cevap: ${result.correct_answer + 1}`
      );

      const nextIndex = currentIndex + 1;
      if (nextIndex >= totalQuestions) {
        try {
          await finishSoloQuiz(session.session_id);
        } catch (err) {
          // Silently fail - it's optional for demo
        }
        setCompleted(true);
        return;
      }

      setTimeout(() => {
        setFeedback(null);
        setCurrentIndex(nextIndex);
        questionStartTime.current = Date.now();
      }, 900);
    } catch (err) {
      setError('Cevap gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleSwipe = (answer) => {
    handleAnswer(answer ? 1 : 0);
  };

  const handleSelect = (selectedIndex) => {
    handleAnswer(selectedIndex);
  };

  const handleContinue = () => {
    initializeQuiz();
  };

  if (isLoading) {
    return (
      <GestureHandlerRootView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#ffd369" />
        <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
      </GestureHandlerRootView>
    );
  }

  if (error) {
    return (
      <GestureHandlerRootView style={styles.loadingScreen}>
        <Text style={styles.errorTitle}>Bir sorun oluştu</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={initializeQuiz} style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}>
          <Text style={styles.retryText}>Tekrar dene</Text>
        </Pressable>
      </GestureHandlerRootView>
    );
  }

  if (completed) {
    return <SuccessScreen xp={totalXp} onContinue={handleContinue} />;
  }

  if (!currentQuestion) {
    return (
      <GestureHandlerRootView style={styles.loadingScreen}>
        <Text style={styles.errorTitle}>Henüz soru bulunamadı.</Text>
        <Pressable onPress={initializeQuiz} style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}>
          <Text style={styles.retryText}>Yenile</Text>
        </Pressable>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.backgroundOverlay} />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Hibrit Soru Motoru</Text>
        <Text style={styles.sectionSubtitle}>Kaydır veya seç; bilgi yolculuğunda her adım bir seviyedir.</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / totalQuestions) * 100}%` }]} />
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusText}>Soru {currentIndex + 1} / {totalQuestions}</Text>
          <Text style={styles.statusText}>{currentQuestion.type === 'swipe' ? 'Doğru/Yanlış' : '4 Şıklı'}</Text>
        </View>

        <View style={styles.cardArea}>
          {currentQuestion.type === 'swipe' ? (
            <SwipeQuizCard question={currentQuestion} onSwipe={handleSwipe} />
          ) : (
            <MultipleChoiceCard question={currentQuestion} onSelect={handleSelect} />
          )}
        </View>

        <BlurView intensity={100} tint="dark" style={styles.feedbackCard}>
          <Text style={styles.feedbackText}>{feedback || 'Doğru cevabı seçmek için bir seçenek seç.'}</Text>
        </BlurView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#032212',
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#032212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 18,
    color: '#f7e6ae',
    fontSize: 15,
  },
  errorTitle: {
    color: '#f7e6ae',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    color: '#d8d2b0',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 22,
  },
  retryButton: {
    backgroundColor: '#ffd369',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 18,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryText: {
    color: '#08220f',
    fontWeight: '800',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#062a1b',
  },
  content: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#f7e6ae',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionSubtitle: {
    color: '#d8d2b0',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
    maxWidth: '92%',
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffd369',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statusText: {
    color: '#d5cca8',
    fontSize: 13,
    fontWeight: '700',
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
  },
  feedbackCard: {
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginTop: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 221, 105, 0.16)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  feedbackText: {
    color: '#f7e6ae',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
