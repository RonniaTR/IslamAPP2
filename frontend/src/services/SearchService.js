import { db } from './firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export class SearchServiceClass {
  async search(searchQuery) {
    if (!searchQuery || searchQuery.length < 2) return { articles: [], series: [], categories: [] };
    
    try {
      // Note: Firestore doesn't support native full-text search easily.
      // This is a naive prefix search or simple tag search. 
      // For production, Algolia or Typesense is recommended, or using array-contains for keywords.
      const qText = searchQuery.toLowerCase();

      // We will search by tags or title if we create an array of lowercase words in Firestore.
      // For now, we fetch a bunch and filter client-side as a mockup of real search
      const articlesSnap = await getDocs(query(collection(db, 'articles'), limit(50)));
      const seriesSnap = await getDocs(query(collection(db, 'series'), limit(50)));
      const categoriesSnap = await getDocs(query(collection(db, 'categories'), limit(50)));

      const filterByText = (docs) => {
        return docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(d => 
            (d.title && d.title.toLowerCase().includes(qText)) || 
            (d.description && d.description.toLowerCase().includes(qText)) ||
            (d.tags && d.tags.some(t => t.toLowerCase().includes(qText)))
          );
      };

      return {
        articles: filterByText(articlesSnap.docs),
        series: filterByText(seriesSnap.docs),
        categories: filterByText(categoriesSnap.docs)
      };
    } catch (error) {
      console.error('Error in search:', error);
      return { articles: [], series: [], categories: [] };
    }
  }
}

export const SearchService = new SearchServiceClass();
