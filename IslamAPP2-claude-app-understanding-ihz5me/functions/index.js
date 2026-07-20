const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firebase Admin
admin.initializeApp();

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 50, // Max requests per user per hour
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
};

const AI_MODEL = functions.config().openai?.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_HISTORY_MESSAGES = 10;

// OpenAI Configuration (will use environment variable)
const OPENAI_API_KEY = functions.config().openai?.key || process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Check rate limit for a user
 * Returns true if user is within limit, false if exceeded
 */
async function checkRateLimit(userId) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;
  
  const rateLimitRef = admin.firestore()
    .collection('rateLimits')
    .doc(userId);
  
  const doc = await rateLimitRef.get();
  
  if (!doc.exists) {
    // First request
    await rateLimitRef.set({
      requests: [now],
      updatedAt: now
    });
    return true;
  }
  
  const data = doc.data();
  // Filter out requests outside the window
  const recentRequests = (data.requests || []).filter(timestamp => timestamp > windowStart);
  
  if (recentRequests.length >= RATE_LIMIT.maxRequests) {
    return false; // Rate limit exceeded
  }
  
  // Add current request
  recentRequests.push(now);
  await rateLimitRef.update({
    requests: recentRequests,
    updatedAt: now
  });
  
  return true;
}

/**
 * Moderate user input for inappropriate content
 * Returns { allowed: boolean, reason: string }
 */
function moderateInput(message) {
  const bannedWords = [
    // Add Turkish and English banned words here
    'küfür', 'hakaret', // Example banned words
  ];
  
  const lowerMessage = message.toLowerCase();
  
  for (const word of bannedWords) {
    if (lowerMessage.includes(word)) {
      return {
        allowed: false,
        reason: 'Uygunsuz içerik tespit edildi. Lütfen saygılı bir dil kullanın.'
      };
    }
  }
  
  // Check message length
  if (message.length > 2000) {
    return {
      allowed: false,
      reason: 'Mesaj çok uzun. Lütfen 2000 karakterden kısa bir mesaj gönderin.'
    };
  }
  
  return { allowed: true };
}

function normalizeConversationHistory(conversationHistory = []) {
  if (!Array.isArray(conversationHistory)) {
    return [];
  }

  return conversationHistory
    .filter((item) => item && typeof item.content === 'string' && ['user', 'assistant'].includes(item.role))
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({
      role: item.role,
      content: item.content.slice(0, 2000),
    }));
}

/**
 * Generate AI response using OpenAI
 */
async function generateAIResponse(userMessage, conversationHistory = []) {
  try {
    if (!OPENAI_API_KEY) {
      return {
        success: false,
        message: 'AI servisi henüz yapılandırılmadı. Lütfen daha sonra tekrar deneyin.',
        error: 'OPENAI_API_KEY missing'
      };
    }

    // System prompt for Islamic guidance
    const systemPrompt = `Sen İslami konularda yardımcı olan bir yapay zeka asistanısın. 
Görevin kullanıcılara Kuran ve Sünnet çerçevesinde doğru ve güvenilir bilgiler vermektir.

İlkeler:
1. Kaynak belirtmeye özen göster (Kuran ayeti, hadis, alim görüşü)
2. Farklı mezhep ve alim görüşleri varsa belirt
3. Fetva vermekten kaçın, yerel alimlere yönlendir
4. Saygılı ve hikmetli bir dil kullan
5. Bilmediğin konularda "Detaylı bilgi için yetkili bir alime danışmanızı öneririm" de

Kaynak Kullanımı:
- Kuran ayetleri: Sure adı ve ayet numarası
- Hadisler: Kaynak kitap (Buhari, Muslim, vb.) ve hadis numarası
- Alim görüşleri: Alim adı ve kaynak

Cevaplarını Türkçe ver ve mümkün olduğunca net ve anlaşılır ol.`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt }
    ];
    
    // Add conversation history (limited to last 10 messages)
    const recentHistory = normalizeConversationHistory(conversationHistory);
    messages.push(...recentHistory);
    
    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    // Call OpenAI API
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: AI_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    
    return {
      success: true,
      message: aiMessage,
      sources: extractSources(aiMessage)
    };

  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    
    // Fallback response
    return {
      success: false,
      message: 'Şu anda yapay zeka hizmetine erişilemiyor. Lütfen daha sonra tekrar deneyin.',
      error: error.message
    };
  }
}

/**
 * Extract sources from AI response
 * Looks for Quran references, hadith references, and scholar names
 */
function extractSources(text) {
  const sources = [];
  
  // Extract Quran references (e.g., "Bakara 255", "Al-Baqarah 2:255")
  const quranRegex = /(?:Kuran|Kur'an|Quran|Sure)?\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s-]+)\s*(?:suresi|Suresi)?\s*(\d+)(?::(\d+))?/gi;
  let match;
  while ((match = quranRegex.exec(text)) !== null) {
    sources.push({
      type: 'quran',
      surah: match[1].trim(),
      verse: match[2],
      detail: match[3] || null
    });
  }
  
  // Extract hadith references
  const hadithRegex = /(Buhari|Muslim|Tirmizi|Ebu Davud|Nasai|İbn Mace)[,\s]+(?:Hadis|hadis)?\s*(?:No:|no:)?\s*(\d+)/gi;
  while ((match = hadithRegex.exec(text)) !== null) {
    sources.push({
      type: 'hadith',
      source: match[1],
      number: match[2]
    });
  }
  
  return sources;
}

/**
 * Main Cloud Function: AI Chat Endpoint
 * Handles user messages and returns AI-generated Islamic guidance
 */
exports.aiChat = functions.https.onCall(async (data, context) => {
  try {
    // Check authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Kullanıcı girişi gerekli'
      );
    }

    const userId = context.auth.uid;
    const { message, conversationHistory = [] } = data;
    const normalizedMessage = typeof message === 'string' ? message.trim() : '';

    // Validate input
    if (!normalizedMessage) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Geçerli bir mesaj gönderin'
      );
    }

    // Check rate limit
    const withinLimit = await checkRateLimit(userId);
    if (!withinLimit) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        `Çok fazla istek gönderdiniz. Lütfen ${RATE_LIMIT.windowMs / 60000} dakika sonra tekrar deneyin.`
      );
    }

    // Moderate input
    const moderation = moderateInput(normalizedMessage);
    if (!moderation.allowed) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        moderation.reason
      );
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(normalizedMessage, conversationHistory);

    if (!aiResponse.success) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        aiResponse.message
      );
    }

    // Log conversation to Firestore (for analytics and improvement)
    await admin.firestore().collection('aiConversations').add({
      userId,
      userMessage: normalizedMessage,
      aiMessage: aiResponse.message,
      sources: aiResponse.sources || [],
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: aiResponse.success
    });

    return {
      success: true,
      message: aiResponse.message,
      sources: aiResponse.sources || [],
      timestamp: Date.now()
    };

  } catch (error) {
    console.error('AI Chat function error:', error);
    
    // Return user-friendly error
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    );
  }
});

/**
 * Cleanup function: Remove old rate limit data
 * Runs daily at midnight
 */
exports.cleanupRateLimits = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    const now = Date.now();
    const expiryTime = now - (7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    const snapshot = await admin.firestore()
      .collection('rateLimits')
      .where('updatedAt', '<', expiryTime)
      .get();
    
    const batch = admin.firestore().batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`Cleaned up ${snapshot.size} old rate limit records`);
    return null;
  });
