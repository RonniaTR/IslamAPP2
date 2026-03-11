# IslamAPP2 - Deployment ve Test Rehberi

## İki Büyük Güncelleme Tamamlandı! 🎉

### 1. Authentic Hadith Database ✅
- **30 gerçek hadis** Sahih al-Bukhari, Sahih Muslim, Tirmizi, Abu Dawud, Nasai, Ibn Majah kaynaklarından
- Arapça metin + Türkçe + İngilizce çeviriler
- Kaynak referansı (kitap adı, hadis numarası, ravi)
- Sahihlik derecesi (Sahih, Hasen)
- Kategori ve tema sistemi
- Kaynak ve kategori bazında filtreleme
- Çoklu dil desteği

### 2. AI İslami Danışman - Production Ready ✅
- **OpenAI GPT-4 entegrasyonu** ile gerçek AI yanıtları
- **Rate limiting**: Kullanıcı başına saatte 50 istek
- **Güvenlik**: Input validation, yasaklı kelime filtreleme
- **Kaynak çıkarma**: Kuran ayetleri ve hadis referansları otomatik tespit
- **Konuşma geçmişi**: Bağlamsal diyalog desteği
- Firebase Authentication entegrasyonu
- Firestore loglama ve analytics

---

## Deployment Adımları

### 1. Backend API (Hadith Endpoint)

Backend'de yeni hadis endpoint'i eklendi:
- `GET /api/hadiths` - Tüm hadisleri getir
- `GET /api/hadiths/{id}` - Belirli bir hadisi getir

**Test:**
```bash
curl https://ronnia.pythonanywhere.com/api/hadiths | jq
```

**PythonAnywhere'e Deploy:**
```bash
cd /workspaces/IslamAPP2/backend
# Data dosyasını upload et
scp data/hadiths.json ronnia@ssh.pythonanywhere.com:~/IslamAPP2/backend/data/

# Server'ı restart et
# PythonAnywhere web interface'den "Reload" butonuna bas
```

### 2. Firebase Cloud Functions (AI Chat)

**Prerequisites:**
- Firebase CLI yüklü (`npm install -g firebase-tools`)
- Firebase projesine erişim
- OpenAI API Key

**Setup:**
```bash
cd /workspaces/IslamAPP2/functions

# 1. Dependencies yükle
npm install

# 2. Firebase'e giriş yap
firebase login

# 3. Firebase projesini ayarla
firebase use --add
# Projenizi seçin

# 4. OpenAI API anahtarını ekle
firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"

# 5. Deploy et
npm run deploy
```

**Deployment sonrası:**
- Function URL'ini not edin
- Firebase Console > Functions'dan logs kontrol edin
- Test isteği gönderin

### 3. Mobile App

**Dependencies kontrol:**
```bash
cd /workspaces/IslamAPP2/mobile
npm install
```

**Test:**
```bash
# Metro bundler başlat
npx expo start

# Expo Go'dan QR kod tara
# veya
npx expo start --tunnel
```

---

## Test Checklist

### Hadith Sistemi ✓
- [ ] HadithScreen açılıyor mu?
- [ ] Hadisler listeniyor mu?
- [ ] Kategori filtresi çalışıyor mu?
- [ ] Kaynak filtresi çalışıyor mu?
- [ ] Arama özelliği çalışıyor mu?
- [ ] Hadith detay sayfası açılıyor mu?
- [ ] Arapça, Türkçe, İngilizce metinler gösteriliyor mu?
- [ ] Kaynak bilgileri (ravi, kaynak, numara) gösteriliyor mu?
- [ ] Sahihlik derecesi gösteriliyor mu?
- [ ] TTS (dinleme) çalışıyor mu?
- [ ] Kopyalama özelliği çalışıyor mu?
- [ ] Not kaydetme çalışıyor mu?

### AI Chat Sistemi ✓
- [ ] AiChatScreen açılıyor mu?
- [ ] Giriş yapmayan kullanıcıya uyarı gösteriliyor mu?
- [ ] Mesaj gönderme çalışıyor mu?
- [ ] AI yanıt alınıyor mu?
- [ ] Loading durumu gösteriliyor mu?
- [ ] Kaynak badge'leri gösteriliyor mu? (Kuran, Hadis)
- [ ] Konuşma geçmişi korunuyor mu?
- [ ] Sohbet temizleme çalışıyor mu?
- [ ] Rate limit uyarısı çalışıyor mu?
- [ ] Error handling çalışıyor mu?

---

## Environment Variables

### Backend (.env)
```env
# Mevcut environment variables
MONGODB_URI=...
GOOGLE_OAUTH_CLIENT_ID=...
...
```

### Firebase Functions
```bash
firebase functions:config:set openai.key="sk-..."
```

### Mobile App
Firebase config zaten mevcut (`firebase.js`)

---

## Troubleshooting

### Hadith Sistemi

**Problem**: Hadisler yüklenmiyor
```bash
# Backend'i kontrol et
curl https://ronnia.pythonanywhere.com/api/hadiths

# Dosya var mı?
ls backend/data/hadiths.json

# Backend logs kontrol et
tail -f backend/logs/server.log
```

**Problem**: Türkçe karakterler bozuk
- `hadiths.json` UTF-8 encoding'de mi?
- Backend response header'da `charset=utf-8` var mı?

### AI Chat Sistemi

**Problem**: AI yanıt gelmiyor
```bash
# Firebase Functions logs
firebase functions:log

# OpenAI API anahtarı doğru mu?
firebase functions:config:get openai.key
```

**Problem**: Rate limit hemen devreye giriyor
```bash
# Firestore'da rateLimits collection'ını temizle
# Firebase Console > Firestore > rateLimits > Delete all
```

**Problem**: Kaynak badge'leri gösterilmiyor
- AI yanıtında kaynak var mı? (regex çalışıyor mu?)
- Console logs kontrol et

---

## Monitoring

### Backend Monitoring
```bash
# PythonAnywhere logs
tail -f ~/IslamAPP2/backend/logs/server.log
```

### Firebase Functions Monitoring
```bash
# Real-time logs
firebase functions:log --only aiChat
```

### Mobile App Debugging
```bash
# React Native logs
npx react-native log-ios
# veya
npx react-native log-android
```

---

## Cost Optimization

### OpenAI API Costs
- GPT-4: ~$0.03 per 1K tokens (expensive)
- GPT-3.5-turbo: ~$0.002 per 1K tokens (ekonomik)

**Recommendation**: Production'da GPT-3.5-turbo kullan
```javascript
// functions/index.js
model: 'gpt-3.5-turbo', // Change from 'gpt-4'
```

### Firebase Functions Costs
- İlk 2M invocation/ay ücretsiz
- Sonrası $0.40 per 1M invocation
- Egress data charges

**Recommendation**: Rate limiting'i aktif tut

---

## Security Checklist

- [x] Rate limiting aktif
- [x] Input validation
- [x] Authentication required
- [x] Content moderation
- [x] Error messages sanitized
- [x] API keys env variable'da
- [ ] Firestore security rules güncelle
- [ ] CORS settings kontrol et

---

## Next Steps (Optional)

1. **Hadith Database Expansion**
   - Daha fazla hadis ekle (hedef: 500-1000 hadis)
   - Hadis koleksiyonları ekle (Kütüb-i Sitte)
   - Tahrij bilgileri ekle

2. **AI Improvements**
   - Custom fine-tuned model
   - RAG (Retrieval Augmented Generation) ekle
   - Scholar-specific responses
   - Multi-language support

3. **Analytics**
   - Most asked questions
   - User engagement metrics
   - Error rate monitoring

---

## Support

Sorular için:
- Email: support@islamapp.com
- GitHub Issues: github.com/RonniaTR/IslamAPP2/issues

---

**Version**: 2.0.0
**Last Updated**: March 10, 2026
**Author**: AI Assistant + Developer Team
