import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { CategoryService, SeriesService, AudioService, ArticleService } from './ContentService';
import { HistoryService } from './HistoryService';

export class DiscoverServiceClass {
  async _harvestMissingData() {
    try {
      const { setDoc } = require('firebase/firestore');
      
      // Auto-harvest mock rich data if db is empty
      const articleId = 'article_harvest_' + Date.now();
      await setDoc(doc(db, 'articles', articleId), {
        title: "Peygamber Efendimizin Hayatından Notlar",
        description: "Merhamet ve adalet timsali Hz. Muhammed (s.a.v) hayatı.",
        coverImage: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80",
        difficulty: "beginner",
        isPremium: false,
        status: "published",
        createdAt: new Date().toISOString()
      });

      const seriesId = 'series_harvest_' + Date.now();
      await setDoc(doc(db, 'series', seriesId), {
        title: "Ramazan Günlükleri",
        description: "Ramazan ayını dolu dolu geçirmek için 30 günlük rehber.",
        coverImage: "https://images.unsplash.com/photo-1590076214842-88f5fceb893d?auto=format&fit=crop&q=80",
        status: "published"
      });

      const audioId = 'audio_harvest_' + Date.now();
      await setDoc(doc(db, 'audio', audioId), {
        title: "Kabe İmamından Kalp Titreten Kıraat",
        narrator: "Mahir el-Muaykili",
        audioUrl: "https://example.com/audio.mp3",
        coverImage: "https://images.unsplash.com/photo-1564683214965-3619addd900d?auto=format&fit=crop&q=80",
        status: "published"
      });
      
      console.log("🌱 Data Harvester: Eksik veriler internetten (simüle) çekilip Firestore'a kaydedildi!");
    } catch (e) {
      console.error("Harvester failed", e);
    }
  }

  async getDiscoverFeed(userId = 'anonymous') {
    try {
      let categories = await CategoryService.getPublished(20);
      let recommended = await ArticleService.getPublished(5);
      let series = await SeriesService.getPublished(5);
      let audio = await AudioService.getPublished(10);
      
      // 🚀 DATA HARVESTING ENGINE TRIGGER
      // If our database is poor, harvest data from the web (simulated) and expand our DB.
      if (recommended.length === 0 || series.length === 0 || audio.length === 0) {
        await this._harvestMissingData();
        // Re-fetch after harvesting
        recommended = await ArticleService.getPublished(5);
        series = await SeriesService.getPublished(5);
        audio = await AudioService.getPublished(10);
      }

      // Popular Today
      let popular = [];
      try {
        const popularQuery = query(
          collection(db, 'articles'),
          where('status', '==', 'published'),
          limit(5)
        );
        const popularSnapshot = await getDocs(popularQuery);
        popular = popularSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) { console.warn('Popular query failed, index maybe missing.', e) }

      // Continue Learning
      let continueLearning = [];
      try {
        const continueLearningRaw = await HistoryService.getRecentHistory(userId, 5);
        continueLearning = continueLearningRaw.map(history => ({
          id: history.contentId,
          type: history.type,
          title: history.title,
          slug: history.slug,
          image: history.image,
          progress: history.progress || 0,
          isContinue: true
        }));
      } catch (e) {}

      // Return the unified feed format
      return {
        continueLearning: continueLearning,
        forYou: recommended,
        popular: popular,
        dailyFacts: [],
        ongoingSeries: series,
        audioContents: audio,
        stories: [], 
        premium: [],
        categories: categories
      };
    } catch (error) {
      console.error('Error fetching discover feed from Firestore:', error);
      throw error;
    }
  }
}

export const DiscoverService = new DiscoverServiceClass();
