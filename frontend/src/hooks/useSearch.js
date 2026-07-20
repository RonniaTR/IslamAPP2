import { useState, useEffect } from 'react';
import { SearchService } from '../services/SearchService';

export function useSearch(query) {
  const [results, setResults] = useState({ articles: [], series: [], categories: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ articles: [], series: [], categories: [] });
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        const res = await SearchService.search(query);
        setResults(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const debounceId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(debounceId);
  }, [query]);

  return { results, loading };
}
