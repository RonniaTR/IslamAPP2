import { FirestoreService } from './FirestoreService';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export const CategoryService = new FirestoreService('categories');
export const ThemeService = new FirestoreService('themes');
export const SeriesService = new FirestoreService('series');
export const ArticleService = new FirestoreService('articles');
export const AudioService = new FirestoreService('audio');
export const StoryService = new FirestoreService('stories');

export class ContentServiceClass {
  async getRelatedContent(tags = [], currentId = null, limitCount = 5) {
    if (!tags.length) return [];
    try {
      // Assuming 'articles' for related content for now, can be expanded to search across multiple collections
      const articlesRef = collection(db, 'articles');
      const q = query(
        articlesRef,
        where('status', '==', 'published'),
        where('tags', 'array-contains-any', tags),
        limit(limitCount + 1) // Get extra in case we fetch currentId
      );
      
      const snapshot = await getDocs(q);
      const results = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.id !== currentId) // Exclude current article
        .slice(0, limitCount);
        
      return results;
    } catch (error) {
      console.error('Error fetching related content:', error);
      return [];
    }
  }

  async getSeriesLessons(seriesId) {
    try {
      const lessonsRef = collection(db, 'lessons');
      const q = query(
        lessonsRef,
        where('seriesId', '==', seriesId),
        where('status', '==', 'published'),
        orderBy('order', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching series lessons:', error);
      return [];
    }
  }
}

export const ContentService = new ContentServiceClass();
