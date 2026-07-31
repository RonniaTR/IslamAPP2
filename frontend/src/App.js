import React, { useState, useCallback, Suspense, lazy, useEffect } from 'react';
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
import LanguageGate from './components/LanguageGate';
import PageTransition from './components/PageTransition';
import { initOfflineSync } from './services/offlineSync';
// Yan etki: Geri Dönüş modunun plan filtresini pathEngine'e kaydeder.
import './services/returnEngine';
import api from './api';

// --- SAYFALAR ---
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
const GamesPage = lazy(() => import('./pages/GamesPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const StoriesPage = lazy(() => import('./pages/StoriesPage'));
const ElifBaPage = lazy(() => import('./pages/ElifBaPage'));
const NightPage = lazy(() => import('./pages/NightPage'));
const PathPage = lazy(() => import('./pages/PathPage'));
const DonusShell = lazy(() => import('./components/donus/DonusShell'));
const DonusHome = lazy(() => import('./pages/donus/DonusHome'));
const DonusLesson = lazy(() => import('./pages/donus/DonusLesson'));
const DonusPhase = lazy(() => import('./pages/donus/DonusPhase'));
const DonusTemel = lazy(() => import('./pages/donus/DonusTemel'));
const DonusMektup = lazy(() => import('./pages/donus/DonusMektup'));
const HifzPage = lazy(() => import('./pages/HifzPage'));
const HazinePage = lazy(() => import('./pages/HazinePage'));

// --- DEEN CONNECT SAYFALARI ---
const JourneyTracker = lazy(() => import('./pages/JourneyTracker'));
const QuizEngine = lazy(() => import('./pages/QuizEngine'));
const SuccessScreen = lazy(() => import('./pages/SuccessScreen'));
const KnowledgeProfile = lazy(() => import('./pages/KnowledgeProfile'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));

initOfflineSync(api);

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#032212]" />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PageLoader() {
  return <div className="min-h-screen flex items-center justify-center bg-[#032212]" />;
}

function AppRouter() {
  const location = useLocation();
  // Her rota değişiminde sayfa EN ÜSTTEN başlar (main + window + html/body)
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTo(0, 0);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);
  return (
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
            <Route path="/journey" element={<PageTransition><JourneyTracker /></PageTransition>} />
            <Route path="/quiz" element={<PageTransition><QuizEngine /></PageTransition>} />
            <Route path="/games" element={<PageTransition><GamesPage /></PageTransition>} />
            <Route path="/library" element={<PageTransition><LibraryPage /></PageTransition>} />
            <Route path="/journal" element={<PageTransition><JournalPage /></PageTransition>} />
            <Route path="/stories" element={<PageTransition><StoriesPage /></PageTransition>} />
            <Route path="/elifba" element={<PageTransition><ElifBaPage /></PageTransition>} />
            <Route path="/night" element={<PageTransition><NightPage /></PageTransition>} />
            <Route path="/yol" element={<PageTransition><PathPage /></PageTransition>} />
            <Route path="/yol/gun" element={<Navigate to="/donus/gun" replace />} />
            <Route path="/yol/gun/:day" element={<Navigate to="/donus" replace />} />
            <Route path="/hifz" element={<PageTransition><HifzPage /></PageTransition>} />
            <Route path="/hazine" element={<PageTransition><HazinePage /></PageTransition>} />
            <Route path="/hazine/:section" element={<PageTransition><HazinePage /></PageTransition>} />
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
          {/* 🕯️ Dönüş Odası — uygulamanın içinde ayrı bir mod (kendi kabuğu,
              kendi sesi, alt menüsü yok). Tema ayarı burada da geçerlidir. */}
          <Route element={<ProtectedRoute><DonusShell /></ProtectedRoute>}>
            <Route path="/donus" element={<DonusHome />} />
            <Route path="/donus/gun" element={<DonusLesson />} />
            <Route path="/donus/gun/:day" element={<DonusLesson />} />
            <Route path="/donus/bolum/:id" element={<DonusPhase />} />
            <Route path="/donus/temeller/:id" element={<DonusTemel />} />
            <Route path="/donus/emanet" element={<DonusMektup />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
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

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <LangProvider>
            <ThemeProvider>
              <PremiumProvider>
                <LanguageGate />
                <AppRouter />
              </PremiumProvider>
            </ThemeProvider>
          </LangProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}