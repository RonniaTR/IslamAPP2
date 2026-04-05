import React, { useState, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PremiumProvider } from './contexts/PremiumContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import VoiceCommand from './components/VoiceCommand';
import InstallPrompt from './components/InstallPrompt';
import PageTransition from './components/PageTransition';
import { initOfflineSync } from './services/offlineSync';
import api from './api';

// Lazy-load all pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const QuranList = lazy(() => import('./pages/QuranList'));
const SurahDetail = lazy(() => import('./pages/SurahDetail'));
const HadithPage = lazy(() => import('./pages/HadithPage'));
const AiChat = lazy(() => import('./pages/AiChat'));
const ScholarsPage = lazy(() => import('./pages/ScholarsPage'));
const QiblaPage = lazy(() => import('./pages/QiblaPage'));
const MealAudioPage = lazy(() => import('./pages/MealAudioPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const RamadanPage = lazy(() => import('./pages/RamadanPage'));
const KnowledgeDetail = lazy(() => import('./pages/KnowledgeDetail'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MultiplayerQuiz = lazy(() => import('./pages/MultiplayerQuiz'));
const ComparativePage = lazy(() => import('./pages/ComparativePage'));
const PomodoroPage = lazy(() => import('./pages/PomodoroPage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));
const PremiumPage = lazy(() => import('./pages/PremiumPage'));
const GamificationPage = lazy(() => import('./pages/GamificationPage'));
const OfflinePacksPage = lazy(() => import('./pages/OfflinePacksPage'));

// Initialize offline sync on app start
initOfflineSync(api);

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1F14] flex items-center justify-center max-w-[520px] md:max-w-[768px] lg:max-w-[520px] mx-auto">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Suspense fallback for lazy-loaded pages
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#A8B5A0]">Yükleniyor...</p>
      </div>
    </div>
  );
}

function AppRouter() {
  const location = useLocation();

  // CRITICAL: Check URL fragment for session_id synchronously during render
  if (location.hash?.includes('session_id=')) {
    return <Suspense fallback={<PageLoader />}><AuthCallback /></Suspense>;
  }

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<LoginRoute />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/quran" element={<PageTransition><QuranList /></PageTransition>} />
              <Route path="/quran/:surahNumber" element={<PageTransition><SurahDetail /></PageTransition>} />
              <Route path="/hadith" element={<PageTransition><HadithPage /></PageTransition>} />
              <Route path="/chat" element={<PageTransition><AiChat /></PageTransition>} />
              <Route path="/scholars" element={<PageTransition><ScholarsPage /></PageTransition>} />
              <Route path="/qibla" element={<PageTransition><QiblaPage /></PageTransition>} />
              <Route path="/meal-audio" element={<PageTransition><MealAudioPage /></PageTransition>} />
              <Route path="/quiz" element={<PageTransition><QuizPage /></PageTransition>} />
              <Route path="/ramadan" element={<PageTransition><RamadanPage /></PageTransition>} />
              <Route path="/knowledge/:cardId" element={<PageTransition><KnowledgeDetail /></PageTransition>} />
              <Route path="/notes" element={<PageTransition><NotesPage /></PageTransition>} />
              <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
              <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
              <Route path="/multiplayer" element={<PageTransition><MultiplayerQuiz /></PageTransition>} />
              <Route path="/comparative" element={<PageTransition><ComparativePage /></PageTransition>} />
              <Route path="/pomodoro" element={<PageTransition><PomodoroPage /></PageTransition>} />
              <Route path="/bookmarks" element={<PageTransition><BookmarksPage /></PageTransition>} />
              <Route path="/discover" element={<PageTransition><DiscoverPage /></PageTransition>} />
              <Route path="/premium" element={<PageTransition><PremiumPage /></PageTransition>} />
              <Route path="/achievements" element={<PageTransition><GamificationPage /></PageTransition>} />
              <Route path="/offline-packs" element={<PageTransition><OfflinePacksPage /></PageTransition>} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <AuthenticatedVoice />
      <InstallPrompt />
    </>
  );
}

function AuthenticatedVoice() {
  const { user } = useAuth();
  if (!user) return null;
  return <VoiceCommand />;
}

function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/" replace />;
  return <PageTransition><LoginPage /></PageTransition>;
}

export default function App() {
  // Skip splash for returning users (have cached auth)
  const hasCache = !!localStorage.getItem('islamapp_user_cache');
  const [showSplash, setShowSplash] = useState(!hasCache);
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <LangProvider>
          <ThemeProvider>
            <PremiumProvider>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <AppRouter />
            </PremiumProvider>
          </ThemeProvider>
        </LangProvider>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
