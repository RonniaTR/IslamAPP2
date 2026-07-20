# İslami Yaşam Asistanı - PRD

## Architecture
- Frontend: React 18 + TailwindCSS (PWA, mobile-first 430px)
- Backend: Python/FastAPI
- Database: MongoDB
- AI: Claude Sonnet 4.5 via Emergent LLM Key
- TTS: OpenAI TTS via Emergent LLM Key
- Auth: Emergent Google OAuth + Guest Login

## PWA Features
- manifest.json with app name, icons, theme
- Service Worker (sw.js) for caching + push notifications
- Install prompt ("Ana ekranına ekle")
- ErrorBoundary for crash prevention
- Safe area padding for notched devices
- Standalone display mode
- Offline-first caching strategy

## Design: Dark green (#0A1F14) + Gold (#D4AF37) + Cream (#F5F5DC)

## Core Features
### Dashboard (Keşfet - 10 Sections)
### Quiz System (300 questions, 10 categories, leaderboard)
### Quran Reader (search, AI kıssa, tefsir, notes)
### Notes System (ayah + kıssa favorites, filter, CRUD)
### Scholars Page (12 Turkish scholars)
### Push Notifications (Service Worker)
### Voice Commands (Web Speech API, Turkish)

## Completed (2026-03-08)
- [x] PWA: manifest.json, sw.js, install prompt, meta tags
- [x] ErrorBoundary for crash prevention
- [x] Google OAuth login active
- [x] Guest login active
- [x] Quiz: 300 questions, 10 categories, Trivia Crack UI
- [x] Leaderboard system
- [x] Quran search, AI Kıssa, Notes CRUD
- [x] Push notifications (Service Worker + toggle)
- [x] Voice commands (Web Speech API)
- [x] Safe area + viewport-fit for mobile

## Backlog
- P1: TTS budget recharge (user must add funds)
- P2: 200+ more quiz questions (reach 500)
- P2: Offline quiz data caching
- P3: server.py refactoring into modules
- P3: Enhanced Quran audio background playback
