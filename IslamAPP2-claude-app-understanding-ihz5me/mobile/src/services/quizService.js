import axios from 'axios';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'https://islamapp2.onrender.com/api';

const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export async function startSoloQuizSession(userId = 'guest_user', category = 'kuran', questionCount = 5) {
  const response = await api.post('/quiz/solo/start', null, {
    params: {
      user_id: userId,
      category,
      question_count: questionCount,
    },
  });
  return response.data;
}

export async function submitSoloAnswer(sessionId, questionIndex, answer, timeTaken) {
  const response = await api.post(`/quiz/solo/${sessionId}/answer`, null, {
    params: {
      question_index: questionIndex,
      answer,
      time_taken: timeTaken,
    },
  });
  return response.data;
}

export async function finishSoloQuiz(sessionId) {
  const response = await api.post(`/quiz/solo/${sessionId}/finish`);
  return response.data;
}
