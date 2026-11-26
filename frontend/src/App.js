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
import CompanionAI from './components/CompanionAI';
import QuranGate, { ReviewRedirect } from './components/QuranGate';
import HusuPerdesi from './components/HusuPerdesi';
import GirisKapisi, { kapiGosterilsinMi } from './components/giris/GirisKapisi';
import { Capacitor } from '@capacitor/core';
import { SplashScreen as NativeSplash } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { initOfflineSync } from './services/offlineSync';
import { warmOffline } from './services/offline';
import { initDiagnostics } from './services/diagnostics';
import RouteMeter from './components/RouteMeter';
// Yan etki: Geri Dönüş modunun plan filtresini pathEngine'e kaydeder.
import './services/returnEngine';
import api from './api';

// --- YETİŞKİN SAYFALARI ---
const Dashboard = lazy(() => import('./pages/Dashboard'));
const QuranList = lazy(() => import('./pages/QuranList'));
const SurahDetail = lazy(() => import('./pages/SurahDetail'));
const MushafPage = lazy(() => import('./pages/MushafPage'));
const KandilPage = lazy(() => import('./pages/KandilPage'));
const MahrecPage = lazy(() => import('./pages/MahrecPage'));
const HadithPage = lazy(() => import('./pages/HadithPage'));
const AiChat = lazy(() => import('./pages/AiChat'));
const ScholarsPage = lazy(() => import('./pages/ScholarsPage'));
const QiblaPage = lazy(() => import('./pages/QiblaPage'));
const MealAudioPage = lazy(() => import('./pages/MealAudioPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const LicensesPage = lazy(() => import('./pages/LicensesPage'));
const RehberPage = lazy(() => import('./pages/RehberPage'));
const OzelliklerPage = lazy(() => import('./pages/OzelliklerPage'));
const KelimePage = lazy(() => import('./pages/KelimePage'));
const SofraPage = lazy(() => import('./pages/SofraPage'));
const HatimPlanPage = lazy(() => import('./pages/HatimPlanPage'));
const KazaPage = lazy(() => import('./pages/KazaPage'));
const DefterPage = lazy(() => import('./pages/DefterPage'));
const TesbihatPage = lazy(() => import('./pages/TesbihatPage'));
const RahmetPage = lazy(() => import('./pages/RahmetPage'));
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
const HalvetMode = lazy(() => import('./pages/HalvetMode'));
const ContentDetail = lazy(() => import('./pages/ContentDetail'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SeedData = lazy(() => import('./pages/SeedData'));
const HatimPage = lazy(() => import('./pages/HatimPage'));

// --- YENİ ENTEGRE MODÜLLER ---
const PathPage = lazy(() => import('./pages/PathPage'));
const HifzPage = lazy(() => import('./pages/HifzPage'));
const HazinePage = lazy(() => import('./pages/HazinePage'));
const StoriesPage = lazy(() => import('./pages/StoriesPage'));
const NightPage = lazy(() => import('./pages/NightPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const ElifBaPage = lazy(() => import('./pages/ElifBaPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const SiyerPage = lazy(() => import('./pages/SiyerPage'));
const MuslumanOlmakPage = lazy(() => import('./pages/musluman/MuslumanOlmakPage'));
const AyetTablosuPage = lazy(() => import('./pages/ayet/AyetTablosuPage'));
const OrtakSalavatPage = lazy(() => import('./pages/salavat/OrtakSalavatPage'));
const SevapPointsPage = lazy(() => import('./pages/sevap/SevapPointsPage'));
const BildirimlerPage = lazy(() => import('./pages/BildirimlerPage'));
const ProphetsPage = lazy(() => import('./pages/ProphetsPage'));

// --- GERİ DÖNÜŞ ODASI (KIRK PERDE) ---
const DonusShell = lazy(() => import('./components/donus/DonusShell'));
const OdaPage = lazy(() => import('./pages/oda/OdaPage'));
// --- HERKESE AÇIK SAYFALAR (giriş istemez; mağaza formlarındaki web adresleri) ---
const GizlilikPage = lazy(() => import('./pages/legal/GizlilikPage'));
const HesapSilPage = lazy(() => import('./pages/legal/HesapSilPage'));
const DonusHome = lazy(() => import('./pages/donus/DonusHome'));
const DonusLesson = lazy(() => import('./pages/donus/DonusLesson'));
const DonusPhase = lazy(() => import('./pages/donus/DonusPhase'));
const DonusTemel = lazy(() => import('./pages/donus/DonusTemel'));
const DonusMektup = lazy(() => import('./pages/donus/DonusMektup'));
const DonusPerde = lazy(() => import('./pages/donus/DonusPerde'));
const DonusYoldas = lazy(() => import('./pages/donus/DonusYoldas'));

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
const KidsNamaz = lazy(() => import('./pages/kids/KidsNamaz'));
const KidsKible = lazy(() => import('./pages/kids/KidsKible'));
const KidsAilem = lazy(() => import('./pages/kids/KidsAilem'));

// --- EBEVEYN SAYFALARI ---
const ParentLayout = lazy(() => import('./components/ParentLayout'));
const ParentProfiles = lazy(() => import('./pages/parent/ParentProfiles'));
const ParentLimits = lazy(() => import('./pages/parent/ParentLimits'));
const ParentActivity = lazy(() => import('./pages/parent/ParentActivity'));
const ParentContentControl = lazy(() => import('./pages/parent/ParentContentControl'));
const ParentAddProfile = lazy(() => import('./pages/parent/ParentAddProfile'));
const ParentSettings = lazy(() => import('./pages/parent/ParentSettings'));

initOfflineSync(api);
initDiagnostics();
warmOffline();   // Türkçe meal + tefsir boşta cihaza iner; sonrası bağlantısız çalışır

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: '100vh', background: '#F5F5F0' }} />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PageLoader() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F0' }} />;
}

function KidsModeSwitch() {
  const { setAppMode } = useAppMode();
  useEffect(() => { setAppMode('child'); }, [setAppMode]);
  return <PageLoader />;
}

// --- Yetişkin Router ---
function AdultRoutes() {
  const location = useLocation();
  return (
    <ProtectedRoute>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/quran" element={<PageTransition><QuranGate><QuranList /></QuranGate></PageTransition>} />
              <Route path="/quran/:surahNumber" element={<PageTransition><QuranGate><SurahDetail /></QuranGate></PageTransition>} />
              <Route path="/mushaf" element={<QuranGate><MushafPage /></QuranGate>} />
              <Route path="/mushaf/:page" element={<QuranGate><MushafPage /></QuranGate>} />
              <Route path="/hadith" element={<PageTransition><HadithPage /></PageTransition>} />
              <Route path="/chat" element={<PageTransition><AiChat /></PageTransition>} />
              <Route path="/scholars" element={<PageTransition><ScholarsPage /></PageTransition>} />
              <Route path="/qibla" element={<PageTransition><QiblaPage /></PageTransition>} />
              <Route path="/meal-audio" element={<PageTransition><QuranGate><MealAudioPage /></QuranGate></PageTransition>} />
              <Route path="/journey" element={<PageTransition><JourneyTracker /></PageTransition>} />
              <Route path="/content/:type/:slug" element={<PageTransition><ContentDetail /></PageTransition>} />
              <Route path="/seed" element={<PageTransition><SeedData /></PageTransition>} />
              <Route path="/quiz" element={<PageTransition><QuizEngine /></PageTransition>} />
              <Route path="/success" element={<PageTransition><SuccessScreen /></PageTransition>} />
              <Route path="/leaderboard" element={<PageTransition><LeaderboardPage /></PageTransition>} />
              <Route path="/halvet" element={<PageTransition><HalvetMode /></PageTransition>} />
              <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
              <Route path="/profile/knowledge" element={<PageTransition><KnowledgeProfile /></PageTransition>} />
              <Route path="/ramadan" element={<PageTransition><RamadanPage /></PageTransition>} />
              <Route path="/knowledge/:cardId" element={<PageTransition><KnowledgeDetail /></PageTransition>} />
              <Route path="/notes" element={<PageTransition><NotesPage /></PageTransition>} />
              <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
              <Route path="/licenses" element={<PageTransition><LicensesPage /></PageTransition>} />
              <Route path="/rehber" element={<PageTransition><RehberPage /></PageTransition>} />
              <Route path="/ozellikler" element={<PageTransition><OzelliklerPage /></PageTransition>} />
              <Route path="/kelime" element={<PageTransition><KelimePage /></PageTransition>} />
              <Route path="/sofra" element={<PageTransition><SofraPage /></PageTransition>} />
              <Route path="/hatim-plani" element={<PageTransition><HatimPlanPage /></PageTransition>} />
              <Route path="/kaza" element={<PageTransition><KazaPage /></PageTransition>} />
              <Route path="/kandil" element={<PageTransition><KandilPage /></PageTransition>} />
              <Route path="/mahrec" element={<PageTransition><MahrecPage /></PageTransition>} />
              <Route path="/defter" element={<PageTransition><DefterPage /></PageTransition>} />
              <Route path="/tesbihat" element={<TesbihatPage />} />
              <Route path="/rahmet" element={<PageTransition><RahmetPage /></PageTransition>} />
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
              <Route path="/hatim" element={<PageTransition><HatimPage /></PageTransition>} />
              {/* YENİ ENTEGRE MODÜLLER */}
              <Route path="/yol" element={<PageTransition><PathPage /></PageTransition>} />
              <Route path="/yol/gun" element={<Navigate to="/donus/gun" replace />} />
              <Route path="/yol/gun/:day" element={<Navigate to="/donus" replace />} />
              <Route path="/hifz" element={<PageTransition><QuranGate><HifzPage /></QuranGate></PageTransition>} />
              <Route path="/hazine" element={<PageTransition><HazinePage /></PageTransition>} />
              <Route path="/hazine/:section" element={<PageTransition><HazinePage /></PageTransition>} />
              <Route path="/stories" element={<PageTransition><StoriesPage /></PageTransition>} />
              <Route path="/night" element={<PageTransition><NightPage /></PageTransition>} />
              <Route path="/library" element={<PageTransition><LibraryPage /></PageTransition>} />
              <Route path="/elifba" element={<PageTransition><ElifBaPage /></PageTransition>} />
              <Route path="/journal" element={<PageTransition><JournalPage /></PageTransition>} />
              <Route path="/games" element={<PageTransition><GamesPage /></PageTransition>} />
              <Route path="/siyer" element={<PageTransition><SiyerPage /></PageTransition>} />
              <Route path="/musluman-olmak" element={<MuslumanOlmakPage />} />
              <Route path="/ayet-tablosu" element={<PageTransition><AyetTablosuPage /></PageTransition>} />
              <Route path="/salavat" element={<PageTransition><OrtakSalavatPage /></PageTransition>} />
              <Route path="/sevap-points" element={<PageTransition><SevapPointsPage /></PageTransition>} />
              <Route path="/bildirimler" element={<PageTransition><BildirimlerPage /></PageTransition>} />
              <Route path="/prophets" element={<PageTransition><ProphetsPage /></PageTransition>} />
              <Route path="/kids" element={<KidsModeSwitch />} />
              <Route path="/kids/*" element={<KidsModeSwitch />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}

// --- Çocuk Router ---
function KidsRoutes() {
  const location = useLocation();
  return (
    <ProtectedRoute>
      <KidsLayout>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/kids" element={<PageTransition><KidsDashboard /></PageTransition>} />
              <Route path="/kids/stories" element={<PageTransition><KidsStories /></PageTransition>} />
              <Route path="/kids/story/:id" element={<PageTransition><KidsStoryPlayer /></PageTransition>} />
              <Route path="/kids/dua" element={<PageTransition><KidsDuaList /></PageTransition>} />
              <Route path="/kids/tasks" element={<PageTransition><KidsTasks /></PageTransition>} />
              <Route path="/kids/games" element={<PageTransition><KidsGames /></PageTransition>} />
              <Route path="/kids/rewards" element={<PageTransition><KidsRewards /></PageTransition>} />
              <Route path="/kids/friends" element={<Navigate to="/kids/ailem" replace />} />
              <Route path="/kids/ailem" element={<PageTransition><KidsAilem /></PageTransition>} />
              <Route path="/kids/namaz" element={<PageTransition><KidsNamaz /></PageTransition>} />
              <Route path="/kids/kible" element={<PageTransition><KidsKible /></PageTransition>} />
              <Route path="/kids/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
              <Route path="/kids/licenses" element={<PageTransition><LicensesPage /></PageTransition>} />
              <Route path="/kids/elifba" element={<PageTransition><KidsElifba /></PageTransition>} />
              <Route path="/kids/quran" element={<PageTransition><QuranGate><KidsQuranList /></QuranGate></PageTransition>} />
              <Route path="/kids/surah/:id" element={<PageTransition><QuranGate><KidsSurahPlayer /></QuranGate></PageTransition>} />
              <Route path="/kids/dhikr" element={<PageTransition><KidsDhikr /></PageTransition>} />
              <Route path="/kids/badges" element={<PageTransition><KidsBadges /></PageTransition>} />
              <Route path="/kids/progress" element={<PageTransition><KidsProgress /></PageTransition>} />
              <Route path="/kids/coloring" element={<PageTransition><KidsColoring /></PageTransition>} />
              <Route path="/kids/prayer" element={<Navigate to="/kids/namaz" replace />} />
              <Route path="/kids/prophets" element={<PageTransition><KidsStories /></PageTransition>} />
              <Route path="/kids/quiz" element={<PageTransition><KidsGames /></PageTransition>} />
              <Route path="*" element={<Navigate to="/kids" />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </KidsLayout>
    </ProtectedRoute>
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

// --- Geri Dönüş Odası Router (Kırk Perde) ---
function DonusRoutes() {
  const location = useLocation();
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route element={<DonusShell />}>
              <Route path="/donus" element={<DonusHome />} />
              <Route path="/donus/gun" element={<DonusLesson />} />
              <Route path="/donus/gun/:day" element={<DonusLesson />} />
              <Route path="/donus/bolum/:id" element={<DonusPhase />} />
              <Route path="/donus/temeller/:id" element={<DonusTemel />} />
              <Route path="/donus/emanet" element={<DonusMektup />} />
              <Route path="/donus/yoldas" element={<DonusYoldas />} />
              <Route path="/donus/perde" element={<DonusPerde />} />
              <Route path="/donus/perde/:day" element={<DonusPerde />} />
            </Route>
            <Route path="*" element={<Navigate to="/donus" />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ProtectedRoute>
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
  // İlk kurulumda "Giriş Kapısı" sahnesi oynar (bir kez); sonraki açılışlarda yalnız ~0,9 sn'lik hızlı açılış.
  const [showKapi, setShowKapi] = useState(kapiGosterilsinMi);
  const [showSplash, setShowSplash] = useState(() => !kapiGosterilsinMi());
  const [showKidsWelcome, setShowKidsWelcome] = useState(false);
  const location = useLocation();

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Initialize Native Plugins
  useEffect(() => {
    const initNative = async () => {
      try {
        if (typeof StatusBar !== 'undefined' && StatusBar.setStyle) {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#F5F5F0' });
        }
        if (typeof NativeSplash !== 'undefined' && NativeSplash.hide) {
          await NativeSplash.hide();
        }
      } catch (err) {
        // Ignored on web
      }
    };
    initNative();
  }, []);

  // Gizlilik politikası ve hesap silme: herkese açık, giriş/açılış beklemeden açılır.
  if (location.pathname === '/gizlilik' || location.pathname === '/hesap-sil') {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/gizlilik" element={<GizlilikPage />} />
          <Route path="/hesap-sil" element={<HesapSilPage />} />
        </Routes>
      </Suspense>
    );
  }

  // Oda (ekran paylaşımı / birlikte izleme): yalnız WEB sürümünde, bağlantıyla açılır. Mağaza uygulamasında yoktur
  // (video paylaşan özellik mağazalarda şikâyet/engelleme gibi ek şartlar doğurur; kişisel kullanım için web yeterli).
  if (location.pathname.startsWith('/oda') && Capacitor.isNativePlatform()) {
    return <Navigate to="/" replace />;
  }
  if (location.pathname.startsWith('/oda')) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/oda" element={<OdaPage />} />
          <Route path="/oda/:id" element={<OdaPage />} />
        </Routes>
      </Suspense>
    );
  }

  // İlk açılış: kapı
  if (showKapi) {
    return <GirisKapisi onComplete={() => setShowKapi(false)} />;
  }

  // Açılış (Mühür Açılışı) uygulamanın ÜSTÜNDE oynar: çıkışta kemer biçiminde açılan delikten alttaki ekran görünür.
  const akis = akisSec();
  return (
    <>
      {akis}
      <AnimatePresence>{showSplash && <SplashScreen key="acilis" onComplete={handleSplashComplete} />}</AnimatePresence>
    </>
  );

  function akisSec() {
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

  // 4. Geri Dönüş Odası (Kırk Perde) — kendi kabuğu, alt menüsü yok
  if (location.pathname.startsWith('/donus')) {
    return <DonusRoutes />;
  }

  // 5. Ebeveyn Modu Ana Ekranları
  if (location.pathname.startsWith('/parent')) {
    return <ParentRoutes />;
  }

  // 6. Yetişkin Modu Ana Ekranları
  return <AdultRoutes />;
  }
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
                  <ReviewRedirect />
                  <AppFlow />
                  <HusuPerdesi />
                  <RouteMeter />
                  <CompanionAI />
                </AppModeProvider>
              </PremiumProvider>
            </ThemeProvider>
          </LangProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}