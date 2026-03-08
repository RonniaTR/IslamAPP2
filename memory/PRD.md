# İslami Yaşam Asistanı - PRD

## Architecture
- Frontend: React 18 + TailwindCSS (mobile-first 430px)
- Backend: Python/FastAPI (server.py monolith)
- Database: MongoDB
- TTS: OpenAI TTS HD (onyx male voice) via Emergent LLM Key
- AI: Anthropic Claude Sonnet 4.5 via Emergent LLM Key (kıssa generation)
- Auth: Emergent Google OAuth + Guest Login

## Design: Dark green (#0A1F14) + Gold (#D4AF37) + Cream (#F5F5DC)

## Core Features

### Keşfet Screen (Dashboard - 10 Sections)
1. Mood cards (horizontal scroll + TTS + Share)
2. Günün Ayeti (Arabic + Turkish + TTS)
3. Günün Hadisi (Arabic + Turkish + TTS)
4. İslam Bilgi Hazinesi (108+ items, 8 categories)
5. Zikir Sayacı (8 dhikr types)
6. Günlük İbadet Takibi (checkboxes, MongoDB)
7. Ramazan Mini (iftar countdown)
8. Namaz Vakitleri (6 prayers)
9. Hocaya Sor (12 scholars)
10. Sesli Komut (Web Speech API)

### Quiz System (Trivia Crack Style) - NEW
- 300 questions across 10 categories
- Categories: Kur'an (58), Peygamberler (26), Sahabe (25), Tarih (26), Hadis (25), Namaz (25), Ramazan (20), Fıkıh (20), Medeniyet (20), Genel (55)
- Quick Play (mixed 15 questions)
- Timer countdown (15s per question)
- Streak bonus system
- Animated feedback (correct/wrong)
- Confetti on completion
- Difficulty levels (easy/medium/hard)
- Score based on difficulty + speed
- Global leaderboard with Google login names
- Result screen with A+/A/B/C grading

### Quran Reader
- 114 surahs with Arabic + Turkish
- Keyword search across all verses
- AI Kıssa generation per verse (Claude Sonnet)
- Tefsir from multiple scholars
- Per-verse actions: Kıssa, Save, Copy, Share, Play

### Notes System
- Save favorite ayets and kıssas
- Filter by type (Tümü/Ayetler/Kıssalar)
- Copy/Share/Delete actions
- Navigate to source surah

### Scholars Page
- 12 Turkish scholars with redesigned UI

### Push Notifications
- Service worker registered at /sw.js
- Toggle in Settings page
- Daily knowledge card notifications

### Voice Commands
- Web Speech API (Turkish)
- Commands: kuran, hadis, quiz, namaz, ayar, not

## API Endpoints
- POST /api/auth/guest, POST /api/auth/google
- GET /api/quiz/categories, GET /api/quiz/leaderboard
- POST /api/quiz/solo/start, /answer, /finish
- POST /api/quiz/solo/start-mixed
- POST /api/tafsir/kissa - AI kıssa generation
- GET/POST/DELETE /api/notes
- GET /api/quran/search?query=
- POST /api/tts
- GET /api/knowledge-cards, /api/mood, /api/dhikr

## Completed (2026-03-08)
- [x] Quiz redesign: 300 questions, 10 categories, Trivia Crack UI
- [x] Leaderboard with Google login names
- [x] Timer, streak, scoring, confetti animations
- [x] Quick play (mixed questions)
- [x] Quran keyword search (frontend + backend)
- [x] AI Kıssa generation per verse (Claude Sonnet 4.5)
- [x] Notes/Favorites system with CRUD + filters
- [x] Push notifications (Service Worker + Settings toggle)
- [x] Voice commands (Web Speech API, Turkish)
- [x] Fixed LlmChat integration (with_model API)
- [x] Fixed Notes BSON Cookie serialization bug

## Backlog
- P1: TTS budget recharge needed (user must add funds)
- P2: Add 200+ more quiz questions to reach 500
- P2: Offline quiz caching
- P3: server.py refactoring into modules
- P3: Enhanced Quran audio player with background playback
