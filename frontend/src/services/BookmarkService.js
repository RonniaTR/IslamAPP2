import { db } from './firebase';
import { collection, query, where, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';

export class BookmarkServiceClass {
  constructor() {
    this.collectionName = 'bookmarks';
  }

  async getBookmarks(userId = 'anonymous') {
    try {
      const q = query(collection(db, this.collectionName), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  }

  async isBookmarked(userId = 'anonymous', contentId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('contentId', '==', contentId)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
  }

  async toggleBookmark(userId = 'anonymous', content) {
    try {
      const bookmarkId = `${userId}_${content.id}`;
      const docRef = doc(db, this.collectionName, bookmarkId);
      
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('contentId', '==', content.id)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        // Remove bookmark
        await deleteDoc(docRef);
        return false; // Not bookmarked anymore
      } else {
        // Add bookmark
        await setDoc(docRef, {
          userId,
          contentId: content.id,
          type: content.type || 'article',
          title: content.title,
          slug: content.slug,
          timestamp: new Date()
        });
        return true; // Bookmarked
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }
}

export const BookmarkService = new BookmarkServiceClass();
