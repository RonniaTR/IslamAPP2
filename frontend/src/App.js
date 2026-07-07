import React, { useState, useCallback, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LangProvider } from './contexts/LangContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PremiumProvider } from './contexts/PremiumContext';
import { AppModeProvider, useAppMode } from './contexts/AppModeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import KidsLayout from './components/KidsLayout';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import ModeSelector from './components/ModeSelector';
import PageTransition from './components/PageTransition';
import { initOfflineSync } from './services/offlineSync';
import api from './api';

// --- YETİŞKİN SAYFALARI ---
const Dashboard = lazy(() => import('./pages/Dashboard'));
const QuranList = lazy(() => import('./pages/QuranList'));
const SurahDetail = lazy(() => import('./pages/SurahDetail'));
const HadithPage = lazy(() => import('./pages/HadithPage'));
const AiChat = lazy(() => import('./pages/AiChat'));
const ScholarsPage = lazy(() => import('./pages/ScholarsPage'));
const QiblaPage = lazy(() => import('./pages/QiblaPage'));
const MealAudioPage = lazy(() => import('./pages/MealAudioPage'));
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
const FiqhPage = lazy(() => import('./pages/FiqhPage'));
const DhikrPage = lazy(() => import('./pages/DhikrPage'));
const JourneyTracker = lazy(() => import('./pages/JourneyTracker'));
const QuizEngine = lazy(() => import('./pages/QuizEngine'));
const SuccessScreen = lazy(() => import('./pages/SuccessScreen'));
const KnowledgeProfile = lazy(() => import('./pages/KnowledgeProfile'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));

// --- ÇOCUK SAYFALARI ---
const KidsDashboard = lazy(() => import('./pages/kids/KidsDashboard'));
const KidsWelcome = lazy(() => import('./pages/kids/KidsWelcome'));
const KidsStories = lazy(() => import('./pages/kids/KidsStories'));
const KidsGames = lazy(() => import('./pages/kids/KidsGames'));
const KidsRewards = lazy(() => import('./pages/kids/KidsRewards'));
const KidsTasks = lazy(() => import('./pages/kids/KidsTasks'));
const KidsStoryPlayer = lazy(() => import('./pages/kids/KidsStoryPlayer'));
const KidsDuaList = lazy(() => import('./pages/kids/KidsDuaList'));
const KidsElifba = lazy(() => import('./pages/kids/KidsElifba'));
const KidsQuranList = lazy(() => import('./pages/kids/KidsQuranList'));
const KidsSurahPlayer = lazy(() => import('./pages/kids/KidsSurahPlayer'));
const KidsDhikr = lazy(() => import('./pages/kids/KidsDhikr'));
const KidsBadges = lazy(() => import('./pages/kids/KidsBadges'));
const KidsProgress = lazy(() => import('./pages/kids/KidsProgress'));
const KidsColoring = lazy(() => import('./pages/kids/KidsColoring'));

initOfflineSync(api);

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: '100vh', background: '#F5F5F0' }} />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PageLoader() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F0' }} />;
}

// --- Yetişkin Router ---
function AdultRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/quran" element={<PageTransition><QuranList /></PageTransition>} />
            <Route path="/quran/:surahNumber" element={<PageTransition><SurahDetail /></PageTransition>} />
            <Route path="/hadith" element={<PageTransition><HadithPage /></PageTransition>} />
            <Route path="/chat" element={<PageTransition><AiChat /></PageTransition>} />
            <Route path="/scholars" element={<PageTransition><ScholarsPage /></PageTransition>} />
            <Route path="/qibla" element={<PageTransition><QiblaPage /></PageTransition>} />
            <Route path="/meal-audio" element={<PageTransition><MealAudioPage /></PageTransition>} />
            <Route path="/journey" element={<PageTransition><JourneyTracker /></PageTransition>} />
            <Route path="/quiz" element={<PageTransition><QuizEngine /></PageTransition>} />
            <Route path="/success" element={<PageTransition><SuccessScreen /></PageTransition>} />
            <Route path="/leaderboard" element={<PageTransition><LeaderboardPage /></PageTransition>} />
            <Route path="/profile/knowledge" element={<PageTransition><KnowledgeProfile /></PageTransition>} />
            <Route path="/ramadan" element={<PageTransition><RamadanPage /></PageTransition>} />
            <Route path="/knowledge/:cardId" element={<PageTransition><KnowledgeDetail /></PageTransition>} />
            <Route path="/notes" element={<PageTransition><NotesPage /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
            <Route path="/fiqh" element={<PageTransition><FiqhPage /></PageTransition>} />
            <Route path="/dhikr" element={<PageTransition><DhikrPage /></PageTransition>} />
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
  );
}

// --- Çocuk Router ---
function KidsRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<ProtectedRoute><KidsLayout /></ProtectedRoute>}>
            <Route path="/kids" element={<PageTransition><KidsDashboard /></PageTransition>} />
            <Route path="/kids/stories" element={<PageTransition><KidsStories /></PageTransition>} />
            <Route path="/kids/story/:id" element={<PageTransition><KidsStoryPlayer /></PageTransition>} />
            <Route path="/kids/dua" element={<PageTransition><KidsDuaList /></PageTransition>} />
            <Route path="/kids/tasks" element={<PageTransition><KidsTasks /></PageTransition>} />
            <Route path="/kids/games" element={<PageTransition><KidsGames /></PageTransition>} />
            <Route path="/kids/rewards" element={<PageTransition><KidsRewards /></PageTransition>} />
            <Route path="/kids/friends" element={<PageTransition><KidsDashboard /></PageTransition>} />
            <Route path="/kids/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
            <Route path="/kids/elifba" element={<PageTransition><KidsElifba /></PageTransition>} />
            <Route path="/kids/quran" element={<PageTransition><KidsQuranList /></PageTransition>} />
            <Route path="/kids/surah/:id" element={<PageTransition><KidsSurahPlayer /></PageTransition>} />
            <Route path="/kids/dhikr" element={<PageTransition><KidsDhikr /></PageTransition>} />
            <Route path="/kids/badges" element={<PageTransition><KidsBadges /></PageTransition>} />
            <Route path="/kids/progress" element={<PageTransition><KidsProgress /></PageTransition>} />
            <Route path="/kids/coloring" element={<PageTransition><KidsColoring /></PageTransition>} />
            <Route path="/kids/prayer" element={<PageTransition><QiblaPage /></PageTransition>} />
            <Route path="/kids/prophets" element={<PageTransition><KidsStories /></PageTransition>} />
            <Route path="/kids/quiz" element={<PageTransition><KidsGames /></PageTransition>} />
            <Route path="/kids/songs" element={<PageTransition><KidsDashboard /></PageTransition>} />
          </Route>
          <Route path="*" element={<Navigate to="/kids" />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

// --- Ebeveyn Router ---
function ParentRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<ProtectedRoute><ParentLayout /></ProtectedRoute>}>
            <Route path="/parent/profiles" element={<PageTransition><ParentProfiles /></PageTransition>} />
            <Route path="/parent/limits" element={<PageTransition><ParentLimits /></PageTransition>} />
            <Route path="/parent/activity" element={<PageTransition><ParentActivity /></PageTransition>} />
            <Route path="/parent/content" element={<PageTransition><ParentContentControl /></PageTransition>} />
          </Route>
          <Route path="/parent/add-profile" element={<PageTransition><ParentAddProfile /></PageTransition>} />
          <Route path="/parent/settings" element={<PageTransition><ParentSettings /></PageTransition>} />
          <Route path="*" element={<Navigate to="/parent/profiles" />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/" replace />;
  return <PageTransition><LoginPage /></PageTransition>;
}

// --- Ana Uygulama Yönlendiricisi ---
function AppFlow() {
  const { user, loading } = useAuth();
  const { needsOnboarding, needsModeSelection, appMode, isChild, activeChildProfile } = useAppMode();
  const [showSplash, setShowSplash] = useState(true);
  const [showKidsWelcome, setShowKidsWelcome] = useState(false);
  const location = useLocation();

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Splash Screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Login
  if (!loading && !user) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/auth/callback" element={<PageTransition><AuthCallback /></PageTransition>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  if (loading) {
    return <PageLoader />;
  }

  // 1. Mod Seçimi (Eğer mod henüz seçilmemişse)
  if (!appMode) {
    return (
      <ModeSelector
        onComplete={(mode) => {
          if (mode === 'child') setShowKidsWelcome(true);
        }}
      />
    );
  }

  // 2. Onboarding (Sadece Yetişkin modunda ve ilk kullanımsa)
  if (needsOnboarding && appMode === 'adult') {
    return <OnboardingScreen onComplete={() => {}} />;
  }

  // 3. Çocuk Modu Ana Ekranları ve Karşılama
  if (appMode === 'child') {
    if (showKidsWelcome || !activeChildProfile) {
      return (
        <Suspense fallback={<PageLoader />}>
          <KidsWelcome onComplete={() => setShowKidsWelcome(false)} />
        </Suspense>
      );
    }
    return <KidsRoutes />;
  }

  // 4. Ebeveyn Modu Ana Ekranları
  if (location.pathname.startsWith('/parent')) {
    return <ParentRoutes />;
  }

  // 5. Yetişkin Modu Ana Ekranları
  return <AdultRoutes />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <LangProvider>
            <ThemeProvider>
              <PremiumProvider>
                <AppModeProvider>
                  <AppFlow />
                </AppModeProvider>
              </PremiumProvider>
            </ThemeProvider>
          </LangProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}