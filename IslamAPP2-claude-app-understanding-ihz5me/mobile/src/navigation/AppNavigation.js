import React, { useMemo, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import QuranListScreen from '../screens/QuranListScreen';
import SurahDetailScreen from '../screens/SurahDetailScreen';
import HadithScreen from '../screens/HadithScreen';
import HadithDetailScreen from '../screens/HadithDetailScreen';
import DhikrScreen from '../screens/DhikrScreen';
import PrayerTimesScreen from '../screens/PrayerTimesScreen';
import QiblaScreen from '../screens/QiblaScreen';
import AiChatScreen from '../screens/AiChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import JourneyTrackerScreen from '../screens/journey/JourneyTrackerScreen';
import KnowledgeProfileScreen from '../screens/profile/KnowledgeProfileScreen';
import QuizEngineScreen from '../screens/quiz/QuizEngineScreen';
import ScholarsScreen from '../screens/ScholarsScreen';
import NotesScreen from '../screens/NotesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { theme } = useTheme();
  const { t } = useLang();

  const tabIcon = (routeName, focused) => {
    const map = {
      HomeTab: focused ? 'home' : 'home-outline',
      QuranTab: focused ? 'book' : 'book-outline',
      HadithTab: focused ? 'library' : 'library-outline',
      QuizTab: focused ? 'game-controller' : 'game-controller-outline',
      PrayerTab: focused ? 'time' : 'time-outline',
      JourneyTab: focused ? 'trophy' : 'trophy-outline',
      ProfileTab: focused ? 'person' : 'person-outline',
    };
    return map[routeName] || 'ellipse-outline';
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={tabIcon(route.name, focused)} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: t('home') }} />
      <Tab.Screen name="QuranTab" component={QuranListScreen} options={{ tabBarLabel: t('quran') }} />
      <Tab.Screen name="HadithTab" component={HadithScreen} options={{ tabBarLabel: t('hadith') }} />
      <Tab.Screen name="QuizTab" component={QuizEngineScreen} options={{ tabBarLabel: 'Quiz' }} />
      <Tab.Screen name="PrayerTab" component={PrayerTimesScreen} options={{ tabBarLabel: t('prayer') }} />
      <Tab.Screen name="JourneyTab" component={JourneyTrackerScreen} options={{ tabBarLabel: 'Yolculuk' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: t('profile') }} />
    </Tab.Navigator>
  );
}

function AppStack() {
  const { theme } = useTheme();
  const { t } = useLang();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBg },
        headerTintColor: theme.headerText,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="SurahDetail" component={SurahDetailScreen} options={{ title: t('quran') }} />
      <Stack.Screen name="HadithDetail" component={HadithDetailScreen} options={{ title: t('hadith') }} />
      <Stack.Screen name="Dhikr" component={DhikrScreen} options={{ title: t('dhikr') }} />
      <Stack.Screen name="Qibla" component={QiblaScreen} options={{ title: t('qibla') }} />
      <Stack.Screen name="AiChat" component={AiChatScreen} options={{ title: t('aiChat') }} />
      <Stack.Screen name="Scholars" component={ScholarsScreen} options={{ title: t('scholars') }} />
      <Stack.Screen name="Notes" component={NotesScreen} options={{ title: t('notes') }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings') }} />
      <Stack.Screen
        name="KnowledgeProfile"
        component={KnowledgeProfileScreen}
        options={({ navigation }) => ({
          title: t('profile'),
          headerRight: () => null,
        })}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigation() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);

  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: theme.background,
        card: theme.card,
        text: theme.text,
        border: theme.border,
        primary: theme.primary,
      },
    }),
    [theme]
  );

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {user ? (
        <AppStack />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
