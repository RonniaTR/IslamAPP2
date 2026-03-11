# IslamAPP Firebase Cloud Functions

Bu dizin IslamAPP için Firebase Cloud Functions'ları içerir.

## Özellikler

### AI Chat Function (`aiChat`)
- ✅ OpenAI GPT-4 entegrasyonu ile İslami rehberlik
- ✅ Rate limiting (kullanıcı başına saatte 50 istek)
- ✅ İçerik moderasyonu ve güvenlik
- ✅ Kaynak çıkarma (Kuran ayetleri, hadisler)
- ✅ Konuşma geçmişi desteği
- ✅ Firebase Authentication entegrasyonu
- ✅ Firestore loglama

### Security
- Kullanıcı kimlik doğrulaması zorunlu
- Rate limiting ile kötüye kullanım önleme
- Input validation ve sanitization
- Yasaklı kelime filtreleme
- Mesaj uzunluk sınırı (2000 karakter)

## Kurulum

1. Dependencies yükleyin:
```bash
cd functions
npm install
```

2. Firebase CLI yükleyin (global):
```bash
npm install -g firebase-tools
```

3. Firebase'e giriş yapın:
```bash
firebase login
```

4. Firebase projenizi başlatın:
```bash
firebase init functions
```

5. OpenAI API anahtarını environment variable olarak ekleyin:
```bash
firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
```

## Deployment

Production'a deploy:
```bash
npm run deploy
```

Sadece belirli bir function deploy:
```bash
firebase deploy --only functions:aiChat
```

## Local Development

Functions emulator başlatın:
```bash
npm run serve
```

Bu, local'de test edebileceğiniz bir endpoint açar:
- `http://localhost:5001/YOUR_PROJECT_ID/us-central1/aiChat`

## Environment Variables

Gerekli environment variables:

- `OPENAI_API_KEY`: OpenAI API anahtarı (GPT-4 erişimi için)

Firebase Functions config ile ekleyin:
```bash
firebase functions:config:set openai.key="sk-..."
```

Local test için `.env` dosyası:
```
OPENAI_API_KEY=sk-...
```

## Usage

### Mobile App'ten Çağırma

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const aiChat = httpsCallable(functions, 'aiChat');

const response = await aiChat({
  message: 'Namaz kılmanın önemi nedir?',
  conversationHistory: [
    { role: 'user', content: 'Selam' },
    { role: 'assistant', content: 'Aleyküm selam, size nasıl yardımcı olabilirim?' }
  ]
});

console.log(response.data);
// {
//   success: true,
//   message: "...",
//   sources: [...],
//   timestamp: 1234567890
// }
```

## Rate Limiting

- Kullanıcı başına saatte 50 istek
- Limit aşılırsa `resource-exhausted` hatası döner
- Rate limit data'sı 7 gün sonra otomatik temizlenir

## Monitoring

Firebase Console'dan function logs'ları görüntüleyin:
```bash
npm run logs
```

Veya Firebase Console > Functions > Logs

## Cost Optimization

1. OpenAI model seçimi:
   - `gpt-4`: Daha kaliteli, daha pahalı
   - `gpt-3.5-turbo`: Hızlı ve ekonomik

2. Token limitleri:
   - Default: 1000 max_tokens
   - Gerekirse azaltın

3. Conversation history limiti:
   - Son 10 mesaj tutulur
   - Daha fazlası maliyet artırır

## Troubleshooting

### "OpenAI API Key not found"
```bash
firebase functions:config:set openai.key="YOUR_KEY"
```

### Rate limit çalışmıyor
Firestore'da `rateLimits` collection'ının rule'larını kontrol edin.

### Functions deploy edilmiyor
```bash
firebase deploy --only functions --debug
```

## License

MIT
