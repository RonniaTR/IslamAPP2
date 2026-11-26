import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { buluttanSenkronla, toplamPuan } from './kazanim';

export class UserServiceClass {
  // Veritabanında kullanıcıyı yaratır veya bilgilerini günceller (Gmail/Apple giriş kaydı + Sevap Points senkronu)
  async createOrUpdateUser(firebaseUser) {
    if (!firebaseUser) return null;
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      const userData = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Yeni Kullanıcı'),
        email: firebaseUser.email || '',
        provider: (firebaseUser.providerData && firebaseUser.providerData[0]?.providerId) || 'google.com',
        // Fotoğraf yoksa boş kalır: kimlik numarası üçüncü taraf avatar servisine gönderilmez (gizlilik).
        avatarUrl: firebaseUser.photoURL || '',
        lastLogin: new Date().toISOString(),
      };

      let result;
      if (!userSnap.exists()) {
        // Yeni kayıt, default XP ve statlar + mevcut Sevap Points
        userData.title = 'İlim Yolcusu';
        userData.xp = 0;
        userData.level = 1;
        userData.streak = 0;
        userData.totalBadges = 0;
        userData.sevapPoints = toplamPuan();
        userData.createdAt = new Date().toISOString();
        await setDoc(userRef, userData, { merge: true });
        result = { id: firebaseUser.uid, ...userData };
      } else {
        // Eski kayıt, bilgileri (son giriş vs) güncelle
        await setDoc(userRef, userData, { merge: true });
        result = { id: firebaseUser.uid, ...userSnap.data(), ...userData };
      }
      await buluttanSenkronla(firebaseUser.uid);
      return result;
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error);
      return null;
    }
  }

  // Profil Ekranı için XP ve detayları çeker
  async getUserProfile(userId) {
    if (!userId || userId === 'anonymous') {
      return { id: 'anonymous', name: 'Misafir', xp: 0, level: 1, streak: 0, title: 'Misafir Yolcu' };
    }
    
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  }

  // Oyun modu vb. XP kazanıldığında çağrılır
  async addXPToUser(userId, xpGained) {
    if (!userId || userId === 'anonymous') return null;

    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const currentData = userSnap.data();
        const currentXp = currentData.xp || 0;
        const currentLevel = currentData.level || 1;
        
        const newXp = currentXp + xpGained;
        const nextLevelXP = currentLevel * 1000;
        
        // Seviye atlama kontrolü
        let newLevel = currentLevel;
        if (newXp >= nextLevelXP) {
          newLevel += 1;
        }

        await updateDoc(userRef, {
          xp: newXp,
          level: newLevel
        });

        return { xp: newXp, level: newLevel, leveledUp: newLevel > currentLevel };
      }
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  }

  async getWorshipStats(userId) {
    if (!userId || userId === 'anonymous') {
      return [
        { id: 'quran', label: "Kur'an", percent: 0, color: "bg-[#10b981]" },
        { id: 'hadith', label: "Hadis", percent: 0, color: "bg-[#f59e0b]" },
        { id: 'dua', label: "Dua", percent: 0, color: "bg-purple-500" },
        { id: 'namaz', label: "Namaz", percent: 0, color: "bg-orange-500" }
      ];
    }

    try {
      // Import dynamically to prevent circular dependencies if any
      const { HistoryService } = await import('./HistoryService');
      const history = await HistoryService.getRecentHistory(userId, 200);
      
      const quranCount = history.filter(h => h.type === 'quran').length;
      const hadithCount = history.filter(h => h.type === 'hadith' || h.id?.includes('hadith') || h.contentId?.includes('hadith')).length;
      const duaCount = history.filter(h => h.type === 'dua').length;
      const audioCount = history.filter(h => h.type === 'audio').length;

      // Map counts to a visual percentage (e.g., 1 item = 10%, max 100%)
      return [
        { id: 'quran', label: "Kur'an", percent: Math.min(quranCount * 10, 100), color: "bg-[#10b981]" },
        { id: 'hadith', label: "Hadis", percent: Math.min(hadithCount * 10, 100), color: "bg-[#f59e0b]" },
        { id: 'dua', label: "Dua", percent: Math.min(duaCount * 10, 100), color: "bg-purple-500" },
        { id: 'audio', label: "Dinleme", percent: Math.min(audioCount * 10, 100), color: "bg-orange-500" }
      ];
    } catch (e) {
      console.error('Error computing worship stats', e);
      return [
        { id: 'quran', label: "Kur'an", percent: 0, color: "bg-[#10b981]" },
        { id: 'hadith', label: "Hadis", percent: 0, color: "bg-[#f59e0b]" },
        { id: 'dua', label: "Dua", percent: 0, color: "bg-purple-500" },
        { id: 'namaz', label: "Namaz", percent: 0, color: "bg-orange-500" }
      ];
    }
  }

  async getLearningJourney(userId) {
    // Önceki sürüm herkese aynı sabit yüzdeleri döndürüyordu (İlmihal %100, Namaz Rehberi %80…).
    // Gerçek ilerleme kaynağı bağlanana kadar boş döner; ekran bölümü gizler.
    return [];
  }
}

export const UserService = new UserServiceClass();
