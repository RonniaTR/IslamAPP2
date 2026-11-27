import React, { useState, useCallback, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import Yukleniyor from './components/Yukleniyor';
import lazyR from './services/lazyRetry';
// Yan etki: Geri Dönüş modunun plan filtresini pathEngine'e kaydeder.
import './services/returnEngine';
import api from './api';

// --- YETİŞKİN SAYFALARI ---
const Dashboard = lazyR(() => import('./pages/Dashboard'));
const QuranList = lazyR(() => import('./pages/QuranList'));
const SurahDetail = lazyR(() => import('./pages/SurahDetail'));
const MushafPage = lazyR(() => import('./pages/MushafPage'));
const KandilPage = lazyR(() => import('./pages/KandilPage'));
const MahrecPage = lazyR(() => import('./pages/MahrecPage'));
const HadithPage = lazyR(() => import('./pages/HadithPage'));
const AiChat = lazyR(() => import('./pages/AiChat'));
const ScholarsPage = lazyR(() => import('./pages/ScholarsPage'));
const QiblaPage = lazyR(() => import('./pages/QiblaPage'));
const MealAudioPage = lazyR(() => import('./pages/MealAudioPage'));
const SettingsPage = lazyR(() => import('./pages/SettingsPage'));
const LicensesPage = lazyR(() => import('./pages/LicensesPage'));
const RehberPage = lazyR(() => import('./pages/RehberPage'));
const OzelliklerPage = lazyR(() => import('./pages/OzelliklerPage'));
const KelimePage = lazyR(() => import('./pages/KelimePage'));
const SofraPage = lazyR(() => import('./pages/SofraPage'));
const HatimPlanPage = lazyR(() => import('./pages/HatimPlanPage'));
const KazaPage = lazyR(() => import('./pages/KazaPage'));
const DefterPage = lazyR(() => import('./pages/DefterPage'));
const TesbihatPage = lazyR(() => import('./pages/TesbihatPage'));
const RahmetPage = lazyR(() => import('./pages/RahmetPage'));
const RamadanPage = lazyR(() => import('./pages/RamadanPage'));
const KnowledgeDetail = lazyR(() => import('./pages/KnowledgeDetail'));
const NotesPage = lazyR(() => import('./pages/NotesPage'));
const LoginPage = lazyR(() => import('./pages/LoginPage'));
const AuthCallback = lazyR(() => import('./pages/AuthCallback'));
const ProfilePage = lazyR(() => import('./pages/ProfilePage'));
const MultiplayerQuiz = lazyR(() => import('./pages/MultiplayerQuiz'));
const ComparativePage = lazyR(() => import('./pages/ComparativePage'));
const PomodoroPage = lazyR(() => import('./pages/PomodoroPage'));
const BookmarksPage = lazyR(() => import('./pages/BookmarksPage'));
const DiscoverPage = lazyR(() => import('./pages/DiscoverPage'));
const PremiumPage = lazyR(() => import('./pages/PremiumPage'));
const GamificationPage = lazyR(() => import('./pages/GamificationPage'));
const OfflinePacksPage = lazyR(() => import('./pages/OfflinePacksPage'));
const FiqhPage = lazyR(() => import('./pages/FiqhPage'));
const DhikrPage = lazyR(() => import('./pages/DhikrPage'));
const TesbihCek = lazyR(() => import('./pages/zikir/TesbihCek'));
const JourneyTracker = lazyR(() => import('./pages/JourneyTracker'));
const QuizEngine = lazyR(() => import('./pages/QuizEngine'));
const SuccessScreen = lazyR(() => import('./pages/SuccessScreen'));
const KnowledgeProfile = lazyR(() => import('./pages/KnowledgeProfile'));
const HalvetMode = lazyR(() => import('./pages/HalvetMode'));
const ContentDetail = lazyR(() => import('./pages/ContentDetail'));
const LeaderboardPage = lazyR(() => import('./pages/LeaderboardPage'));
const AdminPage = lazyR(() => import('./pages/AdminPage'));
const SeedData = lazyR(() => import('./pages/SeedData'));
const HatimPage = lazyR(() => import('./pages/HatimPage'));

// --- YENİ ENTEGRE MODÜLLER ---
const PathPage = lazyR(() => import('./pages/PathPage'));
const HifzPage = lazyR(() => import('./pages/HifzPage'));
const HazinePage = lazyR(() => import('./pages/HazinePage'));
const StoriesPage = lazyR(() => import('./pages/StoriesPage'));
const NightPage = lazyR(() => import('./pages/NightPage'));
const LibraryPage = lazyR(() => import('./pages/LibraryPage'));
const ElifBaPage = lazyR(() => import('./pages/ElifBaPage'));
const JournalPage = lazyR(() => import('./pages/JournalPage'));
const GamesPage = lazyR(() => import('./pages/GamesPage'));
const SiyerPage = lazyR(() => import('./pages/SiyerPage'));
const MuslumanOlmakPage = lazyR(() => import('./pages/musluman/MuslumanOlmakPage'));
const AyetTablosuPage = lazyR(() => import('./pages/ayet/AyetTablosuPage'));
const OrtakSalavatPage = lazyR(() => import('./pages/salavat/OrtakSalavatPage'));
const SevapPointsPage = lazyR(() => import('./pages/sevap/SevapPointsPage'));
const BildirimlerPage = lazyR(() => import('./pages/BildirimlerPage'));
const ProphetsPage = lazyR(() => import('./pages/ProphetsPage'));

// --- GERİ DÖNÜŞ ODASI (KIRK PERDE) ---
const DonusShell = lazyR(() => import('./components/donus/DonusShell'));
const OdaPage = lazyR(() => import('./pages/oda/OdaPage'));
// --- HERKESE AÇIK SAYFALAR (giriş istemez; mağaza formlarındaki web adresleri) ---
const GizlilikPage = lazyR(() => import('./pages/legal/GizlilikPage'));
const HesapSilPage = lazyR(() => import('./pages/legal/HesapSilPage'));
const DonusHome = lazyR(() => import('./pages/donus/DonusHome'));
const DonusLesson = lazyR(() => import('./pages/donus/DonusLesson'));
const DonusPhase = lazyR(() => import('./pages/donus/DonusPhase'));
const DonusTemel = lazyR(() => import('./pages/donus/DonusTemel'));
const DonusMektup = lazyR(() => import('./pages/donus/DonusMektup'));
const DonusPerde = lazyR(() => import('./pages/donus/DonusPerde'));
const DonusYoldas = lazyR(() => import('./pages/donus/DonusYoldas'));

// --- ÇOCUK SAYFALARI ---
const KidsDashboard = lazyR(() => import('./pages/kids/KidsDashboard'));
const KidsWelcome = lazyR(() => import('./pages/kids/KidsWelcome'));
const KidsStories = lazyR(() => import('./pages/kids/KidsStories'));
const KidsGames = lazyR(() => import('./pages/kids/KidsGames'));
const KidsRewards = lazyR(() => import('./pages/kids/KidsRewards'));
const KidsTasks = lazyR(() => import('./pages/kids/KidsTasks'));
const KidsStoryPlayer = lazyR(() => import('./pages/kids/KidsStoryPlayer'));
const KidsDuaList = lazyR(() => import('./pages/kids/KidsDuaList'));
const KidsElifba = lazyR(() => import('./pages/kids/KidsElifba'));
const KidsQuranList = lazyR(() => import('./pages/kids/KidsQuranList'));
const KidsSurahPlayer = lazyR(() => import('./pages/kids/KidsSurahPlayer'));
const KidsDhikr = lazyR(() => import('./pages/kids/KidsDhikr'));
const KidsBadges = lazyR(() => import('./pages/kids/KidsBadges'));
const KidsProgress = lazyR(() => import('./pages/kids/KidsProgress'));
const KidsColoring = lazyR(() => import('./pages/kids/KidsColoring'));
const KidsNamaz = lazyR(() => import('./pages/kids/KidsNamaz'));
const KidsKible = lazyR(() => import('./pages/kids/KidsKible'));
const KidsAilem = lazyR(() => import('./pages/kids/KidsAilem'));

// --- EBEVEYN SAYFALARI ---
const ParentLayout = lazyR(() => import('./components/ParentLayout'));
const ParentProfiles = lazyR(() => import('./pages/parent/ParentProfiles'));
const ParentLimits = lazyR(() => import('./pages/parent/ParentLimits'));
const ParentActivity = lazyR(() => import('./pages/parent/ParentActivity'));
const ParentContentControl = lazyR(() => import('./pages/parent/ParentContentControl'));
const ParentAddProfile = lazyR(() => import('./pages/parent/ParentAddProfile'));
const ParentSettings = lazyR(() => import('./pages/parent/ParentSettings'));

initOfflineSync(api);
initDiagnostics();
warmOffline();   // Türkçe meal + tefsir boşta cihaza iner; sonrası bağlantısız çalışır

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  // Oturum beklenirken boş beyaz sayfa yerine temanın kendi zemini (bkz. Yukleniyor)
  if (loading && !user) return <Yukleniyor />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PageLoader() {
  return <Yukleniyor />;
}

// Açılış oynarken en çok kullanılan sayfalar arka planda indirilir; açılış bitince ekran hazır olur
// (Suspense beklemesi ve beyaz ara kare olmaz). Tarayıcı boştayken çalışır, açılış animasyonunu yormaz.
const ONCEDEN = [
  () => import('./pages/Dashboard'),
  () => import('./pages/DiscoverPage'),
  () => import('./pages/PathPage'),
  () => import('./pages/GamesPage'),
  () => import('./pages/ProfilePage'),
];
let oncedenBasladi = false;
function onceDenYukle() {
  if (oncedenBasladi) return;
  oncedenBasladi = true;
  const bos = window.requestIdleCallback || ((f) => setTimeout(f, 200));
  // Ana sayfa hemen; diğerleri sırayla, boşta
  ONCEDEN[0]().catch(() => {});
  ONCEDEN.slice(1).forEach((f, i) => bos(() => f().catch(() => {}), { timeout: 3000 + i * 800 }));
}

function KidsModeSwitch() {
  const { setAppMode } = useAppMode();
  useEffect(() => { setAppMode('child'); }, [setAppMode]);
  return <PageLoader />;
}

// --- Yetişkin Router ---
function AdultRoutes() {
  return (
    <ProtectedRoute>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
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
            <Route path="/dhikr/:id" element={<TesbihCek />} />
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
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}

// --- Çocuk Router ---
function KidsRoutes() {
  return (
    <ProtectedRoute>
      <KidsLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
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
        </Suspense>
      </KidsLayout>
    </ProtectedRoute>
  );
}

// --- Ebeveyn Router ---
function ParentRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
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
    </Suspense>
  );
}

// --- Geri Dönüş Odası Router (Kırk Perde) ---
function DonusRoutes() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <Routes>
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
  const navigate = useNavigate();

  // Çocuktan yetişkine geçildiğinde adres hâlâ /kids… ise ana sayfaya alınır. Aksi hâlde yetişkin yönlendiricisindeki
  // /kids → "çocuk moduna geç" kuralı modu hemen yine çocuğa çeviriyordu (köşedeki dönüş düğmesi "çalışmıyor" gibiydi).
  const oncekiMod = useRef(appMode);
  useEffect(() => {
    if (appMode === 'adult' && oncekiMod.current !== 'adult' && location.pathname.startsWith('/kids')) navigate('/', { replace: true });
    oncekiMod.current = appMode;
  }, [appMode]); // eslint bilinçli: yalnız mod değişince

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => { onceDenYukle(); }, []);

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

  if (loading && !user) {
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