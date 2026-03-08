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
- **Auth**: Emergent Google OAuth + Guest Login

## Core Features
1. **Google OAuth Login**: Emergent Auth integration, session management, cookie-based auth
2. **Guest Login**: One-click guest access, name displayed as "Kardeşim"
3. **Dashboard**: Prayer times, daily verse, feature navigation, user greeting
4. **Prayer Times**: 81 Turkish provinces + 25 international cities, 6 prayer times, Qibla direction
5. **Quran Reader**: 114 surahs, Arabic + Turkish, verse audio, 8 reciters
6. **Tafsir System**: İbn Kesir, Taberi, Elmalılı Hamdi Yazır, Fahreddin Razi
7. **Turkish Meal Audio**: Mazlum Kiper YouTube (30 cüz)
8. **Hadith Browser**: 9 categories, Arabic/Turkish/source
9. **AI Islamic Advisor**: Chat with session management
10. **Scholar Perspectives**: 7 Islamic scholars Q&A
11. **Quiz System**: Categories, scoring, animated results
12. **i18n**: Full TR/EN/AR language support
13. **Settings**: Language, city, Qibla direction, Logout

## Authentication Flow
1. User visits app → Redirected to /login if not authenticated
2. Option A: "Google ile Giriş Yap" → Emergent Google OAuth
3. Option B: "Misafir Olarak Devam Et" → Instant guest access (name: Kardeşim)
4. Protected routes check auth via AuthContext
5. Logout clears session and redirects to /login

## Preview URL
https://quranic-login-1.preview.emergentagent.com

## Completed Features (as of 2026-03-08)
- [x] Google OAuth login via Emergent Auth
- [x] Guest login with "Kardeşim" name
- [x] Session persistence (httpOnly cookies)
- [x] Logout functionality
- [x] User name display on Dashboard
- [x] Protected routes (redirect to /login)
- [x] All core Islamic features (Prayer, Quran, Tafsir, Hadith, Quiz, Chat, Scholars)
- [x] i18n (TR/EN/AR)

## Backlog
- P1: Enhanced audio player (background play, playlist mode)
- P2: Quiz animations (Lottie)
- P2: Offline caching
- P2: Quran keyword search
- P3: More hadith data
- P3: Push notifications for prayer times
