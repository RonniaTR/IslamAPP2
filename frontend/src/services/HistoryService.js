import { db } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export class HistoryServiceClass {
  constructor() {
    this.collectionName = 'history';
  }

  async saveProgress(userId = 'anonymous', content, progressPercentage, currentPosition = 0) {
    try {
      const historyId = `${userId}_${content.id}`;
      const docRef = doc(db, this.collectionName, historyId);
      
      const isCompleted = progressPercentage >= 95;

      await setDoc(docRef, {
        userId,
        contentId: content.id,
        type: content.type || 'article',
        title: content.title,
        slug: content.slug,
        image: content.coverImage || content.image || '',
        progress: progressPercentage, // 0 to 100
        currentPosition: currentPosition, // scroll Y or audio seconds
        isCompleted,
        lastAccessedAt: new Date()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  async getRecentHistory(userId = 'anonymous', limitCount = 5) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('isCompleted', '==', false),
        orderBy('lastAccessedAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }
}

export const HistoryService = new HistoryServiceClass();
