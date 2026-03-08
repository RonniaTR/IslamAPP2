# İslami Yaşam Asistanı - PRD

## Problem Statement
Comprehensive Digital Islamic Life and Knowledge Assistant as a mobile-first web application.

## Architecture
- **Frontend**: React 18 + TailwindCSS (mobile-first, max-width 430px)
- **Backend**: Python/FastAPI
- **Database**: MongoDB (users, sessions, worship_tracking, tafsir cache)
- **AI**: Anthropic Claude via Emergent LLM Key
- **Auth**: Emergent Google OAuth + Guest Login

## Design System
- **Colors**: Dark green (#0A1F14, #0F3D2E), Gold (#D4AF37, #E8C84A), Cream (#F5F5DC)
- **Fonts**: Playfair Display (headings), Inter (body), Amiri (Arabic)
- **Components**: card-islamic (glassmorphism, border-radius 20px), fade-in animations

## Keşfet (Discover) Screen — 10 Sections
1. **Günün Ruh Hali**: 4 mood buttons (Huzur/Motivasyon/Sabır/Şükür) → shows ayet + hadis + dua
2. **Günün Ayeti**: Arabic + Turkish + TTS "Dinle" button
3. **Günün Hadisi**: Arabic + Turkish + Source + Share button
4. **İslam Bilgi Kartları**: Horizontal scroll (Tarihte Bugün, Peygamber Hikmeti, Bilgi Serisi, Sahabe Hayatı) → detail page
5. **Zikir Sayacı**: 8 dhikr types, tap counter, vibration feedback
6. **Günlük İbadet Takibi**: Checkboxes (Namaz/Kuran/Sadaka/Zikir) saved to MongoDB
7. **Ramazan Mini**: İftar countdown + link to full Ramazan page
8. **Namaz Vakitleri**: 6 prayer times for selected city
9. **Hocaya Sor CTA**: 12 scholars, "Soru Sor" button
10. **Sesli Komut**: Mic button, Web Speech API, 9 Turkish commands

## Scholars (12 total)
Nihat Hatipoğlu, Hayrettin Karaman, Mustafa İslamoğlu, Diyanet, Ömer Nasuhi Bilmen, Elmalılı Hamdi Yazır, Said Nursi, Mehmet Okuyan, Süleyman Ateş, Yaşar Nuri Öztürk, Cübbeli Ahmet, Ali Erbaş

## Other Pages
- Ramazan: İftar countdown, Sahur, Dua, Ayet, Hadis, Sadaka, Teravih
- Kur'an: 114 sure, Arapça+Türkçe, sesli okuma
- Hadis: 9 kategori, rastgele hadis
- Quiz: Bilgi yarışması
- AI Sohbet: Claude ile İslami danışman
- Ayarlar: Dil (TR/EN/AR), şehir (106+), Kıble, çıkış

## API Endpoints
- `/api/mood/{id}` - Mood-based content
- `/api/knowledge-cards` - Knowledge cards
- `/api/dhikr` - Dhikr list
- `/api/worship/track` - Track daily worship (POST, auth required)
- `/api/worship/today` - Get today's worship (GET, auth required)
- `/api/scholars` - 12 scholars
- `/api/hadith/random` - Random hadith
- `/api/quran/random` - Random verse
- `/api/prayer-times/{city}` - Prayer times

## Completed (2026-03-08)
- [x] Splash screen with animations (crescent, stars, mosque, slogan)
- [x] Google OAuth + Guest login ("Kardeşim")
- [x] 10-section Keşfet screen (mood, verse, hadith, knowledge, dhikr, worship, ramadan, prayer, scholars, voice)
- [x] Ramazan page (7 sections)
- [x] Voice command system (Web Speech API)
- [x] 12 Turkish Islamic scholars
- [x] Worship tracking with MongoDB persistence
- [x] Knowledge card detail pages
- [x] TTS for verses, share for hadith
- [x] All backend APIs tested (17/17 passed)

## Backlog
- P1: Enhanced audio player
- P2: Quran keyword search
- P2: Offline caching
- P3: Push notifications
