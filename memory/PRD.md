# İslami Yaşam Asistanı - PRD

## Problem Statement
Comprehensive Digital Islamic Life and Knowledge Assistant as a mobile-first web application.
Supports multiple languages (TR/EN/AR), international prayer times, Quran reading with tafsir, and more.

## Architecture
- **Frontend**: React 18 + TailwindCSS (mobile-first, max-width 430px)
- **Backend**: Python/FastAPI
- **Database**: MongoDB (users, sessions, tafsir cache, bookmarks)
- **Data**: Local JSON for Quran (AR/TR/EN), Hadith, Quiz
- **Audio**: alquran.cloud API (Arabic recitation), YouTube embeds (Turkish meal)
- **AI**: Anthropic Claude via Emergent LLM Key (chat, scholars, tafsir generation)
- **Auth**: Emergent Google OAuth (Google Sign-In)

## Core Features
1. **Google OAuth Login**: Emergent Auth integration, session management, cookie-based auth
2. **Dashboard**: Prayer times, daily verse, feature navigation, user greeting
3. **Prayer Times**: 81 Turkish provinces + 25 international cities, 6 prayer times, Qibla direction
4. **Quran Reader**: 114 surahs, Arabic + Turkish, verse audio, 8 reciters
5. **Tafsir System**: İbn Kesir, Taberi, Elmalılı Hamdi Yazır, Fahreddin Razi - AI-generated cached in MongoDB
6. **Turkish Meal Audio**: Mazlum Kiper YouTube (30 cüz)
7. **Hadith Browser**: 9 categories, Arabic/Turkish/source
8. **AI Islamic Advisor**: Chat with session management
9. **Scholar Perspectives**: 7 Islamic scholars Q&A
10. **Quiz System**: Categories, scoring, animated results
11. **i18n**: Full TR/EN/AR language support with language-based default countries
12. **Settings**: Language, city (106 cities), Qibla direction, Logout

## Authentication Flow
1. User visits app → Redirected to /login if not authenticated
2. Clicks "Google ile Giriş Yap" → Redirected to Emergent Auth
3. Google OAuth → Returns to app with session_id in URL hash
4. AuthCallback exchanges session_id for session_token via backend
5. Backend sets httpOnly cookie, creates/updates user in MongoDB
6. Protected routes check auth via /api/auth/me
7. Logout clears session from DB and cookie

## Preview URL
https://quranic-login-1.preview.emergentagent.com

## Completed Features (as of 2026-03-08)
- [x] Full React web app (migrated from Expo)
- [x] Google OAuth login via Emergent Auth
- [x] Session persistence (httpOnly cookies)
- [x] Logout functionality
- [x] User name display on Dashboard
- [x] Protected routes (redirect to /login)
- [x] Prayer times for 81+ cities
- [x] Quran reader with audio
- [x] Tafsir system
- [x] i18n (TR/EN/AR)
- [x] AI Chat with Claude
- [x] Quiz system
- [x] Hadith browser
- [x] Scholar perspectives

## Backlog
- P1: Enhanced audio player (background play, playlist mode)
- P2: Quiz animations (Lottie)
- P2: Offline caching
- P2: Quran keyword search
- P3: More hadith data
- P3: Push notifications for prayer times
