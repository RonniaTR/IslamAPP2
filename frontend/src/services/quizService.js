import api from '../api';

async function startSoloQuizSession(userId = 'guest', category = 'kuran', question_count = 5) {
  try {
    const { data } = await api.post(`/quiz/solo/start?user_id=${userId}&category=${category}&question_count=${question_count}`);
    return data;
  } catch (e) {
    // fallback local session
    const dummy = {
      session_id: 'local-' + Date.now(),
      category,
      question_count,
      questions: Array.from({ length: question_count }).map((_, i) => ({
        id: `d-${i}`,
        question: `Örnek soru ${i + 1}: Bu bir demo sorudur.`,
        type: i % 2 === 0 ? 'multiple' : 'swipe',
        options: ['A şıkkı', 'B şıkkı', 'C şıkkı', 'D şıkkı'],
        correct_answer: 0,
        points: 10,
      })),
    };
    return dummy;
  }
}

async function submitSoloAnswer(sessionId, questionIndex, answerIndex, timeTaken) {
  try {
    const { data } = await api.post(`/quiz/solo/${sessionId}/answer?question_index=${questionIndex}&answer=${answerIndex}&time_taken=${Math.floor(timeTaken)}`);
    return data;
  } catch (e) {
    // simulate basic response
    return { correct: false, points_earned: 0, correct_answer: 0 };
  }
}

async function finishSoloQuiz(sessionId) {
  try {
    const { data } = await api.post(`/quiz/solo/${sessionId}/finish`);
    return data;
  } catch (e) {
    return { ok: true };
  }
}

export { startSoloQuizSession, submitSoloAnswer, finishSoloQuiz };
