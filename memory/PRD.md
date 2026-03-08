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

## Design System
- **Colors**: Dark green (#0A1F14, #0F3D2E), Gold (#D4AF37, #E8C84A), Cream (#F5F5DC)
- **Fonts**: Playfair Display (headings), Inter (body), Amiri (Arabic text)
- **Animations**: Splash screen (crescent, stars, mosque silhouette, 3s), fade-in, slide-up, pulse-gold
- **Components**: card-islamic, glass, glass-dark, arabic-text

## Core Features
1. **Splash Screen**: Animated intro with crescent moon, stars, mosque silhouette, slogan "Bilgi ile iman yolculuğu"
2. **Google OAuth Login**: Emergent Auth integration
3. **Guest Login**: One-click, name "Kardeşim"
4. **Dashboard**: Selam greeting, İftar countdown, Namaz vakitleri (6 vakit), Günün Ayeti, Günün Hadisi, 2-column card menu (8 items)
5. **Ramadan Page**: İftar countdown, Sahur vakti, Bugünün Duası, Bugünün Ayeti, Bugünün Hadisi, Sadaka hatırlatıcısı, Teravih bilgisi
6. **Voice Command**: Web Speech API, Turkish voice recognition, 9 command categories
7. **Prayer Times**: 81 Turkish provinces + international cities
8. **Quran Reader**: 114 surahs, Arabic + Turkish, verse audio
9. **Tafsir System**: 4 scholars, AI-generated
10. **Hadith Browser**: 10 hadiths, 9 categories, random endpoint
11. **AI Islamic Advisor**: Chat with Claude
12. **Scholar Perspectives**: 7 scholars Q&A
13. **Quiz System**: Categories, scoring
14. **i18n**: TR/EN/AR
15. **Settings**: Language, city, Qibla, Logout
16. **Accessibility**: aria-labels on all interactive elements

## Preview URL
https://quranic-login-1.preview.emergentagent.com

## Completed Features (as of 2026-03-08)
- [x] Complete UI redesign (dark green + gold + cream palette)
- [x] Splash screen with animations
- [x] Google OAuth + Guest login ("Kardeşim")
- [x] Dashboard with iftar countdown, prayer times, daily verse/hadith, card menu
- [x] Ramadan page (7 sections)
- [x] Voice command system (Web Speech API)
- [x] Bottom navigation (5 tabs including Ramazan)
- [x] All Islamic content features
- [x] i18n (TR/EN/AR)
- [x] Accessibility labels

## Backlog
- P1: Enhanced audio player (background play, playlist mode)
- P1: Text-to-speech for Quran verses and hadith
- P2: Quran keyword search
- P2: Offline caching
- P3: Push notifications for prayer times
- P3: More hadith data
